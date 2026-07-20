// ==============================================================
// HRM 모듈 — 인사관리 통합 테스트 (통합 spec)
// 생성일시: 2026-07-05  |  파일: 20260705_hrm_inte.spec.ts
// 커버 화면: 58개  |  총 테스트 케이스: 58건 (SELECT/UI)
// 방식: UI-driven (openMenuById + getNexacroDatasetRows)
// storageState 자동 주입 — 로그인/goto 코드 작성 절대 금지
// 소스: _workspace/hrm/01_scenarios.json
// 주의: 56개 화면 menuId 플레이스홀더(M_MIS_XX_XX_XX) — 실제 ID 확인 전까지 해당 화면 통합 테스트는 실패함.
//       확인된 menuId: hrm_0130M, hrm_3010M (00_menu_ids.json)
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
void BASE_URL; void SLOW;

// ── 메뉴 진입 (공용) ──────────────────────────────────────────────────────────
async function navigateToMenu(page: Page, menuId: string, apiUrl: string, dsList: string): Promise<string> {
  await waitForNexacroAppReady(page, 20000);
  const initResp = page.waitForResponse(r => r.url().includes(apiUrl), { timeout: 20000 }).catch(() => null);

  const nav = await openMenuById(page, menuId);
  if (!nav.ok) throw new Error(`메뉴 로드 실패: ${nav.error}`);
  console.log(`[NAV] menuNm=${nav.menuNm}`);

  const resp = await initResp;
  if (resp) console.log(`[NAV] 초기 조회 HTTP ${resp.status()}`);

  await page.locator('text="조회"').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => null);
  await waitForNexacroDataset(page, menuId, dsList, 1, 10000).catch(() => null);
  return menuId;
}

test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
test.afterAll(() => { flushLogs(); });

