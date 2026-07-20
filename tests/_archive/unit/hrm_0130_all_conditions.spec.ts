// ==============================================================
// HRM_0130 — 부서마스터 관리 (모든 검색조건 테스트)
// 생성일시: 2026-06-24  |  파일: hrm_0130_all_conditions.spec.ts
// 생성자: SYSTEM
// ★ 핵심: 각 검색조건별로 모든 조합을 테스트
// Playwright만으로 실행 (DB 접근 없음)
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
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/xml; charset=utf-8' },
          body: xmlBody,
          credentials: 'include',
        });
        return { ok: true as const, status: resp.status, body: await resp.text() };
      } catch (e) {
        return { ok: false as const, status: 0, body: '', error: String(e) };
      }
    },
    { url: endpoint, xmlBody: xml }
  );

  if (!result.ok) {
    throw new Error(`[apiPost] 서버 응답 없음 — ${endpoint}\n원인: ${(result as any).error}`);
  }

  return { status: () => result.status, text: async () => result.body } as any;
}

// ── 검색 결과 분석 함수 ──────────────────────────────────────
interface SearchResult {
  condition: string;     // 검색 조건 설명
  rowCount: number;      // 응답 행 수
  rows: Record<string, string>[];  // 응답 데이터
}

const searchResults: SearchResult[] = [];

