// ==============================================================
// HRM — 직급별정/현원표 단위 테스트 (hrm_0225M)
// 생성일시: 2026-07-01  |  파일: 20260701_hrm_0225M_unit.spec.ts
// 화면: 직급별정/현원표
// API: POST /mis/hrm/hrm0225/getGrdData.do  (serviceId: getGrdData)
// 검색 Dataset: ds_main  |  결과 Dataset: ds_listPrcp
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
const API_URL        = '/mis/hrm/hrm0225/getGrdData.do';
const PGM_ID         = 'hrm_0225M';                 // API 본문 전용 — 테스트명 사용 금지
const DS_SEARCH_NAME = 'ds_main';                   // 검색 Dataset이 ds_main
const DS_LIST_NAME   = 'ds_listPrcp';

// ── ds_main(검색) 컬럼 목록 (hrm_0225M.xfdl Dataset 정의 기준) ──────────────
const DS_SEARCH_COLUMNS = ['PRCP_MDAT_DT', 'PRCP_MDAT_FG_CD', 'PRCP_MDAT_RSN', 'STDR_DT', 'GRD_CNT'];

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
// [hrm_0225M] 단위 테스트 — 직급별정/현원표
// ============================================================================
test.describe('직급별정/현원표 단위 테스트', () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 직급별정/현원표 - 정원조정일 + 현원기준일 조회 (PRCP_MDAT_DT, STDR_DT)
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 직급별정/현원표  액터: 개발자
   * URL: /mis/hrm/hrm0225/getGrdData.do
   * 예상결과: 정원조정일·현원기준일 기준 직급별 정/현원(정원·현원·차이)이 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT_PRCP A WHERE 1=1 AND A.PRCP_MDAT_DT = '20240101'
   */
  test('[no:1] 직급별정/현원표 - 정원조정일 + 현원기준일 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 직급별정/현원표 - 정원조정일 + 현원기준일 조회');
    logInput('PRCP_MDAT_DT', '2024-01-01');
    logInput('STDR_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ PRCP_MDAT_DT: '2024-01-01', STDR_DT: '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getGrdData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0225-no1-grd.png`, fullPage: true });

    expect(rows.length, '직급별정/현원표 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:2] [단위] [SELECT] 직급별정/현원표 - 다른 현원기준일 조회 (STDR_DT 변경)
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 직급별정/현원표  액터: 개발자
   * 예상결과: 동일 정원조정일에 현원기준일 변경 시 현원/차이 값이 재계산되어 조회된다. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT_PRCP A WHERE 1=1 AND A.PRCP_MDAT_DT = '20240101'
   */
  test('[no:2] 직급별정/현원표 - 다른 현원기준일 조회', async ({ workerPage: page }) => {
    logTestStart('[no:2] 직급별정/현원표 - 다른 현원기준일 조회');
    logInput('PRCP_MDAT_DT', '2024-01-01');
    logInput('STDR_DT', '2024-06-30');

    const resp   = await apiPost(page, API_URL, searchBody({ PRCP_MDAT_DT: '2024-01-01', STDR_DT: '2024-06-30' }));
    const result = await assertNexacroResponse(resp, 'getGrdData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0225-no2-stdr.png`, fullPage: true });

    expect(rows.length, '직급별정/현원표 현원기준일 변경 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

  /**
   * [no:3] [단위] [SELECT] 직급별정/현원표 - 존재하지 않는 정원조정일 (미래일자)
   * 중분류: 인사관리  소분류: 정원관리  메뉴명: 직급별정/현원표  액터: 개발자
   * 예상결과: 미래 정원조정일(9999-12-31) 기준 조회. DB 미확인이므로 반환 건수 확인. (총 N건 — DB 확인 필요)
   * DB 확인: SELECT COUNT(*) FROM HRM_DEPT_PRCP A WHERE 1=1 AND A.PRCP_MDAT_DT = '99991231'
   */
  test('[no:3] 직급별정/현원표 - 존재하지 않는 정원조정일(미래일자)', async ({ workerPage: page }) => {
    logTestStart('[no:3] 직급별정/현원표 - 존재하지 않는 정원조정일');
    logInput('PRCP_MDAT_DT', '9999-12-31');
    logInput('STDR_DT', '2024-12-31');

    const resp   = await apiPost(page, API_URL, searchBody({ PRCP_MDAT_DT: '9999-12-31', STDR_DT: '2024-12-31' }));
    const result = await assertNexacroResponse(resp, 'getGrdData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_LIST_NAME);

    logResult('조회 건수', `${rows.length}건`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/hrm0225-no3-future.png`, fullPage: true });

    expect(rows.length, '직급별정/현원표 미래일자 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
