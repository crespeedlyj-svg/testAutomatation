// ==============================================================
// [UT_PUR0910M_001] 직접구매요구신청 - 전체 조회 (단위 테스트)
// 중분류: 구매관리  소분류: 구매요구  메뉴명: 직접구매요구신청  액터: 개발자
// 시나리오: _workspace/pur0910/01_scenarios.json  no:1
// 생성일시: 2026-06-29  |  파일: 20260629_pur0910_tc001_unit.spec.ts
// storageState 자동 주입 — 로그인/goto 코드 작성 절대 금지
// 방식: page.request.post Nexacro XML 직접 호출 (UI 없음)
// ==============================================================
import { test, expect } from '../fixtures';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '/mis/pur/pur0910/getList.do';
const PGM_ID         = 'pur_0910M';

const DS_SEARCH_COLUMNS = [
  'WORK_AREA', 'RQST_SDT', 'RQST_EDT', 'APV_STAT_CD',
  'APNT_EMP_NM', 'APNT_EMP_NO', 'APNT_DEPT_NM', 'APNT_DEPT_CD',
  'SCH_SRCH_CLS', 'SCH_SRCH_KEY', 'ROLE_YN', 'DEPT_CHIF_YN',
  'BOOK_CLS', 'RQST_CLS', 'DICT_CLS',
];

const RESULT_COLS = [
  'CHEAP_RQST_NO', 'RQST_SBJ', 'RQST_DT',
  'APNT_DEPT_NM', 'APV_STAT_CD', 'TOT_RQST_AMT',
];

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

function searchBody(params: Record<string, string> = {}): string {
  const allParams = Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']));
  return nexacroXml(
    [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS, rows: [allParams] }],
    PGM_ID
  );
}

/**
 * [UT_PUR0910M_001] 직접구매요구신청 - 전체 조회
 *
 * 시나리오 no : 1
 * 구분        : 단위 (unit)
 * CRUD        : SELECT
 * 검색조건    : 없음 (전체)
 * 예상결과    : 직접구매요구신청 목록이 조회된다. (총 N건)
 * DB 확인     : SELECT COUNT(*) FROM PUR_CHEAP_RQST_MST A WHERE 1=1
 */
test.describe('[UT_PUR0910M_001] 직접구매요구신청 전체 조회', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  test('전체 조회 — 검색조건 없이 API 호출 시 목록 1건 이상 반환', async ({ workerPage: page }) => {
    logTestStart('[UT_PUR0910M_001] 직접구매요구신청 - 전체 조회');
    logInput('검색조건', '없음 (전체)');
    logInput('API', `${API_URL}`);

    // ── 1. API 호출 ──────────────────────────────────────────────
    const resp = await page.request.post(`${BASE_URL}${API_URL}`, {
      headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      data: searchBody(),
    }) as unknown as import('@playwright/test').Response;

    // ── 2. HTTP 응답 검증 ─────────────────────────────────────────
    const result = await assertNexacroResponse(resp, 'getList.do');
    expect(resp.status(), 'HTTP 200 필요').toBe(200);

    // ── 3. 결과 파싱 ─────────────────────────────────────────────
    const rows = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) {
      console.log('  첫 행 샘플:');
      RESULT_COLS.forEach(col => console.log(`    ${col} = ${rows[0][col] ?? ''}`));
    }

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/UT_PUR0910M_001_전체조회.png`,
      fullPage: true,
    });

    // ── 4. 검증 ─────────────────────────────────────────────────
    expect(rows.length, '직접구매요구신청 전체 조회 — 1건 이상 반환되어야 함').toBeGreaterThan(0);

    // 결과 컬럼 존재 여부 확인
    RESULT_COLS.forEach(col => {
      expect(rows[0], `첫 행에 ${col} 컬럼 존재`).toHaveProperty(col);
    });

    logResult('검증', `PASS — ${rows.length}건 조회됨`);
  });
});
