---
name: test-execution
description: "Playwright 테스트 실행 스킬. 생성된 .spec.ts 파일을 npx playwright test로 실행하고, 결과(PASS/FAIL)를 파싱하여 저장한다. test-runner 에이전트가 사용. '테스트 실행', 'playwright 실행', 'npx playwright', '테스트 돌려줘', 'spec 실행' 요청 시 이 스킬을 참조하라."
---

# 테스트 실행 스킬

생성된 Playwright 스펙 파일을 실행하고 결과를 파싱한다.

## 0. 브라우저 시작 (CDP)

`npx playwright test` 실행 전 CDP 영속 브라우저를 먼저 띄운다. `tests/fixtures.ts`가
`.auth/browser-ws.json`을 발견하면 자동으로 이 Chrome에 연결하며, 없으면 Playwright 기본
브라우저로 폴백한다.

`npm run browser:start`(`scripts/start-browser.js`)는 Chrome을 띄운 채 종료되지 않는
프로세스이므로 반드시 **백그라운드로 실행**한다.

```bash
# 백그라운드로 시작 (run_in_background: true)
npm run browser:start
```

시작 후 `.auth/browser-ws.json` 파일이 생성될 때까지 짧게 대기(폴링)한 뒤 다음 단계(실행 명령)로 진행한다.
이미 `.auth/browser-ws.json`이 존재하면(이전 실행에서 Chrome이 계속 떠 있는 경우) 재시작 없이 그대로 사용한다.

## 1. 실행 명령

### 1-1. 전체 실행 (단위 + 통합)

```bash
npx playwright test --reporter=json 2>&1 | tee _workspace/{prefix}/03_playwright_output.log
```

결과 JSON은 `test-results/results.json`에 자동 저장된다 (`playwright.config.ts` 설정에 따름).

### 1-2. 특정 파일만 실행

```bash
# 단위 테스트만
npx playwright test tests/unit/{파일명}.spec.ts --reporter=json

# 통합 테스트만
npx playwright test tests/integration/{파일명}.spec.ts --reporter=json
```

### 1-3. 특정 TC만 실행

```bash
npx playwright test --grep "\[no:3\]" --reporter=json
```

## 2. 실행 전 확인 사항

- `package.json`에 `playwright` 의존성 확인
- `.env` 또는 환경변수 `APP_BASE_URL`이 설정되었는지 확인
- auth 상태 파일(`playwright/.auth/`) 존재 여부 확인 (없으면 먼저 `auth.setup.ts` 실행)

```bash
# auth 상태가 없을 경우
npx playwright test tests/auth.setup.ts
```

## 3. 결과 파싱

`test-results/results.json`(Playwright JSON 리포터 출력)을 읽어 아래 형식으로 변환한다.

### 3-1. 파싱 규칙

```
results.json의 suites[].specs[].title → 시나리오 식별
  "[no:N]" 패턴으로 no 추출
  "passed" / "failed" 상태 → DEV_PASS("통과" / "미통과") 매핑

결과 형식:
{
  "summary": { "total": 5, "passed": 3, "failed": 2 },
  "results": [
    { "no": 1, "title": "[no:1] 부서관리 - 전체 조회", "status": "passed", "DEV_PASS": "통과", "duration": 1234 },
    { "no": 2, "title": "[no:2] ...", "status": "failed", "DEV_PASS": "미통과", "error": "AssertionError: ..." }
  ]
}
```

### 3-2. 출력 파일

- `_workspace/{prefix}/03_results.json`: 파싱된 결과 (report-writer 입력)
- `_workspace/{prefix}/03_playwright_output.log`: 원본 playwright 실행 로그

## 4. 실패 처리

| 상황 | 처리 |
|------|------|
| 서버 연결 실패 | `_workspace/{prefix}/03_error.log`에 기록, 전체 결과를 "실행실패"로 표시 |
| 개별 TC 실패 | 해당 TC를 `DEV_PASS: "미통과"`로 기록 후 계속 |
| timeout | Playwright 기본 timeout(15,000ms) 초과 시 실패로 처리 |
| auth 만료 | `npx playwright test tests/auth.setup.ts` 재실행 후 1회 재시도 |

## 5. 출력

`_workspace/{prefix}/03_results.json` 저장 후 실행 요약(전체/PASS/FAIL 수)을 SendMessage로 report-writer에 전달한다.

## 6. 브라우저 종료

`npx playwright test`가 끝나면(성공/실패 무관, 부분 재실행 포함) 0단계에서 띄운 CDP Chrome을 정리한다.

```bash
npm run browser:stop
```

`scripts/stop-browser.js`가 `.auth/browser-ws.json`의 CDP 엔드포인트로 접속해 브라우저를 닫고
파일을 정리한다. 0단계에서 브라우저를 새로 띄우지 않고 기존 세션을 재사용한 경우에도 동일하게
실행해 종료한다.
