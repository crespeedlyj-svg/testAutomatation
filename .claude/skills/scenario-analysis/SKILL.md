---
name: scenario-analysis
description: "테스트 시나리오 분석 및 추출 스킬. XFDL 파일 정적 분석, Excel 업로드, 수동 입력 등 모든 입력 소스에서 SCENARIO_STORE 형식의 시나리오 메타데이터를 생성한다. scenario-analyst 에이전트가 사용. '시나리오 추출', 'XFDL 분석', '시나리오 작성', '시나리오 데이터 만들어줘' 요청 시 이 스킬을 참조하라."
---

# 시나리오 분석 스킬

XFDL 파일, Excel, 수동 입력 중 하나의 소스에서 **SCENARIO_STORE(per-pgm 형식)** JSON을 생성하는 방법을 정의한다.

---

## 0. 메뉴 경로 및 menuId 해소 (작업 전 선행)

### 0-1. 필드 명칭 정의

| 레포트·spec 표시명 | 필드명 | 설명 | 예시 |
|---|---|---|---|
| 중분류 | `gnbName` | GNB(최상위) 메뉴명 | `구매관리` |
| 소분류 | `groupName` | 중간 분류 메뉴명 (menuPath 뒤에서 두 번째) | `구매요구` |
| 메뉴명 | `menuName` | 화면 메뉴명 (menuPath 마지막 노드) | `직접구매지급신청` |
| 메뉴ID | `menuId` | Nexacro MDI formKey (`M_MIS_XX_XX_XX` 형식) | `M_MIS_06_01_05` |

> **시나리오명 = menuName**: `시나리오명` 필드는 반드시 `menuName` 값을 사용한다.
> `설명` 필드는 테스트 케이스 세부 내용 (예: "전체 조회 (조건 없음)")을 담는다.

### menuPath 파싱 규칙

```
menuPath = "구매관리 > 구매요구 > 직접구매지급신청"
  → nodes = ["구매관리", "구매요구", "직접구매지급신청"]  (n=3)
  → gnbName   = nodes[0]    = "구매관리"           ← 중분류
  → groupName = nodes[n-2]  = "구매요구"           ← 소분류 (뒤에서 두 번째)
  → menuName  = nodes[n-1]  = "직접구매지급신청"    ← 메뉴명, 시나리오명
```

### 0-2. 메뉴 경로 해소 방법

`_workspace/00_menu_paths.json`이 있으면 읽어 각 `pgmId`에 매핑한다.
없으면 아래 SQL을 사용자에게 제시하고 결과를 `_workspace/00_menu_paths.json`에 저장 요청:

```sql
SELECT s.pgm_id,
       s.menu_nm                              AS menu_nm,
       p.menu_nm                              AS group_nm,
       pp.menu_nm                             AS gnb_nm
  FROM SYS_MENU_MGT s
  LEFT JOIN SYS_MENU_MGT p  ON p.menu_id  = s.upp_menu_id
  LEFT JOIN SYS_MENU_MGT pp ON pp.menu_id = p.upp_menu_id
 WHERE UPPER(s.pgm_id) LIKE '{PREFIX}%'
   AND s.cls_cd NOT IN ('QUK', 'MAN')
   AND s.USE_YN = 'Y'
 ORDER BY s.pgm_id;
```

캐시 형식:
```json
{
  "PUR_0910M": {
    "gnbName": "구매관리", "groupName": "구매요구",
    "menuName": "직접구매지급신청",
    "menuPath": "구매관리 > 구매요구 > 직접구매지급신청"
  }
}
```

### 0-3. menuId 해소 방법 (통합 테스트 필수)

**방법 A — 캐시 파일 활용 (우선):**
`_workspace/00_menu_ids.json`이 있으면 읽어 각 `pgmId`에 매핑한다.

```json
{
  "hrm_0130M": "M_MIS_01_01_03",
  "pur_0910M": "M_MIS_06_01_05"
}
```

**방법 B — 브라우저 JS 조회:**
앱이 실행 중이면 `application.gds_menu` 데이터셋에서 직접 조회한다.

```javascript
// 브라우저 콘솔 또는 page.evaluate() 에서 실행
const app = window.nexacro.getApplication();
const leftForm = app.mainframe?.VFrameSet?.HFrameSet?.LeftFrame?.form;
const ds = leftForm?.ds_menu ?? app.gds_menu;
const results = [];
for (let i = 0; i < ds.rowcount; i++) {
  const pgmPath = String(ds.getColumn(i, 'PGM_PATH') ?? '');
  if (pgmPath.toLowerCase().includes('{pgmId_lower}')) {
    results.push({ menuId: ds.getColumn(i, 'MENU_ID'), menuNm: ds.getColumn(i, 'MENU_NM') });
  }
}
// 결과를 _workspace/00_menu_ids.json에 저장
```

