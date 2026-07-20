# 시나리오 추출 설계 문서

> 작성일: 2026-06-17
> 대상 시스템: MIS (Nexacro + Spring MVC)
> 관련 파일: `XfdlParserService.java`, `XfdlScenarioExtractor.java`, `AiController.java`

---

## 1. 개요

### 1.1 목적

업로드된 XFDL 소스 파일을 정적 분석하여, 단위 테스트에 필요한 **시나리오 메타데이터를 자동으로 추출**하는 프로그램.

추출된 시나리오는 기존 `SpecTemplateService.generateUnitSpec()`의 입력값으로 사용되어 `_unit.spec.ts` 파일을 생성한다.

### 1.2 배경

현재 단위테스트 시나리오는 **수동으로 작성**하거나 Excel을 통해 업로드하는 방식이다.
XFDL 화면당 평균 3~5개의 API 호출(`gfn_tran`)이 있고 전체 소스가 2,111개이므로, 수동 작성은 현실적으로 불가능하다.

`XfdlParserService`가 이미 XFDL에서 `gfn_tran` URL, Dataset 컬럼, ComboBox 정보를 추출하고 있으나, **시나리오 형태로 조립하는 로직이 없다.**

### 1.3 범위

| 구분 | 포함 | 제외 |
|------|------|------|
| 입력 | `src/main/nxui/{프로젝트명}/` 내 XFDL 파일 | 외부 API 명세, Swagger |
| 분석 | 버튼 이벤트 + `gfn_tran` 호출 + `fn_callBack` 콜백 + `fn_compCtrl` 활성화 컴포넌트 | 런타임 동작 분석 |
| 출력 | `SCENARIO_STORE`에 저장되는 시나리오 목록 | spec.ts 파일 생성 (기존 로직 담당) |
| 입력값 | Dataset 컬럼 기반 기본값 자동 설정 | 실제 DB 데이터 조회 |

### 1.4 입력 / 출력

```
[입력]
  prefix (예: "pur") + 업로드된 소스 파일명 목록 (UI에서 getCheckedSources()로 수집)
  → 전달받은 파일명 목록에 해당하는 .xfdl 파일만 처리 (디렉토리 전체 스캔 아님)

[출력]
  AiStateStore.SCENARIO_STORE["pur_unit"] = [   // 키 = prefix + "_unit"
    {
      no, sourceName, 화면명, testType: "단위",
      crudType, URL, serviceId,
      inputDsId, inputCols, inputValues,
      outputDsId, expectedResult, 사전조건
    },
    ...
  ]

> SCENARIO_STORE 키 체계: `prefix + "_unit"` (단위), `prefix + "_integ"` (통합)
> - 다수 prefix 공존 가능: `"pur_unit"`, `"gdm_unit"`, `"sys_unit"` 등 각각 독립
> - `generateSpecStream.do`는 `testType` 파라미터에 따라 해당 키(`prefix_unit` / `prefix_integ`)로 시나리오를 읽음
```

### 1.5 핵심 원칙

> 코드 제약 사항(AI 금지, XfdlParserService 변경 금지 등)은 **[structure.md](structure.md) §5** 를 참고한다.

- 추출 결과는 UI 그리드에서 사람이 검토·수정할 수 있어야 한다
- 테스트명·사전조건·기대결과는 crudType과 컬럼 패턴으로 **자동 생성**한다 (수동 수정 가능)
- 통합/단위 구분은 시나리오 추출 **이후** `testType` 필드로 결정한다. 추출 시 기본값은 `"단위"`이며 사용자가 그리드에서 변경 가능하다

---

## 2. 시스템 아키텍처

### 2.1 전체 흐름

```
[사용자]
  prefix 입력 (예: "pur")
  → [UI] "단위 시나리오 추출" 버튼 클릭 → 확인 다이얼로그
       │
       ▼
[AiController] /ai/extractUnitScenarios.do  ← SSE 스트리밍 응답
       │         파라미터: prefix, sources[] (업로드된 파일명 목록)
       │
       ├─ FilePathHelper.resolveXfdlFiles(prefix, sources[])
       │    sources[] 내 파일명을 mis/{prefix}/, pms/{prefix}/ 에서 찾아 File 목록 구성
       │    (디렉토리 전체 스캔 없음 — 전달받은 파일만 처리)
       │
       ├─ 파일별 루프 (진행률 SSE 전송: "처리 중: {n}/{total}")
       │    │
       │    ├─ XfdlParserService.parseXfdl()  ← 기존 메서드 재사용
       │    │    → XfdlInfo { screenName, screenTitle, tranCalls, dsColumns, ... }
       │    │
       │    ├─ XfdlScenarioExtractor.analyzeButtons()  ← 신규: 버튼 분석 전용
       │    │    → ButtonAnalysis { buttons[], fnBodies{},
       │    │                       svcIdToBtnMap{}, enabledCtrls[],
       │    │                       staticLabels{}, callbackMap{}, gridHeaders{} }
       │    │
       │    └─ XfdlScenarioExtractor.buildScenarios()  ← 신규: 시나리오 조립
       │         XfdlInfo + ButtonAnalysis → 시나리오 Map[]
       │
       └─ AiStateStore.SCENARIO_STORE.put(prefix + "_unit", scenarios)
            SSE: "완료: {count}개 추출"
            → [UI] 그리드 표시 (검토·수정 가능)
                 │
                 ▼
            기존 흐름: generateSpecStream.do → _unit.spec.ts 생성
```

### 2.2 업로드 소스 필터 설계

**원칙**: 업로드한 소스 파일에 해당하는 XFDL만 처리한다. 폴더 전체 스캔 금지.

#### allowedSources 확장자 제거 규칙

`sourcesParam`으로 전달되는 파일명은 UI에서 원본 파일명(확장자 포함)을 그대로 보낼 수 있다.  
`extractAll()` 내부에서 실제 파일의 baseName을 비교할 때 **마지막 확장자만 제거**하므로,  
allowedSources 구성 시에도 동일한 방식으로 확장자를 제거해야 매칭이 성립한다.

| 전달된 sourcesParam 값 | `replaceAll("\\.[^.]+$", "")` 적용 후 | 실제 파일 baseName |
|----------------------|--------------------------------------|-----------------|
| `pur_9010M.xfdl`     | `pur_9010m`                          | `pur_9010m` ✅  |
| `pur_9010M.xfdl.js`  | `pur_9010m.xfdl`                     | `pur_9010m.xfdl` ✅ |
| `pur_9010M.xfdl` (확장자 미제거 시) | `pur_9010m.xfdl` ❌ | `pur_9010m` → 매칭 실패 |

> **핵심**: `allowedSources` 구성 시 `s.trim().toLowerCase().replaceAll("\\.[^.]+$", "")` 를 반드시 적용한다.  
> 이 처리를 빠뜨리면 allowedSources에 `pur_9010m.xfdl` 이 들어가지만 실제 파일 baseName은 `pur_9010m` 이므로 모든 파일이 skip되어 시나리오 0건이 된다.

```java
// 올바른 구성 — 확장자 제거 적용
for (String s : sourcesParam.split(",")) {
    String t = s.trim().toLowerCase().replaceAll("\\.[^.]+$", "");
    if (!t.isEmpty()) allowedSources.add(t);
}

// 잘못된 구성 — 확장자 제거 누락 → 시나리오 0건 버그
for (String s : sourcesParam.split(",")) {
    String t = s.trim().toLowerCase();  // ← 확장자 포함 그대로 저장
    if (!t.isEmpty()) allowedSources.add(t);
}
```

#### JS → 서버 전달 방식

```javascript
// 시나리오 추출 버튼 클릭 시
function runExtractUnitScenarios() {
  if (!guardExtract()) return;
  if (!confirm('단위 시나리오를 추출하시겠습니까?')) return;

  const prefix  = getCurrentPrefix();
  const sources = getCheckedSources().map(s => s.rawName);  // ["pur5115m", "pur5120m", ...]

  const params = new URLSearchParams({ prefix, sources: sources.join(',') });
  const es = new EventSource('/ai/extractUnitScenarios.do?' + params.toString());
  // ...
}
```

#### 서버 측 필터링 및 파일 존재 검증 (AiController)

```java
@RequestMapping(value = "/ai/extractUnitScenarios.do", ...)
public void extractUnitScenarios(...) throws Exception {
    // ...
    try {
        String nxuiBase = FilePathHelper.getNxuiBase(request);

        // 1) allowedSources 구성 — 확장자 제거 후 소문자 비교
        //    주의: sourcesParam에는 확장자 포함 파일명이 올 수 있으므로
        //          replaceAll("\\.[^.]+$", "") 로 마지막 확장자를 제거한다.
        //    예) "pur_9010M.xfdl" → "pur_9010m",  "pur_9010M.xfdl.js" → "pur_9010m.xfdl"
        Set<String> allowedSources = new LinkedHashSet<>();
        if (!sourcesParam.isEmpty()) {
            for (String s : sourcesParam.split(",")) {
                String t = s.trim().toLowerCase().replaceAll("\\.[^.]+$", "");
                if (!t.isEmpty()) allowedSources.add(t);
            }
        }

        Map<File,String> dirOriginMap = new LinkedHashMap<>();
        File misDir = new File(nxuiBase + "/mis/" + prefix);
        File pmsDir = new File(nxuiBase + "/pms/" + prefix);
        dirOriginMap.put(misDir, "mis");
        dirOriginMap.put(pmsDir, "pms");

        // 2) 업로드 소스 파일 존재 여부 검증
        //    allowedSources 각 항목이 mis/{prefix}/ 또는 pms/{prefix}/ 디렉토리에
        //    실제로 존재하는지 확인한다. 없는 파일은 SSE warn 메시지로 UI에 통보한다.
        if (!allowedSources.isEmpty()) {
            Set<String> foundBases = new LinkedHashSet<>();
            for (File dir : new File[]{misDir, pmsDir}) {
                if (!dir.exists() || !dir.isDirectory()) continue;
                List<File> xfdlFiles = new ArrayList<>();
                FilePathHelper.addXfdlFiles(dir, xfdlFiles);
                for (File f : xfdlFiles) {
                    String base = f.getName().replaceAll("\\.[^.]+$", "").toLowerCase();
                    foundBases.add(base);
                }
            }
            List<String> notFound = new ArrayList<>();
            for (String src : allowedSources) {
                if (!foundBases.contains(src)) notFound.add(src);
            }
            if (!notFound.isEmpty()) {
                // SSE warn: UI에서 alert 또는 경고 배너로 표시
                out.write("data: {\"warn\":\"다음 소스 파일이 서버에 없습니다: " + notFound + "\"}\n\n");
                out.flush();
            }
        }

        List<Map<String,Object>> scenarios = scenarioExtractor.extractAll(
                dirOriginMap, allowedSources,
                (cur, total) -> { ... });
        // ...
    }
}
```

#### extractAll() 필터링

```java
public List<Map<String,Object>> extractAll(Map<File,String> dirOriginMap,
                                            Set<String> allowedSources,
                                            BiConsumer<Integer,Integer> listener) {
    List<Map.Entry<File,String>> fileEntries = new ArrayList<>();
    for (Map.Entry<File,String> entry : dirOriginMap.entrySet()) {
        File dir = entry.getKey();
        if (!dir.exists() || !dir.isDirectory()) continue;

        List<File> xfdlFiles = new ArrayList<>();
        FilePathHelper.addXfdlFiles(dir, xfdlFiles);

        for (File f : xfdlFiles) {
            String baseName = f.getName().replaceAll("\\.[^.]+$", "").toLowerCase();
            // allowedSources가 비어있지 않을 때만 필터 적용
            if (!allowedSources.isEmpty() && !allowedSources.contains(baseName)) continue;
            fileEntries.add(new AbstractMap.SimpleEntry<>(f, entry.getValue()));
        }
    }
    // 이하 기존 루프와 동일
}
```

> **빈 allowedSources 처리**: `sourcesParam`이 빈값이면 필터 없이 전체 처리(기존 동작 유지).  
> 실제 업로드 소스가 체크된 경우에만 필터가 적용된다.

### 2.3 업로드 소스 파일 존재 검증

**목적**: UI에서 업로드한 소스 목록이 서버 파일 시스템에 실제로 존재하는지 확인하여,  
파일이 없는 경우 추출 전에 즉시 사용자에게 알린다.

#### 검증 시점

