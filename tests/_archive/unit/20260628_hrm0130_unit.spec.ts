// ==============================================================
// 부서관리 단위 테스트 (Nexacro 트랜잭션 기반)
// 생성일시: 2026-06-28  |  파일: 20260628_hrm0130_unit.spec.ts
// 메뉴경로: 인사관리 > 조직관리 > 부서관리
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// NOTE: Nexacro는 SSV 포맷 + 동적 csrfKey → page.request.post(XML) 사용 불가
//       setNexacroDatasetValue + triggerNexacroButton 으로 Nexacro 자체 트랜잭션 실행
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import {
  openMenuById,
  waitForNexacroAppReady,
  waitForNexacroDataset,
  getNexacroDatasetRows,
} from '../utils/nexacro-helper';

const SCREENSHOT_DIR = 'test-results/screenshots';
const MENU_ID        = 'M_MIS_01_01_03';
const SLOW           = 800;

// XFDL 정의명 → 런타임 축약명 매핑 (SCH_ 제거 가설 — 테스트 실행 시 로그로 검증)
// XFDL: SCH_HDODF_CD, SCH_BZPLC_CD, SCH_DEPT_NM, SCH_USE_YN
const XFDL_TO_RT: Record<string, string> = {
  SCH_HDODF_CD: 'HDODF_CD',
  SCH_BZPLC_CD: 'BZPLC_CD',
  SCH_DEPT_NM:  'DEPT_NM',
  SCH_USE_YN:   'USE_YN',
};

const DS_LIST_COLS = ['DEPT_CD', 'DEPT_NM', 'USE_YN', 'BZPLC_CD'];

// 메뉴 진입 + 초기 getList.do 응답 대기
async function navigateTo(page: Page): Promise<string> {
  await waitForNexacroAppReady(page, 20000);

  const initResp = page.waitForResponse(
    r => r.url().includes('/hrm0130/getList.do'), { timeout: 20000 }
  ).catch(() => null);

  const nav = await openMenuById(page, MENU_ID);
  if (!nav.ok) throw new Error(`메뉴 로드 실패: ${nav.error}`);
  console.log(`[NAV] menuNm=${nav.menuNm}`);

  const resp = await initResp;
  if (resp) console.log(`[NAV] 초기 조회 HTTP ${resp.status()}`);

  const dsReady = await waitForNexacroDataset(page, MENU_ID, 'ds_list', 1, 12000);
  console.log(`[NAV] ds_list ready=${dsReady}`);

  return MENU_ID;
}

// ds_search 리셋(clearData+addRow) + 런타임 컬럼명으로 조건 설정 → fn_search 직접 호출
async function search(
  page: Page,
  formKey: string,
  conditions: Record<string, string>
): Promise<Record<string, string>[]> {
  // XFDL 키를 런타임 컬럼명으로 변환
  const rtConditions: Record<string, string> = {};
  for (const [xfdl, val] of Object.entries(conditions)) {
    const rt = XFDL_TO_RT[xfdl] ?? xfdl;
    rtConditions[rt] = val;
  }

  // 응답 대기 먼저 등록
  const respPromise = page.waitForResponse(
    r => r.url().includes('/hrm0130/getList.do'), { timeout: 15000 }
  );

  const setupOk = await page.evaluate(({ fk, rtCond }) => {
    try {
      const app  = (window as any).nexacro.getApplication();
      const fset = app.mainframe.VFrameSet.HFrameSet.VFrameSet.FrameSet;
      const ff   = fset?.[fk]?.form;
      const form = ff?.div_workForm?.form ?? ff;
      if (!form) return 'ERR:no-form';

      const ds = form.ds_search;
      if (!ds) return 'ERR:no-ds_search';

      // 런타임 컬럼명 로깅 (첫 실행 시 매핑 검증용)
      const rtCols = Array.from({ length: ds.getColCount() as number },
        (_: unknown, i: number) => ds.getColID(i));

      ds.set_enableevent(false);
      ds.clearData();
      ds.addRow();
      for (const [col, val] of Object.entries(rtCond as Record<string, string>)) {
        ds.setColumn(0, col, val);
      }
      ds.set_enableevent(true);

      if (typeof form.fn_search === 'function') {
        form.fn_search();
        return 'fn_search|cols:' + rtCols.join(',');
      }
      const btn = form.btn_search;
      if (btn) { btn.trigger('onclick', btn); return 'btn_search|cols:' + rtCols.join(','); }
      return 'ERR:no-trigger|cols:' + rtCols.join(',');
    } catch (e) { return 'ERR:' + String(e); }
  }, { fk: formKey, rtCond: rtConditions });

  console.log(`  [SEARCH] setup=${setupOk} cond=${JSON.stringify(rtConditions)}`);

  const resp = await respPromise;
  console.log(`  [RESP] HTTP ${resp.status()}`);
  expect(resp.status(), 'API HTTP 200').toBe(200);

  await waitForNexacroDataset(page, formKey, 'ds_list', 0, 8000).catch(() => null);
  await page.waitForTimeout(SLOW);

  return getNexacroDatasetRows(page, formKey, 'ds_list', DS_LIST_COLS);
}

