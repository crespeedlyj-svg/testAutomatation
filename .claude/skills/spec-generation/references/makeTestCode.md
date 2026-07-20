# 테스트 코드 자동 생성 에이전트

> 작성일: 2026-06-21  
> 대상 시스템: MIS (Nexacro + Spring MVC + eGovFrame 4.3.0)
> 패키지: `cres.pss.service` (구 `cres.common.web`)  
> 관련 파일: `SpecTemplateService.java`, `TestRunnerService.java`, `PurTestCodeGenService.java`, `AiStateStore.java`, `AiController.java`

---

## 1. 개요

### 1.1 목적

`SCENARIO_STORE`에 적재된 시나리오 목록을 입력으로 받아, Playwright TypeScript 스펙 파일(`.spec.ts`)을 자동 생성하는 에이전트 지침서.

- **단위 테스트** (`_unit.spec.ts`): 화면 탐색 없이 Nexacro XML API를 직접 POST 호출
- **통합 테스트** (`_inte.spec.ts`): Playwright로 Nexacro 화면을 탐색하고 버튼 클릭 수행

### 1.2 핵심 소스 위치

활성 모듈 루트: `app/src/main/java/cres/pss/service/`  
XML Mapper 루트: `app/src/main/resources/cres/sqlmap/mapper/common/ai/`

**Java 소스**

| 파일 | 패키지 | 역할 |
|------|--------|------|
| `SpecTemplateService.java` | `cres.pss.service` | spec.ts 파일 실제 생성 (단위/통합 템플릿) |
| `TestRunnerService.java` | `cres.pss.service` | Playwright 프로세스 실행·SSE 스트리밍·결과 파싱 |
| `PurTestCodeGenService.java` | `cres.pss.service` | Excel → SCENARIO_STORE 적재 (PUR 업무 전용) |
| `XfdlScenarioExtractor.java` | `cres.pss.service` | XFDL 정적 분석 → 단위 시나리오 추출 |
| `AiStateStore.java` | `cres.pss.service` | 런타임 상태 저장소 (시나리오·스펙 파일명·PID) |
| `AiController.java` | `cres.pss.service` | 웹 엔드포인트 (`/ai/generateSpecStream.do` 등) |
| `TestSummaryService.java` | `cres.pss.service` | 통과 현황 집계·승인 순서 검증 |
| `TestSummaryDao.java` | `cres.pss.service` | PSS_TC_PASS_MGT CRUD |
| `ScenarioDao.java` | `cres.pss.service` | PSS_TEST_SCEN_GRP / PSS_TEST_SCEN CRUD |
| `TcGenHistDao.java` | `cres.pss.service` | PSS_TC_GEN_HIST 이력 기록 (PreparedStatement) |
| `MenuResolveDao.java` | `cres.pss.service` | SYS_MENU_MGT 계층 조회 |

**XML Mapper** (모두 `app/src/main/resources/cres/sqlmap/mapper/common/ai/` 하위)

| 파일 | 비고 |
|------|------|
| `TestSummaryMapper.xml` | PSS_TC_PASS_MGT 쿼리 |
| `MenuResolveMapper.xml` | SYS_MENU_MGT 계층 조회 쿼리 |
| `ScenarioMapper.xml` | PSS_TEST_SCEN_GRP / PSS_TEST_SCEN 쿼리 — **루트 `src/main/resources/`에만 존재, 서브모듈 미이관** |

### 1.3 전체 데이터 흐름

```
[입력 경로 A] Excel (.xlsx)
  → PurTestCodeGenService.loadFromExcel()
       │
       ▼
[입력 경로 B] XFDL 정적 분석
  → XfdlScenarioExtractor.extractAll()
       │
       ▼
AiStateStore.SCENARIO_STORE["{prefix}_unit" | "{prefix}_integ"]
       │
       ▼
SpecTemplateService.generateUnitSpec() | generateIntegSpec()
       │
       ▼
{YYYYMMDD}_unit.spec.ts | {YYYYMMDD}_inte.spec.ts
       │
       ▼
TestRunnerService.runTest() → npx playwright test → SSE 스트리밍
       │
       ▼
test-results/results.json → 시나리오별 PASS/FAIL
       │
       ▼
PSS_TC_PASS_MGT 테이블 (TestSummaryDao)
```

---

## 2. SCENARIO_STORE 데이터 모델

### 2.1 키 체계

```
AiStateStore.SCENARIO_STORE
  "pur_unit"    → List<Map<String,Object>>  단위 시나리오
  "pur_integ"   → List<Map<String,Object>>  통합 시나리오
  "gdm_unit"    → ...
  "sys_integ"   → ...
```

prefix별 독립 저장. `generateSpecStream.do` 호출 시 `testType` 파라미터로 키 결정.

### 2.2 필드 정의

| 필드명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| `no` | int | 순번 (TC 제목에 `[no:N]` 형식 사용) | `1` |
| `sourceName` | String | XFDL 화면 파일명 (확장자 제외) | `pur5115m` |
| `화면명` | String | 화면 한글명 | `구매요청 목록` |
| `testType` | String | `"단위"` 또는 `"통합"` | `단위` |
| `crudType` | String | `SELECT` / `INSERT` / `UPDATE` / `DELETE` | `SELECT` |
| `URL` | String | API 엔드포인트 (비API 시 `""`) | `/mis/pur/pur5115/getList.do` |
| `serviceId` | String | svcId (URL 경로의 마지막 `.do` 앞 이름) | `getList` |
| `inputDsId` | String | 요청 Dataset ID | `ds_search` |
| `inputCols` | String | 요청 컬럼 목록 (콤마 구분) | `PURCH_REQ_DT_ST,DEPT_CD` |
| `outputDsId` | String | 응답 Dataset ID | `ds_list` |
| `inputValues` | String (JSON) | 요청 컬럼별 기본값 JSON | `{"PURCH_REQ_DT_ST":"20260101"}` |
| `origin` | String | 서비스 경로 구분 (`mis` / `pms`) | `mis` |
| `method` | String | HTTP 메서드 (`POST`, 비API 시 `""`) | `POST` |
| `테스트명` | String | TC 한글 이름 | `구매요청 목록 - 조회 (버튼 클릭)` |
| `사전조건` | String | 테스트 전제 조건 서술 | `해당 조건 내 데이터 DB 존재` |
| `expectedResult` | String | 기대 결과 서술 | `HTTP 200, ds_list 1건 이상` |
| `menuPath` | String | 메뉴 경로 (`>` 구분) | `구매관리 > 구매요청관리 > 구매요청` |
| `gnbName` | String | GNB(대메뉴) 이름 | `구매관리` |
| `menuName` | String | 최하위 메뉴 이름 | `구매요청` |
| `scenarioId` | String | 고유 시나리오 ID | `UT_PUR_0001` |
| `returnsKeyCol` | String | INSERT 후 채번 컬럼명 (키 체이닝용) | `PURCH_REQ_NO` |
| `usesSharedKey` | String | `"Y"`: 선행 INSERT 키 재사용 (DELETE 등) | `Y` |
| `extraDsRaw` | String | 추가 Dataset 원문 (`ds_id:COL=VAL\|...`) | `ds_item:ITEM_CD=001` |

---

## 3. 단위 테스트 스펙 생성 (`_unit.spec.ts`)

### 3.0 메뉴 경로 진입 원칙

> **단위 테스트도 반드시 메뉴 경로로 화면에 진입한 뒤 API 호출을 수행한다.**

단순 API POST 호출만으로는 Nexacro 세션 컨텍스트(pgmId CSRF 검증, 권한 쿠키 등)가 올바르게 설정되지 않을 수 있다.  
따라서 `beforeAll` 에서 GNB → 중분류 → 메뉴명 순으로 화면에 한 번 진입하고, 이후 각 TC는 API를 직접 호출한다.

**메뉴 경로 출처**
- 프로그램 생성 시: 시나리오 추출 단계의 `menuPath` 필드 (`gnbName`, `middleMenu`, `menuName`) 사용
- 현 세션 수동 실행 기준:

| 필드 | 값 |
|------|----|
| `gnbName` (GNB 대메뉴) | `구매관리` |
| `middleMenu` (중분류) | `구매요구` |
| `menuName` (최하위 메뉴) | `직접구매지급신청` |
| `menuPath` (전체 경로) | `구매관리 > 구매요구 > 직접구매지급신청` |

### 3.1 파일 구조

