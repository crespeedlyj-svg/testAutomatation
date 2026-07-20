// ==============================================================
// 인사기록카드 단위 테스트 (Nexacro 트랜잭션 기반)
// 생성일시: 2026-06-29  |  파일: 20260629_hrm3010_unit.spec.ts
// 메뉴경로: 인사관리 > 인사기록카드  |  MENU_ID: M_MIS_01_03_01
// storageState 자동 주입 — 로그인/goto 코드 작성 절대 금지
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
const MENU_ID        = 'M_MIS_01_03_01';
const SLOW           = 800;

// XFDL 정의명 → 런타임 축약명 매핑 (위치 기반, browser 실측)
// XFDL: SCH_HLDF_FG_CD, SCH_EMP_NO, SCH_EMP_NM, SCH_DEPT_CD, SCH_DEPT_NM, SCH_EMPO_STLF_CD, SCH_JSFC_CD, SCH_GRD_CD
// 런타임: HLDF_FG(0), EMP_RID(1), EMP_NO(2), EMP_NM(3), DEPT_CD(4), DEPT_NM(5), GRD_FG(6)
const XFDL_TO_RT: Record<string, string> = {
  SCH_HLDF_FG_CD:    'HLDF_FG',  // pos 0 — confirmed
  SCH_EMP_NO:        'EMP_RID',  // pos 1 — confirmed by browser experiment
  SCH_EMP_NM:        'EMP_NO',   // pos 2 — positional
  SCH_DEPT_CD:       'EMP_NM',   // pos 3 — positional
  SCH_DEPT_NM:       'DEPT_CD',  // pos 4 — positional
  SCH_EMPO_STLF_CD:  'DEPT_NM',  // pos 5 — positional
  SCH_JSFC_CD:       'GRD_FG',   // pos 6 — positional
};

