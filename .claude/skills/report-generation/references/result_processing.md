# 테스트 결과 처리 설계 문서

> 작성일: 2026-06-21
> 대상 시스템: MIS (Nexacro + Spring MVC)
> 관련 파일: `TestRunnerService.java`, `TestSummaryService.java`, `TestSummaryDao.java`, `TestSummaryMapper.xml`

---

## 1. 개요

Playwright 테스트 실행 결과를 파싱하여 **개발자 → PL → 사용자** 3단계 통과 여부를 관리한다.

통과여부 컬럼은 **시나리오 추출 그리드(탭 A)에서부터 표시**되며, 테스트 실행 전에는 `-`(미실행)로 초기화된 상태로 존재한다. 테스트가 완료되면 개발자 통과여부가 자동으로 `통과` 또는 `미통과`로 설정된다.

---

## 2. 통과여부 컬럼 표시 위치

### 2.1 탭 A: 시나리오 추출 그리드

시나리오 생성 버튼 클릭 후 나타나는 그리드에 통과여부 컬럼이 **처음부터 포함**된다. 테스트 실행 전이므로 모든 통과여부는 `-`로 표시된다.

| 사용자 표시명 | 내부 필드 | 초기값 | 테스트 후 |
|-------------|----------|--------|----------|
| 개발자 통과여부 | `DEV_PASS` | `미진행` | 통과 / 미통과 (자동) |
| PL 통과여부 | `PL_PASS` | `미진행` | 통과 / 미통과 (수동) |
| 사용자 통과여부 | `USER_PASS` | `미진행` | 통과 / 미통과 (수동) |
| 사유 | `REMARK` | `` | 텍스트 입력 (수동) |

> 통과여부 컬럼은 수동 편집 불가(읽기 전용)이며, 사유(`REMARK`)만 수동 입력 가능하다.
> 단, PL 통과여부와 사용자 통과여부는 `doTest_summary.jsp`에서 별도 갱신한다.

### 2.2 전체 그리드 컬럼 순서 (탭 A 기준)

```
번호 | 소스명 | 화면명 | 테스트유형 | CRUD유형 | URL | 서비스ID
| 입력Dataset | 입력컬럼 | 출력Dataset | 입력값
| 메서드 | 출처 | 테스트명 | 사전조건 | 기대결과
| 메뉴경로 | 메뉴그룹 | 메뉴명
| 개발자 통과여부 | PL 통과여부 | 사용자 통과여부 | 사유
```

---

## 3. 통과여부 표시 규칙

### 3.1 렌더링

`css/ai/doTest.css`에 이미 정의된 클래스를 사용한다. **별도 CSS 추가 불필요.**

```css
/* css/ai/doTest.css — 447~449 라인 (기존 클래스 그대로 사용) */
.result-pass    { background: #dcfce7; color: #15803d; font-weight: 700; padding: 2px 8px; border-radius: 2px; }
.result-fail    { background: #fee2e2; color: #b91c1c; font-weight: 700; padding: 2px 8px; border-radius: 2px; }
.result-running { background: #fef9c3; color: #92400e; font-weight: 700; padding: 2px 8px; border-radius: 2px; }
```

미진행 상태(`null`)는 별도 클래스 없이 인라인 스타일로 처리한다.

```javascript
function renderPassYn(val) {
  if (val === 'Y') return '<span class="result-pass">통과</span>';
  if (val === 'N') return '<span class="result-fail">미통과</span>';
  return '<span style="color:#9ca3af">미진행</span>';  // 테스트 미실행
}
```

| 값 | 표시 | CSS 클래스 |
|----|------|-----------|
| `'Y'` | 통과 (초록) | `result-pass` |
| `'N'` | 미통과 (빨강) | `result-fail` |
| `null` | 미진행 (회색) | 인라인 스타일 |

### 3.2 SCENARIO_STORE 초기값

시나리오 추출 시(`XfdlScenarioExtractor.buildScenarios()`) 통과여부 필드를 `null`로 초기화한다.

```java
scenario.put("DEV_PASS",  null);
scenario.put("PL_PASS",   null);
scenario.put("USER_PASS", null);
scenario.put("REMARK",    "");
```

그리드에서 `null` → `renderPassYn(null)` → `미진행` 표시.

---

## 4. 테스트 완료 시 자동 설정 흐름

