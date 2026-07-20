<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<script>
var currentPrefix              = '';
var currentSpecFileName        = '';
var currentGrpId               = '';   // 현재 그룹시나리오 키 (DB GRP_ID)
var uploadedSources            = [];   // 업로드된 전체 소스 목록 (체크박스 상태 포함)
var scenarios                  = [];
var currentTab                 = '통합';
var _genSessions               = [];   // 생성 로그 세션 배열 (실행 1회 = 세션 1개)
var _genCurrentSession         = null; // 현재 진행 중인 세션 (null이면 세션 없음)
var _runSessions               = [];   // 실행 로그 세션 배열
var _runCurrentSession         = null; // 현재 진행 중인 실행 세션
var _globalTimer               = null; // 전역 프로그레스 타이머
var testEventSource            = null;
var specStreamEventSource      = null;
var scenarioStreamEventSource  = null;
var ERROR_LOG_KEY  = 'ai_spec_error_logs';

/* ── 단계 완료 추적 ─────────────────────────────────────────── */
var completedSteps = {};   // {1: true, 2: true, 3: true, 4: true}
var currentPanelNum = 1;

/* ══════════════════════════════════════════════════════════
   SPA 패널 전환 + 단계 완료 관리
   ══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   전역 상단 프로그레스 바
   globalProgressStart(label)  — 프로세스 시작 시 호출
   globalProgressFinish(success) — 완료/실패 시 호출
   globalProgressStep(pct)     — SSE progress 이벤트에서 정확한 % 갱신 시 호출
   ══════════════════════════════════════════════════════════ */
function globalProgressStart(label) {
  clearInterval(_globalTimer);
  var wrap  = document.getElementById('globalProgressWrap');
  var bar   = document.getElementById('globalProgressBar');
  var pct   = document.getElementById('globalProgressPct');
  var lbl   = document.getElementById('globalProgressLabel');
  if (!wrap) return;

  if (bar)  { bar.style.width = '0%'; bar.style.background = 'linear-gradient(90deg,#1a3a5c,#2563eb)'; }
  if (pct)  pct.textContent  = '0%';
  if (lbl)  lbl.textContent  = label || '처리 중...';
  wrap.style.display = '';

  var _pct = 0;
  _globalTimer = setInterval(function() {
    if (_pct < 88) { _pct += (_pct < 40 ? 5 : _pct < 70 ? 2.5 : 1); }
    if (bar) bar.style.width = _pct + '%';
    if (pct) pct.textContent = Math.round(_pct) + '%';
  }, 400);
}

function globalProgressStep(done, total) {
  clearInterval(_globalTimer);
  var bar  = document.getElementById('globalProgressBar');
  var pct  = document.getElementById('globalProgressPct');
  var val  = total > 0 ? Math.min(95, Math.round((done / total) * 90) + 5) : 0;
  if (bar) bar.style.width = val + '%';
  if (pct) pct.textContent = val + '%';
}

function globalProgressFinish(success) {
  clearInterval(_globalTimer);
  var wrap = document.getElementById('globalProgressWrap');
  var bar  = document.getElementById('globalProgressBar');
  var pct  = document.getElementById('globalProgressPct');
  var lbl  = document.getElementById('globalProgressLabel');
  if (bar) {
    bar.style.width      = '100%';
    bar.style.background = success
      ? 'linear-gradient(90deg,#16a34a,#22c55e)'
      : 'linear-gradient(90deg,#dc2626,#ef4444)';
  }
  if (pct) pct.textContent = '100%';
  if (lbl) lbl.textContent = success ? '✅ 완료' : '❌ 실패';
  setTimeout(function() { if (wrap) wrap.style.display = 'none'; }, 1800);
}

/* ══════════════════════════════════════════════════════════
   실행중 플로팅 배지 — [테스트] 버튼 자동실행 시 패널 이동 없이
   백그라운드 실행 상태를 알려준다. 클릭하면 Panel 3(테스트 실행)로 이동.
   현재 Panel 3에 있으면(이미 실행 화면이 보이므로) 표시하지 않는다.
   ══════════════════════════════════════════════════════════ */
function runningBadgeShow(label) {
  var badge = document.getElementById('runningBadge');
  var text  = document.getElementById('runningBadgeText');
  if (!badge) return;
  if (text) text.textContent = label || '테스트 실행중';
  if (currentPanelNum !== 3) badge.style.display = 'flex';
}

function runningBadgeUpdate(done, total) {
  var text = document.getElementById('runningBadgeText');
  if (text) text.textContent = '테스트 실행중 ' + done + '/' + total;
}

function runningBadgeHide() {
  var badge = document.getElementById('runningBadge');
  if (badge) badge.style.display = 'none';
}

/* 배지의 ✕ 버튼 — 패널 이동 없이도 실행 중인 테스트를 바로 중지할 수 있게 한다 */
function confirmStopFromBadge() {
  if (!confirm('실행 중인 테스트를 중지하시겠습니까?')) return;
  doStopTest();
}

/* 좌측 메뉴 등에서 자유롭게 패널 전환 (이전 단계 완료 여부 무관) */
function switchPanel(num) {
  currentPanelNum = num;
  document.querySelectorAll('.step-panel').forEach(function(p) { p.classList.remove('active'); });
  var panel = document.getElementById('panel-' + num);
  if (panel) panel.classList.add('active');
  updateNavStepState();
  document.querySelectorAll('#panelTabBar .subtab-btn').forEach(function(b) { b.classList.remove('on'); });
  var tabBtn = document.getElementById('panel-tab-' + num);
  if (tabBtn) tabBtn.classList.add('on');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (num === 5) renderErrorLogs();
  if (num === 6) renderGenLogs();
  if (num === 3) runningBadgeHide();
  return true;
}

/* "다음 단계" 버튼 전용 — 이전 단계 미완료 시 알림 표시 후 이동 차단 */
function switchPanelGuarded(num) {
  if (num > 1 && !completedSteps[num - 1]) {
    var stepNames = { 1: '테스트 시나리오', 2: '테스트 코드 생성', 3: '테스트 실행' };
    showAlert('warning', (num - 1) + '단계 [' + (stepNames[num - 1] || '') + ']를 먼저 완료해야 합니다.');
    return false;
  }
  return switchPanel(num);
}

function markStepComplete(num) {
  completedSteps[num] = true;
  updateNavStepState();
  // 다음 단계 nav 항목 해제
  var nextItem = document.getElementById('nav-step-' + (num + 1));
  if (nextItem) nextItem.classList.add('unlocked');
  // 다음 단계 이동 버튼 표시
  var nextBtn = document.getElementById('btn-goto-' + (num + 1));
  if (nextBtn) nextBtn.classList.add('visible');
}

function updateNavStepState() {
  for (var i = 1; i <= 4; i++) {
    var item = document.getElementById('nav-step-' + i);
    if (!item) continue;
    item.classList.remove('on', 'current-panel');
    if (currentPanelNum === i) item.classList.add('on');
  }
}

/* ── 사이드바 내비게이션 ─────────────────────────────────────────── */
function navTo(id) {
  var el = document.getElementById(id);
  if (!el) return;
  // display:none 인 경우 스크롤이 안되므로 임시로 block
  var wasHidden = el.style.display === 'none' || getComputedStyle(el).display === 'none';
  if (wasHidden) { el.style.display = 'block'; }
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (wasHidden) { el.style.display = 'none'; }

  // 활성 메뉴 표시
  document.querySelectorAll('.nav-list li').forEach(function(li) {
    li.classList.remove('active');
    var a = li.querySelector('a');
    if (a && a.getAttribute('onclick') && a.getAttribute('onclick').indexOf("'" + id + "'") >= 0) {
      li.classList.add('active');
    }
  });
}


/* ── 버튼 활성화 ────────────────────────────────────────────────── */
function updateBtnGenerate() {
  var btn = document.getElementById('btnGenerate');
  if (!btn) return;
  var hasChecked = uploadedSources.some(function(s){ return s._checked; });
  btn.disabled = !currentPrefix || !hasChecked;
  btn.title = !currentPrefix ? '엑셀 파일을 먼저 업로드하세요.' : (!hasChecked ? '소스를 1개 이상 선택하세요.' : '');
}

/* ── 엑셀 업로드 ─────────────────────────────────────────────────── */
function onExcelFileSelected(input) {
  var file = input.files && input.files[0];
  if (!file) return;
  document.getElementById('excelFileName').textContent = file.name;
  var statusEl = document.getElementById('excelUploadStatus');
  statusEl.style.display = 'block'; statusEl.style.color = '#888'; statusEl.textContent = '업로드 중...';

  var formData = new FormData();
  formData.append('file', file);
  fetch('<c:url value="/ai/uploadSourceList.do"/>', { method: 'POST', body: formData })
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (!data.success) {
        statusEl.style.color = '#b91c1c';
        statusEl.textContent = '오류: ' + (data.message || '업로드 실패');
        return;
      }
      currentPrefix = data.prefix || '';
      // 소스 목록 저장 (체크 상태 포함)
      uploadedSources = (data.sources || []).map(function(s){
        return Object.assign({}, s, { _checked: true });
      });
      statusEl.style.color = '#15803d';
      var prefixes = data.prefixes || [data.prefix];
      var pfxLabel = prefixes.length > 1
        ? prefixes.join(', ').toUpperCase() + ' (혼합)'
        : (data.prefix || '').toUpperCase();
      statusEl.textContent = '✓ ' + data.count + '개 소스 로드됨 [' + pfxLabel + ']';
      renderSourceList();
      scenarios = [];
      clearScenarioTable();
      document.getElementById('resultSection').style.display = 'none';
      document.getElementById('scenarioSection').style.display = 'none';
      updateBtnGenerate();
    })
    .catch(function(e){ statusEl.style.color = '#b91c1c'; statusEl.textContent = '오류: ' + e.message; });
}

/* ── prefix 파싱: 첫 _ 이전, 없으면 선행 알파벳 ────────────────── */
function getSourcePrefix(rawName) {
  var name = (rawName || '').replace(/\.[^.]+$/, '');
  var idx = name.indexOf('_');
  if (idx > 0) return name.substring(0, idx).toUpperCase();
  var m = name.match(/^([A-Za-z]+)/);
  return m ? m[1].toUpperCase() : name.toUpperCase();
}

/* ── 소스 목록 그리드 렌더링 — 평면 목록, 행마다 구분(prefix) 컬럼 표시 ── */
function renderSourceList() {
  var list    = document.getElementById('sourceList');
  var total   = uploadedSources.length;
  var checked = uploadedSources.filter(function(s){ return s._checked; }).length;

  // 카운트 배지
  var countBadge = document.getElementById('sourceCountBadge');
  if (countBadge) {
    countBadge.innerHTML =
      '(<span id="chkCount" style="color:#2563eb;font-weight:700">' + checked + '</span>/' + total + '개 선택)';
  }
  // 헤더 체크박스 동기화
  var hdrChk = document.getElementById('chkAllSources');
  if (hdrChk) {
    hdrChk.checked       = total > 0 && checked === total;
    hdrChk.indeterminate = checked > 0 && checked < total;
  }

  if (total === 0) {
    list.innerHTML = '<tr><td colspan="3" class="empty-msg">소스가 없습니다. Excel 파일을 업로드하세요.</td></tr>';
    return;
  }

  var html = '';
  uploadedSources.forEach(function(s, idx) {
    var pfx = getSourcePrefix(s.rawName || s.displayName || '');
    html += '<tr class="item-row" style="cursor:pointer" onclick="toggleSource(' + idx + ')">' +
      '<td><input type="checkbox" id="src_chk_' + idx + '"' +
        (s._checked ? ' checked' : '') +
        ' onclick="event.stopPropagation();toggleSource(' + idx + ')"' +
        ' style="width:14px;height:14px;cursor:pointer;accent-color:#2563eb"></td>' +
      '<td style="text-align:center;font-weight:700;color:#2059a3">' + esc(pfx.toLowerCase()) + '</td>' +
      '<td>' + esc(s.displayName || s.rawName) + '</td>' +
    '</tr>';
  });
  list.innerHTML = html;
}

/* ── 공통 카운트 & 헤더 체크박스 동기화 ─────────────────────────── */
function syncSourceCounts() {
  var total  = uploadedSources.length;
  var cnt    = uploadedSources.filter(function(s){ return s._checked; }).length;
  var el     = document.getElementById('chkCount');
  if (el) el.textContent = cnt;
  var hdrChk = document.getElementById('chkAllSources');
  if (hdrChk) {
    hdrChk.checked       = total > 0 && cnt === total;
    hdrChk.indeterminate = cnt > 0 && cnt < total;
  }
}

function toggleSource(idx) {
  if (!uploadedSources[idx]) return;
  uploadedSources[idx]._checked = !uploadedSources[idx]._checked;
  var chk = document.getElementById('src_chk_' + idx);
  if (chk) chk.checked = uploadedSources[idx]._checked;
  syncSourceCounts();
  updateBtnGenerate();
}

function toggleAllSources(checked) {
  uploadedSources.forEach(function(s){ s._checked = checked; });
  renderSourceList();
  updateBtnGenerate();
}

/* ── 현재 체크된 소스 목록 반환 ─────────────────────────────────────── */
function getCheckedSources() {
  return uploadedSources.filter(function(s){ return s._checked; }).map(function(s){
    // _checked 필드 제거 후 반환
    var copy = Object.assign({}, s);
    delete copy._checked;
    return copy;
  });
}

/* ── scenarioId 접두어로 testType 정규화 + XFDL 추출 필드명 매핑 ── */
function normalizeScenarioTypes(list) {
  list.forEach(function(s) {
    /* testType 정규화 */
    if (s.scenarioId) {
      var p = s.scenarioId.substring(0, 2).toUpperCase();
      if (p === 'UT') s.testType = '단위';
      else if (p === 'IT') s.testType = '통합';
    }
    /* XFDL 추출 시나리오: 한글 키 → UI 영문 키 매핑 */
    if (!s.testName      && s['테스트명'])    s.testName      = s['테스트명'];
    if (!s.preCondition  && s['사전조건'])    s.preCondition  = s['사전조건'];
    if (!s.roleNm        && s.actor)         s.roleNm        = s.actor;
    if (!s.url           && s.URL)           s.url           = s.URL;
    if (!s.description)                      s.description   = s.description || '';
    /* 역할(액터) 기본값: 단위=개발자, 통합=일반사용자 (SYS_ROLE_MGT 조회 결과 없을 때와 동일 표기) */
    if (!s.roleNm) s.roleNm = '일반사용자';
    /* 예상결과에 pgm_id가 있으면 메뉴명으로 치환 */
    var _pgmId = s.sourceName || s.pgmId || '';
    if (_pgmId && s.menuName && s.expectedResult) {
      s.expectedResult = s.expectedResult.replace(
        new RegExp(_pgmId.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&'), 'g'), s.menuName
      );
    }
  });
}

/* ── 탭 전환 ─────────────────────────────────────────────────────── */
function switchTab(tab) {
  currentTab = tab;
  var integBtn = document.getElementById('tabInteg');
  var unitBtn  = document.getElementById('tabUnit');
  if (integBtn) integBtn.classList.toggle('active', tab === '통합');
  if (unitBtn)  unitBtn.classList.toggle('active',  tab === '단위');
  renderScenarioTable(scenarios);
}


/* ── 시나리오 생성 (SSE) ─────────────────────────────────────────── */
function doGenerateScenario() {
  if (!currentPrefix) { alert('엑셀 파일을 먼저 업로드하세요.'); return; }

  var checkedSources = getCheckedSources();
  if (checkedSources.length === 0) { alert('생성할 소스를 1개 이상 선택하세요.'); return; }

  if (scenarioStreamEventSource) { scenarioStreamEventSource.close(); scenarioStreamEventSource = null; }

  var btn                = document.getElementById('btnGenerate'); // null - button removed; kept for setLoading compat
  var scenarioLogSection = document.getElementById('scenarioLogSection');
  var scenarioLogStatus  = document.getElementById('scenarioLogStatus');
  var progressBar        = document.getElementById('scenarioProgressBar');
  var progressText       = document.getElementById('scenarioProgressText');

  clearScenarioTable();
  currentSpecFileName = '';
  ['playwrightLog','integrationLog'].forEach(function(id){
    var el = document.getElementById(id); if (el) el.textContent = '';
  });
  ['logSection','specProgressSection','resultSection','defectSection','scenarioSection'].forEach(function(id){
    var el = document.getElementById(id); if (el) el.style.display = 'none';
  });

  // 프로그레스 바 초기화
  if (progressBar)  { progressBar.style.width = '0%'; progressBar.style.background = 'linear-gradient(90deg,#1a3a5c,#2563eb)'; }
  if (progressText) progressText.textContent = '0%';
  scenarioLogStatus.textContent = '소스 목록 저장 중...';
  scenarioLogSection.style.display = 'block';
  scenarioLogSection.scrollIntoView({ behavior: 'smooth' });

  // 전역 + 패널 내부 프로그레스 시작
  globalProgressStart('시나리오 생성 중...');

  function _finishScenProgress(success) {
    globalProgressFinish(success);
    if (progressBar) {
      progressBar.style.width = '100%';
      progressBar.style.background = success
        ? 'linear-gradient(90deg,#16a34a,#22c55e)'
        : 'linear-gradient(90deg,#dc2626,#ef4444)';
    }
    if (progressText) progressText.textContent = '100%';
    setTimeout(function() { scenarioLogSection.style.display = 'none'; }, 1500);
  }

  // ── PENDING_FILES.remove() 1회 소비 문제 해결:
  //    SSE 호출 직전에 선택된 소스를 서버에 다시 저장한다.
  fetch('<c:url value="/ai/storeScenarioFiles.do"/>', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: currentPrefix, checkedFiles: checkedSources })
  })
  .then(function(r){ return r.json(); })
  .then(function(stored){
    if (!stored.success) {
      clearInterval(_scenTimer);
      setLoading(btn, false);
      showAlert('error', '소스 저장 실패: ' + (stored.message || ''));
      scenarioLogSection.style.display = 'none';
      return;
    }
    scenarioLogStatus.textContent = '시나리오 생성 중... (' + checkedSources.length + '개 소스)';

    // ── PUR 전용 SSE 흐름 ────────────────────────────────────────────────
    if (currentPrefix === 'pur') {
      genSessionStart('pur', 'PUR 시나리오 생성 (' + checkedSources.length + '개 소스)');
      scenarioStreamEventSource = new EventSource('<c:url value="/ai/runPurScenarioGen.do"/>');
      scenarioStreamEventSource.addEventListener('log', function(e) {
        console.log('[PUR]', e.data);
        addGenLog('pur', e.data);
      });
      scenarioStreamEventSource.addEventListener('done', function(e) {
        genSessionEnd('done');
        scenarioStreamEventSource.close(); scenarioStreamEventSource = null;
        setLoading(btn, false);
        try {
          var data = JSON.parse(e.data);
          if (data.success) {
            _finishScenProgress(true);
            scenarioLogStatus.textContent = '';
            purGenFileName = data.file || '';
            var cnt = data.scenarioCount || 0;
            if (cnt > 0) loadScenariosIntoEditor('pur', cnt);
            showAlert('success', 'PUR 시나리오 생성 완료 (' + cnt + '건). 아래 목록에서 확인하세요.');
          } else {
            _finishScenProgress(false);
            scenarioLogStatus.textContent = '';
            showAlert('error', data.message || 'PUR 시나리오 생성 실패');
          }
        } catch(err) {
          _finishScenProgress(false);
          showAlert('error', 'JSON 파싱 오류: ' + err.message);
        }
      });
      scenarioStreamEventSource.addEventListener('error', function(e) {
        genSessionEnd('error');
        scenarioStreamEventSource.close(); scenarioStreamEventSource = null;
        setLoading(btn, false);
        _finishScenProgress(false);
        scenarioLogStatus.textContent = '';
        if (e.data) showApiError(e.data);
      });
      scenarioStreamEventSource.onerror = function() {
        if (scenarioStreamEventSource && scenarioStreamEventSource.readyState === EventSource.CLOSED)
          scenarioLogStatus.textContent = '';
      };
      return;
    }

    // ── 일반 SSE 흐름 ────────────────────────────────────────────────────
    genSessionStart('scenario', '시나리오 생성 (' + currentPrefix.toUpperCase() + ' · ' + checkedSources.length + '개 소스)');
    scenarioStreamEventSource = new EventSource(
      '<c:url value="/ai/generateScenarioStream.do"/>?prefix=' + encodeURIComponent(currentPrefix)
    );
    scenarioStreamEventSource.addEventListener('log', function(e) {
      console.log('[시나리오 생성]', e.data);
      addGenLog('scenario', e.data);
    });
    scenarioStreamEventSource.addEventListener('done', function(e) {
      genSessionEnd('done');
      scenarioStreamEventSource.close(); scenarioStreamEventSource = null;
      setLoading(btn, false);
      try {
        var data = JSON.parse(e.data);
        if (!data.success) {
          _finishScenProgress(false);
          scenarioLogStatus.textContent = '';
          showAlert('error', data.message || '시나리오 생성 실패');
          return;
        }
        _finishScenProgress(true);
        scenarioLogStatus.textContent = '';
        scenarios = data.scenarios || [];
        normalizeScenarioTypes(scenarios);
        if (data.menuWarning) showAlert('warning', data.menuWarning);
        var integCnt = _integScenCount(scenarios);
        var unitCnt  = scenarios.filter(function(s){ return s.testType === '단위'; }).length;
        document.getElementById('integCountBadge').textContent = '(' + integCnt + ')';
        document.getElementById('unitCountBadge').textContent  = '(' + unitCnt  + ')';
        renderScenarioTable(scenarios);
        document.getElementById('scenarioSection').style.display = 'block';
        document.getElementById('scenarioCountBadge').textContent = '(총 ' + scenarios.length + '건)';
        document.getElementById('scenarioSection').scrollIntoView({ behavior: 'smooth' });
        if (data.grpId) currentGrpId = data.grpId;
        var btnConfirm = document.getElementById('btnConfirmScenario');
        var btnSave    = document.getElementById('btnSaveScenarioDB');
        var btnHist    = document.getElementById('btnAddHistoryGroup');
        if (btnConfirm) btnConfirm.disabled = false;
        if (btnSave)    btnSave.disabled    = false;
        if (btnHist)    btnHist.disabled    = false;
      } catch(err) { showAlert('error', 'JSON 파싱 오류: ' + err.message); }
    });
    scenarioStreamEventSource.addEventListener('error', function(e) {
      genSessionEnd('error');
      scenarioStreamEventSource.close(); scenarioStreamEventSource = null;
      setLoading(btn, false);
      _finishScenProgress(false);
      scenarioLogStatus.textContent = '';
      if (e.data) showApiError(e.data);
    });
    scenarioStreamEventSource.onerror = function() {
      if (scenarioStreamEventSource && scenarioStreamEventSource.readyState === EventSource.CLOSED)
        scenarioLogStatus.textContent = '';
    };
  })
  .catch(function(e){
    clearInterval(_scenTimer);
    setLoading(btn, false);
    scenarioLogSection.style.display = 'none';
    showAlert('error', '소스 저장 중 오류: ' + e.message);
  });
}

/* ── 체크된 시나리오 ID 수집 ─────────────────────────────────────── */
function getCheckedScenarioIds() {
  var ids = [];
  document.querySelectorAll('#scenarioBody input[type="checkbox"].scen-chk:checked')
    .forEach(function(chk) { ids.push(chk.getAttribute('data-scen-id')); });
  return ids;
}

/* ── 체크된 시나리오 행 no 목록 (동일 scenarioId 여러 행 구분용) ─────
 * 통합 탭: 각 scenarioId 당 1행만 표시(dedup) → no와 scenarioId가 사실상 1:1
 * 단위 탭: 동일 scenarioId 여러 행 표시 가능 → no 로만 정확한 필터링 가능 */
function getCheckedScenarioNos() {
  var nos = [];
  document.querySelectorAll('#scenarioBody input[type="checkbox"].scen-chk:checked')
    .forEach(function(chk) {
      var n = parseInt(chk.getAttribute('data-scen-no'), 10);
      if (!isNaN(n)) nos.push(n);
    });
  return nos;
}

/* ── 체크된 시나리오 객체 목록 (통합 탭 dedup 고려 — scenarioId 확장) ─
 * 통합 탭에서는 체크된 행 1개가 동일 scenarioId를 가진 백엔드 여러 행을 대표한다.
 * 따라서 (a) 체크된 no와 정확히 매칭되는 행 + (b) 체크된 scenarioId를 가진 모든 통합 행
 * 을 포함해 서버에 전송한다. 단위 탭은 (a)만 적용. */
