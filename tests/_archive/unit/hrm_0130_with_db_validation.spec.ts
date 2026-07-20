// ==============================================================
// HRM_0130 — 부서마스터 관리 (DB 검증 포함)
// 생성일시: 2026-06-24  |  파일: hrm_0130_with_db_validation.spec.ts
// 생성자: SYSTEM
// ★ 핵심: API 응답 행 수 = DB 쿼리 결과 count 검증
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import * as oracledb from 'oracledb';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL  ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';

// ── DB 연결 설정 (Oracle) ────────────────────────────────────
const DB_CONFIG = {
  user: process.env.DB_USER ?? (() => { throw new Error('DB credential env var is required'); })(),
  password: process.env.DB_PASSWORD ?? (() => { throw new Error('DB credential env var is required'); })(),
  connectionString: process.env.DB_CONNECTION_STRING ?? (() => { throw new Error('DB_CONNECTION_STRING env var is required'); })(),
};

// ── DB 연결 풀 ──────────────────────────────────────────────
let dbPool: any = null;

async function getDbConnection() {
  if (!dbPool) {
    try {
      dbPool = await oracledb.createPool({
        user: DB_CONFIG.user,
        password: DB_CONFIG.password,
        connectString: DB_CONFIG.connectionString,
        poolMin: 1,
        poolMax: 3,
        poolIncrement: 1,
      });
      console.log('✅ DB 연결 풀 생성');
    } catch (err) {
      console.error('❌ DB 연결 실패:', err);
      throw err;
    }
  }
  return await dbPool.getConnection();
}

