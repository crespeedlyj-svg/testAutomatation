<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!-- ══ PANEL 1 프로그램 타이틀 ══ -->
<div class="workflow-step-header">
  <div class="workflow-step-num" id="wf-num-1">1</div>
  <div class="workflow-step-title">테스트 시나리오</div>
</div>

<!-- ══ 시나리오 추출 버튼 바 ══ -->
<div style="display:flex;align-items:center;gap:8px;padding:5px 10px;margin-bottom:10px;
            background:#f0f9ff;border:1px solid #bae6fd;border-radius:5px;flex-wrap:wrap">
  <button class="btn-row-add" id="btnExtractUnit" onclick="runExtractUnitScenarios()"
          style="background:#0369a1;color:#fff;border-color:#0369a1">
    <span class="spinner" id="extractUnitSpinner" style="display:none"></span>
    🔍 시나리오 추출
  </button>
  <button class="btn-row-add" id="btnExtractInteg" onclick="runExtractIntegScenarios()"
          style="background:#0f766e;color:#fff;border-color:#0f766e">
    <span class="spinner" id="extractIntegSpinner" style="display:none"></span>
    🔗 통합 시나리오 추출
  </button>
  <span id="extractUnitStatus" style="font-size:12px;color:#64748b"></span>
  <span id="extractIntegStatus" style="font-size:12px;color:#64748b"></span>
  <div id="extractUnitProgress" style="display:none;width:200px">
    <progress id="extractUnitBar" value="0" max="100" style="width:100%;height:10px"></progress>
  </div>
  <div id="extractIntegProgress" style="display:none;width:200px">
    <progress id="extractIntegBar" value="0" max="100" style="width:100%;height:10px"></progress>
  </div>
  <div style="width:1px;height:16px;background:#bae6fd;margin:0 2px"></div>
  <button class="btn-row-add" onclick="openFileNameModal(getTodayPrefix()+'_scenario','xlsx',function(n,e){exportScenarioDirectNamed(n+'.'+e);})"
          style="background:#334155;color:#fff;border-color:#334155">
    📥 시나리오 다운로드
  </button>
  <button class="btn-row-add" onclick="toggleExportForm()"
          style="background:#b45309;color:#fff;border-color:#b45309">
    📄 양식 내보내기
  </button>
</div>

<!-- ══ 양식 기반 내보내기 폼 ══ -->
<div id="exportFormPanel" style="display:none;padding:8px 12px;background:#fffbeb;
     border:1px solid #fcd34d;border-radius:5px;margin-bottom:8px;
     gap:8px;align-items:center;flex-wrap:wrap">
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
  <button class="btn-row-add" onclick="runExportWithTemplate()"
          style="background:#b45309;color:#fff;border-color:#b45309">내보내기</button>
  <button class="btn-row-add" onclick="toggleExportForm()">취소</button>
</div>

