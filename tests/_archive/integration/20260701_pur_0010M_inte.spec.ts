// ==============================================================
// PUR — 부대비용관리 통합 테스트 (pur_0010M)
// 생성일시: 2026-07-01  |  파일: 20260701_pur_0010M_inte.spec.ts
// 화면: 부대비용관리 | 메뉴: 구매관리 > 구매기준정보 > 부대비용관리
// storageState 자동 주입 — 로그인 코드 작성 절대 금지
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

// TODO: SYS_MENU_MGT에서 pur_0010M의 실제 menuId 조회 후 교체 필요 (00_menu_ids.json 미등록)
// 플레이스홀더 M_MIS_XX_XX_XX 상태에서는 통합 테스트가 실패한다.
const MENU_ID     = 'M_MIS_XX_XX_XX';
const API_URL     = '/mis/pur/pur0010/getLista.do';
const RESULT_COLS = ['FRGN_CLS', 'ADAMT_FG', 'ADAMT_RATE', 'AMT_GT', 'AMT_BW', 'FXMT_YN', 'RMK'];
const CLEAR_COLS: string[] = [];   // pur_0010M: 검색조건 ds_search 없음

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
// [pur_0010M] 통합 테스트 — 부대비용관리
// ============================================================================
test.describe('부대비용관리 통합 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [SELECT] 부대비용관리 - 화면 진입 및 전체 조회
   * 중분류: 구매관리  소분류: 구매기준정보  메뉴명: 부대비용관리  액터: 구매담당자
   * 예상결과: 부대비용관리 화면 진입 시 부대비용 기준 목록이 그리드에 표시된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 부대비용 기준 테이블) WHERE 1=1
   */
  test('[no:1] 부대비용관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부대비용관리 - 전체 조회');
    logInput('검색조건', '없음');

    const formKey = await navigateTo(page);
    void CLEAR_COLS;   // pur_0010M은 ds_search 미사용
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/부대비용관리-inte-no1-all.png`, fullPage: true });

    expect(rows.length, '부대비용관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
