// ==============================================================
// PUR — 직접구매지급신청 통합 테스트
// 메뉴 경로: 구매관리 > 구매요구 > 직접구매지급신청
// 생성일시: 2026-06-21  |  파일: 20260621_193005_inte.spec.ts
// 생성자: SYSTEM
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page, Frame } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logAction, logResult, logInfo, logTestStart, flushLogs,
} from '../utils/test-logger';
import { assertNexacroResponse } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL  ?? '';
const SYSTEM_ID      = process.env.APP_SYSTEM_ID ?? '';
const CONFIG = {
  baseUrl:        BASE_URL,
  indexUrl:       `${BASE_URL}/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_${SYSTEM_ID}`,
  defaultTimeout: 15000,
};
const SCREENSHOT_DIR = 'test-results/screenshots';

// TC 간 공유 상태 — beforeAll에서 1회 세션 로그인 + 메뉴 진입 후 재사용
let sharedFrame: Frame | null = null;

/** 모든 프레임을 병렬로 탐색해 텍스트를 찾아 클릭 */
async function clickTextInAnyFrame(page: Page, text: string): Promise<boolean> {
  const results = await Promise.all(
    page.frames().map(async (frame) => {
      try {
        const el = frame.locator(`text="${text}"`).first();
        if (await el.isVisible({ timeout: 100 })) {
          await el.click();
          return true;
        }
      } catch { }
      return false;
    })
  );
  return results.some(Boolean);
}

/** PUR0910M 화면 로드 확인 — 고유 컴포넌트 포함 체크 */
async function isPUR0910MLoaded(frame: Frame): Promise<boolean> {
  return await frame.evaluate(() => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      if (!mdi) return false;
      for (let i = 0; i < mdi.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (
          wf?.btn_search !== undefined &&
          wf?.ds_list    !== undefined // TODO: 화면 고유 컴포넌트 추가 (xfdl 확인 후 기재)
        ) return true;
      }
      return false;
    } catch { return false; }
  }).catch(() => false);
}

/** PUR0910M 화면 로드 polling 대기 */
async function waitForPUR0910M(frame: Frame, timeout = CONFIG.defaultTimeout): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await isPUR0910MLoaded(frame)) return true;
    await frame.page().waitForTimeout(300);
  }
  return false;
}

/** Nexacro 메인 프레임 반환 — MDIWORK 초기화만 확인 (화면 특정 조건 없음) */
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
 * PUR0910M 화면으로 이동 후 Frame 반환
 * 우선순위: ① 이미 열려 있음(즉시) → ② 직접 URL 이동(SCREEN_URL) → ③ GNB 메뉴 탐색
 */
