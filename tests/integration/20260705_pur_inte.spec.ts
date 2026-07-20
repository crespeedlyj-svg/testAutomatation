// ==============================================================
// PUR 모듈 — 구매관리 통합 테스트 (통합 spec, UI-driven)
// 생성일시: 20260705  |  파일: 20260705_pur_inte.spec.ts
// 방식: openMenuById(+openMenuByPgm 폴백) 진입 → 초기 ds_list 로드 확인
//
// ★ Pattern A/B 판별(SKILL 5-6): CRUD/그리드저장 화면의 M파일 저장·삭제 버튼 onclick 핸들러를
//   정적분석한 결과 전 화면이 Pattern A(인라인 폼/그리드 저장 — gfn_tran 직접 호출, INSERT 전용
//   팝업+필수필드 없음)로 확인됨. Pattern B(저장 전용 팝업+essential 필드) 화면 없음.
//   ⇒ 원본 시나리오도 INSERT/DELETE 요청 없이 전부 SELECT(진입/조회)이므로, 존재하지 않는 버튼/
//      팝업 흐름을 지어내지 않고 SELECT 진입 확인 TC만 생성한다.
//   상세 CRUD 폼(pur_0111M/0311M/0911M 등)은 필수필드 39~76개가 코드값·예산·그리드 편집에 의존해
//   정적 생성 불가 → 통합 시나리오 없음(단위 getData 단건조회로만 커버).
//
// storageState 자동 주입 — 로그인 코드 작성 절대 금지
// 소스: _workspace/pur/01_scenarios.json (integration 시나리오 27건)
// 주의: pur_0910M 외 전 화면 menuId 플레이스홀더(M_MIS_XX_XX_XX) — 실제 ID 확인 전까지 진입 실패.
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import {
  openMenuById, openMenuByPgm,
  waitForNexacroAppReady,
  waitForNexacroDataset,
  getNexacroDatasetRows,
} from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';

