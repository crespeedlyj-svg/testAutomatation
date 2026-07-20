// ==============================================================
// ACT — 거래처등록 통합 테스트 (act_1040M)
// 생성일시: 2026-07-01  |  파일: 20260701_act_1040M_inte.spec.ts
// 화면: 거래처등록  |  메뉴경로: 재무관리 > 기초정보관리 > 거래처등록
// 방식: UI-driven (openMenuById + setNexacroComponentValue)
// 비고: UNTY_SACH_FG 코드 A=전체 B=거래처코드 C=사업자번호 D=거래처명 E=대표자 F=법인번호
// storageState 자동 주입 — 로그인/goto 코드 작성 절대 금지
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

// TODO: 실제 MENU_ID 확인 필요 — 00_menu_ids.json 캐시에 act_1040M 항목 없음.
//       SYS_MENU_MGT 에서 act_1040M 의 MENU_ID 조회 후 아래 값을 교체할 것.
//       플레이스홀더(M_MIS_XX_XX_XX) 상태에서는 통합 테스트가 실패한다.
const MENU_ID     = 'M_MIS_XX_XX_XX';
const API_URL     = '/mis/act/act1040/getList.do';
const RESULT_COLS = ['CUST_CD', 'CUST_NM', 'BIZRNO'];
const CLEAR_COLS  = [
  'CUST_NM', 'CUST_FG', 'CUST_CLSF', 'BUY_SALG_FG', 'CUST_CD',
  'BIZRNO', 'REPRES_NM', 'USE_YN', 'UNTY_SACH_FG', 'UNTY_SACH_KEY',
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
test.describe('거래처등록 통합 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 거래처등록 - 전체 조회
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * 예상결과: 거래처 목록이 조회된다. (총 N건 — DB 확인 필요)
   */
  test('[no:1] 거래처등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 거래처등록 - 전체 조회');
    logInput('검색조건', '없음');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-inte-no1-all.png`, fullPage: true });

    expect(rows.length, '거래처등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [통합] [SELECT] 거래처등록 - 사용여부 조회 (USE_YN=Y)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * 예상결과: 사용중(USE_YN=Y)인 거래처가 조회된다.
   */
  test('[no:2] 거래처등록 - 사용여부 조회 (USE_YN=Y)', async ({ workerPage: page }) => {
    logTestStart('[no:2] 거래처등록 - 사용여부 조회 (USE_YN=Y)');
    logInput('USE_YN', 'Y');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { USE_YN: 'Y' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-inte-no2-useY.png`, fullPage: true });

    expect(rows.length, '거래처등록 사용여부(Y) 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [통합] [SELECT] 거래처등록 - 통합검색 거래처명 조회 (UNTY_SACH_FG=D)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * 예상결과: 통합검색(거래처명) 키워드 '상사'로 거래처가 조회된다.
   */
  test('[no:3] 거래처등록 - 통합검색 거래처명 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 거래처등록 - 통합검색 거래처명 조회');
    logInput('UNTY_SACH_FG', 'D');
    logInput('UNTY_SACH_KEY', '상사');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { UNTY_SACH_FG: 'D', UNTY_SACH_KEY: '상사' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-inte-no3-custnm.png`, fullPage: true });

    expect(rows.length, '거래처등록 통합검색(거래처명) 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [통합] [SELECT] 거래처등록 - 통합검색 사업자번호 조회 (UNTY_SACH_FG=C)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * 예상결과: 통합검색(사업자번호) 키워드 '123'으로 거래처가 조회된다.
   */
  test('[no:4] 거래처등록 - 통합검색 사업자번호 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 거래처등록 - 통합검색 사업자번호 조회');
    logInput('UNTY_SACH_FG', 'C');
    logInput('UNTY_SACH_KEY', '123');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { UNTY_SACH_FG: 'C', UNTY_SACH_KEY: '123' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-inte-no4-bizrno.png`, fullPage: true });

    expect(rows.length, '거래처등록 통합검색(사업자번호) 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [통합] [SELECT] 거래처등록 - 통합검색 대표자 조회 (UNTY_SACH_FG=E)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * 예상결과: 통합검색(대표자) 키워드 '김'으로 거래처가 조회된다.
   */
  test('[no:5] 거래처등록 - 통합검색 대표자 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 거래처등록 - 통합검색 대표자 조회');
    logInput('UNTY_SACH_FG', 'E');
    logInput('UNTY_SACH_KEY', '김');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { UNTY_SACH_FG: 'E', UNTY_SACH_KEY: '김' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-inte-no5-repres.png`, fullPage: true });

    expect(rows.length, '거래처등록 통합검색(대표자) 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

});
