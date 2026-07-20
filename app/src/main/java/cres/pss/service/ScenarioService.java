package cres.pss.service;

import java.io.*;
import java.util.*;
import java.util.concurrent.TimeUnit;
import javax.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * 시나리오 생성 오케스트레이터
 *
 * 책임:
 *  - SSE 스트리밍 흐름 제어
 *  - 각 전담 서비스 호출 및 결과 조합
 *  - DB 저장 / 조회 위임 (ScenarioDao, TcGenHistDao)
 *
 * 위임 대상:
 *  MenuResolverService  — 메뉴 DB 조회, 팝업 부모 역추적, gnb/group 분해
 *  ScenarioBuilderService — xfdl 파싱 → 시나리오 조립
 *  ScenarioExcelService — 엑셀 업로드/다운로드
 */
@Service
public class ScenarioService {

    @Autowired private ScenarioBuilderService  scenarioBuilder;
    @Autowired private MenuResolverService     menuResolver;
    @Autowired private ScenarioExcelService    scenarioExcel;
    @Autowired private ScenarioDao             scenarioDao;
    @Autowired private TcGenHistDao            tcGenHistDao;
    @Autowired private PurTestCodeGenService   purTestCodeGen;

    // ── 시나리오 생성 (SSE 스트리밍) ─────────────────────────────────────────

