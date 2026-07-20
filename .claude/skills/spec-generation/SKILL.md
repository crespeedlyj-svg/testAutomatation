---
name: spec-generation
description: "Playwright TypeScript 스펙 파일 생성 스킬. SCENARIO_STORE JSON을 읽어 _unit.spec.ts(단위/API-direct)와 _inte.spec.ts(통합/UI-driven)를 생성한다. spec-generator 에이전트가 사용. 'spec 파일 만들어줘', 'playwright 코드 생성', '테스트 코드 작성', 'unit spec', 'integration spec' 요청 시 이 스킬을 참조하라."
---

# Playwright 스펙 생성 스킬

`_workspace/{prefix}/01_scenarios.json`(per-pgm 형식)을 읽어 Playwright TypeScript 스펙 파일을 생성한다.

---

## 1. 테스트 유형별 방식 구분 (반드시 준수)

| 유형 | 파일 | 방식 | 특징 |
|------|------|------|------|
| **단위 테스트** | `tests/unit/` | **API-direct** | `page.request.post` + nexacroXml 직접 호출. UI 없음. |
| **통합 테스트** | `tests/integration/` | **UI-driven** | `openMenuById` + `setNexacroComponentValue`. 실제 UI 조작. |

> 단위 테스트에서 `openMenuById`, `navigateTo` 사용 금지.
> 통합 테스트에서 `page.request.post` 직접 호출 금지.

---

## 2. 파일 명명 규칙

`testCode`는 고정 리터럴 문자열이다 — pgmId/prefix로 치환하지 않는다. 파일 내 여러 pgmId가 섞여도
파일명은 생성 시각으로만 구분한다.

| 유형 | 경로 | 파일명 |
|------|------|--------|
| 단위 | `tests/unit/` | `testCode_{YYYYMMDD_HHmmss}_unit.spec.ts` |
| 통합 | `tests/integration/` | `testCode_{YYYYMMDD_HHmmss}_inte.spec.ts` |

예: `testCode_20260707_143000_unit.spec.ts`, `testCode_20260707_143000_inte.spec.ts`

---

## 3. 공통 파일 레벨 상수

### 단위 spec 상수

```typescript
const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const API_URL        = '{scenarios.apiUrl}';      // 예: '/mis/pur/pur0910/getList.do'
const PGM_ID         = '{scenarios.pgmId}';       // API 본문 전용 — 테스트명 사용 금지

// ds_search 컬럼 목록 (scenarios.dsSearchCols 배열 그대로)
const DS_SEARCH_COLUMNS = ['{col1}', '{col2}', ...];
```

### 통합 spec 상수

```typescript
const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';
const SLOW           = 1500;

const MENU_ID     = '{scenarios.menuId}';         // 예: 'M_MIS_06_01_05'
const PGM_ID      = '{scenarios.pgmId}';          // describe 제목 고유화 전용
const API_URL     = '{scenarios.apiUrl}';
const RESULT_COLS = {scenarios.resultCols};        // 예: ['DEPT_CD', 'DEPT_NM', 'USE_YN']
const CLEAR_COLS  = {scenarios.dsSearchCols};      // 예: ['SCH_HDODF_CD', 'SCH_USE_YN']
```

> **MENU_ID 결정 규칙:**
> 1. `_workspace/00_menu_ids.json` 캐시 파일 확인
> 2. `scenarios.menuId` 필드 사용
> 3. 위 둘 다 없거나 플레이스홀더이면 `M_MIS_XX_XX_XX` 사용 + TODO 주석
>
> 플레이스홀더 `M_MIS_XX_XX_XX`는 통합 테스트를 전부 실패시킨다.
> 반드시 실제 ID를 확인한 뒤 생성하라.

---

## 4. 단위 테스트 (API-direct) 표준 구현

### 4-1. 공통 헬퍼 함수 (모든 단위 spec에 동일하게 포함)

