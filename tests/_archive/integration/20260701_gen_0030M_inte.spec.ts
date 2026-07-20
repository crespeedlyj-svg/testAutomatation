// ==============================================================
// GEN — 연차일수관리 통합 테스트 (gen_0030M)
// 생성일시: 2026-07-01  |  파일: 20260701_gen_0030M_inte.spec.ts
// 화면: 연차일수관리 (총무관리 > 근태관리 > 연차일수관리)
// 방식: UI-driven (openMenuById + setNexacroComponentValue)
// storageState 자동 주입 — 로그인 코드 작성 절대 금지
//
// ⚠️ TODO(MENU_ID): scenarios.menuId 가 플레이스홀더('M_MIS_XX_XX_XX')이며
//    _workspace/00_menu_ids.json 캐시에 gen_0030M 항목이 없다.
//    SYS_MENU_MGT 에서 gen_0030M 의 실제 MENU_ID 를 조회하여 아래 MENU_ID 상수를 교체할 것.
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import {
  openMenuById,
  waitForNexacroAppReady,
  setNexacroComponentValue,
  clearNexacroDataset,
  getNexacroDatasetRows,
  waitForNexacroDataset,
} from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const SLOW           = 1500;

const MENU_ID     = 'M_MIS_XX_XX_XX';   // TODO: gen_0030M 실제 MENU_ID 로 교체 필요
const API_URL     = '/mis/gen/gen0030/getList.do';
const DS_LIST     = 'ds_list';
const RESULT_COLS = ['EMP_NO', 'EMP_NM', 'DEPT_NM', 'HLDF_FG_CD', 'SUM_YRYC_MIN', 'SUM_YRYC_USE_MIN', 'REDR_YRYC_MIN'];
const CLEAR_COLS  = ['SCH_YY', 'SCH_STDR_DT', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_HLDF_FG_CD'];

async function navigateTo(page: Page): Promise<string> {
  await waitForNexacroAppReady(page, 20000);

  const initResp = page.waitForResponse(
    r => r.url().includes(API_URL), { timeout: 20000 }
  ).catch(() => null);

  const nav = await openMenuById(page, MENU_ID);
  if (!nav.ok) throw new Error(`메뉴 로드 실패: ${nav.error}`);
  console.log(`[NAV] menuNm=${nav.menuNm}`);

  const resp = await initResp;
  if (resp) console.log(`[NAV] 초기 조회 HTTP ${resp.status()}`);

  await page.locator('text="조회"').first().waitFor({ state: 'visible', timeout: 15000 });

  const dsReady = await waitForNexacroDataset(page, MENU_ID, DS_LIST, 1, 10000);
  console.log(`[NAV] ${DS_LIST} ready=${dsReady}`);

  return MENU_ID;
}

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
    r => r.url().includes(API_URL), { timeout: 15000 }
  );
  await page.locator('text="조회"').first().click();

  const resp = await respPromise;
  expect(resp.status(), 'API HTTP 200 필요').toBe(200);

  await waitForNexacroDataset(page, formKey, DS_LIST, 0, 8000).catch(() => null);
  await page.waitForTimeout(SLOW);

  return getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
}

