/**
 * nexacro-api.ts
 *
 * ── 목적 ──────────────────────────────────────────────────────────────────
 * 이전에 각 spec 파일마다 인라인으로 복제되던 Nexacro CSRF·API 헬퍼를
 * 공용 모듈로 뽑아낸 것.
 *   - nexacroXml       : Nexacro Root XML 요청 본문 생성
 *   - fetchCsrfKey     : 세션 csrfKey 조회 (프로세스 세션 캐시 포함)
 *   - apiPost          : 브라우저 컨텍스트(page.evaluate(fetch))에서 POST
 *   - ensureSessionReady : menuId/pgmId로 서버 세션 폼 등록 (프로세스 캐시)
 *   - searchBody       : ds_search 단일행 페이로드 유틸
 *
 * ── 실행 semantic 유지 ────────────────────────────────────────────────────
 * `page.evaluate(async () => fetch(...))` 방식을 그대로 사용한다.
 * testCode_*.spec.ts 21개가 사용하던 방식과 동일하므로 마이그레이션 후에도
 * 실행 결과가 바뀌지 않는다.
 */

import type { Page, Response } from '@playwright/test';
import {
  waitForNexacroAppReady,
  openMenuById,
  openMenuByPgm,
} from './nexacro-helper';

const BASE_URL = () => process.env.APP_BASE_URL ?? '';

// ─────────────────────────────────────────────────────────────────────────────
// XML 페이로드
// ─────────────────────────────────────────────────────────────────────────────

export function nexacroXml(
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

/** ds_search 단일 행 페이로드 — 지정 컬럼 전체 포함(빈값은 iBATIS isNotEmpty가 스킵) */
export function searchBody(
  pgmId: string,
  columns: string[],
  params: Record<string, string>
): string {
  const allParams = Object.fromEntries(columns.map(c => [c, params[c] ?? '']));
  return nexacroXml([{ id: 'ds_search', columns, rows: [allParams] }], pgmId);
}

// ─────────────────────────────────────────────────────────────────────────────
// CSRF 캐시 + fetch
// ─────────────────────────────────────────────────────────────────────────────
// 세션이 유지되는 동안 csrfKey는 그대로이므로, spec 실행 프로세스 내에서만
// 유효한 간단한 캐시를 둔다. 브라우저 컨텍스트별로 다를 수 있으므로 Page 객체를
// 키로 사용. TTL은 두지 않는다(세션 만료 시 fixture가 재로그인하면서
// 이 프로세스도 종료/재시작될 때 자연스레 리셋됨).

const _csrfCache = new WeakMap<Page, string>();

export function invalidateCsrfKey(page: Page): void {
  _csrfCache.delete(page);
}

export async function fetchCsrfKey(page: Page): Promise<string> {
  const cached = _csrfCache.get(page);
  if (cached) return cached;

  const { status, body } = await page.evaluate(
    async (url: string) => {
      const resp = await fetch(url, { credentials: 'include' });
      return { status: resp.status, body: await resp.text() };
    },
    `${BASE_URL()}/common/frame/getSessionKey.do`
  );
  if (status !== 200) throw new Error(`getSessionKey HTTP ${status}`);
  const match = body.match(/<Parameter id="csrfKey"[^>]*>([^<]*)<\/Parameter>/);
  if (!match?.[1]) throw new Error(`csrfKey 미발견: ${body.substring(0, 300)}`);

  _csrfCache.set(page, match[1]);
  return match[1];
}

/**
 * 브라우저 컨텍스트에서 fetch 로 XML POST.
 * page.request.post 가 아닌 page.evaluate(fetch) 를 쓰는 이유:
 *   - 브라우저 세션 쿠키/CSRF가 자연스럽게 유지됨
 *   - testCode_*.spec.ts 기존 방식과 동일 semantic
 */
export async function apiPost(
  page: Page,
  endpoint: string,
  xml: string
): Promise<Response> {
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
  } as unknown as Response;
}

// ─────────────────────────────────────────────────────────────────────────────
// 서버 세션 폼 등록 (menuId/pgmId → formKey)
// ─────────────────────────────────────────────────────────────────────────────
// Nexacro 서버는 openMenuById(또는 openMenuByPgm)로 폼을 서버 세션에 등록한 후에만
// API 호출을 허용한다. 세션 등록은 (menuId 또는 pgmId) 당 1회로 충분.
// 반환값(formKey)은 실제 등록된 화면의 프레임 키.

const _sessionReady = new Map<string, string>();

/** 테스트 프로세스 재시작 없이 캐시 리셋이 필요할 때 사용 */
export function resetSessionReadyCache(): void {
  _sessionReady.clear();
}

export async function ensureSessionReady(
  page: Page,
  menuId: string,
  pgmId?: string
): Promise<string> {
  const key = menuId || pgmId || '';
  if (!key) return '';
  if (_sessionReady.has(key)) return _sessionReady.get(key)!;

  await waitForNexacroAppReady(page, 20000);
  const nav = menuId
    ? await openMenuById(page, menuId)
    : await openMenuByPgm(page, pgmId || '');

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
