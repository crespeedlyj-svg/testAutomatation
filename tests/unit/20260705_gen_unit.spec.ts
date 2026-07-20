// ==============================================================
// GEN 모듈 — 일반/공통(총무관리 등) 단위 테스트 (통합 spec)
// 생성일시: 2026-07-05  |  파일: 20260705_gen_unit.spec.ts
// 커버 화면: 117개  |  총 테스트 케이스: 293건
// 방식: API-direct (page.evaluate(fetch) + nexacroXml)
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 금지
// 소스: _workspace/gen/01_scenarios.json (117개 화면, 전부 API·unit-only)
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

// ───────────────────────────────────────────────────────────────────────────
// gen_0010M — 휴무일관리  |  API: POST /mis/gen/gen0010/getHoliList.do  |  TC 3건  |  ds:ds_holiday
// TODO(menuId): gen_0010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0010/getHoliList.do';
  const PGM_ID            = 'gen_0010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_holiday';
  const DS_SEARCH_COLUMNS = ['YYMM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`휴무일관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 휴무일관리 - 전체 조회 (조건 없음)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴무일관리  액터: 개발자
   * URL: /mis/gen/gen0010/getHoliList.do
   * 예상결과: 휴무일 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM GEN_HDAY_MST WHERE 1=1
   */
  test("[no:1] 휴무일관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 휴무일관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0010M-no1.png`, fullPage: true });

    expect(rows.length, "휴무일관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 휴무일관리 - 연월 조건 조회 (YYMM)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴무일관리  액터: 개발자
   * URL: /mis/gen/gen0010/getHoliList.do
   * 예상결과: 지정한 연월(2026-06)의 휴무일 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM GEN_HDAY_MST WHERE SUBSTR(DT,1,6) = '202606'
   */
  test("[no:2] 휴무일관리 - 연월 조건 조회 (YYMM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 휴무일관리 - 연월 조건 조회 (YYMM)");
    logInput("YYMM", "2026-06");

    const resp   = await apiPost(page, API_URL, searchBody({ YYMM: "2026-06" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0010M-no2.png`, fullPage: true });

    expect(rows.length, "휴무일관리 연월 조건 조회 (YYMM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 휴무일관리 - 존재하지 않는 연월 조회 (0건 예상)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴무일관리  액터: 개발자
   * URL: /mis/gen/gen0010/getHoliList.do
   * 예상결과: 존재하지 않는 연월(1900-01) 조회 시 목록이 없거나 정상 응답한다.
   * DB 확인: SELECT COUNT(*) FROM GEN_HDAY_MST WHERE SUBSTR(DT,1,6) = '190001'
   */
  test("[no:3] 휴무일관리 - 존재하지 않는 연월 조회 (0건 예상)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 휴무일관리 - 존재하지 않는 연월 조회 (0건 예상)");
    logInput("YYMM", "1900-01");

    const resp   = await apiPost(page, API_URL, searchBody({ YYMM: "1900-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0010M-no3.png`, fullPage: true });

    expect(rows.length, "휴무일관리 존재하지 않는 연월 조회 (0건 예상) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0020M — 휴가기준관리  |  API: POST /mis/gen/gen0020/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0020M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0020/getList.do';
  const PGM_ID            = 'gen_0020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_VCTN_FG', 'SCH_VCTN_FG_NM', 'SCH_SMRY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`휴가기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 휴가기준관리 - 전체 조회 (조건 없음)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴가기준관리  액터: 개발자
   * URL: /mis/gen/gen0020/getList.do
   * 예상결과: 휴가기준 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_STDR_MST WHERE 1=1
   */
  test("[no:1] 휴가기준관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 휴가기준관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0020M-no1.png`, fullPage: true });

    expect(rows.length, "휴가기준관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 휴가기준관리 - 휴가구분 코드 필터 (SCH_VCTN_FG)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴가기준관리  액터: 개발자
   * URL: /mis/gen/gen0020/getList.do
   * 예상결과: 선택한 휴가구분에 해당하는 휴가기준 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_STDR_MST WHERE VCTN_FG_CD = '412-010'
   */
  test("[no:2] 휴가기준관리 - 휴가구분 코드 필터 (SCH_VCTN_FG)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 휴가기준관리 - 휴가구분 코드 필터 (SCH_VCTN_FG)");
    logInput("SCH_VCTN_FG", "412-010");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_VCTN_FG: "412-010" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0020M-no2.png`, fullPage: true });

    expect(rows.length, "휴가기준관리 휴가구분 코드 필터 (SCH_VCTN_FG) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 휴가기준관리 - 존재하지 않는 휴가구분 코드 조회 (0건 예상)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴가기준관리  액터: 개발자
   * URL: /mis/gen/gen0020/getList.do
   * 예상결과: 존재하지 않는 휴가구분 코드 조회 시 목록이 없거나 정상 응답한다.
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_STDR_MST WHERE VCTN_FG_CD = 'ZZZ-999'
   */
  test("[no:3] 휴가기준관리 - 존재하지 않는 휴가구분 코드 조회 (0건 예상)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 휴가기준관리 - 존재하지 않는 휴가구분 코드 조회 (0건 예상)");
    logInput("SCH_VCTN_FG", "ZZZ-999");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_VCTN_FG: "ZZZ-999" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0020M-no3.png`, fullPage: true });

    expect(rows.length, "휴가기준관리 존재하지 않는 휴가구분 코드 조회 (0건 예상) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 휴가기준관리 - 휴가상세구분 키워드 검색 (SCH_VCTN_FG_NM)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴가기준관리  액터: 개발자
   * URL: /mis/gen/gen0020/getList.do
   * 예상결과: 휴가상세구분명에 '연차'가 포함된 휴가기준 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_STDR_MST WHERE VCTN_FG_NM LIKE '%연차%'
   */
  test("[no:4] 휴가기준관리 - 휴가상세구분 키워드 검색 (SCH_VCTN_FG_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 휴가기준관리 - 휴가상세구분 키워드 검색 (SCH_VCTN_FG_NM)");
    logInput("SCH_VCTN_FG_NM", "연차");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_VCTN_FG_NM: "연차" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0020M-no4.png`, fullPage: true });

    expect(rows.length, "휴가기준관리 휴가상세구분 키워드 검색 (SCH_VCTN_FG_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0021M — 휴가규정관리  |  API: POST /mis/gen/gen0021/getList.do  |  TC 5건  |  ds:ds_list
// TODO(menuId): gen_0021M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0021/getList.do';
  const PGM_ID            = 'gen_0021M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_VCTN_RGTN_FG_CD', 'SCH_VCTN_RGTN_NM', 'SCH_SMRY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`휴가규정관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 휴가규정관리 - 전체 조회 (조건 없음)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴가규정관리  액터: 개발자
   * URL: /mis/gen/gen0021/getList.do
   * 예상결과: 휴가규정 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_RGTN_MST WHERE 1=1
   */
  test("[no:1] 휴가규정관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 휴가규정관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0021M-no1.png`, fullPage: true });

    expect(rows.length, "휴가규정관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 휴가규정관리 - 구분코드 필터 (SCH_VCTN_RGTN_FG_CD)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴가규정관리  액터: 개발자
   * URL: /mis/gen/gen0021/getList.do
   * 예상결과: 선택한 규정 구분코드에 해당하는 휴가규정 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_RGTN_MST WHERE VCTN_RGTN_FG_CD = '416-010'
   */
  test("[no:2] 휴가규정관리 - 구분코드 필터 (SCH_VCTN_RGTN_FG_CD)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 휴가규정관리 - 구분코드 필터 (SCH_VCTN_RGTN_FG_CD)");
    logInput("SCH_VCTN_RGTN_FG_CD", "416-010");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_VCTN_RGTN_FG_CD: "416-010" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0021M-no2.png`, fullPage: true });

    expect(rows.length, "휴가규정관리 구분코드 필터 (SCH_VCTN_RGTN_FG_CD) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 휴가규정관리 - 존재하지 않는 구분코드 조회 (0건 예상)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴가규정관리  액터: 개발자
   * URL: /mis/gen/gen0021/getList.do
   * 예상결과: 존재하지 않는 규정 구분코드 조회 시 목록이 없거나 정상 응답한다.
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_RGTN_MST WHERE VCTN_RGTN_FG_CD = 'ZZZ-999'
   */
  test("[no:3] 휴가규정관리 - 존재하지 않는 구분코드 조회 (0건 예상)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 휴가규정관리 - 존재하지 않는 구분코드 조회 (0건 예상)");
    logInput("SCH_VCTN_RGTN_FG_CD", "ZZZ-999");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_VCTN_RGTN_FG_CD: "ZZZ-999" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0021M-no3.png`, fullPage: true });

    expect(rows.length, "휴가규정관리 존재하지 않는 구분코드 조회 (0건 예상) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 휴가규정관리 - 규정코드명 키워드 검색 (SCH_VCTN_RGTN_NM)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴가규정관리  액터: 개발자
   * URL: /mis/gen/gen0021/getList.do
   * 예상결과: 규정코드명에 '연차'가 포함된 휴가규정 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_RGTN_MST WHERE VCTN_RGTN_NM LIKE '%연차%'
   */
  test("[no:4] 휴가규정관리 - 규정코드명 키워드 검색 (SCH_VCTN_RGTN_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 휴가규정관리 - 규정코드명 키워드 검색 (SCH_VCTN_RGTN_NM)");
    logInput("SCH_VCTN_RGTN_NM", "연차");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_VCTN_RGTN_NM: "연차" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0021M-no4.png`, fullPage: true });

    expect(rows.length, "휴가규정관리 규정코드명 키워드 검색 (SCH_VCTN_RGTN_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 휴가규정관리 - 적요 키워드 검색 (SCH_SMRY)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 휴가규정관리  액터: 개발자
   * URL: /mis/gen/gen0021/getList.do
   * 예상결과: 적요에 '규정'이 포함된 휴가규정 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_RGTN_MST WHERE SMRY LIKE '%규정%'
   */
  test("[no:5] 휴가규정관리 - 적요 키워드 검색 (SCH_SMRY)", async ({ workerPage: page }) => {
    logTestStart("[no:5] 휴가규정관리 - 적요 키워드 검색 (SCH_SMRY)");
    logInput("SCH_SMRY", "규정");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SMRY: "규정" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0021M-no5.png`, fullPage: true });

    expect(rows.length, "휴가규정관리 적요 키워드 검색 (SCH_SMRY) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0030M — 연차일수관리  |  API: POST /mis/gen/gen0030/getList.do  |  TC 6건  |  ds:ds_list
// TODO(menuId): gen_0030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0030/getList.do';
  const PGM_ID            = 'gen_0030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_YY', 'SCH_STDR_DT', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_HLDF_FG_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`연차일수관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 연차일수관리 - 기준일자 조회 (SCH_STDR_DT 기본값)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * URL: /mis/gen/gen0030/getList.do
   * 예상결과: 기준일자 기준 연차일수 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE 1=1
   */
  test("[no:1] 연차일수관리 - 기준일자 조회 (SCH_STDR_DT 기본값)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 연차일수관리 - 기준일자 조회 (SCH_STDR_DT 기본값)");
    logInput("SCH_STDR_DT", "2026-07-01");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: "2026-07-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0030M-no1.png`, fullPage: true });

    expect(rows.length, "연차일수관리 기준일자 조회 (SCH_STDR_DT 기본값) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 연차일수관리 - 재직구분 필터 (재직자, SCH_HLDF_FG_CD=101-010)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * URL: /mis/gen/gen0030/getList.do
   * 예상결과: 재직 상태(101-010) 직원의 연차일수 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE HLDF_FG_CD = '101-010'
   */
  test("[no:2] 연차일수관리 - 재직구분 필터 (재직자, SCH_HLDF_FG_CD=101-010)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 연차일수관리 - 재직구분 필터 (재직자, SCH_HLDF_FG_CD=101-010)");
    logInput('검색조건', "{\"SCH_STDR_DT\":\"2026-07-01\",\"SCH_HLDF_FG_CD\":\"101-010\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: "2026-07-01", SCH_HLDF_FG_CD: "101-010" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0030M-no2.png`, fullPage: true });

    expect(rows.length, "연차일수관리 재직구분 필터 (재직자, SCH_HLDF_FG_CD=101-010) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 연차일수관리 - 미래 기준일자 조회 (0건 예상)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * URL: /mis/gen/gen0030/getList.do
   * 예상결과: 미래 기준일자 조회 시 목록이 없거나 정상 응답한다.
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE ENT_DT <= '29991231'
   */
  test("[no:3] 연차일수관리 - 미래 기준일자 조회 (0건 예상)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 연차일수관리 - 미래 기준일자 조회 (0건 예상)");
    logInput("SCH_STDR_DT", "2999-12-31");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: "2999-12-31" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0030M-no3.png`, fullPage: true });

    expect(rows.length, "연차일수관리 미래 기준일자 조회 (0건 예상) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 연차일수관리 - 부서 조건 조회 (SCH_DEPT_NM)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * URL: /mis/gen/gen0030/getList.do
   * 예상결과: 특정 부서(총무부) 직원의 연차일수 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE DEPT_NM LIKE '%총무부%'
   */
  test("[no:4] 연차일수관리 - 부서 조건 조회 (SCH_DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 연차일수관리 - 부서 조건 조회 (SCH_DEPT_NM)");
    logInput('검색조건', "{\"SCH_STDR_DT\":\"2026-07-01\",\"SCH_DEPT_NM\":\"총무부\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: "2026-07-01", SCH_DEPT_NM: "총무부" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0030M-no4.png`, fullPage: true });

    expect(rows.length, "연차일수관리 부서 조건 조회 (SCH_DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 연차일수관리 - 성명 키워드 조회 (SCH_EMP_NM)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * URL: /mis/gen/gen0030/getList.do
   * 예상결과: 성명에 '홍길동'이 포함된 직원의 연차일수 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE EMP_NM LIKE '%홍길동%'
   */
  test("[no:5] 연차일수관리 - 성명 키워드 조회 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:5] 연차일수관리 - 성명 키워드 조회 (SCH_EMP_NM)");
    logInput('검색조건', "{\"SCH_STDR_DT\":\"2026-07-01\",\"SCH_EMP_NM\":\"홍길동\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: "2026-07-01", SCH_EMP_NM: "홍길동" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0030M-no5.png`, fullPage: true });

    expect(rows.length, "연차일수관리 성명 키워드 조회 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 연차일수관리 - 재직구분 필터 (퇴직자, SCH_HLDF_FG_CD=101-020)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * URL: /mis/gen/gen0030/getList.do
   * 예상결과: 퇴직 상태(101-020) 직원의 연차일수 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE HLDF_FG_CD = '101-020'
   */
  test("[no:6] 연차일수관리 - 재직구분 필터 (퇴직자, SCH_HLDF_FG_CD=101-020)", async ({ workerPage: page }) => {
    logTestStart("[no:6] 연차일수관리 - 재직구분 필터 (퇴직자, SCH_HLDF_FG_CD=101-020)");
    logInput('검색조건', "{\"SCH_STDR_DT\":\"2026-07-01\",\"SCH_HLDF_FG_CD\":\"101-020\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: "2026-07-01", SCH_HLDF_FG_CD: "101-020" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0030M-no6.png`, fullPage: true });

    expect(rows.length, "연차일수관리 재직구분 필터 (퇴직자, SCH_HLDF_FG_CD=101-020) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0040M — 임신휴가발생관리  |  API: POST /mis/gen/gen0040/getList.do  |  TC 5건  |  ds:ds_list
// TODO(menuId): gen_0040M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0040/getList.do';
  const PGM_ID            = 'gen_0040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_YY', 'SCH_STDR_DT', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_HLDF_FG_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`임신휴가발생관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 임신휴가발생관리 - 기준일자 조회 (SCH_STDR_DT 기본값)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 임신휴가발생관리  액터: 개발자
   * URL: /mis/gen/gen0040/getList.do
   * 예상결과: 기준일자 기준 임신휴가발생 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_OCRNC_MST WHERE 1=1
   */
  test("[no:1] 임신휴가발생관리 - 기준일자 조회 (SCH_STDR_DT 기본값)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 임신휴가발생관리 - 기준일자 조회 (SCH_STDR_DT 기본값)");
    logInput("SCH_STDR_DT", "2026-07-01");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: "2026-07-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0040M-no1.png`, fullPage: true });

    expect(rows.length, "임신휴가발생관리 기준일자 조회 (SCH_STDR_DT 기본값) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 임신휴가발생관리 - 재직구분 필터 (재직자, SCH_HLDF_FG_CD=101-010)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 임신휴가발생관리  액터: 개발자
   * URL: /mis/gen/gen0040/getList.do
   * 예상결과: 재직 상태(101-010) 직원의 임신휴가발생 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_OCRNC_MST A JOIN HRM_EMP_MST B ON A.EMP_NO = B.EMP_NO WHERE B.HLDF_FG_CD = '101-010'
   */
  test("[no:2] 임신휴가발생관리 - 재직구분 필터 (재직자, SCH_HLDF_FG_CD=101-010)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 임신휴가발생관리 - 재직구분 필터 (재직자, SCH_HLDF_FG_CD=101-010)");
    logInput('검색조건', "{\"SCH_STDR_DT\":\"2026-07-01\",\"SCH_HLDF_FG_CD\":\"101-010\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: "2026-07-01", SCH_HLDF_FG_CD: "101-010" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0040M-no2.png`, fullPage: true });

    expect(rows.length, "임신휴가발생관리 재직구분 필터 (재직자, SCH_HLDF_FG_CD=101-010) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 임신휴가발생관리 - 미래 기준일자 조회 (0건 예상)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 임신휴가발생관리  액터: 개발자
   * URL: /mis/gen/gen0040/getList.do
   * 예상결과: 미래 기준일자 조회 시 목록이 없거나 정상 응답한다.
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_OCRNC_MST WHERE VCTN_OCRNC_DT <= '29991231'
   */
  test("[no:3] 임신휴가발생관리 - 미래 기준일자 조회 (0건 예상)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 임신휴가발생관리 - 미래 기준일자 조회 (0건 예상)");
    logInput("SCH_STDR_DT", "2999-12-31");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: "2999-12-31" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0040M-no3.png`, fullPage: true });

    expect(rows.length, "임신휴가발생관리 미래 기준일자 조회 (0건 예상) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 임신휴가발생관리 - 부서 조건 조회 (SCH_DEPT_NM)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 임신휴가발생관리  액터: 개발자
   * URL: /mis/gen/gen0040/getList.do
   * 예상결과: 특정 부서(총무부) 직원의 임신휴가발생 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_OCRNC_MST A JOIN HRM_EMP_MST B ON A.EMP_NO = B.EMP_NO WHERE B.DEPT_NM LIKE '%총무부%'
   */
  test("[no:4] 임신휴가발생관리 - 부서 조건 조회 (SCH_DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 임신휴가발생관리 - 부서 조건 조회 (SCH_DEPT_NM)");
    logInput('검색조건', "{\"SCH_STDR_DT\":\"2026-07-01\",\"SCH_DEPT_NM\":\"총무부\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: "2026-07-01", SCH_DEPT_NM: "총무부" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0040M-no4.png`, fullPage: true });

    expect(rows.length, "임신휴가발생관리 부서 조건 조회 (SCH_DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 임신휴가발생관리 - 성명 키워드 조회 (SCH_EMP_NM)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 임신휴가발생관리  액터: 개발자
   * URL: /mis/gen/gen0040/getList.do
   * 예상결과: 성명에 '홍길동'이 포함된 직원의 임신휴가발생 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM GEN_VCTN_OCRNC_MST A JOIN HRM_EMP_MST B ON A.EMP_NO = B.EMP_NO WHERE B.EMP_NM LIKE '%홍길동%'
   */
  test("[no:5] 임신휴가발생관리 - 성명 키워드 조회 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:5] 임신휴가발생관리 - 성명 키워드 조회 (SCH_EMP_NM)");
    logInput('검색조건', "{\"SCH_STDR_DT\":\"2026-07-01\",\"SCH_EMP_NM\":\"홍길동\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: "2026-07-01", SCH_EMP_NM: "홍길동" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0040M-no5.png`, fullPage: true });

    expect(rows.length, "임신휴가발생관리 성명 키워드 조회 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0025M — 사원 휴가사용일자 설정  |  API: POST /mis/gen/gen0025/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0025M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0025/getList.do';
  const PGM_ID            = 'gen_0025M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_EMP_RID', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_VCTN_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사원 휴가사용일자 설정(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사원 휴가사용일자 설정 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 사원 휴가사용일자 설정  액터: 개발자
   * URL: /mis/gen/gen0025/getList.do
   * 예상결과: 사원 휴가사용일자 설정 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0025M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 사원 휴가사용일자 설정 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 사원 휴가사용일자 설정 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0025M-no1.png`, fullPage: true });

    expect(rows.length, "사원 휴가사용일자 설정 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 사원 휴가사용일자 설정 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)
   * 중분류:   소분류:   메뉴명: 사원 휴가사용일자 설정  액터: 개발자
   * URL: /mis/gen/gen0025/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 사원 휴가사용일자 설정 목록이 조회된다.
   * DB 확인: -- TODO(gen_0025M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 사원 휴가사용일자 설정 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 사원 휴가사용일자 설정 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)");
    logInput('검색조건', "{\"SCH_FRM_DT\":\"2026-01-01\",\"SCH_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: "2026-01-01", SCH_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0025M-no2.png`, fullPage: true });

    expect(rows.length, "사원 휴가사용일자 설정 기간 조회 (SCH_FRM_DT~SCH_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 사원 휴가사용일자 설정 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)
   * 중분류:   소분류:   메뉴명: 사원 휴가사용일자 설정  액터: 개발자
   * URL: /mis/gen/gen0025/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_0025M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 사원 휴가사용일자 설정 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 사원 휴가사용일자 설정 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)");
    logInput('검색조건', "{\"SCH_FRM_DT\":\"2026-07-05\",\"SCH_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: "2026-07-05", SCH_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0025M-no3.png`, fullPage: true });

    expect(rows.length, "사원 휴가사용일자 설정 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 사원 휴가사용일자 설정 - 키워드 검색 (SCH_EMP_NM)
   * 중분류:   소분류:   메뉴명: 사원 휴가사용일자 설정  액터: 개발자
   * URL: /mis/gen/gen0025/getList.do
   * 예상결과: SCH_EMP_NM에 '테스트'가 포함된 사원 휴가사용일자 설정 목록이 조회된다.
   * DB 확인: -- TODO(gen_0025M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 사원 휴가사용일자 설정 - 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 사원 휴가사용일자 설정 - 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0025M-no4.png`, fullPage: true });

    expect(rows.length, "사원 휴가사용일자 설정 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0110M — 휴가신청  |  API: POST /mis/gen/gen0110/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0110M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0110/getList.do';
  const PGM_ID            = 'gen_0110M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'APV_STAT_FG', 'RQST_FG', 'VCTN_FG', 'SCH_EMP_FG', 'CHK_VALID'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`휴가신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 휴가신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 휴가신청  액터: 개발자
   * URL: /mis/gen/gen0110/getList.do
   * 예상결과: 휴가신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0110M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 휴가신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 휴가신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0110M-no1.png`, fullPage: true });

    expect(rows.length, "휴가신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 휴가신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 휴가신청  액터: 개발자
   * URL: /mis/gen/gen0110/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 휴가신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_0110M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 휴가신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 휴가신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0110M-no2.png`, fullPage: true });

    expect(rows.length, "휴가신청 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 휴가신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 휴가신청  액터: 개발자
   * URL: /mis/gen/gen0110/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_0110M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 휴가신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 휴가신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0110M-no3.png`, fullPage: true });

    expect(rows.length, "휴가신청 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 휴가신청 - 키워드 검색 (DEPT_NM)
   * 중분류:   소분류:   메뉴명: 휴가신청  액터: 개발자
   * URL: /mis/gen/gen0110/getList.do
   * 예상결과: DEPT_NM에 '테스트'가 포함된 휴가신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_0110M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 휴가신청 - 키워드 검색 (DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 휴가신청 - 키워드 검색 (DEPT_NM)");
    logInput("DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0110M-no4.png`, fullPage: true });

    expect(rows.length, "휴가신청 키워드 검색 (DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0111M — 휴가신청  |  API: POST /mis/gen/gen0111/getVctnFgCdList.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_0111M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0111/getVctnFgCdList.do';
  const PGM_ID            = 'gen_0111M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`휴가신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 휴가신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 휴가신청  액터: 개발자
   * URL: /mis/gen/gen0111/getVctnFgCdList.do
   * 예상결과: 휴가신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0111M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 휴가신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 휴가신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0111M-no1.png`, fullPage: true });

    expect(rows.length, "휴가신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0120M — 휴가사용현황  |  API: POST /mis/gen/gen0120/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0120M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0120/getList.do';
  const PGM_ID            = 'gen_0120M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['YY', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'HLDF_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`휴가사용현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 휴가사용현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 휴가사용현황  액터: 개발자
   * URL: /mis/gen/gen0120/getList.do
   * 예상결과: 휴가사용현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0120M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 휴가사용현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 휴가사용현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0120M-no1.png`, fullPage: true });

    expect(rows.length, "휴가사용현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 휴가사용현황 - 연도/연월 조건 조회 (YY)
   * 중분류:   소분류:   메뉴명: 휴가사용현황  액터: 개발자
   * URL: /mis/gen/gen0120/getList.do
   * 예상결과: 지정 연도(2026)의 휴가사용현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_0120M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 휴가사용현황 - 연도/연월 조건 조회 (YY)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 휴가사용현황 - 연도/연월 조건 조회 (YY)");
    logInput("YY", "2026");

    const resp   = await apiPost(page, API_URL, searchBody({ YY: "2026" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0120M-no2.png`, fullPage: true });

    expect(rows.length, "휴가사용현황 연도/연월 조건 조회 (YY) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 휴가사용현황 - 존재하지 않는 연도 조회 (YY=1900)
   * 중분류:   소분류:   메뉴명: 휴가사용현황  액터: 개발자
   * URL: /mis/gen/gen0120/getList.do
   * 예상결과: 존재하지 않는 연도(1900) 조회 시 목록이 없거나 정상 응답한다.
   * DB 확인: -- TODO(gen_0120M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 휴가사용현황 - 존재하지 않는 연도 조회 (YY=1900)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 휴가사용현황 - 존재하지 않는 연도 조회 (YY=1900)");
    logInput("YY", "1900");

    const resp   = await apiPost(page, API_URL, searchBody({ YY: "1900" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0120M-no3.png`, fullPage: true });

    expect(rows.length, "휴가사용현황 존재하지 않는 연도 조회 (YY=1900) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 휴가사용현황 - 키워드 검색 (EMP_NM)
   * 중분류:   소분류:   메뉴명: 휴가사용현황  액터: 개발자
   * URL: /mis/gen/gen0120/getList.do
   * 예상결과: EMP_NM에 '테스트'가 포함된 휴가사용현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_0120M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 휴가사용현황 - 키워드 검색 (EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 휴가사용현황 - 키워드 검색 (EMP_NM)");
    logInput("EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0120M-no4.png`, fullPage: true });

    expect(rows.length, "휴가사용현황 키워드 검색 (EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0210M — 보상휴가신청  |  API: POST /mis/gen/gen0210/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0210M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0210/getList.do';
  const PGM_ID            = 'gen_0210M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'APV_STAT_FG', 'RQST_FG', 'VCTN_FG', 'SCH_EMP_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`보상휴가신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 보상휴가신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 보상휴가신청  액터: 개발자
   * URL: /mis/gen/gen0210/getList.do
   * 예상결과: 보상휴가신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0210M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 보상휴가신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 보상휴가신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0210M-no1.png`, fullPage: true });

    expect(rows.length, "보상휴가신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 보상휴가신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 보상휴가신청  액터: 개발자
   * URL: /mis/gen/gen0210/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 보상휴가신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_0210M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 보상휴가신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 보상휴가신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0210M-no2.png`, fullPage: true });

    expect(rows.length, "보상휴가신청 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 보상휴가신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 보상휴가신청  액터: 개발자
   * URL: /mis/gen/gen0210/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_0210M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 보상휴가신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 보상휴가신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0210M-no3.png`, fullPage: true });

    expect(rows.length, "보상휴가신청 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 보상휴가신청 - 키워드 검색 (DEPT_NM)
   * 중분류:   소분류:   메뉴명: 보상휴가신청  액터: 개발자
   * URL: /mis/gen/gen0210/getList.do
   * 예상결과: DEPT_NM에 '테스트'가 포함된 보상휴가신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_0210M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 보상휴가신청 - 키워드 검색 (DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 보상휴가신청 - 키워드 검색 (DEPT_NM)");
    logInput("DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0210M-no4.png`, fullPage: true });

    expect(rows.length, "보상휴가신청 키워드 검색 (DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0211M — 보상휴가신청  |  API: POST /mis/gen/gen0211/getExcpEmpNo.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_0211M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0211/getExcpEmpNo.do';
  const PGM_ID            = 'gen_0211M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`보상휴가신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 보상휴가신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 보상휴가신청  액터: 개발자
   * URL: /mis/gen/gen0211/getExcpEmpNo.do
   * 예상결과: 보상휴가신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0211M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 보상휴가신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 보상휴가신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0211M-no1.png`, fullPage: true });

    expect(rows.length, "보상휴가신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0220M — 보상휴가발생현황조회  |  API: POST /mis/gen/gen0220/getEmpList.do  |  TC 2건  |  ds:ds_orgList
// TODO(menuId): gen_0220M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0220/getEmpList.do';
  const PGM_ID            = 'gen_0220M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_orgList';
  const DS_SEARCH_COLUMNS = ['STDR_DT', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'HLDF_FG_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`보상휴가발생현황조회(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 보상휴가발생현황조회 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 보상휴가발생현황조회  액터: 개발자
   * URL: /mis/gen/gen0220/getEmpList.do
   * 예상결과: 보상휴가발생현황조회 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0220M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 보상휴가발생현황조회 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 보상휴가발생현황조회 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0220M-no1.png`, fullPage: true });

    expect(rows.length, "보상휴가발생현황조회 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 보상휴가발생현황조회 - 키워드 검색 (EMP_NM)
   * 중분류:   소분류:   메뉴명: 보상휴가발생현황조회  액터: 개발자
   * URL: /mis/gen/gen0220/getEmpList.do
   * 예상결과: EMP_NM에 '테스트'가 포함된 보상휴가발생현황조회 목록이 조회된다.
   * DB 확인: -- TODO(gen_0220M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 보상휴가발생현황조회 - 키워드 검색 (EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 보상휴가발생현황조회 - 키워드 검색 (EMP_NM)");
    logInput("EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0220M-no2.png`, fullPage: true });

    expect(rows.length, "보상휴가발생현황조회 키워드 검색 (EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0225M — 보상휴가사용현황  |  API: POST /mis/gen/gen0225/getEmpList1.do  |  TC 2건  |  ds:ds_empList
// TODO(menuId): gen_0225M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0225/getEmpList1.do';
  const PGM_ID            = 'gen_0225M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_empList';
  const DS_SEARCH_COLUMNS = ['STDR_DT', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'HLDF_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`보상휴가사용현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 보상휴가사용현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 보상휴가사용현황  액터: 개발자
   * URL: /mis/gen/gen0225/getEmpList1.do
   * 예상결과: 보상휴가사용현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0225M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 보상휴가사용현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 보상휴가사용현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0225M-no1.png`, fullPage: true });

    expect(rows.length, "보상휴가사용현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 보상휴가사용현황 - 키워드 검색 (EMP_NM)
   * 중분류:   소분류:   메뉴명: 보상휴가사용현황  액터: 개발자
   * URL: /mis/gen/gen0225/getEmpList1.do
   * 예상결과: EMP_NM에 '테스트'가 포함된 보상휴가사용현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_0225M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 보상휴가사용현황 - 키워드 검색 (EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 보상휴가사용현황 - 키워드 검색 (EMP_NM)");
    logInput("EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0225M-no2.png`, fullPage: true });

    expect(rows.length, "보상휴가사용현황 키워드 검색 (EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0230M — 보상휴가 4시간 초과자 관리  |  API: POST /mis/gen/gen0230/getList.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_0230M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0230/getList.do';
  const PGM_ID            = 'gen_0230M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`보상휴가 4시간 초과자 관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 보상휴가 4시간 초과자 관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 보상휴가 4시간 초과자 관리  액터: 개발자
   * URL: /mis/gen/gen0230/getList.do
   * 예상결과: 보상휴가 4시간 초과자 관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0230M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 보상휴가 4시간 초과자 관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 보상휴가 4시간 초과자 관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0230M-no1.png`, fullPage: true });

    expect(rows.length, "보상휴가 4시간 초과자 관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0310M — 휴가촉진관리  |  API: POST /mis/gen/gen0310/getList.do  |  TC 3건  |  ds:ds_list
// TODO(menuId): gen_0310M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0310/getList.do';
  const PGM_ID            = 'gen_0310M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_PROMT_STAT_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`휴가촉진관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 휴가촉진관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 휴가촉진관리  액터: 개발자
   * URL: /mis/gen/gen0310/getList.do
   * 예상결과: 휴가촉진관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0310M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 휴가촉진관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 휴가촉진관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0310M-no1.png`, fullPage: true });

    expect(rows.length, "휴가촉진관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 휴가촉진관리 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)
   * 중분류:   소분류:   메뉴명: 휴가촉진관리  액터: 개발자
   * URL: /mis/gen/gen0310/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 휴가촉진관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_0310M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 휴가촉진관리 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 휴가촉진관리 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)");
    logInput('검색조건', "{\"SCH_FRM_DT\":\"2026-01-01\",\"SCH_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: "2026-01-01", SCH_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0310M-no2.png`, fullPage: true });

    expect(rows.length, "휴가촉진관리 기간 조회 (SCH_FRM_DT~SCH_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 휴가촉진관리 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)
   * 중분류:   소분류:   메뉴명: 휴가촉진관리  액터: 개발자
   * URL: /mis/gen/gen0310/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_0310M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 휴가촉진관리 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 휴가촉진관리 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)");
    logInput('검색조건', "{\"SCH_FRM_DT\":\"2026-07-05\",\"SCH_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: "2026-07-05", SCH_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0310M-no3.png`, fullPage: true });

    expect(rows.length, "휴가촉진관리 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0311M — 휴가촉진관리  |  API: POST /mis/gen/gen0311/getData.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_0311M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0311/getData.do';
  const PGM_ID            = 'gen_0311M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`휴가촉진관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 휴가촉진관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 휴가촉진관리  액터: 개발자
   * URL: /mis/gen/gen0311/getData.do
   * 예상결과: 휴가촉진관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0311M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 휴가촉진관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 휴가촉진관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0311M-no1.png`, fullPage: true });

    expect(rows.length, "휴가촉진관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0320M — 휴가계획(촉진)  |  API: POST /mis/gen/gen0320/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0320M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0320/getList.do';
  const PGM_ID            = 'gen_0320M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_NM', 'SCH_DEPT_CD', 'SCH_PROMT_DGCNT_FG', 'SCH_PROMT_STAT_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`휴가계획(촉진)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 휴가계획(촉진) - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 휴가계획(촉진)  액터: 개발자
   * URL: /mis/gen/gen0320/getList.do
   * 예상결과: 휴가계획(촉진) 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0320M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 휴가계획(촉진) - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 휴가계획(촉진) - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0320M-no1.png`, fullPage: true });

    expect(rows.length, "휴가계획(촉진) 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 휴가계획(촉진) - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)
   * 중분류:   소분류:   메뉴명: 휴가계획(촉진)  액터: 개발자
   * URL: /mis/gen/gen0320/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 휴가계획(촉진) 목록이 조회된다.
   * DB 확인: -- TODO(gen_0320M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 휴가계획(촉진) - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 휴가계획(촉진) - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)");
    logInput('검색조건', "{\"SCH_FRM_DT\":\"2026-01-01\",\"SCH_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: "2026-01-01", SCH_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0320M-no2.png`, fullPage: true });

    expect(rows.length, "휴가계획(촉진) 기간 조회 (SCH_FRM_DT~SCH_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 휴가계획(촉진) - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)
   * 중분류:   소분류:   메뉴명: 휴가계획(촉진)  액터: 개발자
   * URL: /mis/gen/gen0320/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_0320M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 휴가계획(촉진) - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 휴가계획(촉진) - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)");
    logInput('검색조건', "{\"SCH_FRM_DT\":\"2026-07-05\",\"SCH_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: "2026-07-05", SCH_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0320M-no3.png`, fullPage: true });

    expect(rows.length, "휴가계획(촉진) 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 휴가계획(촉진) - 키워드 검색 (SCH_EMP_NM)
   * 중분류:   소분류:   메뉴명: 휴가계획(촉진)  액터: 개발자
   * URL: /mis/gen/gen0320/getList.do
   * 예상결과: SCH_EMP_NM에 '테스트'가 포함된 휴가계획(촉진) 목록이 조회된다.
   * DB 확인: -- TODO(gen_0320M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 휴가계획(촉진) - 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 휴가계획(촉진) - 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0320M-no4.png`, fullPage: true });

    expect(rows.length, "휴가계획(촉진) 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0321M — 휴가계획(촉진)  |  API: POST /mis/gen/gen0321/getData.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_0321M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0321/getData.do';
  const PGM_ID            = 'gen_0321M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`휴가계획(촉진)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 휴가계획(촉진) - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 휴가계획(촉진)  액터: 개발자
   * URL: /mis/gen/gen0321/getData.do
   * 예상결과: 휴가계획(촉진) 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0321M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 휴가계획(촉진) - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 휴가계획(촉진) - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0321M-no1.png`, fullPage: true });

    expect(rows.length, "휴가계획(촉진) 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0360M — 휴가촉진확인  |  API: POST /mis/gen/gen0360/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0360M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0360/getList.do';
  const PGM_ID            = 'gen_0360M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_EMP_NO', 'SCH_WORK_DGCNT', 'SCH_EMP_NM', 'SCH_DEPT_NM', 'SCH_DEPT_CD', 'SCH_PROMT_DGCNT_FG_CD', 'SCH_PROMT_STAT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`휴가촉진확인(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 휴가촉진확인 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 휴가촉진확인  액터: 개발자
   * URL: /mis/gen/gen0360/getList.do
   * 예상결과: 휴가촉진확인 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0360M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 휴가촉진확인 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 휴가촉진확인 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0360M-no1.png`, fullPage: true });

    expect(rows.length, "휴가촉진확인 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 휴가촉진확인 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)
   * 중분류:   소분류:   메뉴명: 휴가촉진확인  액터: 개발자
   * URL: /mis/gen/gen0360/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 휴가촉진확인 목록이 조회된다.
   * DB 확인: -- TODO(gen_0360M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 휴가촉진확인 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 휴가촉진확인 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)");
    logInput('검색조건', "{\"SCH_FRM_DT\":\"2026-01-01\",\"SCH_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: "2026-01-01", SCH_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0360M-no2.png`, fullPage: true });

    expect(rows.length, "휴가촉진확인 기간 조회 (SCH_FRM_DT~SCH_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 휴가촉진확인 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)
   * 중분류:   소분류:   메뉴명: 휴가촉진확인  액터: 개발자
   * URL: /mis/gen/gen0360/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_0360M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 휴가촉진확인 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 휴가촉진확인 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)");
    logInput('검색조건', "{\"SCH_FRM_DT\":\"2026-07-05\",\"SCH_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: "2026-07-05", SCH_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0360M-no3.png`, fullPage: true });

    expect(rows.length, "휴가촉진확인 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 휴가촉진확인 - 키워드 검색 (SCH_EMP_NM)
   * 중분류:   소분류:   메뉴명: 휴가촉진확인  액터: 개발자
   * URL: /mis/gen/gen0360/getList.do
   * 예상결과: SCH_EMP_NM에 '테스트'가 포함된 휴가촉진확인 목록이 조회된다.
   * DB 확인: -- TODO(gen_0360M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 휴가촉진확인 - 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 휴가촉진확인 - 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0360M-no4.png`, fullPage: true });

    expect(rows.length, "휴가촉진확인 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0410M — 유연근무제설정관리  |  API: POST /mis/gen/gen0410/getAgwkStdr.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_0410M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0410/getAgwkStdr.do';
  const PGM_ID            = 'gen_0410M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`유연근무제설정관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 유연근무제설정관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 유연근무제설정관리  액터: 개발자
   * URL: /mis/gen/gen0410/getAgwkStdr.do
   * 예상결과: 유연근무제설정관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0410M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 유연근무제설정관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 유연근무제설정관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0410M-no1.png`, fullPage: true });

    expect(rows.length, "유연근무제설정관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0420M — 유연근무제신청목록  |  API: POST /mis/gen/gen0420/getList.do  |  TC 2건  |  ds:ds_list
// TODO(menuId): gen_0420M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0420/getList.do';
  const PGM_ID            = 'gen_0420M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_WORK_FRM_YM', 'SCH_WORK_TO_YM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_APV_STAT_FG', 'SCH_WORK_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`유연근무제신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 유연근무제신청목록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 유연근무제신청목록  액터: 개발자
   * URL: /mis/gen/gen0420/getList.do
   * 예상결과: 유연근무제신청목록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0420M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 유연근무제신청목록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 유연근무제신청목록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0420M-no1.png`, fullPage: true });

    expect(rows.length, "유연근무제신청목록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 유연근무제신청목록 - 키워드 검색 (SCH_DEPT_NM)
   * 중분류:   소분류:   메뉴명: 유연근무제신청목록  액터: 개발자
   * URL: /mis/gen/gen0420/getList.do
   * 예상결과: SCH_DEPT_NM에 '테스트'가 포함된 유연근무제신청목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_0420M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 유연근무제신청목록 - 키워드 검색 (SCH_DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 유연근무제신청목록 - 키워드 검색 (SCH_DEPT_NM)");
    logInput("SCH_DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0420M-no2.png`, fullPage: true });

    expect(rows.length, "유연근무제신청목록 키워드 검색 (SCH_DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0421M — 유연근무신청서(시차출퇴근)  |  API: POST /mis/gen/gen0421/getAprovInfo.do  |  TC 1건  |  ds:ds_wrkTmList
// TODO(menuId): gen_0421M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0421/getAprovInfo.do';
  const PGM_ID            = 'gen_0421M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_wrkTmList';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`유연근무신청서(시차출퇴근)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 유연근무신청서(시차출퇴근) - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 유연근무신청서(시차출퇴근)  액터: 개발자
   * URL: /mis/gen/gen0421/getAprovInfo.do
   * 예상결과: 유연근무신청서(시차출퇴근) 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0421M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 유연근무신청서(시차출퇴근) - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 유연근무신청서(시차출퇴근) - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0421M-no1.png`, fullPage: true });

    expect(rows.length, "유연근무신청서(시차출퇴근) 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0422M — 유연근무신청서(근무시간선택)  |  API: POST /mis/gen/gen0422/getAprovInfo.do  |  TC 1건  |  ds:ds_wrkTmList
// TODO(menuId): gen_0422M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0422/getAprovInfo.do';
  const PGM_ID            = 'gen_0422M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_wrkTmList';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`유연근무신청서(근무시간선택)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 유연근무신청서(근무시간선택) - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 유연근무신청서(근무시간선택)  액터: 개발자
   * URL: /mis/gen/gen0422/getAprovInfo.do
   * 예상결과: 유연근무신청서(근무시간선택) 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0422M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 유연근무신청서(근무시간선택) - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 유연근무신청서(근무시간선택) - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0422M-no1.png`, fullPage: true });

    expect(rows.length, "유연근무신청서(근무시간선택) 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0430M — 유연근무승인목록  |  API: POST /mis/gen/gen0430/getList.do  |  TC 2건  |  ds:ds_list
// TODO(menuId): gen_0430M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0430/getList.do';
  const PGM_ID            = 'gen_0430M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_WORK_FRM_YM', 'SCH_WORK_TO_YM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_APV_STAT_FG', 'SCH_WORK_FG', 'SCH_EMP_CLS'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`유연근무승인목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 유연근무승인목록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 유연근무승인목록  액터: 개발자
   * URL: /mis/gen/gen0430/getList.do
   * 예상결과: 유연근무승인목록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0430M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 유연근무승인목록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 유연근무승인목록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0430M-no1.png`, fullPage: true });

    expect(rows.length, "유연근무승인목록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 유연근무승인목록 - 키워드 검색 (SCH_DEPT_NM)
   * 중분류:   소분류:   메뉴명: 유연근무승인목록  액터: 개발자
   * URL: /mis/gen/gen0430/getList.do
   * 예상결과: SCH_DEPT_NM에 '테스트'가 포함된 유연근무승인목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_0430M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 유연근무승인목록 - 키워드 검색 (SCH_DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 유연근무승인목록 - 키워드 검색 (SCH_DEPT_NM)");
    logInput("SCH_DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0430M-no2.png`, fullPage: true });

    expect(rows.length, "유연근무승인목록 키워드 검색 (SCH_DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0431M — 유연근무승인(시차출퇴근)  |  API: POST /mis/gen/gen0431/getAttnLvfcTm.do  |  TC 1건  |  ds:ds_wrkTmList
// TODO(menuId): gen_0431M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0431/getAttnLvfcTm.do';
  const PGM_ID            = 'gen_0431M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_wrkTmList';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`유연근무승인(시차출퇴근)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 유연근무승인(시차출퇴근) - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 유연근무승인(시차출퇴근)  액터: 개발자
   * URL: /mis/gen/gen0431/getAttnLvfcTm.do
   * 예상결과: 유연근무승인(시차출퇴근) 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0431M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 유연근무승인(시차출퇴근) - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 유연근무승인(시차출퇴근) - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0431M-no1.png`, fullPage: true });

    expect(rows.length, "유연근무승인(시차출퇴근) 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0432M — 유연근무승인(근무시간선택)  |  API: POST /mis/gen/gen0432/getChkWorkYm.do  |  TC 1건  |  ds:ds_wrkTmList
// TODO(menuId): gen_0432M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0432/getChkWorkYm.do';
  const PGM_ID            = 'gen_0432M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_wrkTmList';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`유연근무승인(근무시간선택)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 유연근무승인(근무시간선택) - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 유연근무승인(근무시간선택)  액터: 개발자
   * URL: /mis/gen/gen0432/getChkWorkYm.do
   * 예상결과: 유연근무승인(근무시간선택) 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0432M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 유연근무승인(근무시간선택) - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 유연근무승인(근무시간선택) - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0432M-no1.png`, fullPage: true });

    expect(rows.length, "유연근무승인(근무시간선택) 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0510M — 단축근무신청목록  |  API: POST /mis/gen/gen0510/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0510M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0510/getList.do';
  const PGM_ID            = 'gen_0510M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'APV_STAT_CD', 'RQST_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`단축근무신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 단축근무신청목록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 단축근무신청목록  액터: 개발자
   * URL: /mis/gen/gen0510/getList.do
   * 예상결과: 단축근무신청목록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0510M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 단축근무신청목록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 단축근무신청목록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0510M-no1.png`, fullPage: true });

    expect(rows.length, "단축근무신청목록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 단축근무신청목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 단축근무신청목록  액터: 개발자
   * URL: /mis/gen/gen0510/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 단축근무신청목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_0510M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 단축근무신청목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 단축근무신청목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0510M-no2.png`, fullPage: true });

    expect(rows.length, "단축근무신청목록 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 단축근무신청목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 단축근무신청목록  액터: 개발자
   * URL: /mis/gen/gen0510/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_0510M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 단축근무신청목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 단축근무신청목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0510M-no3.png`, fullPage: true });

    expect(rows.length, "단축근무신청목록 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 단축근무신청목록 - 키워드 검색 (DEPT_NM)
   * 중분류:   소분류:   메뉴명: 단축근무신청목록  액터: 개발자
   * URL: /mis/gen/gen0510/getList.do
   * 예상결과: DEPT_NM에 '테스트'가 포함된 단축근무신청목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_0510M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 단축근무신청목록 - 키워드 검색 (DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 단축근무신청목록 - 키워드 검색 (DEPT_NM)");
    logInput("DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0510M-no4.png`, fullPage: true });

    expect(rows.length, "단축근무신청목록 키워드 검색 (DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0511M — 단축근무신청  |  API: POST /mis/gen/gen0511/getData.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_0511M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0511/getData.do';
  const PGM_ID            = 'gen_0511M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`단축근무신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 단축근무신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 단축근무신청  액터: 개발자
   * URL: /mis/gen/gen0511/getData.do
   * 예상결과: 단축근무신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0511M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 단축근무신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 단축근무신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0511M-no1.png`, fullPage: true });

    expect(rows.length, "단축근무신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0610M — 재택근무신청목록  |  API: POST /mis/gen/gen0610/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0610M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0610/getList.do';
  const PGM_ID            = 'gen_0610M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NM', 'SCH_EMP_NO', 'ACCP_STAT_FG', 'RQST_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`재택근무신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 재택근무신청목록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 재택근무신청목록  액터: 개발자
   * URL: /mis/gen/gen0610/getList.do
   * 예상결과: 재택근무신청목록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0610M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 재택근무신청목록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 재택근무신청목록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0610M-no1.png`, fullPage: true });

    expect(rows.length, "재택근무신청목록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 재택근무신청목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 재택근무신청목록  액터: 개발자
   * URL: /mis/gen/gen0610/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 재택근무신청목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_0610M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 재택근무신청목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 재택근무신청목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0610M-no2.png`, fullPage: true });

    expect(rows.length, "재택근무신청목록 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 재택근무신청목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 재택근무신청목록  액터: 개발자
   * URL: /mis/gen/gen0610/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_0610M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 재택근무신청목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 재택근무신청목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0610M-no3.png`, fullPage: true });

    expect(rows.length, "재택근무신청목록 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 재택근무신청목록 - 키워드 검색 (DEPT_NM)
   * 중분류:   소분류:   메뉴명: 재택근무신청목록  액터: 개발자
   * URL: /mis/gen/gen0610/getList.do
   * 예상결과: DEPT_NM에 '테스트'가 포함된 재택근무신청목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_0610M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 재택근무신청목록 - 키워드 검색 (DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 재택근무신청목록 - 키워드 검색 (DEPT_NM)");
    logInput("DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0610M-no4.png`, fullPage: true });

    expect(rows.length, "재택근무신청목록 키워드 검색 (DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0611M — 재택근무신청  |  API: POST /mis/gen/gen0611/getData.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_0611M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0611/getData.do';
  const PGM_ID            = 'gen_0611M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`재택근무신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 재택근무신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 재택근무신청  액터: 개발자
   * URL: /mis/gen/gen0611/getData.do
   * 예상결과: 재택근무신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0611M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 재택근무신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 재택근무신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0611M-no1.png`, fullPage: true });

    expect(rows.length, "재택근무신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0620M — 재택근무승인관리  |  API: POST /mis/gen/gen0620/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0620M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0620/getList.do';
  const PGM_ID            = 'gen_0620M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'ACCP_STAT_FG', 'RQST_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`재택근무승인관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 재택근무승인관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 재택근무승인관리  액터: 개발자
   * URL: /mis/gen/gen0620/getList.do
   * 예상결과: 재택근무승인관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0620M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 재택근무승인관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 재택근무승인관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0620M-no1.png`, fullPage: true });

    expect(rows.length, "재택근무승인관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 재택근무승인관리 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 재택근무승인관리  액터: 개발자
   * URL: /mis/gen/gen0620/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 재택근무승인관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_0620M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 재택근무승인관리 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 재택근무승인관리 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0620M-no2.png`, fullPage: true });

    expect(rows.length, "재택근무승인관리 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 재택근무승인관리 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 재택근무승인관리  액터: 개발자
   * URL: /mis/gen/gen0620/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_0620M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 재택근무승인관리 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 재택근무승인관리 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0620M-no3.png`, fullPage: true });

    expect(rows.length, "재택근무승인관리 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 재택근무승인관리 - 키워드 검색 (DEPT_NM)
   * 중분류:   소분류:   메뉴명: 재택근무승인관리  액터: 개발자
   * URL: /mis/gen/gen0620/getList.do
   * 예상결과: DEPT_NM에 '테스트'가 포함된 재택근무승인관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_0620M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 재택근무승인관리 - 키워드 검색 (DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 재택근무승인관리 - 키워드 검색 (DEPT_NM)");
    logInput("DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0620M-no4.png`, fullPage: true });

    expect(rows.length, "재택근무승인관리 키워드 검색 (DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0630M — 업무일지등록목록  |  API: POST /mis/gen/gen0630/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0630M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0630/getList.do';
  const PGM_ID            = 'gen_0630M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_ACCP_STAT_FG', 'SCH_RQST_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`업무일지등록목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 업무일지등록목록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 업무일지등록목록  액터: 개발자
   * URL: /mis/gen/gen0630/getList.do
   * 예상결과: 업무일지등록목록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0630M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 업무일지등록목록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 업무일지등록목록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0630M-no1.png`, fullPage: true });

    expect(rows.length, "업무일지등록목록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 업무일지등록목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 업무일지등록목록  액터: 개발자
   * URL: /mis/gen/gen0630/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 업무일지등록목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_0630M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 업무일지등록목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 업무일지등록목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0630M-no2.png`, fullPage: true });

    expect(rows.length, "업무일지등록목록 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 업무일지등록목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 업무일지등록목록  액터: 개발자
   * URL: /mis/gen/gen0630/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_0630M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 업무일지등록목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 업무일지등록목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0630M-no3.png`, fullPage: true });

    expect(rows.length, "업무일지등록목록 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 업무일지등록목록 - 키워드 검색 (SCH_DEPT_NM)
   * 중분류:   소분류:   메뉴명: 업무일지등록목록  액터: 개발자
   * URL: /mis/gen/gen0630/getList.do
   * 예상결과: SCH_DEPT_NM에 '테스트'가 포함된 업무일지등록목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_0630M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 업무일지등록목록 - 키워드 검색 (SCH_DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 업무일지등록목록 - 키워드 검색 (SCH_DEPT_NM)");
    logInput("SCH_DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0630M-no4.png`, fullPage: true });

    expect(rows.length, "업무일지등록목록 키워드 검색 (SCH_DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0631M — 업무일지등록  |  API: POST /mis/gen/gen0631/getHmtrWorkData.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_0631M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0631/getHmtrWorkData.do';
  const PGM_ID            = 'gen_0631M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`업무일지등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 업무일지등록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 업무일지등록  액터: 개발자
   * URL: /mis/gen/gen0631/getHmtrWorkData.do
   * 예상결과: 업무일지등록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0631M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 업무일지등록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 업무일지등록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0631M-no1.png`, fullPage: true });

    expect(rows.length, "업무일지등록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0640M — 업무일지승인관리  |  API: POST /mis/gen/gen0640/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0640M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0640/getList.do';
  const PGM_ID            = 'gen_0640M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_ACCP_STAT_FG', 'SCH_RQST_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`업무일지승인관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 업무일지승인관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 업무일지승인관리  액터: 개발자
   * URL: /mis/gen/gen0640/getList.do
   * 예상결과: 업무일지승인관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0640M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 업무일지승인관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 업무일지승인관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0640M-no1.png`, fullPage: true });

    expect(rows.length, "업무일지승인관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 업무일지승인관리 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 업무일지승인관리  액터: 개발자
   * URL: /mis/gen/gen0640/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 업무일지승인관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_0640M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 업무일지승인관리 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 업무일지승인관리 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0640M-no2.png`, fullPage: true });

    expect(rows.length, "업무일지승인관리 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 업무일지승인관리 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 업무일지승인관리  액터: 개발자
   * URL: /mis/gen/gen0640/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_0640M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 업무일지승인관리 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 업무일지승인관리 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0640M-no3.png`, fullPage: true });

    expect(rows.length, "업무일지승인관리 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 업무일지승인관리 - 키워드 검색 (SCH_DEPT_NM)
   * 중분류:   소분류:   메뉴명: 업무일지승인관리  액터: 개발자
   * URL: /mis/gen/gen0640/getList.do
   * 예상결과: SCH_DEPT_NM에 '테스트'가 포함된 업무일지승인관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_0640M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 업무일지승인관리 - 키워드 검색 (SCH_DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 업무일지승인관리 - 키워드 검색 (SCH_DEPT_NM)");
    logInput("SCH_DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0640M-no4.png`, fullPage: true });

    expect(rows.length, "업무일지승인관리 키워드 검색 (SCH_DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0710M — 임금피크제신청목록  |  API: POST /mis/gen/gen0710/getList.do  |  TC 2건  |  ds:ds_list
// TODO(menuId): gen_0710M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0710/getList.do';
  const PGM_ID            = 'gen_0710M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['WORK_FRM_YM', 'WORK_TO_YM', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'APV_STAT_CD', 'RQST_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`임금피크제신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 임금피크제신청목록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 임금피크제신청목록  액터: 개발자
   * URL: /mis/gen/gen0710/getList.do
   * 예상결과: 임금피크제신청목록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0710M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 임금피크제신청목록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 임금피크제신청목록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0710M-no1.png`, fullPage: true });

    expect(rows.length, "임금피크제신청목록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 임금피크제신청목록 - 키워드 검색 (DEPT_NM)
   * 중분류:   소분류:   메뉴명: 임금피크제신청목록  액터: 개발자
   * URL: /mis/gen/gen0710/getList.do
   * 예상결과: DEPT_NM에 '테스트'가 포함된 임금피크제신청목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_0710M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 임금피크제신청목록 - 키워드 검색 (DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 임금피크제신청목록 - 키워드 검색 (DEPT_NM)");
    logInput("DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0710M-no2.png`, fullPage: true });

    expect(rows.length, "임금피크제신청목록 키워드 검색 (DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0711M — 임금피크제신청  |  API: POST /mis/gen/gen0711/getHdayMonList.do  |  TC 1건  |  ds:ds_wdayPlanList
// TODO(menuId): gen_0711M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0711/getHdayMonList.do';
  const PGM_ID            = 'gen_0711M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_wdayPlanList';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`임금피크제신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 임금피크제신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 임금피크제신청  액터: 개발자
   * URL: /mis/gen/gen0711/getHdayMonList.do
   * 예상결과: 임금피크제신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0711M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 임금피크제신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 임금피크제신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0711M-no1.png`, fullPage: true });

    expect(rows.length, "임금피크제신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0810M — 조기퇴근제신청목록  |  API: POST /mis/gen/gen0810/getList.do  |  TC 2건  |  ds:ds_list
// TODO(menuId): gen_0810M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0810/getList.do';
  const PGM_ID            = 'gen_0810M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['WORK_FRM_YM', 'WORK_TO_YM', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'APV_STAT_CD', 'RQST_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`조기퇴근제신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 조기퇴근제신청목록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 조기퇴근제신청목록  액터: 개발자
   * URL: /mis/gen/gen0810/getList.do
   * 예상결과: 조기퇴근제신청목록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0810M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 조기퇴근제신청목록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 조기퇴근제신청목록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0810M-no1.png`, fullPage: true });

    expect(rows.length, "조기퇴근제신청목록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 조기퇴근제신청목록 - 키워드 검색 (DEPT_NM)
   * 중분류:   소분류:   메뉴명: 조기퇴근제신청목록  액터: 개발자
   * URL: /mis/gen/gen0810/getList.do
   * 예상결과: DEPT_NM에 '테스트'가 포함된 조기퇴근제신청목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_0810M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 조기퇴근제신청목록 - 키워드 검색 (DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 조기퇴근제신청목록 - 키워드 검색 (DEPT_NM)");
    logInput("DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0810M-no2.png`, fullPage: true });

    expect(rows.length, "조기퇴근제신청목록 키워드 검색 (DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0811M — 조기퇴근제  |  API: POST /mis/gen/gen0811/getMonList.do  |  TC 1건  |  ds:ds_monList
// TODO(menuId): gen_0811M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0811/getMonList.do';
  const PGM_ID            = 'gen_0811M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_monList';
  const DS_SEARCH_COLUMNS = ['WORR_EMP_NO', 'WORR_WORK_DGCNT', 'WDAY', 'DT', 'EARLY_LVFC_RQST_NO', 'PRV_EARLY_LVFC_RQST_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`조기퇴근제(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 조기퇴근제 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 조기퇴근제  액터: 개발자
   * URL: /mis/gen/gen0811/getMonList.do
   * 예상결과: 조기퇴근제 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0811M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 조기퇴근제 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 조기퇴근제 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0811M-no1.png`, fullPage: true });

    expect(rows.length, "조기퇴근제 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0900M — 시간외근무설정관리  |  API: POST /mis/gen/gen0900/getPastData.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_0900M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0900/getPastData.do';
  const PGM_ID            = 'gen_0900M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['APLY_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`시간외근무설정관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 시간외근무설정관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 시간외근무설정관리  액터: 개발자
   * URL: /mis/gen/gen0900/getPastData.do
   * 예상결과: 시간외근무설정관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0900M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 시간외근무설정관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 시간외근무설정관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0900M-no1.png`, fullPage: true });

    expect(rows.length, "시간외근무설정관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0910M — 시간외근무기준관리  |  API: POST /mis/gen/gen0910/getData.do  |  TC 2건  |  ds:ds_stdrTmList
// TODO(menuId): gen_0910M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0910/getData.do';
  const PGM_ID            = 'gen_0910M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_stdrTmList';
  const DS_SEARCH_COLUMNS = ['SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_HLDF_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`시간외근무기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 시간외근무기준관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 시간외근무기준관리  액터: 개발자
   * URL: /mis/gen/gen0910/getData.do
   * 예상결과: 시간외근무기준관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0910M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 시간외근무기준관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 시간외근무기준관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0910M-no1.png`, fullPage: true });

    expect(rows.length, "시간외근무기준관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 시간외근무기준관리 - 키워드 검색 (SCH_DEPT_NM)
   * 중분류:   소분류:   메뉴명: 시간외근무기준관리  액터: 개발자
   * URL: /mis/gen/gen0910/getData.do
   * 예상결과: SCH_DEPT_NM에 '테스트'가 포함된 시간외근무기준관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_0910M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 시간외근무기준관리 - 키워드 검색 (SCH_DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 시간외근무기준관리 - 키워드 검색 (SCH_DEPT_NM)");
    logInput("SCH_DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0910M-no2.png`, fullPage: true });

    expect(rows.length, "시간외근무기준관리 키워드 검색 (SCH_DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0920M — 시간외근무신청목록  |  API: POST /mis/gen/gen0920/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0920M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0920/getList.do';
  const PGM_ID            = 'gen_0920M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_APV_STAT_FG', 'SCH_RQST_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`시간외근무신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 시간외근무신청목록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 시간외근무신청목록  액터: 개발자
   * URL: /mis/gen/gen0920/getList.do
   * 예상결과: 시간외근무신청목록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0920M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 시간외근무신청목록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 시간외근무신청목록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0920M-no1.png`, fullPage: true });

    expect(rows.length, "시간외근무신청목록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 시간외근무신청목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 시간외근무신청목록  액터: 개발자
   * URL: /mis/gen/gen0920/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 시간외근무신청목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_0920M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 시간외근무신청목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 시간외근무신청목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0920M-no2.png`, fullPage: true });

    expect(rows.length, "시간외근무신청목록 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 시간외근무신청목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 시간외근무신청목록  액터: 개발자
   * URL: /mis/gen/gen0920/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_0920M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 시간외근무신청목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 시간외근무신청목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0920M-no3.png`, fullPage: true });

    expect(rows.length, "시간외근무신청목록 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 시간외근무신청목록 - 키워드 검색 (SCH_DEPT_NM)
   * 중분류:   소분류:   메뉴명: 시간외근무신청목록  액터: 개발자
   * URL: /mis/gen/gen0920/getList.do
   * 예상결과: SCH_DEPT_NM에 '테스트'가 포함된 시간외근무신청목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_0920M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 시간외근무신청목록 - 키워드 검색 (SCH_DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 시간외근무신청목록 - 키워드 검색 (SCH_DEPT_NM)");
    logInput("SCH_DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0920M-no4.png`, fullPage: true });

    expect(rows.length, "시간외근무신청목록 키워드 검색 (SCH_DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0921M — 시간외근무신청  |  API: POST /mis/gen/gen0921/getExclusRoofCdList.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_0921M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0921/getExclusRoofCdList.do';
  const PGM_ID            = 'gen_0921M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`시간외근무신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 시간외근무신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 시간외근무신청  액터: 개발자
   * URL: /mis/gen/gen0921/getExclusRoofCdList.do
   * 예상결과: 시간외근무신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0921M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 시간외근무신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 시간외근무신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0921M-no1.png`, fullPage: true });

    expect(rows.length, "시간외근무신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0925M — 시간외근무입출근시간관리  |  API: POST /mis/gen/gen0925/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0925M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0925/getList.do';
  const PGM_ID            = 'gen_0925M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_RWRD_FG', 'SCH_RWRD_CREATE_YN', 'SCH_SFCN_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`시간외근무입출근시간관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 시간외근무입출근시간관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 시간외근무입출근시간관리  액터: 개발자
   * URL: /mis/gen/gen0925/getList.do
   * 예상결과: 시간외근무입출근시간관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0925M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 시간외근무입출근시간관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 시간외근무입출근시간관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0925M-no1.png`, fullPage: true });

    expect(rows.length, "시간외근무입출근시간관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 시간외근무입출근시간관리 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)
   * 중분류:   소분류:   메뉴명: 시간외근무입출근시간관리  액터: 개발자
   * URL: /mis/gen/gen0925/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 시간외근무입출근시간관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_0925M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 시간외근무입출근시간관리 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 시간외근무입출근시간관리 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)");
    logInput('검색조건', "{\"SCH_FRM_DT\":\"2026-01-01\",\"SCH_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: "2026-01-01", SCH_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0925M-no2.png`, fullPage: true });

    expect(rows.length, "시간외근무입출근시간관리 기간 조회 (SCH_FRM_DT~SCH_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 시간외근무입출근시간관리 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)
   * 중분류:   소분류:   메뉴명: 시간외근무입출근시간관리  액터: 개발자
   * URL: /mis/gen/gen0925/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_0925M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 시간외근무입출근시간관리 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 시간외근무입출근시간관리 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)");
    logInput('검색조건', "{\"SCH_FRM_DT\":\"2026-07-05\",\"SCH_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: "2026-07-05", SCH_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0925M-no3.png`, fullPage: true });

    expect(rows.length, "시간외근무입출근시간관리 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 시간외근무입출근시간관리 - 키워드 검색 (SCH_DEPT_NM)
   * 중분류:   소분류:   메뉴명: 시간외근무입출근시간관리  액터: 개발자
   * URL: /mis/gen/gen0925/getList.do
   * 예상결과: SCH_DEPT_NM에 '테스트'가 포함된 시간외근무입출근시간관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_0925M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 시간외근무입출근시간관리 - 키워드 검색 (SCH_DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 시간외근무입출근시간관리 - 키워드 검색 (SCH_DEPT_NM)");
    logInput("SCH_DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0925M-no4.png`, fullPage: true });

    expect(rows.length, "시간외근무입출근시간관리 키워드 검색 (SCH_DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0929M — 시간외수당집계기준  |  API: POST /mis/gen/gen0929/getList.do  |  TC 3건  |  ds:ds_list
// TODO(menuId): gen_0929M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0929/getList.do';
  const PGM_ID            = 'gen_0929M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_YY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`시간외수당집계기준(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 시간외수당집계기준 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 시간외수당집계기준  액터: 개발자
   * URL: /mis/gen/gen0929/getList.do
   * 예상결과: 시간외수당집계기준 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0929M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 시간외수당집계기준 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 시간외수당집계기준 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0929M-no1.png`, fullPage: true });

    expect(rows.length, "시간외수당집계기준 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 시간외수당집계기준 - 연도/연월 조건 조회 (SCH_YY)
   * 중분류:   소분류:   메뉴명: 시간외수당집계기준  액터: 개발자
   * URL: /mis/gen/gen0929/getList.do
   * 예상결과: 지정 연도(2026)의 시간외수당집계기준 목록이 조회된다.
   * DB 확인: -- TODO(gen_0929M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 시간외수당집계기준 - 연도/연월 조건 조회 (SCH_YY)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 시간외수당집계기준 - 연도/연월 조건 조회 (SCH_YY)");
    logInput("SCH_YY", "2026");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_YY: "2026" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0929M-no2.png`, fullPage: true });

    expect(rows.length, "시간외수당집계기준 연도/연월 조건 조회 (SCH_YY) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 시간외수당집계기준 - 존재하지 않는 연도 조회 (SCH_YY=1900)
   * 중분류:   소분류:   메뉴명: 시간외수당집계기준  액터: 개발자
   * URL: /mis/gen/gen0929/getList.do
   * 예상결과: 존재하지 않는 연도(1900) 조회 시 목록이 없거나 정상 응답한다.
   * DB 확인: -- TODO(gen_0929M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 시간외수당집계기준 - 존재하지 않는 연도 조회 (SCH_YY=1900)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 시간외수당집계기준 - 존재하지 않는 연도 조회 (SCH_YY=1900)");
    logInput("SCH_YY", "1900");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_YY: "1900" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0929M-no3.png`, fullPage: true });

    expect(rows.length, "시간외수당집계기준 존재하지 않는 연도 조회 (SCH_YY=1900) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0930M — 월별시간외수당계산및확정  |  API: POST /mis/gen/gen0930/getData.do  |  TC 3건  |  ds:ds_list
// TODO(menuId): gen_0930M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0930/getData.do';
  const PGM_ID            = 'gen_0930M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_YYMM', 'CLOS_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`월별시간외수당계산및확정(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 월별시간외수당계산및확정 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 월별시간외수당계산및확정  액터: 개발자
   * URL: /mis/gen/gen0930/getData.do
   * 예상결과: 월별시간외수당계산및확정 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0930M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 월별시간외수당계산및확정 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 월별시간외수당계산및확정 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0930M-no1.png`, fullPage: true });

    expect(rows.length, "월별시간외수당계산및확정 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 월별시간외수당계산및확정 - 연도/연월 조건 조회 (SCH_YYMM)
   * 중분류:   소분류:   메뉴명: 월별시간외수당계산및확정  액터: 개발자
   * URL: /mis/gen/gen0930/getData.do
   * 예상결과: 지정 연도(2026)의 월별시간외수당계산및확정 목록이 조회된다.
   * DB 확인: -- TODO(gen_0930M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 월별시간외수당계산및확정 - 연도/연월 조건 조회 (SCH_YYMM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 월별시간외수당계산및확정 - 연도/연월 조건 조회 (SCH_YYMM)");
    logInput("SCH_YYMM", "2026");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_YYMM: "2026" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0930M-no2.png`, fullPage: true });

    expect(rows.length, "월별시간외수당계산및확정 연도/연월 조건 조회 (SCH_YYMM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 월별시간외수당계산및확정 - 존재하지 않는 연도 조회 (SCH_YYMM=1900)
   * 중분류:   소분류:   메뉴명: 월별시간외수당계산및확정  액터: 개발자
   * URL: /mis/gen/gen0930/getData.do
   * 예상결과: 존재하지 않는 연도(1900) 조회 시 목록이 없거나 정상 응답한다.
   * DB 확인: -- TODO(gen_0930M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 월별시간외수당계산및확정 - 존재하지 않는 연도 조회 (SCH_YYMM=1900)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 월별시간외수당계산및확정 - 존재하지 않는 연도 조회 (SCH_YYMM=1900)");
    logInput("SCH_YYMM", "1900");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_YYMM: "1900" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0930M-no3.png`, fullPage: true });

    expect(rows.length, "월별시간외수당계산및확정 존재하지 않는 연도 조회 (SCH_YYMM=1900) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0950M — 근태현황  |  API: POST /mis/gen/gen0950/getList1.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_0950M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0950/getList1.do';
  const PGM_ID            = 'gen_0950M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['FRM_DT', 'TO_DT', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'DCLZ_FG', 'HLDF_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`근태현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 근태현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 근태현황  액터: 개발자
   * URL: /mis/gen/gen0950/getList1.do
   * 예상결과: 근태현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0950M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 근태현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 근태현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0950M-no1.png`, fullPage: true });

    expect(rows.length, "근태현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 근태현황 - 기간 조회 (FRM_DT~TO_DT)
   * 중분류:   소분류:   메뉴명: 근태현황  액터: 개발자
   * URL: /mis/gen/gen0950/getList1.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 근태현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_0950M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 근태현황 - 기간 조회 (FRM_DT~TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 근태현황 - 기간 조회 (FRM_DT~TO_DT)");
    logInput('검색조건', "{\"FRM_DT\":\"2026-01-01\",\"TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_DT: "2026-01-01", TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0950M-no2.png`, fullPage: true });

    expect(rows.length, "근태현황 기간 조회 (FRM_DT~TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 근태현황 - 역방향 기간 조회 (0건 확인, FRM_DT>TO_DT)
   * 중분류:   소분류:   메뉴명: 근태현황  액터: 개발자
   * URL: /mis/gen/gen0950/getList1.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_0950M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 근태현황 - 역방향 기간 조회 (0건 확인, FRM_DT>TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 근태현황 - 역방향 기간 조회 (0건 확인, FRM_DT>TO_DT)");
    logInput('검색조건', "{\"FRM_DT\":\"2026-07-05\",\"TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_DT: "2026-07-05", TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0950M-no3.png`, fullPage: true });

    expect(rows.length, "근태현황 역방향 기간 조회 (0건 확인, FRM_DT>TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 근태현황 - 키워드 검색 (EMP_NM)
   * 중분류:   소분류:   메뉴명: 근태현황  액터: 개발자
   * URL: /mis/gen/gen0950/getList1.do
   * 예상결과: EMP_NM에 '테스트'가 포함된 근태현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_0950M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 근태현황 - 키워드 검색 (EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 근태현황 - 키워드 검색 (EMP_NM)");
    logInput("EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0950M-no4.png`, fullPage: true });

    expect(rows.length, "근태현황 키워드 검색 (EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_0951M — 출퇴근기록조정  |  API: POST /mis/gen/gen0950/getAttnLvfcList.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_0951M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen0950/getAttnLvfcList.do';
  const PGM_ID            = 'gen_0951M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`출퇴근기록조정(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 출퇴근기록조정 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 출퇴근기록조정  액터: 개발자
   * URL: /mis/gen/gen0950/getAttnLvfcList.do
   * 예상결과: 출퇴근기록조정 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_0951M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 출퇴근기록조정 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 출퇴근기록조정 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_0951M-no1.png`, fullPage: true });

    expect(rows.length, "출퇴근기록조정 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1010M — 국내출장지급기준관리  |  API: POST /mis/gen/gen1010/getList.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_1010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1010/getList.do';
  const PGM_ID            = 'gen_1010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국내출장지급기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국내출장지급기준관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국내출장지급기준관리  액터: 개발자
   * URL: /mis/gen/gen1010/getList.do
   * 예상결과: 국내출장지급기준관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국내출장지급기준관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국내출장지급기준관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1010M-no1.png`, fullPage: true });

    expect(rows.length, "국내출장지급기준관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1011M — 연비기준관리  |  API: POST /mis/gen/gen1011/getMaxYymm.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_1011M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1011/getMaxYymm.do';
  const PGM_ID            = 'gen_1011M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_APLY_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`연비기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 연비기준관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 연비기준관리  액터: 개발자
   * URL: /mis/gen/gen1011/getMaxYymm.do
   * 예상결과: 연비기준관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1011M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 연비기준관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 연비기준관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1011M-no1.png`, fullPage: true });

    expect(rows.length, "연비기준관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1012M — 유가현황  |  API: POST /mis/gen/gen1012/getAvgAllPriceList.do  |  TC 3건  |  ds:ds_list
// TODO(menuId): gen_1012M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1012/getAvgAllPriceList.do';
  const PGM_ID            = 'gen_1012M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_FUEL_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`유가현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 유가현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 유가현황  액터: 개발자
   * URL: /mis/gen/gen1012/getAvgAllPriceList.do
   * 예상결과: 유가현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1012M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 유가현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 유가현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1012M-no1.png`, fullPage: true });

    expect(rows.length, "유가현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 유가현황 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)
   * 중분류:   소분류:   메뉴명: 유가현황  액터: 개발자
   * URL: /mis/gen/gen1012/getAvgAllPriceList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 유가현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_1012M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 유가현황 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 유가현황 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)");
    logInput('검색조건', "{\"SCH_FRM_DT\":\"2026-01-01\",\"SCH_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: "2026-01-01", SCH_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1012M-no2.png`, fullPage: true });

    expect(rows.length, "유가현황 기간 조회 (SCH_FRM_DT~SCH_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 유가현황 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)
   * 중분류:   소분류:   메뉴명: 유가현황  액터: 개발자
   * URL: /mis/gen/gen1012/getAvgAllPriceList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_1012M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 유가현황 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 유가현황 - 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT)");
    logInput('검색조건', "{\"SCH_FRM_DT\":\"2026-07-05\",\"SCH_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: "2026-07-05", SCH_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1012M-no3.png`, fullPage: true });

    expect(rows.length, "유가현황 역방향 기간 조회 (0건 확인, SCH_FRM_DT>SCH_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1013M — 기타요금기준  |  API: POST /mis/gen/gen1013/getMaxYymm.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_1013M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1013/getMaxYymm.do';
  const PGM_ID            = 'gen_1013M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_APLY_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기타요금기준(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기타요금기준 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 기타요금기준  액터: 개발자
   * URL: /mis/gen/gen1013/getMaxYymm.do
   * 예상결과: 기타요금기준 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1013M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 기타요금기준 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 기타요금기준 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1013M-no1.png`, fullPage: true });

    expect(rows.length, "기타요금기준 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1020M — 국내출장지급기준관리  |  API: POST /mis/gen/gen1020/getList.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_1020M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1020/getList.do';
  const PGM_ID            = 'gen_1020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['STDR_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국내출장지급기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국내출장지급기준관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국내출장지급기준관리  액터: 개발자
   * URL: /mis/gen/gen1020/getList.do
   * 예상결과: 국내출장지급기준관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국내출장지급기준관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국내출장지급기준관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1020M-no1.png`, fullPage: true });

    expect(rows.length, "국내출장지급기준관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1030M — 국외출장지역코드관리  |  API: POST /mis/gen/gen1030/getList.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_1030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1030/getList.do';
  const PGM_ID            = 'gen_1030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국외출장지역코드관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국외출장지역코드관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국외출장지역코드관리  액터: 개발자
   * URL: /mis/gen/gen1030/getList.do
   * 예상결과: 국외출장지역코드관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1030M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국외출장지역코드관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국외출장지역코드관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1030M-no1.png`, fullPage: true });

    expect(rows.length, "국외출장지역코드관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1040M — 국외출장지급기준관리  |  API: POST /mis/gen/gen1040/getList.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_1040M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1040/getList.do';
  const PGM_ID            = 'gen_1040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국외출장지급기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국외출장지급기준관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국외출장지급기준관리  액터: 개발자
   * URL: /mis/gen/gen1040/getList.do
   * 예상결과: 국외출장지급기준관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1040M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국외출장지급기준관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국외출장지급기준관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1040M-no1.png`, fullPage: true });

    expect(rows.length, "국외출장지급기준관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1210M — 국내출장신청  |  API: POST /mis/gen/gen1210/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_1210M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1210/getList.do';
  const PGM_ID            = 'gen_1210M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['TRP_FRM_DT', 'TRP_TO_DT', 'TRP_TY_FG', 'TRP_FG', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'APV_STAT_FG', 'RQST_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국내출장신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국내출장신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국내출장신청  액터: 개발자
   * URL: /mis/gen/gen1210/getList.do
   * 예상결과: 국내출장신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1210M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국내출장신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국내출장신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1210M-no1.png`, fullPage: true });

    expect(rows.length, "국내출장신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 국내출장신청 - 기간 조회 (TRP_FRM_DT~TRP_TO_DT)
   * 중분류:   소분류:   메뉴명: 국내출장신청  액터: 개발자
   * URL: /mis/gen/gen1210/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 국내출장신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_1210M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 국내출장신청 - 기간 조회 (TRP_FRM_DT~TRP_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 국내출장신청 - 기간 조회 (TRP_FRM_DT~TRP_TO_DT)");
    logInput('검색조건', "{\"TRP_FRM_DT\":\"2026-01-01\",\"TRP_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ TRP_FRM_DT: "2026-01-01", TRP_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1210M-no2.png`, fullPage: true });

    expect(rows.length, "국내출장신청 기간 조회 (TRP_FRM_DT~TRP_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 국내출장신청 - 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT)
   * 중분류:   소분류:   메뉴명: 국내출장신청  액터: 개발자
   * URL: /mis/gen/gen1210/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_1210M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 국내출장신청 - 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 국내출장신청 - 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT)");
    logInput('검색조건', "{\"TRP_FRM_DT\":\"2026-07-05\",\"TRP_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ TRP_FRM_DT: "2026-07-05", TRP_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1210M-no3.png`, fullPage: true });

    expect(rows.length, "국내출장신청 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 국내출장신청 - 키워드 검색 (EMP_NM)
   * 중분류:   소분류:   메뉴명: 국내출장신청  액터: 개발자
   * URL: /mis/gen/gen1210/getList.do
   * 예상결과: EMP_NM에 '테스트'가 포함된 국내출장신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_1210M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 국내출장신청 - 키워드 검색 (EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 국내출장신청 - 키워드 검색 (EMP_NM)");
    logInput("EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1210M-no4.png`, fullPage: true });

    expect(rows.length, "국내출장신청 키워드 검색 (EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1211M — 국내출장신청  |  API: POST /mis/act/act0000/getActComm.do  |  TC 1건  |  ds:ds_result
// TODO(menuId): gen_1211M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getActComm.do';
  const PGM_ID            = 'gen_1211M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_result';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국내출장신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국내출장신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국내출장신청  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: 국내출장신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1211M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국내출장신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국내출장신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1211M-no1.png`, fullPage: true });

    expect(rows.length, "국내출장신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1212M — 국내출장변경/취소신청  |  API: POST /mis/act/act0000/getActComm.do  |  TC 1건  |  ds:ds_result
// TODO(menuId): gen_1212M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getActComm.do';
  const PGM_ID            = 'gen_1212M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_result';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국내출장변경/취소신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국내출장변경/취소신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국내출장변경/취소신청  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: 국내출장변경/취소신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1212M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국내출장변경/취소신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국내출장변경/취소신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1212M-no1.png`, fullPage: true });

    expect(rows.length, "국내출장변경/취소신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1213M — 국내출장신청  |  API: POST /mis/act/act0000/getActComm.do  |  TC 1건  |  ds:ds_result
// TODO(menuId): gen_1213M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getActComm.do';
  const PGM_ID            = 'gen_1213M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_result';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국내출장신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국내출장신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국내출장신청  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: 국내출장신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1213M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국내출장신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국내출장신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1213M-no1.png`, fullPage: true });

    expect(rows.length, "국내출장신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1220M — 국내출장정산신청  |  API: POST /mis/gen/gen1220/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_1220M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1220/getList.do';
  const PGM_ID            = 'gen_1220M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['TRP_FRM_DT', 'TRP_TO_DT', 'TRP_TY_FG', 'TRP_FG', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'APV_STAT_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국내출장정산신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국내출장정산신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국내출장정산신청  액터: 개발자
   * URL: /mis/gen/gen1220/getList.do
   * 예상결과: 국내출장정산신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1220M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국내출장정산신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국내출장정산신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1220M-no1.png`, fullPage: true });

    expect(rows.length, "국내출장정산신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 국내출장정산신청 - 기간 조회 (TRP_FRM_DT~TRP_TO_DT)
   * 중분류:   소분류:   메뉴명: 국내출장정산신청  액터: 개발자
   * URL: /mis/gen/gen1220/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 국내출장정산신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_1220M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 국내출장정산신청 - 기간 조회 (TRP_FRM_DT~TRP_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 국내출장정산신청 - 기간 조회 (TRP_FRM_DT~TRP_TO_DT)");
    logInput('검색조건', "{\"TRP_FRM_DT\":\"2026-01-01\",\"TRP_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ TRP_FRM_DT: "2026-01-01", TRP_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1220M-no2.png`, fullPage: true });

    expect(rows.length, "국내출장정산신청 기간 조회 (TRP_FRM_DT~TRP_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 국내출장정산신청 - 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT)
   * 중분류:   소분류:   메뉴명: 국내출장정산신청  액터: 개발자
   * URL: /mis/gen/gen1220/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_1220M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 국내출장정산신청 - 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 국내출장정산신청 - 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT)");
    logInput('검색조건', "{\"TRP_FRM_DT\":\"2026-07-05\",\"TRP_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ TRP_FRM_DT: "2026-07-05", TRP_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1220M-no3.png`, fullPage: true });

    expect(rows.length, "국내출장정산신청 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 국내출장정산신청 - 키워드 검색 (EMP_NM)
   * 중분류:   소분류:   메뉴명: 국내출장정산신청  액터: 개발자
   * URL: /mis/gen/gen1220/getList.do
   * 예상결과: EMP_NM에 '테스트'가 포함된 국내출장정산신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_1220M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 국내출장정산신청 - 키워드 검색 (EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 국내출장정산신청 - 키워드 검색 (EMP_NM)");
    logInput("EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1220M-no4.png`, fullPage: true });

    expect(rows.length, "국내출장정산신청 키워드 검색 (EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1221M — 국내출장정산신청  |  API: POST /mis/gen/opinet/getAvgAllPriceList.do  |  TC 1건  |  ds:ds_result
// TODO(menuId): gen_1221M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/opinet/getAvgAllPriceList.do';
  const PGM_ID            = 'gen_1221M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_result';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국내출장정산신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국내출장정산신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국내출장정산신청  액터: 개발자
   * URL: /mis/gen/opinet/getAvgAllPriceList.do
   * 예상결과: 국내출장정산신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1221M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국내출장정산신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국내출장정산신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1221M-no1.png`, fullPage: true });

    expect(rows.length, "국내출장정산신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1222M — 국내출장정산신청  |  API: POST /mis/gen/opinet/getAvgAllPriceList.do  |  TC 1건  |  ds:ds_result
// TODO(menuId): gen_1222M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/opinet/getAvgAllPriceList.do';
  const PGM_ID            = 'gen_1222M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_result';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국내출장정산신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국내출장정산신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국내출장정산신청  액터: 개발자
   * URL: /mis/gen/opinet/getAvgAllPriceList.do
   * 예상결과: 국내출장정산신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1222M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국내출장정산신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국내출장정산신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1222M-no1.png`, fullPage: true });

    expect(rows.length, "국내출장정산신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1330M — 외부강의신고서목록  |  API: POST /mis/gen/gen1330/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_1330M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1330/getList.do';
  const PGM_ID            = 'gen_1330M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_APV_STAT_CD', 'SCH_RQST_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`외부강의신고서목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 외부강의신고서목록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 외부강의신고서목록  액터: 개발자
   * URL: /mis/gen/gen1330/getList.do
   * 예상결과: 외부강의신고서목록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1330M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 외부강의신고서목록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 외부강의신고서목록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1330M-no1.png`, fullPage: true });

    expect(rows.length, "외부강의신고서목록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 외부강의신고서목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 외부강의신고서목록  액터: 개발자
   * URL: /mis/gen/gen1330/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 외부강의신고서목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_1330M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 외부강의신고서목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 외부강의신고서목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1330M-no2.png`, fullPage: true });

    expect(rows.length, "외부강의신고서목록 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 외부강의신고서목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 외부강의신고서목록  액터: 개발자
   * URL: /mis/gen/gen1330/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_1330M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 외부강의신고서목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 외부강의신고서목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1330M-no3.png`, fullPage: true });

    expect(rows.length, "외부강의신고서목록 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 외부강의신고서목록 - 키워드 검색 (SCH_DEPT_NM)
   * 중분류:   소분류:   메뉴명: 외부강의신고서목록  액터: 개발자
   * URL: /mis/gen/gen1330/getList.do
   * 예상결과: SCH_DEPT_NM에 '테스트'가 포함된 외부강의신고서목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_1330M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 외부강의신고서목록 - 키워드 검색 (SCH_DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 외부강의신고서목록 - 키워드 검색 (SCH_DEPT_NM)");
    logInput("SCH_DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1330M-no4.png`, fullPage: true });

    expect(rows.length, "외부강의신고서목록 키워드 검색 (SCH_DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1331M — 외부강의신고서  |  API: POST /mis/gen/gen1331/getData.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_1331M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1331/getData.do';
  const PGM_ID            = 'gen_1331M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`외부강의신고서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 외부강의신고서 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 외부강의신고서  액터: 개발자
   * URL: /mis/gen/gen1331/getData.do
   * 예상결과: 외부강의신고서 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1331M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 외부강의신고서 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 외부강의신고서 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1331M-no1.png`, fullPage: true });

    expect(rows.length, "외부강의신고서 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1510M — 국외출장신청  |  API: POST /mis/gen/gen1510/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_1510M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1510/getList.do';
  const PGM_ID            = 'gen_1510M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_TRP_FRM_DT', 'SCH_TRP_TO_DT', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_APV_STAT_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국외출장신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국외출장신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국외출장신청  액터: 개발자
   * URL: /mis/gen/gen1510/getList.do
   * 예상결과: 국외출장신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1510M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국외출장신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국외출장신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1510M-no1.png`, fullPage: true });

    expect(rows.length, "국외출장신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 국외출장신청 - 기간 조회 (SCH_TRP_FRM_DT~SCH_TRP_TO_DT)
   * 중분류:   소분류:   메뉴명: 국외출장신청  액터: 개발자
   * URL: /mis/gen/gen1510/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 국외출장신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_1510M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 국외출장신청 - 기간 조회 (SCH_TRP_FRM_DT~SCH_TRP_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 국외출장신청 - 기간 조회 (SCH_TRP_FRM_DT~SCH_TRP_TO_DT)");
    logInput('검색조건', "{\"SCH_TRP_FRM_DT\":\"2026-01-01\",\"SCH_TRP_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_TRP_FRM_DT: "2026-01-01", SCH_TRP_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1510M-no2.png`, fullPage: true });

    expect(rows.length, "국외출장신청 기간 조회 (SCH_TRP_FRM_DT~SCH_TRP_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 국외출장신청 - 역방향 기간 조회 (0건 확인, SCH_TRP_FRM_DT>SCH_TRP_TO_DT)
   * 중분류:   소분류:   메뉴명: 국외출장신청  액터: 개발자
   * URL: /mis/gen/gen1510/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_1510M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 국외출장신청 - 역방향 기간 조회 (0건 확인, SCH_TRP_FRM_DT>SCH_TRP_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 국외출장신청 - 역방향 기간 조회 (0건 확인, SCH_TRP_FRM_DT>SCH_TRP_TO_DT)");
    logInput('검색조건', "{\"SCH_TRP_FRM_DT\":\"2026-07-05\",\"SCH_TRP_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_TRP_FRM_DT: "2026-07-05", SCH_TRP_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1510M-no3.png`, fullPage: true });

    expect(rows.length, "국외출장신청 역방향 기간 조회 (0건 확인, SCH_TRP_FRM_DT>SCH_TRP_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 국외출장신청 - 키워드 검색 (SCH_EMP_NM)
   * 중분류:   소분류:   메뉴명: 국외출장신청  액터: 개발자
   * URL: /mis/gen/gen1510/getList.do
   * 예상결과: SCH_EMP_NM에 '테스트'가 포함된 국외출장신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_1510M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 국외출장신청 - 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 국외출장신청 - 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1510M-no4.png`, fullPage: true });

    expect(rows.length, "국외출장신청 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1511M — 국외출장신청  |  API: POST /mis/gen/gen1511/getDtmn.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_1511M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1511/getDtmn.do';
  const PGM_ID            = 'gen_1511M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국외출장신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국외출장신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국외출장신청  액터: 개발자
   * URL: /mis/gen/gen1511/getDtmn.do
   * 예상결과: 국외출장신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1511M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국외출장신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국외출장신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1511M-no1.png`, fullPage: true });

    expect(rows.length, "국외출장신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1520M — 국외출장정산신청  |  API: POST /mis/gen/gen1520/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_1520M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1520/getList.do';
  const PGM_ID            = 'gen_1520M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_TRP_FRM_DT', 'SCH_TRP_TO_DT', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_APV_STAT_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국외출장정산신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국외출장정산신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국외출장정산신청  액터: 개발자
   * URL: /mis/gen/gen1520/getList.do
   * 예상결과: 국외출장정산신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1520M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국외출장정산신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국외출장정산신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1520M-no1.png`, fullPage: true });

    expect(rows.length, "국외출장정산신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 국외출장정산신청 - 기간 조회 (SCH_TRP_FRM_DT~SCH_TRP_TO_DT)
   * 중분류:   소분류:   메뉴명: 국외출장정산신청  액터: 개발자
   * URL: /mis/gen/gen1520/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 국외출장정산신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_1520M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 국외출장정산신청 - 기간 조회 (SCH_TRP_FRM_DT~SCH_TRP_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 국외출장정산신청 - 기간 조회 (SCH_TRP_FRM_DT~SCH_TRP_TO_DT)");
    logInput('검색조건', "{\"SCH_TRP_FRM_DT\":\"2026-01-01\",\"SCH_TRP_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_TRP_FRM_DT: "2026-01-01", SCH_TRP_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1520M-no2.png`, fullPage: true });

    expect(rows.length, "국외출장정산신청 기간 조회 (SCH_TRP_FRM_DT~SCH_TRP_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 국외출장정산신청 - 역방향 기간 조회 (0건 확인, SCH_TRP_FRM_DT>SCH_TRP_TO_DT)
   * 중분류:   소분류:   메뉴명: 국외출장정산신청  액터: 개발자
   * URL: /mis/gen/gen1520/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_1520M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 국외출장정산신청 - 역방향 기간 조회 (0건 확인, SCH_TRP_FRM_DT>SCH_TRP_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 국외출장정산신청 - 역방향 기간 조회 (0건 확인, SCH_TRP_FRM_DT>SCH_TRP_TO_DT)");
    logInput('검색조건', "{\"SCH_TRP_FRM_DT\":\"2026-07-05\",\"SCH_TRP_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_TRP_FRM_DT: "2026-07-05", SCH_TRP_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1520M-no3.png`, fullPage: true });

    expect(rows.length, "국외출장정산신청 역방향 기간 조회 (0건 확인, SCH_TRP_FRM_DT>SCH_TRP_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 국외출장정산신청 - 키워드 검색 (SCH_EMP_NM)
   * 중분류:   소분류:   메뉴명: 국외출장정산신청  액터: 개발자
   * URL: /mis/gen/gen1520/getList.do
   * 예상결과: SCH_EMP_NM에 '테스트'가 포함된 국외출장정산신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_1520M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 국외출장정산신청 - 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 국외출장정산신청 - 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1520M-no4.png`, fullPage: true });

    expect(rows.length, "국외출장정산신청 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1521M — 국외출장정산신청  |  API: POST /mis/gen/gen1521/getDtmn.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_1521M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1521/getDtmn.do';
  const PGM_ID            = 'gen_1521M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국외출장정산신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국외출장정산신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국외출장정산신청  액터: 개발자
   * URL: /mis/gen/gen1521/getDtmn.do
   * 예상결과: 국외출장정산신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1521M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국외출장정산신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국외출장정산신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1521M-no1.png`, fullPage: true });

    expect(rows.length, "국외출장정산신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1540M — 국내출장현황  |  API: POST /mis/gen/gen1540/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_1540M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1540/getList.do';
  const PGM_ID            = 'gen_1540M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['TRP_FRM_DT', 'TRP_TO_DT', 'TRP_TP_CD', 'TRP_CLS_CD', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'APV_STAT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국내출장현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국내출장현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국내출장현황  액터: 개발자
   * URL: /mis/gen/gen1540/getList.do
   * 예상결과: 국내출장현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1540M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국내출장현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국내출장현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1540M-no1.png`, fullPage: true });

    expect(rows.length, "국내출장현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 국내출장현황 - 기간 조회 (TRP_FRM_DT~TRP_TO_DT)
   * 중분류:   소분류:   메뉴명: 국내출장현황  액터: 개발자
   * URL: /mis/gen/gen1540/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 국내출장현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_1540M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 국내출장현황 - 기간 조회 (TRP_FRM_DT~TRP_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 국내출장현황 - 기간 조회 (TRP_FRM_DT~TRP_TO_DT)");
    logInput('검색조건', "{\"TRP_FRM_DT\":\"2026-01-01\",\"TRP_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ TRP_FRM_DT: "2026-01-01", TRP_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1540M-no2.png`, fullPage: true });

    expect(rows.length, "국내출장현황 기간 조회 (TRP_FRM_DT~TRP_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 국내출장현황 - 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT)
   * 중분류:   소분류:   메뉴명: 국내출장현황  액터: 개발자
   * URL: /mis/gen/gen1540/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_1540M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 국내출장현황 - 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 국내출장현황 - 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT)");
    logInput('검색조건', "{\"TRP_FRM_DT\":\"2026-07-05\",\"TRP_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ TRP_FRM_DT: "2026-07-05", TRP_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1540M-no3.png`, fullPage: true });

    expect(rows.length, "국내출장현황 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 국내출장현황 - 키워드 검색 (EMP_NM)
   * 중분류:   소분류:   메뉴명: 국내출장현황  액터: 개발자
   * URL: /mis/gen/gen1540/getList.do
   * 예상결과: EMP_NM에 '테스트'가 포함된 국내출장현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_1540M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 국내출장현황 - 키워드 검색 (EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 국내출장현황 - 키워드 검색 (EMP_NM)");
    logInput("EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1540M-no4.png`, fullPage: true });

    expect(rows.length, "국내출장현황 키워드 검색 (EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1550M — 국외출장현황  |  API: POST /mis/gen/gen1550/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_1550M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1550/getList.do';
  const PGM_ID            = 'gen_1550M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['TRP_FRM_DT', 'TRP_TO_DT', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'APV_STAT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`국외출장현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국외출장현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 국외출장현황  액터: 개발자
   * URL: /mis/gen/gen1550/getList.do
   * 예상결과: 국외출장현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1550M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 국외출장현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국외출장현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1550M-no1.png`, fullPage: true });

    expect(rows.length, "국외출장현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 국외출장현황 - 기간 조회 (TRP_FRM_DT~TRP_TO_DT)
   * 중분류:   소분류:   메뉴명: 국외출장현황  액터: 개발자
   * URL: /mis/gen/gen1550/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 국외출장현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_1550M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 국외출장현황 - 기간 조회 (TRP_FRM_DT~TRP_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 국외출장현황 - 기간 조회 (TRP_FRM_DT~TRP_TO_DT)");
    logInput('검색조건', "{\"TRP_FRM_DT\":\"2026-01-01\",\"TRP_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ TRP_FRM_DT: "2026-01-01", TRP_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1550M-no2.png`, fullPage: true });

    expect(rows.length, "국외출장현황 기간 조회 (TRP_FRM_DT~TRP_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 국외출장현황 - 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT)
   * 중분류:   소분류:   메뉴명: 국외출장현황  액터: 개발자
   * URL: /mis/gen/gen1550/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_1550M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 국외출장현황 - 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 국외출장현황 - 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT)");
    logInput('검색조건', "{\"TRP_FRM_DT\":\"2026-07-05\",\"TRP_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ TRP_FRM_DT: "2026-07-05", TRP_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1550M-no3.png`, fullPage: true });

    expect(rows.length, "국외출장현황 역방향 기간 조회 (0건 확인, TRP_FRM_DT>TRP_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 국외출장현황 - 키워드 검색 (EMP_NM)
   * 중분류:   소분류:   메뉴명: 국외출장현황  액터: 개발자
   * URL: /mis/gen/gen1550/getList.do
   * 예상결과: EMP_NM에 '테스트'가 포함된 국외출장현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_1550M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 국외출장현황 - 키워드 검색 (EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 국외출장현황 - 키워드 검색 (EMP_NM)");
    logInput("EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1550M-no4.png`, fullPage: true });

    expect(rows.length, "국외출장현황 키워드 검색 (EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_1610M — 항공마일리지관리  |  API: POST /mis/gen/gen1610/getList.do  |  TC 2건  |  ds:ds_dtlList
// TODO(menuId): gen_1610M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen1610/getList.do';
  const PGM_ID            = 'gen_1610M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_dtlList';
  const DS_SEARCH_COLUMNS = ['EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'HLDF_FG_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`항공마일리지관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 항공마일리지관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 항공마일리지관리  액터: 개발자
   * URL: /mis/gen/gen1610/getList.do
   * 예상결과: 항공마일리지관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_1610M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 항공마일리지관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 항공마일리지관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1610M-no1.png`, fullPage: true });

    expect(rows.length, "항공마일리지관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 항공마일리지관리 - 키워드 검색 (EMP_NM)
   * 중분류:   소분류:   메뉴명: 항공마일리지관리  액터: 개발자
   * URL: /mis/gen/gen1610/getList.do
   * 예상결과: EMP_NM에 '테스트'가 포함된 항공마일리지관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_1610M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 항공마일리지관리 - 키워드 검색 (EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 항공마일리지관리 - 키워드 검색 (EMP_NM)");
    logInput("EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_1610M-no2.png`, fullPage: true });

    expect(rows.length, "항공마일리지관리 키워드 검색 (EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_2010M — 관내출장현황  |  API: POST /mis/gen/gen2010/getData.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_2010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen2010/getData.do';
  const PGM_ID            = 'gen_2010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['RQST_FRM_DT', 'RQST_TO_DT', 'TRP_FRM_DT', 'TRP_TO_DT', 'DEPT_CD', 'DEPT_NM', 'EMP_NO', 'EMP_NM', 'RQST_FG', 'APV_STAT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`관내출장현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 관내출장현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 관내출장현황  액터: 개발자
   * URL: /mis/gen/gen2010/getData.do
   * 예상결과: 관내출장현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_2010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 관내출장현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 관내출장현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_2010M-no1.png`, fullPage: true });

    expect(rows.length, "관내출장현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 관내출장현황 - 기간 조회 (RQST_FRM_DT~RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 관내출장현황  액터: 개발자
   * URL: /mis/gen/gen2010/getData.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 관내출장현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_2010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 관내출장현황 - 기간 조회 (RQST_FRM_DT~RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 관내출장현황 - 기간 조회 (RQST_FRM_DT~RQST_TO_DT)");
    logInput('검색조건', "{\"RQST_FRM_DT\":\"2026-01-01\",\"RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ RQST_FRM_DT: "2026-01-01", RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_2010M-no2.png`, fullPage: true });

    expect(rows.length, "관내출장현황 기간 조회 (RQST_FRM_DT~RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 관내출장현황 - 역방향 기간 조회 (0건 확인, RQST_FRM_DT>RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 관내출장현황  액터: 개발자
   * URL: /mis/gen/gen2010/getData.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_2010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 관내출장현황 - 역방향 기간 조회 (0건 확인, RQST_FRM_DT>RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 관내출장현황 - 역방향 기간 조회 (0건 확인, RQST_FRM_DT>RQST_TO_DT)");
    logInput('검색조건', "{\"RQST_FRM_DT\":\"2026-07-05\",\"RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ RQST_FRM_DT: "2026-07-05", RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_2010M-no3.png`, fullPage: true });

    expect(rows.length, "관내출장현황 역방향 기간 조회 (0건 확인, RQST_FRM_DT>RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 관내출장현황 - 키워드 검색 (DEPT_NM)
   * 중분류:   소분류:   메뉴명: 관내출장현황  액터: 개발자
   * URL: /mis/gen/gen2010/getData.do
   * 예상결과: DEPT_NM에 '테스트'가 포함된 관내출장현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_2010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 관내출장현황 - 키워드 검색 (DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 관내출장현황 - 키워드 검색 (DEPT_NM)");
    logInput("DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_2010M-no4.png`, fullPage: true });

    expect(rows.length, "관내출장현황 키워드 검색 (DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_2020M — 관외출장현황  |  API: POST /mis/gen/gen2020/getData.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_2020M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen2020/getData.do';
  const PGM_ID            = 'gen_2020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['RQST_FRM_DT', 'RQST_TO_DT', 'TRP_FRM_DT', 'TRP_TO_DT', 'DEPT_CD', 'DEPT_NM', 'EMP_NO', 'EMP_NM', 'RQST_FG', 'APV_STAT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`관외출장현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 관외출장현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 관외출장현황  액터: 개발자
   * URL: /mis/gen/gen2020/getData.do
   * 예상결과: 관외출장현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_2020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 관외출장현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 관외출장현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_2020M-no1.png`, fullPage: true });

    expect(rows.length, "관외출장현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 관외출장현황 - 기간 조회 (RQST_FRM_DT~RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 관외출장현황  액터: 개발자
   * URL: /mis/gen/gen2020/getData.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 관외출장현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_2020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 관외출장현황 - 기간 조회 (RQST_FRM_DT~RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 관외출장현황 - 기간 조회 (RQST_FRM_DT~RQST_TO_DT)");
    logInput('검색조건', "{\"RQST_FRM_DT\":\"2026-01-01\",\"RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ RQST_FRM_DT: "2026-01-01", RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_2020M-no2.png`, fullPage: true });

    expect(rows.length, "관외출장현황 기간 조회 (RQST_FRM_DT~RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 관외출장현황 - 역방향 기간 조회 (0건 확인, RQST_FRM_DT>RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 관외출장현황  액터: 개발자
   * URL: /mis/gen/gen2020/getData.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_2020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 관외출장현황 - 역방향 기간 조회 (0건 확인, RQST_FRM_DT>RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 관외출장현황 - 역방향 기간 조회 (0건 확인, RQST_FRM_DT>RQST_TO_DT)");
    logInput('검색조건', "{\"RQST_FRM_DT\":\"2026-07-05\",\"RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ RQST_FRM_DT: "2026-07-05", RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_2020M-no3.png`, fullPage: true });

    expect(rows.length, "관외출장현황 역방향 기간 조회 (0건 확인, RQST_FRM_DT>RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 관외출장현황 - 키워드 검색 (DEPT_NM)
   * 중분류:   소분류:   메뉴명: 관외출장현황  액터: 개발자
   * URL: /mis/gen/gen2020/getData.do
   * 예상결과: DEPT_NM에 '테스트'가 포함된 관외출장현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_2020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 관외출장현황 - 키워드 검색 (DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 관외출장현황 - 키워드 검색 (DEPT_NM)");
    logInput("DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_2020M-no4.png`, fullPage: true });

    expect(rows.length, "관외출장현황 키워드 검색 (DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_2040M — 마일리지 개인별집계현황  |  API: POST /mis/hrm/hrm4160007/getList.do  |  TC 2건  |  ds:ds_list
// TODO(menuId): gen_2040M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/hrm/hrm4160007/getList.do';
  const PGM_ID            = 'gen_2040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['AIR_LINE', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`마일리지 개인별집계현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 마일리지 개인별집계현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 마일리지 개인별집계현황  액터: 개발자
   * URL: /mis/hrm/hrm4160007/getList.do
   * 예상결과: 마일리지 개인별집계현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_2040M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 마일리지 개인별집계현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 마일리지 개인별집계현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_2040M-no1.png`, fullPage: true });

    expect(rows.length, "마일리지 개인별집계현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 마일리지 개인별집계현황 - 키워드 검색 (EMP_NM)
   * 중분류:   소분류:   메뉴명: 마일리지 개인별집계현황  액터: 개발자
   * URL: /mis/hrm/hrm4160007/getList.do
   * 예상결과: EMP_NM에 '테스트'가 포함된 마일리지 개인별집계현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_2040M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 마일리지 개인별집계현황 - 키워드 검색 (EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 마일리지 개인별집계현황 - 키워드 검색 (EMP_NM)");
    logInput("EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_2040M-no2.png`, fullPage: true });

    expect(rows.length, "마일리지 개인별집계현황 키워드 검색 (EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_3010M — 부재자현황  |  API: POST /mis/gen/gen3010/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_3010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen3010/getList.do';
  const PGM_ID            = 'gen_3010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['ABST_FRM_DT', 'ABST_TO_DT', 'EMP_RID', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'ABST_FG', 'ABST_DTL_FG', 'DT_SCH_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부재자현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부재자현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 부재자현황  액터: 개발자
   * URL: /mis/gen/gen3010/getList.do
   * 예상결과: 부재자현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_3010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 부재자현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 부재자현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_3010M-no1.png`, fullPage: true });

    expect(rows.length, "부재자현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 부재자현황 - 기간 조회 (ABST_FRM_DT~ABST_TO_DT)
   * 중분류:   소분류:   메뉴명: 부재자현황  액터: 개발자
   * URL: /mis/gen/gen3010/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 부재자현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_3010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 부재자현황 - 기간 조회 (ABST_FRM_DT~ABST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 부재자현황 - 기간 조회 (ABST_FRM_DT~ABST_TO_DT)");
    logInput('검색조건', "{\"ABST_FRM_DT\":\"2026-01-01\",\"ABST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ ABST_FRM_DT: "2026-01-01", ABST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_3010M-no2.png`, fullPage: true });

    expect(rows.length, "부재자현황 기간 조회 (ABST_FRM_DT~ABST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 부재자현황 - 역방향 기간 조회 (0건 확인, ABST_FRM_DT>ABST_TO_DT)
   * 중분류:   소분류:   메뉴명: 부재자현황  액터: 개발자
   * URL: /mis/gen/gen3010/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_3010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 부재자현황 - 역방향 기간 조회 (0건 확인, ABST_FRM_DT>ABST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 부재자현황 - 역방향 기간 조회 (0건 확인, ABST_FRM_DT>ABST_TO_DT)");
    logInput('검색조건', "{\"ABST_FRM_DT\":\"2026-07-05\",\"ABST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ ABST_FRM_DT: "2026-07-05", ABST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_3010M-no3.png`, fullPage: true });

    expect(rows.length, "부재자현황 역방향 기간 조회 (0건 확인, ABST_FRM_DT>ABST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 부재자현황 - 키워드 검색 (EMP_NM)
   * 중분류:   소분류:   메뉴명: 부재자현황  액터: 개발자
   * URL: /mis/gen/gen3010/getList.do
   * 예상결과: EMP_NM에 '테스트'가 포함된 부재자현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_3010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 부재자현황 - 키워드 검색 (EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 부재자현황 - 키워드 검색 (EMP_NM)");
    logInput("EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_3010M-no4.png`, fullPage: true });

    expect(rows.length, "부재자현황 키워드 검색 (EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_4010M — 시간제근무자관리  |  API: POST /mis/gen/gen4010/getList01.do  |  TC 4건  |  ds:ds_list01
// TODO(menuId): gen_4010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen4010/getList01.do';
  const PGM_ID            = 'gen_4010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list01';
  const DS_SEARCH_COLUMNS = ['SCH_WORK_TIME_FRM_DT', 'SCH_WORK_TIME_TO_DT', 'SCH_EMP_RID', 'SCH_EMP_NO', 'SCH_EMP_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`시간제근무자관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 시간제근무자관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 시간제근무자관리  액터: 개발자
   * URL: /mis/gen/gen4010/getList01.do
   * 예상결과: 시간제근무자관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_4010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 시간제근무자관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 시간제근무자관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_4010M-no1.png`, fullPage: true });

    expect(rows.length, "시간제근무자관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 시간제근무자관리 - 기간 조회 (SCH_WORK_TIME_FRM_DT~SCH_WORK_TIME_TO_DT)
   * 중분류:   소분류:   메뉴명: 시간제근무자관리  액터: 개발자
   * URL: /mis/gen/gen4010/getList01.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 시간제근무자관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_4010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 시간제근무자관리 - 기간 조회 (SCH_WORK_TIME_FRM_DT~SCH_WORK_TIME_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 시간제근무자관리 - 기간 조회 (SCH_WORK_TIME_FRM_DT~SCH_WORK_TIME_TO_DT)");
    logInput('검색조건', "{\"SCH_WORK_TIME_FRM_DT\":\"2026-01-01\",\"SCH_WORK_TIME_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_WORK_TIME_FRM_DT: "2026-01-01", SCH_WORK_TIME_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_4010M-no2.png`, fullPage: true });

    expect(rows.length, "시간제근무자관리 기간 조회 (SCH_WORK_TIME_FRM_DT~SCH_WORK_TIME_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 시간제근무자관리 - 역방향 기간 조회 (0건 확인, SCH_WORK_TIME_FRM_DT>SCH_WORK_TIME_TO_DT)
   * 중분류:   소분류:   메뉴명: 시간제근무자관리  액터: 개발자
   * URL: /mis/gen/gen4010/getList01.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_4010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 시간제근무자관리 - 역방향 기간 조회 (0건 확인, SCH_WORK_TIME_FRM_DT>SCH_WORK_TIME_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 시간제근무자관리 - 역방향 기간 조회 (0건 확인, SCH_WORK_TIME_FRM_DT>SCH_WORK_TIME_TO_DT)");
    logInput('검색조건', "{\"SCH_WORK_TIME_FRM_DT\":\"2026-07-05\",\"SCH_WORK_TIME_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_WORK_TIME_FRM_DT: "2026-07-05", SCH_WORK_TIME_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_4010M-no3.png`, fullPage: true });

    expect(rows.length, "시간제근무자관리 역방향 기간 조회 (0건 확인, SCH_WORK_TIME_FRM_DT>SCH_WORK_TIME_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 시간제근무자관리 - 키워드 검색 (SCH_EMP_NM)
   * 중분류:   소분류:   메뉴명: 시간제근무자관리  액터: 개발자
   * URL: /mis/gen/gen4010/getList01.do
   * 예상결과: SCH_EMP_NM에 '테스트'가 포함된 시간제근무자관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_4010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 시간제근무자관리 - 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 시간제근무자관리 - 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_4010M-no4.png`, fullPage: true });

    expect(rows.length, "시간제근무자관리 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5010M — 사회공헌활동등록  |  API: POST /mis/gen/gen5010/getSotyCnbMngList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_5010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5010/getSotyCnbMngList.do';
  const PGM_ID            = 'gen_5010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_SOTY_CNB_ACTV_CD', 'SCH_SOTY_CNB_ACTV_NM', 'SCH_ACTV_STAT_CD', 'SCH_ACTV_FRM_DT', 'SCH_ACTV_TO_DT', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사회공헌활동등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사회공헌활동등록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 사회공헌활동등록  액터: 개발자
   * URL: /mis/gen/gen5010/getSotyCnbMngList.do
   * 예상결과: 사회공헌활동등록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 사회공헌활동등록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 사회공헌활동등록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5010M-no1.png`, fullPage: true });

    expect(rows.length, "사회공헌활동등록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 사회공헌활동등록 - 기간 조회 (SCH_ACTV_FRM_DT~SCH_ACTV_TO_DT)
   * 중분류:   소분류:   메뉴명: 사회공헌활동등록  액터: 개발자
   * URL: /mis/gen/gen5010/getSotyCnbMngList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 사회공헌활동등록 목록이 조회된다.
   * DB 확인: -- TODO(gen_5010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 사회공헌활동등록 - 기간 조회 (SCH_ACTV_FRM_DT~SCH_ACTV_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 사회공헌활동등록 - 기간 조회 (SCH_ACTV_FRM_DT~SCH_ACTV_TO_DT)");
    logInput('검색조건', "{\"SCH_ACTV_FRM_DT\":\"2026-01-01\",\"SCH_ACTV_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_ACTV_FRM_DT: "2026-01-01", SCH_ACTV_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5010M-no2.png`, fullPage: true });

    expect(rows.length, "사회공헌활동등록 기간 조회 (SCH_ACTV_FRM_DT~SCH_ACTV_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 사회공헌활동등록 - 역방향 기간 조회 (0건 확인, SCH_ACTV_FRM_DT>SCH_ACTV_TO_DT)
   * 중분류:   소분류:   메뉴명: 사회공헌활동등록  액터: 개발자
   * URL: /mis/gen/gen5010/getSotyCnbMngList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_5010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 사회공헌활동등록 - 역방향 기간 조회 (0건 확인, SCH_ACTV_FRM_DT>SCH_ACTV_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 사회공헌활동등록 - 역방향 기간 조회 (0건 확인, SCH_ACTV_FRM_DT>SCH_ACTV_TO_DT)");
    logInput('검색조건', "{\"SCH_ACTV_FRM_DT\":\"2026-07-05\",\"SCH_ACTV_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_ACTV_FRM_DT: "2026-07-05", SCH_ACTV_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5010M-no3.png`, fullPage: true });

    expect(rows.length, "사회공헌활동등록 역방향 기간 조회 (0건 확인, SCH_ACTV_FRM_DT>SCH_ACTV_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 사회공헌활동등록 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)
   * 중분류:   소분류:   메뉴명: 사회공헌활동등록  액터: 개발자
   * URL: /mis/gen/gen5010/getSotyCnbMngList.do
   * 예상결과: SCH_SOTY_CNB_ACTV_NM에 '테스트'가 포함된 사회공헌활동등록 목록이 조회된다.
   * DB 확인: -- TODO(gen_5010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 사회공헌활동등록 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 사회공헌활동등록 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)");
    logInput("SCH_SOTY_CNB_ACTV_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SOTY_CNB_ACTV_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5010M-no4.png`, fullPage: true });

    expect(rows.length, "사회공헌활동등록 키워드 검색 (SCH_SOTY_CNB_ACTV_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5011M — 사회공헌등록 상세  |  API: POST /mis/gen/gen5011/getSotyCnbData.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_5011M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5011/getSotyCnbData.do';
  const PGM_ID            = 'gen_5011M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사회공헌등록 상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사회공헌등록 상세 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 사회공헌등록 상세  액터: 개발자
   * URL: /mis/gen/gen5011/getSotyCnbData.do
   * 예상결과: 사회공헌등록 상세 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5011M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 사회공헌등록 상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 사회공헌등록 상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5011M-no1.png`, fullPage: true });

    expect(rows.length, "사회공헌등록 상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5020M — 사회공헌활동신청목록  |  API: POST /mis/gen/gen5020/getSotyCnbRqstList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_5020M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5020/getSotyCnbRqstList.do';
  const PGM_ID            = 'gen_5020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_SOTY_CNB_ACTV_CD', 'SCH_SOTY_CNB_ACTV_NM', 'SCH_ACTV_STAT_CD', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NM', 'SCH_APNT_EMP_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사회공헌활동신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사회공헌활동신청목록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 사회공헌활동신청목록  액터: 개발자
   * URL: /mis/gen/gen5020/getSotyCnbRqstList.do
   * 예상결과: 사회공헌활동신청목록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 사회공헌활동신청목록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 사회공헌활동신청목록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5020M-no1.png`, fullPage: true });

    expect(rows.length, "사회공헌활동신청목록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 사회공헌활동신청목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 사회공헌활동신청목록  액터: 개발자
   * URL: /mis/gen/gen5020/getSotyCnbRqstList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 사회공헌활동신청목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_5020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 사회공헌활동신청목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 사회공헌활동신청목록 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5020M-no2.png`, fullPage: true });

    expect(rows.length, "사회공헌활동신청목록 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 사회공헌활동신청목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 사회공헌활동신청목록  액터: 개발자
   * URL: /mis/gen/gen5020/getSotyCnbRqstList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_5020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 사회공헌활동신청목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 사회공헌활동신청목록 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5020M-no3.png`, fullPage: true });

    expect(rows.length, "사회공헌활동신청목록 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 사회공헌활동신청목록 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)
   * 중분류:   소분류:   메뉴명: 사회공헌활동신청목록  액터: 개발자
   * URL: /mis/gen/gen5020/getSotyCnbRqstList.do
   * 예상결과: SCH_SOTY_CNB_ACTV_NM에 '테스트'가 포함된 사회공헌활동신청목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_5020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 사회공헌활동신청목록 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 사회공헌활동신청목록 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)");
    logInput("SCH_SOTY_CNB_ACTV_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SOTY_CNB_ACTV_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5020M-no4.png`, fullPage: true });

    expect(rows.length, "사회공헌활동신청목록 키워드 검색 (SCH_SOTY_CNB_ACTV_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5021M — 사회공헌활동신청상세  |  API: POST /mis/gen/gen5021/getSotyCnbRqstData.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_5021M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5021/getSotyCnbRqstData.do';
  const PGM_ID            = 'gen_5021M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사회공헌활동신청상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사회공헌활동신청상세 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 사회공헌활동신청상세  액터: 개발자
   * URL: /mis/gen/gen5021/getSotyCnbRqstData.do
   * 예상결과: 사회공헌활동신청상세 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5021M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 사회공헌활동신청상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 사회공헌활동신청상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5021M-no1.png`, fullPage: true });

    expect(rows.length, "사회공헌활동신청상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5030M — 사회공헌활동현황  |  API: POST /mis/gen/gen5030/getSotyCnbList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_5030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5030/getSotyCnbList.do';
  const PGM_ID            = 'gen_5030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_SOTY_CNB_ACTV_CD', 'SCH_SOTY_CNB_ACTV_NM', 'SCH_ACTV_STAT_CD', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NM', 'SCH_APNT_EMP_NO', 'SCH_ACTV_FRM_DT', 'SCH_ACTV_TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사회공헌활동현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사회공헌활동현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 사회공헌활동현황  액터: 개발자
   * URL: /mis/gen/gen5030/getSotyCnbList.do
   * 예상결과: 사회공헌활동현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5030M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 사회공헌활동현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 사회공헌활동현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5030M-no1.png`, fullPage: true });

    expect(rows.length, "사회공헌활동현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 사회공헌활동현황 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 사회공헌활동현황  액터: 개발자
   * URL: /mis/gen/gen5030/getSotyCnbList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 사회공헌활동현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_5030M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 사회공헌활동현황 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 사회공헌활동현황 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5030M-no2.png`, fullPage: true });

    expect(rows.length, "사회공헌활동현황 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 사회공헌활동현황 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 사회공헌활동현황  액터: 개발자
   * URL: /mis/gen/gen5030/getSotyCnbList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_5030M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 사회공헌활동현황 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 사회공헌활동현황 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5030M-no3.png`, fullPage: true });

    expect(rows.length, "사회공헌활동현황 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 사회공헌활동현황 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)
   * 중분류:   소분류:   메뉴명: 사회공헌활동현황  액터: 개발자
   * URL: /mis/gen/gen5030/getSotyCnbList.do
   * 예상결과: SCH_SOTY_CNB_ACTV_NM에 '테스트'가 포함된 사회공헌활동현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_5030M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 사회공헌활동현황 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 사회공헌활동현황 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)");
    logInput("SCH_SOTY_CNB_ACTV_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SOTY_CNB_ACTV_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5030M-no4.png`, fullPage: true });

    expect(rows.length, "사회공헌활동현황 키워드 검색 (SCH_SOTY_CNB_ACTV_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5040M — 사회공헌활동상세현황  |  API: POST /mis/gen/gen5040/getSotyCnbDtlList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_5040M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5040/getSotyCnbDtlList.do';
  const PGM_ID            = 'gen_5040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_SOTY_CNB_ACTV_CD', 'SCH_SOTY_CNB_ACTV_NM', 'SCH_ACTV_STAT_CD', 'SCH_REAL_ACTV_FRM_DT', 'SCH_REAL_ACTV_TO_DT', 'SCH_APNT_EMP_NM', 'SCH_APNT_EMP_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사회공헌활동상세현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사회공헌활동상세현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 사회공헌활동상세현황  액터: 개발자
   * URL: /mis/gen/gen5040/getSotyCnbDtlList.do
   * 예상결과: 사회공헌활동상세현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5040M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 사회공헌활동상세현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 사회공헌활동상세현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5040M-no1.png`, fullPage: true });

    expect(rows.length, "사회공헌활동상세현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 사회공헌활동상세현황 - 기간 조회 (SCH_REAL_ACTV_FRM_DT~SCH_REAL_ACTV_TO_DT)
   * 중분류:   소분류:   메뉴명: 사회공헌활동상세현황  액터: 개발자
   * URL: /mis/gen/gen5040/getSotyCnbDtlList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 사회공헌활동상세현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_5040M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 사회공헌활동상세현황 - 기간 조회 (SCH_REAL_ACTV_FRM_DT~SCH_REAL_ACTV_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 사회공헌활동상세현황 - 기간 조회 (SCH_REAL_ACTV_FRM_DT~SCH_REAL_ACTV_TO_DT)");
    logInput('검색조건', "{\"SCH_REAL_ACTV_FRM_DT\":\"2026-01-01\",\"SCH_REAL_ACTV_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_REAL_ACTV_FRM_DT: "2026-01-01", SCH_REAL_ACTV_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5040M-no2.png`, fullPage: true });

    expect(rows.length, "사회공헌활동상세현황 기간 조회 (SCH_REAL_ACTV_FRM_DT~SCH_REAL_ACTV_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 사회공헌활동상세현황 - 역방향 기간 조회 (0건 확인, SCH_REAL_ACTV_FRM_DT>SCH_REAL_ACTV_TO_DT)
   * 중분류:   소분류:   메뉴명: 사회공헌활동상세현황  액터: 개발자
   * URL: /mis/gen/gen5040/getSotyCnbDtlList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_5040M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 사회공헌활동상세현황 - 역방향 기간 조회 (0건 확인, SCH_REAL_ACTV_FRM_DT>SCH_REAL_ACTV_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 사회공헌활동상세현황 - 역방향 기간 조회 (0건 확인, SCH_REAL_ACTV_FRM_DT>SCH_REAL_ACTV_TO_DT)");
    logInput('검색조건', "{\"SCH_REAL_ACTV_FRM_DT\":\"2026-07-05\",\"SCH_REAL_ACTV_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_REAL_ACTV_FRM_DT: "2026-07-05", SCH_REAL_ACTV_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5040M-no3.png`, fullPage: true });

    expect(rows.length, "사회공헌활동상세현황 역방향 기간 조회 (0건 확인, SCH_REAL_ACTV_FRM_DT>SCH_REAL_ACTV_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 사회공헌활동상세현황 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)
   * 중분류:   소분류:   메뉴명: 사회공헌활동상세현황  액터: 개발자
   * URL: /mis/gen/gen5040/getSotyCnbDtlList.do
   * 예상결과: SCH_SOTY_CNB_ACTV_NM에 '테스트'가 포함된 사회공헌활동상세현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_5040M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 사회공헌활동상세현황 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 사회공헌활동상세현황 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)");
    logInput("SCH_SOTY_CNB_ACTV_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SOTY_CNB_ACTV_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5040M-no4.png`, fullPage: true });

    expect(rows.length, "사회공헌활동상세현황 키워드 검색 (SCH_SOTY_CNB_ACTV_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5050M — 사회공헌활동관리  |  API: POST /mis/gen/gen5050/getSotyCnbRqstTimeList.do  |  TC 2건  |  ds:ds_list01
// TODO(menuId): gen_5050M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5050/getSotyCnbRqstTimeList.do';
  const PGM_ID            = 'gen_5050M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list01';
  const DS_SEARCH_COLUMNS = ['SCH_SOTY_CNB_MNG_NO', 'SCH_SOTY_CNB_ACTV_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사회공헌활동관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사회공헌활동관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 사회공헌활동관리  액터: 개발자
   * URL: /mis/gen/gen5050/getSotyCnbRqstTimeList.do
   * 예상결과: 사회공헌활동관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5050M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 사회공헌활동관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 사회공헌활동관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5050M-no1.png`, fullPage: true });

    expect(rows.length, "사회공헌활동관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 사회공헌활동관리 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)
   * 중분류:   소분류:   메뉴명: 사회공헌활동관리  액터: 개발자
   * URL: /mis/gen/gen5050/getSotyCnbRqstTimeList.do
   * 예상결과: SCH_SOTY_CNB_ACTV_NM에 '테스트'가 포함된 사회공헌활동관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_5050M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 사회공헌활동관리 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 사회공헌활동관리 - 키워드 검색 (SCH_SOTY_CNB_ACTV_NM)");
    logInput("SCH_SOTY_CNB_ACTV_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SOTY_CNB_ACTV_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5050M-no2.png`, fullPage: true });

    expect(rows.length, "사회공헌활동관리 키워드 검색 (SCH_SOTY_CNB_ACTV_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5110M — 기부금활동관리  |  API: POST /mis/gen/gen5110/getCtnyMngList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_5110M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5110/getCtnyMngList.do';
  const PGM_ID            = 'gen_5110M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_CNTN_RQST_FRM_DT', 'SCH_CNTN_RQST_TO_DT', 'SCH_CNTN_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기부금활동관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기부금활동관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 기부금활동관리  액터: 개발자
   * URL: /mis/gen/gen5110/getCtnyMngList.do
   * 예상결과: 기부금활동관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5110M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 기부금활동관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 기부금활동관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5110M-no1.png`, fullPage: true });

    expect(rows.length, "기부금활동관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기부금활동관리 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 기부금활동관리  액터: 개발자
   * URL: /mis/gen/gen5110/getCtnyMngList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 기부금활동관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_5110M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 기부금활동관리 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 기부금활동관리 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_CNTN_RQST_FRM_DT\":\"2026-01-01\",\"SCH_CNTN_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_RQST_FRM_DT: "2026-01-01", SCH_CNTN_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5110M-no2.png`, fullPage: true });

    expect(rows.length, "기부금활동관리 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 기부금활동관리 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 기부금활동관리  액터: 개발자
   * URL: /mis/gen/gen5110/getCtnyMngList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_5110M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 기부금활동관리 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 기부금활동관리 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_CNTN_RQST_FRM_DT\":\"2026-07-05\",\"SCH_CNTN_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_RQST_FRM_DT: "2026-07-05", SCH_CNTN_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5110M-no3.png`, fullPage: true });

    expect(rows.length, "기부금활동관리 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 기부금활동관리 - 키워드 검색 (SCH_CNTN_NM)
   * 중분류:   소분류:   메뉴명: 기부금활동관리  액터: 개발자
   * URL: /mis/gen/gen5110/getCtnyMngList.do
   * 예상결과: SCH_CNTN_NM에 '테스트'가 포함된 기부금활동관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_5110M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 기부금활동관리 - 키워드 검색 (SCH_CNTN_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 기부금활동관리 - 키워드 검색 (SCH_CNTN_NM)");
    logInput("SCH_CNTN_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5110M-no4.png`, fullPage: true });

    expect(rows.length, "기부금활동관리 키워드 검색 (SCH_CNTN_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5111M — 기부금활동관리 상세  |  API: POST /mis/gen/gen5111/getCtnyMngData.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_5111M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5111/getCtnyMngData.do';
  const PGM_ID            = 'gen_5111M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기부금활동관리 상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기부금활동관리 상세 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 기부금활동관리 상세  액터: 개발자
   * URL: /mis/gen/gen5111/getCtnyMngData.do
   * 예상결과: 기부금활동관리 상세 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5111M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 기부금활동관리 상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 기부금활동관리 상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5111M-no1.png`, fullPage: true });

    expect(rows.length, "기부금활동관리 상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5120M — 기부금활동신청목록  |  API: POST /mis/gen/gen5120/getCtnyRqstList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_5120M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5120/getCtnyRqstList.do';
  const PGM_ID            = 'gen_5120M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_CNTN_RQST_FRM_DT', 'SCH_CNTN_RQST_TO_DT', 'SCH_CNTN_NM', 'SCH_EMP_NM', 'SCH_EMP_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기부금활동신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기부금활동신청목록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 기부금활동신청목록  액터: 개발자
   * URL: /mis/gen/gen5120/getCtnyRqstList.do
   * 예상결과: 기부금활동신청목록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5120M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 기부금활동신청목록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 기부금활동신청목록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5120M-no1.png`, fullPage: true });

    expect(rows.length, "기부금활동신청목록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기부금활동신청목록 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 기부금활동신청목록  액터: 개발자
   * URL: /mis/gen/gen5120/getCtnyRqstList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 기부금활동신청목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_5120M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 기부금활동신청목록 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 기부금활동신청목록 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_CNTN_RQST_FRM_DT\":\"2026-01-01\",\"SCH_CNTN_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_RQST_FRM_DT: "2026-01-01", SCH_CNTN_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5120M-no2.png`, fullPage: true });

    expect(rows.length, "기부금활동신청목록 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 기부금활동신청목록 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 기부금활동신청목록  액터: 개발자
   * URL: /mis/gen/gen5120/getCtnyRqstList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_5120M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 기부금활동신청목록 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 기부금활동신청목록 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_CNTN_RQST_FRM_DT\":\"2026-07-05\",\"SCH_CNTN_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_RQST_FRM_DT: "2026-07-05", SCH_CNTN_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5120M-no3.png`, fullPage: true });

    expect(rows.length, "기부금활동신청목록 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 기부금활동신청목록 - 키워드 검색 (SCH_CNTN_NM)
   * 중분류:   소분류:   메뉴명: 기부금활동신청목록  액터: 개발자
   * URL: /mis/gen/gen5120/getCtnyRqstList.do
   * 예상결과: SCH_CNTN_NM에 '테스트'가 포함된 기부금활동신청목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_5120M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 기부금활동신청목록 - 키워드 검색 (SCH_CNTN_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 기부금활동신청목록 - 키워드 검색 (SCH_CNTN_NM)");
    logInput("SCH_CNTN_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5120M-no4.png`, fullPage: true });

    expect(rows.length, "기부금활동신청목록 키워드 검색 (SCH_CNTN_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5121M — 기부금활동신청  |  API: POST /mis/gen/gen5121/getCtnyRqstData.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_5121M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5121/getCtnyRqstData.do';
  const PGM_ID            = 'gen_5121M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기부금활동신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기부금활동신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 기부금활동신청  액터: 개발자
   * URL: /mis/gen/gen5121/getCtnyRqstData.do
   * 예상결과: 기부금활동신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5121M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 기부금활동신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 기부금활동신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5121M-no1.png`, fullPage: true });

    expect(rows.length, "기부금활동신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5130M — 기부금활동현황  |  API: POST /mis/gen/gen5130/getCtnyList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_5130M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5130/getCtnyList.do';
  const PGM_ID            = 'gen_5130M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_CNTN_RQST_FRM_DT', 'SCH_CNTN_RQST_TO_DT', 'SCH_CNTN_NM', 'SCH_PRGM_STAT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기부금활동현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기부금활동현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 기부금활동현황  액터: 개발자
   * URL: /mis/gen/gen5130/getCtnyList.do
   * 예상결과: 기부금활동현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5130M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 기부금활동현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 기부금활동현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5130M-no1.png`, fullPage: true });

    expect(rows.length, "기부금활동현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기부금활동현황 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 기부금활동현황  액터: 개발자
   * URL: /mis/gen/gen5130/getCtnyList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 기부금활동현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_5130M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 기부금활동현황 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 기부금활동현황 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_CNTN_RQST_FRM_DT\":\"2026-01-01\",\"SCH_CNTN_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_RQST_FRM_DT: "2026-01-01", SCH_CNTN_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5130M-no2.png`, fullPage: true });

    expect(rows.length, "기부금활동현황 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 기부금활동현황 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 기부금활동현황  액터: 개발자
   * URL: /mis/gen/gen5130/getCtnyList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_5130M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 기부금활동현황 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 기부금활동현황 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_CNTN_RQST_FRM_DT\":\"2026-07-05\",\"SCH_CNTN_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_RQST_FRM_DT: "2026-07-05", SCH_CNTN_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5130M-no3.png`, fullPage: true });

    expect(rows.length, "기부금활동현황 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 기부금활동현황 - 키워드 검색 (SCH_CNTN_NM)
   * 중분류:   소분류:   메뉴명: 기부금활동현황  액터: 개발자
   * URL: /mis/gen/gen5130/getCtnyList.do
   * 예상결과: SCH_CNTN_NM에 '테스트'가 포함된 기부금활동현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_5130M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 기부금활동현황 - 키워드 검색 (SCH_CNTN_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 기부금활동현황 - 키워드 검색 (SCH_CNTN_NM)");
    logInput("SCH_CNTN_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5130M-no4.png`, fullPage: true });

    expect(rows.length, "기부금활동현황 키워드 검색 (SCH_CNTN_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5140M — 기부금활동상세현황  |  API: POST /mis/gen/gen5140/getCtnyDtlList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_5140M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5140/getCtnyDtlList.do';
  const PGM_ID            = 'gen_5140M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_CNTN_RQST_FRM_DT', 'SCH_CNTN_RQST_TO_DT', 'SCH_CNTN_NM', 'SCH_EMP_NM', 'SCH_EMP_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기부금활동상세현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기부금활동상세현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 기부금활동상세현황  액터: 개발자
   * URL: /mis/gen/gen5140/getCtnyDtlList.do
   * 예상결과: 기부금활동상세현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5140M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 기부금활동상세현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 기부금활동상세현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5140M-no1.png`, fullPage: true });

    expect(rows.length, "기부금활동상세현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기부금활동상세현황 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 기부금활동상세현황  액터: 개발자
   * URL: /mis/gen/gen5140/getCtnyDtlList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 기부금활동상세현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_5140M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 기부금활동상세현황 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 기부금활동상세현황 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_CNTN_RQST_FRM_DT\":\"2026-01-01\",\"SCH_CNTN_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_RQST_FRM_DT: "2026-01-01", SCH_CNTN_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5140M-no2.png`, fullPage: true });

    expect(rows.length, "기부금활동상세현황 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 기부금활동상세현황 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 기부금활동상세현황  액터: 개발자
   * URL: /mis/gen/gen5140/getCtnyDtlList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_5140M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 기부금활동상세현황 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 기부금활동상세현황 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_CNTN_RQST_FRM_DT\":\"2026-07-05\",\"SCH_CNTN_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_RQST_FRM_DT: "2026-07-05", SCH_CNTN_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5140M-no3.png`, fullPage: true });

    expect(rows.length, "기부금활동상세현황 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 기부금활동상세현황 - 키워드 검색 (SCH_CNTN_NM)
   * 중분류:   소분류:   메뉴명: 기부금활동상세현황  액터: 개발자
   * URL: /mis/gen/gen5140/getCtnyDtlList.do
   * 예상결과: SCH_CNTN_NM에 '테스트'가 포함된 기부금활동상세현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_5140M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 기부금활동상세현황 - 키워드 검색 (SCH_CNTN_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 기부금활동상세현황 - 키워드 검색 (SCH_CNTN_NM)");
    logInput("SCH_CNTN_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5140M-no4.png`, fullPage: true });

    expect(rows.length, "기부금활동상세현황 키워드 검색 (SCH_CNTN_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5510M — 기자정보관리  |  API: POST /mis/gen/gen5510/getGenPrJrnlstList.do  |  TC 2건  |  ds:ds_list
// TODO(menuId): gen_5510M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5510/getGenPrJrnlstList.do';
  const PGM_ID            = 'gen_5510M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_MSNC_FG', 'SCH_PRESS_NM', 'SCH_INSTT_FG', 'SCH_JRNLST_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기자정보관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기자정보관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 기자정보관리  액터: 개발자
   * URL: /mis/gen/gen5510/getGenPrJrnlstList.do
   * 예상결과: 기자정보관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5510M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 기자정보관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 기자정보관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5510M-no1.png`, fullPage: true });

    expect(rows.length, "기자정보관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기자정보관리 - 키워드 검색 (SCH_PRESS_NM)
   * 중분류:   소분류:   메뉴명: 기자정보관리  액터: 개발자
   * URL: /mis/gen/gen5510/getGenPrJrnlstList.do
   * 예상결과: SCH_PRESS_NM에 '테스트'가 포함된 기자정보관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_5510M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 기자정보관리 - 키워드 검색 (SCH_PRESS_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 기자정보관리 - 키워드 검색 (SCH_PRESS_NM)");
    logInput("SCH_PRESS_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_PRESS_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5510M-no2.png`, fullPage: true });

    expect(rows.length, "기자정보관리 키워드 검색 (SCH_PRESS_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5520M — 언론보도자료관리  |  API: POST /mis/gen/gen5520/getGenMsncNscvrgList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_5520M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5520/getGenMsncNscvrgList.do';
  const PGM_ID            = 'gen_5520M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_NSCVRG_FRM_DT', 'SCH_NSCVRG_TO_DT', 'SCH_NSCVRG_TP_FG', 'SCH_NSCVRG_THMA', 'SCH_PRESS_NM', 'SCH_JRNLST_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`언론보도자료관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 언론보도자료관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 언론보도자료관리  액터: 개발자
   * URL: /mis/gen/gen5520/getGenMsncNscvrgList.do
   * 예상결과: 언론보도자료관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5520M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 언론보도자료관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 언론보도자료관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5520M-no1.png`, fullPage: true });

    expect(rows.length, "언론보도자료관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 언론보도자료관리 - 기간 조회 (SCH_NSCVRG_FRM_DT~SCH_NSCVRG_TO_DT)
   * 중분류:   소분류:   메뉴명: 언론보도자료관리  액터: 개발자
   * URL: /mis/gen/gen5520/getGenMsncNscvrgList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 언론보도자료관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_5520M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 언론보도자료관리 - 기간 조회 (SCH_NSCVRG_FRM_DT~SCH_NSCVRG_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 언론보도자료관리 - 기간 조회 (SCH_NSCVRG_FRM_DT~SCH_NSCVRG_TO_DT)");
    logInput('검색조건', "{\"SCH_NSCVRG_FRM_DT\":\"2026-01-01\",\"SCH_NSCVRG_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_NSCVRG_FRM_DT: "2026-01-01", SCH_NSCVRG_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5520M-no2.png`, fullPage: true });

    expect(rows.length, "언론보도자료관리 기간 조회 (SCH_NSCVRG_FRM_DT~SCH_NSCVRG_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 언론보도자료관리 - 역방향 기간 조회 (0건 확인, SCH_NSCVRG_FRM_DT>SCH_NSCVRG_TO_DT)
   * 중분류:   소분류:   메뉴명: 언론보도자료관리  액터: 개발자
   * URL: /mis/gen/gen5520/getGenMsncNscvrgList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_5520M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 언론보도자료관리 - 역방향 기간 조회 (0건 확인, SCH_NSCVRG_FRM_DT>SCH_NSCVRG_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 언론보도자료관리 - 역방향 기간 조회 (0건 확인, SCH_NSCVRG_FRM_DT>SCH_NSCVRG_TO_DT)");
    logInput('검색조건', "{\"SCH_NSCVRG_FRM_DT\":\"2026-07-05\",\"SCH_NSCVRG_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_NSCVRG_FRM_DT: "2026-07-05", SCH_NSCVRG_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5520M-no3.png`, fullPage: true });

    expect(rows.length, "언론보도자료관리 역방향 기간 조회 (0건 확인, SCH_NSCVRG_FRM_DT>SCH_NSCVRG_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 언론보도자료관리 - 키워드 검색 (SCH_PRESS_NM)
   * 중분류:   소분류:   메뉴명: 언론보도자료관리  액터: 개발자
   * URL: /mis/gen/gen5520/getGenMsncNscvrgList.do
   * 예상결과: SCH_PRESS_NM에 '테스트'가 포함된 언론보도자료관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_5520M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 언론보도자료관리 - 키워드 검색 (SCH_PRESS_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 언론보도자료관리 - 키워드 검색 (SCH_PRESS_NM)");
    logInput("SCH_PRESS_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_PRESS_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5520M-no4.png`, fullPage: true });

    expect(rows.length, "언론보도자료관리 키워드 검색 (SCH_PRESS_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5530M — 언론홍보자료배포  |  API: POST /mis/gen/gen5530/getGenPrDtaWdtbList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_5530M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5530/getGenPrDtaWdtbList.do';
  const PGM_ID            = 'gen_5530M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_TRN_FRM_DT', 'SCH_TRN_TO_DT', 'SCH_MAIL_SBJ', 'SCH_WRTER_EMP_RID', 'SCH_WRTER_EMP_NO', 'SCH_WRTER_EMP_NM', 'SCH_WRTER_DEPT_CD', 'SCH_WRTER_DEPT_NM', 'SCH_MSNC_FG', 'SCH_PRESS_NM', 'SCH_INSTT_FG', 'SCH_JRNLST_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`언론홍보자료배포(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 언론홍보자료배포 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 언론홍보자료배포  액터: 개발자
   * URL: /mis/gen/gen5530/getGenPrDtaWdtbList.do
   * 예상결과: 언론홍보자료배포 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5530M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 언론홍보자료배포 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 언론홍보자료배포 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5530M-no1.png`, fullPage: true });

    expect(rows.length, "언론홍보자료배포 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 언론홍보자료배포 - 기간 조회 (SCH_TRN_FRM_DT~SCH_TRN_TO_DT)
   * 중분류:   소분류:   메뉴명: 언론홍보자료배포  액터: 개발자
   * URL: /mis/gen/gen5530/getGenPrDtaWdtbList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 언론홍보자료배포 목록이 조회된다.
   * DB 확인: -- TODO(gen_5530M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 언론홍보자료배포 - 기간 조회 (SCH_TRN_FRM_DT~SCH_TRN_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 언론홍보자료배포 - 기간 조회 (SCH_TRN_FRM_DT~SCH_TRN_TO_DT)");
    logInput('검색조건', "{\"SCH_TRN_FRM_DT\":\"2026-01-01\",\"SCH_TRN_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_TRN_FRM_DT: "2026-01-01", SCH_TRN_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5530M-no2.png`, fullPage: true });

    expect(rows.length, "언론홍보자료배포 기간 조회 (SCH_TRN_FRM_DT~SCH_TRN_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 언론홍보자료배포 - 역방향 기간 조회 (0건 확인, SCH_TRN_FRM_DT>SCH_TRN_TO_DT)
   * 중분류:   소분류:   메뉴명: 언론홍보자료배포  액터: 개발자
   * URL: /mis/gen/gen5530/getGenPrDtaWdtbList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_5530M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 언론홍보자료배포 - 역방향 기간 조회 (0건 확인, SCH_TRN_FRM_DT>SCH_TRN_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 언론홍보자료배포 - 역방향 기간 조회 (0건 확인, SCH_TRN_FRM_DT>SCH_TRN_TO_DT)");
    logInput('검색조건', "{\"SCH_TRN_FRM_DT\":\"2026-07-05\",\"SCH_TRN_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_TRN_FRM_DT: "2026-07-05", SCH_TRN_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5530M-no3.png`, fullPage: true });

    expect(rows.length, "언론홍보자료배포 역방향 기간 조회 (0건 확인, SCH_TRN_FRM_DT>SCH_TRN_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 언론홍보자료배포 - 키워드 검색 (SCH_WRTER_EMP_NM)
   * 중분류:   소분류:   메뉴명: 언론홍보자료배포  액터: 개발자
   * URL: /mis/gen/gen5530/getGenPrDtaWdtbList.do
   * 예상결과: SCH_WRTER_EMP_NM에 '테스트'가 포함된 언론홍보자료배포 목록이 조회된다.
   * DB 확인: -- TODO(gen_5530M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 언론홍보자료배포 - 키워드 검색 (SCH_WRTER_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 언론홍보자료배포 - 키워드 검색 (SCH_WRTER_EMP_NM)");
    logInput("SCH_WRTER_EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_WRTER_EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5530M-no4.png`, fullPage: true });

    expect(rows.length, "언론홍보자료배포 키워드 검색 (SCH_WRTER_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5531M — 언론홍보자료배포상세  |  API: POST /mis/gen/gen5510/getGenPrJrnlstPopList.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_5531M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5510/getGenPrJrnlstPopList.do';
  const PGM_ID            = 'gen_5531M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`언론홍보자료배포상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 언론홍보자료배포상세 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 언론홍보자료배포상세  액터: 개발자
   * URL: /mis/gen/gen5510/getGenPrJrnlstPopList.do
   * 예상결과: 언론홍보자료배포상세 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5531M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 언론홍보자료배포상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 언론홍보자료배포상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5531M-no1.png`, fullPage: true });

    expect(rows.length, "언론홍보자료배포상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5540M — 홍보물관리  |  API: POST /mis/gen/gen5540/getGenPrThingMngList.do  |  TC 2건  |  ds:ds_list
// TODO(menuId): gen_5540M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5540/getGenPrThingMngList.do';
  const PGM_ID            = 'gen_5540M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_MNCT_FROM_DT', 'SCH_MNCT_TO_DT', 'SCH_PR_THNG_FG', 'SCH_PR_THNG_NM', 'SCH_WDTB_INSTT_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`홍보물관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 홍보물관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 홍보물관리  액터: 개발자
   * URL: /mis/gen/gen5540/getGenPrThingMngList.do
   * 예상결과: 홍보물관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5540M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 홍보물관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 홍보물관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5540M-no1.png`, fullPage: true });

    expect(rows.length, "홍보물관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 홍보물관리 - 키워드 검색 (SCH_PR_THNG_NM)
   * 중분류:   소분류:   메뉴명: 홍보물관리  액터: 개발자
   * URL: /mis/gen/gen5540/getGenPrThingMngList.do
   * 예상결과: SCH_PR_THNG_NM에 '테스트'가 포함된 홍보물관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_5540M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 홍보물관리 - 키워드 검색 (SCH_PR_THNG_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 홍보물관리 - 키워드 검색 (SCH_PR_THNG_NM)");
    logInput("SCH_PR_THNG_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_PR_THNG_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5540M-no2.png`, fullPage: true });

    expect(rows.length, "홍보물관리 키워드 검색 (SCH_PR_THNG_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5550M — 협약관리  |  API: POST /mis/gen/gen5550/getGenAgremMngList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_5550M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5550/getGenAgremMngList.do';
  const PGM_ID            = 'gen_5550M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_AGREM_FG', 'SCH_CNCLS_FRM_DT', 'SCH_CNCLS_TO_DT', 'SCH_IOCT_FG', 'SCH_CHRG_DEPT_CD', 'SCH_CHRG_DEPT_NM', 'SCH_AGREM_NM', 'SCH_AGREM_CONT', 'SCH_RETE_INSTT_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`협약관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 협약관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 협약관리  액터: 개발자
   * URL: /mis/gen/gen5550/getGenAgremMngList.do
   * 예상결과: 협약관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5550M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 협약관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 협약관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5550M-no1.png`, fullPage: true });

    expect(rows.length, "협약관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 협약관리 - 기간 조회 (SCH_CNCLS_FRM_DT~SCH_CNCLS_TO_DT)
   * 중분류:   소분류:   메뉴명: 협약관리  액터: 개발자
   * URL: /mis/gen/gen5550/getGenAgremMngList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 협약관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_5550M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 협약관리 - 기간 조회 (SCH_CNCLS_FRM_DT~SCH_CNCLS_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 협약관리 - 기간 조회 (SCH_CNCLS_FRM_DT~SCH_CNCLS_TO_DT)");
    logInput('검색조건', "{\"SCH_CNCLS_FRM_DT\":\"2026-01-01\",\"SCH_CNCLS_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNCLS_FRM_DT: "2026-01-01", SCH_CNCLS_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5550M-no2.png`, fullPage: true });

    expect(rows.length, "협약관리 기간 조회 (SCH_CNCLS_FRM_DT~SCH_CNCLS_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 협약관리 - 역방향 기간 조회 (0건 확인, SCH_CNCLS_FRM_DT>SCH_CNCLS_TO_DT)
   * 중분류:   소분류:   메뉴명: 협약관리  액터: 개발자
   * URL: /mis/gen/gen5550/getGenAgremMngList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_5550M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 협약관리 - 역방향 기간 조회 (0건 확인, SCH_CNCLS_FRM_DT>SCH_CNCLS_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 협약관리 - 역방향 기간 조회 (0건 확인, SCH_CNCLS_FRM_DT>SCH_CNCLS_TO_DT)");
    logInput('검색조건', "{\"SCH_CNCLS_FRM_DT\":\"2026-07-05\",\"SCH_CNCLS_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNCLS_FRM_DT: "2026-07-05", SCH_CNCLS_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5550M-no3.png`, fullPage: true });

    expect(rows.length, "협약관리 역방향 기간 조회 (0건 확인, SCH_CNCLS_FRM_DT>SCH_CNCLS_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 협약관리 - 키워드 검색 (SCH_CHRG_DEPT_NM)
   * 중분류:   소분류:   메뉴명: 협약관리  액터: 개발자
   * URL: /mis/gen/gen5550/getGenAgremMngList.do
   * 예상결과: SCH_CHRG_DEPT_NM에 '테스트'가 포함된 협약관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_5550M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 협약관리 - 키워드 검색 (SCH_CHRG_DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 협약관리 - 키워드 검색 (SCH_CHRG_DEPT_NM)");
    logInput("SCH_CHRG_DEPT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CHRG_DEPT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5550M-no4.png`, fullPage: true });

    expect(rows.length, "협약관리 키워드 검색 (SCH_CHRG_DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5551M — 협약관리상세  |  API: POST /mis/gen/gen5560/getGenReteOrganPopList.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_5551M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5560/getGenReteOrganPopList.do';
  const PGM_ID            = 'gen_5551M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`협약관리상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 협약관리상세 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 협약관리상세  액터: 개발자
   * URL: /mis/gen/gen5560/getGenReteOrganPopList.do
   * 예상결과: 협약관리상세 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5551M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 협약관리상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 협약관리상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5551M-no1.png`, fullPage: true });

    expect(rows.length, "협약관리상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5560M — 유관기관관리  |  API: POST /mis/gen/gen5560/getGenReteOrganMngList.do  |  TC 2건  |  ds:ds_list
// TODO(menuId): gen_5560M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5560/getGenReteOrganMngList.do';
  const PGM_ID            = 'gen_5560M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RETE_INSTT_TP_FG', 'SCH_RETE_INSTT_NM', 'SCH_CHRGER_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`유관기관관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 유관기관관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 유관기관관리  액터: 개발자
   * URL: /mis/gen/gen5560/getGenReteOrganMngList.do
   * 예상결과: 유관기관관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5560M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 유관기관관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 유관기관관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5560M-no1.png`, fullPage: true });

    expect(rows.length, "유관기관관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 유관기관관리 - 키워드 검색 (SCH_RETE_INSTT_NM)
   * 중분류:   소분류:   메뉴명: 유관기관관리  액터: 개발자
   * URL: /mis/gen/gen5560/getGenReteOrganMngList.do
   * 예상결과: SCH_RETE_INSTT_NM에 '테스트'가 포함된 유관기관관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_5560M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 유관기관관리 - 키워드 검색 (SCH_RETE_INSTT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 유관기관관리 - 키워드 검색 (SCH_RETE_INSTT_NM)");
    logInput("SCH_RETE_INSTT_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RETE_INSTT_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5560M-no2.png`, fullPage: true });

    expect(rows.length, "유관기관관리 키워드 검색 (SCH_RETE_INSTT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5570M — 기념품등록관리  |  API: POST /mis/gen/gen5570/getGenSvnrMngList.do  |  TC 4건  |  ds:ds_svnrList
// TODO(menuId): gen_5570M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5570/getGenSvnrMngList.do';
  const PGM_ID            = 'gen_5570M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_svnrList';
  const DS_SEARCH_COLUMNS = ['SCH_SVNR_NM', 'SCH_SVNR_INS_FRM_DT', 'SCH_SVNR_INS_TO_DT', 'SCH_MNCT_ENTP_NM', 'SCH_SVNR_RQST_POSL_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기념품등록관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기념품등록관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 기념품등록관리  액터: 개발자
   * URL: /mis/gen/gen5570/getGenSvnrMngList.do
   * 예상결과: 기념품등록관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5570M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 기념품등록관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 기념품등록관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5570M-no1.png`, fullPage: true });

    expect(rows.length, "기념품등록관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기념품등록관리 - 기간 조회 (SCH_SVNR_INS_FRM_DT~SCH_SVNR_INS_TO_DT)
   * 중분류:   소분류:   메뉴명: 기념품등록관리  액터: 개발자
   * URL: /mis/gen/gen5570/getGenSvnrMngList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 기념품등록관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_5570M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 기념품등록관리 - 기간 조회 (SCH_SVNR_INS_FRM_DT~SCH_SVNR_INS_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 기념품등록관리 - 기간 조회 (SCH_SVNR_INS_FRM_DT~SCH_SVNR_INS_TO_DT)");
    logInput('검색조건', "{\"SCH_SVNR_INS_FRM_DT\":\"2026-01-01\",\"SCH_SVNR_INS_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SVNR_INS_FRM_DT: "2026-01-01", SCH_SVNR_INS_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5570M-no2.png`, fullPage: true });

    expect(rows.length, "기념품등록관리 기간 조회 (SCH_SVNR_INS_FRM_DT~SCH_SVNR_INS_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 기념품등록관리 - 역방향 기간 조회 (0건 확인, SCH_SVNR_INS_FRM_DT>SCH_SVNR_INS_TO_DT)
   * 중분류:   소분류:   메뉴명: 기념품등록관리  액터: 개발자
   * URL: /mis/gen/gen5570/getGenSvnrMngList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_5570M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 기념품등록관리 - 역방향 기간 조회 (0건 확인, SCH_SVNR_INS_FRM_DT>SCH_SVNR_INS_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 기념품등록관리 - 역방향 기간 조회 (0건 확인, SCH_SVNR_INS_FRM_DT>SCH_SVNR_INS_TO_DT)");
    logInput('검색조건', "{\"SCH_SVNR_INS_FRM_DT\":\"2026-07-05\",\"SCH_SVNR_INS_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SVNR_INS_FRM_DT: "2026-07-05", SCH_SVNR_INS_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5570M-no3.png`, fullPage: true });

    expect(rows.length, "기념품등록관리 역방향 기간 조회 (0건 확인, SCH_SVNR_INS_FRM_DT>SCH_SVNR_INS_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 기념품등록관리 - 키워드 검색 (SCH_SVNR_NM)
   * 중분류:   소분류:   메뉴명: 기념품등록관리  액터: 개발자
   * URL: /mis/gen/gen5570/getGenSvnrMngList.do
   * 예상결과: SCH_SVNR_NM에 '테스트'가 포함된 기념품등록관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_5570M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 기념품등록관리 - 키워드 검색 (SCH_SVNR_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 기념품등록관리 - 키워드 검색 (SCH_SVNR_NM)");
    logInput("SCH_SVNR_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SVNR_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5570M-no4.png`, fullPage: true });

    expect(rows.length, "기념품등록관리 키워드 검색 (SCH_SVNR_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5580M — 기념품신청  |  API: POST /mis/gen/gen5580/getSvnrRqstData.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_5580M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5580/getSvnrRqstData.do';
  const PGM_ID            = 'gen_5580M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_RQSTER_EMP_RID', 'SCH_RQSTER_EMP_NO', 'SCH_RQSTER_EMP_NM', 'SCH_RVER_EMP_RID', 'SCH_RVER_EMP_NO', 'SCH_RVER_EMP_NM', 'SCH_PMT_FRM_DT', 'SCH_PMT_TO_DT', 'SCH_SVNR_NM', 'SCH_RQST_STAT_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기념품신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기념품신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 기념품신청  액터: 개발자
   * URL: /mis/gen/gen5580/getSvnrRqstData.do
   * 예상결과: 기념품신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5580M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 기념품신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 기념품신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5580M-no1.png`, fullPage: true });

    expect(rows.length, "기념품신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기념품신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 기념품신청  액터: 개발자
   * URL: /mis/gen/gen5580/getSvnrRqstData.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 기념품신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_5580M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 기념품신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 기념품신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5580M-no2.png`, fullPage: true });

    expect(rows.length, "기념품신청 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 기념품신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 기념품신청  액터: 개발자
   * URL: /mis/gen/gen5580/getSvnrRqstData.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_5580M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 기념품신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 기념품신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5580M-no3.png`, fullPage: true });

    expect(rows.length, "기념품신청 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 기념품신청 - 키워드 검색 (SCH_RQSTER_EMP_NM)
   * 중분류:   소분류:   메뉴명: 기념품신청  액터: 개발자
   * URL: /mis/gen/gen5580/getSvnrRqstData.do
   * 예상결과: SCH_RQSTER_EMP_NM에 '테스트'가 포함된 기념품신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_5580M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 기념품신청 - 키워드 검색 (SCH_RQSTER_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 기념품신청 - 키워드 검색 (SCH_RQSTER_EMP_NM)");
    logInput("SCH_RQSTER_EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQSTER_EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5580M-no4.png`, fullPage: true });

    expect(rows.length, "기념품신청 키워드 검색 (SCH_RQSTER_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_5581M — 기념품신청상세  |  API: POST /mis/gen/gen5581/getGenSvnrRqstNDtlData.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_5581M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5581/getGenSvnrRqstNDtlData.do';
  const PGM_ID            = 'gen_5581M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기념품신청상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기념품신청상세 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 기념품신청상세  액터: 개발자
   * URL: /mis/gen/gen5581/getGenSvnrRqstNDtlData.do
   * 예상결과: 기념품신청상세 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_5581M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 기념품신청상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 기념품신청상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_5581M-no1.png`, fullPage: true });

    expect(rows.length, "기념품신청상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_6005M — USB담당자관리  |  API: POST /mis/gen/gen6005/getGenUsbPchrgMngList.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_6005M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen6005/getGenUsbPchrgMngList.do';
  const PGM_ID            = 'gen_6005M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_USB_USE_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`USB담당자관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] USB담당자관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: USB담당자관리  액터: 개발자
   * URL: /mis/gen/gen6005/getGenUsbPchrgMngList.do
   * 예상결과: USB담당자관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_6005M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] USB담당자관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] USB담당자관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_6005M-no1.png`, fullPage: true });

    expect(rows.length, "USB담당자관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_6010M — USB관리  |  API: POST /mis/gen/gen6010/getPchrgUsbFgCdList.do  |  TC 4건  |  ds:ds_usbList
// TODO(menuId): gen_6010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen6010/getPchrgUsbFgCdList.do';
  const PGM_ID            = 'gen_6010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_usbList';
  const DS_SEARCH_COLUMNS = ['SCH_USB_FG', 'SCH_USB_NM', 'SCH_INS_FRM_DT', 'SCH_INS_TO_DT', 'SCH_USB_MNG_STAT_FG', 'SCH_RQST_POSL_YN', 'SCH_ROLE_LEVEL'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`USB관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] USB관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: USB관리  액터: 개발자
   * URL: /mis/gen/gen6010/getPchrgUsbFgCdList.do
   * 예상결과: USB관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_6010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] USB관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] USB관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_6010M-no1.png`, fullPage: true });

    expect(rows.length, "USB관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] USB관리 - 기간 조회 (SCH_INS_FRM_DT~SCH_INS_TO_DT)
   * 중분류:   소분류:   메뉴명: USB관리  액터: 개발자
   * URL: /mis/gen/gen6010/getPchrgUsbFgCdList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 USB관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_6010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] USB관리 - 기간 조회 (SCH_INS_FRM_DT~SCH_INS_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] USB관리 - 기간 조회 (SCH_INS_FRM_DT~SCH_INS_TO_DT)");
    logInput('검색조건', "{\"SCH_INS_FRM_DT\":\"2026-01-01\",\"SCH_INS_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_INS_FRM_DT: "2026-01-01", SCH_INS_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_6010M-no2.png`, fullPage: true });

    expect(rows.length, "USB관리 기간 조회 (SCH_INS_FRM_DT~SCH_INS_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] USB관리 - 역방향 기간 조회 (0건 확인, SCH_INS_FRM_DT>SCH_INS_TO_DT)
   * 중분류:   소분류:   메뉴명: USB관리  액터: 개발자
   * URL: /mis/gen/gen6010/getPchrgUsbFgCdList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_6010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] USB관리 - 역방향 기간 조회 (0건 확인, SCH_INS_FRM_DT>SCH_INS_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] USB관리 - 역방향 기간 조회 (0건 확인, SCH_INS_FRM_DT>SCH_INS_TO_DT)");
    logInput('검색조건', "{\"SCH_INS_FRM_DT\":\"2026-07-05\",\"SCH_INS_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_INS_FRM_DT: "2026-07-05", SCH_INS_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_6010M-no3.png`, fullPage: true });

    expect(rows.length, "USB관리 역방향 기간 조회 (0건 확인, SCH_INS_FRM_DT>SCH_INS_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] USB관리 - 키워드 검색 (SCH_USB_NM)
   * 중분류:   소분류:   메뉴명: USB관리  액터: 개발자
   * URL: /mis/gen/gen6010/getPchrgUsbFgCdList.do
   * 예상결과: SCH_USB_NM에 '테스트'가 포함된 USB관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_6010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] USB관리 - 키워드 검색 (SCH_USB_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] USB관리 - 키워드 검색 (SCH_USB_NM)");
    logInput("SCH_USB_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_USB_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_6010M-no4.png`, fullPage: true });

    expect(rows.length, "USB관리 키워드 검색 (SCH_USB_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_6020M — USB신청  |  API: POST /mis/gen/gen6020/getUsbLendRqstData.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_6020M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen6020/getUsbLendRqstData.do';
  const PGM_ID            = 'gen_6020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_USB_FG', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_RQSTER_EMP_RID', 'SCH_RQSTER_EMP_NO', 'SCH_RQSTER_EMP_NM', 'SCH_USB_NM', 'SCH_RTUN_FRM_DT', 'SCH_RTUN_TO_DT', 'SCH_ACCPER_EMP_RID', 'SCH_ACCPER_EMP_NO', 'SCH_ACCPER_EMP_NM', 'SCH_RQST_STAT_FG', 'SCH_ROLE_LEVEL'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`USB신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] USB신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: USB신청  액터: 개발자
   * URL: /mis/gen/gen6020/getUsbLendRqstData.do
   * 예상결과: USB신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_6020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] USB신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] USB신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_6020M-no1.png`, fullPage: true });

    expect(rows.length, "USB신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] USB신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: USB신청  액터: 개발자
   * URL: /mis/gen/gen6020/getUsbLendRqstData.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 USB신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_6020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] USB신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] USB신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_6020M-no2.png`, fullPage: true });

    expect(rows.length, "USB신청 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] USB신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: USB신청  액터: 개발자
   * URL: /mis/gen/gen6020/getUsbLendRqstData.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_6020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] USB신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] USB신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_6020M-no3.png`, fullPage: true });

    expect(rows.length, "USB신청 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] USB신청 - 키워드 검색 (SCH_RQSTER_EMP_NM)
   * 중분류:   소분류:   메뉴명: USB신청  액터: 개발자
   * URL: /mis/gen/gen6020/getUsbLendRqstData.do
   * 예상결과: SCH_RQSTER_EMP_NM에 '테스트'가 포함된 USB신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_6020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] USB신청 - 키워드 검색 (SCH_RQSTER_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] USB신청 - 키워드 검색 (SCH_RQSTER_EMP_NM)");
    logInput("SCH_RQSTER_EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQSTER_EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_6020M-no4.png`, fullPage: true });

    expect(rows.length, "USB신청 키워드 검색 (SCH_RQSTER_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_6021M — USB신청상세  |  API: POST /mis/gen/gen6021/getGenUsbLendRqstData.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_6021M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen6021/getGenUsbLendRqstData.do';
  const PGM_ID            = 'gen_6021M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['TODO_RQST_RNO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`USB신청상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] USB신청상세 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: USB신청상세  액터: 개발자
   * URL: /mis/gen/gen6021/getGenUsbLendRqstData.do
   * 예상결과: USB신청상세 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_6021M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] USB신청상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] USB신청상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_6021M-no1.png`, fullPage: true });

    expect(rows.length, "USB신청상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_6030M — USB사용현황  |  API: POST /mis/gen/gen6030/getUsbUseData.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_6030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen6030/getUsbUseData.do';
  const PGM_ID            = 'gen_6030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_USB_FG', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_RQSTER_EMP_RID', 'SCH_RQSTER_EMP_NO', 'SCH_RQSTER_EMP_NM', 'SCH_USB_LEND_FG', 'SCH_USB_NM', 'SCH_RTUN_FRM_DT', 'SCH_RTUN_TO_DT', 'SCH_ACCPER_EMP_RID', 'SCH_ACCPER_EMP_NO', 'SCH_ACCPER_EMP_NM', 'SCH_RQST_STAT_FG', 'SCH_ROLE_LEVEL'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`USB사용현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] USB사용현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: USB사용현황  액터: 개발자
   * URL: /mis/gen/gen6030/getUsbUseData.do
   * 예상결과: USB사용현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_6030M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] USB사용현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] USB사용현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_6030M-no1.png`, fullPage: true });

    expect(rows.length, "USB사용현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] USB사용현황 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: USB사용현황  액터: 개발자
   * URL: /mis/gen/gen6030/getUsbUseData.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 USB사용현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_6030M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] USB사용현황 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] USB사용현황 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_6030M-no2.png`, fullPage: true });

    expect(rows.length, "USB사용현황 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] USB사용현황 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: USB사용현황  액터: 개발자
   * URL: /mis/gen/gen6030/getUsbUseData.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_6030M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] USB사용현황 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] USB사용현황 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_6030M-no3.png`, fullPage: true });

    expect(rows.length, "USB사용현황 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] USB사용현황 - 키워드 검색 (SCH_RQSTER_EMP_NM)
   * 중분류:   소분류:   메뉴명: USB사용현황  액터: 개발자
   * URL: /mis/gen/gen6030/getUsbUseData.do
   * 예상결과: SCH_RQSTER_EMP_NM에 '테스트'가 포함된 USB사용현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_6030M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] USB사용현황 - 키워드 검색 (SCH_RQSTER_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] USB사용현황 - 키워드 검색 (SCH_RQSTER_EMP_NM)");
    logInput("SCH_RQSTER_EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQSTER_EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_6030M-no4.png`, fullPage: true });

    expect(rows.length, "USB사용현황 키워드 검색 (SCH_RQSTER_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_7010M — 연구실관리  |  API: POST /mis/gen/gen7010/getList01.do  |  TC 2건  |  ds:ds_list01
// TODO(menuId): gen_7010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen7010/getList01.do';
  const PGM_ID            = 'gen_7010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list01';
  const DS_SEARCH_COLUMNS = ['SCH_LABR_NM', 'SCH_DHRM_MNG_NO', 'SCH_DHRM_MNG_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`연구실관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 연구실관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 연구실관리  액터: 개발자
   * URL: /mis/gen/gen7010/getList01.do
   * 예상결과: 연구실관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_7010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 연구실관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 연구실관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7010M-no1.png`, fullPage: true });

    expect(rows.length, "연구실관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 연구실관리 - 키워드 검색 (SCH_LABR_NM)
   * 중분류:   소분류:   메뉴명: 연구실관리  액터: 개발자
   * URL: /mis/gen/gen7010/getList01.do
   * 예상결과: SCH_LABR_NM에 '테스트'가 포함된 연구실관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_7010M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 연구실관리 - 키워드 검색 (SCH_LABR_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 연구실관리 - 키워드 검색 (SCH_LABR_NM)");
    logInput("SCH_LABR_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_LABR_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7010M-no2.png`, fullPage: true });

    expect(rows.length, "연구실관리 키워드 검색 (SCH_LABR_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_7011M — 연구실관리상세  |  API: POST /mis/gen/gen7091/getHoliYN.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_7011M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen7091/getHoliYN.do';
  const PGM_ID            = 'gen_7011M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`연구실관리상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 연구실관리상세 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 연구실관리상세  액터: 개발자
   * URL: /mis/gen/gen7091/getHoliYN.do
   * 예상결과: 연구실관리상세 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_7011M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 연구실관리상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 연구실관리상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7011M-no1.png`, fullPage: true });

    expect(rows.length, "연구실관리상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_7020M — 화학물질관리  |  API: POST /mis/gen/gen7020/getList01.do  |  TC 2건  |  ds:ds_list01
// TODO(menuId): gen_7020M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen7020/getList01.do';
  const PGM_ID            = 'gen_7020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list01';
  const DS_SEARCH_COLUMNS = ['SCH_MATT_FG_CD', 'SCH_FG_CD', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_CAS_NO', 'SCH_CHEM_MTTR_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`화학물질관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 화학물질관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 화학물질관리  액터: 개발자
   * URL: /mis/gen/gen7020/getList01.do
   * 예상결과: 화학물질관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_7020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 화학물질관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 화학물질관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7020M-no1.png`, fullPage: true });

    expect(rows.length, "화학물질관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 화학물질관리 - 키워드 검색 (SCH_EMP_NM)
   * 중분류:   소분류:   메뉴명: 화학물질관리  액터: 개발자
   * URL: /mis/gen/gen7020/getList01.do
   * 예상결과: SCH_EMP_NM에 '테스트'가 포함된 화학물질관리 목록이 조회된다.
   * DB 확인: -- TODO(gen_7020M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 화학물질관리 - 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 화학물질관리 - 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7020M-no2.png`, fullPage: true });

    expect(rows.length, "화학물질관리 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_7030M — 연구실화학물질현황  |  API: POST /mis/gen/gen7030/getList01.do  |  TC 2건  |  ds:ds_list01
// TODO(menuId): gen_7030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen7030/getList01.do';
  const PGM_ID            = 'gen_7030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list01';
  const DS_SEARCH_COLUMNS = ['SCH_LABR_NM', 'SCH_DHRM_MNG_NO', 'SCH_DHRM_MNG_NM', 'SCH_CAS_NO', 'SCH_CHEM_MTTR_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`연구실화학물질현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 연구실화학물질현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 연구실화학물질현황  액터: 개발자
   * URL: /mis/gen/gen7030/getList01.do
   * 예상결과: 연구실화학물질현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_7030M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 연구실화학물질현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 연구실화학물질현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7030M-no1.png`, fullPage: true });

    expect(rows.length, "연구실화학물질현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 연구실화학물질현황 - 키워드 검색 (SCH_LABR_NM)
   * 중분류:   소분류:   메뉴명: 연구실화학물질현황  액터: 개발자
   * URL: /mis/gen/gen7030/getList01.do
   * 예상결과: SCH_LABR_NM에 '테스트'가 포함된 연구실화학물질현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_7030M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 연구실화학물질현황 - 키워드 검색 (SCH_LABR_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 연구실화학물질현황 - 키워드 검색 (SCH_LABR_NM)");
    logInput("SCH_LABR_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_LABR_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7030M-no2.png`, fullPage: true });

    expect(rows.length, "연구실화학물질현황 키워드 검색 (SCH_LABR_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_7210M — 건물별방문증관리  |  API: POST /mis/gen/gen7210/getList.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_7210M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen7210/getList.do';
  const PGM_ID            = 'gen_7210M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_DHRM_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`건물별방문증관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 건물별방문증관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 건물별방문증관리  액터: 개발자
   * URL: /mis/gen/gen7210/getList.do
   * 예상결과: 건물별방문증관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_7210M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 건물별방문증관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 건물별방문증관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7210M-no1.png`, fullPage: true });

    expect(rows.length, "건물별방문증관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_7220M — 방문자 신청  |  API: POST /mis/gen/gen7220/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_7220M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen7220/getList.do';
  const PGM_ID            = 'gen_7220M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_RQST_STAT_CD', 'SCH_DHRM_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`방문자 신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 방문자 신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 방문자 신청  액터: 개발자
   * URL: /mis/gen/gen7220/getList.do
   * 예상결과: 방문자 신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_7220M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 방문자 신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 방문자 신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7220M-no1.png`, fullPage: true });

    expect(rows.length, "방문자 신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 방문자 신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 방문자 신청  액터: 개발자
   * URL: /mis/gen/gen7220/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 방문자 신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_7220M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 방문자 신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 방문자 신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7220M-no2.png`, fullPage: true });

    expect(rows.length, "방문자 신청 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 방문자 신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 방문자 신청  액터: 개발자
   * URL: /mis/gen/gen7220/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_7220M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 방문자 신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 방문자 신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7220M-no3.png`, fullPage: true });

    expect(rows.length, "방문자 신청 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 방문자 신청 - 키워드 검색 (SCH_EMP_NM)
   * 중분류:   소분류:   메뉴명: 방문자 신청  액터: 개발자
   * URL: /mis/gen/gen7220/getList.do
   * 예상결과: SCH_EMP_NM에 '테스트'가 포함된 방문자 신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_7220M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 방문자 신청 - 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 방문자 신청 - 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7220M-no4.png`, fullPage: true });

    expect(rows.length, "방문자 신청 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_7221M — 방문자신청상세  |  API: POST /mis/gen/gen7221/getList02Data.do  |  TC 1건  |  ds:ds_list01
// TODO(menuId): gen_7221M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen7221/getList02Data.do';
  const PGM_ID            = 'gen_7221M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list01';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`방문자신청상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 방문자신청상세 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 방문자신청상세  액터: 개발자
   * URL: /mis/gen/gen7221/getList02Data.do
   * 예상결과: 방문자신청상세 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_7221M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 방문자신청상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 방문자신청상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7221M-no1.png`, fullPage: true });

    expect(rows.length, "방문자신청상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_7230M — 방문자신청현황  |  API: POST /mis/gen/gen7230/getList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_7230M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen7230/getList.do';
  const PGM_ID            = 'gen_7230M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_DHRM_CD', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`방문자신청현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 방문자신청현황 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 방문자신청현황  액터: 개발자
   * URL: /mis/gen/gen7230/getList.do
   * 예상결과: 방문자신청현황 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_7230M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 방문자신청현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 방문자신청현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7230M-no1.png`, fullPage: true });

    expect(rows.length, "방문자신청현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 방문자신청현황 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 방문자신청현황  액터: 개발자
   * URL: /mis/gen/gen7230/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 방문자신청현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_7230M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 방문자신청현황 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 방문자신청현황 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7230M-no2.png`, fullPage: true });

    expect(rows.length, "방문자신청현황 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 방문자신청현황 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 방문자신청현황  액터: 개발자
   * URL: /mis/gen/gen7230/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_7230M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 방문자신청현황 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 방문자신청현황 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7230M-no3.png`, fullPage: true });

    expect(rows.length, "방문자신청현황 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 방문자신청현황 - 키워드 검색 (SCH_EMP_NM)
   * 중분류:   소분류:   메뉴명: 방문자신청현황  액터: 개발자
   * URL: /mis/gen/gen7230/getList.do
   * 예상결과: SCH_EMP_NM에 '테스트'가 포함된 방문자신청현황 목록이 조회된다.
   * DB 확인: -- TODO(gen_7230M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 방문자신청현황 - 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 방문자신청현황 - 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_EMP_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_EMP_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7230M-no4.png`, fullPage: true });

    expect(rows.length, "방문자신청현황 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_7510M — 고충상담신청  |  API: POST /mis/gen/gen7510/getList.do  |  TC 3건  |  ds:ds_list
// TODO(menuId): gen_7510M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen7510/getList.do';
  const PGM_ID            = 'gen_7510M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_PROC_STAT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`고충상담신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 고충상담신청 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 고충상담신청  액터: 개발자
   * URL: /mis/gen/gen7510/getList.do
   * 예상결과: 고충상담신청 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_7510M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 고충상담신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 고충상담신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7510M-no1.png`, fullPage: true });

    expect(rows.length, "고충상담신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 고충상담신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 고충상담신청  액터: 개발자
   * URL: /mis/gen/gen7510/getList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 고충상담신청 목록이 조회된다.
   * DB 확인: -- TODO(gen_7510M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 고충상담신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 고충상담신청 - 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-01-01\",\"SCH_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-01-01", SCH_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7510M-no2.png`, fullPage: true });

    expect(rows.length, "고충상담신청 기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 고충상담신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 고충상담신청  액터: 개발자
   * URL: /mis/gen/gen7510/getList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_7510M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 고충상담신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 고충상담신청 - 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_RQST_FRM_DT\":\"2026-07-05\",\"SCH_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_FRM_DT: "2026-07-05", SCH_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7510M-no3.png`, fullPage: true });

    expect(rows.length, "고충상담신청 역방향 기간 조회 (0건 확인, SCH_RQST_FRM_DT>SCH_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_7511M — 고충상담신청상세  |  API: POST /mis/gen/gen7511/getData.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_7511M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen7511/getData.do';
  const PGM_ID            = 'gen_7511M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`고충상담신청상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 고충상담신청상세 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 고충상담신청상세  액터: 개발자
   * URL: /mis/gen/gen7511/getData.do
   * 예상결과: 고충상담신청상세 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_7511M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 고충상담신청상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 고충상담신청상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7511M-no1.png`, fullPage: true });

    expect(rows.length, "고충상담신청상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_7600M — 일정목록  |  API: POST /mis/gen/gen5120/getCtnyRqstList.do  |  TC 4건  |  ds:ds_list
// TODO(menuId): gen_7600M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen5120/getCtnyRqstList.do';
  const PGM_ID            = 'gen_7600M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_CNTN_RQST_FRM_DT', 'SCH_CNTN_RQST_TO_DT', 'SCH_CNTN_NM', 'SCH_EMP_NM', 'SCH_EMP_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`일정목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 일정목록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 일정목록  액터: 개발자
   * URL: /mis/gen/gen5120/getCtnyRqstList.do
   * 예상결과: 일정목록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_7600M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 일정목록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 일정목록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7600M-no1.png`, fullPage: true });

    expect(rows.length, "일정목록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 일정목록 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 일정목록  액터: 개발자
   * URL: /mis/gen/gen5120/getCtnyRqstList.do
   * 예상결과: 지정 기간(2026-01-01~2026-07-05)의 일정목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_7600M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:2] 일정목록 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 일정목록 - 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_CNTN_RQST_FRM_DT\":\"2026-01-01\",\"SCH_CNTN_RQST_TO_DT\":\"2026-07-05\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_RQST_FRM_DT: "2026-01-01", SCH_CNTN_RQST_TO_DT: "2026-07-05" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7600M-no2.png`, fullPage: true });

    expect(rows.length, "일정목록 기간 조회 (SCH_CNTN_RQST_FRM_DT~SCH_CNTN_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 일정목록 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)
   * 중분류:   소분류:   메뉴명: 일정목록  액터: 개발자
   * URL: /mis/gen/gen5120/getCtnyRqstList.do
   * 예상결과: 시작일이 종료일보다 이후이므로 조회 결과가 0건이다.
   * DB 확인: -- TODO(gen_7600M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:3] 일정목록 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 일정목록 - 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT)");
    logInput('검색조건', "{\"SCH_CNTN_RQST_FRM_DT\":\"2026-07-05\",\"SCH_CNTN_RQST_TO_DT\":\"2026-01-01\"}");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_RQST_FRM_DT: "2026-07-05", SCH_CNTN_RQST_TO_DT: "2026-01-01" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7600M-no3.png`, fullPage: true });

    expect(rows.length, "일정목록 역방향 기간 조회 (0건 확인, SCH_CNTN_RQST_FRM_DT>SCH_CNTN_RQST_TO_DT) 0건 기대").toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 일정목록 - 키워드 검색 (SCH_CNTN_NM)
   * 중분류:   소분류:   메뉴명: 일정목록  액터: 개발자
   * URL: /mis/gen/gen5120/getCtnyRqstList.do
   * 예상결과: SCH_CNTN_NM에 '테스트'가 포함된 일정목록 목록이 조회된다.
   * DB 확인: -- TODO(gen_7600M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:4] 일정목록 - 키워드 검색 (SCH_CNTN_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 일정목록 - 키워드 검색 (SCH_CNTN_NM)");
    logInput("SCH_CNTN_NM", "테스트");

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CNTN_NM: "테스트" }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7600M-no4.png`, fullPage: true });

    expect(rows.length, "일정목록 키워드 검색 (SCH_CNTN_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_7610M — 일정등록대상자관리  |  API: POST /mis/gen/gen6005/getGenUsbPchrgMngList.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_7610M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen6005/getGenUsbPchrgMngList.do';
  const PGM_ID            = 'gen_7610M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_USB_USE_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`일정등록대상자관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 일정등록대상자관리 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 일정등록대상자관리  액터: 개발자
   * URL: /mis/gen/gen6005/getGenUsbPchrgMngList.do
   * 예상결과: 일정등록대상자관리 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_7610M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 일정등록대상자관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 일정등록대상자관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7610M-no1.png`, fullPage: true });

    expect(rows.length, "일정등록대상자관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// gen_7620M — 일정등록  |  API: POST /mis/gen/gen6005/getGenUsbPchrgMngList.do  |  TC 1건  |  ds:ds_list
// TODO(menuId): gen_7620M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/gen/gen6005/getGenUsbPchrgMngList.do';
  const PGM_ID            = 'gen_7620M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = 'ds_list';
  const DS_SEARCH_COLUMNS = ['SCH_USB_USE_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`일정등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 일정등록 - 전체 조회 (조건 없음)
   * 중분류:   소분류:   메뉴명: 일정등록  액터: 개발자
   * URL: /mis/gen/gen6005/getGenUsbPchrgMngList.do
   * 예상결과: 일정등록 목록이 조회된다. (총 N건)
   * DB 확인: -- TODO(gen_7620M): 대상 테이블 미확정(DAO 소스 접근 불가). COUNT 쿼리 수동 작성 필요
   */
  test("[no:1] 일정등록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 일정등록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen_7620M-no1.png`, fullPage: true });

    expect(rows.length, "일정등록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}
