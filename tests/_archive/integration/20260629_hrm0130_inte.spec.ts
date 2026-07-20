// ==============================================================
// 부서관리 통합 테스트 (UI-driven / openMenuById)
// 메뉴경로: 인사관리 > 조직관리 > 부서관리
// MENU_ID : M_MIS_01_01_03  |  API: /mis/hrm/hrm0130/getList.do
// 생성일시: 2026-06-29  |  파일: 20260629_hrm0130_inte.spec.ts
// storageState 자동 주입 — 로그인/goto 코드 작성 절대 금지
// 방식: setNexacroComponentValue(UI 컴포넌트 직접 조작) + 조회 버튼 클릭
//       텍스트 입력란(Edit)은 실제 키보드 타이핑으로 화면에 입력 과정이 보이도록 처리
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
  waitForLeftMenuRendered,
  setNexacroComponentValue,
  getNexacroEditableRect,
  clearNexacroDataset,
  getNexacroDatasetRows,
  waitForNexacroDataset,
} from '../utils/nexacro-helper';

const SCREENSHOT_DIR = 'test-results/screenshots';
// 화면 확인용 액션 간 지연(ms) — PLAYWRIGHT_STEP_DELAY 환경변수로 조절 (예: 3000). 기본 1500
const SLOW           = parseInt(process.env.PLAYWRIGHT_STEP_DELAY ?? '1500', 10);
// 각 TC 종료 직전 결과 그리드를 화면에 유지하는 지연(ms) — PLAYWRIGHT_TC_DELAY 로 조절. 기본 2500
const TC_DELAY       = parseInt(process.env.PLAYWRIGHT_TC_DELAY ?? '2500', 10);
// 키워드 타이핑 시 글자당 지연(ms) — PLAYWRIGHT_TYPE_DELAY 로 조절. 기본 150 (화면에 입력 과정 표시)
const CHAR_DELAY     = parseInt(process.env.PLAYWRIGHT_TYPE_DELAY ?? '150', 10);

const MENU_ID     = 'M_MIS_01_01_03';
const API_URL     = '/mis/hrm/hrm0130/getList.do';
const RESULT_COLS = ['DEPT_CD', 'DEPT_NM', 'BZPLC_CD', 'BZPLC_NM', 'USE_YN', 'USE_YN_NM'];
const CLEAR_COLS  = ['SCH_HDODF_CD', 'SCH_BZPLC_CD', 'SCH_DEPT_NM', 'SCH_USE_YN'];

