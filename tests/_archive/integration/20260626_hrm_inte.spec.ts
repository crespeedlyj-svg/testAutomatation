// ==============================================================
// HRM 모듈 배치 통합 테스트 — 생성일 2026-06-26
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

test.describe('정원관리 (hrm_0215m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_0215m' OR MNU_NM LIKE '정원관리%'
  const MENU_ID = 'TODO_hrm_0215m';
  const SELECT_URL = '/mis/hrm/hrm0215/getData.do';
  const INSERT_URL = '/mis/hrm/hrm0215/setData.do';
  const DELETE_URL = '/mis/hrm/hrm0215/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm0215/getData.do; INSERT=/mis/hrm/hrm0215/setData.do; DELETE=/mis/hrm/hrm0215/delData.do
  test.skip('[no:1] 정원관리 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('채용충원요구신청 (hrm_2101m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2101m' OR MNU_NM LIKE '채용충원요구신청%'
  const MENU_ID = 'TODO_hrm_2101m';
  const SELECT_URL = '/mis/hrm/hrm2101/getData.do';
  const INSERT_URL = '/mis/hrm/hrm2101/setData.do';
  const DELETE_URL = '/mis/hrm/hrm2101/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm2101/getData.do; INSERT=/mis/hrm/hrm2101/setData.do; DELETE=/mis/hrm/hrm2101/delData.do
  test.skip('[no:1] 채용충원요구신청 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

  // MULTI 플로우 | sharedKey=- | -
  test.skip('[no:1] 채용충원요구신청 - 저장 후 결재상신/승인 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('채용계획관리 (hrm_2121m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2121m' OR MNU_NM LIKE '채용계획관리%'
  const MENU_ID = 'TODO_hrm_2121m';
  const SELECT_URL = '/mis/hrm/hrm2110/getCodeCrs.do';
  const INSERT_URL = '/mis/hrm/hrm2121/setData.do';
  const DELETE_URL = '/mis/hrm/hrm2121/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm2110/getCodeCrs.do; INSERT=/mis/hrm/hrm2121/setData.do; DELETE=/mis/hrm/hrm2121/delData.do
  test.skip('[no:1] 채용계획관리 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('응시자정보관리 (hrm_2130m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2130m' OR MNU_NM LIKE '응시자정보관리%'
  const MENU_ID = 'TODO_hrm_2130m';
  const SELECT_URL = '/mis/hrm/hrm2130/getCodeRalm.do';
  const INSERT_URL = '/mis/hrm/hrm2130/setData.do';
  const DELETE_URL = '/mis/hrm/hrm2130/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm2130/getCodeRalm.do; INSERT=/mis/hrm/hrm2130/setData.do; DELETE=/mis/hrm/hrm2130/delData.do
  test.skip('[no:1] 응시자정보관리 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('심사결과관리 (hrm_2140m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2140m' OR MNU_NM LIKE '심사결과관리%'
  const MENU_ID = 'TODO_hrm_2140m';
  const SELECT_URL = '/mis/hrm/hrm2130/getCodeRalm.do';
  const INSERT_URL = '/mis/hrm/hrm2140/setData.do';
  const DELETE_URL = '/mis/hrm/hrm2140/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm2130/getCodeRalm.do; INSERT=/mis/hrm/hrm2140/setData.do; DELETE=/mis/hrm/hrm2140/delData.do
  test.skip('[no:1] 심사결과관리 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('채용면접비지출발의 (hrm_2151m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2151m' OR MNU_NM LIKE '채용면접비지출발의%'
  const MENU_ID = 'TODO_hrm_2151m';
  const SELECT_URL = '/mis/hrm/hrm2151/getData.do';
  const INSERT_URL = '/mis/hrm/hrm2151/setData.do';
  const DELETE_URL = '/mis/hrm/hrm2151/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm2151/getData.do; INSERT=/mis/hrm/hrm2151/setData.do; DELETE=/mis/hrm/hrm2151/delData.do
  test.skip('[no:1] 채용면접비지출발의 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('성과급지급계획관리 (hrm_2300m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2300m' OR MNU_NM LIKE '성과급지급계획관리%'
  const MENU_ID = 'TODO_hrm_2300m';
  const SELECT_URL = '/mis/hrm/hrm2300/getLastData.do';
  const INSERT_URL = '/mis/hrm/hrm2300/setData.do';
  const DELETE_URL = '/mis/hrm/hrm2300/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm2300/getLastData.do; INSERT=/mis/hrm/hrm2300/setData.do; DELETE=/mis/hrm/hrm2300/delData.do
  test.skip('[no:1] 성과급지급계획관리 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('근무제외일수산정관리 (hrm_2310m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2310m' OR MNU_NM LIKE '근무제외일수산정관리%'
  const MENU_ID = 'TODO_hrm_2310m';
  const SELECT_URL = '/mis/hrm/hrm2310/getData.do';
  const INSERT_URL = '/mis/hrm/hrm2310/setData.do';
  const DELETE_URL = '/mis/hrm/hrm2310/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm2310/getData.do; INSERT=/mis/hrm/hrm2310/setData.do; DELETE=/mis/hrm/hrm2310/delData.do
  test.skip('[no:1] 근무제외일수산정관리 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('성과급대상자관리 (hrm_2320m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2320m' OR MNU_NM LIKE '성과급대상자관리%'
  const MENU_ID = 'TODO_hrm_2320m';
  const SELECT_URL = '/mis/hrm/hrm2320/getData.do';
  const INSERT_URL = '/mis/hrm/hrm2320/setData.do';
  const DELETE_URL = '/mis/hrm/hrm2320/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm2320/getData.do; INSERT=/mis/hrm/hrm2320/setData.do; DELETE=/mis/hrm/hrm2320/delData.do
  test.skip('[no:1] 성과급대상자관리 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('성과급산정 (hrm_2330m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2330m' OR MNU_NM LIKE '성과급산정%'
  const MENU_ID = 'TODO_hrm_2330m';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=- | -
  test.skip('[no:1] 성과급산정 - 저장 후 결재상신/승인 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('성과급지급신청 (hrm_2341m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2341m' OR MNU_NM LIKE '성과급지급신청%'
  const MENU_ID = 'TODO_hrm_2341m';
  const SELECT_URL = '/mis/hrm/hrm2341/getData.do';
  const INSERT_URL = '/mis/hrm/hrm2341/setData.do';
  const DELETE_URL = '/mis/hrm/hrm2341/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm2341/getData.do; INSERT=/mis/hrm/hrm2341/setData.do; DELETE=/mis/hrm/hrm2341/delData.do
  test.skip('[no:1] 성과급지급신청 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

  // MULTI 플로우 | sharedKey=- | -
  test.skip('[no:1] 성과급지급신청 - 저장 후 결재상신/승인 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('성과급지급승인관리 (hrm_2350m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2350m' OR MNU_NM LIKE '성과급지급승인관리%'
  const MENU_ID = 'TODO_hrm_2350m';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=- | -
  test.skip('[no:1] 성과급지급승인관리 - 저장 후 결재상신/승인 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('휴직/파견신청상세 (hrm_2401m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2401m' OR MNU_NM LIKE '휴직/파견신청상세%'
  const MENU_ID = 'TODO_hrm_2401m';
  const SELECT_URL = '/mis/hrm/hrm2401/getPrvData.do';
  const INSERT_URL = '/mis/hrm/hrm2401/setRqstData.do';
  const DELETE_URL = '/mis/hrm/hrm2401/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm2401/getPrvData.do; INSERT=/mis/hrm/hrm2401/setRqstData.do; DELETE=/mis/hrm/hrm2401/delData.do
  test.skip('[no:1] 휴직/파견신청상세 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

  // MULTI 플로우 | sharedKey=- | -
  test.skip('[no:1] 휴직/파견신청상세 - 저장 후 결재상신/승인 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('퇴직신청상세 (hrm_2411m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2411m' OR MNU_NM LIKE '퇴직신청상세%'
  const MENU_ID = 'TODO_hrm_2411m';
  const SELECT_URL = '/mis/gen/gen0091/getEmpInfo.do';
  const INSERT_URL = '/mis/gen/gen0091/setSelfGwData.do';
  const DELETE_URL = '/mis/gen/gen0091/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/gen/gen0091/getEmpInfo.do; INSERT=/mis/gen/gen0091/setSelfGwData.do; DELETE=/mis/gen/gen0091/delData.do
  test.skip('[no:1] 퇴직신청상세 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('자녀6세이하비과세신청상세 (hrm_2501m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2501m' OR MNU_NM LIKE '자녀6세이하비과세신청상세%'
  const MENU_ID = 'TODO_hrm_2501m';
  const SELECT_URL = '/mis/hrm/hrm2501/getPrvData.do';
  const INSERT_URL = '/mis/hrm/hrm2501/setData.do';
  const DELETE_URL = '/mis/hrm/hrm2501/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm2501/getPrvData.do; INSERT=/mis/hrm/hrm2501/setData.do; DELETE=/mis/hrm/hrm2501/delData.do
  test.skip('[no:1] 자녀6세이하비과세신청상세 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('자녀6세이하비과세승인관리 (hrm_2510m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2510m' OR MNU_NM LIKE '자녀6세이하비과세승인관리%'
  const MENU_ID = 'TODO_hrm_2510m';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=- | -
  test.skip('[no:1] 자녀6세이하비과세승인관리 - 저장 후 결재상신/승인 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('차량보조비비과세신청상세 (hrm_2521m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2521m' OR MNU_NM LIKE '차량보조비비과세신청상세%'
  const MENU_ID = 'TODO_hrm_2521m';
  const SELECT_URL = '/mis/hrm/hrm2521/getData.do';
  const INSERT_URL = '/mis/hrm/hrm2521/setData.do';
  const DELETE_URL = '/mis/hrm/hrm2521/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm2521/getData.do; INSERT=/mis/hrm/hrm2521/setData.do; DELETE=/mis/hrm/hrm2521/delData.do
  test.skip('[no:1] 차량보조비비과세신청상세 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('차량보조비비과세승인관리 (hrm_2530m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_2530m' OR MNU_NM LIKE '차량보조비비과세승인관리%'
  const MENU_ID = 'TODO_hrm_2530m';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=- | -
  test.skip('[no:1] 차량보조비비과세승인관리 - 저장 후 결재상신/승인 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('개인인사정보변경신청상세 (hrm_3031m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3031m' OR MNU_NM LIKE '개인인사정보변경신청상세%'
  const MENU_ID = 'TODO_hrm_3031m';
  const SELECT_URL = '/mis/hrm/hrm3031/getMain.do';
  const INSERT_URL = '/mis/hrm/hrm3031/setTabData.do';
  const DELETE_URL = '/mis/hrm/hrm3031/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm3031/getMain.do; INSERT=/mis/hrm/hrm3031/setTabData.do; DELETE=/mis/hrm/hrm3031/delData.do
  test.skip('[no:1] 개인인사정보변경신청상세 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

  // MULTI 플로우 | sharedKey=- | -
  test.skip('[no:1] 개인인사정보변경신청상세 - 저장 후 결재상신/승인 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('개인인사정보변경승인관리상세 (hrm_3041m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3041m' OR MNU_NM LIKE '개인인사정보변경승인관리상세%'
  const MENU_ID = 'TODO_hrm_3041m';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=- | -
  test.skip('[no:1] 개인인사정보변경승인관리상세 - 저장 후 결재상신/승인 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('고용계약관리(일반직) (hrm_3100m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3100m' OR MNU_NM LIKE '고용계약관리(일반직)%'
  const MENU_ID = 'TODO_hrm_3100m';
  const SELECT_URL = '/mis/hrm/hrm3100/getList.do';
  const INSERT_URL = '/mis/hrm/hrm3100/setData.do';
  const DELETE_URL = '/mis/hrm/hrm3100/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm3100/getList.do; INSERT=/mis/hrm/hrm3100/setData.do; DELETE=/mis/hrm/hrm3100/delData.do
  test.skip('[no:1] 고용계약관리(일반직) - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('기준연봉관리 (hrm_3200m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_3200m' OR MNU_NM LIKE '기준연봉관리%'
  const MENU_ID = 'TODO_hrm_3200m';
  const SELECT_URL = '/mis/hrm/hrm3200/getJsfcList.do';
  const INSERT_URL = '/mis/hrm/hrm3200/setData.do';
  const DELETE_URL = '/mis/hrm/hrm3200/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm3200/getJsfcList.do; INSERT=/mis/hrm/hrm3200/setData.do; DELETE=/mis/hrm/hrm3200/delData.do
  test.skip('[no:1] 기준연봉관리 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('제증명신청 상세 (hrm_5011m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_5011m' OR MNU_NM LIKE '제증명신청 상세%'
  const MENU_ID = 'TODO_hrm_5011m';
  const SELECT_URL = '/mis/hrm/hrm5011/getAppntHisList.do';
  const INSERT_URL = '/mis/hrm/hrm5011/setPrintData.do';
  const DELETE_URL = '/mis/hrm/hrm5011/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm5011/getAppntHisList.do; INSERT=/mis/hrm/hrm5011/setPrintData.do; DELETE=/mis/hrm/hrm5011/delData.do
  test.skip('[no:1] 제증명신청 상세 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('제증명승인관리 (hrm_5020m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_5020m' OR MNU_NM LIKE '제증명승인관리%'
  const MENU_ID = 'TODO_hrm_5020m';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=- | -
  test.skip('[no:1] 제증명승인관리 - 저장 후 결재상신/승인 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('교육계획등록 (hrm_9020m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9020m' OR MNU_NM LIKE '교육계획등록%'
  const MENU_ID = 'TODO_hrm_9020m';
  const SELECT_URL = '/mis/hrm/hrm9020/getList.do';
  const INSERT_URL = '/mis/hrm/hrm9020/setData.do';
  const DELETE_URL = '/mis/hrm/hrm9020/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm9020/getList.do; INSERT=/mis/hrm/hrm9020/setData.do; DELETE=/mis/hrm/hrm9020/delData.do
  test.skip('[no:1] 교육계획등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('교육신청(개인) (hrm_9111m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9111m' OR MNU_NM LIKE '교육신청(개인)%'
  const MENU_ID = 'TODO_hrm_9111m';
  const SELECT_URL = '/mis/hrm/hrm9111/getData.do';
  const INSERT_URL = '/mis/hrm/hrm9111/setData.do';
  const DELETE_URL = '/mis/hrm/hrm9111/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm9111/getData.do; INSERT=/mis/hrm/hrm9111/setData.do; DELETE=/mis/hrm/hrm9111/delData.do
  test.skip('[no:1] 교육신청(개인) - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

  // MULTI 플로우 | sharedKey=- | -
  test.skip('[no:1] 교육신청(개인) - 저장 후 결재상신/승인 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});

test.describe('교육신청담당자등록 (hrm_9121m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'hrm_9121m' OR MNU_NM LIKE '교육신청담당자등록%'
  const MENU_ID = 'TODO_hrm_9121m';
  const SELECT_URL = '/mis/hrm/hrm9121/getData.do';
  const INSERT_URL = '/mis/hrm/hrm9121/setData.do';
  const DELETE_URL = '/mis/hrm/hrm9121/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/hrm/hrm9121/getData.do; INSERT=/mis/hrm/hrm9121/setData.do; DELETE=/mis/hrm/hrm9121/delData.do
  test.skip('[no:1] 교육신청담당자등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID;
  });

});
