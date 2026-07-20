---
name: playwright-test
description: "Playwright 테스트 자동화 파이프라인 전체를 실행하는 오케스트레이터. 시나리오 작성, Playwright 스펙(.spec.ts) 생성, 테스트 자동 실행, 결과서 작성까지 포함한 전체 워크플로우를 조율한다. 단일 모듈과 전체 프로젝트 배치 처리를 모두 지원한다. 트리거: '테스트 시나리오 작성', 'playwright 실행', 'unit 테스트', '통합 테스트', 'spec 생성', '결과서 작성', '테스트 돌려줘', '자동화 실행', 'XFDL 테스트', '테스트 코드 만들어줘', '모든 소스 테스트', '전체 프로젝트 테스트', '전체 모듈 자동화', '배치 실행' 등 테스트 자동화 관련 모든 요청. 후속 작업: 시나리오 수정, 재실행, 특정 화면만 다시 테스트, 결과서 업데이트, 이전 결과 개선, 다시 실행, 보완 요청 시에도 반드시 이 스킬을 사용할 것."
---

# Playwright 테스트 자동화 오케스트레이터

테스트 시나리오 작성 → 스펙 생성 → 자동 실행 → 결과서 작성 전체 파이프라인을 에이전트 팀으로 조율한다.
**단일 prefix 모드**와 **전체 프로젝트 배치 모드** 두 가지를 지원한다.

## 실행 모드: 에이전트 팀 (파이프라인 패턴)

## 에이전트 구성

| 팀원 | 에이전트 | 역할 | 스킬 | 출력 |
|------|---------|------|------|------|
| source-scanner | source-scanner | 전체 XFDL 탐색, 처리 큐 생성 | source-scanning | `_workspace/00_sources.json` |
| scenario-analyst | scenario-analyst | XFDL/Excel/수동 입력 → 시나리오 추출 | scenario-analysis | `_workspace/{prefix}/01_scenarios.json` |
| spec-generator | spec-generator | 시나리오 → Playwright .spec.ts 생성 | spec-generation | `tests/unit/*.spec.ts`, `tests/integration/*.spec.ts` |
| test-runner | test-runner | npx playwright test 실행 + 결과 파싱 | test-execution | `_workspace/{prefix}/03_results.json` |
| report-writer | report-writer | 결과 → HTML 결과서 작성 | report-generation | `test-results/report_{날짜}_{prefix}.html` |

> source-scanner는 **전체 배치 모드**에서만 팀에 포함한다. 단일 prefix 모드는 4-agent 팀으로 처리.

## 데이터 흐름

### 단일 prefix 모드

```
[입력] prefix + (XFDL 파일목록 | Excel | 수동 시나리오)
    ↓ scenario-analyst
_workspace/01_scenarios.json  (SCENARIO_STORE 형식)
    ↓ spec-generator
tests/unit/testCode_{일시}_unit.spec.ts
tests/integration/testCode_{일시}_inte.spec.ts
    ↓ test-runner
_workspace/03_results.json  (시나리오별 PASS/FAIL)
    ↓ report-writer
test-results/report_{날짜}_{prefix}.html
```

### 전체 배치 모드

```
[입력] "전체" 또는 prefix 목록
    ↓ source-scanner
_workspace/00_sources.json  (processingQueue 포함)
    ↓ [모듈별 순차 반복 — act, ass, gen, hrm, pay, pur 순]
    ↓ scenario-analyst (per prefix)
_workspace/{prefix}/01_scenarios.json
    ↓ spec-generator (per prefix)
tests/unit/testCode_{일시}_unit.spec.ts
tests/integration/testCode_{일시}_inte.spec.ts
    ↓ test-runner (per prefix)
_workspace/{prefix}/03_results.json
    ↓ report-writer (per prefix + 최종 통합 보고서)
test-results/report_{날짜}_{prefix}.html
test-results/report_{날짜}_ALL.html  ← 전체 통합본
```

