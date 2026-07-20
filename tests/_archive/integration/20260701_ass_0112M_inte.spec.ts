// ==============================================================
// ASS — 자산등록(병합) 통합 테스트 (ass_0112M)
// 생성일시: 2026-07-01  |  파일: 20260701_ass_0112M_inte.spec.ts
// 화면: 자산등록(병합) (ass_0110M 병합등록에서 열리는 팝업)
// 흐름: 부모화면(자산등록) 진입 → 병합대상 다중 선택 → 팝업 → setSave(병합등록) → setDelSave(삭제)
// storageState 자동 주입 — 로그인 코드 작성 절대 금지 (UI-driven)
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import {
  openMenuById,
  waitForNexacroAppReady,
  waitForNexacroDataset,
  getNexacroComponentValue,
  selectNexacroGridRow,
  triggerNexacroButton,
} from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const SLOW           = 1500;

// TODO(menuId): ass_0112M는 ass_0110M(자산등록) 병합등록에서 열리는 팝업이라
//   독립 menuId가 없다. 부모화면 ass_0110M의 실제 menuId를 SYS_MENU_MGT에서 조회 후
//   PARENT_MENU_ID 및 _workspace/00_menu_ids.json 갱신 필요 (현재 플레이스홀더 → 전부 실패).
const PARENT_MENU_ID  = 'M_MIS_XX_XX_XX';   // ass_0110M 자산등록 화면
const PARENT_API_URL  = '/mis/ass/ass0110/getList.do';
const SAVE_API_URL    = '/mis/ass/ass0112/setSave.do';
const DEL_API_URL     = '/mis/ass/ass0112/setDelSave.do';

// INSERT → DELETE 공유키
let sharedAstMngCd = '';

async function navigateToParent(page: Page): Promise<string> {
  await waitForNexacroAppReady(page, 20000);
  const initResp = page.waitForResponse(r => r.url().includes(PARENT_API_URL), { timeout: 20000 }).catch(() => null);

  const nav = await openMenuById(page, PARENT_MENU_ID);
  if (!nav.ok) throw new Error(`부모 메뉴 로드 실패: ${nav.error}`);
  console.log(`[NAV] menuNm=${nav.menuNm}`);

  await initResp;
  await page.locator('text="조회"').first().waitFor({ state: 'visible', timeout: 15000 });
  await waitForNexacroDataset(page, PARENT_MENU_ID, 'ds_list', 1, 10000);
  return PARENT_MENU_ID;
}

// ============================================================================
// [ass_0112M] 통합 테스트 — 병합 자산 등록/삭제 흐름
// ============================================================================
test.describe.serial('자산등록(병합) 통합 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [통합] [INSERT] 자산등록(병합) - 병합 자산 등록 저장 (setSave)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록(병합)  액터: 자산담당자
   * 예상결과: 병합 자산이 등록되고 자산관리번호(AST_MNG_CD)가 채번된다.
   * DB 확인: SELECT COUNT(*) FROM [TODO: 자산 마스터 테이블 ] DUAL WHERE AST_MNG_CD = :AST_MNG_CD
   * TODO(입력필드/버튼): 병합대상 다중 선택 및 저장 버튼 id(btn_save 가정) 확인 필요.
   */
  test('[no:1] 자산등록(병합) - 병합 자산 등록 저장 (setSave)', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산등록(병합) - 병합 자산 등록 저장 (setSave)');

    const formKey = await navigateToParent(page);

    // 병합대상 여러 행 선택 후 병합등록 팝업 오픈 (TODO: 실제 다중선택/버튼 id 확인)
    await selectNexacroGridRow(page, formKey, 'grd_list', 0).catch(() => null);
    await triggerNexacroButton(page, formKey, 'btn_mergeReg').catch(() => null);
    await page.waitForTimeout(SLOW);

    // TODO: 병합 자산 필수 입력항목 채우기

    const saveResp = page.waitForResponse(r => r.url().includes(SAVE_API_URL), { timeout: 15000 }).catch(() => null);
    await triggerNexacroButton(page, formKey, 'btn_save').catch(() => null);
    const resp = await saveResp;

    logResult('setSave 응답', resp ? `HTTP ${resp.status()}` : '응답 없음');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0112-inte-no1-save.png`, fullPage: true });

    sharedAstMngCd = (await getNexacroComponentValue(page, formKey, 'AST_MNG_CD').catch(() => null)) ?? '';
    logResult('채번 AST_MNG_CD', sharedAstMngCd || '(미확보 — TODO)');

    expect(resp?.status(), '자산등록(병합) setSave HTTP 200 필요').toBe(200);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [통합] [DELETE] 자산등록(병합) - 병합 자산 삭제 (setDelSave)
   * 중분류: 자산관리  소분류: 자산취득  메뉴명: 자산등록(병합)  액터: 자산담당자
   * 예상결과: 등록한 병합 자산이 삭제된다. (no:1에서 채번한 AST_MNG_CD 사용)
   * DB 확인: SELECT COUNT(*) FROM [TODO: 자산 마스터 테이블 ] DUAL WHERE AST_MNG_CD = :AST_MNG_CD
   */
  test('[no:2] 자산등록(병합) - 병합 자산 삭제 (setDelSave)', async ({ workerPage: page }) => {
    logTestStart('[no:2] 자산등록(병합) - 병합 자산 삭제 (setDelSave)');
    logInput('공유키 AST_MNG_CD', sharedAstMngCd || '(no:1 미확보)');

    test.skip(!sharedAstMngCd, 'no:1에서 AST_MNG_CD 채번 실패 — 삭제 대상 없음');

    const formKey = await navigateToParent(page);
    await triggerNexacroButton(page, formKey, 'btn_mergeReg').catch(() => null);
    await page.waitForTimeout(SLOW);

    const delResp = page.waitForResponse(r => r.url().includes(DEL_API_URL), { timeout: 15000 }).catch(() => null);
    await triggerNexacroButton(page, formKey, 'btn_del').catch(() => null);
    const resp = await delResp;

    logResult('setDelSave 응답', resp ? `HTTP ${resp.status()}` : '응답 없음');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0112-inte-no2-delete.png`, fullPage: true });

    expect(resp?.status(), '자산등록(병합) setDelSave HTTP 200 필요').toBe(200);
    logResult('검증', 'PASS');
  });

});
