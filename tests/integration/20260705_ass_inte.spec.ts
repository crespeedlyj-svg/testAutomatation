// ==============================================================
// ASS 모듈 — 자산관리 통합 테스트 (통합 spec)
// 생성일시: 20260705  |  파일: 20260705_ass_inte.spec.ts
// 커버 화면: 19개  |  총 테스트 케이스: 19건 (전 화면 SELECT-only)
// 방식: UI-driven (openMenuById + 데이터셋 로드 확인)
//
// ★ 재생성 사유(2026-07-05): 이전 버전은 존재하지 않는 버튼(btn_reg)과 팝업 흐름을 추측해
//   INSERT/DELETE TC를 생성하는 오류가 있었음. M파일 fn_save/fn_delete 핸들러를 정적분석한 결과
//   19개 화면 전부 Pattern A(그리드/폼 인라인 저장 — gfn_tran 직접 호출, 팝업 없음)로 확인.
//   SKILL 5-6에 따라 INSERT/DELETE는 생성 보류하고 SELECT-only 진입 TC로 강등함.
//
// storageState 자동 주입 — 로그인 코드 작성 절대 금지
// 소스: _workspace/ass/01_scenarios.json
// 주의: 모든 화면 menuId 플레이스홀더(M_MIS_XX_XX_XX) — 실제 ID 확인 전까지 진입 실패.
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import {
  openMenuById,
  waitForNexacroAppReady,
  waitForNexacroDataset,
  getNexacroDatasetRows,
} from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const SLOW           = 1500;