// ---------------------------------------------------------------------------
// hrm_0110M — 부서조직관리  |  API: POST /mis/hrm/hrm0110/getOrgchtList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_0110M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_0110M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm0110/getOrgchtList.do';
  const DS_LIST_NAME = 'ds_listOrgcht';
  const RESULT_COLS  = ['DEPT_CD', 'DEPT_NM', 'UPP_DEPT_CD', 'LVL', 'SORT_NO', 'DEPTL_EMP_NM'];
  const CLEAR_COLS   = ['SCH_ORG_RGIN_DT'];
  void CLEAR_COLS;

  test.describe(`부서조직관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 부서조직관리 - 메뉴 진입 후 조직개편이력 선택 → 조직도 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직관리  액터: 인사담당자
   * 예상결과: 인사담당자가 부서조직관리 메뉴에 진입하면 조직개편이력이 자동 조회되고, 첫 개편일 선택 시 해당 조직도가 우측 그리드에 표시된다.
   * DB 확인: SELECT COUNT(*) FROM HRM_ORGCHT A WHERE 1=1
   */
  test(`[no:1] 부서조직관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서조직관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0110M-inte-no1.png`, fullPage: true });

    expect(rows.length, '부서조직관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_0120M — 부서조직변경이력관리  |  API: POST /mis/hrm/hrm0120/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_0120M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_0120M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm0120/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = ['ORG_CHG_FG_CD', 'NOW_DEPT_CD', 'NOW_DEPT_NM', 'PRV_DEPT_CD', 'PRV_DEPT_NM', 'RMK'];
  const CLEAR_COLS   = ['ORG_RGIN_DT', 'ORG_RGIN_FG_CD', 'ORG_RGIN_NM', 'ORG_RGIN_DCSN_YN', 'REFE_METR', 'PRV_ORG_RGIN_DT', 'RGIN_DCSN_YN'];
  void CLEAR_COLS;

  test.describe(`부서조직변경이력관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 부서조직변경이력관리 - 메뉴 진입 → 조직개편일 선택 후 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직변경이력관리  액터: 인사담당자
   * 예상결과: 인사담당자가 메뉴 진입 후 조직개편일(돋보기)로 개편일을 선택하고 조회하면 해당 개편의 부서변경이력이 그리드에 표시된다.
   * DB 확인: SELECT COUNT(*) FROM HRM_ORG_CHG_HIST A WHERE 1=1 AND A.ORG_RGIN_DT = '20240101'
   */
  test(`[no:1] 부서조직변경이력관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서조직변경이력관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0120M-inte-no1.png`, fullPage: true });

    expect(rows.length, '부서조직변경이력관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_0130M — 부서관리  |  API: POST /mis/hrm/hrm0130/getList.do  |  TC 1건 (SELECT/UI)
// menuId: M_MIS_01_01_03 (cache)
{
  const MENU_ID      = 'M_MIS_01_01_03';
  const PGM_ID       = 'hrm_0130M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm0130/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = ['DEPT_CD', 'DEPT_NM', 'BZPLC_CD', 'ACCT_UNT_CD', 'OLD_DEPT_CD', 'USE_YN_NM'];
  const CLEAR_COLS   = ['SCH_HDODF_CD', 'SCH_BZPLC_CD', 'SCH_DEPT_NM', 'SCH_USE_YN'];
  void CLEAR_COLS;

  test.describe(`부서관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 부서관리 - 메뉴 진입 후 사용부서(Y) 자동 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 인사담당자
   * 예상결과: 인사담당자가 부서관리 메뉴에 진입하면 onload 기본값 SCH_USE_YN='Y'로 사용 중인 부서 목록이 자동 조회된다.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.USE_YN = 'Y'
   */
  test(`[no:1] 부서관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0130M-inte-no1.png`, fullPage: true });

    expect(rows.length, '부서관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_0215M — 정원관리  |  API: POST /mis/hrm/hrm0215/getData.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_0215M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_0215M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm0215/getData.do';
  const DS_LIST_NAME = 'ds_prcpList';
  const RESULT_COLS  = ['GRD_CD', 'JSFC_CD', 'DEPT_PRCP_CNT', 'RMK', 'CHK_DT'];
  const CLEAR_COLS   = ['PRCP_MDAT_DT', 'PRCP_MDAT_FG_CD', 'PRCP_MDAT_RSN', 'RMK', 'ORG_RGIN_DT'];
  void CLEAR_COLS;

  test.describe(`정원관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 정원관리 - 메뉴 진입 → 정원조정일 선택 후 직급별정원 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 정원관리  액터: 인사담당자
   * 예상결과: 인사담당자가 정원관리 메뉴 진입 후 정원조정일(돋보기)로 조정일을 선택하고 조회하면 해당 조정일의 직급별 정원이 그리드에 표시된다.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT_PRCP A WHERE 1=1 AND A.PRCP_MDAT_DT = '20240101'
   */
  test(`[no:1] 정원관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 정원관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0215M-inte-no1.png`, fullPage: true });

    expect(rows.length, '정원관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_0225M — 직급별정/현원표  |  API: POST /mis/hrm/hrm0225/getGrdData.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_0225M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_0225M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm0225/getGrdData.do';
  const DS_LIST_NAME = 'ds_listPrcp';
  const RESULT_COLS  = ['GRD_CD', 'DEPT_PRCP_CNT', 'STDR_CNT', 'DIFF_CNT'];
  const CLEAR_COLS   = ['PRCP_MDAT_DT', 'PRCP_MDAT_FG_CD', 'PRCP_MDAT_RSN', 'STDR_DT', 'GRD_CNT'];
  void CLEAR_COLS;

  test.describe(`직급별정/현원표(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 직급별정/현원표 - 메뉴 진입 → 정원조정일 선택, 현원기준일 입력 후 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 직급별정/현원표  액터: 인사담당자
   * 예상결과: 인사담당자가 메뉴 진입 후 정원조정일(돋보기) 선택 및 현원기준일 입력 후 조회하면 직급별 정/현원 대비표가 동적 그리드로 표시된다.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT_PRCP A WHERE 1=1 AND A.PRCP_MDAT_DT = '20240101'
   */
  test(`[no:1] 직급별정/현원표 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 직급별정/현원표 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0225M-inte-no1.png`, fullPage: true });

    expect(rows.length, '직급별정/현원표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_0030M — 부서조직도관리  |  API: POST /mis/hrm/hrm0030/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_0030M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_0030M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm0030/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = [];
  void CLEAR_COLS;

  test.describe(`부서조직도관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 부서조직도관리 - 메뉴 진입 후 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직도관리  액터: 인사담당자
   * 예상결과: 인사담당자가 부서조직도관리 메뉴에서 조회를 수행하면 결과가 표시된다.
   * DB 확인: -- TODO: hrm_0030M 매핑(/mis/hrm/hrm0030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 부서조직도관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서조직도관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0030M-inte-no1.png`, fullPage: true });

    expect(rows.length, '부서조직도관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_0210M — 부서별정원  |  API: POST /mis/hrm/hrm0210/getDeptList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_0210M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_0210M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm0210/getDeptList.do';
  const DS_LIST_NAME = 'ds_main';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['ORG_RGIN_RID', 'ORG_RGIN_DT', 'PRCP_MDAT_DT', 'PRCP_MDAT_FG', 'PRCP_MDAT_RSN', 'RMK'];
  void CLEAR_COLS;

  test.describe(`부서별정원(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 부서별정원 - 상위 목록에서 항목 선택 → 상세 진입 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 부서별정원  액터: 인사담당자
   * 예상결과: 인사담당자가 상위 목록 화면에서 항목을 선택해 부서별정원 화면으로 진입하면 해당 단건 정보가 표시된다.
   * DB 확인: -- TODO: hrm_0210M 매핑(/mis/hrm/hrm0210/getDeptList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 부서별정원 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서별정원 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0210M-inte-no1.png`, fullPage: true });

    expect(rows.length, '부서별정원 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_0220M — 부서별정/현원표  |  API: POST /mis/hrm/hrm0220/getData.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_0220M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_0220M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm0220/getData.do';
  const DS_LIST_NAME = 'ds_grdList';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['ORG_RGIN_RID', 'ORG_RGIN_DT', 'PRCP_MDAT_DT', 'PRCP_MDAT_FG', 'PRCP_MDAT_RSN', 'RMK', 'STDR_DT'];
  void CLEAR_COLS;

  test.describe(`부서별정/현원표(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 부서별정/현원표 - 상위 목록에서 항목 선택 → 상세 진입 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 부서별정/현원표  액터: 인사담당자
   * 예상결과: 인사담당자가 상위 목록 화면에서 항목을 선택해 부서별정/현원표 화면으로 진입하면 해당 단건 정보가 표시된다.
   * DB 확인: -- TODO: hrm_0220M 매핑(/mis/hrm/hrm0220/getData.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 부서별정/현원표 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서별정/현원표 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0220M-inte-no1.png`, fullPage: true });

    expect(rows.length, '부서별정/현원표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_2010M — 발령코드관리  |  API: POST /mis/hrm/hrm2010/getUppAppntCdList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_2010M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_2010M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm2010/getUppAppntCdList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['UPP_APPNT_CD'];
  void CLEAR_COLS;

  test.describe(`발령코드관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 발령코드관리 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 발령코드관리  액터: 인사담당자
   * 예상결과: 인사담당자가 발령코드관리 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_2010M 매핑(/mis/hrm/hrm2010/getUppAppntCdList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 발령코드관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 발령코드관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2010M-inte-no1.png`, fullPage: true });

    expect(rows.length, '발령코드관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_2020M — 발령호수관리  |  API: POST /mis/hrm/hrm2020/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_2020M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_2020M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm2020/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_YY', 'SCH_HDQS_FG'];
  void CLEAR_COLS;

  test.describe(`발령호수관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 발령호수관리 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 발령호수관리  액터: 인사담당자
   * 예상결과: 인사담당자가 발령호수관리 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_2020M 매핑(/mis/hrm/hrm2020/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 발령호수관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 발령호수관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2020M-inte-no1.png`, fullPage: true });

    expect(rows.length, '발령호수관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_2030M — 인사발령관리  |  API: POST /mis/hrm/hrm2030/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_2030M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_2030M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm2030/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_YY', 'SCH_APPNT_REGT_MNG_RNO', 'SCH_APPNT_DOC_NO', 'SCH_APPNT_DT', 'SCH_APPNT_CONT', 'SCH_APPNT_OPTR_EMP_RID', 'SCH_APPNT_OPTR_EMP_NO', 'SCH_APPNT_OPTR_EMP_NM', 'SCH_APPNT_PROC_OPET_DE'];
  void CLEAR_COLS;

  test.describe(`인사발령관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 인사발령관리 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 인사발령관리  액터: 인사담당자
   * 예상결과: 인사담당자가 인사발령관리 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_2030M 매핑(/mis/hrm/hrm2030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사발령관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사발령관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2030M-inte-no1.png`, fullPage: true });

    expect(rows.length, '인사발령관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_2040M — 인사발령현황  |  API: POST /mis/hrm/hrm2040/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_2040M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_2040M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm2040/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_UPP_APPNT_CD', 'SCH_APPNT_CD', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_APPNT_CONT'];
  void CLEAR_COLS;

  test.describe(`인사발령현황(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 인사발령현황 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 인사발령현황  액터: 인사담당자
   * 예상결과: 인사담당자가 인사발령현황 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_2040M 매핑(/mis/hrm/hrm2040/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사발령현황 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사발령현황 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2040M-inte-no1.png`, fullPage: true });

    expect(rows.length, '인사발령현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_2041M — 이전발령현황  |  API: POST /mis/hrm/hrm2040/getPrvList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_2041M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_2041M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm2040/getPrvList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_UPP_APPNT_CD', 'SCH_APPNT_CD', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_RMK'];
  void CLEAR_COLS;

  test.describe(`이전발령현황(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 이전발령현황 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 이전발령현황  액터: 인사담당자
   * 예상결과: 인사담당자가 이전발령현황 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_2041M 매핑(/mis/hrm/hrm2040/getPrvList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 이전발령현황 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 이전발령현황 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2041M-inte-no1.png`, fullPage: true });

    expect(rows.length, '이전발령현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3010M — 인사기록카드  |  API: POST /mis/hrm/hrm3010/getList.do  |  TC 1건 (SELECT/UI)
// menuId: M_MIS_01_03_01 (cache)
{
  const MENU_ID      = 'M_MIS_01_03_01';
  const PGM_ID       = 'hrm_3010M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm3010/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['HLDF_FG', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'GRD_FG'];
  void CLEAR_COLS;

  test.describe(`인사기록카드(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 인사기록카드 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드  액터: 인사담당자
   * 예상결과: 인사담당자가 인사기록카드 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_3010M 매핑(/mis/hrm/hrm3010/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사기록카드 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사기록카드 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3010M-inte-no1.png`, fullPage: true });

    expect(rows.length, '인사기록카드 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3020M — 개인인사기록카드  |  API: POST /mis/hrm/hrm3020/getMain.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_3020M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_3020M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm3020/getMain.do';
  const DS_LIST_NAME = 'ds_main';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['EMP_RID', 'TABPAGE', 'TABPAGE_TEXT'];
  void CLEAR_COLS;

  test.describe(`개인인사기록카드(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 개인인사기록카드 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 개인인사기록카드  액터: 인사담당자
   * 예상결과: 인사담당자가 개인인사기록카드 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_3020M 매핑(/mis/hrm/hrm3020/getMain.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 개인인사기록카드 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 개인인사기록카드 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3020M-inte-no1.png`, fullPage: true });

    expect(rows.length, '개인인사기록카드 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3030M — 인사기록카드변경신청  |  API: POST /mis/hrm/hrm3030/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_3030M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_3030M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm3030/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_FRM_RQST_DT', 'SCH_TO_RQST_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_STRE_STAT_FG'];
  void CLEAR_COLS;

  test.describe(`인사기록카드변경신청(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 인사기록카드변경신청 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드변경신청  액터: 인사담당자
   * 예상결과: 인사담당자가 인사기록카드변경신청 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_3030M 매핑(/mis/hrm/hrm3030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사기록카드변경신청 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사기록카드변경신청 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3030M-inte-no1.png`, fullPage: true });

    expect(rows.length, '인사기록카드변경신청 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3031M — 인사기록카드변경신청  |  API: POST /mis/hrm/hrm3031/setGetTabData.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_3031M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_3031M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm3031/setGetTabData.do';
  const DS_LIST_NAME = 'ds_main';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['HRM_RCED_RQST_RNO', 'HRM_RCED_RQST_NO', 'RQST_DT', 'RQSTER_EMP_RID', 'RQSTER_EMP_NO', 'RQSTER_EMP_NM', 'RQSTER_DEPT_CD', 'RQSTER_DEPT_NM', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'GRD_FG', 'HRM_RCED_CHG_TRGT_FG', 'STRE_STAT_FG', 'APV_STAT_FG', 'APV_STAT_FG_NM', 'RUS_RSN', 'H_HRM_RCED_RQST_RNO', 'APV_YN'];
  void CLEAR_COLS;

  test.describe(`인사기록카드변경신청(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 인사기록카드변경신청 - 상위 목록에서 항목 선택 → 상세 진입 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드변경신청  액터: 인사담당자
   * 예상결과: 인사담당자가 상위 목록 화면에서 항목을 선택해 인사기록카드변경신청 화면으로 진입하면 해당 단건 정보가 표시된다.
   * DB 확인: -- TODO: hrm_3031M 매핑(/mis/hrm/hrm3031/setGetTabData.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사기록카드변경신청 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사기록카드변경신청 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3031M-inte-no1.png`, fullPage: true });

    expect(rows.length, '인사기록카드변경신청 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3040M — 인사기록카드변경신청승인  |  API: POST /mis/hrm/hrm3040/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_3040M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_3040M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm3040/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_FRM_RQST_DT', 'SCH_TO_RQST_DT', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_STRE_STAT_FG'];
  void CLEAR_COLS;

  test.describe(`인사기록카드변경신청승인(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 인사기록카드변경신청승인 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드변경신청승인  액터: 인사담당자
   * 예상결과: 인사담당자가 인사기록카드변경신청승인 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_3040M 매핑(/mis/hrm/hrm3040/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사기록카드변경신청승인 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사기록카드변경신청승인 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3040M-inte-no1.png`, fullPage: true });

    expect(rows.length, '인사기록카드변경신청승인 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3041M — 인사기록카드변경신청승인  |  API: POST /mis/hrm/hrm3041/getTabData.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_3041M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_3041M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm3041/getTabData.do';
  const DS_LIST_NAME = 'ds_main';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['HRM_RCED_RQST_RNO', 'HRM_RCED_RQST_NO', 'RQST_DT', 'RQSTER_EMP_RID', 'RQSTER_EMP_NO', 'RQSTER_EMP_NM', 'RQSTER_DEPT_CD', 'RQSTER_DEPT_NM', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'GRD_FG', 'HRM_RCED_CHG_TRGT_FG', 'STRE_STAT_FG', 'APV_STAT_FG', 'APV_STAT_FG_NM', 'RUS_RSN', 'H_HRM_RCED_RQST_RNO', 'APV_YN'];
  void CLEAR_COLS;

  test.describe(`인사기록카드변경신청승인(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 인사기록카드변경신청승인 - 상위 목록에서 항목 선택 → 상세 진입 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드변경신청승인  액터: 인사담당자
   * 예상결과: 인사담당자가 상위 목록 화면에서 항목을 선택해 인사기록카드변경신청승인 화면으로 진입하면 해당 단건 정보가 표시된다.
   * DB 확인: -- TODO: hrm_3041M 매핑(/mis/hrm/hrm3041/getTabData.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사기록카드변경신청승인 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사기록카드변경신청승인 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3041M-inte-no1.png`, fullPage: true });

    expect(rows.length, '인사기록카드변경신청승인 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3050M — 근무평점일괄업로드  |  API: POST /mis/hrm/hrm3050/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_3050M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_3050M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm3050/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_STDR_YY', 'SCH_EVAL_FG', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_GRD_FG'];
  void CLEAR_COLS;

  test.describe(`근무평점일괄업로드(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 근무평점일괄업로드 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 근무평점일괄업로드  액터: 인사담당자
   * 예상결과: 인사담당자가 근무평점일괄업로드 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_3050M 매핑(/mis/hrm/hrm3050/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 근무평점일괄업로드 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 근무평점일괄업로드 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3050M-inte-no1.png`, fullPage: true });

    expect(rows.length, '근무평점일괄업로드 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3060M — 성과평점일괄업로드  |  API: POST /mis/hrm/hrm3060/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_3060M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_3060M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm3060/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_STDR_YY', 'SCH_EVAL_FG', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_GRD_FG'];
  void CLEAR_COLS;

  test.describe(`성과평점일괄업로드(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 성과평점일괄업로드 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 성과평점일괄업로드  액터: 인사담당자
   * 예상결과: 인사담당자가 성과평점일괄업로드 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_3060M 매핑(/mis/hrm/hrm3060/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 성과평점일괄업로드 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 성과평점일괄업로드 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3060M-inte-no1.png`, fullPage: true });

    expect(rows.length, '성과평점일괄업로드 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3110M — 고용계약관리  |  API: POST /mis/hrm/hrm3110/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_3110M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_3110M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm3110/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_APLY_YY', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_CTRCT_PROG_STAT_FG', 'SCH_EMPO_CTRCT_FG'];
  void CLEAR_COLS;

  test.describe(`고용계약관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 고용계약관리 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 계약관리  메뉴명: 고용계약관리  액터: 인사담당자
   * 예상결과: 인사담당자가 고용계약관리 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_3110M 매핑(/mis/hrm/hrm3110/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 고용계약관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 고용계약관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3110M-inte-no1.png`, fullPage: true });

    expect(rows.length, '고용계약관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3120M — 고용계약확인  |  API: POST /mis/hrm/hrm3120/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_3120M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_3120M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm3120/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_CTRCT_PROG_STAT_FG'];
  void CLEAR_COLS;

  test.describe(`고용계약확인(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 고용계약확인 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 계약관리  메뉴명: 고용계약확인  액터: 인사담당자
   * 예상결과: 인사담당자가 고용계약확인 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_3120M 매핑(/mis/hrm/hrm3120/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 고용계약확인 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 고용계약확인 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3120M-inte-no1.png`, fullPage: true });

    expect(rows.length, '고용계약확인 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3150M — 연봉계약관리  |  API: POST /mis/hrm/hrm3150/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_3150M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_3150M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm3150/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_APLY_YY', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_CTRCT_PROG_STAT_FG', 'DEPTL_EMP_RID', 'DEPTL_EMP_NO', 'DEPTL_EMP_NM'];
  void CLEAR_COLS;

  test.describe(`연봉계약관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 연봉계약관리 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 계약관리  메뉴명: 연봉계약관리  액터: 인사담당자
   * 예상결과: 인사담당자가 연봉계약관리 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_3150M 매핑(/mis/hrm/hrm3150/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 연봉계약관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 연봉계약관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3150M-inte-no1.png`, fullPage: true });

    expect(rows.length, '연봉계약관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3160M — 연봉계약확인  |  API: POST /mis/hrm/hrm3160/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_3160M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_3160M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm3160/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_CTRCT_PROG_STAT_FG'];
  void CLEAR_COLS;

  test.describe(`연봉계약확인(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 연봉계약확인 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 계약관리  메뉴명: 연봉계약확인  액터: 인사담당자
   * 예상결과: 인사담당자가 연봉계약확인 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_3160M 매핑(/mis/hrm/hrm3160/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 연봉계약확인 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 연봉계약확인 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3160M-inte-no1.png`, fullPage: true });

    expect(rows.length, '연봉계약확인 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4010M — 인사자료조회  |  API: POST /mis/hrm/hrm4010/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_4010M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
// TODO(dsList): 원본 dsListName="ds_" 파싱 불가 -> 'ds_list' 대체.
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_4010M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm4010/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['STDR_DT', 'DEPT_CD', 'DEPT_NM', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'HLDF_FG', 'EMPO_STLF_FG', 'JBGP_FG', 'GRD_FG', 'ROOF_FG', 'FLOC_FG', 'RSIGN_EXCLUS_YN', 'TABPAGE'];
  void CLEAR_COLS;

  test.describe(`인사자료조회(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 인사자료조회 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 인사자료조회  액터: 인사담당자
   * 예상결과: 인사담당자가 인사자료조회 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_4010M 매핑(/mis/hrm/hrm4010/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사자료조회 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사자료조회 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4010M-inte-no1.png`, fullPage: true });

    expect(rows.length, '인사자료조회 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4020M — 부서별인원현황  |  API: POST /mis/hrm/hrm4020/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_4020M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_4020M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm4020/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['STDR_DT'];
  void CLEAR_COLS;

  test.describe(`부서별인원현황(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 부서별인원현황 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 부서별인원현황  액터: 인사담당자
   * 예상결과: 인사담당자가 부서별인원현황 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_4020M 매핑(/mis/hrm/hrm4020/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 부서별인원현황 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서별인원현황 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4020M-inte-no1.png`, fullPage: true });

    expect(rows.length, '부서별인원현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4030M — 부서별직원현황  |  API: POST /mis/hrm/hrm4030/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_4030M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_4030M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm4030/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['STDR_DT'];
  void CLEAR_COLS;

  test.describe(`부서별직원현황(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 부서별직원현황 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 부서별직원현황  액터: 인사담당자
   * 예상결과: 인사담당자가 부서별직원현황 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_4030M 매핑(/mis/hrm/hrm4030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 부서별직원현황 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서별직원현황 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4030M-inte-no1.png`, fullPage: true });

    expect(rows.length, '부서별직원현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4050M — 퇴직자현황  |  API: POST /mis/hrm/hrm4050/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_4050M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_4050M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm4050/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['STDR_FRM_DT', 'STDR_TO_DT'];
  void CLEAR_COLS;

  test.describe(`퇴직자현황(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 퇴직자현황 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 퇴직자현황  액터: 인사담당자
   * 예상결과: 인사담당자가 퇴직자현황 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_4050M 매핑(/mis/hrm/hrm4050/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 퇴직자현황 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 퇴직자현황 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4050M-inte-no1.png`, fullPage: true });

    expect(rows.length, '퇴직자현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4070M — 부서별남녀직원현황  |  API: POST /mis/hrm/hrm4070/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_4070M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_4070M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm4070/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_STD_DT'];
  void CLEAR_COLS;

  test.describe(`부서별남녀직원현황(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 부서별남녀직원현황 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 부서별남녀직원현황  액터: 인사담당자
   * 예상결과: 인사담당자가 부서별남녀직원현황 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_4070M 매핑(/mis/hrm/hrm4070/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 부서별남녀직원현황 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서별남녀직원현황 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4070M-inte-no1.png`, fullPage: true });

    expect(rows.length, '부서별남녀직원현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4090M — 부서별 연령 현황  |  API: POST /mis/hrm/hrm4090/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_4090M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_4090M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm4090/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_STD_DT'];
  void CLEAR_COLS;

  test.describe(`부서별 연령 현황(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 부서별 연령 현황 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 부서별 연령 현황  액터: 인사담당자
   * 예상결과: 인사담당자가 부서별 연령 현황 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_4090M 매핑(/mis/hrm/hrm4090/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 부서별 연령 현황 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서별 연령 현황 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4090M-inte-no1.png`, fullPage: true });

    expect(rows.length, '부서별 연령 현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4100M — 신규자현황  |  API: POST /mis/hrm/hrm4100/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_4100M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_4100M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm4100/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['STDR_FRM_DT', 'STDR_TO_DT'];
  void CLEAR_COLS;

  test.describe(`신규자현황(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 신규자현황 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 신규자현황  액터: 인사담당자
   * 예상결과: 인사담당자가 신규자현황 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_4100M 매핑(/mis/hrm/hrm4100/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 신규자현황 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 신규자현황 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4100M-inte-no1.png`, fullPage: true });

    expect(rows.length, '신규자현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4110M — 보직자현황  |  API: POST /mis/hrm/hrm0640008/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_4110M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_4110M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm0640008/getList.do';
  const DS_LIST_NAME = 'ds_datagrid1';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['BS_DT', 'HOLD_OFFIS', 'EMP_CLSS', 'JOB_TPS', 'GRD_CDS', 'JOB_POSTS'];
  void CLEAR_COLS;

  test.describe(`보직자현황(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 보직자현황 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 보직자현황  액터: 인사담당자
   * 예상결과: 인사담당자가 보직자현황 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_4110M 매핑(/mis/hrm/hrm0640008/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 보직자현황 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 보직자현황 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4110M-inte-no1.png`, fullPage: true });

    expect(rows.length, '보직자현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4120M — 휴직자현황  |  API: POST /mis/hrm/hrm4120/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_4120M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_4120M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm4120/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['STDR_FRM_DT', 'STDR_TO_DT', 'CLS'];
  void CLEAR_COLS;

  test.describe(`휴직자현황(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 휴직자현황 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 휴직자현황  액터: 인사담당자
   * 예상결과: 인사담당자가 휴직자현황 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_4120M 매핑(/mis/hrm/hrm4120/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 휴직자현황 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 휴직자현황 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4120M-inte-no1.png`, fullPage: true });

    expect(rows.length, '휴직자현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4130M — 보직자현황  |  API: POST /mis/hrm/hrm4130/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_4130M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_4130M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm4130/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['STDR_FRM_DT', 'STDR_TO_DT', 'ROOF_FG'];
  void CLEAR_COLS;

  test.describe(`보직자현황(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 보직자현황 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 보직자현황  액터: 인사담당자
   * 예상결과: 인사담당자가 보직자현황 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_4130M 매핑(/mis/hrm/hrm4130/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 보직자현황 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 보직자현황 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4130M-inte-no1.png`, fullPage: true });

    expect(rows.length, '보직자현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_5010M — 증명서신청  |  API: POST /mis/hrm/hrm5010/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_5010M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_5010M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm5010/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['FRM_RQST_DT', 'TO_RQST_DT', 'CERT_TRGTER_EMP_RID', 'CERT_TRGTER_EMP_NO', 'CERT_TRGTER_EMP_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'CERT_FG', 'STRE_STAT_FG', 'CERT_RQST_RNO', 'CHRGER_RQST_YN'];
  void CLEAR_COLS;

  test.describe(`증명서신청(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 증명서신청 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 증명서신청  액터: 인사담당자
   * 예상결과: 인사담당자가 증명서신청 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_5010M 매핑(/mis/hrm/hrm5010/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 증명서신청 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 증명서신청 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5010M-inte-no1.png`, fullPage: true });

    expect(rows.length, '증명서신청 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_5011M — 증명서신청  |  API: POST /mis/hrm/hrm5011/getDegHisList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_5011M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_5011M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm5011/getDegHisList.do';
  const DS_LIST_NAME = 'ds_degHisList';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = [];
  void CLEAR_COLS;

  test.describe(`증명서신청(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 증명서신청 - 메뉴 진입 후 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 증명서신청  액터: 인사담당자
   * 예상결과: 인사담당자가 증명서신청 메뉴에서 조회를 수행하면 결과가 표시된다.
   * DB 확인: -- TODO: hrm_5011M 매핑(/mis/hrm/hrm5011/getDegHisList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 증명서신청 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 증명서신청 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5011M-inte-no1.png`, fullPage: true });

    expect(rows.length, '증명서신청 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_5020M — 증명서승인관리  |  API: POST /mis/hrm/hrm5020/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_5020M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_5020M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm5020/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['FRM_RQST_DT', 'TO_RQST_DT', 'CERT_TRGTER_EMP_RID', 'CERT_TRGTER_EMP_NO', 'CERT_TRGTER_EMP_NM', 'CERT_FG', 'STRE_STAT_FG', 'RQSTER_EMP_RID', 'RQSTER_EMP_NO', 'APNT_EMP_NM', 'CERT_RQST_RNO', 'CERT_RQST_NO', 'CHRGER_RQST_YN'];
  void CLEAR_COLS;

  test.describe(`증명서승인관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 증명서승인관리 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 증명서승인관리  액터: 인사담당자
   * 예상결과: 인사담당자가 증명서승인관리 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_5020M 매핑(/mis/hrm/hrm5020/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 증명서승인관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 증명서승인관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5020M-inte-no1.png`, fullPage: true });

    expect(rows.length, '증명서승인관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_5030M — (구)제증명발급현황  |  API: POST /mis/hrm/hrm5030/getHrmCertMngOldList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_5030M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_5030M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm5030/getHrmCertMngOldList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['C_TYPE', 'FRM_WRITE_DATE', 'TO_WRITE_DATE', 'USER_NM'];
  void CLEAR_COLS;

  test.describe(`(구)제증명발급현황(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] (구)제증명발급현황 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: (구)제증명발급현황  액터: 인사담당자
   * 예상결과: 인사담당자가 (구)제증명발급현황 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_5030M 매핑(/mis/hrm/hrm5030/getHrmCertMngOldList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] (구)제증명발급현황 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] (구)제증명발급현황 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5030M-inte-no1.png`, fullPage: true });

    expect(rows.length, '(구)제증명발급현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_5040M — 제증명환경설정  |  API: POST /mis/hrm/hrm5040/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_5040M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_5040M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm5040/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = [];
  void CLEAR_COLS;

  test.describe(`제증명환경설정(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 제증명환경설정 - 메뉴 진입 후 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 제증명환경설정  액터: 인사담당자
   * 예상결과: 인사담당자가 제증명환경설정 메뉴에서 조회를 수행하면 결과가 표시된다.
   * DB 확인: -- TODO: hrm_5040M 매핑(/mis/hrm/hrm5040/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 제증명환경설정 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 제증명환경설정 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5040M-inte-no1.png`, fullPage: true });

    expect(rows.length, '제증명환경설정 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_5070M — 직인및인감신청목록  |  API: POST /mis/hrm/hrm5070/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_5070M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_5070M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm5070/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_FROM_DT', 'SCH_TO_DT', 'SCH_CERT_CLS', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_NM', 'SCH_DEPT_CD', 'SCH_APV_STAT_CD', 'SCH_SEAL_CLS'];
  void CLEAR_COLS;

  test.describe(`직인및인감신청목록(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 직인및인감신청목록 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 직인및인감신청목록  액터: 인사담당자
   * 예상결과: 인사담당자가 직인및인감신청목록 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_5070M 매핑(/mis/hrm/hrm5070/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 직인및인감신청목록 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 직인및인감신청목록 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5070M-inte-no1.png`, fullPage: true });

    expect(rows.length, '직인및인감신청목록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_5071M — 직인및인감신청  |  API: POST /mis/hrm/hrm5071/getSearch.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_5071M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_5071M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm5071/getSearch.do';
  const DS_LIST_NAME = 'ds_main';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['RQST_NO', 'popupYN', 'PUBCT_RQST_EMP_NO'];
  void CLEAR_COLS;

  test.describe(`직인및인감신청(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 직인및인감신청 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 직인및인감신청  액터: 인사담당자
   * 예상결과: 인사담당자가 직인및인감신청 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_5071M 매핑(/mis/hrm/hrm5071/getSearch.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 직인및인감신청 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 직인및인감신청 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5071M-inte-no1.png`, fullPage: true });

    expect(rows.length, '직인및인감신청 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_6010M — 채용공고등록  |  API: POST /mis/hrm/hrm6010/getEmytAnncList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_6010M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_6010M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm6010/getEmytAnncList.do';
  const DS_LIST_NAME = 'ds_list01';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_EMYT_ANNC_YY', 'SCH_SRCN_STEP_FG_CD'];
  void CLEAR_COLS;

  test.describe(`채용공고등록(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 채용공고등록 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 채용관리  메뉴명: 채용공고등록  액터: 인사담당자
   * 예상결과: 인사담당자가 채용공고등록 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_6010M 매핑(/mis/hrm/hrm6010/getEmytAnncList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 채용공고등록 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 채용공고등록 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_6010M-inte-no1.png`, fullPage: true });

    expect(rows.length, '채용공고등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_6011M — 채용공고등록 상세  |  API: POST /mis/hrm/hrm6011/getEmytAnncData.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_6011M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_6011M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm6011/getEmytAnncData.do';
  const DS_LIST_NAME = 'ds_main';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['tmHeader', 'EMYT_ANNC_NO', 'EMYT_YY', 'EMYT_ANNC_FRM_DT', 'EMYT_ANNC_TO_DT', 'EMYT_ANNC_NM'];
  void CLEAR_COLS;

  test.describe(`채용공고등록 상세(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 채용공고등록 상세 - 상위 목록에서 항목 선택 → 상세 진입 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 채용관리  메뉴명: 채용공고등록 상세  액터: 인사담당자
   * 예상결과: 인사담당자가 상위 목록 화면에서 항목을 선택해 채용공고등록 상세 화면으로 진입하면 해당 단건 정보가 표시된다.
   * DB 확인: -- TODO: hrm_6011M 매핑(/mis/hrm/hrm6011/getEmytAnncData.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 채용공고등록 상세 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 채용공고등록 상세 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_6011M-inte-no1.png`, fullPage: true });

    expect(rows.length, '채용공고등록 상세 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_6030M — 평가위원이력관리  |  API: POST /mis/hrm/hrm6030/getEmytEvalMfmmList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_6030M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_6030M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm6030/getEmytEvalMfmmList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_EMYT_ANNC_YY'];
  void CLEAR_COLS;

  test.describe(`평가위원이력관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 평가위원이력관리 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 채용관리  메뉴명: 평가위원이력관리  액터: 인사담당자
   * 예상결과: 인사담당자가 평가위원이력관리 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_6030M 매핑(/mis/hrm/hrm6030/getEmytEvalMfmmList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 평가위원이력관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 평가위원이력관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_6030M-inte-no1.png`, fullPage: true });

    expect(rows.length, '평가위원이력관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9010M — 교육목표시간관리  |  API: POST /mis/hrm/hrm9010/getEduTgpnMngList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_9010M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_9010M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm9010/getEduTgpnMngList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_STDR_YY', 'SCH_EMP_RID', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_GRD_FG'];
  void CLEAR_COLS;

  test.describe(`교육목표시간관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 교육목표시간관리 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육목표시간관리  액터: 인사담당자
   * 예상결과: 인사담당자가 교육목표시간관리 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_9010M 매핑(/mis/hrm/hrm9010/getEduTgpnMngList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육목표시간관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육목표시간관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9010M-inte-no1.png`, fullPage: true });

    expect(rows.length, '교육목표시간관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9111M — 교육신청(개인)  |  API: POST /mis/hrm/hrm9111/getData.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_9111M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_9111M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm9111/getData.do';
  const DS_LIST_NAME = 'ds_main';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['EDU_RQST_RNO', 'EDU_RQST_NO', 'RQST_FG', 'RQST_DT', 'APV_STAT_FG', 'APV_STAT_NM', 'RQSTER_EMP_RID', 'RQSTER_EMP_NO', 'RQSTER_EMP_NM', 'RQSTER_DEPT_CD', 'RQSTER_DEPT_NM', 'RQSTER_GRD_FG', 'EDU_TRGTER_EMP_RID', 'EDU_TRGTER_EMP_NO', 'EDU_TRGTER_EMP_NM', 'EDU_TRGTER_DEPT_CD', 'EDU_TRGTER_DEPT_NM', 'EDU_TRGTER_GRD_FG', 'EDU_YY', 'EDU_KND_CD', 'EDU_KND_NM', 'EDU_CRS_CD', 'EDU_NM', 'EDU_FG_CD', 'EDU_INSTT_NM', 'EDU_PLC', 'EDU_FRM_DT', 'EDU_TO_DT', 'EDU_TIME', 'EDU_EXP', 'EDU_CONT', 'BIGO', 'PRV_EDU_RQST_NO', 'PRV_EDU_RQST_RNO', 'CNCL_RSN', 'EDU_MTHD_FG', 'EDU_SETLE_MTHD_FG', 'APV_YN'];
  void CLEAR_COLS;

  test.describe(`교육신청(개인)(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 교육신청(개인) - 상위 목록에서 항목 선택 → 상세 진입 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육신청(개인)  액터: 인사담당자
   * 예상결과: 인사담당자가 상위 목록 화면에서 항목을 선택해 교육신청(개인) 화면으로 진입하면 해당 단건 정보가 표시된다.
   * DB 확인: -- TODO: hrm_9111M 매핑(/mis/hrm/hrm9111/getData.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육신청(개인) - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육신청(개인) - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9111M-inte-no1.png`, fullPage: true });

    expect(rows.length, '교육신청(개인) 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9130M — 교육증빙등록  |  API: POST /mis/hrm/hrm9130/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_9130M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_9130M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm9130/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_ACCP_STAT_FG'];
  void CLEAR_COLS;

  test.describe(`교육증빙등록(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 교육증빙등록 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육증빙등록  액터: 인사담당자
   * 예상결과: 인사담당자가 교육증빙등록 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_9130M 매핑(/mis/hrm/hrm9130/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육증빙등록 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육증빙등록 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9130M-inte-no1.png`, fullPage: true });

    expect(rows.length, '교육증빙등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9131M — 교육증빙등록  |  API: POST /mis/hrm/hrm9131/getData.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_9131M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_9131M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm9131/getData.do';
  const DS_LIST_NAME = 'ds_main';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['EDU_RQST_RNO', 'EDU_RQST_NO', 'RQST_FG', 'RQST_DT', 'APV_STAT_CD', 'APV_STAT_NM', 'RQSTER_EMP_RID', 'RQSTER_EMP_NO', 'RQSTER_EMP_NM', 'RQSTER_DEPT_CD', 'RQSTER_DEPT_NM', 'RQSTER_GRD_FG', 'EDU_TRGTER_EMP_RID', 'EDU_TRGTER_EMP_NO', 'EDU_TRGTER_EMP_NM', 'EDU_TRGTER_DEPT_CD', 'EDU_TRGTER_DEPT_NM', 'EDU_TRGTER_GRD_FG', 'EDU_YY', 'EDU_NM', 'EDU_KND_CD', 'EDU_KND_NM', 'EDU_CRS_CD', 'EDU_FG_CD', 'EDU_INSTT_NM', 'EDU_PLC', 'EDU_FRM_DT', 'EDU_TO_DT', 'EDU_TIME', 'EDU_AMT', 'EDU_EXP', 'EDU_CONT', 'PRV_EDU_RQST_RNO', 'CNCL_RSN', 'ACCP_STAT_FG', 'RUS_RSN', 'EDU_MTHD_FG', 'EDU_SETLE_MTHD_FG'];
  void CLEAR_COLS;

  test.describe(`교육증빙등록(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 교육증빙등록 - 상위 목록에서 항목 선택 → 상세 진입 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육증빙등록  액터: 인사담당자
   * 예상결과: 인사담당자가 상위 목록 화면에서 항목을 선택해 교육증빙등록 화면으로 진입하면 해당 단건 정보가 표시된다.
   * DB 확인: -- TODO: hrm_9131M 매핑(/mis/hrm/hrm9131/getData.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육증빙등록 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육증빙등록 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9131M-inte-no1.png`, fullPage: true });

    expect(rows.length, '교육증빙등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9140M — 교육이수승인  |  API: POST /mis/hrm/hrm9140/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_9140M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_9140M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm9140/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_ACCP_STAT_FG'];
  void CLEAR_COLS;

  test.describe(`교육이수승인(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 교육이수승인 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수승인  액터: 인사담당자
   * 예상결과: 인사담당자가 교육이수승인 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_9140M 매핑(/mis/hrm/hrm9140/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육이수승인 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육이수승인 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9140M-inte-no1.png`, fullPage: true });

    expect(rows.length, '교육이수승인 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9300M — 교육종류관리  |  API: POST /mis/hrm/hrm9300/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_9300M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_9300M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm9300/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_EDU_KND_NM', 'SCH_USE_YN'];
  void CLEAR_COLS;

  test.describe(`교육종류관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 교육종류관리 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육종류관리  액터: 인사담당자
   * 예상결과: 인사담당자가 교육종류관리 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_9300M 매핑(/mis/hrm/hrm9300/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육종류관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육종류관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9300M-inte-no1.png`, fullPage: true });

    expect(rows.length, '교육종류관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9305M — 교육과정관리  |  API: POST /mis/hrm/hrm9305/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_9305M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_9305M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm9305/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_EDU_CRS_NM', 'SCH_EDU_TRGT'];
  void CLEAR_COLS;

  test.describe(`교육과정관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 교육과정관리 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육과정관리  액터: 인사담당자
   * 예상결과: 인사담당자가 교육과정관리 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_9305M 매핑(/mis/hrm/hrm9305/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육과정관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육과정관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9305M-inte-no1.png`, fullPage: true });

    expect(rows.length, '교육과정관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9310M — 교육기준관리  |  API: POST /mis/hrm/hrm9310/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_9310M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_9310M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm9310/getList.do';
  const DS_LIST_NAME = 'ds_course';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_EDU_STDR_YY', 'EDU_KND_CD', 'EDU_TRGT', 'EDU_TRGT_NM', 'APLY_STDR_DT', 'SCH_EDU_KND_NM'];
  void CLEAR_COLS;

  test.describe(`교육기준관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 교육기준관리 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육기준관리  액터: 인사담당자
   * 예상결과: 인사담당자가 교육기준관리 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_9310M 매핑(/mis/hrm/hrm9310/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육기준관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육기준관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9310M-inte-no1.png`, fullPage: true });

    expect(rows.length, '교육기준관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9311M — 교육대상자관리  |  API: POST /mis/hrm/hrm9311/getCourseList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_9311M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_9311M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm9311/getCourseList.do';
  const DS_LIST_NAME = 'ds_course';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_EDU_FG_CD', 'SCH_EDU_START_YM', 'EDU_KND_CD', 'EDU_STDR_CD', 'SCH_EDU_STDR_CD', 'SCH_EDU_STDR_YY'];
  void CLEAR_COLS;

  test.describe(`교육대상자관리(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 교육대상자관리 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육대상자관리  액터: 인사담당자
   * 예상결과: 인사담당자가 교육대상자관리 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_9311M 매핑(/mis/hrm/hrm9311/getCourseList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육대상자관리 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육대상자관리 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9311M-inte-no1.png`, fullPage: true });

    expect(rows.length, '교육대상자관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9312M — 교육대상자 기준코드 변경  |  API: POST /mis/hrm/hrm9312/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_9312M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_9312M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm9312/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM'];
  void CLEAR_COLS;

  test.describe(`교육대상자 기준코드 변경(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 교육대상자 기준코드 변경 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육대상자 기준코드 변경  액터: 인사담당자
   * 예상결과: 인사담당자가 교육대상자 기준코드 변경 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_9312M 매핑(/mis/hrm/hrm9312/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육대상자 기준코드 변경 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육대상자 기준코드 변경 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9312M-inte-no1.png`, fullPage: true });

    expect(rows.length, '교육대상자 기준코드 변경 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9320M — 교육이수등록(담당자)목록  |  API: POST /mis/hrm/hrm9320/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_9320M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_9320M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm9320/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_EDU_STDR_YY', 'SCH_EDU_KND_CD', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NM', 'SCH_EDU_CMP_FG', 'SCH_RQST_FG'];
  void CLEAR_COLS;

  test.describe(`교육이수등록(담당자)목록(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 교육이수등록(담당자)목록 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수등록(담당자)목록  액터: 인사담당자
   * 예상결과: 인사담당자가 교육이수등록(담당자)목록 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_9320M 매핑(/mis/hrm/hrm9320/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육이수등록(담당자)목록 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육이수등록(담당자)목록 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9320M-inte-no1.png`, fullPage: true });

    expect(rows.length, '교육이수등록(담당자)목록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9325M — 교육이수등록(담당자)  |  API: POST /mis/hrm/hrm9325/getData.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_9325M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_9325M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm9325/getData.do';
  const DS_LIST_NAME = 'ds_main';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['EDU_CMP_RNO', 'EDU_CMP_NO', 'EDU_STDR_YY', 'EDU_STDR_CD', 'EDU_CRS_CD', 'EDU_CRS_NM', 'EDU_KND_CD', 'EDU_KND_NM', 'EDU_FG_NM', 'EDU_FG_CD', 'EDU_MTHD_FG', 'EDU_MTHD_NM', 'EDU_NM', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'GRD_FG', 'GRD_NM', 'RGSTER_EMP_RID', 'RGSTER_NM', 'RGSTER_EMP_NO', 'RGSTER_DEPT_CD', 'RGSTER_DEPT_NM', 'EDU_CONT', 'EDU_FRM_DT', 'EDU_TO_DT', 'EDU_TIME', 'EDU_INSTT_NM', 'EDU_PLC', 'EDU_EXP', 'RTNC', 'RMK', 'REG_DT', 'FILE_GRP_ID', 'APV_STAT_FG', 'APV_STAT_NM'];
  void CLEAR_COLS;

  test.describe(`교육이수등록(담당자)(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 교육이수등록(담당자) - 상위 목록에서 항목 선택 → 상세 진입 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수등록(담당자)  액터: 인사담당자
   * 예상결과: 인사담당자가 상위 목록 화면에서 항목을 선택해 교육이수등록(담당자) 화면으로 진입하면 해당 단건 정보가 표시된다.
   * DB 확인: -- TODO: hrm_9325M 매핑(/mis/hrm/hrm9325/getData.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육이수등록(담당자) - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육이수등록(담당자) - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9325M-inte-no1.png`, fullPage: true });

    expect(rows.length, '교육이수등록(담당자) 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9330M — 교육이수현황  |  API: POST /mis/hrm/hrm9330/getList.do  |  TC 1건 (SELECT/UI)
// TODO(menuId): SYS_MENU_MGT에서 hrm_9330M 실제 menuId 조회 필요 (현재 플레이스홀더 M_MIS_XX_XX_XX -> 통합 테스트 실패함).
// TODO(dsList): 원본 dsListName="ds_list=ds_list" 파싱 불가 -> 'ds_list' 대체.
{
  const MENU_ID      = 'M_MIS_XX_XX_XX';
  const PGM_ID       = 'hrm_9330M';   // describe 제목 고유화 전용
  const API_URL      = '/mis/hrm/hrm9330/getList.do';
  const DS_LIST_NAME = 'ds_list';
  const RESULT_COLS  = [];
  const CLEAR_COLS   = ['SCH_EDU_YY', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NM', 'SCH_HLDF_FG', 'SCH_EMPO_STLF_FG', 'SCH_EDU_FG_CD', 'EMP_RID', 'EDU_CMP_RNO', 'EDU_RQST_RNO', 'DATA_FG', 'SNO'];
  void CLEAR_COLS;

  test.describe(`교육이수현황(${PGM_ID}) 통합 테스트`, () => {

  /**
   * [no:1] [통합] [SELECT] 교육이수현황 - 메뉴 진입 후 조회 조건 입력 → 목록 조회 (UI 통합)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수현황  액터: 인사담당자
   * 예상결과: 인사담당자가 교육이수현황 메뉴 진입 후 조회 조건을 입력하고 조회하면 그리드에 결과가 표시된다.
   * DB 확인: -- TODO: hrm_9330M 매핑(/mis/hrm/hrm9330/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육이수현황 - 전체 조회 (UI)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육이수현황 - 전체 조회 (UI)');
    logInput('검색조건', '없음');

    const formKey = await navigateToMenu(page, MENU_ID, API_URL, DS_LIST_NAME);
    const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST_NAME, RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9330M-inte-no1.png`, fullPage: true });

    expect(rows.length, '교육이수현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  });
}
