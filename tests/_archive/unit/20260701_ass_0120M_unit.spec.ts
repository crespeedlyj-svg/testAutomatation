// ==============================================================
// ASS — 자산정보관리 단위 테스트 (ass_0120M)
// 생성일시: 2026-07-01  |  파일: 20260701_ass_0120M_unit.spec.ts
// 화면: 자산정보관리현황 (자산대장/자산수기등록 토글)
// API: POST /mis/ass/ass0120/getList.do
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지 (API-direct)
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '/mis/ass/ass0120/getList.do';
const PGM_ID         = 'ass_0120M';       // API 본문 전용 — 테스트명 사용 금지
const DS_LIST        = 'ds_list';

// ── ds_search 컬럼 목록 (ass_0120M.xfdl Dataset 정의 기준) ──────────────────
const DS_SEARCH_COLUMNS = [
  'CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'SCH_SRCH_DT', 'SCH_SRCH_CLS',
  'FRM_DT', 'TO_DT', 'AST_USER_DEPT_NM', 'AST_USER_DEPT_CD', 'DEPT_CD',
  'DEPT_NM', 'AST_USER_EMP_NM', 'AST_USER_EMP_NO', 'AST_STAT', 'KEYWORD',
  'SUB_DEPT_YN', 'DEPR_OBJ_YN', 'S_ACQ_AMT', 'E_ACQ_AMT', 'AST_CLS_CD',
  'AST_CLS_NM', 'AST_CD', 'AST_NM', 'AST_MNG_CD', 'ROLE_YN',
  'DEPT_CHIF_YN', 'ACT_USE_YN', 'MAKE_NTN_CD', 'MAKE_NTN_NM', 'ACCT_UNT_CD',
  'DATA_FG', 'RGD_TRGT_YN',
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
// [ass_0120M] 단위 테스트 — 자산정보관리(자산대장) 목록 조회
// ============================================================================
test.describe('자산정보관리 단위 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 자산정보관리 - 전체 조회 (필수 기본조건: 검색기간)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * URL: /mis/ass/ass0120/getList.do
   * 예상결과: 자산정보(자산대장) 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM [TODO: 자산 마스터 테이블 ] DUAL WHERE 1=1
   */
  test('[no:1] 자산정보관리 - 전체 조회 (검색기간)', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산정보관리 - 전체 조회');
    logInput('SCH_SRCH_DT', 'ACQ_DT');
    logInput('FRM_DT~TO_DT', '20260401 ~ 20260701');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'ACQ_DT', FRM_DT: '20260401', TO_DT: '20260701' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0120-no1-all.png`, fullPage: true });

    expect(rows.length, '자산정보관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 자산정보관리 - 취득일자 기간 조회 (SCH_SRCH_DT=ACQ_DT)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * 예상결과: 지정 기간 내 취득한 자산이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM [TODO: 자산 마스터 테이블 ] DUAL WHERE ACQ_DT BETWEEN '20260101' AND '20260701'
   */
  test('[no:2] 자산정보관리 - 취득일자 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자산정보관리 - 취득일자 기간 조회');
    logInput('SCH_SRCH_DT', 'ACQ_DT');
    logInput('FRM_DT~TO_DT', '20260101 ~ 20260701');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'ACQ_DT', FRM_DT: '20260101', TO_DT: '20260701' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0120-no2-period.png`, fullPage: true });

    expect(rows.length, '자산정보관리 취득일자 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:3] [단위] [SELECT] 자산정보관리 - 역방향 날짜 조회 (FRM_DT > TO_DT, 0건 기대)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * 예상결과: 시작일이 종료일보다 커서 조회 결과가 0건이다. (총 0건)
   */
  test('[no:3] 자산정보관리 - 역방향 날짜 조회 (0건)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 자산정보관리 - 역방향 날짜 조회');
    logInput('FRM_DT~TO_DT', '20260701 ~ 20260401 (역방향)');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'ACQ_DT', FRM_DT: '20260701', TO_DT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);

    expect(rows.length, '자산정보관리 역방향 날짜 0건 기대').toBe(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] [단위] [SELECT] 자산정보관리 - 자산상태 코드 필터 (AST_STAT=703-001)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * 예상결과: 선택한 자산상태에 해당하는 자산만 조회된다.
   * DB 확인: SELECT COUNT(*) FROM [TODO: 자산 마스터 테이블 ] DUAL WHERE AST_STAT = '703-001'
   */
  test('[no:4] 자산정보관리 - 자산상태 코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 자산정보관리 - 자산상태 코드 필터');
    logInput('AST_STAT', '703-001');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'ACQ_DT', FRM_DT: '20260401', TO_DT: '20260701', AST_STAT: '703-001' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0120-no4-stat.png`, fullPage: true });

    expect(rows.length, '자산정보관리 자산상태 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:5] [단위] [SELECT] 자산정보관리 - 키워드 검색 (SCH_SRCH_CLS=STD 규격)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * 예상결과: 규격에 키워드가 포함된 자산만 조회된다.
   * DB 확인: SELECT COUNT(*) FROM [TODO: 자산 마스터 테이블 ] DUAL WHERE STD LIKE '%PC%'
   */
  test('[no:5] 자산정보관리 - 규격 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 자산정보관리 - 규격 키워드 검색');
    logInput('SCH_SRCH_CLS', 'STD');
    logInput('KEYWORD', 'PC');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'ACQ_DT', FRM_DT: '20260401', TO_DT: '20260701', SCH_SRCH_CLS: 'STD', KEYWORD: 'PC' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0120-no5-keyword.png`, fullPage: true });

    expect(rows.length, '자산정보관리 규격 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:6] [단위] [SELECT] 자산정보관리 - 상각대상 필터 (DEPR_OBJ_YN=Y)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * 예상결과: 감가상각 대상 자산만 조회된다.
   * DB 확인: SELECT COUNT(*) FROM [TODO: 자산 마스터 테이블 ] DUAL WHERE DEPR_OBJ_YN = 'Y'
   */
  test('[no:6] 자산정보관리 - 상각대상 필터', async ({ workerPage: page }) => {
    logTestStart('[no:6] 자산정보관리 - 상각대상 필터');
    logInput('DEPR_OBJ_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'ACQ_DT', FRM_DT: '20260401', TO_DT: '20260701', DEPR_OBJ_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0120-no6-depr.png`, fullPage: true });

    expect(rows.length, '자산정보관리 상각대상 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
