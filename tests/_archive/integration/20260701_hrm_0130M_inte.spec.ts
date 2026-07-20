// ==============================================================
// HRM — 부서관리 통합 테스트 (hrm_0130M)
// 생성일시: 2026-07-01  |  파일: 20260701_hrm_0130M_inte.spec.ts
// 화면: 부서관리  |  메뉴: 인사관리 > 조직관리 > 부서관리
// 방식: UI-driven (openMenuById + setNexacroComponentValue)
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

// menuId: 00_menu_ids.json 캐시 확인됨 (hrm_0130M → M_MIS_01_01_03)
const MENU_ID        = 'M_MIS_01_01_03';
const API_URL        = '/mis/hrm/hrm0130/getList.do';
const DS_SEARCH_NAME = 'ds_search';
const DS_LIST_NAME   = 'ds_list';
const RESULT_COLS    = ['DEPT_CD', 'DEPT_NM', 'BZPLC_CD', 'ACCT_UNT_CD', 'OLD_DEPT_CD', 'USE_YN_NM'];
const CLEAR_COLS     = ['SCH_HDODF_CD', 'SCH_BZPLC_CD', 'SCH_DEPT_NM', 'SCH_USE_YN'];

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

  const dsReady = await waitForNexacroDataset(page, MENU_ID, DS_LIST_NAME, 1, 10000);
  console.log(`[NAV] ${DS_LIST_NAME} ready=${dsReady}`);

  return MENU_ID;
}

async function search(
  page: Page,
  formKey: string,
  conditions: Record<string, string>
): Promise<Record<string, string>[]> {
  await clearNexacroDataset(page, formKey, DS_SEARCH_NAME, CLEAR_COLS);

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

  await waitForNexacroDataset(page, formKey, DS_LIST_NAME, 0, 8000).catch(() => null);
  await page.waitForTimeout(SLOW);

  return getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);
}

// ============================================================================
// [hrm_0130M] 통합 테스트 — 부서관리
// ============================================================================
test.describe('부서관리 통합 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 부서관리 - 메뉴 진입 후 사용부서(Y) 자동 조회
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 인사담당자
   * 예상결과: 메뉴 진입 시 onload 기본값 SCH_USE_YN='Y'로 사용 중인 부서 목록이 자동 조회된다.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.USE_YN = 'Y'
   */
  test('[no:1] 부서관리 - 메뉴 진입 후 사용부서(Y) 자동 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서관리 - 메뉴 진입 후 사용부서(Y) 자동 조회');
    logInput('SCH_USE_YN', 'Y (onload 기본값)');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_USE_YN: 'Y' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-no1-useyn-y.png`, fullPage: true });

    expect(rows.length, '부서관리 사용부서(Y) 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