`allowedSources` Set 구성 직후, `extractAll()` 호출 전에 수행한다.

#### 검증 로직

```
1. mis/{prefix}/, pms/{prefix}/ 디렉토리 내 .xfdl / .xfdl.js 파일 전체 열거
2. 각 파일의 baseName(마지막 확장자 제거 + 소문자) → foundBases Set 구성
3. allowedSources 각 항목이 foundBases에 없으면 notFound 목록에 추가
4. notFound가 비어 있지 않으면 SSE warn 메시지 전송
```

#### SSE 응답 형식

```json
{ "warn": "다음 소스 파일이 서버에 없습니다: [pur_9010m, pur_9020m]" }
```

클라이언트는 `data.warn` 수신 시 경고 배너 또는 alert로 표시한다.

#### 적용 대상

| 엔드포인트 | 적용 여부 |
|-----------|---------|
| `/ai/extractUnitScenarios.do` | ✅ 적용 |
| `/ai/extractIntegScenarios.do` | ✅ 적용 |

#### 주의사항

- 파일 없음 경고가 발생해도 추출 자체는 **계속 진행**한다 (중단하지 않음).
  - 존재하는 파일만 처리되며, 없는 파일은 자연스럽게 건너뜀.
- `allowedSources`가 빈 Set이면 검증을 수행하지 않는다 (전체 디렉토리 처리 모드).
- baseName 비교는 **마지막 확장자 제거** 기준이며 allowedSources 구성 방식과 동일하다.
  - `pur_9010M.xfdl` → baseName = `pur_9010m`
  - `pur_9010M.xfdl.js` → baseName = `pur_9010m.xfdl`

---

## 3. 시나리오 데이터 모델

### 3.1 SCENARIO_STORE 필드 중 단위테스트 관련 필드

추출 프로그램이 채우는 필드(●)와 수동 수정 필드(○)를 구분한다.

| 필드명 | 타입 | 채움 | 출처 | 예시 |
|--------|------|------|------|------|
| `no` | int | ● | 자동 순번 | `1` |
| `sourceName` | String | ● | XFDL 파일명 (확장자 제외) | `pur5115m` |
| `화면명` | String | ● | `XfdlInfo.screenTitle` | `구매요청 목록` |
| `testType` | String | ● | 기본값 `"단위"` (그리드에서 변경 가능) | `단위` |
| `crudType` | String | ● | svcId 키워드 판별 | `SELECT` |
| `URL` | String | ● | `TranCall.url` (비API·유효성검사 시 `""`) | `/mis/pur/pur5110/getList.do` |
| `serviceId` | String | ● | `TranCall.svcId` (비API 시 `""`) | `getList` |
| `inputDsId` | String | ● | `TranCall.inputDs` (비API 시 `""`) | `ds_search` |
| `inputCols` | String | ● | `XfdlInfo.dsColumns` (inputDs 기준, 비API 시 `""`) | `PURCH_REQ_DT_ST,PURCH_REQ_DT_ED` |
| `outputDsId` | String | ● | `TranCall.outputDs` (비API 시 `""`) | `ds_list` |
| `inputValues` | String (JSON) | ● | `"레이블"` 키 + 컬럼명 패턴 기본값 (비API 시 `""`) | `{"신청기간":"20260101"}` |
| `origin` | String | ● | `dirOriginMap`에서 명시 전달 (`mis`/`pms`) | `mis` |
| `method` | String | ● | 고정값 `"POST"` (비API 시 `""`) | `POST` |
| `테스트명` | String | ● | `{메뉴명} - {버튼명}` 형식 (3.3절) | `구매요청 - 조회` |
| `사전조건` | String | ● | btnId + enabledLabels + crudType 기반 생성 (3.3절) | `조회 조건에 해당하는 데이터가 DB에 존재해야 함` |
| `expectedResult` | String | ● | fn_callBack 패턴 기반 생성 (3.3절) | `HTTP 200, ds_list Dataset 1건 이상 반환` |
| `menuPath` | String | ●/○ | DB 쿼리 (SYS_MENU_MGT) 조회, 실패 시 `""` → 수동 입력 (4.9절) | `구매관리 > 구매요청관리 > 구매요청` |
| `gnbName` | String | ● | menuPath 첫 번째 노드 (menuPath 빈값이면 `""`) | `구매관리` |
| `menuName` | String | ● | menuPath 마지막 노드 (menuPath 빈값이면 `""`) | `구매요청` |
| `groupName` | String | ● | menuPath 4개+ 노드일 때 두 번째 노드 → 중분류 (3개 이하면 `""`) | `구매요청관리` |
| `subCategory` | String | ● | menuPath 3개+ 노드일 때 뒤에서 두 번째 노드 → 소분류 (없으면 `""`) | `구매요청` |
| `description` | String | ○ | 추출 시 `""` → 수동 입력 | `구매요청 목록 조회 기능 단위 테스트` |
| `actor` | String | ○ | 추출 시 기본값 `"개발자"` (그리드에서 변경 가능) | `개발자` |
| `DEV_PASS` | String | ●/○ | 테스트 실행 시 자동 설정 (`Y`/`N`), 수동 수정도 허용 | `Y` |
| `PL_PASS` | String | ●/○ | PL 통과 처리 버튼으로 설정, 수동 수정 허용 | `N` |
| `USER_PASS` | String | ●/○ | 사용자 통과 처리 버튼으로 설정, 수동 수정 허용 | `N` |
| `REMARK` | String | ○ | 수동 입력 | `""` |

### 3.1.1 미추출 필드 원인 분석

현재 `XfdlScenarioExtractor.buildOne()`에서 **누락되거나 항상 빈값으로 설정되는 필드**의 원인과 처리 방향.

| UI 레이블 | 내부 필드 | 누락 원인 | 처리 방향 |
|----------|---------|---------|---------|
| 시나리오명 | `테스트명` | `buildOne()`에서 `menuName - 버튼명` 형식으로 자동 생성 | `{menuName} - {resolveBtnText(btnId)}` |
| 설명 | `description` | 기존 상세 테스트명(`화면명 - 버튼명(동작유형)`)을 그대로 사용 | `buildTestName()` 결과값 |
| 액터(역할) | `actor` | 기존 모델에 없던 필드 | 추출 시 `"개발자"` 기본값으로 세팅 (그리드에서 콤보박스로 변경) |
| 중분류 | `groupName` | `buildOne()`에서 항상 빈값 | menuPath **4개+** 노드일 때만 두 번째 노드. 3개 이하면 `""` |
| 소분류 | `subCategory` | `buildOne()`에서 항상 빈값 | menuPath **3개+** 노드일 때 뒤에서 두 번째 노드. 없으면 `""` |
| 메뉴명 | `menuName` | menuPath DB 조회 실패(menuPath=`""`)이면 세팅 안 됨 | menuPath 마지막 노드로 채움. menuPath 빈값이면 `""` |

#### buildOne() 수정 포인트 — menuPath 파싱으로 중분류/소분류/메뉴명 채우기

```java
String menuPath = menu.getOrDefault("menuPath", "");
String[] nodes  = menuPath.isEmpty() ? new String[0] : menuPath.split("\\s*>\\s*");

// 계층 규칙: 3개(A>B>C) → gnb=A, group=A, sub=B, menu=C
//            4개+(A>B>C>D) → gnb=A, group=B, sub=C, menu=D
String _gnb = nodes.length >= 1 ? nodes[0].trim() : "";
s.put("gnbName",     _gnb);
s.put("groupName",   nodes.length >= 3 ? (nodes.length >= 4 ? nodes[1].trim() : _gnb) : "");
s.put("subCategory", nodes.length >= 3 ? nodes[nodes.length - 2].trim() : "");
s.put("menuName",    nodes.length >= 1 ? nodes[nodes.length - 1].trim() : "");
s.put("gnbName",     nodes.length >= 1 ? nodes[0].trim() : "");

// 신규 필드
s.put("description", "");
s.put("actor",       "개발자");
```

#### 업로드 소스 필터 제약

`buildOne()` 파라미터가 아닌 `extractAll()` 레벨에서 필터링한다.  
→ 상세 설계는 §2.2를 참고한다.

### 3.2 통합/단위 구분 기준

시나리오는 **버튼 컴포넌트** 단위로 추출하며, 버튼의 성격에 따라 testType을 결정한다.

#### 단위테스트 시나리오

버튼 1개의 onclick 이벤트에서 발생하는 **각 동작**을 개별 시나리오로 분리한다.

| 버튼 ID 패턴 | 생성 시나리오 | URL | testType |
|-------------|-------------|-----|---------|
| `btn_search` | 조회 실행 | gfn_tran URL | 단위 |
| `btn_save` | ① 유효성 검사 실패 (`URL = ""`) | `""` | 단위 |
| `btn_save` | ② 저장 성공 | gfn_tran URL | 단위 |
| `btn_del` | 삭제 성공 | gfn_tran URL | 단위 |
| `btn_approval` | 결재상신 실행 | gfn_tran URL | 단위 |
| `btn_row_add` | 그리드 행 추가됨 | `""` | 단위 |
| `btn_row_del` | 그리드 행 삭제됨 | `""` | 단위 |
| `btn_{팝업}` (`gfn_openPopup` 호출) | 팝업 열림 확인 | `""` | 단위 |
| `btn_excel` | 엑셀 다운로드 실행 | `""` | 단위 |
| 돋보기(`btn_SCH_*`) | 검색 팝업 열림 확인 | `""` | 단위 |

> `URL = ""`인 시나리오는 API 호출 없이 UI 동작만 검증하는 시나리오다.
> `inputDsId`, `outputDsId`, `inputCols`, `inputValues`도 빈값(`""`)으로 저장하며, UI 그리드에서 수동 수정 가능하다.

#### 통합테스트 시나리오

한 프로그램의 **결재·승인·등록 플로우** 전체를 하나의 시나리오로 구성한다.

아래 버튼 중 **하나라도 존재하는 화면**에서 해당 버튼 유형별 통합 시나리오를 생성한다.

| 버튼 유형 | 감지 기준 | 시나리오 제목 |
|----------|----------|-------------|
| 결재상신 | `analysis.approvalBtnIds` 비어 있지 않음 (`gfn_gwCall` 또는 `lv_appYn="Y"` 포함 버튼) | `{화면명} - 저장 후 결재상신 (통합 테스트)` |
| 승인요청 | 버튼 `text` 속성에 `"승인요청"` 포함 | `{화면명} - 승인요청 플로우 (통합 테스트)` |
| 등록 | 버튼 `text` 속성에 `"등록"` 포함 또는 `tranCall.svcId` 가 `insert`/`reg`/`create` 로 시작 | `{화면명} - 데이터 등록 플로우 (통합 테스트)` |

- **통합테스트에서 제외하는 항목**: 유효성 검사, 행추가, 행삭제, 팝업 열기
- 하나의 화면에서 여러 유형이 감지되면 유형별로 각각 시나리오를 생성한다 (1화면 N시나리오 가능)

> `btn_approval`은 **단위와 통합 양쪽 모두** 시나리오를 생성한다.
> - 단위: `extractAll()` → 결재상신 API 호출 1건 시나리오 (기대결과: 기안기 호출 + 후처리)
> - 통합: `extractIntegAll()` → 결재상신 포함 전체 플로우 시나리오

> **단위/통합 시나리오는 완전히 별개의 메서드로 동작한다.**
> - 단위: `XfdlScenarioExtractor.extractAll()` → `/ai/extractUnitScenarios.do`
> - 통합: `XfdlScenarioExtractor.extractIntegAll()` → `/ai/extractIntegScenarios.do` (별도 구현)
> - 두 메서드는 같은 XFDL 파싱 결과(`XfdlInfo`, `ButtonAnalysis`)를 공유하지만, 시나리오 조립 로직은 분리되어 있다.

```
[단위 시나리오 흐름 — extractAll()]
  모든 버튼 → 버튼별 단위 시나리오
       │
       ▼
  SCENARIO_STORE["pur_unit"] 저장
  → UI 그리드 → generateUnitSpec() → _unit.spec.ts

[통합 시나리오 흐름 — extractIntegAll()]  ← 별도 메서드, 별도 엔드포인트
  결재상신 / 승인요청 / 등록 버튼 중 하나 이상 존재하는 화면 선별
  → 버튼 유형별 통합 시나리오 (1~3건/화면)
       │
       ▼
  SCENARIO_STORE["pur_integ"] 저장
  → UI 그리드 → generateIntegSpec() → _inte.spec.ts
```

