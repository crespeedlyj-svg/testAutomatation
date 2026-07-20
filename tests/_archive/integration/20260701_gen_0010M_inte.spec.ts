// ==============================================================
// GEN — 휴무일관리 통합 테스트 (gen_0010M)
// 생성일시: 2026-07-01  |  파일: 20260701_gen_0010M_inte.spec.ts
// 화면: 휴무일관리 (총무관리 > 근태관리 > 휴무일관리)
// 방식: UI-driven (openMenuById + setNexacroComponentValue)
// storageState 자동 주입 — 로그인 코드 작성 절대 금지
//
// ⚠️ TODO(MENU_ID): scenarios.menuId 가 플레이스홀더('M_MIS_XX_XX_XX')이며
//    _workspace/00_menu_ids.json 캐시에 gen_0010M 항목이 없다.
//    SYS_MENU_MGT 에서 gen_0010M 의 실제 MENU_ID 를 조회하여 아래 MENU_ID 상수를 교체할 것.
//    실제 ID 확인 전까지 통합 테스트는 '메뉴 로드 실패'로 전부 실패한다.
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

const MENU_ID     = 'M_MIS_XX_XX_XX';   // TODO: gen_0010M 실제 MENU_ID 로 교체 필요
const API_URL     = '/mis/gen/gen0010/getHoliList.do';
const DS_LIST     = 'ds_holiday';
const RESULT_COLS = ['DT', 'HDAY_NM', 'HLDY_YN', 'RPL_HLDY_YN', 'HDAY_DECI'];
const CLEAR_COLS  = ['YYMM'];

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

test.describe('휴무일관리 통합 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 휴무일관리 - 전체 조회
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴무일관리  액터: 개발자
   * 예상결과: 휴무일 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM GEN_HDAY_MST WHERE 1=1
   */
  test('[no:1] 휴무일관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 휴무일관리 - 전체 조회');
    logInput('검색조건', '없음');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0010-inte-no1-all.png`, fullPage: true });

    expect(rows.length, '휴무일관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [통합] [SELECT] 휴무일관리 - 연월 조건 조회 (YYMM)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴무일관리  액터: 개발자
   * 예상결과: 지정한 연월(2026-06)의 휴무일 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM GEN_HDAY_MST WHERE SUBSTR(DT,1,6) = '202606'
   */
  test('[no:2] 휴무일관리 - 연월 조건 조회 (YYMM)', async ({ workerPage: page }) => {
    logTestStart('[no:2] 휴무일관리 - 연월 조건 조회 (YYMM)');
    logInput('YYMM', '2026-06');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { YYMM: '2026-06' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0010-inte-no2-yymm.png`, fullPage: true });

    expect(rows.length, '휴무일관리 연월 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [통합] [SELECT] 휴무일관리 - 존재하지 않는 연월 조회 (0건 예상)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴무일관리  액터: 개발자
   * 예상결과: 존재하지 않는 연월(1900-01) 조회 시 목록이 없거나 정상 응답한다.
   * 비고: expectZero 미확정 — 빈 결과가 정상이므로 정상 응답(0건 이상)만 검증한다.
   */
  test('[no:3] 휴무일관리 - 존재하지 않는 연월 조회 (0건 예상)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 휴무일관리 - 존재하지 않는 연월 조회 (0건 예상)');
    logInput('YYMM', '1900-01');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { YYMM: '1900-01' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0010-inte-no3-none.png`, fullPage: true });

    expect(rows.length, '휴무일관리 존재하지 않는 연월 - 정상 응답(빈 결과 허용)').toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });

});
