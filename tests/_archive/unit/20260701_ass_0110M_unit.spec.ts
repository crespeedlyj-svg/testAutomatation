// ==============================================================
// ASS — 자산등록 단위 테스트 (ass_0110M)
// 생성일시: 2026-07-01  |  파일: 20260701_ass_0110M_unit.spec.ts
// 화면: 자산등록 대상(계약구매)조회
// API: POST /mis/ass/ass0110/getList.do
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지 (API-direct)
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '/mis/ass/ass0110/getList.do';
const PGM_ID         = 'ass_0110M';       // API 본문 전용 — 테스트명 사용 금지
const DS_LIST        = 'ds_list';

// ── ds_search 컬럼 목록 (ass_0110M.xfdl Dataset 정의 기준) ──────────────────
const DS_SEARCH_COLUMNS = [
  'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_SRCH_DT', 'FRM_DT', 'TO_DT',
  'SEARCHKEY', 'KEYWORD', 'PUR_CONT_NO', 'AST_REG_YN', 'AST_ACQ_STAT',
  'REG_CLS', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'ROLE_YN', 'DEPT_CHIF_YN',
  'OUT_MNG_YN', 'ASS_ACCT_YN', 'FRM_AMT', 'TO_AMT', 'AST_CLS_NM',
  'AST_CLS_CD', 'THNG_MNG_NO', 'THNG_MNG_SEQ',
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
// [ass_0110M] 단위 테스트 — 자산등록 대상(계약구매) 목록 조회
// ============================================================================
test.describe('자산등록 단위 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 자산등록 - 전체 조회 (필수 기본조건: 기간+등록대상)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * URL: /mis/ass/ass0110/getList.do
   * 예상결과: 자산등록 대상(계약구매) 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM [TODO: ass0110 getList 대상 테이블 확인 ] DUAL WHERE 1=1
   */
  test('[no:1] 자산등록 - 전체 조회 (기간+등록대상)', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산등록 - 전체 조회');
    logInput('SCH_SRCH_DT', 'CTRCT_DT');
    logInput('FRM_DT~TO_DT', '20260601 ~ 20260701');
    logInput('REG_CLS', '709-001');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'CTRCT_DT', FRM_DT: '20260601', TO_DT: '20260701', REG_CLS: '709-001' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0110-no1-all.png`, fullPage: true });

    expect(rows.length, '자산등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 자산등록 - 계약일 기간 조회 (SCH_SRCH_DT=CTRCT_DT)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * 예상결과: 지정 기간 내 계약구매 자산등록 대상이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM [TODO: ass0110 대상 테이블 ] DUAL WHERE CTRCT_DT BETWEEN '20260101' AND '20260701'
   */
  test('[no:2] 자산등록 - 계약일 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자산등록 - 계약일 기간 조회');
    logInput('SCH_SRCH_DT', 'CTRCT_DT');
    logInput('FRM_DT~TO_DT', '20260101 ~ 20260701');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'CTRCT_DT', FRM_DT: '20260101', TO_DT: '20260701', REG_CLS: '709-001' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0110-no2-period.png`, fullPage: true });

    expect(rows.length, '자산등록 계약일 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:3] [단위] [SELECT] 자산등록 - 역방향 날짜 조회 (FRM_DT > TO_DT, 0건 기대)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * 예상결과: 시작일이 종료일보다 커서 조회 결과가 0건이다. (총 0건)
   */
  test('[no:3] 자산등록 - 역방향 날짜 조회 (0건)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 자산등록 - 역방향 날짜 조회');
    logInput('FRM_DT~TO_DT', '20260701 ~ 20260601 (역방향)');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'CTRCT_DT', FRM_DT: '20260701', TO_DT: '20260601', REG_CLS: '709-001' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);

    expect(rows.length, '자산등록 역방향 날짜 0건 기대').toBe(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] [단위] [SELECT] 자산등록 - 등록상태 코드 필터 (AST_ACQ_STAT=713-001 등록대기)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * 예상결과: 등록대기 상태의 자산등록 대상만 조회된다.
   * DB 확인: SELECT COUNT(*) FROM [TODO: ass0110 대상 테이블 ] DUAL WHERE AST_ACQ_STAT = '713-001'
   */
  test('[no:4] 자산등록 - 등록상태 코드 필터 (등록대기)', async ({ workerPage: page }) => {
    logTestStart('[no:4] 자산등록 - 등록상태 코드 필터');
    logInput('AST_ACQ_STAT', '713-001 (등록대기)');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'CTRCT_DT', FRM_DT: '20260601', TO_DT: '20260701', REG_CLS: '709-001', AST_ACQ_STAT: '713-001' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0110-no4-stat.png`, fullPage: true });

    expect(rows.length, '자산등록 등록상태 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:5] [단위] [SELECT] 자산등록 - 키워드 검색 (SEARCHKEY=THNG_NM 품명)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * 예상결과: 품명에 키워드가 포함된 대상만 조회된다.
   * DB 확인: SELECT COUNT(*) FROM [TODO: ass0110 대상 테이블 ] DUAL WHERE THNG_NM LIKE '%노트북%'
   */
  test('[no:5] 자산등록 - 품명 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 자산등록 - 품명 키워드 검색');
    logInput('SEARCHKEY', 'THNG_NM');
    logInput('KEYWORD', '노트북');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'CTRCT_DT', FRM_DT: '20260601', TO_DT: '20260701', REG_CLS: '709-001', SEARCHKEY: 'THNG_NM', KEYWORD: '노트북' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0110-no5-keyword.png`, fullPage: true });

    expect(rows.length, '자산등록 품명 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:6] [단위] [SELECT] 자산등록 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * 예상결과: 담당자 권한 기준으로 전체 대상이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM [TODO: ass0110 대상 테이블 ] DUAL WHERE 1=1
   */
  test('[no:6] 자산등록 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] 자산등록 - 담당자 권한 조회');
    logInput('ROLE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'CTRCT_DT', FRM_DT: '20260601', TO_DT: '20260701', REG_CLS: '709-001', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0110-no6-role.png`, fullPage: true });

    expect(rows.length, '자산등록 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