### 3.3 테스트명·사전조건·기대결과 자동 생성 규칙

#### 테스트명 (`테스트명`)

`{menuName} - {버튼명}` 형식으로 생성한다. menuName은 menuPath 마지막 노드, 없으면 screenTitle.

```
{menuName} - {버튼 한글명}
```

| 버튼 패턴 | btnText | 테스트명 예시 (menuName=직접구매신청) |
|----------|---------|-----------------------------------|
| `btn_search` | `"조회"` | `직접구매신청 - 조회` |
| `btn_save` (유효성) | `"저장"` | `직접구매신청 - 저장` |
| `btn_save` (저장) | `"저장"` | `직접구매신청 - 저장` |
| `btn_del` | `"삭제"` | `직접구매신청 - 삭제` |
| `btn_row_add` | `""` → fallback `"행추가"` | `직접구매신청 - 행추가` |
| `btn_excel` | `""` → fallback `"엑셀다운"` | `직접구매신청 - 엑셀다운` |

#### description (`description`)

기존 `buildTestName()` 결과(`{화면명} - {버튼명} ({동작설명})`)를 그대로 저장한다.

```
{화면명} - {버튼 한글명} ({동작 설명})
```

예: `직접구매신청 - 조회 (검색조건(신청기간, 결재상태))`, `직접구매신청 - 저장 (유효성 검사)`

##### btn_search 테스트명 — 검색조건 레이블 조합 규칙

`btn_search` 시나리오의 `({동작 설명})` 부분은 `div_search` 내 Static 컴포넌트의 `text` 속성 값을 조합하여 생성한다.

```
"검색조건(" + {div_search 내 Static.text 목록, 중복 제거, 쉼표 구분} + ")"
```

- `searchInputLabels`(`Map<inputId → staticLabel>`)의 **values를 순서 유지·중복 제거**하여 나열
- 같은 레이블이 시작일/종료일 두 컴포넌트에 모두 매핑되더라도 **1회만** 출력 (예: `"신청일자"`)
- `div_search`가 없거나 `searchInputLabels`가 비어 있는 경우 → `"버튼 클릭"` 폴백

생성 예시:
```
// searchInputLabels = {"PURCH_REQ_DT_ST":"신청일자", "PURCH_REQ_DT_ED":"신청일자",
//                      "DEPT_CD":"부서", "REQ_NM":"요청자"}
// → unique values = ["신청일자", "부서", "요청자"]
→ "구매요청 목록 - 조회 (검색조건(신청일자, 부서, 요청자))"
```

구현 메서드: `buildSearchCondLabel(Map<String, String> searchInputLabels)` (XfdlScenarioExtractor 내부)

```java
private String buildSearchCondLabel(Map<String, String> searchInputLabels) {
    if (searchInputLabels == null || searchInputLabels.isEmpty()) {
        return "버튼 클릭";
    }
    Set<String> seen = new LinkedHashSet<>();
    for (String label : searchInputLabels.values()) {
        seen.add(label);
    }
    return "검색조건(" + String.join(", ", seen) + ")";
}
```

`buildTestName()` 호출 시 `searchInputLabels`를 파라미터로 추가 전달한다:

```java
// buildOne() 내
String testName = buildTestName(screenTitle, btnId, actionType, tran.svcId,
        analysis.searchInputLabels);

// buildTestName() 시그니처
private String buildTestName(String screenTitle, String btnId, String actionType,
                              String svcId, Map<String, String> searchInputLabels) {
    ...
    // btn_search 분기 (유효성검사 분기 이후에 위치)
    if (btnId != null && btnId.contains("search")) {
        String searchCond = buildSearchCondLabel(searchInputLabels);
        return base + " - " + btnText + " (" + searchCond + ")";
    }
    ...
}
```

#### 사전조건 (`사전조건`)

저장/수정 테스트의 사전조건은 **XFDL 컴포넌트 분석**으로 생성한다.

**추출 규칙:**
1. `fn_compCtrl()` 함수에서 `set_enable()` 호출 대상 입력 컴포넌트(대문자 시작 ID) 수집 — 파라미터 값(`true` 리터럴 또는 변수) 무관
2. 각 컴포넌트 ID와 **x좌표가 가장 가까운 좌측 Static 컴포넌트**의 `text` 속성을 항목명으로 사용
3. 그리드 컴포넌트인 경우 **Grid 헤더 컬럼 text** 목록으로 대체

생성 형식:
```
- {Static text}: {컴포넌트 타입별 기본값}
- {Static text}: {컴포넌트 타입별 기본값}
```

컴포넌트 타입별 기본값:
| 컴포넌트 타입 | 기본값 |
|-------------|--------|
| Edit / TextEdit (`_DT` 포함) | 오늘 날짜 (예: `20260621`) — 화면 표기: `2026-06-21` |
| Edit / TextEdit (`_DT_ST`) | 해당 연도 1월 1일 (예: `20260101`) — 화면 표기: `2026-01-01` |
| Edit / TextEdit (일반) | `(입력 필요)` |
| ComboBox | `(첫 번째 항목 선택)` |
| MaskEdit (금액) | `0` |

조회/삭제/결재 테스트의 사전조건:
| 버튼 | 사전조건 |
|------|---------|
| `btn_search` | 검색 조건(날짜 범위, 콤보박스 등)을 설정하고, 해당 조건 범위 내 데이터가 DB에 존재해야 함. 조회 결과가 입력한 조건 범위를 벗어나지 않아야 함 (예: 신청일자 `2026-01-01~2026-12-31` 설정 시 범위 외 데이터가 반환되면 테스트 실패) |
| `btn_del` | `삭제 대상 행이 그리드에서 선택되어 있어야 함` |
| `btn_approval` | `저장된 문서가 존재하고 결재 가능 상태(미상신)여야 함` |

#### 기대결과 (`expectedResult`)

두 가지 방식으로 생성한다: **fn_callBack 패턴 분석(API 버튼)** 과 **고정 문구(비API 버튼)**.

##### [A] fn_callBack 분석 기반 — API 버튼 (URL 있음)

`buildExpectedResult(svcId, callbackPatterns, crudType, outputDs, screenTitle, actionType, btnId, searchInputLabels)` 가 `callbackMap`에서 svcId에 해당하는 패턴 목록을 조회하여 문구를 조합한다.

| fn_callBack 내 XFDL 패턴 | 기대결과 문구 |
|--------------------------|-------------|
| `btn_search` (SELECT) + `searchInputLabels` 있음 | `그리드의 {label} 항목은 설정한 조건 범위 내 데이터만 반환되어야 함` → `buildSearchExpectedResult()` 호출 |
| `this.opener.fn_search()` | `{부모 화면명} 목록에 저장 내역이 반영됨` |
| `this.fn_search()` | `상세화면이 저장된 내용으로 재로드됨` |
| `this.close()` (삭제 후) | `삭제 완료 후 화면이 닫히고 목록에서 조회되지 않음` |
| `gfn_gwCall("Y", this)` | `결재상신 완료, 결재함에서 확인 가능` |
| `this.opener.fn_addCartItem()` + `this.close()` | `부모 화면 그리드에 선택 항목이 추가됨` |
| `gfn_showMsg("COM_CRUD_0002")` | `저장 완료 메시지 표시` |
| `gfn_showMsg("COM_CRUD_0032")` | `삭제 완료 메시지 표시` |
| gfn_tran SELECT 후 콜백 없음 (btn_search 외) | `HTTP 200, {outputDsId} Dataset 1건 이상 반환` |
| `btn_approval` (단위, API) | `기안기가 호출됨` + ApprovalServiceImpl 후처리 문구 (4.11절) |

##### btn_search 기대결과 — 검색조건 분기 분석 규칙

`btn_search` 시나리오는 `searchInputLabels`(`Map<inputId → label>`)를 분석하여  
**각 검색 조건이 그리드 결과에 반영되어야 함**을 기대결과에 명시한다.

```
"{조건별 검증 문구 목록}"
```

**조건 유형 판별** — inputId 접미사 패턴으로 분기:

| 같은 label의 inputId 구성 | 검증 문구 |
|--------------------------|---------|
| `_DT_ST` + `_DT_ED` (또는 `_FROM_DT`+`_TO_DT`, `_START_DT`+`_END_DT`) 쌍 존재 | `그리드의 {label} 항목은 설정한 날짜 범위 내 데이터만 반환되어야 함` |
| `_DT` 단독 | `그리드의 {label} 항목은 설정한 날짜 기준 데이터만 반환되어야 함` |
| `_CD` | `그리드의 {label} 항목은 선택한 코드 값과 일치하는 데이터만 반환되어야 함` |
| `_NM` | `그리드의 {label} 항목에 입력한 명칭이 포함된 데이터만 반환되어야 함` |
| `_NO` | `그리드의 {label} 항목은 입력한 번호와 일치하는 데이터만 반환되어야 함` |
| 그 외 | 해당 label 생략 (조건 없음) |

**그룹핑 원칙**: `searchInputLabels`를 `label → [inputId 목록]` 으로 역색인 후, 각 label 그룹의 inputId 목록을 접미사 패턴으로 판별한다. 하나의 label 그룹 내에서 ST/ED 쌍이 동시에 존재하면 날짜 범위 검증 문구를 출력한다.

생성 예시:
```
// searchInputLabels = {"PURCH_REQ_DT_ST":"신청일자", "PURCH_REQ_DT_ED":"신청일자",
//                      "DEPT_CD":"부서", "REQ_NM":"요청자"}
// → label "신청일자": ST+ED 쌍 → 날짜 범위 검증
// → label "부서"   : _CD → 코드 일치 검증
// → label "요청자" : _NM → 명칭 포함 검증
→ "그리드의 신청일자 항목은 설정한 날짜 범위 내 데이터만 반환되어야 함,
   그리드의 부서 항목은 선택한 코드 값과 일치하는 데이터만 반환되어야 함,
   그리드의 요청자 항목에 입력한 명칭이 포함된 데이터만 반환되어야 함"
```

구현 메서드: `buildSearchExpectedResult(Map<String, String> searchInputLabels, String outputDs)` (XfdlScenarioExtractor 내부)

```java
private String buildSearchExpectedResult(Map<String, String> searchInputLabels, String outputDs) {
    if (searchInputLabels == null || searchInputLabels.isEmpty()) {
        return "검색 조건 범위 내 데이터만 반환되어야 함";
    }

    // label → inputId 목록으로 역색인
    Map<String, List<String>> labelToIds = new LinkedHashMap<>();
    for (Map.Entry<String, String> entry : searchInputLabels.entrySet()) {
        labelToIds.computeIfAbsent(entry.getValue(), k -> new ArrayList<>()).add(entry.getKey());
    }

    List<String> assertions = new ArrayList<>();
    for (Map.Entry<String, List<String>> e : labelToIds.entrySet()) {
        String label = e.getKey();
        List<String> ids = e.getValue();

        boolean hasSt = ids.stream().anyMatch(id -> {
            String u = id.toUpperCase();
            return u.endsWith("_DT_ST") || u.endsWith("_FROM_DT") || u.endsWith("_START_DT");
        });
        boolean hasEd = ids.stream().anyMatch(id -> {
            String u = id.toUpperCase();
            return u.endsWith("_DT_ED") || u.endsWith("_TO_DT") || u.endsWith("_END_DT");
        });
        boolean hasDt = ids.stream().anyMatch(id ->
                id.toUpperCase().endsWith("_DT") && !id.toUpperCase().endsWith("_DT_ST")
                && !id.toUpperCase().endsWith("_DT_ED"));
        boolean hasCd = ids.stream().anyMatch(id -> id.toUpperCase().endsWith("_CD"));
        boolean hasNm = ids.stream().anyMatch(id -> id.toUpperCase().endsWith("_NM"));
        boolean hasNo = ids.stream().anyMatch(id -> id.toUpperCase().endsWith("_NO"));

        if (hasSt && hasEd) {
            assertions.add("그리드의 " + label + " 항목은 설정한 날짜 범위 내 데이터만 반환되어야 함");
        } else if (hasDt) {
            assertions.add("그리드의 " + label + " 항목은 설정한 날짜 기준 데이터만 반환되어야 함");
        } else if (hasCd) {
            assertions.add("그리드의 " + label + " 항목은 선택한 코드 값과 일치하는 데이터만 반환되어야 함");
        } else if (hasNm) {
            assertions.add("그리드의 " + label + " 항목에 입력한 명칭이 포함된 데이터만 반환되어야 함");
        } else if (hasNo) {
            assertions.add("그리드의 " + label + " 항목은 입력한 번호와 일치하는 데이터만 반환되어야 함");
        }
    }

    return assertions.isEmpty()
            ? "검색 조건 범위 내 데이터만 반환되어야 함"
            : String.join(", ", assertions);
}
```

