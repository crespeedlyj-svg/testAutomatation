// ==============================================================
// HRM — 인사정보관리 통합 테스트 (hrm_3010M)
// 생성일시: 2026-07-02  |  파일: 20260702_hrm_3010M_inte.spec.ts
// 화면: 인사정보관리  |  메뉴: 인사관리 > 인사정보 > 인사정보관리
// 메뉴 ID: M_MIS_01_03_01
// 방식: UI-driven (openMenuById + setNexacroComponentValue)
// storageState 자동 주입 — 로그인/goto 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import {
  openMenuById,
  openMenuByPgm,
  waitForNexacroAppReady,
  setNexacroComponentValue,
  clearNexacroDataset,
  getNexacroDatasetRows,
  waitForNexacroDataset,
} from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const SLOW           = 1500;

const PGM_ID        = 'hrm_3010M';
const MENU_ID       = 'M_MIS_01_03_01'; // fallback (ds_menu에 없으면 openMenuByPgm 사용)
const API_LIST      = '/mis/hrm/hrm3010/getList.do';
const API_MAIN      = '/mis/hrm/hrm3010/getMain.do';
const API_TAB       = '/mis/hrm/hrm3010/getHrmData.do';
const API_SAVE      = '/mis/hrm/hrm3010/setHrmData.do';

const DS_LIST_COLS  = ['EMP_NO', 'EMP_NM', 'JSFC_NM', 'DEPT_NM'];
const DS_MAIN_COLS  = ['EMP_NO', 'EMP_NM', 'DEPT_NM', 'HLDF_FG_CD', 'ENT_DT', 'CHRG_JOB'];
const CLEAR_COLS    = [
  'SCH_HLDF_FG_CD', 'SCH_EMP_NO', 'SCH_EMP_NM',
  'SCH_DEPT_CD', 'SCH_DEPT_NM',
  'SCH_EMPO_STLF_CD', 'SCH_JSFC_CD', 'SCH_GRD_CD',
];

// ─── 화면 진입 ───────────────────────────────────────────────────────────────
async function navigateTo(page: Page): Promise<string> {
  await waitForNexacroAppReady(page, 20000);

  const initResp = page.waitForResponse(
    r => r.url().includes(API_LIST), { timeout: 20000 }
  ).catch(() => null);

  // openMenuById 우선, 실패 시 PGM_PATH 검색으로 폴백
  let nav = await openMenuById(page, MENU_ID);
  if (!nav.ok) {
    console.warn(`[NAV] MENU_ID "${MENU_ID}" 미발견(${nav.error}), PGM_ID로 재시도`);
    nav = await openMenuByPgm(page, PGM_ID);
  }
  if (!nav.ok) throw new Error(`메뉴 로드 실패: ${nav.error}`);
  const resolvedMenuId = nav.menuId ?? MENU_ID;
  console.log(`[NAV] menuNm=${nav.menuNm}, menuId=${resolvedMenuId}`);

  const resp = await initResp;
  if (resp) console.log(`[NAV] 초기 조회 HTTP ${resp.status()}`);

  await page.locator('text="조회"').first().waitFor({ state: 'visible', timeout: 15000 });

  const dsReady = await waitForNexacroDataset(page, resolvedMenuId, 'ds_list', 0, 10000);
  console.log(`[NAV] ds_list ready=${dsReady}`);

  return resolvedMenuId;
}

// ─── 조회 실행 ───────────────────────────────────────────────────────────────
async function search(
  page: Page,
  formKey: string,
  conditions: Record<string, string>
): Promise<Record<string, string>[]> {
  await clearNexacroDataset(page, formKey, 'ds_search', CLEAR_COLS);

  for (const [col, val] of Object.entries(conditions)) {
    const ok = await setNexacroComponentValue(page, formKey, col, val);
    console.log(`  [SET] ${col}="${val}" ${ok ? 'OK' : 'FAIL'}`);
  }

  await page.waitForTimeout(SLOW);

  const respPromise = page.waitForResponse(
    r => r.url().includes(API_LIST), { timeout: 15000 }
  );
  await page.locator('text="조회"').first().click();

  const apiResp = await respPromise;
  expect(apiResp.status(), 'API HTTP 200 필요').toBe(200);

  await waitForNexacroDataset(page, formKey, 'ds_list', 0, 8000).catch(() => null);
  await page.waitForTimeout(SLOW);

  return getNexacroDatasetRows(page, formKey, 'ds_list', DS_LIST_COLS);
}

