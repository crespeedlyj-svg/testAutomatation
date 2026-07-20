// ==============================================================
// HRM 모듈 배치 단위 테스트 — 생성일 2026-06-26
// 입력: _workspace/hrm/01_scenarios.json (unit 271건 / integ 32건)
// hrm_0130M(M_MIS_01_01_03)은 기존 hrm_0130_slow_motion.spec.ts 가 커버 → 제외
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

test.describe('부서조직관리 (hrm_0110m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_0110m' OR MNU_NM LIKE '부서조직관리%'
  const MENU_ID = 'TODO_hrm_0110m';
  const API_URL = '/mis/hrm/hrm0110/getOrgRginList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_ORG_RGIN_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm0110/getOrgRginList.do | inputCols=SCH_ORG_RGIN_DT
  test.skip('[no:1] 부서조직관리 - 조회 (getOrgRginList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm0110/getOrgchtList.do | inputCols=SCH_ORG_RGIN_DT
  test.skip('[no:2] 부서조직관리 - 조회 (getOrgchtList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm0110/setData.do | inputCols=-
  test.skip('[no:3] 부서조직관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm0110/uptData.do | inputCols=-
  test.skip('[no:4] 부서조직관리 - 수정 (uptData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부서조직변경이력관리 (hrm_0120m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_0120m' OR MNU_NM LIKE '부서조직변경이력관리%'
  const MENU_ID = 'TODO_hrm_0120m';
  const API_URL = '/mis/hrm/hrm0120/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['ORG_RGIN_DT', 'ORG_RGIN_FG_CD', 'ORG_RGIN_NM', 'ORG_RGIN_DCSN_YN', 'REFE_METR', 'PRV_ORG_RGIN_DT', 'RGIN_DCSN_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm0120/getList.do | inputCols=ORG_RGIN_DT,ORG_RGIN_FG_CD,ORG_RGIN_NM,ORG_RGIN_DCSN_YN,REFE_METR,PRV_ORG_RGIN_DT,RGIN_DCSN_YN
  test.skip('[no:1] 부서조직변경이력관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm0120/getMaxOrgRginDt.do | inputCols=ORG_RGIN_DT,ORG_RGIN_FG_CD,ORG_RGIN_NM,ORG_RGIN_DCSN_YN,REFE_METR,PRV_ORG_RGIN_DT,RGIN_DCSN_YN
  test.skip('[no:2] 부서조직변경이력관리 - 조회 (getMaxOrgRginDt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm0120/setData.do | inputCols=-
  test.skip('[no:3] 부서조직변경이력관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('정원관리 (hrm_0215m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_0215m' OR MNU_NM LIKE '정원관리%'
  const MENU_ID = 'TODO_hrm_0215m';
  const API_URL = '/mis/hrm/hrm0215/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm0215/getData.do | inputCols=-
  test.skip('[no:1] 정원관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm0215/setData.do | inputCols=-
  test.skip('[no:2] 정원관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm0215/delData.do | inputCols=-
  test.skip('[no:3] 정원관리 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('직급별정/현원표 (hrm_0225m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_0225m' OR MNU_NM LIKE '직급별정/현원표%'
  const MENU_ID = 'TODO_hrm_0225m';
  const API_URL = '/mis/hrm/hrm0225/getGrdData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm0225/getGrdData.do | inputCols=-
  test.skip('[no:1] 직급별정/현원표 - 조회 (getGrdData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('직종별정/현원표 (hrm_0226m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_0226m' OR MNU_NM LIKE '직종별정/현원표%'
  const MENU_ID = 'TODO_hrm_0226m';
  const API_URL = '/mis/hrm/hrm0225/getJsfcData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm0225/getJsfcData.do | inputCols=-
  test.skip('[no:1] 직종별정/현원표 - 조회 (getJsfcData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('학교코드등록 (hrm_1010m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_1010m' OR MNU_NM LIKE '학교코드등록%'
  const MENU_ID = 'TODO_hrm_1010m';
  const API_URL = '/mis/hrm/hrm1010/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_IOCT_FG_CD', 'SCH_SCHL_CD', 'SCH_SCHL_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm1010/getData.do | inputCols=SCH_IOCT_FG_CD,SCH_SCHL_CD,SCH_SCHL_NM
  test.skip('[no:1] 학교코드등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm1010/setData.do | inputCols=-
  test.skip('[no:2] 학교코드등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm1010/setExcelData.do | inputCols=-
  test.skip('[no:3] 학교코드등록 - 저장 (setExcelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용경력평정기준관리 (hrm_1020m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_1020m' OR MNU_NM LIKE '채용경력평정기준관리%'
  const MENU_ID = 'TODO_hrm_1020m';
  const API_URL = '/mis/hrm/hrm1020/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_DGR_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm1020/getData.do | inputCols=SCH_DGR_FG
  test.skip('[no:1] 채용경력평정기준관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm1020/setData.do | inputCols=-
  test.skip('[no:2] 채용경력평정기준관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('발령코드관리 (hrm_2010m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2010m' OR MNU_NM LIKE '발령코드관리%'
  const MENU_ID = 'TODO_hrm_2010m';
  const API_URL = '/mis/hrm/hrm2010/getUppAppntCdList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['UPP_APPNT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2010/getUppAppntCdList.do | inputCols=UPP_APPNT_CD
  test.skip('[no:1] 발령코드관리 - 조회 (getUppAppntCdList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2010/getAppntCdList.do | inputCols=UPP_APPNT_CD
  test.skip('[no:2] 발령코드관리 - 조회 (getAppntCdList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2010/setData.do | inputCols=-
  test.skip('[no:3] 발령코드관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('발령호수관리 (hrm_2020m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2020m' OR MNU_NM LIKE '발령호수관리%'
  const MENU_ID = 'TODO_hrm_2020m';
  const API_URL = '/mis/hrm/hrm2020/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_APPNT_CONT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2020/getData.do | inputCols=SCH_YY,SCH_APPNT_CONT
  test.skip('[no:1] 발령호수관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2020/setData.do | inputCols=-
  test.skip('[no:2] 발령호수관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인사발령관리 (hrm_2030m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2030m' OR MNU_NM LIKE '인사발령관리%'
  const MENU_ID = 'TODO_hrm_2030m';
  const API_URL = '/mis/hrm/hrm2030/getCodeAppnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_APPNT_REGT_MNG_NO', 'SCH_APPNT_DOC_NO', 'SCH_EMP_NO', 'SCH_EMP_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2030/getCodeAppnt.do | inputCols=SCH_APPNT_REGT_MNG_NO,SCH_APPNT_DOC_NO,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:1] 인사발령관리 - 조회 (getCodeAppnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2030/getData.do | inputCols=SCH_APPNT_REGT_MNG_NO,SCH_APPNT_DOC_NO,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:2] 인사발령관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2030/setData.do | inputCols=-
  test.skip('[no:3] 인사발령관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2030/getPrvData.do | inputCols=SCH_APPNT_REGT_MNG_NO,SCH_APPNT_DOC_NO,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:4] 인사발령관리 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인사발령현황 (hrm_2040m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2040m' OR MNU_NM LIKE '인사발령현황%'
  const MENU_ID = 'TODO_hrm_2040m';
  const API_URL = '/mis/hrm/hrm2040/getCodeAppnt.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_UPP_APPNT_CD', 'SCH_APPNT_CD', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_WORK_DGCNT', 'SCH_APPNT_CONT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2040/getCodeAppnt.do | inputCols=SCH_FRM_DT,SCH_TO_DT,SCH_UPP_APPNT_CD,SCH_APPNT_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_APPNT_CONT
  test.skip('[no:1] 인사발령현황 - 조회 (getCodeAppnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2040/getData.do | inputCols=SCH_FRM_DT,SCH_TO_DT,SCH_UPP_APPNT_CD,SCH_APPNT_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_APPNT_CONT
  test.skip('[no:2] 인사발령현황 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('조직개편일괄발령관리 (hrm_2050m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2050m' OR MNU_NM LIKE '조직개편일괄발령관리%'
  const MENU_ID = 'TODO_hrm_2050m';
  const API_URL = '/mis/hrm/hrm2050/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['APPNT_STDR_DT', 'APPNT_REGT_MNG_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/hrm/hrm2050/setSave.do | inputCols=-
  test.skip('[no:1] 조직개편일괄발령관리 - 저장 (setSave) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2050/getList.do | inputCols=APPNT_STDR_DT,APPNT_REGT_MNG_NO
  test.skip('[no:2] 조직개편일괄발령관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2050/setData.do | inputCols=-
  test.skip('[no:3] 조직개편일괄발령관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2050/setSaveDept.do | inputCols=-
  test.skip('[no:4] 조직개편일괄발령관리 - 저장 (setSaveDept) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm0110/getOrgRginList.do | inputCols=APPNT_STDR_DT,APPNT_REGT_MNG_NO
  test.skip('[no:5] 조직개편일괄발령관리 - 조회 (getOrgRginList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm0110/getOrgchtList.do | inputCols=APPNT_STDR_DT,APPNT_REGT_MNG_NO
  test.skip('[no:6] 조직개편일괄발령관리 - 조회 (getOrgchtList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm0110/setData.do | inputCols=-
  test.skip('[no:7] 조직개편일괄발령관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용충원요구신청 (hrm_2100m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2100m' OR MNU_NM LIKE '채용충원요구신청%'
  const MENU_ID = 'TODO_hrm_2100m';
  const API_URL = '/mis/hrm/hrm2100/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_NM', 'SCH_DEPT_CD', 'SCH_APV_STAT_CD', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_EMYT_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2100/getData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_DEPT_NM,SCH_DEPT_CD,SCH_APV_STAT_CD,SCH_EMP_NM,SCH_EMP_NO,SCH_EMYT_YY
  test.skip('[no:1] 채용충원요구신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용충원요구신청 (hrm_2101m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2101m' OR MNU_NM LIKE '채용충원요구신청%'
  const MENU_ID = 'TODO_hrm_2101m';
  const API_URL = '/mis/hrm/hrm2101/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2101/getData.do | inputCols=-
  test.skip('[no:1] 채용충원요구신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2101/setData.do | inputCols=-
  test.skip('[no:2] 채용충원요구신청 - 저장 (setAppData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2101/setData.do | inputCols=-
  test.skip('[no:3] 채용충원요구신청 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm2101/delData.do | inputCols=-
  test.skip('[no:4] 채용충원요구신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용차수관리 (hrm_2105m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2105m' OR MNU_NM LIKE '채용차수관리%'
  const MENU_ID = 'TODO_hrm_2105m';
  const API_URL = '/mis/hrm/hrm2105/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2105/getData.do | inputCols=SCH_YY
  test.skip('[no:1] 채용차수관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2105/setData.do | inputCols=-
  test.skip('[no:2] 채용차수관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용심사단계관리 (hrm_2110m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2110m' OR MNU_NM LIKE '채용심사단계관리%'
  const MENU_ID = 'TODO_hrm_2110m';
  const API_URL = '/mis/hrm/hrm2110/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2110/getData.do | inputCols=-
  test.skip('[no:1] 채용심사단계관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2110/getList.do | inputCols=-
  test.skip('[no:2] 채용심사단계관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2110/setData.do | inputCols=-
  test.skip('[no:3] 채용심사단계관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용계획관리 (hrm_2120m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2120m' OR MNU_NM LIKE '채용계획관리%'
  const MENU_ID = 'TODO_hrm_2120m';
  const API_URL = '/mis/hrm/hrm2120/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_ANNC_YY', 'SCH_EMYT_FG', 'SCH_EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2120/getData.do | inputCols=SCH_ANNC_YY,SCH_EMYT_FG,SCH_EMPO_STLF_CD
  test.skip('[no:1] 채용계획관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용계획관리 (hrm_2121m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2121m' OR MNU_NM LIKE '채용계획관리%'
  const MENU_ID = 'TODO_hrm_2121m';
  const API_URL = '/mis/hrm/hrm2110/getCodeCrs.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2110/getCodeCrs.do | inputCols=-
  test.skip('[no:1] 채용계획관리 - 조회 (getCodeCrs) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2121/getData.do | inputCols=-
  test.skip('[no:2] 채용계획관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2121/setData.do | inputCols=-
  test.skip('[no:3] 채용계획관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm2121/delData.do | inputCols=-
  test.skip('[no:4] 채용계획관리 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('응시자정보관리 (hrm_2130m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2130m' OR MNU_NM LIKE '응시자정보관리%'
  const MENU_ID = 'TODO_hrm_2130m';
  const API_URL = '/mis/hrm/hrm2130/getCodeRalm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2130/getCodeRalm.do | inputCols=-
  test.skip('[no:1] 응시자정보관리 - 조회 (getCodeRalm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2130/getData.do | inputCols=-
  test.skip('[no:2] 응시자정보관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2130/setData.do | inputCols=-
  test.skip('[no:3] 응시자정보관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm2130/delData.do | inputCols=-
  test.skip('[no:4] 응시자정보관리 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2130/setExcelData.do | inputCols=-
  test.skip('[no:5] 응시자정보관리 - 저장 (setExcelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('심사결과관리 (hrm_2140m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2140m' OR MNU_NM LIKE '심사결과관리%'
  const MENU_ID = 'TODO_hrm_2140m';
  const API_URL = '/mis/hrm/hrm2130/getCodeRalm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EMYT_ANNC_MNG_NO', 'SCH_JUDG_STEP_DGCNT', 'SCH_ANNC_SBJ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2130/getCodeRalm.do | inputCols=SCH_EMYT_ANNC_MNG_NO,SCH_JUDG_STEP_DGCNT,SCH_ANNC_SBJ
  test.skip('[no:1] 심사결과관리 - 조회 (getCodeRalm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2140/getData.do | inputCols=SCH_EMYT_ANNC_MNG_NO,SCH_JUDG_STEP_DGCNT,SCH_ANNC_SBJ
  test.skip('[no:2] 심사결과관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2140/setData.do | inputCols=-
  test.skip('[no:3] 심사결과관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm2140/delData.do | inputCols=-
  test.skip('[no:4] 심사결과관리 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2140/setExcelData.do | inputCols=-
  test.skip('[no:5] 심사결과관리 - 저장 (setExcelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용면접비전자서명 (hrm_2145m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2145m' OR MNU_NM LIKE '채용면접비전자서명%'
  const MENU_ID = 'TODO_hrm_2145m';
  const API_URL = '/mis/hrm/hrm2130/getCodeRalm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EMYT_ANNC_MNG_NO', 'SCH_JUDG_STEP_DGCNT', 'SCH_ANNC_SBJ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2130/getCodeRalm.do | inputCols=SCH_EMYT_ANNC_MNG_NO,SCH_JUDG_STEP_DGCNT,SCH_ANNC_SBJ
  test.skip('[no:1] 채용면접비전자서명 - 조회 (getCodeRalm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2145/getData.do | inputCols=SCH_EMYT_ANNC_MNG_NO,SCH_JUDG_STEP_DGCNT,SCH_ANNC_SBJ
  test.skip('[no:2] 채용면접비전자서명 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm2145/simpleSign.do | inputCols=-
  test.skip('[no:3] 채용면접비전자서명 - 수정 (simpleSign) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용면접비지출발의 (hrm_2150m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2150m' OR MNU_NM LIKE '채용면접비지출발의%'
  const MENU_ID = 'TODO_hrm_2150m';
  const API_URL = '/mis/hrm/hrm2150/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APV_STAT_CD', 'SCH_EMP_NO', 'SCH_EMP_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2150/getData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APV_STAT_CD,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:1] 채용면접비지출발의 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용면접비지출발의 (hrm_2151m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2151m' OR MNU_NM LIKE '채용면접비지출발의%'
  const MENU_ID = 'TODO_hrm_2151m';
  const API_URL = '/mis/hrm/hrm2151/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2151/getData.do | inputCols=-
  test.skip('[no:1] 채용면접비지출발의 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2151/setData.do | inputCols=-
  test.skip('[no:2] 채용면접비지출발의 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm2151/delData.do | inputCols=-
  test.skip('[no:3] 채용면접비지출발의 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2151/getCreateData.do | inputCols=-
  test.skip('[no:4] 채용면접비지출발의 - 조회 (getCreateData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2151/setExcelData.do | inputCols=-
  test.skip('[no:5] 채용면접비지출발의 - 저장 (setExcelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용예정자관리 (hrm_2160m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2160m' OR MNU_NM LIKE '채용예정자관리%'
  const MENU_ID = 'TODO_hrm_2160m';
  const API_URL = '/mis/hrm/hrm2130/getCodeRalm.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EMYT_ANNC_MNG_NO', 'SCH_ANNC_SBJ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2130/getCodeRalm.do | inputCols=SCH_EMYT_ANNC_MNG_NO,SCH_ANNC_SBJ
  test.skip('[no:1] 채용예정자관리 - 조회 (getCodeRalm) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2160/getData.do | inputCols=SCH_EMYT_ANNC_MNG_NO,SCH_ANNC_SBJ
  test.skip('[no:2] 채용예정자관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm2160/uptPaepYn.do | inputCols=-
  test.skip('[no:3] 채용예정자관리 - 수정 (uptPaepYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('승진대상자관리 (hrm_2200m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2200m' OR MNU_NM LIKE '승진대상자관리%'
  const MENU_ID = 'TODO_hrm_2200m';
  const API_URL = '/mis/hrm/hrm2200/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_GRD_CD', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2200/getList.do | inputCols=SCH_STDR_YY,SCH_GRD_CD,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM
  test.skip('[no:1] 승진대상자관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2200/setData.do | inputCols=-
  test.skip('[no:2] 승진대상자관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('성과급지급계획관리 (hrm_2300m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2300m' OR MNU_NM LIKE '성과급지급계획관리%'
  const MENU_ID = 'TODO_hrm_2300m';
  const API_URL = '/mis/hrm/hrm2300/getLastData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_PFBN_PLAN_NO', 'SCH_PFBN_PLAN_SBJ'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2300/getLastData.do | inputCols=SCH_PFBN_PLAN_NO,SCH_PFBN_PLAN_SBJ
  test.skip('[no:1] 성과급지급계획관리 - 조회 (getLastData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2300/getData.do | inputCols=SCH_PFBN_PLAN_NO,SCH_PFBN_PLAN_SBJ
  test.skip('[no:2] 성과급지급계획관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2300/setData.do | inputCols=-
  test.skip('[no:3] 성과급지급계획관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm2300/delData.do | inputCols=-
  test.skip('[no:4] 성과급지급계획관리 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('재정기여도관리 (hrm_2305m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2305m' OR MNU_NM LIKE '재정기여도관리%'
  const MENU_ID = 'TODO_hrm_2305m';
  const API_URL = '/mis/hrm/hrm2305/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2305/getData.do | inputCols=STDR_YY
  test.skip('[no:1] 재정기여도관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2305/setData.do | inputCols=-
  test.skip('[no:2] 재정기여도관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2305/setExcelData.do | inputCols=-
  test.skip('[no:3] 재정기여도관리 - 저장 (setExcelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm2305/setScr.do | inputCols=-
  test.skip('[no:4] 재정기여도관리 - 수정 (setScr) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('근무제외일수산정관리 (hrm_2310m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2310m' OR MNU_NM LIKE '근무제외일수산정관리%'
  const MENU_ID = 'TODO_hrm_2310m';
  const API_URL = '/mis/hrm/hrm2310/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_PFBN_PLAN_NO', 'SCH_PFBN_PLAN_SBJ', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_WORK_EXCLUS_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2310/getData.do | inputCols=SCH_PFBN_PLAN_NO,SCH_PFBN_PLAN_SBJ,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_WORK_EXCLUS_FG
  test.skip('[no:1] 근무제외일수산정관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2310/setData.do | inputCols=-
  test.skip('[no:2] 근무제외일수산정관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm2310/delData.do | inputCols=-
  test.skip('[no:3] 근무제외일수산정관리 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2310/setCreateData.do | inputCols=-
  test.skip('[no:4] 근무제외일수산정관리 - 저장 (setCreateData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2310/setExcelData.do | inputCols=-
  test.skip('[no:5] 근무제외일수산정관리 - 저장 (setExcelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('성과급대상자관리 (hrm_2320m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2320m' OR MNU_NM LIKE '성과급대상자관리%'
  const MENU_ID = 'TODO_hrm_2320m';
  const API_URL = '/mis/hrm/hrm2320/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_PFBN_PLAN_NO', 'SCH_PFBN_PLAN_SBJ', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2320/getData.do | inputCols=SCH_PFBN_PLAN_NO,SCH_PFBN_PLAN_SBJ,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM
  test.skip('[no:1] 성과급대상자관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2320/setData.do | inputCols=-
  test.skip('[no:2] 성과급대상자관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm2320/delData.do | inputCols=-
  test.skip('[no:3] 성과급대상자관리 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2320/setCreateData.do | inputCols=-
  test.skip('[no:4] 성과급대상자관리 - 저장 (setCreateData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('성과급산정 (hrm_2330m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2330m' OR MNU_NM LIKE '성과급산정%'
  const MENU_ID = 'TODO_hrm_2330m';
  const API_URL = '/mis/hrm/hrm2330/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_PFBN_PLAN_NO', 'SCH_PFBN_PLAN_SBJ', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2330/getData.do | inputCols=SCH_PFBN_PLAN_NO,SCH_PFBN_PLAN_SBJ,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM
  test.skip('[no:1] 성과급산정 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2330/setData.do | inputCols=-
  test.skip('[no:2] 성과급산정 - 저장 (setAppData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2330/setData.do | inputCols=-
  test.skip('[no:3] 성과급산정 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2330/setCreateData.do | inputCols=-
  test.skip('[no:4] 성과급산정 - 저장 (setCreateData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm2330/uptStat.do | inputCols=-
  test.skip('[no:5] 성과급산정 - 수정 (uptStat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('성과급지급신청 (hrm_2340m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2340m' OR MNU_NM LIKE '성과급지급신청%'
  const MENU_ID = 'TODO_hrm_2340m';
  const API_URL = '/mis/hrm/hrm2340/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2340/getData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 성과급지급신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('성과급지급신청 (hrm_2341m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2341m' OR MNU_NM LIKE '성과급지급신청%'
  const MENU_ID = 'TODO_hrm_2341m';
  const API_URL = '/mis/hrm/hrm2341/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2341/getData.do | inputCols=-
  test.skip('[no:1] 성과급지급신청 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2341/getTgpnList.do | inputCols=-
  test.skip('[no:2] 성과급지급신청 - 조회 (getTgpnList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2341/setData.do | inputCols=-
  test.skip('[no:3] 성과급지급신청 - 저장 (setAppData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2341/setData.do | inputCols=-
  test.skip('[no:4] 성과급지급신청 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm2341/delData.do | inputCols=-
  test.skip('[no:5] 성과급지급신청 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('성과급지급승인관리 (hrm_2350m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2350m' OR MNU_NM LIKE '성과급지급승인관리%'
  const MENU_ID = 'TODO_hrm_2350m';
  const API_URL = '/mis/hrm/hrm2340/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2340/getData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 성과급지급승인관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm2340/uptStat.do | inputCols=-
  test.skip('[no:2] 성과급지급승인관리 - 수정 (uptApprobation) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm2340/uptStat.do | inputCols=-
  test.skip('[no:3] 성과급지급승인관리 - 수정 (setReject) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('휴/복직신청서목록 (hrm_2400m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2400m' OR MNU_NM LIKE '휴/복직신청서목록%'
  const MENU_ID = 'TODO_hrm_2400m';
  const API_URL = '/mis/hrm/hrm2400/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_APNT_DEPT_CD', 'SCH_APNT_DEPT_NM', 'SCH_RQST_FG_CD', 'SCH_LYOFP_DSTCP_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2400/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_APNT_DEPT_CD,SCH_APNT_DEPT_NM,SCH_RQST_FG_CD,SCH_LYOFP_DSTCP_EMP_NO
  test.skip('[no:1] 휴/복직신청서목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('휴직/파견신청상세 (hrm_2401m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2401m' OR MNU_NM LIKE '휴직/파견신청상세%'
  const MENU_ID = 'TODO_hrm_2401m';
  const API_URL = '/mis/hrm/hrm2401/getPrvData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [DELETE] URL=/mis/hrm/hrm2401/delData.do | inputCols=-
  test.skip('[no:1] 휴직/파견신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2401/setRqstData.do | inputCols=-
  test.skip('[no:2] 휴직/파견신청상세 - 저장 (setAppData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2401/setRqstData.do | inputCols=-
  test.skip('[no:3] 휴직/파견신청상세 - 저장 (setRqstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2401/getPrvData.do | inputCols=-
  test.skip('[no:4] 휴직/파견신청상세 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2401/getRqstData.do | inputCols=-
  test.skip('[no:5] 휴직/파견신청상세 - 조회 (getRqstData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2401/getEmpInfo.do | inputCols=-
  test.skip('[no:6] 휴직/파견신청상세 - 조회 (getEmpInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직신청목록 (hrm_2410m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2410m' OR MNU_NM LIKE '퇴직신청목록%'
  const MENU_ID = 'TODO_hrm_2410m';
  const API_URL = '/mis/gen/gen0090/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['FRM_DT', 'TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'RQST_CLS', 'APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0090/getList.do | inputCols=FRM_DT,TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,RQST_CLS,APV_STAT_CD
  test.skip('[no:1] 퇴직신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직신청상세 (hrm_2411m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2411m' OR MNU_NM LIKE '퇴직신청상세%'
  const MENU_ID = 'TODO_hrm_2411m';
  const API_URL = '/mis/gen/gen0091/getEmpInfo.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/gen/gen0091/getEmpInfo.do | inputCols=-
  test.skip('[no:1] 퇴직신청상세 - 조회 (getEmpInfo) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/gen/gen0091/getRqstData.do | inputCols=-
  test.skip('[no:2] 퇴직신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0091/setSelfGwData.do | inputCols=-
  test.skip('[no:3] 퇴직신청상세 - 저장 (setSelfGwData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/gen/gen0091/setRsignRqst.do | inputCols=-
  test.skip('[no:4] 퇴직신청상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/gen/gen0091/delData.do | inputCols=-
  test.skip('[no:5] 퇴직신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자녀6세이하비과세신청목록 (hrm_2500m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2500m' OR MNU_NM LIKE '자녀6세이하비과세신청목록%'
  const MENU_ID = 'TODO_hrm_2500m';
  const API_URL = '/mis/hrm/hrm2500/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_STAT_CD', 'SCH_DEPT_NM', 'SCH_DEPT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2500/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_NM,SCH_EMP_NO,SCH_STAT_CD,SCH_DEPT_NM,SCH_DEPT_CD
  test.skip('[no:1] 자녀6세이하비과세신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자녀6세이하비과세신청상세 (hrm_2501m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2501m' OR MNU_NM LIKE '자녀6세이하비과세신청상세%'
  const MENU_ID = 'TODO_hrm_2501m';
  const API_URL = '/mis/hrm/hrm2501/getPrvData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2501/getPrvData.do | inputCols=-
  test.skip('[no:1] 자녀6세이하비과세신청상세 - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm2501/getData.do | inputCols=-
  test.skip('[no:2] 자녀6세이하비과세신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2501/setData.do | inputCols=-
  test.skip('[no:3] 자녀6세이하비과세신청상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm2501/delData.do | inputCols=-
  test.skip('[no:4] 자녀6세이하비과세신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자녀6세이하비과세승인관리 (hrm_2510m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2510m' OR MNU_NM LIKE '자녀6세이하비과세승인관리%'
  const MENU_ID = 'TODO_hrm_2510m';
  const API_URL = '/mis/hrm/hrm2510/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_STAT_CD', 'SCH_DEPT_NM', 'SCH_DEPT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2510/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_NM,SCH_EMP_NO,SCH_STAT_CD,SCH_DEPT_NM,SCH_DEPT_CD
  test.skip('[no:1] 자녀6세이하비과세승인관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm2510/setReject.do | inputCols=-
  test.skip('[no:2] 자녀6세이하비과세승인관리 - 수정 (setReject) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm2510/setApprov.do | inputCols=-
  test.skip('[no:3] 자녀6세이하비과세승인관리 - 수정 (setApprov) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('차량보조비비과세신청목록 (hrm_2520m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2520m' OR MNU_NM LIKE '차량보조비비과세신청목록%'
  const MENU_ID = 'TODO_hrm_2520m';
  const API_URL = '/mis/hrm/hrm2520/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_NO', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_STAT_CD', 'SCH_DEPT_NM', 'SCH_DEPT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2520/getList.do | inputCols=SCH_RQST_NO,SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_NM,SCH_EMP_NO,SCH_STAT_CD,SCH_DEPT_NM,SCH_DEPT_CD
  test.skip('[no:1] 차량보조비비과세신청목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('차량보조비비과세신청상세 (hrm_2521m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2521m' OR MNU_NM LIKE '차량보조비비과세신청상세%'
  const MENU_ID = 'TODO_hrm_2521m';
  const API_URL = '/mis/hrm/hrm2521/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2521/getData.do | inputCols=-
  test.skip('[no:1] 차량보조비비과세신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm2521/setData.do | inputCols=-
  test.skip('[no:2] 차량보조비비과세신청상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm2521/delData.do | inputCols=-
  test.skip('[no:3] 차량보조비비과세신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('차량보조비비과세승인관리 (hrm_2530m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2530m' OR MNU_NM LIKE '차량보조비비과세승인관리%'
  const MENU_ID = 'TODO_hrm_2530m';
  const API_URL = '/mis/hrm/hrm2530/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_STAT_CD', 'SCH_DEPT_NM', 'SCH_DEPT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm2530/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_EMP_NM,SCH_EMP_NO,SCH_STAT_CD,SCH_DEPT_NM,SCH_DEPT_CD
  test.skip('[no:1] 차량보조비비과세승인관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm2530/setReject.do | inputCols=-
  test.skip('[no:2] 차량보조비비과세승인관리 - 수정 (setReject) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm2530/setApprov.do | inputCols=-
  test.skip('[no:3] 차량보조비비과세승인관리 - 수정 (setApprov) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm2530/setExpr.do | inputCols=-
  test.skip('[no:4] 차량보조비비과세승인관리 - 수정 (setExpr) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인사정보관리 (hrm_3010m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3010m' OR MNU_NM LIKE '인사정보관리%'
  const MENU_ID = 'TODO_hrm_3010m';
  const API_URL = '/mis/hrm/hrm3010/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_HLDF_FG_CD', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMPO_STLF_CD', 'SCH_JSFC_CD', 'SCH_GRD_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3010/getList.do | inputCols=SCH_HLDF_FG_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMPO_STLF_CD,SCH_JSFC_CD,SCH_GRD_CD
  test.skip('[no:1] 인사정보관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm3010/getMain.do | inputCols=SCH_HLDF_FG_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMPO_STLF_CD,SCH_JSFC_CD,SCH_GRD_CD
  test.skip('[no:2] 인사정보관리 - 조회 (getMain) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm3010/getHrmData.do | inputCols=SCH_HLDF_FG_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMPO_STLF_CD,SCH_JSFC_CD,SCH_GRD_CD
  test.skip('[no:3] 인사정보관리 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3010/setHrmData.do | inputCols=-
  test.skip('[no:4] 인사정보관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/fileRename.do | inputCols=-
  test.skip('[no:5] 인사정보관리 - 저장 (setImage) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('노조가입관리 (hrm_3012m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3012m' OR MNU_NM LIKE '노조가입관리%'
  const MENU_ID = 'TODO_hrm_3012m';
  const API_URL = '/mis/hrm/hrm3012/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_DT', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_WORK_DGCNT', 'SCH_STOP_YN', 'SCH_SESN_YN', 'SCH_LBUN_FG', 'SCH_DEPT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3012/getList.do | inputCols=SCH_STDR_DT,SCH_EMP_NO,SCH_EMP_NM,SCH_WORK_DGCNT,SCH_STOP_YN,SCH_SESN_YN,SCH_LBUN_FG,SCH_DEPT_CD
  test.skip('[no:1] 노조가입관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3012/setData.do | inputCols=-
  test.skip('[no:2] 노조가입관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('노동조합관리 (hrm_3015m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3015m' OR MNU_NM LIKE '노동조합관리%'
  const MENU_ID = 'TODO_hrm_3015m';
  const API_URL = '/mis/hrm/hrm3015/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_LBUN_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3015/getList.do | inputCols=SCH_LBUN_FG
  test.skip('[no:1] 노동조합관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3015/setData.do | inputCols=-
  test.skip('[no:2] 노동조합관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('노조가입현황 (hrm_3016m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3016m' OR MNU_NM LIKE '노조가입현황%'
  const MENU_ID = 'TODO_hrm_3016m';
  const API_URL = '/mis/hrm/hrm3016/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FG', 'SCH_EMPO', 'SCH_LBUN_STAT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3016/getList.do | inputCols=SCH_FG,SCH_EMPO,SCH_LBUN_STAT
  test.skip('[no:1] 노조가입현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm3016/getDtlList.do | inputCols=SCH_FG,SCH_EMPO,SCH_LBUN_STAT
  test.skip('[no:2] 노조가입현황 - 조회 (getDtlList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개인인사정보 (hrm_3020m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3020m' OR MNU_NM LIKE '개인인사정보%'
  const MENU_ID = 'TODO_hrm_3020m';
  const API_URL = '/mis/hrm/hrm3010/getMain.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3010/getMain.do | inputCols=-
  test.skip('[no:1] 개인인사정보 - 조회 (getMain) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm3020/getHrmData.do | inputCols=-
  test.skip('[no:2] 개인인사정보 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3010/setHrmData.do | inputCols=-
  test.skip('[no:3] 개인인사정보 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/fileRename.do | inputCols=-
  test.skip('[no:4] 개인인사정보 - 저장 (setImage) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개인인사정보변경신청목록 (hrm_3030m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3030m' OR MNU_NM LIKE '개인인사정보변경신청목록%'
  const MENU_ID = 'TODO_hrm_3030m';
  const API_URL = '/mis/hrm/hrm3030/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3030/getData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 개인인사정보변경신청목록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개인인사정보변경신청상세 (hrm_3031m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3031m' OR MNU_NM LIKE '개인인사정보변경신청상세%'
  const MENU_ID = 'TODO_hrm_3031m';
  const API_URL = '/mis/hrm/hrm3031/getMain.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3031/getMain.do | inputCols=-
  test.skip('[no:1] 개인인사정보변경신청상세 - 조회 (getMain) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm3031/setGetTabData.do | inputCols=-
  test.skip('[no:2] 개인인사정보변경신청상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3031/setTabData.do | inputCols=-
  test.skip('[no:3] 개인인사정보변경신청상세 - 저장 (setAppData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3031/setTabData.do | inputCols=-
  test.skip('[no:4] 개인인사정보변경신청상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm3031/delData.do | inputCols=-
  test.skip('[no:5] 개인인사정보변경신청상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개인인사정보변경승인관리목록 (hrm_3040m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3040m' OR MNU_NM LIKE '개인인사정보변경승인관리목록%'
  const MENU_ID = 'TODO_hrm_3040m';
  const API_URL = '/mis/hrm/hrm3040/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3040/getData.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_RQST_STAT_CD
  test.skip('[no:1] 개인인사정보변경승인관리목록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개인인사정보변경승인관리상세 (hrm_3041m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3041m' OR MNU_NM LIKE '개인인사정보변경승인관리상세%'
  const MENU_ID = 'TODO_hrm_3041m';
  const API_URL = '/mis/hrm/hrm3041/getMain.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3041/getMain.do | inputCols=-
  test.skip('[no:1] 개인인사정보변경승인관리상세 - 조회 (getMain) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm3041/getTabData.do | inputCols=-
  test.skip('[no:2] 개인인사정보변경승인관리상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3041/setData.do | inputCols=-
  test.skip('[no:3] 개인인사정보변경승인관리상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm3041/uptStat.do | inputCols=-
  test.skip('[no:4] 개인인사정보변경승인관리상세 - 수정 (uptStat) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('근무평점일괄업로드 (hrm_3050m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3050m' OR MNU_NM LIKE '근무평점일괄업로드%'
  const MENU_ID = 'TODO_hrm_3050m';
  const API_URL = '/mis/hrm/hrm3050/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['YY', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'GRD_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3050/getList.do | inputCols=YY,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,GRD_CD
  test.skip('[no:1] 근무평점일괄업로드 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3050/setData.do | inputCols=-
  test.skip('[no:2] 근무평점일괄업로드 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm3050/getChkList.do | inputCols=YY,EMP_NO,EMP_NM,DEPT_CD,DEPT_NM,GRD_CD
  test.skip('[no:3] 근무평점일괄업로드 - 조회 (getChkList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('고용계약관리(일반직) (hrm_3100m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3100m' OR MNU_NM LIKE '고용계약관리(일반직)%'
  const MENU_ID = 'TODO_hrm_3100m';
  const API_URL = '/mis/hrm/hrm3100/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_FRM_YM', 'SCH_STDR_TO_YM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_GRD_CD', 'SCH_WORK_DGCNT', 'SCH_CTRCT_PROG_STAT_CD', 'SCH_EMPO_CTRCT_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3100/getList.do | inputCols=SCH_STDR_FRM_YM,SCH_STDR_TO_YM,SCH_EMP_NO,SCH_EMP_NM,SCH_GRD_CD,SCH_WORK_DGCNT,SCH_CTRCT_PROG_STAT_CD,SCH_EMPO_CTRCT_FG_CD
  test.skip('[no:1] 고용계약관리(일반직) - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3100/setData.do | inputCols=-
  test.skip('[no:2] 고용계약관리(일반직) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm3100/delData.do | inputCols=-
  test.skip('[no:3] 고용계약관리(일반직) - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3100/setRequest.do | inputCols=-
  test.skip('[no:4] 고용계약관리(일반직) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('고용계약관리(계약직) (hrm_3110m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3110m' OR MNU_NM LIKE '고용계약관리(계약직)%'
  const MENU_ID = 'TODO_hrm_3110m';
  const API_URL = '/mis/hrm/hrm3110/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_FRM_YM', 'SCH_STDR_TO_YM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_GRD_CD', 'SCH_WORK_DGCNT', 'SCH_CTRCT_PROG_STAT_CD', 'SCH_EMPO_CTRCT_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3110/getList.do | inputCols=SCH_STDR_FRM_YM,SCH_STDR_TO_YM,SCH_EMP_NO,SCH_EMP_NM,SCH_GRD_CD,SCH_WORK_DGCNT,SCH_CTRCT_PROG_STAT_CD,SCH_EMPO_CTRCT_FG_CD
  test.skip('[no:1] 고용계약관리(계약직) - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3110/setData.do | inputCols=-
  test.skip('[no:2] 고용계약관리(계약직) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('재임용대상자관리 (hrm_3115m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3115m' OR MNU_NM LIKE '재임용대상자관리%'
  const MENU_ID = 'TODO_hrm_3115m';
  const API_URL = '/mis/hrm/hrm3115/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_CTRCT_FRM_YM', 'SCH_CTRCT_TO_YM', 'SCH_EXPR_FRM_YM', 'SCH_EXPR_TO_YM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3115/getList.do | inputCols=SCH_CTRCT_FRM_YM,SCH_CTRCT_TO_YM,SCH_EXPR_FRM_YM,SCH_EXPR_TO_YM,SCH_EMP_NO,SCH_EMP_NM,SCH_EMPO_STLF_CD
  test.skip('[no:1] 재임용대상자관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3115/setData.do | inputCols=-
  test.skip('[no:2] 재임용대상자관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('고용계약통보관리 (hrm_3120m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3120m' OR MNU_NM LIKE '고용계약통보관리%'
  const MENU_ID = 'TODO_hrm_3120m';
  const API_URL = '/mis/hrm/hrm3120/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_FRM_YM', 'SCH_STDR_TO_YM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_GRD_CD', 'SCH_WORK_DGCNT', 'SCH_CTRCT_PROG_STAT_CD', 'SCH_EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3120/getList.do | inputCols=SCH_STDR_FRM_YM,SCH_STDR_TO_YM,SCH_EMP_NO,SCH_EMP_NM,SCH_GRD_CD,SCH_WORK_DGCNT,SCH_CTRCT_PROG_STAT_CD,SCH_EMPO_STLF_CD
  test.skip('[no:1] 고용계약통보관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3120/setFconf.do | inputCols=-
  test.skip('[no:2] 고용계약통보관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3120/setRequest.do | inputCols=-
  test.skip('[no:3] 고용계약통보관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계약직재계약여부확인 (hrm_3130m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3130m' OR MNU_NM LIKE '계약직재계약여부확인%'
  const MENU_ID = 'TODO_hrm_3130m';
  const API_URL = '/mis/hrm/hrm3130/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_APLY_YY', 'SCH_PRJT_RSER_EMP_NO', 'SCH_PRJT_RSER_EMP_NM', 'SCH_WORK_DGCNT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_CNK_RCTRT_YN', 'SCH_GRD_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3130/getList.do | inputCols=SCH_APLY_YY,SCH_PRJT_RSER_EMP_NO,SCH_PRJT_RSER_EMP_NM,SCH_WORK_DGCNT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_CNK_RCTRT_YN,SCH_GRD_CD
  test.skip('[no:1] 계약직재계약여부확인 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm3130/setRctrt.do | inputCols=-
  test.skip('[no:2] 계약직재계약여부확인 - 수정 (setRctrt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('고용계약현황 (hrm_3140m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3140m' OR MNU_NM LIKE '고용계약현황%'
  const MENU_ID = 'TODO_hrm_3140m';
  const API_URL = '/mis/hrm/hrm3140/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_APLY_YY', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMPO_STLF_CD', 'SCH_EMPO_STLF_NM', 'SCH_CTRCT_PROG_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3140/getList.do | inputCols=SCH_APLY_YY,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMPO_STLF_CD,SCH_EMPO_STLF_NM,SCH_CTRCT_PROG_STAT_CD
  test.skip('[no:1] 고용계약현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('고용계약서확인 (hrm_3150m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3150m' OR MNU_NM LIKE '고용계약서확인%'
  const MENU_ID = 'TODO_hrm_3150m';
  const API_URL = '/mis/hrm/hrm3150/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_CTRCT_PROG_STAT_CD', 'SCH_WORK_DGCNT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3150/getList.do | inputCols=SCH_EMP_NO,SCH_EMP_NM,SCH_CTRCT_PROG_STAT_CD,SCH_WORK_DGCNT
  test.skip('[no:1] 고용계약서확인 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3150/setData.do | inputCols=-
  test.skip('[no:2] 고용계약서확인 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm3150/getSignYn.do | inputCols=SCH_EMP_NO,SCH_EMP_NM,SCH_CTRCT_PROG_STAT_CD,SCH_WORK_DGCNT
  test.skip('[no:3] 고용계약서확인 - 조회 (signYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연봉계약확인 (hrm_3160m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3160m' OR MNU_NM LIKE '연봉계약확인%'
  const MENU_ID = 'TODO_hrm_3160m';
  const API_URL = '/mis/hrm/hrm3160/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_CTRCT_PROG_STAT_CD', 'SCH_WORK_DGCNT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3160/getList.do | inputCols=SCH_EMP_NO,SCH_EMP_NM,SCH_CTRCT_PROG_STAT_CD,SCH_WORK_DGCNT
  test.skip('[no:1] 연봉계약확인 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3160/setData.do | inputCols=-
  test.skip('[no:2] 연봉계약확인 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사인처리 (hrm_3162m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3162m' OR MNU_NM LIKE '사인처리%'
  const MENU_ID = 'TODO_hrm_3162m';
  const API_URL = '';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL= | inputCols=-
  test.skip('[no:1] 사인처리 - 화면 로드 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('고용계약총괄표 (hrm_3170m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3170m' OR MNU_NM LIKE '고용계약총괄표%'
  const MENU_ID = 'TODO_hrm_3170m';
  const API_URL = '/mis/hrm/hrm3170/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_FG', 'SCH_YM', 'SCH_EMPO_STLF_CD', 'SCH_CD', 'SCH_STDR_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3170/getList.do | inputCols=SCH_STDR_YY,SCH_FG,SCH_YM,SCH_EMPO_STLF_CD,SCH_CD,SCH_STDR_DT
  test.skip('[no:1] 고용계약총괄표 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm3170/getDtlList.do | inputCols=SCH_STDR_YY,SCH_FG,SCH_YM,SCH_EMPO_STLF_CD,SCH_CD,SCH_STDR_DT
  test.skip('[no:2] 고용계약총괄표 - 조회 (getDtlList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기준연봉관리 (hrm_3200m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3200m' OR MNU_NM LIKE '기준연봉관리%'
  const MENU_ID = 'TODO_hrm_3200m';
  const API_URL = '/mis/hrm/hrm3200/getJsfcList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_EMPO_STLF_CD', 'SCH_JSFC_CD', 'SCH_GRD_CD', 'SCH_DCSN_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3200/getJsfcList.do | inputCols=SCH_STDR_YY,SCH_EMPO_STLF_CD,SCH_JSFC_CD,SCH_GRD_CD,SCH_DCSN_YN
  test.skip('[no:1] 기준연봉관리 - 조회 (getJsfcList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm3200/getList.do | inputCols=SCH_STDR_YY,SCH_EMPO_STLF_CD,SCH_JSFC_CD,SCH_GRD_CD,SCH_DCSN_YN
  test.skip('[no:2] 기준연봉관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3200/setData.do | inputCols=-
  test.skip('[no:3] 기준연봉관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm3200/delData.do | inputCols=-
  test.skip('[no:4] 기준연봉관리 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3200/uploadExcelData.do | inputCols=-
  test.skip('[no:5] 기준연봉관리 - 저장 (uploadExcelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('성과연봉관리 (hrm_3210m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3210m' OR MNU_NM LIKE '성과연봉관리%'
  const MENU_ID = 'TODO_hrm_3210m';
  const API_URL = '/mis/hrm/hrm3210/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3210/getList.do | inputCols=SCH_STDR_YY,SCH_EMPO_STLF_CD
  test.skip('[no:1] 성과연봉관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3210/setData.do | inputCols=-
  test.skip('[no:2] 성과연봉관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('승호관리 (hrm_3220m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3220m' OR MNU_NM LIKE '승호관리%'
  const MENU_ID = 'TODO_hrm_3220m';
  const API_URL = '/mis/hrm/hrm3220/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_EVAL_JBGP', 'SCH_JSFC_CD', 'SCH_GRD_CD', 'SCH_HLDF_FG_CD', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3220/getList.do | inputCols=SCH_STDR_YY,SCH_EVAL_JBGP,SCH_JSFC_CD,SCH_GRD_CD,SCH_HLDF_FG_CD,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO
  test.skip('[no:1] 승호관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3220/setData.do | inputCols=-
  test.skip('[no:2] 승호관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3220/setCpeData.do | inputCols=-
  test.skip('[no:3] 승호관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3220/uploadExcelData.do | inputCols=-
  test.skip('[no:4] 승호관리 - 저장 (uploadExcelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인사포인트관리 (hrm_3230m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3230m' OR MNU_NM LIKE '인사포인트관리%'
  const MENU_ID = 'TODO_hrm_3230m';
  const API_URL = '/mis/hrm/hrm3230/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_HLDF_FG_CD', 'SCH_JSFC_CD', 'SCH_GRD_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3230/getList.do | inputCols=SCH_STDR_YY,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_HLDF_FG_CD,SCH_JSFC_CD,SCH_GRD_CD
  test.skip('[no:1] 인사포인트관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('일반직연봉계약등록관리 (hrm_3240m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3240m' OR MNU_NM LIKE '일반직연봉계약등록관리%'
  const MENU_ID = 'TODO_hrm_3240m';
  const API_URL = '/mis/hrm/hrm3240/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_STDR_YY', 'SCH_TO_STDR_YY', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_CTRCT_PROG_STAT_CD', 'SCH_ANRY_CTRCT_FG_CD', 'SCH_WORK_DGCNT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3240/getList.do | inputCols=SCH_FRM_STDR_YY,SCH_TO_STDR_YY,SCH_EMP_NO,SCH_EMP_NM,SCH_CTRCT_PROG_STAT_CD,SCH_ANRY_CTRCT_FG_CD,SCH_WORK_DGCNT
  test.skip('[no:1] 일반직연봉계약등록관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3240/setData.do | inputCols=-
  test.skip('[no:2] 일반직연봉계약등록관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm3240/getSrls.do | inputCols=SCH_FRM_STDR_YY,SCH_TO_STDR_YY,SCH_EMP_NO,SCH_EMP_NM,SCH_CTRCT_PROG_STAT_CD,SCH_ANRY_CTRCT_FG_CD,SCH_WORK_DGCNT
  test.skip('[no:3] 일반직연봉계약등록관리 - 조회 (getSrls) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm3240/getInfoDtl.do | inputCols=SCH_FRM_STDR_YY,SCH_TO_STDR_YY,SCH_EMP_NO,SCH_EMP_NM,SCH_CTRCT_PROG_STAT_CD,SCH_ANRY_CTRCT_FG_CD,SCH_WORK_DGCNT
  test.skip('[no:4] 일반직연봉계약등록관리 - 조회 (getInfoDtl) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계약직연봉계약등록관리 (hrm_3250m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3250m' OR MNU_NM LIKE '계약직연봉계약등록관리%'
  const MENU_ID = 'TODO_hrm_3250m';
  const API_URL = '/mis/hrm/hrm3250/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_STDR_YY', 'SCH_TO_STDR_YY', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_CTRCT_PROG_STAT_CD', 'SCH_ANRY_CTRCT_FG_CD', 'SCH_WORK_DGCNT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3250/getList.do | inputCols=SCH_FRM_STDR_YY,SCH_TO_STDR_YY,SCH_EMP_NO,SCH_EMP_NM,SCH_CTRCT_PROG_STAT_CD,SCH_ANRY_CTRCT_FG_CD,SCH_WORK_DGCNT
  test.skip('[no:1] 계약직연봉계약등록관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3250/setData.do | inputCols=-
  test.skip('[no:2] 계약직연봉계약등록관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm3250/getDtData.do | inputCols=SCH_FRM_STDR_YY,SCH_TO_STDR_YY,SCH_EMP_NO,SCH_EMP_NM,SCH_CTRCT_PROG_STAT_CD,SCH_ANRY_CTRCT_FG_CD,SCH_WORK_DGCNT
  test.skip('[no:3] 계약직연봉계약등록관리 - 조회 (getDtData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계약직등급현황 (hrm_3260m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3260m' OR MNU_NM LIKE '계약직등급현황%'
  const MENU_ID = 'TODO_hrm_3260m';
  const API_URL = '/mis/hrm/hrm3260/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_ANRY_CTRCT_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3260/getList.do | inputCols=SCH_STDR_YY,SCH_EMP_NO,SCH_EMP_NM,SCH_ANRY_CTRCT_FG_CD
  test.skip('[no:1] 계약직등급현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3260/setData.do | inputCols=-
  test.skip('[no:2] 계약직등급현황 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연봉계약통보관리 (hrm_3270m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3270m' OR MNU_NM LIKE '연봉계약통보관리%'
  const MENU_ID = 'TODO_hrm_3270m';
  const API_URL = '/mis/hrm/hrm3270/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_ANRY_CTRCT_FG_CD', 'SCH_CTRCT_PROG_STAT_CD', 'SCH_WORK_DGCNT', 'SIGN_STAT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3270/getList.do | inputCols=SCH_STDR_YY,SCH_EMP_NO,SCH_EMP_NM,SCH_ANRY_CTRCT_FG_CD,SCH_CTRCT_PROG_STAT_CD,SCH_WORK_DGCNT,SIGN_STAT_NM
  test.skip('[no:1] 연봉계약통보관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3270/setData.do | inputCols=-
  test.skip('[no:2] 연봉계약통보관리 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연봉계약당월마감 (hrm_3280m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3280m' OR MNU_NM LIKE '연봉계약당월마감%'
  const MENU_ID = 'TODO_hrm_3280m';
  const API_URL = '/mis/hrm/hrm3280/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3280/getList.do | inputCols=SCH_STDR_YY
  test.skip('[no:1] 연봉계약당월마감 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3280/setData.do | inputCols=-
  test.skip('[no:2] 연봉계약당월마감 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연봉계약현황 (hrm_3290m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3290m' OR MNU_NM LIKE '연봉계약현황%'
  const MENU_ID = 'TODO_hrm_3290m';
  const API_URL = '/mis/hrm/hrm3290/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_EMPO_STLF_CD', 'SCH_ANRY_CTRCT_FG_CD', 'SCH_WORK_DGCNT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3290/getList.do | inputCols=SCH_STDR_YY,SCH_EMP_NO,SCH_EMP_NM,SCH_EMPO_STLF_CD,SCH_ANRY_CTRCT_FG_CD,SCH_WORK_DGCNT
  test.skip('[no:1] 연봉계약현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연봉계약서확인 (hrm_3300m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3300m' OR MNU_NM LIKE '연봉계약서확인%'
  const MENU_ID = 'TODO_hrm_3300m';
  const API_URL = '/mis/hrm/hrm3300/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_ANRY_CTRCT_FG_CD', 'SCH_WORK_DGCNT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm3300/getList.do | inputCols=SCH_EMP_NO,SCH_EMP_NM,SCH_ANRY_CTRCT_FG_CD,SCH_WORK_DGCNT
  test.skip('[no:1] 연봉계약서확인 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm3300/setData.do | inputCols=-
  test.skip('[no:2] 연봉계약서확인 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm3300/getSignYn.do | inputCols=SCH_EMP_NO,SCH_EMP_NM,SCH_ANRY_CTRCT_FG_CD,SCH_WORK_DGCNT
  test.skip('[no:3] 연봉계약서확인 - 조회 (signYn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인사자료조회 (hrm_4010m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4010m' OR MNU_NM LIKE '인사자료조회%'
  const MENU_ID = 'TODO_hrm_4010m';
  const API_URL = '/mis/hrm/hrm4010/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_DT', 'SCH_HLDF_FG_CD', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMPO_STLF_CD', 'SCH_GRD_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm4010/getData.do | inputCols=SCH_STDR_DT,SCH_HLDF_FG_CD,SCH_EMP_NO,SCH_EMP_NM,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMPO_STLF_CD,SCH_GRD_CD
  test.skip('[no:1] 인사자료조회 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부서별인원현황 (hrm_4020m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4020m' OR MNU_NM LIKE '부서별인원현황%'
  const MENU_ID = 'TODO_hrm_4020m';
  const API_URL = '/mis/hrm/hrm4020/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm4020/getList.do | inputCols=STDR_DT
  test.skip('[no:1] 부서별인원현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부서별직원현황 (hrm_4030m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4030m' OR MNU_NM LIKE '부서별직원현황%'
  const MENU_ID = 'TODO_hrm_4030m';
  const API_URL = '/mis/hrm/hrm4030/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm4030/getList.do | inputCols=STDR_DT
  test.skip('[no:1] 부서별직원현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직자현황 (hrm_4050m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4050m' OR MNU_NM LIKE '퇴직자현황%'
  const MENU_ID = 'TODO_hrm_4050m';
  const API_URL = '/mis/hrm/hrm4050/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_DT', 'SCH_TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm4050/getData.do | inputCols=SCH_FRM_DT,SCH_TO_DT
  test.skip('[no:1] 퇴직자현황 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부서별남녀현황 (hrm_4070m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4070m' OR MNU_NM LIKE '부서별남녀현황%'
  const MENU_ID = 'TODO_hrm_4070m';
  const API_URL = '/mis/hrm/hrm4070/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STD_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm4070/getList.do | inputCols=SCH_STD_DT
  test.skip('[no:1] 부서별남녀현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부서별연령현황 (hrm_4090m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4090m' OR MNU_NM LIKE '부서별연령현황%'
  const MENU_ID = 'TODO_hrm_4090m';
  const API_URL = '/mis/hrm/hrm4090/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STD_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm4090/getList.do | inputCols=SCH_STD_DT
  test.skip('[no:1] 부서별연령현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('신규자현황 (hrm_4100m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4100m' OR MNU_NM LIKE '신규자현황%'
  const MENU_ID = 'TODO_hrm_4100m';
  const API_URL = '/mis/hrm/hrm4100/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_FRM_DT', 'SCH_TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm4100/getData.do | inputCols=SCH_FRM_DT,SCH_TO_DT
  test.skip('[no:1] 신규자현황 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('파견/휴직현황 (hrm_4120m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4120m' OR MNU_NM LIKE '파견/휴직현황%'
  const MENU_ID = 'TODO_hrm_4120m';
  const API_URL = '/mis/hrm/hrm4120/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_FRM_DT', 'STDR_TO_DT', 'CLS'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm4120/getList.do | inputCols=STDR_FRM_DT,STDR_TO_DT,CLS
  test.skip('[no:1] 파견/휴직현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('직종/직급별인원통계 (hrm_4210m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4210m' OR MNU_NM LIKE '직종/직급별인원통계%'
  const MENU_ID = 'TODO_hrm_4210m';
  const API_URL = '/mis/hrm/hrm4210/getListNmpr.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['STDR_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm4210/getListNmpr.do | inputCols=STDR_DT
  test.skip('[no:1] 직종/직급별인원통계 - 조회 (getListNmpr) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm4210/getListAccr.do | inputCols=STDR_DT
  test.skip('[no:2] 직종/직급별인원통계 - 조회 (getListAccr) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('제증명신청 목록 (hrm_5010m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_5010m' OR MNU_NM LIKE '제증명신청 목록%'
  const MENU_ID = 'TODO_hrm_5010m';
  const API_URL = '/mis/hrm/hrm5010/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_NO', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_CRTF_TGPN_EMP_NO', 'SCH_CRTF_TGPN_EMP_NM', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_CRTF_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/hrm/hrm5010/setPrintData.do | inputCols=-
  test.skip('[no:1] 제증명신청 목록 - 저장 (setPrintData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm5010/getList.do | inputCols=RQST_NO,SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_CRTF_TGPN_EMP_NO,SCH_CRTF_TGPN_EMP_NM,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_CRTF_FG
  test.skip('[no:2] 제증명신청 목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('제증명신청 상세 (hrm_5011m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_5011m' OR MNU_NM LIKE '제증명신청 상세%'
  const MENU_ID = 'TODO_hrm_5011m';
  const API_URL = '/mis/hrm/hrm5011/getAppntHisList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [INSERT] URL=/mis/hrm/hrm5011/setPrintData.do | inputCols=-
  test.skip('[no:1] 제증명신청 상세 - 저장 (setPrintData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm5011/getAppntHisList.do | inputCols=-
  test.skip('[no:2] 제증명신청 상세 - 조회 (getDegHisList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm5011/setChagWork.do | inputCols=-
  test.skip('[no:3] 제증명신청 상세 - 저장 (setChagWork) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm5011/delData.do | inputCols=-
  test.skip('[no:4] 제증명신청 상세 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm5011/setData.do | inputCols=-
  test.skip('[no:5] 제증명신청 상세 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm5011/getDegHisList.do | inputCols=-
  test.skip('[no:6] 제증명신청 상세 - 조회 (getDegHisList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm5011/getData.do | inputCols=-
  test.skip('[no:7] 제증명신청 상세 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm5011/getAddrData.do | inputCols=-
  test.skip('[no:8] 제증명신청 상세 - 조회 (getAddrData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('제증명승인관리 (hrm_5020m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_5020m' OR MNU_NM LIKE '제증명승인관리%'
  const MENU_ID = 'TODO_hrm_5020m';
  const API_URL = '/mis/hrm/hrm5020/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['RQST_NO', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_CRTF_TGPN_EMP_NO', 'SCH_CRTF_TGPN_EMP_NM', 'SCH_APNT_EMP_NO', 'SCH_APNT_EMP_NM', 'SCH_CRTF_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [UPDATE] URL=/mis/hrm/hrm5020/setResetCnt.do | inputCols=-
  test.skip('[no:1] 제증명승인관리 - 수정 (setResetCnt) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm5020/setPrintDataAdmin.do | inputCols=-
  test.skip('[no:2] 제증명승인관리 - 저장 (setPrintDataAdmin) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm5020/setApprov.do | inputCols=-
  test.skip('[no:3] 제증명승인관리 - 수정 (setApprov) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [UPDATE] URL=/mis/hrm/hrm5020/setReject.do | inputCols=-
  test.skip('[no:4] 제증명승인관리 - 수정 (setReject) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm5020/getList.do | inputCols=RQST_NO,SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_CRTF_TGPN_EMP_NO,SCH_CRTF_TGPN_EMP_NM,SCH_APNT_EMP_NO,SCH_APNT_EMP_NM,SCH_CRTF_FG
  test.skip('[no:5] 제증명승인관리 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육목표시간관리 (hrm_9010m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9010m' OR MNU_NM LIKE '교육목표시간관리%'
  const MENU_ID = 'TODO_hrm_9010m';
  const API_URL = '/mis/hrm/hrm9010/getEduTgpnMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_GRD_CD', 'SCH_WORK_DGCNT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm9010/getEduTgpnMngList.do | inputCols=SCH_STDR_YY,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_GRD_CD,SCH_WORK_DGCNT
  test.skip('[no:1] 교육목표시간관리 - 조회 (getEduTgpnMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm9010/setEduTgpnMngList.do | inputCols=-
  test.skip('[no:2] 교육목표시간관리 - 저장 (setEduTgpnMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm9010/uploadExcelData.do | inputCols=-
  test.skip('[no:3] 교육목표시간관리 - 저장 (uploadExcelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm9010/setEduTgpn.do | inputCols=-
  test.skip('[no:4] 교육목표시간관리 - 저장 (setEduTgpn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육계획등록 (hrm_9020m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9020m' OR MNU_NM LIKE '교육계획등록%'
  const MENU_ID = 'TODO_hrm_9020m';
  const API_URL = '/mis/hrm/hrm9020/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_YY', 'SCH_EDU_LCLA_CD', 'SCH_EDU_MIDC_CD', 'SCH_EDU_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm9020/getList.do | inputCols=SCH_YY,SCH_EDU_LCLA_CD,SCH_EDU_MIDC_CD,SCH_EDU_NM
  test.skip('[no:1] 교육계획등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm9020/getDtlData.do | inputCols=SCH_YY,SCH_EDU_LCLA_CD,SCH_EDU_MIDC_CD,SCH_EDU_NM
  test.skip('[no:2] 교육계획등록 - 조회 (getDtlData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm9020/setData.do | inputCols=-
  test.skip('[no:3] 교육계획등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm9020/delData.do | inputCols=-
  test.skip('[no:4] 교육계획등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육대상자관리 (hrm_9030m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9030m' OR MNU_NM LIKE '교육대상자관리%'
  const MENU_ID = 'TODO_hrm_9030m';
  const API_URL = '/mis/hrm/hrm9010/getEduTgpnMngList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_STDR_YY', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_GRD_CD', 'SCH_WORK_DGCNT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm9010/getEduTgpnMngList.do | inputCols=SCH_STDR_YY,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_GRD_CD,SCH_WORK_DGCNT
  test.skip('[no:1] 교육대상자관리 - 조회 (getEduTgpnMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm9010/setEduTgpnMngList.do | inputCols=-
  test.skip('[no:2] 교육대상자관리 - 저장 (setEduTgpnMngList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm9010/uploadExcelData.do | inputCols=-
  test.skip('[no:3] 교육대상자관리 - 저장 (uploadExcelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm9010/setEduTgpn.do | inputCols=-
  test.skip('[no:4] 교육대상자관리 - 저장 (setEduTgpn) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육신청(개인)목록 (hrm_9110m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9110m' OR MNU_NM LIKE '교육신청(개인)목록%'
  const MENU_ID = 'TODO_hrm_9110m';
  const API_URL = '/mis/hrm/hrm9110/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'DEPT_CD', 'DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'APV_STAT_CD', 'RQST_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm9110/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,DEPT_CD,DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,APV_STAT_CD,RQST_FG
  test.skip('[no:1] 교육신청(개인)목록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육신청(개인) (hrm_9111m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9111m' OR MNU_NM LIKE '교육신청(개인)%'
  const MENU_ID = 'TODO_hrm_9111m';
  const API_URL = '/mis/hrm/hrm9111/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm9111/getData.do | inputCols=-
  test.skip('[no:1] 교육신청(개인) - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [SELECT] URL=/mis/hrm/hrm9111/getPrvData.do | inputCols=-
  test.skip('[no:2] 교육신청(개인) - 조회 (getPrvData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm9111/setData.do | inputCols=-
  test.skip('[no:3] 교육신청(개인) - 저장 (setAppData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm9111/setData.do | inputCols=-
  test.skip('[no:4] 교육신청(개인) - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm9111/delData.do | inputCols=-
  test.skip('[no:5] 교육신청(개인) - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육신청담당자등록 (hrm_9120m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9120m' OR MNU_NM LIKE '교육신청담당자등록%'
  const MENU_ID = 'TODO_hrm_9120m';
  const API_URL = '/mis/hrm/hrm9120/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EDU_YY', 'SCH_EDU_LCLA_CD', 'SCH_EDU_MIDC_CD', 'SCH_EDU_NM', 'SCH_DEPT_CD', 'SCH_DEPT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm9120/getList.do | inputCols=SCH_EDU_YY,SCH_EDU_LCLA_CD,SCH_EDU_MIDC_CD,SCH_EDU_NM,SCH_DEPT_CD,SCH_DEPT_NM
  test.skip('[no:1] 교육신청담당자등록 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육신청담당자등록 (hrm_9121m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9121m' OR MNU_NM LIKE '교육신청담당자등록%'
  const MENU_ID = 'TODO_hrm_9121m';
  const API_URL = '/mis/hrm/hrm9121/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm9121/getData.do | inputCols=-
  test.skip('[no:1] 교육신청담당자등록 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm9121/setData.do | inputCols=-
  test.skip('[no:2] 교육신청담당자등록 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [DELETE] URL=/mis/hrm/hrm9121/delData.do | inputCols=-
  test.skip('[no:3] 교육신청담당자등록 - 삭제 (delData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm9121/setExcelData.do | inputCols=-
  test.skip('[no:4] 교육신청담당자등록 - 저장 (setExcelData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육결과보고 (hrm_9130m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9130m' OR MNU_NM LIKE '교육결과보고%'
  const MENU_ID = 'TODO_hrm_9130m';
  const API_URL = '/mis/hrm/hrm9130/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_EDU_CMP_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm9130/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_EDU_CMP_FG_CD
  test.skip('[no:1] 교육결과보고 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육결과보고 (hrm_9131m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9131m' OR MNU_NM LIKE '교육결과보고%'
  const MENU_ID = 'TODO_hrm_9131m';
  const API_URL = '/mis/hrm/hrm9131/getData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm9131/getData.do | inputCols=-
  test.skip('[no:1] 교육결과보고 - 조회 (getData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm9131/setData.do | inputCols=-
  test.skip('[no:2] 교육결과보고 - 저장 (setData) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  // [INSERT] URL=/mis/hrm/hrm9131/setEduCmpFgCd.do | inputCols=-
  test.skip('[no:3] 교육결과보고 - 저장 (setEduCmpFgCd) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육이수승인 (hrm_9140m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9140m' OR MNU_NM LIKE '교육이수승인%'
  const MENU_ID = 'TODO_hrm_9140m';
  const API_URL = '/mis/hrm/hrm9140/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_EDU_CMP_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm9140/getList.do | inputCols=SCH_RQST_FRM_DT,SCH_RQST_TO_DT,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_EDU_CMP_FG_CD
  test.skip('[no:1] 교육이수승인 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육이수현황 (hrm_9210m) — 단위 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9210m' OR MNU_NM LIKE '교육이수현황%'
  const MENU_ID = 'TODO_hrm_9210m';
  const API_URL = '/mis/hrm/hrm9210/getList.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = ['SCH_EDU_YY', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_EMP_NO', 'SCH_EMP_NM', 'SCH_HLDF_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // [SELECT] URL=/mis/hrm/hrm9210/getList.do | inputCols=SCH_EDU_YY,SCH_DEPT_CD,SCH_DEPT_NM,SCH_EMP_NO,SCH_EMP_NM,SCH_HLDF_FG_CD
  test.skip('[no:1] 교육이수현황 - 조회 (getList) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 navigateTo/search 헬퍼 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});
