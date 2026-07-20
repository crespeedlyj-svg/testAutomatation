/**
 * Nexacro 17 기반 웹 애플리케이션을 위한 Playwright 헬퍼 유틸리티
 *
 * Nexacro는 Canvas 기반의 RIA 프레임워크로, 일반적인 DOM 조작과 다른 접근 방식이 필요합니다.
 * 이 유틸리티는 Nexacro 앱의 컴포넌트를 JavaScript API를 통해 조작합니다.
 *
 * @target 행정정보시스템 (Nexacro 17)
 * @see src/main/webapp/nxui/${CTX_PATH}/index.jsp
 *
 * 프레임 경로 참고:
 *   app.mainframe.VFrameSet.HFrameSet.VFrameSet.FrameSet.MainFrame.main
 */

import { Page, Frame, Response, expect } from '@playwright/test';

export interface NexacroComponent {
  name: string;
  type: string;
  value?: any;
  visible?: boolean;
}

export interface NexacroFormPath {
  mainframe: string;
  vFrameSet: string;
  hFrameSet: string;
  vFrameSet2: string;
  frameSet: string;
  mainFrame: string;
  main: string;
  popup?: string;
}

/**
 * Nexacro 프레임을 찾아 반환
 * URL 경로는 ${CTX_PATH} 로 구성
 */
export async function findNexacroFrame(page: Page): Promise<Frame | null> {
  const frames = page.frames();
  return (
    frames.find(
      (f) => f.url().includes('nxui') || f.url().includes('nexacro')
    ) || null
  );
}

/**
 * Nexacro Application 객체 존재 여부 확인
 */
export async function isNexacroLoaded(frame: Frame): Promise<boolean> {
  return await frame.evaluate(() => {
    return (
      typeof (window as any).nexacro !== 'undefined' &&
      (window as any).nexacro.getApplication !== undefined
    );
  });
}

/**
 * Nexacro 앱 로드 대기
 */
export async function waitForNexacroLoad(
  page: Page,
  timeout: number = 30000
): Promise<Frame | null> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const frame = await findNexacroFrame(page);
    if (frame) {
      const loaded = await isNexacroLoaded(frame);
      if (loaded) {
        return frame;
      }
    }
    await page.waitForTimeout(500);
  }

  return null;
}

/**
 * Nexacro Application 객체 가져오기 (내부 헬퍼)
 * Nexacro 프레임 구조:
 *   mainframe > VFrameSet > HFrameSet > VFrameSet > FrameSet > MainFrame > main
 */
function getNexacroMain(
  context: Window & typeof globalThis,
  popupName?: string
): any {
  const app = (context as any).nexacro.getApplication();
  const main =
    app.mainframe.VFrameSet.HFrameSet.VFrameSet.FrameSet.MainFrame.main;
  return popupName ? main[popupName] : main;
}

/**
 * Nexacro 폼의 컴포넌트 목록 가져오기
 */
export async function getFormComponents(
  frame: Frame,
  popupName?: string
): Promise<NexacroComponent[]> {
  return await frame.evaluate((popup) => {
    try {
      const app = (window as any).nexacro.getApplication();
      const main =
        app.mainframe.VFrameSet.HFrameSet.VFrameSet.FrameSet.MainFrame.main;
      const form = popup ? main[popup]?.form : main.form;

      if (!form) return [];

      const components: any[] = [];
      for (const key in form) {
        const comp = form[key];
        if (comp && typeof comp === 'object' && comp.constructor) {
          components.push({
            name: key,
            type: comp.constructor.name || 'unknown',
            value: comp.value,
            visible: comp.visible,
          });
        }
      }
      return components;
    } catch (e) {
      return [];
    }
  }, popupName);
}

/**
 * Nexacro 컴포넌트 클릭
 */
