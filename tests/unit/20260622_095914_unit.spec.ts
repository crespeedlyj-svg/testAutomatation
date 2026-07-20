// ==============================================================
// PUR — 직접구매지급신청 단위 테스트
// 생성일시: 2026-06-22  |  파일: 20260622_095914_unit.spec.ts
// 생성자: SYSTEM
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import { assertNexacroResponse } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL  ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';

// ── Nexacro XML 요청 본문 생성 ──────────────────────────────
function nexacroXml(
  datasets: { id: string; columns: string[]; rows?: Record<string, string>[] }[],
  pgmId: string   // ← CSRF 검증 필수값 — sourceName 그대로 사용 (예: 'PUR_5110M')
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
  return page.request.post(endpoint, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    data: xml,
  });
}

test.describe('직접구매지급신청 단위 테스트', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] 직접구매지급신청 - 조회
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 그리드의 신청자 항목에 입력한 명칭이 포함된 데이터만 반환되어야 함, 그리드의 결재상태 항목은 선택한 코드 값과 일치하는 데이터만 반환되어야 함, 그리드의 신청부서 항목에 입력한 명칭이 포함된 데이터만 반환되어야 함
   */
  test('[no:1] [단위] [SELECT] 직접구매지급신청 - 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] [단위] 직접구매지급신청 - 조회');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: [],
        rows: [{ /* TODO: 실제 입력값 기재 */ }],
      }], 'pur_0910M')  // pgmId: CSRF 검증 필수
    );

    await assertNexacroResponse(resp, 'getList.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-1-getList.png`, fullPage: true });
  });

  /**
   * [no:2] [단위] [] 직접구매지급신청 - 엑셀 다운로드 실행
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 브라우저에 Excel 파일 다운로드가 시작됨
   */
  test('[no:2] [단위] [] 직접구매지급신청 - 엑셀 다운로드 실행', async ({ workerPage: page }) => {
    logTestStart('[no:2] [단위] 직접구매지급신청 - 엑셀 다운로드 실행');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_main',
        columns: [],
        rows: [{ /* TODO: 실제 입력값 기재 */ }],
      }], 'pur_0910M')  // pgmId: CSRF 검증 필수
    );

    await assertNexacroResponse(resp, 'getList.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-2-getList.png`, fullPage: true });
  });

});
