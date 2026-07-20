'use strict';

/**
 * 시나리오 JSON과 테스트 결과로 HTML 보고서를 생성한다.
 * 계획 보고서(실행 전)와 결과 보고서(실행 후) 두 종류를 생성한다.
 */

const CRUD_COLOR = {
  SELECT: '#1e88e5',
  INSERT: '#43a047',
  UPDATE: '#fb8c00',
  DELETE: '#e53935',
};

const baseStyle = `
  body { font-family: 'Malgun Gothic', sans-serif; margin: 0; background: #f5f5f5; color: #212121; }
  .header { background: #1a237e; color: #fff; padding: 20px 32px; }
  .header h1 { margin: 0; font-size: 20px; }
  .header p { margin: 4px 0 0; font-size: 13px; opacity: .8; }
  .summary { display: flex; gap: 16px; padding: 20px 32px; background: #fff; border-bottom: 1px solid #e0e0e0; }
  .summary-box { padding: 12px 20px; border-radius: 8px; min-width: 100px; text-align: center; color: #fff; }
  .summary-box .num { font-size: 28px; font-weight: 700; }
  .summary-box .label { font-size: 12px; }
  .content { padding: 24px 32px; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.1); font-size: 13px; }
  th { background: #e8eaf6; color: #1a237e; padding: 10px 12px; text-align: center; font-weight: 600; }
  td { padding: 8px 12px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; color: #fff; font-size: 11px; font-weight: 600; }
  .tc-no { text-align: center; color: #666; }
  .tc-name { font-weight: 500; }
  .tc-url { font-size: 11px; color: #666; font-family: monospace; }
  .section-title { font-size: 15px; font-weight: 700; color: #1a237e; margin: 24px 0 12px; border-left: 4px solid #3f51b5; padding-left: 10px; }
`;

function crudBadge(type) {
  const color = CRUD_COLOR[type] || '#666';
  return `<span class="badge" style="background:${color}">${type}</span>`;
}

