package cres.pss.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import org.springframework.stereotype.Service;

/**
 * spec.ts 템플릿 생성 서비스 (spec-rules.md 준수)
 *
 * 통합 테스트 (_inte.spec.ts):
 *   - MDIWORK + frame.evaluate() + navigateTo + clickMainFormButton + waitForResponse
 *   - TC001(메인), TC002(메뉴), TC003(화면로드) + 시나리오 TC
 *
 * 단위 테스트 (_unit.spec.ts):
 *   - nexacroXml() + apiPost() 직접 API 호출
 *   - pgmId = sourceName (CSRF 검증용)
 */
@Service
public class SpecTemplateService {

    // ──────────────────────────────────────────────────────────────────────
    // PUBLIC: 통합 spec.ts 생성
    // ──────────────────────────────────────────────────────────────────────

    /** screenUrl 없는 하위 호환 오버로드 */
    public String generateIntegSpec(List<Map<String, Object>> scenarios,
                                     String prefix, String specFileName) {
        return generateIntegSpec(scenarios, prefix, specFileName, "", "", false);
    }

    public String generateIntegSpec(List<Map<String, Object>> scenarios,
                                     String prefix, String specFileName, String screenUrl) {
        return generateIntegSpec(scenarios, prefix, specFileName, screenUrl, "", false);
    }

    public String generateIntegSpec(List<Map<String, Object>> scenarios,
                                     String prefix, String specFileName, String screenUrl,
                                     String creatorName) {
        return generateIntegSpec(scenarios, prefix, specFileName, screenUrl, creatorName, false);
    }

    /**
     * @param singleRowMode true이면 TC001~TC004 보일러플레이트 생략, 시나리오 TC만 생성
     *                      ([테스트] 버튼으로 단일 행 실행 시 사용)
     */
    public String generateIntegSpec(List<Map<String, Object>> scenarios,
                                     String prefix, String specFileName, String screenUrl,
                                     String creatorName, boolean singleRowMode) {
        if (scenarios == null || scenarios.isEmpty()) return "";

        // 시나리오 그룹화 (화면 단위로 함수 분리)
        Map<String, List<Map<String, Object>>> groups = groupByScreen(scenarios);
        Map.Entry<String, List<Map<String, Object>>> first = groups.entrySet().iterator().next();
        Map<String, Object> ref  = first.getValue().get(0);

        String screenId    = first.getKey();
        if ("unknown".equals(screenId)) screenId = extractScreenFromUrl(str(ref, "url"));
        String screenTitle = str(ref, "displayName");
        if (screenTitle.isEmpty()) screenTitle = str(ref, "menuName");
        if (screenTitle.isEmpty()) screenTitle = screenId;
        String gnbName     = str(ref, "gnbName");
        String midCategory = str(ref, "midCategory");  // 중분류 표시용 (GROUP_NM)
        if (midCategory.isEmpty()) midCategory = str(ref, "groupName");
        if (midCategory.isEmpty()) midCategory = str(ref, "category");
        String subCategory = str(ref, "subCategory");  // 소분류 표시용 (SUB_NM)
        String menuName    = str(ref, "menuName");
        if (menuName.isEmpty()) menuName = str(ref, "displayName");
        if (menuName.isEmpty()) menuName = screenTitle;

        // menuPath 파싱
        // 표시: 3개 → 중분류=parts[0], 소분류=parts[1] / 4개+ → 중분류=parts[1], 소분류=parts[len-2]
        // 네비: 3개 → GROUP_MENU=parts[1], SUB_MENU="" / 4개+ → GROUP_MENU=parts[1], SUB_MENU=parts[len-2]
        String menuPath = str(ref, "menuPath");
        String navGroup = "";  // spec.ts GROUP_MENU (네비게이션용)
        String navSub   = "";  // spec.ts SUB_MENU   (네비게이션용)
        if (!menuPath.isEmpty()) {
            String[] parts = menuPath.split("\\s*[>/]\\s*");
            List<String> ps = new ArrayList<>();
            for (String p : parts) { String t = p.trim(); if (!t.isEmpty()) ps.add(t); }
            if (ps.size() >= 2) {
                if (gnbName.isEmpty()) gnbName = ps.get(0);
                if (ps.size() == 3) {
                    // 3노드: 중분류=parts[0], 소분류=parts[1]
                    if (midCategory.isEmpty()) midCategory = ps.get(0);
                    if (subCategory.isEmpty()) subCategory = ps.get(1);
                    navGroup = ps.get(1);   // 네비: parts[1] 클릭
                } else if (ps.size() >= 4) {
                    // 4노드+: 중분류=parts[1], 소분류=parts[len-2]
                    if (midCategory.isEmpty()) midCategory = ps.get(1);
                    if (subCategory.isEmpty()) subCategory = ps.get(ps.size() - 2);
                    navGroup = ps.get(1);
                    navSub   = ps.get(ps.size() - 2);
                }
                if (menuName.isEmpty() || menuName.equals(screenTitle)) menuName = ps.get(ps.size() - 1);
            }
        }
        // menuPath 없을 때 네비 폴백
        if (navGroup.isEmpty()) navGroup = subCategory.isEmpty() ? midCategory : subCategory;
        if (navSub.isEmpty()  ) navSub   = subCategory.isEmpty() ? "" : (midCategory.equals(gnbName) ? "" : subCategory);
        String sourceName = str(ref, "sourceName");
        // sourceName이 순수 숫자나 4자리 이하면 pgmId로 부적합 → URL에서 재추출
        if (sourceName.isEmpty() || sourceName.matches("\\d{1,4}")) {
            String fromUrl = extractScreenFromUrl(str(ref, "url"));
            sourceName = fromUrl.isEmpty() ? screenId.toUpperCase() : fromUrl;
        }
        // DB에서 조회된 실제 MENU_ID (enrichMenuParts에서 SYS_MENU_MGT 조회 결과)
        String dbMenuId = str(ref, "menuId");

        String today          = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        String funcName       = toFuncName(screenId);
        // 스크린샷 파일명 접두사: 밑줄·특수문자 제거 소문자 (예: pur_5110M → pur5110m)
        String screenshotPfx  = screenId.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();

        StringBuilder sb = new StringBuilder();

        // ── 1. imports + 상수 ──────────────────────────────────────────────
        sb.append(buildIntegImports(screenTitle, prefix, specFileName, today, creatorName));

        // ── 2. 공유 상태 변수 (TC 간 세션·프레임 공유) ───────────────────
        sb.append("\n// TC 간 공유 상태 — beforeAll에서 1회 세션 로그인 + 메뉴 진입 후 재사용\n");
        sb.append("let sharedFrame: Frame | null = null;\n");
        if (hasCrud(scenarios, "INSERT") || hasCrud(scenarios, "UPDATE")) {
            sb.append("let savedRecordKey = '';  // INSERT TC → DELETE TC 키 전달\n");
        }

        // ── 3. 헬퍼 함수 ──────────────────────────────────────────────────
        sb.append(buildIsLoadedFn(funcName, screenId, scenarios));
        sb.append(buildWaitForFn(funcName));
        sb.append(buildWaitForNexacroFrameFn());
        sb.append(buildNavigateToFn(funcName, screenTitle, gnbName, navGroup, navSub, menuName, screenUrl, sourceName, dbMenuId));
        sb.append(buildClickMainFormButtonFn());
        sb.append(buildSetSearchColumnFn());
        sb.append(buildSetComponentValueFn());
        sb.append(buildGetComboValueFn());
        sb.append(buildGetComboItemsFn());
        sb.append(buildGetListRowCountFn());
        sb.append(buildWaitForAutoSearchFn());
        sb.append(buildWaitForNexacroPopupFn());
        sb.append(buildClickDivSearchButtonFn());
        sb.append(buildGetDivSearchValueFn());
        sb.append(buildWaitForPopupComponentFn());

        // ── 4. test.describe ──────────────────────────────────────────────
        sb.append("\n// ============================================================================\n");
        sb.append("// [").append(esc(screenId)).append("] 통합 테스트 - ").append(esc(screenTitle)).append("\n");
        sb.append("// ============================================================================\n");
        sb.append("test.describe('통합 테스트 - ").append(esc(screenTitle))
          .append(" (").append(esc(screenId)).append(")', () => {\n\n");

        // beforeAll: 세션 로그인 + 최초 메뉴 접근 1회
        sb.append("  // ── 세션 로그인 + 최초 메뉴 접근은 1회만 수행 ──────────────────────\n");
        sb.append("  // workerPage 픽스처는 Worker 범위로 공유됨 — 모든 TC가 같은 page 인스턴스 사용\n");
        sb.append("  test.beforeAll(async ({ workerPage: page }) => {\n");
        sb.append("    // dialog 자동 수락 — 전체 수명 동안 1회만 등록\n");
        sb.append("    const dialogPauseMs = parseInt(process.env.DIALOG_PAUSE_MS ?? '800');\n");
        sb.append("    page.on('dialog', async (dialog) => {\n");
        sb.append("      console.log(`  [DIALOG] ${dialog.message()}`);\n");
        sb.append("      if (dialogPauseMs > 0) await new Promise(r => setTimeout(r, dialogPauseMs));\n");
        sb.append("      try { await dialog.accept(); } catch { /* 이미 처리된 dialog 무시 */ }\n");
        sb.append("    });\n\n");
        sb.append("    // ── 1회 로그인 + 메인 화면 이동 ────────────────────────────────\n");
        sb.append("    logInput('접속 URL', CONFIG.indexUrl);\n\n");
        sb.append("    await page.goto(CONFIG.indexUrl);\n");
        sb.append("    await page.waitForLoadState('domcontentloaded');\n");
        sb.append("    await page.waitForTimeout(2000);\n\n");
        sb.append("    // ── 최초 메뉴 접근 + sharedFrame 획득 ──────────────────────────\n");
        sb.append("    logAction('").append(funcName).append(" 화면 최초 진입');\n");
        sb.append("    sharedFrame = await navigateTo").append(funcName).append("(page);\n");
        sb.append("    logResult('").append(funcName).append(" Frame 획득', sharedFrame !== null, true);\n");
        sb.append("  });\n\n");
        sb.append("  test.afterAll(() => { flushLogs(); });\n\n");

        // TC001~TC004 보일러플레이트 — singleRowMode([테스트] 버튼 단일 실행)에서는 생략
        int tcNo;
        if (singleRowMode) {
            // 단일 행 테스트: 지정된 시나리오 TC만 생성 (TC001부터 번호 부여)
            tcNo = 1;
        } else {
            sb.append(buildTc001(screenTitle, screenshotPfx));
            sb.append(buildTc002(funcName, menuName, gnbName, screenshotPfx));
            sb.append(buildTc003(funcName, screenTitle, screenshotPfx));
            sb.append(buildTc004(funcName, screenshotPfx));
            sb.append(buildTcSearchClick(funcName, screenshotPfx));
            sb.append(buildTcOptionalButton(screenshotPfx));
            tcNo = 7;
        }

        // 시나리오 TC — UT_ 접두사(단위 전용)가 아닌 것은 모두 통합 spec에 포함
        // testType 필드 대신 scenarioId 접두사를 기준으로 판별 (ScenarioBuilderService가 모두 "단위"로 설정하는 문제 회피)
        for (Map<String, Object> s : scenarios) {
            if (str(s, "scenarioId").toUpperCase().startsWith("UT")) continue;
            sb.append(buildIntegTcBlock(s, funcName, tcNo, screenshotPfx));
            tcNo++;
        }

        // ── ComboBox 분기 시나리오 (inputSelector에 Combo 컴포넌트가 있는 경우)
        sb.append(buildComboVariantBlocks(scenarios, funcName, screenshotPfx));

        sb.append("});\n");
        return sb.toString();
    }

    // ──────────────────────────────────────────────────────────────────────
    // PUBLIC: 단위 spec.ts 생성
    // ──────────────────────────────────────────────────────────────────────

    public String generateUnitSpec(List<Map<String, Object>> scenarios,
                                    String prefix, String specFileName) {
        return generateUnitSpec(scenarios, prefix, specFileName, "");
    }

    public String generateUnitSpec(List<Map<String, Object>> scenarios,
                                    String prefix, String specFileName, String creatorName) {
        if (scenarios == null || scenarios.isEmpty()) return "";

        Map<String, Object> ref  = scenarios.get(0);
        String screenId    = str(ref, "screenId");
        if (screenId.isEmpty()) screenId = extractScreenFromUrl(str(ref, "url"));
        String screenTitle = str(ref, "displayName");
        if (screenTitle.isEmpty()) screenTitle = str(ref, "menuName");
        if (screenTitle.isEmpty()) screenTitle = screenId;
        String sourceName  = str(ref, "sourceName");
        if (sourceName.isEmpty() || sourceName.matches("\\d{1,4}")) {
            String fromUrl = extractScreenFromUrl(str(ref, "url"));
            sourceName = fromUrl.isEmpty() ? screenId.toUpperCase() : fromUrl;
        }

        String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);

        // ── INSERT→DELETE 키 체이닝 감지 ──────────────────────────────────────
        String unitSharedKeyCol = "";
        for (Map<String, Object> s : scenarios) {
            if ("단위".equals(str(s, "testType"))) {
                String k = str(s, "returnsKeyCol");
                if (!k.isEmpty()) { unitSharedKeyCol = k; break; }
            }
        }

        StringBuilder sb = new StringBuilder();
        sb.append(buildUnitImports(screenTitle, prefix, specFileName, today, creatorName));

        if (!unitSharedKeyCol.isEmpty()) {
            sb.append("\n// INSERT TC → DELETE TC 키 공유 — TC 간 ").append(unitSharedKeyCol).append(" 전달\n");
            sb.append("let savedKey = ''; // setData 채번 후 저장, delData에서 사용\n");
        }

        sb.append("\n// ── Nexacro XML 요청 본문 생성 ──────────────────────────────\n");
        sb.append(buildNexacroXmlFn());
        sb.append(buildApiPostFn());

        sb.append("\ntest.describe('").append(esc(screenTitle)).append(" 단위 테스트', () => {\n");
        sb.append("  test.beforeAll(async () => {\n");
        sb.append("    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });\n");
        sb.append("  });\n");
        sb.append("  test.afterAll(() => { flushLogs(); });\n\n");

        for (Map<String, Object> s : scenarios) {
            if (!"단위".equals(str(s, "testType"))) continue;
            sb.append(buildUnitTcBlock(s, sourceName));
        }

