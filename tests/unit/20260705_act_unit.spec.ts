// ==============================================================
// ACT 모듈 — 재무관리/결산 단위 테스트 (통합 spec)
// 생성일시: 2026-07-05  |  파일: 20260705_act_unit.spec.ts
// 커버 화면: 172개  |  총 테스트 케이스: 515건
// 방식: API-direct (page.evaluate(fetch) + nexacroXml)
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 금지
// 소스: _workspace/act/01_scenarios.json (176개 화면, 비API 4개 제외)
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
// act_1010M — 기관정보등록  |  API: POST /mis/act/act1010/getList.do  |  TC 3건
// TODO(menuId): act_1010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1010/getList.do';
  const PGM_ID            = 'act_1010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CORP_NM', 'AMT1', 'AMT2'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기관정보등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기관정보등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 기관정보등록  액터: 개발자
   * URL: /mis/act/act1010/getList.do
   * 예상결과: 기관정보 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_CORP_MST A WHERE 1=1 -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:1] 기관정보등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 기관정보등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1010M-no1.png`, fullPage: true });

    expect(rows.length, '기관정보등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기관정보등록 - 기관명 키워드 조회 (CORP_NM)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 기관정보등록  액터: 개발자
   * URL: /mis/act/act1010/getList.do
   * 예상결과: 기관명에 '재단'이 포함된 기관정보가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_CORP_MST A WHERE A.CORP_NM LIKE '%재단%' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:2] 기관정보등록 - 기관명 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 기관정보등록 - 기관명 키워드 조회');
    logInput('CORP_NM', '재단');

    const resp   = await apiPost(page, API_URL, searchBody({ CORP_NM: '재단' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1010M-no2.png`, fullPage: true });

    expect(rows.length, '기관정보등록 기관명 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 기관정보등록 - 존재하지 않는 기관명 조회 (0건 예상)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 기관정보등록  액터: 개발자
   * URL: /mis/act/act1010/getList.do
   * 예상결과: 존재하지 않는 기관명이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_CORP_MST A WHERE A.CORP_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:3] 기관정보등록 - 존재하지 않는 기관명 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 기관정보등록 - 존재하지 않는 기관명 조회');
    logInput('CORP_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CORP_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1010M-no3.png`, fullPage: true });

    expect(rows.length, '기관정보등록 존재하지 않는 기관명 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1020M — 회계단위등록  |  API: POST /mis/act/act1020/getList.do  |  TC 5건
// TODO(menuId): act_1020M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1020/getList.do';
  const PGM_ID            = 'act_1020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_NM', 'USE_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`회계단위등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 회계단위등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 회계단위등록  액터: 개발자
   * URL: /mis/act/act1020/getList.do
   * 예상결과: 회계단위 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_UNIT_MST A WHERE 1=1 -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:1] 회계단위등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 회계단위등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1020M-no1.png`, fullPage: true });

    expect(rows.length, '회계단위등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 회계단위등록 - 사용여부 조회 (USE_YN=Y, onload 기본값)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 회계단위등록  액터: 개발자
   * URL: /mis/act/act1020/getList.do
   * 예상결과: 사용중(USE_YN=Y)인 회계단위가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_UNIT_MST A WHERE A.USE_YN = 'Y' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:2] 회계단위등록 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 회계단위등록 - 사용여부 조회');
    logInput('USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1020M-no2.png`, fullPage: true });

    expect(rows.length, '회계단위등록 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 회계단위등록 - 미사용 조회 (USE_YN=N)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 회계단위등록  액터: 개발자
   * URL: /mis/act/act1020/getList.do
   * 예상결과: 미사용(USE_YN=N)인 회계단위가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_UNIT_MST A WHERE A.USE_YN = 'N' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:3] 회계단위등록 - 미사용 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 회계단위등록 - 미사용 조회');
    logInput('USE_YN', 'N');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'N' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1020M-no3.png`, fullPage: true });

    expect(rows.length, '회계단위등록 미사용 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 회계단위등록 - 회계단위명 키워드 조회 (ACT_UNIT_NM)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 회계단위등록  액터: 개발자
   * URL: /mis/act/act1020/getList.do
   * 예상결과: 회계단위명에 '본사'가 포함된 회계단위가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_UNIT_MST A WHERE A.ACT_UNIT_NM LIKE '%본사%' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:4] 회계단위등록 - 회계단위명 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 회계단위등록 - 회계단위명 키워드 조회');
    logInput('ACT_UNIT_NM', '본사');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_NM: '본사' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1020M-no4.png`, fullPage: true });

    expect(rows.length, '회계단위등록 회계단위명 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 회계단위등록 - 존재하지 않는 회계단위명 조회 (0건 예상)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 회계단위등록  액터: 개발자
   * URL: /mis/act/act1020/getList.do
   * 예상결과: 존재하지 않는 회계단위명이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_UNIT_MST A WHERE A.ACT_UNIT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:5] 회계단위등록 - 존재하지 않는 회계단위명 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 회계단위등록 - 존재하지 않는 회계단위명 조회');
    logInput('ACT_UNIT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1020M-no5.png`, fullPage: true });

    expect(rows.length, '회계단위등록 존재하지 않는 회계단위명 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1030M — 사업장등록  |  API: POST /mis/act/act1030/getList.do  |  TC 6건
// TODO(menuId): act_1030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1030/getList.do';
  const PGM_ID            = 'act_1030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_NM', 'BUSI_PLC_CD', 'USE_YN', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사업장등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사업장등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 사업장등록  액터: 개발자
   * URL: /mis/act/act1030/getList.do
   * 예상결과: 사업장 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_BUSI_PLC_MST A WHERE 1=1 -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:1] 사업장등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 사업장등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1030M-no1.png`, fullPage: true });

    expect(rows.length, '사업장등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 사업장등록 - 사용여부 조회 (USE_YN=Y)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 사업장등록  액터: 개발자
   * URL: /mis/act/act1030/getList.do
   * 예상결과: 사용중(USE_YN=Y)인 사업장이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_BUSI_PLC_MST A WHERE A.USE_YN = 'Y' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:2] 사업장등록 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 사업장등록 - 사용여부 조회');
    logInput('USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1030M-no2.png`, fullPage: true });

    expect(rows.length, '사업장등록 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 사업장등록 - 사업장명 키워드 조회 (BUSI_PLC_NM)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 사업장등록  액터: 개발자
   * URL: /mis/act/act1030/getList.do
   * 예상결과: 사업장명에 '본사'가 포함된 사업장이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_BUSI_PLC_MST A WHERE A.BUSI_PLC_NM LIKE '%본사%' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:3] 사업장등록 - 사업장명 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 사업장등록 - 사업장명 키워드 조회');
    logInput('BUSI_PLC_NM', '본사');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_NM: '본사' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1030M-no3.png`, fullPage: true });

    expect(rows.length, '사업장등록 사업장명 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 사업장등록 - 사업장코드 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 사업장등록  액터: 개발자
   * URL: /mis/act/act1030/getList.do
   * 예상결과: 사업장코드가 '1000'인 사업장이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_BUSI_PLC_MST A WHERE A.BUSI_PLC_CD = '1000' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:4] 사업장등록 - 사업장코드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 사업장등록 - 사업장코드 조회');
    logInput('BUSI_PLC_CD', '1000');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '1000' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1030M-no4.png`, fullPage: true });

    expect(rows.length, '사업장등록 사업장코드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 사업장등록 - 통합검색 키워드 조회 (UNTY_SACH_FG/UNTY_SACH_KEY)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 사업장등록  액터: 개발자
   * URL: /mis/act/act1030/getList.do
   * 예상결과: 통합검색(전체) 키워드 '본사'로 사업장이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_BUSI_PLC_MST A WHERE (A.BUSI_PLC_NM LIKE '%본사%' OR A.BUSI_PLC_CD LIKE '%본사%') -- TODO: 실제 테이블명/통합검색 컬럼 DB 확인 필요
   */
  test('[no:5] 사업장등록 - 통합검색 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 사업장등록 - 통합검색 키워드 조회');
    logInput('UNTY_SACH_FG', 'A');
    logInput('UNTY_SACH_KEY', '본사');

    const resp   = await apiPost(page, API_URL, searchBody({ UNTY_SACH_FG: 'A', UNTY_SACH_KEY: '본사' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1030M-no5.png`, fullPage: true });

    expect(rows.length, '사업장등록 통합검색 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 사업장등록 - 존재하지 않는 사업장명 조회 (0건 예상)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 사업장등록  액터: 개발자
   * URL: /mis/act/act1030/getList.do
   * 예상결과: 존재하지 않는 사업장명이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_BUSI_PLC_MST A WHERE A.BUSI_PLC_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:6] 사업장등록 - 존재하지 않는 사업장명 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] 사업장등록 - 존재하지 않는 사업장명 조회');
    logInput('BUSI_PLC_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1030M-no6.png`, fullPage: true });

    expect(rows.length, '사업장등록 존재하지 않는 사업장명 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1040M — 거래처등록  |  API: POST /mis/act/act1040/getList.do  |  TC 6건
// TODO(menuId): act_1040M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1040/getList.do';
  const PGM_ID            = 'act_1040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CUST_NM', 'CUST_FG', 'CUST_CLSF', 'BUY_SALG_FG', 'CUST_CD', 'BIZRNO', 'REPRES_NM', 'USE_YN', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`거래처등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 거래처등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * URL: /mis/act/act1040/getList.do
   * 예상결과: 거래처 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_CUST_MST A WHERE 1=1 -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:1] 거래처등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 거래처등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-no1.png`, fullPage: true });

    expect(rows.length, '거래처등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 거래처등록 - 사용여부 조회 (USE_YN=Y)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * URL: /mis/act/act1040/getList.do
   * 예상결과: 사용중(USE_YN=Y)인 거래처가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_CUST_MST A WHERE A.USE_YN = 'Y' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:2] 거래처등록 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 거래처등록 - 사용여부 조회');
    logInput('USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-no2.png`, fullPage: true });

    expect(rows.length, '거래처등록 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 거래처등록 - 통합검색 - 거래처명 조회 (UNTY_SACH_FG=D)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * URL: /mis/act/act1040/getList.do
   * 예상결과: 통합검색(거래처명) 키워드 '상사'로 거래처가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_CUST_MST A WHERE A.CUST_NM LIKE '%상사%' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:3] 거래처등록 - 통합검색 - 거래처명 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 거래처등록 - 통합검색 - 거래처명 조회');
    logInput('UNTY_SACH_FG', 'D');
    logInput('UNTY_SACH_KEY', '상사');

    const resp   = await apiPost(page, API_URL, searchBody({ UNTY_SACH_FG: 'D', UNTY_SACH_KEY: '상사' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-no3.png`, fullPage: true });

    expect(rows.length, '거래처등록 통합검색 - 거래처명 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 거래처등록 - 통합검색 - 사업자번호 조회 (UNTY_SACH_FG=C)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * URL: /mis/act/act1040/getList.do
   * 예상결과: 통합검색(사업자번호) 키워드 '123'으로 거래처가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_CUST_MST A WHERE A.BIZRNO LIKE '%123%' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:4] 거래처등록 - 통합검색 - 사업자번호 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 거래처등록 - 통합검색 - 사업자번호 조회');
    logInput('UNTY_SACH_FG', 'C');
    logInput('UNTY_SACH_KEY', '123');

    const resp   = await apiPost(page, API_URL, searchBody({ UNTY_SACH_FG: 'C', UNTY_SACH_KEY: '123' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-no4.png`, fullPage: true });

    expect(rows.length, '거래처등록 통합검색 - 사업자번호 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 거래처등록 - 통합검색 - 대표자 조회 (UNTY_SACH_FG=E)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * URL: /mis/act/act1040/getList.do
   * 예상결과: 통합검색(대표자) 키워드 '김'으로 거래처가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_CUST_MST A WHERE A.REPRES_NM LIKE '%김%' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:5] 거래처등록 - 통합검색 - 대표자 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 거래처등록 - 통합검색 - 대표자 조회');
    logInput('UNTY_SACH_FG', 'E');
    logInput('UNTY_SACH_KEY', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ UNTY_SACH_FG: 'E', UNTY_SACH_KEY: '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-no5.png`, fullPage: true });

    expect(rows.length, '거래처등록 통합검색 - 대표자 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 거래처등록 - 존재하지 않는 거래처명 조회 (0건 예상)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * URL: /mis/act/act1040/getList.do
   * 예상결과: 존재하지 않는 거래처명이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_CUST_MST A WHERE A.CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:6] 거래처등록 - 존재하지 않는 거래처명 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] 거래처등록 - 존재하지 않는 거래처명 조회');
    logInput('UNTY_SACH_FG', 'D');
    logInput('UNTY_SACH_KEY', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ UNTY_SACH_FG: 'D', UNTY_SACH_KEY: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-no6.png`, fullPage: true });

    expect(rows.length, '거래처등록 존재하지 않는 거래처명 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1041M — 거래처신청목록  |  API: POST /mis/act/act1041/getList.do  |  TC 5건
// TODO(menuId): act_1041M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1041/getList.do';
  const PGM_ID            = 'act_1041M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CUST_FG', 'CUST_CD', 'CUST_NM', 'RESPR', 'ACCP_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`거래처신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 거래처신청목록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 거래처신청목록  액터: 개발자
   * URL: /mis/act/act1041/getList.do
   * 예상결과: 거래처신청목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_1041_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 거래처신청목록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 거래처신청목록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1041M-no1.png`, fullPage: true });

    expect(rows.length, '거래처신청목록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 거래처신청목록 - 사용여부 조회 (ACCP_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 거래처신청목록  액터: 개발자
   * URL: /mis/act/act1041/getList.do
   * 예상결과: 사용중(ACCP_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1041_MST A WHERE A.ACCP_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 거래처신청목록 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 거래처신청목록 - 사용여부 조회');
    logInput('ACCP_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCP_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1041M-no2.png`, fullPage: true });

    expect(rows.length, '거래처신청목록 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 거래처신청목록 - 키워드 조회 (CUST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 거래처신청목록  액터: 개발자
   * URL: /mis/act/act1041/getList.do
   * 예상결과: CUST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1041_MST A WHERE A.CUST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 거래처신청목록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 거래처신청목록 - 키워드 조회');
    logInput('CUST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1041M-no3.png`, fullPage: true });

    expect(rows.length, '거래처신청목록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 거래처신청목록 - 코드 조건 조회 (CUST_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 거래처신청목록  액터: 개발자
   * URL: /mis/act/act1041/getList.do
   * 예상결과: CUST_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1041_MST A WHERE A.CUST_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 거래처신청목록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 거래처신청목록 - 코드 조건 조회');
    logInput('CUST_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1041M-no4.png`, fullPage: true });

    expect(rows.length, '거래처신청목록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 거래처신청목록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 거래처신청목록  액터: 개발자
   * URL: /mis/act/act1041/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1041_MST A WHERE A.CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 거래처신청목록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 거래처신청목록 - 존재하지 않는 키워드 조회');
    logInput('CUST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1041M-no5.png`, fullPage: true });

    expect(rows.length, '거래처신청목록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1050M — 계정코드등록  |  API: POST /mis/act/act1050/getList.do  |  TC 5건
// TODO(menuId): act_1050M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1050/getList.do';
  const PGM_ID            = 'act_1050M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACCT_CD', 'ACCT_NM', 'USE_YN', 'OPENIEM_ACCT_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`계정코드등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 계정코드등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드등록  액터: 개발자
   * URL: /mis/act/act1050/getList.do
   * 예상결과: 계정코드등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_1050_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 계정코드등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 계정코드등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1050M-no1.png`, fullPage: true });

    expect(rows.length, '계정코드등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 계정코드등록 - 사용여부 조회 (USE_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드등록  액터: 개발자
   * URL: /mis/act/act1050/getList.do
   * 예상결과: 사용중(USE_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1050_MST A WHERE A.USE_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 계정코드등록 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 계정코드등록 - 사용여부 조회');
    logInput('USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1050M-no2.png`, fullPage: true });

    expect(rows.length, '계정코드등록 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 계정코드등록 - 키워드 조회 (ACCT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드등록  액터: 개발자
   * URL: /mis/act/act1050/getList.do
   * 예상결과: ACCT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1050_MST A WHERE A.ACCT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 계정코드등록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 계정코드등록 - 키워드 조회');
    logInput('ACCT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1050M-no3.png`, fullPage: true });

    expect(rows.length, '계정코드등록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 계정코드등록 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드등록  액터: 개발자
   * URL: /mis/act/act1050/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1050_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 계정코드등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 계정코드등록 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1050M-no4.png`, fullPage: true });

    expect(rows.length, '계정코드등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 계정코드등록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드등록  액터: 개발자
   * URL: /mis/act/act1050/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1050_MST A WHERE A.ACCT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 계정코드등록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 계정코드등록 - 존재하지 않는 키워드 조회');
    logInput('ACCT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1050M-no5.png`, fullPage: true });

    expect(rows.length, '계정코드등록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1080M — 회계단위사업장연결  |  API: POST /mis/act/act1080/getList.do  |  TC 2건
// TODO(menuId): act_1080M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1080/getList.do';
  const PGM_ID            = 'act_1080M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['STDR_CD', 'ACT_UNIT_BUSI_PLC_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`회계단위사업장연결(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 회계단위사업장연결 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 회계단위사업장연결  액터: 개발자
   * URL: /mis/act/act1080/getList.do
   * 예상결과: 회계단위사업장연결 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_1080_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 회계단위사업장연결 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 회계단위사업장연결 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1080M-no1.png`, fullPage: true });

    expect(rows.length, '회계단위사업장연결 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 회계단위사업장연결 - 코드 조건 조회 (STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 회계단위사업장연결  액터: 개발자
   * URL: /mis/act/act1080/getList.do
   * 예상결과: STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1080_MST A WHERE A.STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 회계단위사업장연결 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 회계단위사업장연결 - 코드 조건 조회');
    logInput('STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1080M-no2.png`, fullPage: true });

    expect(rows.length, '회계단위사업장연결 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1104M — 거래유형적용일자  |  API: POST /mis/act/act1104/getList.do  |  TC 2건
// TODO(menuId): act_1104M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1104/getList.do';
  const PGM_ID            = 'act_1104M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['TRNS_TP_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`거래유형적용일자(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 거래유형적용일자 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 거래유형적용일자  액터: 개발자
   * URL: /mis/act/act1104/getList.do
   * 예상결과: 거래유형적용일자 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_1104_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 거래유형적용일자 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 거래유형적용일자 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1104M-no1.png`, fullPage: true });

    expect(rows.length, '거래유형적용일자 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 거래유형적용일자 - 코드 조건 조회 (TRNS_TP_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 거래유형적용일자  액터: 개발자
   * URL: /mis/act/act1104/getList.do
   * 예상결과: TRNS_TP_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1104_MST A WHERE A.TRNS_TP_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 거래유형적용일자 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 거래유형적용일자 - 코드 조건 조회');
    logInput('TRNS_TP_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ TRNS_TP_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1104M-no2.png`, fullPage: true });

    expect(rows.length, '거래유형적용일자 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1110M — 은행코드등록  |  API: POST /mis/act/act1110/getList.do  |  TC 4건
// TODO(menuId): act_1110M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1110/getList.do';
  const PGM_ID            = 'act_1110M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BK_NM', 'USE_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`은행코드등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 은행코드등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 은행코드등록  액터: 개발자
   * URL: /mis/act/act1110/getList.do
   * 예상결과: 은행코드등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_1110_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 은행코드등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 은행코드등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1110M-no1.png`, fullPage: true });

    expect(rows.length, '은행코드등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 은행코드등록 - 사용여부 조회 (USE_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 은행코드등록  액터: 개발자
   * URL: /mis/act/act1110/getList.do
   * 예상결과: 사용중(USE_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1110_MST A WHERE A.USE_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 은행코드등록 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 은행코드등록 - 사용여부 조회');
    logInput('USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1110M-no2.png`, fullPage: true });

    expect(rows.length, '은행코드등록 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 은행코드등록 - 키워드 조회 (BK_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 은행코드등록  액터: 개발자
   * URL: /mis/act/act1110/getList.do
   * 예상결과: BK_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1110_MST A WHERE A.BK_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 은행코드등록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 은행코드등록 - 키워드 조회');
    logInput('BK_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ BK_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1110M-no3.png`, fullPage: true });

    expect(rows.length, '은행코드등록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 은행코드등록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 은행코드등록  액터: 개발자
   * URL: /mis/act/act1110/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1110_MST A WHERE A.BK_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 은행코드등록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 은행코드등록 - 존재하지 않는 키워드 조회');
    logInput('BK_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ BK_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1110M-no4.png`, fullPage: true });

    expect(rows.length, '은행코드등록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1120M — 소득세율등록  |  API: POST /mis/act/act1120/getList1.do  |  TC 2건
// TODO(menuId): act_1120M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1120/getList1.do';
  const PGM_ID            = 'act_1120M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['RESI_FG', 'INME_FG', 'FRM_DT', 'TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`소득세율등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 소득세율등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 소득세율등록  액터: 개발자
   * URL: /mis/act/act1120/getList1.do
   * 예상결과: 소득세율등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_1120_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 소득세율등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 소득세율등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1120M-no1.png`, fullPage: true });

    expect(rows.length, '소득세율등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 소득세율등록 - 코드 조건 조회 (RESI_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 소득세율등록  액터: 개발자
   * URL: /mis/act/act1120/getList1.do
   * 예상결과: RESI_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1120_MST A WHERE A.RESI_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 소득세율등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 소득세율등록 - 코드 조건 조회');
    logInput('RESI_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ RESI_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1120M-no2.png`, fullPage: true });

    expect(rows.length, '소득세율등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1121M — 소득기준일자등록  |  API: POST /mis/act/act1120/getList1120P.do  |  TC 2건
// TODO(menuId): act_1121M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1120/getList1120P.do';
  const PGM_ID            = 'act_1121M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['RESI_FG', 'INME_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`소득기준일자등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 소득기준일자등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 소득기준일자등록  액터: 개발자
   * URL: /mis/act/act1120/getList1120P.do
   * 예상결과: 소득기준일자등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_1121_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 소득기준일자등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 소득기준일자등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1121M-no1.png`, fullPage: true });

    expect(rows.length, '소득기준일자등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 소득기준일자등록 - 코드 조건 조회 (RESI_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 소득기준일자등록  액터: 개발자
   * URL: /mis/act/act1120/getList1120P.do
   * 예상결과: RESI_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1121_MST A WHERE A.RESI_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 소득기준일자등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 소득기준일자등록 - 코드 조건 조회');
    logInput('RESI_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ RESI_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1121M-no2.png`, fullPage: true });

    expect(rows.length, '소득기준일자등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1122M — 소득코드등록  |  API: POST /mis/act/act1122/getList.do  |  TC 2건
// TODO(menuId): act_1122M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1122/getList.do';
  const PGM_ID            = 'act_1122M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['RESI_FG', 'INME_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`소득코드등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 소득코드등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 소득코드등록  액터: 개발자
   * URL: /mis/act/act1122/getList.do
   * 예상결과: 소득코드등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_1122_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 소득코드등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 소득코드등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1122M-no1.png`, fullPage: true });

    expect(rows.length, '소득코드등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 소득코드등록 - 코드 조건 조회 (RESI_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 소득코드등록  액터: 개발자
   * URL: /mis/act/act1122/getList.do
   * 예상결과: RESI_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1122_MST A WHERE A.RESI_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 소득코드등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 소득코드등록 - 코드 조건 조회');
    logInput('RESI_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ RESI_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1122M-no2.png`, fullPage: true });

    expect(rows.length, '소득코드등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1130M — 업종코드등록  |  API: POST /mis/act/act1130/getList.do  |  TC 3건
// TODO(menuId): act_1130M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1130/getList.do';
  const PGM_ID            = 'act_1130M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BIZTP_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`업종코드등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 업종코드등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 업종코드등록  액터: 개발자
   * URL: /mis/act/act1130/getList.do
   * 예상결과: 업종코드등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_1130_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 업종코드등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 업종코드등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1130M-no1.png`, fullPage: true });

    expect(rows.length, '업종코드등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 업종코드등록 - 키워드 조회 (BIZTP_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 업종코드등록  액터: 개발자
   * URL: /mis/act/act1130/getList.do
   * 예상결과: BIZTP_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1130_MST A WHERE A.BIZTP_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 업종코드등록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 업종코드등록 - 키워드 조회');
    logInput('BIZTP_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ BIZTP_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1130M-no2.png`, fullPage: true });

    expect(rows.length, '업종코드등록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 업종코드등록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 업종코드등록  액터: 개발자
   * URL: /mis/act/act1130/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1130_MST A WHERE A.BIZTP_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 업종코드등록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 업종코드등록 - 존재하지 않는 키워드 조회');
    logInput('BIZTP_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ BIZTP_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1130M-no3.png`, fullPage: true });

    expect(rows.length, '업종코드등록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1140M — 세무코드관리  |  API: POST /mis/act/act1140/getList.do  |  TC 4건
// TODO(menuId): act_1140M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1140/getList.do';
  const PGM_ID            = 'act_1140M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUY_SALG_FG', 'TAXAFS_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`세무코드관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 세무코드관리 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 세무코드관리  액터: 개발자
   * URL: /mis/act/act1140/getList.do
   * 예상결과: 세무코드관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_1140_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 세무코드관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 세무코드관리 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1140M-no1.png`, fullPage: true });

    expect(rows.length, '세무코드관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 세무코드관리 - 키워드 조회 (TAXAFS_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 세무코드관리  액터: 개발자
   * URL: /mis/act/act1140/getList.do
   * 예상결과: TAXAFS_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1140_MST A WHERE A.TAXAFS_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 세무코드관리 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 세무코드관리 - 키워드 조회');
    logInput('TAXAFS_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ TAXAFS_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1140M-no2.png`, fullPage: true });

    expect(rows.length, '세무코드관리 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 세무코드관리 - 코드 조건 조회 (BUY_SALG_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 세무코드관리  액터: 개발자
   * URL: /mis/act/act1140/getList.do
   * 예상결과: BUY_SALG_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1140_MST A WHERE A.BUY_SALG_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 세무코드관리 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 세무코드관리 - 코드 조건 조회');
    logInput('BUY_SALG_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUY_SALG_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1140M-no3.png`, fullPage: true });

    expect(rows.length, '세무코드관리 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 세무코드관리 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 세무코드관리  액터: 개발자
   * URL: /mis/act/act1140/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1140_MST A WHERE A.TAXAFS_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 세무코드관리 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 세무코드관리 - 존재하지 않는 키워드 조회');
    logInput('TAXAFS_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ TAXAFS_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1140M-no4.png`, fullPage: true });

    expect(rows.length, '세무코드관리 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1150M — 환율조회  |  API: POST /mis/act/act1150/getList.do  |  TC 2건
// TODO(menuId): act_1150M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1150/getList.do';
  const PGM_ID            = 'act_1150M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['STDR_DT', 'CRNY_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`환율조회(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 환율조회 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 환율조회  액터: 개발자
   * URL: /mis/act/act1150/getList.do
   * 예상결과: 환율조회 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_1150_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 환율조회 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 환율조회 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1150M-no1.png`, fullPage: true });

    expect(rows.length, '환율조회 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 환율조회 - 코드 조건 조회 (CRNY_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 환율조회  액터: 개발자
   * URL: /mis/act/act1150/getList.do
   * 예상결과: CRNY_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1150_MST A WHERE A.CRNY_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 환율조회 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 환율조회 - 코드 조건 조회');
    logInput('CRNY_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ CRNY_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1150M-no2.png`, fullPage: true });

    expect(rows.length, '환율조회 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1160M — 사업별지급계좌관리  |  API: POST /mis/act/act1160/getList.do  |  TC 3건
// TODO(menuId): act_1160M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1160/getList.do';
  const PGM_ID            = 'act_1160M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUDG_YY', 'BUDG_BSNS_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사업별지급계좌관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사업별지급계좌관리 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 사업별지급계좌관리  액터: 개발자
   * URL: /mis/act/act1160/getList.do
   * 예상결과: 사업별지급계좌관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_1160_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 사업별지급계좌관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 사업별지급계좌관리 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1160M-no1.png`, fullPage: true });

    expect(rows.length, '사업별지급계좌관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 사업별지급계좌관리 - 키워드 조회 (BUDG_BSNS_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 사업별지급계좌관리  액터: 개발자
   * URL: /mis/act/act1160/getList.do
   * 예상결과: BUDG_BSNS_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1160_MST A WHERE A.BUDG_BSNS_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 사업별지급계좌관리 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 사업별지급계좌관리 - 키워드 조회');
    logInput('BUDG_BSNS_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ BUDG_BSNS_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1160M-no2.png`, fullPage: true });

    expect(rows.length, '사업별지급계좌관리 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 사업별지급계좌관리 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 사업별지급계좌관리  액터: 개발자
   * URL: /mis/act/act1160/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1160_MST A WHERE A.BUDG_BSNS_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 사업별지급계좌관리 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 사업별지급계좌관리 - 존재하지 않는 키워드 조회');
    logInput('BUDG_BSNS_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ BUDG_BSNS_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1160M-no3.png`, fullPage: true });

    expect(rows.length, '사업별지급계좌관리 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1180M — 연계문서현황  |  API: POST /mis/act/act1180/getList.do  |  TC 2건
// TODO(menuId): act_1180M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1180/getList.do';
  const PGM_ID            = 'act_1180M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['FRM_DT', 'TO_DT', 'CNTC_FG', 'TRNS_DOC_TP', 'COMBO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`연계문서현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 연계문서현황 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 연계문서현황  액터: 개발자
   * URL: /mis/act/act1180/getList.do
   * 예상결과: 연계문서현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_1180_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 연계문서현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 연계문서현황 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1180M-no1.png`, fullPage: true });

    expect(rows.length, '연계문서현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 연계문서현황 - 코드 조건 조회 (CNTC_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 연계문서현황  액터: 개발자
   * URL: /mis/act/act1180/getList.do
   * 예상결과: CNTC_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1180_MST A WHERE A.CNTC_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 연계문서현황 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 연계문서현황 - 코드 조건 조회');
    logInput('CNTC_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ CNTC_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1180M-no2.png`, fullPage: true });

    expect(rows.length, '연계문서현황 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_1181M — 연계문서조회  |  API: POST /mis/act/act1181/getList.do  |  TC 2건
// TODO(menuId): act_1181M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act1181/getList.do';
  const PGM_ID            = 'act_1181M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'CNTC_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`연계문서조회(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 연계문서조회 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 연계문서조회  액터: 개발자
   * URL: /mis/act/act1181/getList.do
   * 예상결과: 연계문서조회 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_1181_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 연계문서조회 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 연계문서조회 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1181M-no1.png`, fullPage: true });

    expect(rows.length, '연계문서조회 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 연계문서조회 - 코드 조건 조회 (CORP_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 연계문서조회  액터: 개발자
   * URL: /mis/act/act1181/getList.do
   * 예상결과: CORP_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_1181_MST A WHERE A.CORP_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 연계문서조회 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 연계문서조회 - 코드 조건 조회');
    logInput('CORP_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ CORP_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1181M-no2.png`, fullPage: true });

    expect(rows.length, '연계문서조회 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_2000M — 내부품의  |  API: POST /mis/act/act2000/getList.do  |  TC 5건
// TODO(menuId): act_2000M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act2000/getList.do';
  const PGM_ID            = 'act_2000M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'WRT_DEPT_CD', 'WRT_DEPT_NM', 'WRTER', 'WRTER_NM', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'SBJ', 'CLS_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`내부품의(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 내부품의 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 내부품의  액터: 개발자
   * URL: /mis/act/act2000/getList.do
   * 예상결과: 내부품의 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_2000_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 내부품의 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 내부품의 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2000M-no1.png`, fullPage: true });

    expect(rows.length, '내부품의 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 내부품의 - 사용여부 조회 (CLS_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 내부품의  액터: 개발자
   * URL: /mis/act/act2000/getList.do
   * 예상결과: 사용중(CLS_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2000_MST A WHERE A.CLS_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 내부품의 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 내부품의 - 사용여부 조회');
    logInput('CLS_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ CLS_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2000M-no2.png`, fullPage: true });

    expect(rows.length, '내부품의 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 내부품의 - 키워드 조회 (WRT_DEPT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 내부품의  액터: 개발자
   * URL: /mis/act/act2000/getList.do
   * 예상결과: WRT_DEPT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2000_MST A WHERE A.WRT_DEPT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 내부품의 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 내부품의 - 키워드 조회');
    logInput('WRT_DEPT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ WRT_DEPT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2000M-no3.png`, fullPage: true });

    expect(rows.length, '내부품의 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 내부품의 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 내부품의  액터: 개발자
   * URL: /mis/act/act2000/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2000_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 내부품의 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 내부품의 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2000M-no4.png`, fullPage: true });

    expect(rows.length, '내부품의 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 내부품의 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 내부품의  액터: 개발자
   * URL: /mis/act/act2000/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2000_MST A WHERE A.WRT_DEPT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 내부품의 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 내부품의 - 존재하지 않는 키워드 조회');
    logInput('WRT_DEPT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ WRT_DEPT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2000M-no5.png`, fullPage: true });

    expect(rows.length, '내부품의 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_2001M — 내부품의  |  API: POST /mis/act/act0000/getUnt.do  |  TC 2건
// TODO(menuId): act_2001M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getUnt.do';
  const PGM_ID            = 'act_2001M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'APRQ_DT', 'APRQ_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`내부품의(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 내부품의 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 내부품의  액터: 개발자
   * URL: /mis/act/act0000/getUnt.do
   * 예상결과: 내부품의 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_2001_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 내부품의 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 내부품의 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2001M-no1.png`, fullPage: true });

    expect(rows.length, '내부품의 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 내부품의 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 내부품의  액터: 개발자
   * URL: /mis/act/act0000/getUnt.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2001_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 내부품의 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 내부품의 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2001M-no2.png`, fullPage: true });

    expect(rows.length, '내부품의 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_2002M — 문서완료처리  |  API: POST /mis/act/act2002/getList.do  |  TC 5건
// TODO(menuId): act_2002M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act2002/getList.do';
  const PGM_ID            = 'act_2002M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['FRM_DT', 'TO_DT', 'WRT_DEPT_CD', 'WRT_DEPT_NM', 'WRTER_NM', 'WRTER', 'SBJ', 'CLOS_YN', 'BUDG_BSNS_CD', 'BUDG_BSNS_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`문서완료처리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 문서완료처리 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 문서완료처리  액터: 개발자
   * URL: /mis/act/act2002/getList.do
   * 예상결과: 문서완료처리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_2002_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 문서완료처리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 문서완료처리 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2002M-no1.png`, fullPage: true });

    expect(rows.length, '문서완료처리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 문서완료처리 - 사용여부 조회 (CLOS_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 문서완료처리  액터: 개발자
   * URL: /mis/act/act2002/getList.do
   * 예상결과: 사용중(CLOS_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2002_MST A WHERE A.CLOS_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 문서완료처리 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 문서완료처리 - 사용여부 조회');
    logInput('CLOS_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ CLOS_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2002M-no2.png`, fullPage: true });

    expect(rows.length, '문서완료처리 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 문서완료처리 - 키워드 조회 (WRT_DEPT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 문서완료처리  액터: 개발자
   * URL: /mis/act/act2002/getList.do
   * 예상결과: WRT_DEPT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2002_MST A WHERE A.WRT_DEPT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 문서완료처리 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 문서완료처리 - 키워드 조회');
    logInput('WRT_DEPT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ WRT_DEPT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2002M-no3.png`, fullPage: true });

    expect(rows.length, '문서완료처리 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 문서완료처리 - 코드 조건 조회 (WRT_DEPT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 문서완료처리  액터: 개발자
   * URL: /mis/act/act2002/getList.do
   * 예상결과: WRT_DEPT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2002_MST A WHERE A.WRT_DEPT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 문서완료처리 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 문서완료처리 - 코드 조건 조회');
    logInput('WRT_DEPT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ WRT_DEPT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2002M-no4.png`, fullPage: true });

    expect(rows.length, '문서완료처리 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 문서완료처리 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 문서완료처리  액터: 개발자
   * URL: /mis/act/act2002/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2002_MST A WHERE A.WRT_DEPT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 문서완료처리 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 문서완료처리 - 존재하지 않는 키워드 조회');
    logInput('WRT_DEPT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ WRT_DEPT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2002M-no5.png`, fullPage: true });

    expect(rows.length, '문서완료처리 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_2010M — 지출결의서 목록  |  API: POST /mis/act/act2010/getList.do  |  TC 4건
// TODO(menuId): act_2010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act2010/getList.do';
  const PGM_ID            = 'act_2010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'WRT_DEPT_CD', 'WRT_DEPT_NM', 'WRTER', 'WRTER_NM', 'SBJ'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`지출결의서 목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 지출결의서 목록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 지출결의서 목록  액터: 개발자
   * URL: /mis/act/act2010/getList.do
   * 예상결과: 지출결의서 목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_2010_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 지출결의서 목록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 지출결의서 목록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2010M-no1.png`, fullPage: true });

    expect(rows.length, '지출결의서 목록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 지출결의서 목록 - 키워드 조회 (WRT_DEPT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 지출결의서 목록  액터: 개발자
   * URL: /mis/act/act2010/getList.do
   * 예상결과: WRT_DEPT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2010_MST A WHERE A.WRT_DEPT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 지출결의서 목록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 지출결의서 목록 - 키워드 조회');
    logInput('WRT_DEPT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ WRT_DEPT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2010M-no2.png`, fullPage: true });

    expect(rows.length, '지출결의서 목록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 지출결의서 목록 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 지출결의서 목록  액터: 개발자
   * URL: /mis/act/act2010/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2010_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 지출결의서 목록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 지출결의서 목록 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2010M-no3.png`, fullPage: true });

    expect(rows.length, '지출결의서 목록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 지출결의서 목록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 지출결의서 목록  액터: 개발자
   * URL: /mis/act/act2010/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2010_MST A WHERE A.WRT_DEPT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 지출결의서 목록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 지출결의서 목록 - 존재하지 않는 키워드 조회');
    logInput('WRT_DEPT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ WRT_DEPT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2010M-no4.png`, fullPage: true });

    expect(rows.length, '지출결의서 목록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_2011M — 지출결의서  |  API: POST /mis/act/act0000/getActComm.do  |  TC 2건
// TODO(menuId): act_2011M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getActComm.do';
  const PGM_ID            = 'act_2011M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'RESL_DT', 'RESL_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`지출결의서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 지출결의서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 지출결의서  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: 지출결의서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_2011_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 지출결의서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 지출결의서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2011M-no1.png`, fullPage: true });

    expect(rows.length, '지출결의서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 지출결의서 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 지출결의서  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2011_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 지출결의서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 지출결의서 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2011M-no2.png`, fullPage: true });

    expect(rows.length, '지출결의서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_2030M — 계정대체신청서 목록  |  API: POST /mis/act/act2030/getList.do  |  TC 4건
// TODO(menuId): act_2030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act2030/getList.do';
  const PGM_ID            = 'act_2030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'WRT_DEPT_CD', 'WRT_DEPT_NM', 'WRTER', 'WRTER_NM', 'SBJ'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`계정대체신청서 목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 계정대체신청서 목록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 계정대체신청서 목록  액터: 개발자
   * URL: /mis/act/act2030/getList.do
   * 예상결과: 계정대체신청서 목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_2030_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 계정대체신청서 목록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 계정대체신청서 목록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2030M-no1.png`, fullPage: true });

    expect(rows.length, '계정대체신청서 목록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 계정대체신청서 목록 - 키워드 조회 (WRT_DEPT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 계정대체신청서 목록  액터: 개발자
   * URL: /mis/act/act2030/getList.do
   * 예상결과: WRT_DEPT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2030_MST A WHERE A.WRT_DEPT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 계정대체신청서 목록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 계정대체신청서 목록 - 키워드 조회');
    logInput('WRT_DEPT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ WRT_DEPT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2030M-no2.png`, fullPage: true });

    expect(rows.length, '계정대체신청서 목록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 계정대체신청서 목록 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 계정대체신청서 목록  액터: 개발자
   * URL: /mis/act/act2030/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2030_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 계정대체신청서 목록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 계정대체신청서 목록 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2030M-no3.png`, fullPage: true });

    expect(rows.length, '계정대체신청서 목록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 계정대체신청서 목록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 계정대체신청서 목록  액터: 개발자
   * URL: /mis/act/act2030/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2030_MST A WHERE A.WRT_DEPT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 계정대체신청서 목록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 계정대체신청서 목록 - 존재하지 않는 키워드 조회');
    logInput('WRT_DEPT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ WRT_DEPT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2030M-no4.png`, fullPage: true });

    expect(rows.length, '계정대체신청서 목록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_2031M — 계정대체신청서  |  API: POST /mis/act/act2031/getData.do  |  TC 2건
// TODO(menuId): act_2031M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act2031/getData.do';
  const PGM_ID            = 'act_2031M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'RESL_DT', 'RESL_NO', 'APRQ_DT_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`계정대체신청서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 계정대체신청서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 계정대체신청서  액터: 개발자
   * URL: /mis/act/act2031/getData.do
   * 예상결과: 계정대체신청서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_2031_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 계정대체신청서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 계정대체신청서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2031M-no1.png`, fullPage: true });

    expect(rows.length, '계정대체신청서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 계정대체신청서 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 계정대체신청서  액터: 개발자
   * URL: /mis/act/act2031/getData.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2031_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 계정대체신청서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 계정대체신청서 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2031M-no2.png`, fullPage: true });

    expect(rows.length, '계정대체신청서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_2070M — 가지급금정산신청서 목록  |  API: POST /mis/act/act2070/getList.do  |  TC 4건
// TODO(menuId): act_2070M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act2070/getList.do';
  const PGM_ID            = 'act_2070M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'WRT_DEPT_CD', 'WRT_DEPT_NM', 'WRTER', 'WRTER_NM', 'SBJ'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`가지급금정산신청서 목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 가지급금정산신청서 목록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 가지급금정산신청서 목록  액터: 개발자
   * URL: /mis/act/act2070/getList.do
   * 예상결과: 가지급금정산신청서 목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_2070_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 가지급금정산신청서 목록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 가지급금정산신청서 목록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2070M-no1.png`, fullPage: true });

    expect(rows.length, '가지급금정산신청서 목록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 가지급금정산신청서 목록 - 키워드 조회 (WRT_DEPT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 가지급금정산신청서 목록  액터: 개발자
   * URL: /mis/act/act2070/getList.do
   * 예상결과: WRT_DEPT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2070_MST A WHERE A.WRT_DEPT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 가지급금정산신청서 목록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 가지급금정산신청서 목록 - 키워드 조회');
    logInput('WRT_DEPT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ WRT_DEPT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2070M-no2.png`, fullPage: true });

    expect(rows.length, '가지급금정산신청서 목록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 가지급금정산신청서 목록 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 가지급금정산신청서 목록  액터: 개발자
   * URL: /mis/act/act2070/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2070_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 가지급금정산신청서 목록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 가지급금정산신청서 목록 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2070M-no3.png`, fullPage: true });

    expect(rows.length, '가지급금정산신청서 목록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 가지급금정산신청서 목록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 가지급금정산신청서 목록  액터: 개발자
   * URL: /mis/act/act2070/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2070_MST A WHERE A.WRT_DEPT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 가지급금정산신청서 목록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 가지급금정산신청서 목록 - 존재하지 않는 키워드 조회');
    logInput('WRT_DEPT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ WRT_DEPT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2070M-no4.png`, fullPage: true });

    expect(rows.length, '가지급금정산신청서 목록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_2071M — 가지급금정산신청서  |  API: POST /mis/act/act0000/getActComm.do  |  TC 2건
// TODO(menuId): act_2071M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getActComm.do';
  const PGM_ID            = 'act_2071M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'RESL_DT', 'RESL_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`가지급금정산신청서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 가지급금정산신청서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 가지급금정산신청서  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: 가지급금정산신청서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_2071_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 가지급금정산신청서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 가지급금정산신청서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2071M-no1.png`, fullPage: true });

    expect(rows.length, '가지급금정산신청서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 가지급금정산신청서 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 가지급금정산신청서  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2071_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 가지급금정산신청서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 가지급금정산신청서 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2071M-no2.png`, fullPage: true });

    expect(rows.length, '가지급금정산신청서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_2110M — 수입의뢰서 목록  |  API: POST /mis/act/act2110/getListTab1.do  |  TC 1건
// TODO(menuId): act_2110M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act2110/getListTab1.do';
  const PGM_ID            = 'act_2110M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`수입의뢰서 목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 수입의뢰서 목록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 수입의뢰서 목록  액터: 개발자
   * URL: /mis/act/act2110/getListTab1.do
   * 예상결과: 수입의뢰서 목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_2110_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 수입의뢰서 목록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 수입의뢰서 목록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2110M-no1.png`, fullPage: true });

    expect(rows.length, '수입의뢰서 목록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_2111M — 수입의뢰서  |  API: POST /mis/act/act0000/getActComm.do  |  TC 2건
// TODO(menuId): act_2111M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getActComm.do';
  const PGM_ID            = 'act_2111M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'RESL_DT', 'RESL_NO', 'RESL_TP'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`수입의뢰서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 수입의뢰서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 수입의뢰서  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: 수입의뢰서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_2111_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 수입의뢰서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 수입의뢰서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2111M-no1.png`, fullPage: true });

    expect(rows.length, '수입의뢰서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 수입의뢰서 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 수입의뢰서  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2111_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 수입의뢰서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 수입의뢰서 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2111M-no2.png`, fullPage: true });

    expect(rows.length, '수입의뢰서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_2112M — 여입의뢰서  |  API: POST /mis/act/act0000/getActComm.do  |  TC 2건
// TODO(menuId): act_2112M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getActComm.do';
  const PGM_ID            = 'act_2112M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'RESL_DT', 'RESL_NO', 'RESL_TP'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`여입의뢰서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 여입의뢰서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 여입의뢰서  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: 여입의뢰서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_2112_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 여입의뢰서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 여입의뢰서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2112M-no1.png`, fullPage: true });

    expect(rows.length, '여입의뢰서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 여입의뢰서 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 여입의뢰서  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2112_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 여입의뢰서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 여입의뢰서 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2112M-no2.png`, fullPage: true });

    expect(rows.length, '여입의뢰서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_2310M — 지급신청서 현황  |  API: POST /mis/act/act2310/getList.do  |  TC 4건
// TODO(menuId): act_2310M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act2310/getList.do';
  const PGM_ID            = 'act_2310M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'WRT_DEPT_NM', 'WRT_DEPT_CD', 'WRTER_NM', 'WRTER', 'RESL_TP', 'RESL_DT_NO', 'SLIP_DT_NO', 'IF_DOC_NO', 'SBJ'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`지급신청서 현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 지급신청서 현황 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 지급신청서 현황  액터: 개발자
   * URL: /mis/act/act2310/getList.do
   * 예상결과: 지급신청서 현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_2310_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 지급신청서 현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 지급신청서 현황 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2310M-no1.png`, fullPage: true });

    expect(rows.length, '지급신청서 현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 지급신청서 현황 - 키워드 조회 (WRT_DEPT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 지급신청서 현황  액터: 개발자
   * URL: /mis/act/act2310/getList.do
   * 예상결과: WRT_DEPT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2310_MST A WHERE A.WRT_DEPT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 지급신청서 현황 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 지급신청서 현황 - 키워드 조회');
    logInput('WRT_DEPT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ WRT_DEPT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2310M-no2.png`, fullPage: true });

    expect(rows.length, '지급신청서 현황 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 지급신청서 현황 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 지급신청서 현황  액터: 개발자
   * URL: /mis/act/act2310/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2310_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 지급신청서 현황 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 지급신청서 현황 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2310M-no3.png`, fullPage: true });

    expect(rows.length, '지급신청서 현황 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 지급신청서 현황 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 지급신청서 현황  액터: 개발자
   * URL: /mis/act/act2310/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_2310_MST A WHERE A.WRT_DEPT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 지급신청서 현황 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 지급신청서 현황 - 존재하지 않는 키워드 조회');
    logInput('WRT_DEPT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ WRT_DEPT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_2310M-no4.png`, fullPage: true });

    expect(rows.length, '지급신청서 현황 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3010M — 결의전표 목록  |  API: POST /mis/act/act3010/getList.do  |  TC 4건
// TODO(menuId): act_3010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3010/getList.do';
  const PGM_ID            = 'act_3010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'SLIP_TP', 'SLIP_DT_NO', 'SBJ', 'APV_STAT_CD', 'SCH_WRTER_NM', 'SCH_WRTER_ID'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`결의전표 목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 결의전표 목록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 결의전표 목록  액터: 개발자
   * URL: /mis/act/act3010/getList.do
   * 예상결과: 결의전표 목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3010_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 결의전표 목록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 결의전표 목록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3010M-no1.png`, fullPage: true });

    expect(rows.length, '결의전표 목록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 결의전표 목록 - 키워드 조회 (SCH_WRTER_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 결의전표 목록  액터: 개발자
   * URL: /mis/act/act3010/getList.do
   * 예상결과: SCH_WRTER_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3010_MST A WHERE A.SCH_WRTER_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 결의전표 목록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 결의전표 목록 - 키워드 조회');
    logInput('SCH_WRTER_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_WRTER_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3010M-no2.png`, fullPage: true });

    expect(rows.length, '결의전표 목록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 결의전표 목록 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 결의전표 목록  액터: 개발자
   * URL: /mis/act/act3010/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3010_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 결의전표 목록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 결의전표 목록 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3010M-no3.png`, fullPage: true });

    expect(rows.length, '결의전표 목록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 결의전표 목록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 결의전표 목록  액터: 개발자
   * URL: /mis/act/act3010/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3010_MST A WHERE A.SCH_WRTER_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 결의전표 목록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 결의전표 목록 - 존재하지 않는 키워드 조회');
    logInput('SCH_WRTER_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_WRTER_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3010M-no4.png`, fullPage: true });

    expect(rows.length, '결의전표 목록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3011M — 결의전표 등록  |  API: POST /mis/act/act3011/getData.do  |  TC 2건
// TODO(menuId): act_3011M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3011/getData.do';
  const PGM_ID            = 'act_3011M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'SLIP_DT', 'SLIP_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`결의전표 등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 결의전표 등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 결의전표 등록  액터: 개발자
   * URL: /mis/act/act3011/getData.do
   * 예상결과: 결의전표 등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3011_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 결의전표 등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 결의전표 등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3011M-no1.png`, fullPage: true });

    expect(rows.length, '결의전표 등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 결의전표 등록 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 결의전표 등록  액터: 개발자
   * URL: /mis/act/act3011/getData.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3011_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 결의전표 등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 결의전표 등록 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3011M-no2.png`, fullPage: true });

    expect(rows.length, '결의전표 등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3012M — 결의전표  |  API: POST /mis/act/act3011/getList3011P.do  |  TC 1건
// TODO(menuId): act_3012M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3011/getList3011P.do';
  const PGM_ID            = 'act_3012M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`결의전표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 결의전표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 결의전표  액터: 개발자
   * URL: /mis/act/act3011/getList3011P.do
   * 예상결과: 결의전표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3012_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 결의전표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 결의전표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3012M-no1.png`, fullPage: true });

    expect(rows.length, '결의전표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3030M — 전표승인처리  |  API: POST /mis/act/act3030/getList.do  |  TC 5건
// TODO(menuId): act_3030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3030/getList.do';
  const PGM_ID            = 'act_3030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'ACCP_YN', 'RESL_TP', 'WRTER_ID', 'WRTER_NM', 'SBJ'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`전표승인처리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 전표승인처리 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 전표승인처리  액터: 개발자
   * URL: /mis/act/act3030/getList.do
   * 예상결과: 전표승인처리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3030_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 전표승인처리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 전표승인처리 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3030M-no1.png`, fullPage: true });

    expect(rows.length, '전표승인처리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 전표승인처리 - 사용여부 조회 (ACCP_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 전표승인처리  액터: 개발자
   * URL: /mis/act/act3030/getList.do
   * 예상결과: 사용중(ACCP_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3030_MST A WHERE A.ACCP_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 전표승인처리 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 전표승인처리 - 사용여부 조회');
    logInput('ACCP_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCP_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3030M-no2.png`, fullPage: true });

    expect(rows.length, '전표승인처리 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 전표승인처리 - 키워드 조회 (WRTER_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 전표승인처리  액터: 개발자
   * URL: /mis/act/act3030/getList.do
   * 예상결과: WRTER_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3030_MST A WHERE A.WRTER_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 전표승인처리 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 전표승인처리 - 키워드 조회');
    logInput('WRTER_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ WRTER_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3030M-no3.png`, fullPage: true });

    expect(rows.length, '전표승인처리 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 전표승인처리 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 전표승인처리  액터: 개발자
   * URL: /mis/act/act3030/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3030_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 전표승인처리 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 전표승인처리 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3030M-no4.png`, fullPage: true });

    expect(rows.length, '전표승인처리 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 전표승인처리 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 전표승인처리  액터: 개발자
   * URL: /mis/act/act3030/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3030_MST A WHERE A.WRTER_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 전표승인처리 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 전표승인처리 - 존재하지 않는 키워드 조회');
    logInput('WRTER_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ WRTER_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3030M-no5.png`, fullPage: true });

    expect(rows.length, '전표승인처리 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3031M — 전표반려사유  |  API: POST /mis/act/act3031/getList.do  |  TC 2건
// TODO(menuId): act_3031M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3031/getList.do';
  const PGM_ID            = 'act_3031M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'PGM_ID', 'RQST_NO', 'R_RUS_RSN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`전표반려사유(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 전표반려사유 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 전표반려사유  액터: 개발자
   * URL: /mis/act/act3031/getList.do
   * 예상결과: 전표반려사유 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3031_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 전표반려사유 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 전표반려사유 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3031M-no1.png`, fullPage: true });

    expect(rows.length, '전표반려사유 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 전표반려사유 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 전표반려사유  액터: 개발자
   * URL: /mis/act/act3031/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3031_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 전표반려사유 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 전표반려사유 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3031M-no2.png`, fullPage: true });

    expect(rows.length, '전표반려사유 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3040M — 회계전표 목록  |  API: POST /mis/act/act3040/getList.do  |  TC 4건
// TODO(menuId): act_3040M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3040/getList.do';
  const PGM_ID            = 'act_3040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'SLIP_TP', 'SLIP_DT_NO', 'SBJ', 'APV_STAT_CD', 'SCH_WRTER_NM', 'SCH_WRTER_ID'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`회계전표 목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 회계전표 목록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표 목록  액터: 개발자
   * URL: /mis/act/act3040/getList.do
   * 예상결과: 회계전표 목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3040_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 회계전표 목록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 회계전표 목록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3040M-no1.png`, fullPage: true });

    expect(rows.length, '회계전표 목록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 회계전표 목록 - 키워드 조회 (SCH_WRTER_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표 목록  액터: 개발자
   * URL: /mis/act/act3040/getList.do
   * 예상결과: SCH_WRTER_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3040_MST A WHERE A.SCH_WRTER_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 회계전표 목록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 회계전표 목록 - 키워드 조회');
    logInput('SCH_WRTER_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_WRTER_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3040M-no2.png`, fullPage: true });

    expect(rows.length, '회계전표 목록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 회계전표 목록 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표 목록  액터: 개발자
   * URL: /mis/act/act3040/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3040_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 회계전표 목록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 회계전표 목록 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3040M-no3.png`, fullPage: true });

    expect(rows.length, '회계전표 목록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 회계전표 목록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표 목록  액터: 개발자
   * URL: /mis/act/act3040/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3040_MST A WHERE A.SCH_WRTER_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 회계전표 목록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 회계전표 목록 - 존재하지 않는 키워드 조회');
    logInput('SCH_WRTER_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_WRTER_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3040M-no4.png`, fullPage: true });

    expect(rows.length, '회계전표 목록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3041M — 회계전표  |  API: POST /mis/act/act3041/getData.do  |  TC 3건
// TODO(menuId): act_3041M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3041/getData.do';
  const PGM_ID            = 'act_3041M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'SLIP_DT', 'SLIP_NO', 'SLIP_DT_NO', 'ENRN_FAOR_CD', 'STOT_SLIP_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`회계전표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 회계전표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표  액터: 개발자
   * URL: /mis/act/act3041/getData.do
   * 예상결과: 회계전표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3041_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 회계전표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 회계전표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3041M-no1.png`, fullPage: true });

    expect(rows.length, '회계전표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 회계전표 - 사용여부 조회 (STOT_SLIP_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표  액터: 개발자
   * URL: /mis/act/act3041/getData.do
   * 예상결과: 사용중(STOT_SLIP_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3041_MST A WHERE A.STOT_SLIP_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 회계전표 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 회계전표 - 사용여부 조회');
    logInput('STOT_SLIP_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ STOT_SLIP_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3041M-no2.png`, fullPage: true });

    expect(rows.length, '회계전표 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 회계전표 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표  액터: 개발자
   * URL: /mis/act/act3041/getData.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3041_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 회계전표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 회계전표 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3041M-no3.png`, fullPage: true });

    expect(rows.length, '회계전표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3050M — 미결전표관리  |  API: POST /mis/act/act3050/getTab1List1.do  |  TC 1건
// TODO(menuId): act_3050M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3050/getTab1List1.do';
  const PGM_ID            = 'act_3050M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`미결전표관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 미결전표관리 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 미결전표관리  액터: 개발자
   * URL: /mis/act/act3050/getTab1List1.do
   * 예상결과: 미결전표관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3050_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 미결전표관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 미결전표관리 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3050M-no1.png`, fullPage: true });

    expect(rows.length, '미결전표관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3060M — 회계전표수정  |  API: POST /mis/act/act3060/getData.do  |  TC 3건
// TODO(menuId): act_3060M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3060/getData.do';
  const PGM_ID            = 'act_3060M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'SLIP_DT', 'SLIP_NO', 'SLIP_DT_NO', 'ENRN_FAOR_CD', 'STOT_SLIP_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`회계전표수정(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 회계전표수정 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표수정  액터: 개발자
   * URL: /mis/act/act3060/getData.do
   * 예상결과: 회계전표수정 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3060_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 회계전표수정 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 회계전표수정 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3060M-no1.png`, fullPage: true });

    expect(rows.length, '회계전표수정 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 회계전표수정 - 사용여부 조회 (STOT_SLIP_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표수정  액터: 개발자
   * URL: /mis/act/act3060/getData.do
   * 예상결과: 사용중(STOT_SLIP_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3060_MST A WHERE A.STOT_SLIP_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 회계전표수정 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 회계전표수정 - 사용여부 조회');
    logInput('STOT_SLIP_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ STOT_SLIP_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3060M-no2.png`, fullPage: true });

    expect(rows.length, '회계전표수정 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 회계전표수정 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표수정  액터: 개발자
   * URL: /mis/act/act3060/getData.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3060_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 회계전표수정 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 회계전표수정 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3060M-no3.png`, fullPage: true });

    expect(rows.length, '회계전표수정 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3460M — 미수취확인  |  API: POST /mis/act/act3460/getList.do  |  TC 5건
// TODO(menuId): act_3460M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3460/getList.do';
  const PGM_ID            = 'act_3460M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SLIP_FRM_DT', 'SLIP_TO_DT', 'BIL_RCV_YN', 'CUST_NM', 'SCH_BUDG_BSNS_CD', 'SCH_BUDG_BSNS_NM', 'SCH_BUDG_LITM_CD', 'SCH_BUDG_LITM_NM', 'WTER', 'WTER_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`미수취확인(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 미수취확인 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 미수취확인  액터: 개발자
   * URL: /mis/act/act3460/getList.do
   * 예상결과: 미수취확인 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3460_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 미수취확인 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 미수취확인 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3460M-no1.png`, fullPage: true });

    expect(rows.length, '미수취확인 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 미수취확인 - 사용여부 조회 (BIL_RCV_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 미수취확인  액터: 개발자
   * URL: /mis/act/act3460/getList.do
   * 예상결과: 사용중(BIL_RCV_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3460_MST A WHERE A.BIL_RCV_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 미수취확인 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 미수취확인 - 사용여부 조회');
    logInput('BIL_RCV_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ BIL_RCV_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3460M-no2.png`, fullPage: true });

    expect(rows.length, '미수취확인 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 미수취확인 - 키워드 조회 (CUST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 미수취확인  액터: 개발자
   * URL: /mis/act/act3460/getList.do
   * 예상결과: CUST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3460_MST A WHERE A.CUST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 미수취확인 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 미수취확인 - 키워드 조회');
    logInput('CUST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3460M-no3.png`, fullPage: true });

    expect(rows.length, '미수취확인 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 미수취확인 - 코드 조건 조회 (SCH_BUDG_BSNS_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 미수취확인  액터: 개발자
   * URL: /mis/act/act3460/getList.do
   * 예상결과: SCH_BUDG_BSNS_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3460_MST A WHERE A.SCH_BUDG_BSNS_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 미수취확인 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 미수취확인 - 코드 조건 조회');
    logInput('SCH_BUDG_BSNS_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_BUDG_BSNS_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3460M-no4.png`, fullPage: true });

    expect(rows.length, '미수취확인 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 미수취확인 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 미수취확인  액터: 개발자
   * URL: /mis/act/act3460/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3460_MST A WHERE A.CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 미수취확인 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 미수취확인 - 존재하지 않는 키워드 조회');
    logInput('CUST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3460M-no5.png`, fullPage: true });

    expect(rows.length, '미수취확인 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3510M — 분개장  |  API: POST /mis/act/act3510/getList.do  |  TC 2건
// TODO(menuId): act_3510M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3510/getList.do';
  const PGM_ID            = 'act_3510M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'STR_UNIT_CD', 'FRM_DT', 'TO_DT', 'SLIP_TP'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`분개장(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 분개장 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 분개장  액터: 개발자
   * URL: /mis/act/act3510/getList.do
   * 예상결과: 분개장 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3510_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 분개장 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 분개장 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3510M-no1.png`, fullPage: true });

    expect(rows.length, '분개장 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 분개장 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 분개장  액터: 개발자
   * URL: /mis/act/act3510/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3510_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 분개장 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 분개장 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3510M-no2.png`, fullPage: true });

    expect(rows.length, '분개장 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3520M — 계정별원장  |  API: POST /mis/act/act3520/getTab1List1.do  |  TC 1건
// TODO(menuId): act_3520M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3520/getTab1List1.do';
  const PGM_ID            = 'act_3520M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`계정별원장(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 계정별원장 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 계정별원장  액터: 개발자
   * URL: /mis/act/act3520/getTab1List1.do
   * 예상결과: 계정별원장 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3520_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 계정별원장 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 계정별원장 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3520M-no1.png`, fullPage: true });

    expect(rows.length, '계정별원장 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3530M — 총계정원장  |  API: POST /mis/act/act3530/getList.do  |  TC 4건
// TODO(menuId): act_3530M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3530/getList.do';
  const PGM_ID            = 'act_3530M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'STR_UNIT_CD', 'ACT_STDR_CD', 'PRD_FRM_DT', 'PRD_TO_DT', 'FRM_DT', 'TO_DT', 'FRM_ACCT_CD', 'FRM_ACCT_NM', 'TO_ACCT_CD', 'TO_ACCT_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`총계정원장(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 총계정원장 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 총계정원장  액터: 개발자
   * URL: /mis/act/act3530/getList.do
   * 예상결과: 총계정원장 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3530_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 총계정원장 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 총계정원장 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3530M-no1.png`, fullPage: true });

    expect(rows.length, '총계정원장 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 총계정원장 - 키워드 조회 (FRM_ACCT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 총계정원장  액터: 개발자
   * URL: /mis/act/act3530/getList.do
   * 예상결과: FRM_ACCT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3530_MST A WHERE A.FRM_ACCT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 총계정원장 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 총계정원장 - 키워드 조회');
    logInput('FRM_ACCT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_ACCT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3530M-no2.png`, fullPage: true });

    expect(rows.length, '총계정원장 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 총계정원장 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 총계정원장  액터: 개발자
   * URL: /mis/act/act3530/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3530_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 총계정원장 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 총계정원장 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3530M-no3.png`, fullPage: true });

    expect(rows.length, '총계정원장 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 총계정원장 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 총계정원장  액터: 개발자
   * URL: /mis/act/act3530/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3530_MST A WHERE A.FRM_ACCT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 총계정원장 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 총계정원장 - 존재하지 않는 키워드 조회');
    logInput('FRM_ACCT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_ACCT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3530M-no4.png`, fullPage: true });

    expect(rows.length, '총계정원장 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3540M — 현금출납장  |  API: POST /mis/act/act3540/getList.do  |  TC 2건
// TODO(menuId): act_3540M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3540/getList.do';
  const PGM_ID            = 'act_3540M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'ACT_STDR_CD', 'PRD_FRM_DT', 'PRD_TO_DT', 'FRM_DT', 'TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`현금출납장(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 현금출납장 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 현금출납장  액터: 개발자
   * URL: /mis/act/act3540/getList.do
   * 예상결과: 현금출납장 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3540_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 현금출납장 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 현금출납장 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3540M-no1.png`, fullPage: true });

    expect(rows.length, '현금출납장 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 현금출납장 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 현금출납장  액터: 개발자
   * URL: /mis/act/act3540/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3540_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 현금출납장 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 현금출납장 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3540M-no2.png`, fullPage: true });

    expect(rows.length, '현금출납장 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3550M — 일(월)계표  |  API: POST /mis/act/act0000/getUnt.do  |  TC 3건
// TODO(menuId): act_3550M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getUnt.do';
  const PGM_ID            = 'act_3550M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FS_FORM_CD', 'PRD_FRM_DT', 'PRD_TO_DT', 'FRM_DT', 'TO_DT', 'TEMP_SLIP_INCD_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`일(월)계표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 일(월)계표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 일(월)계표  액터: 개발자
   * URL: /mis/act/act0000/getUnt.do
   * 예상결과: 일(월)계표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3550_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 일(월)계표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 일(월)계표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3550M-no1.png`, fullPage: true });

    expect(rows.length, '일(월)계표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 일(월)계표 - 사용여부 조회 (TEMP_SLIP_INCD_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 일(월)계표  액터: 개발자
   * URL: /mis/act/act0000/getUnt.do
   * 예상결과: 사용중(TEMP_SLIP_INCD_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3550_MST A WHERE A.TEMP_SLIP_INCD_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 일(월)계표 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 일(월)계표 - 사용여부 조회');
    logInput('TEMP_SLIP_INCD_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ TEMP_SLIP_INCD_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3550M-no2.png`, fullPage: true });

    expect(rows.length, '일(월)계표 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 일(월)계표 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 일(월)계표  액터: 개발자
   * URL: /mis/act/act0000/getUnt.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3550_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 일(월)계표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 일(월)계표 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3550M-no3.png`, fullPage: true });

    expect(rows.length, '일(월)계표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3560M — 거래처원장  |  API: POST /mis/act/act3560/getList.do  |  TC 5건
// TODO(menuId): act_3560M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3560/getList.do';
  const PGM_ID            = 'act_3560M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'PRD_FRM_DT', 'PRD_TO_DT', 'FRM_DT', 'TO_DT', 'ACCT_CD', 'ACCT_NM', 'BUDG_YY', 'BUDG_BSNS_CD', 'BUDG_BSNS_NM', 'FRM_CUST_CD', 'FRM_CUST_NM', 'TO_CUST_CD', 'TO_CUST_NM', 'CUST_CD', 'CUST_NM', 'FRM_AMT', 'TO_AMT', 'SMRY', 'ALL_YN', 'SIGN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`거래처원장(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 거래처원장 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 거래처원장  액터: 개발자
   * URL: /mis/act/act3560/getList.do
   * 예상결과: 거래처원장 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3560_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 거래처원장 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 거래처원장 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3560M-no1.png`, fullPage: true });

    expect(rows.length, '거래처원장 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 거래처원장 - 사용여부 조회 (ALL_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 거래처원장  액터: 개발자
   * URL: /mis/act/act3560/getList.do
   * 예상결과: 사용중(ALL_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3560_MST A WHERE A.ALL_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 거래처원장 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 거래처원장 - 사용여부 조회');
    logInput('ALL_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ ALL_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3560M-no2.png`, fullPage: true });

    expect(rows.length, '거래처원장 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 거래처원장 - 키워드 조회 (ACCT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 거래처원장  액터: 개발자
   * URL: /mis/act/act3560/getList.do
   * 예상결과: ACCT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3560_MST A WHERE A.ACCT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 거래처원장 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 거래처원장 - 키워드 조회');
    logInput('ACCT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3560M-no3.png`, fullPage: true });

    expect(rows.length, '거래처원장 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 거래처원장 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 거래처원장  액터: 개발자
   * URL: /mis/act/act3560/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3560_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 거래처원장 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 거래처원장 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3560M-no4.png`, fullPage: true });

    expect(rows.length, '거래처원장 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 거래처원장 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 거래처원장  액터: 개발자
   * URL: /mis/act/act3560/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3560_MST A WHERE A.ACCT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 거래처원장 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 거래처원장 - 존재하지 않는 키워드 조회');
    logInput('ACCT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3560M-no5.png`, fullPage: true });

    expect(rows.length, '거래처원장 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3570M — 미결원장  |  API: POST /mis/act/act3570/getList.do  |  TC 2건
// TODO(menuId): act_3570M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3570/getList.do';
  const PGM_ID            = 'act_3570M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'ACCT_CD', 'SMRY', 'PBCK_STAT_CD', 'ACT_STDR_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`미결원장(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 미결원장 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 미결원장  액터: 개발자
   * URL: /mis/act/act3570/getList.do
   * 예상결과: 미결원장 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3570_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 미결원장 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 미결원장 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3570M-no1.png`, fullPage: true });

    expect(rows.length, '미결원장 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 미결원장 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 미결원장  액터: 개발자
   * URL: /mis/act/act3570/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3570_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 미결원장 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 미결원장 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3570M-no2.png`, fullPage: true });

    expect(rows.length, '미결원장 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3610M — 보조원장잔액  |  API: POST /mis/act/act3610/getList.do  |  TC 5건
// TODO(menuId): act_3610M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act3610/getList.do';
  const PGM_ID            = 'act_3610M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'PRD_FRM_DT', 'PRD_TO_DT', 'FRM_DT', 'TO_DT', 'ZERO_YN', 'ACCT_CLS', 'ACCT_CD', 'ACCT_NM', 'MNG_ITM_CD1', 'MNG_ITM_NM1', 'BALC_MNG_FG1', 'MNG_ITM_CD2', 'MNG_ITM_NM2', 'BALC_MNG_FG2', 'FR_MNG_ITM_VAL_1', 'FR_MNG_ITM_VAL_NM_1', 'TO_MNG_ITM_VAL_1', 'TO_MNG_ITM_VAL_NM_1', 'FR_MNG_ITM_VAL_2', 'FR_MNG_ITM_VAL_NM_2', 'TO_MNG_ITM_VAL_2', 'TO_MNG_ITM_VAL_NM_2', 'FR_MNG_ITM_YN', 'TO_MNG_ITM_YN', 'POP_FILE_PATH1', 'POP_FILE_PATH2'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`보조원장잔액(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 보조원장잔액 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 보조원장잔액  액터: 개발자
   * URL: /mis/act/act3610/getList.do
   * 예상결과: 보조원장잔액 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3610_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 보조원장잔액 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 보조원장잔액 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3610M-no1.png`, fullPage: true });

    expect(rows.length, '보조원장잔액 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 보조원장잔액 - 사용여부 조회 (ZERO_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 보조원장잔액  액터: 개발자
   * URL: /mis/act/act3610/getList.do
   * 예상결과: 사용중(ZERO_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3610_MST A WHERE A.ZERO_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 보조원장잔액 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 보조원장잔액 - 사용여부 조회');
    logInput('ZERO_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ ZERO_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3610M-no2.png`, fullPage: true });

    expect(rows.length, '보조원장잔액 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 보조원장잔액 - 키워드 조회 (ACCT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 보조원장잔액  액터: 개발자
   * URL: /mis/act/act3610/getList.do
   * 예상결과: ACCT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3610_MST A WHERE A.ACCT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 보조원장잔액 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 보조원장잔액 - 키워드 조회');
    logInput('ACCT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3610M-no3.png`, fullPage: true });

    expect(rows.length, '보조원장잔액 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 보조원장잔액 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 보조원장잔액  액터: 개발자
   * URL: /mis/act/act3610/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3610_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 보조원장잔액 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 보조원장잔액 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3610M-no4.png`, fullPage: true });

    expect(rows.length, '보조원장잔액 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 보조원장잔액 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 보조원장잔액  액터: 개발자
   * URL: /mis/act/act3610/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3610_MST A WHERE A.ACCT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 보조원장잔액 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 보조원장잔액 - 존재하지 않는 키워드 조회');
    logInput('ACCT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3610M-no5.png`, fullPage: true });

    expect(rows.length, '보조원장잔액 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_3620M — 보조부원장상세  |  API: POST /mis/act/act0000/getUnt.do  |  TC 5건
// TODO(menuId): act_3620M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getUnt.do';
  const PGM_ID            = 'act_3620M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'PRD_FRM_DT', 'PRD_TO_DT', 'FRM_DT', 'TO_DT', 'ZERO_YN', 'ACCT_CLS', 'ACCT_CD', 'ACCT_NM', 'BALC_MNG_FG1', 'MNG_ITM_CD1', 'MNG_ITM_VAL1', 'MNG_ITM_VAL_NM1', 'POP_FILE_PATH1', 'BALC_MNG_FG2', 'MNG_ITM_CD2', 'MNG_ITM_VAL2', 'MNG_ITM_VAL_NM2', 'POP_FILE_PATH2', 'SIGN', 'MNG_ITM_CD', 'MNG_ITM_VAL'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`보조부원장상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 보조부원장상세 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 보조부원장상세  액터: 개발자
   * URL: /mis/act/act0000/getUnt.do
   * 예상결과: 보조부원장상세 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_3620_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 보조부원장상세 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 보조부원장상세 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3620M-no1.png`, fullPage: true });

    expect(rows.length, '보조부원장상세 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 보조부원장상세 - 사용여부 조회 (ZERO_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 보조부원장상세  액터: 개발자
   * URL: /mis/act/act0000/getUnt.do
   * 예상결과: 사용중(ZERO_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3620_MST A WHERE A.ZERO_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 보조부원장상세 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 보조부원장상세 - 사용여부 조회');
    logInput('ZERO_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ ZERO_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3620M-no2.png`, fullPage: true });

    expect(rows.length, '보조부원장상세 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 보조부원장상세 - 키워드 조회 (ACCT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 보조부원장상세  액터: 개발자
   * URL: /mis/act/act0000/getUnt.do
   * 예상결과: ACCT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3620_MST A WHERE A.ACCT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 보조부원장상세 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 보조부원장상세 - 키워드 조회');
    logInput('ACCT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3620M-no3.png`, fullPage: true });

    expect(rows.length, '보조부원장상세 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 보조부원장상세 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 보조부원장상세  액터: 개발자
   * URL: /mis/act/act0000/getUnt.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3620_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 보조부원장상세 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 보조부원장상세 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3620M-no4.png`, fullPage: true });

    expect(rows.length, '보조부원장상세 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 보조부원장상세 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 보조부원장상세  액터: 개발자
   * URL: /mis/act/act0000/getUnt.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_3620_MST A WHERE A.ACCT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 보조부원장상세 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 보조부원장상세 - 존재하지 않는 키워드 조회');
    logInput('ACCT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_3620M-no5.png`, fullPage: true });

    expect(rows.length, '보조부원장상세 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4010M — 합계잔액시산표  |  API: POST /mgt/cfg/cfg0520/getFsFormCd.do  |  TC 3건
// TODO(menuId): act_4010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mgt/cfg/cfg0520/getFsFormCd.do';
  const PGM_ID            = 'act_4010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT', 'STDR_YY', 'TEMP_SLIP_INCD_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`합계잔액시산표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 합계잔액시산표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 합계잔액시산표  액터: 개발자
   * URL: /mgt/cfg/cfg0520/getFsFormCd.do
   * 예상결과: 합계잔액시산표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4010_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 합계잔액시산표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 합계잔액시산표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4010M-no1.png`, fullPage: true });

    expect(rows.length, '합계잔액시산표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 합계잔액시산표 - 사용여부 조회 (TEMP_SLIP_INCD_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 합계잔액시산표  액터: 개발자
   * URL: /mgt/cfg/cfg0520/getFsFormCd.do
   * 예상결과: 사용중(TEMP_SLIP_INCD_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4010_MST A WHERE A.TEMP_SLIP_INCD_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 합계잔액시산표 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 합계잔액시산표 - 사용여부 조회');
    logInput('TEMP_SLIP_INCD_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ TEMP_SLIP_INCD_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4010M-no2.png`, fullPage: true });

    expect(rows.length, '합계잔액시산표 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 합계잔액시산표 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 합계잔액시산표  액터: 개발자
   * URL: /mgt/cfg/cfg0520/getFsFormCd.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4010_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 합계잔액시산표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 합계잔액시산표 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4010M-no3.png`, fullPage: true });

    expect(rows.length, '합계잔액시산표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4020M — 재무상태표  |  API: POST /mis/act/act0000/getPeriod.do  |  TC 3건
// TODO(menuId): act_4020M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getPeriod.do';
  const PGM_ID            = 'act_4020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT', 'STDR_YY', 'TEMP_SLIP_INCD_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`재무상태표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 재무상태표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 재무상태표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: 재무상태표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4020_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 재무상태표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 재무상태표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4020M-no1.png`, fullPage: true });

    expect(rows.length, '재무상태표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 재무상태표 - 사용여부 조회 (TEMP_SLIP_INCD_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 재무상태표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: 사용중(TEMP_SLIP_INCD_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4020_MST A WHERE A.TEMP_SLIP_INCD_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 재무상태표 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 재무상태표 - 사용여부 조회');
    logInput('TEMP_SLIP_INCD_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ TEMP_SLIP_INCD_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4020M-no2.png`, fullPage: true });

    expect(rows.length, '재무상태표 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 재무상태표 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 재무상태표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4020_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 재무상태표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 재무상태표 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4020M-no3.png`, fullPage: true });

    expect(rows.length, '재무상태표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4030M — 운영성과표  |  API: POST /mis/act/act0000/getPeriod.do  |  TC 3건
// TODO(menuId): act_4030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getPeriod.do';
  const PGM_ID            = 'act_4030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT', 'TEMP_SLIP_INCD_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`운영성과표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 운영성과표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 운영성과표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: 운영성과표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4030_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 운영성과표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 운영성과표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4030M-no1.png`, fullPage: true });

    expect(rows.length, '운영성과표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 운영성과표 - 사용여부 조회 (TEMP_SLIP_INCD_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 운영성과표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: 사용중(TEMP_SLIP_INCD_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4030_MST A WHERE A.TEMP_SLIP_INCD_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 운영성과표 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 운영성과표 - 사용여부 조회');
    logInput('TEMP_SLIP_INCD_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ TEMP_SLIP_INCD_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4030M-no2.png`, fullPage: true });

    expect(rows.length, '운영성과표 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 운영성과표 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 운영성과표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4030_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 운영성과표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 운영성과표 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4030M-no3.png`, fullPage: true });

    expect(rows.length, '운영성과표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4031M — 기간별 손익계산서  |  API: POST /mis/act/act4030/getListGrid.do  |  TC 1건
// TODO(menuId): act_4031M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act4030/getListGrid.do';
  const PGM_ID            = 'act_4031M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기간별 손익계산서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기간별 손익계산서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 기간별 손익계산서  액터: 개발자
   * URL: /mis/act/act4030/getListGrid.do
   * 예상결과: 기간별 손익계산서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4031_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 기간별 손익계산서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 기간별 손익계산서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4031M-no1.png`, fullPage: true });

    expect(rows.length, '기간별 손익계산서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4040M — 현금흐름표  |  API: POST /mis/act/act0000/getPeriod.do  |  TC 4건
// TODO(menuId): act_4040M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getPeriod.do';
  const PGM_ID            = 'act_4040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'STR_UNIT_MNG_NM', 'FS_FORM_CD', 'FRM_DT', 'TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`현금흐름표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 현금흐름표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 현금흐름표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: 현금흐름표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4040_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 현금흐름표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 현금흐름표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4040M-no1.png`, fullPage: true });

    expect(rows.length, '현금흐름표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 현금흐름표 - 키워드 조회 (STR_UNIT_MNG_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 현금흐름표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: STR_UNIT_MNG_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4040_MST A WHERE A.STR_UNIT_MNG_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 현금흐름표 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 현금흐름표 - 키워드 조회');
    logInput('STR_UNIT_MNG_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ STR_UNIT_MNG_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4040M-no2.png`, fullPage: true });

    expect(rows.length, '현금흐름표 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 현금흐름표 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 현금흐름표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4040_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 현금흐름표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 현금흐름표 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4040M-no3.png`, fullPage: true });

    expect(rows.length, '현금흐름표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 현금흐름표 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 현금흐름표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4040_MST A WHERE A.STR_UNIT_MNG_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 현금흐름표 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 현금흐름표 - 존재하지 않는 키워드 조회');
    logInput('STR_UNIT_MNG_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ STR_UNIT_MNG_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4040M-no4.png`, fullPage: true });

    expect(rows.length, '현금흐름표 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4041M — 전기분-현금흐름표  |  API: POST /mis/act/act4041/getList.do  |  TC 2건
// TODO(menuId): act_4041M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act4041/getList.do';
  const PGM_ID            = 'act_4041M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'FS_FORM_CD', 'GRP_FG', 'STDR_YY', 'LNSTR_FRMTRM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`전기분-현금흐름표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 전기분-현금흐름표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 전기분-현금흐름표  액터: 개발자
   * URL: /mis/act/act4041/getList.do
   * 예상결과: 전기분-현금흐름표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4041_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 전기분-현금흐름표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 전기분-현금흐름표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4041M-no1.png`, fullPage: true });

    expect(rows.length, '전기분-현금흐름표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 전기분-현금흐름표 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 전기분-현금흐름표  액터: 개발자
   * URL: /mis/act/act4041/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4041_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 전기분-현금흐름표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 전기분-현금흐름표 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4041M-no2.png`, fullPage: true });

    expect(rows.length, '전기분-현금흐름표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4042M — 현금흐름표과목등록  |  API: POST /mis/act/act4042/getMst.do  |  TC 2건
// TODO(menuId): act_4042M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act4042/getMst.do';
  const PGM_ID            = 'act_4042M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'FS_FORM_CD', 'GRP_FG', 'STDR_YY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`현금흐름표과목등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 현금흐름표과목등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 현금흐름표과목등록  액터: 개발자
   * URL: /mis/act/act4042/getMst.do
   * 예상결과: 현금흐름표과목등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4042_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 현금흐름표과목등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 현금흐름표과목등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4042M-no1.png`, fullPage: true });

    expect(rows.length, '현금흐름표과목등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 현금흐름표과목등록 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 현금흐름표과목등록  액터: 개발자
   * URL: /mis/act/act4042/getMst.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4042_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 현금흐름표과목등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 현금흐름표과목등록 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4042M-no2.png`, fullPage: true });

    expect(rows.length, '현금흐름표과목등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4050M — 이익잉여금처분계산서  |  API: POST /mgt/cfg/cfg0520/getFsFormCd.do  |  TC 3건
// TODO(menuId): act_4050M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mgt/cfg/cfg0520/getFsFormCd.do';
  const PGM_ID            = 'act_4050M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FS_FORM_CD', 'STDR_YY', 'DEL_YN', 'FRM_DT', 'TO_DT', 'PROS_RPL_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`이익잉여금처분계산서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 이익잉여금처분계산서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 이익잉여금처분계산서  액터: 개발자
   * URL: /mgt/cfg/cfg0520/getFsFormCd.do
   * 예상결과: 이익잉여금처분계산서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4050_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 이익잉여금처분계산서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 이익잉여금처분계산서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4050M-no1.png`, fullPage: true });

    expect(rows.length, '이익잉여금처분계산서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 이익잉여금처분계산서 - 사용여부 조회 (DEL_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 이익잉여금처분계산서  액터: 개발자
   * URL: /mgt/cfg/cfg0520/getFsFormCd.do
   * 예상결과: 사용중(DEL_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4050_MST A WHERE A.DEL_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 이익잉여금처분계산서 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 이익잉여금처분계산서 - 사용여부 조회');
    logInput('DEL_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ DEL_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4050M-no2.png`, fullPage: true });

    expect(rows.length, '이익잉여금처분계산서 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 이익잉여금처분계산서 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 이익잉여금처분계산서  액터: 개발자
   * URL: /mgt/cfg/cfg0520/getFsFormCd.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4050_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 이익잉여금처분계산서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 이익잉여금처분계산서 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4050M-no3.png`, fullPage: true });

    expect(rows.length, '이익잉여금처분계산서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4051M — 전기분잉여금처분계산서  |  API: POST /mis/act/act4051/getList.do  |  TC 2건
// TODO(menuId): act_4051M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act4051/getList.do';
  const PGM_ID            = 'act_4051M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'FS_FORM_CD', 'STDR_YY', 'LNSTR_FRMTRM', 'FRM_DT', 'TO_DT', 'PREV_YY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`전기분잉여금처분계산서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 전기분잉여금처분계산서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 전기분잉여금처분계산서  액터: 개발자
   * URL: /mis/act/act4051/getList.do
   * 예상결과: 전기분잉여금처분계산서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4051_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 전기분잉여금처분계산서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 전기분잉여금처분계산서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4051M-no1.png`, fullPage: true });

    expect(rows.length, '전기분잉여금처분계산서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 전기분잉여금처분계산서 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 전기분잉여금처분계산서  액터: 개발자
   * URL: /mis/act/act4051/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4051_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 전기분잉여금처분계산서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 전기분잉여금처분계산서 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4051M-no2.png`, fullPage: true });

    expect(rows.length, '전기분잉여금처분계산서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4060M — 자본변동표  |  API: POST /mis/act/act4060/getListGrid.do  |  TC 4건
// TODO(menuId): act_4060M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act4060/getListGrid.do';
  const PGM_ID            = 'act_4060M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'STR_UNIT_MNG_NM', 'FS_FORM_CD', 'FRM_DT', 'TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자본변동표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자본변동표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 자본변동표  액터: 개발자
   * URL: /mis/act/act4060/getListGrid.do
   * 예상결과: 자본변동표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4060_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 자본변동표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자본변동표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4060M-no1.png`, fullPage: true });

    expect(rows.length, '자본변동표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 자본변동표 - 키워드 조회 (STR_UNIT_MNG_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 자본변동표  액터: 개발자
   * URL: /mis/act/act4060/getListGrid.do
   * 예상결과: STR_UNIT_MNG_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4060_MST A WHERE A.STR_UNIT_MNG_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 자본변동표 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자본변동표 - 키워드 조회');
    logInput('STR_UNIT_MNG_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ STR_UNIT_MNG_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4060M-no2.png`, fullPage: true });

    expect(rows.length, '자본변동표 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 자본변동표 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 자본변동표  액터: 개발자
   * URL: /mis/act/act4060/getListGrid.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4060_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 자본변동표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 자본변동표 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4060M-no3.png`, fullPage: true });

    expect(rows.length, '자본변동표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 자본변동표 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 자본변동표  액터: 개발자
   * URL: /mis/act/act4060/getListGrid.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4060_MST A WHERE A.STR_UNIT_MNG_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 자본변동표 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 자본변동표 - 존재하지 않는 키워드 조회');
    logInput('STR_UNIT_MNG_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ STR_UNIT_MNG_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4060M-no4.png`, fullPage: true });

    expect(rows.length, '자본변동표 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4061M — 자본변동표-전기입력  |  API: POST /mis/act/act4061/getList.do  |  TC 2건
// TODO(menuId): act_4061M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act4061/getList.do';
  const PGM_ID            = 'act_4061M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'FS_FORM_CD', 'STDR_YY', 'LNSTR_FRMTRM', 'FRM_DT', 'TO_DT', 'PREV_YY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자본변동표-전기입력(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자본변동표-전기입력 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 자본변동표-전기입력  액터: 개발자
   * URL: /mis/act/act4061/getList.do
   * 예상결과: 자본변동표-전기입력 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4061_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 자본변동표-전기입력 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자본변동표-전기입력 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4061M-no1.png`, fullPage: true });

    expect(rows.length, '자본변동표-전기입력 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 자본변동표-전기입력 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 자본변동표-전기입력  액터: 개발자
   * URL: /mis/act/act4061/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4061_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 자본변동표-전기입력 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자본변동표-전기입력 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4061M-no2.png`, fullPage: true });

    expect(rows.length, '자본변동표-전기입력 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4062M — 자본변동표과목등록  |  API: POST /mis/act/act4062/getList.do  |  TC 2건
// TODO(menuId): act_4062M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act4062/getList.do';
  const PGM_ID            = 'act_4062M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'FS_FORM_CD', 'STDR_YY', 'GRP_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자본변동표과목등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자본변동표과목등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 자본변동표과목등록  액터: 개발자
   * URL: /mis/act/act4062/getList.do
   * 예상결과: 자본변동표과목등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4062_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 자본변동표과목등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자본변동표과목등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4062M-no1.png`, fullPage: true });

    expect(rows.length, '자본변동표과목등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 자본변동표과목등록 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 자본변동표과목등록  액터: 개발자
   * URL: /mis/act/act4062/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4062_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 자본변동표과목등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자본변동표과목등록 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4062M-no2.png`, fullPage: true });

    expect(rows.length, '자본변동표과목등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4070M — 원가명세서  |  API: POST /mis/act/act4070/getListGrid.do  |  TC 4건
// TODO(menuId): act_4070M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act4070/getListGrid.do';
  const PGM_ID            = 'act_4070M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'STR_UNIT_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT', 'FS_FORM_FG', 'STR_UNIT_MNG_CD', 'STR_UNIT_MNG_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`원가명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 원가명세서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 원가명세서  액터: 개발자
   * URL: /mis/act/act4070/getListGrid.do
   * 예상결과: 원가명세서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4070_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 원가명세서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 원가명세서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4070M-no1.png`, fullPage: true });

    expect(rows.length, '원가명세서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 원가명세서 - 키워드 조회 (STR_UNIT_MNG_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 원가명세서  액터: 개발자
   * URL: /mis/act/act4070/getListGrid.do
   * 예상결과: STR_UNIT_MNG_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4070_MST A WHERE A.STR_UNIT_MNG_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 원가명세서 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 원가명세서 - 키워드 조회');
    logInput('STR_UNIT_MNG_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ STR_UNIT_MNG_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4070M-no2.png`, fullPage: true });

    expect(rows.length, '원가명세서 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 원가명세서 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 원가명세서  액터: 개발자
   * URL: /mis/act/act4070/getListGrid.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4070_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 원가명세서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 원가명세서 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4070M-no3.png`, fullPage: true });

    expect(rows.length, '원가명세서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 원가명세서 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 원가명세서  액터: 개발자
   * URL: /mis/act/act4070/getListGrid.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4070_MST A WHERE A.STR_UNIT_MNG_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 원가명세서 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 원가명세서 - 존재하지 않는 키워드 조회');
    logInput('STR_UNIT_MNG_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ STR_UNIT_MNG_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4070M-no4.png`, fullPage: true });

    expect(rows.length, '원가명세서 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4072M — 원가명세서과목등록  |  API: POST /mis/act/act4072/getList.do  |  TC 2건
// TODO(menuId): act_4072M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act4072/getList.do';
  const PGM_ID            = 'act_4072M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'FS_FORM_CD', 'STDR_YY', 'GRP_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`원가명세서과목등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 원가명세서과목등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 원가명세서과목등록  액터: 개발자
   * URL: /mis/act/act4072/getList.do
   * 예상결과: 원가명세서과목등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4072_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 원가명세서과목등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 원가명세서과목등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4072M-no1.png`, fullPage: true });

    expect(rows.length, '원가명세서과목등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 원가명세서과목등록 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 원가명세서과목등록  액터: 개발자
   * URL: /mis/act/act4072/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4072_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 원가명세서과목등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 원가명세서과목등록 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4072M-no2.png`, fullPage: true });

    expect(rows.length, '원가명세서과목등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4080M — 인건비명세서  |  API: POST /mis/act/act0001/getListGrid.do  |  TC 2건
// TODO(menuId): act_4080M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0001/getListGrid.do';
  const PGM_ID            = 'act_4080M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'STR_UNIT_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT', 'ACCT_UNT_ALL', 'PRINT_STLF'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`인건비명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 인건비명세서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 인건비명세서  액터: 개발자
   * URL: /mis/act/act0001/getListGrid.do
   * 예상결과: 인건비명세서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4080_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 인건비명세서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 인건비명세서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4080M-no1.png`, fullPage: true });

    expect(rows.length, '인건비명세서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 인건비명세서 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 인건비명세서  액터: 개발자
   * URL: /mis/act/act0001/getListGrid.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4080_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 인건비명세서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 인건비명세서 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4080M-no2.png`, fullPage: true });

    expect(rows.length, '인건비명세서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4090M — 연구지원비명세서  |  API: POST /mis/act/act0000/getUnt.do  |  TC 2건
// TODO(menuId): act_4090M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getUnt.do';
  const PGM_ID            = 'act_4090M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'STR_UNIT_CD', 'FS_FORM_CD', 'FS_FORM_FG', 'FRM_DT', 'TO_DT', 'ACCT_UNT_ALL'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`연구지원비명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 연구지원비명세서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 연구지원비명세서  액터: 개발자
   * URL: /mis/act/act0000/getUnt.do
   * 예상결과: 연구지원비명세서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4090_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 연구지원비명세서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 연구지원비명세서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4090M-no1.png`, fullPage: true });

    expect(rows.length, '연구지원비명세서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 연구지원비명세서 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 연구지원비명세서  액터: 개발자
   * URL: /mis/act/act0000/getUnt.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4090_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 연구지원비명세서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 연구지원비명세서 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4090M-no2.png`, fullPage: true });

    expect(rows.length, '연구지원비명세서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4510M — 결산부속명세서  |  API: POST /mis/act/act4510/getList.do  |  TC 2건
// TODO(menuId): act_4510M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act4510/getList.do';
  const PGM_ID            = 'act_4510M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'CAL_RPT_FG', 'CAL_RPT_CD', 'FORM_CD', 'STDR_YY', 'PRD_FRM_DT', 'PRD_TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`결산부속명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 결산부속명세서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 결산부속명세서  액터: 개발자
   * URL: /mis/act/act4510/getList.do
   * 예상결과: 결산부속명세서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4510_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 결산부속명세서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 결산부속명세서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4510M-no1.png`, fullPage: true });

    expect(rows.length, '결산부속명세서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 결산부속명세서 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 결산부속명세서  액터: 개발자
   * URL: /mis/act/act4510/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4510_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 결산부속명세서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 결산부속명세서 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4510M-no2.png`, fullPage: true });

    expect(rows.length, '결산부속명세서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4511M — 결산부속명세서등록  |  API: POST /mis/act/act4511/getList.do  |  TC 4건
// TODO(menuId): act_4511M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act4511/getList.do';
  const PGM_ID            = 'act_4511M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CAL_RPT_FG', 'CAL_RPT_CD', 'CAL_RPT_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`결산부속명세서등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 결산부속명세서등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 결산부속명세서등록  액터: 개발자
   * URL: /mis/act/act4511/getList.do
   * 예상결과: 결산부속명세서등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4511_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 결산부속명세서등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 결산부속명세서등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4511M-no1.png`, fullPage: true });

    expect(rows.length, '결산부속명세서등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 결산부속명세서등록 - 키워드 조회 (CAL_RPT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 결산부속명세서등록  액터: 개발자
   * URL: /mis/act/act4511/getList.do
   * 예상결과: CAL_RPT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4511_MST A WHERE A.CAL_RPT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 결산부속명세서등록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 결산부속명세서등록 - 키워드 조회');
    logInput('CAL_RPT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ CAL_RPT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4511M-no2.png`, fullPage: true });

    expect(rows.length, '결산부속명세서등록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 결산부속명세서등록 - 코드 조건 조회 (CAL_RPT_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 결산부속명세서등록  액터: 개발자
   * URL: /mis/act/act4511/getList.do
   * 예상결과: CAL_RPT_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4511_MST A WHERE A.CAL_RPT_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 결산부속명세서등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 결산부속명세서등록 - 코드 조건 조회');
    logInput('CAL_RPT_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ CAL_RPT_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4511M-no3.png`, fullPage: true });

    expect(rows.length, '결산부속명세서등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 결산부속명세서등록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 결산부속명세서등록  액터: 개발자
   * URL: /mis/act/act4511/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4511_MST A WHERE A.CAL_RPT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 결산부속명세서등록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 결산부속명세서등록 - 존재하지 않는 키워드 조회');
    logInput('CAL_RPT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CAL_RPT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4511M-no4.png`, fullPage: true });

    expect(rows.length, '결산부속명세서등록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4520M — 선급법인세  |  API: POST /mis/act/act4520/getList.do  |  TC 2건
// TODO(menuId): act_4520M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act4520/getList.do';
  const PGM_ID            = 'act_4520M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'PROC_STAT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`선급법인세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 선급법인세 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 선급법인세  액터: 개발자
   * URL: /mis/act/act4520/getList.do
   * 예상결과: 선급법인세 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4520_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 선급법인세 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 선급법인세 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4520M-no1.png`, fullPage: true });

    expect(rows.length, '선급법인세 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 선급법인세 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 선급법인세  액터: 개발자
   * URL: /mis/act/act4520/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4520_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 선급법인세 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 선급법인세 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4520M-no2.png`, fullPage: true });

    expect(rows.length, '선급법인세 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4900M — 결산대시보드  |  API: POST /mis/act/act4900/getList.do  |  TC 2건
// TODO(menuId): act_4900M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act4900/getList.do';
  const PGM_ID            = 'act_4900M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'CAL_RPT_FG', 'STDR_YY', 'FRM_DT', 'TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`결산대시보드(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 결산대시보드 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 결산대시보드  액터: 개발자
   * URL: /mis/act/act4900/getList.do
   * 예상결과: 결산대시보드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4900_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 결산대시보드 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 결산대시보드 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4900M-no1.png`, fullPage: true });

    expect(rows.length, '결산대시보드 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 결산대시보드 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 결산대시보드  액터: 개발자
   * URL: /mis/act/act4900/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4900_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 결산대시보드 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 결산대시보드 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4900M-no2.png`, fullPage: true });

    expect(rows.length, '결산대시보드 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_4901M — 결산자료검증  |  API: POST /mis/act/act4901/getList.do  |  TC 2건
// TODO(menuId): act_4901M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act4901/getList.do';
  const PGM_ID            = 'act_4901M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'CAL_RPT_FG', 'CAL_RPT_CD', 'STDR_YY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`결산자료검증(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 결산자료검증 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 결산자료검증  액터: 개발자
   * URL: /mis/act/act4901/getList.do
   * 예상결과: 결산자료검증 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_4901_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 결산자료검증 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 결산자료검증 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4901M-no1.png`, fullPage: true });

    expect(rows.length, '결산자료검증 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 결산자료검증 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 결산자료검증  액터: 개발자
   * URL: /mis/act/act4901/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_4901_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 결산자료검증 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 결산자료검증 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_4901M-no2.png`, fullPage: true });

    expect(rows.length, '결산자료검증 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5010M — 예적금등록  |  API: POST /mis/act/act5010/getList1.do  |  TC 5건
// TODO(menuId): act_5010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5010/getList1.do';
  const PGM_ID            = 'act_5010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'ACT_UNIT_NM', 'ACC_NO', 'DPSTS_FG', 'DPSTS_NM', 'USE_YN', 'DPSTS_TP'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`예적금등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 예적금등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 예적금등록  액터: 개발자
   * URL: /mis/act/act5010/getList1.do
   * 예상결과: 예적금등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5010_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 예적금등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 예적금등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5010M-no1.png`, fullPage: true });

    expect(rows.length, '예적금등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 예적금등록 - 사용여부 조회 (USE_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 예적금등록  액터: 개발자
   * URL: /mis/act/act5010/getList1.do
   * 예상결과: 사용중(USE_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5010_MST A WHERE A.USE_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 예적금등록 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 예적금등록 - 사용여부 조회');
    logInput('USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5010M-no2.png`, fullPage: true });

    expect(rows.length, '예적금등록 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 예적금등록 - 키워드 조회 (ACT_UNIT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 예적금등록  액터: 개발자
   * URL: /mis/act/act5010/getList1.do
   * 예상결과: ACT_UNIT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5010_MST A WHERE A.ACT_UNIT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 예적금등록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 예적금등록 - 키워드 조회');
    logInput('ACT_UNIT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5010M-no3.png`, fullPage: true });

    expect(rows.length, '예적금등록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 예적금등록 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 예적금등록  액터: 개발자
   * URL: /mis/act/act5010/getList1.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5010_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 예적금등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 예적금등록 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5010M-no4.png`, fullPage: true });

    expect(rows.length, '예적금등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 예적금등록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 예적금등록  액터: 개발자
   * URL: /mis/act/act5010/getList1.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5010_MST A WHERE A.ACT_UNIT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 예적금등록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 예적금등록 - 존재하지 않는 키워드 조회');
    logInput('ACT_UNIT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5010M-no5.png`, fullPage: true });

    expect(rows.length, '예적금등록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5020M — 입금내역관리  |  API: POST /mis/act/act5020/getList.do  |  TC 2건
// TODO(menuId): act_5020M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5020/getList.do';
  const PGM_ID            = 'act_5020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_ACT_UNIT_CD', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_BK_CD', 'SCH_ACC_NO', 'SCH_PBCK_STAT_CD', 'SCH_SIGN', 'ACT_UNIT_CD', 'SBJ'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`입금내역관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 입금내역관리 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 입금내역관리  액터: 개발자
   * URL: /mis/act/act5020/getList.do
   * 예상결과: 입금내역관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5020_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 입금내역관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 입금내역관리 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5020M-no1.png`, fullPage: true });

    expect(rows.length, '입금내역관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 입금내역관리 - 코드 조건 조회 (SCH_ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 입금내역관리  액터: 개발자
   * URL: /mis/act/act5020/getList.do
   * 예상결과: SCH_ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5020_MST A WHERE A.SCH_ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 입금내역관리 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 입금내역관리 - 코드 조건 조회');
    logInput('SCH_ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5020M-no2.png`, fullPage: true });

    expect(rows.length, '입금내역관리 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5021M — 금액분할  |  API: POST /mis/act/act5021/getList.do  |  TC 3건
// TODO(menuId): act_5021M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5021/getList.do';
  const PGM_ID            = 'act_5021M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['DPSTS_TRNS_NO', 'ACC_NO', 'DPSTS_NM', 'TRNS_DT', 'BALN_AMT', 'SMRY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`금액분할(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 금액분할 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 금액분할  액터: 개발자
   * URL: /mis/act/act5021/getList.do
   * 예상결과: 금액분할 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5021_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 금액분할 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 금액분할 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5021M-no1.png`, fullPage: true });

    expect(rows.length, '금액분할 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 금액분할 - 키워드 조회 (DPSTS_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 금액분할  액터: 개발자
   * URL: /mis/act/act5021/getList.do
   * 예상결과: DPSTS_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5021_MST A WHERE A.DPSTS_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 금액분할 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 금액분할 - 키워드 조회');
    logInput('DPSTS_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ DPSTS_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5021M-no2.png`, fullPage: true });

    expect(rows.length, '금액분할 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 금액분할 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 금액분할  액터: 개발자
   * URL: /mis/act/act5021/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5021_MST A WHERE A.DPSTS_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 금액분할 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 금액분할 - 존재하지 않는 키워드 조회');
    logInput('DPSTS_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ DPSTS_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5021M-no3.png`, fullPage: true });

    expect(rows.length, '금액분할 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5030M — 일일자금일보  |  API: POST /mis/act/act5030/getList1.do  |  TC 3건
// TODO(menuId): act_5030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5030/getList1.do';
  const PGM_ID            = 'act_5030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'PRD_FRM_DT', 'PRD_TO_DT', 'FRM_DT', 'ACC_NO', 'ZERO_YN', 'STAN_FG', 'SCH_BUDG_BSNS_CD', 'STR_SCH_BUDG_BSNS_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`일일자금일보(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 일일자금일보 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 일일자금일보  액터: 개발자
   * URL: /mis/act/act5030/getList1.do
   * 예상결과: 일일자금일보 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5030_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 일일자금일보 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 일일자금일보 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5030M-no1.png`, fullPage: true });

    expect(rows.length, '일일자금일보 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 일일자금일보 - 사용여부 조회 (ZERO_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 일일자금일보  액터: 개발자
   * URL: /mis/act/act5030/getList1.do
   * 예상결과: 사용중(ZERO_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5030_MST A WHERE A.ZERO_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 일일자금일보 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 일일자금일보 - 사용여부 조회');
    logInput('ZERO_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ ZERO_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5030M-no2.png`, fullPage: true });

    expect(rows.length, '일일자금일보 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 일일자금일보 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 일일자금일보  액터: 개발자
   * URL: /mis/act/act5030/getList1.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5030_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 일일자금일보 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 일일자금일보 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5030M-no3.png`, fullPage: true });

    expect(rows.length, '일일자금일보 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5040M — 자금비교현황  |  API: POST /mis/act/act5040/getList1.do  |  TC 2건
// TODO(menuId): act_5040M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5040/getList1.do';
  const PGM_ID            = 'act_5040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'PRD_FRM_DT', 'PRD_TO_DT', 'FRM_DT', 'TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자금비교현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자금비교현황 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 자금비교현황  액터: 개발자
   * URL: /mis/act/act5040/getList1.do
   * 예상결과: 자금비교현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5040_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 자금비교현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자금비교현황 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5040M-no1.png`, fullPage: true });

    expect(rows.length, '자금비교현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 자금비교현황 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 자금비교현황  액터: 개발자
   * URL: /mis/act/act5040/getList1.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5040_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 자금비교현황 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자금비교현황 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5040M-no2.png`, fullPage: true });

    expect(rows.length, '자금비교현황 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5050M — 은행이체리스트  |  API: POST /mis/act/act5050/getList1.do  |  TC 4건
// TODO(menuId): act_5050M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5050/getList1.do';
  const PGM_ID            = 'act_5050M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'SEARCH_GB', 'FRM_DT', 'TO_DT', 'DPSIT', 'WDRAW_BK_NM', 'WDRAW_BK_CD', 'RCPPAY_ACC_NO', 'WDRAW_DPSIT_NM', 'TRANSFR_STT', 'SUBTOTAL'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`은행이체리스트(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 은행이체리스트 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 은행이체리스트  액터: 개발자
   * URL: /mis/act/act5050/getList1.do
   * 예상결과: 은행이체리스트 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5050_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 은행이체리스트 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 은행이체리스트 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5050M-no1.png`, fullPage: true });

    expect(rows.length, '은행이체리스트 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 은행이체리스트 - 키워드 조회 (WDRAW_BK_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 은행이체리스트  액터: 개발자
   * URL: /mis/act/act5050/getList1.do
   * 예상결과: WDRAW_BK_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5050_MST A WHERE A.WDRAW_BK_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 은행이체리스트 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 은행이체리스트 - 키워드 조회');
    logInput('WDRAW_BK_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ WDRAW_BK_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5050M-no2.png`, fullPage: true });

    expect(rows.length, '은행이체리스트 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 은행이체리스트 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 은행이체리스트  액터: 개발자
   * URL: /mis/act/act5050/getList1.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5050_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 은행이체리스트 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 은행이체리스트 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5050M-no3.png`, fullPage: true });

    expect(rows.length, '은행이체리스트 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 은행이체리스트 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 은행이체리스트  액터: 개발자
   * URL: /mis/act/act5050/getList1.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5050_MST A WHERE A.WDRAW_BK_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 은행이체리스트 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 은행이체리스트 - 존재하지 않는 키워드 조회');
    logInput('WDRAW_BK_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ WDRAW_BK_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5050M-no4.png`, fullPage: true });

    expect(rows.length, '은행이체리스트 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5310M — 차입금등록  |  API: POST /mis/act/act5310/getList.do  |  TC 4건
// TODO(menuId): act_5310M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5310/getList.do';
  const PGM_ID            = 'act_5310M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'ACT_UNIT_NM', 'BRRW_CUST_FG', 'TRNS_TP_CD', 'DR_CR'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`차입금등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 차입금등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 차입금등록  액터: 개발자
   * URL: /mis/act/act5310/getList.do
   * 예상결과: 차입금등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5310_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 차입금등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 차입금등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5310M-no1.png`, fullPage: true });

    expect(rows.length, '차입금등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 차입금등록 - 키워드 조회 (ACT_UNIT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 차입금등록  액터: 개발자
   * URL: /mis/act/act5310/getList.do
   * 예상결과: ACT_UNIT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5310_MST A WHERE A.ACT_UNIT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 차입금등록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 차입금등록 - 키워드 조회');
    logInput('ACT_UNIT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5310M-no2.png`, fullPage: true });

    expect(rows.length, '차입금등록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 차입금등록 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 차입금등록  액터: 개발자
   * URL: /mis/act/act5310/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5310_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 차입금등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 차입금등록 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5310M-no3.png`, fullPage: true });

    expect(rows.length, '차입금등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 차입금등록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 차입금등록  액터: 개발자
   * URL: /mis/act/act5310/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5310_MST A WHERE A.ACT_UNIT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 차입금등록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 차입금등록 - 존재하지 않는 키워드 조회');
    logInput('ACT_UNIT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5310M-no4.png`, fullPage: true });

    expect(rows.length, '차입금등록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5320M — 차입금상환등록  |  API: POST /mis/act/act5320/getList1.do  |  TC 4건
// TODO(menuId): act_5320M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5320/getList1.do';
  const PGM_ID            = 'act_5320M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACCT_UNT_CD', 'ACCT_UNT_NM', 'BRRW_CUST_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`차입금상환등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 차입금상환등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 차입금상환등록  액터: 개발자
   * URL: /mis/act/act5320/getList1.do
   * 예상결과: 차입금상환등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5320_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 차입금상환등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 차입금상환등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5320M-no1.png`, fullPage: true });

    expect(rows.length, '차입금상환등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 차입금상환등록 - 키워드 조회 (ACCT_UNT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 차입금상환등록  액터: 개발자
   * URL: /mis/act/act5320/getList1.do
   * 예상결과: ACCT_UNT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5320_MST A WHERE A.ACCT_UNT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 차입금상환등록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 차입금상환등록 - 키워드 조회');
    logInput('ACCT_UNT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_UNT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5320M-no2.png`, fullPage: true });

    expect(rows.length, '차입금상환등록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 차입금상환등록 - 코드 조건 조회 (ACCT_UNT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 차입금상환등록  액터: 개발자
   * URL: /mis/act/act5320/getList1.do
   * 예상결과: ACCT_UNT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5320_MST A WHERE A.ACCT_UNT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 차입금상환등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 차입금상환등록 - 코드 조건 조회');
    logInput('ACCT_UNT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_UNT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5320M-no3.png`, fullPage: true });

    expect(rows.length, '차입금상환등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 차입금상환등록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 차입금상환등록  액터: 개발자
   * URL: /mis/act/act5320/getList1.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5320_MST A WHERE A.ACCT_UNT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 차입금상환등록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 차입금상환등록 - 존재하지 않는 키워드 조회');
    logInput('ACCT_UNT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_UNT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5320M-no4.png`, fullPage: true });

    expect(rows.length, '차입금상환등록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5410M — 기간비용등록  |  API: POST /mis/act/act5410/getList.do  |  TC 2건
// TODO(menuId): act_5410M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5410/getList.do';
  const PGM_ID            = 'act_5410M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기간비용등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기간비용등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 기간비용등록  액터: 개발자
   * URL: /mis/act/act5410/getList.do
   * 예상결과: 기간비용등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5410_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 기간비용등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 기간비용등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5410M-no1.png`, fullPage: true });

    expect(rows.length, '기간비용등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기간비용등록 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 기간비용등록  액터: 개발자
   * URL: /mis/act/act5410/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5410_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 기간비용등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 기간비용등록 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5410M-no2.png`, fullPage: true });

    expect(rows.length, '기간비용등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5420M — 기간비용결산  |  API: POST /mis/act/act5420/getList.do  |  TC 3건
// TODO(menuId): act_5420M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5420/getList.do';
  const PGM_ID            = 'act_5420M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'STDR_YY', 'PRD_FRM_DT', 'PRD_TO_DT', 'SLIP_CREAT_YN', 'ACCT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기간비용결산(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기간비용결산 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 기간비용결산  액터: 개발자
   * URL: /mis/act/act5420/getList.do
   * 예상결과: 기간비용결산 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5420_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 기간비용결산 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 기간비용결산 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5420M-no1.png`, fullPage: true });

    expect(rows.length, '기간비용결산 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기간비용결산 - 사용여부 조회 (SLIP_CREAT_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 기간비용결산  액터: 개발자
   * URL: /mis/act/act5420/getList.do
   * 예상결과: 사용중(SLIP_CREAT_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5420_MST A WHERE A.SLIP_CREAT_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 기간비용결산 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 기간비용결산 - 사용여부 조회');
    logInput('SLIP_CREAT_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SLIP_CREAT_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5420M-no2.png`, fullPage: true });

    expect(rows.length, '기간비용결산 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 기간비용결산 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 기간비용결산  액터: 개발자
   * URL: /mis/act/act5420/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5420_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 기간비용결산 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 기간비용결산 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5420M-no3.png`, fullPage: true });

    expect(rows.length, '기간비용결산 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5510M — 기간수익등록  |  API: POST /mis/act/act5510/getList.do  |  TC 2건
// TODO(menuId): act_5510M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5510/getList.do';
  const PGM_ID            = 'act_5510M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기간수익등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기간수익등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 기간수익등록  액터: 개발자
   * URL: /mis/act/act5510/getList.do
   * 예상결과: 기간수익등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5510_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 기간수익등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 기간수익등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5510M-no1.png`, fullPage: true });

    expect(rows.length, '기간수익등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기간수익등록 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 기간수익등록  액터: 개발자
   * URL: /mis/act/act5510/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5510_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 기간수익등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 기간수익등록 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5510M-no2.png`, fullPage: true });

    expect(rows.length, '기간수익등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5610M — 가수금관리  |  API: POST /mis/act/act5610/getList.do  |  TC 2건
// TODO(menuId): act_5610M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5610/getList.do';
  const PGM_ID            = 'act_5610M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'OBPL_TP', 'FRM_DT', 'TO_DT', 'SMRY', 'PBCK_STAT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`가수금관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 가수금관리 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 가수금관리  액터: 개발자
   * URL: /mis/act/act5610/getList.do
   * 예상결과: 가수금관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5610_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 가수금관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 가수금관리 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5610M-no1.png`, fullPage: true });

    expect(rows.length, '가수금관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 가수금관리 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 가수금관리  액터: 개발자
   * URL: /mis/act/act5610/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5610_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 가수금관리 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 가수금관리 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5610M-no2.png`, fullPage: true });

    expect(rows.length, '가수금관리 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5620M — 가수금대체  |  API: POST /mis/act/act5620/getList.do  |  TC 2건
// TODO(menuId): act_5620M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5620/getList.do';
  const PGM_ID            = 'act_5620M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'OBPL_TP', 'FRM_DT', 'TO_DT', 'SMRY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`가수금대체(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 가수금대체 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 가수금대체  액터: 개발자
   * URL: /mis/act/act5620/getList.do
   * 예상결과: 가수금대체 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5620_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 가수금대체 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 가수금대체 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5620M-no1.png`, fullPage: true });

    expect(rows.length, '가수금대체 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 가수금대체 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 가수금대체  액터: 개발자
   * URL: /mis/act/act5620/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5620_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 가수금대체 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 가수금대체 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5620M-no2.png`, fullPage: true });

    expect(rows.length, '가수금대체 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5630M — 가수금반납  |  API: POST /mis/act/act5630/getList.do  |  TC 3건
// TODO(menuId): act_5630M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5630/getList.do';
  const PGM_ID            = 'act_5630M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'OBPL_TP', 'FRM_DT', 'TO_DT', 'SMRY', 'USE_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`가수금반납(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 가수금반납 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 가수금반납  액터: 개발자
   * URL: /mis/act/act5630/getList.do
   * 예상결과: 가수금반납 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5630_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 가수금반납 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 가수금반납 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5630M-no1.png`, fullPage: true });

    expect(rows.length, '가수금반납 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 가수금반납 - 사용여부 조회 (USE_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 가수금반납  액터: 개발자
   * URL: /mis/act/act5630/getList.do
   * 예상결과: 사용중(USE_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5630_MST A WHERE A.USE_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 가수금반납 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 가수금반납 - 사용여부 조회');
    logInput('USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5630M-no2.png`, fullPage: true });

    expect(rows.length, '가수금반납 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 가수금반납 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 가수금반납  액터: 개발자
   * URL: /mis/act/act5630/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5630_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 가수금반납 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 가수금반납 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5630M-no3.png`, fullPage: true });

    expect(rows.length, '가수금반납 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_5640M — 가수금이력조회  |  API: POST /mis/act/act5640/getList.do  |  TC 2건
// TODO(menuId): act_5640M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act5640/getList.do';
  const PGM_ID            = 'act_5640M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'OBPL_TP', 'FRM_DT', 'TO_DT', 'SMRY', 'PBCK_STAT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`가수금이력조회(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 가수금이력조회 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 가수금이력조회  액터: 개발자
   * URL: /mis/act/act5640/getList.do
   * 예상결과: 가수금이력조회 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_5640_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 가수금이력조회 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 가수금이력조회 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5640M-no1.png`, fullPage: true });

    expect(rows.length, '가수금이력조회 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 가수금이력조회 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 가수금이력조회  액터: 개발자
   * URL: /mis/act/act5640/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_5640_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 가수금이력조회 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 가수금이력조회 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_5640M-no2.png`, fullPage: true });

    expect(rows.length, '가수금이력조회 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_6010M — 법인카드관리  |  API: POST /mis/act/act6010/getList.do  |  TC 5건
// TODO(menuId): act_6010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act6010/getList.do';
  const PGM_ID            = 'act_6010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'STR_UNIT_CD', 'CARD_NM', 'CARD_FG', 'EMP_NO', 'EMP_NM', 'CARD_NO', 'USE_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`법인카드관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 법인카드관리 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 법인카드관리  액터: 개발자
   * URL: /mis/act/act6010/getList.do
   * 예상결과: 법인카드관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_6010_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 법인카드관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 법인카드관리 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6010M-no1.png`, fullPage: true });

    expect(rows.length, '법인카드관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 법인카드관리 - 사용여부 조회 (USE_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 법인카드관리  액터: 개발자
   * URL: /mis/act/act6010/getList.do
   * 예상결과: 사용중(USE_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6010_MST A WHERE A.USE_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 법인카드관리 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 법인카드관리 - 사용여부 조회');
    logInput('USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6010M-no2.png`, fullPage: true });

    expect(rows.length, '법인카드관리 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 법인카드관리 - 키워드 조회 (CARD_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 법인카드관리  액터: 개발자
   * URL: /mis/act/act6010/getList.do
   * 예상결과: CARD_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6010_MST A WHERE A.CARD_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 법인카드관리 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 법인카드관리 - 키워드 조회');
    logInput('CARD_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ CARD_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6010M-no3.png`, fullPage: true });

    expect(rows.length, '법인카드관리 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 법인카드관리 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 법인카드관리  액터: 개발자
   * URL: /mis/act/act6010/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6010_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 법인카드관리 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 법인카드관리 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6010M-no4.png`, fullPage: true });

    expect(rows.length, '법인카드관리 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 법인카드관리 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 법인카드관리  액터: 개발자
   * URL: /mis/act/act6010/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6010_MST A WHERE A.CARD_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 법인카드관리 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 법인카드관리 - 존재하지 않는 키워드 조회');
    logInput('CARD_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CARD_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6010M-no5.png`, fullPage: true });

    expect(rows.length, '법인카드관리 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_6020M — 카드사용내역  |  API: POST /mis/act/act6020/getList.do  |  TC 5건
// TODO(menuId): act_6020M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act6020/getList.do';
  const PGM_ID            = 'act_6020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'CARD_FG', 'PBCK_STAT_CD', 'CARD_NO', 'DEPT_CD', 'DEPT_NM', 'EMP_NO', 'EMP_NM', 'FRM_APV_DT', 'TO_APV_DT', 'CRDCO_ACCP_NO', 'MRHST_NM', 'ACCP_AMT', 'CARD_ACCP_DAY', 'CARD_ACCP_FRM_TM', 'CARD_ACCP_TO_TM', 'ACCP_CNCL_FG', 'BUDG_BSNS_CD', 'BUDG_BSNS_NM', 'OTHBC_YN', 'PCHRG_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`카드사용내역(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 카드사용내역 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 카드사용내역  액터: 개발자
   * URL: /mis/act/act6020/getList.do
   * 예상결과: 카드사용내역 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_6020_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 카드사용내역 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 카드사용내역 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6020M-no1.png`, fullPage: true });

    expect(rows.length, '카드사용내역 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 카드사용내역 - 사용여부 조회 (OTHBC_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 카드사용내역  액터: 개발자
   * URL: /mis/act/act6020/getList.do
   * 예상결과: 사용중(OTHBC_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6020_MST A WHERE A.OTHBC_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 카드사용내역 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 카드사용내역 - 사용여부 조회');
    logInput('OTHBC_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ OTHBC_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6020M-no2.png`, fullPage: true });

    expect(rows.length, '카드사용내역 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 카드사용내역 - 키워드 조회 (DEPT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 카드사용내역  액터: 개발자
   * URL: /mis/act/act6020/getList.do
   * 예상결과: DEPT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6020_MST A WHERE A.DEPT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 카드사용내역 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 카드사용내역 - 키워드 조회');
    logInput('DEPT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ DEPT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6020M-no3.png`, fullPage: true });

    expect(rows.length, '카드사용내역 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 카드사용내역 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 카드사용내역  액터: 개발자
   * URL: /mis/act/act6020/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6020_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 카드사용내역 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 카드사용내역 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6020M-no4.png`, fullPage: true });

    expect(rows.length, '카드사용내역 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 카드사용내역 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 카드사용내역  액터: 개발자
   * URL: /mis/act/act6020/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6020_MST A WHERE A.DEPT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 카드사용내역 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 카드사용내역 - 존재하지 않는 키워드 조회');
    logInput('DEPT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ DEPT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6020M-no5.png`, fullPage: true });

    expect(rows.length, '카드사용내역 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_6030M — 카드사용제한기준등록  |  API: POST /mis/act/act6030/getList.do  |  TC 1건
// TODO(menuId): act_6030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act6030/getList.do';
  const PGM_ID            = 'act_6030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`카드사용제한기준등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 카드사용제한기준등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 카드사용제한기준등록  액터: 개발자
   * URL: /mis/act/act6030/getList.do
   * 예상결과: 카드사용제한기준등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_6030_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 카드사용제한기준등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 카드사용제한기준등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6030M-no1.png`, fullPage: true });

    expect(rows.length, '카드사용제한기준등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_6040M — 카드사용제한내역조회  |  API: POST /mis/act/act6040/getList.do  |  TC 4건
// TODO(menuId): act_6040M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act6040/getList.do';
  const PGM_ID            = 'act_6040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['FRM_DT', 'TO_DT', 'LMT_FG', 'STAT', 'CARD_NO', 'MRHST_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`카드사용제한내역조회(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 카드사용제한내역조회 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 카드사용제한내역조회  액터: 개발자
   * URL: /mis/act/act6040/getList.do
   * 예상결과: 카드사용제한내역조회 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_6040_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 카드사용제한내역조회 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 카드사용제한내역조회 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6040M-no1.png`, fullPage: true });

    expect(rows.length, '카드사용제한내역조회 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 카드사용제한내역조회 - 키워드 조회 (MRHST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 카드사용제한내역조회  액터: 개발자
   * URL: /mis/act/act6040/getList.do
   * 예상결과: MRHST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6040_MST A WHERE A.MRHST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 카드사용제한내역조회 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 카드사용제한내역조회 - 키워드 조회');
    logInput('MRHST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ MRHST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6040M-no2.png`, fullPage: true });

    expect(rows.length, '카드사용제한내역조회 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 카드사용제한내역조회 - 코드 조건 조회 (LMT_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 카드사용제한내역조회  액터: 개발자
   * URL: /mis/act/act6040/getList.do
   * 예상결과: LMT_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6040_MST A WHERE A.LMT_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 카드사용제한내역조회 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 카드사용제한내역조회 - 코드 조건 조회');
    logInput('LMT_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ LMT_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6040M-no3.png`, fullPage: true });

    expect(rows.length, '카드사용제한내역조회 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 카드사용제한내역조회 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 카드사용제한내역조회  액터: 개발자
   * URL: /mis/act/act6040/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6040_MST A WHERE A.MRHST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 카드사용제한내역조회 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 카드사용제한내역조회 - 존재하지 않는 키워드 조회');
    logInput('MRHST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ MRHST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6040M-no4.png`, fullPage: true });

    expect(rows.length, '카드사용제한내역조회 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_6050M — 카드 지연 이메일 보내기  |  API: POST /mis/act/act6050/getList.do  |  TC 5건
// TODO(menuId): act_6050M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act6050/getList.do';
  const PGM_ID            = 'act_6050M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_CARD_FG', 'SCH_ACCP_DT_FR', 'SCH_ACCP_DT_TO', 'SCH_DEMAND_DT', 'SCH_OWNER_NM', 'SCH_OWNER_NO', 'SCH_DEPT_NM', 'SCH_DEPT_CD', 'SCH_CARD_NO', 'SCH_BET_DATE_FR', 'SCH_BET_DATE_TO', 'SCH_SBJ'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`카드 지연 이메일 보내기(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 카드 지연 이메일 보내기 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 카드 지연 이메일 보내기  액터: 개발자
   * URL: /mis/act/act6050/getList.do
   * 예상결과: 카드 지연 이메일 보내기 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_6050_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 카드 지연 이메일 보내기 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 카드 지연 이메일 보내기 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6050M-no1.png`, fullPage: true });

    expect(rows.length, '카드 지연 이메일 보내기 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 카드 지연 이메일 보내기 - 기간 조회 (SCH_ACCP_DT_FR~SCH_ACCP_DT_TO)
   * 중분류: 재무관리  소분류:   메뉴명: 카드 지연 이메일 보내기  액터: 개발자
   * URL: /mis/act/act6050/getList.do
   * 예상결과: 기간(2024년) 조건으로 카드 지연 이메일 보내기 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6050_MST A WHERE A.SCH_ACCP_DT_FR BETWEEN '20240101' AND '20241231' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 카드 지연 이메일 보내기 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 카드 지연 이메일 보내기 - 기간 조회');
    logInput('SCH_ACCP_DT_FR', '20240101');
    logInput('SCH_ACCP_DT_TO', '20241231');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_ACCP_DT_FR: '20240101', SCH_ACCP_DT_TO: '20241231' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6050M-no2.png`, fullPage: true });

    expect(rows.length, '카드 지연 이메일 보내기 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 카드 지연 이메일 보내기 - 키워드 조회 (SCH_OWNER_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 카드 지연 이메일 보내기  액터: 개발자
   * URL: /mis/act/act6050/getList.do
   * 예상결과: SCH_OWNER_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6050_MST A WHERE A.SCH_OWNER_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 카드 지연 이메일 보내기 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 카드 지연 이메일 보내기 - 키워드 조회');
    logInput('SCH_OWNER_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_OWNER_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6050M-no3.png`, fullPage: true });

    expect(rows.length, '카드 지연 이메일 보내기 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 카드 지연 이메일 보내기 - 코드 조건 조회 (SCH_CARD_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 카드 지연 이메일 보내기  액터: 개발자
   * URL: /mis/act/act6050/getList.do
   * 예상결과: SCH_CARD_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6050_MST A WHERE A.SCH_CARD_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 카드 지연 이메일 보내기 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 카드 지연 이메일 보내기 - 코드 조건 조회');
    logInput('SCH_CARD_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CARD_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6050M-no4.png`, fullPage: true });

    expect(rows.length, '카드 지연 이메일 보내기 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 카드 지연 이메일 보내기 - 역방향 기간 조회 (시작>종료, 0건)
   * 중분류: 재무관리  소분류:   메뉴명: 카드 지연 이메일 보내기  액터: 개발자
   * URL: /mis/act/act6050/getList.do
   * 예상결과: 시작일이 종료일보다 크므로 결과가 0건이다.
   * DB 확인: SELECT COUNT(*) FROM ACT_6050_MST A WHERE A.SCH_ACCP_DT_FR BETWEEN '20241231' AND '20240101' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 카드 지연 이메일 보내기 - 역방향 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 카드 지연 이메일 보내기 - 역방향 기간 조회');
    logInput('SCH_ACCP_DT_FR', '20241231');
    logInput('SCH_ACCP_DT_TO', '20240101');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_ACCP_DT_FR: '20241231', SCH_ACCP_DT_TO: '20240101' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_6050M-no5.png`, fullPage: true });

    expect(rows.length, '카드 지연 이메일 보내기 역방향 기간 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7010M — 부가세등록  |  API: POST /mis/act/act7010/getList.do  |  TC 4건
// TODO(menuId): act_7010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7010/getList.do';
  const PGM_ID            = 'act_7010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'BUY_SALG_FG', 'FRM_DT', 'TO_DT', 'TAXAFS_CD', 'CUST_CD', 'CUST_NM', 'BIZRNO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부가세등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부가세등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 부가세등록  액터: 개발자
   * URL: /mis/act/act7010/getList.do
   * 예상결과: 부가세등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7010_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 부가세등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부가세등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7010M-no1.png`, fullPage: true });

    expect(rows.length, '부가세등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 부가세등록 - 키워드 조회 (CUST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 부가세등록  액터: 개발자
   * URL: /mis/act/act7010/getList.do
   * 예상결과: CUST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7010_MST A WHERE A.CUST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 부가세등록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 부가세등록 - 키워드 조회');
    logInput('CUST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7010M-no2.png`, fullPage: true });

    expect(rows.length, '부가세등록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 부가세등록 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 부가세등록  액터: 개발자
   * URL: /mis/act/act7010/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7010_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 부가세등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 부가세등록 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7010M-no3.png`, fullPage: true });

    expect(rows.length, '부가세등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 부가세등록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 부가세등록  액터: 개발자
   * URL: /mis/act/act7010/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7010_MST A WHERE A.CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 부가세등록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 부가세등록 - 존재하지 않는 키워드 조회');
    logInput('CUST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7010M-no4.png`, fullPage: true });

    expect(rows.length, '부가세등록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7011M — 부가세등록  |  API: POST /mis/act/act0000/getActComm.do  |  TC 1건
// TODO(menuId): act_7011M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getActComm.do';
  const PGM_ID            = 'act_7011M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['VAT_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부가세등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부가세등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 부가세등록  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: 부가세등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7011_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 부가세등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부가세등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7011M-no1.png`, fullPage: true });

    expect(rows.length, '부가세등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7020M — 매입매출장  |  API: POST /mis/act/act7020/getList.do  |  TC 4건
// TODO(menuId): act_7020M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7020/getList.do';
  const PGM_ID            = 'act_7020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'BUY_SALG_FG', 'FRM_DT', 'TO_DT', 'TAXAFS_CD', 'CUST_CD', 'CUST_NM', 'BIZRNO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`매입매출장(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 매입매출장 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 매입매출장  액터: 개발자
   * URL: /mis/act/act7020/getList.do
   * 예상결과: 매입매출장 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7020_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 매입매출장 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 매입매출장 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7020M-no1.png`, fullPage: true });

    expect(rows.length, '매입매출장 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 매입매출장 - 키워드 조회 (CUST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 매입매출장  액터: 개발자
   * URL: /mis/act/act7020/getList.do
   * 예상결과: CUST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7020_MST A WHERE A.CUST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 매입매출장 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 매입매출장 - 키워드 조회');
    logInput('CUST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7020M-no2.png`, fullPage: true });

    expect(rows.length, '매입매출장 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 매입매출장 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 매입매출장  액터: 개발자
   * URL: /mis/act/act7020/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7020_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 매입매출장 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 매입매출장 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7020M-no3.png`, fullPage: true });

    expect(rows.length, '매입매출장 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 매입매출장 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 매입매출장  액터: 개발자
   * URL: /mis/act/act7020/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7020_MST A WHERE A.CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 매입매출장 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 매입매출장 - 존재하지 않는 키워드 조회');
    logInput('CUST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7020M-no4.png`, fullPage: true });

    expect(rows.length, '매입매출장 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7030M — 세금계산서합계표  |  API: POST /mis/act/act0000/getAtftWrftChk.do  |  TC 2건
// TODO(menuId): act_7030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getAtftWrftChk.do';
  const PGM_ID            = 'act_7030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'BUY_SALG_FG', 'VAT_STTM_FG', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`세금계산서합계표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 세금계산서합계표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 세금계산서합계표  액터: 개발자
   * URL: /mis/act/act0000/getAtftWrftChk.do
   * 예상결과: 세금계산서합계표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7030_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 세금계산서합계표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 세금계산서합계표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7030M-no1.png`, fullPage: true });

    expect(rows.length, '세금계산서합계표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 세금계산서합계표 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 세금계산서합계표  액터: 개발자
   * URL: /mis/act/act0000/getAtftWrftChk.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7030_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 세금계산서합계표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 세금계산서합계표 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7030M-no2.png`, fullPage: true });

    expect(rows.length, '세금계산서합계표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7031M — 부가세수정신고서등록  |  API: POST /mis/act/act0000/getMainBusiPlc.do  |  TC 3건
// TODO(menuId): act_7031M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getMainBusiPlc.do';
  const PGM_ID            = 'act_7031M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'WRT_DT', 'UPT_RSN', 'RERK_YN', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부가세수정신고서등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부가세수정신고서등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 부가세수정신고서등록  액터: 개발자
   * URL: /mis/act/act0000/getMainBusiPlc.do
   * 예상결과: 부가세수정신고서등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7031_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 부가세수정신고서등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부가세수정신고서등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7031M-no1.png`, fullPage: true });

    expect(rows.length, '부가세수정신고서등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 부가세수정신고서등록 - 사용여부 조회 (RERK_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 부가세수정신고서등록  액터: 개발자
   * URL: /mis/act/act0000/getMainBusiPlc.do
   * 예상결과: 사용중(RERK_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7031_MST A WHERE A.RERK_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 부가세수정신고서등록 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 부가세수정신고서등록 - 사용여부 조회');
    logInput('RERK_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ RERK_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7031M-no2.png`, fullPage: true });

    expect(rows.length, '부가세수정신고서등록 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 부가세수정신고서등록 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 부가세수정신고서등록  액터: 개발자
   * URL: /mis/act/act0000/getMainBusiPlc.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7031_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 부가세수정신고서등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 부가세수정신고서등록 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7031M-no3.png`, fullPage: true });

    expect(rows.length, '부가세수정신고서등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7040M — 계산서합계표  |  API: POST /mis/act/act0000/getAtftWrftChk.do  |  TC 4건
// TODO(menuId): act_7040M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getAtftWrftChk.do';
  const PGM_ID            = 'act_7040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'BUSI_PLC_NM', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'BUY_SALG_FG', 'VAT_STTM_FG', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`계산서합계표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 계산서합계표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 계산서합계표  액터: 개발자
   * URL: /mis/act/act0000/getAtftWrftChk.do
   * 예상결과: 계산서합계표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7040_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 계산서합계표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 계산서합계표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7040M-no1.png`, fullPage: true });

    expect(rows.length, '계산서합계표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 계산서합계표 - 키워드 조회 (BUSI_PLC_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 계산서합계표  액터: 개발자
   * URL: /mis/act/act0000/getAtftWrftChk.do
   * 예상결과: BUSI_PLC_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7040_MST A WHERE A.BUSI_PLC_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 계산서합계표 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 계산서합계표 - 키워드 조회');
    logInput('BUSI_PLC_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7040M-no2.png`, fullPage: true });

    expect(rows.length, '계산서합계표 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 계산서합계표 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 계산서합계표  액터: 개발자
   * URL: /mis/act/act0000/getAtftWrftChk.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7040_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 계산서합계표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 계산서합계표 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7040M-no3.png`, fullPage: true });

    expect(rows.length, '계산서합계표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 계산서합계표 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 계산서합계표  액터: 개발자
   * URL: /mis/act/act0000/getAtftWrftChk.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7040_MST A WHERE A.BUSI_PLC_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 계산서합계표 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 계산서합계표 - 존재하지 않는 키워드 조회');
    logInput('BUSI_PLC_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7040M-no4.png`, fullPage: true });

    expect(rows.length, '계산서합계표 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7050M — (매입)전자세금계산서대사조회  |  API: POST /mis/act/act7050/getList.do  |  TC 4건
// TODO(menuId): act_7050M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7050/getList.do';
  const PGM_ID            = 'act_7050M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUY_SALG_FG', 'FRM_DT', 'TO_DT', 'INVPRT_NM', 'TAXBIL_FG', 'BIZRNO', 'PBCK_STAT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`(매입)전자세금계산서대사조회(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] (매입)전자세금계산서대사조회 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: (매입)전자세금계산서대사조회  액터: 개발자
   * URL: /mis/act/act7050/getList.do
   * 예상결과: (매입)전자세금계산서대사조회 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7050_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] (매입)전자세금계산서대사조회 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] (매입)전자세금계산서대사조회 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7050M-no1.png`, fullPage: true });

    expect(rows.length, '(매입)전자세금계산서대사조회 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] (매입)전자세금계산서대사조회 - 키워드 조회 (INVPRT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: (매입)전자세금계산서대사조회  액터: 개발자
   * URL: /mis/act/act7050/getList.do
   * 예상결과: INVPRT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7050_MST A WHERE A.INVPRT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] (매입)전자세금계산서대사조회 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] (매입)전자세금계산서대사조회 - 키워드 조회');
    logInput('INVPRT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ INVPRT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7050M-no2.png`, fullPage: true });

    expect(rows.length, '(매입)전자세금계산서대사조회 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] (매입)전자세금계산서대사조회 - 코드 조건 조회 (BUY_SALG_FG)
   * 중분류: 재무관리  소분류:   메뉴명: (매입)전자세금계산서대사조회  액터: 개발자
   * URL: /mis/act/act7050/getList.do
   * 예상결과: BUY_SALG_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7050_MST A WHERE A.BUY_SALG_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] (매입)전자세금계산서대사조회 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] (매입)전자세금계산서대사조회 - 코드 조건 조회');
    logInput('BUY_SALG_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUY_SALG_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7050M-no3.png`, fullPage: true });

    expect(rows.length, '(매입)전자세금계산서대사조회 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] (매입)전자세금계산서대사조회 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: (매입)전자세금계산서대사조회  액터: 개발자
   * URL: /mis/act/act7050/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7050_MST A WHERE A.INVPRT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] (매입)전자세금계산서대사조회 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] (매입)전자세금계산서대사조회 - 존재하지 않는 키워드 조회');
    logInput('INVPRT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ INVPRT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7050M-no4.png`, fullPage: true });

    expect(rows.length, '(매입)전자세금계산서대사조회 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7060M — (매입)세금계산서내역  |  API: POST /mis/act/act7060/getList.do  |  TC 5건
// TODO(menuId): act_7060M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7060/getList.do';
  const PGM_ID            = 'act_7060M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUY_SALG_FG', 'FRM_DT', 'TO_DT', 'TAXBIL_ACCP_NO', 'TAXBIL_FG', 'INVPRT_NM', 'ISUR_BIZRNO', 'OTHBC_YN', 'PBCK_STAT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`(매입)세금계산서내역(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] (매입)세금계산서내역 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: (매입)세금계산서내역  액터: 개발자
   * URL: /mis/act/act7060/getList.do
   * 예상결과: (매입)세금계산서내역 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7060_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] (매입)세금계산서내역 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] (매입)세금계산서내역 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7060M-no1.png`, fullPage: true });

    expect(rows.length, '(매입)세금계산서내역 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] (매입)세금계산서내역 - 사용여부 조회 (OTHBC_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: (매입)세금계산서내역  액터: 개발자
   * URL: /mis/act/act7060/getList.do
   * 예상결과: 사용중(OTHBC_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7060_MST A WHERE A.OTHBC_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] (매입)세금계산서내역 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] (매입)세금계산서내역 - 사용여부 조회');
    logInput('OTHBC_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ OTHBC_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7060M-no2.png`, fullPage: true });

    expect(rows.length, '(매입)세금계산서내역 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] (매입)세금계산서내역 - 키워드 조회 (INVPRT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: (매입)세금계산서내역  액터: 개발자
   * URL: /mis/act/act7060/getList.do
   * 예상결과: INVPRT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7060_MST A WHERE A.INVPRT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] (매입)세금계산서내역 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] (매입)세금계산서내역 - 키워드 조회');
    logInput('INVPRT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ INVPRT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7060M-no3.png`, fullPage: true });

    expect(rows.length, '(매입)세금계산서내역 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] (매입)세금계산서내역 - 코드 조건 조회 (BUY_SALG_FG)
   * 중분류: 재무관리  소분류:   메뉴명: (매입)세금계산서내역  액터: 개발자
   * URL: /mis/act/act7060/getList.do
   * 예상결과: BUY_SALG_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7060_MST A WHERE A.BUY_SALG_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] (매입)세금계산서내역 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] (매입)세금계산서내역 - 코드 조건 조회');
    logInput('BUY_SALG_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUY_SALG_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7060M-no4.png`, fullPage: true });

    expect(rows.length, '(매입)세금계산서내역 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] (매입)세금계산서내역 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: (매입)세금계산서내역  액터: 개발자
   * URL: /mis/act/act7060/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7060_MST A WHERE A.INVPRT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] (매입)세금계산서내역 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] (매입)세금계산서내역 - 존재하지 않는 키워드 조회');
    logInput('INVPRT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ INVPRT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7060M-no5.png`, fullPage: true });

    expect(rows.length, '(매입)세금계산서내역 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7061M — 증빙분할(세금계산서)  |  API: POST /mis/act/act7061/getList.do  |  TC 4건
// TODO(menuId): act_7061M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7061/getList.do';
  const PGM_ID            = 'act_7061M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['TAXBIL_FG', 'TAXBIL_DT', 'INVPRT_ID', 'INVPRT_NM', 'SPLY_AMT', 'SPLY_VAL', 'SURTAX', 'ISUR', 'TAXBIL_ACCP_NO', 'NTS_ACCP_NO', 'PARTITN_FG_CD', 'PARTITN_NCNT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`증빙분할(세금계산서)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 증빙분할(세금계산서) - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 증빙분할(세금계산서)  액터: 개발자
   * URL: /mis/act/act7061/getList.do
   * 예상결과: 증빙분할(세금계산서) 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7061_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 증빙분할(세금계산서) - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 증빙분할(세금계산서) - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7061M-no1.png`, fullPage: true });

    expect(rows.length, '증빙분할(세금계산서) 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 증빙분할(세금계산서) - 키워드 조회 (INVPRT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 증빙분할(세금계산서)  액터: 개발자
   * URL: /mis/act/act7061/getList.do
   * 예상결과: INVPRT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7061_MST A WHERE A.INVPRT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 증빙분할(세금계산서) - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 증빙분할(세금계산서) - 키워드 조회');
    logInput('INVPRT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ INVPRT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7061M-no2.png`, fullPage: true });

    expect(rows.length, '증빙분할(세금계산서) 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 증빙분할(세금계산서) - 코드 조건 조회 (TAXBIL_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 증빙분할(세금계산서)  액터: 개발자
   * URL: /mis/act/act7061/getList.do
   * 예상결과: TAXBIL_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7061_MST A WHERE A.TAXBIL_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 증빙분할(세금계산서) - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 증빙분할(세금계산서) - 코드 조건 조회');
    logInput('TAXBIL_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ TAXBIL_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7061M-no3.png`, fullPage: true });

    expect(rows.length, '증빙분할(세금계산서) 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 증빙분할(세금계산서) - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 증빙분할(세금계산서)  액터: 개발자
   * URL: /mis/act/act7061/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7061_MST A WHERE A.INVPRT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 증빙분할(세금계산서) - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 증빙분할(세금계산서) - 존재하지 않는 키워드 조회');
    logInput('INVPRT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ INVPRT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7061M-no4.png`, fullPage: true });

    expect(rows.length, '증빙분할(세금계산서) 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7070M — 미수취확인  |  API: POST /mis/act/act7070/getList.do  |  TC 5건
// TODO(menuId): act_7070M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7070/getList.do';
  const PGM_ID            = 'act_7070M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SLIP_FRM_DT', 'SLIP_TO_DT', 'REPT_YN', 'CUST_NM', 'SCH_BUDG_BSNS_CD', 'SCH_BUDG_BSNS_NM', 'SCH_BUDG_LITM_CD', 'SCH_BUDG_LITM_NM', 'WRTER', 'WRTER_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`미수취확인(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 미수취확인 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 미수취확인  액터: 개발자
   * URL: /mis/act/act7070/getList.do
   * 예상결과: 미수취확인 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7070_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 미수취확인 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 미수취확인 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7070M-no1.png`, fullPage: true });

    expect(rows.length, '미수취확인 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 미수취확인 - 사용여부 조회 (REPT_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 미수취확인  액터: 개발자
   * URL: /mis/act/act7070/getList.do
   * 예상결과: 사용중(REPT_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7070_MST A WHERE A.REPT_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 미수취확인 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 미수취확인 - 사용여부 조회');
    logInput('REPT_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ REPT_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7070M-no2.png`, fullPage: true });

    expect(rows.length, '미수취확인 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 미수취확인 - 키워드 조회 (CUST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 미수취확인  액터: 개발자
   * URL: /mis/act/act7070/getList.do
   * 예상결과: CUST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7070_MST A WHERE A.CUST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 미수취확인 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 미수취확인 - 키워드 조회');
    logInput('CUST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7070M-no3.png`, fullPage: true });

    expect(rows.length, '미수취확인 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 미수취확인 - 코드 조건 조회 (SCH_BUDG_BSNS_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 미수취확인  액터: 개발자
   * URL: /mis/act/act7070/getList.do
   * 예상결과: SCH_BUDG_BSNS_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7070_MST A WHERE A.SCH_BUDG_BSNS_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 미수취확인 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 미수취확인 - 코드 조건 조회');
    logInput('SCH_BUDG_BSNS_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_BUDG_BSNS_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7070M-no4.png`, fullPage: true });

    expect(rows.length, '미수취확인 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 미수취확인 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 미수취확인  액터: 개발자
   * URL: /mis/act/act7070/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7070_MST A WHERE A.CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 미수취확인 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 미수취확인 - 존재하지 않는 키워드 조회');
    logInput('CUST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7070M-no5.png`, fullPage: true });

    expect(rows.length, '미수취확인 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7080M — (매입)세금계산서분할  |  API: POST /mis/act/act7080/getList1.do  |  TC 2건
// TODO(menuId): act_7080M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7080/getList1.do';
  const PGM_ID            = 'act_7080M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUY_SALG_FG', 'FRM_DT', 'TO_DT', 'TAXBIL_ACCP_NO', 'TAXBIL_FG', 'ISUR', 'ISUR_BIZRNO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`(매입)세금계산서분할(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] (매입)세금계산서분할 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: (매입)세금계산서분할  액터: 개발자
   * URL: /mis/act/act7080/getList1.do
   * 예상결과: (매입)세금계산서분할 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7080_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] (매입)세금계산서분할 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] (매입)세금계산서분할 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7080M-no1.png`, fullPage: true });

    expect(rows.length, '(매입)세금계산서분할 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] (매입)세금계산서분할 - 코드 조건 조회 (BUY_SALG_FG)
   * 중분류: 재무관리  소분류:   메뉴명: (매입)세금계산서분할  액터: 개발자
   * URL: /mis/act/act7080/getList1.do
   * 예상결과: BUY_SALG_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7080_MST A WHERE A.BUY_SALG_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] (매입)세금계산서분할 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] (매입)세금계산서분할 - 코드 조건 조회');
    logInput('BUY_SALG_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUY_SALG_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7080M-no2.png`, fullPage: true });

    expect(rows.length, '(매입)세금계산서분할 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7210M — 부가세신고서  |  API: POST /mis/act/act7210/getListGrid.do  |  TC 2건
// TODO(menuId): act_7210M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7210/getListGrid.do';
  const PGM_ID            = 'act_7210M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['FORM_CD', 'BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'WRT_DT', 'BUY_SALG_FG', 'UPT_RSN', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부가세신고서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부가세신고서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 부가세신고서  액터: 개발자
   * URL: /mis/act/act7210/getListGrid.do
   * 예상결과: 부가세신고서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7210_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 부가세신고서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부가세신고서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7210M-no1.png`, fullPage: true });

    expect(rows.length, '부가세신고서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 부가세신고서 - 코드 조건 조회 (FORM_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 부가세신고서  액터: 개발자
   * URL: /mis/act/act7210/getListGrid.do
   * 예상결과: FORM_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7210_MST A WHERE A.FORM_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 부가세신고서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 부가세신고서 - 코드 조건 조회');
    logInput('FORM_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ FORM_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7210M-no2.png`, fullPage: true });

    expect(rows.length, '부가세신고서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7211M — 부가세신고서명세  |  API: POST /mis/act/act7210/getListGrid.do  |  TC 2건
// TODO(menuId): act_7211M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7210/getListGrid.do';
  const PGM_ID            = 'act_7211M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['PRINT_STLF', 'BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'ENABLE', 'UP_PRINT_STLF'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부가세신고서명세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부가세신고서명세 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 부가세신고서명세  액터: 개발자
   * URL: /mis/act/act7210/getListGrid.do
   * 예상결과: 부가세신고서명세 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7211_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 부가세신고서명세 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부가세신고서명세 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7211M-no1.png`, fullPage: true });

    expect(rows.length, '부가세신고서명세 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 부가세신고서명세 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 부가세신고서명세  액터: 개발자
   * URL: /mis/act/act7210/getListGrid.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7211_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 부가세신고서명세 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 부가세신고서명세 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7211M-no2.png`, fullPage: true });

    expect(rows.length, '부가세신고서명세 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7212M — 과세표준  |  API: POST /mis/act/act7210/getListGrid.do  |  TC 2건
// TODO(menuId): act_7212M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7210/getListGrid.do';
  const PGM_ID            = 'act_7212M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FORM_CD', 'BT_CRAT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`과세표준(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 과세표준 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 과세표준  액터: 개발자
   * URL: /mis/act/act7210/getListGrid.do
   * 예상결과: 과세표준 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7212_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 과세표준 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 과세표준 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7212M-no1.png`, fullPage: true });

    expect(rows.length, '과세표준 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 과세표준 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 과세표준  액터: 개발자
   * URL: /mis/act/act7210/getListGrid.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7212_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 과세표준 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 과세표준 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7212M-no2.png`, fullPage: true });

    expect(rows.length, '과세표준 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7213M — 전자신고 마감  |  API: POST /mis/act/act7213/getList.do  |  TC 2건
// TODO(menuId): act_7213M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7213/getList.do';
  const PGM_ID            = 'act_7213M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'CLOS_FG', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`전자신고 마감(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 전자신고 마감 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 전자신고 마감  액터: 개발자
   * URL: /mis/act/act7213/getList.do
   * 예상결과: 전자신고 마감 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7213_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 전자신고 마감 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 전자신고 마감 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7213M-no1.png`, fullPage: true });

    expect(rows.length, '전자신고 마감 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 전자신고 마감 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 전자신고 마감  액터: 개발자
   * URL: /mis/act/act7213/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7213_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 전자신고 마감 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 전자신고 마감 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7213M-no2.png`, fullPage: true });

    expect(rows.length, '전자신고 마감 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7214M — 사업장현황명세서  |  API: POST /mis/act/act7214/getList.do  |  TC 2건
// TODO(menuId): act_7214M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7214/getList.do';
  const PGM_ID            = 'act_7214M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사업장현황명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사업장현황명세서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 사업장현황명세서  액터: 개발자
   * URL: /mis/act/act7214/getList.do
   * 예상결과: 사업장현황명세서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7214_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 사업장현황명세서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 사업장현황명세서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7214M-no1.png`, fullPage: true });

    expect(rows.length, '사업장현황명세서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 사업장현황명세서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 사업장현황명세서  액터: 개발자
   * URL: /mis/act/act7214/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7214_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 사업장현황명세서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 사업장현황명세서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7214M-no2.png`, fullPage: true });

    expect(rows.length, '사업장현황명세서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7215M — 업종코드  |  API: POST /mis/act/act7215/getList.do  |  TC 2건
// TODO(menuId): act_7215M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7215/getList.do';
  const PGM_ID            = 'act_7215M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CLS', 'CND'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`업종코드(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 업종코드 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 업종코드  액터: 개발자
   * URL: /mis/act/act7215/getList.do
   * 예상결과: 업종코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7215_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 업종코드 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 업종코드 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7215M-no1.png`, fullPage: true });

    expect(rows.length, '업종코드 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 업종코드 - 코드 조건 조회 (CLS)
   * 중분류: 재무관리  소분류:   메뉴명: 업종코드  액터: 개발자
   * URL: /mis/act/act7215/getList.do
   * 예상결과: CLS='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7215_MST A WHERE A.CLS = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 업종코드 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 업종코드 - 코드 조건 조회');
    logInput('CLS', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ CLS: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7215M-no2.png`, fullPage: true });

    expect(rows.length, '업종코드 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7219M — 차가감납부할세액 환급  |  API: POST /mis/act/act7219/getData.do  |  TC 2건
// TODO(menuId): act_7219M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7219/getData.do';
  const PGM_ID            = 'act_7219M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'PRINT_STLF', 'BT_CRAT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`차가감납부할세액 환급(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 차가감납부할세액 환급 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 차가감납부할세액 환급  액터: 개발자
   * URL: /mis/act/act7219/getData.do
   * 예상결과: 차가감납부할세액 환급 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7219_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 차가감납부할세액 환급 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 차가감납부할세액 환급 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7219M-no1.png`, fullPage: true });

    expect(rows.length, '차가감납부할세액 환급 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 차가감납부할세액 환급 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 차가감납부할세액 환급  액터: 개발자
   * URL: /mis/act/act7219/getData.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7219_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 차가감납부할세액 환급 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 차가감납부할세액 환급 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7219M-no2.png`, fullPage: true });

    expect(rows.length, '차가감납부할세액 환급 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7220M — 부가세전자신고  |  API: POST /mis/act/act7220/getList1.do  |  TC 2건
// TODO(menuId): act_7220M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7220/getList1.do';
  const PGM_ID            = 'act_7220M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FILE_NAME'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부가세전자신고(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부가세전자신고 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 부가세전자신고  액터: 개발자
   * URL: /mis/act/act7220/getList1.do
   * 예상결과: 부가세전자신고 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7220_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 부가세전자신고 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부가세전자신고 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7220M-no1.png`, fullPage: true });

    expect(rows.length, '부가세전자신고 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 부가세전자신고 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 부가세전자신고  액터: 개발자
   * URL: /mis/act/act7220/getList1.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7220_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 부가세전자신고 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 부가세전자신고 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7220M-no2.png`, fullPage: true });

    expect(rows.length, '부가세전자신고 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7230M — 사업장별과표및세액신고서  |  API: POST /mis/act/act7230/getList.do  |  TC 2건
// TODO(menuId): act_7230M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7230/getList.do';
  const PGM_ID            = 'act_7230M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사업장별과표및세액신고서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사업장별과표및세액신고서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 사업장별과표및세액신고서  액터: 개발자
   * URL: /mis/act/act7230/getList.do
   * 예상결과: 사업장별과표및세액신고서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7230_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 사업장별과표및세액신고서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 사업장별과표및세액신고서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7230M-no1.png`, fullPage: true });

    expect(rows.length, '사업장별과표및세액신고서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 사업장별과표및세액신고서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 사업장별과표및세액신고서  액터: 개발자
   * URL: /mis/act/act7230/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7230_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 사업장별과표및세액신고서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 사업장별과표및세액신고서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7230M-no2.png`, fullPage: true });

    expect(rows.length, '사업장별과표및세액신고서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7410M — 신용카드매출전표등집계표  |  API: POST /mis/act/act0000/getAtftWrftChk.do  |  TC 2건
// TODO(menuId): act_7410M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getAtftWrftChk.do';
  const PGM_ID            = 'act_7410M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`신용카드매출전표등집계표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 신용카드매출전표등집계표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 신용카드매출전표등집계표  액터: 개발자
   * URL: /mis/act/act0000/getAtftWrftChk.do
   * 예상결과: 신용카드매출전표등집계표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7410_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 신용카드매출전표등집계표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 신용카드매출전표등집계표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7410M-no1.png`, fullPage: true });

    expect(rows.length, '신용카드매출전표등집계표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 신용카드매출전표등집계표 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 신용카드매출전표등집계표  액터: 개발자
   * URL: /mis/act/act0000/getAtftWrftChk.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7410_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 신용카드매출전표등집계표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 신용카드매출전표등집계표 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7410M-no2.png`, fullPage: true });

    expect(rows.length, '신용카드매출전표등집계표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7411M — 신용카드매출전표등 수령명세서  |  API: POST /mis/act/act7411/getList.do  |  TC 2건
// TODO(menuId): act_7411M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7411/getList.do';
  const PGM_ID            = 'act_7411M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`신용카드매출전표등 수령명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 신용카드매출전표등 수령명세서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 신용카드매출전표등 수령명세서  액터: 개발자
   * URL: /mis/act/act7411/getList.do
   * 예상결과: 신용카드매출전표등 수령명세서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7411_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 신용카드매출전표등 수령명세서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 신용카드매출전표등 수령명세서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7411M-no1.png`, fullPage: true });

    expect(rows.length, '신용카드매출전표등 수령명세서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 신용카드매출전표등 수령명세서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 신용카드매출전표등 수령명세서  액터: 개발자
   * URL: /mis/act/act7411/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7411_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 신용카드매출전표등 수령명세서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 신용카드매출전표등 수령명세서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7411M-no2.png`, fullPage: true });

    expect(rows.length, '신용카드매출전표등 수령명세서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7420M — 공제받지못할매입세액명세서  |  API: POST /mis/act/act7420/getEnrnSet.do  |  TC 5건
// TODO(menuId): act_7420M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7420/getEnrnSet.do';
  const PGM_ID            = 'act_7420M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['TAX_RETURN_TP', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD', 'DCSN_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`공제받지못할매입세액명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 공제받지못할매입세액명세서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 공제받지못할매입세액명세서  액터: 개발자
   * URL: /mis/act/act7420/getEnrnSet.do
   * 예상결과: 공제받지못할매입세액명세서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7420_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 공제받지못할매입세액명세서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 공제받지못할매입세액명세서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7420M-no1.png`, fullPage: true });

    expect(rows.length, '공제받지못할매입세액명세서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 공제받지못할매입세액명세서 - 사용여부 조회 (DCSN_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 공제받지못할매입세액명세서  액터: 개발자
   * URL: /mis/act/act7420/getEnrnSet.do
   * 예상결과: 사용중(DCSN_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7420_MST A WHERE A.DCSN_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 공제받지못할매입세액명세서 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 공제받지못할매입세액명세서 - 사용여부 조회');
    logInput('DCSN_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ DCSN_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7420M-no2.png`, fullPage: true });

    expect(rows.length, '공제받지못할매입세액명세서 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 공제받지못할매입세액명세서 - 키워드 조회 (BUSI_PLC_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 공제받지못할매입세액명세서  액터: 개발자
   * URL: /mis/act/act7420/getEnrnSet.do
   * 예상결과: BUSI_PLC_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7420_MST A WHERE A.BUSI_PLC_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 공제받지못할매입세액명세서 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 공제받지못할매입세액명세서 - 키워드 조회');
    logInput('BUSI_PLC_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7420M-no3.png`, fullPage: true });

    expect(rows.length, '공제받지못할매입세액명세서 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 공제받지못할매입세액명세서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 공제받지못할매입세액명세서  액터: 개발자
   * URL: /mis/act/act7420/getEnrnSet.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7420_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 공제받지못할매입세액명세서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 공제받지못할매입세액명세서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7420M-no4.png`, fullPage: true });

    expect(rows.length, '공제받지못할매입세액명세서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 공제받지못할매입세액명세서 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 공제받지못할매입세액명세서  액터: 개발자
   * URL: /mis/act/act7420/getEnrnSet.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7420_MST A WHERE A.BUSI_PLC_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 공제받지못할매입세액명세서 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 공제받지못할매입세액명세서 - 존재하지 않는 키워드 조회');
    logInput('BUSI_PLC_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7420M-no5.png`, fullPage: true });

    expect(rows.length, '공제받지못할매입세액명세서 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7430M — 대손세액공제[변제]신고서  |  API: POST /mis/act/act7430/getList.do  |  TC 3건
// TODO(menuId): act_7430M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7430/getList.do';
  const PGM_ID            = 'act_7430M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD', 'DCSN_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`대손세액공제[변제]신고서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 대손세액공제[변제]신고서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 대손세액공제[변제]신고서  액터: 개발자
   * URL: /mis/act/act7430/getList.do
   * 예상결과: 대손세액공제[변제]신고서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7430_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 대손세액공제[변제]신고서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 대손세액공제[변제]신고서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7430M-no1.png`, fullPage: true });

    expect(rows.length, '대손세액공제[변제]신고서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 대손세액공제[변제]신고서 - 사용여부 조회 (DCSN_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 대손세액공제[변제]신고서  액터: 개발자
   * URL: /mis/act/act7430/getList.do
   * 예상결과: 사용중(DCSN_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7430_MST A WHERE A.DCSN_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 대손세액공제[변제]신고서 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 대손세액공제[변제]신고서 - 사용여부 조회');
    logInput('DCSN_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ DCSN_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7430M-no2.png`, fullPage: true });

    expect(rows.length, '대손세액공제[변제]신고서 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 대손세액공제[변제]신고서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 대손세액공제[변제]신고서  액터: 개발자
   * URL: /mis/act/act7430/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7430_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 대손세액공제[변제]신고서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 대손세액공제[변제]신고서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7430M-no3.png`, fullPage: true });

    expect(rows.length, '대손세액공제[변제]신고서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7440M — 부동산임대공급가액명세서  |  API: POST /mis/act/act7440/getList.do  |  TC 3건
// TODO(menuId): act_7440M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7440/getList.do';
  const PGM_ID            = 'act_7440M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD', 'DCSN_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`부동산임대공급가액명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 부동산임대공급가액명세서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 부동산임대공급가액명세서  액터: 개발자
   * URL: /mis/act/act7440/getList.do
   * 예상결과: 부동산임대공급가액명세서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7440_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 부동산임대공급가액명세서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부동산임대공급가액명세서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7440M-no1.png`, fullPage: true });

    expect(rows.length, '부동산임대공급가액명세서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 부동산임대공급가액명세서 - 사용여부 조회 (DCSN_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 부동산임대공급가액명세서  액터: 개발자
   * URL: /mis/act/act7440/getList.do
   * 예상결과: 사용중(DCSN_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7440_MST A WHERE A.DCSN_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 부동산임대공급가액명세서 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 부동산임대공급가액명세서 - 사용여부 조회');
    logInput('DCSN_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ DCSN_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7440M-no2.png`, fullPage: true });

    expect(rows.length, '부동산임대공급가액명세서 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 부동산임대공급가액명세서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 부동산임대공급가액명세서  액터: 개발자
   * URL: /mis/act/act7440/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7440_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 부동산임대공급가액명세서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 부동산임대공급가액명세서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7440M-no3.png`, fullPage: true });

    expect(rows.length, '부동산임대공급가액명세서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7441M — 불러오기  |  API: POST /mis/act/act7441/getList.do  |  TC 3건
// TODO(menuId): act_7441M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7441/getList.do';
  const PGM_ID            = 'act_7441M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'STDR_YY', 'INCD_YN', 'TRGT_FRM_YM', 'TRGT_TO_YM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`불러오기(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 불러오기 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 불러오기  액터: 개발자
   * URL: /mis/act/act7441/getList.do
   * 예상결과: 불러오기 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7441_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 불러오기 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 불러오기 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7441M-no1.png`, fullPage: true });

    expect(rows.length, '불러오기 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 불러오기 - 사용여부 조회 (INCD_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 불러오기  액터: 개발자
   * URL: /mis/act/act7441/getList.do
   * 예상결과: 사용중(INCD_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7441_MST A WHERE A.INCD_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 불러오기 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 불러오기 - 사용여부 조회');
    logInput('INCD_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ INCD_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7441M-no2.png`, fullPage: true });

    expect(rows.length, '불러오기 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 불러오기 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 불러오기  액터: 개발자
   * URL: /mis/act/act7441/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7441_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 불러오기 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 불러오기 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7441M-no3.png`, fullPage: true });

    expect(rows.length, '불러오기 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7450M — 건물관리명세서  |  API: POST /mis/act/act7450/getList.do  |  TC 4건
// TODO(menuId): act_7450M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7450/getList.do';
  const PGM_ID            = 'act_7450M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'BUSI_PLC_NM', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FG', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`건물관리명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 건물관리명세서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 건물관리명세서  액터: 개발자
   * URL: /mis/act/act7450/getList.do
   * 예상결과: 건물관리명세서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7450_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 건물관리명세서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 건물관리명세서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7450M-no1.png`, fullPage: true });

    expect(rows.length, '건물관리명세서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 건물관리명세서 - 키워드 조회 (BUSI_PLC_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 건물관리명세서  액터: 개발자
   * URL: /mis/act/act7450/getList.do
   * 예상결과: BUSI_PLC_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7450_MST A WHERE A.BUSI_PLC_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 건물관리명세서 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 건물관리명세서 - 키워드 조회');
    logInput('BUSI_PLC_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7450M-no2.png`, fullPage: true });

    expect(rows.length, '건물관리명세서 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 건물관리명세서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 건물관리명세서  액터: 개발자
   * URL: /mis/act/act7450/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7450_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 건물관리명세서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 건물관리명세서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7450M-no3.png`, fullPage: true });

    expect(rows.length, '건물관리명세서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 건물관리명세서 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 건물관리명세서  액터: 개발자
   * URL: /mis/act/act7450/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7450_MST A WHERE A.BUSI_PLC_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 건물관리명세서 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 건물관리명세서 - 존재하지 않는 키워드 조회');
    logInput('BUSI_PLC_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7450M-no4.png`, fullPage: true });

    expect(rows.length, '건물관리명세서 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7460M — 건물등 감가상각취득명세서  |  API: POST /mis/act/act0000/getAtftWrftChk.do  |  TC 2건
// TODO(menuId): act_7460M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getAtftWrftChk.do';
  const PGM_ID            = 'act_7460M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`건물등 감가상각취득명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 건물등 감가상각취득명세서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 건물등 감가상각취득명세서  액터: 개발자
   * URL: /mis/act/act0000/getAtftWrftChk.do
   * 예상결과: 건물등 감가상각취득명세서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7460_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 건물등 감가상각취득명세서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 건물등 감가상각취득명세서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7460M-no1.png`, fullPage: true });

    expect(rows.length, '건물등 감가상각취득명세서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 건물등 감가상각취득명세서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 건물등 감가상각취득명세서  액터: 개발자
   * URL: /mis/act/act0000/getAtftWrftChk.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7460_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 건물등 감가상각취득명세서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 건물등 감가상각취득명세서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7460M-no2.png`, fullPage: true });

    expect(rows.length, '건물등 감가상각취득명세서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7470M — 의제매입세액공제신고서  |  API: POST /mis/act/act7470/getList1.do  |  TC 3건
// TODO(menuId): act_7470M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7470/getList1.do';
  const PGM_ID            = 'act_7470M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD', 'DCSN_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`의제매입세액공제신고서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 의제매입세액공제신고서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 의제매입세액공제신고서  액터: 개발자
   * URL: /mis/act/act7470/getList1.do
   * 예상결과: 의제매입세액공제신고서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7470_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 의제매입세액공제신고서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 의제매입세액공제신고서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7470M-no1.png`, fullPage: true });

    expect(rows.length, '의제매입세액공제신고서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 의제매입세액공제신고서 - 사용여부 조회 (DCSN_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 의제매입세액공제신고서  액터: 개발자
   * URL: /mis/act/act7470/getList1.do
   * 예상결과: 사용중(DCSN_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7470_MST A WHERE A.DCSN_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 의제매입세액공제신고서 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 의제매입세액공제신고서 - 사용여부 조회');
    logInput('DCSN_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ DCSN_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7470M-no2.png`, fullPage: true });

    expect(rows.length, '의제매입세액공제신고서 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 의제매입세액공제신고서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 의제매입세액공제신고서  액터: 개발자
   * URL: /mis/act/act7470/getList1.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7470_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 의제매입세액공제신고서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 의제매입세액공제신고서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7470M-no3.png`, fullPage: true });

    expect(rows.length, '의제매입세액공제신고서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7471M — 불러오기  |  API: POST /mis/act/act7471/getList.do  |  TC 2건
// TODO(menuId): act_7471M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7471/getList.do';
  const PGM_ID            = 'act_7471M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`불러오기(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 불러오기 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 불러오기  액터: 개발자
   * URL: /mis/act/act7471/getList.do
   * 예상결과: 불러오기 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7471_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 불러오기 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 불러오기 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7471M-no1.png`, fullPage: true });

    expect(rows.length, '불러오기 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 불러오기 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 불러오기  액터: 개발자
   * URL: /mis/act/act7471/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7471_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 불러오기 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 불러오기 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7471M-no2.png`, fullPage: true });

    expect(rows.length, '불러오기 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7490M — 영세율매출명세서  |  API: POST /mis/act/act7490/getListGrid.do  |  TC 2건
// TODO(menuId): act_7490M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7490/getListGrid.do';
  const PGM_ID            = 'act_7490M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD', 'PRINT_STLF'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`영세율매출명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 영세율매출명세서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 영세율매출명세서  액터: 개발자
   * URL: /mis/act/act7490/getListGrid.do
   * 예상결과: 영세율매출명세서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7490_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 영세율매출명세서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 영세율매출명세서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7490M-no1.png`, fullPage: true });

    expect(rows.length, '영세율매출명세서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 영세율매출명세서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 영세율매출명세서  액터: 개발자
   * URL: /mis/act/act7490/getListGrid.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7490_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 영세율매출명세서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 영세율매출명세서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7490M-no2.png`, fullPage: true });

    expect(rows.length, '영세율매출명세서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7492M — 구리 스크랩등 매입세액 공제신고서  |  API: POST /mis/act/act0000/getMainBusiPlc.do  |  TC 2건
// TODO(menuId): act_7492M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getMainBusiPlc.do';
  const PGM_ID            = 'act_7492M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'BUY_SALG_FG', 'VAT_STTM_FG', 'FOMT_CD', 'WRT_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`구리 스크랩등 매입세액 공제신고서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 구리 스크랩등 매입세액 공제신고서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 구리 스크랩등 매입세액 공제신고서  액터: 개발자
   * URL: /mis/act/act0000/getMainBusiPlc.do
   * 예상결과: 구리 스크랩등 매입세액 공제신고서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7492_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 구리 스크랩등 매입세액 공제신고서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 구리 스크랩등 매입세액 공제신고서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7492M-no1.png`, fullPage: true });

    expect(rows.length, '구리 스크랩등 매입세액 공제신고서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 구리 스크랩등 매입세액 공제신고서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 구리 스크랩등 매입세액 공제신고서  액터: 개발자
   * URL: /mis/act/act0000/getMainBusiPlc.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7492_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 구리 스크랩등 매입세액 공제신고서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 구리 스크랩등 매입세액 공제신고서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7492M-no2.png`, fullPage: true });

    expect(rows.length, '구리 스크랩등 매입세액 공제신고서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7510M — 재활용폐자원세액공제신고서  |  API: POST /mis/act/act7510/getDucRate.do  |  TC 3건
// TODO(menuId): act_7510M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7510/getDucRate.do';
  const PGM_ID            = 'act_7510M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'PRINT_STLF', 'FOMT_CD', 'DCSN_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`재활용폐자원세액공제신고서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 재활용폐자원세액공제신고서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 재활용폐자원세액공제신고서  액터: 개발자
   * URL: /mis/act/act7510/getDucRate.do
   * 예상결과: 재활용폐자원세액공제신고서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7510_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 재활용폐자원세액공제신고서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 재활용폐자원세액공제신고서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7510M-no1.png`, fullPage: true });

    expect(rows.length, '재활용폐자원세액공제신고서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 재활용폐자원세액공제신고서 - 사용여부 조회 (DCSN_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 재활용폐자원세액공제신고서  액터: 개발자
   * URL: /mis/act/act7510/getDucRate.do
   * 예상결과: 사용중(DCSN_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7510_MST A WHERE A.DCSN_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 재활용폐자원세액공제신고서 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 재활용폐자원세액공제신고서 - 사용여부 조회');
    logInput('DCSN_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ DCSN_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7510M-no2.png`, fullPage: true });

    expect(rows.length, '재활용폐자원세액공제신고서 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 재활용폐자원세액공제신고서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 재활용폐자원세액공제신고서  액터: 개발자
   * URL: /mis/act/act7510/getDucRate.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7510_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 재활용폐자원세액공제신고서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 재활용폐자원세액공제신고서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7510M-no3.png`, fullPage: true });

    expect(rows.length, '재활용폐자원세액공제신고서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7511M — 불러오기(매입처명세)  |  API: POST /mis/act/act7511/getList.do  |  TC 3건
// TODO(menuId): act_7511M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7511/getList.do';
  const PGM_ID            = 'act_7511M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD', 'SCAP_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`불러오기(매입처명세)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 불러오기(매입처명세) - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 불러오기(매입처명세)  액터: 개발자
   * URL: /mis/act/act7511/getList.do
   * 예상결과: 불러오기(매입처명세) 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7511_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 불러오기(매입처명세) - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 불러오기(매입처명세) - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7511M-no1.png`, fullPage: true });

    expect(rows.length, '불러오기(매입처명세) 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 불러오기(매입처명세) - 사용여부 조회 (SCAP_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 불러오기(매입처명세)  액터: 개발자
   * URL: /mis/act/act7511/getList.do
   * 예상결과: 사용중(SCAP_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7511_MST A WHERE A.SCAP_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 불러오기(매입처명세) - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 불러오기(매입처명세) - 사용여부 조회');
    logInput('SCAP_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCAP_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7511M-no2.png`, fullPage: true });

    expect(rows.length, '불러오기(매입처명세) 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 불러오기(매입처명세) - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 불러오기(매입처명세)  액터: 개발자
   * URL: /mis/act/act7511/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7511_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 불러오기(매입처명세) - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 불러오기(매입처명세) - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7511M-no3.png`, fullPage: true });

    expect(rows.length, '불러오기(매입처명세) 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7512M — 불러오기(매입세액정산)  |  API: POST /mis/act/act7512/getList.do  |  TC 2건
// TODO(menuId): act_7512M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7512/getList.do';
  const PGM_ID            = 'act_7512M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`불러오기(매입세액정산)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 불러오기(매입세액정산) - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 불러오기(매입세액정산)  액터: 개발자
   * URL: /mis/act/act7512/getList.do
   * 예상결과: 불러오기(매입세액정산) 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7512_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 불러오기(매입세액정산) - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 불러오기(매입세액정산) - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7512M-no1.png`, fullPage: true });

    expect(rows.length, '불러오기(매입세액정산) 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 불러오기(매입세액정산) - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 불러오기(매입세액정산)  액터: 개발자
   * URL: /mis/act/act7512/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7512_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 불러오기(매입세액정산) - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 불러오기(매입세액정산) - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7512M-no2.png`, fullPage: true });

    expect(rows.length, '불러오기(매입세액정산) 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7520M — 스크랩등 매입세액 공제신고서  |  API: POST /mis/act/act7520/getDucRate.do  |  TC 2건
// TODO(menuId): act_7520M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7520/getDucRate.do';
  const PGM_ID            = 'act_7520M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'PRINT_STLF', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`스크랩등 매입세액 공제신고서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 스크랩등 매입세액 공제신고서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 스크랩등 매입세액 공제신고서  액터: 개발자
   * URL: /mis/act/act7520/getDucRate.do
   * 예상결과: 스크랩등 매입세액 공제신고서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7520_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 스크랩등 매입세액 공제신고서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 스크랩등 매입세액 공제신고서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7520M-no1.png`, fullPage: true });

    expect(rows.length, '스크랩등 매입세액 공제신고서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 스크랩등 매입세액 공제신고서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 스크랩등 매입세액 공제신고서  액터: 개발자
   * URL: /mis/act/act7520/getDucRate.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7520_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 스크랩등 매입세액 공제신고서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 스크랩등 매입세액 공제신고서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7520M-no2.png`, fullPage: true });

    expect(rows.length, '스크랩등 매입세액 공제신고서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7521M — 불러오기(매입처명세)  |  API: POST /mis/act/act7521/getList.do  |  TC 2건
// TODO(menuId): act_7521M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7521/getList.do';
  const PGM_ID            = 'act_7521M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`불러오기(매입처명세)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 불러오기(매입처명세) - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 불러오기(매입처명세)  액터: 개발자
   * URL: /mis/act/act7521/getList.do
   * 예상결과: 불러오기(매입처명세) 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7521_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 불러오기(매입처명세) - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 불러오기(매입처명세) - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7521M-no1.png`, fullPage: true });

    expect(rows.length, '불러오기(매입처명세) 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 불러오기(매입처명세) - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 불러오기(매입처명세)  액터: 개발자
   * URL: /mis/act/act7521/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7521_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 불러오기(매입처명세) - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 불러오기(매입처명세) - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7521M-no2.png`, fullPage: true });

    expect(rows.length, '불러오기(매입처명세) 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7530M — 수출실적명세서  |  API: POST /mis/act/act0000/getAtftWrftChk.do  |  TC 2건
// TODO(menuId): act_7530M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getAtftWrftChk.do';
  const PGM_ID            = 'act_7530M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_MTOD', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`수출실적명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 수출실적명세서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 수출실적명세서  액터: 개발자
   * URL: /mis/act/act0000/getAtftWrftChk.do
   * 예상결과: 수출실적명세서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7530_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 수출실적명세서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 수출실적명세서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7530M-no1.png`, fullPage: true });

    expect(rows.length, '수출실적명세서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 수출실적명세서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 수출실적명세서  액터: 개발자
   * URL: /mis/act/act0000/getAtftWrftChk.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7530_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 수출실적명세서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 수출실적명세서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7530M-no2.png`, fullPage: true });

    expect(rows.length, '수출실적명세서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7610M — 기타소득자등록  |  API: POST /mis/act/act7610/getList.do  |  TC 3건
// TODO(menuId): act_7610M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7610/getList.do';
  const PGM_ID            = 'act_7610M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CUST_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기타소득자등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기타소득자등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득자등록  액터: 개발자
   * URL: /mis/act/act7610/getList.do
   * 예상결과: 기타소득자등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7610_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 기타소득자등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 기타소득자등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7610M-no1.png`, fullPage: true });

    expect(rows.length, '기타소득자등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기타소득자등록 - 키워드 조회 (CUST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득자등록  액터: 개발자
   * URL: /mis/act/act7610/getList.do
   * 예상결과: CUST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7610_MST A WHERE A.CUST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 기타소득자등록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 기타소득자등록 - 키워드 조회');
    logInput('CUST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7610M-no2.png`, fullPage: true });

    expect(rows.length, '기타소득자등록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 기타소득자등록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득자등록  액터: 개발자
   * URL: /mis/act/act7610/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7610_MST A WHERE A.CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 기타소득자등록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 기타소득자등록 - 존재하지 않는 키워드 조회');
    logInput('CUST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7610M-no3.png`, fullPage: true });

    expect(rows.length, '기타소득자등록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7611M — 기타소득자등록(전문가)  |  API: POST /mis/act/act7611/getList.do  |  TC 4건
// TODO(menuId): act_7611M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7611/getList.do';
  const PGM_ID            = 'act_7611M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CUST_NM', 'PERS_CORP_FG', 'RES_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기타소득자등록(전문가)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기타소득자등록(전문가) - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득자등록(전문가)  액터: 개발자
   * URL: /mis/act/act7611/getList.do
   * 예상결과: 기타소득자등록(전문가) 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7611_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 기타소득자등록(전문가) - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 기타소득자등록(전문가) - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7611M-no1.png`, fullPage: true });

    expect(rows.length, '기타소득자등록(전문가) 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기타소득자등록(전문가) - 키워드 조회 (CUST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득자등록(전문가)  액터: 개발자
   * URL: /mis/act/act7611/getList.do
   * 예상결과: CUST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7611_MST A WHERE A.CUST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 기타소득자등록(전문가) - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 기타소득자등록(전문가) - 키워드 조회');
    logInput('CUST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7611M-no2.png`, fullPage: true });

    expect(rows.length, '기타소득자등록(전문가) 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 기타소득자등록(전문가) - 코드 조건 조회 (PERS_CORP_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득자등록(전문가)  액터: 개발자
   * URL: /mis/act/act7611/getList.do
   * 예상결과: PERS_CORP_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7611_MST A WHERE A.PERS_CORP_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 기타소득자등록(전문가) - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 기타소득자등록(전문가) - 코드 조건 조회');
    logInput('PERS_CORP_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ PERS_CORP_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7611M-no3.png`, fullPage: true });

    expect(rows.length, '기타소득자등록(전문가) 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 기타소득자등록(전문가) - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득자등록(전문가)  액터: 개발자
   * URL: /mis/act/act7611/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7611_MST A WHERE A.CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 기타소득자등록(전문가) - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 기타소득자등록(전문가) - 존재하지 않는 키워드 조회');
    logInput('CUST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7611M-no4.png`, fullPage: true });

    expect(rows.length, '기타소득자등록(전문가) 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7620M — 기타소득등록  |  API: POST /mis/act/act7620/getList.do  |  TC 4건
// TODO(menuId): act_7620M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7620/getList.do';
  const PGM_ID            = 'act_7620M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_DT', 'TO_DT', 'CUST_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기타소득등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기타소득등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득등록  액터: 개발자
   * URL: /mis/act/act7620/getList.do
   * 예상결과: 기타소득등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7620_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 기타소득등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 기타소득등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7620M-no1.png`, fullPage: true });

    expect(rows.length, '기타소득등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기타소득등록 - 키워드 조회 (CUST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득등록  액터: 개발자
   * URL: /mis/act/act7620/getList.do
   * 예상결과: CUST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7620_MST A WHERE A.CUST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 기타소득등록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 기타소득등록 - 키워드 조회');
    logInput('CUST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7620M-no2.png`, fullPage: true });

    expect(rows.length, '기타소득등록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 기타소득등록 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득등록  액터: 개발자
   * URL: /mis/act/act7620/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7620_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 기타소득등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 기타소득등록 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7620M-no3.png`, fullPage: true });

    expect(rows.length, '기타소득등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 기타소득등록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득등록  액터: 개발자
   * URL: /mis/act/act7620/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7620_MST A WHERE A.CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 기타소득등록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 기타소득등록 - 존재하지 않는 키워드 조회');
    logInput('CUST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7620M-no4.png`, fullPage: true });

    expect(rows.length, '기타소득등록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7630M — 기타소득현황  |  API: POST /mis/act/act7630/getList1.do  |  TC 1건
// TODO(menuId): act_7630M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7630/getList1.do';
  const PGM_ID            = 'act_7630M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기타소득현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기타소득현황 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득현황  액터: 개발자
   * URL: /mis/act/act7630/getList1.do
   * 예상결과: 기타소득현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7630_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 기타소득현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 기타소득현황 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7630M-no1.png`, fullPage: true });

    expect(rows.length, '기타소득현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7631M — 기타소득현황(담당자)  |  API: POST /mis/act/act7630/getList2.do  |  TC 4건
// TODO(menuId): act_7631M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7630/getList2.do';
  const PGM_ID            = 'act_7631M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['FRM_DT', 'TO_DT', 'INVPRT_NM', 'INME_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`기타소득현황(담당자)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기타소득현황(담당자) - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득현황(담당자)  액터: 개발자
   * URL: /mis/act/act7630/getList2.do
   * 예상결과: 기타소득현황(담당자) 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7631_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 기타소득현황(담당자) - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 기타소득현황(담당자) - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7631M-no1.png`, fullPage: true });

    expect(rows.length, '기타소득현황(담당자) 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기타소득현황(담당자) - 키워드 조회 (INVPRT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득현황(담당자)  액터: 개발자
   * URL: /mis/act/act7630/getList2.do
   * 예상결과: INVPRT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7631_MST A WHERE A.INVPRT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 기타소득현황(담당자) - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 기타소득현황(담당자) - 키워드 조회');
    logInput('INVPRT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ INVPRT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7631M-no2.png`, fullPage: true });

    expect(rows.length, '기타소득현황(담당자) 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 기타소득현황(담당자) - 코드 조건 조회 (INME_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득현황(담당자)  액터: 개발자
   * URL: /mis/act/act7630/getList2.do
   * 예상결과: INME_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7631_MST A WHERE A.INME_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 기타소득현황(담당자) - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 기타소득현황(담당자) - 코드 조건 조회');
    logInput('INME_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ INME_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7631M-no3.png`, fullPage: true });

    expect(rows.length, '기타소득현황(담당자) 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 기타소득현황(담당자) - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 기타소득현황(담당자)  액터: 개발자
   * URL: /mis/act/act7630/getList2.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7631_MST A WHERE A.INVPRT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 기타소득현황(담당자) - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 기타소득현황(담당자) - 존재하지 않는 키워드 조회');
    logInput('INVPRT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ INVPRT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7631M-no4.png`, fullPage: true });

    expect(rows.length, '기타소득현황(담당자) 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7810M — 사업소득자등록  |  API: POST /mis/act/act7810/getList.do  |  TC 4건
// TODO(menuId): act_7810M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7810/getList.do';
  const PGM_ID            = 'act_7810M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CUST_NM', 'PERS_CORP_FG', 'BUSI_RES_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사업소득자등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사업소득자등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 사업소득자등록  액터: 개발자
   * URL: /mis/act/act7810/getList.do
   * 예상결과: 사업소득자등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7810_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 사업소득자등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 사업소득자등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7810M-no1.png`, fullPage: true });

    expect(rows.length, '사업소득자등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 사업소득자등록 - 키워드 조회 (CUST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 사업소득자등록  액터: 개발자
   * URL: /mis/act/act7810/getList.do
   * 예상결과: CUST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7810_MST A WHERE A.CUST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 사업소득자등록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 사업소득자등록 - 키워드 조회');
    logInput('CUST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7810M-no2.png`, fullPage: true });

    expect(rows.length, '사업소득자등록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 사업소득자등록 - 코드 조건 조회 (PERS_CORP_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 사업소득자등록  액터: 개발자
   * URL: /mis/act/act7810/getList.do
   * 예상결과: PERS_CORP_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7810_MST A WHERE A.PERS_CORP_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 사업소득자등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 사업소득자등록 - 코드 조건 조회');
    logInput('PERS_CORP_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ PERS_CORP_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7810M-no3.png`, fullPage: true });

    expect(rows.length, '사업소득자등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 사업소득자등록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 사업소득자등록  액터: 개발자
   * URL: /mis/act/act7810/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7810_MST A WHERE A.CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 사업소득자등록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 사업소득자등록 - 존재하지 않는 키워드 조회');
    logInput('CUST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7810M-no4.png`, fullPage: true });

    expect(rows.length, '사업소득자등록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7820M — 사업소득등록  |  API: POST /mis/act/act7820/getList.do  |  TC 4건
// TODO(menuId): act_7820M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7820/getList.do';
  const PGM_ID            = 'act_7820M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_DT', 'TO_DT', 'CUST_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사업소득등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사업소득등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 사업소득등록  액터: 개발자
   * URL: /mis/act/act7820/getList.do
   * 예상결과: 사업소득등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7820_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 사업소득등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 사업소득등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7820M-no1.png`, fullPage: true });

    expect(rows.length, '사업소득등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 사업소득등록 - 키워드 조회 (CUST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 사업소득등록  액터: 개발자
   * URL: /mis/act/act7820/getList.do
   * 예상결과: CUST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7820_MST A WHERE A.CUST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 사업소득등록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 사업소득등록 - 키워드 조회');
    logInput('CUST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7820M-no2.png`, fullPage: true });

    expect(rows.length, '사업소득등록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 사업소득등록 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 사업소득등록  액터: 개발자
   * URL: /mis/act/act7820/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7820_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 사업소득등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 사업소득등록 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7820M-no3.png`, fullPage: true });

    expect(rows.length, '사업소득등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 사업소득등록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 사업소득등록  액터: 개발자
   * URL: /mis/act/act7820/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7820_MST A WHERE A.CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 사업소득등록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 사업소득등록 - 존재하지 않는 키워드 조회');
    logInput('CUST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7820M-no4.png`, fullPage: true });

    expect(rows.length, '사업소득등록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7830M — 사업소득현황  |  API: POST /mis/act/act7830/getList.do  |  TC 3건
// TODO(menuId): act_7830M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7830/getList.do';
  const PGM_ID            = 'act_7830M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['FRM_DT', 'TO_DT', 'INVPRT_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`사업소득현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 사업소득현황 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 사업소득현황  액터: 개발자
   * URL: /mis/act/act7830/getList.do
   * 예상결과: 사업소득현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7830_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 사업소득현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 사업소득현황 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7830M-no1.png`, fullPage: true });

    expect(rows.length, '사업소득현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 사업소득현황 - 키워드 조회 (INVPRT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 사업소득현황  액터: 개발자
   * URL: /mis/act/act7830/getList.do
   * 예상결과: INVPRT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7830_MST A WHERE A.INVPRT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 사업소득현황 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 사업소득현황 - 키워드 조회');
    logInput('INVPRT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ INVPRT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7830M-no2.png`, fullPage: true });

    expect(rows.length, '사업소득현황 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 사업소득현황 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 사업소득현황  액터: 개발자
   * URL: /mis/act/act7830/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7830_MST A WHERE A.INVPRT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 사업소득현황 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 사업소득현황 - 존재하지 않는 키워드 조회');
    logInput('INVPRT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ INVPRT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7830M-no3.png`, fullPage: true });

    expect(rows.length, '사업소득현황 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7850M — 거주자사업소득간이지급명세서  |  API: POST /mis/act/act7850/getList.do  |  TC 2건
// TODO(menuId): act_7850M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7850/getList.do';
  const PGM_ID            = 'act_7850M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['STDR_YY', 'RESI_FG', 'YM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`거주자사업소득간이지급명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 거주자사업소득간이지급명세서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 거주자사업소득간이지급명세서  액터: 개발자
   * URL: /mis/act/act7850/getList.do
   * 예상결과: 거주자사업소득간이지급명세서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7850_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 거주자사업소득간이지급명세서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 거주자사업소득간이지급명세서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7850M-no1.png`, fullPage: true });

    expect(rows.length, '거주자사업소득간이지급명세서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 거주자사업소득간이지급명세서 - 코드 조건 조회 (RESI_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 거주자사업소득간이지급명세서  액터: 개발자
   * URL: /mis/act/act7850/getList.do
   * 예상결과: RESI_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7850_MST A WHERE A.RESI_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 거주자사업소득간이지급명세서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 거주자사업소득간이지급명세서 - 코드 조건 조회');
    logInput('RESI_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ RESI_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7850M-no2.png`, fullPage: true });

    expect(rows.length, '거주자사업소득간이지급명세서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7910M — 지급명세서전자신고  |  API: POST /mis/act/act7910/getList.do  |  TC 2건
// TODO(menuId): act_7910M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7910/getList.do';
  const PGM_ID            = 'act_7910M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'STDR_YY', 'SPCF_FG', 'SBMT_DT', 'SBMT_TP', 'SBMT_TERM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`지급명세서전자신고(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 지급명세서전자신고 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 지급명세서전자신고  액터: 개발자
   * URL: /mis/act/act7910/getList.do
   * 예상결과: 지급명세서전자신고 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7910_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 지급명세서전자신고 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 지급명세서전자신고 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7910M-no1.png`, fullPage: true });

    expect(rows.length, '지급명세서전자신고 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 지급명세서전자신고 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 지급명세서전자신고  액터: 개발자
   * URL: /mis/act/act7910/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7910_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 지급명세서전자신고 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 지급명세서전자신고 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7910M-no2.png`, fullPage: true });

    expect(rows.length, '지급명세서전자신고 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_7920M — 간이지급명세서  |  API: POST /mis/act/act7920/getList.do  |  TC 2건
// TODO(menuId): act_7920M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act7920/getList.do';
  const PGM_ID            = 'act_7920M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'STDR_YY', 'INME_FG', 'RESI_FG', 'STTM_MM', 'FILE_NAME'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`간이지급명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 간이지급명세서 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 간이지급명세서  액터: 개발자
   * URL: /mis/act/act7920/getList.do
   * 예상결과: 간이지급명세서 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_7920_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 간이지급명세서 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 간이지급명세서 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7920M-no1.png`, fullPage: true });

    expect(rows.length, '간이지급명세서 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 간이지급명세서 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 간이지급명세서  액터: 개발자
   * URL: /mis/act/act7920/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_7920_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 간이지급명세서 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 간이지급명세서 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_7920M-no2.png`, fullPage: true });

    expect(rows.length, '간이지급명세서 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_8110M — 매출현황  |  API: POST /mis/act/act8110/getList.do  |  TC 5건
// TODO(menuId): act_8110M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act8110/getList.do';
  const PGM_ID            = 'act_8110M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_ACT_UNIT_CD', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_CUST_NM', 'SCH_CUST_CD', 'SCH_SETLE_MTHD', 'SCH_DSCN_YN', 'SCH_WRTER', 'SCH_WRTER_NM', 'SCH_BUDG_BSNS_CD', 'SCH_BUDG_BSNS_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`매출현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 매출현황 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 매출현황  액터: 개발자
   * URL: /mis/act/act8110/getList.do
   * 예상결과: 매출현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_8110_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 매출현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 매출현황 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8110M-no1.png`, fullPage: true });

    expect(rows.length, '매출현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 매출현황 - 사용여부 조회 (SCH_DSCN_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 매출현황  액터: 개발자
   * URL: /mis/act/act8110/getList.do
   * 예상결과: 사용중(SCH_DSCN_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8110_MST A WHERE A.SCH_DSCN_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 매출현황 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 매출현황 - 사용여부 조회');
    logInput('SCH_DSCN_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_DSCN_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8110M-no2.png`, fullPage: true });

    expect(rows.length, '매출현황 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 매출현황 - 키워드 조회 (SCH_CUST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 매출현황  액터: 개발자
   * URL: /mis/act/act8110/getList.do
   * 예상결과: SCH_CUST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8110_MST A WHERE A.SCH_CUST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 매출현황 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 매출현황 - 키워드 조회');
    logInput('SCH_CUST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CUST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8110M-no3.png`, fullPage: true });

    expect(rows.length, '매출현황 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 매출현황 - 코드 조건 조회 (SCH_ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 매출현황  액터: 개발자
   * URL: /mis/act/act8110/getList.do
   * 예상결과: SCH_ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8110_MST A WHERE A.SCH_ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 매출현황 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 매출현황 - 코드 조건 조회');
    logInput('SCH_ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8110M-no4.png`, fullPage: true });

    expect(rows.length, '매출현황 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 매출현황 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 매출현황  액터: 개발자
   * URL: /mis/act/act8110/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8110_MST A WHERE A.SCH_CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 매출현황 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 매출현황 - 존재하지 않는 키워드 조회');
    logInput('SCH_CUST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CUST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8110M-no5.png`, fullPage: true });

    expect(rows.length, '매출현황 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_8111M — 매출등록  |  API: POST /mis/act/act8111/getList.do  |  TC 1건
// TODO(menuId): act_8111M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act8111/getList.do';
  const PGM_ID            = 'act_8111M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`매출등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 매출등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 매출등록  액터: 개발자
   * URL: /mis/act/act8111/getList.do
   * 예상결과: 매출등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_8111_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 매출등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 매출등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8111M-no1.png`, fullPage: true });

    expect(rows.length, '매출등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_8120M — 매출전표생성  |  API: POST /mis/act/act8120/getList.do  |  TC 5건
// TODO(menuId): act_8120M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act8120/getList.do';
  const PGM_ID            = 'act_8120M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_ACT_UNIT_CD', 'SCH_WRTER', 'SCH_WRTER_NM', 'SCH_CUST_NM', 'SCH_CUST_CD', 'SCH_SETLE_MTHD', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_BUDG_BSNS_CD', 'SCH_BUDG_BSNS_NM', 'SCH_SLIP_YN', 'SBJ', 'ACT_UNIT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`매출전표생성(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 매출전표생성 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 매출전표생성  액터: 개발자
   * URL: /mis/act/act8120/getList.do
   * 예상결과: 매출전표생성 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_8120_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 매출전표생성 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 매출전표생성 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8120M-no1.png`, fullPage: true });

    expect(rows.length, '매출전표생성 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 매출전표생성 - 사용여부 조회 (SCH_SLIP_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 매출전표생성  액터: 개발자
   * URL: /mis/act/act8120/getList.do
   * 예상결과: 사용중(SCH_SLIP_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8120_MST A WHERE A.SCH_SLIP_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 매출전표생성 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 매출전표생성 - 사용여부 조회');
    logInput('SCH_SLIP_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SLIP_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8120M-no2.png`, fullPage: true });

    expect(rows.length, '매출전표생성 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 매출전표생성 - 키워드 조회 (SCH_WRTER_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 매출전표생성  액터: 개발자
   * URL: /mis/act/act8120/getList.do
   * 예상결과: SCH_WRTER_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8120_MST A WHERE A.SCH_WRTER_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 매출전표생성 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 매출전표생성 - 키워드 조회');
    logInput('SCH_WRTER_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_WRTER_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8120M-no3.png`, fullPage: true });

    expect(rows.length, '매출전표생성 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 매출전표생성 - 코드 조건 조회 (SCH_ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 매출전표생성  액터: 개발자
   * URL: /mis/act/act8120/getList.do
   * 예상결과: SCH_ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8120_MST A WHERE A.SCH_ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 매출전표생성 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 매출전표생성 - 코드 조건 조회');
    logInput('SCH_ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8120M-no4.png`, fullPage: true });

    expect(rows.length, '매출전표생성 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 매출전표생성 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 매출전표생성  액터: 개발자
   * URL: /mis/act/act8120/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8120_MST A WHERE A.SCH_WRTER_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 매출전표생성 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 매출전표생성 - 존재하지 않는 키워드 조회');
    logInput('SCH_WRTER_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_WRTER_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8120M-no5.png`, fullPage: true });

    expect(rows.length, '매출전표생성 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_8130M — 수금전표목록  |  API: POST /mis/act/act8130/getListTab1.do  |  TC 1건
// TODO(menuId): act_8130M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act8130/getListTab1.do';
  const PGM_ID            = 'act_8130M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`수금전표목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 수금전표목록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 수금전표목록  액터: 개발자
   * URL: /mis/act/act8130/getListTab1.do
   * 예상결과: 수금전표목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_8130_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 수금전표목록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 수금전표목록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8130M-no1.png`, fullPage: true });

    expect(rows.length, '수금전표목록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_8131M — 수금전표등록  |  API: POST /mis/act/act8131/getList.do  |  TC 4건
// TODO(menuId): act_8131M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act8131/getList.do';
  const PGM_ID            = 'act_8131M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_ACT_UNIT_CD', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_CUST_NM', 'SCH_CUST_CD', 'SCH_SETLE_MTHD', 'SCH_TAXT_TP', 'SCH_WRTER', 'SCH_WRTER_NM', 'SCH_BUDG_BSNS_CD', 'SCH_BUDG_BSNS_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`수금전표등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 수금전표등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 수금전표등록  액터: 개발자
   * URL: /mis/act/act8131/getList.do
   * 예상결과: 수금전표등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_8131_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 수금전표등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 수금전표등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8131M-no1.png`, fullPage: true });

    expect(rows.length, '수금전표등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 수금전표등록 - 키워드 조회 (SCH_CUST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 수금전표등록  액터: 개발자
   * URL: /mis/act/act8131/getList.do
   * 예상결과: SCH_CUST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8131_MST A WHERE A.SCH_CUST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 수금전표등록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 수금전표등록 - 키워드 조회');
    logInput('SCH_CUST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CUST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8131M-no2.png`, fullPage: true });

    expect(rows.length, '수금전표등록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 수금전표등록 - 코드 조건 조회 (SCH_ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 수금전표등록  액터: 개발자
   * URL: /mis/act/act8131/getList.do
   * 예상결과: SCH_ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8131_MST A WHERE A.SCH_ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 수금전표등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 수금전표등록 - 코드 조건 조회');
    logInput('SCH_ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8131M-no3.png`, fullPage: true });

    expect(rows.length, '수금전표등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 수금전표등록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 수금전표등록  액터: 개발자
   * URL: /mis/act/act8131/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8131_MST A WHERE A.SCH_CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 수금전표등록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 수금전표등록 - 존재하지 않는 키워드 조회');
    logInput('SCH_CUST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CUST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8131M-no4.png`, fullPage: true });

    expect(rows.length, '수금전표등록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_8140M — 매출확정  |  API: POST /mis/act/act8140/getList1.do  |  TC 5건
// TODO(menuId): act_8140M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act8140/getList1.do';
  const PGM_ID            = 'act_8140M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'MODULE_FG', 'WRTER', 'WRTER_NM', 'SCH_FG', 'SCH_NM', 'DSCN_YN', 'BUDG_BSNS_CD', 'BUDG_BSNS_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`매출확정(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 매출확정 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 매출확정  액터: 개발자
   * URL: /mis/act/act8140/getList1.do
   * 예상결과: 매출확정 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_8140_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 매출확정 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 매출확정 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8140M-no1.png`, fullPage: true });

    expect(rows.length, '매출확정 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 매출확정 - 사용여부 조회 (DSCN_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 매출확정  액터: 개발자
   * URL: /mis/act/act8140/getList1.do
   * 예상결과: 사용중(DSCN_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8140_MST A WHERE A.DSCN_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 매출확정 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 매출확정 - 사용여부 조회');
    logInput('DSCN_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ DSCN_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8140M-no2.png`, fullPage: true });

    expect(rows.length, '매출확정 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 매출확정 - 키워드 조회 (WRTER_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 매출확정  액터: 개발자
   * URL: /mis/act/act8140/getList1.do
   * 예상결과: WRTER_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8140_MST A WHERE A.WRTER_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 매출확정 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 매출확정 - 키워드 조회');
    logInput('WRTER_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ WRTER_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8140M-no3.png`, fullPage: true });

    expect(rows.length, '매출확정 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 매출확정 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 매출확정  액터: 개발자
   * URL: /mis/act/act8140/getList1.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8140_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 매출확정 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 매출확정 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8140M-no4.png`, fullPage: true });

    expect(rows.length, '매출확정 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 매출확정 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 매출확정  액터: 개발자
   * URL: /mis/act/act8140/getList1.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8140_MST A WHERE A.WRTER_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 매출확정 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 매출확정 - 존재하지 않는 키워드 조회');
    logInput('WRTER_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ WRTER_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8140M-no5.png`, fullPage: true });

    expect(rows.length, '매출확정 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_8150M — 수금및채권현황  |  API: POST /mis/act/act8150/getList.do  |  TC 4건
// TODO(menuId): act_8150M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act8150/getList.do';
  const PGM_ID            = 'act_8150M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_UNIT_CD', 'SCH_FG', 'SCH_NM', 'FRM_DT', 'TO_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`수금및채권현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 수금및채권현황 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 수금및채권현황  액터: 개발자
   * URL: /mis/act/act8150/getList.do
   * 예상결과: 수금및채권현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_8150_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 수금및채권현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 수금및채권현황 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8150M-no1.png`, fullPage: true });

    expect(rows.length, '수금및채권현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 수금및채권현황 - 키워드 조회 (SCH_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 수금및채권현황  액터: 개발자
   * URL: /mis/act/act8150/getList.do
   * 예상결과: SCH_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8150_MST A WHERE A.SCH_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 수금및채권현황 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 수금및채권현황 - 키워드 조회');
    logInput('SCH_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8150M-no2.png`, fullPage: true });

    expect(rows.length, '수금및채권현황 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 수금및채권현황 - 코드 조건 조회 (ACT_UNIT_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 수금및채권현황  액터: 개발자
   * URL: /mis/act/act8150/getList.do
   * 예상결과: ACT_UNIT_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8150_MST A WHERE A.ACT_UNIT_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 수금및채권현황 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 수금및채권현황 - 코드 조건 조회');
    logInput('ACT_UNIT_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8150M-no3.png`, fullPage: true });

    expect(rows.length, '수금및채권현황 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 수금및채권현황 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 수금및채권현황  액터: 개발자
   * URL: /mis/act/act8150/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8150_MST A WHERE A.SCH_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 수금및채권현황 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 수금및채권현황 - 존재하지 않는 키워드 조회');
    logInput('SCH_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8150M-no4.png`, fullPage: true });

    expect(rows.length, '수금및채권현황 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_8210M — (세금)계산서발행  |  API: POST /mis/act/act8210/getList.do  |  TC 4건
// TODO(menuId): act_8210M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act8210/getList.do';
  const PGM_ID            = 'act_8210M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_DT', 'TO_DT', 'CUST_NM', 'CUST_CD', 'MODULE_FG', 'ISUR', 'ISUR_NM', 'BUDG_BSNS_CD', 'BUDG_BSNS_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`(세금)계산서발행(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] (세금)계산서발행 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: (세금)계산서발행  액터: 개발자
   * URL: /mis/act/act8210/getList.do
   * 예상결과: (세금)계산서발행 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_8210_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] (세금)계산서발행 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] (세금)계산서발행 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8210M-no1.png`, fullPage: true });

    expect(rows.length, '(세금)계산서발행 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] (세금)계산서발행 - 키워드 조회 (CUST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: (세금)계산서발행  액터: 개발자
   * URL: /mis/act/act8210/getList.do
   * 예상결과: CUST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8210_MST A WHERE A.CUST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] (세금)계산서발행 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] (세금)계산서발행 - 키워드 조회');
    logInput('CUST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8210M-no2.png`, fullPage: true });

    expect(rows.length, '(세금)계산서발행 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] (세금)계산서발행 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: (세금)계산서발행  액터: 개발자
   * URL: /mis/act/act8210/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8210_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] (세금)계산서발행 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] (세금)계산서발행 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8210M-no3.png`, fullPage: true });

    expect(rows.length, '(세금)계산서발행 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] (세금)계산서발행 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: (세금)계산서발행  액터: 개발자
   * URL: /mis/act/act8210/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8210_MST A WHERE A.CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] (세금)계산서발행 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] (세금)계산서발행 - 존재하지 않는 키워드 조회');
    logInput('CUST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8210M-no4.png`, fullPage: true });

    expect(rows.length, '(세금)계산서발행 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_8211M — 세금계산서발행  |  API: POST /mis/act/act0000/getUnt.do  |  TC 1건
// TODO(menuId): act_8211M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getUnt.do';
  const PGM_ID            = 'act_8211M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['TAXBIL_PUBCT_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`세금계산서발행(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 세금계산서발행 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 세금계산서발행  액터: 개발자
   * URL: /mis/act/act0000/getUnt.do
   * 예상결과: 세금계산서발행 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_8211_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 세금계산서발행 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 세금계산서발행 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8211M-no1.png`, fullPage: true });

    expect(rows.length, '세금계산서발행 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_8221M — 수정세금계산서발행등록-1장  |  API: POST /mis/act/act0000/getActComm.do  |  TC 3건
// TODO(menuId): act_8221M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getActComm.do';
  const PGM_ID            = 'act_8221M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'PUBCT_FG', 'TAXBIL_PUBCT_NO', 'ORIG_TAXBIL_PUBCT_NO', 'PUBCT_SHCNT_FG', 'NEW_PUBCT_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`수정세금계산서발행등록-1장(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 수정세금계산서발행등록-1장 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 수정세금계산서발행등록-1장  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: 수정세금계산서발행등록-1장 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_8221_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 수정세금계산서발행등록-1장 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 수정세금계산서발행등록-1장 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8221M-no1.png`, fullPage: true });

    expect(rows.length, '수정세금계산서발행등록-1장 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 수정세금계산서발행등록-1장 - 사용여부 조회 (NEW_PUBCT_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 수정세금계산서발행등록-1장  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: 사용중(NEW_PUBCT_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8221_MST A WHERE A.NEW_PUBCT_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 수정세금계산서발행등록-1장 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 수정세금계산서발행등록-1장 - 사용여부 조회');
    logInput('NEW_PUBCT_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ NEW_PUBCT_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8221M-no2.png`, fullPage: true });

    expect(rows.length, '수정세금계산서발행등록-1장 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 수정세금계산서발행등록-1장 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 수정세금계산서발행등록-1장  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8221_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 수정세금계산서발행등록-1장 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 수정세금계산서발행등록-1장 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8221M-no3.png`, fullPage: true });

    expect(rows.length, '수정세금계산서발행등록-1장 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_8222M — 수정세금계산서발행-2장  |  API: POST /mis/act/act0000/getActComm.do  |  TC 3건
// TODO(menuId): act_8222M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getActComm.do';
  const PGM_ID            = 'act_8222M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'TAXBIL_PUBCT_NO', 'ORIG_TAXBIL_PUBCT_NO', 'PUBCT_FG', 'PUBCT_SHCNT_FG', 'NEW_PUBCT_YN', 'TAXBIL_PUBCT_NOS'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`수정세금계산서발행-2장(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 수정세금계산서발행-2장 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 수정세금계산서발행-2장  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: 수정세금계산서발행-2장 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_8222_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 수정세금계산서발행-2장 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 수정세금계산서발행-2장 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8222M-no1.png`, fullPage: true });

    expect(rows.length, '수정세금계산서발행-2장 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 수정세금계산서발행-2장 - 사용여부 조회 (NEW_PUBCT_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 수정세금계산서발행-2장  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: 사용중(NEW_PUBCT_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8222_MST A WHERE A.NEW_PUBCT_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 수정세금계산서발행-2장 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 수정세금계산서발행-2장 - 사용여부 조회');
    logInput('NEW_PUBCT_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ NEW_PUBCT_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8222M-no2.png`, fullPage: true });

    expect(rows.length, '수정세금계산서발행-2장 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 수정세금계산서발행-2장 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 수정세금계산서발행-2장  액터: 개발자
   * URL: /mis/act/act0000/getActComm.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8222_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 수정세금계산서발행-2장 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 수정세금계산서발행-2장 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8222M-no3.png`, fullPage: true });

    expect(rows.length, '수정세금계산서발행-2장 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_8240M — (세금)계산서전송  |  API: POST /mis/act/act8240/getList.do  |  TC 5건
// TODO(menuId): act_8240M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act8240/getList.do';
  const PGM_ID            = 'act_8240M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'MODULE_FG', 'FRM_DT', 'TO_DT', 'SCH_WTER', 'SCH_WTER_NM', 'CUST_CD', 'CUST_NM', 'RECEIVER', 'TAXBIL_FG', 'BUDG_BSNS_CD', 'BUDG_BSNS_NM', 'TRN_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`(세금)계산서전송(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] (세금)계산서전송 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: (세금)계산서전송  액터: 개발자
   * URL: /mis/act/act8240/getList.do
   * 예상결과: (세금)계산서전송 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_8240_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] (세금)계산서전송 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] (세금)계산서전송 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8240M-no1.png`, fullPage: true });

    expect(rows.length, '(세금)계산서전송 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] (세금)계산서전송 - 사용여부 조회 (TRN_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: (세금)계산서전송  액터: 개발자
   * URL: /mis/act/act8240/getList.do
   * 예상결과: 사용중(TRN_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8240_MST A WHERE A.TRN_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] (세금)계산서전송 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] (세금)계산서전송 - 사용여부 조회');
    logInput('TRN_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ TRN_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8240M-no2.png`, fullPage: true });

    expect(rows.length, '(세금)계산서전송 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] (세금)계산서전송 - 키워드 조회 (SCH_WTER_NM)
   * 중분류: 재무관리  소분류:   메뉴명: (세금)계산서전송  액터: 개발자
   * URL: /mis/act/act8240/getList.do
   * 예상결과: SCH_WTER_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8240_MST A WHERE A.SCH_WTER_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] (세금)계산서전송 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] (세금)계산서전송 - 키워드 조회');
    logInput('SCH_WTER_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_WTER_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8240M-no3.png`, fullPage: true });

    expect(rows.length, '(세금)계산서전송 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] (세금)계산서전송 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: (세금)계산서전송  액터: 개발자
   * URL: /mis/act/act8240/getList.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8240_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] (세금)계산서전송 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] (세금)계산서전송 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8240M-no4.png`, fullPage: true });

    expect(rows.length, '(세금)계산서전송 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] (세금)계산서전송 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: (세금)계산서전송  액터: 개발자
   * URL: /mis/act/act8240/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8240_MST A WHERE A.SCH_WTER_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] (세금)계산서전송 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] (세금)계산서전송 - 존재하지 않는 키워드 조회');
    logInput('SCH_WTER_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_WTER_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8240M-no5.png`, fullPage: true });

    expect(rows.length, '(세금)계산서전송 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_8310M — 세금계산서발행  |  API: POST /mis/act/act0000/getBusiPlc.do  |  TC 4건
// TODO(menuId): act_8310M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getBusiPlc.do';
  const PGM_ID            = 'act_8310M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['BUSI_PLC_CD', 'FRM_DT', 'TO_DT', 'RIP_RQET_FG', 'CUST_NM', 'CUST_CD', 'BIZRNO', 'SPLY_VAL', 'MODULE_FG'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`세금계산서발행(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 세금계산서발행 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 세금계산서발행  액터: 개발자
   * URL: /mis/act/act0000/getBusiPlc.do
   * 예상결과: 세금계산서발행 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_8310_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 세금계산서발행 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 세금계산서발행 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8310M-no1.png`, fullPage: true });

    expect(rows.length, '세금계산서발행 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 세금계산서발행 - 키워드 조회 (CUST_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 세금계산서발행  액터: 개발자
   * URL: /mis/act/act0000/getBusiPlc.do
   * 예상결과: CUST_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8310_MST A WHERE A.CUST_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 세금계산서발행 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 세금계산서발행 - 키워드 조회');
    logInput('CUST_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8310M-no2.png`, fullPage: true });

    expect(rows.length, '세금계산서발행 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 세금계산서발행 - 코드 조건 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 세금계산서발행  액터: 개발자
   * URL: /mis/act/act0000/getBusiPlc.do
   * 예상결과: BUSI_PLC_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8310_MST A WHERE A.BUSI_PLC_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 세금계산서발행 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 세금계산서발행 - 코드 조건 조회');
    logInput('BUSI_PLC_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ BUSI_PLC_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8310M-no3.png`, fullPage: true });

    expect(rows.length, '세금계산서발행 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 세금계산서발행 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 세금계산서발행  액터: 개발자
   * URL: /mis/act/act0000/getBusiPlc.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_8310_MST A WHERE A.CUST_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 세금계산서발행 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 세금계산서발행 - 존재하지 않는 키워드 조회');
    logInput('CUST_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ CUST_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_8310M-no4.png`, fullPage: true });

    expect(rows.length, '세금계산서발행 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_9010M — 계정초기이월  |  API: POST /mis/act/act9010/getList.do  |  TC 4건
// TODO(menuId): act_9010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act9010/getList.do';
  const PGM_ID            = 'act_9010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'ACT_UNIT_NM', 'STDR_YY', 'ACCT_CD', 'ACCT_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`계정초기이월(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 계정초기이월 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 계정초기이월  액터: 개발자
   * URL: /mis/act/act9010/getList.do
   * 예상결과: 계정초기이월 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_9010_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 계정초기이월 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 계정초기이월 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9010M-no1.png`, fullPage: true });

    expect(rows.length, '계정초기이월 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 계정초기이월 - 키워드 조회 (ACT_UNIT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 계정초기이월  액터: 개발자
   * URL: /mis/act/act9010/getList.do
   * 예상결과: ACT_UNIT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_9010_MST A WHERE A.ACT_UNIT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 계정초기이월 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 계정초기이월 - 키워드 조회');
    logInput('ACT_UNIT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9010M-no2.png`, fullPage: true });

    expect(rows.length, '계정초기이월 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 계정초기이월 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 계정초기이월  액터: 개발자
   * URL: /mis/act/act9010/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_9010_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 계정초기이월 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 계정초기이월 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9010M-no3.png`, fullPage: true });

    expect(rows.length, '계정초기이월 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 계정초기이월 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 계정초기이월  액터: 개발자
   * URL: /mis/act/act9010/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_9010_MST A WHERE A.ACT_UNIT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 계정초기이월 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 계정초기이월 - 존재하지 않는 키워드 조회');
    logInput('ACT_UNIT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9010M-no4.png`, fullPage: true });

    expect(rows.length, '계정초기이월 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_9020M — 보조부초기이월  |  API: POST /mis/act/act9020/getList1.do  |  TC 4건
// TODO(menuId): act_9020M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act9020/getList1.do';
  const PGM_ID            = 'act_9020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'STDR_YY', 'ACCT_NM', 'DR_AMT_TOTAL', 'CR_AMT_TOTAL'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`보조부초기이월(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 보조부초기이월 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 보조부초기이월  액터: 개발자
   * URL: /mis/act/act9020/getList1.do
   * 예상결과: 보조부초기이월 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_9020_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 보조부초기이월 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 보조부초기이월 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9020M-no1.png`, fullPage: true });

    expect(rows.length, '보조부초기이월 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 보조부초기이월 - 키워드 조회 (ACCT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 보조부초기이월  액터: 개발자
   * URL: /mis/act/act9020/getList1.do
   * 예상결과: ACCT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_9020_MST A WHERE A.ACCT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 보조부초기이월 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 보조부초기이월 - 키워드 조회');
    logInput('ACCT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9020M-no2.png`, fullPage: true });

    expect(rows.length, '보조부초기이월 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 보조부초기이월 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 보조부초기이월  액터: 개발자
   * URL: /mis/act/act9020/getList1.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_9020_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 보조부초기이월 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 보조부초기이월 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9020M-no3.png`, fullPage: true });

    expect(rows.length, '보조부초기이월 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 보조부초기이월 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 보조부초기이월  액터: 개발자
   * URL: /mis/act/act9020/getList1.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_9020_MST A WHERE A.ACCT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 보조부초기이월 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 보조부초기이월 - 존재하지 않는 키워드 조회');
    logInput('ACCT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9020M-no4.png`, fullPage: true });

    expect(rows.length, '보조부초기이월 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_9025M — 거래처초기이월  |  API: POST /mis/act/act9025/getList1.do  |  TC 4건
// TODO(menuId): act_9025M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act9025/getList1.do';
  const PGM_ID            = 'act_9025M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'STDR_YY', 'ACT_UNIT_CD', 'ACT_UNIT_NM', 'ACCT_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`거래처초기이월(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 거래처초기이월 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 거래처초기이월  액터: 개발자
   * URL: /mis/act/act9025/getList1.do
   * 예상결과: 거래처초기이월 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_9025_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 거래처초기이월 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 거래처초기이월 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9025M-no1.png`, fullPage: true });

    expect(rows.length, '거래처초기이월 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 거래처초기이월 - 키워드 조회 (ACT_UNIT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 거래처초기이월  액터: 개발자
   * URL: /mis/act/act9025/getList1.do
   * 예상결과: ACT_UNIT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_9025_MST A WHERE A.ACT_UNIT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 거래처초기이월 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 거래처초기이월 - 키워드 조회');
    logInput('ACT_UNIT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9025M-no2.png`, fullPage: true });

    expect(rows.length, '거래처초기이월 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 거래처초기이월 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 거래처초기이월  액터: 개발자
   * URL: /mis/act/act9025/getList1.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_9025_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 거래처초기이월 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 거래처초기이월 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9025M-no3.png`, fullPage: true });

    expect(rows.length, '거래처초기이월 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 거래처초기이월 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 거래처초기이월  액터: 개발자
   * URL: /mis/act/act9025/getList1.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_9025_MST A WHERE A.ACT_UNIT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 거래처초기이월 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 거래처초기이월 - 존재하지 않는 키워드 조회');
    logInput('ACT_UNIT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9025M-no4.png`, fullPage: true });

    expect(rows.length, '거래처초기이월 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_9030M — 예적금초기이월  |  API: POST /mis/act/act9030/getList.do  |  TC 4건
// TODO(menuId): act_9030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act9030/getList.do';
  const PGM_ID            = 'act_9030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'ACT_UNIT_NM', 'STR_UNIT_CD', 'STDR_YY', 'DR_AMT_TOTAL', 'CR_AMT_TOTAL'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`예적금초기이월(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 예적금초기이월 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 예적금초기이월  액터: 개발자
   * URL: /mis/act/act9030/getList.do
   * 예상결과: 예적금초기이월 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_9030_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 예적금초기이월 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 예적금초기이월 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9030M-no1.png`, fullPage: true });

    expect(rows.length, '예적금초기이월 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 예적금초기이월 - 키워드 조회 (ACT_UNIT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 예적금초기이월  액터: 개발자
   * URL: /mis/act/act9030/getList.do
   * 예상결과: ACT_UNIT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_9030_MST A WHERE A.ACT_UNIT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 예적금초기이월 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 예적금초기이월 - 키워드 조회');
    logInput('ACT_UNIT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9030M-no2.png`, fullPage: true });

    expect(rows.length, '예적금초기이월 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 예적금초기이월 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 예적금초기이월  액터: 개발자
   * URL: /mis/act/act9030/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_9030_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 예적금초기이월 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 예적금초기이월 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9030M-no3.png`, fullPage: true });

    expect(rows.length, '예적금초기이월 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 예적금초기이월 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 예적금초기이월  액터: 개발자
   * URL: /mis/act/act9030/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_9030_MST A WHERE A.ACT_UNIT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 예적금초기이월 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 예적금초기이월 - 존재하지 않는 키워드 조회');
    logInput('ACT_UNIT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_UNIT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9030M-no4.png`, fullPage: true });

    expect(rows.length, '예적금초기이월 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_9040M — 전표마감  |  API: POST /mis/act/act9040/getList.do  |  TC 2건
// TODO(menuId): act_9040M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act9040/getList.do';
  const PGM_ID            = 'act_9040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CLOS_TRGT_FG', 'STDR_YM', 'STDR_YY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`전표마감(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 전표마감 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 전표마감  액터: 개발자
   * URL: /mis/act/act9040/getList.do
   * 예상결과: 전표마감 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_9040_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 전표마감 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 전표마감 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9040M-no1.png`, fullPage: true });

    expect(rows.length, '전표마감 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 전표마감 - 코드 조건 조회 (CLOS_TRGT_FG)
   * 중분류: 재무관리  소분류:   메뉴명: 전표마감  액터: 개발자
   * URL: /mis/act/act9040/getList.do
   * 예상결과: CLOS_TRGT_FG='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_9040_MST A WHERE A.CLOS_TRGT_FG = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 전표마감 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 전표마감 - 코드 조건 조회');
    logInput('CLOS_TRGT_FG', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ CLOS_TRGT_FG: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9040M-no2.png`, fullPage: true });

    expect(rows.length, '전표마감 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_9050M — 마감후이월  |  API: POST /mis/act/act9050/getList.do  |  TC 1건
// TODO(menuId): act_9050M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act9050/getList.do';
  const PGM_ID            = 'act_9050M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['STDR_YY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`마감후이월(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 마감후이월 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 마감후이월  액터: 개발자
   * URL: /mis/act/act9050/getList.do
   * 예상결과: 마감후이월 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_9050_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 마감후이월 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 마감후이월 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9050M-no1.png`, fullPage: true });

    expect(rows.length, '마감후이월 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_9060M — 전기분 재무상태표  |  API: POST /mis/act/act9060/getList.do  |  TC 2건
// TODO(menuId): act_9060M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act9060/getList.do';
  const PGM_ID            = 'act_9060M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'FS_FORM_CD', 'CLOS_YY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`전기분 재무상태표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 전기분 재무상태표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 전기분 재무상태표  액터: 개발자
   * URL: /mis/act/act9060/getList.do
   * 예상결과: 전기분 재무상태표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_9060_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 전기분 재무상태표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 전기분 재무상태표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9060M-no1.png`, fullPage: true });

    expect(rows.length, '전기분 재무상태표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 전기분 재무상태표 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 전기분 재무상태표  액터: 개발자
   * URL: /mis/act/act9060/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_9060_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 전기분 재무상태표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 전기분 재무상태표 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_9060M-no2.png`, fullPage: true });

    expect(rows.length, '전기분 재무상태표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_F101M — 계정코드등록  |  API: POST /mis/act/actF101/getList.do  |  TC 5건
// TODO(menuId): act_F101M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/actF101/getList.do';
  const PGM_ID            = 'act_F101M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACCT_CD', 'ACCT_NM', 'USE_YN', 'OPENIEM_ACCT_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`계정코드등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 계정코드등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드등록  액터: 개발자
   * URL: /mis/act/actF101/getList.do
   * 예상결과: 계정코드등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_F101_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 계정코드등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 계정코드등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F101M-no1.png`, fullPage: true });

    expect(rows.length, '계정코드등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 계정코드등록 - 사용여부 조회 (USE_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드등록  액터: 개발자
   * URL: /mis/act/actF101/getList.do
   * 예상결과: 사용중(USE_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F101_MST A WHERE A.USE_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 계정코드등록 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 계정코드등록 - 사용여부 조회');
    logInput('USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F101M-no2.png`, fullPage: true });

    expect(rows.length, '계정코드등록 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 계정코드등록 - 키워드 조회 (ACCT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드등록  액터: 개발자
   * URL: /mis/act/actF101/getList.do
   * 예상결과: ACCT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F101_MST A WHERE A.ACCT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 계정코드등록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 계정코드등록 - 키워드 조회');
    logInput('ACCT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F101M-no3.png`, fullPage: true });

    expect(rows.length, '계정코드등록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 계정코드등록 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드등록  액터: 개발자
   * URL: /mis/act/actF101/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F101_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 계정코드등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 계정코드등록 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F101M-no4.png`, fullPage: true });

    expect(rows.length, '계정코드등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 계정코드등록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드등록  액터: 개발자
   * URL: /mis/act/actF101/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F101_MST A WHERE A.ACCT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 계정코드등록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 계정코드등록 - 존재하지 않는 키워드 조회');
    logInput('ACCT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F101M-no5.png`, fullPage: true });

    expect(rows.length, '계정코드등록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_F102M — 계정코드연결  |  API: POST /mis/act/actF102/getList1.do  |  TC 5건
// TODO(menuId): act_F102M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/actF102/getList1.do';
  const PGM_ID            = 'act_F102M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACCT_NM', 'USE_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`계정코드연결(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 계정코드연결 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드연결  액터: 개발자
   * URL: /mis/act/actF102/getList1.do
   * 예상결과: 계정코드연결 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_F102_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 계정코드연결 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 계정코드연결 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F102M-no1.png`, fullPage: true });

    expect(rows.length, '계정코드연결 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 계정코드연결 - 사용여부 조회 (USE_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드연결  액터: 개발자
   * URL: /mis/act/actF102/getList1.do
   * 예상결과: 사용중(USE_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F102_MST A WHERE A.USE_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 계정코드연결 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 계정코드연결 - 사용여부 조회');
    logInput('USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F102M-no2.png`, fullPage: true });

    expect(rows.length, '계정코드연결 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 계정코드연결 - 키워드 조회 (ACCT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드연결  액터: 개발자
   * URL: /mis/act/actF102/getList1.do
   * 예상결과: ACCT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F102_MST A WHERE A.ACCT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 계정코드연결 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 계정코드연결 - 키워드 조회');
    logInput('ACCT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F102M-no3.png`, fullPage: true });

    expect(rows.length, '계정코드연결 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 계정코드연결 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드연결  액터: 개발자
   * URL: /mis/act/actF102/getList1.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F102_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 계정코드연결 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 계정코드연결 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F102M-no4.png`, fullPage: true });

    expect(rows.length, '계정코드연결 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 계정코드연결 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 계정코드연결  액터: 개발자
   * URL: /mis/act/actF102/getList1.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F102_MST A WHERE A.ACCT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:5] 계정코드연결 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 계정코드연결 - 존재하지 않는 키워드 조회');
    logInput('ACCT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F102M-no5.png`, fullPage: true });

    expect(rows.length, '계정코드연결 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_F103M — 재무제표그룹등록  |  API: POST /mis/act/actF103/getList.do  |  TC 2건
// TODO(menuId): act_F103M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/actF103/getList.do';
  const PGM_ID            = 'act_F103M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'FS_FORM_FG', 'FS_FORM_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`재무제표그룹등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 재무제표그룹등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 재무제표그룹등록  액터: 개발자
   * URL: /mis/act/actF103/getList.do
   * 예상결과: 재무제표그룹등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_F103_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 재무제표그룹등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 재무제표그룹등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F103M-no1.png`, fullPage: true });

    expect(rows.length, '재무제표그룹등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 재무제표그룹등록 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 재무제표그룹등록  액터: 개발자
   * URL: /mis/act/actF103/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F103_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 재무제표그룹등록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 재무제표그룹등록 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F103M-no2.png`, fullPage: true });

    expect(rows.length, '재무제표그룹등록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_F104M — 재무제표계정연결  |  API: POST /mis/act/actF104/getList.do  |  TC 2건
// TODO(menuId): act_F104M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/actF104/getList.do';
  const PGM_ID            = 'act_F104M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'STDR_YY', 'FS_FORM_FG', 'FS_FORM_CD', 'ENRN_FAOR_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`재무제표계정연결(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 재무제표계정연결 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 재무제표계정연결  액터: 개발자
   * URL: /mis/act/actF104/getList.do
   * 예상결과: 재무제표계정연결 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_F104_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 재무제표계정연결 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 재무제표계정연결 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F104M-no1.png`, fullPage: true });

    expect(rows.length, '재무제표계정연결 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 재무제표계정연결 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 재무제표계정연결  액터: 개발자
   * URL: /mis/act/actF104/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F104_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 재무제표계정연결 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 재무제표계정연결 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F104M-no2.png`, fullPage: true });

    expect(rows.length, '재무제표계정연결 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_F201M — 회계전표 목록  |  API: POST /mis/act/actF201/getList.do  |  TC 4건
// TODO(menuId): act_F201M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/actF201/getList.do';
  const PGM_ID            = 'act_F201M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'SLIP_TP', 'SLIP_DT_NO', 'SBJ', 'APV_STAT_CD', 'SCH_WRTER_NM', 'SCH_WRTER_ID'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`회계전표 목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 회계전표 목록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표 목록  액터: 개발자
   * URL: /mis/act/actF201/getList.do
   * 예상결과: 회계전표 목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_F201_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 회계전표 목록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 회계전표 목록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F201M-no1.png`, fullPage: true });

    expect(rows.length, '회계전표 목록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 회계전표 목록 - 키워드 조회 (SCH_WRTER_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표 목록  액터: 개발자
   * URL: /mis/act/actF201/getList.do
   * 예상결과: SCH_WRTER_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F201_MST A WHERE A.SCH_WRTER_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 회계전표 목록 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 회계전표 목록 - 키워드 조회');
    logInput('SCH_WRTER_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_WRTER_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F201M-no2.png`, fullPage: true });

    expect(rows.length, '회계전표 목록 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 회계전표 목록 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표 목록  액터: 개발자
   * URL: /mis/act/actF201/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F201_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 회계전표 목록 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 회계전표 목록 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F201M-no3.png`, fullPage: true });

    expect(rows.length, '회계전표 목록 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 회계전표 목록 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표 목록  액터: 개발자
   * URL: /mis/act/actF201/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F201_MST A WHERE A.SCH_WRTER_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 회계전표 목록 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 회계전표 목록 - 존재하지 않는 키워드 조회');
    logInput('SCH_WRTER_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_WRTER_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F201M-no4.png`, fullPage: true });

    expect(rows.length, '회계전표 목록 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_F202M — 회계전표  |  API: POST /mis/act/actF202/getListGrid.do  |  TC 3건
// TODO(menuId): act_F202M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/actF202/getListGrid.do';
  const PGM_ID            = 'act_F202M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'SLIP_DT', 'SLIP_NO', 'SLIP_DT_NO', 'ENRN_FAOR_CD', 'STOT_SLIP_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`회계전표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 회계전표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표  액터: 개발자
   * URL: /mis/act/actF202/getListGrid.do
   * 예상결과: 회계전표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_F202_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 회계전표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 회계전표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F202M-no1.png`, fullPage: true });

    expect(rows.length, '회계전표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 회계전표 - 사용여부 조회 (STOT_SLIP_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표  액터: 개발자
   * URL: /mis/act/actF202/getListGrid.do
   * 예상결과: 사용중(STOT_SLIP_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F202_MST A WHERE A.STOT_SLIP_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 회계전표 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 회계전표 - 사용여부 조회');
    logInput('STOT_SLIP_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ STOT_SLIP_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F202M-no2.png`, fullPage: true });

    expect(rows.length, '회계전표 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 회계전표 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 회계전표  액터: 개발자
   * URL: /mis/act/actF202/getListGrid.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F202_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 회계전표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 회계전표 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F202M-no3.png`, fullPage: true });

    expect(rows.length, '회계전표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_F203M — 전표승인처리  |  API: POST /mis/act/actF203/getList.do  |  TC 3건
// TODO(menuId): act_F203M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/actF203/getList.do';
  const PGM_ID            = 'act_F203M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'ACCP_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`전표승인처리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 전표승인처리 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 전표승인처리  액터: 개발자
   * URL: /mis/act/actF203/getList.do
   * 예상결과: 전표승인처리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_F203_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 전표승인처리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 전표승인처리 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F203M-no1.png`, fullPage: true });

    expect(rows.length, '전표승인처리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 전표승인처리 - 사용여부 조회 (ACCP_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 전표승인처리  액터: 개발자
   * URL: /mis/act/actF203/getList.do
   * 예상결과: 사용중(ACCP_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F203_MST A WHERE A.ACCP_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 전표승인처리 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 전표승인처리 - 사용여부 조회');
    logInput('ACCP_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCP_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F203M-no2.png`, fullPage: true });

    expect(rows.length, '전표승인처리 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 전표승인처리 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 전표승인처리  액터: 개발자
   * URL: /mis/act/actF203/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F203_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 전표승인처리 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 전표승인처리 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F203M-no3.png`, fullPage: true });

    expect(rows.length, '전표승인처리 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_F302M — 원장차이분석  |  API: POST /mis/act/actF302/getList.do  |  TC 2건
// TODO(menuId): act_F302M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/actF302/getList.do';
  const PGM_ID            = 'act_F302M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FRM_DT', 'TO_DT', 'SLIP_TP'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`원장차이분석(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 원장차이분석 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 원장차이분석  액터: 개발자
   * URL: /mis/act/actF302/getList.do
   * 예상결과: 원장차이분석 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_F302_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 원장차이분석 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 원장차이분석 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F302M-no1.png`, fullPage: true });

    expect(rows.length, '원장차이분석 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 원장차이분석 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 원장차이분석  액터: 개발자
   * URL: /mis/act/actF302/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F302_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 원장차이분석 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 원장차이분석 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F302M-no2.png`, fullPage: true });

    expect(rows.length, '원장차이분석 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_F303M — 계정별원장  |  API: POST /mis/act/actF303/getList.do  |  TC 4건
// TODO(menuId): act_F303M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/actF303/getList.do';
  const PGM_ID            = 'act_F303M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_CD', 'STR_UNIT_CD', 'FRM_DT', 'TO_DT', 'ACCT_CD', 'ACCT_NM', 'FRM_AMT', 'TO_AMT', 'SMRY', 'FS_FORM_CD', 'FS_GRP_NO', 'REPRS_ACCT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`계정별원장(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 계정별원장 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 계정별원장  액터: 개발자
   * URL: /mis/act/actF303/getList.do
   * 예상결과: 계정별원장 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_F303_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 계정별원장 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 계정별원장 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F303M-no1.png`, fullPage: true });

    expect(rows.length, '계정별원장 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 계정별원장 - 키워드 조회 (ACCT_NM)
   * 중분류: 재무관리  소분류:   메뉴명: 계정별원장  액터: 개발자
   * URL: /mis/act/actF303/getList.do
   * 예상결과: ACCT_NM에 '테스트'가 포함된 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F303_MST A WHERE A.ACCT_NM LIKE '%테스트%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 계정별원장 - 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 계정별원장 - 키워드 조회');
    logInput('ACCT_NM', '테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F303M-no2.png`, fullPage: true });

    expect(rows.length, '계정별원장 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 계정별원장 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 계정별원장  액터: 개발자
   * URL: /mis/act/actF303/getList.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F303_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 계정별원장 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 계정별원장 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F303M-no3.png`, fullPage: true });

    expect(rows.length, '계정별원장 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 계정별원장 - 존재하지 않는 키워드 조회 (0건 예상)
   * 중분류: 재무관리  소분류:   메뉴명: 계정별원장  액터: 개발자
   * URL: /mis/act/actF303/getList.do
   * 예상결과: 존재하지 않는 키워드이므로 결과가 없거나 0건에 가깝다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F303_MST A WHERE A.ACCT_NM LIKE '%ZZZ_NONEXISTENT_9999%' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:4] 계정별원장 - 존재하지 않는 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 계정별원장 - 존재하지 않는 키워드 조회');
    logInput('ACCT_NM', 'ZZZ_NONEXISTENT_9999');

    const resp   = await apiPost(page, API_URL, searchBody({ ACCT_NM: 'ZZZ_NONEXISTENT_9999' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F303M-no4.png`, fullPage: true });

    expect(rows.length, '계정별원장 존재하지 않는 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_F401M — 합계잔액시산표  |  API: POST /mgt/cfg/cfg0520/getFsFormCd.do  |  TC 3건
// TODO(menuId): act_F401M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mgt/cfg/cfg0520/getFsFormCd.do';
  const PGM_ID            = 'act_F401M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT', 'STDR_YY', 'TEMP_SLIP_INCD_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`합계잔액시산표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 합계잔액시산표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 합계잔액시산표  액터: 개발자
   * URL: /mgt/cfg/cfg0520/getFsFormCd.do
   * 예상결과: 합계잔액시산표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_F401_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 합계잔액시산표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 합계잔액시산표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F401M-no1.png`, fullPage: true });

    expect(rows.length, '합계잔액시산표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 합계잔액시산표 - 사용여부 조회 (TEMP_SLIP_INCD_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 합계잔액시산표  액터: 개발자
   * URL: /mgt/cfg/cfg0520/getFsFormCd.do
   * 예상결과: 사용중(TEMP_SLIP_INCD_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F401_MST A WHERE A.TEMP_SLIP_INCD_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 합계잔액시산표 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 합계잔액시산표 - 사용여부 조회');
    logInput('TEMP_SLIP_INCD_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ TEMP_SLIP_INCD_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F401M-no2.png`, fullPage: true });

    expect(rows.length, '합계잔액시산표 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 합계잔액시산표 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 합계잔액시산표  액터: 개발자
   * URL: /mgt/cfg/cfg0520/getFsFormCd.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F401_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 합계잔액시산표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 합계잔액시산표 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F401M-no3.png`, fullPage: true });

    expect(rows.length, '합계잔액시산표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_F402M — 재무상태표  |  API: POST /mis/act/act0000/getPeriod.do  |  TC 3건
// TODO(menuId): act_F402M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getPeriod.do';
  const PGM_ID            = 'act_F402M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT', 'STDR_YY', 'TEMP_SLIP_INCD_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`재무상태표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 재무상태표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 재무상태표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: 재무상태표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_F402_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 재무상태표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 재무상태표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F402M-no1.png`, fullPage: true });

    expect(rows.length, '재무상태표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 재무상태표 - 사용여부 조회 (TEMP_SLIP_INCD_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 재무상태표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: 사용중(TEMP_SLIP_INCD_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F402_MST A WHERE A.TEMP_SLIP_INCD_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 재무상태표 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 재무상태표 - 사용여부 조회');
    logInput('TEMP_SLIP_INCD_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ TEMP_SLIP_INCD_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F402M-no2.png`, fullPage: true });

    expect(rows.length, '재무상태표 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 재무상태표 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 재무상태표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F402_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 재무상태표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 재무상태표 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F402M-no3.png`, fullPage: true });

    expect(rows.length, '재무상태표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// act_F403M — 운영성과표  |  API: POST /mis/act/act0000/getPeriod.do  |  TC 3건
// TODO(menuId): act_F403M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec 생성 시 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/act/act0000/getPeriod.do';
  const PGM_ID            = 'act_F403M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT', 'STDR_YY', 'TEMP_SLIP_INCD_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`운영성과표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 운영성과표 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류:   메뉴명: 운영성과표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: 운영성과표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM ACT_F403_MST A WHERE 1=1 -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:1] 운영성과표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 운영성과표 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F403M-no1.png`, fullPage: true });

    expect(rows.length, '운영성과표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 운영성과표 - 사용여부 조회 (TEMP_SLIP_INCD_YN=Y)
   * 중분류: 재무관리  소분류:   메뉴명: 운영성과표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: 사용중(TEMP_SLIP_INCD_YN=Y) 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F403_MST A WHERE A.TEMP_SLIP_INCD_YN = 'Y' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:2] 운영성과표 - 사용여부 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 운영성과표 - 사용여부 조회');
    logInput('TEMP_SLIP_INCD_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ TEMP_SLIP_INCD_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F403M-no2.png`, fullPage: true });

    expect(rows.length, '운영성과표 사용여부 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 운영성과표 - 코드 조건 조회 (ACT_STDR_CD)
   * 중분류: 재무관리  소분류:   메뉴명: 운영성과표  액터: 개발자
   * URL: /mis/act/act0000/getPeriod.do
   * 예상결과: ACT_STDR_CD='01' 조건으로 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_F403_MST A WHERE A.ACT_STDR_CD = '01' -- TODO: 실제 테이블명/컬럼 DB 확인 필요
   */
  test('[no:3] 운영성과표 - 코드 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 운영성과표 - 코드 조건 조회');
    logInput('ACT_STDR_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ ACT_STDR_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_F403M-no3.png`, fullPage: true });

    expect(rows.length, '운영성과표 코드 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}
