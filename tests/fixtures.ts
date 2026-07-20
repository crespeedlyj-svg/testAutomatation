/**
 * fixtures.ts
 *
 * ── 목적 ──────────────────────────────────────────────────────────────────────
 * 브라우저 창을 TC 간에 유지하면서, TC마다 URL 복구 체크를 수행합니다.
 *
 *   _workerContext (worker-scoped): BrowserContext를 전체 실행 내내 유지
 *   workerPage     (test-scoped):   TC마다 실행 — Nexacro 앱 이탈 시 자동 재이동
 *
 * ── CDP 영속 브라우저 모드 ──────────────────────────────────────────────────
 * `node scripts/start-browser.js` 로 Chrome을 미리 실행해 두면,
 * 이 픽스처가 .auth/browser-ws.json 의 CDP 엔드포인트에 자동으로 연결합니다.
 * 테스트가 끝나도 Chrome 창이 닫히지 않고 다음 실행에서 재사용됩니다.
 *
 * CDP 브라우저가 없을 때는 Playwright 기본 브라우저(headless/headed)로 폴백합니다.
 *
 * ── 사용법 ────────────────────────────────────────────────────────────────────
 * import { test, expect } from '../fixtures';
 *
 * test('TC001', async ({ workerPage: page }) => {
 *   // 기존 page 변수명 그대로 사용 가능
 * });
 */

