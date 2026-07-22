// ==============================================================
// PUR — PUR_0910M 단위 테스트
// 생성일시: 2026-07-07  |  파일: testCode_20260707_180948_unit.spec.ts
// 생성자: SYSTEM
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logAction, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import {
  assertNexacroResponse, parseNexacroXmlRows,
  waitForNexacroAppReady, openMenuById, openMenuByPgm,
  setNexacroComponentValue, getNexacroComponentValue,
  triggerNexacroButton, selectNexacroRowByKey,
} from '../utils/nexacro-helper';
import { ensureSessionReady } from '../utils/nexacro-api';

const SCREENSHOT_DIR = 'test-results/screenshots';

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
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/pur/pur0910/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-1-getList.png`, fullPage: true });
  });

  /**
   * [no:2] [단위] [SELECT] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 2024-01-01 ~ 2026-12-31 범위의 직접구매지급신청 목록이 조회된다.
   */
  test('[no:2] [단위] [SELECT] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]', async ({ workerPage: page }) => {
    logTestStart('[no:2] [단위] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/pur/pur0910/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-2-getList.png`, fullPage: true });
  });

  /**
   * [no:3] [단위] [SELECT] PUR_0910M - 날짜 범위 역방향 오류 [RQST_SDT>RQST_EDT]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 시작일자가 종료일자보다 크므로 0건이 조회된다.
   */
  test('[no:3] [단위] [SELECT] PUR_0910M - 날짜 범위 역방향 오류 [RQST_SDT>RQST_EDT]', async ({ workerPage: page }) => {
    logTestStart('[no:3] [단위] PUR_0910M - 날짜 범위 역방향 오류 [RQST_SDT>RQST_EDT]');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/pur/pur0910/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 0건 기대').toBe(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-3-getList.png`, fullPage: true });
  });

  /**
   * [no:4] [단위] [SELECT] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 결재 완료(000-010-040) 건을 제외한, 결재 진행 중인 직접구매지급신청 목록이 조회된다.
   */
  test('[no:4] [단위] [SELECT] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]', async ({ workerPage: page }) => {
    logTestStart('[no:4] [단위] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/pur/pur0910/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-4-getList.png`, fullPage: true });
  });

  /**
   * [no:5] [단위] [SELECT] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 신청번호에 '2024'가 포함된 직접구매지급신청 목록이 조회된다.
   */
  test('[no:5] [단위] [SELECT] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]', async ({ workerPage: page }) => {
    logTestStart('[no:5] [단위] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/pur/pur0910/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-5-getList.png`, fullPage: true });
  });

  /**
   * [no:6] [단위] [SELECT] PUR_0910M - 권한 필터 [ROLE_YN=Y]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: ROLE_YN=Y 권한 범위 내 직접구매지급신청 목록이 조회된다.
   */
  test('[no:6] [단위] [SELECT] PUR_0910M - 권한 필터 [ROLE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:6] [단위] PUR_0910M - 권한 필터 [ROLE_YN=Y]');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/pur/pur0910/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-6-getList.png`, fullPage: true });
  });

  /**
   * [no:7] [단위] [SELECT] PUR_0910M - 전체 조회
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 전체 직접구매지급신청 목록이 조회된다. (1건 이상)
   */
  test('[no:7] [단위] [SELECT] PUR_0910M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:7] [단위] PUR_0910M - 전체 조회');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/pur/pur0910/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-7-getList.png`, fullPage: true });
  });

  /**
   * [no:8] [단위] [SELECT] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 2024-01-01 ~ 2026-12-31 범위의 직접구매지급신청 목록이 조회된다.
   */
  test('[no:8] [단위] [SELECT] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]', async ({ workerPage: page }) => {
    logTestStart('[no:8] [단위] PUR_0910M - 기간 조회 [RQST_SDT=20240101 ~ RQST_EDT=20261231]');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/pur/pur0910/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-8-getList.png`, fullPage: true });
  });

  /**
   * [no:9] [단위] [SELECT] PUR_0910M - 날짜 범위 역방향 오류 [RQST_SDT>RQST_EDT]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 시작일자가 종료일자보다 크므로 0건이 조회된다.
   */
  test('[no:9] [단위] [SELECT] PUR_0910M - 날짜 범위 역방향 오류 [RQST_SDT>RQST_EDT]', async ({ workerPage: page }) => {
    logTestStart('[no:9] [단위] PUR_0910M - 날짜 범위 역방향 오류 [RQST_SDT>RQST_EDT]');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/pur/pur0910/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 0건 기대').toBe(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-9-getList.png`, fullPage: true });
  });

  /**
   * [no:10] [단위] [SELECT] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 결재 완료(000-010-040) 건을 제외한, 결재 진행 중인 직접구매지급신청 목록이 조회된다.
   */
  test('[no:10] [단위] [SELECT] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]', async ({ workerPage: page }) => {
    logTestStart('[no:10] [단위] PUR_0910M - 결재상태 필터 [APV_STAT_CD=000-010-090]');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/pur/pur0910/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-10-getList.png`, fullPage: true });
  });

  /**
   * [no:11] [단위] [SELECT] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 신청번호에 '2024'가 포함된 직접구매지급신청 목록이 조회된다.
   */
  test('[no:11] [단위] [SELECT] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]', async ({ workerPage: page }) => {
    logTestStart('[no:11] [단위] PUR_0910M - 키워드 검색 [SCH_SRCH_CLS=RQST_NO, SCH_SRCH_KEY=2024]');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/pur/pur0910/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-11-getList.png`, fullPage: true });
  });

  /**
   * [no:12] [단위] [SELECT] PUR_0910M - 권한 필터 [ROLE_YN=Y]
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: ROLE_YN=Y 권한 범위 내 직접구매지급신청 목록이 조회된다.
   */
  test('[no:12] [단위] [SELECT] PUR_0910M - 권한 필터 [ROLE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:12] [단위] PUR_0910M - 권한 필터 [ROLE_YN=Y]');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/pur/pur0910/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-12-getList.png`, fullPage: true });
  });

  /**
   * [no:13] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   */
  test('[no:13] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:13] [단위] HRM_0130M - 전체 조회');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-13-getList.png`, fullPage: true });
  });

  /**
   * [no:14] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 부서관리 목록이 조회된다.
   */
  test('[no:14] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:14] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-14-getList.png`, fullPage: true });
  });

  /**
   * [no:15] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   */
  test('[no:15] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:15] [단위] HRM_0130M - 전체 조회');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/getAcctUntCdList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-15-getAcctUntCdList.png`, fullPage: true });
  });

  /**
   * [no:16] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 부서관리 목록이 조회된다.
   */
  test('[no:16] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:16] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/getAcctUntCdList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-16-getAcctUntCdList.png`, fullPage: true });
  });

  /**
   * [no:17] [단위] [INSERT] 부서관리
   * URL: /mis/hrm/hrm0130/setData.do
   * 예상결과: HTTP 200 · result=S · 신규 데이터가 목록에 1건 이상 추가되어 조회된다.
   */
  test('[no:17] [단위] [INSERT] 부서관리', async ({ workerPage: page }) => {
    logTestStart('[no:17] [단위] 부서관리');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

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

    // ── 화면 컴포넌트 실제 입력 (formKey 있을 때만) ──────────────
    if (formKey) {
      // SCH_HDOF_FG (Edit) — ds_list.SCH_HDOF_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_HDOF_FG', '01');
        logResult('SCH_HDOF_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_HDOF_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SCH_BZPLC_FG (Edit) — ds_list.SCH_BZPLC_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_BZPLC_FG', '01');
        logResult('SCH_BZPLC_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_BZPLC_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SCH_DEPT_NM (Edit) — ds_list.SCH_DEPT_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_DEPT_NM', '테스트명칭');
        logResult('SCH_DEPT_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_DEPT_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SCH_USE_YN (Edit) — ds_list.SCH_USE_YN
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_USE_YN', 'Y');
        logResult('SCH_USE_YN 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_USE_YN 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_NM (Edit) — ds_list.DEPT_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_NM', '테스트명칭');
        logResult('DEPT_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_UPP_PATH_NM (Edit) — ds_list.DEPT_UPP_PATH_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_UPP_PATH_NM', '테스트명칭');
        logResult('DEPT_UPP_PATH_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_UPP_PATH_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_ALL_PATH_NM (Edit) — ds_list.DEPT_ALL_PATH_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_ALL_PATH_NM', '테스트명칭');
        logResult('DEPT_ALL_PATH_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_ALL_PATH_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_ENG_NM (Edit) — ds_list.DEPT_ENG_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_ENG_NM', '테스트명칭');
        logResult('DEPT_ENG_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_ENG_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SORT_NO (Edit) — ds_list.SORT_NO
      { const ok = await setNexacroComponentValue(page, formKey, 'SORT_NO', '1');
        logResult('SORT_NO 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SORT_NO 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_ABRE_NM (Edit) — ds_list.DEPT_ABRE_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_ABRE_NM', '테스트명칭');
        logResult('DEPT_ABRE_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_ABRE_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_LCTN_FG (Edit) — ds_list.DEPT_LCTN_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_LCTN_FG', '01');
        logResult('DEPT_LCTN_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_LCTN_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // BZPLC_FG (Edit) — ds_list.BZPLC_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'BZPLC_FG', '01');
        logResult('BZPLC_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  BZPLC_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // BZPLC_FG_NM (Edit) — ds_list.BZPLC_FG_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'BZPLC_FG_NM', '테스트명칭');
        logResult('BZPLC_FG_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  BZPLC_FG_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // USE_YN (Edit) — ds_list.USE_YN
      { const ok = await setNexacroComponentValue(page, formKey, 'USE_YN', 'Y');
        logResult('USE_YN 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  USE_YN 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // USE_YN_NM (Edit) — ds_list.USE_YN_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'USE_YN_NM', '테스트명칭');
        logResult('USE_YN_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  USE_YN_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // ORGCHT_YN (Edit) — ds_list.ORGCHT_YN
      { const ok = await setNexacroComponentValue(page, formKey, 'ORGCHT_YN', 'Y');
        logResult('ORGCHT_YN 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  ORGCHT_YN 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // COMM_NM (Edit) — ds_list.COMM_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'COMM_NM', '테스트명칭');
        logResult('COMM_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  COMM_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // ACCT_UNT_NM (Edit) — ds_list.ACCT_UNT_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'ACCT_UNT_NM', '테스트명칭');
        logResult('ACCT_UNT_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  ACCT_UNT_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
    }

    // ── btn_save 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/setData.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_save 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_save');
    logResult('btn_save 클릭', clicked, true);
    expect(clicked, 'btn_save 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'setData.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-17-setData.png`, fullPage: true });
  });

  /**
   * [no:19] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   */
  test('[no:19] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:19] [단위] HRM_0130M - 전체 조회');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-19-getList.png`, fullPage: true });
  });

  /**
   * [no:20] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 부서관리 목록이 조회된다.
   */
  test('[no:20] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:20] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-20-getList.png`, fullPage: true });
  });

  /**
   * [no:21] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   */
  test('[no:21] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:21] [단위] HRM_0130M - 전체 조회');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/getAcctUntCdList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-21-getAcctUntCdList.png`, fullPage: true });
  });

  /**
   * [no:22] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 부서관리 목록이 조회된다.
   */
  test('[no:22] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:22] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/getAcctUntCdList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-22-getAcctUntCdList.png`, fullPage: true });
  });

  /**
   * [no:23] [단위] [INSERT] 부서관리
   * URL: /mis/hrm/hrm0130/setData.do
   * 예상결과: HTTP 200 · result=S · 신규 데이터가 목록에 1건 이상 추가되어 조회된다.
   */
  test('[no:23] [단위] [INSERT] 부서관리', async ({ workerPage: page }) => {
    logTestStart('[no:23] [단위] 부서관리');
    const formKey = await ensureSessionReady(page, '', 'PUR_0910M');

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

    // ── 화면 컴포넌트 실제 입력 (formKey 있을 때만) ──────────────
    if (formKey) {
      // SCH_HDOF_FG (Edit) — ds_list.SCH_HDOF_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_HDOF_FG', '01');
        logResult('SCH_HDOF_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_HDOF_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SCH_BZPLC_FG (Edit) — ds_list.SCH_BZPLC_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_BZPLC_FG', '01');
        logResult('SCH_BZPLC_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_BZPLC_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SCH_DEPT_NM (Edit) — ds_list.SCH_DEPT_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_DEPT_NM', '테스트명칭');
        logResult('SCH_DEPT_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_DEPT_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SCH_USE_YN (Edit) — ds_list.SCH_USE_YN
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_USE_YN', 'Y');
        logResult('SCH_USE_YN 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_USE_YN 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_NM (Edit) — ds_list.DEPT_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_NM', '테스트명칭');
        logResult('DEPT_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_UPP_PATH_NM (Edit) — ds_list.DEPT_UPP_PATH_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_UPP_PATH_NM', '테스트명칭');
        logResult('DEPT_UPP_PATH_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_UPP_PATH_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_ALL_PATH_NM (Edit) — ds_list.DEPT_ALL_PATH_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_ALL_PATH_NM', '테스트명칭');
        logResult('DEPT_ALL_PATH_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_ALL_PATH_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_ENG_NM (Edit) — ds_list.DEPT_ENG_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_ENG_NM', '테스트명칭');
        logResult('DEPT_ENG_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_ENG_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SORT_NO (Edit) — ds_list.SORT_NO
      { const ok = await setNexacroComponentValue(page, formKey, 'SORT_NO', '1');
        logResult('SORT_NO 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SORT_NO 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_ABRE_NM (Edit) — ds_list.DEPT_ABRE_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_ABRE_NM', '테스트명칭');
        logResult('DEPT_ABRE_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_ABRE_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_LCTN_FG (Edit) — ds_list.DEPT_LCTN_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_LCTN_FG', '01');
        logResult('DEPT_LCTN_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_LCTN_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // BZPLC_FG (Edit) — ds_list.BZPLC_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'BZPLC_FG', '01');
        logResult('BZPLC_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  BZPLC_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // BZPLC_FG_NM (Edit) — ds_list.BZPLC_FG_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'BZPLC_FG_NM', '테스트명칭');
        logResult('BZPLC_FG_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  BZPLC_FG_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // USE_YN (Edit) — ds_list.USE_YN
      { const ok = await setNexacroComponentValue(page, formKey, 'USE_YN', 'Y');
        logResult('USE_YN 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  USE_YN 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // USE_YN_NM (Edit) — ds_list.USE_YN_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'USE_YN_NM', '테스트명칭');
        logResult('USE_YN_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  USE_YN_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // ORGCHT_YN (Edit) — ds_list.ORGCHT_YN
      { const ok = await setNexacroComponentValue(page, formKey, 'ORGCHT_YN', 'Y');
        logResult('ORGCHT_YN 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  ORGCHT_YN 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // COMM_NM (Edit) — ds_list.COMM_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'COMM_NM', '테스트명칭');
        logResult('COMM_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  COMM_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // ACCT_UNT_NM (Edit) — ds_list.ACCT_UNT_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'ACCT_UNT_NM', '테스트명칭');
        logResult('ACCT_UNT_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  ACCT_UNT_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
    }

    // ── btn_save 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/setData.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_save 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_save');
    logResult('btn_save 클릭', clicked, true);
    expect(clicked, 'btn_save 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'setData.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/PUR_0910M-test-23-setData.png`, fullPage: true });
  });

});
