// ==============================================================
// PAY — 급여원장 단위 테스트 (pay_1010M)
// 생성일시: 2026-07-01  |  파일: 20260701_pay_1010M_unit.spec.ts
// 화면: 급여원장
// API: POST /mis/pay/pay1010/getList.do
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '/mis/pay/pay1010/getList.do';
const PGM_ID         = 'pay_1010M';

// ── ds_search 컬럼 목록 (pay_1010M dsSearchCols 기준) ───────────────────────
const DS_SEARCH_COLUMNS = [
  'SCH_EMP_NM',
  'SCH_EMP_NO',
  'SCH_WORK_DGCNT',
  'SCH_HLDF_FG_CD',
  'SCH_EMPO_STLF_CD',
  'SCH_JSFC_CD',
  'SCH_GRD_CD',
  'SCH_REG_YN',
  'SCH_DEPT_CD',
  'SCH_DEPT_NM',
  'SCH_STDR_YM',
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
test.describe('급여원장 단위 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 급여원장 - 전체 조회 (기준년월만)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * URL: /mis/pay/pay1010/getList.do
   * 예상결과: 해당 기준년월의 급여원장 사원 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_LEDGER_MST WHERE STDR_YM = '202406'
   */
  test('[no:1] 급여원장 - 전체 조회 (기준년월만)', async ({ workerPage: page }) => {
    logTestStart('[no:1] 급여원장 - 전체 조회 (기준년월만)');
    logInput('SCH_STDR_YM', '202406');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_YM: '202406' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/급여원장-no1-all.png`, fullPage: true });

    expect(rows.length, '급여원장 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 급여원장 - 재직구분 조건 조회 (SCH_HLDF_FG_CD)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * 예상결과: 재직구분 조건에 해당하는 사원 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_LEDGER_MST WHERE STDR_YM = '202406' AND HLDF_FG_CD = '1'
   */
  test('[no:2] 급여원장 - 재직구분 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 급여원장 - 재직구분 조건 조회');
    logInput('SCH_STDR_YM', '202406');
    logInput('SCH_HLDF_FG_CD', '1');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_YM: '202406', SCH_HLDF_FG_CD: '1' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/급여원장-no2-hldf.png`, fullPage: true });

    expect(rows.length, '급여원장 재직구분 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 급여원장 - 존재하지 않는 기준년월(999912) 조회 (0건 기대)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * 예상결과: 존재하지 않는 기준년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_LEDGER_MST WHERE STDR_YM = '999912'
   */
  test('[no:3] 급여원장 - 존재하지 않는 기준년월(999912) 조회 (0건)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 급여원장 - 존재하지 않는 기준년월 조회');
    logInput('SCH_STDR_YM', '999912');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_YM: '999912' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);

    expect(rows.length, '급여원장 존재하지 않는 기준년월 0건 기대').toBe(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] [단위] [SELECT] 급여원장 - 고용형태 코드 필터 조회 (SCH_EMPO_STLF_CD)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * 예상결과: 고용형태 코드에 해당하는 사원 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_LEDGER_MST WHERE STDR_YM = '202406' AND EMPO_STLF_CD = '01'
   */
  test('[no:4] 급여원장 - 고용형태 코드 필터 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] 급여원장 - 고용형태 코드 필터 조회');
    logInput('SCH_STDR_YM', '202406');
    logInput('SCH_EMPO_STLF_CD', '01');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_YM: '202406', SCH_EMPO_STLF_CD: '01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/급여원장-no4-empo.png`, fullPage: true });

    expect(rows.length, '급여원장 고용형태 코드 필터 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 급여원장 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * 예상결과: 성명 키워드가 포함된 사원 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_LEDGER_MST WHERE STDR_YM = '202406' AND EMP_NM LIKE '%김%'
   */
  test('[no:5] 급여원장 - 성명 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 급여원장 - 성명 키워드 검색');
    logInput('SCH_STDR_YM', '202406');
    logInput('SCH_EMP_NM', '김');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_YM: '202406', SCH_EMP_NM: '김' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/급여원장-no5-empnm.png`, fullPage: true });

    expect(rows.length, '급여원장 성명 키워드 검색 1건 이상').toBeGreaterThan(0);
    // 결과 행 성명에 키워드 포함 여부 확인
    rows.forEach((r, i) =>
      expect((r.EMP_NM ?? '').includes('김'), `[행${i}] 성명("${r.EMP_NM}")에 키워드("김") 미포함`).toBe(true)
    );
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 급여원장 - 원장등록 여부 조건 조회 (SCH_REG_YN)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * 예상결과: 원장등록 여부 조건에 해당하는 사원 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_LEDGER_MST WHERE STDR_YM = '202406' AND REG_YN = 'Y'
   */
  test('[no:6] 급여원장 - 원장등록 여부 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] 급여원장 - 원장등록 여부 조건 조회');
    logInput('SCH_STDR_YM', '202406');
    logInput('SCH_REG_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_YM: '202406', SCH_REG_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/급여원장-no6-regyn.png`, fullPage: true });

    expect(rows.length, '급여원장 원장등록 여부 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

});
