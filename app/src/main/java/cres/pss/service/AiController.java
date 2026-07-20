package cres.pss.service;

import java.io.*;
import java.net.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.*;
import java.util.zip.*;
import javax.servlet.http.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class AiController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AiController.class);

    // ── Service beans ─────────────────────────────────────────────────────────


    @Autowired
    private ScenarioService scenarioSvc;

    @Autowired
    private SpecGenService specGenSvc;

    @Autowired
    private TestRunnerService testRunner;

    @Autowired
    private ReportService reportSvc;

    @Autowired
    private PurTestCodeGenService purTestCodeGen;

    @Autowired
    private ExportService exportSvc;

    @Autowired
    private OurFormatExportService ourFormatSvc;

    @org.springframework.beans.factory.annotation.Value("${ai.template.cs500-scenario-xlsx:}")
    private String cs500TemplatePath;

    @Autowired
    private ScenarioDao scenarioDao;

    @Autowired
    private MenuResolveDao menuResolveDao;

    @Autowired
    private XfdlScenarioExtractor scenarioExtractor;

    @Autowired
    private ScenarioBuilderService scenarioBuilder;

    @Autowired
    private MenuResolverService menuResolver;

    @Autowired
    @org.springframework.beans.factory.annotation.Qualifier("dataSource")
    private javax.sql.DataSource dataSource;

    @Autowired
    private TestSummaryService testSummarySvc;

    // ── 현재 세션 로그인 사용자명 반환 (auth.setup.ts 세션 사용자 검증용) ─────
    @RequestMapping(value = "/ai/getLoginUserName.do")
    @ResponseBody
    public String getLoginUserName(HttpServletRequest request) {
        String[] keys = { "LOGIN_USER_NM", "USER_NM", "loginUserNm", "userNm",
                          "LOGIN_NM", "login_user_nm", "userName", "USER_NAME" };
        javax.servlet.http.HttpSession session = request.getSession(false);
        if (session != null) {
            for (String key : keys) {
                Object val = session.getAttribute(key);
                if (val != null && !val.toString().trim().isEmpty()) {
                    return val.toString().trim();
                }
            }
        }
        return "";
    }

    // ── XFDL 테스트 자동화 도구 (Node.js 연동) ───────────────────────────────
    @RequestMapping(value = "/pss/xfdlTest.do")
    public String xfdlTest(HttpServletRequest request, ModelMap model) throws Exception {
        // tools/.env 또는 기본 포트에서 Node.js URL 추출
        String nodeUrl = resolveNodeUrl(request);
        model.addAttribute("nodeUrl", nodeUrl);
        return "pss/xfdlTest";
    }

    private String resolveNodeUrl(HttpServletRequest request) {
        try {
            String webRoot = request.getServletContext().getRealPath("/");
            java.nio.file.Path wsRoot = java.nio.file.Paths.get(webRoot).normalize()
                    .getParent().getParent().getParent().getParent().getParent();
            java.nio.file.Path envFile = wsRoot.resolve(".env");
            if (java.nio.file.Files.exists(envFile)) {
                String env = new String(java.nio.file.Files.readAllBytes(envFile), java.nio.charset.StandardCharsets.UTF_8);
                java.util.regex.Matcher m = java.util.regex.Pattern
                        .compile("(?m)^TOOL_PORT\\s*=\\s*(\\d+)")
                        .matcher(env);
                if (m.find()) return "http://localhost:" + m.group(1);
            }
        } catch (Exception ignored) {}
        return "http://localhost:8090";
    }

    // ── 메뉴 트리 조회 (SYS_MENU_MGT 계층, doTest 메뉴 선택 팝업용) ─────────
    @RequestMapping(value = "/ai/getMenuTree.do")
    @ResponseBody
    public Map<String, Object> getMenuTree() {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            List<Map<String, Object>> tree = menuResolveDao.getMenuTree();
            result.put("success", true);
            result.put("list", tree);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        return result;
    }

    @RequestMapping(value = "/ai/doTest.do")
    public String doTest(HttpServletRequest request, ModelMap model) throws Exception {
        String nxuiBase = FilePathHelper.getNxuiBase(request);
        List<String> prefixList = FilePathHelper.getNxuiPrefixList(nxuiBase);
        model.addAttribute("prefixList", prefixList);
        return "pss/doTest";
    }

    // ── STEP 1: 실제 HTML UI (브라우저에서 직접 접근 또는 팝업 URL) ───────────
    @RequestMapping(value = "/ai/doTestUI.do")
    public String doTestUI(HttpServletRequest request, ModelMap model) throws Exception {
        String nxuiBase = FilePathHelper.getNxuiBase(request);
        List<String> prefixList = FilePathHelper.getNxuiPrefixList(nxuiBase);
        model.addAttribute("prefixList", prefixList);
        return "pss/doTest";
    }

    // ── 소스 파일 목록 (xfdl) ────────────────────────────────────────────────
    @RequestMapping(value = "/ai/getSourceList.do")
    @ResponseBody
    public Map<String, Object> getSourceList(HttpServletRequest request,
                                              @RequestParam String prefix) throws Exception {
        String nxuiBase = FilePathHelper.getNxuiBase(request);
        List<Map<String, Object>> sources = new ArrayList<>();
        Map<String, Integer> nameIndex = new LinkedHashMap<>();

        FilePathHelper.addXfdlFiles(new File(nxuiBase + "/mis/" + prefix), "mis", sources, nameIndex);
        FilePathHelper.addXfdlFiles(new File(nxuiBase + "/pms/" + prefix), "pms", sources, nameIndex);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        result.put("sources", sources);
        return result;
    }

    // ── 시나리오 생성 (소스 파일 → Copilot AI 분석) ───────────────────────
    @RequestMapping(value = "/ai/generateScenario.do")
    @ResponseBody
    public Map<String, Object> generateScenario(HttpServletRequest request,
                                                  @RequestBody Map<String, Object> body) throws Exception {
        return scenarioSvc.generateScenario(request, body);
    }

    // ── 시나리오 생성용 파일 임시 저장 ────────────────────────────────────────
    @RequestMapping(value = "/ai/storeScenarioFiles.do")
    @ResponseBody
    public Map<String, Object> storeScenarioFiles(HttpServletRequest request,
                                                   @RequestBody Map<String, Object> body) {
        return scenarioSvc.storeScenarioFiles(request, body);
    }

    // ── 엑셀 업로드로 소스 목록 입력 ─────────────────────────────────────────
    @RequestMapping(value = "/ai/uploadSourceList.do")
    @ResponseBody
    public Map<String, Object> uploadSourceList(
            HttpServletRequest request,
            @RequestParam("file") MultipartFile file) {
        return scenarioSvc.uploadSourceList(request, file);
    }

    // ── 시나리오 생성 스트리밍 (SSE) ─────────────────────────────────────────
    @RequestMapping(value = "/ai/generateScenarioStream.do")
    public void generateScenarioStream(HttpServletRequest request, HttpServletResponse response,
                                        @RequestParam String prefix) throws Exception {
        scenarioSvc.generateScenarioStream(request, response, prefix);
    }

    // ── 소스목록 엑셀 양식 다운로드 ──────────────────────────────────────────────
    @RequestMapping(value = "/ai/downloadSourceTemplate.do")
    public void downloadSourceTemplate(HttpServletRequest request,
                                       HttpServletResponse response) throws Exception {
        scenarioSvc.downloadSourceTemplate(request, response);
    }

    // ── spec.ts 생성 스트리밍 (SSE) — 체크된 시나리오만 처리 ───────────────────
    @RequestMapping(value = "/ai/generateSpecStream.do")
    public void generateSpecStream(HttpServletRequest request, HttpServletResponse response,
                                    @RequestParam(value = "prefix",       required = false, defaultValue = "") String prefix,
                                    @RequestParam(value = "scenarioIds",  required = false, defaultValue = "") String scenarioIds,
                                    @RequestParam(value = "singleRow",    required = false, defaultValue = "false") boolean singleRow,
                                    @RequestParam(value = "userFileName", required = false, defaultValue = "") String userFileName)
            throws Exception {
        if (!userFileName.trim().isEmpty()) {
            request.setAttribute("userFileName", userFileName.trim());
        }
        specGenSvc.generateSpecStream(request, response, prefix, scenarioIds, singleRow);
    }

    // ── 테스트 실행 (SSE) ─────────────────────────────────────────────────────
    @RequestMapping(value = "/ai/runTest.do")
    public void runTest(HttpServletRequest request, HttpServletResponse response,
                        @RequestParam(value = "prefix") String prefix,
                        @RequestParam(value = "headed",      required = false, defaultValue = "true") boolean headed,
                        @RequestParam(value = "specFileName", required = false) String specFileName) throws Exception {
        testRunner.runTest(request, response, prefix, headed, specFileName);
    }

    // ── 테스트 중지 ───────────────────────────────────────────────────────────
    @RequestMapping(value = "/ai/stopTest.do")
    @ResponseBody
    public Map<String, Object> stopTest(HttpServletRequest request, HttpServletResponse response,
                                        @RequestParam String prefix) {
        return testRunner.stopTest(request, response, prefix);
    }

    // ── spec 파일 직접 실행 (SSE — 시나리오 없이 바로 실행) ─────────────────────
    @RequestMapping(value = "/ai/runSpecTest.do")
    public void runSpecTest(HttpServletRequest request, HttpServletResponse response,
                            @RequestParam(value = "specFile") String specFile,
                            @RequestParam(value = "project", required = false, defaultValue = "") String project,
                            @RequestParam(value = "headed", required = false, defaultValue = "true") boolean headed)
            throws Exception {
        testRunner.runSpecTest(request, response, specFile, headed, project);
    }

    // ── spec 테스트 중지 ──────────────────────────────────────────────────────
    @RequestMapping(value = "/ai/stopSpecTest.do")
    @ResponseBody
    public Map<String, Object> stopSpecTest(HttpServletRequest request,
                                            HttpServletResponse response) {
        return testRunner.stopSpecTest(request, response, null);
    }

    // ── AI 리포트 생성 ────────────────────────────────────────────────────────
    @RequestMapping(value = "/ai/generateReport.do")
    @ResponseBody
    public Map<String, Object> generateReport(HttpServletRequest request,
                                               HttpServletResponse response,
                                               @RequestParam String prefix) throws Exception {
        return reportSvc.generateReport(request, response, prefix);
    }

    // ── FAIL 시나리오 개선방안 생성 ────────────────────────────────────────────
    @RequestMapping(value = "/ai/generateDefectFix.do")
    @ResponseBody
    public Map<String, Object> generateDefectFix(HttpServletRequest request,
                                                  HttpServletResponse response,
                                                  @RequestBody Map<String, Object> body) {
        return reportSvc.generateDefectFix(request, response, body);
    }

    // ── 결과 xlsx 다운로드 ─────────────────────────────────────────────────────
    @RequestMapping(value = "/ai/exportScenarioList.do")
    public void exportScenarioList(HttpServletRequest request, HttpServletResponse response,
                                   @RequestBody Map<String, Object> body) throws Exception {
        reportSvc.downloadScenarioList(request, response, body);
    }

    @RequestMapping(value = "/ai/downloadResult.do")
    public void downloadResult(HttpServletRequest request, HttpServletResponse response,
                               @RequestBody Map<String, Object> body) throws Exception {
        reportSvc.downloadResult(request, response, body);
    }

    // ── CS500-TS020 양식 기반 통합테스트시나리오 xlsx 다운로드 ───────────────
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/ai/exportCs500Scenario.do", method = RequestMethod.POST)
    public void exportCs500Scenario(HttpServletRequest request, HttpServletResponse response,
                                    @RequestBody Map<String, Object> body) throws Exception {
        List<Map<String, Object>> scenarios = (List<Map<String, Object>>) body.get("scenarios");
        if (scenarios == null) scenarios = new ArrayList<>();

        String projectName = (String) body.getOrDefault("projectName", "");
        String docTitle    = (String) body.getOrDefault("docTitle", "통합테스트시나리오");

        // 템플릿 경로: body로 전달받거나 프로퍼티 사용
        String tmplPath = (String) body.get("templatePath");
        if (tmplPath == null || tmplPath.isEmpty()) tmplPath = cs500TemplatePath;

        byte[] bytes;
        try {
            bytes = exportSvc.buildCs500ScenarioXlsx(scenarios, projectName, docTitle, tmplPath);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("text/plain;charset=UTF-8");
            response.getWriter().write("CS500 양식 생성 오류: " + e.getMessage());
            return;
        }

        String today    = new SimpleDateFormat("yyyyMMdd").format(new java.util.Date());
        String fileName = java.net.URLEncoder.encode("CS500-TS020-통합테스트시나리오_" + today + ".xlsx", "UTF-8");
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + fileName);
        response.setContentLength(bytes.length);
        response.getOutputStream().write(bytes);
        response.getOutputStream().flush();
    }

    // ── 우리 포맷(파이프라인 01_scenarios.json) JSON 내보내기 ──────────────────
    /**
     * 추가형 내보내기: 현재 시나리오 목록을 테스트 자동화 파이프라인의 per-pgm 포맷
     * (_workspace/{prefix}/01_scenarios.json)으로 변환하여 JSON 파일로 다운로드한다.
     * 기존 프로그램 흐름(그리드/Excel/spec/DB)은 그대로 두고 출력만 별도 생성한다.
     *
     * <p>요청 body: { "prefix": "pur", "scenarios": [ ...flat 시나리오... ] }
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/ai/exportScenariosOurFormat.do", method = RequestMethod.POST)
    public void exportScenariosOurFormat(HttpServletResponse response,
                                         @RequestBody Map<String, Object> body) throws Exception {
        List<Map<String, Object>> scenarios = (List<Map<String, Object>>) body.get("scenarios");
        if (scenarios == null) scenarios = new ArrayList<>();
        String prefix = (String) body.getOrDefault("prefix", "scenario");

        List<Map<String, Object>> our = ourFormatSvc.toOurFormat(scenarios);
        // 파이프라인 01_scenarios.json은 단일 화면 객체 — 화면이 하나면 객체로, 여럿이면 배열로 출력
        Object payload = our.size() == 1 ? our.get(0) : our;

        com.fasterxml.jackson.databind.ObjectMapper om =
                new com.fasterxml.jackson.databind.ObjectMapper();
        byte[] bytes = om.writerWithDefaultPrettyPrinter().writeValueAsBytes(payload);

        String fileName = java.net.URLEncoder.encode("01_scenarios_" + prefix + ".json", "UTF-8");
        response.setContentType("application/json;charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + fileName);
        response.setContentLength(bytes.length);
        response.getOutputStream().write(bytes);
        response.getOutputStream().flush();
    }

    // ── 다중 형식 내보내기 (Java + Python) ───────────────────────────────────
    /**
     * 시나리오/결과서를 선택한 형식(xlsx/html/docx/pdf)으로 생성하고 ZIP으로 반환한다.
     *
     * <p>요청 body:
     * <pre>
     * {
     *   "prefix"   : "pur",
     *   "formats"  : ["xlsx","html","docx","pdf"],
     *   "content"  : ["scenario","result"],   // 포함할 문서 종류
     *   "withJava" : true,                    // Java 라이브러리 파일 포함
     *   "withPython": true                    // Python 라이브러리 파일 포함
     * }
     * </pre>
     *
     * <p>응답: ZIP 파일
     * <pre>
     * export_20260610_1430.zip
     * ├── java/
     * │   ├── 시나리오_java.xlsx / .html / .docx / .pdf
     * │   └── 결과서_java.xlsx  / .html / .docx / .pdf
     * └── python/
     *     ├── 시나리오_python.xlsx / .html / .docx / .pdf
     *     └── 결과서_python.xlsx  / .html / .docx / .pdf
     * </pre>
     */
    @RequestMapping(value = "/ai/exportMultiFormat.do", method = RequestMethod.POST)
    public void exportMultiFormat(HttpServletRequest request, HttpServletResponse response,
                                  @RequestBody Map<String, Object> body) throws Exception {
        String prefix = (String) body.getOrDefault("prefix", "pur");

        @SuppressWarnings("unchecked")
        List<String> formats = body.get("formats") instanceof List
            ? (List<String>) body.get("formats")
            : new ArrayList<>(Arrays.asList("xlsx", "html"));

        @SuppressWarnings("unchecked")
        List<String> content = body.get("content") instanceof List
            ? (List<String>) body.get("content")
            : new ArrayList<>(Arrays.asList("scenario", "result"));

        boolean withJava   = !Boolean.FALSE.equals(body.get("withJava"));
        boolean withPython = !Boolean.FALSE.equals(body.get("withPython"));

        // 시나리오 데이터 — prefix 우선, 없으면 SCENARIO_STORE 전체 수집
        List<Map<String, Object>> scenarios = AiStateStore.SCENARIO_STORE.get(prefix);
        if (scenarios == null || scenarios.isEmpty()) {
            scenarios = new ArrayList<>();
            for (List<Map<String, Object>> list : AiStateStore.SCENARIO_STORE.values()) {
                if (list != null) scenarios.addAll(list);
            }
        }
        if (scenarios == null || scenarios.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\":false,\"message\":\"시나리오 없음. 먼저 시나리오를 생성하세요.\"}");
            return;
        }

        String today  = new SimpleDateFormat("yyyyMMdd_HHmm").format(new Date());
        String zipFn  = "export_" + today + ".zip";

        ByteArrayOutputStream zipBaos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(zipBaos,
                java.nio.charset.StandardCharsets.UTF_8)) {

            boolean doScenario = content.contains("scenario");
            boolean doResult   = content.contains("result");

            // ── Java 파일 생성 ──────────────────────────────────────────
            if (withJava) {
                for (String fmt : formats) {
                    if (doScenario) {
                        byte[] bytes = buildJavaFile(fmt, "시나리오", scenarios, false);
                        if (bytes != null) addZipEntry(zos, "java/시나리오_java." + fmt, bytes);
                    }
                    if (doResult) {
                        byte[] bytes = buildJavaFile(fmt, "통합테스트결과서", scenarios, true);
                        if (bytes != null) addZipEntry(zos, "java/결과서_java." + fmt, bytes);
                    }
                }
            }

            // ── Python 파일 생성 ────────────────────────────────────────
            if (withPython) {
                File tempDir = null;
                try {
                    tempDir = createTempDir("export_py_");
                    File jsonFile = writeJsonFile(tempDir, scenarios);

                    for (String docType : new String[]{"scenario", "result"}) {
                        boolean needed = "scenario".equals(docType) ? doScenario : doResult;
                        if (!needed) continue;

                        File outDir = new File(tempDir, docType);
                        outDir.mkdirs();

                        List<Map<String, Object>> pyFiles = runPythonExport(
                            request, jsonFile, outDir, formats, docType);

                        String zipFolder = "python/";
                        for (Map<String, Object> pf : pyFiles) {
                            File file = new File((String) pf.get("path"));
                            if (file.exists() && file.isFile()) {
                                byte[] bytes = readFileBytes(file);
                                addZipEntry(zos, zipFolder + file.getName(), bytes);
                            }
                        }
                    }
                } finally {
                    if (tempDir != null) deleteDirRecursive(tempDir);
                }
            }
        }

        byte[] zipBytes = zipBaos.toByteArray();

        // ZIP 파일이 사실상 비어있는 경우 (항목 0개) — 클라이언트에 에러 반환
        if (zipBytes.length < 100) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\":false,\"message\":"
                + "\"파일 생성 실패. 서버 로그에서 상세 오류를 확인하세요.\"}");
            return;
        }

        response.reset();
        response.setContentType("application/zip");
        response.setContentLength(zipBytes.length);
        response.setHeader("Content-Disposition",
            "attachment; filename*=UTF-8''" +
            URLEncoder.encode(zipFn, "UTF-8").replace("+", "%20"));
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.getOutputStream().write(zipBytes);
        response.getOutputStream().flush();
    }

    /** 형식(fmt)에 따라 Java 라이브러리로 파일 바이트 생성 */
    private byte[] buildJavaFile(String fmt, String title,
                                  List<Map<String, Object>> scenarios,
                                  boolean includeResult) {
        try {
            switch (fmt) {
                case "xlsx": return includeResult
                    ? exportSvc.buildResultXlsx(scenarios)
                    : exportSvc.buildScenarioXlsx(scenarios);
                case "html": return exportSvc.buildHtml(title, scenarios, includeResult);
                case "pdf":  return exportSvc.buildPdf(title, scenarios, includeResult);
                default:     return null;
            }
        } catch (Exception e) {
            System.err.println("[ExportService] " + fmt + " 생성 실패: " + e.getMessage());
            return null;
        }
    }

    /**
     * Python export_files.py 실행 → 생성된 파일 목록 반환
     * 반환: [{path, fmt}]
     */
    private List<Map<String, Object>> runPythonExport(
            HttpServletRequest request,
            File jsonFile, File outDir,
            List<String> formats, String docType) {

        List<Map<String, Object>> result = new ArrayList<>();
        String python = findPython();
        if (python == null) return result;

        // export_files.py 위치: etc/ai/python/export_files.py
        File aiBase = FilePathHelper.getAiBaseDir(request);
        File script = new File(aiBase, "python/export_files.py");
        if (!script.exists()) return result;

        String formatsArg = String.join(",", formats);

        try {
            ProcessBuilder pb = new ProcessBuilder(
                python, "-u",
                script.getAbsolutePath(),
                jsonFile.getAbsolutePath(),
                outDir.getAbsolutePath(),
                formatsArg,
                docType
            );
            pb.directory(aiBase);
            pb.redirectErrorStream(true);

            Map<String, String> env = pb.environment();
            injectPythonPath(env);
            env.put("PYTHONIOENCODING", "utf-8");
            env.put("PYTHONUTF8",       "1");

            Process proc = pb.start();
            StringBuilder stdOut = new StringBuilder();
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(proc.getInputStream(), "UTF-8"))) {
                String line;
                while ((line = br.readLine()) != null) {
                    stdOut.append(line).append("\n");
                    if (line.startsWith("JSON_RESULT:")) {
                        // JSON 결과 파싱
                        String json = line.substring("JSON_RESULT:".length());
                        parseJsonResult(json, result);
                    }
                }
            }
            proc.waitFor(120, java.util.concurrent.TimeUnit.SECONDS);

        } catch (Exception ignored) {}

        return result;
    }

    /** 간단한 JSON 파싱 (외부 라이브러리 불필요) */
    @SuppressWarnings("unchecked")
    private void parseJsonResult(String json, List<Map<String, Object>> result) {
        try {
            // "generated":["path1","path2"] 추출
            Pattern p = Pattern.compile("\"generated\"\\s*:\\s*\\[([^\\]]*)]");
            Matcher m = p.matcher(json);
            if (m.find()) {
                String arr = m.group(1);
                Pattern strPat = Pattern.compile("\"([^\"]+)\"");
                Matcher sm = strPat.matcher(arr);
                while (sm.find()) {
                    String path = sm.group(1);
                    Map<String, Object> entry = new LinkedHashMap<>();
                    entry.put("path", path);
                    result.add(entry);
                }
            }
        } catch (Exception ignored) {}
    }

    /** 임시 디렉토리 생성 */
    private File createTempDir(String prefix) throws IOException {
        File tmp = File.createTempFile(prefix, "");
        tmp.delete();
        tmp.mkdirs();
        return tmp;
    }

    /** 시나리오 데이터를 JSON 파일로 임시 저장 */
    private File writeJsonFile(File dir, List<Map<String, Object>> scenarios) throws IOException {
        File f = new File(dir, "scenarios.json");
        StringBuilder sb = new StringBuilder("[\n");
        for (int i = 0; i < scenarios.size(); i++) {
            Map<String, Object> s = scenarios.get(i);
            sb.append("  {");
            boolean first = true;
            for (Map.Entry<String, Object> e : s.entrySet()) {
                if (!first) sb.append(",");
                String val = e.getValue() == null ? "" : e.getValue().toString();
                // JSON 특수문자 이스케이프
                val = val.replace("\\","\\\\").replace("\"","\\\"")
                         .replace("\n","\\n").replace("\r","\\r")
                         .replace("\t","\\t");
                sb.append("\"").append(e.getKey()).append("\":\"").append(val).append("\"");
                first = false;
            }
            sb.append("}");
            if (i < scenarios.size() - 1) sb.append(",");
            sb.append("\n");
        }
        sb.append("]");
        try (OutputStreamWriter w = new OutputStreamWriter(new FileOutputStream(f), "UTF-8")) {
            w.write(sb.toString());
        }
        return f;
    }

    /** 파일을 byte[]로 읽기 */
    private byte[] readFileBytes(File file) throws IOException {
        return java.nio.file.Files.readAllBytes(file.toPath());
    }

    /** 디렉토리와 하위 파일 삭제 */
    private void deleteDirRecursive(File dir) {
        if (dir == null || !dir.exists()) return;
        File[] children = dir.listFiles();
        if (children != null) {
            for (File c : children) {
                if (c.isDirectory()) deleteDirRecursive(c);
                else c.delete();
            }
        }
        dir.delete();
    }

    /** ZIP 항목 추가 */
    private void addZipEntry(ZipOutputStream zos, String name, byte[] data) throws IOException {
        ZipEntry entry = new ZipEntry(name);
        entry.setSize(data.length);
        zos.putNextEntry(entry);
        zos.write(data);
        zos.closeEntry();
    }

    // ── MD 파일 캐시 초기화 (spec-rules.md 등 수정 후 반영) ──────────────────
    @RequestMapping(value = "/ai/reloadMd.do")
    @ResponseBody
    public Map<String, Object> reloadMdCache() {
        int count = AiStateStore.MD_CACHE.size();
        AiStateStore.MD_CACHE.clear();
        Map<String, Object> r = new java.util.LinkedHashMap<>();
        r.put("success", true);
        r.put("message", "MD 캐시 초기화 완료 (" + count + "개 항목 제거). 다음 AI 호출 시 파일을 새로 읽습니다.");
        return r;
    }


    // ── [V6] 시나리오 DB 저장 (기존 그룹 UPDATE or 신규 INSERT) ──────────────
    @RequestMapping(value = "/ai/saveScenarioToDB.do", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> saveScenarioToDB(HttpServletRequest request,
                                                  @RequestBody(required = false) Map<String, Object> body) {
        if (body == null) body = new LinkedHashMap<>();
        return scenarioSvc.saveScenariosToDB(request, body);
    }

    // ── [V6] 이력 추가: 새 GRP_ID 발급 후 저장 ───────────────────────────────
    @RequestMapping(value = "/ai/addHistoryGroup.do", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> addHistoryGroup(HttpServletRequest request,
                                                @RequestBody(required = false) Map<String, Object> body) {
        if (body == null) body = new LinkedHashMap<>();
        return scenarioSvc.addHistoryGroup(request, body);
    }

    // ── [V6] 시나리오 그룹 목록 조회 (AI_SCEN_GRP) ───────────────────────────
    @RequestMapping(value = "/ai/getScenarioGroups.do")
    @ResponseBody
    public Map<String, Object> getScenarioGroups(HttpServletRequest request) {
        return scenarioSvc.getScenarioGroups();
    }

    // ── [V6] 그룹별 시나리오 조회 (AI_SCEN) ──────────────────────────────────
    @RequestMapping(value = "/ai/getScenariosByGroup.do")
    @ResponseBody
    public Map<String, Object> getScenariosByGroup(HttpServletRequest request,
                                                    @RequestParam String grpId) {
        return scenarioSvc.getScenariosByGroup(grpId);
    }

    // ── [V6] TC 생성 이력 조회 (AI_TC_GEN_HIST) ──────────────────────────────
    @RequestMapping(value = "/ai/getTcGenHistList.do")
    @ResponseBody
    public Map<String, Object> getTcGenHistList(HttpServletRequest request) {
        return scenarioSvc.getTcGenHistList();
    }

    // ── spec.ts 내용 읽기 ─────────────────────────────────────────────────────
    @RequestMapping(value = "/ai/getSpecContent.do")
    @ResponseBody
    public Map<String, Object> getSpecContent(HttpServletRequest request,
                                               @RequestParam(value = "specFile", required = false) String specFile,
                                               @RequestParam(value = "prefix",   required = false, defaultValue = "") String prefix) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            if (specFile == null || specFile.isEmpty())
                specFile = AiStateStore.SPEC_FILE_STORE.get(prefix);
            if (specFile == null || specFile.isEmpty()) {
                result.put("success", false); result.put("message", "spec 파일 없음"); return result;
            }
            final String target = specFile;
            File found = null;
            // 1순위: 파일명→절대경로 직접 조회 (서버 재시작 없이 현재 세션 파일 즉시 조회)
            String storedPath = AiStateStore.SPEC_OUTPUT_DIR.get(target);
            if (storedPath != null && !storedPath.isEmpty()) {
                File direct = new File(storedPath);
                if (direct.exists()) found = direct;
            }
            // 2순위: prefix 기준 디렉토리
            if (found == null) {
                String storedDir = AiStateStore.SPEC_OUTPUT_DIR.get(prefix);
                if (storedDir != null && !storedDir.isEmpty()) {
                    File direct = new File(storedDir, target);
                    if (direct.exists()) found = direct;
                }
            }
            // 3순위: getSpecDir() 하위 재귀 탐색
            if (found == null) {
                File testsDir = FilePathHelper.getSpecDir(request);
                found = findFileRecursive(testsDir, target);
            }
            if (found == null) { result.put("success", false); result.put("message", "파일 없음: " + target); return result; }
            result.put("success", true);
            result.put("content", FilePathHelper.readFileSafe(found));
            result.put("path", found.getAbsolutePath());
        } catch (Exception e) { result.put("success", false); result.put("message", e.getMessage()); }
        return result;
    }

    // ── spec.ts 내용 저장 ─────────────────────────────────────────────────────
    @RequestMapping(value = "/ai/saveSpecContent.do", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> saveSpecContent(HttpServletRequest request,
                                                @RequestBody(required = false) Map<String, Object> body) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            if (body == null) { result.put("success", false); result.put("message", "body 없음"); return result; }
            String specFile = body.get("specFile") != null ? body.get("specFile").toString() : "";
            String content  = body.get("content")  != null ? body.get("content").toString()  : "";
            String prefix   = body.get("prefix")   != null ? body.get("prefix").toString()   : "";
            if (specFile.isEmpty()) specFile = AiStateStore.SPEC_FILE_STORE.get(prefix);
            if (specFile == null || specFile.isEmpty()) { result.put("success", false); result.put("message", "specFile 없음"); return result; }
            final String target = specFile;
            File found = findFileRecursive(FilePathHelper.getSpecDir(request), target);
            if (found == null) { result.put("success", false); result.put("message", "파일 없음: " + target); return result; }
            try (java.io.OutputStreamWriter w = new java.io.OutputStreamWriter(new java.io.FileOutputStream(found), "UTF-8")) { w.write(content); }
            result.put("success", true); result.put("message", "저장 완료: " + found.getName());
        } catch (Exception e) { result.put("success", false); result.put("message", e.getMessage()); }
        return result;
    }

    // ── 엑셀 시나리오 → SCENARIO_STORE 로드 ─────────────────────────────────
    /**
     * 기존 Excel(pur_test_scenarios_*.xlsx) 또는 업로드된 파일을
     * SCENARIO_STORE에 로드하여 spec.ts 생성 흐름에서 사용 가능하게 한다.
     *
     * 반환: { success, prefix, count, scenarios }
     */
    @RequestMapping(value = "/ai/loadScenarioFromExcel.do")
    @ResponseBody
    public Map<String, Object> loadScenarioFromExcel(
            HttpServletRequest request,
            @RequestParam String file) throws Exception {
        Map<String, Object> result = new LinkedHashMap<>();
        File xlsx = resolvePurXlsx(request, file);
        if (xlsx == null || !xlsx.exists()) {
            result.put("success", false);
            result.put("message", "파일 없음: " + file);
            return result;
        }
        List<Map<String, Object>> scenarios = excelToScenarios(xlsx);
        String prefix = "pur";
        AiStateStore.SCENARIO_STORE.put(prefix, scenarios);
        result.put("success", true);
        result.put("prefix",   prefix);
        result.put("count",    scenarios.size());
        result.put("scenarios", scenarios);
        return result;
    }

    // ── spec.ts 파일 가져오기 (드래그앤드롭 업로드) ──────────────────────────
    @RequestMapping(value = "/ai/importSpecFile.do", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> importSpecFile(HttpServletRequest request,
                                               @RequestBody Map<String, Object> body) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            String filename = body.get("filename") != null ? body.get("filename").toString() : "";
            String content  = body.get("content")  != null ? body.get("content").toString()  : "";
            String prefix   = body.get("prefix")   != null ? body.get("prefix").toString()   : "imported";
            if (filename.isEmpty() || !filename.toLowerCase().endsWith(".ts")) {
                result.put("success", false); result.put("message", ".ts 파일만 가져올 수 있습니다."); return result;
            }
            String safeName = filename.replaceAll("[^a-zA-Z0-9._\\-]", "_");
            File specDir = FilePathHelper.getSpecDir(request);
            if (!specDir.exists()) specDir.mkdirs();
            File target = new File(specDir, safeName);
            try (java.io.OutputStreamWriter w = new java.io.OutputStreamWriter(
                    new java.io.FileOutputStream(target), "UTF-8")) { w.write(content); }
            AiStateStore.SPEC_FILE_STORE.put(prefix, safeName);
            result.put("success", true);
            result.put("message", "가져오기 완료: " + safeName);
            result.put("specFile", safeName);
        } catch (Exception e) { result.put("success", false); result.put("message", e.getMessage()); }
        return result;
    }

    // ── 에디터 편집 내용 → SCENARIO_STORE 저장 + spec.ts 생성 준비 ───────────
    /**
     * 인라인 에디터에서 수정한 시나리오 JSON을 SCENARIO_STORE에 저장한다.
     * 저장 후 /ai/generateSpecStream.do?prefix=pur 를 호출하면 spec.ts 생성 시작.
     *
     * 반환: { success, prefix, count }
     */
    @RequestMapping(value = "/ai/storeEditedScenarios.do", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> storeEditedScenarios(
            HttpServletRequest request,
            @RequestBody Map<String, Object> body) {
        Map<String, Object> result = new LinkedHashMap<>();
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> editorRows =
            (List<Map<String, Object>>) body.get("rows");
        if (editorRows == null) {
            result.put("success", false);
            result.put("message", "rows 없음");
            return result;
        }
        // 에디터 컬럼명 → SCENARIO_STORE 필드명 변환
        List<Map<String, Object>> scenarios = new ArrayList<>();
        int no = 1;
        for (Map<String, Object> row : editorRows) {
            Map<String, Object> s = new LinkedHashMap<>();
            s.put("no",              parseIntSafe(fe(row,"순번","No",String.valueOf(no)), no));
            s.put("testType",        fe(row,"구분","testType",""));
            s.put("scenarioId",      fe(row,"시나리오ID","scenarioId",""));
            String scNo = fe(row,"화면번호","소분류","subCategory","pgmId","sourceName","");
            s.put("sourceName",      scNo.toUpperCase());
            s.put("screenId",        scNo);
            s.put("displayName",     fe(row,"화면명","시나리오명","testName","menuName",""));
            s.put("origin",          "mis");
            s.put("gnbName",         fe(row,"gnbName","대메뉴(GNB)","구매관리"));
            s.put("groupName",       fe(row,"groupName","카테고리","중분류",""));
            s.put("subCategory",     fe(row,"subCategory","소분류",""));
            s.put("menuName",        fe(row,"menuName","화면명","시나리오명",""));
            s.put("menuPath",        fe(row,"menuPath","메뉴경로",""));
            s.put("testName",        fe(row,"testName","테스트명","설명",""));
            s.put("roleNm",          fe(row,"roleNm","엑터(역할)","역할",""));
            s.put("url",             fe(row,"url","URL",""));
            s.put("method",          fe(row,"method","POST"));
            s.put("crudType",        fe(row,"crudType","CRUD",""));
            s.put("preCondition",    fe(row,"preCondition","사전조건","시나리오흐름",""));
            String inputVal = fe(row,"inputValues","testData","입력값","테스트데이터","");
            s.put("inputValues",     inputVal);
            s.put("testData",        inputVal);
            s.put("expectedResult",  fe(row,"expectedResult","예상결과","기대결과",""));
            s.put("testResult",      fe(row,"testResult","테스트결과","판정결과",""));
            s.put("confirmer",       fe(row,"confirmer","확인자",""));
            s.put("judgmentResult",  fe(row,"judgmentResult","판정결과",""));
            s.put("plConfirm",       fe(row,"plConfirm","PL확인","pl확인",""));
            s.put("reason",          fe(row,"reason","사유",""));
            s.put("userConfirm",     fe(row,"userConfirm","사용자확인",""));
            s.put("remark",          fe(row,"remark","비고",""));
            s.put("relationType",    "기본");
            s.put("hasGw",           false);
            s.put("affectedPrograms", new ArrayList<>());
            s.put("inputDsId",       "ds_search");
            s.put("inputCols",       new ArrayList<>());
            s.put("outputDsId",      "ds_list");
            s.put("outputCols",      new ArrayList<>());
            scenarios.add(s);
            no++;
        }
        String prefix = "pur";
        AiStateStore.SCENARIO_STORE.put(prefix, scenarios);
        result.put("success", true);
        result.put("prefix",  prefix);
        result.put("count",   scenarios.size());
        return result;
    }

    // ── 클라이언트 시나리오 배열 → SCENARIO_STORE 동기화 ──────────────────
    /**
     * 화면의 scenarios[] 배열을 SCENARIO_STORE에 직접 저장한다.
     * spec.ts 생성 전 호출하여 서버 재시작 / 수동 추가 시나리오 누락을 방지한다.
     *
     * 요청: { prefix: "...", scenarios: [...] }
     * 반환: { success, prefix, count }
     */
    @RequestMapping(value = "/ai/syncScenariosToStore.do", method = RequestMethod.POST)
    @ResponseBody
    @SuppressWarnings("unchecked")
    public Map<String, Object> syncScenariosToStore(
            @RequestBody Map<String, Object> body) {
        Map<String, Object> result = new LinkedHashMap<>();
        String prefix = body.get("prefix") != null ? body.get("prefix").toString().trim() : "";
        if (prefix.isEmpty()) prefix = "user";

        Object raw = body.get("scenarios");
        if (!(raw instanceof List)) {
            result.put("success", false);
            result.put("message", "scenarios 없음");
            return result;
        }
        List<Map<String, Object>> scenarios = (List<Map<String, Object>>) raw;
        if (scenarios.isEmpty()) {
            result.put("success", false);
            result.put("message", "빈 시나리오 목록");
            return result;
        }

        // menuName/gnbName 누락 보완 — testName → menuName 대체
        for (Map<String, Object> s : scenarios) {
            if (isBlank(s, "menuName") && isBlank(s, "gnbName")) {
                String tn = str(s, "testName");
                if (!tn.isEmpty()) {
                    s.put("menuName", tn);
                }
            }
        }

        AiStateStore.SCENARIO_STORE.put(prefix, scenarios);
        System.out.println("[syncScenariosToStore] prefix=" + prefix + " count=" + scenarios.size());
        result.put("success", true);
        result.put("prefix",  prefix);
        result.put("count",   scenarios.size());
        return result;
    }

    private boolean isBlank(Map<String, Object> m, String key) {
        Object v = m.get(key);
        return v == null || v.toString().trim().isEmpty();
    }

    /** Excel 시나리오 → SCENARIO_STORE 포맷 변환 (구/신 양식 공용) */
    private List<Map<String, Object>> excelToScenarios(File xlsx) throws Exception {
        List<Map<String, Object>> scenarios = new ArrayList<>();
        List<String> headers = new ArrayList<>();
        try (FileInputStream fis = new FileInputStream(xlsx);
             XSSFWorkbook wb = new XSSFWorkbook(fis)) {
            // "시나리오" 포함 시트 우선 탐색 (신 양식: 시나리오및결과서)
            Sheet sheet = null;
            for (int si = 0; si < wb.getNumberOfSheets(); si++) {
                if (wb.getSheetName(si).contains("시나리오")) { sheet = wb.getSheetAt(si); break; }
            }
            if (sheet == null) sheet = wb.getSheetAt(0);

            // 헤더 행 판별: 1행 비어있지 않고 2행 첫셀 비어있으면 2행 헤더 구조 (신 양식)
            Row hRow0 = sheet.getRow(0);
            Row hRow1 = sheet.getRow(1);
            String fc0 = hRow0 != null ? getCellStr(hRow0.getCell(0)) : "";
            String fc1 = hRow1 != null ? getCellStr(hRow1.getCell(0)) : "";
            boolean twoRowHeader = !fc0.isEmpty() && fc1.isEmpty();
            int dataStart;
            if (twoRowHeader) {
                int maxCol = Math.max(hRow0 != null ? hRow0.getLastCellNum() : 0,
                                      hRow1 != null ? hRow1.getLastCellNum() : 0);
                for (int ci = 0; ci < maxCol; ci++) {
                    String h0 = hRow0 != null ? getCellStr(hRow0.getCell(ci)) : "";
                    String h1 = hRow1 != null ? getCellStr(hRow1.getCell(ci)) : "";
                    headers.add(!h1.isEmpty() ? h1 : h0);
                }
                dataStart = 2;
            } else {
                // 구 양식: 0행=제목, 1행=헤더
                if (hRow1 != null) for (Cell c : hRow1) headers.add(getCellStr(c));
                else if (hRow0 != null) for (Cell c : hRow0) headers.add(getCellStr(c));
                dataStart = hRow1 != null ? 2 : 1;
            }

            for (int ri = dataStart; ri <= sheet.getLastRowNum(); ri++) {
                Row row = sheet.getRow(ri);
                if (row == null) continue;
                Map<String, Object> raw = new LinkedHashMap<>();
                boolean allEmpty = true;
                for (int ci = 0; ci < headers.size(); ci++) {
                    Cell c = row.getCell(ci);
                    String v = c != null ? getCellStr(c) : "";
                    raw.put(headers.get(ci), v);
                    if (!v.isEmpty()) allEmpty = false;
                }
                if (allEmpty) continue;

                Map<String, Object> s = new LinkedHashMap<>();
                int rowNo = ri - dataStart + 1;
                s.put("no",             parseIntSafe(fe(raw,"순번","No"), rowNo));
                s.put("testType",       fe(raw,"구분",""));
                s.put("scenarioId",     fe(raw,"시나리오ID",""));
                String scNo = fe(raw,"화면번호","소분류","");
                s.put("sourceName",     scNo.toUpperCase());
                s.put("screenId",       scNo);
                String scNm = fe(raw,"화면명","시나리오명","메뉴명","");
                s.put("displayName",    scNm);
                s.put("origin",         "mis");
                s.put("gnbName",        "구매관리");
                s.put("groupName",      fe(raw,"카테고리","중분류",""));
                s.put("menuName",       fe(raw,"화면명","시나리오명","메뉴명",""));
                s.put("testName",       fe(raw,"테스트명","설명",""));
                s.put("url",            fe(raw,"URL",""));
                s.put("method",         "POST");
                s.put("crudType",       fe(raw,"CRUD",""));
                s.put("preCondition",   fe(raw,"사전조건","시나리오흐름",""));
                s.put("testData",       fe(raw,"테스트데이터",""));
                s.put("expectedResult", fe(raw,"예상결과","기대결과",""));
                s.put("testResult",     fe(raw,"테스트결과","판정결과",""));
                s.put("remark",         fe(raw,"비고",""));
                s.put("relationType",   "기본");
                s.put("hasGw",          false);
                s.put("affectedPrograms", new ArrayList<>());
                s.put("inputDsId",      "ds_search");
                s.put("inputCols",      new ArrayList<>());
                s.put("outputDsId",     "ds_list");
                s.put("outputCols",     new ArrayList<>());
                scenarios.add(s);
            }
        }
        return scenarios;
    }

    /** 여러 키를 순서대로 조회해 처음 비어있지 않은 값 반환 (마지막 인자 = 기본값) */
    private String fe(Map<String, Object> map, String... keysAndDefault) {
        for (int i = 0; i < keysAndDefault.length - 1; i++) {
            String v = str(map, keysAndDefault[i]);
            if (!v.isEmpty()) return v;
        }
        return keysAndDefault[keysAndDefault.length - 1];
    }

    private String str(Map<String, Object> m, String k) {
        Object v = m.get(k); return v != null ? String.valueOf(v) : "";
    }
    private int parseIntSafe(String s, int def) {
        try { return Integer.parseInt(s.trim()); } catch (Exception e) { return def; }
    }

    private File findFileRecursive(File dir, String name) {
        if (dir == null || !dir.exists() || !dir.isDirectory()) return null;
        File[] files = dir.listFiles();
        if (files == null) return null;
        for (File f : files) {
            if (f.isFile() && f.getName().equals(name)) return f;
            if (f.isDirectory()) { File found = findFileRecursive(f, name); if (found != null) return found; }
        }
        return null;
    }

    // ── PUR 시나리오 데이터 조회 (Excel → JSON) ─────────────────────────────
    // ── PUR 시나리오 Excel 업로드 (드래그앤드롭 / 파일선택) ─────────────────────
    @RequestMapping(value = "/ai/uploadPurScenarioExcel.do", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> uploadPurScenarioExcel(
            HttpServletRequest request,
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            String filename = file.getOriginalFilename();
            if (filename == null || (!filename.toLowerCase().endsWith(".xlsx") && !filename.toLowerCase().endsWith(".xls"))) {
                result.put("success", false); result.put("message", "Excel 파일(.xlsx)만 업로드 가능합니다."); return result;
            }

            // ① 업로드 바이트를 디스크에 저장 (loadRawFromExcel 이 File 을 받으므로)
            byte[] bytes = file.getBytes();
            File saveDir = new File(FilePathHelper.getAiBaseDir(request), "excel");
            if (!saveDir.exists()) saveDir.mkdirs();
            File saved = new File(saveDir, filename);
            try (FileOutputStream fos = new FileOutputStream(saved)) { fos.write(bytes); }

            // ② loadFromExcel 로 파싱 + 메뉴명/역할(enrichRoles) 후처리
            java.io.PrintWriter dummyWriter = new java.io.PrintWriter(new java.io.StringWriter());
            String nxuiBase = FilePathHelper.getNxuiBase(request);
            purTestCodeGen.loadFromExcel(saved, dummyWriter, nxuiBase);
            // ③ SCENARIO_STORE 는 loadFromExcel 내부에서 이미 저장됨
            List<Map<String, Object>> scenarios = AiStateStore.SCENARIO_STORE.getOrDefault("pur", java.util.Collections.emptyList());

            // ④ 업로드된 소스 목록을 PENDING_FILES["pur"] 에 저장
            // → runPurScenarioGen.do 의 filterByCheckedFiles() 가 이 목록으로 필터링
            java.util.Set<String> seenSrc = new java.util.LinkedHashSet<>();
            List<Map<String, Object>> pendingFiles = new java.util.ArrayList<>();
            for (Map<String, Object> s : scenarios) {
                String sn = (s.get("sourceName") != null ? String.valueOf(s.get("sourceName")) : "").trim().toUpperCase();
                if (sn.isEmpty()) sn = (s.get("pgmId") != null ? String.valueOf(s.get("pgmId")) : "").trim().toUpperCase();
                if (sn.isEmpty()) {
                    // scenarioId에서 소스명 추출: IT_PUR_5110M → PUR_5110M
                    String sid = (s.get("scenarioId") != null ? String.valueOf(s.get("scenarioId")) : "");
                    sn = sid.replaceAll("(?i)^(UT|IT|E2E)_", "").trim().toUpperCase();
                }
                if (!sn.isEmpty() && seenSrc.add(sn)) {
                    Map<String, Object> f = new java.util.LinkedHashMap<>();
                    f.put("displayName", sn + ".xfdl");
                    pendingFiles.add(f);
                }
            }
            if (!pendingFiles.isEmpty()) {
                AiStateStore.PENDING_FILES.put("pur", pendingFiles);
            }

            result.put("success",  true);
            result.put("prefix",   "pur");
            result.put("count",    scenarios.size());
            result.put("filePath", saved.getAbsolutePath().replace("\\", "/"));
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    /** SCENARIO_STORE 에 저장된 시나리오 목록을 JSON으로 반환 */
    @RequestMapping(value = "/ai/getScenariosFromStore.do")
    @ResponseBody
    public Map<String, Object> getScenariosFromStore(
            @RequestParam(defaultValue = "pur") String prefix) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<Map<String, Object>> list = AiStateStore.SCENARIO_STORE.get(prefix);
        /* ── 입력값 디버그 출력 ── */
        if (list != null) {
            System.out.println("[getScenariosFromStore] prefix=" + prefix + "  총 " + list.size() + "건");
            for (int i = 0; i < Math.min(list.size(), 5); i++) {
                Map<String, Object> s = list.get(i);
                System.out.println("  [" + i + "] scenarioId=" + s.get("scenarioId")
                    + "  roleNm=\"" + s.get("roleNm") + "\""
                    + "  inputValues=\"" + s.get("inputValues") + "\""
                    + "  sourceName=\"" + s.get("sourceName") + "\"");
            }
        } else {
            System.out.println("[getScenariosFromStore] prefix=" + prefix + " → STORE 없음");
        }
        result.put("success",   list != null);
        result.put("scenarios", list != null ? list : new ArrayList<>());
        result.put("count",     list != null ? list.size() : 0);
        return result;
    }

    @RequestMapping(value = "/ai/getPurScenarioData.do")
    @ResponseBody
    public Map<String, Object> getPurScenarioData(
            HttpServletRequest request,
            @RequestParam String file) throws Exception {
        File xlsx = resolvePurXlsx(request, file);
        Map<String, Object> result = new LinkedHashMap<>();
        if (xlsx == null || !xlsx.exists()) {
            result.put("success", false);
            result.put("message", "파일 없음: " + file);
            return result;
        }
        List<Map<String, Object>> rows = new ArrayList<>();
        List<String> headers = new ArrayList<>();
        int dataStartRow;   // 데이터가 시작되는 행 인덱스 (0-based)
        int sheetIdx;
        try (FileInputStream fis = new FileInputStream(xlsx);
             XSSFWorkbook wb = new XSSFWorkbook(fis)) {
            // "시나리오" 포함 시트 우선 탐색, 없으면 마지막 시트
            Sheet sheet = null;
            sheetIdx = wb.getNumberOfSheets() - 1;
            for (int si = 0; si < wb.getNumberOfSheets(); si++) {
                if (wb.getSheetName(si).contains("시나리오")) {
                    sheet = wb.getSheetAt(si);
                    sheetIdx = si;
                    break;
                }
            }
            if (sheet == null) sheet = wb.getSheetAt(sheetIdx);

            // 헤더 행 판별:
            // - 1행(ri=0)과 2행(ri=1)이 모두 헤더인 경우(양식 형식): 2행 값 우선, 없으면 1행 값 사용
            // - 1행만 헤더(기존 형식): ri=0이 헤더, ri=1이 첫 데이터
            Row hRow0 = sheet.getRow(0);
            Row hRow1 = sheet.getRow(1);
            String firstCell0 = hRow0 != null ? getCellStr(hRow0.getCell(0)) : "";
            String firstCell1 = hRow1 != null ? getCellStr(hRow1.getCell(0)) : "";
            // 1행 첫 셀이 헤더명이고 2행 첫 셀도 비어 있으면 2행부터 데이터 (양식 구조)
            // 2행 첫 셀에 값이 있으면 2행부터 데이터 (기존 구조)
            boolean twoRowHeader = !firstCell0.isEmpty() && firstCell1.isEmpty();

            if (twoRowHeader) {
                // 양식 구조: 1행+2행 합산으로 헤더 구성, 데이터는 3행(ri=2)~
                int maxCol = Math.max(
                    hRow0 != null ? hRow0.getLastCellNum() : 0,
                    hRow1 != null ? hRow1.getLastCellNum() : 0);
                for (int ci = 0; ci < maxCol; ci++) {
                    String h0 = hRow0 != null ? getCellStr(hRow0.getCell(ci)) : "";
                    String h1 = hRow1 != null ? getCellStr(hRow1.getCell(ci)) : "";
                    headers.add(!h1.isEmpty() ? h1 : h0);
                }
                dataStartRow = 2;
            } else {
                // 기존 구조: 1행이 헤더, 데이터는 2행(ri=1)~
                if (hRow0 != null) for (Cell cell : hRow0) headers.add(getCellStr(cell));
                dataStartRow = 1;
            }

            // 데이터 행 읽기
            int lastRow = sheet.getLastRowNum();
            for (int ri = dataStartRow; ri <= lastRow; ri++) {
                Row row = sheet.getRow(ri);
                if (row == null) continue;
                // 모든 셀이 비어 있으면 건너뜀
                boolean allEmpty = true;
                for (int ci = 0; ci < headers.size(); ci++) {
                    if (!getCellStr(row.getCell(ci)).isEmpty()) { allEmpty = false; break; }
                }
                if (allEmpty) continue;
                Map<String, Object> rowMap = new LinkedHashMap<>();
                for (int ci = 0; ci < headers.size(); ci++) {
                    rowMap.put(headers.get(ci), getCellStr(row.getCell(ci)));
                }
                rows.add(rowMap);
            }
        }
        // ── SCENARIO_STORE["pur"] enriched 데이터 병합 ──────────────────────
        // enrichMenuParts/enrichRoles/applyScenarioMetadata 결과(subCategory, menuName,
        // menuPath, groupName, gnbName)는 메모리에만 있으므로 Excel 행에 덮어씀.
        List<Map<String, Object>> stored = AiStateStore.SCENARIO_STORE.get("pur");
        if (stored != null && !stored.isEmpty()) {
            // sourceName → enriched 시나리오 역인덱스 (첫 번째 매칭 사용)
            Map<String, Map<String, Object>> enrichIndex = new LinkedHashMap<>();
            for (Map<String, Object> sc : stored) {
                String sn = sc.get("sourceName") != null
                    ? sc.get("sourceName").toString().toUpperCase() : "";
                if (!sn.isEmpty() && !enrichIndex.containsKey(sn))
                    enrichIndex.put(sn, sc);
            }

            // 추가할 컬럼명 (Excel에 없는 경우에만 헤더에 추가)
            String[] enrichCols = {"소분류", "메뉴명", "전체메뉴경로"};
            for (String col : enrichCols) {
                if (!headers.contains(col)) headers.add(col);
            }

            // 행 단위 병합
            for (Map<String, Object> row : rows) {
                String sn = row.get("소스명") != null
                    ? row.get("소스명").toString().toUpperCase()
                    : row.get("소스명(pgmid)") != null
                        ? row.get("소스명(pgmid)").toString().toUpperCase() : "";
                Map<String, Object> sc = enrichIndex.get(sn);
                if (sc == null) continue;
                String sub  = sc.get("subCategory") != null ? sc.get("subCategory").toString() : "";
                String menu = sc.get("menuName")    != null ? sc.get("menuName").toString()    : "";
                String path = sc.get("menuPath")    != null ? sc.get("menuPath").toString()    : "";
                if (!sub.isEmpty())  row.put("소분류",       sub);
                if (!menu.isEmpty()) row.put("메뉴명",       menu);
                if (!path.isEmpty()) row.put("전체메뉴경로", path);
            }
        }

        result.put("success",      true);
        result.put("headers",      headers);
        result.put("rows",         rows);
        result.put("sheetIdx",     sheetIdx);
        result.put("dataOffset",   dataStartRow);
        result.put("file",         xlsx.getAbsolutePath().replace("\\", "/"));
        return result;
    }

    // ── PUR 시나리오 데이터 저장 (JSON → Excel 덮어쓰기) ────────────────────
    @RequestMapping(value = "/ai/savePurScenarioData.do", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> savePurScenarioData(
            HttpServletRequest request,
            @RequestBody Map<String, Object> body) throws Exception {
        String file = (String) body.get("file");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> rows = (List<Map<String, Object>>) body.get("rows");
        @SuppressWarnings("unchecked")
        List<String> headers = (List<String>) body.get("headers");
        Map<String, Object> result = new LinkedHashMap<>();
        if (file == null || rows == null || headers == null) {
            result.put("success", false); result.put("message", "필수 파라미터 없음"); return result;
        }
        File xlsx = new File(file);
        if (!xlsx.exists()) { result.put("success", false); result.put("message", "파일 없음: " + file); return result; }

        // ── Windows 파일 잠금 방지: 읽기 스트림을 완전히 닫은 후 쓰기 스트림 열기 ──
        XSSFWorkbook wb = null;
        try (FileInputStream fis = new FileInputStream(xlsx)) {
            wb = new XSSFWorkbook(fis);
        }   // fis 닫힘 — 이제 같은 파일에 FileOutputStream 열기 가능
        if (wb == null) { result.put("success", false); result.put("message", "Excel 파일 읽기 실패"); return result; }
        // 클라이언트에서 sheetIdx 전달 시 해당 시트 사용, 없으면 "시나리오" 포함 시트 탐색
        int sheetIdx = 0;
        Object sheetIdxObj = body.get("sheetIdx");
        if (sheetIdxObj != null) {
            try { sheetIdx = Integer.parseInt(sheetIdxObj.toString()); } catch (Exception ignored) {}
        } else {
            for (int si = 0; si < wb.getNumberOfSheets(); si++) {
                if (wb.getSheetName(si).contains("시나리오")) { sheetIdx = si; break; }
            }
        }
        try {
            Sheet sheet = wb.getSheetAt(sheetIdx);
            // dataOffset: 클라이언트 전달값 사용, 없으면 "시나리오" 시트면 2(3행~), 아니면 1(2행~)
            int dataOffset = 2;
            Object dataOffsetObj = body.get("dataOffset");
            if (dataOffsetObj != null) {
                try { dataOffset = Integer.parseInt(dataOffsetObj.toString()); } catch (Exception ignored) {}
            }
            for (int ri = 0; ri < rows.size(); ri++) {
                Row row = sheet.getRow(ri + dataOffset);
                if (row == null) row = sheet.createRow(ri + dataOffset);
                Map<String, Object> rowData = rows.get(ri);
                for (int ci = 0; ci < headers.size(); ci++) {
                    Cell cell = row.getCell(ci);
                    if (cell == null) cell = row.createCell(ci);
                    Object val = rowData.get(headers.get(ci));
                    cell.setCellValue(val != null ? String.valueOf(val) : "");
                }
            }
            try (FileOutputStream fos = new FileOutputStream(xlsx)) { wb.write(fos); }
        } finally {
            try { wb.close(); } catch (IOException ignore) {}
        }
        // ── 저장 후 SCENARIO_STORE 갱신 (다운로드 시 최신 내용 반영) ──────────
        try {
            List<Map<String, Object>> updated = excelToScenarios(xlsx);
            if (!updated.isEmpty()) {
                String pref = body.get("prefix") != null ? body.get("prefix").toString() : "pur";
                AiStateStore.SCENARIO_STORE.put(pref, updated);
            }
        } catch (Exception ignored) {}

        result.put("success",  true);
        result.put("message",  rows.size() + "개 행 저장 완료");
        result.put("filePath", xlsx.getAbsolutePath().replace("\\", "/"));
        return result;
    }

    /** Excel 파일 경로 해석 (절대/상대 모두 처리) */
    private File resolvePurXlsx(HttpServletRequest request, String file) {
        if (file == null) return null;
        File f = new File(file);
        if (f.isAbsolute() && f.exists()) return f;
        String name = f.getName();
        // etc/ai/excel/ 우선 탐색
        File fromAiExcel = new File(FilePathHelper.getAiBaseDir(request), "excel/" + name);
        if (fromAiExcel.exists()) return fromAiExcel;
        // 하위 호환: 기존 copilot_info/
        File webappDir   = new File(request.getServletContext().getRealPath("/"));
        File projectRoot = findProjectRoot(webappDir);
        File fromCopilot = new File(projectRoot, "copilot_info/" + name);
        if (fromCopilot.exists()) return fromCopilot;
        return f;
    }

    /** POI Cell → String 변환 (수식·숫자·문자 통일) */
    private String getCellStr(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case NUMERIC: {
                double v = cell.getNumericCellValue();
                return v == Math.floor(v) ? String.valueOf((long) v) : String.valueOf(v);
            }
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            case FORMULA: try { return cell.getStringCellValue(); }
                          catch (Exception e) { return String.valueOf(cell.getNumericCellValue()); }
            default:      return cell.getStringCellValue();
        }
    }

    // ── PUR 시나리오 생성 (Python 스크립트 실행 — SSE 스트리밍) ──────────────
    /**
     * pss/generate_pur_scenarios.py 를 서버에서 실행하고
     * stdout/stderr 를 SSE log 이벤트로 실시간 전달한다.
     *
     * 완료 시 event: done  data: {"success":true,"file":"pur_test_scenarios_YYYYMMDD.xlsx"}
     * 오류 시 event: error data: 오류메시지
     */
    @RequestMapping(value = "/ai/runPurScenarioGen.do")
    public void runPurScenarioGen(HttpServletRequest request,
                                  HttpServletResponse response) throws Exception {
        response.setContentType("text/event-stream;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("X-Accel-Buffering", "no");
        PrintWriter writer = response.getWriter();

        // ── 프로젝트 루트 경로 계산 ──────────────────────────────────────────
        // getRealPath("/") 결과는 배포 방식(IDE직접실행/WAR)에 따라 다를 수 있으므로
        // pss/generate_pur_scenarios.py 파일을 실제로 찾을 때까지 상위로 이동
        File webappDir   = new File(request.getServletContext().getRealPath("/"));
        File projectRoot = findProjectRoot(webappDir);

        SseHelper.sseLog(writer, "webapp: " + webappDir.getAbsolutePath());
        SseHelper.sseLog(writer, "projectRoot: " + projectRoot.getAbsolutePath());

        File scriptFile = new File(projectRoot, "pss/generate_pur_scenarios.py");
        if (!scriptFile.exists()) {
            writer.write("event: error\ndata: 스크립트 파일 없음: "
                + scriptFile.getAbsolutePath() + "\n\n");
            writer.flush(); return;
        }

        // ── Python 실행 파일 자동 탐색 ───────────────────────────────────────
        String python = findPython();
        if (python == null) {
            writer.write("event: error\ndata: Python을 찾을 수 없습니다. "
                + "python3/python/py 명령 또는 Python 설치 경로를 확인하세요.\n\n");
            writer.flush(); return;
        }
        SseHelper.sseLog(writer, "Python: " + python);
        SseHelper.sseLog(writer, "스크립트: " + scriptFile.getAbsolutePath());
        SseHelper.sseLog(writer, "실행 시작...");

        // ── 출력 디렉토리: etc/ai/excel/ (테스트 자동화 전용 경로) ──────────────
        File outDir = new File(FilePathHelper.getAiBaseDir(request), "excel");
        if (!outDir.exists()) outDir.mkdirs();
        SseHelper.sseLog(writer, "출력 디렉토리: " + outDir.getAbsolutePath());

        // ── 소스 필터: PENDING_FILES["pur"] → 화면 번호 추출 → argv[3] ──────────
        String sourceFilter = "";
        List<Map<String, Object>> purPendingPre = AiStateStore.PENDING_FILES.remove("pur");
        if (purPendingPre != null && !purPendingPre.isEmpty()) {
            java.util.LinkedHashSet<String> screenNos = new java.util.LinkedHashSet<>();
            java.util.regex.Pattern snPat = java.util.regex.Pattern.compile("(?i)PUR[_]?(\\d+)");
            for (Map<String, Object> pf : purPendingPre) {
                String dn = pf.get("displayName") != null ? String.valueOf(pf.get("displayName")) : "";
                java.util.regex.Matcher snm = snPat.matcher(dn);
                if (snm.find()) screenNos.add(snm.group(1));
            }
            if (!screenNos.isEmpty()) {
                sourceFilter = String.join(",", screenNos);
            }
        }
        SseHelper.sseLog(writer, "소스 필터: " + (sourceFilter.isEmpty() ? "전체" : sourceFilter));

        try {
            // -u : 출력 버퍼링 비활성화 → SSE 실시간 스트리밍에 필수
            ProcessBuilder pb = new ProcessBuilder(
                python, "-u",
                scriptFile.getAbsolutePath(),
                projectRoot.getAbsolutePath(),   // argv[1] = 프로젝트 루트
                outDir.getAbsolutePath(),        // argv[2] = 출력 디렉토리 (명시)
                sourceFilter                     // argv[3] = 화면 번호 쉼표 구분 (빈 문자열=전체)
            );
            pb.directory(projectRoot);
            pb.redirectErrorStream(true);

            Map<String, String> env = pb.environment();
            injectPythonPath(env);
            // 한글 출력 깨짐 방지: Tomcat 서비스 계정의 콘솔 인코딩이 다를 수 있음
            env.put("PYTHONIOENCODING", "utf-8");
            env.put("PYTHONUTF8",       "1");

            Process proc = pb.start();

            // stdout 실시간 스트리밍 (UTF-8 명시)
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(proc.getInputStream(), "UTF-8"))) {
                String line;
                while ((line = br.readLine()) != null) {
                    SseHelper.sseLog(writer, line);
                }
            }

            int exit = proc.waitFor();
            if (exit == 0) {
                // 생성된 Excel 탐색: etc/ai/excel/ → copilot_info/ → 프로젝트 루트 순
                String xlsxName  = "";
                File   latestXlsx = null;
                File   copilotInfoDir = new File(projectRoot, "copilot_info");
                for (File searchDir : new File[]{outDir, copilotInfoDir, projectRoot}) {
                    File[] files = searchDir.listFiles((d, n) ->
                        n.startsWith("pur_test_scenarios_") && n.endsWith(".xlsx"));
                    if (files != null && files.length > 0) {
                        Arrays.sort(files, (a, b) -> b.getName().compareTo(a.getName()));
                        latestXlsx = files[0];
                        // 다운로드 엔드포인트가 파일을 찾을 수 있도록 절대 경로 전달
                        xlsxName = files[0].getAbsolutePath().replace("\\", "/");
                        break;
                    }
                }

                // ── Excel → SCENARIO_STORE["pur"] 자동 로드 ──────────────────
                int scenarioCount = 0;
                if (latestXlsx != null) {
                    try {
                        String nxuiBase = FilePathHelper.getNxuiBase(request);
                        scenarioCount = purTestCodeGen.loadFromExcel(latestXlsx, writer, nxuiBase);
                    } catch (Exception loadEx) {
                        SseHelper.sseLog(writer,
                            "[WARN] 시나리오 메모리 로드 실패 (Excel은 정상 생성됨): "
                            + loadEx.getMessage());
                    }
                }

                String donePayload = "{\"success\":true,\"file\":\""
                    + xlsxName.replace("\"", "\\\"")
                    + "\",\"scenarioCount\":" + scenarioCount + "}";
                writer.write("event: done\ndata: " + SseHelper.escEvt(donePayload) + "\n\n");
                writer.flush();
            } else {
                writer.write("event: error\ndata: Python 종료코드 " + exit
                    + " — 위 로그에서 원인을 확인하세요.\n\n");
                writer.flush();
            }
        } catch (Exception e) {
            writer.write("event: error\ndata: " + SseHelper.escEvt(e.getMessage()) + "\n\n");
            writer.flush();
        }
    }

    /**
     * pss/generate_pur_scenarios.py 가 실제로 존재하는 상위 디렉토리를 찾는다.
     * getRealPath("/") 값이 IDE 실행/WAR 배포에 따라 다르므로 파일 존재 여부로 판단.
     * 최대 8단계까지 탐색 후 없으면 기존 로직(3단계 상위)으로 폴백.
     */
    private File findProjectRoot(File webappDir) {
        File cur = webappDir;
        for (int i = 0; i < 8; i++) {
            if (new File(cur, "pss/generate_pur_scenarios.py").exists()) {
                return cur;
            }
            File parent = cur.getParentFile();
            if (parent == null) break;
            cur = parent;
        }
        // 폴백: webapp → main → src → 프로젝트루트 (개발환경 직접실행 기준)
        return webappDir.getParentFile().getParentFile().getParentFile();
    }

    /**
     * ProcessBuilder 환경변수 MAP에 Windows의 주요 Python 설치 경로를 PATH 앞에 추가.
     * IDE(Eclipse/STS)에서 서버를 실행하면 사용자 PATH가 JVM에 전달되지 않을 수 있음.
     */
    private void injectPythonPath(Map<String, String> env) {
        String userHome    = System.getProperty("user.home", "");
        String existPath   = env.containsKey("PATH") ? env.get("PATH")
                           : env.containsKey("Path") ? env.get("Path") : "";
        StringBuilder extra = new StringBuilder();
        for (String candidate : new String[]{
                // Python Launcher (MS Store 또는 공식 설치)
                "C:\\Windows\\py.exe",
                // 사용자 로컬 설치 (Python 3.x 일반 경로)
                userHome + "\\AppData\\Local\\Programs\\Python\\Python313",
                userHome + "\\AppData\\Local\\Programs\\Python\\Python312",
                userHome + "\\AppData\\Local\\Programs\\Python\\Python311",
                userHome + "\\AppData\\Local\\Programs\\Python\\Python310",
                userHome + "\\AppData\\Local\\Programs\\Python\\Python39",
                // 시스템 전역 설치
                "C:\\Python313", "C:\\Python312", "C:\\Python311",
                "C:\\Python310", "C:\\Python39", "C:\\Python38",
                "C:\\Program Files\\Python313", "C:\\Program Files\\Python312",
                "C:\\Program Files\\Python311", "C:\\Program Files\\Python310",
                // conda / miniconda
                userHome + "\\miniconda3\\Scripts",
                userHome + "\\Anaconda3\\Scripts",
                "C:\\ProgramData\\miniconda3\\Scripts",
        }) {
            // 디렉토리 자체 또는 해당 경로의 python.exe/py.exe 존재 여부 확인
            File dir = new File(candidate).isFile()
                     ? new File(candidate).getParentFile()
                     : new File(candidate);
            if (dir.exists() && !existPath.contains(dir.getAbsolutePath())) {
                extra.append(dir.getAbsolutePath()).append(";");
            }
        }
        if (extra.length() > 0) {
            env.put("PATH", extra + existPath);
        }
    }

    // ── PUR 시나리오 Excel 다운로드 ───────────────────────────────────────────
    @RequestMapping(value = "/ai/downloadPurScenario.do")
    public void downloadPurScenario(HttpServletRequest request,
                                    HttpServletResponse response,
                                    @RequestParam String file) throws Exception {
        // file 파라미터가 절대 경로인 경우 그대로 사용, 파일명만인 경우 탐색
        File xlsx = new File(file);
        if (!xlsx.isAbsolute() || !xlsx.exists()) {
            // 파일명만 전달된 경우: copilot_info/ → 프로젝트 루트 탐색
            File webappDir   = new File(request.getServletContext().getRealPath("/"));
            File projectRoot = findProjectRoot(webappDir);
            File fromCopilot = new File(projectRoot, "copilot_info/" + new File(file).getName());
            File fromRoot    = new File(projectRoot, new File(file).getName());
            xlsx = fromCopilot.exists() ? fromCopilot : fromRoot;
        }

        if (!xlsx.exists() || !xlsx.getName().endsWith(".xlsx")) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "파일 없음: " + file);
            return;
        }
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition",
            "attachment; filename*=UTF-8''" + URLEncoder.encode(xlsx.getName(), "UTF-8"));
        response.setContentLengthLong(xlsx.length());
        try (FileInputStream fis = new FileInputStream(xlsx);
             OutputStream os = response.getOutputStream()) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = fis.read(buf)) != -1) os.write(buf, 0, n);
        }
    }

    // ── 편집기 현재 상태 → Excel 동적 생성 후 다운로드 ────────────────────────
    /**
     * JSP PUR 인라인 편집기의 현재 내용을 POST로 받아 Excel(.xlsx)로 변환해 응답한다.
     * Excel 헤더는 PUR_COLS 순서와 일치: 구분/ID/테스트명/엑터(역할)/URL/Method/대메뉴/
     * 중분류/소분류/메뉴명/시나리오흐름/입력값/예상결과/테스트결과/확인자/판정결과/메뉴경로
     */
    @RequestMapping(value = "/ai/downloadEditedScenarios.do", method = RequestMethod.POST)
    public void downloadEditedScenarios(
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestBody Map<String, Object> body) throws Exception {

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> rows = (List<Map<String, Object>>) body.get("rows");
        if (rows == null) rows = new ArrayList<>();

        // Excel 헤더 — PUR_COLS key 순서와 동일
        String[][] headers = {
            {"no","No"},{"testType","구분"},{"scenarioId","시나리오ID"},
            {"testName","테스트명"},{"roleNm","엑터(역할)"},
            {"url","URL"},{"method","Method"},{"gnbName","대메뉴(GNB)"},
            {"groupName","중분류"},{"subCategory","소분류"},{"menuName","메뉴명"},
            {"preCondition","시나리오흐름"},{"inputValues","입력값"},
            {"expectedResult","예상결과"},{"testResult","테스트결과"},
            {"confirmer","확인자"},{"judgmentResult","판정결과"},
            {"plConfirm","PL확인"},{"reason","사유"},{"userConfirm","사용자확인"},
            {"menuPath","메뉴경로"}
        };

        XSSFWorkbook wb = new XSSFWorkbook();
        Sheet sheet = wb.createSheet("시나리오");

        // 헤더 행
        CellStyle hStyle = wb.createCellStyle();
        hStyle.setFillForegroundColor(org.apache.poi.ss.usermodel.IndexedColors.GREY_25_PERCENT.getIndex());
        hStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        Font hFont = wb.createFont(); hFont.setBold(true);
        hStyle.setFont(hFont);
        Row hRow = sheet.createRow(0);
        for (int c = 0; c < headers.length; c++) {
            Cell cell = hRow.createCell(c);
            cell.setCellValue(headers[c][1]);
            cell.setCellStyle(hStyle);
        }

        // 데이터 행
        int rowIdx = 1;
        for (Map<String, Object> r : rows) {
            Row row = sheet.createRow(rowIdx++);
            for (int c = 0; c < headers.length; c++) {
                Object val = r.get(headers[c][0]);
                row.createCell(c).setCellValue(val != null ? String.valueOf(val) : "");
            }
        }

        // 열 너비 자동
        for (int c = 0; c < headers.length; c++) sheet.autoSizeColumn(c);

        String ts = new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new java.util.Date());
        String filename = "scenarios_edited_" + ts + ".xlsx";
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition",
            "attachment; filename*=UTF-8''" + java.net.URLEncoder.encode(filename, "UTF-8"));
        wb.write(response.getOutputStream());
        wb.close();
    }

    // ── PUR spec.ts 생성 (SSE) ───────────────────────────────────────────────
    /**
     * SCENARIO_STORE["pur"] → Playwright TypeScript spec.ts 생성.
     * 생성 후 SPEC_FILE_STORE["pur"]에 파일명을 등록해 기존 테스트 실행기와 연결.
     *
     * 완료: event: done  data: {"success":true,"file":"pur_YYYYMMDD_inte.spec.ts","count":N}
     * 오류: event: error data: 오류메시지
     */
    @RequestMapping(value = "/ai/generatePurTestCode.do")
    public void generatePurTestCode(HttpServletRequest request,
                                    HttpServletResponse response) throws Exception {
        // SCENARIO_STORE에 있는 모든 prefix 통합 → SpecGenService 공통 경로 사용
        // prefix="" → SpecGenService 내부에서 SCENARIO_STORE 전체 수집 (pur/pms 등 무관)
        specGenSvc.generateSpecStream(request, response, "", null);
    }

    // ── PUR spec.ts 다운로드 ─────────────────────────────────────────────────
    @RequestMapping(value = "/ai/downloadPurTestCode.do")
    public void downloadPurTestCode(HttpServletRequest request,
                                    HttpServletResponse response,
                                    @RequestParam String file) throws Exception {
        purTestCodeGen.downloadSpecTs(request, response, file);
    }

    // ── Phase 4: 시나리오 직접 다운로드 (SCENARIO_STORE → xlsx) ─────────────
    @RequestMapping(value = "/ai/exportScenarioDirect.do", method = RequestMethod.GET)
    public void exportScenarioDirect(HttpServletRequest request,
                                     HttpServletResponse response,
                                     @RequestParam(value = "prefix",       defaultValue = "pur") String prefix,
                                     @RequestParam(value = "userFileName", required = false, defaultValue = "") String userFileName)
            throws Exception {
        List<Map<String, Object>> scenarios = AiStateStore.SCENARIO_STORE.get(prefix + "_unit");
        if (scenarios == null || scenarios.isEmpty()) {
            addErrLog("EXPORT", "시나리오 없음: " + prefix + "_unit", prefix + "_unit");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\":false,\"message\":\"시나리오 없음. 먼저 추출하세요.\"}");
            return;
        }
        try {
            byte[] xlsx = exportSvc.buildScenarioXlsx(scenarios);
            String ts   = new SimpleDateFormat("yyyyMMdd_HHmm").format(new Date());
            String fn   = userFileName.trim().isEmpty()
                        ? "unit_scenarios_" + prefix + "_" + ts + ".xlsx"
                        : userFileName.trim() + ".xlsx";
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setContentLength(xlsx.length);
            response.setHeader("Content-Disposition",
                "attachment; filename*=UTF-8''" + URLEncoder.encode(fn, "UTF-8").replace("+", "%20"));
            response.getOutputStream().write(xlsx);
            response.getOutputStream().flush();
            addGenLog("EXPORT", "시나리오 xlsx 내보내기 완료: " + fn, scenarios.size());
        } catch (Exception e) {
            addErrLog("EXPORT", e.getMessage(), prefix + "_unit");
            throw e;
        }
    }

    // ── Phase 4: 양식 기반 내보내기 (xlsx / hwpx / pdf) ─────────────────────
    @RequestMapping(value = "/ai/exportScenarioTemplate.do", method = RequestMethod.GET)
    public void exportScenarioTemplate(HttpServletRequest request,
                                       HttpServletResponse response,
                                       @RequestParam(value = "prefix",       defaultValue = "pur")  String prefix,
                                       @RequestParam(value = "format",       defaultValue = "xlsx") String format,
                                       @RequestParam(value = "projectName",  defaultValue = "")     String projectName,
                                       @RequestParam(value = "author",       defaultValue = "")     String author,
                                       @RequestParam(value = "date",         defaultValue = "")     String date,
                                       @RequestParam(value = "userFileName", required = false, defaultValue = "") String userFileName)
            throws Exception {
        List<Map<String, Object>> scenarios = AiStateStore.SCENARIO_STORE.get(prefix + "_unit");
        if (scenarios == null || scenarios.isEmpty()) {
            addErrLog("EXPORT", "시나리오 없음: " + prefix + "_unit", prefix + "_unit");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\":false,\"message\":\"시나리오 없음. 먼저 추출하세요.\"}");
            return;
        }
        String dateStr = date.isEmpty() ? new SimpleDateFormat("yyyyMMdd").format(new Date()) : date.replace("-", "");
        String title   = projectName.isEmpty() ? "통합테스트시나리오" : projectName + " 통합테스트시나리오";

        byte[] body;
        String contentType;
        String ext;

        try {
            switch (format) {
                case "hwp":
                    body        = exportSvc.buildScenarioHwpx(scenarios, date, author, title);
                    contentType = "application/x-hwpml";
                    ext         = ".hwpx";
                    break;
                case "pdf":
                    body        = exportSvc.buildScenarioPdf(scenarios, date, author, title);
                    contentType = "application/pdf";
                    ext         = ".pdf";
                    break;
                default: // xlsx
                    body        = exportSvc.buildScenarioTemplateXlsx(scenarios, date, author, title);
                    contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    ext         = ".xlsx";
            }
            String filename = userFileName.trim().isEmpty()
                            ? prefix + "_단위테스트시나리오_" + dateStr + ext
                            : userFileName.trim() + ext;

            response.setContentType(contentType);
            response.setContentLength(body.length);
            response.setHeader("Content-Disposition",
                "attachment; filename*=UTF-8''" + URLEncoder.encode(filename, "UTF-8").replace("+", "%20"));
            response.getOutputStream().write(body);
            response.getOutputStream().flush();
            addGenLog("EXPORT", "양식 내보내기 완료: " + filename, scenarios.size());
        } catch (Exception e) {
            addErrLog("EXPORT", e.getMessage(), prefix + "_unit");
            throw e;
        }
    }

    // ── 테스트 결과서 내보내기 ────────────────────────────────────────────────
    @RequestMapping(value = "/ai/exportResult.do", method = RequestMethod.GET)
    public void exportResult(HttpServletRequest request,
                             HttpServletResponse response,
                             @RequestParam(value = "prefix",       defaultValue = "pur")  String prefix,
                             @RequestParam(value = "format",       defaultValue = "xlsx") String format,
                             @RequestParam(value = "title",        defaultValue = "")     String title,
                             @RequestParam(value = "userFileName", required = false, defaultValue = "") String userFileName)
            throws Exception {
        List<Map<String, Object>> scenarios = AiStateStore.SCENARIO_STORE.get(prefix + "_unit");
        if (scenarios == null || scenarios.isEmpty()) {
            addErrLog("EXPORT", "결과서 시나리오 없음: " + prefix + "_unit", prefix + "_unit");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\":false,\"message\":\"시나리오 없음. 먼저 추출하세요.\"}");
            return;
        }
        String ts  = new SimpleDateFormat("yyyyMMdd_HHmm").format(new Date());
        String docTitle = title.isEmpty() ? "테스트결과서" : title;
        try {
            byte[] body;
            String contentType;
            String ext;
            switch (format) {
                case "pdf":
                    body        = exportSvc.buildPdf(docTitle, scenarios, true);
                    contentType = "application/pdf";
                    ext         = ".pdf";
                    break;
                default: // xlsx
                    body        = exportSvc.buildResultXlsx(scenarios);
                    contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    ext         = ".xlsx";
            }
            String fn = userFileName.trim().isEmpty()
                      ? prefix + "_테스트결과서_" + ts + ext
                      : userFileName.trim() + ext;
            response.setContentType(contentType);
            response.setContentLength(body.length);
            response.setHeader("Content-Disposition",
                "attachment; filename*=UTF-8''" + URLEncoder.encode(fn, "UTF-8").replace("+", "%20"));
            response.getOutputStream().write(body);
            response.getOutputStream().flush();
            addGenLog("EXPORT", "결과서 내보내기 완료: " + fn, scenarios.size());
        } catch (Exception e) {
            addErrLog("EXPORT", e.getMessage(), prefix + "_unit");
            throw e;
        }
    }

    // ── 단위 시나리오 자동 추출 (XFDL 정적 분석) ─────────────────────────────

    /**
     * 지정 prefix의 XFDL 파일을 정적 분석하여 단위 테스트 시나리오를 추출한다 (SSE 스트리밍).
     * AI/LLM 호출 없이 순수 파싱으로 동작한다.
     */
    @RequestMapping(value = "/ai/extractUnitScenarios.do",
                    produces = "text/event-stream;charset=UTF-8")
    public void extractUnitScenarios(HttpServletRequest request,
                                     HttpServletResponse response,
                                     @RequestParam(value = "prefix") String prefix,
                                     @RequestParam(value = "sources", required = false, defaultValue = "") String sourcesParam) throws Exception {
        response.setContentType("text/event-stream;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("X-Accel-Buffering", "no");
        PrintWriter out = response.getWriter();

        try {
            String nxuiBase = FilePathHelper.getNxuiBase(request);
            System.out.println("[DEBUG-EXTRACT-UNIT] ▶ 요청 수신 prefix=" + prefix + " sources=" + sourcesParam);
            System.out.println("[DEBUG-EXTRACT-UNIT] nxuiBase=" + nxuiBase);
            LOGGER.info("[extractUnitScenarios] nxuiBase={}, sources={}", nxuiBase, sourcesParam);

            Map<File, String> dirOriginMap = new java.util.LinkedHashMap<>();
            File misDir = new File(nxuiBase + "/mis/" + prefix);
            File pmsDir = new File(nxuiBase + "/pms/" + prefix);
            System.out.println("[DEBUG-EXTRACT-UNIT] misDir=" + misDir.getAbsolutePath() + " exists=" + misDir.exists() + " isDir=" + misDir.isDirectory());
            System.out.println("[DEBUG-EXTRACT-UNIT] pmsDir=" + pmsDir.getAbsolutePath() + " exists=" + pmsDir.exists() + " isDir=" + pmsDir.isDirectory());
            if (misDir.exists()) System.out.println("[DEBUG-EXTRACT-UNIT] mis 파일수=" + (misDir.listFiles() != null ? misDir.listFiles().length : 0));
            if (pmsDir.exists()) System.out.println("[DEBUG-EXTRACT-UNIT] pms 파일수=" + (pmsDir.listFiles() != null ? pmsDir.listFiles().length : 0));
            dirOriginMap.put(misDir, "mis");
            dirOriginMap.put(pmsDir, "pms");

            Set<String> allowedSources = new java.util.LinkedHashSet<>();
            if (sourcesParam != null && !sourcesParam.trim().isEmpty()) {
                for (String s : sourcesParam.split(",")) {
                    String t = s.trim().toLowerCase().replaceAll("\\.[^.]+$", "");
                    if (!t.isEmpty()) allowedSources.add(t);
                }
            }
            System.out.println("[DEBUG-EXTRACT-UNIT] allowedSources(" + allowedSources.size() + ")=" + allowedSources);

            // ── 업로드 소스 파일 존재 여부 검증 ──────────────────────────────
            if (!allowedSources.isEmpty()) {
                java.util.Set<String> foundBases = new java.util.LinkedHashSet<>();
                for (File dir : new File[]{misDir, pmsDir}) {
                    if (!dir.exists() || !dir.isDirectory()) continue;
                    java.util.List<File> xfdlFiles = new java.util.ArrayList<>();
                    FilePathHelper.addXfdlFiles(dir, xfdlFiles);
                    for (File f : xfdlFiles) {
                        String base = f.getName().replaceAll("\\.[^.]+$", "").toLowerCase();
                        foundBases.add(base);
                    }
                }
                java.util.List<String> notFound = new java.util.ArrayList<>();
                for (String src : allowedSources) {
                    if (!foundBases.contains(src)) notFound.add(src);
                }
                System.out.println("[DEBUG-EXTRACT-UNIT] 서버에 존재하는 소스: " + foundBases);
                if (!notFound.isEmpty()) {
                    System.out.println("[WARN-EXTRACT-UNIT] 서버에 파일 없음: " + notFound);
                    out.write("data: {\"warn\":\"다음 소스 파일이 서버에 없습니다: " + notFound + "\"}\n\n");
                    out.flush();
                } else {
                    System.out.println("[DEBUG-EXTRACT-UNIT] 소스 파일 존재 확인 완료 — 누락 없음");
                }
            }
            // ────────────────────────────────────────────────────────────────

            // allowedSources → checkedFiles (ScenarioBuilderService 파라미터 형식)
            List<Map<String, Object>> checkedFiles = new java.util.ArrayList<>();
            if (!allowedSources.isEmpty()) {
                for (String src : allowedSources) {
                    Map<String, Object> fm = new java.util.LinkedHashMap<>();
                    fm.put("displayName", src);
                    checkedFiles.add(fm);
                }
            } else {
                for (File dir : new File[]{misDir, pmsDir}) {
                    java.util.List<File> xfdlFiles = new java.util.ArrayList<>();
                    FilePathHelper.addXfdlFiles(dir, xfdlFiles);
                    for (File f : xfdlFiles) {
                        Map<String, Object> fm = new java.util.LinkedHashMap<>();
                        fm.put("displayName", f.getName().replaceAll("\\.[^.]+$", ""));
                        checkedFiles.add(fm);
                    }
                }
            }

            System.out.println("[DEBUG-EXTRACT-UNIT] ScenarioBuilderService.buildScenarios() 호출 — files=" + checkedFiles.size());
            String srcBase    = FilePathHelper.getSrcBase(request);
            String sqlmapBase = FilePathHelper.getSqlmapBase(request);
            Map<String, String> menuMap = menuResolver.buildMenuMap(checkedFiles, nxuiBase, null);
            List<Map<String, Object>> scenarios = scenarioBuilder.buildScenarios(
                checkedFiles, menuMap, nxuiBase, srcBase, sqlmapBase, prefix, null);
            System.out.println("[DEBUG-EXTRACT-UNIT] buildScenarios() 완료 scenarios.size()=" + scenarios.size());
            AiStateStore.SCENARIO_STORE.put(prefix + "_unit", scenarios);
            System.out.println("[DEBUG-EXTRACT-UNIT] STORE put 완료 key=" + prefix + "_unit");
            try { testSummarySvc.registerScenarios(scenarios, "unit"); } catch (Exception ignored) {}
            addGenLog("EXTRACT", "단위 시나리오 추출 완료: " + prefix, scenarios.size());

            out.write("data: {\"done\":true,\"count\":" + scenarios.size() + "}\n\n");
            out.flush();
            System.out.println("[DEBUG-EXTRACT-UNIT] SSE done 전송 완료");
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            System.out.println("[DEBUG-EXTRACT-UNIT] ❌ 예외 발생: " + e.getClass().getSimpleName() + ": " + msg);
            e.printStackTrace();
            LOGGER.error("[extractUnitScenarios] 추출 실패 prefix={}", prefix, e);
            addErrLog("EXTRACT", msg, prefix + "_unit");
            out.write("data: {\"error\":\"" + msg.replace("\"", "'") + "\"}\n\n");
            out.flush();
        }
    }

    // ── 통합 시나리오 자동 추출 (XFDL 정적 분석) ─────────────────────────────

    @RequestMapping(value = "/ai/extractIntegScenarios.do",
                    produces = "text/event-stream;charset=UTF-8")
    public void extractIntegScenarios(HttpServletRequest request,
                                      HttpServletResponse response,
                                      @RequestParam(value = "prefix") String prefix,
                                      @RequestParam(value = "sources", required = false, defaultValue = "") String sourcesParam) throws Exception {
        response.setContentType("text/event-stream;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("X-Accel-Buffering", "no");
        PrintWriter out = response.getWriter();

        try {
            String nxuiBase = FilePathHelper.getNxuiBase(request);
            LOGGER.info("[extractIntegScenarios] nxuiBase={}, sources={}", nxuiBase, sourcesParam);
            Map<File, String> dirOriginMap = new java.util.LinkedHashMap<>();
            dirOriginMap.put(new File(nxuiBase + "/mis/" + prefix), "mis");
            dirOriginMap.put(new File(nxuiBase + "/pms/" + prefix), "pms");

            Set<String> allowedSources = new java.util.LinkedHashSet<>();
            if (sourcesParam != null && !sourcesParam.trim().isEmpty()) {
                for (String s : sourcesParam.split(",")) {
                    String t = s.trim().toLowerCase().replaceAll("\\.[^.]+$", "");
                    if (!t.isEmpty()) allowedSources.add(t);
                }
            }

            // ── 업로드 소스 파일 존재 여부 검증 ──────────────────────────────
            if (!allowedSources.isEmpty()) {
                File integMisDir = new File(nxuiBase + "/mis/" + prefix);
                File integPmsDir = new File(nxuiBase + "/pms/" + prefix);
                java.util.Set<String> foundBases = new java.util.LinkedHashSet<>();
                for (File dir : new File[]{integMisDir, integPmsDir}) {
                    if (!dir.exists() || !dir.isDirectory()) continue;
                    java.util.List<File> xfdlFiles = new java.util.ArrayList<>();
                    FilePathHelper.addXfdlFiles(dir, xfdlFiles);
                    for (File f : xfdlFiles) {
                        String base = f.getName().replaceAll("\\.[^.]+$", "").toLowerCase();
                        foundBases.add(base);
                    }
                }
                java.util.List<String> notFound = new java.util.ArrayList<>();
                for (String src : allowedSources) {
                    if (!foundBases.contains(src)) notFound.add(src);
                }
                if (!notFound.isEmpty()) {
                    LOGGER.warn("[extractIntegScenarios] 서버에 파일 없음: {}", notFound);
                    out.write("data: {\"warn\":\"다음 소스 파일이 서버에 없습니다: " + notFound + "\"}\n\n");
                    out.flush();
                }
            }
            // ────────────────────────────────────────────────────────────────

            List<Map<String, Object>> scenarios = scenarioExtractor.extractIntegAll(dirOriginMap,
                allowedSources,
                (cur, total) -> {
                    out.write("data: {\"cur\":" + cur + ",\"total\":" + total + "}\n\n");
                    out.flush();
                },
                (errMsg) -> {
                    out.write("data: {\"fileError\":\"" + errMsg.replace("\"", "'") + "\"}\n\n");
                    out.flush();
                });

            AiStateStore.SCENARIO_STORE.put(prefix + "_integ", scenarios);
            try { testSummarySvc.registerScenarios(scenarios, "integ"); } catch (Exception ignored) {}
            addGenLog("EXTRACT", "통합 시나리오 추출 완료: " + prefix, scenarios.size());

            out.write("data: {\"done\":true,\"count\":" + scenarios.size() + "}\n\n");
            out.flush();
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            LOGGER.error("[extractIntegScenarios] 추출 실패 prefix={}", prefix, e);
            addErrLog("EXTRACT", msg, prefix + "_integ");
            out.write("data: {\"error\":\"" + msg.replace("\"", "'") + "\"}\n\n");
            out.flush();
        }
    }

    @RequestMapping(value = "/ai/doTestSummary.do")
    public String doTestSummary() {
        return "pss/doTest_summary";
    }

    @RequestMapping(value = "/ai/doTestSummaryUI.do")
    public String doTestSummaryUI() {
        return "pss/doTest_summary";
    }

    @RequestMapping(value = "/ai/doTestLog.do")
    public String doTestLog() {
        return "pss/doTest_log";
    }

    @RequestMapping(value = "/ai/doTestLogUI.do")
    public String doTestLogUI() {
        return "pss/doTest_log";
    }

    // ── XFDL 팝업 스텁 공통 헬퍼 ────────────────────────────────────────────
    private void writeXfdlPopup(HttpServletRequest request, HttpServletResponse response,
                                 String uiPath, String winName) throws Exception {
        String uiUrl = request.getContextPath() + uiPath;
        // Nexacro XFDL 이벤트 등록 올바른 패턴:
        // on_create 안에서 addEventHandler("onload", handler, scope) 사용.
        // this.on_load 속성 직접 대입은 Nexacro가 인식하지 못함.
        String xfdl = "(function(){" +
                      "return function(){" +
                      "if(!this._is_form)return;" +
                      "var self=this;" +
                      "this.on_create=function(){" +
                      "this.set_name('" + winName + "');" +
                      "this.addEventHandler('onload',function(obj,e){" +
                      "try{" +
                      "var doc=nexacro._getDocument?nexacro._getDocument():null;" +
                      "var w=doc&&doc.defaultView?doc.defaultView:null;" +
                      "if(w){w.open('" + uiUrl + "','" + winName + "','width=1400,height=900,scrollbars=yes,resizable=yes');}" +
                      "}catch(ex){}" +
                      "},this);" +
                      "};" +
                      "};})();";
        response.setContentType("application/javascript; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(xfdl);
        response.getWriter().flush();
    }

    // ── 통과 여부 갱신 API (result.md §5) ────────────────────────────────
    @RequestMapping(value = "/ai/updatePassStatus.do")
    @ResponseBody
    public Map<String, Object> updatePassStatus(
            @RequestParam(value = "scenarioId") String scenarioId,
            @RequestParam(value = "testType")   String testType,
            @RequestParam(value = "passLevel")  String passLevel,
            @RequestParam(value = "passYn")     String passYn,
            @RequestParam(value = "remark", required = false, defaultValue = "") String remark) {
        Map<String, Object> result = new java.util.LinkedHashMap<>();
        try {
            testSummarySvc.updatePass(scenarioId, testType, passLevel, passYn);
            if (!remark.trim().isEmpty()) {
                testSummarySvc.updateRemark(scenarioId, testType, remark.trim());
            }
            result.put("ok", true);
        } catch (IllegalStateException e) {
            result.put("ok",  false);
            result.put("msg", e.getMessage());
        } catch (Exception e) {
            result.put("ok",  false);
            result.put("msg", e.getMessage());
        }
        return result;
    }

    // ── 테스트 통과 현황 조회 API ─────────────────────────────────────────
    @RequestMapping(value = "/ai/getTestSummary.do")
    @ResponseBody
    public Map<String, Object> getTestSummary(@RequestParam(value = "testType", required = false, defaultValue = "unit") String testType) {
        try {
            return testSummarySvc.getSummary(testType);
        } catch (Exception e) {
            Map<String, Object> err = new java.util.LinkedHashMap<>();
            err.put("error", e.getMessage());
            err.put("rows", new ArrayList<>());
            return err;
        }
    }

    // ── _workspace 기반 최근 실행 결과 목록 API ────────────────────────────
    @RequestMapping(value = "/ai/getWorkspaceRuns.do")
    @ResponseBody
    public Map<String, Object> getWorkspaceRuns(HttpServletRequest request) {
        Map<String, Object> result = new java.util.LinkedHashMap<>();
        List<Map<String, Object>> runs = new ArrayList<>();
        try {
            File wsRoot = new File(request.getServletContext().getRealPath("/"), "../../../../_workspace");
            if (!wsRoot.exists()) wsRoot = new File(System.getProperty("user.dir"), "_workspace");
            if (wsRoot.exists() && wsRoot.isDirectory()) {
                File[] prefixDirs = wsRoot.listFiles(File::isDirectory);
                if (prefixDirs != null) {
                    java.util.Arrays.sort(prefixDirs, (a, b) -> b.lastModified() > a.lastModified() ? 1 : -1);
                    for (File dir : prefixDirs) {
                        Map<String, Object> run = new java.util.LinkedHashMap<>();
                        run.put("prefix", dir.getName());
                        run.put("lastModified", new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
                                .format(new java.util.Date(dir.lastModified())));
                        File rf = new File(dir, "03_results.json");
                        if (rf.exists()) {
                            String json = readFileSafeCtrl(rf);
                            int pass = countOccurrences(json, "\"PASS\"");
                            int fail = countOccurrences(json, "\"FAIL\"");
                            run.put("pass", pass);
                            run.put("fail", fail);
                            run.put("total", pass + fail);
                            run.put("hasError", new File(dir, "03_error.log").exists());
                        } else {
                            run.put("pass", 0); run.put("fail", 0); run.put("total", 0);
                            run.put("hasError", new File(dir, "03_error.log").exists());
                        }
                        runs.add(run);
                    }
                }
            }
        } catch (Exception ignored) {}
        result.put("runs", runs);
        return result;
    }

    private String readFileSafeCtrl(java.io.File f) {
        try { return new String(java.nio.file.Files.readAllBytes(f.toPath()), "UTF-8"); }
        catch (Exception e) { return ""; }
    }

    private int countOccurrences(String s, String sub) {
        int n = 0, i = 0;
        while ((i = s.indexOf(sub, i)) >= 0) { n++; i += sub.length(); }
        return n;
    }

    // ── 에러 로그 조회 API ────────────────────────────────────────────────
    @RequestMapping(value = "/ai/getErrLog.do")
    @ResponseBody
    public Map<String, Object> getErrLog(@RequestParam(value = "type", required = false) String type) {
        List<Map<String, Object>> all = new ArrayList<>(AiStateStore.ERR_LOG);
        if (type != null && !type.isEmpty()) {
            List<Map<String, Object>> filtered = new ArrayList<>();
            for (Map<String, Object> r : all) {
                if (type.equals(r.get("logType"))) filtered.add(r);
            }
            all = filtered;
        }
        Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("rows", all);
        return result;
    }

    // ── 생성 로그 조회 API ────────────────────────────────────────────────
    @RequestMapping(value = "/ai/getGenLog.do")
    @ResponseBody
    public Map<String, Object> getGenLog(@RequestParam(value = "type", required = false) String type) {
        List<Map<String, Object>> all = new ArrayList<>(AiStateStore.GEN_LOG);
        if (type != null && !type.isEmpty()) {
            List<Map<String, Object>> filtered = new ArrayList<>();
            for (Map<String, Object> r : all) {
                if (type.equals(r.get("logType"))) filtered.add(r);
            }
            all = filtered;
        }
        Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("rows", all);
        return result;
    }

    // ── 에러 로그 초기화 API ──────────────────────────────────────────────
    @RequestMapping(value = "/ai/clearErrLog.do", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> clearErrLog() {
        AiStateStore.ERR_LOG.clear();
        Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("ok", true);
        return result;
    }

    private static void addErrLog(String logType, String message, String targetFile) {
        java.util.Map<String, Object> e = new java.util.LinkedHashMap<>();
        e.put("logDate",    new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date()));
        e.put("logType",    logType);
        e.put("message",    message != null ? message : "");
        e.put("targetFile", targetFile != null ? targetFile : "");
        if (AiStateStore.ERR_LOG.size() >= 1000) AiStateStore.ERR_LOG.pollFirst();
        AiStateStore.ERR_LOG.addLast(e);
    }

    private static void addGenLog(String logType, String message, int count) {
        java.util.Map<String, Object> g = new java.util.LinkedHashMap<>();
        g.put("logDate", new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date()));
        g.put("logType", logType);
        g.put("message", message != null ? message : "");
        g.put("count",   count);
        if (AiStateStore.GEN_LOG.size() >= 1000) AiStateStore.GEN_LOG.pollFirst();
        AiStateStore.GEN_LOG.addLast(g);
    }

    /**
     * Python 실행 파일 자동 탐색.
     * PATH 명령어(python3/python/py) → Windows 절대 경로 순으로 탐색.
     * 모두 실패하면 null 반환.
     */
    private String findPython() {
        String userHome = System.getProperty("user.home", "");

        List<String> candidates = new ArrayList<>(Arrays.asList(
            "python3", "python", "py"
        ));
        // Windows 절대 경로 후보 (PATH 미설정 환경 대비)
        for (String dir : new String[]{
                userHome + "\\AppData\\Local\\Programs\\Python\\Python313",
                userHome + "\\AppData\\Local\\Programs\\Python\\Python312",
                userHome + "\\AppData\\Local\\Programs\\Python\\Python311",
                userHome + "\\AppData\\Local\\Programs\\Python\\Python310",
                userHome + "\\AppData\\Local\\Programs\\Python\\Python39",
                "C:\\Python313", "C:\\Python312", "C:\\Python311",
                "C:\\Python310", "C:\\Python39", "C:\\Python38",
                "C:\\Program Files\\Python313", "C:\\Program Files\\Python312",
                "C:\\Program Files\\Python311",
                userHome + "\\miniconda3",
                userHome + "\\Anaconda3",
                "C:\\ProgramData\\miniconda3",
        }) {
            File exe = new File(dir, "python.exe");
            if (exe.exists()) candidates.add(exe.getAbsolutePath());
        }
        // py.exe (Python Launcher for Windows)
        File pyLauncher = new File("C:\\Windows\\py.exe");
        if (pyLauncher.exists()) candidates.add(pyLauncher.getAbsolutePath());

        for (String candidate : candidates) {
            try {
                Process p = new ProcessBuilder(candidate, "--version")
                    .redirectErrorStream(true).start();
                p.waitFor(5, java.util.concurrent.TimeUnit.SECONDS);
                if (p.exitValue() == 0) return candidate;
            } catch (Exception ignored) {}
        }
        return null; // 찾지 못함 — 호출부에서 에러 처리
    }

    // ── 일반 getList COUNT(*) 검증 엔드포인트 ────────────────────────────────
    // pgmId로 sqlmap XML을 찾아 getList 쿼리의 WHERE 조건을 동적으로 해석하고
    // SELECT COUNT(*) 를 실행한다. 모든 화면(pgmId)에 대해 화면별 코드 없이 동작.
    //
    // 요청: Content-Type=text/xml, Nexacro XML (pgmId in Parameters, ds_search in Datasets)
    //       queryId 파라미터 추가 가능 (기본값: getList)
    // 응답: { success, count, pgmId, sqlmapFile }
    @RequestMapping(value = "/ai/getListCount.do", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> getListCount(HttpServletRequest request) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            byte[] raw = request.getInputStream().readAllBytes();
            String body = new String(raw, java.nio.charset.StandardCharsets.UTF_8);

            // pgmId 추출
            java.util.regex.Matcher pgmM = java.util.regex.Pattern
                .compile("<Parameter[^>]+id=\"pgmId\"[^>]*>([^<]+)</Parameter>")
                .matcher(body);
            String pgmId = pgmM.find() ? pgmM.group(1).trim() : "";

            // queryId 추출 (기본값: getList)
            java.util.regex.Matcher qidM = java.util.regex.Pattern
                .compile("<Parameter[^>]+id=\"queryId\"[^>]*>([^<]+)</Parameter>")
                .matcher(body);
            String queryId = qidM.find() ? qidM.group(1).trim() : "getList";

            // ds_search 컬럼 값 파싱
            java.util.regex.Matcher dsm = java.util.regex.Pattern
                .compile("<Dataset[^>]+id=\"ds_search\"[^>]*>(.*?)</Dataset>",
                         java.util.regex.Pattern.DOTALL)
                .matcher(body);
            Map<String, String> params = new java.util.LinkedHashMap<>();
            if (dsm.find()) {
                java.util.regex.Matcher cm = java.util.regex.Pattern
                    .compile("<Col\\s+id=\"([^\"]+)\"[^>]*>([^<]*)</Col>")
                    .matcher(dsm.group(1));
                while (cm.find()) params.put(cm.group(1), cm.group(2).trim());
            }

            // pgmId로 sqlmap 파일 탐색
            File sqlmapDir = new File(FilePathHelper.getSqlmapBase(request));
            File sqlmapFile = findSqlmapForPgmId(sqlmapDir, pgmId);
            if (sqlmapFile == null) {
                result.put("success", false);
                result.put("error", "sqlmap 파일 없음: pgmId=" + pgmId);
                return result;
            }

            String xmlContent = new String(
                java.nio.file.Files.readAllBytes(sqlmapFile.toPath()),
                java.nio.charset.StandardCharsets.UTF_8);

            List<Object> sqlArgs = new ArrayList<>();
            String countSql = buildIbatisCountSql(xmlContent, queryId, params, sqlArgs);
            if (countSql == null) {
                result.put("success", false);
                result.put("error", "COUNT 쿼리 생성 실패: queryId=" + queryId
                           + ", sqlmap=" + sqlmapFile.getName());
                return result;
            }

            try (java.sql.Connection conn = dataSource.getConnection();
                 java.sql.PreparedStatement ps = conn.prepareStatement(countSql)) {
                for (int i = 0; i < sqlArgs.size(); i++) ps.setObject(i + 1, sqlArgs.get(i));
                try (java.sql.ResultSet rs = ps.executeQuery()) {
                    int cnt = rs.next() ? rs.getInt(1) : 0;
                    result.put("success", true);
                    result.put("count", cnt);
                    result.put("pgmId", pgmId);
                    result.put("sqlmapFile", sqlmapFile.getName());
                }
            }
        } catch (Exception e) {
            LOGGER.error("[getListCount] 오류", e);
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        return result;
    }

    // pgmId(예: "pur_0910M") → sqlmap XML 파일 탐색
    // 규칙: pgmId에서 prefix(알파벳)와 number(숫자)를 추출하고
    //       같은 prefix 디렉토리 아래에서 number를 포함하는 XML 파일을 반환
    private File findSqlmapForPgmId(File dir, String pgmId) {
        if (!dir.isDirectory() || pgmId.isEmpty()) return null;
        java.util.regex.Matcher m = java.util.regex.Pattern
            .compile("(?i)^([a-zA-Z]+)_?(\\d+)")
            .matcher(pgmId);
        if (!m.find()) return null;
        String prefix = m.group(1).toLowerCase();
        String number  = m.group(2);
        return findSqlmapInTree(dir, prefix, number);
    }

    private File findSqlmapInTree(File dir, String prefix, String number) {
        File[] children = dir.listFiles();
        if (children == null) return null;
        // prefix 디렉토리 우선 탐색
        for (File f : children) {
            if (f.isDirectory() && f.getName().equalsIgnoreCase(prefix)) {
                File found = findXmlByNumber(f, number);
                if (found != null) return found;
            }
        }
        // 그 외 하위 디렉토리 재귀
        for (File f : children) {
            if (f.isDirectory() && !f.getName().equalsIgnoreCase(prefix)) {
                File found = findSqlmapInTree(f, prefix, number);
                if (found != null) return found;
            } else if (f.isFile() && f.getName().endsWith(".xml")
                       && f.getName().contains(number)) {
                return f;
            }
        }
        return null;
    }

    private File findXmlByNumber(File dir, String number) {
        File[] files = dir.listFiles();
        if (files == null) return null;
        for (File f : files) {
            if (f.isFile() && f.getName().endsWith(".xml") && f.getName().contains(number))
                return f;
        }
        return null;
    }

    // iBatis sqlmap XML에서 queryId SELECT를 찾아 COUNT(*) JDBC SQL 생성
    // 처리: <isNotEmpty>, <isEmpty>, <isEqual>, <isNotEqual> 조건 태그 해석
    //       #PARAM# → ? 치환, CDATA 제거, ORDER BY 제거
    private String buildIbatisCountSql(String xml, String queryId,
                                        Map<String, String> params, List<Object> args) {
        java.util.regex.Matcher sm = java.util.regex.Pattern
            .compile("(?i)<select[^>]+id=['\"]" + java.util.regex.Pattern.quote(queryId)
                     + "['\"][^>]*>(.*?)</select>", java.util.regex.Pattern.DOTALL)
            .matcher(xml);
        if (!sm.find()) return null;

        String body = sm.group(1);
        body = body.replaceAll("(?s)<!--.*?-->", " ");          // XML 주석 제거
        body = body.replaceAll("<!\\[CDATA\\[", "")             // CDATA 제거
                   .replaceAll("\\]\\]>", "");

        body = applyIbatisConds(body, params, args);            // 조건 태그 적용 + ? 치환

        // ORDER BY 제거 (서브쿼리 안쪽 마지막 ORDER BY 포함)
        body = body.replaceAll("(?i)(?s)\\s+ORDER\\s+BY\\s+[^)]+(?=\\s*\\)\\s*[A-Za-z])", " ");
        body = body.replaceAll("(?i)\\s+ORDER\\s+BY\\s+.*$", "");

        body = body.trim();
        // 전체 SELECT를 서브쿼리로 감싸서 COUNT(*) 반환
        return "SELECT COUNT(*) FROM (\n" + body + "\n) CNT_TBL_";
    }

    // iBatis 조건 태그 재귀 해석 + #PARAM# → ? 치환
    private String applyIbatisConds(String text, Map<String, String> params, List<Object> args) {
        StringBuilder sb = new StringBuilder();
        int i = 0;
        while (i < text.length()) {
            if (text.charAt(i) != '<') { sb.append(text.charAt(i++)); continue; }

            // 태그 이름 확인
            int nameEnd = i + 1;
            while (nameEnd < text.length() && text.charAt(nameEnd) != '>'
                   && text.charAt(nameEnd) != ' ' && text.charAt(nameEnd) != '/') nameEnd++;
            String tagName = text.substring(i + 1, nameEnd);

            if (!tagName.startsWith("is") && !tagName.startsWith("Is")) {
                sb.append(text.charAt(i++)); continue;
            }

            int tagClose = text.indexOf('>', i);
            if (tagClose < 0) { sb.append(text.charAt(i++)); continue; }
            String openTag = text.substring(i, tagClose + 1);

            String closingTag = "</" + tagName + ">";
            int closeIdx = findClosingTag(text, tagClose + 1, tagName);
            if (closeIdx < 0) { sb.append(text.charAt(i++)); continue; }

            String inner = text.substring(tagClose + 1, closeIdx);
            String prepend     = ibatisAttr(openTag, "prepend");
            String property    = ibatisAttr(openTag, "property");
            String compareVal  = ibatisAttr(openTag, "compareValue");

            String pval = params.getOrDefault(property, "");
            boolean include;
            switch (tagName.toLowerCase()) {
                case "isnotempty":    include = !pval.isEmpty();             break;
                case "isempty":       include =  pval.isEmpty();             break;
                case "isequal":       include =  pval.equals(compareVal);    break;
                case "isnotequal":    include = !pval.equals(compareVal);    break;
                case "isgreaterthan":
                    try { include = Double.parseDouble(pval) > Double.parseDouble(compareVal); }
                    catch (Exception e2) { include = false; }
                    break;
                case "islessthan":
                    try { include = Double.parseDouble(pval) < Double.parseDouble(compareVal); }
                    catch (Exception e2) { include = false; }
                    break;
                default: include = true;
            }

            if (include) {
                if (!prepend.isEmpty()) sb.append(" ").append(prepend).append(" ");
                sb.append(applyIbatisConds(inner, params, args));
            }

            i = closeIdx + closingTag.length();
        }

        // #PARAM# → ? 치환
        String raw = sb.toString();
        StringBuffer out = new StringBuffer();
        java.util.regex.Matcher pm = java.util.regex.Pattern.compile("#([^#]+)#").matcher(raw);
        while (pm.find()) {
            String pname = pm.group(1).trim();
            args.add(params.getOrDefault(pname, ""));
            pm.appendReplacement(out, "?");
        }
        pm.appendTail(out);
        return out.toString();
    }

    // 동일 깊이에서 tagName 닫는 태그 위치 탐색
    private int findClosingTag(String text, int from, String tagName) {
        String open  = "<"  + tagName;
        String close = "</" + tagName + ">";
        int depth = 1, pos = from;
        while (pos < text.length()) {
            int nextOpen  = text.indexOf(open,  pos);
            int nextClose = text.indexOf(close, pos);
            if (nextClose < 0) return -1;
            if (nextOpen >= 0 && nextOpen < nextClose) {
                depth++;
                pos = nextOpen + open.length();
            } else {
                depth--;
                if (depth == 0) return nextClose;
                pos = nextClose + close.length();
            }
        }
        return -1;
    }

    private String ibatisAttr(String tag, String attr) {
        java.util.regex.Matcher m = java.util.regex.Pattern
            .compile(attr + "=['\"]([^'\"]*)['\"]").matcher(tag);
        return m.find() ? m.group(1) : "";
    }


}