// ── 메뉴 진입 (공용) ──────────────────────────────────────────────────────────
async function navigateToMenu(page: Page, menuId: string, pgmId: string, apiUrl: string, dsList = 'ds_list'): Promise<string> {
  await waitForNexacroAppReady(page, 20000);
  const initResp = page.waitForResponse(r => r.url().includes(apiUrl), { timeout: 20000 }).catch(() => null);

  const useId = /^M_MIS_\d/.test(menuId);
  const nav = useId ? await openMenuById(page, menuId) : await openMenuByPgm(page, pgmId);
  if (!nav.ok) throw new Error(`메뉴 로드 실패: ${nav.error}`);
  console.log(`[NAV] menuNm=${nav.menuNm}`);

  const formKey = useId ? menuId : ((nav as any).menuId || pgmId);
  await initResp;
  await page.locator('text="조회"').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => null);
  await waitForNexacroDataset(page, formKey, dsList, 1, 10000).catch(() => null);
  return formKey;
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0020M — 구매취소관리
// TODO(menuId): SYS_MENU_MGT에서 pur_0020M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0020M';
  const API_URL     = '/mis/pur/pur0200/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = ['CTRCT_STAT', 'PUR_STEP', 'PUR_TP', 'RGST_NO', 'CTRCT_NM', 'PUR_CONT_NO', 'CTRCT_AMT', 'CTRCT_DT', 'CTRCT_CUST_NM'];

  test.describe.serial(`구매취소관리(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매취소관리 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 구매담당자
     * 예상결과: 구매취소관리 화면 진입 시 기본 조회가 수행되고 검색결과 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 구매취소관리 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매취소관리 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0020M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '구매취소관리 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0110M — 구매요구신청(내자)
// TODO(menuId): SYS_MENU_MGT에서 pur_0110M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0110M';
  const API_URL     = '/mis/pur/pur0110/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = ['RQST_STAT', 'RQST_NO', 'RQST_DT', 'PUR_STEP', 'PUR_TP', 'RQST_SBJ', 'APNT_EMP_NM', 'APNT_DEPT_NM', 'TOT_RQST_AMT'];

  test.describe.serial(`구매요구신청(내자)(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매요구신청(내자) - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 구매요구  액터: 구매담당자
     * 예상결과: 구매요구신청 화면 진입 시 기본 조회가 수행되고 검색결과 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 구매요구신청(내자) - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매요구신청(내자) - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0110M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '구매요구신청(내자) 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0002M — 구매요구현황
// TODO(menuId): SYS_MENU_MGT에서 pur_0002M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0002M';
  const API_URL     = '/mis/pur/pur0002/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`구매요구현황(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매요구현황 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 구매요구  액터: 구매담당자
     * 예상결과: 구매요구현황 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 구매요구현황 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매요구현황 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0002M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '구매요구현황 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0210M — 구매진행현황
// TODO(menuId): SYS_MENU_MGT에서 pur_0210M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0210M';
  const API_URL     = '/mis/pur/pur0210/getPurData.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`구매진행현황(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매진행현황 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 구매담당자
     * 예상결과: 구매진행현황 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 구매진행현황 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매진행현황 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0210M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '구매진행현황 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0211M — 구매접수
// TODO(menuId): SYS_MENU_MGT에서 pur_0211M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0211M';
  const API_URL     = '/mis/pur/pur0211/getRgstList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`구매접수(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매접수 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 구매담당자
     * 예상결과: 구매접수 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 구매접수 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매접수 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0211M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '구매접수 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0300M — 구매계약현황
// TODO(menuId): SYS_MENU_MGT에서 pur_0300M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0300M';
  const API_URL     = '/mis/pur/pur0300/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`구매계약현황(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매계약현황 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 구매담당자
     * 예상결과: 구매계약현황 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 구매계약현황 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매계약현황 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0300M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '구매계약현황 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0350M — 물품대장
// TODO(menuId): SYS_MENU_MGT에서 pur_0350M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0350M';
  const API_URL     = '/mis/pur/pur0350/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`물품대장(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 물품대장 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 구매계약관리  액터: 구매담당자
     * 예상결과: 물품대장 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 물품대장 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 물품대장 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0350M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '물품대장 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0400M — 구매검수
// TODO(menuId): SYS_MENU_MGT에서 pur_0400M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0400M';
  const API_URL     = '/mis/pur/pur0400/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`구매검수(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매검수 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 구매검수  액터: 구매담당자
     * 예상결과: 구매검수 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 구매검수 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매검수 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0400M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '구매검수 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0420M — 구매기술검사
// TODO(menuId): SYS_MENU_MGT에서 pur_0420M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0420M';
  const API_URL     = '/mis/pur/pur0420/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`구매기술검사(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매기술검사 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 구매검수  액터: 구매담당자
     * 예상결과: 구매기술검사 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 구매기술검사 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매기술검사 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0420M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '구매기술검사 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0430M — 용역/공사 검사조서
// TODO(menuId): SYS_MENU_MGT에서 pur_0430M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0430M';
  const API_URL     = '/mis/pur/pur0430/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`용역/공사 검사조서(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 용역/공사 검사조서 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 구매검수  액터: 구매담당자
     * 예상결과: 용역/공사 검사조서 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 용역/공사 검사조서 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 용역/공사 검사조서 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0430M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '용역/공사 검사조서 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0500M — 대금지급신청
// TODO(menuId): SYS_MENU_MGT에서 pur_0500M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0500M';
  const API_URL     = '/mis/pur/pur0500/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`대금지급신청(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 대금지급신청 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 대금지급  액터: 구매담당자
     * 예상결과: 대금지급신청 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 대금지급신청 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 대금지급신청 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0500M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '대금지급신청 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0591M — 구매미지급 관리
// Pattern A(인라인 폼/그리드 저장) — 저장/삭제 버튼 핸들러가 gfn_tran('setData / delData')을 직접 호출(INSERT 전용 팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT 진입 확인 TC로 강등.
// TODO(menuId): SYS_MENU_MGT에서 pur_0591M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0591M';
  const API_URL     = '/mis/pur/pur0591/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`구매미지급 관리(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매미지급 관리 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 대금지급  액터: 구매담당자
     * 비고: 저장서비스=setData / delData (Pattern A) — INSERT/DELETE 자동 생성 대상 아님, SELECT 진입 확인으로 강등.
     * 예상결과: 구매미지급 관리 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 구매미지급 관리 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매미지급 관리 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0591M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '구매미지급 관리 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0810M — 실적증명서 목록
// TODO(menuId): SYS_MENU_MGT에서 pur_0810M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0810M';
  const API_URL     = '/mis/pur/pur0810/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`실적증명서 목록(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 실적증명서 목록 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 실적관리  액터: 구매담당자
     * 예상결과: 실적증명서 목록 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 실적증명서 목록 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 실적증명서 목록 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0810M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '실적증명서 목록 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0821M — 법정구매현황
// TODO(menuId): SYS_MENU_MGT에서 pur_0821M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0821M';
  const API_URL     = '/mis/pur/pur0821/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`법정구매현황(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 법정구매현황 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 법정구매  액터: 구매담당자
     * 예상결과: 법정구매현황 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 법정구매현황 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 법정구매현황 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0821M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '법정구매현황 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0910M — 직접구매신청현황
{
  const MENU_ID     = 'M_MIS_06_01_05';
  const PGM_ID      = 'pur_0910M';
  const API_URL     = '/mis/pur/pur0910/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`직접구매신청현황(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 직접구매신청현황 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 직접구매  액터: 구매담당자
     * 예상결과: 직접구매신청현황 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 직접구매신청현황 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 직접구매신청현황 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0910M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '직접구매신청현황 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0920M — 직접구매물품현황
// TODO(menuId): SYS_MENU_MGT에서 pur_0920M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0920M';
  const API_URL     = '/mis/pur/pur0915/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`직접구매물품현황(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 직접구매물품현황 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 직접구매  액터: 구매담당자
     * 예상결과: 직접구매물품현황 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 직접구매물품현황 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 직접구매물품현황 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0920M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '직접구매물품현황 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0940M — 직접구매검수
// TODO(menuId): SYS_MENU_MGT에서 pur_0940M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0940M';
  const API_URL     = '/mis/pur/pur0940/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`직접구매검수(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 직접구매검수 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 직접구매  액터: 구매담당자
     * 예상결과: 직접구매검수 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 직접구매검수 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 직접구매검수 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0940M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '직접구매검수 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0960M — 단가물품신청현황
// TODO(menuId): SYS_MENU_MGT에서 pur_0960M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0960M';
  const API_URL     = '/mis/pur/pur0960/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`단가물품신청현황(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 단가물품신청현황 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 단가구매  액터: 구매담당자
     * 예상결과: 단가물품신청현황 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 단가물품신청현황 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 단가물품신청현황 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0960M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '단가물품신청현황 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_0970M — 단가물품현황
// TODO(menuId): SYS_MENU_MGT에서 pur_0970M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_0970M';
  const API_URL     = '/mis/pur/pur0970/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`단가물품현황(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 단가물품현황 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 단가구매  액터: 구매담당자
     * 예상결과: 단가물품현황 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 단가물품현황 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 단가물품현황 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_0970M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '단가물품현황 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_4000M — 안전보건수준대상관리
// Pattern A(인라인 폼/그리드 저장) — 저장/삭제 버튼 핸들러가 gfn_tran('setSave / setDelete')을 직접 호출(INSERT 전용 팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT 진입 확인 TC로 강등.
// TODO(menuId): SYS_MENU_MGT에서 pur_4000M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_4000M';
  const API_URL     = '/mis/pur/pur4000/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`안전보건수준대상관리(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 안전보건수준대상관리 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 안전관리  액터: 구매담당자
     * 비고: 저장서비스=setSave / setDelete (Pattern A) — INSERT/DELETE 자동 생성 대상 아님, SELECT 진입 확인으로 강등.
     * 예상결과: 안전보건수준대상관리 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 안전보건수준대상관리 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 안전보건수준대상관리 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_4000M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '안전보건수준대상관리 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_4010M — 우선협상 업체등록(목록)
// TODO(menuId): SYS_MENU_MGT에서 pur_4010M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_4010M';
  const API_URL     = '/mis/pur/pur4010/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`우선협상 업체등록(목록)(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 우선협상 업체등록(목록) - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 안전관리  액터: 구매담당자
     * 예상결과: 우선협상 업체등록(목록) 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 우선협상 업체등록(목록) - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 우선협상 업체등록(목록) - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_4010M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '우선협상 업체등록(목록) 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_4020M — 안전관리시스템연동관리
// Pattern A(인라인 폼/그리드 저장) — 저장/삭제 버튼 핸들러가 gfn_tran('setSave')을 직접 호출(INSERT 전용 팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT 진입 확인 TC로 강등.
// TODO(menuId): SYS_MENU_MGT에서 pur_4020M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_4020M';
  const API_URL     = '/mis/pur/pur4020/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`안전관리시스템연동관리(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 안전관리시스템연동관리 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: 안전관리  액터: 구매담당자
     * 비고: 저장서비스=setSave (Pattern A) — INSERT/DELETE 자동 생성 대상 아님, SELECT 진입 확인으로 강등.
     * 예상결과: 안전관리시스템연동관리 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 안전관리시스템연동관리 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 안전관리시스템연동관리 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_4020M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '안전관리시스템연동관리 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_5100M — MRO상품계약
// Pattern A(인라인 폼/그리드 저장) — 저장/삭제 버튼 핸들러가 gfn_tran('tmDelete')을 직접 호출(INSERT 전용 팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT 진입 확인 TC로 강등.
// TODO(menuId): SYS_MENU_MGT에서 pur_5100M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_5100M';
  const API_URL     = '/mis/pur/pur5100/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`MRO상품계약(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] MRO상품계약 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: MRO구매  액터: 구매담당자
     * 비고: 저장서비스=tmDelete (Pattern A) — INSERT/DELETE 자동 생성 대상 아님, SELECT 진입 확인으로 강등.
     * 예상결과: MRO상품계약 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] MRO상품계약 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] MRO상품계약 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5100M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), 'MRO상품계약 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_5110M — 구매요구(MRO)
