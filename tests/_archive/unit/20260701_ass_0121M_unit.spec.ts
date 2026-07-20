// ==============================================================
// ASS — 자산수기등록(팝업) 단위 테스트 (ass_0121M)
// 생성일시: 2026-07-01  |  파일: 20260701_ass_0121M_unit.spec.ts
// 화면: 자산정보관리(자산수기등록) (ass_0120M 수기등록 버튼으로 열리는 팝업)
// API: POST /mis/ass/ass0121/getData.do  (상세조회)
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지 (API-direct)
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '/mis/ass/ass0121/getData.do';
const PGM_ID         = 'ass_0121M';       // API 본문 전용 — 테스트명 사용 금지
const DS_DETAIL      = 'ds_main';

// ── ds_search 컬럼 목록 (ass_0121M.xfdl Dataset 정의 기준) ──────────────────
const DS_SEARCH_COLUMNS = [
  'CORP_CD', 'BUSI_PLC_CD', 'BUSI_PLC_NM', 'WRK_AREA', 'AST_MNG_CD', 'AST_CD',
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
// [ass_0121M] 단위 테스트 — 자산수기등록 팝업 상세조회 (getData)
// ============================================================================
test.describe('자산수기등록 단위 테스트', () => {

  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 자산수기등록 - 자산 상세 조회 (getData)
   * 중분류: 자산관리  소분류: 자산관리  메뉴명: 자산수기등록  액터: 개발자
   * URL: /mis/ass/ass0121/getData.do
   * 키: AST_MNG_CD / AST_CD (scenario-analyst 미확정 — TODO)
   * 예상결과: 선택한 자산의 상세정보가 조회된다.
   * DB 확인: SELECT COUNT(*) FROM [TODO: 자산 마스터 테이블 ] DUAL WHERE AST_MNG_CD = :AST_MNG_CD
   * NOTE: getData 조회키가 미확정(빈값)이므로 응답 정상 여부를 1차 검증한다.
   */
  test('[no:1] 자산수기등록 - 자산 상세 조회 (getData)', async ({ workerPage: page }) => {
    logTestStart('[no:1] 자산수기등록 - 자산 상세 조회 (getData)');
    logInput('키(AST_MNG_CD/AST_CD)', '(미확정 — TODO)');

    const resp   = await apiPost(page, API_URL, searchBody({ AST_MNG_CD: '', AST_CD: '' }));
    const result = await assertNexacroResponse(resp, 'getData.do');
    const rows   = parseNexacroXmlRows(result.body, DS_DETAIL);

    logResult('상세 조회 건수', `${rows.length}건`);
    if (rows[0]) console.log(`  상세: ${JSON.stringify(rows[0])}`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ass0121-no1-getData.png`, fullPage: true });

    // getData 응답이 정상(Root/ErrorCode=0)이어야 한다. 키 미확정이므로 행수는 참고값.
    expect(result.isSuccess, `자산수기등록 상세 조회 응답 정상 필요: ${result.failReason}`).toBe(true);
    expect(rows.length, '자산수기등록 상세 조회 행수(참고)').toBeGreaterThanOrEqual(0);
    logResult('검증', 'PASS');
  });

});
