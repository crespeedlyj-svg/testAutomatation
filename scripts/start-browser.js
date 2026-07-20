/**
 * start-browser.js
 *
 * Chrome을 CDP(원격 디버깅) 모드로 실행하고 접속 정보를 .auth/browser-ws.json에 저장합니다.
 * Playwright 테스트가 이 Chrome에 연결하여 테스트 간 창을 유지합니다.
 *
 * 사용법:
 *   node scripts/start-browser.js
 *
 * 이후 테스트 실행:
 *   npx playwright test ... --headed --project=unit
 */

const { chromium } = require('@playwright/test');
const fs   = require('fs');
const path = require('path');

const WS_FILE = path.join(__dirname, '../.auth/browser-ws.json');
const CDP_PORT = 9222;

(async () => {
  console.log('[start-browser] Chrome 시작 중...');

  const browser = await chromium.launch({
    headless: false,
    args: [
      `--remote-debugging-port=${CDP_PORT}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--start-maximized',
    ],
  });

  const cdpUrl = `http://localhost:${CDP_PORT}`;

  fs.writeFileSync(WS_FILE, JSON.stringify({ cdpUrl }, null, 2), 'utf-8');
  console.log(`[start-browser] CDP URL: ${cdpUrl}`);
  console.log(`[start-browser] 접속 정보 저장: ${WS_FILE}`);
  console.log('[start-browser] Chrome이 실행 중입니다. 종료하려면 Ctrl+C를 누르세요.');

  // 프로세스 종료 시 WS_FILE 삭제
  const cleanup = () => {
    try {
      fs.unlinkSync(WS_FILE);
      console.log('\n[start-browser] browser-ws.json 삭제 완료');
    } catch { }
    process.exit(0);
  };

  process.on('SIGINT',  cleanup);
  process.on('SIGTERM', cleanup);

  // Chrome이 종료되면 이 프로세스도 종료
  browser.on('disconnected', () => {
    console.log('[start-browser] Chrome 종료됨');
    cleanup();
  });
})();