`buildExpectedResult()` 호출 시 `btnId`와 `searchInputLabels`를 파라미터로 추가 전달한다:

```java
// buildOne() 내
String expected = buildExpectedResult(tran.svcId, cbPatterns, crudType,
        tran.outputDs, screenTitle, actionType,
        btnId, analysis.searchInputLabels);

// buildExpectedResult() 시그니처
private String buildExpectedResult(String svcId, List<String> cbPatterns,
                                    String crudType, String outputDs,
                                    String screenTitle, String actionType,
                                    String btnId, Map<String, String> searchInputLabels) {
    ...
    // btn_search + SELECT: 검색조건 분기 기대결과 생성
    if (btnId != null && btnId.contains("search") && "SELECT".equals(crudType)) {
        return buildSearchExpectedResult(searchInputLabels, outputDs);
    }
    ...
}
```

##### [B] 고정 문구 — 비API 버튼 (URL="")

`buildExpectedResult`에 `tran == null` 인 경우 btnId 패턴으로 고정 문구를 반환한다.

| 버튼 패턴 | 고정 기대결과 문구 |
|---------|-----------------|
| `btn_save` 유효성 검사 (URL="") | `유효성 검사 실패 시 오류 메시지 표시` |
| `btn_row_add` | `행이 추가되고 그리드 항목이 기본값으로 설정됨 (common.xjs 공통 처리)` |
| `btn_row_del` | `선택된 행이 삭제됨 (common.xjs 공통 처리)` |
| `btn_excel` | `엑셀 파일이 다운로드됨 (common.xjs 공통 처리)` |
| `btn_SCH_*` / `gfn_openPopup` | `팝업 화면이 열림` |

복합 패턴 조합 예시:
```
저장 버튼 → setData 콜백 → opener.fn_search() + this.fn_search()
  기대결과: "저장 완료 메시지 표시, 목록화면 재조회 및 상세화면 재로드됨"

삭제 버튼 → delData 콜백 → opener.fn_search() + this.close()
  기대결과: "삭제 완료 메시지 표시, 목록에서 조회되지 않으며 화면 닫힘"

결재상신 버튼 → setAppData 콜백 → opener.fn_search() + gfn_gwCall("Y")
  기대결과: "결재상신 완료, 결재함에서 확인 가능, 목록 재조회됨"
```

### 3.4 출력 JSON 예시

```json
[
  {
    "no": 1,
    "sourceName": "pur5115m",
    "화면명": "구매요청 목록",
    "testType": "단위",
    "crudType": "SELECT",
    "URL": "/mis/pur/pur5115/getList.do",
    "serviceId": "getList",
    "inputDsId": "ds_search",
    "inputCols": "PURCH_REQ_DT_ST,PURCH_REQ_DT_ED,DEPT_CD",
    "outputDsId": "ds_list",
    "inputValues": "{\"PURCH_REQ_DT_ST\":\"20260101\",\"PURCH_REQ_DT_ED\":\"20260621\"}",
    "origin": "mis",
    "method": "POST",
    "테스트명": "구매요청 목록 - 조회 (버튼 클릭)",
    "사전조건": "검색 조건(신청일자 20260101~20260621, 콤보박스 등)을 설정하고, 해당 조건 범위 내 데이터가 DB에 존재해야 함. 조회 결과가 입력한 조건 범위를 벗어나지 않아야 함",
    "expectedResult": "HTTP 200, 응답 XML에 ds_list Dataset 포함, 1건 이상 데이터 반환",
    "menuPath": "구매관리 > 구매요청관리 > 구매요청",
    "gnbName": "구매관리",
    "menuName": "구매요청"
  },
  {
    "no": 2,
    "sourceName": "pur5115m",
    "화면명": "구매요청 목록",
    "testType": "단위",
    "crudType": "INSERT",
    "URL": "/mis/pur/pur5115/insertData.do",
    "serviceId": "insertData",
    "inputDsId": "ds_input",
    "inputCols": "PURCH_REQ_NO,ITEM_NM,QTY,UNIT_PRICE",
    "outputDsId": "ds_output",
    "inputValues": "{\"PURCH_REQ_NO\":\"\",\"ITEM_NM\":\"테스트품목\",\"QTY\":\"1\",\"UNIT_PRICE\":\"1000\"}",
    "origin": "mis",
    "method": "POST",
    "테스트명": "구매요청 목록 - 저장 (저장 실행)",
    "사전조건": "- 요구명: (입력 필요)\n    - 품목명: (입력 필요)\n    - 수량: (입력 필요)\n    - 단가: 0",
    "expectedResult": "HTTP 200, 응답 XML에 ErrorCode=0 포함",
    "menuPath": "구매관리 > 구매요청관리 > 구매요청",
    "gnbName": "구매관리",
    "menuName": "구매요청"
  }
]
```

---

## 4. XFDL 분석 로직

### 4.1 분석 대상 확장: 버튼 중심 파싱

기존 `parseXfdl()`은 `gfn_tran` 호출 중심으로 파싱하나, 이 프로그램은 **버튼 컴포넌트와 이벤트 함수**까지 분석한다.

추가 추출 대상:
```
기존 XfdlInfo (재사용)
  ├── tranCalls[]     → API URL/Dataset
  ├── dsColumns{}     → 컬럼 목록
  └── comboColumns{}  → ComboBox 바인딩

추가 추출 (신규)
  ├── buttons[]         → { id, text, onclickFn }        ← Button text 속성 추출
  ├── fnBodies{}        → { onclickFn → 함수 본문 String } ← 파싱 1회, buildScenarios에서 재사용
  ├── svcIdToBtnMap{}   → { svcId → {btnId, btnText} }   ← fnBodies 기반 역맵 구축
  ├── enabledCtrls[]    → fn_compCtrl 내 set_enable() 호출 대상 입력 컴포넌트
  ├── staticLabels{}    → { 컴포넌트ID → 좌측 Static text }
  ├── callbackMap{}     → { svcId → fn_callBack 내 패턴 목록 }
  └── gridHeaders{}     → { 그리드ID → 헤더 컬럼 text[] }
```

### 4.3 버튼 컴포넌트 파싱 규칙

#### 버튼 추출 패턴

XFDL의 `<Button>` 컴포넌트에서 `id`, `text`, `onclick` 세 속성을 추출한다.

```xml
<Button id="btn_save"   text="저장" ... onclick="btn_save_onclick"/>
<Button id="btn_search" text="조회" ... onclick="btn_search_onclick"/>
```

`text` 속성이 없거나 비어 있으면 btnId 패턴으로 기본 한글명을 대입한다.

| btnId 패턴 | text 빈값 fallback |
|-----------|------------------|
| `btn_row_add` | `"행추가"` |
| `btn_row_del` | `"행삭제"` |
| `btn_excel` | `"엑셀다운"` |
| `btn_SCH_*` (돋보기) | `"조회"` |
| 그 외 | `btnId` 그대로 |

정규식: `<Button[^>]+id="([^"]+)"[^>]+text="([^"]*)"[^>]+onclick="([^"]+)"`  
(속성 순서가 다를 수 있으므로 id, text, onclick을 각각 독립 추출 후 조합)

```java
// 속성 순서 무관하게 독립 추출
Pattern ID_PAT      = Pattern.compile("id=\"([^\"]+)\"");
Pattern TEXT_PAT    = Pattern.compile("text=\"([^\"]*)\"");
Pattern ONCLICK_PAT = Pattern.compile("onclick=\"([^\"]+)\"");

// <Button ...> 태그 전체를 먼저 추출한 뒤 각 속성 매칭
// 자기닫힘(<Button ... />) 및 일반 열기 태그(<Button ...>) 모두 처리
Pattern BTN_TAG = Pattern.compile("<Button\\b([^>]*?)/?>");
```

#### svcId → btnId 역맵 구축 (analyzeButtons() 내부)

```
[analyzeButtons() 흐름]

  1. parseButtons(content)
       → [{id:"btn_save", text:"저장", onclickFn:"btn_save_onclick"}, ...]

  2. buildFnBodies(content, buttons)
       → fnBodies = {
           "btn_save_onclick"   → "function 본문 전체...",
           "btn_search_onclick" → "function 본문 전체...",
           ...
         }

  3. buildSvcIdToBtnMap(buttons, fnBodies)
       fnBodies를 순회하며 gfn_tran svcId 추출 → 역맵 구축
       → svcIdToBtnMap = {
           "insertData" → {btnId:"btn_save",   btnText:"저장"},
           "getList"    → {btnId:"btn_search", btnText:"조회"},
           ...
         }
```

gfn_tran svcId 추출 정규식:
```java
Pattern TRAN_PAT = Pattern.compile("gfn_tran\\s*\\(\\s*\"([^\"]+)\"");
// 첫 번째 캡처 그룹 = svcId
```

#### 이벤트 함수 본문 추출

```java
// 함수 시작: "this.{fnName} = function" 라인 찾기
// 괄호 카운팅: { 를 만나면 depth++, } 를 만나면 depth--
// depth가 0이 되는 시점 = 함수 종료

int depth = 0;
boolean started = false;
StringBuilder body = new StringBuilder();

for (String line : content.split("\n")) {
    if (!started) {
        if (line.contains("this." + fnName + " =") && line.contains("function")) {
            started = true;
        }
    }
    if (started) {
        body.append(line).append("\n");
        for (char c : line.toCharArray()) {
            if (c == '{') depth++;
            else if (c == '}') depth--;
        }
        if (depth == 0 && body.length() > 0) break;  // 함수 종료
    }
}
```

#### 이벤트 함수 내 분석 패턴

| 패턴 | 추출 정보 |
|------|---------|
| `fn_validChk()` 호출 | → 유효성 검사 시나리오 존재 |
| `gfn_tran(...)` 호출 | → API 호출 시나리오 (svcId, url 추출) |
| `gfn_openPopup(...)` 호출 | → 팝업 열기 시나리오, 팝업 화면 ID 추출 |
| `gfn_confirm(...)` 호출 | → 확인 다이얼로그 존재 |
| `lv_appYn = "Y"` 패턴 | → 결재상신 버튼 식별 |

#### isNonApiButton() 판별 기준 — btnId 패턴 OR fnBody에 gfn_tran 없음 (둘 조합)

| 조건 | 판별 결과 |
|------|---------|
| btnId가 `btn_row_add`, `btn_row_del`, `btn_excel`, `btn_SCH_*` 중 하나 | 비API |
| fnBody에 `gfn_openPopup(` 포함 | 비API (팝업 버튼) |
| 위 패턴에 해당하지 않지만 fnBody에 `gfn_tran(` 없음 | 비API |
| fnBody에 `gfn_tran(` 있음 | API 버튼 |

```java
private boolean isNonApiButton(String btnId, String fnBody) {
    if (btnId.startsWith("btn_row_add") || btnId.startsWith("btn_row_del")
            || btnId.startsWith("btn_excel")  || btnId.startsWith("btn_SCH_")) {
        return true;
    }
    if (fnBody.contains("gfn_openPopup(")) return true;
    return !fnBody.contains("gfn_tran(");
}
```

#### resolveActionType() 매핑 규칙

`btnId`와 svcId(API 버튼의 경우)를 조합하여 동작 설명 문자열을 반환한다.

| btnId 패턴 | svcId 조건 | actionType 반환값 |
|-----------|-----------|-----------------|
| `btn_search` | — | `"버튼 클릭"` |
| `btn_save` | actionType = "유효성검사" (선행 시나리오) | `"유효성 검사"` |
| `btn_save` | svcId에 `insert`/`create`/`reg` 포함 | `"저장 실행"` |
| `btn_save` | 그 외 | `"저장 실행"` |
| `btn_del` | — | `"삭제 실행"` |
| `btn_approval` | — | `"결재상신 실행"` |
| `btn_row_add` | — | `"그리드 행 추가"` |
| `btn_row_del` | — | `"그리드 행 삭제"` |
| `btn_excel` | — | `"엑셀 다운로드"` |
| `btn_SCH_*` | — | `"팝업 열기"` |
| `btn_{팝업}` (gfn_openPopup 포함) | — | `"팝업 열기"` |
| 그 외 | — | `"실행"` |

