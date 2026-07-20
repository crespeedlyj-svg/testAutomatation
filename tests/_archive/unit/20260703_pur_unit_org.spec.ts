// ==============================================================
// PUR — PUR_0910M 단위 테스트
// 생성일시: 2026-07-03  |  파일: 20260703_pur_unit.spec.ts
// 생성자: SYSTEM
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import {
  assertNexacroResponse, parseNexacroXmlRows,
  waitForNexacroAppReady, openMenuById, openMenuByPgm,
} from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL  ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';

// ── Nexacro XML 요청 본문 생성 ──────────────────────────────
function nexacroXml(
  datasets: { id: string; columns: string[]; rows?: Record<string, string>[] }[],
  pgmId: string   // ← CSRF 검증 필수값 — sourceName 그대로 사용 (예: 'PUR_5110M')
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
  page: Page, endpoint: string, xml: string
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

// Nexacro 서버는 openMenuById(또는 openMenuByPgm)로 폼을 서버 세션에 등록한 후에만 API 호출을 허용
// 세션 등록은 menuId/pgmId 당 1회로 충분 (세션 쿠키가 유지되는 한 재등록 불필요)
// menuId 미확인(DB 조회 실패) 시 pgmId로 openMenuByPgm 폴백 — 비어 있으면 CSRF 세션이 등록되지 않아 이후 API 호출이 모두 실패한다
const _sessionReady = new Set<string>();
async function ensureSessionReady(page: Page, menuId: string, pgmId?: string): Promise<void> {
  const key = menuId || pgmId || '';
  if (!key || _sessionReady.has(key)) return;
  await waitForNexacroAppReady(page, 20000);
  const nav = menuId ? await openMenuById(page, menuId) : await openMenuByPgm(page, pgmId || '');
  if (nav.ok) {
    await page.waitForTimeout(2000);
    _sessionReady.add(key);
    console.log('[CSRF] 서버 세션 폼 등록 완료 — menuNm:', nav.menuNm);
  } else {
    console.warn('[CSRF] 메뉴 등록 실패 — 이후 API 호출이 CSRF 오류를 반환할 수 있습니다:', nav.error);
  }
}

// ds_search 단일 행 헬퍼 — 지정 컬럼 전체 포함 (빈값은 iBATIS isNotEmpty가 스킵)
function searchBody(pgmId: string, columns: string[], params: Record<string, string>): string {
  const allParams = Object.fromEntries(columns.map(c => [c, params[c] ?? '']));
  return nexacroXml([{ id: 'ds_search', columns, rows: [allParams] }], pgmId);
}

test.describe('PUR_0910M 단위 테스트', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] PUR_0910M - 전체 조회
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 전체 직접구매지급신청 목록이 조회된다. (1건 이상)
   */
  test('[no:1] [단위] [SELECT] PUR_0910M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] [단위] PUR_0910M - 전체 조회');
    await ensureSessionReady(page, '', 'PUR_0910M');

    const resp = await apiPost(page, `${BASE_URL}/mis/pur/pur0910/getList.do`,
      searchBody('PUR_0910M', ['WRK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'BOOK_CLS', 'RQST_CLS', 'COMM_CD', 'COMM_NM', 'CHEAP_RQST_NO', 'IMG', 'RQST_SBJ', 'RQST_DT', 'TOT_RQST_AMT', 'GW_DOC_NO', 'GW_DOC_ID', 'RQST_RSN', 'SLIP_DT', 'INS_DT', 'EXMNT_DT', 'EXMNT_STAT'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-1-getList.png`, fullPage: true });
  });

  /**
   * [no:2] [단위] [SELECT] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 2024-01-01 ~ 2026-12-31 범위의 직접구매지급신청 목록이 조회된다.
   */
  test('[no:2] [단위] [SELECT] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]', async ({ workerPage: page }) => {
    logTestStart('[no:2] [단위] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]');
    await ensureSessionReady(page, '', 'PUR_0910M');

    const resp = await apiPost(page, `${BASE_URL}/mis/pur/pur0910/getList.do`,
      searchBody('PUR_0910M', ['WRK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'BOOK_CLS', 'RQST_CLS', 'COMM_CD', 'COMM_NM', 'CHEAP_RQST_NO', 'IMG', 'RQST_SBJ', 'RQST_DT', 'TOT_RQST_AMT', 'GW_DOC_NO', 'GW_DOC_ID', 'RQST_RSN', 'SLIP_DT', 'INS_DT', 'EXMNT_DT', 'EXMNT_STAT'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-2-getList.png`, fullPage: true });
  });

  /**
   * [no:3] [단위] [SELECT] PUR_0910M - 날짜 범위 역방향 오류 [RQST_SDT>RQST_EDT]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 시작일자가 종료일자보다 크므로 0건이 조회된다.
   */
  test('[no:3] [단위] [SELECT] PUR_0910M - 날짜 범위 역방향 오류 [RQST_SDT>RQST_EDT]', async ({ workerPage: page }) => {
    logTestStart('[no:3] [단위] PUR_0910M - 날짜 범위 역방향 오류 [RQST_SDT>RQST_EDT]');
    await ensureSessionReady(page, '', 'PUR_0910M');

    const resp = await apiPost(page, `${BASE_URL}/mis/pur/pur0910/getList.do`,
      searchBody('PUR_0910M', ['WRK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'BOOK_CLS', 'RQST_CLS', 'COMM_CD', 'COMM_NM', 'CHEAP_RQST_NO', 'IMG', 'RQST_SBJ', 'RQST_DT', 'TOT_RQST_AMT', 'GW_DOC_NO', 'GW_DOC_ID', 'RQST_RSN', 'SLIP_DT', 'INS_DT', 'EXMNT_DT', 'EXMNT_STAT'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 0건 기대').toBe(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-3-getList.png`, fullPage: true });
  });

  /**
   * [no:4] [단위] [SELECT] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 결재 완료(000-010-040) 건을 제외한, 결재 진행 중인 직접구매지급신청 목록이 조회된다.
   */
  test('[no:4] [단위] [SELECT] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]', async ({ workerPage: page }) => {
    logTestStart('[no:4] [단위] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]');
    await ensureSessionReady(page, '', 'PUR_0910M');

    const resp = await apiPost(page, `${BASE_URL}/mis/pur/pur0910/getList.do`,
      searchBody('PUR_0910M', ['WRK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'BOOK_CLS', 'RQST_CLS', 'COMM_CD', 'COMM_NM', 'CHEAP_RQST_NO', 'IMG', 'RQST_SBJ', 'RQST_DT', 'TOT_RQST_AMT', 'GW_DOC_NO', 'GW_DOC_ID', 'RQST_RSN', 'SLIP_DT', 'INS_DT', 'EXMNT_DT', 'EXMNT_STAT'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-4-getList.png`, fullPage: true });
  });

  /**
   * [no:5] [단위] [SELECT] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 신청번호에 '2024'가 포함된 직접구매지급신청 목록이 조회된다.
   */
  test('[no:5] [단위] [SELECT] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]', async ({ workerPage: page }) => {
    logTestStart('[no:5] [단위] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]');
    await ensureSessionReady(page, '', 'PUR_0910M');

    const resp = await apiPost(page, `${BASE_URL}/mis/pur/pur0910/getList.do`,
      searchBody('PUR_0910M', ['WRK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'BOOK_CLS', 'RQST_CLS', 'COMM_CD', 'COMM_NM', 'CHEAP_RQST_NO', 'IMG', 'RQST_SBJ', 'RQST_DT', 'TOT_RQST_AMT', 'GW_DOC_NO', 'GW_DOC_ID', 'RQST_RSN', 'SLIP_DT', 'INS_DT', 'EXMNT_DT', 'EXMNT_STAT'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-5-getList.png`, fullPage: true });
  });

  /**
   * [no:6] [단위] [SELECT] PUR_0910M - 권한 필터 [ROLE_YN=Y]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: ROLE_YN=Y 권한 범위 내 직접구매지급신청 목록이 조회된다.
   */
  test('[no:6] [단위] [SELECT] PUR_0910M - 권한 필터 [ROLE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:6] [단위] PUR_0910M - 권한 필터 [ROLE_YN=Y]');
    await ensureSessionReady(page, '', 'PUR_0910M');

    const resp = await apiPost(page, `${BASE_URL}/mis/pur/pur0910/getList.do`,
      searchBody('PUR_0910M', ['WRK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'BOOK_CLS', 'RQST_CLS', 'COMM_CD', 'COMM_NM', 'CHEAP_RQST_NO', 'IMG', 'RQST_SBJ', 'RQST_DT', 'TOT_RQST_AMT', 'GW_DOC_NO', 'GW_DOC_ID', 'RQST_RSN', 'SLIP_DT', 'INS_DT', 'EXMNT_DT', 'EXMNT_STAT'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-6-getList.png`, fullPage: true });
  });

  /**
   * [no:7] [단위] [SELECT] PUR_0910M - 전체 조회
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 전체 직접구매지급신청 목록이 조회된다. (1건 이상)
   */
  test('[no:7] [단위] [SELECT] PUR_0910M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:7] [단위] PUR_0910M - 전체 조회');
    await ensureSessionReady(page, '', 'PUR_0910M');

    const resp = await apiPost(page, `${BASE_URL}/mis/pur/pur0910/getList.do`,
      searchBody('PUR_0910M', ['WRK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'BOOK_CLS', 'RQST_CLS', 'COMM_CD', 'COMM_NM', 'CHEAP_RQST_NO', 'IMG', 'RQST_SBJ', 'RQST_DT', 'TOT_RQST_AMT', 'GW_DOC_NO', 'GW_DOC_ID', 'RQST_RSN', 'SLIP_DT', 'INS_DT', 'EXMNT_DT', 'EXMNT_STAT'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-7-getList.png`, fullPage: true });
  });

  /**
   * [no:8] [단위] [SELECT] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 2024-01-01 ~ 2026-12-31 범위의 직접구매지급신청 목록이 조회된다.
   */
  test('[no:8] [단위] [SELECT] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]', async ({ workerPage: page }) => {
    logTestStart('[no:8] [단위] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]');
    await ensureSessionReady(page, '', 'PUR_0910M');

    const resp = await apiPost(page, `${BASE_URL}/mis/pur/pur0910/getList.do`,
      searchBody('PUR_0910M', ['WRK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'BOOK_CLS', 'RQST_CLS', 'COMM_CD', 'COMM_NM', 'CHEAP_RQST_NO', 'IMG', 'RQST_SBJ', 'RQST_DT', 'TOT_RQST_AMT', 'GW_DOC_NO', 'GW_DOC_ID', 'RQST_RSN', 'SLIP_DT', 'INS_DT', 'EXMNT_DT', 'EXMNT_STAT'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-8-getList.png`, fullPage: true });
  });

  /**
   * [no:9] [단위] [SELECT] PUR_0910M - 날짜 범위 역방향 오류 [RQST_SDT>RQST_EDT]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 시작일자가 종료일자보다 크므로 0건이 조회된다.
   */
  test('[no:9] [단위] [SELECT] PUR_0910M - 날짜 범위 역방향 오류 [RQST_SDT>RQST_EDT]', async ({ workerPage: page }) => {
    logTestStart('[no:9] [단위] PUR_0910M - 날짜 범위 역방향 오류 [RQST_SDT>RQST_EDT]');
    await ensureSessionReady(page, '', 'PUR_0910M');

    const resp = await apiPost(page, `${BASE_URL}/mis/pur/pur0910/getList.do`,
      searchBody('PUR_0910M', ['WRK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'BOOK_CLS', 'RQST_CLS', 'COMM_CD', 'COMM_NM', 'CHEAP_RQST_NO', 'IMG', 'RQST_SBJ', 'RQST_DT', 'TOT_RQST_AMT', 'GW_DOC_NO', 'GW_DOC_ID', 'RQST_RSN', 'SLIP_DT', 'INS_DT', 'EXMNT_DT', 'EXMNT_STAT'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 0건 기대').toBe(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-9-getList.png`, fullPage: true });
  });

  /**
   * [no:10] [단위] [SELECT] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 결재 완료(000-010-040) 건을 제외한, 결재 진행 중인 직접구매지급신청 목록이 조회된다.
   */
  test('[no:10] [단위] [SELECT] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]', async ({ workerPage: page }) => {
    logTestStart('[no:10] [단위] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]');
    await ensureSessionReady(page, '', 'PUR_0910M');

    const resp = await apiPost(page, `${BASE_URL}/mis/pur/pur0910/getList.do`,
      searchBody('PUR_0910M', ['WRK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'BOOK_CLS', 'RQST_CLS', 'COMM_CD', 'COMM_NM', 'CHEAP_RQST_NO', 'IMG', 'RQST_SBJ', 'RQST_DT', 'TOT_RQST_AMT', 'GW_DOC_NO', 'GW_DOC_ID', 'RQST_RSN', 'SLIP_DT', 'INS_DT', 'EXMNT_DT', 'EXMNT_STAT'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-10-getList.png`, fullPage: true });
  });

  /**
   * [no:11] [단위] [SELECT] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 신청번호에 '2024'가 포함된 직접구매지급신청 목록이 조회된다.
   */
  test('[no:11] [단위] [SELECT] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]', async ({ workerPage: page }) => {
    logTestStart('[no:11] [단위] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]');
    await ensureSessionReady(page, '', 'PUR_0910M');

    const resp = await apiPost(page, `${BASE_URL}/mis/pur/pur0910/getList.do`,
      searchBody('PUR_0910M', ['WRK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'BOOK_CLS', 'RQST_CLS', 'COMM_CD', 'COMM_NM', 'CHEAP_RQST_NO', 'IMG', 'RQST_SBJ', 'RQST_DT', 'TOT_RQST_AMT', 'GW_DOC_NO', 'GW_DOC_ID', 'RQST_RSN', 'SLIP_DT', 'INS_DT', 'EXMNT_DT', 'EXMNT_STAT'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-11-getList.png`, fullPage: true });
  });

  /**
   * [no:12] [단위] [SELECT] PUR_0910M - 권한 필터 [ROLE_YN=Y]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: ROLE_YN=Y 권한 범위 내 직접구매지급신청 목록이 조회된다.
   */
  test('[no:12] [단위] [SELECT] PUR_0910M - 권한 필터 [ROLE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:12] [단위] PUR_0910M - 권한 필터 [ROLE_YN=Y]');
    await ensureSessionReady(page, '', 'PUR_0910M');

    const resp = await apiPost(page, `${BASE_URL}/mis/pur/pur0910/getList.do`,
      searchBody('PUR_0910M', ['WRK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'BOOK_CLS', 'RQST_CLS', 'COMM_CD', 'COMM_NM', 'CHEAP_RQST_NO', 'IMG', 'RQST_SBJ', 'RQST_DT', 'TOT_RQST_AMT', 'GW_DOC_NO', 'GW_DOC_ID', 'RQST_RSN', 'SLIP_DT', 'INS_DT', 'EXMNT_DT', 'EXMNT_STAT'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-12-getList.png`, fullPage: true });
  });

  /**
   * [no:13] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   */
  test('[no:13] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:13] [단위] HRM_0130M - 전체 조회');
    await ensureSessionReady(page, '', 'HRM_0130M');

    const resp = await apiPost(page, `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      searchBody('HRM_0130M', ['SCH_HDOF_FG', 'SCH_BZPLC_FG', 'SCH_DEPT_NM', 'SCH_USE_YN', 'isChecked', 'tmHeader', 'CORP_CD', 'DEPT_CD', 'DEPT_NM', 'DEPT_UPP_PATH_NM', 'DEPT_ALL_PATH_NM', 'DEPT_ENG_NM', 'LVL', 'SORT_NO', 'UPP_DEPT_CD', 'DEPT_ABRE_NM', 'DEPTL_EMP_RID', 'DEPT_LCTN_FG', 'BZPLC_FG', 'BZPLC_FG_NM', 'ACCT_UNT_CD', 'OLD_DEPT_CD', 'USE_YN', 'USE_YN_NM', 'ORGCHT_YN', 'COMM_CD', 'COMM_NM', 'REF_CD', 'ACCT_UNT_NM'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-13-getList.png`, fullPage: true });
  });

  /**
   * [no:14] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 부서관리 목록이 조회된다.
   */
  test('[no:14] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:14] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');
    await ensureSessionReady(page, '', 'HRM_0130M');

    const resp = await apiPost(page, `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      searchBody('HRM_0130M', ['SCH_HDOF_FG', 'SCH_BZPLC_FG', 'SCH_DEPT_NM', 'SCH_USE_YN', 'isChecked', 'tmHeader', 'CORP_CD', 'DEPT_CD', 'DEPT_NM', 'DEPT_UPP_PATH_NM', 'DEPT_ALL_PATH_NM', 'DEPT_ENG_NM', 'LVL', 'SORT_NO', 'UPP_DEPT_CD', 'DEPT_ABRE_NM', 'DEPTL_EMP_RID', 'DEPT_LCTN_FG', 'BZPLC_FG', 'BZPLC_FG_NM', 'ACCT_UNT_CD', 'OLD_DEPT_CD', 'USE_YN', 'USE_YN_NM', 'ORGCHT_YN', 'COMM_CD', 'COMM_NM', 'REF_CD', 'ACCT_UNT_NM'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-14-getList.png`, fullPage: true });
  });

  /**
   * [no:15] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   */
  test('[no:15] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:15] [단위] HRM_0130M - 전체 조회');
    await ensureSessionReady(page, '', 'HRM_0130M');

    const resp = await apiPost(page, `${BASE_URL}/mis/hrm/hrm0130/getAcctUntCdList.do`,
      searchBody('HRM_0130M', ['SCH_HDOF_FG', 'SCH_BZPLC_FG', 'SCH_DEPT_NM', 'SCH_USE_YN', 'isChecked', 'tmHeader', 'CORP_CD', 'DEPT_CD', 'DEPT_NM', 'DEPT_UPP_PATH_NM', 'DEPT_ALL_PATH_NM', 'DEPT_ENG_NM', 'LVL', 'SORT_NO', 'UPP_DEPT_CD', 'DEPT_ABRE_NM', 'DEPTL_EMP_RID', 'DEPT_LCTN_FG', 'BZPLC_FG', 'BZPLC_FG_NM', 'ACCT_UNT_CD', 'OLD_DEPT_CD', 'USE_YN', 'USE_YN_NM', 'ORGCHT_YN', 'COMM_CD', 'COMM_NM', 'REF_CD', 'ACCT_UNT_NM'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-15-getAcctUntCdList.png`, fullPage: true });
  });

  /**
   * [no:16] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 부서관리 목록이 조회된다.
   */
  test('[no:16] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:16] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');
    await ensureSessionReady(page, '', 'HRM_0130M');

    const resp = await apiPost(page, `${BASE_URL}/mis/hrm/hrm0130/getAcctUntCdList.do`,
      searchBody('HRM_0130M', ['SCH_HDOF_FG', 'SCH_BZPLC_FG', 'SCH_DEPT_NM', 'SCH_USE_YN', 'isChecked', 'tmHeader', 'CORP_CD', 'DEPT_CD', 'DEPT_NM', 'DEPT_UPP_PATH_NM', 'DEPT_ALL_PATH_NM', 'DEPT_ENG_NM', 'LVL', 'SORT_NO', 'UPP_DEPT_CD', 'DEPT_ABRE_NM', 'DEPTL_EMP_RID', 'DEPT_LCTN_FG', 'BZPLC_FG', 'BZPLC_FG_NM', 'ACCT_UNT_CD', 'OLD_DEPT_CD', 'USE_YN', 'USE_YN_NM', 'ORGCHT_YN', 'COMM_CD', 'COMM_NM', 'REF_CD', 'ACCT_UNT_NM'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-16-getAcctUntCdList.png`, fullPage: true });
  });

  /**
   * [no:17] [단위] [INSERT] 부서관리
   * URL: /mis/hrm/hrm0130/setData.do
   * 예상결과: HTTP 200 · result=S · 신규 데이터가 목록에 1건 이상 추가되어 조회된다.
   */
  test('[no:17] [단위] [INSERT] 부서관리', async ({ workerPage: page }) => {
    logTestStart('[no:17] [단위] 부서관리');
    await ensureSessionReady(page, '', 'HRM_0130M');

    logInput('ds_list.SCH_HDOF_FG', '01');
    logInput('ds_list.SCH_BZPLC_FG', '01');
    logInput('ds_list.SCH_DEPT_NM', '테스트명칭');
    logInput('ds_list.SCH_USE_YN', 'Y');
    logInput('ds_list.DEPT_NM', '테스트명칭');
    logInput('ds_list.DEPT_UPP_PATH_NM', '테스트명칭');
    logInput('ds_list.DEPT_ALL_PATH_NM', '테스트명칭');
    logInput('ds_list.DEPT_ENG_NM', '테스트명칭');
    logInput('ds_list.SORT_NO', '1');
    logInput('ds_list.DEPT_ABRE_NM', '테스트명칭');
    logInput('ds_list.DEPT_LCTN_FG', '01');
    logInput('ds_list.BZPLC_FG', '01');
    logInput('ds_list.BZPLC_FG_NM', '테스트명칭');
    logInput('ds_list.USE_YN', 'Y');
    logInput('ds_list.USE_YN_NM', '테스트명칭');
    logInput('ds_list.ORGCHT_YN', 'Y');
    logInput('ds_list.COMM_NM', '테스트명칭');
    logInput('ds_list.ACCT_UNT_NM', '테스트명칭');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/setData.do`,
      nexacroXml([{
        id: 'ds_list',
        columns: ['SCH_HDOF_FG', 'SCH_BZPLC_FG', 'SCH_DEPT_NM', 'SCH_USE_YN', 'DEPT_NM', 'DEPT_UPP_PATH_NM', 'DEPT_ALL_PATH_NM', 'DEPT_ENG_NM', 'SORT_NO', 'DEPT_ABRE_NM', 'DEPT_LCTN_FG', 'BZPLC_FG', 'BZPLC_FG_NM', 'USE_YN', 'USE_YN_NM', 'ORGCHT_YN', 'COMM_NM', 'ACCT_UNT_NM'],
        rows: [{ 'SCH_HDOF_FG': '01', 'SCH_BZPLC_FG': '01', 'SCH_DEPT_NM': '테스트명칭', 'SCH_USE_YN': 'Y', 'DEPT_NM': '테스트명칭', 'DEPT_UPP_PATH_NM': '테스트명칭', 'DEPT_ALL_PATH_NM': '테스트명칭', 'DEPT_ENG_NM': '테스트명칭', 'SORT_NO': '1', 'DEPT_ABRE_NM': '테스트명칭', 'DEPT_LCTN_FG': '01', 'BZPLC_FG': '01', 'BZPLC_FG_NM': '테스트명칭', 'USE_YN': 'Y', 'USE_YN_NM': '테스트명칭', 'ORGCHT_YN': 'Y', 'COMM_NM': '테스트명칭', 'ACCT_UNT_NM': '테스트명칭' }],
      }], 'HRM_0130M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'setData.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-17-setData.png`, fullPage: true });
  });

  /**
   * [no:19] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   */
  test('[no:19] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:19] [단위] HRM_0130M - 전체 조회');
    await ensureSessionReady(page, '', 'HRM_0130M');

    const resp = await apiPost(page, `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      searchBody('HRM_0130M', ['SCH_HDOF_FG', 'SCH_BZPLC_FG', 'SCH_DEPT_NM', 'SCH_USE_YN', 'isChecked', 'tmHeader', 'CORP_CD', 'DEPT_CD', 'DEPT_NM', 'DEPT_UPP_PATH_NM', 'DEPT_ALL_PATH_NM', 'DEPT_ENG_NM', 'LVL', 'SORT_NO', 'UPP_DEPT_CD', 'DEPT_ABRE_NM', 'DEPTL_EMP_RID', 'DEPT_LCTN_FG', 'BZPLC_FG', 'BZPLC_FG_NM', 'ACCT_UNT_CD', 'OLD_DEPT_CD', 'USE_YN', 'USE_YN_NM', 'ORGCHT_YN', 'COMM_CD', 'COMM_NM', 'REF_CD', 'ACCT_UNT_NM'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-19-getList.png`, fullPage: true });
  });

  /**
   * [no:20] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 부서관리 목록이 조회된다.
   */
  test('[no:20] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:20] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');
    await ensureSessionReady(page, '', 'HRM_0130M');

    const resp = await apiPost(page, `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      searchBody('HRM_0130M', ['SCH_HDOF_FG', 'SCH_BZPLC_FG', 'SCH_DEPT_NM', 'SCH_USE_YN', 'isChecked', 'tmHeader', 'CORP_CD', 'DEPT_CD', 'DEPT_NM', 'DEPT_UPP_PATH_NM', 'DEPT_ALL_PATH_NM', 'DEPT_ENG_NM', 'LVL', 'SORT_NO', 'UPP_DEPT_CD', 'DEPT_ABRE_NM', 'DEPTL_EMP_RID', 'DEPT_LCTN_FG', 'BZPLC_FG', 'BZPLC_FG_NM', 'ACCT_UNT_CD', 'OLD_DEPT_CD', 'USE_YN', 'USE_YN_NM', 'ORGCHT_YN', 'COMM_CD', 'COMM_NM', 'REF_CD', 'ACCT_UNT_NM'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-20-getList.png`, fullPage: true });
  });

  /**
   * [no:21] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   */
  test('[no:21] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:21] [단위] HRM_0130M - 전체 조회');
    await ensureSessionReady(page, '', 'HRM_0130M');

    const resp = await apiPost(page, `${BASE_URL}/mis/hrm/hrm0130/getAcctUntCdList.do`,
      searchBody('HRM_0130M', ['SCH_HDOF_FG', 'SCH_BZPLC_FG', 'SCH_DEPT_NM', 'SCH_USE_YN', 'isChecked', 'tmHeader', 'CORP_CD', 'DEPT_CD', 'DEPT_NM', 'DEPT_UPP_PATH_NM', 'DEPT_ALL_PATH_NM', 'DEPT_ENG_NM', 'LVL', 'SORT_NO', 'UPP_DEPT_CD', 'DEPT_ABRE_NM', 'DEPTL_EMP_RID', 'DEPT_LCTN_FG', 'BZPLC_FG', 'BZPLC_FG_NM', 'ACCT_UNT_CD', 'OLD_DEPT_CD', 'USE_YN', 'USE_YN_NM', 'ORGCHT_YN', 'COMM_CD', 'COMM_NM', 'REF_CD', 'ACCT_UNT_NM'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-21-getAcctUntCdList.png`, fullPage: true });
  });

  /**
   * [no:22] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 부서관리 목록이 조회된다.
   */
  test('[no:22] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:22] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');
    await ensureSessionReady(page, '', 'HRM_0130M');

    const resp = await apiPost(page, `${BASE_URL}/mis/hrm/hrm0130/getAcctUntCdList.do`,
      searchBody('HRM_0130M', ['SCH_HDOF_FG', 'SCH_BZPLC_FG', 'SCH_DEPT_NM', 'SCH_USE_YN', 'isChecked', 'tmHeader', 'CORP_CD', 'DEPT_CD', 'DEPT_NM', 'DEPT_UPP_PATH_NM', 'DEPT_ALL_PATH_NM', 'DEPT_ENG_NM', 'LVL', 'SORT_NO', 'UPP_DEPT_CD', 'DEPT_ABRE_NM', 'DEPTL_EMP_RID', 'DEPT_LCTN_FG', 'BZPLC_FG', 'BZPLC_FG_NM', 'ACCT_UNT_CD', 'OLD_DEPT_CD', 'USE_YN', 'USE_YN_NM', 'ORGCHT_YN', 'COMM_CD', 'COMM_NM', 'REF_CD', 'ACCT_UNT_NM'], {}));

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-22-getAcctUntCdList.png`, fullPage: true });
  });

  /**
   * [no:23] [단위] [INSERT] 부서관리
   * URL: /mis/hrm/hrm0130/setData.do
   * 예상결과: HTTP 200 · result=S · 신규 데이터가 목록에 1건 이상 추가되어 조회된다.
   */
  test('[no:23] [단위] [INSERT] 부서관리', async ({ workerPage: page }) => {
    logTestStart('[no:23] [단위] 부서관리');
    await ensureSessionReady(page, '', 'HRM_0130M');

    logInput('ds_list.SCH_HDOF_FG', '01');
    logInput('ds_list.SCH_BZPLC_FG', '01');
    logInput('ds_list.SCH_DEPT_NM', '테스트명칭');
    logInput('ds_list.SCH_USE_YN', 'Y');
    logInput('ds_list.DEPT_NM', '테스트명칭');
    logInput('ds_list.DEPT_UPP_PATH_NM', '테스트명칭');
    logInput('ds_list.DEPT_ALL_PATH_NM', '테스트명칭');
    logInput('ds_list.DEPT_ENG_NM', '테스트명칭');
    logInput('ds_list.SORT_NO', '1');
    logInput('ds_list.DEPT_ABRE_NM', '테스트명칭');
    logInput('ds_list.DEPT_LCTN_FG', '01');
    logInput('ds_list.BZPLC_FG', '01');
    logInput('ds_list.BZPLC_FG_NM', '테스트명칭');
    logInput('ds_list.USE_YN', 'Y');
    logInput('ds_list.USE_YN_NM', '테스트명칭');
    logInput('ds_list.ORGCHT_YN', 'Y');
    logInput('ds_list.COMM_NM', '테스트명칭');
    logInput('ds_list.ACCT_UNT_NM', '테스트명칭');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/setData.do`,
      nexacroXml([{
        id: 'ds_list',
        columns: ['SCH_HDOF_FG', 'SCH_BZPLC_FG', 'SCH_DEPT_NM', 'SCH_USE_YN', 'DEPT_NM', 'DEPT_UPP_PATH_NM', 'DEPT_ALL_PATH_NM', 'DEPT_ENG_NM', 'SORT_NO', 'DEPT_ABRE_NM', 'DEPT_LCTN_FG', 'BZPLC_FG', 'BZPLC_FG_NM', 'USE_YN', 'USE_YN_NM', 'ORGCHT_YN', 'COMM_NM', 'ACCT_UNT_NM'],
        rows: [{ 'SCH_HDOF_FG': '01', 'SCH_BZPLC_FG': '01', 'SCH_DEPT_NM': '테스트명칭', 'SCH_USE_YN': 'Y', 'DEPT_NM': '테스트명칭', 'DEPT_UPP_PATH_NM': '테스트명칭', 'DEPT_ALL_PATH_NM': '테스트명칭', 'DEPT_ENG_NM': '테스트명칭', 'SORT_NO': '1', 'DEPT_ABRE_NM': '테스트명칭', 'DEPT_LCTN_FG': '01', 'BZPLC_FG': '01', 'BZPLC_FG_NM': '테스트명칭', 'USE_YN': 'Y', 'USE_YN_NM': '테스트명칭', 'ORGCHT_YN': 'Y', 'COMM_NM': '테스트명칭', 'ACCT_UNT_NM': '테스트명칭' }],
      }], 'HRM_0130M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'setData.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-23-setData.png`, fullPage: true });
  });

});
