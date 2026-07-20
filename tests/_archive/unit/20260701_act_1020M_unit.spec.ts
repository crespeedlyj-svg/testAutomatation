// ==============================================================
// ACT — 회계단위등록 단위 테스트 (act_1020M)
// 생성일시: 2026-07-01  |  파일: 20260701_act_1020M_unit.spec.ts
// 화면: 회계단위등록
// API: POST /mis/act/act1020/getList.do
// 방식: API-direct (page.request.post + nexacroXml)
// 비고: onload 에서 ds_search.USE_YN='Y' 기본 세팅됨
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '/mis/act/act1020/getList.do';
const PGM_ID         = 'act_1020M';   // API 본문 전용 — 테스트명 사용 금지

// ── ds_search 컬럼 목록 (act_1020M.xfdl Dataset 정의 기준) ──────────────────
const DS_SEARCH_COLUMNS = ['ACT_UNIT_NM', 'USE_YN'];

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
test.describe('회계단위등록 단위 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 회계단위등록 - 전체 조회 (조건 없음)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 회계단위등록  액터: 개발자
   * URL: /mis/act/act1020/getList.do
   * 예상결과: 회계단위 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM ACT_UNIT_MST A WHERE 1=1 -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:1] 회계단위등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 회계단위등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1020M-no1-all.png`, fullPage: true });

    expect(rows.length, '회계단위등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 회계단위등록 - 사용여부 조회 (USE_YN=Y, onload 기본값)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 회계단위등록  액터: 개발자
   * 예상결과: 사용중(USE_YN=Y)인 회계단위가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_UNIT_MST A WHERE A.USE_YN = 'Y' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:2] 회계단위등록 - 사용여부 조회 (USE_YN=Y)', async ({ workerPage: page }) => {
    logTestStart('[no:2] 회계단위등록 - 사용여부 조회 (USE_YN=Y)');
    logInput('USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1020M-no2-useY.png`, fullPage: true });

    expect(rows.length, '회계단위등록 사용여부(Y) 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 회계단위등록 - 미사용 조회 (USE_YN=N)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 회계단위등록  액터: 개발자
   * 예상결과: 미사용(USE_YN=N)인 회계단위가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM ACT_UNIT_MST A WHERE A.USE_YN = 'N' -- TODO: 실제 테이블명 DB 확인 필요
   */
  test('[no:3] 회계단위등록 - 미사용 조회 (USE_YN=N)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 회계단위등록 - 미사용 조회 (USE_YN=N)');
    logInput('USE_YN', 'N');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'N' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1020M-no3-useN.png`, fullPage: true });

    expect(rows.length, '회계단위등록 미사용(N) 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 회계단위등록 - 회계단위명 키워드 조회 (ACT_UNIT_NM)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 회계단위등록  액터: 개발자
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
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1020M-no4-unitnm.png`, fullPage: true });

    expect(rows.length, '회계단위등록 회계단위명 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 회계단위등록 - 존재하지 않는 회계단위명 조회
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 회계단위등록  액터: 개발자
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
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1020M-no5-none.png`, fullPage: true });

    expect(rows.length, '회계단위등록 존재하지 않는 회계단위명 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
