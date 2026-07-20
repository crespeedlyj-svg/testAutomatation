// ==============================================================
// PUR — 직접구매지급신청 단위 테스트 (pur_0910M)
// 생성일시: 2026-06-23  |  파일: 20260623_pur0910M_unit.spec.ts
// 화면: 직접구매신청현황 (직접구매신청 목록)
// API: POST /mis/pur/pur0910/getList.do
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';

// ── ds_search 컬럼 목록 (pur_0910M.xfdl Dataset 정의 기준) ──────────────────
const DS_SEARCH_COLUMNS = [
  'WRK_AREA',
  'RQST_SDT',
  'RQST_EDT',
  'APV_STAT_CD',
  'RQST_EMP_NM',
  'RQST_EMP_NO',
  'RQST_DEPT_NM',
  'RQST_DEPT_CD',
  'SCH_SRCH_CLS',
  'SCH_SRCH_KEY',
  'ROLE_YN',
  'DEPT_CHIF_YN',
  'BOOK_CLS',
  'RQST_CLS',
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

async function apiPost(page: Page, endpoint: string, xml: string) {
  return page.request.post(endpoint, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    data: xml,
  }) as unknown as import('@playwright/test').Response;
}

// ============================================================================
// [pur_0910M] 단위 테스트 — 직접구매지급신청 목록 조회
// ============================================================================
test.describe('직접구매지급신청 단위 테스트 (pur_0910M)', () => {

  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  // --------------------------------------------------------------------------
  // [no:1] 전체 조회 — 파라미터 없이 전체 목록 반환 여부 확인
  // --------------------------------------------------------------------------
  test('[no:1] [단위] [SELECT] 직접구매지급신청 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] [단위] 직접구매지급신청 - 전체 조회');
    logInput('endpoint', `${BASE_URL}/mis/pur/pur0910/getList.do`);
    logInput('조건', '(빈값 - 전체)');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: DS_SEARCH_COLUMNS,
        rows: [{}],
      }], 'pur_0910M')
    );

    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수', rows.length);
    expect(rows.length).toBeGreaterThanOrEqual(0);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-no1-all.png`, fullPage: true });
  });

  // --------------------------------------------------------------------------
  // [no:2] 결재상태 필터 — APV_STAT_CD = 000-010-090 (진행중 전체)
  //   SQL: APV_STAT_CD NOT IN ('000-010-040') — 반려 제외한 진행중 건
  // --------------------------------------------------------------------------
  test('[no:2] [단위] [SELECT] 직접구매지급신청 - 결재상태 진행중 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] [단위] 직접구매지급신청 - 결재상태 진행중');
    logInput('APV_STAT_CD', '000-010-090 (진행중 전체)');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: DS_SEARCH_COLUMNS,
        rows: [{ APV_STAT_CD: '000-010-090' }],
      }], 'pur_0910M')
    );

    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수 (진행중)', rows.length);
    expect(rows.length).toBeGreaterThanOrEqual(0);

    // 반환된 행에 반려(000-010-040) 상태가 없어야 함
    for (const row of rows) {
      const apvStat = row['APV_STAT_CD'] ?? '';
      expect(
        apvStat,
        `반려(000-010-040) 상태 행이 포함됨: CHEAP_RQST_NO=${row['CHEAP_RQST_NO']}`
      ).not.toBe('000-010-040');
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-no2-apv090.png`, fullPage: true });
  });

  // --------------------------------------------------------------------------
  // [no:3] 신청일자 범위 조회 — RQST_SDT / RQST_EDT 필터
  // --------------------------------------------------------------------------
  test('[no:3] [단위] [SELECT] 직접구매지급신청 - 신청일자 범위 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] [단위] 직접구매지급신청 - 신청일자 범위');
    const SDT = '20240101';
    const EDT = '20261231';
    logInput('RQST_SDT', SDT);
    logInput('RQST_EDT', EDT);

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: DS_SEARCH_COLUMNS,
        rows: [{ RQST_SDT: SDT, RQST_EDT: EDT }],
      }], 'pur_0910M')
    );

    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수 (일자범위)', rows.length);
    expect(rows.length).toBeGreaterThanOrEqual(0);

    // 반환된 행의 신청일자가 범위 내에 있는지 확인
    for (const row of rows) {
      const dt = (row['RQST_DT'] ?? '').replace(/-/g, '');
      if (dt) {
        expect(
          dt >= SDT && dt <= EDT,
          `신청일자(${dt})가 범위(${SDT}~${EDT}) 밖`
        ).toBe(true);
      }
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-no3-date.png`, fullPage: true });
  });

  // --------------------------------------------------------------------------
  // [no:4] 신청명 키워드 검색 — SCH_SRCH_CLS=RQST_SBJ
  // --------------------------------------------------------------------------
  test('[no:4] [단위] [SELECT] 직접구매지급신청 - 신청명 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:4] [단위] 직접구매지급신청 - 신청명 키워드');
    const KEYWORD = '구매';
    logInput('SCH_SRCH_CLS', 'RQST_SBJ (신청명)');
    logInput('SCH_SRCH_KEY', KEYWORD);

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: DS_SEARCH_COLUMNS,
        rows: [{ SCH_SRCH_CLS: 'RQST_SBJ', SCH_SRCH_KEY: KEYWORD }],
      }], 'pur_0910M')
    );

    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(result.body, 'ds_list');
    logResult(`조회 건수 (신청명 ="${KEYWORD}")`, rows.length);
    expect(rows.length).toBeGreaterThanOrEqual(0);

    // 결과가 있으면 신청명에 키워드 포함 여부 확인
    for (const row of rows) {
      const sbj = (row['RQST_SBJ'] ?? '').toUpperCase();
      expect(
        sbj.includes(KEYWORD.toUpperCase()),
        `신청명("${row['RQST_SBJ']}")에 키워드("${KEYWORD}") 미포함`
      ).toBe(true);
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-no4-keyword.png`, fullPage: true });
  });

  // --------------------------------------------------------------------------
  // [no:5] 신청번호 키워드 검색 — SCH_SRCH_CLS=RQST_NO
  // --------------------------------------------------------------------------
  test('[no:5] [단위] [SELECT] 직접구매지급신청 - 신청번호 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] [단위] 직접구매지급신청 - 신청번호 키워드');
    const KEYWORD = '2024';
    logInput('SCH_SRCH_CLS', 'RQST_NO (신청번호)');
    logInput('SCH_SRCH_KEY', KEYWORD);

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: DS_SEARCH_COLUMNS,
        rows: [{ SCH_SRCH_CLS: 'RQST_NO', SCH_SRCH_KEY: KEYWORD }],
      }], 'pur_0910M')
    );

    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(result.body, 'ds_list');
    logResult(`조회 건수 (신청번호 ="${KEYWORD}")`, rows.length);
    expect(rows.length).toBeGreaterThanOrEqual(0);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-no5-reqno.png`, fullPage: true });
  });

});
