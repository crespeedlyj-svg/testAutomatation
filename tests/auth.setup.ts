/**
 * 인증 설정 (Authentication Setup)
 *
 * ★ page fixture를 사용하지 않음 — Playwright가 별도 브라우저를 생성하지 않음
 *
 * @flow
 * 1. 세션 유효성 확인 (HTTP 요청만) → 유효하면 브라우저 없이 즉시 종료
 * 2. CDP 모드(start-browser.js 실행 중): 기존 Chrome 창에서 로그인 → 창 유지
 * 3. CDP 없음: headless 브라우저로 로그인 → Storage State 저장 → 브라우저 닫음(창 없음)
 */

import { test as setup, request, chromium, type Page, type Browser } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const CONFIG = {
  loginUrl:     process.env.APP_LOGIN_URL     ?? 'http://127.0.0.1:8088/testLogin.do',
  baseUrl:      process.env.APP_BASE_URL      ?? 'http://127.0.0.1:8088',
  searchUserNm: process.env.APP_SEARCH_USER_NM ?? '',
  systemId:     process.env.APP_SYSTEM_ID      ?? 'MIS',
};

export const STORAGE_STATE = path.join(__dirname, '../.auth/user.json');
const WS_FILE              = path.join(__dirname, '../.auth/browser-ws.json');

// ── 세션 유효성 확인 (HTTP 요청만, 브라우저 불필요) ──────────────────────
async function isSessionAlive(): Promise<boolean> {
  if (!fs.existsSync(STORAGE_STATE)) return false;
  try {
    const ctx  = await request.newContext({ baseURL: CONFIG.baseUrl, storageState: STORAGE_STATE, ignoreHTTPSErrors: true });
    const resp = await ctx.get(`/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_${CONFIG.systemId}`, { maxRedirects: 5 });
    const url  = resp.url();
    const ok   = resp.status() === 200 && url.includes('index.jsp') && url.includes(`UPP_MENU_ID=M_${CONFIG.systemId}`);

    if (ok && CONFIG.searchUserNm) {
      const ur = await ctx.get('/ai/getLoginUserName.do', { maxRedirects: 0 }).catch(() => null);
      if (ur?.status() === 200) {
        const body = await ur.text();
        if (!body.includes(CONFIG.searchUserNm)) {
          console.log(`  사용자 불일치: 세션=${body.trim()} / 기대=${CONFIG.searchUserNm}`);
          await ctx.dispose();
          return false;
        }
      }
    }

    await ctx.dispose();
    console.log(`  세션 확인: ${url} → ${ok ? '✅ 유효' : '❌ 만료'}`);
    return ok;
  } catch (e: any) {
    console.log(`  세션 확인 오류: ${e.message}`);
    return false;
  }
}

// ── CDP 모드: 기존 Chrome에서 page 획득 (창 유지됨) ─────────────────────
async function getCdpPage(): Promise<Page | null> {
  if (!fs.existsSync(WS_FILE)) return null;
  try {
    const { cdpUrl = 'http://localhost:9222' } = JSON.parse(fs.readFileSync(WS_FILE, 'utf-8'));
    const browser  = await chromium.connectOverCDP(cdpUrl, { timeout: 3000 });
    const contexts = browser.contexts();
    const ctx      = contexts[0] ?? await browser.newContext({ ignoreHTTPSErrors: true });
    const pg       = ctx.pages().find(p => !p.isClosed()) ?? await ctx.newPage();
    console.log('[setup] CDP Chrome 연결 — setup 종료 후에도 창이 닫히지 않습니다.');
    return pg;
  } catch {
    console.log('[setup] CDP 없음 — headless 브라우저로 로그인합니다.');
    return null;
  }
}

// ── 일시적 전송계층 오류(서버 TCP 리셋 등)에 견디는 goto 재시도 ──────────────
// ERR_CONNECTION_RESET / ECONNRESET 등은 HTTP 애플리케이션 오류(500)가 아니라
// 서버가 TCP 연결을 끊은 일시 현상이다. 한 번의 일시 오류로 로그인 setup 전체가
// 실패하지 않도록 점진적 백오프로 재시도한다.
async function gotoWithRetry(page: Page, url: string, attempts = 3): Promise<void> {
  const TRANSIENT =
    /ERR_CONNECTION_RESET|ECONNRESET|ERR_CONNECTION_REFUSED|ERR_CONNECTION_CLOSED|ERR_EMPTY_RESPONSE|ERR_NETWORK_CHANGED|ERR_ABORTED|socket hang up/i;
  let lastErr: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      return;
    } catch (e: any) {
      lastErr = e;
      const msg = String(e?.message ?? e);
      if (!TRANSIENT.test(msg) || i === attempts) throw lastErr;
      console.warn(`  [로그인 goto 일시 오류 — 재시도 ${i}/${attempts - 1}] ${msg.split('\n')[0]}`);
      await page.waitForTimeout(1500 * i);  // 1.5s, 3.0s 점진 백오프
    }
  }
  throw lastErr;
}