```typescript
import { test, expect } from '../fixtures';
import type { Page, Frame } from '@playwright/test';
import * as fs from 'fs';

const BASE_URL    = process.env.APP_BASE_URL ?? '';
const SYSTEM_ID   = process.env.APP_SYSTEM_ID ?? 'MIS';
const TODAY       = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const SCREENSHOT  = 'test-results/screenshots';

const CONFIG = {
  indexUrl: `${BASE_URL}/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_${SYSTEM_ID}`,
  defaultTimeout: 15000,
  gnbName:    '{gnbName}',
  middleMenu: '{middleMenu}',
  menuName:   '{menuName}',
};

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

// 메뉴 탐색 헬퍼 — 통합 테스트와 동일한 navigateTo{화면명} 패턴 사용 (4.3절 참고)
async function navigateTo{화면명}(page: Page): Promise<Frame | null> { ... }

// ── Nexacro XML 빌더
function nexacroXml(
  datasets: { id: string; columns: string[]; rows?: Record<string, string>[] }[],
  pgmId: string
): string { ... }

async function apiPost(page: Page, endpoint: string, xml: string) {
  return page.request.post(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    data: xml,
  });
}

// ── 키 체이닝 변수 (INSERT → DELETE)
let savedKey = '';

test.describe('{sourceName} 단위 테스트', () => {
  test.beforeAll(async ({ workerPage: page }) => {
    fs.mkdirSync(SCREENSHOT, { recursive: true });
    // ── 메뉴 경로 진입 (1회) — 이후 TC는 API만 호출
    // Nexacro는 load 이벤트가 늦으므로 domcontentloaded + timeout 사용
    await page.goto(CONFIG.indexUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);
    const frame = await navigateTo{화면명}(page);
    if (!frame) throw new Error('단위 테스트 사전 메뉴 진입 실패: {menuPath}');
  });

  // TC 블록들 ...
});
```

> `beforeAll` 에서 `workerPage` fixture를 사용하려면 `test.beforeAll(async ({ workerPage }) => { ... })` 형식으로 선언한다.  
> worker-scoped fixture는 `beforeAll` 에서 사용 가능하다.

### 3.2 TC 블록 생성 규칙

#### SELECT 시나리오

```typescript
test('[no:{N}] [단위] [SELECT] {serviceId}', async ({ page }) => {
  const resp = await apiPost(page, '{URL}',
    nexacroXml([{
      id: '{inputDsId}',
      columns: ['{col1}', '{col2}'],
      rows: [{ '{col1}': '{val1}', '{col2}': '{val2}' }],
    }], '{pgmId}')
  );
  expect(resp.status()).toBe(200);
  const body = await resp.text();
  // expectedResult에 "1건 이상" 포함 시:
  const rowCount = (body.match(/<Row /g) || []).length;
  expect(rowCount).toBeGreaterThan(0);
});
```

#### INSERT 시나리오 (키 체이닝 포함)

```typescript
test('[no:{N}] [단위] [INSERT] {serviceId}', async ({ page }) => {
  const resp = await apiPost(page, '{URL}',
    nexacroXml([{
      id: '{inputDsId}',
      columns: [...],
      rows: [{ ... }],
    }], '{pgmId}')
  );
  expect(resp.status()).toBe(200);
  const body = await resp.text();
  // returnsKeyCol이 있는 경우 키 추출
  const keyMatch = body.match(/{returnsKeyCol}[^>]*>([^<]+)<\/Col>/);
  if (keyMatch) savedKey = keyMatch[1];
  expect(savedKey).toBeTruthy();
});
```

#### DELETE 시나리오 (`usesSharedKey = "Y"`)

```typescript
test('[no:{N}] [단위] [DELETE] {serviceId}', async ({ page }) => {
  if (!savedKey) {
    test.skip(true, 'INSERT TC 미완료 — 키 없음');
    return;
  }
  const resp = await apiPost(page, '{URL}',
    nexacroXml([{
      id: '{inputDsId}',
      columns: ['{keyCol}'],
      rows: [{ '{keyCol}': savedKey }],
    }], '{pgmId}')
  );
  expect(resp.status()).toBe(200);
});
```

#### 비API 시나리오 (URL = "")

```typescript
test('[no:{N}] [단위] [UI] {테스트명}', async ({ page }) => {
  // URL이 없는 시나리오는 스킵 처리 (수동 검토 대상)
  test.skip(true, 'UI 동작 전용 — 수동 검토 필요');
});
```

### 3.3 nexacroXml() 함수 구현

```typescript
function nexacroXml(
  datasets: { id: string; columns: string[]; rows?: Record<string, string>[] }[],
  pgmId: string
): string {
  const dsList = datasets.map(ds => {
    const colDefs = ds.columns.map(c => `<ColumnInfo id="${c}" type="STRING" size="256"/>`).join('');
    const rowData = (ds.rows ?? []).map(row => {
      const cols = ds.columns.map(c => `<Col id="${c}"><![CDATA[${row[c] ?? ''}]]></Col>`).join('');
      return `<Row>${cols}</Row>`;
    }).join('');
    return `<Dataset id="${ds.id}"><ColumnInfos>${colDefs}</ColumnInfos><Rows>${rowData}</Rows></Dataset>`;
  }).join('');

  return `<?xml version="1.0" encoding="utf-8"?>`
    + `<Root xmlns="http://www.nexacroplatform.com/platform/dataset" ver="5.0.0.0">`
    + `<Parameters><Parameter id="pgmId">${pgmId}</Parameter></Parameters>`
    + `<Datasets>${dsList}</Datasets></Root>`;
}
```

---

## 4. 통합 테스트 스펙 생성 (`_inte.spec.ts`)

### 4.1 파일 구조

`workerPage` fixture는 worker-scoped이므로 `beforeAll`에서 사용할 수 없다.
각 TC가 `beforeEach`에서 index.jsp로 이동한 뒤, TC 내부에서 화면 탐색 함수를 개별 호출한다.

```typescript
import { test, expect } from '../fixtures';
import type { Page, Frame } from '@playwright/test';

const BASE_URL  = process.env.APP_BASE_URL ?? '';
const SYSTEM_ID = process.env.APP_SYSTEM_ID ?? '';

const CONFIG = {
  baseUrl: BASE_URL,
  indexUrl: `${BASE_URL}/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_${SYSTEM_ID}`,
  defaultTimeout: 15000,
};

// INSERT → DELETE 키 체이닝 (workers:1 + fullyParallel:false 환경에서 안전)
let savedRecordKey = '';

test.describe('{화면명} 통합 테스트', () => {

  test.beforeEach(async ({ workerPage: page }) => {
    // 다이얼로그 자동 수락 (중복 처리 방지 try-catch 필수)
    const dialogPauseMs = parseInt(process.env.DIALOG_PAUSE_MS ?? '800');
    page.on('dialog', async (dialog) => {
      console.log(`  [DIALOG] ${dialog.message()}`);
      if (dialogPauseMs > 0) await new Promise(r => setTimeout(r, dialogPauseMs));
      try { await dialog.accept(); } catch { /* 이미 처리된 dialog 무시 */ }
    });
    // Nexacro는 load 이벤트가 늦으므로 domcontentloaded + timeout 사용
    await page.goto(CONFIG.indexUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);
  });

  // TC001 ~ TC004 보일러플레이트
  // 시나리오별 TC 블록 — 각 TC에서 navigateTo{화면명}(page) 개별 호출
});
```

### 4.2 고정 TC (TC001~TC004)

| TC | 제목 | 검증 내용 |
|----|------|---------|
| TC001 | 메인 페이지 접근 | `page.url()`에 로그인 URL(`testLogin`) 미포함 |
| TC002 | 메뉴 탐색 | GNB `{gnbName}` 클릭 성공 여부 |
| TC003 | 화면 로드 확인 | `navigateTo{화면명}(page)` 반환값이 null이 아님 |
| TC004 | 자동 조회 실행 | `ds_list.rowcount >= 0` (fn_doInit → fn_search 실행) |

### 4.3 핵심 헬퍼 함수

#### waitForNexacroFrame

Nexacro MDIWORK 초기화 완료를 polling으로 대기한다.

```typescript
async function waitForNexacroFrame(
  page: Page,
  timeout: number = CONFIG.defaultTimeout
): Promise<Frame | null> {
  const mainFrame = page.mainFrame();
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const loaded = await mainFrame.evaluate(() => {
      try {
        const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
        if (!mdi) return false;
        // div_workForm.form 아래 실제 컴포넌트 존재 여부로 판단
        for (let i = 0; i < mdi.frames?.length; i++) {
          const wf = mdi.frames[i]?.form?.div_workForm?.form;
          if (wf?.btn_search !== undefined && wf?.ds_list !== undefined) return true;
        }
        return false;
      } catch { return false; }
    }).catch(() => false);
    if (loaded) return mainFrame;
    await page.waitForTimeout(300);
  }
  return null;
}
```

#### is{화면명}Loaded

`div_workForm.form` 하위의 화면 고유 컴포넌트(버튼·Dataset) 존재 여부로 로드 판단.
고유 컴포넌트 목록은 시나리오의 `sourceName` XFDL을 분석해 결정한다.

```typescript
async function is{화면명}Loaded(frame: Frame): Promise<boolean> {
  return await frame.evaluate(() => {
    try {
      const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
      if (!mdi) return false;
      for (let i = 0; i < mdi.frames?.length; i++) {
        const wf = mdi.frames[i]?.form?.div_workForm?.form;
        // 화면 고유 컴포넌트로 식별 (sourceName 기준 최소 2개 이상)
        if (
          wf?.btn_search !== undefined &&
          wf?.ds_list    !== undefined
        ) return true;
      }
      return false;
    } catch { return false; }
  }).catch(() => false);
}
```

