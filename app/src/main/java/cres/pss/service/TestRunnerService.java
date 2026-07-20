package cres.pss.service;

import java.io.*;
import java.util.*;
import java.util.regex.*;
import java.util.zip.*;
import javax.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestRunnerService {

    @Autowired
    private ReportService reportSvc;

    // ── PUBLIC endpoint logic ─────────────────────────────────────────────────

    public void runTest(HttpServletRequest request, HttpServletResponse response,
                        String prefix,
                        boolean headed,
                        String specFileName) throws Exception {
        String singleRowNoStr = request.getParameter("singleRowNo");
        Integer singleRowNo = (singleRowNoStr != null && !singleRowNoStr.isEmpty())
                ? Integer.parseInt(singleRowNoStr) : null;
        runTest(request, response, prefix, headed, specFileName, singleRowNo);
    }

    public void runTest(HttpServletRequest request, HttpServletResponse response,
                        String prefix,
                        boolean headed,
                        String specFileName,
                        Integer singleRowNo) throws Exception {
        response.setContentType("text/event-stream;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("X-Accel-Buffering", "no");
        PrintWriter writer = response.getWriter();

        System.out.println("[DEBUG-RUN] runTest 호출 prefix='" + prefix + "' specFileName='" + specFileName + "'");
        System.out.println("[DEBUG-RUN] SCENARIO_STORE keys=" + AiStateStore.SCENARIO_STORE.keySet());
        List<Map<String, Object>> scenarios = AiStateStore.SCENARIO_STORE.get(prefix);
        System.out.println("[DEBUG-RUN] SCENARIO_STORE.get('" + prefix + "') = " + (scenarios == null ? "null" : scenarios.size() + "건"));
        if (scenarios == null || scenarios.isEmpty()) {
            System.out.println("[DEBUG-RUN] ★ 시나리오 없음 → error 반환");
            writer.write("event: error\ndata: 시나리오가 없습니다 (prefix='" + prefix + "'). 먼저 시나리오를 생성하세요.\n\n");
            writer.flush();
            return;
        }
        System.out.println("[DEBUG-RUN] 시나리오 " + scenarios.size() + "건 확인 → 실행 진행");

        File specDir  = getSpecDir(request);
        File workDir  = specDir.getParentFile();

        // ── 실행할 spec.ts 파일명 결정 (우선순위: 클라이언트 전달 → 서버 메모리 → 디렉토리 탐색)
        String integFileName = null;
        String unitFileNameParam = null;

        // 1순위: 클라이언트가 직접 전달한 파일명 (가장 신뢰할 수 있음)
        if (specFileName != null && !specFileName.trim().isEmpty()) {
            String trimmedName = specFileName.trim();
            if (trimmedName.endsWith("_inte.spec.ts")) {
                integFileName = trimmedName;
            } else if (trimmedName.endsWith("_unit.spec.ts")) {
                unitFileNameParam = trimmedName;
            }
        }

        // 2순위: 서버 메모리 (SPEC_FILE_STORE) — 서버 재시작 전까지 유효
        if (integFileName == null && unitFileNameParam == null) {
            integFileName = AiStateStore.SPEC_FILE_STORE.get(prefix);
        }

        // 3순위: 디렉토리 탐색 — tests/integration/ 에서 최신 파일 선택
        if (integFileName == null && unitFileNameParam == null) {
            File integDir = new File(specDir, "integration");
            File[] candidates = integDir.listFiles((d, n) -> n.endsWith("_inte.spec.ts"));
            if (candidates != null && candidates.length > 0) {
                java.util.Arrays.sort(candidates, (a, b) -> Long.compare(b.lastModified(), a.lastModified()));
                integFileName = candidates[0].getName();
            }
        }

        File specFile = (integFileName != null) ? new File(specDir, "integration/" + integFileName) : null;
        boolean integExists = specFile != null && specFile.exists();

        // ── 통합 spec이 없으면 단위(unit) spec으로 폴백 — 단위 전용 시나리오(UT_ 접두사) 케이스 ──
        // 통합 spec 자체가 생성되지 않은 상태에서도(SpecGenService가 통합 대상 없으면 생략함)
        // 실제 존재하는 단위 spec으로 테스트를 실행할 수 있어야 한다.
        String unitFileName = unitFileNameParam;
        if (!integExists) {
            if (unitFileName == null && integFileName != null) {
                unitFileName = integFileName.replace("_inte.spec.ts", "_unit.spec.ts");
            }
            if (unitFileName == null) {
                File unitDir = new File(specDir, "unit");
                File[] uCandidates = unitDir.listFiles((d, n) -> n.endsWith("_unit.spec.ts"));
                if (uCandidates != null && uCandidates.length > 0) {
                    java.util.Arrays.sort(uCandidates, (a, b) -> Long.compare(b.lastModified(), a.lastModified()));
                    unitFileName = uCandidates[0].getName();
                }
            }
        }
        File unitOnlyFile = (unitFileName != null) ? new File(specDir, "unit/" + unitFileName) : null;
        boolean unitOnlyExists = !integExists && unitOnlyFile != null && unitOnlyFile.exists();

        if (!integExists && !unitOnlyExists) {
            writer.write("event: error\ndata: spec.ts 파일이 없습니다. 시나리오를 다시 생성하세요.\n\n");
            writer.flush();
            return;
        }

        String specRelPath = integExists ? ("tests/integration/" + integFileName)
                                          : ("tests/unit/" + unitFileName);
        String projectName = integExists ? "integration" : "unit";

        // 전체 running 상태 전송
        try {
            for (Map<String, Object> s : scenarios) {
                int no = ((Number) s.get("no")).intValue();
                writer.write("event: running\ndata: " + no + "|" + str(s,"scenarioId") + "|" + str(s,"url") + "\n\n");
                writer.flush();
            }
        } catch (Exception runEx) {
            writer.write("event: error\ndata: 시나리오 처리 오류: " + escEvt(runEx.getMessage()) + "\n\n");
            writer.flush();
            return;
        }

        writer.write("event: log\ndata: === Playwright 실행: " + specRelPath + (headed ? " [--headed]" : " [headless]") + " ===\n\n");
        writer.flush();

        // ── CDP 브라우저 사전 실행 보장 ──────────────────────────────────────
        // fixtures.ts는 .auth/browser-ws.json이 있으면 그 Chrome에 연결해 창을 유지한다.
        // 매번 [테스트] 버튼(=새 npx 프로세스)을 눌러도 같은 창이 재사용되도록,
        // 테스트 프로세스를 띄우기 전에 "npm run browser:start"가 먼저 실행되어 있는지 확인하고
        // 없으면 여기서 백그라운드로 실행한다.
        ensureBrowserStarted(writer, workDir);

        String headedOpt = headed ? " --headed" : "";
        ProcessBuilder pb = new ProcessBuilder(
            "cmd", "/c",
            "npx playwright test " + specRelPath + " --project=" + projectName + headedOpt
        );
        pb.directory(workDir);
        pb.redirectErrorStream(true);

        // npm/npx PATH 보장 (JVM 프로세스가 사용자 AppData\npm 경로를 상속하지 못하는 경우 대비)
        {
            Map<String, String> env = pb.environment();
            String userAppData = System.getenv("APPDATA");
            String userHome    = System.getProperty("user.home", "");
            String existPath   = env.containsKey("PATH") ? env.get("PATH") : env.getOrDefault("Path", "");
            StringBuilder newPath = new StringBuilder();
            for (String p : new String[]{
                    userAppData != null ? userAppData + "\\npm" : "",
                    userHome + "\\AppData\\Roaming\\npm",
                    workDir.getAbsolutePath() + "\\node_modules\\.bin",
                    "C:\\Program Files\\nodejs"}) {
                if (!p.isEmpty() && !existPath.contains(p)) newPath.append(p).append(";");
            }
            newPath.append(existPath);
            env.put("PATH", newPath.toString());
        }

        Process proc;
        try {
            proc = pb.start();
            AiStateStore.RUNNING_PROC.put(prefix, proc);
            registerProcessPid(prefix, proc);  // 시작 직후 PID 추출 저장
        } catch (Exception e) {
            writer.write("event: error\ndata: Playwright 실행 오류: " + escEvt(e.getMessage()) + "\n\n");
            writer.flush();
            return;
        }

        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(proc.getInputStream(), "UTF-8"))) {
            String line;
            while ((line = br.readLine()) != null) {
                writer.write("event: log\ndata: " + escEvt(line) + "\n\n");
                writer.flush();
            }
        }

        int exitCode = proc.waitFor();
        AiStateStore.RUNNING_PROC.remove(prefix);

        // ── 단위 spec이 존재하면 병렬(백그라운드)로 실행 ─────────────────────────
        // 단위 테스트는 page.request.post만 사용 → 브라우저 창과 충돌 없음
        // (통합 spec이 없어 위에서 이미 단위 spec을 primary로 실행한 경우는 중복 실행하지 않음)
        String bgUnitFileName = integExists && integFileName != null
                ? integFileName.replace("_inte.spec.ts", "_unit.spec.ts") : null;
        File unitSpecFile   = (bgUnitFileName != null) ? new File(workDir, "tests/unit/" + bgUnitFileName) : null;
        Process unitProc    = null;
        if (unitSpecFile != null && unitSpecFile.exists()) {
            writer.write("event: log\ndata: === 단위 테스트 병렬 실행: " + bgUnitFileName + " ===\n\n");
            writer.flush();
            try {
                ProcessBuilder pbUnit = new ProcessBuilder(
                    "cmd", "/c",
                    "npx playwright test tests/unit/" + bgUnitFileName
                        + " --project=unit"
                );
                pbUnit.directory(workDir);
                pbUnit.redirectErrorStream(true);
                // PATH 동일 설정
                Map<String, String> envUnit = pbUnit.environment();
                String userAppData2 = System.getenv("APPDATA");
                String userHome2    = System.getProperty("user.home", "");
                String existPath2   = envUnit.containsKey("PATH") ? envUnit.get("PATH") : envUnit.getOrDefault("Path", "");
                StringBuilder np2 = new StringBuilder();
                for (String p : new String[]{
                        userAppData2 != null ? userAppData2 + "\\npm" : "",
                        userHome2 + "\\AppData\\Roaming\\npm",
                        workDir.getAbsolutePath() + "\\node_modules\\.bin",
                        "C:\\Program Files\\nodejs"}) {
                    if (!p.isEmpty() && !existPath2.contains(p)) np2.append(p).append(";");
                }
                envUnit.put("PATH", np2.append(existPath2).toString());
                envUnit.put("TEST_PROJECT", "unit");
                unitProc = pbUnit.start();
                // 단위 테스트 로그는 별도 스레드로 비동기 소비 (통합 결과 처리를 블록하지 않음)
                final Process _unitProc = unitProc;
                new Thread(() -> {
                    try (BufferedReader br2 = new BufferedReader(
                            new InputStreamReader(_unitProc.getInputStream(), "UTF-8"))) {
                        String line2;
                        while ((line2 = br2.readLine()) != null) {
                            // 단위 테스트 로그는 조용히 소비 (SSE writer는 thread-safe 아님)
                        }
                    } catch (Exception ignored) {}
                }, "unit-proc-drain").start();
            } catch (Exception ue) {
                writer.write("event: log\ndata: 단위 테스트 실행 오류 (통합 결과에는 영향 없음): " + escEvt(ue.getMessage()) + "\n\n");
                writer.flush();
            }
        }

        // JSON 결과 파싱
        Map<Integer, String[]> testResults = new LinkedHashMap<>();
        Map<String, String> stepResults    = new LinkedHashMap<>();
        File resultsJson = new File(workDir, "test-results/results.json");
        if (resultsJson.exists()) {
            String jsonStr = readFileSafe(resultsJson);
            try { testResults = parsePlaywrightJson(jsonStr); }     catch (Exception ignored) {}
            try { stepResults = parsePlaywrightStepJson(jsonStr); } catch (Exception ignored) {}
        }

        // 결과 전송
        int pass = 0, fail = 0;
        String defaultResult = exitCode == 0 ? "PASS" : "FAIL";
        String defaultRemark = exitCode != 0 ? "exit:" + exitCode : "";

        if (singleRowNo != null) {
            for (Map<String, Object> s : scenarios) {
                int no = ((Number) s.get("no")).intValue();
                if (no != singleRowNo) continue;
                String testResult = buildIntegResult(s, no, testResults, stepResults, defaultResult, defaultRemark);
                String remark     = getResultRemark(testResults, no, defaultRemark, testResult);
                s.put("testResult", testResult);
                s.put("remark",     remark);
                if ("PASS".equals(testResult)) pass++; else fail++;
                writer.write("event: result\ndata: " + buildResultJson(s, no, testResult, remark) + "\n\n");
                writer.flush();
                break;
            }
            writer.write("event: done\ndata: 단일 TC 테스트 완료|PASS " + pass + "건|FAIL " + fail + "건\n\n");
        } else {
            for (Map<String, Object> s : scenarios) {
                int no = ((Number) s.get("no")).intValue();
                String testResult = buildIntegResult(s, no, testResults, stepResults, defaultResult, defaultRemark);
                String remark     = getResultRemark(testResults, no, defaultRemark, testResult);
                s.put("testResult", testResult);
                s.put("remark",     remark);
                if ("PASS".equals(testResult)) pass++; else fail++;
                writer.write("event: result\ndata: " + buildResultJson(s, no, testResult, remark) + "\n\n");
                writer.flush();
            }
            writer.write("event: done\ndata: 테스트 완료|전체 " + scenarios.size()
                         + "건|PASS " + pass + "건|FAIL " + fail + "건\n\n");
        }
        writer.flush();

        // _workspace/{prefix}/03_results.json 저장 (SKILL.md 규칙)
        try {
            String safePfxW = (prefix == null || prefix.trim().isEmpty()) ? "all"
                    : prefix.trim().replaceAll("[^a-zA-Z0-9_]", "");
            File wsDir = new File(workDir, "_workspace/" + safePfxW);
            wsDir.mkdirs();
            StringBuilder rjson = new StringBuilder("[");
            boolean first = true;
            for (Map<String, Object> s : scenarios) {
                if (!first) rjson.append(",");
                first = false;
                rjson.append("{\"no\":").append(s.get("no"))
                     .append(",\"scenarioId\":\"").append(jsonEsc(str(s,"scenarioId"))).append("\"")
                     .append(",\"testName\":\"").append(jsonEsc(str(s,"testName"))).append("\"")
                     .append(",\"testResult\":\"").append(jsonEsc(str(s,"testResult"))).append("\"")
                     .append(",\"remark\":\"").append(jsonEsc(str(s,"remark"))).append("\"")
                     .append("}");
            }
            rjson.append("]");
            writeFileSafe(new File(wsDir, "03_results.json"), rjson.toString());
            if (exitCode != 0) {
                String errContent = "exitCode=" + exitCode + "\nprefix=" + prefix + "\nspec=" + specRelPath;
                writeFileSafe(new File(wsDir, "03_error.log"), errContent);
            }
        } catch (Exception ignored) {}

        // 단위 프로세스 완료 대기 (백그라운드 실행이었으므로 종료 후 cleanup)
        if (unitProc != null) {
            try { unitProc.waitFor(60, java.util.concurrent.TimeUnit.SECONDS); }
            catch (Exception ignored) {}
        }
    }

    public Map<String, Object> stopTest(HttpServletRequest request, HttpServletResponse response,
                                        String prefix) {
        Map<String, Object> result = new LinkedHashMap<>();
        Process proc = AiStateStore.RUNNING_PROC.remove(prefix);
        if (proc != null && proc.isAlive()) {
            Long pid = AiStateStore.RUNNING_PID.remove(prefix);
            boolean killed = false;
            if (pid != null && pid > 0) {
                try {
                    Process kill = new ProcessBuilder("taskkill", "/F", "/T", "/PID", String.valueOf(pid))
                            .redirectErrorStream(true).start();
                    kill.waitFor(5, java.util.concurrent.TimeUnit.SECONDS);
                    killed = true;
                } catch (Exception ignored) {}
            }
            if (!killed) {
                try {
                    new ProcessBuilder("taskkill", "/F", "/T", "/IM", "node.exe")
                            .redirectErrorStream(true).start()
                            .waitFor(3, java.util.concurrent.TimeUnit.SECONDS);
                } catch (Exception ignored) {}
            }
            result.put("success", true);
            result.put("message", "테스트가 중지되었습니다.");
        } else {
            result.put("success", false);
            result.put("message", "실행 중인 테스트가 없습니다.");
        }
        return result;
    }

    public void runSpecTest(HttpServletRequest request, HttpServletResponse response,
                            String specFile) throws Exception {
        runSpecTest(request, response, specFile, true, "");
    }

    public void runSpecTest(HttpServletRequest request, HttpServletResponse response,
                            String specFile, boolean headed, String project) throws Exception {
        response.setContentType("text/event-stream;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("X-Accel-Buffering", "no");
        PrintWriter writer = response.getWriter();

        if (specFile.contains("..") || specFile.contains("\\")) {
            writer.write("event: error\ndata: 잘못된 경로입니다.\n\n");
            writer.flush();
            return;
        }

        File workDir = getSpecDir(request).getParentFile();

        // --project 자동 결정: 파라미터 우선, 없으면 파일명/경로에서 유추
        String proj = project;
        if (proj == null || proj.trim().isEmpty()) {
            if (specFile.contains("integration")) proj = "integration";
            else if (specFile.contains("unit"))    proj = "unit";
            else if (specFile.contains("e2e"))     proj = "e2e";
            else                                   proj = "integration";
        }

        String headedOpt = headed ? " --headed" : "";
        String cmdStr = "npx playwright test " + specFile
                + " --project=" + proj + headedOpt;

        writer.write("event: log\ndata: === Playwright 실행: " + specFile
                + " [--project=" + proj + (headed ? " --headed" : " headless") + "] ===\n\n");
        writer.flush();

        ProcessBuilder pb = new ProcessBuilder("cmd", "/c", cmdStr);
        pb.directory(workDir);
        pb.redirectErrorStream(true);

        // PATH 주입 (npx/node 경로 보장)
        {
            Map<String, String> env = pb.environment();
            String userAppData = System.getenv("APPDATA");
            String userHome    = System.getProperty("user.home", "");
            String existPath   = env.containsKey("PATH") ? env.get("PATH") : env.getOrDefault("Path", "");
            StringBuilder newPath = new StringBuilder();
            for (String p : new String[]{
                    userAppData != null ? userAppData + "\\npm" : "",
                    userHome + "\\AppData\\Roaming\\npm",
                    workDir.getAbsolutePath() + "\\node_modules\\.bin",
                    "C:\\Program Files\\nodejs"}) {
                if (!p.isEmpty() && !existPath.contains(p)) newPath.append(p).append(";");
            }
            newPath.append(existPath);
            env.put("PATH", newPath.toString());
        }

        Process proc;
        try {
            proc = pb.start();
            AiStateStore.RUNNING_PROC.put("__spec__", proc);
            registerProcessPid("__spec__", proc);
        } catch (Exception e) {
            writer.write("event: error\ndata: Playwright 실행 오류: " + escEvt(e.getMessage()) + "\n\n");
            writer.flush();
            return;
        }

        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(proc.getInputStream(), "UTF-8"))) {
            String line;
            while ((line = br.readLine()) != null) {
                writer.write("event: log\ndata: " + escEvt(line) + "\n\n");
                writer.flush();
            }
        }

        int exitCode = proc.waitFor();
        AiStateStore.RUNNING_PROC.remove("__spec__");
        String status = exitCode == 0 ? "PASS" : "FAIL";
        writer.write("event: done\ndata: 테스트 완료|" + status + "|exitCode:" + exitCode + "\n\n");
        writer.flush();
    }

    public Map<String, Object> stopSpecTest(HttpServletRequest request, HttpServletResponse response,
                                            String specFile) {
        Map<String, Object> result = new LinkedHashMap<>();
        Process proc = AiStateStore.RUNNING_PROC.remove("__spec__");
        System.out.println("[stopSpecTest] proc=" + proc + ", isAlive=" + (proc != null && proc.isAlive()));
        if (proc != null && proc.isAlive()) {
            // 저장된 PID로 프로세스 트리 전체 종료 (cmd.exe → node.exe → chromium 포함)
            Long pid = AiStateStore.RUNNING_PID.remove("__spec__");
            System.out.println("[stopSpecTest] 저장된 PID=" + pid);
            boolean killed = false;
            if (pid != null && pid > 0) {
                try {
                    Process kill = new ProcessBuilder("taskkill", "/F", "/T", "/PID", String.valueOf(pid))
                            .redirectErrorStream(true).start();
                    // taskkill 출력 읽기 (JDK 1.8 호환)
                    String killOut = readStream(kill.getInputStream());
                    int exitCode = kill.waitFor();
                    System.out.println("[stopSpecTest] taskkill /PID " + pid + " → exitCode=" + exitCode + " output=" + killOut.trim());
                    killed = (exitCode == 0);
                } catch (Exception e) {
                    System.out.println("[stopSpecTest] taskkill 예외: " + e.getMessage());
                }
            } else {
                System.out.println("[stopSpecTest] PID 없음 — 폴백으로 node.exe 종료 시도");
            }
            // PID 없거나 taskkill 실패 시 — node.exe 이름 기반 폴백
            if (!killed) {
                try {
                    Process kill2 = new ProcessBuilder("taskkill", "/F", "/T", "/IM", "node.exe")
                            .redirectErrorStream(true).start();
                    String kill2Out = readStream(kill2.getInputStream());
                    int exitCode2 = kill2.waitFor();
                    System.out.println("[stopSpecTest] taskkill /IM node.exe → exitCode=" + exitCode2 + " output=" + kill2Out.trim());
                } catch (Exception e) {
                    System.out.println("[stopSpecTest] node.exe 종료 예외: " + e.getMessage());
                }
            }
            System.out.println("[stopSpecTest] 종료 후 proc.isAlive=" + proc.isAlive());
            result.put("success", true);
            result.put("message", "테스트가 중지되었습니다.");
        } else {
            System.out.println("[stopSpecTest] 실행 중인 프로세스 없음");
            result.put("success", false);
            result.put("message", "실행 중인 테스트가 없습니다.");
        }
        return result;
    }

    // ── 자동 수정 루프용 단일 실행 헬퍼 ─────────────────────────────────────────
    /**
     * Playwright를 한 번 실행하고 결과를 반환한다 (전체 spec 실행).
     * SSE log 이벤트는 writer로 스트리밍, done 이벤트는 전송하지 않음.
     */
    public Map<Integer, String[]> runPlaywrightOnce(
            String integFileName, File workDir, boolean headed,
            String loopKey, PrintWriter writer) throws Exception {
        return runPlaywrightOnce(integFileName, workDir, headed, loopKey, writer, null);
    }

    /**
     * Playwright를 한 번 실행하고 결과를 반환한다.
     * grepPattern이 있으면 --grep 옵션으로 해당 TC만 실행 (TC 단위 루프용).
     *
     * @param grepPattern null이면 전체 실행, 예: "\\[no:2\\]" 이면 해당 TC만
     * @return scenarioNo → [testResult, remark] 맵
     */
    public Map<Integer, String[]> runPlaywrightOnce(
            String integFileName, File workDir, boolean headed,
            String loopKey, PrintWriter writer, String grepPattern) throws Exception {

        String headedOpt = headed ? " --headed" : "";
        String grepOpt   = (grepPattern != null && !grepPattern.isEmpty())
                           ? " --grep \"" + grepPattern + "\"" : "";
        String runSpecPath = "tests/integration/" + integFileName;
        ProcessBuilder pb = new ProcessBuilder(
            "cmd", "/c",
            "npx playwright test " + runSpecPath
                + " --project=integration" + headedOpt + grepOpt
        );
        pb.directory(workDir);
        pb.redirectErrorStream(true);

        // PATH 주입 (동일 로직)
        Map<String, String> env = pb.environment();
        String userAppData = System.getenv("APPDATA");
        String userHome    = System.getProperty("user.home", "");
        String existPath   = env.containsKey("PATH") ? env.get("PATH") : env.getOrDefault("Path", "");
        StringBuilder newPath = new StringBuilder();
        for (String p : new String[]{
                userAppData != null ? userAppData + "\\npm" : "",
                userHome + "\\AppData\\Roaming\\npm",
                workDir.getAbsolutePath() + "\\node_modules\\.bin",
                "C:\\Program Files\\nodejs"}) {
            if (!p.isEmpty() && !existPath.contains(p)) newPath.append(p).append(";");
        }
        newPath.append(existPath);
        env.put("PATH", newPath.toString());

        Process proc;
        try {
            proc = pb.start();
            AiStateStore.RUNNING_PROC.put(loopKey, proc);
            registerProcessPid(loopKey, proc);
        } catch (Exception e) {
            if (writer != null) writer.write("event: log\ndata: Playwright 실행 오류: " + escEvt(e.getMessage()) + "\n\n");
            if (writer != null) writer.flush();
            return new LinkedHashMap<>();
        }

        // stdout 스트리밍
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(proc.getInputStream(), "UTF-8"))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (writer != null) {
                    writer.write("event: log\ndata: " + escEvt(line) + "\n\n");
                    writer.flush();
                }
            }
        }

        int exitCode = proc.waitFor();
        AiStateStore.RUNNING_PROC.remove(loopKey);
        AiStateStore.RUNNING_PID.remove(loopKey);

        // results.json 파싱
        File resultsJson = new File(workDir, "test-results/results.json");
        Map<Integer, String[]> parsed = new LinkedHashMap<>();
        if (resultsJson.exists()) {
            try { parsed = parsePlaywrightJson(readFileSafe(resultsJson)); }
            catch (Exception ignored) {}
        }
        // 파싱 결과가 없으면 exitCode 기반 단일 결과
        if (parsed.isEmpty()) {
            parsed.put(-1, new String[]{ exitCode == 0 ? "PASS" : "FAIL",
                                         exitCode != 0 ? "exit:" + exitCode : "" });
        }
        return parsed;
    }

    // ── PRIVATE helpers ───────────────────────────────────────────────────────

    private void registerProcessPid(String key, Process proc) {
        long pid = -1;
        String foundIn = "없음";
        try {
            Class<?> cls = proc.getClass();
            while (cls != null) {
                try {
                    java.lang.reflect.Field f = cls.getDeclaredField("pid");
                    f.setAccessible(true);
                    pid = ((Number) f.get(proc)).longValue();
                    foundIn = cls.getName();
                    break;
                } catch (NoSuchFieldException e) {
                    cls = cls.getSuperclass();
                }
            }
        } catch (Exception e) {
            System.out.println("[registerPid] reflection 예외: " + e.getMessage());
        }
        System.out.println("[registerPid] key=" + key + " pid=" + pid + " class=" + foundIn);
        AiStateStore.RUNNING_PID.put(key, pid);
    }

    private Map<Integer, String[]> parsePlaywrightJson(String json) {
        Map<Integer, String[]> results = new LinkedHashMap<>();
        Pattern pat = Pattern.compile(
            "\"title\"\\s*:\\s*\"(\\[no:\\d+\\][^\"]*)\"[\\s\\S]{1,2000}?\"ok\"\\s*:\\s*(true|false)");
        Matcher m = pat.matcher(json);
        while (m.find()) {
            String title = m.group(1);
            boolean ok   = "true".equals(m.group(2));
            Matcher nm   = Pattern.compile("\\[no:(\\d+)\\]").matcher(title);
            if (nm.find()) {
                int no = Integer.parseInt(nm.group(1));
                if (!results.containsKey(no)) {
                    String remark = "";
                    if (!ok) {
                        remark = extractErrorMessage(json, m.end());
                        if (remark.isEmpty()) remark = "테스트 실패";
                    }
                    results.put(no, new String[]{ ok ? "PASS" : "FAIL", remark });
                }
            }
        }
        return results;
    }

    /**
     * ok:false 위치 이후(다음 spec의 title 이전)에서 가장 가까운 errors[].message(또는
     * error.message)를 찾아 ANSI 코드 제거 + 첫 줄만 추출한 요약 문자열을 반환한다.
     * 없으면 빈 문자열 — 이전엔 이 정보를 아예 안 읽고 "테스트 실패" 고정 문자열만 남겨서
     * 그리드의 실패사유 컬럼만으로는 실제 원인(어떤 assert/에러인지)을 알 수 없었다.
     */
    private String extractErrorMessage(String json, int fromIndex) {
        int nextTitle = json.indexOf("\"title\"", fromIndex);
        int end = (nextTitle > fromIndex) ? nextTitle : json.length();
        end = Math.min(end, fromIndex + 8000);
        if (end <= fromIndex) return "";
        String segment = json.substring(fromIndex, end);
        Matcher mm = Pattern.compile("\"message\"\\s*:\\s*\"((?:[^\"\\\\]|\\\\.)*)\"").matcher(segment);
        if (!mm.find()) return "";
        String raw = unescapeJsonString(mm.group(1));
        raw = raw.replaceAll("\u001B\\[[0-9;]*[a-zA-Z]", ""); // ANSI 색상 코드 제거
        int nl = raw.indexOf('\n');
        String firstLine = (nl >= 0 ? raw.substring(0, nl) : raw).trim();
        firstLine = firstLine.replaceFirst("^Error:\\s*", ""); // Node/Playwright의 "Error: " 접두사 제거
        if (firstLine.length() > 300) firstLine = firstLine.substring(0, 300) + "...";
        return firstLine;
    }

    private String unescapeJsonString(String s) {
        StringBuilder sb = new StringBuilder(s.length());
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '\\' && i + 1 < s.length()) {
                char next = s.charAt(i + 1);
                switch (next) {
                    case 'n':  sb.append('\n'); i++; break;
                    case 'r':  sb.append('\r'); i++; break;
                    case 't':  sb.append('\t'); i++; break;
                    case '"':  sb.append('"');  i++; break;
                    case '\\': sb.append('\\'); i++; break;
                    case '/':  sb.append('/');  i++; break;
                    case 'u':
                        if (i + 5 < s.length()) {
                            try {
                                sb.append((char) Integer.parseInt(s.substring(i + 2, i + 6), 16));
                                i += 5;
                            } catch (NumberFormatException nfe) {
                                sb.append(c);
                            }
                        } else sb.append(c);
                        break;
                    default: sb.append(c);
                }
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    // result.md §9.3: 통합 시나리오의 testResult 결정 (flowSteps 기반)
    @SuppressWarnings("unchecked")
    private String buildIntegResult(Map<String, Object> scenario, int no,
                                    Map<Integer, String[]> testResults,
                                    Map<String, String> stepResults,
                                    String defaultResult, String defaultRemark) {
        Object flowStepsObj = scenario.get("flowSteps");
        if (!(flowStepsObj instanceof List)) {
            // 단위 시나리오 또는 flowSteps 없는 경우 — 기존 방식
            String[] res = testResults.get(no);
            return res != null ? res[0] : defaultResult;
        }
        List<Map<String, Object>> flowSteps = (List<Map<String, Object>>) flowStepsObj;
        boolean anyResult = false;
        for (Map<String, Object> step : flowSteps) {
            int stepNo = step.get("step") != null ? ((Number) step.get("step")).intValue() : 0;
            String key = no + "_" + stepNo;
            String sr  = stepResults.containsKey(key) ? stepResults.get(key) : "SKIP";
            step.put("stepResult", sr);
            if (!"SKIP".equals(sr)) anyResult = true;
        }
        if (!anyResult) {
            // step 결과가 전혀 없으면 시나리오 전체 결과 사용
            String[] res = testResults.get(no);
            String overall = res != null ? res[0] : defaultResult;
            flowSteps.forEach(fs -> fs.put("stepResult", overall));
        }
        return resolveIntegPassYn(flowSteps);
    }

    private String getResultRemark(Map<Integer, String[]> testResults, int no,
                                   String defaultRemark, String testResult) {
        String[] res = testResults.get(no);
        if (res != null && res[1] != null && !res[1].isEmpty()) return res[1];
        return "FAIL".equals(testResult) ? defaultRemark : "";
    }

    // result.md §9.4: SSE result 이벤트 JSON 페이로드 생성
    @SuppressWarnings("unchecked")
    private String buildResultJson(Map<String, Object> scenario, int no,
                                   String status, String remark) {
        StringBuilder sb = new StringBuilder();
        sb.append("{\"type\":\"result\",\"no\":").append(no)
          .append(",\"status\":\"").append(status).append("\"");

        Object flowStepsObj = scenario.get("flowSteps");
        if (flowStepsObj instanceof List) {
            List<Map<String, Object>> flowSteps = (List<Map<String, Object>>) flowStepsObj;
            sb.append(",\"stepResults\":[");
            for (int i = 0; i < flowSteps.size(); i++) {
                Map<String, Object> fs = flowSteps.get(i);
                if (i > 0) sb.append(",");
                String sr = fs.get("stepResult") != null ? String.valueOf(fs.get("stepResult")) : "SKIP";
                sb.append("{\"step\":").append(fs.get("step") != null ? fs.get("step") : i + 1)
                  .append(",\"stepResult\":\"").append(sr).append("\"}");
            }
            sb.append("]");
        } else {
            sb.append(",\"stepResults\":[]");
        }

        // FAIL 시 결함패널(ReportService.buildFixSuggestion)과 동일한 원인+조치가능도+수정제안
        // 텍스트를 시나리오 목록 행에도 즉시 표시 — 사용자가 별도로 "AI 소스 개선방안 분석"
        // 버튼을 눌러야만 보이던 것을 테스트 완료 시 자동으로 채워준다.
        String fixSuggestion = "FAIL".equals(status) && !remark.isEmpty()
            ? reportSvc.buildFixSuggestion(remark, str(scenario, "url"))
            : "";

        sb.append(",\"remark\":\"").append(escJson(remark)).append("\"")
          .append(",\"fixSuggestion\":\"").append(escJson(fixSuggestion)).append("\"}");
        return sb.toString();
    }

    private String escJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", " ").replace("\r", "");
    }

    // result.md §9: 통합테스트 [no:N][step:M] 단계별 결과 파싱
    private Map<String, String> parsePlaywrightStepJson(String json) {
        Map<String, String> results = new LinkedHashMap<>();
        Pattern pat = Pattern.compile(
            "\"title\"\\s*:\\s*\"(\\[no:\\d+\\]\\[step:\\d+\\][^\"]*)\"[\\s\\S]{1,2000}?\"ok\"\\s*:\\s*(true|false)");
        Matcher m = pat.matcher(json);
        while (m.find()) {
            String title = m.group(1);
            boolean ok   = "true".equals(m.group(2));
            Matcher nm = Pattern.compile("\\[no:(\\d+)\\]\\[step:(\\d+)\\]").matcher(title);
            if (nm.find()) {
                String key = nm.group(1) + "_" + nm.group(2); // "1_2" = no:1 step:2
                results.put(key, ok ? "PASS" : "FAIL");
            }
        }
        return results;
    }

    // result.md §9.1: 하나라도 FAIL/SKIP이면 전체 미통과
    @SuppressWarnings("unchecked")
    private String resolveIntegPassYn(List<Map<String, Object>> flowSteps) {
        if (flowSteps == null || flowSteps.isEmpty()) return "N";
        for (Map<String, Object> step : flowSteps) {
            String sr = step.get("stepResult") != null ? String.valueOf(step.get("stepResult")) : "SKIP";
            if (!"PASS".equals(sr)) return "N";
        }
        return "Y";
    }

    public String buildPlaywrightHtml(List<Map<String, Object>> results, String prefix) {
        int pass = 0, fail = 0;
        for (Map<String, Object> s : results) {
            String tr = str(s, "testResult");
            if ("PASS".equals(tr)) pass++; else if ("FAIL".equals(tr)) fail++;
        }
        int total = results.size();
        double passRate = total > 0 ? (pass * 100.0 / total) : 0;
        String today = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());

        StringBuilder rows = new StringBuilder();
        for (Map<String, Object> s : results) {
            String tr  = str(s, "testResult");
            String cls = "PASS".equals(tr) ? "pass" : ("FAIL".equals(tr) ? "fail" : "");
            String lbl = "PASS".equals(tr) ? "&#x2705; Pass" : ("FAIL".equals(tr) ? "&#x274C; Fail" : "-");
            rows.append("<tr class=\"").append(cls).append("-row\">")
                .append("<td class=\"center\">").append(hesc(str(s,"no"))).append("</td>")
                .append("<td>").append(hesc(str(s,"scenarioId"))).append("</td>")
                .append("<td>").append(hesc(str(s,"menuName"))).append("</td>")
                .append("<td class=\"mono\">").append(hesc(str(s,"url"))).append("</td>")
                .append("<td class=\"center\">").append(hesc(str(s,"method"))).append("</td>")
                .append("<td style=\"white-space:pre-wrap\">").append(hesc(str(s,"expectedResult"))).append("</td>")
                .append("<td class=\"center verdict ").append(cls).append("\">").append(lbl).append("</td>")
                .append("<td style=\"font-size:11px;color:#b91c1c\">").append(hesc(str(s,"remark"))).append("</td>")
                .append("</tr>\n");
        }

        return "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n<meta charset=\"UTF-8\">\n"
            + "<title>Playwright 통합 테스트 결과서 - " + hesc(prefix) + "</title>\n"
            + "<style>\n"
            + "* {box-sizing:border-box;margin:0;padding:0}\n"
            + "body{font-family:'Malgun Gothic',sans-serif;font-size:13px;background:#f5f7fa;color:#333}\n"
            + ".wrap{max-width:1400px;margin:0 auto;padding:24px}\n"
            + ".header{background:#002060;color:#fff;border-radius:8px;padding:24px 32px;margin-bottom:20px}\n"
            + ".header h1{font-size:20px;font-weight:700}\n"
            + ".stat-bar{display:flex;gap:16px;margin-bottom:20px}\n"
            + ".stat-card{flex:1;background:#fff;border-radius:8px;padding:16px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,.08)}\n"
            + ".stat-card.total{border-top:4px solid #002060}.stat-card.pass{border-top:4px solid #28a745}.stat-card.fail{border-top:4px solid #dc3545}\n"
            + ".stat-num{font-size:30px;font-weight:700}.stat-lbl{font-size:11px;color:#666}\n"
            + ".stat-card.total .stat-num{color:#002060}.stat-card.pass .stat-num{color:#28a745}.stat-card.fail .stat-num{color:#dc3545}\n"
            + ".progress-wrap{background:#fff;border-radius:8px;padding:14px 18px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.08)}\n"
            + ".progress-bar{height:14px;border-radius:7px;background:#eee;overflow:hidden;display:flex}\n"
            + ".bar-pass{background:#28a745}.bar-fail{background:#dc3545}\n"
            + ".progress-label{display:flex;justify-content:space-between;margin-top:6px;font-size:11px;color:#555}\n"
            + ".table-wrap{background:#fff;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,.08);overflow:hidden;margin-bottom:20px}\n"
            + ".section-title{background:#1F3864;color:#fff;padding:10px 16px;font-size:14px;font-weight:600}\n"
            + "table{width:100%;border-collapse:collapse}\n"
            + "thead th{background:#002060;color:#fff;padding:9px 8px;font-size:12px;text-align:center;white-space:nowrap}\n"
            + "tbody td{padding:7px 9px;border:1px solid #e0e0e0;font-size:12px;vertical-align:top}\n"
            + "tbody tr:nth-child(even){background:#fafbfc}\n"
            + ".center{text-align:center}.mono{font-family:monospace;font-size:11px}\n"
            + ".pass-row td:first-child{border-left:4px solid #28a745}.fail-row td:first-child{border-left:4px solid #dc3545}\n"
            + ".verdict{font-weight:700}.verdict.pass{color:#28a745}.verdict.fail{color:#dc3545}\n"
            + ".footer{text-align:center;font-size:11px;color:#999;padding:16px 0}\n"
            + "</style>\n</head>\n<body>\n<div class=\"wrap\">\n"
            + "<div class=\"header\"><h1>Playwright 통합 테스트 결과서 — " + hesc(prefix) + "</h1>"
            + "<div style=\"font-size:12px;opacity:.8;margin-top:6px\">&#x1F4C5; " + today + " &nbsp;|&nbsp; &#x1F4C1; 통합 테스트</div></div>\n"
            + "<div class=\"stat-bar\">"
            + "<div class=\"stat-card total\"><div class=\"stat-lbl\">총 TC수</div><div class=\"stat-num\">" + total + "</div></div>"
            + "<div class=\"stat-card pass\"><div class=\"stat-lbl\">PASS</div><div class=\"stat-num\">" + pass + "</div></div>"
            + "<div class=\"stat-card fail\"><div class=\"stat-lbl\">FAIL</div><div class=\"stat-num\">" + fail + "</div></div>"
            + "</div>\n"
            + "<div class=\"progress-wrap\"><div class=\"progress-bar\">"
            + "<div class=\"bar-pass\" style=\"width:" + String.format("%.1f", passRate) + "%\"></div>"
            + "<div class=\"bar-fail\" style=\"width:" + String.format("%.1f", 100 - passRate) + "%\"></div>"
            + "</div>"
            + "<div class=\"progress-label\"><span>&#x2705; PASS " + pass + "건 (" + String.format("%.1f", passRate) + "%)</span>"
            + "<span>&#x274C; FAIL " + fail + "건 (" + String.format("%.1f", 100 - passRate) + "%)</span></div></div>\n"
            + "<div class=\"table-wrap\">"
            + "<div class=\"section-title\">테스트 케이스 결과 목록 (총 " + total + "건)</div>"
            + "<table><thead><tr>"
            + "<th>No</th><th>시나리오ID</th><th>메뉴명</th><th>URL</th><th>Method</th>"
            + "<th style=\"width:25%\">예상결과</th><th>판정결과</th><th>비고</th>"
            + "</tr></thead><tbody>\n"
            + rows
            + "</tbody></table></div>\n"
            + "<div class=\"footer\">Generated by eGovFrame 테스트 자동화 | " + today + "</div>\n"
            + "</div></body></html>";
    }

    private void addZipEntry(ZipOutputStream zos, String name, byte[] data) throws IOException {
        ZipEntry entry = new ZipEntry(name);
        entry.setSize(data.length);
        zos.putNextEntry(entry);
        zos.write(data);
        zos.closeEntry();
    }

    private String extractSheetContent(String structured, String sheetName) {
        if (structured == null) return "";
        Pattern p = Pattern.compile(
            "===SHEET:" + Pattern.quote(sheetName) + "===\\s*([\\s\\S]*?)(?:(?====SHEET:)|$)");
        Matcher m = p.matcher(structured);
        return m.find() ? m.group(1).trim() : "";
    }

    // ── Internal utility helpers ──────────────────────────────────────────────

    /**
     * CDP 브라우저(scripts/start-browser.js)가 이미 떠 있는지 확인하고,
     * 없으면 "npm run browser:start"를 백그라운드로 실행한 뒤 준비될 때까지 잠시 대기한다.
     *
     * 이렇게 해야 [테스트] 버튼을 여러 번 눌러 각각 새 npx 프로세스로 실행해도
     * (fixtures.ts가 .auth/browser-ws.json을 통해) 같은 Chrome 창을 계속 재사용한다.
     * 이미 실행 중이면 아무것도 하지 않고 즉시 반환한다.
     */
    private void ensureBrowserStarted(PrintWriter writer, File workDir) {
        try {
            File wsFile = new File(workDir, ".auth/browser-ws.json");
            if (wsFile.exists()) {
                writer.write("event: log\ndata: [BROWSER] CDP 브라우저 실행 중 확인됨 — 재사용\n\n");
                writer.flush();
                return;
            }

            writer.write("event: log\ndata: [BROWSER] CDP 브라우저 미실행 — npm run browser:start 시작...\n\n");
            writer.flush();

            ProcessBuilder pbBrowser = new ProcessBuilder("cmd", "/c", "npm run browser:start");
            pbBrowser.directory(workDir);
            pbBrowser.redirectErrorStream(true);
            File wsLogDir = new File(workDir, "_workspace");
            wsLogDir.mkdirs();
            pbBrowser.redirectOutput(new File(wsLogDir, "browser-start.log"));

            Map<String, String> env = pbBrowser.environment();
            String userAppData = System.getenv("APPDATA");
            String userHome    = System.getProperty("user.home", "");
            String existPath   = env.containsKey("PATH") ? env.get("PATH") : env.getOrDefault("Path", "");
            StringBuilder newPath = new StringBuilder();
            for (String p : new String[]{
                    userAppData != null ? userAppData + "\\npm" : "",
                    userHome + "\\AppData\\Roaming\\npm",
                    workDir.getAbsolutePath() + "\\node_modules\\.bin",
                    "C:\\Program Files\\nodejs"}) {
                if (!p.isEmpty() && !existPath.contains(p)) newPath.append(p).append(";");
            }
            newPath.append(existPath);
            env.put("PATH", newPath.toString());

            // 종료를 기다리지 않음 — start-browser.js는 Ctrl+C 전까지 계속 떠 있는 상수 프로세스.
            pbBrowser.start();

            // browser-ws.json이 생성될 때까지 잠시 대기 (Chrome 기동 시간 확보)
            long deadline = System.currentTimeMillis() + 15000;
            while (System.currentTimeMillis() < deadline && !wsFile.exists()) {
                Thread.sleep(300);
            }

            if (wsFile.exists()) {
                writer.write("event: log\ndata: [BROWSER] 실행 완료 — 이 창을 테스트 간 재사용합니다.\n\n");
            } else {
                writer.write("event: log\ndata: [BROWSER] 실행 대기 타임아웃 — Playwright 기본 브라우저로 폴백됩니다.\n\n");
            }
            writer.flush();
        } catch (Exception e) {
            try {
                writer.write("event: log\ndata: [BROWSER] 자동 실행 실패 (" + escEvt(e.getMessage()) + ") — Playwright 기본 브라우저로 폴백됩니다.\n\n");
                writer.flush();
            } catch (Exception ignored) {}
        }
    }

    private File getSpecDir(HttpServletRequest request) {
        File webappDir = new File(request.getServletContext().getRealPath("/"));
        File misRoot   = webappDir.getParentFile().getParentFile()
                                  .getParentFile().getParentFile();
        return new File(misRoot, "tests");
    }

    private String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? String.valueOf(v) : "";
    }

    private String readFileSafe(File file) {
        try {
            byte[] bytes = java.nio.file.Files.readAllBytes(file.toPath());
            try { return new String(bytes, "UTF-8"); }
            catch (Exception e) { return new String(bytes, "EUC-KR"); }
        } catch (Exception e) { return ""; }
    }

    private void writeFileSafe(File file, String content) {
        try (PrintWriter pw = new PrintWriter(new OutputStreamWriter(
                new FileOutputStream(file), "UTF-8"))) {
            pw.print(content);
        } catch (Exception ignored) {}
    }

    private String jsonEsc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "").replace("\t", "\\t");
    }

    private String readStream(InputStream is) {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) sb.append(line).append("\n");
            return sb.toString();
        } catch (Exception e) { return ""; }
    }

    private String escEvt(String s) {
        if (s == null) return "";
        return s.replace("\n", " ").replace("\r", "").replace("|", "｜");
    }

    private String hesc(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace("\"", "&quot;").replace("'", "&#39;");
    }
}
