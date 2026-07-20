package cres.pss.service;

import java.io.File;
import java.time.LocalDate;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 시나리오 조립 서비스
 * xfdl/sqlmap 파싱 결과 → 시나리오 JSON 목록 생성
 * AI API 호출 없음 — 규칙 기반
 *
 * 파서 분리:
 *   XfdlParserService   — xfdl.js 파싱 (gfn_tran, dsColumns, screenTitle)
 *   SqlmapParserService — sqlmap XML → CRUD 인덱스
 */
@Service
public class ScenarioBuilderService {

    @Autowired private XfdlParserService     xfdlParser;
    @Autowired private SqlmapParserService   sqlmapParser;
    @Autowired private XfdlScenarioExtractor xfdlExtractor;
    @Autowired private MenuResolveDao        menuResolveDao;
    /** 하위 호환: SourceParserService 를 통해 호출하는 기존 코드 지원 */
    @Autowired private SourceParserService parser;

    // ── CRUD 분류 규칙 ──────────────────────────────────────────────────────
    private static final String[] DELETE_PFX = {"delete","remove","del","drop","purge"};
    private static final String[] INSERT_PFX = {"save","insert","add","create","reg","write","ins","new"};
    private static final String[] UPDATE_PFX = {"update","modify","edit","change","upd","mod","put"};
    private static final String[] SELECT_PFX = {"get","search","list","find","load","fetch","read","select",
                                                  "query","retrieve","check","verify","count","view"};

    // ── PUR 전용: 업무 규칙 기반 추가 시나리오 키 ─────────────────────────
    /** URL 또는 메서드명에 포함되면 예산 검증 시나리오 추가 */
    private static final String[] PUR_BUDG_KEYS   = {"checkBudgBaln","checkBudg","budgBaln"};
    /** URL 또는 메서드명에 포함되면 동시성 체크 시나리오 추가 */
    private static final String[] PUR_CONC_KEYS   = {"uptChk","concurChk"};
    /** URL 또는 메서드명에 포함되면 결재 흐름 시나리오 추가 */
    private static final String[] PUR_APPR_KEYS   = {"setApp","setAppStat","requestApproval"};
    /** 삭제 URL 패턴 — 결재 상태 제약 시나리오 */
    private static final String[] PUR_DELETE_KEYS = {"delData","delList","deleteData"};

    // ============================================================
    // 핵심 메서드: 소스 파일 목록 → 시나리오 목록
    // ============================================================

