---
name: report-generation
description: "테스트 결과서 작성 스킬. Playwright 실행 결과를 읽어 DEV_PASS/PL_PASS/USER_PASS 3단계 통과여부가 포함된 HTML 결과서를 생성한다. report-writer 에이전트가 사용. '결과서 작성', '결과서 뽑아줘', '테스트 리포트', '결과 정리', 'HTML 보고서' 요청 시 이 스킬을 참조하라."
---

# 결과서 생성 스킬

`_workspace/{prefix}/03_results.json`과 `_workspace/{prefix}/01_scenarios.json`을 읽어 테스트 결과서를 작성한다.

## 1. 결과서 구조

### 1-1. 출력 파일

- **HTML**: `test-results/report_{YYYYMMDD}_{prefix}.html` (메인 결과서)
- **JSON 요약**: `_workspace/{prefix}/04_report_summary.json`

### 1-2. HTML 결과서 섹션

```
[헤더]
- 프로젝트: MIS
- 대상 업무: {prefix} ({화면명 목록})
- 실행일시: {datetime}
- 총계: 전체 N건 | PASS M건 | FAIL K건

[시나리오별 결과 테이블]
번호 | 소스명 | 화면명 | 테스트유형 | CRUD | 테스트명 | URL
    | 사전조건 | 기대결과 | 개발자통과여부 | PL통과여부 | 사용자통과여부 | 사유
    | 실행시간(ms)

[실패 목록 상세]
- 실패한 TC의 에러 메시지 및 스크린샷 링크

[요약 통계]
- CRUD 유형별 PASS/FAIL 비율
```

## 2. 통과여부 컬럼 규칙

| 컬럼 | 내부 필드 | 초기값 | 소스 |
|------|----------|--------|------|
| 개발자 통과여부 | `DEV_PASS` | `미진행` | Playwright 실행 결과 자동 설정 |
| PL 통과여부 | `PL_PASS` | `미진행` | 수동 입력 (결과서에 빈칸으로 표시) |
| 사용자 통과여부 | `USER_PASS` | `미진행` | 수동 입력 (결과서에 빈칸으로 표시) |
| 사유 | `REMARK` | `` | 수동 입력란 |

## 3. HTML 셀 스타일

```css
.result-pass    { background: #dcfce7; color: #15803d; font-weight: 700; }
.result-fail    { background: #fee2e2; color: #b91c1c; font-weight: 700; }
.result-running { background: #fef9c3; color: #92400e; font-weight: 700; }
```

결과가 없는 셀(PL, 사용자 통과여부)은 빈칸으로 표시한다.

## 4. 데이터 병합 방법

```
_workspace/{prefix}/01_scenarios.json 의 scenarios[]
_workspace/{prefix}/03_results.json 의 results[]
→ results[].title에서 "[no:N]" 패턴으로 N을 추출 → scenarios[N-1] 와 매핑
→ 시나리오 메타데이터 + DEV_PASS + 실행시간 통합

시나리오 목록에는 있으나 결과가 없는 경우: DEV_PASS = "미진행"
결과는 있으나 시나리오 목록에 없는 경우: 결과만으로 행 생성, 메타데이터 빈칸
```

## 5. 실패 시나리오 상세

실패한 TC는 결과서 하단에 별도 섹션으로 정리한다:
- TC 제목 + 에러 메시지 (`results[]`의 `error` 필드)
- 스크린샷 파일이 `test-results/screenshots/`에 있으면 이미지 링크 포함

## 6. 출력

`test-results/report_{YYYYMMDD}_{prefix}.html` 생성 후 경로와 요약을 SendMessage로 리더에게 전달한다.

요약 메시지 형식:
```
결과서 생성 완료:
- 파일: test-results/report_{날짜}_{prefix}.html
- 총 TC: N건
- PASS: M건 / FAIL: K건 / 미진행: J건
```

## 참고 문서 (references/)

- `references/result-spec.md` — 결과서 명세
- `references/export-ui.md` — 내보내기 UI 설계
- `references/result_processing.md` — **원본 프로그램의 테스트 결과 처리 로직 정의서(역기재).** 결과 집계·통과여부 처리를 원본 프로그램과 정합화할 때 기준으로 읽는다.