#### clickTextInAnyFrame (공통 헬퍼)

모든 iframe을 **병렬**로 탐색해 텍스트를 찾아 클릭한다.  
순차 루프(`for frame of page.frames()` + `isVisible({ timeout: 500 })`)는 프레임 수 × 500ms로 매우 느리다.  
`Promise.all`로 동시 탐색하면 프레임 수에 무관하게 100ms 내에 결과가 나온다.

```typescript
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
```

> **주의**: 텍스트가 정확히 일치해야 한다. 화면 캡처로 실제 메뉴명을 확인 후 `menuName`에 반영한다.  
> (예: `직접구매신청` ≠ `직접구매지급신청` — 한 글자 차이로 못 찾고 타임아웃까지 소비)

#### navigateTo{화면명}

**진입 전 현재 로드 여부를 선체크**하여 이미 화면이 열려 있으면 GNB 탐색을 생략한다.  
모든 메뉴 탐색은 `clickTextInAnyFrame`을 사용한다.

```typescript
async function navigateTo{화면명}(page: Page): Promise<Frame | null> {
  const mainFrame = page.mainFrame();

  // ── 0단계: 이미 로드된 경우 재진입 생략 ──────────────────────────────
  if (await is{화면명}Loaded(mainFrame)) {
    console.log('  [NAV] 이미 로드됨 — 재진입 생략');
    return mainFrame;
  }

  // ── 1단계: Nexacro 앱 초기화 완료 대기 ──────────────────────────────
  console.log('  [NAV] Nexacro 초기화 대기 중...');
  await page.waitForFunction(() => {
    try { return !!(window as any).nexacro?.getApplication?.()?.mainframe; }
    catch { return false; }
  }, { timeout: 30000 }).catch(() => console.warn('  ⚠️  [NAV] Nexacro 초기화 30초 내 실패 — 계속 진행'));
  await page.waitForTimeout(500);

  // ── 2단계: GNB 클릭 + 서브메뉴 탐색 (최대 3회 재시도) ───────────────
  for (let retry = 0; retry < 3; retry++) {
    if (retry > 0) {
      console.log(`  [NAV] GNB 재시도 (${retry + 1}회차)`);
      await page.waitForTimeout(1000);
    }

    // GNB({gnbName}) 클릭 — 모든 프레임 병렬 탐색
    let gnbClicked = false;
    for (let attempt = 0; attempt < 10 && !gnbClicked; attempt++) {
      gnbClicked = await clickTextInAnyFrame(page, '{gnbName}');
      if (!gnbClicked) await page.waitForTimeout(300);
    }
    if (!gnbClicked) { console.warn('  ⚠️  [NAV] GNB 링크를 찾지 못함'); continue; }
    await page.waitForTimeout(3000);

    // {menuName} 직접 탐색 (15회 × 400ms = 최대 6초)
    // GNB 클릭 후 이미 메뉴가 펼쳐져 있으면 바로 클릭
    for (let i = 0; i < 15; i++) {
      if (await clickTextInAnyFrame(page, '{menuName}')) {
        await page.waitForTimeout(3000);
        return await waitForNexacroFrame(page, 45000);
      }
      await page.waitForTimeout(300);
    }

    // 중분류({middleMenu}) 클릭 후 재탐색
    // menuPath 노드가 2개 이하(GNB > 메뉴명)인 경우 이 블록을 생략한다.
    console.log(`  [NAV] "{menuName}" 미발견 — "{middleMenu}" 클릭 시도`);
    const groupClicked = await clickTextInAnyFrame(page, '{middleMenu}');
    if (!groupClicked) continue;
    await page.waitForTimeout(1000);

    for (let i = 0; i < 15; i++) {
      if (await clickTextInAnyFrame(page, '{menuName}')) {
        await page.waitForTimeout(3000);
        return await waitForNexacroFrame(page, 45000);
      }
      await page.waitForTimeout(300);
    }
  }

  console.error('  ❌  [NAV] 모든 retry 실패 — null 반환');
  return null;
}
```

### 4.4 시나리오 TC 블록 생성 규칙

Nexacro 화면의 실제 컴포넌트는 MDI 최상위 폼이 아닌 `div_workForm.form` 하위에 위치한다.
`nexacro.getActiveForm()` 대신 `MDIWORK.frames[i].form.div_workForm.form` 패턴으로 접근한다.

TC 내에서 `navigateTo{화면명}(page)`를 호출해 프레임을 획득하고,
이미 화면이 로드된 경우 `is{화면명}Loaded` 선체크로 재탐색을 생략한다.

#### 공통 헬퍼 — getWorkForm (TC 내 재사용)

```typescript
// frame.evaluate 내부에서 div_workForm.form을 가져오는 공통 스크립트
function getWorkFormScript(): string {
  return `
    const _mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
    let _wf = null;
    if (_mdi) {
      for (let _i = 0; _i < _mdi.frames?.length; _i++) {
        const _f = _mdi.frames[_i]?.form?.div_workForm?.form;
        if (_f?.btn_search !== undefined && _f?.ds_list !== undefined) { _wf = _f; break; }
      }
    }
  `;
}
```

`getWorkFormScript()`은 단독으로 사용하지 않고 `frame.evaluate`에 문자열 삽입 방식으로 주입한다.

```typescript
// 사용 예 — rowcount 조회
const rowCount: number = await frame.evaluate(
  new Function(`${getWorkFormScript()} return _wf?.ds_list?.rowcount ?? -1;`) as () => number
);

// 사용 예 — ds_search 컬럼 설정
await frame.evaluate(
  new Function('col', 'val', `${getWorkFormScript()} _wf?.ds_search?.setColumn(0, col, val);`) as
    (col: string, val: string) => void,
  '{col1}', '{val1}'
);
```

#### SELECT 시나리오

```typescript
test('[no:{N}] [통합] [{scenarioId}] {테스트명}', async ({ workerPage: page }) => {
  const frame = await navigateTo{화면명}(page);
  expect(frame).not.toBeNull();
  if (!frame) return;

  // 검색 조건 설정 (div_workForm.form.ds_search)
  await frame.evaluate(({ col, val }) => {
    const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
    let _wf = null;
    for (let i = 0; i < mdi?.frames?.length; i++) {
      const f = mdi.frames[i]?.form?.div_workForm?.form;
      if (f?.btn_search !== undefined && f?.ds_list !== undefined) { _wf = f; break; }
    }
    _wf?.ds_search?.setColumn(0, col, val);
  }, { col: '{col1}', val: '{val1}' });

  // 조회 버튼 클릭 + 응답 대기 (Race Condition 방지 — 클릭 전 사전 등록)
  const respPromise = page.waitForResponse(
    r => r.url().endsWith('{serviceId}.do') && r.status() === 200,
    { timeout: CONFIG.defaultTimeout }
  );
  await frame.evaluate(() => {
    const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
    for (let i = 0; i < mdi?.frames?.length; i++) {
      const wf = mdi.frames[i]?.form?.div_workForm?.form;
      if (wf?.btn_search !== undefined) { wf.btn_search.click(); break; }
    }
  });
  const resp = await respPromise;
  expect(resp.status()).toBe(200);

  // 결과 검증 (div_workForm.form.{outputDsId}.rowcount)
  const rowCount: number = await frame.evaluate(() => {
    const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
    for (let i = 0; i < mdi?.frames?.length; i++) {
      const wf = mdi.frames[i]?.form?.div_workForm?.form;
      if (wf?.ds_list !== undefined) return wf['{outputDsId}']?.rowcount ?? -1;
    }
    return -1;
  });
  expect(rowCount).toBeGreaterThanOrEqual(0);
});
```

#### INSERT 시나리오

```typescript
test('[no:{N}] [통합] [{scenarioId}] {테스트명}', async ({ workerPage: page }) => {
  const frame = await navigateTo{화면명}(page);
  expect(frame).not.toBeNull();
  if (!frame) return;

  // 데이터 입력 (div_workForm.form.{inputDsId})
  await frame.evaluate(({ cols }) => {
    const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
    for (let i = 0; i < mdi?.frames?.length; i++) {
      const wf = mdi.frames[i]?.form?.div_workForm?.form;
      if (wf?.btn_search !== undefined) {
        const ds = wf['{inputDsId}'];
        Object.entries(cols).forEach(([k, v]) => ds?.setColumn(0, k, v));
        break;
      }
    }
  }, { cols: {inputValues_parsed} });
  // {inputValues_parsed} — SCENARIO_STORE의 inputValues JSON 문자열을 파싱한 TypeScript 객체 리터럴.
  // 예: { RQST_SBJ: '테스트 요구명', ITEM_CD: '' }  자세한 생성 규칙은 5.1절 참고.

  // 저장 버튼 클릭 (Race Condition 방지 — 클릭 전 사전 등록)
  const respPromise = page.waitForResponse(
    r => r.url().endsWith('{serviceId}.do') && r.status() === 200,
    { timeout: CONFIG.defaultTimeout }
  );
  await frame.evaluate(() => {
    const mdi = (window as any).nexacro?.getApplication?.()?.MDIWORK;
    for (let i = 0; i < mdi?.frames?.length; i++) {
      const wf = mdi.frames[i]?.form?.div_workForm?.form;
      if (wf?.btn_save !== undefined) { wf.btn_save.click(); break; }
    }
  });
  const resp = await respPromise;
  expect(resp.status()).toBe(200);

  // 키 체이닝 (returnsKeyCol이 있는 경우)
  const body = await resp.text();
  const m = body.match(/{returnsKeyCol}[^>]*>([^<]+)<\/Col>/);
  if (m) savedRecordKey = m[1];
});
```

