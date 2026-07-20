// ==============================================================
// PUR — 직접구매지급신청 단위 테스트
// 생성일시: 2026-06-21  |  파일: 20260621_193005_unit.spec.ts
// 생성자: SYSTEM
// 메뉴 경로: 구매관리 > 구매요구 > 직접구매지급신청
// beforeAll에서 메뉴 진입 1회 수행 후 각 TC는 API 직접 호출
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page, Frame } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import { assertNexacroResponse } from '../utils/nexacro-helper';

const BASE_URL       = process.env.APP_BASE_URL  ?? '';
const SYSTEM_ID      = process.env.APP_SYSTEM_ID ?? 'MIS';
const SCREENSHOT_DIR = 'test-results/screenshots';

const CONFIG = {
  indexUrl:       `${BASE_URL}/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_${SYSTEM_ID}`,
  defaultTimeout: 15000,
  // 메뉴 경로: 구매관리 > 구매요구 > 직접구매지급신청
  gnbName:        '구매관리',
  middleMenu:     '구매요구',
  menuName:       '직접구매지급신청',
};

// ── Nexacro 화면 로드 확인 ──────────────────────────────────
async function isPur0910mLoaded(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      if (!mdi) return false;
      for (let i = 0; i < mdi.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        if (wf?.btn_search !== undefined && wf?.ds_list !== undefined) return true;
      }
      return false;
    } catch { return false; }
  }).catch(() => false);
}

// ── 모든 프레임 병렬 탐색 후 텍스트 클릭 ───────────────────
async function clickTextInAnyFrame(page: Page, text: string): Promise<boolean> {
  const results = await Promise.all(
    page.frames().map(async (frame) => {
      try {
        const el = frame.locator(`text="${text}"`).first();
        if (await el.isVisible({ timeout: 100 })) {
          await el.click();
          return true;
        }
      } catch { }
      return false;
    })
  );
  return results.some(Boolean);
}

// ── 모든 프레임 병렬 탐색 — 보이는지 확인만 ─────────────────
async function isVisibleInAnyFrame(page: Page, text: string): Promise<boolean> {
  const results = await Promise.all(
    page.frames().map(async (frame) => {
      try {
        return await frame.locator(`text="${text}"`).first().isVisible({ timeout: 100 });
      } catch { return false; }
    })
  );
  return results.some(Boolean);
}

// ── Nexacro MDI 초기화 완료 대기 ────────────────────────────
async function waitForNexacroFrame(page: Page, timeout = 45000): Promise<Frame | null> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const loaded = await isPur0910mLoaded(page);
    if (loaded) return page.mainFrame();
    await page.waitForTimeout(300);
  }
  return null;
}

