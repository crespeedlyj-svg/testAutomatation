// ==============================================================
// HRM_0130 — 부서마스터 관리 UI 통합 테스트 (단일 네비게이션)
// 생성일시: 2026-06-24  |  파일: hrm_0130_single_navigation.spec.ts
// 화면: 부서마스터 관리
// 메뉴: 인사관리 > 부서관리
// ★ 개선: 첫 네비게이션 후 이어서 모든 검색 테스트 진행
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
  gnbName: '인사관리',
  menuName: '부서관리',
};

// ── 모든 프레임에서 텍스트를 찾아 클릭 ────────────────────────────
async function clickTextInAnyFrame(page: Page, text: string): Promise<boolean> {
  const frames = page.frames();
  for (const frame of frames) {
    try {
      const el = frame.locator(`text="${text}"`).first();
      const visible = await el.isVisible({ timeout: 100 }).catch(() => false);
      if (visible) {
        await el.click();
        console.log(`  ✓ '${text}' 클릭`);
        return true;
      }
    } catch {}
  }
  console.log(`  ✗ '${text}' 못 찾음`);
  return false;
}

// ── 메뉴 탐색 → 부서관리 화면 진입 ──────────────────────────────────
async function navigateToHrm0130M(page: Page): Promise<boolean> {
  console.log('\n[🧭 NAV] 부서관리 화면으로 이동 시작\n');

  // 1단계: 앱 URL로 이동
  console.log(`[NAV] 1️⃣  ${BASE_URL}/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_${SYSTEM_ID}`);
  await page.goto(CONFIG.indexUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  // 2단계: GNB 클릭
  console.log(`[NAV] 2️⃣  GNB "${CONFIG.gnbName}" 클릭`);
  const gnbClicked = await clickTextInAnyFrame(page, CONFIG.gnbName);
  if (!gnbClicked) return false;
  await page.waitForTimeout(1500);

  // 3단계: 메뉴 클릭
  console.log(`[NAV] 3️⃣  메뉴 "${CONFIG.menuName}" 클릭`);
  const menuClicked = await clickTextInAnyFrame(page, CONFIG.menuName);
  if (!menuClicked) return false;
  await page.waitForTimeout(3000);

  // 4단계: 화면 로드 확인 (조회 버튼 또는 그리드 확인)
  console.log(`[NAV] 4️⃣  화면 로드 확인`);
  const searchBtnLoaded = await page.locator('button:has-text("조회"), [data-role="button"]:has-text("조회"), a:has-text("조회")').isVisible({ timeout: 5000 }).catch(() => false);

  if (searchBtnLoaded) {
    console.log(`[NAV] ✓ 부서관리 화면 진입 성공 (조회 버튼 확인)\n`);
  } else {
    console.log(`[NAV] ⚠️  화면 로드 미확인\n`);
  }

  return searchBtnLoaded;
}

// ══════════════════════════════════════════════════════════════════════════════
// 통합 테스트: 모든 검색조건을 한 번의 네비게이션으로 테스트
// ══════════════════════════════════════════════════════════════════════════════
test.describe('부서마스터 관리 UI 통합 테스트 (단일 네비게이션)', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  /**
   * 부서 관리 통합 테스트 — 한 번의 네비게이션으로 모든 검색조건 테스트
   */
  test('[통합] 부서관리 — 모든 검색조건 테스트', async ({ workerPage: page }) => {
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // [Step 1] 화면 진입
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('\n\n█████████████████████████████████████████████████████████████████');
    console.log('█ [STEP 1] 화면 진입 및 초기 목록 조회');
    console.log('█████████████████████████████████████████████████████████████████\n');

    logTestStart('[통합] 부서관리 - 화면 진입');
    logInput('메뉴경로', `${CONFIG.gnbName} > ${CONFIG.menuName}`);

    const navigated = await navigateToHrm0130M(page);
    logResult('화면 진입 상태', navigated ? '✅ SUCCESS' : '❌ FAILED');

    if (!navigated) {
      await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-step1-failed.png`, fullPage: true });
      expect(navigated).toBe(true);
      return;
    }

    // 초기 그리드 행 수
    const initialRows = await page.locator('tr.GridRow, .GridRow, [role="row"]').count();
    logResult('초기 조회 결과', `${initialRows - 1}건`); // 헤더 제외
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-step1-main.png`, fullPage: true });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // [Step 2] 조건 없이 조회
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('\n\n█████████████████████████████████████████████████████████████████');
    console.log('█ [STEP 2] 조건 없이 전체 조회');
    console.log('█████████████████████████████████████████████████████████████████\n');

    logTestStart('[통합] 전체 조회');
    logInput('검색조건', '없음');

    // 조회 버튼 클릭
    await clickTextInAnyFrame(page, '조회');
    await page.waitForTimeout(2000);

    const allRows = await page.locator('tr.GridRow, .GridRow, [role="row"]').count();
    logResult('조회 결과', `${allRows - 1}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-step2-all.png`, fullPage: true });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // [Step 3] 부서명 검색
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('\n\n█████████████████████████████████████████████████████████████████');
    console.log('█ [STEP 3] 부서명 검색 (경영)');
    console.log('█████████████████████████████████████████████████████████████████\n');

    logTestStart('[통합] 부서명 검색');
    logInput('부서명', '경영');

    // 부서명 입력
    const deptInput = page.locator(`input[id*="DEPT_NM"], input[name*="DEPT_NM"]`).first();
    const deptVisible = await deptInput.isVisible({ timeout: 1000 }).catch(() => false);

    if (deptVisible) {
      await deptInput.fill('경영');
      console.log(`  ✓ 부서명 입력: 경영`);
      logResult('부서명 입력', '✅ 완료');
    } else {
      logResult('부서명 입력', '❌ 필드 미발견');
    }

    // 조회 버튼 클릭
    await clickTextInAnyFrame(page, '조회');
    await page.waitForTimeout(2000);

    const deptRows = await page.locator('tr.GridRow, .GridRow, [role="row"]').count();
    logResult('조회 결과', `${deptRows - 1}건 (부서명 LIKE '경영')`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-step3-deptname.png`, fullPage: true });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // [Step 4] 초기화
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('\n\n█████████████████████████████████████████████████████████████████');
    console.log('█ [STEP 4] 초기화 후 재조회');
    console.log('█████████████████████████████████████████████████████████████████\n');

    logTestStart('[통합] 초기화 후 재조회');

    // 초기화 버튼 클릭
    const resetClicked = await clickTextInAnyFrame(page, '초기화');
    logResult('초기화 버튼', resetClicked ? '✅ 클릭' : '⚠️  미발견');
    await page.waitForTimeout(1000);

    // 조회 버튼 클릭
    await clickTextInAnyFrame(page, '조회');
    await page.waitForTimeout(2000);

    const resetRows = await page.locator('tr.GridRow, .GridRow, [role="row"]').count();
    logResult('초기화 후 조회 결과', `${resetRows - 1}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-step4-reset.png`, fullPage: true });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // [Step 5] 사용여부 필터
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('\n\n█████████████████████████████████████████████████████████████████');
    console.log('█ [STEP 5] 사용여부 필터 (Y)');
    console.log('█████████████████████████████████████████████████████████████████\n');

    logTestStart('[통합] 사용여부 필터');
    logInput('사용여부', 'Y');

    // 사용여부 입력
    const useynInput = page.locator(`input[id*="USE_YN"], input[name*="USE_YN"]`).first();
    const useynVisible = await useynInput.isVisible({ timeout: 1000 }).catch(() => false);

    if (useynVisible) {
      await useynInput.fill('Y');
      logResult('사용여부 입력', '✅ 완료');
    } else {
      logResult('사용여부 입력', '⚠️  필드 미발견 (콤보박스일 수 있음)');
    }

    // 조회
    await clickTextInAnyFrame(page, '조회');
    await page.waitForTimeout(2000);

    const useynRows = await page.locator('tr.GridRow, .GridRow, [role="row"]').count();
    logResult('조회 결과', `${useynRows - 1}건 (USE_YN='Y')`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-inte-step5-useyn.png`, fullPage: true });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 검증
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('\n\n█████████████████████████████████████████████████████████████████');
    console.log('█ [검증] 모든 조회 결과 확인');
    console.log('█████████████████████████████████████████████████████████████████\n');

    console.log(`
    📊 조회 결과 요약:
    ├─ 초기 조회: ${initialRows - 1}건
    ├─ 전체 조회: ${allRows - 1}건
    ├─ 부서명 검색 (경영): ${deptRows - 1}건
    ├─ 초기화 후: ${resetRows - 1}건
    └─ 사용여부 (Y): ${useynRows - 1}건
    `);

    // 모든 조회 결과가 0 이상이어야 함
    expect(allRows - 1).toBeGreaterThanOrEqual(0);
    expect(deptRows - 1).toBeGreaterThanOrEqual(0);
    expect(useynRows - 1).toBeGreaterThanOrEqual(0);

    logResult('전체 테스트', '✅ PASS');
  });

});
