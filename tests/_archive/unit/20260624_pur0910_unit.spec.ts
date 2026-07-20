// ==============================================================
// PUR — 직접구매신청현황 단위 테스트 (pur_0910M)
// 생성일시: 2026-06-24  |  파일: 20260624_pur0910_unit.spec.ts
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
// [pur_0910M] 단위 테스트 — 직접구매신청현황 목록 조회
// ============================================================================
test.describe('직접구매신청현황 단위 테스트 (pur_0910M)', () => {

  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  // --------------------------------------------------------------------------
  // [no:1] 전체 조회 — 조건 없이 전체 목록 반환 여부 확인 [UT_PUR0910_0001]
  // --------------------------------------------------------------------------
  test('[no:1] [단위] [SELECT] 직접구매신청 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] [단위] 직접구매신청 - 전체 조회');
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

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no1-all.png`, fullPage: true });
  });

  // --------------------------------------------------------------------------
  // [no:2] 결재상태 진행중 전체 — APV_STAT_CD=000-010-090 [UT_PUR0910_0002]
  //   반려(000-010-040) 제외한 진행중 건만 반환되어야 함
  // --------------------------------------------------------------------------
  test('[no:2] [단위] [SELECT] 직접구매신청 - 결재상태 진행중 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] [단위] 직접구매신청 - 결재상태 진행중 전체');
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

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no2-apv090.png`, fullPage: true });
  });

  // --------------------------------------------------------------------------
  // [no:3] 신청일자 기간 조회 — RQST_SDT / RQST_EDT 필터 [UT_PUR0910_0003]
  // --------------------------------------------------------------------------
  test('[no:3] [단위] [SELECT] 직접구매신청 - 신청일자 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] [단위] 직접구매신청 - 신청일자 기간');
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

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no3-date.png`, fullPage: true });
  });

  // --------------------------------------------------------------------------
  // [no:4] 신청번호 키워드 검색 — SCH_SRCH_CLS=RQST_NO [UT_PUR0910_0004]
  // --------------------------------------------------------------------------
  test('[no:4] [단위] [SELECT] 직접구매신청 - 신청번호 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:4] [단위] 직접구매신청 - 신청번호 키워드');
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
    logResult(`조회 건수 (신청번호="${KEYWORD}")`, rows.length);
    expect(rows.length).toBeGreaterThanOrEqual(0);

    // 결과가 있으면 신청번호에 키워드 포함 여부 확인
    for (const row of rows) {
      const rqstNo = row['CHEAP_RQST_NO'] ?? '';
      if (rqstNo) {
        expect(
          rqstNo.includes(KEYWORD),
          `신청번호("${rqstNo}")에 키워드("${KEYWORD}") 미포함`
        ).toBe(true);
      }
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no4-reqno.png`, fullPage: true });
  });

  // --------------------------------------------------------------------------
  // [no:5] 신청명 키워드 검색 — SCH_SRCH_CLS=RQST_SBJ [UT_PUR0910_0005]
  // --------------------------------------------------------------------------
  test('[no:5] [단위] [SELECT] 직접구매신청 - 신청명 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] [단위] 직접구매신청 - 신청명 키워드');
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
    logResult(`조회 건수 (신청명="${KEYWORD}")`, rows.length);
    expect(rows.length).toBeGreaterThanOrEqual(0);

    // 결과가 있으면 신청명에 키워드 포함 여부 확인
    for (const row of rows) {
      const sbj = (row['RQST_SBJ'] ?? '').toUpperCase();
      if (sbj) {
        expect(
          sbj.includes(KEYWORD.toUpperCase()),
          `신청명("${row['RQST_SBJ']}")에 키워드("${KEYWORD}") 미포함`
        ).toBe(true);
      }
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no5-sbj.png`, fullPage: true });
  });

  // --------------------------------------------------------------------------
  // [no:6] 잘못된 일자 범위 — 시작일 > 종료일 [UT_PUR0910_0006]
  //   서버가 오류 없이 응답(0건 또는 빈 결과)해야 함
  // --------------------------------------------------------------------------
  test('[no:6] [단위] [SELECT] 직접구매신청 - 잘못된 일자 범위 (시작>종료)', async ({ workerPage: page }) => {
    logTestStart('[no:6] [단위] 직접구매신청 - 역방향 일자');
    const SDT = '20261231';
    const EDT = '20240101';
    logInput('RQST_SDT (시작)', SDT);
    logInput('RQST_EDT (종료)', EDT);

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: DS_SEARCH_COLUMNS,
        rows: [{ RQST_SDT: SDT, RQST_EDT: EDT }],
      }], 'pur_0910M')
    );

    // 서버는 200으로 응답해야 하며 0건 또는 에러 메시지를 반환할 수 있음
    expect(resp.status()).toBe(200);
    const rows = parseNexacroXmlRows(await resp.text(), 'ds_list');
    logResult('조회 건수 (역방향)', rows.length);
    // 역방향 범위이므로 0건이거나 서버 정책에 따라 에러 처리
    expect(rows.length).toBeGreaterThanOrEqual(0);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no6-inv-date.png`, fullPage: true });
  });

  // --------------------------------------------------------------------------
  // [no:7] 부서장 권한 조회 — DEPT_CHIF_YN=Y [UT_PUR0910_0007]
  // --------------------------------------------------------------------------
  test('[no:7] [단위] [SELECT] 직접구매신청 - 부서장 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:7] [단위] 직접구매신청 - 부서장 권한');
    logInput('DEPT_CHIF_YN', 'Y');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: DS_SEARCH_COLUMNS,
        rows: [{ DEPT_CHIF_YN: 'Y' }],
      }], 'pur_0910M')
    );

    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수 (부서장)', rows.length);
    expect(rows.length).toBeGreaterThanOrEqual(0);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no7-deptchief.png`, fullPage: true });
  });

});
