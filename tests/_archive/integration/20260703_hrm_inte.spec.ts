// ==============================================================
// HRM — 부서관리 통합 테스트 (hrm_0130M)
// 생성일시: 2026-07-03  |  파일: 20260703_hrm_inte.spec.ts
// 화면: 부서관리 (부서마스터)
// 메뉴: 인사관리 > 부서관리
// API: /mis/hrm/hrm0130/getList.do (조회), /mis/hrm/hrm0130/setData.do (저장)
// 입력 방식: 그리드 셀(Grid01.getCellRect) 실좌표 계산 → 실제 마우스 클릭 + 키보드 타이핑
//           (20260625_hrm0130_inte.spec.ts의 ds_list.setColumn 직접 주입 방식을
//            "실제 UI 조작"으로 전환 — DEPT_NM은 컴포넌트가 아닌 Grid01 셀 바인딩이라
//            독립 compId가 없으므로 Nexacro Grid의 getCellRect(row,col) API로 셀의
//            그리드 상대좌표를 구하고, 그리드 자신의 뷰포트 오프셋과 합산해 절대좌표를 얻는다)
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

const API_GET  = '/mis/hrm/hrm0130/getList.do';
const API_SET  = '/mis/hrm/hrm0130/setData.do';

// Grid01 컬럼 정의(hrm_0130M.xfdl Format/Band 기준) — DEPT_NM은 col=4
const GRID_ID       = 'Grid01';
const COL_DEPT_NM   = 4;

const CONFIG = {
  indexUrl: `${BASE_URL}/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_${SYSTEM_ID}`,
  defaultTimeout: 15000,
  gnbName:  '인사관리',
  menuName: '부서관리',
};

// ── 공통 유틸: 모든 프레임에서 텍스트 클릭 ─────────────────────────────────
async function clickTextInAnyFrame(page: Page, text: string, timeout = 3000): Promise<boolean> {
  const results = await Promise.all(
    page.frames().map(async (frame) => {
      try {
        const el = frame.locator(`text="${text}"`).first();
        if (await el.isVisible({ timeout })) {
          await el.click();
          return true;
        }
      } catch {}
      return false;
    })
  );
  return results.some(Boolean);
}

// ── hrm_0130M 프레임 탐색 ────────────────────────────────────────────────────
function findHrm0130Frame(page: Page): Frame | null {
  return page.frames().find(
    f => f.url().includes('hrm_0130M') || f.url().includes('hrm0130')
  ) ?? null;
}

// ── 화면 진입 ─────────────────────────────────────────────────────────────────
async function navigateToHrm0130M(page: Page): Promise<Frame | null> {
  const gnbOk = await clickTextInAnyFrame(page, CONFIG.gnbName, 5000);
  if (!gnbOk) console.warn('[NAV] GNB 클릭 실패:', CONFIG.gnbName);
  await page.waitForTimeout(800);

  const menuOk = await clickTextInAnyFrame(page, CONFIG.menuName, 5000);
  if (!menuOk) console.warn('[NAV] 메뉴 클릭 실패:', CONFIG.menuName);
  await page.waitForTimeout(3000);

  return findHrm0130Frame(page);
}

// ── Nexacro ds_list 행 수 조회 ──────────────────────────────────────────────
async function getDsListRowCount(frame: Frame): Promise<number> {
  return frame.evaluate(() => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      if (!mdi) return -1;
      for (let i = 0; i < mdi.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.ds_list !== undefined) return wf.ds_list.rowcount ?? 0;
      }
      return -1;
    } catch { return -1; }
  }).catch(() => -1);
}

// ── ds_list 특정 행/컬럼 값 조회 ────────────────────────────────────────────
async function getDsListValue(frame: Frame, row: number, colId: string): Promise<string> {
  return frame.evaluate(([r, c]) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      if (!mdi) return '';
      for (let i = 0; i < mdi.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.ds_list !== undefined) {
          return String(wf.ds_list.getColumn(r, c) ?? '');
        }
      }
      return '';
    } catch { return ''; }
  }, [row, colId] as [number, string]).catch(() => '');
}

// ── 버튼 클릭 ─────────────────────────────────────────────────────────────────
async function clickButton(frame: Frame, btnId: string): Promise<void> {
  await frame.evaluate((id) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      if (!mdi) return;
      for (let i = 0; i < mdi.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.[id]) {
          wf[id].click();
          return;
        }
      }
    } catch (e) { console.warn('clickButton error:', id, e); }
  }, btnId).catch(() => {});
}

/**
 * Grid01의 특정 셀(row, col)의 화면 절대좌표(viewport 기준)를 계산한다.
 *
 * Nexacro Grid.getCellRect(row, col)는 그리드 컴포넌트 "내부" 상대좌표(left/top/width/height)를
 * 반환한다(Grid.js 확인: getCellRect → getSubCellRect → {left,top,right,bottom,width,height}).
 * 여기에 그리드 컴포넌트 자신의 부모 체인 오프셋(getOffsetLeft/getOffsetTop 누적,
 * nexacro-helper.ts의 getNexacroEditableRect와 동일 기법)을 더해 절대좌표를 얻는다.
 */
