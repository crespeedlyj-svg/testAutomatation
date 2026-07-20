<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../include/tagHeader.jsp" %>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>테스트 현황 — AI 테스트</title>
<%@ include file="doTest_style.jsp" %>
<link href="<c:url value='/css/eip.css?ver=1'/>" rel="stylesheet" type="text/css">
<style>
/* Nexacro WebBrowser 임베드: 전체 너비 사용, 좌측 여백 없음 */
html, body { width:100%; height:100%; margin:0; padding:0; overflow:auto; }
#wrap { min-height:100%; background:#f4f4f4; }
.contents { padding:16px 20px 40px; box-sizing:border-box; }

.conts_head { padding:10px 0 12px; border-bottom:2px solid #2059a3; margin-bottom:16px; }
.conts_head h2 { font-size:18px; font-weight:700; color:#1a3c72; margin:0; display:inline; }
.badge-ai { display:inline-block; margin-left:10px; padding:2px 8px; font-size:11px; background:#2059a3; color:#fff; border-radius:3px; vertical-align:middle; }
.location { font-size:11px; color:#888; margin-top:4px; display:block; }
.location .now { color:#2059a3; font-weight:600; }

.step-tab-bar { display:flex; margin-bottom:16px; border-bottom:2px solid #2059a3; }
.step-tab-btn { padding:7px 22px; font-size:12px; font-weight:700; color:#666; background:#e8ecf4; border:1px solid #ccc; border-bottom:none; cursor:pointer; margin-right:2px; }
.step-tab-btn.on { background:#fff; color:#2059a3; border-color:#2059a3; }
.step-tab-btn:hover:not(.on) { background:#d6e0f0; }

/* 통계 박스 */
.stat-row { display:flex; gap:10px; margin-bottom:14px; flex-wrap:wrap; }
.stat-box { flex:1; min-width:110px; background:#fff; border:1px solid #c8c8c8; text-align:center; padding:14px 8px; }
.stat-box .num { font-size:26px; font-weight:700; line-height:1.2; }
.stat-box .lbl { font-size:11px; color:#666; margin-top:5px; }
.stat-blue   .num { color:#2059a3; }
.stat-green  .num { color:#2a8a52; }
.stat-teal   .num { color:#0f766e; }
.stat-purple .num { color:#7c3aed; }
.stat-red    .num { color:#b91c1c; }

.stitle-egov { font-size:13px; color:#3f4459; font-weight:700; border-left:3px solid #2059a3; padding:4px 0 4px 10px; margin:14px 0 6px; }

.TBL_srh { width:100%; border-collapse:collapse; border:1px solid #c8c8c8; background:#fff; margin-bottom:4px; }
.TBL_srh th { background:#eef2f8; font-size:12px; font-weight:700; color:#333; padding:7px 10px; text-align:left; border:1px solid #c8c8c8; white-space:nowrap; width:10%; }
.TBL_srh td { font-size:12px; color:#222; padding:5px 10px; border:1px solid #c8c8c8; }
.TBL_srh input[type=text] { height:24px; padding:0 6px; border:1px solid #bbb; font-size:12px; font-family:inherit; width:220px; box-sizing:border-box; }

.TBL_default { width:100%; border-collapse:collapse; border:1px solid #c8c8c8; background:#fff; font-size:12px; }
.TBL_default thead th { background:#d6e0f0; font-weight:700; color:#1a3c72; padding:7px 8px; text-align:center; border:1px solid #c8c8c8; }
.TBL_default tbody td { padding:6px 8px; border:1px solid #ddd; color:#333; }
.TBL_default tbody tr:nth-child(even) { background:#f7f9fc; }
.TBL_default tbody tr:hover { background:#eef2f8; cursor:pointer; }
.al_c { text-align:center; }
.tbl-scroll { max-height:460px; overflow-y:auto; border:1px solid #c8c8c8; }
.tbl-scroll .TBL_default { border:none; }

.top_btn { text-align:right; margin:5px 0 8px; }
.top_btn button { display:inline-block; height:26px; line-height:26px; padding:0 14px; font-size:12px; color:#fff; background:#2059a3; border:none; cursor:pointer; margin-left:3px; font-family:inherit; }
.top_btn .btn_green  { background:#2a8a52; }
.top_btn .btn_gray   { background:#6c7a8a; }
.top_btn button:hover { opacity:.85; }

.result-pass { display:inline-block; font-size:11px; background:#dcfce7; color:#15803d; padding:1px 7px; border-radius:3px; font-weight:600; }
.result-fail { display:inline-block; font-size:11px; background:#fee2e2; color:#b91c1c; padding:1px 7px; border-radius:3px; font-weight:600; }
</style>
</head>
<body>
<div id="wrap">
<div class="contents">

  <!-- 페이지 헤더 -->
  <div class="conts_head">
    <h2>테스트 현황</h2>
    <span class="badge-ai">AI TEST</span>
    <span class="location">AI 테스트 자동화 &gt; <span class="now">테스트 현황</span></span>
  </div>

  <!-- 탭 바 -->
  <div class="step-tab-bar">
    <button class="step-tab-btn on" id="tabSummaryUnit"  onclick="switchSummaryTab('unit')">단위 테스트</button>
    <button class="step-tab-btn"   id="tabSummaryInteg" onclick="switchSummaryTab('integ')">통합 테스트</button>
    <button class="step-tab-btn"   id="tabSummaryRun"   onclick="switchSummaryTab('run')">최근 실행 결과</button>
  </div>

  <!-- ══ 단위 테스트 탭 ══ -->
  <div id="summaryTabUnit">

    <!-- 통계 박스 -->
    <div class="stat-row">
      <div class="stat-box stat-blue">
        <div class="num" id="unitTotal">-</div>
        <div class="lbl">전체 시나리오</div>
      </div>
      <div class="stat-box stat-green">
        <div class="num" id="unitDevPass">-</div>
        <div class="lbl">개발자 통과</div>
      </div>
      <div class="stat-box stat-teal">
        <div class="num" id="unitPlPass">-</div>
        <div class="lbl">PL 통과</div>
      </div>
      <div class="stat-box stat-purple">
        <div class="num" id="unitUserPass">-</div>
        <div class="lbl">사용자 통과</div>
      </div>
      <div class="stat-box stat-red">
        <div class="num" id="unitFail">-</div>
        <div class="lbl">미통과</div>
      </div>
    </div>

    <div class="stitle-egov">시나리오별 통과 현황</div>
    <table class="TBL_srh">
      <tr>
        <th>검색</th>
        <td>
          <input type="text" id="unitSearchInput" placeholder="시나리오ID / 화면명 / 테스트명" oninput="filterUnitGrid()">
        </td>
        <td></td>
      </tr>
    </table>
    <div class="top_btn">
      <button onclick="loadUnitSummary()">조회</button>
    </div>
    <div class="tbl-scroll">
      <table class="TBL_default" id="unitSummaryTable">
        <thead>
          <tr>
            <th style="width:44px">No</th>
            <th style="width:140px">시나리오ID</th>
            <th>화면명</th>
            <th>테스트명</th>
            <th style="width:76px">개발자</th>
            <th style="width:76px">PL</th>
            <th style="width:76px">사용자</th>
            <th style="width:100px">최종 통과일</th>
            <th style="width:80px">비고</th>
          </tr>
        </thead>
        <tbody id="unitSummaryBody">
          <tr><td colspan="9" class="al_c" style="padding:24px;color:#aaa">조회 버튼을 눌러 현황을 불러오세요.</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ══ 통합 테스트 탭 ══ -->
  <div id="summaryTabInteg" style="display:none">

    <!-- 통계 박스 -->
    <div class="stat-row">
      <div class="stat-box stat-blue">
        <div class="num" id="integTotal">-</div>
        <div class="lbl">전체 시나리오</div>
      </div>
      <div class="stat-box stat-green">
        <div class="num" id="integDevPass">-</div>
        <div class="lbl">개발자 통과</div>
      </div>
      <div class="stat-box stat-teal">
        <div class="num" id="integPlPass">-</div>
        <div class="lbl">PL 통과</div>
      </div>
      <div class="stat-box stat-purple">
        <div class="num" id="integUserPass">-</div>
        <div class="lbl">사용자 통과</div>
      </div>
      <div class="stat-box stat-red">
        <div class="num" id="integFail">-</div>
        <div class="lbl">미통과</div>
      </div>
    </div>

    <div class="stitle-egov">시나리오별 통과 현황</div>
    <table class="TBL_srh">
      <tr>
        <th>검색</th>
        <td>
          <input type="text" id="integSearchInput" placeholder="시나리오ID / 화면명 / 테스트명" oninput="filterIntegGrid()">
        </td>
        <td></td>
      </tr>
    </table>
    <div class="top_btn">
      <button onclick="loadIntegSummary()">조회</button>
    </div>
    <div class="tbl-scroll">
      <table class="TBL_default" id="integSummaryTable">
        <thead>
          <tr>
            <th style="width:44px">No</th>
            <th style="width:140px">시나리오ID</th>
            <th>화면명</th>
            <th>테스트명</th>
            <th style="width:76px">개발자</th>
            <th style="width:76px">PL</th>
            <th style="width:76px">사용자</th>
            <th style="width:100px">최종 통과일</th>
            <th style="width:80px">비고</th>
          </tr>
        </thead>
        <tbody id="integSummaryBody">
          <tr><td colspan="9" class="al_c" style="padding:24px;color:#aaa">조회 버튼을 눌러 현황을 불러오세요.</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ══ 최근 실행 결과 탭 (_workspace 기반) ══ -->
  <div id="summaryTabRun" style="display:none">
    <div class="stat-row">
      <div class="stat-box stat-blue">
        <div class="num" id="runTotalRuns">-</div>
        <div class="lbl">총 실행 수</div>
      </div>
      <div class="stat-box stat-green">
        <div class="num" id="runTotalPass">-</div>
        <div class="lbl">누적 PASS</div>
      </div>
      <div class="stat-box stat-red">
        <div class="num" id="runTotalFail">-</div>
        <div class="lbl">누적 FAIL</div>
      </div>
    </div>

    <div class="stitle-egov">prefix별 최근 실행 결과 (<code>_workspace/</code>)</div>
    <div class="top_btn">
      <button onclick="loadWorkspaceRuns()">조회</button>
    </div>
    <div class="tbl-scroll">
      <table class="TBL_default" id="runSummaryTable">
        <thead>
          <tr>
            <th style="width:44px">No</th>
            <th style="width:180px">Prefix</th>
            <th style="width:160px">마지막 실행일시</th>
            <th style="width:70px">전체</th>
            <th style="width:70px">PASS</th>
            <th style="width:70px">FAIL</th>
            <th style="width:80px">통과율</th>
            <th style="width:60px">오류</th>
          </tr>
        </thead>
        <tbody id="runSummaryBody">
          <tr><td colspan="8" class="al_c" style="padding:24px;color:#aaa">조회 버튼을 눌러 실행 결과를 불러오세요.</td></tr>
        </tbody>
      </table>
    </div>
  </div>

</div><!-- /contents -->
</div><!-- /wrap -->

<script>
function switchSummaryTab(tab) {
  document.getElementById('summaryTabUnit').style.display  = (tab === 'unit')  ? '' : 'none';
  document.getElementById('summaryTabInteg').style.display = (tab === 'integ') ? '' : 'none';
  document.getElementById('summaryTabRun').style.display   = (tab === 'run')   ? '' : 'none';
  document.getElementById('tabSummaryUnit').classList.toggle('on',  tab === 'unit');
  document.getElementById('tabSummaryInteg').classList.toggle('on', tab === 'integ');
  document.getElementById('tabSummaryRun').classList.toggle('on',   tab === 'run');
  if (tab === 'run') loadWorkspaceRuns();
}

function renderPassBadge(v) {
  if (v === 'Y') return '<span class="result-pass">통과</span>';
  if (v === 'N') return '<span class="result-fail">미통과</span>';
  return '<span style="color:#9ca3af;font-size:11px">미진행</span>';
}

function updatePassSummary(scenarioId, testType, passLevel, btnEl) {
  btnEl.disabled = true;
  fetch('<c:url value="/ai/updatePassStatus.do"/>', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'scenarioId=' + encodeURIComponent(scenarioId)
        + '&testType='  + encodeURIComponent(testType)
        + '&passLevel=' + encodeURIComponent(passLevel)
        + '&passYn=Y'
  }).then(function(r){ return r.json(); })
    .then(function(d) {
      if (d.ok) {
        if (testType === 'unit') loadUnitSummary();
        else loadIntegSummary();
      } else {
        alert(d.msg || '오류가 발생했습니다.');
        btnEl.disabled = false;
      }
    })
    .catch(function() { btnEl.disabled = false; });
}

function renderSummaryRows(tbody, rows, testType) {
  if (!rows || rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="al_c" style="padding:24px;color:#aaa">데이터가 없습니다.</td></tr>';
    return;
  }
  tbody.innerHTML = rows.map(function(r, i) {
    var sid = (r.scenarioId || '').replace(/'/g, "\\'");

    var plCell;
    if (r.plPass === 'Y') {
      plCell = '<td class="al_c">' + renderPassBadge('Y') + '</td>';
    } else if (r.devPass === 'Y') {
      plCell = '<td class="al_c">'
        + '<button style="height:22px;padding:0 8px;font-size:11px;background:#2a8a52;color:#fff;border:none;cursor:pointer;font-family:inherit"'
        + ' onclick="updatePassSummary(\'' + sid + '\',\'' + testType + '\',\'PL\',this)">PL 통과</button>'
        + '</td>';
    } else {
      plCell = '<td class="al_c"><span style="color:#9ca3af">-</span></td>';
    }

    var userCell;
    if (r.userPass === 'Y') {
      userCell = '<td class="al_c">' + renderPassBadge('Y') + '</td>';
    } else if (r.plPass === 'Y') {
      userCell = '<td class="al_c">'
        + '<button style="height:22px;padding:0 8px;font-size:11px;background:#2059a3;color:#fff;border:none;cursor:pointer;font-family:inherit"'
        + ' onclick="updatePassSummary(\'' + sid + '\',\'' + testType + '\',\'USER\',this)">사용자 통과</button>'
        + '</td>';
    } else {
      userCell = '<td class="al_c"><span style="color:#9ca3af">-</span></td>';
    }

    return '<tr ondblclick="showSummaryDetail(' + JSON.stringify(JSON.stringify(r)) + ')">'
      + '<td class="al_c">' + (i+1) + '</td>'
      + '<td style="font-family:monospace;font-size:11px">' + (r.scenarioId||'') + '</td>'
      + '<td>' + (r.screenName||'') + '</td>'
      + '<td>' + (r.testName||'') + '</td>'
      + '<td class="al_c">' + renderPassBadge(r.devPass) + '</td>'
      + plCell
      + userCell
      + '<td class="al_c" style="font-size:11px;color:#888">' + (r.lastPassDate||'') + '</td>'
      + '<td style="font-size:11px;color:#888">' + (r.remark||'') + '</td>'
      + '</tr>';
  }).join('');
}

function loadUnitSummary() {
  fetch('<c:url value="/ai/getTestSummary.do"/>?testType=unit')
    .then(function(r){ return r.json(); })
    .then(function(d) {
      document.getElementById('unitTotal').textContent    = d.total    || 0;
      document.getElementById('unitDevPass').textContent  = d.devPass  || 0;
      document.getElementById('unitPlPass').textContent   = d.plPass   || 0;
      document.getElementById('unitUserPass').textContent = d.userPass || 0;
      document.getElementById('unitFail').textContent     = d.fail     || 0;
      window._unitRows = d.rows || [];
      renderSummaryRows(document.getElementById('unitSummaryBody'), window._unitRows, 'unit');
    }).catch(function(e){ console.error(e); });
}

function loadIntegSummary() {
  fetch('<c:url value="/ai/getTestSummary.do"/>?testType=integ')
    .then(function(r){ return r.json(); })
    .then(function(d) {
      document.getElementById('integTotal').textContent    = d.total    || 0;
      document.getElementById('integDevPass').textContent  = d.devPass  || 0;
      document.getElementById('integPlPass').textContent   = d.plPass   || 0;
      document.getElementById('integUserPass').textContent = d.userPass || 0;
      document.getElementById('integFail').textContent     = d.fail     || 0;
      window._integRows = d.rows || [];
      renderSummaryRows(document.getElementById('integSummaryBody'), window._integRows, 'integ');
    }).catch(function(e){ console.error(e); });
}

function filterUnitGrid() {
  var kw = document.getElementById('unitSearchInput').value.toLowerCase();
  var rows = (window._unitRows || []).filter(function(r) {
    return (r.scenarioId||'').toLowerCase().includes(kw)
        || (r.screenName||'').toLowerCase().includes(kw)
        || (r.testName||'').toLowerCase().includes(kw);
  });
  renderSummaryRows(document.getElementById('unitSummaryBody'), rows, 'unit');
}

function filterIntegGrid() {
  var kw = document.getElementById('integSearchInput').value.toLowerCase();
  var rows = (window._integRows || []).filter(function(r) {
    return (r.scenarioId||'').toLowerCase().includes(kw)
        || (r.screenName||'').toLowerCase().includes(kw)
        || (r.testName||'').toLowerCase().includes(kw);
  });
  renderSummaryRows(document.getElementById('integSummaryBody'), rows, 'integ');
}

function showSummaryDetail(jsonStr) {
  var r = JSON.parse(jsonStr);
  document.getElementById('sdScenarioId').textContent = r.scenarioId  || '-';
  document.getElementById('sdTestType').textContent   = r.testType    || '-';
  document.getElementById('sdScreenName').textContent = r.screenName  || '-';
  document.getElementById('sdTestName').textContent   = r.testName    || '-';
  document.getElementById('sdDevPass').innerHTML      = renderPassBadge(r.devPass);
  document.getElementById('sdPlPass').innerHTML       = renderPassBadge(r.plPass);
  document.getElementById('sdUserPass').innerHTML     = renderPassBadge(r.userPass);
  document.getElementById('sdLastDate').textContent   = r.lastPassDate || '-';
  document.getElementById('sdRemark').textContent     = r.remark       || '';
  document.getElementById('summaryDetailModal').style.display = 'flex';
}
function closeSummaryDetail() { document.getElementById('summaryDetailModal').style.display = 'none'; }

function loadWorkspaceRuns() {
  fetch('<c:url value="/ai/getWorkspaceRuns.do"/>')
    .then(function(r){ return r.json(); })
    .then(function(d) {
      var runs = d.runs || [];
      var totalPass = 0, totalFail = 0;
      runs.forEach(function(r) { totalPass += (r.pass||0); totalFail += (r.fail||0); });
      document.getElementById('runTotalRuns').textContent = runs.length;
      document.getElementById('runTotalPass').textContent = totalPass;
      document.getElementById('runTotalFail').textContent = totalFail;

      var tbody = document.getElementById('runSummaryBody');
      if (!runs.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="al_c" style="padding:24px;color:#aaa">실행 결과 없음 (_workspace/ 디렉터리가 비어있거나 없습니다)</td></tr>';
        return;
      }
      tbody.innerHTML = runs.map(function(r, i) {
        var total = r.total || 0;
        var pct   = total > 0 ? Math.round((r.pass||0) * 100 / total) + '%' : '-';
        var errCell = r.hasError
          ? '<span style="color:#b91c1c;font-weight:700">오류</span>'
          : '<span style="color:#15803d">-</span>';
        var passCell = (r.pass||0) > 0
          ? '<span class="result-pass">' + r.pass + '</span>'
          : '<span style="color:#9ca3af">0</span>';
        var failCell = (r.fail||0) > 0
          ? '<span class="result-fail">' + r.fail + '</span>'
          : '<span style="color:#9ca3af">0</span>';
        return '<tr>'
          + '<td class="al_c">' + (i+1) + '</td>'
          + '<td style="font-family:monospace;font-size:12px">' + (r.prefix||'') + '</td>'
          + '<td class="al_c" style="font-size:11px;color:#555">' + (r.lastModified||'') + '</td>'
          + '<td class="al_c">' + (r.total||0) + '</td>'
          + '<td class="al_c">' + passCell + '</td>'
          + '<td class="al_c">' + failCell + '</td>'
          + '<td class="al_c">' + pct + '</td>'
          + '<td class="al_c">' + errCell + '</td>'
          + '</tr>';
      }).join('');
    }).catch(function(e){ console.error('loadWorkspaceRuns 오류:', e); });
}

loadUnitSummary();
</script>

<!-- 상세 모달 -->
<div id="summaryDetailModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9000;align-items:center;justify-content:center">
  <div style="background:#fff;width:580px;max-width:95vw;box-shadow:0 8px 32px rgba(0,0,0,.3);border:1px solid #999">
    <div style="display:flex;align-items:center;padding:9px 14px;border-bottom:2px solid #2059a3;background:#eef2f8">
      <span style="font-weight:700;font-size:13px;color:#1a3c72">통과 현황 상세</span>
      <button onclick="closeSummaryDetail()" style="margin-left:auto;border:none;background:none;font-size:18px;cursor:pointer;color:#666;line-height:1">✕</button>
    </div>
    <div style="padding:14px">
      <table class="TBL_default">
        <colgroup><col style="width:140px"><col></colgroup>
        <tbody>
          <tr><td class="al_c" style="background:#eef2f8;font-weight:700;color:#333;border:1px solid #c8c8c8">시나리오 ID</td>
              <td style="font-family:monospace;border:1px solid #ddd;padding:6px 8px" id="sdScenarioId"></td></tr>
          <tr><td class="al_c" style="background:#eef2f8;font-weight:700;color:#333;border:1px solid #c8c8c8">테스트 유형</td>
              <td style="border:1px solid #ddd;padding:6px 8px" id="sdTestType"></td></tr>
          <tr><td class="al_c" style="background:#eef2f8;font-weight:700;color:#333;border:1px solid #c8c8c8">화면명</td>
              <td style="border:1px solid #ddd;padding:6px 8px" id="sdScreenName"></td></tr>
          <tr><td class="al_c" style="background:#eef2f8;font-weight:700;color:#333;border:1px solid #c8c8c8">테스트명</td>
              <td style="border:1px solid #ddd;padding:6px 8px" id="sdTestName"></td></tr>
          <tr><td class="al_c" style="background:#eef2f8;font-weight:700;color:#333;border:1px solid #c8c8c8">개발자 통과</td>
              <td class="al_c" style="border:1px solid #ddd;padding:6px 8px" id="sdDevPass"></td></tr>
          <tr><td class="al_c" style="background:#eef2f8;font-weight:700;color:#333;border:1px solid #c8c8c8">PL 통과</td>
              <td class="al_c" style="border:1px solid #ddd;padding:6px 8px" id="sdPlPass"></td></tr>
          <tr><td class="al_c" style="background:#eef2f8;font-weight:700;color:#333;border:1px solid #c8c8c8">사용자 통과</td>
              <td class="al_c" style="border:1px solid #ddd;padding:6px 8px" id="sdUserPass"></td></tr>
          <tr><td class="al_c" style="background:#eef2f8;font-weight:700;color:#333;border:1px solid #c8c8c8">최종 통과일</td>
              <td style="font-size:11px;color:#888;border:1px solid #ddd;padding:6px 8px" id="sdLastDate"></td></tr>
          <tr><td class="al_c" style="background:#eef2f8;font-weight:700;color:#333;border:1px solid #c8c8c8">비고</td>
              <td style="color:#666;border:1px solid #ddd;padding:6px 8px" id="sdRemark"></td></tr>
        </tbody>
      </table>
    </div>
    <div style="padding:8px 14px;border-top:1px solid #e5e7eb;text-align:right">
      <button onclick="closeSummaryDetail()" style="height:26px;line-height:26px;padding:0 14px;font-size:12px;background:#2059a3;color:#fff;border:none;cursor:pointer;font-family:inherit">닫기</button>
    </div>
  </div>
</div>
</body>
</html>