```
[사용자] 테스트 실행 버튼 클릭
    │
    ▼
TestRunnerService.runTest()
    │  npx playwright test → SSE 스트리밍
    │
    ▼
test-results/results.json 파싱
    │
    ├── PASS → DEV_PASS = 'Y'
    └── FAIL → DEV_PASS = 'N'
    │
    ▼
PSS_TC_PASS_MGT INSERT / UPDATE  (TestSummaryDao)
    │
    ▼
SSE: { type:"result", no:1, status:"PASS", remark:"" }
    │
    ▼
[UI] 해당 행 DEV_PASS 컬럼 갱신
    ├── PASS → "통과" (초록)
    └── FAIL → "미통과" (빨강)
```

### 4.1 SSE 결과 수신 후 그리드 갱신

result 이벤트 수신 시 다음 두 가지를 모두 갱신한다.

| 갱신 대상 | 함수 | 업데이트 내용 |
|---------|------|------------|
| `scenarios[i].DEV_PASS` | `refreshGridRow(no)` | 통과/미통과 배지 (`id="devpass{no}"`) |
| `scenarios[i].testResult` | `refreshTestResultCell(no, status)` | PASS/FAIL 배지 (`id="testResultBadge{no}"`) |

```javascript
// result 이벤트 핸들러 (doTest_script.jsp)
scenarios[i].DEV_PASS   = (testResult === 'PASS' ? 'Y' : 'N');
scenarios[i].testResult = testResult;   // "PASS" 또는 "FAIL" 원문 저장
scenarios[i].REMARK     = remark;
refreshGridRow(no);              // devpass/plpass/userpass 배지 갱신
refreshTestResultCell(no, testResult);  // 테스트결과 컬럼 PASS/FAIL 배지 갱신
```

**`refreshTestResultCell(no, status)`** — 테스트결과 td(`id="tres{no}"`) 상단에 PASS/FAIL 배지를 삽입/갱신.

```javascript
function refreshTestResultCell(no, status) {
  var td = document.getElementById('tres' + no);
  if (!td) return;
  var existing = document.getElementById('testResultBadge' + no);
  if (!existing) {
    existing = document.createElement('div');
    existing.id = 'testResultBadge' + no;
    existing.style.cssText = 'font-size:11px;font-weight:700;margin-bottom:2px';
    td.insertBefore(existing, td.firstChild);
  }
  if (status === 'PASS')      existing.innerHTML = '<span class="result-pass">PASS</span>';
  else if (status === 'FAIL') existing.innerHTML = '<span class="result-fail">FAIL</span>';
  else                        existing.innerHTML = '';
}
```

**테스트결과 컬럼(`id="tres{no}"`) 최종 구조:**

```
<td id="tres{no}">
  <div id="testResultBadge{no}">   ← PASS / FAIL (테스트 실행 후 표시)
    <span class="result-pass">PASS</span>
  </div>
  <div>  ← DEV_PASS 배지 + tstat 오버레이 (기존)
    <span id="devpass{no}">통과</span>
    <span id="tstat{no}" style="display:none">실행중</span>
  </div>
</td>
```

---

## 5. DB 처리 (TestSummaryDao)

### 5.1 최초 등록 — 테스트 실행 직후

```sql
INSERT INTO PSS_TC_PASS_MGT
       (SCENARIO_ID, TEST_TYPE, SCREEN_NAME, TEST_NAME,
        DEV_PASS, PL_PASS, USER_PASS, REG_DT, UPD_DT)
VALUES (#{scenarioId}, #{testType}, #{screenName}, #{testName},
        #{devPass}, 'N', 'N', SYSDATE, SYSDATE)
```

`devPass`는 Playwright 결과 기준 `'Y'`(PASS) 또는 `'N'`(FAIL).

### 5.2 단계별 갱신 — PL / 사용자 통과 처리

```sql
UPDATE PSS_TC_PASS_MGT
   SET DEV_PASS       = DECODE(#{passLevel}, 'DEV',  #{passYn}, DEV_PASS),
       PL_PASS        = DECODE(#{passLevel}, 'PL',   #{passYn}, PL_PASS),
       USER_PASS      = DECODE(#{passLevel}, 'USER', #{passYn}, USER_PASS),
       LAST_PASS_DATE = CASE WHEN #{passYn} = 'Y' THEN SYSDATE ELSE LAST_PASS_DATE END,
       UPD_DT         = SYSDATE
 WHERE SCENARIO_ID = #{scenarioId}
   AND TEST_TYPE   = #{testType}
```

### 5.3 사유 수정

```sql
UPDATE PSS_TC_PASS_MGT
   SET REMARK = #{remark}, UPD_DT = SYSDATE
 WHERE SCENARIO_ID = #{scenarioId}
   AND TEST_TYPE   = #{testType}
```

---

## 6. 통과 순서 강제 규칙

```
DEV_PASS = 'Y'  →  PL_PASS 갱신 가능
PL_PASS  = 'Y'  →  USER_PASS 갱신 가능
역순 갱신 시 → 서버 예외 발생 (400 반환)
```

