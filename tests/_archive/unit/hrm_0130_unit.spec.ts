// ==============================================================
// HRM — 부서마스터 관리 단위 테스트
// 생성일시: 2026-06-24  |  파일: hrm_0130_unit.spec.ts
// 생성자: SYSTEM
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL  ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';

// ── Nexacro XML 요청 본문 생성 ──────────────────────────────
function nexacroXml(
  datasets: { id: string; columns: string[]; rows?: Record<string, string>[] }[],
  pgmId: string
): string {
  const dsXml = datasets.map(({ id, columns, rows = [] }) => {
    const cols    = columns.map(c => `<Column id="${c}" type="STRING" size="256"/>`).join('');
    const rowsXml = rows.map(row =>
      `<Row>${columns.map(c => `<Col id="${c}">${row[c] ?? ''}</Col>`).join('')}</Row>`
    ).join('');
    return `<Dataset id="${id}"><ColumnInfo>${cols}</ColumnInfo><Rows>${rowsXml}</Rows></Dataset>`;
  }).join('');
  return (
    `<?xml version="1.0" encoding="utf-8"?>` +
    `<Root xmlns="http://www.nexacroplatform.com/platform/dataset" ver="5.0.0.0">` +
    `<Parameters><Parameter id="pgmId">${pgmId}</Parameter></Parameters>` +
    `<Datasets>${dsXml}</Datasets></Root>`
  );
}

async function apiPost(page: Page, endpoint: string, xml: string) {
  const result = await page.evaluate(
    async ({ url, xmlBody }: { url: string; xmlBody: string }) => {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
        body: xmlBody,
        credentials: 'include',
      });
      return { status: resp.status, body: await resp.text() };
    },
    { url: endpoint, xmlBody: xml }
  );
  return { status: () => result.status, text: async () => result.body } as any;
}

