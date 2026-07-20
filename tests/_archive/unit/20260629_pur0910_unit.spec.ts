// ==============================================================
// 직접구매요구신청 단위 테스트 (API-direct / Nexacro XML)
// 생성일시: 2026-06-29  |  파일: 20260629_pur0910_unit.spec.ts
// 메뉴경로: 구매관리 > 구매요구 > 직접구매요구신청
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// NOTE: page.request.post 로 Nexacro XML 직접 호출 (UI 없음)
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import {
  assertNexacroResponse, parseNexacroXmlRows,
  waitForNexacroAppReady, openMenuById,
} from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '/mis/pur/pur0910/getList.do';
const PGM_ID         = 'pur_0910M';
const MENU_ID        = 'M_MIS_06_01_05';

// Nexacro 서버는 openMenuById로 폼을 서버 세션에 등록한 후에만 API 호출을 허용
// 세션 등록은 프로세스 당 1회로 충분 (세션 쿠키가 유지되는 한 재등록 불필요)
let _sessionReady = false;
async function ensureSessionReady(page: Page): Promise<void> {
  if (_sessionReady) return;
  await waitForNexacroAppReady(page, 20000);
  const nav = await openMenuById(page, MENU_ID);
  if (nav.ok) {
    await page.waitForTimeout(2000);
    _sessionReady = true;
    console.log('[CSRF] 서버 세션 폼 등록 완료 — menuNm:', nav.menuNm);
  } else {
    console.warn('[CSRF] 메뉴 등록 실패 — 이후 API 호출이 CSRF 오류를 반환할 수 있습니다:', nav.error);
  }
}

const DS_SEARCH_COLUMNS = [
  'WORK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD',
  'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD',
  'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN',
  'BOOK_CLS', 'RQST_CLS', 'DICT_CLS',
];

const RESULT_COLS = ['CHEAP_RQST_NO', 'RQST_SBJ', 'RQST_DT', 'APNT_DEPT_NM', 'APV_STAT_CD', 'TOT_RQST_AMT'];

// ── Nexacro XML 요청 본문 생성 ───────────────────────────────────────────────
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

// 서버 세션의 csrfKey를 가져와 요청 XML에 주입 — Nexacro 플랫폼 CSRF 검증 통과
async function fetchCsrfKey(page: Page): Promise<string> {
  const { status, body } = await page.evaluate(
    async (url: string) => {
      const resp = await fetch(url, { credentials: 'include' });
      return { status: resp.status, body: await resp.text() };
    },
    `${BASE_URL}/common/frame/getSessionKey.do`
  );
  if (status !== 200) throw new Error(`getSessionKey HTTP ${status}`);
  const match = body.match(/<Parameter id="csrfKey"[^>]*>([^<]*)<\/Parameter>/);
  if (!match?.[1]) throw new Error(`csrfKey 미발견: ${body.substring(0, 300)}`);
  return match[1];
}

async function apiPost(
  page: Page,
  endpoint: string,
  xml: string
): Promise<import('@playwright/test').Response> {
  const csrfKey = await fetchCsrfKey(page);
  const xmlWithCsrf = xml.replace(
    '</Parameters>',
    `<Parameter id="csrfKey">${csrfKey}</Parameter></Parameters>`
  );
  const { status, body } = await page.evaluate(
    async ({ url, xml }: { url: string; xml: string }) => {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
        body: xml,
        credentials: 'include',
      });
      return { status: resp.status, body: await resp.text() };
    },
    { url: endpoint, xml: xmlWithCsrf }
  );
  return {
    status: () => status,
    text:   async () => body,
    ok:     () => status >= 200 && status < 300,
    url:    () => endpoint,
  } as unknown as import('@playwright/test').Response;
}

// ds_search 단일 행 헬퍼 — DS_SEARCH_COLUMNS 전체 포함
function searchBody(params: Record<string, string>): string {
  const allParams = Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']));
  return nexacroXml(
    [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS, rows: [allParams] }],
    PGM_ID
  );
}