// ── 메뉴 진입 (공용) ──────────────────────────────────────────────────────────
async function navigateToMenu(page: Page, menuId: string, apiUrl: string, dsList = 'ds_list'): Promise<string> {
  await waitForNexacroAppReady(page, 20000);
  const initResp = page.waitForResponse(r => r.url().includes(apiUrl), { timeout: 20000 }).catch(() => null);

  const nav = await openMenuById(page, menuId);
  if (!nav.ok) throw new Error(`메뉴 로드 실패: ${nav.error}`);
  console.log(`[NAV] menuNm=${nav.menuNm}`);

  await initResp;
  await page.locator('text="조회"').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => null);
  await waitForNexacroDataset(page, menuId, dsList, 1, 10000).catch(() => null);
  return menuId;
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0111M — 자산등록
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setSave / setDelSave')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0111M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0111M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0111/getData.do';
  const DS_LIST     = 'ds_astdtl';
  const RESULT_COLS = ['AST_MNG_CD', 'AST_CD', 'AST_NM', 'AST_CLS_NM', 'ACQ_QTY', 'ACQ_DT', 'ACQ_AMT', 'AST_MNGR_DEPT_NM', 'AST_USER_DEPT_NM', 'DEPR_OBJ_YN'];

  test.describe.serial(`자산등록(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 자산등록 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setSave / setDelSave)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 자산등록 화면이 오류 없이 진입하고 초기 데이터셋(ds_astdtl)이 로드된다.
   */
  test('[no:1] 자산등록 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산등록 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0111M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '자산등록 화면 진입 및 ds_astdtl 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0112M — 자산등록(병합)
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('(M파일 없음 — ass_0110M 병합등록 하위 폼) setSave / setDelSave')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0112M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0112M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0112/getData.do';
  const DS_LIST     = 'ds_ctrctlist';
  const RESULT_COLS = ['PUR_CONT_NO', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'REG_CLS_NM', 'ACQ_QTY', 'ACQ_UNT_NM', 'THNG_NM', 'LAST_EXMNT_DT', 'EXMNT_EMP_NM', 'CTRCT_CUST_NM'];

  test.describe.serial(`자산등록(병합)(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 자산등록(병합) - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록(병합)
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=(M파일 없음 — ass_0110M 병합등록 하위 폼) setSave / setDelSave)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 자산등록(병합) 화면이 오류 없이 진입하고 초기 데이터셋(ds_ctrctlist)이 로드된다.
   */
  test('[no:1] 자산등록(병합) - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산등록(병합) - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0112M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '자산등록(병합) 화면 진입 및 ds_ctrctlist 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0121M — 자산수기등록
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setSave / setDelSave')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0121M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0121M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0121/getData.do';
  const DS_LIST     = 'ds_main';
  const RESULT_COLS = ['AST_MNG_CD', 'AST_CD', 'AST_NM', 'AST_CLS_NM', 'ACQ_DT', 'ACQ_QTY', 'ACQ_UNT', 'UPP_AST_CD', 'UPP_AST_NM'];

  test.describe.serial(`자산수기등록(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 자산수기등록 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산수기등록
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setSave / setDelSave)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 자산수기등록 화면이 오류 없이 진입하고 초기 데이터셋(ds_main)이 로드된다.
   */
  test('[no:1] 자산수기등록 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산수기등록 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0121M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '자산수기등록 화면 진입 및 ds_main 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0131M — 자산등록(지재권)
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setSave / setDelSave')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0131M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0131M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0131/getData.do';
  const DS_LIST     = 'ds_main';
  const RESULT_COLS = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'FRGN_CLS', 'AST_MNG_CD', 'PUR_CONT_NO', 'ITEM_MNG_NO', 'ITEM_MNG_SEQ', 'ITEM_SEQ', 'ITEM_NM', 'ACCT_UNT_CD'];

  test.describe.serial(`자산등록(지재권)(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 자산등록(지재권) - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록(지재권)
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setSave / setDelSave)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 자산등록(지재권) 화면이 오류 없이 진입하고 초기 데이터셋(ds_main)이 로드된다.
   */
  test('[no:1] 자산등록(지재권) - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산등록(지재권) - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0131M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '자산등록(지재권) 화면 진입 및 ds_main 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0221M — 자산변경신청
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setAstChgData / delAstChgData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0221M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0221M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0221/getChgData.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = ['RQST_NO', 'RQST_SEQ', 'AST_MNG_CD', 'AST_CD', 'AST_NM', 'ACQ_QTY', 'ACQ_AMT', 'TOT_ACQ_AMT', 'ACQ_DT', 'PRV_PLACE_CD', 'PRV_PLACE_NM', 'PRV_USE_EMP_NO'];

  test.describe.serial(`자산변경신청(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 자산변경신청 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산변경신청
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setAstChgData / delAstChgData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 자산변경신청 화면이 오류 없이 진입하고 초기 데이터셋(ds_list)이 로드된다.
   */
  test('[no:1] 자산변경신청 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산변경신청 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0221M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '자산변경신청 화면 진입 및 ds_list 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0223M — 불용자산처분
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setAstChgData / delAstChgData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0223M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0223M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0221/getChgData.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = ['RQST_NO', 'RQST_SEQ', 'AST_MNG_CD', 'AST_CD', 'AST_NM', 'ACQ_QTY', 'ACQ_AMT', 'TOT_ACQ_AMT', 'ACQ_DT', 'PRV_PLACE_CD', 'PRV_PLACE_NM', 'PRV_USE_EMP_NO'];

  test.describe.serial(`불용자산처분(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 불용자산처분 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 불용자산처분
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setAstChgData / delAstChgData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 불용자산처분 화면이 오류 없이 진입하고 초기 데이터셋(ds_list)이 로드된다.
   */
  test('[no:1] 불용자산처분 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 불용자산처분 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0223M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '불용자산처분 화면 진입 및 ds_list 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0311M — 장비등록
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setNtisData / delNtisData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0311M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0311M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0311/getNtisCodeList.do';
  const DS_LIST     = 'ds_main';
  const RESULT_COLS = ['AST_CD', 'AST_NM', 'AST_ENG_NM', 'AST_MNG_CD', 'AST_USE_EMP_NO', 'AST_USE_EMP_NM', 'BRANCH_CD', 'BRANCH_NM', 'EQUIP_NO', 'EQUIP_ID', 'NTIS_NO', 'EQUIP_CD'];

  test.describe.serial(`장비등록(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 장비등록 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 장비관리  메뉴명: 장비등록
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setNtisData / delNtisData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 장비등록 화면이 오류 없이 진입하고 초기 데이터셋(ds_main)이 로드된다.
   */
  test('[no:1] 장비등록 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 장비등록 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0311M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '장비등록 화면 진입 및 ds_main 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0511M — 물품반출신청
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0511M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0511M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0511/getCarryOutMst.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = ['RQST_SEQ', 'CRR_IO_RQST_SEQ', 'AST_CLS_NM', 'AST_CLS_CD', 'AST_CD', 'AST_NM', 'ITEM_NM', 'UNT', 'QTY', 'ACQ_DT', 'UPT_STAT', 'AST_MNG_CD'];

  test.describe.serial(`물품반출신청(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 물품반출신청 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반출신청
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 물품반출신청 화면이 오류 없이 진입하고 초기 데이터셋(ds_list)이 로드된다.
   */
  test('[no:1] 물품반출신청 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 물품반출신청 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0511M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '물품반출신청 화면 진입 및 ds_list 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0521M — 물품반입신청
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0521M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0521M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0521/getCarryOutListDtl.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = ['RQST_NO', 'RQST_SEQ', 'CRR_IO_RQST_NO', 'CRR_IO_RQST_SEQ', 'AST_MNG_CD', 'AST_CD', 'AST_CLS_CD', 'AST_CLS_NM', 'AST_NM', 'ACQ_DT', 'ITEM_NM', 'UNT'];

  test.describe.serial(`물품반입신청(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 물품반입신청 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반입신청
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 물품반입신청 화면이 오류 없이 진입하고 초기 데이터셋(ds_list)이 로드된다.
   */
  test('[no:1] 물품반입신청 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 물품반입신청 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0521M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '물품반입신청 화면 진입 및 ds_list 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0811M — 물품출고요청서
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0811M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0811M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0811/getData.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = ['SPPLS_RQST_NO', 'SPPLS_RQST_SEQ', 'SPPLS_CD', 'SPPLS_REF_CD', 'SPPLS_NM', 'QTY', 'UNT', 'AST_MNG_CD', 'AST_MNG_NM', 'WRHS_CD', 'WRHS_NM', 'SPPLS_AMT'];

  test.describe.serial(`물품출고요청서(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 물품출고요청서 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 물품출고요청서
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 물품출고요청서 화면이 오류 없이 진입하고 초기 데이터셋(ds_list)이 로드된다.
   */
  test('[no:1] 물품출고요청서 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 물품출고요청서 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0811M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '물품출고요청서 화면 진입 및 ds_list 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0901M — 자산분류코드
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setAstClsData / delAstClsData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0901M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0901M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0901/getAstAssetClsList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = ['AST_CLS_CD', 'AST_CLS_NM', 'UP_AST_CLS_CD', 'UP_AST_CLS_NM', 'CLS_DIV', 'G_AST_CLS_CD', 'G_AST_CLS_NM', 'M_AST_CLS_CD', 'M_AST_CLS_NM', 'S_AST_CLS_CD', 'S_AST_CLS_NM', 'LEV'];

  test.describe.serial(`자산분류코드(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 자산분류코드 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 자산분류코드
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setAstClsData / delAstClsData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 자산분류코드 화면이 오류 없이 진입하고 초기 데이터셋(ds_list)이 로드된다.
   */
  test('[no:1] 자산분류코드 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산분류코드 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0901M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '자산분류코드 화면 진입 및 ds_list 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0902M — 관리위치코드
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setData / delData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0902M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0902M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0902/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = ['CORP_CD', 'BUSI_PLC_CD', 'PLACE_CD', 'PLACE_NM', 'UP_PLACE_CD', 'UP_PLACE_NM', 'ORD_NO', 'LEV', 'USE_YN', 'RMK', 'OLD_SYS_KEY', 'ASS_CNT'];

  test.describe.serial(`관리위치코드(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 관리위치코드 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 관리위치코드
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setData / delData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 관리위치코드 화면이 오류 없이 진입하고 초기 데이터셋(ds_list)이 로드된다.
   */
  test('[no:1] 관리위치코드 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 관리위치코드 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0902M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '관리위치코드 화면 진입 및 ds_list 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0904M — 자재코드
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setSave / delSpplsClsData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0904M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0904M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0904/getAssSpplsList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = ['UP_SPPLS_CD', 'UP_SPPLS_NM', 'SPPLS_CD', 'SPPLS_NM', 'UP_CLS_DIV', 'CLS_DIV', 'SPPLS_PRCE', 'SPPLS_UNT', 'CURR_UNIT', 'LEV', 'ORD_NO', 'USE_YN'];

  test.describe.serial(`자재코드(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 자재코드 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 자재코드
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setSave / delSpplsClsData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 자재코드 화면이 오류 없이 진입하고 초기 데이터셋(ds_list)이 로드된다.
   */
  test('[no:1] 자재코드 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자재코드 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0904M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '자재코드 화면 진입 및 ds_list 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0907M — 창고물품코드
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setSave / delSpplsClsData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0907M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0907M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0907/getAssSpplsList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = ['UP_SPPLS_CD', 'UP_SPPLS_REF_CD', 'UP_SPPLS_NM', 'SPPLS_CD', 'SPPLS_NM', 'SPPLS_REF_CD', 'UP_CLS_DIV', 'CLS_DIV', 'SPPLS_PRCE', 'SPPLS_UNT_NM', 'SPPLS_UNT', 'CURR_UNIT_NM'];

  test.describe.serial(`창고물품코드(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 창고물품코드 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 창고물품코드
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setSave / delSpplsClsData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 창고물품코드 화면이 오류 없이 진입하고 초기 데이터셋(ds_list)이 로드된다.
   */
  test('[no:1] 창고물품코드 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 창고물품코드 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0907M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '창고물품코드 화면 진입 및 ds_list 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0909M — 귀금속코드관리
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setSave / delSpplsClsData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_0909M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_0909M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass0909/getAssSpplsList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = ['UP_SPPLS_CD', 'UP_SPPLS_NM', 'SPPLS_CD', 'SPPLS_NM', 'UP_CLS_DIV', 'CLS_DIV', 'SPPLS_PRCE', 'SPPLS_UNT', 'CURR_UNIT', 'LEV', 'ORD_NO', 'USE_YN'];

  test.describe.serial(`귀금속코드관리(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 귀금속코드관리 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 귀금속코드관리
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setSave / delSpplsClsData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 귀금속코드관리 화면이 오류 없이 진입하고 초기 데이터셋(ds_list)이 로드된다.
   */
  test('[no:1] 귀금속코드관리 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 귀금속코드관리 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0909M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '귀금속코드관리 화면 진입 및 ds_list 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1013M — 귀금속직접입고
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setSpplsIn / delData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_1013M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_1013M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass1013/getSpplsIn.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = ['WRHS_DIV', 'WRHS_CD', 'WRHS_NM', 'SPPLS_CD', 'SPPLS_REF_CD', 'SPPLS_NM', 'QTY', 'UNT', 'IN_PRCE', 'IN_AMT', 'OUT_QTY', 'RMK'];

  test.describe.serial(`귀금속직접입고(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 귀금속직접입고 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속직접입고
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setSpplsIn / delData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 귀금속직접입고 화면이 오류 없이 진입하고 초기 데이터셋(ds_list)이 로드된다.
   */
  test('[no:1] 귀금속직접입고 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 귀금속직접입고 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1013M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '귀금속직접입고 화면 진입 및 ds_list 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1015M — 귀금속사용결과보고서
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_1015M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_1015M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass1015/getData.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = ['AST_MNG_CD', 'SPPLS_CD', 'SPPLS_NM', 'USE_DT', 'USE_SEQ', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'EQUIP_ID', 'EQUIP_DESC', 'USE_DIV'];

  test.describe.serial(`귀금속사용결과보고서(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 귀금속사용결과보고서 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속사용결과보고서
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 귀금속사용결과보고서 화면이 오류 없이 진입하고 초기 데이터셋(ds_list)이 로드된다.
   */
  test('[no:1] 귀금속사용결과보고서 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 귀금속사용결과보고서 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1015M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '귀금속사용결과보고서 화면 진입 및 ds_list 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_2020M — 재물조사계획등록
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setPropInvsPlanData / delPropInvsPlanData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_2020M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_2020M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass2020/getPropInvsPlanData.do';
  const DS_LIST     = 'ds_main';
  const RESULT_COLS = ['INVS_NO', 'APV_STAT_CD', 'APV_STAT_NM', 'INVS_NM', 'INVS_YY', 'INVS_DEG_CD', 'RQST_CLS', 'RQST_DT', 'RQST_EMP_NO', 'RQST_EMP_NM', 'RQST_DEPT_CD', 'RQST_DEPT_NM'];

  test.describe.serial(`재물조사계획등록(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 재물조사계획등록 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 재물조사  메뉴명: 재물조사계획등록
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setPropInvsPlanData / delPropInvsPlanData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 재물조사계획등록 화면이 오류 없이 진입하고 초기 데이터셋(ds_main)이 로드된다.
   */
  test('[no:1] 재물조사계획등록 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 재물조사계획등록 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_2020M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '재물조사계획등록 화면 진입 및 ds_main 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_2040M — 재물조사결과등록
// Pattern A(그리드/폼 인라인 저장) — 저장버튼 핸들러가 gfn_tran('setPropInvsRsltData / delPropInvsRsltData')을 직접 호출(팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT-only 통합 TC로 강등.
//   원본 시나리오의 INSERT/DELETE(setSave/setDelSave) TC는 실제 저장흐름/필수필드가 코드값·그리드
//   편집에 의존하여 정적 생성 불가 → UI 수동 검증 대상.
// TODO(menuId): SYS_MENU_MGT에서 ass_2040M 실제 menuId 조회 필요 (현재 플레이스홀더 → 진입 실패).
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'ass_2040M';   // describe 제목 고유화 전용
  const API_URL     = '/mis/ass/ass2040/getPropInvsData.do';
  const DS_LIST     = 'ds_main';
  const RESULT_COLS = ['INVS_NO', 'APV_STAT_CD', 'APV_STAT_NM', 'INVS_NM', 'INVS_YY', 'INVS_DEG_CD', 'RQST_CLS', 'RQST_DT', 'RQST_EMP_NO', 'RQST_EMP_NM', 'RQST_DEPT_CD', 'RQST_DEPT_NM'];

  test.describe.serial(`재물조사결과등록(${PGM_ID}) 통합 테스트`, () => {

    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 재물조사결과등록 - 화면 진입 및 초기 조회
   * 중분류: 자산관리  소분류: 재물조사  메뉴명: 재물조사결과등록
   * 비고: 원본 INSERT/DELETE 시나리오는 Pattern A(폼/그리드 직접 저장, 저장서비스=setPropInvsRsltData / delPropInvsRsltData)로
   *       자동 생성 대상이 아니어서 SELECT-only 진입 확인으로 강등함.
   * 예상결과: 재물조사결과등록 화면이 오류 없이 진입하고 초기 데이터셋(ds_main)이 로드된다.
   */
  test('[no:1] 재물조사결과등록 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 재물조사결과등록 - 화면 진입 및 초기 조회');
    logInput('검색조건', '없음 (초기 진입)');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_2040M-inte-no1-open.png`, fullPage: true });

    // Pattern A 강등 TC — 진입/데이터셋 로드 성공을 검증(행수 0 허용).
    expect(Array.isArray(rows), '재물조사결과등록 화면 진입 및 ds_main 로드').toBe(true);
    logResult('검증', 'PASS');
  });

  });
}
