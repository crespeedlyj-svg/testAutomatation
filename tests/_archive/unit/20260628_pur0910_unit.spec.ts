// ==============================================================
// PUR — 직접구매지급신청 단위 테스트
// 생성일시: 2026-06-28  |  파일: 20260628_pur0910_unit.spec.ts
// 메뉴: 구매관리 > 구매요구 > 직접구매지급신청
// API: POST /mis/pur/pur0910/getList.do  (API-direct: nexacroXml + apiPost)
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
const API_URL        = '/mis/pur/pur0910/getList.do';

// API 본문 파라미터 전용 — describe/test 이름에는 절대 사용 금지
const PGM_ID = 'pur_0910M';

// ── ds_search 컬럼 목록 (01_scenarios.json dsSearchCols 기준, 15개) ─────────
const DS_SEARCH_COLUMNS = [
  'WORK_AREA',
  'RQST_SDT',
  'RQST_EDT',
  'APV_STAT_CD',
  'APNT_EMP_NM',
  'APNT_EMP_NO',
  'APNT_DEPT_NM',
  'APNT_DEPT_CD',
  'SCH_SRCH_CLS',
  'SCH_SRCH_KEY',
  'ROLE_YN',
  'DEPT_CHIF_YN',
  'BOOK_CLS',
  'RQST_CLS',
  'DICT_CLS',
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
  return page.request.post(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    data: xml,
  }) as unknown as import('@playwright/test').Response;
}