    /**
     * checkedFiles 각각에 대해 xfdl 파싱 → sqlmap 파싱 → 시나리오 생성
     * @param checkedFiles  [{displayName, origin(optional)}] 목록
     * @param menuMap       pgmId → "GNB > Group > Menu" 경로 맵
     * @param nxuiBase      xfdl 파일 루트
     * @param srcBase       Controller.java 루트
     * @param sqlmapBase    sqlmap XML 루트
     * @param prefix        모듈 접두어 (예: "pur")
     * @param writer        SSE 로그 출력용 (null 허용)
     */
    public List<Map<String, Object>> buildScenarios(
            List<Map<String, Object>> checkedFiles,
            Map<String, String> menuMap,
            String nxuiBase, String srcBase, String sqlmapBase,
            String prefix, java.io.PrintWriter writer) {

        List<Map<String, Object>> scenarios = new ArrayList<>();
        int no = 1; // DB SEQ — 전체 순번 (AI_SCEN.SEQ용)

        for (Map<String, Object> fileEntry : checkedFiles) {
            String displayName = str(fileEntry, "displayName");
            if (displayName.isEmpty()) continue;

            String sourceName = normalizeSourceName(displayName);
            int sidNo = 1; // PGM_ID별 시나리오 ID 순번 — 화면마다 1부터 리셋
            log(writer, "");
            log(writer, "► [" + sourceName + "] 파싱 중...");

            // 1. xfdl 파일 탐색
            String[] xfdlResult = FilePathHelper.findXfdlAnywhere(nxuiBase, sourceName);
            if (xfdlResult == null) {
                log(writer, "  ⚠ xfdl 파일 없음: " + sourceName);
                continue;
            }
            String xfdlPath = xfdlResult[0];
            String origin   = xfdlResult[1];
            String module   = xfdlResult[2];
            log(writer, "  ✓ xfdl: " + new File(xfdlPath).getName() + " (" + origin + "/" + module + ")");

            // 2. xfdl 파싱
            String xfdlContent = FilePathHelper.readFileSafe(new File(xfdlPath));
            XfdlParserService.XfdlInfo xfdlInfo = xfdlParser.parseXfdl(xfdlContent);
            // 2-1. 검색영역 Static 레이블 + BindItem 분석 (컬럼→레이블 역매핑용)
            XfdlScenarioExtractor.ButtonAnalysis xfdlAnalysis = xfdlExtractor.analyzeButtons(xfdlContent);
            Map<String, String> colLabelMap = buildColLabelMap(xfdlAnalysis);

            String screenId    = !xfdlInfo.screenName.isEmpty()  ? xfdlInfo.screenName  : sourceName;
            String screenTitle = !xfdlInfo.screenTitle.isEmpty() ? xfdlInfo.screenTitle : screenId;
            log(writer, "  ✓ 화면: " + screenTitle + " (" + xfdlInfo.tranCalls.size() + "개 gfn_tran)");

            // 3. sqlmap 디렉터리 파싱 → CRUD 인덱스
            File sqlmapDir  = new File(sqlmapBase + "/" + origin + "/" + module);
            Map<String, String> sqlmapIndex = sqlmapParser.buildSqlmapIndex(sqlmapDir);
            log(writer, "  ✓ sqlmap: " + sqlmapIndex.size() + "개 쿼리 ID 로드");

            // 4. 메뉴 경로
            String pgmId     = extractPgmId(displayName);
            String menuPath  = menuMap.getOrDefault(pgmId, menuMap.getOrDefault(sourceName, ""));
            System.out.println("[ScenarioBuilderService] menuMap 조회 —"
                + " pgmId=" + pgmId + ", sourceName=" + sourceName
                + " → menuPath=\"" + menuPath + "\""
                + (menuPath.isEmpty()
                    ? "  !! menuMap에 키 없음 — pgmId와 menuMap 키를 비교하세요 !!"
                    : ""));
            System.out.println("  menuMap 키 목록: " + menuMap.keySet());
            String[] menuParts = parseMenuPath(menuPath);
            String gnbName     = menuParts[0];
            String groupName   = menuParts[1];   // 중분류
            String subCategory = menuParts[2];   // 소분류
            String menuName    = !menuParts[3].isEmpty() ? menuParts[3] : screenTitle;
            int _scenStartIdx  = scenarios.size();  // 이 파일 시나리오 시작 인덱스 (subCategory 후주입용)
            System.out.println("  → gnbName=\"" + gnbName + "\", groupName=\"" + groupName
                + "\", subCategory=\"" + subCategory + "\", menuName=\"" + menuName + "\""
                + (menuParts[3].isEmpty() ? "  (menuParts[3] 비어있어 screenTitle 사용)" : ""));

            // 5. gfn_tran → 단위 시나리오 (모든 operation, 1개당 1개)
            //    + INSERT/UPDATE 화면 → 통합 시나리오 추가 (scenario-rules.md 1절)
            if (xfdlInfo.tranCalls.isEmpty()) {
                log(writer, "  ⚠ gfn_tran 호출 없음 — 스킵");
                continue;
            }

            // 5-1. 전체 gfn_tran → 단위 시나리오
            //      SELECT: 전체조회(TC1) + 검색조건별 단위 TC (기간/상태/키워드/권한)
            //      INSERT/UPDATE/DELETE: 기존 단일 TC 유지
            XfdlParserService.TranCall insertOrUpdateCall = null; // 통합 시나리오용
            for (XfdlParserService.TranCall tran : xfdlInfo.tranCalls) {
                String crudType = classifyCrud(tran.svcId, tran.url, sqlmapIndex);

                // 실제 버튼 id 해소 — 단위 시나리오도 통합과 동일하게, onclick 함수 본문에서
                // 실제 gfn_tran(svcId) 호출을 추적한 svcIdToBtnMap(신뢰도 최상)을 우선 사용한다.
                // (기존에는 단위 테스트만 crudType→고정 관례명(btn_search/btn_save 등)에 의존해
                // 화면마다 실제 id가 다르면 조용히 클릭 실패하는 문제가 있었다.)
                Map<String, String> unitBtnInfo = xfdlAnalysis.svcIdToBtnMap.get(tran.svcId);
                String unitBtnId = (unitBtnInfo != null) ? unitBtnInfo.get("btnId") : null;
                if (unitBtnId == null || unitBtnId.isEmpty()) {
                    unitBtnId = xfdlExtractor.findButtonBySvcId(tran.svcId, xfdlAnalysis.buttons);
                }

                if ("SELECT".equals(crudType)) {
                    // TC1: 전체 조회 (조건 없음)
                    String sid1 = "UT_" + sourceName.toUpperCase() + "_" + String.format("%03d", sidNo);
                    Map<String, Object> s1 = makeScenario(no, "단위", sid1,
                        screenId, screenTitle, origin, gnbName, groupName, menuName,
                        screenTitle + " - 전체 조회",
                        tran, crudType, "전체 " + screenTitle + " 목록이 조회된다. (1건 이상)", "",
                        xfdlInfo.dsColumns, xfdlInfo.comboColumns);
                    s1.put("preCondition", "검색 조건을 입력하지 않고 [조회] 버튼을 클릭한다.");
                    s1.put("inputValues", "(없음)");
                    if (unitBtnId != null && !unitBtnId.isEmpty()) s1.put("btnId", unitBtnId);
                    scenarios.add(s1);
                    log(writer, "  + [no:" + no + "] " + sid1 + "  " + tran.url + "  (SELECT/전체) [단위]");
                    no++; sidNo++;

                    // 검색조건별 TC — ds_search 컬럼 기반
                    // XfdlParserService.P_DS_COLUMN 이 Nexacro XFDL 포맷과 불일치할 경우
                    // XfdlScenarioExtractor.parseDsColumnMap(더 유연한 파서)로 폴백한다.
                    List<String> _dsSearch = xfdlAnalysis.dsColumnMap.get("ds_search");
                    Set<String> colSet = new java.util.LinkedHashSet<>();
                    if (_dsSearch != null && !_dsSearch.isEmpty()) {
                        colSet.addAll(_dsSearch);
                    } else if (!xfdlAnalysis.dsColumnMap.isEmpty()) {
                        for (java.util.List<String> _cols : xfdlAnalysis.dsColumnMap.values())
                            colSet.addAll(_cols);
                    }
                    if (colSet.isEmpty()) colSet.addAll(xfdlInfo.dsColumns.keySet());
                    if (!colSet.isEmpty()) {
                        // 기간 조회
                        String[] dateCols = detectDateCols(colSet);
                        if (dateCols != null) {
                            // 시작일자 레이블을 기준으로 "(시작)"/"(종료)" 파생
                            // XfdlScenarioExtractor rule1이 종료Calendar를 "종료일자"로 리매핑하므로
                            // 시작 레이블만 사용하여 양쪽을 일관되게 표기한다.
                            String baseLabel = colLabel(dateCols[0], colLabelMap); // e.g. "신청일자"
                            String iv2  = baseLabel + "(" + dateCols[0] + ") : 20240101\n"
                                        + baseLabel + "(종료)(" + dateCols[1] + ") : 20261231";
                            String flow2 = baseLabel + "(시작)에 '20240101'을 입력하고, "
                                         + baseLabel + "(종료)에 '20261231'을 입력한 후 [조회] 버튼을 클릭한다.";
                            String exp2  = "2024-01-01 ~ 2026-12-31 범위의 " + screenTitle + " 목록이 조회된다.";
                            String sid2 = "UT_" + sourceName.toUpperCase() + "_" + String.format("%03d", sidNo);
                            Map<String, Object> s2 = makeScenario(no, "단위", sid2,
                                screenId, screenTitle, origin, gnbName, groupName, menuName,
                                screenTitle + " - 기간 조회 [" + dateCols[0] + "=20240101 ~ " + dateCols[1] + "=20261231]",
                                tran, crudType, exp2, iv2, xfdlInfo.dsColumns, xfdlInfo.comboColumns);
                            s2.put("preCondition", flow2);
                            s2.put("inputValues", iv2);
                            if (unitBtnId != null && !unitBtnId.isEmpty()) s2.put("btnId", unitBtnId);
                            scenarios.add(s2);
                            log(writer, "  + [no:" + no + "] " + sid2 + "  (SELECT/기간조회) [단위]");
                            no++; sidNo++;

                            // 역방향 날짜 (오류 케이스)
                            String iv3   = baseLabel + "(" + dateCols[0] + ") : 20261231\n"
                                         + baseLabel + "(종료)(" + dateCols[1] + ") : 20240101";
                            String flow3 = baseLabel + "(시작)에 '20261231'을 입력하고, "
                                         + baseLabel + "(종료)에 '20240101'을 입력한 후 (시작>종료 역방향) [조회] 버튼을 클릭한다.";
                            String sid3 = "UT_" + sourceName.toUpperCase() + "_" + String.format("%03d", sidNo);
                            Map<String, Object> s3 = makeScenario(no, "단위", sid3,
                                screenId, screenTitle, origin, gnbName, groupName, menuName,
                                screenTitle + " - 날짜 범위 역방향 오류 [" + dateCols[0] + ">" + dateCols[1] + "]",
                                tran, crudType, "시작일자가 종료일자보다 크므로 0건이 조회된다.", iv3,
                                xfdlInfo.dsColumns, xfdlInfo.comboColumns);
                            s3.put("preCondition", flow3);
                            s3.put("inputValues", iv3);
                            if (unitBtnId != null && !unitBtnId.isEmpty()) s3.put("btnId", unitBtnId);
                            scenarios.add(s3);
                            log(writer, "  + [no:" + no + "] " + sid3 + "  (SELECT/역방향오류) [단위]");
                            no++; sidNo++;
                        }

                        // 결재상태 필터
                        String statCol = detectStatusCol(colSet);
                        if (statCol != null) {
                            String statLbl = colLabel(statCol, colLabelMap);
                            String iv4    = statLbl + "(" + statCol + ") : 000-010-090";
                            String flow4  = statLbl + " 콤보박스에서 '결재진행중(000-010-090)'을 선택하고 [조회] 버튼을 클릭한다.";
                            String exp4   = "결재 완료(000-010-040) 건을 제외한, 결재 진행 중인 " + screenTitle + " 목록이 조회된다.";
                            String sid4 = "UT_" + sourceName.toUpperCase() + "_" + String.format("%03d", sidNo);
                            Map<String, Object> s4 = makeScenario(no, "단위", sid4,
                                screenId, screenTitle, origin, gnbName, groupName, menuName,
                                screenTitle + " - 결재상태 필터 [" + statCol + "=000-010-090]",
                                tran, crudType, exp4, iv4, xfdlInfo.dsColumns, xfdlInfo.comboColumns);
                            s4.put("preCondition", flow4);
                            s4.put("inputValues", iv4);
                            if (unitBtnId != null && !unitBtnId.isEmpty()) s4.put("btnId", unitBtnId);
                            scenarios.add(s4);
                            log(writer, "  + [no:" + no + "] " + sid4 + "  (SELECT/상태필터) [단위]");
                            no++; sidNo++;
                        }

                        // 키워드 검색
                        String[] kwCols = detectKeywordPair(colSet);
                        if (kwCols != null) {
                            String kwLbl0 = colLabel(kwCols[0], colLabelMap);
                            String kwLbl1 = colLabel(kwCols[1], colLabelMap);
                            String iv5    = kwLbl0 + "(" + kwCols[0] + ") : RQST_NO\n"
                                          + kwLbl1 + "(" + kwCols[1] + ") : 2024";
                            String flow5  = kwLbl0 + " 콤보박스에서 '신청번호(RQST_NO)'를 선택하고, "
                                          + kwLbl1 + "에 '2024'를 입력한 후 [조회] 버튼을 클릭한다.";
                            String exp5   = "신청번호에 '2024'가 포함된 " + screenTitle + " 목록이 조회된다.";
                            String sid5 = "UT_" + sourceName.toUpperCase() + "_" + String.format("%03d", sidNo);
                            Map<String, Object> s5 = makeScenario(no, "단위", sid5,
                                screenId, screenTitle, origin, gnbName, groupName, menuName,
                                screenTitle + " - 키워드 검색 [" + kwCols[0] + "=RQST_NO, " + kwCols[1] + "=2024]",
                                tran, crudType, exp5, iv5, xfdlInfo.dsColumns, xfdlInfo.comboColumns);
                            s5.put("preCondition", flow5);
                            s5.put("inputValues", iv5);
                            if (unitBtnId != null && !unitBtnId.isEmpty()) s5.put("btnId", unitBtnId);
                            scenarios.add(s5);
                            log(writer, "  + [no:" + no + "] " + sid5 + "  (SELECT/키워드검색) [단위]");
                            no++; sidNo++;
                        }

                        // 권한 필터
                        String roleCol = detectRoleCol(colSet);
                        if (roleCol != null) {
                            // DB에서 해당 프로그램에 접근 가능한 ROLE_YN=Y 사용자 조회
                            String roleUserHint = resolveRoleYnUser(pgmId);
                            // ROLE_YN은 div_Search UI 컴포넌트가 없어 colLabelMap에 없으면 colId 그대로 사용
                            String roleLbl = colLabel(roleCol, colLabelMap);
                            String iv6    = roleLbl.equals(roleCol)
                                          ? roleCol + " : Y (세션 자동 적용)"
                                          : roleLbl + "(" + roleCol + ") : Y (세션 자동 적용)";
                            String flow6  = "[조회] 버튼을 클릭한다."
                                          + " (" + roleCol + "=Y 권한 조건은 세션 정보로 자동 적용되며,"
                                          + " 화면에서 별도 입력하지 않음"
                                          + (roleUserHint.isEmpty() ? "" : " — 접근 가능 사용자: " + roleUserHint)
                                          + ")";
                            String exp6   = roleCol + "=Y 권한 범위 내 " + screenTitle + " 목록이 조회된다.";
                            String sid6 = "UT_" + sourceName.toUpperCase() + "_" + String.format("%03d", sidNo);
                            Map<String, Object> s6 = makeScenario(no, "단위", sid6,
                                screenId, screenTitle, origin, gnbName, groupName, menuName,
                                screenTitle + " - 권한 필터 [" + roleCol + "=Y]",
                                tran, crudType, exp6, iv6, xfdlInfo.dsColumns, xfdlInfo.comboColumns);
                            s6.put("preCondition", flow6);
                            s6.put("inputValues", iv6);
                            if (unitBtnId != null && !unitBtnId.isEmpty()) s6.put("btnId", unitBtnId);
                            scenarios.add(s6);
                            log(writer, "  + [no:" + no + "] " + sid6 + "  (SELECT/권한필터, 사용자=" + roleUserHint + ") [단위]");
                            no++; sidNo++;
                        }
                    }
                } else {
                    // INSERT / UPDATE / DELETE
                    String testData = buildTestData(tran, xfdlInfo.dsColumns, crudType, xfdlInfo.comboColumns);
                    String expected = buildExpectedResult(crudType);
                    String utSid    = "UT_" + sourceName.toUpperCase() + "_" + String.format("%03d", sidNo);
                    Map<String, Object> s = makeScenario(no, "단위", utSid,
                        screenId, screenTitle, origin, gnbName, groupName, menuName,
                        (menuName != null && !menuName.isEmpty() ? menuName : screenTitle),
                        tran, crudType, expected, testData, xfdlInfo.dsColumns, xfdlInfo.comboColumns);
                    if (unitBtnId != null && !unitBtnId.isEmpty()) s.put("btnId", unitBtnId);
                    scenarios.add(s);
                    log(writer, "  + [no:" + no + "] " + utSid + "  " + tran.url + "  (" + crudType + ") [단위]");
                    no++;
                    sidNo++;

                    if (insertOrUpdateCall == null
                            && ("INSERT".equals(crudType) || "UPDATE".equals(crudType)
                                || "DELETE".equals(crudType))) {
                        insertOrUpdateCall = tran;
                    }
                }
            }

            // 5-2. INSERT/UPDATE가 있는 화면 → 통합 시나리오 1개 추가
            //      scenario-rules.md: "저장/처리(INSERT·UPDATE) 기능이 있는 화면에서
            //                          핵심 업무 흐름 1~2개만 작성"
            if (insertOrUpdateCall != null) {
                String crudType = classifyCrud(insertOrUpdateCall.svcId, sqlmapIndex);
                String testData = buildTestData(insertOrUpdateCall, xfdlInfo.dsColumns, crudType, xfdlInfo.comboColumns);
                String itExpected = buildIntegExpectedResult(screenTitle, crudType);
                String itSid    = "IT_" + sourceName.toUpperCase() + "_" + String.format("%03d", sidNo);

                Map<String, Object> it = makeScenario(no, "통합", itSid,
                    screenId, screenTitle, origin, gnbName, groupName, menuName,
                    (menuName != null && !menuName.isEmpty() ? menuName : screenTitle),
                    insertOrUpdateCall, crudType, itExpected, testData, xfdlInfo.dsColumns, xfdlInfo.comboColumns);

                // 실제 버튼 id 해소 — 화면마다 다른데 SpecTemplateService가 하드코딩된
                // btn_insert/btn_save/btn_delete를 가정하던 문제(저장 버튼 못 찾음/삭제인데
                // 저장 버튼으로 오인)를 막기 위해, 버튼 onclick 함수 본문에서 실제
                // gfn_tran(svcId) 호출을 추적한 svcIdToBtnMap(신뢰도 최상)을 우선 사용한다.
                Map<String, String> btnInfo = xfdlAnalysis.svcIdToBtnMap.get(insertOrUpdateCall.svcId);
                String btnId = (btnInfo != null) ? btnInfo.get("btnId") : null;
                if (btnId == null || btnId.isEmpty()) {
                    // 폴백: onclick 함수 본문 추적이 안 되면 id 패턴 휴리스틱으로 재시도
                    btnId = xfdlExtractor.findButtonBySvcId(insertOrUpdateCall.svcId, xfdlAnalysis.buttons);
                }
                if (btnId != null && !btnId.isEmpty()) {
                    it.put("btnId", btnId);
                }

                scenarios.add(it);
                log(writer, "  + [no:" + no + "] " + itSid + "  " + insertOrUpdateCall.url + "  (" + crudType + ") [통합]"
                    + (btnId != null ? "  btnId=" + btnId : "  btnId=미확인"));
                no++;
                sidNo++;
            }

            // 5-3. PUR 모듈 전용 — 업무 규칙 기반 추가 시나리오
            if ("pur".equalsIgnoreCase(prefix)) {
                List<XfdlParserService.TranCall> allCalls = xfdlInfo.tranCalls;
                for (XfdlParserService.TranCall tran : allCalls) {
                    String url  = tran.url  != null ? tran.url  : "";
                    String svc  = tran.svcId != null ? tran.svcId : "";

                    // ① 예산 잔액 체크 URL 있으면 → 예산 부족 비정상 시나리오
                    if (containsAny(url + svc, PUR_BUDG_KEYS)) {
                        no = addPurNegativeScenario(scenarios, no, sidNo, sourceName,
                            screenId, screenTitle, origin, gnbName, groupName, menuName,
                            tran, xfdlInfo.dsColumns,
                            "예산 잔액 부족 — 저장 차단",
                            "예산 잔액이 부족한 경우 CHK_OK=N과 오류 메시지(CHK_MSG)가 반환되고 저장이 차단된다.",
                            "예산 과목 조회 후 잔액 초과 금액 입력", writer);
                        sidNo++;
                        break;
                    }
                    // ② 동시성 체크 URL 있으면 → 충돌 비정상 시나리오
                    if (containsAny(url + svc, PUR_CONC_KEYS)) {
                        no = addPurNegativeScenario(scenarios, no, sidNo, sourceName,
                            screenId, screenTitle, origin, gnbName, groupName, menuName,
                            tran, xfdlInfo.dsColumns,
                            "동시 수정 충돌 — 저장 차단",
                            "다른 사용자가 먼저 수정한 경우 result=N이 반환되고 저장이 차단된다.",
                            "동일 건에 대해 두 세션에서 동시에 수정 시도", writer);
                        sidNo++;
                        break;
                    }
                }

                // ③ 결재 관련 URL 있으면 → 결재 진행 중 수정/삭제 불가 시나리오
                boolean hasApprUrl = allCalls.stream().anyMatch(t ->
                    containsAny((t.url != null ? t.url : "") + (t.svcId != null ? t.svcId : ""),
                                PUR_APPR_KEYS));
                if (hasApprUrl) {
                    XfdlParserService.TranCall apprCall = allCalls.stream()
                        .filter(t -> containsAny(
                            (t.url != null ? t.url : "") + (t.svcId != null ? t.svcId : ""),
                            PUR_APPR_KEYS))
                        .findFirst().orElse(allCalls.get(0));
                    no = addPurNegativeScenario(scenarios, no, sidNo, sourceName,
                        screenId, screenTitle, origin, gnbName, groupName, menuName,
                        apprCall, xfdlInfo.dsColumns,
                        "결재 진행 중 수정/삭제 불가",
                        "결재 진행 중(APV_STAT_CD=020)인 건은 수정·삭제 요청 시 오류 메시지가 반환된다.",
                        "결재 진행 중인 건 선택 후 수정/삭제 시도", writer);
                    sidNo++;
                }

                // ④ 삭제 URL 있으면 → 완료 건 삭제 불가 시나리오
                boolean hasDelUrl = allCalls.stream().anyMatch(t ->
                    containsAny((t.url != null ? t.url : ""),  PUR_DELETE_KEYS));
                if (hasDelUrl) {
                    XfdlParserService.TranCall delCall = allCalls.stream()
                        .filter(t -> containsAny(t.url != null ? t.url : "", PUR_DELETE_KEYS))
                        .findFirst().orElse(allCalls.get(0));
                    no = addPurNegativeScenario(scenarios, no, sidNo, sourceName,
                        screenId, screenTitle, origin, gnbName, groupName, menuName,
                        delCall, xfdlInfo.dsColumns,
                        "결재 완료/납품 완료 건 삭제 불가",
                        "결재 완료(APV_STAT_CD=030) 또는 처리 완료 상태의 건은 삭제 시 오류 메시지가 반환된다.",
                        "완료 상태 건 선택 후 삭제 시도", writer);
                    sidNo++;
                }
            }

            // 소분류(subCategory) 후주입 — makeScenario 시그니처를 건드리지 않고 이 파일에서
            // 생성된 모든 시나리오에 소분류를 채운다. (중분류=groupName은 makeScenario가 이미 설정)
            for (int _i = _scenStartIdx; _i < scenarios.size(); _i++) {
                scenarios.get(_i).put("subCategory", subCategory);
            }
        }

        return scenarios;
    }

