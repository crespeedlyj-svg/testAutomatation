import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

// 인증 상태 저장 경로
const STORAGE_STATE = path.join(__dirname, '.auth/user.json');

/**
 * 테스트자동화 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 테스트 디렉토리 (tests/ 하위만 탐색 — backup/copilot 등 제외)
  testDir: './tests',

  // 테스트 파일 패턴
  testMatch: '**/*.spec.ts',

  // backup, 보관 등 제외 폴더
  testIgnore: ['**/보관_*', '**/backup/**'],

  // workers: 1 고정 — workerPage(worker-scoped Page)를 사용하므로
  // 워커가 2개 이상이면 각 워커가 자체 컨텍스트를 생성/파괴하여
  // TC 하나 끝날 때마다 화면이 꺼졌다 켜지는 현상 발생
  fullyParallel: false,
  workers: 1,

  // 실패 시 재시도 (CI 환경에서만 2회)
  retries: process.env.CI ? 2 : 0,

  // 리포터 설정
  reporter: [
    ['html', {
      outputFolder: 'test-results/html-report',
      open: 'never'
    }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit-report.xml' }],
    ['list'],
    ['./tests/reporters/detailed-reporter.ts']
  ],

  // 전역 설정
  use: {
    // ✏️ 실제 서버 접속 URL로 변경하세요
    baseURL: process.env.APP_BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 30000,
    navigationTimeout: 30000,
    viewport: { width: 1920, height: 1080 },
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
    // --headed 실행 시 시각적 관찰을 위한 슬로우모션 (ms)
    // 사용 예: PLAYWRIGHT_SLOW_MO=800 npx playwright test ... --headed
    launchOptions: {
      slowMo: parseInt(process.env.PLAYWRIGHT_SLOW_MO ?? '0'),
    },
  },

  // 전역 타임아웃: navigateTo 최대 45s + 테스트 로직 여유 20s = 65s
  // 최적화 후 이미 화면이 열린 TC는 훨씬 빠르므로 타임아웃도 단축
  timeout: 90000,

  // 테스트 결과 출력 디렉토리
  outputDir: 'test-results/artifacts',

  // 프로젝트별 설정
  projects: [
    // =========================================
    // 1. 인증 설정 (가장 먼저 실행)
    // =========================================
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { headless: true }, // --headed 플래그와 무관하게 항상 headless
    },

    // =========================================
    // 2. 단위 테스트 (인증 필요 — API 호출 시 CSRF 검증 통과를 위해 storageState 필수)
    // =========================================
    {
      name: 'unit',
      testMatch: /unit\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,   // ← page.request.post 시 세션 쿠키 자동 주입
      },
      dependencies: ['setup'],         // ← setup(auth.setup.ts) 선행 실행
    },

    // =========================================
    // 3. 통합 테스트 (인증 필요)
    // =========================================
    {
      name: 'integration',
      testMatch: /integration\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        ignoreHTTPSErrors: true,
        javaScriptEnabled: true,
        storageState: STORAGE_STATE,
        acceptDownloads: true,
      },
      dependencies: ['setup'],
    },

    // =========================================
    // 4. E2E 테스트 (인증 필요)
    // =========================================
    {
      name: 'e2e',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        ignoreHTTPSErrors: true,
        javaScriptEnabled: true,
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
  ],
});