        sb.append("});\n");
        return sb.toString();
    }

    // ──────────────────────────────────────────────────────────────────────
    // imports + 상수
    // ──────────────────────────────────────────────────────────────────────

    private String buildIntegImports(String screenTitle, String prefix,
                                      String specFileName, String today, String creatorName) {
        String creatorLine = (creatorName != null && !creatorName.trim().isEmpty())
            ? "// 생성자: " + cmt(creatorName.trim()) + "\n" : "";
        return "// ==============================================================\n" +
               "// " + prefix.toUpperCase() + " — " + cmt(screenTitle) + " 통합 테스트\n" +
               "// 생성일시: " + today + "  |  파일: " + cmt(specFileName) + "\n" +
               creatorLine +
               "// ==============================================================\n" +
               "import { test, expect } from '../fixtures';\n" +
               "import type { Page, Frame } from '@playwright/test';\n" +
               "import * as fs from 'fs';\n" +
               "import {\n" +
               "  logInput, logAction, logResult, logInfo, logTestStart, flushLogs,\n" +
               "} from '../utils/test-logger';\n" +
               "import { assertNexacroResponse, parseNexacroXmlRows, openMenuById, openMenuByPgm } from '../utils/nexacro-helper';\n" +
               "\n" +
               "const BASE_URL       = process.env.APP_BASE_URL      ?? '';\n" +
               "const SYSTEM_ID      = process.env.APP_SYSTEM_ID    ?? '';\n" +
               "const CTX_PATH       = process.env.APP_CONTEXT_PATH ?? 'gprooneis';\n" +
               "const CONFIG = {\n" +
               "  baseUrl:        BASE_URL,\n" +
               "  indexUrl:       `${BASE_URL}/nxui/${CTX_PATH}/index.jsp?UPP_MENU_ID=M_${SYSTEM_ID}`,\n" +
               "  defaultTimeout: 15000,\n" +
               "};\n" +
               "const SCREENSHOT_DIR = 'test-results/screenshots';\n";
    }

    private String buildUnitImports(String screenTitle, String prefix,
                                     String specFileName, String today, String creatorName) {
        String creatorLine = (creatorName != null && !creatorName.trim().isEmpty())
            ? "// 생성자: " + cmt(creatorName.trim()) + "\n" : "";
        return "// ==============================================================\n" +
               "// " + prefix.toUpperCase() + " — " + cmt(screenTitle) + " 단위 테스트\n" +
               "// 생성일시: " + today + "  |  파일: " + cmt(specFileName) + "\n" +
               creatorLine +
               "// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지\n" +
               "// ==============================================================\n" +
               "import { test, expect } from '../fixtures';\n" +
               "import type { Page } from '@playwright/test';\n" +
               "import * as fs from 'fs';\n" +
               "import {\n" +
               "  logInput, logAction, logResult, logTestStart, flushLogs,\n" +
               "} from '../utils/test-logger';\n" +
               "import {\n" +
               "  assertNexacroResponse, parseNexacroXmlRows,\n" +
               "  waitForNexacroAppReady, openMenuById, openMenuByPgm,\n" +
               "  setNexacroComponentValue, getNexacroComponentValue,\n" +
               "  triggerNexacroButton, selectNexacroRowByKey,\n" +
               "} from '../utils/nexacro-helper';\n" +
               "\n" +
               "const BASE_URL       = process.env.APP_BASE_URL  ?? '';\n" +
               "const SCREENSHOT_DIR = 'test-results/screenshots';\n";
    }

    // ──────────────────────────────────────────────────────────────────────
    // 헬퍼 함수 생성
    // ──────────────────────────────────────────────────────────────────────

    private String buildIsLoadedFn(String funcName, String screenId,
                                    List<Map<String, Object>> scenarios) {
        // 고유 컴포넌트 조건: btn_search는 공통, 화면 고유 버튼/그리드 추가
        String uniqueCheck = extractUniqueComponentCheck(scenarios);
        return "\n/** " + funcName + " 화면 로드 확인 — 고유 컴포넌트 포함 체크 */\n" +
               "async function is" + funcName + "Loaded(frame: Frame): Promise<boolean> {\n" +
               "  return await frame.evaluate(() => {\n" +
               "    try {\n" +
               "      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n" +
               "      if (!mdi) return false;\n" +
               "      for (let i = 0; i < mdi.frames?.length; i++) {\n" +
               "        const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n" +
               "        if (\n" +
               "          wf?.btn_search !== undefined &&\n" +
               "          wf?.ds_list    !== undefined" +
               uniqueCheck + "\n" +
               "        ) return true;\n" +
               "      }\n" +
               "      return false;\n" +
               "    } catch { return false; }\n" +
               "  }).catch(() => false);\n" +
               "}\n";
    }

    private String extractUniqueComponentCheck(List<Map<String, Object>> scenarios) {
        // sourceName에서 추가 컴포넌트 추론:
        //   - outputDsId가 있으면 → Grid01 체크 (목록 화면 공통)
        //   - crudType에 INSERT/UPDATE/DELETE 포함 → btn_save / btn_delete 체크
        //   - 신청(registration) 계열 화면 → btn_registration 체크
        StringBuilder checks = new StringBuilder();
        boolean hasGrid = false;
        boolean hasSave = false;
        boolean hasRegistration = false;

        for (Map<String, Object> s : scenarios) {
            String outputDsId = str(s, "outputDsId");
            String crudType   = str(s, "crudType").toUpperCase();
            String sourceName = str(s, "sourceName").toUpperCase();

            if (!outputDsId.isEmpty() && !hasGrid) {
                checks.append(" &&\n          wf?.Grid01           !== undefined");
                hasGrid = true;
            }
            if ((crudType.contains("INSERT") || crudType.contains("UPDATE") || crudType.contains("SAVE")) && !hasSave) {
                checks.append(" &&\n          wf?.btn_save         !== undefined");
                hasSave = true;
            }
            // sourceName에 5110~5116처럼 MRO 계열이면 btn_registration 추가
            if (!hasRegistration && sourceName.matches(".*5[12]\\d{2}.*")) {
                checks.append(" &&\n          wf?.btn_registration !== undefined");
                hasRegistration = true;
            }
        }

        if (checks.length() == 0)
            return " // TODO: 화면 고유 컴포넌트 추가 (xfdl 확인 후 기재)";
        return checks.toString();
    }

    private String buildWaitForFn(String funcName) {
        return "\n/** " + funcName + " 화면 로드 polling 대기 */\n" +
               "async function waitFor" + funcName + "(frame: Frame, timeout = CONFIG.defaultTimeout): Promise<boolean> {\n" +
               "  const start = Date.now();\n" +
               "  while (Date.now() - start < timeout) {\n" +
               "    if (await is" + funcName + "Loaded(frame)) return true;\n" +
               "    await frame.page().waitForTimeout(300);\n" +
               "  }\n" +
               "  return false;\n" +
               "}\n";
    }

    private String buildSetSearchColumnFn() {
        return "\n/** ds_search 컬럼 설정 — 반복 evaluate 블록을 named helper로 추출 */\n" +
               "async function setSearchColumn(frame: Frame, col: string, val: string): Promise<boolean> {\n" +
               "  return frame.evaluate(({ c, v }) => {\n" +
               "    try {\n" +
               "      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n" +
               "      for (let i = 0; i < mdi?.frames?.length; i++) {\n" +
               "        const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n" +
               "        if (wf?.ds_search !== undefined) {\n" +
               "          if (wf.ds_search.rowcount === 0) wf.ds_search.addRow();\n" +
               "          wf.ds_search.setColumn(0, c, v);\n" +
               "          return true;\n" +
               "        }\n" +
               "      }\n" +
               "      return false;\n" +
               "    } catch { return false; }\n" +
               "  }, { c: col, v: val }).catch(() => false);\n" +
               "}\n";
    }

    private String buildSetComponentValueFn() {
        return "\n" +
               "/**\n" +
               " * Nexacro 컴포넌트에 직접 값 설정 (Dataset.setColumn 대신 사용 시 onchanged 이벤트 발생)\n" +
               " * inputSelector 매핑 정보 기반 — Edit/Calendar/MaskEdit: set_value()\n" +
               " *                                Combo: set_value() (코드값 직접 설정)\n" +
               " * 검색조건 컴포넌트(SCH_*, APV_STAT_CD 등)는 div_workForm.form 바로 아래가 아니라\n" +
               " * div_workForm.form.div_Search.form 하위에 있으므로, 두 위치를 순서대로 탐색한다.\n" +
               " */\n" +
               "async function setComponentValue(frame: Frame, compId: string, val: string): Promise<boolean> {\n" +
               "  return frame.evaluate(({ id, v }) => {\n" +
               "    try {\n" +
               "      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n" +
               "      for (let i = 0; i < mdi?.frames?.length; i++) {\n" +
               "        const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n" +
               "        const comp = wf?.[id] !== undefined ? wf[id] : wf?.div_Search?.form?.[id];\n" +
               "        if (comp !== undefined) {\n" +
               "          if (typeof comp.set_value === 'function') comp.set_value(v);\n" +
               "          return true;\n" +
               "        }\n" +
               "      }\n" +
               "      return false;\n" +
               "    } catch { return false; }\n" +
               "  }, { id: compId, v: val }).catch(() => false);\n" +
               "}\n";
    }

    private String buildGetListRowCountFn() {
        return "\n/** ds_list 행 수 조회 */\n" +
               "async function getListRowCount(frame: Frame): Promise<number> {\n" +
               "  return frame.evaluate(() => {\n" +
               "    try {\n" +
               "      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n" +
               "      for (let i = 0; i < mdi?.frames?.length; i++) {\n" +
               "        const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n" +
               "        if (wf?.ds_list !== undefined) return wf.ds_list.rowcount ?? -1;\n" +
               "      }\n" +
               "      return -1;\n" +
               "    } catch { return -1; }\n" +
               "  }).catch(() => -1);\n" +
               "}\n";
    }

    private String buildWaitForAutoSearchFn() {
        return "\n/** fn_doInit→fn_search 자동조회 완료 대기 — rowcount 안정화 기준 */\n" +
               "async function waitForAutoSearch(frame: Frame, timeout = 10000): Promise<number> {\n" +
               "  let prev = -99;\n" +
               "  const deadline = Date.now() + timeout;\n" +
               "  while (Date.now() < deadline) {\n" +
               "    const cur = await getListRowCount(frame);\n" +
               "    if (cur >= 0 && cur === prev) return cur;\n" +
               "    prev = cur;\n" +
               "    await frame.page().waitForTimeout(500);\n" +
               "  }\n" +
               "  return prev;\n" +
               "}\n";
    }

    private String buildWaitForNexacroFrameFn() {
        // Nexacro 앱 초기화만 확인 — 화면 특정 컴포넌트와 무관
        return "\n/** Nexacro 메인 프레임 반환 — MDIWORK 초기화만 확인 (화면 특정 조건 없음) */\n" +
               "async function waitForNexacroFrame(page: Page, timeout = CONFIG.defaultTimeout): Promise<Frame | null> {\n" +
               "  const mainFrame = page.mainFrame();\n" +
               "  const start = Date.now();\n" +
               "  while (Date.now() - start < timeout) {\n" +
               "    const ok = await mainFrame.evaluate(() => {\n" +
               "      try {\n" +
               "        const app = (window as any).nexacro?.getApplication?.();\n" +
               "        return !!(app?.MDIWORK);\n" +
               "      } catch { return false; }\n" +
               "    }).catch(() => false);\n" +
               "    if (ok) return mainFrame;\n" +
               "    await page.waitForTimeout(300);\n" +
               "  }\n" +
               "  return null;\n" +
               "}\n";
    }

    private String buildNavigateToFn(String funcName, String screenTitle,
                                      String gnbName, String midCategory, String subCategory, String menuName,
                                      String screenUrl) {
        return buildNavigateToFn(funcName, screenTitle, gnbName, midCategory, subCategory, menuName, screenUrl, "");
    }

    private String buildNavigateToFn(String funcName, String screenTitle,
                                      String gnbName, String midCategory, String subCategory, String menuName,
                                      String screenUrl, String pgmId) {
        return buildNavigateToFn(funcName, screenTitle, gnbName, midCategory, subCategory, menuName, screenUrl, pgmId, "");
    }

    private String buildNavigateToFn(String funcName, String screenTitle,
                                      String gnbName, String midCategory, String subCategory, String menuName,
                                      String screenUrl, String pgmId, String dbMenuId) {
        boolean hasDbMenuId = dbMenuId != null && !dbMenuId.isEmpty();
        String menuIdLine = hasDbMenuId
            ? "  const MENU_ID     = '" + escTs(dbMenuId) + "'; // SYS_MENU_MGT 조회 결과 (신뢰도 최상)\n"
            : "  const MENU_ID     = ''; // DB 조회 실패 — openMenuByPgm 폴백 사용\n";
        String pgmIdLine = (pgmId != null && !pgmId.isEmpty())
            ? "  const PGM_ID      = '" + escTs(pgmId) + "'; // ds_menu PGM_PATH 검색용 (MENU_ID 조회 실패 시 폴백)\n"
            : "  const PGM_ID      = ''; // TODO: 소스명 미확인\n";
        String screenUrlLine = (screenUrl != null && !screenUrl.isEmpty())
            ? "  const SCREEN_URL  = '" + escTs(screenUrl) + "'; // SYS_PGM_MGT.URL\n"
            : "  const SCREEN_URL  = ''; // TODO: SYS_PGM_MGT.URL 조회 안됨 — DB 연결 확인\n";
        String gnbLine   = !gnbName.isEmpty()     ? "  const GNB_MENU    = '" + escTs(gnbName)     + "';\n" : "  const GNB_MENU    = ''; // TODO: GNB 명칭 확인\n";
        String groupLine = !midCategory.isEmpty() ? "  const GROUP_MENU  = '" + escTs(midCategory) + "'; // 중분류\n" : "  const GROUP_MENU  = ''; // TODO: 중분류 확인\n";
        String subLine   = !subCategory.isEmpty() ? "  const SUB_MENU    = '" + escTs(subCategory) + "'; // 소분류\n" : "  const SUB_MENU    = '';\n";
        String menuLine  = !menuName.isEmpty()    ? "  const TARGET_MENU = '" + escTs(menuName)    + "';\n" : "  const TARGET_MENU = '" + escTs(screenTitle) + "'; // TODO: 정확한 메뉴명 확인\n";

        return "\n/**\n" +
               " * " + funcName + " 화면으로 이동 후 Frame 반환\n" +
               " * 우선순위: ① 이미 열려 있음 → ② DB MENU_ID로 openMenuById → ③ openMenuByPgm → ④ 직접 URL → ⑤ GNB 텍스트\n" +
               " */\n" +
               "async function navigateTo" + funcName + "(page: Page): Promise<Frame | null> {\n" +
               menuIdLine +
               pgmIdLine +
               screenUrlLine +
               menuLine + subLine + groupLine + gnbLine +
               "\n" +
               "  // ── ① 최적화: 이미 해당 화면이면 즉시 반환 ──────────────────────\n" +
               "  const mainFrame = page.mainFrame();\n" +
               "  if (await is" + funcName + "Loaded(mainFrame)) return mainFrame;\n" +
               "\n" +
               "  // ── Nexacro 앱 초기화 대기 ───────────────────────────────────────\n" +
               "  await page.waitForFunction(() => {\n" +
               "    try { return !!(window as any).nexacro?.getApplication?.()?.mainframe; }\n" +
               "    catch { return false; }\n" +
               "  }, { timeout: 30000 }).catch(() => null);\n" +
               "  await page.waitForTimeout(500);\n" +
               "  console.log('  [NAV] Nexacro 초기화 완료');\n" +
               "\n" +
               "  // ── ② SYS_MENU_MGT DB 조회 MENU_ID로 openMenuById (신뢰도 최상) ─\n" +
               "  if (MENU_ID) {\n" +
               "    const navById = await openMenuById(page, MENU_ID);\n" +
               "    if (navById.ok) {\n" +
               "      console.log(`  [NAV] openMenuById 성공: ${navById.menuNm}`);\n" +
               "      await page.waitForTimeout(2500);\n" +
               "      if (await is" + funcName + "Loaded(mainFrame)) return mainFrame;\n" +
               "      if (await waitFor" + funcName + "(mainFrame, 25000)) return mainFrame;\n" +
               "      console.log('  [NAV] openMenuById 후 화면 로드 실패 — 다음 방법 시도');\n" +
               "    } else {\n" +
               "      console.warn(`  ⚠️  [NAV] openMenuById 실패: ${navById.error}`);\n" +
               "    }\n" +
               "  }\n" +
               "\n" +
               "  // ── ③ openMenuByPgm: ds_menu PGM_PATH로 fn_openMainForm 호출 (폴백) ─\n" +
               "  if (PGM_ID) {\n" +
               "    const nav = await openMenuByPgm(page, PGM_ID);\n" +
               "    if (nav.ok) {\n" +
               "      console.log(`  [NAV] openMenuByPgm 성공: ${nav.menuNm} (${nav.menuId})`);\n" +
               "      await page.waitForTimeout(2500);\n" +
               "      if (await is" + funcName + "Loaded(mainFrame)) return mainFrame;\n" +
               "      const loaded = await waitFor" + funcName + "(mainFrame, 25000);\n" +
               "      if (loaded) return mainFrame;\n" +
               "      console.log('  [NAV] openMenuByPgm 후 화면 로드 실패 — 다음 방법 시도');\n" +
               "    } else {\n" +
               "      console.warn(`  ⚠️  [NAV] openMenuByPgm 실패: ${nav.error}`);\n" +
               "    }\n" +
               "  }\n" +
               "\n" +
               "  // ── ③ 직접 URL 이동 (SYS_PGM_MGT.URL 기반 — openMenuByPgm 실패 시) ──\n" +
               "  if (SCREEN_URL) {\n" +
               "    const opened = await mainFrame.evaluate((url) => {\n" +
               "      try {\n" +
               "        const w = window as any;\n" +
               "        // Nexacro 앱별 화면 이동 함수 순서대로 시도\n" +
               "        if (typeof w.gfn_openPage === 'function') { w.gfn_openPage(url); return 'gfn_openPage'; }\n" +
               "        if (typeof w.gfn_OpenUrl  === 'function') { w.gfn_OpenUrl(url);  return 'gfn_OpenUrl'; }\n" +
               "        if (typeof w.gfn_openUrl  === 'function') { w.gfn_openUrl(url);  return 'gfn_openUrl'; }\n" +
               "        if (typeof w.goMenu       === 'function') { w.goMenu(url);       return 'goMenu'; }\n" +
               "        return '';\n" +
               "      } catch { return ''; }\n" +
               "    }, SCREEN_URL).catch(() => '');\n" +
               "\n" +
               "    if (opened) {\n" +
               "      console.log(`[navigate" + funcName + "] 직접 URL 이동: ${opened}('${SCREEN_URL}')`);\n" +
               "      await page.waitForTimeout(3000);\n" +
               "      if (await is" + funcName + "Loaded(mainFrame)) return mainFrame;\n" +
               "      const loaded = await waitFor" + funcName + "(mainFrame, 20000);\n" +
               "      if (loaded) return mainFrame;\n" +
               "      console.log('[navigate" + funcName + "] 직접 이동 후 화면 로드 실패 — GNB 탐색으로 전환(④)');\n" +
               "    }\n" +
               "  }\n" +
               "\n" +
               "  // ── ④ GNB 메뉴 탐색 (last fallback — Nexacro Canvas에서 실패할 수 있음) ─\n" +
               "  for (let retry = 0; retry < 3; retry++) {\n" +
               "    if (retry > 0) await page.waitForTimeout(1000);\n" +
               "\n" +
               "    // 1단계: GNB 클릭\n" +
               "    let gnbClicked = false;\n" +
               "    for (let attempt = 0; attempt < 10 && !gnbClicked; attempt++) {\n" +
               "      for (const frame of page.frames()) {\n" +
               "        try {\n" +
               "          const el = frame.locator(`text=${GNB_MENU}`).first();\n" +
               "          if (await el.isVisible({ timeout: 500 })) {\n" +
               "            await el.click(); gnbClicked = true; break;\n" +
               "          }\n" +
               "        } catch { }\n" +
               "      }\n" +
               "      if (!gnbClicked) await page.waitForTimeout(500);\n" +
               "    }\n" +
               "    if (!gnbClicked) {\n" +
               "      console.warn(`  ⚠️  [NAV] GNB \"${GNB_MENU}\" 링크를 찾지 못함`);\n" +
               "      continue;\n" +
               "    }\n" +
               "    console.log(`  [NAV] GNB \"${GNB_MENU}\" 클릭 완료`);\n" +
               "    await page.waitForTimeout(3000);\n" +
               "\n" +
               "    // 2단계: 퀵링크에서 TARGET_MENU 탐색\n" +
               "    let found = false;\n" +
               "    for (let i = 0; i < 5 && !found; i++) {\n" +
               "      for (const frame of page.frames()) {\n" +
               "        try {\n" +
               "          const el = frame.locator(`text=\"${TARGET_MENU}\"`).first();\n" +
               "          if (await el.isVisible({ timeout: 500 })) {\n" +
               "            found = true; await el.click();\n" +
               "            await page.waitForTimeout(3000);\n" +
               "            return await waitForNexacroFrame(page, 45000);\n" +
               "          }\n" +
               "        } catch { }\n" +
               "      }\n" +
               "      if (!found) await page.waitForTimeout(300);\n" +
               "    }\n" +
               "\n" +
               "    // 3단계: GROUP_MENU 클릭 (있는 경우만 — 3단계 경로는 skip)\n" +
               "    let groupClicked = !GROUP_MENU;\n" +
               "    if (GROUP_MENU) {\n" +
               "      for (const frame of page.frames()) {\n" +
               "        try {\n" +
               "          const g = frame.locator(`text=${GROUP_MENU}`).first();\n" +
               "          if (await g.isVisible({ timeout: 1000 })) {\n" +
               "            await g.click(); groupClicked = true;\n" +
               "            await page.waitForTimeout(1000); break;\n" +
               "          }\n" +
               "        } catch { }\n" +
               "      }\n" +
               "    }\n" +
               "    if (!groupClicked) continue;\n" +
               "\n" +
               "    // 4단계: SUB_MENU (소분류) 클릭 — 있는 경우만\n" +
               "    if (SUB_MENU) {\n" +
               "      let subClicked = false;\n" +
               "      for (let i = 0; i < 10 && !subClicked; i++) {\n" +
               "        for (const frame of page.frames()) {\n" +
               "          try {\n" +
               "            const s = frame.locator(`text=${SUB_MENU}`).first();\n" +
               "            if (await s.isVisible({ timeout: 500 })) {\n" +
               "              await s.click(); subClicked = true;\n" +
               "              await page.waitForTimeout(500); break;\n" +
               "            }\n" +
               "          } catch { }\n" +
               "        }\n" +
               "        if (!subClicked) await page.waitForTimeout(300);\n" +
               "      }\n" +
               "    }\n" +
               "\n" +
               "    // 5단계: 서브메뉴에서 TARGET_MENU 탐색\n" +
               "    for (let i = 0; i < 15; i++) {\n" +
               "      for (const frame of page.frames()) {\n" +
               "        try {\n" +
               "          const el = frame.locator(`text=\"${TARGET_MENU}\"`).first();\n" +
               "          if (await el.isVisible({ timeout: 500 })) {\n" +
               "            await el.click(); await page.waitForTimeout(3000);\n" +
               "            return await waitForNexacroFrame(page, 45000);\n" +
               "          }\n" +
               "        } catch { }\n" +
               "      }\n" +
               "      await page.waitForTimeout(300);\n" +
               "    }\n" +
               "  }\n" +
               "  return null;\n" +
               "}\n";
    }

    private String buildClickMainFormButtonFn() {
        // div_workForm.form 아래(없으면 최상위 폼) 버튼을 찾아 클릭한다.
        // 메뉴 오픈 직후에는 폼이 아직 로딩/바인딩 중일 수 있어 timeout 동안 폴링한 뒤 클릭한다
        // (예전엔 호출 시점에 한 번만 확인해, 화면은 정상인데도 타이밍 문제로 실패하는 경우가 있었다).
        // 실패 원인(못 찾음/클릭 예외)을 구분해 console.warn으로 남긴다 — frame.evaluate 내부
        // console.log는 page.on('console') 리스너가 없으면 Playwright 실행 로그에 안 찍히므로,
        // 평가 결과를 Node 컨텍스트로 되돌려받아 여기서 출력한다.
        return "\n/** div_workForm.form 아래(또는 최상위 폼) 버튼 클릭 — 폴링 + 실패 진단 포함 */\n" +
               "async function clickMainFormButton(frame: Frame, btnId: string, timeout = 10000): Promise<boolean> {\n" +
               "  const result = await frame.evaluate(async ({ id, timeout }) => {\n" +
               "    function resolve(): { btn: any; scanned: string[] } {\n" +
               "      try {\n" +
               "        const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n" +
               "        if (!mdi) return { btn: null, scanned: [] };\n" +
               "        const scanned: string[] = [];\n" +
               "        for (let i = 0; i < mdi.frames?.length; i++) {\n" +
               "          const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n" +
               "          scanned.push(mdi.frames[i]?.name || ('frame' + i));\n" +
               "          if (wf?.[id] !== undefined) return { btn: wf[id], scanned };\n" +
               "        }\n" +
               "        return { btn: null, scanned };\n" +
               "      } catch { return { btn: null, scanned: [] }; }\n" +
               "    }\n" +
               "    const start = Date.now();\n" +
               "    let r = resolve();\n" +
               "    while (!r.btn && Date.now() - start < timeout) {\n" +
               "      await new Promise((res) => setTimeout(res, 200));\n" +
               "      r = resolve();\n" +
               "    }\n" +
               "    if (!r.btn) return { ok: false, reason: 'not_found', scanned: r.scanned };\n" +
               "    try {\n" +
               "      if (typeof r.btn.trigger === 'function') r.btn.trigger('onclick', r.btn);\n" +
               "      else if (typeof r.btn.click === 'function') r.btn.click();\n" +
               "      else return { ok: false, reason: 'not_clickable' };\n" +
               "      return { ok: true };\n" +
               "    } catch (e: any) { return { ok: false, reason: 'trigger_threw', error: String(e?.message ?? e) }; }\n" +
               "  }, { id: btnId, timeout }).catch((e: any) => ({ ok: false, reason: 'evaluate_threw', error: String(e?.message ?? e) }));\n" +
               "  if (!(result as any).ok) {\n" +
               "    const r: any = result;\n" +
               "    console.warn(`[clickMainFormButton] '${btnId}' 클릭 실패 (${r.reason})` +\n" +
               "      (r.scanned ? ` — 스캔한 프레임(${r.scanned.length}개): ${r.scanned.join(', ') || '(없음)'}` : '') +\n" +
               "      (r.error ? ` — ${r.error}` : ''));\n" +
               "  }\n" +
               "  return (result as any).ok;\n" +
               "}\n";
    }

    private String buildWaitForNexacroPopupFn() {
        return "\n/** Nexacro 팝업 visible 대기 — pf[pid].form 존재 여부로 확인 */\n" +
               "async function waitForNexacroPopup(frame: Frame, popupId: string, timeout = CONFIG.defaultTimeout): Promise<boolean> {\n" +
               "  const start = Date.now();\n" +
               "  while (Date.now() - start < timeout) {\n" +
               "    const visible = await frame.evaluate((pid) => {\n" +
               "      try {\n" +
               "        const pf = (window as any).nexacro?.getPopupFrames?.();\n" +
               "        // visible !== false 조건: Nexacro 팝업이 열려 있고 form이 초기화된 상태\n" +
               "        return pf?.[pid] !== undefined && pf[pid].visible !== false && !!(pf[pid].form);\n" +
               "      } catch { return false; }\n" +
               "    }, popupId).catch(() => false);\n" +
               "    if (visible) return true;\n" +
               "    await frame.page().waitForTimeout(300);\n" +
               "  }\n" +
               "  return false;\n" +
               "}\n";
    }

    private String buildClickDivSearchButtonFn() {
        return "\n/**\n" +
               " * div_workForm.form.div_Search.form 아래 버튼 클릭 (돋보기/조회 버튼 등)\n" +
               " * 예) clickDivSearchButton(frame, 'btn_cmpy')  — 거래처 조회 팝업 호출\n" +
               " */\n" +
               "async function clickDivSearchButton(frame: Frame, btnId: string): Promise<boolean> {\n" +
               "  return await frame.evaluate((id) => {\n" +
               "    try {\n" +
               "      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n" +
               "      for (let i = 0; i < mdi?.frames?.length; i++) {\n" +
               "        const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n" +
               "        if (wf?.btn_search !== undefined && wf?.ds_list !== undefined) {\n" +
               "          const btn = wf?.div_Search?.form?.[id];\n" +
               "          if (typeof btn?.click === 'function') { btn.click(); return true; }\n" +
               "        }\n" +
               "      }\n" +
               "      return false;\n" +
               "    } catch { return false; }\n" +
               "  }, btnId).catch(() => false);\n" +
               "}\n";
    }

    private String buildGetDivSearchValueFn() {
        return "\n/**\n" +
               " * div_Search.form 컴포넌트 값 읽기 — 검색조건 초기값 확인 등에 사용\n" +
               " * value 우선, 없으면 text 반환 (Combo/Edit/Calendar 공용)\n" +
               " */\n" +
               "async function getDivSearchValue(frame: Frame, compId: string): Promise<string> {\n" +
               "  return frame.evaluate((id) => {\n" +
               "    try {\n" +
               "      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n" +
               "      for (let i = 0; i < mdi?.frames?.length; i++) {\n" +
               "        const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n" +
               "        if (wf?.btn_search !== undefined && wf?.ds_list !== undefined) {\n" +
               "          const comp = wf?.div_Search?.form?.[id];\n" +
               "          if (comp !== undefined) return String(comp?.value ?? comp?.text ?? '');\n" +
               "        }\n" +
               "      }\n" +
               "      return '';\n" +
               "    } catch { return ''; }\n" +
               "  }, compId).catch(() => '');\n" +
               "}\n";
    }

    private String buildWaitForPopupComponentFn() {
        return "\n/**\n" +
               " * 팝업 내 특정 컴포넌트 준비 대기 (typeof btn.click === 'function')\n" +
               " * waitForNexacroPopup 직후 호출 — form 컴포넌트 초기화 지연(비동기 렌더링) 대응\n" +
               " *\n" +
               " * 예) await waitForPopupComponent(frame, page, 'fac_0999P', 'btn_ok');\n" +
               " */\n" +
               "async function waitForPopupComponent(\n" +
               "  frame: Frame, page: Page, popupId: string, componentId: string, maxRetry = 20\n" +
               "): Promise<boolean> {\n" +
               "  for (let i = 0; i < maxRetry; i++) {\n" +
               "    const ready = await frame.evaluate(\n" +
               "      ({ pId, cId }) => {\n" +
               "        try {\n" +
               "          const pf = (window as any).nexacro?.getPopupFrames?.();\n" +
               "          return typeof pf?.[pId]?.form?.[cId]?.click === 'function';\n" +
               "        } catch { return false; }\n" +
               "      },\n" +
               "      { pId: popupId, cId: componentId }\n" +
               "    ).catch(() => false);\n" +
               "    if (ready) return true;\n" +
               "    await page.waitForTimeout(300);\n" +
               "  }\n" +
               "  return false;\n" +
               "}\n";
    }

    // ──────────────────────────────────────────────────────────────────────
    // ComboBox 헬퍼 함수
    // ──────────────────────────────────────────────────────────────────────

    private String buildGetComboValueFn() {
        return "\n/** Nexacro ComboBox 내부 코드값(value) 읽기 — 화면 텍스트(label)가 아닌 바인딩 값 반환 */\n" +
               "async function getComboValue(frame: Frame, compId: string): Promise<string> {\n" +
               "  return frame.evaluate((id) => {\n" +
               "    try {\n" +
               "      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n" +
               "      for (let i = 0; i < mdi?.frames?.length; i++) {\n" +
               "        const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n" +
               "        if (wf?.[id] !== undefined) return String(wf[id].value ?? '');\n" +
               "      }\n" +
               "      return '';\n" +
               "    } catch { return ''; }\n" +
               "  }, compId).catch(() => '');\n" +
               "}\n";
    }

    private String buildGetComboItemsFn() {
        return "\n" +
               "/** Nexacro ComboBox 전체 코드/라벨 목록 반환\n" +
               " *  codecolumn/labelcolumn 속성을 우선 사용하고, 없으면 innerdataset 0·1번 컬럼 fallback */\n" +
               "async function getComboItems(\n" +
               "  frame: Frame, compId: string\n" +
               "): Promise<{ value: string; label: string }[]> {\n" +
               "  return frame.evaluate((id) => {\n" +
               "    try {\n" +
               "      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n" +
               "      for (let i = 0; i < mdi?.frames?.length; i++) {\n" +
               "        const wf  = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n" +
               "        const cbo = wf?.[id];\n" +
               "        if (cbo === undefined) continue;\n" +
               "        const ds = cbo.innerdataset ?? (cbo as any)._innerdataset;\n" +
               "        if (!ds) return [];\n" +
               "        const codeCol  = cbo.codecolumn  ?? ds.getColumnID(0);\n" +
               "        const labelCol = cbo.labelcolumn ?? ds.getColumnID(1) ?? codeCol;\n" +
               "        const items: { value: string; label: string }[] = [];\n" +
               "        for (let r = 0; r < ds.rowcount; r++) {\n" +
               "          items.push({\n" +
               "            value: String(ds.getColumn(r, codeCol)  ?? ''),\n" +
               "            label: String(ds.getColumn(r, labelCol) ?? '')\n" +
               "          });\n" +
               "        }\n" +
               "        return items;\n" +
               "      }\n" +
               "      return [];\n" +
               "    } catch { return []; }\n" +
               "  }, compId).catch(() => []);\n" +
               "}\n";
    }

    /**
     * inputSelector에 Combo 컴포넌트가 있는 시나리오를 대상으로
     * 콤보박스 선택값별 분기 test.describe 블록을 생성한다.
     *
     * 같은 compId에 대해 중복 생성하지 않도록 seen 집합으로 관리한다.
     */
    private String buildComboVariantBlocks(List<Map<String, Object>> scenarios, String funcName, String screenshotPfx) {
        java.util.Set<String> seen = new java.util.LinkedHashSet<>();
        StringBuilder sb = new StringBuilder();
        for (Map<String, Object> s : scenarios) {
            if ("단위".equals(str(s, "testType"))) continue;
            Map<String, Map<String, String>> inputSel = getInputSelector(s);
            for (Map.Entry<String, Map<String, String>> entry : inputSel.entrySet()) {
                Map<String, String> compInfo = entry.getValue();
                if (!"Combo".equalsIgnoreCase(compInfo.get("compType"))) continue;
                String compId = compInfo.getOrDefault("compId", "cbo_" + entry.getKey().toLowerCase());
                if (!seen.add(compId)) continue; // 중복 방지
                sb.append(buildComboVariantBlock(compId, funcName, screenshotPfx));
            }
        }
        return sb.toString();
    }

    private String buildComboVariantBlock(String compId, String funcName, String screenshotPfx) {
        return "\n  // ── [ComboBox 분기] " + compId + " 선택값별 시나리오 ──────────────────────\n" +
               "  test.describe('[ComboBox] " + esc(compId) + " 선택값별 화면 분기', () => {\n" +
               "    test('[ComboBox] " + esc(compId) + " — 코드 목록 순회 및 화면 검증', async ({ workerPage: page }) => {\n" +
               "      const frame = await navigateTo" + funcName + "(page);\n" +
               "      if (!frame) { test.fail(true, '화면 탐색 실패'); return; }\n" +
               "\n" +
               "      // ① 콤보박스 전체 코드/라벨 목록 조회\n" +
               "      const items = await getComboItems(frame, '" + esc(compId) + "');\n" +
               "      logResult('" + esc(compId) + " 항목 수', items.length);\n" +
               "      expect(items.length).toBeGreaterThan(0);\n" +
               "\n" +
               "      // ② 각 코드값 선택 → 내부 value 검증 → 화면 변화 캡처\n" +
               "      for (const item of items) {\n" +
               "        logAction(`" + esc(compId) + " 선택: ${item.value} (${item.label})`);\n" +
               "\n" +
               "        // 내부 코드값(value)으로 직접 설정 — 화면 텍스트(label) 기준 아님\n" +
               "        await setComponentValue(frame, '" + esc(compId) + "', item.value);\n" +
               "        await frame.page().waitForTimeout(500); // onchanged 이벤트 처리 대기\n" +
               "\n" +
               "        // 바인딩된 내부 value 검증\n" +
               "        const actual = await getComboValue(frame, '" + esc(compId) + "');\n" +
               "        logResult(`" + esc(compId) + ".value`, actual);\n" +
               "        expect(actual).toBe(item.value);\n" +
               "\n" +
               "        // TODO: 선택값에 따른 컴포넌트 활성화/비활성화, 영역 show/hide 검증 추가\n" +
               "        // 예) const sectionVisible = await frame.evaluate(() => {\n" +
               "        //       const wf = ...;\n" +
               "        //       return wf?.div_section?.get_visible() ?? false;\n" +
               "        //     });\n" +
               "        // if (item.value === '01') expect(sectionVisible).toBe(true);\n" +
               "\n" +
               "        await page.screenshot({ path: `test-results/" + screenshotPfx + "-" + esc(compId) + "-${item.value}.png` });\n" +
               "      }\n" +
               "    });\n" +
               "  });\n";
    }

    // ──────────────────────────────────────────────────────────────────────
    // 단위 테스트 헬퍼 함수
    // ──────────────────────────────────────────────────────────────────────

    private String buildNexacroXmlFn() {
        return "function nexacroXml(\n" +
               "  datasets: { id: string; columns: string[]; rows?: Record<string, string>[] }[],\n" +
               "  pgmId: string   // ← CSRF 검증 필수값 — sourceName 그대로 사용 (예: 'PUR_5110M')\n" +
               "): string {\n" +
               "  const dsXml = datasets.map(({ id, columns, rows = [] }) => {\n" +
               "    const cols    = columns.map(c => `<Column id=\"${c}\" type=\"STRING\" size=\"256\"/>`).join('');\n" +
               "    const rowsXml = rows.map(row =>\n" +
               "      `<Row>${columns.map(c => `<Col id=\"${c}\">${row[c] ?? ''}</Col>`).join('')}</Row>`\n" +
               "    ).join('');\n" +
               "    return `<Dataset id=\"${id}\"><ColumnInfo>${cols}</ColumnInfo><Rows>${rowsXml}</Rows></Dataset>`;\n" +
               "  }).join('');\n" +
               "  return (\n" +
               "    `<?xml version=\"1.0\" encoding=\"utf-8\"?>` +\n" +
               "    `<Root xmlns=\"http://www.nexacroplatform.com/platform/dataset\" ver=\"5.0.0.0\">` +\n" +
               "    `<Parameters><Parameter id=\"pgmId\">${pgmId}</Parameter></Parameters>` +\n" +
               "    `<Datasets>${dsXml}</Datasets></Root>`\n" +
               "  );\n" +
               "}\n";
    }

    private String buildApiPostFn() {
        return "\n// 서버 세션의 csrfKey를 가져와 요청 XML에 주입 — Nexacro 플랫폼 CSRF 검증 통과\n" +
               "async function fetchCsrfKey(page: Page): Promise<string> {\n" +
               "  const { status, body } = await page.evaluate(\n" +
               "    async (url: string) => {\n" +
               "      const resp = await fetch(url, { credentials: 'include' });\n" +
               "      return { status: resp.status, body: await resp.text() };\n" +
               "    },\n" +
               "    `${BASE_URL}/common/frame/getSessionKey.do`\n" +
               "  );\n" +
               "  if (status !== 200) throw new Error(`getSessionKey HTTP ${status}`);\n" +
               "  const match = body.match(/<Parameter id=\"csrfKey\"[^>]*>([^<]*)<\\/Parameter>/);\n" +
               "  if (!match?.[1]) throw new Error(`csrfKey 미발견: ${body.substring(0, 300)}`);\n" +
               "  return match[1];\n" +
               "}\n" +
               "\nasync function apiPost(\n" +
               "  page: Page, endpoint: string, xml: string\n" +
               "): Promise<import('@playwright/test').Response> {\n" +
               "  const csrfKey = await fetchCsrfKey(page);\n" +
               "  const xmlWithCsrf = xml.replace(\n" +
               "    '</Parameters>',\n" +
               "    `<Parameter id=\"csrfKey\">${csrfKey}</Parameter></Parameters>`\n" +
               "  );\n" +
               "  const { status, body } = await page.evaluate(\n" +
               "    async ({ url, xml }: { url: string; xml: string }) => {\n" +
               "      const resp = await fetch(url, {\n" +
               "        method: 'POST',\n" +
               "        headers: { 'Content-Type': 'text/xml; charset=utf-8' },\n" +
               "        body: xml,\n" +
               "        credentials: 'include',\n" +
               "      });\n" +
               "      return { status: resp.status, body: await resp.text() };\n" +
               "    },\n" +
               "    { url: endpoint, xml: xmlWithCsrf }\n" +
               "  );\n" +
               "  return {\n" +
               "    status: () => status,\n" +
               "    text:   async () => body,\n" +
               "    ok:     () => status >= 200 && status < 300,\n" +
               "    url:    () => endpoint,\n" +
               "  } as unknown as import('@playwright/test').Response;\n" +
               "}\n" +
               "\n// Nexacro 서버는 openMenuById(또는 openMenuByPgm)로 폼을 서버 세션에 등록한 후에만 API 호출을 허용\n" +
               "// 세션 등록은 menuId/pgmId 당 1회로 충분 (세션 쿠키가 유지되는 한 재등록 불필요)\n" +
               "// menuId 미확인(DB 조회 실패) 시 pgmId로 openMenuByPgm 폴백 — 비어 있으면 CSRF 세션이 등록되지 않아 이후 API 호출이 모두 실패한다\n" +
               "// 반환값(formKey)은 실제 등록된 화면의 프레임 키 — setNexacroComponentValue 등으로 화면 컴포넌트에\n" +
               "// 직접 입력할 때 사용한다 (menuId 지정 시 그대로, pgmId 폴백 시 openMenuByPgm이 찾아낸 menuId 사용).\n" +
               "const _sessionReady = new Map<string, string>();\n" +
               "async function ensureSessionReady(page: Page, menuId: string, pgmId?: string): Promise<string> {\n" +
               "  const key = menuId || pgmId || '';\n" +
               "  if (!key) return '';\n" +
               "  if (_sessionReady.has(key)) return _sessionReady.get(key)!;\n" +
               "  await waitForNexacroAppReady(page, 20000);\n" +
               "  const nav = menuId ? await openMenuById(page, menuId) : await openMenuByPgm(page, pgmId || '');\n" +
               "  if (nav.ok) {\n" +
               "    await page.waitForTimeout(2000);\n" +
               "    const formKey = menuId || (nav as any).menuId || key;\n" +
               "    _sessionReady.set(key, formKey);\n" +
               "    console.log('[CSRF] 서버 세션 폼 등록 완료 — menuNm:', nav.menuNm);\n" +
               "    return formKey;\n" +
               "  } else {\n" +
               "    console.warn('[CSRF] 메뉴 등록 실패 — 이후 API 호출이 CSRF 오류를 반환할 수 있습니다:', nav.error);\n" +
               "    return '';\n" +
               "  }\n" +
               "}\n" +
               "\n// ds_search 단일 행 헬퍼 — 지정 컬럼 전체 포함 (빈값은 iBATIS isNotEmpty가 스킵)\n" +
               "function searchBody(pgmId: string, columns: string[], params: Record<string, string>): string {\n" +
               "  const allParams = Object.fromEntries(columns.map(c => [c, params[c] ?? '']));\n" +
               "  return nexacroXml([{ id: 'ds_search', columns, rows: [allParams] }], pgmId);\n" +
               "}\n";
    }

    // ──────────────────────────────────────────────────────────────────────
    // TC001 ~ TC003 보일러플레이트
    // ──────────────────────────────────────────────────────────────────────

    private String buildTc001(String screenTitle, String screenshotPfx) {
        return "  // ────────────────────────────────────────────────────────────────────────────\n" +
               "  // TC001: 메인 페이지 접근 확인 (beforeAll 로그인 결과 검증)\n" +
               "  // ────────────────────────────────────────────────────────────────────────────\n" +
               "  test('TC001: 메인 페이지 접근 확인', async ({ workerPage: page }) => {\n" +
               "    logTestStart('TC001: 메인 페이지 접근 확인');\n" +
               "\n" +
               "    logAction('페이지 타이틀 확인');\n" +
               "    const title = await page.title();\n" +
               "    logResult('페이지 타이틀', title);\n" +
               "\n" +
               "    // 로그인 세션이 유효한지 확인 (testLogin 으로 튕기지 않아야 함)\n" +
               "    const url = page.url();\n" +
               "    logResult('현재 URL', url);\n" +
               "    expect(url).not.toContain('testLogin');\n" +
               "\n" +
               "    await page.screenshot({ path: 'test-results/" + screenshotPfx + "-TC001-main-page.png' });\n" +
               "  });\n\n";
    }

    private String buildTc002(String funcName, String menuName, String gnbName, String screenshotPfx) {
        return "  // ────────────────────────────────────────────────────────────────────────────\n" +
               "  // TC002: " + menuName + " 메뉴 접근 (beforeAll 최초 진입 결과 검증)\n" +
               "  // ────────────────────────────────────────────────────────────────────────────\n" +
               "  test('TC002: " + esc(menuName) + " 메뉴 접근', async ({ workerPage: page }) => {\n" +
               "    logTestStart('TC002: " + esc(menuName) + " 메뉴 접근');\n" +
               "\n" +
               "    // beforeAll에서 navigateTo" + funcName + "() 결과를 검증\n" +
               "    logResult('sharedFrame 획득 여부', sharedFrame !== null, true);\n" +
               "    expect(sharedFrame).not.toBeNull();\n" +
               "\n" +
               "    await page.screenshot({ path: 'test-results/" + screenshotPfx + "-TC002-menu.png' });\n" +
               "  });\n\n";
    }

    private String buildTc003(String funcName, String screenTitle, String screenshotPfx) {
        return "  // ────────────────────────────────────────────────────────────────────────────\n" +
               "  // TC003: " + cmt(screenTitle) + " 화면 로드 확인\n" +
               "  //   sharedFrame 에서 핵심 컴포넌트 존재 여부로 로드 상태 재확인\n" +
               "  // ────────────────────────────────────────────────────────────────────────────\n" +
               "  test('TC003: " + esc(screenTitle) + " 화면 로드 확인', async ({ workerPage: page }) => {\n" +
               "    logTestStart('TC003: " + esc(screenTitle) + " 화면 로드 확인');\n" +
               "\n" +
               "    expect(sharedFrame).not.toBeNull();\n" +
               "    if (!sharedFrame) return;\n" +
               "\n" +
               "    const loaded = await waitFor" + funcName + "(sharedFrame, 30000);\n" +
               "    logResult('화면 로드 (is" + funcName + "Loaded)', loaded, true);\n" +
               "    expect(loaded).toBe(true);\n" +
               "\n" +
               "    await page.screenshot({ path: 'test-results/" + screenshotPfx + "-TC003-form-load.png' });\n" +
               "  });\n\n";
    }

    private String buildTc004(String funcName, String screenshotPfx) {
        return "  // ────────────────────────────────────────────────────────────────────────────\n" +
               "  // TC004: 화면 로드 시 자동 조회 실행 확인 (fn_doInit → fn_search)\n" +
               "  //   beforeAll 진입 시 이미 자동조회 완료 → rowcount·stc_gridRowCnt 검증\n" +
               "  // ────────────────────────────────────────────────────────────────────────────\n" +
               "  test('TC004: 화면 로드 시 자동 조회 실행 확인', async ({ workerPage: page }) => {\n" +
               "    logTestStart('TC004: 화면 로드 시 자동 조회 실행 확인');\n" +
               "\n" +
               "    expect(sharedFrame).not.toBeNull();\n" +
               "    if (!sharedFrame) return;\n" +
               "\n" +
               "    // 자동 조회 완료 대기 (이미 완료됐으면 즉시 반환)\n" +
               "    const rowCount = await waitForAutoSearch(sharedFrame, CONFIG.defaultTimeout);\n" +
               "    logResult('ds_list rowcount', rowCount);\n" +
               "    console.log(`  조회 결과: ${rowCount}건`);\n" +
               "    expect(rowCount).toBeGreaterThanOrEqual(0);\n" +
               "\n" +
               "    // stc_gridRowCnt '총 N건' 텍스트 확인\n" +
               "    const rowCntText = await sharedFrame.evaluate(() => {\n" +
               "      try {\n" +
               "        const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n" +
               "        for (let i = 0; i < mdi?.frames?.length; i++) {\n" +
               "          const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n" +
               "          if (wf?.stc_gridRowCnt !== undefined)\n" +
               "            return String(wf.stc_gridRowCnt.text ?? '');\n" +
               "        }\n" +
               "        return '';\n" +
               "      } catch { return ''; }\n" +
               "    }).catch(() => '');\n" +
               "    logResult('총 건수 표시', rowCntText);\n" +
               "    expect(rowCntText).toMatch(/총 \\d+건/);\n" +
               "\n" +
               "    await page.screenshot({ path: 'test-results/" + screenshotPfx + "-TC004-auto-search.png' });\n" +
               "  });\n\n";
    }

    /**
     * TC005: 조회 버튼(btn_search) 클릭 후 목록 재조회 확인.
     * rowCount는 0 이상만 확인(느슨한 조건)하되, fixtures.ts의 전역 다이얼로그
     * 에러 수집 덕분에 조회 중 서버 오류(BadSqlGrammarException 등)가 뜨면
     * 이 TC는 rowCount 어서션과 무관하게 자동으로 미통과 처리된다.
     */
    private String buildTcSearchClick(String funcName, String screenshotPfx) {
        return "  // ────────────────────────────────────────────────────────────────────────────\n" +
               "  // TC005: 조회 버튼 클릭 후 목록 조회\n" +
               "  // ────────────────────────────────────────────────────────────────────────────\n" +
               "  test('TC005 — 조회 버튼 클릭 후 목록 조회', async ({ workerPage: page }) => {\n" +
               "    logTestStart('TC005', '조회 버튼 클릭 후 목록 조회');\n" +
               "    if (!sharedFrame || !await is" + funcName + "Loaded(sharedFrame)) {\n" +
               "      logAction('" + funcName + " 재진입');\n" +
               "      sharedFrame = await navigateTo" + funcName + "(page);\n" +
               "    }\n" +
               "    expect(sharedFrame, '화면 진입 실패').not.toBeNull();\n" +
               "\n" +
               "    logAction('btn_search 클릭');\n" +
               "    const clicked = await clickMainFormButton(sharedFrame!, 'btn_search');\n" +
               "    logResult('btn_search 클릭', clicked, true);\n" +
               "    expect(clicked, '조회 버튼 클릭 실패 — btn_search 컴포넌트 없음').toBe(true);\n" +
               "\n" +
               "    const rowCount = await waitForAutoSearch(sharedFrame!, 15000);\n" +
               "    logInfo(`조회 결과 건수: ${rowCount}`);\n" +
               "    logResult('목록 조회 완료 (rowCount ≥ 0)', rowCount >= 0, true);\n" +
               "    expect(rowCount, 'ds_list.rowcount 가 음수 — 조회 이상').toBeGreaterThanOrEqual(0);\n" +
               "\n" +
               "    await page.screenshot({ path: 'test-results/" + screenshotPfx + "-TC005-search.png' });\n" +
               "  });\n\n";
    }

    /**
     * TC006: 선택적 버튼(초기화 등) 동작 확인 — 화면마다 존재 여부가 다르므로
     * 클릭 자체는 시도하되 컴포넌트가 없어도 WARN만 남기고 실패 처리하지 않는다.
     * XFDL 파싱으로 버튼 존재 여부를 사전에 확정할 수 없는 경우의 안전한 기본값.
     */
    private String buildTcOptionalButton(String screenshotPfx) {
        return "  // ────────────────────────────────────────────────────────────────────────────\n" +
               "  // TC006: 초기화 버튼(btn_init) 동작 확인 — 없는 화면도 있으므로 WARN만, 실패 처리 안 함\n" +
               "  // ────────────────────────────────────────────────────────────────────────────\n" +
               "  test('TC006 — 초기화 버튼(btn_init) 동작 확인', async ({ workerPage: page }) => {\n" +
               "    logTestStart('TC006', '초기화 버튼 동작 확인');\n" +
               "    expect(sharedFrame, '화면 진입 실패').not.toBeNull();\n" +
               "\n" +
               "    logAction('btn_init 클릭');\n" +
               "    const clicked = await clickMainFormButton(sharedFrame!, 'btn_init');\n" +
               "    logResult('btn_init 클릭', clicked, true);\n" +
               "    if (!clicked) logInfo('⚠ btn_init 없음 — 해당 화면에 초기화 버튼 미존재 (WARN만)');\n" +
               "    // btn_init는 선택적 버튼 — 없어도 실패 처리 안 함\n" +
               "\n" +
               "    await page.screenshot({ path: 'test-results/" + screenshotPfx + "-TC006-init.png' });\n" +
               "  });\n\n";
    }

    // ──────────────────────────────────────────────────────────────────────
    // 통합 TC 블록
    // ──────────────────────────────────────────────────────────────────────

    private String buildIntegTcBlock(Map<String, Object> s, String funcName, int tcNo, String screenshotPfx) {
        int    no         = intVal(s, "no");
        String scenarioId = str(s, "scenarioId");
        String testName   = str(s, "testName");
        String url        = str(s, "url");
        String crudType   = str(s, "crudType");
        String expected   = str(s, "expectedResult");
        String inputDsId  = str(s, "inputDsId");
        String methodName = extractMethodName(url);

        Map<String, String> td = parseTestData(str(s, "testData"));
        String tcLabel = "TC" + String.format("%03d", tcNo);

        StringBuilder sb = new StringBuilder();
        sb.append("  // ────────────────────────────────────────────────────────────────────────────\n");
        sb.append("  // ").append(tcLabel).append(": ").append(cmt(testName)).append(" [").append(crudType).append("]\n");
        sb.append("  // URL: ").append(cmt(url)).append(" | 예상결과: ").append(cmt(expected)).append("\n");
        sb.append("  // ────────────────────────────────────────────────────────────────────────────\n");
        sb.append("  test('").append(tcLabel).append(": ").append(esc(testName))
          .append("', async ({ workerPage: page }) => {\n");
        sb.append("    logTestStart('").append(tcLabel).append(": ").append(esc(testName)).append("');\n");

        // sharedFrame 재사용 — beforeAll에서 1회 진입한 세션/프레임 그대로 사용
        sb.append("\n    // sharedFrame 세션 공유 — 별도 로그인·메뉴 이동 없이 현재 상태 이어받음\n");
        sb.append("    if (!sharedFrame) { test.fail(true, '화면 탐색 실패 (beforeAll)'); return; }\n");
        sb.append("    const frame = sharedFrame;\n\n");
        sb.append("    const loaded = await waitFor").append(funcName).append("(frame, 10000);\n");
        sb.append("    if (!loaded) { test.fail(true, '화면 로드 타임아웃'); return; }\n\n");

        // 시나리오흐름(preCondition)이 있으면 단계별 test.step() 구조로 생성
        String preCondition = str(s, "preCondition");
        List<String> flowSteps = parsePreConditionSteps(preCondition);
        if (!flowSteps.isEmpty()) {
            buildStepDrivenBlock(sb, s, td, url, inputDsId, methodName, funcName, tcLabel, no, crudType, screenshotPfx, expected, flowSteps);
        } else if ("SELECT".equals(crudType)) {
            buildIntegSelectBlock(sb, s, td, url, inputDsId, methodName, funcName, tcLabel, no, screenshotPfx, expected);
        } else if ("INSERT".equals(crudType) || "UPDATE".equals(crudType)) {
            buildIntegSaveBlock(sb, s, td, url, inputDsId, methodName, funcName, tcLabel, no, crudType, screenshotPfx, expected);
        } else if ("DELETE".equals(crudType)) {
            buildIntegDeleteBlock(sb, s, td, url, inputDsId, methodName, funcName, tcLabel, no, screenshotPfx, expected);
        } else {
            buildIntegSelectBlock(sb, s, td, url, inputDsId, methodName, funcName, tcLabel, no, screenshotPfx, expected);
        }

        sb.append("  });\n\n");
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Map<String, String>> getInputSelector(Map<String, Object> s) {
        Object sel = s.get("inputSelector");
        if (sel instanceof Map) return (Map<String, Map<String, String>>) sel;
        return new LinkedHashMap<>();
    }

    private void buildIntegSelectBlock(StringBuilder sb, Map<String, Object> s,
            Map<String, String> td, String url, String inputDsId,
            String methodName, String funcName, String tcLabel, int no, String screenshotPfx, String expected) {

        Map<String, Map<String, String>> inputSelector = getInputSelector(s);

        // 자동조회 완료 대기 (fn_doInit→fn_search 화면이 진입 시 자동 조회 실행)
        sb.append("    // ── 자동조회 완료 대기 후 검색조건 설정 ────────────────────────\n");
        sb.append("    await waitForAutoSearch(frame);\n\n");

        // 검색 조건 설정 — inputSelector 매핑 우선, 없으면 setSearchColumn fallback
        if (!td.isEmpty()) {
            for (Map.Entry<String, String> e : td.entrySet()) {
                String col = e.getKey();
                String val = e.getValue();
                sb.append("    logInput('").append(col).append("', ").append(tsVal(val)).append(");\n");

                Map<String, String> compInfo = inputSelector.get(col.toUpperCase());
                if (compInfo != null && compInfo.containsKey("compId")) {
                    String compId   = compInfo.get("compId");
                    String compType = compInfo.get("compType");
                    // 컴포넌트 직접 setValue (onchanged 이벤트 발생, 유효성 검사 포함)
                    sb.append("    // ").append(compId).append(" (").append(compType)
                      .append(") — ").append(inputDsId).append(".").append(col).append("\n");
                    if ("Combo".equalsIgnoreCase(compType)) {
                        sb.append("    // ① 콤보박스 내부 코드값(value)으로 직접 설정 — 화면 텍스트(label) 기준 아님\n");
                        sb.append("    await setComponentValue(frame, '").append(compId)
                          .append("', ").append(tsVal(val)).append(");\n");
                        sb.append("    await frame.page().waitForTimeout(300); // onchanged 이벤트 처리 대기\n");
                        sb.append("    // ② 실제 바인딩된 내부 value 검증\n");
                        sb.append("    { const cv = await getComboValue(frame, '").append(compId)
                          .append("'); logResult('").append(compId).append(".value', cv); expect(cv).toBe(")
                          .append(tsVal(val)).append("); }\n");
                    } else {
                        sb.append("    { const ok = await setComponentValue(frame, '").append(compId)
                          .append("', ").append(tsVal(val))
                          .append("); logResult('").append(compId).append(" 입력', ok, true); expect(ok).toBe(true); }\n");
                    }
                } else {
                    // Dataset 직접 설정 (컴포넌트 바인딩 없는 경우 fallback)
                    sb.append("    await setSearchColumn(frame, '").append(col)
                      .append("', ").append(tsVal(val)).append(");\n");
                }
            }
            sb.append("\n");
        }

        // waitForResponse + 버튼 클릭 — endsWith로 URL 정확히 매칭
        sb.append("    // ── 조회 버튼 클릭 + 응답 대기 ────────────────────────────────\n");
        sb.append("    const respPromise = page.waitForResponse(\n");
        sb.append("      res => res.url().endsWith('").append(esc(url)).append("') && res.status() === 200,\n");
        sb.append("      { timeout: 15000 }\n");
        sb.append("    ).catch(() => null);\n\n");
        sb.append("    logAction('btn_search 클릭');\n");
        sb.append("    await clickMainFormButton(frame, 'btn_search');\n\n");
        sb.append("    await assertNexacroResponse(await respPromise, '").append(methodName).append(".do');\n\n");

        // 결과 검증 — named helper + stc_gridRowCnt 총 건수 확인
        sb.append("    // ── 결과 검증 ────────────────────────────────────────────────\n");
        sb.append("    const rowCount = await waitForAutoSearch(frame, 5000);\n");
        sb.append("    logResult('ds_list 행 수', rowCount);\n");
        // expectedResult에 "조회됨/1건 이상/목록/표시/이상" 포함 시 > 0 강제
        String assertLabel = (expected != null && !expected.isEmpty()) ? "'" + expected.replace("'", "\\'") + "'" : "'조회 실행'";
        boolean expectData = expected != null && (expected.contains("조회됨") || expected.contains("1건 이상")
                || expected.contains("목록") || expected.contains("표시") || expected.contains("이상")
                || expected.contains("건 이상"));
        if (expectData) {
            sb.append("    expect(rowCount, ").append(assertLabel).append(").toBeGreaterThan(0);\n\n");
        } else {
            sb.append("    expect(rowCount, ").append(assertLabel).append(").toBeGreaterThanOrEqual(0);\n\n");
        }
        sb.append("    const rowCntText = await frame.evaluate(() => {\n");
        sb.append("      try {\n");
        sb.append("        const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n");
        sb.append("        for (let i = 0; i < mdi?.frames?.length; i++) {\n");
        sb.append("          const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n");
        sb.append("          if (wf?.stc_gridRowCnt !== undefined) return String(wf.stc_gridRowCnt.text ?? '');\n");
        sb.append("        }\n");
        sb.append("        return '';\n");
        sb.append("      } catch { return ''; }\n");
        sb.append("    }).catch(() => '');\n");
        sb.append("    logResult('총 건수 표시', rowCntText);\n");
        sb.append("    if (rowCntText) expect(rowCntText).toMatch(/총 \\d+건/);\n\n");
        sb.append(buildExpectedResultAsserts(expected, "SELECT"));
        sb.append("    await page.screenshot({ path: 'test-results/").append(screenshotPfx).append("-").append(tcLabel).append("-select.png' });\n");
    }

    private void buildIntegSaveBlock(StringBuilder sb, Map<String, Object> s,
            Map<String, String> td, String url, String inputDsId,
            String methodName, String funcName, String tcLabel, int no, String crudType, String screenshotPfx, String expected) {
        String outputDsId = str(s, "outputDsId");
        Map<String, Map<String, String>> inputSelector = getInputSelector(s);

        // 실제 저장 버튼 id — ScenarioBuilderService가 gfn_tran(svcId) 호출을 추적해 채운
        // "btnId"를 우선 사용한다. 화면마다 버튼 id가 달라 'btn_save' 고정 가정은 다른
        // 화면에서 조용히 실패(클릭 대상 없음 → 아무 일도 안 일어남)할 수 있다.
        String saveBtnId = str(s, "btnId");
        if (saveBtnId.isEmpty()) saveBtnId = "btn_save";

        // 참고: 예전에는 별도의 [신규] 버튼(하드코딩된 'btn_insert')을 먼저 클릭해 입력 폼을
        // 열었으나, 실제로는 그런 버튼이 없는 화면(그리드/폼에 이미 입력 가능한 필드가 있고
        // 저장 버튼이 바로 gfn_tran을 호출하는 구조)이 많아 클릭이 조용히 실패하고도 다음
        // 단계가 그대로 진행되는 문제가 있었다. 별도 "입력 폼 열기" 버튼은 화면별로 실제
        // 존재 여부를 확인할 방법이 없으므로, 아래 컴포넌트/Dataset 직접 설정 로직이
        // 이미 로드된 폼에 바로 값을 채우는 것으로 대체한다.
        sb.append("    // ── ").append("INSERT".equals(crudType) ? "신규 입력값 설정 (컴포넌트별)" : "수정값 설정 (컴포넌트별)").append(" ─────────────────────────\n");

        // inputSelector 매핑이 없는 컬럼은 Dataset 직접 설정
        List<String> needsDatasetCols = new ArrayList<>();

        if (!td.isEmpty()) {
            for (Map.Entry<String, String> e : td.entrySet()) {
                String col = e.getKey();
                String val = e.getValue();
                Map<String, String> compInfo = inputSelector.get(col.toUpperCase());

                if (compInfo != null && compInfo.containsKey("compId")) {
                    String compId   = compInfo.get("compId");
                    String compType = compInfo.getOrDefault("compType", "Edit");

                    sb.append("    // ").append(compId).append(" (").append(compType)
                      .append(") ← ").append(inputDsId).append(".").append(col).append("\n");
                    sb.append("    logInput('").append(compId).append(" [").append(col)
                      .append("]', ").append(tsVal(val)).append(");\n");

                    if ("Combo".equalsIgnoreCase(compType)) {
                        sb.append("    await setComponentValue(frame, '").append(compId)
                          .append("', ").append(tsVal(val)).append(");\n");
                        sb.append("    await frame.page().waitForTimeout(300); // onchanged 처리 대기\n");
                        sb.append("    { const cv = await getComboValue(frame, '").append(compId)
                          .append("'); logResult('").append(compId).append(".value', cv); expect(cv).toBe(")
                          .append(tsVal(val)).append("); }\n\n");
                    } else {
                        sb.append("    await setComponentValue(frame, '").append(compId)
                          .append("', ").append(tsVal(val)).append(");\n");
                        sb.append("    await frame.page().waitForTimeout(200);\n");
                        // 입력 후 컴포넌트 값 검증
                        sb.append("    { const cv = await frame.evaluate(() => { try {\n");
                        sb.append("      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n");
                        sb.append("      for (let i = 0; i < mdi?.frames?.length; i++) {\n");
                        sb.append("        const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n");
                        sb.append("        if (wf?.").append(compId).append(" !== undefined) return String(wf.")
                          .append(compId).append(".value ?? '');\n");
                        sb.append("      } return ''; } catch { return ''; } }).catch(() => '');\n");
                        sb.append("      logResult('").append(compId).append(".value', cv); }\n\n");
                    }
                } else {
                    needsDatasetCols.add(col);
                }
            }
        }

        // inputSelector 없는 컬럼은 Dataset 직접 설정
        if (!needsDatasetCols.isEmpty()) {
            sb.append("    // ── Dataset 직접 설정 (컴포넌트 미특정 컬럼) ─────────────────\n");
            for (String col : needsDatasetCols) {
                sb.append("    logInput('").append(inputDsId).append(".").append(col)
                  .append("', ").append(tsVal(td.get(col))).append(");\n");
            }
            sb.append("    await frame.evaluate((args) => {\n");
            sb.append("      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n");
            sb.append("      if (!mdi) return;\n");
            sb.append("      for (let i = 0; i < mdi.frames?.length; i++) {\n");
            sb.append("        const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n");
            sb.append("        if (wf?.").append(inputDsId).append(" !== undefined) {\n");
            sb.append("          const ds = wf.").append(inputDsId).append(";\n");
            sb.append("          if (ds.rowcount === 0) ds.addRow();\n");
            for (String col : needsDatasetCols) {
                sb.append("          ds.setColumn(0, '").append(col).append("', args.")
                  .append(safeKey(col)).append(");\n");
            }
            sb.append("          break;\n        }\n      }\n");
            sb.append("    }, { ");
            List<String> argParts = new ArrayList<>();
            for (String col : needsDatasetCols) {
                argParts.add(safeKey(col) + ": " + tsVal(td.get(col)));
            }
            sb.append(String.join(", ", argParts)).append(" });\n\n");
        }

        // 유효성 검사 — 입력값이 Dataset에 반영되었는지 확인
        if (!td.isEmpty()) {
            sb.append("    // ── 유효성 검사: 입력값 Dataset 반영 확인 ──────────────────────\n");
            sb.append("    const validErrors = await frame.evaluate(function(cols) {\n");
            sb.append("      try {\n");
            sb.append("        const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n");
            sb.append("        for (let i = 0; i < mdi?.frames?.length; i++) {\n");
            sb.append("          const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n");
            sb.append("          if (!wf?.").append(inputDsId).append(") continue;\n");
            sb.append("          const ds = wf.").append(inputDsId).append(";\n");
            sb.append("          if (ds.rowcount === 0) return ['데이터셋 행 없음'];\n");
            sb.append("          const errors = [];\n");
            sb.append("          const entries = Object.entries(cols);\n");
            sb.append("          for (let j = 0; j < entries.length; j++) {\n");
            sb.append("            const col = entries[j][0], expVal = entries[j][1];\n");
            sb.append("            if (expVal && String(ds.getColumn(0, col) ?? '') === '')\n");
            sb.append("              errors.push(col + ': 값 미반영 (기대: ' + expVal + ')');\n");
            sb.append("          }\n");
            sb.append("          return errors;\n");
            sb.append("        }\n");
            sb.append("        return [];\n");
            sb.append("      } catch(e) { return [String(e)]; }\n");
            sb.append("    }, { ");
            List<String> valParts = new ArrayList<>();
            for (Map.Entry<String, String> e : td.entrySet()) {
                valParts.add("'" + e.getKey() + "': " + tsVal(e.getValue()));
            }
            sb.append(String.join(", ", valParts)).append(" }).catch(() => []);\n");
            sb.append("    logResult('입력값 유효성', validErrors.length === 0 ? 'PASS' : validErrors.join(' | '));\n");
            sb.append("    expect(validErrors, '입력값이 Dataset에 반영되지 않음').toHaveLength(0);\n\n");
        }

        sb.append("    // ── 저장 버튼 클릭 + 응답 대기 ────────────────────────────────\n");
        sb.append("    const savePromise = page.waitForResponse(\n");
        sb.append("      res => res.url().includes('").append(esc(url)).append("') && res.status() === 200,\n");
        sb.append("      { timeout: 15000 }\n");
        sb.append("    ).catch(() => null);\n\n");
        sb.append("    logAction('").append(saveBtnId).append(" 클릭');\n");
        sb.append("    await clickMainFormButton(frame, '").append(saveBtnId).append("');\n\n");
        sb.append("    await assertNexacroResponse(await savePromise, '").append(methodName).append(".do');\n");
        sb.append("    logResult('저장 완료', true);\n\n");

        if ("INSERT".equals(crudType)) {
            sb.append("    // ── 저장 후 키 값 추출 (다음 TC 공유용) ──────────────────────\n");
            sb.append("    savedRecordKey = await frame.evaluate(() => {\n");
            sb.append("      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n");
            sb.append("      if (!mdi) return '';\n");
            sb.append("      for (let i = 0; i < mdi.frames?.length; i++) {\n");
            sb.append("        const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n");
            sb.append("        const ds = wf?.").append(!outputDsId.isEmpty() ? outputDsId : "ds_list").append(";\n");
            sb.append("        if (ds !== undefined && ds.rowcount > 0)\n");
            sb.append("          return String(ds.getColumn(0, ds.getColumnID(0)) ?? '');\n");
            sb.append("      }\n");
            sb.append("      return '';\n");
            sb.append("    }).catch(() => '');\n");
            sb.append("    logResult('저장 키', savedRecordKey);\n\n");
        }
        sb.append(buildExpectedResultAsserts(expected, crudType));
        sb.append("    await page.screenshot({ path: 'test-results/").append(screenshotPfx).append("-").append(tcLabel).append("-save.png' });\n");
    }

    private void buildIntegDeleteBlock(StringBuilder sb, Map<String, Object> s,
            Map<String, String> td, String url, String inputDsId,
            String methodName, String funcName, String tcLabel, int no, String screenshotPfx, String expected) {
        String outputDsId = str(s, "outputDsId");
        if (outputDsId.isEmpty()) outputDsId = "ds_list";

        // 실제 삭제 버튼 id — 저장 버튼과 마찬가지로 화면별 실제 id를 우선 사용한다.
        String delBtnId = str(s, "btnId");
        if (delBtnId.isEmpty()) delBtnId = "btn_delete";

        sb.append("    // ── 삭제 대상 선택 ────────────────────────────────────────────\n");
        sb.append("    if (!savedRecordKey) {\n");
        sb.append("      test.skip(true, '등록 TC 미실행 또는 키 값 미발급'); return;\n");
        sb.append("    }\n\n");

        // 등록 TC에서 채번된 savedRecordKey에 해당하는 행을 그리드에서 실제로 찾아
        // 선택한 뒤에만 삭제 버튼을 클릭한다. (예전에는 선택 과정 없이 바로 삭제 버튼을
        // 눌러 저장 직후 그리드의 "현재 행"이 우연히 맞기를 가정하는 문제가 있었다.)
        sb.append("    // ── 등록된 행 검색·선택 (저장 직후 현재 행에 의존하지 않음) ─────\n");
        sb.append("    const rowFound = await frame.evaluate((key) => {\n");
        sb.append("      try {\n");
        sb.append("        const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n");
        sb.append("        for (let i = 0; i < mdi?.frames?.length; i++) {\n");
        sb.append("          const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n");
        sb.append("          const ds = wf?.").append(outputDsId).append(";\n");
        sb.append("          if (ds === undefined) continue;\n");
        sb.append("          for (let r = 0; r < ds.rowcount; r++) {\n");
        sb.append("            if (String(ds.getColumn(r, ds.getColumnID(0)) ?? '') === key) {\n");
        sb.append("              ds.set_rowposition(r);\n");
        sb.append("              return true;\n");
        sb.append("            }\n");
        sb.append("          }\n");
        sb.append("        }\n");
        sb.append("        return false;\n");
        sb.append("      } catch { return false; }\n");
        sb.append("    }, savedRecordKey).catch(() => false);\n");
        sb.append("    logResult('삭제 대상 행 검색', rowFound ? '찾음(row 선택됨)' : '못 찾음');\n");
        sb.append("    if (!rowFound) {\n");
        sb.append("      test.skip(true, '등록한 키(' + savedRecordKey + ')를 그리드(").append(outputDsId).append(")에서 찾지 못함'); return;\n");
        sb.append("    }\n\n");

        sb.append("    const delPromise = page.waitForResponse(\n");
        sb.append("      res => res.url().includes('").append(esc(url)).append("') && res.status() === 200,\n");
        sb.append("      { timeout: 15000 }\n");
        sb.append("    ).catch(() => null);\n\n");
        sb.append("    logAction('").append(delBtnId).append(" 클릭');\n");
        sb.append("    await clickMainFormButton(frame, '").append(delBtnId).append("');\n\n");
        sb.append("    await assertNexacroResponse(await delPromise, '").append(methodName).append(".do');\n");
        sb.append("    logResult('삭제 완료', true);\n");
        sb.append(buildExpectedResultAsserts(expected, "DELETE"));
        sb.append("    await page.screenshot({ path: 'test-results/").append(screenshotPfx).append("-").append(tcLabel).append("-delete.png' });\n");
    }

    // ──────────────────────────────────────────────────────────────────────
    // 예상결과 파싱 → expect() 생성
    // ──────────────────────────────────────────────────────────────────────

    /**
     * 시나리오 expectedResult 텍스트를 파싱해 의미 있는 Playwright expect() 구문을 생성한다.
     *
     * SELECT: 건수 조건 파싱 ("1건 이상" → toBeGreaterThan(0), "0건" → toBe(0))
     * INSERT/UPDATE: 재조회 후 savedRecordKey 목록 존재 확인
     * DELETE: 재조회 후 savedRecordKey 목록 제거 확인
     */
    private String buildExpectedResultAsserts(String expected, String crudType) {
        if (expected == null || expected.trim().isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        sb.append("    // ── 예상결과 검증 ────────────────────────────────────────────\n");
        sb.append("    // 시나리오 예상결과: ").append(cmt(expected)).append("\n");

        boolean isSelect = "SELECT".equals(crudType);
        boolean isInsert = "INSERT".equals(crudType);
        boolean isUpdate = "UPDATE".equals(crudType);
        boolean isDelete = "DELETE".equals(crudType);

        // ── 건수 패턴: "1건 이상", "0건", "3건" ────────────────────────────
        java.util.regex.Matcher mCnt = java.util.regex.Pattern
            .compile("(\\d+)\\s*건(\\s*이상)?")
            .matcher(expected);
        boolean hasCountAssert = false;
        if (mCnt.find()) {
            int n      = Integer.parseInt(mCnt.group(1));
            boolean orMore = mCnt.group(2) != null && !mCnt.group(2).trim().isEmpty();
            if (n == 0 && !orMore) {
                sb.append("    expect(rowCount, '예상결과: 0건').toBe(0);\n");
            } else if (orMore && n == 0) {
                // "0건 이상"은 데이터 존재 기대 (gold 규칙) — 0 허용이 아니라 1건 이상
                sb.append("    expect(rowCount, '예상결과: 1건 이상').toBeGreaterThan(0);\n");
            } else if (orMore) {
                sb.append("    expect(rowCount, '예상결과: ").append(n)
                  .append("건 이상').toBeGreaterThanOrEqual(").append(n).append(");\n");
            } else {
                sb.append("    expect(rowCount, '예상결과: 정확히 ").append(n)
                  .append("건').toBe(").append(n).append(");\n");
            }
            hasCountAssert = true;
        }

        // ── 결과 없음 패턴 ──────────────────────────────────────────────
        if (!hasCountAssert && (expected.contains("결과 없") || expected.contains("조회되지 않") ||
                (expected.contains("없") && expected.contains("조회")))) {
            sb.append("    expect(rowCount, '예상결과: 조회 결과 없음').toBe(0);\n");
            hasCountAssert = true;
        }

        // ── SELECT 기본: 데이터 존재 기대 (gold — expectZero가 아니면 1건 이상) ──────
        if (isSelect && !hasCountAssert) {
            sb.append("    expect(rowCount, '예상결과: 목록 1건 이상 조회').toBeGreaterThan(0);\n");
        }

        // ── INSERT/UPDATE: 저장 후 재조회 → savedRecordKey 목록 존재 확인 ──
        if ((isInsert || isUpdate) && (
                expected.contains("저장") || expected.contains("등록") || expected.contains("수정") ||
                expected.contains("완료") || expected.contains("성공") || expected.contains("반영") ||
                expected.contains("표시") || expected.contains("추가"))) {
            sb.append("    // 저장 후 재조회 — savedRecordKey로 신규/수정 행 존재 확인\n");
            sb.append("    if (savedRecordKey) {\n");
            sb.append("      await clickMainFormButton(frame, 'btn_search');\n");
            sb.append("      await waitForAutoSearch(frame, 8000);\n");
            sb.append("      const keyExists = await frame.evaluate((key) => {\n");
            sb.append("        try {\n");
            sb.append("          const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n");
            sb.append("          for (let i = 0; i < mdi?.frames?.length; i++) {\n");
            sb.append("            const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n");
            sb.append("            const ds = wf?.ds_list ?? wf?.ds_output ?? wf?.ds_result;\n");
            sb.append("            if (!ds) continue;\n");
            sb.append("            for (let r = 0; r < ds.rowcount; r++) {\n");
            sb.append("              for (let c = 0; c < ds.colcount; c++) {\n");
            sb.append("                if (String(ds.getColumn(r, ds.getColumnID(c)) ?? '') === key) return true;\n");
            sb.append("              }\n");
            sb.append("            }\n");
            sb.append("          }\n");
            sb.append("          return false;\n");
            sb.append("        } catch { return false; }\n");
            sb.append("      }, savedRecordKey).catch(() => false);\n");
            sb.append("      logResult('저장 후 목록 반영 (key=' + savedRecordKey + ')', keyExists, true);\n");
            sb.append("      expect(keyExists, '예상결과: 저장된 행이 목록에 표시되어야 함').toBe(true);\n");
            sb.append("    }\n");
        }

        // ── DELETE: 삭제 후 재조회 → savedRecordKey 목록 제거 확인 ─────────
        if (isDelete && (expected.contains("삭제") || expected.contains("제거") || expected.contains("완료"))) {
            sb.append("    // 삭제 후 재조회 — savedRecordKey가 목록에서 사라졌는지 확인\n");
            sb.append("    if (savedRecordKey) {\n");
            sb.append("      await clickMainFormButton(frame, 'btn_search');\n");
            sb.append("      await waitForAutoSearch(frame, 8000);\n");
            sb.append("      const keyGone = await frame.evaluate((key) => {\n");
            sb.append("        try {\n");
            sb.append("          const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n");
            sb.append("          for (let i = 0; i < mdi?.frames?.length; i++) {\n");
            sb.append("            const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n");
            sb.append("            const ds = wf?.ds_list ?? wf?.ds_output ?? wf?.ds_result;\n");
            sb.append("            if (!ds) continue;\n");
            sb.append("            for (let r = 0; r < ds.rowcount; r++) {\n");
            sb.append("              for (let c = 0; c < ds.colcount; c++) {\n");
            sb.append("                if (String(ds.getColumn(r, ds.getColumnID(c)) ?? '') === key) return false;\n");
            sb.append("              }\n");
            sb.append("            }\n");
            sb.append("          }\n");
            sb.append("          return true;\n");
            sb.append("        } catch { return true; }\n");
            sb.append("      }, savedRecordKey).catch(() => true);\n");
            sb.append("      logResult('삭제 후 목록 제거 (key=' + savedRecordKey + ')', keyGone, true);\n");
            sb.append("      expect(keyGone, '예상결과: 삭제된 행이 목록에서 사라져야 함').toBe(true);\n");
            sb.append("    }\n");
        }

        return sb.toString();
    }

    // ──────────────────────────────────────────────────────────────────────
    // 단위 TC 블록
    // ──────────────────────────────────────────────────────────────────────

    private String buildUnitTcBlock(Map<String, Object> s, String sourceName) {
        int    no             = intVal(s, "no");
        String scenarioId     = str(s, "scenarioId");
        String testName       = str(s, "testName");
        String url            = str(s, "url");
        String crudType       = str(s, "crudType");
        String expected       = str(s, "expectedResult");
        String inputDsId      = str(s, "inputDsId");
        if (inputDsId.isEmpty()) {
            inputDsId = "SELECT".equals(crudType) || "비정상".equals(crudType) ? "ds_search" : "ds_main";
        }
        String methodName     = extractMethodName(url);
        String menuId         = str(s, "menuId");   // CSRF 서버 세션 폼 등록용 (없으면 no-op)

        // ── ensureSessionReady 의 pgmId 인자는 각 시나리오 자신의 sourceName 을 사용해야 한다.
        //   파일 파라미터 sourceName 은 첫 시나리오 기준이라 다른 화면(예: HRM_0130M vs PUR_0910M)
        //   시나리오가 섞이면 잘못된 폼이 등록되어 btn_search 클릭이 엉뚱한 getList.do 를 호출하고
        //   실제 대상 URL 의 waitForResponse 는 타임아웃된다.
        //   시나리오에 sourceName 이 없거나 숫자 뿐이면 URL 에서 재추출, 그것도 실패하면 파일 폴백 사용.
        String tcSourceName = str(s, "sourceName");
        if (tcSourceName.isEmpty() || tcSourceName.matches("\\d{1,4}")) {
            String fromUrl = extractScreenFromUrl(url);
            if (!fromUrl.isEmpty()) tcSourceName = fromUrl;
        }
        if (tcSourceName.isEmpty()) tcSourceName = sourceName;   // 최종 폴백 (기존 동작 유지)
        boolean isNegative    = "비정상".equals(crudType) || scenarioId.contains("_NEG");
        boolean usesSharedKey = boolVal(s, "usesSharedKey");
        String returnsKeyCol  = str(s, "returnsKeyCol");
        String sharedKeyCol   = str(s, "sharedKeyCol");
        if (sharedKeyCol.isEmpty()) sharedKeyCol = returnsKeyCol; // INSERT의 returnsKeyCol 재사용

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> extraDatasets = s.get("extraDatasets") instanceof List
                ? (List<Map<String, Object>>) s.get("extraDatasets") : new ArrayList<>();

        // 검색조건 — testData 우선, 없으면 inputValues(JSON) 폴백 (parseTestData가 두 포맷 모두 처리)
        Map<String, String> td = parseTestData(condStr(s));

        StringBuilder sb = new StringBuilder();
        sb.append("  /**\n");
        sb.append("   * [no:").append(no).append("] [단위] [").append(crudType).append("] ").append(cmt(testName)).append("\n");
        sb.append("   * URL: ").append(cmt(url)).append("\n");
        sb.append("   * 예상결과: ").append(cmt(expected)).append("\n");
        sb.append("   */\n");
        sb.append("  test('[no:").append(no).append("] [단위] [").append(crudType)
          .append("] ").append(esc(testName)).append("', async ({ workerPage: page }) => {\n");
        sb.append("    logTestStart('[no:").append(no).append("] [단위] ").append(esc(testName)).append("');\n");
        sb.append("    const formKey = await ensureSessionReady(page, '").append(escTs(menuId))
          .append("', '").append(escTs(tcSourceName)).append("');\n\n");

        Map<String, Map<String, String>> inputSelector = getInputSelector(s);
        // 실제 버튼 id — ScenarioBuilderService가 gfn_tran(svcId) 호출을 추적해 채운 "btnId"를
        // 우선 사용한다(통합 시나리오와 동일 원칙). 못 찾았을 때만 crudType 기반 관례명으로 폴백.
        String btnId = str(s, "btnId");
        if (btnId.isEmpty()) btnId = crudTypeToMainBtn(crudType);
        String outputDsId = str(s, "outputDsId");
        if (outputDsId.isEmpty()) outputDsId = "ds_list";

        // DELETE usesSharedKey 가드 — 선행 INSERT TC가 savedKey를 채번해야 실행 가능
        if (usesSharedKey) {
            sb.append("    if (!savedKey) {\n");
            sb.append("      test.skip(true, 'no:").append(no - 1)
              .append(" INSERT TC 미실행 또는 채번 실패 — 선행 TC 확인 필요');\n");
            sb.append("      return;\n");
            sb.append("    }\n");
            if (!sharedKeyCol.isEmpty()) {
                sb.append("    logInput('").append(inputDsId).append(".").append(sharedKeyCol).append("', savedKey);\n\n");
                // 그리드를 실제로 클릭하는 대신, savedKey에 해당하는 행을 dataset에서 찾아 선택
                // (행 선택 이후의 버튼 클릭은 실제 컴포넌트 API로 수행 — triggerNexacroButton)
                sb.append("    // ── 삭제 대상 행 선택 (").append(sharedKeyCol).append("==savedKey) ──────────\n");
                sb.append("    if (formKey) {\n");
                sb.append("      const rowSelected = await selectNexacroRowByKey(page, formKey, '")
                  .append(outputDsId).append("', '").append(sharedKeyCol).append("', savedKey);\n");
                sb.append("      logResult('삭제 대상 행 선택', rowSelected, true);\n");
                sb.append("      expect(rowSelected, '").append(outputDsId).append("에서 ").append(sharedKeyCol)
                  .append("=savedKey 행을 찾지 못함').toBe(true);\n");
                sb.append("    }\n\n");
            }
        } else if (!td.isEmpty()) {
            for (Map.Entry<String, String> e : td.entrySet()) {
                sb.append("    logInput('").append(inputDsId).append(".").append(e.getKey())
                  .append("', ").append(tsVal(e.getValue())).append(");\n");
            }
            sb.append("\n");

            // ── 화면 컴포넌트에 실제 값 입력 ─────────────────────────────────
            // inputSelector에 매핑(주로 Combo)이 있으면 그 compId를 신뢰도 높게 사용하고,
            // 매핑이 없는 컬럼은 컬럼명을 compId로 그대로 시도한다 — 이 코드베이스의 검색조건
            // Edit 컴포넌트는 관례상 컬럼명과 ID가 동일하다(예: SCH_DEPT_NM 컬럼 ↔ SCH_DEPT_NM Edit).
            // 그리드 셀 바인딩처럼 독립 컴포넌트가 없는 컬럼은 setNexacroComponentValue가 false를
            // 반환하므로 경고만 남기고 계속 진행한다(전체 TC를 실패시키지 않음).
            sb.append("    // ── 화면 컴포넌트 실제 입력 (formKey 있을 때만) ──────────────\n");
            sb.append("    if (formKey) {\n");
            for (Map.Entry<String, String> e : td.entrySet()) {
                String col = e.getKey();
                String val = e.getValue();
                Map<String, String> compInfo = inputSelector.get(col.toUpperCase());
                boolean mappedExplicit = compInfo != null && compInfo.containsKey("compId");
                String compId   = mappedExplicit ? compInfo.get("compId") : col;
                String compType = mappedExplicit ? compInfo.get("compType") : "Edit";
                String label    = mappedExplicit ? compInfo.get("label") : null;
                sb.append("      // ").append(compId).append(" (").append(compType)
                  .append(label != null && !label.isEmpty() ? ", \"" + label + "\"" : "")
                  .append(") — ").append(inputDsId).append(".").append(col).append("\n");
                sb.append("      { const ok = await setNexacroComponentValue(page, formKey, '")
                  .append(compId).append("', ").append(tsVal(val)).append(");\n");
                if (mappedExplicit) {
                    sb.append("        logResult('").append(compId).append(" 화면 입력', ok, true); expect(ok).toBe(true); }\n");
                } else {
                    sb.append("        logResult('").append(compId).append(" 화면 입력', ok);\n");
                    sb.append("        if (!ok) console.warn('  ⚠️  ").append(compId)
                      .append(" 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }\n");
                }
                if ("Combo".equalsIgnoreCase(compType)) {
                    sb.append("      { const cv = await getNexacroComponentValue(page, formKey, '")
                      .append(compId).append("'); logResult('").append(compId).append(".value', cv); expect(cv).toBe(")
                      .append(tsVal(val)).append("); }\n");
                }
            }
            sb.append("    }\n\n");

            // extraDatasets 컬럼도 동일 방식으로 실제 컴포넌트 입력 시도 (첫 행 값 기준)
            for (Map<String, Object> extra : extraDatasets) {
                @SuppressWarnings("unchecked")
                List<String> extraCols = extra.get("columns") instanceof List
                    ? (List<String>) extra.get("columns") : new ArrayList<>();
                @SuppressWarnings("unchecked")
                List<Map<String, String>> extraRows = extra.get("rows") instanceof List
                    ? (List<Map<String, String>>) extra.get("rows") : new ArrayList<>();
                if (extraCols.isEmpty() || extraRows.isEmpty()) continue;
                Map<String, String> firstRow = extraRows.get(0);
                sb.append("    if (formKey) {\n");
                for (String col : extraCols) {
                    String val = firstRow.getOrDefault(col, "");
                    sb.append("      { const ok = await setNexacroComponentValue(page, formKey, '")
                      .append(col).append("', ").append(tsVal(val)).append(");\n");
                    sb.append("        logResult('").append(col).append(" 화면 입력', ok);\n");
                    sb.append("        if (!ok) console.warn('  ⚠️  ").append(col)
                      .append(" 컴포넌트를 찾지 못함'); }\n");
                }
                sb.append("    }\n\n");
            }
        }

        // ── 버튼 클릭 → API 호출 (컴포넌트 API로 실제 클릭, apiPost 직접 호출 아님) ──
        sb.append("    // ── ").append(btnId).append(" 클릭 → API 호출 감시 ──────────────────────\n");
        sb.append("    const respPromise = page.waitForResponse(\n");
        sb.append("      res => res.url().includes('").append(esc(url)).append("'),\n");
        sb.append("      { timeout: 15000 }\n");
        sb.append("    ).catch(() => null);\n");
        sb.append("    logAction('").append(btnId).append(" 클릭');\n");
        sb.append("    const clicked = await triggerNexacroButton(page, formKey, '").append(btnId).append("');\n");
        sb.append("    logResult('").append(btnId).append(" 클릭', clicked, true);\n");
        sb.append("    expect(clicked, '").append(btnId).append(" 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);\n\n");
        sb.append("    const resp = await respPromise;\n\n");

        // 응답 검증 — 비정상 케이스는 에러 응답 확인, 정상 케이스는 assertNexacroResponse
        if (isNegative) {
            sb.append("    // 비정상 케이스: 서버 예외 or 에러 응답 확인\n");
            sb.append("    const statusCode = resp ? resp.status() : 0;\n");
            sb.append("    logResult('응답 상태', statusCode);\n");
            sb.append("    const body = resp ? await resp.text() : '';\n");
            sb.append("    logResult('응답 본문 일부', body.substring(0, 200));\n");
            sb.append("    // 시나리오 예상결과: ").append(cmt(expected)).append("\n");
            sb.append("    expect(statusCode).not.toBe(500);  // 서버 에러 없어야 함\n");
            sb.append("    // TODO: 에러 키워드 검증 (아래 주석 해제 후 실제 메시지 입력)\n");
            sb.append("    // expect(body).toContain('에러메시지');\n");
        } else {
            // ── 정상 케이스: 기본 응답 검증 + XML 파싱 + 기대결과 비즈니스 검증
            sb.append("    const nxResult = await assertNexacroResponse(resp, '").append(methodName).append(".do');\n");
            if ("SELECT".equals(crudType)) {
                // SELECT: ds_list 파싱 → 행 수 로그 + 건수 단언 + 필터 컬럼 검증
                sb.append("    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');\n");
                sb.append("    logResult('응답 행 수', `${rows.length}건`);\n");
                sb.append(buildUnitCountAssert(expected));
                sb.append(buildFilterAssertions(td));
            }
            sb.append("    logResult('응답 검증', 'PASS');\n");
            // INSERT 후 채번 키 추출 → savedKey 저장
            if ("INSERT".equals(crudType) && !returnsKeyCol.isEmpty()) {
                sb.append("\n    // 채번 키 추출 → DELETE TC 공유 (savedKey)\n");
                sb.append("    const keyMatch = nxResult.body.match(/").append(returnsKeyCol)
                  .append("[^>]*>([^<]+)<\\/Col>/);\n");
                sb.append("    if (keyMatch) {\n");
                sb.append("      savedKey = keyMatch[1];\n");
                sb.append("      logResult('채번 ").append(returnsKeyCol).append("', savedKey);\n");
                sb.append("    }\n");
            }
        }

        sb.append("    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-").append(no)
          .append("-").append(methodName).append(".png`, fullPage: true });\n");
        sb.append("  });\n\n");

        return sb.toString();
    }

    /**
     * 검색조건 원본 문자열 — testData 우선, 비어있으면 inputValues(JSON) 폴백.
     * (extractor는 inputValues만, 그리드 동기화는 testData를 채우므로 둘 다 지원)
     */
    private String condStr(Map<String, Object> s) {
        String td = str(s, "testData");
        if (td != null && !td.trim().isEmpty()) return td;
        return str(s, "inputValues");
    }

    /** testData 맵 → TS 객체 리터럴 { 'COL': 'val', ... } (gold searchBody 인자용) */
    private String buildParamsObject(Map<String, String> td) {
        if (td == null || td.isEmpty()) return "{}";
        StringBuilder sb = new StringBuilder("{ ");
        boolean first = true;
        for (Map.Entry<String, String> e : td.entrySet()) {
            if (!first) sb.append(", ");
            first = false;
            sb.append("'").append(e.getKey()).append("': ").append(tsVal(e.getValue()));
        }
        sb.append(" }");
        return sb.toString();
    }

    /**
     * 단위 SELECT 건수 단언 — gold 규칙.
     * "N건"(이상 아님)·역방향·결과없음 → toBe(0), 그 외 → toBeGreaterThan(0).
     * ("0건 이상"은 이상이므로 toBeGreaterThan(0))
     */
    private String buildUnitCountAssert(String expected) {
        boolean zero = false;
        if (expected != null) {
            // "0건" 뒤에 "이상"이 붙지 않은 경우만 0건 기대
            if (java.util.regex.Pattern.compile("0\\s*건(?!\\s*이상)").matcher(expected).find()) zero = true;
            if (expected.contains("역방향")) zero = true;
            if (expected.contains("결과 없") || expected.contains("조회되지 않")) zero = true;
        }
        if (zero) {
            return "    expect(rows.length, '예상결과: 0건 기대').toBe(0);\n";
        }
        return "    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);\n";
    }

    /**
     * SELECT 시나리오의 testData 컬럼을 분석해 응답 행 검증 코드를 생성한다.
     * - 날짜 범위 컬럼(SDT/EDT/DT/DATE/YMD), 검색어 컬럼(SCH_/SRCH)은 건너뜀
     * - 나머지 코드성 컬럼은 "반환 행이 있으면 해당 컬럼 값이 입력값과 일치" 검증
     */
    private String buildFilterAssertions(Map<String, String> td) {
        if (td == null || td.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        List<String> filterCols = new ArrayList<>();
        for (Map.Entry<String, String> e : td.entrySet()) {
            String col = e.getKey().toUpperCase();
            // 날짜 범위 컬럼 제외
            if (col.matches(".*(SDT|EDT|_DT|DATE|YMD).*")) continue;
            // 검색어/페이징 컬럼 제외
            if (col.startsWith("SCH_") || col.contains("SRCH") ||
                col.equals("PAGE") || col.equals("PAGESIZE") || col.equals("PAGENUM")) continue;
            filterCols.add(e.getKey());
        }
        if (filterCols.isEmpty()) return "";

        sb.append("    if (rows.length > 0) {\n");
        for (String col : filterCols) {
            String val = td.get(col);
            sb.append("      // 기대결과 검증: ").append(col).append("='").append(val).append("'\n");
            sb.append("      if ('").append(col).append("' in rows[0]) {\n");
            sb.append("        rows.forEach(r => expect(r['").append(col).append("'],\n");
            sb.append("          `반환 행의 ").append(col).append("가 '").append(escTs(val)).append("'이 아님`).toBe('").append(escTs(val)).append("'));\n");
            sb.append("        logResult('").append(col).append(" 필터 검증', 'PASS');\n");
            sb.append("      }\n");
        }
        sb.append("    }\n");
        return sb.toString();
    }

    private List<String> pickDateCols(List<String> cols) {
        List<String> result = new ArrayList<>();
        for (String col : cols) {
            if (col.toUpperCase().matches(".*(SDT|EDT|_DT|DATE|YMD).*")) {
                result.add(col);
            }
        }
        return result.isEmpty() ? (cols.size() > 2 ? cols.subList(0, 2) : new ArrayList<>(cols)) : result;
    }

    private String buildColsArray(List<String> cols) {
        if (cols.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < cols.size(); i++) {
            if (i > 0) sb.append(", ");
            sb.append("'").append(cols.get(i)).append("'");
        }
        return sb.toString();
    }

    private String buildRowsContent(Map<String, String> td, List<String> inputCols, boolean isSelect) {
        // SELECT 전체조회 TC는 조건 없는 빈 행({})으로 전송 — 나머지(INSERT/UPDATE/DELETE)는 TODO
        if (td.isEmpty()) return isSelect ? "{}" : "{ /* TODO: 실제 입력값 기재 */ }";
        StringBuilder sb = new StringBuilder("{ ");
        List<String> parts = new ArrayList<>();
        for (Map.Entry<String, String> e : td.entrySet()) {
            parts.add("'" + e.getKey() + "': " + tsVal(e.getValue()));
        }
        sb.append(String.join(", ", parts)).append(" }");
        return sb.toString();
    }

    // ──────────────────────────────────────────────────────────────────────
    // testData 파싱
    // ──────────────────────────────────────────────────────────────────────

    public Map<String, String> parseTestData(String testDataStr) {
        Map<String, String> result = new LinkedHashMap<>();
        if (testDataStr == null || testDataStr.isEmpty()
                || "기본 조회 조건 사용".equals(testDataStr)) return result;

        // JSON 포맷({"COL":"val",...}) 지원 — inputValues 폴백 경로. KEY=VALUE;로 변환 후 공통 처리
        if (testDataStr.trim().startsWith("{")) {
            StringBuilder conv = new StringBuilder();
            java.util.regex.Matcher jm = java.util.regex.Pattern
                .compile("\"([^\"]+)\"\\s*:\\s*\"([^\"]*)\"").matcher(testDataStr);
            while (jm.find()) {
                conv.append(jm.group(1)).append("=").append(jm.group(2)).append(";");
            }
            testDataStr = conv.toString();
            if (testDataStr.isEmpty()) return result;
        }

        String today     = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String yearStart = today.substring(0, 4) + "0101";

        for (String part : testDataStr.split(";")) {
            part = part.trim();
            int eq = part.indexOf('=');
            if (eq < 0) continue;
            String col = part.substring(0, eq).trim();
            String val = part.substring(eq + 1).trim()
                             .replace("YEAR_START", yearStart)
                             .replace("TODAY",      today);
            // 한글 날짜 설명 → 실제 값으로 치환
            if (val.contains("오늘") || val.contains("today") || val.matches(".*\\d{4}-\\d{2}-\\d{2}.*")) {
                val = today;
            } else if (val.contains("연초") || val.contains("년초") || val.contains("YEAR_START")) {
                val = yearStart;
            }
            // 괄호가 포함된 경우만 설명 텍스트로 간주 → 컬럼명 기반 기본값 생성
            // 예) "입력하세요(필수)" → TEST_REQ_NM
            // 주의) "신규테스트" 같은 순수 한글 입력값은 그대로 통과
            if (val.contains("(")) {
                String colUpper = col.toUpperCase();
                if (colUpper.matches(".*(SDT|START|BEGIN|FROM).*")) val = yearStart;
                else if (colUpper.matches(".*(EDT|END|TO|UNTIL).*")) val = today;
                else if (colUpper.matches(".*(DT|DATE|YMD).*")) val = today;
                else val = "TEST_" + col.replaceAll("[^A-Za-z0-9]", "_");
            }
            result.put(col, val);
        }
        return result;
    }

    // ──────────────────────────────────────────────────────────────────────
    // 유틸
    // ──────────────────────────────────────────────────────────────────────

    private Map<String, List<Map<String, Object>>> groupByScreen(List<Map<String, Object>> scenarios) {
        Map<String, List<Map<String, Object>>> g = new LinkedHashMap<>();
        for (Map<String, Object> s : scenarios) {
            String key = str(s, "screenId");
            if (key.isEmpty()) key = str(s, "sourceName");
            // URL에서 화면번호 추출 fallback (예: /mis/pur/pur5110/getList.do → pur5110)
            if (key.isEmpty()) key = extractScreenFromUrl(str(s, "url"));
            if (key.isEmpty()) key = "unknown";
            g.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return g;
    }

    /** URL 패턴 /mis/{module}/{screen}/xxx.do 에서 화면번호 추출 */
    private String extractScreenFromUrl(String url) {
        if (url == null || url.isEmpty()) return "";
        // /mis/pur/pur5110/getList.do → pur5110
        java.util.regex.Matcher m = java.util.regex.Pattern
            .compile("/[a-z]+/([a-zA-Z0-9_]+)/[a-zA-Z0-9_]+\\.do")
            .matcher(url);
        return m.find() ? m.group(1) : "";
    }

    private boolean hasCrud(List<Map<String, Object>> scenarios, String crud) {
        for (Map<String, Object> s : scenarios) {
            if (crud.equals(str(s, "crudType"))) return true;
        }
        return false;
    }

    private String extractMethodName(String url) {
        if (url == null || url.isEmpty()) return "method";
        int last = url.lastIndexOf('/');
        String seg = last >= 0 ? url.substring(last + 1) : url;
        return seg.endsWith(".do") ? seg.substring(0, seg.length() - 3) : seg;
    }

    /** "pur_0010M" → "Pur0010M" (함수명용) */
    private String toFuncName(String screenId) {
        if (screenId == null || screenId.isEmpty()) return "Screen";
        StringBuilder sb = new StringBuilder();
        boolean next = true;
        for (char c : screenId.toCharArray()) {
            if (c == '_') { next = true; continue; }
            sb.append(next ? Character.toUpperCase(c) : c);
            next = false;
        }
        return sb.toString();
    }

    /** TypeScript 값 표현 — 항상 리터럴 문자열로 출력 */
    private String tsVal(String val) {
        if (val == null) return "''";
        return "'" + escTs(val) + "'";
    }

    /** 객체 키로 사용 가능한 이름으로 변환 */
    private String safeKey(String col) {
        return col.replaceAll("[^a-zA-Z0-9_]", "_");
    }

    private String esc(String s) {
        if (s == null) return "";
        // 단일따옴표 TS 문자열 리터럴용 — 백슬래시를 먼저 이스케이프해야 \t·\x 등 잘못된 이스케이프 생성을 막는다.
        return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ").replace("\r", " ");
    }

    /**
     * 주석(블록 / 라인) 안전화.
     *  - 개행 제거: 라인 주석(//)에서 뒤 텍스트가 코드로 흘러내리는 것을 방지
     *  - "*&#47;" 분리: 블록 주석(&#47;** *&#47;)을 조기 종료시키는 것을 방지
     */
    private String cmt(String s) {
        if (s == null) return "";
        return s.replace("\r", " ").replace("\n", " ").replace("*/", "* /");
    }

    /** 백틱 템플릿 리터럴(`...`)용 — 백슬래시·백틱·${ 를 이스케이프 */
    private String escTpl(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${");
    }

    private String escTs(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("'", "\\'").replace("\"", "\\\"").replace("\n", "\\n");
    }

    private String str(Map<String, Object> m, String key) {
        Object v = m.get(key);
        return v != null ? String.valueOf(v) : "";
    }

    private int intVal(Map<String, Object> m, String key) {
        Object v = m.get(key);
        if (v instanceof Number) return ((Number) v).intValue();
        try { return Integer.parseInt(String.valueOf(v)); } catch (Exception e) { return 0; }
    }

    private boolean boolVal(Map<String, Object> m, String key) {
        Object v = m.get(key);
        if (v instanceof Boolean) return (Boolean) v;
        if (v instanceof String) {
            String s = ((String) v).trim();
            return "true".equalsIgnoreCase(s) || "Y".equalsIgnoreCase(s);
        }
        return false;
    }

    /** 추가 데이터셋 행 내용 생성 — { 'COL': 'VAL', ... } */
    private String buildExtraRowContent(List<String> cols, Map<String, String> row) {
        if (cols.isEmpty()) return "{ /* TODO: 실제 입력값 기재 */ }";
        StringBuilder sb = new StringBuilder("{ ");
        List<String> parts = new ArrayList<>();
        for (String col : cols) {
            String val = row.getOrDefault(col, "");
            parts.add("'" + col + "': " + tsVal(val));
        }
        sb.append(String.join(", ", parts)).append(" }");
        return sb.toString();
    }

    // ──────────────────────────────────────────────────────────────────────
    // 시나리오흐름(preCondition) 파싱 + Nexacro 단계별 test.step() 생성
    // ──────────────────────────────────────────────────────────────────────

    /** 한국어 버튼 레이블 → Nexacro 버튼 ID 매핑 */
    private static final java.util.LinkedHashMap<String, String> BUTTON_MAP;
    static {
        BUTTON_MAP = new java.util.LinkedHashMap<>();
        BUTTON_MAP.put("조회",   "btn_search");
        BUTTON_MAP.put("검색",   "btn_search");
        BUTTON_MAP.put("신규",   "btn_insert");
        BUTTON_MAP.put("등록",   "btn_insert");
        BUTTON_MAP.put("저장",   "btn_save");
        BUTTON_MAP.put("수정",   "btn_save");
        BUTTON_MAP.put("삭제",   "btn_delete");
        BUTTON_MAP.put("신청",   "btn_confirm");
        BUTTON_MAP.put("완료",   "btn_confirm");
        BUTTON_MAP.put("취소",   "btn_cancel");
        BUTTON_MAP.put("출력",   "btn_print");
        BUTTON_MAP.put("엑셀",   "btn_excel");
        BUTTON_MAP.put("확인",   "btn_ok");
        BUTTON_MAP.put("초기화", "btn_init");
    }

    /** 시나리오흐름 텍스트 → 단계별 리스트 (> 또는 \n 분리) */
    private List<String> parsePreConditionSteps(String preCondition) {
        if (preCondition == null || preCondition.trim().isEmpty()) return Collections.emptyList();
        List<String> steps = new ArrayList<>();
        for (String line : preCondition.split("\\r?\\n")) {
            String t = line.trim();
            if (t.isEmpty()) continue;
            if (t.contains(">")) {
                for (String part : t.split("\\s*>\\s*")) {
                    String p = part.replaceAll("^[\\d①②③④⑤⑥⑦⑧⑨⑩]+[.)\\s]+", "").trim();
                    if (!p.isEmpty()) steps.add(p);
                }
            } else {
                String p = t.replaceAll("^[\\d①②③④⑤⑥⑦⑧⑨⑩]+[.)\\s]+", "").trim();
                if (!p.isEmpty()) steps.add(p);
            }
        }
        return steps;
    }

    /** 단계 텍스트에서 [버튼명] → Nexacro btn ID 매핑 (없으면 null) */
    private String extractButtonId(String step) {
        java.util.regex.Matcher m = java.util.regex.Pattern
            .compile("\\[([^\\]]+)\\]").matcher(step);
        while (m.find()) {
            String label = m.group(1).trim();
            for (Map.Entry<String, String> e : BUTTON_MAP.entrySet()) {
                if (label.contains(e.getKey())) return e.getValue();
            }
        }
        return null;
    }

    private boolean isNavStep(String step) {
        return step.contains("메뉴") || step.contains("이동") || step.contains("접속") ||
               step.contains("화면") || step.contains("진입");
    }

    private boolean isDataEntryStep(String step) {
        return step.contains("입력") || step.contains("설정") || step.contains("선택") ||
               step.contains("조건") || step.contains("값");
    }

    private boolean isVerifyStep(String step) {
        return step.contains("확인") || step.contains("결과") || step.contains("검증") ||
               step.contains("목록") || step.contains("조회됨") || step.contains("완료됨");
    }

    /** crudType → 메인 API 버튼 ID */
    private String crudTypeToMainBtn(String crudType) {
        if (crudType == null) return "btn_search";
        switch (crudType.toUpperCase()) {
            case "SELECT": return "btn_search";
            case "INSERT": case "UPDATE": return "btn_save";
            case "DELETE": return "btn_delete";
            default: return "btn_search";
        }
    }

    /**
     * preCondition 단계 기반 Nexacro 화면 테스트 블록 생성.
     * 각 단계를 test.step()으로 감싸 Playwright UI에서 단계별 결과를 추적할 수 있게 한다.
     */
    private void buildStepDrivenBlock(StringBuilder sb,
            Map<String, Object> s, Map<String, String> td,
            String url, String inputDsId, String methodName,
            String funcName, String tcLabel, int no,
            String crudType, String screenshotPfx, String expected,
            List<String> steps) {

        String mainBtnId = crudTypeToMainBtn(crudType);
        boolean apiStepEmitted = false;

        sb.append("\n    // ── 시나리오흐름 기반 Nexacro 화면 단계 테스트 ────────────────\n");

        // SELECT/DELETE: 초기 자동조회 안정화
        if (!"INSERT".equals(crudType) && !"UPDATE".equals(crudType)) {
            sb.append("    await waitForAutoSearch(frame);\n\n");
        }

        for (String step : steps) {
            String btnId = extractButtonId(step);

            if (btnId != null) {
                boolean isMainBtn = btnId.equals(mainBtnId) && !apiStepEmitted;
                sb.append("    await test.step('").append(esc(step)).append("', async () => {\n");

                if (isMainBtn) {
                    apiStepEmitted = true;
                    if ("btn_search".equals(btnId)) {
                        if (!td.isEmpty()) {
                            for (Map.Entry<String, String> e : td.entrySet()) {
                                sb.append("      logInput('").append(e.getKey()).append("', ").append(tsVal(e.getValue())).append(");\n");
                                sb.append("      await setSearchColumn(frame, '").append(e.getKey()).append("', ").append(tsVal(e.getValue())).append(");\n");
                            }
                            sb.append("\n");
                        }
                        sb.append("      const respPromise = page.waitForResponse(\n");
                        sb.append("        res => res.url().endsWith('").append(esc(url)).append("') && res.status() === 200,\n");
                        sb.append("        { timeout: 15000 }\n").append("      ).catch(() => null);\n");
                        sb.append("      logAction('btn_search 클릭');\n");
                        sb.append("      await clickMainFormButton(frame, 'btn_search');\n");
                        sb.append("      await assertNexacroResponse(await respPromise, '").append(methodName).append(".do');\n");

                    } else if ("btn_save".equals(btnId)) {
                        if ("INSERT".equals(crudType)) {
                            sb.append("      logAction('btn_insert 클릭 — 신규 행 추가');\n");
                            sb.append("      await clickMainFormButton(frame, 'btn_insert');\n");
                            sb.append("      await frame.page().waitForTimeout(500);\n\n");
                        }
                        if (!td.isEmpty()) {
                            for (Map.Entry<String, String> e : td.entrySet()) {
                                sb.append("      logInput('").append(e.getKey()).append("', ").append(tsVal(e.getValue())).append(");\n");
                            }
                            sb.append("      await frame.evaluate((args) => {\n");
                            sb.append("        const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;\n");
                            sb.append("        if (!mdi) return;\n");
                            sb.append("        for (let i = 0; i < mdi.frames?.length; i++) {\n");
                            sb.append("          const wf = (mdi.frames[i]?.form?.div_workForm?.form ?? mdi.frames[i]?.form);\n");
                            sb.append("          if (wf?.").append(inputDsId).append(" !== undefined) {\n");
                            sb.append("            const ds = wf.").append(inputDsId).append(";\n");
                            sb.append("            if (ds.rowcount === 0) ds.addRow();\n");
                            for (Map.Entry<String, String> e : td.entrySet()) {
                                sb.append("            ds.setColumn(0, '").append(e.getKey()).append("', args.").append(safeKey(e.getKey())).append(");\n");
                            }
                            sb.append("            break;\n          }\n        }\n");
                            sb.append("      }, { ");
                            List<String> ap = new ArrayList<>();
                            for (Map.Entry<String, String> e : td.entrySet()) ap.add(safeKey(e.getKey()) + ": " + tsVal(e.getValue()));
                            sb.append(String.join(", ", ap)).append(" });\n\n");
                        }
                        sb.append("      const savePromise = page.waitForResponse(\n");
                        sb.append("        res => res.url().includes('").append(esc(url)).append("') && res.status() === 200,\n");
                        sb.append("        { timeout: 15000 }\n").append("      ).catch(() => null);\n");
                        sb.append("      logAction('btn_save 클릭');\n");
                        sb.append("      await clickMainFormButton(frame, 'btn_save');\n");
                        sb.append("      await assertNexacroResponse(await savePromise, '").append(methodName).append(".do');\n");
                        sb.append("      logResult('저장 완료', true);\n");

                    } else if ("btn_delete".equals(btnId)) {
                        sb.append("      if (!savedRecordKey) { test.skip(true, '등록 TC 미실행'); return; }\n");
                        sb.append("      const delPromise = page.waitForResponse(\n");
                        sb.append("        res => res.url().includes('").append(esc(url)).append("') && res.status() === 200,\n");
                        sb.append("        { timeout: 15000 }\n").append("      ).catch(() => null);\n");
                        sb.append("      logAction('btn_delete 클릭');\n");
                        sb.append("      await clickMainFormButton(frame, 'btn_delete');\n");
                        sb.append("      await assertNexacroResponse(await delPromise, '").append(methodName).append(".do');\n");
                        sb.append("      logResult('삭제 완료', true);\n");
                    } else {
                        // btn_confirm 등 기타 API 버튼
                        sb.append("      const apiPromise = page.waitForResponse(\n");
                        sb.append("        res => res.url().includes('").append(esc(url)).append("') && res.status() === 200,\n");
                        sb.append("        { timeout: 15000 }\n").append("      ).catch(() => null);\n");
                        sb.append("      logAction('").append(btnId).append(" 클릭');\n");
                        sb.append("      await clickMainFormButton(frame, '").append(btnId).append("');\n");
                        sb.append("      await assertNexacroResponse(await apiPromise, '").append(methodName).append(".do');\n");
                        sb.append("      logResult('처리 완료', true);\n");
                    }
                } else {
                    // 보조 버튼 — API 호출 없음
                    sb.append("      logAction('").append(btnId).append(" 클릭');\n");
                    sb.append("      await clickMainFormButton(frame, '").append(btnId).append("');\n");
                    sb.append("      await frame.page().waitForTimeout(500);\n");
                }
                sb.append("    });\n\n");

            } else if (isNavStep(step)) {
                sb.append("    await test.step('").append(esc(step)).append("', async () => {\n");
                sb.append("      logAction('").append(esc(step)).append(" — beforeAll에서 완료');\n");
                sb.append("    });\n\n");

            } else if (isDataEntryStep(step) && !apiStepEmitted) {
                sb.append("    await test.step('").append(esc(step)).append("', async () => {\n");
                if (!td.isEmpty()) {
                    for (Map.Entry<String, String> e : td.entrySet()) {
                        sb.append("      logInput('").append(e.getKey()).append("', ").append(tsVal(e.getValue())).append(");\n");
                        sb.append("      await setSearchColumn(frame, '").append(e.getKey()).append("', ").append(tsVal(e.getValue())).append(");\n");
                    }
                } else {
                    sb.append("      // TODO: testData 컬럼에 'KEY=VALUE;...' 형식으로 입력값 기재\n");
                }
                sb.append("    });\n\n");

            } else if (isVerifyStep(step)) {
                sb.append("    await test.step('").append(esc(step)).append("', async () => {\n");
                if ("SELECT".equals(crudType)) {
                    sb.append("      const rowCount = await waitForAutoSearch(frame, 5000);\n");
                    sb.append("      logResult('ds_list 행 수', rowCount);\n");
                    sb.append("      expect(rowCount).toBeGreaterThanOrEqual(0);\n");
                }
                sb.append("    });\n\n");
            } else {
                sb.append("    await test.step('").append(esc(step)).append("', async () => {\n");
                sb.append("      logAction('").append(esc(step)).append("');\n");
                sb.append("    });\n\n");
            }
        }

        // preCondition에 API 버튼이 없으면 crudType 기반 폴백
        if (!apiStepEmitted) {
            sb.append("    // ── API 버튼 미포함 → crudType 기반 자동 생성 ───────────────\n");
            if ("SELECT".equals(crudType)) {
                buildIntegSelectBlock(sb, s, td, url, inputDsId, methodName, funcName, tcLabel, no, screenshotPfx, expected);
            } else if ("INSERT".equals(crudType) || "UPDATE".equals(crudType)) {
                buildIntegSaveBlock(sb, s, td, url, inputDsId, methodName, funcName, tcLabel, no, crudType, screenshotPfx, expected);
            } else if ("DELETE".equals(crudType)) {
                buildIntegDeleteBlock(sb, s, td, url, inputDsId, methodName, funcName, tcLabel, no, screenshotPfx, expected);
            }
        } else {
            sb.append(buildExpectedResultAsserts(expected, crudType));
            sb.append("    await page.screenshot({ path: 'test-results/")
              .append(screenshotPfx).append("-").append(tcLabel).append("-nexacro.png' });\n");
        }
    }
}