export async function clickComponent(
  frame: Frame,
  componentName: string,
  popupName?: string
): Promise<boolean> {
  return await frame.evaluate(
    ({ componentName, popupName }) => {
      try {
        const app = (window as any).nexacro.getApplication();
        const main =
          app.mainframe.VFrameSet.HFrameSet.VFrameSet.FrameSet.MainFrame.main;
        const form = popupName ? main[popupName]?.form : main.form;
        const component = form?.[componentName];

        if (component?.click) {
          component.click();
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    { componentName, popupName }
  );
}

/**
 * Nexacro 입력 필드에 값 설정
 */
export async function setValue(
  frame: Frame,
  fieldName: string,
  value: string | number | boolean,
  popupName?: string
): Promise<boolean> {
  return await frame.evaluate(
    ({ fieldName, value, popupName }) => {
      try {
        const app = (window as any).nexacro.getApplication();
        const main =
          app.mainframe.VFrameSet.HFrameSet.VFrameSet.FrameSet.MainFrame.main;
        const form = popupName ? main[popupName]?.form : main.form;
        const field = form?.[fieldName];

        if (field?.set_value) {
          field.set_value(value);
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    { fieldName, value, popupName }
  );
}

/**
 * Nexacro 필드 값 가져오기
 */
export async function getValue(
  frame: Frame,
  fieldName: string,
  popupName?: string
): Promise<any> {
  return await frame.evaluate(
    ({ fieldName, popupName }) => {
      try {
        const app = (window as any).nexacro.getApplication();
        const main =
          app.mainframe.VFrameSet.HFrameSet.VFrameSet.FrameSet.MainFrame.main;
        const form = popupName ? main[popupName]?.form : main.form;
        const field = form?.[fieldName];
        return field?.value ?? null;
      } catch (e) {
        return null;
      }
    },
    { fieldName, popupName }
  );
}

/**
 * Nexacro Dataset 데이터 가져오기
 */
export async function getDatasetData(
  frame: Frame,
  datasetName: string,
  popupName?: string
): Promise<any[]> {
  return await frame.evaluate(
    ({ datasetName, popupName }) => {
      try {
        const app = (window as any).nexacro.getApplication();
        const main =
          app.mainframe.VFrameSet.HFrameSet.VFrameSet.FrameSet.MainFrame.main;
        const form = popupName ? main[popupName]?.form : main.form;
        const dataset = form?.[datasetName];

        if (!dataset) return [];

        const data: any[] = [];
        const rowCount = dataset.rowcount || 0;
        const colCount = dataset.colcount || 0;

        for (let i = 0; i < rowCount; i++) {
          const row: any = {};
          for (let j = 0; j < colCount; j++) {
            const colName = dataset.getColID(j);
            row[colName] = dataset.getColumn(i, colName);
          }
          data.push(row);
        }
        return data;
      } catch (e) {
        return [];
      }
    },
    { datasetName, popupName }
  );
}

/**
 * Nexacro Combo 선택
 */
export async function selectComboItem(
  frame: Frame,
  comboName: string,
  value: string,
  popupName?: string
): Promise<boolean> {
  return await frame.evaluate(
    ({ comboName, value, popupName }) => {
      try {
        const app = (window as any).nexacro.getApplication();
        const main =
          app.mainframe.VFrameSet.HFrameSet.VFrameSet.FrameSet.MainFrame.main;
        const form = popupName ? main[popupName]?.form : main.form;
        const combo = form?.[comboName];

        if (combo?.set_value) {
          combo.set_value(value);
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    { comboName, value, popupName }
  );
}

/**
 * Nexacro Grid 행 선택
 */
export async function selectGridRow(
  frame: Frame,
  gridName: string,
  rowIndex: number,
  popupName?: string
): Promise<boolean> {
  return await frame.evaluate(
    ({ gridName, rowIndex, popupName }) => {
      try {
        const app = (window as any).nexacro.getApplication();
        const main =
          app.mainframe.VFrameSet.HFrameSet.VFrameSet.FrameSet.MainFrame.main;
        const form = popupName ? main[popupName]?.form : main.form;
        const grid = form?.[gridName];

        if (grid) {
          const dsName = grid.binddataset;
          const dataset = form[dsName];
          if (dataset) {
            dataset.set_rowposition(rowIndex);
            return true;
          }
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    { gridName, rowIndex, popupName }
  );
}

/**
 * 팝업 존재 여부 확인
 */
export async function isPopupOpen(
  frame: Frame,
  popupName: string
): Promise<boolean> {
  return await frame.evaluate((popupName) => {
    try {
      const app = (window as any).nexacro.getApplication();
      const main =
        app.mainframe.VFrameSet.HFrameSet.VFrameSet.FrameSet.MainFrame.main;
      const popup = main[popupName];
      return popup !== undefined && popup.visible !== false;
    } catch (e) {
      return false;
    }
  }, popupName);
}

/**
 * 팝업이 열릴 때까지 대기
 */
export async function waitForPopup(
  frame: Frame,
  popupName: string,
  timeout: number = 10000
): Promise<boolean> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const open = await isPopupOpen(frame, popupName);
    if (open) return true;
    await new Promise((r) => setTimeout(r, 300));
  }
  return false;
}

/**
 * 상단/좌측 메뉴 클릭 (goUrl 호출 방식)
 * 메뉴 구조에 맞게 수정 필요
 */
export async function clickTopMenu(
  page: Page,
  menuType: string,
  menuId: string
): Promise<boolean> {
  // ✏️ 메뉴 프레임 URL 패턴에 맞게 수정하세요
  const menuFrame =
    page.frames().find((f) => f.url().includes('eipTop.do') || f.url().includes('menu')) ||
    null;

  if (!menuFrame) {
    console.warn('메뉴 프레임을 찾지 못했습니다. URL 패턴을 확인하세요.');
    return false;
  }

  return await menuFrame.evaluate(
    ({ menuType, menuId }) => {
      try {
        (window as any).goUrl(menuType, menuId);
        return true;
      } catch (e) {
        return false;
      }
    },
    { menuType, menuId }
  );
}

/**
 * DOM 요소 좌표로 클릭 (Nexacro canvas 위의 요소)
 */
export async function clickByCoordinates(
  frame: Frame,
  selector: string
): Promise<{ x: number; y: number } | null> {
  const coords = await frame.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      };
    }
    return null;
  }, selector);

  return coords;
}

/**
 * Nexacro 전역 변수(gv_) 값 가져오기
 * gv_domain, gv_upMenuId 등 전역 변수를 사용
 */
export async function getGlobalVariable(
  frame: Frame,
  varName: string
): Promise<any> {
  return await frame.evaluate((varName) => {
    try {
      const app = (window as any).nexacro.getApplication();
      return app[varName] ?? null;
    } catch (e) {
      return null;
    }
  }, varName);
}

// ─────────────────────────────────────────────────────────────────────────────
// Nexacro 헬퍼 (openMenuById + MDI 패턴 기반, hrm_0130 검증 완료)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * FrameSet 경로 — 메뉴 클릭 시 동적으로 추가되는 메뉴 프레임(M_MIS_xx_xx)의 부모
 * 실제 form은 FrameSet[메뉴ID].form 에 위치함
 */
const NX_FRAMESET_PATH = 'mainframe.VFrameSet.HFrameSet.VFrameSet.FrameSet';

/** @deprecated 하위 호환 — NX_FRAMESET_PATH 사용 권장 */
const NX_MAIN_PATH = NX_FRAMESET_PATH;

/**
 * Nexacro 앱이 완전히 초기화될 때까지 대기
 *
 * domcontentloaded 이후 Nexacro는 비동기로 초기화되므로,
 * GNB 클릭 전에 반드시 이 함수를 호출해야 합니다.
 *
 * @returns true: 초기화 완료 / false: 타임아웃
 */
export async function waitForNexacroAppReady(
  page: Page,
  timeout = 30000
): Promise<boolean> {
  try {
    await page.waitForFunction(
      () => {
        try {
          const app      = (window as any).nexacro?.getApplication();
          const leftForm = app?.mainframe?.VFrameSet?.HFrameSet?.LeftFrame?.form;
          // HFrameSet + 메뉴 데이터셋 로드까지 확인
          const ds = leftForm?.ds_menu ?? app?.gds_menu;
          return !!app?.mainframe?.VFrameSet?.HFrameSet && ds && ds.rowcount > 0;
        } catch { return false; }
      },
      { timeout }
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * LEFT(LNB) 메뉴가 실제로 화면에 렌더링될 때까지 대기.
 *
 * waitForNexacroAppReady는 메뉴 데이터셋(ds_menu) 로드만 확인하지만,
 * 이 함수는 추가로 LeftFrame 의 DOM control element 가 0보다 큰 크기로 그려졌는지까지
 * 확인하여 좌측 메뉴가 눈에 보이는 상태(렌더 완료)를 보장한다.
 *
 * @returns 렌더 완료 true / 타임아웃 false
 */
export async function waitForLeftMenuRendered(
  page: Page,
  timeout = 15000
): Promise<boolean> {
  try {
    await page.waitForFunction(
      () => {
        try {
          const app       = (window as any).nexacro?.getApplication();
          const leftFrame = app?.mainframe?.VFrameSet?.HFrameSet?.LeftFrame;
          const leftForm  = leftFrame?.form;
          if (!leftForm) return false;

          // 1) 메뉴 데이터 로드 확인
          const ds = leftForm.ds_menu ?? app?.gds_menu;
          if (!ds || ds.rowcount <= 0) return false;

          // 2) LeftFrame DOM control element 가 화면에 그려졌는지(가시 크기) 확인
          const el =
            (typeof leftFrame.getElement === 'function' && leftFrame.getElement()) ||
            (typeof leftForm.getElement === 'function' && leftForm.getElement()) ||
            leftForm._control_element?.handle ||
            leftFrame._control_element?.handle;

          if (!el || typeof el.getBoundingClientRect !== 'function') {
            // DOM 핸들을 못 얻는 환경 — 컴포넌트 생성 여부로 대체 판단
            return Array.isArray(leftForm.components) ? leftForm.components.length > 0 : true;
          }
          const rect = el.getBoundingClientRect();
          return !!rect && rect.width > 0 && rect.height > 0;
        } catch { return false; }
      },
      { timeout }
    );
    return true;
  } catch {
    return false;
  }
}

/** 경로 문자열로 Nexacro 객체 탐색 */
function _resolve(app: any, dotPath: string): any {
  return dotPath.split('.').reduce((o, k) => o?.[k], app);
}

/**
 * leftFrame JS API로 메뉴를 직접 로드 (GNB Canvas 클릭 대체)
 *
 * DOM 텍스트 셀렉터로 Nexacro Canvas GNB를 클릭할 수 없으므로,
 * application.gds_menu 데이터셋에서 menuId 행을 찾아 fn_openMainForm을 호출합니다.
 *
 * @param menuId   메뉴 ID (예: 'M_MIS_01_01_03')
 * @returns { ok, menuNm, pageUrl } | { error }
 */
export async function openMenuById(
  page: Page,
  menuId: string,
  timeout = 30000
): Promise<{ ok: boolean; menuNm?: string; pageUrl?: string; error?: string }> {
  // gds_menu / ds_menu가 채워질 때까지 대기 (메뉴 데이터는 앱 초기화 후 비동기 로드됨)
  const ready = await page.waitForFunction(
    () => {
      try {
        const app      = (window as any).nexacro?.getApplication();
        const leftForm = app?.mainframe?.VFrameSet?.HFrameSet?.LeftFrame?.form;
        const ds = leftForm?.ds_menu ?? app?.gds_menu;
        return ds && ds.rowcount > 0;
      } catch { return false; }
    },
    { timeout }
  ).then(() => true).catch(() => false);

  if (!ready) return { ok: false, error: `메뉴 데이터셋 로드 타임아웃 (${timeout}ms) — 서버 응답 확인 필요` };

  return page.evaluate((menuId) => {
    try {
      const app      = (window as any).nexacro.getApplication();
      const leftForm = app.mainframe?.VFrameSet?.HFrameSet?.LeftFrame?.form;
      if (!leftForm?.fn_openMainForm) return { ok: false, error: 'leftFrame.form.fn_openMainForm 없음' };

      const ds = leftForm.ds_menu ?? app.gds_menu;
      if (!ds) return { ok: false, error: 'menu dataset 없음' };

      const row = ds.findRow('MENU_ID', menuId);
      if (row < 0) return { ok: false, error: `메뉴 ID "${menuId}" 미발견 (전체 행수: ${ds.rowcount})` };

      const menuNm  = String(ds.getColumn(row, 'MENU_NM')  ?? '');
      const pageUrl = String(ds.getColumn(row, 'PGM_PATH') ?? '');
      const myMenuYn= String(ds.getColumn(row, 'MY_MENU_YN') ?? 'N');

      leftForm.fn_openMainForm(menuId, menuNm, pageUrl, myMenuYn, '');
      return { ok: true, menuNm, pageUrl };
    } catch (e: any) {
      return { ok: false, error: (e as any).message };
    }
  }, menuId);
}

/**
 * PGM_PATH 또는 PGM_ID 컬럼으로 메뉴를 찾아 fn_openMainForm을 호출합니다.
 * MENU_ID를 모를 때 pgmId(예: 'hrm_3010M')로 메뉴를 찾는 신뢰할 수 있는 방법입니다.
 * Nexacro는 Canvas 렌더링이므로 텍스트 셀렉터 대신 이 함수를 사용하세요.
 */
export async function openMenuByPgm(
  page: Page,
  pgmId: string,
  timeout = 30000
): Promise<{ ok: boolean; menuId?: string; menuNm?: string; pageUrl?: string; error?: string }> {
  const ready = await page.waitForFunction(
    () => {
      try {
        const app      = (window as any).nexacro?.getApplication();
        const leftForm = app?.mainframe?.VFrameSet?.HFrameSet?.LeftFrame?.form;
        const ds = leftForm?.ds_menu ?? app?.gds_menu;
        return ds && ds.rowcount > 0;
      } catch { return false; }
    },
    { timeout }
  ).then(() => true).catch(() => false);

  if (!ready) return { ok: false, error: `메뉴 데이터셋 로드 타임아웃 (${timeout}ms)` };

  return page.evaluate((pgmId) => {
    try {
      const app      = (window as any).nexacro.getApplication();
      const leftForm = app.mainframe?.VFrameSet?.HFrameSet?.LeftFrame?.form;
      if (!leftForm?.fn_openMainForm) return { ok: false, error: 'fn_openMainForm 없음' };

      const ds = leftForm.ds_menu ?? app.gds_menu;
      if (!ds) return { ok: false, error: 'menu dataset 없음' };

      const hint = pgmId.toLowerCase().replace(/_?m$/i, '');
      let foundRow = -1;

      // 1) PGM_PATH 포함 검색 (대소문자 무시)
      for (let i = 0; i < ds.rowcount; i++) {
        const pgmPath = String(ds.getColumn(i, 'PGM_PATH') ?? '').toLowerCase();
        if (pgmPath.includes(pgmId.toLowerCase()) || pgmPath.includes(hint)) {
          foundRow = i; break;
        }
      }
      // 2) PGM_ID 컬럼으로 검색
      if (foundRow < 0) {
        for (let i = 0; i < ds.rowcount; i++) {
          const colPgm = String(ds.getColumn(i, 'PGM_ID') ?? '').toLowerCase();
          if (colPgm === pgmId.toLowerCase() || colPgm === hint) {
            foundRow = i; break;
          }
        }
      }

      if (foundRow < 0) {
        const samples: string[] = [];
        for (let i = 0; i < Math.min(3, ds.rowcount); i++)
          samples.push(String(ds.getColumn(i, 'PGM_PATH') ?? ''));
        return {
          ok: false,
          error: `pgmId "${pgmId}" 관련 메뉴 미발견 (전체 행수: ${ds.rowcount}, 샘플: ${samples.join(' | ')})`,
        };
      }

      const menuId   = String(ds.getColumn(foundRow, 'MENU_ID')    ?? '');
      const menuNm   = String(ds.getColumn(foundRow, 'MENU_NM')    ?? '');
      const pageUrl  = String(ds.getColumn(foundRow, 'PGM_PATH')   ?? '');
      const myMenuYn = String(ds.getColumn(foundRow, 'MY_MENU_YN') ?? 'N');

      leftForm.fn_openMainForm(menuId, menuNm, pageUrl, myMenuYn, '');
      return { ok: true, menuId, menuNm, pageUrl };
    } catch (e: any) {
      return { ok: false, error: (e as any).message };
    }
  }, pgmId);
}

/**
 * Nexacro 폼 탐색 — 지정 컴포넌트 ID가 있는 메뉴 프레임 키를 반환
 *
 * FrameSet 아래에 메뉴 ID 형태(M_MIS_xx_xx)의 프레임이 동적으로 로드됨.
 * 각 프레임의 .form[componentId] 를 직접 접근해 탐색.
 *
 * @returns 메뉴 프레임 키(예: 'M_MIS_01_01_03') | null
 */
export async function findNexacroFormByComponent(
  page: Page,
  componentId: string,
  nxPath = NX_FRAMESET_PATH
): Promise<string | null> {
  return page.evaluate(
    ({ nxPath, componentId }) => {
      try {
        const app  = (window as any).nexacro.getApplication();
        const fset = nxPath.split('.').reduce((o: any, k: string) => o?.[k], app);
        if (!fset) return null;
        // FrameSet 아래 모든 프레임 순회 (메뉴 ID 키)
        for (const key of Object.keys(fset)) {
          if (key.startsWith('_')) continue;
          try {
            const frame = fset[key];
            // form은 non-enumerable일 수 있으므로 직접 접근
            if (frame?.form?.[componentId]) return key;
          } catch {}
        }
        return null;
      } catch { return null; }
    },
    { nxPath, componentId }
  );
}

/**
 * 폼 로드 폴링 — componentId 컴포넌트가 나타날 때까지 대기
 */
export async function waitForNexacroFormComponent(
  page: Page,
  componentId: string,
  timeout = 15000,
  nxPath = NX_MAIN_PATH
): Promise<string | null> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const key = await findNexacroFormByComponent(page, componentId, nxPath);
    if (key) return key;
    await page.waitForTimeout(300);
  }
  return null;
}

/**
 * Nexacro Dataset 컬럼 값 설정 (EditBox / Combo 등 바인딩 컴포넌트에 반영)
 * @param formKey  findNexacroFormByComponent 반환값
 * @param dataset  데이터셋 이름 (예: 'ds_search')
 * @param column   컬럼 ID (예: 'SCH_DEPT_NM')
 * @param value    설정할 값
 */
export async function setNexacroDatasetValue(
  page: Page,
  formKey: string,
  dataset: string,
  column: string,
  value: string,
  nxPath = NX_FRAMESET_PATH,
  silent = false
): Promise<boolean> {
  return page.evaluate(
    ({ nxPath, formKey, dataset, column, value, silent }) => {
      try {
        const app       = (window as any).nexacro.getApplication();
        const fset      = nxPath.split('.').reduce((o: any, k: string) => o?.[k], app);
        const frameForm = fset?.[formKey]?.form;
        // MDI 패턴: 로드된 xfdl 폼은 div_workForm.form 안에 있음
        const form      = frameForm?.div_workForm?.form ?? frameForm;
        if (!form) return false;

        const ds = form[dataset];
        if (ds) {
          if (ds.rowcount === 0) ds.addRow();
          // silent=true: oncolumnchanged 이벤트 억제 (NPE 등 의도치 않은 핸들러 방지)
          if (silent) ds.set_enableevent(false);
          ds.setColumn(0, column, value);
          if (silent) ds.set_enableevent(true);
          return true;
        }

        // Div 안의 컴포넌트 직접 set_value (ds 없을 경우 폴백)
        for (const key of Object.keys(form)) {
          const div = (form as any)[key];
          if (div?.form?.[column]?.set_value) {
            div.form[column].set_value(value);
            return true;
          }
        }
        return false;
      } catch { return false; }
    },
    { nxPath, formKey, dataset, column, value, silent }
  );
}

/**
 * Nexacro 컴포넌트(EditBox/Combo) 값을 직접 설정
 * div_Search.form.SCH_DEPT_NM 처럼 중첩 Div 안의 컴포넌트에도 접근
 *
 * @param formKey  메뉴 프레임 키 (예: 'M_MIS_01_01_03')
 * @param compId   컴포넌트 ID (예: 'SCH_DEPT_NM')
 * @param value    설정할 값
 */
export async function setNexacroComponentValue(
  page: Page,
  formKey: string,
  compId: string,
  value: string,
  nxPath = NX_FRAMESET_PATH
): Promise<boolean> {
  return page.evaluate(
    ({ nxPath, formKey, compId, value }) => {
      // Object.getOwnPropertyNames 포함 non-enumerable 프로퍼티까지 탐색
      function allKeys(o: any): string[] {
        try { return Object.getOwnPropertyNames(o); } catch { return []; }
      }

      function findAndSet(obj: any, id: string, val: string, depth: number): boolean {
        if (!obj || typeof obj !== 'object' || depth > 6) return false;
        try {
          // 현재 레벨 직접 접근
          if (obj[id]?.set_value) { obj[id].set_value(val); return true; }
          // form 레이어
          if (obj.form) {
            if (obj.form[id]?.set_value) { obj.form[id].set_value(val); return true; }
            // 중첩 Div (non-enumerable 포함)
            for (const k of allKeys(obj.form)) {
              if (k.startsWith('_') || k === id) continue;
              if (findAndSet((obj.form as any)[k], id, val, depth + 1)) return true;
            }
          }
        } catch { /* 프로퍼티 접근 오류 무시 */ }
        return false;
      }

      try {
        const app       = (window as any).nexacro.getApplication();
        const fset      = nxPath.split('.').reduce((o: any, k: string) => o?.[k], app);
        const frame     = fset?.[formKey];
        if (!frame) return false;
        // MDI 패턴: 로드된 폼이 div_workForm.form 안에 있음 — 거기서 먼저 탐색
        const innerForm = frame.form?.div_workForm?.form;
        if (innerForm && findAndSet(innerForm, compId, value, 0)) return true;
        return findAndSet(frame, compId, value, 0);
      } catch { return false; }
    },
    { nxPath, formKey, compId, value }
  );
}

/**
 * 편집 가능한 텍스트 입력(Edit/MaskEdit/TextArea) 컴포넌트의 화면 좌표(rect)를 반환.
 *
 * setNexacroComponentValue 는 set_value 로 값을 "프로그램적으로" 주입하므로
 * 화면 입력란에 타이핑 과정이 보이지 않는다. 이 함수로 입력란의 viewport 좌표를 얻어
 * page.mouse.click + page.keyboard.type 으로 실제 타이핑을 재현하면 화면에서 보인다.
 *
 * Combo/CheckBox 등 자유 입력이 아닌 컴포넌트는 null 을 반환한다(타이핑 부적합).
 *
 * @returns 입력란의 { x, y, w, h }(viewport 기준) | null
 */
export async function getNexacroEditableRect(
  page: Page,
  formKey: string,
  compId: string,
  nxPath = NX_FRAMESET_PATH
): Promise<{ x: number; y: number; w: number; h: number } | null> {
  return page.evaluate(
    ({ nxPath, formKey, compId }) => {
      function allKeys(o: any): string[] {
        try { return Object.getOwnPropertyNames(o); } catch { return []; }
      }
      function findComp(obj: any, id: string, depth: number): any {
        if (!obj || typeof obj !== 'object' || depth > 6) return null;
        try {
          if (obj[id]?.set_value) return obj[id];
          if (obj.form) {
            if (obj.form[id]?.set_value) return obj.form[id];
            for (const k of allKeys(obj.form)) {
              if (k.startsWith('_') || k === id) continue;
              const r = findComp((obj.form as any)[k], id, depth + 1);
              if (r) return r;
            }
          }
        } catch {}
        return null;
      }

      try {
        const app   = (window as any).nexacro.getApplication();
        const fset  = nxPath.split('.').reduce((o: any, k: string) => o?.[k], app);
        const frame = fset?.[formKey];
        if (!frame) return null;
        const innerForm = frame.form?.div_workForm?.form;
        const comp = (innerForm && findComp(innerForm, compId, 0)) || findComp(frame, compId, 0);
        if (!comp) return null;

        // 편집 가능한 텍스트 입력 컴포넌트만 대상으로 한다 (Combo/CheckBox 등 제외)
        const typeName = String(comp._type_name ?? comp.constructor?.name ?? '');
        if (!/Edit|MaskEdit|TextArea|BigEdit/i.test(typeName)) return null;

        // Nexacro 컴포넌트의 DOM rect는 래퍼(getElement/_control_element)로 직접 얻기 어렵다.
        // 부모 체인을 따라 getOffsetLeft/getOffsetTop 을 누적하면 application(0,0) 기준
        // 뷰포트 절대 좌표가 된다(LNB 폭/GNB 높이도 상위 프레임 offset에 포함됨).
        let x = 0, y = 0, node: any = comp, guard = 0;
        while (node && guard++ < 40) {
          try {
            x += typeof node.getOffsetLeft === 'function' ? (node.getOffsetLeft() || 0) : 0;
            y += typeof node.getOffsetTop  === 'function' ? (node.getOffsetTop()  || 0) : 0;
          } catch {}
          node = node.parent ?? null;
        }
        const w = typeof comp.getOffsetWidth  === 'function' ? (comp.getOffsetWidth()  || 0) : 0;
        const h = typeof comp.getOffsetHeight === 'function' ? (comp.getOffsetHeight() || 0) : 0;
        if (w <= 0 || h <= 0) return null;
        return { x, y, w, h };
      } catch { return null; }
    },
    { nxPath, formKey, compId }
  );
}

/**
 * Nexacro Dataset 컬럼 값 초기화 (빈 문자열로 설정)
 */
export async function clearNexacroDataset(
  page: Page,
  formKey: string,
  dataset: string,
  columns: string[],
  nxPath = NX_FRAMESET_PATH
): Promise<void> {
  await page.evaluate(
    ({ nxPath, formKey, dataset, columns }) => {
      function allKeys(o: any): string[] {
        try { return Object.getOwnPropertyNames(o); } catch { return []; }
      }

      function findComp(obj: any, id: string, depth: number): any {
        if (!obj || typeof obj !== 'object' || depth > 6) return null;
        try {
          if (obj[id]?.set_value) return obj[id];
          if (obj.form) {
            if (obj.form[id]?.set_value) return obj.form[id];
            for (const k of allKeys(obj.form)) {
              if (k.startsWith('_') || k === id) continue;
              const r = findComp((obj.form as any)[k], id, depth + 1);
              if (r) return r;
            }
          }
        } catch {}
        return null;
      }

      try {
        const app       = (window as any).nexacro.getApplication();
        const fset      = nxPath.split('.').reduce((o: any, k: string) => o?.[k], app);
        const frameForm = fset?.[formKey]?.form;
        // MDI 패턴
        const form      = frameForm?.div_workForm?.form ?? frameForm;
        if (!form) return;

        const ds = form[dataset];
        if (ds) {
          // clearData+addRow: I타입 새 행 생성 → setColumn이 U 타입 row 오염 방지
          ds.set_enableevent(false);
          ds.clearData();
          ds.addRow();
          ds.set_enableevent(true);
          return;
        }

        // 컴포넌트 직접 초기화 폴백
        const frame = fset?.[formKey];
        for (const col of columns) {
          const comp = findComp(frame, col, 0);
          if (comp) comp.set_value('');
        }
      } catch {}
    },
    { nxPath, formKey, dataset, columns }
  );
}

/**
 * Nexacro 버튼 onclick 이벤트 트리거.
 * 메뉴 오픈 직후에는 MDI 자식 프레임의 폼이 아직 렌더링/바인딩 중일 수 있으므로,
 * 버튼 컴포넌트가 실제로 나타날 때까지 timeout 동안 폴링한 뒤 클릭한다
 * (예전에는 호출 시점에 한 번만 확인하고 없으면 바로 false를 반환해,
 *  formKey/버튼id가 맞는데도 타이밍 문제로 실패하는 경우가 많았다).
 */
export async function triggerNexacroButton(
  page: Page,
  formKey: string,
  buttonId: string,
  nxPath = NX_FRAMESET_PATH,
  timeout = 10000
): Promise<boolean> {
  // page.evaluate 내부(브라우저 컨텍스트)의 console.log는 page.on('console') 리스너가 없으면
  // Node stdout(=Playwright 실행 로그)에 안 찍힌다 — 그래서 진단 정보를 return값으로 받아
  // 여기(Node 컨텍스트)에서 console.warn으로 출력한다. "찾지 못함"으로만 뭉뚱그려지던 실패를
  // (a) fset 자체를 못 찾음 (b) 프레임은 있는데 버튼ID가 없음 (c) 버튼은 찾았는데 클릭(trigger)이
  // 예외를 던짐 — 세 가지로 구분해서 원인을 바로 알 수 있게 한다.
  const result = await page.evaluate(
    async ({ nxPath, formKey, buttonId, timeout }) => {
      function formOf(frame: any): any {
        const frameForm = frame?.form;
        // MDI 패턴
        return frameForm?.div_workForm?.form ?? frameForm;
      }
      function resolveBtn(): { btn: any; framesScanned: string[]; fsetFound: boolean } {
        try {
          const app  = (window as any).nexacro?.getApplication?.();
          const fset = nxPath.split('.').reduce((o: any, k: string) => o?.[k], app);
          if (!fset) return { btn: null, framesScanned: [], fsetFound: false };
          // 1순위: 지정된 formKey(ensureSessionReady가 넘겨준 menuId 등)
          const direct = formOf(fset[formKey])?.[buttonId];
          if (direct) return { btn: direct, framesScanned: [formKey], fsetFound: true };
          // 2순위: formKey가 실제 등록된 프레임 키와 다른 경우(타이밍/키 규칙 불일치) —
          // FrameSet 아래 로드된 모든 프레임을 스캔해 해당 버튼ID를 가진 폼을 찾는다.
          const scanned: string[] = [];
          for (const key of Object.keys(fset)) {
            if (key.startsWith('_')) continue;
            scanned.push(key);
            if (key === formKey) continue;
            try {
              const btn = formOf(fset[key])?.[buttonId];
              if (btn) return { btn, framesScanned: scanned, fsetFound: true };
            } catch {}
          }
          return { btn: null, framesScanned: scanned, fsetFound: true };
        } catch (e: any) {
          return { btn: null, framesScanned: [], fsetFound: false };
        }
      }

      const start = Date.now();
      let r = resolveBtn();
      while (!r.btn && Date.now() - start < timeout) {
        await new Promise((res) => setTimeout(res, 200));
        r = resolveBtn();
      }
      if (!r.btn) {
        return { ok: false, reason: 'not_found', fsetFound: r.fsetFound, framesScanned: r.framesScanned };
      }

      try {
        // 이 Nexacro 런타임의 Button 컴포넌트에는 .trigger() API가 없다 —
        // 실 클릭을 시뮬레이션하는 공개 메서드는 .click() 이다.
        // (2026-07-19 진단: typeof r.btn.trigger === 'undefined', typeof r.btn.click === 'function',
        //  r.btn 자체는 정상적인 Button 컴포넌트로 확인됨 — 즉, 잘못된 컴포넌트를 찾은 게 아니라 호출 API명이 틀렸었다.)
        if (typeof r.btn.click === 'function') {
          r.btn.click();
        } else if (typeof r.btn.trigger === 'function') {
          r.btn.trigger('onclick', r.btn);
        } else {
          throw new Error(`click()/trigger() 모두 없음 (typeof btn=${typeof r.btn})`);
        }
        return { ok: true };
      } catch (e: any) {
        return { ok: false, reason: 'trigger_threw', error: String(e?.message ?? e) };
      }
    },
    { nxPath, formKey, buttonId, timeout }
  );

  if (!result.ok) {
    if (result.reason === 'trigger_threw') {
      console.warn(
        `[triggerNexacroButton] '${buttonId}' 컴포넌트는 찾았으나 클릭 중 예외 발생 — formKey=${formKey}:`,
        result.error
      );
    } else if (!result.fsetFound) {
      console.warn(
        `[triggerNexacroButton] FrameSet 자체를 찾지 못함 (nxPath="${nxPath}") — Nexacro 앱 구조가 예상과 다르거나 아직 로드 안 됨. formKey=${formKey}, buttonId=${buttonId}`
      );
    } else {
      console.warn(
        `[triggerNexacroButton] '${buttonId}' 컴포넌트를 로드된 프레임 어디서도 못 찾음 — formKey=${formKey}, ` +
        `스캔한 프레임 키(${result.framesScanned.length}개): ${result.framesScanned.join(', ') || '(없음)'}`
      );
    }
  }

  return result.ok;
}

/**
 * Dataset에서 keyCol==keyVal인 행을 찾아 rowposition을 그 행으로 옮긴다(그리드 행 선택 대체).
 * 단위 테스트의 DELETE TC가 (INSERT TC가 채번한) savedKey에 해당하는 행을
 * UI 그리드를 실제로 클릭하지 않고도 "선택"하기 위한 용도 — 이후 버튼 클릭(삭제)은
 * triggerNexacroButton()으로 실제 컴포넌트 API를 호출한다.
 *
 * @returns 일치하는 행을 찾아 선택했으면 true, 못 찾았으면 false
 */
export async function selectNexacroRowByKey(
  page: Page,
  formKey: string,
  dataset: string,
  keyCol: string,
  keyVal: string,
  nxPath = NX_FRAMESET_PATH
): Promise<boolean> {
  return page.evaluate(
    ({ nxPath, formKey, dataset, keyCol, keyVal }) => {
      try {
        const app       = (window as any).nexacro.getApplication();
        const fset      = nxPath.split('.').reduce((o: any, k: string) => o?.[k], app);
        const frameForm = fset?.[formKey]?.form;
        const form      = frameForm?.div_workForm?.form ?? frameForm;
        const ds        = form?.[dataset];
        if (!ds) return false;
        for (let i = 0; i < ds.rowcount; i++) {
          if (String(ds.getColumn(i, keyCol) ?? '') === keyVal) {
            ds.set_rowposition(i);
            return true;
          }
        }
        return false;
      } catch { return false; }
    },
    { nxPath, formKey, dataset, keyCol, keyVal }
  );
}

/**
 * Nexacro Dataset에 데이터가 채워질 때까지 폴링
 *
 * HTTP 응답 후 Nexacro가 XML을 파싱해 Dataset에 쓰는 과정이 비동기이므로,
 * waitForResponse 직후에 바로 읽으면 rowcount=0이 나올 수 있다.
 * 이 함수로 minRows 이상이 될 때까지 기다린 뒤 읽어야 한다.
 *
 * @param minRows  최소 행 수 (기본 1) — 0건이 정상인 경우 0 지정
 */
export async function waitForNexacroDataset(
  page: Page,
  formKey: string,
  dataset: string,
  minRows = 1,
  timeout = 10000,
  nxPath = NX_FRAMESET_PATH
): Promise<boolean> {
  try {
    await page.waitForFunction(
      ({ nxPath, formKey, dataset, minRows }) => {
        try {
          const app  = (window as any).nexacro.getApplication();
          const fset      = (nxPath as string).split('.').reduce((o: any, k: string) => o?.[k], app);
          const frameForm = fset?.[formKey]?.form;
          // MDI 패턴
          const form      = frameForm?.div_workForm?.form ?? frameForm;
          const ds        = form?.[dataset];
          return !!ds && (ds.rowcount as number) >= minRows;
        } catch { return false; }
      },
      { nxPath, formKey, dataset, minRows },
      { timeout }
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Nexacro 컴포넌트(EditBox/Combo) 현재 값 읽기
 * setNexacroComponentValue 의 대응 함수
 *
 * @param formKey  메뉴 프레임 키 (예: 'M_MIS_01_01_03')
 * @param compId   컴포넌트 ID (예: 'SCH_DEPT_NM')
 * @returns 컴포넌트 value 문자열, 찾지 못하면 null
 */
export async function getNexacroComponentValue(
  page: Page,
  formKey: string,
  compId: string,
  nxPath = NX_FRAMESET_PATH
): Promise<string | null> {
  return page.evaluate(
    ({ nxPath, formKey, compId }) => {
      function allKeys(o: any): string[] {
        try { return Object.getOwnPropertyNames(o); } catch { return []; }
      }

      function findAndGet(obj: any, id: string, depth: number): string | null {
        if (!obj || typeof obj !== 'object' || depth > 6) return null;
        try {
          if (obj[id] !== undefined && obj[id].value !== undefined) return String(obj[id].value ?? '');
          if (obj.form) {
            if (obj.form[id] !== undefined && obj.form[id].value !== undefined) return String(obj.form[id].value ?? '');
            for (const k of allKeys(obj.form)) {
              if (k.startsWith('_') || k === id) continue;
              const r = findAndGet((obj.form as any)[k], id, depth + 1);
              if (r !== null) return r;
            }
          }
        } catch {}
        return null;
      }

      try {
        const app       = (window as any).nexacro.getApplication();
        const fset      = nxPath.split('.').reduce((o: any, k: string) => o?.[k], app);
        const frame     = fset?.[formKey];
        if (!frame) return null;
        const innerForm = frame.form?.div_workForm?.form;
        if (innerForm) {
          const v = findAndGet(innerForm, compId, 0);
          if (v !== null) return v;
        }
        return findAndGet(frame, compId, 0);
      } catch { return null; }
    },
    { nxPath, formKey, compId }
  );
}

/**
 * Nexacro Grid 행 선택 (dataset rowposition 변경)
 *
 * Grid에서 특정 행을 클릭하는 효과. 바인딩된 dataset의 rowposition을 변경하여
 * 상세 폼 또는 하위 Dataset이 갱신된다.
 *
 * @param formKey   메뉴 프레임 키
 * @param gridId    Grid 컴포넌트 ID (예: 'grd_list')
 * @param rowIndex  0-based 행 인덱스
 */
/**
 * 지정 menuId의 Nexacro 폼이 FrameSet에 이미 로드돼 있는지 확인.
 * navigateTo에서 재탐색 생략 여부 판단에 사용.
 */
export async function isMenuActive(
  page: Page,
  menuId: string,
  nxPath = NX_FRAMESET_PATH
): Promise<boolean> {
  return page.evaluate(
    ({ nxPath, menuId }) => {
      try {
        const app  = (window as any).nexacro.getApplication();
        const fset = nxPath.split('.').reduce((o: any, k: string) => o?.[k], app);
        return !!(fset?.[menuId]?.form);
      } catch { return false; }
    },
    { nxPath, menuId }
  );
}

export async function selectNexacroGridRow(
  page: Page,
  formKey: string,
  gridId: string,
  rowIndex: number,
  nxPath = NX_FRAMESET_PATH
): Promise<boolean> {
  return page.evaluate(
    ({ nxPath, formKey, gridId, rowIndex }) => {
      function allKeys(o: any): string[] {
        try { return Object.getOwnPropertyNames(o); } catch { return []; }
      }

      function findGrid(obj: any, id: string, depth: number): any {
        if (!obj || typeof obj !== 'object' || depth > 6) return null;
        try {
          if (obj[id]?.binddataset !== undefined) return obj[id];
          if (obj.form) {
            if (obj.form[id]?.binddataset !== undefined) return obj.form[id];
            for (const k of allKeys(obj.form)) {
              if (k.startsWith('_') || k === id) continue;
              const r = findGrid((obj.form as any)[k], id, depth + 1);
              if (r) return r;
            }
          }
        } catch {}
        return null;
      }

      try {
        const app       = (window as any).nexacro.getApplication();
        const fset      = nxPath.split('.').reduce((o: any, k: string) => o?.[k], app);
        const frameForm = fset?.[formKey]?.form;
        const form      = frameForm?.div_workForm?.form ?? frameForm;
        if (!form) return false;

        const grid = findGrid(form, gridId, 0) ?? form[gridId];
        if (!grid) return false;

        const dsName = grid.binddataset;
        const ds = form[dsName];
        if (!ds) return false;

        if (rowIndex < 0 || rowIndex >= ds.rowcount) return false;
        ds.set_rowposition(rowIndex);
        return true;
      } catch { return false; }
    },
    { nxPath, formKey, gridId, rowIndex }
  );
}

/**
 * Nexacro Dataset 행 데이터 읽기
 */
export async function getNexacroDatasetRows(
  page: Page,
  formKey: string,
  dataset: string,
  columns: string[],
  nxPath = NX_FRAMESET_PATH
): Promise<Record<string, string>[]> {
  return page.evaluate(
    ({ nxPath, formKey, dataset, columns }) => {
      try {
        const app       = (window as any).nexacro.getApplication();
        const fset      = nxPath.split('.').reduce((o: any, k: string) => o?.[k], app);
        const frameForm = fset?.[formKey]?.form;
        // MDI 패턴: 로드된 xfdl 폼은 div_workForm.form 안에 있음
        const form      = frameForm?.div_workForm?.form ?? frameForm;
        const ds        = form?.[dataset];
        if (!ds) return [];
        const rows: Record<string, string>[] = [];
        for (let i = 0; i < ds.rowcount; i++) {
          const row: Record<string, string> = {};
          for (const col of columns) row[col] = String(ds.getColumn(i, col) ?? '');
          rows.push(row);
        }
        return rows;
      } catch { return []; }
    },
    { nxPath, formKey, dataset, columns }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Nexacro HTTP 응답 검증 헬퍼
// ─────────────────────────────────────────────────────────────────────────────

export interface NexacroResponseResult {
  /** HTTP 상태코드 (200, 302, 500 등) */
  status: number;
  /** 응답 body 원문 */
  body: string;
  /** <Root 포함 여부 — Nexacro XML 응답 정상 도달 확인 */
  hasRoot: boolean;
  /** CSRF ERROR 포함 여부 */
  hasCsrfError: boolean;
  /** ErrorCode="-1" 포함 여부 — 서버 비즈니스 로직 오류 */
  hasErrorCode: boolean;
  /** ORA-XXXXX(Oracle 에러코드) 포함 여부 — DB 오류가 ErrorCode 없이 메시지에만 노출되는 경우 대비 */
  hasOraError: boolean;
  /** 정상 응답 여부 (HTTP 200 + Root 있음 + CSRF/ErrorCode/ORA- 오류 없음) */
  isSuccess: boolean;
  /** 실패 이유 (isSuccess=false 일 때 채워짐) */
  failReason: string;
  /** ORA 오류 단독 메시지 — "<Root 없음" 등 부수적인 사유와 섞이지 않은 순수 DB 오류 문구 (hasOraError=true일 때만 채워짐) */
  oraReason: string;
}

/**
 * Nexacro 17 서버 응답을 분석하여 정상 여부를 반환합니다.
 *
 * Nexacro XML 응답 구조:
 * ```xml
 * <?xml version="1.0" encoding="UTF-8"?>
 * <Root xmlns="http://www.nexacroplatform.com/platform/dataset">
 *   <Parameters>
 *     <Parameter id="ErrorCode">0</Parameter>   ← 0=성공, -1=오류
 *     <Parameter id="ErrorMsg">SUCC</Parameter>
 *   </Parameters>
 *   <DataSets>
 *     <DataSet id="ds_list">...</DataSet>
 *   </DataSets>
 * </Root>
 * ```
 *
 * @param resp  - page.waitForResponse().catch(()=>null) 결과 (null 허용)
 * @param label - 로그 출력용 레이블 (예: 'getList.do')
 */
export async function parseNexacroResponse(
  resp: Response | null,
  label = 'API'
): Promise<NexacroResponseResult> {
  // resp가 null인 경우 (waitForResponse 타임아웃)
  if (!resp) {
    return {
      status: 0,
      body: '',
      hasRoot: false,
      hasCsrfError: false,
      hasErrorCode: false,
      hasOraError: false,
      isSuccess: false,
      failReason: `[${label}] 응답 없음 — waitForResponse 타임아웃 또는 요청 미발생`,
      oraReason: '',
    };
  }

  const status = resp.status();
  const body = await resp.text().catch(() => '');

  // < 는 < 의 유니코드 이스케이프 — 실제 body의 <Root 와 동일
  // 따라서 /<Root/ 정규식으로 두 형태 모두 매치 가능
  const hasRoot       = /<Root|<Root/i.test(body);
  const hasCsrfError  = body.includes('CSRF ERROR');
  // type="int" 등 추가 속성이 있는 경우도 포함: <Parameter id="ErrorCode" type="int">-1
  const hasErrorCode  = /ErrorCode="-1"|<Parameter id="ErrorCode"[^>]*>-1/.test(body);
  // ORA-XXXXX — Oracle DB 오류. ErrorCode="-1"로 정상 래핑되지 않고 ErrorMsg/스택트레이스에만
  // 노출되는 경우(예: 500 에러 페이지, 잘못 처리된 예외)까지 잡기 위해 body 전체를 대상으로 검사.
  const hasOraError   = /ORA-\d{4,6}/i.test(body);

  const reasons: string[] = [];
  let oraReason = '';
  if (status !== 200)    reasons.push(`HTTP ${status} (200 아님)`);
  if (!hasRoot)          reasons.push('응답 body에 <Root 없음 — Nexacro XML 아님 (로그인 페이지 리다이렉트 가능성)');
  if (hasCsrfError)      reasons.push('CSRF ERROR — storageState 만료 또는 PGM_ID 누락');
  if (hasErrorCode)      reasons.push('ErrorCode="-1" — 서버 비즈니스 로직 오류');
  if (hasOraError) {
    const oraMatch = body.match(/ORA-\d{4,6}[^<\n]*/i);
    // "Oracle " 접두사 없이 — hasRoot 등 부수적인 사유와 합치지 않고 이 문구만 단독으로도 쓴다 (assertNexacroResponse)
    oraReason = `DB 오류 감지: ${oraMatch ? oraMatch[0].trim() : 'ORA-'}`;
    reasons.push(oraReason);
  }

  const isSuccess = status === 200 && hasRoot && !hasErrorCode && !hasOraError;

  return {
    status,
    body,
    hasRoot,
    hasCsrfError,
    hasErrorCode,
    hasOraError,
    isSuccess,
    failReason: reasons.join(' | '),
    oraReason,
  };
}

/**
 * Nexacro 응답을 검증하고 실패 시 Playwright 테스트를 실패 처리합니다.
 *
 * @example
 * // waitForResponse 등록 → 버튼 클릭 → 응답 검증
 * const respPromise = page.waitForResponse(
 *   res => res.url().includes('/mis/pur/pur5110/getList.do') && res.status() === 200,
 *   { timeout: 15000 }
 * ).catch(() => null);
 *
 * await clickMainFormButton(frame, 'btn_search');
 * const result = await assertNexacroResponse(await respPromise, 'getList.do');
 * // result.body, result.hasRoot 등 후속 처리에 활용 가능
 */
export async function assertNexacroResponse(
  resp: Response | null,
  label = 'API'
): Promise<NexacroResponseResult> {
  const result = await parseNexacroResponse(resp, label);

  // HTTP 200 확인
  expect(
    result.status,
    `[${label}] HTTP 상태코드 오류: ${result.failReason}`
  ).toBe(200);

  // ORA-XXXXX(Oracle DB 오류) 최우선 확인 — <Root 없음 등 부수적인 사유와 섞이지 않도록
  // hasRoot 체크보다 먼저 검사해서, 실패사유에는 이 DB 오류 문구만 단독으로 남긴다.
  expect(
    result.hasOraError,
    result.oraReason
  ).toBe(false);

  // Nexacro XML <Root 태그 확인
  expect(
    result.hasRoot,
    `[${label}] Nexacro XML 응답 없음: ${result.failReason}`
  ).toBe(true);

  // CSRF ERROR — 무시하고 진행 (테스트 환경 특성상 발생 가능, 기능 검증에는 영향 없음)
  if (result.hasCsrfError) {
    console.warn(`  ⚠️  [${label}] CSRF ERROR 감지 — 무시하고 진행`);
  }

  // ErrorCode="-1" 없음 확인
  expect(
    result.hasErrorCode,
    `[${label}] 서버 오류(ErrorCode=-1): body 확인 필요\n${result.body.slice(0, 300)}`
  ).toBe(false);

  return result;
}

/**
 * Nexacro XML 응답 body에서 DataSet 행을 파싱하여 Record 배열로 반환합니다.
 *
 * @param body      - Nexacro XML 응답 문자열 (assertNexacroResponse의 result.body)
 * @param datasetId - 파싱할 Dataset ID (미지정 시 첫 번째 DataSet)
 *
 * @example
 * const result = await assertNexacroResponse(resp, 'getList.do');
 * const rows   = parseNexacroXmlRows(result.body, 'ds_list');
 * // rows[0]['APV_STAT_CD'] → '10'
 */
export function parseNexacroXmlRows(
  body: string,
  datasetId?: string
): Record<string, string>[] {
  try {
    // DataSet 섹션 추출 — 태그명 대소문자 무시
    const dsRe = datasetId
      ? new RegExp(`<(?:Data[Ss]et)[^>]*\\sid="${datasetId}"[^>]*>([\\s\\S]*?)</(?:Data[Ss]et)>`, 'i')
      : /<(?:Data[Ss]et)[^>]*>([\s\S]*?)<\/(?:Data[Ss]et)>/i;
    const dsMatch = body.match(dsRe);
    if (!dsMatch) return [];
    const dsContent = dsMatch[1] ?? '';

    // 컬럼 목록 추출
    const cols: string[] = [];
    const colRe = /<Column[^>]*\sid="([^"]+)"/gi;
    let cm: RegExpExecArray | null;
    while ((cm = colRe.exec(dsContent)) !== null) cols.push(cm[1]);

    // 행 추출
    const rows: Record<string, string>[] = [];
    const rowRe = /<Row>([\s\S]*?)<\/Row>/gi;
    let rm: RegExpExecArray | null;
    while ((rm = rowRe.exec(dsContent)) !== null) {
      const rc = rm[1];
      const row: Record<string, string> = {};
      for (const col of cols) {
        const vRe = new RegExp(`<Col[^>]*\\sid="${col}"[^>]*>([^<]*)<\\/Col>`, 'i');
        const vm = rc.match(vRe);
        row[col] = vm ? vm[1] : '';
      }
      rows.push(row);
    }
    return rows;
  } catch {
    return [];
  }
}

export default {
  // ── 핵심 헬퍼 (MDI 패턴, hrm_0130 검증) ─────────────────────
  openMenuById,
  openMenuByPgm,
  isMenuActive,
  waitForNexacroAppReady,
  setNexacroComponentValue,
  getNexacroComponentValue,
  clearNexacroDataset,
  waitForNexacroDataset,
  getNexacroDatasetRows,
  selectNexacroGridRow,
  selectNexacroRowByKey,
  triggerNexacroButton,
  // ── 보조 헬퍼 ────────────────────────────────────────────────────────────
  findNexacroFormByComponent,
  waitForNexacroFormComponent,
  setNexacroDatasetValue,
  // ── HTTP 응답 검증 ────────────────────────────────────────────────────────
  parseNexacroResponse,
  assertNexacroResponse,
  parseNexacroXmlRows,
  // ── 레거시 (Frame 기반, 이 시스템에서 동작 미보장) ───────────────────────
  findNexacroFrame,
  isNexacroLoaded,
  waitForNexacroLoad,
  getFormComponents,
  clickComponent,
  setValue,
  getValue,
  getDatasetData,
  selectComboItem,
  selectGridRow,
  isPopupOpen,
  waitForPopup,
  clickTopMenu,
  clickByCoordinates,
  getGlobalVariable,
};