// ── 메뉴 탐색: 구매관리 > 구매요구 > 직접구매지급신청 ──────────
async function navigateToPur0910m(page: Page): Promise<Frame | null> {
  // 이미 로드된 경우 생략
  if (await isPur0910mLoaded(page)) {
    console.log('  [NAV] 이미 로드됨 — 재진입 생략');
    return page.mainFrame();
  }

  // Nexacro 앱 초기화 대기
  console.log('  [NAV] Nexacro 초기화 대기 중...');
  await page.waitForFunction(
    () => { try { return !!(window as any).nexacro?.getApplication?.()?.mainframe; } catch { return false; } },
    { timeout: 30000 }
  ).catch(() => console.warn('  ⚠️  [NAV] Nexacro 초기화 30초 내 실패 — 계속 진행'));
  await page.waitForTimeout(500);

  // GNB → 중분류 → 메뉴 탐색 (최대 3회 재시도)
  for (let retry = 0; retry < 3; retry++) {
    if (retry > 0) {
      console.log(`  [NAV] GNB 재시도 (${retry + 1}회차)`);
      await page.waitForTimeout(1000);
    }

    // 1단계: GNB '구매관리' 클릭 (모든 프레임 병렬 탐색)
    let gnbClicked = false;
    for (let attempt = 0; attempt < 10 && !gnbClicked; attempt++) {
      gnbClicked = await clickTextInAnyFrame(page, CONFIG.gnbName);
      if (!gnbClicked) await page.waitForTimeout(300);
    }
    if (!gnbClicked) { console.warn('  ⚠️  [NAV] GNB 링크를 찾지 못함'); continue; }
    await page.waitForTimeout(1000);

    // 2단계: 메뉴명 직접 탐색 (대분류 클릭 시 첫 번째 중분류가 자동 펼쳐지는 경우 대응)
    // 최대 1초만 시도 — 자동 펼침이 없으면 3단계로 넘어감
    for (let i = 0; i < 5; i++) {
      if (await clickTextInAnyFrame(page, CONFIG.menuName)) {
        await page.waitForTimeout(3000);
        return await waitForNexacroFrame(page);
      }
      await page.waitForTimeout(200);
    }

    // 3단계: 중분류 클릭 후 메뉴명 탐색
    const middleClicked = await clickTextInAnyFrame(page, CONFIG.middleMenu);
    if (!middleClicked) { console.warn(`  ⚠️  [NAV] 중분류 "${CONFIG.middleMenu}" 를 찾지 못함`); continue; }
    await page.waitForTimeout(500);

    for (let i = 0; i < 15; i++) {
      if (await clickTextInAnyFrame(page, CONFIG.menuName)) {
        await page.waitForTimeout(3000);
        return await waitForNexacroFrame(page);
      }
      await page.waitForTimeout(300);
    }
    console.warn(`  ⚠️  [NAV] "${CONFIG.menuName}" 를 찾지 못함`);
  }

  console.error('  ❌  [NAV] 모든 retry 실패 — null 반환');
  return null;
}

// ── Nexacro XML 요청 본문 생성 ──────────────────────────────
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
  return page.request.post(endpoint, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    data: xml,
  });
}

