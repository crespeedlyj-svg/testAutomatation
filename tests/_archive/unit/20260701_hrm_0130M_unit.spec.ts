// ==============================================================
// HRM — 부서관리 단위 테스트 (hrm_0130M)
// 생성일시: 2026-07-01  |  파일: 20260701_hrm_0130M_unit.spec.ts
// 화면: 부서관리
// API: POST /mis/hrm/hrm0130/getList.do  (serviceId: getList)
// 방식: API-direct (page.request.post + nexacroXml)
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '/mis/hrm/hrm0130/getList.do';
const PGM_ID         = 'hrm_0130M';                 // API 본문 전용 — 테스트명 사용 금지
const DS_SEARCH_NAME = 'ds_search';
const DS_LIST_NAME   = 'ds_list';

// ── ds_search 컬럼 목록 (hrm_0130M.xfdl Dataset 정의 기준) ──────────────────
const DS_SEARCH_COLUMNS = ['SCH_HDODF_CD', 'SCH_BZPLC_CD', 'SCH_DEPT_NM', 'SCH_USE_YN'];

// ── Nexacro XML 요청 본문 생성 ──────────────────────────────────────────────
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
  const fullUrl = `${BASE_URL}${endpoint}`;
  const result = await page.evaluate(
    async ({ url, xmlBody }: { url: string; xmlBody: string }) => {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
        body: xmlBody,
        credentials: 'include',
        signal: AbortSignal.timeout(20000),
      });
      return { status: resp.status, body: await resp.text() };
    },
    { url: fullUrl, xmlBody: xml }
  );
  return { status: () => result.status, text: async () => result.body } as any;
}

function searchBody(params: Record<string, string>): string {
  const allParams = Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']));
  return nexacroXml(
    [{ id: DS_SEARCH_NAME, columns: DS_SEARCH_COLUMNS, rows: [allParams] }],
    PGM_ID
  );
}

