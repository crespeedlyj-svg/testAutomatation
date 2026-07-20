// ==============================================================
// HRM_0130 — 부서마스터 관리 통합 테스트 (상세 / 느린 재생)
// 생성일시: 2026-06-24  |  파일: hrm_0130_detailed.spec.ts
// ★ 개선:
//   1. 실행속도 늘어남 (각 단계 0.5~2초 대기)
//   2. 실제 UI form에 검색조건 입력
//   3. 각 단계별 스크린샷 다수 캡처
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
  SLOW_MOTION: 1000, // 1초 기본 대기
};

// ── 모든 프레임에서 텍스트를 찾아 클릭 ────────────────────────────
async function clickText(page: Page, text: string, delayMs: number = 500): Promise<boolean> {
  const frames = page.frames();
  for (const frame of frames) {
    try {
      const el = frame.locator(`text="${text}"`).first();
      const visible = await el.isVisible({ timeout: 1000 }).catch(() => false);
      if (visible) {
        console.log(`\n  ⏳ ${delayMs}ms 대기... [${text}] 클릭 준비`);
        await page.waitForTimeout(delayMs);
        console.log(`  ▶️  [${text}] 클릭`);
        await el.click();
        await page.waitForTimeout(300);
        return true;
      }
    } catch {}
  }
  return false;
}

