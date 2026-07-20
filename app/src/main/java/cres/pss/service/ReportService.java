package cres.pss.service;

import java.io.*;
import java.net.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.regex.*;
import java.util.zip.*;
import javax.servlet.http.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import org.apache.poi.ss.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportService {

    private static final String TEMPLATE_SHEET = "시나리오및결과서";

    @Autowired
    private TestRunnerService testRunner;

    @Autowired
    private OraColumnCheckDao oraColumnCheckDao;

    // ── 구조화된 AI 출력에서 특정 시트 내용 추출 ─────────────────────────────
    private String extractSheetContent(String aiRaw, String sheetName) {
        if (aiRaw == null) return "";
        Pattern p = Pattern.compile(
            "===SHEET:" + Pattern.quote(sheetName) + "===\\s*([\\s\\S]*?)(?:(?====SHEET:)|$)");
        Matcher m = p.matcher(aiRaw);
        return m.find() ? m.group(1).trim() : "";
    }

    public Map<String, Object> generateReport(HttpServletRequest request,
                                               HttpServletResponse response, String prefix) throws Exception {
        Map<String, Object> result = new LinkedHashMap<>();
        List<Map<String, Object>> scenarios = AiStateStore.SCENARIO_STORE.get(prefix);
        if (scenarios == null || scenarios.isEmpty()) {
            result.put("success", false);
            result.put("message", "시나리오가 없습니다. 먼저 시나리오를 생성하세요.");
            return result;
        }

        int total = scenarios.size(), pass = 0, fail = 0, notRun = 0;
        Map<String, int[]> crudStat = new LinkedHashMap<>(); // crudType → [pass, fail]
        List<Map<String, Object>> failList = new ArrayList<>();

        for (Map<String, Object> s : scenarios) {
            String tr   = str(s, "testResult");
            String crud = str(s, "crudType");
            crudStat.putIfAbsent(crud, new int[]{0, 0});
            if ("PASS".equals(tr))      { pass++;   crudStat.get(crud)[0]++; }
            else if ("FAIL".equals(tr)) { fail++;   crudStat.get(crud)[1]++; failList.add(s); }
            else                        { notRun++; }
        }

        String today    = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        int    passRate = total > 0 ? (int) Math.round(pass * 100.0 / total) : 0;

        StringBuilder sb = new StringBuilder();

        sb.append("### 1. 테스트 실행 요약\n");
        sb.append("- 모듈: ").append(prefix.toUpperCase()).append("  |  테스트 일자: ").append(today).append("\n");
        sb.append("- 전체: ").append(total).append("건");
        sb.append("  |  PASS: ").append(pass).append("건 (").append(passRate).append("%)");
        sb.append("  |  FAIL: ").append(fail).append("건");
        if (notRun > 0) sb.append("  |  미실행: ").append(notRun).append("건");
        sb.append("\n\n");

        sb.append("### 2. CRUD 유형별 결과 분석\n");
        for (Map.Entry<String, int[]> e : crudStat.entrySet()) {
            int[] v = e.getValue();
            int cTotal = v[0] + v[1];
            int cRate  = cTotal > 0 ? (int) Math.round(v[0] * 100.0 / cTotal) : 0;
            sb.append("- ").append(e.getKey())
              .append(": PASS ").append(v[0]).append("/").append(cTotal)
              .append(" (").append(cRate).append("%)\n");
        }
        sb.append("\n");

        sb.append("### 3. 실패 항목 분석\n");
        if (failList.isEmpty()) {
            sb.append("- 모든 테스트가 통과되었습니다.\n\n");
        } else {
            for (Map<String, Object> s : failList) {
                String feasibility = inferFeasibility(str(s, "remark"), str(s, "url"));
                sb.append("- [").append(str(s, "scenarioId")).append("] ")
                  .append(str(s, "testName")).append("\n");
                sb.append("  URL: ").append(str(s, "url")).append("\n");
                sb.append("  오류: ").append(str(s, "remark"), 0, Math.min(str(s,"remark").length(), 150)).append("\n");
                sb.append("  조치가능도: ").append(feasibility).append("\n\n");
            }
        }

        sb.append("### 4. 리스크 식별\n");
        if (fail > 0) {
            sb.append("- FAIL 건수 ").append(fail).append("건 중 즉시 조치 가능 항목 우선 처리 필요\n");
            long immed = failList.stream()
                .filter(s -> "즉시조치가능".equals(inferFeasibility(str(s,"remark"), str(s,"url"))))
                .count();
            if (immed > 0) sb.append("- 즉시조치가능 ").append(immed).append("건: 인증·파라미터 오류로 빠른 수정 가능\n");
        }
        if (notRun > 0) sb.append("- 미실행 ").append(notRun).append("건: 테스트 미완료 상태\n");
        sb.append("\n");

        sb.append("### 5. 개선 권고사항\n");
        sb.append("- FAIL 시나리오의 결함내역 시트를 확인하고 처리예정일 내 조치\n");
        sb.append("- PASS 기준 달성(80% 이상) 여부 확인 후 다음 단계 진행\n");
        sb.append("- testData 값이 '기본 조회 조건 사용'인 항목은 실제 데이터로 보강 권장\n\n");

        sb.append("### 6. 다음 테스트 단계 제안\n");
        if (fail == 0) {
            sb.append("- 모든 시나리오 통과 → 통합 테스트 완료, UAT(사용자 인수 테스트) 진행 가능\n");
        } else {
            sb.append("- FAIL 항목 수정 후 재테스트 실시\n");
            sb.append("- 수정 완료 항목만 선별 재실행하여 회귀 검증\n");
        }

        String report = sb.toString();
        AiStateStore.REPORT_STORE.put(prefix, report);
        result.put("success", true);
        result.put("report",  report);
        return result;
    }

    /** String 안전 substring */
    private String str(Map<String, Object> m, String key, int from, int to) {
        String s = str(m, key);
        if (s.isEmpty()) return "";
        return s.substring(from, Math.min(to, s.length()));
    }

    /**
     * FAIL 시나리오 목록을 분석하여 소스 코드 개선방안을 반환한다.
     * 응답: { success: true, fixes: { "시나리오ID": "개선방안 문자열" } }
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> generateDefectFix(HttpServletRequest request,
                                                  HttpServletResponse response, Map<String, Object> body) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<Map<String, Object>> fails = body.get("fails") instanceof List
            ? (List<Map<String, Object>>) body.get("fails") : new ArrayList<>();

        if (fails.isEmpty()) {
            result.put("success", false);
            result.put("message", "FAIL 항목이 없습니다.");
            return result;
        }

        // 규칙 기반 개선방안 생성 (AI 없음)
        Map<String, String> fixes = new LinkedHashMap<>();
        for (Map<String, Object> f : fails) {
            String sid   = str(f, "scenarioId");
            String remark = str(f, "remark");
            String url    = str(f, "url");
            fixes.put(sid, buildFixSuggestion(remark, url));
        }

        result.put("success", true);
        result.put("fixes",   fixes);
        return result;
    }

    /** 오류 내용 기반 개선방안 텍스트 생성 — TestRunnerService(같은 패키지)에서도 재사용 */
    String buildFixSuggestion(String remark, String url) {
        String lower = remark != null ? remark.toLowerCase() : "";

        // DB 오류이면서 sqlmap 별칭→테이블 역추적 + 실제 DB 조회로 "어느 테이블에 어떤 컬럼이
        // 없는지"까지 구체적으로 특정된 경우 — 조치가능도 태그나 일반 안내문 없이, 진단 결과와
        // (가능하면) ALTER TABLE 제안만 그대로 보여준다. 이게 나머지 케이스보다 훨씬 구체적이라
        // 조치가능도/공용 문구를 덧붙이면 오히려 핵심을 흐린다.
        if (lower.contains("sql") || lower.contains("ora-") || lower.contains("jdbc")) {
            String colDiag = oraColumnCheckDao.diagnoseMissingColumn(remark, url);
            if (colDiag != null && !colDiag.isEmpty()) {
                return colDiag;
            }
        }

        String feasibility = inferFeasibility(remark, url);
        StringBuilder sb = new StringBuilder();
        sb.append("[조치가능도: ").append(feasibility).append("] ");

        if (lower.contains("csrf") || lower.contains("session")) {
            sb.append("세션 만료 또는 CSRF 토큰 오류입니다. ");
            sb.append("로그인 상태 확인 후 재시도하거나, CSRF 필터 설정을 점검하세요.");
        } else if (lower.contains("nullpointer") || lower.contains("null pointer")) {
            sb.append("NullPointerException이 발생했습니다. ");
            sb.append("Controller 또는 Service에서 null 체크가 누락된 부분을 확인하세요.");
        } else if (lower.contains("sql") || lower.contains("ora-") || lower.contains("jdbc")) {
            sb.append("DB 오류가 발생했습니다. ");
            sb.append("sqlmap XML의 쿼리 파라미터 바인딩 및 Oracle 오류 코드를 확인하세요.");
        } else if (lower.contains("404") || lower.contains("not found")) {
            sb.append("요청 URL이 존재하지 않습니다. ");
            sb.append("Controller의 @RequestMapping URL과 xfdl gfn_tran URL이 일치하는지 확인하세요.");
        } else if (lower.contains("500") || lower.contains("internal server error")) {
            sb.append("서버 내부 오류입니다. ");
            sb.append("서버 로그에서 스택 트레이스를 확인하고 해당 Service/DAO 메서드를 점검하세요.");
        } else if (lower.contains("400") || lower.contains("bad request")) {
            sb.append("요청 파라미터가 올바르지 않습니다. ");
            sb.append("xfdl의 입력 Dataset 컬럼명과 Controller의 파라미터 매핑을 확인하세요.");
        } else if (lower.contains("errorcode") || lower.contains("-1")) {
            sb.append("Nexacro 응답에 ErrorCode=-1이 포함되었습니다. ");
            sb.append("서버측 예외 처리(try-catch) 및 NexacroResult 반환 로직을 확인하세요.");
        } else if (lower.contains("timeout") || lower.contains("시간 초과")) {
            sb.append("요청 타임아웃이 발생했습니다. ");
            sb.append("쿼리 실행 시간을 확인하고 인덱스 최적화 또는 타임아웃 값 조정을 검토하세요.");
        } else if (!lower.isEmpty()) {
            sb.append("오류 내용: ").append(remark.length() > 100 ? remark.substring(0, 100) + "..." : remark).append(" ");
            sb.append("URL: ").append(url).append(" — Controller 및 sqlmap 소스를 확인하세요.");
        } else {
            sb.append("오류 상세 정보가 없습니다. ");
            sb.append("해당 URL의 Controller/Service 로그를 확인하세요. URL: ").append(url);
        }

        return sb.toString();
    }

    /** JSON 문자열에서 braceStart 위치의 '{' 와 매칭되는 '}' 인덱스 반환 */
    private int findMatchingBrace(String s, int braceStart) {
        int depth = 0;
        boolean inStr = false;
        for (int i = braceStart; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '\\' && inStr) { i++; continue; }
            if (c == '"') { inStr = !inStr; continue; }
            if (!inStr) {
                if (c == '{') depth++;
                else if (c == '}') { depth--; if (depth == 0) return i; }
            }
        }
        return s.length() - 1;
    }

    // ── 시나리오 목록 xlsx 단독 다운로드 (그리드 1:1 단일 시트) ──────────────
    public void downloadScenarioList(HttpServletRequest request, HttpServletResponse response,
                                     Map<String, Object> body) throws Exception {
        String prefix = (String) body.getOrDefault("prefix", "pur");

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> scenarios = (List<Map<String, Object>>) body.get("scenarios");
        if (scenarios == null || scenarios.isEmpty()) {
            scenarios = AiStateStore.SCENARIO_STORE.getOrDefault(prefix, new ArrayList<>());
        }

        Workbook wb = new XSSFWorkbook();
        Sheet sheet = wb.createSheet("시나리오목록");

        String[] headers  = {"순번","구분","시나리오ID","시나리오명","설명","엑터(역할)",
                              "중분류","소분류","메뉴명","시나리오흐름","입력값","예상결과",
                              "테스트결과","확인자","PL확인","사유","사용자확인"};
        int[]    colWidths = { 8,    10,    22,        30,       40,    20,
                               20,     20,   25,        40,       30,    40,
                               15,     15,   15,        30,       20};

        CellStyle hs = createHeaderStyle(wb);
        Row hRow = sheet.createRow(0);
        hRow.setHeightInPoints(25);
        for (int i = 0; i < headers.length; i++) {
            sheet.setColumnWidth(i, colWidths[i] * 256);
            Cell c = hRow.createCell(i);
            c.setCellValue(headers[i]);
            c.setCellStyle(hs);
        }
        sheet.createFreezePane(0, 1);

        CellStyle cs = createWrapStyle(wb);
        int rowIdx = 1;
        for (Map<String, Object> s : scenarios) {
            Row r = sheet.createRow(rowIdx);
            r.setHeightInPoints(30);
            setCell(r,  0, String.valueOf(rowIdx),                       cs);
            setCell(r,  1, str(s, "testType"),                           cs);
            setCell(r,  2, str(s, "scenarioId"),                         cs);
            setCell(r,  3, str(s, "testName"),                           cs);
            setCell(r,  4, str(s, "description"),                        cs);
            setCell(r,  5, str(s, "roleNm"),                             cs);
            setCell(r,  6, strFallback(s, "groupName", "midCategory", "category"), cs);
            setCell(r,  7, str(s, "subCategory"),                        cs);
            setCell(r,  8, strFallback(s, "menuName", "screenName"),     cs);
            setCell(r,  9, str(s, "preCondition"),                       cs);
            setCell(r, 10, strFallback(s, "inputValues", "testData"),    cs);
            setCell(r, 11, str(s, "expectedResult"),                     cs);
            setCell(r, 12, str(s, "testResult"),                         cs);
            setCell(r, 13, str(s, "confirmer"),                          cs);
            setCell(r, 14, str(s, "plConfirm"),                          cs);
            setCell(r, 15, str(s, "reason"),                             cs);
            setCell(r, 16, str(s, "userConfirm"),                        cs);
            rowIdx++;
        }

        String ts = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String userFileName = (String) body.get("userFileName");
        String fileName = (userFileName != null && !userFileName.trim().isEmpty())
            ? userFileName.trim().replaceAll("[\\\\/:*?\"<>|]", "_") + ".xlsx"
            : "시나리오목록_" + ts + ".xlsx";
        String encoded = java.net.URLEncoder.encode(fileName, "UTF-8").replace("+", "%20");
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + encoded);
        wb.write(response.getOutputStream());
        wb.close();
    }

    // ── 결과 xlsx 다운로드 (통합테스트결과서 단일 파일) ─────────────────────────
    public void downloadResult(HttpServletRequest request, HttpServletResponse response,
                               Map<String, Object> body) throws Exception {
        String prefix = (String) body.get("prefix");

        // 서버 측 AiStateStore.SCENARIO_STORE 우선 사용 — 브라우저 전송 데이터보다 신뢰도 높음
        List<Map<String, Object>> results = AiStateStore.SCENARIO_STORE.getOrDefault(prefix, null);
        if (results == null || results.isEmpty()) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> bodyResults = (List<Map<String, Object>>) body.get("results");
            results = bodyResults != null ? bodyResults : new ArrayList<>();
        }

        String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        String zipFileName = "통합테스트결과서_" + prefix + "_" + today.replace("-", "") + ".zip";

        // 리포트 조회 (없으면 규칙 기반 생성)
        String aiRaw = AiStateStore.REPORT_STORE.get(prefix);
        if (aiRaw == null || aiRaw.isEmpty()) {
            try {
                Map<String, Object> rpt = generateReport(request, null, prefix);
                aiRaw = (String) rpt.getOrDefault("report", "");
            } catch (Exception ignored) {}
        }

        // ── 산출물 1: 통합테스트결과서.xlsx ──────────────────────────────
        ByteArrayOutputStream resultBaos = new ByteArrayOutputStream();
        Workbook wbResult;
        if (aiRaw != null && aiRaw.contains("===SHEET:")) {
            wbResult = buildAiGeneratedXlsx(aiRaw);
        } else {
            wbResult = buildResultXlsx(prefix, results, request);
            if (aiRaw != null && !aiRaw.isEmpty()) writeLlmReportSheet(wbResult, aiRaw);
        }
        try { wbResult.write(resultBaos); } finally { wbResult.close(); }

        // ── 산출물 2: 통합테스트시나리오.xlsx ────────────────────────────
        ByteArrayOutputStream scenarioBaos = new ByteArrayOutputStream();
        Workbook wbScenario = buildScenarioXlsx(prefix, results, request);
        try { wbScenario.write(scenarioBaos); } finally { wbScenario.close(); }

        // ── 산출물 3: playwright 결과서.html ─────────────────────────────
        byte[] htmlBytes = buildPlaywrightHtml(prefix, results, today).getBytes("UTF-8");

        // ── ZIP 패키징 ────────────────────────────────────────────────────
        ByteArrayOutputStream zipBaos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(zipBaos, java.nio.charset.StandardCharsets.UTF_8)) {
            addZipEntry(zos, "통합테스트결과서.xlsx",   resultBaos.toByteArray());
            addZipEntry(zos, "통합테스트시나리오.xlsx", scenarioBaos.toByteArray());
            addZipEntry(zos, "playwright 결과서.html", htmlBytes);
        }
        byte[] zipBytes = zipBaos.toByteArray();

        response.reset();
        response.setContentType("application/zip");
        response.setContentLength(zipBytes.length);
        response.setHeader("Content-Disposition",
            "attachment; filename*=UTF-8''" +
            URLEncoder.encode(zipFileName, "UTF-8").replace("+", "%20"));
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.getOutputStream().write(zipBytes);
        response.getOutputStream().flush();
    }

    private void addZipEntry(ZipOutputStream zos, String name, byte[] data) throws IOException {
        ZipEntry entry = new ZipEntry(name);
        entry.setSize(data.length);
        zos.putNextEntry(entry);
        zos.write(data);
        zos.closeEntry();
    }

    private String buildPlaywrightHtml(String prefix, List<Map<String, Object>> results, String today) {
        // TestRunnerService 의 정식 구현에 위임
        return testRunner.buildPlaywrightHtml(results, prefix);
    }

    // 통합테스트결과서 (테스트결과 포함, 통합테스트결과서_양식.xlsx 기반)
    private Workbook buildResultXlsx(String prefix, List<Map<String, Object>> results,
                                      HttpServletRequest request) throws Exception {
        File tpl = findTemplateFile(request, "통합테스트결과서_양식.xlsx");
        Workbook wb;
        if (tpl != null && tpl.exists()) {
            try (FileInputStream fis = new FileInputStream(tpl)) { wb = new XSSFWorkbook(fis); }
        } else {
            wb = new XSSFWorkbook();
        }

        String today  = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        String author = getSvnAuthor();

        writeRevisionSheet(wb, today, author, prefix);
        writeListSheet(wb, prefix, results);
        writeResultSheet(wb, results);
        writeDefectSheet(wb, results, today);   // 결함내역 시트 (FAIL 항목 + 조치가능도)

        // 시트 순서 정렬: 개정이력 → 목록 → 시나리오및결과서 → 결함내역
        String[] sheetOrder = {"개정이력", "목록", TEMPLATE_SHEET, "결함내역"};
        for (int i = 0; i < sheetOrder.length; i++) {
            if (wb.getSheetIndex(sheetOrder[i]) >= 0) {
                wb.setSheetOrder(sheetOrder[i], i);
            }
        }
        return wb;
    }

    private Workbook buildScenarioXlsx(String prefix, List<Map<String, Object>> scenarios,
                                        HttpServletRequest request) throws Exception {
        File tpl = findTemplateFile(request, "통합테스트시나리오_양식.xlsx");
        Workbook wb;
        if (tpl != null && tpl.exists()) {
            try (FileInputStream fis = new FileInputStream(tpl)) { wb = new XSSFWorkbook(fis); }
        } else {
            wb = new XSSFWorkbook();
        }

        String today  = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        String author = getSvnAuthor();

        writeRevisionSheet(wb, today, author, prefix);
        writeListSheet(wb, prefix, scenarios);

        // 시나리오및결과서 시트 (테스트결과·비고 제외)
        Sheet sheet = wb.getSheet(TEMPLATE_SHEET);
        if (sheet == null) sheet = wb.createSheet(TEMPLATE_SHEET);
        clearDataRows(sheet);

        // 템플릿이 없을 때만 열 너비·헤더 초기화
        if (sheet.getRow(0) == null) {
            int[] colWidths = {20, 25, 40, 55, 10, 20, 30, 40, 15, 30, 15};
            for (int i = 0; i < colWidths.length; i++) {
                sheet.setColumnWidth(i, colWidths[i] * 256);
            }
            CellStyle hs = createHeaderStyle(wb);
            Row h = sheet.createRow(0);
            h.setHeightInPoints(30);
            String[] hdr = {"시나리오ID","중분류","소분류","메뉴명","테스트명","URL","Method",
                             "입력값","Pre-condition","예상결과","연관구분"};
            for (int i = 0; i < hdr.length; i++) {
                Cell c = h.createCell(i); c.setCellValue(hdr[i]); c.setCellStyle(hs);
            }
            sheet.createFreezePane(0, 1);
        }

        CellStyle ws = createWrapStyle(wb);
        int row = 1;
        for (Map<String, Object> s : scenarios) {
            Row r = sheet.createRow(row++);
            r.setHeightInPoints(40);
            setCell(r, 0,  str(s, "scenarioId"),    ws);
            setCell(r, 1,  strFallback(s, "midCategory", "category"), ws);
            setCell(r, 2,  str(s, "subCategory"),   ws);
            setCell(r, 3,  strFallback(s, "menuName", "screenName"), ws);
            setCell(r, 4,  str(s, "testName"),       ws);
            setCell(r, 5,  str(s, "url"),            ws);
            setCell(r, 6,  str(s, "method"),         ws);
            setCell(r, 7,  strFallback(s, "params", "testData"), ws);
            setCell(r, 8,  str(s, "preCondition"),   ws);
            setCell(r, 9,  str(s, "expectedResult"), ws);
            setCell(r, 10, strFallback(s, "relationType", "testType"), ws);
        }
        return wb;
    }

    // ── AI 생성 구조화 콘텐츠 → Excel 변환 ──────────────────────────────────
    private Workbook buildAiGeneratedXlsx(String aiRaw) throws Exception {
        XSSFWorkbook wb = new XSSFWorkbook();
        CellStyle headerStyle = createHeaderStyle(wb);
        CellStyle wrapStyle   = createWrapStyle(wb);
        CellStyle boldStyle   = wb.createCellStyle();
        Font boldFont = wb.createFont();
        boldFont.setBold(true);
        boldFont.setFontHeightInPoints((short) 10);
        boldStyle.setFont(boldFont);
        boldStyle.setWrapText(true);

        // ===SHEET:name=== 마커로 섹션 분리
        Pattern sectionPat = Pattern.compile(
            "===SHEET:([^=\r\n]+)===[ \t]*\r?\n([\\s\\S]*?)(?=(?:===SHEET:)|$)");
        Matcher m = sectionPat.matcher(aiRaw);

        while (m.find()) {
            String sheetName = m.group(1).trim();
            String content   = m.group(2).trim();
            if (content.isEmpty()) continue;

            Sheet sheet = wb.createSheet(sheetName);
            sheet.setColumnWidth(0, 20 * 256);

            String[] lines = content.split("\r?\n");
            boolean headerDone = false;
            int rowNum = 0;

            for (String line : lines) {
                // 지시문 행 건너뜀 (대괄호로 시작하는 안내 텍스트)
                if (line.startsWith("[") && line.endsWith("]")) continue;
                if (line.equals("---")) continue;

                Row row = sheet.createRow(rowNum++);

                if (line.contains("|")) {
                    // 파이프 구분 테이블 행
                    String[] cells = line.split("\\|", -1);
                    boolean isHeader = !headerDone;
                    for (int i = 0; i < cells.length; i++) {
                        Cell cell = row.createCell(i);
                        cell.setCellValue(cells[i].trim());
                        cell.setCellStyle(isHeader ? headerStyle : wrapStyle);
                        // 열 너비 자동 조정 (최대 60자 기준)
                        int curW = sheet.getColumnWidth(i);
                        int newW = Math.min(60, cells[i].trim().length() + 4) * 256;
                        if (newW > curW) sheet.setColumnWidth(i, newW);
                    }
                    row.setHeightInPoints(isHeader ? 22 : 16);
                    if (isHeader) {
                        sheet.createFreezePane(0, 1);
                        headerDone = true;
                    }
                } else {
                    // 자유 텍스트 (AI 분석 리포트 시트)
                    Cell cell = row.createCell(0);
                    cell.setCellValue(line);
                    boolean isSection = line.startsWith("###");
                    cell.setCellStyle(isSection ? boldStyle : wrapStyle);
                    row.setHeightInPoints(line.isEmpty() ? 6 : isSection ? 18 : 14);
                    // 자유 텍스트 시트는 단일 컬럼을 넓게
                    if (sheet.getColumnWidth(0) < 120 * 256) {
                        sheet.setColumnWidth(0, 120 * 256);
                    }
                    headerDone = true; // 자유 텍스트는 헤더 없음
                }
            }
        }

        // 시트가 하나도 없으면 빈 시트 추가 (파싱 실패 방어)
        if (wb.getNumberOfSheets() == 0) {
            Sheet fallback = wb.createSheet("AI 분석 리포트");
            fallback.setColumnWidth(0, 120 * 256);
            String[] lines = aiRaw.split("\r?\n");
            for (int i = 0; i < lines.length; i++) {
                Row r = fallback.createRow(i);
                r.createCell(0).setCellValue(lines[i]);
            }
        }
        return wb;
    }

    private void writeRevisionSheet(Workbook wb, String today, String author, String prefix) {
        Sheet sheet = wb.getSheet("개정이력");
        if (sheet == null) sheet = wb.createSheet("개정이력");

        int lastRow = sheet.getLastRowNum();
        double lastVer = 0.9;
        for (int i = lastRow; i >= 1; i--) {
            Row r = sheet.getRow(i);
            if (r != null && r.getCell(0) != null) {
                try { lastVer = r.getCell(0).getNumericCellValue(); break; }
                catch (Exception ignored) {}
            }
        }
        double newVer = Math.round((lastVer + 0.1) * 10.0) / 10.0;

        if (lastRow == 0) {
            CellStyle hs = createHeaderStyle(wb);
            Row h = sheet.createRow(0);
            for (String s : new String[]{"버전","제개정일자","작성자","승인자","변경내용"}) {
                Cell c = h.createCell(h.getLastCellNum() < 0 ? 0 : h.getLastCellNum());
                c.setCellValue(s); c.setCellStyle(hs);
            }
        }
        Row row = sheet.createRow(lastRow + 1);
        row.createCell(0).setCellValue(newVer);
        row.createCell(1).setCellValue(today);
        row.createCell(2).setCellValue(author);
        row.createCell(3).setCellValue("");
        row.createCell(4).setCellValue(lastRow == 0 ? "최초 작성" : prefix + " 모듈 시나리오 추가/수정");
    }

    private void writeListSheet(Workbook wb, String prefix, List<Map<String, Object>> results) {
        Sheet sheet = wb.getSheet("목록");
        if (sheet == null) sheet = wb.createSheet("목록");
        clearDataRows(sheet);

        int[] colWidths = {20, 25, 40, 12, 10, 50, 55, 40};
        for (int i = 0; i < colWidths.length; i++) {
            sheet.setColumnWidth(i, colWidths[i] * 256);
        }

        CellStyle hs = createHeaderStyle(wb);
        Row h = getOrCreateRow(sheet, 0);
        h.setHeightInPoints(28);
        String[] hdr = {"시나리오ID","중분류","소분류","메뉴명","시나리오요약","업무구분","전자결재","테스트데이터"};
        for (int i = 0; i < hdr.length; i++) {
            Cell c = h.createCell(i); c.setCellValue(hdr[i]); c.setCellStyle(hs);
        }
        sheet.createFreezePane(0, 1);

        CellStyle ws = createWrapStyle(wb);
        int row = 1;
        for (Map<String, Object> s : results) {
            Row r = sheet.createRow(row++);
            setCell(r, 0, str(s, "scenarioId"), ws);
            setCell(r, 1, strFallback(s, "midCategory", "category"), ws);  // 중분류
            setCell(r, 2, str(s, "subCategory"), ws);                       // 소분류
            setCell(r, 3, strFallback(s, "menuName", "screenName"), ws);    // 메뉴명
            setCell(r, 4, str(s, "testName"),   ws);
            setCell(r, 5, getBusinessCode(prefix, str(s, "url")), ws);
            setCell(r, 6, Boolean.TRUE.equals(s.get("hasGw")) ? "Y" : "N", ws);
            setCell(r, 7, strFallback(s, "testData", "params"), ws);
        }
    }

    private void writeResultSheet(Workbook wb, List<Map<String, Object>> results) {
        Sheet sheet = wb.getSheet(TEMPLATE_SHEET);
        if (sheet == null) sheet = wb.createSheet(TEMPLATE_SHEET);
        clearDataRows(sheet);

        CellStyle hs = createHeaderStyle(wb);
        Row h = getOrCreateRow(sheet, 0);
        String[] hdr = {"시나리오ID","중분류","소분류","메뉴명","테스트명","URL","Method",
                         "테스트데이터","Pre-condition","예상결과","연관구분","테스트결과","비고"};
        for (int i = 0; i < hdr.length; i++) {
            Cell c = h.createCell(i); c.setCellValue(hdr[i]); c.setCellStyle(hs);
        }
        sheet.setColumnWidth(7, 60 * 256); // 테스트데이터 컬럼 너비

        CellStyle ws = createWrapStyle(wb);
        int row = 1;
        for (Map<String, Object> s : results) {
            Row r = sheet.createRow(row++);
            setCell(r, 0,  str(s, "scenarioId"),    ws);
            setCell(r, 1,  strFallback(s, "midCategory", "category"), ws);  // 중분류
            setCell(r, 2,  str(s, "subCategory"),    ws);                    // 소분류
            setCell(r, 3,  strFallback(s, "menuName", "screenName"), ws);    // 메뉴명
            setCell(r, 4,  str(s, "testName"),       ws);
            setCell(r, 5,  str(s, "url"),            ws);
            setCell(r, 6,  str(s, "method"),         ws);
            setCell(r, 7,  strFallback(s, "testData", "params"), ws);
            setCell(r, 8,  str(s, "preCondition"),   ws);
            setCell(r, 9,  str(s, "expectedResult"), ws);
            setCell(r, 10, strFallback(s, "relationType", "testType"), ws);
            setCell(r, 11, str(s, "testResult"),     ws);
            setCell(r, 12, str(s, "remark"),         ws);
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 결함내역 시트 — FAIL 항목 + 조치가능도 분석
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * 통합테스트결과서에 "결함내역" 시트를 추가한다.
     *
     * <p>컬럼 구성:
     * No | 결함ID | 처리대상(메뉴/기능명) | 결함내용 | 처리일자 | 처리예정일 | 처리자 | 1차확인자 | 테스트경과 | 조치가능도
     *
     * <p>조치가능도는 remark 내용을 분석하여 4단계(즉시·단기·검토필요·원인미상)로 분류하고
     * 색상 배경으로 시각화한다.
     */
    private void writeDefectSheet(Workbook wb, List<Map<String, Object>> results, String today) {
        // FAIL 항목만 추출
        List<Map<String, Object>> fails = new ArrayList<>();
        for (Map<String, Object> r : results) {
            if ("FAIL".equalsIgnoreCase(str(r, "testResult"))) fails.add(r);
        }

        Sheet sheet = wb.getSheet("결함내역");
        if (sheet == null) sheet = wb.createSheet("결함내역");

        // ── 컬럼 너비 설정 ──
        int[] colWidths = {5, 16, 30, 46, 13, 14, 13, 13, 36, 14};
        for (int i = 0; i < colWidths.length; i++)
            sheet.setColumnWidth(i, colWidths[i] * 256);

        // ── 스타일 ──
        CellStyle hs      = createHeaderStyle(wb);
        CellStyle ws      = createWrapStyle(wb);
        CellStyle csGreen  = createColorStyle(wb, new byte[]{(byte)0xd4,(byte)0xed,(byte)0xda}); // 즉시조치가능
        CellStyle csYellow = createColorStyle(wb, new byte[]{(byte)0xff,(byte)0xf3,(byte)0xcd}); // 단기조치가능
        CellStyle csOrange = createColorStyle(wb, new byte[]{(byte)0xff,(byte)0xe0,(byte)0xb2}); // 검토필요
        CellStyle csRed    = createColorStyle(wb, new byte[]{(byte)0xf8,(byte)0xd7,(byte)0xda}); // 원인미상
        CellStyle csNone   = createColorStyle(wb, new byte[]{(byte)0xd1,(byte)0xec,(byte)0xf1}); // 결함없음

        // ── 헤더 행 ──
        Row h = sheet.createRow(0);
        h.setHeightInPoints(32);
        String[] hdr = {"No","결함ID","처리대상\n(메뉴/기능명)","결함내용",
                         "처리일자","처리예정일","처리자","1차확인자","테스트경과","조치가능도"};
        for (int i = 0; i < hdr.length; i++) {
            Cell c = h.createCell(i);
            c.setCellValue(hdr[i]);
            c.setCellStyle(hs);
        }
        sheet.createFreezePane(0, 1);

        // ── 결함 없음 ──
        if (fails.isEmpty()) {
            Row r = sheet.createRow(1);
            r.setHeightInPoints(28);
            setCell(r, 0, "–", ws);
            setCell(r, 1, "–", ws);
            Cell msg = r.createCell(2);
            msg.setCellValue("결함 없음 — 모든 테스트가 통과되었습니다.");
            msg.setCellStyle(csNone);
            for (int i = 3; i < hdr.length; i++) setCell(r, i, "–", ws);
            return;
        }

        // ── 데이터 행 ──
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Calendar cal = Calendar.getInstance();
        int rowNum = 1, no = 1;

        for (Map<String, Object> s : fails) {
            String remark     = str(s, "remark");
            String scenarioId = str(s, "scenarioId");
            String menuName   = strFallback(s, "menuName", "category", "screenName");
            String testName   = str(s, "testName");
            String url        = str(s, "url");

            // 조치가능도 판단
            String feasibility = inferFeasibility(remark, url);

            // 처리예정일 = today + {7·14·30·30}일
            int days;
            switch (feasibility) {
                case "즉시조치가능": days = 7;  break;
                case "단기조치가능": days = 14; break;
                default:            days = 30; break;
            }
            cal.setTime(new Date());
            cal.add(Calendar.DAY_OF_MONTH, days);
            String dueDate = sdf.format(cal.getTime());

            // 결함ID: DEF-{scenarioId}-{no} 또는 DEF-{no:03}
            String defectId = (scenarioId != null && !scenarioId.isEmpty())
                ? "DEF-" + scenarioId + "-" + String.format("%02d", no)
                : "DEF-" + String.format("%03d", no);

            // 조치가능도 배경색
            CellStyle feasStyle;
            switch (feasibility) {
                case "즉시조치가능": feasStyle = csGreen;  break;
                case "단기조치가능": feasStyle = csYellow; break;
                case "검토필요":     feasStyle = csOrange; break;
                default:            feasStyle = csRed;    break;
            }

            Row r = sheet.createRow(rowNum++);
            r.setHeightInPoints(55);

            setCell(r, 0, String.valueOf(no++),                      ws);
            setCell(r, 1, defectId,                                   ws);
            setCell(r, 2, menuName + "\n" + testName,                 ws);
            setCell(r, 3, buildDefectContent(remark, url),            ws);
            setCell(r, 4, "",                                         ws); // 처리일자 (담당자 입력)
            setCell(r, 5, dueDate,                                    ws);
            setCell(r, 6, "",                                         ws); // 처리자 (담당자 입력)
            setCell(r, 7, "",                                         ws); // 1차확인자 (담당자 입력)
            setCell(r, 8, buildTestProgress(remark, testName, url),   ws);
            setCell(r, 9, feasibility,                                feasStyle);
        }
    }

    /**
     * 결함 조치 가능도 판단.
     *
     * <ul>
     *   <li>즉시조치가능 — CSRF·세션 만료·파라미터 오류·NullPointer·타임아웃 등 원인이 명확한 경우</li>
     *   <li>단기조치가능 — DB·SQL·서비스 레이어·HTTP 4xx/5xx 등 서버 로직 오류</li>
     *   <li>검토필요   — 비즈니스 로직 불일치·어서션 오류·예상결과 미일치 등 요구사항 재검토 필요</li>
     *   <li>원인미상   — 오류 메시지가 없거나 분류 불가인 경우</li>
     * </ul>
     */
    private String inferFeasibility(String remark, String url) {
        if (remark == null || remark.trim().isEmpty()) return "원인미상";
        String lower = remark.toLowerCase();

        // ① 단기조치가능(DB·SQL)을 최우선 판단 — assertNexacroResponse의 hasRoot 실패
        // 메시지는 실제 원인과 무관하게 "...로그인 페이지 리다이렉트 가능성..." 같은 부수
        // 안내 문구를 항상 포함한다. 이 문구의 "로그인" 때문에 ORA-00904 같은 구체적인 DB
        // 오류 코드가 있는 케이스까지 즉시조치가능(세션/CSRF)으로 오분류되는 것을 방지한다.
        if (lower.contains("sql")          || lower.contains("ora-")
         || lower.contains("jdbc")         || lower.contains("mybatis")
         || lower.contains("datasource")   || lower.contains("database")) {
            return "단기조치가능";
        }

        // ② 즉시조치가능: 환경·인증·파라미터 오류
        if (lower.contains("csrf")         || lower.contains("session expired")
         || lower.contains("로그인")        || lower.contains("auth")
         || lower.contains("nullpointer")   || lower.contains("null pointer")
         || lower.contains("timeout")       || lower.contains("시간 초과")
         || lower.contains("parameter")     || lower.contains("파라미터")
         || lower.contains("errorcode=\"-1\"") || lower.contains("errorcode=-1")) {
            return "즉시조치가능";
        }

        // ③ 단기조치가능: 나머지 서버 오류(HTTP 4xx/5xx·서비스 레이어)
        if (lower.contains("500")          || lower.contains("internal server error")
         || lower.contains("service")      || lower.contains("서비스")
         || lower.contains("400")          || lower.contains("404")) {
            return "단기조치가능";
        }

        // ③ 검토필요: 비즈니스 로직 불일치
        if (lower.contains("assertion")    || lower.contains("expected")
         || lower.contains("mismatch")     || lower.contains("불일치")
         || lower.contains("비즈니스")      || lower.contains("계산")
         || lower.contains("로직")         || lower.contains("요구사항")) {
            return "검토필요";
        }

        return "원인미상";
    }

    /** 결함내용 컬럼 텍스트 구성 */
    private String buildDefectContent(String remark, String url) {
        StringBuilder sb = new StringBuilder();
        if (url != null && !url.isEmpty())
            sb.append("[URL] ").append(url).append("\n");
        if (remark != null && !remark.trim().isEmpty()) {
            String trimmed = remark.length() > 300 ? remark.substring(0, 300) + "..." : remark;
            sb.append("[오류] ").append(trimmed);
        } else {
            sb.append("오류 상세 없음");
        }
        return sb.toString();
    }

    /** 테스트경과 컬럼 텍스트 구성 */
    private String buildTestProgress(String remark, String testName, String url) {
        StringBuilder sb = new StringBuilder();
        sb.append("■ 테스트명: ").append(testName).append("\n");
        sb.append("■ 결과: FAIL\n");
        if (url != null && !url.isEmpty())
            sb.append("■ 엔드포인트: ").append(url).append("\n");
        if (remark != null && !remark.trim().isEmpty()) {
            String trimmed = remark.length() > 200 ? remark.substring(0, 200) + "..." : remark;
            sb.append("■ 오류내용: ").append(trimmed);
        }
        return sb.toString();
    }

    /**
     * 배경색이 있는 셀 스타일 생성.
     *
     * @param rgb 3바이트 RGB 배열 (예: {0xd4, 0xed, 0xda} = 연두색)
     */
    private CellStyle createColorStyle(Workbook wb, byte[] rgb) {
        CellStyle s = wb.createCellStyle();
        s.setWrapText(true);
        s.setVerticalAlignment(VerticalAlignment.CENTER);
        s.setAlignment(HorizontalAlignment.CENTER);
        s.setBorderBottom(BorderStyle.THIN);
        s.setBorderLeft(BorderStyle.THIN);
        s.setBorderRight(BorderStyle.THIN);
        s.setBorderTop(BorderStyle.THIN);
        if (wb instanceof XSSFWorkbook) {
            XSSFCellStyle xs = (XSSFCellStyle) s;
            xs.setFillForegroundColor(new XSSFColor(rgb, null));
            xs.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        } else {
            s.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
            s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }
        return s;
    }

    // ── AI 분석 리포트 시트 작성 ──────────────────────────────────────────────
    private void writeLlmReportSheet(Workbook wb, String report) {
        String sheetName = "AI 분석 리포트";
        int idx = wb.getSheetIndex(sheetName);
        if (idx >= 0) wb.removeSheetAt(idx);
        Sheet sheet = wb.createSheet(sheetName);
        sheet.setColumnWidth(0, 120 * 256);

        CellStyle titleStyle   = createHeaderStyle(wb);
        CellStyle sectionStyle = wb.createCellStyle();
        Font boldFont = wb.createFont();
        boldFont.setBold(true);
        boldFont.setFontHeightInPoints((short) 11);
        sectionStyle.setFont(boldFont);
        sectionStyle.setWrapText(true);
        CellStyle bodyStyle = createWrapStyle(wb);

        // 제목 행
        Row titleRow = sheet.createRow(0);
        titleRow.setHeightInPoints(24);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("AI 분석 리포트 (Claude 자동 생성)");
        titleCell.setCellStyle(titleStyle);

        // 본문 행
        String[] lines = report.split("\n");
        for (int i = 0; i < lines.length; i++) {
            Row row = sheet.createRow(i + 1);
            Cell cell = row.createCell(0);
            cell.setCellValue(lines[i]);
            boolean isSection = lines[i].startsWith("###");
            cell.setCellStyle(isSection ? sectionStyle : bodyStyle);
            row.setHeightInPoints(lines[i].isEmpty() ? 6 : isSection ? 18 : 14);
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // POI 유틸
    // ══════════════════════════════════════════════════════════════════════════

    private void clearDataRows(Sheet sheet) {
        for (int i = sheet.getLastRowNum(); i >= 1; i--) {
            Row r = sheet.getRow(i);
            if (r != null) sheet.removeRow(r);
        }
    }

    private Row getOrCreateRow(Sheet sheet, int rowNum) {
        Row r = sheet.getRow(rowNum);
        return r != null ? r : sheet.createRow(rowNum);
    }

    private void setCell(Row row, int col, String value, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(value != null ? value : "");
        if (style != null) cell.setCellStyle(style);
    }

    private CellStyle createWrapStyle(Workbook wb) {
        CellStyle s = wb.createCellStyle();
        s.setWrapText(true);
        s.setVerticalAlignment(VerticalAlignment.TOP);
        s.setBorderBottom(BorderStyle.THIN);
        s.setBorderLeft(BorderStyle.THIN);
        s.setBorderRight(BorderStyle.THIN);
        s.setBorderTop(BorderStyle.THIN);
        return s;
    }

    private CellStyle createHeaderStyle(Workbook wb) {
        CellStyle s = wb.createCellStyle();
        // 템플릿과 동일한 네이비 블루 (#002060) 배경 + 흰색 텍스트
        if (wb instanceof XSSFWorkbook) {
            XSSFCellStyle xs = (XSSFCellStyle) s;
            xs.setFillForegroundColor(new XSSFColor(new byte[]{0x00, 0x20, 0x60}, null));
        } else {
            s.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        }
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        s.setAlignment(HorizontalAlignment.CENTER);
        s.setVerticalAlignment(VerticalAlignment.CENTER);
        s.setBorderBottom(BorderStyle.THIN);
        s.setBorderLeft(BorderStyle.THIN);
        s.setBorderRight(BorderStyle.THIN);
        s.setBorderTop(BorderStyle.THIN);
        Font font = wb.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        s.setFont(font);
        return s;
    }

    @SuppressWarnings("unused")
    private String buildReportPrompt(List<Map<String, Object>> scenarios,
                                      int pass, int fail, String strategyMd, String today, String prefix) {
        int total = scenarios.size();
        StringBuilder sb = new StringBuilder();
        sb.append("당신은 소프트웨어 테스트 전문가입니다.\n");
        sb.append("아래 테스트 데이터를 분석하여 통합 테스트 결과 보고서 Excel 파일의 내용을 생성하세요.\n\n");

        sb.append("## 출력 형식 (반드시 준수)\n");
        sb.append("아래 4개 시트를 순서대로 출력하세요. 형식을 절대 바꾸지 마세요.\n");
        sb.append("- 각 시트는 ===SHEET:시트명=== 으로 시작\n");
        sb.append("- 테이블 데이터는 | 로 구분 (첫 행=헤더, 이후 각 시나리오 1행씩)\n");
        sb.append("- 셀 내 | 문자는 사용 금지 (대신 / 사용)\n");
        sb.append("- 마크다운 코드블록(```) 사용 금지, 형식 그대로만 출력\n\n");

        sb.append("===SHEET:개정이력===\n");
        sb.append("버전|제개정일자|작성자|승인자|변경내용\n");
        sb.append("1.0|").append(today).append("|||최초 작성\n\n");

        sb.append("===SHEET:목록===\n");
        sb.append("시나리오ID|메뉴명|시나리오요약|업무구분|전자결재|영향업무\n");
        sb.append("[아래 시나리오 데이터를 1행씩 채울 것]\n\n");

        sb.append("===SHEET:시나리오및결과서===\n");
        sb.append("시나리오ID|메뉴명|테스트명|URL|Method|Pre-condition|예상결과|연관구분|테스트결과|비고\n");
        sb.append("[아래 시나리오 데이터를 1행씩 채울 것]\n\n");

        sb.append("===SHEET:AI 분석 리포트===\n");
        sb.append("[6개 섹션으로 분석 보고서 작성. 각 제목은 ### 사용]\n\n");
        sb.append("---\n\n");

        sb.append("## 시나리오 데이터 (위 시트에 채울 실제 데이터)\n");
        sb.append("모듈: ").append(prefix)
          .append(" | 전체: ").append(total)
          .append("건 | PASS: ").append(pass)
          .append("건 | FAIL: ").append(fail).append("건\n\n");

        sb.append("No|시나리오ID|메뉴명|테스트명|URL|Method|Pre-condition|예상결과|연관구분|유형|영향업무|테스트결과|비고\n");
        for (Map<String, Object> s : scenarios) {
            @SuppressWarnings("unchecked")
            List<String> ap = s.get("affectedPrograms") instanceof List
                ? (List<String>) s.get("affectedPrograms") : new ArrayList<>();
            String tr = str(s, "testResult");
            sb.append(str(s, "no")).append("|")
              .append(str(s, "scenarioId")).append("|")
              .append(str(s, "menuName")).append("|")
              .append(str(s, "testName")).append("|")
              .append(str(s, "url")).append("|")
              .append(str(s, "method")).append("|")
              .append(str(s, "preCondition")).append("|")
              .append(str(s, "expectedResult").replace("\n", " ").replace("|", "/")).append("|")
              .append(str(s, "relationType")).append("|")
              .append(str(s, "crudType")).append("|")
              .append(String.join("/", ap)).append("|")
              .append(tr.isEmpty() ? "미실행" : tr).append("|")
              .append(str(s, "remark")).append("\n");
        }
        sb.append("\n");

        if (!strategyMd.isEmpty()) {
            sb.append("## 테스트 전략 문서 (참고용)\n").append(strategyMd).append("\n\n");
        }

        sb.append("## AI 분석 리포트 작성 지침\n");
        sb.append("===SHEET:AI 분석 리포트=== 시트에 아래 6개 섹션으로 작성하세요.\n");
        sb.append("### 1. 테스트 실행 요약 (실행 범위, 결과 수치, 주요 관찰사항)\n");
        sb.append("### 2. 결과 분석 (PASS/FAIL 패턴, CRUD 유형별 성공률)\n");
        sb.append("### 3. 실패 항목 분석 (FAIL 원인 추정 및 영향도, FAIL 없으면 '해당 없음')\n");
        sb.append("### 4. 리스크 식별 (잠재 리스크 2~4개)\n");
        sb.append("### 5. 개선 권고사항 (테스트 전략 기준 3~5개)\n");
        sb.append("### 6. 다음 테스트 단계 제안 (후속 조치, 추가 범위)\n");
        return sb.toString();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 공통 유틸
    // ══════════════════════════════════════════════════════════════════════════

    private String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? String.valueOf(v) : "";
    }

    /**
     * 필드 조회 — key 가 비어 있으면 fallback 키 순서대로 시도.
     * PUR 시나리오(menuName 없음 등)와 일반 시나리오 모두 처리 가능.
     */
    private String strFallback(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            String v = str(map, key);
            if (!v.isEmpty()) return v;
        }
        return "";
    }

    private String getBusinessCode(String prefix, String url) {
        String lower = (prefix + " " + url).toLowerCase();
        if (lower.contains("act") || lower.contains("acnt"))   return "ACT";
        if (lower.contains("bdg") || lower.contains("budget")) return "BDG";
        if (lower.contains("pur") || lower.contains("purch"))  return "PUR";
        if (lower.contains("hrm") || lower.contains("human"))  return "HRM";
        if (lower.contains("gen") || lower.contains("general"))return "GEN";
        return prefix.toUpperCase();
    }

    private String getSvnAuthor() {
        try {
            Process p = new ProcessBuilder("svn", "info").redirectErrorStream(true).start();
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(p.getInputStream(), "UTF-8"))) {
                String line;
                while ((line = br.readLine()) != null) {
                    if (line.startsWith("Last Changed Author:"))
                        return line.replace("Last Changed Author:", "").trim();
                }
            }
            p.waitFor(5, TimeUnit.SECONDS);
            p.destroyForcibly();
        } catch (Exception ignored) {}
        return System.getProperty("user.name", "");
    }

    private String readMdContent(HttpServletRequest request, String fileName) {
        // FilePathHelper 의 캐시 공유 (최초 1회 디스크 읽기 후 메모리 반환)
        return FilePathHelper.readMdContent(request, fileName);
    }

    private String getClaudeDir(HttpServletRequest request) {
        try {
            String realPath = request.getServletContext().getRealPath("/");
            File webappDir = new File(realPath);
            // (app root)/src/main/webapp → app 루트 기준으로 claude 폴더 탐색
            File projectRoot = webappDir.getParentFile().getParentFile()
                                        .getParentFile().getParentFile();
            return projectRoot.getAbsolutePath() + File.separator + "claude";
        } catch (Exception e) {
            return System.getProperty("user.home") + File.separator + "claude";
        }
    }

    private File findTemplateFile(HttpServletRequest request, String fileName) {
        String claudeDir = getClaudeDir(request);
        String[] candidates = {
            claudeDir + File.separator + "양식" + File.separator + fileName,
            claudeDir + File.separator + fileName,
            claudeDir.replace("claude", "etc") + File.separator + "양식" + File.separator + fileName,
        };
        for (String path : candidates) {
            File f = new File(path);
            if (f.exists() && f.isFile()) return f;
        }
        try {
            File webappDir = new File(request.getServletContext().getRealPath("/"));
            File misRoot = webappDir.getParentFile().getParentFile()
                                    .getParentFile().getParentFile();
            File found = findFile(misRoot, fileName, 4);
            if (found != null) return found;
        } catch (Exception ignored) {}
        return null;
    }

    private File findFile(File dir, String name, int depth) {
        if (depth <= 0 || dir == null || !dir.isDirectory()) return null;
        File[] children = dir.listFiles();
        if (children == null) return null;
        for (File f : children) {
            if (f.isFile() && f.getName().equals(name)) return f;
            if (f.isDirectory()) {
                File found = findFile(f, name, depth - 1);
                if (found != null) return found;
            }
        }
        return null;
    }
}