function getCheckedScenarios() {
  var checkedNos = getCheckedScenarioNos();
  var checkedIds = getCheckedScenarioIds();
  if (!checkedNos.length && !checkedIds.length) return [];

  var noSet = {}, idSet = {};
  checkedNos.forEach(function(n){ noSet[n] = true; });
  checkedIds.forEach(function(id){ idSet[id] = true; });

  return scenarios.filter(function(s) {
    if (noSet[s.no]) return true;                        // 정확한 행 매칭 (단위/통합 공통)
    // 통합 탭 dedup 보완: scenarioId가 체크되어 있으나 no는 화면에 없는 통합 형제 행
    if (s.testType !== '단위' && idSet[s.scenarioId]) return true;
    return false;
  });
}

/* ── 시나리오 전체선택/해제 ─────────────────────────────────────────── */
function toggleAllScenarios(checked) {
  document.querySelectorAll('#scenarioBody input[type="checkbox"].scen-chk')
    .forEach(function(chk) { chk.checked = checked; });
}

/* ── [테스트] 버튼: 체크된 시나리오만 → STORE 동기화 → spec.ts 생성 후 자동 실행 ──
 * 체크되지 않은 시나리오는 서버로 전송하지 않는다 (SCENARIO_STORE에 아예 포함되지 않음).
 * 서버 generateSpecStream의 scenarioIds 필터가 실패하더라도 STORE 자체가 필터되어
 * 있으므로 절대 체크되지 않은 시나리오는 실행되지 않는다. */
function doConfirmScenario() {
  if (!scenarios || !scenarios.length) { showAlert('warning', '시나리오가 없습니다.'); return; }

  var checkedScenarios = getCheckedScenarios();
  if (!checkedScenarios.length) {
    showAlert('warning', '테스트할 시나리오를 1개 이상 체크하세요.');
    return;
  }
  var checkedIds = [];
  var seenId = {};
  checkedScenarios.forEach(function(s){
    if (!seenId[s.scenarioId]) { seenId[s.scenarioId] = true; checkedIds.push(s.scenarioId); }
  });

  if (!confirm('테스트코드를 생성하시겠습니까?\n(선택된 ' + checkedScenarios.length + '개 시나리오만 실행)')) return;

  // 서버 SCENARIO_STORE 동기화 — 체크된 시나리오만 저장하여 필터 이중화
  var syncPrefix = currentPrefix || 'user';
  fetch('<c:url value="/ai/syncScenariosToStore.do"/>', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: syncPrefix, scenarios: checkedScenarios })
  })
  .then(function(r) { return r.json(); })
  .then(function(d) {
    if (!d.success) {
      showAlert('warning', '시나리오 동기화 실패: ' + (d.message || '알 수 없는 오류'));
      return;
    }
    _autoRunOnSpecDone = true;
    _singleRowNo = null;
    doStartSpecStream(syncPrefix, checkedIds.join(','));
  })
  .catch(function(e) {
    // 동기화 실패 시에는 실행을 중단한다 — 실패한 상태로 진행하면 이전 STORE가
    // 그대로 사용되어 체크되지 않은 시나리오까지 실행될 수 있음
    console.warn('[syncScenariosToStore] 오류:', e.message);
    showAlert('error', '시나리오 동기화 실패 — 다시 시도하세요.\n' + e.message);
  });
}

/* ── DB 저장 (현재 시나리오 → 기존 그룹 업데이트) ──────────────────── */
function doSaveScenarioDB() {
  // scenarios가 비어있어도 서버 SCENARIO_STORE fallback이 있으므로 시도한다
  var statusEl   = document.getElementById('scenarioDbStatus');
  var saveBtn    = document.getElementById('purDbSaveBtn');
  var progressWrap = document.getElementById('purSaveProgressWrap');
  var progressBar  = document.getElementById('purSaveProgressBar');
  var progressText = document.getElementById('purSaveProgressText');

  // ── 전역 상단 프로그레스바 시작 ──
  globalProgressStart('DB 저장 중...');

  // ── 로컬 프로그레스바 시작 ──
  if (progressWrap) progressWrap.style.display = 'block';
  if (progressBar)  { progressBar.style.width = '0%'; progressBar.style.background = 'linear-gradient(90deg,#2563eb,#3b82f6)'; }
  if (progressText) progressText.textContent = '0%';
  if (statusEl) { statusEl.textContent = '저장 중...'; statusEl.style.color = '#888'; }
  if (saveBtn)  saveBtn.disabled = true;

  // ── 진행률 시뮬레이션 (0→85%, 저장 완료 후 100%) ──
  var pct = 0;
  var fakeTimer = setInterval(function() {
    if (pct < 85) {
      pct += (pct < 40 ? 8 : pct < 70 ? 4 : 1);
      if (pct > 85) pct = 85;
      if (progressBar)  progressBar.style.width = pct + '%';
      if (progressText) progressText.textContent = pct + '%';
    }
  }, 200);

  function finishProgress(success) {
    clearInterval(fakeTimer);
    globalProgressFinish(success);
    if (progressBar)  { progressBar.style.width = '100%'; progressBar.style.background = success ? 'linear-gradient(90deg,#16a34a,#22c55e)' : 'linear-gradient(90deg,#dc2626,#ef4444)'; }
    if (progressText) progressText.textContent = '100%';
    setTimeout(function() {
      if (progressWrap) progressWrap.style.display = 'none';
      if (progressBar)  progressBar.style.width = '0%';
      if (progressText) progressText.textContent = '';
    }, 1800);
  }

  // scenarios가 있으면 함께 전송, 없으면 prefix만 전송해서 서버 SCENARIO_STORE 사용
  var payload = { prefix: currentPrefix || 'pur', grpId: currentGrpId };
  if (scenarios && scenarios.length) payload.scenarios = scenarios;

  fetch('<c:url value="/ai/saveScenarioToDB.do"/>', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    finishProgress(data.success);
    if (saveBtn) saveBtn.disabled = false;
    if (data.success) {
      currentGrpId = data.grpId || currentGrpId;
      var msg = '✅ ' + data.message;
      if (statusEl) { statusEl.textContent = msg; statusEl.style.color = '#15803d'; }
      showAlert('success', msg);
      setTimeout(function(){ if (statusEl) statusEl.textContent = ''; }, 4000);
    } else {
      var msg = '❌ ' + data.message;
      if (statusEl) { statusEl.textContent = msg; statusEl.style.color = '#b91c1c'; }
      showAlert('error', msg);
    }
  })
  .catch(function(e){
    finishProgress(false);
    if (saveBtn) saveBtn.disabled = false;
    var msg = '❌ ' + e.message;
    if (statusEl) { statusEl.textContent = msg; statusEl.style.color = '#b91c1c'; }
    showAlert('error', msg);
  });
}

/* ── 이력 추가 (새 GRP_ID 발급 후 저장) ──────────────────────────── */
function doAddHistoryGroup() {
  if (!scenarios || !scenarios.length) { showAlert('warning', '시나리오가 없습니다.'); return; }
  var statusEl = document.getElementById('scenarioDbStatus');
  statusEl.textContent = '이력 추가 중...'; statusEl.style.color = '#888';

  // ── 전역 상단 프로그레스바 시작 ──
  globalProgressStart('이력 추가 중...');

  fetch('<c:url value="/ai/addHistoryGroup.do"/>', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: currentPrefix, scenarios: scenarios })
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    globalProgressFinish(data.success);
    if (data.success) {
      currentGrpId = data.grpId || currentGrpId;
      statusEl.textContent = '✅ ' + data.message;
      statusEl.style.color = '#15803d';
      showAlert('info', '이력 추가 완료: ' + currentGrpId);
      setTimeout(function(){ statusEl.textContent = ''; }, 5000);
    } else {
      statusEl.textContent = '❌ ' + data.message;
      statusEl.style.color = '#b91c1c';
    }
  })
  .catch(function(e){
    globalProgressFinish(false);
    statusEl.textContent = '❌ ' + e.message; statusEl.style.color = '#b91c1c';
  });
}

/* ── 시나리오 목록 엑셀 다운로드 (서버 생성) ────────────────────── */
function doExportScenariosExcel() {
  // renderScenarioTable 과 동일한 필터/중복제거 적용
  var filtered = scenarios.filter(function(s) {
    if (currentTab === '단위') return s.testType === '단위';
    return s.testType !== '단위';
  });
  var seenIds = {};
  var list = filtered.filter(function(s) {
    if (seenIds[s.scenarioId]) return false;
    seenIds[s.scenarioId] = true;
    return true;
  });

  var btn = document.querySelector('button[onclick="doExportScenariosExcel()"]');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ 생성 중...'; }

  fetch('<c:url value="/ai/exportScenarioList.do"/>', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: currentPrefix || 'pur', scenarios: list })
  })
  .then(function(r) {
    if (!r.ok) return r.text().then(function(t) { throw new Error('서버 오류 (' + r.status + '): ' + t.substring(0, 200)); });
    var cd = r.headers.get('Content-Disposition') || '';
    var fn = '통합테스트시나리오.xlsx';
    var m = cd.match(/filename\*=UTF-8''([^\s;]+)/i);
    if (!m) m = cd.match(/filename="?([^";\r\n]+)"?/i);
    if (m && m[1]) fn = decodeURIComponent(m[1].trim());
    return r.blob().then(function(blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a'); a.href = url; a.download = fn;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function() { URL.revokeObjectURL(url); }, 10000);
      showAlert('info', '📥 ' + fn + ' 다운로드 완료');
    });
  })
  .catch(function(e) { showAlert('error', '엑셀 다운로드 오류: ' + e.message); })
  .finally(function() {
    if (btn) { btn.disabled = false; btn.textContent = '📥 엑셀 다운로드'; }
  });
}
/* ── 통합 시나리오 직접 작성 모달 ──────────────────────────────────── */
function openIntegScenModal() {
  var modal = document.getElementById('integScenModal');
  if (!modal) return;
  // 필드 초기화
  ['im_testName','im_menuName','im_url','im_groupName','im_subCategory',
   'im_preCondition','im_inputValues','im_expectedResult','im_description'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  var crudSel = document.getElementById('im_crudType');
  if (crudSel) crudSel.value = 'SELECT';
  var errMsg = document.getElementById('im_errMsg');
  if (errMsg) errMsg.textContent = '';
  modal.style.display = 'flex';
  var nameEl = document.getElementById('im_testName');
  if (nameEl) setTimeout(function() { nameEl.focus(); }, 100);
}

function closeIntegScenModal() {
  var modal = document.getElementById('integScenModal');
  if (modal) modal.style.display = 'none';
}

function doSubmitIntegScen() {
  var errMsg = document.getElementById('im_errMsg');
  if (errMsg) errMsg.textContent = '';

  var testName = (document.getElementById('im_testName') || {}).value || '';
  if (!testName.trim()) {
    if (errMsg) errMsg.textContent = '시나리오명은 필수입니다.';
    var nameEl = document.getElementById('im_testName');
    if (nameEl) nameEl.focus();
    return;
  }

  // scenarioId 자동 생성: IT_NEW_001 형식
  var existing = scenarios.filter(function(s) { return s.scenarioId && /^IT_NEW_/.test(s.scenarioId); });
  var nextNum = existing.length + 1;
  var scenarioId = 'IT_NEW_' + ('000' + nextNum).slice(-3);

  var crudType      = (document.getElementById('im_crudType')      || {}).value || 'SELECT';
  var url           = ((document.getElementById('im_url')           || {}).value || '').trim();
  var menuName      = ((document.getElementById('im_menuName')      || {}).value || '').trim();
  var groupName     = ((document.getElementById('im_groupName')     || {}).value || '').trim();
  var subCategory   = ((document.getElementById('im_subCategory')   || {}).value || '').trim();
  var preCondition  = ((document.getElementById('im_preCondition')  || {}).value || '').trim();
  var inputValues   = ((document.getElementById('im_inputValues')   || {}).value || '').trim();
  var expectedResult= ((document.getElementById('im_expectedResult')|| {}).value || '').trim();
  var description   = ((document.getElementById('im_description')   || {}).value || '').trim();

  var no = (scenarios.length + 1);
  var obj = {
    no           : no,
    seq          : 1,
    scenarioId   : scenarioId,
    testType     : '통합',
    crudType     : crudType,
    url          : url,
    testName     : testName.trim(),
    menuName     : menuName,
    gnbName      : '',
    groupName    : groupName,
    subCategory  : subCategory,
    roleNm       : '사용자',
    preCondition : preCondition,
    testData     : inputValues,
    inputValues  : inputValues,
    expectedResult: expectedResult,
    description  : description,
    testResult   : '',
    confirmer    : '',
    plConfirm    : '',
    reason       : '',
    userConfirm  : '',
    edited       : true
  };

  scenarios.push(obj);

  // 통합 탭으로 전환
  if (typeof switchTab === 'function') switchTab('통합');

  if (typeof _refreshScenarioCounts === 'function') _refreshScenarioCounts();
  if (typeof renderScenarioTable    === 'function') renderScenarioTable(scenarios);

  // 편집됨 뱃지 표시
  var badge = document.getElementById('scenarioEditedBadge');
  if (badge) badge.style.display = 'inline-block';

  showAlert('info', '통합 시나리오 [' + scenarioId + '] 가 추가되었습니다.');
  closeIntegScenModal();
}

/* ── spec.ts LLM 생성 스트리밍 (SSE) ────────────────────────────── */
/* ── 테스트코드 재생성 ────────────────────────────────────────────── */
function doRegenSpec() {
  if (!currentPrefix) { showAlert('warning', '시나리오를 먼저 생성하세요.'); return; }

  // 진행 중인 스트림 중지
  if (specStreamEventSource) { specStreamEventSource.close(); specStreamEventSource = null; }

  // Step 2 완료 상태 초기화 (다시 생성하므로 미완료로)
  completedSteps[2] = false;
  updateNavStepState();

  // 재생성 버튼 스피너
  setLoading(document.getElementById('btnRegenSpec'), true);

  // spec.ts 재생성 시작 — 체크된 시나리오만 서버 STORE에 동기화 후 진행
  var checkedScenarios = getCheckedScenarios();
  if (!checkedScenarios.length) {
    setLoading(document.getElementById('btnRegenSpec'), false);
    showAlert('warning', '재생성할 시나리오를 1개 이상 체크하세요.');
    return;
  }
  var checkedIds = [];
  var _seen = {};
  checkedScenarios.forEach(function(s){
    if (!_seen[s.scenarioId]) { _seen[s.scenarioId] = true; checkedIds.push(s.scenarioId); }
  });
  fetch('<c:url value="/ai/syncScenariosToStore.do"/>', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: currentPrefix, scenarios: checkedScenarios })
  })
  .then(function(r){ return r.json(); })
  .then(function(){ doStartSpecStream(currentPrefix, checkedIds.join(',')); })
  .catch(function(e){
    setLoading(document.getElementById('btnRegenSpec'), false);
    showAlert('error', '시나리오 동기화 실패 — 다시 시도하세요.\n' + e.message);
  });
}

function doStartSpecStream(prefix, scenarioIds, singleRow) {
  if (specStreamEventSource) { specStreamEventSource.close(); specStreamEventSource = null; }
  var specProgressSection = document.getElementById('specProgressSection');
  var specProgressBar     = document.getElementById('specProgressBar');
  var specProgressText    = document.getElementById('specProgressText');
  var specProgressStatus  = document.getElementById('specProgressStatus');

  // 재생성 버튼 숨김
  var btnRegen = document.getElementById('btnRegenSpec');
  if (btnRegen) { btnRegen.style.display = 'none'; setLoading(btnRegen, false); }

  // 프로그레스 바 초기화
  if (specProgressBar)  { specProgressBar.style.width = '0%'; specProgressBar.style.background = 'linear-gradient(90deg,#1a3a5c,#2563eb)'; }
  if (specProgressText) specProgressText.textContent = '0%';
  if (specProgressStatus) specProgressStatus.textContent = 'spec.ts 생성 중...';
  if (specProgressSection) { specProgressSection.style.display = 'block'; specProgressSection.scrollIntoView({ behavior: 'smooth' }); }

  // 전역 프로그레스 시작
  globalProgressStart('spec.ts 생성 중...');

  function _finishSpecProgress(success) {
    globalProgressFinish(success);
    if (specProgressBar) {
      specProgressBar.style.width = '100%';
      specProgressBar.style.background = success
        ? 'linear-gradient(90deg,#16a34a,#22c55e)'
        : 'linear-gradient(90deg,#dc2626,#ef4444)';
    }
    if (specProgressText) specProgressText.textContent = '100%';
    setTimeout(function() { if (specProgressSection) specProgressSection.style.display = 'none'; }, 1500);
  }

  // 서버 SSE progress 이벤트로 정확한 % 업데이트
  var _specCollectedLogs = [];

  var url = '<c:url value="/ai/generateSpecStream.do"/>?prefix=' + encodeURIComponent(prefix);
  if (scenarioIds && scenarioIds.length) {
    url += '&scenarioIds=' + encodeURIComponent(scenarioIds);
  }
  if (singleRow) {
    url += '&singleRow=true';
  }
  var creatorNameVal = (document.getElementById('creatorNameInput') || {}).value || '';
  if (creatorNameVal.trim()) {
    url += '&creatorName=' + encodeURIComponent(creatorNameVal.trim());
  }
  var sessionLabel = singleRow
    ? 'spec.ts 생성 (' + prefix.toUpperCase() + ' · 단일 TC: ' + (scenarioIds || '') + ')'
    : 'spec.ts 생성 (' + prefix.toUpperCase() + (scenarioIds ? ' · ' + scenarioIds.split(',').length + '개 시나리오' : '') + ')';
  genSessionStart('spec', sessionLabel);
  specStreamEventSource = new EventSource(url);
  specStreamEventSource.addEventListener('log', function(e) {
    console.log('[spec.ts 생성]', e.data);
    _specCollectedLogs.push(e.data);
    addGenLog('spec', e.data);
  });
  specStreamEventSource.addEventListener('progress', function(e) {
    var parts = e.data.split('/');
    var done  = parseInt(parts[0], 10) || 0;
    var total = parseInt(parts[1], 10) || 1;
    var pct   = Math.min(95, Math.round((done / total) * 90) + 5);
    clearInterval(_specTimer);
    if (specProgressBar)  specProgressBar.style.width = pct + '%';
    if (specProgressText) specProgressText.textContent = pct + '%';
    if (specProgressStatus) specProgressStatus.textContent = done + ' / ' + total + '개';
  });
  specStreamEventSource.addEventListener('done', function(e) {
    genSessionEnd('done');
    specStreamEventSource.close(); specStreamEventSource = null;
    var payload = e.data || '';
    var firstPipe = payload.indexOf('|');
    var extractedFileName = firstPipe > 0 ? payload.substring(0, firstPipe).trim() : '';
    if (extractedFileName.endsWith('.spec.ts')) {
      currentSpecFileName = extractedFileName;
    }
    var expectedMatch = payload.match(/expected:(\d+)/);
    var createdMatch  = payload.match(/created:(\d+)/);
    var created  = createdMatch  ? parseInt(createdMatch[1],  10) : 0;
    var expected = expectedMatch ? parseInt(expectedMatch[1], 10) : 0;
    var unitOkMatch = payload.match(/단위 (\d+)개/);
    var unitOk = unitOkMatch ? parseInt(unitOkMatch[1], 10) : 0;
    // created >= expected (완전 성공)만 성공으로 표시 — 예전엔 created >= 1 (하나라도 생성)이면
    // 성공 처리해서, expected=2인데 1개만 만들어진 부분 실패도 "생성 완료"로 잘못 표시됐다.
    if (expected > 0 && created >= expected) {
      _finishSpecProgress(true);
      if (specProgressStatus) specProgressStatus.textContent = '완료: ' + (currentSpecFileName || '');
      var msg = 'spec.ts 생성 완료: ' + (currentSpecFileName || '(파일명 미확인)');
      if (unitOk > 0) msg += ' + 단위 spec 1개';
      var specInfo = document.getElementById('specFileInfo');
      if (specInfo && currentSpecFileName) specInfo.textContent = currentSpecFileName;
      if (btnRegen) btnRegen.style.display = 'inline-flex';
      /* spec 생성 완료 → 이력 그리드 자동 새로고침 + 미리보기 */
      setTimeout(function(){ loadTcGenHistGrid(); }, 500);
      setTimeout(function(){ loadSpecPreview(currentSpecFileName); }, 800);
      /* [테스트] 버튼으로 호출된 경우 자동 실행 (패널 이동 없음) */
      if (_autoRunOnSpecDone) {
        _autoRunOnSpecDone = false;
        var _rowNo = _singleRowNo; _singleRowNo = null;
        var _specName = currentSpecFileName || 'spec.ts';
        showAlert('success', '✅ ' + _specName + ' 가 생성되었습니다.');
        setTimeout(function() {
          if (!confirm('테스트 코드를 실행하시겠습니까?\n\n파일: ' + _specName)) return;
          doRunTest(_rowNo, getHeadedSetting());
        }, 700);
      } else {
        showAlert('info', '✅ spec.ts 생성 완료.');
      }
    } else {
      _finishSpecProgress(false);
      var failMsg = 'spec.ts 생성 실패 (' + created + '/' + expected + '개). TOOLS → 생성 로그를 확인하세요.';
      showAlert('warning', failMsg);
      saveErrorLog('spec_gen_fail', failMsg, _specCollectedLogs.join('\n'));
      if (btnRegen) btnRegen.style.display = 'inline-flex';
    }
  });
  specStreamEventSource.addEventListener('error', function(e) {
    genSessionEnd('error');
    specStreamEventSource.close(); specStreamEventSource = null;
    _finishSpecProgress(false);
    var errMsg = e.data || '알 수 없는 오류';
    saveErrorLog('spec_gen_error', errMsg, _specCollectedLogs.join('\n'));
    if (e.data) showApiError(e.data);
    if (btnRegen) btnRegen.style.display = 'inline-flex';
  });
}

/* 개선방안(fixSuggestion) 셀 HTML — SSE result 수신 시 서버가 함께 내려주는
   "[조치가능도: ...] 원인+수정제안" 텍스트를 결함패널(.defect-fix)과 동일한
   스타일로 렌더링한다. 값이 없으면(PASS 또는 아직 미실행) 빈 문자열. */
function renderFixSuggestionHtml(fixSuggestion) {
  if (!fixSuggestion) return '';
  return '<div style="background:#fffbeb;border-left:3px solid #f59e0b;padding:4px 8px;border-radius:0 4px 4px 0">'
    + '<span style="font-size:10px;font-weight:700;color:#92400e;display:block;margin-bottom:2px">🔧 개선방안</span>'
    + esc(fixSuggestion).replace(/\n/g, '<br>') + '</div>';
}

/* ══════════════════════════════════════════════════════════
   시나리오 테이블 렌더링 + 인라인 편집
   ══════════════════════════════════════════════════════════ */
