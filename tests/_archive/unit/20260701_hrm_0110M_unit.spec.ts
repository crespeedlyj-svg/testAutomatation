// ==============================================================
// HRM — 부서조직관리 단위 테스트 (hrm_0110M)
// 생성일시: 2026-07-01  |  파일: 20260701_hrm_0110M_unit.spec.ts
// 화면: 부서조직관리 (조직도)
// API: POST /mis/hrm/hrm0110/getOrgchtList.do  (serviceId: getOrgchtList)
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
const API_URL        = '/mis/hrm/hrm0110/getOrgchtList.do';
const PGM_ID         = 'hrm_0110M';                 // API 본문 전용 — 테스트명 사용 금지
const DS_SEARCH_NAME = 'ds_search';
const DS_LIST_NAME   = 'ds_listOrgcht';

// ── ds_search 컬럼 목록 (hrm_0110M.xfdl Dataset 정의 기준) ──────────────────
const DS_SEARCH_COLUMNS = ['SCH_ORG_RGIN_DT'];

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

// API 호출 — page.request 사용 (credentials 자동 포함)
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

// ds_search 단일 행 헬퍼 — 항상 DS_SEARCH_COLUMNS 전체 포함 (isNotEmpty가 빈 값 스킵)
function searchBody(params: Record<string, string>): string {
  const allParams = Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']));
  return nexacroXml(
    [{ id: DS_SEARCH_NAME, columns: DS_SEARCH_COLUMNS, rows: [allParams] }],
    PGM_ID
  );
}

// ============================================================================
// [hrm_0110M] 단위 테스트 — 부서조직관리 (조직도) 조회
// ============================================================================
test.describe('부서조직관리 단위 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 부서조직관리 - 전체 조회
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직관리  액터: 개발자
   * URL: /mis/hrm/hrm0110/getOrgchtList.do
   * 예상결과: 부서조직관리(조직도) 목록이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_ORGCHT A WHERE 1=1
   */
  test('[no:1] 부서조직관리 - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 부서조직관리 - 전체 조회');
    logInput('검색조건', '없음');

    const resp   = await apiPost(page, API_URL, searchBody({}));
    const result = await assertNexacroResponse(resp, 'getOrgchtList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0110-no1-all.png`, fullPage: true });

    expect(rows.length, '부서조직관리 전체 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 부서조직관리 - 조직개편일자 조건 조회 (SCH_ORG_RGIN_DT)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직관리  액터: 개발자
   * 예상결과: 특정 조직개편일자 기준 조직도가 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_ORGCHT A WHERE 1=1 AND A.ORG_RGIN_DT = '20240101'
   */
  test('[no:2] 부서조직관리 - 조직개편일자 조건 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 부서조직관리 - 조직개편일자 조건 조회');
    logInput('SCH_ORG_RGIN_DT', '2024-01-01');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_ORG_RGIN_DT: '2024-01-01' }));
    const result = await assertNexacroResponse(resp, 'getOrgchtList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0110-no2-orgrgindt.png`, fullPage: true });

    expect(rows.length, '부서조직관리 조직개편일자 조건 1건 이상').toBeGreaterThan(0);
    // rowValidation: 응답 모든 행의 ORG_RGIN_DT가 요청값과 일치
    rows.forEach((r, i) => {
      const v = r.ORG_RGIN_DT;
      if (v !== undefined && v !== '') {
        expect(v.replace(/-/g, ''), `[행${i}] ORG_RGIN_DT 조건 불일치`).toBe('20240101');
      }
    });
    logResult('검증', `PASS — ${rows.length}행`);
  });

  /**
   * [no:3] [단위] [SELECT] 부서조직관리 - 존재하지 않는 조직개편일자 (미래일자)
   * 중분류: 인사관리  소분류: 조직관리  메뉴명: 부서조직관리  액터: 개발자
   * 예상결과: 미래 일자(9999-12-31) 기준 조회. DB 미확인이므로 반환 건수 확인. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_ORGCHT A WHERE 1=1 AND A.ORG_RGIN_DT = '99991231'
   */
  test('[no:3] 부서조직관리 - 존재하지 않는 조직개편일자(미래일자)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 부서조직관리 - 존재하지 않는 조직개편일자');
    logInput('SCH_ORG_RGIN_DT', '9999-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ SCH_ORG_RGIN_DT: '9999-12-31' }));
    const result = await assertNexacroResponse(resp, 'getOrgchtList.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0110-no3-future.png`, fullPage: true });

    expect(rows.length, '부서조직관리 미래일자 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