**방법 C — DB SQL:**
```sql
SELECT s.pgm_id, s.menu_id, s.menu_nm
  FROM SYS_MENU_MGT s
 WHERE UPPER(s.pgm_id) LIKE '{PREFIX}%'
   AND s.cls_cd NOT IN ('QUK', 'MAN') AND s.USE_YN = 'Y';
```

**방법 D — 플레이스홀더 (최후 수단):**
위 방법 모두 실패 시 `menuId: "M_MIS_XX_XX_XX"` 를 사용하고
`// TODO: SYS_MENU_MGT에서 {pgmId}의 menuId 조회 필요` 주석을 남긴다.

> 발견된 menuId는 반드시 `_workspace/00_menu_ids.json`에 저장해 이후 실행에서 재사용한다.

---

## 1. 입력 소스별 처리 방식

### 1-A. XFDL 정적 분석

XFDL 파일에서 `gfn_tran` 호출을 추출한다.

**추출 대상:**
- `gfn_tran` 호출 URL → `apiUrl`
- Dataset ID (`ds_` 접두어) → `dsListName`, `dsSearchName`
- Dataset Column 목록 → `dsSearchCols` (배열)

**파일 경로:** `src/main/nxui/{프로젝트명}/mis/{prefix}/` 하위 `*M.xfdl`

### 1-B. Excel 업로드

`.xlsx` 파일의 첫 번째 시트를 읽는다. 주요 컬럼 매핑:

| Excel 헤더 | SCENARIO_STORE 필드 |
|-----------|-------------------|
| 소스명 | `pgmId` |
| 화면명 | `screenName` |
| URL | `apiUrl` |
| 입력컬럼 | `dsSearchCols` (배열로 변환) |

### 1-C. 수동 입력

사용자 자연어 설명을 SCENARIO_STORE 형식으로 변환한다.

---

## 2. SCENARIO_STORE 데이터 모델 (per-pgm 형식)

출력 JSON은 **반드시 아래 per-pgm 형식**을 사용한다. (구형 flat array 형식 사용 금지)

출력 경로: `_workspace/{prefix}/01_scenarios.json`

```json
{
  "pgmId": "pur_0910M",
  "screenName": "직접구매요구신청",
  "menuName": "직접구매지급신청",
  "gnbName": "구매관리",
  "groupName": "구매요구",
  "menuPath": "구매관리 > 구매요구 > 직접구매지급신청",
  "menuId": "M_MIS_06_01_05",
  "apiUrl": "/mis/pur/pur0910/getList.do",
  "serviceId": "getList",
  "method": "POST",
  "origin": "mis",
  "crudType": "SELECT",
  "dsListName": "ds_list",
  "dsSearchName": "ds_search",
  "dsSearchCols": [
    "WORK_AREA", "RQST_SDT", "RQST_EDT", "APV_STAT_CD",
    "SCH_SRCH_CLS", "SCH_SRCH_KEY", "ROLE_YN"
  ],
  "resultCols": ["CHEAP_RQST_NO", "RQST_DT", "APV_STAT_CD", "APNT_DEPT_NM"],
  "scenarios": [
    {
      "tcId": "UT_PUR0910M_001",
      "type": "unit",
      "중분류": "구매관리",
      "소분류": "구매요구",
      "메뉴명": "직접구매지급신청",
      "액터": "개발자",
      "시나리오명": "직접구매지급신청",
      "설명": "전체 조회 (조건 없음)",
      "crudType": "SELECT",
      "params": {},
      "expectedDesc": "직접구매지급신청 목록이 조회된다. (총 N건)",
      "dbCountSql": "SELECT COUNT(*) FROM PUR_CHEAP_RQST_MST A WHERE 1=1",
      "expectedCount": 0,
      "expectZero": false,
      "rowValidation": null
    }
  ]
}
```

### 필드 규칙 (필수)

