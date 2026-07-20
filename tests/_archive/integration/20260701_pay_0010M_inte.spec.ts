// ==============================================================
// PAY — 기타세율기준관리 통합 테스트 (pay_0010M)
// 생성일시: 2026-07-01  |  파일: 20260701_pay_0010M_inte.spec.ts
// 화면: 기타세율기준관리
// 메뉴: 인사관리 > 급여관리 > 기타세율기준관리
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

// TODO: SYS_MENU_MGT에서 pay_0010M의 실제 MENU_ID 확인 필요 (현재 플레이스홀더 — 통합 테스트 실패함)
const MENU_ID     = 'M_MIS_XX_XX_XX';
const API_URL     = '/mis/pay/pay0010/getData.do';
const RESULT_COLS = ['APP_YM', 'INHABT_TAX_RATE', 'FST_PAYM_TAX_RATE', 'PER_EMP_INSU_RATE', 'COP_EMP_INSU_RATE', 'INDST_DSST_RATE', 'SASO_RATE'];
const CLEAR_COLS  = ['SCH_APP_YM'];

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
test.describe('기타세율기준관리 통합 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 기타세율기준관리 - 화면 진입 및 전체 조회
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 기타세율기준관리  액터: 개발자
   * 예상결과: 기타세율기준관리 목록이 조회된다. (총 N건 — DB 확인 필요)
   */
  test('[no:1] 기타세율기준관리 - 화면 진입 및 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 기타세율기준관리 - 화면 진입 및 전체 조회');
    logInput('검색조건', '없음');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/기타세율기준관리-inte-no1.png`, fullPage: true });

    expect(rows.length, '기타세율기준관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [통합] [SELECT] 기타세율기준관리 - 과거 적용년월 조회 (SCH_APP_YM=202301)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 기타세율기준관리  액터: 개발자
   * 예상결과: 과거 적용년월의 기타세율기준이 조회된다. (총 N건 — DB 확인 필요)
   */
  test('[no:2] 기타세율기준관리 - 과거 적용년월 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 기타세율기준관리 - 과거 적용년월 조회');
    logInput('SCH_APP_YM', '202301');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_APP_YM: '202301' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/기타세율기준관리-inte-no2.png`, fullPage: true });

    expect(rows.length, '기타세율기준관리 과거 적용년월 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [통합] [SELECT] 기타세율기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 기대)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 기타세율기준관리  액터: 개발자
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   */
  test('[no:3] 기타세율기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 기타세율기준관리 - 존재하지 않는 적용년월 조회');
    logInput('SCH_APP_YM', '999912');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_APP_YM: '999912' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/기타세율기준관리-inte-no3.png`, fullPage: true });

    expect(rows.length, '기타세율기준관리 존재하지 않는 년월 0건 기대').toBe(0);
    logResult('검증', 'PASS');
  });

});
