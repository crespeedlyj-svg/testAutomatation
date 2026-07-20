// ==============================================================
// PAY 모듈 — 급여관리 단위 테스트 (통합 spec)
// 생성일시: 2026-07-05  |  파일: 20260705_pay_unit.spec.ts
// 커버 화면: 64개  |  총 테스트 케이스: 160건
// 방식: API-direct (page.evaluate(fetch) + nexacroXml)
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 금지
// 소스: _workspace/pay/01_scenarios.json (65개 화면, 비API/시나리오없음 제외: pay_6211_1M)
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

// ---------------------------------------------------------------------------
// pay_0000M — 간이세액조견표  |  API: POST /mis/pay/pay0000/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay0000/getData.do";
  const PGM_ID            = "pay_0000M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_APP_YM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`간이세액조견표(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 간이세액조견표 - 현재 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 간이세액조견표  액터: 개발자
   * URL: /mis/pay/pay0000/getData.do
   * 예상결과: 해당 적용년월의 간이세액표 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_SMPL_TAX_TABLE WHERE APP_YM = '202406'
   */
  test("[no:1] 간이세액조견표 - 현재 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 간이세액조견표 - 현재 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0000M-no1.png`, fullPage: true });

    expect(rows.length, "간이세액조견표 현재 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 간이세액조견표 - 과거 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 간이세액조견표  액터: 개발자
   * URL: /mis/pay/pay0000/getData.do
   * 예상결과: 과거 적용년월의 간이세액표 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_SMPL_TAX_TABLE WHERE APP_YM = '202301'
   */
  test("[no:2] 간이세액조견표 - 과거 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 간이세액조견표 - 과거 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202301");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202301" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0000M-no2.png`, fullPage: true });

    expect(rows.length, "간이세액조견표 과거 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 간이세액조견표 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 간이세액조견표  액터: 개발자
   * URL: /mis/pay/pay0000/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_SMPL_TAX_TABLE WHERE APP_YM = '999912'
   */
  test("[no:3] 간이세액조견표 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 간이세액조견표 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)");
    logInput("SCH_APP_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0000M-no3.png`, fullPage: true });

    expect(rows.length, "간이세액조견표 존재하지 않는 적용년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_0010M — 기타세율기준관리  |  API: POST /mis/pay/pay0010/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay0010/getData.do";
  const PGM_ID            = "pay_0010M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_APP_YM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`기타세율기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 기타세율기준관리 - 현재 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 기타세율기준관리  액터: 개발자
   * URL: /mis/pay/pay0010/getData.do
   * 예상결과: 해당 적용년월의 기타세율기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_SMPL_TAX_STD WHERE APP_YM = '202406'
   */
  test("[no:1] 기타세율기준관리 - 현재 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 기타세율기준관리 - 현재 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0010M-no1.png`, fullPage: true });

    expect(rows.length, "기타세율기준관리 현재 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 기타세율기준관리 - 과거 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 기타세율기준관리  액터: 개발자
   * URL: /mis/pay/pay0010/getData.do
   * 예상결과: 과거 적용년월의 기타세율기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_SMPL_TAX_STD WHERE APP_YM = '202301'
   */
  test("[no:2] 기타세율기준관리 - 과거 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 기타세율기준관리 - 과거 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202301");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202301" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0010M-no2.png`, fullPage: true });

    expect(rows.length, "기타세율기준관리 과거 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 기타세율기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 기타세율기준관리  액터: 개발자
   * URL: /mis/pay/pay0010/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_SMPL_TAX_STD WHERE APP_YM = '999912'
   */
  test("[no:3] 기타세율기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 기타세율기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)");
    logInput("SCH_APP_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0010M-no3.png`, fullPage: true });

    expect(rows.length, "기타세율기준관리 존재하지 않는 적용년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_0060M — 건강보험료산정기준관리  |  API: POST /mis/pay/pay0060/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay0060/getData.do";
  const PGM_ID            = "pay_0060M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_APP_YM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`건강보험료산정기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 건강보험료산정기준관리 - 현재 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 건강보험료산정기준관리  액터: 개발자
   * URL: /mis/pay/pay0060/getData.do
   * 예상결과: 해당 적용년월의 건강보험료 산정기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_MC_STD WHERE APP_YM = '202406'
   */
  test("[no:1] 건강보험료산정기준관리 - 현재 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 건강보험료산정기준관리 - 현재 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0060M-no1.png`, fullPage: true });

    expect(rows.length, "건강보험료산정기준관리 현재 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 건강보험료산정기준관리 - 과거 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 건강보험료산정기준관리  액터: 개발자
   * URL: /mis/pay/pay0060/getData.do
   * 예상결과: 과거 적용년월의 건강보험료 산정기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_MC_STD WHERE APP_YM = '202301'
   */
  test("[no:2] 건강보험료산정기준관리 - 과거 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 건강보험료산정기준관리 - 과거 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202301");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202301" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0060M-no2.png`, fullPage: true });

    expect(rows.length, "건강보험료산정기준관리 과거 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 건강보험료산정기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 건강보험료산정기준관리  액터: 개발자
   * URL: /mis/pay/pay0060/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_MC_STD WHERE APP_YM = '999912'
   */
  test("[no:3] 건강보험료산정기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 건강보험료산정기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)");
    logInput("SCH_APP_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0060M-no3.png`, fullPage: true });

    expect(rows.length, "건강보험료산정기준관리 존재하지 않는 적용년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_0070M — 국민연금산정기준관리  |  API: POST /mis/pay/pay0070/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay0070/getData.do";
  const PGM_ID            = "pay_0070M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_APP_YM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`국민연금산정기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국민연금산정기준관리 - 현재 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 국민연금산정기준관리  액터: 개발자
   * URL: /mis/pay/pay0070/getData.do
   * 예상결과: 해당 적용년월의 국민연금 산정기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_NP_STD WHERE APP_YM = '202406'
   */
  test("[no:1] 국민연금산정기준관리 - 현재 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국민연금산정기준관리 - 현재 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0070M-no1.png`, fullPage: true });

    expect(rows.length, "국민연금산정기준관리 현재 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 국민연금산정기준관리 - 과거 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 국민연금산정기준관리  액터: 개발자
   * URL: /mis/pay/pay0070/getData.do
   * 예상결과: 과거 적용년월의 국민연금 산정기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_NP_STD WHERE APP_YM = '202301'
   */
  test("[no:2] 국민연금산정기준관리 - 과거 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 국민연금산정기준관리 - 과거 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202301");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202301" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0070M-no2.png`, fullPage: true });

    expect(rows.length, "국민연금산정기준관리 과거 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 국민연금산정기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 국민연금산정기준관리  액터: 개발자
   * URL: /mis/pay/pay0070/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_NP_STD WHERE APP_YM = '999912'
   */
  test("[no:3] 국민연금산정기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 국민연금산정기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)");
    logInput("SCH_APP_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0070M-no3.png`, fullPage: true });

    expect(rows.length, "국민연금산정기준관리 존재하지 않는 적용년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_1010M — 급여원장  |  API: POST /mis/pay/pay1010/getList.do  |  TC 6건
{
  const API_URL           = "/mis/pay/pay1010/getList.do";
  const PGM_ID            = "pay_1010M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_EMP_NM","SCH_EMP_NO","SCH_WORK_DGCNT","SCH_HLDF_FG_CD","SCH_EMPO_STLF_CD","SCH_JSFC_CD","SCH_GRD_CD","SCH_REG_YN","SCH_DEPT_CD","SCH_DEPT_NM","SCH_STDR_YM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`급여원장(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 급여원장 - 전체 조회 (기준년월만)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * URL: /mis/pay/pay1010/getList.do
   * 예상결과: 해당 기준년월의 급여원장 사원 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_LEDGER_MST WHERE STDR_YM = '202406'
   */
  test("[no:1] 급여원장 - 전체 조회 (기준년월만)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 급여원장 - 전체 조회 (기준년월만)");
    logInput("SCH_STDR_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_STDR_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1010M-no1.png`, fullPage: true });

    expect(rows.length, "급여원장 전체 조회 (기준년월만) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 급여원장 - 재직구분 조건 조회 (SCH_HLDF_FG_CD)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * URL: /mis/pay/pay1010/getList.do
   * 예상결과: 재직구분 조건에 해당하는 사원 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_LEDGER_MST WHERE STDR_YM = '202406' AND HLDF_FG_CD = '1'
   */
  test("[no:2] 급여원장 - 재직구분 조건 조회 (SCH_HLDF_FG_CD)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 급여원장 - 재직구분 조건 조회 (SCH_HLDF_FG_CD)");
    logInput("SCH_STDR_YM", "202406");
    logInput("SCH_HLDF_FG_CD", "1");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_STDR_YM": "202406", "SCH_HLDF_FG_CD": "1" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1010M-no2.png`, fullPage: true });

    expect(rows.length, "급여원장 재직구분 조건 조회 (SCH_HLDF_FG_CD) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 급여원장 - 존재하지 않는 기준년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * URL: /mis/pay/pay1010/getList.do
   * 예상결과: 존재하지 않는 기준년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_LEDGER_MST WHERE STDR_YM = '999912'
   */
  test("[no:3] 급여원장 - 존재하지 않는 기준년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 급여원장 - 존재하지 않는 기준년월(999912) 조회 (0건 확인)");
    logInput("SCH_STDR_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_STDR_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1010M-no3.png`, fullPage: true });

    expect(rows.length, "급여원장 존재하지 않는 기준년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 급여원장 - 고용형태 코드 필터 조회 (SCH_EMPO_STLF_CD)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * URL: /mis/pay/pay1010/getList.do
   * 예상결과: 고용형태 코드에 해당하는 사원 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_LEDGER_MST WHERE STDR_YM = '202406' AND EMPO_STLF_CD = '01'
   */
  test("[no:4] 급여원장 - 고용형태 코드 필터 조회 (SCH_EMPO_STLF_CD)", async ({ workerPage: page }) => {
    logTestStart("[no:4] 급여원장 - 고용형태 코드 필터 조회 (SCH_EMPO_STLF_CD)");
    logInput("SCH_STDR_YM", "202406");
    logInput("SCH_EMPO_STLF_CD", "01");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_STDR_YM": "202406", "SCH_EMPO_STLF_CD": "01" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1010M-no4.png`, fullPage: true });

    expect(rows.length, "급여원장 고용형태 코드 필터 조회 (SCH_EMPO_STLF_CD) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 급여원장 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * URL: /mis/pay/pay1010/getList.do
   * 예상결과: 성명 키워드가 포함된 사원 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_LEDGER_MST WHERE STDR_YM = '202406' AND EMP_NM LIKE '%김%'
   */
  test("[no:5] 급여원장 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:5] 급여원장 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_STDR_YM", "202406");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_STDR_YM": "202406", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1010M-no5.png`, fullPage: true });

    expect(rows.length, "급여원장 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 급여원장 - 원장등록 여부 조건 조회 (SCH_REG_YN)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여원장  액터: 개발자
   * URL: /mis/pay/pay1010/getList.do
   * 예상결과: 원장등록 여부 조건에 해당하는 사원 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_LEDGER_MST WHERE STDR_YM = '202406' AND REG_YN = 'Y'
   */
  test("[no:6] 급여원장 - 원장등록 여부 조건 조회 (SCH_REG_YN)", async ({ workerPage: page }) => {
    logTestStart("[no:6] 급여원장 - 원장등록 여부 조건 조회 (SCH_REG_YN)");
    logInput("SCH_STDR_YM", "202406");
    logInput("SCH_REG_YN", "Y");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_STDR_YM": "202406", "SCH_REG_YN": "Y" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1010M-no6.png`, fullPage: true });

    expect(rows.length, "급여원장 원장등록 여부 조건 조회 (SCH_REG_YN) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_0020M — 월급여평균액기준관리  |  API: POST /mis/pay/pay0020/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay0020/getData.do";
  const PGM_ID            = "pay_0020M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_APP_YM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`월급여평균액기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 월급여평균액기준관리 - 현재 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 월급여평균액기준관리  액터: 개발자
   * URL: /mis/pay/pay0020/getData.do
   * 예상결과: 해당 적용년월의 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_AVG_SAL_STD WHERE APP_YM = '202406'
   */
  test("[no:1] 월급여평균액기준관리 - 현재 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 월급여평균액기준관리 - 현재 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0020M-no1.png`, fullPage: true });

    expect(rows.length, "월급여평균액기준관리 현재 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 월급여평균액기준관리 - 과거 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 월급여평균액기준관리  액터: 개발자
   * URL: /mis/pay/pay0020/getData.do
   * 예상결과: 과거 적용년월의 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_AVG_SAL_STD WHERE APP_YM = '202301'
   */
  test("[no:2] 월급여평균액기준관리 - 과거 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 월급여평균액기준관리 - 과거 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202301");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202301" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0020M-no2.png`, fullPage: true });

    expect(rows.length, "월급여평균액기준관리 과거 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 월급여평균액기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 월급여평균액기준관리  액터: 개발자
   * URL: /mis/pay/pay0020/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_AVG_SAL_STD WHERE APP_YM = '999912'
   */
  test("[no:3] 월급여평균액기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 월급여평균액기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)");
    logInput("SCH_APP_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0020M-no3.png`, fullPage: true });

    expect(rows.length, "월급여평균액기준관리 존재하지 않는 적용년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_0030M — 근로소득공제기준관리  |  API: POST /mis/pay/pay0030/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay0030/getData.do";
  const PGM_ID            = "pay_0030M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_APP_YM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`근로소득공제기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 근로소득공제기준관리 - 현재 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 근로소득공제기준관리  액터: 개발자
   * URL: /mis/pay/pay0030/getData.do
   * 예상결과: 해당 적용년월의 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_ERIC_DDC_STD WHERE APP_YM = '202406'
   */
  test("[no:1] 근로소득공제기준관리 - 현재 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 근로소득공제기준관리 - 현재 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0030M-no1.png`, fullPage: true });

    expect(rows.length, "근로소득공제기준관리 현재 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 근로소득공제기준관리 - 과거 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 근로소득공제기준관리  액터: 개발자
   * URL: /mis/pay/pay0030/getData.do
   * 예상결과: 과거 적용년월의 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_ERIC_DDC_STD WHERE APP_YM = '202301'
   */
  test("[no:2] 근로소득공제기준관리 - 과거 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 근로소득공제기준관리 - 과거 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202301");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202301" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0030M-no2.png`, fullPage: true });

    expect(rows.length, "근로소득공제기준관리 과거 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 근로소득공제기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 근로소득공제기준관리  액터: 개발자
   * URL: /mis/pay/pay0030/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_ERIC_DDC_STD WHERE APP_YM = '999912'
   */
  test("[no:3] 근로소득공제기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 근로소득공제기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)");
    logInput("SCH_APP_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0030M-no3.png`, fullPage: true });

    expect(rows.length, "근로소득공제기준관리 존재하지 않는 적용년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_0040M — 소득세기본세율표관리  |  API: POST /mis/pay/pay0040/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay0040/getData.do";
  const PGM_ID            = "pay_0040M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_APP_YM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`소득세기본세율표관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 소득세기본세율표관리 - 현재 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 소득세기본세율표관리  액터: 개발자
   * URL: /mis/pay/pay0040/getData.do
   * 예상결과: 해당 적용년월의 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_INCM_TAX_RATE WHERE APP_YM = '202406'
   */
  test("[no:1] 소득세기본세율표관리 - 현재 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 소득세기본세율표관리 - 현재 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0040M-no1.png`, fullPage: true });

    expect(rows.length, "소득세기본세율표관리 현재 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 소득세기본세율표관리 - 과거 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 소득세기본세율표관리  액터: 개발자
   * URL: /mis/pay/pay0040/getData.do
   * 예상결과: 과거 적용년월의 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_INCM_TAX_RATE WHERE APP_YM = '202301'
   */
  test("[no:2] 소득세기본세율표관리 - 과거 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 소득세기본세율표관리 - 과거 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202301");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202301" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0040M-no2.png`, fullPage: true });

    expect(rows.length, "소득세기본세율표관리 과거 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 소득세기본세율표관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 소득세기본세율표관리  액터: 개발자
   * URL: /mis/pay/pay0040/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_INCM_TAX_RATE WHERE APP_YM = '999912'
   */
  test("[no:3] 소득세기본세율표관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 소득세기본세율표관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)");
    logInput("SCH_APP_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0040M-no3.png`, fullPage: true });

    expect(rows.length, "소득세기본세율표관리 존재하지 않는 적용년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_0050M — 근로소득세액공제기준관리  |  API: POST /mis/pay/pay0050/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay0050/getData.do";
  const PGM_ID            = "pay_0050M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_APP_YM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`근로소득세액공제기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 근로소득세액공제기준관리 - 현재 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 근로소득세액공제기준관리  액터: 개발자
   * URL: /mis/pay/pay0050/getData.do
   * 예상결과: 해당 적용년월의 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_ERIC_TAX_DDC_STD WHERE APP_YM = '202406'
   */
  test("[no:1] 근로소득세액공제기준관리 - 현재 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 근로소득세액공제기준관리 - 현재 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0050M-no1.png`, fullPage: true });

    expect(rows.length, "근로소득세액공제기준관리 현재 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 근로소득세액공제기준관리 - 과거 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 근로소득세액공제기준관리  액터: 개발자
   * URL: /mis/pay/pay0050/getData.do
   * 예상결과: 과거 적용년월의 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_ERIC_TAX_DDC_STD WHERE APP_YM = '202301'
   */
  test("[no:2] 근로소득세액공제기준관리 - 과거 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 근로소득세액공제기준관리 - 과거 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202301");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202301" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0050M-no2.png`, fullPage: true });

    expect(rows.length, "근로소득세액공제기준관리 과거 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 근로소득세액공제기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 근로소득세액공제기준관리  액터: 개발자
   * URL: /mis/pay/pay0050/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_ERIC_TAX_DDC_STD WHERE APP_YM = '999912'
   */
  test("[no:3] 근로소득세액공제기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 근로소득세액공제기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)");
    logInput("SCH_APP_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0050M-no3.png`, fullPage: true });

    expect(rows.length, "근로소득세액공제기준관리 존재하지 않는 적용년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_0080M — 국민연금/건강보험관리  |  API: POST /mis/pay/pay0090/getList.do  |  TC 2건
{
  const API_URL           = "/mis/pay/pay0090/getList.do";
  const PGM_ID            = "pay_0080M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`국민연금/건강보험관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국민연금/건강보험관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 국민연금/건강보험관리  액터: 개발자
   * URL: /mis/pay/pay0090/getList.do
   * 예상결과: 국민연금/건강보험 기준 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_NP_MC_MGT WHERE 1=1
   */
  test("[no:1] 국민연금/건강보험관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국민연금/건강보험관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0080M-no1.png`, fullPage: true });

    expect(rows.length, "국민연금/건강보험관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 국민연금/건강보험관리 - 적용년월 조회
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 국민연금/건강보험관리  액터: 개발자
   * URL: /mis/pay/pay0090/getList.do
   * 예상결과: 해당 적용년월의 기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_NP_MC_MGT WHERE APP_YM = '202406'
   */
  test("[no:2] 국민연금/건강보험관리 - 적용년월 조회", async ({ workerPage: page }) => {
    logTestStart("[no:2] 국민연금/건강보험관리 - 적용년월 조회");
    logInput("APP_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "APP_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_0080M-no2.png`, fullPage: true });

    expect(rows.length, "국민연금/건강보험관리 적용년월 조회 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_1020M — 개인별계좌조회  |  API: POST /mis/pay/pay1020/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay1020/getData.do";
  const PGM_ID            = "pay_1020M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_EMP_RID","SCH_EMP_NO","SCH_EMP_NM","SCH_SAL_ACC_FG","SCH_HLDF_FG"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`개인별계좌조회(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 개인별계좌조회 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 개인별계좌조회  액터: 개발자
   * URL: /mis/pay/pay1020/getData.do
   * 예상결과: 개인별 계좌 현황이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PSN_ACC WHERE 1=1
   */
  test("[no:1] 개인별계좌조회 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 개인별계좌조회 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1020M-no1.png`, fullPage: true });

    expect(rows.length, "개인별계좌조회 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 개인별계좌조회 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 개인별계좌조회  액터: 개발자
   * URL: /mis/pay/pay1020/getData.do
   * 예상결과: 성명 키워드가 포함된 계좌 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PSN_ACC WHERE EMP_NM LIKE '%김%'
   */
  test("[no:2] 개인별계좌조회 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 개인별계좌조회 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1020M-no2.png`, fullPage: true });

    expect(rows.length, "개인별계좌조회 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 개인별계좌조회 - 존재하지 않는 사원번호(0000000000) 조회
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 개인별계좌조회  액터: 개발자
   * URL: /mis/pay/pay1020/getData.do
   * 예상결과: 존재하지 않는 사원이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_PSN_ACC WHERE EMP_NO = '0000000000'
   */
  test("[no:3] 개인별계좌조회 - 존재하지 않는 사원번호(0000000000) 조회", async ({ workerPage: page }) => {
    logTestStart("[no:3] 개인별계좌조회 - 존재하지 않는 사원번호(0000000000) 조회");
    logInput("SCH_EMP_NO", "0000000000");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_EMP_NO": "0000000000" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1020M-no3.png`, fullPage: true });

    expect(rows.length, "개인별계좌조회 존재하지 않는 사원번호(0000000000) 조회 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_1030M — 연봉관리  |  API: POST /mis/pay/pay1030/getList.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay1030/getList.do";
  const PGM_ID            = "pay_1030M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_EMP_RID","SCH_EMP_NO","SCH_EMP_NM","SCH_CTRCT_CTRCT_PROG_STAT_FG","SCH_APLY_FRM","SCH_APLY_TO"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`연봉관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 연봉관리 - 적용기간 조회 (SCH_APLY_FRM~SCH_APLY_TO)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 연봉관리  액터: 개발자
   * URL: /mis/pay/pay1030/getList.do
   * 예상결과: 해당 적용기간의 연봉 현황이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_ANRY_MST WHERE APLY_DT BETWEEN '20240101' AND '20241231'
   */
  test("[no:1] 연봉관리 - 적용기간 조회 (SCH_APLY_FRM~SCH_APLY_TO)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 연봉관리 - 적용기간 조회 (SCH_APLY_FRM~SCH_APLY_TO)");
    logInput("SCH_APLY_FRM", "20240101");
    logInput("SCH_APLY_TO", "20241231");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APLY_FRM": "20240101", "SCH_APLY_TO": "20241231" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1030M-no1.png`, fullPage: true });

    expect(rows.length, "연봉관리 적용기간 조회 (SCH_APLY_FRM~SCH_APLY_TO) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 연봉관리 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 연봉관리  액터: 개발자
   * URL: /mis/pay/pay1030/getList.do
   * 예상결과: 성명 키워드가 포함된 연봉 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_ANRY_MST WHERE EMP_NM LIKE '%김%'
   */
  test("[no:2] 연봉관리 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 연봉관리 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_APLY_FRM", "20240101");
    logInput("SCH_APLY_TO", "20241231");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APLY_FRM": "20240101", "SCH_APLY_TO": "20241231", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1030M-no2.png`, fullPage: true });

    expect(rows.length, "연봉관리 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 연봉관리 - 역방향 기간(시작>종료) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 연봉관리  액터: 개발자
   * URL: /mis/pay/pay1030/getList.do
   * 예상결과: 역방향 기간이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_ANRY_MST WHERE APLY_DT BETWEEN '20241231' AND '20240101'
   */
  test("[no:3] 연봉관리 - 역방향 기간(시작>종료) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 연봉관리 - 역방향 기간(시작>종료) 조회 (0건 확인)");
    logInput("SCH_APLY_FRM", "20241231");
    logInput("SCH_APLY_TO", "20240101");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APLY_FRM": "20241231", "SCH_APLY_TO": "20240101" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1030M-no3.png`, fullPage: true });

    expect(rows.length, "연봉관리 역방향 기간(시작>종료) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_1040M — 가족수당기준관리  |  API: POST /mis/pay/pay1040/getList.do  |  TC 2건
{
  const API_URL           = "/mis/pay/pay1040/getList.do";
  const PGM_ID            = "pay_1040M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_STDR_DT"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`가족수당기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 가족수당기준관리 - 기준일자 조회 (SCH_STDR_DT)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 가족수당기준관리  액터: 개발자
   * URL: /mis/pay/pay1040/getList.do
   * 예상결과: 해당 기준일자의 가족수당 기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_FMLY_ALW_STD WHERE STDR_DT <= '20240601'
   */
  test("[no:1] 가족수당기준관리 - 기준일자 조회 (SCH_STDR_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 가족수당기준관리 - 기준일자 조회 (SCH_STDR_DT)");
    logInput("SCH_STDR_DT", "20240601");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_STDR_DT": "20240601" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1040M-no1.png`, fullPage: true });

    expect(rows.length, "가족수당기준관리 기준일자 조회 (SCH_STDR_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 가족수당기준관리 - 과거 기준일자 조회
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 가족수당기준관리  액터: 개발자
   * URL: /mis/pay/pay1040/getList.do
   * 예상결과: 과거 기준일자의 가족수당 기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_FMLY_ALW_STD WHERE STDR_DT <= '20230101'
   */
  test("[no:2] 가족수당기준관리 - 과거 기준일자 조회", async ({ workerPage: page }) => {
    logTestStart("[no:2] 가족수당기준관리 - 과거 기준일자 조회");
    logInput("SCH_STDR_DT", "20230101");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_STDR_DT": "20230101" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1040M-no2.png`, fullPage: true });

    expect(rows.length, "가족수당기준관리 과거 기준일자 조회 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_1050M — 지급/공제항목관리  |  API: POST /mis/pay/pay1050/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay1050/getData.do";
  const PGM_ID            = "pay_1050M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_SAL_ITM_FG","SCH_SAL_ITM_NM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`지급/공제항목관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 지급/공제항목관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급/공제항목관리  액터: 개발자
   * URL: /mis/pay/pay1050/getData.do
   * 예상결과: 지급/공제 항목 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_SAL_ITM WHERE 1=1
   */
  test("[no:1] 지급/공제항목관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 지급/공제항목관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1050M-no1.png`, fullPage: true });

    expect(rows.length, "지급/공제항목관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 지급/공제항목관리 - 지급공제구분 조회 (SCH_SAL_ITM_FG)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급/공제항목관리  액터: 개발자
   * URL: /mis/pay/pay1050/getData.do
   * 예상결과: 지급공제구분에 해당하는 항목이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_SAL_ITM WHERE SAL_ITM_FG = '1'
   */
  test("[no:2] 지급/공제항목관리 - 지급공제구분 조회 (SCH_SAL_ITM_FG)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 지급/공제항목관리 - 지급공제구분 조회 (SCH_SAL_ITM_FG)");
    logInput("SCH_SAL_ITM_FG", "1");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_SAL_ITM_FG": "1" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1050M-no2.png`, fullPage: true });

    expect(rows.length, "지급/공제항목관리 지급공제구분 조회 (SCH_SAL_ITM_FG) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 지급/공제항목관리 - 항목명 키워드 검색 (SCH_SAL_ITM_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급/공제항목관리  액터: 개발자
   * URL: /mis/pay/pay1050/getData.do
   * 예상결과: 항목명 키워드가 포함된 항목이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_SAL_ITM WHERE SAL_ITM_NM LIKE '%수당%'
   */
  test("[no:3] 지급/공제항목관리 - 항목명 키워드 검색 (SCH_SAL_ITM_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 지급/공제항목관리 - 항목명 키워드 검색 (SCH_SAL_ITM_NM)");
    logInput("SCH_SAL_ITM_NM", "수당");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_SAL_ITM_NM": "수당" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1050M-no3.png`, fullPage: true });

    expect(rows.length, "지급/공제항목관리 항목명 키워드 검색 (SCH_SAL_ITM_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_1060M — 고정지급/공제항목관리  |  API: POST /mis/pay/pay1060/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay1060/getData.do";
  const PGM_ID            = "pay_1060M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_YYMM","SCH_PMT_FG","SCH_SAL_ITM_FG","SCH_SAL_ITM_CD","SCH_EMP_RID","SCH_EMP_NO","SCH_EMP_NM","SCH_FRM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`고정지급/공제항목관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 고정지급/공제항목관리 - 기준년월 조회 (SCH_YYMM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 고정지급/공제항목관리  액터: 개발자
   * URL: /mis/pay/pay1060/getData.do
   * 예상결과: 해당 년월의 고정지급/공제 항목이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_FIX_SAL_ITM WHERE YYMM = '202406'
   */
  test("[no:1] 고정지급/공제항목관리 - 기준년월 조회 (SCH_YYMM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 고정지급/공제항목관리 - 기준년월 조회 (SCH_YYMM)");
    logInput("SCH_YYMM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YYMM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1060M-no1.png`, fullPage: true });

    expect(rows.length, "고정지급/공제항목관리 기준년월 조회 (SCH_YYMM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 고정지급/공제항목관리 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 고정지급/공제항목관리  액터: 개발자
   * URL: /mis/pay/pay1060/getData.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_FIX_SAL_ITM WHERE YYMM='202406' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 고정지급/공제항목관리 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 고정지급/공제항목관리 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_YYMM", "202406");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YYMM": "202406", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1060M-no2.png`, fullPage: true });

    expect(rows.length, "고정지급/공제항목관리 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 고정지급/공제항목관리 - 존재하지 않는 년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 고정지급/공제항목관리  액터: 개발자
   * URL: /mis/pay/pay1060/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_FIX_SAL_ITM WHERE YYMM = '999912'
   */
  test("[no:3] 고정지급/공제항목관리 - 존재하지 않는 년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 고정지급/공제항목관리 - 존재하지 않는 년월(999912) 조회 (0건 확인)");
    logInput("SCH_YYMM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YYMM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1060M-no3.png`, fullPage: true });

    expect(rows.length, "고정지급/공제항목관리 존재하지 않는 년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_1070M — 변동지급/공제항목관리  |  API: POST /mis/pay/pay1070/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay1070/getData.do";
  const PGM_ID            = "pay_1070M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_PMT_YM","SCH_PMT_FG","SCH_SAL_ITM_FG","SCH_SAL_ITM_CD","SCH_EMP_RID","SCH_EMP_NO","SCH_EMP_NM","SCH_PMT_SEQ"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`변동지급/공제항목관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 변동지급/공제항목관리 - 지급년월 조회 (SCH_PMT_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 변동지급/공제항목관리  액터: 개발자
   * URL: /mis/pay/pay1070/getData.do
   * 예상결과: 해당 지급년월의 변동지급/공제 항목이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_VAR_SAL_ITM WHERE PMT_YM = '202406'
   */
  test("[no:1] 변동지급/공제항목관리 - 지급년월 조회 (SCH_PMT_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 변동지급/공제항목관리 - 지급년월 조회 (SCH_PMT_YM)");
    logInput("SCH_PMT_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_PMT_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1070M-no1.png`, fullPage: true });

    expect(rows.length, "변동지급/공제항목관리 지급년월 조회 (SCH_PMT_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 변동지급/공제항목관리 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 변동지급/공제항목관리  액터: 개발자
   * URL: /mis/pay/pay1070/getData.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_VAR_SAL_ITM WHERE PMT_YM='202406' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 변동지급/공제항목관리 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 변동지급/공제항목관리 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_PMT_YM", "202406");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_PMT_YM": "202406", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1070M-no2.png`, fullPage: true });

    expect(rows.length, "변동지급/공제항목관리 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 변동지급/공제항목관리 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 변동지급/공제항목관리  액터: 개발자
   * URL: /mis/pay/pay1070/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_VAR_SAL_ITM WHERE PMT_YM = '999912'
   */
  test("[no:3] 변동지급/공제항목관리 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 변동지급/공제항목관리 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)");
    logInput("SCH_PMT_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_PMT_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1070M-no3.png`, fullPage: true });

    expect(rows.length, "변동지급/공제항목관리 존재하지 않는 지급년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_1080M — 국민/건강취득변동자료관리  |  API: POST /mis/pay/pay1080/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay1080/getData.do";
  const PGM_ID            = "pay_1080M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_EMP_RID","SCH_EMP_NM","SCH_EMP_NO","SCH_HLDF_FG"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`국민/건강취득변동자료관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 국민/건강취득변동자료관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 국민/건강취득변동자료관리  액터: 개발자
   * URL: /mis/pay/pay1080/getData.do
   * 예상결과: 4대보험 취득변동 자료 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_INSU_CHG WHERE 1=1
   */
  test("[no:1] 국민/건강취득변동자료관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 국민/건강취득변동자료관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1080M-no1.png`, fullPage: true });

    expect(rows.length, "국민/건강취득변동자료관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 국민/건강취득변동자료관리 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 국민/건강취득변동자료관리  액터: 개발자
   * URL: /mis/pay/pay1080/getData.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_INSU_CHG WHERE EMP_NM LIKE '%김%'
   */
  test("[no:2] 국민/건강취득변동자료관리 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 국민/건강취득변동자료관리 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1080M-no2.png`, fullPage: true });

    expect(rows.length, "국민/건강취득변동자료관리 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 국민/건강취득변동자료관리 - 존재하지 않는 사원번호(0000000000) 조회
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 국민/건강취득변동자료관리  액터: 개발자
   * URL: /mis/pay/pay1080/getData.do
   * 예상결과: 존재하지 않는 사원이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_INSU_CHG WHERE EMP_NO = '0000000000'
   */
  test("[no:3] 국민/건강취득변동자료관리 - 존재하지 않는 사원번호(0000000000) 조회", async ({ workerPage: page }) => {
    logTestStart("[no:3] 국민/건강취득변동자료관리 - 존재하지 않는 사원번호(0000000000) 조회");
    logInput("SCH_EMP_NO", "0000000000");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_EMP_NO": "0000000000" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1080M-no3.png`, fullPage: true });

    expect(rows.length, "국민/건강취득변동자료관리 존재하지 않는 사원번호(0000000000) 조회 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_1090M — 급여대장항목관리  |  API: POST /mis/pay/pay1090/getData.do  |  TC 2건
{
  const API_URL           = "/mis/pay/pay1090/getData.do";
  const PGM_ID            = "pay_1090M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_SAL_REGT_MNG_NO","SCH_SAL_REGT_NM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`급여대장항목관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 급여대장항목관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여대장항목관리  액터: 개발자
   * URL: /mis/pay/pay1090/getData.do
   * 예상결과: 급여대장 항목 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_SAL_REGT WHERE 1=1
   */
  test("[no:1] 급여대장항목관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 급여대장항목관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1090M-no1.png`, fullPage: true });

    expect(rows.length, "급여대장항목관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 급여대장항목관리 - 대장명 키워드 검색 (SCH_SAL_REGT_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여대장항목관리  액터: 개발자
   * URL: /mis/pay/pay1090/getData.do
   * 예상결과: 대장명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_SAL_REGT WHERE SAL_REGT_NM LIKE '%급여%'
   */
  test("[no:2] 급여대장항목관리 - 대장명 키워드 검색 (SCH_SAL_REGT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 급여대장항목관리 - 대장명 키워드 검색 (SCH_SAL_REGT_NM)");
    logInput("SCH_SAL_REGT_NM", "급여");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_SAL_REGT_NM": "급여" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1090M-no2.png`, fullPage: true });

    expect(rows.length, "급여대장항목관리 대장명 키워드 검색 (SCH_SAL_REGT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_1110M — 수당기준관리  |  API: POST /mis/pay/pay1110/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay1110/getData.do";
  const PGM_ID            = "pay_1110M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_APP_YM","SCH_SAL_ITM_CD"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`수당기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 수당기준관리 - 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 수당기준관리  액터: 개발자
   * URL: /mis/pay/pay1110/getData.do
   * 예상결과: 해당 적용년월의 수당기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_ALW_STD WHERE APP_YM = '202406'
   */
  test("[no:1] 수당기준관리 - 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 수당기준관리 - 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1110M-no1.png`, fullPage: true });

    expect(rows.length, "수당기준관리 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 수당기준관리 - 수당항목 조회 (SCH_SAL_ITM_CD)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 수당기준관리  액터: 개발자
   * URL: /mis/pay/pay1110/getData.do
   * 예상결과: 수당항목에 해당하는 기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_ALW_STD WHERE APP_YM='202406' AND SAL_ITM_CD='01'
   */
  test("[no:2] 수당기준관리 - 수당항목 조회 (SCH_SAL_ITM_CD)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 수당기준관리 - 수당항목 조회 (SCH_SAL_ITM_CD)");
    logInput("SCH_APP_YM", "202406");
    logInput("SCH_SAL_ITM_CD", "01");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202406", "SCH_SAL_ITM_CD": "01" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1110M-no2.png`, fullPage: true });

    expect(rows.length, "수당기준관리 수당항목 조회 (SCH_SAL_ITM_CD) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 수당기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 수당기준관리  액터: 개발자
   * URL: /mis/pay/pay1110/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_ALW_STD WHERE APP_YM = '999912'
   */
  test("[no:3] 수당기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 수당기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)");
    logInput("SCH_APP_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_1110M-no3.png`, fullPage: true });

    expect(rows.length, "수당기준관리 존재하지 않는 적용년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_2010M — 지급내역조회  |  API: POST /mis/pay/pay2010/getList.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay2010/getList.do";
  const PGM_ID            = "pay_2010M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_YM_FRM","SCH_YM_TO","SCH_PMT_FG","SCH_EMP_RID","SCH_EMP_NM","SCH_EMP_NO","SCH_PAY_TYPE","SCH_AREA_TYPE","SCH_PAY_NM","SCH_RMK_YN","SCH_EMPO_FG"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`지급내역조회(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 지급내역조회 - 기간 조회 (SCH_YM_FRM~SCH_YM_TO)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급내역조회  액터: 개발자
   * URL: /mis/pay/pay2010/getList.do
   * 예상결과: 해당 기간의 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_DTL WHERE PMT_YM BETWEEN '202401' AND '202406'
   */
  test("[no:1] 지급내역조회 - 기간 조회 (SCH_YM_FRM~SCH_YM_TO)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 지급내역조회 - 기간 조회 (SCH_YM_FRM~SCH_YM_TO)");
    logInput("SCH_YM_FRM", "202401");
    logInput("SCH_YM_TO", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM_FRM": "202401", "SCH_YM_TO": "202406" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2010M-no1.png`, fullPage: true });

    expect(rows.length, "지급내역조회 기간 조회 (SCH_YM_FRM~SCH_YM_TO) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 지급내역조회 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급내역조회  액터: 개발자
   * URL: /mis/pay/pay2010/getList.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_DTL WHERE PMT_YM BETWEEN '202401' AND '202406' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 지급내역조회 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 지급내역조회 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_YM_FRM", "202401");
    logInput("SCH_YM_TO", "202406");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM_FRM": "202401", "SCH_YM_TO": "202406", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2010M-no2.png`, fullPage: true });

    expect(rows.length, "지급내역조회 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 지급내역조회 - 역방향 기간(시작>종료) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급내역조회  액터: 개발자
   * URL: /mis/pay/pay2010/getList.do
   * 예상결과: 역방향 기간이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_DTL WHERE PMT_YM BETWEEN '202406' AND '202401'
   */
  test("[no:3] 지급내역조회 - 역방향 기간(시작>종료) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 지급내역조회 - 역방향 기간(시작>종료) 조회 (0건 확인)");
    logInput("SCH_YM_FRM", "202406");
    logInput("SCH_YM_TO", "202401");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM_FRM": "202406", "SCH_YM_TO": "202401" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2010M-no3.png`, fullPage: true });

    expect(rows.length, "지급내역조회 역방향 기간(시작>종료) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_2020M — 급여명세서조회  |  API: POST /mis/pay/pay2020/getList.do  |  TC 2건
{
  const API_URL           = "/mis/pay/pay2020/getList.do";
  const PGM_ID            = "pay_2020M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`급여명세서조회(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 급여명세서조회 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여명세서조회  액터: 개발자
   * URL: /mis/pay/pay2020/getList.do
   * 예상결과: 급여명세서 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PAY_SLIP WHERE 1=1
   */
  test("[no:1] 급여명세서조회 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 급여명세서조회 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2020M-no1.png`, fullPage: true });

    expect(rows.length, "급여명세서조회 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 급여명세서조회 - 지급년월 조회
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여명세서조회  액터: 개발자
   * URL: /mis/pay/pay2020/getList.do
   * 예상결과: 해당 지급년월의 급여명세서가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PAY_SLIP WHERE PMT_YM = '202406'
   */
  test("[no:2] 급여명세서조회 - 지급년월 조회", async ({ workerPage: page }) => {
    logTestStart("[no:2] 급여명세서조회 - 지급년월 조회");
    logInput("PMT_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "PMT_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2020M-no2.png`, fullPage: true });

    expect(rows.length, "급여명세서조회 지급년월 조회 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_2030M — 은행이체명세서  |  API: POST /mis/pay/pay2030/getList.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay2030/getList.do";
  const PGM_ID            = "pay_2030M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_CORP_CD","SCH_YM","SCH_PMT_SEQ"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`은행이체명세서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 은행이체명세서 - 법인/지급년월 조회 (SCH_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 은행이체명세서  액터: 개발자
   * URL: /mis/pay/pay2030/getList.do
   * 예상결과: 해당 지급년월의 은행이체 명세가 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_BANK_TRNSF WHERE YM = '202406'
   */
  test("[no:1] 은행이체명세서 - 법인/지급년월 조회 (SCH_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 은행이체명세서 - 법인/지급년월 조회 (SCH_YM)");
    logInput("SCH_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2030M-no1.png`, fullPage: true });

    expect(rows.length, "은행이체명세서 법인/지급년월 조회 (SCH_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 은행이체명세서 - 지급회차 조건 조회 (SCH_PMT_SEQ)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 은행이체명세서  액터: 개발자
   * URL: /mis/pay/pay2030/getList.do
   * 예상결과: 지급회차에 해당하는 이체명세가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_BANK_TRNSF WHERE YM='202406' AND PMT_SEQ='1'
   */
  test("[no:2] 은행이체명세서 - 지급회차 조건 조회 (SCH_PMT_SEQ)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 은행이체명세서 - 지급회차 조건 조회 (SCH_PMT_SEQ)");
    logInput("SCH_YM", "202406");
    logInput("SCH_PMT_SEQ", "1");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM": "202406", "SCH_PMT_SEQ": "1" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2030M-no2.png`, fullPage: true });

    expect(rows.length, "은행이체명세서 지급회차 조건 조회 (SCH_PMT_SEQ) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 은행이체명세서 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 은행이체명세서  액터: 개발자
   * URL: /mis/pay/pay2030/getList.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_BANK_TRNSF WHERE YM = '999912'
   */
  test("[no:3] 은행이체명세서 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 은행이체명세서 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)");
    logInput("SCH_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2030M-no3.png`, fullPage: true });

    expect(rows.length, "은행이체명세서 존재하지 않는 지급년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_2040M — 원천징수이행현황  |  API: POST /mis/pay/pay1157/getList.do  |  TC 2건
{
  const API_URL           = "/mis/pay/pay1157/getList.do";
  const PGM_ID            = "pay_2040M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`원천징수이행현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 원천징수이행현황 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 원천징수이행현황  액터: 개발자
   * URL: /mis/pay/pay1157/getList.do
   * 예상결과: 원천징수이행 현황 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_WHT_STAT WHERE 1=1
   */
  test("[no:1] 원천징수이행현황 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 원천징수이행현황 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2040M-no1.png`, fullPage: true });

    expect(rows.length, "원천징수이행현황 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 원천징수이행현황 - 귀속년월 조회
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 원천징수이행현황  액터: 개발자
   * URL: /mis/pay/pay1157/getList.do
   * 예상결과: 해당 귀속년월의 원천징수이행 현황이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_WHT_STAT WHERE PMT_YM = '202406'
   */
  test("[no:2] 원천징수이행현황 - 귀속년월 조회", async ({ workerPage: page }) => {
    logTestStart("[no:2] 원천징수이행현황 - 귀속년월 조회");
    logInput("PMT_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "PMT_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2040M-no2.png`, fullPage: true });

    expect(rows.length, "원천징수이행현황 귀속년월 조회 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_2060M — 가족수당지급현황  |  API: POST /mis/pay/pay2060/getList.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay2060/getList.do";
  const PGM_ID            = "pay_2060M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_YM_FRM","SCH_YM_TO","SCH_PMT_FG","SCH_EMP_NM","SCH_EMP_NO","SCH_PAY_TYPE","SCH_WORK_DGCNT","SCH_AREA_TYPE","SCH_PAY_NM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`가족수당지급현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 가족수당지급현황 - 기간 조회 (SCH_YM_FRM~SCH_YM_TO)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 가족수당지급현황  액터: 개발자
   * URL: /mis/pay/pay2060/getList.do
   * 예상결과: 해당 기간의 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_FMLY_ALW_PMT WHERE PMT_YM BETWEEN '202401' AND '202406'
   */
  test("[no:1] 가족수당지급현황 - 기간 조회 (SCH_YM_FRM~SCH_YM_TO)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 가족수당지급현황 - 기간 조회 (SCH_YM_FRM~SCH_YM_TO)");
    logInput("SCH_YM_FRM", "202401");
    logInput("SCH_YM_TO", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM_FRM": "202401", "SCH_YM_TO": "202406" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2060M-no1.png`, fullPage: true });

    expect(rows.length, "가족수당지급현황 기간 조회 (SCH_YM_FRM~SCH_YM_TO) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 가족수당지급현황 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 가족수당지급현황  액터: 개발자
   * URL: /mis/pay/pay2060/getList.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_FMLY_ALW_PMT WHERE PMT_YM BETWEEN '202401' AND '202406' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 가족수당지급현황 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 가족수당지급현황 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_YM_FRM", "202401");
    logInput("SCH_YM_TO", "202406");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM_FRM": "202401", "SCH_YM_TO": "202406", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2060M-no2.png`, fullPage: true });

    expect(rows.length, "가족수당지급현황 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 가족수당지급현황 - 역방향 기간(시작>종료) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 가족수당지급현황  액터: 개발자
   * URL: /mis/pay/pay2060/getList.do
   * 예상결과: 역방향 기간이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_FMLY_ALW_PMT WHERE PMT_YM BETWEEN '202406' AND '202401'
   */
  test("[no:3] 가족수당지급현황 - 역방향 기간(시작>종료) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 가족수당지급현황 - 역방향 기간(시작>종료) 조회 (0건 확인)");
    logInput("SCH_YM_FRM", "202406");
    logInput("SCH_YM_TO", "202401");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM_FRM": "202406", "SCH_YM_TO": "202401" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2060M-no3.png`, fullPage: true });

    expect(rows.length, "가족수당지급현황 역방향 기간(시작>종료) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_2070M — 지급내역조회  |  API: POST /mis/pay/pay2010/getList.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay2010/getList.do";
  const PGM_ID            = "pay_2070M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_YM_FRM","SCH_YM_TO","SCH_PMT_FG","SCH_EMP_NM","SCH_EMP_NO","SCH_PAY_TYPE","SCH_WORK_DGCNT","SCH_AREA_TYPE","SCH_PAY_NM","SCH_RMK_YN"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`지급내역조회(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 지급내역조회 - 기간 조회 (SCH_YM_FRM~SCH_YM_TO)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급내역조회  액터: 개발자
   * URL: /mis/pay/pay2010/getList.do
   * 예상결과: 해당 기간의 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_DTL WHERE PMT_YM BETWEEN '202401' AND '202406'
   */
  test("[no:1] 지급내역조회 - 기간 조회 (SCH_YM_FRM~SCH_YM_TO)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 지급내역조회 - 기간 조회 (SCH_YM_FRM~SCH_YM_TO)");
    logInput("SCH_YM_FRM", "202401");
    logInput("SCH_YM_TO", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM_FRM": "202401", "SCH_YM_TO": "202406" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2070M-no1.png`, fullPage: true });

    expect(rows.length, "지급내역조회 기간 조회 (SCH_YM_FRM~SCH_YM_TO) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 지급내역조회 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급내역조회  액터: 개발자
   * URL: /mis/pay/pay2010/getList.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_DTL WHERE PMT_YM BETWEEN '202401' AND '202406' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 지급내역조회 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 지급내역조회 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_YM_FRM", "202401");
    logInput("SCH_YM_TO", "202406");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM_FRM": "202401", "SCH_YM_TO": "202406", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2070M-no2.png`, fullPage: true });

    expect(rows.length, "지급내역조회 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 지급내역조회 - 역방향 기간(시작>종료) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급내역조회  액터: 개발자
   * URL: /mis/pay/pay2010/getList.do
   * 예상결과: 역방향 기간이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_DTL WHERE PMT_YM BETWEEN '202406' AND '202401'
   */
  test("[no:3] 지급내역조회 - 역방향 기간(시작>종료) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 지급내역조회 - 역방향 기간(시작>종료) 조회 (0건 확인)");
    logInput("SCH_YM_FRM", "202406");
    logInput("SCH_YM_TO", "202401");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM_FRM": "202406", "SCH_YM_TO": "202401" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2070M-no3.png`, fullPage: true });

    expect(rows.length, "지급내역조회 역방향 기간(시작>종료) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_2080M — 4대보험현황  |  API: POST /mis/pay/pay2080/getList.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay2080/getList.do";
  const PGM_ID            = "pay_2080M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_CORP_CD","SCH_PMT_YM","SCH_PMT_SEQ","SCH_EMP_NO","SCH_EMP_NM","SCH_EMP_RID","SCH_RP_FG_CD"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`4대보험현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 4대보험현황 - 지급년월 조회 (SCH_PMT_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 4대보험현황  액터: 개발자
   * URL: /mis/pay/pay2080/getList.do
   * 예상결과: 해당 지급년월의 4대보험 현황이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_INSU_STAT WHERE PMT_YM = '202406'
   */
  test("[no:1] 4대보험현황 - 지급년월 조회 (SCH_PMT_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 4대보험현황 - 지급년월 조회 (SCH_PMT_YM)");
    logInput("SCH_PMT_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_PMT_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2080M-no1.png`, fullPage: true });

    expect(rows.length, "4대보험현황 지급년월 조회 (SCH_PMT_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 4대보험현황 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 4대보험현황  액터: 개발자
   * URL: /mis/pay/pay2080/getList.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_INSU_STAT WHERE PMT_YM='202406' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 4대보험현황 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 4대보험현황 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_PMT_YM", "202406");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_PMT_YM": "202406", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2080M-no2.png`, fullPage: true });

    expect(rows.length, "4대보험현황 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 4대보험현황 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 4대보험현황  액터: 개발자
   * URL: /mis/pay/pay2080/getList.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_INSU_STAT WHERE PMT_YM = '999912'
   */
  test("[no:3] 4대보험현황 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 4대보험현황 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)");
    logInput("SCH_PMT_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_PMT_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2080M-no3.png`, fullPage: true });

    expect(rows.length, "4대보험현황 존재하지 않는 지급년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_2090M — 수당별연간급여현황  |  API: POST /mis/pay/pay2090/getList.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay2090/getList.do";
  const PGM_ID            = "pay_2090M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_YM_FRM","SCH_YM_TO","SCH_SAL_ITM_CD","SCH_SAL_ITM_NM","SCH_EMP_NO","SCH_WORK_DGCNT","SCH_EMP_NM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`수당별연간급여현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 수당별연간급여현황 - 기간 조회 (SCH_YM_FRM~SCH_YM_TO)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 수당별연간급여현황  액터: 개발자
   * URL: /mis/pay/pay2090/getList.do
   * 예상결과: 해당 기간의 수당별 연간 급여현황이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_ALW_YEAR_STAT WHERE PMT_YM BETWEEN '202401' AND '202412'
   */
  test("[no:1] 수당별연간급여현황 - 기간 조회 (SCH_YM_FRM~SCH_YM_TO)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 수당별연간급여현황 - 기간 조회 (SCH_YM_FRM~SCH_YM_TO)");
    logInput("SCH_YM_FRM", "202401");
    logInput("SCH_YM_TO", "202412");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM_FRM": "202401", "SCH_YM_TO": "202412" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2090M-no1.png`, fullPage: true });

    expect(rows.length, "수당별연간급여현황 기간 조회 (SCH_YM_FRM~SCH_YM_TO) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 수당별연간급여현황 - 수당항목명 검색 (SCH_SAL_ITM_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 수당별연간급여현황  액터: 개발자
   * URL: /mis/pay/pay2090/getList.do
   * 예상결과: 수당항목명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_ALW_YEAR_STAT WHERE SAL_ITM_NM LIKE '%수당%'
   */
  test("[no:2] 수당별연간급여현황 - 수당항목명 검색 (SCH_SAL_ITM_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 수당별연간급여현황 - 수당항목명 검색 (SCH_SAL_ITM_NM)");
    logInput("SCH_YM_FRM", "202401");
    logInput("SCH_YM_TO", "202412");
    logInput("SCH_SAL_ITM_NM", "수당");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM_FRM": "202401", "SCH_YM_TO": "202412", "SCH_SAL_ITM_NM": "수당" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2090M-no2.png`, fullPage: true });

    expect(rows.length, "수당별연간급여현황 수당항목명 검색 (SCH_SAL_ITM_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 수당별연간급여현황 - 역방향 기간(시작>종료) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 수당별연간급여현황  액터: 개발자
   * URL: /mis/pay/pay2090/getList.do
   * 예상결과: 역방향 기간이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_ALW_YEAR_STAT WHERE PMT_YM BETWEEN '202412' AND '202401'
   */
  test("[no:3] 수당별연간급여현황 - 역방향 기간(시작>종료) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 수당별연간급여현황 - 역방향 기간(시작>종료) 조회 (0건 확인)");
    logInput("SCH_YM_FRM", "202412");
    logInput("SCH_YM_TO", "202401");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM_FRM": "202412", "SCH_YM_TO": "202401" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2090M-no3.png`, fullPage: true });

    expect(rows.length, "수당별연간급여현황 역방향 기간(시작>종료) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_2110M — 원천징수이행상황신고서  |  API: POST /mis/pay/pay4100/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay4100/getData.do";
  const PGM_ID            = "pay_2110M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_YYMM","SCH_CORP_CD","SCH_STD_DT"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`원천징수이행상황신고서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 원천징수이행상황신고서 - 귀속년월 조회 (SCH_YYMM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 원천징수이행상황신고서  액터: 개발자
   * URL: /mis/pay/pay4100/getData.do
   * 예상결과: 해당 귀속년월의 원천징수이행상황 신고서가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_WHT_RPT WHERE YYMM = '202406'
   */
  test("[no:1] 원천징수이행상황신고서 - 귀속년월 조회 (SCH_YYMM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 원천징수이행상황신고서 - 귀속년월 조회 (SCH_YYMM)");
    logInput("SCH_YYMM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YYMM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2110M-no1.png`, fullPage: true });

    expect(rows.length, "원천징수이행상황신고서 귀속년월 조회 (SCH_YYMM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 원천징수이행상황신고서 - 법인 조건 조회 (SCH_CORP_CD)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 원천징수이행상황신고서  액터: 개발자
   * URL: /mis/pay/pay4100/getData.do
   * 예상결과: 법인 조건에 해당하는 신고서가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_WHT_RPT WHERE YYMM='202406' AND CORP_CD='01'
   */
  test("[no:2] 원천징수이행상황신고서 - 법인 조건 조회 (SCH_CORP_CD)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 원천징수이행상황신고서 - 법인 조건 조회 (SCH_CORP_CD)");
    logInput("SCH_YYMM", "202406");
    logInput("SCH_CORP_CD", "01");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YYMM": "202406", "SCH_CORP_CD": "01" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2110M-no2.png`, fullPage: true });

    expect(rows.length, "원천징수이행상황신고서 법인 조건 조회 (SCH_CORP_CD) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 원천징수이행상황신고서 - 존재하지 않는 귀속년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 원천징수이행상황신고서  액터: 개발자
   * URL: /mis/pay/pay4100/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_WHT_RPT WHERE YYMM = '999912'
   */
  test("[no:3] 원천징수이행상황신고서 - 존재하지 않는 귀속년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 원천징수이행상황신고서 - 존재하지 않는 귀속년월(999912) 조회 (0건 확인)");
    logInput("SCH_YYMM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YYMM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_2110M-no3.png`, fullPage: true });

    expect(rows.length, "원천징수이행상황신고서 존재하지 않는 귀속년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_3010M — 지급기준설정관리  |  API: POST /mis/pay/pay3010/getList.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay3010/getList.do";
  const PGM_ID            = "pay_3010M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_CORP_CD","SCH_YY","SCH_PMT_FG"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`지급기준설정관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 지급기준설정관리 - 기준년도 조회 (SCH_YY)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급기준설정관리  액터: 개발자
   * URL: /mis/pay/pay3010/getList.do
   * 예상결과: 해당 기준년도의 지급기준 설정이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_STD_SET WHERE YY = '2024'
   */
  test("[no:1] 지급기준설정관리 - 기준년도 조회 (SCH_YY)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 지급기준설정관리 - 기준년도 조회 (SCH_YY)");
    logInput("SCH_YY", "2024");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YY": "2024" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_3010M-no1.png`, fullPage: true });

    expect(rows.length, "지급기준설정관리 기준년도 조회 (SCH_YY) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 지급기준설정관리 - 지급구분 조건 조회 (SCH_PMT_FG)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급기준설정관리  액터: 개발자
   * URL: /mis/pay/pay3010/getList.do
   * 예상결과: 지급구분에 해당하는 설정이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_STD_SET WHERE YY='2024' AND PMT_FG='1'
   */
  test("[no:2] 지급기준설정관리 - 지급구분 조건 조회 (SCH_PMT_FG)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 지급기준설정관리 - 지급구분 조건 조회 (SCH_PMT_FG)");
    logInput("SCH_YY", "2024");
    logInput("SCH_PMT_FG", "1");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YY": "2024", "SCH_PMT_FG": "1" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_3010M-no2.png`, fullPage: true });

    expect(rows.length, "지급기준설정관리 지급구분 조건 조회 (SCH_PMT_FG) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 지급기준설정관리 - 존재하지 않는 년도(9999) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급기준설정관리  액터: 개발자
   * URL: /mis/pay/pay3010/getList.do
   * 예상결과: 존재하지 않는 년도이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_STD_SET WHERE YY = '9999'
   */
  test("[no:3] 지급기준설정관리 - 존재하지 않는 년도(9999) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 지급기준설정관리 - 존재하지 않는 년도(9999) 조회 (0건 확인)");
    logInput("SCH_YY", "9999");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YY": "9999" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_3010M-no3.png`, fullPage: true });

    expect(rows.length, "지급기준설정관리 존재하지 않는 년도(9999) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_3020M — 지급대상자관리  |  API: POST /mis/pay/pay3020/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay3020/getData.do";
  const PGM_ID            = "pay_3020M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_CORP_CD","SCH_YM","SCH_PMT_SEQ","SCH_EMP_RID","SCH_EMP_NO","SCH_EMP_NM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`지급대상자관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 지급대상자관리 - 지급년월 조회 (SCH_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급대상자관리  액터: 개발자
   * URL: /mis/pay/pay3020/getData.do
   * 예상결과: 해당 지급년월의 지급대상자가 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_TGT WHERE YM = '202406'
   */
  test("[no:1] 지급대상자관리 - 지급년월 조회 (SCH_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 지급대상자관리 - 지급년월 조회 (SCH_YM)");
    logInput("SCH_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_3020M-no1.png`, fullPage: true });

    expect(rows.length, "지급대상자관리 지급년월 조회 (SCH_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 지급대상자관리 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급대상자관리  액터: 개발자
   * URL: /mis/pay/pay3020/getData.do
   * 예상결과: 성명 키워드가 포함된 지급대상자가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_TGT WHERE YM='202406' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 지급대상자관리 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 지급대상자관리 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_YM", "202406");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM": "202406", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_3020M-no2.png`, fullPage: true });

    expect(rows.length, "지급대상자관리 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 지급대상자관리 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급대상자관리  액터: 개발자
   * URL: /mis/pay/pay3020/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_TGT WHERE YM = '999912'
   */
  test("[no:3] 지급대상자관리 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 지급대상자관리 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)");
    logInput("SCH_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_3020M-no3.png`, fullPage: true });

    expect(rows.length, "지급대상자관리 존재하지 않는 지급년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_3030M — 지급액계산  |  API: POST /mis/pay/pay3030/getList.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay3030/getList.do";
  const PGM_ID            = "pay_3030M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_CORP_CD","SCH_PMT_YM","SCH_PMT_SEQ","SCH_PMT_FG","SCH_DEPT_CD","SCH_DEPT_NM","SCH_EMP_RID","SCH_EMP_NO","SCH_EMP_NM","SCH_CAL","SCH_BUSI","SCH_PMT_DCSN_YN","SCH_PMT_NOTI_YN"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`지급액계산(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 지급액계산 - 지급년월 조회 (SCH_PMT_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급액계산  액터: 개발자
   * URL: /mis/pay/pay3030/getList.do
   * 예상결과: 해당 지급년월의 지급액 계산 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_CALC WHERE PMT_YM = '202406'
   */
  test("[no:1] 지급액계산 - 지급년월 조회 (SCH_PMT_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 지급액계산 - 지급년월 조회 (SCH_PMT_YM)");
    logInput("SCH_PMT_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_PMT_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_3030M-no1.png`, fullPage: true });

    expect(rows.length, "지급액계산 지급년월 조회 (SCH_PMT_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 지급액계산 - 부서 조건 조회 (SCH_DEPT_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급액계산  액터: 개발자
   * URL: /mis/pay/pay3030/getList.do
   * 예상결과: 부서 조건에 해당하는 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_CALC WHERE PMT_YM='202406' AND DEPT_NM LIKE '%총무%'
   */
  test("[no:2] 지급액계산 - 부서 조건 조회 (SCH_DEPT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 지급액계산 - 부서 조건 조회 (SCH_DEPT_NM)");
    logInput("SCH_PMT_YM", "202406");
    logInput("SCH_DEPT_NM", "총무");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_PMT_YM": "202406", "SCH_DEPT_NM": "총무" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_3030M-no2.png`, fullPage: true });

    expect(rows.length, "지급액계산 부서 조건 조회 (SCH_DEPT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 지급액계산 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 지급액계산  액터: 개발자
   * URL: /mis/pay/pay3030/getList.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_CALC WHERE PMT_YM = '999912'
   */
  test("[no:3] 지급액계산 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 지급액계산 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)");
    logInput("SCH_PMT_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_PMT_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_3030M-no3.png`, fullPage: true });

    expect(rows.length, "지급액계산 존재하지 않는 지급년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_3040M — 급여확정  |  API: POST /mis/pay/pay3040/getList.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay3040/getList.do";
  const PGM_ID            = "pay_3040M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_CORP_CD","SCH_YM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`급여확정(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 급여확정 - 지급년월 조회 (SCH_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여확정  액터: 개발자
   * URL: /mis/pay/pay3040/getList.do
   * 예상결과: 해당 지급년월의 급여확정 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_CONF WHERE YM = '202406'
   */
  test("[no:1] 급여확정 - 지급년월 조회 (SCH_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 급여확정 - 지급년월 조회 (SCH_YM)");
    logInput("SCH_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_3040M-no1.png`, fullPage: true });

    expect(rows.length, "급여확정 지급년월 조회 (SCH_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 급여확정 - 법인 조건 조회 (SCH_CORP_CD)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여확정  액터: 개발자
   * URL: /mis/pay/pay3040/getList.do
   * 예상결과: 법인 조건에 해당하는 급여확정 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_CONF WHERE YM='202406' AND CORP_CD='01'
   */
  test("[no:2] 급여확정 - 법인 조건 조회 (SCH_CORP_CD)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 급여확정 - 법인 조건 조회 (SCH_CORP_CD)");
    logInput("SCH_YM", "202406");
    logInput("SCH_CORP_CD", "01");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM": "202406", "SCH_CORP_CD": "01" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_3040M-no2.png`, fullPage: true });

    expect(rows.length, "급여확정 법인 조건 조회 (SCH_CORP_CD) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 급여확정 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여확정  액터: 개발자
   * URL: /mis/pay/pay3040/getList.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_CONF WHERE YM = '999912'
   */
  test("[no:3] 급여확정 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 급여확정 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)");
    logInput("SCH_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_3040M-no3.png`, fullPage: true });

    expect(rows.length, "급여확정 존재하지 않는 지급년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_4010M — 급여분개기준관리  |  API: POST /mis/pay/pay4010/getAggMstDtl.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay4010/getAggMstDtl.do";
  const PGM_ID            = "pay_4010M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_SAL_JNLZ_FG","SCH_AGG_ITM_CD","SCH_DAR_FG","SCH_JNLZ_MTOD"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`급여분개기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 급여분개기준관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여분개기준관리  액터: 개발자
   * URL: /mis/pay/pay4010/getAggMstDtl.do
   * 예상결과: 급여분개기준 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_JNLZ_STD WHERE 1=1
   */
  test("[no:1] 급여분개기준관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 급여분개기준관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getAggMstDtl.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4010M-no1.png`, fullPage: true });

    expect(rows.length, "급여분개기준관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 급여분개기준관리 - 분개구분 조건 조회 (SCH_SAL_JNLZ_FG)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여분개기준관리  액터: 개발자
   * URL: /mis/pay/pay4010/getAggMstDtl.do
   * 예상결과: 분개구분에 해당하는 기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_JNLZ_STD WHERE SAL_JNLZ_FG='1'
   */
  test("[no:2] 급여분개기준관리 - 분개구분 조건 조회 (SCH_SAL_JNLZ_FG)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 급여분개기준관리 - 분개구분 조건 조회 (SCH_SAL_JNLZ_FG)");
    logInput("SCH_SAL_JNLZ_FG", "1");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_SAL_JNLZ_FG": "1" }));
    const result = await assertNexacroResponse(resp, "getAggMstDtl.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4010M-no2.png`, fullPage: true });

    expect(rows.length, "급여분개기준관리 분개구분 조건 조회 (SCH_SAL_JNLZ_FG) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 급여분개기준관리 - 존재하지 않는 집계항목(ZZ) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여분개기준관리  액터: 개발자
   * URL: /mis/pay/pay4010/getAggMstDtl.do
   * 예상결과: 존재하지 않는 집계항목이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_JNLZ_STD WHERE AGG_ITM_CD='ZZ'
   */
  test("[no:3] 급여분개기준관리 - 존재하지 않는 집계항목(ZZ) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 급여분개기준관리 - 존재하지 않는 집계항목(ZZ) 조회 (0건 확인)");
    logInput("SCH_AGG_ITM_CD", "ZZ");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_AGG_ITM_CD": "ZZ" }));
    const result = await assertNexacroResponse(resp, "getAggMstDtl.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4010M-no3.png`, fullPage: true });

    expect(rows.length, "급여분개기준관리 존재하지 않는 집계항목(ZZ) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_4011M — 분개기준예산변경  |  API: POST /mis/pay/pay4010/searchPopBudgList.do  |  TC 1건
{
  const API_URL           = "/mis/pay/pay4010/searchPopBudgList.do";
  const PGM_ID            = "pay_4011M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`분개기준예산변경(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 분개기준예산변경 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 분개기준예산변경  액터: 개발자
   * URL: /mis/pay/pay4010/searchPopBudgList.do
   * 예상결과: 분개기준 예산변경 대상 예산 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_JNLZ_BUDG WHERE 1=1
   */
  test("[no:1] 분개기준예산변경 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 분개기준예산변경 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "searchPopBudgList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4011M-no1.png`, fullPage: true });

    expect(rows.length, "분개기준예산변경 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_4100M — 분개항목관리  |  API: POST /mis/pay/pay4100/getJnlzItmList.do  |  TC 1건
{
  const API_URL           = "/mis/pay/pay4100/getJnlzItmList.do";
  const PGM_ID            = "pay_4100M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`분개항목관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 분개항목관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 분개항목관리  액터: 개발자
   * URL: /mis/pay/pay4100/getJnlzItmList.do
   * 예상결과: 분개항목 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_JNLZ_ITM WHERE 1=1
   */
  test("[no:1] 분개항목관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 분개항목관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getJnlzItmList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4100M-no1.png`, fullPage: true });

    expect(rows.length, "분개항목관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_4105M — 분개대상직제그룹관리  |  API: POST /mis/pay/pay4105/getOrgGrpNmList.do  |  TC 2건
{
  const API_URL           = "/mis/pay/pay4105/getOrgGrpNmList.do";
  const PGM_ID            = "pay_4105M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_OCGNZ_GRP_NM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`분개대상직제그룹관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 분개대상직제그룹관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 분개대상직제그룹관리  액터: 개발자
   * URL: /mis/pay/pay4105/getOrgGrpNmList.do
   * 예상결과: 분개대상 직제그룹 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_JNLZ_ORG_GRP WHERE 1=1
   */
  test("[no:1] 분개대상직제그룹관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 분개대상직제그룹관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getOrgGrpNmList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4105M-no1.png`, fullPage: true });

    expect(rows.length, "분개대상직제그룹관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 분개대상직제그룹관리 - 그룹명 키워드 검색 (SCH_OCGNZ_GRP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 분개대상직제그룹관리  액터: 개발자
   * URL: /mis/pay/pay4105/getOrgGrpNmList.do
   * 예상결과: 그룹명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_JNLZ_ORG_GRP WHERE OCGNZ_GRP_NM LIKE '%본부%'
   */
  test("[no:2] 분개대상직제그룹관리 - 그룹명 키워드 검색 (SCH_OCGNZ_GRP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 분개대상직제그룹관리 - 그룹명 키워드 검색 (SCH_OCGNZ_GRP_NM)");
    logInput("SCH_OCGNZ_GRP_NM", "본부");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_OCGNZ_GRP_NM": "본부" }));
    const result = await assertNexacroResponse(resp, "getOrgGrpNmList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4105M-no2.png`, fullPage: true });

    expect(rows.length, "분개대상직제그룹관리 그룹명 키워드 검색 (SCH_OCGNZ_GRP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_4110M — 분개기준관리  |  API: POST /mis/pay/pay4110/getList.do  |  TC 2건
{
  const API_URL           = "/mis/pay/pay4110/getList.do";
  const PGM_ID            = "pay_4110M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`분개기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 분개기준관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 분개기준관리  액터: 개발자
   * URL: /mis/pay/pay4110/getList.do
   * 예상결과: 분개기준 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_JNLZ_STD_MGT WHERE 1=1
   */
  test("[no:1] 분개기준관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 분개기준관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4110M-no1.png`, fullPage: true });

    expect(rows.length, "분개기준관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 분개기준관리 - 적용년월 조회
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 분개기준관리  액터: 개발자
   * URL: /mis/pay/pay4110/getList.do
   * 예상결과: 해당 적용년월의 분개기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_JNLZ_STD_MGT WHERE APP_YM='202406'
   */
  test("[no:2] 분개기준관리 - 적용년월 조회", async ({ workerPage: page }) => {
    logTestStart("[no:2] 분개기준관리 - 적용년월 조회");
    logInput("APP_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "APP_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4110M-no2.png`, fullPage: true });

    expect(rows.length, "분개기준관리 적용년월 조회 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_4130M — 예외분개기준  |  API: POST /mis/pay/pay4130/getEmpList.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay4130/getEmpList.do";
  const PGM_ID            = "pay_4130M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_APLY_YM","SCH_JNLZ_FG","SCH_EMP_RID","SCH_EMP_NO","SCH_EMP_NM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`예외분개기준(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 예외분개기준 - 적용년월 조회 (SCH_APLY_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 예외분개기준  액터: 개발자
   * URL: /mis/pay/pay4130/getEmpList.do
   * 예상결과: 해당 적용년월의 예외분개기준 대상자가 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_JNLZ_EXCPT WHERE APLY_YM='202406'
   */
  test("[no:1] 예외분개기준 - 적용년월 조회 (SCH_APLY_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 예외분개기준 - 적용년월 조회 (SCH_APLY_YM)");
    logInput("SCH_APLY_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APLY_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getEmpList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4130M-no1.png`, fullPage: true });

    expect(rows.length, "예외분개기준 적용년월 조회 (SCH_APLY_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 예외분개기준 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 예외분개기준  액터: 개발자
   * URL: /mis/pay/pay4130/getEmpList.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_JNLZ_EXCPT WHERE APLY_YM='202406' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 예외분개기준 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 예외분개기준 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_APLY_YM", "202406");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APLY_YM": "202406", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getEmpList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4130M-no2.png`, fullPage: true });

    expect(rows.length, "예외분개기준 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 예외분개기준 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 예외분개기준  액터: 개발자
   * URL: /mis/pay/pay4130/getEmpList.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_JNLZ_EXCPT WHERE APLY_YM='999912'
   */
  test("[no:3] 예외분개기준 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 예외분개기준 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)");
    logInput("SCH_APLY_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APLY_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getEmpList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4130M-no3.png`, fullPage: true });

    expect(rows.length, "예외분개기준 존재하지 않는 적용년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_4150M — 급여지급결의서목록  |  API: POST /mis/pay/pay4150/getData.do  |  TC 2건
{
  const API_URL           = "/mis/pay/pay4150/getData.do";
  const PGM_ID            = "pay_4150M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_PGM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`급여지급결의서목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 급여지급결의서목록 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여지급결의서목록  액터: 개발자
   * URL: /mis/pay/pay4150/getData.do
   * 예상결과: 급여지급결의서 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_RSLV WHERE 1=1
   */
  test("[no:1] 급여지급결의서목록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 급여지급결의서목록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4150M-no1.png`, fullPage: true });

    expect(rows.length, "급여지급결의서목록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 급여지급결의서목록 - 프로그램 조건 조회 (SCH_PGM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여지급결의서목록  액터: 개발자
   * URL: /mis/pay/pay4150/getData.do
   * 예상결과: 프로그램 조건에 해당하는 결의서 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_RSLV WHERE PGM LIKE '%pay%'
   */
  test("[no:2] 급여지급결의서목록 - 프로그램 조건 조회 (SCH_PGM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 급여지급결의서목록 - 프로그램 조건 조회 (SCH_PGM)");
    logInput("SCH_PGM", "pay");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_PGM": "pay" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4150M-no2.png`, fullPage: true });

    expect(rows.length, "급여지급결의서목록 프로그램 조건 조회 (SCH_PGM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_4151M — 급여지급결의서등록  |  API: POST /mis/pay/pay4151/getData.do  |  TC 1건
{
  const API_URL           = "/mis/pay/pay4151/getData.do";
  const PGM_ID            = "pay_4151M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`급여지급결의서등록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 급여지급결의서등록 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여지급결의서등록  액터: 개발자
   * URL: /mis/pay/pay4151/getData.do
   * 예상결과: 상세 데이터가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_PMT_RSLV_DTL WHERE 1=1
   */
  test("[no:1] 급여지급결의서등록 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 급여지급결의서등록 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_4151M-no1.png`, fullPage: true });

    expect(rows.length, "급여지급결의서등록 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_5010M — 근속연수공제관리  |  API: POST /mis/pay/pay5010/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay5010/getData.do";
  const PGM_ID            = "pay_5010M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_APP_YM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`근속연수공제관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 근속연수공제관리 - 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 근속연수공제관리  액터: 개발자
   * URL: /mis/pay/pay5010/getData.do
   * 예상결과: 해당 적용년월의 근속연수공제 기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_SVC_YEAR_DDC WHERE APP_YM='202406'
   */
  test("[no:1] 근속연수공제관리 - 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 근속연수공제관리 - 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5010M-no1.png`, fullPage: true });

    expect(rows.length, "근속연수공제관리 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 근속연수공제관리 - 과거 적용년월 조회 (SCH_APP_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 근속연수공제관리  액터: 개발자
   * URL: /mis/pay/pay5010/getData.do
   * 예상결과: 과거 적용년월의 근속연수공제 기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_SVC_YEAR_DDC WHERE APP_YM='202301'
   */
  test("[no:2] 근속연수공제관리 - 과거 적용년월 조회 (SCH_APP_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 근속연수공제관리 - 과거 적용년월 조회 (SCH_APP_YM)");
    logInput("SCH_APP_YM", "202301");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "202301" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5010M-no2.png`, fullPage: true });

    expect(rows.length, "근속연수공제관리 과거 적용년월 조회 (SCH_APP_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 근속연수공제관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 근속연수공제관리  액터: 개발자
   * URL: /mis/pay/pay5010/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_SVC_YEAR_DDC WHERE APP_YM='999912'
   */
  test("[no:3] 근속연수공제관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 근속연수공제관리 - 존재하지 않는 적용년월(999912) 조회 (0건 확인)");
    logInput("SCH_APP_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_APP_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5010M-no3.png`, fullPage: true });

    expect(rows.length, "근속연수공제관리 존재하지 않는 적용년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_5020M — 퇴직금계산  |  API: POST /mis/pay/pay5020/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay5020/getData.do";
  const PGM_ID            = "pay_5020M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_YYMM","SCH_EMP_NM","SCH_EMP_RID","SCH_EMP_NO","SCH_EMP_CLS"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`퇴직금계산(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 퇴직금계산 - 기준년월 조회 (SCH_YYMM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 퇴직금계산  액터: 개발자
   * URL: /mis/pay/pay5020/getData.do
   * 예상결과: 해당 기준년월의 퇴직금 계산 대상이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_RTMT_CALC WHERE YYMM='202406'
   */
  test("[no:1] 퇴직금계산 - 기준년월 조회 (SCH_YYMM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 퇴직금계산 - 기준년월 조회 (SCH_YYMM)");
    logInput("SCH_YYMM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YYMM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5020M-no1.png`, fullPage: true });

    expect(rows.length, "퇴직금계산 기준년월 조회 (SCH_YYMM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 퇴직금계산 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 퇴직금계산  액터: 개발자
   * URL: /mis/pay/pay5020/getData.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_RTMT_CALC WHERE YYMM='202406' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 퇴직금계산 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 퇴직금계산 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_YYMM", "202406");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YYMM": "202406", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5020M-no2.png`, fullPage: true });

    expect(rows.length, "퇴직금계산 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 퇴직금계산 - 존재하지 않는 기준년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 퇴직금계산  액터: 개발자
   * URL: /mis/pay/pay5020/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_RTMT_CALC WHERE YYMM='999912'
   */
  test("[no:3] 퇴직금계산 - 존재하지 않는 기준년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 퇴직금계산 - 존재하지 않는 기준년월(999912) 조회 (0건 확인)");
    logInput("SCH_YYMM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YYMM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5020M-no3.png`, fullPage: true });

    expect(rows.length, "퇴직금계산 존재하지 않는 기준년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_5021M — 정산내역조회  |  API: POST /mis/pay/pay5021/getData.do  |  TC 1건
{
  const API_URL           = "/mis/pay/pay5021/getData.do";
  const PGM_ID            = "pay_5021M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`정산내역조회(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 정산내역조회 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 정산내역조회  액터: 개발자
   * URL: /mis/pay/pay5021/getData.do
   * 예상결과: 정산내역이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_STLE_DTL WHERE 1=1
   */
  test("[no:1] 정산내역조회 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 정산내역조회 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5021M-no1.png`, fullPage: true });

    expect(rows.length, "정산내역조회 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_5040M — 퇴직소득지급명세생성  |  API: POST /mis/pay/pay5040/getTaxMain.do  |  TC 1건
{
  const API_URL           = "/mis/pay/pay5040/getTaxMain.do";
  const PGM_ID            = "pay_5040M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`퇴직소득지급명세생성(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 퇴직소득지급명세생성 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 퇴직소득지급명세생성  액터: 개발자
   * URL: /mis/pay/pay5040/getTaxMain.do
   * 예상결과: 퇴직소득 지급명세 생성 대상이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_RTMT_TAX WHERE 1=1
   */
  test("[no:1] 퇴직소득지급명세생성 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 퇴직소득지급명세생성 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getTaxMain.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5040M-no1.png`, fullPage: true });

    expect(rows.length, "퇴직소득지급명세생성 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_5050M — 퇴직급여충당금계산  |  API: POST /mis/pay/pay5050/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay5050/getData.do";
  const PGM_ID            = "pay_5050M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_YYMM_FRM","SCH_YYMM_TO","SCH_EMP_RID","SCH_EMP_NM","SCH_EMP_NO","SCH_CALC_YYMM","SCH_RP_FG","SCH_RP_JOIN_FG"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`퇴직급여충당금계산(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 퇴직급여충당금계산 - 기간 조회 (SCH_YYMM_FRM~SCH_YYMM_TO)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 퇴직급여충당금계산  액터: 개발자
   * URL: /mis/pay/pay5050/getData.do
   * 예상결과: 해당 기간의 퇴직급여충당금 계산 대상이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_RTMT_RSRV WHERE CALC_YYMM BETWEEN '202401' AND '202406'
   */
  test("[no:1] 퇴직급여충당금계산 - 기간 조회 (SCH_YYMM_FRM~SCH_YYMM_TO)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 퇴직급여충당금계산 - 기간 조회 (SCH_YYMM_FRM~SCH_YYMM_TO)");
    logInput("SCH_YYMM_FRM", "202401");
    logInput("SCH_YYMM_TO", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YYMM_FRM": "202401", "SCH_YYMM_TO": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5050M-no1.png`, fullPage: true });

    expect(rows.length, "퇴직급여충당금계산 기간 조회 (SCH_YYMM_FRM~SCH_YYMM_TO) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 퇴직급여충당금계산 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 퇴직급여충당금계산  액터: 개발자
   * URL: /mis/pay/pay5050/getData.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_RTMT_RSRV WHERE EMP_NM LIKE '%김%'
   */
  test("[no:2] 퇴직급여충당금계산 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 퇴직급여충당금계산 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_YYMM_FRM", "202401");
    logInput("SCH_YYMM_TO", "202406");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YYMM_FRM": "202401", "SCH_YYMM_TO": "202406", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5050M-no2.png`, fullPage: true });

    expect(rows.length, "퇴직급여충당금계산 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 퇴직급여충당금계산 - 역방향 기간(시작>종료) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 퇴직급여충당금계산  액터: 개발자
   * URL: /mis/pay/pay5050/getData.do
   * 예상결과: 역방향 기간이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_RTMT_RSRV WHERE CALC_YYMM BETWEEN '202406' AND '202401'
   */
  test("[no:3] 퇴직급여충당금계산 - 역방향 기간(시작>종료) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 퇴직급여충당금계산 - 역방향 기간(시작>종료) 조회 (0건 확인)");
    logInput("SCH_YYMM_FRM", "202406");
    logInput("SCH_YYMM_TO", "202401");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_YYMM_FRM": "202406", "SCH_YYMM_TO": "202401" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5050M-no3.png`, fullPage: true });

    expect(rows.length, "퇴직급여충당금계산 역방향 기간(시작>종료) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_5060M — 퇴직연금가입자관리  |  API: POST /mis/pay/pay5060/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay5060/getData.do";
  const PGM_ID            = "pay_5060M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_DEPT_CD","SCH_DEPT_NM","SCH_EMP_RID","SCH_EMP_NO","SCH_EMP_NM","SCH_HOLD_OFFI","SCH_JOIN_YN","SCH_RP_FG","SCH_RP_JOIN_FG"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`퇴직연금가입자관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 퇴직연금가입자관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 퇴직연금가입자관리  액터: 개발자
   * URL: /mis/pay/pay5060/getData.do
   * 예상결과: 퇴직연금 가입자 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_RP_JOIN WHERE 1=1
   */
  test("[no:1] 퇴직연금가입자관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 퇴직연금가입자관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5060M-no1.png`, fullPage: true });

    expect(rows.length, "퇴직연금가입자관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 퇴직연금가입자관리 - 가입여부 조건 조회 (SCH_JOIN_YN)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 퇴직연금가입자관리  액터: 개발자
   * URL: /mis/pay/pay5060/getData.do
   * 예상결과: 가입여부 조건에 해당하는 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_RP_JOIN WHERE JOIN_YN='Y'
   */
  test("[no:2] 퇴직연금가입자관리 - 가입여부 조건 조회 (SCH_JOIN_YN)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 퇴직연금가입자관리 - 가입여부 조건 조회 (SCH_JOIN_YN)");
    logInput("SCH_JOIN_YN", "Y");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_JOIN_YN": "Y" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5060M-no2.png`, fullPage: true });

    expect(rows.length, "퇴직연금가입자관리 가입여부 조건 조회 (SCH_JOIN_YN) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 퇴직연금가입자관리 - 존재하지 않는 사원번호(0000000000) 조회
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 퇴직연금가입자관리  액터: 개발자
   * URL: /mis/pay/pay5060/getData.do
   * 예상결과: 존재하지 않는 사원이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_RP_JOIN WHERE EMP_NO='0000000000'
   */
  test("[no:3] 퇴직연금가입자관리 - 존재하지 않는 사원번호(0000000000) 조회", async ({ workerPage: page }) => {
    logTestStart("[no:3] 퇴직연금가입자관리 - 존재하지 않는 사원번호(0000000000) 조회");
    logInput("SCH_EMP_NO", "0000000000");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_EMP_NO": "0000000000" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5060M-no3.png`, fullPage: true });

    expect(rows.length, "퇴직연금가입자관리 존재하지 않는 사원번호(0000000000) 조회 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_5070M — 퇴직급여충당금현황  |  API: POST /mis/pay/pay5070/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay5070/getData.do";
  const PGM_ID            = "pay_5070M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_PMT_YM","SCH_PMT_SEQ","SCH_EMP_NO","SCH_EMP_NM","SCH_WORK_DGCNT","SCH_RP_FG_CD"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`퇴직급여충당금현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 퇴직급여충당금현황 - 지급년월 조회 (SCH_PMT_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 퇴직급여충당금현황  액터: 개발자
   * URL: /mis/pay/pay5070/getData.do
   * 예상결과: 해당 지급년월의 퇴직급여충당금 현황이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_RTMT_RSRV_STAT WHERE PMT_YM='202406'
   */
  test("[no:1] 퇴직급여충당금현황 - 지급년월 조회 (SCH_PMT_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 퇴직급여충당금현황 - 지급년월 조회 (SCH_PMT_YM)");
    logInput("SCH_PMT_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_PMT_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5070M-no1.png`, fullPage: true });

    expect(rows.length, "퇴직급여충당금현황 지급년월 조회 (SCH_PMT_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 퇴직급여충당금현황 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 퇴직급여충당금현황  액터: 개발자
   * URL: /mis/pay/pay5070/getData.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_RTMT_RSRV_STAT WHERE PMT_YM='202406' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 퇴직급여충당금현황 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 퇴직급여충당금현황 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_PMT_YM", "202406");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_PMT_YM": "202406", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5070M-no2.png`, fullPage: true });

    expect(rows.length, "퇴직급여충당금현황 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 퇴직급여충당금현황 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 퇴직급여충당금현황  액터: 개발자
   * URL: /mis/pay/pay5070/getData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_RTMT_RSRV_STAT WHERE PMT_YM='999912'
   */
  test("[no:3] 퇴직급여충당금현황 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 퇴직급여충당금현황 - 존재하지 않는 지급년월(999912) 조회 (0건 확인)");
    logInput("SCH_PMT_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_PMT_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5070M-no3.png`, fullPage: true });

    expect(rows.length, "퇴직급여충당금현황 존재하지 않는 지급년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_5510M — 소급기준관리  |  API: POST /mis/pay/pay5510/getStdData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay5510/getStdData.do";
  const PGM_ID            = "pay_5510M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_RTCT_YM","SCH_RTCT_NM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`소급기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 소급기준관리 - 소급년월 조회 (SCH_RTCT_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 소급기준관리  액터: 개발자
   * URL: /mis/pay/pay5510/getStdData.do
   * 예상결과: 해당 소급년월의 소급기준이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_RETRO_STD WHERE RTCT_YM='202406'
   */
  test("[no:1] 소급기준관리 - 소급년월 조회 (SCH_RTCT_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 소급기준관리 - 소급년월 조회 (SCH_RTCT_YM)");
    logInput("SCH_RTCT_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_RTCT_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getStdData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5510M-no1.png`, fullPage: true });

    expect(rows.length, "소급기준관리 소급년월 조회 (SCH_RTCT_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 소급기준관리 - 소급명 키워드 검색 (SCH_RTCT_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 소급기준관리  액터: 개발자
   * URL: /mis/pay/pay5510/getStdData.do
   * 예상결과: 소급명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_RETRO_STD WHERE RTCT_NM LIKE '%인상%'
   */
  test("[no:2] 소급기준관리 - 소급명 키워드 검색 (SCH_RTCT_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 소급기준관리 - 소급명 키워드 검색 (SCH_RTCT_NM)");
    logInput("SCH_RTCT_NM", "인상");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_RTCT_NM": "인상" }));
    const result = await assertNexacroResponse(resp, "getStdData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5510M-no2.png`, fullPage: true });

    expect(rows.length, "소급기준관리 소급명 키워드 검색 (SCH_RTCT_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 소급기준관리 - 존재하지 않는 소급년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 소급기준관리  액터: 개발자
   * URL: /mis/pay/pay5510/getStdData.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_RETRO_STD WHERE RTCT_YM='999912'
   */
  test("[no:3] 소급기준관리 - 존재하지 않는 소급년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 소급기준관리 - 존재하지 않는 소급년월(999912) 조회 (0건 확인)");
    logInput("SCH_RTCT_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_RTCT_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getStdData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5510M-no3.png`, fullPage: true });

    expect(rows.length, "소급기준관리 존재하지 않는 소급년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_5520M — 소급액계산  |  API: POST /mis/pay/pay5520/getRtctList.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay5520/getRtctList.do";
  const PGM_ID            = "pay_5520M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_RTCT_YM","SCH_EMP_NO","SCH_WORK_DGCNT","SCH_EMP_NM","SCH_RTCT_NM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`소급액계산(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 소급액계산 - 소급년월 조회 (SCH_RTCT_YM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 소급액계산  액터: 개발자
   * URL: /mis/pay/pay5520/getRtctList.do
   * 예상결과: 해당 소급년월의 소급액 계산 대상이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_RETRO_CALC WHERE RTCT_YM='202406'
   */
  test("[no:1] 소급액계산 - 소급년월 조회 (SCH_RTCT_YM)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 소급액계산 - 소급년월 조회 (SCH_RTCT_YM)");
    logInput("SCH_RTCT_YM", "202406");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_RTCT_YM": "202406" }));
    const result = await assertNexacroResponse(resp, "getRtctList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5520M-no1.png`, fullPage: true });

    expect(rows.length, "소급액계산 소급년월 조회 (SCH_RTCT_YM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 소급액계산 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 소급액계산  액터: 개발자
   * URL: /mis/pay/pay5520/getRtctList.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_RETRO_CALC WHERE RTCT_YM='202406' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 소급액계산 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 소급액계산 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_RTCT_YM", "202406");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_RTCT_YM": "202406", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getRtctList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5520M-no2.png`, fullPage: true });

    expect(rows.length, "소급액계산 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 소급액계산 - 존재하지 않는 소급년월(999912) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 소급액계산  액터: 개발자
   * URL: /mis/pay/pay5520/getRtctList.do
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_RETRO_CALC WHERE RTCT_YM='999912'
   */
  test("[no:3] 소급액계산 - 존재하지 않는 소급년월(999912) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 소급액계산 - 존재하지 않는 소급년월(999912) 조회 (0건 확인)");
    logInput("SCH_RTCT_YM", "999912");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_RTCT_YM": "999912" }));
    const result = await assertNexacroResponse(resp, "getRtctList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_5520M-no3.png`, fullPage: true });

    expect(rows.length, "소급액계산 존재하지 않는 소급년월(999912) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6010M — 가족수당신청목록  |  API: POST /mis/pay/pay6010/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay6010/getData.do";
  const PGM_ID            = "pay_6010M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_RQST_FRM_DT","SCH_RQST_TO_DT","SCH_RQSTER_EMP_RID","SCH_RQSTER_EMP_NO","SCH_RQSTER_EMP_NM","SCH_ACCP_STAT_FG"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`가족수당신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 가족수당신청목록 - 신청기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 가족수당신청목록  액터: 개발자
   * URL: /mis/pay/pay6010/getData.do
   * 예상결과: 해당 기간의 가족수당 신청 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_FMLY_ALW_RQST WHERE RQST_DT BETWEEN '20240101' AND '20241231'
   */
  test("[no:1] 가족수당신청목록 - 신청기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 가족수당신청목록 - 신청기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT)");
    logInput("SCH_RQST_FRM_DT", "20240101");
    logInput("SCH_RQST_TO_DT", "20241231");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_RQST_FRM_DT": "20240101", "SCH_RQST_TO_DT": "20241231" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6010M-no1.png`, fullPage: true });

    expect(rows.length, "가족수당신청목록 신청기간 조회 (SCH_RQST_FRM_DT~SCH_RQST_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 가족수당신청목록 - 접수상태 조건 조회 (SCH_ACCP_STAT_FG)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 가족수당신청목록  액터: 개발자
   * URL: /mis/pay/pay6010/getData.do
   * 예상결과: 접수상태에 해당하는 신청 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_FMLY_ALW_RQST WHERE ACCP_STAT_FG='1'
   */
  test("[no:2] 가족수당신청목록 - 접수상태 조건 조회 (SCH_ACCP_STAT_FG)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 가족수당신청목록 - 접수상태 조건 조회 (SCH_ACCP_STAT_FG)");
    logInput("SCH_RQST_FRM_DT", "20240101");
    logInput("SCH_RQST_TO_DT", "20241231");
    logInput("SCH_ACCP_STAT_FG", "1");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_RQST_FRM_DT": "20240101", "SCH_RQST_TO_DT": "20241231", "SCH_ACCP_STAT_FG": "1" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6010M-no2.png`, fullPage: true });

    expect(rows.length, "가족수당신청목록 접수상태 조건 조회 (SCH_ACCP_STAT_FG) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 가족수당신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 가족수당신청목록  액터: 개발자
   * URL: /mis/pay/pay6010/getData.do
   * 예상결과: 역방향 기간이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_FMLY_ALW_RQST WHERE RQST_DT BETWEEN '20241231' AND '20240101'
   */
  test("[no:3] 가족수당신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 가족수당신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)");
    logInput("SCH_RQST_FRM_DT", "20241231");
    logInput("SCH_RQST_TO_DT", "20240101");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_RQST_FRM_DT": "20241231", "SCH_RQST_TO_DT": "20240101" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6010M-no3.png`, fullPage: true });

    expect(rows.length, "가족수당신청목록 역방향 기간(시작>종료) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6011M — 가족수당신청상세  |  API: POST /mis/pay/pay6011/getData.do  |  TC 1건
{
  const API_URL           = "/mis/pay/pay6011/getData.do";
  const PGM_ID            = "pay_6011M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`가족수당신청상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 가족수당신청상세 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 가족수당신청상세  액터: 개발자
   * URL: /mis/pay/pay6011/getData.do
   * 예상결과: 상세 데이터가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_FMLY_ALW_RQST_DTL WHERE 1=1
   */
  test("[no:1] 가족수당신청상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 가족수당신청상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6011M-no1.png`, fullPage: true });

    expect(rows.length, "가족수당신청상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6110M — 원천징수변경신청목록  |  API: POST /mis/pay/pay6110/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay6110/getData.do";
  const PGM_ID            = "pay_6110M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_EMP_NO","SCH_EMP_NM","SCH_FRM_DT","SCH_TO_DT","SCH_HLDF_FG_CD"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`원천징수변경신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 원천징수변경신청목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 원천징수변경신청목록  액터: 개발자
   * URL: /mis/pay/pay6110/getData.do
   * 예상결과: 해당 기간의 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_WHT_CHG_RQST WHERE RQST_DT BETWEEN '20240101' AND '20241231'
   */
  test("[no:1] 원천징수변경신청목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 원천징수변경신청목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)");
    logInput("SCH_FRM_DT", "20240101");
    logInput("SCH_TO_DT", "20241231");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20240101", "SCH_TO_DT": "20241231" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6110M-no1.png`, fullPage: true });

    expect(rows.length, "원천징수변경신청목록 기간 조회 (SCH_FRM_DT~SCH_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 원천징수변경신청목록 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 원천징수변경신청목록  액터: 개발자
   * URL: /mis/pay/pay6110/getData.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_WHT_CHG_RQST WHERE RQST_DT BETWEEN '20240101' AND '20241231' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 원천징수변경신청목록 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 원천징수변경신청목록 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_FRM_DT", "20240101");
    logInput("SCH_TO_DT", "20241231");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20240101", "SCH_TO_DT": "20241231", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6110M-no2.png`, fullPage: true });

    expect(rows.length, "원천징수변경신청목록 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 원천징수변경신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 원천징수변경신청목록  액터: 개발자
   * URL: /mis/pay/pay6110/getData.do
   * 예상결과: 역방향 기간이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_WHT_CHG_RQST WHERE RQST_DT BETWEEN '20241231' AND '20240101'
   */
  test("[no:3] 원천징수변경신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 원천징수변경신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)");
    logInput("SCH_FRM_DT", "20241231");
    logInput("SCH_TO_DT", "20240101");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20241231", "SCH_TO_DT": "20240101" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6110M-no3.png`, fullPage: true });

    expect(rows.length, "원천징수변경신청목록 역방향 기간(시작>종료) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6111M — 원천징수변경신청  |  API: POST /mis/pay/pay6111/getData.do  |  TC 1건
{
  const API_URL           = "/mis/pay/pay6111/getData.do";
  const PGM_ID            = "pay_6111M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`원천징수변경신청(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 원천징수변경신청 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 원천징수변경신청  액터: 개발자
   * URL: /mis/pay/pay6111/getData.do
   * 예상결과: 상세 데이터가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_WHT_CHG_RQST_DTL WHERE 1=1
   */
  test("[no:1] 원천징수변경신청 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 원천징수변경신청 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6111M-no1.png`, fullPage: true });

    expect(rows.length, "원천징수변경신청 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6210M — 상조회가입/신청목록  |  API: POST /mis/pay/pay6210/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay6210/getData.do";
  const PGM_ID            = "pay_6210M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_FRM_DT","SCH_TO_DT","SCH_EMP_NO","SCH_EMP_NM","SCH_RQST_FG","SCH_ACCP_STAT"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`상조회가입/신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 상조회가입/신청목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 상조회가입/신청목록  액터: 개발자
   * URL: /mis/pay/pay6210/getData.do
   * 예상결과: 해당 기간의 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_MUTAID_RQST WHERE RQST_DT BETWEEN '20240101' AND '20241231'
   */
  test("[no:1] 상조회가입/신청목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 상조회가입/신청목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)");
    logInput("SCH_FRM_DT", "20240101");
    logInput("SCH_TO_DT", "20241231");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20240101", "SCH_TO_DT": "20241231" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6210M-no1.png`, fullPage: true });

    expect(rows.length, "상조회가입/신청목록 기간 조회 (SCH_FRM_DT~SCH_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 상조회가입/신청목록 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 상조회가입/신청목록  액터: 개발자
   * URL: /mis/pay/pay6210/getData.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_MUTAID_RQST WHERE RQST_DT BETWEEN '20240101' AND '20241231' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 상조회가입/신청목록 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 상조회가입/신청목록 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_FRM_DT", "20240101");
    logInput("SCH_TO_DT", "20241231");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20240101", "SCH_TO_DT": "20241231", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6210M-no2.png`, fullPage: true });

    expect(rows.length, "상조회가입/신청목록 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 상조회가입/신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 상조회가입/신청목록  액터: 개발자
   * URL: /mis/pay/pay6210/getData.do
   * 예상결과: 역방향 기간이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_MUTAID_RQST WHERE RQST_DT BETWEEN '20241231' AND '20240101'
   */
  test("[no:3] 상조회가입/신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 상조회가입/신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)");
    logInput("SCH_FRM_DT", "20241231");
    logInput("SCH_TO_DT", "20240101");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20241231", "SCH_TO_DT": "20240101" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6210M-no3.png`, fullPage: true });

    expect(rows.length, "상조회가입/신청목록 역방향 기간(시작>종료) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6211M — 상조회가입/탈퇴신청상세  |  API: POST /mis/pay/pay6211/getData.do  |  TC 1건
{
  const API_URL           = "/mis/pay/pay6211/getData.do";
  const PGM_ID            = "pay_6211M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`상조회가입/탈퇴신청상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 상조회가입/탈퇴신청상세 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 상조회가입/탈퇴신청상세  액터: 개발자
   * URL: /mis/pay/pay6211/getData.do
   * 예상결과: 상세 데이터가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_MUTAID_RQST_DTL WHERE 1=1
   */
  test("[no:1] 상조회가입/탈퇴신청상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 상조회가입/탈퇴신청상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6211M-no1.png`, fullPage: true });

    expect(rows.length, "상조회가입/탈퇴신청상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6220M — 경조금신청목록  |  API: POST /mis/pay/pay6220/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay6220/getData.do";
  const PGM_ID            = "pay_6220M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_FRM_DT","SCH_TO_DT","SCH_EMP_NO","SCH_EMP_NM","SCH_CHECK","SCH_STAT_CD"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`경조금신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 경조금신청목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 경조금신청목록  액터: 개발자
   * URL: /mis/pay/pay6220/getData.do
   * 예상결과: 해당 기간의 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_CONGRAT_RQST WHERE RQST_DT BETWEEN '20240101' AND '20241231'
   */
  test("[no:1] 경조금신청목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 경조금신청목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)");
    logInput("SCH_FRM_DT", "20240101");
    logInput("SCH_TO_DT", "20241231");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20240101", "SCH_TO_DT": "20241231" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6220M-no1.png`, fullPage: true });

    expect(rows.length, "경조금신청목록 기간 조회 (SCH_FRM_DT~SCH_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 경조금신청목록 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 경조금신청목록  액터: 개발자
   * URL: /mis/pay/pay6220/getData.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_CONGRAT_RQST WHERE RQST_DT BETWEEN '20240101' AND '20241231' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 경조금신청목록 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 경조금신청목록 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_FRM_DT", "20240101");
    logInput("SCH_TO_DT", "20241231");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20240101", "SCH_TO_DT": "20241231", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6220M-no2.png`, fullPage: true });

    expect(rows.length, "경조금신청목록 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 경조금신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 경조금신청목록  액터: 개발자
   * URL: /mis/pay/pay6220/getData.do
   * 예상결과: 역방향 기간이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_CONGRAT_RQST WHERE RQST_DT BETWEEN '20241231' AND '20240101'
   */
  test("[no:3] 경조금신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 경조금신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)");
    logInput("SCH_FRM_DT", "20241231");
    logInput("SCH_TO_DT", "20240101");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20241231", "SCH_TO_DT": "20240101" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6220M-no3.png`, fullPage: true });

    expect(rows.length, "경조금신청목록 역방향 기간(시작>종료) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6221M — 경조금신청상세  |  API: POST /mis/pay/pay6221/getData.do  |  TC 1건
{
  const API_URL           = "/mis/pay/pay6221/getData.do";
  const PGM_ID            = "pay_6221M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`경조금신청상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 경조금신청상세 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 경조금신청상세  액터: 개발자
   * URL: /mis/pay/pay6221/getData.do
   * 예상결과: 상세 데이터가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_CONGRAT_RQST_DTL WHERE 1=1
   */
  test("[no:1] 경조금신청상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 경조금신청상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6221M-no1.png`, fullPage: true });

    expect(rows.length, "경조금신청상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6230M — 상조회회원현황  |  API: POST /mis/pay/pay6230/getData.do  |  TC 2건
{
  const API_URL           = "/mis/pay/pay6230/getData.do";
  const PGM_ID            = "pay_6230M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_STRD_DT"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`상조회회원현황(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 상조회회원현황 - 기준일자 조회 (SCH_STRD_DT)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 상조회회원현황  액터: 개발자
   * URL: /mis/pay/pay6230/getData.do
   * 예상결과: 해당 기준일자의 상조회 회원 현황이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_MUTAID_MEMB WHERE STRD_DT <= '20240601'
   */
  test("[no:1] 상조회회원현황 - 기준일자 조회 (SCH_STRD_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 상조회회원현황 - 기준일자 조회 (SCH_STRD_DT)");
    logInput("SCH_STRD_DT", "20240601");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_STRD_DT": "20240601" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6230M-no1.png`, fullPage: true });

    expect(rows.length, "상조회회원현황 기준일자 조회 (SCH_STRD_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 상조회회원현황 - 과거 기준일자 조회
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 상조회회원현황  액터: 개발자
   * URL: /mis/pay/pay6230/getData.do
   * 예상결과: 과거 기준일자의 회원 현황이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_MUTAID_MEMB WHERE STRD_DT <= '20230101'
   */
  test("[no:2] 상조회회원현황 - 과거 기준일자 조회", async ({ workerPage: page }) => {
    logTestStart("[no:2] 상조회회원현황 - 과거 기준일자 조회");
    logInput("SCH_STRD_DT", "20230101");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_STRD_DT": "20230101" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6230M-no2.png`, fullPage: true });

    expect(rows.length, "상조회회원현황 과거 기준일자 조회 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6240M — 상조회기준관리  |  API: POST /mis/pay/pay6240/getList.do  |  TC 1건
{
  const API_URL           = "/mis/pay/pay6240/getList.do";
  const PGM_ID            = "pay_6240M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`상조회기준관리(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 상조회기준관리 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 상조회기준관리  액터: 개발자
   * URL: /mis/pay/pay6240/getList.do
   * 예상결과: 상조회 기준 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_MUTAID_STD WHERE 1=1
   */
  test("[no:1] 상조회기준관리 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 상조회기준관리 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6240M-no1.png`, fullPage: true });

    expect(rows.length, "상조회기준관리 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6310M — 급여계좌관리목록  |  API: POST /mis/pay/pay6310/getData.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay6310/getData.do";
  const PGM_ID            = "pay_6310M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_FRM_DT","SCH_TO_DT","SCH_SAL_ACC_FG","SCH_EMP_RID","SCH_EMP_NO","SCH_EMP_NM"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`급여계좌관리목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 급여계좌관리목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여계좌관리목록  액터: 개발자
   * URL: /mis/pay/pay6310/getData.do
   * 예상결과: 해당 기간의 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_SAL_ACC_MGT WHERE RQST_DT BETWEEN '20240101' AND '20241231'
   */
  test("[no:1] 급여계좌관리목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 급여계좌관리목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)");
    logInput("SCH_FRM_DT", "20240101");
    logInput("SCH_TO_DT", "20241231");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20240101", "SCH_TO_DT": "20241231" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6310M-no1.png`, fullPage: true });

    expect(rows.length, "급여계좌관리목록 기간 조회 (SCH_FRM_DT~SCH_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 급여계좌관리목록 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여계좌관리목록  액터: 개발자
   * URL: /mis/pay/pay6310/getData.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_SAL_ACC_MGT WHERE RQST_DT BETWEEN '20240101' AND '20241231' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 급여계좌관리목록 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 급여계좌관리목록 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_FRM_DT", "20240101");
    logInput("SCH_TO_DT", "20241231");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20240101", "SCH_TO_DT": "20241231", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6310M-no2.png`, fullPage: true });

    expect(rows.length, "급여계좌관리목록 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 급여계좌관리목록 - 역방향 기간(시작>종료) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여계좌관리목록  액터: 개발자
   * URL: /mis/pay/pay6310/getData.do
   * 예상결과: 역방향 기간이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_SAL_ACC_MGT WHERE RQST_DT BETWEEN '20241231' AND '20240101'
   */
  test("[no:3] 급여계좌관리목록 - 역방향 기간(시작>종료) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 급여계좌관리목록 - 역방향 기간(시작>종료) 조회 (0건 확인)");
    logInput("SCH_FRM_DT", "20241231");
    logInput("SCH_TO_DT", "20240101");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20241231", "SCH_TO_DT": "20240101" }));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6310M-no3.png`, fullPage: true });

    expect(rows.length, "급여계좌관리목록 역방향 기간(시작>종료) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6311M — 급여계좌등록상세  |  API: POST /mis/pay/pay6311/getData.do  |  TC 1건
{
  const API_URL           = "/mis/pay/pay6311/getData.do";
  const PGM_ID            = "pay_6311M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`급여계좌등록상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 급여계좌등록상세 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 급여계좌등록상세  액터: 개발자
   * URL: /mis/pay/pay6311/getData.do
   * 예상결과: 상세 데이터가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_SAL_ACC_MGT_DTL WHERE 1=1
   */
  test("[no:1] 급여계좌등록상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 급여계좌등록상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6311M-no1.png`, fullPage: true });

    expect(rows.length, "급여계좌등록상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6410M — 원천징수동의신청목록  |  API: POST /mis/pay/pay6410/getList.do  |  TC 3건
{
  const API_URL           = "/mis/pay/pay6410/getList.do";
  const PGM_ID            = "pay_6410M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = ["SCH_EMP_NO","SCH_EMP_NM","SCH_FRM_DT","SCH_TO_DT"];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`원천징수동의신청목록(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 원천징수동의신청목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 원천징수동의신청목록  액터: 개발자
   * URL: /mis/pay/pay6410/getList.do
   * 예상결과: 해당 기간의 목록이 조회된다. (총 N건) (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_WHT_AGRE_RQST WHERE RQST_DT BETWEEN '20240101' AND '20241231'
   */
  test("[no:1] 원천징수동의신청목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 원천징수동의신청목록 - 기간 조회 (SCH_FRM_DT~SCH_TO_DT)");
    logInput("SCH_FRM_DT", "20240101");
    logInput("SCH_TO_DT", "20241231");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20240101", "SCH_TO_DT": "20241231" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6410M-no1.png`, fullPage: true });

    expect(rows.length, "원천징수동의신청목록 기간 조회 (SCH_FRM_DT~SCH_TO_DT) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:2] [단위] [SELECT] 원천징수동의신청목록 - 성명 키워드 검색 (SCH_EMP_NM)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 원천징수동의신청목록  액터: 개발자
   * URL: /mis/pay/pay6410/getList.do
   * 예상결과: 성명 키워드가 포함된 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_WHT_AGRE_RQST WHERE RQST_DT BETWEEN '20240101' AND '20241231' AND EMP_NM LIKE '%김%'
   */
  test("[no:2] 원천징수동의신청목록 - 성명 키워드 검색 (SCH_EMP_NM)", async ({ workerPage: page }) => {
    logTestStart("[no:2] 원천징수동의신청목록 - 성명 키워드 검색 (SCH_EMP_NM)");
    logInput("SCH_FRM_DT", "20240101");
    logInput("SCH_TO_DT", "20241231");
    logInput("SCH_EMP_NM", "김");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20240101", "SCH_TO_DT": "20241231", "SCH_EMP_NM": "김" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6410M-no2.png`, fullPage: true });

    expect(rows.length, "원천징수동의신청목록 성명 키워드 검색 (SCH_EMP_NM) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 원천징수동의신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 원천징수동의신청목록  액터: 개발자
   * URL: /mis/pay/pay6410/getList.do
   * 예상결과: 역방향 기간이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_WHT_AGRE_RQST WHERE RQST_DT BETWEEN '20241231' AND '20240101'
   */
  test("[no:3] 원천징수동의신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)", async ({ workerPage: page }) => {
    logTestStart("[no:3] 원천징수동의신청목록 - 역방향 기간(시작>종료) 조회 (0건 확인)");
    logInput("SCH_FRM_DT", "20241231");
    logInput("SCH_TO_DT", "20240101");

    const resp   = await apiPost(page, API_URL, searchBody({ "SCH_FRM_DT": "20241231", "SCH_TO_DT": "20240101" }));
    const result = await assertNexacroResponse(resp, "getList.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6410M-no3.png`, fullPage: true });

    expect(rows.length, "원천징수동의신청목록 역방향 기간(시작>종료) 조회 (0건 확인) 0건 기대").toBe(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6411M — 원천징수동의신청상세  |  API: POST /mis/pay/pay6411/getData.do  |  TC 1건
{
  const API_URL           = "/mis/pay/pay6411/getData.do";
  const PGM_ID            = "pay_6411M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`원천징수동의신청상세(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 원천징수동의신청상세 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 원천징수동의신청상세  액터: 개발자
   * URL: /mis/pay/pay6411/getData.do
   * 예상결과: 상세 데이터가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_WHT_AGRE_RQST_DTL WHERE 1=1
   */
  test("[no:1] 원천징수동의신청상세 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 원천징수동의신청상세 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6411M-no1.png`, fullPage: true });

    expect(rows.length, "원천징수동의신청상세 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

// ---------------------------------------------------------------------------
// pay_6420M — 원천징수동의서  |  API: POST /mis/pay/pay6420/getData.do  |  TC 1건
{
  const API_URL           = "/mis/pay/pay6420/getData.do";
  const PGM_ID            = "pay_6420M";   // API 본문 전용 — 테스트명 사용 금지
  const DS_LIST_NAME      = "ds_list";
  const DS_SEARCH_COLUMNS = [];
  // searchBody: DS_SEARCH_COLUMNS 전체 + 시나리오 파라미터를 합집합으로 전송 (빈 값은 iBATIS isNotEmpty가 스킵)
  const searchBody = (params: Record<string, string>): string => {
    const cols = Array.from(new Set([...DS_SEARCH_COLUMNS, ...Object.keys(params)]));
    return nexacroXml(
      [{ id: 'ds_search', columns: cols,
         rows: [Object.fromEntries(cols.map(c => [c, params[c] ?? '']))] }],
      PGM_ID
    );
  };

  test.describe(`원천징수동의서(${PGM_ID}) 단위 테스트`, () => {

  /**
   * [no:1] [단위] [SELECT] 원천징수동의서 - 전체 조회 (조건 없음)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 원천징수동의서  액터: 개발자
   * URL: /mis/pay/pay6420/getData.do
   * 예상결과: 상세 데이터가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_WHT_AGRE WHERE 1=1
   */
  test("[no:1] 원천징수동의서 - 전체 조회 (조건 없음)", async ({ workerPage: page }) => {
    logTestStart("[no:1] 원천징수동의서 - 전체 조회 (조건 없음)");
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, "getData.do");
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pay_6420M-no1.png`, fullPage: true });

    expect(rows.length, "원천징수동의서 전체 조회 (조건 없음) 1건 이상").toBeGreaterThan(0);
    logResult('검증', `PASS -- ${rows.length}행`);
  });

  });
}

