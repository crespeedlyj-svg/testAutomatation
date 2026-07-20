// ==============================================================
// HRM 모듈 배치 통합 테스트 — 생성일 2026-06-25
// 98개 화면 중 hrm_0130m(기존 파일 커버) 제외 → 97개 화면
// 모든 화면 menuId 미확인(TODO) → test.skip 으로 생성
// menuId 확정 후 각 describe 블록 활성화 필요
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import {
  openMenuById,
  waitForNexacroAppReady,
  setNexacroComponentValue,
  clearNexacroDataset,
  getNexacroDatasetRows,
  waitForNexacroDataset,
} from '../utils/nexacro-helper';

const SCREENSHOT_DIR = 'test-results/screenshots';
const SLOW = 1500;

test.describe('부서조직관리 (hrm_0110m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_0110m' OR MNU_NM LIKE '부서조직관리%'
  const MENU_ID = 'TODO_hrm_0110m';
  const API_URL = '/mis/hrm/hrm0110/getOrgRginList.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부서조직변경이력관리 (hrm_0120m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_0120m' OR MNU_NM LIKE '부서조직변경이력관리%'
  const MENU_ID = 'TODO_hrm_0120m';
  const API_URL = '/mis/hrm/hrm0120/getList.do';
  const RESULT_COLS = ['ORG_RGIN_DT', 'SNO', 'ORG_CHG_FG_CD', 'PRV_DEPT_CD', 'PRV_DEPT_NM', 'NOW_DEPT_CD', 'NOW_DEPT_NM', 'RMK'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('정원관리 (hrm_0215m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_0215m' OR MNU_NM LIKE '정원관리%'
  const MENU_ID = 'TODO_hrm_0215m';
  const API_URL = '/mis/hrm/hrm0215/getData.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('직급별정/현원표 (hrm_0225m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_0225m' OR MNU_NM LIKE '직급별정/현원표%'
  const MENU_ID = 'TODO_hrm_0225m';
  const API_URL = '/mis/hrm/hrm0225/getGrdData.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('직종별정/현원표 (hrm_0226m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_0226m' OR MNU_NM LIKE '직종별정/현원표%'
  const MENU_ID = 'TODO_hrm_0226m';
  const API_URL = '/mis/hrm/hrm0225/getJsfcData.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('학교코드등록 (hrm_1010m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_1010m' OR MNU_NM LIKE '학교코드등록%'
  const MENU_ID = 'TODO_hrm_1010m';
  const API_URL = '/mis/hrm/hrm1010/getData.do';
  const RESULT_COLS = ['IOCT_FG_CD', 'SCHL_FG_CD', 'SCHL_CD', 'SCHL_NM', 'BRANCH_FG_CD', 'SCHL_SYS_FG_CD', 'AREA_FG_CD', 'POST_NO', 'ADDR'];
  const CLEAR_COLS = ['SCH_IOCT_FG_CD', 'SCH_SCHL_CD', 'SCH_SCHL_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 국내외구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 학교코드 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 학교명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용경력평정기준관리 (hrm_1020m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_1020m' OR MNU_NM LIKE '채용경력평정기준관리%'
  const MENU_ID = 'TODO_hrm_1020m';
  const API_URL = '/mis/hrm/hrm1020/getData.do';
  const RESULT_COLS = ['DGR_FG', 'EMPO_STLF_CD', 'CMPN_CER_CONV_MM', 'GDUTN_CER_CONV_MM'];
  const CLEAR_COLS = ['SCH_DGR_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 학위구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('발령코드관리 (hrm_2010m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2010m' OR MNU_NM LIKE '발령코드관리%'
  const MENU_ID = 'TODO_hrm_2010m';
  const API_URL = '/mis/hrm/hrm2010/getUppAppntCdList.do';
  const RESULT_COLS = ['PK_APPNT_CD', 'APPNT_CD', 'HRM_APPNT_NM', 'UPP_APPNT_CD', 'APPNT_FG', 'USE_YN', 'SORT_NO', 'CHK_DE'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('발령호수관리 (hrm_2020m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2020m' OR MNU_NM LIKE '발령호수관리%'
  const MENU_ID = 'TODO_hrm_2020m';
  const API_URL = '/mis/hrm/hrm2020/getData.do';
  const RESULT_COLS = ['APPNT_REGT_MNG_NO', 'APPNT_REGT_CLS', 'APPNT_DOC_NO', 'APPNT_DT', 'APPNT_CONT', 'APPNT_OPTR_EMP_NO', 'APPNT_OPTR_EMP_NM', 'APPNT_OPTR_WORK_DGCNT', 'APPNT_PROC_OPET_DE', 'RMK'];
  const CLEAR_COLS = ['SCH_YY', 'SCH_APPNT_CONT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 발령년도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 발령내용 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인사발령관리 (hrm_2030m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2030m' OR MNU_NM LIKE '인사발령관리%'
  const MENU_ID = 'TODO_hrm_2030m';
  const API_URL = '/mis/hrm/hrm2030/getCodeAppnt.do';
  const RESULT_COLS = ['APPNT_MNG_NO', 'APPNT_REGT_MNG_NO', 'EMP_NO', 'EMP_NM', 'WORK_DGCNT', 'UPP_APPNT_CD', 'APPNT_CD', 'HRM_APPNT_NM', 'APPNT_DT', 'SNO', 'CTS_APPNT_YN', 'APPNT_TO_DT', 'HLDF_FG_CD', 'DEPT_CD', 'DEPT_NM', 'EMPO_STLF_CD', 'JSFC_CD', 'GRD_CD', 'FLOC_CD', 'WORK_AREA', 'DPPL', 'PRV_APPNT_MNG_NO', 'PRV_APPNT_INFO', 'RSN', 'CONT', 'RMK'];
  const CLEAR_COLS = ['SCH_APPNT_DOC_NO', 'SCH_EMP_NM', 'SCH_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 발령호수 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 대상자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 대상자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인사발령현황 (hrm_2040m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2040m' OR MNU_NM LIKE '인사발령현황%'
  const MENU_ID = 'TODO_hrm_2040m';
  const API_URL = '/mis/hrm/hrm2040/getCodeAppnt.do';
  const RESULT_COLS = ['APPNT_MNG_NO', 'APPNT_REGT_MNG_NO', 'EMP_NO', 'EMP_NM', 'WORK_DGCNT', 'ENT_DT', 'APPNT_DT', 'SNO', 'APPNT_TO_DT', 'UPP_APPNT_CD', 'UPP_HRM_APPNT_NM', 'APPNT_CD', 'HRM_APPNT_NM', 'HLDF_FG_CD', 'HLDF_FG_NM', 'DEPT_CD', 'DEPT_NM', 'JSFC_CD', 'JSFC_NM', 'GRD_CD', 'GRD_NM', 'FLOC_CD', 'FLOC_NM', 'WORK_AREA', 'WORK_AREA_NM', 'DPPL', 'CONT', 'APPNT_DOC_NO', 'APPNT_CONT'];
  const CLEAR_COLS = ['SCH_FRM_DT', 'SCH_TO_DT', 'SCH_UPP_APPNT_CD', 'SCH_APPNT_CD', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_APPNT_CONT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 발령기간 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 발령종류 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 발령종류 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 발령내용 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('조직개편일괄발령관리 (hrm_2050m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2050m' OR MNU_NM LIKE '조직개편일괄발령관리%'
  const MENU_ID = 'TODO_hrm_2050m';
  const API_URL = '/mis/hrm/hrm2050/getList.do';
  const RESULT_COLS = ['APPNT_STDR_DT', 'DISP_NM', 'EMP_NO', 'EMP_NM', 'TO_DEPT_CD', 'TO_DEPT_NM', 'TO_FLOC_CD', 'TO_GRD_CD', 'FLOC_CD_SORT_NO', 'GRD_CD_SORT_NO', 'FR_DEPT_CD', 'FR_DEPT_NM', 'FR_FLOC_CD', 'FR_GRD_CD', 'CLS', 'SORT_NO', 'LVL', 'DEPT_APPNT_YN', 'FLOC_CD_APPNT_YN', 'GRD_CD_APPNT_YN', 'APPNT_APLY_YN'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용충원요구신청 (hrm_2100m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2100m' OR MNU_NM LIKE '채용충원요구신청%'
  const MENU_ID = 'TODO_hrm_2100m';
  const API_URL = '/mis/hrm/hrm2100/getData.do';
  const RESULT_COLS = ['APV_STAT_CD', 'APV_STAT_NM', 'GW_DOC_ID', 'IMG', 'SULP_RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'EMYT_YY', 'EMYT_DGCNT', 'RQST_DEPT_CD', 'RQST_DEPT_NM', 'SULP_FG', 'RQST_NMPR'];
  const CLEAR_COLS = ['SCH_DEPT_NM', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_APV_STAT_CD', 'SCH_EMYT_YY', 'SCH_EMYT_DGCNT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 충원신청부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 신청일자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 결재상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 충원차수 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] - 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:10] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용충원요구신청 (hrm_2101m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2101m' OR MNU_NM LIKE '채용충원요구신청%'
  const MENU_ID = 'TODO_hrm_2101m';
  const API_URL = '/mis/hrm/hrm2101/getData.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용차수관리 (hrm_2105m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2105m' OR MNU_NM LIKE '채용차수관리%'
  const MENU_ID = 'TODO_hrm_2105m';
  const API_URL = '/mis/hrm/hrm2105/getData.do';
  const RESULT_COLS = ['EMYT_YY', 'EMYT_DGCNT', 'EMPO_STLF_CD', 'RQST_FRM_DT', 'RQST_TO_DT', 'RMK'];
  const CLEAR_COLS = ['SCH_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 채용년도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용심사단계관리 (hrm_2110m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2110m' OR MNU_NM LIKE '채용심사단계관리%'
  const MENU_ID = 'TODO_hrm_2110m';
  const API_URL = '/mis/hrm/hrm2110/getList.do';
  const RESULT_COLS = ['EMYT_CRS_MNG_NO', 'SORT_SEQ', 'JUDG_STEP_DGCNT', 'JUDG_STEP_MTHD', 'JUDG_TRGT_DGCNT', 'JUDG_TRGT_MTHD', 'JUDG_RST', 'JUDG_STEP_NM'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용계획관리 (hrm_2120m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2120m' OR MNU_NM LIKE '채용계획관리%'
  const MENU_ID = 'TODO_hrm_2120m';
  const API_URL = '/mis/hrm/hrm2120/getData.do';
  const RESULT_COLS = ['ANNC_STAT_FG', 'EMYT_ANNC_MNG_NO', 'EMYT_FG', 'EMPO_STLF_CD', 'WRT_DT', 'RCPT_FRM_DT', 'RCPT_TO_DT', 'ANNC_SBJ'];
  const CLEAR_COLS = ['SCH_ANNC_YY', 'SCH_EMPO_STLF_CD', 'SCH_EMYT_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 공고연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 모집구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 채용구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용계획관리 (hrm_2121m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2121m' OR MNU_NM LIKE '채용계획관리%'
  const MENU_ID = 'TODO_hrm_2121m';
  const API_URL = '/mis/hrm/hrm2110/getCodeCrs.do';
  const RESULT_COLS = ['EMYT_ANNC_MNG_NO', 'EMYT_ANNC_RALM_CD', 'EMYT_CRS_MNG_NO', 'EMPO_STLF_CD', 'JSFC_CD', 'DTY_CD', 'DGR_FG', 'EMYT_NMPR', 'EMYT_RALM_NM'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('응시자정보관리 (hrm_2130m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2130m' OR MNU_NM LIKE '응시자정보관리%'
  const MENU_ID = 'TODO_hrm_2130m';
  const API_URL = '/mis/hrm/hrm2130/getCodeRalm.do';
  const RESULT_COLS = ['EMYT_ANNC_MNG_NO', 'EMYT_ANNC_RALM_CD', 'EMYT_APPT_NO', 'EMYT_APPT_NM', 'EMYT_APPT_MAIL', 'EMYT_APPT_CTTPC', 'ACCR_FG', 'DSSN_YN', 'CMMLD_YN', 'REQT_YN', 'CHK_EXISTS', 'LAST_JUDG_STEP_DGCNT'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('심사결과관리 (hrm_2140m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2140m' OR MNU_NM LIKE '심사결과관리%'
  const MENU_ID = 'TODO_hrm_2140m';
  const API_URL = '/mis/hrm/hrm2130/getCodeRalm.do';
  const RESULT_COLS = ['EMYT_ANNC_MNG_NO', 'EMYT_ANNC_RALM_CD', 'EMYT_APPT_NO', 'EMYT_APPT_NM', 'JUDG_STEP_DGCNT', 'JUDG_RST', 'JUDG_SCR', 'RMK', 'CHK_EXISTS', 'CHK_NEXT'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용면접비전자서명 (hrm_2145m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2145m' OR MNU_NM LIKE '채용면접비전자서명%'
  const MENU_ID = 'TODO_hrm_2145m';
  const API_URL = '/mis/hrm/hrm2130/getCodeRalm.do';
  const RESULT_COLS = ['SIGN_STAT', 'SIGN_DOC_ID', 'PUBCT_DE', 'EMYT_ANNC_MNG_NO', 'EMYT_ANNC_RALM_CD', 'EMYT_APPT_NO', 'EMYT_APPT_NM', 'JUDG_STEP_DGCNT', 'EMYT_APPT_MAIL', 'EMYT_APPT_CTTPC'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용면접비지출발의 (hrm_2150m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2150m' OR MNU_NM LIKE '채용면접비지출발의%'
  const MENU_ID = 'TODO_hrm_2150m';
  const API_URL = '/mis/hrm/hrm2150/getData.do';
  const RESULT_COLS = ['APV_STAT_CD', 'RQST_NO', 'GW_DOC_ID', 'IMG', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'APNT_GRD_NM', 'EMYT_ANNC_MNG_NO', 'ANNC_SBJ', 'RQST_AMT', 'RESL_NO'];
  const CLEAR_COLS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_APV_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 신청일자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 결재상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용면접비지출발의 (hrm_2151m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2151m' OR MNU_NM LIKE '채용면접비지출발의%'
  const MENU_ID = 'TODO_hrm_2151m';
  const API_URL = '/mis/hrm/hrm2151/getData.do';
  const RESULT_COLS = ['RQST_NO', 'EMYT_APPT_NO', 'EMYT_APPT_NM', 'BK_CD', 'BK_NM', 'ACC_NO', 'DPSIT', 'ITVW_EXP', 'CHK_EXISTS'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('채용예정자관리 (hrm_2160m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2160m' OR MNU_NM LIKE '채용예정자관리%'
  const MENU_ID = 'TODO_hrm_2160m';
  const API_URL = '/mis/hrm/hrm2130/getCodeRalm.do';
  const RESULT_COLS = ['EMYT_ANNC_MNG_NO', 'EMYT_ANNC_RALM_CD', 'EMYT_APPT_NO', 'EMYT_APPT_NM', 'EMYT_CER_PEVL_MNG_NO', 'CER_PEVL_DCSN_YN', 'LAST_PAEP_YN', 'HRM_APPNT_YN', 'EMYT_YY'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('승진대상자관리 (hrm_2200m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2200m' OR MNU_NM LIKE '승진대상자관리%'
  const MENU_ID = 'TODO_hrm_2200m';
  const API_URL = '/mis/hrm/hrm2200/getList.do';
  const RESULT_COLS = ['STDR_YY', 'PRMT_GRD_CD', 'DEPT_UNIT_FG', 'UPP_DEPT_CD', 'UPP_DEPT_NM', 'DEPT_CD', 'DEPT_NM', 'EMP_NO', 'EMP_NM', 'ENT_DT', 'EMPO_STLF_CD', 'JSFC_CD', 'NOW_GRD_CD', 'FLOC_CD', 'NOW_GRADE', 'NOW_GRD_EMPL_DT', 'PRMT_CNCY_ETRY_YY', 'EVAL_RSLT_BY1', 'EVAL_RSLT_BY2', 'EVAL_RSLT_BY3', 'SUM_SCR', 'CONV_SCR', 'PRMT_JUDG_TRGT_YN', 'PRMT_JUDG_EXCLUS_RSN', 'PZDCR_STTU', 'DSP_STTU', 'RMK'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_GRD_CD', 'SCH_STDR_YY', 'SCH_DEPT_NM', 'SCH_DEPT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 승급직급 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('성과급지급계획관리 (hrm_2300m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2300m' OR MNU_NM LIKE '성과급지급계획관리%'
  const MENU_ID = 'TODO_hrm_2300m';
  const API_URL = '/mis/hrm/hrm2300/getLastData.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = ['SCH_PFBN_PLAN_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 지급계획번호 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('재정기여도관리 (hrm_2305m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2305m' OR MNU_NM LIKE '재정기여도관리%'
  const MENU_ID = 'TODO_hrm_2305m';
  const API_URL = '/mis/hrm/hrm2305/getData.do';
  const RESULT_COLS = ['STDR_YY', 'DEPT_NM', 'EMP_NO', 'EMP_NM', 'AC_RTO'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('근무제외일수산정관리 (hrm_2310m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2310m' OR MNU_NM LIKE '근무제외일수산정관리%'
  const MENU_ID = 'TODO_hrm_2310m';
  const API_URL = '/mis/hrm/hrm2310/getData.do';
  const RESULT_COLS = ['PFBN_PLAN_NO', 'EMP_NO', 'SEQ', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'WORK_EXCLUS_FG', 'EXCLUS_FRM_DT', 'EXCLUS_TO_DT', 'WORK_EXCLUS_DAYS', 'RMK', 'CHK_EXISTS'];
  const CLEAR_COLS = ['SCH_PFBN_PLAN_NO', 'SCH_DEPT_NM', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_WORK_EXCLUS_FG', 'SCH_DEPT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 지급계획번호 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 대상자부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 대상자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 대상자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 제외구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 대상자부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('성과급대상자관리 (hrm_2320m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2320m' OR MNU_NM LIKE '성과급대상자관리%'
  const MENU_ID = 'TODO_hrm_2320m';
  const API_URL = '/mis/hrm/hrm2320/getData.do';
  const RESULT_COLS = ['PFBN_PLAN_NO', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'PMT_TGPN_YN', 'EVAL_TGPN_YN', 'EMPO_STLF_CD', 'JSFC_CD', 'GRD_CD', 'FLOC_CD', 'ENT_DT', 'RSIGN_DT', 'STDR_WORK_DAYS', 'EVAL_GRADE_CD', 'AC_RTO', 'RMK'];
  const CLEAR_COLS = ['SCH_PFBN_PLAN_NO', 'SCH_DEPT_NM', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DEPT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 지급계획번호 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 대상자부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 대상자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 대상자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 대상자부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('성과급산정 (hrm_2330m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2330m' OR MNU_NM LIKE '성과급산정%'
  const MENU_ID = 'TODO_hrm_2330m';
  const API_URL = '/mis/hrm/hrm2330/getData.do';
  const RESULT_COLS = ['PFBN_PLAN_NO', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'EMPO_STLF_CD', 'JSFC_CD', 'GRD_CD', 'FLOC_CD', 'ROOF_NM', 'ENT_DT', 'RSIGN_DT', 'EVAL_GRADE_CD', 'AC_RTO', 'MM_SAL_AMT', 'JBLN_PMT_AMT', 'ROOF_WGV', 'EVAL_WGV', 'CONTRBN_WGV', 'STDR_WORK_DAYS', 'WORK_EXCLUS_DAYS', 'WORK_DAYS', 'WORK_RTO', 'FNRS_COMP_RTO', 'STDR_AMT', 'LAST_AMT', 'CHK_CHANGED', 'JBLN_BAS_AMT', 'LAST_JBLN_PMT_AMT', 'LAST_STDR_AMT', 'Column3', 'Column4', 'Column5', 'Column6', 'Column0'];
  const CLEAR_COLS = ['SCH_PFBN_PLAN_NO', 'SCH_DEPT_NM', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DEPT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 지급계획번호 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 대상자부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 대상자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 대상자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 대상자부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('성과급지급신청 (hrm_2340m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2340m' OR MNU_NM LIKE '성과급지급신청%'
  const MENU_ID = 'TODO_hrm_2340m';
  const API_URL = '/mis/hrm/hrm2340/getData.do';
  const RESULT_COLS = ['PFBN_PMT_RQST_NO', 'RQST_STAT_CD', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'PFBN_PLAN_NO', 'PFBN_YY', 'PFBN_FG', 'PFBN', 'PFBN_PLAN_SBJ', 'PAY_PMT_AMT', 'ACT_PMT_AMT'];
  const CLEAR_COLS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 신청기간 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 신청상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('성과급지급신청 (hrm_2341m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2341m' OR MNU_NM LIKE '성과급지급신청%'
  const MENU_ID = 'TODO_hrm_2341m';
  const API_URL = '/mis/hrm/hrm2341/getData.do';
  const RESULT_COLS = ['PFBN_PMT_RQST_NO', 'TGPN_EMP_NO', 'TGPN_EMP_NM', 'TGPN_DEPT_CD', 'TGPN_DEPT_NM', 'TGPN_GRD_CD', 'TGPN_GRD_NM', 'LAST_AMT', 'ENT_DT', 'RSIGN_DT', 'PAY_PMT_AMT', 'ACT_PMT_AMT'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('성과급지급승인관리 (hrm_2350m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2350m' OR MNU_NM LIKE '성과급지급승인관리%'
  const MENU_ID = 'TODO_hrm_2350m';
  const API_URL = '/mis/hrm/hrm2340/getData.do';
  const RESULT_COLS = ['PFBN_PMT_RQST_NO', 'RQST_STAT_CD', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'PFBN_PLAN_NO', 'PFBN_YY', 'PFBN_FG', 'PFBN', 'PFBN_PLAN_SBJ'];
  const CLEAR_COLS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 신청기간 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 신청상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('휴/복직신청서목록 (hrm_2400m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2400m' OR MNU_NM LIKE '휴/복직신청서목록%'
  const MENU_ID = 'TODO_hrm_2400m';
  const API_URL = '/mis/hrm/hrm2400/getList.do';
  const RESULT_COLS = ['RQST_NO', 'APV_STAT_CD', 'GW_DOC_ID', 'IMG', 'RQST_FG_CD', 'RQST_DT', 'LYOF_DSTC_FG_CD', 'LYOF_DSTC_DTL_FG_CD', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'LYOFP_DSTCP_EMP_NO', 'LYOFP_DSTCP_EMP_NM', 'LYOFP_DSTCP_DEPT_CD', 'LYOFP_DSTCP_DEPT_NM', 'VAUSP_EMP_NO', 'VAUSP_EMP_NM', 'VAUSP_DEPT_CD', 'VAUSP_DEPT_NM', 'LYOF_DSTC_TERM', 'REAT_DT', 'LYOF_DSTC_RSN', 'PRV_RQST_NO', 'CHG_RQST_YN'];
  const CLEAR_COLS = ['SCH_APNT_EMP_NM', 'SCH_APNT_EMP_NO', 'SCH_APNT_DEPT_NM', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APV_STAT_CD', 'SCH_LYOF_DSTC_DTL_FG_CD', 'SCH_LYOFP_DSTCP_EMP_NM', 'SCH_LYOFP_DSTCP_EMP_NO', 'SCH_LYOFP_DSTCP_DEPT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 신청자부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 신청기간 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 결재상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 휴직/파견상세구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 휴직/파견자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:10] 휴직/파견자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:11] 휴직/파견자부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:12] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('휴직/파견신청상세 (hrm_2401m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2401m' OR MNU_NM LIKE '휴직/파견신청상세%'
  const MENU_ID = 'TODO_hrm_2401m';
  const API_URL = '/mis/hrm/hrm2401/getPrvData.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직신청목록 (hrm_2410m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2410m' OR MNU_NM LIKE '퇴직신청목록%'
  const MENU_ID = 'TODO_hrm_2410m';
  const API_URL = '/mis/gen/gen0090/getList.do';
  const RESULT_COLS = ['RQST_NO', 'RQST_DT', 'RQST_EMP_NO', 'RQST_EMP_NM', 'RQST_DEPT_CD', 'RQST_DEPT_NM', 'APV_RQST_NO', 'RSIGN_EMP_NO', 'RSIGN_EMP_NM', 'RSIGN_DEPT_NM', 'DUTY_DEG', 'ENT_DT', 'RSIGN_DT', 'POST_NO', 'ADDR', 'ADDR_DTL', 'CELL_PON_NO', 'RSIGN_RSN', 'RMK', 'INS_DT', 'INS_ID', 'INS_IP', 'UPT_DT', 'UPT_ID', 'UPT_IP', 'ASSIN_NM', 'MGT_NO', 'APV_STAT_CD', 'GRD_CD', 'GRD_NM'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DEPT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직신청상세 (hrm_2411m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2411m' OR MNU_NM LIKE '퇴직신청상세%'
  const MENU_ID = 'TODO_hrm_2411m';
  const API_URL = '/mis/gen/gen0091/getEmpInfo.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자녀6세이하비과세신청목록 (hrm_2500m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2500m' OR MNU_NM LIKE '자녀6세이하비과세신청목록%'
  const MENU_ID = 'TODO_hrm_2500m';
  const API_URL = '/mis/hrm/hrm2500/getList.do';
  const RESULT_COLS = ['NTAX_RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'CONF_EMP_NO', 'CONF_EMP_NM', 'CONF_DEPT_CD', 'CONF_DEPT_NM', 'CONF_GRD_CD', 'ACCP_DT', 'RQST_STAT_CD', 'RUS_RSN', 'RQST_STAT_NM'];
  const CLEAR_COLS = ['SCH_DEPT_NM', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 신청부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 신청기간 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 신청부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 신청상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자녀6세이하비과세신청상세 (hrm_2501m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2501m' OR MNU_NM LIKE '자녀6세이하비과세신청상세%'
  const MENU_ID = 'TODO_hrm_2501m';
  const API_URL = '/mis/hrm/hrm2501/getPrvData.do';
  const RESULT_COLS = ['SEQ', 'NTAX_RQST_NO', 'CHILD_NM', 'BIRTH', 'RMK'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('자녀6세이하비과세승인관리 (hrm_2510m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2510m' OR MNU_NM LIKE '자녀6세이하비과세승인관리%'
  const MENU_ID = 'TODO_hrm_2510m';
  const API_URL = '/mis/hrm/hrm2510/getList.do';
  const RESULT_COLS = ['NTAX_RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'CONF_EMP_NO', 'CONF_EMP_NM', 'CONF_DEPT_CD', 'CONF_DEPT_NM', 'CONF_GRD_CD', 'ACCP_DT', 'RQST_STAT_CD', 'RUS_RSN', 'RQST_STAT_NM', 'CHILD_NM', 'BIRTH'];
  const CLEAR_COLS = ['SCH_DEPT_NM', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 신청부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 신청기간 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 신청부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 신청상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('차량보조비비과세신청목록 (hrm_2520m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2520m' OR MNU_NM LIKE '차량보조비비과세신청목록%'
  const MENU_ID = 'TODO_hrm_2520m';
  const API_URL = '/mis/hrm/hrm2520/getList.do';
  const RESULT_COLS = ['NTAX_RQST_NO', 'RQST_DT', 'APNT_DEPT_NM', 'APNT_DEPT_CD', 'APNT_EMP_NO', 'APNT_EMP_NM', 'RQST_STAT_CD', 'RQST_STAT_NM', 'CONF_EMP_NO', 'CONF_EMP_NM', 'ACCP_DT', 'RUS_RSN', 'EXPR_YN'];
  const CLEAR_COLS = ['SCH_DEPT_NM', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 신청부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 신청기간 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 신청부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 신청상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('차량보조비비과세신청상세 (hrm_2521m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2521m' OR MNU_NM LIKE '차량보조비비과세신청상세%'
  const MENU_ID = 'TODO_hrm_2521m';
  const API_URL = '/mis/hrm/hrm2521/getData.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('차량보조비비과세승인관리 (hrm_2530m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2530m' OR MNU_NM LIKE '차량보조비비과세승인관리%'
  const MENU_ID = 'TODO_hrm_2530m';
  const API_URL = '/mis/hrm/hrm2530/getList.do';
  const RESULT_COLS = ['NTAX_RQST_NO', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_WORK_DGCNT', 'APNT_GRD_CD', 'APNT_GER_NM', 'CONF_EMP_NO', 'CONF_EMP_NM', 'ACCP_DT', 'RQST_STAT_CD', 'RUS_RSN', 'RQST_STAT_NM', 'EXPR_YN'];
  const CLEAR_COLS = ['SCH_DEPT_NM', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_CD', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 신청부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 신청기간 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 신청부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 신청상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인사정보관리 (hrm_3010m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3010m' OR MNU_NM LIKE '인사정보관리%'
  const MENU_ID = 'TODO_hrm_3010m';
  const API_URL = '/mis/hrm/hrm3010/getList.do';
  const RESULT_COLS = ['EMP_NO', 'WORK_DGCNT', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'JSFC_CD', 'JSFC_NM'];
  const CLEAR_COLS = ['SCH_HLDF_FG_CD', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DEPT_NM', 'SCH_EMPO_STLF_CD', 'SCH_JSFC_CD', 'SCH_GRD_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 재직구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성  명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 성  명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 부  서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 고용형태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 직  종 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 직  급 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('노조가입관리 (hrm_3012m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3012m' OR MNU_NM LIKE '노조가입관리%'
  const MENU_ID = 'TODO_hrm_3012m';
  const API_URL = '/mis/hrm/hrm3012/getList.do';
  const RESULT_COLS = ['EMPO_STLF_CD', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'UPP_DEPT_CD', 'UPP_DEPT_NM', 'LBUN_FG', 'JOIN_DT', 'STOP_YN', 'SESN_YN', 'STOP_DT', 'SESN_DT', 'RSIGN_YN', 'RSIGN_DT'];
  const CLEAR_COLS = ['SCH_LBUN_FG', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DEPT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 노조구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성  명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 성  명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 부  서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('노동조합관리 (hrm_3015m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3015m' OR MNU_NM LIKE '노동조합관리%'
  const MENU_ID = 'TODO_hrm_3015m';
  const API_URL = '/mis/hrm/hrm3015/getList.do';
  const RESULT_COLS = ['LBUN_FG', 'SEQ', 'CHMN_NM', 'LBUN_BIZRNO', 'LOT_SUBL_EMP_NM', 'LOT_SUBL_EMP_NO', 'LOT_SUBL_FRM_DT', 'LOT_SUBL_TO_DT', 'OFCEL_EMP_NM', 'OFCEL_EMP_NO', 'OFCEL_FRM_DT', 'OFCEL_TO_DT', 'LBUN_ACC_NO', 'BK_CD', 'BK_NM', 'DPSIT'];
  const CLEAR_COLS = ['SCH_LBUN_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 노조구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('노조가입현황 (hrm_3016m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3016m' OR MNU_NM LIKE '노조가입현황%'
  const MENU_ID = 'TODO_hrm_3016m';
  const API_URL = '/mis/hrm/hrm3016/getList.do';
  const RESULT_COLS = ['EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'UPP_DEPT_CD', 'UPP_DEPT_NM', 'LBUN_FG', 'JOIN_DT', 'STOP_YN', 'SESN_YN'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개인인사정보 (hrm_3020m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3020m' OR MNU_NM LIKE '개인인사정보%'
  const MENU_ID = 'TODO_hrm_3020m';
  const API_URL = '/mis/hrm/hrm3010/getMain.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개인인사정보변경신청목록 (hrm_3030m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3030m' OR MNU_NM LIKE '개인인사정보변경신청목록%'
  const MENU_ID = 'TODO_hrm_3030m';
  const API_URL = '/mis/hrm/hrm3030/getData.do';
  const RESULT_COLS = ['RQST_NO', 'RQST_STAT_CD', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'HRM_RCED_CHG_TRGT_FG'];
  const CLEAR_COLS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_NM', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 신청기간 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 신청자부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 신청상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개인인사정보변경신청상세 (hrm_3031m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3031m' OR MNU_NM LIKE '개인인사정보변경신청상세%'
  const MENU_ID = 'TODO_hrm_3031m';
  const API_URL = '/mis/hrm/hrm3031/getMain.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개인인사정보변경승인관리목록 (hrm_3040m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3040m' OR MNU_NM LIKE '개인인사정보변경승인관리목록%'
  const MENU_ID = 'TODO_hrm_3040m';
  const API_URL = '/mis/hrm/hrm3040/getData.do';
  const RESULT_COLS = ['RQST_NO', 'RQST_STAT_CD', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'HRM_RCED_CHG_TRGT_FG'];
  const CLEAR_COLS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_NM', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_RQST_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 신청기간 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 신청자부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 신청상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개인인사정보변경승인관리상세 (hrm_3041m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3041m' OR MNU_NM LIKE '개인인사정보변경승인관리상세%'
  const MENU_ID = 'TODO_hrm_3041m';
  const API_URL = '/mis/hrm/hrm3041/getMain.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('근무평점일괄업로드 (hrm_3050m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3050m' OR MNU_NM LIKE '근무평점일괄업로드%'
  const MENU_ID = 'TODO_hrm_3050m';
  const API_URL = '/mis/hrm/hrm3050/getList.do';
  const RESULT_COLS = ['EMP_NO', 'EMP_NM', 'WORK_DGCNT', 'SNO', 'DEPT_CD', 'DEPT_NM', 'EVAL_YY', 'EVAL_RST', 'EVAL_RMK', 'GRD_CD', 'PK_EMP_NO', 'PK_WORK_DGCNT', 'PK_SNO'];
  const CLEAR_COLS = ['SCH_YY', 'SCH_EMP_NM', 'SCH_DEPT_NM', 'SCH_GRD_CD', 'SCH_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성  명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 부  서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 직  급 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 성  명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('고용계약관리(일반직) (hrm_3100m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3100m' OR MNU_NM LIKE '고용계약관리(일반직)%'
  const MENU_ID = 'TODO_hrm_3100m';
  const API_URL = '/mis/hrm/hrm3100/getList.do';
  const RESULT_COLS = ['APLY_YY', 'STDR_QU', 'CTRCT_YM', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'SEQ', 'GRD_CD', 'GRD_NM', 'CTRCT_WRT_DT', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'APPTP_EMP_NM', 'APPTP_EMP_NO', 'ORGAN_NM', 'EMPO_CTRCT_FG_CD', 'EMPO_CTRCT_FG_NM', 'BIRTH', 'AGE', 'EMPO_CNR_ADDR', 'RES_NO', 'WORK_DEPT_NM', 'EXC_JOB', 'EMPO_CTRCT_DSTH_YN', 'CTRCT_DSTH_DT', 'RMK', 'CTRCT_PROG_STAT_CD', 'CTRCT_PROG_STAT_NM', 'EMPO_STLF_NM', 'DOC_RQST_NO', 'WEEK_WORK_TIME', 'WORK_STLF_CD', 'WORK_TP_CD', 'EMPO_STLF_CD', 'SIGN_STAT_NM', 'SIGN_DOC_ID', 'IMG', 'SIGG_SBMT_CLOS_DT'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_GRD_CD', 'SCH_CTRCT_PROG_STAT_CD', 'SCH_STDR_FRM_YM', 'SCH_STDR_TO_YM', 'SCH_EMPO_CTRCT_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 직급구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 진행상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 기준연월 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 계약구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('고용계약관리(계약직) (hrm_3110m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3110m' OR MNU_NM LIKE '고용계약관리(계약직)%'
  const MENU_ID = 'TODO_hrm_3110m';
  const API_URL = '/mis/hrm/hrm3110/getList.do';
  const RESULT_COLS = ['WORK_DGCNT', 'APLY_YY', 'STDR_QU', 'CTRCT_YM', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'SEQ', 'JSFC_CD', 'FLOC_CD', 'GRD_CD', 'GRD_NM', 'CTRCT_WRT_DT', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'CTRCT_SIGG_DE', 'CTRCT_DCSN_DE', 'APPTP_EMP_NM', 'APPTP_EMP_NO', 'ORGAN_NM', 'EMPO_CTRCT_FG_CD', 'EMPO_CTRCT_FG_NM', 'BIRTH', 'AGE', 'EMPO_CNR_ADDR', 'RES_NO', 'WORK_DEPT_NM', 'EXC_JOB', 'EMPO_CTRCT_DSTH_YN', 'CTRCT_DSTH_DT', 'RMK', 'EMPO_STLF_CD', 'EMPO_STLF_NM', 'WEEK_WORK_TIME', 'PRJT_RSER_EMP_NO', 'PRJT_RSER_EMP_NM', 'CTRCT_PROG_STAT_CD', 'CTRCT_PROG_STAT_NM', 'WORK_STLF_CD', 'WORK_TP_CD', 'DOC_RQST_NO', 'FRM_TIME_LIST', 'TO_TIME_LIST', 'WORK_TIME_LIST'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_GRD_CD', 'SCH_CTRCT_PROG_STAT_CD', 'SCH_STDR_FRM_YM', 'SCH_STDR_TO_YM', 'SCH_EMPO_CTRCT_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 직급구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 진행상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 기준연월 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 계약구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('재임용대상자관리 (hrm_3115m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3115m' OR MNU_NM LIKE '재임용대상자관리%'
  const MENU_ID = 'TODO_hrm_3115m';
  const API_URL = '/mis/hrm/hrm3115/getList.do';
  const RESULT_COLS = ['APLY_YY', 'SEQ', 'EMPO_STLF_CD', 'CTRCT_YM', 'DEPT_CD', 'DEPT_NM', 'EMP_NO', 'EMP_NM', 'GRD_NM', 'CTRCT_WRT_DT', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'MM_CNT', 'CTRCT_PROG_STAT_CD', 'CTRCT_PROG_STAT_NM', 'EMPO_CTRCT_FG_CD', 'CTRCT_DSTH_DT', 'STRCT_DCSN_DT', 'WORK_DEPT_NM', 'EXC_JOB', 'RMK', 'EMPO_CTRCT_DSTH_YN', 'PRJT_RSER_CNRM_STAT', 'PRJT_RSER_CNRM_STAT_NM', 'RCTRT_YN_RQST_DT', 'PRJT_RSER_EMP_NO', 'PRJT_RSER_EMP_NM', 'DOC_RQST_NO', 'MAIL', 'PRV_PRJT_RSER_NO', 'PRV_PRJT_RSER_NM'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_EMPO_STLF_CD', 'SCH_CTRCT_FRM_YM', 'SCH_CTRCT_TO_YM', 'SCH_EXPR_FRM_YM', 'SCH_EXPR_TO_YM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 고용형태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 계약연월 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 만료연월 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('고용계약통보관리 (hrm_3120m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3120m' OR MNU_NM LIKE '고용계약통보관리%'
  const MENU_ID = 'TODO_hrm_3120m';
  const API_URL = '/mis/hrm/hrm3120/getList.do';
  const RESULT_COLS = ['WORK_DGCNT', 'APLY_YY', 'STDR_QU', 'CTRCT_YM', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'SEQ', 'GRD_CD', 'GRD_NM', 'CTRCT_WRT_DT', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'CTRCT_SIGG_DT', 'CTRCT_DCSN_DE', 'APPTP_EMP_NM', 'APPTP_EMP_NO', 'ORGAN_NM', 'EMPO_CTRCT_FG_CD', 'EMPO_CTRCT_FG_NM', 'BIRTH', 'SEX_DIST_CD', 'EMPO_CNR_ADDR', 'RES_NO', 'WORK_DEPT_NM', 'EXC_JOB', 'EMPO_CTRCT_DSTH_YN', 'CTRCT_DSTH_DT', 'RMK', 'EMPO_STLF_CD', 'EMPO_STLF_NM', 'WEEK_WORK_TIME', 'WORK_STLF_CD', 'WORK_TP_CD', 'PRJT_RSER_EMP_NO', 'PRJT_RSER_EMP_NM', 'CTRCT_PROG_STAT_CD', 'CTRCT_PROG_STAT_NM', 'PRJT_RSER_CNRM_STAT', 'RCTRT_YN_RQST_DT', 'DOC_RQST_NO', 'SIGN_STAT_NM', 'SIGN_DOC_ID', 'IMG', 'SIGG_SBMT_CLOS_DT'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_CTRCT_PROG_STAT_CD', 'SCH_EMPO_STLF_CD', 'SCH_STDR_FRM_YM', 'SCH_STDR_TO_YM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 진행상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 고용형태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 기준연월 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계약직재계약여부확인 (hrm_3130m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3130m' OR MNU_NM LIKE '계약직재계약여부확인%'
  const MENU_ID = 'TODO_hrm_3130m';
  const API_URL = '/mis/hrm/hrm3130/getList.do';
  const RESULT_COLS = ['YY', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'WORK_DGCNT', 'EMPO_STLF_CD', 'FG', 'GRD_CD', 'CTRCT_DT', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'PRJT_RSER_CNRM_STAT', 'RCTRT_YN_RQST_DT', 'PRJT_RSER_EMP_NO', 'PRJT_RSER_EMP_NM', 'TODO_NO', 'PRJT_RSER_RPLY_DE', 'ANRY_CTRCT_FG_CD', 'ANRY_CTRCT_FG_NM', 'ANRY_DEPT_CD', 'ANRY_DEPT_NM', 'STDR_YY', 'WORK_STLF', 'WEEK_WORK_TIME', 'JSFC_CD', 'GRADE_APLY_YY', 'ANRY_CTRCT_DT', 'ANRY_CTRCT_FRM_DT', 'ANRY_CTRCT_TO_DT', 'NOW_GRD_CD', 'CTRCT_GRD_CD', 'NOW_GRADE', 'CTRCT_GRADE', 'STDR_ANRY', 'STDR_MM_SAL', 'CTRCT_ANRY', 'CTRCT_MM_SAL', 'ADSB_RATE', 'RMK'];
  const CLEAR_COLS = ['SCH_PRJT_RSER_EMP_NM', 'SCH_PRJT_RSER_EMP_NO', 'SCH_APLY_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 활용책임자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 활용책임자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('고용계약현황 (hrm_3140m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3140m' OR MNU_NM LIKE '고용계약현황%'
  const MENU_ID = 'TODO_hrm_3140m';
  const API_URL = '/mis/hrm/hrm3140/getList.do';
  const RESULT_COLS = ['APLY_YY', 'EMPO_STLF_NM', 'CTRCT_YM', 'CTRCT_YY', 'CTRCT_MM', 'DEPT_CD', 'DEPT_NM', 'EMP_NO', 'EMP_NM', 'GRD_NM', 'SAL_GRD_NM', 'CTRCT_WRT_DT', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'MM_CNT', 'CTRCT_PROG_STAT_CD', 'CTRCT_PROG_STAT_NM', 'EMPO_CTRCT_FG_CD', 'EMPO_CTRCT_FG_NM', 'CTRCT_DSTH_DT', 'STRCT_DCSN_DT', 'WORK_DEPT_NM', 'EXC_JOB', 'RMK', 'EMPO_CTRCT_DSTH_YN', 'JOB_EXC_ACR_RPT_YN'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_EMPO_STLF_CD', 'SCH_DEPT_CD', 'SCH_DEPT_NM', 'SCH_APLY_YY', 'SCH_CTRCT_PROG_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 고용형태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 부서명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 부서명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 진행상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('고용계약서확인 (hrm_3150m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3150m' OR MNU_NM LIKE '고용계약서확인%'
  const MENU_ID = 'TODO_hrm_3150m';
  const API_URL = '/mis/hrm/hrm3150/getList.do';
  const RESULT_COLS = ['APLY_YY', 'EMP_NO', 'EMP_NM', 'DEPT_NM', 'WORK_DGCNT', 'SEQ', 'GRD_CD', 'GRD_NM', 'SAL_GRD_CD', 'CTRCT_WRT_DT', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'CTRCT_PROG_STAT_CD', 'STRCT_SIGG_DE', 'STRCT_DCSN_DE', 'APPTP_EMP_NO', 'APPTP_EMP_NM', 'ORGAN_NM', 'BIRTH', 'EMPO_CNR_ADDR', 'EMPO_CTRCT_FG_CD', 'PRJT_RSER_EMP_NM', 'WORK_DEPT_NM', 'EXC_JOB', 'WEEK_WORK_TIME', 'SIGN_DOC_ID', 'SIGN_STAT_NM', 'DOC_RQST_NO', 'SIGNER_DATA'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] SCH_EMP_NM 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] SCH_EMP_NO 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연봉계약확인 (hrm_3160m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3160m' OR MNU_NM LIKE '연봉계약확인%'
  const MENU_ID = 'TODO_hrm_3160m';
  const API_URL = '/mis/hrm/hrm3160/getList.do';
  const RESULT_COLS = ['APLY_YY', 'EMP_NO', 'EMP_NM', 'DEPT_NM', 'WORK_DGCNT', 'SEQ', 'BASC_ANRY_AMT', 'GRD_CD', 'SAL_GRD_CD', 'FLOC_CD', 'CTRCT_WRT_DT', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'CTRCT_PROG_STAT_CD', 'STRCT_SIGG_DE', 'STRCT_DCSN_DE', 'APPTP_EMP_NO', 'APPTP_EMP_NM', 'ORGAN_NM', 'SIGN', 'ADD_AGRE_METR'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_CTRCT_PROG_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] SCH_EMP_NM 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] SCH_EMP_NO 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 진행상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사인처리 (hrm_3162m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3162m' OR MNU_NM LIKE '사인처리%'
  const MENU_ID = 'TODO_hrm_3162m';
  const API_URL = '';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 화면 진입 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('고용계약총괄표 (hrm_3170m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3170m' OR MNU_NM LIKE '고용계약총괄표%'
  const MENU_ID = 'TODO_hrm_3170m';
  const API_URL = '/mis/hrm/hrm3170/getList.do';
  const RESULT_COLS = ['FG', 'CTRCT_YM', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'EMPO_STLF_CD', 'GRD_CD', 'HLDF_FG_CD'];
  const CLEAR_COLS = ['SCH_STDR_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기준연봉관리 (hrm_3200m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3200m' OR MNU_NM LIKE '기준연봉관리%'
  const MENU_ID = 'TODO_hrm_3200m';
  const API_URL = '/mis/hrm/hrm3200/getList.do';
  const RESULT_COLS = ['STDR_YY', 'EMPO_STLF_CD', 'EMPO_STLF_NM', 'JSFC_CD', 'GRD_CD', 'ANRY_GRADE', 'BSCS', 'PFBN', 'STDR_ANRY', 'FEINSR', 'RSIGN_RSMN', 'ORGAN_ALOTM', 'TOT_EMCST', 'RS_RATE', 'JSFC_NM', 'DCSN_YN'];
  const CLEAR_COLS = ['SCH_STDR_YY', 'SCH_EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 고용형태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('성과연봉관리 (hrm_3210m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3210m' OR MNU_NM LIKE '성과연봉관리%'
  const MENU_ID = 'TODO_hrm_3210m';
  const API_URL = '/mis/hrm/hrm3210/getList.do';
  const RESULT_COLS = ['STDR_YY', 'EMPO_STLF_CD', 'EVAL_GRADE_CD', 'WGV', 'HRM_POIN', 'SMRY'];
  const CLEAR_COLS = ['SCH_STDR_YY', 'SCH_EMPO_STLF_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 고용형태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('승호관리 (hrm_3220m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3220m' OR MNU_NM LIKE '승호관리%'
  const MENU_ID = 'TODO_hrm_3220m';
  const API_URL = '/mis/hrm/hrm3220/getList.do';
  const RESULT_COLS = ['STDR_YY', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'WORK_DGCNT', 'GRD_CD', 'JSFC_CD', 'EVAL_JBGP', 'FLOC_CD', 'EMPO_STLF_CD', 'EVAL_YY', 'EVAL_SCR', 'EVAL_GRADE_CD', 'RMK', 'PRMT_APLY_YN', 'CLOS_YN', 'HLDF_FG_CD', 'ENT_DT', 'PRMT_NAPLY_RSN'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_HLDF_FG_CD', 'SCH_JSFC_CD', 'SCH_GRD_CD', 'SCH_EVAL_JBGP', 'SCH_STDR_YY', 'SCH_EVAL_GRADE_CD', 'SCH_PRMT_APLY_YN'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 재직구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 직종구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 직급구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 평가직군 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 평가등급 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:10] 승급여부 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:11] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인사포인트관리 (hrm_3230m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3230m' OR MNU_NM LIKE '인사포인트관리%'
  const MENU_ID = 'TODO_hrm_3230m';
  const API_URL = '/mis/hrm/hrm3230/getList.do';
  const RESULT_COLS = ['STDR_YY', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'APLY_DT', 'EMPO_STLF_CD', 'HLDF_FG_CD', 'JSFC_CD', 'NOW_GRD_CD', 'PRMT_GRD_CD', 'NOW_GRADE', 'EVAL_GRADE_CD', 'EVAL_GRADE_NM', 'CTRCT_GRADE', 'PRV_HRM_POIN', 'OCRNC_HRM_POIN', 'USE_HRM_POIN', 'CARF_HRM_POIN', 'RMK'];
  const CLEAR_COLS = ['SCH_STDR_YY', 'SCH_HLDF_FG_CD', 'SCH_JSFC_CD', 'SCH_GRD_CD', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DEPT_NM', 'SCH_DEPT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 재직구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 직종구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 직급구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:10] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('일반직연봉계약등록관리 (hrm_3240m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3240m' OR MNU_NM LIKE '일반직연봉계약등록관리%'
  const MENU_ID = 'TODO_hrm_3240m';
  const API_URL = '/mis/hrm/hrm3240/getList.do';
  const RESULT_COLS = ['STDR_YY', 'GRADE_APLY_YY', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'WORK_DGCNT', 'EMPO_STLF_CD', 'ANRY_CTRCT_FG_CD', 'CTRCT_DT', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'CTRCT_PROG_STAT_CD', 'NOW_GRADE', 'JSFC_CD', 'FLOC_CD', 'NOW_GRD_CD', 'CTRCT_GRD_CD', 'EMYT_CTRCT_CND', 'CTRCT_GRADE', 'EMPO_CTRCT_FG_CD', 'STDR_ANRY', 'STDR_BSCS', 'STDR_PFBN', 'EVAL_GRADE_CD', 'RSLT_WGV', 'CTRCT_ANRY', 'CTRCT_BSCS', 'CTRCT_PFBN', 'RMK', 'CTRCT_MM_SAL', 'DSTH_YN', 'SIGG_YN', 'SAL_APLY_DT', 'DOC_RQST_NO'];
  const CLEAR_COLS = ['SCH_ANRY_CTRCT_FG_CD', 'SCH_CTRCT_PROG_STAT_CD', 'SCH_FRM_STDR_YY', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_TO_STDR_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 계약구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 진행상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계약직연봉계약등록관리 (hrm_3250m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3250m' OR MNU_NM LIKE '계약직연봉계약등록관리%'
  const MENU_ID = 'TODO_hrm_3250m';
  const API_URL = '/mis/hrm/hrm3250/getList.do';
  const RESULT_COLS = ['STDR_YY', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'WORK_DGCNT', 'CTRCT_DT', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'CTRCT_DAYS', 'CTRCT_WEEKS', 'CTRCT_MONTHS', 'CTRCT_PROG_STAT_CD', 'WORK_STLF', 'ANRY_CTRCT_FG_CD', 'WEEK_WORK_TIME', 'JSFC_CD', 'FLOC_CD', 'GRADE_APLY_YY', 'NOW_GRD_CD', 'CTRCT_GRD_CD', 'NOW_GRADE', 'CTRCT_GRADE', 'STDR_ANRY', 'STDR_BSCS', 'STDR_PFBN', 'STDR_MM_SAL', 'STDR_PYMH', 'ADSB_RATE', 'CTRCT_ANRY', 'CTRCT_MM_SAL', 'CTRCT_PYMH', 'PAY_HDAY_ALNC', 'PALR_METR', 'RMK', 'EMPO_STLF_CD', 'ENT_DT', 'SAL_APLY_DT', 'DOC_RQST_NO'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_CTRCT_PROG_STAT_CD', 'SCH_ANRY_CTRCT_FG_CD', 'SCH_TO_STDR_YY', 'SCH_FRM_STDR_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 계약상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 계약구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계약직등급현황 (hrm_3260m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3260m' OR MNU_NM LIKE '계약직등급현황%'
  const MENU_ID = 'TODO_hrm_3260m';
  const API_URL = '/mis/hrm/hrm3260/getList.do';
  const RESULT_COLS = ['STDR_YY', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'WORK_DGCNT', 'SEQ', 'ANRY_CTRCT_FG_CD', 'ENT_DT', 'CTRCT_DT', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'CTRCT_ANRY', 'CTRCT_MM_SAL', 'CTRCT_PYMH', 'PAY_HDAY_ALNC', 'NOW_GRADE', 'CTRCT_GRADE', 'SRLS'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_STDR_YY', 'SCH_ANRY_CTRCT_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 대상연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 계약구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연봉계약통보관리 (hrm_3270m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3270m' OR MNU_NM LIKE '연봉계약통보관리%'
  const MENU_ID = 'TODO_hrm_3270m';
  const API_URL = '/mis/hrm/hrm3270/getList.do';
  const RESULT_COLS = ['STDR_YY', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'WORK_DGCNT', 'SEQ', 'EMPO_STLF_CD', 'CTRCT_GRD_CD', 'CTRCT_DT', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'CTRCT_PROG_STAT_CD', 'STRCT_DCSN_DE', 'CTRCT_ANRY', 'CTRCT_BSCS', 'CTRCT_PFBN', 'CTRCT_GRADE', 'EVAL_GRADE_CD', 'RMK', 'CTRCT_DSTH_DT', 'CTRCT_SIGG_DT', 'ANRY_CTRCT_FG_CD', 'ANRY_CTRCT_FG_NM', 'DOC_RQST_NO', 'SIGN_STAT_NM', 'SIGN_DOC_ID', 'IMG', 'WORK_STLF_CD', 'SIGG_SBMT_CLOS_DT'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_ANRY_CTRCT_FG_CD', 'SCH_STDR_YY', 'SCH_CTRCT_PROG_STAT_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 계약구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 대상연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 진행상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연봉계약당월마감 (hrm_3280m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3280m' OR MNU_NM LIKE '연봉계약당월마감%'
  const MENU_ID = 'TODO_hrm_3280m';
  const API_URL = '/mis/hrm/hrm3280/getList.do';
  const RESULT_COLS = ['STDR_YM', 'SAL_MCLOS_YN', 'SAL_MCLOS_DT'];
  const CLEAR_COLS = ['SCH_STDR_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연봉계약현황 (hrm_3290m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3290m' OR MNU_NM LIKE '연봉계약현황%'
  const MENU_ID = 'TODO_hrm_3290m';
  const API_URL = '/mis/hrm/hrm3290/getList.do';
  const RESULT_COLS = ['STDR_YY', 'EMP_NO', 'EMP_NM', 'DEPT_CD', 'DEPT_NM', 'WORK_DGCNT', 'ANRY_CTRCT_FG_CD', 'JSFC_CD', 'NOW_GRD_CD', 'CTRCT_GRD_CD', 'CTRCT_DT', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'CTRCT_PROG_STAT_CD', 'STRCT_SIGG_DE', 'CTRCT_DSTH_DT', 'EMPO_STLF_CD', 'CTRCT_DAYS', 'CTRCT_WEEKS', 'CTRCT_MONTHS', 'NOW_GRADE', 'CTRCT_GRADE', 'STDR_ANRY', 'CTRCT_ANRY', 'CTRCT_BSCS', 'CTRCT_PFBN', 'CTRCT_MM_SAL', 'GRADE_APLY_YY', 'EVAL_GRADE_CD', 'WORK_STLF', 'WEEK_WORK_TIME', 'ADSB_RATE', 'PALR_METR', 'RMK'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_EMPO_STLF_CD', 'SCH_ANRY_CTRCT_FG_CD', 'SCH_STDR_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 고용형태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 계약구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연봉계약서확인 (hrm_3300m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3300m' OR MNU_NM LIKE '연봉계약서확인%'
  const MENU_ID = 'TODO_hrm_3300m';
  const API_URL = '/mis/hrm/hrm3300/getList.do';
  const RESULT_COLS = ['STDR_YY', 'EMP_NO', 'EMP_NM', 'DEPT_NM', 'WORK_DGCNT', 'EMPO_STLF_CD', 'ANRY_CTRCT_FG_CD', 'CTRCT_GRD_CD', 'CTRCT_GRD_NM', 'CTRCT_DT', 'CTRCT_FRM_DT', 'CTRCT_TO_DT', 'CTRCT_ANRY', 'CTRCT_BSCS', 'CTRCT_PFBN', 'CTRCT_GRADE', 'PALR_METR', 'RMK', 'EVAL_GRADE_NM', 'RSLT_WGV', 'STDR_MM_SAL', 'STDR_PYMH', 'CTRCT_MM_SAL', 'CTRCT_PYMH', 'ADSB_RATE', 'PAY_HDAY_ALNC', 'OBJC_RSN', 'CTRCT_PROG_STAT_CD', 'DOC_RQST_NO', 'SIGN_DOC_ID', 'SIGN_STAT_NM', 'SIGNER_DATA'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_ANRY_CTRCT_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] SCH_EMP_NM 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] SCH_EMP_NO 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 계약구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('인사자료조회 (hrm_4010m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4010m' OR MNU_NM LIKE '인사자료조회%'
  const MENU_ID = 'TODO_hrm_4010m';
  const API_URL = '/mis/hrm/hrm4010/getData.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = ['SCH_STDR_DT', 'SCH_HLDF_FG_CD', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DEPT_NM', 'SCH_EMPO_STLF_CD', 'SCH_GRD_CD', 'SCH_FLOC_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 기준일자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 재직구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 성  명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 성  명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 부  서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 고용형태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 직  급 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 직  위 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:10] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부서별인원현황 (hrm_4020m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4020m' OR MNU_NM LIKE '부서별인원현황%'
  const MENU_ID = 'TODO_hrm_4020m';
  const API_URL = '/mis/hrm/hrm4020/getList.do';
  const RESULT_COLS = ['DEPT_ORG_CD', 'ORG_RGIN_DT', 'DEPT_CD', 'DEPT_NM', 'LVL', 'SORT_NO', 'NOW_CNT'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부서별직원현황 (hrm_4030m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4030m' OR MNU_NM LIKE '부서별직원현황%'
  const MENU_ID = 'TODO_hrm_4030m';
  const API_URL = '/mis/hrm/hrm4030/getList.do';
  const RESULT_COLS = ['DEPT_ORG_CD', 'ORG_RGIN_DT', 'DEPT_CD', 'DEPT_NM', 'LVL', 'SORT_NO', 'NOW_CNT', 'EMP_NM'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직자현황 (hrm_4050m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4050m' OR MNU_NM LIKE '퇴직자현황%'
  const MENU_ID = 'TODO_hrm_4050m';
  const API_URL = '/mis/hrm/hrm4050/getData.do';
  const RESULT_COLS = ['EMP_NO', 'EMP_NM', 'DEPT_NM', 'EMPO_STLF_NM', 'JSFC_NM', 'GRD_NM', 'FLOC_NM', 'ENT_DT', 'RSIGN_DT', 'HRM_APPNT_NM', 'CONT'];
  const CLEAR_COLS = ['SCH_FRM_DT', 'SCH_TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 퇴직일자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부서별남녀현황 (hrm_4070m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4070m' OR MNU_NM LIKE '부서별남녀현황%'
  const MENU_ID = 'TODO_hrm_4070m';
  const API_URL = '/mis/hrm/hrm4070/getList.do';
  const RESULT_COLS = ['DEPT_CD', 'DEPT_NM', 'CNT_ALL', 'CNT_M', 'LIST_M', 'CNT_F', 'LIST_F', 'SORT_NO'];
  const CLEAR_COLS = ['SCH_STD_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 기준일자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부서별연령현황 (hrm_4090m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4090m' OR MNU_NM LIKE '부서별연령현황%'
  const MENU_ID = 'TODO_hrm_4090m';
  const API_URL = '/mis/hrm/hrm4090/getList.do';
  const RESULT_COLS = ['DEPT_CD', 'DEPT_NM', 'CNT_ALL', 'CNT_20_DOWN', 'CNT_20', 'CNT_30', 'CNT_40', 'CNT_50', 'CNT_60_UP', 'AGE_AVG', 'SORT_NO'];
  const CLEAR_COLS = ['SCH_STD_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 기준일자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('신규자현황 (hrm_4100m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4100m' OR MNU_NM LIKE '신규자현황%'
  const MENU_ID = 'TODO_hrm_4100m';
  const API_URL = '/mis/hrm/hrm4100/getData.do';
  const RESULT_COLS = ['EMP_NO', 'EMP_NM', 'DEPT_NM', 'EMPO_STLF_NM', 'JSFC_NM', 'GRD_NM', 'FLOC_NM', 'ENT_DT', 'HRM_APPNT_NM', 'CONT'];
  const CLEAR_COLS = ['SCH_FRM_DT', 'SCH_TO_DT'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 입사일자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('파견/휴직현황 (hrm_4120m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4120m' OR MNU_NM LIKE '파견/휴직현황%'
  const MENU_ID = 'TODO_hrm_4120m';
  const API_URL = '/mis/hrm/hrm4120/getList.do';
  const RESULT_COLS = ['CLS', 'CLS_NM', 'EMP_NO', 'EMP_NM', 'DEPT_NM', 'JSFC_NM', 'GRD_NM', 'FLOC_NM', 'FRM_DT', 'TO_DT', 'TO_PRAR_DT', 'APPNT_NM', 'APPNT_DTL'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('직종/직급별인원통계 (hrm_4210m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_4210m' OR MNU_NM LIKE '직종/직급별인원통계%'
  const MENU_ID = 'TODO_hrm_4210m';
  const API_URL = '/mis/hrm/hrm4210/getListNmpr.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('제증명신청 목록 (hrm_5010m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_5010m' OR MNU_NM LIKE '제증명신청 목록%'
  const MENU_ID = 'TODO_hrm_5010m';
  const API_URL = '/mis/hrm/hrm5010/getList.do';
  const RESULT_COLS = ['RQST_NO', 'RQST_DT', 'STRE_STAT_CD', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'CRTF_TGPN_EMP_NO', 'CRTF_TGPN_EMP_NM', 'CRTF_TGPN_DEPT_CD', 'CRTF_TGPN_DEPT_NM', 'CRTF_TGPN_WORK_DGCNT', 'CERT_TGPN_GRD_CD', 'CERT_TGPN_ROOF_CD', 'ISSU_NO', 'ISSU_DT', 'CRTF_FG', 'RECT_HOPE_DT', 'RECT_MTHD', 'RQST_TCNT', 'ISSU_PRP', 'PRTP', 'PRINT_HCNT', 'CRTF_RMK'];
  const CLEAR_COLS = ['SCH_CRTF_FG', 'SCH_STRE_STAT_CD', 'SCH_CRTF_TGPN_EMP_NM', 'SCH_CRTF_TGPN_EMP_NO', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NM', 'SCH_APNT_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 증명서구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 신청상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 발급대상 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 발급대상 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 신청일자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:10] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('제증명신청 상세 (hrm_5011m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_5011m' OR MNU_NM LIKE '제증명신청 상세%'
  const MENU_ID = 'TODO_hrm_5011m';
  const API_URL = '/mis/hrm/hrm5011/getAppntHisList.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('제증명승인관리 (hrm_5020m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_5020m' OR MNU_NM LIKE '제증명승인관리%'
  const MENU_ID = 'TODO_hrm_5020m';
  const API_URL = '/mis/hrm/hrm5020/getList.do';
  const RESULT_COLS = ['RQST_NO', 'RQST_DT', 'ISSU_NO', 'ISSU_DT', 'CRTF_TGPN_EMP_NO', 'CRTF_TGPN_EMP_NM', 'CRTF_TGPN_WORK_DGCNT', 'CRTF_TGPN_GRD_CD', 'CRTF_TGPN_FLOC_CD', 'CRTF_TGPN_ROOF_CD', 'CRTF_FG', 'RQST_TCNT', 'ISSU_PRP', 'PRTP', 'PRINT_HCNT', 'STRE_STAT_CD', 'WORK_HIST_YN', 'RTRE_YN', 'RTRE_SEQ'];
  const CLEAR_COLS = ['SCH_CRTF_FG', 'SCH_STRE_STAT_CD', 'SCH_CRTF_TGPN_EMP_NM', 'SCH_CRTF_TGPN_EMP_NO', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_APNT_EMP_NM', 'SCH_APNT_EMP_NO'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 증명서구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 신청상태 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 발급대상 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 발급대상 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 신청일자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:9] 신청자 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:10] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육목표시간관리 (hrm_9010m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9010m' OR MNU_NM LIKE '교육목표시간관리%'
  const MENU_ID = 'TODO_hrm_9010m';
  const API_URL = '/mis/hrm/hrm9010/getEduTgpnMngList.do';
  const RESULT_COLS = ['EDU_STDR_YY', 'EMP_NO', 'EMP_NM', 'WORK_DGCNT', 'DEPT_CD', 'DEPT_NM', 'GRD_CD', 'GRD_NM', 'EDU_ESNL_TIME', 'EDU_CHSE_TIME', 'RMK', 'ENT_DT'];
  const CLEAR_COLS = ['SCH_GRD_CD', 'SCH_STDR_YY', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DEPT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 직급 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육계획등록 (hrm_9020m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9020m' OR MNU_NM LIKE '교육계획등록%'
  const MENU_ID = 'TODO_hrm_9020m';
  const API_URL = '/mis/hrm/hrm9020/getList.do';
  const RESULT_COLS = ['EDU_NO', 'EDU_YY', 'EDU_LCLA_CD', 'EDU_MIDC_CD', 'EDU_NM', 'EDU_ORGAN_NM', 'EDU_PLC', 'EDU_FRM_DT', 'EDU_TO_DT', 'EDU_AMT', 'EDU_CONT'];
  const CLEAR_COLS = ['SCH_EDU_LCLA_CD', 'SCH_EDU_MIDC_CD', 'SCH_EDU_NM', 'SCH_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 교육구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 교육구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 교육명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 교육년도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육대상자관리 (hrm_9030m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9030m' OR MNU_NM LIKE '교육대상자관리%'
  const MENU_ID = 'TODO_hrm_9030m';
  const API_URL = '/mis/hrm/hrm9010/getEduTgpnMngList.do';
  const RESULT_COLS = ['EDU_STDR_YY', 'EMP_NO', 'EMP_NM', 'WORK_DGCNT', 'DEPT_CD', 'DEPT_NM', 'GRD_CD', 'GRD_NM', 'EDU_ESNL_TIME', 'EDU_CHSE_TIME', 'RMK', 'ENT_DT'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DEPT_NM', 'SCH_STDR_YY'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 기준연도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육신청(개인)목록 (hrm_9110m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9110m' OR MNU_NM LIKE '교육신청(개인)목록%'
  const MENU_ID = 'TODO_hrm_9110m';
  const API_URL = '/mis/hrm/hrm9110/getList.do';
  const RESULT_COLS = ['EDU_RQST_NO', 'RQST_FG', 'RQST_DT', 'APNT_EMP_NO', 'APNT_EMP_NM', 'APNT_WORK_DGCNT', 'APNT_DEPT_CD', 'APNT_DEPT_NM', 'APNT_GRD_CD', 'EDU_TGPN_EMP_NO', 'EDU_TGPN_EMP_NM', 'EDU_TGPN_WORK_DGCNT', 'EDU_TGPN_DEPT_CD', 'EDU_TGPN_DEPT_NM', 'EDU_TGPN_GRD_CD', 'EDU_LCLA_CD', 'EDU_MIDC_CD', 'EDU_DT', 'EDU_ORGAN_NM', 'PRV_EDU_RQST_NO', 'CNCL_RSN', 'APV_STAT_CD', 'GW_DOC_ID', 'CNCL_RQST_YN', 'EDU_NM'];
  const CLEAR_COLS = ['SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_DEPT_NM', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_RQST_FG'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 교육기간 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 신청구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육신청(개인) (hrm_9111m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9111m' OR MNU_NM LIKE '교육신청(개인)%'
  const MENU_ID = 'TODO_hrm_9111m';
  const API_URL = '/mis/hrm/hrm9111/getData.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육신청담당자등록 (hrm_9120m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9120m' OR MNU_NM LIKE '교육신청담당자등록%'
  const MENU_ID = 'TODO_hrm_9120m';
  const API_URL = '/mis/hrm/hrm9120/getList.do';
  const RESULT_COLS = ['EDU_RQST_NO', 'EDU_FRM_DT', 'EDU_TO_DT', 'EDU_LCLA_CD', 'EDU_MIDC_CD', 'EDU_NM', 'EDU_ORGAN_CD', 'EDU_ORGAN_NM', 'EDU_PLC', 'EDU_YY', 'CHRG_DEPT_CD', 'CHRG_DEPT_NM'];
  const CLEAR_COLS = ['SCH_EDU_YY', 'SCH_EDU_LCLA_CD', 'SCH_EDU_MIDC_CD', 'SCH_EDU_NM', 'SCH_DEPT_NM'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 교육년도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 교육구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 교육구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 교육명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육신청담당자등록 (hrm_9121m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9121m' OR MNU_NM LIKE '교육신청담당자등록%'
  const MENU_ID = 'TODO_hrm_9121m';
  const API_URL = '/mis/hrm/hrm9121/getData.do';
  const RESULT_COLS = ['EDU_RQST_NO', 'EDU_TGPN_EMP_NO', 'EDU_TGPN_EMP_NM', 'EDU_TGPN_WORK_DGCNT', 'EDU_TGPN_DEPT_CD', 'EDU_TGPN_DEPT_NM', 'EDU_TGPN_GRD_CD', 'EDU_TIME', 'EDU_YY', 'EDU_NM'];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육결과보고 (hrm_9130m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9130m' OR MNU_NM LIKE '교육결과보고%'
  const MENU_ID = 'TODO_hrm_9130m';
  const API_URL = '/mis/hrm/hrm9130/getList.do';
  const RESULT_COLS = ['EDU_RQST_NO', 'RQST_DT', 'EDU_TGPN_EMP_NO', 'EDU_TGPN_EMP_NM', 'EDU_TGPN_WORK_DGCNT', 'EDU_TGPN_DEPT_CD', 'EDU_TGPN_DEPT_NM', 'EDU_LCLA_CD', 'EDU_MIDC_CD', 'EDU_FRM_DT', 'EDU_TO_DT', 'EDU_ORGAN_CD', 'EDU_ORGAN_NM', 'EDU_NM', 'EDU_CMP_FG_CD', 'EDU_TIME'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DEPT_NM', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EDU_CMP_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 교육기간 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 교육이수구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육결과보고 (hrm_9131m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9131m' OR MNU_NM LIKE '교육결과보고%'
  const MENU_ID = 'TODO_hrm_9131m';
  const API_URL = '/mis/hrm/hrm9131/getData.do';
  // TODO: 컬럼 확인 필요
  const RESULT_COLS = [];
  const CLEAR_COLS = [];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육이수승인 (hrm_9140m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9140m' OR MNU_NM LIKE '교육이수승인%'
  const MENU_ID = 'TODO_hrm_9140m';
  const API_URL = '/mis/hrm/hrm9140/getList.do';
  const RESULT_COLS = ['EDU_RQST_NO', 'RQST_DT', 'EDU_TGPN_EMP_NO', 'EDU_TGPN_EMP_NM', 'EDU_TGPN_WORK_DGCNT', 'EDU_TGPN_DEPT_CD', 'EDU_TGPN_DEPT_NM', 'EDU_LCLA_CD', 'EDU_MIDC_CD', 'EDU_FRM_DT', 'EDU_TO_DT', 'EDU_ORGAN_CD', 'EDU_ORGAN_NM', 'EDU_NM', 'EDU_CMP_FG_CD', 'EDU_TIME', 'CHRG_DEPT_CD', 'CHRG_DEPT_NM'];
  const CLEAR_COLS = ['SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_DEPT_NM', 'SCH_RQST_FRM_DT', 'SCH_RQST_TO_DT', 'SCH_EDU_CMP_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 교육기간 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] ~ 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 교육이수구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:8] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('교육이수현황 (hrm_9210m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9210m' OR MNU_NM LIKE '교육이수현황%'
  const MENU_ID = 'TODO_hrm_9210m';
  const API_URL = '/mis/hrm/hrm9210/getList.do';
  const RESULT_COLS = ['EDU_STDR_YY', 'DEPT_CD', 'DEPT_NM', 'EMP_NO', 'EMP_NM', 'WORK_DGCNT', 'GRD_CD', 'EDU_ESNL_TIME', 'EDU_CMP_ESNL_TIME', 'EDU_CMP_ESNL_PER', 'EDU_CHSE_TIME', 'EDU_CMP_CHSE_TIME', 'EDU_CMP_CHSE_PER'];
  const CLEAR_COLS = ['SCH_DEPT_NM', 'SCH_EMP_NM', 'SCH_EMP_NO', 'SCH_EDU_YY', 'SCH_HLDF_FG_CD'];

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test.skip('[no:1] 전체 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:2] 부서 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:3] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:4] 성명 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:5] 교육년도 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:6] 재직구분 검색 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

  test.skip('[no:7] 복합 조건 조회 — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 test.skip → test 로 변경하여 활성화
    // MENU_ID 유효화 후 navigateTo / search 헬퍼 작성 필요
    void page; void MENU_ID; void API_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});
