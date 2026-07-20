<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../include/tagHeader.jsp" %>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>로그 조회 — AI 테스트</title>
<%@ include file="doTest_style.jsp" %>
<link href="<c:url value='/css/eip.css?ver=1'/>" rel="stylesheet" type="text/css">
<style>
#wrap     { min-height:100vh; background:#f4f4f4; }
.contents { padding:20px 24px 40px; }

.conts_head { padding:10px 0 12px; border-bottom:2px solid #2059a3; margin-bottom:16px; }
.conts_head h2 { font-size:18px; font-weight:700; color:#1a3c72; margin:0; display:inline; }
.badge-ai { display:inline-block; margin-left:10px; padding:2px 8px; font-size:11px; background:#2059a3; color:#fff; border-radius:3px; vertical-align:middle; }
.location { font-size:11px; color:#888; margin-top:4px; display:block; }
.location .now { color:#2059a3; font-weight:600; }

.step-tab-bar { display:flex; margin-bottom:14px; border-bottom:2px solid #2059a3; }
.step-tab-btn { padding:7px 22px; font-size:12px; font-weight:700; color:#666; background:#e8ecf4; border:1px solid #ccc; border-bottom:none; cursor:pointer; margin-right:2px; }
.step-tab-btn.on { background:#fff; color:#2059a3; border-color:#2059a3; }
.step-tab-btn:hover:not(.on) { background:#d6e0f0; }

.stitle-egov { font-size:13px; color:#3f4459; font-weight:700; border-left:3px solid #2059a3; padding:4px 0 4px 10px; margin:14px 0 6px; display:flex; align-items:center; gap:8px; }

.TBL_srh { width:100%; border-collapse:collapse; border:1px solid #c8c8c8; background:#fff; margin-bottom:4px; }
.TBL_srh th { background:#eef2f8; font-size:12px; font-weight:700; color:#333; padding:7px 10px; text-align:left; border:1px solid #c8c8c8; white-space:nowrap; width:10%; }
.TBL_srh td { font-size:12px; color:#222; padding:5px 10px; border:1px solid #c8c8c8; }
.TBL_srh select { height:24px; padding:0 6px; border:1px solid #bbb; font-size:12px; font-family:inherit; box-sizing:border-box; }

.TBL_default { width:100%; border-collapse:collapse; border:1px solid #c8c8c8; background:#fff; font-size:12px; }
.TBL_default thead th { background:#d6e0f0; font-weight:700; color:#1a3c72; padding:7px 8px; text-align:center; border:1px solid #c8c8c8; }
.TBL_default tbody td { padding:6px 8px; border:1px solid #ddd; color:#333; }
.TBL_default tbody tr:nth-child(even) { background:#f7f9fc; }
.TBL_default tbody tr:hover { background:#eef2f8; cursor:pointer; }
.al_c { text-align:center; }
.tbl-scroll { max-height:440px; overflow-y:auto; border:1px solid #c8c8c8; }
.tbl-scroll .TBL_default { border:none; }

.top_btn { text-align:right; margin:5px 0 8px; }
.top_btn button { display:inline-block; height:26px; line-height:26px; padding:0 14px; font-size:12px; color:#fff; background:#2059a3; border:none; cursor:pointer; margin-left:3px; font-family:inherit; }
.top_btn .btn_red  { background:#c0392b; }
.top_btn .btn_gray { background:#6c7a8a; }
.top_btn button:hover { opacity:.85; }

.badge-err { display:inline-block; font-size:11px; background:#fee2e2; color:#b91c1c; padding:1px 7px; border-radius:3px; font-weight:600; }
.badge-gen { display:inline-block; font-size:11px; background:#e0f2fe; color:#0057b7; padding:1px 7px; border-radius:3px; font-weight:600; }

.live-label { font-size:12px; color:#888; font-weight:400; }
.log-terminal {
  margin:0; padding:12px 14px; background:#0f172a; color:#e2e8f0;
  font-family:Consolas,'맑은 고딕',monospace; font-size:12px; line-height:1.7;
  min-height:300px; max-height:500px; overflow-y:auto;
  white-space:pre-wrap; word-break:break-all;
  border:1px solid #c8c8c8; box-sizing:border-box; }
</style>
</head>
<body>
<div id="wrap">
<div class="contents">

  <!-- 페이지 헤더 -->
  <div class="conts_head">
    <h2>로그 조회</h2>
    <span class="badge-ai">AI TEST</span>
    <span class="location">AI 테스트 자동화 &gt; <span class="now">로그 조회</span></span>
  </div>

  <!-- 탭 바 -->
  <div class="step-tab-bar">
    <button class="step-tab-btn on" id="tabLogErr" onclick="switchLogTab('err')">
      에러 로그 <span id="logErrBadge" style="color:#b91c1c;font-weight:400"></span>
    </button>
    <button class="step-tab-btn" id="tabLogGen" onclick="switchLogTab('gen')">
      생성 로그 <span id="logGenBadge" style="color:#0057b7;font-weight:400"></span>
    </button>
    <button class="step-tab-btn" id="tabLogRun" onclick="switchLogTab('run')">
      실시간 로그 <span id="logRunBadge" style="color:#15803d;font-weight:400"></span>
    </button>
  </div>

  <!-- ══ 에러 로그 탭 ══ -->
  <div id="logTabErr">
    <table class="TBL_srh">
      <tr>
        <th>오류 유형</th>
        <td>
          <select id="errTypeFilter" onchange="loadErrLog()">
            <option value="">전체</option>
            <option value="EXTRACT">추출 오류</option>
            <option value="GENERATE">생성 오류</option>
            <option value="EXPORT">내보내기 오류</option>
            <option value="RUN">실행 오류</option>
          </select>
        </td>
        <td></td>
      </tr>
    </table>
    <div class="top_btn">
      <button onclick="loadErrLog()">조회</button>
      <button class="btn_red" onclick="clearErrLog()">로그 삭제</button>
    </div>
    <div class="tbl-scroll">
      <table class="TBL_default">
        <thead>
          <tr>
            <th style="width:44px">No</th>
            <th style="width:140px">발생 일시</th>
            <th style="width:90px">유형</th>
            <th>메시지</th>
            <th style="width:200px">대상 파일</th>
          </tr>
        </thead>
        <tbody id="errLogBody">
          <tr><td colspan="5" class="al_c" style="padding:24px;color:#aaa">조회 버튼을 눌러 로그를 불러오세요.</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ══ 생성 로그 탭 ══ -->
  <div id="logTabGen" style="display:none">

    <div class="stitle-egov">
      실시간 생성 로그
      <span class="live-label" id="genLiveStatus">대기 중...</span>
      <span id="genLiveTag" style="display:none;font-size:11px;background:#ede9fe;color:#7c3aed;padding:1px 8px;border-radius:3px"></span>
    </div>
    <div class="top_btn" style="margin-top:0">
      <button class="btn_gray" onclick="clearGenLiveLog()">지우기</button>
    </div>
    <pre class="log-terminal" id="genLivePre">대기 중 — 시나리오 추출 또는 spec.ts 생성 시 여기에 로그가 표시됩니다.</pre>

    <div class="stitle-egov" style="margin-top:20px">생성 로그 이력</div>
    <table class="TBL_srh">
      <tr>
        <th>유형</th>
        <td>
          <select id="genTypeFilter" onchange="loadGenLog()">
            <option value="">전체</option>
            <option value="EXTRACT">시나리오 추출</option>
            <option value="SPECGEN">spec.ts 생성</option>
            <option value="EXPORT">파일 내보내기</option>
          </select>
        </td>
        <td></td>
      </tr>
    </table>
    <div class="top_btn">
      <button onclick="loadGenLog()">조회</button>
    </div>
    <div class="tbl-scroll">
      <table class="TBL_default">
        <thead>
          <tr>
            <th style="width:44px">No</th>
            <th style="width:140px">일시</th>
            <th style="width:90px">유형</th>
            <th>내용</th>
            <th style="width:70px" class="al_c">건수</th>
          </tr>
        </thead>
        <tbody id="genLogBody">
          <tr><td colspan="5" class="al_c" style="padding:24px;color:#aaa">조회 버튼을 눌러 로그를 불러오세요.</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ══ 실시간 로그 탭 ══ -->
  <div id="logTabRun" style="display:none">
    <div class="stitle-egov">
      Playwright 실행 로그
      <span class="live-label" id="runLogStatus">대기 중...</span>
    </div>
    <div class="top_btn" style="margin-top:0">
      <button class="btn_gray" onclick="clearRunLog()">지우기</button>
    </div>
    <pre class="log-terminal" id="runLogPre" style="min-height:450px;max-height:600px">대기 중 — 테스트를 실행하면 여기에 로그가 표시됩니다.</pre>
  </div>

</div><!-- /contents -->
</div><!-- /wrap -->

<script>
function switchLogTab(tab) {
  ['err','gen','run'].forEach(function(t) {
    var key = t.charAt(0).toUpperCase() + t.slice(1);
    document.getElementById('logTab' + key).style.display = (t === tab) ? '' : 'none';
    document.getElementById('tabLog' + key).classList.toggle('on', t === tab);
  });
  if (tab === 'run') initRunLogChannel();
  if (tab === 'gen') initGenLogChannel();
}

/* ── BroadcastChannel (playwright-run-log) ── */
var _runLogCh = null;
var _runLogAutoScroll = true;

function initRunLogChannel() {
  if (_runLogCh) return;
  try {
    _runLogCh = new BroadcastChannel('playwright-run-log');
    _runLogCh.onmessage = function(e) {
      var d = e.data; if (!d) return;
      var pre    = document.getElementById('runLogPre');
      var status = document.getElementById('runLogStatus');
      var badge  = document.getElementById('logRunBadge');
      if (d.type === 'start') {
        if (pre) pre.textContent = '';
        if (status) { status.textContent = '실행 중 — ' + (d.label||''); status.style.color='#d26c00'; }
        if (badge)  badge.textContent = '▶ 실행 중';
      } else if (d.type === 'log') {
        if (pre) { pre.textContent += d.msg + '\n'; if (_runLogAutoScroll) pre.scrollTop = pre.scrollHeight; }
        if (badge) badge.textContent = '●';
      } else if (d.type === 'done') {
        if (status) { status.textContent = '완료'; status.style.color='#2a8a52'; }
        if (badge)  badge.textContent = '완료';
      } else if (d.type === 'error') {
        if (status) { status.textContent = '오류 — '+(d.msg||''); status.style.color='#c0392b'; }
        if (badge)  badge.textContent = '오류';
      }
    };
  } catch(e) {
    var pre = document.getElementById('runLogPre');
    if (pre) pre.textContent = 'BroadcastChannel 미지원 브라우저입니다.';
  }
}

function clearRunLog() {
  var p = document.getElementById('runLogPre'); if (p) p.textContent = '';
  var s = document.getElementById('runLogStatus'); if (s) { s.textContent = '대기 중...'; s.style.color='#888'; }
  var b = document.getElementById('logRunBadge'); if (b) b.textContent = '';
}

/* ── BroadcastChannel (playwright-gen-log) ── */
var _genLiveCh = null;
var _genLiveAutoScroll = true;

function initGenLogChannel() {
  if (_genLiveCh) return;
  try {
    _genLiveCh = new BroadcastChannel('playwright-gen-log');
    _genLiveCh.onmessage = function(e) {
      var d = e.data; if (!d) return;
      var pre    = document.getElementById('genLivePre');
      var status = document.getElementById('genLiveStatus');
      var tag    = document.getElementById('genLiveTag');
      var badge  = document.getElementById('logGenBadge');
      if (d.type === 'start') {
        if (pre) pre.textContent = '';
        if (status) { status.textContent = '생성 중 — '+(d.label||''); status.style.color='#d26c00'; }
        if (tag) { tag.textContent = d.tag||''; tag.style.display = d.tag ? '' : 'none'; }
        if (badge) badge.textContent = '생성 중';
      } else if (d.type === 'log') {
        if (pre) { pre.textContent += d.msg+'\n'; if (_genLiveAutoScroll) pre.scrollTop = pre.scrollHeight; }
        if (badge) badge.textContent = '●';
      } else if (d.type === 'done') {
        var lbl   = d.status==='error' ? '오류' : '완료';
        var color = d.status==='error' ? '#c0392b' : '#2a8a52';
        if (status) { status.textContent = lbl; status.style.color = color; }
        if (badge)  badge.textContent = lbl;
        loadGenLog();
      }
    };
  } catch(e) {
    var pre = document.getElementById('genLivePre');
    if (pre) pre.textContent = 'BroadcastChannel 미지원 브라우저입니다.';
  }
}

function clearGenLiveLog() {
  var p = document.getElementById('genLivePre');    if (p) p.textContent = '';
  var s = document.getElementById('genLiveStatus'); if (s) { s.textContent = '대기 중...'; s.style.color='#888'; }
  var t = document.getElementById('genLiveTag');    if (t) { t.textContent=''; t.style.display='none'; }
}

/* 스크롤 제어 */
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    var rp = document.getElementById('runLogPre');
    if (rp) rp.addEventListener('scroll', function(){ _runLogAutoScroll = (rp.scrollTop+rp.clientHeight >= rp.scrollHeight-20); });
    var gp = document.getElementById('genLivePre');
    if (gp) gp.addEventListener('scroll', function(){ _genLiveAutoScroll = (gp.scrollTop+gp.clientHeight >= gp.scrollHeight-20); });
  });
})();

function loadErrLog() {
  var type = document.getElementById('errTypeFilter').value;
  fetch('<c:url value="/ai/getErrLog.do"/>' + (type ? '?type='+type : ''))
    .then(function(r){ return r.json(); })
    .then(function(d) {
      var rows = d.rows || [];
      document.getElementById('logErrBadge').textContent = rows.length ? '('+rows.length+')' : '';
      var tbody = document.getElementById('errLogBody');
      if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="al_c" style="padding:24px;color:#aaa">에러 로그가 없습니다.</td></tr>';
        return;
      }
      tbody.innerHTML = rows.map(function(r, i) {
        var safeJson = JSON.stringify(r).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
        return '<tr ondblclick="showLogDetail(\''+safeJson+'\')">'
          +'<td class="al_c">'+(i+1)+'</td>'
          +'<td style="font-size:11px;color:#888">'+(r.logDate||'')+'</td>'
          +'<td class="al_c"><span class="badge-err">'+(r.logType||'ERROR')+'</span></td>'
          +'<td style="color:#b91c1c">'+escHtml(r.message||'')+'</td>'
          +'<td style="font-family:monospace;font-size:11px;color:#888">'+escHtml(r.targetFile||'')+'</td>'
          +'</tr>';
      }).join('');
    }).catch(function(e){ console.error(e); });
}

function loadGenLog() {
  var type = document.getElementById('genTypeFilter').value;
  fetch('<c:url value="/ai/getGenLog.do"/>' + (type ? '?type='+type : ''))
    .then(function(r){ return r.json(); })
    .then(function(d) {
      var rows = d.rows || [];
      document.getElementById('logGenBadge').textContent = rows.length ? '('+rows.length+')' : '';
      var tbody = document.getElementById('genLogBody');
      if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="al_c" style="padding:24px;color:#aaa">생성 로그가 없습니다.</td></tr>';
        return;
      }
      tbody.innerHTML = rows.map(function(r, i) {
        var safeJson = JSON.stringify(r).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
        return '<tr ondblclick="showLogDetail(\''+safeJson+'\')">'
          +'<td class="al_c">'+(i+1)+'</td>'
          +'<td style="font-size:11px;color:#888">'+(r.logDate||'')+'</td>'
          +'<td class="al_c"><span class="badge-gen">'+(r.logType||'')+'</span></td>'
          +'<td>'+escHtml(r.message||'')+'</td>'
          +'<td class="al_c" style="font-weight:700">'+(r.count!=null?r.count:'')+'</td>'
          +'</tr>';
      }).join('');
    }).catch(function(e){ console.error(e); });
}

function clearErrLog() {
  if (!confirm('에러 로그를 삭제하시겠습니까?')) return;
  fetch('<c:url value="/ai/clearErrLog.do"/>', {method:'POST'})
    .then(function(){ loadErrLog(); });
}

function escHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function showLogDetail(jsonStr) {
  var r = JSON.parse(jsonStr);
  document.getElementById('logDetailDate').textContent   = r.logDate   || '-';
  document.getElementById('logDetailType').textContent   = r.logType   || '-';
  document.getElementById('logDetailTarget').textContent = r.targetFile || (r.count!=null ? String(r.count) : '-');
  document.getElementById('logDetailMsg').value          = r.message   || '';
  document.getElementById('logDetailModal').style.display = 'flex';
}
function closeLogDetail() { document.getElementById('logDetailModal').style.display = 'none'; }

loadErrLog();

(function(){
  var p = new URLSearchParams(window.location.search);
  if (p.get('tab') === 'run') switchLogTab('run');
  else if (p.get('tab') === 'gen') switchLogTab('gen');
})();
</script>

<!-- 로그 상세 모달 -->
<div id="logDetailModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9000;align-items:center;justify-content:center">
  <div style="background:#fff;width:860px;max-width:95vw;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,.3);border:1px solid #999">
    <div style="display:flex;align-items:center;gap:8px;padding:9px 14px;border-bottom:2px solid #2059a3;background:#eef2f8">
      <span style="font-weight:700;font-size:13px;color:#1a3c72">로그 상세</span>
      <span id="logDetailType" class="badge-gen"></span>
      <span id="logDetailDate" style="font-size:11px;color:#888"></span>
      <span id="logDetailTarget" style="font-size:11px;color:#888;font-family:monospace"></span>
      <button onclick="closeLogDetail()" style="margin-left:auto;border:none;background:none;font-size:18px;cursor:pointer;color:#666;line-height:1">✕</button>
    </div>
    <div style="padding:12px;flex:1;overflow:hidden;display:flex;flex-direction:column">
      <textarea id="logDetailMsg" readonly
        style="flex:1;width:100%;min-height:400px;font-family:Consolas,monospace;font-size:12px;
               line-height:1.6;border:1px solid #c8c8c8;padding:10px;resize:vertical;
               background:#f8fafc;color:#1a1a1a;box-sizing:border-box"></textarea>
    </div>
    <div style="padding:8px 14px;border-top:1px solid #e5e7eb;text-align:right">
      <button onclick="closeLogDetail()" style="height:26px;line-height:26px;padding:0 14px;font-size:12px;background:#2059a3;color:#fff;border:none;cursor:pointer;font-family:inherit">닫기</button>
    </div>
  </div>
</div>
</body>
</html>
