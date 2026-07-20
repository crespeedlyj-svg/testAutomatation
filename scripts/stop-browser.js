/**
 * stop-browser.js
 *
 * start-browser.js로 실행 중인 CDP Chrome을 종료합니다.
 * .auth/browser-ws.json의 CDP 엔드포인트에 연결해 browser.close()를 호출하면
 * start-browser.js 쪽의 'disconnected' 핸들러가 파일 정리 및 프로세스 종료를 이어서 처리합니다.
 *
 * 사용법:
 *   node scripts/stop-browser.js
 */

const { chromium } = require('@playwright/test');
const fs   = require('fs');
const path = require('path');

const WS_FILE = path.join(__dirname, '../.auth/browser-ws.json');

(async () => {
  if (!fs.existsSync(WS_FILE)) {
    console.log('[stop-browser] browser-ws.json 없음 — 실행 중인 CDP Chrome이 없습니다.');
    return;
  }

  let cdpUrl = 'http://localhost:9222';
  try {
    const wsInfo = JSON.parse(fs.readFileSync(WS_FILE, 'utf-8'));
    cdpUrl = wsInfo.cdpUrl ?? cdpUrl;
  } catch { /* JSON 파싱 실패 — 기본 포트로 시도 */ }

  try {
    const browser = await chromium.connectOverCDP(cdpUrl, { timeout: 5000 });
    await browser.close();
    console.log('[stop-browser] Chrome 종료 요청 완료');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`[stop-browser] CDP 연결 실패 (${cdpUrl}): ${msg} — 이미 종료되었을 수 있습니다.`);
  } finally {
    // start-browser.js가 비정상 종료되어 스스로 정리하지 못한 경우 대비
    try { fs.unlinkSync(WS_FILE); } catch { /* 이미 삭제됨 */ }
  }
})();