    // ── PUR 비정상 시나리오 생성 헬퍼 ─────────────────────────────────────
    private int addPurNegativeScenario(
            List<Map<String, Object>> scenarios, int no, int sidNo, String sourceName,
            String screenId, String screenTitle, String origin,
            String gnbName, String groupName, String menuName,
            XfdlParserService.TranCall tran,
            Map<String, String> dsColumns,
            String negTitle, String negExpected, String negData,
            java.io.PrintWriter writer) {
        String sid = "IT_" + sourceName.toUpperCase() + "_" + String.format("%03d", sidNo) + "_NEG";
        Map<String, Object> neg = makeScenario(no, "비정상", sid,
            screenId, screenTitle, origin, gnbName, groupName, menuName,
            screenTitle + " — [비정상] " + negTitle,
            tran, "비정상", negExpected, negData, dsColumns);
        neg.put("preCondition", negData);
        neg.put("remark", "PUR 업무 규칙 비정상 검증");
        scenarios.add(neg);
        log(writer, "  + [no:" + no + "] " + sid + " [비정상:" + negTitle + "]");
        return no + 1;
    }

    // ── SELECT 검색조건 컬럼 감지 헬퍼 ────────────────────────────────────────

    /** _SDT / FROM_DT 와 _EDT / TO_DT 쌍을 찾는다. */
    private String[] detectDateCols(Set<String> cols) {
        String sdt = null, edt = null;
        for (String c : cols) {
            String u = c.toUpperCase();
            if (sdt == null && (u.endsWith("_SDT") || u.equals("FROM_DT"))) sdt = c;
            if (edt == null && (u.endsWith("_EDT") || u.equals("TO_DT")))   edt = c;
        }
        return (sdt != null && edt != null) ? new String[]{sdt, edt} : null;
    }