function renderScenarioTable(list) {
  var tbody = document.getElementById('scenarioBody');
  tbody.innerHTML = '';
  var filtered = list.filter(function(s){
    if (currentTab === '단위') return s.testType === '단위';
    return s.testType !== '단위';
  });

  /* 단위: 모든 행 표시 (scenarioId 중복 포함)
     통합: scenarioId별 첫 번째 행만 표시 (나머지는 더블클릭 팝업으로 확인) */
  var displayList;
  if (currentTab === '단위') {
    displayList = filtered;
  } else {
    var seenIds = {};
    displayList = filtered.filter(function(s){
      if (seenIds[s.scenarioId]) return false;
      seenIds[s.scenarioId] = true;
      return true;
    });
  }

  var _dispNo = 0;
  displayList.forEach(function(s){
    _dispNo++;
    var tr = document.createElement('tr');
    tr.id = 'srow' + s.no;
    if (currentTab !== '단위') {
      tr.style.cursor = 'pointer';
      tr.title = '더블클릭: 동일 시나리오ID 상세 보기';
      tr.ondblclick = (function(sid){ return function(){ doScenDetailPopup(sid); }; })(s.scenarioId);
    }

    var crudClass = 'badge-crud crud-' + (s.crudType || '기타');
    var typeLabel = s.testType || '통합';
    var typeClass = 'badge-type type-' + typeLabel;

    var grpVal  = s.groupName   || '';
    var subVal  = s.subCategory || '';
    var menuVal = s.menuName    || '';
    var grpColor  = grpVal  ? '#555'    : '#ccc';
    var subColor  = subVal  ? '#555'    : '#ddd';
    var menuColor = menuVal ? '#1a5c3a' : '#ccc';

    /* DEV_PASS 배지 (클릭으로 수동 수정 가능) */
    var devBadge = renderPassYn(s.DEV_PASS !== undefined ? s.DEV_PASS : s.testResult === '통과' ? 'Y' : s.testResult === '미통과' ? 'N' : null);
    var trSel = '<div style="position:relative;display:inline-block">'
      + '<span id="devpass' + s.no + '" onclick="toggleDevPass(' + s.no + ')" '
      + 'style="cursor:pointer" title="클릭하여 통과여부 변경 (Y→N→미설정 순환)">' + devBadge + '</span>'
      + '<span id="tstat' + s.no + '" style="display:none;position:absolute;inset:0;font-size:10px;font-weight:700;'
      + 'background:#fef9c3;color:#92400e;border:1px solid #f59e0b;border-radius:3px;'
      + 'align-items:center;justify-content:center;pointer-events:none"></span>'
      + '</div>';

    /* PL_PASS 배지 (읽기 전용 — doTest_summary.jsp에서 갱신) */
    var plSel = '<span id="plpass' + s.no + '">' + renderPassYn(s.PL_PASS !== undefined ? s.PL_PASS : null) + '</span>';

    /* REMARK — 항상 편집 가능 */
    var reasonStyle = 'font-size:11px;color:#555';

    tr.innerHTML =
      '<td style="text-align:center">' +
        '<input type="checkbox" class="scen-chk" data-scen-id="' + esc(s.scenarioId) + '"' +
          ' data-scen-no="' + s.no + '"' +
          ' checked style="width:14px;height:14px;cursor:pointer;accent-color:#1a3a5c">' +
      '</td>' +
      '<td style="text-align:center;color:#666;font-size:11px">' + _dispNo + '</td>' +
      '<td style="text-align:center"><span class="' + typeClass + '">' + esc(typeLabel) + '</span></td>' +
      '<td style="font-size:11px;color:#555">' + esc(s.scenarioId) + '</td>' +
      /* 시나리오명 = 메뉴명(동일 표기), 설명 = 상세 테스트명(기존 시나리오명 내용) */
      '<td><span class="edit-cell" style="color:' + menuColor + '" data-editable="true" data-no="' + s.no + '" data-field="menuName">' + esc(menuVal || '(없음)') + '</span></td>' +
      '<td><span class="edit-cell" style="font-size:11px;color:#555" data-editable="true" data-no="' + s.no + '" data-field="testName">' + esc(s.testName || '') + '</span></td>' +
      '<td><span class="edit-cell" style="font-size:11px;color:#555" data-editable="true" data-no="' + s.no + '" data-field="roleNm">' + esc(s.roleNm || '') + '</span></td>' +
      '<td><span class="edit-cell" style="font-size:11px;color:' + grpColor + '" data-editable="true" data-no="' + s.no + '" data-field="groupName">' + esc(grpVal || '(없음)') + '</span></td>' +
      '<td><span class="edit-cell" style="font-size:11px;color:' + subColor + '" data-editable="true" data-no="' + s.no + '" data-field="subCategory">' + esc(subVal || '-') + '</span></td>' +
      '<td><span class="edit-cell" style="font-size:11px;color:' + menuColor + '" data-editable="true" data-no="' + s.no + '" data-field="menuName">' + esc(menuVal || '(없음)') + '</span></td>' +
      '<td><span class="edit-cell" data-editable="true" data-no="' + s.no + '" data-field="preCondition">' + esc(s.preCondition || '') + '</span></td>' +
      '<td><span class="edit-cell" data-editable="true" data-no="' + s.no + '" data-field="inputValues">' + esc(s.inputValues || '') + '</span></td>' +
      '<td><span class="edit-cell" data-editable="true" data-no="' + s.no + '" data-field="expectedResult">' + esc((s.expectedResult || '').split('\n')[0]) + '</span></td>' +
      '<td id="tres' + s.no + '" style="text-align:center">' + trSel + '</td>' +
      '<td><span id="failReason' + s.no + '" style="font-size:11px;color:#b91c1c">' + esc(s.failReason || '') + '</span></td>' +
      '<td><div id="fixSuggestion' + s.no + '">' + renderFixSuggestionHtml(s.fixSuggestion) + '</div></td>' +
      '<td style="display:none"><span class="edit-cell" style="font-size:11px;color:#555" data-editable="true" data-no="' + s.no + '" data-field="confirmer">' + esc(s.confirmer || '') + '</span></td>' +
      '<td style="text-align:center">' + plSel + '</td>' +
      '<td><span class="edit-cell" id="reason' + s.no + '" style="' + reasonStyle + '" data-editable="true" data-no="' + s.no + '" data-field="REMARK">' + esc(s.REMARK || s.reason || '') + '</span></td>' +
      '<td style="text-align:center"><span id="userpass' + s.no + '">' + renderPassYn(s.USER_PASS !== undefined ? s.USER_PASS : null) + '</span></td>' +
      '<td style="text-align:center"><button class="row-test-btn" style="font-size:11px;padding:2px 7px;background:#1a3a5c;color:#fff;border:none;border-radius:3px;cursor:pointer">테스트</button></td>';

    /* [테스트] 버튼 이벤트: 해당 행만 체크 후 spec생성→자동실행 */
    (function(rowNo, sid){
      tr.querySelector('.row-test-btn').addEventListener('click', function(e){
        e.stopPropagation();
        doTestForRow(rowNo, sid);
      });
    })(s.no, s.scenarioId);

    tbody.appendChild(tr);
  });

  var chkAll = document.getElementById('chkAllScen');
  if (chkAll) chkAll.checked = (displayList.length > 0);
}

/* ── 시나리오 인라인 편집 — 셀 내부 textarea (Nexacro displaytype=textarea 재현) ── */
var _editCell = null;   // 현재 편집 중인 .edit-cell span
var _editTa   = null;   // 셀 내부에 삽입된 textarea
var _editOrig = '';     // Esc 복원용 원본 값

function _openCellEditor(el) {
  if (_editTa) _closeCellEditor(true);   // 이전 셀 먼저 저장

  var td = el.closest('td');
  if (!td) return;

  _editCell = el;
  _editOrig = el.textContent;

  el.style.display = 'none';   // 스팬 숨김

  var ta = document.createElement('textarea');
  ta.value = _editOrig;
  ta.className = 'scen-cell-editor';

  td.appendChild(ta);
  _editTa = ta;

  ta.focus();
  ta.setSelectionRange(ta.value.length, ta.value.length);

  ta.addEventListener('blur', function() { _closeCellEditor(true); });
  ta.addEventListener('keydown', function(e) {
    if (e.key === 'Escape')               { e.preventDefault(); _closeCellEditor(false); }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _closeCellEditor(true);  }
    // Shift+Enter → 줄바꿈 허용
  });
}

function _closeCellEditor(save) {
  if (!_editTa || !_editCell) return;
  var ta   = _editTa;
  var cell = _editCell;
  // 재진입 방지: globals 먼저 초기화
  _editTa = null; _editCell = null;

  var value = save ? ta.value : _editOrig;
  ta.remove();
  cell.style.display = '';
  cell.textContent   = value;

  if (save) {
    updateScenario(parseInt(cell.dataset.no, 10), cell.dataset.field, value);
    cell.classList.add('edited');
    var badge = document.getElementById('scenarioEditedBadge');
    if (badge) badge.style.display = 'inline-block';
  }
}

/* 셀 클릭 → 에디터 오픈 (이벤트 위임) */
(function() {
  var tbody = document.getElementById('scenarioBody');
  if (!tbody) return;
  tbody.addEventListener('click', function(e) {
    var el = e.target;
    if (!el.classList.contains('edit-cell')) return;
    if (el.dataset.editable === 'false') return;   // 편집 불가 셀 제외
    e.stopPropagation();
    _openCellEditor(el);
  });
})();

function updateScenario(no, field, value) {
  for (var i = 0; i < scenarios.length; i++) {
    if (scenarios[i].no === no) {
      scenarios[i][field] = value;
      break;
    }
  }
}

function clearScenarioTable() {
  document.getElementById('scenarioBody').innerHTML = '';
  var badge = document.getElementById('scenarioEditedBadge');
  if (badge) badge.style.display = 'none';
}

/* ── 행추가 ─────────────────────────────────────────────────────── */
function doAddRow() {
  var maxNo = 0;
  scenarios.forEach(function(s){ if ((s.no || 0) > maxNo) maxNo = s.no; });
  var newNo = maxNo + 1;
  var newType = currentTab === '단위' ? '단위' : '통합';
  var prefix  = (newType === '단위' ? 'UT' : 'IT') + '_NEW_' + String(newNo).padStart(3, '0');
  scenarios.push({
    no: newNo, seq: 1, scenarioId: prefix, testType: newType,
    crudType: '', testName: '', description: '', roleNm: (newType === '단위' ? '개발자' : '사용자'),
    groupName: '', subCategory: '', menuName: '',
    preCondition: '', inputValues: '', expectedResult: '', testResult: '',
    confirmer: '',
    plConfirm: '', reason: '', userConfirm: ''
  });
  _refreshScenarioCounts();
  renderScenarioTable(scenarios);
  var badge = document.getElementById('scenarioEditedBadge');
  if (badge) badge.style.display = 'inline-block';
}

/* ── 행삭제 (체크된 행) ──────────────────────────────────────────── */
function doDeleteRows() {
  var checked = [];
  document.querySelectorAll('#scenarioBody .scen-chk:checked').forEach(function(chk){
    checked.push(chk.dataset.scenId);
  });
  if (!checked.length) { alert('삭제할 행을 먼저 체크하세요.'); return; }
  if (!confirm(checked.length + '건을 삭제하시겠습니까?')) return;
  var sid2no = {};
  scenarios.forEach(function(s){ sid2no[s.scenarioId] = s.no; });
  var toDelete = checked.map(function(sid){ return sid2no[sid]; }).filter(Boolean);
  scenarios = scenarios.filter(function(s){ return toDelete.indexOf(s.no) === -1; });
  // no 재부여
  scenarios.forEach(function(s, i){ s.no = i + 1; });
  _refreshScenarioCounts();
  renderScenarioTable(scenarios);
  var badge = document.getElementById('scenarioEditedBadge');
  if (badge) badge.style.display = 'inline-block';
}

/* 통합테스트: scenarioId GROUP BY 개수 반환 */
function _integScenCount(list) {
  var seen = {};
  (list || scenarios).forEach(function(s) {
    if (s.testType !== '단위' && s.scenarioId) seen[s.scenarioId] = 1;
  });
  return Object.keys(seen).length;
}

function _refreshScenarioCounts() {
  var integCnt = _integScenCount();
  var unitCnt  = scenarios.filter(function(s){ return s.testType === '단위'; }).length;
  var ib = document.getElementById('integCountBadge');
  var ub = document.getElementById('unitCountBadge');
  var cb = document.getElementById('scenarioCountBadge');
  if (ib) ib.textContent = '(' + integCnt + ')';
  if (ub) ub.textContent = '(' + unitCnt  + ')';
  if (cb) cb.textContent = '(전체 ' + scenarios.length + '건)';
}

/* result.md §9.5 — 단계별 결과 배지 렌더링 */
function renderStepResult(val) {
  if (val === 'PASS') return '<span class="result-pass">PASS</span>';
  if (val === 'FAIL') return '<span class="result-fail">FAIL</span>';
  if (val === 'SKIP') return '<span style="color:#9ca3af">SKIP</span>';
  return '<span style="color:#9ca3af">-</span>';
}

/* ── scenarioId별 상세 팝업 ─────────────────────────────────────── */
function doScenDetailPopup(scenarioId) {
  /* 해당 scenarioId의 모든 행 추출 — scenarios 배열 순서 유지 */
  var rows = scenarios.filter(function(s){ return s.scenarioId === scenarioId; });
  if (!rows.length) return;
  var modal = document.getElementById('scenDetailModal');
  var modalTitle = document.getElementById('scenDetailTitle');
  var modalBody  = document.getElementById('scenDetailBody');
  if (modalTitle) modalTitle.textContent = '시나리오 상세: ' + scenarioId + '  (총 ' + rows.length + '건)';
  /* PL확인·사유·사용자확인 제외 13컬럼. 순번은 로컬 인덱스(1~N) 사용 */
  /* w: 헤더 고정폭(px), wide: 긴텍스트 컬럼(pre-wrap + 넓게) */
  var dataCols = [
    { key: 'testType',       label: '구분',        w: '52px'  },
    { key: 'testName',       label: '테스트명',     w: '160px' },
    { key: 'roleNm',         label: '엑터(역할)',   w: '90px'  },
    { key: 'groupName',      label: '중분류',       w: '90px'  },
    { key: 'subCategory',    label: '소분류',       w: '90px'  },
    { key: 'menuName',       label: '메뉴명',       w: '110px' },
    { key: 'preCondition',   label: '시나리오흐름',  w: '320px', wide: true },
    { key: 'inputValues',    label: '입력값',       w: '320px', wide: true },
    { key: 'expectedResult', label: '예상결과',     w: '240px', wide: true },
    { key: 'testResult',     label: '테스트결과',   w: '90px'  }
  ];
  var html = '<table style="table-layout:fixed;width:100%;border-collapse:collapse;font-size:12px">' +
    '<colgroup><col style="width:36px">';
  dataCols.forEach(function(c){ html += '<col style="width:' + c.w + '">'; });
  html += '</colgroup>' +
    '<thead><tr style="background:#1a3a5c;color:#fff;position:sticky;top:0">' +
    '<th style="padding:6px 8px;text-align:center;white-space:nowrap">순번</th>';
  dataCols.forEach(function(c){
    html += '<th style="padding:6px 8px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + c.label + '</th>';
  });
  html += '</tr></thead><tbody>';
  rows.forEach(function(s, idx){
    html += '<tr style="background:' + (idx % 2 === 0 ? '#f9fafb' : '#fff') + ';border-bottom:1px solid #e5e7eb">';
    /* 순번: 1~N (로컬 인덱스) */
    html += '<td style="padding:5px 8px;text-align:center;font-weight:600;color:#1a3a5c">' + (idx + 1) + '</td>';
    dataCols.forEach(function(c){
      var tdStyle = c.wide
        ? 'padding:5px 8px;vertical-align:top;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere'
        : 'padding:5px 8px;vertical-align:top;white-space:normal;overflow:hidden;text-overflow:ellipsis';
      html += '<td style="' + tdStyle + '">' + esc(String(s[c.key] || '')) + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table>';

  /* result.md §9.5 — 통합 시나리오: flowSteps 단계별 결과 표 추가 */
  var integRows = rows.filter(function(s){ return s.testType !== '단위' && s.flowSteps && s.flowSteps.length > 0; });
  if (integRows.length > 0) {
    html += '<div style="margin-top:14px;font-size:12px;font-weight:700;color:#1a3a5c;border-top:2px solid #1a3a5c;padding-top:8px">플로우 단계별 결과</div>';
    integRows.forEach(function(s) {
      html += '<div style="font-size:11px;color:#666;margin:4px 0 2px">▶ ' + esc(s.testName || s.scenarioId) + '</div>';
      html += '<table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:8px">'
            + '<thead><tr style="background:#374151;color:#fff">'
            + '<th style="padding:4px 8px;text-align:center;width:40px">단계</th>'
            + '<th style="padding:4px 8px;text-align:left">URL</th>'
            + '<th style="padding:4px 8px;text-align:left">서비스ID</th>'
            + '<th style="padding:4px 8px;text-align:left">예상결과</th>'
            + '<th style="padding:4px 8px;text-align:center;width:60px">결과</th>'
            + '</tr></thead><tbody>';
      s.flowSteps.forEach(function(fs, fi) {
        html += '<tr style="background:' + (fi % 2 === 0 ? '#f9fafb' : '#fff') + ';border-bottom:1px solid #e5e7eb">'
              + '<td style="padding:4px 8px;text-align:center">' + (fs.step || fi + 1) + '</td>'
              + '<td style="padding:4px 8px;font-family:monospace;font-size:10px">' + esc(fs.url || '') + '</td>'
              + '<td style="padding:4px 8px">' + esc(fs.serviceId || '') + '</td>'
              + '<td style="padding:4px 8px">' + esc(fs.expectedResult || '') + '</td>'
              + '<td style="padding:4px 8px;text-align:center">' + renderStepResult(fs.stepResult) + '</td>'
              + '</tr>';
      });
      html += '</tbody></table>';
    });
  }

  if (modalBody) modalBody.innerHTML = html;
  if (modal) modal.style.display = 'flex';
}

/* ── 그리드 행 [테스트] 버튼: 해당 시나리오 spec.ts 생성 후 자동 실행 ─── */
var _autoRunOnSpecDone = false;
var _singleRowNo = null;   // 행 no 저장 → spec done 후 해당 행만 실행
function doTestForRow(no, scenarioId) {
  if (!confirm('테스트코드를 생성하시겠습니까?')) return;
  document.querySelectorAll('#scenarioBody .scen-chk').forEach(function(chk){
    chk.checked = (chk.dataset.scenId === scenarioId);
  });
  var syncPrefix = currentPrefix || 'user';
  fetch('<c:url value="/ai/syncScenariosToStore.do"/>', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: syncPrefix, scenarios: scenarios })
  })
  .then(function(r) { return r.json(); })
  .then(function(d) {
    _autoRunOnSpecDone = true;
    _singleRowNo = no;
    doStartSpecStream(syncPrefix, scenarioId, true);
  })
  .catch(function() {
    _autoRunOnSpecDone = true;
    _singleRowNo = no;
    doStartSpecStream(syncPrefix, scenarioId, true);
  });
}

/* ── PL확인 변경 처리 ────────────────────────────────────────────── */
/* ── result.md §3.1 — 통과여부 배지 렌더링 ─────────────────────── */
function renderPassYn(val) {
  if (val === 'Y') return '<span class="result-pass">통과</span>';
  if (val === 'N') return '<span class="result-fail">미통과</span>';
  return '<span style="color:#9ca3af">-</span>';
}

/* ── result.md §4.1 — 개별 행 통과여부 배지 재렌더링 ──────────── */
function refreshGridRow(no) {
  var row = null;
  for (var i = 0; i < scenarios.length; i++) {
    if (scenarios[i].no === no) { row = scenarios[i]; break; }
  }
  if (!row) return;
  var devEl  = document.getElementById('devpass'  + no);
  var plEl   = document.getElementById('plpass'   + no);
  var userEl = document.getElementById('userpass' + no);
  if (devEl)  devEl.innerHTML  = renderPassYn(row.DEV_PASS);
  if (plEl)   plEl.innerHTML   = renderPassYn(row.PL_PASS);
  if (userEl) userEl.innerHTML = renderPassYn(row.USER_PASS);
}

/* ── 테스트결과 셀(tres{no}) PASS/FAIL 배지 갱신 ─────────────────── */
function refreshTestResultCell(no, status) {
  var td = document.getElementById('tres' + no);
  if (!td) return;
  /* 기존 devpass/tstat는 유지하고 PASS/FAIL 배지를 상단에 삽입 */
  var existing = document.getElementById('testResultBadge' + no);
  if (!existing) {
    existing = document.createElement('div');
    existing.id = 'testResultBadge' + no;
    existing.style.cssText = 'font-size:11px;font-weight:700;margin-bottom:2px';
    td.insertBefore(existing, td.firstChild);
  }
  if (status === 'PASS') {
    existing.innerHTML = '<span class="result-pass">PASS</span>';
  } else if (status === 'FAIL') {
    existing.innerHTML = '<span class="result-fail">FAIL</span>';
  } else {
    existing.innerHTML = '';
  }
}

/* ── DEV_PASS 수동 토글 (Y → N → null 순환) ────────────────────── */
function toggleDevPass(no) {
  var row = null;
  for (var i = 0; i < scenarios.length; i++) {
    if (scenarios[i].no === no) { row = scenarios[i]; break; }
  }
  if (!row) return;
  row.DEV_PASS = (row.DEV_PASS === 'Y') ? 'N' : (row.DEV_PASS === 'N') ? null : 'Y';
  var devEl = document.getElementById('devpass' + no);
  if (devEl) devEl.innerHTML = renderPassYn(row.DEV_PASS);

  /* DB 반영 */
  fetch('<c:url value="/ai/updatePassStatus.do"/>', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'scenarioId=' + encodeURIComponent(row.scenarioId || '')
        + '&testType='  + encodeURIComponent(row.testType === '단위' ? 'unit' : 'integ')
        + '&passLevel=DEV'
        + '&passYn='    + encodeURIComponent(row.DEV_PASS || '')
        + '&remark='    + encodeURIComponent(row.REMARK || '')
  }).catch(function(){});
}

/* 브라우저 표시 여부는 #chkHeaded 체크박스 설정을 그대로 쓴다 — 예전에는 실행 확인 다음에
   "브라우저를 표시하면서 테스트할까요?" 확인창을 한 번 더 띄워 [취소]를 headless 선택으로
   처리했는데, 사용자가 [취소] = "테스트 안 함"으로 기대하는데도 실제로는 headless로 실행돼
   버려서 혼란을 줬다. 확인창은 "실행하시겠습니까?" 한 번만 남기고, headed 여부는 체크박스로 뺐다. */
function getHeadedSetting() {
  var chk = document.getElementById('chkHeaded');
  return chk ? chk.checked : false;
}

/* ── 테스트 버튼 클릭 핸들러 ── */
function onClickRunTestBtn() {
  if (!currentSpecFileName) { alert('테스트 코드(spec.ts)를 먼저 생성하거나 불러오세요.'); return; }
  if (!confirm('테스트 코드를 실행하시겠습니까?\n\n파일: ' + currentSpecFileName)) return;
  doRunTest(null, getHeadedSetting());
}

/* ── BroadcastChannel (doTest_log.jsp 실시간 로그 연동) ────────── */
var _runLogChannel = null;
try { _runLogChannel = new BroadcastChannel('playwright-run-log'); } catch(e) {}
function _bcSend(msg) {
  if (_runLogChannel) try { _runLogChannel.postMessage(msg); } catch(e) {}
}

var _genLogChannel = null;
try { _genLogChannel = new BroadcastChannel('playwright-gen-log'); } catch(e) {}
function _bcGenSend(msg) {
  if (_genLogChannel) try { _genLogChannel.postMessage(msg); } catch(e) {}
}