test.describe('직접구매지급신청 단위 테스트', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });

  // TC마다 메뉴 진입 확인 — workerPage 픽스처가 URL 체크, navigateToPur0910m이 로드 여부 확인
  test.beforeEach(async ({ workerPage: page }) => {
    const frame = await navigateToPur0910m(page);
    if (!frame) throw new Error(`메뉴 진입 실패: ${CONFIG.gnbName} > ${CONFIG.middleMenu} > ${CONFIG.menuName}`);
  });

  test.afterAll(() => { flushLogs(); });

  /**
   * [no:1] [단위] [SELECT] getList — 기간 조회 (연초~오늘)
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: ds_list 0건 이상 반환 (HTTP 200, ErrorCode=0)
   */
  test('[no:1] [단위] [SELECT] getList — 기간 조회 (연초~오늘)', async ({ workerPage: page }) => {
    logTestStart('[no:1] [단위] getList — 기간 조회 (연초~오늘)');

    logInput('ds_search.RQST_SDT', '20260101');
    logInput('ds_search.RQST_EDT', '20260621');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT'],
        rows: [{ 'RQST_SDT': '20260101', 'RQST_EDT': '20260621' }],
      }], 'PUR_0910M')
    );

    await assertNexacroResponse(resp, 'getList.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-1-getList.png`, fullPage: true });
  });

  /**
   * [no:2] [단위] [SELECT] getList — 결재상태 필터 (APV_STAT_CD)
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 결재상태=10 인 목록만 반환
   */
  test('[no:2] [단위] [SELECT] getList — 결재상태 필터 (APV_STAT_CD)', async ({ workerPage: page }) => {
    logTestStart('[no:2] [단위] getList — 결재상태 필터 (APV_STAT_CD)');

    logInput('ds_search.RQST_SDT', '20260101');
    logInput('ds_search.RQST_EDT', '20260621');
    logInput('ds_search.APV_STAT_CD', '10');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'APV_STAT_CD'],
        rows: [{ 'RQST_SDT': '20260101', 'RQST_EDT': '20260621', 'APV_STAT_CD': '10' }],
      }], 'PUR_0910M')
    );

    await assertNexacroResponse(resp, 'getList.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-2-getList.png`, fullPage: true });
  });

  /**
   * [no:3] [단위] [SELECT] getList — 부서 필터 (APNT_DEPT_CD)
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 해당 부서 신청 목록 반환
   */
  test('[no:3] [단위] [SELECT] getList — 부서 필터 (APNT_DEPT_CD)', async ({ workerPage: page }) => {
    logTestStart('[no:3] [단위] getList — 부서 필터 (APNT_DEPT_CD)');

    logInput('ds_search.RQST_SDT', '20260101');
    logInput('ds_search.RQST_EDT', '20260621');
    logInput('ds_search.APNT_DEPT_CD', 'TEST_DEPT_CD');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'APNT_DEPT_CD'],
        rows: [{ 'RQST_SDT': '20260101', 'RQST_EDT': '20260621', 'APNT_DEPT_CD': 'TEST_DEPT_CD' }],
      }], 'PUR_0910M')
    );

    await assertNexacroResponse(resp, 'getList.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-3-getList.png`, fullPage: true });
  });

  /**
   * [no:4] [단위] [SELECT] getList — 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 검색어 포함 목록 반환
   */
  test('[no:4] [단위] [SELECT] getList — 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)', async ({ workerPage: page }) => {
    logTestStart('[no:4] [단위] getList — 키워드 검색 (SCH_SRCH_CLS + SCH_SRCH_KEY)');

    logInput('ds_search.RQST_SDT', '20260101');
    logInput('ds_search.RQST_EDT', '20260621');
    logInput('ds_search.SCH_SRCH_CLS', '1');
    logInput('ds_search.SCH_SRCH_KEY', '테스트');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'SCH_SRCH_CLS', 'SCH_SRCH_KEY'],
        rows: [{ 'RQST_SDT': '20260101', 'RQST_EDT': '20260621', 'SCH_SRCH_CLS': '1', 'SCH_SRCH_KEY': '테스트' }],
      }], 'PUR_0910M')
    );

    await assertNexacroResponse(resp, 'getList.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-4-getList.png`, fullPage: true });
  });

  /**
   * [no:5] [단위] [SELECT] getList — 요청자 필터 (APNT_EMP_NO)
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 해당 사원 신청 목록 반환
   */
  test('[no:5] [단위] [SELECT] getList — 요청자 필터 (APNT_EMP_NO)', async ({ workerPage: page }) => {
    logTestStart('[no:5] [단위] getList — 요청자 필터 (APNT_EMP_NO)');

    logInput('ds_search.RQST_SDT', '20260101');
    logInput('ds_search.RQST_EDT', '20260621');
    logInput('ds_search.APNT_EMP_NO', 'TEST_EMP_NO');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: ['RQST_SDT', 'RQST_EDT', 'APNT_EMP_NO'],
        rows: [{ 'RQST_SDT': '20260101', 'RQST_EDT': '20260621', 'APNT_EMP_NO': 'TEST_EMP_NO' }],
      }], 'PUR_0910M')
    );

    await assertNexacroResponse(resp, 'getList.do');
    logResult('응답 검증', 'PASS');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-5-getList.png`, fullPage: true });
  });

  /**
   * [no:6] [단위] [비정상] getList — 빈 검색조건 (ds_search 비어있음)
   * URL: /mis/pur/pur0910/getList.do
   * 예상결과: 서버 예외 응답 또는 빈 결과 반환 — HTTP 500 아님
   */
  test('[no:6] [단위] [비정상] getList — 빈 검색조건 (ds_search 비어있음)', async ({ workerPage: page }) => {
    logTestStart('[no:6] [단위] getList — 빈 검색조건 (ds_search 비어있음)');

    const resp = await apiPost(
      page,
      `${BASE_URL}/mis/pur/pur0910/getList.do`,
      nexacroXml([{
        id: 'ds_search',
        columns: [],
        rows: [{ /* TODO: 실제 입력값 기재 */ }],
      }], 'PUR_0910M')
    );

    const statusCode = resp.status();
    logResult('응답 상태', statusCode);
    const body = await resp.text();
    logResult('응답 본문 일부', body.substring(0, 200));
    // 시나리오 예상결과: 서버 예외 응답 또는 빈 결과 반환 — HTTP 500 아님
    expect(statusCode).not.toBe(500);
    // TODO: 에러 키워드 검증 (아래 주석 해제 후 실제 메시지 입력)
    // expect(body).toContain('에러메시지');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/test-6-getList.png`, fullPage: true });
  });

});
