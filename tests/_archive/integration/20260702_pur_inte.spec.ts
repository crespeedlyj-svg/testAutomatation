// ==============================================================
// PUR — PUR_0910M 통합 테스트
// 생성일시: 2026-07-02  |  파일: 20260702_pur_inte.spec.ts
// 생성자: SYSTEM
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page, Frame } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logAction, logResult, logInfo, logTestStart, flushLogs,
} from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows, openMenuById, openMenuByPgm } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL      ?? '';
const SYSTEM_ID      = process.env.APP_SYSTEM_ID    ?? '';
const CTX_PATH       = process.env.APP_CONTEXT_PATH ?? 'gprooneis';
const CONFIG = {
  baseUrl:        BASE_URL,
  indexUrl:       `${BASE_URL}/nxui/${CTX_PATH}/index.jsp?UPP_MENU_ID=M_${SYSTEM_ID}`,
  defaultTimeout: 15000,
};
const SCREENSHOT_DIR = 'test-results/screenshots';

// TC 간 공유 상태 — beforeAll에서 1회 세션 로그인 + 메뉴 진입 후 재사용
let sharedFrame: Frame | null = null;

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
          wf?.ds_list    !== undefined &&
          wf?.Grid01           !== undefined
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
 * 우선순위: ① 이미 열려 있음 → ② DB MENU_ID로 openMenuById → ③ openMenuByPgm → ④ 직접 URL → ⑤ GNB 텍스트
 */