---

## 5. 코드 생성 입력값 처리 규칙

### 5.1 inputValues 파싱

`SCENARIO_STORE`의 `inputValues` 필드는 JSON 문자열. 생성 시 파싱하여 TypeScript 객체 리터럴로 변환.

```java
// Java (SpecTemplateService)
Map<String,String> vals = objectMapper.readValue(scenario.get("inputValues").toString(), Map.class);
String tsLiteral = vals.entrySet().stream()
    .map(e -> "'" + e.getKey() + "': '" + e.getValue() + "'")
    .collect(Collectors.joining(", ", "{ ", " }"));
```

### 5.2 날짜 플레이스홀더 치환

| 원문 값 | TypeScript 치환값 |
|---------|-----------------|
| `YEAR_START` | `` `${new Date().getFullYear()}0101` `` |
| `TODAY` | `TODAY` (상수 참조) |
| `오늘 날짜` (괄호 없음) | `TODAY` |
| 한글 텍스트 (괄호 없음) | 문자열 그대로 사용 |

### 5.3 expectedResult → 검증 코드 매핑

| expectedResult 포함 키워드 | 생성 검증 코드 |
|--------------------------|--------------|
| `1건 이상` | `expect(rowCount).toBeGreaterThan(0)` |
| `0건` | `expect(rowCount).toBe(0)` |
| `저장 완료` | `expect(resp.status()).toBe(200)` + 키 재조회 |
| `삭제` | 재조회 후 키 없음 검증 |
| `메시지` / `알림` | `page.waitForEvent('dialog')` |
| `팝업 열림` | `page.waitForEvent('popup')` |
| `기안기 호출` | `page.waitForResponse(r => r.url().includes('gw'))` |
| 그 외 | `expect(resp.status()).toBe(200)` (기본) |

### 5.4 extraDsRaw 파싱 (추가 Dataset)

```
형식: "ds_itemList:ITEM_CD=001,ITEM_NM=테스트|ds_extra:COL=VAL"

파싱 순서:
1. "|" 로 분리 → 각 Dataset
2. ":" 로 분리 → id / 컬럼=값 목록
3. "," 로 분리 → 각 컬럼=값 쌍
4. "=" 로 분리 → 컬럼명 / 값
```

---

## 6. 파일 저장 위치 및 명명 규칙

### 6.1 저장 경로

```
AiStateStore.SPEC_OUTPUT_DIR["{prefix}"]
  = "{appRoot}/etc/ai/tests/{testType}/"

단위: .../tests/unit/{YYYYMMDD}_{prefix}_unit.spec.ts
통합: .../tests/integrations/{YYYYMMDD}_{prefix}_inte.spec.ts
```

`appRoot`는 서버 시작 시 `FilePathHelper`가 감지하는 절대 경로.

### 6.2 파일명 패턴

```
20260621_pur_unit.spec.ts   ← 단위 테스트
20260621_pur_inte.spec.ts   ← 통합 테스트
```

`AiStateStore.SPEC_FILE_STORE["{prefix}_unit"]` / `"{prefix}_integ"`에 파일명 저장.

### 6.3 사용자 정의 파일명

생성된 파일(spec.ts, 시나리오 xlsx/hwpx/pdf)을 저장할 때 사용자가 파일명을 직접 지정할 수 있다.

#### 기본 파일명 규칙 (변경 전)

| 파일 종류 | 기본 파일명 패턴 |
|----------|--------------|
| spec.ts (단위) | `{yyyyMMdd}_{prefix}_unit.spec.ts` |
| spec.ts (통합) | `{yyyyMMdd}_{prefix}_inte.spec.ts` |
| 시나리오 xlsx | `{yyyyMMdd}_{prefix}_scenario.xlsx` |
| 시나리오 hwpx | `{yyyyMMdd}_{prefix}_scenario.hwpx` |
| 시나리오 pdf  | `{yyyyMMdd}_{prefix}_scenario.pdf`  |

#### 저장 흐름

```
저장 버튼 클릭
  → 파일명 입력 모달 표시
      - input[type=text] 에 기본 파일명 미리 채워짐 (확장자 제외)
      - 확장자는 고정 표시 (수정 불가)
      - 파일명 유효성 검사: 특수문자(\ / : * ? " < > |) 입력 불가
  → 사용자가 파일명 수정 후 확인 클릭
  → POST /ai/exportScenario.do (또는 /ai/generateSpecStream.do)
       파라미터: fileName={사용자 입력값}
  → 서버: 파일 생성 후 응답
       Content-Disposition: attachment; filename="{fileName}.{ext}"
  → 브라우저 저장 다이얼로그 (기본명 = 사용자 입력 파일명)
  → DB 저장 (FILE_NM = 사용자 입력 파일명 + 확장자)
```

> **브라우저 저장 다이얼로그와 DB 저장 기준:**  
> 브라우저 저장 다이얼로그에서 사용자가 로컬 저장 위치/파일명을 변경해도, DB에는 모달에서 입력한 파일명이 저장된다.  
> 두 단계가 분리되는 이유: 브라우저가 로컬 Save As 결과를 서버에 반환하지 않기 때문.

#### 모달 HTML 구조

```html
<div id="fileNameModal" style="display:none;">
  <div class="modal-body">
    <label>저장 파일명</label>
    <div style="display:flex; align-items:center; gap:4px;">
      <input type="text" id="inputFileName" style="flex:1;"
             oninput="this.value = this.value.replace(/[\\/:*?\"<>|]/g, '')"/>
      <span id="inputFileExt" style="color:#64748b; white-space:nowrap;"></span>
    </div>
  </div>
  <div class="modal-footer">
    <button onclick="confirmFileNameAndSave()">저장</button>
    <button onclick="closeFileNameModal()">취소</button>
  </div>
</div>
```

#### JS 함수

```javascript
function openFileNameModal(defaultName, ext, onConfirm) {
  document.getElementById('inputFileName').value = defaultName;
  document.getElementById('inputFileExt').textContent = '.' + ext;
  document.getElementById('fileNameModal').style.display = '';
  window._fileNameOnConfirm = onConfirm;
  window._fileNameExt = ext;
}

function confirmFileNameAndSave() {
  const name = document.getElementById('inputFileName').value.trim();
  if (!name) { alert('파일명을 입력하세요.'); return; }
  closeFileNameModal();
  window._fileNameOnConfirm(name, window._fileNameExt);
}

function closeFileNameModal() {
  document.getElementById('fileNameModal').style.display = 'none';
}

// spec.ts 존재 여부 가드
function guardSpecExport(prefix, testType) {
  const key = prefix + '_' + testType;
  if (!window.specTsGenerated || !window.specTsGenerated[key]) {
    alert('생성된 spec.ts가 없습니다. 먼저 테스트 코드를 생성하세요.');
    return false;
  }
  return true;
}

// 사용 예 — spec.ts 저장
function saveSpecTs(prefix, testType) {
  if (!guardSpecExport(prefix, testType)) return;
  const today = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const defaultName = today + '_' + prefix + '_' + testType;
  openFileNameModal(defaultName, 'spec.ts', function(name, ext) {
    const fileName = name + '.' + ext;
    fetch('/ai/generateSpecStream.do?prefix=' + prefix
        + '&testType=' + testType
        + '&fileName=' + encodeURIComponent(fileName))
      .then(res => res.blob())
      .then(blob => triggerDownload(blob, fileName));
    saveFileNameToDb(fileName, prefix, testType);
  });
}

function triggerDownload(blob, fileName) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}
```

#### 서버 파라미터 추가 (AiController)

기존 엔드포인트에 `userFileName` 파라미터를 추가한다.

```java
@RequestParam(required = false) String userFileName
```

- `userFileName`이 비어 있으면 기본 규칙으로 파일명 생성
- 있으면 해당 값을 Content-Disposition에 적용

```java
String finalName = (userFileName != null && !userFileName.trim().isEmpty())
    ? userFileName.trim()
    : defaultFileName;

response.setHeader("Content-Disposition",
    "attachment; filename=\"" + URLEncoder.encode(finalName, "UTF-8") + "\"");
```

#### DB 저장 (PSS_TC_PASS_MGT 또는 별도 이력 테이블)

파일명 저장용 컬럼: `FILE_NM VARCHAR2(200)`

```java
// TestSummaryService.saveFileName(prefix, testType, fileName)
Map<String,Object> param = new HashMap<>();
param.put("prefix",   prefix);
param.put("testType", testType);
param.put("fileNm",   fileName);
testSummaryDao.upsertFileName(param);
```