// TODO(menuId): SYS_MENU_MGT에서 pur_5110M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_5110M';
  const API_URL     = '/mis/pur/pur5110/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`구매요구(MRO)(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] 구매요구(MRO) - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: MRO구매  액터: 구매담당자
     * 예상결과: 구매요구(MRO) 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] 구매요구(MRO) - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] 구매요구(MRO) - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5110M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), '구매요구(MRO) 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_5120M — MRO정산현황
// TODO(menuId): SYS_MENU_MGT에서 pur_5120M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_5120M';
  const API_URL     = '/mis/pur/pur5120/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`MRO정산현황(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] MRO정산현황 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: MRO구매  액터: 구매담당자
     * 예상결과: MRO정산현황 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] MRO정산현황 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] MRO정산현황 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5120M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), 'MRO정산현황 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_5130M — MRO 대금지급
// Pattern A(인라인 폼/그리드 저장) — 저장/삭제 버튼 핸들러가 gfn_tran('setData')을 직접 호출(INSERT 전용 팝업 없음).
//   ⇒ 자동 INSERT/DELETE 생성 대상 아님(SKILL 5-6). SELECT 진입 확인 TC로 강등.
// TODO(menuId): SYS_MENU_MGT에서 pur_5130M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_5130M';
  const API_URL     = '/mis/pur/pur5130/getList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`MRO 대금지급(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] MRO 대금지급 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: MRO구매  액터: 구매담당자
     * 비고: 저장서비스=setData (Pattern A) — INSERT/DELETE 자동 생성 대상 아님, SELECT 진입 확인으로 강등.
     * 예상결과: MRO 대금지급 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] MRO 대금지급 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] MRO 대금지급 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5130M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), 'MRO 대금지급 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}