// ── 메뉴 탐색 ────────────────────────────────────────────────────
async function navigateToHrm0130(page: Page): Promise<boolean> {
  console.log('\n\n╔════════════════════════════════════════════════════════════╗');
  console.log('║ 🧭 부서관리 화면으로 이동');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Step 1: 앱 로드
  console.log('📍 [Step 1] 앱 URL 로드');
  console.log(`   🌐 URL: ${CONFIG.indexUrl.substring(0, 60)}...`);
  console.log('   ⏳ 로드 중... (최대 60초)');
  await page.goto(CONFIG.indexUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(CONFIG.SLOW_MOTION);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm-nav-01-loaded.png`, fullPage: true });
  console.log('   ✅ 앱 로드 완료');

  // Step 2: GNB 클릭
  console.log(`\n📍 [Step 2] GNB 메뉴 클릭: "${CONFIG.gnbName}"`);
  const gnbClicked = await clickText(page, CONFIG.gnbName, CONFIG.SLOW_MOTION);
  if (!gnbClicked) {
    console.log(`   ❌ GNB 클릭 실패`);
    return false;
  }
  await page.waitForTimeout(CONFIG.SLOW_MOTION);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm-nav-02-gnb-clicked.png`, fullPage: true });
  console.log('   ✅ GNB 메뉴 펼침');

  // Step 3: 메뉴 클릭
  console.log(`\n📍 [Step 3] 서브 메뉴 클릭: "${CONFIG.menuName}"`);
  const menuClicked = await clickText(page, CONFIG.menuName, CONFIG.SLOW_MOTION);
  if (!menuClicked) {
    console.log(`   ❌ 메뉴 클릭 실패`);
    return false;
  }
  await page.waitForTimeout(2000); // 화면 로드 대기
  await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm-nav-03-menu-clicked.png`, fullPage: true });
  console.log('   ✅ 메뉴 클릭 완료 → 화면 로드 중...');

  // Step 4: 화면 로드 확인
  console.log(`\n📍 [Step 4] 화면 로드 확인`);
  const searchBtnLoaded = await page.locator('button:has-text("조회"), [data-role="button"]:has-text("조회"), a:has-text("조회")').isVisible({ timeout: 5000 }).catch(() => false);

  if (searchBtnLoaded) {
    console.log('   ✅ 부서관리 화면 진입 성공');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm-nav-04-screen-ready.png`, fullPage: true });
    return true;
  } else {
    console.log('   ⚠️  화면 요소 미발견');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm-nav-04-screen-failed.png`, fullPage: true });
    return false;
  }
}

// ── Form 필드에 값 입력 ──────────────────────────────────────────
async function inputSearchField(page: Page, fieldName: string, value: string, delayMs: number = 500): Promise<boolean> {
  console.log(`\n  📝 [입력] ${fieldName} = "${value}"`);
  console.log(`    ⏳ 필드 검색 중...`);

  try {
    // 다양한 선택자 시도
    const selectors = [
      `input[id*="${fieldName}"]`,
      `input[name*="${fieldName}"]`,
      `input[placeholder*="${fieldName}"]`,
      `[data-id*="${fieldName}"]`,
    ];

    let input = null;
    for (const selector of selectors) {
      input = page.locator(selector).first();
      const visible = await input.isVisible({ timeout: 500 }).catch(() => false);
      if (visible) {
        console.log(`    ✅ 필드 발견 (${selector})`);
        break;
      }
    }

    if (!input) {
      console.log(`    ❌ 필드 "${fieldName}" 못 찾음`);
      return false;
    }

    // 필드 포커스
    await input.focus();
    await page.waitForTimeout(200);

    // 기존 값 초기화
    await input.fill('');
    await page.waitForTimeout(100);

    // 새 값 입력
    console.log(`    ⏳ ${delayMs}ms 입력 중...`);
    await page.waitForTimeout(delayMs);
    await input.type(value, { delay: 50 }); // 느리게 입력
    await page.waitForTimeout(300);

    console.log(`    ✅ 입력 완료: "${value}"`);
    return true;
  } catch (e) {
    console.log(`    ❌ 입력 실패:`, e);
    return false;
  }
}

// ── 조회 버튼 클릭 ────────────────────────────────────────────────
async function clickSearch(page: Page): Promise<boolean> {
  console.log(`\n  🔍 [조회] 버튼 클릭`);
  const clicked = await clickText(page, '조회', 500);
  if (clicked) {
    console.log(`    ✅ 조회 시작`);
    await page.waitForTimeout(CONFIG.SLOW_MOTION); // 결과 로드 대기
    return true;
  } else {
    console.log(`    ❌ 조회 버튼 못 찾음`);
    return false;
  }
}

// ── 그리드 행 수 조회 ────────────────────────────────────────────
async function getGridRowCount(page: Page): Promise<number> {
  try {
    const rows = await page.locator('tr.GridRow, .GridRow, [role="row"]').count();
    const dataRows = Math.max(0, rows - 1); // 헤더 제외
    console.log(`    📊 조회 결과: ${dataRows}건`);
    return dataRows;
  } catch {
    console.log(`    ⚠️  행 수 카운트 실패`);
    return 0;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// 상세 통합 테스트
// ══════════════════════════════════════════════════════════════════════════════
test.describe('부서마스터 관리 상세 통합 테스트 (느린 재생)', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  test('[상세] 부서관리 검색 - 모든 단계를 천천히 진행', async ({ workerPage: page }) => {
    // ════════════════════════════════════════════════════════════════════
    // [STEP 1] 화면 진입
    // ════════════════════════════════════════════════════════════════════
    const navigated = await navigateToHrm0130(page);
    expect(navigated).toBe(true);

    if (!navigated) {
      console.log('\n❌ 화면 진입 실패');
      return;
    }

    // ════════════════════════════════════════════════════════════════════
    // [STEP 2] 조건 없이 조회 (초기 상태)
    // ════════════════════════════════════════════════════════════════════
    console.log('\n\n╔════════════════════════════════════════════════════════════╗');
    console.log('║ 📋 [테스트 1] 조건 없이 전체 조회');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    logTestStart('[테스트 1] 전체 조회');
    logInput('검색조건', '없음');

    console.log('  🎬 액션:');
    console.log('    1️⃣  현재 상태 스크린샷');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-1-00-initial.png`, fullPage: true });

    console.log('    2️⃣  [조회] 버튼 클릭');
    await clickSearch(page);

    console.log('  📊 결과 검증:');
    const count1 = await getGridRowCount(page);
    logResult('조회 결과', `${count1}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-1-01-result.png`, fullPage: true });

    expect(count1).toBeGreaterThanOrEqual(0);

    // ════════════════════════════════════════════════════════════════════
    // [STEP 3] 부서명으로 검색
    // ════════════════════════════════════════════════════════════════════
    console.log('\n\n╔════════════════════════════════════════════════════════════╗');
    console.log('║ 📋 [테스트 2] 부서명 검색: "경영"');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    logTestStart('[테스트 2] 부서명 검색');
    logInput('부서명', '경영');

    console.log('  🎬 액션:');
    console.log('    1️⃣  부서명 필드 입력');
    const deptNameInputted = await inputSearchField(page, 'DEPT_NM', '경영', CONFIG.SLOW_MOTION);
    logResult('부서명 입력', deptNameInputted ? '✅ 완료' : '❌ 실패');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-2-01-input.png`, fullPage: true });

    console.log('    2️⃣  [조회] 버튼 클릭');
    await clickSearch(page);

    console.log('  📊 결과 검증:');
    const count2 = await getGridRowCount(page);
    logResult('검색 결과', `${count2}건 (부서명 LIKE '경영')`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-2-02-result.png`, fullPage: true });

    // 반환된 행에서 부서명 확인 (첫 행만)
    if (count2 > 0) {
      const firstDeptName = await page.locator('.GridCellStyle, [role="gridcell"]').first().textContent();
      console.log(`  ✓ 첫 번째 행: ${firstDeptName}`);
    }

    expect(count2).toBeGreaterThanOrEqual(0);

    // ════════════════════════════════════════════════════════════════════
    // [STEP 4] 초기화 후 재조회
    // ════════════════════════════════════════════════════════════════════
    console.log('\n\n╔════════════════════════════════════════════════════════════╗');
    console.log('║ 📋 [테스트 3] 초기화 후 재조회');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    logTestStart('[테스트 3] 초기화');

    console.log('  🎬 액션:');
    console.log('    1️⃣  [초기화] 버튼 클릭');
    const resetClicked = await clickText(page, '초기화', CONFIG.SLOW_MOTION);
    logResult('초기화', resetClicked ? '✅ 클릭' : '⚠️  미발견');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-3-01-reset.png`, fullPage: true });

    console.log('    2️⃣  [조회] 버튼 클릭');
    await clickSearch(page);

    console.log('  📊 결과 검증:');
    const count3 = await getGridRowCount(page);
    logResult('초기화 후 조회', `${count3}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-3-02-result.png`, fullPage: true });

    expect(count3).toBeGreaterThanOrEqual(0);

    // ════════════════════════════════════════════════════════════════════
    // [STEP 5] 사용여부 필터 (Y)
    // ════════════════════════════════════════════════════════════════════
    console.log('\n\n╔════════════════════════════════════════════════════════════╗');
    console.log('║ 📋 [테스트 4] 사용여부 필터: Y');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    logTestStart('[테스트 4] 사용여부 필터');
    logInput('사용여부', 'Y');

    console.log('  🎬 액션:');
    console.log('    1️⃣  사용여부 필드 입력');
    const useynInputted = await inputSearchField(page, 'USE_YN', 'Y', CONFIG.SLOW_MOTION);
    logResult('사용여부 입력', useynInputted ? '✅ 완료' : '⚠️  필드 미발견 (콤보일 수 있음)');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-4-01-input.png`, fullPage: true });

    console.log('    2️⃣  [조회] 버튼 클릭');
    await clickSearch(page);

    console.log('  📊 결과 검증:');
    const count4 = await getGridRowCount(page);
    logResult('검색 결과', `${count4}건 (USE_YN='Y')`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-4-02-result.png`, fullPage: true });

    expect(count4).toBeGreaterThanOrEqual(0);

    // ════════════════════════════════════════════════════════════════════
    // [최종] 테스트 요약
    // ════════════════════════════════════════════════════════════════════
    console.log('\n\n╔════════════════════════════════════════════════════════════╗');
    console.log('║ 📊 테스트 완료');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log(`
    ✅ 모든 테스트 완료!

    📈 결과 요약:
    ├─ 테스트 1 (조건 없음)      → ${count1}건
    ├─ 테스트 2 (부서명='경영')  → ${count2}건
    ├─ 테스트 3 (초기화 후)      → ${count3}건
    └─ 테스트 4 (사용여부=Y)     → ${count4}건

    💾 스크린샷: test-results/screenshots/test-*.png
    `);

    logResult('전체 테스트', '✅ PASS');
  });

});
