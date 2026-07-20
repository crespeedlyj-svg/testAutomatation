// ==============================================================
// ACT(결산관리) 모듈 배치 단위 테스트 — 생성일 2026-06-28
// 입력: _workspace/act/01_scenarios.json (unit 748건 / integ 44건)
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


test.describe('기관정보등록 (act_1010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1010M' OR MNU_NM LIKE '기관정보등록%'
  const MENU_ID = 'TODO_act_1010M';
  const API_URL = '/mis/act/act1010/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_NM', 'AMT1', 'AMT2'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act1010/getList.do | inputCols=CORP_NM,AMT1,AMT2
  test.skip('[no:1] 기관정보등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1010/getDpltCck.do | inputCols=CORP_NM,AMT1,AMT2
  test.skip('[no:2] 기관정보등록 - 조회 (getDpltCck) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1010/getDataCntCck.do | inputCols=CORP_NM,AMT1,AMT2
  test.skip('[no:3] 기관정보등록 - 조회 (getDataCntCck) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1010/setData.do | inputCols=-
  test.skip('[no:4] 기관정보등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act1010/delData.do | inputCols=-
  test.skip('[no:5] 기관정보등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getVrifAccNo.do | inputCols=BK_CD,ACC_NO,DPSIT,AMT,RST,RST_CD,RST_DPSIT
  test.skip('[no:6] 기관정보등록 - 조회 (getVrifAccNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getCloseDown.do | inputCols=CORP_NUM,TAX_TYPE,TYPE_DATE,STATE,STATE_DATE,CHECK_DATE
  test.skip('[no:7] 기관정보등록 - 조회 (getCloseDown) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1010/setCntcTest.do | inputCols=CNTC_NO,ACT_UNIT_CD,DOC_TP,IF_DOC_NO,IF_PGM_ID,DOC_SBJ,CNTC_DT,CNTC_AMT,REPRS_TRNS_TP_CD,CNTC_PROC_YN
  test.skip('[no:8] 기관정보등록 - 저장 (setCntcTest) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act1010/delCntcTest.do | inputCols=CNTC_NO,ACT_UNIT_CD,DOC_TP,IF_DOC_NO,IF_PGM_ID,DOC_SBJ,CNTC_DT,CNTC_AMT,REPRS_TRNS_TP_CD,CNTC_PROC_YN
  test.skip('[no:9] 기관정보등록 - 삭제 (delCntcTest) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1010/setReslTest.do | inputCols=-
  test.skip('[no:10] 기관정보등록 - 저장 (setReslTest) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1010/getkakaoATS.do | inputCols=CORP_NM,AMT1,AMT2
  test.skip('[no:11] 기관정보등록 - 조회 (kakaoATS) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회계단위등록 (act_1020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1020M' OR MNU_NM LIKE '회계단위등록%'
  const MENU_ID = 'TODO_act_1020M';
  const API_URL = '/mis/act/act1020/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_NM', 'USE_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act1020/getList.do | inputCols=ACT_UNIT_NM,USE_YN
  test.skip('[no:1] 회계단위등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1020/getDpltCck.do | inputCols=ACT_UNIT_NM,USE_YN
  test.skip('[no:2] 회계단위등록 - 조회 (getDpltCck) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1020/setData.do | inputCols=-
  test.skip('[no:3] 회계단위등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act1020/delData.do | inputCols=-
  test.skip('[no:4] 회계단위등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사업장등록 (act_1030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1030M' OR MNU_NM LIKE '사업장등록%'
  const MENU_ID = 'TODO_act_1030M';
  const API_URL = '/mis/act/act1030/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_NM', 'BUSI_PLC_CD', 'USE_YN', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act1030/getList.do | inputCols=BUSI_PLC_NM,BUSI_PLC_CD,USE_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 사업장등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1030/getDpltCck.do | inputCols=BUSI_PLC_NM,BUSI_PLC_CD,USE_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:2] 사업장등록 - 조회 (getDpltCck) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1030/getChkBizrno.do | inputCols=BUSI_PLC_NM,BUSI_PLC_CD,USE_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:3] 사업장등록 - 조회 (getChkBizrno) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1030/setData.do | inputCols=-
  test.skip('[no:4] 사업장등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act1030/delData.do | inputCols=-
  test.skip('[no:5] 사업장등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('거래처등록 (act_1040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1040M' OR MNU_NM LIKE '거래처등록%'
  const MENU_ID = 'TODO_act_1040M';
  const API_URL = '/mis/act/act1040/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CUST_NM', 'CUST_FG', 'CUST_CLSF', 'BUY_SALG_FG', 'CUST_CD', 'BIZRNO', 'REPRES_NM', 'USE_YN', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act1040/getList.do | inputCols=CUST_NM,CUST_FG,CUST_CLSF,BUY_SALG_FG,CUST_CD,BIZRNO,REPRES_NM,USE_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 거래처등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1040/getListDtl.do | inputCols=CUST_NM,CUST_FG,CUST_CLSF,BUY_SALG_FG,CUST_CD,BIZRNO,REPRES_NM,USE_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:2] 거래처등록 - 조회 (getListDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1040/getCheckResNo.do | inputCols=CUST_NM,CUST_FG,CUST_CLSF,BUY_SALG_FG,CUST_CD,BIZRNO,REPRES_NM,USE_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:3] 거래처등록 - 조회 (getCheckResNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1040/getCheckRegNo.do | inputCols=-
  test.skip('[no:4] 거래처등록 - 저장 (getCheckRegNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1040/getChkResNo.do | inputCols=CUST_NM,CUST_FG,CUST_CLSF,BUY_SALG_FG,CUST_CD,BIZRNO,REPRES_NM,USE_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:5] 거래처등록 - 조회 (getChkResNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1040/getChkRegNo.do | inputCols=-
  test.skip('[no:6] 거래처등록 - 저장 (getChkRegNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1040/setData.do | inputCols=-
  test.skip('[no:7] 거래처등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act1040/delData.do | inputCols=-
  test.skip('[no:8] 거래처등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1040/setCntc.do | inputCols=-
  test.skip('[no:9] 거래처등록 - 저장 (setCntc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getVrifAccNo.do | inputCols=BK_CD,ACC_NO,DPSIT,RST_CD,RST_DPSIT,RST
  test.skip('[no:10] 거래처등록 - 조회 (getVrifAccNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act0002/uptAddresCrtfcAt2.do | inputCols=-
  test.skip('[no:11] 거래처등록 - 수정 (uptAddresCrtfcAt2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('거래처신청목록 (act_1041M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1041M' OR MNU_NM LIKE '거래처신청목록%'
  const MENU_ID = 'TODO_act_1041M';
  const API_URL = '/mis/act/act1041/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CUST_FG', 'CUST_CD', 'CUST_NM', 'RESPR', 'ACCP_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act1041/getList.do | inputCols=CUST_FG,CUST_CD,CUST_NM,RESPR,ACCP_YN
  test.skip('[no:1] 거래처신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1041/doConfirm.do | inputCols=CUST_FG,CUST_CD,CUST_NM,RESPR,ACCP_YN
  test.skip('[no:2] 거래처신청목록 - 조회 (doConfirm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1041/setIbkChk.do | inputCols=-
  test.skip('[no:3] 거래처신청목록 - 저장 (setIbkChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1041/excelDown.do | inputCols=CUST_FG,CUST_CD,CUST_NM,RESPR,ACCP_YN
  test.skip('[no:4] 거래처신청목록 - 조회 (excelDown) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계정코드등록 (act_1050M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1050M' OR MNU_NM LIKE '계정코드등록%'
  const MENU_ID = 'TODO_act_1050M';
  const API_URL = '/mis/act/act1050/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_STDR_CD', 'ACCT_CD', 'ACCT_NM', 'USE_YN', 'OPENIEM_ACCT_YN', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act1050/getList.do | inputCols=ACT_STDR_CD,ACCT_CD,ACCT_NM,USE_YN,OPENIEM_ACCT_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 계정코드등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1050/getListDtl.do | inputCols=ACT_STDR_CD,ACCT_CD,ACCT_NM,USE_YN,OPENIEM_ACCT_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:2] 계정코드등록 - 조회 (getListDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1050/getListMgmt.do | inputCols=ACT_STDR_CD,ACCT_CD,ACCT_NM,USE_YN,OPENIEM_ACCT_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:3] 계정코드등록 - 조회 (getListMgmt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1050/getDpltCck.do | inputCols=ACT_STDR_CD,ACCT_CD,ACCT_NM,USE_YN,OPENIEM_ACCT_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:4] 계정코드등록 - 조회 (getDpltCck) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1050/setData.do | inputCols=-
  test.skip('[no:5] 계정코드등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act1050/delData.do | inputCols=-
  test.skip('[no:6] 계정코드등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act1050/delMgmtData.do | inputCols=-
  test.skip('[no:7] 계정코드등록 - 삭제 (delMgmtData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('관리내역등록 (act_1090M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1090M' OR MNU_NM LIKE '관리내역등록%'
  const MENU_ID = 'TODO_act_1090M';
  const API_URL = '/mis/act/act1090/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['MNG_ITM_CD', 'MNG_DTS_CD', 'MNG_DTS_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act1090/getList.do | inputCols=MNG_ITM_CD,MNG_DTS_CD,MNG_DTS_NM
  test.skip('[no:1] 관리내역등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1090/getDetail.do | inputCols=MNG_ITM_CD,MNG_DTS_CD,MNG_DTS_NM
  test.skip('[no:2] 관리내역등록 - 조회 (getDetail) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1090/setData.do | inputCols=-
  test.skip('[no:3] 관리내역등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('거래유형적용일자 (act_1104M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1104M' OR MNU_NM LIKE '거래유형적용일자%'
  const MENU_ID = 'TODO_act_1104M';
  const API_URL = '/mis/act/act1104/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['TRNS_TP_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act1104/getList.do | inputCols=TRNS_TP_CD
  test.skip('[no:1] 거래유형적용일자 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1104/setCrat.do | inputCols=-
  test.skip('[no:2] 거래유형적용일자 - 저장 (setCrat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('은행코드등록 (act_1110M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1110M' OR MNU_NM LIKE '은행코드등록%'
  const MENU_ID = 'TODO_act_1110M';
  const API_URL = '/mis/act/act1110/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BK_NM', 'USE_YN', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act1110/getList.do | inputCols=BK_NM,USE_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 은행코드등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1110/getDpltCck.do | inputCols=BK_NM,USE_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:2] 은행코드등록 - 조회 (getDpltCck) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1110/setData.do | inputCols=-
  test.skip('[no:3] 은행코드등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act1110/delData.do | inputCols=-
  test.skip('[no:4] 은행코드등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('소득코드등록 (act_1120M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1120M' OR MNU_NM LIKE '소득코드등록%'
  const MENU_ID = 'TODO_act_1120M';
  const API_URL = '/mis/act/act1120/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RESI_FG', 'INME_FG', 'FRM_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act1120/getList.do | inputCols=RESI_FG,INME_FG,FRM_DT
  test.skip('[no:1] 소득코드등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1120/getBascDt.do | inputCols=RESI_FG,INME_FG,FRM_DT
  test.skip('[no:2] 소득코드등록 - 조회 (getBascDt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1120/setData.do | inputCols=-
  test.skip('[no:3] 소득코드등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('업종코드등록 (act_1130M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1130M' OR MNU_NM LIKE '업종코드등록%'
  const MENU_ID = 'TODO_act_1130M';
  const API_URL = '/mis/act/act1130/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BIZTP_NM', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act1130/getList.do | inputCols=BIZTP_NM,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 업종코드등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1130/getDpltCck.do | inputCols=BIZTP_NM,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:2] 업종코드등록 - 조회 (getDpltCck) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1130/setData.do | inputCols=-
  test.skip('[no:3] 업종코드등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('환율조회 (act_1140M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1140M' OR MNU_NM LIKE '환율조회%'
  const MENU_ID = 'TODO_act_1140M';
  const API_URL = '/mis/act/act1140/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_DT', 'CRNY_FG', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act1140/getList.do | inputCols=STDR_DT,CRNY_FG,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 환율조회 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1140/setData.do | inputCols=-
  test.skip('[no:2] 환율조회 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연계문서현황 (act_1180M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1180M' OR MNU_NM LIKE '연계문서현황%'
  const MENU_ID = 'TODO_act_1180M';
  const API_URL = '/mis/act/act1180/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['FRM_DT', 'TO_DT', 'CNTC_FG', 'TRNS_DOC_TP', 'COMBO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act1180/getList.do | inputCols=FRM_DT,TO_DT,CNTC_FG,TRNS_DOC_TP,COMBO
  test.skip('[no:1] 연계문서현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1180/setData.do | inputCols=-
  test.skip('[no:2] 연계문서현황 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act1180/delData.do | inputCols=-
  test.skip('[no:3] 연계문서현황 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연계문서조회 (act_1181M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1181M' OR MNU_NM LIKE '연계문서조회%'
  const MENU_ID = 'TODO_act_1181M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'CNTC_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 연계문서조회 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1181/getList.do | inputCols=CORP_CD,CNTC_NO
  test.skip('[no:2] 연계문서조회 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1181/setData.do | inputCols=CORP_CD,CNTC_NO,ACT_UNIT_CD,IF_DOC_NO,IF_PGM_ID,DOC_SBJ,CNTC_DT,WRT_DEPT_CD,WRT_DEPT_NM,WTER,WTER_NM,REPRS_TRNS_TP_CD,REPRS_TRNS_TP_NM,CNTC_AMT,CNTC_PROC_YN,CNTC_DOC_NO,CNTC_FG,TRNS_DOC_TP,BTN_CTRL1,BTN_CTRL2,COMBO
  test.skip('[no:3] 연계문서조회 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act1181/delData.do | inputCols=CORP_CD,CNTC_NO,ACT_UNIT_CD,IF_DOC_NO,IF_PGM_ID,DOC_SBJ,CNTC_DT,WRT_DEPT_CD,WRT_DEPT_NM,WTER,WTER_NM,REPRS_TRNS_TP_CD,REPRS_TRNS_TP_NM,CNTC_AMT,CNTC_PROC_YN,CNTC_DOC_NO,CNTC_FG,TRNS_DOC_TP,BTN_CTRL1,BTN_CTRL2,COMBO
  test.skip('[no:4] 연계문서조회 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act1181/delCntc.do | inputCols=CORP_CD,CNTC_NO,ACT_UNIT_CD,IF_DOC_NO,IF_PGM_ID,DOC_SBJ,CNTC_DT,WRT_DEPT_CD,WRT_DEPT_NM,WTER,WTER_NM,REPRS_TRNS_TP_CD,REPRS_TRNS_TP_NM,CNTC_AMT,CNTC_PROC_YN,CNTC_DOC_NO,CNTC_FG,TRNS_DOC_TP,BTN_CTRL1,BTN_CTRL2,COMBO
  test.skip('[no:5] 연계문서조회 - 삭제 (delCntc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연계정보기준관리 (act_1190M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1190M' OR MNU_NM LIKE '연계정보기준관리%'
  const MENU_ID = 'TODO_act_1190M';
  const API_URL = '/mis/act/act1190/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SLIP_OCRNC_RSN_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act1190/getList.do | inputCols=SLIP_OCRNC_RSN_CD
  test.skip('[no:1] 연계정보기준관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act1190/setData.do | inputCols=-
  test.skip('[no:2] 연계정보기준관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지출결의서 목록 (act_2010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2010M' OR MNU_NM LIKE '지출결의서 목록%'
  const MENU_ID = 'TODO_act_2010M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'WRT_DEPT_CD', 'WRT_DEPT_NM', 'WTER', 'WTER_NM', 'SBJ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 지출결의서 목록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2010/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,APV_STAT_CD,WRT_DEPT_CD,WRT_DEPT_NM,WTER,WTER_NM,SBJ
  test.skip('[no:2] 지출결의서 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지출결의서 (act_2011M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2011M' OR MNU_NM LIKE '지출결의서%'
  const MENU_ID = 'TODO_act_2011M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RESL_DT', 'RESL_NO', 'ACT_UNIT_CD', 'APRQ_DT_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 지출결의서 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2011/getData.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD,APRQ_DT_NO
  test.skip('[no:2] 지출결의서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act2011/setData.do | inputCols=-
  test.skip('[no:3] 지출결의서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act2011/delData.do | inputCols=-
  test.skip('[no:4] 지출결의서 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계정대체신청서 목록 (act_2030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2030M' OR MNU_NM LIKE '계정대체신청서 목록%'
  const MENU_ID = 'TODO_act_2030M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'WRT_DEPT_CD', 'WRT_DEPT_NM', 'WTER', 'WTER_NM', 'SBJ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 계정대체신청서 목록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2030/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,APV_STAT_CD,WRT_DEPT_CD,WRT_DEPT_NM,WTER,WTER_NM,SBJ
  test.skip('[no:2] 계정대체신청서 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계정대체신청서 (act_2031M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2031M' OR MNU_NM LIKE '계정대체신청서%'
  const MENU_ID = 'TODO_act_2031M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RESL_DT', 'RESL_NO', 'APRQ_DT_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=-
  test.skip('[no:1] 계정대체신청서 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2031/getData.do | inputCols=RESL_DT,RESL_NO,APRQ_DT_NO
  test.skip('[no:2] 계정대체신청서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act2031/setData.do | inputCols=-
  test.skip('[no:3] 계정대체신청서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act2031/delData.do | inputCols=-
  test.skip('[no:4] 계정대체신청서 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('결산전표 목록 (act_2050M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2050M' OR MNU_NM LIKE '결산전표 목록%'
  const MENU_ID = 'TODO_act_2050M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'WRT_DEPT_CD', 'WRT_DEPT_NM', 'WTER', 'WTER_NM', 'SBJ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 결산전표 목록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2050/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,APV_STAT_CD,WRT_DEPT_CD,WRT_DEPT_NM,WTER,WTER_NM,SBJ
  test.skip('[no:2] 결산전표 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('결산전표 (act_2051M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2051M' OR MNU_NM LIKE '결산전표%'
  const MENU_ID = 'TODO_act_2051M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SLIP_DT', 'SLIP_NO', 'SLIP_DT_NO', 'ACT_UNIT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 결산전표 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2051/getSlip.do | inputCols=SLIP_DT,SLIP_NO,SLIP_DT_NO,ACT_UNIT_CD
  test.skip('[no:2] 결산전표 - 조회 (getSlip) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2051/getTrnsJnl.do | inputCols=SLIP_DT,SLIP_NO,SLIP_DT_NO,ACT_UNIT_CD
  test.skip('[no:3] 결산전표 - 조회 (getTrnsJnl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getEtcTax.do | inputCols=SLIP_DT,SLIP_NO,SLIP_DT_NO,ACT_UNIT_CD
  test.skip('[no:4] 결산전표 - 조회 (getEtcTax) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act2051/setData.do | inputCols=-
  test.skip('[no:5] 결산전표 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act2051/delData.do | inputCols=-
  test.skip('[no:6] 결산전표 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act0002/uptAddresCrtfcAt2.do | inputCols=-
  test.skip('[no:7] 결산전표 - 수정 (uptAddresCrtfcAt2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('가지급금지급신청서 목록 (act_2060M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2060M' OR MNU_NM LIKE '가지급금지급신청서 목록%'
  const MENU_ID = 'TODO_act_2060M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'WRT_DEPT_CD', 'WRT_DEPT_NM', 'WTER', 'WTER_NM', 'SBJ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 가지급금지급신청서 목록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2060/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,APV_STAT_CD,WRT_DEPT_CD,WRT_DEPT_NM,WTER,WTER_NM,SBJ
  test.skip('[no:2] 가지급금지급신청서 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('가지급금지급신청서 (act_2061M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2061M' OR MNU_NM LIKE '가지급금지급신청서%'
  const MENU_ID = 'TODO_act_2061M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RESL_DT', 'RESL_NO', 'ACT_UNIT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=-
  test.skip('[no:1] 가지급금지급신청서 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2061/getData.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD
  test.skip('[no:2] 가지급금지급신청서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act2061/setData.do | inputCols=-
  test.skip('[no:3] 가지급금지급신청서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act2061/delData.do | inputCols=-
  test.skip('[no:4] 가지급금지급신청서 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act0002/uptAddresCrtfcAt2.do | inputCols=-
  test.skip('[no:5] 가지급금지급신청서 - 수정 (uptAddresCrtfcAt2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('가지급금정산신청서 목록 (act_2070M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2070M' OR MNU_NM LIKE '가지급금정산신청서 목록%'
  const MENU_ID = 'TODO_act_2070M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'WRT_DEPT_CD', 'WRT_DEPT_NM', 'WTER', 'WTER_NM', 'SBJ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 가지급금정산신청서 목록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2070/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,APV_STAT_CD,WRT_DEPT_CD,WRT_DEPT_NM,WTER,WTER_NM,SBJ
  test.skip('[no:2] 가지급금정산신청서 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('가지급금정산신청서 (act_2071M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2071M' OR MNU_NM LIKE '가지급금정산신청서%'
  const MENU_ID = 'TODO_act_2071M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RESL_DT', 'RESL_NO', 'ACT_UNIT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 가지급금정산신청서 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2071/getPreResl.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD
  test.skip('[no:2] 가지급금정산신청서 - 조회 (getPreResl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2071/getData.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD
  test.skip('[no:3] 가지급금정산신청서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act2071/setData.do | inputCols=-
  test.skip('[no:4] 가지급금정산신청서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act2071/delData.do | inputCols=-
  test.skip('[no:5] 가지급금정산신청서 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('선급금지급신청서 목록 (act_2080M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2080M' OR MNU_NM LIKE '선급금지급신청서 목록%'
  const MENU_ID = 'TODO_act_2080M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'WRT_DEPT_CD', 'WRT_DEPT_NM', 'WTER', 'WTER_NM', 'SBJ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 선급금지급신청서 목록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2080/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,APV_STAT_CD,WRT_DEPT_CD,WRT_DEPT_NM,WTER,WTER_NM,SBJ
  test.skip('[no:2] 선급금지급신청서 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('선급금지급신청서 (act_2081M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2081M' OR MNU_NM LIKE '선급금지급신청서%'
  const MENU_ID = 'TODO_act_2081M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RESL_DT', 'RESL_NO', 'ACT_UNIT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=-
  test.skip('[no:1] 선급금지급신청서 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2061/getData.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD
  test.skip('[no:2] 선급금지급신청서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act2061/setData.do | inputCols=-
  test.skip('[no:3] 선급금지급신청서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act2061/delData.do | inputCols=-
  test.skip('[no:4] 선급금지급신청서 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act0002/uptAddresCrtfcAt2.do | inputCols=-
  test.skip('[no:5] 선급금지급신청서 - 수정 (uptAddresCrtfcAt2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('선급금정산신청서 목록 (act_2090M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2090M' OR MNU_NM LIKE '선급금정산신청서 목록%'
  const MENU_ID = 'TODO_act_2090M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'WRT_DEPT_CD', 'WRT_DEPT_NM', 'WTER', 'WTER_NM', 'SBJ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 선급금정산신청서 목록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2090/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,APV_STAT_CD,WRT_DEPT_CD,WRT_DEPT_NM,WTER,WTER_NM,SBJ
  test.skip('[no:2] 선급금정산신청서 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('선급금정산신청서 (act_2091M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2091M' OR MNU_NM LIKE '선급금정산신청서%'
  const MENU_ID = 'TODO_act_2091M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RESL_DT', 'RESL_NO', 'ACT_UNIT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 선급금정산신청서 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2071/getPreResl.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD
  test.skip('[no:2] 선급금정산신청서 - 조회 (getPreResl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2071/getData.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD
  test.skip('[no:3] 선급금정산신청서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act2071/setData.do | inputCols=-
  test.skip('[no:4] 선급금정산신청서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act2071/delData.do | inputCols=-
  test.skip('[no:5] 선급금정산신청서 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('수입의뢰서 (act_2110M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2110M' OR MNU_NM LIKE '수입의뢰서%'
  const MENU_ID = 'TODO_act_2110M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['공통조건', 'ACT_UNIT_CD', '입금내역', 'ACNO_FRM_DT', 'ACNO_TO_DT', 'ACNO_SMRY', 'ACC_NO', 'PROC_FG', '의뢰내역', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'WRT_DEPT_CD', 'WRT_DEPT_NM', 'WTER', 'WTER_NM', 'SBJ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 수입의뢰서 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2110/getListTab1.do | inputCols=공통조건,ACT_UNIT_CD,입금내역,ACNO_FRM_DT,ACNO_TO_DT,ACNO_SMRY,ACC_NO,PROC_FG,의뢰내역,FRM_DT,TO_DT,APV_STAT_CD,WRT_DEPT_CD,WRT_DEPT_NM,WTER,WTER_NM,SBJ
  test.skip('[no:2] 수입의뢰서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2110/getListTab2.do | inputCols=공통조건,ACT_UNIT_CD,입금내역,ACNO_FRM_DT,ACNO_TO_DT,ACNO_SMRY,ACC_NO,PROC_FG,의뢰내역,FRM_DT,TO_DT,APV_STAT_CD,WRT_DEPT_CD,WRT_DEPT_NM,WTER,WTER_NM,SBJ
  test.skip('[no:3] 수입의뢰서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('수입의뢰서 (act_2111M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2111M' OR MNU_NM LIKE '수입의뢰서%'
  const MENU_ID = 'TODO_act_2111M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RESL_DT', 'RESL_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 수입의뢰서 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2111/getData.do | inputCols=RESL_DT,RESL_NO
  test.skip('[no:2] 수입의뢰서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act2111/setData.do | inputCols=-
  test.skip('[no:3] 수입의뢰서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act2111/delData.do | inputCols=-
  test.skip('[no:4] 수입의뢰서 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('여입의뢰서 (act_2112M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2112M' OR MNU_NM LIKE '여입의뢰서%'
  const MENU_ID = 'TODO_act_2112M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RESL_DT', 'RESL_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 여입의뢰서 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2111/getData.do | inputCols=RESL_DT,RESL_NO
  test.skip('[no:2] 여입의뢰서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act2111/setData.do | inputCols=-
  test.skip('[no:3] 여입의뢰서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act2111/delData.do | inputCols=-
  test.skip('[no:4] 여입의뢰서 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('입금(가수금)처리 (act_2210M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2210M' OR MNU_NM LIKE '입금(가수금)처리%'
  const MENU_ID = 'TODO_act_2210M';
  const API_URL = '/mis/act/act2210/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['UNTY_SACH_FG', 'UNTY_SACH_KEY', 'DT_CLS', 'TRNS_DT', 'TRNS_FRM_DT', 'TRNS_TO_DT', 'PROC_YN', 'ALL_ACC_YN', 'MOVE_CLS', 'DPSTS_TRNS_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act2210/getList.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,DT_CLS,TRNS_DT,TRNS_FRM_DT,TRNS_TO_DT,PROC_YN,ALL_ACC_YN,MOVE_CLS,DPSTS_TRNS_NO
  test.skip('[no:1] 입금(가수금)처리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2210/getSeffList.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,DT_CLS,TRNS_DT,TRNS_FRM_DT,TRNS_TO_DT,PROC_YN,ALL_ACC_YN,MOVE_CLS,DPSTS_TRNS_NO
  test.skip('[no:2] 입금(가수금)처리 - 조회 (getSeffList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2210/getTrnsDt.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,DT_CLS,TRNS_DT,TRNS_FRM_DT,TRNS_TO_DT,PROC_YN,ALL_ACC_YN,MOVE_CLS,DPSTS_TRNS_NO
  test.skip('[no:3] 입금(가수금)처리 - 조회 (getTrnsDt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act2210/uptHiddenYn.do | inputCols=-
  test.skip('[no:4] 입금(가수금)처리 - 수정 (uptHiddenYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act2210/setData.do | inputCols=-
  test.skip('[no:5] 입금(가수금)처리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('가수금정산 (act_2220M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2220M' OR MNU_NM LIKE '가수금정산%'
  const MENU_ID = 'TODO_act_2220M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'INVPRT_NM', 'PROC_STAT_CD', 'DPSTS_TP', 'ACC_NO', 'BK_CD', 'BK_NM', 'FRM_AMT', 'TO_AMT', '자동전표', 'SBJ', 'SLIP_DT', 'TRNS_TP_CD', 'TRNS_ITM_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID,ADD
  test.skip('[no:1] 가수금정산 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2220/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,INVPRT_NM,PROC_STAT_CD,DPSTS_TP,ACC_NO,BK_CD,BK_NM,FRM_AMT,TO_AMT,자동전표,SBJ,SLIP_DT,TRNS_TP_CD,TRNS_ITM_CD
  test.skip('[no:2] 가수금정산 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act2220/setPbck.do | inputCols=-
  test.skip('[no:3] 가수금정산 - 저장 (setPbck) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act2220/setData.do | inputCols=-
  test.skip('[no:4] 가수금정산 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act2220/delData.do | inputCols=-
  test.skip('[no:5] 가수금정산 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지급신청서 현황 (act_2310M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2310M' OR MNU_NM LIKE '지급신청서 현황%'
  const MENU_ID = 'TODO_act_2310M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'FNRS_FG', 'WRT_DEPT_NM', 'WRT_DEPT_CD', 'WTER_NM', 'WTER', 'RESL_TP', 'RESL_NO', 'SLIP_NO', 'SBJ', 'IF_DOC_NO', 'APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 지급신청서 현황 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2310/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,FNRS_FG,WRT_DEPT_NM,WRT_DEPT_CD,WTER_NM,WTER,RESL_TP,RESL_NO,SLIP_NO,SBJ,IF_DOC_NO,APV_STAT_CD
  test.skip('[no:2] 지급신청서 현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('발의내역 (act_2590M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2590M' OR MNU_NM LIKE '발의내역%'
  const MENU_ID = 'TODO_act_2590M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'ITNCER', 'ITNCER_NM', 'WTER', 'WTER_NM', 'SBJ', 'UNTY_SACH_FG', 'UNTY_SACH_KEY', 'RESL_TP', 'DOC_DT_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 발의내역 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getConf.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,APV_STAT_CD,ITNCER,ITNCER_NM,WTER,WTER_NM,SBJ,UNTY_SACH_FG,UNTY_SACH_KEY,RESL_TP,DOC_DT_NO
  test.skip('[no:2] 발의내역 - 조회 (getConf) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act2590/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,APV_STAT_CD,ITNCER,ITNCER_NM,WTER,WTER_NM,SBJ,UNTY_SACH_FG,UNTY_SACH_KEY,RESL_TP,DOC_DT_NO
  test.skip('[no:3] 발의내역 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회계결의서 목록 (act_3010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3010M' OR MNU_NM LIKE '회계결의서 목록%'
  const MENU_ID = 'TODO_act_3010M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'SLIP_TP', 'RQST_NO', 'FNRS_FG', 'SBJ', 'ACCP_YN', 'APV_STAT_CD', 'SCH_WTER_NM', 'SCH_WTER_ID'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 회계결의서 목록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3010/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,SLIP_TP,RQST_NO,FNRS_FG,SBJ,ACCP_YN,APV_STAT_CD,SCH_WTER_NM,SCH_WTER_ID
  test.skip('[no:2] 회계결의서 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회계결의서 등록 (act_3011M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3011M' OR MNU_NM LIKE '회계결의서 등록%'
  const MENU_ID = 'TODO_act_3011M';
  const API_URL = '/mis/act/act3011/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SLIP_DT', 'SLIP_NO', 'SLIP_DT_NO', 'ACT_UNIT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act3011/getData.do | inputCols=SLIP_DT,SLIP_NO,SLIP_DT_NO,ACT_UNIT_CD
  test.skip('[no:1] 회계결의서 등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3011/getData3011P.do | inputCols=SLIP_DT,SLIP_NO,SLIP_DT_NO,ACT_UNIT_CD
  test.skip('[no:2] 회계결의서 등록 - 조회 (getData3011P) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3011/getTrnsTpcd.do | inputCols=SLIP_DT,SLIP_NO,SLIP_DT_NO,ACT_UNIT_CD
  test.skip('[no:3] 회계결의서 등록 - 조회 (getTrnsTpcd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act3011/setData.do | inputCols=-
  test.skip('[no:4] 회계결의서 등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act3011/delData.do | inputCols=-
  test.skip('[no:5] 회계결의서 등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=-
  test.skip('[no:6] 회계결의서 등록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act0002/uptAddresCrtfcAt2.do | inputCols=-
  test.skip('[no:7] 회계결의서 등록 - 수정 (uptAddresCrtfcAt2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getEtcTax.do | inputCols=SLIP_DT,SLIP_NO,SLIP_DT_NO,ACT_UNIT_CD
  test.skip('[no:8] 회계결의서 등록 - 조회 (getEtcTax) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('전표처리 (act_3030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3030M' OR MNU_NM LIKE '전표처리%'
  const MENU_ID = 'TODO_act_3030M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'ACCP_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 전표처리 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3030/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,ACCP_YN
  test.skip('[no:2] 전표처리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act3030/setData.do | inputCols=-
  test.skip('[no:3] 전표처리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act3030/uptData.do | inputCols=-
  test.skip('[no:4] 전표처리 - 수정 (uptData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회계결의서 목록 (act_3040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3040M' OR MNU_NM LIKE '회계결의서 목록%'
  const MENU_ID = 'TODO_act_3040M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'SLIP_TP', 'SLIP_DT_NO', 'FNRS_FG', 'SBJ', 'ACCP_YN', 'APV_STAT_CD', 'SCH_WTER_NM', 'SCH_WTER_ID'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 회계결의서 목록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3040/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,SLIP_TP,SLIP_DT_NO,FNRS_FG,SBJ,ACCP_YN,APV_STAT_CD,SCH_WTER_NM,SCH_WTER_ID
  test.skip('[no:2] 회계결의서 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회계전표 등록 (act_3041M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3041M' OR MNU_NM LIKE '회계전표 등록%'
  const MENU_ID = 'TODO_act_3041M';
  const API_URL = '/mis/act/act0000/getConf.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SLIP_DT', 'SLIP_NO', 'SLIP_DT_NO', 'ACT_UNIT_CD', 'REPRS_TRNS_TP_CD', 'ENRN_FAOR_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getConf.do | inputCols=SLIP_DT,SLIP_NO,SLIP_DT_NO,ACT_UNIT_CD,REPRS_TRNS_TP_CD,ENRN_FAOR_CD
  test.skip('[no:1] 회계전표 등록 - 조회 (getConf) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=-
  test.skip('[no:2] 회계전표 등록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3041/getData.do | inputCols=SLIP_DT,SLIP_NO,SLIP_DT_NO,ACT_UNIT_CD,REPRS_TRNS_TP_CD,ENRN_FAOR_CD
  test.skip('[no:3] 회계전표 등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3041/getTrnsJnl.do | inputCols=SLIP_DT,SLIP_NO,SLIP_DT_NO,ACT_UNIT_CD,REPRS_TRNS_TP_CD,ENRN_FAOR_CD
  test.skip('[no:4] 회계전표 등록 - 조회 (getTrnsJnl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act3041/setData.do | inputCols=-
  test.skip('[no:5] 회계전표 등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act3041/delData.do | inputCols=-
  test.skip('[no:6] 회계전표 등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act0002/uptAddresCrtfcAt2.do | inputCols=-
  test.skip('[no:7] 회계전표 등록 - 수정 (uptAddresCrtfcAt2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getEtcTax.do | inputCols=SLIP_DT,SLIP_NO,SLIP_DT_NO,ACT_UNIT_CD,REPRS_TRNS_TP_CD,ENRN_FAOR_CD
  test.skip('[no:8] 회계전표 등록 - 조회 (getEtcTax) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('미결관리 (act_3050M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3050M' OR MNU_NM LIKE '미결관리%'
  const MENU_ID = 'TODO_act_3050M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'SMRY', 'PBCK_STAT', 'SBJ', 'SLIP_DT', 'PTNE_ACCT_CD', 'PTNE_ACCT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID,ADD
  test.skip('[no:1] 미결관리 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3050/getList1.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,SMRY,PBCK_STAT,SBJ,SLIP_DT,PTNE_ACCT_CD,PTNE_ACCT_NM
  test.skip('[no:2] 미결관리 - 조회 (getList1) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3050/getList2.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,SMRY,PBCK_STAT,SBJ,SLIP_DT,PTNE_ACCT_CD,PTNE_ACCT_NM
  test.skip('[no:3] 미결관리 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act3050/setData.do | inputCols=-
  test.skip('[no:4] 미결관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act3050/uptData.do | inputCols=-
  test.skip('[no:5] 미결관리 - 수정 (uptData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('분개장 (act_3510M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3510M' OR MNU_NM LIKE '분개장%'
  const MENU_ID = 'TODO_act_3510M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_MNG_CD', 'STR_UNIT_CD', 'FRM_DT', 'TO_DT', 'SLIP_TP'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=-
  test.skip('[no:1] 분개장 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3510/getList.do | inputCols=ACT_UNIT_MNG_CD,STR_UNIT_CD,FRM_DT,TO_DT,SLIP_TP
  test.skip('[no:2] 분개장 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계정별원장 (act_3520M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3520M' OR MNU_NM LIKE '계정별원장%'
  const MENU_ID = 'TODO_act_3520M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=-
  test.skip('[no:1] 계정별원장 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3520/getTab1List1.do | inputCols=-
  test.skip('[no:2] 계정별원장 - 조회 (getMain) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3520/getTab2List.do | inputCols=-
  test.skip('[no:3] 계정별원장 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3520/getTab1List2.do | inputCols=-
  test.skip('[no:4] 계정별원장 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act0000/setActGl.do | inputCols=-
  test.skip('[no:5] 계정별원장 - 저장 (setActGl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('총계정원장 (act_3530M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3530M' OR MNU_NM LIKE '총계정원장%'
  const MENU_ID = 'TODO_act_3530M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'FRM_ACCT_CD', 'FRM_ACCT_NM', 'TO_ACCT_CD', 'TO_ACCT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,FRM_ACCT_CD,FRM_ACCT_NM,TO_ACCT_CD,TO_ACCT_NM
  test.skip('[no:1] 총계정원장 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3530/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,FRM_ACCT_CD,FRM_ACCT_NM,TO_ACCT_CD,TO_ACCT_NM
  test.skip('[no:2] 총계정원장 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3530/getMain.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,FRM_ACCT_CD,FRM_ACCT_NM,TO_ACCT_CD,TO_ACCT_NM
  test.skip('[no:3] 총계정원장 - 조회 (getMain) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('현금출납장 (act_3540M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3540M' OR MNU_NM LIKE '현금출납장%'
  const MENU_ID = 'TODO_act_3540M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_MNG_CD', 'STR_UNIT_CD', 'FRM_DT', 'TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=-
  test.skip('[no:1] 현금출납장 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3540/getList.do | inputCols=ACT_UNIT_MNG_CD,STR_UNIT_CD,FRM_DT,TO_DT
  test.skip('[no:2] 현금출납장 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('일(월)계표 (act_3550M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3550M' OR MNU_NM LIKE '일(월)계표%'
  const MENU_ID = 'TODO_act_3550M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT
  test.skip('[no:1] 일(월)계표 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mgt/cfg/cfg0520/getFsFormCd.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT
  test.skip('[no:2] 일(월)계표 - 조회 (getFsFormCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act3550/setDMS.do | inputCols=-
  test.skip('[no:3] 일(월)계표 - 저장 (setDMS) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act3550/setTb.do | inputCols=-
  test.skip('[no:4] 일(월)계표 - 저장 (setTb) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('거래처원장 (act_3560M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3560M' OR MNU_NM LIKE '거래처원장%'
  const MENU_ID = 'TODO_act_3560M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'STR_UNIT_CD', 'FRM_DT', 'TO_DT', 'ACCT_CD', 'ACCT_NM', 'FRM_CUST_CD', 'FRM_CUST_NM', 'TO_CUST_CD', 'TO_CUST_NM', 'CUST_CD', 'CUST_NM', 'FRM_AMT', 'TO_AMT', 'DR_FRM_AMT', 'DR_TO_AMT', 'CR_FRM_AMT', 'CR_TO_AMT', 'SMRY', 'ALL_YN', 'SIGN', 'SLIP_DT', 'SLIP_NO', 'SLIP_SEQ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 거래처원장 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3560/getList.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FRM_DT,TO_DT,ACCT_CD,ACCT_NM,FRM_CUST_CD,FRM_CUST_NM,TO_CUST_CD,TO_CUST_NM,CUST_CD,CUST_NM,FRM_AMT,TO_AMT,DR_FRM_AMT,DR_TO_AMT,CR_FRM_AMT,CR_TO_AMT,SMRY,ALL_YN,SIGN,SLIP_DT,SLIP_NO,SLIP_SEQ
  test.skip('[no:2] 거래처원장 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3560/getCustMaxMin.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FRM_DT,TO_DT,ACCT_CD,ACCT_NM,FRM_CUST_CD,FRM_CUST_NM,TO_CUST_CD,TO_CUST_NM,CUST_CD,CUST_NM,FRM_AMT,TO_AMT,DR_FRM_AMT,DR_TO_AMT,CR_FRM_AMT,CR_TO_AMT,SMRY,ALL_YN,SIGN,SLIP_DT,SLIP_NO,SLIP_SEQ
  test.skip('[no:3] 거래처원장 - 조회 (getCustMaxMin) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3560/getMove.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FRM_DT,TO_DT,ACCT_CD,ACCT_NM,FRM_CUST_CD,FRM_CUST_NM,TO_CUST_CD,TO_CUST_NM,CUST_CD,CUST_NM,FRM_AMT,TO_AMT,DR_FRM_AMT,DR_TO_AMT,CR_FRM_AMT,CR_TO_AMT,SMRY,ALL_YN,SIGN,SLIP_DT,SLIP_NO,SLIP_SEQ
  test.skip('[no:4] 거래처원장 - 조회 (getMove) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('보조부원장 (act_3610M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3610M' OR MNU_NM LIKE '보조부원장%'
  const MENU_ID = 'TODO_act_3610M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'STR_UNIT_CD', 'FRM_DT', 'TO_DT', 'ZERO_YN', 'ACCT_CLS', 'ACCT_CD', 'ACCT_NM', 'MNG_ITM_CD1', 'MNG_ITM_NM1', 'BALC_MNG_FG1', 'MNG_ITM_CD2', 'MNG_ITM_NM2', 'BALC_MNG_FG2', 'MNG_ITM_CD3', 'MNG_ITM_NM3', 'BALC_MNG_FG3', 'FR_MNG_ITM_VAL_1', 'FR_MNG_ITM_VAL_NM_1', 'TO_MNG_ITM_VAL_1', 'TO_MNG_ITM_VAL_NM_1', 'FR_MNG_ITM_VAL_2', 'FR_MNG_ITM_VAL_NM_2', 'TO_MNG_ITM_VAL_2', 'TO_MNG_ITM_VAL_NM_2', 'FR_MNG_ITM_VAL_3', 'FR_MNG_ITM_VAL_NM_3', 'TO_MNG_ITM_VAL_3', 'TO_MNG_ITM_VAL_NM_3', 'FR_MNG_ITM_YN', 'TO_MNG_ITM_YN', 'TO_MNG_ITM_YN2', 'POP_FILE_PATH1', 'POP_FILE_PATH2', 'POP_FILE_PATH3', 'DTA_TP1', 'DTA_TP2', 'DTA_TP3'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 보조부원장 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3610/getList.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FRM_DT,TO_DT,ZERO_YN,ACCT_CLS,ACCT_CD,ACCT_NM,MNG_ITM_CD1,MNG_ITM_NM1,BALC_MNG_FG1,MNG_ITM_CD2,MNG_ITM_NM2,BALC_MNG_FG2,MNG_ITM_CD3,MNG_ITM_NM3,BALC_MNG_FG3,FR_MNG_ITM_VAL_1,FR_MNG_ITM_VAL_NM_1,TO_MNG_ITM_VAL_1,TO_MNG_ITM_VAL_NM_1,FR_MNG_ITM_VAL_2,FR_MNG_ITM_VAL_NM_2,TO_MNG_ITM_VAL_2,TO_MNG_ITM_VAL_NM_2,FR_MNG_ITM_VAL_3,FR_MNG_ITM_VAL_NM_3,TO_MNG_ITM_VAL_3,TO_MNG_ITM_VAL_NM_3,FR_MNG_ITM_YN,TO_MNG_ITM_YN,TO_MNG_ITM_YN2,POP_FILE_PATH1,POP_FILE_PATH2,POP_FILE_PATH3,DTA_TP1,DTA_TP2,DTA_TP3
  test.skip('[no:2] 보조부원장 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0001/getActSublItmList.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FRM_DT,TO_DT,ZERO_YN,ACCT_CLS,ACCT_CD,ACCT_NM,MNG_ITM_CD1,MNG_ITM_NM1,BALC_MNG_FG1,MNG_ITM_CD2,MNG_ITM_NM2,BALC_MNG_FG2,MNG_ITM_CD3,MNG_ITM_NM3,BALC_MNG_FG3,FR_MNG_ITM_VAL_1,FR_MNG_ITM_VAL_NM_1,TO_MNG_ITM_VAL_1,TO_MNG_ITM_VAL_NM_1,FR_MNG_ITM_VAL_2,FR_MNG_ITM_VAL_NM_2,TO_MNG_ITM_VAL_2,TO_MNG_ITM_VAL_NM_2,FR_MNG_ITM_VAL_3,FR_MNG_ITM_VAL_NM_3,TO_MNG_ITM_VAL_3,TO_MNG_ITM_VAL_NM_3,FR_MNG_ITM_YN,TO_MNG_ITM_YN,TO_MNG_ITM_YN2,POP_FILE_PATH1,POP_FILE_PATH2,POP_FILE_PATH3,DTA_TP1,DTA_TP2,DTA_TP3
  test.skip('[no:3] 보조부원장 - 조회 (getActSublItm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0001/getMgtItmCdMaxMinData.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FRM_DT,TO_DT,ZERO_YN,ACCT_CLS,ACCT_CD,ACCT_NM,MNG_ITM_CD1,MNG_ITM_NM1,BALC_MNG_FG1,MNG_ITM_CD2,MNG_ITM_NM2,BALC_MNG_FG2,MNG_ITM_CD3,MNG_ITM_NM3,BALC_MNG_FG3,FR_MNG_ITM_VAL_1,FR_MNG_ITM_VAL_NM_1,TO_MNG_ITM_VAL_1,TO_MNG_ITM_VAL_NM_1,FR_MNG_ITM_VAL_2,FR_MNG_ITM_VAL_NM_2,TO_MNG_ITM_VAL_2,TO_MNG_ITM_VAL_NM_2,FR_MNG_ITM_VAL_3,FR_MNG_ITM_VAL_NM_3,TO_MNG_ITM_VAL_3,TO_MNG_ITM_VAL_NM_3,FR_MNG_ITM_YN,TO_MNG_ITM_YN,TO_MNG_ITM_YN2,POP_FILE_PATH1,POP_FILE_PATH2,POP_FILE_PATH3,DTA_TP1,DTA_TP2,DTA_TP3
  test.skip('[no:4] 보조부원장 - 조회 (getMgtItmCdMaxMinData1) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('보조부원장상세 (act_3620M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3620M' OR MNU_NM LIKE '보조부원장상세%'
  const MENU_ID = 'TODO_act_3620M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'STR_UNIT_CD', 'FRM_DT', 'TO_DT', 'ZERO_YN', 'ACCT_CLS', 'ACCT_CD', 'ACCT_NM', 'MNG_ITM_CD1', 'BALC_MNG_FG1', 'MNG_ITM_CD2', 'BALC_MNG_FG2', 'MNG_ITM_CD3', 'BALC_MNG_FG3', 'MNG_ITM_VAL1', 'MNG_ITM_VAL_NM1', 'MNG_ITM_VAL2', 'MNG_ITM_VAL_NM2', 'MNG_ITM_VAL3', 'MNG_ITM_VAL_NM3', 'POP_FILE_PATH1', 'POP_FILE_PATH2', 'POP_FILE_PATH3', 'SIGN', 'MNG_ITM_CD', 'MNG_ITM_VAL', 'DTA_TP1', 'DTA_TP2', 'DTA_TP3'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 보조부원장상세 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3620/getData.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FRM_DT,TO_DT,ZERO_YN,ACCT_CLS,ACCT_CD,ACCT_NM,MNG_ITM_CD1,BALC_MNG_FG1,MNG_ITM_CD2,BALC_MNG_FG2,MNG_ITM_CD3,BALC_MNG_FG3,MNG_ITM_VAL1,MNG_ITM_VAL_NM1,MNG_ITM_VAL2,MNG_ITM_VAL_NM2,MNG_ITM_VAL3,MNG_ITM_VAL_NM3,POP_FILE_PATH1,POP_FILE_PATH2,POP_FILE_PATH3,SIGN,MNG_ITM_CD,MNG_ITM_VAL,DTA_TP1,DTA_TP2,DTA_TP3
  test.skip('[no:2] 보조부원장상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3620/getMgtItmVal.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FRM_DT,TO_DT,ZERO_YN,ACCT_CLS,ACCT_CD,ACCT_NM,MNG_ITM_CD1,BALC_MNG_FG1,MNG_ITM_CD2,BALC_MNG_FG2,MNG_ITM_CD3,BALC_MNG_FG3,MNG_ITM_VAL1,MNG_ITM_VAL_NM1,MNG_ITM_VAL2,MNG_ITM_VAL_NM2,MNG_ITM_VAL3,MNG_ITM_VAL_NM3,POP_FILE_PATH1,POP_FILE_PATH2,POP_FILE_PATH3,SIGN,MNG_ITM_CD,MNG_ITM_VAL,DTA_TP1,DTA_TP2,DTA_TP3
  test.skip('[no:3] 보조부원장상세 - 조회 (getMgtItmVal) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0001/getActSublItmList.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FRM_DT,TO_DT,ZERO_YN,ACCT_CLS,ACCT_CD,ACCT_NM,MNG_ITM_CD1,BALC_MNG_FG1,MNG_ITM_CD2,BALC_MNG_FG2,MNG_ITM_CD3,BALC_MNG_FG3,MNG_ITM_VAL1,MNG_ITM_VAL_NM1,MNG_ITM_VAL2,MNG_ITM_VAL_NM2,MNG_ITM_VAL3,MNG_ITM_VAL_NM3,POP_FILE_PATH1,POP_FILE_PATH2,POP_FILE_PATH3,SIGN,MNG_ITM_CD,MNG_ITM_VAL,DTA_TP1,DTA_TP2,DTA_TP3
  test.skip('[no:4] 보조부원장상세 - 조회 (getActSublItm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회계결의서 목록 (act_3910M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3910M' OR MNU_NM LIKE '회계결의서 목록%'
  const MENU_ID = 'TODO_act_3910M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'SLIP_TP', 'RQST_NO', 'FNRS_FG', 'SBJ', 'ACCP_YN', 'APV_STAT_CD', 'SCH_WTER_NM', 'SCH_WTER_ID'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 회계결의서 목록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3910/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,SLIP_TP,RQST_NO,FNRS_FG,SBJ,ACCP_YN,APV_STAT_CD,SCH_WTER_NM,SCH_WTER_ID
  test.skip('[no:2] 회계결의서 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회계결의서 등록 (act_3911M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3911M' OR MNU_NM LIKE '회계결의서 등록%'
  const MENU_ID = 'TODO_act_3911M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SLIP_DT', 'SLIP_NO', 'SLIP_DT_NO', 'ACT_UNIT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=-
  test.skip('[no:1] 회계결의서 등록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3911/getData.do | inputCols=SLIP_DT,SLIP_NO,SLIP_DT_NO,ACT_UNIT_CD
  test.skip('[no:2] 회계결의서 등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3911/getData3911P.do | inputCols=SLIP_DT,SLIP_NO,SLIP_DT_NO,ACT_UNIT_CD
  test.skip('[no:3] 회계결의서 등록 - 조회 (getData3911P) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act3911/setData.do | inputCols=-
  test.skip('[no:4] 회계결의서 등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act3911/delData.do | inputCols=-
  test.skip('[no:5] 회계결의서 등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act0000/uptAddresCrtfcAt2.do | inputCols=-
  test.skip('[no:6] 회계결의서 등록 - 수정 (uptAddresCrtfcAt2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getEtcTax.do | inputCols=SLIP_DT,SLIP_NO,SLIP_DT_NO,ACT_UNIT_CD
  test.skip('[no:7] 회계결의서 등록 - 조회 (getEtcTax) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('전표처리 (act_3920M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3920M' OR MNU_NM LIKE '전표처리%'
  const MENU_ID = 'TODO_act_3920M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'SLIP_TP', 'RQST_NO', 'FNRS_FG', 'SBJ', 'ACCP_YN', 'SELECT_CNT', 'SETT_ACCP_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 전표처리 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3920/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,SLIP_TP,RQST_NO,FNRS_FG,SBJ,ACCP_YN,SELECT_CNT,SETT_ACCP_DT
  test.skip('[no:2] 전표처리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act3920/setData.do | inputCols=-
  test.skip('[no:3] 전표처리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act3920/uptData.do | inputCols=-
  test.skip('[no:4] 전표처리 - 수정 (uptData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연계 목록 (act_3990M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3990M' OR MNU_NM LIKE '연계 목록%'
  const MENU_ID = 'TODO_act_3990M';
  const API_URL = '/mis/act/act3990/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_SBJ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act3990/getList.do | inputCols=SCH_FRM_DT,SCH_TO_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_SBJ
  test.skip('[no:1] 연계 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연계 등록 (act_3991M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3991M' OR MNU_NM LIKE '연계 등록%'
  const MENU_ID = 'TODO_act_3991M';
  const API_URL = '/mis/act/act3991/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act3991/getData.do | inputCols=-
  test.skip('[no:1] 연계 등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3991/getStdrData.do | inputCols=-
  test.skip('[no:2] 연계 등록 - 조회 (getStdrData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act3991/setData.do | inputCols=-
  test.skip('[no:3] 연계 등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act3991/delData.do | inputCols=-
  test.skip('[no:4] 연계 등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('분개내역조회 (act_3992M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3992M' OR MNU_NM LIKE '분개내역조회%'
  const MENU_ID = 'TODO_act_3992M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SLIP_DT', 'SLIP_NO', 'ACT_UNIT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 분개내역조회 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3992/getSlipData.do | inputCols=SLIP_DT,SLIP_NO,ACT_UNIT_CD
  test.skip('[no:2] 분개내역조회 - 조회 (getSlipData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3992/getData.do | inputCols=SLIP_DT,SLIP_NO,ACT_UNIT_CD
  test.skip('[no:3] 분개내역조회 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('합계잔액시산표 (act_4010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4010M' OR MNU_NM LIKE '합계잔액시산표%'
  const MENU_ID = 'TODO_act_4010M';
  const API_URL = '/mis/act/act0000/getPeriod.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT', 'STDR_YY', 'ENRN_FAOR_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getPeriod.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT,STDR_YY,ENRN_FAOR_CD
  test.skip('[no:1] 합계잔액시산표 - 조회 (getPeriod) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getConf.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT,STDR_YY,ENRN_FAOR_CD
  test.skip('[no:2] 합계잔액시산표 - 조회 (getConf) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mgt/cfg/cfg0520/getFsFormCd.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT,STDR_YY,ENRN_FAOR_CD
  test.skip('[no:3] 합계잔액시산표 - 조회 (getFsFormCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4010/setTb.do | inputCols=-
  test.skip('[no:4] 합계잔액시산표 - 저장 (setTb) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act0000/setActGl.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT,STDR_YY,ENRN_FAOR_CD
  test.skip('[no:5] 합계잔액시산표 - 저장 (setActGl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT,STDR_YY,ENRN_FAOR_CD
  test.skip('[no:6] 합계잔액시산표 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('재무상태표 (act_4020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4020M' OR MNU_NM LIKE '재무상태표%'
  const MENU_ID = 'TODO_act_4020M';
  const API_URL = '/mis/act/act0000/getConf.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT', 'ENRN_FAOR_CD', 'STDR_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getConf.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT,ENRN_FAOR_CD,STDR_YY
  test.skip('[no:1] 재무상태표 - 조회 (getConf) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getPeriod.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT,ENRN_FAOR_CD,STDR_YY
  test.skip('[no:2] 재무상태표 - 조회 (getPeriod) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mgt/cfg/cfg0520/getFsFormCd.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT,ENRN_FAOR_CD,STDR_YY
  test.skip('[no:3] 재무상태표 - 조회 (getFsFormCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4020/setBs.do | inputCols=-
  test.skip('[no:4] 재무상태표 - 저장 (setBs) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:5] 재무상태표 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연구운영성과표 (act_4030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4030M' OR MNU_NM LIKE '연구운영성과표%'
  const MENU_ID = 'TODO_act_4030M';
  const API_URL = '/mis/act/act0000/getPeriod.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT', 'ENRN_FAOR_CD', 'STDR_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getPeriod.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT,ENRN_FAOR_CD,STDR_YY
  test.skip('[no:1] 연구운영성과표 - 조회 (getPeriod) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mgt/cfg/cfg0520/getFsFormCd.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT,ENRN_FAOR_CD,STDR_YY
  test.skip('[no:2] 연구운영성과표 - 조회 (getFsFormCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4030/setIs.do | inputCols=-
  test.skip('[no:3] 연구운영성과표 - 저장 (setIs) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getConf.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT,ENRN_FAOR_CD,STDR_YY
  test.skip('[no:4] 연구운영성과표 - 조회 (getConf) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:5] 연구운영성과표 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기간별 연구운영성과표 (act_4031M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4031M' OR MNU_NM LIKE '기간별 연구운영성과표%'
  const MENU_ID = 'TODO_act_4031M';
  const API_URL = '/mis/act/act0000/getPeriod.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getPeriod.do | inputCols=-
  test.skip('[no:1] 기간별 연구운영성과표 - 조회 (getPeriod) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=-
  test.skip('[no:2] 기간별 연구운영성과표 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mgt/cfg/cfg0520/getFsFormCd.do | inputCols=-
  test.skip('[no:3] 기간별 연구운영성과표 - 조회 (getFsFormCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4030/getListGrid.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT,BRFTR
  test.skip('[no:4] 기간별 연구운영성과표 - 조회 (getListGrid) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4030/getList1.do | inputCols=-
  test.skip('[no:5] 기간별 연구운영성과표 - 조회 (getList1) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4030/getList2.do | inputCols=-
  test.skip('[no:6] 기간별 연구운영성과표 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('현금흐름표 (act_4040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4040M' OR MNU_NM LIKE '현금흐름표%'
  const MENU_ID = 'TODO_act_4040M';
  const API_URL = '/mis/act/act0000/getPeriod.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getPeriod.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT
  test.skip('[no:1] 현금흐름표 - 조회 (getPeriod) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mgt/cfg/cfg0520/getFsFormCd.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT
  test.skip('[no:2] 현금흐름표 - 조회 (getFsFormCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4040/getCf.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT
  test.skip('[no:3] 현금흐름표 - 조회 (getCf) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4040/setCf.do | inputCols=-
  test.skip('[no:4] 현금흐름표 - 저장 (setCf) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4040/setData.do | inputCols=-
  test.skip('[no:5] 현금흐름표 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=-
  test.skip('[no:6] 현금흐름표 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('현금흐름표과목등록 (act_4042M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4042M' OR MNU_NM LIKE '현금흐름표과목등록%'
  const MENU_ID = 'TODO_act_4042M';
  const API_URL = '/mis/act/act4042/getMst.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['FS_FORM_CD', 'GRP_FG', 'STDR_YY', 'ACT_STDR_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act4042/getMst.do | inputCols=FS_FORM_CD,GRP_FG,STDR_YY,ACT_STDR_CD
  test.skip('[no:1] 현금흐름표과목등록 - 조회 (getListMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4042/getDtl.do | inputCols=FS_FORM_CD,GRP_FG,STDR_YY,ACT_STDR_CD
  test.skip('[no:2] 현금흐름표과목등록 - 조회 (getListDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4042/setData.do | inputCols=-
  test.skip('[no:3] 현금흐름표과목등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('이익잉여금처분계산서 (act_4050M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4050M' OR MNU_NM LIKE '이익잉여금처분계산서%'
  const MENU_ID = 'TODO_act_4050M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'STR_UNIT_CD', 'FS_FORM_CD', 'STDR_YY', 'DSPS_PRAR_DT', 'DSPS_DCSN_DT', 'DEL_YN', 'FRM_DT', 'TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,STDR_YY,DSPS_PRAR_DT,DSPS_DCSN_DT,DEL_YN,FRM_DT,TO_DT
  test.skip('[no:1] 이익잉여금처분계산서 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act1070/getFsFormCd.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,STDR_YY,DSPS_PRAR_DT,DSPS_DCSN_DT,DEL_YN,FRM_DT,TO_DT
  test.skip('[no:2] 이익잉여금처분계산서 - 조회 (getFsFormCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getPeriod.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,STDR_YY,DSPS_PRAR_DT,DSPS_DCSN_DT,DEL_YN,FRM_DT,TO_DT
  test.skip('[no:3] 이익잉여금처분계산서 - 조회 (getPeriod) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4050/checkAR.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,STDR_YY,DSPS_PRAR_DT,DSPS_DCSN_DT,DEL_YN,FRM_DT,TO_DT
  test.skip('[no:4] 이익잉여금처분계산서 - 조회 (checkAR) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4050/getAR.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,STDR_YY,DSPS_PRAR_DT,DSPS_DCSN_DT,DEL_YN,FRM_DT,TO_DT
  test.skip('[no:5] 이익잉여금처분계산서 - 조회 (getAR) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4050/setAR.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,STDR_YY,DSPS_PRAR_DT,DSPS_DCSN_DT,DEL_YN,FRM_DT,TO_DT
  test.skip('[no:6] 이익잉여금처분계산서 - 저장 (setAR) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4050/checkSlip.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,STDR_YY,DSPS_PRAR_DT,DSPS_DCSN_DT,DEL_YN,FRM_DT,TO_DT
  test.skip('[no:7] 이익잉여금처분계산서 - 조회 (checkSlip) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4050/setCrat.do | inputCols=-
  test.skip('[no:8] 이익잉여금처분계산서 - 저장 (setCrat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4050/setData.do | inputCols=-
  test.skip('[no:9] 이익잉여금처분계산서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('순자산변동표 (act_4060M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4060M' OR MNU_NM LIKE '순자산변동표%'
  const MENU_ID = 'TODO_act_4060M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT
  test.skip('[no:1] 순자산변동표 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mgt/cfg/cfg0520/getFsFormCd.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT
  test.skip('[no:2] 순자산변동표 - 조회 (getFsFormCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getPeriod.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT
  test.skip('[no:3] 순자산변동표 - 조회 (getPeriod) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4060/getListGrid.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT
  test.skip('[no:4] 순자산변동표 - 조회 (getListGrid) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4060/getCe.do | inputCols=ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,FS_FORM_CD,FRM_DT,TO_DT
  test.skip('[no:5] 순자산변동표 - 조회 (setCe) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4060/setCe.do | inputCols=-
  test.skip('[no:6] 순자산변동표 - 저장 (setCe) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4060/setData.do | inputCols=-
  test.skip('[no:7] 순자산변동표 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연구사업수익및비목명세서 (act_4070M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4070M' OR MNU_NM LIKE '연구사업수익및비목명세서%'
  const MENU_ID = 'TODO_act_4070M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'STR_UNIT_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT', 'ACCT_UNT_ALL', 'PRINT_STLF'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,FRM_DT,TO_DT,ACCT_UNT_ALL,PRINT_STLF
  test.skip('[no:1] 연구사업수익및비목명세서 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getPeriod.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,FRM_DT,TO_DT,ACCT_UNT_ALL,PRINT_STLF
  test.skip('[no:2] 연구사업수익및비목명세서 - 조회 (getPeriod) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0001/getListGrid.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,FRM_DT,TO_DT,ACCT_UNT_ALL,PRINT_STLF
  test.skip('[no:3] 연구사업수익및비목명세서 - 조회 (getListGrid) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4070/getAttc.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,FRM_DT,TO_DT,ACCT_UNT_ALL,PRINT_STLF
  test.skip('[no:4] 연구사업수익및비목명세서 - 조회 (setAttc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4070/setAttc.do | inputCols=-
  test.skip('[no:5] 연구사업수익및비목명세서 - 저장 (setAttc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부속명세서 과목설정 (act_4072M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4072M' OR MNU_NM LIKE '부속명세서 과목설정%'
  const MENU_ID = 'TODO_act_4072M';
  const API_URL = '/mgt/cfg/cfg0520/getFsFormCd.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_YY', 'FS_FORM_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mgt/cfg/cfg0520/getFsFormCd.do | inputCols=STDR_YY,FS_FORM_CD
  test.skip('[no:1] 부속명세서 과목설정 - 조회 (getFsFormCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4072/getList.do | inputCols=STDR_YY,FS_FORM_CD
  test.skip('[no:2] 부속명세서 과목설정 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4072/getDtl.do | inputCols=STDR_YY,FS_FORM_CD
  test.skip('[no:3] 부속명세서 과목설정 - 조회 (getDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4072/setData.do | inputCols=-
  test.skip('[no:4] 부속명세서 과목설정 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인건비명세서 (act_4080M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4080M' OR MNU_NM LIKE '인건비명세서%'
  const MENU_ID = 'TODO_act_4080M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'STR_UNIT_CD', 'FS_FORM_CD', 'FRM_DT', 'TO_DT', 'ACCT_UNT_ALL', 'PRINT_STLF'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,FRM_DT,TO_DT,ACCT_UNT_ALL,PRINT_STLF
  test.skip('[no:1] 인건비명세서 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getPeriod.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,FRM_DT,TO_DT,ACCT_UNT_ALL,PRINT_STLF
  test.skip('[no:2] 인건비명세서 - 조회 (getPeriod) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0001/getListGrid.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,FRM_DT,TO_DT,ACCT_UNT_ALL,PRINT_STLF
  test.skip('[no:3] 인건비명세서 - 조회 (getListGrid) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4080/getAttc.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,FRM_DT,TO_DT,ACCT_UNT_ALL,PRINT_STLF
  test.skip('[no:4] 인건비명세서 - 조회 (getAttc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4080/setAttc.do | inputCols=-
  test.skip('[no:5] 인건비명세서 - 저장 (setAttc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연구지원비명세서 (act_4090M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4090M' OR MNU_NM LIKE '연구지원비명세서%'
  const MENU_ID = 'TODO_act_4090M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'STR_UNIT_CD', 'FS_FORM_CD', 'FS_FORM_FG', 'FRM_DT', 'TO_DT', 'ACCT_UNT_ALL'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,FS_FORM_FG,FRM_DT,TO_DT,ACCT_UNT_ALL
  test.skip('[no:1] 연구지원비명세서 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getPeriod.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,FS_FORM_FG,FRM_DT,TO_DT,ACCT_UNT_ALL
  test.skip('[no:2] 연구지원비명세서 - 조회 (getPeriod) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4090/getAttc.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,FS_FORM_CD,FS_FORM_FG,FRM_DT,TO_DT,ACCT_UNT_ALL
  test.skip('[no:3] 연구지원비명세서 - 조회 (getAttc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4090/setAttc.do | inputCols=-
  test.skip('[no:4] 연구지원비명세서 - 저장 (setAttc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('결산부속명세서 (act_4510M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4510M' OR MNU_NM LIKE '결산부속명세서%'
  const MENU_ID = 'TODO_act_4510M';
  const API_URL = '/mis/act/act4510/getAttCd.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_YY', 'ACT_STDR_CD', 'CAL_RPT_CD', 'BTN_CTRL1', 'BTN_CTRL2', 'ACCT_CD', 'PRINT_STLF', 'EXCEL_UPLOAD_YN', 'RPT_FG', 'COMM_CD', 'COMM_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act4510/getAttCd.do | inputCols=STDR_YY,ACT_STDR_CD,CAL_RPT_CD,BTN_CTRL1,BTN_CTRL2,ACCT_CD,PRINT_STLF,EXCEL_UPLOAD_YN,RPT_FG,COMM_CD,COMM_NM
  test.skip('[no:1] 결산부속명세서 - 조회 (getAttcds) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4510/getList.do | inputCols=STDR_YY,ACT_STDR_CD,CAL_RPT_CD,BTN_CTRL1,BTN_CTRL2,ACCT_CD,PRINT_STLF,EXCEL_UPLOAD_YN,RPT_FG,COMM_CD,COMM_NM
  test.skip('[no:2] 결산부속명세서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getListGrid.do | inputCols=STDR_YY,ACT_STDR_CD,CAL_RPT_CD,BTN_CTRL1,BTN_CTRL2,ACCT_CD,PRINT_STLF,EXCEL_UPLOAD_YN,RPT_FG,COMM_CD,COMM_NM
  test.skip('[no:3] 결산부속명세서 - 조회 (getListGrid) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act4510/getUpDateList.do | inputCols=-
  test.skip('[no:4] 결산부속명세서 - 수정 (getUpDateList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4510/setData.do | inputCols=-
  test.skip('[no:5] 결산부속명세서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4510/setCreat.do | inputCols=-
  test.skip('[no:6] 결산부속명세서 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4510/setExcelData.do | inputCols=STDR_YY,ACT_STDR_CD,CAL_RPT_CD,BTN_CTRL1,BTN_CTRL2,ACCT_CD,PRINT_STLF,EXCEL_UPLOAD_YN,RPT_FG,COMM_CD,COMM_NM
  test.skip('[no:7] 결산부속명세서 - 저장 (setExcelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('결산부속명세서등록 (act_4511M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4511M' OR MNU_NM LIKE '결산부속명세서등록%'
  const MENU_ID = 'TODO_act_4511M';
  const API_URL = '/mis/act/act4511/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ATTC_DTSTMN_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act4511/getList.do | inputCols=ATTC_DTSTMN_NM
  test.skip('[no:1] 결산부속명세서등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4511/setData.do | inputCols=-
  test.skip('[no:2] 결산부속명세서등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('결산대시보드 (act_4900M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4900M' OR MNU_NM LIKE '결산대시보드%'
  const MENU_ID = 'TODO_act_4900M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_YY', 'ACT_STDR_CD', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=STDR_YY,ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD
  test.skip('[no:1] 결산대시보드 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4900/getList.do | inputCols=STDR_YY,ACT_STDR_CD,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD
  test.skip('[no:2] 결산대시보드 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act4900/setCreat.do | inputCols=-
  test.skip('[no:3] 결산대시보드 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=-
  test.skip('[no:4] 결산대시보드 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('결산자료검증 (act_4901M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_4901M' OR MNU_NM LIKE '결산자료검증%'
  const MENU_ID = 'TODO_act_4901M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CAL_RPT_CD', 'STDR_YY', 'SCLA'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=-
  test.skip('[no:1] 결산자료검증 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act4901/getList.do | inputCols=CAL_RPT_CD,STDR_YY,SCLA
  test.skip('[no:2] 결산자료검증 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act3350/getData3350P.do | inputCols=CAL_RPT_CD,STDR_YY,SCLA
  test.skip('[no:3] 결산자료검증 - 조회 (getData3350P) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('예금등록 (act_5010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_5010M' OR MNU_NM LIKE '예금등록%'
  const MENU_ID = 'TODO_act_5010M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'ACT_UNIT_NM', 'ACC_NO', 'DPSTS_FG', 'DPSTS_NM', 'USE_YN', 'DPSTS_TP', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=-
  test.skip('[no:1] 예금등록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act5010/getList.do | inputCols=ACT_UNIT_CD,ACT_UNIT_NM,ACC_NO,DPSTS_FG,DPSTS_NM,USE_YN,DPSTS_TP,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:2] 예금등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act5010/setData.do | inputCols=-
  test.skip('[no:3] 예금등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act5010/delData.do | inputCols=-
  test.skip('[no:4] 예금등록 - 삭제 (doDelete) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('입출금내역 (act_5020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_5020M' OR MNU_NM LIKE '입출금내역%'
  const MENU_ID = 'TODO_act_5020M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'BK_CD', 'ACC_NO', 'PBCK_STAT', 'SBJ', 'SIGN', 'SMRY', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,BK_CD,ACC_NO,PBCK_STAT,SBJ,SIGN,SMRY,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 입출금내역 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act5020/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,BK_CD,ACC_NO,PBCK_STAT,SBJ,SIGN,SMRY,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:2] 입출금내역 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act5020/getSchCombo.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,BK_CD,ACC_NO,PBCK_STAT,SBJ,SIGN,SMRY,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:3] 입출금내역 - 조회 (getSchCombo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act5020/getMove.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,BK_CD,ACC_NO,PBCK_STAT,SBJ,SIGN,SMRY,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:4] 입출금내역 - 조회 (getMove) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act5020/uptData.do | inputCols=-
  test.skip('[no:5] 입출금내역 - 수정 (uptData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act5020/setData.do | inputCols=-
  test.skip('[no:6] 입출금내역 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('일일자금일보 (act_5030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_5030M' OR MNU_NM LIKE '일일자금일보%'
  const MENU_ID = 'TODO_act_5030M';
  const API_URL = '/mis/act/act5030/getList1.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'ACC_NO', 'ZERO_YN', 'STR_UNT_CD', 'STAN_FG', 'SCH_BUDG_BSNS_CD', 'STR_SCH_BUDG_BSNS_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act5030/getList1.do | inputCols=ACT_UNIT_CD,FRM_DT,ACC_NO,ZERO_YN,STR_UNT_CD,STAN_FG,SCH_BUDG_BSNS_CD,STR_SCH_BUDG_BSNS_CD
  test.skip('[no:1] 일일자금일보 - 조회 (getList1) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act5030/getList2.do | inputCols=ACT_UNIT_CD,FRM_DT,ACC_NO,ZERO_YN,STR_UNT_CD,STAN_FG,SCH_BUDG_BSNS_CD,STR_SCH_BUDG_BSNS_CD
  test.skip('[no:2] 일일자금일보 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자금비교현황 (act_5040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_5040M' OR MNU_NM LIKE '자금비교현황%'
  const MENU_ID = 'TODO_act_5040M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 자금비교현황 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act5040/getList1.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT
  test.skip('[no:2] 자금비교현황 - 조회 (getList1) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act5040/getList2.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT
  test.skip('[no:3] 자금비교현황 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('은행이체리스트 (act_5050M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_5050M' OR MNU_NM LIKE '은행이체리스트%'
  const MENU_ID = 'TODO_act_5050M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'ACCT_UNT_NM', 'SEARCH_GB', 'FRM_DT', 'TO_DT', 'DPSIT', 'WDRAW_BK_NM', 'WDRAW_BK_CD', 'RCPPAY_ACC_NO', 'WDRAW_DPSIT_NM', 'TRANSFR_STT', 'SUBTOTAL'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 은행이체리스트 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act5050/getList1.do | inputCols=ACT_UNIT_CD,ACCT_UNT_NM,SEARCH_GB,FRM_DT,TO_DT,DPSIT,WDRAW_BK_NM,WDRAW_BK_CD,RCPPAY_ACC_NO,WDRAW_DPSIT_NM,TRANSFR_STT,SUBTOTAL
  test.skip('[no:2] 은행이체리스트 - 조회 (getList1) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act5050/getList2.do | inputCols=ACT_UNIT_CD,ACCT_UNT_NM,SEARCH_GB,FRM_DT,TO_DT,DPSIT,WDRAW_BK_NM,WDRAW_BK_CD,RCPPAY_ACC_NO,WDRAW_DPSIT_NM,TRANSFR_STT,SUBTOTAL
  test.skip('[no:3] 은행이체리스트 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act5050/setData1.do | inputCols=-
  test.skip('[no:4] 은행이체리스트 - 저장 (setData1) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act5050/setData2.do | inputCols=-
  test.skip('[no:5] 은행이체리스트 - 저장 (setData2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자금이체 (act_5110M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_5110M' OR MNU_NM LIKE '자금이체%'
  const MENU_ID = 'TODO_act_5110M';
  const API_URL = '/mis/act/act5110/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['UNTY_SACH_FG', 'UNTY_SACH_KEY', 'ACCP_FRM_DT', 'ACCP_TO_DT', 'TRN_YN', 'PMT_MTHD', 'VRIF_YN', 'VRIF_RST_CD', 'PROC_RST_FG', 'ACC_SUUM_YN', 'TAB_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act5110/getList.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,ACCP_FRM_DT,ACCP_TO_DT,TRN_YN,PMT_MTHD,VRIF_YN,VRIF_RST_CD,PROC_RST_FG,ACC_SUUM_YN,TAB_CLS
  test.skip('[no:1] 자금이체 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act5110/setVrif.do | inputCols=-
  test.skip('[no:2] 자금이체 - 저장 (setVrif) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act5110/setData.do | inputCols=-
  test.skip('[no:3] 자금이체 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기간비용등록 (act_5410M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_5410M' OR MNU_NM LIKE '기간비용등록%'
  const MENU_ID = 'TODO_act_5410M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['FRM_DT', 'TO_DT', 'ACT_UNIT_CD', 'TRNS_TP_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=FRM_DT,TO_DT,ACT_UNIT_CD,TRNS_TP_CD
  test.skip('[no:1] 기간비용등록 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getDpstsTp.do | inputCols=FRM_DT,TO_DT,ACT_UNIT_CD,TRNS_TP_CD
  test.skip('[no:2] 기간비용등록 - 조회 (getDpstsTp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act5410/getList.do | inputCols=FRM_DT,TO_DT,ACT_UNIT_CD,TRNS_TP_CD
  test.skip('[no:3] 기간비용등록 - 조회 (getList1) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act5410/getList2.do | inputCols=FRM_DT,TO_DT,ACT_UNIT_CD,TRNS_TP_CD
  test.skip('[no:4] 기간비용등록 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act5410/setData.do | inputCols=-
  test.skip('[no:5] 기간비용등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act5410/uptStotData.do | inputCols=-
  test.skip('[no:6] 기간비용등록 - 수정 (uptStotData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act5410/delete.do | inputCols=-
  test.skip('[no:7] 기간비용등록 - 삭제 (doDelete) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act5410/setSlip.do | inputCols=-
  test.skip('[no:8] 기간비용등록 - 저장 (setSlip) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기간비용결산 (act_5420M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_5420M' OR MNU_NM LIKE '기간비용결산%'
  const MENU_ID = 'TODO_act_5420M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'ACT_FRM_YM', 'ACT_TO_YM', 'SLIP_CREAT_YN', 'TRNS_ITM_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 기간비용결산 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act5420/getList.do | inputCols=ACT_UNIT_CD,ACT_FRM_YM,ACT_TO_YM,SLIP_CREAT_YN,TRNS_ITM_CD
  test.skip('[no:2] 기간비용결산 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act5420/setData.do | inputCols=-
  test.skip('[no:3] 기간비용결산 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('카드등록 (act_6010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_6010M' OR MNU_NM LIKE '카드등록%'
  const MENU_ID = 'TODO_act_6010M';
  const API_URL = '/mis/act/act0000/getBusiPlcInfo.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'STR_UNIT_CD', 'CARD_NM', 'CARD_FG', 'EMP_NO', 'EMP_NM', 'CARD_NO', 'USE_YN', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getBusiPlcInfo.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,CARD_NM,CARD_FG,EMP_NO,EMP_NM,CARD_NO,USE_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 카드등록 - 조회 (getBusiPlcInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act6010/getList.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,CARD_NM,CARD_FG,EMP_NO,EMP_NM,CARD_NO,USE_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:2] 카드등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act6010/getListDtl.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,CARD_NM,CARD_FG,EMP_NO,EMP_NM,CARD_NO,USE_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:3] 카드등록 - 조회 (getListDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act6010/getDpltCck.do | inputCols=ACT_UNIT_CD,STR_UNIT_CD,CARD_NM,CARD_FG,EMP_NO,EMP_NM,CARD_NO,USE_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:4] 카드등록 - 조회 (getDpltCck) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act6010/getUserAddList.do | inputCols=-
  test.skip('[no:5] 카드등록 - 저장 (getUserAddList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act6010/setData.do | inputCols=-
  test.skip('[no:6] 카드등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act6010/delData.do | inputCols=-
  test.skip('[no:7] 카드등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:8] 카드등록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('카드사용내역 (act_6020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_6020M' OR MNU_NM LIKE '카드사용내역%'
  const MENU_ID = 'TODO_act_6020M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'CARD_FG', 'PROC_STAT_CD', 'CARD_NO', 'DEPT_CD', 'DEPT_NM', 'EMP_NO', 'EMP_NM', 'FRM_APV_DT', 'TO_APV_DT', 'CRDCO_ACCP_NO', 'MRHST_NM', 'ACCP_AMT', 'ACCP_FG', 'CARD_ACCP_DAY', 'CARD_ACCP_FRM_TM', 'CARD_ACCP_TO_TM', 'BUDG_BSNS_CD', 'BUDG_BSNS_NM', 'OTHBC_YN', 'PCHRG_YN', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 카드사용내역 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act6020/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,CARD_FG,PROC_STAT_CD,CARD_NO,DEPT_CD,DEPT_NM,EMP_NO,EMP_NM,FRM_APV_DT,TO_APV_DT,CRDCO_ACCP_NO,MRHST_NM,ACCP_AMT,ACCP_FG,CARD_ACCP_DAY,CARD_ACCP_FRM_TM,CARD_ACCP_TO_TM,BUDG_BSNS_CD,BUDG_BSNS_NM,OTHBC_YN,PCHRG_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:2] 카드사용내역 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act6020/setData.do | inputCols=-
  test.skip('[no:3] 카드사용내역 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act6020/uptData.do | inputCols=-
  test.skip('[no:4] 카드사용내역 - 수정 (uptData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act6020/setMail.do | inputCols=-
  test.skip('[no:5] 카드사용내역 - 저장 (setMail) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act6020/setVat.do | inputCols=-
  test.skip('[no:6] 카드사용내역 - 저장 (setVat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('카드사용제한기준등록 (act_6030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_6030M' OR MNU_NM LIKE '카드사용제한기준등록%'
  const MENU_ID = 'TODO_act_6030M';
  const API_URL = '/mis/act/act6030/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act6030/getList.do | inputCols=-
  test.skip('[no:1] 카드사용제한기준등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act6030/setData.do | inputCols=-
  test.skip('[no:2] 카드사용제한기준등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('카드사용제한내역조회 (act_6040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_6040M' OR MNU_NM LIKE '카드사용제한내역조회%'
  const MENU_ID = 'TODO_act_6040M';
  const API_URL = '/mis/act/act6040/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['FRM_DT', 'TO_DT', 'LMT_FG', 'STAT', 'CARD_NO', 'MRHST_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act6040/getList.do | inputCols=FRM_DT,TO_DT,LMT_FG,STAT,CARD_NO,MRHST_NM
  test.skip('[no:1] 카드사용제한내역조회 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부가세등록 (act_7010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7010M' OR MNU_NM LIKE '부가세등록%'
  const MENU_ID = 'TODO_act_7010M';
  const API_URL = '/mis/act/act7010/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'BUY_SALG_FG', 'FRM_DT', 'TO_DT', 'TAXAFS_FG', 'CUST_CD', 'CUST_NM', 'BIZRNO', 'VAT_YY', 'VAT_QUARTER', 'UNTY_SACH_FG', 'UNTY_SACH_KEY', 'DT_CLS', 'TAXT_TASP_FG', 'ELEC_PUBCT_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7010/getList.do | inputCols=BUSI_PLC_CD,BUY_SALG_FG,FRM_DT,TO_DT,TAXAFS_FG,CUST_CD,CUST_NM,BIZRNO,VAT_YY,VAT_QUARTER,UNTY_SACH_FG,UNTY_SACH_KEY,DT_CLS,TAXT_TASP_FG,ELEC_PUBCT_YN
  test.skip('[no:1] 부가세등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act7010/uptUnDucData.do | inputCols=-
  test.skip('[no:2] 부가세등록 - 수정 (uptUnDucData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act7010/delData.do | inputCols=-
  test.skip('[no:3] 부가세등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7010/getA40.do | inputCols=BUSI_PLC_CD,BUY_SALG_FG,FRM_DT,TO_DT,TAXAFS_FG,CUST_CD,CUST_NM,BIZRNO,VAT_YY,VAT_QUARTER,UNTY_SACH_FG,UNTY_SACH_KEY,DT_CLS,TAXT_TASP_FG,ELEC_PUBCT_YN
  test.skip('[no:4] 부가세등록 - 조회 (getA40) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act7010/uptUnDucChg.do | inputCols=-
  test.skip('[no:5] 부가세등록 - 수정 (uptUnDucChg) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getBusiPlc.do | inputCols=BUSI_PLC_CD,BUY_SALG_FG,FRM_DT,TO_DT,TAXAFS_FG,CUST_CD,CUST_NM,BIZRNO,VAT_YY,VAT_QUARTER,UNTY_SACH_FG,UNTY_SACH_KEY,DT_CLS,TAXT_TASP_FG,ELEC_PUBCT_YN
  test.skip('[no:6] 부가세등록 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부가세등록 (act_7011M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7011M' OR MNU_NM LIKE '부가세등록%'
  const MENU_ID = 'TODO_act_7011M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['VAT_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 부가세등록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7010/getVat.do | inputCols=VAT_NO
  test.skip('[no:2] 부가세등록 - 조회 (getVat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act7010/delData.do | inputCols=-
  test.skip('[no:3] 부가세등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7010/insData.do | inputCols=-
  test.skip('[no:4] 부가세등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act7010/uptChg.do | inputCols=-
  test.skip('[no:5] 부가세등록 - 수정 (uptChg) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('매입매출장 (act_7020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7020M' OR MNU_NM LIKE '매입매출장%'
  const MENU_ID = 'TODO_act_7020M';
  const API_URL = '/mis/act/act0000/getBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'BUY_SALG_FG', 'FRM_DT', 'TO_DT', 'TAXAFS_FG', 'CUST_CD', 'CUST_NM', 'BIZRNO', 'UNTY_SACH_FG', 'UNTY_SACH_KEY', 'VAT_YY', 'VAT_QUARTER'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getBusiPlc.do | inputCols=BUSI_PLC_CD,BUY_SALG_FG,FRM_DT,TO_DT,TAXAFS_FG,CUST_CD,CUST_NM,BIZRNO,UNTY_SACH_FG,UNTY_SACH_KEY,VAT_YY,VAT_QUARTER
  test.skip('[no:1] 매입매출장 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7020/getList.do | inputCols=BUSI_PLC_CD,BUY_SALG_FG,FRM_DT,TO_DT,TAXAFS_FG,CUST_CD,CUST_NM,BIZRNO,UNTY_SACH_FG,UNTY_SACH_KEY,VAT_YY,VAT_QUARTER
  test.skip('[no:2] 매입매출장 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('세금계산서합계표 (act_7030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7030M' OR MNU_NM LIKE '세금계산서합계표%'
  const MENU_ID = 'TODO_act_7030M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'BUY_SALG_FG', 'VAT_STTM_FG', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,BUY_SALG_FG,VAT_STTM_FG,FOMT_CD
  test.skip('[no:1] 세금계산서합계표 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,BUY_SALG_FG,VAT_STTM_FG,FOMT_CD
  test.skip('[no:2] 세금계산서합계표 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7030/getData.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,BUY_SALG_FG,VAT_STTM_FG,FOMT_CD
  test.skip('[no:3] 세금계산서합계표 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7030/setDcsbClos.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,BUY_SALG_FG,VAT_STTM_FG,FOMT_CD
  test.skip('[no:4] 세금계산서합계표 - 저장 (setDcsbClos) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7030/setCreat.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,BUY_SALG_FG,VAT_STTM_FG,FOMT_CD
  test.skip('[no:5] 세금계산서합계표 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부가세수정신고서등록 (act_7031M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7031M' OR MNU_NM LIKE '부가세수정신고서등록%'
  const MENU_ID = 'TODO_act_7031M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'WRT_DT', 'UPT_RSN', 'RERK_YN', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,WRT_DT,UPT_RSN,RERK_YN,FOMT_CD
  test.skip('[no:1] 부가세수정신고서등록 - 조회 (getMainBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7030/getUptCheck.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,WRT_DT,UPT_RSN,RERK_YN,FOMT_CD
  test.skip('[no:2] 부가세수정신고서등록 - 조회 (getUptCheck) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7030/setUptCreat.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,WRT_DT,UPT_RSN,RERK_YN,FOMT_CD
  test.skip('[no:3] 부가세수정신고서등록 - 저장 (setUptCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계산서합계표 (act_7040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7040M' OR MNU_NM LIKE '계산서합계표%'
  const MENU_ID = 'TODO_act_7040M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'BUSI_PLC_NM', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'BUY_SALG_FG', 'VAT_STTM_FG', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,BUY_SALG_FG,VAT_STTM_FG,FOMT_CD
  test.skip('[no:1] 계산서합계표 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,BUY_SALG_FG,VAT_STTM_FG,FOMT_CD
  test.skip('[no:2] 계산서합계표 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7040/getData.do | inputCols=BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,BUY_SALG_FG,VAT_STTM_FG,FOMT_CD
  test.skip('[no:3] 계산서합계표 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7040/setDcsbClos.do | inputCols=BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,BUY_SALG_FG,VAT_STTM_FG,FOMT_CD
  test.skip('[no:4] 계산서합계표 - 저장 (setDcsbClos) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7040/setCreat.do | inputCols=BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,BUY_SALG_FG,VAT_STTM_FG,FOMT_CD
  test.skip('[no:5] 계산서합계표 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('(매입)전자세금계산서대사조회 (act_7050M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7050M' OR MNU_NM LIKE '(매입)전자세금계산서대사조회%'
  const MENU_ID = 'TODO_act_7050M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUY_SALG_FG', 'FRM_DT', 'TO_DT', 'INVPRT_NM', 'TAXAFS_FG', 'BIZRNO', 'PROC_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] (매입)전자세금계산서대사조회 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7050/getList.do | inputCols=BUY_SALG_FG,FRM_DT,TO_DT,INVPRT_NM,TAXAFS_FG,BIZRNO,PROC_STAT_CD
  test.skip('[no:2] (매입)전자세금계산서대사조회 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7050/setData.do | inputCols=-
  test.skip('[no:3] (매입)전자세금계산서대사조회 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7050/setClos.do | inputCols=-
  test.skip('[no:4] (매입)전자세금계산서대사조회 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('전자(세금)계산서내역 (act_7060M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7060M' OR MNU_NM LIKE '전자(세금)계산서내역%'
  const MENU_ID = 'TODO_act_7060M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUY_SALG_FG', 'FRM_DT', 'TO_DT', 'TAXBIL_MNGT_NO', 'TAXAFS_FG', 'INVPRT_NM', 'ISUR_BIZRNO', 'OTHBC_YN', 'PROC_STAT_CD', 'UNTY_SACH_FG', 'UNTY_SACH_KEY', 'VAT_YY', 'VAT_QUARTER'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 전자(세금)계산서내역 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7060/getList.do | inputCols=BUY_SALG_FG,FRM_DT,TO_DT,TAXBIL_MNGT_NO,TAXAFS_FG,INVPRT_NM,ISUR_BIZRNO,OTHBC_YN,PROC_STAT_CD,UNTY_SACH_FG,UNTY_SACH_KEY,VAT_YY,VAT_QUARTER
  test.skip('[no:2] 전자(세금)계산서내역 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7060/setData.do | inputCols=-
  test.skip('[no:3] 전자(세금)계산서내역 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7060/setOthbc.do | inputCols=-
  test.skip('[no:4] 전자(세금)계산서내역 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7060/setVat.do | inputCols=-
  test.skip('[no:5] 전자(세금)계산서내역 - 저장 (setVat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부가세신고서 (act_7210M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7210M' OR MNU_NM LIKE '부가세신고서%'
  const MENU_ID = 'TODO_act_7210M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['PRINT_STLF', 'BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'WRT_DT', 'BUY_SALG_FG', 'UPT_RSN', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=PRINT_STLF,BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,WRT_DT,BUY_SALG_FG,UPT_RSN,FOMT_CD
  test.skip('[no:1] 부가세신고서 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=PRINT_STLF,BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,WRT_DT,BUY_SALG_FG,UPT_RSN,FOMT_CD
  test.skip('[no:2] 부가세신고서 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7210/getListGrid.do | inputCols=PRINT_STLF,BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,WRT_DT,BUY_SALG_FG,UPT_RSN,FOMT_CD
  test.skip('[no:3] 부가세신고서 - 조회 (getListGrid) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7210/getList1.do | inputCols=PRINT_STLF,BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,WRT_DT,BUY_SALG_FG,UPT_RSN,FOMT_CD
  test.skip('[no:4] 부가세신고서 - 조회 (getList1) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7210/getList2.do | inputCols=PRINT_STLF,BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,WRT_DT,BUY_SALG_FG,UPT_RSN,FOMT_CD
  test.skip('[no:5] 부가세신고서 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7210/setData.do | inputCols=-
  test.skip('[no:6] 부가세신고서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7210/setCreat.do | inputCols=PRINT_STLF,BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,WRT_DT,BUY_SALG_FG,UPT_RSN,FOMT_CD
  test.skip('[no:7] 부가세신고서 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부가세신고서명세 (act_7211M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7211M' OR MNU_NM LIKE '부가세신고서명세%'
  const MENU_ID = 'TODO_act_7211M';
  const API_URL = '/mis/act/act7210/getListGrid.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['PRINT_STLF', 'BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'ENABLE', 'UP_PRINT_STLF'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7210/getListGrid.do | inputCols=PRINT_STLF,BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,ENABLE,UP_PRINT_STLF
  test.skip('[no:1] 부가세신고서명세 - 조회 (getListGrid) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7211/getList.do | inputCols=PRINT_STLF,BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,ENABLE,UP_PRINT_STLF
  test.skip('[no:2] 부가세신고서명세 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7211/setData.do | inputCols=-
  test.skip('[no:3] 부가세신고서명세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('과세표준 (act_7212M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7212M' OR MNU_NM LIKE '과세표준%'
  const MENU_ID = 'TODO_act_7212M';
  const API_URL = '/mis/act/act7210/getListGrid.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'PRINT_STLF', 'BT_CRAT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7210/getListGrid.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,PRINT_STLF,BT_CRAT
  test.skip('[no:1] 과세표준 - 조회 (getListGrid) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7212/getData.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,PRINT_STLF,BT_CRAT
  test.skip('[no:2] 과세표준 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7212/setData.do | inputCols=-
  test.skip('[no:3] 과세표준 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('전자신고마감 (act_7213M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7213M' OR MNU_NM LIKE '전자신고마감%'
  const MENU_ID = 'TODO_act_7213M';
  const API_URL = '/mis/act/act0000/getAtftWrftChk.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'CLOS_FG', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,CLOS_FG,FOMT_CD
  test.skip('[no:1] 전자신고마감 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7213/getList.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,CLOS_FG,FOMT_CD
  test.skip('[no:2] 전자신고마감 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7213/setClosErrCheck.do | inputCols=-
  test.skip('[no:3] 전자신고마감 - 저장 (setClosErrCheck) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7213/setClos.do | inputCols=-
  test.skip('[no:4] 전자신고마감 - 저장 (setClos) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사업장현황명세서 (act_7214M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7214M' OR MNU_NM LIKE '사업장현황명세서%'
  const MENU_ID = 'TODO_act_7214M';
  const API_URL = '/mis/act/act7214/getCheck.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7214/getCheck.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT
  test.skip('[no:1] 사업장현황명세서 - 조회 (getCheck) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7214/getList.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT
  test.skip('[no:2] 사업장현황명세서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7214/setData.do | inputCols=-
  test.skip('[no:3] 사업장현황명세서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7214/setLoad.do | inputCols=-
  test.skip('[no:4] 사업장현황명세서 - 저장 (setLoad) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('업종코드 (act_7215M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7215M' OR MNU_NM LIKE '업종코드%'
  const MENU_ID = 'TODO_act_7215M';
  const API_URL = '/mis/act/act7215/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CLS', 'CND', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7215/getList.do | inputCols=CLS,CND,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 업종코드 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('전자신고마감오류확인 (act_7216M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7216M' OR MNU_NM LIKE '전자신고마감오류확인%'
  const MENU_ID = 'TODO_act_7216M';
  const API_URL = '/mis/act/act7213/setClos.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/act/act7213/setClos.do | inputCols=-
  test.skip('[no:1] 전자신고마감오류확인 - 저장 (setClos) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부가세전자신고 (act_7220M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7220M' OR MNU_NM LIKE '부가세전자신고%'
  const MENU_ID = 'TODO_act_7220M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'FILE_NAME'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=-
  test.skip('[no:1] 부가세전자신고 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7220/getCheck.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FILE_NAME
  test.skip('[no:2] 부가세전자신고 - 조회 (getCheck) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7220/getList1.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FILE_NAME
  test.skip('[no:3] 부가세전자신고 - 조회 (getList1) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7220/getList2.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FILE_NAME
  test.skip('[no:4] 부가세전자신고 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7220/getFileNm.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FILE_NAME
  test.skip('[no:5] 부가세전자신고 - 조회 (getFileNm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7220/test.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FILE_NAME
  test.skip('[no:6] 부가세전자신고 - 조회 (test) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사업장별과표및세액신고서 (act_7230M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7230M' OR MNU_NM LIKE '사업장별과표및세액신고서%'
  const MENU_ID = 'TODO_act_7230M';
  const API_URL = '/mis/act/act7230/getBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7230/getBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FOMT_CD
  test.skip('[no:1] 사업장별과표및세액신고서 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FOMT_CD
  test.skip('[no:2] 사업장별과표및세액신고서 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7230/getList.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FOMT_CD
  test.skip('[no:3] 사업장별과표및세액신고서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7230/getData.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FOMT_CD
  test.skip('[no:4] 사업장별과표및세액신고서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7230/setData.do | inputCols=-
  test.skip('[no:5] 사업장별과표및세액신고서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act7230/delData.do | inputCols=-
  test.skip('[no:6] 사업장별과표및세액신고서 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7230/setCreat.do | inputCols=-
  test.skip('[no:7] 사업장별과표및세액신고서 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('신용카드매출전표등집계표 (act_7410M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7410M' OR MNU_NM LIKE '신용카드매출전표등집계표%'
  const MENU_ID = 'TODO_act_7410M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:1] 신용카드매출전표등집계표 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:2] 신용카드매출전표등집계표 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7410/getData.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:3] 신용카드매출전표등집계표 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7410/setCreat.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:4] 신용카드매출전표등집계표 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7410/setData.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:5] 신용카드매출전표등집계표 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('신용카드매출전표등수령명세서 (act_7411M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7411M' OR MNU_NM LIKE '신용카드매출전표등수령명세서%'
  const MENU_ID = 'TODO_act_7411M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:1] 신용카드매출전표등수령명세서 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:2] 신용카드매출전표등수령명세서 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7411/getList.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:3] 신용카드매출전표등수령명세서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7411/setLoad.do | inputCols=-
  test.skip('[no:4] 신용카드매출전표등수령명세서 - 저장 (setLoad) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7411/setClos.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:5] 신용카드매출전표등수령명세서 - 저장 (setClos) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('공제받지못할매입세액명세서 (act_7420M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7420M' OR MNU_NM LIKE '공제받지못할매입세액명세서%'
  const MENU_ID = 'TODO_act_7420M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['TAX_RETURN_TP', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'FRM_YM', 'TO_YM', 'FOMT_CD', 'DCSN_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=TAX_RETURN_TP,BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,FOMT_CD,DCSN_YN
  test.skip('[no:1] 공제받지못할매입세액명세서 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7420/getEnrnSet.do | inputCols=TAX_RETURN_TP,BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,FOMT_CD,DCSN_YN
  test.skip('[no:2] 공제받지못할매입세액명세서 - 조회 (getEnrnSet) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=TAX_RETURN_TP,BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,FOMT_CD,DCSN_YN
  test.skip('[no:3] 공제받지못할매입세액명세서 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7420/getData.do | inputCols=TAX_RETURN_TP,BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,FOMT_CD,DCSN_YN
  test.skip('[no:4] 공제받지못할매입세액명세서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7420/getCalcNptd.do | inputCols=TAX_RETURN_TP,BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,FOMT_CD,DCSN_YN
  test.skip('[no:5] 공제받지못할매입세액명세서 - 조회 (getCalcNptd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7420/getCalcSub3.do | inputCols=TAX_RETURN_TP,BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,FOMT_CD,DCSN_YN
  test.skip('[no:6] 공제받지못할매입세액명세서 - 조회 (getCalcSub3) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7420/setCreat.do | inputCols=-
  test.skip('[no:7] 공제받지못할매입세액명세서 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7420/setData.do | inputCols=-
  test.skip('[no:8] 공제받지못할매입세액명세서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act7420/delData.do | inputCols=-
  test.skip('[no:9] 공제받지못할매입세액명세서 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('대손세액공제신고서 (act_7430M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7430M' OR MNU_NM LIKE '대손세액공제신고서%'
  const MENU_ID = 'TODO_act_7430M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD', 'DCSN_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FOMT_CD,DCSN_YN
  test.skip('[no:1] 대손세액공제신고서 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FOMT_CD,DCSN_YN
  test.skip('[no:2] 대손세액공제신고서 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7430/getDucRate.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FOMT_CD,DCSN_YN
  test.skip('[no:3] 대손세액공제신고서 - 조회 (getDucRate) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7430/getList.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FOMT_CD,DCSN_YN
  test.skip('[no:4] 대손세액공제신고서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7430/setData.do | inputCols=-
  test.skip('[no:5] 대손세액공제신고서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부동산임대공급가액명세서 (act_7440M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7440M' OR MNU_NM LIKE '부동산임대공급가액명세서%'
  const MENU_ID = 'TODO_act_7440M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'FOMT_CD', 'DCSN_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD,DCSN_YN
  test.skip('[no:1] 부동산임대공급가액명세서 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD,DCSN_YN
  test.skip('[no:2] 부동산임대공급가액명세서 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7440/getWpmbpSno.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD,DCSN_YN
  test.skip('[no:3] 부동산임대공급가액명세서 - 조회 (getWpmbpSno) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7440/getIntrst.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD,DCSN_YN
  test.skip('[no:4] 부동산임대공급가액명세서 - 조회 (getIntrst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7440/getList.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD,DCSN_YN
  test.skip('[no:5] 부동산임대공급가액명세서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7440/setData.do | inputCols=-
  test.skip('[no:6] 부동산임대공급가액명세서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7440/setIntrst.do | inputCols=-
  test.skip('[no:7] 부동산임대공급가액명세서 - 저장 (setIntrst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act7440/uptCalData.do | inputCols=-
  test.skip('[no:8] 부동산임대공급가액명세서 - 수정 (uptCalData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7440/getLoad.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD,DCSN_YN
  test.skip('[no:9] 부동산임대공급가액명세서 - 조회 (getLoad) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('불러오기 (act_7441M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7441M' OR MNU_NM LIKE '불러오기%'
  const MENU_ID = 'TODO_act_7441M';
  const API_URL = '/mis/act/act7441/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STDR_YY', 'INCD_YN', 'TRGT_FRM_YM', 'TRGT_TO_YM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7441/getList.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STDR_YY,INCD_YN,TRGT_FRM_YM,TRGT_TO_YM
  test.skip('[no:1] 불러오기 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7441/setCreat.do | inputCols=-
  test.skip('[no:2] 불러오기 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('건물관리명세서 (act_7450M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7450M' OR MNU_NM LIKE '건물관리명세서%'
  const MENU_ID = 'TODO_act_7450M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'BUSI_PLC_NM', 'FRM_YM', 'TO_YM', 'FG', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,FG,FOMT_CD
  test.skip('[no:1] 건물관리명세서 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getDcsbChk.do | inputCols=BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,FG,FOMT_CD
  test.skip('[no:2] 건물관리명세서 - 조회 (getDcsbChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,FG,FOMT_CD
  test.skip('[no:3] 건물관리명세서 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7450/getList.do | inputCols=BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,FG,FOMT_CD
  test.skip('[no:4] 건물관리명세서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7450/setData.do | inputCols=-
  test.skip('[no:5] 건물관리명세서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('건물등감가상각취득명세서 (act_7460M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7460M' OR MNU_NM LIKE '건물등감가상각취득명세서%'
  const MENU_ID = 'TODO_act_7460M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:1] 건물등감가상각취득명세서 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:2] 건물등감가상각취득명세서 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7460/getData.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:3] 건물등감가상각취득명세서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7460/setCreat.do | inputCols=-
  test.skip('[no:4] 건물등감가상각취득명세서 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('의제매입세액공제신고서 (act_7470M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7470M' OR MNU_NM LIKE '의제매입세액공제신고서%'
  const MENU_ID = 'TODO_act_7470M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:1] 의제매입세액공제신고서 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:2] 의제매입세액공제신고서 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7470/getList1.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:3] 의제매입세액공제신고서 - 조회 (getList1) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7470/getList2.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:4] 의제매입세액공제신고서 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7470/setData.do | inputCols=-
  test.skip('[no:5] 의제매입세액공제신고서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7470/chkExist.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:6] 의제매입세액공제신고서 - 조회 (chkExist) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('불러오기 (act_7471M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7471M' OR MNU_NM LIKE '불러오기%'
  const MENU_ID = 'TODO_act_7471M';
  const API_URL = '/mis/act/act7471/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7471/getList.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FOMT_CD
  test.skip('[no:1] 불러오기 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7471/setData.do | inputCols=-
  test.skip('[no:2] 불러오기 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7471/setCreat.do | inputCols=-
  test.skip('[no:3] 불러오기 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('영세율매출명세서 (act_7490M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7490M' OR MNU_NM LIKE '영세율매출명세서%'
  const MENU_ID = 'TODO_act_7490M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'BUSI_PLC_NM', 'FRM_YM', 'TO_YM', 'FOMT_CD', 'PRINT_STLF'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,FOMT_CD,PRINT_STLF
  test.skip('[no:1] 영세율매출명세서 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7490/getListGrid.do | inputCols=BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,FOMT_CD,PRINT_STLF
  test.skip('[no:2] 영세율매출명세서 - 조회 (getListGrid) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,FOMT_CD,PRINT_STLF
  test.skip('[no:3] 영세율매출명세서 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7490/getList.do | inputCols=BUSI_PLC_CD,BUSI_PLC_NM,FRM_YM,TO_YM,FOMT_CD,PRINT_STLF
  test.skip('[no:4] 영세율매출명세서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7490/setCreat.do | inputCols=-
  test.skip('[no:5] 영세율매출명세서 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7490/setData.do | inputCols=-
  test.skip('[no:6] 영세율매출명세서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act7490/delData.do | inputCols=-
  test.skip('[no:7] 영세율매출명세서 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구리 스크랩등 매입세액 공제신고서 (act_7492M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7492M' OR MNU_NM LIKE '구리 스크랩등 매입세액 공제신고서%'
  const MENU_ID = 'TODO_act_7492M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'BUY_SALG_FG', 'VAT_STTM_FG', 'FOMT_CD', 'WRT_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,BUY_SALG_FG,VAT_STTM_FG,FOMT_CD,WRT_DT
  test.skip('[no:1] 구리 스크랩등 매입세액 공제신고서 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getDcsbChk.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,BUY_SALG_FG,VAT_STTM_FG,FOMT_CD,WRT_DT
  test.skip('[no:2] 구리 스크랩등 매입세액 공제신고서 - 조회 (getDcsbChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7492/getData.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,BUY_SALG_FG,VAT_STTM_FG,FOMT_CD,WRT_DT
  test.skip('[no:3] 구리 스크랩등 매입세액 공제신고서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7492/setCreat.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,BUY_SALG_FG,VAT_STTM_FG,FOMT_CD,WRT_DT
  test.skip('[no:4] 구리 스크랩등 매입세액 공제신고서 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7492/setData.do | inputCols=-
  test.skip('[no:5] 구리 스크랩등 매입세액 공제신고서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('재활용폐자원세액공제신고서 (act_7510M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7510M' OR MNU_NM LIKE '재활용폐자원세액공제신고서%'
  const MENU_ID = 'TODO_act_7510M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'PRINT_STLF', 'FOMT_CD', 'DCSN_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,PRINT_STLF,FOMT_CD,DCSN_YN
  test.skip('[no:1] 재활용폐자원세액공제신고서 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7510/getDucRate.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,PRINT_STLF,FOMT_CD,DCSN_YN
  test.skip('[no:2] 재활용폐자원세액공제신고서 - 조회 (getDucRate) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,PRINT_STLF,FOMT_CD,DCSN_YN
  test.skip('[no:3] 재활용폐자원세액공제신고서 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7510/getData.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,PRINT_STLF,FOMT_CD,DCSN_YN
  test.skip('[no:4] 재활용폐자원세액공제신고서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7510/setCreat.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,PRINT_STLF,FOMT_CD,DCSN_YN
  test.skip('[no:5] 재활용폐자원세액공제신고서 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7510/setData.do | inputCols=-
  test.skip('[no:6] 재활용폐자원세액공제신고서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('불러오기(매입처명세) (act_7511M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7511M' OR MNU_NM LIKE '불러오기(매입처명세)%'
  const MENU_ID = 'TODO_act_7511M';
  const API_URL = '/mis/act/act7511/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD', 'SCAP_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7511/getList.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FOMT_CD,SCAP_YN
  test.skip('[no:1] 불러오기(매입처명세) - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7511/setData.do | inputCols=-
  test.skip('[no:2] 불러오기(매입처명세) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7511/setCreat.do | inputCols=-
  test.skip('[no:3] 불러오기(매입처명세) - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('불러오기(매입세액정산) (act_7512M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7512M' OR MNU_NM LIKE '불러오기(매입세액정산)%'
  const MENU_ID = 'TODO_act_7512M';
  const API_URL = '/mis/act/act7512/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7512/getList.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FOMT_CD
  test.skip('[no:1] 불러오기(매입세액정산) - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7512/setData.do | inputCols=-
  test.skip('[no:2] 불러오기(매입세액정산) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7512/setCreat.do | inputCols=-
  test.skip('[no:3] 불러오기(매입세액정산) - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('스크랩등 매입세액 공제신고서 (act_7520M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7520M' OR MNU_NM LIKE '스크랩등 매입세액 공제신고서%'
  const MENU_ID = 'TODO_act_7520M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'PRINT_STLF', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,PRINT_STLF,FOMT_CD
  test.skip('[no:1] 스크랩등 매입세액 공제신고서 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7520/getDucRate.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,PRINT_STLF,FOMT_CD
  test.skip('[no:2] 스크랩등 매입세액 공제신고서 - 조회 (getDucRate) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,PRINT_STLF,FOMT_CD
  test.skip('[no:3] 스크랩등 매입세액 공제신고서 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7520/getData.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,PRINT_STLF,FOMT_CD
  test.skip('[no:4] 스크랩등 매입세액 공제신고서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7520/setCreat.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,PRINT_STLF,FOMT_CD
  test.skip('[no:5] 스크랩등 매입세액 공제신고서 - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7520/setData.do | inputCols=-
  test.skip('[no:6] 스크랩등 매입세액 공제신고서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('불러오기(매입처명세) (act_7521M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7521M' OR MNU_NM LIKE '불러오기(매입처명세)%'
  const MENU_ID = 'TODO_act_7521M';
  const API_URL = '/mis/act/act7521/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'STTM_FG', 'STTM_DGCNT', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7521/getList.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,STTM_FG,STTM_DGCNT,FOMT_CD
  test.skip('[no:1] 불러오기(매입처명세) - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7521/setData.do | inputCols=-
  test.skip('[no:2] 불러오기(매입처명세) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7521/setCreat.do | inputCols=-
  test.skip('[no:3] 불러오기(매입처명세) - 저장 (setCreat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('수출실적명세서 (act_7530M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7530M' OR MNU_NM LIKE '수출실적명세서%'
  const MENU_ID = 'TODO_act_7530M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM', 'FOMT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:1] 수출실적명세서 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getAtftWrftChk.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:2] 수출실적명세서 - 조회 (getAtftWrftChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7530/getData.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM,FOMT_CD
  test.skip('[no:3] 수출실적명세서 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7530/setData.do | inputCols=-
  test.skip('[no:4] 수출실적명세서 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기타소득자등록 (act_7610M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7610M' OR MNU_NM LIKE '기타소득자등록%'
  const MENU_ID = 'TODO_act_7610M';
  const API_URL = '/mis/act/act7610/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CUST_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7610/getList.do | inputCols=CUST_NM
  test.skip('[no:1] 기타소득자등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7610/getListDtl.do | inputCols=CUST_NM
  test.skip('[no:2] 기타소득자등록 - 조회 (getListDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7610/getAcc.do | inputCols=CUST_NM
  test.skip('[no:3] 기타소득자등록 - 조회 (getAcc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7610/setData.do | inputCols=-
  test.skip('[no:4] 기타소득자등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act7610/delData.do | inputCols=-
  test.skip('[no:5] 기타소득자등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getVrifAccNo.do | inputCols=BK_CD,ACC_NO,DPSIT,RST_CD,RST_DPSIT,RST
  test.skip('[no:6] 기타소득자등록 - 조회 (getVrifAccNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act0002/uptAddresCrtfcAt2.do | inputCols=-
  test.skip('[no:7] 기타소득자등록 - 수정 (uptAddresCrtfcAt2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기타소득등록 (act_7620M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7620M' OR MNU_NM LIKE '기타소득등록%'
  const MENU_ID = 'TODO_act_7620M';
  const API_URL = '/mis/act/act7620/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_DT', 'TO_DT', 'CUST_NM', 'CUST_CD', 'DT_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7620/getList.do | inputCols=BUSI_PLC_CD,FRM_DT,TO_DT,CUST_NM,CUST_CD,DT_CLS
  test.skip('[no:1] 기타소득등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7620/getDtl.do | inputCols=BUSI_PLC_CD,FRM_DT,TO_DT,CUST_NM,CUST_CD,DT_CLS
  test.skip('[no:2] 기타소득등록 - 조회 (getDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7620/setData.do | inputCols=-
  test.skip('[no:3] 기타소득등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_DT,TO_DT,CUST_NM,CUST_CD,DT_CLS
  test.skip('[no:4] 기타소득등록 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getEtcTax.do | inputCols=BUSI_PLC_CD,FRM_DT,TO_DT,CUST_NM,CUST_CD,DT_CLS
  test.skip('[no:5] 기타소득등록 - 조회 (getEtcTax) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기타소득현황 (act_7630M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7630M' OR MNU_NM LIKE '기타소득현황%'
  const MENU_ID = 'TODO_act_7630M';
  const API_URL = '/mis/act/act7630/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_DT', 'TO_DT', 'INVPRT_NM', 'INVPRT_ID', 'RESI_FG', 'INME_FG', 'POSI', 'ETC_EXPE', 'FRM_DT2', 'TO_DT2', 'INVPRT_NM2', 'POSI2', 'CUST_NM', 'CUST_CD', 'DT_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7630/getList.do | inputCols=BUSI_PLC_CD,FRM_DT,TO_DT,INVPRT_NM,INVPRT_ID,RESI_FG,INME_FG,POSI,ETC_EXPE,FRM_DT2,TO_DT2,INVPRT_NM2,POSI2,CUST_NM,CUST_CD,DT_CLS
  test.skip('[no:1] 기타소득현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7630/getList2.do | inputCols=BUSI_PLC_CD,FRM_DT,TO_DT,INVPRT_NM,INVPRT_ID,RESI_FG,INME_FG,POSI,ETC_EXPE,FRM_DT2,TO_DT2,INVPRT_NM2,POSI2,CUST_NM,CUST_CD,DT_CLS
  test.skip('[no:2] 기타소득현황 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7630/getDtl.do | inputCols=BUSI_PLC_CD,FRM_DT,TO_DT,INVPRT_NM,INVPRT_ID,RESI_FG,INME_FG,POSI,ETC_EXPE,FRM_DT2,TO_DT2,INVPRT_NM2,POSI2,CUST_NM,CUST_CD,DT_CLS
  test.skip('[no:3] 기타소득현황 - 조회 (getDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_DT,TO_DT,INVPRT_NM,INVPRT_ID,RESI_FG,INME_FG,POSI,ETC_EXPE,FRM_DT2,TO_DT2,INVPRT_NM2,POSI2,CUST_NM,CUST_CD,DT_CLS
  test.skip('[no:4] 기타소득현황 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기타소득현황(담당자) (act_7631M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7631M' OR MNU_NM LIKE '기타소득현황(담당자)%'
  const MENU_ID = 'TODO_act_7631M';
  const API_URL = '/mis/act/act7630/getList2.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['FRM_DT', 'TO_DT', 'INVPRT_NM', 'INME_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7630/getList2.do | inputCols=FRM_DT,TO_DT,INVPRT_NM,INME_FG
  test.skip('[no:1] 기타소득현황(담당자) - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7630/createJavaExcel.do | inputCols=FRM_DT,TO_DT,INVPRT_NM,INME_FG
  test.skip('[no:2] 기타소득현황(담당자) - 저장 (createJavaExcel) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기타소득전산매체 (act_7640M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7640M' OR MNU_NM LIKE '기타소득전산매체%'
  const MENU_ID = 'TODO_act_7640M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'STDR_YY', 'RESI_FG', 'SBMT_DT', 'SBMT_TP', 'SBMT_TERM', 'FRM_YM', 'TO_YM', 'USER_ID'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,STDR_YY,RESI_FG,SBMT_DT,SBMT_TP,SBMT_TERM,FRM_YM,TO_YM,USER_ID
  test.skip('[no:1] 기타소득전산매체 - 조회 (getMainBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7640/getList.do | inputCols=BUSI_PLC_CD,STDR_YY,RESI_FG,SBMT_DT,SBMT_TP,SBMT_TERM,FRM_YM,TO_YM,USER_ID
  test.skip('[no:2] 기타소득전산매체 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7640/getCorp.do | inputCols=BUSI_PLC_CD,STDR_YY,RESI_FG,SBMT_DT,SBMT_TP,SBMT_TERM,FRM_YM,TO_YM,USER_ID
  test.skip('[no:3] 기타소득전산매체 - 조회 (getCorp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7640/getUserTelNo.do | inputCols=CORP_CD,CORP_NM,CORP_ENG_NM,REPRES_NM,BUSI_PLC_CD,BIZRNO,ADDR,ENG_ADDR,CORP_NO,TEL_NO,TAX_OFFC_CD,TAX_OFFC_NM,AGENT_NO,PCHRG_DEPT,PCHRG,TEL_NO1,TEL_NO2,TEL_NO3,RESI_FG,PCHRG_NO
  test.skip('[no:4] 기타소득전산매체 - 조회 (getUserTelNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7640/createIncmFile.do | inputCols=-
  test.skip('[no:5] 기타소득전산매체 - 저장 (createIncmFile) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7640/createIncmFileBi.do | inputCols=-
  test.skip('[no:6] 기타소득전산매체 - 저장 (createIncmFile) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기타소득합계표 (act_7650M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7650M' OR MNU_NM LIKE '기타소득합계표%'
  const MENU_ID = 'TODO_act_7650M';
  const API_URL = '/mis/act/act7650/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7650/getList.do | inputCols=STDR_YY
  test.skip('[no:1] 기타소득합계표 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사업소득자등록 (act_7810M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7810M' OR MNU_NM LIKE '사업소득자등록%'
  const MENU_ID = 'TODO_act_7810M';
  const API_URL = '/mis/act/act7810/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CUST_NM', 'PERS_CORP_FG', 'BUSI_RES_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7810/getList.do | inputCols=CUST_NM,PERS_CORP_FG,BUSI_RES_NO
  test.skip('[no:1] 사업소득자등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7810/getListDtl.do | inputCols=CUST_NM,PERS_CORP_FG,BUSI_RES_NO
  test.skip('[no:2] 사업소득자등록 - 조회 (getListDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7810/getAcc.do | inputCols=CUST_NM,PERS_CORP_FG,BUSI_RES_NO
  test.skip('[no:3] 사업소득자등록 - 조회 (getAcc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7810/setData.do | inputCols=-
  test.skip('[no:4] 사업소득자등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act7810/delData.do | inputCols=-
  test.skip('[no:5] 사업소득자등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getVrifAccNo.do | inputCols=BK_CD,ACC_NO,DPSIT,RST_CD,RST_DPSIT,RST
  test.skip('[no:6] 사업소득자등록 - 조회 (getVrifAccNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act0002/uptAddresCrtfcAt2.do | inputCols=-
  test.skip('[no:7] 사업소득자등록 - 수정 (uptAddresCrtfcAt2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사업소득등록 (act_7820M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7820M' OR MNU_NM LIKE '사업소득등록%'
  const MENU_ID = 'TODO_act_7820M';
  const API_URL = '/mis/act/act7820/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_DT', 'TO_DT', 'CUST_NM', 'CUST_CD', 'DT_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7820/getList.do | inputCols=BUSI_PLC_CD,FRM_DT,TO_DT,CUST_NM,CUST_CD,DT_CLS
  test.skip('[no:1] 사업소득등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7820/getDtl.do | inputCols=BUSI_PLC_CD,FRM_DT,TO_DT,CUST_NM,CUST_CD,DT_CLS
  test.skip('[no:2] 사업소득등록 - 조회 (getDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7820/setData.do | inputCols=-
  test.skip('[no:3] 사업소득등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getBusiPlc.do | inputCols=BUSI_PLC_CD,FRM_DT,TO_DT,CUST_NM,CUST_CD,DT_CLS
  test.skip('[no:4] 사업소득등록 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getEtcTax.do | inputCols=BUSI_PLC_CD,FRM_DT,TO_DT,CUST_NM,CUST_CD,DT_CLS
  test.skip('[no:5] 사업소득등록 - 조회 (getEtcTax) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사업소득현황 (act_7830M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7830M' OR MNU_NM LIKE '사업소득현황%'
  const MENU_ID = 'TODO_act_7830M';
  const API_URL = '/mis/act/act7830/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['FRM_DT', 'TO_DT', 'INVPRT_NM', 'BUSI_PLC_CD', 'CUST_NM', 'CUST_CD', 'RESI_FG', 'POSI', 'DT_CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7830/getList.do | inputCols=FRM_DT,TO_DT,INVPRT_NM,BUSI_PLC_CD,CUST_NM,CUST_CD,RESI_FG,POSI,DT_CLS
  test.skip('[no:1] 사업소득현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7830/getDtl.do | inputCols=FRM_DT,TO_DT,INVPRT_NM,BUSI_PLC_CD,CUST_NM,CUST_CD,RESI_FG,POSI,DT_CLS
  test.skip('[no:2] 사업소득현황 - 조회 (getDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getBusiPlc.do | inputCols=FRM_DT,TO_DT,INVPRT_NM,BUSI_PLC_CD,CUST_NM,CUST_CD,RESI_FG,POSI,DT_CLS
  test.skip('[no:3] 사업소득현황 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사업소득전산매체 (act_7840M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7840M' OR MNU_NM LIKE '사업소득전산매체%'
  const MENU_ID = 'TODO_act_7840M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'STDR_YY', 'FRM_YM', 'TO_YM', 'RESI_FG', 'SBMT_DT', 'SBMT_TP', 'SBMT_TERM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,STDR_YY,FRM_YM,TO_YM,RESI_FG,SBMT_DT,SBMT_TP,SBMT_TERM
  test.skip('[no:1] 사업소득전산매체 - 조회 (getMainBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7840/getList.do | inputCols=BUSI_PLC_CD,STDR_YY,FRM_YM,TO_YM,RESI_FG,SBMT_DT,SBMT_TP,SBMT_TERM
  test.skip('[no:2] 사업소득전산매체 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7640/getCorp.do | inputCols=BUSI_PLC_CD,STDR_YY,FRM_YM,TO_YM,RESI_FG,SBMT_DT,SBMT_TP,SBMT_TERM
  test.skip('[no:3] 사업소득전산매체 - 조회 (getCorp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7640/getUserTelNo.do | inputCols=CORP_CD,CORP_NM,CORP_ENG_NM,REPRES_NM,BUSI_PLC_CD,BIZRNO,ADDR,ENG_ADDR,CORP_NO,TEL_NO,HOMETAX_ID,TAX_OFFC_CD,TAX_OFFC_NM,AGENT_NO,PCHRG_DEPT,PCHRG,TEL_NO1,TEL_NO2,TEL_NO3,RESI_FG,PCHRG_NO
  test.skip('[no:4] 사업소득전산매체 - 조회 (getUserTelNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7840/createIncmFile.do | inputCols=-
  test.skip('[no:5] 사업소득전산매체 - 저장 (createIncmFile) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7840/createIncmFileBi.do | inputCols=-
  test.skip('[no:6] 사업소득전산매체 - 저장 (createIncmFile) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('거주자사업소득간이지급명세서 (act_7850M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7850M' OR MNU_NM LIKE '거주자사업소득간이지급명세서%'
  const MENU_ID = 'TODO_act_7850M';
  const API_URL = '/mis/act/act7850/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_YY', 'RESI_FG', 'YM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7850/getList.do | inputCols=STDR_YY,RESI_FG,YM
  test.skip('[no:1] 거주자사업소득간이지급명세서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7850/chkBips.do | inputCols=STDR_YY,RESI_FG,YM
  test.skip('[no:2] 거주자사업소득간이지급명세서 - 조회 (chkBips) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7850/getEdocFileNm.do | inputCols=STDR_YY,RESI_FG,YM
  test.skip('[no:3] 거주자사업소득간이지급명세서 - 조회 (getEdocFileNm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7850/createEdocFile.do | inputCols=-
  test.skip('[no:4] 거주자사업소득간이지급명세서 - 저장 (createEdocFile) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7850/getEdocFileNmBi.do | inputCols=STDR_YY,RESI_FG,YM
  test.skip('[no:5] 거주자사업소득간이지급명세서 - 조회 (getEdocFileNmBi) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7850/createEdocFileBi.do | inputCols=-
  test.skip('[no:6] 거주자사업소득간이지급명세서 - 저장 (createEdocFileBi) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act7850/uptMst.do | inputCols=INME_NMPR,TOT_PMT_NCNT,TOT_PMT_AMT,SBMT_DT,STDR_YY,RESI_FG,YM,CLOS_YN
  test.skip('[no:7] 거주자사업소득간이지급명세서 - 수정 (uptMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7850/setDataBips.do | inputCols=STDR_YY,RESI_FG,YM
  test.skip('[no:8] 거주자사업소득간이지급명세서 - 저장 (setDataBips) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지급명세서 (act_7910M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7910M' OR MNU_NM LIKE '지급명세서%'
  const MENU_ID = 'TODO_act_7910M';
  const API_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'STDR_YY', 'SPCF_FG', 'SBMT_DT', 'SBMT_TP', 'SBMT_TERM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getMainBusiPlc.do | inputCols=BUSI_PLC_CD,STDR_YY,SPCF_FG,SBMT_DT,SBMT_TP,SBMT_TERM
  test.skip('[no:1] 지급명세서 - 조회 (getMainBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7910/getList.do | inputCols=BUSI_PLC_CD,STDR_YY,SPCF_FG,SBMT_DT,SBMT_TP,SBMT_TERM
  test.skip('[no:2] 지급명세서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7910/getCorp.do | inputCols=BUSI_PLC_CD,STDR_YY,SPCF_FG,SBMT_DT,SBMT_TP,SBMT_TERM
  test.skip('[no:3] 지급명세서 - 조회 (getCorp) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7910/getUserTelNo.do | inputCols=CORP_CD,CORP_NM,CORP_ENG_NM,REPRES_NM,BUSI_PLC_CD,BIZRNO,ADDR,ENG_ADDR,CORP_NO,TEL_NO,TAX_OFFC_CD,TAX_OFFC_NM,AGENT_NO,PCHRG_DEPT,PCHRG,TEL_NO1,TEL_NO2,TEL_NO3,SPCF_FG,HOMETAX_ID,PCHRG_NO
  test.skip('[no:4] 지급명세서 - 조회 (getUserTelNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act7910/"+mode+".do | inputCols=-
  test.skip('[no:5] 지급명세서 - 수정 (createInmeFile) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('간이지급명세서 (act_7920M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7920M' OR MNU_NM LIKE '간이지급명세서%'
  const MENU_ID = 'TODO_act_7920M';
  const API_URL = '/mis/act/act7920/getMain.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_YY', 'INME_FG', 'RESI_FG', 'YM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act7920/getMain.do | inputCols=STDR_YY,INME_FG,RESI_FG,YM
  test.skip('[no:1] 간이지급명세서 - 조회 (getMain) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7920/getList.do | inputCols=STDR_YY,INME_FG,RESI_FG,YM
  test.skip('[no:2] 간이지급명세서 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7920/chkBips.do | inputCols=STDR_YY,INME_FG,RESI_FG,YM
  test.skip('[no:3] 간이지급명세서 - 조회 (chkBips) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7920/getUserTelNo.do | inputCols=SBMT_CLS,AGENT_NO,HOMETAX_ID,CHRG_ID,CHRG_NM,CHRG_DEPT_NM,CHRG_DEPT_CD,TEL_NO1,TEL_NO2,TEL_NO3,FILE_NAME
  test.skip('[no:4] 간이지급명세서 - 조회 (getUserTelNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act7920/uptMst.do | inputCols=STDR_YY,INME_FG,RESI_FG,YM
  test.skip('[no:5] 간이지급명세서 - 수정 (uptMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7920/setClos.do | inputCols=STDR_YY,INME_FG,RESI_FG,YM
  test.skip('[no:6] 간이지급명세서 - 저장 (setClos) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act7920/getEdocFileNm.do | inputCols=STDR_YY,INME_FG,RESI_FG,YM
  test.skip('[no:7] 간이지급명세서 - 조회 (getEdocFileNm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act7920/"+mode+".do | inputCols=-
  test.skip('[no:8] 간이지급명세서 - 수정 (createEdocFile) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act7920/setDataBips.do | inputCols=STDR_YY,INME_FG,RESI_FG,YM
  test.skip('[no:9] 간이지급명세서 - 저장 (setDataBips) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계정초기이월 (act_9010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_9010M' OR MNU_NM LIKE '계정초기이월%'
  const MENU_ID = 'TODO_act_9010M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'ACT_UNIT_NM', 'BUDG_YY', 'ACCT_CD', 'ACCT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_UNIT_CD,ACT_UNIT_NM,BUDG_YY,ACCT_CD,ACCT_NM
  test.skip('[no:1] 계정초기이월 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act9010/getList.do | inputCols=ACT_UNIT_CD,ACT_UNIT_NM,BUDG_YY,ACCT_CD,ACCT_NM
  test.skip('[no:2] 계정초기이월 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act9010/setData.do | inputCols=-
  test.skip('[no:3] 계정초기이월 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getRepresUnt.do | inputCols=ACT_UNIT_CD,ACT_UNIT_NM,BUDG_YY,ACCT_CD,ACCT_NM
  test.skip('[no:4] 계정초기이월 - 조회 (getCode) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('보조부초기이월 (act_9020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_9020M' OR MNU_NM LIKE '보조부초기이월%'
  const MENU_ID = 'TODO_act_9020M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'STDR_YY', 'ACCT_NM', 'DR_AMT_TOTAL', 'CR_AMT_TOTAL'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_UNIT_CD,STDR_YY,ACCT_NM,DR_AMT_TOTAL,CR_AMT_TOTAL
  test.skip('[no:1] 보조부초기이월 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act9020/getList1.do | inputCols=ACT_UNIT_CD,STDR_YY,ACCT_NM,DR_AMT_TOTAL,CR_AMT_TOTAL
  test.skip('[no:2] 보조부초기이월 - 조회 (getList1) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act9020/getList2.do | inputCols=ACT_UNIT_CD,STDR_YY,ACCT_NM,DR_AMT_TOTAL,CR_AMT_TOTAL
  test.skip('[no:3] 보조부초기이월 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act9020/getList3.do | inputCols=ACT_UNIT_CD,STDR_YY,ACCT_NM,DR_AMT_TOTAL,CR_AMT_TOTAL
  test.skip('[no:4] 보조부초기이월 - 조회 (getList3) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act9020/setData.do | inputCols=-
  test.skip('[no:5] 보조부초기이월 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('거래처초기이월 (act_9025M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_9025M' OR MNU_NM LIKE '거래처초기이월%'
  const MENU_ID = 'TODO_act_9025M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_YY', 'ACT_UNIT_CD', 'ACT_UNIT_NM', 'ACCT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=STDR_YY,ACT_UNIT_CD,ACT_UNIT_NM,ACCT_NM
  test.skip('[no:1] 거래처초기이월 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act9025/getList1.do | inputCols=STDR_YY,ACT_UNIT_CD,ACT_UNIT_NM,ACCT_NM
  test.skip('[no:2] 거래처초기이월 - 조회 (getList1) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act9025/getList2.do | inputCols=STDR_YY,ACT_UNIT_CD,ACT_UNIT_NM,ACCT_NM
  test.skip('[no:3] 거래처초기이월 - 조회 (getList2) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act9025/setData.do | inputCols=-
  test.skip('[no:4] 거래처초기이월 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('예금초기이월 (act_9030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_9030M' OR MNU_NM LIKE '예금초기이월%'
  const MENU_ID = 'TODO_act_9030M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'ACT_UNIT_NM', 'STR_UNIT_CD', 'STDR_YY', 'ACC_NO', 'DR_AMT_TOTAL', 'CR_AMT_TOTAL'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_UNIT_CD,ACT_UNIT_NM,STR_UNIT_CD,STDR_YY,ACC_NO,DR_AMT_TOTAL,CR_AMT_TOTAL
  test.skip('[no:1] 예금초기이월 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act9030/getList.do | inputCols=ACT_UNIT_CD,ACT_UNIT_NM,STR_UNIT_CD,STDR_YY,ACC_NO,DR_AMT_TOTAL,CR_AMT_TOTAL
  test.skip('[no:2] 예금초기이월 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act9030/setData.do | inputCols=-
  test.skip('[no:3] 예금초기이월 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000M/getUnt.do | inputCols=ACT_UNIT_CD,ACT_UNIT_NM,STR_UNIT_CD,STDR_YY,ACC_NO,DR_AMT_TOTAL,CR_AMT_TOTAL
  test.skip('[no:4] 예금초기이월 - 조회 (getCode) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('마감 (act_9040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_9040M' OR MNU_NM LIKE '마감%'
  const MENU_ID = 'TODO_act_9040M';
  const API_URL = '/mis/act/act0000/getConf.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CLOS_TRGT_FG', 'STDR_YM', 'STDR_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getConf.do | inputCols=CLOS_TRGT_FG,STDR_YM,STDR_YY
  test.skip('[no:1] 마감 - 조회 (getConf) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act9040/getList.do | inputCols=CLOS_TRGT_FG,STDR_YM,STDR_YY
  test.skip('[no:2] 마감 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act9040/setData.do | inputCols=-
  test.skip('[no:3] 마감 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act9040/delData.do | inputCols=-
  test.skip('[no:4] 마감 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('차기이월 (act_9050M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_9050M' OR MNU_NM LIKE '차기이월%'
  const MENU_ID = 'TODO_act_9050M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'ACT_UNIT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 차기이월 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act9050/getList.do | inputCols=ACT_UNIT_CD,ACT_UNIT_NM
  test.skip('[no:2] 차기이월 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act9050/getListDtl.do | inputCols=ACT_UNIT_CD,ACT_UNIT_NM
  test.skip('[no:3] 차기이월 - 조회 (getListDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act9050/setData.do | inputCols=-
  test.skip('[no:4] 차기이월 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('거래처등록/변경신청 (act_91010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_91010M' OR MNU_NM LIKE '거래처등록/변경신청%'
  const MENU_ID = 'TODO_act_91010M';
  const API_URL = '/mis/act/act91010/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_FRM_DT', 'RQST_TO_DT', 'CUST_FG', 'APV_STAT_CD', 'APNT_NM', 'APNT', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act91010/getList.do | inputCols=RQST_FRM_DT,RQST_TO_DT,CUST_FG,APV_STAT_CD,APNT_NM,APNT,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 거래처등록/변경신청 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('거래처등록/변경신청 (act_91011M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_91011M' OR MNU_NM LIKE '거래처등록/변경신청%'
  const MENU_ID = 'TODO_act_91011M';
  const API_URL = '/mis/act/act91011/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act91011/getList.do | inputCols=-
  test.skip('[no:1] 거래처등록/변경신청 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act91011/getListDtl.do | inputCols=-
  test.skip('[no:2] 거래처등록/변경신청 - 조회 (getListDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act91011/getLoadDtl.do | inputCols=-
  test.skip('[no:3] 거래처등록/변경신청 - 저장 (getLoadDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act91011/getChkResNo.do | inputCols=-
  test.skip('[no:4] 거래처등록/변경신청 - 조회 (getChkResNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act91011/getChkRegNo.do | inputCols=-
  test.skip('[no:5] 거래처등록/변경신청 - 저장 (getChkRegNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act91011/setData.do | inputCols=-
  test.skip('[no:6] 거래처등록/변경신청 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act91011/delData.do | inputCols=-
  test.skip('[no:7] 거래처등록/변경신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act91011/getCheckCustCd.do | inputCols=-
  test.skip('[no:8] 거래처등록/변경신청 - 조회 (getCheckCustCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getVrifAccNo.do | inputCols=BK_CD,ACC_NO,DPSIT,RST_CD,RST_DPSIT,RST
  test.skip('[no:9] 거래처등록/변경신청 - 조회 (getVrifAccNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('거래처등록/변경승인 (act_91020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_91020M' OR MNU_NM LIKE '거래처등록/변경승인%'
  const MENU_ID = 'TODO_act_91020M';
  const API_URL = '/mis/act/act91020/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CUST_NM', 'CUST_FG', 'CUST_CLSF', 'BUY_SALG_FG', 'CUST_CD', 'BIZRNO', 'REPRES_NM', 'USE_YN', 'APV_STAT_CD', 'RQST_FRM_DT', 'RQST_TO_DT', 'RQST_EMP_NM', 'RQST_EMP_NO', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act91020/getList.do | inputCols=CUST_NM,CUST_FG,CUST_CLSF,BUY_SALG_FG,CUST_CD,BIZRNO,REPRES_NM,USE_YN,APV_STAT_CD,RQST_FRM_DT,RQST_TO_DT,RQST_EMP_NM,RQST_EMP_NO,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 거래처등록/변경승인 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act91020/setData.do | inputCols=-
  test.skip('[no:2] 거래처등록/변경승인 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('예산계좌조회 (act_91030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_91030M' OR MNU_NM LIKE '예산계좌조회%'
  const MENU_ID = 'TODO_act_91030M';
  const API_URL = '/mis/act/act91030/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUDG_YY', 'BUDG_FG', 'ACC_FG_CD', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act91030/getList.do | inputCols=BUDG_YY,BUDG_FG,ACC_FG_CD,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 예산계좌조회 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act91030/setData.do | inputCols=-
  test.skip('[no:2] 예산계좌조회 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('증빙제한관리 (act_91040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_91040M' OR MNU_NM LIKE '증빙제한관리%'
  const MENU_ID = 'TODO_act_91040M';
  const API_URL = '/mis/act/act91040/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['PROOF_FG', 'BUY_SALG_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act91040/getList.do | inputCols=PROOF_FG,BUY_SALG_FG
  test.skip('[no:1] 증빙제한관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act91040/uptData.do | inputCols=-
  test.skip('[no:2] 증빙제한관리 - 수정 (uptData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지출발의 (act_92010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92010M' OR MNU_NM LIKE '지출발의%'
  const MENU_ID = 'TODO_act_92010M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'ITNCER', 'ITNCER_NM', 'WTER', 'WTER_NM', 'SBJ', 'UNTY_SACH_FG', 'UNTY_SACH_KEY', 'RESL_TP'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 지출발의 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92010/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,APV_STAT_CD,ITNCER,ITNCER_NM,WTER,WTER_NM,SBJ,UNTY_SACH_FG,UNTY_SACH_KEY,RESL_TP
  test.skip('[no:2] 지출발의 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지출발의 (act_92011M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92011M' OR MNU_NM LIKE '지출발의%'
  const MENU_ID = 'TODO_act_92011M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RESL_DT', 'RESL_NO', 'ACT_UNIT_CD', 'APRQ_DT_NO', 'IF_DOC_NO', 'IF_PGM_ID'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 지출발의 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92011/getData.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD,APRQ_DT_NO,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:2] 지출발의 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92011/getIfData.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD,APRQ_DT_NO,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:3] 지출발의 - 조회 (getIfData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92011/getIf.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD,APRQ_DT_NO,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:4] 지출발의 - 조회 (getIf) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act92011/setData.do | inputCols=-
  test.skip('[no:5] 지출발의 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act92011/delData.do | inputCols=-
  test.skip('[no:6] 지출발의 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92011/getCommDbChk.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD,APRQ_DT_NO,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:7] 지출발의 - 조회 (getCommDbChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getEtcTax.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD,APRQ_DT_NO,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:8] 지출발의 - 조회 (getEtcTax) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92011/getCardDts.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD,APRQ_DT_NO,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:9] 지출발의 - 조회 (getCardDts) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('수입발의 (act_92020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92020M' OR MNU_NM LIKE '수입발의%'
  const MENU_ID = 'TODO_act_92020M';
  const API_URL = '/mis/act/act92020/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_APV_STAT_CD', 'SCH_ITNCER', 'SCH_ITNCER_NM', 'UNTY_SACH_FG', 'UNTY_SACH_KEY', 'SCH_RESL_TP', 'SCH_WTER', 'SCH_WTER_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act92020/getList.do | inputCols=SCH_FRM_DT,SCH_TO_DT,SCH_APV_STAT_CD,SCH_ITNCER,SCH_ITNCER_NM,UNTY_SACH_FG,UNTY_SACH_KEY,SCH_RESL_TP,SCH_WTER,SCH_WTER_NM
  test.skip('[no:1] 수입발의 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('수입발의 (act_92021M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92021M' OR MNU_NM LIKE '수입발의%'
  const MENU_ID = 'TODO_act_92021M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RESL_DT', 'RESL_NO', 'ACT_UNIT_CD', 'APRQ_DT_NO', 'IF_DOC_NO', 'IF_PGM_ID'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 수입발의 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92021/getData.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD,APRQ_DT_NO,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:2] 수입발의 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92021/getIfData.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD,APRQ_DT_NO,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:3] 수입발의 - 조회 (getIfData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92021/getIf.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD,APRQ_DT_NO,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:4] 수입발의 - 조회 (getIf) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act92021/setData.do | inputCols=-
  test.skip('[no:5] 수입발의 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act92021/delData.do | inputCols=-
  test.skip('[no:6] 수입발의 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92021/getCommDbChk.do | inputCols=RESL_DT,RESL_NO,ACT_UNIT_CD,APRQ_DT_NO,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:7] 수입발의 - 조회 (getCommDbChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('미결대체발의 (act_92030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92030M' OR MNU_NM LIKE '미결대체발의%'
  const MENU_ID = 'TODO_act_92030M';
  const API_URL = '/mis/act/act92030/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['UNTY_SACH_FG', 'UNTY_SACH_KEY', 'RESL_FRM_DT', 'RESL_TO_DT', 'APV_STAT_CD', 'RESL_TP', 'WTER_NM', 'WTER'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act92030/getList.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,RESL_FRM_DT,RESL_TO_DT,APV_STAT_CD,RESL_TP,WTER_NM,WTER
  test.skip('[no:1] 미결대체발의 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('미결대체발의 (act_92031M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92031M' OR MNU_NM LIKE '미결대체발의%'
  const MENU_ID = 'TODO_act_92031M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'ACT_STDR_CD', 'RESL_DT', 'RESL_NO', 'OCRNC_FRM_DT', 'OCRNC_TO_DT', 'ACCT_CD', 'ACCT_CHAR', 'INVPRT_NM', 'ACC_FILTER_YN', 'TRNS_FRM_DT', 'TRNS_TO_DT', 'ACC_NO', 'ADD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=CORP_CD,ACT_STDR_CD,RESL_DT,RESL_NO,OCRNC_FRM_DT,OCRNC_TO_DT,ACCT_CD,ACCT_CHAR,INVPRT_NM,ACC_FILTER_YN,TRNS_FRM_DT,TRNS_TO_DT,ACC_NO,ADD
  test.skip('[no:1] 미결대체발의 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92540/getAcctCd.do | inputCols=CORP_CD,ACT_STDR_CD,RESL_DT,RESL_NO,OCRNC_FRM_DT,OCRNC_TO_DT,ACCT_CD,ACCT_CHAR,INVPRT_NM,ACC_FILTER_YN,TRNS_FRM_DT,TRNS_TO_DT,ACC_NO,ADD
  test.skip('[no:2] 미결대체발의 - 조회 (getAcctCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92031/getAccNo.do | inputCols=CORP_CD,ACT_STDR_CD,RESL_DT,RESL_NO,OCRNC_FRM_DT,OCRNC_TO_DT,ACCT_CD,ACCT_CHAR,INVPRT_NM,ACC_FILTER_YN,TRNS_FRM_DT,TRNS_TO_DT,ACC_NO,ADD
  test.skip('[no:3] 미결대체발의 - 조회 (getAccNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92031/getReslMst.do | inputCols=CORP_CD,ACT_STDR_CD,RESL_DT,RESL_NO,OCRNC_FRM_DT,OCRNC_TO_DT,ACCT_CD,ACCT_CHAR,INVPRT_NM,ACC_FILTER_YN,TRNS_FRM_DT,TRNS_TO_DT,ACC_NO,ADD
  test.skip('[no:4] 미결대체발의 - 조회 (getReslMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92031/getReslList.do | inputCols=CORP_CD,ACT_STDR_CD,RESL_DT,RESL_NO,OCRNC_FRM_DT,OCRNC_TO_DT,ACCT_CD,ACCT_CHAR,INVPRT_NM,ACC_FILTER_YN,TRNS_FRM_DT,TRNS_TO_DT,ACC_NO,ADD
  test.skip('[no:5] 미결대체발의 - 조회 (getReslList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92031/getOpeniemList.do | inputCols=CORP_CD,ACT_STDR_CD,RESL_DT,RESL_NO,OCRNC_FRM_DT,OCRNC_TO_DT,ACCT_CD,ACCT_CHAR,INVPRT_NM,ACC_FILTER_YN,TRNS_FRM_DT,TRNS_TO_DT,ACC_NO,ADD
  test.skip('[no:6] 미결대체발의 - 조회 (getOpeniemList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92031/getAcnoTrnsList.do | inputCols=CORP_CD,ACT_STDR_CD,RESL_DT,RESL_NO,OCRNC_FRM_DT,OCRNC_TO_DT,ACCT_CD,ACCT_CHAR,INVPRT_NM,ACC_FILTER_YN,TRNS_FRM_DT,TRNS_TO_DT,ACC_NO,ADD
  test.skip('[no:7] 미결대체발의 - 조회 (getAcnoTrnsList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act92031/setData.do | inputCols=-
  test.skip('[no:8] 미결대체발의 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act92031/delData.do | inputCols=-
  test.skip('[no:9] 미결대체발의 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계정대체발의 (act_92040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92040M' OR MNU_NM LIKE '계정대체발의%'
  const MENU_ID = 'TODO_act_92040M';
  const API_URL = '/mis/act/act92040/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['UNTY_SACH_FG', 'UNTY_SACH_KEY', 'RESL_FRM_DT', 'RESL_TO_DT', 'APV_STAT_CD', 'RESL_TP', 'WTER_NM', 'WTER', 'ITNCER_NM', 'ITNCER'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act92040/getList.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,RESL_FRM_DT,RESL_TO_DT,APV_STAT_CD,RESL_TP,WTER_NM,WTER,ITNCER_NM,ITNCER
  test.skip('[no:1] 계정대체발의 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계정대체발의 (act_92041M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92041M' OR MNU_NM LIKE '계정대체발의%'
  const MENU_ID = 'TODO_act_92041M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'ACT_STDR_CD', 'RESL_DT', 'RESL_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=CORP_CD,ACT_STDR_CD,RESL_DT,RESL_NO
  test.skip('[no:1] 계정대체발의 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92041/getReslMst.do | inputCols=CORP_CD,ACT_STDR_CD,RESL_DT,RESL_NO
  test.skip('[no:2] 계정대체발의 - 조회 (getReslMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92041/getReslList.do | inputCols=CORP_CD,ACT_STDR_CD,RESL_DT,RESL_NO
  test.skip('[no:3] 계정대체발의 - 조회 (getReslList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act92041/setData.do | inputCols=-
  test.skip('[no:4] 계정대체발의 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act92041/delData.do | inputCols=-
  test.skip('[no:5] 계정대체발의 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('미수금 현황 (act_92050M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92050M' OR MNU_NM LIKE '미수금 현황%'
  const MENU_ID = 'TODO_act_92050M';
  const API_URL = '/mis/act/act92050/getListGrid.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['UNTY_SACH_FG', 'UNTY_SACH_KEY', 'FRM_DT', 'TO_DT', 'PBCK_STAT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act92050/getListGrid.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,FRM_DT,TO_DT,PBCK_STAT
  test.skip('[no:1] 미수금 현황 - 조회 (getListGrid) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92050/getList.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,FRM_DT,TO_DT,PBCK_STAT
  test.skip('[no:2] 미수금 현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92050/getListDtl.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,FRM_DT,TO_DT,PBCK_STAT
  test.skip('[no:3] 미수금 현황 - 조회 (getListDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92050/getListAllDtl.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,FRM_DT,TO_DT,PBCK_STAT
  test.skip('[no:4] 미수금 현황 - 조회 (getListAllDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('증빙미발의내역 (act_92060M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92060M' OR MNU_NM LIKE '증빙미발의내역%'
  const MENU_ID = 'TODO_act_92060M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUY_SALG_FG', 'FRM_DT', 'TO_DT', 'TAXBIL_MNGT_NO', 'TAXAFS_FG', 'INVPRT_NM', 'ISUR_BIZRNO', 'OTHBC_YN', 'PROC_STAT_CD', 'UNTY_SACH_FG', 'UNTY_SACH_KEY', 'VAT_YY', 'VAT_QUARTER', 'ACT_UNIT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 증빙미발의내역 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92060/getList.do | inputCols=BUY_SALG_FG,FRM_DT,TO_DT,TAXBIL_MNGT_NO,TAXAFS_FG,INVPRT_NM,ISUR_BIZRNO,OTHBC_YN,PROC_STAT_CD,UNTY_SACH_FG,UNTY_SACH_KEY,VAT_YY,VAT_QUARTER,ACT_UNIT_CD
  test.skip('[no:2] 증빙미발의내역 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act92060/setReSendMsg.do | inputCols=-
  test.skip('[no:3] 증빙미발의내역 - 저장 (setReSendMsg) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회의록등록 (act_92070M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92070M' OR MNU_NM LIKE '회의록등록%'
  const MENU_ID = 'TODO_act_92070M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['UNTY_SACH_FG', 'UNTY_SACH_KEY', 'FRM_DT', 'TO_DT', 'PRE_APRQ_YN', 'RSPRJ_NM', 'RSPRJ_NO', 'RSPRJ_CD', 'APNT_NM', 'APNT', 'RSRCH_RSER_EMP_NM', 'RSRCH_RSER_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 회의록등록 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92070/getList.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,FRM_DT,TO_DT,PRE_APRQ_YN,RSPRJ_NM,RSPRJ_NO,RSPRJ_CD,APNT_NM,APNT,RSRCH_RSER_EMP_NM,RSRCH_RSER_EMP_NO
  test.skip('[no:2] 회의록등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회의록등록 (act_92071M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92071M' OR MNU_NM LIKE '회의록등록%'
  const MENU_ID = 'TODO_act_92071M';
  const API_URL = '/mis/act/act92071/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act92071/getData.do | inputCols=-
  test.skip('[no:1] 회의록등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act92071/setData.do | inputCols=-
  test.skip('[no:2] 회의록등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act92071/delData.do | inputCols=-
  test.skip('[no:3] 회의록등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92071/getHangulAmt.do | inputCols=-
  test.skip('[no:4] 회의록등록 - 조회 (getHangulAmt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회의비지출발의 (act_92080M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92080M' OR MNU_NM LIKE '회의비지출발의%'
  const MENU_ID = 'TODO_act_92080M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'APV_STAT_CD', 'ITNCER', 'ITNCER_NM', 'APNT', 'APNT_NM', 'SBJ', 'UNTY_SACH_FG', 'UNTY_SACH_KEY', 'RESL_TP', 'RQST_FRM_DT', 'RQST_TO_DT', 'PRE_APRQ_YN', 'RSPRJ_NM', 'RSPRJ_NO', 'RSPRJ_CD', 'RSRCH_RSER_EMP_NM', 'RSRCH_RSER_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 회의비지출발의 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92080/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,APV_STAT_CD,ITNCER,ITNCER_NM,APNT,APNT_NM,SBJ,UNTY_SACH_FG,UNTY_SACH_KEY,RESL_TP,RQST_FRM_DT,RQST_TO_DT,PRE_APRQ_YN,RSPRJ_NM,RSPRJ_NO,RSPRJ_CD,RSRCH_RSER_EMP_NM,RSRCH_RSER_EMP_NO
  test.skip('[no:2] 회의비지출발의 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92080/getChk.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,APV_STAT_CD,ITNCER,ITNCER_NM,APNT,APNT_NM,SBJ,UNTY_SACH_FG,UNTY_SACH_KEY,RESL_TP,RQST_FRM_DT,RQST_TO_DT,PRE_APRQ_YN,RSPRJ_NM,RSPRJ_NO,RSPRJ_CD,RSRCH_RSER_EMP_NM,RSRCH_RSER_EMP_NO
  test.skip('[no:3] 회의비지출발의 - 조회 (getChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92080/getCardList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,APV_STAT_CD,ITNCER,ITNCER_NM,APNT,APNT_NM,SBJ,UNTY_SACH_FG,UNTY_SACH_KEY,RESL_TP,RQST_FRM_DT,RQST_TO_DT,PRE_APRQ_YN,RSPRJ_NM,RSPRJ_NO,RSPRJ_CD,RSRCH_RSER_EMP_NM,RSRCH_RSER_EMP_NO
  test.skip('[no:4] 회의비지출발의 - 조회 (getCardList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('결의등록 (act_92510M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92510M' OR MNU_NM LIKE '결의등록%'
  const MENU_ID = 'TODO_act_92510M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'SLIP_FRM_DT', 'SLIP_TO_DT', 'UNTY_SACH_FG', 'UNTY_SACH_KEY', 'SLIP_TP', 'WTER_NM', 'WTER', 'APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_UNIT_CD,SLIP_FRM_DT,SLIP_TO_DT,UNTY_SACH_FG,UNTY_SACH_KEY,SLIP_TP,WTER_NM,WTER,APV_STAT_CD
  test.skip('[no:1] 결의등록 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92510/getList.do | inputCols=ACT_UNIT_CD,SLIP_FRM_DT,SLIP_TO_DT,UNTY_SACH_FG,UNTY_SACH_KEY,SLIP_TP,WTER_NM,WTER,APV_STAT_CD
  test.skip('[no:2] 결의등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('결의등록 (act_92511M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92511M' OR MNU_NM LIKE '결의등록%'
  const MENU_ID = 'TODO_act_92511M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['CORP_CD', 'ACT_STDR_CD', 'SLIP_DT', 'SLIP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=CORP_CD,ACT_STDR_CD,SLIP_DT,SLIP_NO
  test.skip('[no:1] 결의등록 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92511/getSlipMst.do | inputCols=CORP_CD,ACT_STDR_CD,SLIP_DT,SLIP_NO
  test.skip('[no:2] 결의등록 - 조회 (getSlipMst) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92511/getSlipList.do | inputCols=CORP_CD,ACT_STDR_CD,SLIP_DT,SLIP_NO
  test.skip('[no:3] 결의등록 - 조회 (getSlipList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92511/getJnlz.do | inputCols=CORP_CD,ACT_STDR_CD,SLIP_DT,SLIP_NO
  test.skip('[no:4] 결의등록 - 조회 (getJnlz) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act92511/setData.do | inputCols=-
  test.skip('[no:5] 결의등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act92511/setFile.do | inputCols=-
  test.skip('[no:6] 결의등록 - 저장 (setFile) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act92511/delData.do | inputCols=-
  test.skip('[no:7] 결의등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('결의승인 (act_92530M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92530M' OR MNU_NM LIKE '결의승인%'
  const MENU_ID = 'TODO_act_92530M';
  const API_URL = '/mis/act/act0000/getUnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'DT_CLS', 'FRM_DT', 'TO_DT', 'UNTY_SACH_FG', 'UNTY_SACH_KEY', 'SLIP_TP', 'WTER_NM', 'WTER', 'APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_UNIT_CD,DT_CLS,FRM_DT,TO_DT,UNTY_SACH_FG,UNTY_SACH_KEY,SLIP_TP,WTER_NM,WTER,APV_STAT_CD
  test.skip('[no:1] 결의승인 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92530/getList.do | inputCols=ACT_UNIT_CD,DT_CLS,FRM_DT,TO_DT,UNTY_SACH_FG,UNTY_SACH_KEY,SLIP_TP,WTER_NM,WTER,APV_STAT_CD
  test.skip('[no:2] 결의승인 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act92530/setData.do | inputCols=-
  test.skip('[no:3] 결의승인 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('미결내역 (act_92540M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92540M' OR MNU_NM LIKE '미결내역%'
  const MENU_ID = 'TODO_act_92540M';
  const API_URL = '/mis/act/act92540/getAcctCd.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['UNTY_SACH_FG', 'UNTY_SACH_KEY', 'OCRNC_FRM_DT', 'OCRNC_TO_DT', 'ACCT_CHAR', 'ACCT_CD', 'PBCK_STAT', 'OPENIEM_NO', 'ADD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act92540/getAcctCd.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,OCRNC_FRM_DT,OCRNC_TO_DT,ACCT_CHAR,ACCT_CD,PBCK_STAT,OPENIEM_NO,ADD
  test.skip('[no:1] 미결내역 - 조회 (getAcctCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92540/getList.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,OCRNC_FRM_DT,OCRNC_TO_DT,ACCT_CHAR,ACCT_CD,PBCK_STAT,OPENIEM_NO,ADD
  test.skip('[no:2] 미결내역 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92540/getSeffList.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,OCRNC_FRM_DT,OCRNC_TO_DT,ACCT_CHAR,ACCT_CD,PBCK_STAT,OPENIEM_NO,ADD
  test.skip('[no:3] 미결내역 - 조회 (getSeffList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('증빙미발의 미수결의 (act_92550M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92550M' OR MNU_NM LIKE '증빙미발의 미수결의%'
  const MENU_ID = 'TODO_act_92550M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'UNTY_SACH_FG', 'UNTY_SACH_KEY', 'FRM_DT', 'TO_DT', 'BUY_SALG_FG', 'TAXAFS_FG', 'RIP_RQET_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=SERVID
  test.skip('[no:1] 증빙미발의 미수결의 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92550/getList.do | inputCols=ACT_UNIT_CD,UNTY_SACH_FG,UNTY_SACH_KEY,FRM_DT,TO_DT,BUY_SALG_FG,TAXAFS_FG,RIP_RQET_FG
  test.skip('[no:2] 증빙미발의 미수결의 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act92550/getAcctList.do | inputCols=ACT_UNIT_CD,UNTY_SACH_FG,UNTY_SACH_KEY,FRM_DT,TO_DT,BUY_SALG_FG,TAXAFS_FG,RIP_RQET_FG
  test.skip('[no:3] 증빙미발의 미수결의 - 조회 (getAcctList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act92550/setData.do | inputCols=-
  test.skip('[no:4] 증빙미발의 미수결의 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('주요 재무현황 및 비율 (act_94010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_94010M' OR MNU_NM LIKE '주요 재무현황 및 비율%'
  const MENU_ID = 'TODO_act_94010M';
  const API_URL = '/mis/act/act0000/getActComm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_YY', 'ACT_UNIT_MNG_CD', 'STR_UNIT_MNG_CD', 'ACT_STDR_CD', 'FS_FORM_CD', 'ACT_UNIT_CD', 'FRM_DT', 'TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=-
  test.skip('[no:1] 주요 재무현황 및 비율 - 조회 (getActComm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mgt/cfg/cfg0520/getFsFormCd.do | inputCols=STDR_YY,ACT_UNIT_MNG_CD,STR_UNIT_MNG_CD,ACT_STDR_CD,FS_FORM_CD,ACT_UNIT_CD,FRM_DT,TO_DT
  test.skip('[no:2] 주요 재무현황 및 비율 - 조회 (getFsFormCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act94010/setFsNr.do | inputCols=-
  test.skip('[no:3] 주요 재무현황 및 비율 - 저장 (setFsNr) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('결산자료등록 (act_94020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_94020M' OR MNU_NM LIKE '결산자료등록%'
  const MENU_ID = 'TODO_act_94020M';
  const API_URL = '/mis/act/act94020/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_YY', 'SBMT_DEPT_NM', 'SBMT_NM', 'SBMT_ID', 'STAT_FG', 'FS_DTA_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act94020/getList.do | inputCols=STDR_YY,SBMT_DEPT_NM,SBMT_NM,SBMT_ID,STAT_FG,FS_DTA_FG
  test.skip('[no:1] 결산자료등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act94020/getListDtl.do | inputCols=STDR_YY,SBMT_DEPT_NM,SBMT_NM,SBMT_ID,STAT_FG,FS_DTA_FG
  test.skip('[no:2] 결산자료등록 - 조회 (getListDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act94020/getMove.do | inputCols=STDR_YY,SBMT_DEPT_NM,SBMT_NM,SBMT_ID,STAT_FG,FS_DTA_FG
  test.skip('[no:3] 결산자료등록 - 조회 (getMove) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act94020/setData.do | inputCols=-
  test.skip('[no:4] 결산자료등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act94020/delData.do | inputCols=-
  test.skip('[no:5] 결산자료등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act94020/uptData.do | inputCols=-
  test.skip('[no:6] 결산자료등록 - 수정 (uptData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('유가증권등록 (act_95010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_95010M' OR MNU_NM LIKE '유가증권등록%'
  const MENU_ID = 'TODO_act_95010M';
  const API_URL = '/mis/act/act95010/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['UNTY_SACH_FG', 'UNTY_SACH_KEY', 'ACQ_FRM_DT', 'ACQ_TO_DT', 'SETS_KND'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act95010/getList.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,ACQ_FRM_DT,ACQ_TO_DT,SETS_KND
  test.skip('[no:1] 유가증권등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act95010/getListDtl.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,ACQ_FRM_DT,ACQ_TO_DT,SETS_KND
  test.skip('[no:2] 유가증권등록 - 조회 (getListDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act95010/setData.do | inputCols=-
  test.skip('[no:3] 유가증권등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act95010/delData.do | inputCols=-
  test.skip('[no:4] 유가증권등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('어음등록 (act_95020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_95020M' OR MNU_NM LIKE '어음등록%'
  const MENU_ID = 'TODO_act_95020M';
  const API_URL = '/mis/act/act0000/getBusiPlcInfo.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['PUBCT_FRM_DT', 'PUBCT_TO_DT', 'NT_NO', 'NT_TP', 'SLS_CUST_NM', 'STAT_CD', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act0000/getBusiPlcInfo.do | inputCols=PUBCT_FRM_DT,PUBCT_TO_DT,NT_NO,NT_TP,SLS_CUST_NM,STAT_CD,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 어음등록 - 조회 (getBusiPlcInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act95020/getList.do | inputCols=PUBCT_FRM_DT,PUBCT_TO_DT,NT_NO,NT_TP,SLS_CUST_NM,STAT_CD,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:2] 어음등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act95020/getDetail.do | inputCols=PUBCT_FRM_DT,PUBCT_TO_DT,NT_NO,NT_TP,SLS_CUST_NM,STAT_CD,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:3] 어음등록 - 조회 (getDetail) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act95020/setData.do | inputCols=-
  test.skip('[no:4] 어음등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act95020/delData.do | inputCols=-
  test.skip('[no:5] 어음등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자금현황 (act_95030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_95030M' OR MNU_NM LIKE '자금현황%'
  const MENU_ID = 'TODO_act_95030M';
  const API_URL = '/mis/act/act95030/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['UNTY_SACH_FG', 'UNTY_SACH_KEY', 'TRNS_FRM_DT', 'TRNS_TO_DT', 'TRNS_DT_SUUM_YN', 'BK_CD_SUUM_YN', 'ACC_NO_SUUM_YN', 'DPSTS_FG_SUUM_YN', 'DPSTS_TP_SUUM_YN', 'TODY_DFNC_BALC_YN', 'ROLLUP_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act95030/getList.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,TRNS_FRM_DT,TRNS_TO_DT,TRNS_DT_SUUM_YN,BK_CD_SUUM_YN,ACC_NO_SUUM_YN,DPSTS_FG_SUUM_YN,DPSTS_TP_SUUM_YN,TODY_DFNC_BALC_YN,ROLLUP_YN
  test.skip('[no:1] 자금현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('입출금내역등록 (act_95040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_95040M' OR MNU_NM LIKE '입출금내역등록%'
  const MENU_ID = 'TODO_act_95040M';
  const API_URL = '/mis/act/act95040/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ACT_UNIT_CD', 'FRM_DT', 'TO_DT', 'RCPPAY_FG', 'BK_CD', 'BK_NM', 'ACC_NO', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act95040/getList.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,RCPPAY_FG,BK_CD,BK_NM,ACC_NO,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 입출금내역등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act95040/setData.do | inputCols=-
  test.skip('[no:2] 입출금내역등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getUnt.do | inputCols=ACT_UNIT_CD,FRM_DT,TO_DT,RCPPAY_FG,BK_CD,BK_NM,ACC_NO,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:3] 입출금내역등록 - 조회 (getUnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('카드신청 (act_96010M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_96010M' OR MNU_NM LIKE '카드신청%'
  const MENU_ID = 'TODO_act_96010M';
  const API_URL = '/mis/act/act96010/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['UNTY_SACH_FG', 'UNTY_SACH_KEY', 'FRM_DT', 'TO_DT', 'RQST_NO', 'RQST_FG', 'RQST_DEPT_CD', 'RQST_DEPT_NM', 'APNT', 'RQST_EMP_NM', 'APROV_STAT', 'APV_STAT_CD', 'RECEIVE_YN', 'SIGN_STAT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act96010/getList.do | inputCols=UNTY_SACH_FG,UNTY_SACH_KEY,FRM_DT,TO_DT,RQST_NO,RQST_FG,RQST_DEPT_CD,RQST_DEPT_NM,APNT,RQST_EMP_NM,APROV_STAT,APV_STAT_CD,RECEIVE_YN,SIGN_STAT_NM
  test.skip('[no:1] 카드신청 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('카드신청상세 (act_96011M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_96011M' OR MNU_NM LIKE '카드신청상세%'
  const MENU_ID = 'TODO_act_96011M';
  const API_URL = '/mis/act/act96011/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act96011/getData.do | inputCols=-
  test.skip('[no:1] 카드신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act96011/getList.do | inputCols=-
  test.skip('[no:2] 카드신청상세 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act96011/setData.do | inputCols=-
  test.skip('[no:3] 카드신청상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act96011/uptData.do | inputCols=-
  test.skip('[no:4] 카드신청상세 - 수정 (uptData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act96011/delData.do | inputCols=-
  test.skip('[no:5] 카드신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act96011/getChk.do | inputCols=-
  test.skip('[no:6] 카드신청상세 - 조회 (getChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/act/act96011/uptCardData.do | inputCols=-
  test.skip('[no:7] 카드신청상세 - 수정 (uptCardData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act96011/getSignYn.do | inputCols=-
  test.skip('[no:8] 카드신청상세 - 조회 (signYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('카드사용내역등록 (act_96020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_96020M' OR MNU_NM LIKE '카드사용내역등록%'
  const MENU_ID = 'TODO_act_96020M';
  const API_URL = '/mis/act/act96020/rqetDtList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['FRM_DT', 'TO_DT', 'CARD_NO', 'CRDCO_ACCP_NO', 'MRHST_NM', 'RQET_DT', 'RESL_YN', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act96020/rqetDtList.do | inputCols=FRM_DT,TO_DT,CARD_NO,CRDCO_ACCP_NO,MRHST_NM,RQET_DT,RESL_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 카드사용내역등록 - 조회 (rqetDtList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act96020/getList.do | inputCols=FRM_DT,TO_DT,CARD_NO,CRDCO_ACCP_NO,MRHST_NM,RQET_DT,RESL_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:2] 카드사용내역등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act96020/setData.do | inputCols=-
  test.skip('[no:3] 카드사용내역등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('전자(세금)계산서발행신청 (act_97020M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_97020M' OR MNU_NM LIKE '전자(세금)계산서발행신청%'
  const MENU_ID = 'TODO_act_97020M';
  const API_URL = '/mis/act/act97020/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_EMP_NM', 'RQST_EMP_NO', 'FRM_DT', 'TO_DT', 'DT_CLS', 'TAXAFS_FG', 'APV_STAT_CD', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act97020/getList.do | inputCols=RQST_EMP_NM,RQST_EMP_NO,FRM_DT,TO_DT,DT_CLS,TAXAFS_FG,APV_STAT_CD,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 전자(세금)계산서발행신청 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getTaxbillPrint.do | inputCols=RQST_EMP_NM,RQST_EMP_NO,FRM_DT,TO_DT,DT_CLS,TAXAFS_FG,APV_STAT_CD,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:2] 전자(세금)계산서발행신청 - 조회 (getPrint) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act97030/setReSendMail.do | inputCols=-
  test.skip('[no:3] 전자(세금)계산서발행신청 - 저장 (setReSendMail) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('전자(세금)계산서발행신청 (act_97021M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_97021M' OR MNU_NM LIKE '전자(세금)계산서발행신청%'
  const MENU_ID = 'TODO_act_97021M';
  const API_URL = '/mis/act/act97021/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['TAXBIL_PUBCT_NO', 'CUST_CD', 'BILL_PUBCT_NO', 'ORGN_NTS_ACCP_NO', 'MODE', 'UPT_MODE', 'TAXBIL_PUBCT_NO1', 'TAXBIL_PUBCT_NO2', 'CUST_CHG_YN', 'IF_DOC_NO', 'IF_PGM_ID'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act97021/getData.do | inputCols=TAXBIL_PUBCT_NO,CUST_CD,BILL_PUBCT_NO,ORGN_NTS_ACCP_NO,MODE,UPT_MODE,TAXBIL_PUBCT_NO1,TAXBIL_PUBCT_NO2,CUST_CHG_YN,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:1] 전자(세금)계산서발행신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act97021/setData.do | inputCols=-
  test.skip('[no:2] 전자(세금)계산서발행신청 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/act/act97021/delData.do | inputCols=-
  test.skip('[no:3] 전자(세금)계산서발행신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act0000/getActComm.do | inputCols=TAXBIL_PUBCT_NO,CUST_CD,BILL_PUBCT_NO,ORGN_NTS_ACCP_NO,MODE,UPT_MODE,TAXBIL_PUBCT_NO1,TAXBIL_PUBCT_NO2,CUST_CHG_YN,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:4] 전자(세금)계산서발행신청 - 조회 (getBusiPlc) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act97021/getSessTelNo.do | inputCols=TAXBIL_PUBCT_NO,CUST_CD,BILL_PUBCT_NO,ORGN_NTS_ACCP_NO,MODE,UPT_MODE,TAXBIL_PUBCT_NO1,TAXBIL_PUBCT_NO2,CUST_CHG_YN,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:5] 전자(세금)계산서발행신청 - 조회 (getSessTelNo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act97021/getRecChrg.do | inputCols=TAXBIL_PUBCT_NO,CUST_CD,BILL_PUBCT_NO,ORGN_NTS_ACCP_NO,MODE,UPT_MODE,TAXBIL_PUBCT_NO1,TAXBIL_PUBCT_NO2,CUST_CHG_YN,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:6] 전자(세금)계산서발행신청 - 조회 (getRecChrg) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act97021/getCheckUptPubct.do | inputCols=TAXBIL_PUBCT_NO,CUST_CD,BILL_PUBCT_NO,ORGN_NTS_ACCP_NO,MODE,UPT_MODE,TAXBIL_PUBCT_NO1,TAXBIL_PUBCT_NO2,CUST_CHG_YN,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:7] 전자(세금)계산서발행신청 - 조회 (getCheckUptPubct) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act97021/getIfCustData.do | inputCols=TAXBIL_PUBCT_NO,CUST_CD,BILL_PUBCT_NO,ORGN_NTS_ACCP_NO,MODE,UPT_MODE,TAXBIL_PUBCT_NO1,TAXBIL_PUBCT_NO2,CUST_CHG_YN,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:8] 전자(세금)계산서발행신청 - 조회 (getIfCustData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act97021/getIf.do | inputCols=TAXBIL_PUBCT_NO,CUST_CD,BILL_PUBCT_NO,ORGN_NTS_ACCP_NO,MODE,UPT_MODE,TAXBIL_PUBCT_NO1,TAXBIL_PUBCT_NO2,CUST_CHG_YN,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:9] 전자(세금)계산서발행신청 - 조회 (getIf) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act97021/getIfDbChk.do | inputCols=TAXBIL_PUBCT_NO,CUST_CD,BILL_PUBCT_NO,ORGN_NTS_ACCP_NO,MODE,UPT_MODE,TAXBIL_PUBCT_NO1,TAXBIL_PUBCT_NO2,CUST_CHG_YN,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:10] 전자(세금)계산서발행신청 - 조회 (getIfDbChk) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/act/act97021/getIfData.do | inputCols=TAXBIL_PUBCT_NO,CUST_CD,BILL_PUBCT_NO,ORGN_NTS_ACCP_NO,MODE,UPT_MODE,TAXBIL_PUBCT_NO1,TAXBIL_PUBCT_NO2,CUST_CHG_YN,IF_DOC_NO,IF_PGM_ID
  test.skip('[no:11] 전자(세금)계산서발행신청 - 조회 (getIfData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('전자(세금)계산서발행 (act_97030M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_97030M' OR MNU_NM LIKE '전자(세금)계산서발행%'
  const MENU_ID = 'TODO_act_97030M';
  const API_URL = '/mis/act/act97030/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_EMP_NM', 'RQST_EMP_NO', 'FRM_DT', 'TO_DT', 'DT_CLS', 'TAXAFS_FG', 'APV_STAT_CD', 'TRN_YN', 'UNTY_SACH_FG', 'UNTY_SACH_KEY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act97030/getList.do | inputCols=RQST_EMP_NM,RQST_EMP_NO,FRM_DT,TO_DT,DT_CLS,TAXAFS_FG,APV_STAT_CD,TRN_YN,UNTY_SACH_FG,UNTY_SACH_KEY
  test.skip('[no:1] 전자(세금)계산서발행 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act97030/setData.do | inputCols=-
  test.skip('[no:2] 전자(세금)계산서발행 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act97030/setReject.do | inputCols=-
  test.skip('[no:3] 전자(세금)계산서발행 - 저장 (setReject) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/act/act97030/setReSendMail.do | inputCols=-
  test.skip('[no:4] 전자(세금)계산서발행 - 저장 (setReSendMail) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('임대정보불러오기 (act_97040M) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_97040M' OR MNU_NM LIKE '임대정보불러오기%'
  const MENU_ID = 'TODO_act_97040M';
  const API_URL = '/mis/act/act97040/getLoad.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['BUSI_PLC_CD', 'FRM_YM', 'TO_YM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/act/act97040/getLoad.do | inputCols=BUSI_PLC_CD,FRM_YM,TO_YM
  test.skip('[no:1] 임대정보불러오기 - 조회 (getLoad) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});
