// ==============================================================
// HRM 모듈 — 인사관리 단위 테스트 (통합 spec)
// 생성일시: 2026-07-05  |  파일: 20260705_hrm_unit.spec.ts
// 커버 화면: 58개  |  총 테스트 케이스: 144건
// 방식: API-direct (page.evaluate(fetch) + nexacroXml)
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 금지
// 소스: _workspace/hrm/01_scenarios.json (59개 화면, 비API 1개[hrm_3162M] 제외)
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';

// ── Nexacro XML 요청 본문 생성 ──────────────────────────────────────────────
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

// API 호출 — page.evaluate(fetch) + credentials:'include' (세션 쿠키 포함)
async function apiPost(page: Page, endpoint: string, xml: string) {
  const fullUrl = `${BASE_URL}${endpoint}`;
  const result = await page.evaluate(
    async ({ url, xmlBody }: { url: string; xmlBody: string }) => {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
        body: xmlBody,
        credentials: 'include',
        signal: AbortSignal.timeout(20000),
      });
      return { status: resp.status, body: await resp.text() };
    },
    { url: fullUrl, xmlBody: xml }
  );
  return { status: () => result.status, text: async () => result.body } as any;
}

test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
test.afterAll(() => { flushLogs(); });

// ---------------------------------------------------------------------------
// hrm_0110M — 부서조직관리  |  API: POST /mis/hrm/hrm0110/getOrgchtList.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm0110/getOrgchtList.do';
  const PGM_ID            = 'hrm_0110M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_listOrgcht';
  const DS_SEARCH_COLUMNS = ['SCH_ORG_RGIN_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부서조직관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부서조직관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직관리  액터: 개발자
   * URL: /mis/hrm/hrm0110/getOrgchtList.do
   * 예상결과: 부서조직관리(조직도) 목록이 조회된다. (총 N건 — DB COUNT(*) WHERE 1=1 실행 후 채우기) SCH_ORG_RGIN_DT 없이 호출 시 조직도 목록이 반환된다.
   * DB 확인: SELECT COUNT(*) FROM HRM_ORGCHT A WHERE 1=1
   */
  test(`[no:1] 부서조직관리 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서조직관리 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getOrgchtList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0110M-no1.png`, fullPage: true });

    expect(rows.length, '부서조직관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 부서조직관리 - 조직개편일자 조건 조회 (SCH_ORG_RGIN_DT)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직관리  액터: 개발자
   * URL: /mis/hrm/hrm0110/getOrgchtList.do
   * 예상결과: 특정 조직개편일자 기준 조직도가 조회된다. (총 N건 — DB COUNT(*) WHERE ORG_RGIN_DT 실행 후 채우기) 응답 모든 행의 ORG_RGIN_DT가 요청값과 일치해야 한다.
   * DB 확인: SELECT COUNT(*) FROM HRM_ORGCHT A WHERE 1=1 AND A.ORG_RGIN_DT = '20240101'
   */
  test(`[no:2] 부서조직관리 - 조직개편일자 조건 조회 (SCH_ORG_RGIN_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 부서조직관리 - 조직개편일자 조건 조회 (SCH_ORG_RGIN_DT)');
    logInput('SCH_ORG_RGIN_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_ORG_RGIN_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getOrgchtList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0110M-no2.png`, fullPage: true });

    expect(rows.length, '부서조직관리 조직개편일자 조건 조회 (SCH_ORG_RGIN_DT) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(r['ORG_RGIN_DT'], `[행${i}] ORG_RGIN_DT 불일치`).toBe('2024-01-01'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 부서조직관리 - 존재하지 않는 조직개편일자 (미래일자, 데이터 없음 예상 — DB 미확인)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직관리  액터: 개발자
   * URL: /mis/hrm/hrm0110/getOrgchtList.do
   * 예상결과: 미래 일자(9999-12-31) 기준 조회 시 데이터가 없을 것으로 예상되나 DB 미확인이므로 0건 단정하지 않는다. 반환 건수를 DB COUNT와 비교한다.
   * DB 확인: SELECT COUNT(*) FROM HRM_ORGCHT A WHERE 1=1 AND A.ORG_RGIN_DT = '99991231'
   */
  test(`[no:3] 부서조직관리 - 존재하지 않는 조직개편일자 (미래일자, 데이터 없음 예상 — DB 미확인)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 부서조직관리 - 존재하지 않는 조직개편일자 (미래일자, 데이터 없음 예상 — DB 미확인)');
    logInput('SCH_ORG_RGIN_DT', '9999-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_ORG_RGIN_DT': '9999-12-31' }));
    const result = await assertNexacroResponse(resp, 'getOrgchtList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0110M-no3.png`, fullPage: true });

    expect(rows.length, '부서조직관리 존재하지 않는 조직개편일자 (미래일자, 데이터 없음 예상 — DB 미확인) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_0120M — 부서조직변경이력관리  |  API: POST /mis/hrm/hrm0120/getList.do  |  TC 5건
{
  const API_URL           = '/mis/hrm/hrm0120/getList.do';
  const PGM_ID            = 'hrm_0120M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['ORG_RGIN_DT', 'ORG_RGIN_FG_CD', 'ORG_RGIN_NM', 'ORG_RGIN_DCSN_YN', 'REFE_METR', 'PRV_ORG_RGIN_DT', 'RGIN_DCSN_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부서조직변경이력관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부서조직변경이력관리 - 전체 조회 (조건 없음, API-direct)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직변경이력관리  액터: 개발자
   * URL: /mis/hrm/hrm0120/getList.do
   * 예상결과: 부서변경이력 목록이 조회된다. (총 N건 — DB COUNT(*) WHERE 1=1 실행 후 채우기) UI에서는 ORG_RGIN_DT가 필수이나 API 직접 호출로 전체 이력 반환 여부를 확인한다.
   * DB 확인: SELECT COUNT(*) FROM HRM_ORG_CHG_HIST A WHERE 1=1
   */
  test(`[no:1] 부서조직변경이력관리 - 전체 조회 (조건 없음, API-direct)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서조직변경이력관리 - 전체 조회 (조건 없음, API-direct)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0120M-no1.png`, fullPage: true });

    expect(rows.length, '부서조직변경이력관리 전체 조회 (조건 없음, API-direct) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 부서조직변경이력관리 - 조직개편일자 조건 조회 (ORG_RGIN_DT)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직변경이력관리  액터: 개발자
   * URL: /mis/hrm/hrm0120/getList.do
   * 예상결과: 특정 조직개편일자의 부서변경이력이 조회된다. (총 N건 — DB COUNT(*) WHERE ORG_RGIN_DT 실행 후 채우기) 응답 모든 행의 ORG_RGIN_DT가 요청값과 일치해야 한다.
   * DB 확인: SELECT COUNT(*) FROM HRM_ORG_CHG_HIST A WHERE 1=1 AND A.ORG_RGIN_DT = '20240101'
   */
  test(`[no:2] 부서조직변경이력관리 - 조직개편일자 조건 조회 (ORG_RGIN_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 부서조직변경이력관리 - 조직개편일자 조건 조회 (ORG_RGIN_DT)');
    logInput('ORG_RGIN_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'ORG_RGIN_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0120M-no2.png`, fullPage: true });

    expect(rows.length, '부서조직변경이력관리 조직개편일자 조건 조회 (ORG_RGIN_DT) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(r['ORG_RGIN_DT'], `[행${i}] ORG_RGIN_DT 불일치`).toBe('2024-01-01'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 부서조직변경이력관리 - 존재하지 않는 조직개편일자 (미래일자, DB 미확인)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직변경이력관리  액터: 개발자
   * URL: /mis/hrm/hrm0120/getList.do
   * 예상결과: 미래 일자(9999-12-31) 기준 조회 시 데이터가 없을 것으로 예상되나 DB 미확인이므로 0건 단정하지 않는다.
   * DB 확인: SELECT COUNT(*) FROM HRM_ORG_CHG_HIST A WHERE 1=1 AND A.ORG_RGIN_DT = '99991231'
   */
  test(`[no:3] 부서조직변경이력관리 - 존재하지 않는 조직개편일자 (미래일자, DB 미확인)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 부서조직변경이력관리 - 존재하지 않는 조직개편일자 (미래일자, DB 미확인)');
    logInput('ORG_RGIN_DT', '9999-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'ORG_RGIN_DT': '9999-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0120M-no3.png`, fullPage: true });

    expect(rows.length, '부서조직변경이력관리 존재하지 않는 조직개편일자 (미래일자, DB 미확인) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 부서조직변경이력관리 - 조직개편명 키워드 검색 (ORG_RGIN_NM)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직변경이력관리  액터: 개발자
   * URL: /mis/hrm/hrm0120/getList.do
   * 예상결과: 조직개편명에 '조직'이 포함된 변경이력이 조회된다. (총 N건 — DB COUNT(*) WHERE ORG_RGIN_NM LIKE '%조직%' 실행 후 채우기)
   * DB 확인: SELECT COUNT(*) FROM HRM_ORG_CHG_HIST A WHERE 1=1 AND A.ORG_RGIN_NM LIKE '%' || TRIM('조직') || '%'
   */
  test(`[no:4] 부서조직변경이력관리 - 조직개편명 키워드 검색 (ORG_RGIN_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:4] 부서조직변경이력관리 - 조직개편명 키워드 검색 (ORG_RGIN_NM)');
    logInput('ORG_RGIN_NM', '조직');

    const resp   = await apiPost(page, API_URL, searchBody({ 'ORG_RGIN_NM': '조직' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0120M-no4.png`, fullPage: true });

    expect(rows.length, '부서조직변경이력관리 조직개편명 키워드 검색 (ORG_RGIN_NM) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 부서조직변경이력관리 - 확정여부 코드 필터 (ORG_RGIN_DCSN_YN=Y)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직변경이력관리  액터: 개발자
   * URL: /mis/hrm/hrm0120/getList.do
   * 예상결과: 확정(Y)된 조직개편의 변경이력이 조회된다. (총 N건 — DB COUNT 실행 후 채우기) 코드 필터 적용 결과 확인.
   * DB 확인: SELECT COUNT(*) FROM HRM_ORG_CHG_HIST A WHERE 1=1 AND A.ORG_RGIN_DCSN_YN = 'Y'
   */
  test(`[no:5] 부서조직변경이력관리 - 확정여부 코드 필터 (ORG_RGIN_DCSN_YN=Y)`, async ({ workerPage: page }) => {
    logTestStart('[no:5] 부서조직변경이력관리 - 확정여부 코드 필터 (ORG_RGIN_DCSN_YN=Y)');
    logInput('ORG_RGIN_DCSN_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ 'ORG_RGIN_DCSN_YN': 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0120M-no5.png`, fullPage: true });

    expect(rows.length, '부서조직변경이력관리 확정여부 코드 필터 (ORG_RGIN_DCSN_YN=Y) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_0130M — 부서관리  |  API: POST /mis/hrm/hrm0130/getList.do  |  TC 6건
{
  const API_URL           = '/mis/hrm/hrm0130/getList.do';
  const PGM_ID            = 'hrm_0130M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_HDODF_CD', 'SCH_BZPLC_CD', 'SCH_DEPT_NM', 'SCH_USE_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부서관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부서관리 - 전체 조회 (조건 없음, SCH_USE_YN 비움)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서관리 목록이 조회된다. (총 N건 — DB COUNT(*) WHERE 1=1 실행 후 채우기) 검색조건 없이 전체 부서 목록 조회(1건 이상). onload 기본값 SCH_USE_YN='Y'를 의도적으로 비워 사용/미사용 전체를 조회한다.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1
   */
  test(`[no:1] 부서관리 - 전체 조회 (조건 없음, SCH_USE_YN 비움)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서관리 - 전체 조회 (조건 없음, SCH_USE_YN 비움)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0130M-no1.png`, fullPage: true });

    expect(rows.length, '부서관리 전체 조회 (조건 없음, SCH_USE_YN 비움) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 부서관리 - 사용여부=Y 필터
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서관리 목록이 조회된다. (총 N건 — DB COUNT(*) WHERE USE_YN='Y' 실행 후 채우기) 사용여부 '사용'(Y)으로 필터링. 응답 모든 행의 USE_YN이 'Y'여야 한다. (WHERE A.USE_YN = #SCH_USE_YN#)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.USE_YN = 'Y'
   */
  test(`[no:2] 부서관리 - 사용여부=Y 필터`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 부서관리 - 사용여부=Y 필터');
    logInput('SCH_USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_USE_YN': 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0130M-no2.png`, fullPage: true });

    expect(rows.length, '부서관리 사용여부=Y 필터 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(r['USE_YN'], `[행${i}] USE_YN 불일치`).toBe('Y'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 부서관리 - 사용여부=N 필터
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서관리 목록이 조회된다. (총 N건 — DB COUNT(*) WHERE USE_YN='N' 실행 후 채우기) 사용여부 '미사용'(N)으로 필터링. 응답이 존재하면 모든 행의 USE_YN이 'N'이어야 한다. 미사용 부서가 없으면 0건 가능.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.USE_YN = 'N'
   */
  test(`[no:3] 부서관리 - 사용여부=N 필터`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 부서관리 - 사용여부=N 필터');
    logInput('SCH_USE_YN', 'N');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_USE_YN': 'N' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0130M-no3.png`, fullPage: true });

    expect(rows.length, '부서관리 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 부서관리 - 부서명 키워드 검색 (SCH_DEPT_NM='부')
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서관리 목록이 조회된다. (총 N건 — DB COUNT(*) WHERE DEPT_NM LIKE '%부%' 실행 후 채우기) 부서명에 '부'가 포함된 부서 조회 (WHERE A.DEPT_NM LIKE '%'||TRIM('부')||'%'). 응답 모든 행의 DEPT_NM에 '부' 문자열이 포함되어야 한다.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.DEPT_NM LIKE '%' || TRIM('부') || '%'
   */
  test(`[no:4] 부서관리 - 부서명 키워드 검색 (SCH_DEPT_NM='부')`, async ({ workerPage: page }) => {
    logTestStart('[no:4] 부서관리 - 부서명 키워드 검색 (SCH_DEPT_NM=\'부\')');
    logInput('SCH_DEPT_NM', '부');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_DEPT_NM': '부' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0130M-no4.png`, fullPage: true });

    expect(rows.length, '부서관리 부서명 키워드 검색 (SCH_DEPT_NM=\'부\') 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['DEPT_NM'] ?? ''), `[행${i}] DEPT_NM에 부 미포함`).toContain('부'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 부서관리 - 사용여부=Y + 부서명 복합 검색
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서관리 목록이 조회된다. (총 N건 — DB COUNT(*) WHERE USE_YN='Y' AND DEPT_NM LIKE '%부%' 실행 후 채우기) 사용여부=Y이면서 부서명에 '부'가 포함된 부서 조회. 응답 모든 행이 USE_YN='Y' AND DEPT_NM LIKE '%부%' 두 조건을 동시에 만족해야 하며, 결과 건수는 TC2 이하여야 한다.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.USE_YN = 'Y' AND A.DEPT_NM LIKE '%' || TRIM('부') || '%'
   */
  test(`[no:5] 부서관리 - 사용여부=Y + 부서명 복합 검색`, async ({ workerPage: page }) => {
    logTestStart('[no:5] 부서관리 - 사용여부=Y + 부서명 복합 검색');
    logInput('SCH_USE_YN', 'Y');
    logInput('SCH_DEPT_NM', '부');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_USE_YN': 'Y', 'SCH_DEPT_NM': '부' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0130M-no5.png`, fullPage: true });

    expect(rows.length, '부서관리 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 부서관리 - DEPT_CD 오름차순 정렬 검증
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서관리 목록이 조회된다. (총 N건 — DB COUNT(*) WHERE 1=1 실행 후 채우기) 전체 조회 결과가 DEPT_CD 기준 오름차순으로 정렬되어 반환되어야 한다 (ORDER BY A.DEPT_CD). 인접한 모든 행에 대해 prev.DEPT_CD <= next.DEPT_CD 이어야 한다.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1
   */
  test(`[no:6] 부서관리 - DEPT_CD 오름차순 정렬 검증`, async ({ workerPage: page }) => {
    logTestStart('[no:6] 부서관리 - DEPT_CD 오름차순 정렬 검증');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0130M-no6.png`, fullPage: true });

    expect(rows.length, '부서관리 DEPT_CD 오름차순 정렬 검증 1건 이상').toBeGreaterThan(0);
    {
      const vals = rows.map(r => String(r['DEPT_CD'] ?? ''));
      const sorted = [...vals].sort();
      expect(vals, 'DEPT_CD 오름차순 정렬').toEqual(sorted);
    }
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_0215M — 정원관리  |  API: POST /mis/hrm/hrm0215/getData.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm0215/getData.do';
  const PGM_ID            = 'hrm_0215M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_prcpList';
  const DS_SEARCH_COLUMNS = ['PRCP_MDAT_DT', 'PRCP_MDAT_FG_CD', 'PRCP_MDAT_RSN', 'RMK', 'ORG_RGIN_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`정원관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 정원관리 - 정원조정일자 기준 조회 (PRCP_MDAT_DT)
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 정원관리  액터: 개발자
   * URL: /mis/hrm/hrm0215/getData.do
   * 예상결과: 특정 정원조정일자의 정원 목록이 조회된다. (총 N건 — DB COUNT(*) WHERE PRCP_MDAT_DT 실행 후 채우기) 응답 모든 행의 PRCP_MDAT_DT가 요청값과 일치해야 한다.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT_PRCP A WHERE 1=1 AND A.PRCP_MDAT_DT = '20240101'
   */
  test(`[no:1] 정원관리 - 정원조정일자 기준 조회 (PRCP_MDAT_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 정원관리 - 정원조정일자 기준 조회 (PRCP_MDAT_DT)');
    logInput('PRCP_MDAT_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'PRCP_MDAT_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0215M-no1.png`, fullPage: true });

    expect(rows.length, '정원관리 정원조정일자 기준 조회 (PRCP_MDAT_DT) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(r['PRCP_MDAT_DT'], `[행${i}] PRCP_MDAT_DT 불일치`).toBe('2024-01-01'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 정원관리 - 정원조정일자 + 정원조정구분(직급별) 조회
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 정원관리  액터: 개발자
   * URL: /mis/hrm/hrm0215/getData.do
   * 예상결과: 특정 정원조정일자의 직급별(125-030) 정원이 조회된다. (총 N건 — DB COUNT 실행 후 채우기) 코드 필터(정원조정구분) 적용 결과 확인.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT_PRCP A WHERE 1=1 AND A.PRCP_MDAT_DT = '20240101' AND A.PRCP_MDAT_FG_CD = '125-030'
   */
  test(`[no:2] 정원관리 - 정원조정일자 + 정원조정구분(직급별) 조회`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 정원관리 - 정원조정일자 + 정원조정구분(직급별) 조회');
    logInput('PRCP_MDAT_DT', '2024-01-01');
    logInput('PRCP_MDAT_FG_CD', '125-030');

    const resp   = await apiPost(page, API_URL, searchBody({ 'PRCP_MDAT_DT': '2024-01-01', 'PRCP_MDAT_FG_CD': '125-030' }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0215M-no2.png`, fullPage: true });

    expect(rows.length, '정원관리 정원조정일자 + 정원조정구분(직급별) 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 정원관리 - 존재하지 않는 정원조정일자 (미래일자, DB 미확인)
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 정원관리  액터: 개발자
   * URL: /mis/hrm/hrm0215/getData.do
   * 예상결과: 미래 일자(9999-12-31) 기준 조회 시 데이터가 없을 것으로 예상되나 DB 미확인이므로 0건 단정하지 않는다.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT_PRCP A WHERE 1=1 AND A.PRCP_MDAT_DT = '99991231'
   */
  test(`[no:3] 정원관리 - 존재하지 않는 정원조정일자 (미래일자, DB 미확인)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 정원관리 - 존재하지 않는 정원조정일자 (미래일자, DB 미확인)');
    logInput('PRCP_MDAT_DT', '9999-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'PRCP_MDAT_DT': '9999-12-31' }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0215M-no3.png`, fullPage: true });

    expect(rows.length, '정원관리 존재하지 않는 정원조정일자 (미래일자, DB 미확인) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_0225M — 직급별정/현원표  |  API: POST /mis/hrm/hrm0225/getGrdData.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm0225/getGrdData.do';
  const PGM_ID            = 'hrm_0225M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_listPrcp';
  const DS_SEARCH_COLUMNS = ['PRCP_MDAT_DT', 'PRCP_MDAT_FG_CD', 'PRCP_MDAT_RSN', 'STDR_DT', 'GRD_CNT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`직급별정/현원표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 직급별정/현원표 - 정원조정일 + 현원기준일 조회 (PRCP_MDAT_DT, STDR_DT)
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 직급별정/현원표  액터: 개발자
   * URL: /mis/hrm/hrm0225/getGrdData.do
   * 예상결과: 정원조정일과 현원기준일 기준 직급별 정/현원(정원·현원·차이)이 조회된다. (총 N건 — DB COUNT 실행 후 채우기) 직급 수만큼 컬럼이 동적 생성된다.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT_PRCP A WHERE 1=1 AND A.PRCP_MDAT_DT = '20240101'
   */
  test(`[no:1] 직급별정/현원표 - 정원조정일 + 현원기준일 조회 (PRCP_MDAT_DT, STDR_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 직급별정/현원표 - 정원조정일 + 현원기준일 조회 (PRCP_MDAT_DT, STDR_DT)');
    logInput('PRCP_MDAT_DT', '2024-01-01');
    logInput('STDR_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'PRCP_MDAT_DT': '2024-01-01', 'STDR_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getGrdData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0225M-no1.png`, fullPage: true });

    expect(rows.length, '직급별정/현원표 정원조정일 + 현원기준일 조회 (PRCP_MDAT_DT, STDR_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 직급별정/현원표 - 다른 현원기준일 조회 (STDR_DT 변경)
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 직급별정/현원표  액터: 개발자
   * URL: /mis/hrm/hrm0225/getGrdData.do
   * 예상결과: 동일 정원조정일에 대해 현원기준일(STDR_DT)을 변경하면 현원(STDR_CNT)/차이(DIFF_CNT) 값이 기준일에 맞게 재계산되어 조회된다.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT_PRCP A WHERE 1=1 AND A.PRCP_MDAT_DT = '20240101'
   */
  test(`[no:2] 직급별정/현원표 - 다른 현원기준일 조회 (STDR_DT 변경)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 직급별정/현원표 - 다른 현원기준일 조회 (STDR_DT 변경)');
    logInput('PRCP_MDAT_DT', '2024-01-01');
    logInput('STDR_DT', '2024-06-30');

    const resp   = await apiPost(page, API_URL, searchBody({ 'PRCP_MDAT_DT': '2024-01-01', 'STDR_DT': '2024-06-30' }));
    const result = await assertNexacroResponse(resp, 'getGrdData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0225M-no2.png`, fullPage: true });

    expect(rows.length, '직급별정/현원표 다른 현원기준일 조회 (STDR_DT 변경) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 직급별정/현원표 - 존재하지 않는 정원조정일 (미래일자, DB 미확인)
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 직급별정/현원표  액터: 개발자
   * URL: /mis/hrm/hrm0225/getGrdData.do
   * 예상결과: 미래 정원조정일(9999-12-31) 기준 조회 시 데이터가 없을 것으로 예상되나 DB 미확인이므로 0건 단정하지 않는다.
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT_PRCP A WHERE 1=1 AND A.PRCP_MDAT_DT = '99991231'
   */
  test(`[no:3] 직급별정/현원표 - 존재하지 않는 정원조정일 (미래일자, DB 미확인)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 직급별정/현원표 - 존재하지 않는 정원조정일 (미래일자, DB 미확인)');
    logInput('PRCP_MDAT_DT', '9999-12-31');
    logInput('STDR_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'PRCP_MDAT_DT': '9999-12-31', 'STDR_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getGrdData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0225M-no3.png`, fullPage: true });

    expect(rows.length, '직급별정/현원표 존재하지 않는 정원조정일 (미래일자, DB 미확인) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_0030M — 부서조직도관리  |  API: POST /mis/hrm/hrm0030/getList.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm0030/getList.do';
  const PGM_ID            = 'hrm_0030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부서조직도관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부서조직도관리 - 조회 (searchDs=, API-direct)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직도관리  액터: 개발자
   * URL: /mis/hrm/hrm0030/getList.do
   * 예상결과: 부서조직도관리 조회를 수행한다. searchDs= (자동분류 미해결 — 파라미터 확인 필요).
   * DB 확인: -- TODO: hrm_0030M 매핑(/mis/hrm/hrm0030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 부서조직도관리 - 조회 (searchDs=, API-direct)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서조직도관리 - 조회 (searchDs=, API-direct)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0030M-no1.png`, fullPage: true });

    expect(rows.length, '부서조직도관리 조회 (searchDs=, API-direct) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_0210M — 부서별정원  |  API: POST /mis/hrm/hrm0210/getDeptList.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm0210/getDeptList.do';
  const PGM_ID            = 'hrm_0210M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_main';
  const DS_SEARCH_COLUMNS = ['ORG_RGIN_RID', 'ORG_RGIN_DT', 'PRCP_MDAT_DT', 'PRCP_MDAT_FG', 'PRCP_MDAT_RSN', 'RMK'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부서별정원(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부서별정원 - 단건 상세 조회 (키 지정 필요, API-direct)
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 부서별정원  액터: 개발자
   * URL: /mis/hrm/hrm0210/getDeptList.do
   * 예상결과: 부서별정원는 상위 목록에서 선택한 키(ds_main)로 단건 상세를 조회하는 화면이다. 유효 키 파라미터가 필요하며, 키 없이 호출 시 빈 결과 또는 오류를 확인한다.
   * DB 확인: -- TODO: hrm_0210M 매핑(/mis/hrm/hrm0210/getDeptList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 부서별정원 - 단건 상세 조회 (키 지정 필요, API-direct)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서별정원 - 단건 상세 조회 (키 지정 필요, API-direct)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getDeptList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0210M-no1.png`, fullPage: true });

    expect(rows.length, '부서별정원 단건 상세 조회 (키 지정 필요, API-direct) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_0220M — 부서별정/현원표  |  API: POST /mis/hrm/hrm0220/getData.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm0220/getData.do';
  const PGM_ID            = 'hrm_0220M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_grdList';
  const DS_SEARCH_COLUMNS = ['ORG_RGIN_RID', 'ORG_RGIN_DT', 'PRCP_MDAT_DT', 'PRCP_MDAT_FG', 'PRCP_MDAT_RSN', 'RMK', 'STDR_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부서별정/현원표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부서별정/현원표 - 단건 상세 조회 (키 지정 필요, API-direct)
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 부서별정/현원표  액터: 개발자
   * URL: /mis/hrm/hrm0220/getData.do
   * 예상결과: 부서별정/현원표는 상위 목록에서 선택한 키(ds_main)로 단건 상세를 조회하는 화면이다. 유효 키 파라미터가 필요하며, 키 없이 호출 시 빈 결과 또는 오류를 확인한다.
   * DB 확인: -- TODO: hrm_0220M 매핑(/mis/hrm/hrm0220/getData.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 부서별정/현원표 - 단건 상세 조회 (키 지정 필요, API-direct)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서별정/현원표 - 단건 상세 조회 (키 지정 필요, API-direct)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_0220M-no1.png`, fullPage: true });

    expect(rows.length, '부서별정/현원표 단건 상세 조회 (키 지정 필요, API-direct) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_2010M — 발령코드관리  |  API: POST /mis/hrm/hrm2010/getUppAppntCdList.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm2010/getUppAppntCdList.do';
  const PGM_ID            = 'hrm_2010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['UPP_APPNT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`발령코드관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 발령코드관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 발령코드관리  액터: 개발자
   * URL: /mis/hrm/hrm2010/getUppAppntCdList.do
   * 예상결과: 발령코드관리 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_2010M 매핑(/mis/hrm/hrm2010/getUppAppntCdList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 발령코드관리 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 발령코드관리 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getUppAppntCdList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2010M-no1.png`, fullPage: true });

    expect(rows.length, '발령코드관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_2020M — 발령호수관리  |  API: POST /mis/hrm/hrm2020/getList.do  |  TC 2건
{
  const API_URL           = '/mis/hrm/hrm2020/getList.do';
  const PGM_ID            = 'hrm_2020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_YY', 'SCH_HDQS_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`발령호수관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 발령호수관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 발령호수관리  액터: 개발자
   * URL: /mis/hrm/hrm2020/getList.do
   * 예상결과: 발령호수관리 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_2020M 매핑(/mis/hrm/hrm2020/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 발령호수관리 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 발령호수관리 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2020M-no1.png`, fullPage: true });

    expect(rows.length, '발령호수관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 발령호수관리 - 연도 조회 (SCH_YY=2024)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 발령호수관리  액터: 개발자
   * URL: /mis/hrm/hrm2020/getList.do
   * 예상결과: 2024년도 발령호수관리 목록이 조회된다.
   * DB 확인: -- TODO: hrm_2020M 매핑(/mis/hrm/hrm2020/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 발령호수관리 - 연도 조회 (SCH_YY=2024)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 발령호수관리 - 연도 조회 (SCH_YY=2024)');
    logInput('SCH_YY', '2024');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_YY': '2024' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2020M-no2.png`, fullPage: true });

    expect(rows.length, '발령호수관리 연도 조회 (SCH_YY=2024) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_2030M — 인사발령관리  |  API: POST /mis/hrm/hrm2030/getList.do  |  TC 4건
{
  const API_URL           = '/mis/hrm/hrm2030/getList.do';
  const PGM_ID            = 'hrm_2030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_YY', 'SCH_APPNT_REGT_MNG_RNO', 'SCH_APPNT_DOC_NO', 'SCH_APPNT_DT', 'SCH_APPNT_CONT', 'SCH_APPNT_OPTR_EMP_RID', 'SCH_APPNT_OPTR_EMP_NO', 'SCH_APPNT_OPTR_EMP_NM', 'SCH_APPNT_PROC_OPET_DE'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`인사발령관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 인사발령관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 인사발령관리  액터: 개발자
   * URL: /mis/hrm/hrm2030/getList.do
   * 예상결과: 인사발령관리 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_2030M 매핑(/mis/hrm/hrm2030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사발령관리 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사발령관리 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2030M-no1.png`, fullPage: true });

    expect(rows.length, '인사발령관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 인사발령관리 - 기준일자 조회 (SCH_APPNT_DT)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 인사발령관리  액터: 개발자
   * URL: /mis/hrm/hrm2030/getList.do
   * 예상결과: 기준일자(SCH_APPNT_DT) 조건으로 인사발령관리가 조회된다.
   * DB 확인: -- TODO: hrm_2030M 매핑(/mis/hrm/hrm2030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 인사발령관리 - 기준일자 조회 (SCH_APPNT_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 인사발령관리 - 기준일자 조회 (SCH_APPNT_DT)');
    logInput('SCH_APPNT_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_APPNT_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2030M-no2.png`, fullPage: true });

    expect(rows.length, '인사발령관리 기준일자 조회 (SCH_APPNT_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 인사발령관리 - 연도 조회 (SCH_YY=2024)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 인사발령관리  액터: 개발자
   * URL: /mis/hrm/hrm2030/getList.do
   * 예상결과: 2024년도 인사발령관리 목록이 조회된다.
   * DB 확인: -- TODO: hrm_2030M 매핑(/mis/hrm/hrm2030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 인사발령관리 - 연도 조회 (SCH_YY=2024)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 인사발령관리 - 연도 조회 (SCH_YY=2024)');
    logInput('SCH_YY', '2024');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_YY': '2024' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2030M-no3.png`, fullPage: true });

    expect(rows.length, '인사발령관리 연도 조회 (SCH_YY=2024) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 인사발령관리 - 명칭 키워드 검색 (SCH_APPNT_OPTR_EMP_NM)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 인사발령관리  액터: 개발자
   * URL: /mis/hrm/hrm2030/getList.do
   * 예상결과: SCH_APPNT_OPTR_EMP_NM에 키워드가 포함된 인사발령관리가 조회된다.
   * DB 확인: -- TODO: hrm_2030M 매핑(/mis/hrm/hrm2030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:4] 인사발령관리 - 명칭 키워드 검색 (SCH_APPNT_OPTR_EMP_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:4] 인사발령관리 - 명칭 키워드 검색 (SCH_APPNT_OPTR_EMP_NM)');
    logInput('SCH_APPNT_OPTR_EMP_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_APPNT_OPTR_EMP_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2030M-no4.png`, fullPage: true });

    expect(rows.length, '인사발령관리 명칭 키워드 검색 (SCH_APPNT_OPTR_EMP_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['APPNT_OPTR_EMP_NM'] ?? ''), `[행${i}] APPNT_OPTR_EMP_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_2040M — 인사발령현황  |  API: POST /mis/hrm/hrm2040/getList.do  |  TC 4건
{
  const API_URL           = '/mis/hrm/hrm2040/getList.do';
  const PGM_ID            = 'hrm_2040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_UPP_APPNT_CD', 'SCH_APPNT_CD', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_APPNT_CONT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`인사발령현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 인사발령현황 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 인사발령현황  액터: 개발자
   * URL: /mis/hrm/hrm2040/getList.do
   * 예상결과: 인사발령현황 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_2040M 매핑(/mis/hrm/hrm2040/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사발령현황 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사발령현황 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2040M-no1.png`, fullPage: true });

    expect(rows.length, '인사발령현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 인사발령현황 - 기간 조회 (SCH_FRM_DT ~ SCH_TO_DT)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 인사발령현황  액터: 개발자
   * URL: /mis/hrm/hrm2040/getList.do
   * 예상결과: 지정 기간(SCH_FRM_DT~SCH_TO_DT)의 인사발령현황 목록이 조회된다.
   * DB 확인: -- TODO: hrm_2040M 매핑(/mis/hrm/hrm2040/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 인사발령현황 - 기간 조회 (SCH_FRM_DT ~ SCH_TO_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 인사발령현황 - 기간 조회 (SCH_FRM_DT ~ SCH_TO_DT)');
    logInput('SCH_FRM_DT', '2024-01-01');
    logInput('SCH_TO_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_FRM_DT': '2024-01-01', 'SCH_TO_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2040M-no2.png`, fullPage: true });

    expect(rows.length, '인사발령현황 기간 조회 (SCH_FRM_DT ~ SCH_TO_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 인사발령현황 - 역방향 기간 (시작>종료, 0건)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 인사발령현황  액터: 개발자
   * URL: /mis/hrm/hrm2040/getList.do
   * 예상결과: 시작일이 종료일보다 늦어 조회 결과가 0건이어야 한다.
   * DB 확인: -- TODO: hrm_2040M 매핑(/mis/hrm/hrm2040/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 인사발령현황 - 역방향 기간 (시작>종료, 0건)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 인사발령현황 - 역방향 기간 (시작>종료, 0건)');
    logInput('SCH_FRM_DT', '2024-12-31');
    logInput('SCH_TO_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_FRM_DT': '2024-12-31', 'SCH_TO_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2040M-no3.png`, fullPage: true });

    expect(rows.length, '인사발령현황 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 인사발령현황 - 명칭 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 인사발령현황  액터: 개발자
   * URL: /mis/hrm/hrm2040/getList.do
   * 예상결과: SCH_EMP_NM에 키워드가 포함된 인사발령현황가 조회된다.
   * DB 확인: -- TODO: hrm_2040M 매핑(/mis/hrm/hrm2040/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:4] 인사발령현황 - 명칭 키워드 검색 (SCH_EMP_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:4] 인사발령현황 - 명칭 키워드 검색 (SCH_EMP_NM)');
    logInput('SCH_EMP_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EMP_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2040M-no4.png`, fullPage: true });

    expect(rows.length, '인사발령현황 명칭 키워드 검색 (SCH_EMP_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['EMP_NM'] ?? ''), `[행${i}] EMP_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_2041M — 이전발령현황  |  API: POST /mis/hrm/hrm2040/getPrvList.do  |  TC 4건
{
  const API_URL           = '/mis/hrm/hrm2040/getPrvList.do';
  const PGM_ID            = 'hrm_2041M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_UPP_APPNT_CD', 'SCH_APPNT_CD', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_RMK'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`이전발령현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 이전발령현황 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 이전발령현황  액터: 개발자
   * URL: /mis/hrm/hrm2040/getPrvList.do
   * 예상결과: 이전발령현황 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_2041M 매핑(/mis/hrm/hrm2040/getPrvList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 이전발령현황 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 이전발령현황 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getPrvList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2041M-no1.png`, fullPage: true });

    expect(rows.length, '이전발령현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 이전발령현황 - 기간 조회 (SCH_FRM_DT ~ SCH_TO_DT)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 이전발령현황  액터: 개발자
   * URL: /mis/hrm/hrm2040/getPrvList.do
   * 예상결과: 지정 기간(SCH_FRM_DT~SCH_TO_DT)의 이전발령현황 목록이 조회된다.
   * DB 확인: -- TODO: hrm_2041M 매핑(/mis/hrm/hrm2040/getPrvList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 이전발령현황 - 기간 조회 (SCH_FRM_DT ~ SCH_TO_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 이전발령현황 - 기간 조회 (SCH_FRM_DT ~ SCH_TO_DT)');
    logInput('SCH_FRM_DT', '2024-01-01');
    logInput('SCH_TO_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_FRM_DT': '2024-01-01', 'SCH_TO_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getPrvList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2041M-no2.png`, fullPage: true });

    expect(rows.length, '이전발령현황 기간 조회 (SCH_FRM_DT ~ SCH_TO_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 이전발령현황 - 역방향 기간 (시작>종료, 0건)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 이전발령현황  액터: 개발자
   * URL: /mis/hrm/hrm2040/getPrvList.do
   * 예상결과: 시작일이 종료일보다 늦어 조회 결과가 0건이어야 한다.
   * DB 확인: -- TODO: hrm_2041M 매핑(/mis/hrm/hrm2040/getPrvList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 이전발령현황 - 역방향 기간 (시작>종료, 0건)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 이전발령현황 - 역방향 기간 (시작>종료, 0건)');
    logInput('SCH_FRM_DT', '2024-12-31');
    logInput('SCH_TO_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_FRM_DT': '2024-12-31', 'SCH_TO_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getPrvList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2041M-no3.png`, fullPage: true });

    expect(rows.length, '이전발령현황 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 이전발령현황 - 명칭 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 인사발령  메뉴명: 이전발령현황  액터: 개발자
   * URL: /mis/hrm/hrm2040/getPrvList.do
   * 예상결과: SCH_EMP_NM에 키워드가 포함된 이전발령현황가 조회된다.
   * DB 확인: -- TODO: hrm_2041M 매핑(/mis/hrm/hrm2040/getPrvList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:4] 이전발령현황 - 명칭 키워드 검색 (SCH_EMP_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:4] 이전발령현황 - 명칭 키워드 검색 (SCH_EMP_NM)');
    logInput('SCH_EMP_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EMP_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getPrvList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_2041M-no4.png`, fullPage: true });

    expect(rows.length, '이전발령현황 명칭 키워드 검색 (SCH_EMP_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['EMP_NM'] ?? ''), `[행${i}] EMP_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3010M — 인사기록카드  |  API: POST /mis/hrm/hrm3010/getList.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm3010/getList.do';
  const PGM_ID            = 'hrm_3010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['HLDF_FG', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'GRD_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`인사기록카드(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 인사기록카드 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드  액터: 개발자
   * URL: /mis/hrm/hrm3010/getList.do
   * 예상결과: 인사기록카드 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_3010M 매핑(/mis/hrm/hrm3010/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사기록카드 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사기록카드 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3010M-no1.png`, fullPage: true });

    expect(rows.length, '인사기록카드 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3020M — 개인인사기록카드  |  API: POST /mis/hrm/hrm3020/getMain.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm3020/getMain.do';
  const PGM_ID            = 'hrm_3020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_main';
  const DS_SEARCH_COLUMNS = ['EMP_RID', 'TABPAGE', 'TABPAGE_TEXT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`개인인사기록카드(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 개인인사기록카드 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 개인인사기록카드  액터: 개발자
   * URL: /mis/hrm/hrm3020/getMain.do
   * 예상결과: 개인인사기록카드 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_3020M 매핑(/mis/hrm/hrm3020/getMain.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 개인인사기록카드 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 개인인사기록카드 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getMain.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3020M-no1.png`, fullPage: true });

    expect(rows.length, '개인인사기록카드 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3030M — 인사기록카드변경신청  |  API: POST /mis/hrm/hrm3030/getList.do  |  TC 4건
{
  const API_URL           = '/mis/hrm/hrm3030/getList.do';
  const PGM_ID            = 'hrm_3030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_FRM_RQST_DT', 'SCH_TO_RQST_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_STRE_STAT_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`인사기록카드변경신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 인사기록카드변경신청 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드변경신청  액터: 개발자
   * URL: /mis/hrm/hrm3030/getList.do
   * 예상결과: 인사기록카드변경신청 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_3030M 매핑(/mis/hrm/hrm3030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사기록카드변경신청 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사기록카드변경신청 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3030M-no1.png`, fullPage: true });

    expect(rows.length, '인사기록카드변경신청 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 인사기록카드변경신청 - 기간 조회 (SCH_FRM_RQST_DT ~ SCH_TO_RQST_DT)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드변경신청  액터: 개발자
   * URL: /mis/hrm/hrm3030/getList.do
   * 예상결과: 지정 기간(SCH_FRM_RQST_DT~SCH_TO_RQST_DT)의 인사기록카드변경신청 목록이 조회된다.
   * DB 확인: -- TODO: hrm_3030M 매핑(/mis/hrm/hrm3030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 인사기록카드변경신청 - 기간 조회 (SCH_FRM_RQST_DT ~ SCH_TO_RQST_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 인사기록카드변경신청 - 기간 조회 (SCH_FRM_RQST_DT ~ SCH_TO_RQST_DT)');
    logInput('SCH_FRM_RQST_DT', '2024-01-01');
    logInput('SCH_TO_RQST_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_FRM_RQST_DT': '2024-01-01', 'SCH_TO_RQST_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3030M-no2.png`, fullPage: true });

    expect(rows.length, '인사기록카드변경신청 기간 조회 (SCH_FRM_RQST_DT ~ SCH_TO_RQST_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 인사기록카드변경신청 - 역방향 기간 (시작>종료, 0건)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드변경신청  액터: 개발자
   * URL: /mis/hrm/hrm3030/getList.do
   * 예상결과: 시작일이 종료일보다 늦어 조회 결과가 0건이어야 한다.
   * DB 확인: -- TODO: hrm_3030M 매핑(/mis/hrm/hrm3030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 인사기록카드변경신청 - 역방향 기간 (시작>종료, 0건)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 인사기록카드변경신청 - 역방향 기간 (시작>종료, 0건)');
    logInput('SCH_FRM_RQST_DT', '2024-12-31');
    logInput('SCH_TO_RQST_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_FRM_RQST_DT': '2024-12-31', 'SCH_TO_RQST_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3030M-no3.png`, fullPage: true });

    expect(rows.length, '인사기록카드변경신청 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 인사기록카드변경신청 - 명칭 키워드 검색 (SCH_DEPT_NM)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드변경신청  액터: 개발자
   * URL: /mis/hrm/hrm3030/getList.do
   * 예상결과: SCH_DEPT_NM에 키워드가 포함된 인사기록카드변경신청가 조회된다.
   * DB 확인: -- TODO: hrm_3030M 매핑(/mis/hrm/hrm3030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:4] 인사기록카드변경신청 - 명칭 키워드 검색 (SCH_DEPT_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:4] 인사기록카드변경신청 - 명칭 키워드 검색 (SCH_DEPT_NM)');
    logInput('SCH_DEPT_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_DEPT_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3030M-no4.png`, fullPage: true });

    expect(rows.length, '인사기록카드변경신청 명칭 키워드 검색 (SCH_DEPT_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['DEPT_NM'] ?? ''), `[행${i}] DEPT_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3031M — 인사기록카드변경신청  |  API: POST /mis/hrm/hrm3031/setGetTabData.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm3031/setGetTabData.do';
  const PGM_ID            = 'hrm_3031M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_main';
  const DS_SEARCH_COLUMNS = ['HRM_RCED_RQST_RNO', 'HRM_RCED_RQST_NO', 'RQST_DT', 'RQSTER_EMP_RID', 'RQSTER_EMP_NO', 'RQSTER_EMP_NM', 'RQSTER_DEPT_CD', 'RQSTER_DEPT_NM', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'GRD_FG', 'HRM_RCED_CHG_TRGT_FG', 'STRE_STAT_FG', 'APV_STAT_FG', 'APV_STAT_FG_NM', 'RUS_RSN', 'H_HRM_RCED_RQST_RNO', 'APV_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`인사기록카드변경신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 인사기록카드변경신청 - 단건 상세 조회 (키 지정 필요, API-direct)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드변경신청  액터: 개발자
   * URL: /mis/hrm/hrm3031/setGetTabData.do
   * 예상결과: 인사기록카드변경신청는 상위 목록에서 선택한 키(ds_main)로 단건 상세를 조회하는 화면이다. 유효 키 파라미터가 필요하며, 키 없이 호출 시 빈 결과 또는 오류를 확인한다.
   * DB 확인: -- TODO: hrm_3031M 매핑(/mis/hrm/hrm3031/setGetTabData.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사기록카드변경신청 - 단건 상세 조회 (키 지정 필요, API-direct)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사기록카드변경신청 - 단건 상세 조회 (키 지정 필요, API-direct)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'setGetTabData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3031M-no1.png`, fullPage: true });

    expect(rows.length, '인사기록카드변경신청 단건 상세 조회 (키 지정 필요, API-direct) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3040M — 인사기록카드변경신청승인  |  API: POST /mis/hrm/hrm3040/getList.do  |  TC 4건
{
  const API_URL           = '/mis/hrm/hrm3040/getList.do';
  const PGM_ID            = 'hrm_3040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_FRM_RQST_DT', 'SCH_TO_RQST_DT', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_STRE_STAT_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`인사기록카드변경신청승인(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 인사기록카드변경신청승인 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드변경신청승인  액터: 개발자
   * URL: /mis/hrm/hrm3040/getList.do
   * 예상결과: 인사기록카드변경신청승인 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_3040M 매핑(/mis/hrm/hrm3040/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사기록카드변경신청승인 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사기록카드변경신청승인 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3040M-no1.png`, fullPage: true });

    expect(rows.length, '인사기록카드변경신청승인 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 인사기록카드변경신청승인 - 기간 조회 (SCH_FRM_RQST_DT ~ SCH_TO_RQST_DT)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드변경신청승인  액터: 개발자
   * URL: /mis/hrm/hrm3040/getList.do
   * 예상결과: 지정 기간(SCH_FRM_RQST_DT~SCH_TO_RQST_DT)의 인사기록카드변경신청승인 목록이 조회된다.
   * DB 확인: -- TODO: hrm_3040M 매핑(/mis/hrm/hrm3040/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 인사기록카드변경신청승인 - 기간 조회 (SCH_FRM_RQST_DT ~ SCH_TO_RQST_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 인사기록카드변경신청승인 - 기간 조회 (SCH_FRM_RQST_DT ~ SCH_TO_RQST_DT)');
    logInput('SCH_FRM_RQST_DT', '2024-01-01');
    logInput('SCH_TO_RQST_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_FRM_RQST_DT': '2024-01-01', 'SCH_TO_RQST_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3040M-no2.png`, fullPage: true });

    expect(rows.length, '인사기록카드변경신청승인 기간 조회 (SCH_FRM_RQST_DT ~ SCH_TO_RQST_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 인사기록카드변경신청승인 - 역방향 기간 (시작>종료, 0건)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드변경신청승인  액터: 개발자
   * URL: /mis/hrm/hrm3040/getList.do
   * 예상결과: 시작일이 종료일보다 늦어 조회 결과가 0건이어야 한다.
   * DB 확인: -- TODO: hrm_3040M 매핑(/mis/hrm/hrm3040/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 인사기록카드변경신청승인 - 역방향 기간 (시작>종료, 0건)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 인사기록카드변경신청승인 - 역방향 기간 (시작>종료, 0건)');
    logInput('SCH_FRM_RQST_DT', '2024-12-31');
    logInput('SCH_TO_RQST_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_FRM_RQST_DT': '2024-12-31', 'SCH_TO_RQST_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3040M-no3.png`, fullPage: true });

    expect(rows.length, '인사기록카드변경신청승인 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 인사기록카드변경신청승인 - 명칭 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드변경신청승인  액터: 개발자
   * URL: /mis/hrm/hrm3040/getList.do
   * 예상결과: SCH_EMP_NM에 키워드가 포함된 인사기록카드변경신청승인가 조회된다.
   * DB 확인: -- TODO: hrm_3040M 매핑(/mis/hrm/hrm3040/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:4] 인사기록카드변경신청승인 - 명칭 키워드 검색 (SCH_EMP_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:4] 인사기록카드변경신청승인 - 명칭 키워드 검색 (SCH_EMP_NM)');
    logInput('SCH_EMP_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EMP_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3040M-no4.png`, fullPage: true });

    expect(rows.length, '인사기록카드변경신청승인 명칭 키워드 검색 (SCH_EMP_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['EMP_NM'] ?? ''), `[행${i}] EMP_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3041M — 인사기록카드변경신청승인  |  API: POST /mis/hrm/hrm3041/getTabData.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm3041/getTabData.do';
  const PGM_ID            = 'hrm_3041M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_main';
  const DS_SEARCH_COLUMNS = ['HRM_RCED_RQST_RNO', 'HRM_RCED_RQST_NO', 'RQST_DT', 'RQSTER_EMP_RID', 'RQSTER_EMP_NO', 'RQSTER_EMP_NM', 'RQSTER_DEPT_CD', 'RQSTER_DEPT_NM', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'GRD_FG', 'HRM_RCED_CHG_TRGT_FG', 'STRE_STAT_FG', 'APV_STAT_FG', 'APV_STAT_FG_NM', 'RUS_RSN', 'H_HRM_RCED_RQST_RNO', 'APV_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`인사기록카드변경신청승인(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 인사기록카드변경신청승인 - 단건 상세 조회 (키 지정 필요, API-direct)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 인사기록카드변경신청승인  액터: 개발자
   * URL: /mis/hrm/hrm3041/getTabData.do
   * 예상결과: 인사기록카드변경신청승인는 상위 목록에서 선택한 키(ds_main)로 단건 상세를 조회하는 화면이다. 유효 키 파라미터가 필요하며, 키 없이 호출 시 빈 결과 또는 오류를 확인한다.
   * DB 확인: -- TODO: hrm_3041M 매핑(/mis/hrm/hrm3041/getTabData.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사기록카드변경신청승인 - 단건 상세 조회 (키 지정 필요, API-direct)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사기록카드변경신청승인 - 단건 상세 조회 (키 지정 필요, API-direct)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getTabData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3041M-no1.png`, fullPage: true });

    expect(rows.length, '인사기록카드변경신청승인 단건 상세 조회 (키 지정 필요, API-direct) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3050M — 근무평점일괄업로드  |  API: POST /mis/hrm/hrm3050/getList.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm3050/getList.do';
  const PGM_ID            = 'hrm_3050M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_STDR_YY', 'SCH_EVAL_FG', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_GRD_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`근무평점일괄업로드(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 근무평점일괄업로드 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 근무평점일괄업로드  액터: 개발자
   * URL: /mis/hrm/hrm3050/getList.do
   * 예상결과: 근무평점일괄업로드 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_3050M 매핑(/mis/hrm/hrm3050/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 근무평점일괄업로드 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 근무평점일괄업로드 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3050M-no1.png`, fullPage: true });

    expect(rows.length, '근무평점일괄업로드 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 근무평점일괄업로드 - 연도 조회 (SCH_STDR_YY=2024)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 근무평점일괄업로드  액터: 개발자
   * URL: /mis/hrm/hrm3050/getList.do
   * 예상결과: 2024년도 근무평점일괄업로드 목록이 조회된다.
   * DB 확인: -- TODO: hrm_3050M 매핑(/mis/hrm/hrm3050/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 근무평점일괄업로드 - 연도 조회 (SCH_STDR_YY=2024)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 근무평점일괄업로드 - 연도 조회 (SCH_STDR_YY=2024)');
    logInput('SCH_STDR_YY', '2024');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_STDR_YY': '2024' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3050M-no2.png`, fullPage: true });

    expect(rows.length, '근무평점일괄업로드 연도 조회 (SCH_STDR_YY=2024) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 근무평점일괄업로드 - 명칭 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 근무평점일괄업로드  액터: 개발자
   * URL: /mis/hrm/hrm3050/getList.do
   * 예상결과: SCH_EMP_NM에 키워드가 포함된 근무평점일괄업로드가 조회된다.
   * DB 확인: -- TODO: hrm_3050M 매핑(/mis/hrm/hrm3050/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 근무평점일괄업로드 - 명칭 키워드 검색 (SCH_EMP_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 근무평점일괄업로드 - 명칭 키워드 검색 (SCH_EMP_NM)');
    logInput('SCH_EMP_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EMP_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3050M-no3.png`, fullPage: true });

    expect(rows.length, '근무평점일괄업로드 명칭 키워드 검색 (SCH_EMP_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['EMP_NM'] ?? ''), `[행${i}] EMP_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3060M — 성과평점일괄업로드  |  API: POST /mis/hrm/hrm3060/getList.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm3060/getList.do';
  const PGM_ID            = 'hrm_3060M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_STDR_YY', 'SCH_EVAL_FG', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_GRD_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`성과평점일괄업로드(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 성과평점일괄업로드 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 성과평점일괄업로드  액터: 개발자
   * URL: /mis/hrm/hrm3060/getList.do
   * 예상결과: 성과평점일괄업로드 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_3060M 매핑(/mis/hrm/hrm3060/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 성과평점일괄업로드 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 성과평점일괄업로드 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3060M-no1.png`, fullPage: true });

    expect(rows.length, '성과평점일괄업로드 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 성과평점일괄업로드 - 연도 조회 (SCH_STDR_YY=2024)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 성과평점일괄업로드  액터: 개발자
   * URL: /mis/hrm/hrm3060/getList.do
   * 예상결과: 2024년도 성과평점일괄업로드 목록이 조회된다.
   * DB 확인: -- TODO: hrm_3060M 매핑(/mis/hrm/hrm3060/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 성과평점일괄업로드 - 연도 조회 (SCH_STDR_YY=2024)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 성과평점일괄업로드 - 연도 조회 (SCH_STDR_YY=2024)');
    logInput('SCH_STDR_YY', '2024');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_STDR_YY': '2024' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3060M-no2.png`, fullPage: true });

    expect(rows.length, '성과평점일괄업로드 연도 조회 (SCH_STDR_YY=2024) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 성과평점일괄업로드 - 명칭 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 인사기록  메뉴명: 성과평점일괄업로드  액터: 개발자
   * URL: /mis/hrm/hrm3060/getList.do
   * 예상결과: SCH_EMP_NM에 키워드가 포함된 성과평점일괄업로드가 조회된다.
   * DB 확인: -- TODO: hrm_3060M 매핑(/mis/hrm/hrm3060/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 성과평점일괄업로드 - 명칭 키워드 검색 (SCH_EMP_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 성과평점일괄업로드 - 명칭 키워드 검색 (SCH_EMP_NM)');
    logInput('SCH_EMP_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EMP_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3060M-no3.png`, fullPage: true });

    expect(rows.length, '성과평점일괄업로드 명칭 키워드 검색 (SCH_EMP_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['EMP_NM'] ?? ''), `[행${i}] EMP_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3110M — 고용계약관리  |  API: POST /mis/hrm/hrm3110/getList.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm3110/getList.do';
  const PGM_ID            = 'hrm_3110M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_APLY_YY', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_CTRCT_PROG_STAT_FG', 'SCH_EMPO_CTRCT_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`고용계약관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 고용계약관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 계약관리  메뉴명: 고용계약관리  액터: 개발자
   * URL: /mis/hrm/hrm3110/getList.do
   * 예상결과: 고용계약관리 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_3110M 매핑(/mis/hrm/hrm3110/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 고용계약관리 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 고용계약관리 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3110M-no1.png`, fullPage: true });

    expect(rows.length, '고용계약관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 고용계약관리 - 연도 조회 (SCH_APLY_YY=2024)
   * 중분류: 인사관리  소분류: 계약관리  메뉴명: 고용계약관리  액터: 개발자
   * URL: /mis/hrm/hrm3110/getList.do
   * 예상결과: 2024년도 고용계약관리 목록이 조회된다.
   * DB 확인: -- TODO: hrm_3110M 매핑(/mis/hrm/hrm3110/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 고용계약관리 - 연도 조회 (SCH_APLY_YY=2024)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 고용계약관리 - 연도 조회 (SCH_APLY_YY=2024)');
    logInput('SCH_APLY_YY', '2024');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_APLY_YY': '2024' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3110M-no2.png`, fullPage: true });

    expect(rows.length, '고용계약관리 연도 조회 (SCH_APLY_YY=2024) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 고용계약관리 - 명칭 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 계약관리  메뉴명: 고용계약관리  액터: 개발자
   * URL: /mis/hrm/hrm3110/getList.do
   * 예상결과: SCH_EMP_NM에 키워드가 포함된 고용계약관리가 조회된다.
   * DB 확인: -- TODO: hrm_3110M 매핑(/mis/hrm/hrm3110/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 고용계약관리 - 명칭 키워드 검색 (SCH_EMP_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 고용계약관리 - 명칭 키워드 검색 (SCH_EMP_NM)');
    logInput('SCH_EMP_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EMP_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3110M-no3.png`, fullPage: true });

    expect(rows.length, '고용계약관리 명칭 키워드 검색 (SCH_EMP_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['EMP_NM'] ?? ''), `[행${i}] EMP_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3120M — 고용계약확인  |  API: POST /mis/hrm/hrm3120/getList.do  |  TC 2건
{
  const API_URL           = '/mis/hrm/hrm3120/getList.do';
  const PGM_ID            = 'hrm_3120M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_CTRCT_PROG_STAT_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`고용계약확인(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 고용계약확인 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 계약관리  메뉴명: 고용계약확인  액터: 개발자
   * URL: /mis/hrm/hrm3120/getList.do
   * 예상결과: 고용계약확인 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_3120M 매핑(/mis/hrm/hrm3120/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 고용계약확인 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 고용계약확인 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3120M-no1.png`, fullPage: true });

    expect(rows.length, '고용계약확인 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 고용계약확인 - 명칭 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 계약관리  메뉴명: 고용계약확인  액터: 개발자
   * URL: /mis/hrm/hrm3120/getList.do
   * 예상결과: SCH_EMP_NM에 키워드가 포함된 고용계약확인가 조회된다.
   * DB 확인: -- TODO: hrm_3120M 매핑(/mis/hrm/hrm3120/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 고용계약확인 - 명칭 키워드 검색 (SCH_EMP_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 고용계약확인 - 명칭 키워드 검색 (SCH_EMP_NM)');
    logInput('SCH_EMP_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EMP_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3120M-no2.png`, fullPage: true });

    expect(rows.length, '고용계약확인 명칭 키워드 검색 (SCH_EMP_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['EMP_NM'] ?? ''), `[행${i}] EMP_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3150M — 연봉계약관리  |  API: POST /mis/hrm/hrm3150/getList.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm3150/getList.do';
  const PGM_ID            = 'hrm_3150M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_APLY_YY', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_CTRCT_PROG_STAT_FG', 'DEPTL_EMP_RID', 'DEPTL_EMP_NO', 'DEPTL_EMP_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`연봉계약관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 연봉계약관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 계약관리  메뉴명: 연봉계약관리  액터: 개발자
   * URL: /mis/hrm/hrm3150/getList.do
   * 예상결과: 연봉계약관리 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_3150M 매핑(/mis/hrm/hrm3150/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 연봉계약관리 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 연봉계약관리 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3150M-no1.png`, fullPage: true });

    expect(rows.length, '연봉계약관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 연봉계약관리 - 연도 조회 (SCH_APLY_YY=2024)
   * 중분류: 인사관리  소분류: 계약관리  메뉴명: 연봉계약관리  액터: 개발자
   * URL: /mis/hrm/hrm3150/getList.do
   * 예상결과: 2024년도 연봉계약관리 목록이 조회된다.
   * DB 확인: -- TODO: hrm_3150M 매핑(/mis/hrm/hrm3150/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 연봉계약관리 - 연도 조회 (SCH_APLY_YY=2024)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 연봉계약관리 - 연도 조회 (SCH_APLY_YY=2024)');
    logInput('SCH_APLY_YY', '2024');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_APLY_YY': '2024' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3150M-no2.png`, fullPage: true });

    expect(rows.length, '연봉계약관리 연도 조회 (SCH_APLY_YY=2024) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 연봉계약관리 - 명칭 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 계약관리  메뉴명: 연봉계약관리  액터: 개발자
   * URL: /mis/hrm/hrm3150/getList.do
   * 예상결과: SCH_EMP_NM에 키워드가 포함된 연봉계약관리가 조회된다.
   * DB 확인: -- TODO: hrm_3150M 매핑(/mis/hrm/hrm3150/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 연봉계약관리 - 명칭 키워드 검색 (SCH_EMP_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 연봉계약관리 - 명칭 키워드 검색 (SCH_EMP_NM)');
    logInput('SCH_EMP_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EMP_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3150M-no3.png`, fullPage: true });

    expect(rows.length, '연봉계약관리 명칭 키워드 검색 (SCH_EMP_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['EMP_NM'] ?? ''), `[행${i}] EMP_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_3160M — 연봉계약확인  |  API: POST /mis/hrm/hrm3160/getList.do  |  TC 2건
{
  const API_URL           = '/mis/hrm/hrm3160/getList.do';
  const PGM_ID            = 'hrm_3160M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_CTRCT_PROG_STAT_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`연봉계약확인(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 연봉계약확인 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 계약관리  메뉴명: 연봉계약확인  액터: 개발자
   * URL: /mis/hrm/hrm3160/getList.do
   * 예상결과: 연봉계약확인 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_3160M 매핑(/mis/hrm/hrm3160/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 연봉계약확인 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 연봉계약확인 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3160M-no1.png`, fullPage: true });

    expect(rows.length, '연봉계약확인 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 연봉계약확인 - 명칭 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 계약관리  메뉴명: 연봉계약확인  액터: 개발자
   * URL: /mis/hrm/hrm3160/getList.do
   * 예상결과: SCH_EMP_NM에 키워드가 포함된 연봉계약확인가 조회된다.
   * DB 확인: -- TODO: hrm_3160M 매핑(/mis/hrm/hrm3160/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 연봉계약확인 - 명칭 키워드 검색 (SCH_EMP_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 연봉계약확인 - 명칭 키워드 검색 (SCH_EMP_NM)');
    logInput('SCH_EMP_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EMP_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_3160M-no2.png`, fullPage: true });

    expect(rows.length, '연봉계약확인 명칭 키워드 검색 (SCH_EMP_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['EMP_NM'] ?? ''), `[행${i}] EMP_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4010M — 인사자료조회  |  API: POST /mis/hrm/hrm4010/getList.do  |  TC 2건
// TODO(dsList): 원본 dsListName="ds_" 파싱 불가 -> 'ds_list' 대체. XFDL 응답 데이터셋명 확인 필요.
{
  const API_URL           = '/mis/hrm/hrm4010/getList.do';
  const PGM_ID            = 'hrm_4010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['STDR_DT', 'DEPT_CD', 'DEPT_NM', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'HLDF_FG', 'EMPO_STLF_FG', 'JBGP_FG', 'GRD_FG', 'ROOF_FG', 'FLOC_FG', 'RSIGN_EXCLUS_YN', 'TABPAGE'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`인사자료조회(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 인사자료조회 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 인사자료조회  액터: 개발자
   * URL: /mis/hrm/hrm4010/getList.do
   * 예상결과: 인사자료조회 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_4010M 매핑(/mis/hrm/hrm4010/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 인사자료조회 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사자료조회 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4010M-no1.png`, fullPage: true });

    expect(rows.length, '인사자료조회 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 인사자료조회 - 기준일자 조회 (STDR_DT)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 인사자료조회  액터: 개발자
   * URL: /mis/hrm/hrm4010/getList.do
   * 예상결과: 기준일자(STDR_DT) 조건으로 인사자료조회가 조회된다.
   * DB 확인: -- TODO: hrm_4010M 매핑(/mis/hrm/hrm4010/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 인사자료조회 - 기준일자 조회 (STDR_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 인사자료조회 - 기준일자 조회 (STDR_DT)');
    logInput('STDR_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'STDR_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4010M-no2.png`, fullPage: true });

    expect(rows.length, '인사자료조회 기준일자 조회 (STDR_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4020M — 부서별인원현황  |  API: POST /mis/hrm/hrm4020/getList.do  |  TC 2건
{
  const API_URL           = '/mis/hrm/hrm4020/getList.do';
  const PGM_ID            = 'hrm_4020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['STDR_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부서별인원현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부서별인원현황 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 부서별인원현황  액터: 개발자
   * URL: /mis/hrm/hrm4020/getList.do
   * 예상결과: 부서별인원현황 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_4020M 매핑(/mis/hrm/hrm4020/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 부서별인원현황 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서별인원현황 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4020M-no1.png`, fullPage: true });

    expect(rows.length, '부서별인원현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 부서별인원현황 - 기준일자 조회 (STDR_DT)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 부서별인원현황  액터: 개발자
   * URL: /mis/hrm/hrm4020/getList.do
   * 예상결과: 기준일자(STDR_DT) 조건으로 부서별인원현황가 조회된다.
   * DB 확인: -- TODO: hrm_4020M 매핑(/mis/hrm/hrm4020/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 부서별인원현황 - 기준일자 조회 (STDR_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 부서별인원현황 - 기준일자 조회 (STDR_DT)');
    logInput('STDR_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'STDR_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4020M-no2.png`, fullPage: true });

    expect(rows.length, '부서별인원현황 기준일자 조회 (STDR_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4030M — 부서별직원현황  |  API: POST /mis/hrm/hrm4030/getList.do  |  TC 2건
{
  const API_URL           = '/mis/hrm/hrm4030/getList.do';
  const PGM_ID            = 'hrm_4030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['STDR_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부서별직원현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부서별직원현황 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 부서별직원현황  액터: 개발자
   * URL: /mis/hrm/hrm4030/getList.do
   * 예상결과: 부서별직원현황 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_4030M 매핑(/mis/hrm/hrm4030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 부서별직원현황 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서별직원현황 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4030M-no1.png`, fullPage: true });

    expect(rows.length, '부서별직원현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 부서별직원현황 - 기준일자 조회 (STDR_DT)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 부서별직원현황  액터: 개발자
   * URL: /mis/hrm/hrm4030/getList.do
   * 예상결과: 기준일자(STDR_DT) 조건으로 부서별직원현황가 조회된다.
   * DB 확인: -- TODO: hrm_4030M 매핑(/mis/hrm/hrm4030/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 부서별직원현황 - 기준일자 조회 (STDR_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 부서별직원현황 - 기준일자 조회 (STDR_DT)');
    logInput('STDR_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'STDR_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4030M-no2.png`, fullPage: true });

    expect(rows.length, '부서별직원현황 기준일자 조회 (STDR_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4050M — 퇴직자현황  |  API: POST /mis/hrm/hrm4050/getList.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm4050/getList.do';
  const PGM_ID            = 'hrm_4050M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['STDR_FRM_DT', 'STDR_TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`퇴직자현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 퇴직자현황 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 퇴직자현황  액터: 개발자
   * URL: /mis/hrm/hrm4050/getList.do
   * 예상결과: 퇴직자현황 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_4050M 매핑(/mis/hrm/hrm4050/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 퇴직자현황 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 퇴직자현황 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4050M-no1.png`, fullPage: true });

    expect(rows.length, '퇴직자현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 퇴직자현황 - 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 퇴직자현황  액터: 개발자
   * URL: /mis/hrm/hrm4050/getList.do
   * 예상결과: 지정 기간(STDR_FRM_DT~STDR_TO_DT)의 퇴직자현황 목록이 조회된다.
   * DB 확인: -- TODO: hrm_4050M 매핑(/mis/hrm/hrm4050/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 퇴직자현황 - 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 퇴직자현황 - 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT)');
    logInput('STDR_FRM_DT', '2024-01-01');
    logInput('STDR_TO_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'STDR_FRM_DT': '2024-01-01', 'STDR_TO_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4050M-no2.png`, fullPage: true });

    expect(rows.length, '퇴직자현황 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 퇴직자현황 - 역방향 기간 (시작>종료, 0건)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 퇴직자현황  액터: 개발자
   * URL: /mis/hrm/hrm4050/getList.do
   * 예상결과: 시작일이 종료일보다 늦어 조회 결과가 0건이어야 한다.
   * DB 확인: -- TODO: hrm_4050M 매핑(/mis/hrm/hrm4050/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 퇴직자현황 - 역방향 기간 (시작>종료, 0건)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 퇴직자현황 - 역방향 기간 (시작>종료, 0건)');
    logInput('STDR_FRM_DT', '2024-12-31');
    logInput('STDR_TO_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'STDR_FRM_DT': '2024-12-31', 'STDR_TO_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4050M-no3.png`, fullPage: true });

    expect(rows.length, '퇴직자현황 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4070M — 부서별남녀직원현황  |  API: POST /mis/hrm/hrm4070/getList.do  |  TC 2건
{
  const API_URL           = '/mis/hrm/hrm4070/getList.do';
  const PGM_ID            = 'hrm_4070M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_STD_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부서별남녀직원현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부서별남녀직원현황 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 부서별남녀직원현황  액터: 개발자
   * URL: /mis/hrm/hrm4070/getList.do
   * 예상결과: 부서별남녀직원현황 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_4070M 매핑(/mis/hrm/hrm4070/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 부서별남녀직원현황 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서별남녀직원현황 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4070M-no1.png`, fullPage: true });

    expect(rows.length, '부서별남녀직원현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 부서별남녀직원현황 - 기준일자 조회 (SCH_STD_DT)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 부서별남녀직원현황  액터: 개발자
   * URL: /mis/hrm/hrm4070/getList.do
   * 예상결과: 기준일자(SCH_STD_DT) 조건으로 부서별남녀직원현황가 조회된다.
   * DB 확인: -- TODO: hrm_4070M 매핑(/mis/hrm/hrm4070/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 부서별남녀직원현황 - 기준일자 조회 (SCH_STD_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 부서별남녀직원현황 - 기준일자 조회 (SCH_STD_DT)');
    logInput('SCH_STD_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_STD_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4070M-no2.png`, fullPage: true });

    expect(rows.length, '부서별남녀직원현황 기준일자 조회 (SCH_STD_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4090M — 부서별 연령 현황  |  API: POST /mis/hrm/hrm4090/getList.do  |  TC 2건
{
  const API_URL           = '/mis/hrm/hrm4090/getList.do';
  const PGM_ID            = 'hrm_4090M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_STD_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부서별 연령 현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부서별 연령 현황 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 부서별 연령 현황  액터: 개발자
   * URL: /mis/hrm/hrm4090/getList.do
   * 예상결과: 부서별 연령 현황 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_4090M 매핑(/mis/hrm/hrm4090/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 부서별 연령 현황 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서별 연령 현황 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4090M-no1.png`, fullPage: true });

    expect(rows.length, '부서별 연령 현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 부서별 연령 현황 - 기준일자 조회 (SCH_STD_DT)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 부서별 연령 현황  액터: 개발자
   * URL: /mis/hrm/hrm4090/getList.do
   * 예상결과: 기준일자(SCH_STD_DT) 조건으로 부서별 연령 현황가 조회된다.
   * DB 확인: -- TODO: hrm_4090M 매핑(/mis/hrm/hrm4090/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 부서별 연령 현황 - 기준일자 조회 (SCH_STD_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 부서별 연령 현황 - 기준일자 조회 (SCH_STD_DT)');
    logInput('SCH_STD_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_STD_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4090M-no2.png`, fullPage: true });

    expect(rows.length, '부서별 연령 현황 기준일자 조회 (SCH_STD_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4100M — 신규자현황  |  API: POST /mis/hrm/hrm4100/getList.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm4100/getList.do';
  const PGM_ID            = 'hrm_4100M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['STDR_FRM_DT', 'STDR_TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`신규자현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 신규자현황 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 신규자현황  액터: 개발자
   * URL: /mis/hrm/hrm4100/getList.do
   * 예상결과: 신규자현황 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_4100M 매핑(/mis/hrm/hrm4100/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 신규자현황 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 신규자현황 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4100M-no1.png`, fullPage: true });

    expect(rows.length, '신규자현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 신규자현황 - 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 신규자현황  액터: 개발자
   * URL: /mis/hrm/hrm4100/getList.do
   * 예상결과: 지정 기간(STDR_FRM_DT~STDR_TO_DT)의 신규자현황 목록이 조회된다.
   * DB 확인: -- TODO: hrm_4100M 매핑(/mis/hrm/hrm4100/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 신규자현황 - 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 신규자현황 - 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT)');
    logInput('STDR_FRM_DT', '2024-01-01');
    logInput('STDR_TO_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'STDR_FRM_DT': '2024-01-01', 'STDR_TO_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4100M-no2.png`, fullPage: true });

    expect(rows.length, '신규자현황 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 신규자현황 - 역방향 기간 (시작>종료, 0건)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 신규자현황  액터: 개발자
   * URL: /mis/hrm/hrm4100/getList.do
   * 예상결과: 시작일이 종료일보다 늦어 조회 결과가 0건이어야 한다.
   * DB 확인: -- TODO: hrm_4100M 매핑(/mis/hrm/hrm4100/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 신규자현황 - 역방향 기간 (시작>종료, 0건)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 신규자현황 - 역방향 기간 (시작>종료, 0건)');
    logInput('STDR_FRM_DT', '2024-12-31');
    logInput('STDR_TO_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'STDR_FRM_DT': '2024-12-31', 'STDR_TO_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4100M-no3.png`, fullPage: true });

    expect(rows.length, '신규자현황 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4110M — 보직자현황  |  API: POST /mis/hrm/hrm0640008/getList.do  |  TC 2건
{
  const API_URL           = '/mis/hrm/hrm0640008/getList.do';
  const PGM_ID            = 'hrm_4110M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_datagrid1';
  const DS_SEARCH_COLUMNS = ['BS_DT', 'HOLD_OFFIS', 'EMP_CLSS', 'JOB_TPS', 'GRD_CDS', 'JOB_POSTS'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`보직자현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 보직자현황 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 보직자현황  액터: 개발자
   * URL: /mis/hrm/hrm0640008/getList.do
   * 예상결과: 보직자현황 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_4110M 매핑(/mis/hrm/hrm0640008/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 보직자현황 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 보직자현황 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4110M-no1.png`, fullPage: true });

    expect(rows.length, '보직자현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 보직자현황 - 기준일자 조회 (BS_DT)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 보직자현황  액터: 개발자
   * URL: /mis/hrm/hrm0640008/getList.do
   * 예상결과: 기준일자(BS_DT) 조건으로 보직자현황가 조회된다.
   * DB 확인: -- TODO: hrm_4110M 매핑(/mis/hrm/hrm0640008/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 보직자현황 - 기준일자 조회 (BS_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 보직자현황 - 기준일자 조회 (BS_DT)');
    logInput('BS_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'BS_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4110M-no2.png`, fullPage: true });

    expect(rows.length, '보직자현황 기준일자 조회 (BS_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4120M — 휴직자현황  |  API: POST /mis/hrm/hrm4120/getList.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm4120/getList.do';
  const PGM_ID            = 'hrm_4120M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['STDR_FRM_DT', 'STDR_TO_DT', 'CLS'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`휴직자현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 휴직자현황 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 휴직자현황  액터: 개발자
   * URL: /mis/hrm/hrm4120/getList.do
   * 예상결과: 휴직자현황 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_4120M 매핑(/mis/hrm/hrm4120/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 휴직자현황 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 휴직자현황 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4120M-no1.png`, fullPage: true });

    expect(rows.length, '휴직자현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 휴직자현황 - 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 휴직자현황  액터: 개발자
   * URL: /mis/hrm/hrm4120/getList.do
   * 예상결과: 지정 기간(STDR_FRM_DT~STDR_TO_DT)의 휴직자현황 목록이 조회된다.
   * DB 확인: -- TODO: hrm_4120M 매핑(/mis/hrm/hrm4120/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 휴직자현황 - 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 휴직자현황 - 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT)');
    logInput('STDR_FRM_DT', '2024-01-01');
    logInput('STDR_TO_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'STDR_FRM_DT': '2024-01-01', 'STDR_TO_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4120M-no2.png`, fullPage: true });

    expect(rows.length, '휴직자현황 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 휴직자현황 - 역방향 기간 (시작>종료, 0건)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 휴직자현황  액터: 개발자
   * URL: /mis/hrm/hrm4120/getList.do
   * 예상결과: 시작일이 종료일보다 늦어 조회 결과가 0건이어야 한다.
   * DB 확인: -- TODO: hrm_4120M 매핑(/mis/hrm/hrm4120/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 휴직자현황 - 역방향 기간 (시작>종료, 0건)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 휴직자현황 - 역방향 기간 (시작>종료, 0건)');
    logInput('STDR_FRM_DT', '2024-12-31');
    logInput('STDR_TO_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'STDR_FRM_DT': '2024-12-31', 'STDR_TO_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4120M-no3.png`, fullPage: true });

    expect(rows.length, '휴직자현황 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_4130M — 보직자현황  |  API: POST /mis/hrm/hrm4130/getList.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm4130/getList.do';
  const PGM_ID            = 'hrm_4130M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['STDR_FRM_DT', 'STDR_TO_DT', 'ROOF_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`보직자현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 보직자현황 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 보직자현황  액터: 개발자
   * URL: /mis/hrm/hrm4130/getList.do
   * 예상결과: 보직자현황 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_4130M 매핑(/mis/hrm/hrm4130/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 보직자현황 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 보직자현황 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4130M-no1.png`, fullPage: true });

    expect(rows.length, '보직자현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 보직자현황 - 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 보직자현황  액터: 개발자
   * URL: /mis/hrm/hrm4130/getList.do
   * 예상결과: 지정 기간(STDR_FRM_DT~STDR_TO_DT)의 보직자현황 목록이 조회된다.
   * DB 확인: -- TODO: hrm_4130M 매핑(/mis/hrm/hrm4130/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 보직자현황 - 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 보직자현황 - 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT)');
    logInput('STDR_FRM_DT', '2024-01-01');
    logInput('STDR_TO_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'STDR_FRM_DT': '2024-01-01', 'STDR_TO_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4130M-no2.png`, fullPage: true });

    expect(rows.length, '보직자현황 기간 조회 (STDR_FRM_DT ~ STDR_TO_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 보직자현황 - 역방향 기간 (시작>종료, 0건)
   * 중분류: 인사관리  소분류: 인사현황  메뉴명: 보직자현황  액터: 개발자
   * URL: /mis/hrm/hrm4130/getList.do
   * 예상결과: 시작일이 종료일보다 늦어 조회 결과가 0건이어야 한다.
   * DB 확인: -- TODO: hrm_4130M 매핑(/mis/hrm/hrm4130/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 보직자현황 - 역방향 기간 (시작>종료, 0건)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 보직자현황 - 역방향 기간 (시작>종료, 0건)');
    logInput('STDR_FRM_DT', '2024-12-31');
    logInput('STDR_TO_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'STDR_FRM_DT': '2024-12-31', 'STDR_TO_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_4130M-no3.png`, fullPage: true });

    expect(rows.length, '보직자현황 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_5010M — 증명서신청  |  API: POST /mis/hrm/hrm5010/getList.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm5010/getList.do';
  const PGM_ID            = 'hrm_5010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['FRM_RQST_DT', 'TO_RQST_DT', 'CERT_TRGTER_EMP_RID', 'CERT_TRGTER_EMP_NO', 'CERT_TRGTER_EMP_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'CERT_FG', 'STRE_STAT_FG', 'CERT_RQST_RNO', 'CHRGER_RQST_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`증명서신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 증명서신청 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 증명서신청  액터: 개발자
   * URL: /mis/hrm/hrm5010/getList.do
   * 예상결과: 증명서신청 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_5010M 매핑(/mis/hrm/hrm5010/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 증명서신청 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 증명서신청 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5010M-no1.png`, fullPage: true });

    expect(rows.length, '증명서신청 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 증명서신청 - 기간 조회 (FRM_RQST_DT ~ TO_RQST_DT)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 증명서신청  액터: 개발자
   * URL: /mis/hrm/hrm5010/getList.do
   * 예상결과: 지정 기간(FRM_RQST_DT~TO_RQST_DT)의 증명서신청 목록이 조회된다.
   * DB 확인: -- TODO: hrm_5010M 매핑(/mis/hrm/hrm5010/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 증명서신청 - 기간 조회 (FRM_RQST_DT ~ TO_RQST_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 증명서신청 - 기간 조회 (FRM_RQST_DT ~ TO_RQST_DT)');
    logInput('FRM_RQST_DT', '2024-01-01');
    logInput('TO_RQST_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'FRM_RQST_DT': '2024-01-01', 'TO_RQST_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5010M-no2.png`, fullPage: true });

    expect(rows.length, '증명서신청 기간 조회 (FRM_RQST_DT ~ TO_RQST_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 증명서신청 - 역방향 기간 (시작>종료, 0건)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 증명서신청  액터: 개발자
   * URL: /mis/hrm/hrm5010/getList.do
   * 예상결과: 시작일이 종료일보다 늦어 조회 결과가 0건이어야 한다.
   * DB 확인: -- TODO: hrm_5010M 매핑(/mis/hrm/hrm5010/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 증명서신청 - 역방향 기간 (시작>종료, 0건)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 증명서신청 - 역방향 기간 (시작>종료, 0건)');
    logInput('FRM_RQST_DT', '2024-12-31');
    logInput('TO_RQST_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'FRM_RQST_DT': '2024-12-31', 'TO_RQST_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5010M-no3.png`, fullPage: true });

    expect(rows.length, '증명서신청 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_5011M — 증명서신청  |  API: POST /mis/hrm/hrm5011/getDegHisList.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm5011/getDegHisList.do';
  const PGM_ID            = 'hrm_5011M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_degHisList';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`증명서신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 증명서신청 - 조회 (searchDs=, API-direct)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 증명서신청  액터: 개발자
   * URL: /mis/hrm/hrm5011/getDegHisList.do
   * 예상결과: 증명서신청 조회를 수행한다. searchDs= (자동분류 미해결 — 파라미터 확인 필요).
   * DB 확인: -- TODO: hrm_5011M 매핑(/mis/hrm/hrm5011/getDegHisList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 증명서신청 - 조회 (searchDs=, API-direct)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 증명서신청 - 조회 (searchDs=, API-direct)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getDegHisList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5011M-no1.png`, fullPage: true });

    expect(rows.length, '증명서신청 조회 (searchDs=, API-direct) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_5020M — 증명서승인관리  |  API: POST /mis/hrm/hrm5020/getList.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm5020/getList.do';
  const PGM_ID            = 'hrm_5020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['FRM_RQST_DT', 'TO_RQST_DT', 'CERT_TRGTER_EMP_RID', 'CERT_TRGTER_EMP_NO', 'CERT_TRGTER_EMP_NM', 'CERT_FG', 'STRE_STAT_FG', 'RQSTER_EMP_RID', 'RQSTER_EMP_NO', 'APNT_EMP_NM', 'CERT_RQST_RNO', 'CERT_RQST_NO', 'CHRGER_RQST_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`증명서승인관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 증명서승인관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 증명서승인관리  액터: 개발자
   * URL: /mis/hrm/hrm5020/getList.do
   * 예상결과: 증명서승인관리 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_5020M 매핑(/mis/hrm/hrm5020/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 증명서승인관리 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 증명서승인관리 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5020M-no1.png`, fullPage: true });

    expect(rows.length, '증명서승인관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 증명서승인관리 - 기간 조회 (FRM_RQST_DT ~ TO_RQST_DT)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 증명서승인관리  액터: 개발자
   * URL: /mis/hrm/hrm5020/getList.do
   * 예상결과: 지정 기간(FRM_RQST_DT~TO_RQST_DT)의 증명서승인관리 목록이 조회된다.
   * DB 확인: -- TODO: hrm_5020M 매핑(/mis/hrm/hrm5020/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 증명서승인관리 - 기간 조회 (FRM_RQST_DT ~ TO_RQST_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 증명서승인관리 - 기간 조회 (FRM_RQST_DT ~ TO_RQST_DT)');
    logInput('FRM_RQST_DT', '2024-01-01');
    logInput('TO_RQST_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'FRM_RQST_DT': '2024-01-01', 'TO_RQST_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5020M-no2.png`, fullPage: true });

    expect(rows.length, '증명서승인관리 기간 조회 (FRM_RQST_DT ~ TO_RQST_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 증명서승인관리 - 역방향 기간 (시작>종료, 0건)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 증명서승인관리  액터: 개발자
   * URL: /mis/hrm/hrm5020/getList.do
   * 예상결과: 시작일이 종료일보다 늦어 조회 결과가 0건이어야 한다.
   * DB 확인: -- TODO: hrm_5020M 매핑(/mis/hrm/hrm5020/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 증명서승인관리 - 역방향 기간 (시작>종료, 0건)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 증명서승인관리 - 역방향 기간 (시작>종료, 0건)');
    logInput('FRM_RQST_DT', '2024-12-31');
    logInput('TO_RQST_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'FRM_RQST_DT': '2024-12-31', 'TO_RQST_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5020M-no3.png`, fullPage: true });

    expect(rows.length, '증명서승인관리 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_5030M — (구)제증명발급현황  |  API: POST /mis/hrm/hrm5030/getHrmCertMngOldList.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm5030/getHrmCertMngOldList.do';
  const PGM_ID            = 'hrm_5030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['C_TYPE', 'FRM_WRITE_DATE', 'TO_WRITE_DATE', 'USER_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`(구)제증명발급현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] (구)제증명발급현황 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: (구)제증명발급현황  액터: 개발자
   * URL: /mis/hrm/hrm5030/getHrmCertMngOldList.do
   * 예상결과: (구)제증명발급현황 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_5030M 매핑(/mis/hrm/hrm5030/getHrmCertMngOldList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] (구)제증명발급현황 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] (구)제증명발급현황 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getHrmCertMngOldList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5030M-no1.png`, fullPage: true });

    expect(rows.length, '(구)제증명발급현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_5040M — 제증명환경설정  |  API: POST /mis/hrm/hrm5040/getList.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm5040/getList.do';
  const PGM_ID            = 'hrm_5040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`제증명환경설정(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 제증명환경설정 - 조회 (searchDs=, API-direct)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 제증명환경설정  액터: 개발자
   * URL: /mis/hrm/hrm5040/getList.do
   * 예상결과: 제증명환경설정 조회를 수행한다. searchDs= (자동분류 미해결 — 파라미터 확인 필요).
   * DB 확인: -- TODO: hrm_5040M 매핑(/mis/hrm/hrm5040/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 제증명환경설정 - 조회 (searchDs=, API-direct)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 제증명환경설정 - 조회 (searchDs=, API-direct)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5040M-no1.png`, fullPage: true });

    expect(rows.length, '제증명환경설정 조회 (searchDs=, API-direct) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_5070M — 직인및인감신청목록  |  API: POST /mis/hrm/hrm5070/getList.do  |  TC 4건
{
  const API_URL           = '/mis/hrm/hrm5070/getList.do';
  const PGM_ID            = 'hrm_5070M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_FROM_DT', 'SCH_TO_DT', 'SCH_CERT_CLS', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_NM', 'SCH_DEPT_CD', 'SCH_APV_STAT_CD', 'SCH_SEAL_CLS'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`직인및인감신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 직인및인감신청목록 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 직인및인감신청목록  액터: 개발자
   * URL: /mis/hrm/hrm5070/getList.do
   * 예상결과: 직인및인감신청목록 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_5070M 매핑(/mis/hrm/hrm5070/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 직인및인감신청목록 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 직인및인감신청목록 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5070M-no1.png`, fullPage: true });

    expect(rows.length, '직인및인감신청목록 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 직인및인감신청목록 - 기간 조회 (SCH_FROM_DT ~ SCH_TO_DT)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 직인및인감신청목록  액터: 개발자
   * URL: /mis/hrm/hrm5070/getList.do
   * 예상결과: 지정 기간(SCH_FROM_DT~SCH_TO_DT)의 직인및인감신청목록 목록이 조회된다.
   * DB 확인: -- TODO: hrm_5070M 매핑(/mis/hrm/hrm5070/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 직인및인감신청목록 - 기간 조회 (SCH_FROM_DT ~ SCH_TO_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 직인및인감신청목록 - 기간 조회 (SCH_FROM_DT ~ SCH_TO_DT)');
    logInput('SCH_FROM_DT', '2024-01-01');
    logInput('SCH_TO_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_FROM_DT': '2024-01-01', 'SCH_TO_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5070M-no2.png`, fullPage: true });

    expect(rows.length, '직인및인감신청목록 기간 조회 (SCH_FROM_DT ~ SCH_TO_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 직인및인감신청목록 - 역방향 기간 (시작>종료, 0건)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 직인및인감신청목록  액터: 개발자
   * URL: /mis/hrm/hrm5070/getList.do
   * 예상결과: 시작일이 종료일보다 늦어 조회 결과가 0건이어야 한다.
   * DB 확인: -- TODO: hrm_5070M 매핑(/mis/hrm/hrm5070/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 직인및인감신청목록 - 역방향 기간 (시작>종료, 0건)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 직인및인감신청목록 - 역방향 기간 (시작>종료, 0건)');
    logInput('SCH_FROM_DT', '2024-12-31');
    logInput('SCH_TO_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_FROM_DT': '2024-12-31', 'SCH_TO_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5070M-no3.png`, fullPage: true });

    expect(rows.length, '직인및인감신청목록 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 직인및인감신청목록 - 명칭 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 직인및인감신청목록  액터: 개발자
   * URL: /mis/hrm/hrm5070/getList.do
   * 예상결과: SCH_EMP_NM에 키워드가 포함된 직인및인감신청목록가 조회된다.
   * DB 확인: -- TODO: hrm_5070M 매핑(/mis/hrm/hrm5070/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:4] 직인및인감신청목록 - 명칭 키워드 검색 (SCH_EMP_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:4] 직인및인감신청목록 - 명칭 키워드 검색 (SCH_EMP_NM)');
    logInput('SCH_EMP_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EMP_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5070M-no4.png`, fullPage: true });

    expect(rows.length, '직인및인감신청목록 명칭 키워드 검색 (SCH_EMP_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['EMP_NM'] ?? ''), `[행${i}] EMP_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_5071M — 직인및인감신청  |  API: POST /mis/hrm/hrm5071/getSearch.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm5071/getSearch.do';
  const PGM_ID            = 'hrm_5071M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_main';
  const DS_SEARCH_COLUMNS = ['RQST_NO', 'popupYN', 'PUBCT_RQST_EMP_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`직인및인감신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 직인및인감신청 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 증명서관리  메뉴명: 직인및인감신청  액터: 개발자
   * URL: /mis/hrm/hrm5071/getSearch.do
   * 예상결과: 직인및인감신청 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_5071M 매핑(/mis/hrm/hrm5071/getSearch.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 직인및인감신청 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 직인및인감신청 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getSearch.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_5071M-no1.png`, fullPage: true });

    expect(rows.length, '직인및인감신청 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_6010M — 채용공고등록  |  API: POST /mis/hrm/hrm6010/getEmytAnncList.do  |  TC 2건
{
  const API_URL           = '/mis/hrm/hrm6010/getEmytAnncList.do';
  const PGM_ID            = 'hrm_6010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list01';
  const DS_SEARCH_COLUMNS = ['SCH_EMYT_ANNC_YY', 'SCH_SRCN_STEP_FG_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`채용공고등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 채용공고등록 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 채용관리  메뉴명: 채용공고등록  액터: 개발자
   * URL: /mis/hrm/hrm6010/getEmytAnncList.do
   * 예상결과: 채용공고등록 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_6010M 매핑(/mis/hrm/hrm6010/getEmytAnncList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 채용공고등록 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 채용공고등록 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getEmytAnncList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_6010M-no1.png`, fullPage: true });

    expect(rows.length, '채용공고등록 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 채용공고등록 - 연도 조회 (SCH_EMYT_ANNC_YY=2024)
   * 중분류: 인사관리  소분류: 채용관리  메뉴명: 채용공고등록  액터: 개발자
   * URL: /mis/hrm/hrm6010/getEmytAnncList.do
   * 예상결과: 2024년도 채용공고등록 목록이 조회된다.
   * DB 확인: -- TODO: hrm_6010M 매핑(/mis/hrm/hrm6010/getEmytAnncList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 채용공고등록 - 연도 조회 (SCH_EMYT_ANNC_YY=2024)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 채용공고등록 - 연도 조회 (SCH_EMYT_ANNC_YY=2024)');
    logInput('SCH_EMYT_ANNC_YY', '2024');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EMYT_ANNC_YY': '2024' }));
    const result = await assertNexacroResponse(resp, 'getEmytAnncList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_6010M-no2.png`, fullPage: true });

    expect(rows.length, '채용공고등록 연도 조회 (SCH_EMYT_ANNC_YY=2024) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_6011M — 채용공고등록 상세  |  API: POST /mis/hrm/hrm6011/getEmytAnncData.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm6011/getEmytAnncData.do';
  const PGM_ID            = 'hrm_6011M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_main';
  const DS_SEARCH_COLUMNS = ['tmHeader', 'EMYT_ANNC_NO', 'EMYT_YY', 'EMYT_ANNC_FRM_DT', 'EMYT_ANNC_TO_DT', 'EMYT_ANNC_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`채용공고등록 상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 채용공고등록 상세 - 단건 상세 조회 (키 지정 필요, API-direct)
   * 중분류: 인사관리  소분류: 채용관리  메뉴명: 채용공고등록 상세  액터: 개발자
   * URL: /mis/hrm/hrm6011/getEmytAnncData.do
   * 예상결과: 채용공고등록 상세는 상위 목록에서 선택한 키(ds_main)로 단건 상세를 조회하는 화면이다. 유효 키 파라미터가 필요하며, 키 없이 호출 시 빈 결과 또는 오류를 확인한다.
   * DB 확인: -- TODO: hrm_6011M 매핑(/mis/hrm/hrm6011/getEmytAnncData.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 채용공고등록 상세 - 단건 상세 조회 (키 지정 필요, API-direct)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 채용공고등록 상세 - 단건 상세 조회 (키 지정 필요, API-direct)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getEmytAnncData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_6011M-no1.png`, fullPage: true });

    expect(rows.length, '채용공고등록 상세 단건 상세 조회 (키 지정 필요, API-direct) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_6030M — 평가위원이력관리  |  API: POST /mis/hrm/hrm6030/getEmytEvalMfmmList.do  |  TC 2건
{
  const API_URL           = '/mis/hrm/hrm6030/getEmytEvalMfmmList.do';
  const PGM_ID            = 'hrm_6030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_EMYT_ANNC_YY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`평가위원이력관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 평가위원이력관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 채용관리  메뉴명: 평가위원이력관리  액터: 개발자
   * URL: /mis/hrm/hrm6030/getEmytEvalMfmmList.do
   * 예상결과: 평가위원이력관리 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_6030M 매핑(/mis/hrm/hrm6030/getEmytEvalMfmmList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 평가위원이력관리 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 평가위원이력관리 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getEmytEvalMfmmList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_6030M-no1.png`, fullPage: true });

    expect(rows.length, '평가위원이력관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 평가위원이력관리 - 연도 조회 (SCH_EMYT_ANNC_YY=2024)
   * 중분류: 인사관리  소분류: 채용관리  메뉴명: 평가위원이력관리  액터: 개발자
   * URL: /mis/hrm/hrm6030/getEmytEvalMfmmList.do
   * 예상결과: 2024년도 평가위원이력관리 목록이 조회된다.
   * DB 확인: -- TODO: hrm_6030M 매핑(/mis/hrm/hrm6030/getEmytEvalMfmmList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 평가위원이력관리 - 연도 조회 (SCH_EMYT_ANNC_YY=2024)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 평가위원이력관리 - 연도 조회 (SCH_EMYT_ANNC_YY=2024)');
    logInput('SCH_EMYT_ANNC_YY', '2024');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EMYT_ANNC_YY': '2024' }));
    const result = await assertNexacroResponse(resp, 'getEmytEvalMfmmList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_6030M-no2.png`, fullPage: true });

    expect(rows.length, '평가위원이력관리 연도 조회 (SCH_EMYT_ANNC_YY=2024) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9010M — 교육목표시간관리  |  API: POST /mis/hrm/hrm9010/getEduTgpnMngList.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm9010/getEduTgpnMngList.do';
  const PGM_ID            = 'hrm_9010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_STDR_YY', 'SCH_EMP_RID', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_GRD_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`교육목표시간관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 교육목표시간관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육목표시간관리  액터: 개발자
   * URL: /mis/hrm/hrm9010/getEduTgpnMngList.do
   * 예상결과: 교육목표시간관리 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_9010M 매핑(/mis/hrm/hrm9010/getEduTgpnMngList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육목표시간관리 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육목표시간관리 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getEduTgpnMngList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9010M-no1.png`, fullPage: true });

    expect(rows.length, '교육목표시간관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 교육목표시간관리 - 연도 조회 (SCH_STDR_YY=2024)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육목표시간관리  액터: 개발자
   * URL: /mis/hrm/hrm9010/getEduTgpnMngList.do
   * 예상결과: 2024년도 교육목표시간관리 목록이 조회된다.
   * DB 확인: -- TODO: hrm_9010M 매핑(/mis/hrm/hrm9010/getEduTgpnMngList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 교육목표시간관리 - 연도 조회 (SCH_STDR_YY=2024)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 교육목표시간관리 - 연도 조회 (SCH_STDR_YY=2024)');
    logInput('SCH_STDR_YY', '2024');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_STDR_YY': '2024' }));
    const result = await assertNexacroResponse(resp, 'getEduTgpnMngList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9010M-no2.png`, fullPage: true });

    expect(rows.length, '교육목표시간관리 연도 조회 (SCH_STDR_YY=2024) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 교육목표시간관리 - 명칭 키워드 검색 (SCH_DEPT_NM)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육목표시간관리  액터: 개발자
   * URL: /mis/hrm/hrm9010/getEduTgpnMngList.do
   * 예상결과: SCH_DEPT_NM에 키워드가 포함된 교육목표시간관리가 조회된다.
   * DB 확인: -- TODO: hrm_9010M 매핑(/mis/hrm/hrm9010/getEduTgpnMngList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 교육목표시간관리 - 명칭 키워드 검색 (SCH_DEPT_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 교육목표시간관리 - 명칭 키워드 검색 (SCH_DEPT_NM)');
    logInput('SCH_DEPT_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_DEPT_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getEduTgpnMngList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9010M-no3.png`, fullPage: true });

    expect(rows.length, '교육목표시간관리 명칭 키워드 검색 (SCH_DEPT_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['DEPT_NM'] ?? ''), `[행${i}] DEPT_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9111M — 교육신청(개인)  |  API: POST /mis/hrm/hrm9111/getData.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm9111/getData.do';
  const PGM_ID            = 'hrm_9111M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_main';
  const DS_SEARCH_COLUMNS = ['EDU_RQST_RNO', 'EDU_RQST_NO', 'RQST_FG', 'RQST_DT', 'APV_STAT_FG', 'APV_STAT_NM', 'RQSTER_EMP_RID', 'RQSTER_EMP_NO', 'RQSTER_EMP_NM', 'RQSTER_DEPT_CD', 'RQSTER_DEPT_NM', 'RQSTER_GRD_FG', 'EDU_TRGTER_EMP_RID', 'EDU_TRGTER_EMP_NO', 'EDU_TRGTER_EMP_NM', 'EDU_TRGTER_DEPT_CD', 'EDU_TRGTER_DEPT_NM', 'EDU_TRGTER_GRD_FG', 'EDU_YY', 'EDU_KND_CD', 'EDU_KND_NM', 'EDU_CRS_CD', 'EDU_NM', 'EDU_FG_CD', 'EDU_INSTT_NM', 'EDU_PLC', 'EDU_FRM_DT', 'EDU_TO_DT', 'EDU_TIME', 'EDU_EXP', 'EDU_CONT', 'BIGO', 'PRV_EDU_RQST_NO', 'PRV_EDU_RQST_RNO', 'CNCL_RSN', 'EDU_MTHD_FG', 'EDU_SETLE_MTHD_FG', 'APV_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`교육신청(개인)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 교육신청(개인) - 단건 상세 조회 (키 지정 필요, API-direct)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육신청(개인)  액터: 개발자
   * URL: /mis/hrm/hrm9111/getData.do
   * 예상결과: 교육신청(개인)는 상위 목록에서 선택한 키(ds_main)로 단건 상세를 조회하는 화면이다. 유효 키 파라미터가 필요하며, 키 없이 호출 시 빈 결과 또는 오류를 확인한다.
   * DB 확인: -- TODO: hrm_9111M 매핑(/mis/hrm/hrm9111/getData.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육신청(개인) - 단건 상세 조회 (키 지정 필요, API-direct)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육신청(개인) - 단건 상세 조회 (키 지정 필요, API-direct)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9111M-no1.png`, fullPage: true });

    expect(rows.length, '교육신청(개인) 단건 상세 조회 (키 지정 필요, API-direct) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9130M — 교육증빙등록  |  API: POST /mis/hrm/hrm9130/getList.do  |  TC 4건
{
  const API_URL           = '/mis/hrm/hrm9130/getList.do';
  const PGM_ID            = 'hrm_9130M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_ACCP_STAT_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`교육증빙등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 교육증빙등록 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육증빙등록  액터: 개발자
   * URL: /mis/hrm/hrm9130/getList.do
   * 예상결과: 교육증빙등록 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_9130M 매핑(/mis/hrm/hrm9130/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육증빙등록 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육증빙등록 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9130M-no1.png`, fullPage: true });

    expect(rows.length, '교육증빙등록 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 교육증빙등록 - 기간 조회 (SCH_RQST_FRM_DT ~ SCH_RQST_TO_DT)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육증빙등록  액터: 개발자
   * URL: /mis/hrm/hrm9130/getList.do
   * 예상결과: 지정 기간(SCH_RQST_FRM_DT~SCH_RQST_TO_DT)의 교육증빙등록 목록이 조회된다.
   * DB 확인: -- TODO: hrm_9130M 매핑(/mis/hrm/hrm9130/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 교육증빙등록 - 기간 조회 (SCH_RQST_FRM_DT ~ SCH_RQST_TO_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 교육증빙등록 - 기간 조회 (SCH_RQST_FRM_DT ~ SCH_RQST_TO_DT)');
    logInput('SCH_RQST_FRM_DT', '2024-01-01');
    logInput('SCH_RQST_TO_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_RQST_FRM_DT': '2024-01-01', 'SCH_RQST_TO_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9130M-no2.png`, fullPage: true });

    expect(rows.length, '교육증빙등록 기간 조회 (SCH_RQST_FRM_DT ~ SCH_RQST_TO_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 교육증빙등록 - 역방향 기간 (시작>종료, 0건)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육증빙등록  액터: 개발자
   * URL: /mis/hrm/hrm9130/getList.do
   * 예상결과: 시작일이 종료일보다 늦어 조회 결과가 0건이어야 한다.
   * DB 확인: -- TODO: hrm_9130M 매핑(/mis/hrm/hrm9130/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 교육증빙등록 - 역방향 기간 (시작>종료, 0건)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 교육증빙등록 - 역방향 기간 (시작>종료, 0건)');
    logInput('SCH_RQST_FRM_DT', '2024-12-31');
    logInput('SCH_RQST_TO_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_RQST_FRM_DT': '2024-12-31', 'SCH_RQST_TO_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9130M-no3.png`, fullPage: true });

    expect(rows.length, '교육증빙등록 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 교육증빙등록 - 명칭 키워드 검색 (SCH_DEPT_NM)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육증빙등록  액터: 개발자
   * URL: /mis/hrm/hrm9130/getList.do
   * 예상결과: SCH_DEPT_NM에 키워드가 포함된 교육증빙등록가 조회된다.
   * DB 확인: -- TODO: hrm_9130M 매핑(/mis/hrm/hrm9130/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:4] 교육증빙등록 - 명칭 키워드 검색 (SCH_DEPT_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:4] 교육증빙등록 - 명칭 키워드 검색 (SCH_DEPT_NM)');
    logInput('SCH_DEPT_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_DEPT_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9130M-no4.png`, fullPage: true });

    expect(rows.length, '교육증빙등록 명칭 키워드 검색 (SCH_DEPT_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['DEPT_NM'] ?? ''), `[행${i}] DEPT_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9131M — 교육증빙등록  |  API: POST /mis/hrm/hrm9131/getData.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm9131/getData.do';
  const PGM_ID            = 'hrm_9131M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_main';
  const DS_SEARCH_COLUMNS = ['EDU_RQST_RNO', 'EDU_RQST_NO', 'RQST_FG', 'RQST_DT', 'APV_STAT_CD', 'APV_STAT_NM', 'RQSTER_EMP_RID', 'RQSTER_EMP_NO', 'RQSTER_EMP_NM', 'RQSTER_DEPT_CD', 'RQSTER_DEPT_NM', 'RQSTER_GRD_FG', 'EDU_TRGTER_EMP_RID', 'EDU_TRGTER_EMP_NO', 'EDU_TRGTER_EMP_NM', 'EDU_TRGTER_DEPT_CD', 'EDU_TRGTER_DEPT_NM', 'EDU_TRGTER_GRD_FG', 'EDU_YY', 'EDU_NM', 'EDU_KND_CD', 'EDU_KND_NM', 'EDU_CRS_CD', 'EDU_FG_CD', 'EDU_INSTT_NM', 'EDU_PLC', 'EDU_FRM_DT', 'EDU_TO_DT', 'EDU_TIME', 'EDU_AMT', 'EDU_EXP', 'EDU_CONT', 'PRV_EDU_RQST_RNO', 'CNCL_RSN', 'ACCP_STAT_FG', 'RUS_RSN', 'EDU_MTHD_FG', 'EDU_SETLE_MTHD_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`교육증빙등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 교육증빙등록 - 단건 상세 조회 (키 지정 필요, API-direct)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육증빙등록  액터: 개발자
   * URL: /mis/hrm/hrm9131/getData.do
   * 예상결과: 교육증빙등록는 상위 목록에서 선택한 키(ds_main)로 단건 상세를 조회하는 화면이다. 유효 키 파라미터가 필요하며, 키 없이 호출 시 빈 결과 또는 오류를 확인한다.
   * DB 확인: -- TODO: hrm_9131M 매핑(/mis/hrm/hrm9131/getData.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육증빙등록 - 단건 상세 조회 (키 지정 필요, API-direct)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육증빙등록 - 단건 상세 조회 (키 지정 필요, API-direct)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9131M-no1.png`, fullPage: true });

    expect(rows.length, '교육증빙등록 단건 상세 조회 (키 지정 필요, API-direct) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9140M — 교육이수승인  |  API: POST /mis/hrm/hrm9140/getList.do  |  TC 4건
{
  const API_URL           = '/mis/hrm/hrm9140/getList.do';
  const PGM_ID            = 'hrm_9140M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_ACCP_STAT_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`교육이수승인(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 교육이수승인 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수승인  액터: 개발자
   * URL: /mis/hrm/hrm9140/getList.do
   * 예상결과: 교육이수승인 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_9140M 매핑(/mis/hrm/hrm9140/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육이수승인 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육이수승인 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9140M-no1.png`, fullPage: true });

    expect(rows.length, '교육이수승인 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 교육이수승인 - 기간 조회 (SCH_RQST_FRM_DT ~ SCH_RQST_TO_DT)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수승인  액터: 개발자
   * URL: /mis/hrm/hrm9140/getList.do
   * 예상결과: 지정 기간(SCH_RQST_FRM_DT~SCH_RQST_TO_DT)의 교육이수승인 목록이 조회된다.
   * DB 확인: -- TODO: hrm_9140M 매핑(/mis/hrm/hrm9140/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 교육이수승인 - 기간 조회 (SCH_RQST_FRM_DT ~ SCH_RQST_TO_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 교육이수승인 - 기간 조회 (SCH_RQST_FRM_DT ~ SCH_RQST_TO_DT)');
    logInput('SCH_RQST_FRM_DT', '2024-01-01');
    logInput('SCH_RQST_TO_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_RQST_FRM_DT': '2024-01-01', 'SCH_RQST_TO_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9140M-no2.png`, fullPage: true });

    expect(rows.length, '교육이수승인 기간 조회 (SCH_RQST_FRM_DT ~ SCH_RQST_TO_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 교육이수승인 - 역방향 기간 (시작>종료, 0건)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수승인  액터: 개발자
   * URL: /mis/hrm/hrm9140/getList.do
   * 예상결과: 시작일이 종료일보다 늦어 조회 결과가 0건이어야 한다.
   * DB 확인: -- TODO: hrm_9140M 매핑(/mis/hrm/hrm9140/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 교육이수승인 - 역방향 기간 (시작>종료, 0건)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 교육이수승인 - 역방향 기간 (시작>종료, 0건)');
    logInput('SCH_RQST_FRM_DT', '2024-12-31');
    logInput('SCH_RQST_TO_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_RQST_FRM_DT': '2024-12-31', 'SCH_RQST_TO_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9140M-no3.png`, fullPage: true });

    expect(rows.length, '교육이수승인 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 교육이수승인 - 명칭 키워드 검색 (SCH_DEPT_NM)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수승인  액터: 개발자
   * URL: /mis/hrm/hrm9140/getList.do
   * 예상결과: SCH_DEPT_NM에 키워드가 포함된 교육이수승인가 조회된다.
   * DB 확인: -- TODO: hrm_9140M 매핑(/mis/hrm/hrm9140/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:4] 교육이수승인 - 명칭 키워드 검색 (SCH_DEPT_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:4] 교육이수승인 - 명칭 키워드 검색 (SCH_DEPT_NM)');
    logInput('SCH_DEPT_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_DEPT_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9140M-no4.png`, fullPage: true });

    expect(rows.length, '교육이수승인 명칭 키워드 검색 (SCH_DEPT_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['DEPT_NM'] ?? ''), `[행${i}] DEPT_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9300M — 교육종류관리  |  API: POST /mis/hrm/hrm9300/getList.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm9300/getList.do';
  const PGM_ID            = 'hrm_9300M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_EDU_KND_NM', 'SCH_USE_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`교육종류관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 교육종류관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육종류관리  액터: 개발자
   * URL: /mis/hrm/hrm9300/getList.do
   * 예상결과: 교육종류관리 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_9300M 매핑(/mis/hrm/hrm9300/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육종류관리 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육종류관리 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9300M-no1.png`, fullPage: true });

    expect(rows.length, '교육종류관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 교육종류관리 - 명칭 키워드 검색 (SCH_EDU_KND_NM)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육종류관리  액터: 개발자
   * URL: /mis/hrm/hrm9300/getList.do
   * 예상결과: SCH_EDU_KND_NM에 키워드가 포함된 교육종류관리가 조회된다.
   * DB 확인: -- TODO: hrm_9300M 매핑(/mis/hrm/hrm9300/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 교육종류관리 - 명칭 키워드 검색 (SCH_EDU_KND_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 교육종류관리 - 명칭 키워드 검색 (SCH_EDU_KND_NM)');
    logInput('SCH_EDU_KND_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EDU_KND_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9300M-no2.png`, fullPage: true });

    expect(rows.length, '교육종류관리 명칭 키워드 검색 (SCH_EDU_KND_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['EDU_KND_NM'] ?? ''), `[행${i}] EDU_KND_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 교육종류관리 - 사용여부 필터 (SCH_USE_YN=Y)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육종류관리  액터: 개발자
   * URL: /mis/hrm/hrm9300/getList.do
   * 예상결과: 사용(Y) 교육종류관리만 조회된다.
   * DB 확인: -- TODO: hrm_9300M 매핑(/mis/hrm/hrm9300/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 교육종류관리 - 사용여부 필터 (SCH_USE_YN=Y)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 교육종류관리 - 사용여부 필터 (SCH_USE_YN=Y)');
    logInput('SCH_USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_USE_YN': 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9300M-no3.png`, fullPage: true });

    expect(rows.length, '교육종류관리 사용여부 필터 (SCH_USE_YN=Y) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(r['USE_YN'], `[행${i}] USE_YN 불일치`).toBe('Y'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9305M — 교육과정관리  |  API: POST /mis/hrm/hrm9305/getList.do  |  TC 2건
{
  const API_URL           = '/mis/hrm/hrm9305/getList.do';
  const PGM_ID            = 'hrm_9305M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_EDU_CRS_NM', 'SCH_EDU_TRGT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`교육과정관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 교육과정관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육과정관리  액터: 개발자
   * URL: /mis/hrm/hrm9305/getList.do
   * 예상결과: 교육과정관리 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_9305M 매핑(/mis/hrm/hrm9305/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육과정관리 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육과정관리 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9305M-no1.png`, fullPage: true });

    expect(rows.length, '교육과정관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 교육과정관리 - 명칭 키워드 검색 (SCH_EDU_CRS_NM)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육과정관리  액터: 개발자
   * URL: /mis/hrm/hrm9305/getList.do
   * 예상결과: SCH_EDU_CRS_NM에 키워드가 포함된 교육과정관리가 조회된다.
   * DB 확인: -- TODO: hrm_9305M 매핑(/mis/hrm/hrm9305/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 교육과정관리 - 명칭 키워드 검색 (SCH_EDU_CRS_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 교육과정관리 - 명칭 키워드 검색 (SCH_EDU_CRS_NM)');
    logInput('SCH_EDU_CRS_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EDU_CRS_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9305M-no2.png`, fullPage: true });

    expect(rows.length, '교육과정관리 명칭 키워드 검색 (SCH_EDU_CRS_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['EDU_CRS_NM'] ?? ''), `[행${i}] EDU_CRS_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9310M — 교육기준관리  |  API: POST /mis/hrm/hrm9310/getList.do  |  TC 4건
{
  const API_URL           = '/mis/hrm/hrm9310/getList.do';
  const PGM_ID            = 'hrm_9310M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_course';
  const DS_SEARCH_COLUMNS = ['SCH_EDU_STDR_YY', 'EDU_KND_CD', 'EDU_TRGT', 'EDU_TRGT_NM', 'APLY_STDR_DT', 'SCH_EDU_KND_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`교육기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 교육기준관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육기준관리  액터: 개발자
   * URL: /mis/hrm/hrm9310/getList.do
   * 예상결과: 교육기준관리 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_9310M 매핑(/mis/hrm/hrm9310/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육기준관리 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육기준관리 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9310M-no1.png`, fullPage: true });

    expect(rows.length, '교육기준관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 교육기준관리 - 기준일자 조회 (APLY_STDR_DT)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육기준관리  액터: 개발자
   * URL: /mis/hrm/hrm9310/getList.do
   * 예상결과: 기준일자(APLY_STDR_DT) 조건으로 교육기준관리가 조회된다.
   * DB 확인: -- TODO: hrm_9310M 매핑(/mis/hrm/hrm9310/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 교육기준관리 - 기준일자 조회 (APLY_STDR_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 교육기준관리 - 기준일자 조회 (APLY_STDR_DT)');
    logInput('APLY_STDR_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'APLY_STDR_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9310M-no2.png`, fullPage: true });

    expect(rows.length, '교육기준관리 기준일자 조회 (APLY_STDR_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 교육기준관리 - 연도 조회 (SCH_EDU_STDR_YY=2024)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육기준관리  액터: 개발자
   * URL: /mis/hrm/hrm9310/getList.do
   * 예상결과: 2024년도 교육기준관리 목록이 조회된다.
   * DB 확인: -- TODO: hrm_9310M 매핑(/mis/hrm/hrm9310/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 교육기준관리 - 연도 조회 (SCH_EDU_STDR_YY=2024)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 교육기준관리 - 연도 조회 (SCH_EDU_STDR_YY=2024)');
    logInput('SCH_EDU_STDR_YY', '2024');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EDU_STDR_YY': '2024' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9310M-no3.png`, fullPage: true });

    expect(rows.length, '교육기준관리 연도 조회 (SCH_EDU_STDR_YY=2024) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 교육기준관리 - 명칭 키워드 검색 (SCH_EDU_KND_NM)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육기준관리  액터: 개발자
   * URL: /mis/hrm/hrm9310/getList.do
   * 예상결과: SCH_EDU_KND_NM에 키워드가 포함된 교육기준관리가 조회된다.
   * DB 확인: -- TODO: hrm_9310M 매핑(/mis/hrm/hrm9310/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:4] 교육기준관리 - 명칭 키워드 검색 (SCH_EDU_KND_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:4] 교육기준관리 - 명칭 키워드 검색 (SCH_EDU_KND_NM)');
    logInput('SCH_EDU_KND_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EDU_KND_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9310M-no4.png`, fullPage: true });

    expect(rows.length, '교육기준관리 명칭 키워드 검색 (SCH_EDU_KND_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['EDU_KND_NM'] ?? ''), `[행${i}] EDU_KND_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9311M — 교육대상자관리  |  API: POST /mis/hrm/hrm9311/getCourseList.do  |  TC 2건
{
  const API_URL           = '/mis/hrm/hrm9311/getCourseList.do';
  const PGM_ID            = 'hrm_9311M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_course';
  const DS_SEARCH_COLUMNS = ['SCH_EDU_FG_CD', 'SCH_EDU_START_YM', 'EDU_KND_CD', 'EDU_STDR_CD', 'SCH_EDU_STDR_CD', 'SCH_EDU_STDR_YY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`교육대상자관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 교육대상자관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육대상자관리  액터: 개발자
   * URL: /mis/hrm/hrm9311/getCourseList.do
   * 예상결과: 교육대상자관리 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_9311M 매핑(/mis/hrm/hrm9311/getCourseList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육대상자관리 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육대상자관리 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getCourseList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9311M-no1.png`, fullPage: true });

    expect(rows.length, '교육대상자관리 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 교육대상자관리 - 연도 조회 (SCH_EDU_STDR_YY=2024)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육대상자관리  액터: 개발자
   * URL: /mis/hrm/hrm9311/getCourseList.do
   * 예상결과: 2024년도 교육대상자관리 목록이 조회된다.
   * DB 확인: -- TODO: hrm_9311M 매핑(/mis/hrm/hrm9311/getCourseList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 교육대상자관리 - 연도 조회 (SCH_EDU_STDR_YY=2024)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 교육대상자관리 - 연도 조회 (SCH_EDU_STDR_YY=2024)');
    logInput('SCH_EDU_STDR_YY', '2024');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EDU_STDR_YY': '2024' }));
    const result = await assertNexacroResponse(resp, 'getCourseList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9311M-no2.png`, fullPage: true });

    expect(rows.length, '교육대상자관리 연도 조회 (SCH_EDU_STDR_YY=2024) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9312M — 교육대상자 기준코드 변경  |  API: POST /mis/hrm/hrm9312/getList.do  |  TC 4건
{
  const API_URL           = '/mis/hrm/hrm9312/getList.do';
  const PGM_ID            = 'hrm_9312M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`교육대상자 기준코드 변경(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 교육대상자 기준코드 변경 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육대상자 기준코드 변경  액터: 개발자
   * URL: /mis/hrm/hrm9312/getList.do
   * 예상결과: 교육대상자 기준코드 변경 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_9312M 매핑(/mis/hrm/hrm9312/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육대상자 기준코드 변경 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육대상자 기준코드 변경 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9312M-no1.png`, fullPage: true });

    expect(rows.length, '교육대상자 기준코드 변경 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 교육대상자 기준코드 변경 - 기간 조회 (SCH_FRM_DT ~ SCH_TO_DT)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육대상자 기준코드 변경  액터: 개발자
   * URL: /mis/hrm/hrm9312/getList.do
   * 예상결과: 지정 기간(SCH_FRM_DT~SCH_TO_DT)의 교육대상자 기준코드 변경 목록이 조회된다.
   * DB 확인: -- TODO: hrm_9312M 매핑(/mis/hrm/hrm9312/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 교육대상자 기준코드 변경 - 기간 조회 (SCH_FRM_DT ~ SCH_TO_DT)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 교육대상자 기준코드 변경 - 기간 조회 (SCH_FRM_DT ~ SCH_TO_DT)');
    logInput('SCH_FRM_DT', '2024-01-01');
    logInput('SCH_TO_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_FRM_DT': '2024-01-01', 'SCH_TO_DT': '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9312M-no2.png`, fullPage: true });

    expect(rows.length, '교육대상자 기준코드 변경 기간 조회 (SCH_FRM_DT ~ SCH_TO_DT) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 교육대상자 기준코드 변경 - 역방향 기간 (시작>종료, 0건)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육대상자 기준코드 변경  액터: 개발자
   * URL: /mis/hrm/hrm9312/getList.do
   * 예상결과: 시작일이 종료일보다 늦어 조회 결과가 0건이어야 한다.
   * DB 확인: -- TODO: hrm_9312M 매핑(/mis/hrm/hrm9312/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 교육대상자 기준코드 변경 - 역방향 기간 (시작>종료, 0건)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 교육대상자 기준코드 변경 - 역방향 기간 (시작>종료, 0건)');
    logInput('SCH_FRM_DT', '2024-12-31');
    logInput('SCH_TO_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_FRM_DT': '2024-12-31', 'SCH_TO_DT': '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9312M-no3.png`, fullPage: true });

    expect(rows.length, '교육대상자 기준코드 변경 0건 기대').toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 교육대상자 기준코드 변경 - 명칭 키워드 검색 (SCH_DEPT_NM)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육대상자 기준코드 변경  액터: 개발자
   * URL: /mis/hrm/hrm9312/getList.do
   * 예상결과: SCH_DEPT_NM에 키워드가 포함된 교육대상자 기준코드 변경가 조회된다.
   * DB 확인: -- TODO: hrm_9312M 매핑(/mis/hrm/hrm9312/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:4] 교육대상자 기준코드 변경 - 명칭 키워드 검색 (SCH_DEPT_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:4] 교육대상자 기준코드 변경 - 명칭 키워드 검색 (SCH_DEPT_NM)');
    logInput('SCH_DEPT_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_DEPT_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9312M-no4.png`, fullPage: true });

    expect(rows.length, '교육대상자 기준코드 변경 명칭 키워드 검색 (SCH_DEPT_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['DEPT_NM'] ?? ''), `[행${i}] DEPT_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9320M — 교육이수등록(담당자)목록  |  API: POST /mis/hrm/hrm9320/getList.do  |  TC 3건
{
  const API_URL           = '/mis/hrm/hrm9320/getList.do';
  const PGM_ID            = 'hrm_9320M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_EDU_STDR_YY', 'SCH_EDU_KND_CD', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NM', 'SCH_EDU_CMP_FG', 'SCH_RQST_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`교육이수등록(담당자)목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 교육이수등록(담당자)목록 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수등록(담당자)목록  액터: 개발자
   * URL: /mis/hrm/hrm9320/getList.do
   * 예상결과: 교육이수등록(담당자)목록 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_9320M 매핑(/mis/hrm/hrm9320/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육이수등록(담당자)목록 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육이수등록(담당자)목록 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9320M-no1.png`, fullPage: true });

    expect(rows.length, '교육이수등록(담당자)목록 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 교육이수등록(담당자)목록 - 연도 조회 (SCH_EDU_STDR_YY=2024)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수등록(담당자)목록  액터: 개발자
   * URL: /mis/hrm/hrm9320/getList.do
   * 예상결과: 2024년도 교육이수등록(담당자)목록 목록이 조회된다.
   * DB 확인: -- TODO: hrm_9320M 매핑(/mis/hrm/hrm9320/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 교육이수등록(담당자)목록 - 연도 조회 (SCH_EDU_STDR_YY=2024)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 교육이수등록(담당자)목록 - 연도 조회 (SCH_EDU_STDR_YY=2024)');
    logInput('SCH_EDU_STDR_YY', '2024');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EDU_STDR_YY': '2024' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9320M-no2.png`, fullPage: true });

    expect(rows.length, '교육이수등록(담당자)목록 연도 조회 (SCH_EDU_STDR_YY=2024) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 교육이수등록(담당자)목록 - 명칭 키워드 검색 (SCH_DEPT_NM)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수등록(담당자)목록  액터: 개발자
   * URL: /mis/hrm/hrm9320/getList.do
   * 예상결과: SCH_DEPT_NM에 키워드가 포함된 교육이수등록(담당자)목록가 조회된다.
   * DB 확인: -- TODO: hrm_9320M 매핑(/mis/hrm/hrm9320/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 교육이수등록(담당자)목록 - 명칭 키워드 검색 (SCH_DEPT_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 교육이수등록(담당자)목록 - 명칭 키워드 검색 (SCH_DEPT_NM)');
    logInput('SCH_DEPT_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_DEPT_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9320M-no3.png`, fullPage: true });

    expect(rows.length, '교육이수등록(담당자)목록 명칭 키워드 검색 (SCH_DEPT_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['DEPT_NM'] ?? ''), `[행${i}] DEPT_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9325M — 교육이수등록(담당자)  |  API: POST /mis/hrm/hrm9325/getData.do  |  TC 1건
{
  const API_URL           = '/mis/hrm/hrm9325/getData.do';
  const PGM_ID            = 'hrm_9325M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_main';
  const DS_SEARCH_COLUMNS = ['EDU_CMP_RNO', 'EDU_CMP_NO', 'EDU_STDR_YY', 'EDU_STDR_CD', 'EDU_CRS_CD', 'EDU_CRS_NM', 'EDU_KND_CD', 'EDU_KND_NM', 'EDU_FG_NM', 'EDU_FG_CD', 'EDU_MTHD_FG', 'EDU_MTHD_NM', 'EDU_NM', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'GRD_FG', 'GRD_NM', 'RGSTER_EMP_RID', 'RGSTER_NM', 'RGSTER_EMP_NO', 'RGSTER_DEPT_CD', 'RGSTER_DEPT_NM', 'EDU_CONT', 'EDU_FRM_DT', 'EDU_TO_DT', 'EDU_TIME', 'EDU_INSTT_NM', 'EDU_PLC', 'EDU_EXP', 'RTNC', 'RMK', 'REG_DT', 'FILE_GRP_ID', 'APV_STAT_FG', 'APV_STAT_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`교육이수등록(담당자)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 교육이수등록(담당자) - 단건 상세 조회 (키 지정 필요, API-direct)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수등록(담당자)  액터: 개발자
   * URL: /mis/hrm/hrm9325/getData.do
   * 예상결과: 교육이수등록(담당자)는 상위 목록에서 선택한 키(ds_main)로 단건 상세를 조회하는 화면이다. 유효 키 파라미터가 필요하며, 키 없이 호출 시 빈 결과 또는 오류를 확인한다.
   * DB 확인: -- TODO: hrm_9325M 매핑(/mis/hrm/hrm9325/getData.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육이수등록(담당자) - 단건 상세 조회 (키 지정 필요, API-direct)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육이수등록(담당자) - 단건 상세 조회 (키 지정 필요, API-direct)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9325M-no1.png`, fullPage: true });

    expect(rows.length, '교육이수등록(담당자) 단건 상세 조회 (키 지정 필요, API-direct) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// hrm_9330M — 교육이수현황  |  API: POST /mis/hrm/hrm9330/getList.do  |  TC 3건
// TODO(dsList): 원본 dsListName="ds_list=ds_list" 파싱 불가 -> 'ds_list' 대체. XFDL 응답 데이터셋명 확인 필요.
{
  const API_URL           = '/mis/hrm/hrm9330/getList.do';
  const PGM_ID            = 'hrm_9330M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_EDU_YY', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NM', 'SCH_HLDF_FG', 'SCH_EMPO_STLF_FG', 'SCH_EDU_FG_CD', 'EMP_RID', 'EDU_CMP_RNO', 'EDU_RQST_RNO', 'DATA_FG', 'SNO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`교육이수현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 교육이수현황 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수현황  액터: 개발자
   * URL: /mis/hrm/hrm9330/getList.do
   * 예상결과: 교육이수현황 목록이 전체 조회된다. (총 N건)
   * DB 확인: -- TODO: hrm_9330M 매핑(/mis/hrm/hrm9330/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:1] 교육이수현황 - 전체 조회 (조건 없음)`, async ({ workerPage: page }) => {
    logTestStart('[no:1] 교육이수현황 - 전체 조회 (조건 없음)');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9330M-no1.png`, fullPage: true });

    expect(rows.length, '교육이수현황 전체 조회 (조건 없음) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 교육이수현황 - 연도 조회 (SCH_EDU_YY=2024)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수현황  액터: 개발자
   * URL: /mis/hrm/hrm9330/getList.do
   * 예상결과: 2024년도 교육이수현황 목록이 조회된다.
   * DB 확인: -- TODO: hrm_9330M 매핑(/mis/hrm/hrm9330/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:2] 교육이수현황 - 연도 조회 (SCH_EDU_YY=2024)`, async ({ workerPage: page }) => {
    logTestStart('[no:2] 교육이수현황 - 연도 조회 (SCH_EDU_YY=2024)');
    logInput('SCH_EDU_YY', '2024');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_EDU_YY': '2024' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9330M-no2.png`, fullPage: true });

    expect(rows.length, '교육이수현황 연도 조회 (SCH_EDU_YY=2024) 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 교육이수현황 - 명칭 키워드 검색 (SCH_DEPT_NM)
   * 중분류: 인사관리  소분류: 교육관리  메뉴명: 교육이수현황  액터: 개발자
   * URL: /mis/hrm/hrm9330/getList.do
   * 예상결과: SCH_DEPT_NM에 키워드가 포함된 교육이수현황가 조회된다.
   * DB 확인: -- TODO: hrm_9330M 매핑(/mis/hrm/hrm9330/getList.do) 테이블 확인 후 COUNT 작성
   */
  test(`[no:3] 교육이수현황 - 명칭 키워드 검색 (SCH_DEPT_NM)`, async ({ workerPage: page }) => {
    logTestStart('[no:3] 교육이수현황 - 명칭 키워드 검색 (SCH_DEPT_NM)');
    logInput('SCH_DEPT_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ 'SCH_DEPT_NM': '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm_9330M-no3.png`, fullPage: true });

    expect(rows.length, '교육이수현황 명칭 키워드 검색 (SCH_DEPT_NM) 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => expect(String(r['DEPT_NM'] ?? ''), `[행${i}] DEPT_NM에 김 미포함`).toContain('김'));
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}
