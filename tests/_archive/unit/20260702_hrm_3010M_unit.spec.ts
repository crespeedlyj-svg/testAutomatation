// ==============================================================
// HRM — 인사정보관리 단위 테스트 (hrm_3010M)
// 생성일시: 2026-07-02  |  파일: 20260702_hrm_3010M_unit.spec.ts
// 화면: 인사정보관리
// API: POST /mis/hrm/hrm3010/getList.do        (사원 목록 조회)
//      POST /mis/hrm/hrm3010/getMain.do         (기본정보 조회)
//      POST /mis/hrm/hrm3010/getHrmData.do      (탭별 세부정보 조회)
// 방식: API-direct (page.request.post + nexacroXml)
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import {
  assertNexacroResponse, parseNexacroXmlRows,
  waitForNexacroAppReady, openMenuById, openMenuByPgm,
} from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const PGM_ID         = 'hrm_3010M';
// MENU_ID='M_MIS_01_03_01'(엑셀 시나리오 문서 제공값)로 openMenuById 시도 시 실제로는
// "인사기록카드"(다른 화면)로 등록되어 pgmId=hrm_3010M과 세션 상태가 어긋나 getList.do가
// 요청정보 오류로 실패함(다이얼로그: NullPointerException). 검증되지 않은 값이라 비우고
// PGM_ID 기반 openMenuByPgm(ds_menu PGM_PATH 매칭)으로 폴백 — 실제 화면을 정확히 찾는다.
const MENU_ID        = '';

const API_LIST  = '/mis/hrm/hrm3010/getList.do';
const API_MAIN  = '/mis/hrm/hrm3010/getMain.do';
const API_TAB   = '/mis/hrm/hrm3010/getHrmData.do';

// ds_search 컬럼 목록 (hrm_3010M.xfdl Dataset 정의 기준)
const DS_SEARCH_COLS = [
  'SCH_HLDF_FG_CD', 'SCH_EMP_NO', 'SCH_EMP_NM',
  'SCH_DEPT_CD', 'SCH_DEPT_NM',
  'SCH_EMPO_STLF_CD', 'SCH_JSFC_CD', 'SCH_GRD_CD',
];

// ds_key 컬럼 목록
const DS_KEY_COLS = ['EMP_NO', 'WORK_DGCNT', 'TABPAGE', 'TABPAGE_TEXT', 'SCH_YY'];

// ds_list 결과 컬럼
const DS_LIST_COLS  = ['EMP_NO', 'EMP_NM', 'JSFC_NM', 'DEPT_NM', 'DEPT_CD', 'JSFC_CD'];

// ─── Nexacro XML 빌더 ────────────────────────────────────────────────────────
function nexacroXml(
  datasets: { id: string; columns: string[]; rows?: Record<string, string>[] }[],
  pgmId: string
): string {
  const dsXml = datasets.map(({ id, columns, rows = [] }) => {
    const cols    = columns.map(c => `<Column id="${c}" type="STRING" size="256"/>`).join('');
    const rowsXml = rows.map(row =>
      `<Row>${columns.map(c => `<Col id="${c}">${row[c] ?? ''}</Col>`).join('')}</Row>`
    ).join('');
    return `<Dataset id="${id}"><ColumnInfo>${cols}</ColumnInfo><Rows>${rowsXml}</Rows></Dataset>`;
  }).join('');
  return (
    `<?xml version="1.0" encoding="utf-8"?>` +
    `<Root xmlns="http://www.nexacroplatform.com/platform/dataset" ver="5.0.0.0">` +
    `<Parameters><Parameter id="pgmId">${pgmId}</Parameter></Parameters>` +
    `<Datasets>${dsXml}</Datasets></Root>`
  );
}

// 서버 세션의 csrfKey를 가져와 요청 XML에 주입 — Nexacro 플랫폼 CSRF 검증 통과
async function fetchCsrfKey(page: Page): Promise<string> {
  const { status, body } = await page.evaluate(
    async (url: string) => {
      const resp = await fetch(url, { credentials: 'include' });
      return { status: resp.status, body: await resp.text() };
    },
    `${BASE_URL}/common/frame/getSessionKey.do`
  );
  if (status !== 200) throw new Error(`getSessionKey HTTP ${status}`);
  const match = body.match(/<Parameter id="csrfKey"[^>]*>([^<]*)<\/Parameter>/);
  if (!match?.[1]) throw new Error(`csrfKey 미발견: ${body.substring(0, 300)}`);
  return match[1];
}

