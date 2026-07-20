// ==============================================================
// HRM — 부서조직관리 통합 테스트 (hrm_0110M)
// 생성일시: 2026-07-01  |  파일: 20260701_hrm_0110M_inte.spec.ts
// 화면: 부서조직관리 (조직도)  |  메뉴: 인사관리 > 조직관리 > 부서조직관리
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

// TODO: hrm_0110M menuId 미확인(플레이스홀더). SYS_MENU_MGT에서 실제 MENU_ID 조회 후 교체 필요.
//       SELECT s.menu_id FROM SYS_MENU_MGT s WHERE UPPER(s.pgm_id) LIKE 'HRM_0110%' AND s.USE_YN='Y'
const MENU_ID        = 'M_MIS_XX_XX_XX';
const API_URL        = '/mis/hrm/hrm0110/getOrgchtList.do';
const DS_SEARCH_NAME = 'ds_search';
const DS_LIST_NAME   = 'ds_listOrgcht';
const RESULT_COLS    = ['DEPT_CD', 'DEPT_NM', 'UPP_DEPT_CD', 'LVL', 'SORT_NO', 'DEPTL_EMP_NM'];
const CLEAR_COLS     = ['SCH_ORG_RGIN_DT'];

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
// [hrm_0110M] 통합 테스트 — 부서조직관리
// ============================================================================
test.describe('부서조직관리 통합 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 부서조직관리 - 메뉴 진입 후 조직개편이력 → 조직도 조회
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직관리  액터: 인사담당자
   * 예상결과: 메뉴 진입 시 조직개편이력이 자동 조회되고, 개편일 기준 조직도가 그리드에 표시된다.
   * DB 확인: SELECT COUNT(*) FROM HRM_ORGCHT A WHERE 1=1
   */
  test('[no:1] 부서조직관리 - 메뉴 진입 후 조직도 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서조직관리 - 메뉴 진입 후 조직도 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0110-inte-no1-all.png`, fullPage: true });

    expect(rows.length, '부서조직관리 초기 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
