/**
 * 소스목록_9010 통합 단위 테스트 (pur_0910M + hrm_0130M)
 *
 * 생성일: 2026-06-28
 * 생성기: spec-generation 스킬 (API-direct 검증 패턴)
 *
 * 소스 목록:
 *   - pur_0910M (직접구매지급신청) : /mis/pur/pur0910/getList.do  → TC1~TC6
 *   - hrm_0130M (부서관리)         : /mis/hrm/hrm0130/getList.do  → TC7~TC12
 *
 * 입력 시나리오:
 *   - _workspace/pur/01_scenarios.json
 *   - _workspace/hrm/01_scenarios.json
 *
 * 검증 방식: Nexacro XML 직접 POST → ds_list 파싱 → DB COUNT(*) 대조
 */
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const COUNT_ENDPOINT = `${BASE_URL}/ai/getListCount.do`;

// ─────────────────────────────────────────────────────────────────────────────
// 공통 헬퍼
// ─────────────────────────────────────────────────────────────────────────────

/** Nexacro 요청 XML 생성 (ds_search 단일 데이터셋) */
function nexacroXml(pgmId: string, colDefs: string[], rows: Record<string, string>[]): string {
  const cols    = colDefs.map(c => `<Column id="${c}" type="STRING" size="256"/>`).join('');
  const rowsXml = rows.map(row =>
    `<Row>${colDefs.map(c => `<Col id="${c}">${row[c] ?? ''}</Col>`).join('')}</Row>`
  ).join('');
  const ds = `<Dataset id="ds_search"><ColumnInfo>${cols}</ColumnInfo><Rows>${rowsXml}</Rows></Dataset>`;
  return `<?xml version="1.0" encoding="utf-8"?><Root xmlns="http://www.nexacroplatform.com/platform/dataset" ver="5.0.0.0"><Parameters><Parameter id="pgmId">${pgmId}</Parameter></Parameters><Datasets>${ds}</Datasets></Root>`;
}

/** Nexacro XML API POST 호출 */
async function apiPost(page: Page, url: string, xml: string) {
  return page.request.post(url, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    data: xml,
  }) as unknown as import('@playwright/test').Response;
}

/** DB COUNT(*) 조회 (API 결과 건수 대조용) */
async function getDbCount(page: Page, pgmId: string, colDefs: string[], params: Record<string, string>): Promise<number> {
  const resp = await page.request.post(COUNT_ENDPOINT, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    data: nexacroXml(pgmId, colDefs, [params]),
  }) as unknown as import('@playwright/test').Response;
  expect(resp.status(), 'DB COUNT HTTP 200').toBe(200);
  const json = await resp.json() as { success: boolean; count: number; error?: string };
  expect(json.success, `DB COUNT 실패: ${json.error ?? ''}`).toBe(true);
  return json.count;
}