/* ── 테스트 실행 (SSE) ──────────────────────────────────────────── */
/* singleRowNo: [테스트] 버튼 클릭 시 해당 행 no 전달 → 결과를 그 행에만 반영 */
/* headedOverride: true/false 로 전달 시 confirm 생략, undefined 시 직접 confirm */
function doRunTest(singleRowNo, headedOverride) {
  if (!currentSpecFileName) { alert('테스트 코드(spec.ts)를 먼저 생성하거나 불러오세요.'); return; }
  if (headedOverride === undefined || headedOverride === null) {
    if (!confirm('테스트 코드를 실행하시겠습니까?\n\n파일: ' + currentSpecFileName)) return;
    headedOverride = getHeadedSetting();
  }
  console.log('[DEBUG] doRunTest 호출, singleRowNo=', singleRowNo, ', specFileName=', currentSpecFileName, ', headed=', headedOverride);
  if (!currentSpecFileName) { alert('테스트 코드(spec.ts)를 먼저 생성하거나 불러오세요.'); return; }
  if (testEventSource) { testEventSource.close(); testEventSource = null; }

  var btn      = document.getElementById('btnRunTest');
  var btnStop  = document.getElementById('btnStopTest');
  var statusEl = document.getElementById('runStatus');

  setLoading(btn, true); btnStop.disabled = false;
  statusEl.textContent = 'Playwright 실행 중...';
  document.getElementById('resultSection').style.display = 'none';
  document.getElementById('btnDownload').disabled = true;
  var bmeReset = document.getElementById('btnMultiExport'); if (bmeReset) bmeReset.disabled = true;
  var logSection = document.getElementById('logSection');
  var logEl = document.getElementById('playwrightLog');
  logEl.textContent = ''; logSection.style.display = 'block';

  /* 진행률 — 전역 상단 프로그레스 바 하나만 사용 (Panel 3 로컬 바는 중복이라 제거) */
  var _runTotal = singleRowNo != null ? 1 : scenarios.length;
  var _runDone  = 0;

  function _updateRunProgress(done) {
    _runDone = done;
    globalProgressStep(done, _runTotal);
    runningBadgeUpdate(done, _runTotal);
  }

  /* 실행로그 세션 시작 */
  var _runLabel = singleRowNo != null
    ? 'TC #' + singleRowNo + ' — ' + currentSpecFileName
    : currentSpecFileName + ' (' + _runTotal + '건)';
  runSessionStart(_runLabel);
  globalProgressStart('테스트 실행 중... — ' + _runLabel);
  runningBadgeShow('테스트 실행중 0/' + _runTotal);

  /* BroadcastChannel 시작 알림 */
  _bcSend({ type: 'start', label: _runLabel, total: _runTotal });

  /* singleRow 모드: 해당 행만 '실행중' 표시, 나머지 행은 건드리지 않음 */
  if (singleRowNo != null) {
    var ts = document.getElementById('tstat' + singleRowNo);
    if (ts) { ts.style.display = 'flex'; ts.textContent = '실행중'; }
  } else {
    scenarios.forEach(function(s){ var ts = document.getElementById('tstat' + s.no); if (ts) { ts.style.display = 'none'; ts.textContent = ''; } });
  }

  var headed = (headedOverride !== undefined && headedOverride !== null) ? headedOverride : document.getElementById('chkHeaded').checked;
  console.log('[DEBUG] runTest.do 호출, headed=', headed, ', prefix=', currentPrefix, ', specFileName=', currentSpecFileName);
  var url = '<c:url value="/ai/runTest.do"/>?prefix=' + encodeURIComponent(currentPrefix) + '&headed=' + headed;
  if (currentSpecFileName) url += '&specFileName=' + encodeURIComponent(currentSpecFileName);
  if (singleRowNo != null) url += '&singleRowNo=' + singleRowNo;
  testEventSource = new EventSource(url);

  testEventSource.addEventListener('log', function(e){
    var logEl = document.getElementById('playwrightLog');
    if (logEl) { logEl.textContent += e.data + '\n'; logEl.scrollTop = logEl.scrollHeight; }
    addRunLog(e.data);
    _bcSend({ type: 'log', msg: e.data });
  });
  testEventSource.addEventListener('running', function(e){
    var parts = e.data.split('|'); var no = parseInt(parts[0], 10);
    /* singleRow 모드: 지정된 행만 '실행중' 표시 */
    if (singleRowNo != null && no !== singleRowNo) return;
    var ts = document.getElementById('tstat' + no);
    if (ts) { ts.style.display = 'flex'; ts.textContent = '실행중'; }
    var globalLbl = document.getElementById('globalProgressLabel');
    if (globalLbl) {
      var tcName = '';
      for (var _ri = 0; _ri < scenarios.length; _ri++) {
        if (scenarios[_ri].no === no) { tcName = scenarios[_ri]['테스트명'] || ''; break; }
      }
      globalLbl.textContent = 'TC #' + no + (tcName ? ' · ' + tcName : '') + ' 테스트 중...';
    }
  });
  testEventSource.addEventListener('result', function(e){
    /* result.md §9.4 — JSON 형식: {"type":"result","no":N,"status":"PASS","stepResults":[...],"remark":""} */
    var data;
    try { data = JSON.parse(e.data); } catch(ex) { return; }
    var no         = data.no;
    var testResult = data.status;
    var remark     = data.remark || '';
    var fixSuggestion = data.fixSuggestion || '';
    var stepResults = data.stepResults || [];

    if (singleRowNo != null && no !== singleRowNo) return;
    var ts = document.getElementById('tstat' + no); if (ts) { ts.style.display = 'none'; ts.textContent = ''; }

    for (var i = 0; i < scenarios.length; i++) {
      if (scenarios[i].no === no) {
        /* result.md §4.1 — DEV_PASS 자동 설정 (Y/N) */
        scenarios[i].DEV_PASS   = (testResult === 'PASS' ? 'Y' : 'N');
        scenarios[i].testResult = testResult;   /* PASS / FAIL 원문 저장 */
        scenarios[i].REMARK     = remark;
        scenarios[i].failReason = (testResult === 'FAIL' ? remark : '');
        scenarios[i].fixSuggestion = fixSuggestion;
        /* result.md §9.1 — 통합 시나리오 단계별 결과 저장 */
        if (stepResults.length > 0 && scenarios[i].flowSteps) {
          stepResults.forEach(function(sr) {
            var fs = (scenarios[i].flowSteps || []).find(function(f){ return f.step === sr.step; });
            if (fs) fs.stepResult = sr.stepResult;
          });
        }
        refreshGridRow(no);
        /* 테스트결과 컬럼(tres{no}) 직접 갱신 */
        refreshTestResultCell(no, testResult);
        /* 실패사유 컬럼(failReason{no}) 직접 갱신 */
        var frEl = document.getElementById('failReason' + no);
        if (frEl) frEl.textContent = (testResult === 'FAIL' ? remark : '');
        /* 개선방안 컬럼(fixSuggestion{no}) 직접 갱신 */
        var fsEl = document.getElementById('fixSuggestion' + no);
        if (fsEl) fsEl.innerHTML = renderFixSuggestionHtml(fixSuggestion);

        /* DB 저장 — updatePassStatus.do (result.md §5.1) */
        var _sid   = scenarios[i].scenarioId;
        var _ttype = (scenarios[i].testType === '단위' ? 'unit' : 'integ');
        fetch('<c:url value="/ai/updatePassStatus.do"/>', {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: 'scenarioId=' + encodeURIComponent(_sid)
              + '&testType='  + encodeURIComponent(_ttype)
              + '&passLevel=DEV'
              + '&passYn='    + (testResult === 'PASS' ? 'Y' : 'N')
              + '&remark='    + encodeURIComponent(remark)
        }).catch(function(){});
        break;
      }
    }
    _updateRunProgress(_runDone + 1);
  });
  testEventSource.addEventListener('done', function(e){
    testEventSource.close(); testEventSource = null;
    setLoading(btn, false); btnStop.disabled = true; statusEl.textContent = '';
    _updateRunProgress(_runTotal);
    globalProgressFinish(true);
    runningBadgeHide();
    runSessionEnd('done');
    _bcSend({ type: 'done' });
    var parts = e.data.split('|');
    showAlert('info', parts.join(' / '));
    renderResultTable(scenarios);
    document.getElementById('resultSection').style.display = 'block';
    renderDefectList(scenarios);

    // Step 3 완료 → Panel 4 활성화
    markStepComplete(3);
    showAlert('info', singleRowNo != null
      ? '✅ 단일 TC 테스트 완료. 결과를 확인하세요.'
      : '✅ 테스트 완료. 패널 4(결과서)로 이동하세요.');

    doGenerateReport();
  });

  var _testErrHandled = false;
  function _closeTestES(msg) {
    if (_testErrHandled) return; _testErrHandled = true;
    if (testEventSource) { testEventSource.close(); testEventSource = null; }
    setLoading(btn, false); btnStop.disabled = true; statusEl.textContent = '';
    globalProgressFinish(false);
    runningBadgeHide();
    runSessionEnd('error');
    _bcSend({ type: 'error', msg: msg || '' });
    showAlert('error', (msg && msg.trim()) ? msg : '테스트 실행에 실패했습니다.');
  }
  testEventSource.addEventListener('error', function(e){ _closeTestES(e.data); });
  testEventSource.onerror = function(){ _closeTestES(''); };
}

/* spec.ts 파일을 시나리오 없이 직접 실행 — runSpecTest.do 사용 */
function doRunSpecDirect() {
  var specFile = currentSpecFileName;
  if (!specFile) {
    var input = window.prompt('실행할 spec 파일명을 입력하세요 (예: 20260702_pur_inte.spec.ts)');
    if (!input || !input.trim()) return;
    specFile = input.trim();
    currentSpecFileName = specFile;
    var specInfo = document.getElementById('specFileInfo');
    if (specInfo) specInfo.textContent = specFile;
  }
  var headed = document.getElementById('chkHeaded') ? document.getElementById('chkHeaded').checked : true;
  var logEl   = document.getElementById('playwrightLog');
  var statusEl = document.getElementById('runStatus');
  var btnStop  = document.getElementById('btnStopTest');
  var btnSpec  = document.getElementById('btnRunSpecDirect');

  if (logEl)    logEl.innerHTML = '';
  if (statusEl) statusEl.textContent = '실행 중...';
  if (btnSpec)  btnSpec.disabled = true;
  if (btnStop)  btnStop.disabled = false;
  globalProgressStart('spec 직접 실행 중... — ' + specFile);

  // 파일명만 넘어온 경우 integration/ 경로 붙이기
  var relPath = specFile;
  if (!specFile.includes('/') && !specFile.includes('\\')) {
    if (specFile.endsWith('_inte.spec.ts'))  relPath = 'tests/integration/' + specFile;
    else if (specFile.endsWith('_unit.spec.ts')) relPath = 'tests/unit/' + specFile;
    else relPath = 'tests/integration/' + specFile;
  }

  var url = '<c:url value="/ai/runSpecTest.do"/>?specFile=' + encodeURIComponent(relPath)
          + '&headed=' + headed;
  console.log('[doRunSpecDirect] URL=', url);

  if (testEventSource) { try { testEventSource.close(); } catch(e){} testEventSource = null; }
  testEventSource = new EventSource(url);

  testEventSource.addEventListener('log', function(e) {
    if (!logEl) return;
    var line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = e.data;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  });

  testEventSource.addEventListener('done', function(e) {
    testEventSource.close(); testEventSource = null;
    if (btnSpec)  btnSpec.disabled = false;
    if (btnStop)  btnStop.disabled = true;
    var parts = (e.data || '').split('|');
    var result = parts[1] || '';
    if (statusEl) statusEl.textContent = '완료: ' + result;
    globalProgressFinish(result === 'PASS');
    showAlert(result === 'PASS' ? 'success' : 'error',
              'spec 직접 실행 ' + result + ' — ' + (parts[2] || ''));
  });

  testEventSource.addEventListener('error', function(e) {
    testEventSource.close(); testEventSource = null;
    if (btnSpec)  btnSpec.disabled = false;
    if (btnStop)  btnStop.disabled = true;
    if (statusEl) statusEl.textContent = '오류';
    globalProgressFinish(false);
    showAlert('error', 'spec 실행 오류: ' + (e.data || ''));
  });

  testEventSource.onerror = function() {
    if (!testEventSource) return;
    testEventSource.close(); testEventSource = null;
    if (btnSpec)  btnSpec.disabled = false;
    if (btnStop)  btnStop.disabled = true;
    if (statusEl) statusEl.textContent = '연결 오류';
    globalProgressFinish(false);
  };
}

function doStopTest() {
  var btn     = document.getElementById('btnRunTest');
  var btnSpec = document.getElementById('btnRunSpecDirect');
  var btnStop = document.getElementById('btnStopTest');
  var statusEl = document.getElementById('runStatus');
  if (testEventSource) { testEventSource.close(); testEventSource = null; }
  btnStop.disabled = true;
  if (btn)     setLoading(btn, false);
  if (btnSpec) btnSpec.disabled = false;
  statusEl.textContent = '중지 중...';
  globalProgressFinish(false);
  runningBadgeHide();
  // spec 직접 실행과 일반 실행 모두 중지 시도
  fetch('<c:url value="/ai/stopSpecTest.do"/>', { method: 'POST' }).catch(function(){});
  fetch('<c:url value="/ai/stopTest.do"/>?prefix=' + encodeURIComponent(currentPrefix), { method: 'POST' })
    .then(function(r){ return r.json(); })
    .then(function(data){ statusEl.textContent = ''; showAlert('warning', data.message || '테스트가 중지되었습니다.'); })
    .catch(function(){ statusEl.textContent = ''; showAlert('warning', '테스트가 중지되었습니다.'); });
}

/* ── AI 리포트 자동 생성 ────────────────────────────────────────── */
function doGenerateReport() {
  if (!currentPrefix) return;
  var reportSection = document.getElementById('reportSection');
  var reportPreview = document.getElementById('reportPreview');
  var reportStatus  = document.getElementById('reportStatus');
  var btnDownload   = document.getElementById('btnDownload');

  reportSection.style.display = 'block';
  reportPreview.textContent   = '';
  reportStatus.textContent    = 'AI 분석 리포트 생성 중...';
  btnDownload.disabled        = true;
  globalProgressStart('AI 분석 리포트 생성 중...');

  fetch('<c:url value="/ai/generateReport.do"/>?prefix=' + encodeURIComponent(currentPrefix))
    .then(function(r){ return r.json(); })
    .then(function(data){
      reportStatus.textContent = '';
      if (data.success && data.report) {
        // textarea는 textContent 대신 value 사용
        if (reportPreview.tagName === 'TEXTAREA') reportPreview.value = data.report;
        else reportPreview.textContent = data.report;
        btnDownload.disabled = false;
        var bme = document.getElementById('btnMultiExport'); if (bme) bme.disabled = false;
        markStepComplete(4);  // Step 4 완료
        globalProgressFinish(true);
        showAlert('info', 'AI 분석 리포트가 생성되었습니다. 직접 수정 가능합니다.');
        reportSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        if (reportPreview.tagName === 'TEXTAREA') reportPreview.value = '리포트 생성 실패: ' + (data.message || '알 수 없는 오류');
        else reportPreview.textContent = '리포트 생성 실패: ' + (data.message || '알 수 없는 오류');
        btnDownload.disabled = false;
        globalProgressFinish(false);
        showAlert('warning', data.message || 'AI 리포트 생성에 실패했습니다.');
      }
    })
    .catch(function(e){ reportStatus.textContent = ''; reportPreview.textContent = '오류: ' + e.message; btnDownload.disabled = false; globalProgressFinish(false); showAlert('warning', 'AI 리포트 오류: ' + e.message); });
}

/* ── 결과서 테이블 ──────────────────────────────────────────────── */
function renderResultTable(list) {
  var tbody = document.getElementById('resultBody');
  tbody.innerHTML = '';
  var pass = 0, fail = 0;
  list.forEach(function(s){
    var tr = document.createElement('tr');
    var isPass = s.testResult === 'PASS';
    if (s.testResult) { if (isPass) pass++; else fail++; }
    var judgeHtml = s.testResult === 'PASS' ? '<span class="result-pass">PASS</span>'
      : s.testResult === 'FAIL' ? '<span class="result-fail">FAIL</span>' : '-';
    // 실행결과: PASS면 crudType으로 자동 생성, FAIL이면 remark(오류 메시지)
    var actualResult = '';
    if (s.testResult === 'PASS') {
      var ct = (s.crudType || '').toUpperCase();
      if      (ct === 'INSERT') actualResult = '저장 완료';
      else if (ct === 'UPDATE') actualResult = '수정 완료';
      else if (ct === 'DELETE') actualResult = '삭제 완료';
      else                       actualResult = '정상 조회';
    } else if (s.testResult === 'FAIL') {
      actualResult = s.remark || '오류 발생';
    }
    tr.innerHTML =
      '<td style="text-align:center">' + s.no + '</td>' +
      '<td style="font-size:11px">' + esc(s.scenarioId) + '</td>' +
      '<td style="font-size:11px">' + esc(s.menuName) + '</td>' +
      '<td class="url-mono" style="font-size:10px">' + esc(s.url) + '</td>' +
      '<td style="text-align:center;font-size:11px">' + esc(s.method) + '</td>' +
      '<td style="white-space:pre-wrap;font-size:11px;color:#0057b7">' + esc(s.inputValues || s.testData || '') + '</td>' +
      '<td style="white-space:pre-wrap;font-size:11px">' + esc(s.expectedResult || '') + '</td>' +
      '<td style="white-space:pre-wrap;font-size:11px;' + (s.testResult==='FAIL'?'color:#b91c1c':'color:#15803d') + '">' + esc(actualResult) + '</td>' +
      '<td style="text-align:center;font-size:11px">' + esc(s.relationType || '') + '</td>' +
      '<td style="text-align:center">' + judgeHtml + '</td>';
    tbody.appendChild(tr);
  });
  document.getElementById('sumTotal').textContent = list.length;
  document.getElementById('sumPass').textContent  = pass;
  document.getElementById('sumFail').textContent  = fail;
}

/* ── 결함 리스트 ────────────────────────────────────────────────── */
function renderDefectList(list) {
  var fails = (list || scenarios).filter(function(s){ return s.testResult === 'FAIL'; });
  var section  = document.getElementById('defectSection');
  var tbody    = document.getElementById('defectBody');
  var badge    = document.getElementById('defectCountBadge');
  var btnFix   = document.getElementById('btnDefectFix');

  if (!fails.length) {
    section.style.display = 'none';
    badge.className = 'defect-none'; badge.textContent = '결함 없음';
    return;
  }
  tbody.innerHTML = '';
  badge.className = 'defect-count'; badge.textContent = fails.length + '건 FAIL';
  section.style.display = 'block';
  if (btnFix) btnFix.disabled = false;

  fails.forEach(function(s, idx){
    var tr = document.createElement('tr');
    tr.setAttribute('data-scenario-id', s.scenarioId);
    tr.style.background = idx % 2 === 0 ? '#fff5f5' : '#fff';
    tr.innerHTML =
      '<td style="text-align:center;font-weight:700;color:#b91c1c">' + s.no + '</td>' +
      '<td style="font-size:11px">' + esc(s.scenarioId) + '</td>' +
      '<td><span style="font-size:11px;background:#fee2e2;color:#b91c1c;padding:1px 6px;border-radius:4px;font-weight:700">FAIL</span> ' + esc(s.testName) + '</td>' +
      '<td class="url-mono" style="font-size:11px">' + esc(s.url) + '</td>' +
      '<td style="text-align:center">' + esc(s.method) + '</td>' +
      '<td style="font-size:11px;white-space:pre-wrap">' + esc((s.expectedResult || '').split('\n')[0]) + '</td>' +
      '<td class="defect-remark">' + esc(s.remark || '-') + '</td>' +
      '<td class="defect-fix"><span style="color:#aaa;font-size:11px">AI 분석 대기 중...</span></td>';
    tbody.appendChild(tr);
  });
}

/* ── AI 소스 개선방안 분석 ──────────────────────────────────────── */
function doGenerateDefectFix() {
  var btn    = document.getElementById('btnDefectFix');
  var status = document.getElementById('defectFixStatus');
  var fails  = scenarios.filter(function(s){ return s.testResult === 'FAIL'; });
  if (!fails.length) return;

  btn.disabled = true; btn.textContent = '⏳ AI 분석 중...'; status.textContent = '';

  var payload = fails.map(function(s){
    return { scenarioId: s.scenarioId, testName: s.testName, url: s.url, method: s.method, expectedResult: s.expectedResult, remark: s.remark };
  });

  fetch('<c:url value="/ai/generateDefectFix.do"/>', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: currentPrefix, fails: payload })
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    btn.disabled = false; btn.textContent = '🔍 AI 소스 개선방안 분석';
    if (!data.success) { status.textContent = '⚠ ' + (data.message || '분석 실패'); return; }
    var fixes = data.fixes || {};
    status.textContent = Object.keys(fixes).length + '건 분석 완료';
    document.querySelectorAll('#defectBody tr[data-scenario-id]').forEach(function(tr){
      var sid = tr.getAttribute('data-scenario-id');
      var fixCell = tr.querySelector('.defect-fix');
      if (!fixCell) return;
      var fixText = fixes[sid];
      if (fixText) {
        fixCell.innerHTML = '<div style="background:#fffbeb;border-left:3px solid #f59e0b;padding:6px 10px;border-radius:0 4px 4px 0"><span style="font-size:10px;font-weight:700;color:#92400e;display:block;margin-bottom:4px">🔧 개선방안</span>' + esc(fixText).replace(/\n/g, '<br>') + '</div>';
      } else {
        fixCell.innerHTML = '<span style="color:#aaa;font-size:11px">분석 결과 없음</span>';
      }
    });
    if (!Object.keys(fixes).length && data.raw) showAlert('info', 'AI 개선방안 (파싱 실패, raw):\n' + data.raw.substring(0, 500));
  })
  .catch(function(e){ btn.disabled = false; btn.textContent = '🔍 AI 소스 개선방안 분석'; status.textContent = '오류: ' + e.message; });
}

/* ── 결과 다운로드 ──────────────────────────────────────────────── */
function doDownload() {
  var btn = document.getElementById('btnDownload');
  btn.disabled = true; btn.textContent = '⏳ 생성 중...';
  // reportPreview가 textarea이면 .value, 아니면 .textContent
  var reportEl = document.getElementById('reportPreview');
  if (reportEl && reportEl.tagName === 'TEXTAREA') {
    // AiStateStore.REPORT_STORE에 편집된 리포트 반영 (서버에 별도 저장하지 않고 download payload에 포함)
  }
  fetch('<c:url value="/ai/downloadResult.do"/>', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: currentPrefix, results: scenarios })
  })
  .then(function(r){
    if (!r.ok) return r.text().then(function(t){ throw new Error('서버 오류 (' + r.status + '): ' + t.substring(0,200)); });
    var cd = r.headers.get('Content-Disposition') || '';
    var fn = '통합테스트결과서_' + currentPrefix + '.zip';
    var m  = cd.match(/filename\*=UTF-8''([^\s;]+)/i);
    if (!m) m = cd.match(/filename="?([^";\r\n]+)"?/i);
    if (m && m[1]) fn = decodeURIComponent(m[1].trim());
    return r.blob().then(function(blob){
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = fn;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function(){ URL.revokeObjectURL(url); }, 10000);
      showAlert('info', '📦 ' + fn + ' 다운로드 완료');
    });
  })
  .catch(function(e){ showAlert('error', '다운로드 오류: ' + e.message); })
  .finally(function(){ btn.disabled = false; btn.innerHTML = '<span class="spinner"></span>📦 엑셀 다운로드 (.zip)'; });
}


// ── 다중 형식 내보내기 ──────────────────────────────────────────────
function doMultiFormatDownload() {
  // ── 선택값 수집 ──
  var formats  = [];
  var content  = [];
  if (document.getElementById('fmtXlsx') && document.getElementById('fmtXlsx').checked) formats.push('xlsx');
  if (document.getElementById('fmtHtml') && document.getElementById('fmtHtml').checked)  formats.push('html');
  if (document.getElementById('fmtDocx') && document.getElementById('fmtDocx').checked)  formats.push('docx');
  if (document.getElementById('fmtPdf')  && document.getElementById('fmtPdf').checked)   formats.push('pdf');
  if (document.getElementById('chkScenario') && document.getElementById('chkScenario').checked) content.push('scenario');
  if (document.getElementById('chkResult')   && document.getElementById('chkResult').checked)   content.push('result');
  var withJava   = !!(document.getElementById('chkJava')   && document.getElementById('chkJava').checked);
  var withPython = !!(document.getElementById('chkPython') && document.getElementById('chkPython').checked);

  if (formats.length === 0)  { showAlert('error', '출력 형식을 하나 이상 선택하세요 (xlsx/html/docx/pdf)'); return; }
  if (content.length === 0)  { showAlert('error', '문서 종류를 하나 이상 선택하세요 (시나리오/결과서)'); return; }
  if (!withJava && !withPython) { showAlert('error', '생성 라이브러리를 하나 이상 선택하세요 (Java/Python)'); return; }

  var btn    = document.getElementById('btnMultiExport');
  var status = document.getElementById('multiExportStatus');
  var spinner= document.getElementById('multiExportSpinner');

  btn.disabled = true;
  if (spinner) spinner.style.display = 'inline-block';
  if (status)  status.textContent = '생성 중... (형식: ' + formats.join(', ') + ')';

  globalProgressStart('다중 형식 내보내기 중...');

  fetch('<c:url value="/ai/exportMultiFormat.do"/>', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prefix    : currentPrefix,
      formats   : formats,
      content   : content,
      withJava  : withJava,
      withPython: withPython
    })
  })
  .then(function(r) {
    if (!r.ok) {
      return r.text().then(function(t) {
        try { var j = JSON.parse(t); throw new Error(j.message || t.substring(0, 200)); }
        catch (pe) { if (pe instanceof SyntaxError) throw new Error('서버 오류 (' + r.status + '): ' + t.substring(0, 200)); throw pe; }
      });
    }
    var cd = r.headers.get('Content-Disposition') || '';
    var fn = 'export.zip';
    var m  = cd.match(/filename\*=UTF-8''([^\s;]+)/i);
    if (!m) m = cd.match(/filename="?([^";\r\n]+)"?/i);
    if (m && m[1]) fn = decodeURIComponent(m[1].trim());

    return r.blob().then(function(blob) {
      var url = URL.createObjectURL(blob);
      var a   = document.createElement('a');
      a.href  = url; a.download = fn;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function() { URL.revokeObjectURL(url); }, 10000);
      globalProgressFinish(true);
      if (status) status.textContent = '✅ ' + fn + ' 다운로드 완료';
      showAlert('info', '📦 ' + fn + ' 다운로드 완료 (Java + Python 버전 포함)');
    });
  })
  .catch(function(e) {
    globalProgressFinish(false);
    if (status) status.textContent = '❌ 오류: ' + e.message;
    showAlert('error', '다운로드 오류: ' + e.message);
  })
  .finally(function() {
    btn.disabled = false;
    if (spinner) spinner.style.display = 'none';
  });
}

/* ── 공통 유틸 ──────────────────────────────────────────────────── */
function setLoading(btn, on) {
  if (!btn) return;
  btn.disabled = on;
  if (on) btn.classList.add('loading'); else btn.classList.remove('loading');
}

function showAlert(type, msg) {
  var area = document.getElementById('alertArea');
  var div  = document.createElement('div');
  div.className = 'alert alert-' + type;
  div.textContent = msg;
  area.appendChild(div);
  setTimeout(function(){ div.remove(); }, 6000);
}

