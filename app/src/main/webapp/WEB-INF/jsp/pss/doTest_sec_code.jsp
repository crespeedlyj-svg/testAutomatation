<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!-- ══ PANEL 2: 테스트 코드 생성 ══ -->
<div class="workflow-step-header">
  <div class="workflow-step-num" id="wf-num-2">2</div>
  <div class="workflow-step-title">테스트 코드 생성 (spec.ts)</div>
  <button class="btn btn-info" id="btnRegenSpec" onclick="doRegenSpec()"
          style="display:none;padding:0 14px;font-size:12px;height:26px;margin-left:8px"
          title="생성된 spec.ts를 버리고 처음부터 다시 생성합니다">
    <span class="spinner" id="regenSpinner"></span>
    🔄 테스트코드 재생성
  </button>
</div>

<!-- ── 최근 테스트코드 불러오기 ── -->
<div class="card" id="tcHistSection" style="margin-bottom:16px;scroll-margin-top:10px">
  <div class="card-head">
    <h2>최근 테스트코드 불러오기</h2>
    <button class="top_btn_item btn_blue" onclick="loadTcGenHistGrid()"
            style="margin-left:auto">
      🔄 이력 조회
    </button>
  </div>
  <div class="card-body" style="padding:0">
    <div id="tcGenHistEmpty"
         style="padding:18px 16px;font-size:12px;color:#888;text-align:center">
      [이력 조회] 버튼을 클릭하면 spec.ts 생성 이력이 표시됩니다.
    </div>
    <div id="tcGenHistGridWrap" style="display:none;overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:#f1f5f9;border-bottom:1px solid #e2e8f0">
            <th style="padding:8px 12px;text-align:left;font-weight:600;color:#475569;white-space:nowrap">생성일시</th>
            <th style="padding:8px 12px;text-align:left;font-weight:600;color:#475569">파일명</th>
            <th style="padding:8px 12px;text-align:center;font-weight:600;color:#475569;white-space:nowrap">유형</th>
            <th style="padding:8px 12px;text-align:center;font-weight:600;color:#475569;white-space:nowrap">소스목록</th>
            <th style="padding:8px 12px;text-align:center;font-weight:600;color:#475569;white-space:nowrap">불러오기</th>
          </tr>
        </thead>
        <tbody id="tcGenHistGridBody" style="border-bottom:1px solid #e2e8f0"></tbody>
      </table>
    </div>
  </div>
</div>

<!-- ── 기존 spec.ts 불러오기 드롭존 ── -->
<div class="card" id="specImportSection" style="margin-bottom:16px;scroll-margin-top:10px">
  <div class="card-head">
    <h2>기존 spec.ts 불러오기</h2>
    <span style="font-size:11px;color:#aaa;margin-left:auto">이전에 생성한 spec.ts 파일을 드롭하거나 클릭하여 선택</span>
  </div>
  <div class="card-body">
    <div class="file-dropzone" id="specDropZone" tabindex="0"
         onclick="document.getElementById('specTsInput').click()">
      <input type="file" id="specTsInput" accept=".ts" style="display:none"
             onchange="onSpecTsFilePicked(this)">
      <div class="dropzone-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <path fill="#222" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
      </div>
      <div class="dropzone-title">클릭 혹은 파일을 이곳에 드롭하세요.</div>
      <div class="dropzone-sub">spec.ts 파일 · 파일당 최대 3MB</div>
    </div>
    <div id="specImportStatus" style="font-size:12px;margin-top:8px;min-height:16px"></div>
  </div>
</div>

<!-- spec.ts 생성 진행률 -->
<div class="card" id="specProgressSection" style="margin-bottom:16px;scroll-margin-top:10px;display:none">
  <div class="card-head">
    <h2>spec.ts 생성 중</h2>
    <span id="specProgressStatus" style="font-size:12px;color:#888;margin-left:8px"></span>
  </div>
  <div class="card-body" style="padding:14px 16px">
    <div style="background:#e5e7eb;border-radius:6px;height:18px;overflow:hidden;margin-bottom:6px">
      <div id="specProgressBar"
           style="height:100%;width:0%;background:linear-gradient(90deg,#1a3a5c,#2563eb);
                  transition:width .4s ease;border-radius:6px"></div>
    </div>
    <div id="specProgressText" style="font-size:12px;color:#666;text-align:center">0%</div>
  </div>
</div>

<!-- spec.ts 미리보기 -->
<div class="card" id="specPreviewSection" style="margin-bottom:16px;scroll-margin-top:10px;display:none">
  <div class="card-head" style="cursor:pointer" onclick="toggleSpecPreview()">
    <h2>📄 spec.ts 미리보기</h2>
    <span id="specPreviewFileName"
          style="font-size:11px;color:#64748b;margin-left:8px;font-family:monospace;
                 max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span>
    <span id="specPreviewLineCount"
          style="font-size:11px;color:#aaa;margin-left:8px;white-space:nowrap"></span>
    <button onclick="event.stopPropagation();copySpecPreview()"
            class="top_btn_item btn_blue" style="margin-left:auto">
      📋 복사
    </button>
    <button id="btnTogglePreview" onclick="event.stopPropagation();toggleSpecPreview()"
            class="top_btn_item" style="margin-left:3px;background:#f0f4fa;
            color:#2059a3;border:1px solid #2059a3">
      ▲ 접기
    </button>
  </div>
  <div id="specPreviewBody">
    <pre id="specPreviewCode"
         style="margin:0;padding:14px 16px;font-size:11.5px;font-family:'Consolas','D2Coding',monospace;
                line-height:1.65;color:#1e293b;background:#f8fafc;
                max-height:500px;overflow:auto;white-space:pre;
                border-top:1px solid #e2e8f0;tab-size:2"></pre>
  </div>
</div>

