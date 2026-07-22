// ==============================================================
// PUR — HRM_0130M 단위 테스트
// 생성일시: 2026-07-20  |  파일: testCode_20260720_200706_unit.spec.ts
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

test.describe('HRM_0130M 단위 테스트', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:13] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   */
  test('[no:13] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:13] [단위] HRM_0130M - 전체 조회');
    const formKey = await ensureSessionReady(page, '', 'HRM_0130M');

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
    await page.screenshot({ path: `${SCREENSHOT_DIR}/HRM_0130M-test-13-getList.png`, fullPage: true });
  });

  /**
   * [no:19] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   */
  test('[no:19] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:19] [단위] HRM_0130M - 전체 조회');
    const formKey = await ensureSessionReady(page, '', 'HRM_0130M');

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
    await page.screenshot({ path: `${SCREENSHOT_DIR}/HRM_0130M-test-19-getList.png`, fullPage: true });
  });

});