function showApiError(rawMsg) {
  var area = document.getElementById('alertArea');
  var div  = document.createElement('div');
  div.className = 'alert alert-error'; div.style.lineHeight = '1.8';
  var cause = '', solution = '';
  if (!rawMsg) { cause = '알 수 없는 오류'; solution = '시나리오 생성 로그를 확인하세요.'; }
  else if (rawMsg.indexOf('OAuth 토큰') >= 0 || rawMsg.indexOf('인증을 완료') >= 0 || rawMsg.indexOf('401') >= 0) {
    cause = '❌ GitHub 인증 만료 또는 미완료'; solution = '→ 상단 [GitHub 인증 시작] 버튼을 클릭해 재인증하세요.';
  } else if (rawMsg.indexOf('PAT 미설정') >= 0 || rawMsg.indexOf('api.key') >= 0) {
    cause = '❌ GitHub Personal Access Token(PAT) 미설정'; solution = '→ copilot.properties 의 api.key 에 GitHub PAT 를 입력하세요.';
  } else if (rawMsg.indexOf('model_not_supported') >= 0 || rawMsg.indexOf('not supported') >= 0 || rawMsg.indexOf('모든 후보 모델') >= 0) {
    cause = '❌ 선택한 모델을 사용할 수 없음'; solution = '→ [모델 목록 조회] 버튼으로 사용 가능한 모델을 확인 후 다시 선택하세요.';
  } else if (rawMsg.indexOf('SocketTimeoutException') >= 0 || rawMsg.indexOf('connect timed out') >= 0) {
    cause = '❌ 네트워크 연결 실패'; solution = '→ api.githubcopilot.com 에 대한 방화벽을 확인하세요.';
  } else if (rawMsg.indexOf('429') >= 0) {
    cause = '❌ API 호출 한도 초과 (Rate Limit)'; solution = '→ 잠시 후(1~2분) 다시 시도하세요.';
  } else { cause = '❌ AI API 호출 실패'; solution = '→ 시나리오 생성 로그에서 상세 오류를 확인하세요.'; }
  div.innerHTML = '<b>' + cause + '</b><br><span style="font-size:12px">' + solution + '</span>'
    + (rawMsg ? '<br><span style="font-size:11px;color:#aaa;word-break:break-all">[상세] ' + rawMsg.substring(0, 200) + '</span>' : '');
  area.appendChild(div);
}

function esc(s) {
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ══════════════════════════════════════════════════════════
   에러 로그 (spec.ts 생성 실패 시 저장 — localStorage)
   ══════════════════════════════════════════════════════════ */

var ERROR_TYPE_LABELS = {
  'spec_gen_fail':  'spec 생성 실패',
  'spec_gen_error': 'spec 생성 오류',
  'autofix_error':  '자동수정 오류'
};

function saveErrorLog(type, message, logContent) {
  var logs = _loadRawErrorLogs();
  var now  = new Date();
  var pad  = function(n){ return String(n).padStart(2, '0'); };
  var timeStr = now.getFullYear() + '-' + pad(now.getMonth()+1) + '-' + pad(now.getDate())
              + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  logs.push({
    id:      now.getTime(),
    time:    timeStr,
    type:    type,
    prefix:  currentPrefix || '(미설정)',
    message: message || '',
    log:     logContent || ''
  });
  try { localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(logs)); } catch(e) {}
  _syncNavErrlogBadge(logs.length);
}

function _loadRawErrorLogs() {
  try {
    var raw = localStorage.getItem(ERROR_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}

function clearErrorLogs() {
  if (!confirm('에러 로그를 모두 삭제하시겠습니까?')) return;
  try { localStorage.removeItem(ERROR_LOG_KEY); } catch(e) {}
  _syncNavErrlogBadge(0);
  renderErrorLogs();
}

/* ── 생성 로그 (TOOLS > 생성 로그 패널) ────────────────────────────────
   구조: 실행 1회 = 세션 1개 (_genSessions 배열)
         각 세션: { id, tag, label, startTime, endTime, lines:[], status:'running'|'done'|'error' }
         genlogList에는 세션 요약 행 1줄씩만 표시.
         더블클릭 → genDetailModal 팝업에서 전체 로그 확인.
   ────────────────────────────────────────────────────────────────── */

/** 새 세션 시작 — doGenerateScenario / doStartSpecStream 등 생성 시작 시점에 호출 */
function genSessionStart(tag, label) {
  var now = new Date();
  var time = now.getFullYear() + '-'
    + (now.getMonth()+1).toString().padStart(2,'0') + '-'
    + now.getDate().toString().padStart(2,'0') + ' '
    + now.getHours().toString().padStart(2,'0') + ':'
    + now.getMinutes().toString().padStart(2,'0') + ':'
    + now.getSeconds().toString().padStart(2,'0');
  var sess = {
    id: 'gs_' + Date.now(),
    tag: tag,
    label: label,
    startTime: time,
    endTime: null,
    lines: [],
    status: 'running'
  };
  _genSessions.push(sess);
  _genCurrentSession = sess;
  renderGenLogs();
  _bcGenSend({ type: 'start', tag: tag, label: label });
  return sess;
}

/** 현재 세션에 로그 1줄 추가 (SSE log 이벤트마다 호출) */
function addGenLog(tag, message) {
  if (!_genCurrentSession) {
    // 세션 없이 로그가 들어온 경우 — 자동으로 세션 생성
    genSessionStart(tag, '[' + tag + '] 자동 세션');
  }
  var now = new Date();
  var time = now.getHours().toString().padStart(2,'0') + ':'
           + now.getMinutes().toString().padStart(2,'0') + ':'
           + now.getSeconds().toString().padStart(2,'0');
  _genCurrentSession.lines.push({ time: time, msg: message });

  // 배지: 세션 수 표시 (생성 + 실행 합산)
  var badge = document.getElementById('nav-genlog-badge');
  if (badge) { badge.textContent = _genSessions.length + _runSessions.length; badge.style.display = ''; }

  // 패널이 열려 있으면 해당 세션 행 업데이트
  var panel6 = document.getElementById('panel-6');
  if (panel6 && panel6.style.display !== 'none') _updateSessionRow(_genCurrentSession);

  _bcGenSend({ type: 'log', tag: tag, msg: message });
}

/** 현재 세션 종료 — SSE done/error 이벤트 핸들러에서 호출 */
function genSessionEnd(status) {
  if (!_genCurrentSession) return;
  var now = new Date();
  _genCurrentSession.endTime = now.getHours().toString().padStart(2,'0') + ':'
    + now.getMinutes().toString().padStart(2,'0') + ':'
    + now.getSeconds().toString().padStart(2,'0');
  _genCurrentSession.status = status || 'done';
  _updateSessionRow(_genCurrentSession);
  _bcGenSend({ type: 'done', status: status || 'done' });
  _genCurrentSession = null;
}

/** 세션 요약 행 1개를 genlogList에 삽입하거나 갱신 */
function _updateSessionRow(sess) {
  var list  = document.getElementById('genlogList');
  var empty = document.getElementById('genlogEmpty');
  var count = document.getElementById('genlogCount');
  if (!list) return;
  if (empty) empty.style.display = 'none';
  if (count) count.textContent = '(' + _genSessions.length + '건)';

  var existing = document.getElementById('sessrow-' + sess.id);
  var statusIcon = sess.status === 'running' ? '⏳'
    : sess.status === 'error' ? '❌' : '✅';
  var statusColor = sess.status === 'running' ? '#b45309'
    : sess.status === 'error' ? '#b91c1c' : '#15803d';
  var tagClass = 'genlog-tag-' + sess.tag;
  var lineCount = sess.lines.length;
  var lastLine = lineCount > 0 ? sess.lines[lineCount-1].msg : '';

  var html =
    '<span class="genlog-tag ' + tagClass + '">' + sess.tag + '</span>' +
    '<span class="genlog-time" style="margin-left:6px">' + sess.startTime + '</span>' +
    '<span style="margin-left:8px;font-weight:600;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(sess.label) + '</span>' +
    '<span style="margin-left:8px;color:#6b7280;font-size:10px">' + lineCount + '줄</span>' +
    '<span style="margin-left:6px;font-size:13px" title="' + sess.status + '">' + statusIcon + '</span>';

  if (existing) {
    existing.innerHTML = html;
    existing.style.borderLeftColor = statusColor;
  } else {
    var div = document.createElement('div');
    div.id = 'sessrow-' + sess.id;
    div.className = 'genlog-entry';
    div.style.cssText = 'display:flex;align-items:center;gap:0;cursor:pointer;border-left:3px solid ' + statusColor + ';padding-left:10px;user-select:none';
    div.innerHTML = html;
    div.title = '더블클릭하면 상세 로그를 확인할 수 있습니다';
    (function(s){ div.ondblclick = function(){ showGenLogDetail(s); }; })(sess);
    list.insertBefore(div, list.firstChild); // 최신 세션이 위에
  }
}

/** 더블클릭 → 상세 로그 팝업 */
function showGenLogDetail(sess) {
  var modal = document.getElementById('genDetailModal');
  var title = document.getElementById('genDetailTitle');
  var body  = document.getElementById('genDetailBody');
  if (!modal || !body) return;

  if (title) title.textContent = '[' + sess.tag + '] ' + sess.label
    + ' — ' + sess.startTime + (sess.endTime ? ' ~ ' + sess.endTime : ' (진행중)');

  var html = '<table style="width:100%;border-collapse:collapse;font-family:monospace;font-size:11px">'
    + '<colgroup><col style="width:60px"><col></colgroup>';
  sess.lines.forEach(function(l, idx) {
    var bg = idx % 2 === 0 ? '#f9fafb' : '#fff';
    html += '<tr style="background:' + bg + '">'
      + '<td style="padding:2px 6px;color:#9ca3af;white-space:nowrap;vertical-align:top">' + l.time + '</td>'
      + '<td style="padding:2px 6px;white-space:pre-wrap;word-break:break-all">' + esc(l.msg) + '</td>'
      + '</tr>';
  });
  if (sess.lines.length === 0) {
    html += '<tr><td colspan="2" style="padding:20px;text-align:center;color:#aaa">로그 없음</td></tr>';
  }
  html += '</table>';
  body.innerHTML = html;
  modal.style.display = 'flex';
}

function renderGenLogs() {
  var list  = document.getElementById('genlogList');
  var empty = document.getElementById('genlogEmpty');
  var count = document.getElementById('genlogCount');
  if (!list) return;
  // 기존 세션 행 제거 (empty 제외)
  Array.from(list.children).forEach(function(c) {
    if (c.id !== 'genlogEmpty') list.removeChild(c);
  });
  if (_genSessions.length === 0) {
    if (empty) empty.style.display = '';
    if (count) count.textContent = '';
    return;
  }
  if (empty) empty.style.display = 'none';
  if (count) count.textContent = '(' + _genSessions.length + '건)';
  // 역순으로 렌더 (최신이 위)
  for (var i = _genSessions.length - 1; i >= 0; i--) {
    _updateSessionRow(_genSessions[i]);
  }
}

function clearGenLogs() {
  _genSessions = [];
  _genCurrentSession = null;
  renderGenLogs();
}

/* ── 실행 로그 (TOOLS > 로그 패널 > 실행로그 탭) ──────────────────── */

function runSessionStart(label) {
  var now = new Date();
  var time = now.getFullYear() + '-'
    + (now.getMonth()+1).toString().padStart(2,'0') + '-'
    + now.getDate().toString().padStart(2,'0') + ' '
    + now.getHours().toString().padStart(2,'0') + ':'
    + now.getMinutes().toString().padStart(2,'0') + ':'
    + now.getSeconds().toString().padStart(2,'0');
  var sess = {
    id: 'rs_' + Date.now(),
    tag: 'run',
    label: label,
    startTime: time,
    endTime: null,
    lines: [],
    status: 'running'
  };
  _runSessions.push(sess);
  _runCurrentSession = sess;
  renderRunLogs();
  return sess;
}

function addRunLog(message) {
  if (!_runCurrentSession) return;
  var now = new Date();
  var time = now.getHours().toString().padStart(2,'0') + ':'
           + now.getMinutes().toString().padStart(2,'0') + ':'
           + now.getSeconds().toString().padStart(2,'0');
  _runCurrentSession.lines.push({ time: time, msg: message });
  var badge = document.getElementById('nav-genlog-badge');
  if (badge) { badge.textContent = _genSessions.length + _runSessions.length; badge.style.display = ''; }
  var panel6 = document.getElementById('panel-6');
  if (panel6 && panel6.style.display !== 'none') _updateRunSessionRow(_runCurrentSession);
}

function runSessionEnd(status) {
  if (!_runCurrentSession) return;
  var now = new Date();
  _runCurrentSession.endTime = now.getHours().toString().padStart(2,'0') + ':'
    + now.getMinutes().toString().padStart(2,'0') + ':'
    + now.getSeconds().toString().padStart(2,'0');
  _runCurrentSession.status = status || 'done';
  _updateRunSessionRow(_runCurrentSession);
  _runCurrentSession = null;
}

function _updateRunSessionRow(sess) {
  var list  = document.getElementById('runlogList');
  var empty = document.getElementById('runlogEmpty');
  var count = document.getElementById('runlogCount');
  if (!list) return;
  if (empty) empty.style.display = 'none';
  if (count) count.textContent = '(' + _runSessions.length + '건)';

  var existing = document.getElementById('runrow-' + sess.id);
  var statusIcon = sess.status === 'running' ? '⏳'
    : sess.status === 'error' ? '❌' : '✅';
  var statusColor = sess.status === 'running' ? '#b45309'
    : sess.status === 'error' ? '#b91c1c' : '#15803d';
  var lineCount = sess.lines.length;

  var html =
    '<span class="genlog-tag genlog-tag-run">run</span>' +
    '<span class="genlog-time" style="margin-left:6px">' + sess.startTime + '</span>' +
    '<span style="margin-left:8px;font-weight:600;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(sess.label) + '</span>' +
    '<span style="margin-left:8px;color:#6b7280;font-size:10px">' + lineCount + '줄</span>' +
    '<span style="margin-left:6px;font-size:13px" title="' + sess.status + '">' + statusIcon + '</span>';

  if (existing) {
    existing.innerHTML = html;
    existing.style.borderLeftColor = statusColor;
  } else {
    var div = document.createElement('div');
    div.id = 'runrow-' + sess.id;
    div.className = 'runlog-entry';
    div.style.cssText = 'display:flex;align-items:center;gap:0;cursor:pointer;border-left:3px solid ' + statusColor + ';padding-left:10px;user-select:none';
    div.innerHTML = html;
    div.title = '더블클릭하면 상세 로그를 확인할 수 있습니다';
    (function(s){ div.ondblclick = function(){ showRunLogDetail(s); }; })(sess);
    list.insertBefore(div, list.firstChild);
  }
}

function showRunLogDetail(sess) {
  var modal = document.getElementById('genDetailModal');
  var title = document.getElementById('genDetailTitle');
  var body  = document.getElementById('genDetailBody');
  if (!modal || !body) return;

  if (title) title.textContent = '[run] ' + sess.label
    + ' — ' + sess.startTime + (sess.endTime ? ' ~ ' + sess.endTime : ' (진행중)');

  var html = '<table style="width:100%;border-collapse:collapse;font-family:monospace;font-size:11px">'
    + '<colgroup><col style="width:60px"><col></colgroup>';
  sess.lines.forEach(function(l, idx) {
    var bg = idx % 2 === 0 ? '#f9fafb' : '#fff';
    var isPass = l.msg.indexOf('PASS') >= 0;
    var isFail = l.msg.indexOf('FAIL') >= 0 || l.msg.indexOf('Error') >= 0 || l.msg.indexOf('error') >= 0;
    var msgColor = isPass ? '#15803d' : isFail ? '#b91c1c' : '';
    html += '<tr style="background:' + bg + '">'
      + '<td style="padding:2px 6px;color:#9ca3af;white-space:nowrap;vertical-align:top">' + l.time + '</td>'
      + '<td style="padding:2px 6px;white-space:pre-wrap;word-break:break-all' + (msgColor ? ';color:' + msgColor : '') + '">' + esc(l.msg) + '</td>'
      + '</tr>';
  });
  if (sess.lines.length === 0) {
    html += '<tr><td colspan="2" style="padding:20px;text-align:center;color:#aaa">로그 없음</td></tr>';
  }
  html += '</table>';
  body.innerHTML = html;
  modal.style.display = 'flex';
}

function renderRunLogs() {
  var list  = document.getElementById('runlogList');
  var empty = document.getElementById('runlogEmpty');
  var count = document.getElementById('runlogCount');
  if (!list) return;
  Array.from(list.children).forEach(function(c) {
    if (c.id !== 'runlogEmpty') list.removeChild(c);
  });
  if (_runSessions.length === 0) {
    if (empty) empty.style.display = '';
    if (count) count.textContent = '';
    return;
  }
  if (empty) empty.style.display = 'none';
  if (count) count.textContent = '(' + _runSessions.length + '건)';
  for (var i = _runSessions.length - 1; i >= 0; i--) {
    _updateRunSessionRow(_runSessions[i]);
  }
}

function clearRunLogs() {
  _runSessions = [];
  _runCurrentSession = null;
  renderRunLogs();
}

function clearAllLogs() {
  if (!confirm('모든 로그를 삭제하시겠습니까?')) return;
  clearGenLogs();
  clearRunLogs();
  var badge = document.getElementById('nav-genlog-badge');
  if (badge) { badge.textContent = ''; badge.style.display = 'none'; }
}

function _syncNavErrlogBadge(count) {
  var item  = document.getElementById('nav-errlog-item');
  var badge = document.getElementById('nav-errlog-badge');
  if (!item) return;
  if (count > 0) {
    item.style.display = '';
    if (badge) badge.textContent = count;
  } else {
    item.style.display = 'none';
    if (badge) badge.textContent = '';
  }
}

function renderErrorLogs() {
  var logs   = _loadRawErrorLogs();
  var listEl = document.getElementById('errlogList');
  var cntEl  = document.getElementById('errlogCount');
  if (!listEl) return;

  _syncNavErrlogBadge(logs.length);

  if (cntEl) cntEl.textContent = logs.length ? '총 ' + logs.length + '건' : '';
  if (logs.length === 0) {
    listEl.innerHTML = '<div class="empty-msg" style="color:#aaa;padding:20px;text-align:center">에러 로그가 없습니다.</div>';
    return;
  }

  var html = '';
  // 최신순
  for (var i = logs.length - 1; i >= 0; i--) {
    var e = logs[i];
    var typeLabel = ERROR_TYPE_LABELS[e.type] || e.type;
    html += '<div class="errlog-entry">'
          + '  <div class="errlog-entry-head">'
          + '    <span class="errlog-type-badge">' + esc(typeLabel) + '</span>'
          + '    <span class="errlog-time">' + esc(e.time) + '</span>'
          + '    <span class="errlog-prefix">prefix: ' + esc(e.prefix) + '</span>'
          + '  </div>'
          + '  <div class="errlog-msg">' + esc(e.message) + '</div>'
          + (e.log ? '  <span class="errlog-log-toggle" onclick="toggleErrlogBody(this)">▶ 상세 로그 보기</span>'
                   + '  <div class="errlog-log-body">' + esc(e.log) + '</div>'
                   : '')
          + '</div>';
  }
  listEl.innerHTML = html;
}

function toggleErrlogBody(el) {
  var body = el.nextElementSibling;
  if (!body) return;
  var visible = body.style.display === 'block';
  body.style.display = visible ? 'none' : 'block';
  el.textContent = visible ? '▶ 상세 로그 보기' : '▼ 상세 로그 닫기';
}

/* 페이지 로드 시 기존 에러 로그 배지 복원 */
(function() {
  var logs = _loadRawErrorLogs();
  if (logs.length > 0) _syncNavErrlogBadge(logs.length);
})();


/* ── 결과서 버전 추가 (로컬 알림만) ───────────────────────── */
function doSaveReportVersion() {
  showAlert('info', '결과서가 저장되었습니다. 시나리오 DB 저장은 상단 [💾 DB 저장] 버튼을 사용하세요.');
}

/* ══════════════════════════════════════════════════════════
   이력 관리 (V6 — DB 기반)
   ══════════════════════════════════════════════════════════ */

/* ── 드로어 열기/닫기 ─────────────────────────────────────── */
function openHistoryDrawer() {
  document.getElementById('histDrawer').classList.add('open');
  document.getElementById('histOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  loadHistoryList();
}

function closeHistoryDrawer() {
  document.getElementById('histDrawer').classList.remove('open');
  document.getElementById('histOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── 시나리오 그룹 이력 목록 로드 (DB) ──────────────────── */
function loadHistoryList() {
  var body = document.getElementById('histBody');
  body.innerHTML = '<div class="hist-empty">로딩 중...</div>';

  fetch('<c:url value="/ai/getScenarioGroups.do"/>')
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (!data.success) {
        body.innerHTML = '<div class="hist-empty">오류: ' + esc(data.message || '알 수 없는 오류') + '</div>';
        return;
      }
      var list = data.list || [];
      if (!list.length) {
        body.innerHTML = '<div class="hist-empty">저장된 이력이 없습니다.<br><small>시나리오 생성 시 자동 저장되거나 [💾 DB 저장] 버튼으로 저장할 수 있습니다.</small></div>';
        return;
      }
      var html = '';
      list.forEach(function(g) {
        html +=
          '<div class="hist-card">' +
            '<div class="hist-card-head">' +
              '<span class="hist-grp-id">' + esc(g.grpId) + '</span>' +
              '<span class="hist-count">' + (g.scenCnt || 0) + '건</span>' +
            '</div>' +
            '<div class="hist-card-body">' +
              '<span class="hist-ts">' + esc(g.cratDt || '') + '</span>' +
              '<span class="hist-user">' + esc(g.cratUser || '') + '</span>' +
              '<button class="btn-hist-restore" onclick="doRestoreFromGroup(\'' + esc(g.grpId) + '\')">복원</button>' +
            '</div>' +
          '</div>';
      });
      body.innerHTML = html;
    })
    .catch(function(e){ body.innerHTML = '<div class="hist-empty">오류: ' + esc(e.message) + '</div>'; });
}

/* ── 그룹으로 시나리오 복원 (DB) ─────────────────────────── */
function doRestoreFromGroup(grpId) {
  if (!confirm('[ ' + grpId + ' ]\n이 그룹의 시나리오로 복원하시겠습니까?\n현재 편집 중인 내용은 사라집니다.')) return;

  fetch('<c:url value="/ai/getScenariosByGroup.do"/>?grpId=' + encodeURIComponent(grpId))
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (!data.success) { alert('복원 실패: ' + (data.message || '알 수 없는 오류')); return; }
      var list = data.list || [];
      if (!list.length) { alert('해당 그룹에 저장된 시나리오가 없습니다.'); return; }
      // DB 레코드는 이미 camelCase 필드명으로 반환됨 (ScenarioDao 참고)
      var restored = list.map(function(row){
        return {
          no:             row.no             || row.seq || 0,
          seq:            row.seq            || 0,
          scenarioId:     row.scenarioId     || '',
          testType:       row.testType       || '통합',
          crudType:       row.crudType       || '',
          testName:       row.testName       || '',
          description:    row.description    || '',
          roleNm:         row.roleNm         || '',
          groupName:      row.groupName      || '',
          subCategory:    row.subCategory    || '',
          menuName:       row.menuName       || '',
          preCondition:   row.preCondition   || '',
          expectedResult: row.expectedResult || '',
          confirmer:      row.confirmer      || ''
        };
      });
      currentGrpId = grpId;
      applyRestoredScenarioData(restored, grpId.split('_')[0]);
      closeHistoryDrawer();
      showHistToast('✅ 복원 완료 — ' + grpId + ' (' + restored.length + '건)');
    })
    .catch(function(e){ alert('복원 요청 실패: ' + e.message); });
}

/* ── TC 생성 이력 로드 (DB) ──────────────────────────────── */
function loadTcGenHistList() {
  var body = document.getElementById('histBody');
  body.innerHTML = '<div class="hist-empty">로딩 중...</div>';

  fetch('<c:url value="/ai/getTcGenHistList.do"/>')
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (!data.success) {
        body.innerHTML = '<div class="hist-empty">오류: ' + esc(data.message || '알 수 없는 오류') + '</div>';
        return;
      }
      var list = data.list || [];
      if (!list.length) {
        body.innerHTML = '<div class="tc-hist-section"><div class="tc-hist-title">🔧 TC 생성 이력</div>' +
                         '<div class="hist-empty">TC 생성 이력이 없습니다.</div></div>';
        return;
      }
      var html = '<div class="tc-hist-section"><div class="tc-hist-title">🔧 TC 생성 이력</div>';
      list.forEach(function(h){
        html +=
          '<div class="tc-hist-item">' +
            '<span class="tc-file">' + esc(h.histId) + '</span>' +
            '<span style="background:#e0f2fe;color:#0369a1;padding:1px 6px;border-radius:4px;font-size:10px">' + esc(h.specType || '') + '</span>' +
            '<span class="tc-dt">' + esc(h.genDt || '') + '</span>' +
            '<span style="color:#888;font-size:10px">' + esc(h.genUser || '') + '</span>' +
          '</div>';
      });
      html += '</div>';
      body.innerHTML = html;
    })
    .catch(function(e){ body.innerHTML = '<div class="hist-empty">오류: ' + esc(e.message) + '</div>'; });
}

/* ── 유틸 ────────────────────────────────────────────────── */