    /** APV_STAT / _STAT_CD / _STATUS 패턴의 상태 컬럼을 찾는다. */
    private String detectStatusCol(Set<String> cols) {
        for (String c : cols) {
            String u = c.toUpperCase();
            if (u.contains("APV_STAT") || u.endsWith("_STAT_CD") || u.endsWith("_STATUS")) return c;
        }
        return null;
    }

    /** SRCH_CLS / SRCH_KEY 쌍을 찾는다. */
    private String[] detectKeywordPair(Set<String> cols) {
        String cls = null, key = null;
        for (String c : cols) {
            String u = c.toUpperCase();
            if (cls == null && u.endsWith("SRCH_CLS")) cls = c;
            if (key == null && u.endsWith("SRCH_KEY")) key = c;
        }
        return (cls != null && key != null) ? new String[]{cls, key} : null;
    }

    /** _YN / ROLE_ / DEPT_CHIF 패턴의 권한 컬럼 중 첫 번째를 반환한다. */
    private String detectRoleCol(Set<String> cols) {
        for (String c : cols) {
            String u = c.toUpperCase();
            if (u.endsWith("_YN") || u.startsWith("ROLE_") || u.contains("DEPT_CHIF")) return c;
        }
        return null;
    }

    /** searchBindMap(compId→colId) + searchInputLabels(compId→label) → colId → label 역매핑 */
    private Map<String, String> buildColLabelMap(XfdlScenarioExtractor.ButtonAnalysis analysis) {
        Map<String, String> colLabelMap = new java.util.LinkedHashMap<>();
        if (analysis == null) return colLabelMap;
        Map<String, String> labels  = analysis.searchInputLabels; // compId → label
        Map<String, String> bindMap = analysis.searchBindMap;     // compId → colId
        for (Map.Entry<String, String> e : bindMap.entrySet()) {
            String compId = e.getKey();
            String colId  = e.getValue();
            String label  = labels.getOrDefault(compId, compId);
            colLabelMap.put(colId, label);
        }
        return colLabelMap;
    }