const DS_LIST_COLS = ['EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'JSFC_NM'];

// 메뉴 진입 + 초기 getList.do 응답 대기
async function navigateTo(page: Page): Promise<string> {
  await waitForNexacroAppReady(page, 20000);

  const initResp = page.waitForResponse(
    r => r.url().includes('/hrm3010/getList.do'), { timeout: 20000 }
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

// ds_search 리셋(clearData+addRow → I타입) + 런타임 컬럼명으로 조건 설정 → fn_search 직접 호출
async function search(
  page: Page,
  formKey: string,
  conditions: Record<string, string>
): Promise<Record<string, string>[]> {
  // conditions의 XFDL 키를 런타임 컬럼명으로 변환
  const rtConditions: Record<string, string> = {};
  for (const [xfdl, val] of Object.entries(conditions)) {
    const rt = XFDL_TO_RT[xfdl] ?? xfdl;
    rtConditions[rt] = val;
  }

  // 응답 대기 등록 먼저 (fn_search 호출 전)
  const respPromise = page.waitForResponse(
    r => r.url().includes('/hrm3010/getList.do'), { timeout: 15000 }
  );

  // ds_search 리셋 + 조건 설정 + fn_search 호출 — 단일 evaluate로 타이밍 보장
  const setupOk = await page.evaluate(({ fk, rtCond }) => {
    try {
      const app  = (window as any).nexacro.getApplication();
      const fset = app.mainframe.VFrameSet.HFrameSet.VFrameSet.FrameSet;
      const ff   = fset?.[fk]?.form;
      const form = ff?.div_workForm?.form ?? ff;
      if (!form) return 'ERR:no-form';

      const ds = form.ds_search;
      if (!ds) return 'ERR:no-ds_search';

      // 이벤트 억제 후 리셋
      ds.set_enableevent(false);
      ds.clearData();
      ds.addRow();
      // 조건 설정
      for (const [col, val] of Object.entries(rtCond as Record<string, string>)) {
        ds.setColumn(0, col, val);
      }
      ds.set_enableevent(true);

      // fn_search 직접 호출 (버튼 onclick 우회)
      if (typeof form.fn_search === 'function') {
        form.fn_search();
        return 'fn_search';
      }
      // 폴백: btn_search trigger
      const btn = form.btn_search;
      if (btn) { btn.trigger('onclick', btn); return 'btn_search'; }
      return 'ERR:no-trigger';
    } catch (e) { return 'ERR:' + String(e); }
  }, { fk: formKey, rtCond: rtConditions });

  console.log(`  [SEARCH] setup=${setupOk} cond=${JSON.stringify(rtConditions)}`);

  const resp = await respPromise;
  console.log(`  [RESP] HTTP ${resp.status()} url=${resp.url()}`);
  expect(resp.status(), 'API HTTP 200').toBe(200);

  await waitForNexacroDataset(page, formKey, 'ds_list', 0, 8000).catch(() => null);
  await page.waitForTimeout(SLOW);

  return getNexacroDatasetRows(page, formKey, 'ds_list', DS_LIST_COLS);
}

// TC 간 공유 데이터 (test.describe.serial 로 순서 보장)
let sharedRows: Record<string, string>[] = [];

test.describe.serial('인사기록카드 단위 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 인사기록카드 - 전체 조회
   * URL: /mis/hrm/hrm3010/getList.do
   * 예상결과: 인사기록카드 목록이 조회된다. (총 N건)
   * DB 확인: SELECT COUNT(*) FROM HRM_BAS_MGT HBM
   *          INNER JOIN HRM_BAS_DTL HBD ON HBD.EMP_NO=HBM.EMP_NO AND HBD.LAST_DTA_YN='Y'
   */
  test('[no:1] 인사기록카드 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 인사기록카드 - 전체 조회');
    logInput('검색조건', '없음 (전체)');

    const formKey = await navigateTo(page);
    const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', DS_LIST_COLS);

    sharedRows = rows;
    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: EMP_NO=${rows[0].EMP_NO} DEPT_CD=${rows[0].DEPT_CD} EMP_NM=${rows[0].EMP_NM}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-no1-all.png`, fullPage: true });

    expect(rows.length, '인사기록카드 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 인사기록카드 - 사원번호 단건 조회
   * URL: /mis/hrm/hrm3010/getList.do
   * 예상결과: TC1 첫 행의 EMP_NO로 조회 시 정확히 1건 반환
   * DB 확인: SELECT COUNT(*) FROM HRM_BAS_MGT HBM
   *          INNER JOIN HRM_BAS_DTL HBD ON HBD.EMP_NO=HBM.EMP_NO AND HBD.LAST_DTA_YN='Y'
   *          WHERE HBM.EMP_NO = :empNo
   */
  test('[no:2] 인사기록카드 - 사원번호 단건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 인사기록카드 - 사원번호 단건 조회');

    const empNo = sharedRows[0]?.EMP_NO ?? '';
    if (!empNo) {
      console.log('  [SKIP] TC1 에서 데이터 미취득 — EMP_NO 없음');
      test.skip();
      return;
    }
    logInput('SCH_EMP_NO', empNo);

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_EMP_NO: empNo });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-no2-empno.png`, fullPage: true });

    expect(rows.length, `사원번호=${empNo} 단건 조회`).toBe(1);
    expect(rows[0].EMP_NO, 'EMP_NO 일치').toBe(empNo);
    logResult('검증', 'PASS');
  });

  /**
   * [no:3] [단위] [SELECT] 인사기록카드 - 부서코드 필터
   * URL: /mis/hrm/hrm3010/getList.do
   * 예상결과: TC1 첫 행의 DEPT_CD로 조회 시 1건 이상, 모든 행의 DEPT_CD 일치
   * DB 확인: SELECT COUNT(*) FROM HRM_BAS_DTL WHERE LAST_DTA_YN='Y' AND DEPT_CD = :deptCd
   */
  test('[no:3] 인사기록카드 - 부서코드 필터', async ({ workerPage: page }) => {
    logTestStart('[no:3] 인사기록카드 - 부서코드 필터');

    const deptCd = sharedRows[0]?.DEPT_CD ?? '';
    if (!deptCd) {
      console.log('  [SKIP] TC1 에서 데이터 미취득 — DEPT_CD 없음');
      test.skip();
      return;
    }
    logInput('SCH_DEPT_CD', deptCd);

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_DEPT_CD: deptCd });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-no3-dept.png`, fullPage: true });

    expect(rows.length, `부서코드=${deptCd} 1건 이상`).toBeGreaterThan(0);
    rows.forEach((r, i) =>
      expect(r.DEPT_CD, `[행${i}] DEPT_CD 불일치`).toBe(deptCd)
    );
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:4] [단위] [SELECT] 인사기록카드 - 재직구분 필터
   * URL: /mis/hrm/hrm3010/getList.do
   * 예상결과: HLDF_FG_CD='01'(재직) 인원 조회 → 1건 이상
   * DB 확인: SELECT COUNT(*) FROM HRM_BAS_DTL WHERE LAST_DTA_YN='Y' AND HLDF_FG_CD='01'
   * NOTE: '01' 코드는 COM_STD_MGT UPP_COMM_CD='101' 실제 코드 확인 필요
   */
  test('[no:4] 인사기록카드 - 재직구분 필터', async ({ workerPage: page }) => {
    logTestStart('[no:4] 인사기록카드 - 재직구분 필터');
    logInput('SCH_HLDF_FG_CD', '01');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_HLDF_FG_CD: '01' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-no4-hldf.png`, fullPage: true });

    expect(rows.length, '재직구분=01 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 인사기록카드 - 고용형태 필터
   * URL: /mis/hrm/hrm3010/getList.do
   * 예상결과: EMPO_STLF_CD='01'(정규직 등) 인원 조회 → 1건 이상
   * DB 확인: SELECT COUNT(*) FROM HRM_BAS_DTL WHERE LAST_DTA_YN='Y' AND EMPO_STLF_CD='01'
   * NOTE: '01' 코드는 COM_STD_MGT UPP_COMM_CD='102' 실제 코드 확인 필요
   */
  test('[no:5] 인사기록카드 - 고용형태 필터', async ({ workerPage: page }) => {
    logTestStart('[no:5] 인사기록카드 - 고용형태 필터');
    logInput('SCH_EMPO_STLF_CD', '01');

    const formKey = await navigateTo(page);
    const rows    = await search(page, formKey, { SCH_EMPO_STLF_CD: '01' });

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-no5-empo.png`, fullPage: true });

    expect(rows.length, '고용형태=01 1건 이상').toBeGreaterThan(0);
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:6] [단위] [SELECT] 인사기록카드 - EMP_NO 오름차순 정렬 확인
   * URL: /mis/hrm/hrm3010/getList.do
   * 예상결과: TC1 전체 조회 결과가 EMP_NO 오름차순 정렬되어 있음
   * DB 확인: SELECT HBM.EMP_NO FROM ... ORDER BY HBM.EMP_NO
   */
  test('[no:6] 인사기록카드 - EMP_NO 오름차순 정렬', async ({ workerPage: page }) => {
    logTestStart('[no:6] 인사기록카드 - EMP_NO 오름차순 정렬');

    if (sharedRows.length < 2) {
      console.log('  [SKIP] 정렬 검증을 위한 2건 이상 데이터 필요 — TC1 결과 미취득');
      test.skip();
      return;
    }

    const empNos = sharedRows.map(r => r.EMP_NO);
    logResult('첫 EMP_NO', empNos[0]);
    logResult('마지막 EMP_NO', empNos[empNos.length - 1]);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm3010-no6-sort.png`, fullPage: true });

    for (let i = 1; i < empNos.length; i++) {
      expect(
        empNos[i] >= empNos[i - 1],
        `EMP_NO 오름차순: [${i - 1}]=${empNos[i - 1]} ≤ [${i}]=${empNos[i]}`
      ).toBe(true);
    }
    logResult('검증', `PASS — ${empNos.length}행 정렬 확인`);
  });
});
