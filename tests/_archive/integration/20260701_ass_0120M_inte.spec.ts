// ==============================================================
// ASS — 자산정보관리 통합 테스트 (ass_0120M)
// 생성일시: 2026-07-01  |  파일: 20260701_ass_0120M_inte.spec.ts
// 화면: 자산정보관리현황 (자산대장)
// 메뉴경로: 자산관리 > 자산관리 > 자산정보관리
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

// TODO(menuId): SYS_MENU_MGT에서 ass_0120M의 실제 menuId 조회 필요.
//   00_menu_ids.json 캐시에 없어 플레이스홀더 사용 — 통합 테스트가 전부 실패함.
//   실제 ID 확인 후 아래 MENU_ID 및 _workspace/00_menu_ids.json 갱신.
const MENU_ID     = 'M_MIS_XX_XX_XX';
const API_URL     = '/mis/ass/ass0120/getList.do';
const RESULT_COLS = [
  'AST_STAT_NM', 'UPP_AST_CLS_NM', 'AST_CLS_NM', 'AST_CD', 'ACQ_DT',
  'AST_USER_DEPT_NM', 'AST_USER_EMP_NM', 'AST_NM', 'ACQ_AMT', 'ACQ_QTY', 'STD',
];
const CLEAR_COLS  = [
  'CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'SCH_SRCH_DT', 'SCH_SRCH_CLS',
  'FRM_DT', 'TO_DT', 'AST_USER_DEPT_NM', 'AST_USER_DEPT_CD', 'DEPT_CD',
  'DEPT_NM', 'AST_USER_EMP_NM', 'AST_USER_EMP_NO', 'AST_STAT', 'KEYWORD',
  'SUB_DEPT_YN', 'DEPR_OBJ_YN', 'S_ACQ_AMT', 'E_ACQ_AMT', 'AST_CLS_CD',
  'AST_CLS_NM', 'AST_CD', 'AST_NM', 'AST_MNG_CD', 'ROLE_YN',
  'DEPT_CHIF_YN', 'ACT_USE_YN', 'MAKE_NTN_CD', 'MAKE_NTN_NM', 'ACCT_UNT_CD',
  'DATA_FG', 'RGD_TRGT_YN',
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
// [ass_0120M] 통합 테스트 — 자산정보관리
// ============================================================================
test.describe('자산정보관리 통합 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 자산정보관리 - 전체 조회 (화면 진입 초기 조회)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * 예상결과: 자산정보(자산대장) 목록이 조회된다. (총 N건 — DB 확인 필요)
   */
  test('[no:1] 자산정보관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산정보관리 - 전체 조회');
    logInput('검색조건', '없음 (초기 조회)');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0120-inte-no1-all.png`, fullPage: true });

    expect(rows.length, '자산정보관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [통합] [SELECT] 자산정보관리 - 취득일자 기간 조회
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * 예상결과: 지정 기간 내 취득한 자산이 조회된다.
   */
  test('[no:2] 자산정보관리 - 취득일자 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자산정보관리 - 취득일자 기간 조회');
    logInput('FRM_DT~TO_DT', '20260101 ~ 20260701');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, {
      SCH_SRCH_DT: 'ACQ_DT', FRM_DT: '20260101', TO_DT: '20260701',
    });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0120-inte-no2-period.png`, fullPage: true });

    expect(rows.length, '자산정보관리 취득일자 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:3] [통합] [SELECT] 자산정보관리 - 자산상태 코드 필터 (AST_STAT=703-001)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * 예상결과: 선택한 자산상태에 해당하는 자산만 조회된다.
   */
  test('[no:3] 자산정보관리 - 자산상태 코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:3] 자산정보관리 - 자산상태 코드 필터');
    logInput('AST_STAT', '703-001');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, {
      SCH_SRCH_DT: 'ACQ_DT', FRM_DT: '20260401', TO_DT: '20260701', AST_STAT: '703-001',
    });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0120-inte-no3-stat.png`, fullPage: true });

    expect(rows.length, '자산정보관리 자산상태 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