#### buildPreCondition() 분기 로직

`buildPreCondition(btnId, enabledLabels, crudType)` 는 아래 순서로 분기하여 사전조건 문자열을 반환한다.

```java
private String buildPreCondition(String btnId, List<String> enabledLabels,
                                  String crudType, String inputCols) {
    if (btnId == null) btnId = "";

    if (btnId.contains("del") && !btnId.contains("row")) {
        return "삭제 대상 행이 그리드에서 선택되어 있어야 함";
    }
    if (btnId.contains("approval") || btnId.contains("approv")) {
        return "저장된 문서가 존재하고 결재 가능 상태(미상신)여야 함";
    }
    if (btnId.contains("row_add") || btnId.contains("add_row")) {
        return "그리드가 화면에 표시된 상태여야 함";
    }
    if (btnId.contains("row_del") || btnId.contains("del_row")) {
        return "삭제할 행이 그리드에서 선택된 상태여야 함";
    }

    if ("SELECT".equals(crudType) || btnId.contains("search")) {
        return "검색 조건(날짜 범위, 콤보박스 등)을 설정하고, 해당 조건 범위 내 데이터가 DB에 존재해야 함. "
             + "조회 결과가 입력한 조건 범위를 벗어나지 않아야 함";
    }

    // btn_save / INSERT / UPDATE: enabledLabels 기반 항목별 줄 나열
    if (!enabledLabels.isEmpty()) {
        StringBuilder sb = new StringBuilder();
        for (String label : enabledLabels) {
            sb.append("- ").append(label).append(": (입력 필요)\n");
        }
        return sb.toString().trim();
    }

    // crudType fallback
    switch (crudType) {
        case "INSERT": return "입력 필수 항목의 값이 유효해야 함";
        case "UPDATE": return "수정 대상 데이터가 DB에 존재해야 함";
        case "DELETE": return "삭제 대상 행이 그리드에서 선택되어 있어야 함";
        default:       return "정상 조회 조건이 설정되어 있어야 함";
    }
}
```

| btnId 패턴 | 사전조건 생성 방식 |
|-----------|-----------------|
| `btn_search` | 고정 문구 (날짜 범위·콤보박스 조건 설명) |
| `btn_del` | 고정 문구 (그리드 행 선택) |
| `btn_approval` | 고정 문구 (미상신 문서 존재) |
| `btn_save` | `enabledLabels` 기반 항목별 나열 (빈 경우 `""`) |
| 그 외 (비API 버튼) | `""` |

#### fn_callBack 함수 분석 패턴

```javascript
case "setData":          // → svcId 추출
    this.opener.fn_search();    // → OPENER_SEARCH 패턴
    this.fn_search();           // → SELF_SEARCH 패턴
    break;
case "delData":
    this.opener.fn_search();    // → OPENER_SEARCH 패턴
    this.close();               // → SELF_CLOSE 패턴
    break;
case "setAppData":
    gfn_gwCall("Y", this);      // → GW_CALL 패턴
    break;
```

추출 패턴 코드:

| 정규식 패턴 | 추출 결과 |
|------------|---------|
| `case "(\w+)":` | svcId 목록 |
| `this\.opener\.[a-zA-Z_]+\(\)` | OPENER_SEARCH |
| `this\.fn_search\(\)` | SELF_SEARCH |
| `this\.close\(\)` | SELF_CLOSE |
| `gfn_gwCall\("Y"` | GW_CALL |
| `this\.opener\.[a-zA-Z_]+\(\).*close\(\)` | OPENER_SEARCH + SELF_CLOSE |

### 4.4 검색조건 입력 범위 — div_search 스코핑

#### 원칙

검색조건(사전조건) 항목은 **id에 `search`가 포함된 `<Div>` 블록 내부의 컴포넌트만** 대상으로 한다.  
화면 전체를 스캔하면 저장 폼, 그리드 등 무관한 컴포넌트가 섞이므로, `div_search`로 범위를 제한한다.

#### 구현 — `parseSearchInputLabels()`

```
1. parseSearchDivContent(content)
   - <Div> 태그 중 id에 "search" 포함 (대소문자 무관) → 해당 블록 추출
   - 중첩 Div는 깊이 카운팅으로 정확히 닫힘 위치 탐색

2. 추출된 div 내용에서 Static + 입력 컴포넌트 좌표 매핑
   - Static: id, left, top, text 수집
   - 입력 컴포넌트 (Edit, TextEdit, Combo, ComboBox, MaskEdit, Calendar): id, tagType, left, top 수집
   - 같은 top(±5px) 범위에서 left가 가장 가까운 좌측 Static.text → 레이블

3. 레이블 보정 규칙 (후처리, 순서대로 적용)
   | 조건 | 적용 레이블 |
   |------|-----------|
   | tagType=Calendar, 매칭 레이블="~" | → "종료일자" |
   | tagType=Edit(또는 TextEdit/MaskEdit), 같은 top에 Combo가 있고 둘의 매칭 레이블이 동일 | → 기존레이블+"키워드" (예: "검색조건" → "검색조건키워드") |
   | 컴포넌트 ID가 `_NO`로 끝남, 같은 top에 ID가 `_NM`으로 끝나는 컴포넌트 존재 | → `_NM` 컴포넌트의 레이블 사용 |

4. 결과를 위→아래, 좌→우 순(top 오름차순, 동일 top이면 left 오름차순)으로 정렬
   → ButtonAnalysis.searchInputLabels = { componentId → label }
```

#### div_Search 컴포넌트와 조회 inputValues 연결

**원칙**: `div_Search.form` 안에 있는 입력 컴포넌트들이 현황/목록 프로그램 **조회(SELECT) 시나리오의 `inputValues`** 소스가 된다.

Nexacro는 `<BindItem>` 으로 컴포넌트-Dataset 컬럼을 연결한다:
```xml
<BindItem compid="div_Search.form.SCH_RQST_SDT" datasetid="ds_search" columnid="RQST_SDT"/>
```

이 매핑을 파싱해 `ButtonAnalysis.searchBindMap`(컴포넌트ID → Dataset컬럼ID)에 저장한다.

```
parseSearchBindMap() 규칙:
1. <BindItem> 태그에서 compid / columnid 추출
2. compid에 "search"(대소문자 무관)가 포함된 것만 수집
3. compid의 마지막 '.' 이후 토큰을 컴포넌트 ID로 사용
   예) "div_Search.form.SCH_RQST_SDT" → "SCH_RQST_SDT"
→ ButtonAnalysis.searchBindMap = { componentId → datasetColumnId }
```

**SELECT 시나리오의 `inputValues` 빌드 규칙:**

| 조건 | 빌드 방식 |
|------|----------|
| `crudType="SELECT"` AND `searchInputLabels` 비어있지 않음 | `searchInputLabels` 기반 빌드 (아래 참조) |
| 그 외 | `inputCols` 기반 기존 방식 |

`searchInputLabels` 기반 빌드:
```
foreach (componentId → label) in searchInputLabels:
  1. datasetColId = searchBindMap.get(componentId) ?? componentId
  2. defaultValue = resolveDefaultValue(datasetColId)   // 날짜 패턴 적용
  3. 중복 레이블은 마지막 값으로 덮어씀
  → JSON 항목: "label": "defaultValue"
```

`resolveDefaultValue(colId)` 날짜 패턴 (대문자 기준):

| 컬럼 ID 패턴 | 기본값 |
|-------------|--------|
| `_DT_ST`, `_FROM_DT`, `_START_DT`, 끝이 `_SDT` | 해당 연도 1월 1일 (예: `20260101`) |
| `_DT_ED`, `_TO_DT`, `_END_DT`, `_DT`, 끝이 `_EDT` | 오늘 날짜 (예: `20260622`) |
| 그 외 | `""` |

#### 사전조건 출력 형식

`buildPreCondition()` 에서 `crudType == "SELECT"` 또는 btnId에 `search` 포함 시:

```
- {staticLabel}: {resolveSearchHint(inputId)}
- {staticLabel}: {resolveSearchHint(inputId)}
...
```

`resolveSearchHint(id)` 규칙:

| ID 패턴 (대문자) | 힌트 문구 |
|----------------|---------|
| `_DT_ST`, `_FROM_DT`, `_START_DT` | `시작 날짜 입력 (예: 20260101)` |
| `_DT_ED`, `_TO_DT`, `_END_DT` | `종료 날짜 입력 (예: 20260622)` |
| `_DT` | `날짜 입력 (예: 20260622)` |
| `_CD` | `코드 선택` |
| `_NM` | `명칭 입력` |
| `_NO` | `번호 입력` |
| 그 외 | `(입력 필요)` |

#### 폴백

`div_search`가 없는 화면(id에 "search" 포함 Div 미존재)이면 기존 고정 문구로 폴백:
```
검색 조건(날짜 범위, 콤보박스 등)을 설정하고, 해당 조건 범위 내 데이터가 DB에 존재해야 함.
조회 결과가 입력한 조건 범위를 벗어나지 않아야 함
```

#### 출력 예시

```
- 신청일자: 시작 날짜 입력 (예: 20260101)
- 신청일자: 종료 날짜 입력 (예: 20260622)
- 부서: 코드 선택
- 요청자: 명칭 입력
```

---

### 4.5 단위테스트 상세 내역 시나리오 (no=2)

#### 원칙

단위테스트에서 화면의 **상세 내역(저장 폼 등)에 해당하는 시나리오**는 메인 시나리오 그리드에  
별도 행(no=2)으로 추가한다. 동일한 `scenarioId`를 사용하여 같은 화면의 시나리오임을 표시한다.

| 구분 | no | scenarioId | 설명 |
|------|-----|-----------|------|
| 주 시나리오 | 1 | `UT_{screenName}` | 조회·저장·삭제 등 버튼 단위 동작 |
| 상세 내역 시나리오 | 2 | `UT_{screenName}` (동일) | 상세 입력 폼 진입·확인 동작 |

#### 그리드 표시 규칙

**단위 탭**: `scenarioId`가 동일한 행도 **모두 그리드에 표시**한다 (`no=2` 이상도 별도 행으로 노출).  
**통합 탭**: `scenarioId`별 첫 번째 행만 그리드에 표시하고, 나머지는 더블클릭 팝업(`doScenDetailPopup`)으로 확인한다.

```javascript
// renderScenarioTable() 내 displayList 구성 규칙
if (currentTab === '단위') {
  // 단위: 모든 행 그대로 표시 (scenarioId 중복 허용)
  displayList = filtered;
} else {
  // 통합: scenarioId 첫 번째 행만 표시
  var seenIds = {};
  displayList = filtered.filter(function(s) {
    if (seenIds[s.scenarioId]) return false;
    seenIds[s.scenarioId] = true;
    return true;
  });
}
```

#### 상세 내역 시나리오 생성 조건

- 화면에 `fn_compCtrl`이 존재하고, `set_enable` 대상 입력 컴포넌트가 1개 이상인 경우
- 즉, 저장 폼이 활성화되는 화면에서만 생성 (조회 전용 화면은 생성 안 함)

#### 상세 내역 시나리오 필드 규칙

| 필드 | 값 |
|------|---|
| `no` | `2` (고정) |
| `scenarioId` | 주 시나리오와 동일 (`UT_{screenName}`) |
| `테스트명` | `{화면명} - 상세 내역 입력` |
| `사전조건` | `fn_compCtrl` 활성화 컴포넌트의 좌측 Static 레이블 나열 (§4.4 기존 로직) |
| `crudType` | 주 시나리오의 저장 버튼 `crudType` (없으면 `UPDATE`) |
| `URL`, `inputDsId` 등 | 저장 버튼의 `gfn_tran` 정보 |

#### 구현 위치

`buildScenarios()` 내 기존 버튼별 시나리오 생성 루프 완료 후, `enabledCtrls`가 비어있지 않으면 상세 내역 시나리오를 result에 추가한다.

---

### 4.6 활성화 컴포넌트 및 Static 레이블 파싱

