// ==============================================================
// PAY(급여관리) 모듈 배치 단위 테스트 — 생성일 2026-06-28
// 입력: _workspace/pay/01_scenarios.json (unit 250건 / integ 15건)
// 검증 패턴: openMenuById + setNexacroComponentValue + waitForNexacroDataset
// menuPathStatus = UNRESOLVED → 모든 화면 menuId 미확인(TODO) → test.skip 으로 생성
//   SYS_MENU_MGT 조회로 menuId 확정 후 test.skip → test 로 전환하여 활성화
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import {
  openMenuById,
  isMenuActive,
  waitForNexacroAppReady,
  setNexacroComponentValue,
  clearNexacroDataset,
  getNexacroDatasetRows,
  waitForNexacroDataset,
} from '../utils/nexacro-helper';

const SCREENSHOT_DIR = 'test-results/screenshots';
const SLOW = 1500;


test.describe('간이세액조견표 (pay_0000M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_0000M' OR MNU_NM LIKE '간이세액조견표%'
  const MENU_ID = 'TODO_pay_0000M';
  const API_URL = '/mis/pay/pay0000/getMaxYymm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_APP_YM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay0000/getMaxYymm.do | inputCols=SCH_APP_YM
  test.skip('[no:1] 간이세액조견표 - 조회 (getMaxYymm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay0000/getData.do | inputCols=SCH_APP_YM
  test.skip('[no:2] 간이세액조견표 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay0000/setData.do | inputCols=SCH_APP_YM
  test.skip('[no:3] 간이세액조견표 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay0000/newData.do | inputCols=SCH_APP_YM
  test.skip('[no:4] 간이세액조견표 - 조회 (newData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay0000/delData.do | inputCols=SCH_APP_YM
  test.skip('[no:5] 간이세액조견표 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기타세율기준관리 (pay_0010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_0010M' OR MNU_NM LIKE '기타세율기준관리%'
  const MENU_ID = 'TODO_pay_0010M';
  const API_URL = '/mis/pay/pay0010/getMaxYymm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_APP_YM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay0010/getMaxYymm.do | inputCols=SCH_APP_YM
  test.skip('[no:1] 기타세율기준관리 - 조회 (getMaxYymm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay0010/getData.do | inputCols=SCH_APP_YM
  test.skip('[no:2] 기타세율기준관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay0010/setData.do | inputCols=SCH_APP_YM
  test.skip('[no:3] 기타세율기준관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay0010/delData.do | inputCols=SCH_APP_YM
  test.skip('[no:4] 기타세율기준관리 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay0010/newData.do | inputCols=SCH_APP_YM
  test.skip('[no:5] 기타세율기준관리 - 조회 (newData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay0010/chkData.do | inputCols=SCH_APP_YM
  test.skip('[no:6] 기타세율기준관리 - 조회 (chkData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('건강보험료 산정기준 관리 (pay_0060M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_0060M' OR MNU_NM LIKE '건강보험료 산정기준 관리%'
  const MENU_ID = 'TODO_pay_0060M';
  const API_URL = '/mis/pay/pay0060/getMaxYymm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_APP_YM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay0060/getMaxYymm.do | inputCols=SCH_APP_YM
  test.skip('[no:1] 건강보험료 산정기준 관리 - 조회 (getMaxYymm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay0060/getData.do | inputCols=SCH_APP_YM
  test.skip('[no:2] 건강보험료 산정기준 관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay0060/setData.do | inputCols=SCH_APP_YM
  test.skip('[no:3] 건강보험료 산정기준 관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay0060/newData.do | inputCols=SCH_APP_YM
  test.skip('[no:4] 건강보험료 산정기준 관리 - 조회 (newData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국민연금산정기준관리 (pay_0070M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_0070M' OR MNU_NM LIKE '국민연금산정기준관리%'
  const MENU_ID = 'TODO_pay_0070M';
  const API_URL = '/mis/pay/pay0070/getMaxYymm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_APP_YM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay0070/getMaxYymm.do | inputCols=SCH_APP_YM
  test.skip('[no:1] 국민연금산정기준관리 - 조회 (getMaxYymm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay0070/getData.do | inputCols=SCH_APP_YM
  test.skip('[no:2] 국민연금산정기준관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay0070/setData.do | inputCols=SCH_APP_YM
  test.skip('[no:3] 국민연금산정기준관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay0070/newData.do | inputCols=SCH_APP_YM
  test.skip('[no:4] 국민연금산정기준관리 - 조회 (newData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('급여원장 (pay_1010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_1010M' OR MNU_NM LIKE '급여원장%'
  const MENU_ID = 'TODO_pay_1010M';
  const API_URL = '/mis/pay/pay1010/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_WORK_DGCNT', 'SCH_HLDF_FG_CD', 'SCH_EMPO_STLF_CD', 'SCH_JSFC_CD', 'SCH_GRD_CD', 'SCH_REG_YN', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_STDR_YM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay1010/getList.do | inputCols=SCH_EMP_NM,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_HLDF_FG_CD,SCH_EMPO_STLF_CD,SCH_JSFC_CD,SCH_GRD_CD,SCH_REG_YN,SCH_DEPT_CD,SCH_DEPT_NM,SCH_STDR_YM
  test.skip('[no:1] 급여원장 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay1010/setData.do | inputCols=SCH_EMP_NM,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_HLDF_FG_CD,SCH_EMPO_STLF_CD,SCH_JSFC_CD,SCH_GRD_CD,SCH_REG_YN,SCH_DEPT_CD,SCH_DEPT_NM,SCH_STDR_YM
  test.skip('[no:2] 급여원장 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1010/getBank.do | inputCols=SCH_EMP_NM,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_HLDF_FG_CD,SCH_EMPO_STLF_CD,SCH_JSFC_CD,SCH_GRD_CD,SCH_REG_YN,SCH_DEPT_CD,SCH_DEPT_NM,SCH_STDR_YM
  test.skip('[no:3] 급여원장 - 조회 (getBank) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개인별계좌조회 (pay_1020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_1020M' OR MNU_NM LIKE '개인별계좌조회%'
  const MENU_ID = 'TODO_pay_1020M';
  const API_URL = '/mis/pay/pay1020/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_SAL_ACC_FG', 'SCH_WORK_DGCNT', 'SCH_HLDF_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay1020/getData.do | inputCols=SCH_EMP_NO,SCH_EMP_NM,SCH_SAL_ACC_FG,SCH_WORK_DGCNT,SCH_HLDF_FG_CD
  test.skip('[no:1] 개인별계좌조회 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연봉관리 (pay_1030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_1030M' OR MNU_NM LIKE '연봉관리%'
  const MENU_ID = 'TODO_pay_1030M';
  const API_URL = '/mis/pay/pay1030/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_CTRCT_PROG_STAT_CD', 'SCH_WORK_DGCNT', 'SCH_APLY_FRM', 'SCH_APLY_TO', 'SCH_HLDF_FG_CD', 'Column0'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay1030/getList.do | inputCols=SCH_EMP_NO,SCH_EMP_NM,SCH_CTRCT_PROG_STAT_CD,SCH_WORK_DGCNT,SCH_APLY_FRM,SCH_APLY_TO,SCH_HLDF_FG_CD,Column0
  test.skip('[no:1] 연봉관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('가족수당기준관리 (pay_1040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_1040M' OR MNU_NM LIKE '가족수당기준관리%'
  const MENU_ID = 'TODO_pay_1040M';
  const API_URL = '/mis/pay/pay1040/getDate.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay1040/getDate.do | inputCols=SCH_STDR_DT
  test.skip('[no:1] 가족수당기준관리 - 조회 (getDate) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1040/getList.do | inputCols=SCH_STDR_DT
  test.skip('[no:2] 가족수당기준관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay1040/setData.do | inputCols=SCH_STDR_DT
  test.skip('[no:3] 가족수당기준관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지급/공제항목관리 (pay_1050M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_1050M' OR MNU_NM LIKE '지급/공제항목관리%'
  const MENU_ID = 'TODO_pay_1050M';
  const API_URL = '/mis/pay/pay1050/getCodePayItmCd.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SAL_ITM_FG', 'SCH_SAL_ITM_NM', 'SCH_USE_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay1050/getCodePayItmCd.do | inputCols=SCH_SAL_ITM_FG,SCH_SAL_ITM_NM,SCH_USE_CD
  test.skip('[no:1] 지급/공제항목관리 - 조회 (getCodePayItmCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1050/getData.do | inputCols=SCH_SAL_ITM_FG,SCH_SAL_ITM_NM,SCH_USE_CD
  test.skip('[no:2] 지급/공제항목관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay1050/setData.do | inputCols=SCH_SAL_ITM_FG,SCH_SAL_ITM_NM,SCH_USE_CD
  test.skip('[no:3] 지급/공제항목관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1050/getPayItmCd.do | inputCols=SCH_SAL_ITM_FG,SCH_SAL_ITM_NM,SCH_USE_CD
  test.skip('[no:4] 지급/공제항목관리 - 조회 (getPayItmCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('고정지급/공제항목관리 (pay_1060M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_1060M' OR MNU_NM LIKE '고정지급/공제항목관리%'
  const MENU_ID = 'TODO_pay_1060M';
  const API_URL = '/mis/pay/pay1060/getCodePayItm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YYMM', 'SCH_PMT_FG', 'SCH_SAL_ITM_FG', 'SCH_SAL_ITM_CD', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_WORK_DGCNT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay1060/getCodePayItm.do | inputCols=SCH_YYMM,SCH_PMT_FG,SCH_SAL_ITM_FG,SCH_SAL_ITM_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT
  test.skip('[no:1] 고정지급/공제항목관리 - 조회 (getCodePayItm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1060/getExDocDnData.do | inputCols=SCH_YYMM,SCH_PMT_FG,SCH_SAL_ITM_FG,SCH_SAL_ITM_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT
  test.skip('[no:2] 고정지급/공제항목관리 - 조회 (getExDocDnData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1060/getData.do | inputCols=SCH_YYMM,SCH_PMT_FG,SCH_SAL_ITM_FG,SCH_SAL_ITM_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT
  test.skip('[no:3] 고정지급/공제항목관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay1060/setData.do | inputCols=SCH_YYMM,SCH_PMT_FG,SCH_SAL_ITM_FG,SCH_SAL_ITM_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT
  test.skip('[no:4] 고정지급/공제항목관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('변동지급/공제항목관리 (pay_1070M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_1070M' OR MNU_NM LIKE '변동지급/공제항목관리%'
  const MENU_ID = 'TODO_pay_1070M';
  const API_URL = '/mis/pay/pay1070/getPmtInfo.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_PMT_YM', 'SCH_PMT_FG', 'SCH_SAL_ITM_FG', 'SCH_SAL_ITM_CD', 'SCH_EMP_NO', 'SCH_WORK_DGCNT', 'SCH_EMP_NM', 'SCH_PMT_SEQ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay1070/getPmtInfo.do | inputCols=SCH_PMT_YM,SCH_PMT_FG,SCH_SAL_ITM_FG,SCH_SAL_ITM_CD,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_PMT_SEQ
  test.skip('[no:1] 변동지급/공제항목관리 - 조회 (getPmtInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1070/getExDocDnData.do | inputCols=SCH_PMT_YM,SCH_PMT_FG,SCH_SAL_ITM_FG,SCH_SAL_ITM_CD,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_PMT_SEQ
  test.skip('[no:2] 변동지급/공제항목관리 - 조회 (getExDocDnData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1070/getPayItm.do | inputCols=SCH_PMT_YM,SCH_PMT_FG,SCH_SAL_ITM_FG,SCH_SAL_ITM_CD,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_PMT_SEQ
  test.skip('[no:3] 변동지급/공제항목관리 - 조회 (getPayItm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1070/getData.do | inputCols=SCH_PMT_YM,SCH_PMT_FG,SCH_SAL_ITM_FG,SCH_SAL_ITM_CD,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_PMT_SEQ
  test.skip('[no:4] 변동지급/공제항목관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay1070/setData.do | inputCols=SCH_PMT_YM,SCH_PMT_FG,SCH_SAL_ITM_FG,SCH_SAL_ITM_CD,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_PMT_SEQ
  test.skip('[no:5] 변동지급/공제항목관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1070/getConfChk.do | inputCols=SCH_PMT_YM,SCH_PMT_FG,SCH_SAL_ITM_FG,SCH_SAL_ITM_CD,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_PMT_SEQ
  test.skip('[no:6] 변동지급/공제항목관리 - 조회 (getConfChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사회보험가입관리 (pay_1080M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_1080M' OR MNU_NM LIKE '사회보험가입관리%'
  const MENU_ID = 'TODO_pay_1080M';
  const API_URL = '/mis/pay/pay1080/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_HLDF_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay1080/getData.do | inputCols=SCH_EMP_NM,SCH_EMP_NO,SCH_HLDF_FG_CD
  test.skip('[no:1] 사회보험가입관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1080/getDataNp.do | inputCols=SCH_EMP_NM,SCH_EMP_NO,SCH_HLDF_FG_CD
  test.skip('[no:2] 사회보험가입관리 - 조회 (getDataDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1080/getDataMc.do | inputCols=SCH_EMP_NM,SCH_EMP_NO,SCH_HLDF_FG_CD
  test.skip('[no:3] 사회보험가입관리 - 조회 (getDataDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1080/getDataEmp.do | inputCols=SCH_EMP_NM,SCH_EMP_NO,SCH_HLDF_FG_CD
  test.skip('[no:4] 사회보험가입관리 - 조회 (getDataDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1080/getDataIacl.do | inputCols=SCH_EMP_NM,SCH_EMP_NO,SCH_HLDF_FG_CD
  test.skip('[no:5] 사회보험가입관리 - 조회 (getDataDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay1080/setDataMc.do | inputCols=SCH_EMP_NM,SCH_EMP_NO,SCH_HLDF_FG_CD
  test.skip('[no:6] 사회보험가입관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay1080/setDataNp.do | inputCols=SCH_EMP_NM,SCH_EMP_NO,SCH_HLDF_FG_CD
  test.skip('[no:7] 사회보험가입관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay1080/setDataEmp.do | inputCols=SCH_EMP_NM,SCH_EMP_NO,SCH_HLDF_FG_CD
  test.skip('[no:8] 사회보험가입관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay1080/setDataIacl.do | inputCols=SCH_EMP_NM,SCH_EMP_NO,SCH_HLDF_FG_CD
  test.skip('[no:9] 사회보험가입관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1080/getExcelList.do | inputCols=SCH_EMP_NM,SCH_EMP_NO,SCH_HLDF_FG_CD
  test.skip('[no:10] 사회보험가입관리 - 조회 (getExcelList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사회보험고지등록 (pay_1085M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_1085M' OR MNU_NM LIKE '사회보험고지등록%'
  const MENU_ID = 'TODO_pay_1085M';
  const API_URL = '/mis/pay/pay1085/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YYMM', 'SCH_SOC_INSU_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay1085/getData.do | inputCols=SCH_YYMM,SCH_SOC_INSU_FG
  test.skip('[no:1] 사회보험고지등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay1085/setData.do | inputCols=SCH_YYMM,SCH_SOC_INSU_FG
  test.skip('[no:2] 사회보험고지등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1081/getEmpNo.do | inputCols=SCH_YYMM,SCH_SOC_INSU_FG
  test.skip('[no:3] 사회보험고지등록 - 조회 (getEmpNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('급여대장항목관리 (pay_1090M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_1090M' OR MNU_NM LIKE '급여대장항목관리%'
  const MENU_ID = 'TODO_pay_1090M';
  const API_URL = '/mis/pay/pay1090/getreset.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SAL_REGT_MNG_NO', 'SCH_SAL_REGT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/pay/pay1090/getreset.do | inputCols=SCH_SAL_REGT_MNG_NO,SCH_SAL_REGT_NM
  test.skip('[no:1] 급여대장항목관리 - 저장 (getresetData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay1090/setData.do | inputCols=SCH_SAL_REGT_MNG_NO,SCH_SAL_REGT_NM
  test.skip('[no:2] 급여대장항목관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1090/getData.do | inputCols=SCH_SAL_REGT_MNG_NO,SCH_SAL_REGT_NM
  test.skip('[no:3] 급여대장항목관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay1090/delData.do | inputCols=SCH_SAL_REGT_MNG_NO,SCH_SAL_REGT_NM
  test.skip('[no:4] 급여대장항목관리 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사회보험고지서등록 (pay_1100M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_1100M' OR MNU_NM LIKE '사회보험고지서등록%'
  const MENU_ID = 'TODO_pay_1100M';
  const API_URL = '/mis/pay/pay1100/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YYMM', 'SCH_SOC_INSU_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay1100/getData.do | inputCols=SCH_YYMM,SCH_SOC_INSU_FG
  test.skip('[no:1] 사회보험고지서등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay3010/getCalcFg.do | inputCols=SCH_YYMM,SCH_SOC_INSU_FG
  test.skip('[no:2] 사회보험고지서등록 - 조회 (getCalcFg) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay1100/setData.do | inputCols=SCH_YYMM,SCH_SOC_INSU_FG
  test.skip('[no:3] 사회보험고지서등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay1100/setCreateData.do | inputCols=SCH_YYMM,SCH_SOC_INSU_FG
  test.skip('[no:4] 사회보험고지서등록 - 저장 (setCreateData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('수당기준관리 (pay_1110M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_1110M' OR MNU_NM LIKE '수당기준관리%'
  const MENU_ID = 'TODO_pay_1110M';
  const API_URL = '/mis/pay/pay1110/getMaxYymm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_APP_YM', 'SCH_SAL_ITM_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay1110/getMaxYymm.do | inputCols=SCH_APP_YM,SCH_SAL_ITM_CD
  test.skip('[no:1] 수당기준관리 - 조회 (getMaxYymm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1110/getData.do | inputCols=SCH_APP_YM,SCH_SAL_ITM_CD
  test.skip('[no:2] 수당기준관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay1110/setData.do | inputCols=SCH_APP_YM,SCH_SAL_ITM_CD
  test.skip('[no:3] 수당기준관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1110/newData.do | inputCols=SCH_APP_YM,SCH_SAL_ITM_CD
  test.skip('[no:4] 수당기준관리 - 조회 (newData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1110/getHis.do | inputCols=SCH_APP_YM,SCH_SAL_ITM_CD
  test.skip('[no:5] 수당기준관리 - 조회 (getHis) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지급내역조회 (pay_2010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2010M' OR MNU_NM LIKE '지급내역조회%'
  const MENU_ID = 'TODO_pay_2010M';
  const API_URL = '/mis/pay/pay2010/getCol.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YM_FRM', 'SCH_YM_TO', 'SCH_PMT_FG', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_PAY_TYPE', 'SCH_WORK_DGCNT', 'SCHAREA_CD', 'SCH_AREA_TYPE', 'SCH_PAY_NM', 'SCH_RMK_YN', 'SCH_EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay2010/getCol.do | inputCols=SCH_YM_FRM,SCH_YM_TO,SCH_PMT_FG,SCH_EMP_NM,SCH_EMP_NO,SCH_PAY_TYPE,SCH_WORK_DGCNT,SCHAREA_CD,SCH_AREA_TYPE,SCH_PAY_NM,SCH_RMK_YN,SCH_EMPO_STLF_CD
  test.skip('[no:1] 지급내역조회 - 조회 (getCol) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay2010/getPmtInfo.do | inputCols=SCH_YM_FRM,SCH_YM_TO,SCH_PMT_FG,SCH_EMP_NM,SCH_EMP_NO,SCH_PAY_TYPE,SCH_WORK_DGCNT,SCHAREA_CD,SCH_AREA_TYPE,SCH_PAY_NM,SCH_RMK_YN,SCH_EMPO_STLF_CD
  test.skip('[no:2] 지급내역조회 - 조회 (getPayNM) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay2010/getList.do | inputCols=SCH_YM_FRM,SCH_YM_TO,SCH_PMT_FG,SCH_EMP_NM,SCH_EMP_NO,SCH_PAY_TYPE,SCH_WORK_DGCNT,SCHAREA_CD,SCH_AREA_TYPE,SCH_PAY_NM,SCH_RMK_YN,SCH_EMPO_STLF_CD
  test.skip('[no:3] 지급내역조회 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('급여명세서조회 (pay_2020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2020M' OR MNU_NM LIKE '급여명세서조회%'
  const MENU_ID = 'TODO_pay_2020M';
  const API_URL = '/mis/pay/pay2020/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['YYMM_FRM', 'YYMM_TO', 'EMP_NM', 'EMP_NO', 'WORK_DGCNT', 'PMT_SEQ', 'BE_EMP_NO', 'BE_PASS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay2020/getList.do | inputCols=YYMM_FRM,YYMM_TO,EMP_NM,EMP_NO,WORK_DGCNT,PMT_SEQ,BE_EMP_NO,BE_PASS
  test.skip('[no:1] 급여명세서조회 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('원천징수이행현황 (pay_2040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2040M' OR MNU_NM LIKE '원천징수이행현황%'
  const MENU_ID = 'TODO_pay_2040M';
  const API_URL = '/mis/pay/pay1157/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['YYMM', 'CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay1157/getList.do | inputCols=YYMM,CLS
  test.skip('[no:1] 원천징수이행현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay1157/getListDtl.do | inputCols=YYMM,CLS
  test.skip('[no:2] 원천징수이행현황 - 조회 (getListDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('가족수당지급현황 (pay_2060M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2060M' OR MNU_NM LIKE '가족수당지급현황%'
  const MENU_ID = 'TODO_pay_2060M';
  const API_URL = '/mis/pay/pay2060/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YM_FRM', 'SCH_YM_TO', 'SCH_PMT_FG', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_PAY_TYPE', 'SCH_WORK_DGCNT', 'SCHAREA_CD', 'SCH_AREA_TYPE', 'SCH_PAY_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay2060/getList.do | inputCols=SCH_YM_FRM,SCH_YM_TO,SCH_PMT_FG,SCH_EMP_NM,SCH_EMP_NO,SCH_PAY_TYPE,SCH_WORK_DGCNT,SCHAREA_CD,SCH_AREA_TYPE,SCH_PAY_NM
  test.skip('[no:1] 가족수당지급현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지급내역조회 (pay_2070M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2070M' OR MNU_NM LIKE '지급내역조회%'
  const MENU_ID = 'TODO_pay_2070M';
  const API_URL = '/mis/pay/pay2010/getCol.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YM_FRM', 'SCH_YM_TO', 'SCH_PMT_FG', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_PAY_TYPE', 'SCH_WORK_DGCNT', 'SCHAREA_CD', 'SCH_AREA_TYPE', 'SCH_PAY_NM', 'SCH_RMK_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay2010/getCol.do | inputCols=SCH_YM_FRM,SCH_YM_TO,SCH_PMT_FG,SCH_EMP_NM,SCH_EMP_NO,SCH_PAY_TYPE,SCH_WORK_DGCNT,SCHAREA_CD,SCH_AREA_TYPE,SCH_PAY_NM,SCH_RMK_YN
  test.skip('[no:1] 지급내역조회 - 조회 (getCol) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay2010/getPmtInfo.do | inputCols=SCH_YM_FRM,SCH_YM_TO,SCH_PMT_FG,SCH_EMP_NM,SCH_EMP_NO,SCH_PAY_TYPE,SCH_WORK_DGCNT,SCHAREA_CD,SCH_AREA_TYPE,SCH_PAY_NM,SCH_RMK_YN
  test.skip('[no:2] 지급내역조회 - 조회 (getPayNM) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay2010/getList.do | inputCols=SCH_YM_FRM,SCH_YM_TO,SCH_PMT_FG,SCH_EMP_NM,SCH_EMP_NO,SCH_PAY_TYPE,SCH_WORK_DGCNT,SCHAREA_CD,SCH_AREA_TYPE,SCH_PAY_NM,SCH_RMK_YN
  test.skip('[no:3] 지급내역조회 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('4대보험 현황 (pay_2080M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2080M' OR MNU_NM LIKE '4대보험 현황%'
  const MENU_ID = 'TODO_pay_2080M';
  const API_URL = '/mis/pay/pay3030/getPmtInfo.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_PMT_YM', 'SCH_PMT_SEQ', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_WORK_DGCNT', 'SCH_RP_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay3030/getPmtInfo.do | inputCols=SCH_PMT_YM,SCH_PMT_SEQ,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_RP_FG_CD
  test.skip('[no:1] 4대보험 현황 - 조회 (getPmtInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay2080/getList.do | inputCols=SCH_PMT_YM,SCH_PMT_SEQ,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_RP_FG_CD
  test.skip('[no:2] 4대보험 현황 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('수당별 연간 급여현황 (pay_2090M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2090M' OR MNU_NM LIKE '수당별 연간 급여현황%'
  const MENU_ID = 'TODO_pay_2090M';
  const API_URL = '/mis/pay/pay2090/getMonth.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YM_FRM', 'SCH_YM_TO', 'SCH_SAL_ITM_CD', 'SCH_SAL_ITM_NM', 'SCH_EMP_NO', 'SCH_WORK_DGCNT', 'SCH_EMP_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay2090/getMonth.do | inputCols=SCH_YM_FRM,SCH_YM_TO,SCH_SAL_ITM_CD,SCH_SAL_ITM_NM,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM
  test.skip('[no:1] 수당별 연간 급여현황 - 조회 (getMonth) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay2090/getList.do | inputCols=SCH_YM_FRM,SCH_YM_TO,SCH_SAL_ITM_CD,SCH_SAL_ITM_NM,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM
  test.skip('[no:2] 수당별 연간 급여현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('원천징수이행상황신고서 (pay_2110M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2110M' OR MNU_NM LIKE '원천징수이행상황신고서%'
  const MENU_ID = 'TODO_pay_2110M';
  const API_URL = '/mis/pay/pay4100/getCorp.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YYMM', 'SCH_CORP_CD', 'SCH_STD_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay4100/getCorp.do | inputCols=SCH_YYMM,SCH_CORP_CD,SCH_STD_DT
  test.skip('[no:1] 원천징수이행상황신고서 - 조회 (getCorp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay4100/getDataBf.do | inputCols=SCH_YYMM,SCH_CORP_CD,SCH_STD_DT
  test.skip('[no:2] 원천징수이행상황신고서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay4100/getData.do | inputCols=SCH_YYMM,SCH_CORP_CD,SCH_STD_DT
  test.skip('[no:3] 원천징수이행상황신고서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('급여전월비교조회 (pay_2120M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2120M' OR MNU_NM LIKE '급여전월비교조회%'
  const MENU_ID = 'TODO_pay_2120M';
  const API_URL = '/mis/pay/pay2120/getSalItmCd.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BASC_YM', 'CMP_YM', 'SCH_PMT_FG', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_JSFC_CD', 'SCH_SAL_ITM_CD', 'SCH_SAL_ITM_FG', 'SCH_AMT_YN', 'SCH_JSFC_CD1', 'SCH_JSFC_CD2', 'SCH_JSFC_CD3', 'SCH_JSFC_CD4', 'SCH_EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay2120/getSalItmCd.do | inputCols=BASC_YM,CMP_YM,SCH_PMT_FG,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_JSFC_CD,SCH_SAL_ITM_CD,SCH_SAL_ITM_FG,SCH_AMT_YN,SCH_JSFC_CD1,SCH_JSFC_CD2,SCH_JSFC_CD3,SCH_JSFC_CD4,SCH_EMPO_STLF_CD
  test.skip('[no:1] 급여전월비교조회 - 조회 (getSalItmCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('급여항목집계표 (pay_2130M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2130M' OR MNU_NM LIKE '급여항목집계표%'
  const MENU_ID = 'TODO_pay_2130M';
  const API_URL = '/mis/pay/pay2130/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_PMT_SEQ', 'SCH_JSFC_CD', 'SCH_GRD_CD', 'SCH_HLDF_FG_CD', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_SAL_ITM_FG', 'SCH_EMPO_STLF_CD', 'SCH_PMT_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay2130/getData.do | inputCols=SCH_YY,SCH_PMT_SEQ,SCH_JSFC_CD,SCH_GRD_CD,SCH_HLDF_FG_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_SAL_ITM_FG,SCH_EMPO_STLF_CD,SCH_PMT_FG
  test.skip('[no:1] 급여항목집계표 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('원천징수현황집계표 (pay_2140M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2140M' OR MNU_NM LIKE '원천징수현황집계표%'
  const MENU_ID = 'TODO_pay_2140M';
  const API_URL = '/mis/pay/pay2140/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_PMT_SEQ', 'SCH_JSFC_CD', 'SCH_GRD_CD', 'SCH_HLDF_FG_CD', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay2140/getData.do | inputCols=SCH_YY,SCH_PMT_SEQ,SCH_JSFC_CD,SCH_GRD_CD,SCH_HLDF_FG_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMPO_STLF_CD
  test.skip('[no:1] 원천징수현황집계표 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay2140/getDataDtl.do | inputCols=SCH_YY,SCH_PMT_SEQ,SCH_JSFC_CD,SCH_GRD_CD,SCH_HLDF_FG_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMPO_STLF_CD
  test.skip('[no:2] 원천징수현황집계표 - 조회 (getDataDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사회보험현황집계표 (pay_2150M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2150M' OR MNU_NM LIKE '사회보험현황집계표%'
  const MENU_ID = 'TODO_pay_2150M';
  const API_URL = '/mis/pay/pay2150/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_PMT_SEQ', 'SCH_JSFC_CD', 'SCH_GRD_CD', 'SCH_HLDF_FG_CD', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay2150/getData.do | inputCols=SCH_YY,SCH_PMT_SEQ,SCH_JSFC_CD,SCH_GRD_CD,SCH_HLDF_FG_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMPO_STLF_CD
  test.skip('[no:1] 사회보험현황집계표 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay2150/getDataDtl.do | inputCols=SCH_YY,SCH_PMT_SEQ,SCH_JSFC_CD,SCH_GRD_CD,SCH_HLDF_FG_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMPO_STLF_CD
  test.skip('[no:2] 사회보험현황집계표 - 조회 (getDataDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('월별개인급여집계표 (pay_2160M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2160M' OR MNU_NM LIKE '월별개인급여집계표%'
  const MENU_ID = 'TODO_pay_2160M';
  const API_URL = '/mis/pay/pay2160/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_PMT_SEQ', 'SCH_JSFC_CD', 'SCH_GRD_CD', 'SCH_HLDF_FG_CD', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay2160/getData.do | inputCols=SCH_YY,SCH_PMT_SEQ,SCH_JSFC_CD,SCH_GRD_CD,SCH_HLDF_FG_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMPO_STLF_CD
  test.skip('[no:1] 월별개인급여집계표 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay2160/getDataDtl.do | inputCols=SCH_YY,SCH_PMT_SEQ,SCH_JSFC_CD,SCH_GRD_CD,SCH_HLDF_FG_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMPO_STLF_CD
  test.skip('[no:2] 월별개인급여집계표 - 조회 (getDataDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연별개인급여집계표 (pay_2170M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2170M' OR MNU_NM LIKE '연별개인급여집계표%'
  const MENU_ID = 'TODO_pay_2170M';
  const API_URL = '/mis/pay/pay2170/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_PMT_SEQ', 'SCH_JSFC_CD', 'SCH_GRD_CD', 'SCH_HLDF_FG_CD', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay2170/getData.do | inputCols=SCH_YY,SCH_PMT_SEQ,SCH_JSFC_CD,SCH_GRD_CD,SCH_HLDF_FG_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMPO_STLF_CD
  test.skip('[no:1] 연별개인급여집계표 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('원천징수부출력 (pay_2180M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2180M' OR MNU_NM LIKE '원천징수부출력%'
  const MENU_ID = 'TODO_pay_2180M';
  const API_URL = '/mis/pay/pay2180/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EMPO_STLF_CD', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_HLDF_FG_CD', 'SCH_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay2180/getData.do | inputCols=SCH_EMPO_STLF_CD,SCH_EMP_NM,SCH_EMP_NO,SCH_DEPT_CD,SCH_DEPT_NM,SCH_HLDF_FG_CD,SCH_YY
  test.skip('[no:1] 원천징수부출력 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay2180/setAiData.do | inputCols=SCH_EMPO_STLF_CD,SCH_EMP_NM,SCH_EMP_NO,SCH_DEPT_CD,SCH_DEPT_NM,SCH_HLDF_FG_CD,SCH_YY
  test.skip('[no:2] 원천징수부출력 - 저장 (setAiData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('근로소득지급명세서 (pay_2190M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2190M' OR MNU_NM LIKE '근로소득지급명세서%'
  const MENU_ID = 'TODO_pay_2190M';
  const API_URL = '/mis/hrm/hrm2190/getCorp.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_RPT_CLS', 'SCH_YYMM', 'MM', 'FILE_NAME'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2190/getCorp.do | inputCols=SCH_YY,SCH_RPT_CLS,SCH_YYMM,MM,FILE_NAME
  test.skip('[no:1] 근로소득지급명세서 - 조회 (getCorp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2190/getData.do | inputCols=SCH_YY,SCH_RPT_CLS,SCH_YYMM,MM,FILE_NAME
  test.skip('[no:2] 근로소득지급명세서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2190/getFileName.do | inputCols=SCH_YY,SCH_RPT_CLS,SCH_YYMM,MM,FILE_NAME
  test.skip('[no:3] 근로소득지급명세서 - 조회 (getFileName) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2190/setCreateAttach.do | inputCols=SCH_YY,SCH_RPT_CLS,SCH_YYMM,MM,FILE_NAME
  test.skip('[no:4] 근로소득지급명세서 - 저장 (createFile) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인건비명세서 (pay_2200M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_2200M' OR MNU_NM LIKE '인건비명세서%'
  const MENU_ID = 'TODO_pay_2200M';
  const API_URL = '/mis/pay/pay2200/getSalItmCd.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_PMT_SEQ', 'SCH_JSFC_CD', 'SCH_GRD_CD', 'SCH_HLDF_FG_CD', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay2200/getSalItmCd.do | inputCols=SCH_YY,SCH_PMT_SEQ,SCH_JSFC_CD,SCH_GRD_CD,SCH_HLDF_FG_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMPO_STLF_CD
  test.skip('[no:1] 인건비명세서 - 조회 (getSalItmCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지급기준설정관리 (pay_3010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_3010M' OR MNU_NM LIKE '지급기준설정관리%'
  const MENU_ID = 'TODO_pay_3010M';
  const API_URL = '/mis/pay/pay3010/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_PMT_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay3010/getList.do | inputCols=SCH_YY,SCH_PMT_FG
  test.skip('[no:1] 지급기준설정관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay3010/getCalcFg.do | inputCols=SCH_YY,SCH_PMT_FG
  test.skip('[no:2] 지급기준설정관리 - 조회 (getCalcFg) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay3010/setData.do | inputCols=SCH_YY,SCH_PMT_FG
  test.skip('[no:3] 지급기준설정관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지급대상자관리 (pay_3020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_3020M' OR MNU_NM LIKE '지급대상자관리%'
  const MENU_ID = 'TODO_pay_3020M';
  const API_URL = '/mis/pay/pay3020/getPmtInfo.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YM', 'SCH_PMT_SEQ', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_WORK_DGCNT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay3020/getPmtInfo.do | inputCols=SCH_YM,SCH_PMT_SEQ,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT
  test.skip('[no:1] 지급대상자관리 - 조회 (getPmtInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay3020/getData.do | inputCols=SCH_YM,SCH_PMT_SEQ,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT
  test.skip('[no:2] 지급대상자관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay3020/setData.do | inputCols=SCH_YM,SCH_PMT_SEQ,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT
  test.skip('[no:3] 지급대상자관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay3020/setGenerate.do | inputCols=SCH_YM,SCH_PMT_SEQ,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT
  test.skip('[no:4] 지급대상자관리 - 저장 (setGenerate) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay3020/delDeleteAll.do | inputCols=SCH_YM,SCH_PMT_SEQ,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT
  test.skip('[no:5] 지급대상자관리 - 삭제 (delDeleteAll) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay3020/setExcelUpload.do | inputCols=SCH_YM,SCH_PMT_SEQ,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT
  test.skip('[no:6] 지급대상자관리 - 저장 (setExcelUpload) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지급액계산 (pay_3030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_3030M' OR MNU_NM LIKE '지급액계산%'
  const MENU_ID = 'TODO_pay_3030M';
  const API_URL = '/mis/pay/pay3030/getPmtInfo.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_PMT_YM', 'SCH_PMT_SEQ', 'SCH_PMT_FG', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_WORK_DGCNT', 'SCH_CAL', 'SCH_BUSI', 'SCH_PMT_DCSN_YN', 'SCH_PMT_NOTI_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay3030/getPmtInfo.do | inputCols=SCH_PMT_YM,SCH_PMT_SEQ,SCH_PMT_FG,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_CAL,SCH_BUSI,SCH_PMT_DCSN_YN,SCH_PMT_NOTI_YN
  test.skip('[no:1] 지급액계산 - 조회 (getPmtInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay3030/getPayItm.do | inputCols=SCH_PMT_YM,SCH_PMT_SEQ,SCH_PMT_FG,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_CAL,SCH_BUSI,SCH_PMT_DCSN_YN,SCH_PMT_NOTI_YN
  test.skip('[no:2] 지급액계산 - 조회 (getPayItm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay3030/getList.do | inputCols=SCH_PMT_YM,SCH_PMT_SEQ,SCH_PMT_FG,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_CAL,SCH_BUSI,SCH_PMT_DCSN_YN,SCH_PMT_NOTI_YN
  test.skip('[no:3] 지급액계산 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay3030/getPmtItmAmt.do | inputCols=SCH_PMT_YM,SCH_PMT_SEQ,SCH_PMT_FG,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_CAL,SCH_BUSI,SCH_PMT_DCSN_YN,SCH_PMT_NOTI_YN
  test.skip('[no:4] 지급액계산 - 조회 (getPayItmAmt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay3030/getFixVarAmt.do | inputCols=SCH_PMT_YM,SCH_PMT_SEQ,SCH_PMT_FG,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_CAL,SCH_BUSI,SCH_PMT_DCSN_YN,SCH_PMT_NOTI_YN
  test.skip('[no:5] 지급액계산 - 조회 (getFixVarAmt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay3030/setCalc.do | inputCols=SCH_PMT_YM,SCH_PMT_SEQ,SCH_PMT_FG,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_CAL,SCH_BUSI,SCH_PMT_DCSN_YN,SCH_PMT_NOTI_YN
  test.skip('[no:6] 지급액계산 - 저장 (setCalc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('급여확정 (pay_3040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_3040M' OR MNU_NM LIKE '급여확정%'
  const MENU_ID = 'TODO_pay_3040M';
  const API_URL = '/mis/pay/pay3040/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay3040/getList.do | inputCols=SCH_YM
  test.skip('[no:1] 급여확정 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay3040/setData.do | inputCols=SCH_YM
  test.skip('[no:2] 급여확정 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('급여분개기준관리 (pay_4010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_4010M' OR MNU_NM LIKE '급여분개기준관리%'
  const MENU_ID = 'TODO_pay_4010M';
  const API_URL = '/mis/pay/pay4010/getAggItmCd.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SAL_JNLZ_FG', 'SCH_AGG_ITM_CD', 'SCH_DAR_FG', 'SCH_JNLZ_MTOD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay4010/getAggItmCd.do | inputCols=SCH_SAL_JNLZ_FG,SCH_AGG_ITM_CD,SCH_DAR_FG,SCH_JNLZ_MTOD
  test.skip('[no:1] 급여분개기준관리 - 조회 (getAggItmCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay4010/getAggMstDtl.do | inputCols=SCH_SAL_JNLZ_FG,SCH_AGG_ITM_CD,SCH_DAR_FG,SCH_JNLZ_MTOD
  test.skip('[no:2] 급여분개기준관리 - 조회 (getAggMstDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay4010/setAggItm.do | inputCols=SCH_SAL_JNLZ_FG,SCH_AGG_ITM_CD,SCH_DAR_FG,SCH_JNLZ_MTOD
  test.skip('[no:3] 급여분개기준관리 - 저장 (setAggItm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('분개기준 예산변경 (pay_4011M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_4011M' OR MNU_NM LIKE '분개기준 예산변경%'
  const MENU_ID = 'TODO_pay_4011M';
  const API_URL = '/mis/pay/pay4010/searchPopBudgList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['JNLZ_STD_CD', 'JNLZ_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay4010/searchPopBudgList.do | inputCols=JNLZ_STD_CD,JNLZ_CLS
  test.skip('[no:1] 분개기준 예산변경 - 조회 (searchPopBudgList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay4010/setSavePop.do | inputCols=JNLZ_STD_CD,JNLZ_CLS
  test.skip('[no:2] 분개기준 예산변경 - 저장 (setSavePop) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('분개항목관리 (pay_4100M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_4100M' OR MNU_NM LIKE '분개항목관리%'
  const MENU_ID = 'TODO_pay_4100M';
  const API_URL = '/mis/pay/pay4100/getJnlzItmList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['USE_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay4100/getJnlzItmList.do | inputCols=USE_YN
  test.skip('[no:1] 분개항목관리 - 조회 (getJnlzItmList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay4100/getDtlList.do | inputCols=USE_YN
  test.skip('[no:2] 분개항목관리 - 조회 (getDtlList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay4100/setSaveJnlzMst.do | inputCols=USE_YN
  test.skip('[no:3] 분개항목관리 - 저장 (setSaveJnlzMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe(' 분개대상직제그룹관리 (pay_4105M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_4105M' OR MNU_NM LIKE ' 분개대상직제그룹관리%'
  const MENU_ID = 'TODO_pay_4105M';
  const API_URL = '/mis/pay/pay4105/getOrgGrpNmList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['USE_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay4105/getOrgGrpNmList.do | inputCols=USE_YN
  test.skip('[no:1]  분개대상직제그룹관리 - 조회 (getOrgGrpNmList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay4105/getDtlList.do | inputCols=USE_YN
  test.skip('[no:2]  분개대상직제그룹관리 - 조회 (getDtlList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay4105/setSaveOrgGrp.do | inputCols=USE_YN
  test.skip('[no:3]  분개대상직제그룹관리 - 저장 (setSaveOrgGrp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('분개기준관리 (pay_4110M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_4110M' OR MNU_NM LIKE '분개기준관리%'
  const MENU_ID = 'TODO_pay_4110M';
  const API_URL = '/mis/pay/pay4110/getLastAppYm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['APLY_YM', 'JNLZ_FG_CD', 'PAY_CLS', 'BUSI_CLS', 'EMP_CLS', 'GRD_CD', 'SAL_GRD', 'JOB_CLS', 'DR_CR', 'JNLZ_ITM_CD', 'SMRY', 'ORG_GRP_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay4110/getLastAppYm.do | inputCols=APLY_YM,JNLZ_FG_CD,PAY_CLS,BUSI_CLS,EMP_CLS,GRD_CD,SAL_GRD,JOB_CLS,DR_CR,JNLZ_ITM_CD,SMRY,ORG_GRP_CD
  test.skip('[no:1] 분개기준관리 - 조회 (getLastAppYm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay4110/getOnloadDs.do | inputCols=APLY_YM,JNLZ_FG_CD,PAY_CLS,BUSI_CLS,EMP_CLS,GRD_CD,SAL_GRD,JOB_CLS,DR_CR,JNLZ_ITM_CD,SMRY,ORG_GRP_CD
  test.skip('[no:2] 분개기준관리 - 조회 (getOnloadDs) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay4110/getList.do | inputCols=APLY_YM,JNLZ_FG_CD,PAY_CLS,BUSI_CLS,EMP_CLS,GRD_CD,SAL_GRD,JOB_CLS,DR_CR,JNLZ_ITM_CD,SMRY,ORG_GRP_CD
  test.skip('[no:3] 분개기준관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay4110/getNewList.do | inputCols=APLY_YM,JNLZ_FG_CD,PAY_CLS,BUSI_CLS,EMP_CLS,GRD_CD,SAL_GRD,JOB_CLS,DR_CR,JNLZ_ITM_CD,SMRY,ORG_GRP_CD
  test.skip('[no:4] 분개기준관리 - 조회 (getNewList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay4110/setJnlzStd.do | inputCols=APLY_YM,JNLZ_FG_CD,PAY_CLS,BUSI_CLS,EMP_CLS,GRD_CD,SAL_GRD,JOB_CLS,DR_CR,JNLZ_ITM_CD,SMRY,ORG_GRP_CD
  test.skip('[no:5] 분개기준관리 - 저장 (setJnlzStd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay4110/setCopy.do | inputCols=APLY_YM,JNLZ_FG_CD,PAY_CLS,BUSI_CLS,EMP_CLS,GRD_CD,SAL_GRD,JOB_CLS,DR_CR,JNLZ_ITM_CD,SMRY,ORG_GRP_CD
  test.skip('[no:6] 분개기준관리 - 저장 (setCopy) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay4110/getHis.do | inputCols=APLY_YM,JNLZ_FG_CD,PAY_CLS,BUSI_CLS,EMP_CLS,GRD_CD,SAL_GRD,JOB_CLS,DR_CR,JNLZ_ITM_CD,SMRY,ORG_GRP_CD
  test.skip('[no:7] 분개기준관리 - 조회 (getHis) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('예외분개기준 (pay_4130M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_4130M' OR MNU_NM LIKE '예외분개기준%'
  const MENU_ID = 'TODO_pay_4130M';
  const API_URL = '/mis/pay/pay4130/getEmpList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_APLY_YM', 'SCH_JNLZ_FG_CD', 'SCH_WORK_DGCNT', 'SCH_EMP_NO', 'SCH_EMP_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay4130/getEmpList.do | inputCols=SCH_APLY_YM,SCH_JNLZ_FG_CD,SCH_WORK_DGCNT,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:1] 예외분개기준 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay4130/getOrginJnlz.do | inputCols=SCH_APLY_YM,SCH_JNLZ_FG_CD,SCH_WORK_DGCNT,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:2] 예외분개기준 - 조회 (getOrginJnlz) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay4130/setEmpList.do | inputCols=SCH_APLY_YM,SCH_JNLZ_FG_CD,SCH_WORK_DGCNT,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:3] 예외분개기준 - 저장 (setEmpList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay4130/getExcptDtl.do | inputCols=SCH_APLY_YM,SCH_JNLZ_FG_CD,SCH_WORK_DGCNT,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:4] 예외분개기준 - 조회 (getExcptDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay4130/uptEmpList.do | inputCols=SCH_APLY_YM,SCH_JNLZ_FG_CD,SCH_WORK_DGCNT,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:5] 예외분개기준 - 조회 (uptEmpList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay4130/delData.do | inputCols=SCH_APLY_YM,SCH_JNLZ_FG_CD,SCH_WORK_DGCNT,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:6] 예외분개기준 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('급여지급결의서 목록 (pay_4150M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_4150M' OR MNU_NM LIKE '급여지급결의서 목록%'
  const MENU_ID = 'TODO_pay_4150M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'SLIP_TP', 'RQST_NO', 'FNRS_FG', 'SBJ', 'ACCP_YN', 'SCH_PGM', 'RESL_TP'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,SLIP_TP,RQST_NO,FNRS_FG,SBJ,ACCP_YN,SCH_PGM,RESL_TP
  test.skip('[no:1] 급여지급결의서 목록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay4150/getData.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,SLIP_TP,RQST_NO,FNRS_FG,SBJ,ACCP_YN,SCH_PGM,RESL_TP
  test.skip('[no:2] 급여지급결의서 목록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('급여지급결의서 등록 (pay_4151M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_4151M' OR MNU_NM LIKE '급여지급결의서 등록%'
  const MENU_ID = 'TODO_pay_4151M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RESL_DT', 'RESL_NO', 'RESL_DT_NO', 'ACT_UNIT_CD', 'PAY_RESL_RQST_NO', 'RESL_TP', 'RESL_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=RESL_DT,RESL_NO,RESL_DT_NO,ACT_UNIT_CD,PAY_RESL_RQST_NO,RESL_TP,RESL_FG
  test.skip('[no:1] 급여지급결의서 등록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay4151/setData.do | inputCols=RESL_DT,RESL_NO,RESL_DT_NO,ACT_UNIT_CD,PAY_RESL_RQST_NO,RESL_TP,RESL_FG
  test.skip('[no:2] 급여지급결의서 등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay4151/delData.do | inputCols=RESL_DT,RESL_NO,RESL_DT_NO,ACT_UNIT_CD,PAY_RESL_RQST_NO,RESL_TP,RESL_FG
  test.skip('[no:3] 급여지급결의서 등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay4120/getPaySlipDtl.do | inputCols=RESL_DT,RESL_NO,RESL_DT_NO,ACT_UNIT_CD,PAY_RESL_RQST_NO,RESL_TP,RESL_FG
  test.skip('[no:4] 급여지급결의서 등록 - 조회 (getPaySlipDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('근속연수공제관리 (pay_5010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5010M' OR MNU_NM LIKE '근속연수공제관리%'
  const MENU_ID = 'TODO_pay_5010M';
  const API_URL = '/mis/pay/pay5010/getMaxYymm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_APP_YM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay5010/getMaxYymm.do | inputCols=SCH_APP_YM
  test.skip('[no:1] 근속연수공제관리 - 조회 (getMaxYymm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay5010/getData.do | inputCols=SCH_APP_YM
  test.skip('[no:2] 근속연수공제관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5010/setData.do | inputCols=SCH_APP_YM
  test.skip('[no:3] 근속연수공제관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay5010/newData.do | inputCols=SCH_APP_YM
  test.skip('[no:4] 근속연수공제관리 - 조회 (newData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직금계산 (pay_5020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5020M' OR MNU_NM LIKE '퇴직금계산%'
  const MENU_ID = 'TODO_pay_5020M';
  const API_URL = '/mis/pay/pay5020/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YYMM', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DUTY_DEG', 'SCH_EMP_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay5020/getData.do | inputCols=SCH_YYMM,SCH_EMP_NM,SCH_EMP_NO,SCH_DUTY_DEG,SCH_EMP_CLS
  test.skip('[no:1] 퇴직금계산 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay5020/getEmpData.do | inputCols=SCH_YYMM,SCH_EMP_NM,SCH_EMP_NO,SCH_DUTY_DEG,SCH_EMP_CLS
  test.skip('[no:2] 퇴직금계산 - 조회 (getEmpData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5020/setRsignCalc.do | inputCols=SCH_YYMM,SCH_EMP_NM,SCH_EMP_NO,SCH_DUTY_DEG,SCH_EMP_CLS
  test.skip('[no:3] 퇴직금계산 - 저장 (setRsignCalc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5020/setRsignTaxCalc.do | inputCols=SCH_YYMM,SCH_EMP_NM,SCH_EMP_NO,SCH_DUTY_DEG,SCH_EMP_CLS
  test.skip('[no:4] 퇴직금계산 - 저장 (setRsignTaxCalc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('정산내역조회 (pay_5021M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5021M' OR MNU_NM LIKE '정산내역조회%'
  const MENU_ID = 'TODO_pay_5021M';
  const API_URL = '/mis/pay/pay5021/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['EMP_NO', 'DUTY_DEG', 'ISSUE_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay5021/getData.do | inputCols=EMP_NO,DUTY_DEG,ISSUE_DT
  test.skip('[no:1] 정산내역조회 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5021/setData.do | inputCols=EMP_NO,DUTY_DEG,ISSUE_DT
  test.skip('[no:2] 정산내역조회 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay5021/delData.do | inputCols=EMP_NO,DUTY_DEG,ISSUE_DT
  test.skip('[no:3] 정산내역조회 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5021/setConfirm.do | inputCols=EMP_NO,DUTY_DEG,ISSUE_DT
  test.skip('[no:4] 정산내역조회 - 저장 (setConfirm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5020/setRsignTaxCalc.do | inputCols=EMP_NO,DUTY_DEG,ISSUE_DT
  test.skip('[no:5] 정산내역조회 - 저장 (setRsignTaxCalc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직금현황 (pay_5030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5030M' OR MNU_NM LIKE '퇴직금현황%'
  const MENU_ID = 'TODO_pay_5030M';
  const API_URL = '/mis/pay/pay5030/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RSIGN_CLS', 'FRM_PMT_DT', 'TO_PMT_DT', 'FRM_DT', 'TO_DT', 'EMP_NO', 'EMP_NM', 'EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay5030/getData.do | inputCols=RSIGN_CLS,FRM_PMT_DT,TO_PMT_DT,FRM_DT,TO_DT,EMP_NO,EMP_NM,EMPO_STLF_CD
  test.skip('[no:1] 퇴직금현황 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직소득지급명세생성 (pay_5040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5040M' OR MNU_NM LIKE '퇴직소득지급명세생성%'
  const MENU_ID = 'TODO_pay_5040M';
  const API_URL = '/mis/pay/pay5040/getTaxMain.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['YY', 'SUBMIT_DT', 'TAX_ID', 'EMP_NM', 'DEPT_NM', 'TEL_NO', 'CLS', 'FILE_NAME', 'CORP_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay5040/getTaxMain.do | inputCols=YY,SUBMIT_DT,TAX_ID,EMP_NM,DEPT_NM,TEL_NO,CLS,FILE_NAME,CORP_CD
  test.skip('[no:1] 퇴직소득지급명세생성 - 조회 (getTaxMain) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay5040/getComCorpCd.do | inputCols=YY,SUBMIT_DT,TAX_ID,EMP_NM,DEPT_NM,TEL_NO,CLS,FILE_NAME,CORP_CD
  test.skip('[no:2] 퇴직소득지급명세생성 - 조회 (getComCorpCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay5040/getRsignFileNm.do | inputCols=YY,SUBMIT_DT,TAX_ID,EMP_NM,DEPT_NM,TEL_NO,CLS,FILE_NAME,CORP_CD
  test.skip('[no:3] 퇴직소득지급명세생성 - 조회 (getRsignFileNm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5040/createRsignFile.do | inputCols=YY,SUBMIT_DT,TAX_ID,EMP_NM,DEPT_NM,TEL_NO,CLS,FILE_NAME,CORP_CD
  test.skip('[no:4] 퇴직소득지급명세생성 - 저장 (createRsignFile) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직급여충당금계산 (pay_5050M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5050M' OR MNU_NM LIKE '퇴직급여충당금계산%'
  const MENU_ID = 'TODO_pay_5050M';
  const API_URL = '/mis/pay/pay5050/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_CALC_YYMM', 'SCH_WORK_DGCNT', 'SCH_EMPO_STLF_CD', 'SCH_EXCC_FRM_DT', 'SCH_EXCC_TO_DT', 'RP_JOIN_YN', 'DSMN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay5050/getData.do | inputCols=SCH_YY,SCH_EMP_NM,SCH_EMP_NO,SCH_DEPT_CD,SCH_DEPT_NM,SCH_CALC_YYMM,SCH_WORK_DGCNT,SCH_EMPO_STLF_CD,SCH_EXCC_FRM_DT,SCH_EXCC_TO_DT,RP_JOIN_YN,DSMN
  test.skip('[no:1] 퇴직급여충당금계산 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay5050/getData2.do | inputCols=SCH_YY,SCH_EMP_NM,SCH_EMP_NO,SCH_DEPT_CD,SCH_DEPT_NM,SCH_CALC_YYMM,SCH_WORK_DGCNT,SCH_EMPO_STLF_CD,SCH_EXCC_FRM_DT,SCH_EXCC_TO_DT,RP_JOIN_YN,DSMN
  test.skip('[no:2] 퇴직급여충당금계산 - 조회 (getData2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5050/setClose.do | inputCols=SCH_YY,SCH_EMP_NM,SCH_EMP_NO,SCH_DEPT_CD,SCH_DEPT_NM,SCH_CALC_YYMM,SCH_WORK_DGCNT,SCH_EMPO_STLF_CD,SCH_EXCC_FRM_DT,SCH_EXCC_TO_DT,RP_JOIN_YN,DSMN
  test.skip('[no:3] 퇴직급여충당금계산 - 저장 (setClose) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5050/setData.do | inputCols=SCH_YY,SCH_EMP_NM,SCH_EMP_NO,SCH_DEPT_CD,SCH_DEPT_NM,SCH_CALC_YYMM,SCH_WORK_DGCNT,SCH_EMPO_STLF_CD,SCH_EXCC_FRM_DT,SCH_EXCC_TO_DT,RP_JOIN_YN,DSMN
  test.skip('[no:4] 퇴직급여충당금계산 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5050/setRsignCalc.do | inputCols=SCH_YY,SCH_EMP_NM,SCH_EMP_NO,SCH_DEPT_CD,SCH_DEPT_NM,SCH_CALC_YYMM,SCH_WORK_DGCNT,SCH_EMPO_STLF_CD,SCH_EXCC_FRM_DT,SCH_EXCC_TO_DT,RP_JOIN_YN,DSMN
  test.skip('[no:5] 퇴직급여충당금계산 - 저장 (setRsignCalc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직연금가입자관리 (pay_5060M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5060M' OR MNU_NM LIKE '퇴직연금가입자관리%'
  const MENU_ID = 'TODO_pay_5060M';
  const API_URL = '/mis/pay/pay5060/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_WORK_DGCNT', 'SCH_HLDF_FG_CD', 'SCH_JOIN_YN', 'SCH_RP_FG_CD', 'SCH_RP_JOIN_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay5060/getData.do | inputCols=SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_HLDF_FG_CD,SCH_JOIN_YN,SCH_RP_FG_CD,SCH_RP_JOIN_FG_CD
  test.skip('[no:1] 퇴직연금가입자관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay5060/getDataDtl.do | inputCols=SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_HLDF_FG_CD,SCH_JOIN_YN,SCH_RP_FG_CD,SCH_RP_JOIN_FG_CD
  test.skip('[no:2] 퇴직연금가입자관리 - 조회 (getDataDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5060/setData.do | inputCols=SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_HLDF_FG_CD,SCH_JOIN_YN,SCH_RP_FG_CD,SCH_RP_JOIN_FG_CD
  test.skip('[no:3] 퇴직연금가입자관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay5060/delData.do | inputCols=SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_HLDF_FG_CD,SCH_JOIN_YN,SCH_RP_FG_CD,SCH_RP_JOIN_FG_CD
  test.skip('[no:4] 퇴직연금가입자관리 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직급여충당금현황 (pay_5070M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5070M' OR MNU_NM LIKE '퇴직급여충당금현황%'
  const MENU_ID = 'TODO_pay_5070M';
  const API_URL = '/mis/pay/pay3030/getPmtInfo.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_PMT_YM', 'SCH_PMT_SEQ', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_WORK_DGCNT', 'SCH_RP_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay3030/getPmtInfo.do | inputCols=SCH_PMT_YM,SCH_PMT_SEQ,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_RP_FG_CD
  test.skip('[no:1] 퇴직급여충당금현황 - 조회 (getPmtInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay5070/getData.do | inputCols=SCH_PMT_YM,SCH_PMT_SEQ,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_RP_FG_CD
  test.skip('[no:2] 퇴직급여충당금현황 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직금예상액조회 (pay_5080M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5080M' OR MNU_NM LIKE '퇴직금예상액조회%'
  const MENU_ID = 'TODO_pay_5080M';
  const API_URL = '/mis/pay/pay5080/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DUTY_DEG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay5080/getData.do | inputCols=SCH_STDR_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DUTY_DEG
  test.skip('[no:1] 퇴직금예상액조회 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5080/setData.do | inputCols=SCH_STDR_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DUTY_DEG
  test.skip('[no:2] 퇴직금예상액조회 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5080/setCalc.do | inputCols=SCH_STDR_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DUTY_DEG
  test.skip('[no:3] 퇴직금예상액조회 - 저장 (setCalc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직금예상액조회 (pay_5090M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5090M' OR MNU_NM LIKE '퇴직금예상액조회%'
  const MENU_ID = 'TODO_pay_5090M';
  const API_URL = '/mis/pay/pay5090/getEmpInfo.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DUTY_DEG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay5090/getEmpInfo.do | inputCols=SCH_STDR_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DUTY_DEG
  test.skip('[no:1] 퇴직금예상액조회 - 조회 (getEmpInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay5090/getData.do | inputCols=SCH_STDR_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DUTY_DEG
  test.skip('[no:2] 퇴직금예상액조회 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5090/setCalc.do | inputCols=SCH_STDR_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DUTY_DEG
  test.skip('[no:3] 퇴직금예상액조회 - 저장 (setCalc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('소급기준관리 (pay_5510M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5510M' OR MNU_NM LIKE '소급기준관리%'
  const MENU_ID = 'TODO_pay_5510M';
  const API_URL = '/mis/pay/pay5510/getRtctNm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RTCT_YM', 'SCH_RTCT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay5510/getRtctNm.do | inputCols=SCH_RTCT_YM,SCH_RTCT_NM
  test.skip('[no:1] 소급기준관리 - 조회 (getRtctNm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay5510/getStdData.do | inputCols=SCH_RTCT_YM,SCH_RTCT_NM
  test.skip('[no:2] 소급기준관리 - 조회 (getStdData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5510/setData.do | inputCols=SCH_RTCT_YM,SCH_RTCT_NM
  test.skip('[no:3] 소급기준관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5510/setStdData.do | inputCols=SCH_RTCT_YM,SCH_RTCT_NM
  test.skip('[no:4] 소급기준관리 - 저장 (setStdData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay5510/delStdData.do | inputCols=SCH_RTCT_YM,SCH_RTCT_NM
  test.skip('[no:5] 소급기준관리 - 삭제 (delStdData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('소급액계산 (pay_5520M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5520M' OR MNU_NM LIKE '소급액계산%'
  const MENU_ID = 'TODO_pay_5520M';
  const API_URL = '/mis/pay/pay5510/getRtctNm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RTCT_YM', 'SCH_EMP_NO', 'SCH_WORK_DGCNT', 'SCH_EMP_NM', 'SCH_RTCT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay5510/getRtctNm.do | inputCols=SCH_RTCT_YM,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_RTCT_NM
  test.skip('[no:1] 소급액계산 - 조회 (getRtctNm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay5520/getTgpnList.do | inputCols=SCH_RTCT_YM,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_RTCT_NM
  test.skip('[no:2] 소급액계산 - 조회 (getTgpnList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay5520/getRtctList.do | inputCols=SCH_RTCT_YM,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_RTCT_NM
  test.skip('[no:3] 소급액계산 - 조회 (getRtctList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5520/setData.do | inputCols=SCH_RTCT_YM,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_RTCT_NM
  test.skip('[no:4] 소급액계산 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5520/setCalc.do | inputCols=SCH_RTCT_YM,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_RTCT_NM
  test.skip('[no:5] 소급액계산 - 저장 (setCalcData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5520/setConfirm.do | inputCols=SCH_RTCT_YM,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_RTCT_NM
  test.skip('[no:6] 소급액계산 - 저장 (setConfirm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('소급지급신청 (pay_5530M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5530M' OR MNU_NM LIKE '소급지급신청%'
  const MENU_ID = 'TODO_pay_5530M';
  const API_URL = '/mis/pay/pay5530/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay5530/getData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 소급지급신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('소급지급신청 (pay_5531M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5531M' OR MNU_NM LIKE '소급지급신청%'
  const MENU_ID = 'TODO_pay_5531M';
  const API_URL = '/mis/pay/pay5531/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay5531/getData.do | inputCols=
  test.skip('[no:1] 소급지급신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay5531/getTgpnList.do | inputCols=
  test.skip('[no:2] 소급지급신청 - 조회 (getTgpnList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay5531/setData.do | inputCols=
  test.skip('[no:3] 소급지급신청 - 저장 (setAppData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay5531/delData.do | inputCols=
  test.skip('[no:4] 소급지급신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('소급지급승인관리 (pay_5540M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5540M' OR MNU_NM LIKE '소급지급승인관리%'
  const MENU_ID = 'TODO_pay_5540M';
  const API_URL = '/mis/pay/pay5530/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay5530/getData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 소급지급승인관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay5530/uptStat.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_RQST_STAT_CD
  test.skip('[no:2] 소급지급승인관리 - 조회 (uptApprobation) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('급여계좌변경신청목록 (pay_6310M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6310M' OR MNU_NM LIKE '급여계좌변경신청목록%'
  const MENU_ID = 'TODO_pay_6310M';
  const API_URL = '/mis/pay/pay6310/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_SAL_ACC_FG', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay6310/getData.do | inputCols=SCH_FRM_DT,SCH_TO_DT,SCH_SAL_ACC_FG,SCH_EMP_NO,SCH_EMP_NM,SCH_STAT_CD
  test.skip('[no:1] 급여계좌변경신청목록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('급여계좌변경신청 (pay_6311M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6311M' OR MNU_NM LIKE '급여계좌변경신청%'
  const MENU_ID = 'TODO_pay_6311M';
  const API_URL = '/mis/pay/pay6311/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay6311/getData.do | inputCols=
  test.skip('[no:1] 급여계좌변경신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay6311/getAccNo.do | inputCols=
  test.skip('[no:2] 급여계좌변경신청 - 조회 (getAccNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay6311/setData.do | inputCols=
  test.skip('[no:3] 급여계좌변경신청 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1010/getVrifAccNo.do | inputCols=
  test.skip('[no:4] 급여계좌변경신청 - 조회 (getVrifAccNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getVrifAccNo.do | inputCols=
  test.skip('[no:5] 급여계좌변경신청 - 조회 (getVrifAccNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('원천징수동의신청목록 (pay_6410M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6410M' OR MNU_NM LIKE '원천징수동의신청목록%'
  const MENU_ID = 'TODO_pay_6410M';
  const API_URL = '/mis/pay/pay6410/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_FRM_DT', 'SCH_TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay6410/getList.do | inputCols=SCH_EMP_NO,SCH_EMP_NM,SCH_FRM_DT,SCH_TO_DT
  test.skip('[no:1] 원천징수동의신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('원천징수동의신청상세 (pay_6411M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6411M' OR MNU_NM LIKE '원천징수동의신청상세%'
  const MENU_ID = 'TODO_pay_6411M';
  const API_URL = '/mis/pay/pay6411/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay6411/getData.do | inputCols=
  test.skip('[no:1] 원천징수동의신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay6411/getExcelUpload.do | inputCols=
  test.skip('[no:2] 원천징수동의신청상세 - 조회 (getExcelUpload) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay6411/setData.do | inputCols=
  test.skip('[no:3] 원천징수동의신청상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay6411/delData.do | inputCols=
  test.skip('[no:4] 원천징수동의신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('원천징수동의서 (pay_6420M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6420M' OR MNU_NM LIKE '원천징수동의서%'
  const MENU_ID = 'TODO_pay_6420M';
  const API_URL = '/mis/pay/pay6420/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['WTHTX_RQST_NO', 'TGPN_EMP_NO', 'RQST_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay6420/getData.do | inputCols=WTHTX_RQST_NO,TGPN_EMP_NO,RQST_NO
  test.skip('[no:1] 원천징수동의서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay6420/setData.do | inputCols=WTHTX_RQST_NO,TGPN_EMP_NO,RQST_NO
  test.skip('[no:2] 원천징수동의서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직금중간정산신청 (pay_6510M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6510M' OR MNU_NM LIKE '퇴직금중간정산신청%'
  const MENU_ID = 'TODO_pay_6510M';
  const API_URL = '/mis/pay/pay6510/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_NO', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_STAT_CD', 'SCH_DEPT_NM', 'SCH_DEPT_CD', 'SIGN_STAT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay6510/getData.do | inputCols=SCH_RQST_NO,SCH_FRM_DT,SCH_TO_DT,SCH_EMP_NM,SCH_EMP_NO,SCH_STAT_CD,SCH_DEPT_NM,SCH_DEPT_CD,SIGN_STAT_NM
  test.skip('[no:1] 퇴직금중간정산신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직금중간정산상세 (pay_6511M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6511M' OR MNU_NM LIKE '퇴직금중간정산상세%'
  const MENU_ID = 'TODO_pay_6511M';
  const API_URL = '/mis/pay/pay6511/getEmpInfo.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay6511/getEmpInfo.do | inputCols=
  test.skip('[no:1] 퇴직금중간정산상세 - 조회 (getEmpInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay6511/getData.do | inputCols=
  test.skip('[no:2] 퇴직금중간정산상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay6511/setData.do | inputCols=
  test.skip('[no:3] 퇴직금중간정산상세 - 저장 (setSignData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay6511/delData.do | inputCols=
  test.skip('[no:4] 퇴직금중간정산상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1010/getVrifAccNo.do | inputCols=
  test.skip('[no:5] 퇴직금중간정산상세 - 조회 (getVrifAccNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getVrifAccNo.do | inputCols=
  test.skip('[no:6] 퇴직금중간정산상세 - 조회 (getVrifAccNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직금중간정산신청승인 (pay_6520M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6520M' OR MNU_NM LIKE '퇴직금중간정산신청승인%'
  const MENU_ID = 'TODO_pay_6520M';
  const API_URL = '/mis/pay/pay6520/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_NO', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_STAT_CD', 'SCH_DEPT_NM', 'SCH_DEPT_CD', 'SIGN_STAT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay6520/getData.do | inputCols=SCH_RQST_NO,SCH_FRM_DT,SCH_TO_DT,SCH_EMP_NM,SCH_EMP_NO,SCH_STAT_CD,SCH_DEPT_NM,SCH_DEPT_CD,SIGN_STAT_NM
  test.skip('[no:1] 퇴직금중간정산신청승인 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay6520/setData.do | inputCols=SCH_RQST_NO,SCH_FRM_DT,SCH_TO_DT,SCH_EMP_NM,SCH_EMP_NO,SCH_STAT_CD,SCH_DEPT_NM,SCH_DEPT_CD,SIGN_STAT_NM
  test.skip('[no:2] 퇴직금중간정산신청승인 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직금중간정산승인상세 (pay_6521M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6521M' OR MNU_NM LIKE '퇴직금중간정산승인상세%'
  const MENU_ID = 'TODO_pay_6521M';
  const API_URL = '/mis/pay/pay6521/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay6521/getData.do | inputCols=
  test.skip('[no:1] 퇴직금중간정산승인상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay6521/setData.do | inputCols=
  test.skip('[no:2] 퇴직금중간정산승인상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay6521/delData.do | inputCols=
  test.skip('[no:3] 퇴직금중간정산승인상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직연금신청/변경신청목록 (pay_6530M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6530M' OR MNU_NM LIKE '퇴직연금신청/변경신청목록%'
  const MENU_ID = 'TODO_pay_6530M';
  const API_URL = '/mis/pay/pay6530/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_NM', 'SCH_DEPT_CD', 'SCH_STAT_CD', 'SCH_RQST_NO', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_RQST_FG', 'SIGN_STAT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay6530/getData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_DEPT_NM,SCH_DEPT_CD,SCH_STAT_CD,SCH_RQST_NO,SCH_EMP_NM,SCH_EMP_NO,SCH_RQST_FG,SIGN_STAT_NM
  test.skip('[no:1] 퇴직연금신청/변경신청목록 - 조회 (getPayData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직연금신청상세 (pay_6531M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6531M' OR MNU_NM LIKE '퇴직연금신청상세%'
  const MENU_ID = 'TODO_pay_6531M';
  const API_URL = '/mis/pay/pay6531/getEmpInfo.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_NO', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'RQST_DT', 'RQST_FLOC_CD_NM', 'RQST_FLOC_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay6531/getEmpInfo.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:1] 퇴직연금신청상세 - 조회 (getEmpInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay6531/getData.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:2] 퇴직연금신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay6531/setData.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:3] 퇴직연금신청상세 - 저장 (setAppData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay6531/getRqstList.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:4] 퇴직연금신청상세 - 조회 (getRqstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay6531/delData.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:5] 퇴직연금신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay6531/setRqstEmpNo.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:6] 퇴직연금신청상세 - 저장 (setRqstEmpNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay6531/setApvInfo.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:7] 퇴직연금신청상세 - 저장 (setApvInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직연금개인부담금상세 (pay_6532M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6532M' OR MNU_NM LIKE '퇴직연금개인부담금상세%'
  const MENU_ID = 'TODO_pay_6532M';
  const API_URL = '/mis/pay/pay6532/getEmpInfo.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_NO', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'RQST_DT', 'RQST_FLOC_CD_NM', 'RQST_FLOC_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay6532/getEmpInfo.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:1] 퇴직연금개인부담금상세 - 조회 (getEmpInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay6532/getData.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:2] 퇴직연금개인부담금상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay6532/setData.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:3] 퇴직연금개인부담금상세 - 저장 (setAppData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pay/pay6532/delData.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:4] 퇴직연금개인부담금상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay6532/getRqstList.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:5] 퇴직연금개인부담금상세 - 조회 (getRqstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay6532/getRqstList2.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:6] 퇴직연금개인부담금상세 - 조회 (getRqstList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay6532/setRqstEmpNo.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:7] 퇴직연금개인부담금상세 - 저장 (setRqstEmpNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay6532/setApvInfo.do | inputCols=RQST_NO,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RQST_DT,RQST_FLOC_CD_NM,RQST_FLOC_CD
  test.skip('[no:8] 퇴직연금개인부담금상세 - 저장 (setApvInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직연금접수처리목록 (pay_6540M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6540M' OR MNU_NM LIKE '퇴직연금접수처리목록%'
  const MENU_ID = 'TODO_pay_6540M';
  const API_URL = '/mis/pay/pay6540/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_NM', 'SCH_DEPT_CD', 'SCH_STAT_CD', 'SCH_RQST_NO', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_RQST_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay6540/getData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_DEPT_NM,SCH_DEPT_CD,SCH_STAT_CD,SCH_RQST_NO,SCH_EMP_NM,SCH_EMP_NO,SCH_RQST_FG
  test.skip('[no:1] 퇴직연금접수처리목록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay6540/setData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_DEPT_NM,SCH_DEPT_CD,SCH_STAT_CD,SCH_RQST_NO,SCH_EMP_NM,SCH_EMP_NO,SCH_RQST_FG
  test.skip('[no:2] 퇴직연금접수처리목록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연말정산결과적용 (pay_7000M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_7000M' OR MNU_NM LIKE '연말정산결과적용%'
  const MENU_ID = 'TODO_pay_7000M';
  const API_URL = '/mis/pay/pay7000/getTgpnList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_EMP_NO', 'SCH_WORK_DGCNT', 'SCH_EMP_NM', 'SCH_STDR_YM', 'SCH_PMT_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pay/pay7000/getTgpnList.do | inputCols=SCH_YY,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_STDR_YM,SCH_PMT_CLS
  test.skip('[no:1] 연말정산결과적용 - 조회 (getTgpnList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pay/pay7000/getPmtList.do | inputCols=SCH_YY,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_STDR_YM,SCH_PMT_CLS
  test.skip('[no:2] 연말정산결과적용 - 조회 (getPmtList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay7000/setData.do | inputCols=SCH_YY,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_STDR_YM,SCH_PMT_CLS
  test.skip('[no:3] 연말정산결과적용 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay7000/setCalc.do | inputCols=SCH_YY,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_STDR_YM,SCH_PMT_CLS
  test.skip('[no:4] 연말정산결과적용 - 저장 (setCalcData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay7000/setCalcInstAmt.do | inputCols=SCH_YY,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_STDR_YM,SCH_PMT_CLS
  test.skip('[no:5] 연말정산결과적용 - 저장 (setCalcInstAmt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay7000/setInter.do | inputCols=SCH_YY,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_STDR_YM,SCH_PMT_CLS
  test.skip('[no:6] 연말정산결과적용 - 저장 (setInter) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pay/pay7000/setConfirm.do | inputCols=SCH_YY,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_STDR_YM,SCH_PMT_CLS
  test.skip('[no:7] 연말정산결과적용 - 저장 (setConfirm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});
