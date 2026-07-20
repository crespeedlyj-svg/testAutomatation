// ==============================================================
// ASS(자산관리) 모듈 배치 단위 테스트 — 생성일 2026-06-28
// 입력: _workspace/ass/01_scenarios.json (unit 105건 / integ 5건)
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


test.describe('자산등록현황 (ass_0110M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0110M' OR MNU_NM LIKE '자산등록현황%'
  const MENU_ID = 'TODO_ass_0110M';
  const API_URL = '/mis/ass/ass0110/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_SRCH_DT', 'FRM_DT', 'TO_DT', 'SEARCHKEY', 'KEYWORD', 'PUR_CONT_NO', 'AST_REG_YN', 'AST_ACQ_STAT', 'REG_CLS', 'RQST_DEPT_NM', 'RQST_DEPT_CD', 'ROLE_YN', 'DEPT_CHIF_YN', 'OUT_MNG_YN', 'ASS_ACCT_YN', 'FRM_AMT', 'TO_AMT', 'AST_CLS_NM', 'AST_CLS_CD', 'THNG_MNG_NO', 'THNG_MNG_SEQ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0110/getList.do | inputCols=SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_SRCH_DT,FRM_DT,TO_DT,SEARCHKEY,KEYWORD,PUR_CONT_NO,AST_REG_YN,AST_ACQ_STAT,REG_CLS,RQST_DEPT_NM,RQST_DEPT_CD,ROLE_YN,DEPT_CHIF_YN,OUT_MNG_YN,ASS_ACCT_YN,FRM_AMT,TO_AMT,AST_CLS_NM,AST_CLS_CD,THNG_MNG_NO,THNG_MNG_SEQ
  test.skip('[no:1] 자산등록현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0110/setAstUpData.do | inputCols=SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_SRCH_DT,FRM_DT,TO_DT,SEARCHKEY,KEYWORD,PUR_CONT_NO,AST_REG_YN,AST_ACQ_STAT,REG_CLS,RQST_DEPT_NM,RQST_DEPT_CD,ROLE_YN,DEPT_CHIF_YN,OUT_MNG_YN,ASS_ACCT_YN,FRM_AMT,TO_AMT,AST_CLS_NM,AST_CLS_CD,THNG_MNG_NO,THNG_MNG_SEQ
  test.skip('[no:2] 자산등록현황 - 저장 (setAstUpData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0110/getAbsbYn.do | inputCols=SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_SRCH_DT,FRM_DT,TO_DT,SEARCHKEY,KEYWORD,PUR_CONT_NO,AST_REG_YN,AST_ACQ_STAT,REG_CLS,RQST_DEPT_NM,RQST_DEPT_CD,ROLE_YN,DEPT_CHIF_YN,OUT_MNG_YN,ASS_ACCT_YN,FRM_AMT,TO_AMT,AST_CLS_NM,AST_CLS_CD,THNG_MNG_NO,THNG_MNG_SEQ
  test.skip('[no:3] 자산등록현황 - 조회 (getAbsbYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산등록 (ass_0111M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0111M' OR MNU_NM LIKE '자산등록%'
  const MENU_ID = 'TODO_ass_0111M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'REG_CLS', 'CTRCT_NO', 'CTRCT_SEQ', 'THNG_MNG_NO', 'THNG_MNG_SEQ', 'RQST_NO', 'SEQ', 'RESL_DT', 'AST_MNG_CD', 'AST_ACQ_STAT', 'PUR_CONT_NO', 'AST_USER_DEPT_CD', 'PMS_CNTC_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,REG_CLS,CTRCT_NO,CTRCT_SEQ,THNG_MNG_NO,THNG_MNG_SEQ,RQST_NO,SEQ,RESL_DT,AST_MNG_CD,AST_ACQ_STAT,PUR_CONT_NO,AST_USER_DEPT_CD,PMS_CNTC_NO
  test.skip('[no:1] 자산등록 - 조회 (getCode) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getBusiPlc.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,REG_CLS,CTRCT_NO,CTRCT_SEQ,THNG_MNG_NO,THNG_MNG_SEQ,RQST_NO,SEQ,RESL_DT,AST_MNG_CD,AST_ACQ_STAT,PUR_CONT_NO,AST_USER_DEPT_CD,PMS_CNTC_NO
  test.skip('[no:2] 자산등록 - 조회 (getbusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0111/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,REG_CLS,CTRCT_NO,CTRCT_SEQ,THNG_MNG_NO,THNG_MNG_SEQ,RQST_NO,SEQ,RESL_DT,AST_MNG_CD,AST_ACQ_STAT,PUR_CONT_NO,AST_USER_DEPT_CD,PMS_CNTC_NO
  test.skip('[no:3] 자산등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0111/getMngInfo.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,REG_CLS,CTRCT_NO,CTRCT_SEQ,THNG_MNG_NO,THNG_MNG_SEQ,RQST_NO,SEQ,RESL_DT,AST_MNG_CD,AST_ACQ_STAT,PUR_CONT_NO,AST_USER_DEPT_CD,PMS_CNTC_NO
  test.skip('[no:4] 자산등록 - 조회 (getMngInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0111/setDelSave.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,FRGN_CLS,AST_MNG_CD,PUR_CONT_NO,THNG_MNG_NO,THNG_MNG_SEQ,THNG_SEQ,THNG_NM,ACT_UNIT_CD,AST_CLS_CD,AST_CLS_NM,B_AST_CLS_CD,B_AST_CLS_NM,G_AST_CLS_CD,G_AST_CLS_NM,M_AST_CLS_CD,M_AST_CLS_NM,S_AST_CLS_CD,S_AST_CLS_NM,UPP_AST_MNG_CD,UPP_AST_MNG_NM,CTRCT_CUST_CD,CTRCT_CUST_NM,AST_CD,AST_NM,AST_ENG_NM,STD,DTL_STD,MODEL_NM,USE_NM,AST_STAT,REG_TP,ACQ_CLS,ACQ_DT,ACQ_QTY,ACQ_UNT,ACQ_UNT_NM,ACQ_AMT,AST_MNGR_EMP_NO,AST_MNGR_EMP_NM,AST_MNGR_DEPT_CD,AST_MNGR_DEPT_NM,AST_USER_EMP_NO,AST_USER_EMP_NM,AST_USER_DEPT_CD,AST_USER_DEPT_NM,DHRM_CD,DHRM_NM,UP_DEPR_OBJ_YN,RVLTN_AMT,TOT_INC_DEC_AMT,DEPR_OBJ_YN,DEPR_CLS,DRBL_YEARS,DEPR_RATE,DEPR_STAT,DEPR_AMT,UNDEPR_AMT,SALVAGE_VAL,PUR_CONT_NO,CTRCT_NO,CTRCT_SEQ,CTRCT_FRM_DT,CTRCT_TO_DT,CHEAP_RQST_NO,SEQ,SW_YN,RSCH_EQMT_YN,DISUSE_DT,USE_CLS,AST_ACCT_CD,AST_ACCT_NM,ACT_USE_YN,RMK,DIV_QTY,AST_ACQ_STAT,DEPR_YN,REG_CLS,MAKER,MAKE_NTN_CD,MAKE_NTN_NM,LAST_EXMNT_DT,CHK_DT,CTRCT_DEG,THNG_AMT,THNG_AMT_FRGN,THNG_VAT_AMT,ORG_ACQ_AMT,PUR_TP,NTN_AMT,RQST_NO,RGD_TRGT_YN,THNG_ADD_AMT,THNG_VAT,THNG_SPLY_VAL,THNG_AMT_TOT,EXMNT_EMP_NO,EXMNT_EMP_NM,SND_INSU_YN,CURR_UNIT,USE,EQPT_KND,EQPT_FG,CTRCT_AMT,FNRS_FG,HIDDEN_AST_YN,CUST_YN,PMS_CNTC_NO,FCTY_CT_FG,UPP_AST_CLS_CD
  test.skip('[no:5] 자산등록 - 저장 (setDelSave) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0111/setSave.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,REG_CLS,CTRCT_NO,CTRCT_SEQ,THNG_MNG_NO,THNG_MNG_SEQ,RQST_NO,SEQ,RESL_DT,AST_MNG_CD,AST_ACQ_STAT,PUR_CONT_NO,AST_USER_DEPT_CD,PMS_CNTC_NO
  test.skip('[no:6] 자산등록 - 저장 (setSave) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0111/getPlaceList.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,FRGN_CLS,AST_MNG_CD,PUR_CONT_NO,THNG_MNG_NO,THNG_MNG_SEQ,THNG_SEQ,THNG_NM,ACT_UNIT_CD,AST_CLS_CD,AST_CLS_NM,B_AST_CLS_CD,B_AST_CLS_NM,G_AST_CLS_CD,G_AST_CLS_NM,M_AST_CLS_CD,M_AST_CLS_NM,S_AST_CLS_CD,S_AST_CLS_NM,UPP_AST_MNG_CD,UPP_AST_MNG_NM,CTRCT_CUST_CD,CTRCT_CUST_NM,AST_CD,AST_NM,AST_ENG_NM,STD,DTL_STD,MODEL_NM,USE_NM,AST_STAT,REG_TP,ACQ_CLS,ACQ_DT,ACQ_QTY,ACQ_UNT,ACQ_UNT_NM,ACQ_AMT,AST_MNGR_EMP_NO,AST_MNGR_EMP_NM,AST_MNGR_DEPT_CD,AST_MNGR_DEPT_NM,AST_USER_EMP_NO,AST_USER_EMP_NM,AST_USER_DEPT_CD,AST_USER_DEPT_NM,DHRM_CD,DHRM_NM,UP_DEPR_OBJ_YN,RVLTN_AMT,TOT_INC_DEC_AMT,DEPR_OBJ_YN,DEPR_CLS,DRBL_YEARS,DEPR_RATE,DEPR_STAT,DEPR_AMT,UNDEPR_AMT,SALVAGE_VAL,PUR_CONT_NO,CTRCT_NO,CTRCT_SEQ,CTRCT_FRM_DT,CTRCT_TO_DT,CHEAP_RQST_NO,SEQ,SW_YN,RSCH_EQMT_YN,DISUSE_DT,USE_CLS,AST_ACCT_CD,AST_ACCT_NM,ACT_USE_YN,RMK,DIV_QTY,AST_ACQ_STAT,DEPR_YN,REG_CLS,MAKER,MAKE_NTN_CD,MAKE_NTN_NM,LAST_EXMNT_DT,CHK_DT,CTRCT_DEG,THNG_AMT,THNG_AMT_FRGN,THNG_VAT_AMT,ORG_ACQ_AMT,PUR_TP,NTN_AMT,RQST_NO,RGD_TRGT_YN,THNG_ADD_AMT,THNG_VAT,THNG_SPLY_VAL,THNG_AMT_TOT,EXMNT_EMP_NO,EXMNT_EMP_NM,SND_INSU_YN,CURR_UNIT,USE,EQPT_KND,EQPT_FG,CTRCT_AMT,FNRS_FG,HIDDEN_AST_YN,CUST_YN,PMS_CNTC_NO,FCTY_CT_FG,UPP_AST_CLS_CD
  test.skip('[no:7] 자산등록 - 조회 (getPlaceList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0111/getNtnList.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,FRGN_CLS,AST_MNG_CD,PUR_CONT_NO,THNG_MNG_NO,THNG_MNG_SEQ,THNG_SEQ,THNG_NM,ACT_UNIT_CD,AST_CLS_CD,AST_CLS_NM,B_AST_CLS_CD,B_AST_CLS_NM,G_AST_CLS_CD,G_AST_CLS_NM,M_AST_CLS_CD,M_AST_CLS_NM,S_AST_CLS_CD,S_AST_CLS_NM,UPP_AST_MNG_CD,UPP_AST_MNG_NM,CTRCT_CUST_CD,CTRCT_CUST_NM,AST_CD,AST_NM,AST_ENG_NM,STD,DTL_STD,MODEL_NM,USE_NM,AST_STAT,REG_TP,ACQ_CLS,ACQ_DT,ACQ_QTY,ACQ_UNT,ACQ_UNT_NM,ACQ_AMT,AST_MNGR_EMP_NO,AST_MNGR_EMP_NM,AST_MNGR_DEPT_CD,AST_MNGR_DEPT_NM,AST_USER_EMP_NO,AST_USER_EMP_NM,AST_USER_DEPT_CD,AST_USER_DEPT_NM,DHRM_CD,DHRM_NM,UP_DEPR_OBJ_YN,RVLTN_AMT,TOT_INC_DEC_AMT,DEPR_OBJ_YN,DEPR_CLS,DRBL_YEARS,DEPR_RATE,DEPR_STAT,DEPR_AMT,UNDEPR_AMT,SALVAGE_VAL,PUR_CONT_NO,CTRCT_NO,CTRCT_SEQ,CTRCT_FRM_DT,CTRCT_TO_DT,CHEAP_RQST_NO,SEQ,SW_YN,RSCH_EQMT_YN,DISUSE_DT,USE_CLS,AST_ACCT_CD,AST_ACCT_NM,ACT_USE_YN,RMK,DIV_QTY,AST_ACQ_STAT,DEPR_YN,REG_CLS,MAKER,MAKE_NTN_CD,MAKE_NTN_NM,LAST_EXMNT_DT,CHK_DT,CTRCT_DEG,THNG_AMT,THNG_AMT_FRGN,THNG_VAT_AMT,ORG_ACQ_AMT,PUR_TP,NTN_AMT,RQST_NO,RGD_TRGT_YN,THNG_ADD_AMT,THNG_VAT,THNG_SPLY_VAL,THNG_AMT_TOT,EXMNT_EMP_NO,EXMNT_EMP_NM,SND_INSU_YN,CURR_UNIT,USE,EQPT_KND,EQPT_FG,CTRCT_AMT,FNRS_FG,HIDDEN_AST_YN,CUST_YN,PMS_CNTC_NO,FCTY_CT_FG,UPP_AST_CLS_CD
  test.skip('[no:8] 자산등록 - 조회 (getNtnList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산등록(병합) (ass_0112M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0112M' OR MNU_NM LIKE '자산등록(병합)%'
  const MENU_ID = 'TODO_ass_0112M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'REG_CLS', 'CTRCT_NO', 'CTRCT_SEQ', 'THNG_MNG_NO', 'THNG_MNG_SEQ', 'RQST_NO', 'SEQ', 'RESL_DT', 'AST_MNG_CD', 'AST_ACQ_STAT', 'PUR_CONT_NO', 'AST_USER_DEPT_CD', 'IS_NEW', 'PMS_CNTC_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,REG_CLS,CTRCT_NO,CTRCT_SEQ,THNG_MNG_NO,THNG_MNG_SEQ,RQST_NO,SEQ,RESL_DT,AST_MNG_CD,AST_ACQ_STAT,PUR_CONT_NO,AST_USER_DEPT_CD,IS_NEW,PMS_CNTC_NO
  test.skip('[no:1] 자산등록(병합) - 조회 (getCode) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0112/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,REG_CLS,CTRCT_NO,CTRCT_SEQ,THNG_MNG_NO,THNG_MNG_SEQ,RQST_NO,SEQ,RESL_DT,AST_MNG_CD,AST_ACQ_STAT,PUR_CONT_NO,AST_USER_DEPT_CD,IS_NEW,PMS_CNTC_NO
  test.skip('[no:2] 자산등록(병합) - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0112/getMngInfo.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,REG_CLS,CTRCT_NO,CTRCT_SEQ,THNG_MNG_NO,THNG_MNG_SEQ,RQST_NO,SEQ,RESL_DT,AST_MNG_CD,AST_ACQ_STAT,PUR_CONT_NO,AST_USER_DEPT_CD,IS_NEW,PMS_CNTC_NO
  test.skip('[no:3] 자산등록(병합) - 조회 (getMngInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0112/setDelSave.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,FRGN_CLS,AST_MNG_CD,PUR_CONT_NO,THNG_MNG_NO,THNG_MNG_SEQ,THNG_SEQ,THNG_NM,ACT_UNIT_CD,AST_CLS_CD,AST_CLS_NM,B_AST_CLS_CD,B_AST_CLS_NM,G_AST_CLS_CD,G_AST_CLS_NM,M_AST_CLS_CD,M_AST_CLS_NM,S_AST_CLS_CD,S_AST_CLS_NM,UPP_AST_MNG_CD,UPP_AST_MNG_NM,CTRCT_CUST_CD,CTRCT_CUST_NM,AST_CD,AST_NM,AST_ENG_NM,STD,DTL_STD,MODEL_NM,USE_NM,AST_STAT,REG_TP,ACQ_CLS,ACQ_DT,ACQ_QTY,ACQ_UNT,ACQ_UNT_NM,ACQ_AMT,AST_MNGR_EMP_NO,AST_MNGR_EMP_NM,AST_MNGR_DEPT_CD,AST_MNGR_DEPT_NM,AST_USER_EMP_NO,AST_USER_EMP_NM,AST_USER_DEPT_CD,AST_USER_DEPT_NM,DHRM_CD,DHRM_NM,UP_DEPR_OBJ_YN,RVLTN_AMT,TOT_INC_DEC_AMT,DEPR_OBJ_YN,DEPR_CLS,DRBL_YEARS,DEPR_RATE,DEPR_STAT,DEPR_AMT,UNDEPR_AMT,SALVAGE_VAL,Column62,CTRCT_NO,CTRCT_SEQ,CTRCT_FRM_DT,CTRCT_TO_DT,CHEAP_RQST_NO,SEQ,SW_YN,RSCH_EQMT_YN,DISUSE_DT,USE_CLS,AST_ACCT_CD,AST_ACCT_NM,ACT_USE_YN,RMK,DIV_QTY,AST_ACQ_STAT,DEPR_YN,REG_CLS,MAKER,MAKE_NTN_CD,MAKE_NTN_NM,LAST_EXMNT_DT,CHK_DT,CTRCT_DEG,THNG_AMT,THNG_AMT_FRGN,THNG_VAT_AMT,ORG_ACQ_AMT,PUR_TP,NTN_AMT,RQST_NO,RGD_TRGT_YN,THNG_ADD_AMT,THNG_VAT,THNG_SPLY_VAL,THNG_AMT_TOT,EXMNT_EMP_NO,EXMNT_EMP_NM,SND_INSU_YN,CURR_UNIT,USE,EQPT_KND,EQPT_FG,CTRCT_AMT,CHK_CRR_YN,HST_CHG_YN,FNRS_FG,HIDDEN_AST_YN,FCTY_CT_FG
  test.skip('[no:4] 자산등록(병합) - 저장 (setDelSave) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0112/setSave.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,REG_CLS,CTRCT_NO,CTRCT_SEQ,THNG_MNG_NO,THNG_MNG_SEQ,RQST_NO,SEQ,RESL_DT,AST_MNG_CD,AST_ACQ_STAT,PUR_CONT_NO,AST_USER_DEPT_CD,IS_NEW,PMS_CNTC_NO
  test.skip('[no:5] 자산등록(병합) - 저장 (setSave) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0111/getPlaceList.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,FRGN_CLS,AST_MNG_CD,PUR_CONT_NO,THNG_MNG_NO,THNG_MNG_SEQ,THNG_SEQ,THNG_NM,ACT_UNIT_CD,AST_CLS_CD,AST_CLS_NM,B_AST_CLS_CD,B_AST_CLS_NM,G_AST_CLS_CD,G_AST_CLS_NM,M_AST_CLS_CD,M_AST_CLS_NM,S_AST_CLS_CD,S_AST_CLS_NM,UPP_AST_MNG_CD,UPP_AST_MNG_NM,CTRCT_CUST_CD,CTRCT_CUST_NM,AST_CD,AST_NM,AST_ENG_NM,STD,DTL_STD,MODEL_NM,USE_NM,AST_STAT,REG_TP,ACQ_CLS,ACQ_DT,ACQ_QTY,ACQ_UNT,ACQ_UNT_NM,ACQ_AMT,AST_MNGR_EMP_NO,AST_MNGR_EMP_NM,AST_MNGR_DEPT_CD,AST_MNGR_DEPT_NM,AST_USER_EMP_NO,AST_USER_EMP_NM,AST_USER_DEPT_CD,AST_USER_DEPT_NM,DHRM_CD,DHRM_NM,UP_DEPR_OBJ_YN,RVLTN_AMT,TOT_INC_DEC_AMT,DEPR_OBJ_YN,DEPR_CLS,DRBL_YEARS,DEPR_RATE,DEPR_STAT,DEPR_AMT,UNDEPR_AMT,SALVAGE_VAL,Column62,CTRCT_NO,CTRCT_SEQ,CTRCT_FRM_DT,CTRCT_TO_DT,CHEAP_RQST_NO,SEQ,SW_YN,RSCH_EQMT_YN,DISUSE_DT,USE_CLS,AST_ACCT_CD,AST_ACCT_NM,ACT_USE_YN,RMK,DIV_QTY,AST_ACQ_STAT,DEPR_YN,REG_CLS,MAKER,MAKE_NTN_CD,MAKE_NTN_NM,LAST_EXMNT_DT,CHK_DT,CTRCT_DEG,THNG_AMT,THNG_AMT_FRGN,THNG_VAT_AMT,ORG_ACQ_AMT,PUR_TP,NTN_AMT,RQST_NO,RGD_TRGT_YN,THNG_ADD_AMT,THNG_VAT,THNG_SPLY_VAL,THNG_AMT_TOT,EXMNT_EMP_NO,EXMNT_EMP_NM,SND_INSU_YN,CURR_UNIT,USE,EQPT_KND,EQPT_FG,CTRCT_AMT,CHK_CRR_YN,HST_CHG_YN,FNRS_FG,HIDDEN_AST_YN,FCTY_CT_FG
  test.skip('[no:6] 자산등록(병합) - 조회 (getPlaceList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0111/getNtnList.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,FRGN_CLS,AST_MNG_CD,PUR_CONT_NO,THNG_MNG_NO,THNG_MNG_SEQ,THNG_SEQ,THNG_NM,ACT_UNIT_CD,AST_CLS_CD,AST_CLS_NM,B_AST_CLS_CD,B_AST_CLS_NM,G_AST_CLS_CD,G_AST_CLS_NM,M_AST_CLS_CD,M_AST_CLS_NM,S_AST_CLS_CD,S_AST_CLS_NM,UPP_AST_MNG_CD,UPP_AST_MNG_NM,CTRCT_CUST_CD,CTRCT_CUST_NM,AST_CD,AST_NM,AST_ENG_NM,STD,DTL_STD,MODEL_NM,USE_NM,AST_STAT,REG_TP,ACQ_CLS,ACQ_DT,ACQ_QTY,ACQ_UNT,ACQ_UNT_NM,ACQ_AMT,AST_MNGR_EMP_NO,AST_MNGR_EMP_NM,AST_MNGR_DEPT_CD,AST_MNGR_DEPT_NM,AST_USER_EMP_NO,AST_USER_EMP_NM,AST_USER_DEPT_CD,AST_USER_DEPT_NM,DHRM_CD,DHRM_NM,UP_DEPR_OBJ_YN,RVLTN_AMT,TOT_INC_DEC_AMT,DEPR_OBJ_YN,DEPR_CLS,DRBL_YEARS,DEPR_RATE,DEPR_STAT,DEPR_AMT,UNDEPR_AMT,SALVAGE_VAL,Column62,CTRCT_NO,CTRCT_SEQ,CTRCT_FRM_DT,CTRCT_TO_DT,CHEAP_RQST_NO,SEQ,SW_YN,RSCH_EQMT_YN,DISUSE_DT,USE_CLS,AST_ACCT_CD,AST_ACCT_NM,ACT_USE_YN,RMK,DIV_QTY,AST_ACQ_STAT,DEPR_YN,REG_CLS,MAKER,MAKE_NTN_CD,MAKE_NTN_NM,LAST_EXMNT_DT,CHK_DT,CTRCT_DEG,THNG_AMT,THNG_AMT_FRGN,THNG_VAT_AMT,ORG_ACQ_AMT,PUR_TP,NTN_AMT,RQST_NO,RGD_TRGT_YN,THNG_ADD_AMT,THNG_VAT,THNG_SPLY_VAL,THNG_AMT_TOT,EXMNT_EMP_NO,EXMNT_EMP_NM,SND_INSU_YN,CURR_UNIT,USE,EQPT_KND,EQPT_FG,CTRCT_AMT,CHK_CRR_YN,HST_CHG_YN,FNRS_FG,HIDDEN_AST_YN,FCTY_CT_FG
  test.skip('[no:7] 자산등록(병합) - 조회 (getNtnList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산정보관리현황 (ass_0120M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0120M' OR MNU_NM LIKE '자산정보관리현황%'
  const MENU_ID = 'TODO_ass_0120M';
  const API_URL = '/mis/ass/ass0120/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'SCH_SRCH_DT', 'SCH_SRCH_CLS', 'FRM_DT', 'TO_DT', 'AST_USER_DEPT_NM', 'AST_USER_DEPT_CD', 'DEPT_CD', 'DEPT_NM', 'AST_USER_EMP_NM', 'AST_USER_EMP_NO', 'AST_STAT', 'KEYWORD', 'SUB_DEPT_YN', 'DEPR_OBJ_YN', 'S_ACQ_AMT', 'E_ACQ_AMT', 'AST_CLS_CD', 'AST_CLS_NM', 'AST_CD', 'AST_NM', 'AST_MNG_CD', 'ROLE_YN', 'DEPT_CHIF_YN', 'ACT_USE_YN', 'MAKE_NTN_CD', 'MAKE_NTN_NM', 'ACCT_UNT_CD', 'DATA_FG', 'RGD_TRGT_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0120/getList.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,SCH_SRCH_DT,SCH_SRCH_CLS,FRM_DT,TO_DT,AST_USER_DEPT_NM,AST_USER_DEPT_CD,DEPT_CD,DEPT_NM,AST_USER_EMP_NM,AST_USER_EMP_NO,AST_STAT,KEYWORD,SUB_DEPT_YN,DEPR_OBJ_YN,S_ACQ_AMT,E_ACQ_AMT,AST_CLS_CD,AST_CLS_NM,AST_CD,AST_NM,AST_MNG_CD,ROLE_YN,DEPT_CHIF_YN,ACT_USE_YN,MAKE_NTN_CD,MAKE_NTN_NM,ACCT_UNT_CD,DATA_FG,RGD_TRGT_YN
  test.skip('[no:1] 자산정보관리현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0120/getRfidTag.do | inputCols=AST_MNG_CD,AST_CLS_NM,G_AST_CLS_NM,M_AST_CLS_NM,S_AST_CLS_NM,CTRCT_CUST_CD,CTRCT_CUST_NM,AST_CD,AST_NM,ACQ_DT,ACQ_AMT,TOT_ACQ_AMT,DEPR_OBJ_YN,DEPR_CLS,DEPR_CLS_NM,DRBL_YEARS,UNDEPR_AMT,TOT_INC_DEC_AMT,AST_STAT,AST_STAT_NM,ACQ_QTY,ACQ_CLS,AST_USER_EMP_NO,AST_USER_EMP_NM,AST_USER_DEPT_CD,AST_USER_DEPT_NM,AST_MNGR_EMP_NO,AST_MNGR_EMP_NM,AST_MNGR_DEPT_CD,AST_MNGR_DEPT_NM,PUR_CONT_NO,CHEAP_RQST_NO,ACCT_UNT_CD,ACCT_UNT_NM,BUDG_YY,BUDG_FG,BUDG_DEPT_CD,BUDG_DEPT_NM,BUDG_ITSR_CD,BUDG_ITSR_NM,BUDG_LITM_NM,PUR_BUDG_AMT,AST_ACCT_CD,ACCT_NM,DHRM_CD,DHRM_NM,MODEL_NM,STD,RMK,MAKER,UP_AST_CD,UP_AST_MNG_CD,UP_AST_NM,FRGN_CLS,CURR_UNIT,EXCHNG_RATE,REG_CLS,ACT_USE_YN,RQST_NOS,DISUSE_MTHD,DISUSE_DT,AST_SALE_AMT,NTN_AMT,RSPRJ_CD,isChecked,RGD_TRGT_YN,TAXT_TASP_FG,TAXT_TASP_FG_NM,FNRS_FG,FNRS_FG_NM,COPE_PRUE_PPS,COPE_PRUE_PPS_NM,UPP_AST_CLS_NM,DEPT_YN,cssclassid
  test.skip('[no:2] 자산정보관리현황 - 조회 (getRfidTag) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산정보관리 (ass_0121M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0121M' OR MNU_NM LIKE '자산정보관리%'
  const MENU_ID = 'TODO_ass_0121M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'AST_MNG_CD', 'AST_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,AST_MNG_CD,AST_CD
  test.skip('[no:1] 자산정보관리 - 조회 (getCode) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0121/getData.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,AST_MNG_CD,AST_CD
  test.skip('[no:2] 자산정보관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0121/setDelSave.do | inputCols=CORP_CD,BUSI_PLC_CD,BUSI_PLC_NM,WRK_AREA,AST_MNG_CD,AST_CD
  test.skip('[no:3] 자산정보관리 - 저장 (setDelSave) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0121/getEmpData.do | inputCols=WRK_AREA,AST_MNG_CD,CORP_CD,BUSI_PLC_NM,BUSI_PLC_CD,ACCT_UNT_CD,ACCT_UNT_NM,UPP_AST_CD,UPP_AST_NM,AST_CD,AST_NM,AST_ENG_NM,UPP_AST_MNG_CD,UPP_AST_MNG_NM,AST_CLS_CD,AST_CLS_NM,G_AST_CLS_CD,M_AST_CLS_CD,S_AST_CLS_CD,G_AST_CLS_NM,M_AST_CLS_NM,S_AST_CLS_NM,FRGN_CLS,STD,DTL_STD,MODEL_NM,USE,AST_STAT,REG_TP,USE_CLS,ACQ_CLS,ACQ_DT,ACQ_QTY,ACQ_UNT,ACQ_AMT,TOT_ACQ_AMT,CURR_UNIT,AST_MNGR_EMP_NO,AST_MNGR_EMP_NM,AST_MNGR_DEPT_CD,AST_MNGR_DEPT_NM,AST_USER_EMP_NO,AST_USER_EMP_NM,AST_USER_DEPT_CD,AST_USER_DEPT_NM,UPP_DEPR_OBJ_YN,RVLTN_AMT,DHRM_CD,DHRM_NM,DEPR_OBJ_YN,DEPR_CLS,DRBL_YEARS,DEPR_RATE,DEPR_AMT,UNDEPR_AMT,SALVAGE_VAL,DEPR_STAT,CHEAP_RQST_NO,CTRCT_NO,PUR_CONT_NO,THNG_MNG_NO,THNG_MNG_SEQ,SW_YN,RSCH_EQMT_YN,NTIS_REG_OBJ_YN,MAKE_NTN_CD,MAKE_NTN_NM,MAKER,AST_ACCT_CD,ACT_USE_YN,BARCD_PRNT_DT,BARCD_PRNT_YN,DISUSE_DT,AST_SALE_AMT,RMK,EQUIP_ID,TOT_INC_DEC_AMT,HIDDEN_AST_YN,CHK_DT,HST_CHG_YN,CUR_AST_STAT_CD,USE_CLS_0,DEPR_YN,CTRCT_CUST_CD,CTRCT_CUST_NM,CTRCT_CUST_CD_TMP,CTRCT_CUST_NM_TMP,REG_NO_TMP,REG_NO,REG_YN,HST_CHG_RSN,NTN_AMT,NTIS_REG_NO,BUILD_CLS_CD,BUILD_CLS_NM,FILE_PATH,FILE_TP,RGD_TRGT_YN,EQPT_FG,SND_INSU_YN,EQPT_KND,ETUBE_NO,ACQ_ADAMT,ACQ_VAT,ACQ_SPLY_VAL,ACQ_AMT_FRGN,CUST_YN,FNRS_FG,COPE_PRUE_PPS,FCTY_CT_FG,UPP_AST_CLS_CD
  test.skip('[no:4] 자산정보관리 - 조회 (getEmpData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0121/setSave.do | inputCols=WRK_AREA,AST_MNG_CD,CORP_CD,BUSI_PLC_NM,BUSI_PLC_CD,ACCT_UNT_CD,ACCT_UNT_NM,UPP_AST_CD,UPP_AST_NM,AST_CD,AST_NM,AST_ENG_NM,UPP_AST_MNG_CD,UPP_AST_MNG_NM,AST_CLS_CD,AST_CLS_NM,G_AST_CLS_CD,M_AST_CLS_CD,S_AST_CLS_CD,G_AST_CLS_NM,M_AST_CLS_NM,S_AST_CLS_NM,FRGN_CLS,STD,DTL_STD,MODEL_NM,USE,AST_STAT,REG_TP,USE_CLS,ACQ_CLS,ACQ_DT,ACQ_QTY,ACQ_UNT,ACQ_AMT,TOT_ACQ_AMT,CURR_UNIT,AST_MNGR_EMP_NO,AST_MNGR_EMP_NM,AST_MNGR_DEPT_CD,AST_MNGR_DEPT_NM,AST_USER_EMP_NO,AST_USER_EMP_NM,AST_USER_DEPT_CD,AST_USER_DEPT_NM,UPP_DEPR_OBJ_YN,RVLTN_AMT,DHRM_CD,DHRM_NM,DEPR_OBJ_YN,DEPR_CLS,DRBL_YEARS,DEPR_RATE,DEPR_AMT,UNDEPR_AMT,SALVAGE_VAL,DEPR_STAT,CHEAP_RQST_NO,CTRCT_NO,PUR_CONT_NO,THNG_MNG_NO,THNG_MNG_SEQ,SW_YN,RSCH_EQMT_YN,NTIS_REG_OBJ_YN,MAKE_NTN_CD,MAKE_NTN_NM,MAKER,AST_ACCT_CD,ACT_USE_YN,BARCD_PRNT_DT,BARCD_PRNT_YN,DISUSE_DT,AST_SALE_AMT,RMK,EQUIP_ID,TOT_INC_DEC_AMT,HIDDEN_AST_YN,CHK_DT,HST_CHG_YN,CUR_AST_STAT_CD,USE_CLS_0,DEPR_YN,CTRCT_CUST_CD,CTRCT_CUST_NM,CTRCT_CUST_CD_TMP,CTRCT_CUST_NM_TMP,REG_NO_TMP,REG_NO,REG_YN,HST_CHG_RSN,NTN_AMT,NTIS_REG_NO,BUILD_CLS_CD,BUILD_CLS_NM,FILE_PATH,FILE_TP,RGD_TRGT_YN,EQPT_FG,SND_INSU_YN,EQPT_KND,ETUBE_NO,ACQ_ADAMT,ACQ_VAT,ACQ_SPLY_VAL,ACQ_AMT_FRGN,CUST_YN,FNRS_FG,COPE_PRUE_PPS,FCTY_CT_FG,UPP_AST_CLS_CD
  test.skip('[no:5] 자산정보관리 - 저장 (setSave) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산이력변경현황 (ass_0210M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0210M' OR MNU_NM LIKE '자산이력변경현황%'
  const MENU_ID = 'TODO_ass_0210M';
  const API_URL = '/mis/ass/ass0210/getAssetList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SRCH_DT', 'FRM_DT', 'TO_DT', 'AST_MNGR_DEPT_NM', 'AST_MNGR_DEPT_CD', 'DEPT_CD', 'DEPT_NM', 'SUB_DEPT_YN', 'AST_STAT', 'DHRM_NM', 'DHRM_CD', 'AST_MNGR_EMP_NM', 'AST_MNGR_EMP_NO', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'AST_CLS_CD', 'AST_CLS_NM', 'ALL_YN', 'AST_HST_CLS', 'AST_USER_EMP_NO', 'AST_USER_EMP_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0210/getAssetList.do | inputCols=SCH_SRCH_DT,FRM_DT,TO_DT,AST_MNGR_DEPT_NM,AST_MNGR_DEPT_CD,DEPT_CD,DEPT_NM,SUB_DEPT_YN,AST_STAT,DHRM_NM,DHRM_CD,AST_MNGR_EMP_NM,AST_MNGR_EMP_NO,SCH_SRCH_CLS,SCH_SRCH_KEY,AST_CLS_CD,AST_CLS_NM,ALL_YN,AST_HST_CLS,AST_USER_EMP_NO,AST_USER_EMP_NM
  test.skip('[no:1] 자산이력변경현황 - 조회 (getAssetList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0210/getHstList.do | inputCols=SCH_SRCH_DT,FRM_DT,TO_DT,AST_MNGR_DEPT_NM,AST_MNGR_DEPT_CD,DEPT_CD,DEPT_NM,SUB_DEPT_YN,AST_STAT,DHRM_NM,DHRM_CD,AST_MNGR_EMP_NM,AST_MNGR_EMP_NO,SCH_SRCH_CLS,SCH_SRCH_KEY,AST_CLS_CD,AST_CLS_NM,ALL_YN,AST_HST_CLS,AST_USER_EMP_NO,AST_USER_EMP_NM
  test.skip('[no:2] 자산이력변경현황 - 조회 (getHstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0210/setAllHist.do | inputCols=-
  test.skip('[no:3] 자산이력변경현황 - 저장 (setAllHist) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산이력변경 (ass_0211M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0211M' OR MNU_NM LIKE '자산이력변경%'
  const MENU_ID = 'TODO_ass_0211M';
  const API_URL = '/mis/ass/ass0211/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['AST_MNG_CD', 'HST_SEQ', 'HST_CHG_MNG_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0211/getData.do | inputCols=AST_MNG_CD,HST_SEQ,HST_CHG_MNG_NO
  test.skip('[no:1] 자산이력변경 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0211/getPurBudg.do | inputCols=isChecked,tmHeader,AST_ACQ_STAT,PUR_CONT_NO,PUR_SEQ,CTRCT_NO,CTRCT_SEQ,CHEAP_RQST_NO,SEQ,AST_REG_YN,ITEM_MNG_NO,ITEM_MNG_SEQ,REG_CLS,FRGN_CLS,CHK_DT,RMK
  test.skip('[no:2] 자산이력변경 - 조회 (getBudg) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0211/setData.do | inputCols=AST_MNG_CD,HST_SEQ,AST_CD,AST_STAT,AST_HST_CLS,HST_CHG_DT,HST_CHG_EMP_NO,HST_CHG_RSN,INC_DEC_AMT,RVLTN_AMT,AST_SALE_AMT,DISUSE_DT,DISUSE_MTHD,DISUSE_QTY,DISUSE_ORG,DISUSE_RSN,HST_CHG_MNG_NO,AST_RQST_NO,AST_RQST_SEQ,AST_MNGR_EMP_NO,AST_MNGR_EMP_NM,AST_MNGR_DEPT_CD,AST_MNGR_DEPT_NM,AST_USER_EMP_NO,AST_USER_EMP_NM,AST_USER_DEPT_CD,AST_USER_DEPT_NM,DHRM_CD,DHRM_NM,RMK,CHK_DT,DISUSE_CONT
  test.skip('[no:3] 자산이력변경 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0211/getEmpData.do | inputCols=AST_MNG_CD,HST_SEQ,AST_CD,AST_STAT,AST_HST_CLS,HST_CHG_DT,HST_CHG_EMP_NO,HST_CHG_RSN,INC_DEC_AMT,RVLTN_AMT,AST_SALE_AMT,DISUSE_DT,DISUSE_MTHD,DISUSE_QTY,DISUSE_ORG,DISUSE_RSN,HST_CHG_MNG_NO,AST_RQST_NO,AST_RQST_SEQ,AST_MNGR_EMP_NO,AST_MNGR_EMP_NM,AST_MNGR_DEPT_CD,AST_MNGR_DEPT_NM,AST_USER_EMP_NO,AST_USER_EMP_NM,AST_USER_DEPT_CD,AST_USER_DEPT_NM,DHRM_CD,DHRM_NM,RMK,CHK_DT,DISUSE_CONT
  test.skip('[no:4] 자산이력변경 - 조회 (getEmpData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산이동신청현황 (ass_0220M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0220M' OR MNU_NM LIKE '자산이동신청현황%'
  const MENU_ID = 'TODO_ass_0220M';
  const API_URL = '/mis/ass/ass0220/getChgRqstList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_DT', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'APV_STAT_CD', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_TKOVR_EMP_NO', 'SCH_TKOVR_EMP_NM', 'SCH_TKOVR_DEPT_CD', 'SCH_TKOVR_DEPT_NM', 'SCH_RCV_EMP_NO', 'SCH_RCV_EMP_NM', 'SCH_RCV_DEPT_CD', 'SCH_RCV_DEPT_NM', 'RQST_NO', 'SRCH_KEY', 'SRCH_CLS', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_AST_CLS_NM', 'SCH_AST_CLS_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0220/getChgRqstList.do | inputCols=SCH_DT,SCH_RQST_SDT,SCH_RQST_EDT,APV_STAT_CD,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_TKOVR_EMP_NO,SCH_TKOVR_EMP_NM,SCH_TKOVR_DEPT_CD,SCH_TKOVR_DEPT_NM,SCH_RCV_EMP_NO,SCH_RCV_EMP_NM,SCH_RCV_DEPT_CD,SCH_RCV_DEPT_NM,RQST_NO,SRCH_KEY,SRCH_CLS,ROLE_YN,DEPT_CHIF_YN,SCH_AST_CLS_NM,SCH_AST_CLS_CD
  test.skip('[no:1] 자산이동신청현황 - 조회 (getChgRqstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산이동신청 (ass_0221M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0221M' OR MNU_NM LIKE '자산이동신청%'
  const MENU_ID = 'TODO_ass_0221M';
  const API_URL = '/mis/ass/ass0221/getChgData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APV_STAT_NM', 'APV_STAT_CD', 'TKOVR_DT', 'TKOVR_EMP_NO', 'TKOVR_EMP_NM', 'RCV_EMP_NO', 'RCV_EMP_NM', 'TKOVR_DEPT_CD', 'TKOVR_DEPT_NM', 'RCV_DEPT_CD', 'RCV_DEPT_NM', 'TKOVR_MNG_EMP_NO', 'TKOVR_MNG_EMP_NM', 'RCV_MNG_EMP_NO', 'RCV_MNG_EMP_NM', 'RCV_MNG_DEPT_CD', 'RCV_MNG_DEPT_NM', 'TKOVR_RSN', 'CHK_DT', 'APP_YN', 'PLC_NM', 'PLC_CD', 'AST_RCPT_EMP_NO', 'RQST_TITLE', 'AST_RCPT_DT', 'INS_ID', 'UPT_DE', 'CHG_BSS', 'MOVT_DMND_DT', 'DHRM_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0221/getChgData.do | inputCols=RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_NM,APV_STAT_CD,TKOVR_DT,TKOVR_EMP_NO,TKOVR_EMP_NM,RCV_EMP_NO,RCV_EMP_NM,TKOVR_DEPT_CD,TKOVR_DEPT_NM,RCV_DEPT_CD,RCV_DEPT_NM,TKOVR_MNG_EMP_NO,TKOVR_MNG_EMP_NM,RCV_MNG_EMP_NO,RCV_MNG_EMP_NM,RCV_MNG_DEPT_CD,RCV_MNG_DEPT_NM,TKOVR_RSN,CHK_DT,APP_YN,PLC_NM,PLC_CD,AST_RCPT_EMP_NO,RQST_TITLE,AST_RCPT_DT,INS_ID,UPT_DE,CHG_BSS,MOVT_DMND_DT,DHRM_CD
  test.skip('[no:1] 자산이동신청 - 조회 (getChgData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0221/getEmpData.do | inputCols=RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_NM,APV_STAT_CD,TKOVR_DT,TKOVR_EMP_NO,TKOVR_EMP_NM,RCV_EMP_NO,RCV_EMP_NM,TKOVR_DEPT_CD,TKOVR_DEPT_NM,RCV_DEPT_CD,RCV_DEPT_NM,TKOVR_MNG_EMP_NO,TKOVR_MNG_EMP_NM,RCV_MNG_EMP_NO,RCV_MNG_EMP_NM,RCV_MNG_DEPT_CD,RCV_MNG_DEPT_NM,TKOVR_RSN,CHK_DT,APP_YN,PLC_NM,PLC_CD,AST_RCPT_EMP_NO,RQST_TITLE,AST_RCPT_DT,INS_ID,UPT_DE,CHG_BSS,MOVT_DMND_DT,DHRM_CD
  test.skip('[no:2] 자산이동신청 - 조회 (getEmpData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0221/setAstChgData.do | inputCols=-
  test.skip('[no:3] 자산이동신청 - 저장 (setAppData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0221/uptChk.do | inputCols=-
  test.skip('[no:4] 자산이동신청 - 조회 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/ass/ass0221/delAstChgData.do | inputCols=RQST_NO,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,APV_STAT_NM,APV_STAT_CD,TKOVR_DT,TKOVR_EMP_NO,TKOVR_EMP_NM,RCV_EMP_NO,RCV_EMP_NM,TKOVR_DEPT_CD,TKOVR_DEPT_NM,RCV_DEPT_CD,RCV_DEPT_NM,TKOVR_MNG_EMP_NO,TKOVR_MNG_EMP_NM,RCV_MNG_EMP_NO,RCV_MNG_EMP_NM,RCV_MNG_DEPT_CD,RCV_MNG_DEPT_NM,TKOVR_RSN,CHK_DT,APP_YN,PLC_NM,PLC_CD,AST_RCPT_EMP_NO,RQST_TITLE,AST_RCPT_DT,INS_ID,UPT_DE,CHG_BSS,MOVT_DMND_DT,DHRM_CD
  test.skip('[no:5] 자산이동신청 - 삭제 (delAstChgData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산불용신청 결과등록현황 (ass_0312M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0312M' OR MNU_NM LIKE '자산불용신청 결과등록현황%'
  const MENU_ID = 'TODO_ass_0312M';
  const API_URL = '/mis/act/act0000/getBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_DT', 'SCH_RQST_SDT', 'SCH_RQST_EDT', 'APV_STAT_CD', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_ITNC_EMP_NM', 'SCH_ITNC_EMP_NO', 'SCH_ITNC_DEPT_CD', 'SCH_ITNC_DEPT_NM', 'RQST_NO', 'SRCH_KEY', 'SRCH_CLS', 'ROLE_YN', 'DEPT_CHIF_YN', 'STAT_CLS', 'BUSI_PLC_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_AST_STAT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getBusiPlc.do | inputCols=SCH_DT,SCH_RQST_SDT,SCH_RQST_EDT,APV_STAT_CD,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_ITNC_EMP_NM,SCH_ITNC_EMP_NO,SCH_ITNC_DEPT_CD,SCH_ITNC_DEPT_NM,RQST_NO,SRCH_KEY,SRCH_CLS,ROLE_YN,DEPT_CHIF_YN,STAT_CLS,BUSI_PLC_CD,SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_AST_STAT
  test.skip('[no:1] 자산불용신청 결과등록현황 - 조회 (getCode) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0312/getChgRqstList.do | inputCols=SCH_DT,SCH_RQST_SDT,SCH_RQST_EDT,APV_STAT_CD,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_ITNC_EMP_NM,SCH_ITNC_EMP_NO,SCH_ITNC_DEPT_CD,SCH_ITNC_DEPT_NM,RQST_NO,SRCH_KEY,SRCH_CLS,ROLE_YN,DEPT_CHIF_YN,STAT_CLS,BUSI_PLC_CD,SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_AST_STAT
  test.skip('[no:2] 자산불용신청 결과등록현황 - 조회 (getChgRqstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0312/setAssChgComplete.do | inputCols=SCH_DT,SCH_RQST_SDT,SCH_RQST_EDT,APV_STAT_CD,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_ITNC_EMP_NM,SCH_ITNC_EMP_NO,SCH_ITNC_DEPT_CD,SCH_ITNC_DEPT_NM,RQST_NO,SRCH_KEY,SRCH_CLS,ROLE_YN,DEPT_CHIF_YN,STAT_CLS,BUSI_PLC_CD,SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_AST_STAT
  test.skip('[no:3] 자산불용신청 결과등록현황 - 저장 (setAssChgComplete) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산불용신청 목록 (ass_0313M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0313M' OR MNU_NM LIKE '자산불용신청 목록%'
  const MENU_ID = 'TODO_ass_0313M';
  const API_URL = '/mis/act/act0000/getBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_DT', 'SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'SCH_APV_STAT_CD', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'RQST_NO', 'ROLE_YN', 'DEPT_CHIF_YN', 'BUSI_PLC_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_AST_STAT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getBusiPlc.do | inputCols=SCH_DT,SCH_SRCH_SDT,SCH_SRCH_EDT,SCH_APV_STAT_CD,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,RQST_NO,ROLE_YN,DEPT_CHIF_YN,BUSI_PLC_CD,SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_AST_STAT
  test.skip('[no:1] 자산불용신청 목록 - 조회 (getCode) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0313/getList.do | inputCols=SCH_DT,SCH_SRCH_SDT,SCH_SRCH_EDT,SCH_APV_STAT_CD,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,RQST_NO,ROLE_YN,DEPT_CHIF_YN,BUSI_PLC_CD,SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_AST_STAT
  test.skip('[no:2] 자산불용신청 목록 - 조회 (getChgRqstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산불용신청 (ass_0314M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0314M' OR MNU_NM LIKE '자산불용신청%'
  const MENU_ID = 'TODO_ass_0314M';
  const API_URL = '/mis/act/act0000/getBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getBusiPlc.do | inputCols=-
  test.skip('[no:1] 자산불용신청 - 조회 (getCode) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0314/getChgData.do | inputCols=RQST_NO,RQST_CLS,CORP_CD,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,DISUSE_RSN_REPT_CD,RMK,DISUSE_QTY,DISUSE_DT,DISUSE_DLRT_DT,DISUSE_REPT_DT,DISUSE_MTHD,DISUSE_CONT,DISUSE_ORG,DELIBTV_OBJ_YN,DELIBTV_CMPL_YN,DISUSE_REPT_DEPT_CD,DISUSE_REPT_DEPT_NM,DISUSE_REPT_EMP_NO,DISUSE_REPT_EMP_NM,APV_STAT_NM,APV_STAT_CD,INS_ID,CHK_DT,APP_YN,BUSI_PLC_CD,BUSI_PLC_NM,AST_USE_STAT,ITNC_EMP_NO,ITNC_EMP_NM,ITNC_DEPT_CD,ITNC_DEPT_NM,DLBRT_YN,DLBRT_DT
  test.skip('[no:2] 자산불용신청 - 조회 (getChgData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/ass/ass0314/delAstChgData.do | inputCols=RQST_NO,RQST_CLS,CORP_CD,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,DISUSE_RSN_REPT_CD,RMK,DISUSE_QTY,DISUSE_DT,DISUSE_DLRT_DT,DISUSE_REPT_DT,DISUSE_MTHD,DISUSE_CONT,DISUSE_ORG,DELIBTV_OBJ_YN,DELIBTV_CMPL_YN,DISUSE_REPT_DEPT_CD,DISUSE_REPT_DEPT_NM,DISUSE_REPT_EMP_NO,DISUSE_REPT_EMP_NM,APV_STAT_NM,APV_STAT_CD,INS_ID,CHK_DT,APP_YN,BUSI_PLC_CD,BUSI_PLC_NM,AST_USE_STAT,ITNC_EMP_NO,ITNC_EMP_NM,ITNC_DEPT_CD,ITNC_DEPT_NM,DLBRT_YN,DLBRT_DT
  test.skip('[no:3] 자산불용신청 - 삭제 (delAstChgData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산불용신청 결과등록 (ass_0315M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0315M' OR MNU_NM LIKE '자산불용신청 결과등록%'
  const MENU_ID = 'TODO_ass_0315M';
  const API_URL = '/mis/ass/ass0315/getChgData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_NO', 'RQST_CLS', 'CORP_CD', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'DISUSE_RSN_REPT_CD', 'RMK', 'DISUSE_QTY', 'DISUSE_DT', 'DISUSE_DLRT_DT', 'DISUSE_REPT_DT', 'DISUSE_MTHD', 'DISUSE_CONT', 'DISUSE_ORG', 'DELIBTV_OBJ_YN', 'DELIBTV_CMPL_YN', 'DISUSE_REPT_DEPT_CD', 'DISUSE_REPT_DEPT_NM', 'DISUSE_REPT_EMP_NO', 'DISUSE_REPT_EMP_NM', 'APV_STAT_NM', 'APV_STAT_CD', 'INS_ID', 'CHK_DT', 'APP_YN', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'AST_USE_STAT', 'ITNC_EMP_NO', 'ITNC_EMP_NM', 'ITNC_DEPT_CD', 'ITNC_DEPT_NM', 'DCSN_YN', 'DLBRT_YN', 'DLBRT_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0315/getChgData.do | inputCols=RQST_NO,RQST_CLS,CORP_CD,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,DISUSE_RSN_REPT_CD,RMK,DISUSE_QTY,DISUSE_DT,DISUSE_DLRT_DT,DISUSE_REPT_DT,DISUSE_MTHD,DISUSE_CONT,DISUSE_ORG,DELIBTV_OBJ_YN,DELIBTV_CMPL_YN,DISUSE_REPT_DEPT_CD,DISUSE_REPT_DEPT_NM,DISUSE_REPT_EMP_NO,DISUSE_REPT_EMP_NM,APV_STAT_NM,APV_STAT_CD,INS_ID,CHK_DT,APP_YN,BUSI_PLC_CD,BUSI_PLC_NM,AST_USE_STAT,ITNC_EMP_NO,ITNC_EMP_NM,ITNC_DEPT_CD,ITNC_DEPT_NM,DCSN_YN,DLBRT_YN,DLBRT_DT
  test.skip('[no:1] 자산불용신청 결과등록 - 조회 (getChgData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0315/setOrgFile.do | inputCols=RQST_NO,RQST_CLS,CORP_CD,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,DISUSE_RSN_REPT_CD,RMK,DISUSE_QTY,DISUSE_DT,DISUSE_DLRT_DT,DISUSE_REPT_DT,DISUSE_MTHD,DISUSE_CONT,DISUSE_ORG,DELIBTV_OBJ_YN,DELIBTV_CMPL_YN,DISUSE_REPT_DEPT_CD,DISUSE_REPT_DEPT_NM,DISUSE_REPT_EMP_NO,DISUSE_REPT_EMP_NM,APV_STAT_NM,APV_STAT_CD,INS_ID,CHK_DT,APP_YN,BUSI_PLC_CD,BUSI_PLC_NM,AST_USE_STAT,ITNC_EMP_NO,ITNC_EMP_NM,ITNC_DEPT_CD,ITNC_DEPT_NM,DCSN_YN,DLBRT_YN,DLBRT_DT
  test.skip('[no:2] 자산불용신청 결과등록 - 저장 (setOrgFile) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0315/setAssChgComplete.do | inputCols=tmHeader,isChecked,RQST_NO,AST_MNG_CD,AST_CD,AST_NM,ACQ_QTY,ACQ_AMT,ACQ_DT,AST_STAT,STD,ASS_LOCATION,DISUSE_QTY,DISUSE_DT,DISUSE_MTHD,DISUSE_CONT,DISUSE_ORG,DISUSE_JDNT,DELIBTV_OBJ_YN,DELIBTV_CMPL_YN,AST_USER_EMP_NO,AST_USER_EMP_NM,AST_USER_DEPT_CD,AST_USER_DEPT_NM,RMK,DTL_PLC,DHRM_CD,DHRM_NM,AST_MNGR_EMP_NO,AST_MNGR_EMP_NM,AST_MNGR_DEPT_NM,AST_MNGR_DEPT_CD,APV_STAT_CD,AST_CLS_CD,AST_CLS_NM,AST_STAT_NM,DISUSE_RSN,UPP_AST_CLS_CD,UPP_AST_CLS_NM
  test.skip('[no:3] 자산불용신청 결과등록 - 저장 (setAssChgComplete) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/ass/ass0315/delAstChgData.do | inputCols=RQST_NO,RQST_CLS,CORP_CD,RQST_DT,APNT_EMP_NO,APNT_EMP_NM,APNT_DEPT_CD,APNT_DEPT_NM,DISUSE_RSN_REPT_CD,RMK,DISUSE_QTY,DISUSE_DT,DISUSE_DLRT_DT,DISUSE_REPT_DT,DISUSE_MTHD,DISUSE_CONT,DISUSE_ORG,DELIBTV_OBJ_YN,DELIBTV_CMPL_YN,DISUSE_REPT_DEPT_CD,DISUSE_REPT_DEPT_NM,DISUSE_REPT_EMP_NO,DISUSE_REPT_EMP_NM,APV_STAT_NM,APV_STAT_CD,INS_ID,CHK_DT,APP_YN,BUSI_PLC_CD,BUSI_PLC_NM,AST_USE_STAT,ITNC_EMP_NO,ITNC_EMP_NM,ITNC_DEPT_CD,ITNC_DEPT_NM,DCSN_YN,DLBRT_YN,DLBRT_DT
  test.skip('[no:4] 자산불용신청 결과등록 - 삭제 (delAstChgData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('불용자산처분등록 (ass_0316M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0316M' OR MNU_NM LIKE '불용자산처분등록%'
  const MENU_ID = 'TODO_ass_0316M';
  const API_URL = '/mis/ass/ass0316/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_DT', 'SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'SCH_APV_STAT_CD', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'RQST_NO', 'ROLE_YN', 'DEPT_CHIF_YN', 'BUSI_PLC_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_AST_STAT', 'SCH_DISUSE_MTHD', 'DCSN_YN', 'DISUSE_ORG', 'DISUSE_MTHD', 'DISUSE_CONT', 'Column0'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0316/getData.do | inputCols=SCH_DT,SCH_SRCH_SDT,SCH_SRCH_EDT,SCH_APV_STAT_CD,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,RQST_NO,ROLE_YN,DEPT_CHIF_YN,BUSI_PLC_CD,SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_AST_STAT,SCH_DISUSE_MTHD,DCSN_YN,DISUSE_ORG,DISUSE_MTHD,DISUSE_CONT,Column0
  test.skip('[no:1] 불용자산처분등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0316/setData.do | inputCols=SCH_DT,SCH_SRCH_SDT,SCH_SRCH_EDT,SCH_APV_STAT_CD,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,RQST_NO,ROLE_YN,DEPT_CHIF_YN,BUSI_PLC_CD,SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_AST_STAT,SCH_DISUSE_MTHD,DCSN_YN,DISUSE_ORG,DISUSE_MTHD,DISUSE_CONT,Column0
  test.skip('[no:2] 불용자산처분등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('ZEUS장비연계 현황 (ass_0320M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0320M' OR MNU_NM LIKE 'ZEUS장비연계 현황%'
  const MENU_ID = 'TODO_ass_0320M';
  const API_URL = '/mis/ass/ass0320/getNtisList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_SDT', 'SCH_RQST_EDT', 'REGIST_ID', 'REGIST_NM', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN', 'STATUS_CD', 'NTIS_REG_OBJ_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0320/getNtisList.do | inputCols=SCH_RQST_SDT,SCH_RQST_EDT,REGIST_ID,REGIST_NM,SCH_SRCH_CLS,SCH_SRCH_KEY,ROLE_YN,DEPT_CHIF_YN,STATUS_CD,NTIS_REG_OBJ_YN
  test.skip('[no:1] ZEUS장비연계 현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산반출입현황 (ass_0500M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0500M' OR MNU_NM LIKE '자산반출입현황%'
  const MENU_ID = 'TODO_ass_0500M';
  const API_URL = '/mis/ass/ass0500/getNotCarryList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'SCH_RQST_CLS', 'SCH_SRCH_DT', 'SCH_APNT_EMP_NM', 'SCH_APNT_EMP_NO', 'SCH_APNT_DEPT_NM', 'SCH_APNT_DEPT_CD', 'DEPT_NM', 'DEPT_CD', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'IO_END_YN', 'AST_YN', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_AST_CLS_CD', 'SCH_AST_CLS_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0500/getNotCarryList.do | inputCols=SCH_SRCH_SDT,SCH_SRCH_EDT,SCH_RQST_CLS,SCH_SRCH_DT,SCH_APNT_EMP_NM,SCH_APNT_EMP_NO,SCH_APNT_DEPT_NM,SCH_APNT_DEPT_CD,DEPT_NM,DEPT_CD,SCH_SRCH_CLS,SCH_SRCH_KEY,IO_END_YN,AST_YN,ROLE_YN,DEPT_CHIF_YN,SCH_AST_CLS_CD,SCH_AST_CLS_NM
  test.skip('[no:1] 자산반출입현황 - 조회 (getNotCarryList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산반출입신청 (ass_0510M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0510M' OR MNU_NM LIKE '자산반출입신청%'
  const MENU_ID = 'TODO_ass_0510M';
  const API_URL = '/mis/ass/ass0510/getCarryInOutRqstList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_CLS', 'SCH_SRCH_DT', 'SCH_SRCH_SDT', 'SCH_SRCH_EDT', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'DEPT_CD', 'DEPT_NM', 'SCH_RQST_CLS', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_APNT_EMP_NM', 'SCH_APNT_EMP_NO', 'SCH_APV_STAT_CD', 'ROLE_YN', 'DEPT_CHIF_YN', 'SCH_AST_CLS_CD', 'SCH_AST_CLS_NM', 'SCH_FRGN_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0510/getCarryInOutRqstList.do | inputCols=RQST_CLS,SCH_SRCH_DT,SCH_SRCH_SDT,SCH_SRCH_EDT,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,DEPT_CD,DEPT_NM,SCH_RQST_CLS,SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_APNT_EMP_NM,SCH_APNT_EMP_NO,SCH_APV_STAT_CD,ROLE_YN,DEPT_CHIF_YN,SCH_AST_CLS_CD,SCH_AST_CLS_NM,SCH_FRGN_CLS
  test.skip('[no:1] 자산반출입신청 - 조회 (getCarryInOutRqstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산반출신청 (ass_0511M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0511M' OR MNU_NM LIKE '자산반출신청%'
  const MENU_ID = 'TODO_ass_0511M';
  const API_URL = '/mis/ass/ass0511/getCarryOutMst.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'BUSI_PLC_CD', 'RQST_NO', 'RQST_DT', 'RQST_CLS', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'CRR_IO_DT', 'CRR_IO_PLN_DT', 'CRR_IO_PLC', 'CRR_IO_EMP_NM', 'CRR_IO_EMP_TEL_NO', 'CRR_IO_RSN', 'AST_NO', 'APV_STAT_NM', 'APV_STAT_CD', 'INS_ID', 'CHK_DT', 'ITNC_EMP_NM', 'ITNC_EMP_NO', 'ITNC_DEPT_CD', 'ITNC_DEPT_NM', 'TKOUT_YN', 'TKIN_YN', 'INOUT_TP', 'TKOUT_ADDR', 'RMK', 'Column0', 'DLBRT_YN', 'DLBRT_DT', 'PCHRG_TEL_NO', 'PCHRG_NM', 'SCHLR_YN', 'PGM_ID'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0511/getCarryOutMst.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_NO,RQST_DT,RQST_CLS,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,CRR_IO_DT,CRR_IO_PLN_DT,CRR_IO_PLC,CRR_IO_EMP_NM,CRR_IO_EMP_TEL_NO,CRR_IO_RSN,AST_NO,APV_STAT_NM,APV_STAT_CD,INS_ID,CHK_DT,ITNC_EMP_NM,ITNC_EMP_NO,ITNC_DEPT_CD,ITNC_DEPT_NM,TKOUT_YN,TKIN_YN,INOUT_TP,TKOUT_ADDR,RMK,Column0,DLBRT_YN,DLBRT_DT,PCHRG_TEL_NO,PCHRG_NM,SCHLR_YN,PGM_ID
  test.skip('[no:1] 자산반출신청 - 조회 (getCarryOutMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/ass/ass0511/delRqstAll.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_NO,RQST_DT,RQST_CLS,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,CRR_IO_DT,CRR_IO_PLN_DT,CRR_IO_PLC,CRR_IO_EMP_NM,CRR_IO_EMP_TEL_NO,CRR_IO_RSN,AST_NO,APV_STAT_NM,APV_STAT_CD,INS_ID,CHK_DT,ITNC_EMP_NM,ITNC_EMP_NO,ITNC_DEPT_CD,ITNC_DEPT_NM,TKOUT_YN,TKIN_YN,INOUT_TP,TKOUT_ADDR,RMK,Column0,DLBRT_YN,DLBRT_DT,PCHRG_TEL_NO,PCHRG_NM,SCHLR_YN,PGM_ID
  test.skip('[no:2] 자산반출신청 - 삭제 (delRqstAll) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0511/uptChk.do | inputCols=-
  test.skip('[no:3] 자산반출신청 - 조회 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0521/getSchlrYn.do | inputCols=CORP_CD,BUSI_PLC_CD,RQST_NO,RQST_DT,RQST_CLS,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,CRR_IO_DT,CRR_IO_PLN_DT,CRR_IO_PLC,CRR_IO_EMP_NM,CRR_IO_EMP_TEL_NO,CRR_IO_RSN,AST_NO,APV_STAT_NM,APV_STAT_CD,INS_ID,CHK_DT,ITNC_EMP_NM,ITNC_EMP_NO,ITNC_DEPT_CD,ITNC_DEPT_NM,TKOUT_YN,TKIN_YN,INOUT_TP,TKOUT_ADDR,RMK,Column0,DLBRT_YN,DLBRT_DT,PCHRG_TEL_NO,PCHRG_NM,SCHLR_YN,PGM_ID
  test.skip('[no:4] 자산반출신청 - 조회 (getSchlrYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산반입신청 (ass_0521M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0521M' OR MNU_NM LIKE '자산반입신청%'
  const MENU_ID = 'TODO_ass_0521M';
  const API_URL = '/mis/ass/ass0521/getCarryOutMst.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_NO', 'RQST_DT', 'RQST_CLS', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'CRR_IO_RQST_NO', 'CRR_IO_DT', 'CRR_IO_RSN', 'CRR_IO_PLC', 'APV_STAT_CD', 'APV_STAT_NM', 'CHK_DT', 'CRR_IO_PLN_DT', 'CORP_CD', 'BUSI_PLC_CD', 'INS_ID', 'ITNC_EMP_NO', 'ITNC_EMP_NM', 'ITNC_DEPT_CD', 'ITNC_DEPT_NM', 'RMK', 'SCHLR_YN', 'PGM_ID'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0521/getCarryOutMst.do | inputCols=RQST_NO,RQST_DT,RQST_CLS,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,CRR_IO_RQST_NO,CRR_IO_DT,CRR_IO_RSN,CRR_IO_PLC,APV_STAT_CD,APV_STAT_NM,CHK_DT,CRR_IO_PLN_DT,CORP_CD,BUSI_PLC_CD,INS_ID,ITNC_EMP_NO,ITNC_EMP_NM,ITNC_DEPT_CD,ITNC_DEPT_NM,RMK,SCHLR_YN,PGM_ID
  test.skip('[no:1] 자산반입신청 - 조회 (getCarryOutMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0521/getCarryOutListDtl.do | inputCols=RQST_NO,RQST_DT,RQST_CLS,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,CRR_IO_RQST_NO,CRR_IO_DT,CRR_IO_RSN,CRR_IO_PLC,APV_STAT_CD,APV_STAT_NM,CHK_DT,CRR_IO_PLN_DT,CORP_CD,BUSI_PLC_CD,INS_ID,ITNC_EMP_NO,ITNC_EMP_NM,ITNC_DEPT_CD,ITNC_DEPT_NM,RMK,SCHLR_YN,PGM_ID
  test.skip('[no:2] 자산반입신청 - 조회 (getCarryOutListDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/ass/ass0521/delRqstAll.do | inputCols=RQST_NO,RQST_DT,RQST_CLS,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,CRR_IO_RQST_NO,CRR_IO_DT,CRR_IO_RSN,CRR_IO_PLC,APV_STAT_CD,APV_STAT_NM,CHK_DT,CRR_IO_PLN_DT,CORP_CD,BUSI_PLC_CD,INS_ID,ITNC_EMP_NO,ITNC_EMP_NM,ITNC_DEPT_CD,ITNC_DEPT_NM,RMK,SCHLR_YN,PGM_ID
  test.skip('[no:3] 자산반입신청 - 삭제 (delRqstAll) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0521/uptChk.do | inputCols=-
  test.skip('[no:4] 자산반입신청 - 조회 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0521/getSchlrYn.do | inputCols=RQST_NO,RQST_DT,RQST_CLS,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,CRR_IO_RQST_NO,CRR_IO_DT,CRR_IO_RSN,CRR_IO_PLC,APV_STAT_CD,APV_STAT_NM,CHK_DT,CRR_IO_PLN_DT,CORP_CD,BUSI_PLC_CD,INS_ID,ITNC_EMP_NO,ITNC_EMP_NM,ITNC_DEPT_CD,ITNC_DEPT_NM,RMK,SCHLR_YN,PGM_ID
  test.skip('[no:5] 자산반입신청 - 조회 (getSchlrYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산반출연장신청 (ass_0531M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0531M' OR MNU_NM LIKE '자산반출연장신청%'
  const MENU_ID = 'TODO_ass_0531M';
  const API_URL = '/mis/ass/ass0531/getCarryOutMst.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_NO', 'RQST_DT', 'RQST_CLS', 'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'CRR_IO_RQST_NO', 'CRR_IO_DT', 'CRR_IO_RSN', 'CRR_IO_PLC', 'APV_STAT_CD', 'APV_STAT_NM', 'CHK_DT', 'CRR_IO_PLN_DT', 'CORP_CD', 'BUSI_PLC_CD', 'INS_ID', 'ITNC_EMP_NO', 'ITNC_EMP_NM', 'ITNC_DEPT_CD', 'ITNC_DEPT_NM', 'RMK', 'TKOUT_ADDR', 'PCHRG_TEL_NO', 'PCHRG_NM', 'CRR_IO_EMP_NM', 'CRR_IO_EMP_TEL_NO', 'INOUT_TP', 'DLBRT_DT', 'DLBRT_YN', 'CRR_IO_ADDR', 'CRR_IO_RSN2'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0531/getCarryOutMst.do | inputCols=RQST_NO,RQST_DT,RQST_CLS,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,CRR_IO_RQST_NO,CRR_IO_DT,CRR_IO_RSN,CRR_IO_PLC,APV_STAT_CD,APV_STAT_NM,CHK_DT,CRR_IO_PLN_DT,CORP_CD,BUSI_PLC_CD,INS_ID,ITNC_EMP_NO,ITNC_EMP_NM,ITNC_DEPT_CD,ITNC_DEPT_NM,RMK,TKOUT_ADDR,PCHRG_TEL_NO,PCHRG_NM,CRR_IO_EMP_NM,CRR_IO_EMP_TEL_NO,INOUT_TP,DLBRT_DT,DLBRT_YN,CRR_IO_ADDR,CRR_IO_RSN2
  test.skip('[no:1] 자산반출연장신청 - 조회 (getCarryOutMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0531/getCarryOutListDtl.do | inputCols=RQST_NO,RQST_DT,RQST_CLS,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,CRR_IO_RQST_NO,CRR_IO_DT,CRR_IO_RSN,CRR_IO_PLC,APV_STAT_CD,APV_STAT_NM,CHK_DT,CRR_IO_PLN_DT,CORP_CD,BUSI_PLC_CD,INS_ID,ITNC_EMP_NO,ITNC_EMP_NM,ITNC_DEPT_CD,ITNC_DEPT_NM,RMK,TKOUT_ADDR,PCHRG_TEL_NO,PCHRG_NM,CRR_IO_EMP_NM,CRR_IO_EMP_TEL_NO,INOUT_TP,DLBRT_DT,DLBRT_YN,CRR_IO_ADDR,CRR_IO_RSN2
  test.skip('[no:2] 자산반출연장신청 - 조회 (getCarryOutListDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/ass/ass0531/delRqstAll.do | inputCols=RQST_NO,RQST_DT,RQST_CLS,APNT_EMP_NM,APNT_EMP_NO,APNT_DEPT_NM,APNT_DEPT_CD,CRR_IO_RQST_NO,CRR_IO_DT,CRR_IO_RSN,CRR_IO_PLC,APV_STAT_CD,APV_STAT_NM,CHK_DT,CRR_IO_PLN_DT,CORP_CD,BUSI_PLC_CD,INS_ID,ITNC_EMP_NO,ITNC_EMP_NM,ITNC_DEPT_CD,ITNC_DEPT_NM,RMK,TKOUT_ADDR,PCHRG_TEL_NO,PCHRG_NM,CRR_IO_EMP_NM,CRR_IO_EMP_TEL_NO,INOUT_TP,DLBRT_DT,DLBRT_YN,CRR_IO_ADDR,CRR_IO_RSN2
  test.skip('[no:3] 자산반출연장신청 - 삭제 (delRqstAll) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0531/uptChk.do | inputCols=-
  test.skip('[no:4] 자산반출연장신청 - 조회 (uptChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('재물조사 계획목록 (ass_0610M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0610M' OR MNU_NM LIKE '재물조사 계획목록%'
  const MENU_ID = 'TODO_ass_0610M';
  const API_URL = '/mis/ass/ass0610/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['FRM_YY', 'TO_YY', 'INVST_NM', 'CTR_CLS', 'SCH_INVST_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0610/getList.do | inputCols=FRM_YY,TO_YY,INVST_NM,CTR_CLS,SCH_INVST_FG
  test.skip('[no:1] 재물조사 계획목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0610/getDcsnYn.do | inputCols=-
  test.skip('[no:2] 재물조사 계획목록 - 조회 (getDcsnYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('재물조사 계획등록 (ass_0611M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0611M' OR MNU_NM LIKE '재물조사 계획등록%'
  const MENU_ID = 'TODO_ass_0611M';
  const API_URL = '/mis/ass/ass0611/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SEARCH_COND', 'FRM_DT', 'TO_DT', 'YY', 'DGCNT', 'EXCEL_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/ass/ass0611/setSave.do | inputCols=YY,DGCNT,INVST_NM,INVST_FRM_DT,INVST_TO_DT,DCSN_YN,INVS_ALL_CNT,RFID_READ_CNT,YN_CNT,RQST_CLS,RQST_NO,RMK,CTR_CLS,INVST_FG
  test.skip('[no:1] 재물조사 계획등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0611/getList.do | inputCols=SEARCH_COND,FRM_DT,TO_DT,YY,DGCNT,EXCEL_CLS
  test.skip('[no:2] 재물조사 계획등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0611/setExcelUpSearch.do | inputCols=AST_CLS_NM,AST_MNG_CD,AST_CD,AST_NM,AST_STAT,AST_STAT_NM,MNG_DEPT_CD,MNG_DEPT_NM,MNG_EMP_NO,MNG_EMP_NM,USE_DEPT_CD,USE_DEPT_NM,USE_EMP_NO,USE_EMP_NM,PLACE_CD,ASS_LOCATION
  test.skip('[no:3] 재물조사 계획등록 - 저장 (setExcelUpSearch) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0611/setNewSave.do | inputCols=SEARCH_COND,FRM_DT,TO_DT,YY,DGCNT,EXCEL_CLS
  test.skip('[no:4] 재물조사 계획등록 - 저장 (setCreate) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0611/setMstUpt.do | inputCols=YY,DGCNT,INVST_NM,INVST_FRM_DT,INVST_TO_DT,DCSN_YN,INVS_ALL_CNT,RFID_READ_CNT,YN_CNT,RQST_CLS,RQST_NO,RMK,CTR_CLS,INVST_FG
  test.skip('[no:5] 재물조사 계획등록 - 저장 (setMstUpt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0611/getExcelList.do | inputCols=SEARCH_COND,FRM_DT,TO_DT,YY,DGCNT,EXCEL_CLS
  test.skip('[no:6] 재물조사 계획등록 - 조회 (getExcelList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/ass/ass0611/doDelete.do | inputCols=YY,DGCNT,INVST_NM,INVST_FRM_DT,INVST_TO_DT,DCSN_YN,INVS_ALL_CNT,RFID_READ_CNT,YN_CNT,RQST_CLS,RQST_NO,RMK,CTR_CLS,INVST_FG
  test.skip('[no:7] 재물조사 계획등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0611/getDcsnYn.do | inputCols=YY,DGCNT,INVST_NM,INVST_FRM_DT,INVST_TO_DT,DCSN_YN,INVS_ALL_CNT,RFID_READ_CNT,YN_CNT,RQST_CLS,RQST_NO,RMK,CTR_CLS,INVST_FG
  test.skip('[no:8] 재물조사 계획등록 - 조회 (getDcsnYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('재물조사집계표 (ass_0620M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0620M' OR MNU_NM LIKE '재물조사집계표%'
  const MENU_ID = 'TODO_ass_0620M';
  const API_URL = '/mis/ass/ass0620/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['FRM_YY', 'TO_YY', 'SCH_INVST_NM', 'DGCNT', 'SCH_AST_NM', 'DEPT_CD', 'SEL_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0620/getList.do | inputCols=FRM_YY,TO_YY,SCH_INVST_NM,DGCNT,SCH_AST_NM,DEPT_CD,SEL_YY
  test.skip('[no:1] 재물조사집계표 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0620/getAstList.do | inputCols=FRM_YY,TO_YY,SCH_INVST_NM,DGCNT,SCH_AST_NM,DEPT_CD,SEL_YY
  test.skip('[no:2] 재물조사집계표 - 조회 (getAstList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자체조사등록 (ass_0630M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0630M' OR MNU_NM LIKE '자체조사등록%'
  const MENU_ID = 'TODO_ass_0630M';
  const API_URL = '/mis/ass/ass0630/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['FRM_YY', 'TO_YY', 'WELE_INVS_NM', 'CTR_CLS', 'DGCNT', 'SCH_DEPT_NM', 'SCH_DEPT_CD', 'YY', 'ROLE_MNGR_YN', 'SCH_DCSN_YN', 'DEPTL_EMP_NO', 'MNGR_EMP_NO', 'MNGR_EMP_NM', 'MNGR_DEPT_NM', 'MNGR_DEPT_CD', 'USER_EMP_NO', 'USER_EMP_NM', 'USER_DEPT_NO', 'USER_DEPT_NM', 'DHRM_CD', 'ROOM_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0630/getList.do | inputCols=FRM_YY,TO_YY,WELE_INVS_NM,CTR_CLS,DGCNT,SCH_DEPT_NM,SCH_DEPT_CD,YY,ROLE_MNGR_YN,SCH_DCSN_YN,DEPTL_EMP_NO,MNGR_EMP_NO,MNGR_EMP_NM,MNGR_DEPT_NM,MNGR_DEPT_CD,USER_EMP_NO,USER_EMP_NM,USER_DEPT_NO,USER_DEPT_NM,DHRM_CD,ROOM_NM
  test.skip('[no:1] 자체조사등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0630/setSave.do | inputCols=FRM_YY,TO_YY,WELE_INVS_NM,CTR_CLS,DGCNT,SCH_DEPT_NM,SCH_DEPT_CD,YY,ROLE_MNGR_YN,SCH_DCSN_YN,DEPTL_EMP_NO,MNGR_EMP_NO,MNGR_EMP_NM,MNGR_DEPT_NM,MNGR_DEPT_CD,USER_EMP_NO,USER_EMP_NM,USER_DEPT_NO,USER_DEPT_NM,DHRM_CD,ROOM_NM
  test.skip('[no:2] 자체조사등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0630/setExcelUpSearch.do | inputCols=FRM_YY,TO_YY,WELE_INVS_NM,CTR_CLS,DGCNT,SCH_DEPT_NM,SCH_DEPT_CD,YY,ROLE_MNGR_YN,SCH_DCSN_YN,DEPTL_EMP_NO,MNGR_EMP_NO,MNGR_EMP_NM,MNGR_DEPT_NM,MNGR_DEPT_CD,USER_EMP_NO,USER_EMP_NM,USER_DEPT_NO,USER_DEPT_NM,DHRM_CD,ROOM_NM
  test.skip('[no:3] 자체조사등록 - 저장 (setExcelUpSearch) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0630/getDcsnYn.do | inputCols=FRM_YY,TO_YY,WELE_INVS_NM,CTR_CLS,DGCNT,SCH_DEPT_NM,SCH_DEPT_CD,YY,ROLE_MNGR_YN,SCH_DCSN_YN,DEPTL_EMP_NO,MNGR_EMP_NO,MNGR_EMP_NM,MNGR_DEPT_NM,MNGR_DEPT_CD,USER_EMP_NO,USER_EMP_NM,USER_DEPT_NO,USER_DEPT_NM,DHRM_CD,ROOM_NM
  test.skip('[no:4] 자체조사등록 - 조회 (getDcsnYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0630/getMaxDgCnt.do | inputCols=FRM_YY,TO_YY,WELE_INVS_NM,CTR_CLS,DGCNT,SCH_DEPT_NM,SCH_DEPT_CD,YY,ROLE_MNGR_YN,SCH_DCSN_YN,DEPTL_EMP_NO,MNGR_EMP_NO,MNGR_EMP_NM,MNGR_DEPT_NM,MNGR_DEPT_CD,USER_EMP_NO,USER_EMP_NM,USER_DEPT_NO,USER_DEPT_NM,DHRM_CD,ROOM_NM
  test.skip('[no:5] 자체조사등록 - 조회 (getMaxDgCnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0630/setRsltData.do | inputCols=FRM_YY,TO_YY,WELE_INVS_NM,CTR_CLS,DGCNT,SCH_DEPT_NM,SCH_DEPT_CD,YY,ROLE_MNGR_YN,SCH_DCSN_YN,DEPTL_EMP_NO,MNGR_EMP_NO,MNGR_EMP_NM,MNGR_DEPT_NM,MNGR_DEPT_CD,USER_EMP_NO,USER_EMP_NM,USER_DEPT_NO,USER_DEPT_NM,DHRM_CD,ROOM_NM
  test.skip('[no:6] 자체조사등록 - 저장 (setRsltData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0630/setDcsnYn.do | inputCols=FRM_YY,TO_YY,WELE_INVS_NM,CTR_CLS,DGCNT,SCH_DEPT_NM,SCH_DEPT_CD,YY,ROLE_MNGR_YN,SCH_DCSN_YN,DEPTL_EMP_NO,MNGR_EMP_NO,MNGR_EMP_NM,MNGR_DEPT_NM,MNGR_DEPT_CD,USER_EMP_NO,USER_EMP_NM,USER_DEPT_NO,USER_DEPT_NM,DHRM_CD,ROOM_NM
  test.skip('[no:7] 자체조사등록 - 저장 (setDcsnYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0630/setExcept.do | inputCols=FRM_YY,TO_YY,WELE_INVS_NM,CTR_CLS,DGCNT,SCH_DEPT_NM,SCH_DEPT_CD,YY,ROLE_MNGR_YN,SCH_DCSN_YN,DEPTL_EMP_NO,MNGR_EMP_NO,MNGR_EMP_NM,MNGR_DEPT_NM,MNGR_DEPT_CD,USER_EMP_NO,USER_EMP_NM,USER_DEPT_NO,USER_DEPT_NM,DHRM_CD,ROOM_NM
  test.skip('[no:8] 자체조사등록 - 저장 (setExcept) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('상각기준등록 (ass_0701M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0701M' OR MNU_NM LIKE '상각기준등록%'
  const MENU_ID = 'TODO_ass_0701M';
  const API_URL = '/mis/ass/ass0701/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['DEPR_CLS', 'TEMP_NUM', 'Column0'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0701/getList.do | inputCols=DEPR_CLS,TEMP_NUM,Column0
  test.skip('[no:1] 상각기준등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0701/setDerpRate.do | inputCols=-
  test.skip('[no:2] 상각기준등록 - 저장 (setDerpRate) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('감가상각통계표 (ass_0710M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0710M' OR MNU_NM LIKE '감가상각통계표%'
  const MENU_ID = 'TODO_ass_0710M';
  const API_URL = '/mis/ass/ass0710/getDeprList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['DEPR_DT', 'DEPR_SDT', 'DEPR_EDT', 'DEPR_END_YN', 'FCTY_CT_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0710/getDeprList.do | inputCols=DEPR_DT,DEPR_SDT,DEPR_EDT,DEPR_END_YN,FCTY_CT_FG
  test.skip('[no:1] 감가상각통계표 - 조회 (getDeprList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0710/getList.do | inputCols=DEPR_DT,DEPR_SDT,DEPR_EDT,DEPR_END_YN,FCTY_CT_FG
  test.skip('[no:2] 감가상각통계표 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0710/getList3.do | inputCols=DEPR_DT,DEPR_SDT,DEPR_EDT,DEPR_END_YN,FCTY_CT_FG
  test.skip('[no:3] 감가상각통계표 - 조회 (getList3) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0710/getList2.do | inputCols=DEPR_DT,DEPR_SDT,DEPR_EDT,DEPR_END_YN,FCTY_CT_FG
  test.skip('[no:4] 감가상각통계표 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('감가상각계산 (ass_0711M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0711M' OR MNU_NM LIKE '감가상각계산%'
  const MENU_ID = 'TODO_ass_0711M';
  const API_URL = '/mis/ass/ass0711/getAssetDeprList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['DEPR_YY', 'DEPR_DT', 'SCH_SRCH_KEY', 'SCH_SRCH_CLS', 'DEL_CHK_YN', 'AST_CLS_CD', 'AST_CLS_NM', 'DEPR_END_YN', 'INVST_PRPRT_YN', 'FRMR_DT', 'UPP_AST_CLS_CD', 'UPP_AST_CLS_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0711/getAssetDeprList.do | inputCols=DEPR_YY,DEPR_DT,SCH_SRCH_KEY,SCH_SRCH_CLS,DEL_CHK_YN,AST_CLS_CD,AST_CLS_NM,DEPR_END_YN,INVST_PRPRT_YN,FRMR_DT,UPP_AST_CLS_CD,UPP_AST_CLS_NM
  test.skip('[no:1] 감가상각계산 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0711/setDeprList.do | inputCols=DEPR_YY,DEPR_DT,SCH_SRCH_KEY,SCH_SRCH_CLS,DEL_CHK_YN,AST_CLS_CD,AST_CLS_NM,DEPR_END_YN,INVST_PRPRT_YN,FRMR_DT,UPP_AST_CLS_CD,UPP_AST_CLS_NM
  test.skip('[no:2] 감가상각계산 - 저장 (setDeprList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0711/setAssetDepr.do | inputCols=DEPR_YY,DEPR_DT,SCH_SRCH_KEY,SCH_SRCH_CLS,DEL_CHK_YN,AST_CLS_CD,AST_CLS_NM,DEPR_END_YN,INVST_PRPRT_YN,FRMR_DT,UPP_AST_CLS_CD,UPP_AST_CLS_NM
  test.skip('[no:3] 감가상각계산 - 저장 (setAssetDepr) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0711/setDeprEndYn.do | inputCols=DEPR_DT,DEPR_END_YN,PRV_DEPR_CHK_YN,NEXT_DEPR_CHK_YN,TERM_PRV_DEPR_CHK,PRV_SLIP_DT,SLIP_DT,SLIP_NO,SLIP_APV_STAT,CORP_CD
  test.skip('[no:4] 감가상각계산 - 저장 (setDeprEndYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0711/setRtnDeprEndYn.do | inputCols=DEPR_DT,DEPR_END_YN,PRV_DEPR_CHK_YN,NEXT_DEPR_CHK_YN,TERM_PRV_DEPR_CHK,PRV_SLIP_DT,SLIP_DT,SLIP_NO,SLIP_APV_STAT,CORP_CD
  test.skip('[no:5] 감가상각계산 - 저장 (setRtnDeprEndYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0711/setSlipDt.do | inputCols=DEPR_DT,DEPR_END_YN,PRV_DEPR_CHK_YN,NEXT_DEPR_CHK_YN,TERM_PRV_DEPR_CHK,PRV_SLIP_DT,SLIP_DT,SLIP_NO,SLIP_APV_STAT,CORP_CD
  test.skip('[no:6] 감가상각계산 - 저장 (setSlipDt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/ass/ass0711/setSlipDtDelete.do | inputCols=DEPR_DT,DEPR_END_YN,PRV_DEPR_CHK_YN,NEXT_DEPR_CHK_YN,TERM_PRV_DEPR_CHK,PRV_SLIP_DT,SLIP_DT,SLIP_NO,SLIP_APV_STAT,CORP_CD
  test.skip('[no:7] 감가상각계산 - 삭제 (setSlipDtDelete) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자산분류코드 (ass_0901M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'ass_0901M' OR MNU_NM LIKE '자산분류코드%'
  const MENU_ID = 'TODO_ass_0901M';
  const API_URL = '/mis/ass/ass0901/getAstAssetClsList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'SCH_USE_YN', 'AST_CLS_CD', 'CORP_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/ass/ass0901/getAstAssetClsList.do | inputCols=SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_USE_YN,AST_CLS_CD,CORP_CD
  test.skip('[no:1] 자산분류코드 - 조회 (getAstClsList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/ass/ass0901/getAstClsData.do | inputCols=SCH_SRCH_CLS,SCH_SRCH_KEY,SCH_USE_YN,AST_CLS_CD,CORP_CD
  test.skip('[no:2] 자산분류코드 - 조회 (getAstClsData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/ass/ass0901/setAstClsData.do | inputCols=CORP_CD,AST_CLS_CD,AST_CLS_NM,UPP_AST_CLS_CD,UPP_AST_CLS_NM,UP_CLS_DIV,CLS_DIV,G_AST_CLS_CD,G_AST_CLS_NM,M_AST_CLS_CD,M_AST_CLS_NM,S_AST_CLS_CD,S_AST_CLS_NM,LVL,ORD_NO,AST_TP,AST_CD_CHCK_YN,ACCT_CD_D,ACCT_CD_C,ACCT_CD_D_NM,ACCT_CD_C_NM,DEPR_CLS,DRBL_YEARS,DEPR_RATE,USE_YN,RMK,OLD_SYS_KEY,CHK_DT
  test.skip('[no:3] 자산분류코드 - 저장 (setAstClsData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/ass/ass0901/delAstClsData.do | inputCols=CORP_CD,AST_CLS_CD,AST_CLS_NM,UPP_AST_CLS_CD,UPP_AST_CLS_NM,UP_CLS_DIV,CLS_DIV,G_AST_CLS_CD,G_AST_CLS_NM,M_AST_CLS_CD,M_AST_CLS_NM,S_AST_CLS_CD,S_AST_CLS_NM,LVL,ORD_NO,AST_TP,AST_CD_CHCK_YN,ACCT_CD_D,ACCT_CD_C,ACCT_CD_D_NM,ACCT_CD_C_NM,DEPR_CLS,DRBL_YEARS,DEPR_RATE,USE_YN,RMK,OLD_SYS_KEY,CHK_DT
  test.skip('[no:4] 자산분류코드 - 삭제 (delAstClsData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});
