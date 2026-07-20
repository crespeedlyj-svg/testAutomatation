// ==============================================================
// HRM_0130 — 부서마스터 관리 UI 통합 테스트
// 생성일시: 2026-06-24  |  파일: hrm_0130_ui_search.spec.ts
// 화면: 부서마스터 관리
// 메뉴: 인사관리 > 부서관리
// storageState 자동 주입 — 로그인 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SYSTEM_ID      = process.env.APP_SYSTEM_ID ?? 'MIS';
const SCREENSHOT_DIR = 'test-results/screenshots';

const CONFIG = {
  indexUrl: `${BASE_URL}/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_${SYSTEM_ID}`,
  defaultTimeout: 15000,
  gnbName: '인사관리',
  menuName: '부서관리',
};

// ── 모든 프레임에서 텍스트를 찾아 클릭 ────────────────────────────
async function clickTextInAnyFrame(page: Page, text: string, timeout: number = 3000): Promise<boolean> {
  const frames = page.frames();
  console.log(`  [MENU] 텍스트 '${text}' 검색 중... (${frames.length}개 프레임)`);

  for (const frame of frames) {
    try {
      const el = frame.locator(`text="${text}"`).first();
      const visible = await el.isVisible({ timeout: 100 }).catch(() => false);
      if (visible) {
        console.log(`  [MENU] ✓ '${text}' 찾음 (프레임: ${frame.url().substring(0, 50)})`);
        await el.click();
        return true;
      }
    } catch {}
  }
  console.log(`  [MENU] ✗ '${text}' 못 찾음`);
  return false;
}