---

## 7. 실행 흐름 (TestRunnerService)

### 7.1 Playwright 프로세스 실행

```java
// Windows cmd.exe 경유 실행
ProcessBuilder pb = new ProcessBuilder(
    "cmd.exe", "/c",
    "npx playwright test " + specFile
    + " --project=" + (isUnit ? "unit" : "integration")
    + (headed ? " --headed" : "")
);
pb.directory(new File(projectRoot));
pb.environment().put("PATH", resolvedNodePath + ";" + pb.environment().get("PATH"));
pb.environment().put("BASE_URL", baseUrl);
```

### 7.2 결과 파싱

```java
// test-results/results.json에서 시나리오별 결과 추출
Pattern PAT = Pattern.compile(
    "\"title\"\\s*:\\s*\"(\\[no:\\d+\\][^\"]*)\"[\\s\\S]{1,2000}?\"ok\"\\s*:(true|false)"
);
// → no 추출 + ok 여부 → Map<Integer, Boolean>
```

### 7.3 SSE 이벤트 형식

```
data: {"type":"log","msg":"테스트 실행 중..."}
data: {"type":"result","no":1,"status":"PASS","remark":""}
data: {"type":"done","total":10,"passed":8,"failed":2}
```

---

## 8. UI 버튼 동작 규칙

### 8.0 시나리오 그리드 렌더링 규칙 (renderScenarioTable)

| 탭 | displayList 구성 | 비고 |
|----|-----------------|------|
| **단위** | 전체 시나리오 (`filtered` 그대로) — `scenarioId` 중복 행도 모두 개별 행으로 표시 | `no=2` 이상도 그리드에 직접 노출 |
| **통합** | `scenarioId`별 첫 번째 행만 표시 | 나머지는 더블클릭 팝업(`doScenDetailPopup`)으로 확인 |

> **이유**: 단위 시나리오는 버튼별로 독립적이므로 한 화면에서 복수 시나리오가 추출되면 각각 별도 행으로 확인·테스트할 수 있어야 한다.  
> 통합 시나리오는 `flowSteps`(단계별 플로우)를 팝업에서 확인하는 구조이므로 첫 번째 행만 노출하는 기존 방식을 유지한다.

---

### 8.1 상단 [테스트] 버튼 (id=btnConfirmScenario)

> 이전 이름: "🔧 코드 생성" → **현재: "▶ 테스트"** (doTest_sec_scenario.jsp)

체크된 모든 시나리오에 대해 **spec.ts 생성 → 자동 실행** 을 연속으로 수행한다. 탭(패널) 이동 없음.

```
[테스트] 버튼 클릭
  → doConfirmScenario()
       │  _autoRunOnSpecDone = true; _singleRowNo = null;
       │  doStartSpecStream(prefix, checkedIds)
       ▼
  generateSpecStream.do (SSE) — spec.ts 생성
       │  done 이벤트 수신 시:
       │    _autoRunOnSpecDone === true
       ▼
  doRunTest(null)  — 전체 시나리오 실행 (패널 이동 없음)
       │  runTest.do (SSE)
       ▼
  result 이벤트 → 각 행 테스트결과 컬럼 갱신
```

**제약**: 시나리오가 1개 이상 체크되어 있어야 한다.

---

### 8.2 그리드 행 [테스트] 버튼 (class=row-test-btn)

각 시나리오 행의 우측 고정 컬럼에 위치한다. **해당 시나리오 1건만** spec.ts 생성 후 자동 실행. 탭(패널) 이동 없음.

클릭 시 **confirm 다이얼로그**가 먼저 표시된다:
- `확인` → `--headed` 옵션으로 실행 (브라우저 창 표시)
- `취소` → headless 모드로 실행 (백그라운드)

```
행 [테스트] 버튼 클릭
  → doTestForRow(no, scenarioId)
       │  confirm('실제 동작을 확인하시겠습니까?') → _rowHeaded (true/false)
       │  _autoRunOnSpecDone = true; _singleRowNo = no;
       │  storeEditedScenarios.do (scenarios 배열 SCENARIO_STORE 동기화)
       │  doStartSpecStream(prefix, scenarioId, singleRow=true)
       ▼
  generateSpecStream.do?singleRow=true (SSE) — 단일 TC spec.ts 생성
       │  done 이벤트 수신 시:
       │    _autoRunOnSpecDone === true
       │    _headed = _rowHeaded; _rowHeaded = false (소비)
       ▼
  doRunTest(no, _headed)  — 해당 행 no만 실행 (패널 이동 없음)
       │  runTest.do?singleRowNo=no&headed=true/false (SSE)
       ▼
  result 이벤트 → 해당 행만 테스트결과·실패사유 갱신
```

#### headed 우선순위

`doRunTest(singleRowNo, headedOverride)` 에서:
1. `headedOverride`가 `undefined`/`null`이 아니면 → `headedOverride` 사용 (행 테스트 confirm 결과)
2. 그 외 → `#chkHeaded` 체크박스 값 사용 (상단 [▶ 테스트 실행] 버튼 경로)

---

### 8.3 _autoRunOnSpecDone 플래그 상태표

| 버튼 | `_autoRunOnSpecDone` | `_singleRowNo` | `_rowHeaded` | doRunTest 인수 |
|------|---------------------|----------------|-------------|--------------|
| 상단 [테스트] | `true` | `null` | `false` (무관) | `(null, undefined)` → 체크박스 |
| 행 [테스트] — 확인 | `true` | `no` (행 번호) | `true` | `(no, true)` → --headed |
| 행 [테스트] — 취소 | `true` | `no` (행 번호) | `false` | `(no, false)` → headless |
| (직접 생성만 원할 때) | `false` (기본) | - | - | - |

---

### 8.4 그리드 행 [테스트코드불러오기] 버튼

#### 8.4.1 목적

spec.ts를 **다시 생성하지 않고** 디스크에 이미 존재하는 파일을 불러와 `currentSpecFileName`을 설정한다.  
이후 같은 행의 **[테스트]** 버튼으로 즉시 실행 가능.

#### 8.4.2 UI 위치

| 위치 | 설명 |
|------|------|
| 시나리오 그리드 마지막 열 헤더 | `불러오기 \| 테스트` (두 버튼을 한 컬럼에 수용, `width:120px` 이상) |
| 각 행 sticky-right 셀 | `[불러오기]` 버튼 — `[테스트]` 버튼 좌측에 나란히 배치 |

```html
<!-- 헤더 예시 -->
<th class="scen-col-sticky-right" style="width:120px">불러오기 | 테스트</th>

<!-- 행 렌더링 예시 -->
<td style="text-align:center;white-space:nowrap">
  <button class="row-load-spec-btn"  ...>불러오기</button>
  <button class="row-test-btn"       ...>테스트</button>
</td>
```

#### 8.4.3 클라이언트 함수: `doLoadSpecForRow(no, scenarioId)`

```
[불러오기] 버튼 클릭
  → doLoadSpecForRow(no, scenarioId)
       │  1. listSpecFiles.do?prefix=currentPrefix 호출
       │     → { success, files: [ {name, path, lastModified}, ... ] }
       ▼
  파일 선택 모달 표시 (_showSpecPickerModal)
       │  tests/ 디렉터리 내 *.spec.ts 목록을 테이블로 렌더링
       │  각 행: 파일명 | 마지막수정 | [선택] 버튼
       ▼
  [선택] 클릭
       │  currentSpecFileName = selectedFile.name
       │  selectSpec.do?prefix=currentPrefix&specFile=selectedFile.name 호출
       │    → 서버 SPEC_FILE_STORE[prefix] = selectedFile.name 갱신
       ▼
  모달 닫기 + showAlert('success', '✅ ' + selectedFile.name + ' 로드됨')
       │  loadSpecPreview(currentSpecFileName)  ← 코드 미리보기 갱신
       ▼
  이후 같은 행 [테스트] 버튼으로 doTestForRow(no, scenarioId) 실행 가능
  (spec 재생성 없이 loaded spec으로 바로 runTest.do 호출)
```

#### 8.4.4 모달 구조 (`_showSpecPickerModal`)

```javascript
function _showSpecPickerModal(files, onSelect) {
  // files: [{ name, lastModified }]  (listSpecFiles.do 응답)
  // 기존 모달 DOM 재사용 또는 신규 div 생성
  // 파일명 오름차순 정렬 표시
  // [선택] 클릭 → onSelect(file) 콜백 실행 후 모달 닫기
  // [취소] 버튼으로 닫기
}
```

필터링: `_inte.spec.ts` / `_unit.spec.ts` 구분 탭 또는 접두어별 그룹핑 권장.

#### 8.4.5 서버 신규 엔드포인트 명세

**① `GET /ai/listSpecFiles.do`**

| 파라미터 | 필수 | 설명 |
|---------|------|------|
| `prefix` | 선택 | 지정 시 해당 prefix로 시작하는 파일만 반환 |

