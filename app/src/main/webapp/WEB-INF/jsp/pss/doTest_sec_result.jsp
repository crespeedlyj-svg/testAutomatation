<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!-- ══ PANEL 4: 테스트 결과서 ══ -->
<div class="workflow-step-header">
  <div class="workflow-step-num" id="wf-num-4">4</div>
  <div class="workflow-step-title">테스트 결과서</div>
  <button class="top_btn_item btn_blue" style="margin-left:auto" onclick="doDownload()">
    <span class="spinner" id="downloadSpinner"></span>
    📦 결과 다운로드 (.zip)
  </button>
</div>

<!-- 결과 요약 -->
<div class="card" id="resultSection" style="margin-bottom:16px;scroll-margin-top:10px">
  <div class="card-head">
    <h2>테스트 결과 요약</h2>
  </div>
  <div class="card-body">
    <div class="summary">
      <div class="sum-box"><div class="num" id="sumTotal">0</div><div class="lbl">전체</div></div>
      <div class="sum-box pass"><div class="num" id="sumPass">0</div><div class="lbl">PASS</div></div>
      <div class="sum-box fail"><div class="num" id="sumFail">0</div><div class="lbl">FAIL</div></div>
    </div>
    <div class="tbl-wrap" style="max-height:280px;overflow-y:auto">
      <table id="resultTable">
        <thead>
          <tr>
            <th style="width:36px">No</th>
            <th style="width:80px">시나리오ID</th>
            <th style="width:90px">메뉴명</th>
            <th style="width:160px">URL</th>
            <th style="width:50px">Method</th>
            <th style="width:140px">입력값</th>
            <th style="width:130px">예상결과</th>
            <th style="width:130px">실행결과</th>
            <th style="width:55px">연관</th>
            <th style="width:70px">판정</th>
          </tr>
        </thead>
        <tbody id="resultBody"></tbody>
      </table>
    </div>
  </div>
</div>

<!-- 결함 리스트 -->
<div class="card" id="defectSection" style="margin-bottom:16px;scroll-margin-top:10px">
  <div class="card-head defect-header">
    <h2>결함 리스트</h2>
    <span id="defectCountBadge"></span>
    <button class="btn btn-danger" id="btnDefectFix" onclick="doGenerateDefectFix()"
            style="margin-left:12px;padding:4px 12px;font-size:12px" disabled>
      🔍 AI 소스 개선방안 분석
    </button>
    <span id="defectFixStatus" style="font-size:11px;color:#888;margin-left:8px"></span>
    <span style="font-size:11px;color:#888;margin-left:auto">테스트 FAIL 항목만 표시</span>
  </div>
  <div class="card-body" style="padding:0">
    <div class="tbl-wrap" style="max-height:360px;overflow-y:auto">
      <table id="defectTable">
        <thead>
          <tr>
            <th style="width:36px">No</th>
            <th style="width:90px">시나리오ID</th>
            <th style="width:160px">테스트명</th>
            <th style="width:180px">URL</th>
            <th style="width:50px">Method</th>
            <th style="width:130px">기대결과</th>
            <th style="width:200px">오류 내용</th>
            <th>소스 개선방안</th>
          </tr>
        </thead>
        <tbody id="defectBody"></tbody>
      </table>
    </div>
  </div>
</div>

<!-- AI 분석 리포트 (편집 가능 textarea) -->
<div class="card" id="reportSection" style="margin-bottom:16px;scroll-margin-top:10px">
  <div class="card-head">
    <h2>✏️ AI 분석 리포트</h2>
    <span class="est-time">⏱ 약 30초</span>
    <span style="font-size:11px;color:#888;margin-left:8px">직접 수정 가능 · 다운로드(.zip)에 포함</span>
    <span id="reportStatus" style="font-size:12px;color:#888;margin-left:8px"></span>
    <div style="margin-left:auto;display:flex;gap:8px">
      <button class="btn btn-success" style="padding:5px 12px;font-size:12px" onclick="doSaveReportVersion()">버전 추가</button>
    </div>
  </div>
  <div class="card-body">
    <!-- 편집 가능한 textarea (기존 pre → textarea 변경) -->
    <textarea id="reportPreview" class="report-editor"
              placeholder="테스트 실행 후 AI 분석 리포트가 여기에 표시됩니다. 직접 수정할 수 있습니다."></textarea>
  </div>
