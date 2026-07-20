// ==============================================================
// GEN(총무관리) 모듈 배치 단위 테스트 — 생성일 2026-06-28
// 입력: _workspace/gen/01_scenarios.json (unit 470건 / integ 28건)
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


test.describe('휴무일관리 (gen_0010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0010M' OR MNU_NM LIKE '휴무일관리%'
  const MENU_ID = 'TODO_gen_0010M';
  const API_URL = '/mis/gen/gen0010/getHoliList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['YYMM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen0010/setCalcRplDay.do | inputCols=NUM,isChecked,tmHeader,DT,HDAY_NM,HDAY_DECI,PAY_HDAY_INCD_YN,CONT_HDAY_YN,HLDY_YN,RPL_HLDY_YN
  test.skip('[no:1] 휴무일관리 - 저장 (setCalcRplDay) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0010/setHoliData.do | inputCols=NUM,isChecked,tmHeader,DT,HDAY_NM,HDAY_DECI,PAY_HDAY_INCD_YN,CONT_HDAY_YN,HLDY_YN,RPL_HLDY_YN
  test.skip('[no:2] 휴무일관리 - 저장 (setHoliData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0010/getHoliList.do | inputCols=YYMM
  test.skip('[no:3] 휴무일관리 - 조회 (getHoliList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0010/getCalList.do | inputCols=YYMM
  test.skip('[no:4] 휴무일관리 - 조회 (getCalList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('휴가기준관리 (gen_0020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0020M' OR MNU_NM LIKE '휴가기준관리%'
  const MENU_ID = 'TODO_gen_0020M';
  const API_URL = '/mis/gen/gen0020/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_VCTN_FG', 'SCH_VCTN_FG_NM', 'SCH_SMRY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen0020/setData.do | inputCols=isChecked,tmHeader,VCTN_MNG_NO,VCTN_FG_CD,VCTN_FG_NM,VCTN_ACCT_CD,VCTN_USE_UNIT_FG,VCTN_MIN_USE_VAL,VCTN_MAX_USE_VAL,HDAY_EXCLUS_YN,PAID_VCTN_YN,PST_PROOF_SBMT_YN,RMK,SORT_NO,VCTN_STDR_USE_YN
  test.skip('[no:1] 휴가기준관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0020/getList.do | inputCols=SCH_VCTN_FG,SCH_VCTN_FG_NM,SCH_SMRY
  test.skip('[no:2] 휴가기준관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('휴가규정관리 (gen_0021M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0021M' OR MNU_NM LIKE '휴가규정관리%'
  const MENU_ID = 'TODO_gen_0021M';
  const API_URL = '/mis/gen/gen0021/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_VCTN_RGTN_FG_CD', 'SCH_VCTN_RGTN_NM', 'SCH_SMRY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen0021/setData.do | inputCols=isChecked,tmHeader,VCTN_RGTN_MNG_NO,VCTN_RGTN_CD,SEQ,VCTN_RGTN_FG_CD,VCTN_RGTN_NM,VCTN_POSL_USE_DAY,SMRY,VCTN_RGTN_USE_YN
  test.skip('[no:1] 휴가규정관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0021/getList.do | inputCols=SCH_VCTN_RGTN_FG_CD,SCH_VCTN_RGTN_NM,SCH_SMRY
  test.skip('[no:2] 휴가규정관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연차일수관리 (gen_0030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0030M' OR MNU_NM LIKE '연차일수관리%'
  const MENU_ID = 'TODO_gen_0030M';
  const API_URL = '/mis/gen/gen0030/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_STDR_DT', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_HLDF_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0030/getList.do | inputCols=SCH_YY,SCH_STDR_DT,SCH_FRM_DT,SCH_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_HLDF_FG_CD
  test.skip('[no:1] 연차일수관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0030/getMdatDays.do | inputCols=YY,EMP_NO,SCH_YY,SCH_FRM_DT,SCH_TO_DT,STDR_DT
  test.skip('[no:2] 연차일수관리 - 조회 (getMdatDays) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0030/setMdatDays.do | inputCols=YY,EMP_NO,SCH_YY,SCH_FRM_DT,SCH_TO_DT,STDR_DT
  test.skip('[no:3] 연차일수관리 - 저장 (setMdatDays) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('임신휴가발생관리 (gen_0040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0040M' OR MNU_NM LIKE '임신휴가발생관리%'
  const MENU_ID = 'TODO_gen_0040M';
  const API_URL = '/mis/gen/gen0040/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_STDR_DT', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_HLDF_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen0040/setData.do | inputCols=isChecked,tmHeader,VCTN_ACCT_CD,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,SEX_DIST_FG,VCTN_OCRNC_NO,VCTN_OCRNC_DT,USE_FRM_DT,USE_TO_DT,VCTN_OCRNC_DAYS,VCTN_OCRNC_TIME,VCTN_OCRNC_MIN,RMK
  test.skip('[no:1] 임신휴가발생관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0040/getList.do | inputCols=SCH_YY,SCH_STDR_DT,SCH_FRM_DT,SCH_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_HLDF_FG_CD
  test.skip('[no:2] 임신휴가발생관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('휴가신청 목록 (gen_0110M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0110M' OR MNU_NM LIKE '휴가신청 목록%'
  const MENU_ID = 'TODO_gen_0110M';
  const API_URL = '/mis/gen/gen0110/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_CLS', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_APV_STAT_CD', 'SCH_RQST_FG', 'SCH_VCTN_MNG_NO', 'CHK_VALID'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0110/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_CLS,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_APV_STAT_CD,SCH_RQST_FG,SCH_VCTN_MNG_NO,CHK_VALID
  test.skip('[no:1] 휴가신청 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0110/getVctnFgCdList.do | inputCols=-
  test.skip('[no:2] 휴가신청 목록 - 조회 (getVctnFgCdList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('휴가신청 (gen_0111M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0111M' OR MNU_NM LIKE '휴가신청%'
  const MENU_ID = 'TODO_gen_0111M';
  const API_URL = '/mis/gen/gen0111/setFileList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['tmHeader', 'RQST_NO', 'RQST_DT', 'RQST_FG', 'APV_STAT_CD', 'APV_STAT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'VCNR_EMP_NO', 'VCNR_EMP_NM', 'VCNR_DEPT_CD', 'VCNR_DEPT_NM', 'VCNR_GRD_CD', 'VCNR_GRD_NM', 'VCNR_SEX_DIST', 'VAUSP_EMP_NO', 'VAUSP_EMP_NM', 'VAUSP_DEPT_CD', 'VAUSP_DEPT_NM', 'VAUSP_GRD_CD', 'VAUSP_GRD_NM', 'VCTN_MNG_NO', 'VCTN_FG_CD', 'VCTN_FG_NM', 'VCTN_FG_CD_DTL', 'VCTN_ACCT_CD', 'VCTN_USE_UNIT_FG', 'VCTN_FRM_DT', 'VCTN_FRM_HM', 'VCTN_TO_DT', 'VCTN_TO_HM', 'VCTN_DAYS', 'VCTN_TIME', 'VCTN_MIN', 'ORIGN_VCTN_DAYS', 'ORIGN_VCTN_TIME', 'ORIGN_VCTN_MIN', 'VCTN_TIME_FOR_DAYS', 'VCTN_MIN_FOR_DAYS', 'VCTN_RQST_RSN', 'CNCL_RSN', 'PRV_YRYC_RQST_TIME', 'PRV_RQST_NO', 'KEY_YRYC_RQST_TIME', 'KEY_FRM_DT', 'FRM_WORK_FG', 'TO_WORK_FG', 'FRM_ATTN_HM', 'TO_ATTN_HM', 'FRM_LVFC_HM', 'TO_LVFC_HM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0111/setFileList.do | inputCols=tmHeader,RQST_NO,RQST_DT,RQST_FG,APV_STAT_CD,APV_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,VCNR_EMP_NO,VCNR_EMP_NM,VCNR_DEPT_CD,VCNR_DEPT_NM,VCNR_GRD_CD,VCNR_GRD_NM,VCNR_SEX_DIST,VAUSP_EMP_NO,VAUSP_EMP_NM,VAUSP_DEPT_CD,VAUSP_DEPT_NM,VAUSP_GRD_CD,VAUSP_GRD_NM,VCTN_MNG_NO,VCTN_FG_CD,VCTN_FG_NM,VCTN_FG_CD_DTL,VCTN_ACCT_CD,VCTN_USE_UNIT_FG,VCTN_FRM_DT,VCTN_FRM_HM,VCTN_TO_DT,VCTN_TO_HM,VCTN_DAYS,VCTN_TIME,VCTN_MIN,ORIGN_VCTN_DAYS,ORIGN_VCTN_TIME,ORIGN_VCTN_MIN,VCTN_TIME_FOR_DAYS,VCTN_MIN_FOR_DAYS,VCTN_RQST_RSN,CNCL_RSN,PRV_YRYC_RQST_TIME,PRV_RQST_NO,KEY_YRYC_RQST_TIME,KEY_FRM_DT,FRM_WORK_FG,TO_WORK_FG,FRM_ATTN_HM,TO_ATTN_HM,FRM_LVFC_HM,TO_LVFC_HM
  test.skip('[no:1] 휴가신청 - 조회 (setFileList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0111/getPrvData.do | inputCols=tmHeader,RQST_NO,RQST_DT,RQST_FG,APV_STAT_CD,APV_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,VCNR_EMP_NO,VCNR_EMP_NM,VCNR_DEPT_CD,VCNR_DEPT_NM,VCNR_GRD_CD,VCNR_GRD_NM,VCNR_SEX_DIST,VAUSP_EMP_NO,VAUSP_EMP_NM,VAUSP_DEPT_CD,VAUSP_DEPT_NM,VAUSP_GRD_CD,VAUSP_GRD_NM,VCTN_MNG_NO,VCTN_FG_CD,VCTN_FG_NM,VCTN_FG_CD_DTL,VCTN_ACCT_CD,VCTN_USE_UNIT_FG,VCTN_FRM_DT,VCTN_FRM_HM,VCTN_TO_DT,VCTN_TO_HM,VCTN_DAYS,VCTN_TIME,VCTN_MIN,ORIGN_VCTN_DAYS,ORIGN_VCTN_TIME,ORIGN_VCTN_MIN,VCTN_TIME_FOR_DAYS,VCTN_MIN_FOR_DAYS,VCTN_RQST_RSN,CNCL_RSN,PRV_YRYC_RQST_TIME,PRV_RQST_NO,KEY_YRYC_RQST_TIME,KEY_FRM_DT,FRM_WORK_FG,TO_WORK_FG,FRM_ATTN_HM,TO_ATTN_HM,FRM_LVFC_HM,TO_LVFC_HM
  test.skip('[no:2] 휴가신청 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0111/delData.do | inputCols=tmHeader,RQST_NO,RQST_DT,RQST_FG,APV_STAT_CD,APV_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,VCNR_EMP_NO,VCNR_EMP_NM,VCNR_DEPT_CD,VCNR_DEPT_NM,VCNR_GRD_CD,VCNR_GRD_NM,VCNR_SEX_DIST,VAUSP_EMP_NO,VAUSP_EMP_NM,VAUSP_DEPT_CD,VAUSP_DEPT_NM,VAUSP_GRD_CD,VAUSP_GRD_NM,VCTN_MNG_NO,VCTN_FG_CD,VCTN_FG_NM,VCTN_FG_CD_DTL,VCTN_ACCT_CD,VCTN_USE_UNIT_FG,VCTN_FRM_DT,VCTN_FRM_HM,VCTN_TO_DT,VCTN_TO_HM,VCTN_DAYS,VCTN_TIME,VCTN_MIN,ORIGN_VCTN_DAYS,ORIGN_VCTN_TIME,ORIGN_VCTN_MIN,VCTN_TIME_FOR_DAYS,VCTN_MIN_FOR_DAYS,VCTN_RQST_RSN,CNCL_RSN,PRV_YRYC_RQST_TIME,PRV_RQST_NO,KEY_YRYC_RQST_TIME,KEY_FRM_DT,FRM_WORK_FG,TO_WORK_FG,FRM_ATTN_HM,TO_ATTN_HM,FRM_LVFC_HM,TO_LVFC_HM
  test.skip('[no:3] 휴가신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0111/getData.do | inputCols=tmHeader,RQST_NO,RQST_DT,RQST_FG,APV_STAT_CD,APV_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,VCNR_EMP_NO,VCNR_EMP_NM,VCNR_DEPT_CD,VCNR_DEPT_NM,VCNR_GRD_CD,VCNR_GRD_NM,VCNR_SEX_DIST,VAUSP_EMP_NO,VAUSP_EMP_NM,VAUSP_DEPT_CD,VAUSP_DEPT_NM,VAUSP_GRD_CD,VAUSP_GRD_NM,VCTN_MNG_NO,VCTN_FG_CD,VCTN_FG_NM,VCTN_FG_CD_DTL,VCTN_ACCT_CD,VCTN_USE_UNIT_FG,VCTN_FRM_DT,VCTN_FRM_HM,VCTN_TO_DT,VCTN_TO_HM,VCTN_DAYS,VCTN_TIME,VCTN_MIN,ORIGN_VCTN_DAYS,ORIGN_VCTN_TIME,ORIGN_VCTN_MIN,VCTN_TIME_FOR_DAYS,VCTN_MIN_FOR_DAYS,VCTN_RQST_RSN,CNCL_RSN,PRV_YRYC_RQST_TIME,PRV_RQST_NO,KEY_YRYC_RQST_TIME,KEY_FRM_DT,FRM_WORK_FG,TO_WORK_FG,FRM_ATTN_HM,TO_ATTN_HM,FRM_LVFC_HM,TO_LVFC_HM
  test.skip('[no:4] 휴가신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0111/getTmCombo.do | inputCols=tmHeader,RQST_NO,RQST_DT,RQST_FG,APV_STAT_CD,APV_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,VCNR_EMP_NO,VCNR_EMP_NM,VCNR_DEPT_CD,VCNR_DEPT_NM,VCNR_GRD_CD,VCNR_GRD_NM,VCNR_SEX_DIST,VAUSP_EMP_NO,VAUSP_EMP_NM,VAUSP_DEPT_CD,VAUSP_DEPT_NM,VAUSP_GRD_CD,VAUSP_GRD_NM,VCTN_MNG_NO,VCTN_FG_CD,VCTN_FG_NM,VCTN_FG_CD_DTL,VCTN_ACCT_CD,VCTN_USE_UNIT_FG,VCTN_FRM_DT,VCTN_FRM_HM,VCTN_TO_DT,VCTN_TO_HM,VCTN_DAYS,VCTN_TIME,VCTN_MIN,ORIGN_VCTN_DAYS,ORIGN_VCTN_TIME,ORIGN_VCTN_MIN,VCTN_TIME_FOR_DAYS,VCTN_MIN_FOR_DAYS,VCTN_RQST_RSN,CNCL_RSN,PRV_YRYC_RQST_TIME,PRV_RQST_NO,KEY_YRYC_RQST_TIME,KEY_FRM_DT,FRM_WORK_FG,TO_WORK_FG,FRM_ATTN_HM,TO_ATTN_HM,FRM_LVFC_HM,TO_LVFC_HM
  test.skip('[no:5] 휴가신청 - 조회 (getTmCombo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0111/getVctnFgCdList.do | inputCols=-
  test.skip('[no:6] 휴가신청 - 조회 (getVctnFgCdList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('외출신청 목록 (gen_0115M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0115M' OR MNU_NM LIKE '외출신청 목록%'
  const MENU_ID = 'TODO_gen_0115M';
  const API_URL = '/mis/gen/gen0115/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_GNOT_FRM_DT', 'SCH_GNOT_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_RQST_FG', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0115/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_GNOT_FRM_DT,SCH_GNOT_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_RQST_FG,SCH_APV_STAT_CD
  test.skip('[no:1] 외출신청 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('외출신청 상세 (gen_0116M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0116M' OR MNU_NM LIKE '외출신청 상세%'
  const MENU_ID = 'TODO_gen_0116M';
  const API_URL = '/mis/gen/gen0116/getPrvData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_NO', 'RQST_DT', 'RQST_FG', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'APV_STAT_CD', 'APV_STAT_NM', 'GNOT_DT', 'GNOT_FRM_HM', 'GNOT_TO_HM', 'GNOT_TIME', 'EMNC_CTTPC', 'WORK_FG', 'WORK_FG_NM', 'GNOT_RSN', 'CNCL_RSN', 'PRV_RQST_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0116/getPrvData.do | inputCols=RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,APV_STAT_CD,APV_STAT_NM,GNOT_DT,GNOT_FRM_HM,GNOT_TO_HM,GNOT_TIME,EMNC_CTTPC,WORK_FG,WORK_FG_NM,GNOT_RSN,CNCL_RSN,PRV_RQST_NO
  test.skip('[no:1] 외출신청 상세 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0116/delData.do | inputCols=RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,APV_STAT_CD,APV_STAT_NM,GNOT_DT,GNOT_FRM_HM,GNOT_TO_HM,GNOT_TIME,EMNC_CTTPC,WORK_FG,WORK_FG_NM,GNOT_RSN,CNCL_RSN,PRV_RQST_NO
  test.skip('[no:2] 외출신청 상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0116/getData.do | inputCols=RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,APV_STAT_CD,APV_STAT_NM,GNOT_DT,GNOT_FRM_HM,GNOT_TO_HM,GNOT_TIME,EMNC_CTTPC,WORK_FG,WORK_FG_NM,GNOT_RSN,CNCL_RSN,PRV_RQST_NO
  test.skip('[no:3] 외출신청 상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0116/getGnotTm.do | inputCols=DT,EMP_NO,WORK_FG,WORK_FG_NM,PLAN_FRM_HM,PLAN_TO_HM
  test.skip('[no:4] 외출신청 상세 - 조회 (getGnotTm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0116/getWorkTp.do | inputCols=RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,APV_STAT_CD,APV_STAT_NM,GNOT_DT,GNOT_FRM_HM,GNOT_TO_HM,GNOT_TIME,EMNC_CTTPC,WORK_FG,WORK_FG_NM,GNOT_RSN,CNCL_RSN,PRV_RQST_NO
  test.skip('[no:5] 외출신청 상세 - 조회 (getWorkTp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연차휴가사용현황 (gen_0120M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0120M' OR MNU_NM LIKE '연차휴가사용현황%'
  const MENU_ID = 'TODO_gen_0120M';
  const API_URL = '/mis/gen/gen0120/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_HLDF_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0120/getList.do | inputCols=SCH_STDR_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_HLDF_FG_CD
  test.skip('[no:1] 연차휴가사용현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('보상휴가사용현황 (gen_0130M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0130M' OR MNU_NM LIKE '보상휴가사용현황%'
  const MENU_ID = 'TODO_gen_0130M';
  const API_URL = '/mis/gen/gen0130/getRwrdOrgUseDtlList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_DT', 'EMP_NO', 'RQST_NO_LIST', 'USE_FRM_DT', 'USE_TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0130/getRwrdOrgUseDtlList.do | inputCols=STDR_DT,EMP_NO,RQST_NO_LIST,USE_FRM_DT,USE_TO_DT
  test.skip('[no:1] 보상휴가사용현황 - 조회 (getRwrdOrgUseDtlList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0130/getRwrdOrgUseList.do | inputCols=STDR_DT,EMP_NO,RQST_NO_LIST,USE_FRM_DT,USE_TO_DT
  test.skip('[no:2] 보상휴가사용현황 - 조회 (getRwrdOrgUseList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0130/getEmpList.do | inputCols=SCH_STDR_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_HLDF_FG_CD
  test.skip('[no:3] 보상휴가사용현황 - 조회 (getEmpList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0130/getAppoYn.do | inputCols=-
  test.skip('[no:4] 보상휴가사용현황 - 조회 (getAppoYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('대체휴가사용현황 (gen_0140M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0140M' OR MNU_NM LIKE '대체휴가사용현황%'
  const MENU_ID = 'TODO_gen_0140M';
  const API_URL = '/mis/gen/gen0140/getRplOrgUseList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_DT', 'EMP_NO', 'USE_RQST_NO_STR'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0140/getRplOrgUseList.do | inputCols=STDR_DT,EMP_NO,USE_RQST_NO_STR
  test.skip('[no:1] 대체휴가사용현황 - 조회 (getRplOrgUseList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0140/getList.do | inputCols=SCH_STDR_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_HLDF_FG_CD
  test.skip('[no:2] 대체휴가사용현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('저축휴가사용현황 (gen_0150M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0150M' OR MNU_NM LIKE '저축휴가사용현황%'
  const MENU_ID = 'TODO_gen_0150M';
  const API_URL = '/mis/gen/gen0150/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_HLDF_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0150/getList.do | inputCols=SCH_STDR_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_HLDF_FG_CD
  test.skip('[no:1] 저축휴가사용현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자녀돌봄휴가사용현황 (gen_0160M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0160M' OR MNU_NM LIKE '자녀돌봄휴가사용현황%'
  const MENU_ID = 'TODO_gen_0160M';
  const API_URL = '/mis/gen/gen0160/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_HLDF_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0160/getList.do | inputCols=SCH_STDR_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_HLDF_FG_CD
  test.skip('[no:1] 자녀돌봄휴가사용현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('휴가발생/사용현황 (gen_0170M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0170M' OR MNU_NM LIKE '휴가발생/사용현황%'
  const MENU_ID = 'TODO_gen_0170M';
  const API_URL = '/mis/gen/gen0170/getRwrdOrgUseDtlList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_DT', 'EMP_NO', 'VCTN_ACCT_CD', 'RQST_NO_LIST', 'USE_FRM_DT', 'USE_TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0170/getRwrdOrgUseDtlList.do | inputCols=STDR_DT,EMP_NO,VCTN_ACCT_CD,RQST_NO_LIST,USE_FRM_DT,USE_TO_DT
  test.skip('[no:1] 휴가발생/사용현황 - 조회 (getRwrdOrgUseDtlList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0170/getRwrdOrgUseList.do | inputCols=STDR_DT,EMP_NO,VCTN_ACCT_CD,RQST_NO_LIST,USE_FRM_DT,USE_TO_DT
  test.skip('[no:2] 휴가발생/사용현황 - 조회 (getRwrdOrgUseList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0170/getEmpList.do | inputCols=SCH_STDR_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_HLDF_FG_CD,SCH_VCTN_ACCT_CD
  test.skip('[no:3] 휴가발생/사용현황 - 조회 (getEmpList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0170/getAppoYn.do | inputCols=-
  test.skip('[no:4] 휴가발생/사용현황 - 조회 (getAppoYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('보상휴가신청 (gen_0210M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0210M' OR MNU_NM LIKE '보상휴가신청%'
  const MENU_ID = 'TODO_gen_0210M';
  const API_URL = '/mis/gen/gen0210/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'APV_STAT_CD', 'RQST_FG', 'VCTN_FG_CD', 'SCH_EMP_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0210/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,DEPT_CD,DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,APV_STAT_CD,RQST_FG,VCTN_FG_CD,SCH_EMP_CLS
  test.skip('[no:1] 보상휴가신청 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('보상휴가신청 (gen_0211M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0211M' OR MNU_NM LIKE '보상휴가신청%'
  const MENU_ID = 'TODO_gen_0211M';
  const API_URL = '/mis/gen/gen0211/getExcpEmpNo.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0211/getExcpEmpNo.do | inputCols=-
  test.skip('[no:1] 보상휴가신청 - 조회 (getExcpEmpNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0211/getVctnInfo.do | inputCols=VCTN_RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,VCNR_EMP_NO,VCNR_EMP_NM,VCNR_WORK_DGCNT,VCNR_DEPT_CD,VCNR_DEPT_NM,VCNR_GRD_CD,VCNR_GRD_NM,VCTN_FG_CD,FRM_DT,FRM_HH,FRM_MM,TO_DT,TO_HH,TO_MM,VCTN_HH,VCTN_MM,VCTN_MIN,PRV_VCTN_MIN,HDAY_DAYS,VCTN_RQST_RSN,PST_PROOF_YN,VCTN_ETC_METR,PRV_VCTN_RQST_NO,PRV_YRYC_RQST_TIME,CNCL_RSN,APV_STAT_CD,APV_STAT_NM,KEY_VCTN_MIN
  test.skip('[no:2] 보상휴가신청 - 조회 (getVctnInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0211/getFrmVcnrWorkType.do | inputCols=VCTN_RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,VCNR_EMP_NO,VCNR_EMP_NM,VCNR_WORK_DGCNT,VCNR_DEPT_CD,VCNR_DEPT_NM,VCNR_GRD_CD,VCNR_GRD_NM,VCTN_FG_CD,FRM_DT,FRM_HH,FRM_MM,TO_DT,TO_HH,TO_MM,VCTN_HH,VCTN_MM,VCTN_MIN,PRV_VCTN_MIN,HDAY_DAYS,VCTN_RQST_RSN,PST_PROOF_YN,VCTN_ETC_METR,PRV_VCTN_RQST_NO,PRV_YRYC_RQST_TIME,CNCL_RSN,APV_STAT_CD,APV_STAT_NM,KEY_VCTN_MIN
  test.skip('[no:3] 보상휴가신청 - 조회 (getVcnrWorkType) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0211/getVctnRqstDays.do | inputCols=VCTN_RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,VCNR_EMP_NO,VCNR_EMP_NM,VCNR_WORK_DGCNT,VCNR_DEPT_CD,VCNR_DEPT_NM,VCNR_GRD_CD,VCNR_GRD_NM,VCTN_FG_CD,FRM_DT,FRM_HH,FRM_MM,TO_DT,TO_HH,TO_MM,VCTN_HH,VCTN_MM,VCTN_MIN,PRV_VCTN_MIN,HDAY_DAYS,VCTN_RQST_RSN,PST_PROOF_YN,VCTN_ETC_METR,PRV_VCTN_RQST_NO,PRV_YRYC_RQST_TIME,CNCL_RSN,APV_STAT_CD,APV_STAT_NM,KEY_VCTN_MIN
  test.skip('[no:4] 보상휴가신청 - 조회 (getVctnRqstDays) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0211/getData.do | inputCols=VCTN_RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,VCNR_EMP_NO,VCNR_EMP_NM,VCNR_WORK_DGCNT,VCNR_DEPT_CD,VCNR_DEPT_NM,VCNR_GRD_CD,VCNR_GRD_NM,VCTN_FG_CD,FRM_DT,FRM_HH,FRM_MM,TO_DT,TO_HH,TO_MM,VCTN_HH,VCTN_MM,VCTN_MIN,PRV_VCTN_MIN,HDAY_DAYS,VCTN_RQST_RSN,PST_PROOF_YN,VCTN_ETC_METR,PRV_VCTN_RQST_NO,PRV_YRYC_RQST_TIME,CNCL_RSN,APV_STAT_CD,APV_STAT_NM,KEY_VCTN_MIN
  test.skip('[no:5] 보상휴가신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0211/getPrvData.do | inputCols=VCTN_RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,VCNR_EMP_NO,VCNR_EMP_NM,VCNR_WORK_DGCNT,VCNR_DEPT_CD,VCNR_DEPT_NM,VCNR_GRD_CD,VCNR_GRD_NM,VCTN_FG_CD,FRM_DT,FRM_HH,FRM_MM,TO_DT,TO_HH,TO_MM,VCTN_HH,VCTN_MM,VCTN_MIN,PRV_VCTN_MIN,HDAY_DAYS,VCTN_RQST_RSN,PST_PROOF_YN,VCTN_ETC_METR,PRV_VCTN_RQST_NO,PRV_YRYC_RQST_TIME,CNCL_RSN,APV_STAT_CD,APV_STAT_NM,KEY_VCTN_MIN
  test.skip('[no:6] 보상휴가신청 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0211/delData.do | inputCols=VCTN_RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,VCNR_EMP_NO,VCNR_EMP_NM,VCNR_WORK_DGCNT,VCNR_DEPT_CD,VCNR_DEPT_NM,VCNR_GRD_CD,VCNR_GRD_NM,VCTN_FG_CD,FRM_DT,FRM_HH,FRM_MM,TO_DT,TO_HH,TO_MM,VCTN_HH,VCTN_MM,VCTN_MIN,PRV_VCTN_MIN,HDAY_DAYS,VCTN_RQST_RSN,PST_PROOF_YN,VCTN_ETC_METR,PRV_VCTN_RQST_NO,PRV_YRYC_RQST_TIME,CNCL_RSN,APV_STAT_CD,APV_STAT_NM,KEY_VCTN_MIN
  test.skip('[no:7] 보상휴가신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0211/setApvStat040.do | inputCols=VCTN_RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,VCNR_EMP_NO,VCNR_EMP_NM,VCNR_WORK_DGCNT,VCNR_DEPT_CD,VCNR_DEPT_NM,VCNR_GRD_CD,VCNR_GRD_NM,VCTN_FG_CD,FRM_DT,FRM_HH,FRM_MM,TO_DT,TO_HH,TO_MM,VCTN_HH,VCTN_MM,VCTN_MIN,PRV_VCTN_MIN,HDAY_DAYS,VCTN_RQST_RSN,PST_PROOF_YN,VCTN_ETC_METR,PRV_VCTN_RQST_NO,PRV_YRYC_RQST_TIME,CNCL_RSN,APV_STAT_CD,APV_STAT_NM,KEY_VCTN_MIN
  test.skip('[no:8] 보상휴가신청 - 저장 (setApvStat040) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('보상휴가발생현황조회 (gen_0220M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0220M' OR MNU_NM LIKE '보상휴가발생현황조회%'
  const MENU_ID = 'TODO_gen_0220M';
  const API_URL = '/mis/gen/gen0220/getEmpList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_DT', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'HLDF_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0220/getEmpList.do | inputCols=STDR_DT,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,HLDF_FG_CD
  test.skip('[no:1] 보상휴가발생현황조회 - 조회 (getEmpList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0220/getOrgList.do | inputCols=STDR_DT,EMP_NO
  test.skip('[no:2] 보상휴가발생현황조회 - 조회 (getOrgList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0220/getUseList.do | inputCols=STDR_DT,EMP_NO
  test.skip('[no:3] 보상휴가발생현황조회 - 조회 (getUseList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('보상휴가사용현황 (gen_0225M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0225M' OR MNU_NM LIKE '보상휴가사용현황%'
  const MENU_ID = 'TODO_gen_0225M';
  const API_URL = '/mis/gen/gen0950/getAppoYn.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0950/getAppoYn.do | inputCols=-
  test.skip('[no:1] 보상휴가사용현황 - 조회 (getAppoYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0225/getEmpList1.do | inputCols=STDR_DT,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,HLDF_FG_CD
  test.skip('[no:2] 보상휴가사용현황 - 조회 (getEmpList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0225/getEmpList2.do | inputCols=STDR_DT,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,HLDF_FG_CD
  test.skip('[no:3] 보상휴가사용현황 - 조회 (getEmpList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0225/getRwrdOrgUseList.do | inputCols=STDR_DT,EMP_NO,WORK_DGCNT,OVTM_RQST_NO,VCTN_RQST_NO
  test.skip('[no:4] 보상휴가사용현황 - 조회 (getRwrdOrgUseList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0225/getRwrdOrgUseDtlList.do | inputCols=STDR_DT,EMP_NO,WORK_DGCNT,OVTM_RQST_NO,VCTN_RQST_NO
  test.skip('[no:5] 보상휴가사용현황 - 조회 (getRwrdOrgUseDtlList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('보상휴가 4시간 초과자 관리 (gen_0230M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0230M' OR MNU_NM LIKE '보상휴가 4시간 초과자 관리%'
  const MENU_ID = 'TODO_gen_0230M';
  const API_URL = '/mis/gen/gen0230/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0230/getList.do | inputCols=-
  test.skip('[no:1] 보상휴가 4시간 초과자 관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0230/setData.do | inputCols=-
  test.skip('[no:2] 보상휴가 4시간 초과자 관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연차촉진관리 (gen_0310M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0310M' OR MNU_NM LIKE '연차촉진관리%'
  const MENU_ID = 'TODO_gen_0310M';
  const API_URL = '/mis/gen/gen0310/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_PROMT_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0310/getList.do | inputCols=SCH_FRM_DT,SCH_TO_DT,SCH_PROMT_STAT_CD
  test.skip('[no:1] 연차촉진관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연차촉진관리 (gen_0311M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0311M' OR MNU_NM LIKE '연차촉진관리%'
  const MENU_ID = 'TODO_gen_0311M';
  const API_URL = '/mis/gen/gen0311/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['PROMT_MNG_NO', 'PROMTR_EMP_NO', 'PROMTR_EMP_NM', 'PROMTR_DEPT_CD', 'PROMTR_DEPT_NM', 'PROMTR_GRD_CD', 'PROMTR_GRD_NM', 'WRT_DT', 'STDR_DT', 'PROMT_DE', 'PROMT_TGPN_FG_CD', 'PROMT_DGCNT', 'PK_PROMT_DGCNT', 'PROMT_STAT_CD', 'PROMT_STAT_NM', 'PROMT_SBJ', 'PROMT_CONT', 'PROMT_DGCNT_FG_CD', 'PROMT_DGCNT_FG_NM', 'SCH_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen0311/delData.do | inputCols=PROMT_MNG_NO,PROMTR_EMP_NO,PROMTR_EMP_NM,PROMTR_DEPT_CD,PROMTR_DEPT_NM,PROMTR_GRD_CD,PROMTR_GRD_NM,WRT_DT,STDR_DT,PROMT_DE,PROMT_TGPN_FG_CD,PROMT_DGCNT,PK_PROMT_DGCNT,PROMT_STAT_CD,PROMT_STAT_NM,PROMT_SBJ,PROMT_CONT,PROMT_DGCNT_FG_CD,PROMT_DGCNT_FG_NM,SCH_EMP_NO
  test.skip('[no:1] 연차촉진관리 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0311/getData.do | inputCols=PROMT_MNG_NO,PROMTR_EMP_NO,PROMTR_EMP_NM,PROMTR_DEPT_CD,PROMTR_DEPT_NM,PROMTR_GRD_CD,PROMTR_GRD_NM,WRT_DT,STDR_DT,PROMT_DE,PROMT_TGPN_FG_CD,PROMT_DGCNT,PK_PROMT_DGCNT,PROMT_STAT_CD,PROMT_STAT_NM,PROMT_SBJ,PROMT_CONT,PROMT_DGCNT_FG_CD,PROMT_DGCNT_FG_NM,SCH_EMP_NO
  test.skip('[no:2] 연차촉진관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('휴가사용계획서 목록 (gen_0320M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0320M' OR MNU_NM LIKE '휴가사용계획서 목록%'
  const MENU_ID = 'TODO_gen_0320M';
  const API_URL = '/mis/gen/gen0320/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_TGPN_EMP_NO', 'SCH_TGPN_EMP_NM', 'SCH_TGPN_DEPT_CD', 'SCH_TGPN_DEPT_NM', 'SCH_PROMT_TGPN_FG_CD', 'SCH_PROMT_DGCNT', 'SCH_PROMT_STAT_CD', 'SIGN_STAT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0320/getList.do | inputCols=SCH_FRM_DT,SCH_TO_DT,SCH_TGPN_EMP_NO,SCH_TGPN_EMP_NM,SCH_TGPN_DEPT_CD,SCH_TGPN_DEPT_NM,SCH_PROMT_TGPN_FG_CD,SCH_PROMT_DGCNT,SCH_PROMT_STAT_CD,SIGN_STAT_NM
  test.skip('[no:1] 휴가사용계획서 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('휴가사용계획서 상세 (gen_0321M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0321M' OR MNU_NM LIKE '휴가사용계획서 상세%'
  const MENU_ID = 'TODO_gen_0321M';
  const API_URL = '/mis/gen/gen0321/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['PROMT_MNG_NO', 'PROMT_TGPN_FG_CD', 'PROMT_TGPN_FG_NM', 'PROMT_DGCNT', 'PROMT_DGCNT_NM', 'PROMT_STAT_CD', 'PROMT_STAT_NM', 'SAVE_YN', 'STDR_DT', 'Column0', 'VCTN_PLAN_SBMT_DE', 'VCTN_APPN_DSTH_DE', 'VCTN_PLAN_SBMT_DT', 'VCTN_APPN_DSTH_DT', 'TGPN_EMP_NO', 'TGPN_EMP_NM', 'TGPN_DEPT_CD', 'TGPN_DEPT_NM', 'TGPN_GRD_CD', 'TGPN_GRD_NM', 'WEEK_WORK_TIME', 'DAILY_WORK_TIME', 'YRYC_OCRNC_TIME', 'YRYC_OCRNC_MIN', 'YRYC_USE_TIME', 'YRYC_USE_MIN', 'YRYC_REDR_TIME', 'YRYC_REDR_MIN', 'SUM_RQST_TIME_STR', 'TODO_NO', 'ENT_DT', 'RSIGN_DT', 'PROMTR_EMP_NO', 'PROMTR_WORK_DGCNT', 'WRT_DT', 'PROMT_SBJ', 'PROMT_DE', 'PROMT_DT', 'SIGN_STAT_CD', 'SIGN_STAT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0321/getData.do | inputCols=PROMT_MNG_NO,PROMT_TGPN_FG_CD,PROMT_TGPN_FG_NM,PROMT_DGCNT,PROMT_DGCNT_NM,PROMT_STAT_CD,PROMT_STAT_NM,SAVE_YN,STDR_DT,Column0,VCTN_PLAN_SBMT_DE,VCTN_APPN_DSTH_DE,VCTN_PLAN_SBMT_DT,VCTN_APPN_DSTH_DT,TGPN_EMP_NO,TGPN_EMP_NM,TGPN_DEPT_CD,TGPN_DEPT_NM,TGPN_GRD_CD,TGPN_GRD_NM,WEEK_WORK_TIME,DAILY_WORK_TIME,YRYC_OCRNC_TIME,YRYC_OCRNC_MIN,YRYC_USE_TIME,YRYC_USE_MIN,YRYC_REDR_TIME,YRYC_REDR_MIN,SUM_RQST_TIME_STR,TODO_NO,ENT_DT,RSIGN_DT,PROMTR_EMP_NO,PROMTR_WORK_DGCNT,WRT_DT,PROMT_SBJ,PROMT_DE,PROMT_DT,SIGN_STAT_CD,SIGN_STAT_NM
  test.skip('[no:1] 휴가사용계획서 상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0321/getTodoInfo.do | inputCols=TODO_NO,PROMT_MNG_NO,PROMT_TGPN_FG_CD,PROMT_DGCNT,TGPN_EMP_NO
  test.skip('[no:2] 휴가사용계획서 상세 - 조회 (getTodoInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연차수당관리 (gen_0330M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0330M' OR MNU_NM LIKE '연차수당관리%'
  const MENU_ID = 'TODO_gen_0330M';
  const API_URL = '/mis/gen/gen0330/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YYYY', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0330/getList.do | inputCols=SCH_YYYY,DEPT_CD,DEPT_NM,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:1] 연차수당관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직자연차수당관리 (gen_0340M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0340M' OR MNU_NM LIKE '퇴직자연차수당관리%'
  const MENU_ID = 'TODO_gen_0340M';
  const API_URL = '/mis/gen/gen0340/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DCSN_YN', 'SCH_HLDF_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0340/getList.do | inputCols=SCH_YY,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_DCSN_YN,SCH_HLDF_FG_CD
  test.skip('[no:1] 퇴직자연차수당관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직자연차수당관리 (gen_0341M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0341M' OR MNU_NM LIKE '퇴직자연차수당관리%'
  const MENU_ID = 'TODO_gen_0341M';
  const API_URL = '/mis/gen/gen0341/searchData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'ENT_DT', 'OWK_DT', 'ACT_MM', 'ACT_DD', 'DCSN_YN', 'RTRE_YRYC_EXCC_FG', 'USE_MIN', 'USE_DAYS', 'REDR_MIN', 'REDR_DAYS', 'DFNC_MIN', 'DFNC_DAYS', 'RWRD_MIN', 'RWRD_DAYS', 'LAST_WORK_YEARS', 'LAST_OCRNC_MIN', 'LAST_OCRNC_DAYS', 'USE_FRM_DT', 'USE_TO_DT', 'PAY_DCSN_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen0341/setConfYn.do | inputCols=EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,ENT_DT,OWK_DT,ACT_MM,ACT_DD,DCSN_YN,RTRE_YRYC_EXCC_FG,USE_MIN,USE_DAYS,REDR_MIN,REDR_DAYS,DFNC_MIN,DFNC_DAYS,RWRD_MIN,RWRD_DAYS,LAST_WORK_YEARS,LAST_OCRNC_MIN,LAST_OCRNC_DAYS,USE_FRM_DT,USE_TO_DT,PAY_DCSN_YN
  test.skip('[no:1] 퇴직자연차수당관리 - 저장 (setConfYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0341/searchData.do | inputCols=EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,ENT_DT,OWK_DT,ACT_MM,ACT_DD,DCSN_YN,RTRE_YRYC_EXCC_FG,USE_MIN,USE_DAYS,REDR_MIN,REDR_DAYS,DFNC_MIN,DFNC_DAYS,RWRD_MIN,RWRD_DAYS,LAST_WORK_YEARS,LAST_OCRNC_MIN,LAST_OCRNC_DAYS,USE_FRM_DT,USE_TO_DT,PAY_DCSN_YN
  test.skip('[no:2] 퇴직자연차수당관리 - 조회 (searchData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0341/getData.do | inputCols=EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,ENT_DT,OWK_DT,ACT_MM,ACT_DD,DCSN_YN,RTRE_YRYC_EXCC_FG,USE_MIN,USE_DAYS,REDR_MIN,REDR_DAYS,DFNC_MIN,DFNC_DAYS,RWRD_MIN,RWRD_DAYS,LAST_WORK_YEARS,LAST_OCRNC_MIN,LAST_OCRNC_DAYS,USE_FRM_DT,USE_TO_DT,PAY_DCSN_YN
  test.skip('[no:3] 퇴직자연차수당관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('휴가촉진확인 (gen_0360M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0360M' OR MNU_NM LIKE '휴가촉진확인%'
  const MENU_ID = 'TODO_gen_0360M';
  const API_URL = '/mis/gen/gen0360/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_EMP_NO', 'SCH_WORK_DGCNT', 'SCH_EMP_NM', 'SCH_DEPT_NM', 'SCH_DEPT_CD', 'SCH_PROMT_DGCNT_FG_CD', 'SCH_PROMT_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0360/getList.do | inputCols=SCH_FRM_DT,SCH_TO_DT,SCH_EMP_NO,SCH_WORK_DGCNT,SCH_EMP_NM,SCH_DEPT_NM,SCH_DEPT_CD,SCH_PROMT_DGCNT_FG_CD,SCH_PROMT_STAT_CD
  test.skip('[no:1] 휴가촉진확인 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('유연근무제설정관리 (gen_0410M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0410M' OR MNU_NM LIKE '유연근무제설정관리%'
  const MENU_ID = 'TODO_gen_0410M';
  const API_URL = '/mis/gen/gen0410/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen0410/setData.do | inputCols=WOKR_FG,ATTN_FRM_TM,ATTN_TO_TM,LVFC_FRM_TM,LVFC_TO_TM,RQST_BFRT_STDR,RQST_STDR_FRM_DD,RQST_STDR_TO_DD,DD_MAX_WORK_TIME,ATTN_LVFC_USE_YN
  test.skip('[no:1] 유연근무제설정관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0410/getData.do | inputCols=-
  test.skip('[no:2] 유연근무제설정관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0410/getComboMulti.do | inputCols=-
  test.skip('[no:3] 유연근무제설정관리 - 조회 (getComboMulti) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('유연근무제(시차출퇴근) 신청 목록 (gen_0420M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0420M' OR MNU_NM LIKE '유연근무제(시차출퇴근) 신청 목록%'
  const MENU_ID = 'TODO_gen_0420M';
  const API_URL = '/mis/gen/gen0420/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_WORK_FRM_YM', 'SCH_WORK_TO_YM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0420/getList.do | inputCols=SCH_WORK_FRM_YM,SCH_WORK_TO_YM,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_APV_STAT_CD
  test.skip('[no:1] 유연근무제(시차출퇴근) 신청 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0420/getRqstPoslYn.do | inputCols=-
  test.skip('[no:2] 유연근무제(시차출퇴근) 신청 목록 - 조회 (getRqstPoslYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('유연근무제(시차출퇴근) 신청 (gen_0421M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0421M' OR MNU_NM LIKE '유연근무제(시차출퇴근) 신청%'
  const MENU_ID = 'TODO_gen_0421M';
  const API_URL = '/mis/gen/gen0421/getPrvData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['AGWK_RQST_NO', 'PRV_RQST_NO', 'RQST_DT', 'RQST_FG', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_WORK_DGCNT', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'APNT_GRD_NM', 'APV_STAT_CD', 'APV_STAT_NM', 'WORR_EMP_NO', 'WORR_EMP_NM', 'WORR_WORK_DGCNT', 'WORR_DEPT_CD', 'WORR_DEPT_NM', 'WORR_GRD_CD', 'WORR_GRD_NM', 'WORK_YM', 'WORK_HOURS', 'WORK_FRM_HM', 'WORK_TO_HM', 'WORK_TIME', 'WORK_FG', 'RMK', 'CNCL_RSN', 'APLY_FRM_DT', 'APLY_TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0421/getPrvData.do | inputCols=AGWK_RQST_NO,PRV_RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APV_STAT_CD,APV_STAT_NM,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_DEPT_NM,WORR_GRD_CD,WORR_GRD_NM,WORK_YM,WORK_HOURS,WORK_FRM_HM,WORK_TO_HM,WORK_TIME,WORK_FG,RMK,CNCL_RSN,APLY_FRM_DT,APLY_TO_DT
  test.skip('[no:1] 유연근무제(시차출퇴근) 신청 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0421/delData.do | inputCols=AGWK_RQST_NO,PRV_RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APV_STAT_CD,APV_STAT_NM,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_DEPT_NM,WORR_GRD_CD,WORR_GRD_NM,WORK_YM,WORK_HOURS,WORK_FRM_HM,WORK_TO_HM,WORK_TIME,WORK_FG,RMK,CNCL_RSN,APLY_FRM_DT,APLY_TO_DT
  test.skip('[no:2] 유연근무제(시차출퇴근) 신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0421/getData.do | inputCols=AGWK_RQST_NO,PRV_RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APV_STAT_CD,APV_STAT_NM,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_DEPT_NM,WORR_GRD_CD,WORR_GRD_NM,WORK_YM,WORK_HOURS,WORK_FRM_HM,WORK_TO_HM,WORK_TIME,WORK_FG,RMK,CNCL_RSN,APLY_FRM_DT,APLY_TO_DT
  test.skip('[no:3] 유연근무제(시차출퇴근) 신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0421/getChkWorkYm.do | inputCols=WORK_FG,WORK_YM,WORK_FRM_DT,WORK_TO_DT,POSL_WORK_YM,POSL_WORK_FRM_DT,POSL_WORK_TO_DT,POSL_YN
  test.skip('[no:4] 유연근무제(시차출퇴근) 신청 - 조회 (getChkWorkYm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0421/getAttnLvfcTm.do | inputCols=-
  test.skip('[no:5] 유연근무제(시차출퇴근) 신청 - 조회 (getAttnLvfcTm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('유연근무제(부분선택적근로제) 신청 (gen_0430M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0430M' OR MNU_NM LIKE '유연근무제(부분선택적근로제) 신청%'
  const MENU_ID = 'TODO_gen_0430M';
  const API_URL = '/mis/gen/gen0430/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_WORK_FRM_YM', 'SCH_WORK_TO_YM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0430/getList.do | inputCols=SCH_WORK_FRM_YM,SCH_WORK_TO_YM,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_APV_STAT_CD
  test.skip('[no:1] 유연근무제(부분선택적근로제) 신청 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0430/getRqstPoslYn.do | inputCols=-
  test.skip('[no:2] 유연근무제(부분선택적근로제) 신청 - 조회 (getRqstPoslYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('유연근무제(부분선택적근로제) 신청 (gen_0431M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0431M' OR MNU_NM LIKE '유연근무제(부분선택적근로제) 신청%'
  const MENU_ID = 'TODO_gen_0431M';
  const API_URL = '/mis/gen/gen0431/getPrvData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['AGWK_RQST_NO', 'PRV_RQST_NO', 'RQST_DT', 'RQST_FG', 'APV_STAT_CD', 'APV_STAT_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_WORK_DGCNT', 'APNT_GRD_CD', 'WORR_EMP_NO', 'WORR_EMP_NM', 'WORR_WORK_DGCNT', 'WORR_DEPT_CD', 'WORR_DEPT_NM', 'WORR_GRD_CD', 'WORR_GRD_NM', 'WORK_YM', 'WORK_HOURS', 'WORK_FRM_HM', 'WORK_TO_HM', 'WORK_TIME', 'WORK_FG', 'AGRE_YN', 'RMK', 'APLY_FRM_DT', 'APLY_TO_DT', 'TOT_DUTY_LABO_TIME', 'TOT_CHSE_LABO_TIME', 'CNCL_RSN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0431/getPrvData.do | inputCols=AGWK_RQST_NO,PRV_RQST_NO,RQST_DT,RQST_FG,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_DEPT_NM,WORR_GRD_CD,WORR_GRD_NM,WORK_YM,WORK_HOURS,WORK_FRM_HM,WORK_TO_HM,WORK_TIME,WORK_FG,AGRE_YN,RMK,APLY_FRM_DT,APLY_TO_DT,TOT_DUTY_LABO_TIME,TOT_CHSE_LABO_TIME,CNCL_RSN
  test.skip('[no:1] 유연근무제(부분선택적근로제) 신청 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0431/delData.do | inputCols=AGWK_RQST_NO,PRV_RQST_NO,RQST_DT,RQST_FG,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_DEPT_NM,WORR_GRD_CD,WORR_GRD_NM,WORK_YM,WORK_HOURS,WORK_FRM_HM,WORK_TO_HM,WORK_TIME,WORK_FG,AGRE_YN,RMK,APLY_FRM_DT,APLY_TO_DT,TOT_DUTY_LABO_TIME,TOT_CHSE_LABO_TIME,CNCL_RSN
  test.skip('[no:2] 유연근무제(부분선택적근로제) 신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0431/getData.do | inputCols=AGWK_RQST_NO,PRV_RQST_NO,RQST_DT,RQST_FG,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_DEPT_NM,WORR_GRD_CD,WORR_GRD_NM,WORK_YM,WORK_HOURS,WORK_FRM_HM,WORK_TO_HM,WORK_TIME,WORK_FG,AGRE_YN,RMK,APLY_FRM_DT,APLY_TO_DT,TOT_DUTY_LABO_TIME,TOT_CHSE_LABO_TIME,CNCL_RSN
  test.skip('[no:3] 유연근무제(부분선택적근로제) 신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0431/getChkWorkYm.do | inputCols=WORK_FG,WORK_YM,WORK_FRM_DT,WORK_TO_DT,POSL_WORK_YM,POSL_WORK_FRM_DT,POSL_WORK_TO_DT,POSL_YN,DD_MAX_WORK_TIME
  test.skip('[no:4] 유연근무제(부분선택적근로제) 신청 - 조회 (getChkWorkYm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0431/getAttnLvfcTm.do | inputCols=-
  test.skip('[no:5] 유연근무제(부분선택적근로제) 신청 - 조회 (getAttnLvfcTm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('유연근무제(부분선택근로제) 신청서 계획 변경 (gen_0440M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0440M' OR MNU_NM LIKE '유연근무제(부분선택근로제) 신청서 계획 변경%'
  const MENU_ID = 'TODO_gen_0440M';
  const API_URL = '/mis/gen/gen0440/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_WORK_YM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_WORK_DGCNT', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen0440/setData.do | inputCols=isChecked,tmHeader,AGWK_DT,DAY,WEEK,HDAY_YN,PLAN_WORK_FRM_HM,PLAN_WORK_TO_HM,WORK_FRM_HM,WORK_TO_HM,WORK_TIME,DUTY_LABO_TIME,CHSE_LABO_TIME,HLDY_YN,POSL_CHG_YN
  test.skip('[no:1] 유연근무제(부분선택근로제) 신청서 계획 변경 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0440/getList.do | inputCols=SCH_WORK_YM,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_WORK_DGCNT,SCH_APV_STAT_CD
  test.skip('[no:2] 유연근무제(부분선택근로제) 신청서 계획 변경 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0440/getAttnLvfcTm.do | inputCols=-
  test.skip('[no:3] 유연근무제(부분선택근로제) 신청서 계획 변경 - 조회 (getAttnLvfcTm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('유연근무제(부분선택근로제) 정산 현황 (gen_0450M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0450M' OR MNU_NM LIKE '유연근무제(부분선택근로제) 정산 현황%'
  const MENU_ID = 'TODO_gen_0450M';
  const API_URL = '/mis/gen/gen0450/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_WORK_YM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_WORK_DGCNT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0450/getData.do | inputCols=SCH_WORK_YM,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_WORK_DGCNT
  test.skip('[no:1] 유연근무제(부분선택근로제) 정산 현황 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0450/getAttnLvfcTm.do | inputCols=-
  test.skip('[no:2] 유연근무제(부분선택근로제) 정산 현황 - 조회 (getAttnLvfcTm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('단축근무신청목록 (gen_0510M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0510M' OR MNU_NM LIKE '단축근무신청목록%'
  const MENU_ID = 'TODO_gen_0510M';
  const API_URL = '/mis/gen/gen0510/getRqstPoslYn.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0510/getRqstPoslYn.do | inputCols=-
  test.skip('[no:1] 단축근무신청목록 - 조회 (getRqstPoslYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0510/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,DEPT_CD,DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,APV_STAT_CD,RQST_FG,SCH_WORK_FRM_DT,SCH_WORK_TO_DT
  test.skip('[no:2] 단축근무신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('단축근무신청상세 (gen_0511M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0511M' OR MNU_NM LIKE '단축근무신청상세%'
  const MENU_ID = 'TODO_gen_0511M';
  const API_URL = '/mis/gen/gen0511/getPrvData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SHEN_WORK_RQST_NO', 'RQST_FG', 'RQST_DT', 'APV_STAT_CD', 'APV_STAT_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_GRD_CD', 'WORR_EMP_NO', 'WORR_EMP_NM', 'WORR_DEPT_CD', 'WORR_GRD_CD', 'SHEN_WORK_FG', 'WORK_FRM_DT', 'WORK_TO_DT', 'WORK_FRM_HM', 'WORK_TO_HM', 'WORK_TIME', 'PRGN_FG', 'FMLY_SUPT_FG', 'FMLY_NM', 'FMLY_BIRTH', 'RQST_RSN', 'RMK', 'PRV_SHEN_WORK_RQST_NO', 'CNCL_RSN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen0511/delData.do | inputCols=SHEN_WORK_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,SHEN_WORK_FG,WORK_FRM_DT,WORK_TO_DT,WORK_FRM_HM,WORK_TO_HM,WORK_TIME,PRGN_FG,FMLY_SUPT_FG,FMLY_NM,FMLY_BIRTH,RQST_RSN,RMK,PRV_SHEN_WORK_RQST_NO,CNCL_RSN
  test.skip('[no:1] 단축근무신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0511/getPrvData.do | inputCols=SHEN_WORK_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,SHEN_WORK_FG,WORK_FRM_DT,WORK_TO_DT,WORK_FRM_HM,WORK_TO_HM,WORK_TIME,PRGN_FG,FMLY_SUPT_FG,FMLY_NM,FMLY_BIRTH,RQST_RSN,RMK,PRV_SHEN_WORK_RQST_NO,CNCL_RSN
  test.skip('[no:2] 단축근무신청상세 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0511/getData.do | inputCols=SHEN_WORK_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,SHEN_WORK_FG,WORK_FRM_DT,WORK_TO_DT,WORK_FRM_HM,WORK_TO_HM,WORK_TIME,PRGN_FG,FMLY_SUPT_FG,FMLY_NM,FMLY_BIRTH,RQST_RSN,RMK,PRV_SHEN_WORK_RQST_NO,CNCL_RSN
  test.skip('[no:3] 단축근무신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('단시간근무제계획관리 (gen_0520M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0520M' OR MNU_NM LIKE '단시간근무제계획관리%'
  const MENU_ID = 'TODO_gen_0520M';
  const API_URL = '/mis/gen/gen0520/getMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_APLY_YY', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_GRD_CD', 'SCH_PLAN_CREAT_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0520/getMngList.do | inputCols=SCH_APLY_YY,SCH_EMP_NO,SCH_EMP_NM,SCH_GRD_CD,SCH_PLAN_CREAT_YN
  test.skip('[no:1] 단시간근무제계획관리 - 조회 (getMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0520/getList.do | inputCols=SHEN_WORK_RQST_NO,APLY_YY,WORK_DGCNT,SEQ,EMP_NO,EMP_NM,DEPT_CD,GRD_CD,CTRCT_FRM_DT,CTRCT_TO_DT,WEEK_WORK_TIME
  test.skip('[no:2] 단시간근무제계획관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0520/setCreateData.do | inputCols=SHEN_WORK_RQST_NO,APLY_YY,WORK_DGCNT,SEQ,EMP_NO,EMP_NM,DEPT_CD,GRD_CD,CTRCT_FRM_DT,CTRCT_TO_DT,WEEK_WORK_TIME
  test.skip('[no:3] 단시간근무제계획관리 - 저장 (setCreateData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('재택근무신청목록 (gen_0610M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0610M' OR MNU_NM LIKE '재택근무신청목록%'
  const MENU_ID = 'TODO_gen_0610M';
  const API_URL = '/mis/gen/gen0610/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_WORK_FRM_DT', 'SCH_WORK_TO_DT', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'APV_STAT_CD', 'RQST_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0610/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_WORK_FRM_DT,SCH_WORK_TO_DT,DEPT_CD,DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,APV_STAT_CD,RQST_FG
  test.skip('[no:1] 재택근무신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('재택근무신청상세 (gen_0611M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0611M' OR MNU_NM LIKE '재택근무신청상세%'
  const MENU_ID = 'TODO_gen_0611M';
  const API_URL = '/mis/gen/gen0611/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['TLCM_RQST_NO', 'RQST_FG', 'RQST_DT', 'APV_STAT_CD', 'APV_STAT_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_GRD_CD', 'WORR_EMP_NO', 'WORR_EMP_NM', 'WORR_DEPT_CD', 'WORR_GRD_CD', 'WORK_FRM_DT', 'WORK_TO_DT', 'TLCM_RSN', 'TLCM_ADRES', 'PRV_TLCM_RQST_NO', 'CNCL_RSN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0611/getData.do | inputCols=TLCM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,WORK_FRM_DT,WORK_TO_DT,TLCM_RSN,TLCM_ADRES,PRV_TLCM_RQST_NO,CNCL_RSN
  test.skip('[no:1] 재택근무신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0611/getPrvData.do | inputCols=TLCM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,WORK_FRM_DT,WORK_TO_DT,TLCM_RSN,TLCM_ADRES,PRV_TLCM_RQST_NO,CNCL_RSN
  test.skip('[no:2] 재택근무신청상세 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0611/delData.do | inputCols=TLCM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,WORK_FRM_DT,WORK_TO_DT,TLCM_RSN,TLCM_ADRES,PRV_TLCM_RQST_NO,CNCL_RSN
  test.skip('[no:3] 재택근무신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('재택근무복명신청목록 (gen_0620M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0620M' OR MNU_NM LIKE '재택근무복명신청목록%'
  const MENU_ID = 'TODO_gen_0620M';
  const API_URL = '/mis/gen/gen0620/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_WORK_FRM_DT', 'SCH_WORK_TO_DT', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0620/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_WORK_FRM_DT,SCH_WORK_TO_DT,DEPT_CD,DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,APV_STAT_CD
  test.skip('[no:1] 재택근무복명신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('재택근무복명신청상세 (gen_0621M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0621M' OR MNU_NM LIKE '재택근무복명신청상세%'
  const MENU_ID = 'TODO_gen_0621M';
  const API_URL = '/mis/gen/gen0621/getSearchData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['TLCM_RPRT_RQST_NO', 'TLCM_RQST_NO', 'RQST_DT', 'APV_STAT_CD', 'APV_STAT_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_GRD_CD', 'WORR_EMP_NO', 'WORR_EMP_NM', 'WORR_DEPT_CD', 'WORR_GRD_CD', 'WORK_FRM_DT', 'WORK_TO_DT', 'TLCM_RSN', 'TLCM_ADRES'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0621/getSearchData.do | inputCols=TLCM_RPRT_RQST_NO,TLCM_RQST_NO,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,WORK_FRM_DT,WORK_TO_DT,TLCM_RSN,TLCM_ADRES
  test.skip('[no:1] 재택근무복명신청상세 - 조회 (getSearchData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0621/getData.do | inputCols=TLCM_RPRT_RQST_NO,TLCM_RQST_NO,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,WORK_FRM_DT,WORK_TO_DT,TLCM_RSN,TLCM_ADRES
  test.skip('[no:2] 재택근무복명신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0621/delData.do | inputCols=TLCM_RPRT_RQST_NO,TLCM_RQST_NO,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,WORK_FRM_DT,WORK_TO_DT,TLCM_RSN,TLCM_ADRES
  test.skip('[no:3] 재택근무복명신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('임금피크제신청목록 (gen_0710M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0710M' OR MNU_NM LIKE '임금피크제신청목록%'
  const MENU_ID = 'TODO_gen_0710M';
  const API_URL = '/mis/gen/gen0710/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['WORK_FRM_YM', 'WORK_TO_YM', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'APV_STAT_CD', 'RQST_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0710/getList.do | inputCols=WORK_FRM_YM,WORK_TO_YM,DEPT_CD,DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,APV_STAT_CD,RQST_FG
  test.skip('[no:1] 임금피크제신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('임금피크제신청 (gen_0711M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0711M' OR MNU_NM LIKE '임금피크제신청%'
  const MENU_ID = 'TODO_gen_0711M';
  const API_URL = '/mis/gen/gen0421/getAttnLvfcTm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0421/getAttnLvfcTm.do | inputCols=-
  test.skip('[no:1] 임금피크제신청 - 조회 (getAttnLvfcTm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0711/getHdayMonList.do | inputCols=SAL_PEAK_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORK_YM,SAL_PEAK_FG,SAL_PEAK_WORK_FG,WEEK_WORK_TIME,RMK,PRV_SAL_PEAK_RQST_NO,CNCL_RSN,WORR_BIRTH
  test.skip('[no:2] 임금피크제신청 - 조회 (getHdayMonList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0711/getData.do | inputCols=SAL_PEAK_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORK_YM,SAL_PEAK_FG,SAL_PEAK_WORK_FG,WEEK_WORK_TIME,RMK,PRV_SAL_PEAK_RQST_NO,CNCL_RSN,WORR_BIRTH
  test.skip('[no:3] 임금피크제신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0711/getPrvData.do | inputCols=SAL_PEAK_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORK_YM,SAL_PEAK_FG,SAL_PEAK_WORK_FG,WEEK_WORK_TIME,RMK,PRV_SAL_PEAK_RQST_NO,CNCL_RSN,WORR_BIRTH
  test.skip('[no:4] 임금피크제신청 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0711/delData.do | inputCols=SAL_PEAK_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORK_YM,SAL_PEAK_FG,SAL_PEAK_WORK_FG,WEEK_WORK_TIME,RMK,PRV_SAL_PEAK_RQST_NO,CNCL_RSN,WORR_BIRTH
  test.skip('[no:5] 임금피크제신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0711/setApvStat040.do | inputCols=SAL_PEAK_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORK_YM,SAL_PEAK_FG,SAL_PEAK_WORK_FG,WEEK_WORK_TIME,RMK,PRV_SAL_PEAK_RQST_NO,CNCL_RSN,WORR_BIRTH
  test.skip('[no:6] 임금피크제신청 - 저장 (setApvStat040) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('조기퇴근제신청목록 (gen_0810M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0810M' OR MNU_NM LIKE '조기퇴근제신청목록%'
  const MENU_ID = 'TODO_gen_0810M';
  const API_URL = '/mis/gen/gen0810/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['WORK_FRM_YM', 'WORK_TO_YM', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'APV_STAT_CD', 'RQST_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0810/getList.do | inputCols=WORK_FRM_YM,WORK_TO_YM,DEPT_CD,DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,APV_STAT_CD,RQST_FG
  test.skip('[no:1] 조기퇴근제신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('조기퇴근제 (gen_0811M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0811M' OR MNU_NM LIKE '조기퇴근제%'
  const MENU_ID = 'TODO_gen_0811M';
  const API_URL = '/mis/gen/gen0811/getMonList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['EARLY_LVFC_RQST_NO', 'RQST_FG', 'RQST_DT', 'APV_STAT_CD', 'APV_STAT_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_WORK_DGCNT', 'APNT_GRD_CD', 'WORR_EMP_NO', 'WORR_EMP_NM', 'WORR_WORK_DGCNT', 'WORR_DEPT_CD', 'WORR_GRD_CD', 'WORK_YM', 'WORK_WEEK_CHSE_NO', 'RMK', 'PRV_EARLY_LVFC_RQST_NO', 'CNCL_RSN', 'WORK_FRM_DT', 'WORK_TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0811/getMonList.do | inputCols=EARLY_LVFC_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORK_YM,WORK_WEEK_CHSE_NO,RMK,PRV_EARLY_LVFC_RQST_NO,CNCL_RSN,WORK_FRM_DT,WORK_TO_DT
  test.skip('[no:1] 조기퇴근제 - 조회 (getMonList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0811/getWeekWorkTmList.do | inputCols=WORR_EMP_NO,WORR_WORK_DGCNT,WDAY,DT,EARLY_LVFC_RQST_NO,PRV_EARLY_LVFC_RQST_NO
  test.skip('[no:2] 조기퇴근제 - 조회 (getWeekWorkTmList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0811/getData.do | inputCols=EARLY_LVFC_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORK_YM,WORK_WEEK_CHSE_NO,RMK,PRV_EARLY_LVFC_RQST_NO,CNCL_RSN,WORK_FRM_DT,WORK_TO_DT
  test.skip('[no:3] 조기퇴근제 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0811/getPrvData.do | inputCols=EARLY_LVFC_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORK_YM,WORK_WEEK_CHSE_NO,RMK,PRV_EARLY_LVFC_RQST_NO,CNCL_RSN,WORK_FRM_DT,WORK_TO_DT
  test.skip('[no:4] 조기퇴근제 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0811/delData.do | inputCols=EARLY_LVFC_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORK_YM,WORK_WEEK_CHSE_NO,RMK,PRV_EARLY_LVFC_RQST_NO,CNCL_RSN,WORK_FRM_DT,WORK_TO_DT
  test.skip('[no:5] 조기퇴근제 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0811/setApvStat040.do | inputCols=EARLY_LVFC_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORK_YM,WORK_WEEK_CHSE_NO,RMK,PRV_EARLY_LVFC_RQST_NO,CNCL_RSN,WORK_FRM_DT,WORK_TO_DT
  test.skip('[no:6] 조기퇴근제 - 저장 (setApvStat040) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('초과근무기준관리 (gen_0910M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0910M' OR MNU_NM LIKE '초과근무기준관리%'
  const MENU_ID = 'TODO_gen_0910M';
  const API_URL = '/mis/gen/gen0910/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0910/getList.do | inputCols=-
  test.skip('[no:1] 초과근무기준관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0910/setData.do | inputCols=isChecked,tmHeader,FLOC_CD
  test.skip('[no:2] 초과근무기준관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연장근무신청목록 (gen_0920M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0920M' OR MNU_NM LIKE '연장근무신청목록%'
  const MENU_ID = 'TODO_gen_0920M';
  const API_URL = '/mis/gen/gen0920/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_WORK_FRM_DT', 'SCH_WORK_TO_DT', 'APV_STAT_CD', 'RQST_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0920/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,DEPT_CD,DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_FRM_DT,SCH_WORK_TO_DT,APV_STAT_CD,RQST_FG
  test.skip('[no:1] 연장근무신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연장근무신청상세 (gen_0921M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0921M' OR MNU_NM LIKE '연장근무신청상세%'
  const MENU_ID = 'TODO_gen_0921M';
  const API_URL = '/mis/gen/gen0921/getPrvData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['OVTM_RQST_NO', 'RQST_FG', 'RQST_DT', 'APV_STAT_CD', 'APV_STAT_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_WORK_DGCNT', 'APNT_GRD_CD', 'WORR_EMP_NO', 'WORR_EMP_NM', 'WORR_WORK_DGCNT', 'WORR_DEPT_CD', 'WORR_GRD_CD', 'PRV_OVTM_RQST_NO', 'CNCL_RSN', 'OVTM_FG', 'OVTM_FRM_DT', 'OVTM_TO_DT', 'WORK_FRM_HH', 'WORK_FRM_MM', 'WORK_TO_HH', 'WORK_TO_MM', 'WORK_MIN', 'JOB_CONT', 'WORR_FLOC_CD', 'WORK_FG', 'HDAY_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0921/getPrvData.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:1] 연장근무신청상세 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0921/delData.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:2] 연장근무신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0921/getWorkTp.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:3] 연장근무신청상세 - 조회 (getWorkTp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0921/getHdayYn.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:4] 연장근무신청상세 - 조회 (getHdayYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0921/getData.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:5] 연장근무신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0921/getExclusFlocCdList.do | inputCols=-
  test.skip('[no:6] 연장근무신청상세 - 조회 (getExclusFlocCdList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('야간근무신청목록 (gen_0923M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0923M' OR MNU_NM LIKE '야간근무신청목록%'
  const MENU_ID = 'TODO_gen_0923M';
  const API_URL = '/mis/gen/gen0923/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_WORK_FRM_DT', 'SCH_WORK_TO_DT', 'SCH_APV_STAT_CD', 'RQST_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0923/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_WORK_FRM_DT,SCH_WORK_TO_DT,SCH_APV_STAT_CD,RQST_FG
  test.skip('[no:1] 야간근무신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('야간근무신청상세 (gen_0924M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0924M' OR MNU_NM LIKE '야간근무신청상세%'
  const MENU_ID = 'TODO_gen_0924M';
  const API_URL = '/mis/gen/gen0924/getPrvData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['OVTM_RQST_NO', 'RQST_FG', 'RQST_DT', 'APV_STAT_CD', 'APV_STAT_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_WORK_DGCNT', 'APNT_GRD_CD', 'WORR_EMP_NO', 'WORR_EMP_NM', 'WORR_WORK_DGCNT', 'WORR_DEPT_CD', 'WORR_GRD_CD', 'WORR_SEX_DIST', 'PRV_OVTM_RQST_NO', 'CNCL_RSN', 'OVTM_FG', 'OVTM_FRM_DT', 'OVTM_TO_DT', 'WORK_FRM_HH', 'WORK_FRM_MM', 'WORK_TO_HH', 'WORK_TO_MM', 'WORK_MIN', 'JOB_CONT', 'WORR_FLOC_CD', 'WORK_FG', 'HDAY_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0924/getPrvData.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORR_SEX_DIST,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:1] 야간근무신청상세 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0924/delData.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORR_SEX_DIST,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:2] 야간근무신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0924/getWorkTp.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORR_SEX_DIST,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:3] 야간근무신청상세 - 조회 (getWorkTp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0924/getHdayYn.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORR_SEX_DIST,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:4] 야간근무신청상세 - 조회 (getHdayYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0924/getData.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORR_SEX_DIST,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:5] 야간근무신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0924/getExclusFlocCdList.do | inputCols=-
  test.skip('[no:6] 야간근무신청상세 - 조회 (getExclusFlocCdList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('휴일근무신청목록 (gen_0926M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0926M' OR MNU_NM LIKE '휴일근무신청목록%'
  const MENU_ID = 'TODO_gen_0926M';
  const API_URL = '/mis/gen/gen0926/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_WORK_FRM_DT', 'SCH_WORK_TO_DT', 'SCH_APV_STAT_CD', 'RQST_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0926/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_FRM_DT,SCH_WORK_TO_DT,SCH_APV_STAT_CD,RQST_FG
  test.skip('[no:1] 휴일근무신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('휴일근무신청상세 (gen_0927M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0927M' OR MNU_NM LIKE '휴일근무신청상세%'
  const MENU_ID = 'TODO_gen_0927M';
  const API_URL = '/mis/gen/gen0927/getPrvData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['OVTM_RQST_NO', 'RQST_FG', 'RQST_DT', 'APV_STAT_CD', 'APV_STAT_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_WORK_DGCNT', 'APNT_GRD_CD', 'WORR_EMP_NO', 'WORR_EMP_NM', 'WORR_WORK_DGCNT', 'WORR_DEPT_CD', 'WORR_GRD_CD', 'WORR_SEX_DIST', 'PRV_OVTM_RQST_NO', 'CNCL_RSN', 'OVTM_FG', 'OVTM_FRM_DT', 'OVTM_TO_DT', 'WORK_FRM_HH', 'WORK_FRM_MM', 'WORK_TO_HH', 'WORK_TO_MM', 'WORK_MIN', 'JOB_CONT', 'WORR_FLOC_CD', 'WORK_FG', 'HDAY_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0927/getPrvData.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORR_SEX_DIST,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:1] 휴일근무신청상세 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0927/delData.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORR_SEX_DIST,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:2] 휴일근무신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0927/getData.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORR_SEX_DIST,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:3] 휴일근무신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0927/getWorkTp.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORR_SEX_DIST,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:4] 휴일근무신청상세 - 조회 (getWorkTp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0927/getHdayYn.do | inputCols=OVTM_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,WORR_SEX_DIST,PRV_OVTM_RQST_NO,CNCL_RSN,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,JOB_CONT,WORR_FLOC_CD,WORK_FG,HDAY_YN
  test.skip('[no:5] 휴일근무신청상세 - 조회 (getHdayYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0927/getExclusFlocCdList.do | inputCols=-
  test.skip('[no:6] 휴일근무신청상세 - 조회 (getExclusFlocCdList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('초과근무결과보고목록 (gen_0928M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0928M' OR MNU_NM LIKE '초과근무결과보고목록%'
  const MENU_ID = 'TODO_gen_0928M';
  const API_URL = '/mis/gen/gen0928/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_WORK_FRM_DT', 'SCH_WORK_TO_DT', 'SCH_OVTM_FG', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0928/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_FRM_DT,SCH_WORK_TO_DT,SCH_OVTM_FG,SCH_APV_STAT_CD
  test.skip('[no:1] 초과근무결과보고목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('초과근무결과보고상세 (gen_0929M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0929M' OR MNU_NM LIKE '초과근무결과보고상세%'
  const MENU_ID = 'TODO_gen_0929M';
  const API_URL = '/mis/gen/gen0929/getSearchData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['OVTM_RPOT_RQST_NO', 'OVTM_RQST_NO', 'RQST_DT', 'APV_STAT_CD', 'APV_STAT_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_GRD_CD', 'WORR_EMP_NO', 'WORR_EMP_NM', 'WORR_DEPT_CD', 'WORR_GRD_CD', 'WORK_TP', 'WORK_TP_NM', 'WORK_TP_FRM_HM', 'WORK_TP_TO_HM', 'OVTM_FG', 'OVTM_FRM_DT', 'OVTM_TO_DT', 'WORK_FRM_HH', 'WORK_FRM_MM', 'WORK_TO_HH', 'WORK_TO_MM', 'WORK_MIN', 'WORK_TIME', 'HDAY_YN', 'HDAY_NM', 'JOB_CONT', 'RPOT_CONT', 'ATTN_DT', 'ATTN_HM', 'LVFC_DT', 'LVFC_HM', 'RST_FRM_DT', 'RST_TO_DT', 'RST_FRM_HM', 'RST_TO_HM', 'TOT_ADMIT_TRGT_MIN', 'EXCC_YM', 'TOT_ADMIT_MIN', 'TOT_RWRD_MIN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen0929/delData.do | inputCols=OVTM_RPOT_RQST_NO,OVTM_RQST_NO,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,WORK_TP,WORK_TP_NM,WORK_TP_FRM_HM,WORK_TP_TO_HM,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,WORK_TIME,HDAY_YN,HDAY_NM,JOB_CONT,RPOT_CONT,ATTN_DT,ATTN_HM,LVFC_DT,LVFC_HM,RST_FRM_DT,RST_TO_DT,RST_FRM_HM,RST_TO_HM,TOT_ADMIT_TRGT_MIN,EXCC_YM,TOT_ADMIT_MIN,TOT_RWRD_MIN
  test.skip('[no:1] 초과근무결과보고상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0929/getSearchData.do | inputCols=OVTM_RPOT_RQST_NO,OVTM_RQST_NO,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,WORK_TP,WORK_TP_NM,WORK_TP_FRM_HM,WORK_TP_TO_HM,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,WORK_TIME,HDAY_YN,HDAY_NM,JOB_CONT,RPOT_CONT,ATTN_DT,ATTN_HM,LVFC_DT,LVFC_HM,RST_FRM_DT,RST_TO_DT,RST_FRM_HM,RST_TO_HM,TOT_ADMIT_TRGT_MIN,EXCC_YM,TOT_ADMIT_MIN,TOT_RWRD_MIN
  test.skip('[no:2] 초과근무결과보고상세 - 조회 (getSearchData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0929/getData.do | inputCols=OVTM_RPOT_RQST_NO,OVTM_RQST_NO,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,WORK_TP,WORK_TP_NM,WORK_TP_FRM_HM,WORK_TP_TO_HM,OVTM_FG,OVTM_FRM_DT,OVTM_TO_DT,WORK_FRM_HH,WORK_FRM_MM,WORK_TO_HH,WORK_TO_MM,WORK_MIN,WORK_TIME,HDAY_YN,HDAY_NM,JOB_CONT,RPOT_CONT,ATTN_DT,ATTN_HM,LVFC_DT,LVFC_HM,RST_FRM_DT,RST_TO_DT,RST_FRM_HM,RST_TO_HM,TOT_ADMIT_TRGT_MIN,EXCC_YM,TOT_ADMIT_MIN,TOT_RWRD_MIN
  test.skip('[no:3] 초과근무결과보고상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('초과근무(보상휴가) 정산 (gen_0930M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0930M' OR MNU_NM LIKE '초과근무(보상휴가) 정산%'
  const MENU_ID = 'TODO_gen_0930M';
  const API_URL = '/mis/gen/gen0930/getRptList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['YYYYMM', 'EMP_NO', 'DEPT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0930/getRptList.do | inputCols=YYYYMM,EMP_NO,DEPT_CD
  test.skip('[no:1] 초과근무(보상휴가) 정산 - 조회 (getRptList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0930/setConfirm.do | inputCols=SCH_YYMM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,DCSN_YN
  test.skip('[no:2] 초과근무(보상휴가) 정산 - 저장 (setConfirm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0930/setCalcData.do | inputCols=SCH_YYMM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,DCSN_YN
  test.skip('[no:3] 초과근무(보상휴가) 정산 - 저장 (setCalcData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0930/getData.do | inputCols=SCH_YYMM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,DCSN_YN
  test.skip('[no:4] 초과근무(보상휴가) 정산 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('월 근태(출퇴근) 정산 (gen_0940M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0940M' OR MNU_NM LIKE '월 근태(출퇴근) 정산%'
  const MENU_ID = 'TODO_gen_0940M';
  const API_URL = '/mis/gen/gen0940/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YYMM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'DCSN_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen0940/setConfirm.do | inputCols=SCH_YYMM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,DCSN_YN
  test.skip('[no:1] 월 근태(출퇴근) 정산 - 저장 (setConfirm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0940/setCalcData.do | inputCols=SCH_YYMM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,DCSN_YN
  test.skip('[no:2] 월 근태(출퇴근) 정산 - 저장 (setCalcData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0940/getList.do | inputCols=SCH_YYMM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,DCSN_YN
  test.skip('[no:3] 월 근태(출퇴근) 정산 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0940/setData.do | inputCols=isChecked,tmHeader,EXCC_YM,DEPT_CD,DEPT_NM,EMP_NO,EMP_NM,TOT_LGL_DUTY_TIME,TOT_LGL_CHSE_TIME,TOT_STS_DUTY_TIME,TOT_STS_CHSE_TIME,TOT_STS_TIME,REDR_YRYC_MIN,REDR_RWRD_MIN,TOT_DDCT_YRYC_TIME,TOT_DDCT_RWRD_TIME,TOT_DDCT_PAY_TIME,DCSN_YN
  test.skip('[no:4] 월 근태(출퇴근) 정산 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('출퇴근시간보충신청 (gen_0941M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0941M' OR MNU_NM LIKE '출퇴근시간보충신청%'
  const MENU_ID = 'TODO_gen_0941M';
  const API_URL = '/mis/gen/gen0511/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SHEN_WORK_RQST_NO', 'RQST_FG', 'RQST_DT', 'APV_STAT_CD', 'APV_STAT_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_WORK_DGCNT', 'APNT_GRD_CD', 'WORR_EMP_NO', 'WORR_EMP_NM', 'WORR_WORK_DGCNT', 'WORR_DEPT_CD', 'WORR_GRD_CD', 'SHEN_WORK_FG', 'WORK_FRM_DT', 'WORK_TO_DT', 'PRGN_FG', 'FMLY_SUPT_FG', 'FMLY_NM', 'FMLY_BIRTH', 'RQST_RSN', 'RMK', 'PRV_SHEN_WORK_RQST_NO', 'CNCL_RSN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0511/getData.do | inputCols=SHEN_WORK_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,SHEN_WORK_FG,WORK_FRM_DT,WORK_TO_DT,PRGN_FG,FMLY_SUPT_FG,FMLY_NM,FMLY_BIRTH,RQST_RSN,RMK,PRV_SHEN_WORK_RQST_NO,CNCL_RSN
  test.skip('[no:1] 출퇴근시간보충신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0511/getPrvData.do | inputCols=SHEN_WORK_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,SHEN_WORK_FG,WORK_FRM_DT,WORK_TO_DT,PRGN_FG,FMLY_SUPT_FG,FMLY_NM,FMLY_BIRTH,RQST_RSN,RMK,PRV_SHEN_WORK_RQST_NO,CNCL_RSN
  test.skip('[no:2] 출퇴근시간보충신청 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0511/delData.do | inputCols=SHEN_WORK_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,SHEN_WORK_FG,WORK_FRM_DT,WORK_TO_DT,PRGN_FG,FMLY_SUPT_FG,FMLY_NM,FMLY_BIRTH,RQST_RSN,RMK,PRV_SHEN_WORK_RQST_NO,CNCL_RSN
  test.skip('[no:3] 출퇴근시간보충신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0511/setApvStat040.do | inputCols=SHEN_WORK_RQST_NO,RQST_FG,RQST_DT,APV_STAT_CD,APV_STAT_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_GRD_CD,WORR_EMP_NO,WORR_EMP_NM,WORR_WORK_DGCNT,WORR_DEPT_CD,WORR_GRD_CD,SHEN_WORK_FG,WORK_FRM_DT,WORK_TO_DT,PRGN_FG,FMLY_SUPT_FG,FMLY_NM,FMLY_BIRTH,RQST_RSN,RMK,PRV_SHEN_WORK_RQST_NO,CNCL_RSN
  test.skip('[no:4] 출퇴근시간보충신청 - 저장 (setApvStat040) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('출퇴근현황/근태현황 (gen_0950M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0950M' OR MNU_NM LIKE '출퇴근현황/근태현황%'
  const MENU_ID = 'TODO_gen_0950M';
  const API_URL = '/mis/gen/gen0950/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DCLZ_FG_CD', 'SCH_HLDF_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0950/getList.do | inputCols=SCH_FRM_DT,SCH_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_DCLZ_FG_CD,SCH_HLDF_FG_CD
  test.skip('[no:1] 출퇴근현황/근태현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0950/setDclzSendMail.do | inputCols=-
  test.skip('[no:2] 출퇴근현황/근태현황 - 저장 (aaaa) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('출퇴근기록조정 (gen_0951M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0951M' OR MNU_NM LIKE '출퇴근기록조정%'
  const MENU_ID = 'TODO_gen_0951M';
  const API_URL = '/mis/gen/gen0950/getAttnLvfcList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['EMP_NO', 'EMP_NM', 'DT', 'ADMIT_ATTN_DE', 'ADMIT_LVFC_DE', 'DCLZ_FG_CD', 'MDAT_RSN', 'ATTN_RCED_FG_CD', 'LVFC_RCED_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0950/getAttnLvfcList.do | inputCols=EMP_NO,EMP_NM,DT,ADMIT_ATTN_DE,ADMIT_LVFC_DE,DCLZ_FG_CD,MDAT_RSN,ATTN_RCED_FG_CD,LVFC_RCED_FG_CD
  test.skip('[no:1] 출퇴근기록조정 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0950/setData.do | inputCols=EMP_NO,EMP_NM,DT,ADMIT_ATTN_DE,ADMIT_LVFC_DE,DCLZ_FG_CD,MDAT_RSN,ATTN_RCED_FG_CD,LVFC_RCED_FG_CD
  test.skip('[no:2] 출퇴근기록조정 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('출퇴근기록정정신청목록 (gen_0960M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0960M' OR MNU_NM LIKE '출퇴근기록정정신청목록%'
  const MENU_ID = 'TODO_gen_0960M';
  const API_URL = '/mis/gen/gen0960/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_MDAT_FRM_DT', 'SCH_MDAT_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0960/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_MDAT_FRM_DT,SCH_MDAT_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_APV_STAT_CD
  test.skip('[no:1] 출퇴근기록정정신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('출퇴근기록정정신청상세 (gen_0961M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0961M' OR MNU_NM LIKE '출퇴근기록정정신청상세%'
  const MENU_ID = 'TODO_gen_0961M';
  const API_URL = '/mis/gen/gen0961/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['MDAT_RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'APNT_GRD_NM', 'WORR_EMP_NO', 'WORR_EMP_NM', 'WORR_DEPT_CD', 'WORR_GRD_CD', 'MDAT_DT', 'MDAT_RSN', 'APV_STAT_CD', 'APV_STAT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0961/getData.do | inputCols=MDAT_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,MDAT_DT,MDAT_RSN,APV_STAT_CD,APV_STAT_NM
  test.skip('[no:1] 출퇴근기록정정신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0961/delData.do | inputCols=MDAT_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,MDAT_DT,MDAT_RSN,APV_STAT_CD,APV_STAT_NM
  test.skip('[no:2] 출퇴근기록정정신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0961/getAdmitTm.do | inputCols=MDAT_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,WORR_EMP_NO,WORR_EMP_NM,WORR_DEPT_CD,WORR_GRD_CD,MDAT_DT,MDAT_RSN,APV_STAT_CD,APV_STAT_NM
  test.skip('[no:3] 출퇴근기록정정신청상세 - 조회 (getAdmitTm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('출퇴근기록일괄조정 (gen_0970M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0970M' OR MNU_NM LIKE '출퇴근기록일괄조정%'
  const MENU_ID = 'TODO_gen_0970M';
  const API_URL = '/mis/gen/gen0970/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_MDAT_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_APLY_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0970/getList.do | inputCols=SCH_MDAT_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_APLY_YN
  test.skip('[no:1] 출퇴근기록일괄조정 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0970/setData.do | inputCols=tmHeader,BNDE_RQST_NO,MDAT_DT,MDAT_FG,CREAT_EMP_NO,CREAT_EMP_NM,DEPT_CD,DEPT_NM,EMP_NO,EMP_NM,WORK_FG,WORK_FG_NM,WORK_FRM_HM,WORK_TO_HM,ATTN_HM,LVFC_HM,MDAT_FRM_HM,MDAT_TO_HM,MDAT_RSN,APLY_YN
  test.skip('[no:2] 출퇴근기록일괄조정 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0970/setConfirm.do | inputCols=tmHeader,BNDE_RQST_NO,MDAT_DT,MDAT_FG,CREAT_EMP_NO,CREAT_EMP_NM,DEPT_CD,DEPT_NM,EMP_NO,EMP_NM,WORK_FG,WORK_FG_NM,WORK_FRM_HM,WORK_TO_HM,ATTN_HM,LVFC_HM,MDAT_FRM_HM,MDAT_TO_HM,MDAT_RSN,APLY_YN
  test.skip('[no:3] 출퇴근기록일괄조정 - 저장 (setConfirm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('출퇴근기록일괄조정 (gen_0971M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_0971M' OR MNU_NM LIKE '출퇴근기록일괄조정%'
  const MENU_ID = 'TODO_gen_0971M';
  const API_URL = '/mis/gen/gen0970/setData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen0970/setData.do | inputCols=tmHeader,MDAT_DT,MDAT_FG,DEPT_CD,DEPT_NM,EMP_NO,EMP_NM,WORK_FG,WORK_FG_NM,WORK_FRM_HM,WORK_TO_HM,ATTN_HM,LVFC_HM,MDAT_FRM_HM,MDAT_TO_HM,MDAT_RSN,APLY_YN
  test.skip('[no:1] 출퇴근기록일괄조정 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0970/setConfirm.do | inputCols=MDAT_DT,MDAT_FG,CREAT_EMP_NO,CREAT_EMP_NM,CREAT_DE,CREAT_DT,DCSN_EMP_NO,DCSN_EMP_NM,DCSN_DE,DCSN_DT,DCSN_YN
  test.skip('[no:2] 출퇴근기록일괄조정 - 저장 (setConfirm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0970/delData.do | inputCols=MDAT_DT,MDAT_FG,CREAT_EMP_NO,CREAT_EMP_NM,CREAT_DE,CREAT_DT,DCSN_EMP_NO,DCSN_EMP_NM,DCSN_DE,DCSN_DT,DCSN_YN
  test.skip('[no:3] 출퇴근기록일괄조정 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0970/getBndeList.do | inputCols=MDAT_DT,MDAT_FG
  test.skip('[no:4] 출퇴근기록일괄조정 - 삭제 (getBndeList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연비기준관리 (gen_1011M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1011M' OR MNU_NM LIKE '연비기준관리%'
  const MENU_ID = 'TODO_gen_1011M';
  const API_URL = '/mis/gen/gen1011/getMaxYymm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1011/getMaxYymm.do | inputCols=-
  test.skip('[no:1] 연비기준관리 - 조회 (getMaxYymm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1011/getData.do | inputCols=SCH_APP_DT
  test.skip('[no:2] 연비기준관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen1011/setData.do | inputCols=SCH_APP_DT
  test.skip('[no:3] 연비기준관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('유가현황 (gen_1012M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1012M' OR MNU_NM LIKE '유가현황%'
  const MENU_ID = 'TODO_gen_1012M';
  const API_URL = '/mis/gen/gen1012/getAvgAllPriceList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_FUEL_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1012/getAvgAllPriceList.do | inputCols=SCH_FRM_DT,SCH_TO_DT,SCH_FUEL_CD
  test.skip('[no:1] 유가현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/opinet/uptAvgAllPriceList.do | inputCols=-
  test.skip('[no:2] 유가현황 - 조회 (uptAvgAllPriceList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기타요금기준 (gen_1013M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1013M' OR MNU_NM LIKE '기타요금기준%'
  const MENU_ID = 'TODO_gen_1013M';
  const API_URL = '/mis/gen/gen1013/getMaxYymm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1013/getMaxYymm.do | inputCols=-
  test.skip('[no:1] 기타요금기준 - 조회 (getMaxYymm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1013/getData.do | inputCols=SCH_APP_DT
  test.skip('[no:2] 기타요금기준 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen1013/setData.do | inputCols=SCH_APP_DT
  test.skip('[no:3] 기타요금기준 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국내출장철도요금관리 (gen_1020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1020M' OR MNU_NM LIKE '국내출장철도요금관리%'
  const MENU_ID = 'TODO_gen_1020M';
  const API_URL = '/mis/gen/gen1020/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STD_DT', 'SCH_RLAD_FG', 'SCH_STR_PLC_NM', 'SCH_ARR_PLC_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen1020/setData.do | inputCols=STD_DT,STR_SCT_CD,ARR_SCT_CD,SCT_CD,RLAD_FG,STR_PLC_NM,ARR_PLC_NM,GNRL_CHGE,SPCL_CHGE,GNRL_CHGE_WKND,SPCL_CHGE_WKND,RLAD_NM
  test.skip('[no:1] 국내출장철도요금관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1020/getList.do | inputCols=SCH_STD_DT,SCH_RLAD_FG,SCH_STR_PLC_NM,SCH_ARR_PLC_NM
  test.skip('[no:2] 국내출장철도요금관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국외출장지역코드관리 (gen_1030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1030M' OR MNU_NM LIKE '국외출장지역코드관리%'
  const MENU_ID = 'TODO_gen_1030M';
  const API_URL = '/mis/gen/gen1030/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen1030/setSave.do | inputCols=isChecked,tmHeader,NTN_CD,NTN_CTY_NM,CNTT_FG,AREA_GRADE_FG,RMK,USE_YN,INS_YN
  test.skip('[no:1] 국외출장지역코드관리 - 저장 (setSave) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1030/getList.do | inputCols=-
  test.skip('[no:2] 국외출장지역코드관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국내출장신청 목록 (gen_1210M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1210M' OR MNU_NM LIKE '국내출장신청 목록%'
  const MENU_ID = 'TODO_gen_1210M';
  const API_URL = '/mis/gen/gen1210/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_APNT_FRM_DT', 'SCH_APNT_TO_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_TRP_FRM_DT', 'SCH_TRP_TO_DT', 'SCH_RQST_FG', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1210/getList.do | inputCols=SCH_APNT_FRM_DT,SCH_APNT_TO_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_TRP_FRM_DT,SCH_TRP_TO_DT,SCH_RQST_FG,SCH_APV_STAT_CD
  test.skip('[no:1] 국내출장신청 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국내출장신청 상세 (gen_1211M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1211M' OR MNU_NM LIKE '국내출장신청 상세%'
  const MENU_ID = 'TODO_gen_1211M';
  const API_URL = '/mis/gen/gen1211/getAccInfoMulti.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['EMP_NO', 'PMT_BK_CD', 'PMT_BK_NM', 'ACC_NO', 'CAR_SBSD_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1211/getAccInfoMulti.do | inputCols=EMP_NO,PMT_BK_CD,PMT_BK_NM,ACC_NO,CAR_SBSD_YN
  test.skip('[no:1] 국내출장신청 상세 - 조회 (getAccInfoMulti) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1211/getAccInfo.do | inputCols=EMP_NO,PMT_BK_CD,PMT_BK_NM,ACC_NO,CAR_SBSD_YN
  test.skip('[no:2] 국내출장신청 상세 - 조회 (getAccInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1211/getTrpDomsPreData.do | inputCols=TRP_RQST_NO,RQST_FG,RQST_DT,CTRL_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,PRV_RQST_NO,CNCL_RSN,TRP_FG,TRP_FG_DTL,TRP_FRM_DT,TRP_TO_DT,TRP_DAYS,TRP_TERMS,TRP_FRM_HM,TRP_TO_HM,TRP_TIME,TRP_PPS,RMK,AUPC_SPRT_YN,LCTE_YN,PSIS_CAR_USE_RSN_FG,DAY_EXP,FOOD_EXP,LODG_EXP,TRF_GRADE,CAR_SBSD_YN,TRP_TOT_AMT,PRV_RQST_DT
  test.skip('[no:3] 국내출장신청 상세 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen1211/delData.do | inputCols=TRP_RQST_NO,RQST_FG,RQST_DT,CTRL_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,PRV_RQST_NO,CNCL_RSN,TRP_FG,TRP_FG_DTL,TRP_FRM_DT,TRP_TO_DT,TRP_DAYS,TRP_TERMS,TRP_FRM_HM,TRP_TO_HM,TRP_TIME,TRP_PPS,RMK,AUPC_SPRT_YN,LCTE_YN,PSIS_CAR_USE_RSN_FG,DAY_EXP,FOOD_EXP,LODG_EXP,TRF_GRADE,CAR_SBSD_YN,TRP_TOT_AMT,PRV_RQST_DT
  test.skip('[no:4] 국내출장신청 상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1211/getOilPric.do | inputCols=TRP_RQST_NO,RQST_FG,RQST_DT,CTRL_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,PRV_RQST_NO,CNCL_RSN,TRP_FG,TRP_FG_DTL,TRP_FRM_DT,TRP_TO_DT,TRP_DAYS,TRP_TERMS,TRP_FRM_HM,TRP_TO_HM,TRP_TIME,TRP_PPS,RMK,AUPC_SPRT_YN,LCTE_YN,PSIS_CAR_USE_RSN_FG,DAY_EXP,FOOD_EXP,LODG_EXP,TRF_GRADE,CAR_SBSD_YN,TRP_TOT_AMT,PRV_RQST_DT
  test.skip('[no:5] 국내출장신청 상세 - 조회 (getOilPric) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1211/getTrpDomsData.do | inputCols=TRP_RQST_NO,RQST_FG,RQST_DT,CTRL_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,PRV_RQST_NO,CNCL_RSN,TRP_FG,TRP_FG_DTL,TRP_FRM_DT,TRP_TO_DT,TRP_DAYS,TRP_TERMS,TRP_FRM_HM,TRP_TO_HM,TRP_TIME,TRP_PPS,RMK,AUPC_SPRT_YN,LCTE_YN,PSIS_CAR_USE_RSN_FG,DAY_EXP,FOOD_EXP,LODG_EXP,TRF_GRADE,CAR_SBSD_YN,TRP_TOT_AMT,PRV_RQST_DT
  test.skip('[no:6] 국내출장신청 상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1221/getTrpExpMng.do | inputCols=-
  test.skip('[no:7] 국내출장신청 상세 - 조회 (getTrpExpMng) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1211/getComboMulti.do | inputCols=-
  test.skip('[no:8] 국내출장신청 상세 - 조회 (getComboMulti) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국내출장보고 목록 (gen_1220M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1220M' OR MNU_NM LIKE '국내출장보고 목록%'
  const MENU_ID = 'TODO_gen_1220M';
  const API_URL = '/mis/gen/gen1220/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_TRP_FRM_DT', 'SCH_TRP_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_RQST_FG', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1220/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_TRP_FRM_DT,SCH_TRP_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_RQST_FG,SCH_APV_STAT_CD
  test.skip('[no:1] 국내출장보고 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국내출장보고 상세 (gen_1221M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1221M' OR MNU_NM LIKE '국내출장보고 상세%'
  const MENU_ID = 'TODO_gen_1221M';
  const API_URL = '/mis/gen/gen1221/getOilPric.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['TRP_EXCC_RQST_NO', 'RQST_DT', 'SLIP_NO', 'APV_STAT_CD', 'APV_STAT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'TRP_RQST_NO', 'TRP_RQST_DT', 'TRP_APNT_EMP_NO', 'TRP_APNT_EMP_NM', 'TRP_FG', 'TRP_FG_DTL', 'TRP_FRM_DT', 'TRP_TO_DT', 'TRP_LODG', 'TRP_DAY', 'TRP_DAYS', 'TRP_FRM_HM', 'TRP_TO_HM', 'TRP_TIME', 'TRP_TOT_AMT', 'EXCC_TRP_TOT_AMT', 'AUPC_SPRT_YN', 'LCTE_YN', 'CNCD_TRP_YN', 'LODG_INCR_YN', 'LODG_SPRT_YN', 'SMS_DSTH_YN', 'CAR_USE_YN', 'TRP_PPS', 'PSIS_CAR_USE_RSN_FG', 'RMK', 'TRP_CONT', 'DRCT_CONT', 'MGT_CONT', 'CNTC_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1221/getOilPric.do | inputCols=TRP_EXCC_RQST_NO,RQST_DT,SLIP_NO,APV_STAT_CD,APV_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,TRP_RQST_NO,TRP_RQST_DT,TRP_APNT_EMP_NO,TRP_APNT_EMP_NM,TRP_FG,TRP_FG_DTL,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_FRM_HM,TRP_TO_HM,TRP_TIME,TRP_TOT_AMT,EXCC_TRP_TOT_AMT,AUPC_SPRT_YN,LCTE_YN,CNCD_TRP_YN,LODG_INCR_YN,LODG_SPRT_YN,SMS_DSTH_YN,CAR_USE_YN,TRP_PPS,PSIS_CAR_USE_RSN_FG,RMK,TRP_CONT,DRCT_CONT,MGT_CONT,CNTC_NO
  test.skip('[no:1] 국내출장보고 상세 - 조회 (getOilPric) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen1221/delTrpExccRqst.do | inputCols=TRP_EXCC_RQST_NO,RQST_DT,SLIP_NO,APV_STAT_CD,APV_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,TRP_RQST_NO,TRP_RQST_DT,TRP_APNT_EMP_NO,TRP_APNT_EMP_NM,TRP_FG,TRP_FG_DTL,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_FRM_HM,TRP_TO_HM,TRP_TIME,TRP_TOT_AMT,EXCC_TRP_TOT_AMT,AUPC_SPRT_YN,LCTE_YN,CNCD_TRP_YN,LODG_INCR_YN,LODG_SPRT_YN,SMS_DSTH_YN,CAR_USE_YN,TRP_PPS,PSIS_CAR_USE_RSN_FG,RMK,TRP_CONT,DRCT_CONT,MGT_CONT,CNTC_NO
  test.skip('[no:2] 국내출장보고 상세 - 삭제 (delTrpExccRqst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1221/getTrpExccMainData.do | inputCols=TRP_EXCC_RQST_NO,RQST_DT,SLIP_NO,APV_STAT_CD,APV_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,TRP_RQST_NO,TRP_RQST_DT,TRP_APNT_EMP_NO,TRP_APNT_EMP_NM,TRP_FG,TRP_FG_DTL,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_FRM_HM,TRP_TO_HM,TRP_TIME,TRP_TOT_AMT,EXCC_TRP_TOT_AMT,AUPC_SPRT_YN,LCTE_YN,CNCD_TRP_YN,LODG_INCR_YN,LODG_SPRT_YN,SMS_DSTH_YN,CAR_USE_YN,TRP_PPS,PSIS_CAR_USE_RSN_FG,RMK,TRP_CONT,DRCT_CONT,MGT_CONT,CNTC_NO
  test.skip('[no:3] 국내출장보고 상세 - 조회 (getTrpExccMainData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1221/getTrpRqstMainData.do | inputCols=TRP_EXCC_RQST_NO,RQST_DT,SLIP_NO,APV_STAT_CD,APV_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,TRP_RQST_NO,TRP_RQST_DT,TRP_APNT_EMP_NO,TRP_APNT_EMP_NM,TRP_FG,TRP_FG_DTL,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_FRM_HM,TRP_TO_HM,TRP_TIME,TRP_TOT_AMT,EXCC_TRP_TOT_AMT,AUPC_SPRT_YN,LCTE_YN,CNCD_TRP_YN,LODG_INCR_YN,LODG_SPRT_YN,SMS_DSTH_YN,CAR_USE_YN,TRP_PPS,PSIS_CAR_USE_RSN_FG,RMK,TRP_CONT,DRCT_CONT,MGT_CONT,CNTC_NO
  test.skip('[no:4] 국내출장보고 상세 - 조회 (getTrpRqstMainData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1221/getTrpExpMng.do | inputCols=-
  test.skip('[no:5] 국내출장보고 상세 - 조회 (getTrpExpMng) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1221/getComboMulti.do | inputCols=-
  test.skip('[no:6] 국내출장보고 상세 - 조회 (getComboMulti) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('외부강의신고서목록 (gen_1330M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1330M' OR MNU_NM LIKE '외부강의신고서목록%'
  const MENU_ID = 'TODO_gen_1330M';
  const API_URL = '/mis/gen/gen1330/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_APV_STAT_CD', 'SCH_RQST_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1330/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_APV_STAT_CD,SCH_RQST_FG
  test.skip('[no:1] 외부강의신고서목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('외부강의신고서 (gen_1331M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1331M' OR MNU_NM LIKE '외부강의신고서%'
  const MENU_ID = 'TODO_gen_1331M';
  const API_URL = '/mis/gen/gen1331/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['EXT_LCTE_RQST_NO', 'RQST_DT', 'RQST_FG', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APPA_DEPT_CD', 'APPA_DEPT_NM', 'APNT_WORK_DGCNT', 'APNT_GRD_CD', 'APNT_GRD_NM', 'PRV_EXT_LCTE_RQST_NO', 'APPA_EMP_NO', 'APPA_EMP_NM', 'APPA_GRD_CD', 'APPA_WORK_DGCNT', 'EXT_LCTE_TP_CD', 'EXT_LCTE_TP_DTL_CONT', 'ACTV_TP', 'ACTV_TP_DTL_CONT', 'DMND_ORGAN_NM', 'DMND_ORGAN_REPRES_NM', 'DMND_ORGAN_DEPT_NM', 'DMND_ORGAN_CTTPC', 'DMND_RSN', 'EXT_LCTE_PLC', 'EXT_LCTE_FRM_DT', 'EXT_LCTE_FRM_H', 'EXT_LCTE_FRM_M', 'EXT_LCTE_TO_DT', 'EXT_LCTE_TO_H', 'EXT_LCTE_TO_M', 'MM_YY_AVG_HCNT', 'OTM_AVG_TIME', 'CPNS_TOT_AMT', 'CPNS_OTM_AVG_AMT', 'CPNS_TRF_EXP', 'CPNS_MNSCRTFE', 'CPNS_MTRL_EXP', 'APV_STAT_CD', 'APV_STAT_NM', 'CNCL_RSN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1331/getData.do | inputCols=EXT_LCTE_RQST_NO,RQST_DT,RQST_FG,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APPA_DEPT_CD,APPA_DEPT_NM,APNT_WORK_DGCNT,APNT_GRD_CD,APNT_GRD_NM,PRV_EXT_LCTE_RQST_NO,APPA_EMP_NO,APPA_EMP_NM,APPA_GRD_CD,APPA_WORK_DGCNT,EXT_LCTE_TP_CD,EXT_LCTE_TP_DTL_CONT,ACTV_TP,ACTV_TP_DTL_CONT,DMND_ORGAN_NM,DMND_ORGAN_REPRES_NM,DMND_ORGAN_DEPT_NM,DMND_ORGAN_CTTPC,DMND_RSN,EXT_LCTE_PLC,EXT_LCTE_FRM_DT,EXT_LCTE_FRM_H,EXT_LCTE_FRM_M,EXT_LCTE_TO_DT,EXT_LCTE_TO_H,EXT_LCTE_TO_M,MM_YY_AVG_HCNT,OTM_AVG_TIME,CPNS_TOT_AMT,CPNS_OTM_AVG_AMT,CPNS_TRF_EXP,CPNS_MNSCRTFE,CPNS_MTRL_EXP,APV_STAT_CD,APV_STAT_NM,CNCL_RSN
  test.skip('[no:1] 외부강의신고서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1331/getPrvData.do | inputCols=EXT_LCTE_RQST_NO,RQST_DT,RQST_FG,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APPA_DEPT_CD,APPA_DEPT_NM,APNT_WORK_DGCNT,APNT_GRD_CD,APNT_GRD_NM,PRV_EXT_LCTE_RQST_NO,APPA_EMP_NO,APPA_EMP_NM,APPA_GRD_CD,APPA_WORK_DGCNT,EXT_LCTE_TP_CD,EXT_LCTE_TP_DTL_CONT,ACTV_TP,ACTV_TP_DTL_CONT,DMND_ORGAN_NM,DMND_ORGAN_REPRES_NM,DMND_ORGAN_DEPT_NM,DMND_ORGAN_CTTPC,DMND_RSN,EXT_LCTE_PLC,EXT_LCTE_FRM_DT,EXT_LCTE_FRM_H,EXT_LCTE_FRM_M,EXT_LCTE_TO_DT,EXT_LCTE_TO_H,EXT_LCTE_TO_M,MM_YY_AVG_HCNT,OTM_AVG_TIME,CPNS_TOT_AMT,CPNS_OTM_AVG_AMT,CPNS_TRF_EXP,CPNS_MNSCRTFE,CPNS_MTRL_EXP,APV_STAT_CD,APV_STAT_NM,CNCL_RSN
  test.skip('[no:2] 외부강의신고서 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen1331/delData.do | inputCols=EXT_LCTE_RQST_NO,RQST_DT,RQST_FG,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APPA_DEPT_CD,APPA_DEPT_NM,APNT_WORK_DGCNT,APNT_GRD_CD,APNT_GRD_NM,PRV_EXT_LCTE_RQST_NO,APPA_EMP_NO,APPA_EMP_NM,APPA_GRD_CD,APPA_WORK_DGCNT,EXT_LCTE_TP_CD,EXT_LCTE_TP_DTL_CONT,ACTV_TP,ACTV_TP_DTL_CONT,DMND_ORGAN_NM,DMND_ORGAN_REPRES_NM,DMND_ORGAN_DEPT_NM,DMND_ORGAN_CTTPC,DMND_RSN,EXT_LCTE_PLC,EXT_LCTE_FRM_DT,EXT_LCTE_FRM_H,EXT_LCTE_FRM_M,EXT_LCTE_TO_DT,EXT_LCTE_TO_H,EXT_LCTE_TO_M,MM_YY_AVG_HCNT,OTM_AVG_TIME,CPNS_TOT_AMT,CPNS_OTM_AVG_AMT,CPNS_TRF_EXP,CPNS_MNSCRTFE,CPNS_MTRL_EXP,APV_STAT_CD,APV_STAT_NM,CNCL_RSN
  test.skip('[no:3] 외부강의신고서 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen1331/setApvStat040.do | inputCols=EXT_LCTE_RQST_NO,RQST_DT,RQST_FG,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APPA_DEPT_CD,APPA_DEPT_NM,APNT_WORK_DGCNT,APNT_GRD_CD,APNT_GRD_NM,PRV_EXT_LCTE_RQST_NO,APPA_EMP_NO,APPA_EMP_NM,APPA_GRD_CD,APPA_WORK_DGCNT,EXT_LCTE_TP_CD,EXT_LCTE_TP_DTL_CONT,ACTV_TP,ACTV_TP_DTL_CONT,DMND_ORGAN_NM,DMND_ORGAN_REPRES_NM,DMND_ORGAN_DEPT_NM,DMND_ORGAN_CTTPC,DMND_RSN,EXT_LCTE_PLC,EXT_LCTE_FRM_DT,EXT_LCTE_FRM_H,EXT_LCTE_FRM_M,EXT_LCTE_TO_DT,EXT_LCTE_TO_H,EXT_LCTE_TO_M,MM_YY_AVG_HCNT,OTM_AVG_TIME,CPNS_TOT_AMT,CPNS_OTM_AVG_AMT,CPNS_TRF_EXP,CPNS_MNSCRTFE,CPNS_MTRL_EXP,APV_STAT_CD,APV_STAT_NM,CNCL_RSN
  test.skip('[no:4] 외부강의신고서 - 저장 (setApvStat040) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국외출장사전심의신청 목록 (gen_1500M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1500M' OR MNU_NM LIKE '국외출장사전심의신청 목록%'
  const MENU_ID = 'TODO_gen_1500M';
  const API_URL = '/mis/gen/gen1500/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_TRP_FRM_DT', 'SCH_TRP_TO_DT', 'SCH_TRP_FG', 'SCH_RQST_STAT_CD', 'SCH_EXP_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1500/getData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_TRP_FRM_DT,SCH_TRP_TO_DT,SCH_TRP_FG,SCH_RQST_STAT_CD,SCH_EXP_YN
  test.skip('[no:1] 국외출장사전심의신청 목록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국외출장사전심의신청 상세 (gen_1501M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1501M' OR MNU_NM LIKE '국외출장사전심의신청 상세%'
  const MENU_ID = 'TODO_gen_1501M';
  const API_URL = '/mis/gen/gen1501/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['TRP_DLBRT_RQST_NO', 'RQST_DT', 'RQST_STAT_CD', 'RQST_STAT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'APV_STAT_CD', 'APV_STAT_NM', 'DLBRT_FG', 'DLBRT_DGCNT', 'TRP_FG', 'ETC_TRP_FG', 'NTN_CD', 'NTN_CTY_NM', 'VIST_CTY', 'AUPC_SPRT_YN', 'FNRS_CNLN', 'BUDG_REFI_YN', 'TRP_FRM_DT', 'TRP_TO_DT', 'TRP_LODG', 'TRP_DAY', 'TRP_DAYS', 'TRP_PPS', 'RMK'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen1501/delData.do | inputCols=TRP_DLBRT_RQST_NO,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APV_STAT_CD,APV_STAT_NM,DLBRT_FG,DLBRT_DGCNT,TRP_FG,ETC_TRP_FG,NTN_CD,NTN_CTY_NM,VIST_CTY,AUPC_SPRT_YN,FNRS_CNLN,BUDG_REFI_YN,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_PPS,RMK
  test.skip('[no:1] 국외출장사전심의신청 상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1501/getData.do | inputCols=TRP_DLBRT_RQST_NO,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APV_STAT_CD,APV_STAT_NM,DLBRT_FG,DLBRT_DGCNT,TRP_FG,ETC_TRP_FG,NTN_CD,NTN_CTY_NM,VIST_CTY,AUPC_SPRT_YN,FNRS_CNLN,BUDG_REFI_YN,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_PPS,RMK
  test.skip('[no:2] 국외출장사전심의신청 상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen1501/setRegData.do | inputCols=TRP_DLBRT_RQST_NO,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APV_STAT_CD,APV_STAT_NM,DLBRT_FG,DLBRT_DGCNT,TRP_FG,ETC_TRP_FG,NTN_CD,NTN_CTY_NM,VIST_CTY,AUPC_SPRT_YN,FNRS_CNLN,BUDG_REFI_YN,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_PPS,RMK
  test.skip('[no:3] 국외출장사전심의신청 상세 - 저장 (setRegData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국외출장계획등록 상세 (gen_1502M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1502M' OR MNU_NM LIKE '국외출장계획등록 상세%'
  const MENU_ID = 'TODO_gen_1502M';
  const API_URL = '/mis/gen/gen1502/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['TRP_DLBRT_RQST_NO', 'RQST_DT', 'RQST_STAT_CD', 'RQST_STAT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'APV_STAT_CD', 'APV_STAT_NM', 'DLBRT_FG', 'DLBRT_DGCNT', 'TRP_FG', 'ETC_TRP_FG', 'NTN_CD', 'NTN_CTY_NM', 'VIST_CTY', 'AUPC_SPRT_YN', 'FNRS_CNLN', 'BUDG_REFI_YN', 'TRP_FRM_DT', 'TRP_TO_DT', 'TRP_LODG', 'TRP_DAY', 'TRP_DAYS', 'TRP_PPS', 'RMK', 'TRP_EXP_RSN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen1502/delData.do | inputCols=TRP_DLBRT_RQST_NO,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APV_STAT_CD,APV_STAT_NM,DLBRT_FG,DLBRT_DGCNT,TRP_FG,ETC_TRP_FG,NTN_CD,NTN_CTY_NM,VIST_CTY,AUPC_SPRT_YN,FNRS_CNLN,BUDG_REFI_YN,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_PPS,RMK,TRP_EXP_RSN
  test.skip('[no:1] 국외출장계획등록 상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1502/getData.do | inputCols=TRP_DLBRT_RQST_NO,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APV_STAT_CD,APV_STAT_NM,DLBRT_FG,DLBRT_DGCNT,TRP_FG,ETC_TRP_FG,NTN_CD,NTN_CTY_NM,VIST_CTY,AUPC_SPRT_YN,FNRS_CNLN,BUDG_REFI_YN,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_PPS,RMK,TRP_EXP_RSN
  test.skip('[no:2] 국외출장계획등록 상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1502/getData2.do | inputCols=TRP_DLBRT_RQST_NO,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APV_STAT_CD,APV_STAT_NM,DLBRT_FG,DLBRT_DGCNT,TRP_FG,ETC_TRP_FG,NTN_CD,NTN_CTY_NM,VIST_CTY,AUPC_SPRT_YN,FNRS_CNLN,BUDG_REFI_YN,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_PPS,RMK,TRP_EXP_RSN
  test.skip('[no:3] 국외출장계획등록 상세 - 조회 (getData2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen1502/setRegData.do | inputCols=TRP_DLBRT_RQST_NO,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APV_STAT_CD,APV_STAT_NM,DLBRT_FG,DLBRT_DGCNT,TRP_FG,ETC_TRP_FG,NTN_CD,NTN_CTY_NM,VIST_CTY,AUPC_SPRT_YN,FNRS_CNLN,BUDG_REFI_YN,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_PPS,RMK,TRP_EXP_RSN
  test.skip('[no:4] 국외출장계획등록 상세 - 저장 (setRegData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국외출장사전심의승인관리 (gen_1505M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1505M' OR MNU_NM LIKE '국외출장사전심의승인관리%'
  const MENU_ID = 'TODO_gen_1505M';
  const API_URL = '/mis/gen/gen1505/setRqstStatCd.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['isChecked', 'tmHeader', 'TRP_DLBRT_RQST_NO', 'DLBRT_DGCNT', 'RQST_DT', 'RQST_STAT_CD', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'TRP_FG', 'TRP_TOT_AMT_WON', 'TRP_TOT_AMT_USD', 'TRER_EMP_NM', 'TRP_FRM_DT', 'TRP_TO_DT', 'TRP_PPS', 'DLBRT_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1505/setRqstStatCd.do | inputCols=isChecked,tmHeader,TRP_DLBRT_RQST_NO,DLBRT_DGCNT,RQST_DT,RQST_STAT_CD,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,TRP_FG,TRP_TOT_AMT_WON,TRP_TOT_AMT_USD,TRER_EMP_NM,TRP_FRM_DT,TRP_TO_DT,TRP_PPS,DLBRT_FG
  test.skip('[no:1] 국외출장사전심의승인관리 - 조회 (setApprov) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1505/setRqstStatCd.do | inputCols=isChecked,tmHeader,TRP_DLBRT_RQST_NO,DLBRT_DGCNT,RQST_DT,RQST_STAT_CD,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,TRP_FG,TRP_TOT_AMT_WON,TRP_TOT_AMT_USD,TRER_EMP_NM,TRP_FRM_DT,TRP_TO_DT,TRP_PPS,DLBRT_FG
  test.skip('[no:2] 국외출장사전심의승인관리 - 조회 (setReject) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen1505/setRqstStatCd.do | inputCols=isChecked,tmHeader,TRP_DLBRT_RQST_NO,DLBRT_DGCNT,RQST_DT,RQST_STAT_CD,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,TRP_FG,TRP_TOT_AMT_WON,TRP_TOT_AMT_USD,TRER_EMP_NM,TRP_FRM_DT,TRP_TO_DT,TRP_PPS,DLBRT_FG
  test.skip('[no:3] 국외출장사전심의승인관리 - 삭제 (setCancel) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1505/getData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_TRP_FRM_DT,SCH_TRP_TO_DT,SCH_DLBRT_DGCNT,SCH_TRP_FG,SCH_RQST_STAT_CD,SCH_DLBRT_FG
  test.skip('[no:4] 국외출장사전심의승인관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국외출장신청 목록 (gen_1510M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1510M' OR MNU_NM LIKE '국외출장신청 목록%'
  const MENU_ID = 'TODO_gen_1510M';
  const API_URL = '/mis/gen/gen1510/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_TRP_FRM_DT', 'SCH_TRP_TO_DT', 'SCH_RQST_FG', 'SCH_TRP_FG', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1510/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_TRP_FRM_DT,SCH_TRP_TO_DT,SCH_RQST_FG,SCH_TRP_FG,SCH_APV_STAT_CD
  test.skip('[no:1] 국외출장신청 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국외출장신청 상세 (gen_1511M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1511M' OR MNU_NM LIKE '국외출장신청 상세%'
  const MENU_ID = 'TODO_gen_1511M';
  const API_URL = '/mis/gen/gen1511/getDlbrtRqstData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['TRP_RQST_NO', 'RQST_FG', 'PRV_RQST_NO', 'CNCL_RSN', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APV_STAT_CD', 'APV_STAT_NM', 'TRP_FG', 'TRP_FRM_DT', 'TRP_TO_DT', 'TRP_LODG', 'TRP_DAY', 'TRP_DAYS', 'TRP_DLBRT_RQST_NO', 'TRER_EMP_NO', 'TRER_EMP_NM', 'NTN_CD', 'NTN_CTY_NM', 'AREA_GRADE_FG', 'TRER_GRD_CD', 'TRER_FLOC_CD', 'STD_DT', 'EXCHNG_RATE', 'TRP_TOT_AMT_WON', 'TRP_TOT_AMT_USD', 'FLIGHT_PUR_FG', 'PRIC_PMT_FG', 'CUST_CD', 'CUST_NM', 'CUST_BANK_CD', 'CUST_BANK_NM', 'CUST_ACC_NO', 'TRP_PPS', 'RMK', 'AUPC_SPRT_YN', 'EXPE_BND_RSN', 'SBJ', 'CNTC_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1511/getDlbrtRqstData.do | inputCols=TRP_RQST_NO,RQST_FG,PRV_RQST_NO,CNCL_RSN,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,TRP_FG,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_DLBRT_RQST_NO,TRER_EMP_NO,TRER_EMP_NM,NTN_CD,NTN_CTY_NM,AREA_GRADE_FG,TRER_GRD_CD,TRER_FLOC_CD,STD_DT,EXCHNG_RATE,TRP_TOT_AMT_WON,TRP_TOT_AMT_USD,FLIGHT_PUR_FG,PRIC_PMT_FG,CUST_CD,CUST_NM,CUST_BANK_CD,CUST_BANK_NM,CUST_ACC_NO,TRP_PPS,RMK,AUPC_SPRT_YN,EXPE_BND_RSN,SBJ,CNTC_NO
  test.skip('[no:1] 국외출장신청 상세 - 조회 (getDlbrtRqstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1511/getAccInfo.do | inputCols=EMP_NO,PMT_BK_CD,PMT_BK_NM,ACC_NO
  test.skip('[no:2] 국외출장신청 상세 - 조회 (getAccInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen1511/delData.do | inputCols=TRP_RQST_NO,RQST_FG,PRV_RQST_NO,CNCL_RSN,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,TRP_FG,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_DLBRT_RQST_NO,TRER_EMP_NO,TRER_EMP_NM,NTN_CD,NTN_CTY_NM,AREA_GRADE_FG,TRER_GRD_CD,TRER_FLOC_CD,STD_DT,EXCHNG_RATE,TRP_TOT_AMT_WON,TRP_TOT_AMT_USD,FLIGHT_PUR_FG,PRIC_PMT_FG,CUST_CD,CUST_NM,CUST_BANK_CD,CUST_BANK_NM,CUST_ACC_NO,TRP_PPS,RMK,AUPC_SPRT_YN,EXPE_BND_RSN,SBJ,CNTC_NO
  test.skip('[no:3] 국외출장신청 상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/gen/gen1511/getExchgRate.do | inputCols=-
  test.skip('[no:4] 국외출장신청 상세 - 수정 (getExchgRate) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1511/getTrpFrgnPreData.do | inputCols=TRP_RQST_NO,RQST_FG,PRV_RQST_NO,CNCL_RSN,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,TRP_FG,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_DLBRT_RQST_NO,TRER_EMP_NO,TRER_EMP_NM,NTN_CD,NTN_CTY_NM,AREA_GRADE_FG,TRER_GRD_CD,TRER_FLOC_CD,STD_DT,EXCHNG_RATE,TRP_TOT_AMT_WON,TRP_TOT_AMT_USD,FLIGHT_PUR_FG,PRIC_PMT_FG,CUST_CD,CUST_NM,CUST_BANK_CD,CUST_BANK_NM,CUST_ACC_NO,TRP_PPS,RMK,AUPC_SPRT_YN,EXPE_BND_RSN,SBJ,CNTC_NO
  test.skip('[no:5] 국외출장신청 상세 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1511/getFrgnExpMng.do | inputCols=TRER_EMP_NO,GRD_CD,FLOC_CD,ROW
  test.skip('[no:6] 국외출장신청 상세 - 조회 (getFrgnExpMng) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1511/getData.do | inputCols=TRP_RQST_NO,RQST_FG,PRV_RQST_NO,CNCL_RSN,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,TRP_FG,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_DLBRT_RQST_NO,TRER_EMP_NO,TRER_EMP_NM,NTN_CD,NTN_CTY_NM,AREA_GRADE_FG,TRER_GRD_CD,TRER_FLOC_CD,STD_DT,EXCHNG_RATE,TRP_TOT_AMT_WON,TRP_TOT_AMT_USD,FLIGHT_PUR_FG,PRIC_PMT_FG,CUST_CD,CUST_NM,CUST_BANK_CD,CUST_BANK_NM,CUST_ACC_NO,TRP_PPS,RMK,AUPC_SPRT_YN,EXPE_BND_RSN,SBJ,CNTC_NO
  test.skip('[no:7] 국외출장신청 상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국외출장신청 상세(사전심의X) (gen_1512M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1512M' OR MNU_NM LIKE '국외출장신청 상세(사전심의X)%'
  const MENU_ID = 'TODO_gen_1512M';
  const API_URL = '/mis/gen/gen1511/getAccInfo.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['EMP_NO', 'PMT_BK_CD', 'PMT_BK_NM', 'ACC_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1511/getAccInfo.do | inputCols=EMP_NO,PMT_BK_CD,PMT_BK_NM,ACC_NO
  test.skip('[no:1] 국외출장신청 상세(사전심의X) - 조회 (getAccInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1511/getDlbrtRqstData.do | inputCols=TRP_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,TRP_FG,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_DLBRT_RQST_NO,TRER_EMP_NO,TRER_EMP_NM,NTN_CD,NTN_CTY_NM,AREA_GRADE_FG,TRER_GRD_CD,TRER_FLOC_CD,STD_DT,EXCHNG_RATE,TRP_TOT_AMT_WON,TRP_TOT_AMT_USD,FLIGHT_PUR_FG,PRIC_PMT_FG,CUST_CD,CUST_NM,CUST_BANK_CD,CUST_BANK_NM,CUST_ACC_NO,TRP_PPS,RMK,AUPC_SPRT_YN,EXPE_BND_RSN,SBJ,CNTC_NO
  test.skip('[no:2] 국외출장신청 상세(사전심의X) - 조회 (getDlbrtRqstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen1511/delData.do | inputCols=TRP_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,TRP_FG,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_DLBRT_RQST_NO,TRER_EMP_NO,TRER_EMP_NM,NTN_CD,NTN_CTY_NM,AREA_GRADE_FG,TRER_GRD_CD,TRER_FLOC_CD,STD_DT,EXCHNG_RATE,TRP_TOT_AMT_WON,TRP_TOT_AMT_USD,FLIGHT_PUR_FG,PRIC_PMT_FG,CUST_CD,CUST_NM,CUST_BANK_CD,CUST_BANK_NM,CUST_ACC_NO,TRP_PPS,RMK,AUPC_SPRT_YN,EXPE_BND_RSN,SBJ,CNTC_NO
  test.skip('[no:3] 국외출장신청 상세(사전심의X) - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/gen/gen1511/getExchgRate.do | inputCols=-
  test.skip('[no:4] 국외출장신청 상세(사전심의X) - 수정 (getExchgRate) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1511/getFrgnExpMng.do | inputCols=TRER_EMP_NO,GRD_CD,FLOC_CD,ROW
  test.skip('[no:5] 국외출장신청 상세(사전심의X) - 조회 (getFrgnExpMng) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1511/getData.do | inputCols=TRP_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,TRP_FG,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_DLBRT_RQST_NO,TRER_EMP_NO,TRER_EMP_NM,NTN_CD,NTN_CTY_NM,AREA_GRADE_FG,TRER_GRD_CD,TRER_FLOC_CD,STD_DT,EXCHNG_RATE,TRP_TOT_AMT_WON,TRP_TOT_AMT_USD,FLIGHT_PUR_FG,PRIC_PMT_FG,CUST_CD,CUST_NM,CUST_BANK_CD,CUST_BANK_NM,CUST_ACC_NO,TRP_PPS,RMK,AUPC_SPRT_YN,EXPE_BND_RSN,SBJ,CNTC_NO
  test.skip('[no:6] 국외출장신청 상세(사전심의X) - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국외출장보고 목록 (gen_1520M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1520M' OR MNU_NM LIKE '국외출장보고 목록%'
  const MENU_ID = 'TODO_gen_1520M';
  const API_URL = '/mis/gen/gen1520/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_TRP_FRM_DT', 'SCH_TRP_TO_DT', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1520/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_TRP_FRM_DT,SCH_TRP_TO_DT,SCH_APV_STAT_CD
  test.skip('[no:1] 국외출장보고 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('국외출장보고 상세 (gen_1521M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1521M' OR MNU_NM LIKE '국외출장보고 상세%'
  const MENU_ID = 'TODO_gen_1521M';
  const API_URL = '/mis/gen/gen1521/getTrpRqstData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['TRP_EXCC_RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'APV_STAT_CD', 'APV_STAT_NM', 'TRP_RQST_NO', 'TRP_RQST_DT', 'TRP_APNT_EMP_NO', 'TRP_APNT_EMP_NM', 'TRP_FG', 'TRP_FRM_DT', 'TRP_TO_DT', 'TRP_LODG', 'TRP_DAY', 'TRP_DAYS', 'TRP_DLBRT_RQST_NO', 'STD_DT', 'EXCHNG_RATE', 'TRP_TOT_AMT_USD', 'TRP_TOT_AMT_WON', 'FLIGHT_PUR_FG', 'PRIC_PMT_FG', 'CUST_CD', 'CUST_NM', 'CUST_BANK_CD', 'CUST_BANK_NM', 'CUST_ACC_NO', 'TRP_PPS', 'RMK', 'EXCC_RSN', 'CNTC_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen1521/delData.do | inputCols=TRP_EXCC_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APV_STAT_CD,APV_STAT_NM,TRP_RQST_NO,TRP_RQST_DT,TRP_APNT_EMP_NO,TRP_APNT_EMP_NM,TRP_FG,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_DLBRT_RQST_NO,STD_DT,EXCHNG_RATE,TRP_TOT_AMT_USD,TRP_TOT_AMT_WON,FLIGHT_PUR_FG,PRIC_PMT_FG,CUST_CD,CUST_NM,CUST_BANK_CD,CUST_BANK_NM,CUST_ACC_NO,TRP_PPS,RMK,EXCC_RSN,CNTC_NO
  test.skip('[no:1] 국외출장보고 상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1521/getTrpRqstData.do | inputCols=TRP_EXCC_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APV_STAT_CD,APV_STAT_NM,TRP_RQST_NO,TRP_RQST_DT,TRP_APNT_EMP_NO,TRP_APNT_EMP_NM,TRP_FG,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_DLBRT_RQST_NO,STD_DT,EXCHNG_RATE,TRP_TOT_AMT_USD,TRP_TOT_AMT_WON,FLIGHT_PUR_FG,PRIC_PMT_FG,CUST_CD,CUST_NM,CUST_BANK_CD,CUST_BANK_NM,CUST_ACC_NO,TRP_PPS,RMK,EXCC_RSN,CNTC_NO
  test.skip('[no:2] 국외출장보고 상세 - 조회 (getTrpRqstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1521/getTrpExccMainData.do | inputCols=TRP_EXCC_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APV_STAT_CD,APV_STAT_NM,TRP_RQST_NO,TRP_RQST_DT,TRP_APNT_EMP_NO,TRP_APNT_EMP_NM,TRP_FG,TRP_FRM_DT,TRP_TO_DT,TRP_LODG,TRP_DAY,TRP_DAYS,TRP_DLBRT_RQST_NO,STD_DT,EXCHNG_RATE,TRP_TOT_AMT_USD,TRP_TOT_AMT_WON,FLIGHT_PUR_FG,PRIC_PMT_FG,CUST_CD,CUST_NM,CUST_BANK_CD,CUST_BANK_NM,CUST_ACC_NO,TRP_PPS,RMK,EXCC_RSN,CNTC_NO
  test.skip('[no:3] 국외출장보고 상세 - 조회 (getTrpExccMainData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen1521/getFrgnExpMng.do | inputCols=-
  test.skip('[no:4] 국외출장보고 상세 - 조회 (getFrgnExpMng) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('항공마일리지관리 (gen_1530M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_1530M' OR MNU_NM LIKE '항공마일리지관리%'
  const MENU_ID = 'TODO_gen_1530M';
  const API_URL = '/mis/gen/gen1530/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_FRM_DT', 'SCH_STDR_TO_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_AIAN_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen1530/getList.do | inputCols=SCH_STDR_FRM_DT,SCH_STDR_TO_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_AIAN_CD
  test.skip('[no:1] 항공마일리지관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부재자현황 (gen_3010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3010M' OR MNU_NM LIKE '부재자현황%'
  const MENU_ID = 'TODO_gen_3010M';
  const API_URL = '/mis/gen/gen3010/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_ABST_FRM_DT', 'SCH_ABST_TO_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'ABST_FG_CD', 'ABST_DTL_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen3010/getList.do | inputCols=SCH_ABST_FRM_DT,SCH_ABST_TO_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,ABST_FG_CD,ABST_DTL_FG_CD
  test.skip('[no:1] 부재자현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen3010/getAbstFgDtlCd.do | inputCols=-
  test.skip('[no:2] 부재자현황 - 조회 (getAbstFgDtlCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('비상근근무시간관리 (gen_3050M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3050M' OR MNU_NM LIKE '비상근근무시간관리%'
  const MENU_ID = 'TODO_gen_3050M';
  const API_URL = '/mis/gen/gen3050/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_WORK_STDR_YM', 'SCH_DCSN_YN', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen3050/getList.do | inputCols=SCH_WORK_STDR_YM,SCH_DCSN_YN,SCH_FRM_DT,SCH_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM
  test.skip('[no:1] 비상근근무시간관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('챠량등록관리 (gen_3300M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3300M' OR MNU_NM LIKE '챠량등록관리%'
  const MENU_ID = 'TODO_gen_3300M';
  const API_URL = '/mis/gen/gen3300/getCarMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen3300/setCarMngData.do | inputCols=isChecked,tmHeader,CAR_MNG_NO,CAR_NO,TCAR_NMPR,CAR_KND,PRP,RESP_DRER_EMP_NO,RESP_DRER_EMP_NM,ACQ_DT,ACQ_AMT,USE_STGE_DT,USE_STGE_RMK
  test.skip('[no:1] 챠량등록관리 - 저장 (setCarMngData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen3300/getCarMngList.do | inputCols=-
  test.skip('[no:2] 챠량등록관리 - 조회 (getCarMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('관리비기준관리 (gen_3600M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3600M' OR MNU_NM LIKE '관리비기준관리%'
  const MENU_ID = 'TODO_gen_3600M';
  const API_URL = '/mis/gen/gen3600/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen3600/getData.do | inputCols=SCH_EMPO_STLF_CD
  test.skip('[no:1] 관리비기준관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen3600/setData.do | inputCols=isChecked,tmHeader,EMPO_STLF_CD,ROOM_AR,BASC_MNG_CT
  test.skip('[no:2] 관리비기준관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('할증률기준관리 (gen_3601M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3601M' OR MNU_NM LIKE '할증률기준관리%'
  const MENU_ID = 'TODO_gen_3601M';
  const API_URL = '/mis/gen/gen3601/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen3601/getData.do | inputCols=-
  test.skip('[no:1] 할증률기준관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen3601/setData.do | inputCols=isChecked,tmHeader,MVN_YEARS,SCHRG_RTO
  test.skip('[no:2] 할증률기준관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기숙사입주신청 목록 (gen_3610M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3610M' OR MNU_NM LIKE '기숙사입주신청 목록%'
  const MENU_ID = 'TODO_gen_3610M';
  const API_URL = '/mis/gen/gen3610/searchEntDormRqstList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DEPT_NM', 'SCH_DEPT_CD', 'SCH_MVNP_EMP_NO', 'SCH_MVNP_EMP_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen3610/searchEntDormRqstList.do | inputCols=SCH_FRM_DT,SCH_TO_DT,SCH_EMP_NM,SCH_EMP_NO,SCH_DEPT_NM,SCH_DEPT_CD,SCH_MVNP_EMP_NO,SCH_MVNP_EMP_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 기숙사입주신청 목록 - 조회 (searchEntDormRqstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기숙사입주신청 상세 (gen_3611M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3611M' OR MNU_NM LIKE '기숙사입주신청 상세%'
  const MENU_ID = 'TODO_gen_3611M';
  const API_URL = '/mis/gen/gen3611/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_NO', 'RQST_DT', 'RQST_STAT_CD', 'RQST_STAT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'APNT_GRD_NM', 'APNT_MAIL_ADDR', 'LODG_PLC_FG_CD', 'MVNP_EMP_NO', 'MVNP_EMP_NM', 'MVNP_DEPT_CD', 'MVNP_DEPT_NM', 'MVNP_FLOC_CD', 'MVNP_FLOC_NM', 'PAY_MTHD', 'MVNP_TEL_NO', 'MVN_FRM_DT', 'MVN_TO_DT', 'SAL_DUC_AGRE_YN', 'MVN_RSN', 'APV_STAT_CD', 'APV_STAT_NM', 'PK_UPT_DE', 'SIGN_STAT_NM', 'SIGN_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen3611/getData.do | inputCols=RQST_NO,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APNT_MAIL_ADDR,LODG_PLC_FG_CD,MVNP_EMP_NO,MVNP_EMP_NM,MVNP_DEPT_CD,MVNP_DEPT_NM,MVNP_FLOC_CD,MVNP_FLOC_NM,PAY_MTHD,MVNP_TEL_NO,MVN_FRM_DT,MVN_TO_DT,SAL_DUC_AGRE_YN,MVN_RSN,APV_STAT_CD,APV_STAT_NM,PK_UPT_DE,SIGN_STAT_NM,SIGN_STAT_CD
  test.skip('[no:1] 기숙사입주신청 상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen3611/setData.do | inputCols=-
  test.skip('[no:2] 기숙사입주신청 상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen3611/uptRqst.do | inputCols=RQST_NO,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APNT_MAIL_ADDR,LODG_PLC_FG_CD,MVNP_EMP_NO,MVNP_EMP_NM,MVNP_DEPT_CD,MVNP_DEPT_NM,MVNP_FLOC_CD,MVNP_FLOC_NM,PAY_MTHD,MVNP_TEL_NO,MVN_FRM_DT,MVN_TO_DT,SAL_DUC_AGRE_YN,MVN_RSN,APV_STAT_CD,APV_STAT_NM,PK_UPT_DE,SIGN_STAT_NM,SIGN_STAT_CD
  test.skip('[no:3] 기숙사입주신청 상세 - 조회 (uptRqst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen3611/delData.do | inputCols=RQST_NO,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APNT_MAIL_ADDR,LODG_PLC_FG_CD,MVNP_EMP_NO,MVNP_EMP_NM,MVNP_DEPT_CD,MVNP_DEPT_NM,MVNP_FLOC_CD,MVNP_FLOC_NM,PAY_MTHD,MVNP_TEL_NO,MVN_FRM_DT,MVN_TO_DT,SAL_DUC_AGRE_YN,MVN_RSN,APV_STAT_CD,APV_STAT_NM,PK_UPT_DE,SIGN_STAT_NM,SIGN_STAT_CD
  test.skip('[no:4] 기숙사입주신청 상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('입주배정관리 (gen_3620M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3620M' OR MNU_NM LIKE '입주배정관리%'
  const MENU_ID = 'TODO_gen_3620M';
  const API_URL = '/mis/gen/gen3620/getMvnList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_LODG_PLC_FG_CD', 'SCH_DHRM_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen3620/getUsePrpCodeList.do | inputCols=-
  test.skip('[no:1] 입주배정관리 - 삭제 (getUsePrpCodeList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen3620/getMvnList.do | inputCols=SCH_LODG_PLC_FG_CD,SCH_DHRM_CD
  test.skip('[no:2] 입주배정관리 - 조회 (getMvnList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen3620/getMvnHistoryList.do | inputCols=SCH_LODG_PLC_FG_CD,SCH_DHRM_CD
  test.skip('[no:3] 입주배정관리 - 조회 (getMvnHistoryList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기숙사퇴거신청 목록 (gen_3630M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3630M' OR MNU_NM LIKE '기숙사퇴거신청 목록%'
  const MENU_ID = 'TODO_gen_3630M';
  const API_URL = '/mis/gen/gen3630/searchLvhsRqstList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_LVHS_EMP_NO', 'SCH_LVHS_EMP_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen3630/searchLvhsRqstList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_LVHS_EMP_NO,SCH_LVHS_EMP_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 기숙사퇴거신청 목록 - 조회 (searchLvhsRqstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기숙사퇴거신청 상세 (gen_3631M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3631M' OR MNU_NM LIKE '기숙사퇴거신청 상세%'
  const MENU_ID = 'TODO_gen_3631M';
  const API_URL = '/mis/gen/gen3631/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['LVHS_RQST_NO', 'RQST_DT', 'RQST_STAT_CD', 'RQST_STAT_NM', 'SIGN_STAT_CD', 'SIGN_STAT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'APNT_GRD_NM', 'APNT_MAIL_ADDR', 'MVNP_EMPO_STLF_CD', 'LODG_PLC_FG_CD', 'ASGN_RQST_NO', 'LVHS_EMP_NO', 'LVHS_EMP_NM', 'LVHS_DEPT_CD', 'LVHS_DEPT_NM', 'LVHS_FLOC_CD', 'LVHS_FLOC_NM', 'LVHS_TEL_NO', 'MVN_DT', 'DHRM_CD', 'LVHS_PRAR_DT', 'BLDG_NM', 'LVHS_RSN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen3631/getData.do | inputCols=LVHS_RQST_NO,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,SIGN_STAT_CD,SIGN_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APNT_MAIL_ADDR,MVNP_EMPO_STLF_CD,LODG_PLC_FG_CD,ASGN_RQST_NO,LVHS_EMP_NO,LVHS_EMP_NM,LVHS_DEPT_CD,LVHS_DEPT_NM,LVHS_FLOC_CD,LVHS_FLOC_NM,LVHS_TEL_NO,MVN_DT,DHRM_CD,LVHS_PRAR_DT,BLDG_NM,LVHS_RSN
  test.skip('[no:1] 기숙사퇴거신청 상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen3631/getRoomData.do | inputCols=LVHS_EMP_NO,ASGN_RQST_NO,MVN_DT,DHRM_CD,BLDG_NM,MVNP_TEL_NO
  test.skip('[no:2] 기숙사퇴거신청 상세 - 조회 (getRoomData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen3631/setData.do | inputCols=-
  test.skip('[no:3] 기숙사퇴거신청 상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen3631/uptRqst.do | inputCols=LVHS_RQST_NO,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,SIGN_STAT_CD,SIGN_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APNT_MAIL_ADDR,MVNP_EMPO_STLF_CD,LODG_PLC_FG_CD,ASGN_RQST_NO,LVHS_EMP_NO,LVHS_EMP_NM,LVHS_DEPT_CD,LVHS_DEPT_NM,LVHS_FLOC_CD,LVHS_FLOC_NM,LVHS_TEL_NO,MVN_DT,DHRM_CD,LVHS_PRAR_DT,BLDG_NM,LVHS_RSN
  test.skip('[no:4] 기숙사퇴거신청 상세 - 조회 (uptRqst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen3631/delData.do | inputCols=LVHS_RQST_NO,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,SIGN_STAT_CD,SIGN_STAT_NM,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APNT_MAIL_ADDR,MVNP_EMPO_STLF_CD,LODG_PLC_FG_CD,ASGN_RQST_NO,LVHS_EMP_NO,LVHS_EMP_NM,LVHS_DEPT_CD,LVHS_DEPT_NM,LVHS_FLOC_CD,LVHS_FLOC_NM,LVHS_TEL_NO,MVN_DT,DHRM_CD,LVHS_PRAR_DT,BLDG_NM,LVHS_RSN
  test.skip('[no:5] 기숙사퇴거신청 상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('관리비정산관리 (gen_3640M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3640M' OR MNU_NM LIKE '관리비정산관리%'
  const MENU_ID = 'TODO_gen_3640M';
  const API_URL = '/mis/gen/gen3640/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQET_YM', 'SCH_LODG_PLC_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen3640/getUsePrpCodeList.do | inputCols=-
  test.skip('[no:1] 관리비정산관리 - 삭제 (getUsePrpCodeList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen3640/getData.do | inputCols=SCH_RQET_YM,SCH_LODG_PLC_FG_CD
  test.skip('[no:2] 관리비정산관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen3640/setCreateData.do | inputCols=RQET_YM,IS_EXISTS,DCSN_YN
  test.skip('[no:3] 관리비정산관리 - 저장 (setCreateData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen3640/setData.do | inputCols=isChecked,tmHeader,RQET_YM,ASGN_RQST_NO,SEQ,DHRM_CD,ROOM_NM,ROOM_AR,MVNP_EMP_NO,MVNP_EMP_NM,MVNP_EMPO_STLF_CD,RQET_FG,PMNT_MTHD,MVN_YEARS,MVN_DT,LVHS_DT,EXCC_FRM_DT,EXCC_TO_DT,TOT_DAYS,USE_FRM_DT,USE_TO_DT,DAYS,SCHRG_RTO,STDR_AMT,EXCC_AMT,MDAT_AMT,LAST_AMT
  test.skip('[no:4] 관리비정산관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen3640/setDcsnMonth.do | inputCols=RQET_YM,IS_EXISTS,DCSN_YN
  test.skip('[no:5] 관리비정산관리 - 저장 (uptDcsn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('관리비미수현황 (gen_3660M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3660M' OR MNU_NM LIKE '관리비미수현황%'
  const MENU_ID = 'TODO_gen_3660M';
  const API_URL = '/mis/gen/gen3660/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQET_FRM_YM', 'SCH_RQET_TO_YM', 'SCH_MVNP_EMP_NO', 'SCH_MVNP_EMP_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen3660/getData.do | inputCols=SCH_RQET_FRM_YM,SCH_RQET_TO_YM,SCH_MVNP_EMP_NO,SCH_MVNP_EMP_NM
  test.skip('[no:1] 관리비미수현황 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen3660/setData.do | inputCols=isChecked,tmHeader,RQET_YM,MVNP_EMP_NO,MVNP_EMP_NM,SAL_DUC_RQET_AMT,SAL_DUC_PAY_AMT,ACC_TRFR_RQET_AMT,ACC_TRFR_PAY_AMT,NPY_AMT,RMK
  test.skip('[no:2] 관리비미수현황 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인장/법인인감신청목록 (gen_3900M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3900M' OR MNU_NM LIKE '인장/법인인감신청목록%'
  const MENU_ID = 'TODO_gen_3900M';
  const API_URL = '/mis/gen/gen3900/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_RQST_STAT_CD', 'SCH_RQST_SBJ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen3900/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_RQST_STAT_CD,SCH_RQST_SBJ
  test.skip('[no:1] 인장/법인인감신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인장/법인인감신청상세 (gen_3901M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3901M' OR MNU_NM LIKE '인장/법인인감신청상세%'
  const MENU_ID = 'TODO_gen_3901M';
  const API_URL = '/mis/gen/gen3901/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'GRD_CD', 'RQST_SBJ', 'RCEPT_PLC', 'RQST_RSN', 'RQST_STAT_CD', 'RQST_STAT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen3901/getData.do | inputCols=RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,GRD_CD,RQST_SBJ,RCEPT_PLC,RQST_RSN,RQST_STAT_CD,RQST_STAT_NM
  test.skip('[no:1] 인장/법인인감신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen3901/setData.do | inputCols=RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,GRD_CD,RQST_SBJ,RCEPT_PLC,RQST_RSN,RQST_STAT_CD,RQST_STAT_NM
  test.skip('[no:2] 인장/법인인감신청상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen3901/delData.do | inputCols=RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,GRD_CD,RQST_SBJ,RCEPT_PLC,RQST_RSN,RQST_STAT_CD,RQST_STAT_NM
  test.skip('[no:3] 인장/법인인감신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인장/법인인감승인관리 (gen_3910M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3910M' OR MNU_NM LIKE '인장/법인인감승인관리%'
  const MENU_ID = 'TODO_gen_3910M';
  const API_URL = '/mis/gen/gen3910/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_RQST_STAT_CD', 'SCH_RQST_SBJ', 'SCH_CSDY_DEPT_CD', 'SCH_CSDY_DEPT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen3910/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_RQST_STAT_CD,SCH_RQST_SBJ,SCH_CSDY_DEPT_CD,SCH_CSDY_DEPT_NM
  test.skip('[no:1] 인장/법인인감승인관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen3910/setData.do | inputCols=isChecked,tmHeader,RQST_NO,RQST_DT,RQST_FG,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,RQST_SBJ,RQST_STAT_CD,RQST_STAT_NM,RMK,CSDY_DEPT_NM_LIST
  test.skip('[no:2] 인장/법인인감승인관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('직인및폐인대장관리 (gen_3920M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_3920M' OR MNU_NM LIKE '직인및폐인대장관리%'
  const MENU_ID = 'TODO_gen_3920M';
  const API_URL = '/mis/gen/gen3920/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_NM', 'SCH_KND_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen3920/getList.do | inputCols=SCH_NM,SCH_KND_FG
  test.skip('[no:1] 직인및폐인대장관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen3920/setData.do | inputCols=isChecked,tmHeader,SEQ,NM,QTY,STD,RGIN_DT,KND_FG,PRP,CSDY_DEPT_CD,CSDY_DEPT_NM,CHRG_JOB,DSUS_YN,DSUS_DT,USE_YN,SORT_SEQ,FILE_NO
  test.skip('[no:2] 직인및폐인대장관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('시간제근무자관리 (gen_4010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4010M' OR MNU_NM LIKE '시간제근무자관리%'
  const MENU_ID = 'TODO_gen_4010M';
  const API_URL = '/mis/gen/gen4010/getList01.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_WORK_TIME_FRM_DT', 'SCH_WORK_TIME_TO_DT', 'SCH_EMP_NO', 'SCH_EMP_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4010/getList01.do | inputCols=SCH_WORK_TIME_FRM_DT,SCH_WORK_TIME_TO_DT,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:1] 시간제근무자관리 - 조회 (getList01) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen4010/setData.do | inputCols=isChecked,tmHeader,EMP_NO,EMP_NM,DEPT_NM,WORK_DGCNT,WORK_TIME_FRM_DT,WORK_TIME_TO_DT,WORK_TIME_CHG_RSN,APNT_EMP_NO,APNT_EMP_NM,APNT_WORK_DGCNT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,WORK_TIME,REST_TIME
  test.skip('[no:2] 시간제근무자관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('대학학자금신청 목록 (gen_4200M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4200M' OR MNU_NM LIKE '대학학자금신청 목록%'
  const MENU_ID = 'TODO_gen_4200M';
  const API_URL = '/mis/gen/gen4200/getSchxpnRqstList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_SCHXPN_RQST_NO', 'SCH_RQST_STAT_CD', 'SIGN_STAT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4200/getSchxpnRqstList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_SCHXPN_RQST_NO,SCH_RQST_STAT_CD,SIGN_STAT_NM
  test.skip('[no:1] 대학학자금신청 목록 - 조회 (getSchxpnRqstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('대학학자금신청 상세 (gen_4201M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4201M' OR MNU_NM LIKE '대학학자금신청 상세%'
  const MENU_ID = 'TODO_gen_4201M';
  const API_URL = '/mis/gen/gen4201/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCHXPN_RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'APNT_GRD_NM', 'RQST_STAT_CD', 'RQST_STAT_NM', 'APNT_EMPL_DT', 'APNT_RSIGN_PRAR_DT', 'CHILD_NM', 'UNIVS_NM', 'GRDE', 'SETR', 'RQST_AMT', 'CONF_EMP_NO', 'CONF_EMP_NM', 'ACCP_DT', 'PMT_YM', 'SIGN_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen4201/delData.do | inputCols=SCHXPN_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,RQST_STAT_CD,RQST_STAT_NM,APNT_EMPL_DT,APNT_RSIGN_PRAR_DT,CHILD_NM,UNIVS_NM,GRDE,SETR,RQST_AMT,CONF_EMP_NO,CONF_EMP_NM,ACCP_DT,PMT_YM,SIGN_STAT_CD
  test.skip('[no:1] 대학학자금신청 상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen4201/getData.do | inputCols=SCHXPN_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,RQST_STAT_CD,RQST_STAT_NM,APNT_EMPL_DT,APNT_RSIGN_PRAR_DT,CHILD_NM,UNIVS_NM,GRDE,SETR,RQST_AMT,CONF_EMP_NO,CONF_EMP_NM,ACCP_DT,PMT_YM,SIGN_STAT_CD
  test.skip('[no:2] 대학학자금신청 상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen4201/getCnsvInfo.do | inputCols=SCHXPN_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,RQST_STAT_CD,RQST_STAT_NM,APNT_EMPL_DT,APNT_RSIGN_PRAR_DT,CHILD_NM,UNIVS_NM,GRDE,SETR,RQST_AMT,CONF_EMP_NO,CONF_EMP_NM,ACCP_DT,PMT_YM,SIGN_STAT_CD
  test.skip('[no:3] 대학학자금신청 상세 - 조회 (getCnsvInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen4201/getRtpaySyemJoinYn.do | inputCols=SCHXPN_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,RQST_STAT_CD,RQST_STAT_NM,APNT_EMPL_DT,APNT_RSIGN_PRAR_DT,CHILD_NM,UNIVS_NM,GRDE,SETR,RQST_AMT,CONF_EMP_NO,CONF_EMP_NM,ACCP_DT,PMT_YM,SIGN_STAT_CD
  test.skip('[no:4] 대학학자금신청 상세 - 조회 (getRtpaySyemJoinYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('대학학자금승인관리 (gen_4210M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4210M' OR MNU_NM LIKE '대학학자금승인관리%'
  const MENU_ID = 'TODO_gen_4210M';
  const API_URL = '/mis/gen/gen4210/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_SCHXPN_RQST_NO', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4210/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_SCHXPN_RQST_NO,SCH_RQST_STAT_CD
  test.skip('[no:1] 대학학자금승인관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('대학학자금대여금관리 목록 (gen_4220M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4220M' OR MNU_NM LIKE '대학학자금대여금관리 목록%'
  const MENU_ID = 'TODO_gen_4220M';
  const API_URL = '/mis/gen/gen4220/getSchxpnMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_SCHXPN_LNMN_MNG_NO', 'SCH_SCHXPN_RQST_NO', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4220/getSchxpnMngList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_SCHXPN_LNMN_MNG_NO,SCH_SCHXPN_RQST_NO,SCH_RQST_STAT_CD
  test.skip('[no:1] 대학학자금대여금관리 목록 - 조회 (getSchxpnMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('대학학자금대여금관리 상세 (gen_4221M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4221M' OR MNU_NM LIKE '대학학자금대여금관리 상세%'
  const MENU_ID = 'TODO_gen_4221M';
  const API_URL = '/mis/gen/gen4221/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCHXPN_LNMN_MNG_NO', 'SCHXPN_RQST_NO', 'RQST_NO', 'RESL_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'APNT_GRD_NM', 'RQST_STAT_CD', 'RQST_STAT_NM', 'APNT_EMPL_DT', 'APNT_RSIGN_PRAR_DT', 'CHILD_NM', 'UNIVS_NM', 'GRDE', 'SETR', 'RQST_AMT', 'CONF_EMP_NO', 'CONF_EMP_NM', 'ACCP_DT', 'PMT_YM', 'DFR_YEARS', 'RPAY_YEARS', 'RPAY_FRM_YM', 'CONF_AMT', 'RESL_APV_STAT_CD', 'RESL_APV_STAT_NM', 'PLAN_CREAT_YN', 'EMP_NO', 'LOAN_AMT', 'IF_PGM_ID'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen4221/setSchxpnMngData.do | inputCols=SCHXPN_LNMN_MNG_NO,SCHXPN_RQST_NO,RQST_NO,RESL_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,RQST_STAT_CD,RQST_STAT_NM,APNT_EMPL_DT,APNT_RSIGN_PRAR_DT,CHILD_NM,UNIVS_NM,GRDE,SETR,RQST_AMT,CONF_EMP_NO,CONF_EMP_NM,ACCP_DT,PMT_YM,DFR_YEARS,RPAY_YEARS,RPAY_FRM_YM,CONF_AMT,RESL_APV_STAT_CD,RESL_APV_STAT_NM,PLAN_CREAT_YN,EMP_NO,LOAN_AMT,IF_PGM_ID
  test.skip('[no:1] 대학학자금대여금관리 상세 - 저장 (setSchxpnMngData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen4221/delSchxpnMngData.do | inputCols=SCHXPN_LNMN_MNG_NO,SCHXPN_RQST_NO,RQST_NO,RESL_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,RQST_STAT_CD,RQST_STAT_NM,APNT_EMPL_DT,APNT_RSIGN_PRAR_DT,CHILD_NM,UNIVS_NM,GRDE,SETR,RQST_AMT,CONF_EMP_NO,CONF_EMP_NM,ACCP_DT,PMT_YM,DFR_YEARS,RPAY_YEARS,RPAY_FRM_YM,CONF_AMT,RESL_APV_STAT_CD,RESL_APV_STAT_NM,PLAN_CREAT_YN,EMP_NO,LOAN_AMT,IF_PGM_ID
  test.skip('[no:2] 대학학자금대여금관리 상세 - 삭제 (delSchxpnMngData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen4221/getData.do | inputCols=SCHXPN_LNMN_MNG_NO,SCHXPN_RQST_NO,RQST_NO,RESL_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,RQST_STAT_CD,RQST_STAT_NM,APNT_EMPL_DT,APNT_RSIGN_PRAR_DT,CHILD_NM,UNIVS_NM,GRDE,SETR,RQST_AMT,CONF_EMP_NO,CONF_EMP_NM,ACCP_DT,PMT_YM,DFR_YEARS,RPAY_YEARS,RPAY_FRM_YM,CONF_AMT,RESL_APV_STAT_CD,RESL_APV_STAT_NM,PLAN_CREAT_YN,EMP_NO,LOAN_AMT,IF_PGM_ID
  test.skip('[no:3] 대학학자금대여금관리 상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('대학학자금지출발의신청서 팝업 (gen_4222M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4222M' OR MNU_NM LIKE '대학학자금지출발의신청서 팝업%'
  const MENU_ID = 'TODO_gen_4222M';
  const API_URL = '/mis/gen/gen4222/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen4222/delData.do | inputCols=RQST_NO,RQST_DT,SCHXPN_LNMN_MNG_NO,SCHXPN_RQST_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APV_STAT_CD,APV_STAT_NM,RESL_NO
  test.skip('[no:1] 대학학자금지출발의신청서 팝업 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen4222/setData.do | inputCols=RQST_NO,RQST_DT,SCHXPN_LNMN_MNG_NO,SCHXPN_RQST_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APV_STAT_CD,APV_STAT_NM,RESL_NO
  test.skip('[no:2] 대학학자금지출발의신청서 팝업 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('대학학자금급여공제관리 (gen_4230M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4230M' OR MNU_NM LIKE '대학학자금급여공제관리%'
  const MENU_ID = 'TODO_gen_4230M';
  const API_URL = '/mis/gen/gen4230/getMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCHXPN_LNMN_MNG_NO', 'SCH_RPAY_FRM_YM', 'SCH_RPAY_TO_YM', 'SCH_PLAN_CREAT_YN', 'SCH_EXPR_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4230/getMngList.do | inputCols=SCHXPN_LNMN_MNG_NO,SCH_RPAY_FRM_YM,SCH_RPAY_TO_YM,SCH_PLAN_CREAT_YN,SCH_EXPR_YN
  test.skip('[no:1] 대학학자금급여공제관리 - 조회 (getMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen4230/getData.do | inputCols=SCHXPN_LNMN_MNG_NO,EMP_NO
  test.skip('[no:2] 대학학자금급여공제관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen4230/setCreateData.do | inputCols=SCHXPN_LNMN_MNG_NO,EMP_NO
  test.skip('[no:3] 대학학자금급여공제관리 - 저장 (setCreateData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen4230/setData.do | inputCols=SCHXPN_LNMN_MNG_NO,EMP_NO
  test.skip('[no:4] 대학학자금급여공제관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen4230/setExprYn.do | inputCols=SCHXPN_LNMN_MNG_NO,EMP_NO,EMP_NM,LOAN_AMT,RPAY_AMT,LOAN_BALC,EXPR_YN
  test.skip('[no:5] 대학학자금급여공제관리 - 저장 (setExprYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('대학학자금급여공제현황 (gen_4240M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4240M' OR MNU_NM LIKE '대학학자금급여공제현황%'
  const MENU_ID = 'TODO_gen_4240M';
  const API_URL = '/mis/gen/gen4240/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_YYMM', 'SCH_TO_YYMM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4240/getList.do | inputCols=SCH_FRM_YYMM,SCH_TO_YYMM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:1] 대학학자금급여공제현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('포인트대상자관리 (gen_4500M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4500M' OR MNU_NM LIKE '포인트대상자관리%'
  const MENU_ID = 'TODO_gen_4500M';
  const API_URL = '/mis/gen/gen4500/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_EMPO_CLAS_CD', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4500/getData.do | inputCols=SCH_STDR_YY,SCH_EMPO_CLAS_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM
  test.skip('[no:1] 포인트대상자관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen4500/getListDtl.do | inputCols=STDR_YY,EMP_NO
  test.skip('[no:2] 포인트대상자관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen4500/setData.do | inputCols=STDR_YY,RGL_PMT_POIN,CNK_PMT_POIN,RGL_PMT_FG,CNK_PMT_FG,PMT_STDR_TIME,STDR_LABO_TIME,ONLINE_CUST_CD,ONLINE_CUST_NM,ONLINE_ACC_NO,ONLINE_BK_CD,ONLINE_BK_NM,CARD_CUST_CD,CARD_CUST_NM,CARD_ACC_NO,CARD_BK_CD,CARD_BK_NM,BUDG_YY,BUDG_BSNS_CD,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_DEPT_NM
  test.skip('[no:3] 포인트대상자관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen4500/setCreateData.do | inputCols=STDR_YY,RGL_PMT_POIN,CNK_PMT_POIN,RGL_PMT_FG,CNK_PMT_FG,PMT_STDR_TIME,STDR_LABO_TIME,ONLINE_CUST_CD,ONLINE_CUST_NM,ONLINE_ACC_NO,ONLINE_BK_CD,ONLINE_BK_NM,CARD_CUST_CD,CARD_CUST_NM,CARD_ACC_NO,CARD_BK_CD,CARD_BK_NM,BUDG_YY,BUDG_BSNS_CD,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_DEPT_NM
  test.skip('[no:4] 포인트대상자관리 - 저장 (setCreateData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen4500/setListUpt.do | inputCols=isChecked,STDR_YY,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,EMPO_STLF_CD,EMPO_STLF_NM,EMPO_CLAS_CD,AGE,EMPO_CLAS_NM,SELF_BIR,ENT_DT,RSIGN_DT,LABO_TIME,APLY_FRM_DT,APLY_TO_DT,PMT_TGPN_YN,ASGN_DCSN_YN,STDR_POIN,PMT_POSL_POIN,PMT_POIN,USE_POIN,BALC_POIN,EXCC_POIN,CTRCT_YN,CNSV_ADD_POIN
  test.skip('[no:5] 포인트대상자관리 - 조회 (setListUpt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen4500/setDtlUpt.do | inputCols=STDR_YY,EMP_NO,EMP_NM,EMPO_CLAS_CD,EMPO_CLAS_NM,SELF_BIR,PMT_FG,APLY_FRM_DT,APLY_TO_DT,WEEK_WORK_TIME,STDR_DAYS,EXCLUS_DAYS,APLY_DAYS,STDR_POIN,PMT_POSL_POIN,PMT_POIN,ASGN_DCSN_YN,PMT_YN,PMT_ASGN_DT,CNSV_ADD_POIN
  test.skip('[no:6] 포인트대상자관리 - 저장 (setDtlUpt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지급포인트관리 (gen_4510M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4510M' OR MNU_NM LIKE '지급포인트관리%'
  const MENU_ID = 'TODO_gen_4510M';
  const API_URL = '/mis/gen/gen4510/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_PMT_FG', 'SCH_PMT_YN', 'SCH_HNF_FG', 'SCH_PMT_FRM_DT', 'SCH_PMT_TO_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4510/getList.do | inputCols=SCH_STDR_YY,SCH_PMT_FG,SCH_PMT_YN,SCH_HNF_FG,SCH_PMT_FRM_DT,SCH_PMT_TO_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM
  test.skip('[no:1] 지급포인트관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen4510/setData.do | inputCols=STDR_YY,PMT_FG,PMT_ASGN_DT,HNF_FG,PMT_CLS
  test.skip('[no:2] 지급포인트관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen4510/setCancle.do | inputCols=STDR_YY,PMT_FG,PMT_ASGN_DT,HNF_FG,PMT_CLS
  test.skip('[no:3] 지급포인트관리 - 저장 (setCancle) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사용포인트관리 (gen_4520M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4520M' OR MNU_NM LIKE '사용포인트관리%'
  const MENU_ID = 'TODO_gen_4520M';
  const API_URL = '/mis/gen/gen4520/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_PMT_FG', 'SCH_PMT_YN', 'SCH_HNF_FG', 'SCH_USE_FRM_YM', 'SCH_USE_TO_YM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_RESL_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4520/getList.do | inputCols=SCH_STDR_YY,SCH_PMT_FG,SCH_PMT_YN,SCH_HNF_FG,SCH_USE_FRM_YM,SCH_USE_TO_YM,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_RESL_FG
  test.skip('[no:1] 사용포인트관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen4520/getUseYmChk.do | inputCols=STDR_YY,USE_YM
  test.skip('[no:2] 사용포인트관리 - 조회 (getUseYmChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen4520/setCancle.do | inputCols=STDR_YY,USE_YM
  test.skip('[no:3] 사용포인트관리 - 저장 (setCancle) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('포인트지급발의 (gen_4530M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4530M' OR MNU_NM LIKE '포인트지급발의%'
  const MENU_ID = 'TODO_gen_4530M';
  const API_URL = '/mis/gen/gen4530/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_PMT_FRM_YM', 'SCH_PMT_TO_YM', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4530/getList.do | inputCols=SCH_STDR_YY,SCH_PMT_FRM_YM,SCH_PMT_TO_YM,SCH_APV_STAT_CD
  test.skip('[no:1] 포인트지급발의 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('포인트지급발의상세 (gen_4531M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4531M' OR MNU_NM LIKE '포인트지급발의상세%'
  const MENU_ID = 'TODO_gen_4531M';
  const API_URL = '/mis/gen/gen4531/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_NO', 'STDR_YY', 'APV_STAT_CD', 'USE_YM', 'USE_POIN', 'RQST_AMT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4531/getData.do | inputCols=RQST_NO,STDR_YY,APV_STAT_CD,USE_YM,USE_POIN,RQST_AMT
  test.skip('[no:1] 포인트지급발의상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen4531/setData.do | inputCols=RQST_NO,STDR_YY,APV_STAT_CD,USE_YM,USE_POIN,RQST_AMT
  test.skip('[no:2] 포인트지급발의상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen4531/delData.do | inputCols=RQST_NO,STDR_YY,APV_STAT_CD,USE_YM,USE_POIN,RQST_AMT
  test.skip('[no:3] 포인트지급발의상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('식수기준관리 (gen_4800M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4800M' OR MNU_NM LIKE '식수기준관리%'
  const MENU_ID = 'TODO_gen_4800M';
  const API_URL = '/mis/gen/gen4800/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4800/getData.do | inputCols=-
  test.skip('[no:1] 식수기준관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen4800/setData.do | inputCols=isChecked,tmHeader,STDR_DT,RCKN_LMM,RCKN_THON,MEAL_PC,SELF_ALOTM
  test.skip('[no:2] 식수기준관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('식수정보관리 (gen_4810M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4810M' OR MNU_NM LIKE '식수정보관리%'
  const MENU_ID = 'TODO_gen_4810M';
  const API_URL = '/mis/gen/gen4800/getMealStdr.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4800/getMealStdr.do | inputCols=-
  test.skip('[no:1] 식수정보관리 - 조회 (getMealStdr) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen4810/getData.do | inputCols=SCH_YM,SCH_FRM_DT,SCH_TO_DT,SCH_MEAL_FG,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:2] 식수정보관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('식수부담금관리 (gen_4820M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4820M' OR MNU_NM LIKE '식수부담금관리%'
  const MENU_ID = 'TODO_gen_4820M';
  const API_URL = '/mis/gen/gen4800/getMealStdr.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4800/getMealStdr.do | inputCols=-
  test.skip('[no:1] 식수부담금관리 - 조회 (getMealStdr) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen4820/getData.do | inputCols=SCH_YM,SCH_FRM_DT,SCH_TO_DT,SCH_MEAL_FG,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:2] 식수부담금관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개인별식수현황 (gen_4830M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4830M' OR MNU_NM LIKE '개인별식수현황%'
  const MENU_ID = 'TODO_gen_4830M';
  const API_URL = '/mis/gen/gen4800/getMealStdr.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4800/getMealStdr.do | inputCols=-
  test.skip('[no:1] 개인별식수현황 - 조회 (getMealStdr) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen4830/getData.do | inputCols=SCH_YM,SCH_FRM_DT,SCH_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:2] 개인별식수현황 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('일자별식수현황 (gen_4840M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4840M' OR MNU_NM LIKE '일자별식수현황%'
  const MENU_ID = 'TODO_gen_4840M';
  const API_URL = '/mis/gen/gen4800/getMealStdr.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4800/getMealStdr.do | inputCols=-
  test.skip('[no:1] 일자별식수현황 - 조회 (getMealStdr) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen4840/getData.do | inputCols=SCH_YM,SCH_FRM_DT,SCH_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:2] 일자별식수현황 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('식수급여공제확정 (gen_4850M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4850M' OR MNU_NM LIKE '식수급여공제확정%'
  const MENU_ID = 'TODO_gen_4850M';
  const API_URL = '/mis/gen/gen4850/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['MEAL_DCSN_NO', 'PAY_YM', 'DCSN_YN', 'DCSN_CNT', 'DCSN_DT', 'RCKN_FRM_DT', 'RCKN_TO_DT', 'RESL_YN', 'MEAL_TOT_AMT', 'SELF_TOT_AMT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4850/getData.do | inputCols=MEAL_DCSN_NO,PAY_YM,DCSN_YN,DCSN_CNT,DCSN_DT,RCKN_FRM_DT,RCKN_TO_DT,RESL_YN,MEAL_TOT_AMT,SELF_TOT_AMT
  test.skip('[no:1] 식수급여공제확정 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen4850/delData.do | inputCols=MEAL_DCSN_NO,PAY_YM,DCSN_YN,DCSN_CNT,DCSN_DT,RCKN_FRM_DT,RCKN_TO_DT,RESL_YN,MEAL_TOT_AMT,SELF_TOT_AMT
  test.skip('[no:2] 식수급여공제확정 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('식수지출발의신청 (gen_4860M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_4860M' OR MNU_NM LIKE '식수지출발의신청%'
  const MENU_ID = 'TODO_gen_4860M';
  const API_URL = '/mis/gen/gen4860/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_DCSN_YY', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen4860/getData.do | inputCols=SCH_DCSN_YY,SCH_APV_STAT_CD
  test.skip('[no:1] 식수지출발의신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen4860/setData.do | inputCols=tmHeader,APV_STAT_NM,APV_STAT_CD,RESL_NO,MEAL_DCSN_NO,DCSN_DT,RCKN_FRM_DT,RCKN_TO_DT,DCSN_CNT,MEAL_TOT_AMT,SELF_TOT_AMT,INSTT_TOT_AMT,RQST_AMT,GW_DOC_ID,IMG
  test.skip('[no:2] 식수지출발의신청 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사회공헌활동등록 (gen_5010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5010M' OR MNU_NM LIKE '사회공헌활동등록%'
  const MENU_ID = 'TODO_gen_5010M';
  const API_URL = '/mis/gen/gen5010/getSotyCnbMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SOTY_CNB_ACTV_CD', 'SCH_SOTY_CNB_ACTV_NM', 'SCH_ACTV_STAT_CD', 'SCH_ACTV_FRM_DT', 'SCH_ACTV_TO_DT', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5010/getSotyCnbMngList.do | inputCols=SCH_SOTY_CNB_ACTV_CD,SCH_SOTY_CNB_ACTV_NM,SCH_ACTV_STAT_CD,SCH_ACTV_FRM_DT,SCH_ACTV_TO_DT,SCH_RQST_FRM_DT,SCH_RQST_TO_DT
  test.skip('[no:1] 사회공헌활동등록 - 조회 (getSotyCnbMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사회공헌등록 상세 (gen_5011M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5011M' OR MNU_NM LIKE '사회공헌등록 상세%'
  const MENU_ID = 'TODO_gen_5011M';
  const API_URL = '/mis/gen/gen5011/getSotyCnbData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['tmHeader', 'SOTY_CNB_MNG_NO', 'SOTY_CNB_ACTV_CD', 'SOTY_CNB_ACTV_NM', 'RQST_FRM_DT', 'RQST_TO_DT', 'ACTV_FRM_DT', 'ACTV_TO_DT', 'ACTV_TP_CD', 'RECRT_NMPR', 'ACTV_STAT_CD', 'SOTY_CNB_ACTV_CONT', 'REQ_TIME', 'CNT_RQST'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5011/getSotyCnbData.do | inputCols=tmHeader,SOTY_CNB_MNG_NO,SOTY_CNB_ACTV_CD,SOTY_CNB_ACTV_NM,RQST_FRM_DT,RQST_TO_DT,ACTV_FRM_DT,ACTV_TO_DT,ACTV_TP_CD,RECRT_NMPR,ACTV_STAT_CD,SOTY_CNB_ACTV_CONT,REQ_TIME,CNT_RQST
  test.skip('[no:1] 사회공헌등록 상세 - 조회 (getSotyCnbData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5011/setSotyCnbData.do | inputCols=tmHeader,SOTY_CNB_MNG_NO,SOTY_CNB_ACTV_CD,SOTY_CNB_ACTV_NM,RQST_FRM_DT,RQST_TO_DT,ACTV_FRM_DT,ACTV_TO_DT,ACTV_TP_CD,RECRT_NMPR,ACTV_STAT_CD,SOTY_CNB_ACTV_CONT,REQ_TIME,CNT_RQST
  test.skip('[no:2] 사회공헌등록 상세 - 저장 (setSotyCnbData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen5011/delSotyCnbData.do | inputCols=tmHeader,SOTY_CNB_MNG_NO,SOTY_CNB_ACTV_CD,SOTY_CNB_ACTV_NM,RQST_FRM_DT,RQST_TO_DT,ACTV_FRM_DT,ACTV_TO_DT,ACTV_TP_CD,RECRT_NMPR,ACTV_STAT_CD,SOTY_CNB_ACTV_CONT,REQ_TIME,CNT_RQST
  test.skip('[no:3] 사회공헌등록 상세 - 삭제 (delSotyCnbData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사회공헌활동신청목록 (gen_5020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5020M' OR MNU_NM LIKE '사회공헌활동신청목록%'
  const MENU_ID = 'TODO_gen_5020M';
  const API_URL = '/mis/gen/gen5020/getSotyCnbRqstList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SOTY_CNB_ACTV_CD', 'SCH_SOTY_CNB_ACTV_NM', 'SCH_ACTV_STAT_CD', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NM', 'SCH_APNT_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5020/getSotyCnbRqstList.do | inputCols=SCH_SOTY_CNB_ACTV_CD,SCH_SOTY_CNB_ACTV_NM,SCH_ACTV_STAT_CD,SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NM,SCH_APNT_EMP_NO
  test.skip('[no:1] 사회공헌활동신청목록 - 조회 (getSotyCnbRqstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사회공헌활동신청상세 (gen_5021M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5021M' OR MNU_NM LIKE '사회공헌활동신청상세%'
  const MENU_ID = 'TODO_gen_5021M';
  const API_URL = '/mis/gen/gen5021/getSotyCnbRqstData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['tmHeader', 'SOTY_CNB_MNG_NO', 'SOTY_CNB_ACTV_CD', 'SOTY_CNB_ACTV_NM', 'RQST_FRM_DT', 'RQST_TO_DT', 'ACTV_FRM_DT', 'ACTV_TO_DT', 'ACTV_TP_CD', 'ACTV_STAT_CD', 'REQ_TIME', 'RECRT_NMPR', 'SOTY_CNB_ACTV_CONT', 'RQST_DE', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5021/getSotyCnbRqstData.do | inputCols=tmHeader,SOTY_CNB_MNG_NO,SOTY_CNB_ACTV_CD,SOTY_CNB_ACTV_NM,RQST_FRM_DT,RQST_TO_DT,ACTV_FRM_DT,ACTV_TO_DT,ACTV_TP_CD,ACTV_STAT_CD,REQ_TIME,RECRT_NMPR,SOTY_CNB_ACTV_CONT,RQST_DE,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,RQST_STAT_CD
  test.skip('[no:1] 사회공헌활동신청상세 - 조회 (getSotyCnbRqstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5021/setSotyCnbRqstData.do | inputCols=tmHeader,SOTY_CNB_MNG_NO,SOTY_CNB_ACTV_CD,SOTY_CNB_ACTV_NM,RQST_FRM_DT,RQST_TO_DT,ACTV_FRM_DT,ACTV_TO_DT,ACTV_TP_CD,ACTV_STAT_CD,REQ_TIME,RECRT_NMPR,SOTY_CNB_ACTV_CONT,RQST_DE,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,RQST_STAT_CD
  test.skip('[no:2] 사회공헌활동신청상세 - 저장 (setSotyCnbRqstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen5021/delSotyCnbRqstData.do | inputCols=tmHeader,SOTY_CNB_MNG_NO,SOTY_CNB_ACTV_CD,SOTY_CNB_ACTV_NM,RQST_FRM_DT,RQST_TO_DT,ACTV_FRM_DT,ACTV_TO_DT,ACTV_TP_CD,ACTV_STAT_CD,REQ_TIME,RECRT_NMPR,SOTY_CNB_ACTV_CONT,RQST_DE,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,RQST_STAT_CD
  test.skip('[no:3] 사회공헌활동신청상세 - 삭제 (delSotyCnbRqstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사회공헌활동현황 (gen_5030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5030M' OR MNU_NM LIKE '사회공헌활동현황%'
  const MENU_ID = 'TODO_gen_5030M';
  const API_URL = '/mis/gen/gen5030/getSotyCnbList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SOTY_CNB_ACTV_CD', 'SCH_SOTY_CNB_ACTV_NM', 'SCH_ACTV_STAT_CD', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NM', 'SCH_APNT_EMP_NO', 'SCH_ACTV_FRM_DT', 'SCH_ACTV_TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5030/getSotyCnbList.do | inputCols=SCH_SOTY_CNB_ACTV_CD,SCH_SOTY_CNB_ACTV_NM,SCH_ACTV_STAT_CD,SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NM,SCH_APNT_EMP_NO,SCH_ACTV_FRM_DT,SCH_ACTV_TO_DT
  test.skip('[no:1] 사회공헌활동현황 - 조회 (getSotyCnbList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사회공헌활동상세현황 (gen_5040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5040M' OR MNU_NM LIKE '사회공헌활동상세현황%'
  const MENU_ID = 'TODO_gen_5040M';
  const API_URL = '/mis/gen/gen5040/getSotyCnbDtlList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SOTY_CNB_ACTV_CD', 'SCH_SOTY_CNB_ACTV_NM', 'SCH_ACTV_STAT_CD', 'SCH_REAL_ACTV_FRM_DT', 'SCH_REAL_ACTV_TO_DT', 'SCH_APNT_EMP_NM', 'SCH_APNT_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5040/getSotyCnbDtlList.do | inputCols=SCH_SOTY_CNB_ACTV_CD,SCH_SOTY_CNB_ACTV_NM,SCH_ACTV_STAT_CD,SCH_REAL_ACTV_FRM_DT,SCH_REAL_ACTV_TO_DT,SCH_APNT_EMP_NM,SCH_APNT_EMP_NO
  test.skip('[no:1] 사회공헌활동상세현황 - 조회 (getSotyCnbDtlList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사회공헌활동관리 (gen_5050M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5050M' OR MNU_NM LIKE '사회공헌활동관리%'
  const MENU_ID = 'TODO_gen_5050M';
  const API_URL = '/mis/gen/gen5050/getSotyCnbRqstTimeList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SOTY_CNB_MNG_NO', 'SCH_SOTY_CNB_ACTV_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5050/getSotyCnbRqstTimeList.do | inputCols=SCH_SOTY_CNB_MNG_NO,SCH_SOTY_CNB_ACTV_NM
  test.skip('[no:1] 사회공헌활동관리 - 조회 (getSotyCnbRqstTimeList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen5050/setSotyCnbRqstTimeList.do | inputCols=tmHeader,SOTY_CNB_MNG_NO,SOTY_CNB_ACTV_CD,SOTY_CNB_ACTV_NM,RQST_FRM_DT,RQST_TO_DT,ACTV_FRM_DT,ACTV_TO_DT,ACTV_TP_CD,ACTV_STAT_CD,REQ_TIME,RECRT_NMPR,SOTY_CNB_ACTV_CONT,RQST_DE,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,RQST_STAT_CD
  test.skip('[no:2] 사회공헌활동관리 - 조회 (setSotyCnbRqstTimeList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('통신요금지원금신청목록 (gen_5100M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5100M' OR MNU_NM LIKE '통신요금지원금신청목록%'
  const MENU_ID = 'TODO_gen_5100M';
  const API_URL = '/mis/gen/gen5100/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5100/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 통신요금지원금신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('통신요금지원금신청상세 (gen_5101M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5101M' OR MNU_NM LIKE '통신요금지원금신청상세%'
  const MENU_ID = 'TODO_gen_5101M';
  const API_URL = '/mis/gen/gen5101/getPmtAcc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['COMT_RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'APNT_GRD_NM', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'GRD_CD', 'GRD_NM', 'COMT_CHGE_YM', 'COMT_CHGE_RSN', 'COMT_CHGE_RQET_AMT', 'BK_CD', 'BK_NM', 'ACC_NO', 'DPSIT', 'RQST_STAT_CD', 'RQST_STAT_NM', 'FLOC_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5101/getPmtAcc.do | inputCols=COMT_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,GRD_CD,GRD_NM,COMT_CHGE_YM,COMT_CHGE_RSN,COMT_CHGE_RQET_AMT,BK_CD,BK_NM,ACC_NO,DPSIT,RQST_STAT_CD,RQST_STAT_NM,FLOC_CD
  test.skip('[no:1] 통신요금지원금신청상세 - 조회 (getPmtAcc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen5101/getData.do | inputCols=COMT_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,GRD_CD,GRD_NM,COMT_CHGE_YM,COMT_CHGE_RSN,COMT_CHGE_RQET_AMT,BK_CD,BK_NM,ACC_NO,DPSIT,RQST_STAT_CD,RQST_STAT_NM,FLOC_CD
  test.skip('[no:2] 통신요금지원금신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5101/setData.do | inputCols=COMT_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,GRD_CD,GRD_NM,COMT_CHGE_YM,COMT_CHGE_RSN,COMT_CHGE_RQET_AMT,BK_CD,BK_NM,ACC_NO,DPSIT,RQST_STAT_CD,RQST_STAT_NM,FLOC_CD
  test.skip('[no:3] 통신요금지원금신청상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen5101/delData.do | inputCols=COMT_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,GRD_CD,GRD_NM,COMT_CHGE_YM,COMT_CHGE_RSN,COMT_CHGE_RQET_AMT,BK_CD,BK_NM,ACC_NO,DPSIT,RQST_STAT_CD,RQST_STAT_NM,FLOC_CD
  test.skip('[no:4] 통신요금지원금신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('통신요금지원금승인관리 (gen_5110M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5110M' OR MNU_NM LIKE '통신요금지원금승인관리%'
  const MENU_ID = 'TODO_gen_5110M';
  const API_URL = '/mis/gen/gen5110/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5110/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 통신요금지원금승인관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5110/setData.do | inputCols=isChecked,tmHeader,COMT_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,COMT_CHGE_RQET_AMT,COMT_UPT_RQET_AMT,RQST_STAT_CD,RQST_STAT_NM
  test.skip('[no:2] 통신요금지원금승인관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기부금활동관리 상세 (gen_5111M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5111M' OR MNU_NM LIKE '기부금활동관리 상세%'
  const MENU_ID = 'TODO_gen_5111M';
  const API_URL = '/mis/gen/gen5111/getCtnyMngData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CTNY_MNG_NO', 'CNTN_NM', 'CNTN_RQST_FRM_DT', 'CNTN_RQST_TO_DT', 'RECRT_GOAL_AMT', 'PMT_INFO', 'PMT_DT', 'CNTN_CONT', 'SAL_PMT_YM', 'SAL_PMT_SEQ', 'SAL_ITM_CD', 'SAL_ITM_NM', 'CNTN_TP_CD', 'DUC_RQST_CLOS_DT', 'SAL_DUC_REFI_YN', 'MIN_RQST_DT', 'MAX_RQST_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5111/getCtnyMngData.do | inputCols=CTNY_MNG_NO,CNTN_NM,CNTN_RQST_FRM_DT,CNTN_RQST_TO_DT,RECRT_GOAL_AMT,PMT_INFO,PMT_DT,CNTN_CONT,SAL_PMT_YM,SAL_PMT_SEQ,SAL_ITM_CD,SAL_ITM_NM,CNTN_TP_CD,DUC_RQST_CLOS_DT,SAL_DUC_REFI_YN,MIN_RQST_DT,MAX_RQST_DT
  test.skip('[no:1] 기부금활동관리 상세 - 조회 (getCtnyMngData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5111/setCtnyMngData.do | inputCols=CTNY_MNG_NO,CNTN_NM,CNTN_RQST_FRM_DT,CNTN_RQST_TO_DT,RECRT_GOAL_AMT,PMT_INFO,PMT_DT,CNTN_CONT,SAL_PMT_YM,SAL_PMT_SEQ,SAL_ITM_CD,SAL_ITM_NM,CNTN_TP_CD,DUC_RQST_CLOS_DT,SAL_DUC_REFI_YN,MIN_RQST_DT,MAX_RQST_DT
  test.skip('[no:2] 기부금활동관리 상세 - 저장 (setCtnyMngData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen5111/delCtnyMngData.do | inputCols=CTNY_MNG_NO,CNTN_NM,CNTN_RQST_FRM_DT,CNTN_RQST_TO_DT,RECRT_GOAL_AMT,PMT_INFO,PMT_DT,CNTN_CONT,SAL_PMT_YM,SAL_PMT_SEQ,SAL_ITM_CD,SAL_ITM_NM,CNTN_TP_CD,DUC_RQST_CLOS_DT,SAL_DUC_REFI_YN,MIN_RQST_DT,MAX_RQST_DT
  test.skip('[no:3] 기부금활동관리 상세 - 삭제 (delCtnyMngData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('통신요금지원금일괄지급신청목록 (gen_5120M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5120M' OR MNU_NM LIKE '통신요금지원금일괄지급신청목록%'
  const MENU_ID = 'TODO_gen_5120M';
  const API_URL = '/mis/gen/gen5120/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5120/getData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APV_STAT_CD
  test.skip('[no:1] 통신요금지원금일괄지급신청목록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('통신요금지원금일괄지급신청상세 (gen_5121M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5121M' OR MNU_NM LIKE '통신요금지원금일괄지급신청상세%'
  const MENU_ID = 'TODO_gen_5121M';
  const API_URL = '/mis/gen/gen5121/getDataNew.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['COMT_RQST_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5121/getDataNew.do | inputCols=COMT_RQST_NO
  test.skip('[no:1] 통신요금지원금일괄지급신청상세 - 조회 (getDataNew) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen5121/getData.do | inputCols=RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,APNT_GRD_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,RESL_NO
  test.skip('[no:2] 통신요금지원금일괄지급신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5121/setData.do | inputCols=RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,APNT_GRD_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,RESL_NO
  test.skip('[no:3] 통신요금지원금일괄지급신청상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen5121/delData.do | inputCols=RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,APNT_GRD_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,RESL_NO
  test.skip('[no:4] 통신요금지원금일괄지급신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기부금활동현황 (gen_5130M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5130M' OR MNU_NM LIKE '기부금활동현황%'
  const MENU_ID = 'TODO_gen_5130M';
  const API_URL = '/mis/gen/gen5130/getCtnyList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_CNTN_RQST_FRM_DT', 'SCH_CNTN_RQST_TO_DT', 'SCH_CNTN_NM', 'SCH_PRGM_STAT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5130/getCtnyList.do | inputCols=SCH_CNTN_RQST_FRM_DT,SCH_CNTN_RQST_TO_DT,SCH_CNTN_NM,SCH_PRGM_STAT
  test.skip('[no:1] 기부금활동현황 - 조회 (getCtnyList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기부금활동상세현황 (gen_5140M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5140M' OR MNU_NM LIKE '기부금활동상세현황%'
  const MENU_ID = 'TODO_gen_5140M';
  const API_URL = '/mis/gen/gen5140/getCtnyDtlList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_CNTN_RQST_FRM_DT', 'SCH_CNTN_RQST_TO_DT', 'SCH_CNTN_NM', 'SCH_EMP_NM', 'SCH_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5140/getCtnyDtlList.do | inputCols=SCH_CNTN_RQST_FRM_DT,SCH_CNTN_RQST_TO_DT,SCH_CNTN_NM,SCH_EMP_NM,SCH_EMP_NO
  test.skip('[no:1] 기부금활동상세현황 - 조회 (getCtnyDtlList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('동호회운영신청목록 (gen_5400M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5400M' OR MNU_NM LIKE '동호회운영신청목록%'
  const MENU_ID = 'TODO_gen_5400M';
  const API_URL = '/mis/gen/gen5400/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_CLB_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5400/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_CLB_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 동호회운영신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('동호회운영신청상세 (gen_5401M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5401M' OR MNU_NM LIKE '동호회운영신청상세%'
  const MENU_ID = 'TODO_gen_5401M';
  const API_URL = '/mis/gen/gen5401/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CLB_RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'CLB_NM', 'CLB_FNTN_DT', 'REPRES_EMP_NO', 'REPRES_EMP_NM', 'REPRES_DEPT_CD', 'REPRES_DEPT_NM', 'RQST_STAT_NM', 'RQST_STAT_CD', 'CLB_ESTB_PPS', 'CLB_OPRT_PLAN', 'CLB_STAT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5401/getData.do | inputCols=CLB_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,CLB_NM,CLB_FNTN_DT,REPRES_EMP_NO,REPRES_EMP_NM,REPRES_DEPT_CD,REPRES_DEPT_NM,RQST_STAT_NM,RQST_STAT_CD,CLB_ESTB_PPS,CLB_OPRT_PLAN,CLB_STAT
  test.skip('[no:1] 동호회운영신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5401/setData.do | inputCols=CLB_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,CLB_NM,CLB_FNTN_DT,REPRES_EMP_NO,REPRES_EMP_NM,REPRES_DEPT_CD,REPRES_DEPT_NM,RQST_STAT_NM,RQST_STAT_CD,CLB_ESTB_PPS,CLB_OPRT_PLAN,CLB_STAT
  test.skip('[no:2] 동호회운영신청상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen5401/delData.do | inputCols=CLB_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,CLB_NM,CLB_FNTN_DT,REPRES_EMP_NO,REPRES_EMP_NM,REPRES_DEPT_CD,REPRES_DEPT_NM,RQST_STAT_NM,RQST_STAT_CD,CLB_ESTB_PPS,CLB_OPRT_PLAN,CLB_STAT
  test.skip('[no:3] 동호회운영신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('동호회운영승인관리 (gen_5405M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5405M' OR MNU_NM LIKE '동호회운영승인관리%'
  const MENU_ID = 'TODO_gen_5405M';
  const API_URL = '/mis/gen/gen5405/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_CLB_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5405/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_CLB_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 동호회운영승인관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5405/setReject.do | inputCols=isChecked,tmHeader,CLB_RQST_NO,RQST_DT,CLB_NM,REPRES_EMP_NO,REPRES_EMP_NM,REPRES_DEPT_CD,REPRES_DEPT_NM,CLB_FNTN_DT,RQST_STAT_CD,RQST_STAT_NM
  test.skip('[no:2] 동호회운영승인관리 - 저장 (setReject) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5405/setApprov.do | inputCols=isChecked,tmHeader,CLB_RQST_NO,RQST_DT,CLB_NM,REPRES_EMP_NO,REPRES_EMP_NM,REPRES_DEPT_CD,REPRES_DEPT_NM,CLB_FNTN_DT,RQST_STAT_CD,RQST_STAT_NM
  test.skip('[no:3] 동호회운영승인관리 - 저장 (setApprov) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('동호회관리 (gen_5410M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5410M' OR MNU_NM LIKE '동호회관리%'
  const MENU_ID = 'TODO_gen_5410M';
  const API_URL = '/mis/gen/gen5410/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_FRM_DT', 'SCH_TO_DT', 'SCH_CLB_CD', 'SCH_CLB_NM', 'SCH_CLB_STAT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5410/getList.do | inputCols=SCH_EMP_NO,SCH_EMP_NM,SCH_FRM_DT,SCH_TO_DT,SCH_CLB_CD,SCH_CLB_NM,SCH_CLB_STAT
  test.skip('[no:1] 동호회관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('동호회회원관리 (gen_5411M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5411M' OR MNU_NM LIKE '동호회회원관리%'
  const MENU_ID = 'TODO_gen_5411M';
  const API_URL = '/mis/gen/gen5411/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CLB_RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'CLB_MNG_NO', 'REPRES_EMP_NO', 'REPRES_EMP_NM', 'CLB_NM', 'CLB_FNTN_DT', 'CLB_DSLN_DT', 'CLB_STAT', 'CLB_STAT_NM', 'CLB_ESTB_PPS', 'CLB_OPRT_PLAN', 'MBER_CNT', 'DPSIT', 'BK_CD', 'BK_NM', 'ACC_NO', 'CRTFC_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5411/getData.do | inputCols=CLB_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,CLB_MNG_NO,REPRES_EMP_NO,REPRES_EMP_NM,CLB_NM,CLB_FNTN_DT,CLB_DSLN_DT,CLB_STAT,CLB_STAT_NM,CLB_ESTB_PPS,CLB_OPRT_PLAN,MBER_CNT,DPSIT,BK_CD,BK_NM,ACC_NO,CRTFC_YN
  test.skip('[no:1] 동호회회원관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('동호회지원금신청목록 (gen_5420M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5420M' OR MNU_NM LIKE '동호회지원금신청목록%'
  const MENU_ID = 'TODO_gen_5420M';
  const API_URL = '/mis/gen/gen5420/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_CLB_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5420/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_CLB_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 동호회지원금신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('동호회지원금신청상세 (gen_5421M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5421M' OR MNU_NM LIKE '동호회지원금신청상세%'
  const MENU_ID = 'TODO_gen_5421M';
  const API_URL = '/mis/gen/gen5421/getPmtAcc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CLB_SUPMN_RQST_NO', 'CLB_MNG_NO', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'RQST_DT', 'ACTV_NM', 'REQ_BUDG', 'PARPT_CNT', 'ACTV_CONT', 'CAL_DTS', 'RMK', 'RQST_STAT_CD', 'RQST_STAT_NM', 'CLB_NM', 'REPRES_EMP_NO', 'REPRES_EMP_NM', 'MBER_CNT', 'BK_CD', 'BK_NM', 'ACC_NO', 'DPSIT', 'FRL_MBER_CNT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5421/getPmtAcc.do | inputCols=CLB_SUPMN_RQST_NO,CLB_MNG_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_DT,ACTV_NM,REQ_BUDG,PARPT_CNT,ACTV_CONT,CAL_DTS,RMK,RQST_STAT_CD,RQST_STAT_NM,CLB_NM,REPRES_EMP_NO,REPRES_EMP_NM,MBER_CNT,BK_CD,BK_NM,ACC_NO,DPSIT,FRL_MBER_CNT
  test.skip('[no:1] 동호회지원금신청상세 - 조회 (getPmtAcc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen5421/getComboData.do | inputCols=CLB_SUPMN_RQST_NO,CLB_MNG_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_DT,ACTV_NM,REQ_BUDG,PARPT_CNT,ACTV_CONT,CAL_DTS,RMK,RQST_STAT_CD,RQST_STAT_NM,CLB_NM,REPRES_EMP_NO,REPRES_EMP_NM,MBER_CNT,BK_CD,BK_NM,ACC_NO,DPSIT,FRL_MBER_CNT
  test.skip('[no:2] 동호회지원금신청상세 - 조회 (getComboData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen5421/getCombo.do | inputCols=CLB_SUPMN_RQST_NO,CLB_MNG_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_DT,ACTV_NM,REQ_BUDG,PARPT_CNT,ACTV_CONT,CAL_DTS,RMK,RQST_STAT_CD,RQST_STAT_NM,CLB_NM,REPRES_EMP_NO,REPRES_EMP_NM,MBER_CNT,BK_CD,BK_NM,ACC_NO,DPSIT,FRL_MBER_CNT
  test.skip('[no:3] 동호회지원금신청상세 - 조회 (getCombo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5421/setData.do | inputCols=CLB_SUPMN_RQST_NO,CLB_MNG_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_DT,ACTV_NM,REQ_BUDG,PARPT_CNT,ACTV_CONT,CAL_DTS,RMK,RQST_STAT_CD,RQST_STAT_NM,CLB_NM,REPRES_EMP_NO,REPRES_EMP_NM,MBER_CNT,BK_CD,BK_NM,ACC_NO,DPSIT,FRL_MBER_CNT
  test.skip('[no:4] 동호회지원금신청상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen5421/delData.do | inputCols=CLB_SUPMN_RQST_NO,CLB_MNG_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_DT,ACTV_NM,REQ_BUDG,PARPT_CNT,ACTV_CONT,CAL_DTS,RMK,RQST_STAT_CD,RQST_STAT_NM,CLB_NM,REPRES_EMP_NO,REPRES_EMP_NM,MBER_CNT,BK_CD,BK_NM,ACC_NO,DPSIT,FRL_MBER_CNT
  test.skip('[no:5] 동호회지원금신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('동호회지원금승인관리 (gen_5430M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5430M' OR MNU_NM LIKE '동호회지원금승인관리%'
  const MENU_ID = 'TODO_gen_5430M';
  const API_URL = '/mis/gen/gen5430/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_CLB_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5430/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_CLB_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 동호회지원금승인관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('동호회지원금일괄지급신청목록 (gen_5440M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5440M' OR MNU_NM LIKE '동호회지원금일괄지급신청목록%'
  const MENU_ID = 'TODO_gen_5440M';
  const API_URL = '/mis/gen/gen5440/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5440/getData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APV_STAT_CD
  test.skip('[no:1] 동호회지원금일괄지급신청목록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('동호회지원금일괄지급신청상세 (gen_5441M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5441M' OR MNU_NM LIKE '동호회지원금일괄지급신청상세%'
  const MENU_ID = 'TODO_gen_5441M';
  const API_URL = '/mis/gen/gen5441/getDataNew.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CLB_SUPMN_RQST_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5441/getDataNew.do | inputCols=CLB_SUPMN_RQST_NO
  test.skip('[no:1] 동호회지원금일괄지급신청상세 - 조회 (getDataNew) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen5441/getData.do | inputCols=RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,APNT_GRD_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,RESL_NO
  test.skip('[no:2] 동호회지원금일괄지급신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5441/setData.do | inputCols=RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,APNT_GRD_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,RESL_NO
  test.skip('[no:3] 동호회지원금일괄지급신청상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen5441/delData.do | inputCols=RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_GRD_CD,APNT_GRD_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,RESL_NO
  test.skip('[no:4] 동호회지원금일괄지급신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('홍보물관리 (gen_5540M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5540M' OR MNU_NM LIKE '홍보물관리%'
  const MENU_ID = 'TODO_gen_5540M';
  const API_URL = '/mis/gen/gen5540/getGenPrThingMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_MNCT_FROM_DT', 'SCH_MNCT_TO_DT', 'SCH_PR_THING_FG_CD', 'SCH_PR_THING_NM', 'SCH_WDTB_PLC'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5540/getGenPrThingMngList.do | inputCols=SCH_MNCT_FROM_DT,SCH_MNCT_TO_DT,SCH_PR_THING_FG_CD,SCH_PR_THING_NM,SCH_WDTB_PLC
  test.skip('[no:1] 홍보물관리 - 조회 (getGenPrThingMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('유관기관관리 (gen_5560M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5560M' OR MNU_NM LIKE '유관기관관리%'
  const MENU_ID = 'TODO_gen_5560M';
  const API_URL = '/mis/gen/gen5560/getGenReteOrganMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RETE_ORGAN_TP_CD', 'SCH_RETE_ORGAN_NM', 'SCH_PCHRG_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5560/getGenReteOrganMngList.do | inputCols=SCH_RETE_ORGAN_TP_CD,SCH_RETE_ORGAN_NM,SCH_PCHRG_NM
  test.skip('[no:1] 유관기관관리 - 조회 (getGenReteOrganMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5560/setGenReteOrganMngData.do | inputCols=isChecked,tmHeader,RETE_ORGAN_MNG_NO,RETE_ORGAN_TP_CD,RETE_ORGAN_NM,REPRES_NM,PCHRG_NM,PCHRG_TEL_NO,PCHRG_MAIL,ORGAN_ADDR,IOCT_FG_CD,RMK
  test.skip('[no:2] 유관기관관리 - 저장 (setGenReteOrganMngData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기념품등록관리 (gen_5570M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5570M' OR MNU_NM LIKE '기념품등록관리%'
  const MENU_ID = 'TODO_gen_5570M';
  const API_URL = '/mis/gen/gen5570/getGenSvnrMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SVNR_NM', 'SCH_SVNR_INS_FRM_DT', 'SCH_SVNR_INS_TO_DT', 'SCH_MNCT_ENTP_NM', 'SCH_SVNR_RQST_POSL_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5570/getGenSvnrMngList.do | inputCols=SCH_SVNR_NM,SCH_SVNR_INS_FRM_DT,SCH_SVNR_INS_TO_DT,SCH_MNCT_ENTP_NM,SCH_SVNR_RQST_POSL_YN
  test.skip('[no:1] 기념품등록관리 - 조회 (getGenSvnrMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기념품신청 (gen_5580M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5580M' OR MNU_NM LIKE '기념품신청%'
  const MENU_ID = 'TODO_gen_5580M';
  const API_URL = '/mis/gen/gen5580/getSvnrRqstData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_RVER_EMP_NO', 'SCH_RVER_EMP_NM', 'SCH_PMT_FRM_DT', 'SCH_PMT_TO_DT', 'SCH_SVNR_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5580/getSvnrRqstData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_RVER_EMP_NO,SCH_RVER_EMP_NM,SCH_PMT_FRM_DT,SCH_PMT_TO_DT,SCH_SVNR_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 기념품신청 - 조회 (getSvnrRqstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기념품신청상세 (gen_5581M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5581M' OR MNU_NM LIKE '기념품신청상세%'
  const MENU_ID = 'TODO_gen_5581M';
  const API_URL = '/mis/gen/gen5581/setGenSvnrRqstNDtlData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen5581/setGenSvnrRqstNDtlData.do | inputCols=tmHeader,SVNR_RQST_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,USE_PPS,RVER_EMP_NO,RVER_EMP_NM,RVER_DEPT_CD,RVER_DEPT_NM,RECT_HOPE_DT,PMT_YN,PMT_DT,RMK
  test.skip('[no:1] 기념품신청상세 - 저장 (setGenSvnrRqstNDtlData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen5581/delGenSvnrRqstNDtlData.do | inputCols=tmHeader,SVNR_RQST_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_DT,RQST_STAT_CD,RQST_STAT_NM,USE_PPS,RVER_EMP_NO,RVER_EMP_NM,RVER_DEPT_CD,RVER_DEPT_NM,RECT_HOPE_DT,PMT_YN,PMT_DT,RMK
  test.skip('[no:2] 기념품신청상세 - 삭제 (delGenSvnrRqstNDtlData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('상조회정보관리 (gen_5700M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5700M' OR MNU_NM LIKE '상조회정보관리%'
  const MENU_ID = 'TODO_gen_5700M';
  const API_URL = '/mis/gen/gen5700/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CPRT_MNG_NO', 'CPRT_NM', 'LOAN_INRS', 'RCOM_BK_CD', 'RCOM_BK_NM', 'RCOM_ACC_NO', 'RCOM_DPSIT', 'DEFR_BK_CD', 'DEFR_BK_NM', 'DEFR_ACC_NO', 'DEFR_DPSIT', 'CHRMN_EMP_NM', 'CHRMN_EMP_NO', 'CHRMN_DEPT_CD', 'CHRMN_DEPT_NM', 'VICE_CHRMN_EMP_NM', 'VICE_CHRMN_EMP_NO', 'VICE_CHRMN_DEPT_CD', 'VICE_CHRMN_DEPT_NM', 'GRFR1_EMP_NM', 'GRFR1_EMP_NO', 'GRFR1_DEPT_CD', 'GRFR1_DEPT_NM', 'GRFR2_EMP_NM', 'GRFR2_EMP_NO', 'GRFR2_DEPT_CD', 'GRFR2_DEPT_NM', 'AUD_EMP_NM', 'AUD_EMP_NO', 'AUD_DEPT_CD', 'AUD_DEPT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5700/getData.do | inputCols=CPRT_MNG_NO,CPRT_NM,LOAN_INRS,RCOM_BK_CD,RCOM_BK_NM,RCOM_ACC_NO,RCOM_DPSIT,DEFR_BK_CD,DEFR_BK_NM,DEFR_ACC_NO,DEFR_DPSIT,CHRMN_EMP_NM,CHRMN_EMP_NO,CHRMN_DEPT_CD,CHRMN_DEPT_NM,VICE_CHRMN_EMP_NM,VICE_CHRMN_EMP_NO,VICE_CHRMN_DEPT_CD,VICE_CHRMN_DEPT_NM,GRFR1_EMP_NM,GRFR1_EMP_NO,GRFR1_DEPT_CD,GRFR1_DEPT_NM,GRFR2_EMP_NM,GRFR2_EMP_NO,GRFR2_DEPT_CD,GRFR2_DEPT_NM,AUD_EMP_NM,AUD_EMP_NO,AUD_DEPT_CD,AUD_DEPT_NM
  test.skip('[no:1] 상조회정보관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5700/setData.do | inputCols=CPRT_MNG_NO,CPRT_NM,LOAN_INRS,RCOM_BK_CD,RCOM_BK_NM,RCOM_ACC_NO,RCOM_DPSIT,DEFR_BK_CD,DEFR_BK_NM,DEFR_ACC_NO,DEFR_DPSIT,CHRMN_EMP_NM,CHRMN_EMP_NO,CHRMN_DEPT_CD,CHRMN_DEPT_NM,VICE_CHRMN_EMP_NM,VICE_CHRMN_EMP_NO,VICE_CHRMN_DEPT_CD,VICE_CHRMN_DEPT_NM,GRFR1_EMP_NM,GRFR1_EMP_NO,GRFR1_DEPT_CD,GRFR1_DEPT_NM,GRFR2_EMP_NM,GRFR2_EMP_NO,GRFR2_DEPT_CD,GRFR2_DEPT_NM,AUD_EMP_NM,AUD_EMP_NO,AUD_DEPT_CD,AUD_DEPT_NM
  test.skip('[no:2] 상조회정보관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('상조회원명단관리 (gen_5701M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5701M' OR MNU_NM LIKE '상조회원명단관리%'
  const MENU_ID = 'TODO_gen_5701M';
  const API_URL = '/mis/gen/gen5701/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_HLDF_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5701/getList.do | inputCols=SCH_FRM_DT,SCH_TO_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_HLDF_FG_CD
  test.skip('[no:1] 상조회원명단관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5701/setData.do | inputCols=isChecked,tmHeader,SEQ,CPRT_MNG_NO,CPRT_EMP_NO,CPRT_EMP_NM,CPRT_DEPT_CD,CPRT_DEPT_NM,CPRT_GRD_CD,CPRT_GRD_NM,CELL_TEL_NO,JOIN_DT,STOP_FRM_DT,STOP_TO_DT,RSIGN_DT,FRST_PAY_DT,LAST_PAY_DT
  test.skip('[no:2] 상조회원명단관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('상조회대부금신청목록 (gen_5710M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5710M' OR MNU_NM LIKE '상조회대부금신청목록%'
  const MENU_ID = 'TODO_gen_5710M';
  const API_URL = '/mis/gen/gen5710/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_RQST_STAT_CD', 'SIGN_STAT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5710/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_RQST_STAT_CD,SIGN_STAT_NM
  test.skip('[no:1] 상조회대부금신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('상조회대부금신청상세 (gen_5711M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5711M' OR MNU_NM LIKE '상조회대부금신청상세%'
  const MENU_ID = 'TODO_gen_5711M';
  const API_URL = '/mis/gen/gen5711/getInitData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['LOAN_RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'APNT_GRD_NM', 'RQST_STAT_CD', 'RQST_STAT_NM', 'RQST_RSN', 'RQST_AMT', 'BK_CD', 'BK_NM', 'ACC_NO', 'DPSIT', 'LOAN_YEARS', 'LOAN_INRS', 'ADDR', 'CELL_TEL_NO', 'AGREE_YN', 'SIGN_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5711/getInitData.do | inputCols=LOAN_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,RQST_STAT_CD,RQST_STAT_NM,RQST_RSN,RQST_AMT,BK_CD,BK_NM,ACC_NO,DPSIT,LOAN_YEARS,LOAN_INRS,ADDR,CELL_TEL_NO,AGREE_YN,SIGN_STAT_CD
  test.skip('[no:1] 상조회대부금신청상세 - 조회 (getInitData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen5711/getData.do | inputCols=LOAN_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,RQST_STAT_CD,RQST_STAT_NM,RQST_RSN,RQST_AMT,BK_CD,BK_NM,ACC_NO,DPSIT,LOAN_YEARS,LOAN_INRS,ADDR,CELL_TEL_NO,AGREE_YN,SIGN_STAT_CD
  test.skip('[no:2] 상조회대부금신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen5711/delData.do | inputCols=LOAN_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,RQST_STAT_CD,RQST_STAT_NM,RQST_RSN,RQST_AMT,BK_CD,BK_NM,ACC_NO,DPSIT,LOAN_YEARS,LOAN_INRS,ADDR,CELL_TEL_NO,AGREE_YN,SIGN_STAT_CD
  test.skip('[no:3] 상조회대부금신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('상조회대부금승인관리 (gen_5720M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5720M' OR MNU_NM LIKE '상조회대부금승인관리%'
  const MENU_ID = 'TODO_gen_5720M';
  const API_URL = '/mis/gen/gen5720/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5720/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 상조회대부금승인관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen5720/getConfNo.do | inputCols=-
  test.skip('[no:2] 상조회대부금승인관리 - 조회 (getConfNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('상조회대부금급여공제현황 (gen_5730M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5730M' OR MNU_NM LIKE '상조회대부금급여공제현황%'
  const MENU_ID = 'TODO_gen_5730M';
  const API_URL = '/mis/gen/gen5730/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YYMM', 'SCH_EMP_NO', 'SCH_EMP_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5730/getList.do | inputCols=SCH_YYMM,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:1] 상조회대부금급여공제현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('상조회대부금급여공제관리 (gen_5740M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5740M' OR MNU_NM LIKE '상조회대부금급여공제관리%'
  const MENU_ID = 'TODO_gen_5740M';
  const API_URL = '/mis/gen/gen5740/getMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_LOAN_MNG_NO', 'SCH_RPAY_FRM_YM', 'SCH_RPAY_TO_YM', 'SCH_PLAN_CREAT_YN', 'SCH_EXPR_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5740/getMngList.do | inputCols=SCH_LOAN_MNG_NO,SCH_RPAY_FRM_YM,SCH_RPAY_TO_YM,SCH_PLAN_CREAT_YN,SCH_EXPR_YN
  test.skip('[no:1] 상조회대부금급여공제관리 - 조회 (getMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen5740/getData.do | inputCols=LOAN_MNG_NO,EMP_NO
  test.skip('[no:2] 상조회대부금급여공제관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5740/setCreateData.do | inputCols=LOAN_MNG_NO,EMP_NO
  test.skip('[no:3] 상조회대부금급여공제관리 - 저장 (setCreateData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5740/setData.do | inputCols=LOAN_MNG_NO,EMP_NO
  test.skip('[no:4] 상조회대부금급여공제관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5740/setExprYn.do | inputCols=LOAN_MNG_NO,EMP_NO,EMP_NM,LOAN_AMT,TOT_LOAN_AMT,IRST_AMT,RPAY_AMT,LOAN_BALC,EXPR_YN
  test.skip('[no:5] 상조회대부금급여공제관리 - 저장 (setExprYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('공제금신청목록 (gen_5750M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5750M' OR MNU_NM LIKE '공제금신청목록%'
  const MENU_ID = 'TODO_gen_5750M';
  const API_URL = '/mis/gen/gen5750/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_RQST_STAT_CD', 'SIGN_STAT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5750/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_RQST_STAT_CD,SIGN_STAT_NM
  test.skip('[no:1] 공제금신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('공제금신청상세 (gen_5751M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5751M' OR MNU_NM LIKE '공제금신청상세%'
  const MENU_ID = 'TODO_gen_5751M';
  const API_URL = '/mis/gen/gen5751/getPmtAcc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['DUC_RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'APNT_GRD_NM', 'RQST_STAT_CD', 'RQST_STAT_NM', 'RQST_FG', 'RQST_DTL_FG', 'RQST_DTL_FG_NM', 'BK_CD', 'BK_NM', 'ACC_NO', 'DPSIT', 'RQST_AMT', 'RQST_RSN', 'SIGN_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5751/getPmtAcc.do | inputCols=DUC_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,RQST_STAT_CD,RQST_STAT_NM,RQST_FG,RQST_DTL_FG,RQST_DTL_FG_NM,BK_CD,BK_NM,ACC_NO,DPSIT,RQST_AMT,RQST_RSN,SIGN_STAT_CD
  test.skip('[no:1] 공제금신청상세 - 조회 (getPmtAcc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen5751/getRqstDtlCd.do | inputCols=DUC_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,RQST_STAT_CD,RQST_STAT_NM,RQST_FG,RQST_DTL_FG,RQST_DTL_FG_NM,BK_CD,BK_NM,ACC_NO,DPSIT,RQST_AMT,RQST_RSN,SIGN_STAT_CD
  test.skip('[no:2] 공제금신청상세 - 조회 (getRqstDtlCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen5751/getData.do | inputCols=DUC_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,RQST_STAT_CD,RQST_STAT_NM,RQST_FG,RQST_DTL_FG,RQST_DTL_FG_NM,BK_CD,BK_NM,ACC_NO,DPSIT,RQST_AMT,RQST_RSN,SIGN_STAT_CD
  test.skip('[no:3] 공제금신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen5751/delData.do | inputCols=DUC_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,RQST_STAT_CD,RQST_STAT_NM,RQST_FG,RQST_DTL_FG,RQST_DTL_FG_NM,BK_CD,BK_NM,ACC_NO,DPSIT,RQST_AMT,RQST_RSN,SIGN_STAT_CD
  test.skip('[no:4] 공제금신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('공제금승인관리 (gen_5760M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5760M' OR MNU_NM LIKE '공제금승인관리%'
  const MENU_ID = 'TODO_gen_5760M';
  const API_URL = '/mis/gen/gen5760/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5760/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 공제금승인관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen5760/getConfNo.do | inputCols=-
  test.skip('[no:2] 공제금승인관리 - 조회 (getConfNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('상조회장부관리 (gen_5770M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5770M' OR MNU_NM LIKE '상조회장부관리%'
  const MENU_ID = 'TODO_gen_5770M';
  const API_URL = '/mis/gen/gen5770/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YYYY', 'SCH_IMPT_EXTR_FG', 'SCH_DTL_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5770/getList.do | inputCols=SCH_YYYY,SCH_IMPT_EXTR_FG,SCH_DTL_FG
  test.skip('[no:1] 상조회장부관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen5770/setData.do | inputCols=isChecked,tmHeader,SEQ,ACBK_DT,IMPT_EXTR_FG,DTL_FG,CONT,AMT,RMK,EMP_NO,EMP_NM,CNTC_YN,BALC
  test.skip('[no:2] 상조회장부관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('상조회수입대비지출현황 (gen_5780M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_5780M' OR MNU_NM LIKE '상조회수입대비지출현황%'
  const MENU_ID = 'TODO_gen_5780M';
  const API_URL = '/mis/gen/gen5780/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YYYY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5780/getList.do | inputCols=SCH_YYYY
  test.skip('[no:1] 상조회수입대비지출현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기념품등록관리 (gen_6000M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6000M' OR MNU_NM LIKE '기념품등록관리%'
  const MENU_ID = 'TODO_gen_6000M';
  const API_URL = '/mis/gen/gen6000/getGenSvnrMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SVNR_NM', 'SCH_SVNR_INS_FRM_DT', 'SCH_SVNR_INS_TO_DT', 'SCH_MNCT_ENTP_NM', 'SCH_SVNR_RQST_POSL_YN', 'SCH_SVNR_IO_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6000/getGenSvnrMngList.do | inputCols=SCH_SVNR_NM,SCH_SVNR_INS_FRM_DT,SCH_SVNR_INS_TO_DT,SCH_MNCT_ENTP_NM,SCH_SVNR_RQST_POSL_YN,SCH_SVNR_IO_FG
  test.skip('[no:1] 기념품등록관리 - 조회 (getGenSvnrMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('USB담당자관리 (gen_6005M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6005M' OR MNU_NM LIKE 'USB담당자관리%'
  const MENU_ID = 'TODO_gen_6005M';
  const API_URL = '/mis/gen/gen6005/getGenUsbPchrgMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_USB_USE_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6005/getGenUsbPchrgMngList.do | inputCols=SCH_USB_USE_YN
  test.skip('[no:1] USB담당자관리 - 조회 (getGenUsbPchrgMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen6005/setGenUsbPchrgMngData.do | inputCols=isChecked,tmHeader,USB_USE_YN,USB_FG_CD,PCHRG_EMP_NM,PCHRG_EMP_NO,PCHRG_DEPT_NM,PCHRG_GRD_NM,PCHRG_HLDF_FG_NM,PK_USB_FG_CD,PK_PCHRG_EMP_NO
  test.skip('[no:2] USB담당자관리 - 저장 (setGenUsbPchrgMngData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('USB관리 (gen_6010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6010M' OR MNU_NM LIKE 'USB관리%'
  const MENU_ID = 'TODO_gen_6010M';
  const API_URL = '/mis/gen/gen6010/getGenUsbMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_USB_FG_CD', 'SCH_USB_NM', 'SCH_INS_FRM_DT', 'SCH_INS_TO_DT', 'SCH_USB_MNG_STAT_CD', 'SCH_RQST_POSL_YN', 'SCH_ROLE_LEVEL'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6010/getGenUsbMngList.do | inputCols=SCH_USB_FG_CD,SCH_USB_NM,SCH_INS_FRM_DT,SCH_INS_TO_DT,SCH_USB_MNG_STAT_CD,SCH_RQST_POSL_YN,SCH_ROLE_LEVEL
  test.skip('[no:1] USB관리 - 조회 (getGenUsbMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen6010/setGenUsbData.do | inputCols=isChecked,tmHeader,USB_MNG_NO,USB_FG_CD,USB_NM,INS_DT,RQST_POSL_YN,USB_MNG_STAT_CD,DSUS_LOS_DT,DSUS_LOS_RSN,USB_SPEC,RMK
  test.skip('[no:2] USB관리 - 저장 (setGenUsbData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('USB신청 (gen_6020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6020M' OR MNU_NM LIKE 'USB신청%'
  const MENU_ID = 'TODO_gen_6020M';
  const API_URL = '/mis/gen/gen6020/getUsbLendRqstData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_USB_FG_CD', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_USB_NM', 'SCH_RTUN_FRM_DT', 'SCH_RTUN_TO_DT', 'SCH_CONF_EMP_NO', 'SCH_CONF_EMP_NM', 'SCH_RQST_STAT_CD', 'SCH_ROLE_LEVEL'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6020/getUsbLendRqstData.do | inputCols=SCH_USB_FG_CD,SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_USB_NM,SCH_RTUN_FRM_DT,SCH_RTUN_TO_DT,SCH_CONF_EMP_NO,SCH_CONF_EMP_NM,SCH_RQST_STAT_CD,SCH_ROLE_LEVEL
  test.skip('[no:1] USB신청 - 조회 (getUsbLendRqstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('USB신청상세 (gen_6021M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6021M' OR MNU_NM LIKE 'USB신청상세%'
  const MENU_ID = 'TODO_gen_6021M';
  const API_URL = '/mis/gen/gen6021/setGenUsbLendRqstData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen6021/setGenUsbLendRqstData.do | inputCols=tmHeader,USB_LEND_RQST_NO,USB_MNG_NO,USB_FG_CD,USB_NM,USB_LEND_FG_CD,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,RQST_DT,RQST_STAT_NM,RQST_STAT_CD,RQST_RSN,RUS_RSN,USE_FRM_DT,RTUN_PRAR_DT,RTUN_DT,CONF_EMP_NM,CONF_EMP_NO,CONF_DEPT_CD,RMK
  test.skip('[no:1] USB신청상세 - 저장 (setGenUsbLendRqstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen6021/delGenUsbLendRqstData.do | inputCols=tmHeader,USB_LEND_RQST_NO,USB_MNG_NO,USB_FG_CD,USB_NM,USB_LEND_FG_CD,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,RQST_DT,RQST_STAT_NM,RQST_STAT_CD,RQST_RSN,RUS_RSN,USE_FRM_DT,RTUN_PRAR_DT,RTUN_DT,CONF_EMP_NM,CONF_EMP_NO,CONF_DEPT_CD,RMK
  test.skip('[no:2] USB신청상세 - 삭제 (delGenUsbLendRqstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('USB사용현황 (gen_6030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6030M' OR MNU_NM LIKE 'USB사용현황%'
  const MENU_ID = 'TODO_gen_6030M';
  const API_URL = '/mis/gen/gen6030/getUsbUseData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_USB_FG_CD', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_USB_LEND_FG_CD', 'SCH_USB_NM', 'SCH_RTUN_FRM_DT', 'SCH_RTUN_TO_DT', 'SCH_CONF_EMP_NO', 'SCH_CONF_EMP_NM', 'SCH_RQST_STAT_CD', 'SCH_ROLE_LEVEL'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6030/getUsbUseData.do | inputCols=SCH_USB_FG_CD,SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_USB_LEND_FG_CD,SCH_USB_NM,SCH_RTUN_FRM_DT,SCH_RTUN_TO_DT,SCH_CONF_EMP_NO,SCH_CONF_EMP_NM,SCH_RQST_STAT_CD,SCH_ROLE_LEVEL
  test.skip('[no:1] USB사용현황 - 조회 (getUsbUseData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연간기부금내역조회 (gen_6300M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6300M' OR MNU_NM LIKE '연간기부금내역조회%'
  const MENU_ID = 'TODO_gen_6300M';
  const API_URL = '/mis/gen/gen6300/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_CTNY_YY', 'SCH_CTNY_EMP_NM', 'SCH_CTNY_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6300/getList.do | inputCols=SCH_CTNY_YY,SCH_CTNY_EMP_NM,SCH_CTNY_EMP_NO
  test.skip('[no:1] 연간기부금내역조회 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기부처별기부내역이력관리 (gen_6310M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6310M' OR MNU_NM LIKE '기부처별기부내역이력관리%'
  const MENU_ID = 'TODO_gen_6310M';
  const API_URL = '/mis/gen/gen6310/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_CTNY_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6310/getList.do | inputCols=SCH_CTNY_YY
  test.skip('[no:1] 기부처별기부내역이력관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen6310/setData.do | inputCols=isChecked,CTNY_YY,CTNY_DEPT_CD,CTNY_DEPT_NM,CTNY_EMP_NO,CTNY_EMP_NM,BSNM_CD,CTNA_NM,CTNY,RMK
  test.skip('[no:2] 기부처별기부내역이력관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen6310/excelUpload.do | inputCols=CTNY_YY,CTNY_EMP_NO,BSNM_CD,CTNA_NM,CTNY
  test.skip('[no:3] 기부처별기부내역이력관리 - 조회 (excelUpload) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('외부강의신고서 목록 (gen_6600M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6600M' OR MNU_NM LIKE '외부강의신고서 목록%'
  const MENU_ID = 'TODO_gen_6600M';
  const API_URL = '/mis/gen/gen6600/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_APV_STAT_CD', 'SCH_RQST_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6600/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_APV_STAT_CD,SCH_RQST_FG
  test.skip('[no:1] 외부강의신고서 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('외부강의신고서 상세 (gen_6601M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6601M' OR MNU_NM LIKE '외부강의신고서 상세%'
  const MENU_ID = 'TODO_gen_6601M';
  const API_URL = '/mis/gen/gen6601/getPrvData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_NO', 'RQST_DT', 'RQST_FG', 'BNDE_STTM_YN', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APPA_DEPT_CD', 'APPA_DEPT_NM', 'APNT_FLOC_CD', 'APNT_FLOC_NM', 'APNT_GRD_CD', 'APNT_GRD_NM', 'PRV_RQST_NO', 'APPA_EMP_NO', 'APPA_EMP_NM', 'APPA_GRD_CD', 'APPA_GRD_NM', 'APPA_FLOC_CD', 'APPA_FLOC_NM', 'DCLZ_TP_CD', 'EXT_LCTE_TP_CD', 'EXT_LCTE_TP_DTL_CONT', 'ACTV_TP_CD', 'ACTV_TP_DTL_CONT', 'DMND_ORGAN_NM', 'DMND_ORGAN_REPRES_NM', 'DMND_ORGAN_DEPT_NM', 'DMND_ORGAN_PCHRG_TEL_NO', 'EXT_LCTE_DMND_PLC', 'EXT_LCTE_DMND_FRM_DT', 'EXT_LCTE_DMND_FRM_H', 'EXT_LCTE_DMND_FRM_M', 'EXT_LCTE_DMND_TO_DT', 'EXT_LCTE_DMND_TO_H', 'EXT_LCTE_DMND_TO_M', 'MM_YY_AVG_HCNT', 'TOT_HCNT', 'OTM_AVG_TIME', 'BNDE_STTM_TGPN_YN', 'PICE_TOT_AMT', 'PICE_OTM_AVG_AMT', 'PICE_TRF_EXP', 'PICE_MNSCRTFE', 'PICE_MTRL_EXP', 'PICE_DICT_STTE_YN', 'PICE_DICT_STTE_NM', 'PICE_DICT_STTE_AMT', 'RMK', 'APNT_WORK_DGCNT', 'APPA_WORK_DGCNT', 'APV_STAT_CD', 'APV_STAT_NM', 'CHG_RSN', 'CHG_RQST_YN', 'EXT_LCTE_THMA'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen6601/delData.do | inputCols=RQST_NO,RQST_DT,RQST_FG,BNDE_STTM_YN,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APPA_DEPT_CD,APPA_DEPT_NM,APNT_FLOC_CD,APNT_FLOC_NM,APNT_GRD_CD,APNT_GRD_NM,PRV_RQST_NO,APPA_EMP_NO,APPA_EMP_NM,APPA_GRD_CD,APPA_GRD_NM,APPA_FLOC_CD,APPA_FLOC_NM,DCLZ_TP_CD,EXT_LCTE_TP_CD,EXT_LCTE_TP_DTL_CONT,ACTV_TP_CD,ACTV_TP_DTL_CONT,DMND_ORGAN_NM,DMND_ORGAN_REPRES_NM,DMND_ORGAN_DEPT_NM,DMND_ORGAN_PCHRG_TEL_NO,EXT_LCTE_DMND_PLC,EXT_LCTE_DMND_FRM_DT,EXT_LCTE_DMND_FRM_H,EXT_LCTE_DMND_FRM_M,EXT_LCTE_DMND_TO_DT,EXT_LCTE_DMND_TO_H,EXT_LCTE_DMND_TO_M,MM_YY_AVG_HCNT,TOT_HCNT,OTM_AVG_TIME,BNDE_STTM_TGPN_YN,PICE_TOT_AMT,PICE_OTM_AVG_AMT,PICE_TRF_EXP,PICE_MNSCRTFE,PICE_MTRL_EXP,PICE_DICT_STTE_YN,PICE_DICT_STTE_NM,PICE_DICT_STTE_AMT,RMK,APNT_WORK_DGCNT,APPA_WORK_DGCNT,APV_STAT_CD,APV_STAT_NM,CHG_RSN,CHG_RQST_YN,EXT_LCTE_THMA
  test.skip('[no:1] 외부강의신고서 상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen6601/getPrvData.do | inputCols=RQST_NO,RQST_DT,RQST_FG,BNDE_STTM_YN,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APPA_DEPT_CD,APPA_DEPT_NM,APNT_FLOC_CD,APNT_FLOC_NM,APNT_GRD_CD,APNT_GRD_NM,PRV_RQST_NO,APPA_EMP_NO,APPA_EMP_NM,APPA_GRD_CD,APPA_GRD_NM,APPA_FLOC_CD,APPA_FLOC_NM,DCLZ_TP_CD,EXT_LCTE_TP_CD,EXT_LCTE_TP_DTL_CONT,ACTV_TP_CD,ACTV_TP_DTL_CONT,DMND_ORGAN_NM,DMND_ORGAN_REPRES_NM,DMND_ORGAN_DEPT_NM,DMND_ORGAN_PCHRG_TEL_NO,EXT_LCTE_DMND_PLC,EXT_LCTE_DMND_FRM_DT,EXT_LCTE_DMND_FRM_H,EXT_LCTE_DMND_FRM_M,EXT_LCTE_DMND_TO_DT,EXT_LCTE_DMND_TO_H,EXT_LCTE_DMND_TO_M,MM_YY_AVG_HCNT,TOT_HCNT,OTM_AVG_TIME,BNDE_STTM_TGPN_YN,PICE_TOT_AMT,PICE_OTM_AVG_AMT,PICE_TRF_EXP,PICE_MNSCRTFE,PICE_MTRL_EXP,PICE_DICT_STTE_YN,PICE_DICT_STTE_NM,PICE_DICT_STTE_AMT,RMK,APNT_WORK_DGCNT,APPA_WORK_DGCNT,APV_STAT_CD,APV_STAT_NM,CHG_RSN,CHG_RQST_YN,EXT_LCTE_THMA
  test.skip('[no:2] 외부강의신고서 상세 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen6601/getData.do | inputCols=RQST_NO,RQST_DT,RQST_FG,BNDE_STTM_YN,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APPA_DEPT_CD,APPA_DEPT_NM,APNT_FLOC_CD,APNT_FLOC_NM,APNT_GRD_CD,APNT_GRD_NM,PRV_RQST_NO,APPA_EMP_NO,APPA_EMP_NM,APPA_GRD_CD,APPA_GRD_NM,APPA_FLOC_CD,APPA_FLOC_NM,DCLZ_TP_CD,EXT_LCTE_TP_CD,EXT_LCTE_TP_DTL_CONT,ACTV_TP_CD,ACTV_TP_DTL_CONT,DMND_ORGAN_NM,DMND_ORGAN_REPRES_NM,DMND_ORGAN_DEPT_NM,DMND_ORGAN_PCHRG_TEL_NO,EXT_LCTE_DMND_PLC,EXT_LCTE_DMND_FRM_DT,EXT_LCTE_DMND_FRM_H,EXT_LCTE_DMND_FRM_M,EXT_LCTE_DMND_TO_DT,EXT_LCTE_DMND_TO_H,EXT_LCTE_DMND_TO_M,MM_YY_AVG_HCNT,TOT_HCNT,OTM_AVG_TIME,BNDE_STTM_TGPN_YN,PICE_TOT_AMT,PICE_OTM_AVG_AMT,PICE_TRF_EXP,PICE_MNSCRTFE,PICE_MTRL_EXP,PICE_DICT_STTE_YN,PICE_DICT_STTE_NM,PICE_DICT_STTE_AMT,RMK,APNT_WORK_DGCNT,APPA_WORK_DGCNT,APV_STAT_CD,APV_STAT_NM,CHG_RSN,CHG_RQST_YN,EXT_LCTE_THMA
  test.skip('[no:3] 외부강의신고서 상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('외부강의통계 (외부제출용) (gen_6620M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6620M' OR MNU_NM LIKE '외부강의통계 (외부제출용)%'
  const MENU_ID = 'TODO_gen_6620M';
  const API_URL = '/mis/gen/gen6600/getStacList2.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EXT_LCTE_YY', 'SCH_FSH_TP', 'SCH_ACTV_TP', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_CONT', 'SCH_CLS', 'SCH_PRUE_FG_CD', 'SCH_ALL'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6600/getStacList2.do | inputCols=SCH_EXT_LCTE_YY,SCH_FSH_TP,SCH_ACTV_TP,SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_CONT,SCH_CLS,SCH_PRUE_FG_CD,SCH_ALL
  test.skip('[no:1] 외부강의통계 (외부제출용) - 조회 (getStacList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('학자금보조비신청목록 (gen_6700M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6700M' OR MNU_NM LIKE '학자금보조비신청목록%'
  const MENU_ID = 'TODO_gen_6700M';
  const API_URL = '/mis/gen/gen6700/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YYYY', 'SCH_APLY_QU', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6700/getList.do | inputCols=SCH_YYYY,SCH_APLY_QU,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APV_STAT_CD
  test.skip('[no:1] 학자금보조비신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('주택자금이자현황 (gen_6710M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6710M' OR MNU_NM LIKE '주택자금이자현황%'
  const MENU_ID = 'TODO_gen_6710M';
  const API_URL = '/mis/gen/gen6710/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_PMT_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6710/getList.do | inputCols=SCH_PMT_YY
  test.skip('[no:1] 주택자금이자현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기자정보관리 (gen_6900M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6900M' OR MNU_NM LIKE '기자정보관리%'
  const MENU_ID = 'TODO_gen_6900M';
  const API_URL = '/mis/gen/gen6900/getGenPrJrnlstList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_MSNC_FG_CD', 'SCH_PRESS_CD', 'SCH_ORGAN_CD', 'SCH_JRNLST_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen6900/setGenPrJrnlstData.do | inputCols=isChecked,tmHeader,JRNLST_MNG_NO,MSNC_FG_CD,PRESS_CD,JRNLST_NM,JRNLST_MAIL_ADDR,JRNLST_TEL_NO,JRNLST_CMG_YN,JRNLST_CMG_FRM_DT,JRNLST_CMG_TO_DT,JRNLST_NSCVRG_DTA_RCEPT_YN,ORGAN_CD,RMK
  test.skip('[no:1] 기자정보관리 - 저장 (setGenPrJrnlstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen6900/getGenPrJrnlstList.do | inputCols=SCH_MSNC_FG_CD,SCH_PRESS_CD,SCH_ORGAN_CD,SCH_JRNLST_NM
  test.skip('[no:2] 기자정보관리 - 조회 (getGenPrJrnlstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('언론홍보자료보도신청목록 (gen_6910M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6910M' OR MNU_NM LIKE '언론홍보자료보도신청목록%'
  const MENU_ID = 'TODO_gen_6910M';
  const API_URL = '/mis/gen/gen6910/getGenNewsDataMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_NSCVRG_DTA_TP_CD', 'SCH_NSCVRG_THMA', 'SCH_PRESS_CD', 'SCH_PRESS_NM', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6910/getGenNewsDataMngList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_NSCVRG_DTA_TP_CD,SCH_NSCVRG_THMA,SCH_PRESS_CD,SCH_PRESS_NM,SCH_APV_STAT_CD
  test.skip('[no:1] 언론홍보자료보도신청목록 - 조회 (getGenNewsDataMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('언론홍보자료보도신청상세 (gen_6911M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6911M' OR MNU_NM LIKE '언론홍보자료보도신청상세%'
  const MENU_ID = 'TODO_gen_6911M';
  const API_URL = '/mis/gen/gen6911/getNscvrgRqstData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['PR_RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'APNT_GRD_NM', 'APV_STAT_CD', 'APV_STAT_NM', 'NSCVRG_DTA_TP_CD', 'NSCVRG_DTA_THMA', 'CTTPC', 'NSCVRG_SBJ', 'NSCVRG_CONT', 'PRESS_CD', 'GATR_FRM_DT', 'GATR_TO_DT', 'NSCVRG_RQST_DT', 'RMK'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen6911/delNscvrgData.do | inputCols=PR_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APV_STAT_CD,APV_STAT_NM,NSCVRG_DTA_TP_CD,NSCVRG_DTA_THMA,CTTPC,NSCVRG_SBJ,NSCVRG_CONT,PRESS_CD,GATR_FRM_DT,GATR_TO_DT,NSCVRG_RQST_DT,RMK
  test.skip('[no:1] 언론홍보자료보도신청상세 - 삭제 (delNscvrgData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen6911/getNscvrgRqstData.do | inputCols=PR_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APV_STAT_CD,APV_STAT_NM,NSCVRG_DTA_TP_CD,NSCVRG_DTA_THMA,CTTPC,NSCVRG_SBJ,NSCVRG_CONT,PRESS_CD,GATR_FRM_DT,GATR_TO_DT,NSCVRG_RQST_DT,RMK
  test.skip('[no:2] 언론홍보자료보도신청상세 - 조회 (getNscvrgRqstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('언론홍보자료배포관리목록 (gen_6920M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6920M' OR MNU_NM LIKE '언론홍보자료배포관리목록%'
  const MENU_ID = 'TODO_gen_6920M';
  const API_URL = '/mis/gen/gen6920/getGenPrDtaWdtbList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_TRN_FRM_DT', 'SCH_TRN_TO_DT', 'SCH_RQP_EMP_NO', 'SCH_RQP_EMP_NM', 'SCH_RQP_DEPT_CD', 'SCH_RQP_DEPT_NM', 'SCH_PR_DTA_MAIL_SBJ', 'SCH_MSNC_FG_CD', 'SCH_PRESS_NM', 'SCH_ORGAN_CD', 'SCH_JRNLST_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6920/getGenPrDtaWdtbList.do | inputCols=SCH_TRN_FRM_DT,SCH_TRN_TO_DT,SCH_RQP_EMP_NO,SCH_RQP_EMP_NM,SCH_RQP_DEPT_CD,SCH_RQP_DEPT_NM,SCH_PR_DTA_MAIL_SBJ,SCH_MSNC_FG_CD,SCH_PRESS_NM,SCH_ORGAN_CD,SCH_JRNLST_NM
  test.skip('[no:1] 언론홍보자료배포관리목록 - 조회 (getGenPrDtaWdtbList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('언론홍보자료배포관리상세 (gen_6921M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_6921M' OR MNU_NM LIKE '언론홍보자료배포관리상세%'
  const MENU_ID = 'TODO_gen_6921M';
  const API_URL = '/mis/gen/gen6921/setMailTest.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen6921/setMailTest.do | inputCols=tmHeader,WDTB_MNG_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,TRN_DT,RQP_EMP_NO,RQP_EMP_NM,RQP_DEPT_CD,RQP_DEPT_NM,PR_RQST_NO,PR_APNT_EMP_NO,PR_APNT_EMP_NM,PR_APNT_DEPT_CD,PR_APNT_DEPT_NM,TRN_MAIL_ADDR,PR_DTA_MAIL_SBJ,PR_DTA_MAIL_CONT,PR_DTA_MAIL_CONT_HTML,WDTB_DCSN_YN,WDTB_DCSN_DT
  test.skip('[no:1] 언론홍보자료배포관리상세 - 저장 (setMailTest) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연구실관리 (gen_7010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7010M' OR MNU_NM LIKE '연구실관리%'
  const MENU_ID = 'TODO_gen_7010M';
  const API_URL = '/mis/gen/gen7010/getList01.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_LABR_NM', 'SCH_DHRM_MNG_NO', 'SCH_DHRM_MNG_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen7010/getList01.do | inputCols=SCH_LABR_NM,SCH_DHRM_MNG_NO,SCH_DHRM_MNG_NM
  test.skip('[no:1] 연구실관리 - 조회 (getList01) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen7010/setData.do | inputCols=tmHeader,LABR_MNG_NO,LABR_NM,DHRM_MNG_NO,DHRM_MNG_NM,POSI_DEPT_CD,POSI_DEPT_NM,RSER_EMP_NO,RSER_EMP_NM,SFMNG_PCHRG_EMP_NO,SFMNG_PCHRG_EMP_NM,RMK
  test.skip('[no:2] 연구실관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연구실관리상세 (gen_7011M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7011M' OR MNU_NM LIKE '연구실관리상세%'
  const MENU_ID = 'TODO_gen_7011M';
  const API_URL = '/mis/gen/gen7091/getCurWeekTime.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_NO', 'WORK_CLS', 'RQST_EMP_NO', 'RQST_EMP_NM', 'RQST_DEPT_CD', 'RQST_DEPT_NM', 'RQST_GRD_CD', 'RQST_GRD_NM', 'RQST_DT', 'WORK_TYPE', 'GW_DOC_NO', 'APV_STAT_CD', 'APV_STAT_NM', 'WORK_DT', 'RQST_WEEK', 'WORK_STR_TIME', 'WORK_END_TIME', 'WORK_HOUR', 'WORK_MIN', 'REST_MIN', 'RQST_RSN', 'ETC_RSN', 'TOT_SUM_TIME', 'HOLY_YN', 'BEAFTER_YN', 'Y_TIME', 'Y_MIN', 'N_TIME', 'N_MIN', 'ARREST_TIME', 'ARREST_TIME_MIN', 'FIX_DATE', 'SDT_SI', 'EDT_SI', 'WDAY', 'FRM_TM', 'TO_TM', 'AFTER_RSN', 'FLAG', 'ARR_RSN', 'ARR_FLAG', 'RECPT_YN', 'DEPT_EMP_NO', 'DEPT_EMP_NM', 'RESULT_RQST_NO', 'BASC_CLS', 'PRMR_JOB', 'APP_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen7091/getCurWeekTime.do | inputCols=RQST_NO,WORK_CLS,RQST_EMP_NO,RQST_EMP_NM,RQST_DEPT_CD,RQST_DEPT_NM,RQST_GRD_CD,RQST_GRD_NM,RQST_DT,WORK_TYPE,GW_DOC_NO,APV_STAT_CD,APV_STAT_NM,WORK_DT,RQST_WEEK,WORK_STR_TIME,WORK_END_TIME,WORK_HOUR,WORK_MIN,REST_MIN,RQST_RSN,ETC_RSN,TOT_SUM_TIME,HOLY_YN,BEAFTER_YN,Y_TIME,Y_MIN,N_TIME,N_MIN,ARREST_TIME,ARREST_TIME_MIN,FIX_DATE,SDT_SI,EDT_SI,WDAY,FRM_TM,TO_TM,AFTER_RSN,FLAG,ARR_RSN,ARR_FLAG,RECPT_YN,DEPT_EMP_NO,DEPT_EMP_NM,RESULT_RQST_NO,BASC_CLS,PRMR_JOB,APP_YN
  test.skip('[no:1] 연구실관리상세 - 조회 (doCurWeekTime) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen7091/getRqstInfo.do | inputCols=RQST_NO,WORK_CLS,RQST_EMP_NO,RQST_EMP_NM,RQST_DEPT_CD,RQST_DEPT_NM,RQST_GRD_CD,RQST_GRD_NM,RQST_DT,WORK_TYPE,GW_DOC_NO,APV_STAT_CD,APV_STAT_NM,WORK_DT,RQST_WEEK,WORK_STR_TIME,WORK_END_TIME,WORK_HOUR,WORK_MIN,REST_MIN,RQST_RSN,ETC_RSN,TOT_SUM_TIME,HOLY_YN,BEAFTER_YN,Y_TIME,Y_MIN,N_TIME,N_MIN,ARREST_TIME,ARREST_TIME_MIN,FIX_DATE,SDT_SI,EDT_SI,WDAY,FRM_TM,TO_TM,AFTER_RSN,FLAG,ARR_RSN,ARR_FLAG,RECPT_YN,DEPT_EMP_NO,DEPT_EMP_NM,RESULT_RQST_NO,BASC_CLS,PRMR_JOB,APP_YN
  test.skip('[no:2] 연구실관리상세 - 조회 (getRqstInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen7091/tmDelete.do | inputCols=RQST_NO,WORK_CLS,RQST_EMP_NO,RQST_EMP_NM,RQST_DEPT_CD,RQST_DEPT_NM,RQST_GRD_CD,RQST_GRD_NM,RQST_DT,WORK_TYPE,GW_DOC_NO,APV_STAT_CD,APV_STAT_NM,WORK_DT,RQST_WEEK,WORK_STR_TIME,WORK_END_TIME,WORK_HOUR,WORK_MIN,REST_MIN,RQST_RSN,ETC_RSN,TOT_SUM_TIME,HOLY_YN,BEAFTER_YN,Y_TIME,Y_MIN,N_TIME,N_MIN,ARREST_TIME,ARREST_TIME_MIN,FIX_DATE,SDT_SI,EDT_SI,WDAY,FRM_TM,TO_TM,AFTER_RSN,FLAG,ARR_RSN,ARR_FLAG,RECPT_YN,DEPT_EMP_NO,DEPT_EMP_NM,RESULT_RQST_NO,BASC_CLS,PRMR_JOB,APP_YN
  test.skip('[no:3] 연구실관리상세 - 삭제 (tmDelete) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('화학물질관리 (gen_7020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7020M' OR MNU_NM LIKE '화학물질관리%'
  const MENU_ID = 'TODO_gen_7020M';
  const API_URL = '/mis/gen/gen7020/getList01.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_MATT_FG_CD', 'SCH_FG_CD', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_CAS_NO', 'SCH_CHEM_MTTR_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen7020/getList01.do | inputCols=SCH_MATT_FG_CD,SCH_FG_CD,SCH_EMP_NM,SCH_EMP_NO,SCH_CAS_NO,SCH_CHEM_MTTR_NM
  test.skip('[no:1] 화학물질관리 - 조회 (getList01) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen7020/setData.do | inputCols=tmHeader,CHEM_MTTR_MNG_NO,MATT_FG_CD,CHEM_MTTR_NM,FG_CD,CAS_NO,CSDY_QTY,CSDY_UNIT,LABR_MNG_NO,LABR_NM,RMK,HRMFLNS_MTTR_MNG_EMP_NO,HRMFLNS_MTTR_MNG_EMP_NM,RSER_EMP_NO,RSER_EMP_NM
  test.skip('[no:2] 화학물질관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연구실화학물질현황 (gen_7030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7030M' OR MNU_NM LIKE '연구실화학물질현황%'
  const MENU_ID = 'TODO_gen_7030M';
  const API_URL = '/mis/gen/gen7030/getList01.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_LABR_NM', 'SCH_DHRM_MNG_NO', 'SCH_DHRM_MNG_NM', 'SCH_CAS_NO', 'SCH_CHEM_MTTR_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen7030/getList01.do | inputCols=SCH_LABR_NM,SCH_DHRM_MNG_NO,SCH_DHRM_MNG_NM,SCH_CAS_NO,SCH_CHEM_MTTR_NM
  test.skip('[no:1] 연구실화학물질현황 - 조회 (getList01) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('방문자 신청 (gen_7220M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7220M' OR MNU_NM LIKE '방문자 신청%'
  const MENU_ID = 'TODO_gen_7220M';
  const API_URL = '/mis/gen/gen7220/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_RQST_STAT_CD', 'SCH_DHRM_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen7230/getCodeList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_NM,SCH_EMP_NO,SCH_RQST_STAT_CD,SCH_DHRM_CD
  test.skip('[no:1] 방문자 신청 - 삭제 (getCodeDhrmList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen7220/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_NM,SCH_EMP_NO,SCH_RQST_STAT_CD,SCH_DHRM_CD
  test.skip('[no:2] 방문자 신청 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('방문자신청상세 (gen_7221M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7221M' OR MNU_NM LIKE '방문자신청상세%'
  const MENU_ID = 'TODO_gen_7221M';
  const API_URL = '/mis/gen/gen7221/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['tmHeader', 'VICRD_RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_NM', 'CONF_EMP_NO', 'CONF_EMP_NM', 'CONF_DEPT_NM', 'ACCP_DE', 'PCHRG_EMP_NO', 'RQST_STAT_CD', 'VIST_FRM_DT', 'VIST_FRM_TM', 'VIST_TO_DT', 'VIST_TO_TM', 'CAR_NO', 'VIST_NMPR', 'RECT_DE', 'RTUN_DE', 'RMK', 'VICRD_RQST_NO_TODO', 'VIST_TRGT_BLDG_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen7221/getData.do | inputCols=tmHeader,VICRD_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_NM,CONF_EMP_NO,CONF_EMP_NM,CONF_DEPT_NM,ACCP_DE,PCHRG_EMP_NO,RQST_STAT_CD,VIST_FRM_DT,VIST_FRM_TM,VIST_TO_DT,VIST_TO_TM,CAR_NO,VIST_NMPR,RECT_DE,RTUN_DE,RMK,VICRD_RQST_NO_TODO,VIST_TRGT_BLDG_NM
  test.skip('[no:1] 방문자신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen7221/setData.do | inputCols=tmHeader,VICRD_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_NM,CONF_EMP_NO,CONF_EMP_NM,CONF_DEPT_NM,ACCP_DE,PCHRG_EMP_NO,RQST_STAT_CD,VIST_FRM_DT,VIST_FRM_TM,VIST_TO_DT,VIST_TO_TM,CAR_NO,VIST_NMPR,RECT_DE,RTUN_DE,RMK,VICRD_RQST_NO_TODO,VIST_TRGT_BLDG_NM
  test.skip('[no:2] 방문자신청상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen7221/delData.do | inputCols=tmHeader,VICRD_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_NM,CONF_EMP_NO,CONF_EMP_NM,CONF_DEPT_NM,ACCP_DE,PCHRG_EMP_NO,RQST_STAT_CD,VIST_FRM_DT,VIST_FRM_TM,VIST_TO_DT,VIST_TO_TM,CAR_NO,VIST_NMPR,RECT_DE,RTUN_DE,RMK,VICRD_RQST_NO_TODO,VIST_TRGT_BLDG_NM
  test.skip('[no:3] 방문자신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen7221/setStatData.do | inputCols=tmHeader,VICRD_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_NM,CONF_EMP_NO,CONF_EMP_NM,CONF_DEPT_NM,ACCP_DE,PCHRG_EMP_NO,RQST_STAT_CD,VIST_FRM_DT,VIST_FRM_TM,VIST_TO_DT,VIST_TO_TM,CAR_NO,VIST_NMPR,RECT_DE,RTUN_DE,RMK,VICRD_RQST_NO_TODO,VIST_TRGT_BLDG_NM
  test.skip('[no:4] 방문자신청상세 - 저장 (setStatData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen7221/setTodoStatData.do | inputCols=tmHeader,VICRD_RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_NM,CONF_EMP_NO,CONF_EMP_NM,CONF_DEPT_NM,ACCP_DE,PCHRG_EMP_NO,RQST_STAT_CD,VIST_FRM_DT,VIST_FRM_TM,VIST_TO_DT,VIST_TO_TM,CAR_NO,VIST_NMPR,RECT_DE,RTUN_DE,RMK,VICRD_RQST_NO_TODO,VIST_TRGT_BLDG_NM
  test.skip('[no:5] 방문자신청상세 - 저장 (setTodoStatData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('방문자신청현황 (gen_7230M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7230M' OR MNU_NM LIKE '방문자신청현황%'
  const MENU_ID = 'TODO_gen_7230M';
  const API_URL = '/mis/gen/gen7230/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_DHRM_CD', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen7230/getCodeList.do | inputCols=SCH_DHRM_CD,SCH_EMP_NM,SCH_EMP_NO,SCH_RQST_FRM_DT,SCH_RQST_TO_DT
  test.skip('[no:1] 방문자신청현황 - 삭제 (getCodeDhrmList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen7230/getList.do | inputCols=SCH_DHRM_CD,SCH_EMP_NM,SCH_EMP_NO,SCH_RQST_FRM_DT,SCH_RQST_TO_DT
  test.skip('[no:2] 방문자신청현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('유관기관관리 (gen_7500M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7500M' OR MNU_NM LIKE '유관기관관리%'
  const MENU_ID = 'TODO_gen_7500M';
  const API_URL = '/mis/gen/gen7500/getGenReteOrganMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RETE_ORGAN_TP_CD', 'SCH_RETE_ORGAN_NM', 'SCH_PCHRG_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen7500/setGenReteOrganMngData.do | inputCols=isChecked,tmHeader,RETE_ORGAN_MNG_NO,RETE_ORGAN_TP_CD,RETE_ORGAN_NM,ORGAN_TEL_NO,ORGAN_FAX_NO,ORGAN_NMPR_CNT,ORGAN_BUDG,REPRES_NM,REPRES_OFFS,PCHRG_NM,PCHRG_OFFS,PCHRG_TEL_NO,PCHRG_FAX_NO,PCHRG_MAIL_ADDR,ORGAN_ADDR,ORGAN_HMPG_ADDR,IOCT_FG_CD,RMK
  test.skip('[no:1] 유관기관관리 - 저장 (setGenReteOrganMngData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen7500/getGenReteOrganMngList.do | inputCols=SCH_RETE_ORGAN_TP_CD,SCH_RETE_ORGAN_NM,SCH_PCHRG_NM
  test.skip('[no:2] 유관기관관리 - 조회 (getGenReteOrganMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('업무협약신청목록 (gen_7510M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7510M' OR MNU_NM LIKE '업무협약신청목록%'
  const MENU_ID = 'TODO_gen_7510M';
  const API_URL = '/mis/gen/gen7510/getGenAgemMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_AGEM_CNCLS_FRM_DT', 'SCH_AGEM_CNCLS_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_MOU_FG_CD', 'SCH_AGEM_NM', 'SCH_CORPR_RALM', 'SCH_RETE_ORGAN_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen7510/getGenAgemMngList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_AGEM_CNCLS_FRM_DT,SCH_AGEM_CNCLS_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_MOU_FG_CD,SCH_AGEM_NM,SCH_CORPR_RALM,SCH_RETE_ORGAN_NM
  test.skip('[no:1] 업무협약신청목록 - 조회 (getGenAgemMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('업무협약신청상세 (gen_7511M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7511M' OR MNU_NM LIKE '업무협약신청상세%'
  const MENU_ID = 'TODO_gen_7511M';
  const API_URL = '/mis/gen/gen7511/setAgemConfirm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/gen/gen7511/setAgemConfirm.do | inputCols=tmHeader,RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APV_STAT_CD,APV_STAT_NM,AGEM_TP_CD,MOU_FG_CD,NTN_CD,NTN_NM,AGEM_CNCLS_FRM_DT,AGEM_CNCLS_TO_DT,UPDT_MTHD,AGEM_NM,CNCLS_MTHD,AGEM_CNCLS_DT,AGEM_PPS,CORPR_RALM,CNCLS_NCST,EXPC_EFCT,CORPR_PRTN_ACR,FUTR_CORPR_PLAN,ETC,AGEM_MNG_NO,RST_INS_DT,AGEM_RST_CONT
  test.skip('[no:1] 업무협약신청상세 - 저장 (setAgemConfirm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen7511/delAgemData.do | inputCols=tmHeader,RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APNT_GRD_CD,APNT_GRD_NM,APV_STAT_CD,APV_STAT_NM,AGEM_TP_CD,MOU_FG_CD,NTN_CD,NTN_NM,AGEM_CNCLS_FRM_DT,AGEM_CNCLS_TO_DT,UPDT_MTHD,AGEM_NM,CNCLS_MTHD,AGEM_CNCLS_DT,AGEM_PPS,CORPR_RALM,CNCLS_NCST,EXPC_EFCT,CORPR_PRTN_ACR,FUTR_CORPR_PLAN,ETC,AGEM_MNG_NO,RST_INS_DT,AGEM_RST_CONT
  test.skip('[no:2] 업무협약신청상세 - 삭제 (delAgemData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('업무협약결과관리 (gen_7520M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7520M' OR MNU_NM LIKE '업무협약결과관리%'
  const MENU_ID = 'TODO_gen_7520M';
  const API_URL = '/mis/gen/gen7520/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_AGEM_CNCLS_FRM_DT', 'SCH_AGEM_CNCLS_TO_DT', 'SCH_AGEM_TP_CD', 'SCH_MOU_FG_CD', 'SCH_AGEM_NM', 'SCH_CORPR_RALM', 'SCH_ORGAN_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen7520/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_AGEM_CNCLS_FRM_DT,SCH_AGEM_CNCLS_TO_DT,SCH_AGEM_TP_CD,SCH_MOU_FG_CD,SCH_AGEM_NM,SCH_CORPR_RALM,SCH_ORGAN_NM
  test.skip('[no:1] 업무협약결과관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('업무협약결과관리상세 (gen_7521M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7521M' OR MNU_NM LIKE '업무협약결과관리상세%'
  const MENU_ID = 'TODO_gen_7521M';
  const API_URL = '/mis/gen/gen7521/delAgemData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/gen/gen7521/delAgemData.do | inputCols=tmHeader,AGEM_MNG_NO,AGEM_RQST_NO,WRT_DT,WTER_EMP_NO,WTER_EMP_NM,WTER_DEPT_CD,WTER_DEPT_NM,WTER_GRD_CD,WTER_GRD_NM,AGEM_TP_CD,MOU_FG_CD,NTN_CD,NTN_NM,AGEM_CNCLS_FRM_DT,AGEM_CNCLS_TO_DT,UPDT_MTHD,AGEM_NM,CNCLS_MTHD,AGEM_CNCLS_DT,AGEM_PPS,CORPR_RALM,CNCLS_NCST,EXPC_EFCT,CORPR_PRTN_ACR,FUTR_CORPR_PLAN,ETC,RST_INS_DT,AGEM_RST_CONT
  test.skip('[no:1] 업무협약결과관리상세 - 삭제 (delAgemData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen7521/setAgemConfirm.do | inputCols=tmHeader,AGEM_MNG_NO,AGEM_RQST_NO,WRT_DT,WTER_EMP_NO,WTER_EMP_NM,WTER_DEPT_CD,WTER_DEPT_NM,WTER_GRD_CD,WTER_GRD_NM,AGEM_TP_CD,MOU_FG_CD,NTN_CD,NTN_NM,AGEM_CNCLS_FRM_DT,AGEM_CNCLS_TO_DT,UPDT_MTHD,AGEM_NM,CNCLS_MTHD,AGEM_CNCLS_DT,AGEM_PPS,CORPR_RALM,CNCLS_NCST,EXPC_EFCT,CORPR_PRTN_ACR,FUTR_CORPR_PLAN,ETC,RST_INS_DT,AGEM_RST_CONT
  test.skip('[no:2] 업무협약결과관리상세 - 저장 (setAgemConfirm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('일정목록 (gen_7600M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7600M' OR MNU_NM LIKE '일정목록%'
  const MENU_ID = 'TODO_gen_7600M';
  const API_URL = '/mis/gen/gen5120/getCtnyRqstList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_CNTN_RQST_FRM_DT', 'SCH_CNTN_RQST_TO_DT', 'SCH_CNTN_NM', 'SCH_EMP_NM', 'SCH_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen5120/getCtnyRqstList.do | inputCols=SCH_CNTN_RQST_FRM_DT,SCH_CNTN_RQST_TO_DT,SCH_CNTN_NM,SCH_EMP_NM,SCH_EMP_NO
  test.skip('[no:1] 일정목록 - 조회 (getCtnyRqstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('일정등록대상자관리 (gen_7610M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7610M' OR MNU_NM LIKE '일정등록대상자관리%'
  const MENU_ID = 'TODO_gen_7610M';
  const API_URL = '/mis/gen/gen6005/getGenUsbPchrgMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_USB_USE_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6005/getGenUsbPchrgMngList.do | inputCols=SCH_USB_USE_YN
  test.skip('[no:1] 일정등록대상자관리 - 조회 (getGenUsbPchrgMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen6005/setGenUsbPchrgMngData.do | inputCols=isChecked,tmHeader,USB_USE_YN,USB_FG_CD,PCHRG_EMP_NM,PCHRG_EMP_NO,PCHRG_DEPT_NM,PCHRG_GRD_NM,PCHRG_HLDF_FG_NM,PK_USB_FG_CD,PK_PCHRG_EMP_NO
  test.skip('[no:2] 일정등록대상자관리 - 저장 (setGenUsbPchrgMngData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('일정등록 (gen_7620M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'gen_7620M' OR MNU_NM LIKE '일정등록%'
  const MENU_ID = 'TODO_gen_7620M';
  const API_URL = '/mis/gen/gen6005/getGenUsbPchrgMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_USB_USE_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen6005/getGenUsbPchrgMngList.do | inputCols=SCH_USB_USE_YN
  test.skip('[no:1] 일정등록 - 조회 (getGenUsbPchrgMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen6005/setGenUsbPchrgMngData.do | inputCols=isChecked,tmHeader,USB_USE_YN,USB_FG_CD,PCHRG_EMP_NM,PCHRG_EMP_NO,PCHRG_DEPT_NM,PCHRG_GRD_NM,PCHRG_HLDF_FG_NM,PK_USB_FG_CD,PK_PCHRG_EMP_NO
  test.skip('[no:2] 일정등록 - 저장 (setGenUsbPchrgMngData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});