async function navigateToPUR0910M(page: Page): Promise<Frame | null> {
  const SCREEN_URL  = ''; // TODO: SYS_PGM_MGT.URL 조회 안됨 — DB 연결 확인
  const TARGET_MENU = '직접구매지급신청';
  const SUB_MENU    = '';         // 소분류 없음
  const GROUP_MENU  = '구매요구'; // 중분류
  const GNB_MENU    = '구매관리';

  // ── ① 최적화: 이미 해당 화면이면 즉시 반환 ──────────────────────
  const mainFrame = page.mainFrame();
  if (await isPUR0910MLoaded(mainFrame)) return mainFrame;

  // ── Nexacro 앱 초기화 대기 ───────────────────────────────────────
  await page.waitForFunction(() => {
    try { return !!(window as any).nexacro?.getApplication?.()?.mainframe; }
    catch { return false; }
  }, { timeout: 30000 }).catch(() => null);
  await page.waitForTimeout(500);
  console.log('  [NAV] Nexacro 초기화 완료');

  // ── ② 직접 URL 이동 (SYS_PGM_MGT.URL 기반 — 메뉴 탐색보다 빠름) ──
  if (SCREEN_URL) {
    const opened = await mainFrame.evaluate((url) => {
      try {
        const w = window as any;
        // Nexacro 앱별 화면 이동 함수 순서대로 시도
        if (typeof w.gfn_openPage === 'function') { w.gfn_openPage(url); return 'gfn_openPage'; }
        if (typeof w.gfn_OpenUrl  === 'function') { w.gfn_OpenUrl(url);  return 'gfn_OpenUrl'; }
        if (typeof w.gfn_openUrl  === 'function') { w.gfn_openUrl(url);  return 'gfn_openUrl'; }
        if (typeof w.goMenu       === 'function') { w.goMenu(url);       return 'goMenu'; }
        return '';
      } catch { return ''; }
    }, SCREEN_URL).catch(() => '');

    if (opened) {
      console.log(`[navigatePUR0910M] 직접 URL 이동: ${opened}('${SCREEN_URL}')`);
      await page.waitForTimeout(3000);
      if (await isPUR0910MLoaded(mainFrame)) return mainFrame;
      const loaded = await waitForPUR0910M(mainFrame, 20000);
      if (loaded) return mainFrame;
      console.log('[navigatePUR0910M] 직접 이동 후 화면 로드 실패 — GNB 탐색으로 전환');
    }
  }

  // ── ③ GNB 메뉴 탐색 (fallback) ───────────────────────────────────
  for (let retry = 0; retry < 3; retry++) {
    if (retry > 0) await page.waitForTimeout(1000);

    // 1단계: GNB 클릭 (모든 프레임 병렬 탐색)
    let gnbClicked = false;
    for (let attempt = 0; attempt < 10 && !gnbClicked; attempt++) {
      gnbClicked = await clickTextInAnyFrame(page, GNB_MENU);
      if (!gnbClicked) await page.waitForTimeout(300);
    }
    if (!gnbClicked) {
      console.warn(`  ⚠️  [NAV] GNB "${GNB_MENU}" 링크를 찾지 못함`);
      continue;
    }
    console.log(`  [NAV] GNB "${GNB_MENU}" 클릭 완료`);
    await page.waitForTimeout(1000);

    // 2단계: 메뉴명 직접 탐색 (대분류 클릭 시 첫 번째 중분류가 자동 펼쳐지는 경우 대응)
    // 최대 1초만 시도 — 자동 펼침이 없으면 3단계로 넘어감
    for (let i = 0; i < 5; i++) {
      if (await clickTextInAnyFrame(page, TARGET_MENU)) {
        await page.waitForTimeout(3000);
        return await waitForNexacroFrame(page, 45000);
      }
      await page.waitForTimeout(200);
    }

    // 3단계: 중분류 클릭 후 메뉴명 탐색
    const middleClicked = await clickTextInAnyFrame(page, GROUP_MENU);
    if (!middleClicked) { console.warn(`  ⚠️  [NAV] 중분류 "${GROUP_MENU}" 를 찾지 못함`); continue; }
    await page.waitForTimeout(500);

    for (let i = 0; i < 15; i++) {
      if (await clickTextInAnyFrame(page, TARGET_MENU)) {
        await page.waitForTimeout(3000);
        return await waitForNexacroFrame(page, 45000);
      }
      await page.waitForTimeout(300);
    }
    console.warn(`  ⚠️  [NAV] "${TARGET_MENU}" 를 찾지 못함`);
  }
  return null;
}

/** div_workForm.form 아래 버튼 클릭 */
async function clickMainFormButton(frame: Frame, btnId: string): Promise<boolean> {
  return await frame.evaluate((id) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      if (!mdi) return false;
      for (let i = 0; i < mdi.frames?.length; i++) {
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

/** ds_search 컬럼 설정 — 반복 evaluate 블록을 named helper로 추출 */
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

/**
 * Nexacro 컴포넌트에 직접 값 설정 (Dataset.setColumn 대신 사용 시 onchanged 이벤트 발생)
 * inputSelector 매핑 정보 기반 — Edit/Calendar/MaskEdit: set_value()
 *                                Combo: set_value() (코드값 직접 설정)
 */
async function setComponentValue(frame: Frame, compId: string, val: string): Promise<boolean> {
  return frame.evaluate(({ id, v }) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      for (let i = 0; i < mdi?.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.[id] !== undefined) {
          if (typeof wf[id].set_value === 'function') wf[id].set_value(v);
          return true;
        }
      }
      return false;
    } catch { return false; }
  }, { id: compId, v: val }).catch(() => false);
}

/** Nexacro ComboBox 내부 코드값(value) 읽기 — 화면 텍스트(label)가 아닌 바인딩 값 반환 */
async function getComboValue(frame: Frame, compId: string): Promise<string> {
  return frame.evaluate((id) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      for (let i = 0; i < mdi?.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.[id] !== undefined) return String(wf[id].value ?? '');
      }
      return '';
    } catch { return ''; }
  }, compId).catch(() => '');
}

