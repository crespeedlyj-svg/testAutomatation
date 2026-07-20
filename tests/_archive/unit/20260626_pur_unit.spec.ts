// ==============================================================
// PUR 모듈 배치 단위 테스트 — 생성일 2026-06-26
// 입력: _workspace/pur/01_scenarios.json (unit 252건 / integ 32건, 69개 화면)
// 검증 패턴: openMenuById + setNexacroComponentValue + waitForNexacroDataset
// menuPathStatus = UNRESOLVED (gnbName=구매관리 고정, menuName=TODO)
//   → 모든 화면 menuId 미확인 → test.skip 으로 생성
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

test.describe('부대비용관리 (pur_0010m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0010m' OR MNU_NM LIKE '부대비용관리%'
  const MENU_ID = 'TODO_pur_0010m';
  const API_URL = '/mis/pur/pur0010/getLista.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0010/getLista.do | inputCols=-
  test.skip('[no:1] 부대비용관리 - 조회 (getLista) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0010/setData.do | inputCols=isChecked,tmHeader,ADAMT_NO,ADAMT_FG,ADAMT_RATE,RMK,AMT_GT,AMT_BW,FRGN_CLS,FXMT_YN
  test.skip('[no:2] 부대비용관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매취소관리 (pur_0020m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0020m' OR MNU_NM LIKE '구매취소관리%'
  const MENU_ID = 'TODO_pur_0020m';
  const API_URL = '/mis/pur/pur0200/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'FRGN_CLS', 'SCH_DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_RQST_STAT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_MIN_AMT', 'SCH_MAX_AMT', 'SCH_CTRCT_MTHD', 'SCH_CLS', 'SCH_KEY', 'SCH_PUR_STEP0', 'SCH_PUR_STEP1', 'SCH_PUR_STEP2', 'SCH_PUR_STEP3', 'SCH_PUR_STEP4', 'SCH_PUR_STEP5', 'SCH_PUR_STEP6', 'SCH_PUR_STEP7', 'PUR_STEPS', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_E_CONT_YN', 'SCH_E_CONT_STAT', 'SCH_RQST_EMP_NO', 'SCH_RQST_EMP_NM', 'SCH_RQST_TO_DT', 'SCH_RQST_FRM_DT', 'SCH_FRGN_CLS', 'SCH_PUR_STEP'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0200/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,FRGN_CLS,SCH_DT_CLS,SCH_RQST_SDT,SCH_RQST_EDT,SCH_RQST_STAT,SCH_EMP_NM,SCH_EMP_NO,SCH_MIN_AMT,SCH_MAX_AMT,SCH_CTRCT_MTHD,SCH_CLS,SCH_KEY,SCH_PUR_STEP0,SCH_PUR_STEP1,SCH_PUR_STEP2,SCH_PUR_STEP3,SCH_PUR_STEP4,SCH_PUR_STEP5,SCH_PUR_STEP6,SCH_PUR_STEP7,PUR_STEPS,ROLE_YN,DEPT_CHIF_YN,SCH_E_CONT_YN,SCH_E_CONT_STAT,SCH_RQST_EMP_NO,SCH_RQST_EMP_NM,SCH_RQST_TO_DT,SCH_RQST_FRM_DT,SCH_FRGN_CLS,SCH_PUR_STEP
  test.skip('[no:1] 구매취소관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0200/setCancel.do | inputCols=BUSI_PLC_CD,FRGN_CLS,PUR_STEP,PUR_TP,RGST_NO,RGST_DT,TOT_PRES_AMT,TOT_RGST_AMT,SUCC_AMT,CTRCT_NM,CONT_TP,CTRCT_MTHD,CTRCT_NO,CTRCT_DEG,PUR_CONT_NO,CTRCT_AMT,CTRCT_AMT_FRGN,CTRCT_DT,CTRCT_SDT,CTRCT_EDT,CTRCT_CUST_NM,REG_NO,CUST_TEL_NO,CUST_MNG_EMAIL,CTRCT_STAT,IMG,IMG2,CONT_IMG,E_CONT_YN,E_CONT_RQST_DT,E_CONT_DT,E_CONT_STAT,LAST_EXMNT_DT,PMT_INFO,DEPS_AMT,LAST_SLIP_DT,CHRG_EMP_NO,CHRG_EMP_NM,EXMNT_END_YN,EXMNT_TP,EXMNT_RQST,EXMNT_NO,LAST_EXMNT_EMP_NO,LAST_EXMNT_EMP_NM,LAST_DLVR_DT,DLY_YN,PUR_RQST_NO,GW_DOC_NO,GW_DOC_ID,GW_RELATION_DOC,OLD_SYS_KEY,R_GW_DOC_ID,RQST_EMP_NO,RMN_AMT,ACCP_DT,RGST_EMP_NM,tmHeader,cssclassid
  test.skip('[no:2] 구매취소관리 - 저장 (setCancel) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매요구현황 (pur_0110m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0110m' OR MNU_NM LIKE '구매요구현황%'
  const MENU_ID = 'TODO_pur_0110m';
  const API_URL = '/mis/pur/pur0110/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'RQST_STAT', 'PUR_STEP', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0110/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_SDT,RQST_EDT,RQST_STAT,PUR_STEP,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,RJCT_YN,SRCH_CLS,SRCH_KEY,FRGN_CLS,PUR_TP,ROLE_YN,DEPT_CHIF_YN,PUR_CLS
  test.skip('[no:1] 구매요구현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0110/getList2.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_SDT,RQST_EDT,RQST_STAT,PUR_STEP,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,RJCT_YN,SRCH_CLS,SRCH_KEY,FRGN_CLS,PUR_TP,ROLE_YN,DEPT_CHIF_YN,PUR_CLS
  test.skip('[no:2] 구매요구현황 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매요구(내자) (pur_0111m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0111m' OR MNU_NM LIKE '구매요구(내자)%'
  const MENU_ID = 'TODO_pur_0111m';
  const API_URL = '/mis/pur/pur0111/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WORK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'ACT_UNIT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PRJT_FG', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT', 'UNIT', 'ACCT_NM', 'BUDG_BSNS_NM', 'BUDG_BSNS_CD', 'BUDG_LITM_CD', 'BUDG_CLSF_FG', 'AST_CLS_NM', 'AST_CLS_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0111/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,UNIT,ACCT_NM,BUDG_BSNS_NM,BUDG_BSNS_CD,BUDG_LITM_CD,BUDG_CLSF_FG,AST_CLS_NM,AST_CLS_CD
  test.skip('[no:1] 구매요구(내자) - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0111/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,UNIT,ACCT_NM,BUDG_BSNS_NM,BUDG_BSNS_CD,BUDG_LITM_CD,BUDG_CLSF_FG,AST_CLS_NM,AST_CLS_CD
  test.skip('[no:2] 구매요구(내자) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0111/delData.do | inputCols=CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,WORK_AREA,RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_CD,DLVERY_GDS_PLC_NM,RQST_CONT,VAT_TP,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,POST_PRCSS_RSN,POST_PRCSS_YN,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,OLD_SYS_KEY,KOR_GDS_NM,ENG_GDS_NM,FEATURE,MAIN_SYSTEM,ACCESSORY,ETC,GDS_QTY,MAIN_QTY,ACCS_QTY,PCHRG,PCHRG_TEL_NO,TOT_VAT,CTRL_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,ACCT_CD,PUR_BUDG_AMT,BUDG_INCM_AMT,PROV_APRQ_NO,PROV_APRQ_SEQ,DTL_PROV_AMT,BUDG_CHG_YN,WTER_EMP_NO,WTER_EMP_NM,WTER_DEPT_CD,WTER_DEPT_NM,RQST_EMP_CLS,RGD_TRGT_YN,PCUM_MTHD,CTRCT_MTHD,UPRC_BSS,G2B_CLS_NO,TOT_SPLY_VAL,DLVR_PLC,DLVR_PLC_FLOOR,DLVR_PLC_NM,DLVR_PLC_CD,DLVR_HOPE_DT
  test.skip('[no:3] 구매요구(내자) - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0111/setDtlDelData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,UNIT,ACCT_NM,BUDG_BSNS_NM,BUDG_BSNS_CD,BUDG_LITM_CD,BUDG_CLSF_FG,AST_CLS_NM,AST_CLS_CD
  test.skip('[no:4] 구매요구(내자) - 삭제 (setDtlDelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0111/uptChk.do | inputCols=-
  test.skip('[no:5] 구매요구(내자) - 수정 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0111/addAmt.do | inputCols=CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,WORK_AREA,RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_CD,DLVERY_GDS_PLC_NM,RQST_CONT,VAT_TP,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,POST_PRCSS_RSN,POST_PRCSS_YN,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,OLD_SYS_KEY,KOR_GDS_NM,ENG_GDS_NM,FEATURE,MAIN_SYSTEM,ACCESSORY,ETC,GDS_QTY,MAIN_QTY,ACCS_QTY,PCHRG,PCHRG_TEL_NO,TOT_VAT,CTRL_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,ACCT_CD,PUR_BUDG_AMT,BUDG_INCM_AMT,PROV_APRQ_NO,PROV_APRQ_SEQ,DTL_PROV_AMT,BUDG_CHG_YN,WTER_EMP_NO,WTER_EMP_NM,WTER_DEPT_CD,WTER_DEPT_NM,RQST_EMP_CLS,RGD_TRGT_YN,PCUM_MTHD,CTRCT_MTHD,UPRC_BSS,G2B_CLS_NO,TOT_SPLY_VAL,DLVR_PLC,DLVR_PLC_FLOOR,DLVR_PLC_NM,DLVR_PLC_CD,DLVR_HOPE_DT
  test.skip('[no:6] 구매요구(내자) - 저장 (addAmt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매요구(일반) (pur_0112m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0112m' OR MNU_NM LIKE '구매요구(일반)%'
  const MENU_ID = 'TODO_pur_0112m';
  const API_URL = '/mis/pur/pur0112/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WORK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_CD', 'BUDG_LITM_NM', 'ACCT_CD', 'ACCT_NM', 'PROJ_EXE_CLS', 'ACT_UNIT_CD', 'GRD_NM', 'TEMP_AMT', 'AST_CLS_CD', 'AST_CLS_NM', 'UNIT', 'BUDG_TP', 'BSNS_FG', 'BUDG_BSNS_NM', 'BUDG_BSNS_CD', 'BUDG_CD', 'BUDG_NM', 'INCM_EXPS_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0112/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_CD,BUDG_LITM_NM,ACCT_CD,ACCT_NM,PROJ_EXE_CLS,ACT_UNIT_CD,GRD_NM,TEMP_AMT,AST_CLS_CD,AST_CLS_NM,UNIT,BUDG_TP,BSNS_FG,BUDG_BSNS_NM,BUDG_BSNS_CD,BUDG_CD,BUDG_NM,INCM_EXPS_FG
  test.skip('[no:1] 구매요구(일반) - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0112/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_CD,BUDG_LITM_NM,ACCT_CD,ACCT_NM,PROJ_EXE_CLS,ACT_UNIT_CD,GRD_NM,TEMP_AMT,AST_CLS_CD,AST_CLS_NM,UNIT,BUDG_TP,BSNS_FG,BUDG_BSNS_NM,BUDG_BSNS_CD,BUDG_CD,BUDG_NM,INCM_EXPS_FG
  test.skip('[no:2] 구매요구(일반) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0112/delData.do | inputCols=CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,WORK_AREA,RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_NM,DLVERY_GDS_PLC,RQST_CONT,VAT_TP,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_CUST,OPT_CONT,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,CHK_500_YN,OPT_CTRCT_YN,OPT_REF_BASE,ALL_NONE,CMP_TP1,CMP_TP2,CMP_TP3,PROD_CERT1,PROD_CERT2,PROD_CERT3,PROD_CERT4,RSIGN_INSU_YN,PUBL_CUST_YN,PUBL_CUST,PUBL_CUST1,PUBL_CUST2,PUBL_CUST3,PUBL_CUST4,PUBL_CUST5,PUBL_CUST6,PUBL_CUST7,PUBL_CUST8,LOCAL_CUST_YN,SAME_CUST_YN,TOT_SPLY_VAL,TOT_VAT,CONST_FG,OPET_FG,MAGR_EMP_NO,MAGR_EMP_NM,PCUM_MTHD,CTRCT_MTHD,UPRC_BSS,PCHRG,PCHRG_TEL_NO,WTER_EMP_NO,WTER_EMP_NM,WTER_DEPT_CD,WTER_DEPT_NM,DLVR_PLC,DLVR_PLC_FLOOR,DLVR_PLC_NM,DLVR_PLC_CD,DLVR_HOPE_DT,CNTU_BSNS_YN,CTRCT_FG,CTRCT_NO,PUR_CONT_NO,CNTU_BSNS_TERM
  test.skip('[no:3] 구매요구(일반) - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매요구(외자) (pur_0121m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0121m' OR MNU_NM LIKE '구매요구(외자)%'
  const MENU_ID = 'TODO_pur_0121m';
  const API_URL = '/mis/pur/pur0121/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WORK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_CD', 'BUDG_LITM_NM', 'ACCT_CD', 'ACCT_NM', 'PROJ_EXE_CLS', 'ACT_UNIT_CD', 'GRD_NM', 'TEMP_AMT', 'AST_CLS_CD', 'AST_CLS_NM', 'UNIT', 'BUDG_TP', 'BSNS_FG', 'BUDG_BSNS_NM', 'BUDG_BSNS_CD', 'BUDG_CD', 'BUDG_NM', 'INCM_EXPS_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0121/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_CD,BUDG_LITM_NM,ACCT_CD,ACCT_NM,PROJ_EXE_CLS,ACT_UNIT_CD,GRD_NM,TEMP_AMT,AST_CLS_CD,AST_CLS_NM,UNIT,BUDG_TP,BSNS_FG,BUDG_BSNS_NM,BUDG_BSNS_CD,BUDG_CD,BUDG_NM,INCM_EXPS_FG
  test.skip('[no:1] 구매요구(외자) - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0121/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_CD,BUDG_LITM_NM,ACCT_CD,ACCT_NM,PROJ_EXE_CLS,ACT_UNIT_CD,GRD_NM,TEMP_AMT,AST_CLS_CD,AST_CLS_NM,UNIT,BUDG_TP,BSNS_FG,BUDG_BSNS_NM,BUDG_BSNS_CD,BUDG_CD,BUDG_NM,INCM_EXPS_FG
  test.skip('[no:2] 구매요구(외자) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0121/delData.do | inputCols=CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,WORK_AREA,RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVR_PLC_NM,DLVR_PLC_CD,RQST_CONT,VAT_TP,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_CUST,OPT_CONT,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,CHK_500_YN,OPT_CTRCT_YN,OPT_REF_BASE,ALL_NONE,CMP_TP1,CMP_TP2,CMP_TP3,PROD_CERT1,PROD_CERT2,PROD_CERT3,PROD_CERT4,RSIGN_INSU_YN,PUBL_CUST_YN,PUBL_CUST,PUBL_CUST1,PUBL_CUST2,PUBL_CUST3,PUBL_CUST4,PUBL_CUST5,PUBL_CUST6,PUBL_CUST7,PUBL_CUST8,LOCAL_CUST_YN,SAME_CUST_YN,PCUM_MTHD,CTRCT_MTHD,UPRC_BSS,G2B_CLS_NO,USD_CONV_RATE,USD_CONV_AMT,DLVR_PLC_FLOOR,DLVR_PLC,WTER_EMP_NO,WTER_EMP_NM,WTER_DEPT_CD,WTER_DEPT_NM,TOT_SPLY_VAL,STDR_DT,PCHRG,PCHRG_TEL_NO,DVEY_CND,DLVR_HOPE_DT
  test.skip('[no:3] 구매요구(외자) - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0111/addAmtFrgn.do | inputCols=CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,WORK_AREA,RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVR_PLC_NM,DLVR_PLC_CD,RQST_CONT,VAT_TP,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_CUST,OPT_CONT,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,CHK_500_YN,OPT_CTRCT_YN,OPT_REF_BASE,ALL_NONE,CMP_TP1,CMP_TP2,CMP_TP3,PROD_CERT1,PROD_CERT2,PROD_CERT3,PROD_CERT4,RSIGN_INSU_YN,PUBL_CUST_YN,PUBL_CUST,PUBL_CUST1,PUBL_CUST2,PUBL_CUST3,PUBL_CUST4,PUBL_CUST5,PUBL_CUST6,PUBL_CUST7,PUBL_CUST8,LOCAL_CUST_YN,SAME_CUST_YN,PCUM_MTHD,CTRCT_MTHD,UPRC_BSS,G2B_CLS_NO,USD_CONV_RATE,USD_CONV_AMT,DLVR_PLC_FLOOR,DLVR_PLC,WTER_EMP_NO,WTER_EMP_NM,WTER_DEPT_CD,WTER_DEPT_NM,TOT_SPLY_VAL,STDR_DT,PCHRG,PCHRG_TEL_NO,DVEY_CND,DLVR_HOPE_DT
  test.skip('[no:4] 구매요구(외자) - 저장 (addAmtFrgn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계속계약요구현황 (pur_0140m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0140m' OR MNU_NM LIKE '계속계약요구현황%'
  const MENU_ID = 'TODO_pur_0140m';
  const API_URL = '/mis/pur/pur0140/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'RQST_STAT', 'PUR_STEP', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0140/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_SDT,RQST_EDT,RQST_STAT,PUR_STEP,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,RJCT_YN,SRCH_CLS,SRCH_KEY,FRGN_CLS,PUR_TP,ROLE_YN,DEPT_CHIF_YN,PUR_CLS
  test.skip('[no:1] 계속계약요구현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계속계약요구신청 (pur_0141m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0141m' OR MNU_NM LIKE '계속계약요구신청%'
  const MENU_ID = 'TODO_pur_0141m';
  const API_URL = '/mis/pur/pur0141/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WORK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_CD', 'BUDG_LITM_NM', 'ACCT_CD', 'ACCT_NM', 'PROJ_EXE_CLS', 'ACT_UNIT_CD', 'GRD_NM', 'TEMP_AMT', 'AST_CLS_CD', 'AST_CLS_NM', 'UNIT', 'BUDG_TP', 'BSNS_FG', 'BUDG_BSNS_NM', 'BUDG_BSNS_CD', 'BUDG_CD', 'BUDG_NM', 'INCM_EXPS_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0141/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_CD,BUDG_LITM_NM,ACCT_CD,ACCT_NM,PROJ_EXE_CLS,ACT_UNIT_CD,GRD_NM,TEMP_AMT,AST_CLS_CD,AST_CLS_NM,UNIT,BUDG_TP,BSNS_FG,BUDG_BSNS_NM,BUDG_BSNS_CD,BUDG_CD,BUDG_NM,INCM_EXPS_FG
  test.skip('[no:1] 계속계약요구신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0141/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_CD,BUDG_LITM_NM,ACCT_CD,ACCT_NM,PROJ_EXE_CLS,ACT_UNIT_CD,GRD_NM,TEMP_AMT,AST_CLS_CD,AST_CLS_NM,UNIT,BUDG_TP,BSNS_FG,BUDG_BSNS_NM,BUDG_BSNS_CD,BUDG_CD,BUDG_NM,INCM_EXPS_FG
  test.skip('[no:2] 계속계약요구신청 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0141/delData.do | inputCols=CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,WORK_AREA,RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_NM,DLVERY_GDS_PLC,RQST_CONT,VAT_TP,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,CHK_DT,INS_ID,ALL_FRM_DT,ALL_TO_DT,FRM_DT,TO_DT,ALL_CTRCT_AMT,CTRCT_AMT,YY_TME,PUR_CONT_NO,PRV_CONT_NO,CTRCT_NM,WTER_EMP_NM,WTER_EMP_NO,PRV_RQST_NO,REPRES,CTRCT_CUST_ADDR,BIZRNO,CTRCT_CUST_NM,RGST_NO
  test.skip('[no:3] 계속계약요구신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0141/getDtlList.do | inputCols=CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,WORK_AREA,RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_NM,DLVERY_GDS_PLC,RQST_CONT,VAT_TP,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,CHK_DT,INS_ID,ALL_FRM_DT,ALL_TO_DT,FRM_DT,TO_DT,ALL_CTRCT_AMT,CTRCT_AMT,YY_TME,PUR_CONT_NO,PRV_CONT_NO,CTRCT_NM,WTER_EMP_NM,WTER_EMP_NO,PRV_RQST_NO,REPRES,CTRCT_CUST_ADDR,BIZRNO,CTRCT_CUST_NM,RGST_NO
  test.skip('[no:4] 계속계약요구신청 - 조회 (getDtlList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계약변경(해지)등록 (pur_0150m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0150m' OR MNU_NM LIKE '계약변경(해지)등록%'
  const MENU_ID = 'TODO_pur_0150m';
  const API_URL = '/mis/pur/pur0150/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'RQST_STAT', 'PUR_STEP', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0150/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_SDT,RQST_EDT,RQST_STAT,PUR_STEP,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,RJCT_YN,SRCH_CLS,SRCH_KEY,FRGN_CLS,PUR_TP,ROLE_YN,DEPT_CHIF_YN,PUR_CLS
  test.skip('[no:1] 계약변경(해지)등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계약변경(해지)등록 (pur_0151m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0151m' OR MNU_NM LIKE '계약변경(해지)등록%'
  const MENU_ID = 'TODO_pur_0151m';
  const API_URL = '/mis/pur/pur0151/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'ACT_UNIT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PROJ_EXE_CLS', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT', 'LEGY_CTRCT_NO', 'BUDG_UP_ITSR_NM', 'BUDG_SUBJ_NM', 'LEGY_CTRCT_DEG', 'Column0', 'CTRCT_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0151/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,LEGY_CTRCT_NO,BUDG_UP_ITSR_NM,BUDG_SUBJ_NM,LEGY_CTRCT_DEG,Column0,CTRCT_NO
  test.skip('[no:1] 계약변경(해지)등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0151/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,LEGY_CTRCT_NO,BUDG_UP_ITSR_NM,BUDG_SUBJ_NM,LEGY_CTRCT_DEG,Column0,CTRCT_NO
  test.skip('[no:2] 계약변경(해지)등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0151/uptChk.do | inputCols=-
  test.skip('[no:3] 계약변경(해지)등록 - 수정 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0151/delData.do | inputCols=CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,WRK_AREA,RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC,DLVERY_GDS_PLC_NM,RQST_CONT,VAT_TYPE,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_CUST,OPT_CONT,POST_PRCSS_RSN,OPT_CTRCT_YN,OPT_REF_BASE,POST_PRCSS_YN,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,EX_RQST_NO,CONT_TP,CTRCT_NM,CTRCT_FRM_DT,CTRCT_TO_DT,CTRCT_AMT,CHG_OP,CHG_RMK,CHG_FG1,CHG_FG2,CHG_FG3,CTRCT_NO,CHG_RQST_YN,CTRCT_DEG,TOT_PUR_AMT,UPT_DE,CHG_RSN,LEGY_CTRCT_NO,LEGY_CTRCT_DEG,CTRCT_MTHD,CNTU_BSNS_YN,CTRCT_CUST_NM,CTRCT_CUST_CD,CHG_FG4,CHG_FG5,Column0,Column1,Column2
  test.skip('[no:4] 계약변경(해지)등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('예산변경 (pur_0152m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0152m' OR MNU_NM LIKE '예산변경%'
  const MENU_ID = 'TODO_pur_0152m';
  const API_URL = '/mis/pur/pur0152/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'RQST_STAT', 'PUR_STEP', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0152/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_SDT,RQST_EDT,RQST_STAT,PUR_STEP,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,RJCT_YN,SRCH_CLS,SRCH_KEY,FRGN_CLS,PUR_TP,ROLE_YN,DEPT_CHIF_YN,PUR_CLS
  test.skip('[no:1] 예산변경 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('예산변경 (pur_0153m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0153m' OR MNU_NM LIKE '예산변경%'
  const MENU_ID = 'TODO_pur_0153m';
  const API_URL = '/mis/pur/pur0153/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'ACT_UNIT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PROJ_EXE_CLS', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT', 'LEGY_CTRCT_NO', 'BUDG_UP_ITSR_NM', 'BUDG_SUBJ_NM', 'LEGY_CTRCT_DEG', 'ITEM_MNG_NO', 'CTRCT_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0153/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,LEGY_CTRCT_NO,BUDG_UP_ITSR_NM,BUDG_SUBJ_NM,LEGY_CTRCT_DEG,ITEM_MNG_NO,CTRCT_NO
  test.skip('[no:1] 예산변경 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0153/getDetailData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,LEGY_CTRCT_NO,BUDG_UP_ITSR_NM,BUDG_SUBJ_NM,LEGY_CTRCT_DEG,ITEM_MNG_NO,CTRCT_NO
  test.skip('[no:2] 예산변경 - 조회 (getDetailData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0153/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,LEGY_CTRCT_NO,BUDG_UP_ITSR_NM,BUDG_SUBJ_NM,LEGY_CTRCT_DEG,ITEM_MNG_NO,CTRCT_NO
  test.skip('[no:3] 예산변경 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0153/uptChk.do | inputCols=-
  test.skip('[no:4] 예산변경 - 수정 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0153/checkBudgBaln.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,LEGY_CTRCT_NO,BUDG_UP_ITSR_NM,BUDG_SUBJ_NM,LEGY_CTRCT_DEG,ITEM_MNG_NO,CTRCT_NO
  test.skip('[no:5] 예산변경 - 조회 (checkBudgBaln) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0153/delData.do | inputCols=CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,WRK_AREA,RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC,DLVERY_GDS_PLC_NM,RQST_CONT,VAT_TP,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_CUST,OPT_CONT,POST_PRCSS_RSN,OPT_CTRCT_YN,OPT_REF_BASE,POST_PRCSS_YN,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,EX_RQST_NO,CONT_TP,CTRCT_NM,CTRCT_FRM_DT,CTRCT_TO_DT,CTRCT_AMT,CHG_OP,CHG_RMK,CHG_FG1,CHG_FG2,CHG_FG3,CTRCT_NO,CHG_RQST_YN,CTRCT_DEG,TOT_PUR_AMT,UPT_DE,CHG_RSN,LEGY_CTRCT_NO,LEGY_CTRCT_DEG,CTRCT_MTHD,CNTU_BSNS_YN,CTRCT_CUST_NM,CTRCT_CUST_CD,CHG_FG4,CHG_FG5,CHG_FG6,Column0,Column1,Column2
  test.skip('[no:6] 예산변경 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매진행현황 (pur_0210m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0210m' OR MNU_NM LIKE '구매진행현황%'
  const MENU_ID = 'TODO_pur_0210m';
  const API_URL = '/mis/pur/pur0210/getPurData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'FRGN_CLS', 'SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'RGST_EMP_NO', 'RGST_EMP_NM', 'PUR_STEPS', 'PUR_TPS', 'CONT_TPS', 'RGST_NO', 'CTRCT_END_YN', 'CTRCT_NM', 'CTRCT_CUST_NM', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'RQST_CLSS', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_DT_CLS', 'CTRCT_MTHD', 'SCH_APNT_DEPT_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_PRJT_FG', 'Column0'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0210/getPurData.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,FRGN_CLS,SCH_SRCH_SDT,SCH_SRCH_EDT,RGST_EMP_NO,RGST_EMP_NM,PUR_STEPS,PUR_TPS,CONT_TPS,RGST_NO,CTRCT_END_YN,CTRCT_NM,CTRCT_CUST_NM,SCH_SRCH_CLS,SCH_SRCH_KEY,RQST_CLSS,ROLE_YN,DEPT_CHIF_YN,SCH_DT_CLS,CTRCT_MTHD,SCH_APNT_DEPT_NM,SCH_APNT_DEPT_CD,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_PRJT_FG,Column0
  test.skip('[no:1] 구매진행현황 - 조회 (getPurData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매품의 (pur_0211m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0211m' OR MNU_NM LIKE '구매품의%'
  const MENU_ID = 'TODO_pur_0211m';
  const API_URL = '/mis/pur/pur0211/getRgstList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_LIST_CLS', 'SCH_FRGN_CLS', 'SCH_BUSI_PLC_CD', 'SCH_SDT', 'SCH_EDT', 'SCH_APNT_DEPT_NM', 'SCH_APNT_DEPT_CD', 'DEPT_NM', 'DEPT_CD', 'SCH_RQST_SAMT', 'SCH_RQST_EAMT', 'SCH_CLS', 'SCH_VAL', 'TEMP_AMT', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_RJCT_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0211/getRgstList.do | inputCols=SCH_LIST_CLS,SCH_FRGN_CLS,SCH_BUSI_PLC_CD,SCH_SDT,SCH_EDT,SCH_APNT_DEPT_NM,SCH_APNT_DEPT_CD,DEPT_NM,DEPT_CD,SCH_RQST_SAMT,SCH_RQST_EAMT,SCH_CLS,SCH_VAL,TEMP_AMT,ROLE_YN,DEPT_CHIF_YN,SCH_RJCT_YN
  test.skip('[no:1] 구매품의 - 조회 (getRgstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0211/setCancel.do | inputCols=RGST_NO,CORP_CD,BUSI_PLC_CD,WORK_AREA,RGST_NM,RGST_DT,RGST_EMP_NO,RGST_EMP_NM,RGST_DEPT_CD,RGST_DEPT_NM,DEPT_CD,DEPT_NM,FRGN_CLS,PUR_TP,CONT_TP,CTRCT_MTHD,SUBD_MTHD,TOT_RGST_AMT,RMK,PUR_STEP,OLD_SYS_KEY,INS_ID,CHK_DT,RQST_NO,BID_DT,NOTI_DT,CLOS_DT,PRAR_PC_FG,PCUM_MTHD,BID_GNTE_FG,BID_HH,NOTI_HH,CLOS_HH,CNTU_BSNS_YN,BID_EMG_YN,BID_GNTE_RATE,CTRCT_GNTE_RATE,CTRCT_WRG_GNTE_RATE,COPE_CTRCT_YN,PRE_STD_TRGT_YN,APV_STAT_CD,APV_STAT_NM,PMG_ID,BID_RSLT
  test.skip('[no:2] 구매품의 - 저장 (setCancel) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0211/getRgstInfo.do | inputCols=-
  test.skip('[no:3] 구매품의 - 조회 (getRgstInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0211/setReturn.do | inputCols=SCH_LIST_CLS,SCH_FRGN_CLS,SCH_BUSI_PLC_CD,SCH_SDT,SCH_EDT,SCH_APNT_DEPT_NM,SCH_APNT_DEPT_CD,DEPT_NM,DEPT_CD,SCH_RQST_SAMT,SCH_RQST_EAMT,SCH_CLS,SCH_VAL,TEMP_AMT,ROLE_YN,DEPT_CHIF_YN,SCH_RJCT_YN
  test.skip('[no:4] 구매품의 - 저장 (setReturn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/purCom/setApp.do | inputCols=RGST_NO,CORP_CD,BUSI_PLC_CD,WORK_AREA,RGST_NM,RGST_DT,RGST_EMP_NO,RGST_EMP_NM,RGST_DEPT_CD,RGST_DEPT_NM,DEPT_CD,DEPT_NM,FRGN_CLS,PUR_TP,CONT_TP,CTRCT_MTHD,SUBD_MTHD,TOT_RGST_AMT,RMK,PUR_STEP,OLD_SYS_KEY,INS_ID,CHK_DT,RQST_NO,BID_DT,NOTI_DT,CLOS_DT,PRAR_PC_FG,PCUM_MTHD,BID_GNTE_FG,BID_HH,NOTI_HH,CLOS_HH,CNTU_BSNS_YN,BID_EMG_YN,BID_GNTE_RATE,CTRCT_GNTE_RATE,CTRCT_WRG_GNTE_RATE,COPE_CTRCT_YN,PRE_STD_TRGT_YN,APV_STAT_CD,APV_STAT_NM,PMG_ID,BID_RSLT
  test.skip('[no:5] 구매품의 - 저장 (setApp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매계약현황 (pur_0300m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0300m' OR MNU_NM LIKE '구매계약현황%'
  const MENU_ID = 'TODO_pur_0300m';
  const API_URL = '/mis/pur/pur0300/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WORK_AREA', 'FRGN_CLS', 'SCH_DT_CLS', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_RQST_STAT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_MIN_AMT', 'SCH_MAX_AMT', 'SCH_CTRCT_MTHD', 'SCH_CLS', 'SCH_KEY', 'SCH_PUR_STEP0', 'SCH_PUR_STEP1', 'SCH_PUR_STEP2', 'SCH_PUR_STEP3', 'SCH_PUR_STEP4', 'SCH_PUR_STEP5', 'SCH_PUR_STEP6', 'SCH_PUR_STEP7', 'PUR_STEPS', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_E_CONT_YN', 'SCH_E_CONT_STAT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0300/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,FRGN_CLS,SCH_DT_CLS,SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_RQST_STAT,SCH_EMP_NM,SCH_EMP_NO,SCH_MIN_AMT,SCH_MAX_AMT,SCH_CTRCT_MTHD,SCH_CLS,SCH_KEY,SCH_PUR_STEP0,SCH_PUR_STEP1,SCH_PUR_STEP2,SCH_PUR_STEP3,SCH_PUR_STEP4,SCH_PUR_STEP5,SCH_PUR_STEP6,SCH_PUR_STEP7,PUR_STEPS,ROLE_YN,DEPT_CHIF_YN,SCH_E_CONT_YN,SCH_E_CONT_STAT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM
  test.skip('[no:1] 구매계약현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0300/getReslEnblYn.do | inputCols=BUSI_PLC_CD,FRGN_CLS,PUR_STEP,PUR_TP,RGST_NO,RGST_DT,TOT_PRES_AMT,TOT_RGST_AMT,SUCC_AMT,CTRCT_NM,CONT_TP,CTRCT_MTHD,CTRCT_NO,CTRCT_DEG,PUR_CONT_NO,CTRCT_AMT,CTRCT_AMT_FRGN,CTRCT_DT,CTRCT_FRM_DT,CTRCT_TO_DT,CTRCT_CUST_NM,REG_NO,CUST_TEL_NO,CUST_MNG_EMAIL,CTRCT_STAT,IMG,IMG2,CONT_IMG,E_CONT_YN,E_CONT_RQST_DT,E_CONT_DT,E_CONT_STAT,LAST_EXMNT_DT,PMT_INFO,DEPS_AMT,LAST_SLIP_DT,CHRG_EMP_NO,CHRG_EMP_NM,EXMNT_END_YN,EXMNT_TP,EXMNT_RQST,EXMNT_NO,LAST_EXMNT_EMP_NO,LAST_EXMNT_EMP_NM,LAST_DLVR_DT,DLY_YN,PUR_RQST_NO,GW_DOC_NO,GW_DOC_ID,GW_RELATION_DOC,OLD_SYS_KEY,R_GW_DOC_ID,APNT_EMP_NO,RMN_AMT,ACCP_DT,RGST_EMP_NM,APNT_EMP_NM,PCHRG_EMP_NO,PCHRG_EMP_NM,RQST_NO,REAL_RQST_NO,REAL_YY_TME,Column2
  test.skip('[no:2] 구매계약현황 - 조회 (getReslEnblYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0300/getRqstTp.do | inputCols=BUSI_PLC_CD,FRGN_CLS,PUR_STEP,PUR_TP,RGST_NO,RGST_DT,TOT_PRES_AMT,TOT_RGST_AMT,SUCC_AMT,CTRCT_NM,CONT_TP,CTRCT_MTHD,CTRCT_NO,CTRCT_DEG,PUR_CONT_NO,CTRCT_AMT,CTRCT_AMT_FRGN,CTRCT_DT,CTRCT_FRM_DT,CTRCT_TO_DT,CTRCT_CUST_NM,REG_NO,CUST_TEL_NO,CUST_MNG_EMAIL,CTRCT_STAT,IMG,IMG2,CONT_IMG,E_CONT_YN,E_CONT_RQST_DT,E_CONT_DT,E_CONT_STAT,LAST_EXMNT_DT,PMT_INFO,DEPS_AMT,LAST_SLIP_DT,CHRG_EMP_NO,CHRG_EMP_NM,EXMNT_END_YN,EXMNT_TP,EXMNT_RQST,EXMNT_NO,LAST_EXMNT_EMP_NO,LAST_EXMNT_EMP_NM,LAST_DLVR_DT,DLY_YN,PUR_RQST_NO,GW_DOC_NO,GW_DOC_ID,GW_RELATION_DOC,OLD_SYS_KEY,R_GW_DOC_ID,APNT_EMP_NO,RMN_AMT,ACCP_DT,RGST_EMP_NM,APNT_EMP_NM,PCHRG_EMP_NO,PCHRG_EMP_NM,RQST_NO,REAL_RQST_NO,REAL_YY_TME,Column2
  test.skip('[no:3] 구매계약현황 - 조회 (getRqstTp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('RCMS계약현황 (pur_0301m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0301m' OR MNU_NM LIKE 'RCMS계약현황%'
  const MENU_ID = 'TODO_pur_0301m';
  const API_URL = '/mis/pur/pur0300/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'FRGN_CLS', 'SCH_DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_RQST_STAT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_MIN_AMT', 'SCH_MAX_AMT', 'SCH_CTRCT_MTHD', 'SCH_CLS', 'SCH_KEY', 'SCH_PUR_STEP0', 'SCH_PUR_STEP1', 'SCH_PUR_STEP2', 'SCH_PUR_STEP3', 'SCH_PUR_STEP4', 'SCH_PUR_STEP5', 'SCH_PUR_STEP6', 'SCH_PUR_STEP7', 'PUR_STEPS', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_E_CONT_YN', 'SCH_E_CONT_STAT', 'SCH_RQST_EMP_NO', 'SCH_RQST_EMP_NM', 'Column0', 'PGM_ID', 'Column1'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0300/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,FRGN_CLS,SCH_DT_CLS,SCH_RQST_SDT,SCH_RQST_EDT,SCH_RQST_STAT,SCH_EMP_NM,SCH_EMP_NO,SCH_MIN_AMT,SCH_MAX_AMT,SCH_CTRCT_MTHD,SCH_CLS,SCH_KEY,SCH_PUR_STEP0,SCH_PUR_STEP1,SCH_PUR_STEP2,SCH_PUR_STEP3,SCH_PUR_STEP4,SCH_PUR_STEP5,SCH_PUR_STEP6,SCH_PUR_STEP7,PUR_STEPS,ROLE_YN,DEPT_CHIF_YN,SCH_E_CONT_YN,SCH_E_CONT_STAT,SCH_RQST_EMP_NO,SCH_RQST_EMP_NM,Column0,PGM_ID,Column1
  test.skip('[no:1] RCMS계약현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0300/getReslEnblYn.do | inputCols=PRJT_FG,BUSI_PLC_CD,FRGN_CLS,PUR_STEP,PUR_TP,RGST_NO,RGST_DT,TOT_PRES_AMT,TOT_RGST_AMT,SUCC_AMT,CTRCT_NM,CONT_TP,CTRCT_MTHD,CTRCT_NO,CTRCT_DEG,PUR_CONT_NO,CTRCT_AMT,CTRCT_AMT_FRGN,CTRCT_DT,CTRCT_FRM_DT,CTRCT_TO_DT,CTRCT_CUST_NM,REG_NO,CUST_TEL_NO,CUST_MNG_EMAIL,CTRCT_STAT,IMG,IMG2,CONT_IMG,E_CONT_YN,E_CONT_RQST_DT,E_CONT_DT,E_CONT_STAT,LAST_EXMNT_DT,PMT_INFO,DEPS_AMT,LAST_SLIP_DT,CHRG_EMP_NO,CHRG_EMP_NM,EXMNT_END_YN,EXMNT_TP,EXMNT_RQST,EXMNT_NO,LAST_EXMNT_EMP_NO,LAST_EXMNT_EMP_NM,LAST_DLVR_DT,DLY_YN,PUR_RQST_NO,GW_DOC_NO,GW_DOC_ID,GW_RELATION_DOC,OLD_SYS_KEY,R_GW_DOC_ID,APNT_EMP_NO,RMN_AMT,ACCP_DT,RGST_EMP_NM,APNT_EMP_NM,PCHRG_EMP_NO,PCHRG_EMP_NM,RQST_NO,Column60,Column61,Column62,Column63,Column64,Column65,Column66
  test.skip('[no:2] RCMS계약현황 - 조회 (getReslEnblYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계약등록 (pur_0311m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0311m' OR MNU_NM LIKE '계약등록%'
  const MENU_ID = 'TODO_pur_0311m';
  const API_URL = '/mis/pur/pur0311/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WORK_AREA', 'CTRCT_NO', 'CTRCT_SEQ', 'CTRCT_DEG', 'FRGN_CLS', 'PUR_TP', 'RGST_NO', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PROJ_EXE_CLS', 'ACT_UNIT_CD', 'TEMP_AMT', 'DIV_CNT', 'DIV_TERM', 'UPT_DT', 'UPT_DT2', 'UPT_DT3', 'UPT_DT4', 'ACCT_NM', 'TEMP_TOT_AMT', 'PRAR_BASC_AMT', 'TMP_CTRCT_AMT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0311/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:1] 계약등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0311/getBlData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:2] 계약등록 - 조회 (getBlData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0311/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:3] 계약등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0311/setMst.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:4] 계약등록 - 저장 (setMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0311/setECont.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:5] 계약등록 - 저장 (setECont) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0311/delData.do | inputCols=RGST_NO,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,CORP_CD,BUSI_PLC_CD,WORK_AREA,ACT_UNIT_CD,PCHRG_EMP_NO,PCHRG_EMP_NM,PCHRG_DEPT_CD,FRGN_CLS,PUR_TP,PUR_CONT_NO,CTRCT_NM,CTRCT_DT,CTRCT_FRM_DT,CTRCT_TO_DT,DLVERY_DAYS,DLVR_PLC_CD,DLVR_PLC_FLOOR,DLVR_PLC,DLVR_PLC_NM,CONT_TP,CTRCT_MTHD,CTRCT_MTHD2,TOT_RGST_AMT,SUCC_AMT,CTRCT_GNTE_RATE,CTRCT_GNTE_AMT,CTRCT_AMT,CTRCT_AMT_FRGN,VAT_TP,TOT_SPLY_VAL,TOT_VAT,TOT_ADD_AMT,TOT_PUR_AMT,TOT_MKDP_AMT,DEPS_AMT,RMN_AMT,DLY_AMT_RATE,DLY_DAYS,DLY_AMT,DLY_AMT_FRGN,STAMP_AMT,CTRCT_CUST_CD,CTRCT_CUST_NM,CTRCT_CUST_NM_ENG,REG_NO,CTRCT_CUST_ADDR,CTRCT_CUST_ADDR_DTL,CTRCT_CUST_ENG_ADDR,CTRCT_CUST_TEL_NO,CTRCT_CUST_FAX_NO,CTRCT_CUST_MNG_NM,CTRCT_CUST_MNG_TEL_NO,CTRCT_CUST_MNG_MAIL,REPRES,BK_CD,BK_NM,DPSTS_BNKB_NM,PUR_BK_ACC_NO,ADDRES_CRTFC_AT,CSTRN_SDT,CSTRN_EDT,CHG_CONT_RSN,CTRCT_RJCT_YN,CTRCT_RJCT_RSN,REF_CTRCT_NO,PAY_CHK,ETC_CONT,E_CONT_YN,E_CONT_RQST_DT,E_CONT_DT,E_CONT_STAT,COST_REG_NO,COST_CUST_CD,COST_CUST_NM,COST_ADD_AMT,LAST_DLVR_DT,DLVR_END_YN,LAST_EXMNT_DT,EXMNT_END_YN,PUR_END_YN,RMK,REP_CURR_UNIT,REP_EXCHNG_RATE,CONT_TERMS,PAY_TERMS,DLVR_PNT,RQST_NOS,PUR_RQST_NO,APV_STAT_CD,APV_STAT_NM,PUR_STEP,PUR_STEP_NM,OLD_STEP,BUDG_NULL_YN,CONT_CLS,CTRCT_ADD1,CTRCT_ADD2,CTRCT_ADD3,CTRCT_ADD4,CHK_DT,CTRCT_WRG_GNTE_TERM,CTRCT_WRG_GNTE_RATE,CTRCT_WRG_GNTE_AMT,OLD_SYS_KEY,EBID_URL,E_CONT_URL,GW_DOC_ID,MAIL_CLS,REF_GW_DOC_IDS,ADD_AMT_RATE,CTRCT_GNTE_AMT_FRGN,MGT_ITEM_NM,STDR_DT,OD_FG,OPT_CONT,OFFER_NO,OFFER_DT,CTRCT_COND,SPLY_COM,MAKE_COM,SHPP_EXPN,NTFC_DT,UPT_DT,RISK_OPET1,RISK_OPET2,RISK_OPET3,RISK_OPET4,RISK_OPET5,RISK_OPET_EXCLUS,DLVERY_EDT,YEARS_FG,ifId,daysDiff,CUST_FG,RISK_CHK_YN,PRAR_PC_FG,PCUM_MTHD,PAY_MTHD,SUBD_MTHD,E_CONT_NO,CHG_FG1,CHG_FG2,CHG_FG3,CHG_FG6,RQST_NO,DVEY_CND,PRAR_BASC_AMT,SCHLR_YN,MAKER,SHPP_EX_DT,CHG_FG4,CHG_FG5,Column5,CURR_UNIT,BSNS_DEPT_PMT_YN,TOT_PRES_AMT,PUR_RQST_NO_ONE,CNTU_BSNS_YN,CNTU_CTRCT_YN,CMLT_FRM_DT,CMLT_TO_DT
  test.skip('[no:6] 계약등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0311/purEndData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:7] 계약등록 - 조회 (purEndData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0311/purEndRtnData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:8] 계약등록 - 조회 (purEndRtnData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/purctrct/delHstData.do | inputCols=RGST_NO,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,CORP_CD,BUSI_PLC_CD,WORK_AREA,ACT_UNIT_CD,PCHRG_EMP_NO,PCHRG_EMP_NM,PCHRG_DEPT_CD,FRGN_CLS,PUR_TP,PUR_CONT_NO,CTRCT_NM,CTRCT_DT,CTRCT_FRM_DT,CTRCT_TO_DT,DLVERY_DAYS,DLVR_PLC_CD,DLVR_PLC_FLOOR,DLVR_PLC,DLVR_PLC_NM,CONT_TP,CTRCT_MTHD,CTRCT_MTHD2,TOT_RGST_AMT,SUCC_AMT,CTRCT_GNTE_RATE,CTRCT_GNTE_AMT,CTRCT_AMT,CTRCT_AMT_FRGN,VAT_TP,TOT_SPLY_VAL,TOT_VAT,TOT_ADD_AMT,TOT_PUR_AMT,TOT_MKDP_AMT,DEPS_AMT,RMN_AMT,DLY_AMT_RATE,DLY_DAYS,DLY_AMT,DLY_AMT_FRGN,STAMP_AMT,CTRCT_CUST_CD,CTRCT_CUST_NM,CTRCT_CUST_NM_ENG,REG_NO,CTRCT_CUST_ADDR,CTRCT_CUST_ADDR_DTL,CTRCT_CUST_ENG_ADDR,CTRCT_CUST_TEL_NO,CTRCT_CUST_FAX_NO,CTRCT_CUST_MNG_NM,CTRCT_CUST_MNG_TEL_NO,CTRCT_CUST_MNG_MAIL,REPRES,BK_CD,BK_NM,DPSTS_BNKB_NM,PUR_BK_ACC_NO,ADDRES_CRTFC_AT,CSTRN_SDT,CSTRN_EDT,CHG_CONT_RSN,CTRCT_RJCT_YN,CTRCT_RJCT_RSN,REF_CTRCT_NO,PAY_CHK,ETC_CONT,E_CONT_YN,E_CONT_RQST_DT,E_CONT_DT,E_CONT_STAT,COST_REG_NO,COST_CUST_CD,COST_CUST_NM,COST_ADD_AMT,LAST_DLVR_DT,DLVR_END_YN,LAST_EXMNT_DT,EXMNT_END_YN,PUR_END_YN,RMK,REP_CURR_UNIT,REP_EXCHNG_RATE,CONT_TERMS,PAY_TERMS,DLVR_PNT,RQST_NOS,PUR_RQST_NO,APV_STAT_CD,APV_STAT_NM,PUR_STEP,PUR_STEP_NM,OLD_STEP,BUDG_NULL_YN,CONT_CLS,CTRCT_ADD1,CTRCT_ADD2,CTRCT_ADD3,CTRCT_ADD4,CHK_DT,CTRCT_WRG_GNTE_TERM,CTRCT_WRG_GNTE_RATE,CTRCT_WRG_GNTE_AMT,OLD_SYS_KEY,EBID_URL,E_CONT_URL,GW_DOC_ID,MAIL_CLS,REF_GW_DOC_IDS,ADD_AMT_RATE,CTRCT_GNTE_AMT_FRGN,MGT_ITEM_NM,STDR_DT,OD_FG,OPT_CONT,OFFER_NO,OFFER_DT,CTRCT_COND,SPLY_COM,MAKE_COM,SHPP_EXPN,NTFC_DT,UPT_DT,RISK_OPET1,RISK_OPET2,RISK_OPET3,RISK_OPET4,RISK_OPET5,RISK_OPET_EXCLUS,DLVERY_EDT,YEARS_FG,ifId,daysDiff,CUST_FG,RISK_CHK_YN,PRAR_PC_FG,PCUM_MTHD,PAY_MTHD,SUBD_MTHD,E_CONT_NO,CHG_FG1,CHG_FG2,CHG_FG3,CHG_FG6,RQST_NO,DVEY_CND,PRAR_BASC_AMT,SCHLR_YN,MAKER,SHPP_EX_DT,CHG_FG4,CHG_FG5,Column5,CURR_UNIT,BSNS_DEPT_PMT_YN,TOT_PRES_AMT,PUR_RQST_NO_ONE,CNTU_BSNS_YN,CNTU_CTRCT_YN,CMLT_FRM_DT,CMLT_TO_DT
  test.skip('[no:9] 계약등록 - 삭제 (delHstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0311/setDtl.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:10] 계약등록 - 저장 (setDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0311/getCtrctDtlLastList.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:11] 계약등록 - 조회 (getCtrctDtlLastList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/purCtrct/getReslDegDivList.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:12] 계약등록 - 조회 (getReslDegDivList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0311/uptChk.do | inputCols=-
  test.skip('[no:13] 계약등록 - 수정 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0311/exmntChk.do | inputCols=-
  test.skip('[no:14] 계약등록 - 조회 (exmntChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0311/setExmntData.do | inputCols=RGST_NO,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,CORP_CD,BUSI_PLC_CD,WORK_AREA,ACT_UNIT_CD,PCHRG_EMP_NO,PCHRG_EMP_NM,PCHRG_DEPT_CD,FRGN_CLS,PUR_TP,PUR_CONT_NO,CTRCT_NM,CTRCT_DT,CTRCT_FRM_DT,CTRCT_TO_DT,DLVERY_DAYS,DLVR_PLC_CD,DLVR_PLC_FLOOR,DLVR_PLC,DLVR_PLC_NM,CONT_TP,CTRCT_MTHD,CTRCT_MTHD2,TOT_RGST_AMT,SUCC_AMT,CTRCT_GNTE_RATE,CTRCT_GNTE_AMT,CTRCT_AMT,CTRCT_AMT_FRGN,VAT_TP,TOT_SPLY_VAL,TOT_VAT,TOT_ADD_AMT,TOT_PUR_AMT,TOT_MKDP_AMT,DEPS_AMT,RMN_AMT,DLY_AMT_RATE,DLY_DAYS,DLY_AMT,DLY_AMT_FRGN,STAMP_AMT,CTRCT_CUST_CD,CTRCT_CUST_NM,CTRCT_CUST_NM_ENG,REG_NO,CTRCT_CUST_ADDR,CTRCT_CUST_ADDR_DTL,CTRCT_CUST_ENG_ADDR,CTRCT_CUST_TEL_NO,CTRCT_CUST_FAX_NO,CTRCT_CUST_MNG_NM,CTRCT_CUST_MNG_TEL_NO,CTRCT_CUST_MNG_MAIL,REPRES,BK_CD,BK_NM,DPSTS_BNKB_NM,PUR_BK_ACC_NO,ADDRES_CRTFC_AT,CSTRN_SDT,CSTRN_EDT,CHG_CONT_RSN,CTRCT_RJCT_YN,CTRCT_RJCT_RSN,REF_CTRCT_NO,PAY_CHK,ETC_CONT,E_CONT_YN,E_CONT_RQST_DT,E_CONT_DT,E_CONT_STAT,COST_REG_NO,COST_CUST_CD,COST_CUST_NM,COST_ADD_AMT,LAST_DLVR_DT,DLVR_END_YN,LAST_EXMNT_DT,EXMNT_END_YN,PUR_END_YN,RMK,REP_CURR_UNIT,REP_EXCHNG_RATE,CONT_TERMS,PAY_TERMS,DLVR_PNT,RQST_NOS,PUR_RQST_NO,APV_STAT_CD,APV_STAT_NM,PUR_STEP,PUR_STEP_NM,OLD_STEP,BUDG_NULL_YN,CONT_CLS,CTRCT_ADD1,CTRCT_ADD2,CTRCT_ADD3,CTRCT_ADD4,CHK_DT,CTRCT_WRG_GNTE_TERM,CTRCT_WRG_GNTE_RATE,CTRCT_WRG_GNTE_AMT,OLD_SYS_KEY,EBID_URL,E_CONT_URL,GW_DOC_ID,MAIL_CLS,REF_GW_DOC_IDS,ADD_AMT_RATE,CTRCT_GNTE_AMT_FRGN,MGT_ITEM_NM,STDR_DT,OD_FG,OPT_CONT,OFFER_NO,OFFER_DT,CTRCT_COND,SPLY_COM,MAKE_COM,SHPP_EXPN,NTFC_DT,UPT_DT,RISK_OPET1,RISK_OPET2,RISK_OPET3,RISK_OPET4,RISK_OPET5,RISK_OPET_EXCLUS,DLVERY_EDT,YEARS_FG,ifId,daysDiff,CUST_FG,RISK_CHK_YN,PRAR_PC_FG,PCUM_MTHD,PAY_MTHD,SUBD_MTHD,E_CONT_NO,CHG_FG1,CHG_FG2,CHG_FG3,CHG_FG6,RQST_NO,DVEY_CND,PRAR_BASC_AMT,SCHLR_YN,MAKER,SHPP_EX_DT,CHG_FG4,CHG_FG5,Column5,CURR_UNIT,BSNS_DEPT_PMT_YN,TOT_PRES_AMT,PUR_RQST_NO_ONE,CNTU_BSNS_YN,CNTU_CTRCT_YN,CMLT_FRM_DT,CMLT_TO_DT
  test.skip('[no:15] 계약등록 - 저장 (setExmntData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0311/setTodo.do | inputCols=RGST_NO,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,CORP_CD,BUSI_PLC_CD,WORK_AREA,ACT_UNIT_CD,PCHRG_EMP_NO,PCHRG_EMP_NM,PCHRG_DEPT_CD,FRGN_CLS,PUR_TP,PUR_CONT_NO,CTRCT_NM,CTRCT_DT,CTRCT_FRM_DT,CTRCT_TO_DT,DLVERY_DAYS,DLVR_PLC_CD,DLVR_PLC_FLOOR,DLVR_PLC,DLVR_PLC_NM,CONT_TP,CTRCT_MTHD,CTRCT_MTHD2,TOT_RGST_AMT,SUCC_AMT,CTRCT_GNTE_RATE,CTRCT_GNTE_AMT,CTRCT_AMT,CTRCT_AMT_FRGN,VAT_TP,TOT_SPLY_VAL,TOT_VAT,TOT_ADD_AMT,TOT_PUR_AMT,TOT_MKDP_AMT,DEPS_AMT,RMN_AMT,DLY_AMT_RATE,DLY_DAYS,DLY_AMT,DLY_AMT_FRGN,STAMP_AMT,CTRCT_CUST_CD,CTRCT_CUST_NM,CTRCT_CUST_NM_ENG,REG_NO,CTRCT_CUST_ADDR,CTRCT_CUST_ADDR_DTL,CTRCT_CUST_ENG_ADDR,CTRCT_CUST_TEL_NO,CTRCT_CUST_FAX_NO,CTRCT_CUST_MNG_NM,CTRCT_CUST_MNG_TEL_NO,CTRCT_CUST_MNG_MAIL,REPRES,BK_CD,BK_NM,DPSTS_BNKB_NM,PUR_BK_ACC_NO,ADDRES_CRTFC_AT,CSTRN_SDT,CSTRN_EDT,CHG_CONT_RSN,CTRCT_RJCT_YN,CTRCT_RJCT_RSN,REF_CTRCT_NO,PAY_CHK,ETC_CONT,E_CONT_YN,E_CONT_RQST_DT,E_CONT_DT,E_CONT_STAT,COST_REG_NO,COST_CUST_CD,COST_CUST_NM,COST_ADD_AMT,LAST_DLVR_DT,DLVR_END_YN,LAST_EXMNT_DT,EXMNT_END_YN,PUR_END_YN,RMK,REP_CURR_UNIT,REP_EXCHNG_RATE,CONT_TERMS,PAY_TERMS,DLVR_PNT,RQST_NOS,PUR_RQST_NO,APV_STAT_CD,APV_STAT_NM,PUR_STEP,PUR_STEP_NM,OLD_STEP,BUDG_NULL_YN,CONT_CLS,CTRCT_ADD1,CTRCT_ADD2,CTRCT_ADD3,CTRCT_ADD4,CHK_DT,CTRCT_WRG_GNTE_TERM,CTRCT_WRG_GNTE_RATE,CTRCT_WRG_GNTE_AMT,OLD_SYS_KEY,EBID_URL,E_CONT_URL,GW_DOC_ID,MAIL_CLS,REF_GW_DOC_IDS,ADD_AMT_RATE,CTRCT_GNTE_AMT_FRGN,MGT_ITEM_NM,STDR_DT,OD_FG,OPT_CONT,OFFER_NO,OFFER_DT,CTRCT_COND,SPLY_COM,MAKE_COM,SHPP_EXPN,NTFC_DT,UPT_DT,RISK_OPET1,RISK_OPET2,RISK_OPET3,RISK_OPET4,RISK_OPET5,RISK_OPET_EXCLUS,DLVERY_EDT,YEARS_FG,ifId,daysDiff,CUST_FG,RISK_CHK_YN,PRAR_PC_FG,PCUM_MTHD,PAY_MTHD,SUBD_MTHD,E_CONT_NO,CHG_FG1,CHG_FG2,CHG_FG3,CHG_FG6,RQST_NO,DVEY_CND,PRAR_BASC_AMT,SCHLR_YN,MAKER,SHPP_EX_DT,CHG_FG4,CHG_FG5,Column5,CURR_UNIT,BSNS_DEPT_PMT_YN,TOT_PRES_AMT,PUR_RQST_NO_ONE,CNTU_BSNS_YN,CNTU_CTRCT_YN,CMLT_FRM_DT,CMLT_TO_DT
  test.skip('[no:16] 계약등록 - 저장 (setTodo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0311/setDelCont.do | inputCols=RGST_NO,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,CORP_CD,BUSI_PLC_CD,WORK_AREA,ACT_UNIT_CD,PCHRG_EMP_NO,PCHRG_EMP_NM,PCHRG_DEPT_CD,FRGN_CLS,PUR_TP,PUR_CONT_NO,CTRCT_NM,CTRCT_DT,CTRCT_FRM_DT,CTRCT_TO_DT,DLVERY_DAYS,DLVR_PLC_CD,DLVR_PLC_FLOOR,DLVR_PLC,DLVR_PLC_NM,CONT_TP,CTRCT_MTHD,CTRCT_MTHD2,TOT_RGST_AMT,SUCC_AMT,CTRCT_GNTE_RATE,CTRCT_GNTE_AMT,CTRCT_AMT,CTRCT_AMT_FRGN,VAT_TP,TOT_SPLY_VAL,TOT_VAT,TOT_ADD_AMT,TOT_PUR_AMT,TOT_MKDP_AMT,DEPS_AMT,RMN_AMT,DLY_AMT_RATE,DLY_DAYS,DLY_AMT,DLY_AMT_FRGN,STAMP_AMT,CTRCT_CUST_CD,CTRCT_CUST_NM,CTRCT_CUST_NM_ENG,REG_NO,CTRCT_CUST_ADDR,CTRCT_CUST_ADDR_DTL,CTRCT_CUST_ENG_ADDR,CTRCT_CUST_TEL_NO,CTRCT_CUST_FAX_NO,CTRCT_CUST_MNG_NM,CTRCT_CUST_MNG_TEL_NO,CTRCT_CUST_MNG_MAIL,REPRES,BK_CD,BK_NM,DPSTS_BNKB_NM,PUR_BK_ACC_NO,ADDRES_CRTFC_AT,CSTRN_SDT,CSTRN_EDT,CHG_CONT_RSN,CTRCT_RJCT_YN,CTRCT_RJCT_RSN,REF_CTRCT_NO,PAY_CHK,ETC_CONT,E_CONT_YN,E_CONT_RQST_DT,E_CONT_DT,E_CONT_STAT,COST_REG_NO,COST_CUST_CD,COST_CUST_NM,COST_ADD_AMT,LAST_DLVR_DT,DLVR_END_YN,LAST_EXMNT_DT,EXMNT_END_YN,PUR_END_YN,RMK,REP_CURR_UNIT,REP_EXCHNG_RATE,CONT_TERMS,PAY_TERMS,DLVR_PNT,RQST_NOS,PUR_RQST_NO,APV_STAT_CD,APV_STAT_NM,PUR_STEP,PUR_STEP_NM,OLD_STEP,BUDG_NULL_YN,CONT_CLS,CTRCT_ADD1,CTRCT_ADD2,CTRCT_ADD3,CTRCT_ADD4,CHK_DT,CTRCT_WRG_GNTE_TERM,CTRCT_WRG_GNTE_RATE,CTRCT_WRG_GNTE_AMT,OLD_SYS_KEY,EBID_URL,E_CONT_URL,GW_DOC_ID,MAIL_CLS,REF_GW_DOC_IDS,ADD_AMT_RATE,CTRCT_GNTE_AMT_FRGN,MGT_ITEM_NM,STDR_DT,OD_FG,OPT_CONT,OFFER_NO,OFFER_DT,CTRCT_COND,SPLY_COM,MAKE_COM,SHPP_EXPN,NTFC_DT,UPT_DT,RISK_OPET1,RISK_OPET2,RISK_OPET3,RISK_OPET4,RISK_OPET5,RISK_OPET_EXCLUS,DLVERY_EDT,YEARS_FG,ifId,daysDiff,CUST_FG,RISK_CHK_YN,PRAR_PC_FG,PCUM_MTHD,PAY_MTHD,SUBD_MTHD,E_CONT_NO,CHG_FG1,CHG_FG2,CHG_FG3,CHG_FG6,RQST_NO,DVEY_CND,PRAR_BASC_AMT,SCHLR_YN,MAKER,SHPP_EX_DT,CHG_FG4,CHG_FG5,Column5,CURR_UNIT,BSNS_DEPT_PMT_YN,TOT_PRES_AMT,PUR_RQST_NO_ONE,CNTU_BSNS_YN,CNTU_CTRCT_YN,CMLT_FRM_DT,CMLT_TO_DT
  test.skip('[no:17] 계약등록 - 삭제 (setDelCont) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0311/setMst2.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:18] 계약등록 - 저장 (setMst2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0311/setWrgGrt.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:19] 계약등록 - 저장 (setWrgGrt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0311/setReslDeg.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:20] 계약등록 - 저장 (setReslDeg) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0111/addAmtFrgn.do | inputCols=RGST_NO,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,CORP_CD,BUSI_PLC_CD,WORK_AREA,ACT_UNIT_CD,PCHRG_EMP_NO,PCHRG_EMP_NM,PCHRG_DEPT_CD,FRGN_CLS,PUR_TP,PUR_CONT_NO,CTRCT_NM,CTRCT_DT,CTRCT_FRM_DT,CTRCT_TO_DT,DLVERY_DAYS,DLVR_PLC_CD,DLVR_PLC_FLOOR,DLVR_PLC,DLVR_PLC_NM,CONT_TP,CTRCT_MTHD,CTRCT_MTHD2,TOT_RGST_AMT,SUCC_AMT,CTRCT_GNTE_RATE,CTRCT_GNTE_AMT,CTRCT_AMT,CTRCT_AMT_FRGN,VAT_TP,TOT_SPLY_VAL,TOT_VAT,TOT_ADD_AMT,TOT_PUR_AMT,TOT_MKDP_AMT,DEPS_AMT,RMN_AMT,DLY_AMT_RATE,DLY_DAYS,DLY_AMT,DLY_AMT_FRGN,STAMP_AMT,CTRCT_CUST_CD,CTRCT_CUST_NM,CTRCT_CUST_NM_ENG,REG_NO,CTRCT_CUST_ADDR,CTRCT_CUST_ADDR_DTL,CTRCT_CUST_ENG_ADDR,CTRCT_CUST_TEL_NO,CTRCT_CUST_FAX_NO,CTRCT_CUST_MNG_NM,CTRCT_CUST_MNG_TEL_NO,CTRCT_CUST_MNG_MAIL,REPRES,BK_CD,BK_NM,DPSTS_BNKB_NM,PUR_BK_ACC_NO,ADDRES_CRTFC_AT,CSTRN_SDT,CSTRN_EDT,CHG_CONT_RSN,CTRCT_RJCT_YN,CTRCT_RJCT_RSN,REF_CTRCT_NO,PAY_CHK,ETC_CONT,E_CONT_YN,E_CONT_RQST_DT,E_CONT_DT,E_CONT_STAT,COST_REG_NO,COST_CUST_CD,COST_CUST_NM,COST_ADD_AMT,LAST_DLVR_DT,DLVR_END_YN,LAST_EXMNT_DT,EXMNT_END_YN,PUR_END_YN,RMK,REP_CURR_UNIT,REP_EXCHNG_RATE,CONT_TERMS,PAY_TERMS,DLVR_PNT,RQST_NOS,PUR_RQST_NO,APV_STAT_CD,APV_STAT_NM,PUR_STEP,PUR_STEP_NM,OLD_STEP,BUDG_NULL_YN,CONT_CLS,CTRCT_ADD1,CTRCT_ADD2,CTRCT_ADD3,CTRCT_ADD4,CHK_DT,CTRCT_WRG_GNTE_TERM,CTRCT_WRG_GNTE_RATE,CTRCT_WRG_GNTE_AMT,OLD_SYS_KEY,EBID_URL,E_CONT_URL,GW_DOC_ID,MAIL_CLS,REF_GW_DOC_IDS,ADD_AMT_RATE,CTRCT_GNTE_AMT_FRGN,MGT_ITEM_NM,STDR_DT,OD_FG,OPT_CONT,OFFER_NO,OFFER_DT,CTRCT_COND,SPLY_COM,MAKE_COM,SHPP_EXPN,NTFC_DT,UPT_DT,RISK_OPET1,RISK_OPET2,RISK_OPET3,RISK_OPET4,RISK_OPET5,RISK_OPET_EXCLUS,DLVERY_EDT,YEARS_FG,ifId,daysDiff,CUST_FG,RISK_CHK_YN,PRAR_PC_FG,PCUM_MTHD,PAY_MTHD,SUBD_MTHD,E_CONT_NO,CHG_FG1,CHG_FG2,CHG_FG3,CHG_FG6,RQST_NO,DVEY_CND,PRAR_BASC_AMT,SCHLR_YN,MAKER,SHPP_EX_DT,CHG_FG4,CHG_FG5,Column5,CURR_UNIT,BSNS_DEPT_PMT_YN,TOT_PRES_AMT,PUR_RQST_NO_ONE,CNTU_BSNS_YN,CNTU_CTRCT_YN,CMLT_FRM_DT,CMLT_TO_DT
  test.skip('[no:21] 계약등록 - 저장 (addAmtFrgn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/purCom/setAppStat2.do | inputCols=RGST_NO,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,CORP_CD,BUSI_PLC_CD,WORK_AREA,ACT_UNIT_CD,PCHRG_EMP_NO,PCHRG_EMP_NM,PCHRG_DEPT_CD,FRGN_CLS,PUR_TP,PUR_CONT_NO,CTRCT_NM,CTRCT_DT,CTRCT_FRM_DT,CTRCT_TO_DT,DLVERY_DAYS,DLVR_PLC_CD,DLVR_PLC_FLOOR,DLVR_PLC,DLVR_PLC_NM,CONT_TP,CTRCT_MTHD,CTRCT_MTHD2,TOT_RGST_AMT,SUCC_AMT,CTRCT_GNTE_RATE,CTRCT_GNTE_AMT,CTRCT_AMT,CTRCT_AMT_FRGN,VAT_TP,TOT_SPLY_VAL,TOT_VAT,TOT_ADD_AMT,TOT_PUR_AMT,TOT_MKDP_AMT,DEPS_AMT,RMN_AMT,DLY_AMT_RATE,DLY_DAYS,DLY_AMT,DLY_AMT_FRGN,STAMP_AMT,CTRCT_CUST_CD,CTRCT_CUST_NM,CTRCT_CUST_NM_ENG,REG_NO,CTRCT_CUST_ADDR,CTRCT_CUST_ADDR_DTL,CTRCT_CUST_ENG_ADDR,CTRCT_CUST_TEL_NO,CTRCT_CUST_FAX_NO,CTRCT_CUST_MNG_NM,CTRCT_CUST_MNG_TEL_NO,CTRCT_CUST_MNG_MAIL,REPRES,BK_CD,BK_NM,DPSTS_BNKB_NM,PUR_BK_ACC_NO,ADDRES_CRTFC_AT,CSTRN_SDT,CSTRN_EDT,CHG_CONT_RSN,CTRCT_RJCT_YN,CTRCT_RJCT_RSN,REF_CTRCT_NO,PAY_CHK,ETC_CONT,E_CONT_YN,E_CONT_RQST_DT,E_CONT_DT,E_CONT_STAT,COST_REG_NO,COST_CUST_CD,COST_CUST_NM,COST_ADD_AMT,LAST_DLVR_DT,DLVR_END_YN,LAST_EXMNT_DT,EXMNT_END_YN,PUR_END_YN,RMK,REP_CURR_UNIT,REP_EXCHNG_RATE,CONT_TERMS,PAY_TERMS,DLVR_PNT,RQST_NOS,PUR_RQST_NO,APV_STAT_CD,APV_STAT_NM,PUR_STEP,PUR_STEP_NM,OLD_STEP,BUDG_NULL_YN,CONT_CLS,CTRCT_ADD1,CTRCT_ADD2,CTRCT_ADD3,CTRCT_ADD4,CHK_DT,CTRCT_WRG_GNTE_TERM,CTRCT_WRG_GNTE_RATE,CTRCT_WRG_GNTE_AMT,OLD_SYS_KEY,EBID_URL,E_CONT_URL,GW_DOC_ID,MAIL_CLS,REF_GW_DOC_IDS,ADD_AMT_RATE,CTRCT_GNTE_AMT_FRGN,MGT_ITEM_NM,STDR_DT,OD_FG,OPT_CONT,OFFER_NO,OFFER_DT,CTRCT_COND,SPLY_COM,MAKE_COM,SHPP_EXPN,NTFC_DT,UPT_DT,RISK_OPET1,RISK_OPET2,RISK_OPET3,RISK_OPET4,RISK_OPET5,RISK_OPET_EXCLUS,DLVERY_EDT,YEARS_FG,ifId,daysDiff,CUST_FG,RISK_CHK_YN,PRAR_PC_FG,PCUM_MTHD,PAY_MTHD,SUBD_MTHD,E_CONT_NO,CHG_FG1,CHG_FG2,CHG_FG3,CHG_FG6,RQST_NO,DVEY_CND,PRAR_BASC_AMT,SCHLR_YN,MAKER,SHPP_EX_DT,CHG_FG4,CHG_FG5,Column5,CURR_UNIT,BSNS_DEPT_PMT_YN,TOT_PRES_AMT,PUR_RQST_NO_ONE,CNTU_BSNS_YN,CNTU_CTRCT_YN,CMLT_FRM_DT,CMLT_TO_DT
  test.skip('[no:22] 계약등록 - 저장 (setAppStat2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0321/setReslEnd.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:23] 계약등록 - 저장 (setReslEnd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0311/setMst3.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACT_UNIT_CD,TEMP_AMT,DIV_CNT,DIV_TERM,UPT_DT,UPT_DT2,UPT_DT3,UPT_DT4,ACCT_NM,TEMP_TOT_AMT,PRAR_BASC_AMT,TMP_CTRCT_AMT
  test.skip('[no:24] 계약등록 - 저장 (setMst3) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0311/delMst3.do | inputCols=-
  test.skip('[no:25] 계약등록 - 삭제 (delMst3) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0311/setCntuList.do | inputCols=isChecked,tmHeader,RQST_NO,YY_TME,FRM_DT,TO_DT,CTRCT_AMT,Column5,Column6
  test.skip('[no:26] 계약등록 - 저장 (setCntuList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매계약(외자) (pur_0321m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0321m' OR MNU_NM LIKE '구매계약(외자)%'
  const MENU_ID = 'TODO_pur_0321m';
  const API_URL = '/mis/pur/pur0321/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'CTRCT_NO', 'CTRCT_SEQ', 'CTRCT_DEG', 'FRGN_CLS', 'PUR_TP', 'RGST_NO', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PROJ_EXE_CLS', 'ACCT_UNT_CD', 'TEMP_AMT', 'DIV_CNT', 'DIV_TERM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0321/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACCT_UNT_CD,TEMP_AMT,DIV_CNT,DIV_TERM
  test.skip('[no:1] 구매계약(외자) - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0321/getBlData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACCT_UNT_CD,TEMP_AMT,DIV_CNT,DIV_TERM
  test.skip('[no:2] 구매계약(외자) - 조회 (getBlData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0321/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACCT_UNT_CD,TEMP_AMT,DIV_CNT,DIV_TERM
  test.skip('[no:3] 구매계약(외자) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0321/setMst.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACCT_UNT_CD,TEMP_AMT,DIV_CNT,DIV_TERM
  test.skip('[no:4] 구매계약(외자) - 저장 (setMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0321/delData.do | inputCols=RGST_NO,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,CORP_CD,BUSI_PLC_CD,WRK_AREA,ACCT_UNT_CD,CHRG_EMP_NO,CHRG_EMP_NM,CHRG_DEPT_CD,FRGN_CLS,PUR_TP,PUR_CONT_NO,CTRCT_NM,CTRCT_DT,CTRCT_SDT,CTRCT_EDT,DLVERY_DAYS,DLVERY_GDS_PLC,DLVERY_GDS_PLC_NM,CONT_TP,CTRCT_MTHD,TOT_RGST_AMT,SUCC_AMT,CTRCT_GNTE_RATE,CTRCT_GNTE_AMT,CTRCT_AMT,CTRCT_AMT_FRGN,NTFC_DT,VAT_TYPE,TOT_SPLY_VAL,TOT_VAT,TOT_ADD_AMT,TOT_PUR_AMT,TOT_INCM_AMT,DEPS_AMT,RMN_AMT,DLY_AMT_RATE,DLY_DAYS,DLY_AMT,DLY_AMT_FRGN,STAMP_AMT,CTRCT_CUST_CD,CTRCT_CUST_NM,CTRCT_CUST_NM_ENG,REG_NO,CTRCT_CUST_ADDR,CTRCT_CUST_ADDR_DTL,CTRCT_CUST_TEL_NO,CTRCT_CUST_FAX_NO,CTRCT_CUST_MNG_NM,CTRCT_CUST_MNG_TEL_NO,CTRCT_CUST_MNG_EMAIL,REPRES,BK_CD,BK_NM,DPSIT_NM,PUR_BK_ACC_NO,ADDRES_CRTFC_AT,CSTRN_SDT,CSTRN_EDT,CHG_CONT_RSN,CTRCT_RJCT_YN,CTRCT_RJCT_RSN,REF_CTRCT_NO,PAY_CHK,ETC_CONT,E_CONT_YN,E_CONT_RQST_DT,E_CONT_DT,E_CONT_STAT,COST_REG_NO,COST_CUST_CD,COST_CUST_NM,COST_ADD_AMT,LAST_DLVR_DT,DLVR_END_YN,LAST_EXMNT_DT,EXMNT_END_YN,PUR_END_YN,RMK,REP_CURR_UNIT,REP_EXCHNG_RATE,CTRCT_COND,PAY_TERMS,DLVR_PNT,RQST_NOS,PUR_RQST_NO,APV_STAT_CD,APV_STAT_NM,CSTRN_TP_CTRCT_AMT,WRG_GRT_MNG_SDT,WRG_GRT_MNG_EDT,WRG_GRT_MNG_TERM,WRG_GNTE_RATE,WRG_GNTE_AMT,CTRCT_WRG_GNTE_TERM,CTRCT_WRG_GNTE_RATE,PUR_STEP,PUR_STEP_NM,OLD_STEP,BUDG_NULL_YN,CONT_CLS,CTRCT_ADD1,CTRCT_ADD2,CTRCT_ADD3,CTRCT_ADD4,CHK_DT,OLD_SYS_KEY,EBID_URL,E_CONT_URL,GW_DOC_ID,REF_GW_DOC_IDS,CTRCT_GNTE_AMT_FRGN,RGD_TRGT_YN
  test.skip('[no:5] 구매계약(외자) - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0321/purEndData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACCT_UNT_CD,TEMP_AMT,DIV_CNT,DIV_TERM
  test.skip('[no:6] 구매계약(외자) - 조회 (purEndData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0321/purEndRtnData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACCT_UNT_CD,TEMP_AMT,DIV_CNT,DIV_TERM
  test.skip('[no:7] 구매계약(외자) - 조회 (purEndRtnData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/purctrct/delHstData.do | inputCols=RGST_NO,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,CORP_CD,BUSI_PLC_CD,WRK_AREA,ACCT_UNT_CD,CHRG_EMP_NO,CHRG_EMP_NM,CHRG_DEPT_CD,FRGN_CLS,PUR_TP,PUR_CONT_NO,CTRCT_NM,CTRCT_DT,CTRCT_SDT,CTRCT_EDT,DLVERY_DAYS,DLVERY_GDS_PLC,DLVERY_GDS_PLC_NM,CONT_TP,CTRCT_MTHD,TOT_RGST_AMT,SUCC_AMT,CTRCT_GNTE_RATE,CTRCT_GNTE_AMT,CTRCT_AMT,CTRCT_AMT_FRGN,NTFC_DT,VAT_TYPE,TOT_SPLY_VAL,TOT_VAT,TOT_ADD_AMT,TOT_PUR_AMT,TOT_INCM_AMT,DEPS_AMT,RMN_AMT,DLY_AMT_RATE,DLY_DAYS,DLY_AMT,DLY_AMT_FRGN,STAMP_AMT,CTRCT_CUST_CD,CTRCT_CUST_NM,CTRCT_CUST_NM_ENG,REG_NO,CTRCT_CUST_ADDR,CTRCT_CUST_ADDR_DTL,CTRCT_CUST_TEL_NO,CTRCT_CUST_FAX_NO,CTRCT_CUST_MNG_NM,CTRCT_CUST_MNG_TEL_NO,CTRCT_CUST_MNG_EMAIL,REPRES,BK_CD,BK_NM,DPSIT_NM,PUR_BK_ACC_NO,ADDRES_CRTFC_AT,CSTRN_SDT,CSTRN_EDT,CHG_CONT_RSN,CTRCT_RJCT_YN,CTRCT_RJCT_RSN,REF_CTRCT_NO,PAY_CHK,ETC_CONT,E_CONT_YN,E_CONT_RQST_DT,E_CONT_DT,E_CONT_STAT,COST_REG_NO,COST_CUST_CD,COST_CUST_NM,COST_ADD_AMT,LAST_DLVR_DT,DLVR_END_YN,LAST_EXMNT_DT,EXMNT_END_YN,PUR_END_YN,RMK,REP_CURR_UNIT,REP_EXCHNG_RATE,CTRCT_COND,PAY_TERMS,DLVR_PNT,RQST_NOS,PUR_RQST_NO,APV_STAT_CD,APV_STAT_NM,CSTRN_TP_CTRCT_AMT,WRG_GRT_MNG_SDT,WRG_GRT_MNG_EDT,WRG_GRT_MNG_TERM,WRG_GNTE_RATE,WRG_GNTE_AMT,CTRCT_WRG_GNTE_TERM,CTRCT_WRG_GNTE_RATE,PUR_STEP,PUR_STEP_NM,OLD_STEP,BUDG_NULL_YN,CONT_CLS,CTRCT_ADD1,CTRCT_ADD2,CTRCT_ADD3,CTRCT_ADD4,CHK_DT,OLD_SYS_KEY,EBID_URL,E_CONT_URL,GW_DOC_ID,REF_GW_DOC_IDS,CTRCT_GNTE_AMT_FRGN,RGD_TRGT_YN
  test.skip('[no:8] 구매계약(외자) - 삭제 (delHstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0321/setDtl.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACCT_UNT_CD,TEMP_AMT,DIV_CNT,DIV_TERM
  test.skip('[no:9] 구매계약(외자) - 저장 (setDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0321/getCtrctDtlLastList.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACCT_UNT_CD,TEMP_AMT,DIV_CNT,DIV_TERM
  test.skip('[no:10] 구매계약(외자) - 조회 (getCtrctDtlLastList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0321/setECont.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACCT_UNT_CD,TEMP_AMT,DIV_CNT,DIV_TERM
  test.skip('[no:11] 구매계약(외자) - 저장 (setECont) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0321/setMst2.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACCT_UNT_CD,TEMP_AMT,DIV_CNT,DIV_TERM
  test.skip('[no:12] 구매계약(외자) - 저장 (setMst2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0321/delMst2.do | inputCols=isChecked,tmHeader,CTRCT_NO,CTRCT_SEQ,BL_SEQ,BL_NO,BL_DT,BL_PUB_CMP,BL_ITEM_NM,SHIP_EX_DT,SHIP_DT,SHIP_AMT,BL_CURR_UNIT,BL_EXCHNG_RATE,SHIP_PORT,SHIP_ARR_DT,SHIP_ARR_PORT,WRHSNG_DT,TRANS_CUST,LC_NO,LC_DT,INV_DT,INV_AMT,INV_CURR_UNIT,IMPT_PRMT_LC,IMPT_PRMT_DT,TRFF_PAY_DT,HS_NO,PST_CNTR_END_DT,RMK,CHK_DT
  test.skip('[no:13] 구매계약(외자) - 삭제 (delMst2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0321/setReslDeg.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACCT_UNT_CD,TEMP_AMT,DIV_CNT,DIV_TERM
  test.skip('[no:14] 구매계약(외자) - 저장 (setReslDeg) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/purCtrct/getReslDegDivList.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACCT_UNT_CD,TEMP_AMT,DIV_CNT,DIV_TERM
  test.skip('[no:15] 구매계약(외자) - 조회 (getReslDegDivList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0311/setReslEnd.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACCT_UNT_CD,TEMP_AMT,DIV_CNT,DIV_TERM
  test.skip('[no:16] 구매계약(외자) - 저장 (setReslEnd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계약구매물품현황 (pur_0350m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0350m' OR MNU_NM LIKE '계약구매물품현황%'
  const MENU_ID = 'TODO_pur_0350m';
  const API_URL = '/mis/pur/pur0350/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'PUR_TPS', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_FRGN_CLS', 'PUR_STEPS', 'G_CLS_DIV', 'M_CLS_DIV', 'S_CLS_DIV', 'SCH_PUR_RQST_CLS', 'SCH_CONT_TP', 'DEPT_CHIF_YN', 'ROLE_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0350/getList.do | inputCols=SCH_SRCH_SDT,SCH_SRCH_EDT,PUR_TPS,SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_FRGN_CLS,PUR_STEPS,G_CLS_DIV,M_CLS_DIV,S_CLS_DIV,SCH_PUR_RQST_CLS,SCH_CONT_TP,DEPT_CHIF_YN,ROLE_YN
  test.skip('[no:1] 계약구매물품현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass9904/getComboList.do | inputCols=SCH_SRCH_SDT,SCH_SRCH_EDT,PUR_TPS,SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_FRGN_CLS,PUR_STEPS,G_CLS_DIV,M_CLS_DIV,S_CLS_DIV,SCH_PUR_RQST_CLS,SCH_CONT_TP,DEPT_CHIF_YN,ROLE_YN
  test.skip('[no:2] 계약구매물품현황 - 조회 (getComboList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매계약정보 (pur_0351m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0351m' OR MNU_NM LIKE '구매계약정보%'
  const MENU_ID = 'TODO_pur_0351m';
  const API_URL = '/mis/pur/pur0321/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'CTRCT_NO', 'CTRCT_SEQ', 'CTRCT_DEG', 'FRGN_CLS', 'PUR_TP', 'RGST_NO', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PROJ_EXE_CLS', 'ACCT_UNT_CD', 'TEMP_AMT', 'DIV_CNT', 'DIV_TERM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0321/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,CTRCT_NO,CTRCT_SEQ,CTRCT_DEG,FRGN_CLS,PUR_TP,RGST_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PROJ_EXE_CLS,ACCT_UNT_CD,TEMP_AMT,DIV_CNT,DIV_TERM
  test.skip('[no:1] 구매계약정보 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('검수현황 (pur_0400m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0400m' OR MNU_NM LIKE '검수현황%'
  const MENU_ID = 'TODO_pur_0400m';
  const API_URL = '/mis/pur/pur0400/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'SCH_DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'APV_STAT_CD', 'SCH_APNT_DEPT_NM', 'SCH_APNT_DEPT_CD', 'DEPT_NM', 'DEPT_CD', 'SCH_APNT_EMP_NM', 'SCH_APNT_EMP_NO', 'STAT_CLS', 'ROLE_YN', 'DEPT_CHIF_YN', 'EXMNT_CLS', 'EXMNT_END_YN', 'EXMNT_TP', 'SCH_S_AMT', 'SCH_E_AMT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0400/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,SCH_DT_CLS,SCH_RQST_SDT,SCH_RQST_EDT,SCH_SRCH_CLS,SCH_SRCH_KEY,APV_STAT_CD,SCH_APNT_DEPT_NM,SCH_APNT_DEPT_CD,DEPT_NM,DEPT_CD,SCH_APNT_EMP_NM,SCH_APNT_EMP_NO,STAT_CLS,ROLE_YN,DEPT_CHIF_YN,EXMNT_CLS,EXMNT_END_YN,EXMNT_TP,SCH_S_AMT,SCH_E_AMT
  test.skip('[no:1] 검수현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0400/getChk.do | inputCols=EXMNT_CLS,EXMNT_CLS_NM,PUR_TP,PUR_TP_NM,PUR_CONT_NO,PUR_STEP,PUR_STEP_NM,RQST_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,EXMNT_NO,EXMNT_DT,EXMNT_APNT_EMP_NO,EXMNT_APNT_EMP_NM,EXMNT_RQST_DEPT_CD,EXMNT_RQST_DEPT_NM,EXMNT_EMP_NO,EXMNT_EMP_NM,EXMNT_EMP_NO2,EXMNT_EMP_NM2,EXMNT_DEPT_CD,EXMNT_DEPT_NM,EXMNT_OPNN,CTRCT_NM,CTRCT_AMT,CTRCT_AMT_FRGN,CTRCT_FRM_DT,CTRCT_TO_DT,CHRG_EMP_NO,CHRG_EMP_NM,CTRCT_CUST_CD,CTRCT_CUST_NM,FRGN_CLS,CTRCT_SEQ,CTRCT_NO,MNG_EXMNT_EMP_NO,MNG_EXMNT_EMP_NM,PMT_DGCNT,PMT_ORR,PMT_PRAR_AMT,IMG,GW_DOC_NO,GW_DOC_ID,CTRCT_DT,EXMNT_RQST_DT,EXMNT_END_YN,EXMNT_ASK_DT,EXMNT_TP,EXMNT_TP_NM,RGST_NO,CTRCT_CUST_SEQ,EXMNT_RQST_NO,EXMNT_RQST_STAT,EXMNT_RQST_DOC_ID,IMG2,BE_APV_STAT_CD,BE_PMT_DGCNT,BUTTON_CONTROL,BUTTON_TEXT,INSP_CNRM_YN
  test.skip('[no:2] 검수현황 - 조회 (getChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0400/uptInspCnrm.do | inputCols=-
  test.skip('[no:3] 검수현황 - 수정 (uptInspCnrm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('검수등록 (pur_0411m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0411m' OR MNU_NM LIKE '검수등록%'
  const MENU_ID = 'TODO_pur_0411m';
  const API_URL = '/mis/pur/pur0411/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CTRCT_NO', 'CTRCT_SEQ', 'EXMNT_NO', 'PMT_DGCNT', 'TEMP_AMT', 'RGST_NO', 'EXMNT_TP', 'EXMNT_EMP_SEQ', 'EXMNT_EMP_SEQ2', 'CTRCT_TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0411/getData.do | inputCols=CTRCT_NO,CTRCT_SEQ,EXMNT_NO,PMT_DGCNT,TEMP_AMT,RGST_NO,EXMNT_TP,EXMNT_EMP_SEQ,EXMNT_EMP_SEQ2,CTRCT_TO_DT
  test.skip('[no:1] 검수등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0411/setExmntData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,EXMNT_NO,EXMNT_DEG,EXMNT_STAT,PMT_DGCNT,PMT_ORR,RGST_NO,CTRCT_SEQ,CTRCT_NO,EXMNT_RQST_DT,EXMNT_APNT_EMP_NM,EXMNT_APNT_EMP_NO,EXMNT_APNT_DEPT_CD,EXMNT_APNT_DEPT_NM,EXMNT_EMP_NO,EXMNT_EMP_NM,EXMNT_DEPT_CD,EXMNT_DEPT_NM,EXMNT_DT,DLVR_DT,EXMNT_OPNN,EXMNT_END_YN,RMK,APV_STAT_CD,APV_STAT_NM,INS_ID,CHK_DT,GW_DOC_ID,GW_DOC_NO,PMT_PRAR_AMT,RQST_NO,EXMNT_CLS,EXMNT_TP,EXMNT_TP_NM,EXMNT_RQST_NO,PMT_RQST_NO,EXMNT_REG_DEPT_CD,EXMNT_EMP_CLS,DLVR_PLC_NM,DLVR_PLC_CD,PUR_TP,APP_YN,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_CD,APNT_DEPT_NM,BUSI_PLC_CD2,BUSI_PLC_CD1,DLVR_PLC,DLVR_PLC_FLOOR,CTRCT_TO_DT,DLY_DAYS,DLY_AMT,Column0,DLY_AMT_FG,STBL_YN,EXMNT_DEPT_CD1,EXMNT_DEPT_NM1,EXMNT_EMP_NO1,EXMNT_EMP_NM1,RCV_DEPT_CD,RCV_DEPT_NM,RCV_EMP_NO,RCV_EMP_NM,RCV_DT,EXMNT_MNG_NO,PUR_CONT_NO,FRGN_CLS,TCGY_EXMNT_YN
  test.skip('[no:2] 검수등록 - 저장 (setExmntData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0411/delData.do | inputCols=CTRCT_NO,CTRCT_SEQ,EXMNT_NO,PMT_DGCNT,TEMP_AMT,RGST_NO,EXMNT_TP,EXMNT_EMP_SEQ,EXMNT_EMP_SEQ2,CTRCT_TO_DT
  test.skip('[no:3] 검수등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0411/setAstCd.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,EXMNT_NO,EXMNT_DEG,EXMNT_STAT,PMT_DGCNT,PMT_ORR,RGST_NO,CTRCT_SEQ,CTRCT_NO,EXMNT_RQST_DT,EXMNT_APNT_EMP_NM,EXMNT_APNT_EMP_NO,EXMNT_APNT_DEPT_CD,EXMNT_APNT_DEPT_NM,EXMNT_EMP_NO,EXMNT_EMP_NM,EXMNT_DEPT_CD,EXMNT_DEPT_NM,EXMNT_DT,DLVR_DT,EXMNT_OPNN,EXMNT_END_YN,RMK,APV_STAT_CD,APV_STAT_NM,INS_ID,CHK_DT,GW_DOC_ID,GW_DOC_NO,PMT_PRAR_AMT,RQST_NO,EXMNT_CLS,EXMNT_TP,EXMNT_TP_NM,EXMNT_RQST_NO,PMT_RQST_NO,EXMNT_REG_DEPT_CD,EXMNT_EMP_CLS,DLVR_PLC_NM,DLVR_PLC_CD,PUR_TP,APP_YN,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_CD,APNT_DEPT_NM,BUSI_PLC_CD2,BUSI_PLC_CD1,DLVR_PLC,DLVR_PLC_FLOOR,CTRCT_TO_DT,DLY_DAYS,DLY_AMT,Column0,DLY_AMT_FG,STBL_YN,EXMNT_DEPT_CD1,EXMNT_DEPT_NM1,EXMNT_EMP_NO1,EXMNT_EMP_NM1,RCV_DEPT_CD,RCV_DEPT_NM,RCV_EMP_NO,RCV_EMP_NM,RCV_DT,EXMNT_MNG_NO,PUR_CONT_NO,FRGN_CLS,TCGY_EXMNT_YN
  test.skip('[no:4] 검수등록 - 저장 (setAstCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0411/getOsrEmpNo.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,EXMNT_NO,EXMNT_DEG,EXMNT_STAT,PMT_DGCNT,PMT_ORR,RGST_NO,CTRCT_SEQ,CTRCT_NO,EXMNT_RQST_DT,EXMNT_APNT_EMP_NM,EXMNT_APNT_EMP_NO,EXMNT_APNT_DEPT_CD,EXMNT_APNT_DEPT_NM,EXMNT_EMP_NO,EXMNT_EMP_NM,EXMNT_DEPT_CD,EXMNT_DEPT_NM,EXMNT_DT,DLVR_DT,EXMNT_OPNN,EXMNT_END_YN,RMK,APV_STAT_CD,APV_STAT_NM,INS_ID,CHK_DT,GW_DOC_ID,GW_DOC_NO,PMT_PRAR_AMT,RQST_NO,EXMNT_CLS,EXMNT_TP,EXMNT_TP_NM,EXMNT_RQST_NO,PMT_RQST_NO,EXMNT_REG_DEPT_CD,EXMNT_EMP_CLS,DLVR_PLC_NM,DLVR_PLC_CD,PUR_TP,APP_YN,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_CD,APNT_DEPT_NM,BUSI_PLC_CD2,BUSI_PLC_CD1,DLVR_PLC,DLVR_PLC_FLOOR,CTRCT_TO_DT,DLY_DAYS,DLY_AMT,Column0,DLY_AMT_FG,STBL_YN,EXMNT_DEPT_CD1,EXMNT_DEPT_NM1,EXMNT_EMP_NO1,EXMNT_EMP_NM1,RCV_DEPT_CD,RCV_DEPT_NM,RCV_EMP_NO,RCV_EMP_NM,RCV_DT,EXMNT_MNG_NO,PUR_CONT_NO,FRGN_CLS,TCGY_EXMNT_YN
  test.skip('[no:5] 검수등록 - 조회 (getOsrEmpNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기성/완료 검사조서 (pur_0430m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0430m' OR MNU_NM LIKE '기성/완료 검사조서%'
  const MENU_ID = 'TODO_pur_0430m';
  const API_URL = '/mis/pur/pur0430/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'SCH_DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'RQST_CLS', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'APV_STAT_CD', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'RQST_EMP_NM', 'RQST_EMP_NO', 'STAT_CLS', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_PUR_END_YN', 'DEPT_NM', 'DEPT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0430/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,SCH_DT_CLS,SCH_RQST_SDT,SCH_RQST_EDT,RQST_CLS,SCH_SRCH_CLS,SCH_SRCH_KEY,APV_STAT_CD,RQST_DEPT_NM,RQST_DEPT_CD,RQST_EMP_NM,RQST_EMP_NO,STAT_CLS,ROLE_YN,DEPT_CHIF_YN,SCH_PUR_END_YN,DEPT_NM,DEPT_CD
  test.skip('[no:1] 기성/완료 검사조서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기성/완료 검사조서 (pur_0431m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0431m' OR MNU_NM LIKE '기성/완료 검사조서%'
  const MENU_ID = 'TODO_pur_0431m';
  const API_URL = '/mis/pur/pur0431/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CTRCT_NO', 'CTRCT_SEQ', 'EXMNT_NO', 'RESL_DEG', 'EXMNT_TP', 'RGST_NO', 'CORP_CD', 'BUSI_PLC_CD', 'RQST_NO', 'EXMNT_RQST_NO', 'EXMNT_EMP_SEQ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0431/getList.do | inputCols=CTRCT_NO,CTRCT_SEQ,EXMNT_NO,RESL_DEG,EXMNT_TP,RGST_NO,CORP_CD,BUSI_PLC_CD,RQST_NO,EXMNT_RQST_NO,EXMNT_EMP_SEQ
  test.skip('[no:1] 기성/완료 검사조서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0431/delData.do | inputCols=EXMNT_RQST_NO,EXMNT_NO,CTRCT_NO,EXMNT_RQST_DT,APV_STAT_NM,APV_STAT_CD,EXMNT_DEPT_NM,EXMNT_DEPT_CD,EXMNT_EMP_NM,EXMNT_EMP_NO,ROLE_YN,EXMNT_RQST_EMP_NO,EXMNT_RQST_EMP_NM,EXMNT_RQST_DEPT_NM,EXMNT_RQST_DEPT_CD,EXMNT_DT,LAST_EXMNT_OPNN,LAST_EXMNT_OPNN_ETC,LAST_EXMNT_RSLT,EXMNT_ASK_DT,EXMNT_EMP_SEQ,RQST_NO,CHG_CMPLTN_WRK_DT,THIS_DMND_AMT,CSTRN_SDT,CSTRN_EDT,EXMNT_RQST_TP,UPT_DT
  test.skip('[no:2] 기성/완료 검사조서 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0431/setExmntData.do | inputCols=CTRCT_NO,CTRCT_SEQ,EXMNT_NO,RESL_DEG,EXMNT_TP,RGST_NO,CORP_CD,BUSI_PLC_CD,RQST_NO,EXMNT_RQST_NO,EXMNT_EMP_SEQ
  test.skip('[no:3] 기성/완료 검사조서 - 저장 (setExmntData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0431/uptChk.do | inputCols=-
  test.skip('[no:4] 기성/완료 검사조서 - 수정 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('납품현황 (pur_0440m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0440m' OR MNU_NM LIKE '납품현황%'
  const MENU_ID = 'TODO_pur_0440m';
  const API_URL = '/mis/pur/pur0440/getListRqst.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'SCH_DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'APV_STAT_CD', 'SCH_RQST_DEPT_NM', 'SCH_RQST_DEPT_CD', 'DEPT_NM', 'DEPT_CD', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'STAT_CLS', 'ROLE_YN', 'DEPT_CHIF_YN', 'EXMNT_CLS', 'EXMNT_END_YN', 'EXMNT_TP', 'SCH_S_AMT', 'SCH_E_AMT', 'SCH_PUR_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0440/getListRqst.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,SCH_DT_CLS,SCH_RQST_SDT,SCH_RQST_EDT,SCH_SRCH_CLS,SCH_SRCH_KEY,APV_STAT_CD,SCH_RQST_DEPT_NM,SCH_RQST_DEPT_CD,DEPT_NM,DEPT_CD,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,STAT_CLS,ROLE_YN,DEPT_CHIF_YN,EXMNT_CLS,EXMNT_END_YN,EXMNT_TP,SCH_S_AMT,SCH_E_AMT,SCH_PUR_CLS
  test.skip('[no:1] 납품현황 - 조회 (getListRqst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0440/getListMro.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,SCH_DT_CLS,SCH_RQST_SDT,SCH_RQST_EDT,SCH_SRCH_CLS,SCH_SRCH_KEY,APV_STAT_CD,SCH_RQST_DEPT_NM,SCH_RQST_DEPT_CD,DEPT_NM,DEPT_CD,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,STAT_CLS,ROLE_YN,DEPT_CHIF_YN,EXMNT_CLS,EXMNT_END_YN,EXMNT_TP,SCH_S_AMT,SCH_E_AMT,SCH_PUR_CLS
  test.skip('[no:2] 납품현황 - 조회 (getListMro) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0400/uptInspCnrm.do | inputCols=-
  test.skip('[no:3] 납품현황 - 수정 (uptInspCnrm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('대금지급신청목록 (pur_0500m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0500m' OR MNU_NM LIKE '대금지급신청목록%'
  const MENU_ID = 'TODO_pur_0500m';
  const API_URL = '/mis/pur/pur0500/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'SCH_FRGN_CLS', 'SCH_DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_RQST_STAT', 'SCH_CLS', 'SCH_KEY', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'DEPT_CD', 'DEPT_NM', 'SCH_STAT_CLS', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_PUR_SETLE_FG', 'SCH_PRJT_FG', 'SCH_PMT_APNT_EMP_NO', 'SCH_PMT_APNT_EMP_NM', 'SCH_PMT_APNT_DEPT_NM', 'SCH_PMT_APNT_DEPT_CD', 'APNT_EMP_NULL', 'APNT_DEPT_NULL', 'PMT_EMP_NULL', 'PMT_DEPT_NULL', 'ALL_NULL', 'APNT_NULL', 'PMT_NULL'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0500/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,SCH_FRGN_CLS,SCH_DT_CLS,SCH_RQST_SDT,SCH_RQST_EDT,SCH_RQST_STAT,SCH_CLS,SCH_KEY,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,DEPT_CD,DEPT_NM,SCH_STAT_CLS,ROLE_YN,DEPT_CHIF_YN,SCH_PUR_SETLE_FG,SCH_PRJT_FG,SCH_PMT_APNT_EMP_NO,SCH_PMT_APNT_EMP_NM,SCH_PMT_APNT_DEPT_NM,SCH_PMT_APNT_DEPT_CD,APNT_EMP_NULL,APNT_DEPT_NULL,PMT_EMP_NULL,PMT_DEPT_NULL,ALL_NULL,APNT_NULL,PMT_NULL
  test.skip('[no:1] 대금지급신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('대금지급신청 (pur_0521m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0521m' OR MNU_NM LIKE '대금지급신청%'
  const MENU_ID = 'TODO_pur_0521m';
  const API_URL = '/mis/pur/pur0521/getSchParams.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['PMT_RQST_NO', 'CTRCT_NO', 'PMT_DGCNT', 'PMT_ORR', 'FRGN_CLS', 'FRM_MODE', 'TEMP_AMT', 'APRQ_NO', 'DPSTS_BNKB_NM', 'PMT_RQST_TP', 'DEPS_AMT', 'PUR_SETLE_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0521/getSchParams.do | inputCols=PMT_RQST_NO,CTRCT_NO,PMT_DGCNT,PMT_ORR,FRGN_CLS,FRM_MODE,TEMP_AMT,APRQ_NO,DPSTS_BNKB_NM,PMT_RQST_TP,DEPS_AMT,PUR_SETLE_FG
  test.skip('[no:1] 대금지급신청 - 조회 (getSchParams) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0521/getData.do | inputCols=PMT_RQST_NO,CTRCT_NO,PMT_DGCNT,PMT_ORR,FRGN_CLS,FRM_MODE,TEMP_AMT,APRQ_NO,DPSTS_BNKB_NM,PMT_RQST_TP,DEPS_AMT,PUR_SETLE_FG
  test.skip('[no:2] 대금지급신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0521/setChangeCtrl.do | inputCols=PMT_RQST_NO,CTRCT_NO,PMT_DGCNT,PMT_ORR,FRGN_CLS,FRM_MODE,TEMP_AMT,APRQ_NO,DPSTS_BNKB_NM,PMT_RQST_TP,DEPS_AMT,PUR_SETLE_FG
  test.skip('[no:3] 대금지급신청 - 저장 (setChangeCtrl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0521/setData.do | inputCols=PMT_RQST_NO,CTRCT_NO,PMT_DGCNT,PMT_ORR,FRGN_CLS,FRM_MODE,TEMP_AMT,APRQ_NO,DPSTS_BNKB_NM,PMT_RQST_TP,DEPS_AMT,PUR_SETLE_FG
  test.skip('[no:4] 대금지급신청 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0521/delData.do | inputCols=FRGN_CLS,CTRCT_NO,CTRCT_SEQ,PMT_DGCNT,PMT_ORR,PMT_RQST_TP,PMT_RQST_NO,CORP_CD,BUSI_PLC_CD,WORK_AREA,ACT_UNIT_CD,PMT_RQST_DT,PMT_APNT_EMP_NO,PMT_APNT_EMP_NM,PMT_APNT_DEPT_CD,PMT_APNT_DEPT_NM,APV_STAT_CD,APV_STAT_NM,OUT_AMT,REP_CURR_UNIT,OUT_AMT_FRGN,OUT_DLY_AMT,RMN_AMT,RMN_AMT_FRGN,POST_DEPS_AMT,POST_SETT_AMT,POST_RMN_AMT,PMT_PRAR_AMT,PUR_SETLE_FG,PUR_SETLE_MTHD,PMT_CURR_UNIT,PMT_EXCHNG_RATE,TOT_SPLY_VAL,TOT_VAT,TOT_THNG_AMT,TOT_ADD_AMT,DEPS_AMT,DEPS_AMT_FRGN,DLY_AMT,PMT_CUST_CD,PMT_CUST_NM,PMT_REG_NO,BK_CD,BK_NM,BK_ACC_NO,DPSTS_BNKB_NM,ACT_PMT_NO,PMT_END_YN,RMK,GW_DOC_NO,GW_ROST_NOS,REF_ROST_NOS,SLIP_DT,SLIP_NO,INS_ID,CHK_DT,ADDRES_CRTFC_YN,REF_GW_DOC_IDS,EXMNT_NO,DT_CNG_YN,OLD_RQST_DT,RQST_FG,PMT_TYPE_FG,APP_YN,VAT_TP,ITEM_MNG_NO,CNTC_NO,PROOF_FG,TMP_AMT
  test.skip('[no:5] 대금지급신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0521/setData2.do | inputCols=PMT_RQST_NO,CTRCT_NO,PMT_DGCNT,PMT_ORR,FRGN_CLS,FRM_MODE,TEMP_AMT,APRQ_NO,DPSTS_BNKB_NM,PMT_RQST_TP,DEPS_AMT,PUR_SETLE_FG
  test.skip('[no:6] 대금지급신청 - 저장 (setData2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매미지급 관리 (pur_0591m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0591m' OR MNU_NM LIKE '구매미지급 관리%'
  const MENU_ID = 'TODO_pur_0591m';
  const API_URL = '/mis/pur/pur0591/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_BUDG_SDT', 'SCH_BUDG_EDT', 'SCH_CLS', 'SCH_KEY', 'SCH_FRGN_CLS', 'ACCT_CD_REG_YN', 'FNRS_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0591/getList.do | inputCols=SCH_RQST_SDT,SCH_RQST_EDT,SCH_BUDG_SDT,SCH_BUDG_EDT,SCH_CLS,SCH_KEY,SCH_FRGN_CLS,ACCT_CD_REG_YN,FNRS_FG
  test.skip('[no:1] 구매미지급 관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0591/setData.do | inputCols=SCH_RQST_SDT,SCH_RQST_EDT,SCH_BUDG_SDT,SCH_BUDG_EDT,SCH_CLS,SCH_KEY,SCH_FRGN_CLS,ACCT_CD_REG_YN,FNRS_FG
  test.skip('[no:2] 구매미지급 관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0591/delData.do | inputCols=SCH_RQST_SDT,SCH_RQST_EDT,SCH_BUDG_SDT,SCH_BUDG_EDT,SCH_CLS,SCH_KEY,SCH_FRGN_CLS,ACCT_CD_REG_YN,FNRS_FG
  test.skip('[no:3] 구매미지급 관리 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('입찰공고등록 (pur_0610m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0610m' OR MNU_NM LIKE '입찰공고등록%'
  const MENU_ID = 'TODO_pur_0610m';
  const API_URL = '/mis/pur/pur0610/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'RQST_STAT', 'PUR_STEP', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0610/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_SDT,RQST_EDT,RQST_STAT,PUR_STEP,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,RJCT_YN,SRCH_CLS,SRCH_KEY,FRGN_CLS,PUR_TP,ROLE_YN,DEPT_CHIF_YN,PUR_CLS
  test.skip('[no:1] 입찰공고등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('입찰공고등록 (pur_0611m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0611m' OR MNU_NM LIKE '입찰공고등록%'
  const MENU_ID = 'TODO_pur_0611m';
  const API_URL = '/mis/pur/pur0611/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WORK_AREA', 'PUR_TP', 'FRGN_CLS', 'RGST_NO', 'FRM_MODE', 'MNG_NO', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PRJT_FG', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0611/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RGST_NO,FRM_MODE,MNG_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:1] 입찰공고등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0611/delData.do | inputCols=CORP_CD,BUSI_PLC_CD,ACCT_UNT_CD,WORK_AREA,RQST_NO,RQST_DT,PCHRG_EMP_NO,PCHRG_EMP_NM,PCHRG_DEPT_CD,PCHRG_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,MNG_NO,RGST_NO,ANNC_TP,BID_EMG_YN,ANNC_NM,ANNC_NO,SEQ,NOTI_DT,NOTI_HH,CLOS_DT,CLOS_HH,BID_DT,BID_HH,STD_BID_DT,STD_BID_HH,SITE_DECI_HH,SITE_DECI_YN,SITE_DECI_DT,OPG_PLC,DLY_AMT_RATE,BID_PAPT_QULF,ANNC_NOTI_YN,RMK,BID_GNTE_FG,CTRCT_WRG_GNTE_RATE,CTRCT_GNTE_RATE,BID_GNTE_RATE,CNRM_YN,BID_RSLT,SBMT_ENTP_CNT,PRER_ENTP_CNT,INQC_ENTP_CNT,ACCP_STAT,CNRM_YN_NM,ANNC_STAT,PGM_ID
  test.skip('[no:2] 입찰공고등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0611/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RGST_NO,FRM_MODE,MNG_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:3] 입찰공고등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0611/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RGST_NO,FRM_MODE,MNG_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:4] 입찰공고등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0611/uptAnncStat.do | inputCols=CORP_CD,BUSI_PLC_CD,ACCT_UNT_CD,WORK_AREA,RQST_NO,RQST_DT,PCHRG_EMP_NO,PCHRG_EMP_NM,PCHRG_DEPT_CD,PCHRG_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,MNG_NO,RGST_NO,ANNC_TP,BID_EMG_YN,ANNC_NM,ANNC_NO,SEQ,NOTI_DT,NOTI_HH,CLOS_DT,CLOS_HH,BID_DT,BID_HH,STD_BID_DT,STD_BID_HH,SITE_DECI_HH,SITE_DECI_YN,SITE_DECI_DT,OPG_PLC,DLY_AMT_RATE,BID_PAPT_QULF,ANNC_NOTI_YN,RMK,BID_GNTE_FG,CTRCT_WRG_GNTE_RATE,CTRCT_GNTE_RATE,BID_GNTE_RATE,CNRM_YN,BID_RSLT,SBMT_ENTP_CNT,PRER_ENTP_CNT,INQC_ENTP_CNT,ACCP_STAT,CNRM_YN_NM,ANNC_STAT,PGM_ID
  test.skip('[no:5] 입찰공고등록 - 수정 (uptAnncStat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0611/uptCnrmUpt.do | inputCols=CORP_CD,BUSI_PLC_CD,ACCT_UNT_CD,WORK_AREA,RQST_NO,RQST_DT,PCHRG_EMP_NO,PCHRG_EMP_NM,PCHRG_DEPT_CD,PCHRG_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,MNG_NO,RGST_NO,ANNC_TP,BID_EMG_YN,ANNC_NM,ANNC_NO,SEQ,NOTI_DT,NOTI_HH,CLOS_DT,CLOS_HH,BID_DT,BID_HH,STD_BID_DT,STD_BID_HH,SITE_DECI_HH,SITE_DECI_YN,SITE_DECI_DT,OPG_PLC,DLY_AMT_RATE,BID_PAPT_QULF,ANNC_NOTI_YN,RMK,BID_GNTE_FG,CTRCT_WRG_GNTE_RATE,CTRCT_GNTE_RATE,BID_GNTE_RATE,CNRM_YN,BID_RSLT,SBMT_ENTP_CNT,PRER_ENTP_CNT,INQC_ENTP_CNT,ACCP_STAT,CNRM_YN_NM,ANNC_STAT,PGM_ID
  test.skip('[no:6] 입찰공고등록 - 수정 (uptCnrmUpt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('입찰공고등록(외자) (pur_0612m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0612m' OR MNU_NM LIKE '입찰공고등록(외자)%'
  const MENU_ID = 'TODO_pur_0612m';
  const API_URL = '/mis/pur/pur0111/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WORK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'ACT_UNIT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PRJT_FG', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0111/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:1] 입찰공고등록(외자) - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0111/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:2] 입찰공고등록(외자) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0111/delData.do | inputCols=CORP_CD,BUSI_PLC_CD,ACCT_UNT_CD,WRK_AREA,RQST_NO,RQST_DT,RQST_EMP_NO,RQST_EMP_NM,RQST_DEPT_CD,RQST_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_CD,DLVERY_GDS_PLC_NM,RQST_CONT,VAT_TYPE,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,YEARS_FG,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_RSN_CD,OPT_CUST,OPT_CONT,POST_PRCSS_RSN,OPT_CTRCT_YN,POST_PRCSS_YN,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,OLD_SYS_KEY,KOR_GDS_NM,ENG_GDS_NM,FEATURE,MAIN_SYSTEM,ACCESSORY,ETC,OPT_RISK_YN,GDS_QTY,MAIN_QTY,ACCS_QTY,OPT_RSN_010,OPT_RSN_020,OPT_RSN_030,OPT_RSN_041,OPT_RSN_042,OPT_RSN_043,OPT_RSN_050,OPT_RSN_ETC,RCMD_CUST_MNG_NM,RCMD_CUST_MNG_TEL_NO,RCMD_CUST_MNG_EMAIL,OPT_THNG_METR,CTRL_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,ACCT_CD,PUR_BUDG_AMT,BUDG_INCM_AMT,PROV_APRQ_NO,PROV_APRQ_SEQ,DTL_PROV_AMT,BUDG_CHG_YN,WRT_EMP_NO,WRT_EMP_NM,WRT_DEPT_CD,WRT_DEPT_NM,RQST_EMP_CLS,RGD_TRGT_YN
  test.skip('[no:3] 입찰공고등록(외자) - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0111/setDtlDelData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:4] 입찰공고등록(외자) - 삭제 (setDtlDelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0111/uptChk.do | inputCols=-
  test.skip('[no:5] 입찰공고등록(외자) - 수정 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0111/setData2.do | inputCols=CORP_CD,BUSI_PLC_CD,ACCT_UNT_CD,WRK_AREA,RQST_NO,RQST_DT,RQST_EMP_NO,RQST_EMP_NM,RQST_DEPT_CD,RQST_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_CD,DLVERY_GDS_PLC_NM,RQST_CONT,VAT_TYPE,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,YEARS_FG,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_RSN_CD,OPT_CUST,OPT_CONT,POST_PRCSS_RSN,OPT_CTRCT_YN,POST_PRCSS_YN,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,OLD_SYS_KEY,KOR_GDS_NM,ENG_GDS_NM,FEATURE,MAIN_SYSTEM,ACCESSORY,ETC,OPT_RISK_YN,GDS_QTY,MAIN_QTY,ACCS_QTY,OPT_RSN_010,OPT_RSN_020,OPT_RSN_030,OPT_RSN_041,OPT_RSN_042,OPT_RSN_043,OPT_RSN_050,OPT_RSN_ETC,RCMD_CUST_MNG_NM,RCMD_CUST_MNG_TEL_NO,RCMD_CUST_MNG_EMAIL,OPT_THNG_METR,CTRL_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,ACCT_CD,PUR_BUDG_AMT,BUDG_INCM_AMT,PROV_APRQ_NO,PROV_APRQ_SEQ,DTL_PROV_AMT,BUDG_CHG_YN,WRT_EMP_NO,WRT_EMP_NM,WRT_DEPT_CD,WRT_DEPT_NM,RQST_EMP_CLS,RGD_TRGT_YN
  test.skip('[no:6] 입찰공고등록(외자) - 저장 (setData2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('수의시담관리 (pur_0710m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0710m' OR MNU_NM LIKE '수의시담관리%'
  const MENU_ID = 'TODO_pur_0710m';
  const API_URL = '/mis/pur/pur0710/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'ACCP_STAT', 'PUR_STEP', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'SRCH_CLS', 'SRCH_KEY', 'PUR_TP', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS', 'Column0'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0710/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_SDT,RQST_EDT,ACCP_STAT,PUR_STEP,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,SRCH_CLS,SRCH_KEY,PUR_TP,ROLE_YN,DEPT_CHIF_YN,PUR_CLS,Column0
  test.skip('[no:1] 수의시담관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('수의시담등록 (pur_0711m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0711m' OR MNU_NM LIKE '수의시담등록%'
  const MENU_ID = 'TODO_pur_0711m';
  const API_URL = '/mis/pur/pur0711/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WORK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'PRVT_NO', 'RGST_NO', 'TEMP_AMT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0711/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,PRVT_NO,RGST_NO,TEMP_AMT
  test.skip('[no:1] 수의시담등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0711/delData.do | inputCols=-
  test.skip('[no:2] 수의시담등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0711/setAccp.do | inputCols=-
  test.skip('[no:3] 수의시담등록 - 저장 (setAccp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0711/setAppro.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,PRVT_NO,RGST_NO,TEMP_AMT
  test.skip('[no:4] 수의시담등록 - 저장 (setAppro) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0711/setReject.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,PRVT_NO,RGST_NO,TEMP_AMT
  test.skip('[no:5] 수의시담등록 - 저장 (setReject) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0711/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,PRVT_NO,RGST_NO,TEMP_AMT
  test.skip('[no:6] 수의시담등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('수의시담등록(외자) (pur_0712m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0712m' OR MNU_NM LIKE '수의시담등록(외자)%'
  const MENU_ID = 'TODO_pur_0712m';
  const API_URL = '/mis/pur/pur0111/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'ACCT_UNT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PRJT_FG', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0111/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACCT_UNT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:1] 수의시담등록(외자) - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0111/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACCT_UNT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:2] 수의시담등록(외자) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0111/delData.do | inputCols=CORP_CD,BUSI_PLC_CD,ACCT_UNT_CD,WRK_AREA,RQST_NO,RQST_DT,RQST_EMP_NO,RQST_EMP_NM,RQST_DEPT_CD,RQST_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_CD,DLVERY_GDS_PLC_NM,RQST_CONT,VAT_TYPE,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,YEARS_FG,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_RSN_CD,OPT_CUST,OPT_CONT,POST_PRCSS_RSN,OPT_CTRCT_YN,POST_PRCSS_YN,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,OLD_SYS_KEY,KOR_GDS_NM,ENG_GDS_NM,FEATURE,MAIN_SYSTEM,ACCESSORY,ETC,OPT_RISK_YN,GDS_QTY,MAIN_QTY,ACCS_QTY,OPT_RSN_010,OPT_RSN_020,OPT_RSN_030,OPT_RSN_041,OPT_RSN_042,OPT_RSN_043,OPT_RSN_050,OPT_RSN_ETC,RCMD_CUST_MNG_NM,RCMD_CUST_MNG_TEL_NO,RCMD_CUST_MNG_EMAIL,OPT_THNG_METR,CTRL_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,ACCT_CD,PUR_BUDG_AMT,BUDG_INCM_AMT,PROV_APRQ_NO,PROV_APRQ_SEQ,DTL_PROV_AMT,BUDG_CHG_YN,WRT_EMP_NO,WRT_EMP_NM,WRT_DEPT_CD,WRT_DEPT_NM,RQST_EMP_CLS,RGD_TRGT_YN
  test.skip('[no:3] 수의시담등록(외자) - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0111/setDtlDelData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACCT_UNT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:4] 수의시담등록(외자) - 삭제 (setDtlDelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0111/uptChk.do | inputCols=-
  test.skip('[no:5] 수의시담등록(외자) - 수정 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0111/setData2.do | inputCols=CORP_CD,BUSI_PLC_CD,ACCT_UNT_CD,WRK_AREA,RQST_NO,RQST_DT,RQST_EMP_NO,RQST_EMP_NM,RQST_DEPT_CD,RQST_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_CD,DLVERY_GDS_PLC_NM,RQST_CONT,VAT_TYPE,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,YEARS_FG,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_RSN_CD,OPT_CUST,OPT_CONT,POST_PRCSS_RSN,OPT_CTRCT_YN,POST_PRCSS_YN,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,OLD_SYS_KEY,KOR_GDS_NM,ENG_GDS_NM,FEATURE,MAIN_SYSTEM,ACCESSORY,ETC,OPT_RISK_YN,GDS_QTY,MAIN_QTY,ACCS_QTY,OPT_RSN_010,OPT_RSN_020,OPT_RSN_030,OPT_RSN_041,OPT_RSN_042,OPT_RSN_043,OPT_RSN_050,OPT_RSN_ETC,RCMD_CUST_MNG_NM,RCMD_CUST_MNG_TEL_NO,RCMD_CUST_MNG_EMAIL,OPT_THNG_METR,CTRL_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,ACCT_CD,PUR_BUDG_AMT,BUDG_INCM_AMT,PROV_APRQ_NO,PROV_APRQ_SEQ,DTL_PROV_AMT,BUDG_CHG_YN,WRT_EMP_NO,WRT_EMP_NM,WRT_DEPT_CD,WRT_DEPT_NM,RQST_EMP_CLS,RGD_TRGT_YN
  test.skip('[no:6] 수의시담등록(외자) - 저장 (setData2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('직접구매요구현황 (pur_0910m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0910m' OR MNU_NM LIKE '직접구매요구현황%'
  const MENU_ID = 'TODO_pur_0910m';
  const API_URL = '/mis/pur/pur0910/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['WORK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'BOOK_CLS', 'RQST_CLS', 'DICT_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0910/getList.do | inputCols=WORK_AREA,RQST_SDT,RQST_EDT,APV_STAT_CD,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,SCH_SRCH_CLS,SCH_SRCH_KEY,ROLE_YN,DEPT_CHIF_YN,BOOK_CLS,RQST_CLS,DICT_CLS
  test.skip('[no:1] 직접구매요구현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('직접구매요구신청 (pur_0911m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0911m' OR MNU_NM LIKE '직접구매요구신청%'
  const MENU_ID = 'TODO_pur_0911m';
  const API_URL = '/mis/pur/pur0911/getSchParams.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'CHEAP_RQST_NO', 'RQST_CLS', 'TEMP_AMT', 'ADD', 'DICT_CLS', 'RQST_NO', 'ACT_UNIT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PRJT_FG', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'Column9', 'UNIT', 'ACCT_NM', 'BUDG_BSNS_NM', 'BUDG_BSNS_CD', 'BUDG_LITM_CD', 'BUDG_CLSF_FG', 'AST_CLS_NM', 'AST_CLS_CD', 'PMT_RQST_NO', 'Column0'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0911/getSchParams.do | inputCols=CORP_CD,BUSI_PLC_CD,CHEAP_RQST_NO,RQST_CLS,TEMP_AMT,ADD,DICT_CLS,RQST_NO,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,Column9,UNIT,ACCT_NM,BUDG_BSNS_NM,BUDG_BSNS_CD,BUDG_LITM_CD,BUDG_CLSF_FG,AST_CLS_NM,AST_CLS_CD,PMT_RQST_NO,Column0
  test.skip('[no:1] 직접구매요구신청 - 조회 (getSchParams) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0911/getCheapData.do | inputCols=CORP_CD,BUSI_PLC_CD,CHEAP_RQST_NO,RQST_CLS,TEMP_AMT,ADD,DICT_CLS,RQST_NO,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,Column9,UNIT,ACCT_NM,BUDG_BSNS_NM,BUDG_BSNS_CD,BUDG_LITM_CD,BUDG_CLSF_FG,AST_CLS_NM,AST_CLS_CD,PMT_RQST_NO,Column0
  test.skip('[no:2] 직접구매요구신청 - 조회 (getCheapData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0911/uptChk.do | inputCols=-
  test.skip('[no:3] 직접구매요구신청 - 수정 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0911/getInjtCust.do | inputCols=-
  test.skip('[no:4] 직접구매요구신청 - 조회 (getInjtCust) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0911/setCheapData.do | inputCols=CORP_CD,BUSI_PLC_CD,CHEAP_RQST_NO,RQST_CLS,TEMP_AMT,ADD,DICT_CLS,RQST_NO,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,Column9,UNIT,ACCT_NM,BUDG_BSNS_NM,BUDG_BSNS_CD,BUDG_LITM_CD,BUDG_CLSF_FG,AST_CLS_NM,AST_CLS_CD,PMT_RQST_NO,Column0
  test.skip('[no:5] 직접구매요구신청 - 저장 (setCheapData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0911/setExmntData.do | inputCols=CORP_CD,BUSI_PLC_CD,CHEAP_RQST_NO,RQST_CLS,TEMP_AMT,ADD,DICT_CLS,RQST_NO,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,Column9,UNIT,ACCT_NM,BUDG_BSNS_NM,BUDG_BSNS_CD,BUDG_LITM_CD,BUDG_CLSF_FG,AST_CLS_NM,AST_CLS_CD,PMT_RQST_NO,Column0
  test.skip('[no:6] 직접구매요구신청 - 저장 (setExmntData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=-
  test.skip('[no:7] 직접구매요구신청 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0911/delData.do | inputCols=APV_STAT_CD,APV_STAT_NM,TEMP_AMT,GW_DOC_ID,GW_DOC_NO,CHEAP_RQST_NO,CORP_CD,BUSI_PLC_CD,WORK_AREA,RQST_SBJ,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,VAT_TP,CURR_UNIT,EXCHNG_RATE,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,PUR_SPLY_VAL,PUR_CMP,PUR_CMP_NM,DLVR_PLC_CD,DLVR_PLC_NM,RQST_CONT,RJCT_YN,RJCT_RSN,EXMNT_NO,EXMNT_STAT,PMT_RQST_NO,RMK,CHEAP_RQST_CLS,INS_ID,PMT_RQST_NO,RESL_RQST_SEQ,ACT_UNIT_CD,PMT_RQST_DT,RESL_APNT_EMP_NO,RESL_APNT_EMP_NM,RESL_APNT_DEPT_CD,PUR_PAY_CLS,PUR_PAY_MTHD,CRDTOR_FG,PMT_CUST_CD,PMT_CUST_NM,BK_CD,BK_NM,BK_ACC_NO,DPSTS_NM,RESL_CURR_UNIT,RESL_EXCHNG_RATE,TOT_SPLY_VAL,TOT_VAT,TOT_THNG_AMT,TOT_ADD_AMT,DEPS_AMT,DEPS_AMT_FRGN,RESL_DEG,RESL_END_YN,ADDRES_CRTFC_YN,PMT_BUDG_SEQ,BUDG_DEPS_AMT,BUDG_YY,BUDG_FG,BUDG_CLSF_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_CD,BUDG_LITM_NM,CNTC_NO,ACT_RESL_SEQ,ACT_RESL_AMT,ACCT_CD,ADD_AMT_YN,PROJ_EXE_CLS,PROJ_EXEC_FG,NTFC_DT,CHK_DT,EQUIP_ESSNTLREGS_AT,DT_CNG_YN,OLD_RQST_DT,FRGN_CLS,PUR_TP,UPT_DE,WTER_EMP_NO,WTER_EMP_NM,WTER_DEPT_CD,WTER_DEPT_NM,RQST_EMP_CLS,BIZRNO,DLVR_PLC,DLVR_PLC_FLOOR,DLVR_HOPE_DT,APV_STAT_CD2,APV_STAT_NM2,PUR_SETLE_MTHD,PMT_APNT_EMP_NM,PMT_APNT_EMP_NO,PMT_APNT_DEPT_CD,PMT_APNT_DEPT_NM,PMT_RMK,DPSTS_BNKB_NM,EXMNT_DLVR_PLC_CD,EXMNT_DLVR_PLC_NM,EXMNT_DLVR_PLC,EXMNT_DLVR_PLC_FLOOR,CTRCT_NO,TOT_ITEM_AMT,TOT_SPLY_AMT,PROOF_FG,DLVR_DT,STBL_YN,SPLY_VAL,SURTAX,RCV_DT,RCV_EMP_NO,RCV_EMP_NM
  test.skip('[no:8] 직접구매요구신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0911/delData2.do | inputCols=APV_STAT_CD,APV_STAT_NM,TEMP_AMT,GW_DOC_ID,GW_DOC_NO,CHEAP_RQST_NO,CORP_CD,BUSI_PLC_CD,WORK_AREA,RQST_SBJ,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,VAT_TP,CURR_UNIT,EXCHNG_RATE,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,PUR_SPLY_VAL,PUR_CMP,PUR_CMP_NM,DLVR_PLC_CD,DLVR_PLC_NM,RQST_CONT,RJCT_YN,RJCT_RSN,EXMNT_NO,EXMNT_STAT,PMT_RQST_NO,RMK,CHEAP_RQST_CLS,INS_ID,PMT_RQST_NO,RESL_RQST_SEQ,ACT_UNIT_CD,PMT_RQST_DT,RESL_APNT_EMP_NO,RESL_APNT_EMP_NM,RESL_APNT_DEPT_CD,PUR_PAY_CLS,PUR_PAY_MTHD,CRDTOR_FG,PMT_CUST_CD,PMT_CUST_NM,BK_CD,BK_NM,BK_ACC_NO,DPSTS_NM,RESL_CURR_UNIT,RESL_EXCHNG_RATE,TOT_SPLY_VAL,TOT_VAT,TOT_THNG_AMT,TOT_ADD_AMT,DEPS_AMT,DEPS_AMT_FRGN,RESL_DEG,RESL_END_YN,ADDRES_CRTFC_YN,PMT_BUDG_SEQ,BUDG_DEPS_AMT,BUDG_YY,BUDG_FG,BUDG_CLSF_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_CD,BUDG_LITM_NM,CNTC_NO,ACT_RESL_SEQ,ACT_RESL_AMT,ACCT_CD,ADD_AMT_YN,PROJ_EXE_CLS,PROJ_EXEC_FG,NTFC_DT,CHK_DT,EQUIP_ESSNTLREGS_AT,DT_CNG_YN,OLD_RQST_DT,FRGN_CLS,PUR_TP,UPT_DE,WTER_EMP_NO,WTER_EMP_NM,WTER_DEPT_CD,WTER_DEPT_NM,RQST_EMP_CLS,BIZRNO,DLVR_PLC,DLVR_PLC_FLOOR,DLVR_HOPE_DT,APV_STAT_CD2,APV_STAT_NM2,PUR_SETLE_MTHD,PMT_APNT_EMP_NM,PMT_APNT_EMP_NO,PMT_APNT_DEPT_CD,PMT_APNT_DEPT_NM,PMT_RMK,DPSTS_BNKB_NM,EXMNT_DLVR_PLC_CD,EXMNT_DLVR_PLC_NM,EXMNT_DLVR_PLC,EXMNT_DLVR_PLC_FLOOR,CTRCT_NO,TOT_ITEM_AMT,TOT_SPLY_AMT,PROOF_FG,DLVR_DT,STBL_YN,SPLY_VAL,SURTAX,RCV_DT,RCV_EMP_NO,RCV_EMP_NM
  test.skip('[no:9] 직접구매요구신청 - 삭제 (delData2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0911/setTextbilFile.do | inputCols=APV_STAT_CD,APV_STAT_NM,TEMP_AMT,GW_DOC_ID,GW_DOC_NO,CHEAP_RQST_NO,CORP_CD,BUSI_PLC_CD,WORK_AREA,RQST_SBJ,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,VAT_TP,CURR_UNIT,EXCHNG_RATE,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,PUR_SPLY_VAL,PUR_CMP,PUR_CMP_NM,DLVR_PLC_CD,DLVR_PLC_NM,RQST_CONT,RJCT_YN,RJCT_RSN,EXMNT_NO,EXMNT_STAT,PMT_RQST_NO,RMK,CHEAP_RQST_CLS,INS_ID,PMT_RQST_NO,RESL_RQST_SEQ,ACT_UNIT_CD,PMT_RQST_DT,RESL_APNT_EMP_NO,RESL_APNT_EMP_NM,RESL_APNT_DEPT_CD,PUR_PAY_CLS,PUR_PAY_MTHD,CRDTOR_FG,PMT_CUST_CD,PMT_CUST_NM,BK_CD,BK_NM,BK_ACC_NO,DPSTS_NM,RESL_CURR_UNIT,RESL_EXCHNG_RATE,TOT_SPLY_VAL,TOT_VAT,TOT_THNG_AMT,TOT_ADD_AMT,DEPS_AMT,DEPS_AMT_FRGN,RESL_DEG,RESL_END_YN,ADDRES_CRTFC_YN,PMT_BUDG_SEQ,BUDG_DEPS_AMT,BUDG_YY,BUDG_FG,BUDG_CLSF_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_CD,BUDG_LITM_NM,CNTC_NO,ACT_RESL_SEQ,ACT_RESL_AMT,ACCT_CD,ADD_AMT_YN,PROJ_EXE_CLS,PROJ_EXEC_FG,NTFC_DT,CHK_DT,EQUIP_ESSNTLREGS_AT,DT_CNG_YN,OLD_RQST_DT,FRGN_CLS,PUR_TP,UPT_DE,WTER_EMP_NO,WTER_EMP_NM,WTER_DEPT_CD,WTER_DEPT_NM,RQST_EMP_CLS,BIZRNO,DLVR_PLC,DLVR_PLC_FLOOR,DLVR_HOPE_DT,APV_STAT_CD2,APV_STAT_NM2,PUR_SETLE_MTHD,PMT_APNT_EMP_NM,PMT_APNT_EMP_NO,PMT_APNT_DEPT_CD,PMT_APNT_DEPT_NM,PMT_RMK,DPSTS_BNKB_NM,EXMNT_DLVR_PLC_CD,EXMNT_DLVR_PLC_NM,EXMNT_DLVR_PLC,EXMNT_DLVR_PLC_FLOOR,CTRCT_NO,TOT_ITEM_AMT,TOT_SPLY_AMT,PROOF_FG,DLVR_DT,STBL_YN,SPLY_VAL,SURTAX,RCV_DT,RCV_EMP_NO,RCV_EMP_NM
  test.skip('[no:10] 직접구매요구신청 - 저장 (setTextbilFile) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0911/setCtrlNo.do | inputCols=CORP_CD,BUSI_PLC_CD,CHEAP_RQST_NO,RQST_CLS,TEMP_AMT,ADD,DICT_CLS,RQST_NO,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,Column9,UNIT,ACCT_NM,BUDG_BSNS_NM,BUDG_BSNS_CD,BUDG_LITM_CD,BUDG_CLSF_FG,AST_CLS_NM,AST_CLS_CD,PMT_RQST_NO,Column0
  test.skip('[no:11] 직접구매요구신청 - 저장 (setCtrlNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('직접구매검수및대금지급 (pur_0940m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0940m' OR MNU_NM LIKE '직접구매검수및대금지급%'
  const MENU_ID = 'TODO_pur_0940m';
  const API_URL = '/mis/pur/pur0940/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_DT_CLS', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_APV_STAT_CD', 'SCH_EXMNT_STAT_CLS', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_APNT_DEPT_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_EMP_NM', 'SCH_APNT_EMP_NO', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS', 'DEPT_CD', 'DEPT_NM', 'DICT_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0940/getList.do | inputCols=SCH_DT_CLS,SCH_RQST_SDT,SCH_RQST_EDT,SCH_APV_STAT_CD,SCH_EXMNT_STAT_CLS,SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_APNT_DEPT_NM,SCH_APNT_DEPT_CD,SCH_APNT_EMP_NM,SCH_APNT_EMP_NO,ROLE_YN,DEPT_CHIF_YN,PUR_CLS,DEPT_CD,DEPT_NM,DICT_CLS
  test.skip('[no:1] 직접구매검수및대금지급 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO 검수현황 (pur_1240m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_1240m' OR MNU_NM LIKE 'MRO 검수현황%'
  const MENU_ID = 'TODO_pur_1240m';
  const API_URL = '/mis/pur/pur_1240_007/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur_1240_007/getList.do | inputCols=-
  test.skip('[no:1] MRO 검수현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO검수 (pur_1250m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_1250m' OR MNU_NM LIKE 'MRO검수%'
  const MENU_ID = 'TODO_pur_1250m';
  const API_URL = '/mis/pur/pur1270007/getMroRqstMst.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['MRO_RQST_NO', 'MRO_CNCL_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur1270007/getMroRqstMst.do | inputCols=MRO_RQST_NO,MRO_CNCL_NO
  test.skip('[no:1] MRO검수 - 조회 (getMroRqstMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur1270007/getMroDtlList.do | inputCols=MRO_RQST_NO,MRO_CNCL_NO
  test.skip('[no:2] MRO검수 - 조회 (getMroDtlList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur1270007/save.do | inputCols=MRO_RQST_NO,RQST_DT,RQST_SBJ,RQST_DEPT_CD,RQST_DEPT_NM,RQST_EMP_NO,RQST_EMP_NM,APV_STAT_CD,APV_STAT_NM,SUM_AMT,CUST_CD,CUST_NM,TOT_RQST_AMT,CUST_REG_NO,OPINION,SUPL_AMT,VAT_AMT,MRO_CNCL_NO,CNCL_DT,CNCL_EMP_NO,CNCL_EMP_NM,CNCL_RSN,BUSI_PLC_CD,VAT_YN,CARD_YN,APPROVE_YN,SMRY
  test.skip('[no:3] MRO검수 - 저장 (save) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur1270007/delete.do | inputCols=MRO_RQST_NO,RQST_DT,RQST_SBJ,RQST_DEPT_CD,RQST_DEPT_NM,RQST_EMP_NO,RQST_EMP_NM,APV_STAT_CD,APV_STAT_NM,SUM_AMT,CUST_CD,CUST_NM,TOT_RQST_AMT,CUST_REG_NO,OPINION,SUPL_AMT,VAT_AMT,MRO_CNCL_NO,CNCL_DT,CNCL_EMP_NO,CNCL_EMP_NM,CNCL_RSN,BUSI_PLC_CD,VAT_YN,CARD_YN,APPROVE_YN,SMRY
  test.skip('[no:4] MRO검수 - 삭제 (delete) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO구매취소현황 (pur_1260m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_1260m' OR MNU_NM LIKE 'MRO구매취소현황%'
  const MENU_ID = 'TODO_pur_1260m';
  const API_URL = '/mis/pur/pur1260007/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_SDT', 'RQST_EDT', 'RQST_EMP_NO', 'RQST_EMP_NM', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'RQST_STAT', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'EXMNT_END_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur1260007/getList.do | inputCols=RQST_SDT,RQST_EDT,RQST_EMP_NO,RQST_EMP_NM,SCH_SRCH_CLS,SCH_SRCH_KEY,RQST_STAT,RQST_DEPT_NM,RQST_DEPT_CD,EXMNT_END_YN
  test.skip('[no:1] MRO구매취소현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO구매취소신청서 (pur_1270m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_1270m' OR MNU_NM LIKE 'MRO구매취소신청서%'
  const MENU_ID = 'TODO_pur_1270m';
  const API_URL = '/mis/pur/pur1270007/getMroRqstMst.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['MRO_RQST_NO', 'MRO_CNCL_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur1270007/getMroRqstMst.do | inputCols=MRO_RQST_NO,MRO_CNCL_NO
  test.skip('[no:1] MRO구매취소신청서 - 조회 (getMroRqstMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur1270007/getMroDtlList.do | inputCols=MRO_RQST_NO,MRO_CNCL_NO
  test.skip('[no:2] MRO구매취소신청서 - 조회 (getMroDtlList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur1270007/save.do | inputCols=MRO_RQST_NO,RQST_DT,RQST_SBJ,RQST_DEPT_CD,RQST_DEPT_NM,RQST_EMP_NO,RQST_EMP_NM,APV_STAT_CD,APV_STAT_NM,SUM_AMT,CUST_CD,CUST_NM,TOT_RQST_AMT,CUST_REG_NO,OPINION,SUPL_AMT,VAT_AMT,MRO_CNCL_NO,CNCL_DT,CNCL_EMP_NO,CNCL_EMP_NM,CNCL_RSN,BUSI_PLC_CD,VAT_YN,CARD_YN,APPROVE_YN,SMRY
  test.skip('[no:3] MRO구매취소신청서 - 저장 (save) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur1270007/delete.do | inputCols=MRO_RQST_NO,RQST_DT,RQST_SBJ,RQST_DEPT_CD,RQST_DEPT_NM,RQST_EMP_NO,RQST_EMP_NM,APV_STAT_CD,APV_STAT_NM,SUM_AMT,CUST_CD,CUST_NM,TOT_RQST_AMT,CUST_REG_NO,OPINION,SUPL_AMT,VAT_AMT,MRO_CNCL_NO,CNCL_DT,CNCL_EMP_NO,CNCL_EMP_NM,CNCL_RSN,BUSI_PLC_CD,VAT_YN,CARD_YN,APPROVE_YN,SMRY
  test.skip('[no:4] MRO구매취소신청서 - 삭제 (delete) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('pur_1340M (pur_1340m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_1340m' OR MNU_NM LIKE 'pur_1340M%'
  const MENU_ID = 'TODO_pur_1340m';
  const API_URL = '/mis/pur/pur1340007/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SDT', 'SCH_EDT', 'DT_CLS', 'RQST_EMP_NO', 'RQST_EMP_NM', 'ACCT_EXPN_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'RQST_STAT', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'SCH_MOD_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur1340007/getList.do | inputCols=SCH_SDT,SCH_EDT,DT_CLS,RQST_EMP_NO,RQST_EMP_NM,ACCT_EXPN_CD,SCH_SRCH_CLS,SCH_SRCH_KEY,RQST_STAT,RQST_DEPT_NM,RQST_DEPT_CD,SCH_MOD_YN
  test.skip('[no:1] pur_1340M - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('pur_1350M (pur_1350m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_1350m' OR MNU_NM LIKE 'pur_1350M%'
  const MENU_ID = 'TODO_pur_1350m';
  const API_URL = '/mis/pur/pur1350007/getMroRqstMst.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['NEW_YN', 'FNC_NM', 'ORDR_STATUS', 'BUSI_PLC_CD', 'ROLE_YN', 'MRO_RQST_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur1350007/getMroRqstMst.do | inputCols=NEW_YN,FNC_NM,ORDR_STATUS,BUSI_PLC_CD,ROLE_YN,MRO_RQST_NO
  test.skip('[no:1] pur_1350M - 조회 (getMroRqstMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur1350007/getMroDtlList.do | inputCols=NEW_YN,FNC_NM,ORDR_STATUS,BUSI_PLC_CD,ROLE_YN,MRO_RQST_NO
  test.skip('[no:2] pur_1350M - 조회 (getMroDtlList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur1350007/getMroModMst.do | inputCols=NEW_YN,FNC_NM,ORDR_STATUS,BUSI_PLC_CD,ROLE_YN,MRO_RQST_NO
  test.skip('[no:3] pur_1350M - 수정 (getMroModMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur1350007/getMroModDtl.do | inputCols=NEW_YN,FNC_NM,ORDR_STATUS,BUSI_PLC_CD,ROLE_YN,MRO_RQST_NO
  test.skip('[no:4] pur_1350M - 수정 (getMroModDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur1350007/save.do | inputCols=NEW_YN,FNC_NM,ORDR_STATUS,BUSI_PLC_CD,ROLE_YN,MRO_RQST_NO
  test.skip('[no:5] pur_1350M - 저장 (save) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur1350007/send.do | inputCols=MRO_MOD_SEQ,MRO_RQST_NO,BUSI_PLC_CD,CHRG_EMP_NO,CHRG_EMP_NM,RQST_DT,RQST_DEPT_CD,RQST_DEPT_NM,RQST_EMP_NO,RQST_EMP_NM,APV_STAT_CD,APV_STAT_NM,SUPL_AMT,VAT_AMT,TOT_RQST_AMT,BLDNG_RM_NM,BLDNG_RM_CD,APPROVE_YN,GW_DOC_ID,MOD_SEND_YN,SMRY
  test.skip('[no:6] pur_1350M - 조회 (send) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur1350007/tmDelete.do | inputCols=MRO_MOD_SEQ,MRO_RQST_NO,BUSI_PLC_CD,CHRG_EMP_NO,CHRG_EMP_NM,RQST_DT,RQST_DEPT_CD,RQST_DEPT_NM,RQST_EMP_NO,RQST_EMP_NM,APV_STAT_CD,APV_STAT_NM,SUPL_AMT,VAT_AMT,TOT_RQST_AMT,BLDNG_RM_NM,BLDNG_RM_CD,APPROVE_YN,GW_DOC_ID,MOD_SEND_YN,SMRY
  test.skip('[no:7] pur_1350M - 삭제 (tmDelete) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO 구매요구현황 (pur_5110m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_5110m' OR MNU_NM LIKE 'MRO 구매요구현황%'
  const MENU_ID = 'TODO_pur_5110m';
  const API_URL = '/mis/pur/pur5110/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_APV_STAT_CD', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_MRO_RQST_NO', 'SCH_RQST_SBJ', 'SCH_CLS', 'SCH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur5110/getList.do | inputCols=SCH_RQST_SDT,SCH_RQST_EDT,SCH_APV_STAT_CD,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_MRO_RQST_NO,SCH_RQST_SBJ,SCH_CLS,SCH_KEY
  test.skip('[no:1] MRO 구매요구현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO 구매요구신청 (pur_5115m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_5115m' OR MNU_NM LIKE 'MRO 구매요구신청%'
  const MENU_ID = 'TODO_pur_5115m';
  const API_URL = '/mis/pur/pur5115/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['MRO_RQST_NO', 'RQST_DT', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APV_STAT_CD', 'APV_STAT_NM', 'RQST_SBJ', 'CORP_CD', 'BUSI_PLC_CD', 'ACT_UNIT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_BSNS_CD', 'BUDG_BSNS_NM', 'ACCT_CD', 'ACCT_NM', 'DLVY_ADDR', 'DLVY_MEMO', 'RQST_CONT', 'DLVR_PLC_CD', 'DLVR_PLC', 'DLVR_PLC_FLOOR', 'DLVR_PLC_NM', 'DLVERY_DAYS', 'TOT_SPLY_VAL', 'TOT_VAT', 'TOT_AMT', 'TAXT_YN', 'BUDG_LITM_CD', 'BUDG_LITM_NM', 'BUDG_CLSF_FG', 'PRJT_FG', 'lv_appYn'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/pur/pur5115/setData.do | inputCols=MRO_RQST_NO,RQST_DT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APV_STAT_CD,APV_STAT_NM,RQST_SBJ,CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_BSNS_CD,BUDG_BSNS_NM,ACCT_CD,ACCT_NM,DLVY_ADDR,DLVY_MEMO,RQST_CONT,DLVR_PLC_CD,DLVR_PLC,DLVR_PLC_FLOOR,DLVR_PLC_NM,DLVERY_DAYS,TOT_SPLY_VAL,TOT_VAT,TOT_AMT,TAXT_YN,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_CLSF_FG,PRJT_FG,lv_appYn
  test.skip('[no:1] MRO 구매요구신청 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur5115/getData.do | inputCols=MRO_RQST_NO,RQST_DT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APV_STAT_CD,APV_STAT_NM,RQST_SBJ,CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_BSNS_CD,BUDG_BSNS_NM,ACCT_CD,ACCT_NM,DLVY_ADDR,DLVY_MEMO,RQST_CONT,DLVR_PLC_CD,DLVR_PLC,DLVR_PLC_FLOOR,DLVR_PLC_NM,DLVERY_DAYS,TOT_SPLY_VAL,TOT_VAT,TOT_AMT,TAXT_YN,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_CLSF_FG,PRJT_FG,lv_appYn
  test.skip('[no:2] MRO 구매요구신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur5115/delData.do | inputCols=MRO_RQST_NO,RQST_DT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APV_STAT_CD,APV_STAT_NM,RQST_SBJ,CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_BSNS_CD,BUDG_BSNS_NM,ACCT_CD,ACCT_NM,DLVY_ADDR,DLVY_MEMO,RQST_CONT,DLVR_PLC_CD,DLVR_PLC,DLVR_PLC_FLOOR,DLVR_PLC_NM,DLVERY_DAYS,TOT_SPLY_VAL,TOT_VAT,TOT_AMT,TAXT_YN,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_CLSF_FG,PRJT_FG,lv_appYn
  test.skip('[no:3] MRO 구매요구신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur5115/getDlvrPlcCd.do | inputCols=MRO_RQST_NO,RQST_DT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,APV_STAT_CD,APV_STAT_NM,RQST_SBJ,CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_BSNS_CD,BUDG_BSNS_NM,ACCT_CD,ACCT_NM,DLVY_ADDR,DLVY_MEMO,RQST_CONT,DLVR_PLC_CD,DLVR_PLC,DLVR_PLC_FLOOR,DLVR_PLC_NM,DLVERY_DAYS,TOT_SPLY_VAL,TOT_VAT,TOT_AMT,TAXT_YN,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_CLSF_FG,PRJT_FG,lv_appYn
  test.skip('[no:4] MRO 구매요구신청 - 조회 (getDlvrPlcCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO 요구물품취소 (pur_5120m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_5120m' OR MNU_NM LIKE 'MRO 요구물품취소%'
  const MENU_ID = 'TODO_pur_5120m';
  const API_URL = '/mis/pur/pur5120/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_APV_STAT_CD', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_MRO_RQST_NO', 'SCH_CLS', 'SCH_KEY', 'SCH_ORDR_CNCL_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur5120/getList.do | inputCols=SCH_RQST_SDT,SCH_RQST_EDT,SCH_APV_STAT_CD,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_MRO_RQST_NO,SCH_CLS,SCH_KEY,SCH_ORDR_CNCL_YN
  test.skip('[no:1] MRO 요구물품취소 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur5120/setCnclPurRqstData.do | inputCols=isChecked,ORDR_CNCL_YN,ORDR_CNCL_DT,CNCL_RQST_DT,MRO_RQST_NO,MRO_RQST_SEQ,RQST_DT,RQST_SBJ,BUDG_BSNS_NM,ACCT_NM,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,MRO_ITEM_NM,THNG_SPLY_VAL,THNG_VAT,THNG_UPRC,THNG_QTY,THNG_AMT_TOT,TOT_SPLY_VAL,TOT_VAT,MODEL,MAKER,STD,UNIT,AST_CLS_NM,DLVERY_DAYS,TAXT_YN,SAFE_ITEM_YN,ASS_YN,REAGENT_YN,CHEM_MTTR_YN,PRCS_STATUS
  test.skip('[no:2] MRO 요구물품취소 - 저장 (setCnclPurRqstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO 검수및대금지급신청현황 (pur_5130m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_5130m' OR MNU_NM LIKE 'MRO 검수및대금지급신청현황%'
  const MENU_ID = 'TODO_pur_5130m';
  const API_URL = '/mis/pur/pur5130/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_RESL_SDT', 'SCH_RESL_EDT', 'SCH_RESL_AVAIL_YN', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_APV_STAT_CD', 'SCH_CLS', 'SCH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur5130/getList.do | inputCols=SCH_RQST_SDT,SCH_RQST_EDT,SCH_RESL_SDT,SCH_RESL_EDT,SCH_RESL_AVAIL_YN,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_APV_STAT_CD,SCH_CLS,SCH_KEY
  test.skip('[no:1] MRO 검수및대금지급신청현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO 검수 및 대금지급신청 (pur_5135m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_5135m' OR MNU_NM LIKE 'MRO 검수 및 대금지급신청%'
  const MENU_ID = 'TODO_pur_5135m';
  const API_URL = '/mis/pur/pur5135/getSchParams.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['PYMNT_RQST_NO', 'PYMNT_RQST_SEQ', 'MRO_RQST_NO', 'PMT_RQST_NO', 'PMT_RQST_DT', 'PMT_APNT_DEPT_CD', 'PMT_APNT_DEPT_NM', 'PMT_APNT_EMP_NO', 'PMT_APNT_EMP_NM', 'APV_STAT_CD', 'APV_STAT_NM', 'PMT_CUST_CD', 'PMT_CUST_NM', 'BK_CD', 'BK_ACC_NO', 'DPSTS_BNKB_NM', 'PUR_SETLE_MTHD', 'PROOF_TP', 'RL_CRDTOR_FG', 'PROOF_NO', 'PROOF_NO_ACCP', 'CARD_NO', 'PROOF_DT', 'BUDG_ITSR_CD', 'BUDG_BSNS_CD', 'BUDG_BSNS_NM', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'ACCT_CD', 'ACCT_NM', 'CORP_CD', 'BUSI_PLC_CD', 'ACT_UNIT_CD', 'TOT_SPLY_AMT', 'TOT_VAT', 'TOT_AMT', 'VAT_RTN_YN', 'SURTAX_FG', 'RMK', 'INSU_DT', 'INSP_DT', 'INSU_EMP_NO', 'INSU_EMP_NM', 'INSP_EMP_NO', 'INSP_EMP_NM', 'DLVR_PLC_CD', 'DLVR_PLC', 'DLVR_PLC_FLOOR', 'DLVR_PLC_NM', 'STBL_YN', 'CNTC_NO', 'LV_APPYN', 'TAXT_TASP_FG', 'CNCL_YN', 'INS_CARD_YN', 'RCV_EMP_NO', 'RCV_EMP_NM', 'RCV_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/pur/pur5135/setData.do | inputCols=PYMNT_RQST_NO,PYMNT_RQST_SEQ,MRO_RQST_NO,PMT_RQST_NO,PMT_RQST_DT,PMT_APNT_DEPT_CD,PMT_APNT_DEPT_NM,PMT_APNT_EMP_NO,PMT_APNT_EMP_NM,APV_STAT_CD,APV_STAT_NM,PMT_CUST_CD,PMT_CUST_NM,BK_CD,BK_ACC_NO,DPSTS_BNKB_NM,PUR_SETLE_MTHD,PROOF_TP,RL_CRDTOR_FG,PROOF_NO,PROOF_NO_ACCP,CARD_NO,PROOF_DT,BUDG_ITSR_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,ACCT_CD,ACCT_NM,CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,TOT_SPLY_AMT,TOT_VAT,TOT_AMT,VAT_RTN_YN,SURTAX_FG,RMK,INSU_DT,INSP_DT,INSU_EMP_NO,INSU_EMP_NM,INSP_EMP_NO,INSP_EMP_NM,DLVR_PLC_CD,DLVR_PLC,DLVR_PLC_FLOOR,DLVR_PLC_NM,STBL_YN,CNTC_NO,LV_APPYN,TAXT_TASP_FG,CNCL_YN,INS_CARD_YN,RCV_EMP_NO,RCV_EMP_NM,RCV_DT
  test.skip('[no:1] MRO 검수 및 대금지급신청 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur5135/getSchParams.do | inputCols=PYMNT_RQST_NO,PYMNT_RQST_SEQ,MRO_RQST_NO,PMT_RQST_NO,PMT_RQST_DT,PMT_APNT_DEPT_CD,PMT_APNT_DEPT_NM,PMT_APNT_EMP_NO,PMT_APNT_EMP_NM,APV_STAT_CD,APV_STAT_NM,PMT_CUST_CD,PMT_CUST_NM,BK_CD,BK_ACC_NO,DPSTS_BNKB_NM,PUR_SETLE_MTHD,PROOF_TP,RL_CRDTOR_FG,PROOF_NO,PROOF_NO_ACCP,CARD_NO,PROOF_DT,BUDG_ITSR_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,ACCT_CD,ACCT_NM,CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,TOT_SPLY_AMT,TOT_VAT,TOT_AMT,VAT_RTN_YN,SURTAX_FG,RMK,INSU_DT,INSP_DT,INSU_EMP_NO,INSU_EMP_NM,INSP_EMP_NO,INSP_EMP_NM,DLVR_PLC_CD,DLVR_PLC,DLVR_PLC_FLOOR,DLVR_PLC_NM,STBL_YN,CNTC_NO,LV_APPYN,TAXT_TASP_FG,CNCL_YN,INS_CARD_YN,RCV_EMP_NO,RCV_EMP_NM,RCV_DT
  test.skip('[no:2] MRO 검수 및 대금지급신청 - 조회 (getSchParams) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur5135/getData.do | inputCols=PYMNT_RQST_NO,PYMNT_RQST_SEQ,MRO_RQST_NO,PMT_RQST_NO,PMT_RQST_DT,PMT_APNT_DEPT_CD,PMT_APNT_DEPT_NM,PMT_APNT_EMP_NO,PMT_APNT_EMP_NM,APV_STAT_CD,APV_STAT_NM,PMT_CUST_CD,PMT_CUST_NM,BK_CD,BK_ACC_NO,DPSTS_BNKB_NM,PUR_SETLE_MTHD,PROOF_TP,RL_CRDTOR_FG,PROOF_NO,PROOF_NO_ACCP,CARD_NO,PROOF_DT,BUDG_ITSR_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,ACCT_CD,ACCT_NM,CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,TOT_SPLY_AMT,TOT_VAT,TOT_AMT,VAT_RTN_YN,SURTAX_FG,RMK,INSU_DT,INSP_DT,INSU_EMP_NO,INSU_EMP_NM,INSP_EMP_NO,INSP_EMP_NM,DLVR_PLC_CD,DLVR_PLC,DLVR_PLC_FLOOR,DLVR_PLC_NM,STBL_YN,CNTC_NO,LV_APPYN,TAXT_TASP_FG,CNCL_YN,INS_CARD_YN,RCV_EMP_NO,RCV_EMP_NM,RCV_DT
  test.skip('[no:3] MRO 검수 및 대금지급신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur5135/delData.do | inputCols=PYMNT_RQST_NO,PYMNT_RQST_SEQ,MRO_RQST_NO,PMT_RQST_NO,PMT_RQST_DT,PMT_APNT_DEPT_CD,PMT_APNT_DEPT_NM,PMT_APNT_EMP_NO,PMT_APNT_EMP_NM,APV_STAT_CD,APV_STAT_NM,PMT_CUST_CD,PMT_CUST_NM,BK_CD,BK_ACC_NO,DPSTS_BNKB_NM,PUR_SETLE_MTHD,PROOF_TP,RL_CRDTOR_FG,PROOF_NO,PROOF_NO_ACCP,CARD_NO,PROOF_DT,BUDG_ITSR_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,ACCT_CD,ACCT_NM,CORP_CD,BUSI_PLC_CD,ACT_UNIT_CD,TOT_SPLY_AMT,TOT_VAT,TOT_AMT,VAT_RTN_YN,SURTAX_FG,RMK,INSU_DT,INSP_DT,INSU_EMP_NO,INSU_EMP_NM,INSP_EMP_NO,INSP_EMP_NM,DLVR_PLC_CD,DLVR_PLC,DLVR_PLC_FLOOR,DLVR_PLC_NM,STBL_YN,CNTC_NO,LV_APPYN,TAXT_TASP_FG,CNCL_YN,INS_CARD_YN,RCV_EMP_NO,RCV_EMP_NM,RCV_DT
  test.skip('[no:4] MRO 검수 및 대금지급신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur5135/chkSaftyYn.do | inputCols=ORDR_NO,ORDR_SEQ,MRO_ITEM_NM,AFTER_EXMNT_YN,SAFETY_PRODUCT_VOLUME_NO,DHRM_CD,ROOM_NM,LBRT_YN,PROD_SPL_PRC,PROD_VAT,THNG_UPRC,THNG_QTY,TOT_SPLY_VAL,TOT_VAT,PROD_TOT_AMT,MODEL,UNIT,STD,MAKER,CTRL_NO
  test.skip('[no:5] MRO 검수 및 대금지급신청 - 조회 (chkSaftyYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO 상품 계약/변경현황 (pur_5140m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_5140m' OR MNU_NM LIKE 'MRO 상품 계약/변경현황%'
  const MENU_ID = 'TODO_pur_5140m';
  const API_URL = '/mis/pur/pur5140/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'SCH_SIGN_STAT_NM', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_MRO_RQST_NO', 'SCH_RQST_SBJ', 'SCH_CLS', 'SCH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur5140/getList.do | inputCols=SCH_RQST_SDT,SCH_RQST_EDT,SCH_SIGN_STAT_NM,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_MRO_RQST_NO,SCH_RQST_SBJ,SCH_CLS,SCH_KEY
  test.skip('[no:1] MRO 상품 계약/변경현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO 상품 계약/변경 요구 (pur_5145m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_5145m' OR MNU_NM LIKE 'MRO 상품 계약/변경 요구%'
  const MENU_ID = 'TODO_pur_5145m';
  const API_URL = '/mis/pur/pur5145/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['MRO_PRODUCT_RQST_NO', 'RQST_DT', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'SIGN_STAT_CD', 'SIGN_STAT_NM', 'CTRCT_RQST_NM', 'RMK'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/pur/pur5145/setData.do | inputCols=MRO_PRODUCT_RQST_NO,RQST_DT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,SIGN_STAT_CD,SIGN_STAT_NM,CTRCT_RQST_NM,RMK
  test.skip('[no:1] MRO 상품 계약/변경 요구 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur5145/getData.do | inputCols=MRO_PRODUCT_RQST_NO,RQST_DT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,SIGN_STAT_CD,SIGN_STAT_NM,CTRCT_RQST_NM,RMK
  test.skip('[no:2] MRO 상품 계약/변경 요구 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur5145/delData.do | inputCols=MRO_PRODUCT_RQST_NO,RQST_DT,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,SIGN_STAT_CD,SIGN_STAT_NM,CTRCT_RQST_NM,RMK
  test.skip('[no:3] MRO 상품 계약/변경 요구 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('pur_5160M (pur_5160m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_5160m' OR MNU_NM LIKE 'pur_5160M%'
  const MENU_ID = 'TODO_pur_5160m';
  const API_URL = '/mis/pur/pur5160/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_SDT', 'RQST_EDT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'ACCT_EXPN_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'RQST_STAT', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'MRO_STEP'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur5160/getList.do | inputCols=RQST_SDT,RQST_EDT,APNT_EMP_NO,APNT_EMP_NM,ACCT_EXPN_CD,SCH_SRCH_CLS,SCH_SRCH_KEY,RQST_STAT,APNT_DEPT_NM,APNT_DEPT_CD,MRO_STEP
  test.skip('[no:1] pur_5160M - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur5160/setInspCnrm.do | inputCols=-
  test.skip('[no:2] pur_5160M - 저장 (setInspCnrm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur5160/setPurCancel.do | inputCols=-
  test.skip('[no:3] pur_5160M - 저장 (setPurCancel) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('pur_5170M (pur_5170m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_5170m' OR MNU_NM LIKE 'pur_5170M%'
  const MENU_ID = 'TODO_pur_5170m';
  const API_URL = '/mis/pur/pur5170/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'CONT_CLS', 'FRGN_CLS', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_EMP_NO', 'APNT_EMP_NM', 'RQST_SBJ', 'MRO_STEP', 'DT_CLS', 'BUDG_CLS', 'RESL_END_YN', 'PUR_END_YN', 'MEMR_CNTR_YN', 'ROLE_YN', 'DLY_PAY_AMT_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur5170/getList.do | inputCols=BUSI_PLC_CD,RQST_SDT,RQST_EDT,CONT_CLS,FRGN_CLS,APNT_DEPT_CD,APNT_DEPT_NM,APNT_EMP_NO,APNT_EMP_NM,RQST_SBJ,MRO_STEP,DT_CLS,BUDG_CLS,RESL_END_YN,PUR_END_YN,MEMR_CNTR_YN,ROLE_YN,DLY_PAY_AMT_YN
  test.skip('[no:1] pur_5170M - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('pur_5180M (pur_5180m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_5180m' OR MNU_NM LIKE 'pur_5180M%'
  const MENU_ID = 'TODO_pur_5180m';
  const API_URL = '/mis/pur/pur1320007/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'CONT_CLS', 'FRGN_CLS', 'RQST_DEPT_CD', 'RQST_DEPT_NM', 'RQST_EMP_NO', 'RQST_EMP_NM', 'RQST_SBJ', 'MRO_STEP', 'DT_CLS', 'BUDG_CLS', 'RESL_END_YN', 'PUR_END_YN', 'MEMR_CNTR_YN', 'ROLE_YN', 'DLY_PAY_AMT_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur1320007/getList.do | inputCols=BUSI_PLC_CD,RQST_SDT,RQST_EDT,CONT_CLS,FRGN_CLS,RQST_DEPT_CD,RQST_DEPT_NM,RQST_EMP_NO,RQST_EMP_NM,RQST_SBJ,MRO_STEP,DT_CLS,BUDG_CLS,RESL_END_YN,PUR_END_YN,MEMR_CNTR_YN,ROLE_YN,DLY_PAY_AMT_YN
  test.skip('[no:1] pur_5180M - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('pur_5190M (pur_5190m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_5190m' OR MNU_NM LIKE 'pur_5190M%'
  const MENU_ID = 'TODO_pur_5190m';
  const API_URL = '/mis/pur/pur1330007/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'CONT_CLS', 'FRGN_CLS', 'RQST_DEPT_CD', 'RQST_DEPT_NM', 'RQST_EMP_NO', 'RQST_EMP_NM', 'RQST_SBJ', 'MRO_STEP', 'DT_CLS', 'BUDG_CLS', 'RESL_END_YN', 'PUR_END_YN', 'MEMR_CNTR_YN', 'ROLE_YN', 'DLY_PAY_AMT_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur1330007/getList.do | inputCols=BUSI_PLC_CD,RQST_SDT,RQST_EDT,CONT_CLS,FRGN_CLS,RQST_DEPT_CD,RQST_DEPT_NM,RQST_EMP_NO,RQST_EMP_NM,RQST_SBJ,MRO_STEP,DT_CLS,BUDG_CLS,RESL_END_YN,PUR_END_YN,MEMR_CNTR_YN,ROLE_YN,DLY_PAY_AMT_YN
  test.skip('[no:1] pur_5190M - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('규격입찰관리 (pur_8010m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8010m' OR MNU_NM LIKE '규격입찰관리%'
  const MENU_ID = 'TODO_pur_8010m';
  const API_URL = '/mis/pur/pur8010/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'RQST_STAT', 'PUR_STEP', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS', 'ACCP_STAT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur8010/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_SDT,RQST_EDT,RQST_STAT,PUR_STEP,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,RJCT_YN,SRCH_CLS,SRCH_KEY,FRGN_CLS,PUR_TP,ROLE_YN,DEPT_CHIF_YN,PUR_CLS,ACCP_STAT
  test.skip('[no:1] 규격입찰관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('규격입찰결과등록 (pur_8011m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8011m' OR MNU_NM LIKE '규격입찰결과등록%'
  const MENU_ID = 'TODO_pur_8011m';
  const API_URL = '/mis/pur/pur8011/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WORK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'ACT_UNIT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PRJT_FG', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT', 'STD_BID_NO', 'RGST_NO', 'MNG_NO', 'ROLE_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur8011/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,STD_BID_NO,RGST_NO,MNG_NO,ROLE_YN
  test.skip('[no:1] 규격입찰결과등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur8011/delData.do | inputCols=-
  test.skip('[no:2] 규격입찰결과등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8011/setAccp.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,STD_BID_NO,RGST_NO,MNG_NO,ROLE_YN
  test.skip('[no:3] 규격입찰결과등록 - 저장 (setAccp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8011/setAppro.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,STD_BID_NO,RGST_NO,MNG_NO,ROLE_YN
  test.skip('[no:4] 규격입찰결과등록 - 저장 (setAppro) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8011/setReject.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,STD_BID_NO,RGST_NO,MNG_NO,ROLE_YN
  test.skip('[no:5] 규격입찰결과등록 - 저장 (setReject) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8011/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,STD_BID_NO,RGST_NO,MNG_NO,ROLE_YN
  test.skip('[no:6] 규격입찰결과등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('규격입찰결과등록(외자) (pur_8012m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8012m' OR MNU_NM LIKE '규격입찰결과등록(외자)%'
  const MENU_ID = 'TODO_pur_8012m';
  const API_URL = '/mis/pur/pur0111/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'ACCT_UNT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PRJT_FG', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0111/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACCT_UNT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:1] 규격입찰결과등록(외자) - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0111/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACCT_UNT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:2] 규격입찰결과등록(외자) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0111/delData.do | inputCols=CORP_CD,BUSI_PLC_CD,ACCT_UNT_CD,WRK_AREA,RQST_NO,RQST_DT,RQST_EMP_NO,RQST_EMP_NM,RQST_DEPT_CD,RQST_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_CD,DLVERY_GDS_PLC_NM,RQST_CONT,VAT_TYPE,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,YEARS_FG,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_RSN_CD,OPT_CUST,OPT_CONT,POST_PRCSS_RSN,OPT_CTRCT_YN,POST_PRCSS_YN,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,OLD_SYS_KEY,KOR_GDS_NM,ENG_GDS_NM,FEATURE,MAIN_SYSTEM,ACCESSORY,ETC,OPT_RISK_YN,GDS_QTY,MAIN_QTY,ACCS_QTY,OPT_RSN_010,OPT_RSN_020,OPT_RSN_030,OPT_RSN_041,OPT_RSN_042,OPT_RSN_043,OPT_RSN_050,OPT_RSN_ETC,RCMD_CUST_MNG_NM,RCMD_CUST_MNG_TEL_NO,RCMD_CUST_MNG_EMAIL,OPT_THNG_METR,CTRL_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,ACCT_CD,PUR_BUDG_AMT,BUDG_INCM_AMT,PROV_APRQ_NO,PROV_APRQ_SEQ,DTL_PROV_AMT,BUDG_CHG_YN,WRT_EMP_NO,WRT_EMP_NM,WRT_DEPT_CD,WRT_DEPT_NM,RQST_EMP_CLS,RGD_TRGT_YN
  test.skip('[no:3] 규격입찰결과등록(외자) - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0111/setDtlDelData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACCT_UNT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:4] 규격입찰결과등록(외자) - 삭제 (setDtlDelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0111/uptChk.do | inputCols=-
  test.skip('[no:5] 규격입찰결과등록(외자) - 수정 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0111/setData2.do | inputCols=CORP_CD,BUSI_PLC_CD,ACCT_UNT_CD,WRK_AREA,RQST_NO,RQST_DT,RQST_EMP_NO,RQST_EMP_NM,RQST_DEPT_CD,RQST_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_CD,DLVERY_GDS_PLC_NM,RQST_CONT,VAT_TYPE,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,YEARS_FG,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_RSN_CD,OPT_CUST,OPT_CONT,POST_PRCSS_RSN,OPT_CTRCT_YN,POST_PRCSS_YN,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,OLD_SYS_KEY,KOR_GDS_NM,ENG_GDS_NM,FEATURE,MAIN_SYSTEM,ACCESSORY,ETC,OPT_RISK_YN,GDS_QTY,MAIN_QTY,ACCS_QTY,OPT_RSN_010,OPT_RSN_020,OPT_RSN_030,OPT_RSN_041,OPT_RSN_042,OPT_RSN_043,OPT_RSN_050,OPT_RSN_ETC,RCMD_CUST_MNG_NM,RCMD_CUST_MNG_TEL_NO,RCMD_CUST_MNG_EMAIL,OPT_THNG_METR,CTRL_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,ACCT_CD,PUR_BUDG_AMT,BUDG_INCM_AMT,PROV_APRQ_NO,PROV_APRQ_SEQ,DTL_PROV_AMT,BUDG_CHG_YN,WRT_EMP_NO,WRT_EMP_NM,WRT_DEPT_CD,WRT_DEPT_NM,RQST_EMP_CLS,RGD_TRGT_YN
  test.skip('[no:6] 규격입찰결과등록(외자) - 저장 (setData2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개찰결과관리 (pur_8020m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8020m' OR MNU_NM LIKE '개찰결과관리%'
  const MENU_ID = 'TODO_pur_8020m';
  const API_URL = '/mis/pur/pur8020/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'RQST_STAT', 'PUR_STEP', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS', 'ACCP_STAT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur8020/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_SDT,RQST_EDT,RQST_STAT,PUR_STEP,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,RJCT_YN,SRCH_CLS,SRCH_KEY,FRGN_CLS,PUR_TP,ROLE_YN,DEPT_CHIF_YN,PUR_CLS,ACCP_STAT
  test.skip('[no:1] 개찰결과관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개찰결과등록 (pur_8021m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8021m' OR MNU_NM LIKE '개찰결과등록%'
  const MENU_ID = 'TODO_pur_8021m';
  const API_URL = '/mis/pur/pur8021/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur8021/getData.do | inputCols=-
  test.skip('[no:1] 개찰결과등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur8021/delData.do | inputCols=-
  test.skip('[no:2] 개찰결과등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8021/setAccp.do | inputCols=-
  test.skip('[no:3] 개찰결과등록 - 저장 (setAccp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8021/setAppro.do | inputCols=-
  test.skip('[no:4] 개찰결과등록 - 저장 (setAppro) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8021/setReject.do | inputCols=-
  test.skip('[no:5] 개찰결과등록 - 저장 (setReject) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8021/setData.do | inputCols=-
  test.skip('[no:6] 개찰결과등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개찰결과등록(외자) (pur_8022m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8022m' OR MNU_NM LIKE '개찰결과등록(외자)%'
  const MENU_ID = 'TODO_pur_8022m';
  const API_URL = '/mis/pur/pur0111/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'ACCT_UNT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PRJT_FG', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0111/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACCT_UNT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:1] 개찰결과등록(외자) - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0111/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACCT_UNT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:2] 개찰결과등록(외자) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0111/delData.do | inputCols=CORP_CD,BUSI_PLC_CD,ACCT_UNT_CD,WRK_AREA,RQST_NO,RQST_DT,RQST_EMP_NO,RQST_EMP_NM,RQST_DEPT_CD,RQST_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_CD,DLVERY_GDS_PLC_NM,RQST_CONT,VAT_TYPE,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,YEARS_FG,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_RSN_CD,OPT_CUST,OPT_CONT,POST_PRCSS_RSN,OPT_CTRCT_YN,POST_PRCSS_YN,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,OLD_SYS_KEY,KOR_GDS_NM,ENG_GDS_NM,FEATURE,MAIN_SYSTEM,ACCESSORY,ETC,OPT_RISK_YN,GDS_QTY,MAIN_QTY,ACCS_QTY,OPT_RSN_010,OPT_RSN_020,OPT_RSN_030,OPT_RSN_041,OPT_RSN_042,OPT_RSN_043,OPT_RSN_050,OPT_RSN_ETC,RCMD_CUST_MNG_NM,RCMD_CUST_MNG_TEL_NO,RCMD_CUST_MNG_EMAIL,OPT_THNG_METR,CTRL_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,ACCT_CD,PUR_BUDG_AMT,BUDG_INCM_AMT,PROV_APRQ_NO,PROV_APRQ_SEQ,DTL_PROV_AMT,BUDG_CHG_YN,WRT_EMP_NO,WRT_EMP_NM,WRT_DEPT_CD,WRT_DEPT_NM,RQST_EMP_CLS,RGD_TRGT_YN
  test.skip('[no:3] 개찰결과등록(외자) - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0111/setDtlDelData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACCT_UNT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:4] 개찰결과등록(외자) - 삭제 (setDtlDelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0111/uptChk.do | inputCols=-
  test.skip('[no:5] 개찰결과등록(외자) - 수정 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0111/setData2.do | inputCols=CORP_CD,BUSI_PLC_CD,ACCT_UNT_CD,WRK_AREA,RQST_NO,RQST_DT,RQST_EMP_NO,RQST_EMP_NM,RQST_DEPT_CD,RQST_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_CD,DLVERY_GDS_PLC_NM,RQST_CONT,VAT_TYPE,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,YEARS_FG,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_RSN_CD,OPT_CUST,OPT_CONT,POST_PRCSS_RSN,OPT_CTRCT_YN,POST_PRCSS_YN,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,OLD_SYS_KEY,KOR_GDS_NM,ENG_GDS_NM,FEATURE,MAIN_SYSTEM,ACCESSORY,ETC,OPT_RISK_YN,GDS_QTY,MAIN_QTY,ACCS_QTY,OPT_RSN_010,OPT_RSN_020,OPT_RSN_030,OPT_RSN_041,OPT_RSN_042,OPT_RSN_043,OPT_RSN_050,OPT_RSN_ETC,RCMD_CUST_MNG_NM,RCMD_CUST_MNG_TEL_NO,RCMD_CUST_MNG_EMAIL,OPT_THNG_METR,CTRL_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,ACCT_CD,PUR_BUDG_AMT,BUDG_INCM_AMT,PROV_APRQ_NO,PROV_APRQ_SEQ,DTL_PROV_AMT,BUDG_CHG_YN,WRT_EMP_NO,WRT_EMP_NM,WRT_DEPT_CD,WRT_DEPT_NM,RQST_EMP_CLS,RGD_TRGT_YN
  test.skip('[no:6] 개찰결과등록(외자) - 저장 (setData2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개찰결과조회 (pur_8023m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8023m' OR MNU_NM LIKE '개찰결과조회%'
  const MENU_ID = 'TODO_pur_8023m';
  const API_URL = '/mis/pur/pur0110/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'RQST_STAT', 'PUR_STEP', 'RQST_EMP_NM', 'RQST_EMP_NO', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0110/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_SDT,RQST_EDT,RQST_STAT,PUR_STEP,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RJCT_YN,SRCH_CLS,SRCH_KEY,FRGN_CLS,PUR_TP,ROLE_YN,DEPT_CHIF_YN,PUR_CLS
  test.skip('[no:1] 개찰결과조회 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/pur/pur0110/getList2.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_SDT,RQST_EDT,RQST_STAT,PUR_STEP,RQST_EMP_NM,RQST_EMP_NO,RQST_DEPT_NM,RQST_DEPT_CD,RJCT_YN,SRCH_CLS,SRCH_KEY,FRGN_CLS,PUR_TP,ROLE_YN,DEPT_CHIF_YN,PUR_CLS
  test.skip('[no:2] 개찰결과조회 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('학술연구용품관리 (pur_8030m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8030m' OR MNU_NM LIKE '학술연구용품관리%'
  const MENU_ID = 'TODO_pur_8030m';
  const API_URL = '/mis/pur/pur8030/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'RQST_STAT', 'PUR_STEP', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS', 'ACCP_STAT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur8030/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_SDT,RQST_EDT,RQST_STAT,PUR_STEP,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,RJCT_YN,SRCH_CLS,SRCH_KEY,FRGN_CLS,PUR_TP,ROLE_YN,DEPT_CHIF_YN,PUR_CLS,ACCP_STAT
  test.skip('[no:1] 학술연구용품관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('학술연구용품신청 (pur_8031m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8031m' OR MNU_NM LIKE '학술연구용품신청%'
  const MENU_ID = 'TODO_pur_8031m';
  const API_URL = '/mis/pur/pur8031/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCHLR_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur8031/getData.do | inputCols=SCHLR_NO
  test.skip('[no:1] 학술연구용품신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8031/setData.do | inputCols=SCHLR_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,STTM_DT,RQST_FG,RQST_DT,SCHLR_SETUP,SCHLR_USE_PRP,RQST_FEE,E_STTM_NO,RGST_NO,RQST_NO,PUR_CONT_NO,Column0
  test.skip('[no:2] 학술연구용품신청 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur8031/delData.do | inputCols=SCHLR_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,STTM_DT,RQST_FG,RQST_DT,SCHLR_SETUP,SCHLR_USE_PRP,RQST_FEE,E_STTM_NO,RGST_NO,RQST_NO,PUR_CONT_NO,Column0
  test.skip('[no:3] 학술연구용품신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('예정가격조사관리 (pur_8040m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8040m' OR MNU_NM LIKE '예정가격조사관리%'
  const MENU_ID = 'TODO_pur_8040m';
  const API_URL = '/mis/pur/pur8040/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'PUR_STEP', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS', 'ACCP_STAT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur8040/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_SDT,RQST_EDT,PUR_STEP,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,RJCT_YN,SRCH_CLS,SRCH_KEY,FRGN_CLS,PUR_TP,ROLE_YN,DEPT_CHIF_YN,PUR_CLS,ACCP_STAT
  test.skip('[no:1] 예정가격조사관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('예정가격조사등록 (pur_8041m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8041m' OR MNU_NM LIKE '예정가격조사등록%'
  const MENU_ID = 'TODO_pur_8041m';
  const API_URL = '/mis/pur/pur8041/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'PUR_TP', 'FRGN_CLS', 'RGST_NO', 'FRM_MODE', 'ACT_UNIT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PRJT_FG', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT', 'PCEM_NO', 'RQST_NO', 'SESS_USER_ROLE'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur8041/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RGST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,PCEM_NO,RQST_NO,SESS_USER_ROLE
  test.skip('[no:1] 예정가격조사등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur8041/delData.do | inputCols=PCEM_NO,RGST_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_DT,CORP_CD,BUSI_PLC_CD,WORK_AREA,PRAR_PRES_PER,ACCP_STAT,ACCP_STAT_NM,REP_CURR_UNIT,USD_CONV_AMT,TOT_PRES_AMT_FRGN,EXMNT_OPIN,PRAR_BASC_AMT,AMT,CONT_NM
  test.skip('[no:2] 예정가격조사등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8041/setAccp.do | inputCols=PCEM_NO,RGST_NO,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,RQST_DT,CORP_CD,BUSI_PLC_CD,WORK_AREA,PRAR_PRES_PER,ACCP_STAT,ACCP_STAT_NM,REP_CURR_UNIT,USD_CONV_AMT,TOT_PRES_AMT_FRGN,EXMNT_OPIN,PRAR_BASC_AMT,AMT,CONT_NM
  test.skip('[no:3] 예정가격조사등록 - 저장 (setAccp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8041/setAppro.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RGST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,PCEM_NO,RQST_NO,SESS_USER_ROLE
  test.skip('[no:4] 예정가격조사등록 - 저장 (setAppro) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8041/setReject.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RGST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,PCEM_NO,RQST_NO,SESS_USER_ROLE
  test.skip('[no:5] 예정가격조사등록 - 저장 (setReject) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8041/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RGST_NO,FRM_MODE,ACT_UNIT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT,PCEM_NO,RQST_NO,SESS_USER_ROLE
  test.skip('[no:6] 예정가격조사등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('예정가격신청(외자) (pur_8042m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8042m' OR MNU_NM LIKE '예정가격신청(외자)%'
  const MENU_ID = 'TODO_pur_8042m';
  const API_URL = '/mis/pur/pur0111/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WRK_AREA', 'PUR_TP', 'FRGN_CLS', 'RQST_NO', 'FRM_MODE', 'ACCT_UNT_CD', 'BUDG_YY', 'BUDG_FG', 'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD', 'PRJT_FG', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur0111/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACCT_UNT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:1] 예정가격신청(외자) - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0111/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACCT_UNT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:2] 예정가격신청(외자) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0111/delData.do | inputCols=CORP_CD,BUSI_PLC_CD,ACCT_UNT_CD,WRK_AREA,RQST_NO,RQST_DT,RQST_EMP_NO,RQST_EMP_NM,RQST_DEPT_CD,RQST_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_CD,DLVERY_GDS_PLC_NM,RQST_CONT,VAT_TYPE,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,YEARS_FG,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_RSN_CD,OPT_CUST,OPT_CONT,POST_PRCSS_RSN,OPT_CTRCT_YN,POST_PRCSS_YN,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,OLD_SYS_KEY,KOR_GDS_NM,ENG_GDS_NM,FEATURE,MAIN_SYSTEM,ACCESSORY,ETC,OPT_RISK_YN,GDS_QTY,MAIN_QTY,ACCS_QTY,OPT_RSN_010,OPT_RSN_020,OPT_RSN_030,OPT_RSN_041,OPT_RSN_042,OPT_RSN_043,OPT_RSN_050,OPT_RSN_ETC,RCMD_CUST_MNG_NM,RCMD_CUST_MNG_TEL_NO,RCMD_CUST_MNG_EMAIL,OPT_THNG_METR,CTRL_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,ACCT_CD,PUR_BUDG_AMT,BUDG_INCM_AMT,PROV_APRQ_NO,PROV_APRQ_SEQ,DTL_PROV_AMT,BUDG_CHG_YN,WRT_EMP_NO,WRT_EMP_NM,WRT_DEPT_CD,WRT_DEPT_NM,RQST_EMP_CLS,RGD_TRGT_YN
  test.skip('[no:3] 예정가격신청(외자) - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur0111/setDtlDelData.do | inputCols=CORP_CD,BUSI_PLC_CD,WRK_AREA,PUR_TP,FRGN_CLS,RQST_NO,FRM_MODE,ACCT_UNT_CD,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,ACCT_CD,PRJT_FG,EQUIP_ESSNTLREGS_AT,GRD_NM,TEMP_AMT
  test.skip('[no:4] 예정가격신청(외자) - 삭제 (setDtlDelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/pur/pur0111/uptChk.do | inputCols=-
  test.skip('[no:5] 예정가격신청(외자) - 수정 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur0111/setData2.do | inputCols=CORP_CD,BUSI_PLC_CD,ACCT_UNT_CD,WRK_AREA,RQST_NO,RQST_DT,RQST_EMP_NO,RQST_EMP_NM,RQST_DEPT_CD,RQST_DEPT_NM,RQST_STAT,RQST_STAT_NM,FRGN_CLS,PUR_TP,RQST_SBJ,DLVERY_SDT,DLVERY_EDT,DLVR_EXPN_DT,DLVERY_DAYS,DLVERY_GDS_PLC_CD,DLVERY_GDS_PLC_NM,RQST_CONT,VAT_TYPE,TOT_PRES_AMT,TOT_PRES_AMT_FRGN,TOT_ADD_AMT,TOT_RQST_AMT,RCMD_CUST_NM,RCMD_CUST_CD,ADD_AMT_RATE,REP_EXCHNG_RATE,REP_CURR_UNIT,YEARS_FG,BUDG_NULL_YN,RJCT_YN,RJCT_RSN,EXMNT_TP,RMK,PUR_STEP,GW_DOC_ID,GW_DOC_NO,OPT_RSN_CD,OPT_CUST,OPT_CONT,POST_PRCSS_RSN,OPT_CTRCT_YN,POST_PRCSS_YN,GRD_NM,CHK_DT,INS_ID,ITEM_MNG_NO,OLD_SYS_KEY,KOR_GDS_NM,ENG_GDS_NM,FEATURE,MAIN_SYSTEM,ACCESSORY,ETC,OPT_RISK_YN,GDS_QTY,MAIN_QTY,ACCS_QTY,OPT_RSN_010,OPT_RSN_020,OPT_RSN_030,OPT_RSN_041,OPT_RSN_042,OPT_RSN_043,OPT_RSN_050,OPT_RSN_ETC,RCMD_CUST_MNG_NM,RCMD_CUST_MNG_TEL_NO,RCMD_CUST_MNG_EMAIL,OPT_THNG_METR,CTRL_NO,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_BSNS_CD,BUDG_BSNS_NM,BUDG_LITM_CD,BUDG_LITM_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,ACCT_CD,PUR_BUDG_AMT,BUDG_INCM_AMT,PROV_APRQ_NO,PROV_APRQ_SEQ,DTL_PROV_AMT,BUDG_CHG_YN,WRT_EMP_NO,WRT_EMP_NM,WRT_DEPT_CD,WRT_DEPT_NM,RQST_EMP_CLS,RGD_TRGT_YN
  test.skip('[no:6] 예정가격신청(외자) - 저장 (setData2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사전규격 (pur_8050m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8050m' OR MNU_NM LIKE '사전규격%'
  const MENU_ID = 'TODO_pur_8050m';
  const API_URL = '/mis/pur/pur8050/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_SDT', 'RQST_EDT', 'PUR_STEP', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'RJCT_YN', 'SRCH_CLS', 'SRCH_KEY', 'FRGN_CLS', 'PUR_TP', 'ROLE_YN', 'DEPT_CHIF_YN', 'PUR_CLS', 'ACCP_STAT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur8050/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_SDT,RQST_EDT,PUR_STEP,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,RJCT_YN,SRCH_CLS,SRCH_KEY,FRGN_CLS,PUR_TP,ROLE_YN,DEPT_CHIF_YN,PUR_CLS,ACCP_STAT
  test.skip('[no:1] 사전규격 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사전규격결과등록 (pur_8051m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8051m' OR MNU_NM LIKE '사전규격결과등록%'
  const MENU_ID = 'TODO_pur_8051m';
  const API_URL = '/mis/pur/pur8051/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'WORK_AREA', 'PUR_TP', 'FRGN_CLS', 'RGST_NO', 'FRM_MODE', 'ACCT_CD', 'PRJT_FG', 'GRD_NM', 'TEMP_AMT', 'PRE_STD_NO', 'RQST_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur8051/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RGST_NO,FRM_MODE,ACCT_CD,PRJT_FG,GRD_NM,TEMP_AMT,PRE_STD_NO,RQST_NO
  test.skip('[no:1] 사전규격결과등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/pur/pur8051/delData.do | inputCols=PRE_STD_NO,RGST_NO,INS_ID,INS_NM,RQST_DT,CORP_CD,BUSI_PLC_CD,WORK_AREA,PRAR_PRES_PER,ACCP_STAT,ACCP_STAT_NM,AMT,APV_APNT_EMP_NO,CONT_NM
  test.skip('[no:2] 사전규격결과등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8051/setAccp.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RGST_NO,FRM_MODE,ACCT_CD,PRJT_FG,GRD_NM,TEMP_AMT,PRE_STD_NO,RQST_NO
  test.skip('[no:3] 사전규격결과등록 - 저장 (setAccp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8051/setAppro.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RGST_NO,FRM_MODE,ACCT_CD,PRJT_FG,GRD_NM,TEMP_AMT,PRE_STD_NO,RQST_NO
  test.skip('[no:4] 사전규격결과등록 - 저장 (setAppro) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8051/setReject.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RGST_NO,FRM_MODE,ACCT_CD,PRJT_FG,GRD_NM,TEMP_AMT,PRE_STD_NO,RQST_NO
  test.skip('[no:5] 사전규격결과등록 - 저장 (setReject) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur8051/setData.do | inputCols=CORP_CD,BUSI_PLC_CD,WORK_AREA,PUR_TP,FRGN_CLS,RGST_NO,FRM_MODE,ACCT_CD,PRJT_FG,GRD_NM,TEMP_AMT,PRE_STD_NO,RQST_NO
  test.skip('[no:6] 사전규격결과등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('업체관리 (pur_9999m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_9999m' OR MNU_NM LIKE '업체관리%'
  const MENU_ID = 'TODO_pur_9999m';
  const API_URL = '/mis/pur/pur9999/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_CUST_NM', 'SCH_PERM_YN', 'SCH_CUST_CD', 'STDR_AMT', 'SCH_LIST_CUST_CD', 'Column1'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/pur/pur9999/getList.do | inputCols=SCH_STDR_YY,SCH_CUST_NM,SCH_PERM_YN,SCH_CUST_CD,STDR_AMT,SCH_LIST_CUST_CD,Column1
  test.skip('[no:1] 업체관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/pur/pur9999/setData.do | inputCols=SCH_STDR_YY,SCH_CUST_NM,SCH_PERM_YN,SCH_CUST_CD,STDR_AMT,SCH_LIST_CUST_CD,Column1
  test.skip('[no:2] 업체관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