```java
// TestSummaryService.validatePassOrder()
public void validatePassOrder(String scenarioId, String passLevel, String passYn) {
    if ("Y".equals(passYn)) {
        PassStatus cur = dao.selectPassStatus(scenarioId);
        if ("PL".equals(passLevel)   && !"Y".equals(cur.getDevPass()))
            throw new IllegalStateException("개발자 통과 후 PL 통과 가능합니다.");
        if ("USER".equals(passLevel) && !"Y".equals(cur.getPlPass()))
            throw new IllegalStateException("PL 통과 후 사용자 통과 가능합니다.");
    }
}
```

---

## 7. doTest_summary.jsp 연계

`탭 A` 그리드의 통과여부는 읽기 전용이며, PL/사용자 통과 갱신은 `doTest_summary.jsp`에서 수행한다.

```
doTest_summary.jsp
  ├─ 통계: 전체 n건 중 개발자/PL/사용자 통과 m건
  ├─ 그리드: 시나리오별 통과 현황 (DEV / PL / USER 배지 표시)
  └─ PL 통과 / 사용자 통과 버튼 → /ai/updatePassStatus.do → TestSummaryService
```

`탭 A` 그리드는 `loadPurEditorGrid()` 호출 시 `PSS_TC_PASS_MGT`에서 최신 통과여부를 조회하여 반영한다.

---

## 8. doTest_summary.jsp UI 설계

### 8.1 조회 버튼

- **위치**: 페이지 우측 상단
- **클릭 시 동작**: `prefix`(현재 선택된 업무) 기준으로 `/ai/getPassStatusList.do` 호출 → 통과 현황 그리드 재조회

```javascript
// 우측 상단 조회 버튼
document.getElementById('btnSearch').addEventListener('click', function() {
  loadPassStatusGrid(getCurrentPrefix());
});

function loadPassStatusGrid(prefix) {
  fetch('/ai/getPassStatusList.do?prefix=' + prefix)
    .then(res => res.json())
    .then(data => {
      currentPassList = data.list;
      renderPassStatusGrid(currentPassList);
    });
}
```

### 8.2 그리드 더블클릭 — 상세 팝업

통과 현황 그리드의 행을 더블클릭하면 해당 시나리오의 상세 내용을 모달로 표시한다.

**표시 필드**

| 필드 | 설명 |
|------|------|
| 시나리오 ID | `SCENARIO_ID` |
| 테스트 유형 | `TEST_TYPE` (`unit` / `integ`) |
| 화면명 | `SCREEN_NAME` |
| 테스트명 | `TEST_NAME` |
| 개발자 통과여부 | `DEV_PASS` (`통과` / `미통과` / `-`) |
| PL 통과여부 | `PL_PASS` |
| 사용자 통과여부 | `USER_PASS` |
| 최종 통과일시 | `LAST_PASS_DATE` |
| 사유 | `REMARK` |