    /** colLabelMap에서 displayLabel 반환; 없으면 colId 그대로 */
    private String colLabel(String colId, Map<String, String> colLabelMap) {
        return colLabelMap.getOrDefault(colId, colId);
    }

    /** MenuResolveDao로 ROLE_YN=Y 사용자를 DB에서 조회; 실패 시 빈 문자열 */
    private String resolveRoleYnUser(String pgmId) {
        if (menuResolveDao == null || pgmId == null || pgmId.isEmpty()) return "";
        try {
            java.util.List<java.util.Map<String, Object>> users = menuResolveDao.findUsersForPgm(pgmId);
            if (users == null || users.isEmpty()) return "";
            java.util.List<String> names = new java.util.ArrayList<>();
            for (java.util.Map<String, Object> u : users) {
                Object nm = u.get("USER_NM");
                if (nm != null && !nm.toString().isEmpty()) names.add(nm.toString());
            }
            return names.isEmpty() ? "" : String.join(", ", names);
        } catch (Exception ex) {
            return "";
        }
    }

    /** 문자열 target에 keys 중 하나라도 포함되는지 검사 (대소문자 무시) */
    private boolean containsAny(String target, String[] keys) {
        String lower = target.toLowerCase();
        for (String k : keys) if (lower.contains(k.toLowerCase())) return true;
        return false;
    }


    /** 시나리오 Map 공통 생성 헬퍼 */
    private Map<String, Object> makeScenario(int no, String testType, String sid,
            String screenId, String screenTitle, String origin,
            String gnbName, String groupName, String menuName,
            String testName,
            XfdlParserService.TranCall tran,
            String crudType, String expected, String testData,
            Map<String, String> dsColumns) {
        return makeScenario(no, testType, sid, screenId, screenTitle, origin,
            gnbName, groupName, menuName, testName, tran,
            crudType, expected, testData, dsColumns, new java.util.LinkedHashMap<>());
    }