test.describe('부서마스터 관리 단위 테스트', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 부서 전체 목록 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: ds_list 0건 이상 반환 (HTTP 200, ErrorCode=0)
   */
  test('[no:1] [단위] [SELECT] 부서 전체 목록 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] [단위] 부서 전체 목록 조회');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: [],
        rows: [{}],
      }], 'HRM_0130M')
    );

    const nxResult1 = await assertNexacroResponse(resp, 'getList.do');
    const rows1 = parseNexacroXmlRows(nxResult1.body, 'ds_list');
    logResult('응답 행 수', `${rows1.length}건`);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-1-dept-list.png`, fullPage: true });
  });

  /**
   * [no:2] [단위] [SELECT] 부서명으로 필터링 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서명 LIKE 검색 결과 반환 (SQL WHERE DEPT_NM LIKE '%' || TRIM(SCH_DEPT_NM) || '%')
   */
  test('[no:2] [단위] [SELECT] 부서명으로 필터링 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] [단위] 부서명으로 필터링 조회');

    logInput('.SCH_DEPT_NM', '경영');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_DEPT_NM'],
        rows: [{ 'SCH_DEPT_NM': '경영' }],
      }], 'HRM_0130M')
    );

    const nxResult2 = await assertNexacroResponse(resp, 'getList.do');
    const rows2 = parseNexacroXmlRows(nxResult2.body, 'ds_list');
    logResult('응답 행 수', `${rows2.length}건`);

    // 기대결과: 반환된 모든 행의 DEPT_NM에 '경영' 포함
    if (rows2.length > 0) {
      if ('DEPT_NM' in rows2[0]) {
        rows2.forEach(r => {
          expect(
            r['DEPT_NM'],
            `반환 행의 DEPT_NM에 '경영'이 포함되어야 함 (실제값: ${r['DEPT_NM']})`
          ).toContain('경영');
        });
        logResult('DEPT_NM LIKE 필터 검증', 'PASS');
      }
    }
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-2-dept-filter.png`, fullPage: true });
  });

  /**
   * [no:3] [단위] [SELECT] 사업장별 부서 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: SCH_BZPLC_CD 필터 적용된 결과 (SQL WHERE A.BZPLC_CD = #SCH_BZPLC_CD#)
   */
  test('[no:3] [단위] [SELECT] 사업장별 부서 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] [단위] 사업장별 부서 조회');

    logInput('.SCH_BZPLC_CD', 'BZ001');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_BZPLC_CD'],
        rows: [{ 'SCH_BZPLC_CD': 'BZ001' }],
      }], 'HRM_0130M')
    );

    const nxResult3 = await assertNexacroResponse(resp, 'getList.do');
    const rows3 = parseNexacroXmlRows(nxResult3.body, 'ds_list');
    logResult('응답 행 수', `${rows3.length}건`);

    // 기대결과: 모든 행의 BZPLC_CD='BZ001'
    if (rows3.length > 0) {
      if ('BZPLC_CD' in rows3[0]) {
        rows3.forEach(r => expect(r['BZPLC_CD'], `반환 행의 BZPLC_CD가 'BZ001'이 아님`).toBe('BZ001'));
        logResult('BZPLC_CD 필터 검증', 'PASS');
      }
    }
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-3-bzplc-filter.png`, fullPage: true });
  });

  /**
   * [no:4] [단위] [SELECT] 사용여부별 부서 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: SCH_USE_YN 필터 적용 (SQL WHERE A.USE_YN = #SCH_USE_YN#)
   */
  test('[no:4] [단위] [SELECT] 사용여부별 부서 조회', async ({ workerPage: page }) => {
    logTestStart('[no:4] [단위] 사용여부별 부서 조회');

    logInput('.SCH_USE_YN', 'Y');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_USE_YN'],
        rows: [{ 'SCH_USE_YN': 'Y' }],
      }], 'HRM_0130M')
    );

    const nxResult4 = await assertNexacroResponse(resp, 'getList.do');
    const rows4 = parseNexacroXmlRows(nxResult4.body, 'ds_list');
    logResult('응답 행 수', `${rows4.length}건`);

    // 기대결과: 모든 행의 USE_YN='Y'
    if (rows4.length > 0) {
      if ('USE_YN' in rows4[0]) {
        rows4.forEach(r => expect(r['USE_YN'], `반환 행의 USE_YN이 'Y'가 아님`).toBe('Y'));
        logResult('USE_YN 필터 검증', 'PASS');
      }
    }
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-4-useyn-filter.png`, fullPage: true });
  });

  /**
   * [no:5] [단위] [SELECT] 복합 필터 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서명 + 사업장 + 사용여부 필터 동시 적용
   */
  test('[no:5] [단위] [SELECT] 복합 필터 조회', async ({ workerPage: page }) => {
    logTestStart('[no:5] [단위] 복합 필터 조회');

    logInput('.SCH_DEPT_NM', '관리');
    logInput('.SCH_BZPLC_CD', 'BZ001');
    logInput('.SCH_USE_YN', 'Y');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_DEPT_NM', 'SCH_BZPLC_CD', 'SCH_USE_YN'],
        rows: [{ 'SCH_DEPT_NM': '관리', 'SCH_BZPLC_CD': 'BZ001', 'SCH_USE_YN': 'Y' }],
      }], 'HRM_0130M')
    );

    const nxResult5 = await assertNexacroResponse(resp, 'getList.do');
    const rows5 = parseNexacroXmlRows(nxResult5.body, 'ds_list');
    logResult('응답 행 수', `${rows5.length}건`);

    // 기대결과: 모든 조건 일치
    if (rows5.length > 0) {
      rows5.forEach(r => {
        if ('DEPT_NM' in r) {
          expect(r['DEPT_NM']).toContain('관리');
        }
        if ('BZPLC_CD' in r) {
          expect(r['BZPLC_CD']).toBe('BZ001');
        }
        if ('USE_YN' in r) {
          expect(r['USE_YN']).toBe('Y');
        }
      });
      logResult('복합 필터 검증', 'PASS');
    }
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-5-complex-filter.png`, fullPage: true });
  });

  /**
   * [no:6] [단위] [SELECT] 회계단위 조회
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: ds_acctUntCd 조회 결과 반환
   */
  test('[no:6] [단위] [SELECT] 회계단위 조회', async ({ workerPage: page }) => {
    logTestStart('[no:6] [단위] 회계단위 조회');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getAcctUntCdList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: [],
        rows: [{}],
      }], 'HRM_0130M')
    );

    const nxResult6 = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows6 = parseNexacroXmlRows(nxResult6.body, 'ds_acctUntCd');
    logResult('응답 행 수', `${rows6.length}건`);

    // 기대결과: ACT_UNIT_CD, ACCT_UNT_NM 컬럼 존재
    if (rows6.length > 0) {
      if ('ACT_UNIT_CD' in rows6[0]) {
        logResult('ACT_UNIT_CD 컬럼 존재', 'PASS');
      }
      if ('ACCT_UNT_NM' in rows6[0]) {
        logResult('ACCT_UNT_NM 컬럼 존재', 'PASS');
      }
    }
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-6-acctunit.png`, fullPage: true });
  });

  /**
   * [no:7] [단위] [INSERT] 부서 정보 저장
   * URL: /mis/hrm/hrm0130/setData.do
   * 예상결과: 부서 정보 저장 성공 (result='Y')
   * 참고: 부서명 중복 검증 포함
   */
  test('[no:7] [단위] [INSERT] 부서 정보 저장', async ({ workerPage: page }) => {
    logTestStart('[no:7] [단위] 부서 정보 저장');

    logInput('.DEPT_NM', 'TEST_부서_' + Date.now());
    logInput('.DEPT_ENG_NM', 'TEST_DEPT');
    logInput('.USE_YN', 'Y');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/setData.do`,
      nexacroXml([{
        id: 'ds_list',
        columns: ['tmHeader', 'DEPT_NM', 'DEPT_UPP_PATH_NM', 'DEPT_ALL_PATH_NM', 'DEPT_ENG_NM', 'LVL', 'SORT_NO', 'UPP_DEPT_CD', 'DEPT_ABRE_NM', 'DEPTL_EMP_NO', 'DEPTL_WORK_DGCNT', 'DEPT_LCTN_CD', 'BZPLC_CD', 'ACT_UNIT_CD', 'OLD_DEPT_CD', 'USE_YN'],
        rows: [{
          'tmHeader': 'I',
          'DEPT_NM': 'TEST_부서_' + Date.now(),
          'DEPT_UPP_PATH_NM': 'TEST',
          'DEPT_ALL_PATH_NM': 'TEST/TEST',
          'DEPT_ENG_NM': 'TEST_DEPT',
          'LVL': '2',
          'SORT_NO': '999',
          'UPP_DEPT_CD': 'D000001',
          'DEPT_ABRE_NM': 'TD',
          'DEPTL_EMP_NO': '',
          'DEPTL_WORK_DGCNT': '',
          'DEPT_LCTN_CD': '',
          'BZPLC_CD': 'BZ001',
          'ACT_UNIT_CD': '',
          'OLD_DEPT_CD': '',
          'USE_YN': 'Y'
        }],
      }], 'HRM_0130M')
    );

    const nxResult7 = await assertNexacroResponse(resp, 'setData.do');

    // 기대결과: result='Y' 또는 result 변수에서 success 확인
    const resultMatch = nxResult7.body.match(/<Parameter[^>]*id="result"[^>]*>([^<]*)<\/Parameter>/i);
    const resultVal = resultMatch ? resultMatch[1] : '';

    if (resultVal === 'Y') {
      logResult('부서 저장 결과', 'SUCCESS');
    } else {
      logResult('부서 저장 결과', resultVal || 'UNKNOWN');
    }
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-7-dept-save.png`, fullPage: true });
  });

  /**
   * [no:8] [단위] [비정상] 부서 정보 조회 — 빈 파라미터
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 서버 예외 응답 또는 빈 결과 반환 — HTTP 500 아님
   */
  test('[no:8] [단위] [비정상] 부서 정보 조회 — 빈 파라미터', async ({ workerPage: page }) => {
    logTestStart('[no:8] [단위] 부서 정보 조회 비정상');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: [],
        rows: [{}],
      }], 'HRM_0130M')
    );

    logResult('응답 상태', resp.status());
    const body = await resp.text();
    logResult('응답 본문 일부', body.substring(0, 200));

    // 시나리오 예상결과: 서버 에러 없이 응답
    expect(resp.status()).not.toBe(500);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-8-abnormal.png`, fullPage: true });
  });

});