/** Nexacro ComboBox 전체 코드/라벨 목록 반환
 *  codecolumn/labelcolumn 속성을 우선 사용하고, 없으면 innerdataset 0·1번 컬럼 fallback */
async function getComboItems(
  frame: Frame, compId: string
): Promise<{ value: string; label: string }[]> {
  return frame.evaluate((id) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      for (let i = 0; i < mdi?.frames?.length; i++) {
        const wf  = mdi.frames[i]?.form?.div_workForm?.form;
        const cbo = wf?.[id];
        if (cbo === undefined) continue;
        const ds = cbo.innerdataset ?? (cbo as any)._innerdataset;
        if (!ds) return [];
        const codeCol  = cbo.codecolumn  ?? ds.getColumnID(0);
        const labelCol = cbo.labelcolumn ?? ds.getColumnID(1) ?? codeCol;
        const items: { value: string; label: string }[] = [];
        for (let r = 0; r < ds.rowcount; r++) {
          items.push({
            value: String(ds.getColumn(r, codeCol)  ?? ''),
            label: String(ds.getColumn(r, labelCol) ?? '')
          });
        }
        return items;
      }
      return [];
    } catch { return []; }
  }, compId).catch(() => []);
}

/** ds_list 행 수 조회 */
async function getListRowCount(frame: Frame): Promise<number> {
  return frame.evaluate(() => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      for (let i = 0; i < mdi?.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.ds_list !== undefined) return wf.ds_list.rowcount ?? -1;
      }
      return -1;
    } catch { return -1; }
  }).catch(() => -1);
}

/** fn_doInit→fn_search 자동조회 완료 대기 — rowcount 안정화 기준 */
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

/** Nexacro 팝업 visible 대기 — pf[pid].form 존재 여부로 확인 */
async function waitForNexacroPopup(frame: Frame, popupId: string, timeout = CONFIG.defaultTimeout): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const visible = await frame.evaluate((pid) => {
      try {
        const pf = (window as any).nexacro?.getPopupFrames?.();
        // visible !== false 조건: Nexacro 팝업이 열려 있고 form이 초기화된 상태
        return pf?.[pid] !== undefined && pf[pid].visible !== false && !!(pf[pid].form);
      } catch { return false; }
    }, popupId).catch(() => false);
    if (visible) return true;
    await frame.page().waitForTimeout(300);
  }
  return false;
}

/**
 * div_workForm.form.div_Search.form 아래 버튼 클릭 (돋보기/조회 버튼 등)
 * 예) clickDivSearchButton(frame, 'btn_cmpy')  — 거래처 조회 팝업 호출
 */
async function clickDivSearchButton(frame: Frame, btnId: string): Promise<boolean> {
  return await frame.evaluate((id) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      for (let i = 0; i < mdi?.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.btn_search !== undefined && wf?.ds_list !== undefined) {
          const btn = wf?.div_Search?.form?.[id];
          if (typeof btn?.click === 'function') { btn.click(); return true; }
        }
      }
      return false;
    } catch { return false; }
  }, btnId).catch(() => false);
}

/**
 * div_Search.form 컴포넌트 값 읽기 — 검색조건 초기값 확인 등에 사용
 * value 우선, 없으면 text 반환 (Combo/Edit/Calendar 공용)
 */
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

/**
 * 팝업 내 특정 컴포넌트 준비 대기 (typeof btn.click === 'function')
 * waitForNexacroPopup 직후 호출 — form 컴포넌트 초기화 지연(비동기 렌더링) 대응
 *
 * 예) await waitForPopupComponent(frame, page, 'fac_0999P', 'btn_ok');
 */
async function waitForPopupComponent(
  frame: Frame, page: Page, popupId: string, componentId: string, maxRetry = 20
): Promise<boolean> {
  for (let i = 0; i < maxRetry; i++) {
    const ready = await frame.evaluate(
      ({ pId, cId }) => {
        try {
          const pf = (window as any).nexacro?.getPopupFrames?.();
          return typeof pf?.[pId]?.form?.[cId]?.click === 'function';
        } catch { return false; }
      },
      { pId: popupId, cId: componentId }
    ).catch(() => false);
    if (ready) return true;
    await page.waitForTimeout(300);
  }
  return false;
}

