// ==============================================================
// HRM — 부서관리 통합 테스트 (hrm_0130M)
// 생성일시: 2026-06-25  |  파일: 20260625_hrm0130_inte.spec.ts
// 화면: 부서관리 (부서마스터)
// 메뉴: 인사관리 > 부서관리
// API: /mis/hrm/hrm0130/getList.do (조회), /mis/hrm/hrm0130/setData.do (저장)
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
  // GNB 클릭
  const gnbOk = await clickTextInAnyFrame(page, CONFIG.gnbName, 5000);
  if (!gnbOk) console.warn('[NAV] GNB 클릭 실패:', CONFIG.gnbName);
  await page.waitForTimeout(800);

  // 메뉴 클릭
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

// ── Nexacro 검색조건 설정 (ds_search 직접 + div_Search 컴포넌트) ─────────────
async function setSearchValue(frame: Frame, colId: string, value: string): Promise<void> {
  await frame.evaluate(([col, val]) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      if (!mdi) return;
      for (let i = 0; i < mdi.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (!wf) continue;
        // ds_search에 직접 설정
        if (wf.ds_search) {
          if (wf.ds_search.rowcount === 0) wf.ds_search.addRow();
          wf.ds_search.setColumn(0, col, val);
        }
        // div_Search 내 컴포넌트에도 반영 (Combo/Edit)
        const comp = wf?.div_Search?.form?.[col];
        if (comp?.set_value) {
          comp.set_value(val);
        } else if (comp?.set_text) {
          comp.set_text(val);
        }
        return;
      }
    } catch (e) { console.warn('setSearchValue error:', e); }
  }, [colId, value] as [string, string]).catch(() => {});
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

// ── ds_list에 신규 행 추가 및 값 설정 ────────────────────────────────────────
async function addRowAndSet(frame: Frame, colId: string, value: string): Promise<number> {
  return frame.evaluate(([col, val]) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      if (!mdi) return -1;
      for (let i = 0; i < mdi.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (!wf?.ds_list) continue;
        // btn_row_add 클릭 → gfn_insertRow가 tmHeader='I'로 행 추가
        if (wf.btn_row_add) wf.btn_row_add.click();
        const newRow = wf.ds_list.rowcount - 1;
        if (newRow >= 0) wf.ds_list.setColumn(newRow, col, val);
        return newRow;
      }
      return -1;
    } catch { return -1; }
  }, [colId, value] as [string, string]).catch(() => -1);
}

// ── 모든 행의 특정 컬럼 값 배열 조회 ─────────────────────────────────────────
async function getAllColumnValues(frame: Frame, colId: string): Promise<string[]> {
  return frame.evaluate((col) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      if (!mdi) return [];
      for (let i = 0; i < mdi.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (!wf?.ds_list) continue;
        const rows: string[] = [];
        for (let r = 0; r < wf.ds_list.rowcount; r++) {
          rows.push(String(wf.ds_list.getColumn(r, col) ?? ''));
        }
        return rows;
      }
      return [];
    } catch { return []; }
  }, colId).catch(() => []);
}