<!-- ══ 탭: 소스 업로드 / 시나리오 불러오기 ══ -->
<div class="card" id="sec-upload-load" style="margin-bottom:16px;scroll-margin-top:10px">

  <!-- 탭 헤더 -->
  <div class="nxa-tab-bar" style="margin-bottom:0">
    <button id="tab-btn-upload" onclick="switchUploadTab('upload')" class="nxa-tab-btn active" style="flex:1;text-align:center">
      소스 업로드
    </button>
    <button id="tab-btn-load" onclick="switchUploadTab('load')" class="nxa-tab-btn" style="flex:1;text-align:center">
      시나리오 불러오기
    </button>
  </div>

  <!-- ── TAB 1: 소스 목록 엑셀 업로드 ── -->
  <div id="tab-pane-upload">
    <div class="card-head" style="border-top:none">
      <span class="est-time">⏱ 약 30~60초</span>
      <div style="margin-left:auto;display:flex;gap:5px;align-items:center">
        <input type="file" id="excelFileInput" accept=".xlsx,.xls"
               style="display:none" onchange="onExcelFileSelected(this)">
        <label class="btn-row-add" for="excelFileInput" style="cursor:pointer">+ 파일추가</label>
        <a href="<c:url value='/ai/downloadSourceTemplate.do'/>"
           class="btn-row-add" style="text-decoration:none">⬇ 양식</a>
        <span id="excelFileName" class="upload-fname">선택된 파일 없음</span>
        <span id="excelUploadStatus" style="font-size:11px;color:rgba(255,255,255,.7)"></span>
      </div>
    </div>
    <div class="card-body">
      <div id="sourcePanel" style="display:none">
        <div class="nxa-number"><span id="sourceCountBadge"></span></div>
      </div>
      <div class="nxa-grid-wrap"
           ondragover="event.preventDefault();this.classList.add('drag-over')"
           ondragleave="this.classList.remove('drag-over')"
           ondrop="this.classList.remove('drag-over');onExcelFileGridDrop(event)">
        <div class="nxa-file-head">
          <span style="width:34px;flex-shrink:0;text-align:center">
            <input type="checkbox" id="chkAllSources" title="전체선택/해제"
                   onclick="toggleAllSources(this.checked)"
                   style="width:14px;height:14px;cursor:pointer;accent-color:#2563eb">
          </span>
          <span style="flex:1">소스명</span>
        </div>
        <div id="sourceList" class="source-list"></div>
        <div id="sourceListEmpty" class="empty-msg">
          파일을 드래그하거나 위 <strong>+ 파일추가</strong> 버튼을 클릭하세요.
        </div>
      </div>
    </div>
  </div><!-- /tab-pane-upload -->

  <!-- ── TAB 2: 최근 시나리오 불러오기 ── -->
  <div id="tab-pane-load" style="display:none">
    <div class="card-head" style="border-top:none">
      <button class="btn btn-sm" onclick="loadScenHistGrid()"
              style="margin-left:auto;padding:4px 14px;font-size:12px;background:#0891b2;color:#fff;border-radius:5px;cursor:pointer;border:none">
        🔄 이력 조회
      </button>
    </div>
    <div class="card-body" style="padding:0">
      <div id="scenHistEmpty"
           style="padding:18px 16px;font-size:12px;color:#888;text-align:center">
        [이력 조회] 버튼을 클릭하면 저장된 시나리오 이력이 표시됩니다.
      </div>
      <div id="scenHistGridWrap" style="display:none;overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead>
            <tr style="background:#f1f5f9;border-bottom:1px solid #e2e8f0">
              <th style="padding:8px 12px;text-align:left;font-weight:600;color:#475569;white-space:nowrap">생성일시</th>
              <th style="padding:8px 12px;text-align:left;font-weight:600;color:#475569">그룹ID</th>
              <th style="padding:8px 12px;text-align:center;font-weight:600;color:#475569;white-space:nowrap">건수</th>
              <th style="padding:8px 12px;text-align:center;font-weight:600;color:#475569;white-space:nowrap">불러오기</th>
            </tr>
          </thead>
          <tbody id="scenHistGridBody" style="border-bottom:1px solid #e2e8f0"></tbody>
        </table>
      </div>
    </div>
  </div><!-- /tab-pane-load -->

</div><!-- /sec-upload-load -->

<script>
function switchUploadTab(tab) {
  var isUpload = tab === 'upload';
  document.getElementById('tab-pane-upload').style.display = isUpload ? '' : 'none';
  document.getElementById('tab-pane-load').style.display   = isUpload ? 'none' : '';
  document.getElementById('tab-btn-upload').classList.toggle('active', isUpload);
  document.getElementById('tab-btn-load').classList.toggle('active', !isUpload);
}
</script>


