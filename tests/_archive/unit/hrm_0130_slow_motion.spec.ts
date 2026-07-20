// ==============================================================
// HRM_0130M — 부서마스터 관리 단위 테스트
// 방식: leftFrame JS API 메뉴 로드 → ds_search 데이터셋 직접 설정
//       → "조회" 버튼 DOM 클릭 → ds_list 결과 검증
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import {
  openMenuById,
  isMenuActive,
  waitForNexacroAppReady,
  setNexacroComponentValue,
  clearNexacroDataset,
  getNexacroDatasetRows,
  waitForNexacroDataset,
} from '../utils/nexacro-helper';

const SCREENSHOT_DIR = 'test-results/screenshots';
const SLOW           = 1500;

const MENU_ID  = 'M_MIS_01_01_03';
const API_URL  = '/mis/hrm/hrm0130/getList.do';
const RESULT_COLS = ['DEPT_CD', 'DEPT_NM', 'BZPLC_CD', 'USE_YN'];
const CLEAR_COLS  = ['SCH_DEPT_NM', 'SCH_BZPLC_CD', 'SCH_USE_YN', 'SCH_HDODF_CD'];

// ── 화면 진입 ─────────────────────────────────────────────────
async function navigateToHrm0130M(page: Page): Promise<string> {
  await waitForNexacroAppReady(page, 20000);

  // 이미 해당 메뉴가 FrameSet에 로드돼 있으면 재탐색 생략
  if (await isMenuActive(page, MENU_ID)) {
    console.log(`[NAV] 이미 메뉴 활성 — 재탐색 생략 (formKey=${MENU_ID})`);
    return MENU_ID;
  }

  // 신규 진입: 응답 구독 후 메뉴 로드
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
  console.log(`[NAV] ds_list ready=${dsReady}, formKey=${MENU_ID}`);
  return MENU_ID;
}

// ── 조회 ──────────────────────────────────────────────────────
async function search(
  page: Page,
  formKey: string,
  conditions: Record<string, string>
): Promise<Record<string, string>[]> {
  await clearNexacroDataset(page, formKey, 'ds_search', CLEAR_COLS);

  for (const [col, val] of Object.entries(conditions)) {
    // EditBox/Combo 컴포넌트 직접 set_value → 바인딩으로 ds_search 자동 갱신
    const ok = await setNexacroComponentValue(page, formKey, col, val);
    console.log(`  [SET] ${col}="${val}" ${ok ? '✅' : '❌'}`);
  }

  await page.waitForTimeout(SLOW);

  const respPromise = page.waitForResponse(
    r => r.url().includes(API_URL), { timeout: 15000 }
  );
  await page.locator('text="조회"').first().click();

  const resp = await respPromise;
  expect(resp.status(), `API HTTP 200 필요`).toBe(200);

  // 검색 결과가 ds_list에 채워질 때까지 폴링 (최대 8초, 0건 허용 — 조건에 따라 없을 수 있음)
  await waitForNexacroDataset(page, formKey, 'ds_list', 0, 8000).catch(() => null);
  await page.waitForTimeout(SLOW);
  return getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);
}

// ══════════════════════════════════════════════════════════════
test.describe('HRM_0130M 부서마스터 관리 — 단위 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test('[no:1] 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 전체 조회');
    logInput('검색조건', '없음');

    const formKey = await navigateToHrm0130M(page);
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: DEPT_NM=${rows[0].DEPT_NM}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no1-all.png`, fullPage: true });

    expect(rows.length, '전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', '✅ PASS');
  });

  test('[no:2] 부서명 검색 — "경영"', async ({ workerPage: page }) => {
    logTestStart('[no:2] 부서명 검색');
    logInput('SCH_DEPT_NM', '경영');

    const formKey = await navigateToHrm0130M(page);
    const rows    = await search(page, formKey, { SCH_DEPT_NM: '경영' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no2-deptname.png`, fullPage: true });

    expect(rows.length, '"경영" 검색 결과 0건').toBeGreaterThan(0);
    rows.forEach((r, i) =>
      expect(r.DEPT_NM, `[행${i}] "경영" 미포함`).toContain('경영')
    );
    logResult('검증', `✅ PASS — ${rows.length}행`);
  });

  test('[no:3] 사용여부 검색 — "Y"', async ({ workerPage: page }) => {
    logTestStart('[no:3] 사용여부=Y');
    logInput('SCH_USE_YN', 'Y');

    const formKey = await navigateToHrm0130M(page);
    const rows    = await search(page, formKey, { SCH_USE_YN: 'Y' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no3-useyn-y.png`, fullPage: true });

    expect(rows.length, '사용여부=Y 결과 0건').toBeGreaterThan(0);
    rows.forEach((r, i) =>
      expect(r.USE_YN, `[행${i}] USE_YN≠Y`).toBe('Y')
    );
    logResult('검증', `✅ PASS — ${rows.length}행`);
  });

  test('[no:4] 사용여부 검색 — "N"', async ({ workerPage: page }) => {
    logTestStart('[no:4] 사용여부=N');
    logInput('SCH_USE_YN', 'N');

    const formKey = await navigateToHrm0130M(page);
    const rows    = await search(page, formKey, { SCH_USE_YN: 'N' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no4-useyn-n.png`, fullPage: true });

    rows.forEach((r, i) =>
      expect(r.USE_YN, `[행${i}] USE_YN≠N`).toBe('N')
    );
    logResult('검증', rows.length > 0 ? `✅ PASS — ${rows.length}행` : '⚠️  0건 (미사용 부서 없음)');
  });

  test('[no:5] 복합 조건 — 부서명 "관리" + 사용여부 "Y"', async ({ workerPage: page }) => {
    logTestStart('[no:5] 복합 조건');
    logInput('SCH_DEPT_NM', '관리');
    logInput('SCH_USE_YN',  'Y');

    const formKey = await navigateToHrm0130M(page);
    const rows    = await search(page, formKey, { SCH_DEPT_NM: '관리', SCH_USE_YN: 'Y' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no5-complex.png`, fullPage: true });

    expect(rows.length, '복합 조건 결과 0건').toBeGreaterThan(0);
    rows.forEach((r, i) => {
      expect(r.DEPT_NM, `[행${i}] "관리" 미포함`).toContain('관리');
      expect(r.USE_YN,  `[행${i}] USE_YN≠Y`).toBe('Y');
    });
    logResult('검증', `✅ PASS — ${rows.length}행`);
  });
});
