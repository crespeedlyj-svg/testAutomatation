// ==============================================================
// ACT — 기관정보등록 통합 테스트 (act_1010M)
// 생성일시: 2026-07-01  |  파일: 20260701_act_1010M_inte.spec.ts
// 화면: 기관정보등록  |  메뉴경로: 재무관리 > 기초정보관리 > 기관정보등록
// 방식: UI-driven (openMenuById + setNexacroComponentValue)
// storageState 자동 주입 — 로그인/goto 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import {
  openMenuById,
  waitForNexacroAppReady,
  setNexacroComponentValue,
  clearNexacroDataset,
  getNexacroDatasetRows,
  waitForNexacroDataset,
} from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const SLOW           = 1500;

// TODO: 실제 MENU_ID 확인 필요 — 00_menu_ids.json 캐시에 act_1010M 항목 없음.
//       SYS_MENU_MGT 에서 act_1010M 의 MENU_ID 조회 후 아래 값을 교체할 것.
//       플레이스홀더(M_MIS_XX_XX_XX) 상태에서는 통합 테스트가 실패한다.
const MENU_ID     = 'M_MIS_XX_XX_XX';
const API_URL     = '/mis/act/act1010/getList.do';
const RESULT_COLS = ['CORP_CD', 'CORP_NM'];
const CLEAR_COLS  = ['CORP_NM', 'AMT1', 'AMT2'];

async function navigateTo(page: Page): Promise<string> {
  await waitForNexacroAppReady(page, 20000);

  const initResp = page.waitForResponse(
    r => r.url().includes(API_URL), { timeout: 20000 }
  ).catch(() => null);

  const nav = await openMenuById(page, MENU_ID);
  if (!nav.ok) throw new Error(`메뉴 로드 실패: ${nav.error}`);
  console.log(`[NAV] menuNm=${nav.menuNm}`);

  const resp = await initResp;
  if (resp) console.log(`[NAV] 초기 조회 HTTP ${resp.status()}`);

  await page.locator('text="조회"').first().waitFor({ state: 'visible', timeout: 15000 });

  const dsReady = await waitForNexacroDataset(page, MENU_ID, 'ds_list', 1, 10000);
  console.log(`[NAV] ds_list ready=${dsReady}`);

  return MENU_ID;
}

async function search(
  page: Page,
  formKey: string,
  conditions: Record<string, string>
): Promise<Record<string, string>[]> {
  await clearNexacroDataset(page, formKey, 'ds_search', CLEAR_COLS);

  for (const [col, val] of Object.entries(conditions)) {
    const ok = await setNexacroComponentValue(page, formKey, col, val);
    console.log(`  [SET] ${col}="${val}" ${ok ? 'OK' : 'FAIL'}`);
  }

  await page.waitForTimeout(SLOW);

  const respPromise = page.waitForResponse(
    r => r.url().includes(API_URL), { timeout: 15000 }
  );
  await page.locator('text="조회"').first().click();

  const resp = await respPromise;
  expect(resp.status(), 'API HTTP 200 필요').toBe(200);

  await waitForNexacroDataset(page, formKey, 'ds_list', 0, 8000).catch(() => null);
  await page.waitForTimeout(SLOW);

  return getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);
}

// ============================================================================
test.describe('기관정보등록 통합 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 기관정보등록 - 전체 조회
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 기관정보등록  액터: 개발자
   * 예상결과: 기관정보 목록이 조회된다. (총 N건 — DB 확인 필요)
   */
  test('[no:1] 기관정보등록 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 기관정보등록 - 전체 조회');
    logInput('검색조건', '없음');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1010M-inte-no1-all.png`, fullPage: true });

    expect(rows.length, '기관정보등록 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [통합] [SELECT] 기관정보등록 - 기관명 키워드 조회 (CORP_NM)
   * 중분류: 재무관리  소분류: 기초정보관리  메뉴명: 기관정보등록  액터: 개발자
   * 예상결과: 기관명에 '재단'이 포함된 기관정보가 조회된다.
   */
  test('[no:2] 기관정보등록 - 기관명 키워드 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 기관정보등록 - 기관명 키워드 조회');
    logInput('CORP_NM', '재단');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { CORP_NM: '재단' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/act_1010M-inte-no2-corpnm.png`, fullPage: true });

    expect(rows.length, '기관정보등록 기관명 키워드 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

});
