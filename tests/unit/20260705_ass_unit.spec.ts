// ==============================================================
// ASS 모듈 — 자산관리 단위 테스트 (통합 spec)
// 생성일시: 20260705  |  파일: 20260705_ass_unit.spec.ts
// 커버 화면: 57개  |  총 테스트 케이스: 175건
// 방식: API-direct (page.evaluate(fetch) + nexacroXml)
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 금지
// 소스: _workspace/ass/01_scenarios.json
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';

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

// API 호출 — page.evaluate(fetch) + credentials:'include' (세션 쿠키 포함)
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

test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
test.afterAll(() => { flushLogs(); });

// ───────────────────────────────────────────────────────────────────────────
// ass_0110M — 자산등록  |  API: POST /mis/ass/ass0110/getList.do  |  TC 6건
// TODO(menuId): ass_0110M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0110/getList.do';
  const PGM_ID            = 'ass_0110M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_SRCH_DT', 'FRM_DT', 'TO_DT', 'SEARCHKEY', 'KEYWORD', 'PUR_CONT_NO', 'AST_REG_YN', 'AST_ACQ_STAT', 'REG_CLS', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'ROLE_YN', 'DEPT_CHIF_YN', 'OUT_MNG_YN', 'ASS_ACCT_YN', 'FRM_AMT', 'TO_AMT', 'AST_CLS_NM', 'AST_CLS_CD', 'THNG_MNG_NO', 'THNG_MNG_SEQ'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자산등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자산등록 - 전체 조회 (필수 기본조건: 기간+등록대상)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * URL: /mis/ass/ass0110/getList.do
   * 예상결과: 자산등록 대상(계약구매) 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass0110 getList 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 자산등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산등록 - 전체 조회');
    logInput('검색조건', 'SCH_SRCH_DT=CTRCT_DT, FRM_DT=20260601, TO_DT=20260701, REG_CLS=709-001');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'CTRCT_DT', FRM_DT: '20260601', TO_DT: '20260701', REG_CLS: '709-001' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0110M-no1.png`, fullPage: true });

    expect(rows.length, '자산등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 자산등록 - 계약일 기간 조회 (SCH_SRCH_DT=CTRCT_DT, FRM_DT~TO_DT)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * URL: /mis/ass/ass0110/getList.do
   * 예상결과: 지정 기간 내 계약구매 자산등록 대상이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass0110 대상 테이블 * / DUAL WHERE CTRCT_DT BETWEEN '20260101' AND '20260701'
   */
  test('[no:2] 자산등록 - 계약일 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자산등록 - 계약일 기간 조회');
    logInput('검색조건', 'SCH_SRCH_DT=CTRCT_DT, FRM_DT=20260101, TO_DT=20260701, REG_CLS=709-001');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'CTRCT_DT', FRM_DT: '20260101', TO_DT: '20260701', REG_CLS: '709-001' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0110M-no2.png`, fullPage: true });

    expect(rows.length, '자산등록 계약일 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 자산등록 - 역방향 날짜 조회 (FRM_DT > TO_DT, 0건 확인)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * URL: /mis/ass/ass0110/getList.do
   * 예상결과: 시작일이 종료일보다 커서 조회 결과가 0건이다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass0110 대상 테이블 * / DUAL WHERE CTRCT_DT BETWEEN '20260701' AND '20260601'
   */
  test('[no:3] 자산등록 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 자산등록 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_SRCH_DT=CTRCT_DT, FRM_DT=20260701, TO_DT=20260601, REG_CLS=709-001');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'CTRCT_DT', FRM_DT: '20260701', TO_DT: '20260601', REG_CLS: '709-001' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0110M-no3.png`, fullPage: true });

    expect(rows.length, '자산등록 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 자산등록 - 등록상태 코드 필터 (AST_ACQ_STAT=713-001 등록대기)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * URL: /mis/ass/ass0110/getList.do
   * 예상결과: 등록대기 상태의 자산등록 대상만 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass0110 대상 테이블 * / DUAL WHERE AST_ACQ_STAT = '713-001'
   */
  test('[no:4] 자산등록 - 등록상태 코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 자산등록 - 등록상태 코드 필터');
    logInput('검색조건', 'SCH_SRCH_DT=CTRCT_DT, FRM_DT=20260601, TO_DT=20260701, REG_CLS=709-001, AST_ACQ_STAT=713-001');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'CTRCT_DT', FRM_DT: '20260601', TO_DT: '20260701', REG_CLS: '709-001', AST_ACQ_STAT: '713-001' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0110M-no4.png`, fullPage: true });

    expect(rows.length, '자산등록 등록상태 코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 자산등록 - 키워드 검색 (SEARCHKEY=THNG_NM 품명, KEYWORD)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * URL: /mis/ass/ass0110/getList.do
   * 예상결과: 품명에 키워드가 포함된 대상만 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass0110 대상 테이블 * / DUAL WHERE THNG_NM LIKE '%노트북%'
   */
  test('[no:5] 자산등록 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 자산등록 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_DT=CTRCT_DT, FRM_DT=20260601, TO_DT=20260701, REG_CLS=709-001, SEARCHKEY=THNG_NM, KEYWORD=노트북');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'CTRCT_DT', FRM_DT: '20260601', TO_DT: '20260701', REG_CLS: '709-001', SEARCHKEY: 'THNG_NM', KEYWORD: '노트북' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0110M-no5.png`, fullPage: true });

    expect(rows.length, '자산등록 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 자산등록 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * URL: /mis/ass/ass0110/getList.do
   * 예상결과: 담당자 권한 기준으로 전체 대상이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass0110 대상 테이블 * / DUAL WHERE 1=1
   */
  test('[no:6] 자산등록 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] 자산등록 - 담당자 권한 조회');
    logInput('검색조건', 'SCH_SRCH_DT=CTRCT_DT, FRM_DT=20260601, TO_DT=20260701, REG_CLS=709-001, ROLE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'CTRCT_DT', FRM_DT: '20260601', TO_DT: '20260701', REG_CLS: '709-001', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0110M-no6.png`, fullPage: true });

    expect(rows.length, '자산등록 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0111M — 자산등록  |  API: POST /mis/ass/ass0111/getData.do  |  TC 1건
// TODO(menuId): ass_0111M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0111/getData.do';
  const PGM_ID            = 'ass_0111M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'REG_CLS', 'CTRCT_NO', 'CTRCT_SEQ', 'THNG_MNG_NO', 'THNG_MNG_SEQ', 'RQST_NO', 'SEQ', 'RESL_DT', 'AST_MNG_CD', 'AST_ACQ_STAT', 'PUR_CONT_NO', 'AST_USER_DEPT_CD', 'PMS_CNTC_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자산등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자산등록 - 자산등록 상세 조회 (getData, 키: PUR_CONT_NO/THNG_MNG_NO/THNG_MNG_SEQ)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록  액터: 개발자
   * URL: /mis/ass/ass0111/getData.do
   * 예상결과: 선택한 계약구매 항목의 자산등록 상세정보가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass0111 getData 대상 테이블 * / DUAL WHERE 1=1
   */
  test('[no:1] 자산등록 - 자산등록 상세 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산등록 - 자산등록 상세 조회');
    logInput('검색조건', 'REG_CLS=709-001, PUR_CONT_NO=, THNG_MNG_NO=, THNG_MNG_SEQ=, AST_ACQ_STAT=713-001');

    const resp   = await apiPost(page, API_URL, searchBody({ REG_CLS: '709-001', PUR_CONT_NO: '', THNG_MNG_NO: '', THNG_MNG_SEQ: '', AST_ACQ_STAT: '713-001' }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_astdtl');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0111M-no1.png`, fullPage: true });

    expect(rows.length, '자산등록 자산등록 상세 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0112M — 자산등록(병합)  |  API: POST /mis/ass/ass0112/getData.do  |  TC 1건
// TODO(menuId): ass_0112M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0112/getData.do';
  const PGM_ID            = 'ass_0112M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'REG_CLS', 'CTRCT_NO', 'CTRCT_SEQ', 'THNG_MNG_NO', 'THNG_MNG_SEQ', 'RQST_NO', 'SEQ', 'RESL_DT', 'AST_MNG_CD', 'AST_ACQ_STAT', 'PUR_CONT_NO', 'AST_USER_DEPT_CD', 'IS_NEW', 'PMS_CNTC_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자산등록(병합)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자산등록(병합) - 병합대상 계약목록 상세 조회 (getData, 키: THNG_MNG_NO_LIST)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록(병합)  액터: 개발자
   * URL: /mis/ass/ass0112/getData.do
   * 예상결과: 선택한 병합대상 계약목록과 예산내역이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass0112 getData 대상 테이블 * / DUAL WHERE 1=1
   */
  test('[no:1] 자산등록(병합) - 병합대상 계약목록 상세 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산등록(병합) - 병합대상 계약목록 상세 조회');
    logInput('검색조건', 'REG_CLS=709-001, THNG_MNG_NO=, THNG_MNG_SEQ=');

    const resp   = await apiPost(page, API_URL, searchBody({ REG_CLS: '709-001', THNG_MNG_NO: '', THNG_MNG_SEQ: '' }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_ctrctlist');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0112M-no1.png`, fullPage: true });

    expect(rows.length, '자산등록(병합) 병합대상 계약목록 상세 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0120M — 자산정보관리  |  API: POST /mis/ass/ass0120/getList.do  |  TC 6건
// TODO(menuId): ass_0120M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0120/getList.do';
  const PGM_ID            = 'ass_0120M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'SCH_SRCH_DT', 'SCH_SRCH_CLS', 'FRM_DT', 'TO_DT', 'AST_USER_DEPT_NM', 'AST_USER_DEPT_CD', 'DEPT_CD', 'DEPT_NM', 'AST_USER_EMP_NM', 'AST_USER_EMP_NO', 'AST_STAT', 'KEYWORD', 'SUB_DEPT_YN', 'DEPR_OBJ_YN', 'S_ACQ_AMT', 'E_ACQ_AMT', 'AST_CLS_CD', 'AST_CLS_NM', 'AST_CD', 'AST_NM', 'AST_MNG_CD', 'ROLE_YN', 'DEPT_CHIF_YN', 'ACT_USE_YN', 'MAKE_NTN_CD', 'MAKE_NTN_NM', 'ACCT_UNT_CD', 'DATA_FG', 'RGD_TRGT_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자산정보관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자산정보관리 - 전체 조회 (필수 기본조건: 검색기간)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * URL: /mis/ass/ass0120/getList.do
   * 예상결과: 자산정보(자산대장) 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: 자산 마스터 테이블 * / DUAL WHERE 1=1
   */
  test('[no:1] 자산정보관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산정보관리 - 전체 조회');
    logInput('검색조건', 'SCH_SRCH_DT=ACQ_DT, FRM_DT=20260401, TO_DT=20260701');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'ACQ_DT', FRM_DT: '20260401', TO_DT: '20260701' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0120M-no1.png`, fullPage: true });

    expect(rows.length, '자산정보관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 자산정보관리 - 취득일자 기간 조회 (SCH_SRCH_DT=ACQ_DT, FRM_DT~TO_DT)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * URL: /mis/ass/ass0120/getList.do
   * 예상결과: 지정 기간 내 취득한 자산이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: 자산 마스터 테이블 * / DUAL WHERE ACQ_DT BETWEEN '20260101' AND '20260701'
   */
  test('[no:2] 자산정보관리 - 취득일자 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자산정보관리 - 취득일자 기간 조회');
    logInput('검색조건', 'SCH_SRCH_DT=ACQ_DT, FRM_DT=20260101, TO_DT=20260701');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'ACQ_DT', FRM_DT: '20260101', TO_DT: '20260701' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0120M-no2.png`, fullPage: true });

    expect(rows.length, '자산정보관리 취득일자 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 자산정보관리 - 역방향 날짜 조회 (FRM_DT > TO_DT, 0건 확인)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * URL: /mis/ass/ass0120/getList.do
   * 예상결과: 시작일이 종료일보다 커서 조회 결과가 0건이다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: 자산 마스터 테이블 * / DUAL WHERE ACQ_DT BETWEEN '20260701' AND '20260401'
   */
  test('[no:3] 자산정보관리 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 자산정보관리 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_SRCH_DT=ACQ_DT, FRM_DT=20260701, TO_DT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'ACQ_DT', FRM_DT: '20260701', TO_DT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0120M-no3.png`, fullPage: true });

    expect(rows.length, '자산정보관리 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 자산정보관리 - 자산상태 코드 필터 (AST_STAT)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * URL: /mis/ass/ass0120/getList.do
   * 예상결과: 선택한 자산상태에 해당하는 자산만 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: 자산 마스터 테이블 * / DUAL WHERE AST_STAT = '703-001'
   */
  test('[no:4] 자산정보관리 - 자산상태 코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 자산정보관리 - 자산상태 코드 필터');
    logInput('검색조건', 'SCH_SRCH_DT=ACQ_DT, FRM_DT=20260401, TO_DT=20260701, AST_STAT=703-001');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'ACQ_DT', FRM_DT: '20260401', TO_DT: '20260701', AST_STAT: '703-001' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0120M-no4.png`, fullPage: true });

    expect(rows.length, '자산정보관리 자산상태 코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 자산정보관리 - 키워드 검색 (SCH_SRCH_CLS=STD 규격, KEYWORD)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * URL: /mis/ass/ass0120/getList.do
   * 예상결과: 규격에 키워드가 포함된 자산만 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: 자산 마스터 테이블 * / DUAL WHERE STD LIKE '%PC%'
   */
  test('[no:5] 자산정보관리 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 자산정보관리 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_DT=ACQ_DT, FRM_DT=20260401, TO_DT=20260701, SCH_SRCH_CLS=STD, KEYWORD=PC');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'ACQ_DT', FRM_DT: '20260401', TO_DT: '20260701', SCH_SRCH_CLS: 'STD', KEYWORD: 'PC' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0120M-no5.png`, fullPage: true });

    expect(rows.length, '자산정보관리 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 자산정보관리 - 상각대상 필터 (DEPR_OBJ_YN=Y)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산정보관리  액터: 개발자
   * URL: /mis/ass/ass0120/getList.do
   * 예상결과: 감가상각 대상 자산만 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: 자산 마스터 테이블 * / DUAL WHERE DEPR_OBJ_YN = 'Y'
   */
  test('[no:6] 자산정보관리 - 상각대상 필터', async ({ workerPage: page }) => {
    logTestStart('[no:6] 자산정보관리 - 상각대상 필터');
    logInput('검색조건', 'SCH_SRCH_DT=ACQ_DT, FRM_DT=20260401, TO_DT=20260701, DEPR_OBJ_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_DT: 'ACQ_DT', FRM_DT: '20260401', TO_DT: '20260701', DEPR_OBJ_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0120M-no6.png`, fullPage: true });

    expect(rows.length, '자산정보관리 상각대상 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0121M — 자산수기등록  |  API: POST /mis/ass/ass0121/getData.do  |  TC 1건
// TODO(menuId): ass_0121M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0121/getData.do';
  const PGM_ID            = 'ass_0121M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'AST_MNG_CD', 'AST_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자산수기등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자산수기등록 - 자산 상세 조회 (getData, 키: AST_MNG_CD/AST_CD)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산수기등록  액터: 개발자
   * URL: /mis/ass/ass0121/getData.do
   * 예상결과: 선택한 자산의 상세정보가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: 자산 마스터 테이블 * / DUAL WHERE AST_MNG_CD = :AST_MNG_CD
   */
  test('[no:1] 자산수기등록 - 자산 상세 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산수기등록 - 자산 상세 조회');
    logInput('검색조건', 'AST_MNG_CD=, AST_CD=');

    const resp   = await apiPost(page, API_URL, searchBody({ AST_MNG_CD: '', AST_CD: '' }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_main');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0121M-no1.png`, fullPage: true });

    expect(rows.length, '자산수기등록 자산 상세 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0130M — 자산등록현황(지재권)  |  API: POST /mis/ass/ass0130/getList.do  |  TC 6건
// TODO(menuId): ass_0130M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0130/getList.do';
  const PGM_ID            = 'ass_0130M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_SRCH_DT', 'FRM_DT', 'TO_DT', 'SEARCHKEY', 'KEYWORD', 'PUR_CONT_NO', 'AST_REG_YN', 'AST_ACQ_STAT', 'REG_CLS', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'ROLE_YN', 'DEPT_CHIF_YN', 'OUT_MNG_YN', 'ASS_ACCT_YN', 'FRM_AMT', 'TO_AMT', 'ITEM_MNG_NO', 'ITEM_MNG_SEQ', 'CORP_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자산등록현황(지재권)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자산등록현황(지재권) - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록현황(지재권)  액터: 개발자
   * URL: /mis/ass/ass0130/getList.do
   * 예상결과: 자산등록현황(지재권) 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0130M /mis/ass/ass0130/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 자산등록현황(지재권) - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산등록현황(지재권) - 전체 조회');
    logInput('검색조건', 'FRM_DT=20260401, TO_DT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_DT: '20260401', TO_DT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0130M-no1.png`, fullPage: true });

    expect(rows.length, '자산등록현황(지재권) 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 자산등록현황(지재권) - 기간 조회 (FRM_DT~TO_DT)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록현황(지재권)  액터: 개발자
   * URL: /mis/ass/ass0130/getList.do
   * 예상결과: 자산등록현황(지재권) 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0130M /mis/ass/ass0130/getList.do 대상 테이블 확인 * / DUAL WHERE FRM_DT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 자산등록현황(지재권) - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자산등록현황(지재권) - 기간 조회');
    logInput('검색조건', 'FRM_DT=20260101, TO_DT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_DT: '20260101', TO_DT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0130M-no2.png`, fullPage: true });

    expect(rows.length, '자산등록현황(지재권) 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 자산등록현황(지재권) - 역방향 날짜 조회 (FRM_DT > TO_DT, 0건 확인)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록현황(지재권)  액터: 개발자
   * URL: /mis/ass/ass0130/getList.do
   * 예상결과: 자산등록현황(지재권) 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0130M /mis/ass/ass0130/getList.do 대상 테이블 확인 * / DUAL WHERE FRM_DT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 자산등록현황(지재권) - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 자산등록현황(지재권) - 역방향 날짜 조회');
    logInput('검색조건', 'FRM_DT=20260705, TO_DT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_DT: '20260705', TO_DT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0130M-no3.png`, fullPage: true });

    expect(rows.length, '자산등록현황(지재권) 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 자산등록현황(지재권) - 상태코드 필터 (AST_ACQ_STAT, 대표값 — 실제 코드값 확인 필요)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록현황(지재권)  액터: 개발자
   * URL: /mis/ass/ass0130/getList.do
   * 예상결과: 자산등록현황(지재권) 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0130M /mis/ass/ass0130/getList.do 대상 테이블 확인 * / DUAL WHERE AST_ACQ_STAT = :AST_ACQ_STAT
   */
  test('[no:4] 자산등록현황(지재권) - 상태코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 자산등록현황(지재권) - 상태코드 필터');
    logInput('검색조건', 'FRM_DT=20260401, TO_DT=20260705, AST_ACQ_STAT=');

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_DT: '20260401', TO_DT: '20260705', AST_ACQ_STAT: '' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0130M-no4.png`, fullPage: true });

    expect(rows.length, '자산등록현황(지재권) 상태코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 자산등록현황(지재권) - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록현황(지재권)  액터: 개발자
   * URL: /mis/ass/ass0130/getList.do
   * 예상결과: 자산등록현황(지재권) 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0130M /mis/ass/ass0130/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:5] 자산등록현황(지재권) - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 자산등록현황(지재권) - 키워드 검색');
    logInput('검색조건', 'FRM_DT=20260401, TO_DT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_DT: '20260401', TO_DT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0130M-no5.png`, fullPage: true });

    expect(rows.length, '자산등록현황(지재권) 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 자산등록현황(지재권) - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록현황(지재권)  액터: 개발자
   * URL: /mis/ass/ass0130/getList.do
   * 예상결과: 자산등록현황(지재권) 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0130M /mis/ass/ass0130/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:6] 자산등록현황(지재권) - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] 자산등록현황(지재권) - 담당자 권한 조회');
    logInput('검색조건', 'FRM_DT=20260401, TO_DT=20260705, ROLE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_DT: '20260401', TO_DT: '20260705', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0130M-no6.png`, fullPage: true });

    expect(rows.length, '자산등록현황(지재권) 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0131M — 자산등록(지재권)  |  API: POST /mis/ass/ass0131/getData.do  |  TC 1건
// TODO(menuId): ass_0131M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0131/getData.do';
  const PGM_ID            = 'ass_0131M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'REG_CLS', 'CTRCT_NO', 'CTRCT_SEQ', 'RESL_NO', 'ITEM_MNG_SEQ', 'RQST_NO', 'SEQ', 'RESL_DT', 'AST_MNG_CD', 'AST_ACQ_STAT', 'PUR_CONT_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자산등록(지재권)(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자산등록(지재권) - 상세 조회 (getData, 키: CORP_CD/BUSI_PLC_CD/BUSI_PLC_NM/REG_CLS/CTRCT_NO/CTRCT_SEQ)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록(지재권)  액터: 개발자
   * URL: /mis/ass/ass0131/getData.do
   * 예상결과: 선택한 항목의 자산등록(지재권) 상세정보가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0131M /mis/ass/ass0131/getData.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 자산등록(지재권) - 상세 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산등록(지재권) - 상세 조회');
    logInput('검색조건', 'CORP_CD=, BUSI_PLC_CD=, BUSI_PLC_NM=, REG_CLS=, CTRCT_NO=, CTRCT_SEQ=');

    const resp   = await apiPost(page, API_URL, searchBody({ CORP_CD: '', BUSI_PLC_CD: '', BUSI_PLC_NM: '', REG_CLS: '', CTRCT_NO: '', CTRCT_SEQ: '' }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_main');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0131M-no1.png`, fullPage: true });

    expect(rows.length, '자산등록(지재권) 상세 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0210M — 자산이력변경현황  |  API: POST /mis/ass/ass0210/getAssetList.do  |  TC 5건
// TODO(menuId): ass_0210M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0210/getAssetList.do';
  const PGM_ID            = 'ass_0210M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_SRCH_DT', 'FRM_DT', 'TO_DT', 'AST_MNG_DEPT_NM', 'AST_MNG_DEPT_CD', 'DEPT_CD', 'DEPT_NM', 'SUB_DEPT_YN', 'AST_STAT', 'PLACE_NM', 'PLACE_CD', 'AST_MNG_EMP_NM', 'AST_MNG_EMP_NO', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'AST_CLS_CD', 'AST_CLS_NM', 'ALL_YN', 'AST_HST_CLS'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자산이력변경현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자산이력변경현황 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산이력변경현황  액터: 개발자
   * URL: /mis/ass/ass0210/getAssetList.do
   * 예상결과: 자산이력변경현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0210M /mis/ass/ass0210/getAssetList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 자산이력변경현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산이력변경현황 - 전체 조회');
    logInput('검색조건', 'FRM_DT=20260401, TO_DT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_DT: '20260401', TO_DT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getAssetList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0210M-no1.png`, fullPage: true });

    expect(rows.length, '자산이력변경현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 자산이력변경현황 - 기간 조회 (FRM_DT~TO_DT)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산이력변경현황  액터: 개발자
   * URL: /mis/ass/ass0210/getAssetList.do
   * 예상결과: 자산이력변경현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0210M /mis/ass/ass0210/getAssetList.do 대상 테이블 확인 * / DUAL WHERE FRM_DT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 자산이력변경현황 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자산이력변경현황 - 기간 조회');
    logInput('검색조건', 'FRM_DT=20260101, TO_DT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_DT: '20260101', TO_DT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getAssetList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0210M-no2.png`, fullPage: true });

    expect(rows.length, '자산이력변경현황 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 자산이력변경현황 - 역방향 날짜 조회 (FRM_DT > TO_DT, 0건 확인)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산이력변경현황  액터: 개발자
   * URL: /mis/ass/ass0210/getAssetList.do
   * 예상결과: 자산이력변경현황 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0210M /mis/ass/ass0210/getAssetList.do 대상 테이블 확인 * / DUAL WHERE FRM_DT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 자산이력변경현황 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 자산이력변경현황 - 역방향 날짜 조회');
    logInput('검색조건', 'FRM_DT=20260705, TO_DT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_DT: '20260705', TO_DT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getAssetList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0210M-no3.png`, fullPage: true });

    expect(rows.length, '자산이력변경현황 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 자산이력변경현황 - 상태코드 필터 (AST_STAT, 대표값 — 실제 코드값 확인 필요)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산이력변경현황  액터: 개발자
   * URL: /mis/ass/ass0210/getAssetList.do
   * 예상결과: 자산이력변경현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0210M /mis/ass/ass0210/getAssetList.do 대상 테이블 확인 * / DUAL WHERE AST_STAT = :AST_STAT
   */
  test('[no:4] 자산이력변경현황 - 상태코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 자산이력변경현황 - 상태코드 필터');
    logInput('검색조건', 'FRM_DT=20260401, TO_DT=20260705, AST_STAT=');

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_DT: '20260401', TO_DT: '20260705', AST_STAT: '' }));
    const result = await assertNexacroResponse(resp, 'getAssetList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0210M-no4.png`, fullPage: true });

    expect(rows.length, '자산이력변경현황 상태코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 자산이력변경현황 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산이력변경현황  액터: 개발자
   * URL: /mis/ass/ass0210/getAssetList.do
   * 예상결과: 자산이력변경현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0210M /mis/ass/ass0210/getAssetList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:5] 자산이력변경현황 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 자산이력변경현황 - 키워드 검색');
    logInput('검색조건', 'FRM_DT=20260401, TO_DT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ FRM_DT: '20260401', TO_DT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getAssetList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0210M-no5.png`, fullPage: true });

    expect(rows.length, '자산이력변경현황 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0211M — 자산이력변경  |  API: POST /mis/ass/ass0211/getData.do  |  TC 1건
// TODO(menuId): ass_0211M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0211/getData.do';
  const PGM_ID            = 'ass_0211M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['AST_MNG_CD', 'HST_SEQ', 'HST_CHG_MNG_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자산이력변경(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자산이력변경 - 상세 조회 (getData, 키: AST_MNG_CD/HST_SEQ/HST_CHG_MNG_NO)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산이력변경  액터: 개발자
   * URL: /mis/ass/ass0211/getData.do
   * 예상결과: 선택한 항목의 자산이력변경 상세정보가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0211M /mis/ass/ass0211/getData.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 자산이력변경 - 상세 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산이력변경 - 상세 조회');
    logInput('검색조건', 'AST_MNG_CD=, HST_SEQ=, HST_CHG_MNG_NO=');

    const resp   = await apiPost(page, API_URL, searchBody({ AST_MNG_CD: '', HST_SEQ: '', HST_CHG_MNG_NO: '' }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_main');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0211M-no1.png`, fullPage: true });

    expect(rows.length, '자산이력변경 상세 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0220M — 자산변경신청현황  |  API: POST /mis/ass/ass0220/getChgRqstList.do  |  TC 5건
// TODO(menuId): ass_0220M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0220/getChgRqstList.do';
  const PGM_ID            = 'ass_0220M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_DT', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'APV_STAT_CD', 'SCH_RQST_EMP_NO', 'SCH_RQST_EMP_NM', 'SCH_RQST_DEPT_CD', 'SCH_RQST_DEPT_NM', 'SCH_TKOVR_EMP_NO', 'SCH_TKOVR_EMP_NM', 'SCH_TKOVR_DEPT_CD', 'SCH_TKOVR_DEPT_NM', 'SCH_RCV_EMP_NO', 'SCH_RCV_EMP_NM', 'SCH_RCV_DEPT_CD', 'SCH_RCV_DEPT_NM', 'RQST_NO', 'SRCH_KEY', 'SRCH_CLS', 'ROLE_YN', 'DEPT_CHIF_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자산변경신청현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자산변경신청현황 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산변경신청현황  액터: 개발자
   * URL: /mis/ass/ass0220/getChgRqstList.do
   * 예상결과: 자산변경신청현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0220M /mis/ass/ass0220/getChgRqstList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 자산변경신청현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산변경신청현황 - 전체 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getChgRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0220M-no1.png`, fullPage: true });

    expect(rows.length, '자산변경신청현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 자산변경신청현황 - 기간 조회 (SCH_RQST_SDT~SCH_RQST_EDT)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산변경신청현황  액터: 개발자
   * URL: /mis/ass/ass0220/getChgRqstList.do
   * 예상결과: 자산변경신청현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0220M /mis/ass/ass0220/getChgRqstList.do 대상 테이블 확인 * / DUAL WHERE SCH_RQST_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 자산변경신청현황 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자산변경신청현황 - 기간 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260101, SCH_RQST_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260101', SCH_RQST_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getChgRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0220M-no2.png`, fullPage: true });

    expect(rows.length, '자산변경신청현황 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 자산변경신청현황 - 역방향 날짜 조회 (SCH_RQST_SDT > SCH_RQST_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산변경신청현황  액터: 개발자
   * URL: /mis/ass/ass0220/getChgRqstList.do
   * 예상결과: 자산변경신청현황 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0220M /mis/ass/ass0220/getChgRqstList.do 대상 테이블 확인 * / DUAL WHERE SCH_RQST_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 자산변경신청현황 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 자산변경신청현황 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260705, SCH_RQST_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260705', SCH_RQST_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getChgRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0220M-no3.png`, fullPage: true });

    expect(rows.length, '자산변경신청현황 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 자산변경신청현황 - 상태코드 필터 (APV_STAT_CD, 대표값 — 실제 코드값 확인 필요)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산변경신청현황  액터: 개발자
   * URL: /mis/ass/ass0220/getChgRqstList.do
   * 예상결과: 자산변경신청현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0220M /mis/ass/ass0220/getChgRqstList.do 대상 테이블 확인 * / DUAL WHERE APV_STAT_CD = :APV_STAT_CD
   */
  test('[no:4] 자산변경신청현황 - 상태코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 자산변경신청현황 - 상태코드 필터');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, APV_STAT_CD=');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', APV_STAT_CD: '' }));
    const result = await assertNexacroResponse(resp, 'getChgRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0220M-no4.png`, fullPage: true });

    expect(rows.length, '자산변경신청현황 상태코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 자산변경신청현황 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산변경신청현황  액터: 개발자
   * URL: /mis/ass/ass0220/getChgRqstList.do
   * 예상결과: 자산변경신청현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0220M /mis/ass/ass0220/getChgRqstList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:5] 자산변경신청현황 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 자산변경신청현황 - 담당자 권한 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, ROLE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getChgRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0220M-no5.png`, fullPage: true });

    expect(rows.length, '자산변경신청현황 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0221M — 자산변경신청  |  API: POST /mis/ass/ass0221/getChgData.do  |  TC 1건
// TODO(menuId): ass_0221M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0221/getChgData.do';
  const PGM_ID            = 'ass_0221M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자산변경신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자산변경신청 - 상세 조회 (getChgData, 키: 없음)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산변경신청  액터: 개발자
   * URL: /mis/ass/ass0221/getChgData.do
   * 예상결과: 선택한 항목의 자산변경신청 상세정보가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0221M /mis/ass/ass0221/getChgData.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 자산변경신청 - 상세 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산변경신청 - 상세 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getChgData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0221M-no1.png`, fullPage: true });

    expect(rows.length, '자산변경신청 상세 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0222M — 자산변경승인  |  API: POST /mis/ass/ass0222/getChgRqstList.do  |  TC 5건
// TODO(menuId): ass_0222M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0222/getChgRqstList.do';
  const PGM_ID            = 'ass_0222M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_DT', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'APV_STAT_CD', 'SCH_RQST_EMP_NO', 'SCH_RQST_EMP_NM', 'SCH_RQST_DEPT_CD', 'SCH_RQST_DEPT_NM', 'SCH_TKOVR_EMP_NO', 'SCH_TKOVR_EMP_NM', 'SCH_TKOVR_DEPT_CD', 'SCH_TKOVR_DEPT_NM', 'SCH_RCV_EMP_NO', 'SCH_RCV_EMP_NM', 'SCH_RCV_DEPT_CD', 'SCH_RCV_DEPT_NM', 'RQST_NO', 'SRCH_KEY', 'SRCH_CLS', 'ROLE_YN', 'DEPT_CHIF_YN', 'STAT_CLS'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자산변경승인(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자산변경승인 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산변경승인  액터: 개발자
   * URL: /mis/ass/ass0222/getChgRqstList.do
   * 예상결과: 자산변경승인 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0222M /mis/ass/ass0222/getChgRqstList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 자산변경승인 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산변경승인 - 전체 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getChgRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0222M-no1.png`, fullPage: true });

    expect(rows.length, '자산변경승인 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 자산변경승인 - 기간 조회 (SCH_RQST_SDT~SCH_RQST_EDT)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산변경승인  액터: 개발자
   * URL: /mis/ass/ass0222/getChgRqstList.do
   * 예상결과: 자산변경승인 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0222M /mis/ass/ass0222/getChgRqstList.do 대상 테이블 확인 * / DUAL WHERE SCH_RQST_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 자산변경승인 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자산변경승인 - 기간 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260101, SCH_RQST_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260101', SCH_RQST_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getChgRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0222M-no2.png`, fullPage: true });

    expect(rows.length, '자산변경승인 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 자산변경승인 - 역방향 날짜 조회 (SCH_RQST_SDT > SCH_RQST_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산변경승인  액터: 개발자
   * URL: /mis/ass/ass0222/getChgRqstList.do
   * 예상결과: 자산변경승인 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0222M /mis/ass/ass0222/getChgRqstList.do 대상 테이블 확인 * / DUAL WHERE SCH_RQST_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 자산변경승인 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 자산변경승인 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260705, SCH_RQST_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260705', SCH_RQST_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getChgRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0222M-no3.png`, fullPage: true });

    expect(rows.length, '자산변경승인 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 자산변경승인 - 상태코드 필터 (APV_STAT_CD, 대표값 — 실제 코드값 확인 필요)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산변경승인  액터: 개발자
   * URL: /mis/ass/ass0222/getChgRqstList.do
   * 예상결과: 자산변경승인 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0222M /mis/ass/ass0222/getChgRqstList.do 대상 테이블 확인 * / DUAL WHERE APV_STAT_CD = :APV_STAT_CD
   */
  test('[no:4] 자산변경승인 - 상태코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 자산변경승인 - 상태코드 필터');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, APV_STAT_CD=');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', APV_STAT_CD: '' }));
    const result = await assertNexacroResponse(resp, 'getChgRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0222M-no4.png`, fullPage: true });

    expect(rows.length, '자산변경승인 상태코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 자산변경승인 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 자산변경승인  액터: 개발자
   * URL: /mis/ass/ass0222/getChgRqstList.do
   * 예상결과: 자산변경승인 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0222M /mis/ass/ass0222/getChgRqstList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:5] 자산변경승인 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 자산변경승인 - 담당자 권한 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, ROLE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getChgRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0222M-no5.png`, fullPage: true });

    expect(rows.length, '자산변경승인 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0223M — 불용자산처분  |  API: POST /mis/ass/ass0221/getChgData.do  |  TC 1건
// TODO(menuId): ass_0223M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0221/getChgData.do';
  const PGM_ID            = 'ass_0223M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`불용자산처분(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 불용자산처분 - 기본 조회 (getChgData)
   * 중분류: 자산관리  소분류: 자산변경  메뉴명: 불용자산처분  액터: 개발자
   * URL: /mis/ass/ass0221/getChgData.do
   * 예상결과: 불용자산처분 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0223M /mis/ass/ass0221/getChgData.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 불용자산처분 - 기본 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 불용자산처분 - 기본 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getChgData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0223M-no1.png`, fullPage: true });

    expect(rows.length, '불용자산처분 기본 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0310M — 장비현황  |  API: POST /mis/ass/ass0310/getList.do  |  TC 6건
// TODO(menuId): ass_0310M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0310/getList.do';
  const PGM_ID            = 'ass_0310M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACQ_SDT', 'ACQ_EDT', 'AST_USE_DEPT_NM', 'AST_USE_DEPT_CD', 'AST_USE_EMP_NM', 'AST_USE_EMP_NO', 'AST_STAT', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SUB_DEPT_YN', 'S_ACQ_AMT', 'E_ACQ_AMT', 'AST_CLS_CD', 'AST_CLS_NM', 'ROLE_YN', 'DEPT_CHIF_YN', 'STATUS_CD', 'EQUIP_YN', 'NTIS_REG_OBJ_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`장비현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 장비현황 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 장비관리  메뉴명: 장비현황  액터: 개발자
   * URL: /mis/ass/ass0310/getList.do
   * 예상결과: 장비현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0310M /mis/ass/ass0310/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 장비현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 장비현황 - 전체 조회');
    logInput('검색조건', 'ACQ_SDT=20260401, ACQ_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ ACQ_SDT: '20260401', ACQ_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0310M-no1.png`, fullPage: true });

    expect(rows.length, '장비현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 장비현황 - 기간 조회 (ACQ_SDT~ACQ_EDT)
   * 중분류: 자산관리  소분류: 장비관리  메뉴명: 장비현황  액터: 개발자
   * URL: /mis/ass/ass0310/getList.do
   * 예상결과: 장비현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0310M /mis/ass/ass0310/getList.do 대상 테이블 확인 * / DUAL WHERE ACQ_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 장비현황 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 장비현황 - 기간 조회');
    logInput('검색조건', 'ACQ_SDT=20260101, ACQ_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ ACQ_SDT: '20260101', ACQ_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0310M-no2.png`, fullPage: true });

    expect(rows.length, '장비현황 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 장비현황 - 역방향 날짜 조회 (ACQ_SDT > ACQ_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 장비관리  메뉴명: 장비현황  액터: 개발자
   * URL: /mis/ass/ass0310/getList.do
   * 예상결과: 장비현황 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0310M /mis/ass/ass0310/getList.do 대상 테이블 확인 * / DUAL WHERE ACQ_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 장비현황 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 장비현황 - 역방향 날짜 조회');
    logInput('검색조건', 'ACQ_SDT=20260705, ACQ_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ ACQ_SDT: '20260705', ACQ_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0310M-no3.png`, fullPage: true });

    expect(rows.length, '장비현황 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 장비현황 - 상태코드 필터 (AST_STAT, 대표값 — 실제 코드값 확인 필요)
   * 중분류: 자산관리  소분류: 장비관리  메뉴명: 장비현황  액터: 개발자
   * URL: /mis/ass/ass0310/getList.do
   * 예상결과: 장비현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0310M /mis/ass/ass0310/getList.do 대상 테이블 확인 * / DUAL WHERE AST_STAT = :AST_STAT
   */
  test('[no:4] 장비현황 - 상태코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 장비현황 - 상태코드 필터');
    logInput('검색조건', 'ACQ_SDT=20260401, ACQ_EDT=20260705, AST_STAT=');

    const resp   = await apiPost(page, API_URL, searchBody({ ACQ_SDT: '20260401', ACQ_EDT: '20260705', AST_STAT: '' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0310M-no4.png`, fullPage: true });

    expect(rows.length, '장비현황 상태코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 장비현황 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 장비관리  메뉴명: 장비현황  액터: 개발자
   * URL: /mis/ass/ass0310/getList.do
   * 예상결과: 장비현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0310M /mis/ass/ass0310/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:5] 장비현황 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 장비현황 - 키워드 검색');
    logInput('검색조건', 'ACQ_SDT=20260401, ACQ_EDT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACQ_SDT: '20260401', ACQ_EDT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0310M-no5.png`, fullPage: true });

    expect(rows.length, '장비현황 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 장비현황 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 장비관리  메뉴명: 장비현황  액터: 개발자
   * URL: /mis/ass/ass0310/getList.do
   * 예상결과: 장비현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0310M /mis/ass/ass0310/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:6] 장비현황 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] 장비현황 - 담당자 권한 조회');
    logInput('검색조건', 'ACQ_SDT=20260401, ACQ_EDT=20260705, ROLE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ ACQ_SDT: '20260401', ACQ_EDT: '20260705', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0310M-no6.png`, fullPage: true });

    expect(rows.length, '장비현황 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0311M — 장비등록  |  API: POST /mis/ass/ass0311/getNtisCodeList.do  |  TC 1건
// TODO(menuId): ass_0311M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0311/getNtisCodeList.do';
  const PGM_ID            = 'ass_0311M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`장비등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 장비등록 - 기본 조회 (getNtisCodeList)
   * 중분류: 자산관리  소분류: 장비관리  메뉴명: 장비등록  액터: 개발자
   * URL: /mis/ass/ass0311/getNtisCodeList.do
   * 예상결과: 장비등록 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0311M /mis/ass/ass0311/getNtisCodeList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 장비등록 - 기본 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 장비등록 - 기본 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getNtisCodeList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_main');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0311M-no1.png`, fullPage: true });

    expect(rows.length, '장비등록 기본 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0320M — ZEUS장비연계 현황  |  API: POST /mis/ass/ass0320/getNtisList.do  |  TC 6건
// TODO(menuId): ass_0320M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0320/getNtisList.do';
  const PGM_ID            = 'ass_0320M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'REGIST_ID', 'REGIST_NM', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'STATUS_CD', 'NTIS_REG_OBJ_YN', 'NTIS_SYNC_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`ZEUS장비연계 현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] ZEUS장비연계 현황 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 장비관리  메뉴명: ZEUS장비연계 현황  액터: 개발자
   * URL: /mis/ass/ass0320/getNtisList.do
   * 예상결과: ZEUS장비연계 현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0320M /mis/ass/ass0320/getNtisList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] ZEUS장비연계 현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] ZEUS장비연계 현황 - 전체 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getNtisList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0320M-no1.png`, fullPage: true });

    expect(rows.length, 'ZEUS장비연계 현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] ZEUS장비연계 현황 - 기간 조회 (SCH_RQST_SDT~SCH_RQST_EDT)
   * 중분류: 자산관리  소분류: 장비관리  메뉴명: ZEUS장비연계 현황  액터: 개발자
   * URL: /mis/ass/ass0320/getNtisList.do
   * 예상결과: ZEUS장비연계 현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0320M /mis/ass/ass0320/getNtisList.do 대상 테이블 확인 * / DUAL WHERE SCH_RQST_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] ZEUS장비연계 현황 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] ZEUS장비연계 현황 - 기간 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260101, SCH_RQST_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260101', SCH_RQST_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getNtisList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0320M-no2.png`, fullPage: true });

    expect(rows.length, 'ZEUS장비연계 현황 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] ZEUS장비연계 현황 - 역방향 날짜 조회 (SCH_RQST_SDT > SCH_RQST_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 장비관리  메뉴명: ZEUS장비연계 현황  액터: 개발자
   * URL: /mis/ass/ass0320/getNtisList.do
   * 예상결과: ZEUS장비연계 현황 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0320M /mis/ass/ass0320/getNtisList.do 대상 테이블 확인 * / DUAL WHERE SCH_RQST_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] ZEUS장비연계 현황 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] ZEUS장비연계 현황 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260705, SCH_RQST_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260705', SCH_RQST_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getNtisList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0320M-no3.png`, fullPage: true });

    expect(rows.length, 'ZEUS장비연계 현황 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] ZEUS장비연계 현황 - 상태코드 필터 (STATUS_CD, 대표값 — 실제 코드값 확인 필요)
   * 중분류: 자산관리  소분류: 장비관리  메뉴명: ZEUS장비연계 현황  액터: 개발자
   * URL: /mis/ass/ass0320/getNtisList.do
   * 예상결과: ZEUS장비연계 현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0320M /mis/ass/ass0320/getNtisList.do 대상 테이블 확인 * / DUAL WHERE STATUS_CD = :STATUS_CD
   */
  test('[no:4] ZEUS장비연계 현황 - 상태코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] ZEUS장비연계 현황 - 상태코드 필터');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, STATUS_CD=');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', STATUS_CD: '' }));
    const result = await assertNexacroResponse(resp, 'getNtisList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0320M-no4.png`, fullPage: true });

    expect(rows.length, 'ZEUS장비연계 현황 상태코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] ZEUS장비연계 현황 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 장비관리  메뉴명: ZEUS장비연계 현황  액터: 개발자
   * URL: /mis/ass/ass0320/getNtisList.do
   * 예상결과: ZEUS장비연계 현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0320M /mis/ass/ass0320/getNtisList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:5] ZEUS장비연계 현황 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] ZEUS장비연계 현황 - 키워드 검색');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getNtisList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0320M-no5.png`, fullPage: true });

    expect(rows.length, 'ZEUS장비연계 현황 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] ZEUS장비연계 현황 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 장비관리  메뉴명: ZEUS장비연계 현황  액터: 개발자
   * URL: /mis/ass/ass0320/getNtisList.do
   * 예상결과: ZEUS장비연계 현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0320M /mis/ass/ass0320/getNtisList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:6] ZEUS장비연계 현황 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] ZEUS장비연계 현황 - 담당자 권한 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, ROLE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getNtisList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0320M-no6.png`, fullPage: true });

    expect(rows.length, 'ZEUS장비연계 현황 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0500M — 물품반출입현황  |  API: POST /mis/ass/ass0500/getNotCarryList.do  |  TC 5건
// TODO(menuId): ass_0500M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0500/getNotCarryList.do';
  const PGM_ID            = 'ass_0500M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'SCH_RQST_CLS', 'SCH_SRCH_DT', 'SCH_RQST_EMP_NM', 'SCH_RQST_EMP_NO', 'SCH_RQST_DEPT_NM', 'SCH_RQST_DEPT_CD', 'DEPT_NM', 'DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'IO_END_YN', 'AST_YN', 'ROLE_YN', 'DEPT_CHIF_YN', 'G_CLS_DIV', 'M_CLS_DIV'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`물품반출입현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 물품반출입현황 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반출입현황  액터: 개발자
   * URL: /mis/ass/ass0500/getNotCarryList.do
   * 예상결과: 물품반출입현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0500M /mis/ass/ass0500/getNotCarryList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 물품반출입현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 물품반출입현황 - 전체 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getNotCarryList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0500M-no1.png`, fullPage: true });

    expect(rows.length, '물품반출입현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 물품반출입현황 - 기간 조회 (SCH_SRCH_SDT~SCH_SRCH_EDT)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반출입현황  액터: 개발자
   * URL: /mis/ass/ass0500/getNotCarryList.do
   * 예상결과: 물품반출입현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0500M /mis/ass/ass0500/getNotCarryList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 물품반출입현황 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 물품반출입현황 - 기간 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260101, SCH_SRCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260101', SCH_SRCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getNotCarryList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0500M-no2.png`, fullPage: true });

    expect(rows.length, '물품반출입현황 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 물품반출입현황 - 역방향 날짜 조회 (SCH_SRCH_SDT > SCH_SRCH_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반출입현황  액터: 개발자
   * URL: /mis/ass/ass0500/getNotCarryList.do
   * 예상결과: 물품반출입현황 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0500M /mis/ass/ass0500/getNotCarryList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 물품반출입현황 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 물품반출입현황 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260705, SCH_SRCH_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260705', SCH_SRCH_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getNotCarryList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0500M-no3.png`, fullPage: true });

    expect(rows.length, '물품반출입현황 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 물품반출입현황 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반출입현황  액터: 개발자
   * URL: /mis/ass/ass0500/getNotCarryList.do
   * 예상결과: 물품반출입현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0500M /mis/ass/ass0500/getNotCarryList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:4] 물품반출입현황 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:4] 물품반출입현황 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getNotCarryList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0500M-no4.png`, fullPage: true });

    expect(rows.length, '물품반출입현황 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 물품반출입현황 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반출입현황  액터: 개발자
   * URL: /mis/ass/ass0500/getNotCarryList.do
   * 예상결과: 물품반출입현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0500M /mis/ass/ass0500/getNotCarryList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:5] 물품반출입현황 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 물품반출입현황 - 담당자 권한 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705, ROLE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getNotCarryList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0500M-no5.png`, fullPage: true });

    expect(rows.length, '물품반출입현황 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0510M — 물품반출입신청  |  API: POST /mis/ass/ass0510/getCarryInOutRqstList.do  |  TC 6건
// TODO(menuId): ass_0510M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0510/getCarryInOutRqstList.do';
  const PGM_ID            = 'ass_0510M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['RQST_CLS', 'SCH_SRCH_DT', 'SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'SCH_RQST_DEPT_CD', 'SCH_RQST_DEPT_NM', 'DEPT_CD', 'DEPT_NM', 'SCH_RQST_CLS', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_RQST_EMP_NM', 'SCH_RQST_EMP_NO', 'SCH_APV_STAT_CD', 'ROLE_YN', 'DEPT_CHIF_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`물품반출입신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 물품반출입신청 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반출입신청  액터: 개발자
   * URL: /mis/ass/ass0510/getCarryInOutRqstList.do
   * 예상결과: 물품반출입신청 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0510M /mis/ass/ass0510/getCarryInOutRqstList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 물품반출입신청 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 물품반출입신청 - 전체 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getCarryInOutRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0510M-no1.png`, fullPage: true });

    expect(rows.length, '물품반출입신청 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 물품반출입신청 - 기간 조회 (SCH_SRCH_SDT~SCH_SRCH_EDT)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반출입신청  액터: 개발자
   * URL: /mis/ass/ass0510/getCarryInOutRqstList.do
   * 예상결과: 물품반출입신청 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0510M /mis/ass/ass0510/getCarryInOutRqstList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 물품반출입신청 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 물품반출입신청 - 기간 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260101, SCH_SRCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260101', SCH_SRCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getCarryInOutRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0510M-no2.png`, fullPage: true });

    expect(rows.length, '물품반출입신청 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 물품반출입신청 - 역방향 날짜 조회 (SCH_SRCH_SDT > SCH_SRCH_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반출입신청  액터: 개발자
   * URL: /mis/ass/ass0510/getCarryInOutRqstList.do
   * 예상결과: 물품반출입신청 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0510M /mis/ass/ass0510/getCarryInOutRqstList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 물품반출입신청 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 물품반출입신청 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260705, SCH_SRCH_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260705', SCH_SRCH_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getCarryInOutRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0510M-no3.png`, fullPage: true });

    expect(rows.length, '물품반출입신청 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 물품반출입신청 - 상태코드 필터 (SCH_APV_STAT_CD, 대표값 — 실제 코드값 확인 필요)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반출입신청  액터: 개발자
   * URL: /mis/ass/ass0510/getCarryInOutRqstList.do
   * 예상결과: 물품반출입신청 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0510M /mis/ass/ass0510/getCarryInOutRqstList.do 대상 테이블 확인 * / DUAL WHERE SCH_APV_STAT_CD = :SCH_APV_STAT_CD
   */
  test('[no:4] 물품반출입신청 - 상태코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 물품반출입신청 - 상태코드 필터');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705, SCH_APV_STAT_CD=');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705', SCH_APV_STAT_CD: '' }));
    const result = await assertNexacroResponse(resp, 'getCarryInOutRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0510M-no4.png`, fullPage: true });

    expect(rows.length, '물품반출입신청 상태코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 물품반출입신청 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반출입신청  액터: 개발자
   * URL: /mis/ass/ass0510/getCarryInOutRqstList.do
   * 예상결과: 물품반출입신청 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0510M /mis/ass/ass0510/getCarryInOutRqstList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:5] 물품반출입신청 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 물품반출입신청 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getCarryInOutRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0510M-no5.png`, fullPage: true });

    expect(rows.length, '물품반출입신청 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 물품반출입신청 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반출입신청  액터: 개발자
   * URL: /mis/ass/ass0510/getCarryInOutRqstList.do
   * 예상결과: 물품반출입신청 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0510M /mis/ass/ass0510/getCarryInOutRqstList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:6] 물품반출입신청 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] 물품반출입신청 - 담당자 권한 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705, ROLE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getCarryInOutRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0510M-no6.png`, fullPage: true });

    expect(rows.length, '물품반출입신청 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0511M — 물품반출신청  |  API: POST /mis/ass/ass0511/getCarryOutMst.do  |  TC 1건
// TODO(menuId): ass_0511M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0511/getCarryOutMst.do';
  const PGM_ID            = 'ass_0511M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`물품반출신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 물품반출신청 - 상세 조회 (getCarryOutMst, 키: 없음)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반출신청  액터: 개발자
   * URL: /mis/ass/ass0511/getCarryOutMst.do
   * 예상결과: 선택한 항목의 물품반출신청 상세정보가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0511M /mis/ass/ass0511/getCarryOutMst.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 물품반출신청 - 상세 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 물품반출신청 - 상세 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getCarryOutMst.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0511M-no1.png`, fullPage: true });

    expect(rows.length, '물품반출신청 상세 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0512M — 노트북등반출신청  |  API: POST /mis/ass/ass0511/getCarryOutMst.do  |  TC 1건
// TODO(menuId): ass_0512M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0511/getCarryOutMst.do';
  const PGM_ID            = 'ass_0512M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`노트북등반출신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 노트북등반출신청 - 기본 조회 (getCarryOutMst)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 노트북등반출신청  액터: 개발자
   * URL: /mis/ass/ass0511/getCarryOutMst.do
   * 예상결과: 노트북등반출신청 데이터가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0512M /mis/ass/ass0511/getCarryOutMst.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 노트북등반출신청 - 기본 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 노트북등반출신청 - 기본 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getCarryOutMst.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0512M-no1.png`, fullPage: true });

    expect(rows.length, '노트북등반출신청 기본 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0521M — 물품반입신청  |  API: POST /mis/ass/ass0521/getCarryOutListDtl.do  |  TC 1건
// TODO(menuId): ass_0521M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0521/getCarryOutListDtl.do';
  const PGM_ID            = 'ass_0521M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = [];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`물품반입신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 물품반입신청 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 물품반입신청  액터: 개발자
   * URL: /mis/ass/ass0521/getCarryOutListDtl.do
   * 예상결과: 물품반입신청 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0521M /mis/ass/ass0521/getCarryOutListDtl.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 물품반입신청 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 물품반입신청 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getCarryOutListDtl.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0521M-no1.png`, fullPage: true });

    expect(rows.length, '물품반입신청 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0530M — 전산기기반입신청  |  API: POST /mis/ass/ass0530/getCarryInOutRqstList.do  |  TC 6건
// TODO(menuId): ass_0530M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0530/getCarryInOutRqstList.do';
  const PGM_ID            = 'ass_0530M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['RQST_CLS', 'SCH_SRCH_DT', 'SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'SCH_RQST_DEPT_CD', 'SCH_RQST_DEPT_NM', 'DEPT_CD', 'DEPT_NM', 'SCH_RQST_CLS', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_RQST_EMP_NM', 'SCH_RQST_EMP_NO', 'SCH_APV_STAT_CD', 'ROLE_YN', 'DEPT_CHIF_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`전산기기반입신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 전산기기반입신청 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 전산기기반입신청  액터: 개발자
   * URL: /mis/ass/ass0530/getCarryInOutRqstList.do
   * 예상결과: 전산기기반입신청 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0530M /mis/ass/ass0530/getCarryInOutRqstList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 전산기기반입신청 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 전산기기반입신청 - 전체 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getCarryInOutRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0530M-no1.png`, fullPage: true });

    expect(rows.length, '전산기기반입신청 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 전산기기반입신청 - 기간 조회 (SCH_SRCH_SDT~SCH_SRCH_EDT)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 전산기기반입신청  액터: 개발자
   * URL: /mis/ass/ass0530/getCarryInOutRqstList.do
   * 예상결과: 전산기기반입신청 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0530M /mis/ass/ass0530/getCarryInOutRqstList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 전산기기반입신청 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 전산기기반입신청 - 기간 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260101, SCH_SRCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260101', SCH_SRCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getCarryInOutRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0530M-no2.png`, fullPage: true });

    expect(rows.length, '전산기기반입신청 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 전산기기반입신청 - 역방향 날짜 조회 (SCH_SRCH_SDT > SCH_SRCH_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 전산기기반입신청  액터: 개발자
   * URL: /mis/ass/ass0530/getCarryInOutRqstList.do
   * 예상결과: 전산기기반입신청 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0530M /mis/ass/ass0530/getCarryInOutRqstList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 전산기기반입신청 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 전산기기반입신청 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260705, SCH_SRCH_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260705', SCH_SRCH_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getCarryInOutRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0530M-no3.png`, fullPage: true });

    expect(rows.length, '전산기기반입신청 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 전산기기반입신청 - 상태코드 필터 (SCH_APV_STAT_CD, 대표값 — 실제 코드값 확인 필요)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 전산기기반입신청  액터: 개발자
   * URL: /mis/ass/ass0530/getCarryInOutRqstList.do
   * 예상결과: 전산기기반입신청 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0530M /mis/ass/ass0530/getCarryInOutRqstList.do 대상 테이블 확인 * / DUAL WHERE SCH_APV_STAT_CD = :SCH_APV_STAT_CD
   */
  test('[no:4] 전산기기반입신청 - 상태코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 전산기기반입신청 - 상태코드 필터');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705, SCH_APV_STAT_CD=');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705', SCH_APV_STAT_CD: '' }));
    const result = await assertNexacroResponse(resp, 'getCarryInOutRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0530M-no4.png`, fullPage: true });

    expect(rows.length, '전산기기반입신청 상태코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 전산기기반입신청 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 전산기기반입신청  액터: 개발자
   * URL: /mis/ass/ass0530/getCarryInOutRqstList.do
   * 예상결과: 전산기기반입신청 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0530M /mis/ass/ass0530/getCarryInOutRqstList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:5] 전산기기반입신청 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 전산기기반입신청 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getCarryInOutRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0530M-no5.png`, fullPage: true });

    expect(rows.length, '전산기기반입신청 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 전산기기반입신청 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 전산기기반입신청  액터: 개발자
   * URL: /mis/ass/ass0530/getCarryInOutRqstList.do
   * 예상결과: 전산기기반입신청 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0530M /mis/ass/ass0530/getCarryInOutRqstList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:6] 전산기기반입신청 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] 전산기기반입신청 - 담당자 권한 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705, ROLE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getCarryInOutRqstList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0530M-no6.png`, fullPage: true });

    expect(rows.length, '전산기기반입신청 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0531M — 노트북등반입신청  |  API: POST /mis/ass/ass0531/getCarryOutListDtl.do  |  TC 1건
// TODO(menuId): ass_0531M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0531/getCarryOutListDtl.do';
  const PGM_ID            = 'ass_0531M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['RQST_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`노트북등반입신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 노트북등반입신청 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 물품반출입  메뉴명: 노트북등반입신청  액터: 개발자
   * URL: /mis/ass/ass0531/getCarryOutListDtl.do
   * 예상결과: 노트북등반입신청 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0531M /mis/ass/ass0531/getCarryOutListDtl.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 노트북등반입신청 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 노트북등반입신청 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getCarryOutListDtl.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0531M-no1.png`, fullPage: true });

    expect(rows.length, '노트북등반입신청 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0701M — 상각기준등록  |  API: POST /mis/ass/ass0701/getList.do  |  TC 1건
// TODO(menuId): ass_0701M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0701/getList.do';
  const PGM_ID            = 'ass_0701M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['DEPR_CLS', 'TEMP_NUM', 'Column0'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`상각기준등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 상각기준등록 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 감가상각  메뉴명: 상각기준등록  액터: 개발자
   * URL: /mis/ass/ass0701/getList.do
   * 예상결과: 상각기준등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0701M /mis/ass/ass0701/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 상각기준등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 상각기준등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0701M-no1.png`, fullPage: true });

    expect(rows.length, '상각기준등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0710M — 감가상각통계표  |  API: POST /mis/ass/ass0710/getDeprList.do  |  TC 3건
// TODO(menuId): ass_0710M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0710/getDeprList.do';
  const PGM_ID            = 'ass_0710M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['DEPR_DT', 'DEPR_SDT', 'DEPR_EDT', 'DEPR_END_YN', 'DEPR_YY', 'DEPR_MMDD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`감가상각통계표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 감가상각통계표 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 감가상각  메뉴명: 감가상각통계표  액터: 개발자
   * URL: /mis/ass/ass0710/getDeprList.do
   * 예상결과: 감가상각통계표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0710M /mis/ass/ass0710/getDeprList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 감가상각통계표 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 감가상각통계표 - 전체 조회');
    logInput('검색조건', 'DEPR_SDT=20260401, DEPR_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ DEPR_SDT: '20260401', DEPR_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getDeprList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0710M-no1.png`, fullPage: true });

    expect(rows.length, '감가상각통계표 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 감가상각통계표 - 기간 조회 (DEPR_SDT~DEPR_EDT)
   * 중분류: 자산관리  소분류: 감가상각  메뉴명: 감가상각통계표  액터: 개발자
   * URL: /mis/ass/ass0710/getDeprList.do
   * 예상결과: 감가상각통계표 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0710M /mis/ass/ass0710/getDeprList.do 대상 테이블 확인 * / DUAL WHERE DEPR_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 감가상각통계표 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 감가상각통계표 - 기간 조회');
    logInput('검색조건', 'DEPR_SDT=20260101, DEPR_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ DEPR_SDT: '20260101', DEPR_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getDeprList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0710M-no2.png`, fullPage: true });

    expect(rows.length, '감가상각통계표 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 감가상각통계표 - 역방향 날짜 조회 (DEPR_SDT > DEPR_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 감가상각  메뉴명: 감가상각통계표  액터: 개발자
   * URL: /mis/ass/ass0710/getDeprList.do
   * 예상결과: 감가상각통계표 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0710M /mis/ass/ass0710/getDeprList.do 대상 테이블 확인 * / DUAL WHERE DEPR_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 감가상각통계표 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 감가상각통계표 - 역방향 날짜 조회');
    logInput('검색조건', 'DEPR_SDT=20260705, DEPR_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ DEPR_SDT: '20260705', DEPR_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getDeprList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0710M-no3.png`, fullPage: true });

    expect(rows.length, '감가상각통계표 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0711M — 감가상각계산  |  API: POST /mis/ass/ass0711/getAssetDeprList.do  |  TC 2건
// TODO(menuId): ass_0711M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0711/getAssetDeprList.do';
  const PGM_ID            = 'ass_0711M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['DEPR_YY', 'DEPR_DT', 'SCH_SRCH_KEY', 'SCH_SRCH_CLS', 'DEL_CHK_YN', 'AST_CLS_CD', 'AST_CLS_NM', 'DEPR_END_YN', 'INVST_PRPRT_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`감가상각계산(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 감가상각계산 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 감가상각  메뉴명: 감가상각계산  액터: 개발자
   * URL: /mis/ass/ass0711/getAssetDeprList.do
   * 예상결과: 감가상각계산 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0711M /mis/ass/ass0711/getAssetDeprList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 감가상각계산 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 감가상각계산 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getAssetDeprList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0711M-no1.png`, fullPage: true });

    expect(rows.length, '감가상각계산 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 감가상각계산 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 감가상각  메뉴명: 감가상각계산  액터: 개발자
   * URL: /mis/ass/ass0711/getAssetDeprList.do
   * 예상결과: 감가상각계산 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0711M /mis/ass/ass0711/getAssetDeprList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:2] 감가상각계산 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:2] 감가상각계산 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getAssetDeprList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0711M-no2.png`, fullPage: true });

    expect(rows.length, '감가상각계산 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0810M — 물품출고요청 현황  |  API: POST /mis/ass/ass0810/getList.do  |  TC 6건
// TODO(menuId): ass_0810M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0810/getList.do';
  const PGM_ID            = 'ass_0810M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'GDS_RQST_STAT', 'RQST_EMP_NO', 'RQST_EMP_NM', 'RQST_DEPT_CD', 'RQST_DEPT_NM', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'APV_STAT_CD', 'CONF_YN', 'ROLE_YN', 'DEPT_CHIF_YN', 'OUT_MNG_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`물품출고요청 현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 물품출고요청 현황 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 물품출고요청 현황  액터: 개발자
   * URL: /mis/ass/ass0810/getList.do
   * 예상결과: 물품출고요청 현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0810M /mis/ass/ass0810/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 물품출고요청 현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 물품출고요청 현황 - 전체 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0810M-no1.png`, fullPage: true });

    expect(rows.length, '물품출고요청 현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 물품출고요청 현황 - 기간 조회 (SCH_RQST_SDT~SCH_RQST_EDT)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 물품출고요청 현황  액터: 개발자
   * URL: /mis/ass/ass0810/getList.do
   * 예상결과: 물품출고요청 현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0810M /mis/ass/ass0810/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_RQST_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 물품출고요청 현황 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 물품출고요청 현황 - 기간 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260101, SCH_RQST_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260101', SCH_RQST_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0810M-no2.png`, fullPage: true });

    expect(rows.length, '물품출고요청 현황 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 물품출고요청 현황 - 역방향 날짜 조회 (SCH_RQST_SDT > SCH_RQST_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 물품출고요청 현황  액터: 개발자
   * URL: /mis/ass/ass0810/getList.do
   * 예상결과: 물품출고요청 현황 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0810M /mis/ass/ass0810/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_RQST_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 물품출고요청 현황 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 물품출고요청 현황 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260705, SCH_RQST_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260705', SCH_RQST_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0810M-no3.png`, fullPage: true });

    expect(rows.length, '물품출고요청 현황 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 물품출고요청 현황 - 상태코드 필터 (APV_STAT_CD, 대표값 — 실제 코드값 확인 필요)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 물품출고요청 현황  액터: 개발자
   * URL: /mis/ass/ass0810/getList.do
   * 예상결과: 물품출고요청 현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0810M /mis/ass/ass0810/getList.do 대상 테이블 확인 * / DUAL WHERE APV_STAT_CD = :APV_STAT_CD
   */
  test('[no:4] 물품출고요청 현황 - 상태코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 물품출고요청 현황 - 상태코드 필터');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, APV_STAT_CD=');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', APV_STAT_CD: '' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0810M-no4.png`, fullPage: true });

    expect(rows.length, '물품출고요청 현황 상태코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 물품출고요청 현황 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 물품출고요청 현황  액터: 개발자
   * URL: /mis/ass/ass0810/getList.do
   * 예상결과: 물품출고요청 현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0810M /mis/ass/ass0810/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:5] 물품출고요청 현황 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 물품출고요청 현황 - 키워드 검색');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0810M-no5.png`, fullPage: true });

    expect(rows.length, '물품출고요청 현황 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 물품출고요청 현황 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 물품출고요청 현황  액터: 개발자
   * URL: /mis/ass/ass0810/getList.do
   * 예상결과: 물품출고요청 현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0810M /mis/ass/ass0810/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:6] 물품출고요청 현황 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] 물품출고요청 현황 - 담당자 권한 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, ROLE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0810M-no6.png`, fullPage: true });

    expect(rows.length, '물품출고요청 현황 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0811M — 물품출고요청서  |  API: POST /mis/ass/ass0811/getData.do  |  TC 1건
// TODO(menuId): ass_0811M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0811/getData.do';
  const PGM_ID            = 'ass_0811M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SPPLS_RQST_NO', 'ROLE_YN', 'APV_STAT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`물품출고요청서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 물품출고요청서 - 상세 조회 (getData, 키: SPPLS_RQST_NO/ROLE_YN/APV_STAT_CD)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 물품출고요청서  액터: 개발자
   * URL: /mis/ass/ass0811/getData.do
   * 예상결과: 선택한 항목의 물품출고요청서 상세정보가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0811M /mis/ass/ass0811/getData.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 물품출고요청서 - 상세 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 물품출고요청서 - 상세 조회');
    logInput('검색조건', 'SPPLS_RQST_NO=, ROLE_YN=, APV_STAT_CD=');

    const resp   = await apiPost(page, API_URL, searchBody({ SPPLS_RQST_NO: '', ROLE_YN: '', APV_STAT_CD: '' }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0811M-no1.png`, fullPage: true });

    expect(rows.length, '물품출고요청서 상세 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0820M — 출고사용내역 현황  |  API: POST /mis/ass/ass0820/getList.do  |  TC 4건
// TODO(menuId): ass_0820M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0820/getList.do';
  const PGM_ID            = 'ass_0820M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['RQST_CLS', 'SCH_SRCH_DT', 'SCH_OUT_SDT', 'SCH_OUT_EDT', 'SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'RQST_DEPT_CD', 'RQST_DEPT_NM', 'DEPT_CD', 'DEPT_NM', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'RQST_EMP_NM', 'RQST_EMP_NO', 'WRHS_NM', 'WRHS_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`출고사용내역 현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 출고사용내역 현황 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 출고사용내역 현황  액터: 개발자
   * URL: /mis/ass/ass0820/getList.do
   * 예상결과: 출고사용내역 현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0820M /mis/ass/ass0820/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 출고사용내역 현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 출고사용내역 현황 - 전체 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0820M-no1.png`, fullPage: true });

    expect(rows.length, '출고사용내역 현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 출고사용내역 현황 - 기간 조회 (SCH_SRCH_SDT~SCH_SRCH_EDT)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 출고사용내역 현황  액터: 개발자
   * URL: /mis/ass/ass0820/getList.do
   * 예상결과: 출고사용내역 현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0820M /mis/ass/ass0820/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 출고사용내역 현황 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 출고사용내역 현황 - 기간 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260101, SCH_SRCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260101', SCH_SRCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0820M-no2.png`, fullPage: true });

    expect(rows.length, '출고사용내역 현황 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 출고사용내역 현황 - 역방향 날짜 조회 (SCH_SRCH_SDT > SCH_SRCH_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 출고사용내역 현황  액터: 개발자
   * URL: /mis/ass/ass0820/getList.do
   * 예상결과: 출고사용내역 현황 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0820M /mis/ass/ass0820/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 출고사용내역 현황 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 출고사용내역 현황 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260705, SCH_SRCH_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260705', SCH_SRCH_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0820M-no3.png`, fullPage: true });

    expect(rows.length, '출고사용내역 현황 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 출고사용내역 현황 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 출고사용내역 현황  액터: 개발자
   * URL: /mis/ass/ass0820/getList.do
   * 예상결과: 출고사용내역 현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0820M /mis/ass/ass0820/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:4] 출고사용내역 현황 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:4] 출고사용내역 현황 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0820M-no4.png`, fullPage: true });

    expect(rows.length, '출고사용내역 현황 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0821M — 출고사용내역 등록  |  API: POST /mis/ass/ass0821/getList.do  |  TC 5건
// TODO(menuId): ass_0821M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0821/getList.do';
  const PGM_ID            = 'ass_0821M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['RQST_CLS', 'SCH_SRCH_DT', 'SCH_OUT_SDT', 'SCH_OUT_EDT', 'SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'RQST_DEPT_CD', 'RQST_DEPT_NM', 'DEPT_CD', 'DEPT_NM', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'RQST_EMP_NM', 'RQST_EMP_NO', 'ROLE_YN', 'DEPT_CHIF_YN', 'REF_RQST_NO', 'REF_RQST_SEQ', 'WRHS_NM', 'WRHS_CD', 'UPT_DT'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`출고사용내역 등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 출고사용내역 등록 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 출고사용내역 등록  액터: 개발자
   * URL: /mis/ass/ass0821/getList.do
   * 예상결과: 출고사용내역 등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0821M /mis/ass/ass0821/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 출고사용내역 등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 출고사용내역 등록 - 전체 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0821M-no1.png`, fullPage: true });

    expect(rows.length, '출고사용내역 등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 출고사용내역 등록 - 기간 조회 (SCH_SRCH_SDT~SCH_SRCH_EDT)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 출고사용내역 등록  액터: 개발자
   * URL: /mis/ass/ass0821/getList.do
   * 예상결과: 출고사용내역 등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0821M /mis/ass/ass0821/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 출고사용내역 등록 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 출고사용내역 등록 - 기간 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260101, SCH_SRCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260101', SCH_SRCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0821M-no2.png`, fullPage: true });

    expect(rows.length, '출고사용내역 등록 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 출고사용내역 등록 - 역방향 날짜 조회 (SCH_SRCH_SDT > SCH_SRCH_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 출고사용내역 등록  액터: 개발자
   * URL: /mis/ass/ass0821/getList.do
   * 예상결과: 출고사용내역 등록 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0821M /mis/ass/ass0821/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 출고사용내역 등록 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 출고사용내역 등록 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260705, SCH_SRCH_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260705', SCH_SRCH_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0821M-no3.png`, fullPage: true });

    expect(rows.length, '출고사용내역 등록 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 출고사용내역 등록 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 출고사용내역 등록  액터: 개발자
   * URL: /mis/ass/ass0821/getList.do
   * 예상결과: 출고사용내역 등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0821M /mis/ass/ass0821/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:4] 출고사용내역 등록 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:4] 출고사용내역 등록 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0821M-no4.png`, fullPage: true });

    expect(rows.length, '출고사용내역 등록 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 출고사용내역 등록 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 물품출고  메뉴명: 출고사용내역 등록  액터: 개발자
   * URL: /mis/ass/ass0821/getList.do
   * 예상결과: 출고사용내역 등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0821M /mis/ass/ass0821/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:5] 출고사용내역 등록 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 출고사용내역 등록 - 담당자 권한 조회');
    logInput('검색조건', 'SCH_SRCH_SDT=20260401, SCH_SRCH_EDT=20260705, ROLE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_SDT: '20260401', SCH_SRCH_EDT: '20260705', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0821M-no5.png`, fullPage: true });

    expect(rows.length, '출고사용내역 등록 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0901M — 자산분류코드  |  API: POST /mis/ass/ass0901/getAstAssetClsList.do  |  TC 3건
// TODO(menuId): ass_0901M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0901/getAstAssetClsList.do';
  const PGM_ID            = 'ass_0901M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_USE_YN', 'AST_CLS_CD', 'CORP_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자산분류코드(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자산분류코드 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 자산분류코드  액터: 개발자
   * URL: /mis/ass/ass0901/getAstAssetClsList.do
   * 예상결과: 자산분류코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0901M /mis/ass/ass0901/getAstAssetClsList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 자산분류코드 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산분류코드 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getAstAssetClsList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0901M-no1.png`, fullPage: true });

    expect(rows.length, '자산분류코드 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 자산분류코드 - 사용여부 필터 (SCH_USE_YN=Y)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 자산분류코드  액터: 개발자
   * URL: /mis/ass/ass0901/getAstAssetClsList.do
   * 예상결과: 자산분류코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0901M /mis/ass/ass0901/getAstAssetClsList.do 대상 테이블 확인 * / DUAL WHERE SCH_USE_YN = 'Y'
   */
  test('[no:2] 자산분류코드 - 사용여부 필터', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자산분류코드 - 사용여부 필터');
    logInput('검색조건', 'SCH_USE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getAstAssetClsList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0901M-no2.png`, fullPage: true });

    expect(rows.length, '자산분류코드 사용여부 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 자산분류코드 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 자산분류코드  액터: 개발자
   * URL: /mis/ass/ass0901/getAstAssetClsList.do
   * 예상결과: 자산분류코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0901M /mis/ass/ass0901/getAstAssetClsList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:3] 자산분류코드 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:3] 자산분류코드 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getAstAssetClsList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0901M-no3.png`, fullPage: true });

    expect(rows.length, '자산분류코드 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0902M — 관리위치코드  |  API: POST /mis/ass/ass0902/getList.do  |  TC 3건
// TODO(menuId): ass_0902M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0902/getList.do';
  const PGM_ID            = 'ass_0902M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'USE_YN', 'PLACE_CD', 'WRHS_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`관리위치코드(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 관리위치코드 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 관리위치코드  액터: 개발자
   * URL: /mis/ass/ass0902/getList.do
   * 예상결과: 관리위치코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0902M /mis/ass/ass0902/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 관리위치코드 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 관리위치코드 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0902M-no1.png`, fullPage: true });

    expect(rows.length, '관리위치코드 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 관리위치코드 - 사용여부 필터 (USE_YN=Y)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 관리위치코드  액터: 개발자
   * URL: /mis/ass/ass0902/getList.do
   * 예상결과: 관리위치코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0902M /mis/ass/ass0902/getList.do 대상 테이블 확인 * / DUAL WHERE USE_YN = 'Y'
   */
  test('[no:2] 관리위치코드 - 사용여부 필터', async ({ workerPage: page }) => {
    logTestStart('[no:2] 관리위치코드 - 사용여부 필터');
    logInput('검색조건', 'USE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0902M-no2.png`, fullPage: true });

    expect(rows.length, '관리위치코드 사용여부 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 관리위치코드 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 관리위치코드  액터: 개발자
   * URL: /mis/ass/ass0902/getList.do
   * 예상결과: 관리위치코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0902M /mis/ass/ass0902/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:3] 관리위치코드 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:3] 관리위치코드 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0902M-no3.png`, fullPage: true });

    expect(rows.length, '관리위치코드 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0903M — 창고코드 관리  |  API: POST /mis/ass/ass0903/getListAssetWrhs.do  |  TC 3건
// TODO(menuId): ass_0903M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0903/getListAssetWrhs.do';
  const PGM_ID            = 'ass_0903M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_USE_YN', 'WRHS_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`창고코드 관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 창고코드 관리 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 창고코드 관리  액터: 개발자
   * URL: /mis/ass/ass0903/getListAssetWrhs.do
   * 예상결과: 창고코드 관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0903M /mis/ass/ass0903/getListAssetWrhs.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 창고코드 관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 창고코드 관리 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getListAssetWrhs.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0903M-no1.png`, fullPage: true });

    expect(rows.length, '창고코드 관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 창고코드 관리 - 사용여부 필터 (SCH_USE_YN=Y)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 창고코드 관리  액터: 개발자
   * URL: /mis/ass/ass0903/getListAssetWrhs.do
   * 예상결과: 창고코드 관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0903M /mis/ass/ass0903/getListAssetWrhs.do 대상 테이블 확인 * / DUAL WHERE SCH_USE_YN = 'Y'
   */
  test('[no:2] 창고코드 관리 - 사용여부 필터', async ({ workerPage: page }) => {
    logTestStart('[no:2] 창고코드 관리 - 사용여부 필터');
    logInput('검색조건', 'SCH_USE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getListAssetWrhs.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0903M-no2.png`, fullPage: true });

    expect(rows.length, '창고코드 관리 사용여부 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 창고코드 관리 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 창고코드 관리  액터: 개발자
   * URL: /mis/ass/ass0903/getListAssetWrhs.do
   * 예상결과: 창고코드 관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0903M /mis/ass/ass0903/getListAssetWrhs.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:3] 창고코드 관리 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:3] 창고코드 관리 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getListAssetWrhs.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0903M-no3.png`, fullPage: true });

    expect(rows.length, '창고코드 관리 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0904M — 자재코드  |  API: POST /mis/ass/ass0904/getAssSpplsList.do  |  TC 3건
// TODO(menuId): ass_0904M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0904/getAssSpplsList.do';
  const PGM_ID            = 'ass_0904M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_USE_YN', 'SPPLS_CD', 'CORP_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자재코드(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자재코드 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 자재코드  액터: 개발자
   * URL: /mis/ass/ass0904/getAssSpplsList.do
   * 예상결과: 자재코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0904M /mis/ass/ass0904/getAssSpplsList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 자재코드 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자재코드 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getAssSpplsList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0904M-no1.png`, fullPage: true });

    expect(rows.length, '자재코드 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 자재코드 - 사용여부 필터 (SCH_USE_YN=Y)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 자재코드  액터: 개발자
   * URL: /mis/ass/ass0904/getAssSpplsList.do
   * 예상결과: 자재코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0904M /mis/ass/ass0904/getAssSpplsList.do 대상 테이블 확인 * / DUAL WHERE SCH_USE_YN = 'Y'
   */
  test('[no:2] 자재코드 - 사용여부 필터', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자재코드 - 사용여부 필터');
    logInput('검색조건', 'SCH_USE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getAssSpplsList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0904M-no2.png`, fullPage: true });

    expect(rows.length, '자재코드 사용여부 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 자재코드 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 자재코드  액터: 개발자
   * URL: /mis/ass/ass0904/getAssSpplsList.do
   * 예상결과: 자재코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0904M /mis/ass/ass0904/getAssSpplsList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:3] 자재코드 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:3] 자재코드 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getAssSpplsList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0904M-no3.png`, fullPage: true });

    expect(rows.length, '자재코드 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0905M — 자재기초코드  |  API: POST /mis/ass/ass0905/getList.do  |  TC 3건
// TODO(menuId): ass_0905M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0905/getList.do';
  const PGM_ID            = 'ass_0905M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['CORP_CD', 'BUSI_PLC_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'USE_YN', 'MTRL_CLS_MNG_CD', 'MTRL_CLS_MNG_CD2', 'MTRL_CLS_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`자재기초코드(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 자재기초코드 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 자재기초코드  액터: 개발자
   * URL: /mis/ass/ass0905/getList.do
   * 예상결과: 자재기초코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0905M /mis/ass/ass0905/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 자재기초코드 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자재기초코드 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0905M-no1.png`, fullPage: true });

    expect(rows.length, '자재기초코드 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 자재기초코드 - 사용여부 필터 (USE_YN=Y)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 자재기초코드  액터: 개발자
   * URL: /mis/ass/ass0905/getList.do
   * 예상결과: 자재기초코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0905M /mis/ass/ass0905/getList.do 대상 테이블 확인 * / DUAL WHERE USE_YN = 'Y'
   */
  test('[no:2] 자재기초코드 - 사용여부 필터', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자재기초코드 - 사용여부 필터');
    logInput('검색조건', 'USE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0905M-no2.png`, fullPage: true });

    expect(rows.length, '자재기초코드 사용여부 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 자재기초코드 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 자재기초코드  액터: 개발자
   * URL: /mis/ass/ass0905/getList.do
   * 예상결과: 자재기초코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0905M /mis/ass/ass0905/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:3] 자재기초코드 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:3] 자재기초코드 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0905M-no3.png`, fullPage: true });

    expect(rows.length, '자재기초코드 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0907M — 창고물품코드  |  API: POST /mis/ass/ass0907/getAssSpplsList.do  |  TC 3건
// TODO(menuId): ass_0907M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0907/getAssSpplsList.do';
  const PGM_ID            = 'ass_0907M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_USE_YN', 'SPPLS_CD', 'CORP_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`창고물품코드(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 창고물품코드 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 창고물품코드  액터: 개발자
   * URL: /mis/ass/ass0907/getAssSpplsList.do
   * 예상결과: 창고물품코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0907M /mis/ass/ass0907/getAssSpplsList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 창고물품코드 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 창고물품코드 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getAssSpplsList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0907M-no1.png`, fullPage: true });

    expect(rows.length, '창고물품코드 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 창고물품코드 - 사용여부 필터 (SCH_USE_YN=Y)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 창고물품코드  액터: 개발자
   * URL: /mis/ass/ass0907/getAssSpplsList.do
   * 예상결과: 창고물품코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0907M /mis/ass/ass0907/getAssSpplsList.do 대상 테이블 확인 * / DUAL WHERE SCH_USE_YN = 'Y'
   */
  test('[no:2] 창고물품코드 - 사용여부 필터', async ({ workerPage: page }) => {
    logTestStart('[no:2] 창고물품코드 - 사용여부 필터');
    logInput('검색조건', 'SCH_USE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getAssSpplsList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0907M-no2.png`, fullPage: true });

    expect(rows.length, '창고물품코드 사용여부 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 창고물품코드 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 창고물품코드  액터: 개발자
   * URL: /mis/ass/ass0907/getAssSpplsList.do
   * 예상결과: 창고물품코드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0907M /mis/ass/ass0907/getAssSpplsList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:3] 창고물품코드 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:3] 창고물품코드 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getAssSpplsList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0907M-no3.png`, fullPage: true });

    expect(rows.length, '창고물품코드 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0908M — 보관소코드 관리  |  API: POST /mis/ass/ass0908/getListAssetWrhs.do  |  TC 3건
// TODO(menuId): ass_0908M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0908/getListAssetWrhs.do';
  const PGM_ID            = 'ass_0908M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_USE_YN', 'WRHS_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`보관소코드 관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 보관소코드 관리 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 보관소코드 관리  액터: 개발자
   * URL: /mis/ass/ass0908/getListAssetWrhs.do
   * 예상결과: 보관소코드 관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0908M /mis/ass/ass0908/getListAssetWrhs.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 보관소코드 관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 보관소코드 관리 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getListAssetWrhs.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0908M-no1.png`, fullPage: true });

    expect(rows.length, '보관소코드 관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 보관소코드 관리 - 사용여부 필터 (SCH_USE_YN=Y)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 보관소코드 관리  액터: 개발자
   * URL: /mis/ass/ass0908/getListAssetWrhs.do
   * 예상결과: 보관소코드 관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0908M /mis/ass/ass0908/getListAssetWrhs.do 대상 테이블 확인 * / DUAL WHERE SCH_USE_YN = 'Y'
   */
  test('[no:2] 보관소코드 관리 - 사용여부 필터', async ({ workerPage: page }) => {
    logTestStart('[no:2] 보관소코드 관리 - 사용여부 필터');
    logInput('검색조건', 'SCH_USE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getListAssetWrhs.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0908M-no2.png`, fullPage: true });

    expect(rows.length, '보관소코드 관리 사용여부 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 보관소코드 관리 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 보관소코드 관리  액터: 개발자
   * URL: /mis/ass/ass0908/getListAssetWrhs.do
   * 예상결과: 보관소코드 관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0908M /mis/ass/ass0908/getListAssetWrhs.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:3] 보관소코드 관리 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:3] 보관소코드 관리 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getListAssetWrhs.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0908M-no3.png`, fullPage: true });

    expect(rows.length, '보관소코드 관리 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0909M — 귀금속코드관리  |  API: POST /mis/ass/ass0909/getAssSpplsList.do  |  TC 3건
// TODO(menuId): ass_0909M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0909/getAssSpplsList.do';
  const PGM_ID            = 'ass_0909M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_USE_YN', 'SPPLS_CD', 'CORP_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`귀금속코드관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 귀금속코드관리 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 귀금속코드관리  액터: 개발자
   * URL: /mis/ass/ass0909/getAssSpplsList.do
   * 예상결과: 귀금속코드관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0909M /mis/ass/ass0909/getAssSpplsList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 귀금속코드관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 귀금속코드관리 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getAssSpplsList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0909M-no1.png`, fullPage: true });

    expect(rows.length, '귀금속코드관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 귀금속코드관리 - 사용여부 필터 (SCH_USE_YN=Y)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 귀금속코드관리  액터: 개발자
   * URL: /mis/ass/ass0909/getAssSpplsList.do
   * 예상결과: 귀금속코드관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0909M /mis/ass/ass0909/getAssSpplsList.do 대상 테이블 확인 * / DUAL WHERE SCH_USE_YN = 'Y'
   */
  test('[no:2] 귀금속코드관리 - 사용여부 필터', async ({ workerPage: page }) => {
    logTestStart('[no:2] 귀금속코드관리 - 사용여부 필터');
    logInput('검색조건', 'SCH_USE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getAssSpplsList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0909M-no2.png`, fullPage: true });

    expect(rows.length, '귀금속코드관리 사용여부 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 귀금속코드관리 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 귀금속코드관리  액터: 개발자
   * URL: /mis/ass/ass0909/getAssSpplsList.do
   * 예상결과: 귀금속코드관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0909M /mis/ass/ass0909/getAssSpplsList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:3] 귀금속코드관리 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:3] 귀금속코드관리 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getAssSpplsList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0909M-no3.png`, fullPage: true });

    expect(rows.length, '귀금속코드관리 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0910M — 귀금속장비관리  |  API: POST /mis/ass/ass0910/getList.do  |  TC 5건
// TODO(menuId): ass_0910M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0910/getList.do';
  const PGM_ID            = 'ass_0910M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['ACQ_SDT', 'ACQ_EDT', 'DEPT_CD', 'DEPT_NM', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'AST_CLS_CD', 'AST_CLS_NM', 'DELETE_FLAG', 'AST_STAT', 'EQM_YN', 'ZEUS_YN', 'AST_YN', 'EQUIP_ID', 'EQUIP_DESC'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`귀금속장비관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 귀금속장비관리 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 귀금속장비관리  액터: 개발자
   * URL: /mis/ass/ass0910/getList.do
   * 예상결과: 귀금속장비관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0910M /mis/ass/ass0910/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 귀금속장비관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 귀금속장비관리 - 전체 조회');
    logInput('검색조건', 'ACQ_SDT=20260401, ACQ_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ ACQ_SDT: '20260401', ACQ_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0910M-no1.png`, fullPage: true });

    expect(rows.length, '귀금속장비관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 귀금속장비관리 - 기간 조회 (ACQ_SDT~ACQ_EDT)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 귀금속장비관리  액터: 개발자
   * URL: /mis/ass/ass0910/getList.do
   * 예상결과: 귀금속장비관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0910M /mis/ass/ass0910/getList.do 대상 테이블 확인 * / DUAL WHERE ACQ_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 귀금속장비관리 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 귀금속장비관리 - 기간 조회');
    logInput('검색조건', 'ACQ_SDT=20260101, ACQ_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ ACQ_SDT: '20260101', ACQ_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0910M-no2.png`, fullPage: true });

    expect(rows.length, '귀금속장비관리 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 귀금속장비관리 - 역방향 날짜 조회 (ACQ_SDT > ACQ_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 귀금속장비관리  액터: 개발자
   * URL: /mis/ass/ass0910/getList.do
   * 예상결과: 귀금속장비관리 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0910M /mis/ass/ass0910/getList.do 대상 테이블 확인 * / DUAL WHERE ACQ_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 귀금속장비관리 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 귀금속장비관리 - 역방향 날짜 조회');
    logInput('검색조건', 'ACQ_SDT=20260705, ACQ_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ ACQ_SDT: '20260705', ACQ_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0910M-no3.png`, fullPage: true });

    expect(rows.length, '귀금속장비관리 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 귀금속장비관리 - 상태코드 필터 (AST_STAT, 대표값 — 실제 코드값 확인 필요)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 귀금속장비관리  액터: 개발자
   * URL: /mis/ass/ass0910/getList.do
   * 예상결과: 귀금속장비관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0910M /mis/ass/ass0910/getList.do 대상 테이블 확인 * / DUAL WHERE AST_STAT = :AST_STAT
   */
  test('[no:4] 귀금속장비관리 - 상태코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 귀금속장비관리 - 상태코드 필터');
    logInput('검색조건', 'ACQ_SDT=20260401, ACQ_EDT=20260705, AST_STAT=');

    const resp   = await apiPost(page, API_URL, searchBody({ ACQ_SDT: '20260401', ACQ_EDT: '20260705', AST_STAT: '' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0910M-no4.png`, fullPage: true });

    expect(rows.length, '귀금속장비관리 상태코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 귀금속장비관리 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 귀금속장비관리  액터: 개발자
   * URL: /mis/ass/ass0910/getList.do
   * 예상결과: 귀금속장비관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0910M /mis/ass/ass0910/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:5] 귀금속장비관리 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 귀금속장비관리 - 키워드 검색');
    logInput('검색조건', 'ACQ_SDT=20260401, ACQ_EDT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ ACQ_SDT: '20260401', ACQ_EDT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0910M-no5.png`, fullPage: true });

    expect(rows.length, '귀금속장비관리 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_0911M — 장비별귀금속관리  |  API: POST /mis/ass/ass0911/getList.do  |  TC 3건
// TODO(menuId): ass_0911M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass0911/getList.do';
  const PGM_ID            = 'ass_0911M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_EQM_SRCH_CLS', 'SCH_EQM_SRCH_KEY', 'SCH_METL_SRCH_CLS', 'SCH_METL_SRCH_KEY', 'SCH_USE_YN', 'SPPLS_CD', 'CORP_CD', 'AST_MNG_CD', 'SCH_SPPLS_USE_YN', 'SCH_EQM_USE_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`장비별귀금속관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 장비별귀금속관리 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 장비별귀금속관리  액터: 개발자
   * URL: /mis/ass/ass0911/getList.do
   * 예상결과: 장비별귀금속관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0911M /mis/ass/ass0911/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 장비별귀금속관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 장비별귀금속관리 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_main');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0911M-no1.png`, fullPage: true });

    expect(rows.length, '장비별귀금속관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 장비별귀금속관리 - 사용여부 필터 (SCH_USE_YN=Y)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 장비별귀금속관리  액터: 개발자
   * URL: /mis/ass/ass0911/getList.do
   * 예상결과: 장비별귀금속관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0911M /mis/ass/ass0911/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_USE_YN = 'Y'
   */
  test('[no:2] 장비별귀금속관리 - 사용여부 필터', async ({ workerPage: page }) => {
    logTestStart('[no:2] 장비별귀금속관리 - 사용여부 필터');
    logInput('검색조건', 'SCH_USE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_main');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0911M-no2.png`, fullPage: true });

    expect(rows.length, '장비별귀금속관리 사용여부 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 장비별귀금속관리 - 키워드 검색 (SCH_EQM_SRCH_KEY)
   * 중분류: 자산관리  소분류: 기준정보  메뉴명: 장비별귀금속관리  액터: 개발자
   * URL: /mis/ass/ass0911/getList.do
   * 예상결과: 장비별귀금속관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_0911M /mis/ass/ass0911/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_EQM_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:3] 장비별귀금속관리 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:3] 장비별귀금속관리 - 키워드 검색');
    logInput('검색조건', 'SCH_EQM_SRCH_CLS=, SCH_EQM_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_EQM_SRCH_CLS: '', SCH_EQM_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_main');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_0911M-no3.png`, fullPage: true });

    expect(rows.length, '장비별귀금속관리 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1010M — 입고현황  |  API: POST /mis/ass/ass1010/getSpplsInList.do  |  TC 4건
// TODO(menuId): ass_1010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass1010/getSpplsInList.do';
  const PGM_ID            = 'ass_1010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_SDT', 'SCH_EDT', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'WRHS_NM', 'WRHS_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`입고현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 입고현황 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 입고현황  액터: 개발자
   * URL: /mis/ass/ass1010/getSpplsInList.do
   * 예상결과: 입고현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1010M /mis/ass/ass1010/getSpplsInList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 입고현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 입고현황 - 전체 조회');
    logInput('검색조건', 'SCH_SDT=20260401, SCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SDT: '20260401', SCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getSpplsInList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1010M-no1.png`, fullPage: true });

    expect(rows.length, '입고현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 입고현황 - 기간 조회 (SCH_SDT~SCH_EDT)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 입고현황  액터: 개발자
   * URL: /mis/ass/ass1010/getSpplsInList.do
   * 예상결과: 입고현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1010M /mis/ass/ass1010/getSpplsInList.do 대상 테이블 확인 * / DUAL WHERE SCH_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 입고현황 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 입고현황 - 기간 조회');
    logInput('검색조건', 'SCH_SDT=20260101, SCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SDT: '20260101', SCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getSpplsInList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1010M-no2.png`, fullPage: true });

    expect(rows.length, '입고현황 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 입고현황 - 역방향 날짜 조회 (SCH_SDT > SCH_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 입고현황  액터: 개발자
   * URL: /mis/ass/ass1010/getSpplsInList.do
   * 예상결과: 입고현황 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1010M /mis/ass/ass1010/getSpplsInList.do 대상 테이블 확인 * / DUAL WHERE SCH_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 입고현황 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 입고현황 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_SDT=20260705, SCH_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SDT: '20260705', SCH_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getSpplsInList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1010M-no3.png`, fullPage: true });

    expect(rows.length, '입고현황 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 입고현황 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 입고현황  액터: 개발자
   * URL: /mis/ass/ass1010/getSpplsInList.do
   * 예상결과: 입고현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1010M /mis/ass/ass1010/getSpplsInList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:4] 입고현황 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:4] 입고현황 - 키워드 검색');
    logInput('검색조건', 'SCH_SDT=20260401, SCH_EDT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SDT: '20260401', SCH_EDT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getSpplsInList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1010M-no4.png`, fullPage: true });

    expect(rows.length, '입고현황 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1011M — 입고등록  |  API: POST /mis/ass/ass1011/getSpplsIn.do  |  TC 1건
// TODO(menuId): ass_1011M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass1011/getSpplsIn.do';
  const PGM_ID            = 'ass_1011M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['IN_DT', 'IN_SEQ'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`입고등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 입고등록 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 입고등록  액터: 개발자
   * URL: /mis/ass/ass1011/getSpplsIn.do
   * 예상결과: 입고등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1011M /mis/ass/ass1011/getSpplsIn.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 입고등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 입고등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getSpplsIn.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1011M-no1.png`, fullPage: true });

    expect(rows.length, '입고등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1012M — 귀금속입고현황  |  API: POST /mis/ass/ass1012/getSpplsInList.do  |  TC 3건
// TODO(menuId): ass_1012M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass1012/getSpplsInList.do';
  const PGM_ID            = 'ass_1012M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['IN_FRM_DT', 'IN_TO_DT', 'RQST_FRM_DT', 'RQST_TO_DT', 'SCH_EQM_CLS', 'SCH_EQM_KEY', 'SCH_METL_CLS', 'SCH_METL_KEY', 'WRHS_NM', 'WRHS_CD', 'SCH_IN_DIV', 'SCH_DT_CLS', 'SCH_SDT', 'SCH_EDT', 'SCH_RQST_DEPT_CD', 'SCH_RQST_DEPT_NM', 'SCH_RQST_EMP_NO', 'SCH_RQST_EMP_NM', 'SCH_CUST_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`귀금속입고현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 귀금속입고현황 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속입고현황  액터: 개발자
   * URL: /mis/ass/ass1012/getSpplsInList.do
   * 예상결과: 귀금속입고현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1012M /mis/ass/ass1012/getSpplsInList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 귀금속입고현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 귀금속입고현황 - 전체 조회');
    logInput('검색조건', 'SCH_SDT=20260401, SCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SDT: '20260401', SCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getSpplsInList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1012M-no1.png`, fullPage: true });

    expect(rows.length, '귀금속입고현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 귀금속입고현황 - 기간 조회 (SCH_SDT~SCH_EDT)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속입고현황  액터: 개발자
   * URL: /mis/ass/ass1012/getSpplsInList.do
   * 예상결과: 귀금속입고현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1012M /mis/ass/ass1012/getSpplsInList.do 대상 테이블 확인 * / DUAL WHERE SCH_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 귀금속입고현황 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 귀금속입고현황 - 기간 조회');
    logInput('검색조건', 'SCH_SDT=20260101, SCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SDT: '20260101', SCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getSpplsInList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1012M-no2.png`, fullPage: true });

    expect(rows.length, '귀금속입고현황 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 귀금속입고현황 - 역방향 날짜 조회 (SCH_SDT > SCH_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속입고현황  액터: 개발자
   * URL: /mis/ass/ass1012/getSpplsInList.do
   * 예상결과: 귀금속입고현황 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1012M /mis/ass/ass1012/getSpplsInList.do 대상 테이블 확인 * / DUAL WHERE SCH_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 귀금속입고현황 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 귀금속입고현황 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_SDT=20260705, SCH_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SDT: '20260705', SCH_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getSpplsInList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1012M-no3.png`, fullPage: true });

    expect(rows.length, '귀금속입고현황 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1013M — 귀금속직접입고  |  API: POST /mis/ass/ass1013/getSpplsIn.do  |  TC 1건
// TODO(menuId): ass_1013M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass1013/getSpplsIn.do';
  const PGM_ID            = 'ass_1013M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['IN_DT', 'IN_SEQ', 'AST_MNG_CD', 'SPPLS_CD', 'RQST_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`귀금속직접입고(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 귀금속직접입고 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속직접입고  액터: 개발자
   * URL: /mis/ass/ass1013/getSpplsIn.do
   * 예상결과: 귀금속직접입고 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1013M /mis/ass/ass1013/getSpplsIn.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 귀금속직접입고 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 귀금속직접입고 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getSpplsIn.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1013M-no1.png`, fullPage: true });

    expect(rows.length, '귀금속직접입고 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1014M — 귀금속사용결과목록  |  API: POST /mis/ass/ass1014/getList.do  |  TC 6건
// TODO(menuId): ass_1014M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass1014/getList.do';
  const PGM_ID            = 'ass_1014M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'GDS_RQST_STAT', 'RQST_EMP_NO', 'RQST_EMP_NM', 'RQST_DEPT_CD', 'RQST_DEPT_NM', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'APV_STAT_CD', 'CONF_YN', 'ROLE_YN', 'DEPT_CHIF_YN', 'OUT_MNG_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`귀금속사용결과목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 귀금속사용결과목록 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속사용결과목록  액터: 개발자
   * URL: /mis/ass/ass1014/getList.do
   * 예상결과: 귀금속사용결과목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1014M /mis/ass/ass1014/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 귀금속사용결과목록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 귀금속사용결과목록 - 전체 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1014M-no1.png`, fullPage: true });

    expect(rows.length, '귀금속사용결과목록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 귀금속사용결과목록 - 기간 조회 (SCH_RQST_SDT~SCH_RQST_EDT)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속사용결과목록  액터: 개발자
   * URL: /mis/ass/ass1014/getList.do
   * 예상결과: 귀금속사용결과목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1014M /mis/ass/ass1014/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_RQST_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 귀금속사용결과목록 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 귀금속사용결과목록 - 기간 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260101, SCH_RQST_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260101', SCH_RQST_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1014M-no2.png`, fullPage: true });

    expect(rows.length, '귀금속사용결과목록 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 귀금속사용결과목록 - 역방향 날짜 조회 (SCH_RQST_SDT > SCH_RQST_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속사용결과목록  액터: 개발자
   * URL: /mis/ass/ass1014/getList.do
   * 예상결과: 귀금속사용결과목록 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1014M /mis/ass/ass1014/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_RQST_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 귀금속사용결과목록 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 귀금속사용결과목록 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260705, SCH_RQST_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260705', SCH_RQST_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1014M-no3.png`, fullPage: true });

    expect(rows.length, '귀금속사용결과목록 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 귀금속사용결과목록 - 상태코드 필터 (APV_STAT_CD, 대표값 — 실제 코드값 확인 필요)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속사용결과목록  액터: 개발자
   * URL: /mis/ass/ass1014/getList.do
   * 예상결과: 귀금속사용결과목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1014M /mis/ass/ass1014/getList.do 대상 테이블 확인 * / DUAL WHERE APV_STAT_CD = :APV_STAT_CD
   */
  test('[no:4] 귀금속사용결과목록 - 상태코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 귀금속사용결과목록 - 상태코드 필터');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, APV_STAT_CD=');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', APV_STAT_CD: '' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1014M-no4.png`, fullPage: true });

    expect(rows.length, '귀금속사용결과목록 상태코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 귀금속사용결과목록 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속사용결과목록  액터: 개발자
   * URL: /mis/ass/ass1014/getList.do
   * 예상결과: 귀금속사용결과목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1014M /mis/ass/ass1014/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:5] 귀금속사용결과목록 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 귀금속사용결과목록 - 키워드 검색');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1014M-no5.png`, fullPage: true });

    expect(rows.length, '귀금속사용결과목록 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 귀금속사용결과목록 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속사용결과목록  액터: 개발자
   * URL: /mis/ass/ass1014/getList.do
   * 예상결과: 귀금속사용결과목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1014M /mis/ass/ass1014/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:6] 귀금속사용결과목록 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] 귀금속사용결과목록 - 담당자 권한 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, ROLE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1014M-no6.png`, fullPage: true });

    expect(rows.length, '귀금속사용결과목록 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1015M — 귀금속사용결과보고서  |  API: POST /mis/ass/ass1015/getData.do  |  TC 1건
// TODO(menuId): ass_1015M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass1015/getData.do';
  const PGM_ID            = 'ass_1015M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['RQST_NO', 'ROLE_YN', 'APV_STAT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`귀금속사용결과보고서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 귀금속사용결과보고서 - 상세 조회 (getData, 키: RQST_NO/ROLE_YN/APV_STAT_CD)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속사용결과보고서  액터: 개발자
   * URL: /mis/ass/ass1015/getData.do
   * 예상결과: 선택한 항목의 귀금속사용결과보고서 상세정보가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1015M /mis/ass/ass1015/getData.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 귀금속사용결과보고서 - 상세 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 귀금속사용결과보고서 - 상세 조회');
    logInput('검색조건', 'RQST_NO=, ROLE_YN=, APV_STAT_CD=');

    const resp   = await apiPost(page, API_URL, searchBody({ RQST_NO: '', ROLE_YN: '', APV_STAT_CD: '' }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1015M-no1.png`, fullPage: true });

    expect(rows.length, '귀금속사용결과보고서 상세 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1016M — 귀금속재고현황  |  API: POST /mis/ass/ass1016/getList.do  |  TC 2건
// TODO(menuId): ass_1016M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass1016/getList.do';
  const PGM_ID            = 'ass_1016M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_YEAR', 'WRHS_CD', 'WRHS_NM', 'SPPLS_CD', 'SPPLS_REF_CD', 'SPPLS_NM', 'CRR_YEAR', 'SCH_SRCH_KEY', 'SCH_METL_CLS', 'SCH_METL_KEY', 'SCH_EQM_CLS', 'SCH_EQM_KEY', 'RQST_EMP_NO', 'RQST_EMP_NM', 'SESS_IP', 'SCH_SPPLS_USE_YN', 'SCH_EQM_USE_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`귀금속재고현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 귀금속재고현황 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속재고현황  액터: 개발자
   * URL: /mis/ass/ass1016/getList.do
   * 예상결과: 귀금속재고현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1016M /mis/ass/ass1016/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 귀금속재고현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 귀금속재고현황 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1016M-no1.png`, fullPage: true });

    expect(rows.length, '귀금속재고현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 귀금속재고현황 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속재고현황  액터: 개발자
   * URL: /mis/ass/ass1016/getList.do
   * 예상결과: 귀금속재고현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1016M /mis/ass/ass1016/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:2] 귀금속재고현황 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:2] 귀금속재고현황 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1016M-no2.png`, fullPage: true });

    expect(rows.length, '귀금속재고현황 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1017M — 귀금속출입상세현황  |  API: POST /mis/ass/ass1017/getList.do  |  TC 3건
// TODO(menuId): ass_1017M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass1017/getList.do';
  const PGM_ID            = 'ass_1017M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_SDT', 'SCH_EDT', 'SCH_DT_CLS', 'SCH_EQM_CLS', 'SCH_EQM_KEY', 'SCH_METL_CLS', 'SCH_METL_KEY', 'SCH_RQST_DEPT_NM', 'SCH_RQST_DEPT_CD', 'SCH_RQST_EMP_NM', 'SCH_RQST_EMP_NO', 'SCH_FINL_EMP_NM', 'SCH_FINL_EMP_NO', 'SCH_IO_DIV', 'SCH_USE_EMP_NO', 'SCH_USE_EMP_NM', 'SCH_USE_DEPT_CD', 'SCH_USE_DEPT_NM', 'RQST_EMP_NO', 'RQST_EMP_NM', 'SESS_IP', 'SCH_EQM_USE_YN', 'SCH_SPPLS_USE_YN'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`귀금속출입상세현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 귀금속출입상세현황 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속출입상세현황  액터: 개발자
   * URL: /mis/ass/ass1017/getList.do
   * 예상결과: 귀금속출입상세현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1017M /mis/ass/ass1017/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 귀금속출입상세현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 귀금속출입상세현황 - 전체 조회');
    logInput('검색조건', 'SCH_SDT=20260401, SCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SDT: '20260401', SCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1017M-no1.png`, fullPage: true });

    expect(rows.length, '귀금속출입상세현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 귀금속출입상세현황 - 기간 조회 (SCH_SDT~SCH_EDT)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속출입상세현황  액터: 개발자
   * URL: /mis/ass/ass1017/getList.do
   * 예상결과: 귀금속출입상세현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1017M /mis/ass/ass1017/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 귀금속출입상세현황 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 귀금속출입상세현황 - 기간 조회');
    logInput('검색조건', 'SCH_SDT=20260101, SCH_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SDT: '20260101', SCH_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1017M-no2.png`, fullPage: true });

    expect(rows.length, '귀금속출입상세현황 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 귀금속출입상세현황 - 역방향 날짜 조회 (SCH_SDT > SCH_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 귀금속출입상세현황  액터: 개발자
   * URL: /mis/ass/ass1017/getList.do
   * 예상결과: 귀금속출입상세현황 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1017M /mis/ass/ass1017/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 귀금속출입상세현황 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 귀금속출입상세현황 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_SDT=20260705, SCH_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SDT: '20260705', SCH_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1017M-no3.png`, fullPage: true });

    expect(rows.length, '귀금속출입상세현황 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1030M — 출고현황  |  API: POST /mis/ass/ass1030/getList.do  |  TC 5건
// TODO(menuId): ass_1030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass1030/getList.do';
  const PGM_ID            = 'ass_1030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'CONF_YN', 'ROLE_YN', 'DEPT_CHIF_YN', 'OUT_MNG_YN', 'WRHS_CD', 'WRHS_NM', 'SPPLS_CD', 'SPPLS_NM'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`출고현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 출고현황 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 출고현황  액터: 개발자
   * URL: /mis/ass/ass1030/getList.do
   * 예상결과: 출고현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1030M /mis/ass/ass1030/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 출고현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 출고현황 - 전체 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1030M-no1.png`, fullPage: true });

    expect(rows.length, '출고현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 출고현황 - 기간 조회 (SCH_RQST_SDT~SCH_RQST_EDT)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 출고현황  액터: 개발자
   * URL: /mis/ass/ass1030/getList.do
   * 예상결과: 출고현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1030M /mis/ass/ass1030/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_RQST_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 출고현황 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 출고현황 - 기간 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260101, SCH_RQST_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260101', SCH_RQST_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1030M-no2.png`, fullPage: true });

    expect(rows.length, '출고현황 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 출고현황 - 역방향 날짜 조회 (SCH_RQST_SDT > SCH_RQST_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 출고현황  액터: 개발자
   * URL: /mis/ass/ass1030/getList.do
   * 예상결과: 출고현황 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1030M /mis/ass/ass1030/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_RQST_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 출고현황 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 출고현황 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260705, SCH_RQST_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260705', SCH_RQST_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1030M-no3.png`, fullPage: true });

    expect(rows.length, '출고현황 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 출고현황 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 출고현황  액터: 개발자
   * URL: /mis/ass/ass1030/getList.do
   * 예상결과: 출고현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1030M /mis/ass/ass1030/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:4] 출고현황 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:4] 출고현황 - 키워드 검색');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1030M-no4.png`, fullPage: true });

    expect(rows.length, '출고현황 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 출고현황 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 출고현황  액터: 개발자
   * URL: /mis/ass/ass1030/getList.do
   * 예상결과: 출고현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1030M /mis/ass/ass1030/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:5] 출고현황 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 출고현황 - 담당자 권한 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, ROLE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1030M-no5.png`, fullPage: true });

    expect(rows.length, '출고현황 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1031M — 출고  |  API: POST /mis/ass/ass1031/getList.do  |  TC 5건
// TODO(menuId): ass_1031M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass1031/getList.do';
  const PGM_ID            = 'ass_1031M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_RQST_DEPT_CD', 'SCH_RQST_DEPT_NM', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'WRHS_NM', 'WRHS_CD', 'DEPT_NM', 'DEPT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`출고(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 출고 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 출고  액터: 개발자
   * URL: /mis/ass/ass1031/getList.do
   * 예상결과: 출고 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1031M /mis/ass/ass1031/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 출고 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 출고 - 전체 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1031M-no1.png`, fullPage: true });

    expect(rows.length, '출고 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 출고 - 기간 조회 (SCH_RQST_SDT~SCH_RQST_EDT)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 출고  액터: 개발자
   * URL: /mis/ass/ass1031/getList.do
   * 예상결과: 출고 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1031M /mis/ass/ass1031/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_RQST_SDT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 출고 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 출고 - 기간 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260101, SCH_RQST_EDT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260101', SCH_RQST_EDT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1031M-no2.png`, fullPage: true });

    expect(rows.length, '출고 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 출고 - 역방향 날짜 조회 (SCH_RQST_SDT > SCH_RQST_EDT, 0건 확인)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 출고  액터: 개발자
   * URL: /mis/ass/ass1031/getList.do
   * 예상결과: 출고 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1031M /mis/ass/ass1031/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_RQST_SDT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 출고 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 출고 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260705, SCH_RQST_EDT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260705', SCH_RQST_EDT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1031M-no3.png`, fullPage: true });

    expect(rows.length, '출고 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 출고 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 출고  액터: 개발자
   * URL: /mis/ass/ass1031/getList.do
   * 예상결과: 출고 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1031M /mis/ass/ass1031/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:4] 출고 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:4] 출고 - 키워드 검색');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, SCH_SRCH_CLS=, SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', SCH_SRCH_CLS: '', SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1031M-no4.png`, fullPage: true });

    expect(rows.length, '출고 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 출고 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 출고  액터: 개발자
   * URL: /mis/ass/ass1031/getList.do
   * 예상결과: 출고 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1031M /mis/ass/ass1031/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:5] 출고 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] 출고 - 담당자 권한 조회');
    logInput('검색조건', 'SCH_RQST_SDT=20260401, SCH_RQST_EDT=20260705, ROLE_YN=Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_RQST_SDT: '20260401', SCH_RQST_EDT: '20260705', ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1031M-no5.png`, fullPage: true });

    expect(rows.length, '출고 담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1032M — 폐기등록  |  API: POST /mis/ass/ass1032/getList.do  |  TC 1건
// TODO(menuId): ass_1032M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass1032/getList.do';
  const PGM_ID            = 'ass_1032M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['EMP_NM', 'EMP_NO', 'SCH_BRK_YN', 'SCH_YEAR'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`폐기등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 폐기등록 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 폐기등록  액터: 개발자
   * URL: /mis/ass/ass1032/getList.do
   * 예상결과: 폐기등록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1032M /mis/ass/ass1032/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 폐기등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 폐기등록 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1032M-no1.png`, fullPage: true });

    expect(rows.length, '폐기등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1040M — 재고현황  |  API: POST /mis/ass/ass1040/getList.do  |  TC 2건
// TODO(menuId): ass_1040M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass1040/getList.do';
  const PGM_ID            = 'ass_1040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_YEAR', 'WRHS_CD', 'WRHS_NM', 'SPPLS_CD', 'SPPLS_REF_CD', 'SPPLS_NM', 'CRR_YEAR', 'SCH_SRCH_KEY'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`재고현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 재고현황 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 재고현황  액터: 개발자
   * URL: /mis/ass/ass1040/getList.do
   * 예상결과: 재고현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1040M /mis/ass/ass1040/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 재고현황 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 재고현황 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1040M-no1.png`, fullPage: true });

    expect(rows.length, '재고현황 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 재고현황 - 키워드 검색 (SCH_SRCH_KEY)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 재고현황  액터: 개발자
   * URL: /mis/ass/ass1040/getList.do
   * 예상결과: 재고현황 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1040M /mis/ass/ass1040/getList.do 대상 테이블 확인 * / DUAL WHERE SCH_SRCH_KEY LIKE '%테스트%'
   */
  test('[no:2] 재고현황 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:2] 재고현황 - 키워드 검색');
    logInput('검색조건', 'SCH_SRCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1040M-no2.png`, fullPage: true });

    expect(rows.length, '재고현황 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_1050M — 재고수불부  |  API: POST /mis/ass/ass1050/getList.do  |  TC 1건
// TODO(menuId): ass_1050M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass1050/getList.do';
  const PGM_ID            = 'ass_1050M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_DT', 'SPPLS_CD', 'SPPLS_NM', 'SPPLS_REF_CD', 'G_CLS_CD', 'WRHS_NM', 'WRHS_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`재고수불부(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 재고수불부 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 자재수불  메뉴명: 재고수불부  액터: 개발자
   * URL: /mis/ass/ass1050/getList.do
   * 예상결과: 재고수불부 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_1050M /mis/ass/ass1050/getList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 재고수불부 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 재고수불부 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({  }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_1050M-no1.png`, fullPage: true });

    expect(rows.length, '재고수불부 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_2010M — 재물조사계획목록  |  API: POST /mis/ass/ass2010/getPropInvsPlanList.do  |  TC 5건
// TODO(menuId): ass_2010M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass2010/getPropInvsPlanList.do';
  const PGM_ID            = 'ass_2010M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_DT_CLS', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_RQST_DEPT_CD', 'SCH_RQST_DEPT_NM', 'SCH_RQST_EMP_NO', 'SCH_RQST_EMP_NM', 'SCH_KEY_CLS', 'SCH_KEY', 'SCH_APV_STAT_CD', 'OPEN_CLS'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`재물조사계획목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 재물조사계획목록 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 재물조사  메뉴명: 재물조사계획목록  액터: 개발자
   * URL: /mis/ass/ass2010/getPropInvsPlanList.do
   * 예상결과: 재물조사계획목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_2010M /mis/ass/ass2010/getPropInvsPlanList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 재물조사계획목록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 재물조사계획목록 - 전체 조회');
    logInput('검색조건', 'SCH_FRM_DT=20260401, SCH_TO_DT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: '20260401', SCH_TO_DT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getPropInvsPlanList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_2010M-no1.png`, fullPage: true });

    expect(rows.length, '재물조사계획목록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 재물조사계획목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)
   * 중분류: 자산관리  소분류: 재물조사  메뉴명: 재물조사계획목록  액터: 개발자
   * URL: /mis/ass/ass2010/getPropInvsPlanList.do
   * 예상결과: 재물조사계획목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_2010M /mis/ass/ass2010/getPropInvsPlanList.do 대상 테이블 확인 * / DUAL WHERE SCH_FRM_DT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 재물조사계획목록 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 재물조사계획목록 - 기간 조회');
    logInput('검색조건', 'SCH_FRM_DT=20260101, SCH_TO_DT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: '20260101', SCH_TO_DT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getPropInvsPlanList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_2010M-no2.png`, fullPage: true });

    expect(rows.length, '재물조사계획목록 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 재물조사계획목록 - 역방향 날짜 조회 (SCH_FRM_DT > SCH_TO_DT, 0건 확인)
   * 중분류: 자산관리  소분류: 재물조사  메뉴명: 재물조사계획목록  액터: 개발자
   * URL: /mis/ass/ass2010/getPropInvsPlanList.do
   * 예상결과: 재물조사계획목록 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_2010M /mis/ass/ass2010/getPropInvsPlanList.do 대상 테이블 확인 * / DUAL WHERE SCH_FRM_DT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 재물조사계획목록 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 재물조사계획목록 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_FRM_DT=20260705, SCH_TO_DT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: '20260705', SCH_TO_DT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getPropInvsPlanList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_2010M-no3.png`, fullPage: true });

    expect(rows.length, '재물조사계획목록 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 재물조사계획목록 - 상태코드 필터 (SCH_APV_STAT_CD, 대표값 — 실제 코드값 확인 필요)
   * 중분류: 자산관리  소분류: 재물조사  메뉴명: 재물조사계획목록  액터: 개발자
   * URL: /mis/ass/ass2010/getPropInvsPlanList.do
   * 예상결과: 재물조사계획목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_2010M /mis/ass/ass2010/getPropInvsPlanList.do 대상 테이블 확인 * / DUAL WHERE SCH_APV_STAT_CD = :SCH_APV_STAT_CD
   */
  test('[no:4] 재물조사계획목록 - 상태코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 재물조사계획목록 - 상태코드 필터');
    logInput('검색조건', 'SCH_FRM_DT=20260401, SCH_TO_DT=20260705, SCH_APV_STAT_CD=');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: '20260401', SCH_TO_DT: '20260705', SCH_APV_STAT_CD: '' }));
    const result = await assertNexacroResponse(resp, 'getPropInvsPlanList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_2010M-no4.png`, fullPage: true });

    expect(rows.length, '재물조사계획목록 상태코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 재물조사계획목록 - 키워드 검색 (SCH_KEY)
   * 중분류: 자산관리  소분류: 재물조사  메뉴명: 재물조사계획목록  액터: 개발자
   * URL: /mis/ass/ass2010/getPropInvsPlanList.do
   * 예상결과: 재물조사계획목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_2010M /mis/ass/ass2010/getPropInvsPlanList.do 대상 테이블 확인 * / DUAL WHERE SCH_KEY LIKE '%테스트%'
   */
  test('[no:5] 재물조사계획목록 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 재물조사계획목록 - 키워드 검색');
    logInput('검색조건', 'SCH_FRM_DT=20260401, SCH_TO_DT=20260705, SCH_KEY_CLS=, SCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: '20260401', SCH_TO_DT: '20260705', SCH_KEY_CLS: '', SCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getPropInvsPlanList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_2010M-no5.png`, fullPage: true });

    expect(rows.length, '재물조사계획목록 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_2020M — 재물조사계획등록  |  API: POST /mis/ass/ass2020/getPropInvsPlanData.do  |  TC 1건
// TODO(menuId): ass_2020M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass2020/getPropInvsPlanData.do';
  const PGM_ID            = 'ass_2020M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['INVS_NO'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`재물조사계획등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 재물조사계획등록 - 상세 조회 (getPropInvsPlanData, 키: INVS_NO)
   * 중분류: 자산관리  소분류: 재물조사  메뉴명: 재물조사계획등록  액터: 개발자
   * URL: /mis/ass/ass2020/getPropInvsPlanData.do
   * 예상결과: 선택한 항목의 재물조사계획등록 상세정보가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_2020M /mis/ass/ass2020/getPropInvsPlanData.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 재물조사계획등록 - 상세 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 재물조사계획등록 - 상세 조회');
    logInput('검색조건', 'INVS_NO=');

    const resp   = await apiPost(page, API_URL, searchBody({ INVS_NO: '' }));
    const result = await assertNexacroResponse(resp, 'getPropInvsPlanData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_main');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_2020M-no1.png`, fullPage: true });

    expect(rows.length, '재물조사계획등록 상세 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_2030M — 재물조사결과목록  |  API: POST /mis/ass/ass2030/getPropInvsRsltList.do  |  TC 5건
// TODO(menuId): ass_2030M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass2030/getPropInvsRsltList.do';
  const PGM_ID            = 'ass_2030M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['SCH_DT_CLS', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_RQST_DEPT_CD', 'SCH_RQST_DEPT_NM', 'SCH_RQST_EMP_NO', 'SCH_RQST_EMP_NM', 'SCH_KEY_CLS', 'SCH_KEY', 'SCH_APV_STAT_CD'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`재물조사결과목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 재물조사결과목록 - 전체 조회 (기본조건)
   * 중분류: 자산관리  소분류: 재물조사  메뉴명: 재물조사결과목록  액터: 개발자
   * URL: /mis/ass/ass2030/getPropInvsRsltList.do
   * 예상결과: 재물조사결과목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_2030M /mis/ass/ass2030/getPropInvsRsltList.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 재물조사결과목록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 재물조사결과목록 - 전체 조회');
    logInput('검색조건', 'SCH_FRM_DT=20260401, SCH_TO_DT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: '20260401', SCH_TO_DT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getPropInvsRsltList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_2030M-no1.png`, fullPage: true });

    expect(rows.length, '재물조사결과목록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 재물조사결과목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)
   * 중분류: 자산관리  소분류: 재물조사  메뉴명: 재물조사결과목록  액터: 개발자
   * URL: /mis/ass/ass2030/getPropInvsRsltList.do
   * 예상결과: 재물조사결과목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_2030M /mis/ass/ass2030/getPropInvsRsltList.do 대상 테이블 확인 * / DUAL WHERE SCH_FRM_DT BETWEEN '20260101' AND '20260705'
   */
  test('[no:2] 재물조사결과목록 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 재물조사결과목록 - 기간 조회');
    logInput('검색조건', 'SCH_FRM_DT=20260101, SCH_TO_DT=20260705');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: '20260101', SCH_TO_DT: '20260705' }));
    const result = await assertNexacroResponse(resp, 'getPropInvsRsltList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_2030M-no2.png`, fullPage: true });

    expect(rows.length, '재물조사결과목록 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 재물조사결과목록 - 역방향 날짜 조회 (SCH_FRM_DT > SCH_TO_DT, 0건 확인)
   * 중분류: 자산관리  소분류: 재물조사  메뉴명: 재물조사결과목록  액터: 개발자
   * URL: /mis/ass/ass2030/getPropInvsRsltList.do
   * 예상결과: 재물조사결과목록 목록이 조회된다. (0건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_2030M /mis/ass/ass2030/getPropInvsRsltList.do 대상 테이블 확인 * / DUAL WHERE SCH_FRM_DT BETWEEN '20260705' AND '20260401'
   */
  test('[no:3] 재물조사결과목록 - 역방향 날짜 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] 재물조사결과목록 - 역방향 날짜 조회');
    logInput('검색조건', 'SCH_FRM_DT=20260705, SCH_TO_DT=20260401');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: '20260705', SCH_TO_DT: '20260401' }));
    const result = await assertNexacroResponse(resp, 'getPropInvsRsltList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_2030M-no3.png`, fullPage: true });

    expect(rows.length, '재물조사결과목록 역방향 날짜 조회 0건 기대').toBe(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 재물조사결과목록 - 상태코드 필터 (SCH_APV_STAT_CD, 대표값 — 실제 코드값 확인 필요)
   * 중분류: 자산관리  소분류: 재물조사  메뉴명: 재물조사결과목록  액터: 개발자
   * URL: /mis/ass/ass2030/getPropInvsRsltList.do
   * 예상결과: 재물조사결과목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_2030M /mis/ass/ass2030/getPropInvsRsltList.do 대상 테이블 확인 * / DUAL WHERE SCH_APV_STAT_CD = :SCH_APV_STAT_CD
   */
  test('[no:4] 재물조사결과목록 - 상태코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 재물조사결과목록 - 상태코드 필터');
    logInput('검색조건', 'SCH_FRM_DT=20260401, SCH_TO_DT=20260705, SCH_APV_STAT_CD=');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: '20260401', SCH_TO_DT: '20260705', SCH_APV_STAT_CD: '' }));
    const result = await assertNexacroResponse(resp, 'getPropInvsRsltList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_2030M-no4.png`, fullPage: true });

    expect(rows.length, '재물조사결과목록 상태코드 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 재물조사결과목록 - 키워드 검색 (SCH_KEY)
   * 중분류: 자산관리  소분류: 재물조사  메뉴명: 재물조사결과목록  액터: 개발자
   * URL: /mis/ass/ass2030/getPropInvsRsltList.do
   * 예상결과: 재물조사결과목록 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_2030M /mis/ass/ass2030/getPropInvsRsltList.do 대상 테이블 확인 * / DUAL WHERE SCH_KEY LIKE '%테스트%'
   */
  test('[no:5] 재물조사결과목록 - 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 재물조사결과목록 - 키워드 검색');
    logInput('검색조건', 'SCH_FRM_DT=20260401, SCH_TO_DT=20260705, SCH_KEY_CLS=, SCH_KEY=테스트');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRM_DT: '20260401', SCH_TO_DT: '20260705', SCH_KEY_CLS: '', SCH_KEY: '테스트' }));
    const result = await assertNexacroResponse(resp, 'getPropInvsRsltList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_2030M-no5.png`, fullPage: true });

    expect(rows.length, '재물조사결과목록 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// ass_2040M — 재물조사결과등록  |  API: POST /mis/ass/ass2040/getPropInvsData.do  |  TC 1건
// TODO(menuId): ass_2040M menuId 미확인(M_MIS_XX_XX_XX). 단위(API-direct)는 menuId 불필요하나 통합 spec은 SYS_MENU_MGT 조회 필요.
{
  const API_URL           = '/mis/ass/ass2040/getPropInvsData.do';
  const PGM_ID            = 'ass_2040M';   // API 본문 전용 — 테스트명 사용 금지
  const DS_SEARCH_COLUMNS = ['INVS_NO', 'RQST_CLS'];
  const searchBody = (params: Record<string, string>): string =>
    nexacroXml(
      [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS,
         rows: [Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );

  test.describe(`재물조사결과등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 재물조사결과등록 - 상세 조회 (getPropInvsRsltData, 키: INVS_NO/RQST_CLS)
   * 중분류: 자산관리  소분류: 재물조사  메뉴명: 재물조사결과등록  액터: 개발자
   * URL: /mis/ass/ass2040/getPropInvsData.do
   * 예상결과: 선택한 항목의 재물조사결과등록 상세정보가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM /* TODO: ass_2040M /mis/ass/ass2040/getPropInvsData.do 대상 테이블 확인 * / DUAL WHERE 1=1
   */
  test('[no:1] 재물조사결과등록 - 상세 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 재물조사결과등록 - 상세 조회');
    logInput('검색조건', 'INVS_NO=, RQST_CLS=');

    const resp   = await apiPost(page, API_URL, searchBody({ INVS_NO: '', RQST_CLS: '' }));
    const result = await assertNexacroResponse(resp, 'getPropInvsData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_main');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass_2040M-no1.png`, fullPage: true });

    expect(rows.length, '재물조사결과등록 상세 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  });
}
