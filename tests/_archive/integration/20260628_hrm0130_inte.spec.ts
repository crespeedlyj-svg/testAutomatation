// ==============================================================
// 부서관리 통합 테스트 (UI-driven / openMenuById)
// 생성일시: 2026-06-28  |  파일: 20260628_hrm0130_inte.spec.ts
// 메뉴경로: 인사관리 > 조직관리 > 부서관리
// storageState 자동 주입 — 로그인/goto 코드 작성 절대 금지
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

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const SLOW           = 1500;

const MENU_ID     = 'M_MIS_01_01_03';
const API_URL     = '/mis/hrm/hrm0130/getList.do';
const RESULT_COLS = ['DEPT_CD', 'DEPT_NM', 'USE_YN', 'BZPLC_CD'];
const CLEAR_COLS  = ['SCH_HDODF_CD', 'SCH_BZPLC_CD', 'SCH_DEPT_NM', 'SCH_USE_YN'];

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

test.describe('부서관리 통합 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 부서관리 - 전체 조회
   * 예상결과: 부서관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1
   */
  test('[no:1] 부서관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서관리 - 전체 조회');
    logInput('검색조건', '없음');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/부서관리-inte-no1-all.png`, fullPage: true });

    expect(rows.length, '부서관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [통합] [SELECT] 부서관리 - 사용여부=Y 필터
   * 예상결과: 부서관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.USE_YN = 'Y'
   */
  test('[no:2] 부서관리 - 사용여부=Y 필터', async ({ workerPage: page }) => {
    logTestStart('[no:2] 부서관리 - 사용여부=Y 필터');
    logInput('SCH_USE_YN', 'Y');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_USE_YN: 'Y' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/부서관리-inte-no2-useY.png`, fullPage: true });

    expect(rows.length, '부서관리 사용여부=Y 조회 1건 이상').toBeGreaterThan(0);
    // rowValidation: USE_YN equals 'Y' (appliesTo: all)
    rows.forEach((r, i) =>
      expect(r.USE_YN, `[행${i}] USE_YN 불일치`).toBe('Y')
    );
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [통합] [SELECT] 부서관리 - 사용여부=N 필터
   * 예상결과: 부서관리 목록이 조회된다. (총 N건 — 미사용 부서 없으면 0건)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.USE_YN = 'N'
   */
  test('[no:3] 부서관리 - 사용여부=N 필터', async ({ workerPage: page }) => {
    logTestStart('[no:3] 부서관리 - 사용여부=N 필터');
    logInput('SCH_USE_YN', 'N');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_USE_YN: 'N' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/부서관리-inte-no3-useN.png`, fullPage: true });

    // expectZero: true — 미사용 부서가 없어 0건이 기대값
    expect(rows.length, '부서관리 사용여부=N 조회 0건').toBe(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] [통합] [SELECT] 부서관리 - 부서명 키워드 검색 (부)
   * 예상결과: 부서관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.DEPT_NM LIKE '%' || TRIM('부') || '%'
   */
  test('[no:4] 부서관리 - 부서명 키워드 검색 (부)', async ({ workerPage: page }) => {
    logTestStart('[no:4] 부서관리 - 부서명 키워드 검색 (부)');
    logInput('SCH_DEPT_NM', '부');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_DEPT_NM: '부' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/부서관리-inte-no4-deptnm.png`, fullPage: true });

    expect(rows.length, '부서관리 부서명 검색 1건 이상').toBeGreaterThan(0);
    // rowValidation: DEPT_NM contains '부' (appliesTo: all)
    rows.forEach((r, i) =>
      expect(r.DEPT_NM, `[행${i}] DEPT_NM에 '부' 미포함`).toContain('부')
    );
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [통합] [SELECT] 부서관리 - 사용여부=Y + 부서명 복합 검색
   * 예상결과: 부서관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.USE_YN = 'Y' AND A.DEPT_NM LIKE '%' || TRIM('부') || '%'
   */
  test('[no:5] 부서관리 - 사용여부=Y + 부서명 복합 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 부서관리 - 사용여부=Y + 부서명 복합 검색');
    logInput('SCH_USE_YN', 'Y');
    logInput('SCH_DEPT_NM', '부');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_USE_YN: 'Y', SCH_DEPT_NM: '부' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/부서관리-inte-no5-complex.png`, fullPage: true });

    // USE_YN=Y + DEPT_NM='부' 복합 조건 — 1건 이상 기대 (0건이면 DB 확인 필요)
    expect(rows.length, '부서관리 복합 검색 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) =>
      expect(r.USE_YN, `[행${i}] USE_YN 불일치`).toBe('Y')
    );
    logResult('검증', 'PASS');
  });

  /**
   * [no:6] [통합] [SELECT] 부서관리 - DEPT_CD 오름차순 정렬
   * 예상결과: 부서관리 목록이 조회된다. (총 N건) — DEPT_CD 오름차순 정렬
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1
   */
  test('[no:6] 부서관리 - DEPT_CD 오름차순 정렬', async ({ workerPage: page }) => {
    logTestStart('[no:6] 부서관리 - DEPT_CD 오름차순 정렬');
    logInput('검색조건', '없음 (전체 조회 후 정렬 검증)');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/부서관리-inte-no6-sort.png`, fullPage: true });

    expect(rows.length, '정렬 검증을 위한 목록 데이터 필요').toBeGreaterThan(0);
    // rowValidation: sortColumn DEPT_CD, order asc
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].DEPT_CD >= rows[i - 1].DEPT_CD, `[행${i}] DEPT_CD 오름차순 정렬 오류`).toBe(true);
    }
    logResult('검증', `PASS — ${rows.length}행 정렬 확인`);
  });

});