```typescript
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';

// ── Nexacro XML 요청 본문 생성 ─────────────────────────────────────────────
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

// API 호출 — page.evaluate(fetch) + credentials:'include' (브라우저 세션 쿠키 포함)
// page.request.post 사용 금지 — SameSite 쿠키가 누락돼 서버가 ErrorCode=-1을 반환함
async function apiPost(page: Page, endpoint: string, xml: string) {
  const fullUrl = `${BASE_URL}${endpoint}`;
  const result = await page.evaluate(
    async ({ url, xmlBody }: { url: string; xmlBody: string }) => {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
        body: xmlBody,
        credentials: 'include',
      });
      return { status: resp.status, body: await resp.text() };
    },
    { url: fullUrl, xmlBody: xml }
  );
  return { status: () => result.status, text: async () => result.body } as any;
}

// ds_search 단일 행 헬퍼 — 항상 DS_SEARCH_COLUMNS 전체 포함 (isNotEmpty가 빈 값 스킵)
function searchBody(params: Record<string, string>): string {
  const allParams = Object.fromEntries(DS_SEARCH_COLUMNS.map(c => [c, params[c] ?? '']));
  return nexacroXml(
    [{ id: 'ds_search', columns: DS_SEARCH_COLUMNS, rows: [allParams] }],
    PGM_ID
  );
}
```

> **searchBody 규칙**: 항상 `DS_SEARCH_COLUMNS` 전체를 columns로 지정한다.
> `Object.keys(params)` 방식으로 일부 컬럼만 보내면 안 된다.
> 빈 값은 iBATIS `<isNotEmpty>` 가 자동 스킵한다.

### 4-2. 단위 describe 래퍼

```typescript
// describe 제목은 반드시 pgmId를 포함해 화면 간 고유성을 보장한다.
// PGM_ID가 블록 스코프 const이므로 템플릿 리터럴 ${PGM_ID}로 삽입한다.
test.describe(`{menuName}(${PGM_ID}) 단위 테스트`, () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // TC 블록들...
});
```

> **describe 고유화 규칙 (필수):** 서로 다른 pgmId인데 screenName이 우연히 같은 화면들이
> 존재한다(예: act_3460M·act_7070M 둘 다 "미수취확인"). describe 제목이 screenName만으로
> 구성되면 Playwright가 중복 타이틀로 collection 단계 전체를 중단시킨다(0건 실행).
> describe 제목에는 반드시 `(${PGM_ID})` 또는 하드코딩된 pgmId를 포함시켜라.
> 개별 `test()` 제목은 `[no:N] {menuName} - {설명}` 형태로 describe 내에서 이미 고유하므로 그대로 둔다
> (Playwright는 describe+test 전체 경로가 고유하면 통과한다).

### 4-3. SELECT 전체 조회 TC

```typescript
/**
 * [no:1] [단위] [SELECT] {menuName} - 전체 조회
 * 중분류: {중분류}  소분류: {소분류}  메뉴명: {메뉴명}  액터: {액터}
 * URL: {apiUrl}
 * 예상결과: {menuName} 목록이 조회된다. (총 N건)
 * DB 확인: {dbCountSql}
 */
test('[no:1] {menuName} - 전체 조회', async ({ workerPage: page }) => {
  logTestStart('[no:1] {menuName} - 전체 조회');
  logInput('검색조건', '없음');

  const resp   = await apiPost(page, API_URL, searchBody({}));
  const result = await assertNexacroResponse(resp, 'getList.do');
  const rows   = parseNexacroXmlRows(result.body, 'ds_list');

  logResult('조회 건수', `${rows.length}건`);
  if (rows[0]) console.log(`  첫 행: ${JSON.stringify(rows[0])}`);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/{menuName}-no1-all.png`, fullPage: true });

  // expectedCount > 0 이면 toBe(N), 0이면 toBeGreaterThan(0)
  expect(rows.length, '{menuName} 전체 조회 1건 이상').toBeGreaterThan(0);
  logResult('검증', 'PASS');
});
```

### 4-4. SELECT 조건 검색 TC

```typescript
/**
 * [no:2] [단위] [SELECT] {menuName} - {조건 설명}
 * 중분류: {중분류}  소분류: {소분류}  메뉴명: {메뉴명}  액터: {액터}
 * 예상결과: {menuName} 목록이 조회된다. (총 N건)
 * DB 확인: {dbCountSql}
 */
