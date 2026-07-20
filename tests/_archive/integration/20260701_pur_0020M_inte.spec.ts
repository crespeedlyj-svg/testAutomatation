// ==============================================================
// PUR — 구매취소관리 통합 테스트 (pur_0020M)
// 생성일시: 2026-07-01  |  파일: 20260701_pur_0020M_inte.spec.ts
// 화면: 구매취소관리 | 메뉴: 구매관리 > 구매계약관리 > 구매취소관리
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

// TODO: SYS_MENU_MGT에서 pur_0020M(Form id=pur_0300M)의 실제 menuId 조회 후 교체 필요
// 플레이스홀더 M_MIS_XX_XX_XX 상태에서는 통합 테스트가 실패한다.
const MENU_ID     = 'M_MIS_XX_XX_XX';
const API_URL     = '/mis/pur/pur0200/getList.do';
const RESULT_COLS = ['CTRCT_STAT', 'PUR_STEP', 'PUR_TP', 'RGST_NO', 'CTRCT_NM', 'PUR_CONT_NO', 'CTRCT_AMT', 'CTRCT_DT', 'CTRCT_CUST_NM'];
const CLEAR_COLS  = [
  'CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'FRGN_CLS', 'SCH_DT_CLS',
  'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_RQST_STAT', 'SCH_EMP_NM', 'SCH_EMP_NO',
  'SCH_MIN_AMT', 'SCH_MAX_AMT', 'SCH_CTRCT_MTHD', 'SCH_CLS', 'SCH_KEY',
  'SCH_PUR_STEP0', 'SCH_PUR_STEP1', 'SCH_PUR_STEP2', 'SCH_PUR_STEP3', 'SCH_PUR_STEP4',
  'SCH_PUR_STEP5', 'SCH_PUR_STEP6', 'SCH_PUR_STEP7', 'PUR_STEPS', 'ROLE_YN',
  'DEPT_CHIF_YN', 'SCH_E_CONT_YN', 'SCH_E_CONT_STAT', 'SCH_RQST_EMP_NO', 'SCH_RQST_EMP_NM',
  'SCH_RQST_TO_DT', 'SCH_RQST_FRM_DT', 'SCH_FRGN_CLS', 'SCH_PUR_STEP',
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
// [pur_0020M] 통합 테스트 — 구매취소관리
// ============================================================================
test.describe('구매취소관리 통합 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 구매취소관리 - 화면 진입 후 조회 → 목록 표시
   * 중분류: 구매관리  소분류: 구매계약관리  메뉴명: 구매취소관리  액터: 구매담당자
   * 예상결과: 구매취소관리 화면 진입 시 기본 조회가 수행되고 검색결과 그리드에 목록과 총 건수가 표시된다.
   * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 기간 -3개월 기본조건
   */
  test('[no:1] 구매취소관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 구매취소관리 - 전체 조회');
    logInput('SCH_PUR_STEP', 'A (전체)');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_PUR_STEP: 'A' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/구매취소관리-inte-no1-all.png`, fullPage: true });

    expect(rows.length, '구매취소관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