#### fn_compCtrl 함수에서 enable=true 컴포넌트 추출
```javascript
this.RQST_SBJ.set_enable(activeYn);    // 추출 대상
this.btn_save.set_enable(activeYn);    // 버튼은 제외
```
정규식: `this\.([A-Z][A-Z0-9_]+)\.set_enable\(` (대문자 시작 = 입력 컴포넌트)

#### Static 레이블 연결 (x좌표 기반)
```xml
<Static id="Static17" x="10"  y="50" text="요구명"/>
<Edit   id="RQST_SBJ" x="80"  y="50" enable="true"/>
```
연결 규칙: 같은 y좌표(±5px) 범위에서 x좌표가 가장 가까운 좌측 Static의 text를 항목명으로 사용

#### 그리드 헤더 텍스트 추출
```xml
<GridHeader>
  <Col text="요구번호" ... />
  <Col text="품목명"   ... />
</GridHeader>
```
정규식: `<Col[^>]+text="([^"]+)"` (GridHeader 영역 내)

#### resolveEnabledLabels() — 3개 소스 조합 우선순위

`enabledCtrls`(활성화 컴포넌트 ID 목록), `staticLabels`(Static 레이블 맵), `gridHeaders`(그리드 헤더 목록) 세 소스를 결합하여 사전조건 문자열을 생성한다.

| 우선순위 | 소스 | 설명 |
|---------|------|------|
| 1 | `staticLabels` | enabledCtrl ID와 같은 y좌표(±5px) 내 가장 가까운 좌측 Static text |
| 2 | enabledCtrl ID | staticLabels에 매핑이 없는 경우 컴포넌트 ID 자체를 항목명으로 사용 |
| 3 | `gridHeaders` | enabledCtrls가 없을 때 그리드 헤더 Col text로 보완 |

결합 결과 예시: `"[요구명, 품목명] 항목 입력 후 실행"` 형태의 `precondition` 문자열

#### markValidChkSvcIds() — fn_validChk 연관 svcId 마킹

`fnBodies` 맵을 순회하며 `fn_validChk` 호출이 포함된 fnBody를 찾고, 해당 fnBody에서 추출된 svcId를 `hasValidChkSvcIds` Set에 추가한다.

```java
// fnBody 내 fn_validChk 패턴 탐지 후 동일 fnBody의 svcId 마킹
if (fnBody.contains("fn_validChk")) {
    svcIdsInFn.forEach(hasValidChkSvcIds::add);
}
```

이 Set은 `buildScenarios()`에서 유효성 검사 시나리오 생성 여부 판별에 사용된다.

#### categorizeNonTranButtons() — 비API 버튼 분류

4.3절의 `isNonApiButton()` 판별 기준을 재사용하여 비API 버튼을 세부 유형으로 분류한다.

| 분류 | 판별 기준 |
|------|---------|
| `popup` | fnBody에 `gfn_openPopup` 포함 |
| `rowAdd` | btnId가 `btn_add`, `btn_row_add` 등 행추가 패턴 |
| `rowDel` | btnId가 `btn_del`, `btn_row_del` 등 행삭제 패턴 |
| `excel` | btnId에 `excel`/`xlsx` 포함 또는 fnBody에 `gfn_excel` |
| `approval` | fnBody에 `lv_appYn = "Y"` 패턴 |

분류 결과는 `buildScenarios()`에서 각 버튼 유형별 시나리오 템플릿 선택에 사용된다.

### 4.7 기존 XfdlParserService.parseXfdl() 출력 활용

`parseXfdl()`이 반환하는 `XfdlInfo`에서 다음 정보를 사용한다.

```
XfdlInfo
  ├── screenName     → sourceName (예: "pur5115m")
  ├── screenTitle    → 화면명 (예: "구매요청 등록")
  ├── tranCalls[]    → API 호출 목록
  │     ├── svcId   → serviceId, crudType 판별 키
  │     ├── url     → URL
  │     ├── inputDs → inputDsId
  │     └── outputDs→ outputDsId
  └── dsColumns{}    → { 컬럼ID → 타입 } (inputCols, inputValues 생성에 사용)
```

### 4.8 crudType 판별 규칙

`TranCall.svcId`를 소문자로 변환한 뒤 키워드 접두사로 판별한다.

| crudType | 판별 키워드 (소문자, startsWith 순서) |
|----------|--------------------------------------|
| `SELECT` | `get`, `list`, `search`, `select`, `find`, `read` |
| `INSERT` | `insert`, `create`, `add`, `reg`, `new` |
| `UPDATE` | `update`, `modify`, `edit`, `change`, `set` |
| `DELETE` | `delete`, `del`, `remove` |
| `SELECT` | 위 어느 것도 아닌 경우 기본값 |

> `save`는 INSERT/UPDATE 구분 불가 → `UPDATE`로 기본 처리 후 수동 수정 유도

### 4.9 inputCols 추출 규칙

`XfdlInfo.dsColumns`는 XFDL 내 **모든** Dataset의 컬럼을 합산한 Map이다.
`TranCall.inputDs`에 해당하는 Dataset을 특정하기 위해 XFDL을 재파싱하지 않고, 다음 규칙으로 추출한다.

```
1. inputDs == "ds_search" → 컬럼명에 "_DT", "_CD", "_NM" 포함된 컬럼 우선 추출
2. inputDs == "ds_input" 또는 "ds_master" → dsColumns 전체 사용
3. inputDs가 없거나 비어 있음 → inputCols = "" (빈값)
```

> 정교한 Dataset별 컬럼 분리는 Phase 2에서 개선한다 (4.6 참조).

### 4.10 메뉴 경로 조회 (menuPath)

XFDL의 `screenName`을 PGM_ID로 변환한 뒤 `SYS_MENU_MGT` 테이블에서 계층 경로를 조회한다.

#### pgmId 변환 규칙

```
sourceName (XFDL screenName)  →  pgmId (DB 조회키)
pur5115m                      →  PUR_5115M   (소문자 → 대문자, 숫자 앞 _ 삽입)
pur5110m                      →  PUR_5110M
```

변환 로직:
```
1. 대문자 변환
2. 첫 영문자 그룹과 숫자 그룹 사이에 _ 삽입
   예) PUR5115M → PUR_5115M
3. noSuffix = 마지막 알파벳 제거
   예) PUR_5115M → PUR_5115  (M 또는 P 등 단일 문자 접미사 제거)
```

#### 메뉴 경로 쿼리 (MenuResolveMapper.xml)

```xml
<!-- findMenuPath: sourceName → 루트부터 리프까지 메뉴명 목록 반환 -->
<select id="findMenuPath" parameterType="map" resultType="String">
    SELECT menu_nm
      FROM SYS_MENU_MGT
     WHERE menu_id IN (
               SELECT menu_id
                 FROM SYS_MENU_MGT
                START WITH menu_id IN (
                       SELECT menu_id
                         FROM SYS_MENU_MGT
                        WHERE UPPER(pgm_id) IN (#{pgmId}, #{noSuffix})
                          AND cls_cd NOT IN ('QUK', 'MAN')
                   )
               CONNECT BY PRIOR upp_menu_id = menu_id
           )
       AND menu_id != 'M_ROOT'
       AND USE_YN = 'Y'
       AND lvl > 1
     ORDER BY lvl ASC
</select>
```

- `START WITH`: pgm_id가 일치하는 리프 메뉴 노드 찾기
- `CONNECT BY PRIOR upp_menu_id = menu_id`: 리프 → 루트 방향으로 부모 탐색
- `ORDER BY lvl ASC`: 루트(lvl 낮음) → 리프(lvl 높음) 순 정렬
- `cls_cd NOT IN ('QUK','MAN')`: 즐겨찾기·매뉴얼 메뉴 제외
- `lvl > 1`: LVL 1(최상위 루트 노드)은 메뉴 경로 출력에서 제외

#### 결과 파싱

쿼리 결과(String 목록)를 ` > ` 로 join하여 menuPath 문자열 생성.

```java
List<String> rows = menuResolveDao.findMenuPath(params);

String menuPath = String.join(" > ", rows);
String gnbName  = rows.isEmpty() ? "" : rows.get(0);
String menuName = rows.isEmpty() ? "" : rows.get(rows.size() - 1);
```

#### 조회 실패 처리

- pgmId가 SYS_MENU_MGT에 없는 경우 → `menuPath = ""`, `gnbName = ""`, `menuName = ""`
- 빈값으로 저장하고 UI 그리드에서 수동 입력 유도

### 4.11 inputValues 기본값 생성 규칙

extractInputCols()로 추출한 컬럼 각각에 대해 **키 = "레이블"** 형식으로 JSON 항목을 생성하고, 값은 컬럼명 패턴으로 자동 설정한다.

#### 4.11.1 키 형식

| 조건 | 키 형식 | 예시 |
|------|---------|------|
| div_search에서 해당 컴포넌트 ID의 좌측 Static text를 찾은 경우 | `"레이블"` | `"신청기간"` |
| Static text를 찾지 못한 경우 (레이블 없음) | `"컬럼ID"` | `"PURCH_REQ_DT_ST"` |

> `searchInputLabels` 맵(`{컴포넌트ID → Static text}`)을 사용해 레이블을 조회한다.  
> 해당 컴포넌트 ID가 맵에 없으면 컬럼 ID를 키로 사용한다. 컬럼 ID는 키에 포함하지 않는다.

#### 4.11.2 값 규칙

inputValues에 저장되는 값은 **추출 시점의 실제 날짜 문자열**이다. 플레이스홀더가 아니다.

| 컬럼명 패턴 | 기본값 (실제 문자열) | Java 계산 |
|-------------|---------------------|----------|
| `_DT_ST`, `_FROM_DT`, `_START_DT` | 해당 연도 1월 1일 (예: `"20260101"`) | `LocalDate.now().withDayOfYear(1)` → `BASIC_ISO_DATE` |
| `_DT_ED`, `_TO_DT`, `_END_DT` | 오늘 날짜 (예: `"20260621"`) | `LocalDate.now()` → `BASIC_ISO_DATE` |
| `_DT` (단독) | 오늘 날짜 (예: `"20260621"`) | `LocalDate.now()` → `BASIC_ISO_DATE` |
| `_CD` | `""` (빈값, 수동 입력) | — |
| `_NM` | `""` (빈값, 수동 입력) | — |
| `_NO` | `""` (빈값, 수동 입력) | — |
| 그 외 | `""` (빈값) | — |

#### 4.11.3 예시

```json
{
  "신청기간": "20260101",
  "신청기간": "20260622",
  "결재상태": "",
  "발명구분": ""
}
```

레이블 미매칭 시 폴백:
```json
{
  "PURCH_REQ_DT_ST": "20260101",
  "PURCH_REQ_DT_ED": "20260622"
}
```

### 4.12 btn_approval expectedResult — ApprovalServiceImpl.java 파싱

`btn_approval` 단위 시나리오의 `expectedResult`는 두 부분으로 구성된다.

```
기안기가 호출됨 [+ ApprovalServiceImpl 후처리 문구]
```

#### ApprovalServiceImpl.java 파싱 규칙

추출 시점에 `ApprovalServiceImpl.java` 파일을 읽어 `000-010-030` 패턴이 포함된 후처리 블록을 추출한다.

**파일 경로:**

```java
// 다중 경로 시도 — 먼저 성공하는 경로 사용
String relPath = "src/main/java/cres/common/approval/service/impl/ApprovalServiceImpl.java";
String[] bases = {
    "",                               // 현재 작업 디렉터리 기준 상대 경로 (개발 환경)
    System.getProperty("user.dir", "") // JVM 시작 디렉터리 기반 절대 경로
};
```

**파싱 대상 패턴:**
```java
// 000-010-030 과 같이 숫자 3자리-숫자 3자리-숫자 3자리 형태의 주석 블록 또는 조건
Pattern PROC_CODE = Pattern.compile("(\\d{3}-\\d{3}-\\d{3})");
```

