// ==============================================================
// PUR — 구매취소관리 단위 테스트 (pur_0020M)
// 생성일시: 2026-07-01  |  파일: 20260701_pur_0020M_unit.spec.ts
// 화면: 구매취소관리 (Form id=pur_0300M, URL=pur0200)
// API: POST /mis/pur/pur0200/getList.do
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '/mis/pur/pur0200/getList.do';
const PGM_ID         = 'pur_0020M';   // API 본문 전용 — 테스트명 사용 금지

// ── ds_search 컬럼 목록 (pur_0020M scenarios.dsSearchCols) ──────────────────
const DS_SEARCH_COLUMNS = [
  'CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'FRGN_CLS', 'SCH_DT_CLS',
  'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_RQST_STAT', 'SCH_EMP_NM', 'SCH_EMP_NO',
  'SCH_MIN_AMT', 'SCH_MAX_AMT', 'SCH_CTRCT_MTHD', 'SCH_CLS', 'SCH_KEY',
  'SCH_PUR_STEP0', 'SCH_PUR_STEP1', 'SCH_PUR_STEP2', 'SCH_PUR_STEP3', 'SCH_PUR_STEP4',
  'SCH_PUR_STEP5', 'SCH_PUR_STEP6', 'SCH_PUR_STEP7', 'PUR_STEPS', 'ROLE_YN',
  'DEPT_CHIF_YN', 'SCH_E_CONT_YN', 'SCH_E_CONT_STAT', 'SCH_RQST_EMP_NO', 'SCH_RQST_EMP_NM',
  'SCH_RQST_TO_DT', 'SCH_RQST_FRM_DT', 'SCH_FRGN_CLS', 'SCH_PUR_STEP',
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
// [pur_0020M] 단위 테스트 — 구매취소관리 목록 조회
// ============================================================================
test.describe('구매취소관리 단위 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 구매취소관리 - 전체 조회 (조건 없음)
   * 중분류: 구매관리  소분류: 구매계약관리  메뉴명: 구매취소관리  액터: 개발자
   * 예상결과: 구매취소관리 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 구매등록/계약 테이블) WHERE 1=1
   */
  test('[no:1] 구매취소관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 구매취소관리 - 전체 조회');
    logInput('SCH_PUR_STEP', 'A (전체)');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_PUR_STEP: 'A' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/구매취소관리-no1-all.png`, fullPage: true });

    expect(rows.length, '구매취소관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 구매취소관리 - 기간 조회 (SCH_RQST_FRM_DT ~ SCH_RQST_TO_DT)
   * 중분류: 구매관리  소분류: 구매계약관리  메뉴명: 구매취소관리  액터: 개발자
   * 예상결과: 등록일자 범위 조회 결과가 반환된다. (총 N건 — RGST_DT >= 20240101 AND <= 20261231)
   * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE RGST_DT >= '20240101' AND RGST_DT <= '20261231'
   */
  test('[no:2] 구매취소관리 - 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 구매취소관리 - 기간 조회');
    logInput('SCH_DT_CLS', 'RGST_DT');
    logInput('기간', '20240101 ~ 20261231');

    const resp   = await apiPost(page, API_URL, searchBody({
      SCH_DT_CLS: 'RGST_DT', SCH_RQST_FRM_DT: '20240101', SCH_RQST_TO_DT: '20261231', SCH_PUR_STEP: 'A',
    }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/구매취소관리-no2-date.png`, fullPage: true });

    expect(rows.length, '구매취소관리 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:3] [단위] [SELECT] 구매취소관리 - 역방향 날짜 (시작일 > 종료일 → 0건)
   * 중분류: 구매관리  소분류: 구매계약관리  메뉴명: 구매취소관리  액터: 개발자
   * 예상결과: 역방향 날짜 조건 시 0건 반환. (총 0건)
   * DB 확인: -- 역방향 날짜: 0건 (RGST_DT >= '20261231' AND RGST_DT <= '20240101')
   */
  test('[no:3] 구매취소관리 - 역방향 날짜 (0건)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 구매취소관리 - 역방향 날짜');
    logInput('기간(역방향)', '20261231 ~ 20240101');

    const resp   = await apiPost(page, API_URL, searchBody({
      SCH_DT_CLS: 'RGST_DT', SCH_RQST_FRM_DT: '20261231', SCH_RQST_TO_DT: '20240101', SCH_PUR_STEP: 'A',
    }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);

    expect(rows.length, '구매취소관리 역방향 날짜 0건 기대').toBe(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] [단위] [SELECT] 구매취소관리 - 내외자 필터 (SCH_FRGN_CLS=604-001 내자)
   * 중분류: 구매관리  소분류: 구매계약관리  메뉴명: 구매취소관리  액터: 개발자
   * 예상결과: 내자 구분 일치 건이 반환된다. (총 N건 — FRGN_CLS = '604-001')
   * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE FRGN_CLS = '604-001'
   */
  test('[no:4] 구매취소관리 - 내외자 필터 (내자)', async ({ workerPage: page }) => {
    logTestStart('[no:4] 구매취소관리 - 내외자 필터 (내자)');
    logInput('SCH_FRGN_CLS', '604-001 (내자)');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_FRGN_CLS: '604-001', SCH_PUR_STEP: 'A' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/구매취소관리-no4-frgn.png`, fullPage: true });

    expect(rows.length, '구매취소관리 내자 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:5] [단위] [SELECT] 구매취소관리 - 키워드 검색 (SCH_CLS=RGST_NM + SCH_KEY=계약)
   * 중분류: 구매관리  소분류: 구매계약관리  메뉴명: 구매취소관리  액터: 개발자
   * 예상결과: 계약(등록)명 LIKE 검색 결과가 반환된다. (총 N건 — RGST_NM LIKE '%계약%')
   * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE UPPER(RGST_NM) LIKE '%계약%'
   */
  test('[no:5] 구매취소관리 - 키워드 검색 (등록명=계약)', async ({ workerPage: page }) => {
    logTestStart('[no:5] 구매취소관리 - 키워드 검색');
    logInput('SCH_CLS', 'RGST_NM');
    logInput('SCH_KEY', '계약');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_CLS: 'RGST_NM', SCH_KEY: '계약', SCH_PUR_STEP: 'A' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/구매취소관리-no5-keyword.png`, fullPage: true });

    expect(rows.length, '구매취소관리 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:6] [단위] [SELECT] 구매취소관리 - 취소구분 필터 (SCH_PUR_STEP=N 미취소)
   * 중분류: 구매관리  소분류: 구매계약관리  메뉴명: 구매취소관리  액터: 개발자
   * 예상결과: 미취소 상태 건이 반환된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 취소여부 = 'N'
   */
  test('[no:6] 구매취소관리 - 취소구분 필터 (미취소)', async ({ workerPage: page }) => {
    logTestStart('[no:6] 구매취소관리 - 취소구분 필터 (미취소)');
    logInput('SCH_PUR_STEP', 'N (미취소)');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_PUR_STEP: 'N' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/구매취소관리-no6-step.png`, fullPage: true });

    expect(rows.length, '구매취소관리 취소구분 필터 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