</div>

<!-- ════════════════════════════════════════════════════
     다운로드 패널 (기존 + 다중 형식 내보내기)
     ════════════════════════════════════════════════════ -->
<div class="card" id="exportSection" style="margin-bottom:12px;scroll-margin-top:10px">
  <div class="card-head">
    <h2>📦 결과 다운로드</h2>
  </div>
  <div class="card-body" style="padding:12px 16px">

    <!-- 기존 단일 ZIP 다운로드 -->
    <div style="display:flex;align-items:center;gap:10px;padding-bottom:12px;
                border-bottom:1px solid #e5e7eb;margin-bottom:14px">
      <button class="btn btn-info" id="btnDownload" onclick="doDownload()" disabled>
        <span class="spinner"></span>📦 엑셀 다운로드 (.zip)
      </button>
      <span style="font-size:11px;color:#888">xlsx + html 결과서 기본 패키지</span>
    </div>

    <!-- ─── 다중 형식 내보내기 ─── -->
    <div style="font-size:12px;font-weight:700;color:#1a3a5c;margin-bottom:8px">
      📁 다중 형식 내보내기
      <span style="font-size:10px;font-weight:400;color:#888;margin-left:6px">
        Java 라이브러리 버전 + Python 라이브러리 버전이 모두 생성됩니다
      </span>
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:20px;margin-bottom:10px">

      <!-- 문서 종류 선택 -->
      <div>
        <div style="font-size:11px;color:#555;font-weight:700;margin-bottom:5px">문서 종류</div>
        <label class="export-chk-label">
          <input type="checkbox" id="chkScenario" checked>
          <span>📋 시나리오</span>
        </label>
        <label class="export-chk-label" style="margin-left:10px">
          <input type="checkbox" id="chkResult" checked>
          <span>📊 결과서</span>
        </label>
      </div>

      <!-- 출력 형식 선택 -->
      <div>
        <div style="font-size:11px;color:#555;font-weight:700;margin-bottom:5px">출력 형식</div>
        <label class="export-chk-label">
          <input type="checkbox" id="fmtXlsx" checked>
          <span>📗 xlsx</span>
        </label>
        <label class="export-chk-label" style="margin-left:10px">
          <input type="checkbox" id="fmtHtml" checked>
          <span>🌐 html</span>
        </label>
        <label class="export-chk-label" style="margin-left:10px">
          <input type="checkbox" id="fmtDocx">
          <span>📘 docx</span>
        </label>
        <label class="export-chk-label" style="margin-left:10px">
          <input type="checkbox" id="fmtPdf">
          <span>📕 pdf</span>
        </label>
      </div>

      <!-- 생성 주체 선택 -->
      <div>
        <div style="font-size:11px;color:#555;font-weight:700;margin-bottom:5px">생성 라이브러리</div>
        <label class="export-chk-label">
          <input type="checkbox" id="chkJava" checked>
          <span>☕ Java</span>
        </label>
        <label class="export-chk-label" style="margin-left:10px">
          <input type="checkbox" id="chkPython" checked>
          <span>🐍 Python</span>
        </label>
      </div>

    </div>

    <div style="display:flex;align-items:center;gap:10px">
      <button class="btn btn-teal" id="btnMultiExport"
              onclick="doMultiFormatDownload()" disabled>
        <span class="spinner" id="multiExportSpinner"></span>
        📦 다운로드
      </button>
      <span id="multiExportStatus" style="font-size:11px;color:#888"></span>
    </div>

  </div>
</div>

<!-- 인라인 체크박스 스타일 -->
<style>
.export-chk-label {
  display:inline-flex;align-items:center;gap:5px;
  font-size:12px;cursor:pointer;color:#333;
  padding:4px 8px;border-radius:4px;border:1px solid #e0e0e0;
  background:#fafafa;user-select:none;
}
.export-chk-label:hover { background:#e2f2fe;border-color:#009bc8; }
.export-chk-label input[type=checkbox] {
  width:14px;height:14px;accent-color:#009bc8;cursor:pointer;
}
</style>
