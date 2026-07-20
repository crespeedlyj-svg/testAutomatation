// ==============================================================
// PUR — 구매요구신청(내자) 단위 테스트 (pur_0110M)
// 생성일시: 2026-07-01  |  파일: 20260701_pur_0110M_unit.spec.ts
// 화면: 구매요구신청(내자)
// API: POST /mis/pur/pur0110/getList.do
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '/mis/pur/pur0110/getList.do';
const PGM_ID         = 'pur_0110M';   // API 본문 전용 — 테스트명 사용 금지

// ── ds_search 컬럼 목록 (pur_0110M scenarios.dsSearchCols) ──────────────────
const DS_SEARCH_COLUMNS = [
  'CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'RQST_STAT',
  'PUR_STEP', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD',
  'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP',
  'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS',
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

function searchBody(params: Record<string, string>): string {
  const allParams = Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']));
  return nexacroXml(
    [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS, rows: [allParams] }],
    PGM_ID
  );
}

// ============================================================================
// [pur_0110M] 단위 테스트 — 구매요구신청(내자) 목록 조회
// ============================================================================
test.describe('구매요구신청(내자) 단위 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 구매요구신청(내자) - 전체 조회 (내자 기본 조건)
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 구매요구신청(내자)  액터: 개발자
   * 예상결과: 구매요구신청 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 구매요구 테이블) WHERE FRGN_CLS = '604-001'
   */
  test('[no:1] 구매요구신청(내자) - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 구매요구신청(내자) - 전체 조회');
    logInput('FRGN_CLS', '604-001 (내자)');
    logInput('PUR_CLS', 'A');

    const resp   = await apiPost(page, API_URL, searchBody({ FRGN_CLS: '604-001', PUR_CLS: 'A' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/구매요구신청내자-no1-all.png`, fullPage: true });

    expect(rows.length, '구매요구신청(내자) 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 구매요구신청(내자) - 기간 조회 (RQST_SDT ~ RQST_EDT)
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 구매요구신청(내자)  액터: 개발자
   * 예상결과: 요구일자 범위 조회 결과가 반환된다. (총 N건 — RQST_DT >= 20240101 AND <= 20261231)
   * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RQST_DT >= '20240101' AND RQST_DT <= '20261231'
   */
  test('[no:2] 구매요구신청(내자) - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 구매요구신청(내자) - 기간 조회');
    logInput('기간', '20240101 ~ 20261231');

    const resp   = await apiPost(page, API_URL, searchBody({
      FRGN_CLS: '604-001', PUR_CLS: 'A', RQST_SDT: '20240101', RQST_EDT: '20261231',
    }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/구매요구신청내자-no2-date.png`, fullPage: true });

    expect(rows.length, '구매요구신청(내자) 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:3] [단위] [SELECT] 구매요구신청(내자) - 역방향 날짜 (시작일 > 종료일 → 0건)
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 구매요구신청(내자)  액터: 개발자
   * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
   * DB 확인: -- 역방향 날짜: 0건 (RQST_DT >= '20261231' AND RQST_DT <= '20240101')
   */
  test('[no:3] 구매요구신청(내자) - 역방향 날짜 (0건)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 구매요구신청(내자) - 역방향 날짜');
    logInput('기간(역방향)', '20261231 ~ 20240101');

    const resp   = await apiPost(page, API_URL, searchBody({
      FRGN_CLS: '604-001', PUR_CLS: 'A', RQST_SDT: '20261231', RQST_EDT: '20240101',
    }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);

    expect(rows.length, '구매요구신청(내자) 역방향 날짜 0건 기대').toBe(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] [단위] [SELECT] 구매요구신청(내자) - 결재상태 필터 (RQST_STAT=000-010-040 결재완료)
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 구매요구신청(내자)  액터: 개발자
   * 예상결과: 결재상태 코드 일치 건이 반환된다. (총 N건 — RQST_STAT = '000-010-040')
   * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RQST_STAT = '000-010-040'
   */
  test('[no:4] 구매요구신청(내자) - 결재상태 필터 (결재완료)', async ({ workerPage: page }) => {
    logTestStart('[no:4] 구매요구신청(내자) - 결재상태 필터');
    logInput('RQST_STAT', '000-010-040 (결재완료)');

    const resp   = await apiPost(page, API_URL, searchBody({
      FRGN_CLS: '604-001', PUR_CLS: 'A', RQST_STAT: '000-010-040',
    }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/구매요구신청내자-no4-stat.png`, fullPage: true });

    expect(rows.length, '구매요구신청(내자) 결재상태 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:5] [단위] [SELECT] 구매요구신청(내자) - 키워드 검색 (SRCH_CLS=RQST_SBJ + SRCH_KEY=구매)
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 구매요구신청(내자)  액터: 개발자
   * 예상결과: 요구명 LIKE 검색 결과가 반환된다. (총 N건 — RQST_SBJ LIKE '%구매%')
   * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE UPPER(RQST_SBJ) LIKE '%구매%'
   */
  test('[no:5] 구매요구신청(내자) - 키워드 검색 (요구명=구매)', async ({ workerPage: page }) => {
    logTestStart('[no:5] 구매요구신청(내자) - 키워드 검색');
    logInput('SRCH_CLS', 'RQST_SBJ');
    logInput('SRCH_KEY', '구매');

    const resp   = await apiPost(page, API_URL, searchBody({
      FRGN_CLS: '604-001', PUR_CLS: 'A', SRCH_CLS: 'RQST_SBJ', SRCH_KEY: '구매',
    }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/구매요구신청내자-no5-keyword.png`, fullPage: true });

    expect(rows.length, '구매요구신청(내자) 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:6] [단위] [SELECT] 구매요구신청(내자) - 권한 조건 조회 (ROLE_YN=Y 담당자 권한 전체)
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 구매요구신청(내자)  액터: 개발자
   * 예상결과: 담당자 권한 전체 조회 결과가 반환된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE FRGN_CLS = '604-001'
   */
  test('[no:6] 구매요구신청(내자) - 권한 조건 조회 (담당자 전체)', async ({ workerPage: page }) => {
    logTestStart('[no:6] 구매요구신청(내자) - 권한 조건 조회');
    logInput('ROLE_YN', 'Y (담당자 권한 전체)');

    const resp   = await apiPost(page, API_URL, searchBody({ FRGN_CLS: '604-001', PUR_CLS: 'A', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/구매요구신청내자-no6-role.png`, fullPage: true });

    expect(rows.length, '구매요구신청(내자) 권한 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