test('[no:2] {menuName} - {조건 설명}', async ({ workerPage: page }) => {
  logTestStart('[no:2] {menuName} - {조건 설명}');
  logInput('{searchCol}', '{searchVal}');

  const resp   = await apiPost(page, API_URL, searchBody({ {searchCol}: '{searchVal}' }));
  const result = await assertNexacroResponse(resp, 'getList.do');
  const rows   = parseNexacroXmlRows(result.body, 'ds_list');

  logResult('조회 건수', `${rows.length}건`);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/{menuName}-no2.png`, fullPage: true });

  expect(rows.length, '{menuName} {조건 설명} 1건 이상').toBeGreaterThan(0);
  // rowValidation이 있으면 추가
  rows.forEach((r, i) =>
    expect(r.{resultCol}, `[행${i}] 조건 불일치`).toBe('{expectVal}')
  );
  logResult('검증', `PASS — ${rows.length}행`);
});
```

### 4-5. 0건 기대 TC (expectZero: true)

```typescript
/**
 * [no:3] [단위] [SELECT] {menuName} - {조건 설명} (0건 기대)
 * 중분류: {중분류}  소분류: {소분류}  메뉴명: {메뉴명}  액터: {액터}
 * 예상결과: {menuName} 0건 반환. (총 0건)
 */
test('[no:3] {menuName} - {조건 설명} (0건)', async ({ workerPage: page }) => {
  logTestStart('[no:3] {menuName} - {조건 설명}');
  logInput('{col}', '{val}');

  const resp   = await apiPost(page, API_URL, searchBody({ {col}: '{val}' }));
  const result = await assertNexacroResponse(resp, 'getList.do');
  const rows   = parseNexacroXmlRows(result.body, 'ds_list');

  logResult('조회 건수', `${rows.length}건`);

  expect(rows.length, '{menuName} 0건 기대').toBe(0);
  logResult('검증', 'PASS');
});
```

### 4-6. expectedCount 값에 따른 assertion 선택

| `expectedCount` | `expectZero` | assertion |
|---|---|---|
| `0` (미확인) | `false` | `toBeGreaterThan(0)` |
| `> 0` (DB 확인됨) | `false` | `toBe(N)` |
| `0` | `true` (확인됨) | `toBe(0)` |

---

## 5. 통합 테스트 (UI-driven) 표준 구현

### 5-1. 공통 임포트 및 헬퍼

```typescript
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import { logInput, logResult, logTestStart, flushLogs } from '../utils/test-logger';
import {
  openMenuById,
  waitForNexacroAppReady,
  setNexacroComponentValue,
  clearNexacroDataset,
  getNexacroDatasetRows,
  waitForNexacroDataset,
} from '../utils/nexacro-helper';
```

### 5-2. navigateTo 헬퍼

```typescript
async function navigateTo(page: Page): Promise<string> {
  await waitForNexacroAppReady(page, 20000);

  const initResp = page.waitForResponse(
    r => r.url().includes(API_URL), { timeout: 20000 }
  ).catch(() => null);

  const nav = await openMenuById(page, MENU_ID);
  if (!nav.ok) throw new Error(`메뉴 로드 실패: ${nav.error}`);
  console.log(`[NAV] menuNm=${nav.menuNm}`);

  const resp = await initResp;
  if (resp) console.log(`[NAV] 초기 조회 HTTP ${resp.status()}`);

  await page.locator('text="조회"').first().waitFor({ state: 'visible', timeout: 15000 });

  const dsReady = await waitForNexacroDataset(page, MENU_ID, 'ds_list', 1, 10000);
  console.log(`[NAV] ds_list ready=${dsReady}`);

  return MENU_ID;
}
```

### 5-3. search 헬퍼

```typescript
async function search(
  page: Page,
  formKey: string,
  conditions: Record<string, string>
): Promise<Record<string, string>[]> {
  await clearNexacroDataset(page, formKey, 'ds_search', CLEAR_COLS);

  for (const [col, val] of Object.entries(conditions)) {
    const ok = await setNexacroComponentValue(page, formKey, col, val);
    console.log(`  [SET] ${col}="${val}" ${ok ? 'OK' : 'FAIL'}`);
  }

  await page.waitForTimeout(SLOW);

  const respPromise = page.waitForResponse(
    r => r.url().includes(API_URL), { timeout: 15000 }
  );
  await page.locator('text="조회"').first().click();

  const resp = await respPromise;
  expect(resp.status(), 'API HTTP 200 필요').toBe(200);

  await waitForNexacroDataset(page, formKey, 'ds_list', 0, 8000).catch(() => null);
  await page.waitForTimeout(SLOW);

  return getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);
}
```

### 5-4. 통합 describe 래퍼

```typescript
// 단위 spec과 동일하게 describe 제목에 pgmId를 포함시켜 화면 간 고유성을 보장한다.
test.describe(`{menuName}(${PGM_ID}) 통합 테스트`, () => {
  test.beforeAll(() => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
  test.afterAll(() => { flushLogs(); });

  // TC 블록들...
});
```

### 5-5. 통합 TC 예시

```typescript
/**
 * [no:1] [통합] [SELECT] {menuName} - 전체 조회
 * 중분류: {중분류}  소분류: {소분류}  메뉴명: {메뉴명}  액터: {액터}
 * 예상결과: {menuName} 목록이 조회된다. (총 N건)
 * DB 확인: {dbCountSql}
 */
test('[no:1] {menuName} - 전체 조회', async ({ workerPage: page }) => {
  logTestStart('[no:1] {menuName} - 전체 조회');
  logInput('검색조건', '없음');

  const formKey = await navigateTo(page);
  const rows    = await getNexacroDatasetRows(page, formKey, 'ds_list', RESULT_COLS);

  logResult('조회 건수', `${rows.length}건`);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/{menuName}-inte-no1-all.png`, fullPage: true });

  expect(rows.length, '{menuName} 전체 조회 1건 이상').toBeGreaterThan(0);
  logResult('검증', 'PASS');
});
```

---

## 5-6. INSERT/DELETE 통합 테스트 (setSave/setDelSave) — 생성 전 필수 사전조사

**배경(실사례):** ass 모듈에서 팝업이 없는 화면인데도 "팝업을 열고 입력한다"고 가정해 존재하지 않는
버튼 ID(`btn_reg`)를 지어내고, 필수 입력 필드를 채우는 대신 `// TODO` 주석만 남기고, DELETE TC가
방금 등록한 행을 선택하는 대신 등록 버튼을 다시 여는 오류가 발생한 적이 있다. **버튼 ID·입력 흐름을
추측하는 것은 금지**한다. 아래 절차를 반드시 거친 뒤에만 INSERT/DELETE TC를 생성한다.

