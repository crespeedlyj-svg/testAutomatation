/**
 * 테스트 실행 로거 유틸리티
 *
 * 테스트 중 입력값, 액션, 결과를 구조화된 형식으로 기록합니다.
 * - 콘솔 컬러 출력
 * - JSON 로그 파일 저장 (test-results/test-data-log.json)
 *
 * @target 행정정보시스템
 */

import * as fs from 'fs';
import * as path from 'path';

interface LogEntry {
  timestamp: string;
  testName: string;
  type: 'INPUT' | 'ACTION' | 'RESULT' | 'ERROR' | 'INFO';
  label: string;
  value: any;
}

// ANSI 컬러
const C = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  cyan:    '\x1b[36m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  red:     '\x1b[31m',
  magenta: '\x1b[35m',
  blue:    '\x1b[34m',
};

const LOG_FILE = path.join('test-results', 'test-data-log.json');
const logEntries: LogEntry[] = [];

// 로그 타입별 아이콘 & 색상
const TYPE_STYLE: Record<LogEntry['type'], { icon: string; color: string }> = {
  INPUT:  { icon: '📥', color: C.cyan    },
  ACTION: { icon: '🖱️ ', color: C.blue   },
  RESULT: { icon: '✅', color: C.green  },
  ERROR:  { icon: '❌', color: C.red    },
  INFO:   { icon: 'ℹ️ ', color: C.dim    },
};

function formatValue(value: any): string {
  if (value === null || value === undefined) return String(value);
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

function log(
  type: LogEntry['type'],
  label: string,
  value: any,
  testName: string = ''
): void {
  const { icon, color } = TYPE_STYLE[type];
  const time = new Date().toTimeString().slice(0, 8);
  const formatted = formatValue(value);

  // 콘솔 출력
  console.log(
    `  ${color}${icon} [${type}]${C.reset} ${C.bold}${label}${C.reset}: ${color}${formatted}${C.reset} ${C.dim}(${time})${C.reset}`
  );

  // Reporter가 onStdOut()으로 수집할 수 있도록 구조화된 마커 출력
  // INPUT/ACTION 만 리포트에 표시 (RESULT/ERROR/INFO 는 불필요)
  if (type === 'INPUT' || type === 'ACTION') {
    process.stdout.write(
      '__PWLOG__:' + JSON.stringify({ type, label, value }) + '\n'
    );
  }

  // 메모리에 저장 (나중에 파일로 flush)
  logEntries.push({
    timestamp: new Date().toISOString(),
    testName,
    type,
    label,
    value,
  });
}

/** 입력값 로그 - 테스트에 사용되는 데이터 기록 */
export function logInput(label: string, value: any, testName?: string): void {
  log('INPUT', label, value, testName);
}

/** 액션 로그 - 버튼 클릭, 입력 등 사용자 행동 기록 */
export function logAction(label: string, value?: any, testName?: string): void {
  log('ACTION', label, value ?? '실행', testName);
}

/** 결과 로그 - 기대값 vs 실제값 비교 기록 */
export function logResult(
  label: string,
  actual: any,
  expected?: any,
  testName?: string
): void {
  const display =
    expected !== undefined
      ? { actual, expected, pass: actual === expected }
      : actual;
  log('RESULT', label, display, testName);
}

/** 에러 로그 */
export function logError(label: string, error: any, testName?: string): void {
  log('ERROR', label, error instanceof Error ? error.message : error, testName);
}

/** 정보 로그 */
export function logInfo(label: string, value: any, testName?: string): void {
  log('INFO', label, value, testName);
}

/**
 * 테스트 시작 구분선 출력
 * test.beforeEach 또는 테스트 상단에서 호출
 */
export function logTestStart(testName: string): void {
  console.log(
    `\n${C.bold}${C.magenta}${'─'.repeat(60)}${C.reset}`
  );
  console.log(
    `${C.bold}${C.magenta}  🧪 테스트: ${testName}${C.reset}`
  );
  console.log(
    `${C.bold}${C.magenta}${'─'.repeat(60)}${C.reset}`
  );
}

/**
 * 누적된 로그를 JSON 파일로 저장
 * test.afterAll 또는 onEnd에서 호출
 */
export function flushLogs(): void {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const report = {
    generatedAt: new Date().toISOString(),
    totalEntries: logEntries.length,
    entries: logEntries,
  };

  fs.writeFileSync(LOG_FILE, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\n📁 테스트 데이터 로그 저장: ${LOG_FILE}`);
}