```javascript
// 그리드 행 더블클릭 이벤트
function onPassGridDblClick(rowData) {
  const html = `
    <table class="detail-table">
      <tr><th>시나리오 ID</th><td>${rowData.SCENARIO_ID}</td></tr>
      <tr><th>테스트 유형</th><td>${rowData.TEST_TYPE}</td></tr>
      <tr><th>화면명</th><td>${rowData.SCREEN_NAME}</td></tr>
      <tr><th>테스트명</th><td>${rowData.TEST_NAME}</td></tr>
      <tr><th>개발자 통과여부</th><td>${renderPassYn(rowData.DEV_PASS)}</td></tr>
      <tr><th>PL 통과여부</th><td>${renderPassYn(rowData.PL_PASS)}</td></tr>
      <tr><th>사용자 통과여부</th><td>${renderPassYn(rowData.USER_PASS)}</td></tr>
      <tr><th>최종 통과일시</th><td>${rowData.LAST_PASS_DATE || '-'}</td></tr>
      <tr><th>사유</th><td>${rowData.REMARK || ''}</td></tr>
    </table>`;
  openDetailModal('통과 현황 상세', html);
}

---

## 9. 통합테스트 단계별 통과 판별 규칙

통합테스트 시나리오는 `flowSteps[]`로 구성된 **복수의 순번 단계**를 하나의 시나리오로 실행한다.

### 9.1 판별 원칙

> **하나라도 실패하면 시나리오 전체 미통과.**

| 조건 | DEV_PASS 결과 |
|------|-------------|
| 모든 단계 PASS | `'Y'` (통과) |
| 1개 이상 단계 FAIL | `'N'` (미통과) |

### 9.2 단계별 결과 구조

`flowSteps[]` 각 단계는 실행 후 `stepResult` 필드가 추가된다.

```java
// flowStep 맵 필드 (실행 후)
{
  "step":           1,
  "url":            "/mis/pur/pur5115/save.do",
  "serviceId":      "save",
  "expectedResult": "HTTP 200, 저장 성공",
  "stepResult":     "PASS"   // 또는 "FAIL"
}
```

### 9.3 백엔드 판별 로직 (TestRunnerService)

```java
// 통합테스트 시나리오 전체 통과여부 판별
private String resolveIntegPassYn(List<Map<String, Object>> flowSteps) {
    for (Map<String, Object> step : flowSteps) {
        if (!"PASS".equals(step.get("stepResult"))) {
            return "N";  // 하나라도 실패 → 전체 미통과
        }
    }
    return "Y";  // 모든 단계 통과
}
```

**호출 위치**: `results.json` 파싱 후 각 통합 시나리오 결과를 `PSS_TC_PASS_MGT`에 저장하기 직전.

### 9.4 SSE 결과 페이로드

단계별 결과와 시나리오 최종 결과를 함께 전송한다.

```json
{
  "type":      "result",
  "no":        1,
  "status":    "FAIL",
  "stepResults": [
    { "step": 1, "stepResult": "PASS" },
    { "step": 2, "stepResult": "FAIL" },
    { "step": 3, "stepResult": "SKIP" }
  ],
  "remark": "step 2 실패: HTTP 500"
}
```

> `SKIP`: 앞 단계가 실패하여 실행되지 않은 단계. 미통과(`'N'`)로 처리한다.

### 9.5 UI 표시

통합 시나리오 그리드에서 미통과 행을 더블클릭하면 상세 팝업의 **플로우 단계** 섹션에 단계별 결과를 표시한다.

---

## 10. 시나리오 상세 팝업 셀 확장 규칙

`doScenDetailPopup(scenarioId)` 내 테이블은 `table-layout:fixed` + `<colgroup>` 방식으로 열 폭을 고정한다.

### 10.1 열 폭 정의

| 컬럼 키 | 레이블 | 폭 | 텍스트 처리 |
|--------|--------|-----|------------|
| `testType` | 구분 | 52px | 말줄임 |
| `testName` | 테스트명 | 160px | 말줄임 |
| `roleNm` | 엑터(역할) | 90px | 말줄임 |
| `groupName` | 중분류 | 90px | 말줄임 |
| `subCategory` | 소분류 | 90px | 말줄임 |
| `menuName` | 메뉴명 | 110px | 말줄임 |
| `preCondition` | 시나리오흐름 | **320px** | `white-space:pre-wrap` + `word-break:break-word` (행 높이 자동 확장) |
| `inputValues` | 입력값 | **320px** | 동일 — 긴 입력값 목록이 셀 밖으로 빠지지 않게 처리 |
| `expectedResult` | 예상결과 | **240px** | 동일 |
| `testResult` | 테스트결과 | 90px | 말줄임 |
| `confirmer` | 확인자 | 70px | 말줄임 |

### 10.2 와이드(wide) 컬럼 vs 일반 컬럼 td 스타일

```javascript
/* wide: true 컬럼 — 긴 텍스트 행 높이 자동 확장 */
'padding:5px 8px;vertical-align:top;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere'

/* 일반 컬럼 — 고정 폭, 말줄임 처리 */
'padding:5px 8px;vertical-align:top;white-space:normal;overflow:hidden;text-overflow:ellipsis'
```

> **배경**: 기존에 모든 셀에 `max-width:200px` 고정 적용 → `inputValues` 등 다중 항목 텍스트가 셀 경계를 벗어남.
> `table-layout:fixed` + `<colgroup>` 으로 전환하고 와이드 컬럼만 `pre-wrap` + `word-break` 적용하여 행 높이가 내용에 따라 자동 늘어나도록 수정.

```javascript
// onIntegScenarioGridDblClick() 내 플로우 단계 섹션
const stepsHtml = (row.flowSteps || []).map(s => `
  <tr>
    <td>${s.step}</td>
    <td>${s.url}</td>
    <td>${s.serviceId}</td>
    <td>${s.expectedResult}</td>
    <td>${renderStepResult(s.stepResult)}</td>
  </tr>`).join('');

function renderStepResult(val) {
  if (val === 'PASS') return '<span class="result-pass">PASS</span>';
  if (val === 'FAIL') return '<span class="result-fail">FAIL</span>';
  if (val === 'SKIP') return '<span style="color:#9ca3af">SKIP</span>';
  return '<span style="color:#9ca3af">-</span>';
}
```