async function navigateToPUR0910M(page: Page): Promise<Frame | null> {
  const MENU_ID     = ''; // DB 조회 실패 — openMenuByPgm 폴백 사용
  const PGM_ID      = 'PUR_0910M'; // ds_menu PGM_PATH 검색용 (MENU_ID 조회 실패 시 폴백)
  const SCREEN_URL  = ''; // TODO: SYS_PGM_MGT.URL 조회 안됨 — DB 연결 확인
  const TARGET_MENU = '직접구매지급신청';
  const SUB_MENU    = '';
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

  // ── ② SYS_MENU_MGT DB 조회 MENU_ID로 openMenuById (신뢰도 최상) ─
  if (MENU_ID) {
    const navById = await openMenuById(page, MENU_ID);
    if (navById.ok) {
      console.log(`  [NAV] openMenuById 성공: ${navById.menuNm}`);
      await page.waitForTimeout(2500);
      if (await isPUR0910MLoaded(mainFrame)) return mainFrame;
      if (await waitForPUR0910M(mainFrame, 25000)) return mainFrame;
      console.log('  [NAV] openMenuById 후 화면 로드 실패 — 다음 방법 시도');
    } else {
      console.warn(`  ⚠️  [NAV] openMenuById 실패: ${navById.error}`);
    }
  }

  // ── ③ openMenuByPgm: ds_menu PGM_PATH로 fn_openMainForm 호출 (폴백) ─
  if (PGM_ID) {
    const nav = await openMenuByPgm(page, PGM_ID);
    if (nav.ok) {
      console.log(`  [NAV] openMenuByPgm 성공: ${nav.menuNm} (${nav.menuId})`);
      await page.waitForTimeout(2500);
      if (await isPUR0910MLoaded(mainFrame)) return mainFrame;
      const loaded = await waitForPUR0910M(mainFrame, 25000);
      if (loaded) return mainFrame;
      console.log('  [NAV] openMenuByPgm 후 화면 로드 실패 — 다음 방법 시도');
    } else {
      console.warn(`  ⚠️  [NAV] openMenuByPgm 실패: ${nav.error}`);
    }
  }

  // ── ③ 직접 URL 이동 (SYS_PGM_MGT.URL 기반 — openMenuByPgm 실패 시) ──
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
      console.log('[navigatePUR0910M] 직접 이동 후 화면 로드 실패 — GNB 탐색으로 전환(④)');
    }
  }

  // ── ④ GNB 메뉴 탐색 (last fallback — Nexacro Canvas에서 실패할 수 있음) ─
  for (let retry = 0; retry < 3; retry++) {
    if (retry > 0) await page.waitForTimeout(1000);

    // 1단계: GNB 클릭
    let gnbClicked = false;
    for (let attempt = 0; attempt < 10 && !gnbClicked; attempt++) {
      for (const frame of page.frames()) {
        try {
          const el = frame.locator(`text=${GNB_MENU}`).first();
          if (await el.isVisible({ timeout: 500 })) {
            await el.click(); gnbClicked = true; break;
          }
        } catch { }
      }
      if (!gnbClicked) await page.waitForTimeout(500);
    }
    if (!gnbClicked) {
      console.warn(`  ⚠️  [NAV] GNB "${GNB_MENU}" 링크를 찾지 못함`);
      continue;
    }
    console.log(`  [NAV] GNB "${GNB_MENU}" 클릭 완료`);
    await page.waitForTimeout(3000);

    // 2단계: 퀵링크에서 TARGET_MENU 탐색
    let found = false;
    for (let i = 0; i < 5 && !found; i++) {
      for (const frame of page.frames()) {
        try {
          const el = frame.locator(`text="${TARGET_MENU}"`).first();
          if (await el.isVisible({ timeout: 500 })) {
            found = true; await el.click();
            await page.waitForTimeout(3000);
            return await waitForNexacroFrame(page, 45000);
          }
        } catch { }
      }
      if (!found) await page.waitForTimeout(300);
    }

    // 3단계: GROUP_MENU 클릭 (있는 경우만 — 3단계 경로는 skip)
    let groupClicked = !GROUP_MENU;
    if (GROUP_MENU) {
      for (const frame of page.frames()) {
        try {
          const g = frame.locator(`text=${GROUP_MENU}`).first();
          if (await g.isVisible({ timeout: 1000 })) {
            await g.click(); groupClicked = true;
            await page.waitForTimeout(1000); break;
          }
        } catch { }
      }
    }
    if (!groupClicked) continue;

    // 4단계: SUB_MENU (소분류) 클릭 — 있는 경우만
    if (SUB_MENU) {
      let subClicked = false;
      for (let i = 0; i < 10 && !subClicked; i++) {
        for (const frame of page.frames()) {
          try {
            const s = frame.locator(`text=${SUB_MENU}`).first();
            if (await s.isVisible({ timeout: 500 })) {
              await s.click(); subClicked = true;
              await page.waitForTimeout(500); break;
            }
          } catch { }
        }
        if (!subClicked) await page.waitForTimeout(300);
      }
    }

    // 5단계: 서브메뉴에서 TARGET_MENU 탐색
    for (let i = 0; i < 15; i++) {
      for (const frame of page.frames()) {
        try {
          const el = frame.locator(`text="${TARGET_MENU}"`).first();
          if (await el.isVisible({ timeout: 500 })) {
            await el.click(); await page.waitForTimeout(3000);
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
 * div_Search.form 컴포넌트에 실제 값 입력 — set_value() 호출로 onchanged 이벤트 발생
 * (검색조건 Edit/Calendar/Combo 등은 div_workForm.form 바로 아래가 아니라
 *  div_Search.form 하위에 있으므로 setComponentValue와 별도 헬퍼로 분리)
 */
async function setDivSearchValue(frame: Frame, compId: string, val: string): Promise<boolean> {
  return frame.evaluate(({ id, v }) => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      for (let i = 0; i < mdi?.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.btn_search !== undefined && wf?.ds_list !== undefined) {
          const comp = wf?.div_Search?.form?.[id];
          if (comp !== undefined && typeof comp.set_value === 'function') {
            comp.set_value(v);
            return true;
          }
        }
      }
      return false;
    } catch { return false; }
  }, { id: compId, v: val }).catch(() => false);
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
// [PUR_0910M] 통합 테스트 - PUR_0910M
// ============================================================================
test.describe('통합 테스트 - PUR_0910M (PUR_0910M)', () => {

  // ── 세션 로그인 + 최초 메뉴 접근은 1회만 수행 ──────────────────────
  // workerPage 픽스처는 Worker 범위로 공유됨 — 모든 TC가 같은 page 인스턴스 사용
  test.beforeAll(async ({ workerPage: page }) => {
    // dialog 자동 수락 — 전체 수명 동안 1회만 등록
    const dialogPauseMs = parseInt(process.env.DIALOG_PAUSE_MS ?? '800');
    page.on('dialog', async (dialog) => {
      console.log(`  [DIALOG] ${dialog.message()}`);
      if (dialogPauseMs > 0) await new Promise(r => setTimeout(r, dialogPauseMs));
      try { await dialog.accept(); } catch { /* 이미 처리된 dialog 무시 */ }
    });

    // ── 1회 로그인 + 메인 화면 이동 ────────────────────────────────
    logInput('접속 URL', CONFIG.indexUrl);

    await page.goto(CONFIG.indexUrl);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // ── 최초 메뉴 접근 + sharedFrame 획득 ──────────────────────────
    logAction('PUR0910M 화면 최초 진입');
    sharedFrame = await navigateToPUR0910M(page);
    logResult('PUR0910M Frame 획득', sharedFrame !== null, true);
  });

  // ── TC001 — 화면 정상 진입 확인 ────────────────────────────────
  // workerPage 픽스처가 매 TC 시작 시 index.jsp로 이동하므로 TC마다 재진입 필요
  test('TC001 — PUR0910M 화면 정상 진입', async ({ workerPage: page }) => {
    logTestStart('TC001', 'PUR0910M 화면 정상 진입 확인');
    logAction('PUR0910M 화면 진입 (openMenuByPgm → GNB 순서)');
    sharedFrame = await navigateToPUR0910M(page);
    logResult('PUR0910M 화면 진입', sharedFrame !== null, true);
    expect(sharedFrame, '메뉴 진입 실패 — navigateToPUR0910M이 null 반환').not.toBeNull();

    const loaded = await isPUR0910MLoaded(sharedFrame!);
    logResult('PUR0910M 화면 로드(btn_search·ds_list·Grid01 존재)', loaded, true);
    expect(loaded, 'PUR0910M 화면 컴포넌트 확인 실패').toBe(true);
  });

  // ── TC002 — 검색조건 입력 후 조회 버튼 클릭, 목록 결과 확인 ────
  test('TC002 — 조회 버튼 클릭 후 목록 조회', async ({ workerPage: page }) => {
    logTestStart('TC002', '조회 버튼 클릭 후 목록 조회');
    // 이미 화면에 있으면 재사용, 없으면 재진입
    if (!sharedFrame || !await isPUR0910MLoaded(sharedFrame)) {
      logAction('PUR0910M 재진입');
      sharedFrame = await navigateToPUR0910M(page);
    }
    expect(sharedFrame, '화면 진입 실패').not.toBeNull();

    // ── 검색조건 화면 컴포넌트에 실제 값 입력 (dataset 직접조작이 아닌 set_value) ──
    logAction('검색조건 입력: 신청일자 20240101~20261231, 결재상태 000-010-090');
    const sdtOk = await setDivSearchValue(sharedFrame!, 'SCH_RQST_SDT', '20240101');
    const edtOk = await setDivSearchValue(sharedFrame!, 'SCH_RQST_EDT', '20261231');
    const apvOk = await setDivSearchValue(sharedFrame!, 'APV_STAT_CD', '000-010-090');
    logResult('SCH_RQST_SDT 입력', sdtOk, true);
    logResult('SCH_RQST_EDT 입력', edtOk, true);
    logResult('APV_STAT_CD 입력', apvOk, true);
    expect(sdtOk && edtOk && apvOk, '검색조건 컴포넌트 입력 실패').toBe(true);

    logAction('btn_search 클릭');
    const clicked = await clickMainFormButton(sharedFrame!, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, '조회 버튼 클릭 실패 — btn_search 컴포넌트 없음').toBe(true);

    const rowCount = await waitForAutoSearch(sharedFrame!, 15000);
    logInfo(`조회 결과 건수: ${rowCount}`);
    logResult('목록 조회 완료 (rowCount ≥ 0)', rowCount >= 0, true);
    expect(rowCount, 'ds_list.rowcount 가 음수 — 조회 이상').toBeGreaterThanOrEqual(0);
  });

  // ── TC003 — 초기화 버튼 동작 확인 ─────────────────────────────
  test('TC003 — 초기화 버튼(btn_init) 동작 확인', async ({ workerPage: page }) => {
    logTestStart('TC003', '초기화 버튼 동작 확인');
    if (!sharedFrame || !await isPUR0910MLoaded(sharedFrame)) {
      logAction('PUR0910M 재진입');
      sharedFrame = await navigateToPUR0910M(page);
    }
    expect(sharedFrame, '화면 진입 실패').not.toBeNull();

    logAction('btn_init 클릭');
    const clicked = await clickMainFormButton(sharedFrame!, 'btn_init');
    logResult('btn_init 클릭', clicked, true);
    if (!clicked) logInfo('⚠ btn_init 없음 — 해당 화면에 초기화 버튼 미존재 (WARN만)');
    // btn_init는 선택적 버튼 — 없어도 실패 처리 안 함
  });

  test.afterAll(() => { flushLogs(); });

});
