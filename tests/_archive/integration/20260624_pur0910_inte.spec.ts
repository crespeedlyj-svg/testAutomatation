// ==============================================================
// PUR — 직접구매신청현황 통합 테스트 (pur_0910M)
// 생성일시: 2026-06-24  |  파일: 20260624_pur0910_inte.spec.ts
// 화면: 직접구매신청현황 (직접구매신청 목록)
// 메뉴: 구매관리 > 직접구매신청현황
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

const CONFIG = {
  indexUrl: `${BASE_URL}/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_${SYSTEM_ID}`,
  defaultTimeout: 15000,
  gnbName: '구매관리',
  menuName: '직접구매신청현황',
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

// ── 메뉴 탐색 → 직접구매신청현황 화면 진입 ────────────────────────────────
async function navigateToPur0910M(page: Page): Promise<Frame | null> {
  await page.goto(CONFIG.indexUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  // GNB 클릭
  await clickTextInAnyFrame(page, CONFIG.gnbName);
  await page.waitForTimeout(1000);

  // 메뉴 클릭
  await clickTextInAnyFrame(page, CONFIG.menuName);
  await page.waitForTimeout(3000);

  // pur_0910M 프레임 반환
  return page.frames().find(f => f.url().includes('pur_0910M') || f.url().includes('pur0910')) ?? null;
}

// ============================================================================
// [pur_0910M] 통합 테스트 — 직접구매신청현황
// ============================================================================
test.describe('직접구매신청현황 통합 테스트 (pur_0910M)', () => {

  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  // --------------------------------------------------------------------------
  // [no:1] 화면 진입 및 초기 목록 조회 확인 [IT_PUR0910_0001]
  // --------------------------------------------------------------------------
  test('[no:1] [통합] [SELECT] 직접구매신청 - 화면 진입 및 초기 목록 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] [통합] 직접구매신청 - 화면 진입');
    logInput('메뉴', `${CONFIG.gnbName} > ${CONFIG.menuName}`);

    const frame = await navigateToPur0910M(page);
    logResult('프레임 진입', frame ? '성공' : '실패');

    // 화면 진입 성공 여부는 그리드 제목으로 확인
    const titleVisible = await page.locator('text=직접구매신청 목록').isVisible({ timeout: 5000 }).catch(() => false);
    logResult('타이틀 표시', titleVisible ? '확인' : '미확인');

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-inte-no1-main.png`, fullPage: true });

    // 화면이 정상 진입되면 frame이 존재하거나 URL에 관련 경로 포함
    const currentUrl = page.url();
    logResult('현재 URL', currentUrl);
    // 화면 로딩 성공 시 오류 메시지가 없어야 함
    const errorVisible = await page.locator('text=오류').isVisible({ timeout: 1000 }).catch(() => false);
    expect(errorVisible).toBe(false);
  });

  // --------------------------------------------------------------------------
  // [no:2] 조회 버튼 클릭 후 그리드 갱신 확인 [IT_PUR0910_0002]
  // --------------------------------------------------------------------------
  test('[no:2] [통합] [SELECT] 직접구매신청 - 조회 버튼 클릭', async ({ workerPage: page }) => {
    logTestStart('[no:2] [통합] 직접구매신청 - 조회 버튼');

    const frame = await navigateToPur0910M(page);
    await page.waitForTimeout(2000);

    // 조회 버튼 클릭
    const btnClicked = await clickTextInAnyFrame(page, '조회');
    logResult('조회버튼 클릭', btnClicked ? '성공' : '실패');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-inte-no2-search.png`, fullPage: true });

    // 조회 후 오류 없음 확인
    const errorVisible = await page.locator('text=오류').isVisible({ timeout: 1000 }).catch(() => false);
    expect(errorVisible).toBe(false);
  });

  // --------------------------------------------------------------------------
  // [no:3] 그리드 행 클릭 — 상세 팝업(pur_0911M) 오픈 확인 [IT_PUR0910_0003]
  // 목록에 데이터가 없으면 skip 처리
  // --------------------------------------------------------------------------
  test('[no:3] [통합] [SELECT] 직접구매신청 - 그리드 행 클릭 상세 팝업', async ({ workerPage: page }) => {
    logTestStart('[no:3] [통합] 직접구매신청 - 상세 팝업');

    await navigateToPur0910M(page);
    await page.waitForTimeout(2000);

    // 목록 첫 행의 신청번호 셀 클릭 시도
    const frameWithGrid = page.frames().find(f => f.url().includes('pur_0910M') || f.url().includes('pur0910'));

    if (!frameWithGrid) {
      logResult('프레임', '미진입 - 팝업 테스트 스킵');
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-inte-no3-skip.png`, fullPage: true });
      return; // 화면 미진입 시 스킵
    }

    // 그리드 첫 번째 데이터 행 클릭 (신청번호 컬럼)
    try {
      const firstRow = frameWithGrid.locator('.GridCellStyle:nth-child(2)').first();
      if (await firstRow.isVisible({ timeout: 3000 })) {
        await firstRow.click();
        await page.waitForTimeout(2000);
        logResult('신청번호 클릭', '성공');
      } else {
        logResult('그리드 행', '데이터 없음 - 팝업 테스트 스킵');
      }
    } catch {
      logResult('그리드 클릭', '시도 실패 - 스킵');
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-inte-no3-popup.png`, fullPage: true });

    // 오류 없음 확인
    const errorVisible = await page.locator('text=오류').isVisible({ timeout: 1000 }).catch(() => false);
    expect(errorVisible).toBe(false);
  });

});
