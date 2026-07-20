/**
 * 테스트 자동화 - 상세 리포터
 *
 * 테스트 실행 결과를 상세하게 기록하고 다양한 형식으로 출력합니다.
 * - 콘솔 출력 (컬러, 상세 정보)
 * - Markdown 리포트 (test-results/test-report.md)
 * - JSON 리포트 (test-results/detailed-report.json)
 * - HTML 대시보드 (test-results/dashboard.html)
 * - Excel 리포트 (test-results/test-results.xlsx)  ← CRUD 입력 데이터 포함
 */

import {
  Reporter,
  TestCase,
  TestResult,
  FullConfig,
  FullResult,
  Suite,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { generateHtmlReport } from './html-generator';

// ─────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────────────────────────────────────

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  duration: number;
}

interface InputDataEntry {
  label: string;
  value: any;
}

interface StepDetail {
  title: string;
  duration: number;
  status: string;
  error?: string;
}

interface TestDetail {
  title: string;
  fullTitle: string;
  status: string;
  duration: number;
  error?: string;
  steps: StepDetail[];
  retries: number;
  annotations: string[];
  /** logInput() 으로 기록된 입력 데이터 목록 */
  inputs: InputDataEntry[];
  /** logAction() 으로 기록된 액션 목록 (URL 포함) */
  actions: string[];
  /** 테스트 제목에서 추출한 CRUD 구분 */
  crudType: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 헬퍼
// ─────────────────────────────────────────────────────────────────────────────

/** 테스트 제목에서 CRUD 구분 추출  예: "[no:2] [SELECT] getList" → "SELECT" */
function extractCrudType(title: string): string {
  const m = title.match(/\[(SELECT|INSERT|UPDATE|DELETE|CRUD)\]/i);
  if (m) return m[1].toUpperCase();
  // ACTION 로그 URL 패턴으로 추론: getXxx → SELECT, setXxx → INSERT/UPDATE, delXxx → DELETE
  return '';
}

/** URL 패턴으로 CRUD 구분 보완 */
function inferCrudFromActions(actions: string[]): string {
  for (const a of actions) {
    const lower = a.toLowerCase();
    if (/\/del[A-Z]/.test(a) || lower.includes('delete')) return 'DELETE';
    if (/\/set[A-Z]/.test(a) || lower.includes('insert') || lower.includes('update')) return 'INSERT/UPDATE';
    if (/\/get[A-Z]/.test(a) || lower.includes('select')) return 'SELECT';
  }
  return '';
}

/** InputDataEntry 배열을 Excel 셀용 문자열로 변환 */
function inputsToString(inputs: InputDataEntry[]): string {
  return inputs
    .map(({ label, value }) => {
      if (value === null || value === undefined) return `${label}=(없음)`;
      if (typeof value === 'object') {
        // 객체이면 key=value 쌍으로 펼침
        const pairs = Object.entries(value)
          .map(([k, v]) => `${k}=${v ?? ''}`)
          .join(', ');
        return `[${label}] ${pairs}`;
      }
      return `${label}=${value}`;
    })
    .join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 리포터 클래스
// ─────────────────────────────────────────────────────────────────────────────

class DetailedReporter implements Reporter {
  private config!: FullConfig;
  private suite!: Suite;
  private startTime!: Date;
  private testDetails: TestDetail[] = [];
  private outputDir: string = 'test-results';

  /** 테스트별 입력 데이터 누적 (key: test.id) */
  private inputMap = new Map<string, InputDataEntry[]>();
  /** 테스트별 액션 누적 (key: test.id) */
  private actionMap = new Map<string, string[]>();
  /** stdout 청크 버퍼 — 행 단위 파싱을 위해 불완전한 줄 보관 */
  private stdoutBuf = new Map<string, string>();

  // ANSI 컬러 코드
  private colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
  };

  onBegin(config: FullConfig, suite: Suite): void {
    this.config = config;
    this.suite = suite;
    this.startTime = new Date();
    this.outputDir = config.projects[0]?.outputDir || 'test-results';
    this.printHeader();
  }

  /** worker 프로세스의 stdout을 테스트 단위로 수신 */
  onStdOut(chunk: string | Buffer, test: TestCase | undefined, _result: TestResult): void {
    if (!test) return;
    const text = typeof chunk === 'string' ? chunk : chunk.toString('utf-8');

    // 이전 청크에서 남은 불완전한 줄과 합치기
    const buf = (this.stdoutBuf.get(test.id) ?? '') + text;
    const lines = buf.split('\n');
    // 마지막 줄이 아직 완성되지 않았을 수 있으므로 버퍼에 보관
    this.stdoutBuf.set(test.id, lines.pop() ?? '');

    for (const line of lines) {
      if (!line.startsWith('__PWLOG__:')) continue;
      try {
        const entry = JSON.parse(line.slice('__PWLOG__:'.length));

        if (entry.type === 'INPUT') {
          const arr = this.inputMap.get(test.id) ?? [];
          arr.push({ label: entry.label, value: entry.value });
          this.inputMap.set(test.id, arr);
        }
        if (entry.type === 'ACTION') {
          const arr = this.actionMap.get(test.id) ?? [];
          // label이 URL 형태이면 그대로 저장 (예: "POST /mis/pur/pur5110/getList.do")
          arr.push(typeof entry.label === 'string' ? entry.label : String(entry.label));
          this.actionMap.set(test.id, arr);
        }
      } catch {
        /* JSON 파싱 실패 — 무시 */
      }
    }
  }

  onTestBegin(test: TestCase, _result: TestResult): void {
    const file = path.basename(test.location.file);
    console.log(
      `\n${this.colors.cyan}▶ 테스트 시작:${this.colors.reset} ${test.title}`
    );
    console.log(
      `  ${this.colors.dim}파일: ${file}:${test.location.line}${this.colors.reset}`
    );
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const statusIcon = this.getStatusIcon(result.status);
    const statusColor = this.getStatusColor(result.status);
    const duration = this.formatDuration(result.duration);

    console.log(
      `${statusColor}${statusIcon} ${test.title}${this.colors.reset} ${this.colors.dim}(${duration})${this.colors.reset}`
    );

    const steps: StepDetail[] = [];
    if (result.steps.length > 0) {
      console.log(`  ${this.colors.dim}스텝:${this.colors.reset}`);
      for (const step of result.steps) {
        const stepIcon = step.error ? '✗' : '✓';
        const stepColor = step.error ? this.colors.red : this.colors.green;
        console.log(
          `    ${stepColor}${stepIcon}${this.colors.reset} ${step.title} ${this.colors.dim}(${this.formatDuration(step.duration)})${this.colors.reset}`
        );
        steps.push({
          title: step.title,
          duration: step.duration,
          status: step.error ? 'failed' : 'passed',
          error: step.error?.message,
        });
      }
    }

    if (result.error) {
      console.log(
        `  ${this.colors.red}오류: ${result.error.message}${this.colors.reset}`
      );
      if (result.error.stack) {
        result.error.stack.split('\n').slice(0, 5).forEach((line) => {
          console.log(`    ${this.colors.dim}${line}${this.colors.reset}`);
        });
      }
    }

    if (result.attachments.length > 0) {
      console.log(`  ${this.colors.blue}첨부파일:${this.colors.reset}`);
      for (const att of result.attachments) {
        console.log(
          `    - ${att.name}: ${att.path || (att.body?.length ?? 0) + ' bytes'}`
        );
      }
    }

    // 입력 데이터 / 액션 수집
    const inputs  = this.inputMap.get(test.id)  ?? [];
    const actions = this.actionMap.get(test.id) ?? [];
    let crudType  = extractCrudType(test.title);
    if (!crudType) crudType = inferCrudFromActions(actions);

    this.testDetails.push({
      title: test.title,
      fullTitle: test.titlePath().join(' > '),
      status: result.status,
      duration: result.duration,
      error: result.error?.message,
      steps,
      retries: result.retry,
      annotations: test.annotations.map((a) => `${a.type}: ${a.description || ''}`),
      inputs,
      actions,
      crudType,
    });
  }

  onEnd(_result: FullResult): Promise<void> {
    const endTime = new Date();
    const totalDuration = endTime.getTime() - this.startTime.getTime();
    const summary = this.calculateSummary();

    this.printSummary(summary, totalDuration);
    this.generateMarkdownReport(summary, totalDuration);
    this.generateDetailedJsonReport(summary, totalDuration);
    this.generateHtmlDashboard(summary, totalDuration);
    this.generateExcelReport(summary, totalDuration);   // ← 신규

    return Promise.resolve();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Excel 리포트 생성
  // ─────────────────────────────────────────────────────────────────────────

  private generateExcelReport(summary: TestSummary, totalDuration: number): void {
    const reportPath = path.join(this.outputDir, 'test-results.xlsx');

    const wb = XLSX.utils.book_new();

    // ── Sheet 1: 요약 ────────────────────────────────────────────────────────
    const summaryRows: any[][] = [
      ['테스트 자동화 결과 요약'],
      [],
      ['실행 일시', this.startTime.toLocaleString('ko-KR')],
      ['총 소요 시간', this.formatDuration(totalDuration)],
      [],
      ['항목', '건수', '비율(%)'],
      ['성공 (PASS)', summary.passed, summary.total > 0 ? +(summary.passed / summary.total * 100).toFixed(1) : 0],
      ['실패 (FAIL)', summary.failed, summary.total > 0 ? +(summary.failed / summary.total * 100).toFixed(1) : 0],
      ['스킵 (SKIP)', summary.skipped, summary.total > 0 ? +(summary.skipped / summary.total * 100).toFixed(1) : 0],
      ['합계', summary.total, 100],
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
    // 컬럼 너비 설정
    wsSummary['!cols'] = [{ wch: 24 }, { wch: 10 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, '요약');

    // ── Sheet 2: 테스트 결과 목록 (CRUD 입력 데이터 포함) ──────────────────
    const headerRow = [
      'No',
      '테스트명',
      'CRUD',
      '상태',
      '입력 데이터',
      '소요 시간',
      '오류 메시지',
      '재시도',
    ];

    const dataRows: any[][] = this.testDetails.map((t, i) => {
      const statusLabel =
        t.status === 'passed' ? '성공' :
        t.status === 'failed' ? '실패' :
        t.status === 'skipped' ? '스킵' :
        t.status === 'timedOut' ? '타임아웃' : t.status;

      const inputStr = t.inputs.length > 0
        ? inputsToString(t.inputs)
        : '(없음)';

      return [
        i + 1,
        t.title,
        t.crudType || '-',
        statusLabel,
        inputStr,
        this.formatDuration(t.duration),
        t.error ?? '',
        t.retries,
      ];
    });

    const wsData = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);

    // 컬럼 너비 설정
    wsData['!cols'] = [
      { wch: 5  },  // No
      { wch: 40 },  // 테스트명
      { wch: 14 },  // CRUD
      { wch: 10 },  // 상태
      { wch: 60 },  // 입력 데이터 (넓게)
      { wch: 12 },  // 소요 시간
      { wch: 50 },  // 오류 메시지
      { wch: 8  },  // 재시도
    ];

    // 셀 줄바꿈 허용 (입력 데이터 열)
    const range = XLSX.utils.decode_range(wsData['!ref'] ?? 'A1');
    for (let R = 1; R <= range.e.r; R++) {
      const cell = wsData[XLSX.utils.encode_cell({ r: R, c: 4 })]; // 입력 데이터 열(E)
      if (cell) {
        cell.s = cell.s ?? {};
        cell.s.alignment = { wrapText: true, vertical: 'top' };
      }
    }

    XLSX.utils.book_append_sheet(wb, wsData, '테스트결과목록');

    // ── Sheet 3: CRUD별 입력 데이터 상세 ──────────────────────────────────
    const crudTests = this.testDetails.filter((t) => t.inputs.length > 0);
    if (crudTests.length > 0) {
      const crudHeader = ['테스트명', 'CRUD', '입력필드', '입력값'];
      const crudRows: any[][] = [];

      for (const t of crudTests) {
        for (const inp of t.inputs) {
          if (typeof inp.value === 'object' && inp.value !== null) {
            // 객체: 각 필드를 행으로
            for (const [k, v] of Object.entries(inp.value)) {
              crudRows.push([t.title, t.crudType || '-', k, v ?? '']);
            }
          } else {
            crudRows.push([t.title, t.crudType || '-', inp.label, inp.value ?? '']);
          }
        }
      }

      const wsCrud = XLSX.utils.aoa_to_sheet([crudHeader, ...crudRows]);
      wsCrud['!cols'] = [{ wch: 40 }, { wch: 14 }, { wch: 25 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(wb, wsCrud, 'CRUD입력데이터');
    }

    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    XLSX.writeFile(wb, reportPath);
    console.log(`📊 Excel 리포트 생성: ${reportPath}`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 기존 리포트 생성 (입력 데이터 추가)
  // ─────────────────────────────────────────────────────────────────────────

  private printHeader(): void {
    console.log('\n' + '═'.repeat(80));
    console.log(`${this.colors.bright}${this.colors.cyan}`);
    console.log(
      '  ╔═══════════════════════════════════════════════════════════════════════╗'
    );
    console.log(
      '  ║                                                                       ║'
    );
    console.log(
      '  ║                      테스트 자동화 리포트                              ║'
    );
    console.log(
      '  ║                                                                       ║'
    );
    console.log(
      '  ╚═══════════════════════════════════════════════════════════════════════╝'
    );
    console.log(`${this.colors.reset}`);
    console.log(`  시작 시간: ${this.startTime.toLocaleString('ko-KR')}`);
    console.log(
      `  환경: ${this.config.projects.map((p) => p.name).join(', ')}`
    );
    console.log('═'.repeat(80));
  }

  private printSummary(summary: TestSummary, totalDuration: number): void {
    console.log('\n' + '═'.repeat(80));
    console.log(`${this.colors.bright}테스트 실행 요약${this.colors.reset}`);
    console.log('─'.repeat(80));

    const barWidth = 50;
    const safeTotal = summary.total > 0 ? summary.total : 1;
    const passedWidth = Math.round((summary.passed / safeTotal) * barWidth);
    const failedWidth = Math.round((summary.failed / safeTotal) * barWidth);
    const skippedWidth = barWidth - passedWidth - failedWidth;

    const bar =
      `${this.colors.bgGreen}${'█'.repeat(passedWidth)}${this.colors.reset}` +
      `${this.colors.bgRed}${'█'.repeat(failedWidth)}${this.colors.reset}` +
      `${this.colors.bgYellow}${'░'.repeat(skippedWidth)}${this.colors.reset}`;

    console.log(`\n  진행률: [${bar}]`);
    console.log();

    console.log('  ┌─────────────────┬─────────┬─────────────┐');
    console.log('  │      항목       │   개수  │    비율     │');
    console.log('  ├─────────────────┼─────────┼─────────────┤');
    console.log(
      `  │ ${this.colors.green}✓ 성공${this.colors.reset}          │ ${this.padNumber(summary.passed, 7)} │ ${this.padPercent(summary.passed, summary.total)} │`
    );
    console.log(
      `  │ ${this.colors.red}✗ 실패${this.colors.reset}          │ ${this.padNumber(summary.failed, 7)} │ ${this.padPercent(summary.failed, summary.total)} │`
    );
    console.log(
      `  │ ${this.colors.yellow}○ 스킵${this.colors.reset}          │ ${this.padNumber(summary.skipped, 7)} │ ${this.padPercent(summary.skipped, summary.total)} │`
    );
    if (summary.flaky > 0) {
      console.log(
        `  │ ${this.colors.magenta}⚠ 불안정${this.colors.reset}        │ ${this.padNumber(summary.flaky, 7)} │ ${this.padPercent(summary.flaky, summary.total)} │`
      );
    }
    console.log('  ├─────────────────┼─────────┼─────────────┤');
    console.log(
      `  │ ${this.colors.bright}총 테스트${this.colors.reset}       │ ${this.padNumber(summary.total, 7)} │    100.0%   │`
    );
    console.log('  └─────────────────┴─────────┴─────────────┘');

    console.log();
    console.log(
      `  총 실행 시간: ${this.colors.bright}${this.formatDuration(totalDuration)}${this.colors.reset}`
    );
    console.log(`  완료 시간: ${new Date().toLocaleString('ko-KR')}`);

    console.log();
    if (summary.total === 0) {
      console.log(
        `  ${this.colors.bgYellow}${this.colors.bright} ⚠ 실행된 테스트가 없습니다. ${this.colors.reset}`
      );
    } else if (summary.failed === 0) {
      console.log(
        `  ${this.colors.bgGreen}${this.colors.bright} ✓ 모든 테스트 통과! (${summary.passed}/${summary.total}) ${this.colors.reset}`
      );
    } else {
      console.log(
        `  ${this.colors.bgRed}${this.colors.bright} ✗ ${summary.failed}개 테스트 실패 (${summary.passed}/${summary.total} 통과) ${this.colors.reset}`
      );
    }
    console.log('═'.repeat(80) + '\n');
  }

  private generateMarkdownReport(summary: TestSummary, totalDuration: number): void {
    const reportPath = path.join(this.outputDir, 'test-report.md');

    let md = `# 테스트 자동화 리포트

## 📊 테스트 요약

| 항목 | 결과 |
|------|------|
| 📅 실행 일시 | ${this.startTime.toLocaleString('ko-KR')} |
| ⏱️ 총 소요 시간 | ${this.formatDuration(totalDuration)} |
| 🔢 총 테스트 수 | ${summary.total}개 |
| ✅ 성공 | ${summary.passed}개 (${this.getPercent(summary.passed, summary.total)}%) |
| ❌ 실패 | ${summary.failed}개 (${this.getPercent(summary.failed, summary.total)}%) |
| ⏭️ 스킵 | ${summary.skipped}개 (${this.getPercent(summary.skipped, summary.total)}%) |

## 📋 테스트 결과 목록

| 상태 | CRUD | 테스트명 | 입력 데이터 | 소요시간 | 재시도 |
|:----:|:----:|----------|------------|----------|:------:|
`;

    for (const t of this.testDetails) {
      const emoji = this.getStatusEmoji(t.status);
      const inputSummary = t.inputs.length > 0
        ? t.inputs.map(({ label, value }) => {
            if (typeof value === 'object' && value !== null) {
              return `**${label}**: ${Object.entries(value).map(([k, v]) => `${k}=${v ?? ''}`).join(', ')}`;
            }
            return `**${label}**: ${value}`;
          }).join('<br>')
        : '—';

      md += `| ${emoji} | ${t.crudType || '—'} | ${t.title} | ${inputSummary} | ${this.formatDuration(t.duration)} | ${t.retries} |\n`;
    }

    // 실패 테스트 상세
    const failed = this.testDetails.filter((t) => t.status === 'failed');
    if (failed.length > 0) {
      md += `\n## ❌ 실패한 테스트 상세\n\n`;
      for (const t of failed) {
        md += `### ${t.title}\n\n`;
        md += `- **전체 경로**: ${t.fullTitle}\n`;
        md += `- **CRUD**: ${t.crudType || '—'}\n`;
        md += `- **소요 시간**: ${this.formatDuration(t.duration)}\n`;
        if (t.inputs.length > 0) {
          md += `- **입력 데이터**:\n`;
          for (const inp of t.inputs) {
            if (typeof inp.value === 'object' && inp.value !== null) {
              md += `  - \`${inp.label}\`: ${JSON.stringify(inp.value)}\n`;
            } else {
              md += `  - \`${inp.label}\`: ${inp.value}\n`;
            }
          }
        }
        if (t.error) {
          md += `- **오류**:\n\`\`\`\n${t.error}\n\`\`\`\n`;
        }
        md += '\n';
      }
    }

    // 스킵 테스트
    const skipped = this.testDetails.filter((t) => t.status === 'skipped');
    if (skipped.length > 0) {
      md += `\n## ⏭️ 스킵된 테스트\n\n`;
      for (const t of skipped) {
        md += `- ${t.title}`;
        if (t.annotations.length > 0) md += ` — ${t.annotations.join(', ')}`;
        md += '\n';
      }
    }

    md += `\n---\n\n*이 리포트는 자동으로 생성되었습니다.*\n`;
    md += `*생성 시간: ${new Date().toLocaleString('ko-KR')}*\n`;

    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(reportPath, md, 'utf-8');
    console.log(`📄 Markdown 리포트 생성: ${reportPath}`);
  }

  private generateDetailedJsonReport(summary: TestSummary, totalDuration: number): void {
    const reportPath = path.join(this.outputDir, 'detailed-report.json');

    const report = {
      metadata: {
        title: '테스트 자동화',
        generatedAt: new Date().toISOString(),
        startedAt: this.startTime.toISOString(),
        duration: totalDuration,
        environment: {
          projects: this.config.projects.map((p) => p.name),
          workers: this.config.workers,
          retries: this.config.projects[0]?.retries || 0,
        },
      },
      summary: {
        ...summary,
        successRate: this.getPercent(summary.passed, summary.total),
        failureRate: this.getPercent(summary.failed, summary.total),
      },
      tests: this.testDetails.map((t) => ({
        ...t,
        durationFormatted: this.formatDuration(t.duration),
        steps: t.steps.map((s) => ({
          ...s,
          durationFormatted: this.formatDuration(s.duration),
        })),
      })),
    };

    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`📊 상세 JSON 리포트 생성: ${reportPath}`);
  }

  private generateHtmlDashboard(summary: TestSummary, totalDuration: number): void {
    const reportPath = path.join(this.outputDir, 'dashboard.html');

    const reportData = {
      metadata: {
        title: '테스트 자동화',
        generatedAt: new Date().toISOString(),
        startedAt: this.startTime.toISOString(),
        duration: totalDuration,
        environment: {
          projects: this.config.projects.map((p) => p.name),
          workers: this.config.workers,
          retries: this.config.projects[0]?.retries || 0,
        },
      },
      summary: {
        ...summary,
        successRate: this.getPercent(summary.passed, summary.total),
        failureRate: this.getPercent(summary.failed, summary.total),
      },
      tests: this.testDetails.map((t) => ({
        ...t,
        status: t.status as 'passed' | 'failed' | 'skipped',
        durationFormatted: this.formatDuration(t.duration),
        steps: t.steps.map((s) => ({
          ...s,
          durationFormatted: this.formatDuration(s.duration),
        })),
      })),
    };

    generateHtmlReport(reportData, reportPath);
    console.log(`🌐 HTML 대시보드 생성: ${reportPath}`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 유틸리티
  // ─────────────────────────────────────────────────────────────────────────

  private calculateSummary(): TestSummary {
    let passed = 0, failed = 0, skipped = 0, flaky = 0, duration = 0;
    for (const t of this.testDetails) {
      duration += t.duration;
      if (t.status === 'passed') passed++;
      else if (t.status === 'failed' || t.status === 'timedOut') failed++;
      else if (t.status === 'skipped') skipped++;
      if (t.retries > 0 && t.status === 'passed') flaky++;
    }
    return { total: this.testDetails.length, passed, failed, skipped, flaky, duration };
  }

  private getStatusIcon(status: string): string {
    return status === 'passed' ? '✓' : status === 'failed' ? '✗' : status === 'timedOut' ? '⏱' : '○';
  }

  private getStatusEmoji(status: string): string {
    return status === 'passed' ? '✅' : status === 'failed' ? '❌' : status === 'timedOut' ? '⏱️' : '⏭️';
  }

  private getStatusColor(status: string): string {
    return status === 'passed' ? this.colors.green : status === 'failed' || status === 'timedOut' ? this.colors.red : this.colors.yellow;
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const m = Math.floor(ms / 60000);
    const s = ((ms % 60000) / 1000).toFixed(0);
    return `${m}m ${s}s`;
  }

  private padNumber(num: number, width: number): string {
    return num.toString().padStart(width, ' ');
  }

  private padPercent(value: number, total: number): string {
    const p = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
    return `${p.padStart(8, ' ')}%  `;
  }

  private getPercent(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 1000) / 10 : 0;
  }
}

export default DetailedReporter;
