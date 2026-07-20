// ==============================================================
// PUR — PUR_0910M 단위 테스트
// 생성일시: 2026-06-29  |  파일: 20260629_pur_unit.spec.ts
// 생성자: SYSTEM
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

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

async function apiPost(page: Page, endpoint: string, xml: string) {
  return page.request.post(endpoint, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    data: xml,
  });
}

test.describe('PUR_0910M 단위 테스트', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] PUR_0910M - 전체 조회
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 전체 PUR_0910M 목록이 조회된다. (1건 이상)
   */
  test('[no:1] [단위] [SELECT] PUR_0910M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] [단위] PUR_0910M - 전체 조회');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'RQST_DT', 'SLIP_DT', 'INS_DT', 'EXMNT_DT'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-1-getList.png`, fullPage: true });
  });

  /**
   * [no:2] [단위] [SELECT] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 2024-01-01 ~ 2026-12-31 범위의 PUR_0910M 목록이 조회된다.
   */
  test('[no:2] [단위] [SELECT] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]', async ({ workerPage: page }) => {
    logTestStart('[no:2] [단위] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'RQST_DT', 'SLIP_DT', 'INS_DT', 'EXMNT_DT'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
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

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'RQST_DT', 'SLIP_DT', 'INS_DT', 'EXMNT_DT'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-3-getList.png`, fullPage: true });
  });

  /**
   * [no:4] [단위] [SELECT] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 결재 완료(000-010-040) 건을 제외한, 결재 진행 중인 PUR_0910M 목록이 조회된다.
   */
  test('[no:4] [단위] [SELECT] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]', async ({ workerPage: page }) => {
    logTestStart('[no:4] [단위] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'RQST_DT', 'SLIP_DT', 'INS_DT', 'EXMNT_DT'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-4-getList.png`, fullPage: true });
  });

  /**
   * [no:5] [단위] [SELECT] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 신청번호에 '2024'가 포함된 PUR_0910M 목록이 조회된다.
   */
  test('[no:5] [단위] [SELECT] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]', async ({ workerPage: page }) => {
    logTestStart('[no:5] [단위] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'RQST_DT', 'SLIP_DT', 'INS_DT', 'EXMNT_DT'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-5-getList.png`, fullPage: true });
  });

  /**
   * [no:6] [단위] [SELECT] PUR_0910M - 권한 필터 [ROLE_YN=Y]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: ROLE_YN=Y 권한 범위 내 PUR_0910M 목록이 조회된다.
   */
  test('[no:6] [단위] [SELECT] PUR_0910M - 권한 필터 [ROLE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:6] [단위] PUR_0910M - 권한 필터 [ROLE_YN=Y]');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'RQST_DT', 'SLIP_DT', 'INS_DT', 'EXMNT_DT'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-6-getList.png`, fullPage: true });
  });

  /**
   * [no:7] [단위] [SELECT] PUR_0910M - 전체 조회
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 전체 PUR_0910M 목록이 조회된다. (1건 이상)
   */
  test('[no:7] [단위] [SELECT] PUR_0910M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:7] [단위] PUR_0910M - 전체 조회');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'RQST_DT', 'SLIP_DT', 'INS_DT', 'EXMNT_DT'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-7-getList.png`, fullPage: true });
  });

  /**
   * [no:8] [단위] [SELECT] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 2024-01-01 ~ 2026-12-31 범위의 PUR_0910M 목록이 조회된다.
   */
  test('[no:8] [단위] [SELECT] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]', async ({ workerPage: page }) => {
    logTestStart('[no:8] [단위] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'RQST_DT', 'SLIP_DT', 'INS_DT', 'EXMNT_DT'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
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

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'RQST_DT', 'SLIP_DT', 'INS_DT', 'EXMNT_DT'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-9-getList.png`, fullPage: true });
  });

  /**
   * [no:10] [단위] [SELECT] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 결재 완료(000-010-040) 건을 제외한, 결재 진행 중인 PUR_0910M 목록이 조회된다.
   */
  test('[no:10] [단위] [SELECT] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]', async ({ workerPage: page }) => {
    logTestStart('[no:10] [단위] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'RQST_DT', 'SLIP_DT', 'INS_DT', 'EXMNT_DT'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-10-getList.png`, fullPage: true });
  });

  /**
   * [no:11] [단위] [SELECT] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 신청번호에 '2024'가 포함된 PUR_0910M 목록이 조회된다.
   */
  test('[no:11] [단위] [SELECT] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]', async ({ workerPage: page }) => {
    logTestStart('[no:11] [단위] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'RQST_DT', 'SLIP_DT', 'INS_DT', 'EXMNT_DT'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-11-getList.png`, fullPage: true });
  });

  /**
   * [no:12] [단위] [SELECT] PUR_0910M - 권한 필터 [ROLE_YN=Y]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: ROLE_YN=Y 권한 범위 내 PUR_0910M 목록이 조회된다.
   */
  test('[no:12] [단위] [SELECT] PUR_0910M - 권한 필터 [ROLE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:12] [단위] PUR_0910M - 권한 필터 [ROLE_YN=Y]');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'RQST_DT', 'SLIP_DT', 'INS_DT', 'EXMNT_DT'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-12-getList.png`, fullPage: true });
  });

  /**
   * [no:13] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 전체 HRM_0130M 목록이 조회된다. (1건 이상)
   */
  test('[no:13] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:13] [단위] HRM_0130M - 전체 조회');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_list',
        columns: ['SCH_HDOF_FG', 'SCH_BZPLC_FG'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-13-getList.png`, fullPage: true });
  });

  /**
   * [no:14] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 HRM_0130M 목록이 조회된다.
   */
  test('[no:14] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:14] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_list',
        columns: ['SCH_HDOF_FG', 'SCH_BZPLC_FG'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-14-getList.png`, fullPage: true });
  });

  /**
   * [no:15] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: 전체 HRM_0130M 목록이 조회된다. (1건 이상)
   */
  test('[no:15] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:15] [단위] HRM_0130M - 전체 조회');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getAcctUntCdList.do`,
      nexacroXml([{
        id: 'ds_list',
        columns: ['SCH_HDOF_FG', 'SCH_BZPLC_FG'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-15-getAcctUntCdList.png`, fullPage: true });
  });

  /**
   * [no:16] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 HRM_0130M 목록이 조회된다.
   */
  test('[no:16] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:16] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getAcctUntCdList.do`,
      nexacroXml([{
        id: 'ds_list',
        columns: ['SCH_HDOF_FG', 'SCH_BZPLC_FG'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
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
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'setData.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-17-setData.png`, fullPage: true });
  });

  /**
   * [no:19] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 전체 HRM_0130M 목록이 조회된다. (1건 이상)
   */
  test('[no:19] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:19] [단위] HRM_0130M - 전체 조회');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_list',
        columns: ['SCH_HDOF_FG', 'SCH_BZPLC_FG'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-19-getList.png`, fullPage: true });
  });

  /**
   * [no:20] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 HRM_0130M 목록이 조회된다.
   */
  test('[no:20] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:20] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_list',
        columns: ['SCH_HDOF_FG', 'SCH_BZPLC_FG'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-20-getList.png`, fullPage: true });
  });

  /**
   * [no:21] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: 전체 HRM_0130M 목록이 조회된다. (1건 이상)
   */
  test('[no:21] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:21] [단위] HRM_0130M - 전체 조회');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getAcctUntCdList.do`,
      nexacroXml([{
        id: 'ds_list',
        columns: ['SCH_HDOF_FG', 'SCH_BZPLC_FG'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-21-getAcctUntCdList.png`, fullPage: true });
  });

  /**
   * [no:22] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 HRM_0130M 목록이 조회된다.
   */
  test('[no:22] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:22] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getAcctUntCdList.do`,
      nexacroXml([{
        id: 'ds_list',
        columns: ['SCH_HDOF_FG', 'SCH_BZPLC_FG'],
        rows: [{}],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
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
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    const nxResult = await assertNexacroResponse(resp, 'setData.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-23-setData.png`, fullPage: true });
  });

});