import { test as base, BrowserContext, Page, chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const STORAGE_STATE = path.join(__dirname, '../.auth/user.json');
const WS_FILE      = path.join(__dirname, '../.auth/browser-ws.json');

const LOGIN_CONFIG = {
  loginUrl:     process.env.APP_LOGIN_URL     ?? 'http://127.0.0.1:8088/testLogin.do',
  searchUserNm: process.env.APP_SEARCH_USER_NM ?? '관리자',
  systemId:     process.env.APP_SYSTEM_ID      ?? 'MIS',
};

// ── testLogin.do 자동 로그인 ────────────────────────────────────────────────
async function performLogin(page: Page): Promise<void> {
  console.log('[fixture:login] 세션 만료 — testLogin.do 재로그인 시작');

  // dialog 핸들러 (이미 등록되어 있을 수 있으므로 removeAllListeners 후 재등록)
  page.removeAllListeners('dialog');
  page.on('dialog', async (d) => {
    try { await d.accept(); } catch { /* No dialog is showing — 이미 처리됨 */ }
  });

  await page.goto(LOGIN_CONFIG.loginUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // 이미 로그인된 세션이면 리다이렉트됨 — 그대로 진행
  if (page.url().includes('index.jsp')) {
    console.log('[fixture:login] 이미 세션 유효 — 재로그인 스킵');
    await page.context().storageState({ path: STORAGE_STATE });
    return;
  }

  // 시스템 라디오 선택
  const radio = page.locator(`input[name="sysId"][value="M_${LOGIN_CONFIG.systemId}"]`);
  if (await radio.count() > 0) await radio.check();

  // 사용자 검색
  await page.waitForSelector('input[name="SCH_USER_NM"]', { timeout: 15000 });
  await page.fill('input[name="SCH_USER_NM"]', LOGIN_CONFIG.searchUserNm);

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
    await page.locator('input[name="SCH_USER_NM"]').press('Enter');
  }
  await page.waitForLoadState('domcontentloaded');

  // 첫 번째 결과 더블클릭
  const firstLink = page.locator('table.tb_02 tbody tr').first().locator('td').nth(2).locator('a');
  await firstLink.waitFor({ timeout: 10000 });
  await firstLink.dblclick();
  await page.waitForTimeout(500);

  // [확인] 버튼이 DOM 요소로 있으면 클릭 (confirm dialog는 핸들러가 수락)
  const confirmBtn = page.locator('button:has-text("확인"), input[type="button"][value="확인"]').first();
  if (await confirmBtn.isVisible({ timeout: 1500 }).catch(() => false)) await confirmBtn.click();

  // 메인 페이지 로드 대기 — index.jsp 도달까지 폴링
  await page.waitForURL(
    url => url.includes('index.jsp') && url.includes(`UPP_MENU_ID=M_${LOGIN_CONFIG.systemId}`),
    { timeout: 30000, waitUntil: 'domcontentloaded' }
  ).catch(async () => {
    const mainUrl = `${process.env.APP_BASE_URL ?? 'http://127.0.0.1:8088'}/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_${LOGIN_CONFIG.systemId}`;
    await page.goto(mainUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  });
  await page.waitForTimeout(2000);

  // Storage State 갱신
  const authDir = path.dirname(STORAGE_STATE);
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
  await page.context().storageState({ path: STORAGE_STATE });

  console.log('[fixture:login] 재로그인 완료 — Storage State 갱신');
}

// ── 모듈 레벨 싱글톤 ─────────────────────────────────────────────────────────
// Playwright는 spec 파일이 바뀔 때마다 worker-scoped fixture를 재생성한다.
// 재생성 시 context.close() → 화면 종료 → 다시 열리는 현상 방지를 위해
// 컨텍스트를 모듈 변수에 보관하여 재사용한다.
let _sharedContext: BrowserContext | undefined;
let _sharedIsCdp   = false;

// ── 다이얼로그 에러 수집 ─────────────────────────────────────────────────────
// TC 실행 중 서버 오류(BadSqlGrammarException, ORA-xxxxx, CSRF 오류 등)가
// dialog로 표시되면, 개별 TC의 어서션이 이를 못 잡아도(예: rowCount>=0처럼
// 느슨한 조건) "에러 다이얼로그가 하나라도 떴다"는 사실 자체로 미통과 처리한다.
// currentTestDialogErrors는 workerPage 픽스처가 TC마다 새로 비워주고,
// dialog 핸들러는 클로저로 항상 "현재" 배열을 참조한다.
let currentTestDialogErrors: string[] = [];

/** dialog 메시지가 서버/시스템 오류로 보이는지 판별 */
function isErrorDialogMessage(msg: string): boolean {
  return /Exception|ErrorCode|SQLSyntaxErrorException|SqlMapClient|NestedSQLException|ORA-\d{5}|CSRF|오류/i.test(msg);
}

const CONFIG = {
  indexUrl: `${process.env.APP_BASE_URL ?? ''}/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_${process.env.APP_SYSTEM_ID ?? 'MIS'}`,
};

// workerPage는 test-scoped: TC마다 URL 체크 + 필요 시 재이동
// _workerContext는 worker-scoped: BrowserContext(창)은 전체 실행 내내 유지
type TestFixtures = {
  workerPage: Page;
};
type WorkerFixtures = {
  _workerContext: BrowserContext;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // ── 공유 BrowserContext (spec 파일 전환 후에도 창 유지) ─────────────────────
  _workerContext: [
    async ({ browser }, use) => {
      // ─── ① 모듈 싱글톤 재사용 (spec 파일이 바뀌어도 같은 창 유지) ──────────
      if (_sharedContext) {
        try {
          _sharedContext.pages(); // 컨텍스트 살아있는지 확인 (죽으면 throw)
          console.log(`[fixture] 기존 컨텍스트 재사용 (${_sharedIsCdp ? 'CDP' : 'Playwright'})`);
          await use(_sharedContext);
          return; // teardown 없이 종료 — 컨텍스트 유지
        } catch {
          console.log('[fixture] 기존 컨텍스트 무효 — 재생성');
          _sharedContext = undefined;
        }
      }

      let context: BrowserContext | undefined;
      let isCdp = false;

      // ─── ② CDP 연결 시도 (start-browser.js로 실행된 Chrome) ─────────────────
      if (fs.existsSync(WS_FILE)) {
        let wsInfo: { cdpUrl?: string; wsEndpoint?: string } = {};
        try {
          wsInfo = JSON.parse(fs.readFileSync(WS_FILE, 'utf-8'));
        } catch { /* JSON 파싱 실패 — 폴백 */ }

        const cdpUrl = wsInfo.cdpUrl ?? 'http://localhost:9222';

        try {
          const cdpBrowser = await chromium.connectOverCDP(cdpUrl, { timeout: 3000 });
          const existing = cdpBrowser.contexts();
          if (existing.length > 0) {
            context = existing[0];
            console.log('[fixture] 기존 CDP 컨텍스트 재사용');
          } else {
            context = await cdpBrowser.newContext({
              ignoreHTTPSErrors: true,
              viewport: { width: 1920, height: 1080 },
              locale: 'ko-KR',
              timezoneId: 'Asia/Seoul',
              acceptDownloads: true,
            });
            console.log('[fixture] CDP 브라우저에 새 컨텍스트 생성');
          }
          isCdp = true;
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          console.log(`[fixture] CDP 연결 실패 (${cdpUrl}): ${msg} — Playwright 폴백`);
        }
      }

      // ─── ③ 폴백: Playwright 기본 browser 픽스처 ────────────────────────────
      if (!context) {
        context = await browser.newContext({
          storageState: STORAGE_STATE,
          ignoreHTTPSErrors: true,
          viewport: { width: 1920, height: 1080 },
          locale: 'ko-KR',
          timezoneId: 'Asia/Seoul',
          acceptDownloads: true,
        });
        console.log('[fixture] Playwright 브라우저 신규 컨텍스트 생성');
      }

      // 싱글톤에 보관 — 다음 spec 파일의 _workerContext 재생성 시 재사용
      _sharedContext = context;
      _sharedIsCdp   = isCdp;

      await use(context);
      // context.close() 하지 않음: 싱글톤으로 재사용 / Playwright 프로세스 종료 시 자동 정리
    },
    { scope: 'worker' },
  ],

  // ── workerPage: test-scoped (필요할 때만 index.jsp로 복귀) — 창은 _workerContext가 유지 ──
  workerPage: async ({ _workerContext }, use) => {
    // 이 TC의 다이얼로그 에러 수집을 새로 시작 (이전 TC의 에러가 섞이지 않도록)
    currentTestDialogErrors = [];

    // 이미 열린 페이지가 있으면 재사용, 없으면 새로 생성
    let pg = _workerContext.pages().find((p) => !p.isClosed());
    const isNewPage = !pg;

    if (!pg) {
      pg = await _workerContext.newPage();

      // dialog 핸들러 — 페이지 전체 수명 동안 유지 (중복 등록 방지)
      pg.on('dialog', async (dialog) => {
        const msg = dialog.message();
        if (msg.toUpperCase().includes('CSRF')) {
          console.log(`  [DIALOG][CSRF] CSRF ERROR 팝업 — 확인 클릭 후 계속 진행: "${msg}"`);
        } else {
          console.log(`  [DIALOG] ${msg}`);
        }
        if (isErrorDialogMessage(msg)) currentTestDialogErrors.push(msg);
        // ★ pauseMs 대기 제거 — 대기 중 dialog가 사라지면 accept() 에러 발생
        try { await dialog.accept(); } catch { /* No dialog is showing — 이미 처리됨 */ }
      });
    }

    // ── index.jsp 복귀는 "필요할 때만" ──────────────────────────────────────
    // 이전에는 TC마다 무조건 index.jsp로 리로드 → 화면이 매번 꺼졌다 켜지는 것처럼 보이고
    // navigateToXxx()의 "①이미 열려있음" 최적화도 항상 무효화됨.
    // 새로 연 페이지이거나 앱(/nxui/) 밖으로 벗어난 경우에만 복귀하고, 그 외에는
    // 직전 TC가 남긴 화면 그대로 두어 navigateToXxx()가 현재 창에서 메뉴를 찾아 이동하게 한다.
    const isInApp = pg.url().includes('/nxui/');
    if (isNewPage || !isInApp) {
      console.log('[fixture] 앱 URL로 이동:', CONFIG.indexUrl);
      await pg.goto(CONFIG.indexUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

      // 세션 만료 감지 — index.jsp에 도달하지 못하면 재로그인
      const landedUrl = pg.url();
      const isSessionExpired = !landedUrl.includes('/nxui/') || !landedUrl.includes('index.jsp');
      if (isSessionExpired) {
        console.log(`[fixture] 세션 만료 감지 (현재 URL: ${landedUrl}) — testLogin.do 재로그인`);
        await performLogin(pg);
        // 재로그인 후 index.jsp로 재이동
        await pg.goto(CONFIG.indexUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        if (!pg.url().includes('index.jsp')) {
          throw new Error(`[fixture] 재로그인 후에도 세션 확립 실패 (URL: ${pg.url()}) — .env 설정 확인`);
        }
      }
    } else {
      console.log('[fixture] 이전 TC 화면 유지 — 현재 창에서 메뉴 탐색으로 진행 (URL:', pg.url(), ')');
    }

    // ── UNIT_FAST 모드 ─────────────────────────────────────────────────────
    // API-direct 단위 테스트는 page.request.post(=context 쿠키)만 사용하고
    // Nexacro UI/GNB를 전혀 조작하지 않는다. 이 경우 30s Nexacro 초기화 대기는
    // 순수 낭비이므로 UNIT_FAST=1 일 때 스킵한다. (기본 동작은 변경 없음)
    // 결과(응답/검증)는 동일하며, 실패 시 스크린샷은 index.jsp 로딩 화면으로 대체된다.
    if (process.env.UNIT_FAST === '1') {
      console.log('[fixture] UNIT_FAST=1 — Nexacro 초기화 대기 스킵 (API-direct 단위 테스트)');
      await use(pg);
      if (currentTestDialogErrors.length > 0) {
        throw new Error(`[fixture] TC 실행 중 서버 오류 다이얼로그 ${currentTestDialogErrors.length}건 감지 — 미통과 처리:\n${currentTestDialogErrors.join('\n---\n')}`);
      }
      return;
    }

    // Nexacro 앱 초기화 대기 — domcontentloaded 이후 비동기로 초기화되므로 GNB 클릭 전 필수
    console.log('[fixture] Nexacro 앱 초기화 대기...');
    const nexacroReady = await pg.waitForFunction(
      () => {
        try {
          const app = (window as any).nexacro?.getApplication();
          return !!app?.mainframe?.VFrameSet?.HFrameSet;
        } catch { return false; }
      },
      { timeout: 30000 }
    ).then(() => true).catch(() => false);

    if (nexacroReady) {
      console.log('[fixture] ✅ Nexacro 앱 초기화 완료');
    } else {
      console.log('[fixture] ⚠️  Nexacro 초기화 타임아웃 — GNB 클릭이 실패할 수 있음');
    }

    await use(pg);
    // 페이지를 닫지 않음 — CDP 모드: 창 유지 / Playwright 모드: _workerContext.close() 시 자동 정리
    if (currentTestDialogErrors.length > 0) {
      throw new Error(`[fixture] TC 실행 중 서버 오류 다이얼로그 ${currentTestDialogErrors.length}건 감지 — 미통과 처리:\n${currentTestDialogErrors.join('\n---\n')}`);
    }
  },
});

export { expect } from '@playwright/test';