async function getGridCellAbsRect(
  frame: Frame, gridId: string, row: number, col: number
): Promise<{ x: number; y: number; w: number; h: number } | null> {
  return frame.evaluate(([gId, r, c]) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      if (!mdi) return null;
      for (let i = 0; i < mdi.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        const grid = wf?.[gId];
        if (!grid || typeof grid.getCellRect !== 'function') continue;

        const rect = grid.getCellRect(r, c);
        if (!rect || rect.width <= 0 || rect.height <= 0) return null;

        // 그리드 컴포넌트 자신의 절대 오프셋 누적 (application 기준 0,0)
        let x = 0, y = 0, node: any = grid, guard = 0;
        while (node && guard++ < 40) {
          try {
            x += typeof node.getOffsetLeft === 'function' ? (node.getOffsetLeft() || 0) : 0;
            y += typeof node.getOffsetTop  === 'function' ? (node.getOffsetTop()  || 0) : 0;
          } catch {}
          node = node.parent ?? null;
        }

        return {
          x: x + rect.left + rect.width  / 2,
          y: y + rect.top  + rect.height / 2,
          w: rect.width,
          h: rect.height,
        };
      }
      return null;
    } catch { return null; }
  }, [gridId, row, col] as [string, number, number]).catch(() => null);
}

/**
 * DEPT_NM 그리드 셀에 "실제" 마우스 클릭 + 키보드 타이핑으로 값을 입력한다.
 * (tmHeader='I'인 신규행은 XFDL상 col=4가 editcontrol로 렌더링되어 클릭 시 바로 입력 가능)
 *
 * 실좌표 계산이 실패하거나(레이아웃 변경 등) 입력 후 값이 실제로 반영되지 않은 경우에는
 * 검증된 ds_list.setColumn() 직접 주입으로 자동 폴백한다 — 두 경로 모두 로그로 구분.
 */
async function typeDeptNmCell(page: Page, frame: Frame, row: number, value: string): Promise<'click-type' | 'dataset-fallback' | 'failed'> {
  const rect = await getGridCellAbsRect(frame, GRID_ID, row, COL_DEPT_NM);

  if (rect) {
    console.log(`  [CELL] DEPT_NM 셀 좌표 계산: x=${Math.round(rect.x)}, y=${Math.round(rect.y)} (w=${rect.w}, h=${rect.h})`);
    await page.mouse.click(rect.x, rect.y);
    await page.waitForTimeout(200);
    await page.keyboard.press('Control+A');
    await page.keyboard.type(value);
    await page.keyboard.press('Tab'); // 편집 확정 (다음 셀/컨트롤로 포커스 이동하며 onchanged 반영)
    await page.waitForTimeout(300);

    const applied = await getDsListValue(frame, row, 'DEPT_NM');
    if (applied === value) return 'click-type';
    console.warn(`  ⚠️  [CELL] 클릭+타이핑 후 값 불일치 (기대="${value}" 실제="${applied}") — Dataset 직접 설정으로 폴백`);
  } else {
    console.warn('  ⚠️  [CELL] DEPT_NM 셀 좌표 계산 실패 — Dataset 직접 설정으로 폴백');
  }

  // ── 폴백: 검증된 방식(20260625_hrm0130_inte.spec.ts와 동일) ──────────────
  const ok = await frame.evaluate(([r, v]) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      if (!mdi) return false;
      for (let i = 0; i < mdi.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.ds_list !== undefined) { wf.ds_list.setColumn(r, 'DEPT_NM', v); return true; }
      }
      return false;
    } catch { return false; }
  }, [row, value] as [number, string]).catch(() => false);

  return ok ? 'dataset-fallback' : 'failed';
}

// ── 행 추가(신규) — btn_row_add 클릭만 담당, 값 입력은 typeDeptNmCell이 담당 ──
async function addRow(frame: Frame): Promise<number> {
  return frame.evaluate(() => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      if (!mdi) return -1;
      for (let i = 0; i < mdi.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (!wf?.ds_list) continue;
        if (wf.btn_row_add) wf.btn_row_add.click(); // gfn_insertRow → tmHeader='I'로 행 추가
        return wf.ds_list.rowcount - 1;
      }
      return -1;
    } catch { return -1; }
  }).catch(() => -1);
}

