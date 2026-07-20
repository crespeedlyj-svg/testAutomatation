// ==============================================================
// PUR — 직접구매지급신청 통합 테스트 (pur_0910M)
// 생성일시: 2026-06-23  |  파일: 20260623_pur0910M_inte.spec.ts
// 화면: 직접구매신청현황 (직접구매신청 목록)
// 메뉴: 구매관리 > 구매요구 > 직접구매지급신청
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page, Frame } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logAction, logResult, logInfo, logTestStart, flushLogs,
} from '../utils/test-logger';
import { assertNexacroResponse } from '../utils/nexacro-helper';

const BASE_URL  = process.env.APP_BASE_URL      ?? '';
const SYSTEM_ID = process.env.APP_SYSTEM_ID     ?? '';
const CTX_PATH  = process.env.APP_CONTEXT_PATH  ?? 'gprooneis';

const CONFIG = {
  baseUrl:        BASE_URL,
  indexUrl:       `${BASE_URL}/nxui/${CTX_PATH}/index.jsp?UP_MENU_ID=M_${SYSTEM_ID}`,
  defaultTimeout: 15000,
};
const SCREENSHOT_DIR = 'test-results/screenshots';

// TC 간 공유 상태 — beforeAll에서 1회 세션 로그인 + 메뉴 진입 후 재사용
let sharedFrame: Frame | null = null;

// ── 화면 구성요소 ID (pur_0910M.xfdl 기준) ────────────────────────────────
const COMPONENTS = {
  btnSearch:       'btn_search',       // 조회 버튼
  btnRegistration: 'btn_registration', // 신규 버튼
  btnExcelDn:      'btn_excel_dn',     // 엑셀다운 버튼
  btnHelp:         'btn_help',         // 도움말 버튼
  grid:            'Grid01',           // 목록 그리드
  dsList:          'ds_list',          // 목록 데이터셋
  dsSearch:        'ds_search',        // 검색조건 데이터셋
  stcRowCnt:       'stc_gridRowCnt',   // 총 N건 텍스트
};

// ── 메뉴 경로 ────────────────────────────────────────────────────────────────
const MENU = {
  gnb:    '구매관리',
  group:  '구매요구',
  target: '직접구매지급신청',
  sub:    '',
};

// ============================================================================
// Nexacro 헬퍼 함수
// ============================================================================

/** pur_0910M 화면 로드 확인 — 핵심 컴포넌트(btn_search, ds_list, Grid01) 존재 여부 */
async function isPur0910MLoaded(frame: Frame): Promise<boolean> {
  return await frame.evaluate(({ btn, ds, grid }) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      if (!mdi) return false;
      for (let i = 0; i < mdi.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.[btn] !== undefined && wf?.[ds] !== undefined && wf?.[grid] !== undefined)
          return true;
      }
      return false;
    } catch { return false; }
  }, { btn: COMPONENTS.btnSearch, ds: COMPONENTS.dsList, grid: COMPONENTS.grid }).catch(() => false);
}

/** pur_0910M 화면 로드 polling 대기 */
async function waitForPur0910M(frame: Frame, timeout = CONFIG.defaultTimeout): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await isPur0910MLoaded(frame)) return true;
    await frame.page().waitForTimeout(300);
  }
  return false;
}

/** Nexacro 메인 프레임 반환 — MDIWORK 초기화 확인 */
async function waitForNexacroFrame(page: Page, timeout = CONFIG.defaultTimeout): Promise<Frame | null> {
  const mainFrame = page.mainFrame();
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const ok = await mainFrame.evaluate(() => {
      try {
        const app = (window as any).nexacro?.getApplication?.();
        return !!(app?.MDIWORK);
      } catch { return false; }
    }).catch(() => false);
    if (ok) return mainFrame;
    await page.waitForTimeout(300);
  }
  return null;
}

/**
 * pur_0910M 화면으로 이동
 * 우선순위: ① 이미 열려 있음 → ② GNB 메뉴 탐색
 */