| 필드 | 규칙 |
|------|------|
| `시나리오명` | **menuName과 동일** — menuName 값을 그대로 복사 |
| `설명` | 테스트 케이스 세부 내용 ("전체 조회 (조건 없음)", "기간 조회 (RQST_SDT~RQST_EDT)") |
| `중분류` | top-level `gnbName`와 동일 — menuPath 첫 번째 노드를 그대로 복사 |
| `소분류` | top-level `groupName`와 동일 — menuPath 뒤에서 두 번째 노드를 그대로 복사 |
| `메뉴명` | top-level `menuName`와 동일 — menuPath 마지막 노드 (`시나리오명`과 동일한 값) |
| `액터` | 테스트 실행 역할 — §2-actor 파생 규칙으로 결정 |
| `gnbName` | menuPath 첫 번째 노드 |
| `groupName` | menuPath 뒤에서 두 번째 노드 |
| `menuName` | menuPath 마지막 노드 |
| `menuId` | Nexacro MDI formKey — 0-3단계 방법으로 해소 (방법 D 플레이스홀더는 최후 수단) |
| `dsSearchCols` | **배열** — XFDL ds_search의 모든 Column id 목록 |
| `resultCols` | ds_list에서 검증에 사용할 컬럼 목록 (배열) |
| `expectedCount` | DB 실제 건수 (0 = 미확인). 양수이면 spec에서 `toBe(N)` 생성 |
| `dbCountSql` | `SELECT COUNT(*) FROM ... WHERE 조건` — spec 주석에 포함 |
| `expectZero` | **기본값 false** — 데이터가 없음을 확인한 경우에만 true (추측 금지) |
| `rowValidation` | 행 단위 검증 규칙. null이면 건수 검증만 수행 |

### §2-actor: 액터(actor) 파생 규칙

시나리오 항목의 `액터` 필드는 `type`과 top-level `gnbName`으로 결정한다.

| `type` | gnbName | 액터 |
|--------|---------|------|
| `unit` | (무관) | `"개발자"` |
| `integration` | `인사관리` | `"인사담당자"` |
| `integration` | `구매관리` | `"구매담당자"` |
| `integration` | `재무관리` | `"재무담당자"` |
| `integration` | `자산관리` | `"자산담당자"` |
| `integration` | `총무관리` | `"총무담당자"` |
| `integration` | `시스템관리` | `"시스템관리자"` |
| `integration` | 그 외 | `"업무담당자"` |

### expectZero 설정 규칙 (중요)

`expectZero: true`는 **DB에서 실제 0건임을 확인한 경우에만** 설정한다.
확인 없이 추측으로 설정하면 안 된다. 기본값은 반드시 `false`.

```
❌ 잘못된 예: 역방향 날짜라서 0건일 것 같다 → expectZero: true (추측)
✅ 올바른 예: DB COUNT 쿼리 실행 결과 0건 확인 → expectZero: true
✅ 올바른 예: 날짜 역방향(시작 > 종료)처럼 논리적으로 100% 0건인 경우 → expectZero: true
```

---

## 3. 시나리오 TC 생성 규칙

### 3-1. SELECT 화면 표준 TC 세트 (6개)

SELECT 화면은 아래 6개 TC를 표준으로 생성한다.

| no | 설명 | params | expectZero |
|---|---|---|---|
| 1 | 전체 조회 (조건 없음) | `{}` | false |
| 2 | 주요 날짜/코드 조건 1개 | XFDL onload 기본값 또는 실용적 값 | false |
| 3 | 역방향 날짜 또는 존재하지 않는 코드 (0건 확인) | 역방향 날짜 | **true** (논리적 확실) |
| 4 | 주요 코드 필터 | APV_STAT_CD 등 | false |
| 5 | 키워드 검색 | SCH_SRCH_KEY 등 | false |
| 6 | 정렬 또는 권한 조건 | ROLE_YN, 정렬 등 | false |

> TC 수는 XFDL 분석 결과에 따라 조정 가능. 검색 조건이 없는 화면은 TC 수 줄임.

### 3-2. tcId 명명 규칙

```
단위 테스트: UT_{PREFIX_UPPER}{SCREEN_NUM}_{3자리순번}
  예: UT_PUR0910M_001

통합 테스트: IT_{PREFIX_UPPER}{SCREEN_NUM}_{3자리순번}
  예: IT_PUR0910M_001
```

---

## 4. 출력

`_workspace/{prefix}/01_scenarios.json` 저장 후 시나리오 수 요약을 SendMessage로 spec-generator에 전달한다.

> 발견된 `menuId`는 `_workspace/00_menu_ids.json`에도 저장한다.

## 참고 문서 (references/)

- `references/scenario-data-model.md` — SCENARIO_STORE 필드 표준
- `references/scenario_extraction.md` — **원본 프로그램(XfdlScenarioExtractor)이 시나리오를 생성하는 정식 로직·필드 정의서(역기재).** 우리 파이프라인 시나리오 포맷과 원본 프로그램 출력을 정합화할 때 기준으로 읽는다.
- `references/program_structure_design.md` — 원본 테스트 자동화 프로그램 전체 구조 설계(역기재). 시나리오 생성 제약·아키텍처 맥락 확인용.