function generatePlanReport(scenarios, options = {}) {
  const { prefix = 'test', title = '테스트 계획 보고서', date = today() } = options;
  const unitList = scenarios[`${prefix}_unit`] || [];
  const integList = scenarios[`${prefix}_integ`] || [];
  const totalCount = unitList.length + integList.length;
  const screenTitle = (unitList[0] || integList[0])?.화면명 || prefix;

  const unitRows = unitList.map(s => `
    <tr>
      <td class="tc-no">${s.no}</td>
      <td>${crudBadge(s.crudType)}</td>
      <td class="tc-name">${s.테스트명}</td>
      <td class="tc-url">${s.URL || '-'}</td>
      <td>${escHtml(s.사전조건 || '')}</td>
      <td>${escHtml(s.expectedResult || '')}</td>
      <td style="text-align:center;color:#666">${s.scenarioId}</td>
    </tr>`).join('');

  const integRows = integList.map(s => `
    <tr>
      <td class="tc-no">${s.no}</td>
      <td>${crudBadge('SELECT')}</td>
      <td class="tc-name">${s.테스트명}</td>
      <td class="tc-url">${s.menuPath || '-'}</td>
      <td>${escHtml(s.사전조건 || '')}</td>
      <td>${escHtml(s.expectedResult || '')}</td>
      <td style="text-align:center;color:#666">${s.scenarioId}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8">
<title>${title}</title>
<style>${baseStyle}</style>
</head><body>
<div class="header">
  <h1>${title}</h1>
  <p>${screenTitle} | 생성일: ${date} | 단위: ${unitList.length}건 · 통합: ${integList.length}건 · 합계: ${totalCount}건</p>
</div>
<div class="summary">
  <div class="summary-box" style="background:#1a237e"><div class="num">${totalCount}</div><div class="label">전체 TC</div></div>
  <div class="summary-box" style="background:#1e88e5"><div class="num">${unitList.length}</div><div class="label">단위</div></div>
  <div class="summary-box" style="background:#7b1fa2"><div class="num">${integList.length}</div><div class="label">통합</div></div>
</div>
<div class="content">
${unitList.length > 0 ? `
<div class="section-title">단위 테스트 (${unitList.length}건)</div>
<table>
  <thead><tr><th width="40">No</th><th width="80">유형</th><th>테스트명</th><th>URL</th><th>사전조건</th><th>기대결과</th><th width="140">시나리오 ID</th></tr></thead>
  <tbody>${unitRows}</tbody>
</table>` : ''}
${integList.length > 0 ? `
<div class="section-title">통합 테스트 (${integList.length}건)</div>
<table>
  <thead><tr><th width="40">No</th><th width="80">유형</th><th>테스트명</th><th>메뉴 경로</th><th>사전조건</th><th>기대결과</th><th width="140">시나리오 ID</th></tr></thead>
  <tbody>${integRows}</tbody>
</table>` : ''}
</div>
</body></html>`;
}

function generateResultReport(scenarios, playwrightResults, options = {}) {
  const { prefix = 'test', title = '테스트 결과 보고서', date = today() } = options;
  const unitList = scenarios[`${prefix}_unit`] || [];
  const integList = scenarios[`${prefix}_integ`] || [];
  const screenTitle = (unitList[0] || integList[0])?.화면명 || prefix;

  // Playwright 결과 파싱 (JSON reporter 형식)
  const resultMap = buildResultMap(playwrightResults);

  let pass = 0, fail = 0, skip = 0;

  function statusCell(scenarioId, testName) {
    const key = testName;
    const r = findResult(resultMap, key);
    if (!r) { skip++; return '<td style="text-align:center;color:#999">미실행</td>'; }
    if (r.status === 'passed') { pass++; return '<td style="text-align:center;color:#43a047;font-weight:700">✅ PASS</td>'; }
    fail++;
    const msg = r.error ? `<br><small style="color:#999">${escHtml(r.error.slice(0,80))}</small>` : '';
    return `<td style="text-align:center;color:#e53935;font-weight:700">❌ FAIL${msg}</td>`;
  }

  const unitRows = unitList.map(s => `
    <tr>
      <td class="tc-no">${s.no}</td>
      <td>${crudBadge(s.crudType)}</td>
      <td class="tc-name">${s.테스트명}</td>
      ${statusCell(s.scenarioId, `[no:${s.no}] [단위] [${s.crudType}] ${s.테스트명}`)}
    </tr>`).join('');

  const integRows = integList.map(s => `
    <tr>
      <td class="tc-no">${s.no}</td>
      <td>${crudBadge('SELECT')}</td>
      <td class="tc-name">${s.테스트명}</td>
      ${statusCell(s.scenarioId, `[no:${s.no}] [통합] [SELECT] ${s.테스트명}`)}
    </tr>`).join('');

  const total = unitList.length + integList.length;
  const rate = total > 0 ? Math.round(pass / total * 100) : 0;

  return `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8">
<title>${title}</title>
<style>${baseStyle}
.rate-bar { background:#e0e0e0; border-radius:8px; height:12px; margin-top:8px; overflow:hidden; }
.rate-bar-fill { background:#43a047; height:100%; border-radius:8px; width:${rate}%; }
</style>
</head><body>
<div class="header">
  <h1>${title}</h1>
  <p>${screenTitle} | 실행일: ${date} | PASS: ${pass} / FAIL: ${fail} / 미실행: ${skip} / 합계: ${total}</p>
  <div class="rate-bar"><div class="rate-bar-fill"></div></div>
</div>
<div class="summary">
  <div class="summary-box" style="background:#1a237e"><div class="num">${total}</div><div class="label">전체 TC</div></div>
  <div class="summary-box" style="background:#43a047"><div class="num">${pass}</div><div class="label">PASS</div></div>
  <div class="summary-box" style="background:#e53935"><div class="num">${fail}</div><div class="label">FAIL</div></div>
  <div class="summary-box" style="background:#fb8c00"><div class="num">${rate}%</div><div class="label">통과율</div></div>
</div>
<div class="content">
${unitList.length > 0 ? `
<div class="section-title">단위 테스트 (${unitList.length}건)</div>
<table>
  <thead><tr><th width="40">No</th><th width="80">유형</th><th>테스트명</th><th width="100">결과</th></tr></thead>
  <tbody>${unitRows}</tbody>
</table>` : ''}
${integList.length > 0 ? `
<div class="section-title">통합 테스트 (${integList.length}건)</div>
<table>
  <thead><tr><th width="40">No</th><th width="80">유형</th><th>테스트명</th><th width="100">결과</th></tr></thead>
  <tbody>${integRows}</tbody>
</table>` : ''}
</div>
</body></html>`;
}

function buildResultMap(playwrightJson) {
  if (!playwrightJson) return {};
  const map = {};
  function walk(node) {
    if (node.tests) {
      for (const t of node.tests) {
        map[t.title] = {
          status: t.status,
          error: t.results?.[0]?.error?.message || '',
        };
      }
    }
    if (node.suites) for (const s of node.suites) walk(s);
  }
  if (playwrightJson.suites) for (const s of playwrightJson.suites) walk(s);
  return map;
}

function findResult(map, title) {
  // 정확히 매칭하거나 타이틀이 포함되는 경우
  if (map[title]) return map[title];
  const key = Object.keys(map).find(k => k.includes(title) || title.includes(k));
  return key ? map[key] : null;
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function today() {
  return new Date().toISOString().slice(0,10);
}

// ─────────────────────────────────────────────────────────────────────────────
// 배치 prefix 결과서: DEV_PASS / PL_PASS / USER_PASS 3단계 포함
// ─────────────────────────────────────────────────────────────────────────────
function generateBatchPrefixReport(scenarios, playwrightResults, options = {}) {
  const {
    prefix = 'test', title, date = today(),
    gnbName = '', screenCount = 0,
    devPass = true, plPass = true,
  } = options;

  const unitList = scenarios[`${prefix}_unit`] || [];
  const integList = scenarios[`${prefix}_integ`] || [];
  const totalTC = unitList.length + integList.length;

  const resultMap = buildResultMap(playwrightResults);
  let pass = 0, fail = 0, skip = 0;

  function statusCell(testName) {
    const r = findResult(resultMap, testName);
    if (!r) { skip++; return '<td style="text-align:center;color:#999">미실행</td>'; }
    if (r.status === 'passed')  { pass++; return '<td style="text-align:center;color:#43a047;font-weight:700">✅ PASS</td>'; }
    if (r.status === 'skipped') { skip++; return '<td style="text-align:center;color:#90a4ae">⏭ SKIP</td>'; }
    fail++;
    const msg = r.error ? `<br><small>${escHtml(r.error.slice(0,80))}</small>` : '';
    return `<td style="text-align:center;color:#e53935;font-weight:700">❌ FAIL${msg}</td>`;
  }

  const unitRows = unitList.map(s => `
    <tr>
      <td class="tc-no">${s.no}</td>
      <td>${crudBadge(s.crudType)}</td>
      <td class="tc-name">${escHtml(s.테스트명)}</td>
      <td class="tc-url">${escHtml(s.URL || '')}</td>
      ${statusCell(`[no:${s.no}] [단위] [${s.crudType}] ${s.테스트명}`)}
    </tr>`).join('');

  const integRows = integList.map(s => `
    <tr>
      <td class="tc-no">${s.no}</td>
      <td>${crudBadge('SELECT')}</td>
      <td class="tc-name">${escHtml(s.테스트명)}</td>
      <td class="tc-url">${escHtml(s.menuPath || '')}</td>
      ${statusCell(`[no:${s.no}] [통합] ${s.테스트명}`)}
    </tr>`).join('');

  const userPass = playwrightResults ? (fail === 0 && pass > 0) : null;

  function passBox(label, state) {
    const colors = { true: '#43a047', false: '#e53935', null: '#90a4ae' };
    const texts  = { true: '통과 ✅', false: '실패 ❌', null: '미실행' };
    return `<div class="summary-box" style="background:${colors[state]}">
      <div class="num" style="font-size:16px">${label}</div>
      <div class="label">${texts[state]}</div>
    </div>`;
  }

  const reportTitle = title || `${prefix.toUpperCase()} 테스트 결과서`;
  const rate = totalTC > 0 ? Math.round(pass / totalTC * 100) : 0;

  return `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8">
<title>${reportTitle}</title>
<style>${baseStyle}
.pass-row { display:flex; gap:12px; margin-bottom:20px; }
.rate-bar { background:#e0e0e0; border-radius:8px; height:10px; margin-top:6px; overflow:hidden; }
.rate-bar-fill { background:#43a047; height:100%; border-radius:8px; width:${rate}%; }
</style>
</head><body>
<div class="header">
  <h1>${reportTitle}</h1>
  <p>${gnbName || prefix} | 생성일: ${date} | 화면: ${screenCount}개 | TC: ${totalTC}건 (단위 ${unitList.length} + 통합 ${integList.length})</p>
  <div class="rate-bar"><div class="rate-bar-fill"></div></div>
</div>
<div class="summary">
  <div class="summary-box" style="background:#1a237e"><div class="num">${totalTC}</div><div class="label">전체 TC</div></div>
  <div class="summary-box" style="background:#43a047"><div class="num">${pass}</div><div class="label">PASS</div></div>
  <div class="summary-box" style="background:#e53935"><div class="num">${fail}</div><div class="label">FAIL</div></div>
  <div class="summary-box" style="background:#90a4ae"><div class="num">${skip}</div><div class="label">SKIP/미실행</div></div>
</div>
<div class="content">
  <div class="section-title">단계별 통과 여부</div>
  <div class="pass-row">
    ${passBox('DEV_PASS', devPass)}
    ${passBox('PL_PASS', plPass)}
    ${passBox('USER_PASS', userPass)}
  </div>
${unitList.length > 0 ? `
  <div class="section-title">단위 테스트 (${unitList.length}건)</div>
  <table>
    <thead><tr><th width="40">No</th><th width="80">유형</th><th>테스트명</th><th>URL</th><th width="90">결과</th></tr></thead>
    <tbody>${unitRows}</tbody>
  </table>` : ''}
${integList.length > 0 ? `
  <div class="section-title">통합 테스트 (${integList.length}건)</div>
  <table>
    <thead><tr><th width="40">No</th><th width="80">유형</th><th>테스트명</th><th>메뉴 경로</th><th width="90">결과</th></tr></thead>
    <tbody>${integRows}</tbody>
  </table>` : ''}
</div>
</body></html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 전체 통합 보고서: 모든 prefix 요약
// summaries = [{ prefix, gnbName, screenCount, unitCount, integCount, totalTC,
//               pass, fail, skip, devPass, plPass, userPass, reportFile }]
// ─────────────────────────────────────────────────────────────────────────────
function generateAllReport(summaries, options = {}) {
  const { date = today(), title = '전체 통합 테스트 결과서' } = options;

  const totals = summaries.reduce((acc, s) => {
    acc.screens += s.screenCount || 0;
    acc.tc      += s.totalTC || 0;
    acc.pass    += s.pass || 0;
    acc.fail    += s.fail || 0;
    acc.skip    += s.skip || 0;
    return acc;
  }, { screens: 0, tc: 0, pass: 0, fail: 0, skip: 0 });

  const rate = totals.tc > 0 ? Math.round(totals.pass / totals.tc * 100) : 0;

  function passIcon(state) {
    if (state === true)  return '<span style="color:#43a047">✅</span>';
    if (state === false) return '<span style="color:#e53935">❌</span>';
    return '<span style="color:#90a4ae">—</span>';
  }

  const prefixRows = summaries.map(s => {
    const link = s.reportFile
      ? `<a href="${escHtml(s.reportFile)}" style="color:#3f51b5">${escHtml(s.reportFile)}</a>`
      : '-';
    return `<tr>
      <td style="font-weight:700">${escHtml(s.prefix.toUpperCase())}</td>
      <td>${escHtml(s.gnbName || '')}</td>
      <td style="text-align:center">${s.screenCount || 0}</td>
      <td style="text-align:center">${s.unitCount || 0}</td>
      <td style="text-align:center">${s.integCount || 0}</td>
      <td style="text-align:center;font-weight:700">${s.totalTC || 0}</td>
      <td style="text-align:center;color:#43a047">${s.pass || 0}</td>
      <td style="text-align:center;color:#e53935">${s.fail || 0}</td>
      <td style="text-align:center;color:#90a4ae">${s.skip || 0}</td>
      <td style="text-align:center">${passIcon(s.devPass)} ${passIcon(s.plPass)} ${passIcon(s.userPass)}</td>
      <td class="tc-url">${link}</td>
    </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8">
<title>${title}</title>
<style>${baseStyle}
.rate-bar { background:#e0e0e0; border-radius:8px; height:10px; margin-top:6px; overflow:hidden; }
.rate-bar-fill { background:#43a047; height:100%; border-radius:8px; width:${rate}%; }
</style>
</head><body>
<div class="header">
  <h1>${title}</h1>
  <p>생성일: ${date} | prefix: ${summaries.length}개 | 총 화면: ${totals.screens}개 | 총 TC: ${totals.tc}건</p>
  <div class="rate-bar"><div class="rate-bar-fill"></div></div>
</div>
<div class="summary">
  <div class="summary-box" style="background:#1a237e"><div class="num">${totals.tc}</div><div class="label">전체 TC</div></div>
  <div class="summary-box" style="background:#43a047"><div class="num">${totals.pass}</div><div class="label">PASS</div></div>
  <div class="summary-box" style="background:#e53935"><div class="num">${totals.fail}</div><div class="label">FAIL</div></div>
  <div class="summary-box" style="background:#90a4ae"><div class="num">${totals.skip}</div><div class="label">SKIP/미실행</div></div>
  <div class="summary-box" style="background:#fb8c00"><div class="num">${rate}%</div><div class="label">통과율</div></div>
</div>
<div class="content">
  <div class="section-title">prefix별 요약</div>
  <table>
    <thead>
      <tr>
        <th>prefix</th><th>모듈명</th><th>화면</th>
        <th>단위TC</th><th>통합TC</th><th>합계TC</th>
        <th>PASS</th><th>FAIL</th><th>SKIP</th>
        <th>DEV/PL/USER</th><th>결과서</th>
      </tr>
    </thead>
    <tbody>${prefixRows}</tbody>
  </table>
</div>
</body></html>`;
}

module.exports = { generatePlanReport, generateResultReport, generateBatchPrefixReport, generateAllReport };