test.describe('직접구매요구신청 단위 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 직접구매요구신청 - 전체 조회
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 직접구매요구신청  액터: 개발자
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 직접구매요구신청 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM PUR_CHEAP_RQST_MST A WHERE 1=1
   */
  test('[no:1] 직접구매요구신청 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 직접구매요구신청 - 전체 조회');
    await ensureSessionReady(page);
    logInput('검색조건', '없음 (전체)');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no1-all.png`, fullPage: true });

    expect(rows.length, '직접구매요구신청 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 직접구매요구신청 - 신청일자 기간 조회 (최근 3개월)
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 직접구매요구신청  액터: 개발자
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: RQST_SDT 2026-04-01 ~ RQST_EDT 2026-06-29 범위 내 목록이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM PUR_CHEAP_RQST_MST A WHERE A.RQST_DT BETWEEN '20260401' AND '20260629'
   */
  test('[no:2] 직접구매요구신청 - 신청일자 기간 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 직접구매요구신청 - 신청일자 기간 조회');
    await ensureSessionReady(page);
    logInput('RQST_SDT', '2026-04-01');
    logInput('RQST_EDT', '2026-06-29');

    const resp   = await apiPost(page, API_URL, searchBody({ RQST_SDT: '2026-04-01', RQST_EDT: '2026-06-29' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no2-period.png`, fullPage: true });

    expect(rows.length, '신청일자 기간 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 직접구매요구신청 - 역방향 날짜 조회 (0건 기대)
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 직접구매요구신청  액터: 개발자
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 시작일(2026-12-31) > 종료일(2026-01-01) 이므로 0건 반환.
   * DB 확인: SELECT COUNT(*) FROM PUR_CHEAP_RQST_MST A WHERE A.RQST_DT BETWEEN '20261231' AND '20260101'
   */
  test('[no:3] 직접구매요구신청 - 역방향 날짜 조회 (0건)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 직접구매요구신청 - 역방향 날짜 (0건)');
    await ensureSessionReady(page);
    logInput('RQST_SDT', '2026-12-31');
    logInput('RQST_EDT', '2026-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ RQST_SDT: '2026-12-31', RQST_EDT: '2026-01-01' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no3-reverse.png`, fullPage: true });

    expect(rows.length, '역방향 날짜 0건 기대').toBe(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] [단위] [SELECT] 직접구매요구신청 - 결재상태 필터 (APV_STAT_CD='000-010-040')
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 직접구매요구신청  액터: 개발자
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 결재완료(000-010-040) 상태 요구건만 조회된다.
   * DB 확인: SELECT COUNT(*) FROM PUR_CHEAP_RQST_MST A WHERE A.APV_STAT_CD = '000-010-040'
   */
  test('[no:4] 직접구매요구신청 - 결재상태 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 직접구매요구신청 - 결재상태 필터');
    await ensureSessionReady(page);
    logInput('APV_STAT_CD', '000-010-040');

    const resp   = await apiPost(page, API_URL, searchBody({ APV_STAT_CD: '000-010-040' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no4-apvstat.png`, fullPage: true });

    expect(rows.length, '결재상태 필터 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) =>
      expect(r.APV_STAT_CD, `[행${i}] APV_STAT_CD 불일치`).toBe('000-010-040')
    );
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 직접구매요구신청 - 구매요구명 키워드 검색 ('구매')
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 직접구매요구신청  액터: 개발자
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 구매요구명에 '구매'가 포함된 요구건이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM PUR_CHEAP_RQST_MST A WHERE A.RQST_CONT LIKE '%구매%'
   */
  test('[no:5] 직접구매요구신청 - 구매요구명 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 직접구매요구신청 - 구매요구명 키워드 검색');
    await ensureSessionReady(page);
    logInput('SCH_SRCH_CLS', 'RQST_CONT');
    logInput('SCH_SRCH_KEY', '구매');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_SRCH_CLS: 'RQST_CONT', SCH_SRCH_KEY: '구매' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no5-keyword.png`, fullPage: true });

    expect(rows.length, '구매요구명 키워드 검색 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 직접구매요구신청 - 담당자 권한 조회 (ROLE_YN=Y)
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 직접구매요구신청  액터: 개발자
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 구매담당자 권한(ROLE_YN=Y)으로 전체 요구 현황이 조회된다.
   * DB 확인: SELECT COUNT(*) FROM PUR_CHEAP_RQST_MST A WHERE 1=1
   */
  test('[no:6] 직접구매요구신청 - 담당자 권한 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] 직접구매요구신청 - 담당자 권한 조회');
    await ensureSessionReady(page);
    logInput('ROLE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ ROLE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910-no6-role.png`, fullPage: true });

    expect(rows.length, '담당자 권한 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });
});
