package cres.pss.service;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * PUR 모듈 Playwright TypeScript spec.ts 자동 생성 서비스.
 *
 * 흐름:
 *  1. loadFromExcel()   : pur_test_scenarios_*.xlsx 파싱
 *                         → SCENARIO_STORE["pur"] 저장
 *  2. generateSpecTs()  : SCENARIO_STORE["pur"] → YYYYMMDD_inte.spec.ts 생성
 *                         → SPEC_FILE_STORE["pur"] 저장  ← Playwright 실행기 연결 핵심
 *  3. downloadSpecTs()  : 생성된 .spec.ts 파일 다운로드
 */
@Service
public class PurTestCodeGenService {

    /** 메뉴 경로 조회·팝업 역추적 — MenuResolverService 에 위임 (중복 제거) */
    @Autowired(required = false)
    private MenuResolverService menuResolver;

    // ── Excel 열 인덱스 (Python 스크립트 출력 컬럼 순서와 동일) ───────────────
    private static final int COL_NO          = 0;
    private static final int COL_TEST_TYPE   = 1;
    private static final int COL_SCENARIO_ID = 2;
    private static final int COL_SCREEN_NO   = 3;
    private static final int COL_SCREEN_NAME = 4;
    private static final int COL_CATEGORY    = 5;
    private static final int COL_TEST_NAME   = 6;
    private static final int COL_URL         = 7;
    private static final int COL_CRUD        = 8;
    private static final int COL_PRE_COND    = 9;
    private static final int COL_TEST_DATA   = 10;
    private static final int COL_EXPECTED    = 11;
    private static final int COL_RESULT      = 12;
    private static final int COL_REMARK      = 13;
    // ── 신규 컬럼 (다중 데이터셋·키 체이닝 지원) ────────────────────────────────
    private static final int COL_EXTRA_DS    = 14;  // 추가데이터셋
    private static final int COL_RETURNS_KEY = 15;  // 반환키컬럼
    private static final int COL_USES_KEY    = 16;  // 공유키사용

    // ══════════════════════════════════════════════════════════════════════════
    // 1. Excel → SCENARIO_STORE["pur"]
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * xlsx 파일을 파싱하여 SCENARIO_STORE["pur"]에 저장한다.
     * 헤더 행을 동적으로 읽어 컬럼명으로 매핑 — 시트 구조(TMPL_COLS / 표준 HEADERS)에 무관하게 동작.
     * @return 로드된 시나리오 건수
     */
    public int loadFromExcel(File xlsxFile, PrintWriter sseWriter) throws Exception {
        return loadFromExcel(xlsxFile, sseWriter, "");
    }

    public int loadFromExcel(File xlsxFile, PrintWriter sseWriter, String nxuiBase) throws Exception {
        List<Map<String, Object>> scenarios = loadRawFromExcel(xlsxFile, sseWriter);
        AiStateStore.SCENARIO_STORE.put("pur", scenarios);

        // ── 일반 시나리오와 동일한 공통 후처리 ────────────────────────────────
        if (menuResolver == null) {
            System.out.println("[loadFromExcel] ⚠ MenuResolverService 미주입 — DB 메뉴명/역할 조회 불가");
        } else {
            System.out.println("[loadFromExcel] DB 메뉴명/역할 조회 시작...");
            List<Map<String, Object>> checkedFiles = buildCheckedFiles(scenarios);
            System.out.println("[loadFromExcel] Excel 소스명 기반 checkedFiles=" + checkedFiles.size() + "건");
            if (checkedFiles.isEmpty() && nxuiBase != null && !nxuiBase.isEmpty()) {
                checkedFiles = buildCheckedFilesFromNxui(nxuiBase, "pur", sseWriter);
                System.out.println("[loadFromExcel] 소스명 없음 → nxui 전체 스캔 fallback (" + checkedFiles.size() + "건)");
            }
            System.out.println("[loadFromExcel] checkedFiles=" + checkedFiles.size() + "건 → buildMenuMap 호출");
            Map<String, String> menuMap = menuResolver.buildMenuMap(checkedFiles, nxuiBase, sseWriter);
            menuResolver.enrichMenuParts(scenarios, menuMap, "pur");
            menuResolver.enrichRoles(scenarios);
            menuResolver.applyScenarioMetadata(scenarios);
        }

        System.out.println("[loadFromExcel] 시나리오 로드 완료: " + scenarios.size() + "건 → SCENARIO_STORE[\"pur\"]");
        return scenarios.size();
    }