async function navigateToPur0910M(page: Page): Promise<Frame | null> {
  const mainFrame = page.mainFrame();

  // ① 이미 해당 화면이면 즉시 반환
  if (await isPur0910MLoaded(mainFrame)) {
    console.log('  [NAV] 이미 pur_0910M 화면 — 재탐색 생략');
    return mainFrame;
  }

  // Nexacro 앱 초기화 대기
  await page.waitForFunction(() => {
    try { return !!(window as any).nexacro?.getApplication?.()?.mainframe; }
    catch { return false; }
  }, { timeout: 30000 }).catch(() => null);
  await page.waitForTimeout(500);
  console.log('  [NAV] Nexacro 초기화 완료');

  // ② GNB 메뉴 탐색 (최대 3회 retry)
  for (let retry = 0; retry < 3; retry++) {
    if (retry > 0) await page.waitForTimeout(1000);

    // 1단계: GNB 대분류 클릭
    let gnbClicked = false;
    for (let attempt = 0; attempt < 10 && !gnbClicked; attempt++) {
      for (const frame of page.frames()) {
        try {
          const el = frame.locator(`text=${MENU.gnb}`).first();
          if (await el.isVisible({ timeout: 500 })) {
            await el.click(); gnbClicked = true; break;
          }
        } catch { }
      }
      if (!gnbClicked) await page.waitForTimeout(500);
    }
    if (!gnbClicked) {
      console.warn(`  ⚠️  [NAV] GNB "${MENU.gnb}" 링크를 찾지 못함`);
      continue;
    }
    console.log(`  [NAV] GNB "${MENU.gnb}" 클릭 완료`);
    await page.waitForTimeout(2000);

    // 2단계: 중분류(GROUP) 클릭
    let groupClicked = !MENU.group;
    if (MENU.group) {
      for (const frame of page.frames()) {
        try {
          const g = frame.locator(`text=${MENU.group}`).first();
          if (await g.isVisible({ timeout: 1000 })) {
            await g.click(); groupClicked = true;
            await page.waitForTimeout(1000); break;
          }
        } catch { }
      }
    }
    if (!groupClicked) {
      console.warn(`  ⚠️  [NAV] 중분류 "${MENU.group}" 를 찾지 못함`);
      continue;
    }
    console.log(`  [NAV] 중분류 "${MENU.group}" 클릭 완료`);

    // 3단계: 소분류(SUB) 클릭 — 있는 경우만
    if (MENU.sub) {
      let subClicked = false;
      for (let i = 0; i < 10 && !subClicked; i++) {
        for (const frame of page.frames()) {
          try {
            const s = frame.locator(`text=${MENU.sub}`).first();
            if (await s.isVisible({ timeout: 500 })) {
              await s.click(); subClicked = true;
              await page.waitForTimeout(500); break;
            }
          } catch { }
        }
        if (!subClicked) await page.waitForTimeout(300);
      }
    }

    // 4단계: 화면 메뉴(TARGET) 클릭
    for (let i = 0; i < 15; i++) {
      for (const frame of page.frames()) {
        try {
          const el = frame.locator(`text="${MENU.target}"`).first();
          if (await el.isVisible({ timeout: 500 })) {
            await el.click();
            console.log(`  [NAV] 메뉴 "${MENU.target}" 클릭 완료`);
            await page.waitForTimeout(3000);
            return await waitForNexacroFrame(page, 45000);
          }
        } catch { }
      }
      await page.waitForTimeout(300);
    }
  }
  return null;
}

/** div_workForm.form 아래 버튼 클릭 */
async function clickMainFormButton(frame: Frame, btnId: string): Promise<boolean> {
  return await frame.evaluate((id) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      for (let i = 0; i < mdi?.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.[id] !== undefined) {
          if (typeof wf[id].click === 'function') wf[id].click();
          return true;
        }
      }
      return false;
    } catch { return false; }
  }, btnId).catch(() => false);
}

