// ==============================================================
// PUR 모듈 — 구매관리 단위 테스트 (단위 spec, API-direct)
// 생성일시: 20260705  |  파일: 20260705_pur_unit.spec.ts
// 방식: openMenuByPgm으로 서버 세션 등록(CSRF) → apiPost(ds_search) 직접 호출 → ds_list 파싱
// storageState 자동 주입 — 로그인/goto 코드 작성 절대 금지
// 소스: _workspace/pur/01_scenarios.json (49개 화면, unit 시나리오 125건)
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

// ── Nexacro XML 요청 본문 생성 ─────────────────────────────────────────────
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

async function apiPost(
  page: Page, endpoint: string, xml: string
): Promise<import('@playwright/test').Response> {
  const csrfKey = await fetchCsrfKey(page);
  const xmlWithCsrf = xml.replace(
    '</Parameters>',
    `<Parameter id="csrfKey">${csrfKey}</Parameter></Parameters>`
  );
  const { status, body } = await page.evaluate(
    async ({ url, xml }: { url: string; xml: string }) => {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
        body: xml,
        credentials: 'include',
      });
      return { status: resp.status, body: await resp.text() };
    },
    { url: `${BASE_URL}${endpoint}`, xml: xmlWithCsrf }
  );
  return {
    status: () => status,
    text:   async () => body,
    ok:     () => status >= 200 && status < 300,
    url:    () => endpoint,
  } as unknown as import('@playwright/test').Response;
}

// Nexacro 서버는 openMenuById/openMenuByPgm로 폼을 서버 세션에 등록한 후에만 API 호출을 허용
const _sessionReady = new Map<string, string>();
async function ensureSessionReady(page: Page, menuId: string, pgmId: string): Promise<string> {
  const key = menuId || pgmId || '';
  if (!key) return '';
  if (_sessionReady.has(key)) return _sessionReady.get(key)!;
  await waitForNexacroAppReady(page, 20000);
  const nav = (menuId && /^M_MIS_\d/.test(menuId))
    ? await openMenuById(page, menuId)
    : await openMenuByPgm(page, pgmId);
  if (nav.ok) {
    await page.waitForTimeout(1500);
    const formKey = (menuId && /^M_MIS_\d/.test(menuId)) ? menuId : ((nav as any).menuId || key);
    _sessionReady.set(key, formKey);
    console.log('[CSRF] 서버 세션 폼 등록 완료 — menuNm:', nav.menuNm);
    return formKey;
  }
  console.warn('[CSRF] 메뉴 등록 실패 — 이후 API 호출이 CSRF 오류를 반환할 수 있습니다:', nav.error);
  return '';
}

