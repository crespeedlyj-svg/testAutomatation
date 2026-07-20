// ==============================================================
// PUR — 직접구매지급신청 단위 테스트
// 생성일시: 2026-06-21  |  파일: 20260621_184538_unit.spec.ts
// 생성자: SYSTEM
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import { assertNexacroResponse } from '../utils/nexacro-helper';

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

test.describe('직접구매지급신청 단위 테스트', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 직접구매지급신청
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: ds_list 0건 이상 반환 (HTTP 200, ErrorCode=0)
   */
  test('[no:1] [단위] [SELECT] 직접구매지급신청', async ({ workerPage: page }) => {
    logTestStart('[no:1] [단위] 직접구매지급신청');

    logInput('.RQST_SDT', '20260101');
    logInput('.RQST_EDT', '20260621');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: '',
        columns: ['RQST_SDT', 'RQST_EDT'],
        rows: [{ 'RQST_SDT': '20260101', 'RQST_EDT': '20260621' }],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    await assertNexacroResponse(resp, 'getList.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-1-getList.png`, fullPage: true });
  });

  /**
   * [no:2] [단위] [SELECT] 직접구매지급신청
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 결재상태=10 인 목록만 반환
   */
  test('[no:2] [단위] [SELECT] 직접구매지급신청', async ({ workerPage: page }) => {
    logTestStart('[no:2] [단위] 직접구매지급신청');

    logInput('.RQST_SDT', '20260101');
    logInput('.RQST_EDT', '20260621');
    logInput('.APV_STAT_CD', '10');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: '',
        columns: ['RQST_SDT', 'RQST_EDT', 'APV_STAT_CD'],
        rows: [{ 'RQST_SDT': '20260101', 'RQST_EDT': '20260621', 'APV_STAT_CD': '10' }],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    await assertNexacroResponse(resp, 'getList.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-2-getList.png`, fullPage: true });
  });

  /**
   * [no:3] [단위] [SELECT] 직접구매지급신청
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 해당 부서 신청 목록 반환
   */
  test('[no:3] [단위] [SELECT] 직접구매지급신청', async ({ workerPage: page }) => {
    logTestStart('[no:3] [단위] 직접구매지급신청');

    logInput('.RQST_SDT', '20260101');
    logInput('.RQST_EDT', '20260621');
    logInput('.APNT_DEPT_CD', 'TEST_DEPT_CD');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: '',
        columns: ['RQST_SDT', 'RQST_EDT', 'APNT_DEPT_CD'],
        rows: [{ 'RQST_SDT': '20260101', 'RQST_EDT': '20260621', 'APNT_DEPT_CD': 'TEST_DEPT_CD' }],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    await assertNexacroResponse(resp, 'getList.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-3-getList.png`, fullPage: true });
  });

  /**
   * [no:4] [단위] [SELECT] 직접구매지급신청
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 검색어 포함 목록 반환
   */
  test('[no:4] [단위] [SELECT] 직접구매지급신청', async ({ workerPage: page }) => {
    logTestStart('[no:4] [단위] 직접구매지급신청');

    logInput('.RQST_SDT', '20260101');
    logInput('.RQST_EDT', '20260621');
    logInput('.SCH_SRCH_CLS', '1');
    logInput('.SCH_SRCH_KEY', '테스트');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: '',
        columns: ['RQST_SDT', 'RQST_EDT', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY'],
        rows: [{ 'RQST_SDT': '20260101', 'RQST_EDT': '20260621', 'SCH_SRCH_CLS': '1', 'SCH_SRCH_KEY': '테스트' }],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    await assertNexacroResponse(resp, 'getList.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-4-getList.png`, fullPage: true });
  });

  /**
   * [no:5] [단위] [SELECT] 직접구매지급신청
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 해당 사원 신청 목록 반환
   */
  test('[no:5] [단위] [SELECT] 직접구매지급신청', async ({ workerPage: page }) => {
    logTestStart('[no:5] [단위] 직접구매지급신청');

    logInput('.RQST_SDT', '20260101');
    logInput('.RQST_EDT', '20260621');
    logInput('.APNT_EMP_NO', 'TEST_EMP_NO');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: '',
        columns: ['RQST_SDT', 'RQST_EDT', 'APNT_EMP_NO'],
        rows: [{ 'RQST_SDT': '20260101', 'RQST_EDT': '20260621', 'APNT_EMP_NO': 'TEST_EMP_NO' }],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    await assertNexacroResponse(resp, 'getList.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-5-getList.png`, fullPage: true });
  });

  /**
   * [no:6] [단위] [비정상] 직접구매지급신청
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 서버 예외 응답 또는 빈 결과 반환 — HTTP 500 아님
   */
  test('[no:6] [단위] [비정상] 직접구매지급신청', async ({ workerPage: page }) => {
    logTestStart('[no:6] [단위] 직접구매지급신청');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: '',
        columns: [],
        rows: [
          {}  // TODO: 실제 입력값 기재
        ],
      }], 'PUR_0910M')  // pgmId: CSRF 검증 필수
    );

    // 비정상 케이스: 서버 예외 or 에러 응답 확인
    logResult('응답 상태', resp.status());
    const body = await resp.text();
    logResult('응답 본문 일부', body.substring(0, 200));
    // 시나리오 예상결과: 서버 예외 응답 또는 빈 결과 반환 — HTTP 500 아님
    expect(resp.status()).not.toBe(500);  // 서버 에러 없어야 함
    // TODO: 에러 키워드 검증 (아래 주석 해제 후 실제 메시지 입력)
    // expect(body).toContain('에러메시지');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-6-getList.png`, fullPage: true });
  });

});
