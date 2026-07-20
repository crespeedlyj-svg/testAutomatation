// ==============================================================
// PUR — 구매요구(내자) 단위 테스트 (pur_0111M)
// 생성일시: 2026-07-01  |  파일: 20260701_pur_0111M_unit.spec.ts
// 화면: 구매요구(내자) — pur_0110M에서 호출되는 상세 등록/수정/삭제 팝업
// API: POST /mis/pur/pur0111/getData.do (RQST_NO 키 단건 조회)
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '/mis/pur/pur0111/getData.do';
const PGM_ID         = 'pur_0111M';   // API 본문 전용 — 테스트명 사용 금지

// TODO: 실제 존재하는 요구번호(RQST_NO)로 교체 필요 — 시나리오상 placeholder("{기존 요구번호}")
const RQST_NO = '{기존 요구번호}';

// ── ds_search 컬럼 목록 (pur_0111M scenarios.dsSearchCols) ──────────────────
const DS_SEARCH_COLUMNS = [
  'CORP_CD', 'BUSI_PLC_CD', 'WORK_AREA', 'PUR_TP', 'FRGN_CLS',
  'RQST_NO', 'FRM_MODE', 'ACT_UNIT_CD', 'BUDG_YY', 'BUDG_FG',
  'BUDG_DEPT_CD', 'BUDG_ITSR_CD', 'BUDG_ITSR_NM', 'BUDG_LITM_NM', 'ACCT_CD',
  'PRJT_FG', 'EQUIP_ESSNTLREGS_AT', 'GRD_NM', 'TEMP_AMT', 'UNIT',
  'ACCT_NM', 'BUDG_BSNS_NM', 'BUDG_BSNS_CD', 'BUDG_LITM_CD', 'BUDG_CLSF_FG',
  'AST_CLS_NM', 'AST_CLS_CD',
];

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
    [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS, rows: [allParams] }],
    PGM_ID
  );
}

// ============================================================================
// [pur_0111M] 단위 테스트 — 구매요구(내자) 단건 상세 조회
// ============================================================================
test.describe('구매요구(내자) 단위 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 구매요구(내자) - 단건 상세 조회 (getData, RQST_NO 키)
   * 중분류: 구매관리  소분류: 구매요구  메뉴명: 구매요구(내자)  액터: 개발자
   * 예상결과: 지정한 요구번호의 구매요구 상세(기본정보/물품/예산)가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM (쿼리 확인 필요: 구매요구 마스터) WHERE RQST_NO = '{기존 요구번호}'
   * TODO: RQST_NO placeholder("{기존 요구번호}") — 실제 요구번호로 교체해야 정상 검증됨
   */
  test('[no:1] 구매요구(내자) - 단건 상세 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] 구매요구(내자) - 단건 상세 조회');
    logInput('RQST_NO', RQST_NO);
    logInput('FRGN_CLS', '604-001');
    logInput('PUR_TP', '602-001');

    const resp   = await apiPost(page, API_URL, searchBody({
      RQST_NO, FRGN_CLS: '604-001', PUR_TP: '602-001',
    }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, 'ds_list');

    logResult('조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/구매요구내자-no1-detail.png`, fullPage: true });

    expect(rows.length, '구매요구(내자) 단건 상세 조회 1건 이상').toBeGreaterThan(0);
    logResult('검증', 'PASS');
  });

});
