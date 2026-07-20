/**
 * 테스트 자동화 리포트 - HTML 생성기
 *
 * Playwright 테스트 결과를 시각적인 HTML 대시보드로 생성합니다.
 * Chart.js를 사용한 도넛 차트(결과 분포) + 막대 차트(소요 시간) 포함
 */

import * as fs from 'fs';
import * as path from 'path';

interface InputDataEntry {
  label: string;
  value: any;
}

interface TestResult {
  title: string;
  fullTitle: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  durationFormatted: string;
  error?: string;
  steps: Array<{
    title: string;
    duration: number;
    durationFormatted: string;
    status: string;
    error?: string;
  }>;
  retries: number;
  annotations: string[];
  /** logInput() 으로 기록된 입력 데이터 */
  inputs?: InputDataEntry[];
  /** 추출된 CRUD 구분 */
  crudType?: string;
}

interface ReportData {
  metadata: {
    title: string;
    generatedAt: string;
    startedAt: string;
    duration: number;
    environment: {
      projects: string[];
      workers: number;
      retries: number;
    };
  };
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    flaky: number;
    successRate: number;
    failureRate: number;
  };
  tests: TestResult[];
}

export function generateHtmlReport(
  data: ReportData,
  outputPath: string
): void {
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.metadata.title} - 테스트 리포트</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Malgun Gothic', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #1a237e 0%, #4a148c 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container { max-width: 1400px; margin: 0 auto; }

    .header {
      background: white;
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }

    .header h1 { color: #1a237e; font-size: 26px; margin-bottom: 10px; }
    .header .subtitle { color: #666; font-size: 13px; }

    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }

    .card h3 {
      color: #1a237e;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
      opacity: 0.7;
    }

    .stat-value { font-size: 48px; font-weight: bold; color: #1a1a2e; }
    .stat-label { color: #666; font-size: 14px; margin-top: 8px; }

    .stat-passed { color: #10b981; }
    .stat-failed { color: #ef4444; }
    .stat-skipped { color: #f59e0b; }

    .progress-bar {
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 16px;
    }

    .progress-fill { height: 100%; border-radius: 4px; }
    .progress-passed { background: linear-gradient(90deg, #10b981, #34d399); }
    .progress-failed { background: linear-gradient(90deg, #ef4444, #f87171); }

    .chart-container { position: relative; height: 200px; }

    .test-list {
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      overflow: hidden;
      margin-bottom: 20px;
    }

    .test-list-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      background: #f8f9ff;
    }

    .test-list-header h2 { color: #1a237e; font-size: 18px; }

    .test-item {
      padding: 16px 24px;
      border-bottom: 1px solid #f3f4f6;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      transition: background 0.2s;
      cursor: pointer;
    }

    .test-item:hover { background: #f9fafb; }
    .test-item:last-child { border-bottom: none; }

    .status-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .status-passed { background: #d1fae5; color: #10b981; }
    .status-failed  { background: #fee2e2; color: #ef4444; }
    .status-skipped { background: #fef3c7; color: #f59e0b; }

    .test-info { flex: 1; min-width: 0; }

    .test-title { color: #1a1a2e; font-weight: 500; }
    .test-path  { color: #9ca3af; font-size: 12px; margin-top: 4px; }

    .test-duration { color: #6b7280; font-size: 14px; white-space: nowrap; }

    .test-steps {
      margin-top: 10px;
      padding: 10px 12px;
      background: #f9fafb;
      border-radius: 8px;
      display: none;
    }

    .test-item.expanded .test-steps { display: block; }

    .step-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 3px 0;
      font-size: 13px;
      color: #4b5563;
    }

    .step-icon {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      flex-shrink: 0;
    }

    .error-message {
      margin-top: 10px;
      padding: 10px 12px;
      background: #fef2f2;
      border-radius: 8px;
      color: #dc2626;
      font-size: 13px;
      font-family: monospace;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .toggle-btn {
      background: none;
      border: 1px solid #e0e7ff;
      color: #6366f1;
      cursor: pointer;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 4px;
      margin-top: 6px;
      margin-right: 4px;
    }

    .toggle-btn:hover { background: #eef2ff; }

    /* 입력 데이터 섹션 */
    .input-data-section {
      margin-top: 8px;
      padding: 10px 12px;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 8px;
      display: none;
    }

    .test-item.expanded-inputs .input-data-section { display: block; }

    .input-data-section h4 {
      font-size: 12px;
      color: #0369a1;
      font-weight: 600;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .input-row {
      display: flex;
      gap: 8px;
      padding: 3px 0;
      font-size: 12px;
      border-bottom: 1px solid #e0f2fe;
      align-items: flex-start;
    }

    .input-row:last-child { border-bottom: none; }

    .input-label {
      color: #0369a1;
      font-weight: 600;
      min-width: 120px;
      flex-shrink: 0;
    }

    .input-value {
      color: #1e293b;
      font-family: 'Consolas', monospace;
      word-break: break-all;
    }

    .crud-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 1px 7px;
      border-radius: 10px;
      margin-left: 6px;
      vertical-align: middle;
    }

    .crud-SELECT  { background: #dbeafe; color: #1d4ed8; }
    .crud-INSERT  { background: #dcfce7; color: #15803d; }
    .crud-UPDATE  { background: #fef9c3; color: #a16207; }
    .crud-DELETE  { background: #fee2e2; color: #b91c1c; }
    .crud-INSERT-UPDATE { background: #fef3c7; color: #b45309; }

    .footer {
      text-align: center;
      padding: 20px;
      color: rgba(255,255,255,0.8);
      font-size: 13px;
    }

    @media (max-width: 768px) {
      .dashboard { grid-template-columns: 1fr; }
      .stat-value { font-size: 36px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏛️ ${data.metadata.title}</h1>
      <p class="subtitle">
        실행 시간: ${new Date(data.metadata.startedAt).toLocaleString('ko-KR')} &nbsp;|&nbsp;
        총 소요 시간: ${formatDuration(data.metadata.duration)} &nbsp;|&nbsp;
        환경: ${data.metadata.environment.projects.join(', ')}
      </p>
    </div>

    <div class="dashboard">
      <div class="card">
        <h3>총 테스트</h3>
        <div class="stat-value">${data.summary.total}</div>
        <div class="stat-label">테스트 케이스</div>
      </div>
      <div class="card">
        <h3>성공</h3>
        <div class="stat-value stat-passed">${data.summary.passed}</div>
        <div class="stat-label">${data.summary.successRate}% 성공률</div>
        <div class="progress-bar">
          <div class="progress-fill progress-passed" style="width:${data.summary.successRate}%"></div>
        </div>
      </div>
      <div class="card">
        <h3>실패</h3>
        <div class="stat-value stat-failed">${data.summary.failed}</div>
        <div class="stat-label">${data.summary.failureRate}% 실패율</div>
        <div class="progress-bar">
          <div class="progress-fill progress-failed" style="width:${data.summary.failureRate}%"></div>
        </div>
      </div>
      <div class="card">
        <h3>스킵</h3>
        <div class="stat-value stat-skipped">${data.summary.skipped}</div>
        <div class="stat-label">테스트 스킵됨</div>
      </div>
    </div>

    <div class="dashboard">
      <div class="card" style="grid-column: span 2;">
        <h3>테스트 결과 분포</h3>
        <div class="chart-container">
          <canvas id="statusChart"></canvas>
        </div>
      </div>
      <div class="card" style="grid-column: span 2;">
        <h3>테스트별 소요 시간</h3>
        <div class="chart-container">
          <canvas id="durationChart"></canvas>
        </div>
      </div>
    </div>

    <div class="test-list">
      <div class="test-list-header">
        <h2>📋 테스트 상세 결과</h2>
      </div>
      ${data.tests
        .map(
          (test, index) => {
            const crudClass = test.crudType
              ? `crud-${test.crudType.replace('/', '-').replace(' ', '-')}`
              : '';
            const crudBadge = test.crudType
              ? `<span class="crud-badge ${crudClass}">${escapeHtml(test.crudType)}</span>`
              : '';

            // 입력 데이터 섹션 HTML
            const inputHtml = test.inputs && test.inputs.length > 0
              ? `<div class="input-data-section">
                  <h4>📥 입력 데이터</h4>
                  ${test.inputs.map(inp => {
                    if (inp.value !== null && typeof inp.value === 'object') {
                      return Object.entries(inp.value).map(([k, v]) =>
                        `<div class="input-row">
                          <span class="input-label">${escapeHtml(k)}</span>
                          <span class="input-value">${escapeHtml(String(v ?? '(없음)'))}</span>
                        </div>`
                      ).join('');
                    }
                    return `<div class="input-row">
                      <span class="input-label">${escapeHtml(inp.label)}</span>
                      <span class="input-value">${escapeHtml(String(inp.value ?? '(없음)'))}</span>
                    </div>`;
                  }).join('')}
                </div>
                <button class="toggle-btn" onclick="toggleInputs(${index})">입력 데이터 보기/숨기기</button>`
              : '';

            const stepsHtml = test.steps.length > 0
              ? `<div class="test-steps">
                  ${test.steps.map(step =>
                    `<div class="step-item">
                      <div class="step-icon status-${step.status}">${step.status === 'passed' ? '✓' : '✗'}</div>
                      <span>${escapeHtml(step.title)}</span>
                      <span style="color:#9ca3af">(${step.durationFormatted})</span>
                    </div>`
                  ).join('')}
                </div>
                <button class="toggle-btn" onclick="toggleSteps(${index})">스텝 보기/숨기기</button>`
              : '';

            return `
        <div class="test-item" id="test-${index}">
          <div class="status-icon status-${test.status}">
            ${test.status === 'passed' ? '✓' : test.status === 'failed' ? '✗' : '○'}
          </div>
          <div class="test-info">
            <div class="test-title">${escapeHtml(test.title)}${crudBadge}</div>
            <div class="test-path">${escapeHtml(test.fullTitle)}</div>
            ${test.error ? `<div class="error-message">${escapeHtml(test.error)}</div>` : ''}
            ${inputHtml}
            ${stepsHtml}
          </div>
          <div class="test-duration">${test.durationFormatted}</div>
        </div>`;
          }
        )
        .join('')}
    </div>

    <div class="footer">
      <p>이 리포트는 자동으로 생성되었습니다 | ${new Date().toLocaleString('ko-KR')}</p>
    </div>
  </div>

  <script>
    new Chart(document.getElementById('statusChart'), {
      type: 'doughnut',
      data: {
        labels: ['성공', '실패', '스킵'],
        datasets: [{
          data: [${data.summary.passed}, ${data.summary.failed}, ${data.summary.skipped}],
          backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right' } }
      }
    });

    new Chart(document.getElementById('durationChart'), {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(
          data.tests.map(
            (t) => t.title.substring(0, 20) + (t.title.length > 20 ? '...' : '')
          )
        )},
        datasets: [{
          label: '소요 시간 (ms)',
          data: ${JSON.stringify(data.tests.map((t) => t.duration))},
          backgroundColor: ${JSON.stringify(
            data.tests.map((t) =>
              t.status === 'passed'
                ? '#10b981'
                : t.status === 'failed'
                  ? '#ef4444'
                  : '#f59e0b'
            )
          )},
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    function toggleSteps(index) {
      document.getElementById('test-' + index).classList.toggle('expanded');
    }

    function toggleInputs(index) {
      document.getElementById('test-' + index).classList.toggle('expanded-inputs');
    }
  </script>
</body>
</html>`;

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, html, 'utf-8');
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default generateHtmlReport;
