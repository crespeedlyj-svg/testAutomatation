// ==============================================================
// PUR — 구매요구신청(내자) 통합 테스트 (pur_0110M)
// 생성일시: 2026-07-01  |  파일: 20260701_pur_0110M_inte.spec.ts
// 화면: 구매요구신청(내자) | 메뉴: 구매관리 > 구매요구 > 구매요구신청(내자)
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

// TODO: SYS_MENU_MGT에서 pur_0110M의 실제 menuId 조회 후 교체 필요
// 플레이스홀더 M_MIS_XX_XX_XX 상태에서는 통합 테스트가 실패한다.
const MENU_ID     = 'M_MIS_XX_XX_XX';
const API_URL     = '/mis/pur/pur0110/getList.do';
const RESULT_COLS = ['RQST_STAT', 'RQST_NO', 'RQST_DT', 'PUR_STEP', 'PUR_TP', 'RQST_SBJ', 'APNT_EMP_NM', 'APNT_DEPT_NM', 'TOT_RQST_AMT'];
const CLEAR_COLS  = [
  'CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'RQST_STAT',
  'PUR_STEP', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD',
  'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP',
  'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS',
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
// [pur_0110M] 통합 테스트 — 구매요구신청(내자)
// ============================================================================
test.describe('구매요구신청(내자) 통합 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 구매요구신청(내자) - 화면 진입 후 조회 → 목록 표시
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 구매요구신청(내자)  액터: 구매담당자
   * 예상결과: 구매요구신청 화면 진입 시 기본 조회가 수행되고 검색결과 그리드에 목록과 총 건수가 표시된다.
   * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 기간 -3개월 AND FRGN_CLS = '604-001'
   */
  test('[no:1] 구매요구신청(내자) - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 구매요구신청(내자) - 전체 조회');
    logInput('FRGN_CLS', '604-001 (내자)');
    logInput('PUR_CLS', 'A');
    logInput('ROLE_YN', 'Y');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { FRGN_CLS: '604-001', PUR_CLS: 'A', ROLE_YN: 'Y' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/구매요구신청내자-inte-no1-all.png`, fullPage: true });

    expect(rows.length, '구매요구신청(내자) 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