// ============================================================================
// [PUR_0910M] 통합 테스트 - 미사용
// ============================================================================
test.describe('통합 테스트 - 미사용 (PUR_0910M)', () => {

  // TC마다 메뉴 진입 확인 — dialog/URL 복구는 workerPage 픽스처(test-scoped)가 처리
  test.beforeEach(async ({ workerPage: page }) => {
    sharedFrame = await navigateToPUR0910M(page);
    logResult('PUR0910M Frame 획득', sharedFrame !== null, true);
  });

  test.afterAll(() => { flushLogs(); });

  // ────────────────────────────────────────────────────────────────────────────
  // TC001: 메인 페이지 접근 확인 (beforeAll 로그인 결과 검증)
  // ────────────────────────────────────────────────────────────────────────────
  test('TC001: 메인 페이지 접근 확인', async ({ workerPage: page }) => {
    logTestStart('TC001: 메인 페이지 접근 확인');

    logAction('페이지 타이틀 확인');
    const title = await page.title();
    logResult('페이지 타이틀', title);

    // 로그인 세션이 유효한지 확인 (testLogin 으로 튕기지 않아야 함)
    const url = page.url();
    logResult('현재 URL', url);
    expect(url).not.toContain('testLogin');

    await page.screenshot({ path: 'test-results/pur0910m-TC001-main-page.png' });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // TC002: 미사용 메뉴 접근 (beforeAll 최초 진입 결과 검증)
  // ────────────────────────────────────────────────────────────────────────────
  test('TC002: 미사용 메뉴 접근', async ({ workerPage: page }) => {
    logTestStart('TC002: 미사용 메뉴 접근');

    // beforeAll에서 navigateToPUR0910M() 결과를 검증
    logResult('sharedFrame 획득 여부', sharedFrame !== null, true);
    expect(sharedFrame).not.toBeNull();

    await page.screenshot({ path: 'test-results/pur0910m-TC002-menu.png' });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // TC003: 미사용 화면 로드 확인
  //   sharedFrame 에서 핵심 컴포넌트 존재 여부로 로드 상태 재확인
  // ────────────────────────────────────────────────────────────────────────────
  test('TC003: 미사용 화면 로드 확인', async ({ workerPage: page }) => {
    logTestStart('TC003: 미사용 화면 로드 확인');

    expect(sharedFrame).not.toBeNull();
    if (!sharedFrame) return;

    const loaded = await waitForPUR0910M(sharedFrame, 30000);
    logResult('화면 로드 (isPUR0910MLoaded)', loaded, true);
    expect(loaded).toBe(true);

    await page.screenshot({ path: 'test-results/pur0910m-TC003-form-load.png' });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // TC004: 화면 로드 시 자동 조회 실행 확인 (fn_doInit → fn_search)
  //   beforeAll 진입 시 이미 자동조회 완료 → rowcount·stc_gridRowCnt 검증
  // ────────────────────────────────────────────────────────────────────────────
  test('TC004: 화면 로드 시 자동 조회 실행 확인', async ({ workerPage: page }) => {
    logTestStart('TC004: 화면 로드 시 자동 조회 실행 확인');

    expect(sharedFrame).not.toBeNull();
    if (!sharedFrame) return;

    // 자동 조회 완료 대기 (이미 완료됐으면 즉시 반환)
    const rowCount = await waitForAutoSearch(sharedFrame, CONFIG.defaultTimeout);
    logResult('ds_list rowcount', rowCount);
    console.log(`  조회 결과: ${rowCount}건`);
    expect(rowCount).toBeGreaterThanOrEqual(0);

    // stc_gridRowCnt '총 N건' 텍스트 확인
    const rowCntText = await sharedFrame.evaluate(() => {
      try {
        const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
        for (let i = 0; i < mdi?.frames?.length; i++) {
          const wf = mdi.frames[i]?.form?.div_workForm?.form;
          if (wf?.stc_gridRowCnt !== undefined)
            return String(wf.stc_gridRowCnt.text ?? '');
        }
        return '';
      } catch { return ''; }
    }).catch(() => '');
    logResult('총 건수 표시', rowCntText);
    expect(rowCntText).toMatch(/총 \d+건/);

    await page.screenshot({ path: 'test-results/pur0910m-TC004-auto-search.png' });
  });

});
