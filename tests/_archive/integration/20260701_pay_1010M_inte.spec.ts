// ==============================================================
// PAY — 급여원장 통합 테스트 (pay_1010M)
// 생성일시: 2026-07-01  |  파일: 20260701_pay_1010M_inte.spec.ts
// 화면: 급여원장
// 메뉴: 인사관리 > 급여관리 > 급여원장
// storageState 자동 주입 — 로그인 코드 작성 절대 금지
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

// TODO: SYS_MENU_MGT에서 pay_1010M의 실제 MENU_ID 확인 필요 (현재 플레이스홀더 — 통합 테스트 실패함)
const MENU_ID     = 'M_MIS_XX_XX_XX';
const API_URL     = '/mis/pay/pay1010/getList.do';
const RESULT_COLS = ['EMP_NO', 'EMP_NM', 'HLDF_FG_CD', 'EMPO_STLF_CD', 'ANRY_TOT_AMT'];
const CLEAR_COLS  = [
  'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_WORK_DGCNT', 'SCH_HLDF_FG_CD', 'SCH_EMPO_STLF_CD',
  'SCH_JSFC_CD', 'SCH_GRD_CD', 'SCH_REG_YN', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_STDR_YM',
];

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

  const dsReady = await waitForNexacroDataset(page, MENU_ID, 'ds_list', 1, 10000);
  console.log(`[NAV] ds_list ready=${dsReady}`);

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

  await waitForNexacroDataset(page, formKey, 'ds_list', 0, 8000).catch(() => null);
  await page.waitForTimeout(SLOW);

  return getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);
}

// ============================================================================
test.describe('급여원장 통합 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 급여원장 - 화면 진입 및 전체 조회 (기준년월만)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * 예상결과: 해당 기준년월의 급여원장 사원 목록이 조회된다. (총 N건 — DB 확인 필요)
   */
  test('[no:1] 급여원장 - 화면 진입 및 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 급여원장 - 화면 진입 및 전체 조회');
    logInput('SCH_STDR_YM', '202406');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_STDR_YM: '202406' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/급여원장-inte-no1-all.png`, fullPage: true });

    expect(rows.length, '급여원장 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [통합] [SELECT] 급여원장 - 재직구분 조건 조회 (SCH_HLDF_FG_CD)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * 예상결과: 재직구분 조건에 해당하는 사원 목록이 조회된다. (총 N건 — DB 확인 필요)
   */
  test('[no:2] 급여원장 - 재직구분 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 급여원장 - 재직구분 조건 조회');
    logInput('SCH_STDR_YM', '202406');
    logInput('SCH_HLDF_FG_CD', '1');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_STDR_YM: '202406', SCH_HLDF_FG_CD: '1' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/급여원장-inte-no2-hldf.png`, fullPage: true });

    expect(rows.length, '급여원장 재직구분 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [통합] [SELECT] 급여원장 - 존재하지 않는 기준년월(999912) 조회 (0건 기대)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * 예상결과: 존재하지 않는 기준년월이므로 조회 결과가 0건이다. (총 0건)
   */
  test('[no:3] 급여원장 - 존재하지 않는 기준년월(999912) 조회 (0건)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 급여원장 - 존재하지 않는 기준년월 조회');
    logInput('SCH_STDR_YM', '999912');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_STDR_YM: '999912' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/급여원장-inte-no3-zero.png`, fullPage: true });

    expect(rows.length, '급여원장 존재하지 않는 기준년월 0건 기대').toBe(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] [통합] [SELECT] 급여원장 - 고용형태 코드 필터 조회 (SCH_EMPO_STLF_CD)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * 예상결과: 고용형태 코드에 해당하는 사원 목록이 조회된다. (총 N건 — DB 확인 필요)
   */
  test('[no:4] 급여원장 - 고용형태 코드 필터 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 급여원장 - 고용형태 코드 필터 조회');
    logInput('SCH_STDR_YM', '202406');
    logInput('SCH_EMPO_STLF_CD', '01');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_STDR_YM: '202406', SCH_EMPO_STLF_CD: '01' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/급여원장-inte-no4-empo.png`, fullPage: true });

    expect(rows.length, '급여원장 고용형태 코드 필터 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [통합] [SELECT] 급여원장 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * 예상결과: 성명 키워드가 포함된 사원 목록이 조회된다. (총 N건 — DB 확인 필요)
   */
  test('[no:5] 급여원장 - 성명 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 급여원장 - 성명 키워드 검색');
    logInput('SCH_STDR_YM', '202406');
    logInput('SCH_EMP_NM', '김');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_STDR_YM: '202406', SCH_EMP_NM: '김' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/급여원장-inte-no5-empnm.png`, fullPage: true });

    expect(rows.length, '급여원장 성명 키워드 검색 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) =>
      expect((r.EMP_NM ?? '').includes('김'), `[행${i}] 성명("${r.EMP_NM}")에 키워드("김") 미포함`).toBe(true)
    );
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [통합] [SELECT] 급여원장 - 원장등록 여부 조건 조회 (SCH_REG_YN)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * 예상결과: 원장등록 여부 조건에 해당하는 사원 목록이 조회된다. (총 N건 — DB 확인 필요)
   */
  test('[no:6] 급여원장 - 원장등록 여부 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] 급여원장 - 원장등록 여부 조건 조회');
    logInput('SCH_STDR_YM', '202406');
    logInput('SCH_REG_YN', 'Y');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_STDR_YM: '202406', SCH_REG_YN: 'Y' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/급여원장-inte-no6-regyn.png`, fullPage: true });

    expect(rows.length, '급여원장 원장등록 여부 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

});
