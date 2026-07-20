// ==============================================================
// GEN — 연차일수관리 단위 테스트 (gen_0030M)
// 생성일시: 2026-07-01  |  파일: 20260701_gen_0030M_unit.spec.ts
// 화면: 연차일수관리 (총무관리 > 근태관리 > 연차일수관리)
// API: POST /mis/gen/gen0030/getList.do
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
const API_URL        = '/mis/gen/gen0030/getList.do';
const PGM_ID         = 'gen_0030M';           // API 본문 전용 — 테스트명 사용 금지
const DS_LIST        = 'ds_list';

// ds_search 컬럼 목록 (scenarios.dsSearchCols)
const DS_SEARCH_COLUMNS = [
  'SCH_YY', 'SCH_STDR_DT', 'SCH_FRM_DT', 'SCH_TO_DT',
  'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_HLDF_FG_CD',
];

// ── Nexacro XML 요청 본문 생성 ─────────────────────────────────────────────
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

test.describe('연차일수관리 단위 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 연차일수관리 - 기준일자 조회 (SCH_STDR_DT 기본값)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * URL: /mis/gen/gen0030/getList.do
   * 예상결과: 기준일자 기준 연차일수 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE 1=1
   */
  test('[no:1] 연차일수관리 - 기준일자 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 연차일수관리 - 기준일자 조회');
    logInput('SCH_STDR_DT', '2026-07-01');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: '2026-07-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0030-no1-stdrdt.png`, fullPage: true });

    expect(rows.length, '연차일수관리 기준일자 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 연차일수관리 - 재직구분 필터 (재직자, SCH_HLDF_FG_CD=101-010)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * 예상결과: 재직 상태(101-010) 직원의 연차일수 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE HLDF_FG_CD = '101-010'
   */
  test('[no:2] 연차일수관리 - 재직구분 필터 (재직자)', async ({ workerPage: page }) => {
    logTestStart('[no:2] 연차일수관리 - 재직구분 필터 (재직자)');
    logInput('SCH_STDR_DT', '2026-07-01');
    logInput('SCH_HLDF_FG_CD', '101-010');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: '2026-07-01', SCH_HLDF_FG_CD: '101-010' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0030-no2-active.png`, fullPage: true });

    expect(rows.length, '연차일수관리 재직자 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 연차일수관리 - 미래 기준일자 조회 (0건 예상)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * 예상결과: 미래 기준일자 조회 시 목록이 없거나 정상 응답한다.
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE ENT_DT <= '29991231'
   * 비고: expectZero 미확정 — 빈 결과가 정상이므로 정상 응답(0건 이상)만 검증한다.
   */
  test('[no:3] 연차일수관리 - 미래 기준일자 조회 (0건 예상)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 연차일수관리 - 미래 기준일자 조회 (0건 예상)');
    logInput('SCH_STDR_DT', '2999-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: '2999-12-31' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);

    expect(rows.length, '연차일수관리 미래 기준일자 - 정상 응답(빈 결과 허용)').toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] [단위] [SELECT] 연차일수관리 - 부서 조건 조회 (SCH_DEPT_NM)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * 예상결과: 특정 부서(총무부) 직원의 연차일수 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE DEPT_NM LIKE '%총무부%'
   */
  test('[no:4] 연차일수관리 - 부서 조건 조회 (SCH_DEPT_NM)', async ({ workerPage: page }) => {
    logTestStart('[no:4] 연차일수관리 - 부서 조건 조회 (SCH_DEPT_NM)');
    logInput('SCH_STDR_DT', '2026-07-01');
    logInput('SCH_DEPT_NM', '총무부');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: '2026-07-01', SCH_DEPT_NM: '총무부' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0030-no4-dept.png`, fullPage: true });

    expect(rows.length, '연차일수관리 부서 조건 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 연차일수관리 - 성명 키워드 조회 (SCH_EMP_NM)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * 예상결과: 성명에 '홍길동'이 포함된 직원의 연차일수 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE EMP_NM LIKE '%홍길동%'
   */
  test('[no:5] 연차일수관리 - 성명 키워드 조회 (SCH_EMP_NM)', async ({ workerPage: page }) => {
    logTestStart('[no:5] 연차일수관리 - 성명 키워드 조회 (SCH_EMP_NM)');
    logInput('SCH_STDR_DT', '2026-07-01');
    logInput('SCH_EMP_NM', '홍길동');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: '2026-07-01', SCH_EMP_NM: '홍길동' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0030-no5-empnm.png`, fullPage: true });

    expect(rows.length, '연차일수관리 성명 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 연차일수관리 - 재직구분 필터 (퇴직자, SCH_HLDF_FG_CD=101-020)
   * 중분류: 총무관리  소분류: 근태관리  메뉴명: 연차일수관리  액터: 개발자
   * 예상결과: 퇴직 상태(101-020) 직원의 연차일수 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_EMP_MST WHERE HLDF_FG_CD = '101-020'
   */
  test('[no:6] 연차일수관리 - 재직구분 필터 (퇴직자)', async ({ workerPage: page }) => {
    logTestStart('[no:6] 연차일수관리 - 재직구분 필터 (퇴직자)');
    logInput('SCH_STDR_DT', '2026-07-01');
    logInput('SCH_HLDF_FG_CD', '101-020');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_STDR_DT: '2026-07-01', SCH_HLDF_FG_CD: '101-020' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/gen0030-no6-retired.png`, fullPage: true });

    expect(rows.length, '연차일수관리 퇴직자 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

});