function showHistToast(msg) {
  var t = document.getElementById('histToast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 3500);
}

/* ══════════════════════════════════════════════════════════
   PUR 전용 시나리오 생성 (Python 스크립트 → SSE)
   호출: /ai/runPurScenarioGen.do
   ══════════════════════════════════════════════════════════ */
var purGenEventSource  = null;
var purGenFileName     = '';

function runPurScenarioGen() {
  var btn      = document.getElementById('btnPurGen');
  var spinner  = document.getElementById('purGenSpinner');
  var statusEl = document.getElementById('purGenStatus');

  btn.disabled          = true;
  spinner.style.display = 'inline-block';
  statusEl.textContent  = 'PUR 소스 목록 조회 중...';
  statusEl.style.color  = '#888';
  globalProgressStart('PUR 소스 목록 조회 중...');

  fetch('<c:url value="/ai/getSourceList.do"/>?prefix=pur')
    .then(function(r){ return r.json(); })
    .then(function(data){
      btn.disabled          = false;
      spinner.style.display = 'none';
      if (!data.success || !data.sources || data.sources.length === 0) {
        statusEl.textContent = '❌ PUR 소스 없음';
        statusEl.style.color = '#b91c1c';
        globalProgressFinish(false);
        showAlert('error', 'PUR 소스를 찾을 수 없습니다.');
        return;
      }
      currentPrefix  = 'pur';
      uploadedSources = (data.sources || []).map(function(s){
        return Object.assign({}, s, { _checked: true });
      });
      renderSourceList();
      scenarios = [];
      clearScenarioTable();
      document.getElementById('resultSection').style.display    = 'none';
      document.getElementById('scenarioSection').style.display  = 'none';
      updateBtnGenerate();
      statusEl.textContent = '✅ ' + uploadedSources.length + '개 소스 로드됨 — 항목 확인 후 [① 시나리오 생성] 클릭';
      statusEl.style.color = '#15803d';
      globalProgressFinish(true);
    })
    .catch(function(e){
      btn.disabled          = false;
      spinner.style.display = 'none';
      statusEl.textContent  = '❌ 오류: ' + e.message;
      statusEl.style.color  = '#b91c1c';
      globalProgressFinish(false);
    });
}

// ════════════════════════════════════════════════════════════════
// 단위 시나리오 자동 추출 (XFDL 정적 분석)
// ════════════════════════════════════════════════════════════════

function runExtractUnitScenarios() {
  console.log('[DEBUG-UNIT] 추출 버튼 클릭 — uploadedSources.length=' + uploadedSources.length + ' currentPrefix=' + currentPrefix);
  if (!uploadedSources || uploadedSources.length === 0) {
    alert('소스 목록이 없습니다. 먼저 소스 파일을 업로드하세요.');
    return;
  }
  if (!confirm('시나리오를 추출하시겠습니까?')) return;

  var prefix    = currentPrefix || 'pur';
  var btn       = document.getElementById('btnExtractUnit');
  var spinner   = document.getElementById('extractUnitSpinner');
  var statusEl  = document.getElementById('extractUnitStatus');
  var progressW = document.getElementById('extractUnitProgress');
  var bar       = document.getElementById('extractUnitBar');

  console.log('[DEBUG-UNIT] btn=' + btn + ' spinner=' + spinner + ' statusEl=' + statusEl);
  if (!btn || !spinner || !statusEl || !progressW || !bar) {
    console.error('[DEBUG-UNIT] DOM 요소 누락! btn=' + btn + ' spinner=' + spinner + ' statusEl=' + statusEl + ' progressW=' + progressW + ' bar=' + bar);
  }

  if (btn) btn.disabled           = true;
  if (spinner) spinner.style.display  = 'inline-block';
  if (progressW) progressW.style.display = '';
  if (statusEl) { statusEl.textContent   = '분석 중...'; statusEl.style.color = '#64748b'; }
  if (bar) bar.value = 0;

  var checkedNames = uploadedSources.filter(function(s){ return s._checked; }).map(function(s){ return s.rawName || s.displayName || ''; }).filter(Boolean);
  console.log('[DEBUG-UNIT] checkedNames(' + checkedNames.length + '):', JSON.stringify(checkedNames));

  var esUrl = '<c:url value="/ai/extractUnitScenarios.do"/>?prefix=' + encodeURIComponent(prefix)
            + '&sources=' + encodeURIComponent(checkedNames.join(','));
  console.log('[DEBUG-UNIT] EventSource URL:', esUrl);

  var es = new EventSource(esUrl);
  console.log('[DEBUG-UNIT] EventSource 생성됨 readyState=' + es.readyState);

  es.onmessage = function(e) {
    console.log('[DEBUG-UNIT] SSE onmessage raw:', e.data);
    var data;
    try { data = JSON.parse(e.data); } catch(ex) { console.error('[DEBUG-UNIT] JSON 파싱 오류:', ex, 'raw:', e.data); return; }

    if (data.error) {
      console.error('[DEBUG-UNIT] 서버 오류:', data.error);
      es.close();
      if (statusEl) { statusEl.textContent = '❌ 오류: ' + data.error; statusEl.style.color = '#b91c1c'; }
      if (spinner) spinner.style.display  = 'none';
      if (progressW) progressW.style.display = 'none';
      if (btn) btn.disabled = false;
      return;
    }

    if (data.done) {
      console.log('[DEBUG-UNIT] SSE done! count=' + data.count + ' → loadScenariosIntoEditor 키=' + (prefix + '_unit'));
      es.close();
      if (statusEl) { statusEl.textContent = '✅ ' + data.count + '개 시나리오 추출 완료'; statusEl.style.color = '#15803d'; }
      if (spinner) spinner.style.display  = 'none';
      if (progressW) progressW.style.display = 'none';
      if (btn) btn.disabled = false;
      // 그리드에 로드 (단위 시나리오 전용 키로 조회) — 로드 후 DB 자동 저장(무음)
      loadScenariosIntoEditor(prefix + '_unit', data.count, { autoSaveToDB: true });
    } else {
      var pct = data.total > 0 ? Math.round((data.cur / data.total) * 100) : 0;
      if (bar) bar.value = pct;
      if (statusEl) statusEl.textContent = '분석 중... ' + data.cur + ' / ' + data.total;
      console.log('[DEBUG-UNIT] 진행 cur=' + data.cur + ' total=' + data.total);
    }
  };

  es.onerror = function(ev) {
    console.error('[DEBUG-UNIT] SSE onerror! readyState=' + es.readyState, ev);
    es.close();
    if (statusEl) { statusEl.textContent = '❌ 추출 오류'; statusEl.style.color = '#b91c1c'; }
    if (spinner) spinner.style.display  = 'none';
    if (progressW) progressW.style.display = 'none';
    if (btn) btn.disabled = false;
  };
}

// ════════════════════════════════════════════════════════════════
// Phase 4 — 시나리오 내보내기
// ════════════════════════════════════════════════════════════════

/* 직접 다운로드 (SCENARIO_STORE 현재 상태 → xlsx) */
function exportScenarioDirect() {
  var prefix = currentPrefix || 'pur';
  window.location.href = '<c:url value="/ai/exportScenarioDirect.do"/>?prefix='
    + encodeURIComponent(prefix);
}

/* 양식 기반 내보내기 폼 토글 */
function toggleExportForm() {
  var form = document.getElementById('exportFormPanel');
  if (!form) return;
  var isHidden = form.style.display === 'none';
  form.style.display = isHidden ? '' : 'none';
  if (isHidden) {
    var dateEl = document.getElementById('exportDate');
    if (dateEl && !dateEl.value) {
      dateEl.value = new Date().toISOString().slice(0, 10);
    }
  }
}

/* 양식 기반 내보내기 실행 */
function runExportWithTemplate() {
  if (!guardScenarioExport()) return;
  var prefix      = currentPrefix || 'pur';
  var format      = (document.getElementById('exportFormat') || {}).value || 'xlsx';
  var projectName = (document.getElementById('exportProjectName') || {}).value || '';
  var author      = (document.getElementById('exportAuthor') || {}).value || '';
  var date        = (document.getElementById('exportDate') || {}).value || '';

  var url = '<c:url value="/ai/exportScenarioTemplate.do"/>'
    + '?prefix='      + encodeURIComponent(prefix)
    + '&format='      + encodeURIComponent(format)
    + '&projectName=' + encodeURIComponent(projectName)
    + '&author='      + encodeURIComponent(author)
    + '&date='        + encodeURIComponent(date);
  window.location.href = url;
  toggleExportForm();
}

function downloadPurScenario() {
  // 편집기에 데이터가 있으면 현재 편집 상태 기반 Excel 내보내기
  if (_purEditorAllRows && _purEditorAllRows.length) {
    downloadEditedScenarios();
    return false;
  }
  // 편집기가 비어있고 파일이 있으면 원본 파일 다운로드
  if (!purGenFileName) return false;
  var url = '<c:url value="/ai/downloadPurScenario.do"/>?file='
            + encodeURIComponent(purGenFileName);
  window.location.href = url;
  return false;
}

/* 편집기 현재 상태 → 서버 POST → Excel 동적 생성 후 다운로드 */
function downloadEditedScenarios() {
  var rows = _purEditorAllRows.map(function(r) {
    var clean = {};
    PUR_COLS.forEach(function(c) { clean[c.key] = r[c.key] != null ? r[c.key] : ''; });
    clean['pgmId']      = r['pgmId']      || r['sourceName'] || '';
    clean['scenarioId'] = r['scenarioId'] || r['id']         || '';
    return clean;
  });
  fetch('<c:url value="/ai/downloadEditedScenarios.do"/>', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows: rows })
  })
  .then(function(resp) {
    if (!resp.ok) return resp.text().then(function(t){ throw new Error(t); });
    return resp.blob();
  })
  .then(function(blob) {
    var a = document.createElement('a');
    var ts = new Date().toISOString().replace(/[-:T]/g,'').slice(0,14);
    a.href = URL.createObjectURL(blob);
    a.download = 'scenarios_edited_' + ts + '.xlsx';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  })
  .catch(function(e) { showAlert('error', 'Excel 내보내기 오류: ' + e.message); });
}

// ════════════════════════════════════════════════════════════════
// PUR Java 통합 테스트 코드 생성
// ════════════════════════════════════════════════════════════════

var purTestCodeFileName = '';
var purTestCodeEventSource = null;
var _purAutoRun = false;

/** /ai/generatePurTestCode.do 호출 → SSE 스트리밍으로 Java 파일 생성 */
function generatePurTestCode() {
  var btn        = document.getElementById('btnGenTestCode');
  var spinner    = document.getElementById('testCodeSpinner');
  var statusEl   = document.getElementById('testCodeStatus');
  var logSection = document.getElementById('testCodeLogSection');
  var logEl      = document.getElementById('testCodeLog');
  var dlBtn      = document.getElementById('testCodeDownload');
  var previewSec = document.getElementById('testCodePreviewSection');

  // 기존 EventSource 정리
  if (purTestCodeEventSource) {
    purTestCodeEventSource.close();
    purTestCodeEventSource = null;
  }

  // UI 초기화
  btn.disabled          = true;
  spinner.style.display = 'inline-block';
  statusEl.textContent  = '생성 중...';
  statusEl.style.color  = '#64748b';
  dlBtn.style.display   = 'none';
  logSection.style.display = '';
  previewSec.style.display = 'none';

  // 전역 프로그레스 시작
  globalProgressStart('PUR spec.ts 생성 중...');

  genSessionStart('pur', 'PUR spec.ts 생성');
  purTestCodeEventSource = new EventSource('<c:url value="/ai/generatePurTestCode.do"/>');

  purTestCodeEventSource.addEventListener('log', function(e) {
    console.log('[PUR-spec]', e.data);
    addGenLog('pur', e.data);
  });

  purTestCodeEventSource.addEventListener('done', function(e) {
    genSessionEnd('done');
    purTestCodeEventSource.close();
    purTestCodeEventSource = null;
    btn.disabled          = false;
    spinner.style.display = 'none';

    try {
      var data = JSON.parse(e.data);
      if (data.success) {
        globalProgressFinish(true);
        purTestCodeFileName      = data.file || '';
        var cnt                  = data.count || 0;
        statusEl.textContent     = '✅ spec.ts 생성 완료 (' + cnt + '건)';
        statusEl.style.color     = '#15803d';
        dlBtn.style.display      = 'inline';

        var runBtn = document.getElementById('btnRunPurTest');
        if (runBtn) runBtn.style.display = 'inline-block';

        if (purTestCodeFileName) loadTestCodePreview(purTestCodeFileName);

        if (_purAutoRun) {
          _purAutoRun = false;
          var _specName = purTestCodeFileName;
          showAlert('success', '✅ ' + _specName + ' 가 생성되었습니다.');
          setTimeout(function() {
            if (!confirm('테스트 코드를 실행하시겠습니까?\n\n파일: ' + _specName)) return;
            currentPrefix       = 'pur';
            currentSpecFileName = purTestCodeFileName;
            doRunTest(null, getHeadedSetting());
          }, 700);
        } else {
          showAlert('success',
            'spec.ts 생성 완료: ' + purTestCodeFileName
            + '  →  ▶ 테스트 실행 버튼으로 Playwright 실행');
        }
      } else {
        globalProgressFinish(false);
        statusEl.textContent = '❌ 실패: ' + (data.message || '알 수 없는 오류');
        statusEl.style.color = '#b91c1c';
      }
    } catch(err) {
      globalProgressFinish(false);
      statusEl.textContent = '❌ 응답 파싱 오류';
      statusEl.style.color = '#b91c1c';
    }
  });

  purTestCodeEventSource.addEventListener('error', function(e) {
    genSessionEnd('error');
    purTestCodeEventSource.close();
    purTestCodeEventSource = null;
    btn.disabled          = false;
    spinner.style.display = 'none';
    globalProgressFinish(false);
    statusEl.textContent  = '❌ 오류';
    statusEl.style.color  = '#b91c1c';
    /* _purAutoRun 중 실패 → 기존 spec 파일 있으면 바로 실행 fallback */
    if (_purAutoRun) {
      _purAutoRun = false;
      if (purTestCodeFileName) {
        showAlert('warning', '⚠ 시나리오 없음 — 기존 spec 파일로 실행합니다: ' + purTestCodeFileName);
        setTimeout(function() {
          if (!confirm('테스트 코드를 실행하시겠습니까?\n\n파일: ' + purTestCodeFileName)) return;
          currentPrefix       = 'pur';
          currentSpecFileName = purTestCodeFileName;
          doRunTest(null, getHeadedSetting());
        }, 700);
        return;
      }
    }
    if (e.data) showAlert('error', '테스트 코드 생성 오류: ' + e.data);
  });

  purTestCodeEventSource.onerror = function() {
    // SSE 정상 종료 후 자동 호출 — 무시
  };
}

/** 생성된 Java 파일을 서버에서 읽어 미리보기 */
function loadTestCodePreview(fileName) {
  var previewSec = document.getElementById('testCodePreviewSection');
  var preEl      = document.getElementById('testCodePreview');
  previewSec.style.display = '';
  preEl.textContent = '로딩 중...';

  fetch('<c:url value="/ai/downloadPurTestCode.do"/>?file=' + encodeURIComponent(fileName))
    .then(function(r) { return r.text(); })
    .then(function(text) {
      preEl.textContent = text;
    })
    .catch(function(err) {
      preEl.textContent = '미리보기 로드 실패: ' + err.message;
    });
}

/** 생성된 Java 파일 다운로드 */
function downloadPurTestCode() {
  if (!purTestCodeFileName) return false;
  var url = '<c:url value="/ai/downloadPurTestCode.do"/>?file='
            + encodeURIComponent(purTestCodeFileName);
  window.location.href = url;
  return false;
}

/** 미리보기 코드 클립보드 복사 */
function copyTestCode() {
  var preEl = document.getElementById('testCodePreview');
  if (!preEl || !preEl.textContent) return;
  navigator.clipboard.writeText(preEl.textContent)
    .then(function() { showAlert('success', '코드가 클립보드에 복사되었습니다.'); })
    .catch(function() {
      // fallback
      var ta = document.createElement('textarea');
      ta.value = preEl.textContent;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showAlert('success', '코드가 클립보드에 복사되었습니다.');
    });
}

// ════════════════════════════════════════════════════════════════
// PUR Playwright 테스트 실행 (spec.ts 생성 후 기존 실행기로 위임)
// ════════════════════════════════════════════════════════════════

/**
 * spec.ts 생성 완료 후 "▶ 테스트 실행 (Playwright)" 버튼에서 호출.
 * currentPrefix = 'pur', currentSpecFileName = purTestCodeFileName 로 설정 후
 * 기존 doRunTest()를 그대로 사용한다.
 *
 * 사전 조건:
 *   - SCENARIO_STORE["pur"] 존재 (Excel 생성 → 자동 로드)
 *   - SPEC_FILE_STORE["pur"] 존재 (spec.ts 생성 → 자동 등록)
 */
function runPurTest() {
  /* 시나리오가 로드된 경우: 생성 후 실행 흐름 */
  if (scenarios && scenarios.length > 0) {
    if (!confirm('테스트코드를 생성하시겠습니까?')) return;
    _purAutoRun = true;
    generatePurTestCode();
    return;
  }
  /* 시나리오가 없지만 이미 생성된 spec 파일이 있는 경우: 바로 실행 */
  if (purTestCodeFileName) {
    if (!confirm('테스트 코드를 실행하시겠습니까?\n\n파일: ' + purTestCodeFileName)) return;
    currentPrefix       = 'pur';
    currentSpecFileName = purTestCodeFileName;
    doRunTest(null, getHeadedSetting());
    return;
  }
  showAlert('error', 'PUR 시나리오를 먼저 Excel로 업로드하거나, ⚡ spec.ts 생성을 먼저 실행하세요.');
}

/* ══════════════════════════════════════════════════════════
   PUR 시나리오 인라인 에디터
   ══════════════════════════════════════════════════════════ */
var _purEditorHeaders  = [];   // 컬럼 헤더
var _purEditorAllRows  = [];   // 전체 데이터 (원본)
var _purEditorFile     = '';   // 저장 대상 파일 경로
var _purEditorSheetIdx = 0;    // 데이터 시트 인덱스
var _purEditorDataOffset = 2;  // 데이터 시작 행 오프셋 (0-based)

// 편집 가능 컬럼 — 양식 컬럼명 포함
var EDITABLE_COLS = ['테스트명','사전조건','테스트데이터','예상결과','테스트결과','비고',
                     '설명','엑터(역할)','시나리오흐름','입력값','확인자'];

// 구분별 색상
var TYPE_COLOR = { '단위':'#dbeafe', '통합':'#dcfce7', '비정상':'#fee2e2', 'E2E':'#fef9c3' };

/* ── 공통: SCENARIO_STORE → 일반 scenarioSection 에 렌더링 ── */
function loadScenariosIntoEditor(prefix, cnt, options) {
  options = options || {};
  var storeUrl = '<c:url value="/ai/getScenariosFromStore.do"/>?prefix=' + encodeURIComponent(prefix || 'pur');
  console.log('[DEBUG-LOAD] loadScenariosIntoEditor 호출 prefix=' + prefix + ' cnt=' + cnt + ' url=' + storeUrl);
  fetch(storeUrl)
    .then(function(r){
      console.log('[DEBUG-LOAD] getScenariosFromStore HTTP status=' + r.status);
      return r.json();
    })
    .then(function(data) {
      console.log('[DEBUG-LOAD] getScenariosFromStore 응답: success=' + data.success + ' scenarios길이=' + (data.scenarios ? data.scenarios.length : 'null'));
      if (!data.success || !data.scenarios || !data.scenarios.length) {
        console.error('[DEBUG-LOAD] 데이터 없음! data=', JSON.stringify(data).substring(0, 200));
        showAlert('error', '시나리오 데이터 없음 — 먼저 시나리오를 생성하거나 업로드하세요.'); return;
      }
      scenarios = data.scenarios;
      normalizeScenarioTypes(scenarios);
      _purEditorAllRows = scenarios.map(function(s, i){ s.__idx = i; s.__sel = false; return s; });
      buildGnbNameOptions(scenarios);

      var integCnt = _integScenCount(scenarios);
      var unitCnt  = scenarios.filter(function(s){ return s.testType === '단위'; }).length;
      var totalCnt = cnt || scenarios.length;
      document.getElementById('integCountBadge').textContent = '(' + integCnt + ')';
      document.getElementById('unitCountBadge').textContent  = '(' + unitCnt  + ')';
      document.getElementById('scenarioCountBadge').textContent = '(총 ' + totalCnt + '건)';
      renderScenarioTable(scenarios);

      var sec = document.getElementById('scenarioSection');
      sec.style.display = 'block';
      sec.scrollIntoView({ behavior: 'smooth' });

      var btnConfirm = document.getElementById('btnConfirmScenario');
      var btnSave    = document.getElementById('btnSaveScenarioDB');
      var btnHist    = document.getElementById('btnAddHistoryGroup');
      if (btnConfirm) btnConfirm.disabled = false;
      if (btnSave)    btnSave.disabled    = false;
      if (btnHist)    btnHist.disabled    = false;

      // 옵션: 로드 완료 후 DB 자동 저장(무음) — 시나리오 추출 완료 시 호출됨
      if (options.autoSaveToDB) {
        autoSaveScenariosToDBSilent(currentPrefix);
      }
    })
    .catch(function(e){ showAlert('error', '에디터 로드 오류: ' + e.message); });
}

/* ── DB 자동 저장 (무음) ────────────────────────────────────────
 * 시나리오 추출 완료 직후 호출. UI 알림·프로그레스바 없이 서버 저장만 수행한다.
 * addHistoryGroup을 사용해 항상 새 이력으로 저장 → "실행한 일시"별 이력이 누적된다.
 *   useServerStore=true → 클라이언트 scenarios 배열을 전송하지 않고
 *                        서버 SCENARIO_STORE fallback을 강제 사용 (통합 SSE 경로용) */
function autoSaveScenariosToDBSilent(prefix, useServerStore) {
  var statusEl = document.getElementById('scenarioDbStatus');
  var payload  = { prefix: prefix || currentPrefix || 'pur' };
  if (!useServerStore && scenarios && scenarios.length) payload.scenarios = scenarios;

  if (statusEl) { statusEl.textContent = '💾 DB 자동 저장 중...'; statusEl.style.color = '#0891b2'; }

  fetch('<c:url value="/ai/addHistoryGroup.do"/>', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    if (data && data.success) {
      currentGrpId = data.grpId || currentGrpId;
      if (statusEl) {
        statusEl.textContent = '✅ 자동 저장 — ' + (data.grpId || '');
        statusEl.style.color = '#15803d';
      }
      setTimeout(function(){ if (statusEl) statusEl.textContent = ''; }, 4000);
      console.log('[autoSaveScenariosToDBSilent] 저장 완료 grpId=' + (data.grpId || ''));
    } else {
      if (statusEl) {
        statusEl.textContent = '⚠ 자동 저장 실패 — ' + (data && data.message || '');
        statusEl.style.color = '#b45309';
      }
      console.warn('[autoSaveScenariosToDBSilent] 실패:', data && data.message);
    }
  })
  .catch(function(e){
    if (statusEl) { statusEl.textContent = '⚠ 자동 저장 오류'; statusEl.style.color = '#b45309'; }
    console.warn('[autoSaveScenariosToDBSilent] 오류:', e.message);
  });
}

/* ── 시나리오 불러오기 모달 (STEP 2 헤더 "📂 시나리오 불러오기" 버튼) ──
 *   - 저장 일시(cratDt) 리스트를 보여주고, 클릭 시 그 시점 시나리오를 로드
 *   - 현재 prefix에 해당하는 그룹만 필터링 (grpId 접두어 기준) */
function openLoadScenarioModal() {
  var modal = document.getElementById('loadScenarioModal');
  if (!modal) return;
  modal.style.display = 'flex';
  refreshLoadScenarioModal();
}

function closeLoadScenarioModal() {
  var modal = document.getElementById('loadScenarioModal');
  if (modal) modal.style.display = 'none';
}