    private Map<String, Object> makeScenario(int no, String testType, String sid,
            String screenId, String screenTitle, String origin,
            String gnbName, String groupName, String menuName,
            String testName,
            XfdlParserService.TranCall tran,
            String crudType, String expected, String testData,
            Map<String, String> dsColumns,
            Map<String, String> comboColumns) {
        Map<String, Object> s = new LinkedHashMap<>();
        s.put("no",               no);
        s.put("testType",         testType);
        s.put("scenarioId",       sid);
        s.put("sourceName",       screenId.toUpperCase());
        s.put("screenId",         screenId);
        s.put("displayName",      screenTitle);
        s.put("origin",           origin);
        s.put("gnbName",          gnbName);
        s.put("groupName",        groupName);
        s.put("menuName",         menuName);
        s.put("testName",         testName);
        s.put("url",              tran.url);
        s.put("method",           "POST");
        s.put("preCondition",     buildPreCondition(screenTitle, crudType));
        s.put("expectedResult",   expected);
        s.put("relationType",     "기본");
        s.put("crudType",         crudType);
        s.put("hasGw",            false);
        s.put("affectedPrograms", new ArrayList<>());
        s.put("inputDsId",        !tran.inputDs.isEmpty()  ? tran.inputDs  : "ds_search");
        s.put("inputCols",        new ArrayList<>(dsColumns.keySet()));
        s.put("outputDsId",       !tran.outputDs.isEmpty() ? tran.outputDs : "ds_list");
        s.put("outputCols",       new ArrayList<>());
        s.put("testData",         testData);
        s.put("inputValues",      testData);   // 그리드 표기용 (testData와 동일값, 양쪽 키 모두 유지)
        s.put("testResult",       "");
        s.put("remark",           "");

        // inputSelector: 콤보 컬럼 등록 → SpecTemplateService.buildComboVariantBlocks() 에서 활용
        if (comboColumns != null && !comboColumns.isEmpty()) {
            Map<String, Map<String, String>> inputSel = new LinkedHashMap<>();
            for (Map.Entry<String, String> ce : comboColumns.entrySet()) {
                String colId   = ce.getKey();
                String codeGrp = ce.getValue();
                Map<String, String> info = new LinkedHashMap<>();
                info.put("compType", "Combo");
                info.put("compId",   "cbo_" + colId.toLowerCase());  // 컴포넌트 ID 규칙: cbo_소문자열
                info.put("codeDiv",  codeGrp);
                inputSel.put(colId, info);
            }
            s.put("inputSelector", inputSel);
            System.out.println("[makeScenario] inputSelector(Combo) 등록: " + inputSel.keySet());
        }

        System.out.println("[makeScenario] sid=" + sid
            + "  crudType=" + crudType
            + "  testData=\"" + testData + "\""
            + "  inputValues=\"" + testData + "\"");
        return s;
    }

    // ============================================================
    // CRUD 분류
    // ============================================================

    /**
     * CRUD 분류 — 3단계 우선순위
     * 1) sqlmap ID 직접 매칭
     * 2) URL 경로 기반 (URL에서 추출한 메서드명 → 패턴 매칭) ← 가장 신뢰성 높음
     * 3) svcId 접두사 기반 (변수 svcId의 경우 URL에서 추출된 메서드명 사용)
     */
    public String classifyCrud(String svcId, Map<String, String> sqlmapIndex) {
        return classifyCrud(svcId, null, sqlmapIndex);
    }

    public String classifyCrud(String svcId, String url, Map<String, String> sqlmapIndex) {
        // 1순위: sqlmap 직접 매칭
        if (sqlmapIndex.containsKey(svcId.toLowerCase())) {
            return sqlmapIndex.get(svcId.toLowerCase());
        }

        // 2순위: URL 기반 (URL에서 .do 직전 메서드명 추출 후 패턴 매칭)
        String methodFromUrl = (url != null && !url.isEmpty())
            ? xfdlParser.extractMethodFromUrl(url) : "";
        if (!methodFromUrl.isEmpty()) {
            String crud = classifyByName(methodFromUrl);
            if (!"SELECT".equals(crud) || methodFromUrl.toLowerCase().startsWith("get")
                    || methodFromUrl.toLowerCase().startsWith("list")) {
                return crud;
            }
        }

        // 3순위: svcId 자체 패턴
        return classifyByName(svcId);
    }

    private String classifyByName(String name) {
        String lower = name.toLowerCase();
        if (startsWith(lower, DELETE_PFX)) return "DELETE";
        if (startsWith(lower, INSERT_PFX)) return "INSERT";
        if (startsWith(lower, UPDATE_PFX)) return "UPDATE";
        if (startsWith(lower, SELECT_PFX)) return "SELECT";
        // set*, proc* → INSERT (upsert)
        if (lower.startsWith("set") || lower.startsWith("proc") || lower.startsWith("copy")) return "INSERT";
        // upt* → UPDATE
        if (lower.startsWith("upt")) return "UPDATE";
        return "SELECT";
    }

    private boolean startsWith(String s, String[] prefixes) {
        for (String p : prefixes) if (s.startsWith(p)) return true;
        return false;
    }

    // ============================================================
    // 시나리오흐름(preCondition) 생성
    // ============================================================

    public String buildPreCondition(String screenTitle, String crudType) {
        String t = (screenTitle != null && !screenTitle.isEmpty()) ? screenTitle : "화면";
        switch (crudType) {
            case "INSERT":
                return t + " 메뉴를 클릭하여 화면으로 이동한다."
                     + " > [조회] 버튼을 클릭하여 현재 목록을 확인한다."
                     + " > [신규] 버튼을 클릭하여 입력 폼을 활성화한다."
                     + " > 필수 항목(이름, 날짜, 코드 등)을 입력한다."
                     + " > [저장] 버튼을 클릭하여 데이터를 저장한다."
                     + " > 저장 완료 메시지(result=S) 확인 후 목록에 데이터가 반영된다.";
            case "UPDATE":
                return t + " 메뉴를 클릭하여 화면으로 이동한다."
                     + " > [조회] 버튼을 클릭하여 수정할 항목을 조회한다."
                     + " > 목록에서 수정 대상 행을 선택한다."
                     + " > 변경할 항목의 값을 수정한다."
                     + " > [저장] 버튼을 클릭하여 수정 내용을 저장한다."
                     + " > 저장 완료 메시지(result=S) 확인 후 수정된 값이 목록에 반영된다.";
            case "DELETE":
                return t + " 메뉴를 클릭하여 화면으로 이동한다."
                     + " > [조회] 버튼을 클릭하여 삭제할 항목을 조회한다."
                     + " > 목록에서 삭제 대상 행을 선택(체크)한다."
                     + " > [삭제] 버튼을 클릭하고 확인 다이얼로그에서 확인한다."
                     + " > 삭제 완료 메시지(result=S) 확인 후 목록에서 해당 항목이 제거된다.";
            default: // SELECT
                return t + " 메뉴를 클릭하여 화면으로 이동한다."
                     + " > 검색 조건(기간, 상태 등)을 입력한다."
                     + " > [조회] 버튼을 클릭하여 목록을 조회한다."
                     + " > 조회 결과가 그리드에 정상적으로 표시된다.";
        }
    }

