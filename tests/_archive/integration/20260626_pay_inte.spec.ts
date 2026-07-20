// ==============================================================
// PAY(급여관리) 모듈 배치 UI 통합 테스트 — 생성일 2026-06-28
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


test.describe('간이세액조견표 (pay_0000M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_0000M' OR MNU_NM LIKE '간이세액조견표%'
  const MENU_ID = 'TODO_pay_0000M';
  const SELECT_URL = '/mis/pay/pay0000/getMaxYymm.do';
  const INSERT_URL = '/mis/pay/pay0000/setData.do';
  const DELETE_URL = '/mis/pay/pay0000/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/pay/pay0000/getMaxYymm.do; INSERT=/mis/pay/pay0000/setData.do; DELETE=/mis/pay/pay0000/delData.do
  test.skip('[no:1] 간이세액조견표 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('기타세율기준관리 (pay_0010M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_0010M' OR MNU_NM LIKE '기타세율기준관리%'
  const MENU_ID = 'TODO_pay_0010M';
  const SELECT_URL = '/mis/pay/pay0010/getMaxYymm.do';
  const INSERT_URL = '/mis/pay/pay0010/setData.do';
  const DELETE_URL = '/mis/pay/pay0010/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/pay/pay0010/getMaxYymm.do; INSERT=/mis/pay/pay0010/setData.do; DELETE=/mis/pay/pay0010/delData.do
  test.skip('[no:1] 기타세율기준관리 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('급여대장항목관리 (pay_1090M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_1090M' OR MNU_NM LIKE '급여대장항목관리%'
  const MENU_ID = 'TODO_pay_1090M';
  const SELECT_URL = '/mis/pay/pay1090/getData.do';
  const INSERT_URL = '/mis/pay/pay1090/getreset.do';
  const DELETE_URL = '/mis/pay/pay1090/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/pay/pay1090/getData.do; INSERT=/mis/pay/pay1090/getreset.do; DELETE=/mis/pay/pay1090/delData.do
  test.skip('[no:1] 급여대장항목관리 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('지급대상자관리 (pay_3020M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_3020M' OR MNU_NM LIKE '지급대상자관리%'
  const MENU_ID = 'TODO_pay_3020M';
  const SELECT_URL = '/mis/pay/pay3020/getPmtInfo.do';
  const INSERT_URL = '/mis/pay/pay3020/setData.do';
  const DELETE_URL = '/mis/pay/pay3020/delDeleteAll.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/pay/pay3020/getPmtInfo.do; INSERT=/mis/pay/pay3020/setData.do; DELETE=/mis/pay/pay3020/delDeleteAll.do
  test.skip('[no:1] 지급대상자관리 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('예외분개기준 (pay_4130M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_4130M' OR MNU_NM LIKE '예외분개기준%'
  const MENU_ID = 'TODO_pay_4130M';
  const SELECT_URL = '/mis/pay/pay4130/getEmpList.do';
  const INSERT_URL = '/mis/pay/pay4130/setEmpList.do';
  const DELETE_URL = '/mis/pay/pay4130/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/pay/pay4130/getEmpList.do; INSERT=/mis/pay/pay4130/setEmpList.do; DELETE=/mis/pay/pay4130/delData.do
  test.skip('[no:1] 예외분개기준 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('급여지급결의서 등록 (pay_4151M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_4151M' OR MNU_NM LIKE '급여지급결의서 등록%'
  const MENU_ID = 'TODO_pay_4151M';
  const SELECT_URL = '/mis/act/act0000/getActComm.do';
  const INSERT_URL = '/mis/pay/pay4151/setData.do';
  const DELETE_URL = '/mis/pay/pay4151/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/act/act0000/getActComm.do; INSERT=/mis/pay/pay4151/setData.do; DELETE=/mis/pay/pay4151/delData.do
  test.skip('[no:1] 급여지급결의서 등록 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('정산내역조회 (pay_5021M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5021M' OR MNU_NM LIKE '정산내역조회%'
  const MENU_ID = 'TODO_pay_5021M';
  const SELECT_URL = '/mis/pay/pay5021/getData.do';
  const INSERT_URL = '/mis/pay/pay5021/setData.do';
  const DELETE_URL = '/mis/pay/pay5021/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/pay/pay5021/getData.do; INSERT=/mis/pay/pay5021/setData.do; DELETE=/mis/pay/pay5021/delData.do
  test.skip('[no:1] 정산내역조회 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직연금가입자관리 (pay_5060M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5060M' OR MNU_NM LIKE '퇴직연금가입자관리%'
  const MENU_ID = 'TODO_pay_5060M';
  const SELECT_URL = '/mis/pay/pay5060/getData.do';
  const INSERT_URL = '/mis/pay/pay5060/setData.do';
  const DELETE_URL = '/mis/pay/pay5060/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/pay/pay5060/getData.do; INSERT=/mis/pay/pay5060/setData.do; DELETE=/mis/pay/pay5060/delData.do
  test.skip('[no:1] 퇴직연금가입자관리 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('소급기준관리 (pay_5510M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5510M' OR MNU_NM LIKE '소급기준관리%'
  const MENU_ID = 'TODO_pay_5510M';
  const SELECT_URL = '/mis/pay/pay5510/getRtctNm.do';
  const INSERT_URL = '/mis/pay/pay5510/setData.do';
  const DELETE_URL = '/mis/pay/pay5510/delStdData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/pay/pay5510/getRtctNm.do; INSERT=/mis/pay/pay5510/setData.do; DELETE=/mis/pay/pay5510/delStdData.do
  test.skip('[no:1] 소급기준관리 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('소급지급신청 (pay_5531M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_5531M' OR MNU_NM LIKE '소급지급신청%'
  const MENU_ID = 'TODO_pay_5531M';
  const SELECT_URL = '/mis/pay/pay5531/getData.do';
  const INSERT_URL = '/mis/pay/pay5531/setData.do';
  const DELETE_URL = '/mis/pay/pay5531/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/pay/pay5531/getData.do; INSERT=/mis/pay/pay5531/setData.do; DELETE=/mis/pay/pay5531/delData.do
  test.skip('[no:1] 소급지급신청 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('원천징수동의신청상세 (pay_6411M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6411M' OR MNU_NM LIKE '원천징수동의신청상세%'
  const MENU_ID = 'TODO_pay_6411M';
  const SELECT_URL = '/mis/pay/pay6411/getData.do';
  const INSERT_URL = '/mis/pay/pay6411/setData.do';
  const DELETE_URL = '/mis/pay/pay6411/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/pay/pay6411/getData.do; INSERT=/mis/pay/pay6411/setData.do; DELETE=/mis/pay/pay6411/delData.do
  test.skip('[no:1] 원천징수동의신청상세 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직금중간정산상세 (pay_6511M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6511M' OR MNU_NM LIKE '퇴직금중간정산상세%'
  const MENU_ID = 'TODO_pay_6511M';
  const SELECT_URL = '/mis/pay/pay6511/getEmpInfo.do';
  const INSERT_URL = '/mis/pay/pay6511/setData.do';
  const DELETE_URL = '/mis/pay/pay6511/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/pay/pay6511/getEmpInfo.do; INSERT=/mis/pay/pay6511/setData.do; DELETE=/mis/pay/pay6511/delData.do
  test.skip('[no:1] 퇴직금중간정산상세 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직금중간정산승인상세 (pay_6521M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6521M' OR MNU_NM LIKE '퇴직금중간정산승인상세%'
  const MENU_ID = 'TODO_pay_6521M';
  const SELECT_URL = '/mis/pay/pay6521/getData.do';
  const INSERT_URL = '/mis/pay/pay6521/setData.do';
  const DELETE_URL = '/mis/pay/pay6521/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/pay/pay6521/getData.do; INSERT=/mis/pay/pay6521/setData.do; DELETE=/mis/pay/pay6521/delData.do
  test.skip('[no:1] 퇴직금중간정산승인상세 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직연금신청상세 (pay_6531M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6531M' OR MNU_NM LIKE '퇴직연금신청상세%'
  const MENU_ID = 'TODO_pay_6531M';
  const SELECT_URL = '/mis/pay/pay6531/getEmpInfo.do';
  const INSERT_URL = '/mis/pay/pay6531/setData.do';
  const DELETE_URL = '/mis/pay/pay6531/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/pay/pay6531/getEmpInfo.do; INSERT=/mis/pay/pay6531/setData.do; DELETE=/mis/pay/pay6531/delData.do
  test.skip('[no:1] 퇴직연금신청상세 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});

test.describe('퇴직연금개인부담금상세 (pay_6532M) — UI 통합 테스트', () => {
  // TODO: menuId 미확인 — SYS_MENU_MGT 테이블에서 조회 후 활성화
  // SELECT MNU_ID FROM SYS_MENU_MGT WHERE SRC_FILE_NM = 'pay_6532M' OR MNU_NM LIKE '퇴직연금개인부담금상세%'
  const MENU_ID = 'TODO_pay_6532M';
  const SELECT_URL = '/mis/pay/pay6532/getEmpInfo.do';
  const INSERT_URL = '/mis/pay/pay6532/setData.do';
  const DELETE_URL = '/mis/pay/pay6532/delData.do';
  const RESULT_COLS: string[] = []; // TODO: 출력 컬럼 확인 필요
  const CLEAR_COLS: string[] = []; // TODO: 검색조건 컬럼 확인 필요

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // MULTI 플로우 | sharedKey=KEY | SELECT=/mis/pay/pay6532/getEmpInfo.do; INSERT=/mis/pay/pay6532/setData.do; DELETE=/mis/pay/pay6532/delData.do
  test.skip('[no:1] 퇴직연금개인부담금상세 - 등록→조회→삭제 플로우 (통합) — menuId 미확인', async ({ workerPage: page }) => {
    // menuId 확인 후 INSERT→SELECT(검증)→DELETE 플로우 작성 → test.skip 제거하여 활성화
    void page; void MENU_ID; void SELECT_URL; void INSERT_URL; void DELETE_URL; void RESULT_COLS; void CLEAR_COLS;
  });

});
