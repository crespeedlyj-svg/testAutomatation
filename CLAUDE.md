# 테스트 자동화 프로젝트

## 하네스: Playwright 테스트 자동화

**목표:** XFDL/Excel/수동 시나리오 → Playwright 스펙 자동 생성 → 테스트 실행 → 결과서 작성까지 전 파이프라인 자동화

**트리거:** 테스트 시나리오 작성, spec 생성, playwright 실행, 결과서 작성, 테스트 자동화 관련 모든 요청 시 `playwright-test` 스킬을 사용하라. 단순 코드 질문은 직접 응답 가능.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-06-24 | 초기 구성 | 전체 | - |
| 2026-06-24 | source-scanner 에이전트 추가 | agents/source-scanner.md | 전체 프로젝트 배치 처리 지원 |
| 2026-06-24 | source-scanning 스킬 추가 | skills/source-scanning | mis/ 전체 탐색 및 배치 큐 생성 |
| 2026-06-24 | 메뉴 경로 해소 단계 추가 | skills/scenario-analysis | gnbName/menuName DB 조회 미해결 이슈 |
| 2026-06-24 | 다중 모듈 배치 지원 추가 | skills/playwright-test | 모든 프로젝트 일괄 자동화 요청 반영 |
| 2026-06-30 | 미사용 설계문서 정리 | agents/ → skills/*/references/ | agents/의 비-에이전트 8건 중 포맷 기준 4건(scenario_extraction·structure·makeTestCode·result) 이전, 4건(codeList·export·file_export·log) 삭제 |
| 2026-07-01 | 도구 빌드 단계 전면 제거 | test-tool/, agents/tool-builder.md, skills/tool-building, skills/playwright-test | 사용자 요청 — 앱(pss/doTest.jsp) 수정에 집중, 웹 GUI 도구 불필요 |
| 2026-07-07 | spec 파일 명명 규칙 변경: `{YYYYMMDD}_{pgmId}_unit/inte.spec.ts` → `testCode_{YYYYMMDD_HHmmss}_unit/inte.spec.ts` | skills/spec-generation, agents/spec-generator.md, skills/playwright-test | 사용자 요청 — testCode는 고정 리터럴(치환 금지), 파일 구분은 생성 시각으로만 |
| 2026-07-19 | spec 실행 전/후 `npm run browser:start`/`browser:stop` 자동 실행 추가, `scripts/stop-browser.js` 신규 생성 | skills/test-execution, agents/test-runner.md, scripts/stop-browser.js | 사용자 요청 — CDP 영속 브라우저를 테스트 실행 생명주기에 맞춰 자동 기동·종료 |
