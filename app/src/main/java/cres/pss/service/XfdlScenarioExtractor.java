package cres.pss.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.ArrayDeque;
import java.util.Collections;
import java.util.Comparator;
import java.util.Deque;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * XFDL 소스 파일의 정적 분석을 통해 단위테스트 시나리오 메타데이터를 자동 추출한다.
 *
 * 처리 흐름:
 *   extractAll() → XfdlParserService.parseXfdl() + analyzeButtons() → buildScenarios()
 *
 * AI/LLM 호출 없이 순수 Java 정규식+파싱으로 동작한다.
 */
@Service
public class XfdlScenarioExtractor {

    @Autowired
    private XfdlParserService xfdlParser;

    @Autowired
    private MenuResolverService menuSvc;

    // ── 버튼 분석 결과 DTO ────────────────────────────────────────────────────

    public static class ButtonAnalysis {
        public List<Map<String, String>>             buttons       = new ArrayList<>(); // [{id, onclickFn, label}]
        public Map<String, String>                   fnBodies      = new LinkedHashMap<>(); // onclickFn → 함수 본문 (1회 파싱 캐시)
        public Map<String, Map<String, String>>      svcIdToBtnMap = new LinkedHashMap<>(); // svcId → {btnId, btnText}
        public Map<String, List<String>>             dsColumnMap   = new LinkedHashMap<>(); // dsId → [컬럼ID 목록] (Phase 5)
        public List<String>                          enabledCtrls  = new ArrayList<>(); // fn_compCtrl set_enable 대상
        public Map<String, String>                   staticLabels  = new LinkedHashMap<>(); // 컴포넌트ID → 레이블 text
        public Map<String, List<String>>             callbackMap   = new LinkedHashMap<>(); // svcId → [패턴 목록]
        public Map<String, List<String>>             gridHeaders   = new LinkedHashMap<>(); // gridId → [헤더 text[]]
        public Set<String>                           hasValidChkSvcIds = new LinkedHashSet<>(); // fn_validChk 가 있는 svcId
        public Map<String, String>                   searchInputLabels = new LinkedHashMap<>(); // div_search 내 componentId → label (순서: 위→아래, 좌→우)
        public Map<String, String>                   searchBindMap     = new LinkedHashMap<>(); // div_search BindItem: componentId → datasetColumnId
        // 비-tranCall 버튼 분류
        public List<Map<String, String>> popupButtons   = new ArrayList<>(); // gfn_openPopup 호출 버튼
        public List<String>              rowAddBtnIds   = new ArrayList<>(); // 행추가 버튼
        public List<String>              rowDelBtnIds   = new ArrayList<>(); // 행삭제 버튼
        public List<String>              excelBtnIds    = new ArrayList<>(); // 엑셀 다운로드 버튼
        public List<String>              approvalBtnIds = new ArrayList<>(); // 결재상신 버튼
        /** gfn_chkRight 호출 결과로 set_enable/set_visible 등 UI를 제어하면 true */
        public boolean hasChkrightUiControl = false;
    }

    // ── 공개 API ──────────────────────────────────────────────────────────────

    /**
     * XFDL 소스에서 버튼 관련 정보를 분석한다. (시나리오 조립과 분리)
     */
    public ButtonAnalysis analyzeButtons(String content) {
        ButtonAnalysis result = new ButtonAnalysis();
        result.buttons       = parseButtons(content);
        result.fnBodies      = buildFnBodies(content, result.buttons);
        result.svcIdToBtnMap = buildSvcIdToBtnMap(result.buttons, result.fnBodies);
        result.dsColumnMap   = parseDsColumnMap(content);
        result.enabledCtrls       = parseEnabledCtrls(content);
        result.staticLabels       = parseStaticLabels(content);
        result.searchInputLabels  = parseSearchInputLabels(content);
        result.searchBindMap      = parseSearchBindMap(content);
        result.callbackMap        = parseCallbackMap(content);
        result.gridHeaders   = parseGridHeaders(content);
        markValidChkSvcIds(result);
        categorizeNonTranButtons(result);
        result.hasChkrightUiControl = detectChkrightUiControl(content);
        return result;
    }

    /**
     * XfdlInfo + ButtonAnalysis를 받아 시나리오 Map 목록을 조립한다.
     *
     * @param startNo  시작 순번
     * @param info     parseXfdl() 반환값
     * @param analysis analyzeButtons() 반환값
     * @param origin   "mis" 또는 "pms"
     */
    public List<Map<String, Object>> buildScenarios(int startNo,
                                                     XfdlParserService.XfdlInfo info,
                                                     ButtonAnalysis analysis,
                                                     String origin) {
        List<Map<String, Object>> result = new ArrayList<>();

        Map<String, String> menu = menuSvc.resolveMenu(info.screenName);
        List<String> enabledLabels = resolveEnabledLabels(
                analysis.enabledCtrls, analysis.staticLabels, analysis.gridHeaders);

        String screenTitle = (info.screenTitle != null && !info.screenTitle.isEmpty())
                ? info.screenTitle : info.screenName;

        int no = startNo;

        // tranCall 기반 시나리오
        if (info.tranCalls != null) {
            for (XfdlParserService.TranCall tran : info.tranCalls) {
                if (tran.url == null || tran.url.isEmpty()) continue;

                String crudType   = inferCrudType(tran.svcId);
                String inputCols  = extractInputCols(tran.inputDs, analysis.dsColumnMap, info.dsColumns);
                List<String> cbPats = analysis.callbackMap.getOrDefault(
                        tran.svcId, Collections.emptyList());

                String btnId = findButtonBySvcId(tran.svcId, analysis.buttons);

                // btn_save: fn_validChk 존재 시 유효성 검사 시나리오 추가
                if (("btn_save".equals(btnId) || looksLikeSaveBtn(tran.svcId))
                        && analysis.hasValidChkSvcIds.contains(tran.svcId)) {
                    result.add(buildOne(no++, info, tran, analysis, menu,
                            origin, "유효성검사", crudType, inputCols, cbPats, enabledLabels));
                }

                result.add(buildOne(no++, info, tran, analysis, menu,
                        origin, null, crudType, inputCols, cbPats, enabledLabels));
            }
        }

        // 비-tranCall 버튼 시나리오 (행추가/행삭제/팝업/엑셀/결재)
        for (String btnId : analysis.rowAddBtnIds) {
            result.add(buildNonTranScenario(no++, info, menu, origin,
                    screenTitle + " - 행추가 버튼 클릭 > 그리드 행 추가",
                    "그리드가 화면에 표시된 상태여야 함",
                    "그리드에 빈 행이 추가됨", "단위"));
        }
        for (String btnId : analysis.rowDelBtnIds) {
            result.add(buildNonTranScenario(no++, info, menu, origin,
                    screenTitle + " - 행삭제 버튼 클릭 > 그리드 행 삭제",
                    "삭제할 행이 그리드에서 선택된 상태여야 함",
                    "선택된 행이 그리드에서 제거됨", "단위"));
        }
        for (Map<String, String> btn : analysis.popupButtons) {
            String label = btn.getOrDefault("label", btn.getOrDefault("id", "팝업"));
            if (label.isEmpty()) label = btn.getOrDefault("id", "팝업");
            result.add(buildNonTranScenario(no++, info, menu, origin,
                    screenTitle + " - " + label + " 버튼 클릭 > 팝업 창 열림 확인",
                    "화면이 정상 로드된 상태여야 함",
                    "팝업 창이 열림", "단위"));
        }
        for (String btnId : analysis.excelBtnIds) {
            result.add(buildNonTranScenario(no++, info, menu, origin,
                    screenTitle + " - 엑셀 다운로드 실행",
                    "조회된 데이터가 그리드에 표시된 상태여야 함",
                    "브라우저에 Excel 파일 다운로드가 시작됨", "단위"));
        }
        for (String btnId : analysis.approvalBtnIds) {
            result.add(buildNonTranScenario(no++, info, menu, origin,
                    screenTitle + " - 결재상신 버튼 클릭 > 결재상신 실행",
                    "저장된 문서가 존재하고 결재 가능 상태(미상신)여야 함",
                    buildApprovalExpectedResult(), "통합"));
        }

        return result;
    }

    /**
     * 지정 디렉토리의 XFDL 파일 전체를 분석하여 단위 테스트 시나리오 목록을 반환한다.
     *
     * @param dirOriginMap  디렉토리 → origin 매핑
     * @param listener      진행률 콜백 (SSE 전송용) — (현재파일수, 전체파일수)
     */
    public List<Map<String, Object>> extractAll(Map<File, String> dirOriginMap,
                                                 BiConsumer<Integer, Integer> listener) {
        return extractAll(dirOriginMap, listener, null);
    }

    /**
     * @param errorCallback 파일 파싱 오류 시 호출되는 콜백 (SSE 에러 라인 전송용, null 허용)
     */
    public List<Map<String, Object>> extractAll(Map<File, String> dirOriginMap,
                                                 BiConsumer<Integer, Integer> listener,
                                                 Consumer<String> errorCallback) {
        return extractAll(dirOriginMap, Collections.<String>emptySet(), listener, errorCallback);
    }