    // ============================================================
    // testData 생성
    // ============================================================

    public String buildTestData(XfdlParserService.TranCall tran,
                                 Map<String, String> dsColumns, String crudType) {
        return buildTestData(tran, dsColumns, crudType, new java.util.LinkedHashMap<>());
    }

    public String buildTestData(XfdlParserService.TranCall tran,
                                 Map<String, String> dsColumns, String crudType,
                                 Map<String, String> comboColumns) {
        System.out.println("[buildTestData] 진입 — url=" + (tran != null ? tran.url : "null")
            + "  crudType=" + crudType
            + "  dsColumns.size=" + dsColumns.size()
            + "  dsColumns.keys=" + dsColumns.keySet()
            + "  comboColumns=" + comboColumns);

        if (dsColumns.isEmpty()) {
            String fallback = "SELECT".equals(crudType) ? "기본 조회 조건 사용" : "";
            System.out.println("[buildTestData] dsColumns 비어있음 → \"" + fallback + "\"");
            return fallback;
        }

        LocalDate today     = LocalDate.now();
        // yyyyMMdd 형식 사용 — Nexacro 날짜 컴포넌트 입력값 기준
        String    todayStr  = String.format("%04d%02d%02d",
                                  today.getYear(), today.getMonthValue(), today.getDayOfMonth());
        String    yearStart = today.getYear() + "0101";

        List<String> parts = new ArrayList<>();
        boolean isWrite = "INSERT".equals(crudType) || "UPDATE".equals(crudType);
        boolean isSelect = "SELECT".equals(crudType);

        for (Map.Entry<String, String> e : dsColumns.entrySet()) {
            String col  = e.getKey().toUpperCase();
            String type = e.getValue().toUpperCase();

            // ── ① 날짜 컬럼 (SELECT 포함 항상 적용) ─────────────────────
            // 실제 PUR 컬럼 패턴 기준:
            //   시작일: _SDT, _FRM_DT 접미사
            //   종료일: _EDT, _TO_DT 접미사
            //   단순날짜: _DT 접미사, DATE 포함
            if (col.endsWith("_SDT") || col.endsWith("_FRM_DT")) {
                parts.add(col + "=YEAR_START");
                continue;
            }
            if (col.endsWith("_EDT") || col.endsWith("_TO_DT")) {
                parts.add(col + "=TODAY");
                continue;
            }
            if (col.endsWith("_DT") || col.contains("DATE")) {
                parts.add(col + "=TODAY");
                continue;
            }

            // ── ② 콤보 컬럼 — comboColumns 직접 매핑 우선, 없으면 패턴 fallback ─
            // SELECT에서도 검색조건 콤보값이 필요하므로 항상 적용
            if (comboColumns.containsKey(col)) {
                parts.add(col + "=01");  // 코드그룹 첫 번째 코드값 placeholder
                continue;
            }
            if (col.endsWith("_CLS") || col.endsWith("_GBN") || col.endsWith("_TP")
                    || col.endsWith("_GFG") || col.endsWith("_FG")) {
                parts.add(col + "=01");
                continue;
            }

            // ── ③ YN / FLAG / CHK 컬럼 (항상 적용) ─────────────────────
            if (col.endsWith("_YN") || col.endsWith("_FLAG") || col.endsWith("_CHK")) {
                parts.add(col + "=Y");
                continue;
            }

            // ── 이하는 INSERT/UPDATE에서만 적용 ─────────────────────────
            if (!isWrite) continue;

            // ── ④ 금액/수량/비율 ─────────────────────────────────────
            if (col.endsWith("_AMT")) {
                parts.add(col + "=10000");
                continue;
            }
            if (col.endsWith("_RATE")) {
                parts.add(col + "=0.1");
                continue;
            }
            if (col.matches(".*(QTY|CNT|NUM|PRICE).*")
                    || type.matches(".*(DECIMAL|INT|LONG|BIGDECIMAL).*")) {
                parts.add(col + "=1");
                continue;
            }

            // ── ⑤ NO / SEQ — 참조 키 ────────────────────────────────
            if (col.endsWith("_NO") || col.endsWith("_SEQ") || col.endsWith("_SQ")) {
                parts.add(col + "=1");
                continue;
            }

            // ── ⑥ 텍스트 명칭 ───────────────────────────────────────
            if (type.matches(".*(STRING|CHAR|VARCHAR).*")
                    && col.matches(".*(NM|NAME|RMK|MEMO|CONT|REMARK|SBJ|TITLE|DESC).*")) {
                String textVal;
                if      (col.matches(".*(_NM|_NAME).*"))  textVal = "테스트명칭";
                else if (col.matches(".*(_TITLE|_SBJ).*")) textVal = "테스트제목";
                else if (col.matches(".*(_MEMO|_CONT|_CONT_.*|_DESC).*")) textVal = "테스트 내용 입력";
                else if (col.matches(".*(_RMK|_REMARK).*")) textVal = "테스트 비고";
                else textVal = "테스트입력값";
                parts.add(col + "=" + textVal);
            }
        }

        String result;
        if (parts.isEmpty()) {
            result = isSelect ? "기본 조회 조건 사용" : "";
        } else {
            result = String.join("; ", parts);
        }
        System.out.println("[buildTestData] 결과 → \"" + result + "\"");
        return result;
    }

    // ============================================================
    // 예상 결과 메시지
    // ============================================================

    public String buildExpectedResult(String crudType) {
        switch (crudType) {
            case "INSERT": return "HTTP 200 · result=S · 신규 데이터가 목록에 1건 이상 추가되어 조회된다.";
            case "UPDATE": return "HTTP 200 · result=S · 수정된 값이 목록·상세 화면에 즉시 반영된다.";
            case "DELETE": return "HTTP 200 · result=S · 삭제 대상 항목이 목록에서 제거되고 재조회 시 표시되지 않는다.";
            default:       return "HTTP 200 · result=S · 검색 조건에 해당하는 데이터가 그리드에 1건 이상 조회된다.";
        }
    }