응답:
```json
{
  "success": true,
  "files": [
    { "name": "pur_20260621_inte.spec.ts", "lastModified": "2026-06-21 14:30:00", "size": 8192 },
    { "name": "pur_20260620_inte.spec.ts", "lastModified": "2026-06-20 09:10:00", "size": 7640 }
  ]
}
```

구현 메모:
- `FilePathHelper.getSpecDir(request)` 하위를 재귀 탐색
- `*.spec.ts` 파일만 수집
- `lastModified` = `file.lastModified()` → `yyyy-MM-dd HH:mm:ss` 포맷
- `prefix` 파라미터 존재 시 `file.getName().startsWith(prefix)` 필터 적용

**② `GET /ai/selectSpec.do`**

| 파라미터 | 필수 | 설명 |
|---------|------|------|
| `prefix` | 필수 | SPEC_FILE_STORE 키 |
| `specFile` | 필수 | 불러올 파일명 (예: `pur_20260621_inte.spec.ts`) |

응답:
```json
{ "success": true, "specFile": "pur_20260621_inte.spec.ts" }
```

구현 메모:
- `findFileRecursive(getSpecDir(request), specFile)` 로 파일 존재 검증
- `AiStateStore.SPEC_FILE_STORE.put(prefix, specFile)` 갱신
- 파일 없으면 `{ "success": false, "message": "파일 없음: ..." }`

#### 8.4.6 기존 코드와의 통합 포인트

| 항목 | 기존 코드 | 불러오기 후 상태 |
|------|----------|----------------|
| `currentSpecFileName` | spec 생성 시 SSE done 이벤트에서 설정 | `doLoadSpecForRow`에서 직접 설정 |
| `SPEC_FILE_STORE[prefix]` | `generateSpecStream.do` 완료 시 등록 | `selectSpec.do` 호출로 갱신 |
| `btnRunTest` 활성화 | spec 생성 완료 시 `disabled=false` | 불러오기 완료 시 동일하게 `disabled=false` |
| `specFileInfo` 텍스트 | spec 생성 완료 시 갱신 | 불러오기 완료 시 동일하게 갱신 |
| `loadSpecPreview()` | spec 생성 완료 500ms 후 호출 | 불러오기 완료 즉시 호출 |

---

### 8.5 [■ 중지] 버튼 (id=btnStopTest)

테스트 실행 중 **즉시 중단**을 요청한다. SSE 스트림과 서버 프로세스를 모두 종료.

#### 8.5.1 UI 위치

`doTest_sec_run.jsp` — `[테스트 시작]` 버튼 우측에 나란히 배치.

```html
<button class="btn btn-danger" id="btnStopTest" onclick="doStopTest()" disabled>■ 중지</button>
```

- 평상시: `disabled=true`
- 테스트 실행 중(`doRunTest` 호출 후): `disabled=false`
- 중지 완료/에러: 다시 `disabled=true`

#### 8.5.2 클라이언트 동작 (`doStopTest`)

```
[■ 중지] 클릭
  → doStopTest()
       │  testEventSource.close()  ← SSE 구독 즉시 종료
       │  btnStop.disabled = true
       │  statusEl = '중지 중...'
       ▼
  POST /ai/stopTest.do?prefix={currentPrefix}
       │  서버: AiStateStore에서 PID 조회 → process.destroy()
       ▼
  응답 수신 → showAlert('warning', '테스트가 중지되었습니다.')
       │  globalProgressFinish(false) 는 _closeTestES() 경로에서 처리
```

#### 8.5.3 서버 동작 (`stopTest.do`)

- `AiStateStore.TEST_PID_STORE.get(prefix)` 로 실행 중인 Playwright 프로세스 PID 조회
- `ProcessHandle.of(pid)` → `destroy()` 호출
- 종료 후 스토어에서 PID 제거

---

### 8.6 실패사유 컬럼 + err_log.md

테스트 FAIL 시 실패 원인을 그리드에 표시하고 파일로 누적 기록한다.

#### 8.6.1 시나리오 데이터 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `failReason` | string | 테스트 실패 시 SSE `remark` 값이 자동 설정됨. 직접 편집 가능 |

`doAddRow()` 기본값: `failReason: ''`

#### 8.6.2 그리드 컬럼 위치

테스트결과 → **실패사유 ✏** → 확인자 → PL확인 → 사유 → 사용자확인 → 테스트

- 셀 id: `failReason{no}`
- 스타일: `color:#b91c1c` (빨간 텍스트)
- `data-field="failReason"` — 인라인 편집 가능

#### 8.6.3 SSE result 이벤트 처리 흐름

```
result 이벤트 수신 (no|PASS/FAIL|remark)
  → testResult = 'FAIL' 일 때:
       │  scenarios[i].failReason = remark
       │  document.getElementById('failReason' + no).textContent = remark
       ▼
  POST /ai/appendErrLog.do
       body: { no, scenarioId, testName, error: remark, prefix }
       ▼
  서버: tests/err_log.md 에 append
```

#### 8.6.4 err_log.md 형식

파일 위치: `FilePathHelper.getSpecDir(request)` (`tests/`) 디렉터리 하위

```markdown
## [2026-06-22 14:30:00] TC#3 - PUR_0010M_001
**prefix**: pur
**testName**: 구매요청 목록 조회
**error**: expect(received).toBe(expected) ...

---
```

- 내용은 **누적 append** (덮어쓰기 아님)
- 나중에 그룹화·문자열 치환 용도로 보관

#### 8.6.5 storeEditedScenarios.do와의 연동

`doTestForRow` 호출 시 `storeEditedScenarios.do`로 전체 `scenarios` 배열을 서버 SCENARIO_STORE에 먼저 동기화한다. 이때 `failReason` 필드도 함께 전송되어 서버에 반영된다.

---

### 8.7 전역 상단 프로그레스바

모든 비동기 버튼 클릭 시 화면 상단에 진행 상태를 표시하는 공통 컴포넌트.

#### 8.7.1 DOM 요소 (doTest.jsp 또는 공통 레이아웃)

| id | 역할 |
|----|------|
| `globalProgressWrap` | 전체 래퍼 (숨김/표시 전환) |
| `globalProgressBar` | 실제 진행 막대 (width % 제어) |
| `globalProgressPct` | 퍼센트 텍스트 |
| `globalProgressLabel` | 작업명 텍스트 |

#### 8.7.2 API

| 함수 | 호출 시점 |
|------|---------|
| `globalProgressStart(label)` | 비동기 작업 시작 직전 |
| `globalProgressStep(done, total)` | SSE progress 이벤트 수신 시 |
| `globalProgressFinish(success)` | 완료(true=초록) / 실패(false=빨강) |

#### 8.7.3 적용 버튼 현황

| 함수 | 프로그레스 라벨 | 비고 |
|------|--------------|------|
| `doGenerateScenario()` | 시나리오 생성 중... | 내부 로컬 바 병행 |
| `doSaveScenarioDB()` | DB 저장 중... | 내부 로컬 바 병행 |
| `doAddHistoryGroup()` | 이력 추가 중... | |
| `doStartSpecStream()` | spec.ts 생성 중... | SSE progress → globalProgressStep |
| `doTestForRow()` | 테스트 코드 생성 중... → 테스트 실행 중... | 2단계 연속 표시 |
| `doRunTest()` | TC #N 테스트 실행 중... / 테스트 실행 중... | singleRow 여부에 따라 라벨 분기 |
| `doExportScenariosExcel()` | 엑셀 시나리오 생성 중... | |
| `doGenerateReport()` | AI 분석 리포트 생성 중... | |
| `doGenerateDefectFix()` | AI 소스 개선방안 분석 중... | |
| `doDownload()` | 결과서 ZIP 생성 중... | |
| `doMultiFormatDownload()` | 다중 형식 내보내기 중... | |
| `doRestoreFromGroup()` | 시나리오 복원 중... | |
| `doLoadSpecForRow()` | spec.ts 목록 조회 중... → {파일명} 로드 중... | 2단계 |

**동기 함수** (`doAddRow`, `doDeleteRows`, `doScenDetailPopup`, `doSaveReportVersion` 등)는 즉시 완료되므로 프로그레스바 미적용.

---

## 10. 웹 엔드포인트 목록

| 엔드포인트 | 메서드 | 주요 파라미터 | 역할 |
|-----------|--------|------------|------|
| `/ai/generateSpecStream.do` | GET (SSE) | `prefix`, `testType`, `scenarioIds`, `singleRow` | spec.ts 생성 스트리밍 |
| `/ai/runTest.do` | GET (SSE) | `prefix`, `headed`, `specFileName`, `singleRowNo` | Playwright 실행 스트리밍 |
| `/ai/stopTest.do` | POST | `prefix` | 실행 중 프로세스 강제 종료 |
| `/ai/runSpecTest.do` | POST | `specFile`, `project` | 지정 스펙 파일 직접 실행 (SSE) |
| `/ai/storeEditedScenarios.do` | POST | `{ prefix, rows }` | 클라이언트 scenarios → SCENARIO_STORE 동기화 |
| `/ai/listSpecFiles.do` | GET | `prefix` (선택) | tests/ 내 *.spec.ts 목록 반환 |
| `/ai/selectSpec.do` | GET | `prefix`, `specFile` | SPEC_FILE_STORE[prefix] 갱신 |
| `/ai/appendErrLog.do` | POST | `{ no, scenarioId, testName, error, prefix }` | tests/err_log.md 에 FAIL 로그 누적 |
| `/ai/generateReport.do` | GET | `prefix` | AI 분석 리포트 생성 |
| `/ai/generateDefectFix.do` | POST | `{ prefix, fails[] }` | FAIL 시나리오 AI 개선방안 분석 |
| `/ai/downloadResult.do` | POST | `{ prefix, results }` | 결과서 ZIP 다운로드 |
| `/ai/exportScenarioList.do` | POST | `{ prefix, scenarios }` | 시나리오 목록 Excel 다운로드 |
| `/ai/extractUnitScenarios.do` | GET (SSE) | `prefix` | XFDL → 단위 시나리오 추출 |
| `/ai/getSourceList.do` | GET | `prefix` | XFDL 파일 목록 조회 |