async function navigateTo(page: Page): Promise<string> {
  await waitForNexacroAppReady(page, 20000);

  // LEFT(LNB) 메뉴가 실제로 화면에 렌더링될 때까지 대기 — openMenuById 호출 전 좌측 메뉴 표시 보장
  const leftReady = await waitForLeftMenuRendered(page, 15000);
  console.log(`[NAV] LEFT 메뉴 렌더 ready=${leftReady}`);
  await page.waitForTimeout(SLOW);   // 좌측 메뉴 렌더 안정화

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

/**
 * 검색조건을 UI에 입력하고 조회한다.
 * - 텍스트 입력란(Edit): 실제 입력란을 클릭 후 키보드로 한 글자씩 타이핑 → 화면에 입력 과정이 보임
 * - Combo 등 비텍스트: setNexacroComponentValue 로 값 설정
 * - 모든 경우 마지막에 setNexacroComponentValue 로 값 확정 (데이터셋 반영 보장)
 */
async function search(
  page: Page,
  formKey: string,
  conditions: Record<string, string>
): Promise<Record<string, string>[]> {
  await clearNexacroDataset(page, formKey, 'ds_search', CLEAR_COLS);

  for (const [col, val] of Object.entries(conditions)) {
    const rect = await getNexacroEditableRect(page, formKey, col);

    if (rect && val !== '') {
      // 편집 가능한 텍스트 입력란 — 실제 키보드 타이핑으로 화면에 보이게 입력
      await page.mouse.click(rect.x + rect.w / 2, rect.y + rect.h / 2);
      await page.waitForTimeout(250);
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Delete');
      for (const ch of val) {
        await page.keyboard.type(ch);
        await page.waitForTimeout(CHAR_DELAY);
      }
      await page.waitForTimeout(300);
    }

    // 값 확정 — 가시 타이핑 성공 여부와 무관하게 컴포넌트/데이터셋에 반영 보장
    const ok = await setNexacroComponentValue(page, formKey, col, val);
    console.log(`  [SET] ${col}="${val}" ${ok ? 'OK' : 'FAIL'}${rect ? ' (typed)' : ' (combo)'}`);
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

test.describe.serial('부서관리 통합 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:9] [통합] [SELECT] 부서관리 - 화면 진입 초기 조회 (onload SCH_USE_YN='Y' 자동 조회)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 인사담당자
   * 예상결과: 메뉴 진입 시 onload에서 SCH_USE_YN='Y' 기본값으로 자동 조회되어
   *           그리드와 건수(총 N건)가 표시된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE A.USE_YN = 'Y'
   */
  test('[no:9] 부서관리 - 화면 진입 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:9] 부서관리 - 화면 진입 초기 조회');
    logInput('검색조건', 'onload 기본값 (SCH_USE_YN=Y)');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-no9-onload.png`, fullPage: true });

    expect(rows.length, '부서관리 초기 조회 1건 이상').toBeGreaterThan(0);
    await page.waitForTimeout(TC_DELAY);   // 화면 확인용 — 결과 그리드 유지
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:10] [통합] [SELECT] 부서관리 - 조회 버튼 클릭 (btn_search 재조회)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 인사담당자
   * 예상결과: 조회(btn_search) 버튼을 클릭하면 현재 검색조건으로 부서 목록이 재조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE A.USE_YN = 'Y'
   */
  test('[no:10] 부서관리 - 조회 버튼 클릭', async ({ workerPage: page }) => {
    logTestStart('[no:10] 부서관리 - 조회 버튼 클릭');
    logInput('검색조건', '없음 (현재 조건 재조회)');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, {});

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-no10-search.png`, fullPage: true });

    expect(rows.length, '조회 버튼 클릭 1건 이상').toBeGreaterThan(0);
    await page.waitForTimeout(TC_DELAY);   // 화면 확인용 — 결과 그리드 유지
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:11] [통합] [SELECT] 부서관리 - 사용여부 콤보 선택 후 조회 (SCH_USE_YN='N')
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 인사담당자
   * 예상결과: 사용여부 콤보에서 '미사용'(N)을 선택하고 조회하면 미사용 부서만 그리드에 표시된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE A.USE_YN = 'N'
   */
  test('[no:11] 부서관리 - 사용여부 콤보 선택 후 조회', async ({ workerPage: page }) => {
    logTestStart('[no:11] 부서관리 - 사용여부 콤보 선택 후 조회');
    logInput('SCH_USE_YN(Combo)', 'N');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_USE_YN: 'N' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-no11-useN.png`, fullPage: true });

    expect(rows.length, '미사용 부서 조회 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) =>
      expect(r.USE_YN, `[행${i}] USE_YN 불일치 (미사용 'N' 기대)`).toBe('N')
    );
    await page.waitForTimeout(TC_DELAY);   // 화면 확인용 — 결과 그리드 유지
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:12] [통합] [SELECT] 부서관리 - 부서명 입력 후 조회 (SCH_DEPT_NM='부')
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 인사담당자
   * 예상결과: 부서명 입력란에 '부'를 입력하고 조회하면 부서명에 '부'가 포함된 부서만 그리드에 표시된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE A.DEPT_NM LIKE '%' || TRIM('부') || '%'
   */
  test('[no:12] 부서관리 - 부서명 입력 후 조회', async ({ workerPage: page }) => {
    logTestStart('[no:12] 부서관리 - 부서명 입력 후 조회');
    logInput('SCH_DEPT_NM(Edit)', '부');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_DEPT_NM: '부' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-no12-deptnm.png`, fullPage: true });

    expect(rows.length, '부서명 키워드 검색 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) =>
      expect(r.DEPT_NM, `[행${i}] DEPT_NM에 '부' 미포함`).toContain('부')
    );
    await page.waitForTimeout(TC_DELAY);   // 화면 확인용 — 결과 그리드 유지
    logResult('검증', `PASS — ${rows.length}행`);
  });
});