    /**
     * @param allowedSources 처리할 파일명 Set (소문자, 확장자 제외). 비어있으면 필터 없음.
     */
    public List<Map<String, Object>> extractAll(Map<File, String> dirOriginMap,
                                                 Set<String> allowedSources,
                                                 BiConsumer<Integer, Integer> listener,
                                                 Consumer<String> errorCallback) {
        List<Map.Entry<File, String>> fileEntries = new ArrayList<>();
        for (Map.Entry<File, String> entry : dirOriginMap.entrySet()) {
            File dir = entry.getKey();
            if (!dir.exists() || !dir.isDirectory()) continue;
            List<File> xfdlFiles = new ArrayList<>();
            FilePathHelper.addXfdlFiles(dir, xfdlFiles);
            for (File f : xfdlFiles) {
                if (allowedSources != null && !allowedSources.isEmpty()) {
                    String baseName = f.getName().replaceAll("\\.[^.]+$", "").toLowerCase();
                    if (!allowedSources.contains(baseName)) continue;
                }
                fileEntries.add(new java.util.AbstractMap.SimpleEntry<>(f, entry.getValue()));
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        int total = fileEntries.size();
        int no = 1;

        for (int i = 0; i < total; i++) {
            File xfdlFile = fileEntries.get(i).getKey();
            String origin = fileEntries.get(i).getValue();
            String fileContent = readFile(xfdlFile);

            try {
                System.out.println("[DEBUG-EXTRACTOR] 파일 파싱 시작: " + xfdlFile.getName());
                XfdlParserService.XfdlInfo info = xfdlParser.parseXfdl(fileContent);
                System.out.println("[DEBUG-EXTRACTOR] parseXfdl 완료: screenName=" + info.screenName + ", screenTitle=" + info.screenTitle + ", tranCalls=" + info.tranCalls.size());
                ButtonAnalysis analysis          = analyzeButtons(fileContent);
                System.out.println("[DEBUG-EXTRACTOR] analyzeButtons 완료: buttons=" + (analysis != null ? analysis.toString() : "null"));

                // screenName 이 비어 있으면 파일명 사용
                if (info.screenName == null || info.screenName.isEmpty()) {
                    String fname = xfdlFile.getName();
                    info.screenName = fname.replaceAll("(?i)\\.xfdl(\\.js)?$", "");
                    System.out.println("[DEBUG-EXTRACTOR] screenName 파일명 대체: " + info.screenName);
                }

                List<Map<String, Object>> scenarios = buildScenarios(no, info, analysis, origin);
                System.out.println("[DEBUG-EXTRACTOR] buildScenarios 완료: origin=" + origin + ", scenarios.size()=" + scenarios.size());
                no += scenarios.size();
                result.addAll(scenarios);
            } catch (Exception e) {
                String errMsg = xfdlFile.getName() + ": " + e.getMessage();
                System.out.println("[XfdlScenarioExtractor] 파싱 오류: " + errMsg);
                if (errorCallback != null) errorCallback.accept(errMsg);
            }

            if (listener != null) listener.accept(i + 1, total);
        }
        return deduplicateByUrl(result);
    }

    // ── 통합 시나리오 추출 (결재 버튼 화면만) ────────────────────────────────────

    public List<Map<String, Object>> extractIntegAll(Map<File, String> dirOriginMap,
                                                      BiConsumer<Integer, Integer> listener) {
        return extractIntegAll(dirOriginMap, listener, null);
    }

    public List<Map<String, Object>> extractIntegAll(Map<File, String> dirOriginMap,
                                                      BiConsumer<Integer, Integer> listener,
                                                      Consumer<String> errorCallback) {
        return extractIntegAll(dirOriginMap, Collections.<String>emptySet(), listener, errorCallback);
    }

    public List<Map<String, Object>> extractIntegAll(Map<File, String> dirOriginMap,
                                                      Set<String> allowedSources,
                                                      BiConsumer<Integer, Integer> listener,
                                                      Consumer<String> errorCallback) {
        List<Map.Entry<File, String>> fileEntries = new ArrayList<>();
        for (Map.Entry<File, String> entry : dirOriginMap.entrySet()) {
            File dir = entry.getKey();
            if (!dir.exists() || !dir.isDirectory()) continue;
            List<File> xfdlFiles = new ArrayList<>();
            FilePathHelper.addXfdlFiles(dir, xfdlFiles);
            for (File f : xfdlFiles) {
                if (allowedSources != null && !allowedSources.isEmpty()) {
                    String baseName = f.getName().replaceAll("\\.[^.]+$", "").toLowerCase();
                    if (!allowedSources.contains(baseName)) continue;
                }
                fileEntries.add(new AbstractMap.SimpleEntry<>(f, entry.getValue()));
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        int total = fileEntries.size();
        int no = 1;

        for (int i = 0; i < total; i++) {
            File xfdlFile = fileEntries.get(i).getKey();
            String origin = fileEntries.get(i).getValue();
            String fileContent = readFile(xfdlFile);

            try {
                XfdlParserService.XfdlInfo info = xfdlParser.parseXfdl(fileContent);
                ButtonAnalysis analysis          = analyzeButtons(fileContent);

                boolean hasApproval    = !analysis.approvalBtnIds.isEmpty();
                boolean hasApprovalReq = hasButtonWithLabel(analysis.buttons, "승인요청");
                boolean hasRegister    = hasButtonWithLabel(analysis.buttons, "등록")
                                         || hasInsertTranCall(info.tranCalls);

                if (!hasApproval && !hasApprovalReq && !hasRegister) {
                    if (listener != null) listener.accept(i + 1, total);
                    continue;
                }

                if (info.screenName == null || info.screenName.isEmpty()) {
                    String fname = xfdlFile.getName();
                    info.screenName = fname.replaceAll("(?i)\\.xfdl(\\.js)?$", "");
                }

                Map<String, String> menu = menuSvc.resolveMenu(info.screenName);
                String screenTitle = (info.screenTitle != null && !info.screenTitle.isEmpty())
                        ? info.screenTitle : info.screenName;

                if (hasApproval) {
                    result.add(buildNonTranScenario(no++, info, menu, origin,
                            screenTitle + " - 저장 후 결재상신 (통합 테스트)",
                            "화면이 정상 로드되고 입력 데이터가 준비된 상태여야 함",
                            buildApprovalExpectedResult(), "통합"));
                }
                if (hasApprovalReq) {
                    result.add(buildNonTranScenario(no++, info, menu, origin,
                            screenTitle + " - 승인요청 플로우 (통합 테스트)",
                            "화면이 정상 로드되고 승인 가능한 상태여야 함",
                            "승인요청이 정상 처리되고 결재 대기 상태로 변경됨", "통합"));
                }
                if (hasRegister) {
                    result.add(buildNonTranScenario(no++, info, menu, origin,
                            screenTitle + " - 데이터 등록 플로우 (통합 테스트)",
                            "입력 필수 항목의 값이 유효해야 함",
                            "데이터가 정상 등록되고 목록에서 확인 가능", "통합"));
                }
            } catch (Exception e) {
                String errMsg = xfdlFile.getName() + ": " + e.getMessage();
                System.out.println("[XfdlScenarioExtractor] 통합 파싱 오류: " + errMsg);
                if (errorCallback != null) errorCallback.accept(errMsg);
            }

            if (listener != null) listener.accept(i + 1, total);
        }
        return result;
    }

    private boolean hasButtonWithLabel(List<Map<String, String>> buttons, String labelKeyword) {
        for (Map<String, String> btn : buttons) {
            String label = btn.getOrDefault("label", "");
            if (label.contains(labelKeyword)) return true;
        }
        return false;
    }

    private boolean hasInsertTranCall(List<XfdlParserService.TranCall> tranCalls) {
        if (tranCalls == null) return false;
        for (XfdlParserService.TranCall tc : tranCalls) {
            String svcId = tc.svcId;
            if (svcId == null) continue;
            String lower = svcId.toLowerCase();
            if (lower.startsWith("insert") || lower.startsWith("reg")
                    || lower.startsWith("create")) return true;
        }
        return false;
    }

    // ── 시나리오 단건 조립 ─────────────────────────────────────────────────────

    private Map<String, Object> buildOne(int no,
                                          XfdlParserService.XfdlInfo info,
                                          XfdlParserService.TranCall tran,
                                          ButtonAnalysis analysis,
                                          Map<String, String> menu,
                                          String origin,
                                          String actionType,
                                          String crudType,
                                          String inputCols,
                                          List<String> cbPatterns,
                                          List<String> enabledLabels) {
        Map<String, Object> s = new LinkedHashMap<>();

        String btnId     = findButtonBySvcId(tran.svcId, analysis.buttons);
        String screenTitle = (info.screenTitle != null && !info.screenTitle.isEmpty())
                ? info.screenTitle : info.screenName;

        s.put("no",          no);
        s.put("testType",    "단위");
        s.put("sourceName",  info.screenName);
        s.put("screenName",  info.screenName);
        // scenarioId: SpecTemplateService가 UT_ prefix로 testType을 결정하므로 UT_ 사용
        s.put("scenarioId",  "UT_" + info.screenName.toUpperCase());
        s.put("화면명",       screenTitle);
        s.put("crudType",    crudType);
        s.put("URL",         tran.url);
        s.put("serviceId",   tran.svcId != null ? tran.svcId : "");
        s.put("method",      "POST");
        s.put("inputDsId",   tran.inputDs  != null ? tran.inputDs  : "");
        s.put("outputDsId",  tran.outputDs != null ? tran.outputDs : "");
        s.put("inputCols",   inputCols);
        s.put("inputValues", buildInputValues(inputCols, crudType, analysis.searchInputLabels, analysis.searchBindMap));
        s.put("origin",      origin);

        String testName     = buildTestName(screenTitle, btnId, actionType, tran.svcId,
                analysis.searchInputLabels);
        String preCondition = buildPreCondition(btnId, enabledLabels, crudType, inputCols);
        String expected     = buildExpectedResult(tran.svcId, cbPatterns, crudType,
                tran.outputDs, screenTitle, actionType,
                btnId, analysis.searchInputLabels);

        s.put("사전조건",       preCondition);
        s.put("expectedResult", expected);

        String menuPath = menu.getOrDefault("menuPath", "");
        String[] mNodes = menuPath.isEmpty() ? new String[0] : menuPath.split("\\s*>\\s*");
        s.put("menuPath",    menuPath);
        String _gnb1 = mNodes.length >= 1 ? mNodes[0].trim() : "";
        String _menuNm1 = mNodes.length >= 1 ? mNodes[mNodes.length - 1].trim() : "";
        if (_menuNm1.isEmpty()) _menuNm1 = screenTitle;
        s.put("gnbName",     _gnb1);
        s.put("menuName",    _menuNm1);
        s.put("groupName",   mNodes.length >= 4 ? mNodes[1].trim() : (mNodes.length == 3 ? mNodes[0].trim() : ""));
        s.put("subCategory", mNodes.length >= 4 ? mNodes[mNodes.length - 2].trim() : (mNodes.length == 3 ? mNodes[1].trim() : ""));
        // 테스트명 = 메뉴명 - 버튼명, description = 기존 상세 테스트명
        String _btnTxt1 = resolveBtnText(btnId, tran.svcId);
        s.put("테스트명",    _menuNm1 + " - " + _btnTxt1);
        s.put("description", testName);
        s.put("actor",             "개발자");
        s.put("roleNm",            "개발자");   // 액터 표기 — 그리드/스펙/리포트가 roleNm 사용 (DB 역할 있으면 enrichRoles가 덮어씀)
        s.put("xfdlHasChkright",   analysis.hasChkrightUiControl);

        // result.md §3.2 — 통과여부 초기값 null (테스트 전 미실행 상태)
        s.put("DEV_PASS",  null);
        s.put("PL_PASS",   null);
        s.put("USER_PASS", null);
        s.put("REMARK",    "");

        return s;
    }

    // ── gfn_chkRight UI 제어 감지 ─────────────────────────────────────────────

    /**
     * XFDL 내용에서 gfn_chkRight 결과가 UI 또는 동작 제어에 사용되는지 감지한다.
     *
     * 감지 패턴:
     *  (1) 직접 if 블록: if (gfn_chkRight(...) == "Y") { 비어있지않은본문 }
     *      - hrm_0110M 처럼 if 블록이 비어있으면 false (역할 무관 동작)
     *  (2) 삼항 연산자: gfn_chkRight(...) == "Y" ? ... : ...
     *      - CSS 스타일 분기(fn_setEditCssAll), 값 분기 등
     *  (3) 변수 할당 후 사용: var X = gfn_chkRight(...); if (X == "Y") { 비어있지않은본문 }
     *      또는 변수 삼항: X == "Y" ? ...
     */
    private boolean detectChkrightUiControl(String content) {
        if (!content.contains("gfn_chkRight")) return false;

        // Pattern 1: gfn_chkRight(...) == "Y" { 비어있지않은 if 블록 }
        Pattern direct = Pattern.compile(
            "gfn_chkRight\\s*\\([^)]*\\)\\s*==\\s*\"Y\"[^{]*\\{([^}]{1,2000}?)\\}",
            Pattern.DOTALL);
        Matcher dm = direct.matcher(content);
        while (dm.find()) {
            if (!dm.group(1).trim().isEmpty()) return true;
        }

        // Pattern 2: 삼항 연산자 — gfn_chkRight(...) == "Y" ? ...
        Pattern ternary = Pattern.compile("gfn_chkRight\\s*\\([^)]*\\)\\s*==\\s*\"Y\"\\s*\\?");
        if (ternary.matcher(content).find()) return true;

        // Pattern 3: var X = gfn_chkRight(...) → if (X == "Y") {...} 또는 X == "Y" ? ...
        Pattern assign = Pattern.compile("var\\s+(\\w+)\\s*=\\s*(?:this\\.)?gfn_chkRight");
        Matcher am = assign.matcher(content);
        while (am.find()) {
            String varName = Pattern.quote(am.group(1));
            // 3a. if 블록
            Pattern ifUse = Pattern.compile(
                "if\\s*\\(\\s*" + varName + "\\s*==\\s*\"Y\"[^{]*\\{([^}]{1,2000}?)\\}",
                Pattern.DOTALL);
            Matcher um = ifUse.matcher(content);
            if (um.find() && !um.group(1).trim().isEmpty()) return true;
            // 3b. 삼항
            Pattern ternUse = Pattern.compile(varName + "\\s*==\\s*\"Y\"\\s*\\?");
            if (ternUse.matcher(content).find()) return true;
        }

        return false;
    }

    // ── 결재버튼 기대결과 캐시 ────────────────────────────────────────────────

    private String approvalExpectedResult = null;

    private String buildApprovalExpectedResult() {
        if (approvalExpectedResult != null) return approvalExpectedResult;
        String relPath = "src/main/java/cres/common/inf/service/impl/ApprovalServiceImpl.java";
        String[] bases = {
            "",
            System.getProperty("user.dir", "")
        };
        List<String> codes = new ArrayList<>();
        for (String base : bases) {
            try {
                java.nio.file.Path fullPath = base.isEmpty()
                        ? java.nio.file.Paths.get(relPath)
                        : java.nio.file.Paths.get(base, relPath);
                if (!java.nio.file.Files.exists(fullPath)) continue;
                String src = new String(java.nio.file.Files.readAllBytes(fullPath));
                Matcher m = Pattern.compile("(\\d{3}-\\d{3}-\\d{3})").matcher(src);
                while (m.find()) {
                    String code = m.group(1);
                    if (!codes.contains(code)) codes.add(code);
                }
                break;
            } catch (Exception ignored) {}
        }
        approvalExpectedResult = codes.isEmpty()
            ? "기안기가 호출됨"
            : "기안기가 호출됨; 후처리 로직 실행 (" + String.join(", ", codes) + ")";
        return approvalExpectedResult;
    }

    // ── fnBodies / svcIdToBtnMap 구축 ─────────────────────────────────────────

    private Map<String, String> buildFnBodies(String content, List<Map<String, String>> buttons) {
        Map<String, String> map = new LinkedHashMap<>();
        for (Map<String, String> btn : buttons) {
            String fn = btn.get("onclickFn");
            if (fn != null && !fn.isEmpty()) map.put(fn, parseEventFn(content, fn));
        }
        return map;
    }

    private Map<String, Map<String, String>> buildSvcIdToBtnMap(
            List<Map<String, String>> buttons, Map<String, String> fnBodies) {
        Map<String, Map<String, String>> map = new LinkedHashMap<>();
        Pattern tranPat = Pattern.compile("gfn_tran\\s*\\(\\s*\"([^\"]+)\"");
        for (Map<String, String> btn : buttons) {
            String body = fnBodies.getOrDefault(btn.get("onclickFn"), "");
            Matcher m = tranPat.matcher(body);
            while (m.find()) {
                String svcId = m.group(1);
                if (!map.containsKey(svcId)) {
                    Map<String, String> info = new LinkedHashMap<>();
                    info.put("btnId",   btn.get("id"));
                    info.put("btnText", btn.get("label"));
                    map.put(svcId, info);
                }
            }
        }
        return map;
    }

    // ── 버튼 파싱 ─────────────────────────────────────────────────────────────

    /**
     * Button 컴포넌트의 id, onclick 함수명, text(레이블)을 추출한다.
     * XFDL은 XML 속성 순서가 자유롭기 때문에 각 속성을 별도 패턴으로 추출한다.
     */
    private List<Map<String, String>> parseButtons(String content) {
        List<Map<String, String>> list = new ArrayList<>();
        // Button 태그 전체 매칭 (단일 태그 또는 여는 태그)
        Pattern btnTag = Pattern.compile(
                "<Button\\s([^>]*?)(?:/>|>)", Pattern.DOTALL);
        Pattern idPat  = Pattern.compile("\\bid=\"([^\"]+)\"");
        Pattern onclickPat = Pattern.compile("\\bonclick=\"([^\"]+)\"");
        Pattern textPat    = Pattern.compile("\\btext=\"([^\"]+)\"");

        Matcher m = btnTag.matcher(content);
        while (m.find()) {
            String attrs = m.group(1);
            Matcher idM  = idPat.matcher(attrs);
            Matcher ocM  = onclickPat.matcher(attrs);
            if (!idM.find()) continue;

            String id  = idM.group(1);
            String onclick = ocM.find() ? ocM.group(1) : "";
            Matcher txtM = textPat.matcher(attrs);
            String label = txtM.find() ? txtM.group(1) : "";

            Map<String, String> btn = new LinkedHashMap<>();
            btn.put("id", id);
            btn.put("onclickFn", onclick);
            btn.put("label", label);
            list.add(btn);
        }
        return list;
    }

    /**
     * 이벤트 함수 본문을 괄호 카운팅 방식으로 추출한다.
     */
    private String parseEventFn(String content, String fnName) {
        String[] lines = content.split("\n");
        int depth = 0;
        boolean started = false;
        StringBuilder body = new StringBuilder();

        for (String line : lines) {
            if (!started) {
                // "this.{fnName} = function" 또는 "function {fnName}"
                if ((line.contains("this." + fnName) && line.contains("function"))
                        || (line.contains("function " + fnName)
                            && line.contains("function " + fnName + "("))) {
                    started = true;
                }
            }
            if (started) {
                body.append(line).append("\n");
                for (char c : line.toCharArray()) {
                    if (c == '{') depth++;
                    else if (c == '}') depth--;
                }
                if (depth == 0 && body.length() > fnName.length()) break;
            }
        }
        return body.toString();
    }

    /**
     * fn_compCtrl 함수에서 set_enable 대상 컴포넌트 ID를 추출한다.
     * 대문자로 시작하는 컴포넌트만 추출 (버튼 제외).
     */
    private List<String> parseEnabledCtrls(String content) {
        List<String> list = new ArrayList<>();
        String fnBody = parseEventFn(content, "fn_compCtrl");
        if (fnBody.isEmpty()) return list;

        Pattern p = Pattern.compile("this\\.([A-Z][A-Z0-9_]+)\\.set_enable\\(");
        Matcher m = p.matcher(fnBody);
        Set<String> seen = new LinkedHashSet<>();
        while (m.find()) {
            String id = m.group(1);
            if (!id.startsWith("BTN") && !id.startsWith("btn") && seen.add(id)) {
                list.add(id);
            }
        }
        return list;
    }

    /**
     * Static 컴포넌트의 text와 좌표를 추출하여 {컴포넌트ID → x, y, text} 맵을 만들고,
     * fn_compCtrl 활성화 컴포넌트의 좌측 Static text를 레이블로 매핑한다.
     *
     * 반환: { 입력컴포넌트ID → 레이블 text }
     */
    private Map<String, String> parseStaticLabels(String content) {
        Map<String, String> result = new LinkedHashMap<>();

        // Static 컴포넌트 파싱: id, x, y, text
        Pattern staticPat = Pattern.compile(
                "<Static\\s([^>]*?)(?:/>|>)", Pattern.DOTALL);
        Pattern idPat   = Pattern.compile("\\bid=\"([^\"]+)\"");
        Pattern xPat    = Pattern.compile("\\bx=\"(\\d+)\"");
        Pattern yPat    = Pattern.compile("\\by=\"(\\d+)\"");
        Pattern textPat = Pattern.compile("\\btext=\"([^\"]+)\"");

        // 입력 컴포넌트 파싱: id, x, y
        Pattern inputPat = Pattern.compile(
                "<(?:Edit|TextEdit|ComboBox|MaskEdit)\\s([^>]*?)(?:/>|>)", Pattern.DOTALL);

        // 1단계: Static 목록 수집
        List<int[]>    staticXY   = new ArrayList<>(); // [x, y, textIdx]
        List<String>   staticTexts = new ArrayList<>();

        Matcher sm = staticPat.matcher(content);
        while (sm.find()) {
            String attrs = sm.group(1);
            Matcher xm = xPat.matcher(attrs);
            Matcher ym = yPat.matcher(attrs);
            Matcher tm = textPat.matcher(attrs);
            if (xm.find() && ym.find() && tm.find()) {
                int x = Integer.parseInt(xm.group(1));
                int y = Integer.parseInt(ym.group(1));
                String text = tm.group(1).trim();
                if (!text.isEmpty()) {
                    staticXY.add(new int[]{x, y, staticTexts.size()});
                    staticTexts.add(text);
                }
            }
        }

        // 2단계: 입력 컴포넌트 → 좌측 Static 매핑
        Matcher im = inputPat.matcher(content);
        while (im.find()) {
            String attrs = im.group(1);
            Matcher idM = idPat.matcher(attrs);
            Matcher xm  = xPat.matcher(attrs);
            Matcher ym  = yPat.matcher(attrs);
            if (!idM.find() || !xm.find() || !ym.find()) continue;

            String id  = idM.group(1);
            int cx = Integer.parseInt(xm.group(1));
            int cy = Integer.parseInt(ym.group(1));

            // 같은 y ±5px 범위, x가 작은(좌측) Static 중 가장 가까운 것
            int   bestDist = Integer.MAX_VALUE;
            String bestText = null;
            for (int[] s : staticXY) {
                int sx = s[0], sy = s[1], tidx = s[2];
                if (Math.abs(sy - cy) > 5) continue;
                if (sx >= cx) continue;      // 우측 Static 무시
                int dist = cx - sx;
                if (dist < bestDist) {
                    bestDist = dist;
                    bestText = staticTexts.get(tidx);
                }
            }
            if (bestText != null) result.put(id, bestText);
        }
        return result;
    }

    /**
     * id에 "search"가 포함된 &lt;Div&gt; 블록의 내용을 추출한다.
     * 중첩 Div를 깊이 카운팅으로 처리한다.
     */
    private String parseSearchDivContent(String content) {
        Pattern divStartPat = Pattern.compile(
                "<Div\\b([^>]*?)>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
        Pattern idPat = Pattern.compile("\\bid=\"([^\"]+)\"", Pattern.CASE_INSENSITIVE);

        Matcher m = divStartPat.matcher(content);
        while (m.find()) {
            String attrs = m.group(1);
            Matcher idM = idPat.matcher(attrs);
            if (!idM.find()) continue;
            if (!idM.group(1).toLowerCase().contains("search")) continue;

            // div_search 블록 내용 추출 — 중첩 Div 깊이 카운팅
            int startPos = m.end();
            int depth = 1;
            int pos   = startPos;
            while (pos < content.length() && depth > 0) {
                int nextOpen  = content.toLowerCase().indexOf("<div",  pos);
                int nextClose = content.toLowerCase().indexOf("</div>", pos);
                if (nextClose < 0) break;
                if (nextOpen >= 0 && nextOpen < nextClose) {
                    depth++;
                    pos = nextOpen + 4;
                } else {
                    depth--;
                    if (depth == 0) return content.substring(startPos, nextClose);
                    pos = nextClose + 6;
                }
            }
        }
        return "";
    }

    /**
     * div_search 내 입력 컴포넌트 → 좌측 Static 레이블 매핑을 반환한다.
     * 반환 순서: 위→아래, 좌→우 (y 오름차순, 같은 y면 x 오름차순).
     */
    private Map<String, String> parseSearchInputLabels(String content) {
        String divContent = parseSearchDivContent(content);
        if (divContent.isEmpty()) return new LinkedHashMap<>();

        Pattern staticPat = Pattern.compile(
                "<Static\\s([^>]*?)(?:/>|>)", Pattern.DOTALL);
        Pattern inputPat  = Pattern.compile(
                "<(Edit|TextEdit|Combo|ComboBox|MaskEdit|Calendar)\\s([^>]*?)(?:/>|>)", Pattern.DOTALL);
        Pattern idPat   = Pattern.compile("\\bid=\"([^\"]+)\"");
        Pattern xPat    = Pattern.compile("\\bleft=\"(\\d+)\"");
        Pattern yPat    = Pattern.compile("\\btop=\"(\\d+)\"");
        Pattern textPat = Pattern.compile("\\btext=\"([^\"]+)\"");

        // 1단계: div 내 Static 목록 수집
        List<int[]>  staticXY    = new ArrayList<>();
        List<String> staticTexts = new ArrayList<>();

        Matcher sm = staticPat.matcher(divContent);
        while (sm.find()) {
            String attrs = sm.group(1);
            Matcher xm = xPat.matcher(attrs);
            Matcher ym = yPat.matcher(attrs);
            Matcher tm = textPat.matcher(attrs);
            if (xm.find() && ym.find() && tm.find()) {
                String text = tm.group(1).trim();
                if (!text.isEmpty()) {
                    staticXY.add(new int[]{Integer.parseInt(xm.group(1)),
                                           Integer.parseInt(ym.group(1)),
                                           staticTexts.size()});
                    staticTexts.add(text);
                }
            }
        }

        // 2단계: div 내 입력 컴포넌트 → 좌측 Static 매핑 (위→아래, 좌→우 정렬)
        List<int[]>    inputPos     = new ArrayList<>(); // [x, y, entryIdx]
        List<String[]> inputEntries = new ArrayList<>(); // [id, tagType, label]

        Matcher im = inputPat.matcher(divContent);
        while (im.find()) {
            String tagType = im.group(1); // Edit | Combo | Calendar ...
            String attrs   = im.group(2);
            Matcher idM = idPat.matcher(attrs);
            Matcher xm  = xPat.matcher(attrs);
            Matcher ym  = yPat.matcher(attrs);
            if (!idM.find() || !xm.find() || !ym.find()) continue;

            String id = idM.group(1);
            int cx = Integer.parseInt(xm.group(1));
            int cy = Integer.parseInt(ym.group(1));

            int    bestDist = Integer.MAX_VALUE;
            String bestText = null;
            for (int[] s : staticXY) {
                if (Math.abs(s[1] - cy) > 5) continue;
                if (s[0] >= cx) continue;
                int dist = cx - s[0];
                if (dist < bestDist) { bestDist = dist; bestText = staticTexts.get(s[2]); }
            }
            if (bestText != null) {
                inputPos.add(new int[]{cx, cy, inputEntries.size()});
                inputEntries.add(new String[]{id, tagType, bestText});
            }
        }

        // 3단계: 레이블 보정 규칙 후처리
        // 규칙1: 구분자("~", "-", "to" 등) 레이블을 가진 컴포넌트는 같은 행에서 더 왼쪽에 있는
        //        실제 레이블 Static을 재탐색한다.
        //        예) SCH_RQST_EDT(Calendar, left=212)의 nearest Static이 "~"(left=194)인 경우,
        //            left=20의 "신청일자"를 대신 사용.
        Set<String> separatorTexts = new java.util.HashSet<>(
                java.util.Arrays.asList("~", "-", "to", ":", "∼", "〜", "ㅡ"));
        for (int k = 0; k < inputEntries.size(); k++) {
            String[] e = inputEntries.get(k);
            if (!separatorTexts.contains(e[2])) continue;

            int[] pos = inputPos.get(k);
            int cx = pos[0], cy = pos[1];

            // 구분자보다 더 왼쪽에 있는 같은 top의 non-separator Static 재탐색
            int    bestDist = Integer.MAX_VALUE;
            String bestText = null;
            for (int[] s : staticXY) {
                if (Math.abs(s[1] - cy) > 5) continue;
                if (s[0] >= cx) continue;
                String txt = staticTexts.get(s[2]);
                if (separatorTexts.contains(txt)) continue; // 구분자 자체도 제외
                int dist = cx - s[0];
                if (dist < bestDist) { bestDist = dist; bestText = txt; }
            }
            if (bestText != null) e[2] = bestText;
        }

        // 규칙2: Edit계열이 같은 top의 Combo와 동일 레이블 공유 → 레이블+"어"
        //        (검색조건 Combo + 검색어 Edit 패턴)
        Map<String, Boolean> comboAtTopLabel = new LinkedHashMap<>();
        for (int[] pos : inputPos) {
            String[] e = inputEntries.get(pos[2]);
            if ("Combo".equals(e[1]) || "ComboBox".equals(e[1])) {
                comboAtTopLabel.put(pos[1] + "|" + e[2], Boolean.TRUE);
            }
        }
        for (int[] pos : inputPos) {
            String[] e = inputEntries.get(pos[2]);
            if ("Edit".equals(e[1]) || "TextEdit".equals(e[1]) || "MaskEdit".equals(e[1])) {
                if (comboAtTopLabel.containsKey(pos[1] + "|" + e[2])) {
                    // "검색조건" → "검색어", 그 외 "XXXXX" → "XXXXX어"
                    e[2] = e[2].endsWith("조건") ? e[2].replace("조건", "어") : e[2] + "어";
                }
            }
        }

        // 규칙3: ID가 _NO로 끝나는 컴포넌트 → 같은 top의 _NM 컴포넌트 레이블 사용
        // top+idBase(앞 부분) → _NM 레이블 색인
        Map<String, String> nmLabelByTopBase = new LinkedHashMap<>();
        for (int[] pos : inputPos) {
            String[] e = inputEntries.get(pos[2]);
            if (e[0].endsWith("_NM")) {
                String base = e[0].substring(0, e[0].length() - 3);
                nmLabelByTopBase.put(pos[1] + "|" + base, e[2]);
            }
        }
        for (int[] pos : inputPos) {
            String[] e = inputEntries.get(pos[2]);
            if (e[0].endsWith("_NO")) {
                String base = e[0].substring(0, e[0].length() - 3);
                String nmLabel = nmLabelByTopBase.get(pos[1] + "|" + base);
                if (nmLabel != null) e[2] = nmLabel;
            }
        }

        inputPos.sort((a, b) -> a[1] != b[1] ? a[1] - b[1] : a[0] - b[0]);
        Map<String, String> result = new LinkedHashMap<>();
        for (int[] pos : inputPos) {
            String[] e = inputEntries.get(pos[2]);
            result.put(e[0], e[2]); // e[0]=id, e[2]=label
        }
        return result;
    }

    /** 입력 컴포넌트 ID 패턴으로 검색조건 힌트 문자열을 반환한다. */
    private String resolveSearchHint(String id) {
        String u = id.toUpperCase();
        if (u.contains("_DT_ST") || u.contains("_FROM_DT") || u.contains("_START_DT"))
            return "시작 날짜 입력 (예: " + LocalDate.now().withDayOfYear(1).format(DateTimeFormatter.BASIC_ISO_DATE) + ")";
        if (u.contains("_DT_ED") || u.contains("_TO_DT") || u.contains("_END_DT"))
            return "종료 날짜 입력 (예: " + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE) + ")";
        if (u.contains("_DT"))
            return "날짜 입력 (예: " + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE) + ")";
        if (u.contains("_CD"))  return "코드 선택";
        if (u.contains("_NM"))  return "명칭 입력";
        if (u.contains("_NO"))  return "번호 입력";
        return "(입력 필요)";
    }

    /**
     * fn_callBack 함수의 case별 패턴 목록을 추출한다.
     * { svcId → [OPENER_SEARCH, SELF_SEARCH, SELF_CLOSE, GW_CALL, ...] }
     */
    private Map<String, List<String>> parseCallbackMap(String content) {
        Map<String, List<String>> map = new LinkedHashMap<>();
        String fnBody = parseEventFn(content, "fn_callBack");
        if (fnBody.isEmpty()) return map;

        String[] chunks = fnBody.split("case\\s+[\"']");

        for (int i = 1; i < chunks.length; i++) {
            String chunk = chunks[i];
            int colonIdx = chunk.indexOf(":");
            if (colonIdx < 0) continue;
            String svcId = chunk.substring(0, colonIdx).trim()
                                 .replaceAll("[\"']", "");
            List<String> patterns = new ArrayList<>();

            if (chunk.contains("this.opener.") && chunk.contains("fn_search"))
                patterns.add("OPENER_SEARCH");
            if (chunk.contains("this.fn_search"))
                patterns.add("SELF_SEARCH");
            if (chunk.contains("this.close()"))
                patterns.add("SELF_CLOSE");
            if (chunk.contains("gfn_gwCall") && chunk.contains("\"Y\""))
                patterns.add("GW_CALL");
            if (chunk.contains("fn_addCartItem") || chunk.contains("addCartItem"))
                patterns.add("ADD_CART_ITEM");
            if (chunk.contains("gfn_showMsg") && chunk.contains("COM_CRUD_0002"))
                patterns.add("MSG_SAVE_OK");
            if (chunk.contains("gfn_showMsg") && chunk.contains("COM_CRUD_0032"))
                patterns.add("MSG_DEL_OK");

            if (!svcId.isEmpty()) map.put(svcId, patterns);
        }
        return map;
    }

    /**
     * GridHeader 내 Col 컴포넌트의 text를 추출한다.
     * { gridId → [헤더 text[]] }
     */
    private Map<String, List<String>> parseGridHeaders(String content) {
        Map<String, List<String>> map = new LinkedHashMap<>();
        // Grid id 추출 → GridHeader → Col text
        Pattern gridPat  = Pattern.compile(
                "<Grid\\s[^>]*id=\"([^\"]+)\"[\\s\\S]*?</Grid>", Pattern.DOTALL);
        Pattern hdrPat   = Pattern.compile("<GridHeader[\\s\\S]*?</GridHeader>", Pattern.DOTALL);
        Pattern colPat   = Pattern.compile("<Col[^>]+text=\"([^\"]+)\"");

        Matcher gm = gridPat.matcher(content);
        while (gm.find()) {
            String gridId = gm.group(1);
            String gridBody = gm.group(0);
            Matcher hm = hdrPat.matcher(gridBody);
            if (!hm.find()) continue;
            String header = hm.group(0);
            List<String> texts = new ArrayList<>();
            Matcher cm = colPat.matcher(header);
            while (cm.find()) {
                String t = cm.group(1).trim();
                if (!t.isEmpty()) texts.add(t);
            }
            if (!texts.isEmpty()) map.put(gridId, texts);
        }
        return map;
    }

    /**
     * fn_validChk 호출 여부 확인 — 버튼 onclick 함수에서 fn_validChk 가 호출되는 svcId를 찾는다.
     */
    private void markValidChkSvcIds(ButtonAnalysis result) {
        for (Map<String, String> btn : result.buttons) {
            String onclickFn = btn.get("onclickFn");
            if (onclickFn == null || onclickFn.isEmpty()) continue;
            String fnBody = result.fnBodies.getOrDefault(onclickFn, "");
            if (!fnBody.contains("fn_validChk")) continue;
            // 이 onclick 함수 내에서 gfn_tran 호출을 찾아 svcId 연결
            Pattern tranPat = Pattern.compile(
                    "gfn_tran\\([^,]+,\\s*[\"']([\\w]+)[\"']");
            Matcher m = tranPat.matcher(fnBody);
            while (m.find()) {
                result.hasValidChkSvcIds.add(m.group(1));
            }
            // svcId가 문자열 리터럴이 아닌 변수 형태인 경우 버튼 ID로 기록
            if (result.hasValidChkSvcIds.isEmpty()) {
                String btnId = btn.get("id");
                if (btnId != null && btnId.contains("save")) {
                    result.hasValidChkSvcIds.add("__btn_save__");
                }
            }
        }
    }

    // ── CRUD 타입 판별 ────────────────────────────────────────────────────────

    private String inferCrudType(String svcId) {
        if (svcId == null || svcId.isEmpty()) return "SELECT";
        String lower = svcId.toLowerCase();
        if (lower.startsWith("get") || lower.startsWith("list")
                || lower.startsWith("search") || lower.startsWith("select")
                || lower.startsWith("find") || lower.startsWith("read"))
            return "SELECT";
        if (lower.startsWith("insert") || lower.startsWith("create")
                || lower.startsWith("add") || lower.startsWith("reg")
                || lower.startsWith("new"))
            return "INSERT";
        if (lower.startsWith("update") || lower.startsWith("modify")
                || lower.startsWith("edit") || lower.startsWith("change"))
            return "UPDATE";
        if (lower.startsWith("delete") || lower.startsWith("del")
                || lower.startsWith("remove"))
            return "DELETE";
        if (lower.startsWith("save") || lower.startsWith("set"))
            return "UPDATE";
        return "SELECT";
    }

    // ── inputCols 추출 ────────────────────────────────────────────────────────

    /**
     * Phase 5: dsColumnMap 우선 조회, 없으면 기존 merged dsColumns heuristic으로 폴백한다.
     */
    private String extractInputCols(String inputDs,
                                     Map<String, List<String>> dsColumnMap,
                                     Map<String, String> dsColumnsFlat) {
        if (inputDs == null || inputDs.isEmpty()) return "";
        if (dsColumnMap != null && dsColumnMap.containsKey(inputDs)) {
            return String.join(",", dsColumnMap.get(inputDs));
        }
        return extractInputCols(inputDs, dsColumnsFlat);
    }

    private String extractInputCols(String inputDs, Map<String, String> dsColumns) {
        if (inputDs == null || inputDs.isEmpty() || dsColumns == null || dsColumns.isEmpty())
            return "";

        List<String> cols;
        if ("ds_search".equals(inputDs)) {
            // 검색 Dataset: 날짜/코드/명칭 컬럼 우선
            cols = new ArrayList<>();
            List<String> others = new ArrayList<>();
            for (String col : dsColumns.keySet()) {
                if (col.contains("_DT") || col.contains("_CD")
                        || col.contains("_NM") || col.contains("_NO")) {
                    cols.add(col);
                } else {
                    others.add(col);
                }
            }
            cols.addAll(others);
        } else {
            cols = new ArrayList<>(dsColumns.keySet());
        }
        return String.join(",", cols);
    }

    /**
     * Phase 5: XFDL Dataset 태그에서 Dataset ID별 컬럼 목록을 분리 파싱한다.
     * XfdlInfo.dsColumns(전체 병합)에 의존하지 않고 정확한 inputDs 컬럼을 반환한다.
     *
     * @return { dsId → [컬럼ID 목록] }
     */
    private Map<String, List<String>> parseDsColumnMap(String content) {
        Map<String, List<String>> map = new LinkedHashMap<>();
        Pattern dsPat  = Pattern.compile(
                "<Dataset[^>]+id=\"([^\"]+)\"[\\s\\S]*?</Dataset>", Pattern.DOTALL);
        Pattern colPat = Pattern.compile("<Column[^>]+id=\"([^\"]+)\"");

        Matcher dm = dsPat.matcher(content);
        while (dm.find()) {
            String dsId   = dm.group(1);
            String dsBody = dm.group(0);
            List<String> cols = new ArrayList<>();
            Matcher cm = colPat.matcher(dsBody);
            while (cm.find()) {
                String colId = cm.group(1).trim();
                if (!colId.isEmpty()) cols.add(colId);
            }
            if (!cols.isEmpty()) map.put(dsId, cols);
        }
        return map;
    }

    /**
     * Phase 5: 동일 sourceName + URL 조합의 중복 시나리오를 병합(첫 건 유지, 이후 중복 제거)한다.
     * URL이 비어 있는 비API 시나리오는 중복 제거 대상에서 제외한다.
     */
    private List<Map<String, Object>> deduplicateByUrl(List<Map<String, Object>> scenarios) {
        Set<String> seen = new LinkedHashSet<>();
        List<Map<String, Object>> deduped = new ArrayList<>();
        for (Map<String, Object> s : scenarios) {
            String url = String.valueOf(s.getOrDefault("URL", ""));
            if (url.isEmpty()) {
                deduped.add(s);
                continue;
            }
            String key = s.getOrDefault("sourceName", "") + "|" + url;
            if (seen.add(key)) {
                deduped.add(s);
            }
        }
        // 중복 제거 후 순번(no) 재부여
        for (int i = 0; i < deduped.size(); i++) {
            deduped.get(i).put("no", i + 1);
        }
        return deduped;
    }

    // ── inputValues 기본값 JSON ────────────────────────────────────────────────

    private String buildInputValues(String inputCols, String crudType,
                                    Map<String, String> labelMap,
                                    Map<String, String> bindMap) {
        // SELECT 시나리오이고 searchInputLabels가 있으면 div_Search 컴포넌트 기반으로 빌드
        if ("SELECT".equals(crudType) && labelMap != null && !labelMap.isEmpty()) {
            Map<String, String> deduped = new LinkedHashMap<>();
            for (Map.Entry<String, String> e : labelMap.entrySet()) {
                String compId  = e.getKey();
                String label   = e.getValue();
                // BindItem으로 매핑된 Dataset 컬럼 ID 조회 (없으면 컴포넌트 ID 사용)
                String colId   = (bindMap != null && bindMap.containsKey(compId))
                                  ? bindMap.get(compId) : compId;
                // 키는 반드시 Dataset 컬럼 ID — spec 생성기(searchBody/필터 단언)가 컬럼 ID를 기대한다.
                // (라벨을 키로 쓰면 검색조건이 유실되어 전 TC가 빈 검색으로 생성됨)
                deduped.put(colId, resolveDefaultValue(colId));
            }
            StringBuilder sb = new StringBuilder("{");
            boolean first = true;
            for (Map.Entry<String, String> e : deduped.entrySet()) {
                if (!first) sb.append(",");
                first = false;
                sb.append("\"").append(e.getKey()).append("\":\"").append(e.getValue()).append("\"");
            }
            sb.append("}");
            return sb.toString();
        }

        // 그 외(INSERT/UPDATE/DELETE): inputCols 기반 기존 방식
        if (inputCols == null || inputCols.isEmpty()) return "{}";
        StringBuilder sb = new StringBuilder("{");
        boolean first = true;
        for (String col : inputCols.split(",")) {
            col = col.trim();
            if (col.isEmpty()) continue;
            String val = resolveDefaultValue(col);
            if (!first) sb.append(",");
            first = false;
            sb.append("\"").append(col).append("\":\"").append(val).append("\"");
        }
        sb.append("}");
        return sb.toString();
    }

    /** 컬럼 ID 패턴으로 기본값 문자열을 반환한다. */
    private String resolveDefaultValue(String colId) {
        java.time.LocalDate today = java.time.LocalDate.now();
        String todayStr     = today.format(java.time.format.DateTimeFormatter.BASIC_ISO_DATE);
        String yearStartStr = today.getYear() + "0101";

        String upper = colId.toUpperCase();
        if (upper.contains("_DT_ST") || upper.contains("_FROM_DT")
                || upper.contains("_START_DT") || upper.endsWith("_SDT")) {
            return yearStartStr;
        }
        if (upper.contains("_DT_ED") || upper.contains("_TO_DT")
                || upper.contains("_END_DT") || upper.endsWith("_EDT")
                || upper.contains("_DT")) {
            return todayStr;
        }
        return "";
    }

    /** BindItem에서 div_search 컴포넌트ID → Dataset 컬럼ID 매핑을 파싱한다. */
    private Map<String, String> parseSearchBindMap(String content) {
        Map<String, String> result = new LinkedHashMap<>();
        Pattern bindPat  = Pattern.compile("<BindItem\\b([^>]*?)(?:/>|>)",
                Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
        Pattern compPat  = Pattern.compile("\\bcompid=\"([^\"]+)\"",  Pattern.CASE_INSENSITIVE);
        Pattern colPat   = Pattern.compile("\\bcolumnid=\"([^\"]+)\"", Pattern.CASE_INSENSITIVE);

        Matcher m = bindPat.matcher(content);
        while (m.find()) {
            String attrs = m.group(1);
            Matcher cm  = compPat.matcher(attrs);
            Matcher colm = colPat.matcher(attrs);
            if (!cm.find() || !colm.find()) continue;
            String compid = cm.group(1);  // e.g. "div_Search.form.SCH_RQST_SDT"
            String colid  = colm.group(1);
            if (!compid.toLowerCase().contains("search")) continue;
            // 마지막 '.' 이후 토큰이 컴포넌트 ID
            int dot = compid.lastIndexOf('.');
            String compName = (dot >= 0) ? compid.substring(dot + 1) : compid;
            result.put(compName, colid);
        }
        return result;
    }

    // ── 테스트명 생성 ─────────────────────────────────────────────────────────

    /**
     * 테스트명 생성: {화면명} - {btnText} ({actionType}) 형식 (MD 3.3절)
     * btn_search인 경우 div_search 내 Static 레이블을 조합하여 "검색조건(...)" 형식으로 생성.
     */
    private String buildTestName(String screenTitle, String btnId, String actionType,
                                  String svcId, Map<String, String> searchInputLabels) {
        String base = (screenTitle != null && !screenTitle.isEmpty()) ? screenTitle : svcId;

        // btnId 패턴 → 한글 btnText fallback
        String btnText = resolveBtnText(btnId, svcId);

        if ("유효성검사".equals(actionType)) {
            return base + " - " + btnText + " (유효성 검사)";
        }

        // btn_search: "검색조건(label1, label2, ...)" 형식
        if (btnId != null && btnId.contains("search")) {
            String searchCond = buildSearchCondLabel(searchInputLabels);
            return base + " - " + btnText + " (" + searchCond + ")";
        }

        if (btnId == null || btnId.isEmpty()) {
            String act = resolveActionTypeFromSvcId(svcId);
            return base + " - " + btnText + " (" + act + ")";
        }

        String act = resolveActionTypeFromBtnId(btnId);
        return base + " - " + btnText + " (" + act + ")";
    }

    /**
     * div_search 내 Static 레이블을 중복 제거 후 "검색조건(...)" 문자열로 조합한다.
     * searchInputLabels가 비어 있으면 "버튼 클릭" 폴백.
     */
    private String buildSearchCondLabel(Map<String, String> searchInputLabels) {
        if (searchInputLabels == null || searchInputLabels.isEmpty()) {
            return "버튼 클릭";
        }
        Set<String> seen = new LinkedHashSet<>();
        for (String label : searchInputLabels.values()) {
            seen.add(label);
        }
        return "검색조건(" + String.join(", ", seen) + ")";
    }

    /**
     * btn_search 기대결과 — searchInputLabels를 label 기준으로 그룹핑하여
     * 각 검색 조건 유형(날짜범위/코드/명칭/번호)에 맞는 그리드 검증 문구를 생성한다.
     */
    private String buildSearchExpectedResult(Map<String, String> searchInputLabels, String outputDs) {
        if (searchInputLabels == null || searchInputLabels.isEmpty()) {
            return "검색 조건 범위 내 데이터만 반환되어야 함";
        }

        // label → inputId 목록으로 역색인 (삽입 순서 유지)
        Map<String, List<String>> labelToIds = new LinkedHashMap<>();
        for (Map.Entry<String, String> entry : searchInputLabels.entrySet()) {
            labelToIds.computeIfAbsent(entry.getValue(), k -> new ArrayList<>()).add(entry.getKey());
        }

        List<String> assertions = new ArrayList<>();
        for (Map.Entry<String, List<String>> e : labelToIds.entrySet()) {
            String label = e.getKey();
            List<String> ids = e.getValue();

            boolean hasSt = false, hasEd = false, hasDt = false;
            boolean hasCd = false, hasNm = false, hasNo = false;
            for (String id : ids) {
                String u = id.toUpperCase();
                if (u.endsWith("_DT_ST") || u.endsWith("_FROM_DT") || u.endsWith("_START_DT")) hasSt = true;
                else if (u.endsWith("_DT_ED") || u.endsWith("_TO_DT") || u.endsWith("_END_DT")) hasEd = true;
                else if (u.endsWith("_DT"))  hasDt = true;
                if (u.endsWith("_CD")) hasCd = true;
                if (u.endsWith("_NM")) hasNm = true;
                if (u.endsWith("_NO")) hasNo = true;
            }

            if (hasSt && hasEd) {
                assertions.add("그리드의 " + label + " 항목은 설정한 날짜 범위 내 데이터만 반환되어야 함");
            } else if (hasDt) {
                assertions.add("그리드의 " + label + " 항목은 설정한 날짜 기준 데이터만 반환되어야 함");
            } else if (hasCd) {
                assertions.add("그리드의 " + label + " 항목은 선택한 코드 값과 일치하는 데이터만 반환되어야 함");
            } else if (hasNm) {
                assertions.add("그리드의 " + label + " 항목에 입력한 명칭이 포함된 데이터만 반환되어야 함");
            } else if (hasNo) {
                assertions.add("그리드의 " + label + " 항목은 입력한 번호와 일치하는 데이터만 반환되어야 함");
            }
        }

        return assertions.isEmpty()
                ? "검색 조건 범위 내 데이터만 반환되어야 함"
                : String.join(", ", assertions);
    }

    /** btnId 패턴 → 한글 표시명 */
    private String resolveBtnText(String btnId, String svcId) {
        if (btnId == null || btnId.isEmpty()) {
            // svcId로 추론
            if (svcId != null) {
                String lower = svcId.toLowerCase();
                if (lower.startsWith("get") || lower.startsWith("list") || lower.startsWith("search"))
                    return "조회";
                if (lower.startsWith("insert") || lower.startsWith("create") || lower.startsWith("reg"))
                    return "등록";
                if (lower.startsWith("update") || lower.startsWith("modify") || lower.startsWith("save"))
                    return "저장";
                if (lower.startsWith("delete") || lower.startsWith("del"))
                    return "삭제";
            }
            return "실행";
        }
        if (btnId.contains("search"))                return "조회";
        if (btnId.contains("save"))                  return "저장";
        if (btnId.contains("del") && !btnId.contains("row")) return "삭제";
        if (btnId.contains("approval") || btnId.contains("approv")) return "결재상신";
        if (btnId.contains("row_add") || btnId.contains("add_row")) return "행추가";
        if (btnId.contains("row_del") || btnId.contains("del_row")) return "행삭제";
        if (btnId.contains("excel"))                 return "엑셀다운";
        if (btnId.startsWith("btn_SCH"))             return "조회";
        return btnId;
    }

    /** btnId 패턴 → 동작 설명 (테스트명의 괄호 안 내용) */
    private String resolveActionTypeFromBtnId(String btnId) {
        if (btnId.contains("search"))                return "버튼 클릭";
        if (btnId.contains("save"))                  return "저장 실행";
        if (btnId.contains("del") && !btnId.contains("row")) return "삭제 실행";
        if (btnId.contains("approval") || btnId.contains("approv")) return "결재상신 실행";
        if (btnId.contains("row_add") || btnId.contains("add_row")) return "그리드 행 추가";
        if (btnId.contains("row_del") || btnId.contains("del_row")) return "그리드 행 삭제";
        if (btnId.contains("excel"))                 return "엑셀 다운로드";
        if (btnId.startsWith("btn_SCH"))             return "팝업 열기";
        return "실행";
    }

    /** svcId → 동작 설명 (버튼 불명 시) */
    private String resolveActionTypeFromSvcId(String svcId) {
        if (svcId == null) return "실행";
        String lower = svcId.toLowerCase();
        if (lower.startsWith("get") || lower.startsWith("list") || lower.startsWith("search"))
            return "버튼 클릭";
        if (lower.startsWith("insert") || lower.startsWith("create") || lower.startsWith("reg"))
            return "저장 실행";
        if (lower.startsWith("update") || lower.startsWith("modify") || lower.startsWith("save"))
            return "저장 실행";
        if (lower.startsWith("delete") || lower.startsWith("del"))
            return "삭제 실행";
        return "실행";
    }

    // ── 사전조건 생성 ─────────────────────────────────────────────────────────

    private String buildPreCondition(String btnId, List<String> enabledLabels,
                                      String crudType, String inputCols) {
        if (btnId == null) btnId = "";

        if (btnId.contains("del") && !btnId.contains("row")) {
            return "삭제 대상 행이 그리드에서 선택되어 있어야 함";
        }
        if (btnId.contains("approval") || btnId.contains("approv")) {
            return "저장된 문서가 존재하고 결재 가능 상태(미상신)여야 함";
        }
        if (btnId.contains("row_add") || btnId.contains("add_row")) {
            return "그리드가 화면에 표시된 상태여야 함";
        }
        if (btnId.contains("row_del") || btnId.contains("del_row")) {
            return "삭제할 행이 그리드에서 선택된 상태여야 함";
        }

        if ("SELECT".equals(crudType) || btnId.contains("search")) {
            return "검색 조건(날짜 범위, 콤보박스 등)을 설정하고, 해당 조건 범위 내 데이터가 DB에 존재해야 함. "
                 + "조회 결과가 입력한 조건 범위를 벗어나지 않아야 함";
        }

        // btn_save: enabledLabels 기반 항목별 줄 나열
        if (!enabledLabels.isEmpty()) {
            StringBuilder sb = new StringBuilder();
            for (String label : enabledLabels) {
                sb.append("- ").append(label).append(": (입력 필요)\n");
            }
            return sb.toString().trim();
        }

        switch (crudType) {
            case "INSERT": return "입력 필수 항목의 값이 유효해야 함";
            case "UPDATE": return "수정 대상 데이터가 DB에 존재해야 함";
            case "DELETE": return "삭제 대상 행이 그리드에서 선택되어 있어야 함";
            default:       return "정상 조회 조건이 설정되어 있어야 함";
        }
    }

    // ── 기대결과 생성 ─────────────────────────────────────────────────────────

    private String buildExpectedResult(String svcId, List<String> cbPatterns,
                                        String crudType, String outputDs,
                                        String screenTitle, String actionType,
                                        String btnId, Map<String, String> searchInputLabels) {
        if ("유효성검사".equals(actionType)) {
            return "유효성 검사 실패 시 오류 메시지 표시, 저장 요청 발생 안 함";
        }

        // btn_search + SELECT: 검색조건별 그리드 검증 문구 생성
        if (btnId != null && btnId.contains("search") && "SELECT".equals(crudType)) {
            return buildSearchExpectedResult(searchInputLabels, outputDs);
        }

        if (cbPatterns == null || cbPatterns.isEmpty()) {
            if ("SELECT".equals(crudType)) {
                String ds = (outputDs != null && !outputDs.isEmpty()) ? outputDs : "응답 Dataset";
                return "HTTP 200, " + ds + " Dataset 1건 이상 반환";
            }
            return "HTTP 200, 응답 XML에 ErrorCode=0 포함";
        }

        List<String> parts = new ArrayList<>();
        if (cbPatterns.contains("MSG_SAVE_OK")) parts.add("저장 완료 메시지 표시");
        if (cbPatterns.contains("MSG_DEL_OK"))  parts.add("삭제 완료 메시지 표시");
        if (cbPatterns.contains("GW_CALL"))     parts.add("결재상신 완료, 결재함에서 확인 가능");
        if (cbPatterns.contains("OPENER_SEARCH")) {
            String parent = screenTitle != null ? screenTitle + " " : "";
            parts.add(parent + "목록 재조회됨");
        }
        if (cbPatterns.contains("SELF_SEARCH")) parts.add("상세화면 재로드됨");
        if (cbPatterns.contains("SELF_CLOSE"))  parts.add("화면 닫힘");
        if (cbPatterns.contains("ADD_CART_ITEM")) parts.add("부모 화면 그리드에 선택 항목 추가됨");

        if (parts.isEmpty()) return "HTTP 200, 응답 XML에 ErrorCode=0 포함";
        return String.join(", ", parts);
    }

    // ── 버튼-svcId 역매핑 ────────────────────────────────────────────────────

    /**
     * svcId에 해당하는 버튼 ID를 찾는다.
     * onclick 함수명이 "btn_save_onclick" → "btn_save" 패턴으로 역매핑.
     *
     * 주의: svcId의 CRUD 의도를 먼저 판별한 뒤 버튼을 찾는다(버튼별 개별 체크 순서에 의존하지 않음).
     * "setDelSave"처럼 "set"으로 시작하지만 실제로는 삭제인 복합 svcId가 흔한데,
     * 예전 구현은 버튼 순회 중 SAVE 조건(lower.startsWith("set"))이 DELETE 조건(startsWith("del"))보다
     * 먼저 걸려서 삭제 화면인데도 btn_save를 잘못 반환했다. DELETE는 svcId에 "del"이 포함되면
     * 위치와 무관하게 최우선으로 판별해 이 오분류를 막는다.
     */
    // package-private: ScenarioBuilderService(통합 시나리오 btnId 해소)에서도 재사용
    String findButtonBySvcId(String svcId, List<Map<String, String>> buttons) {
        if (svcId == null) return null;
        String lower = svcId.toLowerCase();

        boolean isSearch = lower.startsWith("get") || lower.startsWith("list")
                || lower.startsWith("search") || lower.startsWith("find");
        boolean isDelete = lower.contains("del") || lower.startsWith("remove");
        boolean isSave   = !isDelete && (lower.startsWith("save") || lower.startsWith("set")
                || lower.startsWith("insert") || lower.startsWith("update")
                || lower.startsWith("modify") || lower.startsWith("create"));
        boolean isApproval = lower.contains("approv") || lower.contains("gw");

        for (Map<String, String> btn : buttons) {
            String btnId = btn.getOrDefault("id", "");
            if (isSearch && btnId.contains("search")) return btnId;
            if (isDelete && btnId.contains("del") && !btnId.contains("row")) return btnId;
            if (isSave && btnId.contains("save")) return btnId;
            if (isApproval && (btnId.contains("approv") || btnId.contains("approval"))) return btnId;
        }
        return null;
    }

    // ── 비-tranCall 버튼 분류 ──────────────────────────────────────────────────

    /**
     * 버튼 목록을 분석하여 팝업/행추가/행삭제/엑셀/결재 버튼으로 분류한다.
     * tranCall과 연결되지 않는 버튼만 대상으로 한다.
     */
    private void categorizeNonTranButtons(ButtonAnalysis result) {
        Pattern popupPat    = Pattern.compile("gfn_openPopup\\s*\\(");
        Pattern approvalPat = Pattern.compile("gfn_gwCall|lv_appYn\\s*=\\s*[\"']Y[\"']");

        // tranCall이 이미 처리하는 svcId와 연결된 버튼 ID 수집 (중복 제외용)
        Set<String> tranSvcBtnIds = new LinkedHashSet<>();
        for (Map<String, String> btn : result.buttons) {
            String btnId = btn.getOrDefault("id", "").toLowerCase();
            if (btnId.contains("search") || btnId.contains("save") || btnId.contains("del")
                    || btnId.contains("approv")) {
                tranSvcBtnIds.add(btn.getOrDefault("id", ""));
            }
        }

        for (Map<String, String> btn : result.buttons) {
            String btnId  = btn.getOrDefault("id", "");
            String lower  = btnId.toLowerCase();

            // 행추가/행삭제: ID 패턴으로 빠르게 판별
            if (lower.contains("row_add") || lower.contains("add_row")
                    || (lower.endsWith("_add") && !lower.contains("del"))) {
                result.rowAddBtnIds.add(btnId);
                continue;
            }
            if (lower.contains("row_del") || lower.contains("del_row")
                    || (lower.endsWith("_del") && !lower.contains("add"))) {
                result.rowDelBtnIds.add(btnId);
                continue;
            }
            // 엑셀 버튼
            if (lower.contains("excel") || lower.contains("_xls")) {
                result.excelBtnIds.add(btnId);
                continue;
            }
            // 이미 tranCall로 처리되는 저장/검색/삭제/결재 버튼 제외
            if (tranSvcBtnIds.contains(btnId)) continue;

            // onclick 함수 본문 분석: 팝업 또는 결재
            String onclickFn = btn.getOrDefault("onclickFn", "");
            if (onclickFn.isEmpty()) continue;
            String fnBody = result.fnBodies.getOrDefault(onclickFn, "");
            if (fnBody.isEmpty()) continue;

            if (popupPat.matcher(fnBody).find()) {
                result.popupButtons.add(btn);
            } else if (approvalPat.matcher(fnBody).find()) {
                result.approvalBtnIds.add(btnId);
            }
        }
    }

    // ── 비-tranCall 시나리오 단건 조립 ───────────────────────────────────────

    private Map<String, Object> buildNonTranScenario(int no,
                                                      XfdlParserService.XfdlInfo info,
                                                      Map<String, String> menu,
                                                      String origin,
                                                      String testName,
                                                      String preCondition,
                                                      String expectedResult,
                                                      String testType) {
        String screenTitle = (info.screenTitle != null && !info.screenTitle.isEmpty())
                ? info.screenTitle : info.screenName;
        Map<String, Object> s = new LinkedHashMap<>();
        s.put("no",            no);
        s.put("testType",      testType);
        s.put("sourceName",    info.screenName);
        s.put("screenName",    info.screenName);
        s.put("scenarioId",    ("통합".equals(testType) ? "IT_" : "UT_") + info.screenName.toUpperCase());
        s.put("화면명",         screenTitle);
        s.put("crudType",      "");
        s.put("URL",           "");
        s.put("serviceId",     "");
        s.put("method",        "");
        s.put("inputDsId",     "");
        s.put("outputDsId",    "");
        s.put("inputCols",     "");
        s.put("inputValues",   "{}");
        s.put("origin",        origin);
        s.put("사전조건",       preCondition);
        s.put("expectedResult", expectedResult);
        String menuPath2 = menu.getOrDefault("menuPath", "");
        String[] mNodes2 = menuPath2.isEmpty() ? new String[0] : menuPath2.split("\\s*>\\s*");
        s.put("menuPath",    menuPath2);
        String _gnb2 = mNodes2.length >= 1 ? mNodes2[0].trim() : "";
        String _menuNm2 = mNodes2.length >= 1 ? mNodes2[mNodes2.length - 1].trim() : "";
        if (_menuNm2.isEmpty()) _menuNm2 = screenTitle;
        s.put("gnbName",     _gnb2);
        s.put("menuName",    _menuNm2);
        s.put("groupName",   mNodes2.length >= 4 ? mNodes2[1].trim() : (mNodes2.length == 3 ? mNodes2[0].trim() : ""));
        s.put("subCategory", mNodes2.length >= 4 ? mNodes2[mNodes2.length - 2].trim() : (mNodes2.length == 3 ? mNodes2[1].trim() : ""));
        // 테스트명 = 메뉴명 - 버튼명, description = 전달받은 상세 테스트명
        // testName 형식: "화면명 - 버튼동작 > 결과설명" → 화면명 접두어 제거 후 " > " 앞까지만 사용
        String _actionPart2 = testName;
        if (_actionPart2.contains(" - ")) _actionPart2 = _actionPart2.substring(_actionPart2.indexOf(" - ") + 3);
        if (_actionPart2.contains(" > "))  _actionPart2 = _actionPart2.substring(0, _actionPart2.indexOf(" > "));
        s.put("테스트명",    _menuNm2 + " - " + _actionPart2.trim());
        s.put("description", testName);
        s.put("actor",       "개발자");
        s.put("roleNm",      "개발자");   // 액터 표기 — 그리드/스펙/리포트가 roleNm 사용 (DB 역할 있으면 enrichRoles가 덮어씀)

        // result.md §3.2 — 통과여부 초기값 null
        s.put("DEV_PASS",  null);
        s.put("PL_PASS",   null);
        s.put("USER_PASS", null);
        s.put("REMARK",    "");

        return s;
    }

    // ── enabledLabels 조합 ────────────────────────────────────────────────────

    private List<String> resolveEnabledLabels(List<String> enabledCtrls,
                                               Map<String, String> staticLabels,
                                               Map<String, List<String>> gridHeaders) {
        List<String> labels = new ArrayList<>();
        for (String ctrlId : enabledCtrls) {
            String label = staticLabels.get(ctrlId);
            if (label != null && !label.isEmpty()) {
                labels.add(label);
            } else {
                // 그리드 헤더 컬럼으로 대체
                List<String> headers = gridHeaders.get(ctrlId);
                if (headers != null && !headers.isEmpty()) {
                    labels.add(ctrlId + "(" + String.join(", ", headers) + ")");
                }
            }
        }
        return labels;
    }

    // ── 저장 버튼 여부 판별 보조 ────────────────────────────────────────────────

    private boolean looksLikeSaveBtn(String svcId) {
        if (svcId == null) return false;
        String lower = svcId.toLowerCase();
        return lower.startsWith("save") || lower.startsWith("insert")
                || lower.startsWith("update") || lower.startsWith("modify")
                || lower.startsWith("set");
    }

    // ── origin 추출 ───────────────────────────────────────────────────────────

    private String resolveOrigin(File xfdlFile) {
        File parent = xfdlFile.getParentFile();
        while (parent != null) {
            String name = parent.getName().toLowerCase();
            if ("mis".equals(name) || "pms".equals(name)) return name;
            parent = parent.getParentFile();
        }
        return "mis";
    }

    // ── 파일 탐색 및 읽기 ─────────────────────────────────────────────────────

    private List<File> listXfdlFiles(File dir) {
        List<File> result = new ArrayList<>();
        Deque<File> queue = new ArrayDeque<>();
        queue.add(dir);
        while (!queue.isEmpty()) {
            File cur = queue.poll();
            if (cur.isDirectory()) {
                File[] children = cur.listFiles();
                if (children != null) {
                    for (File c : children) queue.add(c);
                }
            } else {
                String name = cur.getName().toLowerCase();
                if (name.endsWith(".xfdl") || name.endsWith(".xfdl.js")) {
                    result.add(cur);
                }
            }
        }
        result.sort(Comparator.comparing(File::getName));
        return result;
    }

    private String readFile(File f) {
        return FilePathHelper.readFileSafe(f);
    }
}
