<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../include/tagHeader.jsp" %>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>통합 테스트 자동화</title>
<%@ include file="doTest_style.jsp" %>
<link href="<c:url value='/css/eip.css?ver=1'/>" rel="stylesheet" type="text/css">
<style>
/* ── eGovFrame 그리드 스타일 추가 정의 ── */
#wrap      { min-height:100vh; background:#f4f4f4; }
#container { display:flex; }
.contents  { flex:1; min-width:0; padding:20px 24px 40px; }

.conts_head { padding:10px 0 12px; border-bottom:2px solid #2059a3; margin-bottom:14px; }
.conts_head h2 { font-size:18px; font-weight:700; color:#1a3c72; margin:0; display:inline; }
.badge-ai {
  display:inline-block; margin-left:10px; padding:2px 8px; font-size:11px;
  background:#2059a3; color:#fff; border-radius:3px; vertical-align:middle; }
.location { font-size:11px; color:#888; margin-top:4px; display:block; }
.location .now { color:#2059a3; font-weight:600; }

/* 패널 내 카드 여백 */
.step-panel .stitle-egov:first-child { margin-top:4px; }

/* 서브탭 (패널 1 = A. 시나리오 생성 내부 하위 3섹션 전환) */
.subtab-bar { display:flex; gap:0; margin-bottom:10px; border-bottom:2px solid #2059a3; }
.subtab-btn {
  display:inline-flex; align-items:center; gap:6px;
  height:var(--btn-h); padding:var(--btn-pad); margin-right:2px;
  font-size:var(--btn-fsize); font-weight:var(--btn-fweight); color:#666;
  background:#e8ecf4; border:1px solid #ccc; border-bottom:none; border-radius:var(--btn-radius) var(--btn-radius) 0 0;
  cursor:pointer; font-family:inherit; }
.subtab-btn.on { background:#fff; color:#2059a3; border-color:#2059a3; }
.subtab-btn:hover:not(.on) { background:#d6e0f0; }
.subtab-num {
  display:inline-flex; align-items:center; justify-content:center;
  width:16px; height:16px; border-radius:50%; background:#2059a3; color:#fff;
  font-size:10px; font-weight:700; flex-shrink:0; }
.subtab-btn:not(.on) .subtab-num { background:#9aa8bb; }
.subtab-panel { display:none; }
.subtab-panel.on { display:block; }

/* stitle */
.stitle-egov {
  font-size:13px; color:#3f4459; font-weight:700;
  border-left:3px solid #2059a3; padding:4px 0 4px 10px; margin:14px 0 6px; }

/* 검색 조건 테이블 */
.TBL_srh { width:100%; border-collapse:collapse; border:1px solid #c8c8c8;
           background:#fff; margin-bottom:8px; }
.TBL_srh th { background:#eef2f8; font-size:12px; font-weight:700; color:#333;
              padding:7px 10px; text-align:left; border:1px solid #c8c8c8;
              white-space:nowrap; width:13%; }
.TBL_srh td { font-size:12px; color:#222; padding:5px 10px; border:1px solid #c8c8c8; }
.TBL_srh input[type=text], .TBL_srh select {
  height:24px; padding:0 6px; border:1px solid #bbb; font-size:12px;
  font-family:inherit; box-sizing:border-box; }

/* 그리드 테이블 */
.TBL_default { width:100%; border-collapse:collapse; border:1px solid #c8c8c8;
               background:#fff; font-size:12px; }
.TBL_default thead th { background:#d6e0f0; font-weight:700; color:#1a3c72;
                         padding:7px 8px; text-align:center; border:1px solid #c8c8c8; }
.TBL_default tbody td { padding:6px 8px; border:1px solid #ddd; color:#333; }
.TBL_default tbody tr:nth-child(even) { background:#f7f9fc; }
.TBL_default tbody tr:hover { background:#eef2f8; }
.TBL_default .al_c { text-align:center; }

/* 버튼 영역 — css/ai/doTest.css의 --btn-* 통일 규격(.btn/.top_btn_item과 동일 크기·모양)을 그대로 사용 */
.top_btn { text-align:right; margin:6px 0; overflow:hidden; }
.top_btn button, .top_btn a {
  display:inline-flex; align-items:center; justify-content:center; gap:5px;
  height:var(--btn-h); padding:var(--btn-pad); border-radius:var(--btn-radius);
  font-size:var(--btn-fsize); font-weight:var(--btn-fweight); color:#fff;
  background:#2059a3; border:none; cursor:pointer;
  margin-left:3px; text-decoration:none; font-family:inherit;
  transition:filter .12s; vertical-align:middle; }
.top_btn .btn_blue   { background:#2059a3; }
.top_btn .btn_green  { background:#2a8a52; }
.top_btn .btn_orange { background:#d26c00; }
.top_btn .btn_gray   { background:#6c7a8a; }
.top_btn button:hover, .top_btn a:hover { filter:brightness(1.12); }

/* 인라인 소버튼 — 동일 통일 규격 (색상만 다름) */
.btn-sm-blue, .btn-sm-gray, .btn-sm-green {
  display:inline-flex; align-items:center; justify-content:center; gap:5px;
  height:var(--btn-h); padding:var(--btn-pad); border-radius:var(--btn-radius);
  font-size:var(--btn-fsize); font-weight:var(--btn-fweight); color:#fff;
  border:none; cursor:pointer; font-family:inherit;
  transition:filter .12s; vertical-align:middle; }
.btn-sm-blue:hover, .btn-sm-gray:hover, .btn-sm-green:hover { filter:brightness(1.12); }
.btn-sm-blue  { background:#2059a3; }
.btn-sm-gray  { background:#6c7a8a; }
.btn-sm-green { background:#2a8a52; }


/* PUR 에디터 테이블 */
#purEditorTable th {
  background:var(--nxa-th-bg,#EEF0F5); color:var(--nxa-btn-text,#374b72);
  padding:5px 8px; white-space:nowrap; font-size:11px; font-weight:700;
  text-align:center; border:1px solid var(--nxa-th-border,#CDD0D8); }
#purEditorTable th.editable { background:#dce8f7; color:var(--ai-nav,#1a3a5c); }
#purEditorTable td {
  padding:8px 6px; border:1px solid var(--nxa-td-border,#E2E4EB);
  vertical-align:top; min-width:60px; max-width:300px; min-height:38px;
  background:#fff; color:#222; font-size:12px; }
#purEditorTable tbody tr:nth-child(even) td { background:var(--nxa-row-even,#F8F9FC); }
#purEditorTable td.editable-cell { background:#fafeff; cursor:text; }
#purEditorTable td.editable-cell:focus { outline:2px solid var(--nxa-accent,#5372ad); background:#eff6ff; }
#purEditorTable td.editable-cell:hover { background:var(--nxa-row-hover,#EDF3FF); }
#purEditorTable tr:hover td { background:var(--nxa-row-hover,#EDF3FF) !important; }
#purEditorTable tr.row-sel td { background:var(--nxa-row-sel,#D6E4FF) !important; }
.pur-badge { display:inline-block;padding:1px 6px;border-radius:3px;font-size:9px;font-weight:700; }
.pur-badge-단위   { background:#dbeafe;color:#1d4ed8; }
.pur-badge-통합   { background:#dcfce7;color:#15803d; }
.pur-badge-비정상 { background:#fee2e2;color:#b91c1c; }
.pur-badge-E2E    { background:#fef9c3;color:#92400e; }

/* 알림 */
.msg_ok  { background:#e6f4ea;border:1px solid #66bb6a;color:#2e7d32;padding:7px 12px;font-size:12px;font-weight:700;margin:6px 0; }
.msg_err { background:#fdecea;border:1px solid #ef9a9a;color:#b71c1c;padding:7px 12px;font-size:12px;font-weight:700;margin:6px 0; }
.msg_ing { background:#e3f2fd;border:1px solid #90caf9;color:#1565c0;padding:7px 12px;font-size:12px;margin:6px 0; }
</style>
</head>
<body>
<div id="wrap">
  <div id="container">
    <div class="contents">

      <!-- ── 페이지 헤더 ── -->
      <div class="conts_head">
        <h2>통합 테스트 자동화</h2>
        <span class="badge-ai">AI + Playwright</span>
        <span class="location">시스템관리 &gt; <span class="now">통합 테스트 자동화</span></span>
      </div>

      <!-- ── 패널 탭 바 — 사이드바와 별도로 A~D 어느 단계로든 자유롭게 이동 ── -->
      <div class="subtab-bar" id="panelTabBar" style="margin-bottom:12px">
        <button type="button" class="subtab-btn on" id="panel-tab-1" onclick="switchPanel(1)">
          <span class="subtab-num">A</span> 시나리오 생성
        </button>
        <button type="button" class="subtab-btn" id="panel-tab-2" onclick="switchPanel(2)">
          <span class="subtab-num">B</span> 테스트 코드 생성
        </button>
        <button type="button" class="subtab-btn" id="panel-tab-3" onclick="switchPanel(3)">
          <span class="subtab-num">C</span> 테스트 실행
        </button>
        <button type="button" class="subtab-btn" id="panel-tab-4" onclick="switchPanel(4)">
          <span class="subtab-num">D</span> 테스트 결과
        </button>
      </div>

      <!-- ── 전역 프로그레스 바 ── -->
      <div id="globalProgressWrap" style="display:none;background:#fff;border:1px solid #c8c8c8;
           padding:8px 14px;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:12px">
          <span id="globalProgressLabel"
                style="font-size:12px;font-weight:700;color:#2059a3;white-space:nowrap;min-width:130px"></span>
          <div style="flex:1;background:#e5e7eb;border-radius:999px;height:8px;overflow:hidden">
            <div id="globalProgressBar"
                 style="height:100%;width:0%;border-radius:999px;background:#2059a3;transition:width .35s ease"></div>
          </div>
          <span id="globalProgressPct"
                style="font-size:11px;color:#666;min-width:36px;text-align:right">0%</span>
        </div>
      </div>

      <div id="alertArea"></div>

      <!-- ── 실행중 플로팅 배지 — 패널 이동 없이 백그라운드 실행 상태를 알림 (클릭 시 Panel 3 이동) ── -->
      <div id="runningBadge" onclick="switchPanel(3)" style="display:none;position:fixed;right:24px;bottom:24px;
           z-index:999;background:#1a3a5c;color:#fff;padding:10px 16px;border-radius:24px;
           box-shadow:0 4px 14px rgba(0,0,0,.28);cursor:pointer;font-size:12px;font-weight:700;
           align-items:center;gap:8px;animation:runningBadgePulse 1.6s ease-in-out infinite">
        <span style="width:9px;height:9px;border-radius:50%;background:#4ade80;flex-shrink:0"></span>
        <span id="runningBadgeText">테스트 실행중</span>
        <span style="font-size:10px;color:#9fc6ff;font-weight:400">▸ 실행 화면 보기</span>
        <span onclick="event.stopPropagation();confirmStopFromBadge()"
              title="테스트 중지" style="margin-left:4px;width:18px;height:18px;border-radius:50%;
              background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;
              font-size:11px;font-weight:700;flex-shrink:0">✕</span>
      </div>
      <style>
        @keyframes runningBadgePulse {
          0%, 100% { box-shadow: 0 4px 14px rgba(0,0,0,.28); }
          50%      { box-shadow: 0 4px 20px rgba(37,99,235,.55); }
        }
      </style>

      <!-- ── PANEL 1(A): 시나리오 생성 — 소스 업로드 · 목록/추출 · 시나리오 목록을 서브탭 3개로 묶음 ── -->
      <div class="step-panel active" id="panel-1">

      <div class="subtab-bar">
        <button type="button" class="subtab-btn" id="subtab-btn-1" onclick="switchSubTab(1)">
          <span class="subtab-num">1</span> 소스 업로드 · 목록
        </button>
        <button type="button" class="subtab-btn" id="subtab-btn-2" onclick="switchSubTab(2)">
          <span class="subtab-num">2</span> 시나리오 목록 · 편집
        </button>
      </div>

      <!-- ══ 서브탭 1) 소스 업로드 · 목록 + 시나리오 생성 (기본 활성) ══ -->
      <div class="subtab-panel" id="subtab-panel-1">
      <table class="TBL_srh">
        <colgroup><col style="width:13%"><col></colgroup>
        <tbody>
          <tr>
            <th>파일 선택</th>
            <td>
              <input type="file" id="excelFileInput" accept=".xlsx,.xls"
                     style="display:none" onchange="onExcelFileSelected(this)">
              <label for="excelFileInput" class="btn-sm-blue" style="cursor:pointer">+ 파일 선택</label>
              &nbsp;
              <a href="<c:url value='/ai/downloadSourceTemplate.do'/>"
                 class="btn-sm-gray" style="text-decoration:none;display:inline-block">⬇ 양식 다운로드</a>
              &nbsp;&nbsp;
              <span id="excelFileName" style="font-size:12px;color:#333;font-weight:600">선택된 파일 없음</span>
              <span id="excelUploadStatus" style="font-size:12px;margin-left:8px;display:none"></span>
            </td>
          </tr>
          <tr style="display:none">
            <td><input type="hidden" id="selectedGnbName"  value=""></td>
            <td><input type="hidden" id="selectedMenuName" value=""></td>
          </tr>
        </tbody>
      </table>

      <!-- 소스 목록 그리드 — 항상 표기, 트리(그룹 접기)가 아닌 평면 목록 + 구분(prefix) 컬럼 -->
      <div id="sourcePanel" style="margin-top:12px">
        <div style="border:1px solid #c8c8c8;max-height:400px;overflow-y:auto">
          <table class="TBL_default" style="margin-bottom:0">
            <thead>
              <tr>
                <th style="width:34px">
                  <input type="checkbox" id="chkAllSources"
                         onclick="toggleAllSources(this.checked)"
                         style="width:14px;height:14px;cursor:pointer">
                </th>
                <th style="width:90px">구분</th>
                <th>소스명</th>
              </tr>
            </thead>
            <tbody id="sourceList">
              <tr><td colspan="3" class="empty-msg">소스가 없습니다. Excel 파일을 업로드하세요.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 시나리오 생성 (구 "시나리오 추출" 탭 — 소스 업로드 탭으로 통합) -->
      <div class="top_btn" style="margin-top:12px">
        <span id="sourceCountBadge" style="float:left;line-height:26px;font-size:12px;
              color:#333;font-weight:700"></span>
        <button type="button" id="btnLoadScenarioTop" class="btn_gray"
                onclick="openLoadScenarioModal()"
                title="DB에 저장된 시나리오 이력을 일시별로 불러옵니다 (소스 업로드 전에도 사용 가능)"
                style="background:#0891b2">
          📂 시나리오 불러오기
        </button>
        <button type="button" id="btnExtractUnit" class="btn_blue" onclick="runExtractUnitScenarios()">
          <span class="spinner" id="extractUnitSpinner" style="display:none"></span>
          시나리오 생성
        </button>
        <button type="button" class="btn_gray"
                onclick="openFileNameModal(getTodayPrefix()+'_scenario','xlsx',function(n,e){exportScenarioDirectNamed(n+'.'+e);})">
          📥 시나리오 다운로드
        </button>
        <button type="button" class="btn_orange" onclick="toggleExportForm()">📄 양식 내보내기</button>
      </div>

      <!-- 양식 기반 내보내기 (hidden) -->
      <div id="exportFormPanel" style="display:none;padding:8px 12px;background:#fffbeb;
           border:1px solid #fcd34d;border-radius:5px;margin-bottom:8px;
           display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <span style="font-size:11px;font-weight:700;color:#92400e">양식 기반 내보내기</span>
        <input id="exportProjectName" type="text" placeholder="프로젝트명"
               style="border:1px solid #d1d5db;border-radius:3px;padding:3px 7px;font-size:11px;width:120px">
        <input id="exportAuthor" type="text" placeholder="작성자"
               style="border:1px solid #d1d5db;border-radius:3px;padding:3px 7px;font-size:11px;width:80px">
        <input id="exportDate" type="date"
               style="border:1px solid #d1d5db;border-radius:3px;padding:3px 7px;font-size:11px;width:130px">
        <select id="exportFormat"
                style="border:1px solid #d1d5db;border-radius:3px;padding:3px 6px;font-size:11px;background:#fff">
          <option value="xlsx">Excel (.xlsx)</option>
          <option value="hwp">HWP (.hwpx)</option>
          <option value="pdf">PDF (.pdf)</option>
        </select>
        <button class="btn-sm-blue" onclick="runExportWithTemplate()">내보내기</button>
        <button class="btn-sm-gray" onclick="toggleExportForm()">취소</button>
      </div>

      <!-- 추출 상태 표시 -->
      <div id="extractStatusRow" style="display:none;font-size:12px;color:#666;margin:4px 0">
        <span id="extractUnitStatus"></span>
        <span id="extractIntegStatus" style="margin-left:16px"></span>
        <div id="extractUnitProgress"  style="display:none;width:180px;display:inline-block;vertical-align:middle;margin-left:8px">
          <progress id="extractUnitBar"  value="0" max="100" style="width:100%;height:10px"></progress>
        </div>
        <div id="extractIntegProgress" style="display:none;width:180px;display:inline-block;vertical-align:middle;margin-left:8px">
          <progress id="extractIntegBar" value="0" max="100" style="width:100%;height:10px"></progress>
        </div>
      </div>

      <!-- 시나리오 생성 진행 -->
      <div class="card" id="scenarioLogSection"
           style="display:none;margin:10px 0;border-left:3px solid #2059a3">
        <div class="card-head">
          <h2>시나리오 생성 중</h2>
          <span id="scenarioLogStatus" style="font-size:12px;color:#888;margin-left:8px"></span>
        </div>
        <div class="card-body" style="padding:12px 16px">
          <div style="background:#e5e7eb;border-radius:4px;height:14px;overflow:hidden;margin-bottom:6px">
            <div id="scenarioProgressBar"
                 style="height:100%;width:0%;background:#2059a3;transition:width .4s ease"></div>
          </div>
          <div id="scenarioProgressText" style="font-size:12px;color:#666;text-align:center">0%</div>
        </div>
      </div>
      </div><!-- /subtab-panel-1 -->

      <!-- ══ 서브탭 2) 시나리오 목록 · 편집 ══ -->
      <div class="subtab-panel" id="subtab-panel-2">
        <%@ include file="doTest_sec_scenario.jsp" %>
      </div><!-- /subtab-panel-2 -->

      </div><!-- /panel-1 시나리오 생성 끝 -->

      <!-- ── PANEL 2(B): 테스트 코드 생성 ── -->
      <div class="step-panel" id="panel-2">
        <%@ include file="doTest_sec_code.jsp" %>
      </div>

      <!-- ── PANEL 3(C): 테스트 실행 ── -->
      <div class="step-panel" id="panel-3">
        <%@ include file="doTest_sec_run.jsp" %>
      </div>

      <!-- ── PANEL 4(D): 테스트 결과 ── -->
      <div class="step-panel" id="panel-4">
        <%@ include file="doTest_sec_result.jsp" %>
      </div>

    </div><!-- /contents -->
  </div><!-- /container -->
</div><!-- /wrap -->

<%@ include file="doTest_sec_history.jsp" %>


<!-- ══ 시나리오 불러오기 (저장 일시 선택) 모달 — 최상위 배치 (subtab-panel display:none 회피) ══ -->
<div id="loadScenarioModal"
     style="display:none;position:fixed;inset:0;z-index:9200;background:rgba(0,0,0,.45);
            align-items:center;justify-content:center"
     onclick="if(event.target===this)closeLoadScenarioModal()">
  <div style="background:#fff;border-radius:6px;width:640px;max-height:80vh;
              display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,.28);
              overflow:hidden">
    <div style="background:#0891b2;color:#fff;padding:10px 16px;
                display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
      <span style="font-size:13px;font-weight:700">📂 저장된 시나리오 불러오기</span>
      <button onclick="closeLoadScenarioModal()"
              style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;line-height:1">✕</button>
    </div>
    <div style="padding:8px 16px;background:#f0f9ff;border-bottom:1px solid #bae6fd;
                font-size:11px;color:#0c4a6e;display:flex;justify-content:space-between;align-items:center">
      <span>불러올 <b>저장 일시</b>를 선택하세요. 선택 시 시나리오 목록/편집 탭이 열리고 현재 편집 내용은 대체됩니다.</span>
      <button onclick="refreshLoadScenarioModal()"
              style="background:#0891b2;color:#fff;border:none;border-radius:3px;
                     padding:2px 10px;font-size:11px;cursor:pointer">🔄 새로고침</button>
    </div>
    <div style="overflow-y:auto;flex:1;padding:0">
      <div id="loadScenarioModalEmpty"
           style="padding:24px 16px;text-align:center;font-size:12px;color:#888">
        로딩 중...
      </div>
      <table id="loadScenarioModalTable"
             style="display:none;width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:#f1f5f9;border-bottom:1px solid #e2e8f0">
            <th style="padding:8px 12px;text-align:left;font-weight:600;color:#475569;white-space:nowrap">저장 일시</th>
            <th style="padding:8px 12px;text-align:left;font-weight:600;color:#475569">그룹 ID</th>
            <th style="padding:8px 12px;text-align:center;font-weight:600;color:#475569;white-space:nowrap">건수</th>
            <th style="padding:8px 12px;text-align:center;font-weight:600;color:#475569;white-space:nowrap">액션</th>
          </tr>
        </thead>
        <tbody id="loadScenarioModalBody"></tbody>
      </table>
    </div>
    <div style="padding:10px 16px;border-top:1px solid #e0e0e0;background:#f5f7fa;
                display:flex;justify-content:flex-end;flex-shrink:0">
      <button onclick="closeLoadScenarioModal()"
              style="height:26px;padding:0 14px;font-size:12px;
                     background:#6c7a8a;color:#fff;border:none;cursor:pointer;border-radius:2px">
        닫기
      </button>
    </div>
  </div>
</div>

<!-- ── 파일명 입력 모달 ── -->
<div id="fileNameModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);
     z-index:9200;align-items:center;justify-content:center">
  <div style="background:#fff;border:1px solid #c8c8c8;padding:24px 28px;min-width:360px;
              box-shadow:0 8px 32px rgba(0,0,0,.22)">
    <p style="font-size:14px;font-weight:600;margin:0 0 14px">저장 파일명</p>
    <div style="display:flex;align-items:center;gap:6px">
      <input type="text" id="inputFileName"
             style="flex:1;border:1px solid #d1d5db;padding:6px 10px;font-size:13px"
             oninput="this.value=this.value.replace(/[\\\\/:*?\"<>|]/g,'')">
      <span id="inputFileExt" style="font-size:13px;color:#64748b;white-space:nowrap;min-width:50px"></span>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
      <button onclick="closeFileNameModal()"
              style="padding:6px 16px;border:1px solid #d1d5db;background:#f8fafc;font-size:12px;cursor:pointer">취소</button>
      <button onclick="confirmFileNameAndSave()"
              style="padding:6px 16px;border:none;background:#2059a3;color:#fff;font-size:12px;cursor:pointer;font-weight:600">저장</button>
    </div>
  </div>
</div>


<script src="<c:url value='/common/amcharts4/deps/xlsx.js'/>"></script>
<%@ include file="doTest_script.jsp" %>

<script>

/* 시나리오 생성 · 추출 시 선택된 메뉴를 체크 소스에 일괄 적용 */
function applySelectedMenuToSources() {
  var gnb  = document.getElementById('selectedGnbName').value.trim();
  var menu = document.getElementById('selectedMenuName').value.trim();
  if (gnb || menu) {
    (typeof uploadedSources !== 'undefined' ? uploadedSources : []).forEach(function(s){
      if (s._checked) {
        if (gnb)  s.gnbName  = gnb;
        if (menu) s.menuName = menu;
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', function() {
  /* doGenerateScenario 래핑 */
  var origGen = window.doGenerateScenario;
  if (typeof origGen === 'function') {
    window.doGenerateScenario = function() {
      applySelectedMenuToSources();
      origGen.apply(this, arguments);
    };
  }
  /* runExtractUnitScenarios 래핑 */
  var origUnit = window.runExtractUnitScenarios;
  if (typeof origUnit === 'function') {
    window.runExtractUnitScenarios = function() {
      applySelectedMenuToSources();
      origUnit.apply(this, arguments);
    };
  }
  /* runExtractIntegScenarios 래핑 */
  var origInteg = window.runExtractIntegScenarios;
  if (typeof origInteg === 'function') {
    window.runExtractIntegScenarios = function() {
      applySelectedMenuToSources();
      origInteg.apply(this, arguments);
    };
  }

  /* 사이드바 nav-step 초기 상태 — panel-1(A. 시나리오 생성)이 기본 활성 패널 */
  if (typeof updateNavStepState === 'function') updateNavStepState();

  /* 서브탭 초기 상태 — 1) 소스 업로드·목록이 기본 활성 탭(항상 첫 번째 탭으로 시작) */
  switchSubTab(1);
});

/* panel-1(A. 시나리오 생성) 내부 서브탭 전환 — 1)소스 업로드·목록·생성 2)시나리오목록·편집 */
function switchSubTab(num) {
  [1, 2].forEach(function(i) {
    var btn = document.getElementById('subtab-btn-' + i);
    var pnl = document.getElementById('subtab-panel-' + i);
    if (btn) btn.classList.toggle('on', i === num);
    if (pnl) pnl.classList.toggle('on', i === num);
  });
}

/* Excel 드래그드롭 지원 */
function onExcelFileGridDrop(event) {
  event.preventDefault();
  var files = event.dataTransfer && event.dataTransfer.files;
  if (!files || !files[0]) return;
  var file = files[0];
  if (!/\.xlsx?$/i.test(file.name)) { alert('Excel 파일(.xlsx, .xls)만 업로드할 수 있습니다.'); return; }
  var inp = document.getElementById('excelFileInput');
  try { var dt = new DataTransfer(); dt.items.add(file); inp.files = dt.files; } catch(e) {}
  onExcelFileSelected(inp);
}
</script>
</body>
</html>