function refreshLoadScenarioModal() {
  var empty = document.getElementById('loadScenarioModalEmpty');
  var table = document.getElementById('loadScenarioModalTable');
  var body  = document.getElementById('loadScenarioModalBody');
  if (!empty || !table || !body) return;

  empty.style.display = '';
  empty.style.color   = '#888';
  empty.textContent   = '로딩 중...';
  table.style.display = 'none';
  body.innerHTML      = '';

  fetch('<c:url value="/ai/getScenarioGroups.do"/>')
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (!data.success) {
        empty.textContent = '오류: ' + esc(data.message || '알 수 없는 오류');
        empty.style.color = '#b91c1c';
        return;
      }
      var list = data.list || [];
      // currentPrefix가 설정돼 있으면 해당 prefix만, 없으면 전체 이력 표시
      // (소스 업로드 전 a-1 탭에서 열렸을 경우 대비)
      var curPrefix = (currentPrefix || '').toLowerCase().trim();
      var filtered = curPrefix
        ? list.filter(function(g) {
            var grpId = (g.grpId || '').toLowerCase();
            return grpId.indexOf(curPrefix + '_') === 0 || grpId === curPrefix;
          })
        : list.slice();
      if (!filtered.length) {
        empty.textContent = curPrefix
          ? '"' + curPrefix + '" 이력이 없습니다. 시나리오 추출 시 자동 저장되거나 [💾 DB 저장]으로 저장하세요.'
          : '저장된 시나리오 이력이 없습니다. 시나리오를 추출하면 자동 저장됩니다.';
        return;
      }

      var html = '';
      filtered.forEach(function(g) {
        var grpId = g.grpId || '';
        var safeGrpId = grpId.replace(/'/g, "\\'");
        html +=
          '<tr style="border-bottom:1px solid #f1f5f9;cursor:pointer" ' +
              'onmouseover="this.style.background=\'#f0f9ff\'" ' +
              'onmouseout="this.style.background=\'\'" ' +
              'onclick="pickLoadScenarioGroup(\'' + safeGrpId + '\')">' +
            '<td style="padding:8px 12px;white-space:nowrap;color:#0c4a6e;font-weight:600">' +
              esc(g.cratDt || '') + '</td>' +
            '<td style="padding:8px 12px;font-family:monospace;font-size:11px;color:#334155">' +
              esc(grpId) + '</td>' +
            '<td style="padding:8px 12px;text-align:center">' +
              '<span style="background:#e0e7ff;color:#3730a3;padding:1px 7px;border-radius:4px;' +
                     'font-size:11px;font-weight:600">' + (g.scenCnt || 0) + '건</span>' +
            '</td>' +
            '<td style="padding:8px 12px;text-align:center">' +
              '<button style="background:#0891b2;color:#fff;border:none;border-radius:3px;' +
                     'padding:3px 10px;font-size:11px;cursor:pointer" ' +
                     'onclick="event.stopPropagation();pickLoadScenarioGroup(\'' + safeGrpId + '\')">' +
                '불러오기</button>' +
            '</td>' +
          '</tr>';
      });
      body.innerHTML      = html;
      empty.style.display = 'none';
      table.style.display = '';
    })
    .catch(function(e){
      empty.textContent = '오류: ' + e.message;
      empty.style.color = '#b91c1c';
    });
}

function pickLoadScenarioGroup(grpId) {
  if (!grpId) return;
  if (!confirm('[ ' + grpId + ' ]\n이 시점의 시나리오를 STEP 2 시나리오 목록/편집에 불러옵니다.\n현재 편집 중인 내용은 사라집니다.')) return;

  closeLoadScenarioModal();

  fetch('<c:url value="/ai/getScenariosByGroup.do"/>?grpId=' + encodeURIComponent(grpId))
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (!data.success) { showAlert('error', '불러오기 실패: ' + (data.message || '알 수 없는 오류')); return; }
      var list = data.list || [];
      if (!list.length) { showAlert('warning', '해당 시점에 저장된 시나리오가 없습니다.'); return; }
      var restored = list.map(function(row){
        return {
          no:             row.no             || row.seq || 0,
          seq:            row.seq            || 0,
          scenarioId:     row.scenarioId     || '',
          testType:       row.testType       || '통합',
          crudType:       row.crudType       || '',
          testName:       row.testName       || '',
          description:    row.description    || '',
          roleNm:         row.roleNm         || '',
          groupName:      row.groupName      || '',
          subCategory:    row.subCategory    || '',
          menuName:       row.menuName       || '',
          preCondition:   row.preCondition   || '',
          inputValues:    row.inputValues    || '',
          expectedResult: row.expectedResult || '',
          confirmer:      row.confirmer      || '',
          url:            row.url            || '',
          method:         row.method         || '',
          gnbName:        row.gnbName        || '',
          menuPath:       row.menuPath       || ''
        };
      });
      currentGrpId = grpId;
      var prefixFromGrpId = (grpId.split('_')[0] || currentPrefix || 'pur').toLowerCase();
      applyRestoredScenarioData(restored, prefixFromGrpId);

      // "DB 저장" 버튼 활성화 (applyRestoredScenarioData가 안 건드림)
      var btnSave = document.getElementById('btnSaveScenarioDB');
      if (btnSave) btnSave.disabled = false;

      showAlert('success', '✅ 불러오기 완료 — ' + grpId + ' (' + restored.length + '건)');
    })
    .catch(function(e){ showAlert('error', '불러오기 요청 실패: ' + e.message); });
}

function loadPurScenarioEditor(filePath) {
  _purEditorFile = filePath;
  loadScenariosIntoEditor('pur');
}

// 통합 시나리오 컬럼 정의 — 저장/편집기/Excel 헤더 공통 스키마
var PUR_COLS = [
  { key: 'no',             label: 'No',           editable: false, width: '36px'  },
  { key: 'testType',       label: '구분',          editable: false, width: '46px'  },
  { key: 'scenarioId',     label: 'ID',            editable: false, width: '78px'  },
  { key: 'testName',       label: '테스트명',       editable: true,  width: ''      },
  { key: 'roleNm',         label: '엑터(역할)',     editable: true,  width: '90px'  },
  { key: 'url',            label: 'URL',           editable: true,  width: '190px' },
  { key: 'method',         label: 'Method',        editable: true,  width: '54px'  },
  { key: 'gnbName',        label: '대메뉴(GNB)',    editable: true,  width: '100px' },
  { key: 'groupName',      label: '중분류',         editable: true,  width: '100px' },
  { key: 'subCategory',    label: '소분류',         editable: true,  width: '100px' },
  { key: 'menuName',       label: '메뉴명',         editable: true,  width: '120px' },
  { key: 'preCondition',   label: '시나리오흐름',   editable: true,  width: '200px' },
  { key: 'inputValues',    label: '입력값',         editable: true,  width: '120px' },
  { key: 'expectedResult', label: '예상결과',       editable: true,  width: '200px' },
  { key: 'testResult',     label: '테스트결과',     editable: false, width: '78px'  },
  { key: 'confirmer',      label: '확인자',         editable: true,  width: '70px'  },
  { key: 'plConfirm',      label: 'PL확인',         editable: true,  width: '70px'  },
  { key: 'reason',         label: '사유',           editable: true,  width: '120px' },
  { key: 'userConfirm',    label: '사용자확인',     editable: true,  width: '70px'  },
  { key: 'menuPath',       label: '메뉴경로',       editable: true,  width: '200px' }
];

function renderPurEditor(rows) {
  var head = document.getElementById('purEditorHead');
  var body = document.getElementById('purEditorBody');

  // 헤더 — 고정 컬럼
  var hHtml = '<tr><th style="width:28px"><input type="checkbox" onchange="purEditorSelectAll(this.checked)"></th>';
  PUR_COLS.forEach(function(c) {
    hHtml += '<th class="' + (c.editable ? 'editable' : '') + '"'
           + (c.width ? ' style="width:' + c.width + '"' : '') + '>'
           + c.label + (c.editable ? ' ✏' : '') + '</th>';
  });
  head.innerHTML = hHtml + '</tr>';

  // 행
  var bHtml = '';
  if (!rows.length) {
    bHtml = '<tr><td colspan="' + (PUR_COLS.length + 1) + '" style="text-align:center;padding:16px;color:#888">데이터 없음</td></tr>';
  }
  rows.forEach(function(s) {
    var typeLabel = s.testType || '통합';
    var bgColor   = (!s.menuPath && s.crudType) ? '#E5E7EB'  // menuPath 없는 XFDL 추출 행 → 회색
                  : (TYPE_COLOR[typeLabel] || '#fff');
    var rowTitle  = (!s.menuPath && s.crudType) ? ' title="메뉴 경로를 찾지 못했습니다. 수동으로 입력해주세요."' : '';
    bHtml += '<tr id="pur-row-' + s.__idx + '" style="background:' + bgColor + '"' + rowTitle + '>';
    bHtml += '<td style="text-align:center;padding:3px"><input type="checkbox" '
           + (s.__sel ? 'checked' : '')
           + ' onchange="purEditorToggleSel(' + s.__idx + ',this.checked)"></td>';
    PUR_COLS.forEach(function(c) {
      var val     = s[c.key] != null ? String(s[c.key]) : '';
      var safeVal = val.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      if (c.key === 'testType') {
        bHtml += '<td style="text-align:center"><span class="pur-badge pur-badge-' + esc(typeLabel) + '">' + esc(typeLabel) + '</span></td>';
      } else if (c.key === 'no') {
        bHtml += '<td style="text-align:center;color:#666;font-size:11px">' + (s.seq || s.no || '') + '</td>';
      } else if (c.key === 'testResult') {
        bHtml += '<td style="text-align:center;color:#888">-</td>';
      } else if (c.editable) {
        var editBg = (c.key === 'testName' || c.key === 'preCondition' || c.key === 'expectedResult')
                   ? 'background:#fef9c3;' : '';
        bHtml += '<td class="editable-cell" contenteditable="true" '
               + 'data-idx="' + s.__idx + '" data-col="' + c.key + '" '
               + 'onblur="purEditorCellBlur(this)" '
               + 'onkeydown="purEditorKeyNav(event,this)" '
               + 'style="white-space:pre-wrap;font-size:12px;' + editBg + '">' + safeVal + '</td>';
      } else {
        bHtml += '<td style="color:#64748b;font-size:11px;overflow:hidden;max-width:160px;text-overflow:ellipsis" title="' + safeVal + '">' + safeVal + '</td>';
      }
    });
    bHtml += '</tr>';
  });
  body.innerHTML = bHtml;
  document.getElementById('purEditorCount').textContent =
    '(' + rows.length + ' / ' + _purEditorAllRows.length + '건)';
}

function purEditorCellBlur(cell) {
  var idx = parseInt(cell.dataset.idx, 10);
  var col = cell.dataset.col;
  var val = cell.textContent;
  for (var i = 0; i < _purEditorAllRows.length; i++) {
    if (_purEditorAllRows[i].__idx === idx) {
      _purEditorAllRows[i][col] = val;
      break;
    }
  }
  cell.classList.add('edited');
}

function purEditorKeyNav(e, cell) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); cell.blur(); }
  if (e.key === 'Tab') {
    e.preventDefault();
    var allEditable = Array.from(document.querySelectorAll('#purEditorBody td.editable-cell'));
    var idx = allEditable.indexOf(cell);
    var next = allEditable[e.shiftKey ? idx - 1 : idx + 1];
    if (next) { next.focus(); var r = document.createRange(); r.selectNodeContents(next); r.collapse(false); var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); }
  }
}

function filterPurEditor() {
  var q    = (document.getElementById('purEditorSearch').value || '').toLowerCase();
  var type = document.getElementById('purEditorTypeFilter').value;
  var gnbEl = document.getElementById('filterGnbName');
  var gnb  = gnbEl ? gnbEl.value : '';
  var filtered = _purEditorAllRows.filter(function(r) {
    if (type && (r.testType || r['구분'] || '') !== type) return false;
    if (gnb && (r.gnbName || '') !== gnb) return false;
    if (q && (r.testName || r['테스트명'] || '').toLowerCase().indexOf(q) < 0) return false;
    return true;
  });
  renderPurEditor(filtered);
}

function buildGnbNameOptions(scenarios) {
  var sel = document.getElementById('filterGnbName');
  if (!sel) return;
  var names = [];
  var seen  = {};
  (scenarios || []).forEach(function(s) {
    var n = s.gnbName || '';
    if (n && !seen[n]) { seen[n] = true; names.push(n); }
  });
  names.sort();
  sel.innerHTML = '<option value="">전체 메뉴</option>';
  names.forEach(function(n) {
    var opt = document.createElement('option');
    opt.value = n; opt.textContent = n;
    sel.appendChild(opt);
  });
}

function purEditorSelectAll(checked) {
  _purEditorAllRows.forEach(function(r){ r.__sel = checked; });
  document.querySelectorAll('#purEditorBody input[type=checkbox]').forEach(function(cb){ cb.checked = checked; });
  document.querySelectorAll('#purEditorBody tr').forEach(function(tr){ tr.classList.toggle('row-sel', checked); });
}

function purEditorToggleSel(idx, checked) {
  for (var i = 0; i < _purEditorAllRows.length; i++) {
    if (_purEditorAllRows[i].__idx === idx) { _purEditorAllRows[i].__sel = checked; break; }
  }
  var tr = document.getElementById('pur-row-' + idx);
  if (tr) tr.classList.toggle('row-sel', checked);
}

function purEditorAddRow() {
  var newRow = { __idx: Date.now(), __sel: false };
  PUR_COLS.forEach(function(c){ newRow[c.key] = ''; });
  newRow['no'] = _purEditorAllRows.length + 1;
  _purEditorAllRows.push(newRow);
  filterPurEditor();
  // 새 행으로 스크롤
  setTimeout(function(){
    var lastTr = document.querySelector('#purEditorBody tr:last-child');
    if (lastTr) lastTr.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

function purEditorDeleteSelected() {
  var sel = _purEditorAllRows.filter(function(r){ return r.__sel; });
  if (!sel.length) { showAlert('warning', '삭제할 행을 선택하세요.'); return; }
  if (!confirm(sel.length + '개 행을 삭제하시겠습니까?')) return;
  _purEditorAllRows = _purEditorAllRows.filter(function(r){ return !r.__sel; });
  filterPurEditor();
}

/* ══════════════════════════════════════════════════════════
   기존 Excel 불러오기 → 에디터 + SCENARIO_STORE 동시 로드
   ══════════════════════════════════════════════════════════ */
/* ── 통합 불러오기 핸들러 (Excel / JSON 자동 분기) ───────────── */
function onLoadFilePicked(input) {
  var file = input.files && input.files[0];
  if (file) _dispatchLoadFile(file);
  input.value = '';
}

function onLoadFileDrop(event) {
  event.preventDefault();
  var file = event.dataTransfer && event.dataTransfer.files[0];
  if (file) _dispatchLoadFile(file);
}

function _dispatchLoadFile(file) {
  var nameEl   = document.getElementById('loadFileName');
  var statusEl = document.getElementById('loadFileStatus');
  if (nameEl)   nameEl.textContent   = file.name;
  if (statusEl) statusEl.textContent = '';

  var ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'xlsx' || ext === 'xls') {
    uploadPurExcelFile(file);
  } else if (ext === 'json') {
    doRestoreFromDroppedFile(file);
  } else {
    if (statusEl) { statusEl.textContent = '❌ .xlsx 또는 .json 파일만 지원합니다'; statusEl.style.color = '#b91c1c'; }
    showAlert('warning', '.xlsx 또는 .json 파일을 선택하세요.');
  }
}

/* input[type=file] 핸들러 — 파일 객체 추출 후 공통 함수 호출 */
function loadExistingScenarioFile(input) {
  var file = input.files && input.files[0];
  if (file) uploadPurExcelFile(file);
}

/* 실제 업로드 처리 — File 객체를 직접 받음 (드롭·파일선택 공용) */
function uploadPurExcelFile(file) {
  var nameEl   = document.getElementById('loadFileName');
  var statusEl = document.getElementById('loadFileStatus');
  if (nameEl)   nameEl.textContent   = file.name;
  if (statusEl) { statusEl.style.color = '#888'; statusEl.textContent = '업로드 중...'; }

  var fd = new FormData();
  fd.append('file', file);
  fetch('<c:url value="/ai/uploadPurScenarioExcel.do"/>', { method: 'POST', body: fd })
    .then(function(r) {
      if (!r.ok) {
        return r.text().then(function(t) {
          throw new Error('서버 오류 ' + r.status + ' — 서버 재시작 후 다시 시도하세요.\n' + t.substring(0, 120));
        });
      }
      return r.json();
    })
    .then(function(data) {
      if (!data.success) {
        if (statusEl) { statusEl.style.color = '#b91c1c'; statusEl.textContent = '❌ ' + (data.message || '업로드 실패'); }
        showAlert('error', data.message || '업로드 실패');
        return;
      }
      if (statusEl) { statusEl.style.color = '#15803d'; statusEl.textContent = '✓ ' + data.count + '개 시나리오 로드됨'; }

      currentPrefix  = data.prefix  || 'pur';
      _purEditorFile = data.filePath || '';
      loadScenariosIntoEditor(currentPrefix, data.count);
      showAlert('success', data.count + '개 시나리오를 불러왔습니다. 아래 인라인 편집기에서 수정하세요.');
    })
    .catch(function(e) {
      if (statusEl) { statusEl.style.color = '#b91c1c'; statusEl.textContent = '❌ ' + e.message.split('\n')[0]; }
      showAlert('error', e.message);
    });
}

/* ══════════════════════════════════════════════════════════
   spec.ts 생성 — 에디터 내용을 SCENARIO_STORE에 저장 후 SSE 시작
   ══════════════════════════════════════════════════════════ */
function genSpecFromEditor() {
  if (!_purEditorAllRows.length) {
    showAlert('warning', '에디터에 시나리오가 없습니다. 먼저 생성하거나 불러오세요.'); return;
  }
  var btn     = document.getElementById('btnGenSpecFromEditor');
  var spinner = document.getElementById('purSpecSpinner');
  var status  = document.getElementById('purSpecStatus');
  btn.disabled = true;
  spinner.style.display = 'inline-block';
  status.textContent = 'SCENARIO_STORE 저장 중...';

  // 에디터 현재 내용 수집 — PUR_COLS key 기반 (서버 storeEditedScenarios와 동일 스키마)
  var purKeys = PUR_COLS.map(function(c){ return c.key; });
  var cleanRows = _purEditorAllRows.map(function(r) {
    var clean = {};
    purKeys.forEach(function(k){ clean[k] = r[k] != null ? r[k] : ''; });
    clean['pgmId']      = r['pgmId']      || r['sourceName'] || '';
    clean['scenarioId'] = r['scenarioId'] || r['id']         || '';
    return clean;
  });

  // ① 에디터 내용을 서버 SCENARIO_STORE에 저장
  fetch('<c:url value="/ai/storeEditedScenarios.do"/>', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows: cleanRows })
  })
  .then(function(r){ return r.json(); })
  .then(function(data) {
    if (!data.success) {
      btn.disabled = false; spinner.style.display = 'none';
      status.textContent = '❌ 저장 실패';
      showAlert('error', data.message || 'SCENARIO_STORE 저장 오류'); return;
    }

    status.textContent = data.count + '개 시나리오 저장 완료. spec.ts 생성 시작...';
    currentPrefix = data.prefix || 'pur';

    // ② 기존 spec.ts 생성 SSE 흐름 재사용 — 체크된 행만 전달
    btn.disabled = false; spinner.style.display = 'none';
    status.textContent = '';

    var selIds = _purEditorAllRows
      .filter(function(r){ return r.__sel; })
      .map(function(r){ return r.scenarioId || r.id || ''; })
      .filter(Boolean);
    doStartSpecStream(currentPrefix, selIds.length ? selIds.join(',') : '');
    showAlert('info', selIds.length
      ? 'spec.ts 생성을 시작합니다. (선택 ' + selIds.length + '건)'
      : 'spec.ts 생성을 시작합니다. (전체)');
  })
  .catch(function(e) {
    btn.disabled = false; spinner.style.display = 'none';
    status.textContent = '❌ 오류';
    showAlert('error', 'spec 생성 오류: ' + e.message);
  });
}

/* ══════════════════════════════════════════════════════════
   공용 드롭존 헬퍼
   ══════════════════════════════════════════════════════════ */
function setDropZoneActive(id, on) {
  var el = document.getElementById(id);
  if (el) el.classList[on ? 'add' : 'remove']('drag-over');
}

function bindDropZone(zoneId, acceptTypes, onFile, onHistId) {
  var zone = document.getElementById(zoneId);
  if (!zone) return;

  zone.addEventListener('dragover', function(e) {
    var types = Array.prototype.slice.call(e.dataTransfer.types);
    var ok = types.some(function(t){ return acceptTypes.indexOf(t) >= 0; });
    if (!ok) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setDropZoneActive(zoneId, true);
  });

  zone.addEventListener('dragleave', function(e) {
    if (!zone.contains(e.relatedTarget)) setDropZoneActive(zoneId, false);
  });

  zone.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDropZoneActive(zoneId, false);

    if (onHistId) {
      var histId = e.dataTransfer.getData('application/hist-id');
      if (histId) { onHistId(histId); return; }
    }

    var files = e.dataTransfer.files;
    if (files && files.length > 0 && onFile) onFile(files[0]);
  });
}

/* ── 시나리오 JSON 드롭존 ─────────────────────────────────── */
function initScenarioDropZone() {
  bindDropZone('scenarioDropZone',
    ['application/hist-id', 'Files'],
    function(file) {
      if (!file.name.toLowerCase().endsWith('.json')) {
        showAlert('warning', 'JSON 파일(.json)만 드롭 가능합니다.');
        return;
      }
      if (file.size > 3 * 1024 * 1024) { showAlert('warning', '파일 크기가 3MB를 초과합니다.'); return; }
      doRestoreFromDroppedFile(file);
    },
    function(histId) { doRestoreHistoryFromDrop(histId); }
  );
}

/* ── spec.ts 드롭존 ──────────────────────────────────────── */
function initSpecDropZone() {
  bindDropZone('specDropZone',
    ['Files'],
    function(file) {
      if (!file.name.toLowerCase().endsWith('.ts')) {
        showAlert('warning', '.ts 파일만 드롭 가능합니다.');
        return;
      }
      if (file.size > 3 * 1024 * 1024) { showAlert('warning', '파일 크기가 3MB를 초과합니다.'); return; }
      loadSpecFromDroppedFile(file);
    },
    null
  );
}

/* ── 시나리오 파일 선택 (input[type=file]) ───────────────── */
function onScenarioJsonPicked(input) {
  if (input.files && input.files.length > 0) doRestoreFromDroppedFile(input.files[0]);
  input.value = '';
}

/* ── spec.ts 파일 선택 (input[type=file]) ────────────────── */
function onSpecTsFilePicked(input) {
  if (input.files && input.files.length > 0) loadSpecFromDroppedFile(input.files[0]);
  input.value = '';
}

/* ── 이력 카드 드롭으로 복원 (grpId 기반 DB) ─────────────── */
function doRestoreHistoryFromDrop(grpId) {
  fetch('<c:url value="/ai/getScenariosByGroup.do"/>?grpId=' + encodeURIComponent(grpId))
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (!data.success) { showAlert('error', '복원 실패: ' + (data.message || '')); return; }
      var list = data.list || [];
      var restored = list.map(function(row){
        return {
          no:             row.no             || row.seq || 0,
          seq:            row.seq            || 0,
          scenarioId:     row.scenarioId     || '',
          testType:       row.testType       || '통합',
          crudType:       row.crudType       || '',
          testName:       row.testName       || '',
          description:    row.description    || '',
          roleNm:         row.roleNm         || '',
          groupName:      row.groupName      || '',
          subCategory:    row.subCategory    || '',
          menuName:       row.menuName       || '',
          preCondition:   row.preCondition   || '',
          expectedResult: row.expectedResult || '',
          confirmer:      row.confirmer      || ''
        };
      });
      currentGrpId = grpId;
      applyRestoredScenarioData(restored, grpId.split('_')[0]);
      showHistToast('✅ 드래그 복원 완료 — ' + grpId + ' (' + restored.length + '건)');
    })
    .catch(function(e){ showAlert('error', '복원 요청 실패: ' + e.message); });
}

/* ── JSON 파일 드롭으로 시나리오 로드 ────────────────────── */
function doRestoreFromDroppedFile(file) {
  var reader = new FileReader();
  reader.onload = function(ev) {
    try {
      var data = JSON.parse(ev.target.result);
      var restored, prefix;
      if (Array.isArray(data)) {
        restored = data; prefix = currentPrefix;
      } else if (data.scenarios && Array.isArray(data.scenarios)) {
        restored = data.scenarios; prefix = data.prefix || currentPrefix;
      } else {
        showAlert('warning', '인식할 수 없는 JSON 형식입니다. scenarios 배열이 필요합니다.');
        return;
      }
      applyRestoredScenarioData(restored, prefix);
      showHistToast('✅ ' + restored.length + '건 로드 완료 — ' + file.name);
    } catch(ex) { showAlert('error', 'JSON 파싱 오류: ' + ex.message); }
  };
  reader.readAsText(file, 'UTF-8');
}