<!-- ══ PUR 시나리오 인라인 에디터 (통합됨 — scenarioSection 사용) ══ -->
<div class="card" id="purEditorSection" style="display:none!important;visibility:hidden;position:absolute">
  <div class="card-head" style="background:#faf5ff;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
    <span class="step" style="background:#7c3aed">편집</span>
    <h2 style="color:#7c3aed">PUR 시나리오 인라인 편집</h2>

    <!-- 필터 — 우측 -->
    <div style="display:flex;gap:6px;margin-left:auto;flex-wrap:wrap;align-items:center">
      <input id="purEditorSearch" type="text" placeholder="테스트명 검색..."
             style="border:1px solid #CDD0D8;border-radius:3px;padding:3px 8px;font-size:11px;width:150px;height:26px"
             oninput="filterPurEditor()">
      <select id="purEditorTypeFilter" onchange="filterPurEditor()"
              style="border:1px solid #CDD0D8;border-radius:3px;padding:2px 6px;font-size:11px;height:26px;background:#fff">
        <option value="">전체 구분</option>
        <option value="단위">단위</option>
        <option value="통합">통합</option>
      </select>
      <select id="filterGnbName" onchange="filterPurEditor()"
              style="border:1px solid #CDD0D8;border-radius:3px;padding:2px 6px;font-size:11px;height:26px;background:#fff">
        <option value="">전체 메뉴</option>
      </select>
      <button class="btn-row-add" onclick="purEditorSelectAll(true)">전체선택</button>
      <button class="btn-row-add" onclick="purEditorSelectAll(false)">전체해제</button>
    </div>
  </div>

  <!-- 건수 표기 -->
  <div style="padding:5px 14px 0">
    <div class="nxa-number"><span id="purEditorCount"></span></div>
  </div>

  <!-- 저장 프로그레스바 -->
  <div id="purSaveProgressWrap" style="display:none;padding:6px 14px 0;background:#f8fafc">
    <div style="display:flex;align-items:center;gap:8px">
      <div style="flex:1;background:#e5e7eb;border-radius:6px;height:8px;overflow:hidden">
        <div id="purSaveProgressBar"
             style="height:100%;background:linear-gradient(90deg,#2563eb,#3b82f6);width:0%;transition:width 0.3s ease;border-radius:6px"></div>
      </div>
      <span id="purSaveProgressText" style="font-size:11px;color:#6b7280;min-width:60px;text-align:right"></span>
    </div>
  </div>

  <!-- 편집 도구모음 -->
  <div style="padding:8px 14px;border-bottom:1px solid #CDD0D8;display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:#f8fafc">
    <button class="btn" id="purDbSaveBtn" onclick="doSaveScenarioDB()" disabled
            style="background:#0057b7;color:#fff;border-color:#0057b7;font-size:12px;font-weight:700">
      💾 시나리오 저장
    </button>
    <button class="btn" id="btnGenSpecFromEditor" onclick="genSpecFromEditor()"
            style="background:#2563eb;color:#fff;border-color:#2563eb;font-size:12px;font-weight:700">
      <span class="spinner" id="purSpecSpinner" style="display:none"></span>
      ⚡ spec.ts 생성
    </button>
    <span id="purSaveStatus" style="font-size:12px;color:#888;margin-left:4px"></span>
    <span id="purSpecStatus" style="font-size:12px;color:#2563eb;margin-left:4px"></span>
  </div>

  <!-- 테이블 -->
  <div style="position:relative">
    <div style="position:absolute;top:6px;right:6px;z-index:20;display:flex;gap:4px">
      <button class="btn-row-add" onclick="purEditorAddRow()">＋ 행 추가</button>
      <button class="btn-row-del" onclick="purEditorDeleteSelected()">✕ 행 삭제</button>
    </div>
    <div class="nxa-grid-wrap" style="max-height:600px;overflow-y:auto">
      <table id="purEditorTable" style="width:100%;min-width:1400px">
        <thead id="purEditorHead" style="position:sticky;top:0;z-index:10"></thead>
        <tbody id="purEditorBody"></tbody>
      </table>
    </div>
  </div>
</div>

<!-- ══ PUR Java 통합 테스트 코드 생성 ══ -->
<div class="card" id="purTestCodeSection"
     style="display:none;margin-bottom:16px;border-left:4px solid #0ea5e9">
  <div class="card-head" style="background:#f0f9ff;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
    <span class="step" style="background:#0ea5e9">Java</span>
    <h2 style="color:#0369a1">Java 통합 테스트 코드 생성</h2>
    <div style="margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <button class="btn" id="btnGenTestCode" onclick="generatePurTestCode()"
              style="background:#0ea5e9;color:#fff;border-color:#0ea5e9;font-weight:700;font-size:12px">
        <span class="spinner" id="testCodeSpinner" style="display:none"></span>
        ⚡ spec.ts 생성
      </button>
      <button class="btn" id="btnRunPurTest" onclick="runPurTest()"
              style="background:#16a34a;color:#fff;border-color:#16a34a;font-weight:700;font-size:12px">
        ▶ 테스트 실행 (Playwright)
      </button>
      <a id="testCodeDownload" href="#" style="display:none;font-size:12px;color:#0369a1;font-weight:700"
         onclick="return downloadPurTestCode()">⬇ spec.ts 다운로드</a>
    </div>
    <span id="testCodeStatus" style="font-size:12px;color:#888"></span>
  </div>

  <div style="padding:5px 14px 0">
    <div class="nxa-number"><span id="purTestCodeCount"></span></div>
  </div>

  <div id="testCodeLogSection" style="display:none">
    <div id="testCodeLog"
         style="font-family:monospace;font-size:11px;padding:10px;
                background:#0c1222;color:#7dd3fc;max-height:180px;
                overflow-y:auto;white-space:pre-wrap"></div>
  </div>

  <div id="testCodePreviewSection" style="display:none">
    <div style="padding:6px 14px;background:#f0f9ff;border-top:1px solid #bae6fd;
                border-bottom:1px solid #bae6fd;display:flex;align-items:center;gap:8px">
      <span style="font-size:11px;font-weight:700;color:#0369a1">생성된 코드 미리보기</span>
      <button class="btn-row-add" onclick="copyTestCode()" style="margin-left:auto">📋 복사</button>
    </div>
    <div style="overflow:auto;max-height:420px;background:#0f172a">
      <pre id="testCodePreview"
           style="margin:0;padding:14px 18px;font-family:'D2Coding',Consolas,monospace;
                  font-size:11px;line-height:1.7;color:#e2e8f0;white-space:pre"></pre>
    </div>
  </div>

  <div style="padding:8px 14px;font-size:11px;color:#64748b;background:#f8fafc;
              border-top:1px solid #e0f2fe">
    💡 생성 경로: <code style="color:#0369a1">etc/ai/tests/integrations/pur_YYYYMMDD_inte.spec.ts</code>
    &nbsp;·&nbsp; 생성 후 <strong>▶ 테스트 실행 (Playwright)</strong> 버튼으로 바로 실행 가능
  </div>