    /** 통합 테스트 예상결과 — 타 프로그램 영향도 검증 관점 */
    public String buildIntegExpectedResult(String screenTitle, String crudType) {
        switch (crudType) {
            case "INSERT":
                return "HTTP 200 · result=S · " + screenTitle + "에서 저장한 데이터가 목록·상세 화면에 즉시 반영되고, 연관 모듈에서도 정상 조회된다.";
            case "UPDATE":
                return "HTTP 200 · result=S · " + screenTitle + "에서 수정한 값이 관련 화면에 반영되고, 수정 전 데이터는 더 이상 표시되지 않는다.";
            case "DELETE":
                return "HTTP 200 · result=S · " + screenTitle + "에서 삭제한 항목이 관련 목록에서 제거되고 재조회 시 표시되지 않는다.";
            default:
                return "HTTP 200 · result=S · " + screenTitle + "의 처리 결과가 관련 프로그램에 정상 반영된다.";
        }
    }

    // ============================================================
    // 유틸
    // ============================================================

    /** "GNB > Group > Menu" → [gnb, group, menu] */
    // 반환: [gnbName, groupName(중분류), subCategory(소분류), menuName(메뉴명)]
    // MenuResolverService.enrichMenuParts(§L211-213)와 동일 규칙 — 화면 그리드의
    //   중분류=groupName / 소분류=subCategory / 메뉴명=menuName 컬럼 표기를 정합화한다.
    //   2개 : gnb=p[0], group="",   sub="",       menu=p[1]
    //   3개 : gnb=p[0], group=p[0], sub=p[1],     menu=p[2]   (예: 구매관리>구매요구>직접구매지급신청)
    //   4개+: gnb=p[0], group=p[1], sub=p[len-2], menu=p[len-1]
    private String[] parseMenuPath(String path) {
        if (path == null || path.isEmpty()) return new String[]{"","","",""};
        String[] p = path.split("\\s*>\\s*");
        for (int i = 0; i < p.length; i++) p[i] = p[i].trim();
        if (p.length >= 4) return new String[]{p[0], p[1], p[p.length-2], p[p.length-1]};
        if (p.length == 3) return new String[]{p[0], p[0], p[1], p[2]};
        if (p.length == 2) return new String[]{p[0], "", "", p[1]};
        return new String[]{p[0], "", "", p[0]};  // 1노드: 통합(XfdlScenarioExtractor)과 동일하게 gnb=menu=node[0]
    }

    /** xfdl 탐색용 이름으로 정규화: .java/.xfdl.js 제거, Controller/ServiceImpl 등 suffix 제거 → 대문자 */
    public static String normalizeSourceName(String displayName) {
        String name = displayName.replaceAll("\\s*\\([^)]+\\)\\s*$", "").trim();
        if (name.toLowerCase().endsWith(".java")) {
            name = name.substring(0, name.length() - 5);
            name = name.replaceAll("(?i)(Controller|ServiceImpl|Service|DaoImpl|Dao|Impl)$", "");
        } else if (name.toLowerCase().endsWith(".xfdl.js")) {
            name = name.substring(0, name.length() - 8);
        } else {
            name = name.replaceAll("(?i)\\.xfdl$", "");
        }
        return name.toUpperCase();
    }

    /** pgmId 추출 (메뉴 DB 조회용 — 말미 단일 접미자 추가 제거) */
    private String extractPgmId(String displayName) {
        String normalized = normalizeSourceName(displayName);
        String raw = displayName.replaceAll("\\s*\\([^)]+\\)\\s*$", "").trim();
        if (raw.toLowerCase().endsWith(".java")) {
            normalized = normalized.replaceAll("[A-Za-z]$", "");
        }
        return normalized.toUpperCase();
    }

    private String str(Map<String, Object> m, String key) {
        Object v = m.get(key);
        return v != null ? String.valueOf(v) : "";
    }

    private void log(java.io.PrintWriter writer, String msg) {
        if (writer != null) SseHelper.sseLog(writer, msg);
    }

    // ============================================================
    // Python 패턴 파일 로더 (pur_patterns.json → 시나리오 보강)
    // ============================================================

    /**
     * analyze_pur_patterns.py 가 생성한 pur_patterns.json 을 읽어
     * 각 시나리오의 screenType, hasGw, hasApproval, calledBy, outCols 등을 보강한다.
     * 파일이 없으면 조용히 무시한다.
     */
    public void enrichFromPurPatterns(List<Map<String, Object>> scenarios,
                                       java.io.File patternsJson,
                                       java.io.PrintWriter writer) {
        if (patternsJson == null || !patternsJson.exists()) {
            log(writer, "[PurPatterns] pur_patterns.json 없음 — 패턴 보강 건너뜀");
            return;
        }
        try {
            String json = FilePathHelper.readFileSafe(patternsJson);
            if (json.isEmpty()) return;

            // 가볍게 직접 파싱 (외부 JSON 라이브러리 없이)
            // "screens": { "PUR_5110M": { "screenType": "...", "hasGw": ..., ... } }
            log(writer, "[PurPatterns] " + patternsJson.getName() + " 로드 완료 — 시나리오 보강 중...");
            int enriched = 0;
            for (Map<String, Object> s : scenarios) {
                String srcName = str(s, "sourceName").toUpperCase();
                if (srcName.isEmpty()) continue;
                // pgmId 형식으로 변환: PUR_5110M 형태 추출
                java.util.regex.Matcher m = java.util.regex.Pattern
                    .compile("\"" + java.util.regex.Pattern.quote(srcName) + "\"\\s*:\\s*\\{([^}]+)}")
                    .matcher(json);
                if (!m.find()) continue;
                String block = m.group(1);

                // screenType 보강
                String screenType = extractJsonStr(block, "screenType");
                if (!screenType.isEmpty() && !s.containsKey("screenType"))
                    s.put("screenType", screenType);

                // hasGw/hasApproval 보강
                if (block.contains("\"hasGw\":true"))   s.put("hasGw", Boolean.TRUE);
                if (block.contains("\"hasApproval\":true")) s.put("hasApproval", Boolean.TRUE);

                enriched++;
            }
            log(writer, "[PurPatterns] 보강 완료: " + enriched + "건");
        } catch (Exception e) {
            log(writer, "[PurPatterns] 로드 오류: " + e.getMessage());
        }
    }

    /** JSON 블록에서 단순 문자열 값 추출: "key":"value" → value */
    private String extractJsonStr(String block, String key) {
        java.util.regex.Matcher m = java.util.regex.Pattern
            .compile("\"" + key + "\"\\s*:\\s*\"([^\"]+)\"")
            .matcher(block);
        return m.find() ? m.group(1) : "";
    }
}