### 5-6-1. 화면 흐름 판별 (Pattern A vs Pattern B)

M 파일에서 저장/삭제 버튼의 `onclick` 핸들러 함수 본문을 직접 읽어 실제 흐름을 판별한다.
(`grep`으로 `<Button ... onclick="fn_save"/>` 같은 실제 버튼 id/핸들러명을 먼저 찾고, 그 함수 정의부
`this.fn_save = function` 본문을 읽는다.)

| 패턴 | 판별 기준 | 처리 |
|------|----------|------|
| **A. 그리드 인라인 편집** | 핸들러가 팝업을 열지 않고 곧바로 `this.gfn_tran(..., "setSave", ...)`를 호출 (그리드 셀 편집으로 이미 변경된 데이터셋을 그대로 전송) | **INSERT/DELETE TC 생성 보류.** SELECT류 통합 TC만 생성하고, `_note`에 "그리드 인라인 편집 화면 — 자동 INSERT/DELETE 생성 대상 아님" 명시 |
| **B. 팝업 기반** | 버튼 클릭이 별도 팝업 폼을 여는 경로로 이어짐 (동일 prefix의 `*P.xfdl` 파일이 실제로 존재하고, 그 팝업 안에 별도의 저장/삭제 버튼이 있음) | 아래 5-6-2 절차로 팝업을 분석해 INSERT/DELETE TC 생성 |

Pattern A를 Pattern B로 잘못 판단해 존재하지 않는 팝업 흐름을 지어내는 것이 가장 흔한 오류이므로,
반드시 M 파일의 실제 핸들러 코드를 읽고 판별할 것 — `*P.xfdl` 파일의 존재 여부만으로 추측하지 말 것
(P 파일이 있어도 M의 저장 버튼과 무관한 별도 용도일 수 있다).

