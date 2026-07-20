// ==============================================================
// PUR 모듈 배치 통합 테스트 — 생성일 2026-06-26
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

test.describe('구매요구(내자) (pur_0111m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0111m' OR MNU_NM LIKE '구매요구(내자)%'
  const MENU_ID = 'TODO_pur_0111m';
  const SELECT_URL = '/mis/pur/pur0111/getData.do';
  const INSERT_URL = '/mis/pur/pur0111/setData.do';
  const DELETE_URL = '/mis/pur/pur0111/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/pur/pur0111/getData.do; INSERT=/mis/pur/pur0111/setData.do; DELETE=/mis/pur/pur0111/delData.do
  test.skip('[no:1] 구매요구(내자) - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매요구(일반) (pur_0112m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0112m' OR MNU_NM LIKE '구매요구(일반)%'
  const MENU_ID = 'TODO_pur_0112m';
  const SELECT_URL = '/mis/pur/pur0112/getData.do';
  const INSERT_URL = '/mis/pur/pur0112/setData.do';
  const DELETE_URL = '/mis/pur/pur0112/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/pur/pur0112/getData.do; INSERT=/mis/pur/pur0112/setData.do; DELETE=/mis/pur/pur0112/delData.do
  test.skip('[no:1] 구매요구(일반) - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매요구(외자) (pur_0121m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0121m' OR MNU_NM LIKE '구매요구(외자)%'
  const MENU_ID = 'TODO_pur_0121m';
  const SELECT_URL = '/mis/pur/pur0121/getData.do';
  const INSERT_URL = '/mis/pur/pur0121/setData.do';
  const DELETE_URL = '/mis/pur/pur0121/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/pur/pur0121/getData.do; INSERT=/mis/pur/pur0121/setData.do; DELETE=/mis/pur/pur0121/delData.do
  test.skip('[no:1] 구매요구(외자) - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계속계약요구신청 (pur_0141m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0141m' OR MNU_NM LIKE '계속계약요구신청%'
  const MENU_ID = 'TODO_pur_0141m';
  const SELECT_URL = '/mis/pur/pur0141/getData.do';
  const INSERT_URL = '/mis/pur/pur0141/setData.do';
  const DELETE_URL = '/mis/pur/pur0141/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/pur/pur0141/getData.do; INSERT=/mis/pur/pur0141/setData.do; DELETE=/mis/pur/pur0141/delData.do
  test.skip('[no:1] 계속계약요구신청 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계약변경(해지)등록 (pur_0151m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0151m' OR MNU_NM LIKE '계약변경(해지)등록%'
  const MENU_ID = 'TODO_pur_0151m';
  const SELECT_URL = '/mis/pur/pur0151/getData.do';
  const INSERT_URL = '/mis/pur/pur0151/setData.do';
  const DELETE_URL = '/mis/pur/pur0151/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/pur/pur0151/getData.do; INSERT=/mis/pur/pur0151/setData.do; DELETE=/mis/pur/pur0151/delData.do
  test.skip('[no:1] 계약변경(해지)등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('예산변경 (pur_0153m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0153m' OR MNU_NM LIKE '예산변경%'
  const MENU_ID = 'TODO_pur_0153m';
  const SELECT_URL = '/mis/pur/pur0153/getData.do';
  const INSERT_URL = '/mis/pur/pur0153/setData.do';
  const DELETE_URL = '/mis/pur/pur0153/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/pur/pur0153/getData.do; INSERT=/mis/pur/pur0153/setData.do; DELETE=/mis/pur/pur0153/delData.do
  test.skip('[no:1] 예산변경 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매품의 (pur_0211m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0211m' OR MNU_NM LIKE '구매품의%'
  const MENU_ID = 'TODO_pur_0211m';
  const SELECT_URL = '/mis/pur/pur0211/getRgstList.do';
  const INSERT_URL = '/mis/pur/pur0211/setCancel.do';
  const DELETE_URL = '';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RGST_NO | SELECT=/mis/pur/pur0211/getRgstList.do; INSERT=/mis/pur/pur0211/setCancel.do
  test.skip('[no:1] 구매품의 - 저장 후 결재상신 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('계약등록 (pur_0311m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0311m' OR MNU_NM LIKE '계약등록%'
  const MENU_ID = 'TODO_pur_0311m';
  const SELECT_URL = '/mis/pur/pur0311/getData.do';
  const INSERT_URL = '/mis/pur/pur0311/setData.do';
  const DELETE_URL = '/mis/pur/pur0311/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=CTRCT_NO | SELECT=/mis/pur/pur0311/getData.do; INSERT=/mis/pur/pur0311/setData.do; DELETE=/mis/pur/pur0311/delData.do
  test.skip('[no:1] 계약등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매계약(외자) (pur_0321m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0321m' OR MNU_NM LIKE '구매계약(외자)%'
  const MENU_ID = 'TODO_pur_0321m';
  const SELECT_URL = '/mis/pur/pur0321/getData.do';
  const INSERT_URL = '/mis/pur/pur0321/setData.do';
  const DELETE_URL = '/mis/pur/pur0321/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=CTRCT_NO | SELECT=/mis/pur/pur0321/getData.do; INSERT=/mis/pur/pur0321/setData.do; DELETE=/mis/pur/pur0321/delData.do
  test.skip('[no:1] 구매계약(외자) - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('검수등록 (pur_0411m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0411m' OR MNU_NM LIKE '검수등록%'
  const MENU_ID = 'TODO_pur_0411m';
  const SELECT_URL = '/mis/pur/pur0411/getData.do';
  const INSERT_URL = '/mis/pur/pur0411/setExmntData.do';
  const DELETE_URL = '/mis/pur/pur0411/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=EXMNT_NO | SELECT=/mis/pur/pur0411/getData.do; INSERT=/mis/pur/pur0411/setExmntData.do; DELETE=/mis/pur/pur0411/delData.do
  test.skip('[no:1] 검수등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기성/완료 검사조서 (pur_0431m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0431m' OR MNU_NM LIKE '기성/완료 검사조서%'
  const MENU_ID = 'TODO_pur_0431m';
  const SELECT_URL = '/mis/pur/pur0431/getList.do';
  const INSERT_URL = '/mis/pur/pur0431/setExmntData.do';
  const DELETE_URL = '/mis/pur/pur0431/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=CTRCT_NO | SELECT=/mis/pur/pur0431/getList.do; INSERT=/mis/pur/pur0431/setExmntData.do; DELETE=/mis/pur/pur0431/delData.do
  test.skip('[no:1] 기성/완료 검사조서 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('대금지급신청 (pur_0521m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0521m' OR MNU_NM LIKE '대금지급신청%'
  const MENU_ID = 'TODO_pur_0521m';
  const SELECT_URL = '/mis/pur/pur0521/getSchParams.do';
  const INSERT_URL = '/mis/pur/pur0521/setChangeCtrl.do';
  const DELETE_URL = '/mis/pur/pur0521/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=PMT_RQST_NO | SELECT=/mis/pur/pur0521/getSchParams.do; INSERT=/mis/pur/pur0521/setChangeCtrl.do; DELETE=/mis/pur/pur0521/delData.do
  test.skip('[no:1] 대금지급신청 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('구매미지급 관리 (pur_0591m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0591m' OR MNU_NM LIKE '구매미지급 관리%'
  const MENU_ID = 'TODO_pur_0591m';
  const SELECT_URL = '/mis/pur/pur0591/getList.do';
  const INSERT_URL = '/mis/pur/pur0591/setData.do';
  const DELETE_URL = '/mis/pur/pur0591/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SCH_RQST_SDT | SELECT=/mis/pur/pur0591/getList.do; INSERT=/mis/pur/pur0591/setData.do; DELETE=/mis/pur/pur0591/delData.do
  test.skip('[no:1] 구매미지급 관리 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('입찰공고등록 (pur_0611m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0611m' OR MNU_NM LIKE '입찰공고등록%'
  const MENU_ID = 'TODO_pur_0611m';
  const SELECT_URL = '/mis/pur/pur0611/getData.do';
  const INSERT_URL = '/mis/pur/pur0611/setData.do';
  const DELETE_URL = '/mis/pur/pur0611/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RGST_NO | SELECT=/mis/pur/pur0611/getData.do; INSERT=/mis/pur/pur0611/setData.do; DELETE=/mis/pur/pur0611/delData.do
  test.skip('[no:1] 입찰공고등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('입찰공고등록(외자) (pur_0612m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0612m' OR MNU_NM LIKE '입찰공고등록(외자)%'
  const MENU_ID = 'TODO_pur_0612m';
  const SELECT_URL = '/mis/pur/pur0111/getData.do';
  const INSERT_URL = '/mis/pur/pur0111/setData.do';
  const DELETE_URL = '/mis/pur/pur0111/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/pur/pur0111/getData.do; INSERT=/mis/pur/pur0111/setData.do; DELETE=/mis/pur/pur0111/delData.do
  test.skip('[no:1] 입찰공고등록(외자) - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('수의시담등록 (pur_0711m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0711m' OR MNU_NM LIKE '수의시담등록%'
  const MENU_ID = 'TODO_pur_0711m';
  const SELECT_URL = '/mis/pur/pur0711/getData.do';
  const INSERT_URL = '/mis/pur/pur0711/setAccp.do';
  const DELETE_URL = '/mis/pur/pur0711/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/pur/pur0711/getData.do; INSERT=/mis/pur/pur0711/setAccp.do; DELETE=/mis/pur/pur0711/delData.do
  test.skip('[no:1] 수의시담등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('수의시담등록(외자) (pur_0712m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0712m' OR MNU_NM LIKE '수의시담등록(외자)%'
  const MENU_ID = 'TODO_pur_0712m';
  const SELECT_URL = '/mis/pur/pur0111/getData.do';
  const INSERT_URL = '/mis/pur/pur0111/setData.do';
  const DELETE_URL = '/mis/pur/pur0111/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/pur/pur0111/getData.do; INSERT=/mis/pur/pur0111/setData.do; DELETE=/mis/pur/pur0111/delData.do
  test.skip('[no:1] 수의시담등록(외자) - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('직접구매요구신청 (pur_0911m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_0911m' OR MNU_NM LIKE '직접구매요구신청%'
  const MENU_ID = 'TODO_pur_0911m';
  const SELECT_URL = '/mis/pur/pur0911/getSchParams.do';
  const INSERT_URL = '/mis/pur/pur0911/setCheapData.do';
  const DELETE_URL = '/mis/pur/pur0911/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=CHEAP_RQST_NO | SELECT=/mis/pur/pur0911/getSchParams.do; INSERT=/mis/pur/pur0911/setCheapData.do; DELETE=/mis/pur/pur0911/delData.do
  test.skip('[no:1] 직접구매요구신청 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO검수 (pur_1250m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_1250m' OR MNU_NM LIKE 'MRO검수%'
  const MENU_ID = 'TODO_pur_1250m';
  const SELECT_URL = '/mis/pur/pur1270007/getMroRqstMst.do';
  const INSERT_URL = '/mis/pur/pur1270007/save.do';
  const DELETE_URL = '/mis/pur/pur1270007/delete.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=MRO_RQST_NO | SELECT=/mis/pur/pur1270007/getMroRqstMst.do; INSERT=/mis/pur/pur1270007/save.do; DELETE=/mis/pur/pur1270007/delete.do
  test.skip('[no:1] MRO검수 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO구매취소신청서 (pur_1270m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_1270m' OR MNU_NM LIKE 'MRO구매취소신청서%'
  const MENU_ID = 'TODO_pur_1270m';
  const SELECT_URL = '/mis/pur/pur1270007/getMroRqstMst.do';
  const INSERT_URL = '/mis/pur/pur1270007/save.do';
  const DELETE_URL = '/mis/pur/pur1270007/delete.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=MRO_RQST_NO | SELECT=/mis/pur/pur1270007/getMroRqstMst.do; INSERT=/mis/pur/pur1270007/save.do; DELETE=/mis/pur/pur1270007/delete.do
  test.skip('[no:1] MRO구매취소신청서 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('pur_1350M (pur_1350m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_1350m' OR MNU_NM LIKE 'pur_1350M%'
  const MENU_ID = 'TODO_pur_1350m';
  const SELECT_URL = '/mis/pur/pur1350007/getMroRqstMst.do';
  const INSERT_URL = '/mis/pur/pur1350007/save.do';
  const DELETE_URL = '/mis/pur/pur1350007/tmDelete.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=MRO_RQST_NO | SELECT=/mis/pur/pur1350007/getMroRqstMst.do; INSERT=/mis/pur/pur1350007/save.do; DELETE=/mis/pur/pur1350007/tmDelete.do
  test.skip('[no:1] pur_1350M - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO 구매요구신청 (pur_5115m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_5115m' OR MNU_NM LIKE 'MRO 구매요구신청%'
  const MENU_ID = 'TODO_pur_5115m';
  const SELECT_URL = '/mis/pur/pur5115/getData.do';
  const INSERT_URL = '/mis/pur/pur5115/setData.do';
  const DELETE_URL = '/mis/pur/pur5115/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=MRO_RQST_NO | SELECT=/mis/pur/pur5115/getData.do; INSERT=/mis/pur/pur5115/setData.do; DELETE=/mis/pur/pur5115/delData.do
  test.skip('[no:1] MRO 구매요구신청 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO 검수 및 대금지급신청 (pur_5135m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_5135m' OR MNU_NM LIKE 'MRO 검수 및 대금지급신청%'
  const MENU_ID = 'TODO_pur_5135m';
  const SELECT_URL = '/mis/pur/pur5135/getSchParams.do';
  const INSERT_URL = '/mis/pur/pur5135/setData.do';
  const DELETE_URL = '/mis/pur/pur5135/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=PYMNT_RQST_NO | SELECT=/mis/pur/pur5135/getSchParams.do; INSERT=/mis/pur/pur5135/setData.do; DELETE=/mis/pur/pur5135/delData.do
  test.skip('[no:1] MRO 검수 및 대금지급신청 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('MRO 상품 계약/변경 요구 (pur_5145m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_5145m' OR MNU_NM LIKE 'MRO 상품 계약/변경 요구%'
  const MENU_ID = 'TODO_pur_5145m';
  const SELECT_URL = '/mis/pur/pur5145/getData.do';
  const INSERT_URL = '/mis/pur/pur5145/setData.do';
  const DELETE_URL = '/mis/pur/pur5145/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=MRO_PRODUCT_RQST_NO | SELECT=/mis/pur/pur5145/getData.do; INSERT=/mis/pur/pur5145/setData.do; DELETE=/mis/pur/pur5145/delData.do
  test.skip('[no:1] MRO 상품 계약/변경 요구 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('규격입찰결과등록 (pur_8011m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8011m' OR MNU_NM LIKE '규격입찰결과등록%'
  const MENU_ID = 'TODO_pur_8011m';
  const SELECT_URL = '/mis/pur/pur8011/getData.do';
  const INSERT_URL = '/mis/pur/pur8011/setAccp.do';
  const DELETE_URL = '/mis/pur/pur8011/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/pur/pur8011/getData.do; INSERT=/mis/pur/pur8011/setAccp.do; DELETE=/mis/pur/pur8011/delData.do
  test.skip('[no:1] 규격입찰결과등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('규격입찰결과등록(외자) (pur_8012m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8012m' OR MNU_NM LIKE '규격입찰결과등록(외자)%'
  const MENU_ID = 'TODO_pur_8012m';
  const SELECT_URL = '/mis/pur/pur0111/getData.do';
  const INSERT_URL = '/mis/pur/pur0111/setData.do';
  const DELETE_URL = '/mis/pur/pur0111/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/pur/pur0111/getData.do; INSERT=/mis/pur/pur0111/setData.do; DELETE=/mis/pur/pur0111/delData.do
  test.skip('[no:1] 규격입찰결과등록(외자) - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개찰결과등록 (pur_8021m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8021m' OR MNU_NM LIKE '개찰결과등록%'
  const MENU_ID = 'TODO_pur_8021m';
  const SELECT_URL = '/mis/pur/pur8021/getData.do';
  const INSERT_URL = '/mis/pur/pur8021/setAccp.do';
  const DELETE_URL = '/mis/pur/pur8021/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/pur/pur8021/getData.do; INSERT=/mis/pur/pur8021/setAccp.do; DELETE=/mis/pur/pur8021/delData.do
  test.skip('[no:1] 개찰결과등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('개찰결과등록(외자) (pur_8022m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8022m' OR MNU_NM LIKE '개찰결과등록(외자)%'
  const MENU_ID = 'TODO_pur_8022m';
  const SELECT_URL = '/mis/pur/pur0111/getData.do';
  const INSERT_URL = '/mis/pur/pur0111/setData.do';
  const DELETE_URL = '/mis/pur/pur0111/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/pur/pur0111/getData.do; INSERT=/mis/pur/pur0111/setData.do; DELETE=/mis/pur/pur0111/delData.do
  test.skip('[no:1] 개찰결과등록(외자) - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('학술연구용품신청 (pur_8031m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8031m' OR MNU_NM LIKE '학술연구용품신청%'
  const MENU_ID = 'TODO_pur_8031m';
  const SELECT_URL = '/mis/pur/pur8031/getData.do';
  const INSERT_URL = '/mis/pur/pur8031/setData.do';
  const DELETE_URL = '/mis/pur/pur8031/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=SCHLR_NO | SELECT=/mis/pur/pur8031/getData.do; INSERT=/mis/pur/pur8031/setData.do; DELETE=/mis/pur/pur8031/delData.do
  test.skip('[no:1] 학술연구용품신청 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('예정가격조사등록 (pur_8041m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8041m' OR MNU_NM LIKE '예정가격조사등록%'
  const MENU_ID = 'TODO_pur_8041m';
  const SELECT_URL = '/mis/pur/pur8041/getData.do';
  const INSERT_URL = '/mis/pur/pur8041/setAccp.do';
  const DELETE_URL = '/mis/pur/pur8041/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=PCEM_NO | SELECT=/mis/pur/pur8041/getData.do; INSERT=/mis/pur/pur8041/setAccp.do; DELETE=/mis/pur/pur8041/delData.do
  test.skip('[no:1] 예정가격조사등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('예정가격신청(외자) (pur_8042m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8042m' OR MNU_NM LIKE '예정가격신청(외자)%'
  const MENU_ID = 'TODO_pur_8042m';
  const SELECT_URL = '/mis/pur/pur0111/getData.do';
  const INSERT_URL = '/mis/pur/pur0111/setData.do';
  const DELETE_URL = '/mis/pur/pur0111/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RQST_NO | SELECT=/mis/pur/pur0111/getData.do; INSERT=/mis/pur/pur0111/setData.do; DELETE=/mis/pur/pur0111/delData.do
  test.skip('[no:1] 예정가격신청(외자) - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('사전규격결과등록 (pur_8051m) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pur_8051m' OR MNU_NM LIKE '사전규격결과등록%'
  const MENU_ID = 'TODO_pur_8051m';
  const SELECT_URL = '/mis/pur/pur8051/getData.do';
  const INSERT_URL = '/mis/pur/pur8051/setAccp.do';
  const DELETE_URL = '/mis/pur/pur8051/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=RGST_NO | SELECT=/mis/pur/pur8051/getData.do; INSERT=/mis/pur/pur8051/setAccp.do; DELETE=/mis/pur/pur8051/delData.do
  test.skip('[no:1] 사전규격결과등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