async function queryDb(sql: string, params?: any[]): Promise<any[]> {
  const conn = await getDbConnection();
  try {
    const result = await conn.execute(sql, params || [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return result.rows || [];
  } finally {
    await conn.close();
  }
}

async function countDb(sql: string, params?: any[]): Promise<number> {
  const rows = await queryDb(sql, params);
  return rows.length;
}

// ── Nexacro XML 요청 생성 ────────────────────────────────────
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

test.describe('부서마스터 관리 (DB 검증)', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });

  test.afterAll(async () => {
    flushLogs();
    if (dbPool) {
      await dbPool.close();
      console.log('✅ DB 연결 풀 종료');
    }
  });

  /**
   * [no:1] [단위] [SELECT] 부서 전체 목록 조회 (DB 행 수 검증)
   * 검증: API 응답 행 수 = DB 쿼리 결과 행 수
   */
  test('[no:1] 부서 전체 목록 조회 (DB 검증)', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서 전체 목록 조회 — DB 검증');

    // 1단계: API 호출
    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{ id: 'ds_search', columns: [], rows: [{}] }], 'HRM_0130M')
    );

    // 2단계: 응답 검증
    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const apiRows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('API 응답 행 수', `${apiRows.length}건`);

    // 3단계: DB 쿼리 실행 (모든 부서 조회)
    const dbCount = await countDb(`SELECT * FROM HRM_DEPT`);
    logResult('DB 조회 결과', `${dbCount}건`);

    // 4단계: 비교 검증 ★핵심★
    expect(
      apiRows.length,
      `API 응답(${apiRows.length}건)과 DB 결과(${dbCount}건)가 일치하지 않음`
    ).toBe(dbCount);
    logResult('행 수 검증', 'PASS (API = DB)');

    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-1-db-validation.png`, fullPage: true });
  });

  /**
   * [no:2] [단위] [SELECT] 부서명 필터 (DB COUNT 검증)
   * 검증: 부서명='경영' 필터 → API와 DB 결과 행 수 일치
   */
  test('[no:2] 부서명 필터 조회 (DB COUNT 검증)', async ({ workerPage: page }) => {
    logTestStart('[no:2] 부서명 필터 — DB COUNT 검증');

    const searchDeptNm = '경영';
    logInput('.SCH_DEPT_NM', searchDeptNm);

    // 1단계: API 호출
    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_DEPT_NM'],
        rows: [{ 'SCH_DEPT_NM': searchDeptNm }],
      }], 'HRM_0130M')
    );

    // 2단계: 응답 검증
    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const apiRows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('API 응답 행 수', `${apiRows.length}건`);

    // 3단계: DB 쿼리 (같은 필터 적용)
    // SQL: SELECT * FROM HRM_DEPT WHERE DEPT_NM LIKE '%경영%' ORDER BY DEPT_CD
    const dbRows = await queryDb(
      `SELECT DEPT_CD, DEPT_NM, BZPLC_CD, USE_YN
       FROM HRM_DEPT
       WHERE DEPT_NM LIKE '%' || :searchNm || '%'
       ORDER BY DEPT_CD`,
      { searchNm: searchDeptNm }
    );
    logResult('DB 조회 행 수', `${dbRows.length}건`);

    // 4단계: 비교 검증
    expect(apiRows.length, `API(${apiRows.length}) ≠ DB(${dbRows.length})`).toBe(dbRows.length);

    // 5단계: 샘플 데이터 검증 (첫 번째 행이 일치하는지)
    if (apiRows.length > 0 && dbRows.length > 0) {
      expect(apiRows[0]['DEPT_NM']).toContain(searchDeptNm);
      expect(apiRows[0]['DEPT_CD']).toBe(dbRows[0].DEPT_CD);
      logResult('첫 행 데이터 검증', 'PASS (API 데이터 = DB 데이터)');
    }

    logResult('부서명 필터 검증', 'PASS (행 수 + 샘플 데이터)');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-2-db-filter.png`, fullPage: true });
  });

  /**
   * [no:3] [단위] [SELECT] 사업장 필터 (DB COUNT 검증)
   * 검증: 사업장='BZ001' → API와 DB 결과 행 수 + 컬럼값 일치
   */
  test('[no:3] 사업장 필터 조회 (DB COUNT + 컬럼값 검증)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 사업장 필터 — DB 검증');

    const bzplcCd = 'BZ001';
    logInput('.SCH_BZPLC_CD', bzplcCd);

    // 1단계: API 호출
    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_BZPLC_CD'],
        rows: [{ 'SCH_BZPLC_CD': bzplcCd }],
      }], 'HRM_0130M')
    );

    // 2단계: 응답 검증
    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const apiRows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('API 응답 행 수', `${apiRows.length}건`);

    // 3단계: DB 쿼리 (같은 필터)
    const dbRows = await queryDb(
      `SELECT DEPT_CD, DEPT_NM, BZPLC_CD, USE_YN
       FROM HRM_DEPT
       WHERE BZPLC_CD = :bzplcCd
       ORDER BY DEPT_CD`,
      { bzplcCd }
    );
    logResult('DB 조회 행 수', `${dbRows.length}건`);

    // 4단계: 행 수 검증
    expect(apiRows.length, `API(${apiRows.length}) ≠ DB(${dbRows.length})`).toBe(dbRows.length);

    // 5단계: 모든 행의 BZPLC_CD 검증
    apiRows.forEach((row, idx) => {
      expect(row['BZPLC_CD']).toBe(bzplcCd);
      expect(row['DEPT_CD']).toBe(dbRows[idx].DEPT_CD);
    });

    logResult('사업장 필터 검증', 'PASS (행 수 + 모든 컬럼값)');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-3-db-bzplc.png`, fullPage: true });
  });

  /**
   * [no:4] [단위] [SELECT] 사용여부 필터 (DB COUNT 검증)
   * 검증: USE_YN='Y' → API와 DB 결과 일치
   */
  test('[no:4] 사용여부 필터 조회 (DB COUNT 검증)', async ({ workerPage: page }) => {
    logTestStart('[no:4] 사용여부 필터 — DB 검증');

    const useYn = 'Y';
    logInput('.SCH_USE_YN', useYn);

    // 1단계: API 호출
    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_USE_YN'],
        rows: [{ 'SCH_USE_YN': useYn }],
      }], 'HRM_0130M')
    );

    // 2단계: 응답 검증
    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const apiRows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('API 응답 행 수', `${apiRows.length}건`);

    // 3단계: DB 쿼리
    const dbRows = await queryDb(
      `SELECT DEPT_CD, USE_YN FROM HRM_DEPT WHERE USE_YN = :useYn ORDER BY DEPT_CD`,
      { useYn }
    );
    logResult('DB 조회 행 수', `${dbRows.length}건`);

    // 4단계: 비교 검증
    expect(apiRows.length).toBe(dbRows.length);
    apiRows.forEach(row => {
      expect(row['USE_YN']).toBe(useYn);
    });

    logResult('사용여부 필터 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-4-db-useyn.png`, fullPage: true });
  });

  /**
   * [no:5] [단위] [SELECT] 복합 필터 (DB COUNT 검증)
   * 검증: 부서명 + 사업장 + 사용여부 필터 조합
   */
  test('[no:5] 복합 필터 조회 (DB 검증)', async ({ workerPage: page }) => {
    logTestStart('[no:5] 복합 필터 — DB 검증');

    const searchDeptNm = '관리';
    const bzplcCd = 'BZ001';
    const useYn = 'Y';

    logInput('.SCH_DEPT_NM', searchDeptNm);
    logInput('.SCH_BZPLC_CD', bzplcCd);
    logInput('.SCH_USE_YN', useYn);

    // 1단계: API 호출
    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_DEPT_NM', 'SCH_BZPLC_CD', 'SCH_USE_YN'],
        rows: [{ 'SCH_DEPT_NM': searchDeptNm, 'SCH_BZPLC_CD': bzplcCd, 'SCH_USE_YN': useYn }],
      }], 'HRM_0130M')
    );

    // 2단계: 응답 검증
    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const apiRows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('API 응답 행 수', `${apiRows.length}건`);

    // 3단계: DB 쿼리 (같은 조건)
    const dbRows = await queryDb(
      `SELECT DEPT_CD, DEPT_NM, BZPLC_CD, USE_YN
       FROM HRM_DEPT
       WHERE DEPT_NM LIKE '%' || :deptNm || '%'
         AND BZPLC_CD = :bzplcCd
         AND USE_YN = :useYn
       ORDER BY DEPT_CD`,
      { deptNm: searchDeptNm, bzplcCd, useYn }
    );
    logResult('DB 조회 행 수', `${dbRows.length}건`);

    // 4단계: 행 수 검증
    expect(apiRows.length).toBe(dbRows.length);

    // 5단계: 각 행 검증
    apiRows.forEach((row, idx) => {
      expect(row['DEPT_NM']).toContain(searchDeptNm);
      expect(row['BZPLC_CD']).toBe(bzplcCd);
      expect(row['USE_YN']).toBe(useYn);
      expect(row['DEPT_CD']).toBe(dbRows[idx].DEPT_CD);
    });

    logResult('복합 필터 검증', 'PASS (행 수 + 모든 조건)');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-5-db-complex.png`, fullPage: true });
  });

});