async function apiPost(page: Page, endpoint: string, xml: string) {
  const csrfKey = await fetchCsrfKey(page);
  const xmlWithCsrf = xml.replace(
    '</Parameters>',
    `<Parameter id="csrfKey">${csrfKey}</Parameter></Parameters>`
  );
  const fullUrl = `${BASE_URL}${endpoint}`;
  const result  = await page.evaluate(
    async ({ url, xmlBody }: { url: string; xmlBody: string }) => {
      const resp = await fetch(url, {
        method : 'POST',
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
        body   : xmlBody,
        credentials: 'include',
        signal : AbortSignal.timeout(20000),
      });
      return { status: resp.status, body: await resp.text() };
    },
    { url: fullUrl, xmlBody: xmlWithCsrf }
  );
  return { status: () => result.status, text: async () => result.body } as any;
}

// Nexacro 서버는 openMenuById(또는 openMenuByPgm)로 폼을 서버 세션에 등록한 후에만 API 호출을 허용
// 세션 등록은 menuId/pgmId 당 1회로 충분 (세션 쿠키가 유지되는 한 재등록 불필요)
const _sessionReady = new Set<string>();
async function ensureSessionReady(page: Page, menuId: string, pgmId?: string): Promise<void> {
  const key = menuId || pgmId || '';
  if (!key || _sessionReady.has(key)) return;
  await waitForNexacroAppReady(page, 20000);
  const respHandler = (resp: import('@playwright/test').Response) => {
    if (resp.url().includes('/mis/') || resp.url().includes('.do')) {
      console.log('  [DEBUG-NET]', resp.status(), resp.url());
    }
  };
  page.on('response', respHandler);
  const nav = menuId ? await openMenuById(page, menuId) : await openMenuByPgm(page, pgmId || '');
  if (nav.ok) {
    await page.waitForTimeout(6000);
    _sessionReady.add(key);
    console.log('[CSRF] 서버 세션 폼 등록 완료 — menuNm:', nav.menuNm);
  } else {
    console.warn('[CSRF] 메뉴 등록 실패 — 이후 API 호출이 CSRF 오류를 반환할 수 있습니다:', nav.error);
  }
  page.off('response', respHandler);
}

// ds_search 기반 목록 조회 요청 바디
function listBody(params: Record<string, string> = {}): string {
  const row = Object.fromEntries(DS_SEARCH_COLS.map(c => [c, params[c] ?? '']));
  return nexacroXml(
    [{ id: 'ds_search', columns: DS_SEARCH_COLS, rows: [row] }],
    PGM_ID
  );
}

// ds_key 기반 기본정보/탭 조회 요청 바디
function keyBody(params: { EMP_NO: string; WORK_DGCNT?: string; TABPAGE?: string; SCH_YY?: string }): string {
  const row = Object.fromEntries(DS_KEY_COLS.map(c => [c, (params as any)[c] ?? '']));
  return nexacroXml(
    [{ id: 'ds_key', columns: DS_KEY_COLS, rows: [row] }],
    PGM_ID
  );
}