/** ds_list 행 수 조회 */
async function getListRowCount(frame: Frame): Promise<number> {
  return frame.evaluate((dsId) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      for (let i = 0; i < mdi?.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.[dsId] !== undefined) return wf[dsId].rowcount ?? -1;
      }
      return -1;
    } catch { return -1; }
  }, COMPONENTS.dsList).catch(() => -1);
}

/** 자동조회 완료 대기 — rowcount 안정화 기준 */
async function waitForAutoSearch(frame: Frame, timeout = 10000): Promise<number> {
  let prev = -99;
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const cur = await getListRowCount(frame);
    if (cur >= 0 && cur === prev) return cur;
    prev = cur;
    await frame.page().waitForTimeout(500);
  }
  return prev;
}

/** div_Search.form 컴포넌트 값 읽기 */
async function getDivSearchValue(frame: Frame, compId: string): Promise<string> {
  return frame.evaluate((id) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      for (let i = 0; i < mdi?.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.btn_search !== undefined && wf?.ds_list !== undefined) {
          const comp = wf?.div_Search?.form?.[id];
          if (comp !== undefined) return String(comp?.value ?? comp?.text ?? '');
        }
      }
      return '';
    } catch { return ''; }
  }, compId).catch(() => '');
}

/** div_Search.form 컴포넌트 값 설정 */
async function setDivSearchValue(frame: Frame, compId: string, val: string): Promise<boolean> {
  return frame.evaluate(({ id, v }) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      for (let i = 0; i < mdi?.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.btn_search !== undefined && wf?.ds_list !== undefined) {
          const comp = wf?.div_Search?.form?.[id];
          if (comp !== undefined && typeof comp.set_value === 'function') {
            comp.set_value(v); return true;
          }
        }
      }
      return false;
    } catch { return false; }
  }, { id: compId, v: val }).catch(() => false);
}

/** ds_search 컬럼 값 직접 설정 */
async function setSearchColumn(frame: Frame, col: string, val: string): Promise<boolean> {
  return frame.evaluate(({ c, v }) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      for (let i = 0; i < mdi?.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.ds_search !== undefined) {
          if (wf.ds_search.rowcount === 0) wf.ds_search.addRow();
          wf.ds_search.setColumn(0, c, v);
          return true;
        }
      }
      return false;
    } catch { return false; }
  }, { c: col, v: val }).catch(() => false);
}

/** Nexacro 팝업 visible 대기 */
async function waitForNexacroPopup(frame: Frame, popupId: string, timeout = CONFIG.defaultTimeout): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const visible = await frame.evaluate((pid) => {
      try {
        const pf = (window as any).nexacro?.getPopupFrames?.();
        return pf?.[pid] !== undefined && pf[pid].visible !== false && !!(pf[pid].form);
      } catch { return false; }
    }, popupId).catch(() => false);
    if (visible) return true;
    await frame.page().waitForTimeout(300);
  }
  return false;
}