### 5-6-2. Pattern B — 팝업 기반 화면의 실제 값 추출

1. **버튼 ID**: 팝업 XFDL에서 `<Button id="..." onclick="...">` 태그를 직접 grep해서 저장/삭제 버튼의
   실제 id를 가져온다 (`btn_save`/`btn_reg`/`btn_confirm` 등 프로젝트마다 다름 — 절대 하드코딩 추측 금지).
2. **필수 입력 필드**: 팝업 XFDL에서 `cssclass="essential"`이 붙은 `Edit`/`Combo`/`Calendar`/`MaskEdit`/
   `Radio` 컴포넌트의 `id`를 전부 추출한다. `00_component_label_map.csv`에 이미 해당 화면의 컴포넌트-라벨
   매핑이 있으면 우선 활용한다.
3. **입력값**: 각 필드 타입에 맞는 결정적 기본값을 채운다 (추측 금지, 아래 규칙 고정):
   - `Edit`(문자) → 화면명 기반 짧은 테스트 문자열 (예: `"TEST_자산명"`)
   - `Edit`(숫자, `inputtype="number"`) 또는 `MaskEdit` → `"1"` 또는 컬럼명에 맞는 소수(`"1000"` 등)
   - `Calendar` → 오늘 날짜(`YYYY-MM-DD`)
   - `Combo`/`Radio` → 코드값은 실행 시점에만 알 수 있으므로, 폼이 로드된 후
     `getNexacroComponentValue`로 기본 선택값을 그대로 사용(별도 설정 생략). `displaynulltext`만 있고
     기본값이 없는 경우에만 `_note`에 "코드값 미확정 — 실행 후 확인 필요"로 남기고 생성은 계속한다.
4. **모든 필수 필드를 `setNexacroComponentValue(page, formKey, fieldId, value)`로 실제 채운다.**
   `// TODO: 입력항목 채우기` 같은 미완성 주석으로 남기고 넘어가는 것은 금지 — 채우거나, 못 채우면
   해당 화면은 Pattern A와 동일하게 SELECT-only로 강등한다.
5. **DELETE TC**: 등록 버튼을 다시 여는 것은 금지. INSERT TC에서 채번된 키(`sharedKey`)를
   `selectNexacroRowByKey(page, formKey, dataset, keyCol, sharedKey)`로 그리드에서 실제 검색·선택한
   뒤에만 삭제 버튼을 클릭한다 (`tests/utils/nexacro-helper.ts`에 이미 구현되어 있음 — import해서 사용).

```typescript
import { selectNexacroRowByKey } from '../utils/nexacro-helper';
// ...
const found = await selectNexacroRowByKey(page, formKey, 'ds_list', 'AST_MNG_CD', sharedKey);
expect(found, '방금 등록한 행을 그리드에서 찾지 못함').toBe(true);
await triggerNexacroButton(page, formKey, 'btn_delete'); // 실제 XFDL에서 확인된 id
```

---

## 6. 테스트명 필수 규칙 (위반 시 재생성)

### 규칙 1 — PGM_ID/pgmId/sourceName 사용 금지

| 잘못된 예 (금지) | 올바른 예 |
|---|---|
| `'PUR_0910M - 전체 조회'` | `'직접구매지급신청 - 전체 조회'` |
| `logTestStart('hrm_0130M - 사용여부')` | `logTestStart('부서관리 - 사용여부')` |

개별 `test()` 제목·`logTestStart` 등 **TC 레벨 명칭은 항상 `menuName`**을 사용한다.
pgmId/sourceName/XFDL 파일명은 절대 불가.

> **예외 — describe 제목:** `test.describe(...)` 제목만은 pgmId를 포함해야 한다(규칙 3 참조).
> 이유: screenName이 겹치는 화면이 있어 describe가 menuName만으로는 충돌한다.

### 규칙 2 — 예상결과에 menuName + DB 건수

예상결과 JSDoc 형식:
```typescript
/**
 * 예상결과: {menuName} 목록이 조회된다. (총 N건)
 * DB 확인: SELECT COUNT(*) FROM {테이블} WHERE 조건
 */
```