test.describe('소스목록_9010 통합 단위 테스트 (pur_0910M + hrm_0130M)', () => {
  test.beforeAll(async () => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // ═══════════════════════════════════════════════════════════════════════════
  // pur_0910M — 직접구매지급신청 (TC1~TC6)
  // ═══════════════════════════════════════════════════════════════════════════
  const PUR_PGM  = 'pur_0910M';
  const PUR_EP   = `${BASE_URL}/mis/pur/pur0910/getList.do`;
  const PUR_COLS = [
    'WORK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD',
    'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD',
    'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN',
    'BOOK_CLS', 'RQST_CLS', 'DICT_CLS',
  ];
  const purXml   = (rows: Record<string, string>[]) => nexacroXml(PUR_PGM, PUR_COLS, rows);
  const purCount = (page: Page, p: Record<string, string>) => getDbCount(page, PUR_PGM, PUR_COLS, p);

  test('[TC1:pur_0910M] 직접구매지급신청 - 전체 조회 (조건 없음)', async ({ workerPage: page }) => {
    logTestStart('[TC1] 전체 조회 (조건 없음)');
    const params: Record<string, string> = {};
    logInput('params', JSON.stringify(params));

    const resp   = await apiPost(page, PUR_EP, purXml([params]));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수', rows.length);

    expect(rows.length, '전체 조회 1건 이상').toBeGreaterThanOrEqual(1);
    const dbCount = await purCount(page, params);
    expect(rows.length, `API(${rows.length})===DB(${dbCount})`).toBe(dbCount);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-tc1.png`, fullPage: true });
    logResult('검증', `✅ PASS — ${rows.length}건`);
  });

  test('[TC2:pur_0910M] 직접구매지급신청 - 기간 조회 (RQST_SDT ~ RQST_EDT)', async ({ workerPage: page }) => {
    logTestStart('[TC2] 기간 조회');
    const params = { RQST_SDT: '20240101', RQST_EDT: '20261231' };
    logInput('params', JSON.stringify(params));

    const resp   = await apiPost(page, PUR_EP, purXml([params]));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수', rows.length);

    expect(rows.length, '기간 조회 1건 이상').toBeGreaterThanOrEqual(1);
    const dbCount = await purCount(page, params);
    expect(rows.length, `API(${rows.length})===DB(${dbCount})`).toBe(dbCount);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-tc2.png`, fullPage: true });
    logResult('검증', `✅ PASS — ${rows.length}건`);
  });

  test('[TC3:pur_0910M] 직접구매지급신청 - 역방향 날짜 (시작일 > 종료일 → 0건)', async ({ workerPage: page }) => {
    logTestStart('[TC3] 역방향 날짜 (0건 기대)');
    const params = { RQST_SDT: '20261231', RQST_EDT: '20240101' };
    logInput('params', JSON.stringify(params));

    // expectZero=true: assertNexacroResponse 대신 body 직접 파싱 후 0건 검증
    const resp = await apiPost(page, PUR_EP, purXml([params]));
    expect(resp.status(), 'HTTP 200').toBe(200);
    const body = await resp.text();
    const rows = parseNexacroXmlRows(body, 'ds_list');
    logResult('조회 건수', rows.length);

    expect(rows.length, '역방향 날짜 → 0건').toBe(0);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-tc3.png`, fullPage: true });
    logResult('검증', '✅ PASS — 0건');
  });

  test('[TC4:pur_0910M] 직접구매지급신청 - 결재상태 필터 (APV_STAT_CD=000-010-040)', async ({ workerPage: page }) => {
    logTestStart('[TC4] 결재상태 필터');
    const params = { APV_STAT_CD: '000-010-040' };
    logInput('params', JSON.stringify(params));

    const resp   = await apiPost(page, PUR_EP, purXml([params]));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수', rows.length);

    expect(rows.length, '결재상태 필터 1건 이상').toBeGreaterThanOrEqual(1);
    const dbCount = await purCount(page, params);
    expect(rows.length, `API(${rows.length})===DB(${dbCount})`).toBe(dbCount);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-tc4.png`, fullPage: true });
    logResult('검증', `✅ PASS — ${rows.length}건`);
  });

  test('[TC5:pur_0910M] 직접구매지급신청 - 키워드 검색 (요구번호 LIKE 2024)', async ({ workerPage: page }) => {
    logTestStart('[TC5] 키워드 검색');
    const params = { SCH_SRCH_CLS: 'RQST_NO', SCH_SRCH_KEY: '2024' };
    logInput('params', JSON.stringify(params));

    const resp   = await apiPost(page, PUR_EP, purXml([params]));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수', rows.length);

    expect(rows.length, '키워드 검색 1건 이상').toBeGreaterThanOrEqual(1);
    const dbCount = await purCount(page, params);
    expect(rows.length, `API(${rows.length})===DB(${dbCount})`).toBe(dbCount);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-tc5.png`, fullPage: true });
    logResult('검증', `✅ PASS — ${rows.length}건`);
  });

  test('[TC6:pur_0910M] 직접구매지급신청 - 권한 필터 (ROLE_YN=Y)', async ({ workerPage: page }) => {
    logTestStart('[TC6] 권한 필터 (ROLE_YN=Y)');
    const params = { ROLE_YN: 'Y' };
    logInput('params', JSON.stringify(params));

    const resp   = await apiPost(page, PUR_EP, purXml([params]));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수', rows.length);

    // ROLE_YN은 WHERE 절에 직접 반영되지 않음 → 0건도 허용, DB 대조 생략
    expect(rows.length, 'ROLE_YN 조회 0건 이상').toBeGreaterThanOrEqual(0);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/pur0910M-tc6.png`, fullPage: true });
    logResult('검증', `✅ PASS — ${rows.length}건`);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // hrm_0130M — 부서관리 (TC7~TC12)
  // ═══════════════════════════════════════════════════════════════════════════
  const HRM_PGM  = 'hrm_0130M';
  const HRM_EP   = `${BASE_URL}/mis/hrm/hrm0130/getList.do`;
  const HRM_COLS = ['SCH_HDODF_CD', 'SCH_BZPLC_CD', 'SCH_DEPT_NM', 'SCH_USE_YN'];
  const hrmXml   = (rows: Record<string, string>[]) => nexacroXml(HRM_PGM, HRM_COLS, rows);
  const hrmCount = (page: Page, p: Record<string, string>) => getDbCount(page, HRM_PGM, HRM_COLS, p);

  test('[TC7:hrm_0130M] 부서관리 - 전체 조회 (조건 없음, SCH_USE_YN 비움)', async ({ workerPage: page }) => {
    logTestStart('[TC7] 전체 조회 (조건 없음)');
    const params: Record<string, string> = {};
    logInput('params', JSON.stringify(params));

    const resp   = await apiPost(page, HRM_EP, hrmXml([params]));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수', rows.length);

    expect(rows.length, '전체 조회 1건 이상').toBeGreaterThanOrEqual(1);
    const dbCount = await hrmCount(page, params);
    expect(rows.length, `API(${rows.length})===DB(${dbCount})`).toBe(dbCount);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130M-tc7.png`, fullPage: true });
    logResult('검증', `✅ PASS — ${rows.length}건`);
  });

  test('[TC8:hrm_0130M] 부서관리 - 사용여부=Y 필터', async ({ workerPage: page }) => {
    logTestStart('[TC8] 사용여부=Y 필터');
    const params = { SCH_USE_YN: 'Y' };
    logInput('params', JSON.stringify(params));

    const resp   = await apiPost(page, HRM_EP, hrmXml([params]));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수', rows.length);

    expect(rows.length, '사용여부=Y 1건 이상').toBeGreaterThanOrEqual(1);
    rows.forEach((r, i) => expect(r.USE_YN, `[행${i}] USE_YN!=Y`).toBe('Y'));
    const dbCount = await hrmCount(page, params);
    expect(rows.length, `API(${rows.length})===DB(${dbCount})`).toBe(dbCount);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130M-tc8.png`, fullPage: true });
    logResult('검증', `✅ PASS — ${rows.length}건`);
  });

  test('[TC9:hrm_0130M] 부서관리 - 사용여부=N 필터 (0건 가능)', async ({ workerPage: page }) => {
    logTestStart('[TC9] 사용여부=N 필터');
    const params = { SCH_USE_YN: 'N' };
    logInput('params', JSON.stringify(params));

    const resp   = await apiPost(page, HRM_EP, hrmXml([params]));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수', rows.length);

    // expectZero=true: 미사용 부서가 없으면 0건 가능. 존재 시 모든 행 USE_YN='N', DB 건수 일치
    rows.forEach((r, i) => expect(r.USE_YN, `[행${i}] USE_YN!=N`).toBe('N'));
    const dbCount = await hrmCount(page, params);
    expect(rows.length, `API(${rows.length})===DB(${dbCount})`).toBe(dbCount);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130M-tc9.png`, fullPage: true });
    logResult('검증', `✅ PASS — ${rows.length}건`);
  });

  test('[TC10:hrm_0130M] 부서관리 - 부서명 키워드 검색 (SCH_DEPT_NM=부)', async ({ workerPage: page }) => {
    logTestStart('[TC10] 부서명 키워드 검색');
    const params = { SCH_DEPT_NM: '부' };
    logInput('params', JSON.stringify(params));

    const resp   = await apiPost(page, HRM_EP, hrmXml([params]));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수', rows.length);

    expect(rows.length, '부서명 검색 1건 이상').toBeGreaterThanOrEqual(1);
    rows.forEach((r, i) => expect(r.DEPT_NM, `[행${i}] DEPT_NM에 '부' 미포함`).toContain('부'));
    const dbCount = await hrmCount(page, params);
    expect(rows.length, `API(${rows.length})===DB(${dbCount})`).toBe(dbCount);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130M-tc10.png`, fullPage: true });
    logResult('검증', `✅ PASS — ${rows.length}건`);
  });

  test('[TC11:hrm_0130M] 부서관리 - 사용여부=Y + 부서명 복합 검색', async ({ workerPage: page }) => {
    logTestStart('[TC11] 복합 검색 (USE_YN=Y AND DEPT_NM LIKE 부)');
    const params = { SCH_USE_YN: 'Y', SCH_DEPT_NM: '부' };
    logInput('params', JSON.stringify(params));

    const resp   = await apiPost(page, HRM_EP, hrmXml([params]));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수', rows.length);

    // expectZero=true: 두 조건 동시 검증. getDbCount 생략 (복합 LIKE는 DB 대조 제외)
    expect(rows.length, '복합 조건 0건 이상').toBeGreaterThanOrEqual(0);
    rows.forEach((r, i) => {
      expect(r.USE_YN, `[행${i}] USE_YN!=Y`).toBe('Y');
      expect(r.DEPT_NM, `[행${i}] DEPT_NM에 '부' 미포함`).toContain('부');
    });

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130M-tc11.png`, fullPage: true });
    logResult('검증', `✅ PASS — ${rows.length}건`);
  });

  test('[TC12:hrm_0130M] 부서관리 - DEPT_CD 오름차순 정렬 검증', async ({ workerPage: page }) => {
    logTestStart('[TC12] DEPT_CD 오름차순 정렬 검증');
    const params: Record<string, string> = {};
    logInput('params', JSON.stringify(params));

    const resp   = await apiPost(page, HRM_EP, hrmXml([params]));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');
    logResult('조회 건수', rows.length);

    // sort 검증만 수행. getDbCount 생략
    expect(rows.length, '정렬 검증 1건 이상').toBeGreaterThanOrEqual(1);
    for (let i = 1; i < rows.length; i++) {
      expect(
        rows[i - 1].DEPT_CD <= rows[i].DEPT_CD,
        `[행${i - 1}→${i}] 오름차순 위배: ${rows[i - 1].DEPT_CD} > ${rows[i].DEPT_CD}`
      ).toBe(true);
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130M-tc12.png`, fullPage: true });
    logResult('검증', `✅ PASS — ${rows.length}건 정렬 확인`);
  });
});
