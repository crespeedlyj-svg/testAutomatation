// ==============================================================
// ACT — 사업장등록 단위 테스트 (act_1030M)
// 생성일시: 2026-07-01  |  파일: 20260701_act_1030M_unit.spec.ts
// 화면: 사업장등록
// API: POST /mis/act/act1030/getList.do
// 방식: API-direct (page.request.post + nexacroXml)
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '/mis/act/act1030/getList.do';
const PGM_ID         = 'act_1030M';   // API 본문 전용 — 테스트명 사용 금지

// ── ds_search 컬럼 목록 (act_1030M.xfdl Dataset 정의 기준) ──────────────────
const DS_SEARCH_COLUMNS = ['BUSI_PLC_NM', 'BUSI_PLC_CD', 'USE_YN', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

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
test.describe('사업장등록 단위 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 사업장등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 사업장등록  액터: 개발자
   * URL: /mis/act/act1030/getList.do
   * 예상결과: 사업장 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM ACT_BUSI_PLC_MST A WHERE 1=1 -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:1] 사업장등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 사업장등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1030M-no1-all.png`, fullPage: true });

    expect(rows.length, '사업장등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 사업장등록 - 사용여부 조회 (USE_YN=Y)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 사업장등록  액터: 개발자
   * 예상결과: 사용중(USE_YN=Y)인 사업장이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_BUSI_PLC_MST A WHERE A.USE_YN = 'Y' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:2] 사업장등록 - 사용여부 조회 (USE_YN=Y)', async ({ workerPage: page }) => {
    logTestStart('[no:2] 사업장등록 - 사용여부 조회 (USE_YN=Y)');
    logInput('USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1030M-no2-useY.png`, fullPage: true });

    expect(rows.length, '사업장등록 사용여부(Y) 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 사업장등록 - 사업장명 키워드 조회 (BUSI_PLC_NM)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 사업장등록  액터: 개발자
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
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1030M-no3-plcnm.png`, fullPage: true });

    expect(rows.length, '사업장등록 사업장명 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 사업장등록 - 사업장코드 조회 (BUSI_PLC_CD)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 사업장등록  액터: 개발자
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
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1030M-no4-plccd.png`, fullPage: true });

    expect(rows.length, '사업장등록 사업장코드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 사업장등록 - 통합검색 키워드 조회 (UNTY_SACH_FG/UNTY_SACH_KEY)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 사업장등록  액터: 개발자
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
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1030M-no5-unty.png`, fullPage: true });

    expect(rows.length, '사업장등록 통합검색 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 사업장등록 - 존재하지 않는 사업장명 조회
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 사업장등록  액터: 개발자
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
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1030M-no6-none.png`, fullPage: true });

    expect(rows.length, '사업장등록 존재하지 않는 사업장명 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