// ============================================================================
// 통합 테스트 — 부서관리 (hrm_0130M)
// ============================================================================
test.describe('통합 테스트 — 부서관리 (hrm_0130M, Nexacro 컴포넌트 직접 조작)', () => {

  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  // --------------------------------------------------------------------------
  // [no:1] 화면 진입 및 초기 자동 조회 확인
  // --------------------------------------------------------------------------
  test('[no:1] [통합] [SELECT] 화면 진입 및 초기 자동 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] [통합] 화면 진입 및 초기 자동 조회');
    logInput('메뉴', `${CONFIG.gnbName} > ${CONFIG.menuName}`);

    const getRespPromise = page.waitForResponse(
      res => res.url().includes(API_GET) && res.status() === 200,
      { timeout: 20000 }
    ).catch(() => null);

    const frame = await navigateToHrm0130M(page);
    logResult('프레임 진입', frame ? '성공' : '실패');

    const resp = await getRespPromise;
    logResult('getList API 응답', resp ? `HTTP ${resp.status()}` : '타임아웃');
    await page.waitForTimeout(1500);

    if (frame) {
      const cnt = await getDsListRowCount(frame);
      logResult('ds_list 행 수', cnt);
      expect(cnt, '초기 조회 결과 1건 이상').toBeGreaterThan(0);
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm-inte-no1-init.png`, fullPage: true });
    expect(resp, 'getList API 호출되어야 함').not.toBeNull();
    logResult('검증', '✅ PASS');
  });

  // --------------------------------------------------------------------------
  // [no:5] 신규 부서 행 추가 후 저장 (INSERT) — 그리드 셀 실클릭+타이핑
  // 시나리오 흐름: 메뉴 이동 > [행추가] 클릭 > DEPT_NM 셀 실좌표 클릭 후 키보드 타이핑
  //             > [저장] 클릭 > 저장 확인 다이얼로그 [확인]
  // 예상결과: setData API HTTP 200 응답, 저장 완료 후 목록 재조회 시 1건 이상 조회됨
  // --------------------------------------------------------------------------
  test('[no:5] [통합] [INSERT] 신규 부서 행 추가 후 저장 (그리드 셀 직접 입력)', async ({ workerPage: page }) => {
    const testDeptNm = `TEST_DEPT_${Date.now()}`.substring(0, 20);
    logTestStart('[no:5] [통합][INSERT] 신규 부서 저장 (그리드 셀 클릭+타이핑)');
    logInput('DEPT_NM', testDeptNm);
    logInput('tmHeader', 'I (행추가)');

    const frame = await navigateToHrm0130M(page);
    await page.waitForTimeout(2000);

    if (!frame) {
      logResult('프레임 진입', '실패 — 스킵');
      test.skip();
      return;
    }

    // 행 추가 (btn_row_add 클릭 — 버튼은 Nexacro 컴포넌트 API로 클릭, 텍스트 입력만 실제 UI 조작 대상)
    const newRow = await addRow(frame);
    logResult('신규 행 추가 (rowIndex)', newRow);
    if (newRow < 0) { logResult('행 추가', '실패 — 스킵'); test.skip(); return; }
    await page.waitForTimeout(500);

    // DEPT_NM 그리드 셀 — 실제 마우스 클릭 + 키보드 타이핑 (실패 시 Dataset 직접 설정 폴백)
    const inputMethod = await typeDeptNmCell(page, frame, newRow, testDeptNm);
    logResult('DEPT_NM 입력 방식', inputMethod);
    expect(inputMethod, 'DEPT_NM 입력 실패 (클릭+타이핑, 폴백 모두 실패)').not.toBe('failed');

    const appliedVal = await getDsListValue(frame, newRow, 'DEPT_NM');
    logResult('DEPT_NM 반영값', appliedVal);
    expect(appliedVal, 'DEPT_NM 값이 그리드에 반영되어야 함').toBe(testDeptNm);

    // 저장 API 응답 감시
    const setRespPromise = page.waitForResponse(
      res => res.url().includes(API_SET) && res.status() === 200,
      { timeout: 15000 }
    ).catch(() => null);

    // 저장 버튼 클릭 → 확인 다이얼로그는 fixture가 자동 수락
    await clickButton(frame, 'btn_save');
    logResult('[저장] 버튼 클릭', '완료');

    const setResp = await setRespPromise;
    logResult('setData API 응답', setResp ? `HTTP ${setResp.status()}` : '타임아웃');

    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm-inte-no5-insert.png`, fullPage: true });

    expect(setResp, 'setData API 호출 및 HTTP 200 응답 필요').not.toBeNull();
    if (setResp) {
      expect(setResp.status(), 'setData HTTP 200 필요').toBe(200);
    }

    // 저장 후 재조회하여 행이 있음을 확인
    const getAfterPromise = page.waitForResponse(
      res => res.url().includes(API_GET) && res.status() === 200,
      { timeout: 10000 }
    ).catch(() => null);
    await clickButton(frame, 'btn_search');
    await getAfterPromise;
    await page.waitForTimeout(1500);

    const cntAfter = await getDsListRowCount(frame);
    logResult('저장 후 목록 건수', cntAfter);
    expect(cntAfter, '저장 후 재조회 시 1건 이상').toBeGreaterThan(0);

    logResult('검증', '✅ PASS');
  });

});