    /**
     * Excel → 시나리오 목록 (메뉴/역할 후처리 없음).
     * ScenarioService 에서 여러 접두어 결과를 합친 후 공통 후처리를 수행할 때 사용.
     */
    public List<Map<String, Object>> loadRawFromExcel(File xlsxFile, PrintWriter sseWriter) throws Exception {
        List<Map<String, Object>> scenarios = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(xlsxFile);
             Workbook wb = new XSSFWorkbook(fis)) {

            Sheet sheet = wb.getSheetAt(wb.getNumberOfSheets() - 1);
            SseHelper.sseLog(sseWriter,
                "참조 시트: [" + (wb.getNumberOfSheets() - 1) + "] "
                + sheet.getSheetName()
                + " (전체 " + wb.getNumberOfSheets() + "개 시트 중)");

            // ── 헤더 행 탐색 ──────────────────────────────────────────────────
            // 주의: 1행 병합 타이틀 셀("통합테스트 시나리오 (생성일:...)") 도 "시나리오" 를 포함하므로
            // 비어있지 않은 셀이 3개 미만이면 타이틀/병합 행으로 간주하고 건너뛴다.
            int headerRowIdx = -1;
            Map<String, Integer> cm = new LinkedHashMap<>();

            for (int ri = 0; ri <= Math.min(sheet.getLastRowNum(), 3); ri++) {
                Row r = sheet.getRow(ri);
                if (r == null) continue;
                // 비어있지 않은 셀 수 계산 — 3개 미만이면 병합 타이틀 행으로 간주, 건너뜀
                int nonEmpty = 0;
                for (Cell c : r) if (!cellStr(c).isEmpty()) nonEmpty++;
                if (nonEmpty < 3) continue;
                for (Cell c : r) {
                    String v = cellStr(c);
                    if (v.contains("시나리오") || v.equalsIgnoreCase("URL")
                            || v.equalsIgnoreCase("No") || v.contains("테스트명")) {
                        headerRowIdx = ri;
                        for (Cell hc : r) {
                            String hv = cellStr(hc).toLowerCase();
                            if (!hv.isEmpty()) {
                                cm.put(hv, hc.getColumnIndex());
                                // 공백 제거 버전도 추가 — "시나리오 id" → "시나리오id" 검색 대응
                                String hvNoSp = hv.replace(" ", "");
                                if (!hvNoSp.equals(hv)) cm.put(hvNoSp, hc.getColumnIndex());
                            }
                        }
                        break;
                    }
                }
                if (headerRowIdx >= 0) break;
            }

            if (headerRowIdx < 0) {
                SseHelper.sseLog(sseWriter, "[WARN] 헤더 행 미탐지 → 고정 인덱스 사용");
                cm.put("no",           COL_NO);
                cm.put("구분",         COL_TEST_TYPE);
                cm.put("시나리오id",   COL_SCENARIO_ID);
                cm.put("화면번호",     COL_SCREEN_NO);
                cm.put("화면명",       COL_SCREEN_NAME);
                cm.put("카테고리",     COL_CATEGORY);
                cm.put("테스트명",     COL_TEST_NAME);
                cm.put("url",          COL_URL);
                cm.put("crud",         COL_CRUD);
                cm.put("사전조건",     COL_PRE_COND);
                cm.put("테스트데이터", COL_TEST_DATA);
                cm.put("예상결과",     COL_EXPECTED);
                cm.put("테스트결과",   COL_RESULT);
                cm.put("비고",          COL_REMARK);
                cm.put("추가데이터셋",  COL_EXTRA_DS);
                cm.put("반환키컬럼",    COL_RETURNS_KEY);
                cm.put("공유키사용",    COL_USES_KEY);
                headerRowIdx = 1;
            }

            SseHelper.sseLog(sseWriter, "헤더 인식: " + cm.size() + "개 컬럼 (데이터: row "
                + (headerRowIdx + 2) + "행~)");

            int dataStart = headerRowIdx + 1;

            for (int r = dataStart; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null) continue;

                int sidCol = colIdx(cm, "시나리오id", "scenarioid");
                String sid = sidCol >= 0 ? cell(row, sidCol) : cell(row, COL_SCENARIO_ID);
                if (sid == null || sid.trim().isEmpty()) continue;

                Map<String, Object> s = new LinkedHashMap<>();
                s.put("no",             cellNumDyn(row, cm, r - dataStart + 1, "no", "순번"));
                s.put("testType",       cellDyn(row, cm, "구분", "testtype", "유형"));
                s.put("scenarioId",     sid.trim());
                s.put("screenNo",       cellDyn(row, cm, "화면번호", "screenno"));
                s.put("screenName",     cellDyn(row, cm, "화면명", "screenname"));
                s.put("category",       cellDyn(row, cm, "카테고리", "category"));
                s.put("testName",       cellDyn(row, cm, "테스트명", "설명", "testname", "description"));
                s.put("description",    cellDyn(row, cm, "설명", "description"));
                s.put("url",            cellDyn(row, cm, "url"));
                String methodVal = cellDyn(row, cm, "method", "메소드");
                s.put("method",         methodVal.isEmpty() ? "POST" : methodVal);
                s.put("crudType",       cellDyn(row, cm, "crud", "crudtype"));
                s.put("preCondition",   cellDyn(row, cm, "시나리오흐름", "사전조건", "precondition", "흐름"));
                String inputVal = cellDyn(row, cm, "입력값", "inputvalues", "입력 값", "testdata", "테스트데이터");
                System.out.println("[DEBUG_INPUTVAL] row=" + r + " sid=" + sid.trim() + " cmKeys=" + cm.keySet() + " inputVal=[" + inputVal + "]");
                s.put("inputValues", inputVal);
                s.put("testData",    inputVal);   // spec.ts appendTest()가 testData 키 사용
                s.put("expectedResult", cellDyn(row, cm, "예상결과", "expectedresult", "기대결과"));
                s.put("testResult",     cellDyn(row, cm, "테스트결과", "testresult"));
                s.put("confirmer",      cellDyn(row, cm, "확인자", "confirmer"));
                s.put("judgmentResult", cellDyn(row, cm, "판정결과", "judgmentresult", "판정"));
                s.put("plConfirm",      cellDyn(row, cm, "pl확인", "plconfirm", "pl 확인"));
                s.put("reason",         cellDyn(row, cm, "사유", "reason"));
                s.put("userConfirm",    cellDyn(row, cm, "사용자확인", "userconfirm", "사용자 확인"));
                s.put("remark",         cellDyn(row, cm, "비고", "remark", "note"));
                // ── 신규 필드: 다중 데이터셋·키 체이닝 ─────────────────────────────────
                String extraDsRaw = cellDyn(row, cm, "추가데이터셋", "extradatasets", "extrads");
                s.put("extraDsRaw", extraDsRaw);
                if (!extraDsRaw.isEmpty()) {
                    s.put("extraDatasets", parseExtraDatasets(extraDsRaw));
                }
                s.put("returnsKeyCol",  cellDyn(row, cm, "반환키컬럼", "returnskeycolumn", "returnskey", "keycolumn"));
                String sharedKeyColVal = cellDyn(row, cm, "공유키컬럼", "sharedkeycolumn");
                s.put("sharedKeyCol",   sharedKeyColVal);
                String usesKeyRaw = cellDyn(row, cm, "공유키사용", "usessharedkey", "usekey");
                s.put("usesSharedKey",  "Y".equalsIgnoreCase(usesKeyRaw.trim()) || "true".equalsIgnoreCase(usesKeyRaw.trim()));
                s.put("roleNm",         cellDyn(row, cm, "엑터(역할)", "엑터", "역할", "actor", "rolnm", "roleNm"));
                s.put("gnbName",        cellDyn(row, cm, "대메뉴(gnb)", "gnbname", "대메뉴", "gnb"));
                s.put("midCategory",    cellDyn(row, cm, "중분류"));
                s.put("subCategory",    cellDyn(row, cm, "소분류", "subcategory"));
                s.put("menuName",       cellDyn(row, cm, "메뉴명", "menuname", "menu"));
                s.put("menuPath",       cellDyn(row, cm, "메뉴경로", "menupath", "경로"));
                // pgmId + sourceName — enrichMenuParts/enrichRoles 가 sourceName 키를 사용
                String pgmIdVal = cellDyn(row, cm, "소스명(pgmid)", "소스명", "pgmid", "pgm_id", "sourcename");
                s.put("pgmId",      pgmIdVal);
                s.put("sourceName", pgmIdVal);
                scenarios.add(s);
            }
        }
        return scenarios;
    }

    /**
     * nxui 디렉토리를 재귀 스캔하여 prefix_*.xfdl 파일을 모두 수집한다.
     * Excel 소스명 컬럼이 비어있어도 메뉴 DB 조회가 가능하도록 하기 위한 것.
     */
    private List<Map<String, Object>> buildCheckedFilesFromNxui(String nxuiBase, String prefix,
                                                                  PrintWriter sseWriter) {
        List<Map<String, Object>> result = new ArrayList<>();
        if (nxuiBase == null || nxuiBase.trim().isEmpty()) return result;

        File nxuiDir = new File(nxuiBase);
        if (!nxuiDir.exists()) {
            System.out.println("[PurTestCodeGenService] nxui 경로 없음 → xfdl 스캔 불가: " + nxuiBase);
            return result;
        }

        String upperPrefix = prefix.toUpperCase() + "_";
        Set<String> seen = new LinkedHashSet<>();
        java.util.Deque<File> queue = new java.util.ArrayDeque<>();
        queue.add(nxuiDir);

        while (!queue.isEmpty()) {
            File cur = queue.poll();
            if (cur.isDirectory()) {
                File[] children = cur.listFiles();
                if (children != null) for (File c : children) queue.add(c);
                continue;
            }
            String name = cur.getName();
            if (!name.toLowerCase().endsWith(".xfdl")) continue;
            String pgmId = name.replaceAll("(?i)\\.xfdl$", "").toUpperCase();
            if (!pgmId.startsWith(upperPrefix)) continue;
            if (!seen.add(pgmId)) continue;

            Map<String, Object> f = new LinkedHashMap<>();
            f.put("displayName", pgmId + ".xfdl");
            result.add(f);
        }

        System.out.println("[PurTestCodeGenService] nxui 스캔 완료 — "
            + upperPrefix + "*.xfdl " + result.size() + "건");
        SseHelper.sseLog(sseWriter, "nxui 스캔: " + upperPrefix + "*.xfdl " + result.size() + "건 발견");
        return result;
    }

    /** 시나리오 목록 → buildMenuMap 용 checkedFiles (중복 제거, .xfdl 접미사 추가) */
    private List<Map<String, Object>> buildCheckedFiles(List<Map<String, Object>> scenarios) {
        Set<String> seen = new LinkedHashSet<>();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> s : scenarios) {
            String pgmId = str(s, "sourceName");
            if (pgmId.isEmpty()) pgmId = str(s, "pgmId");
            if (pgmId.isEmpty()) continue;
            if (!seen.add(pgmId.toUpperCase())) continue;
            Map<String, Object> f = new LinkedHashMap<>();
            f.put("displayName", pgmId.toUpperCase() + ".xfdl");
            result.add(f);
        }
        return result;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 2. SCENARIO_STORE["pur"] → Playwright TypeScript spec.ts 생성 (SSE)
    // ══════════════════════════════════════════════════════════════════════════

    public void generateSpecTs(HttpServletRequest request, HttpServletResponse response,
                               String outputPath) throws Exception {

        response.setContentType("text/event-stream;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("X-Accel-Buffering", "no");
        PrintWriter writer = response.getWriter();

        List<Map<String, Object>> scenarios = AiStateStore.SCENARIO_STORE.get("pur");
        if (scenarios == null || scenarios.isEmpty()) {
            // SCENARIO_STORE가 비어 있으면(서버 재시작 등) 최근 Excel 자동 재로드
            SseHelper.sseLog(writer, "[FALLBACK] SCENARIO_STORE 비어있음 → 최근 Excel 자동 재로드 시도");
            File latestExcel = findLatestPurExcel(request);
            if (latestExcel != null) {
                SseHelper.sseLog(writer, "[FALLBACK] 파일: " + latestExcel.getAbsolutePath());
                try {
                    String nxuiBase = FilePathHelper.getNxuiBase(request);
                    loadFromExcel(latestExcel, writer, nxuiBase);
                    scenarios = AiStateStore.SCENARIO_STORE.get("pur");
                } catch (Exception ex) {
                    SseHelper.sseLog(writer, "[FALLBACK] Excel 재로드 실패: " + ex.getMessage());
                }
            }
            if (scenarios == null || scenarios.isEmpty()) {
                writer.write("event: error\ndata: 시나리오가 없습니다."
                    + " PUR 시나리오 생성을 먼저 실행하세요.\n\n");
                writer.flush(); return;
            }
        }

        SseHelper.sseLog(writer, "spec.ts 생성 시작 (" + scenarios.size() + "건)");

        // ── 저장 경로 결정 ────────────────────────────────────────────────────
        // 1순위: 요청 파라미터 outputPath
        // 2순위: SPEC_OUTPUT_DIR["pur"] (이전 세션 설정값)
        // 3순위: 기본값 — webapp(3 up) = 프로젝트 루트 + etc/ai/tests/integrations
        File webappDir   = new File(request.getServletContext().getRealPath("/"));
        File projectRoot = webappDir.getParentFile().getParentFile().getParentFile();

        String resolvedPath = outputPath != null && !outputPath.trim().isEmpty()
            ? outputPath.trim()
            : AiStateStore.SPEC_OUTPUT_DIR.getOrDefault("pur", "");

        File specIntegDir;
        if (!resolvedPath.isEmpty()) {
            File p = new File(resolvedPath);
            // 절대 경로면 그대로, 상대 경로면 프로젝트 루트 기준
            specIntegDir = p.isAbsolute() ? p : new File(projectRoot, resolvedPath);
        } else {
            specIntegDir = new File(projectRoot, "etc/ai/tests/integrations");
        }
        specIntegDir.mkdirs();

        SseHelper.sseLog(writer, "저장 경로: " + specIntegDir.getAbsolutePath());

        String today    = new SimpleDateFormat("yyyyMMdd").format(new java.util.Date());
        String fileName = today + "_inte.spec.ts";
        File   outFile  = new File(specIntegDir, fileName);

        // ── TypeScript 코드 생성 ─────────────────────────────────────────────
        SseHelper.sseLog(writer, "TypeScript 코드 생성 중...");
        String tsCode = buildSpecTs(scenarios, today, writer);

        try (OutputStreamWriter osw = new OutputStreamWriter(
                new FileOutputStream(outFile), "UTF-8")) {
            osw.write(tsCode);
        }

        // ── SPEC_FILE_STORE / SPEC_OUTPUT_DIR 등록 → Playwright 실행기와 연결 ──
        AiStateStore.SPEC_FILE_STORE.put("pur", fileName);
        AiStateStore.SPEC_OUTPUT_DIR.put("pur", specIntegDir.getAbsolutePath());

        SseHelper.sseLog(writer, "파일 저장: " + outFile.getAbsolutePath());
        SseHelper.sseLog(writer, "SPEC_FILE_STORE[\"pur\"] = " + fileName);
        SseHelper.sseLog(writer, "생성 완료 ✅  이제 테스트 실행 버튼을 사용할 수 있습니다.");

        // 통계 출력
        Map<String, Long> typeCnt = new LinkedHashMap<>();
        for (Map<String, Object> s : scenarios) {
            String t = str(s, "testType");
            typeCnt.merge(t, 1L, Long::sum);
        }
        typeCnt.forEach((t, c) ->
            SseHelper.sseLog(writer, "  " + t + ": " + c + "건"));

        String payload = "{\"success\":true,\"file\":\"" + fileName + "\","
            + "\"count\":" + scenarios.size() + "}";
        writer.write("event: done\ndata: " + SseHelper.escEvt(payload) + "\n\n");
        writer.flush();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 3. 생성된 spec.ts 다운로드
    // ══════════════════════════════════════════════════════════════════════════

    public void downloadSpecTs(HttpServletRequest request,
                               HttpServletResponse response,
                               String fileName) throws Exception {

        if (fileName == null || !fileName.endsWith(".spec.ts") || fileName.contains("..")) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "잘못된 파일명");
            return;
        }

        // 저장 시 기록해둔 디렉토리 우선 사용 → 없으면 기본 경로
        String storedDir = AiStateStore.SPEC_OUTPUT_DIR.get("pur");
        File tsFile;
        if (storedDir != null && !storedDir.isEmpty()) {
            tsFile = new File(storedDir, fileName);
        } else {
            File webappDir   = new File(request.getServletContext().getRealPath("/"));
            File projectRoot = webappDir.getParentFile().getParentFile().getParentFile();
            tsFile = new File(projectRoot, "etc/ai/tests/integrations/" + fileName);
        }

        if (!tsFile.exists()) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "파일 없음: " + fileName);
            return;
        }

        response.setContentType("text/plain;charset=UTF-8");
        response.setHeader("Content-Disposition",
            "attachment; filename*=UTF-8''"
            + java.net.URLEncoder.encode(fileName, "UTF-8"));
        response.setContentLengthLong(tsFile.length());

        try (FileInputStream fis = new FileInputStream(tsFile);
             OutputStream os = response.getOutputStream()) {
            byte[] buf = new byte[8192]; int n;
            while ((n = fis.read(buf)) != -1) os.write(buf, 0, n);
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Private — TypeScript spec 빌더
    // ══════════════════════════════════════════════════════════════════════════

    private String buildSpecTs(List<Map<String, Object>> scenarios,
                                String today, PrintWriter sseWriter) {
        // 카테고리별 그룹핑
        // DB에서 조회한 중분류(midCategory) 우선, 없으면 Excel category 사용
        Map<String, List<Map<String, Object>>> byCategory = new LinkedHashMap<>();
        for (Map<String, Object> s : scenarios) {
            String cat = str(s, "midCategory");          // DB 중분류
            if (cat.isEmpty()) cat = str(s, "category"); // Excel 카테고리 fallback
            if (cat.isEmpty()) cat = "기타";
            byCategory.computeIfAbsent(cat, k -> new ArrayList<>()).add(s);
        }

        long unitCnt  = scenarios.stream().filter(s -> "단위".equals(str(s,"testType"))).count();
        long integCnt = scenarios.stream().filter(s -> "통합".equals(str(s,"testType"))).count();

        StringBuilder sb = new StringBuilder();

        // ── 파일 헤더 ────────────────────────────────────────────────────────
        sb.append("import { test, expect } from '@playwright/test';\n\n");
        sb.append("/**\n");
        sb.append(" * PUR 모듈 통합 테스트 시나리오 (Playwright TypeScript)\n");
        sb.append(" * 자동 생성일: ").append(today).append("\n");
        sb.append(" * 총 시나리오: ").append(scenarios.size()).append("건");
        sb.append(" (단위 ").append(unitCnt)
          .append(" / 통합 ").append(integCnt).append(")\n");
        sb.append(" *\n");
        sb.append(" * 실행: npx playwright test etc/ai/tests/integrations/pur_")
          .append(today).append("_inte.spec.ts --project=integration\n");
        sb.append(" */\n\n");

        // ── 세션 상수 ─────────────────────────────────────────────────────────
        sb.append("\n");

        // ── test.describe 블록 ───────────────────────────────────────────────
        sb.append("test.describe('PUR 모듈 통합 테스트', () => {\n\n");

        for (Map.Entry<String, List<Map<String, Object>>> entry : byCategory.entrySet()) {
            String category = entry.getKey();
            List<Map<String, Object>> catList = entry.getValue();

            sb.append("  // ═══════════════════════════════\n");
            sb.append("  // ").append(category)
              .append(" (").append(catList.size()).append("건)\n");
            sb.append("  // ═══════════════════════════════\n\n");

            if (sseWriter != null)
                SseHelper.sseLog(sseWriter,
                    "  " + category + " — " + catList.size() + "건");

            for (Map<String, Object> s : catList) {
                appendTest(sb, s);
            }
        }

        sb.append("});\n");
        return sb.toString();
    }

    private void appendTest(StringBuilder sb, Map<String, Object> s) {
        int    no          = s.get("no") instanceof Number
                             ? ((Number) s.get("no")).intValue() : 0;
        String scenarioId  = str(s, "scenarioId");
        String testType    = str(s, "testType");
        String testName    = str(s, "testName");
        String pgmId       = str(s, "pgmId");   // 소스명(프로그램 ID): PUR_0010M 등
        String crud        = str(s, "crudType").toUpperCase();
        String testData    = str(s, "testData");
        if (testData.isEmpty()) testData = str(s, "inputValues");  // Excel 로드 경로 fallback
        String expected    = str(s, "expectedResult");
        String preCondition= str(s, "preCondition");
        String remark      = str(s, "remark");
        // scenarioId에 E2E_ 또는 _NEG 포함 여부로 E2E/비정상 케이스 구분
        boolean isE2e = scenarioId.startsWith("E2E_");

        // ── 테스트 제목: [no:N] 패턴 필수 (결과 파싱에 사용) ──────────────────
        String menuName  = str(s, "menuName");
        String menuPath  = str(s, "menuPath");
        String midCat    = str(s, "midCategory");  // 중분류
        String subCat    = str(s, "subCategory");  // 소분류

        // 테스트 제목: [no:1] [UT_PUR_0001] 메뉴명 — 테스트명
        // 메뉴명이 있으면 메뉴명 우선, 없으면 testName
        String titleBody = !menuName.isEmpty()
            ? menuName + " — " + shorten(testName, 50)
            : shorten(testName, 70);
        String title = String.format("[no:%d] [%s] %s",
            no, scenarioId, titleBody)
            .replace("\\", "\\\\").replace("'", "\\'");

        sb.append("  test('").append(title).append("', async ({ request }) => {\n");

        // 메뉴 계층 주석
        if (!midCat.isEmpty())
            sb.append("    // 중분류: ").append(midCat).append("\n");
        if (!subCat.isEmpty())
            sb.append("    // 소분류: ").append(subCat).append("\n");
        if (!menuName.isEmpty())
            sb.append("    // 메뉴명: ").append(menuName).append("\n");
        if (!preCondition.isEmpty())
            sb.append("    // 사전조건: ").append(shorten(preCondition, 80)).append("\n");

        if (isE2e) {
            // E2E → TODO 주석
            sb.append("    // TODO: E2E 흐름 단계별 구현\n");
            if (!remark.isEmpty()) {
                for (String step : remark.split("→")) {
                    String t = step.trim();
                    if (!t.isEmpty())
                        sb.append("    // 단계: ").append(t).append("\n");
                }
            }
            if (!expected.isEmpty())
                sb.append("    // 기대결과: ").append(shorten(expected, 80)).append("\n");
            sb.append("    expect(true).toBe(true); // placeholder\n");
        } else {
            // pgmId(소스명) 기반 시나리오 — 시나리오흐름을 주석으로 기록하고 TODO 마킹
            if (!pgmId.isEmpty())
                sb.append("    // pgmId: ").append(pgmId).append("\n");
            if (!preCondition.isEmpty())
                sb.append("    // 사전조건: ").append(shorten(preCondition, 100)).append("\n");
            if (!testData.isEmpty())
                sb.append("    // 테스트데이터: ").append(shorten(testData, 100)).append("\n");
            if (!expected.isEmpty())
                sb.append("    // 예상결과: ").append(shorten(expected, 100)).append("\n");
            sb.append("    // TODO: ").append(pgmId.isEmpty() ? scenarioId : pgmId)
              .append(" 화면 진입 후 [").append(crud).append("] 시나리오 구현\n");
            sb.append("    test.skip(true, 'TODO 구현 필요');\n");
        }

        sb.append("  });\n\n");
    }

    /**
     * testData 필드 파싱: "KEY=VALUE; KEY2=VALUE2" → Map
     * 영문 대문자 KEY만 추출 (한글 설명 등 제외)
     */
    private Map<String, String> parseTestData(String testData) {
        Map<String, String> result = new LinkedHashMap<>();
        if (testData == null || testData.trim().isEmpty()) return result;
        for (String part : testData.split("[;,\\n]")) {
            int eq = part.indexOf('=');
            if (eq <= 0) continue;
            String key = part.substring(0, eq).trim();
            String val = part.substring(eq + 1).trim();
            if (key.startsWith("//")) continue;
            if (!key.matches("[A-Z_][A-Z0-9_]*")) continue; // 영문 KEY만
            if (key.length() > 30 || val.length() > 100) continue;
            result.put(key, val);
        }
        return result;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 메뉴명 DB 조회 — MenuResolverService 에 완전 위임
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * URL에서 pgmId를 추출한다.
     * /mis/pur/pur0112/getData.do  → PUR_0112M
     * /mis/pur/pur5110/getList.do  → PUR_5110M
     */
    private String extractPgmIdFromUrl(String url) {
        if (url == null || url.isEmpty()) return "";
        String[] segs = url.split("/");
        for (int i = segs.length - 2; i >= 1; i--) {
            Matcher m = Pattern.compile("([a-zA-Z]+)(\\d+)([a-zA-Z]*)").matcher(segs[i]);
            if (m.matches()) {
                String pfx    = m.group(1).toUpperCase();
                String num    = m.group(2);
                String suffix = m.group(3).toUpperCase();
                return pfx + "_" + num + (suffix.isEmpty() ? "M" : suffix);
            }
        }
        return "";
    }

    // ── 유틸 ─────────────────────────────────────────────────────────────────

    private String shorten(String s, int max) {
        if (s == null) return "";
        s = s.replace("*/", "* /").replace("\n", " ").replace("\r", "");
        return s.length() > max ? s.substring(0, max) + "..." : s;
    }

    private String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? String.valueOf(v).trim() : "";
    }

    /** Cell 객체에서 문자열 값 추출 (타입 무관) */
    private String cellStr(Cell c) {
        if (c == null) return "";
        switch (c.getCellType()) {
            case NUMERIC: return String.valueOf((long) c.getNumericCellValue());
            case BOOLEAN: return String.valueOf(c.getBooleanCellValue());
            case FORMULA:
                try { return c.getStringCellValue().trim(); } catch (Exception e) {
                    try { return String.valueOf((long) c.getNumericCellValue()); } catch (Exception e2) { return ""; }
                }
            default:
                try { return c.getStringCellValue().trim(); } catch (Exception e) { return ""; }
        }
    }

    /** 헤더 Map에서 첫 번째로 매핑된 컬럼 인덱스 반환 (-1 = 없음) */
    private int colIdx(Map<String, Integer> cm, String... keys) {
        for (String k : keys) {
            Integer idx = cm.get(k.toLowerCase());
            if (idx != null) return idx;
        }
        return -1;
    }

    /** 동적 헤더 기반 셀 값 읽기 */
    private String cellDyn(Row row, Map<String, Integer> cm, String... keys) {
        int idx = colIdx(cm, keys);
        return idx >= 0 ? cell(row, idx) : "";
    }

    /** 동적 헤더 기반 숫자 셀 읽기 */
    private int cellNumDyn(Row row, Map<String, Integer> cm, int fallback, String... keys) {
        int idx = colIdx(cm, keys);
        return idx >= 0 ? cellNum(row, idx, fallback) : fallback;
    }

    private String cell(Row row, int col) {
        if (row == null) return "";
        return cellStr(row.getCell(col));
    }

    private int cellNum(Row row, int col, int fallback) {
        if (row == null) return fallback;
        Cell c = row.getCell(col);
        if (c == null) return fallback;
        try { return (int) c.getNumericCellValue(); }
        catch (Exception e) { return fallback; }
    }

    /**
     * 추가데이터셋 컬럼 파싱.
     * 형식: "ds_itemList:tmHeader=I;MRO_ITEM_NM=테스트;THNG_UPRC=10000|ds_extra:COL=VAL"
     * 파이프(|)로 데이터셋 구분, 콜론(:)으로 ID와 행 데이터 구분, 세미콜론(;)으로 컬럼=값 구분.
     * 빈 행: "ds_itemList:" → rows=[]
     */
    private List<Map<String, Object>> parseExtraDatasets(String raw) {
        List<Map<String, Object>> result = new ArrayList<>();
        if (raw == null || raw.trim().isEmpty()) return result;
        for (String spec : raw.split("\\|")) {
            spec = spec.trim();
            if (spec.isEmpty()) continue;
            int colon = spec.indexOf(':');
            String dsId   = colon >= 0 ? spec.substring(0, colon).trim() : spec;
            String rowRaw = colon >= 0 ? spec.substring(colon + 1).trim() : "";

            List<String> cols = new ArrayList<>();
            Map<String, String> rowMap = new LinkedHashMap<>();
            for (String part : rowRaw.split(";")) {
                part = part.trim();
                if (part.isEmpty()) continue;
                int eq = part.indexOf('=');
                if (eq < 0) {
                    cols.add(part);
                } else {
                    String col = part.substring(0, eq).trim();
                    String val = part.substring(eq + 1).trim();
                    if (!col.isEmpty()) { cols.add(col); rowMap.put(col, val); }
                }
            }

            Map<String, Object> ds = new LinkedHashMap<>();
            ds.put("id",      dsId);
            ds.put("columns", cols);
            List<Map<String, String>> rows = rowMap.isEmpty()
                ? Collections.<Map<String, String>>emptyList()
                : Collections.singletonList(rowMap);
            ds.put("rows", rows);
            result.add(ds);
        }
        return result;
    }

    /**
     * SCENARIO_STORE["pur"]가 비어 있을 때 최근 Excel을 자동 재로드한다.
     * SpecGenService 등 외부에서 호출 가능.
     */
    public void tryAutoReload(HttpServletRequest request, java.io.PrintWriter writer) {
        List<Map<String, Object>> existing = AiStateStore.SCENARIO_STORE.get("pur");
        if (existing != null && !existing.isEmpty()) return; // 이미 있으면 스킵
        File excel = findLatestPurExcel(request);
        if (excel == null) return;
        SseHelper.sseLog(writer, "[FALLBACK] SCENARIO_STORE[\"pur\"] 비어있음 → Excel 재로드: " + excel.getName());
        try {
            loadFromExcel(excel, writer, FilePathHelper.getNxuiBase(request));
        } catch (Exception e) {
            SseHelper.sseLog(writer, "[FALLBACK] Excel 재로드 실패: " + e.getMessage());
        }
    }

    /**
     * etc/ai/excel/ 또는 copilot_info/ 에서 가장 최근 PUR 시나리오 Excel을 탐색한다.
     * 서버 재시작으로 SCENARIO_STORE가 비었을 때 자동 재로드용.
     */
    private File findLatestPurExcel(HttpServletRequest request) {
        try {
            File aiDir      = FilePathHelper.getAiBaseDir(request);
            File excelDir   = new File(aiDir, "excel");
            File webappDir  = new File(request.getServletContext().getRealPath("/"));
            File copilotDir = new File(webappDir.getParentFile().getParentFile()
                                                .getParentFile(), "copilot_info");

            for (File dir : new File[]{ excelDir, copilotDir }) {
                if (!dir.isDirectory()) continue;
                File[] files = dir.listFiles((d, n) ->
                    n.startsWith("pur_test_scenarios_") && n.endsWith(".xlsx"));
                if (files == null || files.length == 0) continue;
                Arrays.sort(files, (a, b) -> b.getName().compareTo(a.getName()));
                return files[0]; // 이름 내림차순 = 최신 파일
            }
        } catch (Exception ignored) { }
        return null;
    }
}