`(총 N건)`: `expectedCount > 0`이면 실제 숫자, `0`이면 `(총 N건 — DB 확인 필요)`.

### 규칙 3 — describe 제목은 `menuName(pgmId)` (고유성 필수)

describe 제목은 반드시 pgmId를 포함해 화면 간 고유성을 보장한다. screenName만 쓰면
서로 다른 화면(예: act_3460M·act_7070M 둘 다 "미수취확인")이 동일 describe 제목을 갖게 되어
Playwright가 중복 타이틀로 collection 전체를 중단시킨다(0건 실행).

```typescript
test.describe(`직접구매지급신청(${PGM_ID}) 단위 테스트`, () => { ... });  // ✅ PGM_ID 블록 const 삽입
test.describe('직접구매지급신청 단위 테스트', () => { ... });             // ❌ pgmId 누락 — 충돌 위험
test.describe('PUR_0910M 단위 테스트', () => { ... });                   // ❌ menuName 누락
```

PGM_ID가 블록 스코프 const로 존재하면 템플릿 리터럴 `${PGM_ID}`로 삽입한다.
const가 없으면 하드코딩된 pgmId 문자열을 직접 넣어도 된다(예: `미수취확인(act_7070M) 단위 테스트`).

---

## 7. Combo(선택 항목) 값 입력

코드값(`'Y'`, `'N'`, `''`)으로 지정한다. 한글 표시값 사용 금지.

```typescript
await setNexacroComponentValue(page, formKey, 'SCH_USE_YN', 'Y');   // ✅
await setNexacroComponentValue(page, formKey, 'SCH_USE_YN', '사용'); // ❌
```

---

## 8. 생성 금지 사항

**통합 테스트에서:**
- `page.request.post` 직접 호출 — `search()` 헬퍼 사용
- `clickTextInAnyFrame` GNB 네비게이션 — `openMenuById` 사용
- `ds_search.setColumn()` 직접 호출 — `setNexacroComponentValue` 사용

**단위 테스트에서:**
- `openMenuById`, `navigateTo`, `waitForNexacroAppReady` — API-direct만 사용
- `page.evaluate` + `fetch` 조합 — `page.request.post` 사용 (쿠키 자동 포함)

**모든 spec에서:**
- `page.goto(indexUrl)` 또는 로그인 코드 — fixtures.ts가 처리
- 하드코딩된 사용자 계정
- `M_MIS_XX_XX_XX` 플레이스홀더 MENU_ID를 통합 spec에 그대로 사용

**INSERT/DELETE 통합 TC에서 (5-6 참조):**
- XFDL에서 확인하지 않은 버튼 ID를 지어내는 것 (`btn_reg` 등 추측 이름 금지 — 실제 태그에서 grep한 id만 사용)
- 필수 입력 필드를 `// TODO` 주석으로 남기고 미입력 상태로 저장 버튼을 누르는 것
- DELETE TC에서 등록/추가 버튼을 다시 열어 "선택"을 대신하는 것 — 반드시 `selectNexacroRowByKey`로
  방금 등록한 키를 그리드에서 찾아 선택한 뒤 삭제할 것
- 그리드 인라인 편집 화면(Pattern A)에 대해 팝업 기반 흐름을 지어내는 것 — SELECT-only로 강등할 것

---

## 9. 출력

생성된 파일 목록을 `_workspace/{prefix}/02_spec_files.json`에 기록 후 SendMessage로 test-runner에 전달한다.

```json
{
  "prefix": "pur",
  "generatedAt": "2026-06-28",
  "files": {
    "unit": "tests/unit/testCode_20260628_143000_unit.spec.ts",
    "integration": "tests/integration/testCode_20260628_143000_inte.spec.ts"
  }
}
```

## 참고 문서 (references/)

- `references/spec-templates.md` — spec.ts 생성 템플릿
- `references/makeTestCode.md` — **원본 프로그램의 테스트 코드 자동 생성 로직 정의서(역기재).** 우리 스펙 생성 결과를 원본 프로그램 출력과 정합화할 때 기준으로 읽는다.