    public void generateScenarioStream(HttpServletRequest request,
                                        HttpServletResponse response,
                                        String prefix) throws Exception {
        response.setContentType("text/event-stream;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("X-Accel-Buffering", "no");
        java.io.PrintWriter writer = response.getWriter();

        List<Map<String, Object>> checkedFiles = AiStateStore.PENDING_FILES.remove(prefix);
        if (checkedFiles == null || checkedFiles.isEmpty()) {
            writer.write("event: error\ndata: 파일 목록이 없습니다. 다시 시도하세요.\n\n");
            writer.flush();
            return;
        }

        try {
            SseHelper.sseLog(writer, "=== 시나리오 생성 시작 (" + prefix + ") | 소스 "
                + checkedFiles.size() + "개 ===");

            String nxuiBase   = FilePathHelper.getNxuiBase(request);
            String srcBase    = FilePathHelper.getSrcBase(request);
            String sqlmapBase = FilePathHelper.getSqlmapBase(request);
            File   projectRoot = resolveProjectRoot(request);
            File   outDir      = new File(FilePathHelper.getAiBaseDir(request), "excel");
            if (!outDir.exists()) outDir.mkdirs();

            SseHelper.sseLog(writer, "[경로] nxui: " + nxuiBase);
            SseHelper.sseLog(writer, "[경로] sql : " + sqlmapBase);
            if (!new File(nxuiBase).exists())
                SseHelper.sseLog(writer, "⚠ 주의: nxui 경로가 존재하지 않습니다.");

            // ── 접두어별 그룹화 ──────────────────────────────────────────────
            Map<String, List<Map<String, Object>>> byPrefix = groupByPrefix(checkedFiles);
            SseHelper.sseLog(writer, "[라우팅] 접두어 그룹: " + byPrefix.keySet());

            List<Map<String, Object>> allScenarios = new ArrayList<>();
            Map<String, String>       allMenuMap   = new LinkedHashMap<>();

            for (Map.Entry<String, List<Map<String, Object>>> entry : byPrefix.entrySet()) {
                String pfx      = entry.getKey();
                List<Map<String, Object>> pfxFiles = entry.getValue();
                File   script   = new File(projectRoot,
                    "copilot_info/generate_" + pfx + "_scenarios.py");

                if (script.exists()) {
                    // ── Python 경로 ─────────────────────────────────────────
                    SseHelper.sseLog(writer, "[" + pfx.toUpperCase() + "] Python → " + script.getName());
                    File excel = runPythonScript(script, projectRoot, outDir, pfx, writer);
                    if (excel != null) {
                        List<Map<String, Object>> pfxScenarios =
                            purTestCodeGen.loadRawFromExcel(excel, writer);
                        // ── 소스 필터링: 엑셀 업로드로 선택된 파일만 허용 ────────
                        pfxScenarios = filterByCheckedFiles(pfxScenarios, pfxFiles, pfx, writer);
                        SseHelper.sseLog(writer,
                            "[" + pfx.toUpperCase() + "] " + pfxScenarios.size() + "건 로드");
                        allScenarios.addAll(pfxScenarios);
                    }
                } else {
                    // ── Java fallback ────────────────────────────────────────
                    SseHelper.sseLog(writer,
                        "[" + pfx.toUpperCase() + "] Python 없음 → Java ScenarioBuilder");
                    Map<String, String> pfxMenuMap =
                        menuResolver.buildMenuMap(pfxFiles, nxuiBase, writer);
                    allMenuMap.putAll(pfxMenuMap);
                    List<Map<String, Object>> pfxScenarios = scenarioBuilder.buildScenarios(
                        pfxFiles, pfxMenuMap, nxuiBase, srcBase, sqlmapBase, pfx, writer);
                    allScenarios.addAll(pfxScenarios);
                }
            }

            // ── Python 시나리오 분 menuMap 보강 ─────────────────────────────
            List<Map<String, Object>> pyCheckedFiles = buildCheckedFilesFromScenarios(allScenarios);
            if (pyCheckedFiles.isEmpty() && !allScenarios.isEmpty()) {
                SseHelper.sseLog(writer, "⚠ [menuMap] pyCheckedFiles 빈 목록 — Excel에 소스명(pgmId) 컬럼이 없거나 값이 모두 비어있습니다. Python 생성 Excel을 확인하세요.");
                // sourceName이 없어도 checkedFiles 기반으로 menuMap 빌드 시도 (폴백)
                if (!checkedFiles.isEmpty()) {
                    SseHelper.sseLog(writer, "  → checkedFiles(" + checkedFiles.size() + "건) 폴백으로 menuMap 빌드");
                    Map<String, String> fallbackMap =
                        menuResolver.buildMenuMap(checkedFiles, nxuiBase, writer);
                    allMenuMap.putAll(fallbackMap);
                }
            } else if (!pyCheckedFiles.isEmpty()) {
                Map<String, String> pyMenuMap =
                    menuResolver.buildMenuMap(pyCheckedFiles, nxuiBase, writer);
                allMenuMap.putAll(pyMenuMap);
            }

            // ── 공통 후처리 ──────────────────────────────────────────────────
            menuResolver.enrichMenuParts(allScenarios, allMenuMap, prefix);
            menuResolver.enrichRoles(allScenarios);
            menuResolver.applyScenarioMetadata(allScenarios);

            List<Map<String, Object>> scenarios = allScenarios;

            // ── pur_patterns.json 보강 ───────────────────────────────────────
            File patternsJson = FilePathHelper.getPurPatternsJson(request);
            scenarioBuilder.enrichFromPurPatterns(scenarios, patternsJson, writer);

            AiStateStore.SCENARIO_STORE.put(prefix, scenarios);
            SseHelper.sseLog(writer, "=== 시나리오 " + scenarios.size() + "건 생성 완료 ===");

            // ── DB 저장 ──────────────────────────────────────────────────────
            try {
                String loginUser = getLoginUser(request);
                String grpId     = scenarioDao.newGrpId(prefix);
                scenarioDao.insertScenarioGroup(grpId, scenarios.size(), loginUser);
                for (int i = 0; i < scenarios.size(); i++)
                    scenarioDao.insertScenario(grpId, scenarios.get(i), i + 1);
                AiStateStore.GRP_ID_STORE.put(prefix, grpId);
                SseHelper.sseLog(writer, "[DB] 시나리오 저장 완료 — GRP_ID: " + grpId);
            } catch (Exception dbEx) {
                SseHelper.sseLog(writer, "[DB] ⚠ DB 저장 실패 (메모리는 정상): " + dbEx.getMessage());
            }

            // ── SSE done 이벤트 ──────────────────────────────────────────────
            StringBuilder jsonSb = new StringBuilder("[");
            for (int i = 0; i < scenarios.size(); i++) {
                if (i > 0) jsonSb.append(",");
                jsonSb.append(scenarioToJson(scenarios.get(i)));
            }
            jsonSb.append("]");
            // grpId 포함 — 클라이언트 currentGrpId 동기화용
            String savedGrpId = AiStateStore.GRP_ID_STORE.getOrDefault(prefix, "");
            String payload = "{\"success\":true,\"count\":" + scenarios.size()
                + ",\"grpId\":" + JsonHelper.jsonStr(savedGrpId)
                + ",\"scenarios\":" + jsonSb + "}";

            writer.write("event: done\ndata: " + SseHelper.escEvt(payload) + "\n\n");
            writer.flush();

        } catch (Exception e) {
            SseHelper.sseLog(writer, "오류: " + SseHelper.escEvt(e.getMessage()));
            writer.write("event: error\ndata: " + SseHelper.escEvt(e.getMessage()) + "\n\n");
            writer.flush();
        }
    }

    // ── 시나리오 생성 (동기) ────────────────────────────────────────────────

    public Map<String, Object> generateScenario(HttpServletRequest request,
                                                  Map<String, Object> body) throws Exception {
        String prefix = strOf(body, "prefix");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> checkedFiles =
            (List<Map<String, Object>>) body.get("checkedFiles");

        if (checkedFiles == null || checkedFiles.isEmpty())
            return fail("소스 목록이 없습니다.");

        String nxuiBase   = FilePathHelper.getNxuiBase(request);
        String srcBase    = FilePathHelper.getSrcBase(request);
        String sqlmapBase = FilePathHelper.getSqlmapBase(request);

        Map<String, String> menuMap = menuResolver.buildMenuMap(checkedFiles, request);
        List<Map<String, Object>> scenarios = scenarioBuilder.buildScenarios(
            checkedFiles, menuMap, nxuiBase, srcBase, sqlmapBase, prefix, null);
        menuResolver.enrichMenuParts(scenarios, menuMap, prefix);
        menuResolver.enrichRoles(scenarios);
        AiStateStore.SCENARIO_STORE.put(prefix, scenarios);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success",   true);
        result.put("scenarios", scenarios);
        result.put("count",     scenarios.size());
        return result;
    }

    // ── 파일 임시 저장 ───────────────────────────────────────────────────────

    public Map<String, Object> storeScenarioFiles(HttpServletRequest request,
                                                    Map<String, Object> body) {
        String prefix = strOf(body, "prefix");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> checkedFiles =
            (List<Map<String, Object>>) body.get("checkedFiles");
        if (prefix != null && checkedFiles != null)
            AiStateStore.PENDING_FILES.put(prefix, checkedFiles);
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("success", true);
        return r;
    }

    // ── DB 저장 (덮어쓰기) ────────────────────────────────────────────────────

    public Map<String, Object> saveScenariosToDB(HttpServletRequest request,
                                                   Map<String, Object> body) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            String prefix = strOf(body, "prefix");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> scenarios =
                (List<Map<String, Object>>) body.get("scenarios");

            // 클라이언트에서 scenarios 미전송 시 서버 메모리(SCENARIO_STORE) fallback
            // PUR 경로 등 JS scenarios 배열이 채워지지 않은 경우를 처리
            if (scenarios == null || scenarios.isEmpty()) {
                String storeKey = prefix.isEmpty() ? "pur" : prefix;
                scenarios = AiStateStore.SCENARIO_STORE.get(storeKey);
            }
            if (scenarios == null || scenarios.isEmpty())
                return fail("시나리오 없음 — 먼저 시나리오를 생성하세요");

            String grpId     = strOf(body, "grpId");
            if (grpId.isEmpty()) grpId = AiStateStore.GRP_ID_STORE.getOrDefault(prefix, "");
            String loginUser = getLoginUser(request);
            boolean isNew    = grpId.isEmpty();

            System.out.println("[ScenarioService] saveScenariosToDB 호출 — prefix=" + prefix
                + ", scenarioCnt=" + scenarios.size()
                + ", grpId=" + grpId
                + ", isNew=" + isNew
                + ", loginUser=" + loginUser);

            if (isNew) {
                grpId = scenarioDao.newGrpId(prefix);
                System.out.println("[ScenarioService] insertScenarioGroup 호출 — grpId=" + grpId);
                scenarioDao.insertScenarioGroup(grpId, scenarios.size(), loginUser);
                System.out.println("[ScenarioService] insertScenarioGroup 완료");
            } else {
                System.out.println("[ScenarioService] deleteScenariosByGroup 호출 — grpId=" + grpId);
                scenarioDao.deleteScenariosByGroup(grpId);
                scenarioDao.updateScenarioGroup(grpId, scenarios.size());
                System.out.println("[ScenarioService] updateScenarioGroup 완료");
            }
            for (int i = 0; i < scenarios.size(); i++) {
                System.out.println("[ScenarioService] insertScenario — seq=" + (i + 1) + "/" + scenarios.size());
                scenarioDao.insertScenario(grpId, scenarios.get(i), i + 1);
            }
            System.out.println("[ScenarioService] 전체 저장 완료 — grpId=" + grpId);

            AiStateStore.GRP_ID_STORE.put(prefix, grpId);
            AiStateStore.SCENARIO_STORE.put(prefix, scenarios);

            result.put("success", true);
            result.put("grpId",   grpId);
            result.put("message", (isNew ? "신규 저장" : "업데이트") + " 완료 (" + scenarios.size() + "건)");
        } catch (Exception e) {
            System.out.println("[ScenarioService] saveScenariosToDB 예외 발생: " + e.getMessage());
            e.printStackTrace();
            return fail(e.getMessage());
        }
        return result;
    }

    // ── 이력 추가 (새 GRP_ID) ────────────────────────────────────────────────

    public Map<String, Object> addHistoryGroup(HttpServletRequest request,
                                                Map<String, Object> body) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            String prefix = strOf(body, "prefix");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> scenarios =
                (List<Map<String, Object>>) body.get("scenarios");
            // 클라이언트 미전송 시 서버 SCENARIO_STORE fallback — 통합 SSE 자동 저장 경로 지원
            // extractUnitScenarios → SCENARIO_STORE[prefix+"_unit"]
            // extractIntegScenarios → SCENARIO_STORE[prefix+"_integ"]
            // 통합+단위 병합 저장을 위해 우선순위: 기본 키 > _unit > _integ
            if (scenarios == null || scenarios.isEmpty()) {
                String storeKey = prefix.isEmpty() ? "pur" : prefix;
                scenarios = AiStateStore.SCENARIO_STORE.get(storeKey);
                if (scenarios == null || scenarios.isEmpty())
                    scenarios = AiStateStore.SCENARIO_STORE.get(storeKey + "_unit");
                if (scenarios == null || scenarios.isEmpty())
                    scenarios = AiStateStore.SCENARIO_STORE.get(storeKey + "_integ");
            }
            if (scenarios == null || scenarios.isEmpty())
                return fail("시나리오 없음");

            String loginUser = getLoginUser(request);
            String newGrpId  = scenarioDao.newGrpId(prefix);
            scenarioDao.insertScenarioGroup(newGrpId, scenarios.size(), loginUser);
            for (int i = 0; i < scenarios.size(); i++)
                scenarioDao.insertScenario(newGrpId, scenarios.get(i), i + 1);

            AiStateStore.GRP_ID_STORE.put(prefix, newGrpId);
            AiStateStore.SCENARIO_STORE.put(prefix, scenarios);

            result.put("success", true);
            result.put("grpId",   newGrpId);
            result.put("message", "이력 추가 완료 (" + scenarios.size() + "건) — " + newGrpId);
        } catch (Exception e) {
            return fail(e.getMessage());
        }
        return result;
    }

    // ── 조회 ────────────────────────────────────────────────────────────────

    public Map<String, Object> getScenarioGroups() {
        try {
            List<Map<String, Object>> list = scenarioDao.selectScenarioGroups();
            return ok("list", list, list.size());
        } catch (Exception e) { return fail(e.getMessage()); }
    }

    public Map<String, Object> getScenariosByGroup(String grpId) {
        try {
            List<Map<String, Object>> list = scenarioDao.selectScenariosByGroup(grpId);
            return ok("list", list, list.size());
        } catch (Exception e) { return fail(e.getMessage()); }
    }

    public Map<String, Object> getTcGenHistList() {
        try {
            List<Map<String, Object>> list = tcGenHistDao.selectTcGenHistList(null);
            return ok("list", list, list.size());
        } catch (Exception e) { return fail(e.getMessage()); }
    }

    // ── Excel 위임 ─────────────────────────────────────────────────────────

    public Map<String, Object> uploadSourceList(HttpServletRequest request,
                                                  MultipartFile file) {
        return scenarioExcel.uploadSourceList(request, file);
    }

    public void downloadSourceTemplate(HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        scenarioExcel.downloadSourceTemplate(request, response);
    }

    // ── 유틸 ────────────────────────────────────────────────────────────────

    private String getLoginUser(HttpServletRequest request) {
        String[] keys = {"LOGIN_USER_NM","USER_NM","loginUserNm","userNm",
                         "LOGIN_NM","login_user_nm","userName","USER_NAME"};
        javax.servlet.http.HttpSession session = request.getSession(false);
        if (session != null)
            for (String key : keys) {
                Object val = session.getAttribute(key);
                if (val != null && !val.toString().trim().isEmpty())
                    return val.toString().trim();
            }
        return "SYSTEM";
    }

    private String strOf(Map<String, Object> body, String key) {
        Object v = body.get(key); return v != null ? v.toString().trim() : "";
    }

    private Map<String, Object> fail(String msg) {
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("success", false); r.put("message", msg); return r;
    }

    private Map<String, Object> ok(String listKey, List<Map<String, Object>> list, int cnt) {
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("success", true); r.put(listKey, list); r.put("count", cnt); return r;
    }

    // ── JSON 직렬화 (SSE done 페이로드용) ─────────────────────────────────────

    private String scenarioToJson(Map<String, Object> s) {
        StringBuilder sb = new StringBuilder("{");
        String[] strFields = {"testType","scenarioId","sourceName","screenId","displayName",
            "origin","gnbName","groupName","subCategory","menuName","menuPath","screenName",
            "testName","url","method","description","roleNm",
            "preCondition","inputValues","expectedResult","relationType","crudType","inputDsId",
            "outputDsId","testResult","remark","confirmer","judgmentResult"};
        for (String f : strFields)
            sb.append("\"").append(f).append("\":").append(JsonHelper.jsonStr(str(s,f))).append(",");

        sb.append("\"no\":").append(s.getOrDefault("no", 0)).append(",");
        sb.append("\"seq\":").append(s.getOrDefault("seq", 1)).append(",");
        sb.append("\"hasGw\":").append(Boolean.TRUE.equals(s.get("hasGw")) ? "true":"false").append(",");
        sb.append("\"affectedPrograms\":").append(listToJsonArr(s.get("affectedPrograms"))).append(",");
        sb.append("\"inputCols\":").append(listToJsonArr(s.get("inputCols"))).append(",");
        sb.append("\"outputCols\":").append(listToJsonArr(s.get("outputCols")));
        sb.append("}");
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private String listToJsonArr(Object val) {
        if (!(val instanceof List)) return "[]";
        List<Object> list = (List<Object>) val;
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(JsonHelper.jsonStr(String.valueOf(list.get(i))));
        }
        return sb.append("]").toString();
    }

    private String str(Map<String, Object> m, String key) {
        Object v = m.get(key); return v != null ? String.valueOf(v) : "";
    }

    // ── Python 라우팅 헬퍼 ────────────────────────────────────────────────────

    /** displayName 접두어 기준으로 파일 그룹화. "PUR_0010M.xfdl" → key="pur" */
    private Map<String, List<Map<String, Object>>> groupByPrefix(
            List<Map<String, Object>> files) {
        Map<String, List<Map<String, Object>>> map = new LinkedHashMap<>();
        for (Map<String, Object> f : files) {
            String name = strOf(f, "displayName");
            String pfx  = extractSourcePrefix(name);
            map.computeIfAbsent(pfx, k -> new ArrayList<>()).add(f);
        }
        return map;
    }

    /** "PUR_0010M.xfdl" → "pur", "PMS_0010M" → "pms", 판별 불가 → "unknown" */
    private String extractSourcePrefix(String displayName) {
        String name = displayName.replaceAll("\\s*\\([^)]+\\)\\s*$", "").trim();
        name = name.replaceAll("(?i)\\.xfdl.*$|\\.java$", "").toUpperCase();
        int idx = name.indexOf('_');
        return idx > 0 ? name.substring(0, idx).toLowerCase() : "unknown";
    }

    /** Python 스크립트 실행 → 생성된 Excel 파일 반환 (실패 시 null) */
    private File runPythonScript(File script, File projectRoot, File outDir,
                                  String pfx, PrintWriter writer) {
        try {
            String python = findPython();
            if (python == null) {
                SseHelper.sseLog(writer, "⚠ Python 실행 파일을 찾을 수 없습니다.");
                return null;
            }
            ProcessBuilder pb = new ProcessBuilder(
                python, "-u",
                script.getAbsolutePath(),
                projectRoot.getAbsolutePath(),
                outDir.getAbsolutePath()
            );
            pb.directory(projectRoot);
            pb.redirectErrorStream(true);
            Map<String, String> env = pb.environment();
            injectPythonPath(env);
            env.put("PYTHONIOENCODING", "utf-8");
            env.put("PYTHONUTF8",       "1");

            Process proc = pb.start();
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(proc.getInputStream(), "UTF-8"))) {
                String line;
                while ((line = br.readLine()) != null) SseHelper.sseLog(writer, line);
            }
            int exit = proc.waitFor();
            if (exit != 0) {
                SseHelper.sseLog(writer, "⚠ Python 종료코드 " + exit);
                return null;
            }
            // 생성된 Excel 탐색: outDir → copilot_info → projectRoot 순
            for (File searchDir : new File[]{outDir,
                    new File(projectRoot, "copilot_info"), projectRoot}) {
                final String p = pfx;
                File[] found = searchDir.listFiles((d, n) ->
                    n.startsWith(p + "_test_scenarios_") && n.endsWith(".xlsx"));
                if (found != null && found.length > 0) {
                    Arrays.sort(found, (a, b) -> b.getName().compareTo(a.getName()));
                    return found[0];
                }
            }
            SseHelper.sseLog(writer, "⚠ Excel 파일을 찾을 수 없습니다 (prefix=" + pfx + ")");
            return null;
        } catch (Exception e) {
            SseHelper.sseLog(writer, "⚠ Python 실행 오류: " + e.getMessage());
            return null;
        }
    }

    /** copilot_info 디렉터리를 포함한 프로젝트 루트 탐색 (최대 8단계 상위) */
    private File resolveProjectRoot(HttpServletRequest request) {
        File cur = new File(request.getServletContext().getRealPath("/"));
        for (int i = 0; i < 8; i++) {
            if (new File(cur, "copilot_info").exists()) return cur;
            File parent = cur.getParentFile();
            if (parent == null) break;
            cur = parent;
        }
        // fallback: webapp → main → src → 프로젝트루트
        cur = new File(request.getServletContext().getRealPath("/"));
        for (int i = 0; i < 3; i++) {
            File parent = cur.getParentFile();
            if (parent != null) cur = parent;
        }
        return cur;
    }

    /** Python 실행 파일 탐색 (PATH → Windows 절대경로 순) */
    private String findPython() {
        String home = System.getProperty("user.home", "");
        List<String> candidates = new ArrayList<>(Arrays.asList("python3", "python", "py"));
        for (String dir : new String[]{
                home + "\\AppData\\Local\\Programs\\Python\\Python313",
                home + "\\AppData\\Local\\Programs\\Python\\Python312",
                home + "\\AppData\\Local\\Programs\\Python\\Python311",
                home + "\\AppData\\Local\\Programs\\Python\\Python310",
                home + "\\AppData\\Local\\Programs\\Python\\Python39",
                "C:\\Python313", "C:\\Python312", "C:\\Python311",
                "C:\\Python310", "C:\\Python39", "C:\\Python38",
                "C:\\Program Files\\Python313", "C:\\Program Files\\Python312",
                home + "\\miniconda3", home + "\\Anaconda3",
                "C:\\ProgramData\\miniconda3"}) {
            File exe = new File(dir, "python.exe");
            if (exe.exists()) candidates.add(exe.getAbsolutePath());
        }
        File pyLauncher = new File("C:\\Windows\\py.exe");
        if (pyLauncher.exists()) candidates.add(pyLauncher.getAbsolutePath());

        for (String c : candidates) {
            try {
                Process p = new ProcessBuilder(c, "--version")
                    .redirectErrorStream(true).start();
                p.waitFor(5, TimeUnit.SECONDS);
                if (p.exitValue() == 0) return c;
            } catch (Exception ignored) {}
        }
        return null;
    }

    /** IDE 환경에서 PATH에 Python이 없을 때 대비 환경변수 보강 */
    private void injectPythonPath(Map<String, String> env) {
        String home      = System.getProperty("user.home", "");
        String existPath = env.containsKey("PATH") ? env.get("PATH")
                         : env.containsKey("Path") ? env.get("Path") : "";
        StringBuilder extra = new StringBuilder();
        for (String dir : new String[]{
                home + "\\AppData\\Local\\Programs\\Python\\Python313",
                home + "\\AppData\\Local\\Programs\\Python\\Python312",
                home + "\\AppData\\Local\\Programs\\Python\\Python311",
                home + "\\AppData\\Local\\Programs\\Python\\Python310",
                home + "\\AppData\\Local\\Programs\\Python\\Python39",
                "C:\\Python313", "C:\\Python312", "C:\\Python311",
                "C:\\Python310", "C:\\Python39",
                home + "\\miniconda3\\Scripts", home + "\\Anaconda3\\Scripts"}) {
            if (new File(dir).exists()) extra.append(dir).append(File.pathSeparator);
        }
        if (extra.length() > 0) {
            String key = env.containsKey("PATH") ? "PATH" : "Path";
            env.put(key, extra + existPath);
        }
    }

    /**
     * Python 생성 시나리오를 사용자가 업로드한 소스 목록(pfxFiles)으로 필터링한다.
     * pfxFiles에 없는 소스명의 시나리오는 제거된다.
     * — sourceName이 없는 시나리오는 안전하게 통과(pass-through)시킨다.
     * public: AiController.runPurScenarioGen.do 에서도 호출
     */
    public List<Map<String, Object>> filterByCheckedFiles(
            List<Map<String, Object>> scenarios,
            List<Map<String, Object>> pfxFiles,
            String pfx, java.io.PrintWriter writer) {
        if (pfxFiles == null || pfxFiles.isEmpty()) return scenarios;

        // 허용 소스명 집합: displayName에서 확장자·설명 제거 후 대문자 비교
        Set<String> allowed = new LinkedHashSet<>();
        for (Map<String, Object> f : pfxFiles) {
            String dn = strOf(f, "displayName").trim()
                .replaceAll("(?i)\\.xfdl.*$|\\.java$|\\.xml$", "")
                .replaceAll("\\s*\\([^)]+\\)\\s*$", "")
                .toUpperCase();
            if (!dn.isEmpty()) allowed.add(dn);
        }
        if (allowed.isEmpty()) return scenarios;

        int before = scenarios.size();
        List<Map<String, Object>> filtered = new ArrayList<>();
        for (Map<String, Object> s : scenarios) {
            String sn = strOf(s, "sourceName");
            if (sn.isEmpty()) sn = strOf(s, "pgmId");
            if (sn.isEmpty()) {
                // scenarioId에서 소스명 추출: IT_PUR_5110M → PUR_5110M
                String sid = strOf(s, "scenarioId");
                sn = sid.replaceAll("(?i)^(UT|IT|E2E)_", "");
            }
            if (sn.isEmpty()) { filtered.add(s); continue; } // 끝내 없으면 통과
            String snUp = sn.trim().toUpperCase()
                .replaceAll("(?i)\\.xfdl.*$|\\.java$|\\.xml$", "");
            if (allowed.contains(snUp)) filtered.add(s);
        }
        SseHelper.sseLog(writer, "[" + pfx.toUpperCase() + "] 소스 필터링: "
            + before + "건 → " + filtered.size() + "건 (허용: " + allowed + ")");
        return filtered;
    }

    /** 시나리오 목록 → buildMenuMap 용 checkedFiles (중복 제거, .xfdl 접미사) */
    private List<Map<String, Object>> buildCheckedFilesFromScenarios(
            List<Map<String, Object>> scenarios) {
        Set<String> seen = new LinkedHashSet<>();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> s : scenarios) {
            String src = str(s, "sourceName");
            if (src.isEmpty()) src = str(s, "pgmId");
            if (src.isEmpty()) continue;
            if (!seen.add(src.toUpperCase())) continue;
            Map<String, Object> f = new LinkedHashMap<>();
            f.put("displayName", src.toUpperCase() + ".xfdl");
            result.add(f);
        }
        return result;
    }
}
