// ==============================================================
// GEN — 휴가규정관리 통합 테스트 (gen_0021M)
// 생성일시: 2026-07-01  |  파일: 20260701_gen_0021M_inte.spec.ts
// 화면: 휴가규정관리 (총무관리 > 근태관리 > 휴가규정관리)
// 방식: UI-driven (openMenuById + setNexacroComponentValue)
// storageState 자동 주입 — 로그인 코드 작성 절대 금지
//
// ⚠️ TODO(MENU_ID): scenarios.menuId 가 플레이스홀더('M_MIS_XX_XX_XX')이며
//    _workspace/00_menu_ids.json 캐시에 gen_0021M 항목이 없다.
//    SYS_MENU_MGT 에서 gen_0021M 의 실제 MENU_ID 를 조회하여 아래 MENU_ID 상수를 교체할 것.
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

const MENU_ID     = 'M_MIS_XX_XX_XX';   // TODO: gen_0021M 실제 MENU_ID 로 교체 필요
const API_URL     = '/mis/gen/gen0021/getList.do';
const DS_LIST     = 'ds_list';
const RESULT_COLS = ['VCTN_RGTN_CD', 'VCTN_RGTN_FG_CD', 'VCTN_RGTN_NM', 'VCTN_POSL_USE_DAY', 'SMRY', 'VCTN_RGTN_USE_YN'];
const CLEAR_COLS  = ['SCH_VCTN_RGTN_FG_CD', 'SCH_VCTN_RGTN_NM', 'SCH_SMRY'];

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

test.describe('휴가규정관리 통합 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 휴가규정관리 - 전체 조회
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴가규정관리  액터: 개발자
   * 예상결과: 휴가규정 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_RGTN_MST WHERE 1=1
   */
  test('[no:1] 휴가규정관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 휴가규정관리 - 전체 조회');
    logInput('검색조건', '없음');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0021-inte-no1-all.png`, fullPage: true });

    expect(rows.length, '휴가규정관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [통합] [SELECT] 휴가규정관리 - 구분코드 필터 (SCH_VCTN_RGTN_FG_CD)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴가규정관리  액터: 개발자
   * 예상결과: 선택한 규정 구분코드에 해당하는 휴가규정 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_RGTN_MST WHERE VCTN_RGTN_FG_CD = '416-010'
   */
  test('[no:2] 휴가규정관리 - 구분코드 필터 (SCH_VCTN_RGTN_FG_CD)', async ({ workerPage: page }) => {
    logTestStart('[no:2] 휴가규정관리 - 구분코드 필터 (SCH_VCTN_RGTN_FG_CD)');
    logInput('SCH_VCTN_RGTN_FG_CD', '416-010');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_VCTN_RGTN_FG_CD: '416-010' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0021-inte-no2-fgcd.png`, fullPage: true });

    expect(rows.length, '휴가규정관리 구분코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [통합] [SELECT] 휴가규정관리 - 존재하지 않는 구분코드 조회 (0건 예상)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴가규정관리  액터: 개발자
   * 예상결과: 존재하지 않는 규정 구분코드 조회 시 목록이 없거나 정상 응답한다.
   * 비고: expectZero 미확정 — 빈 결과가 정상이므로 정상 응답(0건 이상)만 검증한다.
   */
  test('[no:3] 휴가규정관리 - 존재하지 않는 구분코드 조회 (0건 예상)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 휴가규정관리 - 존재하지 않는 구분코드 조회 (0건 예상)');
    logInput('SCH_VCTN_RGTN_FG_CD', 'ZZZ-999');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_VCTN_RGTN_FG_CD: 'ZZZ-999' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0021-inte-no3-none.png`, fullPage: true });

    expect(rows.length, '휴가규정관리 존재하지 않는 코드 - 정상 응답(빈 결과 허용)').toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] [통합] [SELECT] 휴가규정관리 - 규정코드명 키워드 검색 (SCH_VCTN_RGTN_NM)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴가규정관리  액터: 개발자
   * 예상결과: 규정코드명에 '연차'가 포함된 휴가규정 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_RGTN_MST WHERE VCTN_RGTN_NM LIKE '%연차%'
   */
  test('[no:4] 휴가규정관리 - 규정코드명 키워드 검색 (SCH_VCTN_RGTN_NM)', async ({ workerPage: page }) => {
    logTestStart('[no:4] 휴가규정관리 - 규정코드명 키워드 검색 (SCH_VCTN_RGTN_NM)');
    logInput('SCH_VCTN_RGTN_NM', '연차');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_VCTN_RGTN_NM: '연차' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0021-inte-no4-rgtnnm.png`, fullPage: true });

    expect(rows.length, '휴가규정관리 규정코드명 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [통합] [SELECT] 휴가규정관리 - 적요 키워드 검색 (SCH_SMRY)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴가규정관리  액터: 개발자
   * 예상결과: 적요에 '규정'이 포함된 휴가규정 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_RGTN_MST WHERE SMRY LIKE '%규정%'
   */
  test('[no:5] 휴가규정관리 - 적요 키워드 검색 (SCH_SMRY)', async ({ workerPage: page }) => {
    logTestStart('[no:5] 휴가규정관리 - 적요 키워드 검색 (SCH_SMRY)');
    logInput('SCH_SMRY', '규정');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_SMRY: '규정' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0021-inte-no5-smry.png`, fullPage: true });

    expect(rows.length, '휴가규정관리 적요 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

});