## 워크플로우

### Phase 0: 컨텍스트 확인 (후속 작업 지원)

`_workspace/` 존재 여부와 요청 유형을 함께 확인한다:

| 상태 | 요청 유형 | 처리 |
|------|----------|------|
| 미존재 | 임의 | 초기 실행 → Phase 1 진행 |
| 존재 | 부분 수정 ("시나리오만 다시", "리포트만 다시") | 부분 재실행 — 해당 에이전트만 재호출 |
| 존재 | 새 입력 제공 | 새 실행 — `_workspace/`를 `_workspace_{YYYYMMDD_HHMMSS}/`로 이동 후 Phase 1 |
| 존재 + `00_sources.json`의 `processingQueue` 미완료 | 배치 재개 | Phase 3-B 재개 — 처리된 모듈 건너뜀 |

### Phase 1: 입력 분석 및 실행 모드 결정

사용자 요청에서 아래를 파악하고 **실행 모드**를 결정한다:

**단일 prefix 모드 조건:** prefix가 명시됨 (`pur`, `hrm` 등)  
**전체 배치 모드 조건:** "전체", "모든 소스", "모든 프로젝트", "all", prefix 미명시

추가 파악 항목:
- `입력 유형`: XFDL 파일목록 / Excel / 수동 시나리오 텍스트
- `테스트 범위`: 단위(unit) / 통합(integration) / 전체
- `대상 화면`: 특정 sourceName 목록 또는 모두

`_workspace/` 디렉토리 생성, `_workspace/00_input/input_info.json`에 입력 정보 저장.

```json
{
  "prefix": "all",
  "inputType": "xfdl",
  "sources": ["all"],
  "testScope": "all",
  "requestedAt": "2026-06-24",
  "executionMode": "batch"
}
```

### Phase 2: 팀 구성

**단일 prefix 모드:**

```
TeamCreate(
  team_name: "playwright-test-team",
  members: [scenario-analyst, spec-generator, test-runner, report-writer]
)
```

각 팀원 prompt — 아래 Phase 3-A 참조.

**전체 배치 모드:**

```
TeamCreate(
  team_name: "playwright-batch-team",
  members: [source-scanner, scenario-analyst, spec-generator, test-runner, report-writer]
)
```

source-scanner가 먼저 실행되어 `00_sources.json`을 만들고, 이후 나머지 4명이 모듈별로 반복 실행된다.

### Phase 3-A: 단일 prefix 처리

```
TaskCreate(tasks: [
  {
    title: "시나리오 추출/작성",
    description: "입력 소스에서 SCENARIO_STORE 형식 시나리오 추출 → _workspace/01_scenarios.json",
    assignee: "scenario-analyst",
    prompt: "scenario-analysis 스킬을 읽고 작업. 메뉴 경로는 _workspace/00_menu_paths.json 우선 사용,
             없으면 SQL 생성 후 사용자에게 요청. 완료 후 SendMessage(to: spec-generator)"
  },
  {
    title: "Playwright 스펙 생성",
    description: "_workspace/01_scenarios.json → unit/integration .spec.ts 생성",
    assignee: "spec-generator",
    depends_on: ["시나리오 추출/작성"]
  },
  {
    title: "테스트 실행",
    description: "npx playwright test 실행 → _workspace/03_results.json",
    assignee: "test-runner",
    depends_on: ["Playwright 스펙 생성"]
  },
  {
    title: "결과서 작성",
    description: "_workspace/03_results.json → test-results/report_{날짜}_{prefix}.html",
    assignee: "report-writer",
    depends_on: ["테스트 실행"]
  }
])
```

### Phase 3-B: 전체 배치 처리

```
TaskCreate(tasks: [
  {
    title: "소스 탐색",
    description: "mis/ 전체 탐색 → _workspace/00_sources.json (processingQueue 포함)",
    assignee: "source-scanner"
  },
  {
    title: "배치 파이프라인 실행",
    description: "processingQueue의 각 prefix에 대해 순차적으로 시나리오→스펙→실행→결과서 반복",
    assignee: "leader",
    depends_on: ["소스 탐색"]
  }
])
```

