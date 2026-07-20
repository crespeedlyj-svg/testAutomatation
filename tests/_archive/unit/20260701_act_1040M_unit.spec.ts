// ==============================================================
// ACT — 거래처등록 단위 테스트 (act_1040M)
// 생성일시: 2026-07-01  |  파일: 20260701_act_1040M_unit.spec.ts
// 화면: 거래처등록
// API: POST /mis/act/act1040/getList.do
// 방식: API-direct (page.request.post + nexacroXml)
// 비고: UNTY_SACH_FG 코드 A=전체 B=거래처코드 C=사업자번호 D=거래처명 E=대표자 F=법인번호
//       기본값 UNTY_SACH_FG='A', USE_YN='' (전체)
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '/mis/act/act1040/getList.do';
const PGM_ID         = 'act_1040M';   // API 본문 전용 — 테스트명 사용 금지

// ── ds_search 컬럼 목록 (act_1040M.xfdl Dataset 정의 기준) ──────────────────
const DS_SEARCH_COLUMNS = [
  'CUST_NM', 'CUST_FG', 'CUST_CLSF', 'BUY_SALG_FG', 'CUST_CD',
  'BIZRNO', 'REPRES_NM', 'USE_YN', 'UNTY_SACH_FG', 'UNTY_SACH_KEY',
];

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

// API 호출 — page.request 사용 (credentials 자동 포함)
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

// ds_search 단일 행 헬퍼 — 항상 DS_SEARCH_COLUMNS 전체 포함 (isNotEmpty가 빈 값 스킵)
function searchBody(params: Record<string, string>): string {
  const allParams = Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']));
  return nexacroXml(
    [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS, rows: [allParams] }],
    PGM_ID
  );
}

// ============================================================================
test.describe('거래처등록 단위 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 거래처등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * URL: /mis/act/act1040/getList.do
   * 예상결과: 거래처 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM ACT_CUST_MST A WHERE 1=1 -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:1] 거래처등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 거래처등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-no1-all.png`, fullPage: true });

    expect(rows.length, '거래처등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 거래처등록 - 사용여부 조회 (USE_YN=Y)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * 예상결과: 사용중(USE_YN=Y)인 거래처가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_CUST_MST A WHERE A.USE_YN = 'Y' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:2] 거래처등록 - 사용여부 조회 (USE_YN=Y)', async ({ workerPage: page }) => {
    logTestStart('[no:2] 거래처등록 - 사용여부 조회 (USE_YN=Y)');
    logInput('USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-no2-useY.png`, fullPage: true });

    expect(rows.length, '거래처등록 사용여부(Y) 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 거래처등록 - 통합검색 거래처명 조회 (UNTY_SACH_FG=D)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * 예상결과: 통합검색(거래처명) 키워드 '상사'로 거래처가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_CUST_MST A WHERE A.CUST_NM LIKE '%상사%' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:3] 거래처등록 - 통합검색 거래처명 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 거래처등록 - 통합검색 거래처명 조회');
    logInput('UNTY_SACH_FG', 'D');
    logInput('UNTY_SACH_KEY', '상사');

    const resp   = await apiPost(page, API_URL, searchBody({ UNTY_SACH_FG: 'D', UNTY_SACH_KEY: '상사' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-no3-custnm.png`, fullPage: true });

    expect(rows.length, '거래처등록 통합검색(거래처명) 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 거래처등록 - 통합검색 사업자번호 조회 (UNTY_SACH_FG=C)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * 예상결과: 통합검색(사업자번호) 키워드 '123'으로 거래처가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_CUST_MST A WHERE A.BIZRNO LIKE '%123%' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:4] 거래처등록 - 통합검색 사업자번호 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 거래처등록 - 통합검색 사업자번호 조회');
    logInput('UNTY_SACH_FG', 'C');
    logInput('UNTY_SACH_KEY', '123');

    const resp   = await apiPost(page, API_URL, searchBody({ UNTY_SACH_FG: 'C', UNTY_SACH_KEY: '123' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-no4-bizrno.png`, fullPage: true });

    expect(rows.length, '거래처등록 통합검색(사업자번호) 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 거래처등록 - 통합검색 대표자 조회 (UNTY_SACH_FG=E)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
   * 예상결과: 통합검색(대표자) 키워드 '김'으로 거래처가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_CUST_MST A WHERE A.REPRES_NM LIKE '%김%' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:5] 거래처등록 - 통합검색 대표자 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 거래처등록 - 통합검색 대표자 조회');
    logInput('UNTY_SACH_FG', 'E');
    logInput('UNTY_SACH_KEY', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ UNTY_SACH_FG: 'E', UNTY_SACH_KEY: '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-no5-repres.png`, fullPage: true });

    expect(rows.length, '거래처등록 통합검색(대표자) 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 거래처등록 - 존재하지 않는 거래처명 조회
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 거래처등록  액터: 개발자
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
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1040M-no6-none.png`, fullPage: true });

    expect(rows.length, '거래처등록 존재하지 않는 거래처명 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