// ── 로그인 실행 ──────────────────────────────────────────────────────────
async function doLogin(page: Page): Promise<void> {
  console.log(`\n로그인 시작: ${CONFIG.loginUrl}`);

  page.removeAllListeners('dialog');
  page.on('dialog', async (d) => {
    console.log(`  다이얼로그: ${d.message()}`);
    try { await d.accept(); } catch { /* No dialog is showing — 이미 처리됨 */ }
  });

  await gotoWithRetry(page, CONFIG.loginUrl);

  // 리다이렉트 감지 — 이미 로그인된 세션이면 index.jsp로 이동됨
  const afterGotoUrl = page.url();
  if (afterGotoUrl.includes('index.jsp')) {
    console.log(`  이미 로그인된 세션 감지 (${afterGotoUrl}) — 로그인 스킵`);
    await page.context().storageState({ path: STORAGE_STATE });
    return;
  }

  // 시스템 라디오 선택
  const radio = page.locator(`input[name="sysId"][value="M_${CONFIG.systemId}"]`);
  if (await radio.count() > 0) await radio.check();

  // 사용자 검색
  await page.waitForSelector('input[name="SCH_USER_NM"]', { timeout: 20000 });
  await page.fill('input[name="SCH_USER_NM"]', CONFIG.searchUserNm);

  // 검색 버튼 클릭 — href/onclick/버튼 형태 모두 대응
  const searchBtn = page.locator([
    'a[href*="doAction"]',
    'a[onclick*="doAction"]',
    'button:has-text("검색")',
    'input[type="button"][value="검색"]',
    'input[type="submit"][value="검색"]',
  ].join(', ')).first();

  if (await searchBtn.count() > 0) {
    await searchBtn.click();
  } else {
    // 버튼을 못 찾으면 Enter 키로 폼 제출
    await page.locator('input[name="SCH_USER_NM"]').press('Enter');
  }
  await page.waitForLoadState('domcontentloaded');

  // 첫 번째 결과 더블클릭
  await page.waitForSelector('table.tb_02 tbody tr td a', { timeout: 10000 });
  const rowCount = await page.locator('table.tb_02 tbody tr').count();
  if (rowCount === 0) throw new Error(`사용자 "${CONFIG.searchUserNm}" 검색 결과 없음`);

  const firstLink = page.locator('table.tb_02 tbody tr').first().locator('td').nth(2).locator('a');
  console.log(`  로그인 사용자: ${(await firstLink.textContent())?.trim()}`);
  await firstLink.dblclick();
  await page.waitForTimeout(500);

  // 확인 버튼 (dialog는 핸들러가 처리)
  const confirmBtn = page.locator('button:has-text("확인"), input[type="button"][value="확인"]').first();
  if (await confirmBtn.isVisible({ timeout: 1500 }).catch(() => false)) await confirmBtn.click();

  // index.jsp 도달 대기
  console.log('  index.jsp 도달 대기...');
  await page.waitForURL(
    url => url.includes('index.jsp') && url.includes(`UPP_MENU_ID=M_${CONFIG.systemId}`),
    { timeout: 30000, waitUntil: 'domcontentloaded' }
  ).catch(async () => {
    // 앱이 스스로 index.jsp로 이동 중이면 아래 goto가 "interrupted by another
    // navigation" 으로 충돌할 수 있다. 이는 앱이 같은 목적지로 이동 중이라는 의미이므로
    // 충돌 에러는 무시하고, 실제 index.jsp 도달 여부를 다시 한 번 대기로 확인한다.
    await page.goto(
      `${CONFIG.baseUrl}/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_${CONFIG.systemId}`,
      { waitUntil: 'domcontentloaded', timeout: 30000 }
    ).catch(() => { /* 앱 자체 네비게이션과 경합 — 무시 */ });
    await page.waitForURL(
      url => url.includes('index.jsp'),
      { timeout: 30000, waitUntil: 'domcontentloaded' }
    ).catch(() => { /* 최종 URL 검증은 아래 finalUrl 체크에서 수행 */ });
  });

  await page.waitForTimeout(2000);

  const finalUrl = page.url();
  if (!finalUrl.includes('index.jsp')) {
    throw new Error(`로그인 실패. 현재 URL: ${finalUrl}`);
  }
  console.log(`✅ 로그인 성공: ${finalUrl}`);
}

// ══════════════════════════════════════════════════════════════════════════════
// authenticate — page fixture 없음: Playwright가 별도 브라우저를 생성하지 않음
// ══════════════════════════════════════════════════════════════════════════════
setup('authenticate', async () => {
  if (!CONFIG.searchUserNm) {
    setup.skip(true, '환경변수 APP_SEARCH_USER_NM을 설정하세요.');
    return;
  }

  // 1. 세션 유효 → 브라우저 없이 즉시 종료 (창 변화 없음)
  console.log('\n기존 세션 확인 중...');
  const alive = await isSessionAlive();
  console.log(alive
    ? '✅ 세션 유효 — 로그인 스킵 (브라우저 불필요)'
    : '⚠️  세션 만료/없음 — 로그인 진행');
  if (alive) return;

  // 2. CDP 모드: 기존 Chrome 창 사용 → setup 종료 후 창 유지
  const cdpPage = await getCdpPage();
  if (cdpPage) {
    await doLogin(cdpPage);
    await cdpPage.context().storageState({ path: STORAGE_STATE });
    console.log(`✅ Storage State 저장: ${STORAGE_STATE}`);
    return;
    // CDP 브라우저는 닫지 않음 — start-browser.js가 관리
  }

  // 3. CDP 없음: headless 브라우저 사용 → 창 안 보임, 종료 시 자동 닫힘
  let browser: Browser | undefined;
  try {
    browser = await chromium.launch({ headless: true });
    const ctx  = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    await doLogin(page);
    await ctx.storageState({ path: STORAGE_STATE });
    console.log(`✅ Storage State 저장: ${STORAGE_STATE}`);
  } finally {
    await browser?.close(); // headless라 창 없음 — 닫아도 무방
  }
});