**배치 반복 루프 (리더가 직접 수행):**

`_workspace/00_sources.json`의 `processingQueue`를 순회한다:

```
for each prefix in processingQueue:
  1. _workspace/{prefix}/ 디렉토리 생성
  2. scenario-analyst 호출
     - 입력: mis/{prefix}/ 하위 *M.xfdl 파일들 + _workspace/00_menu_paths.json
     - 출력: _workspace/{prefix}/01_scenarios.json
  3. spec-generator 호출
     - 입력: _workspace/{prefix}/01_scenarios.json
     - 출력: tests/unit/testCode_{일시}_unit.spec.ts
              tests/integration/testCode_{일시}_inte.spec.ts
  4. test-runner 호출
     - 출력: _workspace/{prefix}/03_results.json
  5. report-writer 호출
     - 출력: test-results/report_{날짜}_{prefix}.html
  6. _workspace/00_sources.json의 processed[]에 prefix 추가, processingQueue에서 제거
```

배치 루프 완료 후 report-writer를 한 번 더 호출하여 전체 통합 보고서(`report_{날짜}_ALL.html`) 생성.

### Phase 4: 모니터링 및 결과 종합

팀 완료 대기 → 최종 결과서 경로를 사용자에게 보고.

에러 시:
- 에이전트가 1회 재시도 후 재실패 → 해당 단계 건너뜀 + 보고서에 누락 명시
- 단일 모듈 실패 (배치 모드) → `skipped[]`에 기록 후 다음 모듈 계속
- test-runner 실패 → `_workspace/{prefix}/03_results_partial.json`으로 부분 결과 기록

### Phase 5: 팀 정리 및 보고

팀 해체 후 사용자에게 요약 보고:
- 처리 모듈 수 / 시나리오 총수 / 생성 스펙 파일 수 / PASS/FAIL 합계 / 결과서 경로

## 에러 핸들링

| 에러 | 처리 |
|------|------|
| XFDL 파일 없음 | Excel 또는 수동 입력으로 폴백 요청 |
| 메뉴 경로 미확인 | `TODO` 주석 처리 후 계속, 결과서에 목록 첨부 |
| Playwright 실행 실패 | `_workspace/{prefix}/03_error.log` 저장, 부분 결과로 계속 |
| 결과서 생성 실패 | `_workspace/{prefix}/03_results.json`을 사용자에게 직접 제시 |
| 배치 중 단일 모듈 실패 | `skipped[]` 기록 후 다음 모듈 처리 계속 |

## 테스트 시나리오

### 정상 흐름 (단일)
```
입력: prefix=pur, XFDL 파일 pur_0910M.xfdl
  → scenario-analyst: 7 unit + 3 integration 시나리오 추출
  → spec-generator: testCode_20260624_143000_unit.spec.ts / _inte.spec.ts 생성
  → test-runner: 10 TC 실행, 8 PASS / 2 FAIL
  → report-writer: test-results/report_20260624_pur.html 생성
```

### 정상 흐름 (배치 전체)
```
입력: "전체 프로젝트 테스트 자동화"
  → source-scanner: act(176) + ass(58) + gen(116) + hrm(57) + pay(65) + pur(47) = 519 화면 발견
  → 배치 루프 (act → ass → gen → hrm → pay → pur 순):
      각 prefix: 시나리오→스펙→실행→결과서
  → report-writer: test-results/report_20260624_ALL.html (통합 보고서)
```

### 에러 흐름
```
입력: "전체 자동화", 배치 중 hrm 모듈 XFDL 파싱 실패
  → hrm 모듈: skipped[] 에 기록 후 다음 모듈(pay) 계속
  → 최종 보고서: hrm 모듈 "오류로 건너뜀" 표시
```
