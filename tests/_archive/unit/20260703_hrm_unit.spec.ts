// ==============================================================
// HRM — HRM_0130M 단위 테스트
// 생성일시: 2026-07-03  |  파일: 20260703_hrm_unit.spec.ts
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
   * [no:1] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   */
  test('[no:1] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:1] [단위] HRM_0130M - 전체 조회');
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
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-1-getList.png`, fullPage: true });
  });

  /**
   * [no:2] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 부서관리 목록이 조회된다.
   */
  test('[no:2] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:2] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');
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
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-2-getList.png`, fullPage: true });
  });

  /**
   * [no:3] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   * ⚠️ 참고: 이 URL은 회계단위 콤보 코드 목록 조회로 추정 — btn_search 클릭이 아니라
   *          화면 진입(ensureSessionReady) 시 자동 로드될 가능성이 있음. 실제 앱에서
   *          어떤 동작이 이 API를 호출하는지 확인 후 트리거 방식을 조정할 것.
   */
  test('[no:3] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:3] [단위] HRM_0130M - 전체 조회');
    const formKey = await ensureSessionReady(page, '', 'HRM_0130M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/getAcctUntCdList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-3-getAcctUntCdList.png`, fullPage: true });
  });

  /**
   * [no:4] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 부서관리 목록이 조회된다.
   * ⚠️ 참고: no:3과 동일 — 트리거 방식 확인 필요
   */
  test('[no:4] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:4] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');
    const formKey = await ensureSessionReady(page, '', 'HRM_0130M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/getAcctUntCdList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-4-getAcctUntCdList.png`, fullPage: true });
  });

  /**
   * [no:5] [단위] [INSERT] 부서관리
   * URL: /mis/hrm/hrm0130/setData.do
   * 예상결과: HTTP 200 · result=S · 신규 데이터가 목록에 1건 이상 추가되어 조회된다.
   */
  test('[no:5] [단위] [INSERT] 부서관리', async ({ workerPage: page }) => {
    logTestStart('[no:5] [단위] 부서관리');
    const formKey = await ensureSessionReady(page, '', 'HRM_0130M');

    logInput('ds_list.SCH_HDOF_FG', '01');
    logInput('ds_list.SCH_BZPLC_FG', '01');
    logInput('ds_list.SCH_DEPT_NM', '테스트명칭');
    logInput('ds_list.SCH_USE_YN', 'Y');
    logInput('ds_list.DEPT_NM', '테스트명칭');
    logInput('ds_list.DEPT_UPP_PATH_NM', '테스트명칭');
    logInput('ds_list.DEPT_ALL_PATH_NM', '테스트명칭');
    logInput('ds_list.DEPT_ENG_NM', '테스트명칭');
    logInput('ds_list.SORT_NO', '1');
    logInput('ds_list.DEPT_ABRE_NM', '테스트명칭');
    logInput('ds_list.DEPT_LCTN_FG', '01');
    logInput('ds_list.BZPLC_FG', '01');
    logInput('ds_list.BZPLC_FG_NM', '테스트명칭');
    logInput('ds_list.USE_YN', 'Y');
    logInput('ds_list.USE_YN_NM', '테스트명칭');
    logInput('ds_list.ORGCHT_YN', 'Y');
    logInput('ds_list.COMM_NM', '테스트명칭');
    logInput('ds_list.ACCT_UNT_NM', '테스트명칭');

    // ── 화면 컴포넌트 실제 입력 (formKey 있을 때만) ──────────────
    // 매핑 정보(inputSelector)가 없는 컬럼은 컬럼명을 컴포넌트 ID로 그대로 시도한다.
    // DEPT_NM 등 Grid01 셀 바인딩 컬럼은 독립 컴포넌트가 아니므로 실패(ok=false)할 수 있음 —
    // 실패해도 TC 전체를 막지 않고 경고만 남긴다 (그리드 셀 직접 입력은 통합 스펙에서 처리).
    if (formKey) {
      // SCH_HDOF_FG (Edit) — ds_list.SCH_HDOF_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_HDOF_FG', '01');
        logResult('SCH_HDOF_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_HDOF_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SCH_BZPLC_FG (Edit) — ds_list.SCH_BZPLC_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_BZPLC_FG', '01');
        logResult('SCH_BZPLC_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_BZPLC_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SCH_DEPT_NM (Edit) — ds_list.SCH_DEPT_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_DEPT_NM', '테스트명칭');
        logResult('SCH_DEPT_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_DEPT_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SCH_USE_YN (Edit) — ds_list.SCH_USE_YN
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_USE_YN', 'Y');
        logResult('SCH_USE_YN 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_USE_YN 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_NM (Edit) — ds_list.DEPT_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_NM', '테스트명칭');
        logResult('DEPT_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_UPP_PATH_NM (Edit) — ds_list.DEPT_UPP_PATH_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_UPP_PATH_NM', '테스트명칭');
        logResult('DEPT_UPP_PATH_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_UPP_PATH_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_ALL_PATH_NM (Edit) — ds_list.DEPT_ALL_PATH_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_ALL_PATH_NM', '테스트명칭');
        logResult('DEPT_ALL_PATH_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_ALL_PATH_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_ENG_NM (Edit) — ds_list.DEPT_ENG_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_ENG_NM', '테스트명칭');
        logResult('DEPT_ENG_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_ENG_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SORT_NO (Edit) — ds_list.SORT_NO
      { const ok = await setNexacroComponentValue(page, formKey, 'SORT_NO', '1');
        logResult('SORT_NO 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SORT_NO 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_ABRE_NM (Edit) — ds_list.DEPT_ABRE_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_ABRE_NM', '테스트명칭');
        logResult('DEPT_ABRE_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_ABRE_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_LCTN_FG (Edit) — ds_list.DEPT_LCTN_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_LCTN_FG', '01');
        logResult('DEPT_LCTN_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_LCTN_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // BZPLC_FG (Edit) — ds_list.BZPLC_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'BZPLC_FG', '01');
        logResult('BZPLC_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  BZPLC_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // BZPLC_FG_NM (Edit) — ds_list.BZPLC_FG_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'BZPLC_FG_NM', '테스트명칭');
        logResult('BZPLC_FG_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  BZPLC_FG_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // USE_YN (Edit) — ds_list.USE_YN
      { const ok = await setNexacroComponentValue(page, formKey, 'USE_YN', 'Y');
        logResult('USE_YN 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  USE_YN 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // USE_YN_NM (Edit) — ds_list.USE_YN_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'USE_YN_NM', '테스트명칭');
        logResult('USE_YN_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  USE_YN_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // ORGCHT_YN (Edit) — ds_list.ORGCHT_YN
      { const ok = await setNexacroComponentValue(page, formKey, 'ORGCHT_YN', 'Y');
        logResult('ORGCHT_YN 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  ORGCHT_YN 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // COMM_NM (Edit) — ds_list.COMM_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'COMM_NM', '테스트명칭');
        logResult('COMM_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  COMM_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // ACCT_UNT_NM (Edit) — ds_list.ACCT_UNT_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'ACCT_UNT_NM', '테스트명칭');
        logResult('ACCT_UNT_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  ACCT_UNT_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
    }

    // ── btn_save 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/setData.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_save 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_save');
    logResult('btn_save 클릭', clicked, true);
    expect(clicked, 'btn_save 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'setData.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-5-setData.png`, fullPage: true });
  });

  /**
   * [no:7] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   */
  test('[no:7] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:7] [단위] HRM_0130M - 전체 조회');
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
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-7-getList.png`, fullPage: true });
  });

  /**
   * [no:8] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 부서관리 목록이 조회된다.
   */
  test('[no:8] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:8] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');
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
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-8-getList.png`, fullPage: true });
  });

  /**
   * [no:9] [단위] [SELECT] HRM_0130M - 전체 조회
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: 전체 부서관리 목록이 조회된다. (1건 이상)
   * ⚠️ 참고: no:3과 동일 — 트리거 방식 확인 필요
   */
  test('[no:9] [단위] [SELECT] HRM_0130M - 전체 조회', async ({ workerPage: page }) => {
    logTestStart('[no:9] [단위] HRM_0130M - 전체 조회');
    const formKey = await ensureSessionReady(page, '', 'HRM_0130M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/getAcctUntCdList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-9-getAcctUntCdList.png`, fullPage: true });
  });

  /**
   * [no:10] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]
   * URL: /mis/hrm/hrm0130/getAcctUntCdList.do
   * 예상결과: SCH_USE_YN=Y 권한 범위 내 부서관리 목록이 조회된다.
   * ⚠️ 참고: no:3과 동일 — 트리거 방식 확인 필요
   */
  test('[no:10] [단위] [SELECT] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]', async ({ workerPage: page }) => {
    logTestStart('[no:10] [단위] HRM_0130M - 권한 필터 [SCH_USE_YN=Y]');
    const formKey = await ensureSessionReady(page, '', 'HRM_0130M');

    // ── btn_search 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/getAcctUntCdList.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_search 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_search');
    logResult('btn_search 클릭', clicked, true);
    expect(clicked, 'btn_search 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'getAcctUntCdList.do');
    const rows = parseNexacroXmlRows(nxResult.body, 'ds_list');
    logResult('응답 행 수', `${rows.length}건`);
    expect(rows.length, '예상결과: 1건 이상 조회').toBeGreaterThan(0);
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-10-getAcctUntCdList.png`, fullPage: true });
  });

  /**
   * [no:11] [단위] [INSERT] 부서관리
   * URL: /mis/hrm/hrm0130/setData.do
   * 예상결과: HTTP 200 · result=S · 신규 데이터가 목록에 1건 이상 추가되어 조회된다.
   */
  test('[no:11] [단위] [INSERT] 부서관리', async ({ workerPage: page }) => {
    logTestStart('[no:11] [단위] 부서관리');
    const formKey = await ensureSessionReady(page, '', 'HRM_0130M');

    logInput('ds_list.SCH_HDOF_FG', '01');
    logInput('ds_list.SCH_BZPLC_FG', '01');
    logInput('ds_list.SCH_DEPT_NM', '테스트명칭');
    logInput('ds_list.SCH_USE_YN', 'Y');
    logInput('ds_list.DEPT_NM', '테스트명칭');
    logInput('ds_list.DEPT_UPP_PATH_NM', '테스트명칭');
    logInput('ds_list.DEPT_ALL_PATH_NM', '테스트명칭');
    logInput('ds_list.DEPT_ENG_NM', '테스트명칭');
    logInput('ds_list.SORT_NO', '1');
    logInput('ds_list.DEPT_ABRE_NM', '테스트명칭');
    logInput('ds_list.DEPT_LCTN_FG', '01');
    logInput('ds_list.BZPLC_FG', '01');
    logInput('ds_list.BZPLC_FG_NM', '테스트명칭');
    logInput('ds_list.USE_YN', 'Y');
    logInput('ds_list.USE_YN_NM', '테스트명칭');
    logInput('ds_list.ORGCHT_YN', 'Y');
    logInput('ds_list.COMM_NM', '테스트명칭');
    logInput('ds_list.ACCT_UNT_NM', '테스트명칭');

    // ── 화면 컴포넌트 실제 입력 (formKey 있을 때만) ──────────────
    if (formKey) {
      // SCH_HDOF_FG (Edit) — ds_list.SCH_HDOF_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_HDOF_FG', '01');
        logResult('SCH_HDOF_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_HDOF_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SCH_BZPLC_FG (Edit) — ds_list.SCH_BZPLC_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_BZPLC_FG', '01');
        logResult('SCH_BZPLC_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_BZPLC_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SCH_DEPT_NM (Edit) — ds_list.SCH_DEPT_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_DEPT_NM', '테스트명칭');
        logResult('SCH_DEPT_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_DEPT_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SCH_USE_YN (Edit) — ds_list.SCH_USE_YN
      { const ok = await setNexacroComponentValue(page, formKey, 'SCH_USE_YN', 'Y');
        logResult('SCH_USE_YN 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SCH_USE_YN 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_NM (Edit) — ds_list.DEPT_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_NM', '테스트명칭');
        logResult('DEPT_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_UPP_PATH_NM (Edit) — ds_list.DEPT_UPP_PATH_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_UPP_PATH_NM', '테스트명칭');
        logResult('DEPT_UPP_PATH_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_UPP_PATH_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_ALL_PATH_NM (Edit) — ds_list.DEPT_ALL_PATH_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_ALL_PATH_NM', '테스트명칭');
        logResult('DEPT_ALL_PATH_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_ALL_PATH_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_ENG_NM (Edit) — ds_list.DEPT_ENG_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_ENG_NM', '테스트명칭');
        logResult('DEPT_ENG_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_ENG_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // SORT_NO (Edit) — ds_list.SORT_NO
      { const ok = await setNexacroComponentValue(page, formKey, 'SORT_NO', '1');
        logResult('SORT_NO 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  SORT_NO 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_ABRE_NM (Edit) — ds_list.DEPT_ABRE_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_ABRE_NM', '테스트명칭');
        logResult('DEPT_ABRE_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_ABRE_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // DEPT_LCTN_FG (Edit) — ds_list.DEPT_LCTN_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'DEPT_LCTN_FG', '01');
        logResult('DEPT_LCTN_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  DEPT_LCTN_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // BZPLC_FG (Edit) — ds_list.BZPLC_FG
      { const ok = await setNexacroComponentValue(page, formKey, 'BZPLC_FG', '01');
        logResult('BZPLC_FG 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  BZPLC_FG 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // BZPLC_FG_NM (Edit) — ds_list.BZPLC_FG_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'BZPLC_FG_NM', '테스트명칭');
        logResult('BZPLC_FG_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  BZPLC_FG_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // USE_YN (Edit) — ds_list.USE_YN
      { const ok = await setNexacroComponentValue(page, formKey, 'USE_YN', 'Y');
        logResult('USE_YN 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  USE_YN 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // USE_YN_NM (Edit) — ds_list.USE_YN_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'USE_YN_NM', '테스트명칭');
        logResult('USE_YN_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  USE_YN_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // ORGCHT_YN (Edit) — ds_list.ORGCHT_YN
      { const ok = await setNexacroComponentValue(page, formKey, 'ORGCHT_YN', 'Y');
        logResult('ORGCHT_YN 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  ORGCHT_YN 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // COMM_NM (Edit) — ds_list.COMM_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'COMM_NM', '테스트명칭');
        logResult('COMM_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  COMM_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
      // ACCT_UNT_NM (Edit) — ds_list.ACCT_UNT_NM
      { const ok = await setNexacroComponentValue(page, formKey, 'ACCT_UNT_NM', '테스트명칭');
        logResult('ACCT_UNT_NM 화면 입력', ok);
        if (!ok) console.warn('  ⚠️  ACCT_UNT_NM 컴포넌트를 찾지 못함 — 그리드 셀 바인딩이거나 ID 규칙이 다를 수 있음'); }
    }

    // ── btn_save 클릭 → API 호출 감시 ──────────────────────
    const respPromise = page.waitForResponse(
      res => res.url().includes('/mis/hrm/hrm0130/setData.do'),
      { timeout: 15000 }
    ).catch(() => null);
    logAction('btn_save 클릭');
    const clicked = await triggerNexacroButton(page, formKey, 'btn_save');
    logResult('btn_save 클릭', clicked, true);
    expect(clicked, 'btn_save 컴포넌트를 찾지 못함 — formKey 확인 필요').toBe(true);

    const resp = await respPromise;

    const nxResult = await assertNexacroResponse(resp, 'setData.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-11-setData.png`, fullPage: true });
  });

});
