// ==============================================================
// PUR — HRM_0130M 단위 테스트
// 생성일시: 2026-07-22  |  파일: testCode_20260722_101234_unit.spec.ts
// 생성자: SYSTEM
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logAction, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import {
  assertNexacroResponse, parseNexacroXmlRows,
  waitForNexacroAppReady, openMenuById, openMenuByPgm,
  setNexacroComponentValue, getNexacroComponentValue,
  triggerNexacroButton, selectNexacroRowByKey,
} from '../utils/nexacro-helper';

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

// 서버 세션의 csrfKey를 가져와 요청 XML에 주입 — Nexacro 플랫폼 CSRF 검증 통과
async function fetchCsrfKey(page: Page): Promise<string> {
  const { status, body } = await page.evaluate(
    async (url: string) => {
      const resp = await fetch(url, { credentials: 'include' });
      return { status: resp.status, body: await resp.text() };
    },
    `${BASE_URL}/common/frame/getSessionKey.do`
  );
  if (status !== 200) throw new Error(`getSessionKey HTTP ${status}`);
  const match = body.match(/<Parameter id="csrfKey"[^>]*>([^<]*)<\/Parameter>/);
  if (!match?.[1]) throw new Error(`csrfKey 미발견: ${body.substring(0, 300)}`);
  return match[1];
}

async function apiPost(
  page: Page, endpoint: string, xml: string
): Promise<import('@playwright/test').Response> {
  const csrfKey = await fetchCsrfKey(page);
  const xmlWithCsrf = xml.replace(
    '</Parameters>',
    `<Parameter id="csrfKey">${csrfKey}</Parameter></Parameters>`
  );
  const { status, body } = await page.evaluate(
    async ({ url, xml }: { url: string; xml: string }) => {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
        body: xml,
        credentials: 'include',
      });
      return { status: resp.status, body: await resp.text() };
    },
    { url: endpoint, xml: xmlWithCsrf }
  );
  return {
    status: () => status,
    text:   async () => body,
    ok:     () => status >= 200 && status < 300,
    url:    () => endpoint,
  } as unknown as import('@playwright/test').Response;
}

// Nexacro 서버는 openMenuById(또는 openMenuByPgm)로 폼을 서버 세션에 등록한 후에만 API 호출을 허용
// 세션 등록은 menuId/pgmId 당 1회로 충분 (세션 쿠키가 유지되는 한 재등록 불필요)
// menuId 미확인(DB 조회 실패) 시 pgmId로 openMenuByPgm 폴백 — 비어 있으면 CSRF 세션이 등록되지 않아 이후 API 호출이 모두 실패한다
// 반환값(formKey)은 실제 등록된 화면의 프레임 키 — setNexacroComponentValue 등으로 화면 컴포넌트에
// 직접 입력할 때 사용한다 (menuId 지정 시 그대로, pgmId 폴백 시 openMenuByPgm이 찾아낸 menuId 사용).
const _sessionReady = new Map<string, string>();
async function ensureSessionReady(page: Page, menuId: string, pgmId?: string): Promise<string> {
  const key = menuId || pgmId || '';
  if (!key) return '';
  if (_sessionReady.has(key)) return _sessionReady.get(key)!;
  await waitForNexacroAppReady(page, 20000);
  const nav = menuId ? await openMenuById(page, menuId) : await openMenuByPgm(page, pgmId || '');
  if (nav.ok) {
    await page.waitForTimeout(2000);
    const formKey = menuId || (nav as any).menuId || key;
    _sessionReady.set(key, formKey);
    console.log('[CSRF] 서버 세션 폼 등록 완료 — menuNm:', nav.menuNm);
    return formKey;
  } else {
    console.warn('[CSRF] 메뉴 등록 실패 — 이후 API 호출이 CSRF 오류를 반환할 수 있습니다:', nav.error);
    return '';
  }
}

// ds_search 단일 행 헬퍼 — 지정 컬럼 전체 포함 (빈값은 iBATIS isNotEmpty가 스킵)
function searchBody(pgmId: string, columns: string[], params: Record<string, string>): string {
  const allParams = Object.fromEntries(columns.map(c => [c, params[c] ?? '']));
  return nexacroXml([{ id: 'ds_search', columns, rows: [allParams] }], pgmId);
}

test.describe('HRM_0130M 단위 테스트', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

  /**
   * [no:13] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   */
  test('[no:13] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:13] [단위] HRM_0130M - 전체 조회');
    const formKey = await ensureSessionReady(page, '', 'HRM_0130M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-13-getList.png`, fullPage: true });
  });

  /**
   * [no:17] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   */
  test('[no:17] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:17] [단위] HRM_0130M - 전체 조회');
    const formKey = await ensureSessionReady(page, '', 'HRM_0130M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/getList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-17-getList.png`, fullPage: true });
  });

});