---

## 9. pgmId 변환 규칙

Nexacro XML 요청의 CSRF 검증에 사용되는 `pgmId`는 `sourceName`에서 파생된다.

```
sourceName (XFDL)  →  pgmId (서버 검증)
pur5115m           →  PUR_5115M
pur5110m           →  PUR_5110M
gdm1020p           →  GDM_1020P
```

변환 로직:
1. 소문자 → 대문자
2. 첫 번째 영문자 그룹과 숫자 그룹 사이에 `_` 삽입
3. 접미사(M, P 등 단일 알파벳) 유지

---

## 10. DB 테이블 설계

테스트 자동화 시스템이 사용하는 테이블 전체를 목적별로 분류한다.

### 10.1 테이블 관계도

```
SYS_MENU_MGT (기존)          SYS_PGM_MGT (기존)
       │                            │
       └─── MenuResolveDao 조회 ────┘
                    │
                    ▼
          PSS_TEST_SCEN_GRP  ←── GRP_ID (PK)
                    │
                    ├──── PSS_TEST_SCEN          (시나리오 상세, FK: GRP_ID)
                    │
                    └──── PSS_TC_GEN_HIST        (코드 생성 이력, FK: GRP_ID)

          PSS_TC_PASS_MGT                        (통과 현황, 독립 테이블)
```

### 10.2 PSS_TEST_SCEN_GRP — 시나리오 그룹

시나리오 일괄 생성 단위. XFDL 분석 또는 Excel 업로드 1회 실행 = 그룹 1개.

**주요 쿼리 패턴**
```sql
-- 그룹 등록
INSERT INTO PSS_TEST_SCEN_GRP (GRP_ID, SCEN_CNT, CRAT_DT, UPDT_DT, CRAT_USER)
VALUES (#{grpId}, #{scenCnt}, SYSDATE, SYSDATE, #{cratUser});

-- 시나리오 개수 갱신 (시나리오 INSERT 완료 후)
UPDATE PSS_TEST_SCEN_GRP
   SET SCEN_CNT = #{scenCnt}, UPDT_DT = SYSDATE
 WHERE GRP_ID = #{grpId};

-- 목록 조회 (최신순)
SELECT GRP_ID, SCEN_CNT,
       TO_CHAR(CRAT_DT,'YYYY-MM-DD HH24:MI:SS') AS CRAT_DT,
       CRAT_USER
  FROM PSS_TEST_SCEN_GRP
 ORDER BY CRAT_DT DESC;
```

**사용 서비스**: `ScenarioDao.insertScenarioGroup()`, `ScenarioDao.updateScenarioGroup()`

---

### 10.3 PSS_TEST_SCEN — 시나리오 상세

그룹 하위 개별 시나리오. `SCENARIO_STORE`에서 DB로 영속화되는 단위.

**SCENARIO_STORE 필드 → 컬럼 매핑**

| SCENARIO_STORE 필드 | PSS_TEST_SCEN 컬럼 |
|--------------------|-----------------|
| `no` | `SEQ` |
| `sourceName` | `SOURCE_NM` |
| `화면명` | `DISPLAY_NM` |
| `testType` | `TEST_TYPE` |
| `crudType` | `CRUD_TYPE` |
| `URL` | `URL` |
| `serviceId` | `SCEN_ID` 일부 |
| `inputDsId` | `INPUT_DS_ID` |
| `inputCols` | `INPUT_COLS` |
| `inputValues` | `TEST_DATA` |
| `outputDsId` | `OUTPUT_DS_ID` |
| `expectedResult` | `EXPT_RSLT` |
| `사전조건` | `PRE_COND` |
| `gnbName` | `GNB_NM` |
| `menuName` | `MENU_NM` |
| `menuPath` | `GROUP_NM` 조합 |
| `origin` | `ORIGIN` |

**주요 쿼리 패턴**
```sql
-- 시나리오 등록 (SCENARIO_STORE → DB 영속화)
INSERT INTO PSS_TEST_SCEN
       (GRP_ID, SCEN_ID, SEQ, TEST_TYPE, SOURCE_NM, DISPLAY_NM, ORIGIN,
        GNB_NM, GROUP_NM, MENU_NM, TEST_NM, URL, METHOD,
        PRE_COND, EXPT_RSLT, CRUD_TYPE, HAS_GW,
        INPUT_DS_ID, INPUT_COLS, OUTPUT_DS_ID, TEST_DATA,
        CRAT_DT, UPDT_DT)
VALUES (#{grpId}, #{scenId}, #{seq}, #{testType}, #{sourceNm}, #{displayNm}, #{origin},
        #{gnbNm}, #{groupNm}, #{menuNm}, #{testNm}, #{url}, #{method},
        #{preCond}, #{exptRslt}, #{crudType}, #{hasGw},
        #{inputDsId}, #{inputCols}, #{outputDsId}, #{testData},
        SYSDATE, SYSDATE);

-- 그룹별 시나리오 조회 (SCENARIO_STORE 재적재용)
SELECT SCEN_ID AS "scenarioId", SEQ AS "no", TEST_TYPE AS "testType",
       SOURCE_NM AS "sourceName", DISPLAY_NM AS "화면명", ORIGIN AS "origin",
       GNB_NM AS "gnbName", MENU_NM AS "menuName", TEST_NM AS "테스트명",
       URL, METHOD AS "method", CRUD_TYPE AS "crudType",
       INPUT_DS_ID AS "inputDsId", INPUT_COLS AS "inputCols",
       OUTPUT_DS_ID AS "outputDsId", TEST_DATA AS "inputValues",
       PRE_COND AS "사전조건", EXPT_RSLT AS "expectedResult"
  FROM PSS_TEST_SCEN
 WHERE GRP_ID = #{grpId}
 ORDER BY SCEN_ID, SEQ;

-- 그룹 전체 삭제 (재생성 시)
DELETE FROM PSS_TEST_SCEN WHERE GRP_ID = #{grpId};
```

**사용 서비스**: `ScenarioDao.insertScenario()`, `ScenarioDao.selectScenariosByGroup()`, `ScenarioDao.deleteScenariosByGroup()`

---

### 10.4 PSS_TC_PASS_MGT — 테스트 통과 현황

Playwright 실행 결과를 3단계 승인(DEV → PL → USER)으로 관리한다.

**통과 순서 강제 규칙** (`TestSummaryService.validatePassOrder`)
```
DEV_PASS = 'Y'  →  PL_PASS 갱신 가능
PL_PASS  = 'Y'  →  USER_PASS 갱신 가능
역순 갱신 시 예외 발생 (DEV 없이 PL 불가, PL 없이 USER 불가)
```

**주요 쿼리 패턴**
```sql
-- 테스트 실행 결과 최초 등록 (Playwright 결과 파싱 후)
INSERT INTO PSS_TC_PASS_MGT
       (SCENARIO_ID, TEST_TYPE, SCREEN_NAME, TEST_NAME,
        DEV_PASS, PL_PASS, USER_PASS, REG_DT, UPD_DT)
VALUES (#{scenarioId}, #{testType}, #{screenName}, #{testName},
        'N', 'N', 'N', SYSDATE, SYSDATE);

-- 통과 단계 갱신 (passLevel: 'DEV'|'PL'|'USER', passYn: 'Y'|'N')
UPDATE PSS_TC_PASS_MGT
   SET DEV_PASS       = DECODE(#{passLevel}, 'DEV',  #{passYn}, DEV_PASS),
       PL_PASS        = DECODE(#{passLevel}, 'PL',   #{passYn}, PL_PASS),
       USER_PASS      = DECODE(#{passLevel}, 'USER', #{passYn}, USER_PASS),
       LAST_PASS_DATE = CASE WHEN #{passYn} = 'Y' THEN SYSDATE ELSE LAST_PASS_DATE END,
       UPD_DT         = SYSDATE
 WHERE SCENARIO_ID = #{scenarioId}
   AND TEST_TYPE   = #{testType};

-- 비고 수정 (FAIL 원인 메모)
UPDATE PSS_TC_PASS_MGT
   SET REMARK = #{remark}, UPD_DT = SYSDATE
 WHERE SCENARIO_ID = #{scenarioId}
   AND TEST_TYPE   = #{testType};

-- 통과 현황 집계
SELECT TEST_TYPE,
       COUNT(*) AS TOTAL,
       SUM(CASE WHEN DEV_PASS  = 'Y' THEN 1 ELSE 0 END) AS DEV_CNT,
       SUM(CASE WHEN PL_PASS   = 'Y' THEN 1 ELSE 0 END) AS PL_CNT,
       SUM(CASE WHEN USER_PASS = 'Y' THEN 1 ELSE 0 END) AS USER_CNT
  FROM PSS_TC_PASS_MGT
 WHERE TEST_TYPE = #{testType}
 GROUP BY TEST_TYPE;
```