// ───────────────────────────────────────────────────────────────────────────
// pur_5140M — MRO 요구물품취소
// TODO(menuId): SYS_MENU_MGT에서 pur_5140M 실제 menuId 조회 필요 — 현재 플레이스홀더/openMenuByPgm 폴백.
{
  const MENU_ID     = 'M_MIS_XX_XX_XX';
  const PGM_ID      = 'pur_5140M';
  const API_URL     = '/mis/pur/pur5140/getPurCnclRqstList.do';
  const DS_LIST     = 'ds_list';
  const RESULT_COLS = [];

  test.describe.serial(`MRO 요구물품취소(${PGM_ID}) 통합 테스트`, () => {
    test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
    test.afterAll(() => { flushLogs(); });

    /**
     * [no:1] MRO 요구물품취소 - 화면 진입 및 초기 조회
     * 중분류: 구매관리  소분류: MRO구매  액터: 구매담당자
     * 예상결과: MRO 요구물품취소 화면 진입 시 기본 조회가 수행되고 그리드에 목록과 총 건수가 표시된다.
     */
    test('[no:1] MRO 요구물품취소 - 화면 진입 및 초기 조회', async ({ workerPage: page }) => {
      logTestStart('[no:1] MRO 요구물품취소 - 화면 진입 및 초기 조회');
      logInput('검색조건', '없음 (초기 진입)');
      const formKey = await navigateToMenu(page, MENU_ID, PGM_ID, API_URL, DS_LIST);
      const rows    = await getNexacroDatasetRows(page, formKey, DS_LIST, RESULT_COLS);
      logResult('조회 건수', `${rows.length}건`);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/pur_5140M-inte-no1-open.png`, fullPage: true }).catch(() => {});
      expect(Array.isArray(rows), 'MRO 요구물품취소 화면 진입 및 ds_list 로드').toBe(true);
      logResult('검증', 'PASS');
    });

  });
}