/* ── spec.ts 파일 서버 업로드 후 적용 ────────────────────── */
function loadSpecFromDroppedFile(file) {
  var statusEl = document.getElementById('specImportStatus');
  if (statusEl) { statusEl.textContent = '업로드 중...'; statusEl.style.color = '#888'; }

  var reader = new FileReader();
  reader.onload = function(ev) {
    var content = ev.target.result;
    fetch('<c:url value="/ai/importSpecFile.do"/>', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, content: content, prefix: currentPrefix || 'imported' })
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (data.success) {
        currentSpecFileName = data.specFile || file.name;
        var specInfo = document.getElementById('specFileInfo');
        if (specInfo) specInfo.textContent = currentSpecFileName;
        var btnRegen = document.getElementById('btnRegenSpec');
        if (btnRegen) btnRegen.style.display = 'inline-flex';
        if (statusEl) { statusEl.textContent = '✅ ' + currentSpecFileName + ' 불러오기 완료'; statusEl.style.color = '#15803d'; }
        showHistToast('✅ spec.ts 불러오기 완료 — ' + currentSpecFileName);
        markStepComplete(2);
        showSpecPreview(content, currentSpecFileName);
      } else {
        if (statusEl) { statusEl.textContent = '❌ ' + data.message; statusEl.style.color = '#b91c1c'; }
        showAlert('error', 'spec.ts 저장 실패: ' + data.message);
      }
    })
    .catch(function(e){
      if (statusEl) { statusEl.textContent = '❌ 오류: ' + e.message; statusEl.style.color = '#b91c1c'; }
      showAlert('error', 'spec.ts 업로드 오류: ' + e.message);
    });
  };
  reader.readAsText(file, 'UTF-8');
}

/* ── 시나리오 복원 공통 적용 ──────────────────────────────── */
function applyRestoredScenarioData(restored, prefix) {
  scenarios = restored;
  normalizeScenarioTypes(scenarios);
  if (prefix) currentPrefix = prefix;
  // 이력 불러오기 시에도 _purEditorAllRows 동기화 — guardScenarioExport + getExportScenarios 에서 사용
  _purEditorAllRows = scenarios.map(function(s, i) { s.__idx = i; s.__sel = false; return s; });

  var integCnt = _integScenCount(scenarios);
  var unitCnt  = scenarios.filter(function(s){ return s.testType === '단위'; }).length;
  var integBadge = document.getElementById('integCountBadge');
  var unitBadge  = document.getElementById('unitCountBadge');
  var cntBadge   = document.getElementById('scenarioCountBadge');
  var editBadge  = document.getElementById('scenarioEditedBadge');
  if (integBadge) integBadge.textContent = '(' + integCnt + ')';
  if (unitBadge)  unitBadge.textContent  = '(' + unitCnt  + ')';
  if (cntBadge)   cntBadge.textContent   = '(총 ' + scenarios.length + '건)';
  if (editBadge)  editBadge.style.display = 'none';

  renderScenarioTable(scenarios);

  var sec = document.getElementById('scenarioSection');
  if (sec) { sec.style.display = 'block'; sec.scrollIntoView({ behavior: 'smooth' }); }

  var btnConfirm = document.getElementById('btnConfirmScenario');
  var btnVer     = document.getElementById('btnAddVersion');
  if (btnConfirm) btnConfirm.disabled = false;
  if (btnVer)     btnVer.disabled     = false;
}

/* ── PUR 시나리오 Excel 드롭존 ────────────────────────────── */
function initPurLoadDropZone() {
  bindDropZone('purLoadDropZone',
    ['Files'],
    function(file) {
      if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
        showAlert('warning', 'Excel 파일(.xlsx)만 드롭 가능합니다.');
        return;
      }
      if (file.size > 3 * 1024 * 1024) { showAlert('warning', '파일 크기가 3MB를 초과합니다.'); return; }
      uploadPurExcelFile(file);
    },
    null
  );
}

// 페이지 로드 시 드롭존 초기화
initScenarioDropZone();
initSpecDropZone();
initPurLoadDropZone();

function savePurScenarioEdits() {
  if (!_purEditorFile) { showAlert('warning', '저장할 파일이 없습니다.'); return; }
  var btn     = document.getElementById('purSaveSpinner').parentElement;
  var spinner = document.getElementById('purSaveSpinner');
  var status  = document.getElementById('purSaveStatus');
  spinner.style.display = 'inline-block';
  status.textContent = '저장 중...';

  // __idx, __sel 제거 후 전송 — PUR_COLS key 기반
  var purKeys2 = PUR_COLS.map(function(c){ return c.key; });
  var cleanRows = _purEditorAllRows.map(function(r) {
    var clean = {};
    purKeys2.forEach(function(k){ clean[k] = r[k] != null ? r[k] : ''; });
    clean['pgmId']      = r['pgmId']      || r['sourceName'] || '';
    clean['scenarioId'] = r['scenarioId'] || r['id']         || '';
    return clean;
  });

  fetch('<c:url value="/ai/savePurScenarioData.do"/>', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file: _purEditorFile, headers: PUR_COLS.map(function(c){ return c.key; }), rows: cleanRows,
                          sheetIdx: _purEditorSheetIdx, dataOffset: _purEditorDataOffset,
                          prefix: currentPrefix || 'pur' })
  })
  .then(function(r){ return r.json(); })
  .then(function(data) {
    spinner.style.display = 'none';
    if (data.success) {
      status.textContent = '✅ ' + (data.message || '저장 완료');
      status.style.color = '#15803d';
      var savedPath = data.filePath || _purEditorFile || '';
      var savedName = savedPath.split(/[\\/]/).pop();
      showAlert('success', 'Excel 저장 완료 — ' + savedName + '\n경로: ' + savedPath);
    } else {
      status.textContent = '❌ 저장 실패';
      status.style.color = '#dc2626';
      showAlert('error', data.message || '저장 오류');
    }
  })
  .catch(function(e) {
    spinner.style.display = 'none';
    status.textContent = '❌ 오류';
    showAlert('error', '저장 오류: ' + e.message);
  });
}

/* ══════════════════════════════════════════════════════════
   최근 테스트코드 불러오기 — TC 생성 이력 그리드
   ══════════════════════════════════════════════════════════ */

/**
 * AI_TC_GEN_HIST 테이블에서 spec.ts 생성 이력 조회 → tcGenHistGrid에 렌더링
 * 컬럼: 생성일시 | 파일명 | 유형 | 불러오기
 */
function loadTcGenHistGrid() {
  var wrap  = document.getElementById('tcGenHistGridWrap');
  var empty = document.getElementById('tcGenHistEmpty');
  var body  = document.getElementById('tcGenHistGridBody');
  if (!wrap || !empty || !body) return;

  empty.textContent = '로딩 중...';
  empty.style.display = '';
  wrap.style.display  = 'none';

  fetch('<c:url value="/ai/getTcGenHistList.do"/>')
    .then(function(r){ return r.json(); })
    .then(function(data) {
      if (!data.success) {
        empty.textContent = '오류: ' + esc(data.message || '알 수 없는 오류');
        return;
      }
      var list = data.list || [];
      if (!list.length) {
        empty.textContent = 'TC 생성 이력이 없습니다.';
        return;
      }
      empty.style.display = 'none';
      var html = '';
      list.forEach(function(h) {
        var fileNm   = h.specFileNm || '';
        var prefix   = (h.histId || '').split('_')[0].toLowerCase() || 'pur';
        var typeLbl  = h.specType === 'both' ? '통합+단위' : (h.specType === 'integration' ? '통합' : (h.specType || '-'));
        var srcList  = Array.isArray(h.srcList) ? h.srcList : [];
        var srcJson  = JSON.stringify(srcList).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
        html +=
          '<tr style="border-bottom:1px solid #f1f5f9" onmouseover="this.style.background=\'#f8fafc\'" onmouseout="this.style.background=\'\'">' +
            '<td style="color:#555;font-size:12px;white-space:nowrap;padding:7px 12px">' + esc(h.genDt || '') + '</td>' +
            '<td style="font-family:monospace;font-size:12px;color:#1a3a5c;padding:7px 12px">' + esc(fileNm) + '</td>' +
            '<td style="text-align:center;padding:7px 12px">' +
              '<span style="background:#e0f2fe;color:#0369a1;padding:1px 7px;border-radius:4px;font-size:11px">' + esc(typeLbl) + '</span>' +
            '</td>' +
            '<td style="text-align:center;padding:7px 12px">' +
              (srcList.length ?
                '<button style="background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;padding:2px 9px;border-radius:4px;font-size:11px;cursor:pointer"' +
                ' onclick="showSrcListModal(\'' + srcJson + '\',\'' + fileNm.replace(/'/g,"\\'") + '\')">' +
                srcList.length + '개 소스 보기</button>'
              : '<span style="color:#aaa;font-size:11px">-</span>') +
            '</td>' +
            '<td style="text-align:center;padding:7px 12px">' +
              (fileNm ?
                '<button class="btn btn-sm" style="background:#1a3a5c;color:#fff;padding:3px 10px;font-size:12px"' +
                ' onclick="loadSpecFromHist(\'' + fileNm.replace(/'/g,"\\'") + '\',\'' + prefix + '\')">' +
                '불러오기</button>'
              : '<span style="color:#aaa;font-size:11px">없음</span>') +
            '</td>' +
          '</tr>';
      });
      body.innerHTML = html;
      wrap.style.display = '';
    })
    .catch(function(e) {
      empty.textContent = '오류: ' + e.message;
    });
}

/* ── 최근 시나리오 불러오기 그리드 (sec-load 인라인) ─────────── */
function loadScenHistGrid() {
  var wrap  = document.getElementById('scenHistGridWrap');
  var empty = document.getElementById('scenHistEmpty');
  var body  = document.getElementById('scenHistGridBody');
  if (!wrap || !empty || !body) return;

  empty.textContent    = '로딩 중...';
  empty.style.display  = '';
  wrap.style.display   = 'none';

  fetch('<c:url value="/ai/getScenarioGroups.do"/>')
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (!data.success) {
        empty.textContent = '오류: ' + esc(data.message || '알 수 없는 오류');
        return;
      }
      var list = data.list || [];
      if (!list.length) {
        empty.textContent = '저장된 시나리오 이력이 없습니다.';
        return;
      }
      empty.style.display = 'none';
      var html = '';
      list.forEach(function(g) {
        var grpId = g.grpId || '';
        html +=
          '<tr style="border-bottom:1px solid #f1f5f9" ' +
              'onmouseover="this.style.background=\'#f8fafc\'" onmouseout="this.style.background=\'\'">' +
            '<td style="color:#555;font-size:12px;white-space:nowrap;padding:7px 12px">' + esc(g.cratDt || '') + '</td>' +
            '<td style="font-family:monospace;font-size:12px;color:#1a3a5c;padding:7px 12px">' + esc(grpId) + '</td>' +
            '<td style="text-align:center;padding:7px 12px">' +
              '<span style="background:#e0e7ff;color:#3730a3;padding:1px 7px;border-radius:4px;font-size:11px;font-weight:600">' +
                (g.scenCnt || 0) + '건' +
              '</span>' +
            '</td>' +
            '<td style="text-align:center;padding:7px 12px">' +
              '<button class="btn btn-sm" style="background:#0891b2;color:#fff;padding:3px 10px;font-size:12px;border:none;border-radius:4px;cursor:pointer"' +
              ' onclick="doRestoreFromGroup(\'' + grpId.replace(/'/g,"\\'") + '\')">' +
              '불러오기</button>' +
            '</td>' +
          '</tr>';
      });
      body.innerHTML   = html;
      wrap.style.display = '';
    })
    .catch(function(e){
      empty.textContent = '오류: ' + e.message;
    });
}

/**
 * 소스목록 모달 — 해당 spec.ts에 포함된 소스 파일 목록 표시
 * @param {string} srcJsonStr - JSON.stringify(srcList) 문자열
 * @param {string} fileNm     - spec 파일명
 */
function showSrcListModal(srcJsonStr, fileNm) {
  var srcList;
  try { srcList = JSON.parse(srcJsonStr); } catch(e) { srcList = []; }

  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.45);z-index:9000;display:flex;align-items:center;justify-content:center';

  var box = document.createElement('div');
  box.style.cssText = 'background:#fff;border-radius:10px;padding:24px 28px;min-width:320px;max-width:480px;max-height:80vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,.25)';

  var title = '<div style="font-weight:700;font-size:14px;color:#1a3a5c;margin-bottom:4px">소스 목록</div>';
  var sub   = '<div style="font-family:monospace;font-size:11px;color:#64748b;margin-bottom:16px">' + esc(fileNm) + '</div>';
  var items = srcList.length
    ? srcList.map(function(s) {
        return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f1f5f9">' +
               '<span style="background:#dbeafe;color:#1d4ed8;padding:1px 7px;border-radius:4px;font-family:monospace;font-size:12px">' + esc(s) + '</span>' +
               '</div>';
      }).join('')
    : '<div style="color:#888;font-size:12px">소스 정보 없음</div>';

  var closeBtn = '<div style="text-align:right;margin-top:18px">' +
    '<button onclick="this.closest(\'div[style*=fixed]\').remove()" ' +
    'style="background:#1a3a5c;color:#fff;border:none;border-radius:6px;padding:6px 20px;font-size:13px;cursor:pointer">닫기</button></div>';

  box.innerHTML = title + sub + items + closeBtn;
  overlay.appendChild(box);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/**
 * 이력에서 spec.ts 파일을 선택하여 테스트 실행 대상으로 설정
 * @param {string} specFileNm  - AI_TC_GEN_HIST.SPEC_FILE_NM
 * @param {string} prefix      - pur / pms 등
 */
function loadSpecFromHist(specFileNm, prefix) {
  if (!specFileNm) { showAlert('warning', 'spec 파일명이 없습니다.'); return; }

  currentSpecFileName = specFileNm;
  if (prefix) currentPrefix = prefix;

  // spec 파일 정보 표시 업데이트
  var specInfo = document.getElementById('specFileInfo');
  if (specInfo) specInfo.textContent = specFileNm;

  // 재생성 버튼 표시
  var btnRegen = document.getElementById('btnRegenSpec');
  if (btnRegen) btnRegen.style.display = 'inline-flex';

  // 가져오기 상태 표시
  var specImportStatus = document.getElementById('specImportStatus');
  if (specImportStatus) {
    specImportStatus.textContent = '✅ ' + specFileNm + ' 불러오기 완료 (이력에서 로드)';
    specImportStatus.style.color = '#15803d';
  }

  // 2단계 완료 → 3단계(테스트 실행) 진행 가능
  markStepComplete(2);
  loadSpecPreview(specFileNm);

  showAlert('success', specFileNm + ' 불러오기 완료. [다음 단계 → 테스트 실행] 버튼으로 진행하세요.');
}

/* ═══════════════════════════════════════════════════════════
   spec.ts 미리보기
   ═══════════════════════════════════════════════════════════ */

/** 서버에서 spec.ts 내용을 읽어 미리보기 카드에 표시 */
function loadSpecPreview(fileName) {
  if (!fileName) return;
  var code = document.getElementById('specPreviewCode');
  var section = document.getElementById('specPreviewSection');
  if (!section || !code) return;

  section.style.display = '';
  code.textContent = '불러오는 중...';

  fetch('<c:url value="/ai/getSpecContent.do"/>?specFile=' + encodeURIComponent(fileName))
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data.success) {
        code.textContent = '⚠ ' + (data.message || '내용을 불러올 수 없습니다.');
        return;
      }
      showSpecPreview(data.content || '', fileName);
    })
    .catch(function(e) { code.textContent = '오류: ' + e.message; });
}

/** 이미 확보된 content 문자열을 미리보기 카드에 직접 표시 */
function showSpecPreview(content, fileName) {
  var section   = document.getElementById('specPreviewSection');
  var code      = document.getElementById('specPreviewCode');
  var nameEl    = document.getElementById('specPreviewFileName');
  var countEl   = document.getElementById('specPreviewLineCount');
  var body      = document.getElementById('specPreviewBody');
  var toggleBtn = document.getElementById('btnTogglePreview');
  if (!section || !code) return;

  section.style.display = '';
  if (body)      { body.style.display = ''; }
  if (toggleBtn) { toggleBtn.textContent = '▲ 접기'; }

  code.textContent = content || '';
  if (nameEl)  nameEl.textContent  = fileName || '';
  if (countEl) countEl.textContent = (content ? content.split('\n').length : 0) + '줄';

  setTimeout(function() {
    section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

/** 미리보기 내용 클립보드 복사 */
function copySpecPreview() {
  var code = document.getElementById('specPreviewCode');
  if (!code || !code.textContent.trim()) { showAlert('warning', '복사할 내용이 없습니다.'); return; }
  var text = code.textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(function() { showAlert('success', '클립보드에 복사되었습니다.'); })
      .catch(function() { _specPreviewFallbackCopy(text); });
  } else {
    _specPreviewFallbackCopy(text);
  }
}
function _specPreviewFallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showAlert('success', '클립보드에 복사되었습니다.'); }
  catch(e) { showAlert('error', '복사 실패: ' + e.message); }
  document.body.removeChild(ta);
}

/** 미리보기 카드 펼치기/접기 */
function toggleSpecPreview() {
  var body = document.getElementById('specPreviewBody');
  var btn  = document.getElementById('btnTogglePreview');
  if (!body) return;
  var collapsed = body.style.display === 'none';
  body.style.display = collapsed ? '' : 'none';
  if (btn) btn.textContent = collapsed ? '▲ 접기' : '▼ 펼치기';
}

/* ══════════════════════════════════════════════════════════
   파일명 입력 모달 (makeTestCode.md §6.3)
   ══════════════════════════════════════════════════════════ */
var _fileNameOnConfirm = null;
var _fileNameExt       = '';

function openFileNameModal(defaultName, ext, onConfirm) {
  var modal = document.getElementById('fileNameModal');
  var inp   = document.getElementById('inputFileName');
  var extEl = document.getElementById('inputFileExt');
  if (!modal || !inp) return;
  inp.value              = defaultName || '';
  if (extEl) extEl.textContent = '.' + (ext || '');
  _fileNameOnConfirm     = onConfirm;
  _fileNameExt           = ext || '';
  modal.style.display    = 'flex';
  inp.focus();
  inp.select();
}

function confirmFileNameAndSave() {
  var inp  = document.getElementById('inputFileName');
  var name = inp ? inp.value.trim() : '';
  if (!name) { alert('파일명을 입력하세요.'); return; }
  closeFileNameModal();
  if (typeof _fileNameOnConfirm === 'function') {
    _fileNameOnConfirm(name, _fileNameExt);
  }
}

function closeFileNameModal() {
  var modal = document.getElementById('fileNameModal');
  if (modal) modal.style.display = 'none';
}

/** 오늘 날짜 + 현재 prefix 조합 기본 파일명 생성 */
function getTodayPrefix() {
  var today = new Date().toISOString().slice(0,10).replace(/-/g,'');
  return today + '_' + (currentPrefix || 'scenario');
}

/** 시나리오 존재 가드 — _purEditorAllRows 또는 scenarios 중 하나라도 있으면 통과 */
function guardScenarioExport() {
  var hasRows = (_purEditorAllRows && _purEditorAllRows.length > 0);
  var hasScen = (scenarios && scenarios.length > 0);
  if (!hasRows && !hasScen) {
    alert('시나리오가 없습니다. 먼저 시나리오를 추출하거나 이력에서 불러오세요.');
    return false;
  }
  return true;
}

/** 내보낼 시나리오 목록 반환 — _purEditorAllRows 우선, 없으면 scenarios 사용 */
function getExportScenarios() {
  if (_purEditorAllRows && _purEditorAllRows.length > 0) {
    return _purEditorAllRows.map(function(r) {
      var c = Object.assign({}, r);
      delete c.__idx; delete c.__sel;
      return c;
    });
  }
  return scenarios.slice();
}

/** spec.ts 존재 가드 */
function guardSpecExport(testType) {
  var key = (currentPrefix || '') + '_' + (testType || 'unit');
  if (!window.specTsGenerated || !window.specTsGenerated[key]) {
    alert('생성된 spec.ts가 없습니다. 먼저 테스트 코드를 생성하세요.');
    return false;
  }
  return true;
}

/** Blob → 브라우저 다운로드 트리거 */
function triggerDownload(blob, fileName) {
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

/** 사용자 정의 파일명으로 시나리오 xlsx 다운로드
 *  — SCENARIO_STORE 의존 없이 현재 JS 시나리오 배열을 POST body로 전송 */
function exportScenarioDirectNamed(fileName) {
  if (!guardScenarioExport()) return;
  var prefix = currentPrefix || 'pur';
  var list   = getExportScenarios();
  var btn    = event && event.target;   // 클릭 버튼 (있으면 비활성 처리)
  var origText = btn && btn.textContent;
  if (btn && btn.tagName === 'BUTTON') { btn.disabled = true; btn.textContent = '⏳ 생성 중...'; }

  fetch('<c:url value="/ai/exportScenarioList.do"/>', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prefix:   prefix,
      scenarios: list,
      userFileName: fileName.replace(/\.xlsx$/i, '')
    })
  })
  .then(function(r) {
    if (!r.ok) return r.text().then(function(t) { throw new Error('서버 오류(' + r.status + '): ' + t.substring(0, 200)); });
    var cd = r.headers.get('Content-Disposition') || '';
    var fn = fileName || (prefix + '_scenario.xlsx');
    var m = cd.match(/filename\*=UTF-8''([^\s;]+)/i);
    if (!m) m = cd.match(/filename="?([^";\r\n]+)"?/i);
    if (m && m[1]) fn = decodeURIComponent(m[1].trim());
    return r.blob().then(function(blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a'); a.href = url; a.download = fn;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function() { URL.revokeObjectURL(url); }, 10000);
      showAlert('info', '📥 ' + fn + ' 다운로드 완료');
    });
  })
  .catch(function(e) { showAlert('error', '엑셀 다운로드 오류: ' + e.message); })
  .finally(function() {
    if (btn && btn.tagName === 'BUTTON') { btn.disabled = false; btn.textContent = origText; }
  });
}

/** spec.ts 저장 (파일명 모달 경유) */
function saveSpecTs(prefix, testType) {
  if (!guardSpecExport(testType)) return;
  var today = new Date().toISOString().slice(0,10).replace(/-/g,'');
  var defaultName = today + '_' + (prefix||'scenario') + '_' + (testType||'unit');
  openFileNameModal(defaultName, 'spec.ts', function(name, ext) {
    var fileName = name + '.' + ext;
    fetch('<c:url value="/ai/generateSpecStream.do"/>?prefix=' + encodeURIComponent(prefix||'')
        + '&testType=' + encodeURIComponent(testType||'')
        + '&userFileName=' + encodeURIComponent(name))
      .then(function(res) { return res.blob(); })
      .then(function(blob) { triggerDownload(blob, fileName); });
  });
}

/* 통합 시나리오 추출 */
function runExtractIntegScenarios() {
  if (!uploadedSources || uploadedSources.length === 0) {
    alert('소스 목록이 없습니다. 먼저 소스 파일을 업로드하세요.');
    return;
  }
  if (!confirm('통합 시나리오를 추출하시겠습니까?')) return;
  var prefix = currentPrefix || 'pur';
  var spinner  = document.getElementById('extractIntegSpinner');
  var progress = document.getElementById('extractIntegProgress');
  var status   = document.getElementById('extractIntegStatus');
  var bar      = document.getElementById('extractIntegBar');
  var btn      = document.getElementById('btnExtractInteg');
  if (spinner)  spinner.style.display  = '';
  if (progress) progress.style.display = '';
  if (status)   status.textContent     = '분석 중...';
  if (btn)      btn.disabled           = true;

  var integCheckedNames = uploadedSources.filter(function(s){ return s._checked; }).map(function(s){ return s.rawName || s.displayName || ''; }).filter(Boolean);
  var integEsUrl = '<c:url value="/ai/extractIntegScenarios.do"/>?prefix=' + encodeURIComponent(prefix)
                 + '&sources=' + encodeURIComponent(integCheckedNames.join(','));
  var es = new EventSource(integEsUrl);
  es.onmessage = function(e) {
    try {
      var data = JSON.parse(e.data);
      if (data.fileError) {
        if (status) status.textContent = '⚠ ' + data.fileError;
        return;
      }
      if (data.error) {
        es.close();
        if (status)   status.textContent     = '❌ 오류: ' + data.error;
        if (spinner)  spinner.style.display  = 'none';
        if (progress) progress.style.display = 'none';
        if (btn)      btn.disabled           = false;
        return;
      }
      if (data.done) {
        es.close();
        if (status)   status.textContent     = '✅ ' + data.count + '개 시나리오 추출 완료';
        if (spinner)  spinner.style.display  = 'none';
        if (progress) progress.style.display = 'none';
        if (btn)      btn.disabled           = false;
        // 추출 완료 → DB 자동 저장(무음) — 서버 SCENARIO_STORE[prefix+"_integ"] fallback 사용
        autoSaveScenariosToDBSilent(prefix, true);
      } else if (data.total) {
        var pct = Math.round((data.cur / data.total) * 100);
        if (bar)    bar.value           = pct;
        if (status) status.textContent  = '분석 중... ' + data.cur + ' / ' + data.total;
      }
    } catch(ex) {}
  };
  es.onerror = function() {
    es.close();
    if (status)   status.textContent     = '❌ 추출 오류';
    if (spinner)  spinner.style.display  = 'none';
    if (progress) progress.style.display = 'none';
    if (btn)      btn.disabled           = false;
  };
}
</script>