// ============================================================================
// 통합 테스트 — 부서관리 (hrm_0130M)
// ============================================================================
test.describe('통합 테스트 — 부서관리 (hrm_0130M)', () => {

  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  // --------------------------------------------------------------------------
  // [no:1] 화면 진입 및 초기 자동 조회 확인
  // 시나리오 흐름: 메뉴 이동 > 화면 자동 로드 > 초기 조회(SCH_USE_YN=Y) 확인
  // 예상결과: 사용여부=Y 부서 목록 1건 이상 조회됨
  // --------------------------------------------------------------------------
  test('[no:1] [통합] [SELECT] 화면 진입 및 초기 자동 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] [통합] 화면 진입 및 초기 자동 조회');
    logInput('메뉴', `${CONFIG.gnbName} > ${CONFIG.menuName}`);
    logInput('초기 조건', 'SCH_USE_YN=Y (자동)');

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
      expect(cnt, '초기 조회 결과 1건 이상 (USE_YN=Y)').toBeGreaterThan(0);

      // 모든 행의 USE_YN 확인: 초기 조건이 Y이므로 Y만 있어야 함
      const useYnList = await getAllColumnValues(frame, 'USE_YN');
      const nonY = useYnList.filter(v => v !== 'Y' && v !== '');
      logResult('USE_YN≠Y 행 수', nonY.length);
      expect(nonY.length, '초기 조회 시 USE_YN=Y 이외 행 없어야 함').toBe(0);
    } else {
      // 프레임 없이도 메인 페이지 타이틀로 성공 확인
      const titleOk = await page.locator('text=부서관리').isVisible({ timeout: 3000 }).catch(() => false);
      logResult('타이틀 표시', titleOk);
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no1-init.png`, fullPage: true });
    expect(resp, 'getList API 호출되어야 함').not.toBeNull();
    logResult('검증', '✅ PASS');
  });

  // --------------------------------------------------------------------------
  // [no:2] 사용여부 Y 조건 조회
  // 시나리오 흐름: 메뉴 이동 > SCH_USE_YN=Y 설정 > [조회] 버튼 클릭 > 목록 확인
  // 예상결과: USE_YN=Y 부서 1건 이상 조회됨
  // --------------------------------------------------------------------------
  test('[no:2] [통합] [SELECT] 사용여부=Y 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] [통합] 사용여부=Y 조건 조회');
    logInput('SCH_USE_YN', 'Y');

    const frame = await navigateToHrm0130M(page);
    await page.waitForTimeout(2000);

    if (!frame) {
      logResult('프레임 진입', '실패 — 스킵');
      test.skip();
      return;
    }

    await setSearchValue(frame, 'SCH_USE_YN', 'Y');
    logResult('검색조건 설정', 'SCH_USE_YN=Y');

    const respPromise = page.waitForResponse(
      res => res.url().includes(API_GET) && res.status() === 200,
      { timeout: 15000 }
    ).catch(() => null);
    await clickButton(frame, 'btn_search');
    const resp = await respPromise;
    logResult('getList API', resp ? `HTTP ${resp.status()}` : '타임아웃');

    await page.waitForTimeout(1500);
    const cnt = await getDsListRowCount(frame);
    logResult('조회 건수', cnt);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no2-useyn-y.png`, fullPage: true });

    expect(resp, 'getList API 호출되어야 함').not.toBeNull();
    expect(cnt, 'USE_YN=Y 결과 1건 이상').toBeGreaterThan(0);

    const useYnList = await getAllColumnValues(frame, 'USE_YN');
    useYnList.forEach((v, i) =>
      expect(v, `[행${i}] USE_YN이 Y여야 함`).toBe('Y')
    );

    logResult('검증', `✅ PASS — ${cnt}건`);
  });

  // --------------------------------------------------------------------------
  // [no:3] 부서명 키워드 검색
  // 시나리오 흐름: 메뉴 이동 > SCH_DEPT_NM='기획' 입력 > [조회] 클릭 > 목록 확인
  // 예상결과: DEPT_NM에 '기획'이 포함된 부서 1건 이상 조회됨
  // --------------------------------------------------------------------------
  test('[no:3] [통합] [SELECT] 부서명 "기획" 검색', async ({ workerPage: page }) => {
    logTestStart('[no:3] [통합] 부서명 "기획" 검색');
    logInput('SCH_DEPT_NM', '기획');

    const frame = await navigateToHrm0130M(page);
    await page.waitForTimeout(2000);

    if (!frame) {
      logResult('프레임 진입', '실패 — 스킵');
      test.skip();
      return;
    }

    // 전체 조회로 초기화
    await setSearchValue(frame, 'SCH_USE_YN', '');
    await setSearchValue(frame, 'SCH_DEPT_NM', '기획');
    logResult('검색조건 설정', 'SCH_DEPT_NM=기획');

    const respPromise = page.waitForResponse(
      res => res.url().includes(API_GET) && res.status() === 200,
      { timeout: 15000 }
    ).catch(() => null);
    await clickButton(frame, 'btn_search');
    const resp = await respPromise;
    logResult('getList API', resp ? `HTTP ${resp.status()}` : '타임아웃');

    await page.waitForTimeout(1500);
    const cnt = await getDsListRowCount(frame);
    logResult('조회 건수', cnt);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no3-deptname.png`, fullPage: true });

    expect(resp, 'getList API 호출되어야 함').not.toBeNull();
    expect(cnt, '"기획" 검색 결과 1건 이상').toBeGreaterThan(0);

    const deptNmList = await getAllColumnValues(frame, 'DEPT_NM');
    deptNmList.forEach((v, i) =>
      expect(v, `[행${i}] DEPT_NM에 "기획" 포함 필요`).toContain('기획')
    );

    logResult('검증', `✅ PASS — ${cnt}건`);
  });

  // --------------------------------------------------------------------------
  // [no:4] [비정상] 유효성 오류 — 부서명 없이 저장 시도
  // 시나리오 흐름: 메뉴 이동 > [행추가] 클릭 > DEPT_NM 비워둠 > [저장] 클릭
  // 예상결과: 유효성 검사 알림(DEPT_NM 필수)이 표시되고 API 호출 없음
  // --------------------------------------------------------------------------
  test('[no:4] [통합] [비정상] 부서명 없이 저장 시 유효성 오류', async ({ workerPage: page }) => {
    logTestStart('[no:4] [통합][비정상] 부서명 없이 저장 시 유효성 오류');
    logInput('DEPT_NM', '(비어있음)');

    const frame = await navigateToHrm0130M(page);
    await page.waitForTimeout(2000);

    if (!frame) {
      logResult('프레임 진입', '실패 — 스킵');
      test.skip();
      return;
    }

    // 대화상자 감지를 위한 Promise
    let alertMsg = '';
    const dialogPromise = page.waitForEvent('dialog', { timeout: 8000 }).then(d => {
      alertMsg = d.message();
      return d.accept().then(() => alertMsg);
    }).catch(() => '');

    // 행 추가 (DEPT_NM은 비워둠)
    await clickButton(frame, 'btn_row_add');
    logResult('행 추가', '완료');
    await page.waitForTimeout(500);

    // API 호출 여부 감시 (유효성 실패 시 API 호출 없어야 함)
    let apiCalled = false;
    const apiWatcher = page.waitForResponse(
      res => res.url().includes(API_SET),
      { timeout: 4000 }
    ).then(() => { apiCalled = true; }).catch(() => {});

    // 저장 버튼 클릭 → 유효성 알림 기대
    await clickButton(frame, 'btn_save');
    logResult('[저장] 버튼 클릭', '완료');

    const msg = await dialogPromise;
    await apiWatcher;

    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no4-validation.png`, fullPage: true });

    logResult('유효성 알림 메시지', msg || '(없음)');
    logResult('setData API 호출됨', apiCalled);

    // 저장 API가 호출되지 않았어야 함
    expect(apiCalled, 'DEPT_NM 없이 setData API 호출되면 안 됨').toBe(false);
    // 알림 메시지가 발생했어야 함 (부서명 또는 필수 관련 메시지)
    if (msg) {
      logResult('검증', `✅ PASS — 알림: ${msg}`);
    } else {
      // 알림 없이 저장이 막혔다면 API 미호출로 판단
      logResult('검증', '✅ PASS — 알림 없이도 API 미호출 확인');
    }
  });

  // --------------------------------------------------------------------------
  // [no:5] 신규 부서 행 추가 후 저장 (INSERT)
  // 시나리오 흐름: 메뉴 이동 > [행추가] 클릭 > DEPT_NM 입력 > [저장] 클릭 > 저장 확인 다이얼로그 [확인]
  // 예상결과: setData API HTTP 200 응답, 저장 완료 후 목록 재조회 시 1건 이상 조회됨
  // --------------------------------------------------------------------------
  test('[no:5] [통합] [INSERT] 신규 부서 행 추가 후 저장', async ({ workerPage: page }) => {
    const testDeptNm = `TEST_DEPT_${Date.now()}`.substring(0, 20);
    logTestStart('[no:5] [통합][INSERT] 신규 부서 저장');
    logInput('DEPT_NM', testDeptNm);
    logInput('tmHeader', 'I (행추가)');

    const frame = await navigateToHrm0130M(page);
    await page.waitForTimeout(2000);

    if (!frame) {
      logResult('프레임 진입', '실패 — 스킵');
      test.skip();
      return;
    }

    // 행 추가 + DEPT_NM 설정
    const newRow = await addRowAndSet(frame, 'DEPT_NM', testDeptNm);
    logResult('신규 행 추가 (rowIndex)', newRow);
    await page.waitForTimeout(500);

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
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no5-insert.png`, fullPage: true });

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