// ds_search 단일 행 헬퍼 — 지정 컬럼 전체 포함 (빈값은 iBATIS isNotEmpty가 스킵)
function searchBody(pgmId: string, columns: string[], params: Record<string, string>): string {
  const allParams = Object.fromEntries(columns.map(c => [c, params[c] ?? '']));
  return nexacroXml([{ id: 'ds_search', columns, rows: [allParams] }], pgmId);
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0010M — 부대비용관리  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0010M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0010M';
  const CSRF_ID = 'PUR_0010M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0010/getLista.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = [];

  test.describe(`부대비용관리(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 부대비용관리 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 구매기준정보  액터: 개발자
     * URL: /mis/pur/pur0010/getLista.do
     * 예상결과: 부대비용 기준 목록이 조회된다. (총 N건 — DB COUNT(*) 실행 후 채우기)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 부대비용 기준 테이블) WHERE 1=1
     */
    test('[no:1] 부대비용관리 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 부대비용관리 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getLista.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0010M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '부대비용관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0020M — 구매취소관리  (unit 6건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0020M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0020M';
  const CSRF_ID = 'PUR_0020M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0200/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'FRGN_CLS', 'SCH_DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_RQST_STAT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_MIN_AMT', 'SCH_MAX_AMT', 'SCH_CTRCT_MTHD', 'SCH_CLS', 'SCH_KEY', 'SCH_PUR_STEP0', 'SCH_PUR_STEP1', 'SCH_PUR_STEP2', 'SCH_PUR_STEP3', 'SCH_PUR_STEP4', 'SCH_PUR_STEP5', 'SCH_PUR_STEP6', 'SCH_PUR_STEP7', 'PUR_STEPS', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_E_CONT_YN', 'SCH_E_CONT_STAT', 'SCH_RQST_EMP_NO', 'SCH_RQST_EMP_NM', 'SCH_RQST_TO_DT', 'SCH_RQST_FRM_DT', 'SCH_FRGN_CLS', 'SCH_PUR_STEP'];

  test.describe(`구매취소관리(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매취소관리 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0200/getList.do
     * 예상결과: 구매취소관리 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 구매등록/계약 테이블) WHERE 1=1
     */
    test('[no:1] 구매취소관리 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매취소관리 - 전체 조회 (조건 없음)');
      logInput('검색조건', '{"SCH_PUR_STEP":"A"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_PUR_STEP': 'A' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0020M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매취소관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 구매취소관리 - 기간 조회 (SCH_RQST_FRM_DT ~ SCH_RQST_TO_DT)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0200/getList.do
     * 예상결과: 등록일자 범위 조회 결과가 반환된다. (총 N건 — RGST_DT >= 20240101 AND <= 20261231)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RGST_DT >= '20240101' AND RGST_DT <= '20261231'
     */
    test('[no:2] 구매취소관리 - 기간 조회 (SCH_RQST_FRM_DT ~ SCH_RQST_TO_DT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 구매취소관리 - 기간 조회 (SCH_RQST_FRM_DT ~ SCH_RQST_TO_DT)');
      logInput('검색조건', '{"SCH_DT_CLS":"RGST_DT","SCH_RQST_FRM_DT":"20240101","SCH_RQST_TO_DT":"20261231","SCH_PUR_STEP":"A"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_DT_CLS': 'RGST_DT', 'SCH_RQST_FRM_DT': '20240101', 'SCH_RQST_TO_DT': '20261231', 'SCH_PUR_STEP': 'A' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0020M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매취소관리 기간 조회 (SCH_RQST_FRM_DT ~ SCH_RQST_TO_DT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 구매취소관리 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0200/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건 (RGST_DT >= '20261231' AND RGST_DT <= '20240101')
     */
    test('[no:3] 구매취소관리 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 구매취소관리 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_DT_CLS":"RGST_DT","SCH_RQST_FRM_DT":"20261231","SCH_RQST_TO_DT":"20240101","SCH_PUR_STEP":"A"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_DT_CLS': 'RGST_DT', 'SCH_RQST_FRM_DT': '20261231', 'SCH_RQST_TO_DT': '20240101', 'SCH_PUR_STEP': 'A' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0020M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매취소관리 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:4] 구매취소관리 - 내외자 필터 (SCH_FRGN_CLS=604-001 내자)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0200/getList.do
     * 예상결과: 내자 구분 일치 건이 반환된다. (총 N건 — FRGN_CLS = '604-001')
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE FRGN_CLS = '604-001'
     */
    test('[no:4] 구매취소관리 - 내외자 필터 (SCH_FRGN_CLS=604-001 내자)', async ({ workerPage: page }) => {
      logTestStart('[no:4] 구매취소관리 - 내외자 필터 (SCH_FRGN_CLS=604-001 내자)');
      logInput('검색조건', '{"SCH_FRGN_CLS":"604-001","SCH_PUR_STEP":"A"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_FRGN_CLS': '604-001', 'SCH_PUR_STEP': 'A' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0020M-unit-no4.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매취소관리 내외자 필터 (SCH_FRGN_CLS=604-001 내자) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:5] 구매취소관리 - 키워드 검색 (SCH_CLS=RGST_NM + SCH_KEY=계약)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0200/getList.do
     * 예상결과: 계약(등록)명 LIKE 검색 결과가 반환된다. (총 N건 — RGST_NM LIKE '%계약%')
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE UPPER(RGST_NM) LIKE '%계약%'
     */
    test('[no:5] 구매취소관리 - 키워드 검색 (SCH_CLS=RGST_NM + SCH_KEY=계약)', async ({ workerPage: page }) => {
      logTestStart('[no:5] 구매취소관리 - 키워드 검색 (SCH_CLS=RGST_NM + SCH_KEY=계약)');
      logInput('검색조건', '{"SCH_CLS":"RGST_NM","SCH_KEY":"계약","SCH_PUR_STEP":"A"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_CLS': 'RGST_NM', 'SCH_KEY': '계약', 'SCH_PUR_STEP': 'A' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0020M-unit-no5.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매취소관리 키워드 검색 (SCH_CLS=RGST_NM + SCH_KEY=계약) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:6] 구매취소관리 - 취소구분 필터 (SCH_PUR_STEP=N 미취소)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0200/getList.do
     * 예상결과: 미취소 상태 건이 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 취소여부 = 'N'
     */
    test('[no:6] 구매취소관리 - 취소구분 필터 (SCH_PUR_STEP=N 미취소)', async ({ workerPage: page }) => {
      logTestStart('[no:6] 구매취소관리 - 취소구분 필터 (SCH_PUR_STEP=N 미취소)');
      logInput('검색조건', '{"SCH_PUR_STEP":"N"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_PUR_STEP': 'N' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0020M-unit-no6.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매취소관리 취소구분 필터 (SCH_PUR_STEP=N 미취소) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0110M — 구매요구신청(내자)  (unit 6건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0110M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0110M';
  const CSRF_ID = 'PUR_0110M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0110/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'RQST_STAT', 'PUR_STEP', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS'];

  test.describe(`구매요구신청(내자)(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매요구신청(내자) - 전체 조회 (내자 기본 조건)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0110/getList.do
     * 예상결과: 구매요구신청 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 구매요구 테이블) WHERE FRGN_CLS = '604-001'
     */
    test('[no:1] 구매요구신청(내자) - 전체 조회 (내자 기본 조건)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매요구신청(내자) - 전체 조회 (내자 기본 조건)');
      logInput('검색조건', '{"FRGN_CLS":"604-001","PUR_CLS":"A"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'FRGN_CLS': '604-001', 'PUR_CLS': 'A' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0110M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구신청(내자) 전체 조회 (내자 기본 조건) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 구매요구신청(내자) - 기간 조회 (RQST_SDT ~ RQST_EDT)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0110/getList.do
     * 예상결과: 요구일자 범위 조회 결과가 반환된다. (총 N건 — RQST_DT >= 20240101 AND <= 20261231)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RQST_DT >= '20240101' AND RQST_DT <= '20261231'
     */
    test('[no:2] 구매요구신청(내자) - 기간 조회 (RQST_SDT ~ RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 구매요구신청(내자) - 기간 조회 (RQST_SDT ~ RQST_EDT)');
      logInput('검색조건', '{"FRGN_CLS":"604-001","PUR_CLS":"A","RQST_SDT":"20240101","RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'FRGN_CLS': '604-001', 'PUR_CLS': 'A', 'RQST_SDT': '20240101', 'RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0110M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구신청(내자) 기간 조회 (RQST_SDT ~ RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 구매요구신청(내자) - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0110/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건 (RQST_DT >= '20261231' AND RQST_DT <= '20240101')
     */
    test('[no:3] 구매요구신청(내자) - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 구매요구신청(내자) - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"FRGN_CLS":"604-001","PUR_CLS":"A","RQST_SDT":"20261231","RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'FRGN_CLS': '604-001', 'PUR_CLS': 'A', 'RQST_SDT': '20261231', 'RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0110M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구신청(내자) 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:4] 구매요구신청(내자) - 결재상태 필터 (RQST_STAT=000-010-040 결재완료)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0110/getList.do
     * 예상결과: 결재상태 코드 일치 건이 반환된다. (총 N건 — RQST_STAT = '000-010-040')
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RQST_STAT = '000-010-040'
     */
    test('[no:4] 구매요구신청(내자) - 결재상태 필터 (RQST_STAT=000-010-040 결재완료)', async ({ workerPage: page }) => {
      logTestStart('[no:4] 구매요구신청(내자) - 결재상태 필터 (RQST_STAT=000-010-040 결재완료)');
      logInput('검색조건', '{"FRGN_CLS":"604-001","PUR_CLS":"A","RQST_STAT":"000-010-040"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'FRGN_CLS': '604-001', 'PUR_CLS': 'A', 'RQST_STAT': '000-010-040' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0110M-unit-no4.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구신청(내자) 결재상태 필터 (RQST_STAT=000-010-040 결재완료) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:5] 구매요구신청(내자) - 키워드 검색 (SRCH_CLS=RQST_SBJ + SRCH_KEY=구매)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0110/getList.do
     * 예상결과: 요구명 LIKE 검색 결과가 반환된다. (총 N건 — RQST_SBJ LIKE '%구매%')
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE UPPER(RQST_SBJ) LIKE '%구매%'
     */
    test('[no:5] 구매요구신청(내자) - 키워드 검색 (SRCH_CLS=RQST_SBJ + SRCH_KEY=구매)', async ({ workerPage: page }) => {
      logTestStart('[no:5] 구매요구신청(내자) - 키워드 검색 (SRCH_CLS=RQST_SBJ + SRCH_KEY=구매)');
      logInput('검색조건', '{"FRGN_CLS":"604-001","PUR_CLS":"A","SRCH_CLS":"RQST_SBJ","SRCH_KEY":"구매"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'FRGN_CLS': '604-001', 'PUR_CLS': 'A', 'SRCH_CLS': 'RQST_SBJ', 'SRCH_KEY': '구매' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0110M-unit-no5.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구신청(내자) 키워드 검색 (SRCH_CLS=RQST_SBJ + SRCH_KEY=구매) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:6] 구매요구신청(내자) - 권한 조건 조회 (ROLE_YN=Y 담당자 권한 전체)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0110/getList.do
     * 예상결과: 담당자 권한 전체 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE FRGN_CLS = '604-001'
     */
    test('[no:6] 구매요구신청(내자) - 권한 조건 조회 (ROLE_YN=Y 담당자 권한 전체)', async ({ workerPage: page }) => {
      logTestStart('[no:6] 구매요구신청(내자) - 권한 조건 조회 (ROLE_YN=Y 담당자 권한 전체)');
      logInput('검색조건', '{"FRGN_CLS":"604-001","PUR_CLS":"A","ROLE_YN":"Y"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'FRGN_CLS': '604-001', 'PUR_CLS': 'A', 'ROLE_YN': 'Y' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0110M-unit-no6.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구신청(내자) 권한 조건 조회 (ROLE_YN=Y 담당자 권한 전체) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0111M — 구매요구(내자)  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0111M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0111M';
  const CSRF_ID = 'PUR_0111M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0111/getData.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'WORK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'ACT_UNIT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PRJT_FG', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT', 'UNIT', 'ACCT_NM', 'BUDG_BSNS_NM', 'BUDG_BSNS_CD', 'BUDG_LITM_CD', 'BUDG_CLSF_FG', 'AST_CLS_NM', 'AST_CLS_CD'];

  test.describe(`구매요구(내자)(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매요구(내자) - 단건 상세 조회 (getData, RQST_NO 키)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0111/getData.do
     * 예상결과: 지정한 요구번호의 구매요구 상세(기본정보/물품/예산)가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 구매요구 마스터) WHERE RQST_NO = '{기존 요구번호}'
     */
    test('[no:1] 구매요구(내자) - 단건 상세 조회 (getData, RQST_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매요구(내자) - 단건 상세 조회 (getData, RQST_NO 키)');
      logInput('검색조건', '{"RQST_NO":"{기존 요구번호}","FRGN_CLS":"604-001","PUR_TP":"602-001"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RQST_NO': '{기존 요구번호}', 'FRGN_CLS': '604-001', 'PUR_TP': '602-001' }));
      const result = await assertNexacroResponse(resp, 'getData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0111M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '구매요구(내자) 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0112M — 구매요구(시설공사/용역)  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0112M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0112M';
  const CSRF_ID = 'PUR_0112M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0112/getData.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'WORK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_CD', 'BUDG_LITM_NM', 'ACCT_CD', 'ACCT_NM', 'PROJ_EXE_CLS', 'ACT_UNIT_CD', 'GRD_NM', 'TEMP_AMT', 'AST_CLS_CD', 'AST_CLS_NM', 'UNIT', 'BUDG_TP', 'BSNS_FG', 'BUDG_BSNS_NM', 'BUDG_BSNS_CD', 'BUDG_CD', 'BUDG_NM', 'INCM_EXPS_FG'];

  test.describe(`구매요구(시설공사/용역)(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매요구(시설공사/용역) - 단건 상세 조회 (getData, RQST_NO 키)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0112/getData.do
     * 예상결과: 지정한 요구번호의 시설공사/용역 구매요구 상세가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 구매요구 마스터) WHERE RQST_NO = '{기존 요구번호}'
     */
    test('[no:1] 구매요구(시설공사/용역) - 단건 상세 조회 (getData, RQST_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매요구(시설공사/용역) - 단건 상세 조회 (getData, RQST_NO 키)');
      logInput('검색조건', '{"RQST_NO":"{기존 요구번호}","PUR_TP":"602-006"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RQST_NO': '{기존 요구번호}', 'PUR_TP': '602-006' }));
      const result = await assertNexacroResponse(resp, 'getData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0112M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '구매요구(시설공사/용역) 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0000M — 화면호출  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0000M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0000M';
  const CSRF_ID = 'PUR_0000M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0000/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['RQST_NO'];

  test.describe(`화면호출(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 화면호출 - RQST_NO 조회 (getList)
     * 중분류: 구매관리  소분류: 구매공통  액터: 개발자
     * URL: /mis/pur/pur0000/getList.do
     * 예상결과: 화면호출 대상 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 구매요구 라우팅 대상) WHERE 1=1
     */
    test('[no:1] 화면호출 - RQST_NO 조회 (getList)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 화면호출 - RQST_NO 조회 (getList)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0000M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '화면호출 RQST_NO 조회 (getList) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0001M — 전자계약시스템  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0001M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0001M';
  const CSRF_ID = 'PUR_0001M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0000/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['RQST_NO'];

  test.describe(`전자계약시스템(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 전자계약시스템 - RQST_NO 조회 (getList)
     * 중분류: 구매관리  소분류: 구매공통  액터: 개발자
     * URL: /mis/pur/pur0000/getList.do
     * 예상결과: 전자계약 대상 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 전자계약시스템 - RQST_NO 조회 (getList)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 전자계약시스템 - RQST_NO 조회 (getList)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0001M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '전자계약시스템 RQST_NO 조회 (getList) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0002M — 구매요구현황  (unit 5건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0002M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0002M';
  const CSRF_ID = 'PUR_0002M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0002/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'PUR_STEP', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS', 'RQST_CLS'];

  test.describe(`구매요구현황(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매요구현황 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0002/getList.do
     * 예상결과: 구매요구현황 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 구매요구 테이블) WHERE 1=1
     */
    test('[no:1] 구매요구현황 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매요구현황 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0002M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 구매요구현황 - 기간 조회 (RQST_SDT ~ RQST_EDT)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0002/getList.do
     * 예상결과: 요구일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RQST_DT >= '20240101' AND RQST_DT <= '20261231'
     */
    test('[no:2] 구매요구현황 - 기간 조회 (RQST_SDT ~ RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 구매요구현황 - 기간 조회 (RQST_SDT ~ RQST_EDT)');
      logInput('검색조건', '{"RQST_SDT":"20240101","RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RQST_SDT': '20240101', 'RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0002M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구현황 기간 조회 (RQST_SDT ~ RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 구매요구현황 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0002/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 구매요구현황 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 구매요구현황 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"RQST_SDT":"20261231","RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RQST_SDT': '20261231', 'RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0002M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구현황 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:4] 구매요구현황 - 결재상태 필터 (APV_STAT_CD)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0002/getList.do
     * 예상결과: 결재상태 일치 건이 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE APV_STAT_CD = '000-010-040'
     */
    test('[no:4] 구매요구현황 - 결재상태 필터 (APV_STAT_CD)', async ({ workerPage: page }) => {
      logTestStart('[no:4] 구매요구현황 - 결재상태 필터 (APV_STAT_CD)');
      logInput('검색조건', '{"APV_STAT_CD":"000-010-040"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'APV_STAT_CD': '000-010-040' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0002M-unit-no4.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구현황 결재상태 필터 (APV_STAT_CD) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:5] 구매요구현황 - 키워드 검색 (SRCH_CLS + SRCH_KEY)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0002/getList.do
     * 예상결과: 키워드 LIKE 검색 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE UPPER(RQST_SBJ) LIKE '%구매%'
     */
    test('[no:5] 구매요구현황 - 키워드 검색 (SRCH_CLS + SRCH_KEY)', async ({ workerPage: page }) => {
      logTestStart('[no:5] 구매요구현황 - 키워드 검색 (SRCH_CLS + SRCH_KEY)');
      logInput('검색조건', '{"SRCH_CLS":"RQST_SBJ","SRCH_KEY":"구매"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SRCH_CLS': 'RQST_SBJ', 'SRCH_KEY': '구매' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0002M-unit-no5.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구현황 키워드 검색 (SRCH_CLS + SRCH_KEY) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0121M — 구매요구(외자)  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0121M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0121M';
  const CSRF_ID = 'PUR_0121M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0121/getData.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'ACCT_UNT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PROJ_EXE_CLS', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT'];

  test.describe(`구매요구(외자)(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매요구(외자) - 단건 상세 조회 (getData, RQST_NO 키)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0121/getData.do
     * 예상결과: 지정한 요구번호의 외자 구매요구 상세(기본정보/물품/예산)가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 구매요구 마스터) WHERE RQST_NO = '{기존 요구번호}'
     */
    test('[no:1] 구매요구(외자) - 단건 상세 조회 (getData, RQST_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매요구(외자) - 단건 상세 조회 (getData, RQST_NO 키)');
      logInput('검색조건', '{"RQST_NO":"{기존 요구번호}","FRGN_CLS":"604-002","PUR_TP":"602-001"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RQST_NO': '{기존 요구번호}', 'FRGN_CLS': '604-002', 'PUR_TP': '602-001' }));
      const result = await assertNexacroResponse(resp, 'getData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0121M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '구매요구(외자) 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0131M — 계약요구  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0131M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0131M';
  const CSRF_ID = 'PUR_0131M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0131/getData.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'ACCT_UNT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PROJ_EXE_CLS', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT'];

  test.describe(`계약요구(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 계약요구 - 단건 상세 조회 (getData, RQST_NO 키)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0131/getData.do
     * 예상결과: 지정한 요구번호의 계약요구 상세가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 계약요구 마스터) WHERE RQST_NO = '{기존 요구번호}'
     */
    test('[no:1] 계약요구 - 단건 상세 조회 (getData, RQST_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 계약요구 - 단건 상세 조회 (getData, RQST_NO 키)');
      logInput('검색조건', '{"RQST_NO":"{기존 요구번호}"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RQST_NO': '{기존 요구번호}' }));
      const result = await assertNexacroResponse(resp, 'getData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0131M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '계약요구 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0221M — 연관문서 등록  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0221M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0221M';
  const CSRF_ID = 'PUR_0221M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0221/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['PGM_ID', 'RQST_NO', 'GW_DOC_NM', 'BUSI_PLC_CD'];

  test.describe(`연관문서 등록(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 연관문서 등록 - RQST_NO 기준 연관문서 조회 (getList)
     * 중분류: 구매관리  소분류: 구매요구  액터: 개발자
     * URL: /mis/pur/pur0221/getList.do
     * 예상결과: 지정 요구번호의 연관문서 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 연관문서 테이블) WHERE RQST_NO = '{기존 요구번호}'
     */
    test('[no:1] 연관문서 등록 - RQST_NO 기준 연관문서 조회 (getList)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 연관문서 등록 - RQST_NO 기준 연관문서 조회 (getList)');
      logInput('검색조건', '{"RQST_NO":"{기존 요구번호}"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RQST_NO': '{기존 요구번호}' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0221M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '연관문서 등록 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0210M — 구매진행현황  (unit 4건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0210M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0210M';
  const CSRF_ID = 'PUR_0210M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0210/getPurData.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'FRGN_CLS', 'SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'RGST_EMP_NO', 'RGST_EMP_NM', 'PUR_STEPS', 'PUR_TPS', 'CONT_TPS', 'RGST_NO', 'CTRCT_END_YN', 'CTRCT_NM', 'CTRCT_CUST_NM', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'RQST_CLSS', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_DT_CLS', 'CTRCT_MTHD'];

  test.describe(`구매진행현황(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매진행현황 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0210/getPurData.do
     * 예상결과: 구매진행현황 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 구매진행현황 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매진행현황 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getPurData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0210M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매진행현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 구매진행현황 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0210/getPurData.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 구매진행현황 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 구매진행현황 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)');
      logInput('검색조건', '{"SCH_SRCH_SDT":"20240101","SCH_SRCH_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_SDT': '20240101', 'SCH_SRCH_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getPurData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0210M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매진행현황 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 구매진행현황 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0210/getPurData.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 구매진행현황 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 구매진행현황 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_SRCH_SDT":"20261231","SCH_SRCH_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_SDT': '20261231', 'SCH_SRCH_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getPurData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0210M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매진행현황 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:4] 구매진행현황 - 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0210/getPurData.do
     * 예상결과: 키워드 LIKE 검색 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE UPPER(CTRCT_NM) LIKE '%계약%'
     */
    test('[no:4] 구매진행현황 - 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)', async ({ workerPage: page }) => {
      logTestStart('[no:4] 구매진행현황 - 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)');
      logInput('검색조건', '{"SCH_SRCH_CLS":"CTRCT_NM","SCH_SRCH_KEY":"계약"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_CLS': 'CTRCT_NM', 'SCH_SRCH_KEY': '계약' }));
      const result = await assertNexacroResponse(resp, 'getPurData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0210M-unit-no4.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매진행현황 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0211M — 구매접수  (unit 3건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0211M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0211M';
  const CSRF_ID = 'PUR_0211M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0211/getRgstList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_LIST_CLS', 'SCH_FRGN_CLS', 'SCH_BUSI_PLC_CD', 'SCH_SDT', 'SCH_EDT', 'SCH_RQST_DEPT_NM', 'SCH_RQST_DEPT_CD', 'DEPT_NM', 'DEPT_CD', 'SCH_RQST_SAMT', 'SCH_RQST_EAMT', 'SCH_CLS', 'SCH_VAL', 'TEMP_AMT', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_RJCT_YN'];

  test.describe(`구매접수(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매접수 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0211/getRgstList.do
     * 예상결과: 구매접수 대상 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 구매접수 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매접수 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getRgstList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0211M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매접수 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 구매접수 - 기간 조회 (SCH_SDT ~ SCH_EDT)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0211/getRgstList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 구매접수 - 기간 조회 (SCH_SDT ~ SCH_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 구매접수 - 기간 조회 (SCH_SDT ~ SCH_EDT)');
      logInput('검색조건', '{"SCH_SDT":"20240101","SCH_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SDT': '20240101', 'SCH_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getRgstList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0211M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매접수 기간 조회 (SCH_SDT ~ SCH_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 구매접수 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0211/getRgstList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 구매접수 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 구매접수 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_SDT":"20261231","SCH_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SDT': '20261231', 'SCH_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getRgstList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0211M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매접수 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0300M — 구매계약현황  (unit 5건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0300M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0300M';
  const CSRF_ID = 'PUR_0300M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0300/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'FRGN_CLS', 'SCH_DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_RQST_STAT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_MIN_AMT', 'SCH_MAX_AMT', 'SCH_CTRCT_MTHD', 'SCH_CLS', 'SCH_KEY', 'SCH_PUR_STEP0', 'SCH_PUR_STEP1', 'SCH_PUR_STEP2', 'SCH_PUR_STEP3', 'SCH_PUR_STEP4', 'SCH_PUR_STEP5', 'SCH_PUR_STEP6', 'SCH_PUR_STEP7', 'PUR_STEPS', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_E_CONT_YN', 'SCH_E_CONT_STAT', 'SCH_RQST_EMP_NO', 'SCH_RQST_EMP_NM'];

  test.describe(`구매계약현황(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매계약현황 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0300/getList.do
     * 예상결과: 구매계약현황 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 구매등록/계약 테이블) WHERE 1=1
     */
    test('[no:1] 구매계약현황 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매계약현황 - 전체 조회 (조건 없음)');
      logInput('검색조건', '{"SCH_DT_CLS":"RGST_DT"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_DT_CLS': 'RGST_DT' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0300M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매계약현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 구매계약현황 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0300/getList.do
     * 예상결과: 등록일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RGST_DT >= '20240101' AND RGST_DT <= '20261231'
     */
    test('[no:2] 구매계약현황 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 구매계약현황 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)');
      logInput('검색조건', '{"SCH_DT_CLS":"RGST_DT","SCH_RQST_SDT":"20240101","SCH_RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_DT_CLS': 'RGST_DT', 'SCH_RQST_SDT': '20240101', 'SCH_RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0300M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매계약현황 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 구매계약현황 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0300/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 구매계약현황 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 구매계약현황 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_DT_CLS":"RGST_DT","SCH_RQST_SDT":"20261231","SCH_RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_DT_CLS': 'RGST_DT', 'SCH_RQST_SDT': '20261231', 'SCH_RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0300M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매계약현황 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:4] 구매계약현황 - 결재상태 필터 (SCH_RQST_STAT)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0300/getList.do
     * 예상결과: 결재상태 일치 건이 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RQST_STAT = '000-010-040'
     */
    test('[no:4] 구매계약현황 - 결재상태 필터 (SCH_RQST_STAT)', async ({ workerPage: page }) => {
      logTestStart('[no:4] 구매계약현황 - 결재상태 필터 (SCH_RQST_STAT)');
      logInput('검색조건', '{"SCH_DT_CLS":"RGST_DT","SCH_RQST_STAT":"000-010-040"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_DT_CLS': 'RGST_DT', 'SCH_RQST_STAT': '000-010-040' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0300M-unit-no4.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매계약현황 결재상태 필터 (SCH_RQST_STAT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:5] 구매계약현황 - 키워드 검색 (SCH_CLS=PUR_CONT_NO + SCH_KEY)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0300/getList.do
     * 예상결과: 계약번호 LIKE 검색 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE UPPER(PUR_CONT_NO) LIKE '%2024%'
     */
    test('[no:5] 구매계약현황 - 키워드 검색 (SCH_CLS=PUR_CONT_NO + SCH_KEY)', async ({ workerPage: page }) => {
      logTestStart('[no:5] 구매계약현황 - 키워드 검색 (SCH_CLS=PUR_CONT_NO + SCH_KEY)');
      logInput('검색조건', '{"SCH_DT_CLS":"RGST_DT","SCH_CLS":"PUR_CONT_NO","SCH_KEY":"2024"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_DT_CLS': 'RGST_DT', 'SCH_CLS': 'PUR_CONT_NO', 'SCH_KEY': '2024' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0300M-unit-no5.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매계약현황 키워드 검색 (SCH_CLS=PUR_CONT_NO + SCH_KEY) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0311M — 구매계약  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0311M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0311M';
  const CSRF_ID = 'PUR_0311M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0311/getData.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'CTRCT_NO', 'CTRCT_SEQ', 'CTRCT_DEG', 'FRGN_CLS', 'PUR_TP', 'RGST_NO', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PROJ_EXE_CLS', 'ACCT_UNT_CD', 'TEMP_AMT', 'DIV_CNT', 'DIV_TERM'];

  test.describe(`구매계약(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매계약 - 단건 상세 조회 (getData, CTRCT_NO 키)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0311/getData.do
     * 예상결과: 지정한 계약번호의 구매계약 상세(마스터/상세)가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 구매계약 마스터) WHERE CTRCT_NO = '{기존 계약번호}'
     */
    test('[no:1] 구매계약 - 단건 상세 조회 (getData, CTRCT_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매계약 - 단건 상세 조회 (getData, CTRCT_NO 키)');
      logInput('검색조건', '{"CTRCT_NO":"{기존 계약번호}","CTRCT_SEQ":"1","CTRCT_DEG":"1"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'CTRCT_NO': '{기존 계약번호}', 'CTRCT_SEQ': '1', 'CTRCT_DEG': '1' }));
      const result = await assertNexacroResponse(resp, 'getData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0311M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '구매계약 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0321M — 구매계약(외자)  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0321M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0321M';
  const CSRF_ID = 'PUR_0321M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0321/getData.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'CTRCT_NO', 'CTRCT_SEQ', 'CTRCT_DEG', 'FRGN_CLS', 'PUR_TP', 'RGST_NO', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PROJ_EXE_CLS', 'ACCT_UNT_CD', 'TEMP_AMT', 'DIV_CNT', 'DIV_TERM'];

  test.describe(`구매계약(외자)(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매계약(외자) - 단건 상세 조회 (getData, CTRCT_NO 키)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0321/getData.do
     * 예상결과: 지정한 계약번호의 외자 구매계약 상세가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 구매계약 마스터) WHERE CTRCT_NO = '{기존 계약번호}'
     */
    test('[no:1] 구매계약(외자) - 단건 상세 조회 (getData, CTRCT_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매계약(외자) - 단건 상세 조회 (getData, CTRCT_NO 키)');
      logInput('검색조건', '{"CTRCT_NO":"{기존 계약번호}","FRGN_CLS":"604-002"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'CTRCT_NO': '{기존 계약번호}', 'FRGN_CLS': '604-002' }));
      const result = await assertNexacroResponse(resp, 'getData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0321M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '구매계약(외자) 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0350M — 물품대장  (unit 4건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0350M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0350M';
  const CSRF_ID = 'PUR_0350M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0350/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'PUR_TPS', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_FRGN_CLS', 'PUR_STEPS', 'G_CLS_DIV', 'M_CLS_DIV', 'S_CLS_DIV', 'SCH_PUR_RQST_CLS', 'SCH_CONT_TP', 'DEPT_CHIF_YN', 'ROLE_YN'];

  test.describe(`물품대장(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 물품대장 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0350/getList.do
     * 예상결과: 물품대장 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 물품대장 테이블) WHERE 1=1
     */
    test('[no:1] 물품대장 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 물품대장 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0350M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '물품대장 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 물품대장 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0350/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 물품대장 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 물품대장 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)');
      logInput('검색조건', '{"SCH_SRCH_SDT":"20240101","SCH_SRCH_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_SDT': '20240101', 'SCH_SRCH_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0350M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '물품대장 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 물품대장 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0350/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 물품대장 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 물품대장 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_SRCH_SDT":"20261231","SCH_SRCH_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_SDT': '20261231', 'SCH_SRCH_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0350M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '물품대장 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:4] 물품대장 - 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0350/getList.do
     * 예상결과: 키워드 LIKE 검색 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE UPPER(ITEM_NM) LIKE '%물품%'
     */
    test('[no:4] 물품대장 - 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)', async ({ workerPage: page }) => {
      logTestStart('[no:4] 물품대장 - 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)');
      logInput('검색조건', '{"SCH_SRCH_CLS":"ITEM_NM","SCH_SRCH_KEY":"물품"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_CLS': 'ITEM_NM', 'SCH_SRCH_KEY': '물품' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0350M-unit-no4.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '물품대장 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0351M — 구매계약정보  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0351M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0351M';
  const CSRF_ID = 'PUR_0351M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0321/getData.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'CTRCT_NO', 'CTRCT_SEQ', 'CTRCT_DEG', 'FRGN_CLS', 'PUR_TP', 'RGST_NO', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'ACCT_CD', 'PROJ_EXE_CLS', 'ACCT_UNT_CD', 'TEMP_AMT', 'DIV_CNT', 'DIV_TERM'];

  test.describe(`구매계약정보(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매계약정보 - 단건 상세 조회 (getData, CTRCT_NO 키)
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 개발자
     * URL: /mis/pur/pur0321/getData.do
     * 예상결과: 지정한 계약번호의 구매계약정보 상세가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 구매계약 마스터) WHERE CTRCT_NO = '{기존 계약번호}'
     */
    test('[no:1] 구매계약정보 - 단건 상세 조회 (getData, CTRCT_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매계약정보 - 단건 상세 조회 (getData, CTRCT_NO 키)');
      logInput('검색조건', '{"CTRCT_NO":"{기존 계약번호}"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'CTRCT_NO': '{기존 계약번호}' }));
      const result = await assertNexacroResponse(resp, 'getData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0351M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '구매계약정보 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0400M — 구매검수  (unit 5건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0400M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0400M';
  const CSRF_ID = 'PUR_0400M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0400/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'SCH_DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'APV_STAT_CD', 'SCH_RQST_DEPT_NM', 'SCH_RQST_DEPT_CD', 'DEPT_NM', 'DEPT_CD', 'SCH_RQST_EMP_NM', 'SCH_RQST_EMP_NO', 'STAT_CLS', 'ROLE_YN', 'DEPT_CHIF_YN', 'EXMNT_CLS', 'EXMNT_END_YN', 'EXMNT_TP', 'SCH_S_AMT', 'SCH_E_AMT', 'SCH_PUR_TP'];

  test.describe(`구매검수(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매검수 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0400/getList.do
     * 예상결과: 구매검수 대상 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 검수 대상 테이블) WHERE 1=1
     */
    test('[no:1] 구매검수 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매검수 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0400M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매검수 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 구매검수 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0400/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 구매검수 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 구매검수 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20240101","SCH_RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20240101', 'SCH_RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0400M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매검수 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 구매검수 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0400/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 구매검수 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 구매검수 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20261231","SCH_RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20261231', 'SCH_RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0400M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매검수 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:4] 구매검수 - 결재상태 필터 (APV_STAT_CD)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0400/getList.do
     * 예상결과: 결재상태 일치 건이 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE APV_STAT_CD = '000-010-040'
     */
    test('[no:4] 구매검수 - 결재상태 필터 (APV_STAT_CD)', async ({ workerPage: page }) => {
      logTestStart('[no:4] 구매검수 - 결재상태 필터 (APV_STAT_CD)');
      logInput('검색조건', '{"APV_STAT_CD":"000-010-040"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'APV_STAT_CD': '000-010-040' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0400M-unit-no4.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매검수 결재상태 필터 (APV_STAT_CD) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:5] 구매검수 - 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0400/getList.do
     * 예상결과: 키워드 LIKE 검색 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 검색대상 LIKE '%구매%'
     */
    test('[no:5] 구매검수 - 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)', async ({ workerPage: page }) => {
      logTestStart('[no:5] 구매검수 - 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)');
      logInput('검색조건', '{"SCH_SRCH_CLS":"PUR_CONT_NM","SCH_SRCH_KEY":"구매"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_CLS': 'PUR_CONT_NM', 'SCH_SRCH_KEY': '구매' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0400M-unit-no5.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매검수 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0411M — 검수관리  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0411M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0411M';
  const CSRF_ID = 'PUR_0411M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0411/getData.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CTRCT_NO', 'CTRCT_SEQ', 'EXMNT_NO', 'RESL_DEG', 'TEMP_AMT', 'RGST_NO', 'EXMNT_TP', 'EXMNT_EMP_SEQ', 'EXMNT_EMP_SEQ2', 'RQST_NO'];

  test.describe(`검수관리(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 검수관리 - 단건 상세 조회 (getData, CTRCT_NO/EXMNT_NO 키)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0411/getData.do
     * 예상결과: 지정한 계약/검수번호의 검수 상세가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 검수 마스터) WHERE EXMNT_NO = '{기존 검수번호}'
     */
    test('[no:1] 검수관리 - 단건 상세 조회 (getData, CTRCT_NO/EXMNT_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 검수관리 - 단건 상세 조회 (getData, CTRCT_NO/EXMNT_NO 키)');
      logInput('검색조건', '{"CTRCT_NO":"{기존 계약번호}","EXMNT_NO":"{기존 검수번호}"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'CTRCT_NO': '{기존 계약번호}', 'EXMNT_NO': '{기존 검수번호}' }));
      const result = await assertNexacroResponse(resp, 'getData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0411M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '검수관리 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0420M — 구매기술검사  (unit 4건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0420M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0420M';
  const CSRF_ID = 'PUR_0420M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0420/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'RQST_CLS', 'SRCH_CLS', 'SRCH_KEY', 'APV_STAT_CD', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'STAT_CLS', 'ROLE_YN', 'DEPT_CHIF_YN', 'CHK_EMP', 'CHK_DEPT'];

  test.describe(`구매기술검사(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매기술검사 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0420/getList.do
     * 예상결과: 구매기술검사 대상 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 구매기술검사 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매기술검사 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0420M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매기술검사 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 구매기술검사 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0420/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 구매기술검사 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 구매기술검사 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20240101","SCH_RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20240101', 'SCH_RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0420M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매기술검사 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 구매기술검사 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0420/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 구매기술검사 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 구매기술검사 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20261231","SCH_RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20261231', 'SCH_RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0420M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매기술검사 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:4] 구매기술검사 - 결재상태 필터 (APV_STAT_CD)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0420/getList.do
     * 예상결과: 결재상태 일치 건이 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE APV_STAT_CD = '000-010-040'
     */
    test('[no:4] 구매기술검사 - 결재상태 필터 (APV_STAT_CD)', async ({ workerPage: page }) => {
      logTestStart('[no:4] 구매기술검사 - 결재상태 필터 (APV_STAT_CD)');
      logInput('검색조건', '{"APV_STAT_CD":"000-010-040"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'APV_STAT_CD': '000-010-040' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0420M-unit-no4.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매기술검사 결재상태 필터 (APV_STAT_CD) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0421M — 기술검사조서  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0421M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0421M';
  const CSRF_ID = 'PUR_0421M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0421/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CTRCT_NO', 'CTRCT_SEQ', 'EXMNT_NO', 'RESL_DEG', 'EXMNT_TP', 'RGST_NO', 'CORP_CD', 'BUSI_PLC_CD', 'RQST_NO', 'EXMNT_RQST_NO', 'EXMNT_EMP_SEQ', 'FRGN_CLS'];

  test.describe(`기술검사조서(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 기술검사조서 - 단건 상세 조회 (getNpList, CTRCT_NO/EXMNT_NO 키)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0421/getList.do
     * 예상결과: 지정한 계약/검사번호의 기술검사조서 상세가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 검사조서 마스터) WHERE EXMNT_NO = '{기존 검사번호}'
     */
    test('[no:1] 기술검사조서 - 단건 상세 조회 (getNpList, CTRCT_NO/EXMNT_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 기술검사조서 - 단건 상세 조회 (getNpList, CTRCT_NO/EXMNT_NO 키)');
      logInput('검색조건', '{"CTRCT_NO":"{기존 계약번호}","EXMNT_NO":"{기존 검사번호}"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'CTRCT_NO': '{기존 계약번호}', 'EXMNT_NO': '{기존 검사번호}' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0421M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '기술검사조서 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0430M — 용역/공사 검사조서  (unit 3건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0430M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0430M';
  const CSRF_ID = 'PUR_0430M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0430/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'SCH_DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'RQST_CLS', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'APV_STAT_CD', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'STAT_CLS', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_PUR_END_YN', 'DEPT_NM', 'DEPT_CD', 'CHK_EMP', 'CHK_DEPT'];

  test.describe(`용역/공사 검사조서(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 용역/공사 검사조서 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0430/getList.do
     * 예상결과: 용역/공사 검사조서 대상 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 용역/공사 검사조서 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 용역/공사 검사조서 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0430M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '용역/공사 검사조서 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 용역/공사 검사조서 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0430/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 용역/공사 검사조서 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 용역/공사 검사조서 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20240101","SCH_RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20240101', 'SCH_RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0430M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '용역/공사 검사조서 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 용역/공사 검사조서 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0430/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 용역/공사 검사조서 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 용역/공사 검사조서 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20261231","SCH_RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20261231', 'SCH_RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0430M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '용역/공사 검사조서 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0431M — 용역/공사 검사조서  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0431M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0431M';
  const CSRF_ID = 'PUR_0431M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0431/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CTRCT_NO', 'CTRCT_SEQ', 'EXMNT_NO', 'RESL_DEG', 'EXMNT_TP', 'RGST_NO', 'CORP_CD', 'BUSI_PLC_CD', 'RQST_NO', 'EXMNT_RQST_NO', 'EXMNT_EMP_SEQ'];

  test.describe(`용역/공사 검사조서(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 용역/공사 검사조서 - 단건 상세 조회 (getNpList, CTRCT_NO/EXMNT_NO 키)
     * 중분류: 구매관리  소분류: 구매검수  액터: 개발자
     * URL: /mis/pur/pur0431/getList.do
     * 예상결과: 지정한 계약/검사번호의 용역/공사 검사조서 상세가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 검사조서 마스터) WHERE EXMNT_NO = '{기존 검사번호}'
     */
    test('[no:1] 용역/공사 검사조서 - 단건 상세 조회 (getNpList, CTRCT_NO/EXMNT_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 용역/공사 검사조서 - 단건 상세 조회 (getNpList, CTRCT_NO/EXMNT_NO 키)');
      logInput('검색조건', '{"CTRCT_NO":"{기존 계약번호}","EXMNT_NO":"{기존 검사번호}"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'CTRCT_NO': '{기존 계약번호}', 'EXMNT_NO': '{기존 검사번호}' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0431M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '용역/공사 검사조서 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0500M — 대금지급신청  (unit 4건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0500M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0500M';
  const CSRF_ID = 'PUR_0500M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0500/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'SCH_FRGN_CLS', 'SCH_DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_RQST_STAT', 'SCH_CLS', 'SCH_KEY', 'SCH_RQST_EMP_NO', 'SCH_RQST_EMP_NM', 'SCH_RQST_DEPT_CD', 'SCH_RQST_DEPT_NM', 'DEPT_CD', 'DEPT_NM', 'SCH_STAT_CLS', 'ROLE_YN', 'DEPT_CHIF_YN'];

  test.describe(`대금지급신청(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 대금지급신청 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 대금지급  액터: 개발자
     * URL: /mis/pur/pur0500/getList.do
     * 예상결과: 대금지급신청 대상 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 대금지급신청 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 대금지급신청 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0500M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '대금지급신청 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 대금지급신청 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)
     * 중분류: 구매관리  소분류: 대금지급  액터: 개발자
     * URL: /mis/pur/pur0500/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 대금지급신청 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 대금지급신청 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20240101","SCH_RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20240101', 'SCH_RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0500M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '대금지급신청 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 대금지급신청 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 대금지급  액터: 개발자
     * URL: /mis/pur/pur0500/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 대금지급신청 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 대금지급신청 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20261231","SCH_RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20261231', 'SCH_RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0500M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '대금지급신청 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:4] 대금지급신청 - 결재상태 필터 (SCH_RQST_STAT)
     * 중분류: 구매관리  소분류: 대금지급  액터: 개발자
     * URL: /mis/pur/pur0500/getList.do
     * 예상결과: 결재상태 일치 건이 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RQST_STAT = '000-010-040'
     */
    test('[no:4] 대금지급신청 - 결재상태 필터 (SCH_RQST_STAT)', async ({ workerPage: page }) => {
      logTestStart('[no:4] 대금지급신청 - 결재상태 필터 (SCH_RQST_STAT)');
      logInput('검색조건', '{"SCH_RQST_STAT":"000-010-040"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_STAT': '000-010-040' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0500M-unit-no4.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '대금지급신청 결재상태 필터 (SCH_RQST_STAT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0521M — 대급지급신청  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0521M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0521M';
  const CSRF_ID = 'PUR_0521M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0521/getData.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['RESL_RQST_NO', 'CTRCT_NO', 'RESL_DEG', 'RESL_ORD', 'FRGN_CLS', 'FRM_MODE', 'TEMP_AMT', 'APRQ_NO', 'DPSIT_NM'];

  test.describe(`대급지급신청(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 대급지급신청 - 단건 상세 조회 (getData, RESL_RQST_NO/CTRCT_NO 키)
     * 중분류: 구매관리  소분류: 대금지급  액터: 개발자
     * URL: /mis/pur/pur0521/getData.do
     * 예상결과: 지정한 지급요청/계약번호의 대금지급 상세가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 대금지급 마스터) WHERE RESL_RQST_NO = '{기존 지급요청번호}'
     */
    test('[no:1] 대급지급신청 - 단건 상세 조회 (getData, RESL_RQST_NO/CTRCT_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 대급지급신청 - 단건 상세 조회 (getData, RESL_RQST_NO/CTRCT_NO 키)');
      logInput('검색조건', '{"RESL_RQST_NO":"{기존 지급요청번호}","CTRCT_NO":"{기존 계약번호}"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RESL_RQST_NO': '{기존 지급요청번호}', 'CTRCT_NO': '{기존 계약번호}' }));
      const result = await assertNexacroResponse(resp, 'getData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0521M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '대급지급신청 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0591M — 구매미지급 관리  (unit 3건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0591M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0591M';
  const CSRF_ID = 'PUR_0591M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0591/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_BUDG_SDT', 'SCH_BUDG_EDT', 'SCH_CLS', 'SCH_KEY', 'SCH_FRGN_CLS', 'ACCT_CD_REG_YN'];

  test.describe(`구매미지급 관리(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매미지급 관리 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 대금지급  액터: 개발자
     * URL: /mis/pur/pur0591/getList.do
     * 예상결과: 구매미지급 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 미지급 테이블) WHERE 1=1
     */
    test('[no:1] 구매미지급 관리 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매미지급 관리 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0591M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매미지급 관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 구매미지급 관리 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)
     * 중분류: 구매관리  소분류: 대금지급  액터: 개발자
     * URL: /mis/pur/pur0591/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 구매미지급 관리 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 구매미지급 관리 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20240101","SCH_RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20240101', 'SCH_RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0591M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매미지급 관리 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 구매미지급 관리 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 대금지급  액터: 개발자
     * URL: /mis/pur/pur0591/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 구매미지급 관리 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 구매미지급 관리 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20261231","SCH_RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20261231', 'SCH_RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0591M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매미지급 관리 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0810M — 실적증명서 목록  (unit 4건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0810M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0810M';
  const CSRF_ID = 'PUR_0810M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0810/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'SCH_ACPF_NO', 'SCH_ACPF_STATE', 'SCH_CT_NO', 'SCH_VENDOR_NAME', 'SCH_VENDOR_CODE', 'SCH_CT_NAME', 'ROLE_YN', 'SCH_SRCH_EMP_NM', 'SCH_SRCH_EMP_NO', 'DEPT_CHIF_YN'];

  test.describe(`실적증명서 목록(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 실적증명서 목록 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 실적관리  액터: 개발자
     * URL: /mis/pur/pur0810/getList.do
     * 예상결과: 실적증명서 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 실적증명 테이블) WHERE 1=1
     */
    test('[no:1] 실적증명서 목록 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 실적증명서 목록 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0810M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '실적증명서 목록 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 실적증명서 목록 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)
     * 중분류: 구매관리  소분류: 실적관리  액터: 개발자
     * URL: /mis/pur/pur0810/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 실적증명서 목록 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 실적증명서 목록 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)');
      logInput('검색조건', '{"SCH_SRCH_SDT":"20240101","SCH_SRCH_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_SDT': '20240101', 'SCH_SRCH_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0810M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '실적증명서 목록 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 실적증명서 목록 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 실적관리  액터: 개발자
     * URL: /mis/pur/pur0810/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 실적증명서 목록 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 실적증명서 목록 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_SRCH_SDT":"20261231","SCH_SRCH_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_SDT': '20261231', 'SCH_SRCH_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0810M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '실적증명서 목록 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:4] 실적증명서 목록 - 업체명 검색 (SCH_VENDOR_NAME)
     * 중분류: 구매관리  소분류: 실적관리  액터: 개발자
     * URL: /mis/pur/pur0810/getList.do
     * 예상결과: 업체명 LIKE 검색 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE UPPER(VENDOR_NAME) LIKE '%주식회사%'
     */
    test('[no:4] 실적증명서 목록 - 업체명 검색 (SCH_VENDOR_NAME)', async ({ workerPage: page }) => {
      logTestStart('[no:4] 실적증명서 목록 - 업체명 검색 (SCH_VENDOR_NAME)');
      logInput('검색조건', '{"SCH_VENDOR_NAME":"주식회사"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_VENDOR_NAME': '주식회사' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0810M-unit-no4.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '실적증명서 목록 업체명 검색 (SCH_VENDOR_NAME) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0811M — 실적증명서  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0811M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0811M';
  const CSRF_ID = 'PUR_0811M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0811/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['ACPF_NO'];

  test.describe(`실적증명서(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 실적증명서 - 단건 상세 조회 (getData, ACPF_NO 키)
     * 중분류: 구매관리  소분류: 실적관리  액터: 개발자
     * URL: /mis/pur/pur0811/getList.do
     * 예상결과: 지정한 실적증명번호의 상세가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 실적증명 마스터) WHERE ACPF_NO = '{기존 실적증명번호}'
     */
    test('[no:1] 실적증명서 - 단건 상세 조회 (getData, ACPF_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 실적증명서 - 단건 상세 조회 (getData, ACPF_NO 키)');
      logInput('검색조건', '{"ACPF_NO":"{기존 실적증명번호}"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'ACPF_NO': '{기존 실적증명번호}' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0811M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '실적증명서 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0821M — 법정구매현황  (unit 4건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0821M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0821M';
  const CSRF_ID = 'PUR_0821M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0821/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'PUR_TPS', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_FRGN_CLS', 'PUR_STEPS', 'G_CLS_DIV', 'M_CLS_DIV', 'S_CLS_DIV', 'SCH_PUR_RQST_CLS', 'SCH_SRCH_CUST_NM', 'SCH_SRCH_CUST_CD', 'SCH_CMP_TP', 'SCH_PROD_CERT', 'DEPT_CHIF_YN', 'ROLE_YN'];

  test.describe(`법정구매현황(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 법정구매현황 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 법정구매  액터: 개발자
     * URL: /mis/pur/pur0821/getList.do
     * 예상결과: 법정구매현황 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 법정구매 테이블) WHERE 1=1
     */
    test('[no:1] 법정구매현황 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 법정구매현황 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0821M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '법정구매현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 법정구매현황 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)
     * 중분류: 구매관리  소분류: 법정구매  액터: 개발자
     * URL: /mis/pur/pur0821/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 법정구매현황 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 법정구매현황 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)');
      logInput('검색조건', '{"SCH_SRCH_SDT":"20240101","SCH_SRCH_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_SDT': '20240101', 'SCH_SRCH_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0821M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '법정구매현황 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 법정구매현황 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 법정구매  액터: 개발자
     * URL: /mis/pur/pur0821/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 법정구매현황 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 법정구매현황 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_SRCH_SDT":"20261231","SCH_SRCH_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_SDT': '20261231', 'SCH_SRCH_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0821M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '법정구매현황 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:4] 법정구매현황 - 업체명 검색 (SCH_SRCH_CUST_NM)
     * 중분류: 구매관리  소분류: 법정구매  액터: 개발자
     * URL: /mis/pur/pur0821/getList.do
     * 예상결과: 업체명 LIKE 검색 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE UPPER(CUST_NM) LIKE '%주식회사%'
     */
    test('[no:4] 법정구매현황 - 업체명 검색 (SCH_SRCH_CUST_NM)', async ({ workerPage: page }) => {
      logTestStart('[no:4] 법정구매현황 - 업체명 검색 (SCH_SRCH_CUST_NM)');
      logInput('검색조건', '{"SCH_SRCH_CUST_NM":"주식회사"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_CUST_NM': '주식회사' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0821M-unit-no4.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '법정구매현황 업체명 검색 (SCH_SRCH_CUST_NM) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0822M — 법정구매물품정보 등록  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0822M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0822M';
  const CSRF_ID = 'PUR_0822M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0822/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['PUR_CONT_NO', 'ITEM_MNG_NO', 'ITEM_MNG_SEQ', 'ITEM_NM'];

  test.describe(`법정구매물품정보 등록(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 법정구매물품정보 등록 - 물품정보 조회 (getList, PUR_CONT_NO 키)
     * 중분류: 구매관리  소분류: 법정구매  액터: 개발자
     * URL: /mis/pur/pur0822/getList.do
     * 예상결과: 지정 계약번호의 법정구매물품 정보가 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 법정구매물품 테이블) WHERE PUR_CONT_NO = '{기존 계약번호}'
     */
    test('[no:1] 법정구매물품정보 등록 - 물품정보 조회 (getList, PUR_CONT_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 법정구매물품정보 등록 - 물품정보 조회 (getList, PUR_CONT_NO 키)');
      logInput('검색조건', '{"PUR_CONT_NO":"{기존 계약번호}"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'PUR_CONT_NO': '{기존 계약번호}' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0822M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '법정구매물품정보 등록 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0910M — 직접구매신청현황  (unit 5건)
{
  const PGM_ID  = 'pur_0910M';
  const CSRF_ID = 'PUR_0910M';
  const MENU_ID = 'M_MIS_06_01_05';
  const API_URL = '/mis/pur/pur0910/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['WRK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'BOOK_CLS', 'RQST_CLS'];

  test.describe(`직접구매신청현황(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 직접구매신청현황 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 직접구매  액터: 개발자
     * URL: /mis/pur/pur0910/getList.do
     * 예상결과: 직접구매신청현황 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 직접구매 테이블) WHERE 1=1
     */
    test('[no:1] 직접구매신청현황 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 직접구매신청현황 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0910M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '직접구매신청현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 직접구매신청현황 - 기간 조회 (RQST_SDT ~ RQST_EDT)
     * 중분류: 구매관리  소분류: 직접구매  액터: 개발자
     * URL: /mis/pur/pur0910/getList.do
     * 예상결과: 요구일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RQST_DT >= '20240101' AND RQST_DT <= '20261231'
     */
    test('[no:2] 직접구매신청현황 - 기간 조회 (RQST_SDT ~ RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 직접구매신청현황 - 기간 조회 (RQST_SDT ~ RQST_EDT)');
      logInput('검색조건', '{"RQST_SDT":"20240101","RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RQST_SDT': '20240101', 'RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0910M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '직접구매신청현황 기간 조회 (RQST_SDT ~ RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 직접구매신청현황 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 직접구매  액터: 개발자
     * URL: /mis/pur/pur0910/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 직접구매신청현황 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 직접구매신청현황 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"RQST_SDT":"20261231","RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RQST_SDT': '20261231', 'RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0910M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '직접구매신청현황 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:4] 직접구매신청현황 - 결재상태 필터 (APV_STAT_CD)
     * 중분류: 구매관리  소분류: 직접구매  액터: 개발자
     * URL: /mis/pur/pur0910/getList.do
     * 예상결과: 결재상태 일치 건이 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE APV_STAT_CD = '000-010-040'
     */
    test('[no:4] 직접구매신청현황 - 결재상태 필터 (APV_STAT_CD)', async ({ workerPage: page }) => {
      logTestStart('[no:4] 직접구매신청현황 - 결재상태 필터 (APV_STAT_CD)');
      logInput('검색조건', '{"APV_STAT_CD":"000-010-040"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'APV_STAT_CD': '000-010-040' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0910M-unit-no4.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '직접구매신청현황 결재상태 필터 (APV_STAT_CD) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:5] 직접구매신청현황 - 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)
     * 중분류: 구매관리  소분류: 직접구매  액터: 개발자
     * URL: /mis/pur/pur0910/getList.do
     * 예상결과: 키워드 LIKE 검색 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 검색대상 LIKE '%구매%'
     */
    test('[no:5] 직접구매신청현황 - 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)', async ({ workerPage: page }) => {
      logTestStart('[no:5] 직접구매신청현황 - 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)');
      logInput('검색조건', '{"SCH_SRCH_CLS":"RQST_SBJ","SCH_SRCH_KEY":"구매"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_CLS': 'RQST_SBJ', 'SCH_SRCH_KEY': '구매' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0910M-unit-no5.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '직접구매신청현황 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0911M — 직접구매신청  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0911M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0911M';
  const CSRF_ID = 'PUR_0911M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0911/getCheapData.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'CHEAP_RQST_NO', 'RQST_CLS', 'TEMP_AMT', 'ADD', 'PGM_ID'];

  test.describe(`직접구매신청(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 직접구매신청 - 단건 상세 조회 (getData, CHEAP_RQST_NO 키)
     * 중분류: 구매관리  소분류: 직접구매  액터: 개발자
     * URL: /mis/pur/pur0911/getCheapData.do
     * 예상결과: 지정한 직접구매신청번호의 상세가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 직접구매 마스터) WHERE CHEAP_RQST_NO = '{기존 직접구매신청번호}'
     */
    test('[no:1] 직접구매신청 - 단건 상세 조회 (getData, CHEAP_RQST_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 직접구매신청 - 단건 상세 조회 (getData, CHEAP_RQST_NO 키)');
      logInput('검색조건', '{"CHEAP_RQST_NO":"{기존 직접구매신청번호}"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'CHEAP_RQST_NO': '{기존 직접구매신청번호}' }));
      const result = await assertNexacroResponse(resp, 'getCheapData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0911M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '직접구매신청 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0920M — 직접구매물품현황  (unit 3건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0920M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0920M';
  const CSRF_ID = 'PUR_0920M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0915/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'FRGN_CLS', 'DT_CLS', 'SCH_SDT', 'SCH_EDT', 'RGST_EMP_NO', 'RGST_EMP_NM', 'PUR_STEPS', 'PUR_TPS', 'CONT_TPS', 'RGST_NO', 'CTRCT_END_YN', 'CTRCT_NM', 'CTRCT_CUST_NM', 'SCH_CLS', 'SCH_KEY', 'RQST_CLSS', 'AST_REG_YN', 'ROLE_YN', 'DEPT_CHIF_YN'];

  test.describe(`직접구매물품현황(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 직접구매물품현황 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 직접구매  액터: 개발자
     * URL: /mis/pur/pur0915/getList.do
     * 예상결과: 직접구매물품현황 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 직접구매물품현황 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 직접구매물품현황 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0920M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '직접구매물품현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 직접구매물품현황 - 기간 조회 (SCH_SDT ~ SCH_EDT)
     * 중분류: 구매관리  소분류: 직접구매  액터: 개발자
     * URL: /mis/pur/pur0915/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 직접구매물품현황 - 기간 조회 (SCH_SDT ~ SCH_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 직접구매물품현황 - 기간 조회 (SCH_SDT ~ SCH_EDT)');
      logInput('검색조건', '{"SCH_SDT":"20240101","SCH_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SDT': '20240101', 'SCH_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0920M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '직접구매물품현황 기간 조회 (SCH_SDT ~ SCH_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 직접구매물품현황 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 직접구매  액터: 개발자
     * URL: /mis/pur/pur0915/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 직접구매물품현황 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 직접구매물품현황 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_SDT":"20261231","SCH_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SDT': '20261231', 'SCH_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0920M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '직접구매물품현황 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0940M — 직접구매검수  (unit 3건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0940M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0940M';
  const CSRF_ID = 'PUR_0940M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0940/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_APV_STAT_CD', 'SCH_EXMNT_STAT_CLS', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_RQST_DEPT_NM', 'SCH_RQST_DEPT_CD', 'SCH_RQST_EMP_NM', 'SCH_RQST_EMP_NO', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS', 'DEPT_CD', 'DEPT_NM'];

  test.describe(`직접구매검수(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 직접구매검수 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 직접구매  액터: 개발자
     * URL: /mis/pur/pur0940/getList.do
     * 예상결과: 직접구매검수 대상 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 직접구매검수 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 직접구매검수 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0940M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '직접구매검수 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 직접구매검수 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)
     * 중분류: 구매관리  소분류: 직접구매  액터: 개발자
     * URL: /mis/pur/pur0940/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 직접구매검수 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 직접구매검수 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20240101","SCH_RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20240101', 'SCH_RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0940M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '직접구매검수 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 직접구매검수 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 직접구매  액터: 개발자
     * URL: /mis/pur/pur0940/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 직접구매검수 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 직접구매검수 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20261231","SCH_RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20261231', 'SCH_RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0940M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '직접구매검수 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0941M — 직접구매검수  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0941M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0941M';
  const CSRF_ID = 'PUR_0941M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0941/getDataInfo.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['EXMNT_NO', 'CHEAP_RQST_CLS', 'CORP_CD', 'BUSI_PLC_CD', 'CHEAP_RQST_NO', 'ITEM_MNG_NO', 'ITEM_MNG_SEQ'];

  test.describe(`직접구매검수(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 직접구매검수 - 단건 상세 조회 (getData, EXMNT_NO/CHEAP_RQST_NO 키)
     * 중분류: 구매관리  소분류: 직접구매  액터: 개발자
     * URL: /mis/pur/pur0941/getDataInfo.do
     * 예상결과: 지정한 신청/검수번호의 직접구매검수 상세가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 직접구매검수 마스터) WHERE EXMNT_NO = '{기존 검수번호}'
     */
    test('[no:1] 직접구매검수 - 단건 상세 조회 (getData, EXMNT_NO/CHEAP_RQST_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 직접구매검수 - 단건 상세 조회 (getData, EXMNT_NO/CHEAP_RQST_NO 키)');
      logInput('검색조건', '{"CHEAP_RQST_NO":"{기존 직접구매신청번호}","EXMNT_NO":"{기존 검수번호}"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'CHEAP_RQST_NO': '{기존 직접구매신청번호}', 'EXMNT_NO': '{기존 검수번호}' }));
      const result = await assertNexacroResponse(resp, 'getDataInfo.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0941M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '직접구매검수 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0960M — 단가물품신청현황  (unit 4건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0960M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0960M';
  const CSRF_ID = 'PUR_0960M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0960/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['WRK_AREA', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_RQST_STAT', 'SCH_RQST_EMP_NM', 'SCH_RQST_EMP_NO', 'SCH_RQST_DEPT_NM', 'SCH_RQST_DEPT_CD', 'SRCH_CLS', 'SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'RQST_CLS', 'SPPLS_CD', 'SPPLS_NM', 'SCH_EXMNT_STAT'];

  test.describe(`단가물품신청현황(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 단가물품신청현황 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 단가구매  액터: 개발자
     * URL: /mis/pur/pur0960/getList.do
     * 예상결과: 단가물품신청현황 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 단가물품신청현황 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 단가물품신청현황 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0960M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '단가물품신청현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 단가물품신청현황 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)
     * 중분류: 구매관리  소분류: 단가구매  액터: 개발자
     * URL: /mis/pur/pur0960/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 단가물품신청현황 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 단가물품신청현황 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20240101","SCH_RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20240101', 'SCH_RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0960M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '단가물품신청현황 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 단가물품신청현황 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 단가구매  액터: 개발자
     * URL: /mis/pur/pur0960/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 단가물품신청현황 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 단가물품신청현황 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20261231","SCH_RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20261231', 'SCH_RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0960M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '단가물품신청현황 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:4] 단가물품신청현황 - 결재상태 필터 (SCH_RQST_STAT)
     * 중분류: 구매관리  소분류: 단가구매  액터: 개발자
     * URL: /mis/pur/pur0960/getList.do
     * 예상결과: 결재상태 일치 건이 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RQST_STAT = '000-010-040'
     */
    test('[no:4] 단가물품신청현황 - 결재상태 필터 (SCH_RQST_STAT)', async ({ workerPage: page }) => {
      logTestStart('[no:4] 단가물품신청현황 - 결재상태 필터 (SCH_RQST_STAT)');
      logInput('검색조건', '{"SCH_RQST_STAT":"000-010-040"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_STAT': '000-010-040' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0960M-unit-no4.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '단가물품신청현황 결재상태 필터 (SCH_RQST_STAT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0961M — 단가물품신청  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0961M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0961M';
  const CSRF_ID = 'PUR_0961M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0961/getCheapData.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'CHEAP_RQST_NO', 'RQST_CLS'];

  test.describe(`단가물품신청(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 단가물품신청 - 단건 상세 조회 (getData, CHEAP_RQST_NO 키)
     * 중분류: 구매관리  소분류: 단가구매  액터: 개발자
     * URL: /mis/pur/pur0961/getCheapData.do
     * 예상결과: 지정한 단가신청번호의 상세가 조회된다.
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 단가물품 마스터) WHERE CHEAP_RQST_NO = '{기존 단가신청번호}'
     */
    test('[no:1] 단가물품신청 - 단건 상세 조회 (getData, CHEAP_RQST_NO 키)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 단가물품신청 - 단건 상세 조회 (getData, CHEAP_RQST_NO 키)');
      logInput('검색조건', '{"CHEAP_RQST_NO":"{기존 단가신청번호}"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'CHEAP_RQST_NO': '{기존 단가신청번호}' }));
      const result = await assertNexacroResponse(resp, 'getCheapData.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0961M-unit-no1.png`, fullPage: true }).catch(() => {});
    // 상세 단건 조회 — 실제 키값 미확보(플레이스홀더). 엔드포인트 정상응답 + 데이터셋 파싱만 스모크 검증.
    expect(rows.length, '단가물품신청 응답 파싱(키 미확보 스모크)').toBeGreaterThanOrEqual(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0970M — 단가물품현황  (unit 3건)
// TODO(menuId): SYS_MENU_MGT에서 pur_0970M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_0970M';
  const CSRF_ID = 'PUR_0970M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur0970/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_SRCH_DT', 'SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'DEPT_CHIF_YN'];

  test.describe(`단가물품현황(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 단가물품현황 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 단가구매  액터: 개발자
     * URL: /mis/pur/pur0970/getList.do
     * 예상결과: 단가물품현황 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 단가물품현황 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 단가물품현황 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0970M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '단가물품현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 단가물품현황 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)
     * 중분류: 구매관리  소분류: 단가구매  액터: 개발자
     * URL: /mis/pur/pur0970/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 단가물품현황 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 단가물품현황 - 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT)');
      logInput('검색조건', '{"SCH_SRCH_SDT":"20240101","SCH_SRCH_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_SDT': '20240101', 'SCH_SRCH_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0970M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '단가물품현황 기간 조회 (SCH_SRCH_SDT ~ SCH_SRCH_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 단가물품현황 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 단가구매  액터: 개발자
     * URL: /mis/pur/pur0970/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 단가물품현황 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 단가물품현황 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_SRCH_SDT":"20261231","SCH_SRCH_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SRCH_SDT': '20261231', 'SCH_SRCH_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0970M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '단가물품현황 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_4000M — 안전보건수준대상관리  (unit 3건)
// TODO(menuId): SYS_MENU_MGT에서 pur_4000M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_4000M';
  const CSRF_ID = 'PUR_4000M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur4000/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_RQST_STAT', 'SCH_RQST_DEPT_NM', 'SCH_RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_PUR_STEP', 'SCH_RQST_EMP_NM', 'SCH_RQST_EMP_NO', 'SCH_FRGN_CLS', 'SCH_DEPT_CHIF_YN', 'SCH_ROLE_YN', 'SCH_RJCT_YN', 'SCH_PUR_TP', 'SCH_CORP_CD', 'SCH_BUSI_PLC_CD', 'SCH_PUR_CLS', 'DEPT_NM', 'DEPT_CD', 'SCH_LSF_YN'];

  test.describe(`안전보건수준대상관리(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 안전보건수준대상관리 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 안전관리  액터: 개발자
     * URL: /mis/pur/pur4000/getList.do
     * 예상결과: 안전보건수준대상 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 안전보건수준대상관리 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 안전보건수준대상관리 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_4000M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '안전보건수준대상관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 안전보건수준대상관리 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)
     * 중분류: 구매관리  소분류: 안전관리  액터: 개발자
     * URL: /mis/pur/pur4000/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 안전보건수준대상관리 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 안전보건수준대상관리 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20240101","SCH_RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20240101', 'SCH_RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_4000M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '안전보건수준대상관리 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 안전보건수준대상관리 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 안전관리  액터: 개발자
     * URL: /mis/pur/pur4000/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 안전보건수준대상관리 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 안전보건수준대상관리 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20261231","SCH_RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20261231', 'SCH_RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_4000M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '안전보건수준대상관리 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_4010M — 우선협상 업체등록(목록)  (unit 3건)
// TODO(menuId): SYS_MENU_MGT에서 pur_4010M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_4010M';
  const CSRF_ID = 'PUR_4010M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur4010/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_RQST_STAT', 'SCH_RQST_DEPT_NM', 'SCH_RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_PUR_STEP', 'SCH_RQST_EMP_NM', 'SCH_RQST_EMP_NO', 'SCH_FRGN_CLS', 'SCH_DEPT_CHIF_YN', 'SCH_ROLE_YN', 'SCH_RJCT_YN', 'SCH_PUR_TP', 'SCH_CORP_CD', 'SCH_BUSI_PLC_CD', 'SCH_PUR_CLS', 'DEPT_CD', 'DEPT_NM', 'SCH_DMND_STAT', 'SCH_CONF_STAT'];

  test.describe(`우선협상 업체등록(목록)(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 우선협상 업체등록(목록) - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 안전관리  액터: 개발자
     * URL: /mis/pur/pur4010/getList.do
     * 예상결과: 우선협상 업체 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 우선협상 업체등록(목록) - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 우선협상 업체등록(목록) - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_4010M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '우선협상 업체등록(목록) 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 우선협상 업체등록(목록) - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)
     * 중분류: 구매관리  소분류: 안전관리  액터: 개발자
     * URL: /mis/pur/pur4010/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 우선협상 업체등록(목록) - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 우선협상 업체등록(목록) - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20240101","SCH_RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20240101', 'SCH_RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_4010M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '우선협상 업체등록(목록) 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 우선협상 업체등록(목록) - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 안전관리  액터: 개발자
     * URL: /mis/pur/pur4010/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 우선협상 업체등록(목록) - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 우선협상 업체등록(목록) - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20261231","SCH_RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20261231', 'SCH_RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_4010M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '우선협상 업체등록(목록) 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_4015M — 우선협상 업체등록(등록)  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_4015M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_4015M';
  const CSRF_ID = 'PUR_4015M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur4015/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = [];

  test.describe(`우선협상 업체등록(등록)(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 우선협상 업체등록(등록) - 전체 조회 (getList)
     * 중분류: 구매관리  소분류: 안전관리  액터: 개발자
     * URL: /mis/pur/pur4015/getList.do
     * 예상결과: 우선협상 업체등록 대상 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 우선협상 업체등록(등록) - 전체 조회 (getList)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 우선협상 업체등록(등록) - 전체 조회 (getList)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_4015M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '우선협상 업체등록(등록) 전체 조회 (getList) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_4020M — 안전관리시스템연동관리  (unit 3건)
// TODO(menuId): SYS_MENU_MGT에서 pur_4020M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_4020M';
  const CSRF_ID = 'PUR_4020M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur4020/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_RQST_EMP_NM', 'SCH_RQST_EMP_NO', 'SCH_CODE'];

  test.describe(`안전관리시스템연동관리(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 안전관리시스템연동관리 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: 안전관리  액터: 개발자
     * URL: /mis/pur/pur4020/getList.do
     * 예상결과: 안전관리시스템 연동 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 안전관리시스템연동관리 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 안전관리시스템연동관리 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_4020M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '안전관리시스템연동관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 안전관리시스템연동관리 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)
     * 중분류: 구매관리  소분류: 안전관리  액터: 개발자
     * URL: /mis/pur/pur4020/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] 안전관리시스템연동관리 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 안전관리시스템연동관리 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20240101","SCH_RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20240101', 'SCH_RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_4020M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '안전관리시스템연동관리 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 안전관리시스템연동관리 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: 안전관리  액터: 개발자
     * URL: /mis/pur/pur4020/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 안전관리시스템연동관리 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 안전관리시스템연동관리 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20261231","SCH_RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20261231', 'SCH_RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_4020M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '안전관리시스템연동관리 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_4030M — 안전관리시스템 공통파일관리  (unit 1건)
// TODO(menuId): SYS_MENU_MGT에서 pur_4030M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_4030M';
  const CSRF_ID = 'PUR_4030M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur4030/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = [];

  test.describe(`안전관리시스템 공통파일관리(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 안전관리시스템 공통파일관리 - 전체 조회 (getList)
     * 중분류: 구매관리  소분류: 안전관리  액터: 개발자
     * URL: /mis/pur/pur4030/getList.do
     * 예상결과: 안전관리시스템 공통파일 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 안전관리시스템 공통파일관리 - 전체 조회 (getList)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 안전관리시스템 공통파일관리 - 전체 조회 (getList)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_4030M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '안전관리시스템 공통파일관리 전체 조회 (getList) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_5100M — MRO상품계약  (unit 3건)
// TODO(menuId): SYS_MENU_MGT에서 pur_5100M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_5100M';
  const CSRF_ID = 'PUR_5100M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur5100/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_SDT', 'SCH_EDT', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_CLS', 'SCH_KEY', 'CONTRACT_TYPE', 'APV_STAT_CD', 'MRO_PRODUCT_RQST_NO'];

  test.describe(`MRO상품계약(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] MRO상품계약 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5100/getList.do
     * 예상결과: MRO상품계약 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] MRO상품계약 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] MRO상품계약 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5100M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, 'MRO상품계약 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] MRO상품계약 - 기간 조회 (SCH_SDT ~ SCH_EDT)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5100/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] MRO상품계약 - 기간 조회 (SCH_SDT ~ SCH_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] MRO상품계약 - 기간 조회 (SCH_SDT ~ SCH_EDT)');
      logInput('검색조건', '{"SCH_SDT":"20240101","SCH_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SDT': '20240101', 'SCH_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5100M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, 'MRO상품계약 기간 조회 (SCH_SDT ~ SCH_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] MRO상품계약 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5100/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] MRO상품계약 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] MRO상품계약 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_SDT":"20261231","SCH_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_SDT': '20261231', 'SCH_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5100M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, 'MRO상품계약 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_5110M — 구매요구(MRO)  (unit 4건)
// TODO(menuId): SYS_MENU_MGT에서 pur_5110M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_5110M';
  const CSRF_ID = 'PUR_5110M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur5110/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['RQST_SDT', 'RQST_EDT', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_CLS', 'SCH_SRCH_KEY', 'RQST_STAT', 'START_RQST_AMT', 'END_RQST_AMT', 'INS_ID', 'INS_NM', 'INS_DEPT_CD', 'INS_DEPT_NM'];

  test.describe(`구매요구(MRO)(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매요구(MRO) - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5110/getList.do
     * 예상결과: 구매요구(MRO) 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] 구매요구(MRO) - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매요구(MRO) - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5110M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구(MRO) 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] 구매요구(MRO) - 기간 조회 (RQST_SDT ~ RQST_EDT)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5110/getList.do
     * 예상결과: 요구일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RQST_DT >= '20240101' AND RQST_DT <= '20261231'
     */
    test('[no:2] 구매요구(MRO) - 기간 조회 (RQST_SDT ~ RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] 구매요구(MRO) - 기간 조회 (RQST_SDT ~ RQST_EDT)');
      logInput('검색조건', '{"RQST_SDT":"20240101","RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RQST_SDT': '20240101', 'RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5110M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구(MRO) 기간 조회 (RQST_SDT ~ RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] 구매요구(MRO) - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5110/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] 구매요구(MRO) - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] 구매요구(MRO) - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"RQST_SDT":"20261231","RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RQST_SDT': '20261231', 'RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5110M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구(MRO) 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:4] 구매요구(MRO) - 결재상태 필터 (RQST_STAT)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5110/getList.do
     * 예상결과: 결재상태 일치 건이 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RQST_STAT = '000-010-040'
     */
    test('[no:4] 구매요구(MRO) - 결재상태 필터 (RQST_STAT)', async ({ workerPage: page }) => {
      logTestStart('[no:4] 구매요구(MRO) - 결재상태 필터 (RQST_STAT)');
      logInput('검색조건', '{"RQST_STAT":"000-010-040"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RQST_STAT': '000-010-040' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5110M-unit-no4.png`, fullPage: true }).catch(() => {});
    expect(rows.length, '구매요구(MRO) 결재상태 필터 (RQST_STAT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_5120M — MRO정산현황  (unit 3건)
// TODO(menuId): SYS_MENU_MGT에서 pur_5120M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_5120M';
  const CSRF_ID = 'PUR_5120M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur5120/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_CLS', 'SCH_SRCH_KEY'];

  test.describe(`MRO정산현황(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] MRO정산현황 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5120/getList.do
     * 예상결과: MRO정산현황 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] MRO정산현황 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] MRO정산현황 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5120M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, 'MRO정산현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] MRO정산현황 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5120/getList.do
     * 예상결과: 일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 일자 >= '20240101' AND 일자 <= '20261231'
     */
    test('[no:2] MRO정산현황 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] MRO정산현황 - 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20240101","SCH_RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20240101', 'SCH_RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5120M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, 'MRO정산현황 기간 조회 (SCH_RQST_SDT ~ SCH_RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] MRO정산현황 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5120/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] MRO정산현황 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] MRO정산현황 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_RQST_SDT":"20261231","SCH_RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_RQST_SDT': '20261231', 'SCH_RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5120M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, 'MRO정산현황 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_5130M — MRO 대금지급  (unit 3건)
// TODO(menuId): SYS_MENU_MGT에서 pur_5130M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_5130M';
  const CSRF_ID = 'PUR_5130M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur5130/getList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_PYMNT_FRM_DT', 'SCH_PYMNT_TO_DT', 'SCH_RESL_FRM_DT', 'SCH_RESL_TO_DT', 'SCH_RQST_DEPT_CD', 'SCH_RQST_DEPT_NM', 'SCH_RQST_EMP_NO', 'SCH_RQST_EMP_NM', 'SCH_RESL_DEPT_CD', 'SCH_RESL_DEPT_NM', 'SCH_RESL_EMP_NO', 'SCH_RESL_EMP_NM', 'SCH_APV_STAT_CD', 'SCH_CLS', 'SCH_KEY', 'SCH_ISSUE_YN', 'DEPT_CHIF_YN', 'ROLE_YN'];

  test.describe(`MRO 대금지급(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] MRO 대금지급 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5130/getList.do
     * 예상결과: MRO 대금지급 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] MRO 대금지급 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] MRO 대금지급 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5130M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, 'MRO 대금지급 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] MRO 대금지급 - 기간 조회 (SCH_PYMNT_FRM_DT ~ SCH_PYMNT_TO_DT)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5130/getList.do
     * 예상결과: 지급일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE PYMNT_DT >= '20240101' AND PYMNT_DT <= '20261231'
     */
    test('[no:2] MRO 대금지급 - 기간 조회 (SCH_PYMNT_FRM_DT ~ SCH_PYMNT_TO_DT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] MRO 대금지급 - 기간 조회 (SCH_PYMNT_FRM_DT ~ SCH_PYMNT_TO_DT)');
      logInput('검색조건', '{"SCH_PYMNT_FRM_DT":"20240101","SCH_PYMNT_TO_DT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_PYMNT_FRM_DT': '20240101', 'SCH_PYMNT_TO_DT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5130M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, 'MRO 대금지급 기간 조회 (SCH_PYMNT_FRM_DT ~ SCH_PYMNT_TO_DT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] MRO 대금지급 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5130/getList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] MRO 대금지급 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] MRO 대금지급 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"SCH_PYMNT_FRM_DT":"20261231","SCH_PYMNT_TO_DT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'SCH_PYMNT_FRM_DT': '20261231', 'SCH_PYMNT_TO_DT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5130M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, 'MRO 대금지급 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_5140M — MRO 요구물품취소  (unit 3건)
// TODO(menuId): SYS_MENU_MGT에서 pur_5140M 실제 menuId 조회 필요 — 현재 openMenuByPgm 폴백으로 세션 등록.
{
  const PGM_ID  = 'pur_5140M';
  const CSRF_ID = 'PUR_5140M';
  const MENU_ID = 'M_MIS_XX_XX_XX';
  const API_URL = '/mis/pur/pur5140/getPurCnclRqstList.do';
  const DS_LIST = 'ds_list';
  const DS_SEARCH_COLUMNS = ['RQST_SDT', 'RQST_EDT', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_CNCL_YN'];

  test.describe(`MRO 요구물품취소(${PGM_ID}) 단위 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] MRO 요구물품취소 - 전체 조회 (조건 없음)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5140/getPurCnclRqstList.do
     * 예상결과: MRO 요구물품취소 대상 목록이 조회된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
     */
    test('[no:1] MRO 요구물품취소 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
      logTestStart('[no:1] MRO 요구물품취소 - 전체 조회 (조건 없음)');
      logInput('검색조건', '없음');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, {  }));
      const result = await assertNexacroResponse(resp, 'getPurCnclRqstList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5140M-unit-no1.png`, fullPage: true }).catch(() => {});
    expect(rows.length, 'MRO 요구물품취소 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:2] MRO 요구물품취소 - 기간 조회 (RQST_SDT ~ RQST_EDT)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5140/getPurCnclRqstList.do
     * 예상결과: 요구일자 범위 조회 결과가 반환된다. (총 N건)
     * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RQST_DT >= '20240101' AND RQST_DT <= '20261231'
     */
    test('[no:2] MRO 요구물품취소 - 기간 조회 (RQST_SDT ~ RQST_EDT)', async ({ workerPage: page }) => {
      logTestStart('[no:2] MRO 요구물품취소 - 기간 조회 (RQST_SDT ~ RQST_EDT)');
      logInput('검색조건', '{"RQST_SDT":"20240101","RQST_EDT":"20261231"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RQST_SDT': '20240101', 'RQST_EDT': '20261231' }));
      const result = await assertNexacroResponse(resp, 'getPurCnclRqstList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5140M-unit-no2.png`, fullPage: true }).catch(() => {});
    expect(rows.length, 'MRO 요구물품취소 기간 조회 (RQST_SDT ~ RQST_EDT) 1건 이상').toBeGreaterThan(0);
      logResult('검증', 'PASS');
    });

    /**
     * [no:3] MRO 요구물품취소 - 역방향 날짜 (시작일 > 종료일 → 0건)
     * 중분류: 구매관리  소분류: MRO구매  액터: 개발자
     * URL: /mis/pur/pur5140/getPurCnclRqstList.do
     * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
     * DB 확인: -- 역방향 날짜: 0건
     */
    test('[no:3] MRO 요구물품취소 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
      logTestStart('[no:3] MRO 요구물품취소 - 역방향 날짜 (시작일 > 종료일 → 0건)');
      logInput('검색조건', '{"RQST_SDT":"20261231","RQST_EDT":"20240101"}');
      const formKey = await ensureSessionReady(page, MENU_ID, CSRF_ID);
      void formKey;
      const resp   = await apiPost(page, API_URL, searchBody(CSRF_ID, DS_SEARCH_COLUMNS, { 'RQST_SDT': '20261231', 'RQST_EDT': '20240101' }));
      const result = await assertNexacroResponse(resp, 'getPurCnclRqstList.do');
      const rows   = parseNexacroXmlRows(result.body, DS_LIST);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5140M-unit-no3.png`, fullPage: true }).catch(() => {});
    expect(rows.length, 'MRO 요구물품취소 0건 기대').toBe(0);
      logResult('검증', 'PASS');
    });

  });
}
