import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://127.0.0.1:8088';

async function gotoTestLogin(page: Page, params?: Record<string, string>) {
  const url = new URL(`${BASE}/testLogin.do`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  await page.goto(url.toString());
  await page.waitForSelector('table.tb_02');
}

test.describe('testLogin.do - 관리자 조회 E2E', () => {

  test('페이지 로드 - 검색 폼과 결과 테이블 렌더링', async ({ page }) => {
    await gotoTestLogin(page);

    await expect(page.locator('form[name="form1"]')).toBeVisible();
    await expect(page.locator('input[name="SCH_USER_NM"]')).toBeVisible();
    await expect(page.locator('input[name="SCH_USER_ID"]')).toBeVisible();
    await expect(page.locator('input[name="SCH_DEPT_NM"]')).toBeVisible();
    await expect(page.locator('.btn_search a')).toBeVisible();
    await expect(page.locator('table.tb_02')).toBeVisible();
  });

  test('관리자 이름 검색 - 결과 목록 표시', async ({ page }) => {
    await gotoTestLogin(page);

    await page.fill('input[name="SCH_USER_NM"]', '관리자');
    await page.click('.btn_search a');

    await page.waitForSelector('table.tb_02 tbody tr');

    const rows = page.locator('table.tb_02 tbody tr');
    const rowCount = await rows.count();

    if (rowCount === 1) {
      const cellText = await rows.first().locator('td').first().textContent();
      if (cellText?.includes('등록된 데이타가 없습니다')) {
        test.skip(true, '관리자 계정이 DB에 없음 - 조회 결과 없음');
        return;
      }
    }

    expect(rowCount).toBeGreaterThan(0);

    for (let i = 0; i < rowCount; i++) {
      const nameCell = rows.nth(i).locator('td:nth-child(3)');
      const name = await nameCell.textContent();
      expect(name?.trim()).toContain('관리자');
    }
  });

  test('관리자 검색 결과 - 테이블 헤더 컬럼 검증', async ({ page }) => {
    await gotoTestLogin(page);

    const headers = page.locator('table.tb_02 thead tr th');
    await expect(headers.nth(0)).toHaveText('아이디');
    await expect(headers.nth(1)).toHaveText('사번');
    await expect(headers.nth(2)).toHaveText('성명');
    await expect(headers.nth(3)).toHaveText('부서');
    await expect(headers.nth(4)).toHaveText('이메일');
    await expect(headers.nth(5)).toHaveText('연락처');
  });

  test('관리자 검색 후 로그인 링크 클릭 - 로그인 처리', async ({ page }) => {
    await gotoTestLogin(page);

    await page.fill('input[name="SCH_USER_NM"]', '관리자');
    await page.click('.btn_search a');
    await page.waitForSelector('table.tb_02 tbody tr td a');

    const firstLink = page.locator('table.tb_02 tbody tr:first-child td:first-child a');
    const loginId = await firstLink.textContent();
    expect(loginId?.trim()).toBeTruthy();

    page.once('dialog', (d) => d.accept());

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load', timeout: 15_000 }).catch(() => {}),
      firstLink.click(),
    ]);

    await expect(page).not.toHaveURL(/testLogin/);
  });

  test('빈 검색 - 전체 목록 조회', async ({ page }) => {
    await gotoTestLogin(page);

    await page.click('.btn_search a');
    await page.waitForSelector('table.tb_02 tbody tr');

    const rows = page.locator('table.tb_02 tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('존재하지 않는 사용자 검색 - 데이터 없음 메시지', async ({ page }) => {
    await gotoTestLogin(page);

    await page.fill('input[name="SCH_USER_NM"]', 'ZZZZNOTEXIST999');
    await page.click('.btn_search a');
    await page.waitForSelector('table.tb_02 tbody tr');

    const emptyMsg = page.locator('table.tb_02 tbody tr td[colspan="6"]');
    await expect(emptyMsg).toBeVisible();
    await expect(emptyMsg).toHaveText('등록된 데이타가 없습니다.');
  });

  test('시스템 라디오버튼 - MIS 기본 선택 확인', async ({ page }) => {
    await gotoTestLogin(page);

    const misRadio = page.locator('input.sysId[value="M_MIS"]');
    await expect(misRadio).toBeChecked();

    const pmsRadio = page.locator('input.sysId[value="M_PMS"]');
    await expect(pmsRadio).not.toBeChecked();
  });

  test('관리자 ID 검색 - SCH_USER_ID 필드 사용', async ({ page }) => {
    await gotoTestLogin(page);

    await page.fill('input[name="SCH_USER_ID"]', 'admin');
    await page.click('.btn_search a');
    await page.waitForSelector('table.tb_02 tbody tr');

    const emptyRow = page.locator('table.tb_02 tbody tr td[colspan="6"]');
    const isEmpty = await emptyRow.isVisible();

    if (isEmpty) {
      // DB에 'admin' ID 사용자가 없을 수 있음 - 빈 결과 메시지 검증으로 대체
      await expect(emptyRow).toHaveText('등록된 데이타가 없습니다.');
    } else {
      const firstRow = page.locator('table.tb_02 tbody tr:first-child td:first-child');
      const idText = await firstRow.textContent();
      expect(idText?.trim().toLowerCase()).toContain('admin');
    }
  });

  test('URL 파라미터로 관리자 검색 - 페이지 로드 시 자동 조회', async ({ page }) => {
    await gotoTestLogin(page, { SCH_USER_NM: '관리자' });

    const searchInput = page.locator('input[name="SCH_USER_NM"]');
    await expect(searchInput).toHaveValue('관리자');
  });

});