// ============================================================================
// 직접구매지급신청 단위 테스트
// ============================================================================
test.describe('직접구매지급신청 단위 테스트', () => {

  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  // --------------------------------------------------------------------------
  // [no:1] 전체 조회 (조건 없음)
  // 예상결과: 직접구매지급신청 목록이 조회된다. (총 N건 — DB COUNT(*) WHERE 1=1 실행 후 채우기)
  // DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
  // --------------------------------------------------------------------------
  test('[no:1] 직접구매지급신청 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 직접구매지급신청 - 전체 조회');
    logInput('endpoint', `${BASE_URL}${API_URL}`);
    logInput('조건', '(빈값 - 전체)');

    const resp = await apiPost(
      page,
      API_URL,
      nexacroXml([{
        id: 'ds_search',
        columns: DS_SEARCH_COLUMNS,
        rows: [{}],
      }], PGM_ID)
    );

    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수', rows.length);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no1-all.png`, fullPage: true });

    // 직접구매지급신청 목록이 조회된다.
    expect(rows.length, '전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  // --------------------------------------------------------------------------
  // [no:2] 기간 조회 (RQST_SDT ~ RQST_EDT)
  // 예상결과: 직접구매지급신청 신청일자 범위 조회 결과가 반환된다. (총 N건)
  // DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE A.RQST_DT >= '20240101' AND A.RQST_DT <= '20261231'
  // --------------------------------------------------------------------------
  test('[no:2] 직접구매지급신청 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 직접구매지급신청 - 기간 조회');
    const SDT = '20240101';
    const EDT = '20261231';
    logInput('RQST_SDT', SDT);
    logInput('RQST_EDT', EDT);

    const resp = await apiPost(
      page,
      API_URL,
      nexacroXml([{
        id: 'ds_search',
        columns: DS_SEARCH_COLUMNS,
        rows: [{ RQST_SDT: SDT, RQST_EDT: EDT }],
      }], PGM_ID)
    );

    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수 (기간)', rows.length);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no2-date.png`, fullPage: true });

    // 신청일자 범위 조회 결과가 반환된다.
    expect(rows.length, '기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  // --------------------------------------------------------------------------
  // [no:3] 역방향 날짜 (시작일 > 종료일 → 0건)
  // 예상결과: 직접구매지급신청 역방향 날짜 조건 시 0건 반환. (총 0건)
  // DB 확인: -- 역방향 날짜: 0건 (RQST_DT >= '20261231' AND RQST_DT <= '20240101')
  // --------------------------------------------------------------------------
  test('[no:3] 직접구매지급신청 - 역방향 날짜 (시작>종료, 0건)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 직접구매지급신청 - 역방향 날짜');
    const SDT = '20261231';
    const EDT = '20240101';
    logInput('RQST_SDT (시작)', SDT);
    logInput('RQST_EDT (종료)', EDT);

    const resp = await apiPost(
      page,
      API_URL,
      nexacroXml([{
        id: 'ds_search',
        columns: DS_SEARCH_COLUMNS,
        rows: [{ RQST_SDT: SDT, RQST_EDT: EDT }],
      }], PGM_ID)
    );

    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수 (역방향)', rows.length);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no3-inv-date.png`, fullPage: true });

    // 역방향 날짜 조건 시 0건 반환.
    expect(rows.length, '역방향 날짜 0건').toBe(0);
    logResult('검증', 'PASS');
  });

  // --------------------------------------------------------------------------
  // [no:4] 결재상태 필터 (APV_STAT_CD=000-010-040)
  // 예상결과: 직접구매지급신청 결재상태 코드 일치 건이 반환된다. (총 N건)
  // DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE B.APV_STAT_CD = '000-010-040'
  // --------------------------------------------------------------------------
  test('[no:4] 직접구매지급신청 - 결재상태 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 직접구매지급신청 - 결재상태 필터');
    const APV = '000-010-040';
    logInput('APV_STAT_CD', APV);

    const resp = await apiPost(
      page,
      API_URL,
      nexacroXml([{
        id: 'ds_search',
        columns: DS_SEARCH_COLUMNS,
        rows: [{ APV_STAT_CD: APV }],
      }], PGM_ID)
    );

    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수 (결재상태)', rows.length);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no4-apvstat.png`, fullPage: true });

    // 결재상태 코드 일치 건이 반환된다.
    expect(rows.length, '결재상태 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  // --------------------------------------------------------------------------
  // [no:5] 키워드 검색 (SCH_SRCH_CLS=RQST_NO + SCH_SRCH_KEY=2024)
  // 예상결과: 직접구매지급신청 요구번호 LIKE 검색 결과가 반환된다. (총 N건)
  // DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE UPPER(A.CHEAP_RQST_NO) LIKE '%2024%'
  // --------------------------------------------------------------------------
  test('[no:5] 직접구매지급신청 - 키워드 검색 (요구번호)', async ({ workerPage: page }) => {
    logTestStart('[no:5] 직접구매지급신청 - 키워드 검색');
    const KEYWORD = '2024';
    logInput('SCH_SRCH_CLS', 'RQST_NO (요구번호)');
    logInput('SCH_SRCH_KEY', KEYWORD);

    const resp = await apiPost(
      page,
      API_URL,
      nexacroXml([{
        id: 'ds_search',
        columns: DS_SEARCH_COLUMNS,
        rows: [{ SCH_SRCH_CLS: 'RQST_NO', SCH_SRCH_KEY: KEYWORD }],
      }], PGM_ID)
    );

    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(result.body, 'ds_list');
    logResult(`조회 건수 (요구번호="${KEYWORD}")`, rows.length);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no5-keyword.png`, fullPage: true });

    // 요구번호 LIKE 검색 결과가 반환된다.
    expect(rows.length, '키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  // --------------------------------------------------------------------------
  // [no:6] 권한 필터 (ROLE_YN=Y, 담당자 권한 전체 조회)
  // 예상결과: 직접구매지급신청 담당자 권한 플래그 조회 결과가 반환된다. (총 N건)
  // DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1
  //          (ROLE_YN은 WHERE 절에 직접 반영되지 않으므로 전체 조회와 동일)
  // --------------------------------------------------------------------------
  test('[no:6] 직접구매지급신청 - 권한 필터 (담당자 권한)', async ({ workerPage: page }) => {
    logTestStart('[no:6] 직접구매지급신청 - 권한 필터');
    logInput('ROLE_YN', 'Y');

    const resp = await apiPost(
      page,
      API_URL,
      nexacroXml([{
        id: 'ds_search',
        columns: DS_SEARCH_COLUMNS,
        rows: [{ ROLE_YN: 'Y' }],
      }], PGM_ID)
    );

    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수 (권한)', rows.length);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no6-role.png`, fullPage: true });

    // 담당자 권한 플래그 조회 결과가 반환된다.
    expect(rows.length, '권한 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