test.describe('부서관리 단위 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 부서관리 - 전체 조회
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1
   */
  test('[no:1] 부서관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서관리 - 전체 조회');
    logInput('검색조건', '없음 (전체)');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', DS_LIST_COLS);

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/부서관리-no1-all.png`, fullPage: true });

    expect(rows.length, '부서관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 부서관리 - 사용여부=Y 필터
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.USE_YN = 'Y'
   */
  test('[no:2] 부서관리 - 사용여부=Y 필터', async ({ workerPage: page }) => {
    logTestStart('[no:2] 부서관리 - 사용여부=Y 필터');
    logInput('SCH_USE_YN', 'Y');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_USE_YN: 'Y' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/부서관리-no2-useY.png`, fullPage: true });

    expect(rows.length, '부서관리 사용여부=Y 조회 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) =>
      expect(r.USE_YN, `[행${i}] USE_YN 불일치`).toBe('Y')
    );
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 부서관리 - 사용여부=N 필터
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서관리 목록이 조회된다. (총 N건 — 미사용 부서 없으면 0건)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.USE_YN = 'N'
   */
  test('[no:3] 부서관리 - 사용여부=N 필터', async ({ workerPage: page }) => {
    logTestStart('[no:3] 부서관리 - 사용여부=N 필터');
    logInput('SCH_USE_YN', 'N');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_USE_YN: 'N' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/부서관리-no3-useN.png`, fullPage: true });

    // expectZero: true — 미사용 부서가 없어 0건이 기대값
    expect(rows.length, '부서관리 사용여부=N 조회 0건').toBe(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] [단위] [SELECT] 부서관리 - 부서명 키워드 검색 (부)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.DEPT_NM LIKE '%' || TRIM('부') || '%'
   */
  test('[no:4] 부서관리 - 부서명 키워드 검색 (부)', async ({ workerPage: page }) => {
    logTestStart('[no:4] 부서관리 - 부서명 키워드 검색 (부)');
    logInput('SCH_DEPT_NM', '부');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_DEPT_NM: '부' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/부서관리-no4-deptnm.png`, fullPage: true });

    expect(rows.length, '부서관리 부서명 검색 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) =>
      expect(r.DEPT_NM, `[행${i}] DEPT_NM에 '부' 미포함`).toContain('부')
    );
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 부서관리 - 사용여부=Y + 부서명 복합 검색
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서관리 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.USE_YN = 'Y' AND A.DEPT_NM LIKE '%' || TRIM('부') || '%'
   */
  test('[no:5] 부서관리 - 사용여부=Y + 부서명 복합 검색', async ({ workerPage: page }) => {
    logTestStart('[no:5] 부서관리 - 사용여부=Y + 부서명 복합 검색');
    logInput('SCH_USE_YN', 'Y');
    logInput('SCH_DEPT_NM', '부');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_USE_YN: 'Y', SCH_DEPT_NM: '부' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/부서관리-no5-complex.png`, fullPage: true });

    expect(rows.length, '부서관리 복합 검색 1건 이상').toBeGreaterThan(0);
    rows.forEach((r, i) => {
      expect(r.USE_YN, `[행${i}] USE_YN 불일치`).toBe('Y');
      expect(r.DEPT_NM, `[행${i}] DEPT_NM에 '부' 미포함`).toContain('부');
    });
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 부서관리 - DEPT_CD 오름차순 정렬
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서관리 목록이 조회된다. (총 N건) — DEPT_CD 오름차순 정렬
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1
   */
  test('[no:6] 부서관리 - DEPT_CD 오름차순 정렬', async ({ workerPage: page }) => {
    logTestStart('[no:6] 부서관리 - DEPT_CD 오름차순 정렬');
    logInput('검색조건', '없음 (전체 조회 후 정렬 검증)');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', DS_LIST_COLS);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/부서관리-no6-sort.png`, fullPage: true });

    expect(rows.length, '정렬 검증을 위한 목록 데이터 필요').toBeGreaterThan(0);
    for (let i = 1; i < rows.length; i++) {
      expect(
        rows[i].DEPT_CD >= rows[i - 1].DEPT_CD,
        `[행${i}] DEPT_CD 오름차순 정렬 오류`
      ).toBe(true);
    }
    logResult('검증', `PASS — ${rows.length}행 정렬 확인`);
  });
});
