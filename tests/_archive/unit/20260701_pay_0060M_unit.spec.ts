// ==============================================================
// PAY — 건강보험료산정기준관리 단위 테스트 (pay_0060M)
// 생성일시: 2026-07-01  |  파일: 20260701_pay_0060M_unit.spec.ts
// 화면: 건강보험료산정기준관리
// API: POST /mis/pay/pay0060/getData.do
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '/mis/pay/pay0060/getData.do';
const PGM_ID         = 'pay_0060M';

// ── ds_search 컬럼 목록 (pay_0060M dsSearchCols 기준) ───────────────────────
const DS_SEARCH_COLUMNS = ['SCH_APP_YM'];

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
test.describe('건강보험료산정기준관리 단위 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 건강보험료산정기준관리 - 현재 적용년월 조회
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 건강보험료산정기준관리  액터: 개발자
   * URL: /mis/pay/pay0060/getData.do
   * 예상결과: 해당 적용년월의 건강보험료 산정기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_MC_STD WHERE APP_YM = '202406'
   */
  test('[no:1] 건강보험료산정기준관리 - 현재 적용년월 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 건강보험료산정기준관리 - 현재 적용년월 조회');
    logInput('SCH_APP_YM', '202406');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_APP_YM: '202406' }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/건강보험료산정기준관리-no1.png`, fullPage: true });

    expect(rows.length, '건강보험료산정기준관리 현재 적용년월 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 건강보험료산정기준관리 - 과거 적용년월 조회
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 건강보험료산정기준관리  액터: 개발자
   * 예상결과: 과거 적용년월의 건강보험료 산정기준이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM PAY_MC_STD WHERE APP_YM = '202301'
   */
  test('[no:2] 건강보험료산정기준관리 - 과거 적용년월 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 건강보험료산정기준관리 - 과거 적용년월 조회');
    logInput('SCH_APP_YM', '202301');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_APP_YM: '202301' }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/건강보험료산정기준관리-no2.png`, fullPage: true });

    expect(rows.length, '건강보험료산정기준관리 과거 적용년월 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 건강보험료산정기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건 기대)
   * 중분류: 인사관리  소분류: 급여관리  메뉴명: 건강보험료산정기준관리  액터: 개발자
   * 예상결과: 존재하지 않는 년월이므로 조회 결과가 0건이다. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM PAY_MC_STD WHERE APP_YM = '999912'
   */
  test('[no:3] 건강보험료산정기준관리 - 존재하지 않는 적용년월(999912) 조회 (0건)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 건강보험료산정기준관리 - 존재하지 않는 적용년월 조회');
    logInput('SCH_APP_YM', '999912');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_APP_YM: '999912' }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);

    expect(rows.length, '건강보험료산정기준관리 존재하지 않는 년월 0건 기대').toBe(0);
    logResult('검증', 'PASS');
  });

});
