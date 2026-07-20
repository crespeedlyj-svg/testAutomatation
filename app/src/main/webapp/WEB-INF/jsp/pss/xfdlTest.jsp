<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../include/tagHeader.jsp" %>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>XFDL 테스트 자동화</title>
<link href="<c:url value='/css/eip.css?ver=1'/>" rel="stylesheet" type="text/css">
<style>
/* ── eGovFrame 그리드 공통 (eip.css 미정의 보완) ── */
#wrap { min-height:100vh; background:#f4f4f4; }
#container { display:flex; }
.contents { flex:1; min-width:0; padding:20px 24px 40px; }

.conts_head { padding:10px 0 12px; border-bottom:2px solid #2059a3; margin-bottom:16px; }
.conts_head h2 { font-size:18px; font-weight:700; color:#1a3c72; margin:0; }
.conts_head .location { font-size:11px; color:#888; margin-top:3px; display:block; }
.conts_head .location .now { color:#2059a3; font-weight:600; }

.stitle { font-size:13px; color:#3f4459; font-weight:700;
          border-left:3px solid #2059a3; padding:4px 0 4px 10px; margin:16px 0 6px; }

/* 검색 조건 테이블 */
.TBL_srh { width:100%; border-collapse:collapse; border:1px solid #c8c8c8;
           background:#fff; margin-bottom:4px; }
.TBL_srh th { background:#eef2f8; font-size:12px; font-weight:700; color:#333;
              padding:7px 10px; text-align:left; border:1px solid #c8c8c8;
              white-space:nowrap; width:12%; }
.TBL_srh td { font-size:12px; color:#222; padding:5px 8px; border:1px solid #c8c8c8; }
.TBL_srh input[type=text], .TBL_srh input[type=file], .TBL_srh select {
  height:24px; padding:0 6px; border:1px solid #bbb; font-size:12px; font-family:inherit;
  width:100%; box-sizing:border-box; }
.TBL_srh input[type=file] { padding:2px 4px; height:auto; }

/* 그리드 테이블 */
.TBL_default { width:100%; border-collapse:collapse; border:1px solid #c8c8c8;
               background:#fff; font-size:12px; }
.TBL_default thead th { background:#d6e0f0; font-weight:700; color:#1a3c72;
                         padding:7px 8px; text-align:center; border:1px solid #c8c8c8; }
.TBL_default tbody td { padding:6px 8px; border:1px solid #ddd; color:#333; }
.TBL_default tbody tr:nth-child(even) { background:#f7f9fc; }
.TBL_default tbody tr:hover { background:#eef2f8; }
.TBL_default .al_c { text-align:center; }
.TBL_default .al_r { text-align:right; }
.TBL_default .no-data { text-align:center; color:#888; padding:20px; }

/* 버튼 영역 */
.top_btn { text-align:right; margin:6px 0; }
.top_btn a, .top_btn button {
  display:inline-block; height:26px; line-height:26px; padding:0 14px;
  font-size:12px; color:#fff; background:#2059a3; border:none; cursor:pointer;
  margin-left:3px; text-decoration:none; font-family:inherit; }
.top_btn .btn_green  { background:#2a8a52; }
.top_btn .btn_orange { background:#d26c00; }
.top_btn .btn_gray   { background:#6c7a8a; }
.top_btn a:hover, .top_btn button:hover { opacity:.85; }

/* TC 요약 박스 */
.tc_summary { display:flex; gap:8px; margin:8px 0; }
.tc_box { flex:1; padding:10px; background:#fff; border:1px solid #c8c8c8; text-align:center; }
.tc_box .tc_num { font-size:22px; font-weight:700; color:#2059a3; }
.tc_box .tc_lbl { font-size:11px; color:#666; margin-top:2px; }

/* 다운로드 버튼 */
.dl_list { margin:6px 0; }
.dl_list a { display:inline-block; padding:5px 12px; margin-right:6px; margin-bottom:4px;
             border:1px solid #aac; background:#f0f4fb; font-size:12px; color:#1a3c72;
             text-decoration:none; font-weight:600; }
.dl_list a:hover { background:#d6e0f0; }

/* 실행 결과 로그 */
.run_log { background:#1e2a35; color:#a8d8a8; font-family:monospace; font-size:11px;
           padding:10px 12px; max-height:180px; overflow:auto; white-space:pre-wrap;
           border:1px solid #c8c8c8; margin-top:6px; }

/* 알림 */
.msg_ok  { background:#e6f4ea; border:1px solid #66bb6a; color:#2e7d32;
           padding:7px 12px; font-size:12px; font-weight:700; margin:6px 0; }
.msg_err { background:#fdecea; border:1px solid #ef9a9a; color:#b71c1c;
           padding:7px 12px; font-size:12px; font-weight:700; margin:6px 0; }
.msg_ing { background:#e3f2fd; border:1px solid #90caf9; color:#1565c0;
           padding:7px 12px; font-size:12px; margin:6px 0; }

/* 탭 */
.tab_list { border-bottom:2px solid #2059a3; margin-bottom:0; padding:0; }
.tab_list li { display:inline-block; }
.tab_list li a { display:block; padding:6px 18px; font-size:12px; font-weight:700;
                 color:#666; background:#e8ecf4; border:1px solid #ccc;
                 border-bottom:none; text-decoration:none; }
.tab_list li.on a { background:#fff; color:#2059a3; border-color:#2059a3; }
</style>
</head>
<body>
<input type="hidden" id="nodeUrl" value="${nodeUrl}">

<div id="wrap">
  <div id="container">
    <div class="contents">

      <!-- 타이틀 -->
      <div class="conts_head">
        <h2>XFDL 테스트 자동화</h2>
        <span class="location">HOME &gt; PSS &gt; <span class="now">XFDL 테스트 자동화</span></span>
      </div>

      <!-- ── STEP 1: XFDL 파일 업로드 ── -->
      <h3 class="stitle">STEP 1. XFDL 파일 업로드 및 분석</h3>
      <table class="TBL_srh">
        <caption>파일 업로드</caption>
        <colgroup><col style="width:12%"><col></colgroup>
        <tbody>
          <tr>
            <th>XFDL 파일</th>
            <td>
              <input type="file" id="fileInput" accept=".xfdl" multiple>
              <span style="font-size:11px;color:#888;margin-left:8px">여러 파일 동시 선택 가능 (.xfdl)</span>
            </td>
          </tr>
          <tr>
            <th>GNB 메뉴명</th>
            <td><input type="text" id="gnbName" placeholder="예: 구매관리" style="width:240px"></td>
          </tr>
          <tr>
            <th>화면 메뉴명</th>
            <td><input type="text" id="menuName" placeholder="예: 직접구매신청현황" style="width:240px"></td>
          </tr>
        </tbody>
      </table>
      <div class="top_btn">
        <button id="btnAnalyze">분석 시작</button>
      </div>
      <div id="msgAnalyze"></div>

      <!-- ── STEP 2: 분석 결과 ── -->
      <div id="sec-parsed" style="display:none">
        <h3 class="stitle">STEP 2. 분석 결과</h3>
        <table class="TBL_default" id="tblParsed">
          <thead>
            <tr>
              <th width="40">No</th>
              <th>파일명</th>
              <th>화면명</th>
              <th width="80">트랜잭션</th>
              <th width="80">데이터셋</th>
              <th width="70">버튼</th>
              <th width="70">그리드</th>
            </tr>
          </thead>
          <tbody id="tblParsedBody">
            <tr><td colspan="7" class="no-data">분석 결과 없음</td></tr>
          </tbody>
        </table>
        <div class="top_btn" style="margin-top:10px">
          <button id="btnGenerate" class="btn_green">시나리오 · spec.ts · 계획서 생성</button>
        </div>
        <div id="msgGenerate"></div>
      </div>

      <!-- ── STEP 3: 생성 결과 ── -->
      <div id="sec-result" style="display:none">
        <h3 class="stitle">STEP 3. 생성 결과</h3>
        <div class="tc_summary" id="tcSummary"></div>
        <div class="dl_list" id="dlList"></div>

        <!-- Playwright 실행 -->
        <h3 class="stitle">STEP 4. Playwright 테스트 실행</h3>
        <table class="TBL_srh">
          <colgroup><col style="width:12%"><col></colgroup>
          <tbody>
            <tr>
              <th>실행 범위</th>
              <td>
                <select id="runScope" style="width:200px">
                  <option value="all">단위 + 통합 테스트</option>
                  <option value="unit">단위 테스트만</option>
                  <option value="integration">통합 테스트만</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="top_btn">
          <button id="btnRun" class="btn_orange">Playwright 실행 + 결과보고서 생성</button>
        </div>
        <div id="msgRun"></div>
        <div id="runLog" style="display:none" class="run_log"></div>
      </div>

      <!-- ── STEP 5: 시나리오 미리보기 ── -->
      <div id="sec-preview" style="display:none">
        <h3 class="stitle">STEP 5. 시나리오 미리보기</h3>
        <ul class="tab_list">
          <li id="tab-unit" class="on"><a href="#" onclick="switchTab('unit');return false;">단위 테스트</a></li>
          <li id="tab-integ"><a href="#" onclick="switchTab('integ');return false;">통합 테스트</a></li>
        </ul>
        <div id="scenUnit">
          <table class="TBL_default" id="tblUnit">
            <thead>
              <tr>
                <th width="44">No</th><th width="70">유형</th>
                <th>테스트명</th><th>사전조건</th><th>기대결과</th>
                <th width="130">시나리오ID</th>
              </tr>
            </thead>
            <tbody id="tblUnitBody"><tr><td colspan="6" class="no-data">없음</td></tr></tbody>
          </table>
        </div>
        <div id="scenInteg" style="display:none">
          <table class="TBL_default" id="tblInteg">
            <thead>
              <tr>
                <th width="44">No</th><th width="70">유형</th>
                <th>테스트명</th><th>사전조건</th><th>기대결과</th>
                <th width="130">시나리오ID</th>
              </tr>
            </thead>
            <tbody id="tblIntegBody"><tr><td colspan="6" class="no-data">없음</td></tr></tbody>
          </table>
        </div>
      </div>

    </div><!-- /contents -->
  </div><!-- /container -->
</div><!-- /wrap -->

<script>
(function() {
  'use strict';

  var NODE_URL    = document.getElementById('nodeUrl').value || 'http://localhost:8090';
  var uploadedFiles = [];
  var parsedSources = [];
  var generateData  = null;

  // ── 버튼 이벤트 ──
  document.getElementById('btnAnalyze').addEventListener('click', doAnalyze);
  document.getElementById('btnGenerate').addEventListener('click', doGenerate);
  document.getElementById('btnRun').addEventListener('click', doRun);

  // ── 분석 ──
  function doAnalyze() {
    var fi = document.getElementById('fileInput');
    if (!fi.files || !fi.files.length) {
      showMsg('msgAnalyze', 'XFDL 파일을 선택해 주세요.', 'err'); return;
    }
    uploadedFiles = Array.from(fi.files).filter(function(f) {
      return f.name.toLowerCase().endsWith('.xfdl');
    });
    if (!uploadedFiles.length) {
      showMsg('msgAnalyze', '.xfdl 파일만 업로드할 수 있습니다.', 'err'); return;
    }

    showMsg('msgAnalyze', '분석 중...', 'ing');
    var fd = new FormData();
    uploadedFiles.forEach(function(f) { fd.append('files', f); });

    fetch(NODE_URL + '/api/analyze', { method: 'POST', body: fd })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.success) throw new Error(d.error);
        parsedSources = d.sources;
        renderParsed(d.sources);
        showMsg('msgAnalyze', parsedSources.length + '개 파일 분석 완료.', 'ok');
        document.getElementById('sec-parsed').style.display = '';
        scroll('sec-parsed');
      })
      .catch(function(e) { showMsg('msgAnalyze', '분석 실패: ' + e.message, 'err'); });
  }

  function renderParsed(sources) {
    var tbody = document.getElementById('tblParsedBody');
    if (!sources || !sources.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="no-data">없음</td></tr>'; return;
    }
    tbody.innerHTML = sources.map(function(s, i) {
      return '<tr>' +
        '<td class="al_c">' + (i+1) + '</td>' +
        '<td>' + esc(s.sourceName) + '</td>' +
        '<td>' + esc(s.screenTitle || '-') + '</td>' +
        '<td class="al_c">' + (s.transactions ? s.transactions.length : 0) + '</td>' +
        '<td class="al_c">' + (s.datasets ? Object.keys(s.datasets).length : 0) + '</td>' +
        '<td class="al_c">' + ((s.buttons||[]).length) + '</td>' +
        '<td class="al_c">' + (s.hasGrid ? 'Y' : 'N') + '</td>' +
        '</tr>';
    }).join('');
  }

  // ── 생성 ──
  function doGenerate() {
    if (!parsedSources.length) return;
    showMsg('msgGenerate', '생성 중...', 'ing');

    fetch(NODE_URL + '/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sources: parsedSources,
        options: {
          gnbName:  document.getElementById('gnbName').value.trim(),
          menuName: document.getElementById('menuName').value.trim()
        }
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (!d.success) throw new Error(d.error);
      generateData = d;
      renderResult(d);
      renderPreview(d.scenarios, d.prefix);
      showMsg('msgGenerate', '생성 완료. 파일이 프로젝트에 저장되었습니다.', 'ok');
      document.getElementById('sec-result').style.display = '';
      document.getElementById('sec-preview').style.display = '';
      scroll('sec-result');
    })
    .catch(function(e) { showMsg('msgGenerate', '생성 실패: ' + e.message, 'err'); });
  }

  function renderResult(d) {
    var total = (d.unitCount||0) + (d.integCount||0);
    document.getElementById('tcSummary').innerHTML =
      tcBox(total, '전체 TC') +
      tcBox(d.unitCount, '단위 TC') +
      tcBox(d.integCount, '통합 TC');

    var links = [];
    if (d.unitFileName)   links.push({ dir:'unit',        name:d.unitFileName,   lbl:'단위 spec.ts' });
    if (d.integFileName)  links.push({ dir:'integration', name:d.integFileName,  lbl:'통합 spec.ts' });
    if (d.planReportName) links.push({ dir:'results',     name:d.planReportName, lbl:'테스트 계획서' });
    document.getElementById('dlList').innerHTML = links.map(function(l) {
      return '<a href="' + NODE_URL + '/api/download/' + l.dir + '/' + encodeURIComponent(l.name) +
             '" target="_blank">[다운로드] ' + esc(l.lbl) + '</a>';
    }).join('');
  }

  function tcBox(n, lbl) {
    return '<div class="tc_box"><div class="tc_num">' + (n||0) + '</div>' +
           '<div class="tc_lbl">' + lbl + '</div></div>';
  }

  // ── 실행 ──
  function doRun() {
    if (!generateData) return;
    showMsg('msgRun', 'Playwright 실행 중... 잠시 기다려 주세요.', 'ing');
    document.getElementById('runLog').style.display = 'none';

    fetch(NODE_URL + '/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unitFileName:  generateData.unitFileName,
        integFileName: generateData.integFileName,
        prefix:        generateData.prefix,
        date:          generateData.date,
        scope:         document.getElementById('runScope').value
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (!d.success) throw new Error(d.error);
      var ok = (d.exitCode === 0);
      showMsg('msgRun', ok ? '테스트 성공 (exit 0)' : '일부 테스트 실패 (exit ' + d.exitCode + ')', ok ? 'ok' : 'err');
      if (d.reportName) {
        document.getElementById('dlList').insertAdjacentHTML('beforeend',
          '<a href="' + NODE_URL + '/api/download/results/' + encodeURIComponent(d.reportName) +
          '" target="_blank">[다운로드] 결과보고서</a>');
      }
      if (d.stderr && d.stderr.trim()) {
        var log = document.getElementById('runLog');
        log.textContent = d.stderr;
        log.style.display = '';
      }
    })
    .catch(function(e) { showMsg('msgRun', '실행 오류: ' + e.message, 'err'); });
  }

  // ── 시나리오 미리보기 ──
  var CRUD_LABEL = { SELECT:'조회', INSERT:'등록', UPDATE:'수정', DELETE:'삭제' };

  function renderPreview(scenarios, prefix) {
    if (!scenarios) return;
    var unitList  = scenarios[prefix + '_unit']  || [];
    var integList = scenarios[prefix + '_integ'] || [];

    var utab = document.getElementById('tab-unit').querySelector('a');
    utab.textContent = '단위 테스트 (' + unitList.length + ')';
    var itab = document.getElementById('tab-integ').querySelector('a');
    itab.textContent = '통합 테스트 (' + integList.length + ')';

    document.getElementById('tblUnitBody').innerHTML  = buildRows(unitList,  false);
    document.getElementById('tblIntegBody').innerHTML = buildRows(integList, true);
  }

  function buildRows(list, isInteg) {
    if (!list.length) return '<tr><td colspan="6" class="no-data">없음</td></tr>';
    return list.map(function(s) {
      return '<tr>' +
        '<td class="al_c">' + s.no + '</td>' +
        '<td class="al_c">' + esc(isInteg ? '통합' : (CRUD_LABEL[s.crudType] || s.crudType || '')) + '</td>' +
        '<td>' + esc(s['테스트명'] || '') + '</td>' +
        '<td style="color:#666;font-size:11px">' + esc(s['사전조건'] || '') + '</td>' +
        '<td style="color:#666;font-size:11px">' + esc(s.expectedResult || '') + '</td>' +
        '<td class="al_c" style="font-size:11px;color:#888">' + esc(s.scenarioId || '') + '</td>' +
        '</tr>';
    }).join('');
  }

  window.switchTab = function(tab) {
    document.getElementById('scenUnit').style.display  = tab === 'unit'  ? '' : 'none';
    document.getElementById('scenInteg').style.display = tab === 'integ' ? '' : 'none';
    document.getElementById('tab-unit').className  = tab === 'unit'  ? 'on' : '';
    document.getElementById('tab-integ').className = tab === 'integ' ? 'on' : '';
  };

  // ── 유틸 ──
  function showMsg(id, msg, type) {
    var cls = type === 'ok' ? 'msg_ok' : type === 'ing' ? 'msg_ing' : 'msg_err';
    document.getElementById(id).innerHTML = '<div class="' + cls + '">' + esc(msg) + '</div>';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function scroll(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  }
})();
</script>

</body>
</html>