**추출 로직:**
```java
private String buildApprovalExpectedResult() {
    if (approvalExpectedResult != null) return approvalExpectedResult;  // 캐시 반환

    String relPath = "src/main/java/cres/common/approval/service/impl/ApprovalServiceImpl.java";
    String[] bases = { "", System.getProperty("user.dir", "") };

    List<String> procCodes = new ArrayList<>();
    for (String base : bases) {
        try {
            java.nio.file.Path fullPath = base.isEmpty()
                    ? java.nio.file.Paths.get(relPath)
                    : java.nio.file.Paths.get(base, relPath);
            if (!java.nio.file.Files.exists(fullPath)) continue;
            String src = new String(java.nio.file.Files.readAllBytes(fullPath));
            Matcher m  = Pattern.compile("(\\d{3}-\\d{3}-\\d{3})").matcher(src);
            while (m.find()) {
                String code = m.group(1);
                if (!procCodes.contains(code)) procCodes.add(code);
            }
            break;  // 성공 시 탈출
        } catch (Exception e) {
            // 다음 경로 시도
        }
    }

    StringBuilder result = new StringBuilder("기안기가 호출됨");
    if (!procCodes.isEmpty()) {
        result.append("; 후처리 로직 실행 (").append(String.join(", ", procCodes)).append(")");
    }
    return result.toString();
}
```

**출력 예시:**
```
기안기가 호출됨; 후처리 로직 실행 (000-010-030, 000-020-010)
```

**파일 읽기 실패 시 폴백:**
```
기안기가 호출됨
```


---

## 5. 핵심 Java 설계

> Java 클래스 설계 및 코드 구조는 **[structure.md](structure.md)** 를 참고한다.

### 5.1 신규 클래스: XfdlScenarioExtractor

**파일**: `src/main/java/cres/common/web/XfdlScenarioExtractor.java`

버튼 분석과 시나리오 조립을 담당하는 전용 클래스.

전체 클래스 설계(ButtonAnalysis, analyzeButtons, buildScenarios, extractAll)는 [structure.md](structure.md) 3절을 참고한다.

#### 클래스 핵심 구조 요약

```java
@Service
public class XfdlScenarioExtractor {
    @Autowired private XfdlParserService xfdlParser;
    @Autowired private MenuResolverService menuSvc;

    public static class ButtonAnalysis { ... }  // 전체 필드 목록 → structure.md 3.1절
    public ButtonAnalysis analyzeButtons(String content) { ... }
    public List<Map<String,Object>> buildScenarios(int startNo, XfdlInfo info, ButtonAnalysis analysis, String origin) { ... }
    public List<Map<String,Object>> extractAll(Map<File,String> dirOriginMap, BiConsumer<Integer,Integer> listener) { ... }
}
```

> **`deduplicateByUrl()` Phase 5 유보**: 동일 URL을 참조하는 복수 버튼에서 중복 시나리오가 생성될 수 있다.
> Phase 1에서는 중복 제거 없이 각 버튼마다 별도 시나리오를 생성하며, `deduplicateByUrl()` 구현은 Phase 5에서 추가한다.

> 전체 코드는 [structure.md](structure.md) 3절을 참고한다.

---

## 6. UI 설계

### 6.1 진입점: doTest_sec_upload.jsp

**삭제 대상 (기존 JSP에서 제거):**
- 파일 div 하단의 "📊 PUR 시나리오 생성" 버튼 (`btnPurGen`)
- 소스명 파일 div 하단의 파란색 "시나리오 생성" 버튼

위 두 버튼을 삭제하고, 아래 버튼으로 대체한다.

```html
<button class="btn-row-add" id="btnExtractUnit" onclick="runExtractUnitScenarios()">
  <span class="spinner" id="extractUnitSpinner" style="display:none"></span>
  시나리오 생성
</button>
<span id="extractUnitStatus" style="font-size:12px;color:#64748b"></span>
<div id="extractUnitProgress" style="display:none; width:300px; margin-top:4px;">
  <progress id="extractUnitBar" value="0" max="100" style="width:100%"></progress>
</div>
```

### 6.2 JS 함수

```javascript
function runExtractUnitScenarios() {
  // ── 소스 목록 검증 ──────────────────────────────────────────────
  const checkedSources = getCheckedSources();
  if (!checkedSources || checkedSources.length === 0) {
    alert('소스 목록이 없습니다. 먼저 소스 파일을 업로드하세요.');
    return;
  }
  // ────────────────────────────────────────────────────────────────

  if (!confirm('단위 시나리오를 추출하시겠습니까?')) return;

  const prefix = getCurrentPrefix();
  document.getElementById('extractUnitSpinner').style.display  = '';
  document.getElementById('extractUnitProgress').style.display = '';
  document.getElementById('extractUnitStatus').textContent     = '분석 중...';
  document.getElementById('btnExtractUnit').disabled           = true;

  // 업로드된 소스 파일명 목록을 쿼리 파라미터로 전달
  const sourceParams = checkedSources.map(s => 'sources=' + encodeURIComponent(s)).join('&');
  const es = new EventSource('/ai/extractUnitScenarios.do?prefix=' + prefix + '&' + sourceParams);

  es.onmessage = function(e) {
    const data = JSON.parse(e.data);

    if (data.done) {
      es.close();
      document.getElementById('extractUnitStatus').textContent =
        `✅ ${data.count}개 시나리오 추출 완료`;
      document.getElementById('extractUnitSpinner').style.display  = 'none';
      document.getElementById('extractUnitProgress').style.display = 'none';
      document.getElementById('btnExtractUnit').disabled           = false;
      loadPurEditorGrid();
    } else {
      const pct = Math.round((data.cur / data.total) * 100);
      document.getElementById('extractUnitBar').value      = pct;
      document.getElementById('extractUnitStatus').textContent =
        `분석 중... ${data.cur} / ${data.total}`;
    }
  };

  es.onerror = function() {
    es.close();
    document.getElementById('extractUnitStatus').textContent     = '❌ 추출 오류';
    document.getElementById('extractUnitSpinner').style.display  = 'none';
    document.getElementById('extractUnitProgress').style.display = 'none';
    document.getElementById('btnExtractUnit').disabled           = false;
  };
}
```

### 6.3 그리드 표시

> **confirm 다이얼로그**: 단위 추출 시 `confirm('단위 시나리오를 추출하시겠습니까?')`, 통합 추출 시 `confirm('통합 시나리오를 추출하시겠습니까?')`를 표시한다(6.2절 JS 참고).
> 취소 시 추출을 중단한다. Playwright 통합 테스트의 `beforeEach`에 `page.on('dialog', ...)` 자동 수락 핸들러가 등록되어 있어 테스트 중에는 자동 수락된다.

추출 완료 후 기존 `purEditorTable` 그리드에 결과가 표시되며, 사용자가 직접 수정 가능하다.

#### 행 배경색 규칙

```
[자동 채움 — 흰 배경]     no | 화면명 | crudType | URL | inputDsId | inputCols | inputValues
[수동 입력 — 연노랑]       테스트명 | 사전조건 | expectedResult
[menuPath 빈값 — 회색]    menuPath = "" 인 행 전체를 #E5E7EB(회색) 배경으로 표시
```

> `inputValues`는 JSON 문자열이 길어질 수 있으므로 그리드 셀에서는 **최대 60자**까지만 표시하고 나머지는 `…`로 말줄임 처리한다. 전체 값은 더블클릭 상세 팝업(6.5절)에서 확인한다.
>
> ```javascript
> // inputValues 말줄임 표시 헬퍼
> function truncateInputValues(val) {
>   if (!val) return '-';
>   return val.length > 60 ? val.slice(0, 60) + '…' : val;
> }
> ```

```javascript
function renderPurEditorRow(tr, row) {
  if (!row.menuPath || row.menuPath === '') {
    tr.style.backgroundColor = '#E5E7EB';
    tr.title = '메뉴 경로를 찾지 못했습니다. 수동으로 입력해주세요.';
  }
}
```

#### 메뉴명 콤보박스 검색

그리드 상단 검색 조건에 **메뉴명(gnbName) 콤보박스**를 추가한다.  
추출 완료 시 그리드 데이터에서 고유 gnbName 목록을 추출해 콤보박스 옵션을 자동 구성한다.

```html
<label>메뉴:
  <select id="filterGnbName" onchange="filterPurEditor()">
    <option value="">전체</option>
  </select>
</label>
```

```javascript
function buildGnbNameOptions(scenarios) {
  const names = [...new Set(scenarios.map(s => s.gnbName).filter(Boolean))].sort();
  const sel   = document.getElementById('filterGnbName');
  sel.innerHTML = '<option value="">전체</option>';
  names.forEach(n => {
    const opt = document.createElement('option');
    opt.value = n; opt.textContent = n;
    sel.appendChild(opt);
  });
}

function filterPurEditor() {
  const keyword = document.getElementById('filterKeyword').value.toLowerCase();
  const gnb     = document.getElementById('filterGnbName').value;
  rows.filter(r =>
    (!gnb || r.gnbName === gnb) &&
    (!keyword || r['테스트명'].toLowerCase().includes(keyword))
  );
}
```

### 6.4 내보내기 버튼 가드

시나리오 다운로드(xlsx/hwpx/pdf) 및 양식 내보내기 버튼 클릭 시,  
**현재 그리드에 시나리오가 없으면** 즉시 alert를 띄우고 처리를 중단한다.

```javascript
// 시나리오 존재 여부 — 그리드 데이터(currentScenarios) 기준
function guardScenarioExport() {
  if (!window.currentScenarios || window.currentScenarios.length === 0) {
    alert('시나리오가 없습니다. 먼저 시나리오를 생성하세요.');
    return false;
  }
  return true;
}

// 적용 예 — xlsx 내보내기
function exportScenarioXlsx() {
  if (!guardScenarioExport()) return;
  // 파일명 모달 → 다운로드 (makeTestCode.md §6.3 흐름)
  const today = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const prefix = getCurrentPrefix();
  openFileNameModal(today + '_' + prefix + '_scenario', 'xlsx', function(name, ext) {
    saveScenarioFile(name + '.' + ext, 'xlsx');
  });
}

// 적용 예 — hwpx 내보내기
function exportScenarioHwpx() {
  if (!guardScenarioExport()) return;
  const today = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const prefix = getCurrentPrefix();
  openFileNameModal(today + '_' + prefix + '_scenario', 'hwpx', function(name, ext) {
    saveScenarioFile(name + '.' + ext, 'hwpx');
  });
}

// 적용 예 — pdf 내보내기
function exportScenarioPdf() {
  if (!guardScenarioExport()) return;
  const today = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const prefix = getCurrentPrefix();
  openFileNameModal(today + '_' + prefix + '_scenario', 'pdf', function(name, ext) {
    saveScenarioFile(name + '.' + ext, 'pdf');
  });
}

// 적용 예 — 양식 내보내기
function exportScenarioForm() {
  if (!guardScenarioExport()) return;
  const today = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const prefix = getCurrentPrefix();
  openFileNameModal(today + '_' + prefix + '_form', 'xlsx', function(name, ext) {
    saveScenarioFile(name + '.' + ext, 'form');
  });
}
```

### 6.5 추출 전 소스 목록 검증 규칙

단위/통합 시나리오 추출 버튼 클릭 시 아래 순서로 검증한다. 하나라도 실패하면 즉시 `alert`를 띄우고 처리를 중단한다.

| 순서 | 검증 항목 | 실패 시 alert 메시지 |
|------|----------|-------------------|
| 1 | `getCheckedSources()` 결과가 1건 이상인지 | `소스 목록이 없습니다. 먼저 소스 파일을 업로드하세요.` |
| 2 | `getCurrentPrefix()`가 비어 있지 않은지 | `업무 구분(prefix)을 확인할 수 없습니다.` |

```javascript
// 추출 버튼 공통 가드 함수
function guardExtract() {
  const checkedSources = getCheckedSources();
  if (!checkedSources || checkedSources.length === 0) {
    alert('소스 목록이 없습니다. 먼저 소스 파일을 업로드하세요.');
    return false;
  }
  if (!getCurrentPrefix()) {
    alert('업무 구분(prefix)을 확인할 수 없습니다.');
    return false;
  }
  return true;
}

// 단위 시나리오 추출
function runExtractUnitScenarios() {
  if (!guardExtract()) return;
  if (!confirm('단위 시나리오를 추출하시겠습니까?')) return;
  const prefix       = getCurrentPrefix();
  const checkedSources = getCheckedSources();
  const sourceParams = checkedSources.map(s => 'sources=' + encodeURIComponent(s)).join('&');
  const es = new EventSource('/ai/extractUnitScenarios.do?prefix=' + prefix + '&' + sourceParams);
  // ... SSE 핸들링 (6.2절 동일 패턴)
}

// 통합 시나리오 추출
function runExtractIntegScenarios() {
  if (!guardExtract()) return;
  if (!confirm('통합 시나리오를 추출하시겠습니까?')) return;
  const prefix       = getCurrentPrefix();
  const checkedSources = getCheckedSources();
  const sourceParams = checkedSources.map(s => 'sources=' + encodeURIComponent(s)).join('&');
  const es = new EventSource('/ai/extractIntegScenarios.do?prefix=' + prefix + '&' + sourceParams);
  // ... SSE 핸들링 (6.2절 동일 패턴)
}
```