**사용 서비스**: `TestSummaryService`, `TestSummaryDao`  
**연계**: Playwright 실행 결과(`test-results/results.json`) → `TestRunnerService`가 파싱 후 이 테이블에 기록

---

### 10.5 PSS_TC_GEN_HIST — 테스트 코드 생성 이력

`SpecTemplateService`가 spec.ts 파일을 생성할 때마다 이력을 기록한다.

**주요 쿼리 패턴**
```sql
-- 이력 등록 (CLOB는 PreparedStatement.setCharacterStream 사용)
INSERT INTO PSS_TC_GEN_HIST
       (HIST_ID, GRP_ID, SPEC_TYPE, SPEC_FILE_NM, SCEN_CNT, SCEN_IDS, GEN_DT, GEN_USER)
VALUES (?, ?, ?, ?, ?, ?, SYSDATE, ?);
-- SCEN_IDS 예: ["IT_PUR_5110M_001","IT_PUR_5110M_002","IT_PUR_5115M_001"]

-- 이력 조회
SELECT HIST_ID, GRP_ID, SPEC_TYPE, SPEC_FILE_NM, SCEN_CNT,
       TO_CHAR(GEN_DT, 'YYYY-MM-DD HH24:MI:SS') AS GEN_DT,
       GEN_USER
  FROM PSS_TC_GEN_HIST
 WHERE GRP_ID = ?         -- 선택사항
 ORDER BY GEN_DT DESC;
```

**SCEN_IDS에서 소스명 추출 (Java)**
```java
// 정규식: (IT|UT|E2E)_{SOURCE}_{NNN} → SOURCE 추출
Pattern.compile("(IT|UT|E2E)_([A-Z0-9]+)_\\d{3}").matcher(scenIds)
```

**사용 서비스**: `TcGenHistDao` (MyBatis 미사용, PreparedStatement 직접 실행)

---

### 10.6 참조 테이블 (기존 시스템)

테스트 자동화가 조회만 하고 수정하지 않는 기존 시스템 테이블.

| 테이블명 | 주요 컬럼 | 조회 목적 |
|---------|---------|---------|
| `SYS_MENU_MGT` | `MENU_ID`, `UPP_MENU_ID`, `MENU_NM`, `PGM_ID`, `LVL`, `USE_YN`, `CLS_CD` | XFDL sourceName → 메뉴 경로(GNB > 중분류 > 메뉴명) 계층 조회 |
| `SYS_PGM_MGT` | `PGM_ID`, `PGM_NM` | pgmId 존재 여부 검증 |
| `SYS_PGM_USER` | `PGM_ID`, `ROLE_ID` | 화면별 역할(엑터) 조회 |
| `SYS_ROLE_MGT` | `ROLE_ID`, `ROLE_NM` | 역할명 조회 (시나리오 엑터 필드) |

**메뉴 경로 쿼리** (`MenuResolveMapper.xml`)
```sql
-- sourceName → 루트부터 리프까지 메뉴명 목록 반환 (계층 탐색)
SELECT MENU_NM
  FROM SYS_MENU_MGT
 WHERE MENU_ID IN (
           SELECT MENU_ID
             FROM SYS_MENU_MGT
            START WITH MENU_ID IN (
                       SELECT MENU_ID
                         FROM SYS_MENU_MGT
                        WHERE UPPER(PGM_ID) IN (#{pgmId}, #{noSuffix})  -- 예: PUR_5110M, PUR_5110
                          AND CLS_CD NOT IN ('QUK','MAN')               -- 즐겨찾기·매뉴얼 제외
                   )
            CONNECT BY PRIOR UPP_MENU_ID = MENU_ID                     -- 리프 → 루트 역방향
       )
   AND MENU_ID != 'M_ROOT'
   AND USE_YN = 'Y'
 ORDER BY LVL ASC;    -- 루트(낮음) → 리프(높음) 순 정렬
-- 결과 예: ["구매관리", "MRO관리", "MRO구매요구신청"]
-- → String.join(" > ", rows) = "구매관리 > MRO관리 > MRO구매요구신청"
```

---

### 10.7 전체 데이터 흐름 (테이블 기준)

```
① XFDL 분석 or Excel 업로드
        │
        ▼
② PSS_TEST_SCEN_GRP INSERT  ← grpId = "{PREFIX}_{yyyyMMddHHmmss}"
        │
        ▼
③ SYS_MENU_MGT SELECT      ← sourceName → menuPath 조회
        │
        ▼
④ PSS_TEST_SCEN INSERT (시나리오별)
        │
        ▼
⑤ PSS_TEST_SCEN_GRP UPDATE  ← SCEN_CNT 갱신
        │
        ▼
⑥ SpecTemplateService → spec.ts 파일 생성
        │
        ▼
⑦ PSS_TC_GEN_HIST INSERT    ← 생성 이력 기록
        │
        ▼
⑧ npx playwright test 실행
        │
        ▼
⑨ test-results/results.json 파싱
        │
        ├── PSS_TC_PASS_MGT INSERT  ← 최초 등록 (DEV/PL/USER = N)
        │
        └── PSS_TC_PASS_MGT UPDATE  ← 통과 단계별 갱신 (DEV→PL→USER 순서 강제)
```

---

## 11. 세션 관리 (fixtures.ts)

### 10.1 동작 원리

spec 파일은 세션을 직접 관리하지 않는다. `import { test, expect } from '../fixtures'`로 가져오는
`workerPage` fixture가 worker 전체 수명 동안 세션을 유지한다.

**세션 획득 순서 (fixtures.ts):**

```
① CDP 영속 브라우저 확인 (.auth/browser-ws.json 존재 시)
     chromium.connectOverCDP(cdpUrl) → 기존 컨텍스트 재사용
     → "[fixture] 기존 CDP 컨텍스트 재사용" 로그 출력
     → 로그인 재실행 없음, 이전 테스트 상태 그대로 유지

② 폴백: Playwright 기본 브라우저
     browser.newContext({ storageState: '.auth/user.json', ... })
     → auth.setup.ts 에서 저장한 세션 쿠키 주입
     → 로그인 페이지 없이 앱 접근

③ workerPage 픽스처
     기존 열린 페이지가 있으면 재사용 (pg.url() 확인)
     없으면 새 페이지 생성 후 CONFIG.indexUrl 로 1회 이동
```

### 10.2 세션 만료 감지

```typescript
// fixtures.ts 내 자동 감지 로직
if (pg.url().includes('testLogin') || pg.url().includes('login')) {
  throw new Error('세션 만료 — npx playwright test --project=setup 재실행 필요');
}
```

세션이 만료되면 `workerPage` 획득 시점에 에러가 발생한다.
spec에서 별도로 로그인 상태를 확인할 필요 없다.

### 10.3 spec 작성 원칙

- spec에서 `test.use({ storageState: ... })`를 **별도로 선언하지 않는다.** fixtures가 처리한다.
- 로그인 TC를 별도로 만들지 않는다. TC001에서 `page.url()`에 `testLogin` 미포함 여부만 확인한다.
- `beforeEach`의 `page.goto(CONFIG.indexUrl)`은 페이지 상태 초기화용이며 로그인 과정이 아니다.
  workerPage는 세션을 유지한 채로 index.jsp를 로드한다.

### 10.4 storageState 경로

| 환경 | 경로 |
|------|------|
| storageState 파일 | `.auth/user.json` |
| CDP WebSocket 정보 | `.auth/browser-ws.json` |

---

## 12. 제약 사항

- `XfdlParserService.java`는 직접 수정하지 않는다. 기존 출력(`XfdlInfo`)을 재사용한다.
- spec.ts 생성 중 AI API를 직접 호출하지 않는다. 시나리오 데이터만으로 생성한다.
- 날짜 기본값은 코드 생성 시점의 `LocalDate.now()` 기준으로 하드코딩하지 않는다. TypeScript 런타임 상수(`TODAY`)를 사용한다.
- 병렬 실행: 단위 테스트는 `--workers=2`, 통합 테스트는 `--workers=1` (Nexacro 세션 공유 문제).

---

## 13. 관련 문서

- [scenario_extraction.md](scenario_extraction.md) — XFDL 분석 → 단위 시나리오 추출 설계
- [structure.md](structure.md) — Java 클래스 설계 및 코드 제약 사항
- [result.md](result.md) — 테스트 결과 처리 및 승인 흐름