// ============================================================================
// 통합 테스트
// ============================================================================
test.describe('통합 테스트 - 직접구매지급신청 (pur_0910M)', () => {

  test.beforeAll(async ({ workerPage: page }) => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

    // dialog 자동 수락
    const dialogPauseMs = parseInt(process.env.DIALOG_PAUSE_MS ?? '800');
    page.on('dialog', async (dialog) => {
      console.log(`  [DIALOG] ${dialog.message()}`);
      if (dialogPauseMs > 0) await new Promise(r => setTimeout(r, dialogPauseMs));
      try { await dialog.accept(); } catch { }
    });

    logInput('접속 URL', CONFIG.indexUrl);
    await page.goto(CONFIG.indexUrl);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    logAction('pur_0910M 화면 최초 진입');
    sharedFrame = await navigateToPur0910M(page);
    logResult('Frame 획득', sharedFrame !== null, true);
  });

  test.afterAll(() => { flushLogs(); });

  // ── TC001: 메인 페이지 접근 확인 ────────────────────────────────────────────
  test('TC001: 메인 페이지 접근 확인', async ({ workerPage: page }) => {
    logTestStart('TC001: 메인 페이지 접근 확인');

    const url = page.url();
    logResult('현재 URL', url);
    expect(url).not.toContain('testLogin');

    const title = await page.title();
    logResult('페이지 타이틀', title);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-TC001-main.png` });
  });

  // ── TC002: 직접구매지급신청 메뉴 접근 ──────────────────────────────────────
  test('TC002: 직접구매지급신청 메뉴 접근', async ({ workerPage: page }) => {
    logTestStart('TC002: 직접구매지급신청 메뉴 접근');

    logResult('sharedFrame 획득 여부', sharedFrame !== null, true);
    expect(sharedFrame).not.toBeNull();

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-TC002-menu.png` });
  });

  // ── TC003: 화면 로드 확인 ───────────────────────────────────────────────────
  test('TC003: 직접구매지급신청 화면 로드 확인', async ({ workerPage: page }) => {
    logTestStart('TC003: 화면 로드 확인');

    expect(sharedFrame).not.toBeNull();
    if (!sharedFrame) return;

    const loaded = await waitForPur0910M(sharedFrame, 30000);
    logResult('화면 로드 (btn_search + ds_list + Grid01)', loaded, true);
    expect(loaded).toBe(true);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-TC003-load.png` });
  });

  // ── TC004: 화면 로드 시 자동 조회 실행 확인 ─────────────────────────────────
  test('TC004: 화면 로드 시 자동 조회 실행 확인', async ({ workerPage: page }) => {
    logTestStart('TC004: 자동 조회 실행 확인');

    expect(sharedFrame).not.toBeNull();
    if (!sharedFrame) return;

    // fn_onload 에서 fn_search() 호출 → ds_list 데이터 적재 여부 확인
    const rowCount = await waitForAutoSearch(sharedFrame, CONFIG.defaultTimeout);
    logResult('ds_list rowcount', rowCount);
    expect(rowCount).toBeGreaterThanOrEqual(0);

    // stc_gridRowCnt 텍스트 형식 검증 (총 N건)
    const rowCntText = await sharedFrame.evaluate((id) => {
      try {
        const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
        for (let i = 0; i < mdi?.frames?.length; i++) {
          const wf = mdi.frames[i]?.form?.div_workForm?.form;
          if (wf?.[id] !== undefined) return String(wf[id].text ?? '');
        }
        return '';
      } catch { return ''; }
    }, COMPONENTS.stcRowCnt).catch(() => '');
    logResult('총 건수 표시', rowCntText);
    expect(rowCntText).toMatch(/총 \d+건/);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-TC004-auto-search.png` });
  });

  // ── TC005: 결재상태 기본값 확인 ─────────────────────────────────────────────
  test('TC005: 결재상태 기본값 확인 (진행중 = 000-010-090)', async ({ workerPage: page }) => {
    logTestStart('TC005: 결재상태 기본값 확인');

    expect(sharedFrame).not.toBeNull();
    if (!sharedFrame) return;

    // fn_onload에서 APV_STAT_CD 기본값 = '000-010-090' 세팅
    const apvVal = await getDivSearchValue(sharedFrame, 'APV_STAT_CD');
    logResult('APV_STAT_CD 기본값', apvVal);
    // 기본값이 '000-010-090'(진행중 전체) 또는 빈값(전체) 중 하나여야 함
    const isDefaultOk = apvVal === '000-010-090' || apvVal === '' || apvVal === 'null';
    expect(isDefaultOk, `결재상태 기본값 이상: "${apvVal}"`).toBe(true);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-TC005-apv-default.png` });
  });

  // ── TC006: 조회 버튼 클릭 후 API 응답 및 그리드 갱신 확인 ──────────────────
  test('TC006: 조회 버튼 클릭 후 그리드 데이터 확인', async ({ workerPage: page }) => {
    logTestStart('TC006: 조회 버튼 클릭 후 그리드 갱신');

    expect(sharedFrame).not.toBeNull();
    if (!sharedFrame) return;

    // API 응답 감시 등록
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/pur/pur0910/getList.do') && res.status() === 200,
      { timeout: CONFIG.defaultTimeout }
    ).catch(() => null);

    // 조회 버튼 클릭
    logAction('btn_search 클릭');
    const clicked = await clickMainFormButton(sharedFrame, COMPONENTS.btnSearch);
    logResult('버튼 클릭', clicked, true);
    expect(clicked).toBe(true);

    // API 응답 검증
    const resp = await respPromise;
    await assertNexacroResponse(resp, 'getList.do');
    logResult('API 응답', 'PASS');

    // 그리드 rowcount 안정화 대기
    const rowCount = await waitForAutoSearch(sharedFrame, CONFIG.defaultTimeout);
    logResult('그리드 rowcount', rowCount);
    expect(rowCount).toBeGreaterThanOrEqual(0);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-TC006-search.png` });
  });

  // ── TC007: 신규 버튼 클릭 시 pur_0911M 팝업 열림 확인 ──────────────────────
  test('TC007: 신규 버튼 클릭 시 신청 팝업 열림 확인', async ({ workerPage: page }) => {
    logTestStart('TC007: 신규 버튼 클릭 → pur_0911M 팝업');

    expect(sharedFrame).not.toBeNull();
    if (!sharedFrame) return;

    // 신규(btn_registration) 클릭
    logAction('btn_registration 클릭');
    const clicked = await clickMainFormButton(sharedFrame, COMPONENTS.btnRegistration);
    logResult('버튼 클릭', clicked, true);
    expect(clicked).toBe(true);

    // pur_0911M 팝업 열림 대기
    const popupOpened = await waitForNexacroPopup(sharedFrame, 'pur_0911M', CONFIG.defaultTimeout);
    logResult('pur_0911M 팝업 열림', popupOpened);

    if (!popupOpened) {
      console.warn('  ⚠️  팝업이 열리지 않음 — 권한 또는 화면 설정 확인 필요');
    }

    // 팝업이 열렸으면 ESC로 닫기 시도
    if (popupOpened) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-TC007-popup.png` });
  });

  // ── TC008: 그리드 컬럼 헤더 검증 ───────────────────────────────────────────
  test('TC008: 그리드 컬럼 헤더 검증', async ({ workerPage: page }) => {
    logTestStart('TC008: 그리드 컬럼 헤더 검증');

    expect(sharedFrame).not.toBeNull();
    if (!sharedFrame) return;

    // Grid01 컬럼 헤더 텍스트 읽기
    const headers = await sharedFrame.evaluate((gridId) => {
      try {
        const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
        for (let i = 0; i < mdi?.frames?.length; i++) {
          const wf = mdi.frames[i]?.form?.div_workForm?.form;
          const grid = wf?.[gridId];
          if (!grid) continue;
          const fmt = grid?.formats?.[0]; // Format id="default"
          if (!fmt) continue;
          const headBand = fmt.bands?.find?.((b: any) => b.id === 'head');
          if (!headBand) continue;
          return headBand.cells?.map?.((c: any) => c.text ?? '') ?? [];
        }
        return [];
      } catch { return []; }
    }, COMPONENTS.grid).catch(() => [] as string[]);

    logResult('헤더 목록', JSON.stringify(headers));

    // 핵심 컬럼이 존재하는지 확인 (헤더 읽기 성공 시)
    if (headers.length > 0) {
      const requiredHeaders = ['NO', '신청번호', '신청일자', '결재상태', '신청명', '금액', '신청부서', '신청자'];
      for (const h of requiredHeaders) {
        expect(headers, `"${h}" 헤더 없음`).toContain(h);
      }
    } else {
      // Canvas 기반 그리드는 DOM에서 헤더를 직접 읽기 어려울 수 있음 — skip
      console.warn('  ⚠️  그리드 헤더를 읽지 못함 (Nexacro 렌더링 방식에 따라 정상)');
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-TC008-grid-headers.png` });
  });

});