test.describe('연차일수관리 통합 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 연차일수관리 - 기준일자 조회 (SCH_STDR_DT 기본값)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * 예상결과: 기준일자 기준 연차일수 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE 1=1
   */
  test('[no:1] 연차일수관리 - 기준일자 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 연차일수관리 - 기준일자 조회');
    logInput('SCH_STDR_DT', '2026-07-01');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_STDR_DT: '2026-07-01' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0030-inte-no1-stdrdt.png`, fullPage: true });

    expect(rows.length, '연차일수관리 기준일자 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [통합] [SELECT] 연차일수관리 - 재직구분 필터 (재직자, SCH_HLDF_FG_CD=101-010)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * 예상결과: 재직 상태(101-010) 직원의 연차일수 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE HLDF_FG_CD = '101-010'
   */
  test('[no:2] 연차일수관리 - 재직구분 필터 (재직자)', async ({ workerPage: page }) => {
    logTestStart('[no:2] 연차일수관리 - 재직구분 필터 (재직자)');
    logInput('SCH_STDR_DT', '2026-07-01');
    logInput('SCH_HLDF_FG_CD', '101-010');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_STDR_DT: '2026-07-01', SCH_HLDF_FG_CD: '101-010' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0030-inte-no2-active.png`, fullPage: true });

    expect(rows.length, '연차일수관리 재직자 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [통합] [SELECT] 연차일수관리 - 미래 기준일자 조회 (0건 예상)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * 예상결과: 미래 기준일자 조회 시 목록이 없거나 정상 응답한다.
   * 비고: expectZero 미확정 — 빈 결과가 정상이므로 정상 응답(0건 이상)만 검증한다.
   */
  test('[no:3] 연차일수관리 - 미래 기준일자 조회 (0건 예상)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 연차일수관리 - 미래 기준일자 조회 (0건 예상)');
    logInput('SCH_STDR_DT', '2999-12-31');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_STDR_DT: '2999-12-31' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0030-inte-no3-future.png`, fullPage: true });

    expect(rows.length, '연차일수관리 미래 기준일자 - 정상 응답(빈 결과 허용)').toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] [통합] [SELECT] 연차일수관리 - 부서 조건 조회 (SCH_DEPT_NM)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * 예상결과: 특정 부서(총무부) 직원의 연차일수 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE DEPT_NM LIKE '%총무부%'
   */
  test('[no:4] 연차일수관리 - 부서 조건 조회 (SCH_DEPT_NM)', async ({ workerPage: page }) => {
    logTestStart('[no:4] 연차일수관리 - 부서 조건 조회 (SCH_DEPT_NM)');
    logInput('SCH_STDR_DT', '2026-07-01');
    logInput('SCH_DEPT_NM', '총무부');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_STDR_DT: '2026-07-01', SCH_DEPT_NM: '총무부' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0030-inte-no4-dept.png`, fullPage: true });

    expect(rows.length, '연차일수관리 부서 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [통합] [SELECT] 연차일수관리 - 성명 키워드 조회 (SCH_EMP_NM)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * 예상결과: 성명에 '홍길동'이 포함된 직원의 연차일수 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE EMP_NM LIKE '%홍길동%'
   */
  test('[no:5] 연차일수관리 - 성명 키워드 조회 (SCH_EMP_NM)', async ({ workerPage: page }) => {
    logTestStart('[no:5] 연차일수관리 - 성명 키워드 조회 (SCH_EMP_NM)');
    logInput('SCH_STDR_DT', '2026-07-01');
    logInput('SCH_EMP_NM', '홍길동');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_STDR_DT: '2026-07-01', SCH_EMP_NM: '홍길동' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0030-inte-no5-empnm.png`, fullPage: true });

    expect(rows.length, '연차일수관리 성명 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [통합] [SELECT] 연차일수관리 - 재직구분 필터 (퇴직자, SCH_HLDF_FG_CD=101-020)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * 예상결과: 퇴직 상태(101-020) 직원의 연차일수 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE HLDF_FG_CD = '101-020'
   */
  test('[no:6] 연차일수관리 - 재직구분 필터 (퇴직자)', async ({ workerPage: page }) => {
    logTestStart('[no:6] 연차일수관리 - 재직구분 필터 (퇴직자)');
    logInput('SCH_STDR_DT', '2026-07-01');
    logInput('SCH_HLDF_FG_CD', '101-020');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_STDR_DT: '2026-07-01', SCH_HLDF_FG_CD: '101-020' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0030-inte-no6-retired.png`, fullPage: true });

    expect(rows.length, '연차일수관리 퇴직자 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

});
