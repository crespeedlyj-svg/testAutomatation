package cres.pss.service;

import java.io.*;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.*;
import javax.servlet.http.*;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SpecGenService {

    // CopilotApiService 의존성 제거 — spec.ts 생성은 SpecTemplateService(순수 Java)만 사용

    @Autowired
    SpecTemplateService specTemplate;

    @Autowired
    TestRunnerService testRunner;

    @Autowired
    TcGenHistDao tcGenHistDao;

    @Autowired(required = false)
    DataSource dataSource;

    @Autowired
    XfdlParserService xfdlParser;

    @Autowired(required = false)
    PurTestCodeGenService purTestCodeGen;

    // ══════════════════════════════════════════════════════════════════════════
    // PUBLIC METHODS
    // ══════════════════════════════════════════════════════════════════════════

    // ── spec.ts 생성 스트리밍 (SSE) — SpecTemplateService 템플릿 기반, AI 없음 ──
    public void generateSpecStream(HttpServletRequest request, HttpServletResponse response,
                                    String prefix, String scenarioIds) throws Exception {
        generateSpecStream(request, response, prefix, scenarioIds, false);
    }

    public void generateSpecStream(HttpServletRequest request, HttpServletResponse response,
                                    String prefix, String scenarioIds, boolean singleRow) throws Exception {
        response.setContentType("text/event-stream;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("X-Accel-Buffering", "no");
        PrintWriter writer = response.getWriter();

        System.out.println("[DEBUG-SPEC] generateSpecStream 호출 prefix='" + prefix + "' scenarioIds='" + scenarioIds + "'");
        System.out.println("[DEBUG-SPEC] SCENARIO_STORE keys=" + AiStateStore.SCENARIO_STORE.keySet());
        for (java.util.Map.Entry<String, List<Map<String,Object>>> _e : AiStateStore.SCENARIO_STORE.entrySet()) {
            System.out.println("[DEBUG-SPEC]   key='" + _e.getKey() + "' size=" + (_e.getValue() == null ? "null" : _e.getValue().size()));
        }
        // prefix 없음 → SCENARIO_STORE 전체 수집 (pur/pms 등 어떤 prefix든 통합)
        boolean collectAll = (prefix == null || prefix.trim().isEmpty());
        List<Map<String, Object>> allScenarios;
        if (collectAll) {
            allScenarios = new ArrayList<>();
            for (List<Map<String, Object>> list : AiStateStore.SCENARIO_STORE.values()) {
                if (list != null) allScenarios.addAll(list);
            }
            System.out.println("[DEBUG-SPEC] collectAll → 수집건수=" + allScenarios.size());
            // 여전히 비어있으면 pur Excel 자동 재로드 시도
            if (allScenarios.isEmpty() && purTestCodeGen != null) {
                System.out.println("[DEBUG-SPEC] SCENARIO_STORE 비어있음 → tryAutoReload 시도");
                purTestCodeGen.tryAutoReload(request, writer);
                for (List<Map<String, Object>> list : AiStateStore.SCENARIO_STORE.values()) {
                    if (list != null) allScenarios.addAll(list);
                }
                System.out.println("[DEBUG-SPEC] autoReload 후 수집건수=" + allScenarios.size());
            }
            // effectivePrefix 결정 (SPEC_FILE_STORE 키 등에 사용)
            if (prefix == null || prefix.trim().isEmpty()) {
                List<String> keys = new ArrayList<>();
                for (Map.Entry<String, List<Map<String,Object>>> e : AiStateStore.SCENARIO_STORE.entrySet()) {
                    if (e.getValue() != null && !e.getValue().isEmpty()) keys.add(e.getKey());
                }
                prefix = keys.size() == 1 ? keys.get(0) : (keys.isEmpty() ? "pur" : "all");
            }
        } else {
            allScenarios = AiStateStore.SCENARIO_STORE.get(prefix);
            System.out.println("[DEBUG-SPEC] prefix='" + prefix + "' → " + (allScenarios == null ? "null" : allScenarios.size() + "건"));
            if (allScenarios == null || allScenarios.isEmpty()) {
                allScenarios = AiStateStore.SCENARIO_STORE.get(prefix + "_unit");
                System.out.println("[DEBUG-SPEC] fallback prefix+_unit → " + (allScenarios == null ? "null" : allScenarios.size() + "건"));
            }
        }
        if (allScenarios == null || allScenarios.isEmpty()) {
            System.out.println("[DEBUG-SPEC] ★ 최종 시나리오 없음 → error 반환");
            writer.write("event: error\ndata: 시나리오가 없습니다 (STORE keys=" + AiStateStore.SCENARIO_STORE.keySet() + "). 먼저 시나리오를 생성하세요.\n\n");
            writer.flush();
            return;
        }
        System.out.println("[DEBUG-SPEC] 최종 allScenarios=" + allScenarios.size() + "건 → spec 생성 진행");

        // ── 체크된 시나리오만 필터링 ─────────────────────────────────────────
        List<Map<String, Object>> scenarios;
        if (scenarioIds != null && !scenarioIds.trim().isEmpty()) {
            java.util.Set<String> idSet = new java.util.HashSet<>(
                java.util.Arrays.asList(scenarioIds.split(",")));
            scenarios = new ArrayList<>();
            for (Map<String, Object> s : allScenarios) {
                if (idSet.contains(str(s, "scenarioId"))) scenarios.add(s);
            }
            if (scenarios.isEmpty()) {
                writer.write("event: error\ndata: 선택된 시나리오가 없습니다. 시나리오를 다시 선택하세요.\n\n");
                writer.flush();
                return;
            }
            SseHelper.sseLog(writer, "선택 시나리오 필터링: " + scenarios.size() + "/" + allScenarios.size() + "건");
        } else {
            scenarios = allScenarios;
        }

        File testsDir = getSpecDir(request);
        File integDir = new File(testsDir, "integration");
        File unitDir  = new File(testsDir, "unit");
        integDir.mkdirs();
        unitDir.mkdirs();

        // 파일명: testCode_{yyyyMMdd_HHmmss}_inte.spec.ts — prefix 미포함 (모듈 구분은 SPEC_FILE_STORE 키로 처리)
        String dateStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new java.util.Date());
        String integFileName = "testCode_" + dateStamp + "_inte.spec.ts";
        String unitFileName  = "testCode_" + dateStamp + "_unit.spec.ts";
        File integFile = new File(integDir, integFileName);
        File unitFile  = new File(unitDir, unitFileName);

        // 통합/단위 시나리오 분리 — scenarioId 앞자리 기준 (UT→단위, IT→통합)
        List<Map<String, Object>> integScenarios = new ArrayList<>();
        List<Map<String, Object>> unitScenarios  = new ArrayList<>();
        for (Map<String, Object> s : scenarios) {
            String sid = str(s, "scenarioId").toUpperCase();
            if (sid.startsWith("UT")) unitScenarios.add(s);
            else                       integScenarios.add(s);
        }

        // ── 메뉴경로 보완 — testName/displayName 으로 대체 후 제외 (완전 무정보만 skip) ─
        List<String> skippedNoMenu = new ArrayList<>();
        java.util.function.Consumer<Map<String, Object>> fillMenu = s -> {
            String mp = str(s, "menuPath");
            if (mp.isEmpty()) mp = str(s, "menuName");
            if (mp.isEmpty()) mp = str(s, "gnbName");
            if (mp.isEmpty()) {
                String tn = str(s, "testName");
                if (!tn.isEmpty()) {
                    s.put("menuName", tn);
                } else {
                    String dn = str(s, "displayName");
                    if (!dn.isEmpty()) s.put("menuName", dn);
                }
            }
        };
        integScenarios.forEach(fillMenu);
        unitScenarios.forEach(fillMenu);

        integScenarios.removeIf(s -> {
            String mp = str(s, "menuPath");
            if (mp.isEmpty()) mp = str(s, "menuName");
            if (mp.isEmpty()) mp = str(s, "gnbName");
            if (mp.isEmpty()) { skippedNoMenu.add(str(s, "scenarioId")); return true; }
            return false;
        });
        unitScenarios.removeIf(s -> {
            String mp = str(s, "menuPath");
            if (mp.isEmpty()) mp = str(s, "menuName");
            if (mp.isEmpty()) mp = str(s, "gnbName");
            if (mp.isEmpty()) { skippedNoMenu.add(str(s, "scenarioId")); return true; }
            return false;
        });
        if (!skippedNoMenu.isEmpty()) {
            SseHelper.sseLog(writer, "[WARN] 메뉴경로 없어 제외된 시나리오 (" + skippedNoMenu.size() + "건): "
                + String.join(", ", skippedNoMenu));
        }
        if (integScenarios.isEmpty() && unitScenarios.isEmpty()) {
            writer.write("event: error\ndata: 모든 시나리오에 메뉴경로가 없습니다. 시나리오 작성 시 '메뉴명' 필드를 입력하세요.\n\n");
            writer.flush();
            return;
        }

        // ── XFDL 파싱 → URL 자동 주입 (url 필드 없는 시나리오 대상) ─────────
        enrichUrlFromXfdl(scenarios, FilePathHelper.getNxuiBase(request), writer);

        // ── SYS_PGM_MGT.URL 조회 (화면 직접 이동용) ─────────────────────────────
        String pgmId    = extractPgmIdFromScenarios(scenarios);
        String screenUrl = queryPgmUrl(pgmId, writer);
        if (!screenUrl.isEmpty())
            SseHelper.sseLog(writer, "[DB] SYS_PGM_MGT.URL: " + pgmId + " → " + screenUrl);
        else
            SseHelper.sseLog(writer, "[DB] SYS_PGM_MGT.URL: " + pgmId + " → 조회 불가 (SCREEN_URL 빈 값으로 spec 생성)");

        // 생성자 성명 — 요청 파라미터 우선, 없으면 세션 사용자
        String creatorName = request.getParameter("creatorName");
        if (creatorName == null || creatorName.trim().isEmpty()) creatorName = getLoginUser(request);

        // 통합 + 단위 각 1개씩 생성
        int totalExpected = (integScenarios.isEmpty() ? 0 : 1) + (unitScenarios.isEmpty() ? 0 : 1);
        if (totalExpected == 0) totalExpected = 1; // 최소 통합 1개
        int minSec = 20 * totalExpected;
        int maxSec = 55 * totalExpected;
        long specStartMs = System.currentTimeMillis();
        int[] createdCount = {0};

        SseHelper.sseLog(writer, "=== spec.ts 생성 시작 (" + prefix + ") | 통합 " + integScenarios.size() + "건 / 단위 " + unitScenarios.size() + "건 | 파일명: " + integFileName + " ===");
        writer.write("event: progress\ndata: 0/" + totalExpected + "\n\n");
        writer.flush();

        // ── 1. 통합 spec (템플릿 기반 — AI 없음) ────────────────────────────────
        // integScenarios가 비어있다는 것은 필터링된 시나리오가 전부 단위(UT-접두사)라는 뜻이므로
        // 통합 spec은 생성하지 않는다. (과거에는 scenarios 전체로 폴백해 단위 전용 시나리오가
        // 통합 spec에도 중복 TC로 새어 들어갔음 — [테스트] 버튼 단일 실행 시 특히 두드러짐)
        if (integScenarios.isEmpty()) {
            SseHelper.sseLog(writer, "[통합] 대상 시나리오 없음(전부 단위) — 통합 spec 생성 생략");
        } else {
        SseHelper.sseLog(writer, "[1/" + totalExpected + "] 통합 테스트 spec 생성 중... (" + integFileName + ")");
        try {
            String integContent = specTemplate.generateIntegSpec(integScenarios, prefix, integFileName, screenUrl, creatorName, singleRow);
            integContent = ensureSpecComplete(integContent, writer);
            validateSpecContent(integContent, writer);
            integContent = sanitizeBeforeEachDialogHandler(integContent);
            try (FileOutputStream fos = new FileOutputStream(integFile)) {
                fos.write(integContent.getBytes("UTF-8"));
            }
            AiStateStore.SPEC_FILE_STORE.put(prefix, integFileName);
            AiStateStore.SPEC_OUTPUT_DIR.put(prefix, integDir.getAbsolutePath());
            AiStateStore.SPEC_OUTPUT_DIR.put(integFileName, integFile.getAbsolutePath()); // 파일명→절대경로
            createdCount[0]++;
            long lineCount = integContent.split("\n", -1).length;
            long testCount = java.util.Arrays.stream(integContent.split("\n"))
                .filter(l -> { String t = l.trim(); return t.startsWith("test(") || t.startsWith("test('") || t.startsWith("test(\""); })
                .count();
            SseHelper.sseLog(writer, "  ✓ 생성 완료: tests/integration/" + integFileName + " (" + lineCount + "줄, test " + testCount + "개)");
            writer.write("event: progress\ndata: " + createdCount[0] + "/" + totalExpected + "\n\n");
            writer.flush();
        } catch (Exception e) {
            SseHelper.sseLog(writer, "  → 오류: " + SseHelper.escEvt(e.getMessage()));
            writer.write("event: error\ndata: 통합 spec 생성 실패: " + SseHelper.escEvt(e.getMessage()) + "\n\n");
            writer.flush();
            return;
        }
        }

        // ── 2. 단위 spec (템플릿 기반 — AI 없음) ────────────────────────────────
        int unitOk = 0;
        if (!unitScenarios.isEmpty()) {
            int stepNo = createdCount[0] + 1;
            SseHelper.sseLog(writer, "[" + stepNo + "/" + totalExpected + "] 단위 테스트 spec 생성 중... (" + unitFileName + ")");
            try {
                String unitContent = specTemplate.generateUnitSpec(unitScenarios, prefix, unitFileName, creatorName);
                unitContent = ensureSpecComplete(unitContent, writer);
                validateSpecContent(unitContent, writer);
                unitContent = sanitizeBeforeEachDialogHandler(unitContent);
                try (FileOutputStream fos = new FileOutputStream(unitFile)) {
                    fos.write(unitContent.getBytes("UTF-8"));
                }
                unitOk = 1;
                createdCount[0]++;
                SseHelper.sseLog(writer, "  ✓ 생성 완료: tests/unit/" + unitFileName);
                writer.write("event: progress\ndata: " + createdCount[0] + "/" + totalExpected + "\n\n");
                writer.flush();
            } catch (Exception e) {
                SseHelper.sseLog(writer, "  → 단위 spec 오류 (통합 spec은 저장됨): " + SseHelper.escEvt(e.getMessage()));
            }
        }

        long totalSec = (System.currentTimeMillis() - specStartMs) / 1000;
        SseHelper.sseLog(writer, "=== 생성 완료 (총 소요: " + fmtSec((int)totalSec) + ") === "
            + createdCount[0] + "/" + totalExpected + "개 생성");
        SseHelper.sseLog(writer, "  통합: tests/integration/" + integFileName);
        if (unitOk > 0) SseHelper.sseLog(writer, "  단위: tests/unit/" + unitFileName);
        SseHelper.sseLog(writer, "");
        SseHelper.sseLog(writer, "▶ [테스트시작] 버튼을 클릭하여 테스트를 진행하세요.");

        // ── TC 생성 이력 DB 저장 ─────────────────────────────────────────────
        try {
            String grpId     = AiStateStore.GRP_ID_STORE.getOrDefault(prefix, "");
            String histId     = tcGenHistDao.newHistId(prefix);
            String specType   = (unitOk > 0) ? "both" : "integration";
            String scenIdsJson = buildScenIdsJson(scenarios);
            String genUser    = getLoginUser(request);
            tcGenHistDao.insertTcGenHist(histId, grpId, specType, integFileName,
                                         scenarios.size(), scenIdsJson, genUser);
            SseHelper.sseLog(writer, "[DB] TC 생성 이력 저장 완료 — HIST_ID: " + histId);
        } catch (Exception dbEx) {
            SseHelper.sseLog(writer, "[DB] ⚠ TC 이력 저장 실패: " + dbEx.getMessage());
        }

        // 프론트엔드가 done 이벤트의 파일명을 currentSpecFileName으로 저장해 이후
        // 테스트 실행 시 그대로 전달한다 — 실제로 생성/존재하는 파일명을 보내야 한다.
        // (통합 spec이 생략된 unit-only 케이스에서 integFileName을 그대로 보내면
        //  존재하지 않는 파일명으로 테스트 실행을 시도해 "spec.ts 파일이 없습니다" 오류 발생)
        String primaryFileName = integFile.exists() ? integFileName
                                  : (unitOk > 0 ? unitFileName : integFileName);
        writer.write("event: done\ndata: " + primaryFileName
            + "|단위 " + unitOk + "개"
            + "|expected:" + totalExpected
            + "|created:" + createdCount[0] + "\n\n");
        writer.flush();
    }

    // ── 세션 로그인 사용자 추출 헬퍼 ─────────────────────────────────────────
    private String getLoginUser(HttpServletRequest request) {
        String[] keys = { "LOGIN_USER_NM", "USER_NM", "loginUserNm", "userNm",
                          "LOGIN_NM", "login_user_nm", "userName", "USER_NAME" };
        javax.servlet.http.HttpSession session = request.getSession(false);
        if (session != null) {
            for (String key : keys) {
                Object val = session.getAttribute(key);
                if (val != null && !val.toString().trim().isEmpty()) return val.toString().trim();
            }
        }
        return "SYSTEM";
    }

    // ── 시나리오 ID 목록 → JSON 배열 문자열 ──────────────────────────────────
    private String buildScenIdsJson(List<Map<String, Object>> scenarios) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < scenarios.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(JsonHelper.jsonStr(str(scenarios.get(i), "scenarioId")));
        }
        return sb.append("]").toString();
    }

    // ── LLM 기반 메서드 영구 삭제됨 ────────────────────────────────────────
    // generateIntegSpecWithLLM / generateUnitSpecWithLLM / autoFixLoop / fixSingleTCWithAI
    // 이유: spec.ts 생성은 SpecTemplateService(순수 Java)만 사용한다.
    //       AI 호출 코드는 실수로 부활하는 것을 방지하기 위해 제거.
    //
    // 참고: 아래 주석 처리된 메서드 시그니처는 삭제 기록용으로만 남긴다.
    //   generateIntegSpecWithLLM(request, prefix, scenarios, specFileBaseName, integFileName)
    //   generateUnitSpecWithLLM(request, displayName, scenarios, prefix, unitFileName)
    //   autoFixLoop(request, response, prefix, maxAttempts)
    //   fixSingleTCWithAI(request, integFile, workDir, tcNo, scenario, errorMsg, writer)


    // ══════════════════════════════════════════════════════════════════════════
    // PRIVATE METHODS
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * spec.ts 완결성 보정.
     * 1) 파일이 import 로 시작하지 않으면 경고 로그
     * 2) 마지막 줄이 }); 가 아니면 자동 추가
     */
    private String ensureSpecComplete(String content, PrintWriter writer) {
        if (content == null || content.trim().isEmpty()) return "// empty\n});\n";

        // ── [0] TypeScript 이전 preamble 제거 (AI 설명 텍스트 등) ──────────────
        String beforePreamble = content;
        content = stripNonTypeScriptPreamble(content);
        if (!content.equals(beforePreamble) && writer != null)
            SseHelper.sseLog(writer, "  🔧 spec.ts 자동 교정: import 앞의 비TypeScript preamble 제거");

        // ── [1] import / fixture 자동 교정 ──────────────────────────────────────
        content = fixSpecImportsAndFixtures(content, writer);

        // ── [2] import 시작 검증 ─────────────────────────────────────────────────
        String trimmed = content.replaceAll("^\\s+", "");
        if (!trimmed.startsWith("import ")) {
            if (writer != null)
                SseHelper.sseLog(writer, "  ⚠️  spec.ts가 'import'로 시작하지 않습니다 — 불완전한 응답 가능성");
        }

        if (isSpecComplete(content)) {
            return content;
        }

        // ── [3] 응답이 잘린 경우: 마지막 완성된 test 블록 이후로 안전하게 자르기 ──
        String salvaged = salvageIncompleteSpec(content);
        if (salvaged != null) {
            if (writer != null) {
                SseHelper.sseLog(writer, "  ⚠️  LLM 응답이 중간에 잘렸습니다.");
                SseHelper.sseLog(writer, "      마지막으로 완성된 test 블록까지만 저장합니다.");
                SseHelper.sseLog(writer, "      일부 TC가 누락될 수 있습니다 — 필요 시 시나리오를 다시 생성하세요.");
            }
            return salvaged;
        }

        // ── [4] 최후 fallback — 단순히 }); 추가 (내부 문법 오류 가능성 있음) ──
        if (writer != null)
            SseHelper.sseLog(writer, "  ⚠️  마지막 줄이 '});'로 끝나지 않음 — 자동 보정 추가 (일부 TC 실패 가능)");
        content = content.replaceAll("\\s+$", "") + "\n});\n";
        return content;
    }

    /**
     * LLM이 생성한 spec 내용을 저장 전에 자동 교정한다.
     *
     * 교정 항목:
     *   1) import { test, expect[, Page, Frame, ...] } from '@playwright/test';
     *      → import { test, expect } from '../fixtures';
     *         import type { Page, Frame, ... } from '@playwright/test';  (타입만 남김)
     *
     *   2) async ({ page }) =>  또는  async ({ page, ... }) =>
     *      → async ({ workerPage: page }) =>  또는  async ({ workerPage: page, ... }) =>
     *      이유: '@playwright/test'의 page는 test-scoped → 테스트마다 새 창 열림
     *            '../fixtures'의 workerPage는 worker-scoped → 창 1개 유지
     */
    private String fixSpecImportsAndFixtures(String content, PrintWriter writer) {
        if (content == null) return null;
        boolean changed = false;

        // ── 교정 1: @playwright/test에서 test/expect를 직접 import하는 경우 수정 ─
        boolean hasFixturesImport = content.contains("from '../fixtures'");

        if (!hasFixturesImport && content.contains("from '@playwright/test'")) {
            // import { test, expect[, Type1, Type2, ...] } from '@playwright/test'; 패턴 처리
            java.util.regex.Pattern importPat = java.util.regex.Pattern.compile(
                "import \\{([^}]+)\\} from '@playwright/test';");
            java.util.regex.Matcher m = importPat.matcher(content);
            StringBuffer sb = new StringBuffer();
            while (m.find()) {
                String symbols = m.group(1); // 예: " test, expect, Page, Frame "
                // test, expect, type 키워드 제거 후 나머지 타입 이름만 추출
                String typeOnly = symbols
                    .replaceAll("\\btest\\b", "")
                    .replaceAll("\\bexpect\\b", "")
                    .replaceAll("\\btype\\b", "")
                    .replaceAll(",\\s*,", ",")
                    .replaceAll("^[,\\s]+|[,\\s]+$", "")
                    .trim();
                String replacement;
                if (typeOnly.isEmpty()) {
                    // test, expect만 있었던 경우 — import 줄 자체 제거 (fixtures import로 대체)
                    replacement = "";
                } else {
                    // 타입들이 남아있는 경우 → type-only import로 변환
                    replacement = "import type { " + typeOnly + " } from '@playwright/test';";
                }
                m.appendReplacement(sb, java.util.regex.Matcher.quoteReplacement(replacement));
            }
            m.appendTail(sb);
            String fixed = sb.toString();
            // fixtures import 첫 줄에 추가
            fixed = "import { test, expect } from '../fixtures';\n" + fixed;
            // 연속 빈 줄 정리
            fixed = fixed.replaceAll("\n{3,}", "\n\n");
            content = fixed;
            changed = true;
        } else if (hasFixturesImport && content.contains("from '@playwright/test'")) {
            // 이미 fixtures import가 있는데 @playwright/test에서 test/expect도 import하는 중복 제거
            java.util.regex.Pattern dupPat = java.util.regex.Pattern.compile(
                "import \\{[^}]*\\b(?:test|expect)\\b[^}]*\\} from '@playwright/test';\n?");
            java.util.regex.Matcher dm = dupPat.matcher(content);
            if (dm.find()) {
                content = dm.replaceAll("");
                changed = true;
            }
        }

        // ── 교정 2: async ({ page }) => → async ({ workerPage: page }) => ───────
        // "async ({ page })" 패턴 (단독)
        if (content.contains("async ({ page })")) {
            content = content.replace("async ({ page })", "async ({ workerPage: page })");
            changed = true;
        }
        // "async ({ page," 패턴 (page 뒤에 다른 픽스처가 이어지는 경우)
        if (content.contains("async ({ page,")) {
            content = content.replace("async ({ page,", "async ({ workerPage: page,");
            changed = true;
        }

        if (changed && writer != null) {
            SseHelper.sseLog(writer, "  🔧 spec.ts 자동 교정: import 및 fixture 패턴 수정 완료");
            SseHelper.sseLog(writer, "     ( from '../fixtures' + async ({ workerPage: page }) => {} )");
        }

        return content;
    }

    /**
     * LLM 응답이 잘렸을 때 마지막으로 완성된 test/beforeAll/afterAll 블록 직후로
     * 안전하게 잘라내고 test.describe 닫힘을 추가한다.
     *
     * 판별 기준: 정확히 2칸 들여쓰기 + "});" 로만 구성된 줄
     * (test.describe 본문에서 test/beforeAll/afterAll 블록을 닫는 줄)
     */
    private String salvageIncompleteSpec(String content) {
        if (content == null) return null;
        String[] lines = content.split("\n", -1);

        // 뒤에서부터 "  });" 줄 탐색 — test/beforeAll/afterAll 닫힘 위치
        int lastSafeLine = -1;
        for (int i = lines.length - 1; i >= 0; i--) {
            String line = lines[i];
            // 정확히 2칸 공백 + }); 여야 함
            if ("  });".equals(line)) {
                lastSafeLine = i;
                break;
            }
        }

        if (lastSafeLine < 0) return null;

        // lastSafeLine까지 포함하여 재조립, test.describe 닫힘 추가
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i <= lastSafeLine; i++) {
            sb.append(lines[i]).append("\n");
        }
        sb.append("});\n");
        return sb.toString();
    }

    /**
     * spec.ts 파일이 완결된 형태인지 검사한다.
     * 파일이 도중에 잘리면 마지막 비어 있지 않은 줄이 '});'가 아니다.
     */
    private boolean isSpecComplete(String content) {
        if (content == null || content.trim().isEmpty()) return false;
        String[] lines = content.split("\n");
        for (int i = lines.length - 1; i >= 0; i--) {
            String line = lines[i].trim();
            if (!line.isEmpty()) {
                return line.equals("});");
            }
        }
        return false;
    }

    /**
     * 생성된 spec.ts 코드에 금지 패턴이 포함되어 있는지 검사하고
     * 위반 항목을 SSE 경고로 출력한다.
     *
     * 검사 항목:
     *  1. expect(frame).not.toBeNull() — Playwright 비호환 assertion
     *  2. require( — JavaScript CommonJS 문법 금지
     *  3. var  — JavaScript var 선언 금지
     *  4. expect(body).toMatch(/<Root — 개별 Nexacro 응답 검증 패턴 금지
     *  5. expect(resp?.status()) / expect(resp.status()) — 개별 상태 코드 검증 금지
     */
    private void validateSpecContent(String content, PrintWriter writer) {
        if (content == null || content.isEmpty()) return;

        // 패턴 정의: { 검사 정규식, 경고 메시지 }
        String[][] checks = {
            { "expect\\(frame\\)\\.not\\.toBeNull\\(\\)",
              "expect(frame).not.toBeNull() 사용 금지 → if (!frame) { test.fail(...); return; } 로 교체 필요" },
            { "\\brequire\\s*\\(",
              "require() CommonJS 문법 금지 → import 문 사용 필요" },
            { "\\bvar\\s+",
              "var 선언 금지 → const / let 사용 필요" },
            { "expect\\(body\\)\\.toMatch\\(/<Root",
              "개별 <Root 검증 패턴 금지 → assertNexacroResponse() 헬퍼 사용 필요" },
            { "expect\\(resp(\\?\\.)?\\.status\\(\\)\\)",
              "개별 resp.status() 검증 금지 → assertNexacroResponse() 헬퍼 사용 필요" },
        };

        boolean hasViolation = false;
        for (String[] check : checks) {
            java.util.regex.Pattern p = java.util.regex.Pattern.compile(check[0]);
            if (p.matcher(content).find()) {
                if (!hasViolation) {
                    SseHelper.sseLog(writer, "  ⚠️  [spec 검증] 금지 패턴 감지:");
                    hasViolation = true;
                }
                SseHelper.sseLog(writer, "     • " + check[1]);
            }
        }
        if (hasViolation) {
            SseHelper.sseLog(writer, "  ⚠️  위 패턴이 포함된 상태로 저장됩니다. TEST-STRATEGY.md 3-3/3-4 참조.");
        }
    }

    /**
     * 생성된 spec.ts에서 test.beforeEach 블록 내 page.on('dialog') 핸들러를 제거합니다.
     * fixtures.ts의 workerPage가 이미 dialog 핸들러를 전역 등록하므로
     * beforeEach에서 추가 등록 시 N*M번 중복 호출이 발생합니다.
     */
    private String sanitizeBeforeEachDialogHandler(String content) {
        if (content == null) return "";
        if (!content.contains("page.on('dialog'") && !content.contains("page.on(\"dialog\"")) return content;
        String[] lines = content.split("\n", -1);
        List<String> out = new java.util.ArrayList<>();
        boolean inBeforeEach = false;
        int     beDepth      = 0;
        boolean inDialog     = false;
        int     dlDepth      = 0;
        for (String line : lines) {
            String t = line.trim();
            if (!inBeforeEach && t.contains("test.beforeEach(")) {
                inBeforeEach = true;
                beDepth = netBraces(line);
            }
            if (inBeforeEach) {
                if (!inDialog && (t.startsWith("page.on('dialog'") || t.startsWith("page.on(\"dialog\""))) {
                    inDialog = true;
                    dlDepth  = netBraces(line);
                    out.add(line.replaceAll("page\\.on\\(['\"]dialog['\"].*", "// dialog 핸들러는 fixtures.ts에서 처리"));
                    if (dlDepth <= 0) inDialog = false;
                    continue;
                }
                if (inDialog) {
                    dlDepth += netBraces(line);
                    if (dlDepth <= 0) inDialog = false;
                    continue;
                }
                if (t.startsWith("const pauseMs") && t.contains("DIALOG_PAUSE_MS")) continue;
                if (!t.contains("test.beforeEach(")) {
                    beDepth += netBraces(line);
                    if (beDepth <= 0) inBeforeEach = false;
                }
            }
            out.add(line);
        }
        return String.join("\n", out);
    }

    /** 한 줄에서 순수 중괄호 깊이 변화량 계산 ({+1, }-1) */
    private int netBraces(String line) {
        int d = 0;
        for (char c : line.toCharArray()) {
            if (c == '{') d++; else if (c == '}') d--;
        }
        return d;
    }

    /**
     * AI가 TypeScript 코드 앞에 한글 설명 등 비TypeScript 텍스트를 붙여 응답할 때
     * 첫 번째 'import ' 줄 이전의 모든 preamble을 제거한다.
     * (ex: "확인했습니다. [no:7] 테스트를 추가한 완전한 파일을 제공합니다.\n\nimport ...")
     */
    private String stripNonTypeScriptPreamble(String content) {
        if (content == null) return content;
        String[] lines = content.split("\n", -1);
        for (int i = 0; i < lines.length; i++) {
            String trimmed = lines[i].trim();
            if (trimmed.startsWith("import ") || trimmed.startsWith("// ") || trimmed.startsWith("const ")) {
                if (i == 0) return content; // preamble 없음
                StringBuilder sb = new StringBuilder();
                for (int j = i; j < lines.length; j++) {
                    if (j > i) sb.append("\n");
                    sb.append(lines[j]);
                }
                return sb.toString();
            }
        }
        return content;
    }


    // ══════════════════════════════════════════════════════════════════════════
    // 경로 헬퍼
    // ══════════════════════════════════════════════════════════════════════════

    private File getSpecDir(HttpServletRequest request) {
        File webappDir = new File(request.getServletContext().getRealPath("/"));
        File misRoot   = webappDir.getParentFile().getParentFile()
                                  .getParentFile().getParentFile();
        return new File(misRoot, "tests");
    }

    private String readMdContent(HttpServletRequest request, String fileName) {
        // FilePathHelper 의 캐시 공유 (최초 1회 디스크 읽기 후 메모리 반환)
        return FilePathHelper.readMdContent(request, fileName);
    }

    private File findFile(File dir, String name, int maxDepth) {
        if (dir == null || !dir.isDirectory() || maxDepth <= 0) return null;
        File[] children = dir.listFiles();
        if (children == null) return null;
        for (File f : children) {
            if (f.isFile() && f.getName().equalsIgnoreCase(name)) return f;
            if (f.isDirectory() && !f.getName().startsWith(".")
                    && !f.getName().equals("node_modules")
                    && !f.getName().equals("target")) {
                File found = findFile(f, name, maxDepth - 1);
                if (found != null) return found;
            }
        }
        return null;
    }

    private String readFileSafe(File file) {
        try {
            byte[] bytes = java.nio.file.Files.readAllBytes(file.toPath());
            try { return new String(bytes, "UTF-8"); }
            catch (Exception e) { return new String(bytes, "EUC-KR"); }
        } catch (Exception e) { return ""; }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 문자열 유틸 (sseLog/escEvt → SseHelper.* 위임)
    // ══════════════════════════════════════════════════════════════════════════

    /** 분:초 포맷 — SseHelper에 없으므로 유지 */
    private String fmtSec(int sec) {
        if (sec < 60) return sec + "초";
        int m = sec / 60, s = sec % 60;
        return s == 0 ? m + "분" : m + "분 " + s + "초";
    }

    private String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? String.valueOf(v) : "";
    }

    // ══════════════════════════════════════════════════════════════════════════
    // SYS_PGM_MGT 조회
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * 시나리오 목록의 sourceName 에서 PGM_ID 를 추출한다.
     * 예) "pur_0521M" → "PUR_0521M"
     */
    private String extractPgmIdFromScenarios(List<Map<String, Object>> scenarios) {
        for (Map<String, Object> s : scenarios) {
            String src = str(s, "sourceName").trim().toUpperCase();
            if (!src.isEmpty()) return src;
        }
        return "";
    }

    /**
     * SYS_PGM_MGT 테이블에서 화면 URL 을 조회한다.
     * <p>
     * SQL: SELECT URL FROM SYS_PGM_MGT WHERE PGM_ID = ?
     * <p>
     * 반환값은 Nexacro 리소스 경로 (예: /mis/pur/pur_0521M.xfdl) 이며,
     * 이 값이 생성되는 spec.ts 의 SCREEN_URL 상수로 삽입된다.
     * gfn_openPage / gfn_OpenUrl 등 앱별 이동 함수에 전달되어
     * GNB 메뉴 클릭 없이 직접 화면 이동이 가능하다.
     *
     * @param pgmId  소스명에서 추출한 PGM_ID (예: PUR_0521M)
     * @param writer SSE 로그 출력용 (null 허용)
     * @return URL 문자열, 조회 실패 시 빈 문자열
     */
    private String queryPgmUrl(String pgmId, java.io.PrintWriter writer) {
        if (pgmId == null || pgmId.isEmpty()) return "";
        if (dataSource == null) {
            SseHelper.sseLog(writer, "[DB] ⚠ DataSource null — SYS_PGM_MGT.URL 조회 불가");
            return "";
        }
        // PGM_ID 말미 단일 알파벳 제거 변형도 함께 시도 (PUR_0521M / PUR_0521)
        String upper    = pgmId.toUpperCase();
        String noSuffix = upper.replaceAll("[A-Za-z]$", "");
        boolean hasSuffix = !noSuffix.equals(upper);

        String sql = hasSuffix
            ? "SELECT LINK_PATH FROM SYS_PGM_MGT WHERE PGM_ID IN (?,?) AND ROWNUM = 1"
            : "SELECT LINK_PATH FROM SYS_PGM_MGT WHERE PGM_ID = ? AND ROWNUM = 1";
        System.out.println("[DEBUG-DB] queryPgmUrl DB연결 시도: pgmId=" + pgmId + ", dataSource=" + dataSource.getClass().getSimpleName());
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            System.out.println("[DEBUG-DB] queryPgmUrl DB연결 성공: conn=" + conn.getClass().getSimpleName());
            ps.setString(1, upper);
            if (hasSuffix) ps.setString(2, noSuffix);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    String url = rs.getString("LINK_PATH");
                    System.out.println("[DEBUG-DB] queryPgmUrl 쿼리 결과: url=" + url);
                    return url != null ? url.trim() : "";
                } else {
                    System.out.println("[DEBUG-DB] queryPgmUrl 쿼리 결과: 조회 결과 없음 (pgmId=" + pgmId + ")");
                }
            }
        } catch (Exception e) {
            System.out.println("[DEBUG-DB] queryPgmUrl DB오류: " + e.getMessage());
            SseHelper.sseLog(writer, "[DB] SYS_PGM_MGT.URL 조회 오류 [" + pgmId + "]: " + e.getMessage());
        }
        return "";
    }

    // ══════════════════════════════════════════════════════════════════════════
    // XFDL → URL 자동 주입
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * sourceName(pgmId) 기준으로 XFDL 파일을 찾아 파싱한 뒤,
     * 각 시나리오의 crudType 에 맞는 트랜잭션 URL 을 url 필드에 주입한다.
     * url 필드가 이미 있는 시나리오는 건너뛴다.
     */
    private void enrichUrlFromXfdl(List<Map<String, Object>> scenarios,
                                    String nxuiBase, java.io.PrintWriter writer) {
        if (nxuiBase == null || nxuiBase.isEmpty()) {
            SseHelper.sseLog(writer, "[XFDL] nxuiBase 없음 — URL 자동 주입 불가");
            return;
        }

        // 같은 화면의 시나리오는 XFDL 파싱을 1회만 수행
        Map<String, List<XfdlParserService.TranCall>> cache = new LinkedHashMap<>();
        int enriched = 0;

        for (Map<String, Object> s : scenarios) {
            if (!str(s, "url").isEmpty()) continue;

            String srcName = str(s, "sourceName");
            if (srcName.isEmpty()) srcName = str(s, "pgmId");
            if (srcName.isEmpty()) continue;

            final String key = srcName.toUpperCase();
            List<XfdlParserService.TranCall> calls = cache.computeIfAbsent(key, k -> {
                File xfdl = findXfdlFile(new File(nxuiBase), k);
                if (xfdl == null) return Collections.emptyList();
                XfdlParserService.XfdlInfo info = xfdlParser.parseXfdl(readFileSafe(xfdl));
                return info.tranCalls;
            });

            if (calls.isEmpty()) continue;

            String url = matchUrlByCrud(calls, str(s, "crudType").toUpperCase());
            if (!url.isEmpty()) {
                s.put("url", url);
                enriched++;
            }
        }

        SseHelper.sseLog(writer, "[XFDL] URL 자동 주입 완료: " + enriched + "건");
    }

    /**
     * nxuiBase 하위에서 sourceName 에 해당하는 .xfdl 파일을 찾는다.
     * 1순위: mis/{module}/{sourceName}.xfdl, pms/{module}/{sourceName}.xfdl
     * 2순위: findFile() 재귀 탐색
     */
    private File findXfdlFile(File nxuiDir, String sourceName) {
        String lower  = sourceName.toLowerCase();
        String module = lower.contains("_") ? lower.split("_")[0]
                                            : lower.substring(0, Math.min(3, lower.length()));
        for (String base : new String[]{"mis", "pms"}) {
            File f = new File(nxuiDir, base + "/" + module + "/" + lower + ".xfdl");
            if (f.exists()) return f;
        }
        return findFile(nxuiDir, lower + ".xfdl", 6);
    }

    /**
     * TranCall 목록에서 crudType 에 맞는 URL 을 반환한다.
     * 키워드 우선순위 순으로 svcId 를 검사하며, 매핑 실패 시 첫 번째 URL 을 반환한다.
     */
    private String matchUrlByCrud(List<XfdlParserService.TranCall> calls, String crudType) {
        if (calls.isEmpty()) return "";

        String[] keywords;
        switch (crudType) {
            case "SELECT": keywords = new String[]{"getlist", "search", "getdata", "list", "get"};    break;
            case "INSERT": keywords = new String[]{"insert", "create", "add", "reg", "save", "set"}; break;
            case "UPDATE": keywords = new String[]{"update", "modify", "edit", "save", "set"};        break;
            case "DELETE": keywords = new String[]{"delete", "del", "remove"};                         break;
            default:       keywords = new String[]{"getlist", "search", "list", "get"};                break;
        }

        for (String kw : keywords) {
            for (XfdlParserService.TranCall tc : calls) {
                if (tc.svcId.toLowerCase().contains(kw)) return tc.url;
            }
        }
        return calls.get(0).url; // fallback
    }

}