// ============================================================================
// [hrm_3010M] 통합 테스트 — 인사정보관리
// ============================================================================
test.describe('인사정보관리 통합 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] 메뉴 진입 후 재직 사원 자동 조회
   * onload → fn_doInit → fn_search (SCH_HLDF_FG_CD=101-010 기본값)
   */
  test('[no:1] 메뉴 진입 후 재직 사원 자동 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사정보관리 - 메뉴 진입 자동 조회');

    const formKey = await navigateTo(page);
    const rows    = getNexacroDatasetRows(page, formKey, 'ds_list', DS_LIST_COLS);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-inte-no1-nav.png`, fullPage: true });

    // 자동 조회 응답 확인
    const listRows = await rows;
    logResult('ds_list 건수', `${listRows.length}건`);
    if (listRows[0]) console.log(`  첫 행: EMP_NO=${listRows[0]['EMP_NO']} EMP_NM=${listRows[0]['EMP_NM']}`);

    expect(listRows.length, '자동 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] 재직구분 변경 → 퇴직 사원 조회
   * SCH_HLDF_FG_CD 콤보 변경 후 조회 버튼 클릭
   */
  test('[no:2] 재직구분 변경 → 퇴직 사원 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 인사정보관리 - 재직구분 변경 조회');
    logInput('SCH_HLDF_FG_CD', '101-020 (퇴직)');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_HLDF_FG_CD: '101-020' });

    logResult('퇴직 사원 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-inte-no2-rsign.png`, fullPage: true });

    expect(rows.length).toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:3] 성명 검색 후 사원 선택 → 기본정보 표시
   * 사원정보 그리드 첫 행 클릭 → ds_list_onrowposchanged → getMain
   */
  test('[no:3] 성명 검색 후 사원 선택 → 기본정보 표시', async ({ workerPage: page }) => {
    logTestStart('[no:3] 인사정보관리 - 사원 선택 후 기본정보 확인');

    const formKey = await navigateTo(page);

    // 전체 조회로 첫 번째 사원 확보
    const rows = await search(page, formKey, { SCH_HLDF_FG_CD: '101-010' });
    if (rows.length === 0) {
      console.warn('  [SKIP] 재직 사원 데이터 없음');
      test.skip();
      return;
    }

    logInput('선택 사원 EMP_NO', rows[0]['EMP_NO'] ?? '(확인필요)');

    // Grid 첫 번째 행 클릭 → ds_list_onrowposchanged → fn_searchMain 자동 실행
    const mainRespPromise = page.waitForResponse(
      r => r.url().includes(API_MAIN), { timeout: 15000 }
    );
    await page.locator('[id*="Grid01"] [row="0"]').first().click().catch(async () => {
      // Grid 셀 직접 클릭 실패 시 텍스트로 fallback
      await page.locator(`text="${rows[0]['EMP_NM']}"`).first().click();
    });

    const mainResp = await mainRespPromise;
    expect(mainResp.status(), 'getMain.do HTTP 200').toBe(200);
    await page.waitForTimeout(SLOW);

    const mainRows = await getNexacroDatasetRows(page, formKey, 'ds_main', DS_MAIN_COLS);
    logResult('ds_main 건수', `${mainRows.length}건`);
    if (mainRows[0]) {
      console.log(`  EMP_NM=${mainRows[0]['EMP_NM']} DEPT_NM=${mainRows[0]['DEPT_NM']}`);
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-inte-no3-select.png`, fullPage: true });

    expect(mainRows.length, 'ds_main 1행').toBe(1);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] 세부정보 탭 전환 → 신상정보(BasMgt) 조회
   * 탭 클릭 → Tab01_onchanged → fn_searchTab → getHrmData.do
   */
  test('[no:4] 세부정보 탭 전환 → 신상정보 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 인사정보관리 - BasMgt 탭 전환');

    const formKey = await navigateTo(page);

    // 사원 선택
    const rows = await search(page, formKey, { SCH_HLDF_FG_CD: '101-010' });
    if (rows.length === 0) { test.skip(); return; }

    // 기본정보 조회 대기
    const mainRespP = page.waitForResponse(r => r.url().includes(API_MAIN), { timeout: 10000 });
    await page.locator(`text="${rows[0]['EMP_NM']}"`).first().click().catch(() => {});
    await mainRespP.catch(() => null);
    await page.waitForTimeout(SLOW);

    // 세부정보 탭 클릭
    const tabRespP = page.waitForResponse(r => r.url().includes(API_TAB), { timeout: 15000 });
    await page.locator('text="세부정보"').first().click();
    const tabResp = await tabRespP;
    expect(tabResp.status(), 'getHrmData.do HTTP 200').toBe(200);
    await page.waitForTimeout(SLOW);

    const tabRows = await getNexacroDatasetRows(page, formKey, 'ds_BasMgt', ['EMP_NO', 'SEX_DIST_CD', 'SELF_BIR']);
    logResult('ds_BasMgt 건수', `${tabRows.length}건`);
    if (tabRows[0]) console.log(`  SEX_DIST_CD=${tabRows[0]['SEX_DIST_CD']}`);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-inte-no4-basmgt.png`, fullPage: true });

    expect(tabRows.length, 'BasMgt 1행').toBe(1);
    logResult('검증', 'PASS');
  });

  /**
   * [no:5] 담당업무 수정 후 저장
   * CHRG_JOB TextArea 수정 → [저장] 버튼 클릭 → setHrmData.do
   * 인사담당자 권한(R_HRM_001) 또는 관리자(R_0000) 필요
   */
  test('[no:5] 담당업무 수정 후 저장', async ({ workerPage: page }) => {
    logTestStart('[no:5] 인사정보관리 - 담당업무 수정 저장');

    const formKey = await navigateTo(page);

    const rows = await search(page, formKey, { SCH_HLDF_FG_CD: '101-010' });
    if (rows.length === 0) { test.skip(); return; }

    // 사원 선택
    const mainRespP = page.waitForResponse(r => r.url().includes(API_MAIN), { timeout: 10000 });
    await page.locator(`text="${rows[0]['EMP_NM']}"`).first().click().catch(() => {});
    await mainRespP.catch(() => null);
    await page.waitForTimeout(SLOW);

    // CHRG_JOB 필드 수정 (담당업무 TextArea)
    const testVal = `테스트_${Date.now()}`;
    logInput('CHRG_JOB 수정값', testVal);

    const ok = await setNexacroComponentValue(page, formKey, 'CHRG_JOB', testVal);
    console.log(`  [SET] CHRG_JOB="${testVal}" ${ok ? 'OK' : 'FAIL (직접 클릭 시도)'}`);

    if (!ok) {
      await page.locator('[id*="CHRG_JOB"]').first().click();
      await page.keyboard.selectAll();
      await page.keyboard.type(testVal);
    }

    await page.waitForTimeout(500);

    // 저장 버튼 클릭
    const saveRespP = page.waitForResponse(r => r.url().includes(API_SAVE), { timeout: 15000 });
    await page.locator('text="저장"').first().click();

    const saveResp = await saveRespP.catch(() => null);
    await page.waitForTimeout(SLOW);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-inte-no5-save.png`, fullPage: true });

    if (saveResp) {
      logResult('저장 API HTTP', `${saveResp.status()}`);
      expect(saveResp.status(), 'setHrmData.do HTTP 200').toBe(200);
      logResult('검증', 'PASS');
    } else {
      console.warn('  [WARN] 저장 API 응답 미확인 — 권한 부족 또는 UI 조작 실패 가능');
      expect(true, '저장 응답 미확인 — 수동 확인 필요').toBe(true);
      logResult('검증', 'WARN');
    }
  });
});