test.describe('부서마스터 관리 — 모든 검색조건 테스트', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });

  test.afterAll(async () => {
    // 최종 결과 요약 로깅
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📊 검색조건별 결과 요약');
    console.log('═══════════════════════════════════════════════════════════');
    searchResults.forEach((result, idx) => {
      console.log(`${idx + 1}. ${result.condition.padEnd(40)} → ${result.rowCount}건`);
    });
    console.log('═══════════════════════════════════════════════════════════\n');
    flushLogs();
  });

  /**
   * [no:1] 조건 없음 (전체 부서)
   * 기대: 모든 부서 조회
   */
  test('[no:1] 조건 없음 (전체 부서)', async ({ workerPage: page }) => {
    logTestStart('[no:1] 조건 없음 — 전체 부서 조회');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{ id: 'ds_search', columns: [], rows: [{}] }], 'HRM_0130M')
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');

    logResult('검색조건', '없음 (전체)');
    logResult('응답 행 수', `${rows.length}건`);
    searchResults.push({ condition: '[no:1] 조건 없음 (전체)', rowCount: rows.length, rows });

    expect(rows.length, '전체 조회 시 1건 이상 반환되어야 함 (서버/DB 확인 필요)').toBeGreaterThan(0);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-1-no-condition.png`, fullPage: true });
  });

  /**
   * [no:2] 검색조건: 부서명만 (LIKE 검색)
   * SQL: WHERE DEPT_NM LIKE '%' || TRIM(#SCH_DEPT_NM#) || '%'
   */
  test('[no:2] 부서명만 (LIKE 검색)', async ({ workerPage: page }) => {
    logTestStart('[no:2] 부서명 검색');

    const deptNm = '경영';
    logInput('.SCH_DEPT_NM', deptNm);

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_DEPT_NM'],
        rows: [{ 'SCH_DEPT_NM': deptNm }],
      }], 'HRM_0130M')
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');

    logResult('검색조건', `부서명 LIKE '${deptNm}'`);
    logResult('응답 행 수', `${rows.length}건`);
    searchResults.push({ condition: `[no:2] 부서명='${deptNm}'`, rowCount: rows.length, rows });

    // 검증: 모든 행의 DEPT_NM에 검색어 포함
    rows.forEach((row, idx) => {
      expect(
        row['DEPT_NM'],
        `[행${idx}] DEPT_NM에 '${deptNm}'이 포함되어야 함 (실제: ${row['DEPT_NM']})`
      ).toContain(deptNm);
    });

    expect(rows.length, `부서명 "${deptNm}" 검색 결과 0건 — 서버 응답 없음 또는 테스트 데이터 미존재`).toBeGreaterThan(0);
    logResult('컬럼값 검증', 'PASS (모든 행이 조건 만족)');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-2-dept-name.png`, fullPage: true });
  });

  /**
   * [no:3] 검색조건: 사업장만
   * SQL: WHERE A.BZPLC_CD = #SCH_BZPLC_CD#
   */
  test('[no:3] 사업장만 (SCH_BZPLC_CD)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 사업장 검색');

    const bzplcCd = 'BZ001';
    logInput('.SCH_BZPLC_CD', bzplcCd);

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_BZPLC_CD'],
        rows: [{ 'SCH_BZPLC_CD': bzplcCd }],
      }], 'HRM_0130M')
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');

    logResult('검색조건', `사업장='${bzplcCd}'`);
    logResult('응답 행 수', `${rows.length}건`);
    searchResults.push({ condition: `[no:3] 사업장='${bzplcCd}'`, rowCount: rows.length, rows });

    rows.forEach((row, idx) => {
      expect(row['BZPLC_CD'], `[행${idx}] BZPLC_CD 불일치`).toBe(bzplcCd);
    });

    expect(rows.length, `사업장 "${bzplcCd}" 검색 결과 0건 — 서버 응답 없음 또는 테스트 데이터 미존재`).toBeGreaterThan(0);
    logResult('컬럼값 검증', 'PASS (모든 행의 BZPLC_CD 일치)');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-3-bzplc.png`, fullPage: true });
  });

  /**
   * [no:4] 검색조건: 사용여부만
   * SQL: WHERE A.USE_YN = #SCH_USE_YN#
   */
  test('[no:4] 사용여부만 (USE_YN=Y)', async ({ workerPage: page }) => {
    logTestStart('[no:4] 사용여부 검색');

    const useYn = 'Y';
    logInput('.SCH_USE_YN', useYn);

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_USE_YN'],
        rows: [{ 'SCH_USE_YN': useYn }],
      }], 'HRM_0130M')
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');

    logResult('검색조건', `사용여부='${useYn}'`);
    logResult('응답 행 수', `${rows.length}건`);
    searchResults.push({ condition: `[no:4] 사용여부='${useYn}'`, rowCount: rows.length, rows });

    rows.forEach((row, idx) => {
      expect(row['USE_YN'], `[행${idx}] USE_YN 불일치`).toBe(useYn);
    });

    expect(rows.length, `사용여부 "${useYn}" 검색 결과 0건 — 서버 응답 없음 또는 사용 부서 없음`).toBeGreaterThan(0);
    logResult('컬럼값 검증', 'PASS (모든 행의 USE_YN=Y)');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-4-useyn.png`, fullPage: true });
  });

  /**
   * [no:5] 검색조건: 사용여부=N
   * 기대: [no:4]와 다른 결과 (상호배타적 검증)
   */
  test('[no:5] 사용여부=N (대조군)', async ({ workerPage: page }) => {
    logTestStart('[no:5] 사용여부=N 검색');

    const useYn = 'N';
    logInput('.SCH_USE_YN', useYn);

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_USE_YN'],
        rows: [{ 'SCH_USE_YN': useYn }],
      }], 'HRM_0130M')
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');

    logResult('검색조건', `사용여부='${useYn}'`);
    logResult('응답 행 수', `${rows.length}건`);
    searchResults.push({ condition: `[no:5] 사용여부='${useYn}'`, rowCount: rows.length, rows });

    rows.forEach((row) => {
      expect(row['USE_YN']).toBe(useYn);
    });
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-5-useyn-n.png`, fullPage: true });
  });

  /**
   * [no:6] 검색조건: 부서명 + 사업장
   * SQL: WHERE DEPT_NM LIKE '%관리%' AND BZPLC_CD = 'BZ001'
   */
  test('[no:6] 부서명 + 사업장', async ({ workerPage: page }) => {
    logTestStart('[no:6] 부서명 + 사업장 검색');

    const deptNm = '관리';
    const bzplcCd = 'BZ001';
    logInput('.SCH_DEPT_NM', deptNm);
    logInput('.SCH_BZPLC_CD', bzplcCd);

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_DEPT_NM', 'SCH_BZPLC_CD'],
        rows: [{ 'SCH_DEPT_NM': deptNm, 'SCH_BZPLC_CD': bzplcCd }],
      }], 'HRM_0130M')
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');

    logResult('검색조건', `부서명='${deptNm}' AND 사업장='${bzplcCd}'`);
    logResult('응답 행 수', `${rows.length}건`);
    searchResults.push({
      condition: `[no:6] 부서명='${deptNm}' + 사업장='${bzplcCd}'`,
      rowCount: rows.length,
      rows
    });

    rows.forEach((row, idx) => {
      expect(row['DEPT_NM'], `[행${idx}] DEPT_NM 조건 불만족`).toContain(deptNm);
      expect(row['BZPLC_CD'], `[행${idx}] BZPLC_CD 조건 불만족`).toBe(bzplcCd);
    });

    expect(rows.length, `복합 필터 ("${deptNm}" + "${bzplcCd}") 결과 0건 — 서버 응답 없음 또는 테스트 데이터 미존재`).toBeGreaterThan(0);
    logResult('복합조건 검증', 'PASS (모든 행이 2개 조건 모두 만족)');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-6-combined-1.png`, fullPage: true });
  });

  /**
   * [no:7] 검색조건: 부서명 + 사용여부
   * SQL: WHERE DEPT_NM LIKE '%재무%' AND USE_YN = 'Y'
   */
  test('[no:7] 부서명 + 사용여부', async ({ workerPage: page }) => {
    logTestStart('[no:7] 부서명 + 사용여부 검색');

    const deptNm = '재무';
    const useYn = 'Y';
    logInput('.SCH_DEPT_NM', deptNm);
    logInput('.SCH_USE_YN', useYn);

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_DEPT_NM', 'SCH_USE_YN'],
        rows: [{ 'SCH_DEPT_NM': deptNm, 'SCH_USE_YN': useYn }],
      }], 'HRM_0130M')
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');

    logResult('검색조건', `부서명='${deptNm}' AND 사용여부='${useYn}'`);
    logResult('응답 행 수', `${rows.length}건`);
    searchResults.push({
      condition: `[no:7] 부서명='${deptNm}' + 사용여부='${useYn}'`,
      rowCount: rows.length,
      rows
    });

    expect(rows.length, `복합 필터 ("${deptNm}" + USE_YN="${useYn}") 결과 0건 — 서버 응답 없음 또는 테스트 데이터 미존재`).toBeGreaterThan(0);
    rows.forEach((row, idx) => {
      expect(row['DEPT_NM']).toContain(deptNm);
      expect(row['USE_YN']).toBe(useYn);
    });

    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-7-combined-2.png`, fullPage: true });
  });

  /**
   * [no:8] 검색조건: 사업장 + 사용여부
   * SQL: WHERE BZPLC_CD = 'BZ001' AND USE_YN = 'Y'
   */
  test('[no:8] 사업장 + 사용여부', async ({ workerPage: page }) => {
    logTestStart('[no:8] 사업장 + 사용여부 검색');

    const bzplcCd = 'BZ001';
    const useYn = 'Y';
    logInput('.SCH_BZPLC_CD', bzplcCd);
    logInput('.SCH_USE_YN', useYn);

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_BZPLC_CD', 'SCH_USE_YN'],
        rows: [{ 'SCH_BZPLC_CD': bzplcCd, 'SCH_USE_YN': useYn }],
      }], 'HRM_0130M')
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');

    logResult('검색조건', `사업장='${bzplcCd}' AND 사용여부='${useYn}'`);
    logResult('응답 행 수', `${rows.length}건`);
    searchResults.push({
      condition: `[no:8] 사업장='${bzplcCd}' + 사용여부='${useYn}'`,
      rowCount: rows.length,
      rows
    });

    expect(rows.length, `복합 필터 ("${bzplcCd}" + USE_YN="${useYn}") 결과 0건 — 서버 응답 없음 또는 테스트 데이터 미존재`).toBeGreaterThan(0);
    rows.forEach((row) => {
      expect(row['BZPLC_CD']).toBe(bzplcCd);
      expect(row['USE_YN']).toBe(useYn);
    });

    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-8-combined-3.png`, fullPage: true });
  });

  /**
   * [no:9] 검색조건: 부서명 + 사업장 + 사용여부 (3중 필터)
   * SQL: WHERE DEPT_NM LIKE '%' || TRIM(#SCH_DEPT_NM#) || '%'
   *       AND A.BZPLC_CD = #SCH_BZPLC_CD#
   *       AND A.USE_YN = #SCH_USE_YN#
   */
  test('[no:9] 부서명 + 사업장 + 사용여부 (3중)', async ({ workerPage: page }) => {
    logTestStart('[no:9] 3중 조합 검색');

    const deptNm = '부';
    const bzplcCd = 'BZ001';
    const useYn = 'Y';
    logInput('.SCH_DEPT_NM', deptNm);
    logInput('.SCH_BZPLC_CD', bzplcCd);
    logInput('.SCH_USE_YN', useYn);

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['SCH_DEPT_NM', 'SCH_BZPLC_CD', 'SCH_USE_YN'],
        rows: [{
          'SCH_DEPT_NM': deptNm,
          'SCH_BZPLC_CD': bzplcCd,
          'SCH_USE_YN': useYn
        }],
      }], 'HRM_0130M')
    );

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');

    logResult('검색조건', `부서명='${deptNm}' AND 사업장='${bzplcCd}' AND 사용여부='${useYn}'`);
    logResult('응답 행 수', `${rows.length}건`);
    searchResults.push({
      condition: `[no:9] 부서명='${deptNm}' + 사업장='${bzplcCd}' + 사용여부='${useYn}'`,
      rowCount: rows.length,
      rows
    });

    rows.forEach((row, idx) => {
      expect(row['DEPT_NM'], `[행${idx}] 부서명 미포함`).toContain(deptNm);
      expect(row['BZPLC_CD'], `[행${idx}] 사업장 불일치`).toBe(bzplcCd);
      expect(row['USE_YN'], `[행${idx}] 사용여부 불일치`).toBe(useYn);
    });

    expect(rows.length, `3중 필터 결과 0건 — 서버 응답 없음 또는 테스트 데이터 미존재`).toBeGreaterThan(0);
    logResult('3중 조건 검증', 'PASS (모든 행이 3개 조건 모두 만족)');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-9-triple.png`, fullPage: true });
  });

  /**
   * [no:10] 회계단위 조회
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 기대: ds_acctUntCd 데이터셋 반환
   */
  test('[no:10] 회계단위 조회', async ({ workerPage: page }) => {
    logTestStart('[no:10] 회계단위 조회');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/hrm/hrm0130/getAcctUntCdList.do`,
      nexacroXml([{ id: 'ds_search', columns: [], rows: [{}] }], 'HRM_0130M')
    );

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_acctUntCd');

    logResult('검색조건', '없음 (회계단위 마스터)');
    logResult('응답 행 수', `${rows.length}건`);
    searchResults.push({ condition: '[no:10] 회계단위 조회', rowCount: rows.length, rows });

    expect(rows.length, '회계단위 조회 결과 0건 — 서버 응답 없음 또는 회계단위 마스터 데이터 없음').toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty('ACT_UNIT_CD');
    logResult('컬럼 검증', 'PASS (ACT_UNIT_CD 존재)');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-10-acctunit.png`, fullPage: true });
  });

});
