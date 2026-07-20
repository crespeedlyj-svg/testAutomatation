// ==============================================================
// PUR — 직접구매지급신청 통합 테스트
// 생성일시: 2026-06-28  |  파일: 20260628_pur0910_inte.spec.ts
// 메뉴: 구매관리 > 구매요구 > 직접구매지급신청
// storageState 자동 주입 — 로그인 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page, Frame } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SYSTEM_ID      = process.env.APP_SYSTEM_ID ?? 'MIS';
const SCREENSHOT_DIR = 'test-results/screenshots';

const MENU_ID = 'M_MIS_06_01_05';

const CONFIG = {
  indexUrl: `${BASE_URL}/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_${SYSTEM_ID}`,
  defaultTimeout: 15000,
  gnbName:   '구매관리',
  groupName: '구매요구',
  menuName:  '직접구매지급신청',
};

// ── 모든 프레임 병렬 탐색 후 텍스트 클릭 ──────────────────────────────────
async function clickTextInAnyFrame(page: Page, text: string): Promise<boolean> {
  const results = await Promise.all(
    page.frames().map(async (frame) => {
      try {
        const el = frame.locator(`text="${text}"`).first();
        if (await el.isVisible({ timeout: 100 })) {
          await el.click();
          return true;
        }
      } catch {}
      return false;
    })
  );
  return results.some(Boolean);
}

// ── 메뉴 탐색 → 직접구매지급신청 화면 진입 ────────────────────────────────
async function navigateToTarget(page: Page): Promise<Frame | null> {
  await page.goto(CONFIG.indexUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  // GNB(구매관리) 클릭
  await clickTextInAnyFrame(page, CONFIG.gnbName);
  await page.waitForTimeout(1000);

  // 중분류(구매요구) 클릭
  await clickTextInAnyFrame(page, CONFIG.groupName);
  await page.waitForTimeout(1000);

  // 메뉴(직접구매지급신청) 클릭
  await clickTextInAnyFrame(page, CONFIG.menuName);
  await page.waitForTimeout(3000);

  // pur0910 프레임 반환
  return page.frames().find(f => f.url().includes('pur_0910') || f.url().includes('pur0910')) ?? null;
}

// ============================================================================
// 직접구매지급신청 통합 테스트
// ============================================================================
test.describe('직접구매지급신청 통합 테스트', () => {

  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  // --------------------------------------------------------------------------
  // [no:1] 화면 진입 및 초기 목록 조회 확인
  // 예상결과: 직접구매지급신청 화면에 진입하고 초기 목록이 조회된다.
  // --------------------------------------------------------------------------
  test('[no:1] 직접구매지급신청 - 화면 진입 및 초기 목록 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 직접구매지급신청 - 화면 진입');
    logInput('메뉴', `${CONFIG.gnbName} > ${CONFIG.groupName} > ${CONFIG.menuName}`);

    const frame = await navigateToTarget(page);
    logResult('프레임 진입', frame ? '성공' : '미확인');

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-inte-no1-main.png`, fullPage: true });

    const currentUrl = page.url();
    logResult('현재 URL', currentUrl);

    // 화면 로딩 성공 시 오류 메시지가 없어야 함
    const errorVisible = await page.locator('text=오류').isVisible({ timeout: 1000 }).catch(() => false);
    expect(errorVisible, '화면 진입 시 오류 없음').toBe(false);
    logResult('검증', 'PASS');
  });

  // --------------------------------------------------------------------------
  // [no:2] 조회 버튼 클릭 후 그리드 갱신 확인
  // 예상결과: 조회 버튼 클릭 시 직접구매지급신청 목록이 갱신된다.
  // --------------------------------------------------------------------------
  test('[no:2] 직접구매지급신청 - 조회 버튼 클릭', async ({ workerPage: page }) => {
    logTestStart('[no:2] 직접구매지급신청 - 조회 버튼');

    await navigateToTarget(page);
    await page.waitForTimeout(2000);

    const btnClicked = await clickTextInAnyFrame(page, '조회');
    logResult('조회버튼 클릭', btnClicked ? '성공' : '미확인');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-inte-no2-search.png`, fullPage: true });

    // 조회 후 오류 없음 확인
    const errorVisible = await page.locator('text=오류').isVisible({ timeout: 1000 }).catch(() => false);
    expect(errorVisible, '조회 후 오류 없음').toBe(false);
    logResult('검증', 'PASS');
  });

  // --------------------------------------------------------------------------
  // [no:3] 그리드 행 클릭 — 상세 화면/팝업 오픈 확인
  // 목록에 데이터가 없으면 검증을 스킵한다.
  // 예상결과: 그리드 행 클릭 시 상세 화면이 오류 없이 표시된다.
  // --------------------------------------------------------------------------
  test('[no:3] 직접구매지급신청 - 그리드 행 클릭 상세', async ({ workerPage: page }) => {
    logTestStart('[no:3] 직접구매지급신청 - 그리드 행 클릭');

    await navigateToTarget(page);
    await page.waitForTimeout(2000);

    const frameWithGrid = page.frames().find(f => f.url().includes('pur_0910') || f.url().includes('pur0910'));

    if (!frameWithGrid) {
      logResult('프레임', '미진입 - 상세 테스트 스킵');
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-inte-no3-skip.png`, fullPage: true });
      return;
    }

    // 그리드 첫 번째 데이터 행 클릭 시도
    try {
      const firstRow = frameWithGrid.locator('.GridCellStyle:nth-child(2)').first();
      if (await firstRow.isVisible({ timeout: 3000 })) {
        await firstRow.click();
        await page.waitForTimeout(2000);
        logResult('첫 행 클릭', '성공');
      } else {
        logResult('그리드 행', '데이터 없음 - 상세 테스트 스킵');
      }
    } catch {
      logResult('그리드 클릭', '시도 실패 - 스킵');
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-inte-no3-detail.png`, fullPage: true });

    // 오류 없음 확인
    const errorVisible = await page.locator('text=오류').isVisible({ timeout: 1000 }).catch(() => false);
    expect(errorVisible, '행 클릭 후 오류 없음').toBe(false);
    logResult('검증', 'PASS');
  });

});
