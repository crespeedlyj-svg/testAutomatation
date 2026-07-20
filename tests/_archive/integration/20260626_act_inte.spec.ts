// ==============================================================
// ACT(결산관리) 모듈 배치 UI 통합 테스트 — 생성일 2026-06-28
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


test.describe('기관정보등록 (act_1010M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1010M' OR MNU_NM LIKE '기관정보등록%'
  const MENU_ID = 'TODO_act_1010M';
  const SELECT_URL = '/mis/act/act1010/getList.do';
  const INSERT_URL = '/mis/act/act1010/setData.do';
  const DELETE_URL = '/mis/act/act1010/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=CORP_NO | SELECT=/mis/act/act1010/getList.do; INSERT=/mis/act/act1010/setData.do; DELETE=/mis/act/act1010/delData.do
  test.skip('[no:1] 기관정보등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회계단위등록 (act_1020M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1020M' OR MNU_NM LIKE '회계단위등록%'
  const MENU_ID = 'TODO_act_1020M';
  const SELECT_URL = '/mis/act/act1020/getList.do';
  const INSERT_URL = '/mis/act/act1020/setData.do';
  const DELETE_URL = '/mis/act/act1020/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=POST_NO | SELECT=/mis/act/act1020/getList.do; INSERT=/mis/act/act1020/setData.do; DELETE=/mis/act/act1020/delData.do
  test.skip('[no:1] 회계단위등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사업장등록 (act_1030M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1030M' OR MNU_NM LIKE '사업장등록%'
  const MENU_ID = 'TODO_act_1030M';
  const SELECT_URL = '/mis/act/act1030/getList.do';
  const INSERT_URL = '/mis/act/act1030/setData.do';
  const DELETE_URL = '/mis/act/act1030/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=TEL_NO | SELECT=/mis/act/act1030/getList.do; INSERT=/mis/act/act1030/setData.do; DELETE=/mis/act/act1030/delData.do
  test.skip('[no:1] 사업장등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('거래처등록 (act_1040M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1040M' OR MNU_NM LIKE '거래처등록%'
  const MENU_ID = 'TODO_act_1040M';
  const SELECT_URL = '/mis/act/act1040/getList.do';
  const INSERT_URL = '/mis/act/act1040/getCheckRegNo.do';
  const DELETE_URL = '/mis/act/act1040/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RES_NO | SELECT=/mis/act/act1040/getList.do; INSERT=/mis/act/act1040/getCheckRegNo.do; DELETE=/mis/act/act1040/delData.do
  test.skip('[no:1] 거래처등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계정코드등록 (act_1050M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1050M' OR MNU_NM LIKE '계정코드등록%'
  const MENU_ID = 'TODO_act_1050M';
  const SELECT_URL = '/mis/act/act1050/getList.do';
  const INSERT_URL = '/mis/act/act1050/setData.do';
  const DELETE_URL = '/mis/act/act1050/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SORT_SEQ | SELECT=/mis/act/act1050/getList.do; INSERT=/mis/act/act1050/setData.do; DELETE=/mis/act/act1050/delData.do
  test.skip('[no:1] 계정코드등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('은행코드등록 (act_1110M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1110M' OR MNU_NM LIKE '은행코드등록%'
  const MENU_ID = 'TODO_act_1110M';
  const SELECT_URL = '/mis/act/act1110/getList.do';
  const INSERT_URL = '/mis/act/act1110/setData.do';
  const DELETE_URL = '/mis/act/act1110/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=POST_NO | SELECT=/mis/act/act1110/getList.do; INSERT=/mis/act/act1110/setData.do; DELETE=/mis/act/act1110/delData.do
  test.skip('[no:1] 은행코드등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연계문서현황 (act_1180M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1180M' OR MNU_NM LIKE '연계문서현황%'
  const MENU_ID = 'TODO_act_1180M';
  const SELECT_URL = '/mis/act/act1180/getList.do';
  const INSERT_URL = '/mis/act/act1180/setData.do';
  const DELETE_URL = '/mis/act/act1180/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=CNTC_NO | SELECT=/mis/act/act1180/getList.do; INSERT=/mis/act/act1180/setData.do; DELETE=/mis/act/act1180/delData.do
  test.skip('[no:1] 연계문서현황 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연계문서조회 (act_1181M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_1181M' OR MNU_NM LIKE '연계문서조회%'
  const MENU_ID = 'TODO_act_1181M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act1181/setData.do';
  const DELETE_URL = '/mis/act/act1181/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=CNTC_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act1181/setData.do; DELETE=/mis/act/act1181/delData.do
  test.skip('[no:1] 연계문서조회 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지출결의서 (act_2011M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2011M' OR MNU_NM LIKE '지출결의서%'
  const MENU_ID = 'TODO_act_2011M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act2011/setData.do';
  const DELETE_URL = '/mis/act/act2011/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RESL_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act2011/setData.do; DELETE=/mis/act/act2011/delData.do
  test.skip('[no:1] 지출결의서 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계정대체신청서 (act_2031M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2031M' OR MNU_NM LIKE '계정대체신청서%'
  const MENU_ID = 'TODO_act_2031M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act2031/setData.do';
  const DELETE_URL = '/mis/act/act2031/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RESL_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act2031/setData.do; DELETE=/mis/act/act2031/delData.do
  test.skip('[no:1] 계정대체신청서 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('결산전표 (act_2051M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2051M' OR MNU_NM LIKE '결산전표%'
  const MENU_ID = 'TODO_act_2051M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act2051/setData.do';
  const DELETE_URL = '/mis/act/act2051/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SLIP_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act2051/setData.do; DELETE=/mis/act/act2051/delData.do
  test.skip('[no:1] 결산전표 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('가지급금지급신청서 (act_2061M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2061M' OR MNU_NM LIKE '가지급금지급신청서%'
  const MENU_ID = 'TODO_act_2061M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act2061/setData.do';
  const DELETE_URL = '/mis/act/act2061/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RESL_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act2061/setData.do; DELETE=/mis/act/act2061/delData.do
  test.skip('[no:1] 가지급금지급신청서 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('가지급금정산신청서 (act_2071M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2071M' OR MNU_NM LIKE '가지급금정산신청서%'
  const MENU_ID = 'TODO_act_2071M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act2071/setData.do';
  const DELETE_URL = '/mis/act/act2071/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RESL_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act2071/setData.do; DELETE=/mis/act/act2071/delData.do
  test.skip('[no:1] 가지급금정산신청서 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('선급금지급신청서 (act_2081M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2081M' OR MNU_NM LIKE '선급금지급신청서%'
  const MENU_ID = 'TODO_act_2081M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act2061/setData.do';
  const DELETE_URL = '/mis/act/act2061/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RESL_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act2061/setData.do; DELETE=/mis/act/act2061/delData.do
  test.skip('[no:1] 선급금지급신청서 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('선급금정산신청서 (act_2091M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2091M' OR MNU_NM LIKE '선급금정산신청서%'
  const MENU_ID = 'TODO_act_2091M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act2071/setData.do';
  const DELETE_URL = '/mis/act/act2071/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RESL_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act2071/setData.do; DELETE=/mis/act/act2071/delData.do
  test.skip('[no:1] 선급금정산신청서 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('수입의뢰서 (act_2111M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2111M' OR MNU_NM LIKE '수입의뢰서%'
  const MENU_ID = 'TODO_act_2111M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act2111/setData.do';
  const DELETE_URL = '/mis/act/act2111/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RESL_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act2111/setData.do; DELETE=/mis/act/act2111/delData.do
  test.skip('[no:1] 수입의뢰서 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('여입의뢰서 (act_2112M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2112M' OR MNU_NM LIKE '여입의뢰서%'
  const MENU_ID = 'TODO_act_2112M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act2111/setData.do';
  const DELETE_URL = '/mis/act/act2111/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RESL_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act2111/setData.do; DELETE=/mis/act/act2111/delData.do
  test.skip('[no:1] 여입의뢰서 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('가수금정산 (act_2220M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_2220M' OR MNU_NM LIKE '가수금정산%'
  const MENU_ID = 'TODO_act_2220M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act2220/setPbck.do';
  const DELETE_URL = '/mis/act/act2220/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=DPSTS_TRNS_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act2220/setPbck.do; DELETE=/mis/act/act2220/delData.do
  test.skip('[no:1] 가수금정산 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회계결의서 등록 (act_3011M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3011M' OR MNU_NM LIKE '회계결의서 등록%'
  const MENU_ID = 'TODO_act_3011M';
  const SELECT_URL = '/mis/act/act3011/getData.do';
  const INSERT_URL = '/mis/act/act3011/setData.do';
  const DELETE_URL = '/mis/act/act3011/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/act/act3011/getData.do; INSERT=/mis/act/act3011/setData.do; DELETE=/mis/act/act3011/delData.do
  test.skip('[no:1] 회계결의서 등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회계전표 등록 (act_3041M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3041M' OR MNU_NM LIKE '회계전표 등록%'
  const MENU_ID = 'TODO_act_3041M';
  const SELECT_URL = '/mis/act/act0000/getConf.do';
  const INSERT_URL = '/mis/act/act3041/setData.do';
  const DELETE_URL = '/mis/act/act3041/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/act/act0000/getConf.do; INSERT=/mis/act/act3041/setData.do; DELETE=/mis/act/act3041/delData.do
  test.skip('[no:1] 회계전표 등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회계결의서 등록 (act_3911M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3911M' OR MNU_NM LIKE '회계결의서 등록%'
  const MENU_ID = 'TODO_act_3911M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act3911/setData.do';
  const DELETE_URL = '/mis/act/act3911/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act3911/setData.do; DELETE=/mis/act/act3911/delData.do
  test.skip('[no:1] 회계결의서 등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('연계 등록 (act_3991M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_3991M' OR MNU_NM LIKE '연계 등록%'
  const MENU_ID = 'TODO_act_3991M';
  const SELECT_URL = '/mis/act/act3991/getData.do';
  const INSERT_URL = '/mis/act/act3991/setData.do';
  const DELETE_URL = '/mis/act/act3991/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/act/act3991/getData.do; INSERT=/mis/act/act3991/setData.do; DELETE=/mis/act/act3991/delData.do
  test.skip('[no:1] 연계 등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('예금등록 (act_5010M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_5010M' OR MNU_NM LIKE '예금등록%'
  const MENU_ID = 'TODO_act_5010M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act5010/setData.do';
  const DELETE_URL = '/mis/act/act5010/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=ACC_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act5010/setData.do; DELETE=/mis/act/act5010/delData.do
  test.skip('[no:1] 예금등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기간비용등록 (act_5410M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_5410M' OR MNU_NM LIKE '기간비용등록%'
  const MENU_ID = 'TODO_act_5410M';
  const SELECT_URL = '/mis/act/act0000/getUnt.do';
  const INSERT_URL = '/mis/act/act5410/setData.do';
  const DELETE_URL = '/mis/act/act5410/delete.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/act/act0000/getUnt.do; INSERT=/mis/act/act5410/setData.do; DELETE=/mis/act/act5410/delete.do
  test.skip('[no:1] 기간비용등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('카드등록 (act_6010M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_6010M' OR MNU_NM LIKE '카드등록%'
  const MENU_ID = 'TODO_act_6010M';
  const SELECT_URL = '/mis/act/act0000/getBusiPlcInfo.do';
  const INSERT_URL = '/mis/act/act6010/getUserAddList.do';
  const DELETE_URL = '/mis/act/act6010/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=CARD_NO | SELECT=/mis/act/act0000/getBusiPlcInfo.do; INSERT=/mis/act/act6010/getUserAddList.do; DELETE=/mis/act/act6010/delData.do
  test.skip('[no:1] 카드등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('부가세등록 (act_7011M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7011M' OR MNU_NM LIKE '부가세등록%'
  const MENU_ID = 'TODO_act_7011M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act7010/insData.do';
  const DELETE_URL = '/mis/act/act7010/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=CARD_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act7010/insData.do; DELETE=/mis/act/act7010/delData.do
  test.skip('[no:1] 부가세등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사업장별과표및세액신고서 (act_7230M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7230M' OR MNU_NM LIKE '사업장별과표및세액신고서%'
  const MENU_ID = 'TODO_act_7230M';
  const SELECT_URL = '/mis/act/act7230/getBusiPlc.do';
  const INSERT_URL = '/mis/act/act7230/setData.do';
  const DELETE_URL = '/mis/act/act7230/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/act/act7230/getBusiPlc.do; INSERT=/mis/act/act7230/setData.do; DELETE=/mis/act/act7230/delData.do
  test.skip('[no:1] 사업장별과표및세액신고서 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('공제받지못할매입세액명세서 (act_7420M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7420M' OR MNU_NM LIKE '공제받지못할매입세액명세서%'
  const MENU_ID = 'TODO_act_7420M';
  const SELECT_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const INSERT_URL = '/mis/act/act7420/setCreat.do';
  const DELETE_URL = '/mis/act/act7420/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/act/act0000/getMainBusiPlc.do; INSERT=/mis/act/act7420/setCreat.do; DELETE=/mis/act/act7420/delData.do
  test.skip('[no:1] 공제받지못할매입세액명세서 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('영세율매출명세서 (act_7490M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7490M' OR MNU_NM LIKE '영세율매출명세서%'
  const MENU_ID = 'TODO_act_7490M';
  const SELECT_URL = '/mis/act/act0000/getMainBusiPlc.do';
  const INSERT_URL = '/mis/act/act7490/setCreat.do';
  const DELETE_URL = '/mis/act/act7490/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=ROW_NO | SELECT=/mis/act/act0000/getMainBusiPlc.do; INSERT=/mis/act/act7490/setCreat.do; DELETE=/mis/act/act7490/delData.do
  test.skip('[no:1] 영세율매출명세서 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기타소득자등록 (act_7610M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7610M' OR MNU_NM LIKE '기타소득자등록%'
  const MENU_ID = 'TODO_act_7610M';
  const SELECT_URL = '/mis/act/act7610/getList.do';
  const INSERT_URL = '/mis/act/act7610/setData.do';
  const DELETE_URL = '/mis/act/act7610/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RES_NO | SELECT=/mis/act/act7610/getList.do; INSERT=/mis/act/act7610/setData.do; DELETE=/mis/act/act7610/delData.do
  test.skip('[no:1] 기타소득자등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사업소득자등록 (act_7810M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_7810M' OR MNU_NM LIKE '사업소득자등록%'
  const MENU_ID = 'TODO_act_7810M';
  const SELECT_URL = '/mis/act/act7810/getList.do';
  const INSERT_URL = '/mis/act/act7810/setData.do';
  const DELETE_URL = '/mis/act/act7810/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RES_NO | SELECT=/mis/act/act7810/getList.do; INSERT=/mis/act/act7810/setData.do; DELETE=/mis/act/act7810/delData.do
  test.skip('[no:1] 사업소득자등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('마감 (act_9040M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_9040M' OR MNU_NM LIKE '마감%'
  const MENU_ID = 'TODO_act_9040M';
  const SELECT_URL = '/mis/act/act0000/getConf.do';
  const INSERT_URL = '/mis/act/act9040/setData.do';
  const DELETE_URL = '/mis/act/act9040/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SEQ_NO | SELECT=/mis/act/act0000/getConf.do; INSERT=/mis/act/act9040/setData.do; DELETE=/mis/act/act9040/delData.do
  test.skip('[no:1] 마감 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('거래처등록/변경신청 (act_91011M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_91011M' OR MNU_NM LIKE '거래처등록/변경신청%'
  const MENU_ID = 'TODO_act_91011M';
  const SELECT_URL = '/mis/act/act91011/getList.do';
  const INSERT_URL = '/mis/act/act91011/getLoadDtl.do';
  const DELETE_URL = '/mis/act/act91011/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/act/act91011/getList.do; INSERT=/mis/act/act91011/getLoadDtl.do; DELETE=/mis/act/act91011/delData.do
  test.skip('[no:1] 거래처등록/변경신청 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지출발의 (act_92011M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92011M' OR MNU_NM LIKE '지출발의%'
  const MENU_ID = 'TODO_act_92011M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act92011/setData.do';
  const DELETE_URL = '/mis/act/act92011/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RESL_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act92011/setData.do; DELETE=/mis/act/act92011/delData.do
  test.skip('[no:1] 지출발의 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('수입발의 (act_92021M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92021M' OR MNU_NM LIKE '수입발의%'
  const MENU_ID = 'TODO_act_92021M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/act/act92021/setData.do';
  const DELETE_URL = '/mis/act/act92021/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RESL_NO | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/act/act92021/setData.do; DELETE=/mis/act/act92021/delData.do
  test.skip('[no:1] 수입발의 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('미결대체발의 (act_92031M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92031M' OR MNU_NM LIKE '미결대체발의%'
  const MENU_ID = 'TODO_act_92031M';
  const SELECT_URL = '/mis/act/act0000/getUnt.do';
  const INSERT_URL = '/mis/act/act92031/setData.do';
  const DELETE_URL = '/mis/act/act92031/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RESL_NO | SELECT=/mis/act/act0000/getUnt.do; INSERT=/mis/act/act92031/setData.do; DELETE=/mis/act/act92031/delData.do
  test.skip('[no:1] 미결대체발의 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계정대체발의 (act_92041M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92041M' OR MNU_NM LIKE '계정대체발의%'
  const MENU_ID = 'TODO_act_92041M';
  const SELECT_URL = '/mis/act/act0000/getUnt.do';
  const INSERT_URL = '/mis/act/act92041/setData.do';
  const DELETE_URL = '/mis/act/act92041/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RESL_NO | SELECT=/mis/act/act0000/getUnt.do; INSERT=/mis/act/act92041/setData.do; DELETE=/mis/act/act92041/delData.do
  test.skip('[no:1] 계정대체발의 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('회의록등록 (act_92071M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92071M' OR MNU_NM LIKE '회의록등록%'
  const MENU_ID = 'TODO_act_92071M';
  const SELECT_URL = '/mis/act/act92071/getData.do';
  const INSERT_URL = '/mis/act/act92071/setData.do';
  const DELETE_URL = '/mis/act/act92071/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/act/act92071/getData.do; INSERT=/mis/act/act92071/setData.do; DELETE=/mis/act/act92071/delData.do
  test.skip('[no:1] 회의록등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('결의등록 (act_92511M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_92511M' OR MNU_NM LIKE '결의등록%'
  const MENU_ID = 'TODO_act_92511M';
  const SELECT_URL = '/mis/act/act0000/getUnt.do';
  const INSERT_URL = '/mis/act/act92511/setData.do';
  const DELETE_URL = '/mis/act/act92511/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SLIP_NO | SELECT=/mis/act/act0000/getUnt.do; INSERT=/mis/act/act92511/setData.do; DELETE=/mis/act/act92511/delData.do
  test.skip('[no:1] 결의등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('결산자료등록 (act_94020M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_94020M' OR MNU_NM LIKE '결산자료등록%'
  const MENU_ID = 'TODO_act_94020M';
  const SELECT_URL = '/mis/act/act94020/getList.do';
  const INSERT_URL = '/mis/act/act94020/setData.do';
  const DELETE_URL = '/mis/act/act94020/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SBMT_ID | SELECT=/mis/act/act94020/getList.do; INSERT=/mis/act/act94020/setData.do; DELETE=/mis/act/act94020/delData.do
  test.skip('[no:1] 결산자료등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('유가증권등록 (act_95010M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_95010M' OR MNU_NM LIKE '유가증권등록%'
  const MENU_ID = 'TODO_act_95010M';
  const SELECT_URL = '/mis/act/act95010/getList.do';
  const INSERT_URL = '/mis/act/act95010/setData.do';
  const DELETE_URL = '/mis/act/act95010/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=MNG_NO | SELECT=/mis/act/act95010/getList.do; INSERT=/mis/act/act95010/setData.do; DELETE=/mis/act/act95010/delData.do
  test.skip('[no:1] 유가증권등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('어음등록 (act_95020M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_95020M' OR MNU_NM LIKE '어음등록%'
  const MENU_ID = 'TODO_act_95020M';
  const SELECT_URL = '/mis/act/act0000/getBusiPlcInfo.do';
  const INSERT_URL = '/mis/act/act95020/setData.do';
  const DELETE_URL = '/mis/act/act95020/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=NT_NO | SELECT=/mis/act/act0000/getBusiPlcInfo.do; INSERT=/mis/act/act95020/setData.do; DELETE=/mis/act/act95020/delData.do
  test.skip('[no:1] 어음등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('카드신청상세 (act_96011M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_96011M' OR MNU_NM LIKE '카드신청상세%'
  const MENU_ID = 'TODO_act_96011M';
  const SELECT_URL = '/mis/act/act96011/getData.do';
  const INSERT_URL = '/mis/act/act96011/setData.do';
  const DELETE_URL = '/mis/act/act96011/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/act/act96011/getData.do; INSERT=/mis/act/act96011/setData.do; DELETE=/mis/act/act96011/delData.do
  test.skip('[no:1] 카드신청상세 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('전자(세금)계산서발행신청 (act_97021M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'act_97021M' OR MNU_NM LIKE '전자(세금)계산서발행신청%'
  const MENU_ID = 'TODO_act_97021M';
  const SELECT_URL = '/mis/act/act97021/getData.do';
  const INSERT_URL = '/mis/act/act97021/setData.do';
  const DELETE_URL = '/mis/act/act97021/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=TAXBIL_PUBCT_NO | SELECT=/mis/act/act97021/getData.do; INSERT=/mis/act/act97021/setData.do; DELETE=/mis/act/act97021/delData.do
  test.skip('[no:1] 전자(세금)계산서발행신청 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});