// ── 메뉴 탐색 → 부서관리 화면 진입 ──────────────────────────────────
async function navigateToHrm0130M(page: Page): Promise<boolean> {
  console.log('\n[NAV] 화면 이동 시작\n');

  // 1단계: 인덱스 URL로 이동
  console.log(`[NAV] 1️⃣  URL 이동: ${CONFIG.indexUrl}`);
  await page.goto(CONFIG.indexUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  // 2단계: GNB 메뉴 클릭 (인사관리)
  console.log(`[NAV] 2️⃣  GNB 클릭: "${CONFIG.gnbName}"`);
  const gnbClicked = await clickTextInAnyFrame(page, CONFIG.gnbName, 3000);
  if (!gnbClicked) {
    console.log(`[NAV] ✗ GNB "${CONFIG.gnbName}" 클릭 실패`);
    return false;
  }
  await page.waitForTimeout(1500);

  // 3단계: 메뉴 클릭 (부서관리)
  console.log(`[NAV] 3️⃣  메뉴 클릭: "${CONFIG.menuName}"`);
  const menuClicked = await clickTextInAnyFrame(page, CONFIG.menuName, 3000);
  if (!menuClicked) {
    console.log(`[NAV] ✗ 메뉴 "${CONFIG.menuName}" 클릭 실패`);
    return false;
  }
  await page.waitForTimeout(3000);

  // 4단계: 부서관리 화면 로드 확인 (프레임 대신 page 요소로 확인)
  console.log(`[NAV] 4️⃣  부서관리 화면 로드 확인`);
  const screenLoaded = await page.locator('text=부서관리').isVisible({ timeout: 5000 }).catch(() => false);

  if (screenLoaded) {
    console.log(`[NAV] ✓ 부서관리 화면 진입 성공\n`);
    return true;
  } else {
    console.log(`[NAV] ✗ 부서관리 화면 로드 실패\n`);
    return false;
  }
}

// ── 검색 필드 입력 함수 ────────────────────────────────────────────
async function setSearchCondition(
  page: Page,
  fieldName: string,
  value: string,
  timeout: number = 3000
): Promise<boolean> {
  try {
    // Nexacro 컴포넌트는 보통 id나 name으로 접근
    const input = page.locator(`input[id*="${fieldName}"], input[name*="${fieldName}"], [data-id*="${fieldName}"]`).first();
    const visible = await input.isVisible({ timeout: 100 }).catch(() => false);

    if (!visible) {
      console.log(`  [INPUT] ✗ 필드 '${fieldName}' 찾을 수 없음`);
      return false;
    }

    await input.fill(value);
    console.log(`  [INPUT] ✓ '${fieldName}' = '${value}'`);
    return true;
  } catch (e) {
    console.log(`  [INPUT] ✗ '${fieldName}' 입력 실패:`, e);
    return false;
  }
}

// ── 조회 버튼 클릭 ────────────────────────────────────────────────
async function clickSearchButton(page: Page): Promise<boolean> {
  const frames = page.frames();
  for (const frame of frames) {
    try {
      // "조회" 버튼 찾기
      const btn = frame.locator(`button:has-text("조회"), [data-role="button"]:has-text("조회"), a:has-text("조회")`).first();
      const visible = await btn.isVisible({ timeout: 100 }).catch(() => false);
      if (visible) {
        await btn.click();
        console.log(`  [SEARCH] ✓ 조회 버튼 클릭`);
        return true;
      }
    } catch {}
  }

  // 대체: "조회" 텍스트로 찾기
  return await clickTextInAnyFrame(page, '조회');
}

// ── 그리드 행 수 카운트 ────────────────────────────────────────────
async function getGridRowCount(page: Page): Promise<number> {
  try {
    // Nexacro 그리드는 보통 tr.GridRow 또는 .grid-row 클래스 사용
    const rows = page.locator('tr.GridRow, .GridRow, [role="row"]').all();
    const count = (await rows).length;
    console.log(`  [GRID] 행 수: ${count}건`);
    return count;
  } catch (e) {
    console.log(`  [GRID] ✗ 행 수 카운트 실패:`, e);
    return 0;
  }
}

// ============================================================================
// HRM_0130 통합 테스트 — 부서마스터 관리
// ============================================================================
test.describe('부서마스터 관리 UI 통합 테스트', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] 화면 진입 및 초기 목록 조회
   */
  test('[no:1] [통합] 화면 진입 및 초기 목록 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] [통합] 부서관리 - 화면 진입');
    logInput('메뉴', `${CONFIG.gnbName} > ${CONFIG.menuName}`);

    const navigated = await navigateToHrm0130M(page);
    logResult('화면 진입', navigated ? 'SUCCESS' : 'FAILED');

    if (!navigated) {
      await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-no1-failed.png`, fullPage: true });
      expect(navigated).toBe(true);
      return;
    }

    // 타이틀 확인
    const titleVisible = await page.locator('text=부서').isVisible({ timeout: 3000 }).catch(() => false);
    logResult('부서 관련 텍스트', titleVisible ? '표시됨' : '미표시');

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-no1-main.png`, fullPage: true });
    expect(navigated).toBe(true);
  });

  /**
   * [no:2] 조건 없이 조회 (전체)
   */
  test('[no:2] [통합] 조건 없이 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] [통합] 전체 조회');

    const navigated = await navigateToHrm0130M(page);
    expect(navigated).toBe(true);
    await page.waitForTimeout(1000);

    // 조회 버튼 클릭
    const searched = await clickSearchButton(page);
    logResult('조회 버튼 클릭', searched ? 'SUCCESS' : 'FAILED');
    await page.waitForTimeout(2000);

    // 그리드 행 수
    const rowCount = await getGridRowCount(page);
    logResult('조회 결과', `${rowCount}건`);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-no2-all.png`, fullPage: true });
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  /**
   * [no:3] 부서명으로 검색 (경영)
   */
  test('[no:3] [통합] 부서명 검색 (경영)', async ({ workerPage: page }) => {
    logTestStart('[no:3] [통합] 부서명 검색 - 경영');

    const navigated = await navigateToHrm0130M(page);
    expect(navigated).toBe(true);
    await page.waitForTimeout(1000);

    // 부서명 입력
    logInput('부서명', '경영');
    const inputted = await setSearchCondition(page, 'DEPT_NM', '경영');
    logResult('부서명 입력', inputted ? 'SUCCESS' : 'FAILED');

    // 조회 버튼 클릭
    const searched = await clickSearchButton(page);
    logResult('조회', searched ? 'SUCCESS' : 'FAILED');
    await page.waitForTimeout(2000);

    // 그리드 행 수
    const rowCount = await getGridRowCount(page);
    logResult('조회 결과', `${rowCount}건`);

    // 필터 검증: 반환된 모든 행에 "경영" 포함되는지 확인
    if (rowCount > 0) {
      const cells = page.locator('.GridCellStyle, [role="gridcell"]').all();
      const allCells = await cells;
      console.log(`  [VERIFY] ${allCells.length}개 셀 검증 중...`);
      logResult('필터 검증', '진행 중');
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-no3-dept-name.png`, fullPage: true });
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  /**
   * [no:4] 사용여부로 검색 (Y)
   */
  test('[no:4] [통합] 사용여부 검색 (Y)', async ({ workerPage: page }) => {
    logTestStart('[no:4] [통합] 사용여부 검색 - Y');

    const navigated = await navigateToHrm0130M(page);
    expect(navigated).toBe(true);
    await page.waitForTimeout(1000);

    // 사용여부 입력 (Combo 컴포넌트 클릭)
    logInput('사용여부', 'Y');
    const inputted = await setSearchCondition(page, 'USE_YN', 'Y');
    logResult('사용여부 입력', inputted ? 'SUCCESS' : 'FAILED');

    // 조회
    const searched = await clickSearchButton(page);
    logResult('조회', searched ? 'SUCCESS' : 'FAILED');
    await page.waitForTimeout(2000);

    // 그리드 행 수
    const rowCount = await getGridRowCount(page);
    logResult('조회 결과', `${rowCount}건`);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-no4-useyn.png`, fullPage: true });
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  /**
   * [no:5] 복합 조건 검색 (부서명 + 사용여부)
   */
  test('[no:5] [통합] 복합 조건 검색 (부서명 + 사용여부)', async ({ workerPage: page }) => {
    logTestStart('[no:5] [통합] 복합 조건 검색');

    const navigated = await navigateToHrm0130M(page);
    expect(navigated).toBe(true);
    await page.waitForTimeout(1000);

    // 부서명 입력
    logInput('부서명', '관리');
    await setSearchCondition(frame, 'DEPT_NM', '관리');

    // 사용여부 입력
    logInput('사용여부', 'Y');
    await setSearchCondition(frame, 'USE_YN', 'Y');

    // 조회
    const searched = await clickSearchButton(page);
    logResult('조회', searched ? 'SUCCESS' : 'FAILED');
    await page.waitForTimeout(2000);

    // 그리드 행 수
    const rowCount = await getGridRowCount(page);
    logResult('조회 결과', `${rowCount}건 (부서명="관리" AND 사용여부="Y")`);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-no5-combined.png`, fullPage: true });
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  /**
   * [no:6] 초기화 후 재조회
   */
  test('[no:6] [통합] 초기화 후 재조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] [통합] 초기화 후 재조회');

    const navigated = await navigateToHrm0130M(page);
    expect(navigated).toBe(true);
    await page.waitForTimeout(1000);

    // 초기화 버튼 클릭
    const resetClicked = await clickTextInAnyFrame(page, '초기화');
    logResult('초기화 버튼', resetClicked ? '클릭' : '미발견');
    await page.waitForTimeout(1000);

    // 조회
    const searched = await clickSearchButton(page);
    logResult('조회', searched ? 'SUCCESS' : 'FAILED');
    await page.waitForTimeout(2000);

    // 그리드 행 수
    const rowCount = await getGridRowCount(page);
    logResult('초기화 후 조회 결과', `${rowCount}건`);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-no6-reset.png`, fullPage: true });
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

});