</div>

<style>
/* ── PUR 에디터 테이블 — Nexacro 그리드 스타일 (CSS 변수 참조) ── */
#purEditorTable th {
  background: var(--nxa-th-bg, #EEF0F5);
  color: var(--nxa-btn-text, #374b72);
  padding: 5px 8px;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  border: 1px solid var(--nxa-th-border, #CDD0D8);
}
#purEditorTable th.editable {
  background: #dce8f7;
  color: var(--ai-nav, #1a3a5c);
  cursor: default;
}
#purEditorTable td {
  padding: 4px 6px;
  border: 1px solid var(--nxa-td-border, #E2E4EB);
  vertical-align: top;
  min-width: 60px;
  max-width: 300px;
  background: #fff;
  color: #222;
  font-size: 12px;
}
#purEditorTable tbody tr:nth-child(even) td { background: var(--nxa-row-even, #F8F9FC); }
#purEditorTable td.editable-cell {
  background: #fafeff;
  cursor: text;
}
#purEditorTable td.editable-cell:focus {
  outline: 2px solid var(--nxa-accent, #5372ad);
  background: #eff6ff;
}
#purEditorTable td.editable-cell:hover { background: var(--nxa-row-hover, #EDF3FF); }
#purEditorTable tr:hover td { background: var(--nxa-row-hover, #EDF3FF) !important; }
#purEditorTable tr.row-sel td { background: var(--nxa-row-sel, #D6E4FF) !important; }
.pur-badge { display:inline-block;padding:1px 6px;border-radius:3px;font-size:9px;font-weight:700; }
.pur-badge-단위    { background:#dbeafe;color:#1d4ed8; }
.pur-badge-통합    { background:#dcfce7;color:#15803d; }
.pur-badge-비정상  { background:#fee2e2;color:#b91c1c; }
.pur-badge-E2E     { background:#fef9c3;color:#92400e; }
</style>

<script>
/* STEP 1 그리드 드래그드롭 — fileUpload.xfdl ondrop 패턴과 동일 */
function onExcelFileGridDrop(event) {
  event.preventDefault();
  var files = event.dataTransfer && event.dataTransfer.files;
  if (!files || !files[0]) return;
  var file = files[0];
  if (!/\.xlsx?$/i.test(file.name)) {
    alert('Excel 파일(.xlsx, .xls)만 업로드할 수 있습니다.');
    return;
  }
  var inp = document.getElementById('excelFileInput');
  try {
    var dt = new DataTransfer();
    dt.items.add(file);
    inp.files = dt.files;
  } catch (e) {}
  onExcelFileSelected(inp);
}
</script>

<!-- ── 시나리오 생성 진행률 ── -->
<div class="card" id="scenarioLogSection" style="margin-bottom:16px;scroll-margin-top:10px;display:none">
  <div class="card-head">
    <h2>시나리오 생성 중</h2>
    <span class="est-time">⏱ 약 30~60초</span>
    <span id="scenarioLogStatus" style="font-size:12px;color:#888;margin-left:8px"></span>
  </div>
  <div class="card-body" style="padding:14px 16px">
    <div style="background:#e5e7eb;border-radius:6px;height:18px;overflow:hidden;margin-bottom:6px">
      <div id="scenarioProgressBar"
           style="height:100%;width:0%;background:linear-gradient(90deg,#1a3a5c,#2563eb);
                  transition:width .4s ease;border-radius:6px"></div>
    </div>
    <div id="scenarioProgressText" style="font-size:12px;color:#666;text-align:center">0%</div>
  </div>
</div>
