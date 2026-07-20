// ==============================================================
// 직접구매요구신청 통합 테스트 (UI-driven / openMenuById)
// 메뉴경로: 구매관리 > 구매요구 > 직접구매요구신청
// MENU_ID : M_MIS_06_01_05  |  API: /mis/pur/pur0910/getList.do
// 생성일시: 2026-06-29  |  파일: 20260629_pur0910_inte.spec.ts
// storageState 자동 주입 — 로그인/goto 코드 작성 절대 금지
// 방식: setNexacroComponentValue(UI 컴포넌트 직접 조작) + 조회 버튼 클릭
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import {
  openMenuById,
  waitForNexacroAppReady,
  setNexacroComponentValue,
  clearNexacroDataset,
  getNexacroDatasetRows,
  waitForNexacroDataset,
} from '../utils/nexacro-helper';

const SCREENSHOT_DIR = 'test-results/screenshots';
const SLOW           = 1500;

const MENU_ID     = 'M_MIS_06_01_05';
const API_URL     = '/mis/pur/pur0910/getList.do';
const RESULT_COLS = ['CHEAP_RQST_NO', 'RQST_SBJ', 'RQST_DT', 'APNT_DEPT_NM', 'APV_STAT_CD', 'TOT_RQST_AMT'];
const CLEAR_COLS  = [
  'WORK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD',
  'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD',
  'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN',
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

  await page.locator('text="조회"').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => null);

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
  console.log(`  [RESP] HTTP ${resp.status()}`);
  expect(resp.status(), 'API HTTP 200 필요').toBe(200);

  await waitForNexacroDataset(page, formKey, 'ds_list', 0, 8000).catch(() => null);
  await page.waitForTimeout(SLOW);

  return getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);
}

test.describe.serial('직접구매요구신청 통합 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:7] [통합] [SELECT] 직접구매요구신청 - 화면 진입 초기 조회 (onload 최근 3개월 자동 적용)
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 직접구매요구신청  액터: 구매담당자
   * 예상결과: 메뉴 진입 시 onload에서 최근 3개월 신청일자 기본값으로 자동 조회되어
   *           그리드와 건수(총 N건)가 표시된다.
   * DB 확인: SELECT COUNT(*) FROM PUR_CHEAP_RQST_MST A
   *          WHERE A.RQST_DT BETWEEN TO_CHAR(ADD_MONTHS(SYSDATE,-3),'YYYYMMDD') AND TO_CHAR(SYSDATE,'YYYYMMDD')
   */
  test('[no:7] 직접구매요구신청 - 화면 진입 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:7] 직접구매요구신청 - 화면 진입 초기 조회');
    logInput('검색조건', 'onload 기본값 (최근 3개월)');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-inte-no7-onload.png`, fullPage: true });

    expect(rows.length, '직접구매요구신청 초기 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:8] [통합] [SELECT] 직접구매요구신청 - 조회 버튼 클릭 (재조회)
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 직접구매요구신청  액터: 구매담당자
   * 예상결과: 조회(btn_search) 버튼을 클릭하면 현재 조건으로 목록이 재조회된다.
   * DB 확인: SELECT COUNT(*) FROM PUR_CHEAP_RQST_MST A WHERE 1=1
   */
  test('[no:8] 직접구매요구신청 - 조회 버튼 클릭', async ({ workerPage: page }) => {
    logTestStart('[no:8] 직접구매요구신청 - 조회 버튼 클릭');
    logInput('검색조건', '없음 (현재 조건 재조회)');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, {});

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-inte-no8-search.png`, fullPage: true });

    expect(rows.length, '조회 버튼 클릭 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:9] [통합] [SELECT] 직접구매요구신청 - 결재상태 콤보 선택 후 조회
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 직접구매요구신청  액터: 구매담당자
   * 예상결과: 결재상태 콤보에서 결재완료(000-010-040)를 선택 후 조회하면
   *           해당 상태 건만 그리드에 표시된다.
   * DB 확인: SELECT COUNT(*) FROM PUR_CHEAP_RQST_MST A WHERE A.APV_STAT_CD = '000-010-040'
   */
  test('[no:9] 직접구매요구신청 - 결재상태 콤보 선택 후 조회', async ({ workerPage: page }) => {
    logTestStart('[no:9] 직접구매요구신청 - 결재상태 콤보 선택 후 조회');
    logInput('APV_STAT_CD(Combo)', '000-010-040');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { APV_STAT_CD: '000-010-040' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-inte-no9-apvstat.png`, fullPage: true });

    expect(rows.length, '결재상태 필터 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) =>
      expect(r.APV_STAT_CD, `[행${i}] APV_STAT_CD 불일치`).toBe('000-010-040')
    );
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:10] [통합] [SELECT] 직접구매요구신청 - 구매요구명 키워드 검색 후 조회
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 직접구매요구신청  액터: 구매담당자
   * 예상결과: 검색조건에서 구매요구명을 선택하고 '구매' 키워드 입력 후 조회하면
   *           해당 건이 그리드에 표시된다.
   * DB 확인: SELECT COUNT(*) FROM PUR_CHEAP_RQST_MST A WHERE A.RQST_CONT LIKE '%구매%'
   */
  test('[no:10] 직접구매요구신청 - 구매요구명 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:10] 직접구매요구신청 - 구매요구명 키워드 검색');
    logInput('SCH_SRCH_CLS(Combo)', 'RQST_CONT');
    logInput('SCH_SRCH_KEY(Edit)',  '구매');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_SRCH_CLS: 'RQST_CONT', SCH_SRCH_KEY: '구매' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-inte-no10-keyword.png`, fullPage: true });

    expect(rows.length, '구매요구명 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });
});