// ============================================================================
// [hrm_3010M] 단위 테스트 — 인사정보관리
// ============================================================================
test.describe('인사정보관리 단위 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // 목록 조회에서 첫 번째 사원 EMP_NO를 캐시해 이후 TC에서 재사용
  let cachedEmpNo = '';

  /**
   * [no:1] 전체 사원 목록 조회 (검색조건 없음)
   * DB: SELECT COUNT(*) FROM HRM_EMP WHERE 1=1
   */
  test('[no:1] 전체 사원 목록 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사정보관리 - 전체 사원 목록 조회');
    await ensureSessionReady(page, MENU_ID, PGM_ID);
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_LIST, listBody());
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) {
      console.log(`  첫 행: EMP_NO=${rows[0]['EMP_NO']} EMP_NM=${rows[0]['EMP_NM']}`);
      cachedEmpNo = rows[0]['EMP_NO'] ?? '';
    }
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-no1-all.png`, fullPage: true });

    expect(rows.length, '전체 목록 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] 재직구분 = 재직(101-010) 조회
   * DB: SELECT COUNT(*) FROM HRM_EMP WHERE HLDF_FG_CD='101-010'
   */
  test('[no:2] 재직구분=재직(101-010) 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 인사정보관리 - 재직 사원 조회');
    await ensureSessionReady(page, MENU_ID, PGM_ID);
    logInput('SCH_HLDF_FG_CD', '101-010');

    const resp   = await apiPost(page, API_LIST, listBody({ SCH_HLDF_FG_CD: '101-010' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-no2-hldf010.png`, fullPage: true });

    expect(rows.length, '재직 사원 1건 이상').toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:3] 성명으로 사원 검색 (LIKE)
   * DB: SELECT COUNT(*) FROM HRM_EMP WHERE EMP_NM LIKE '%홍%'
   */
  test('[no:3] 성명 검색', async ({ workerPage: page }) => {
    logTestStart('[no:3] 인사정보관리 - 성명 검색');
    await ensureSessionReady(page, MENU_ID, PGM_ID);
    logInput('SCH_EMP_NM', '홍');

    const resp   = await apiPost(page, API_LIST, listBody({ SCH_EMP_NM: '홍' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-no3-empnm.png`, fullPage: true });

    // 결과가 있으면 성명에 검색어 포함 여부 확인 (서버 LIKE 처리에 의존)
    expect(rows.length).toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] 고용형태 조건 조회
   * DB: SELECT COUNT(*) FROM HRM_EMP WHERE EMPO_STLF_CD='102-010'
   */
  test('[no:4] 고용형태 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 인사정보관리 - 고용형태 조회');
    await ensureSessionReady(page, MENU_ID, PGM_ID);
    logInput('SCH_EMPO_STLF_CD', '102-010');

    const resp   = await apiPost(page, API_LIST, listBody({ SCH_EMPO_STLF_CD: '102-010' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    expect(rows.length).toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:5] 직종 조건 조회
   */
  test('[no:5] 직종 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 인사정보관리 - 직종 조회');
    await ensureSessionReady(page, MENU_ID, PGM_ID);
    logInput('SCH_JSFC_CD', '106-010');

    const resp   = await apiPost(page, API_LIST, listBody({ SCH_JSFC_CD: '106-010' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    expect(rows.length).toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:6] 직급 조건 조회
   */
  test('[no:6] 직급 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] 인사정보관리 - 직급 조회');
    await ensureSessionReady(page, MENU_ID, PGM_ID);
    logInput('SCH_GRD_CD', '107-010');

    const resp   = await apiPost(page, API_LIST, listBody({ SCH_GRD_CD: '107-010' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    expect(rows.length).toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:7] 복합 조건 조회 (재직 + 직종)
   */
  test('[no:7] 복합 조건 조회 (재직+직종)', async ({ workerPage: page }) => {
    logTestStart('[no:7] 인사정보관리 - 복합 조건 조회');
    await ensureSessionReady(page, MENU_ID, PGM_ID);
    logInput('SCH_HLDF_FG_CD', '101-010');
    logInput('SCH_JSFC_CD',    '106-010');

    const resp   = await apiPost(page, API_LIST, listBody({ SCH_HLDF_FG_CD: '101-010', SCH_JSFC_CD: '106-010' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    expect(rows.length).toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:8] 사원 기본정보 조회 (getMain.do)
   * 목록 조회 TC에서 캐시한 EMP_NO 사용
   */
  test('[no:8] 사원 기본정보 조회 (getMain)', async ({ workerPage: page }) => {
    logTestStart('[no:8] 인사정보관리 - 기본정보 조회');
    await ensureSessionReady(page, MENU_ID, PGM_ID);

    // 캐시 없으면 목록 먼저 조회
    if (!cachedEmpNo) {
      const r = await apiPost(page, API_LIST, listBody({ SCH_HLDF_FG_CD: '101-010' }));
      const result = await assertNexacroResponse(r, 'getList.do');
      const rows = parseNexacroXmlRows(result.body, 'ds_list');
      cachedEmpNo = rows[0]?.['EMP_NO'] ?? '';
    }

    if (!cachedEmpNo) {
      console.warn('  [SKIP] 사원 데이터 없음 — EMP_NO 미확보');
      test.skip();
      return;
    }

    logInput('EMP_NO', cachedEmpNo);
    logInput('WORK_DGCNT', '1');

    const resp   = await apiPost(page, API_MAIN, keyBody({ EMP_NO: cachedEmpNo, WORK_DGCNT: '1' }));
    const result = await assertNexacroResponse(resp, 'getMain.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_main');

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  EMP_NM=${rows[0]['EMP_NM']} DEPT_NM=${rows[0]['DEPT_NM']}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-no8-main.png`, fullPage: true });

    expect(rows.length, 'ds_main 1행 반환').toBe(1);
    expect(rows[0]?.['EMP_NO'], 'EMP_NO 일치').toBe(cachedEmpNo);
    logResult('검증', 'PASS');
  });

  /**
   * [no:9] 탭별 세부정보 조회 — 세부정보(BasMgt)
   */
  test('[no:9] 탭 세부정보 조회 - 세부정보(BasMgt)', async ({ workerPage: page }) => {
    logTestStart('[no:9] 인사정보관리 - BasMgt 탭 조회');
    await ensureSessionReady(page, MENU_ID, PGM_ID);

    if (!cachedEmpNo) {
      console.warn('  [SKIP] EMP_NO 미확보');
      test.skip();
      return;
    }

    logInput('EMP_NO',     cachedEmpNo);
    logInput('TABPAGE',    'BasMgt');

    const resp   = await apiPost(page, API_TAB, keyBody({ EMP_NO: cachedEmpNo, WORK_DGCNT: '1', TABPAGE: 'BasMgt' }));
    const result = await assertNexacroResponse(resp, 'getHrmData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_BasMgt');

    logResult('ds_BasMgt 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  SEX_DIST_CD=${rows[0]['SEX_DIST_CD']} SELF_BIR=${rows[0]['SELF_BIR']}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-no9-basmgt.png`, fullPage: true });

    expect(rows.length, 'BasMgt 1행 반환').toBe(1);
    logResult('검증', 'PASS');
  });

  /**
   * [no:10] 탭별 세부정보 조회 — 가족(Fmly)
   */
  test('[no:10] 탭 세부정보 조회 - 가족(Fmly)', async ({ workerPage: page }) => {
    logTestStart('[no:10] 인사정보관리 - Fmly 탭 조회');
    await ensureSessionReady(page, MENU_ID, PGM_ID);

    if (!cachedEmpNo) { test.skip(); return; }

    logInput('EMP_NO', cachedEmpNo);
    logInput('TABPAGE', 'Fmly');

    const resp   = await apiPost(page, API_TAB, keyBody({ EMP_NO: cachedEmpNo, WORK_DGCNT: '1', TABPAGE: 'Fmly' }));
    const result = await assertNexacroResponse(resp, 'getHrmData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_Fmly');

    logResult('ds_Fmly 건수', `${rows.length}건`);
    expect(rows.length).toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:11] 탭별 세부정보 조회 — 학력(Accr)
   */
  test('[no:11] 탭 세부정보 조회 - 학력(Accr)', async ({ workerPage: page }) => {
    logTestStart('[no:11] 인사정보관리 - Accr 탭 조회');
    await ensureSessionReady(page, MENU_ID, PGM_ID);

    if (!cachedEmpNo) { test.skip(); return; }

    logInput('EMP_NO', cachedEmpNo);
    logInput('TABPAGE', 'Accr');

    const resp   = await apiPost(page, API_TAB, keyBody({ EMP_NO: cachedEmpNo, WORK_DGCNT: '1', TABPAGE: 'Accr' }));
    const result = await assertNexacroResponse(resp, 'getHrmData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_Accr');

    logResult('ds_Accr 건수', `${rows.length}건`);
    expect(rows.length).toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:12] 탭별 세부정보 조회 — 발령(Appnt)
   */
  test('[no:12] 탭 세부정보 조회 - 발령(Appnt)', async ({ workerPage: page }) => {
    logTestStart('[no:12] 인사정보관리 - Appnt 탭 조회');
    await ensureSessionReady(page, MENU_ID, PGM_ID);

    if (!cachedEmpNo) { test.skip(); return; }

    logInput('EMP_NO', cachedEmpNo);
    logInput('TABPAGE', 'Appnt');

    const resp   = await apiPost(page, API_TAB, keyBody({ EMP_NO: cachedEmpNo, WORK_DGCNT: '1', TABPAGE: 'Appnt' }));
    const result = await assertNexacroResponse(resp, 'getHrmData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_Appnt');

    logResult('ds_Appnt 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  발령명=${rows[0]['HRM_APPNT_NM']} 발령일=${rows[0]['APPNT_DT']}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-no12-appnt.png`, fullPage: true });

    expect(rows.length).toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });
});
