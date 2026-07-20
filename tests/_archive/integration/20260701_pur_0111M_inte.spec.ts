// ==============================================================
// PUR — 구매요구(내자) 통합 테스트 (pur_0111M)
// 생성일시: 2026-07-01  |  파일: 20260701_pur_0111M_inte.spec.ts
// 화면: 구매요구(내자) — pur_0110M 목록에서 [신청]/행 더블클릭으로 호출되는 상세 팝업
// ------------------------------------------------------------------
// TODO(팝업): pur_0111M은 독립 메뉴가 아닌 pur_0110M 하위 팝업 화면이다.
//   openMenuById로 직접 진입할 수 있는 menuId가 존재하지 않을 수 있다.
//   실제 통합 검증은 pur_0110M 목록 진입 → 팝업 오픈 흐름으로 구성해야 한다.
//   현재는 menuId 미확인(M_MIS_XX_XX_XX) 상태로 스캐폴딩만 생성함.
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import {
  openMenuById,
  waitForNexacroAppReady,
  getNexacroDatasetRows,
  waitForNexacroDataset,
} from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const SLOW           = 1500;

// TODO: pur_0111M은 팝업 화면 — 독립 menuId 미확인. 상위 화면(pur_0110M) 경유 필요.
const MENU_ID     = 'M_MIS_XX_XX_XX';
const API_URL     = '/mis/pur/pur0111/getData.do';
const RESULT_COLS = ['RQST_NO', 'RQST_DT', 'APNT_EMP_NM', 'APNT_DEPT_NM', 'RQST_STAT', 'RQST_SBJ', 'PUR_TP', 'TOT_RQST_AMT'];

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

// ============================================================================
// [pur_0111M] 통합 테스트 — 구매요구(내자) 상세 팝업
// ============================================================================
test.describe('구매요구(내자) 통합 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 구매요구(내자) - 화면 진입 및 상세 조회
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 구매요구(내자)  액터: 구매담당자
   * 예상결과: 구매요구(내자) 상세 화면이 정상 진입되고 기본정보/물품/예산 데이터가 표시된다.
   * TODO: 팝업 화면 — pur_0110M 목록 경유 흐름으로 재구성 필요. menuId 미확인.
   */
  test('[no:1] 구매요구(내자) - 화면 진입 및 상세 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 구매요구(내자) - 화면 진입 및 상세 조회');
    logInput('진입경로', '구매요구신청(내자) 목록 → [신청]/행 더블클릭 팝업');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/구매요구내자-inte-no1-detail.png`, fullPage: true });

    expect(rows.length, '구매요구(내자) 상세 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
