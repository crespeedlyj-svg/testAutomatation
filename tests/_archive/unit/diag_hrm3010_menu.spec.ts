// ==============================================================
// 진단용 — hrm_3010M 메뉴 ID 확인
// 실행: npx playwright test diag_hrm3010_menu --project=unit --headed
// 결과를 보고 MENU_ID를 통합 테스트에 복사하세요
// ==============================================================
import { test, expect } from '../fixtures';

test('hrm_3010M 메뉴 ID 탐색', async ({ workerPage: page }) => {
  // ds_menu 전체 행을 읽어 hrm_3010 관련 메뉴 출력
  const result = await page.evaluate(() => {
    try {
      const app      = (window as any).nexacro?.getApplication();
      const leftForm = app?.mainframe?.VFrameSet?.HFrameSet?.LeftFrame?.form;
      const ds       = leftForm?.ds_menu ?? app?.gds_menu;
      if (!ds) return { error: 'ds_menu 없음', rows: [] };

      const rows: any[] = [];
      for (let i = 0; i < ds.rowcount; i++) {
        const pgmPath  = String(ds.getColumn(i, 'PGM_PATH')  ?? '');
        const menuId   = String(ds.getColumn(i, 'MENU_ID')   ?? '');
        const menuNm   = String(ds.getColumn(i, 'MENU_NM')   ?? '');
        const upMenuId = String(ds.getColumn(i, 'UP_MENU_ID') ?? '');
        // hrm 관련 메뉴 또는 인사정보 키워드 포함
        if (
          pgmPath.includes('hrm_3010') ||
          menuNm.includes('인사정보관리') ||
          menuNm.includes('인사정보') ||
          menuId.includes('01_03')
        ) {
          rows.push({ menuId, menuNm, pgmPath, upMenuId });
        }
      }

      // 못 찾으면 전체 hrm 메뉴 출력
      if (rows.length === 0) {
        for (let i = 0; i < ds.rowcount; i++) {
          const pgmPath = String(ds.getColumn(i, 'PGM_PATH') ?? '');
          const menuId  = String(ds.getColumn(i, 'MENU_ID')  ?? '');
          const menuNm  = String(ds.getColumn(i, 'MENU_NM')  ?? '');
          if (pgmPath.includes('hrm') || menuNm.includes('인사')) {
            rows.push({ menuId, menuNm, pgmPath });
          }
        }
      }

      return { total: ds.rowcount, found: rows.length, rows };
    } catch (e: any) {
      return { error: e.message, rows: [] };
    }
  });

  console.log('\n=== hrm_3010M 메뉴 탐색 결과 ===');
  console.log(JSON.stringify(result, null, 2));

  // 결과가 있으면 첫 번째 항목의 MENU_ID 출력
  if (result.rows && result.rows.length > 0) {
    console.log('\n>>> 후보 MENU_ID:');
    result.rows.forEach((r: any) => {
      console.log(`  ${r.menuId} | ${r.menuNm} | ${r.pgmPath}`);
    });
  } else {
    console.log('>>> hrm_3010M 관련 메뉴를 찾지 못했습니다.');
    console.log('>>> 아래는 ds_menu 첫 5개 컬럼 이름입니다:');
    // 컬럼 목록 출력
    const colNames = await page.evaluate(() => {
      try {
        const app      = (window as any).nexacro?.getApplication();
        const leftForm = app?.mainframe?.VFrameSet?.HFrameSet?.LeftFrame?.form;
        const ds       = leftForm?.ds_menu ?? app?.gds_menu;
        if (!ds) return [];
        const cols = [];
        for (let j = 0; j < ds.colcount; j++) cols.push(ds.getColID(j));
        return cols;
      } catch { return []; }
    });
    console.log('  ds_menu 컬럼:', colNames);
  }

  // 진단이 목적이므로 항상 PASS
  expect(true).toBe(true);
});
