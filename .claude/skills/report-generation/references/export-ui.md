# 내보내기 UI 설계 문서

> 작성일: 2026-06-21 (doTest_sec_result.jsp + doTest_script.jsp 역기재)
> 관련 파일: `doTest_sec_result.jsp`, `doTest_script.jsp`, `file_export.md`

---

## 1. 개요

PANEL 4 "테스트 결과서" 영역에 두 가지 다운로드 경로가 있다.

| 버튼 | JS 함수 | 설명 |
|------|---------|------|
| 📦 엑셀 다운로드 (.zip) | `doDownload()` | xlsx + html 기본 패키지 ZIP |
| 📦 다운로드 (다중 형식) | `doMultiFormatDownload()` | 사용자 선택 형식 조합 |

---

## 2. 기본 ZIP 다운로드 (`doDownload`)

### 2.1 호출 조건
- `btnDownload` 버튼은 테스트 실행 완료 전까지 `disabled` 상태
- 실행 완료(SSE `done` 이벤트) 후 `btnDownload.disabled = false`

### 2.2 요청
```
GET /ai/exportResult.do?prefix={prefix}&format=xlsx
```

### 2.3 응답
- `Content-Disposition: attachment; filename=...xlsx`
- 브라우저 파일 저장 트리거

---

## 3. 다중 형식 내보내기 (`doMultiFormatDownload`)

### 3.1 UI 구성 (`doTest_sec_result.jsp`)

| 섹션 | 체크박스 ID | 선택 항목 |
|------|-----------|----------|
| 문서 종류 | `chkScenario`, `chkResult` | 시나리오, 결과서 |
| 출력 형식 | `fmtXlsx`, `fmtHtml`, `fmtDocx`, `fmtPdf` | xlsx, html, docx, pdf |
| 생성 라이브러리 | `chkJava`, `chkPython` | Java, Python |

기본 선택: 시나리오 ✓, 결과서 ✓, xlsx ✓, html ✓, Java ✓, Python ✓

### 3.2 처리 흐름
```
doMultiFormatDownload()
  → 체크박스 상태 수집
  → 선택된 (문서종류 × 형식 × 라이브러리) 조합별로 개별 다운로드 요청
  → 모든 파일을 ZIP으로 묶어 반환 (서버사이드 또는 클라이언트사이드)
```

### 3.3 엔드포인트 (file_export.md §9 참조)

| 문서 종류 | 엔드포인트 |
|----------|----------|
| 시나리오 | `/ai/exportScenarioDirect.do` (xlsx) / `/ai/exportScenarioTemplate.do` (hwpx, pdf) |
| 결과서 | `/ai/exportResult.do` |

---

## 4. 결과 요약 섹션

`doTest_script.jsp`의 SSE `result` 이벤트 처리 시 자동 갱신:

| 요소 ID | 내용 |
|---------|------|
| `sumTotal` | 전체 시나리오 수 |
| `sumPass` | PASS 건수 |
| `sumFail` | FAIL 건수 |
| `resultBody` | 결과 테이블 tbody |

컬럼: No / 시나리오ID / 메뉴명 / URL / Method / 예상결과 / 연관 / 결과 / 비고

---

## 5. 결함 리스트 섹션

- FAIL 항목만 표시 (`testResult !== 'PASS'`)
- `btnDefectFix` 버튼 → `doGenerateDefectFix()` → AI 소스 개선방안 분석 (SSE)
- 결과: `defectBody`에 행 추가, 마지막 컬럼에 개선방안 텍스트 표시

---

## 6. AI 분석 리포트 섹션

| 요소 | 설명 |
|------|------|
| `reportPreview` | 편집 가능한 `<textarea>` |
| 버전 추가 버튼 | `doSaveReportVersion()` → 현재 textarea 내용을 버전 이력으로 저장 |
| 자동 생성 트리거 | 테스트 완료 후 자동으로 SSE 스트리밍으로 채워짐 |

---

## 7. 버튼 활성화 규칙

| 버튼 | 활성화 조건 |
|------|-----------|
| `btnDownload` | SSE `done` 이벤트 수신 후 |
| `btnMultiExport` | SSE `done` 이벤트 수신 후 |
| `btnDefectFix` | FAIL 건수 > 0 이고 AI 리포트 생성 완료 후 |

---

## 8. 관련 문서

- [file_export.md](file_export.md) — Java 내보내기 라이브러리 상세 설계 (ExportService.java)
- [result.md](result.md) — 테스트 결과 데이터 구조 (DEV_PASS / PL_PASS / USER_PASS)
