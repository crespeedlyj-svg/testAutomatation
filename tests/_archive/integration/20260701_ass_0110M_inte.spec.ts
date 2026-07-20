// ==============================================================
// ASS — 자산등록 통합 테스트 (ass_0110M)
// 생성일시: 2026-07-01  |  파일: 20260701_ass_0110M_inte.spec.ts
// 화면: 자산등록 대상(계약구매)조회
// 메뉴경로: 자산관리 > 자산취득 > 자산등록
// storageState 자동 주입 — 로그인 코드 작성 절대 금지 (UI-driven)
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

// TODO(menuId): SYS_MENU_MGT에서 ass_0110M의 실제 menuId 조회 필요.
//   00_menu_ids.json 캐시에 없어 플레이스홀더 사용 — 통합 테스트가 전부 실패함.
//   실제 ID 확인 후 아래 MENU_ID 및 _workspace/00_menu_ids.json 갱신.
const MENU_ID     = 'M_MIS_XX_XX_XX';
const API_URL     = '/mis/ass/ass0110/getList.do';
const RESULT_COLS = [
  'AST_ACQ_STAT', 'PUR_SEQ', 'AST_CLS_NM', 'THNG_NM', 'TOT_OUT_AMT',
  'EXMNT_DT', 'EXMNT_EMP_NM', 'CTRCT_CUST_NM', 'REG_CLS_NM', 'PUR_CONT_NO', 'RQST_NO',
];
const CLEAR_COLS  = [
  'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_SRCH_DT', 'FRM_DT', 'TO_DT',
  'SEARCHKEY', 'KEYWORD', 'PUR_CONT_NO', 'AST_REG_YN', 'AST_ACQ_STAT',
  'REG_CLS', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'ROLE_YN', 'DEPT_CHIF_YN',
  'OUT_MNG_YN', 'ASS_ACCT_YN', 'FRM_AMT', 'TO_AMT', 'AST_CLS_NM',
  'AST_CLS_CD', 'THNG_MNG_NO', 'THNG_MNG_SEQ',
];

// ── 메뉴 진입 ────────────────────────────────────────────────────────────────
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

// ── 조건 검색 ────────────────────────────────────────────────────────────────
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
// [ass_0110M] 통합 테스트 — 자산등록
// ============================================================================
test.describe('자산등록 통합 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 자산등록 - 전체 조회 (화면 진입 초기 조회)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * 예상결과: 자산등록 대상(계약구매) 목록이 조회된다. (총 N건 — DB 확인 필요)
   */
  test('[no:1] 자산등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산등록 - 전체 조회');
    logInput('검색조건', '없음 (초기 조회)');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0110-inte-no1-all.png`, fullPage: true });

    expect(rows.length, '자산등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [통합] [SELECT] 자산등록 - 계약일 기간 조회
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * 예상결과: 지정 기간 내 계약구매 자산등록 대상이 조회된다.
   */
  test('[no:2] 자산등록 - 계약일 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자산등록 - 계약일 기간 조회');
    logInput('FRM_DT~TO_DT', '20260101 ~ 20260701');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, {
      SCH_SRCH_DT: 'CTRCT_DT', FRM_DT: '20260101', TO_DT: '20260701', REG_CLS: '709-001',
    });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0110-inte-no2-period.png`, fullPage: true });

    expect(rows.length, '자산등록 계약일 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:3] [통합] [SELECT] 자산등록 - 등록상태 코드 필터 (AST_ACQ_STAT=713-001 등록대기)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * 예상결과: 등록대기 상태의 자산등록 대상만 조회된다.
   */
  test('[no:3] 자산등록 - 등록상태 코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:3] 자산등록 - 등록상태 코드 필터');
    logInput('AST_ACQ_STAT', '713-001 (등록대기)');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, {
      SCH_SRCH_DT: 'CTRCT_DT', FRM_DT: '20260601', TO_DT: '20260701', REG_CLS: '709-001', AST_ACQ_STAT: '713-001',
    });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0110-inte-no3-stat.png`, fullPage: true });

    expect(rows.length, '자산등록 등록상태 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