// ============================================================================
// [hrm_0130M] 단위 테스트 — 부서관리
// ============================================================================
test.describe('부서관리 단위 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 부서관리 - 전체 조회 (SCH_USE_YN 비움)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 부서관리 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1
   */
  test('[no:1] 부서관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서관리 - 전체 조회');
    logInput('검색조건', '없음 (SCH_USE_YN 비움)');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no1-all.png`, fullPage: true });

    expect(rows.length, '부서관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 부서관리 - 사용여부=Y 필터
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * 예상결과: 사용여부 '사용'(Y) 부서 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.USE_YN = 'Y'
   */
  test('[no:2] 부서관리 - 사용여부=Y 필터', async ({ workerPage: page }) => {
    logTestStart('[no:2] 부서관리 - 사용여부=Y 필터');
    logInput('SCH_USE_YN', 'Y');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_USE_YN: 'Y' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no2-useyn-y.png`, fullPage: true });

    expect(rows.length, '부서관리 사용여부=Y 1건 이상').toBeGreaterThan(0);
    // rowValidation: 응답 모든 행의 USE_YN이 'Y'
    rows.forEach((r, i) => {
      if (r.USE_YN !== undefined && r.USE_YN !== '') {
        expect(r.USE_YN, `[행${i}] USE_YN 조건 불일치`).toBe('Y');
      }
    });
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 부서관리 - 사용여부=N 필터 (0건 가능)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * 예상결과: 사용여부 '미사용'(N) 부서 목록. 미사용 부서가 없으면 0건. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.USE_YN = 'N'
   */
  test('[no:3] 부서관리 - 사용여부=N 필터 (0건)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 부서관리 - 사용여부=N 필터');
    logInput('SCH_USE_YN', 'N');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_USE_YN: 'N' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no3-useyn-n.png`, fullPage: true });

    expect(rows.length, '부서관리 사용여부=N 0건 기대').toBe(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:4] [단위] [SELECT] 부서관리 - 부서명 키워드 검색 (SCH_DEPT_NM='부')
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * 예상결과: 부서명에 '부'가 포함된 부서가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.DEPT_NM LIKE '%' || TRIM('부') || '%'
   */
  test('[no:4] 부서관리 - 부서명 키워드 검색', async ({ workerPage: page }) => {
    logTestStart('[no:4] 부서관리 - 부서명 키워드 검색');
    logInput('SCH_DEPT_NM', '부');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_DEPT_NM: '부' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no4-deptnm.png`, fullPage: true });

    expect(rows.length, '부서관리 부서명 키워드 1건 이상').toBeGreaterThan(0);
    // rowValidation: 응답 모든 행의 DEPT_NM에 '부' 포함
    rows.forEach((r, i) => {
      if (r.DEPT_NM !== undefined && r.DEPT_NM !== '') {
        expect(r.DEPT_NM.includes('부'), `[행${i}] DEPT_NM('${r.DEPT_NM}')에 '부' 미포함`).toBe(true);
      }
    });
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:5] [단위] [SELECT] 부서관리 - 사용여부=Y + 부서명 복합 검색 (0건 가능)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * 예상결과: USE_YN='Y' AND DEPT_NM LIKE '%부%' 두 조건 동시 만족. 없으면 0건. (총 0건)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1 AND A.USE_YN='Y' AND A.DEPT_NM LIKE '%' || TRIM('부') || '%'
   */
  test('[no:5] 부서관리 - 사용여부=Y + 부서명 복합 검색 (0건)', async ({ workerPage: page }) => {
    logTestStart('[no:5] 부서관리 - 사용여부=Y + 부서명 복합 검색');
    logInput('SCH_USE_YN', 'Y');
    logInput('SCH_DEPT_NM', '부');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_USE_YN: 'Y', SCH_DEPT_NM: '부' }));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no5-complex.png`, fullPage: true });

    expect(rows.length, '부서관리 복합 검색 0건 기대').toBe(0);
    // rowValidation: 결과가 있으면 두 조건 동시 만족 (방어적 검증)
    rows.forEach((r, i) => {
      if (r.USE_YN !== undefined && r.USE_YN !== '') {
        expect(r.USE_YN, `[행${i}] USE_YN 조건 불일치`).toBe('Y');
      }
      if (r.DEPT_NM !== undefined && r.DEPT_NM !== '') {
        expect(r.DEPT_NM.includes('부'), `[행${i}] DEPT_NM('${r.DEPT_NM}')에 '부' 미포함`).toBe(true);
      }
    });
    logResult('검증', 'PASS');
  });

  /**
   * [no:6] [단위] [SELECT] 부서관리 - DEPT_CD 오름차순 정렬 검증
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서관리  액터: 개발자
   * 예상결과: 전체 조회 결과가 DEPT_CD 기준 오름차순 정렬되어 반환된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT A WHERE 1=1  (ORDER BY A.DEPT_CD ASC)
   */
  test('[no:6] 부서관리 - DEPT_CD 오름차순 정렬 검증', async ({ workerPage: page }) => {
    logTestStart('[no:6] 부서관리 - DEPT_CD 오름차순 정렬 검증');
    logInput('검색조건', '없음 (정렬 검증)');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0130-no6-sort.png`, fullPage: true });

    expect(rows.length, '부서관리 전체 조회 1건 이상').toBeGreaterThan(0);
    // rowValidation: 인접한 모든 행에 대해 prev.DEPT_CD <= next.DEPT_CD
    for (let i = 1; i < rows.length; i++) {
      const prev = rows[i - 1].DEPT_CD ?? '';
      const cur  = rows[i].DEPT_CD ?? '';
      expect(prev <= cur, `[행${i}] 정렬 위배: '${prev}' > '${cur}'`).toBe(true);
    }
    logResult('검증', `PASS — ${rows.length}행 오름차순`);
  });

});