> `getCheckedSources()`는 소스 목록 그리드에서 체크된 항목을 반환하는 기존 함수이다.  
> 체크된 항목이 없더라도 전체 목록 자체가 비어 있으면 동일하게 가드를 통과하지 못한다.
> 반환값(파일명 배열)은 추출 버튼 클릭 시 `sources[]` 파라미터로 백엔드에 전달되어, 해당 파일만 시나리오 추출 대상이 된다.
```

> `currentScenarios`는 `loadPurEditorGrid()` 완료 시 전역 변수에 저장된 그리드 데이터 배열이다.

### 6.5 그리드 더블클릭 — 상세 팝업 (편집 가능)

탭 A 시나리오 그리드의 행을 더블클릭하면 해당 시나리오의 전체 필드를 모달로 표시한다.  
**읽기 전용 필드**와 **수정 가능 필드**를 구분한다.

**표시 필드**

| 필드 | 설명 | 수정 가능 |
|------|------|----------|
| 번호 | `no` | ✗ |
| 소스명 | `sourceName` | ✗ |
| 화면명 | `화면명` | ✗ |
| 테스트유형 | `testType` | ✗ |
| CRUD유형 | `crudType` | ✗ |
| URL | `URL` | ✗ |
| 서비스ID | `serviceId` | ✗ |
| 입력Dataset | `inputDsId` | ✗ |
| 입력컬럼 | `inputCols` | ✗ |
| 출력Dataset | `outputDsId` | ✗ |
| 입력값 | `inputValues` | ✗ |
| 테스트명 | `테스트명` | ✗ |
| 사전조건 | `사전조건` | ✗ |
| 기대결과 | `expectedResult` | ✗ |
| 메뉴경로 | `menuPath` | ✗ |
| 개발자 통과여부 | `DEV_PASS` | **✓ (수동 수정 허용)** |
| PL 통과여부 | `PL_PASS` | **✓ (수동 수정 허용)** |
| 사용자 통과여부 | `USER_PASS` | **✓ (수동 수정 허용)** |
| 사유 | `REMARK` | **✓** |

> `DEV_PASS`는 테스트 실행 시 자동으로 `Y`/`N` 설정되지만, 수동으로 덮어쓸 수 있다.  
> 자동 설정 값이 잘못된 경우(테스트 환경 문제 등) 수동 보정이 필요하기 때문이다.

```javascript
// 그리드 행 더블클릭 이벤트 — DEV_PASS/PL_PASS/USER_PASS 수정 가능
function onScenarioGridDblClick(rowData) {
  const passOptions = (selected) => `
    <select class="pass-select" style="border:1px solid #d1d5db;border-radius:4px;padding:2px 6px;font-size:12px">
      <option value=""  ${!selected              ? 'selected' : ''}>-</option>
      <option value="Y" ${selected === 'Y'       ? 'selected' : ''}>통과</option>
      <option value="N" ${selected === 'N'       ? 'selected' : ''}>미통과</option>
    </select>`;

  const html = `
    <table class="detail-table">
      <tr><th>번호</th><td>${rowData.no}</td></tr>
      <tr><th>소스명</th><td>${rowData.sourceName}</td></tr>
      <tr><th>화면명</th><td>${rowData['화면명']}</td></tr>
      <tr><th>테스트유형</th><td>${rowData.testType}</td></tr>
      <tr><th>CRUD유형</th><td>${rowData.crudType}</td></tr>
      <tr><th>URL</th><td>${rowData.URL || '-'}</td></tr>
      <tr><th>서비스ID</th><td>${rowData.serviceId || '-'}</td></tr>
      <tr><th>입력Dataset</th><td>${rowData.inputDsId || '-'}</td></tr>
      <tr><th>입력컬럼</th><td>${rowData.inputCols || '-'}</td></tr>
      <tr><th>출력Dataset</th><td>${rowData.outputDsId || '-'}</td></tr>
      <tr><th>입력값</th><td><pre>${rowData.inputValues || '-'}</pre></td></tr>
      <tr><th>테스트명</th><td>${rowData['테스트명']}</td></tr>
      <tr><th>사전조건</th><td>${rowData['사전조건'] || '-'}</td></tr>
      <tr><th>기대결과</th><td>${rowData.expectedResult || '-'}</td></tr>
      <tr><th>메뉴경로</th><td>${rowData.menuPath || '-'}</td></tr>
      <tr><th>개발자 통과여부</th><td id="modalDevPass">${passOptions(rowData.DEV_PASS)}</td></tr>
      <tr><th>PL 통과여부</th><td id="modalPlPass">${passOptions(rowData.PL_PASS)}</td></tr>
      <tr><th>사용자 통과여부</th><td id="modalUserPass">${passOptions(rowData.USER_PASS)}</td></tr>
      <tr><th>사유</th>
        <td><input type="text" id="modalRemark" value="${(rowData.REMARK||'').replace(/"/g,'&quot;')}"
             style="width:100%;border:1px solid #d1d5db;border-radius:4px;padding:3px 6px;font-size:12px"></td>
      </tr>
    </table>
    <div style="text-align:right;margin-top:12px">
      <button onclick="saveDetailModal(${rowData.no})"
              style="background:#294c9a;color:#fff;border:none;border-radius:4px;
                     padding:6px 16px;font-size:13px;cursor:pointer">저장</button>
    </div>`;
  openDetailModal('시나리오 상세', html);
}

// 모달 저장 — 변경된 통과여부/사유를 currentScenarios에 반영
function saveDetailModal(no) {
  const row = (window.currentScenarios || []).find(function(r){ return r.no === no; });
  if (!row) return;

  row.DEV_PASS  = document.querySelector('#modalDevPass  select').value || null;
  row.PL_PASS   = document.querySelector('#modalPlPass   select').value || null;
  row.USER_PASS = document.querySelector('#modalUserPass select').value || null;
  row.REMARK    = document.getElementById('modalRemark').value;

  refreshGridRow(no);  // 해당 행만 재렌더링
  closeDetailModal();

  // DB 반영 (updatePassStatus.do 기존 엔드포인트 재활용)
  fetch('/ai/updatePassStatus.do', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      no: no, prefix: getCurrentPrefix(),
      DEV_PASS: row.DEV_PASS, PL_PASS: row.PL_PASS, USER_PASS: row.USER_PASS,
      REMARK: row.REMARK
    })
  }).catch(function(e){ console.warn('통과여부 저장 실패', e); });
}
```

> `openDetailModal(title, bodyHtml)` / `closeDetailModal()`은 공통 모달 헬퍼 함수이다.  
> `doTest_main.jsp`와 `doTest_summary.jsp`가 동일 함수를 공유한다.

---

### 6.6 통합테스트 그리드 — 대표 내역 + 더블클릭 상세 팝업

#### 그리드 대표 컬럼 (요약 표시)

통합테스트 시나리오 그리드(`integEditorTable`)는 한 행당 핵심 식별 정보만 표시한다.  
상세 내용은 행 더블클릭으로 팝업에서 확인한다.

| 컬럼 | 필드 | 비고 |
|------|------|------|
| 번호 | `no` | |
| 화면명 | `화면명` | |
| 메뉴경로 | `menuPath` | 빈값이면 회색 배경 |
| 테스트명 | `테스트명` | |
| 개발자 통과 | `DEV_PASS_YN` | ✅ / ❌ / - |
| PL 통과 | `PL_PASS_YN` | ✅ / ❌ / - |
| 사용자 통과 | `USER_PASS_YN` | ✅ / ❌ / - |

```html
<!-- 통합테스트 그리드 헤더 예시 -->
<table id="integEditorTable">
  <thead>
    <tr>
      <th>번호</th>
      <th>화면명</th>
      <th>메뉴경로</th>
      <th>테스트명</th>
      <th>개발자</th>
      <th>PL</th>
      <th>사용자</th>
    </tr>
  </thead>
  <tbody id="integEditorBody"></tbody>
</table>
```

```javascript
function renderIntegEditorRow(tr, row) {
  // menuPath 없음 → 회색 배경
  if (!row.menuPath) {
    tr.style.backgroundColor = '#E5E7EB';
    tr.title = '메뉴 경로를 찾지 못했습니다. 수동으로 입력해주세요.';
  }
  // 더블클릭 → 상세 팝업
  tr.addEventListener('dblclick', function() {
    onIntegScenarioGridDblClick(row);
  });
  tr.innerHTML = `
    <td>${row.no}</td>
    <td>${row['화면명']}</td>
    <td>${row.menuPath || '-'}</td>
    <td>${row['테스트명']}</td>
    <td>${renderPassYn(row.DEV_PASS_YN)}</td>
    <td>${renderPassYn(row.PL_PASS_YN)}</td>
    <td>${renderPassYn(row.USER_PASS_YN)}</td>`;
}
```

#### 더블클릭 상세 팝업

행을 더블클릭하면 해당 통합 시나리오의 **전체 필드**를 모달로 표시한다.

| 섹션 | 표시 필드 |
|------|---------|
| 기본 정보 | `no`, `sourceName`, `화면명`, `menuPath` |
| 시나리오 내용 | `테스트명`, `사전조건`, `expectedResult` |
| 플로우 단계 | `flowSteps` — 저장·결재상신 등 단계별 API URL + 기대결과 목록 |
| 통과 현황 | `DEV_PASS_YN`, `PL_PASS_YN`, `USER_PASS_YN`, `REMARK` |

```javascript
function onIntegScenarioGridDblClick(rowData) {
  // flowSteps: [{step, url, serviceId, expectedResult}, ...]
  const stepsHtml = (rowData.flowSteps || []).map((s, i) => `
    <tr>
      <td>${i + 1}. ${s.step}</td>
      <td>${s.url || '-'}</td>
      <td>${s.expectedResult || '-'}</td>
    </tr>`).join('');

  const html = `
    <table class="detail-table">
      <tr><th colspan="2" class="section-header">기본 정보</th></tr>
      <tr><th>번호</th><td>${rowData.no}</td></tr>
      <tr><th>소스명</th><td>${rowData.sourceName}</td></tr>
      <tr><th>화면명</th><td>${rowData['화면명']}</td></tr>
      <tr><th>메뉴경로</th><td>${rowData.menuPath || '-'}</td></tr>

      <tr><th colspan="2" class="section-header">시나리오 내용</th></tr>
      <tr><th>테스트명</th><td>${rowData['테스트명']}</td></tr>
      <tr><th>사전조건</th><td>${rowData['사전조건'] || '-'}</td></tr>
      <tr><th>기대결과</th><td>${rowData.expectedResult || '-'}</td></tr>

      <tr><th colspan="2" class="section-header">플로우 단계</th></tr>
      <tr>
        <td colspan="2">
          <table class="flow-table">
            <thead><tr><th>단계</th><th>URL</th><th>기대결과</th></tr></thead>
            <tbody>${stepsHtml || '<tr><td colspan="3">-</td></tr>'}</tbody>
          </table>
        </td>
      </tr>

      <tr><th colspan="2" class="section-header">통과 현황</th></tr>
      <tr><th>개발자 통과</th><td>${renderPassYn(rowData.DEV_PASS_YN)}</td></tr>
      <tr><th>PL 통과</th><td>${renderPassYn(rowData.PL_PASS_YN)}</td></tr>
      <tr><th>사용자 통과</th><td>${renderPassYn(rowData.USER_PASS_YN)}</td></tr>
      <tr><th>사유</th><td>${rowData.REMARK || ''}</td></tr>
    </table>`;

  openDetailModal('통합 시나리오 상세', html);
}
```

> **`flowSteps` 필드**: `extractIntegAll()`이 생성하는 통합 시나리오 전용 필드.  
> 저장(`btn_save`) → 결재상신(`btn_approval`) 등 플로우 단계별로 `{step, url, serviceId, expectedResult}` 객체 목록을 담는다.  
> 단위 시나리오에는 이 필드가 없으며, 팝업에서 해당 섹션은 `-`로 표시된다.
