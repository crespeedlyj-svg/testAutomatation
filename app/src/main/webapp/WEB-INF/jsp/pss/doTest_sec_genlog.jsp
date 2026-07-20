<%@ page pageEncoding="UTF-8" %>
<!-- ══ PANEL 6: 로그 (TOOLS) ══ -->
<div class="workflow-step-header">
  <div class="workflow-step-num" style="background:#1a3a5c">📋</div>
  <div class="workflow-step-title">로그</div>
  <button class="btn btn-sm" onclick="clearAllLogs()"
          style="margin-left:auto;background:#1a3a5c;color:#fff;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:12px">
    🗑 전체 삭제
  </button>
</div>

<!-- ── 시나리오 생성로그 ── -->
<div class="card" style="margin-bottom:16px">
  <div class="card-head">
    <h2>시나리오 생성로그</h2>
    <span id="genlogCount" style="font-size:12px;color:#888;margin-left:8px"></span>
    <span style="font-size:11px;color:#aaa;margin-left:8px">더블클릭 → 상세 로그</span>
  </div>
  <div id="genlogList" style="padding:4px 0">
    <div id="genlogEmpty" style="color:#aaa;padding:20px;text-align:center">생성 로그가 없습니다.</div>
  </div>
</div>

<!-- ── 실행로그 ── -->
<div class="card" style="margin-bottom:16px">
  <div class="card-head">
    <h2>실행로그</h2>
    <span id="runlogCount" style="font-size:12px;color:#888;margin-left:8px"></span>
    <span style="font-size:11px;color:#aaa;margin-left:8px">더블클릭 → 상세 로그</span>
  </div>
  <div id="runlogList" style="padding:4px 0">
    <div id="runlogEmpty" style="color:#aaa;padding:20px;text-align:center">실행 로그가 없습니다.</div>
  </div>
</div>

<style>
.genlog-entry {
  border-bottom:1px solid #e5e7eb;
  padding:6px 10px 6px 14px;
  font-family:monospace;
  font-size:11px;
  line-height:1.6;
  color:#374151;
}
.genlog-entry:hover { background:#f0f4ff; }
.runlog-entry {
  border-bottom:1px solid #e5e7eb;
  padding:6px 10px 6px 14px;
  font-family:monospace;
  font-size:11px;
  line-height:1.6;
  color:#374151;
}
.runlog-entry:hover { background:#f0fdf4; }
.genlog-entry .genlog-tag,
.runlog-entry .genlog-tag {
  display:inline-block;
  padding:1px 6px;
  border-radius:3px;
  font-size:10px;
  font-weight:700;
}
.genlog-tag-scenario { background:#dbeafe; color:#1d4ed8; }
.genlog-tag-spec     { background:#dcfce7; color:#15803d; }
.genlog-tag-pur      { background:#ede9fe; color:#7c3aed; }
.genlog-tag-run      { background:#fef3c7; color:#92400e; }
.genlog-time { color:#9ca3af; margin-right:6px; }
</style>

<!-- ══ 상세 로그 팝업 모달 (생성로그 + 실행로그 공용) ══ -->
<div id="genDetailModal"
     style="display:none;position:fixed;inset:0;z-index:9100;background:rgba(0,0,0,.5);align-items:center;justify-content:center"
     onclick="if(event.target===this)this.style.display='none'">
  <div style="background:#fff;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,.3);
              width:90vw;max-width:1100px;height:80vh;display:flex;flex-direction:column;overflow:hidden">
    <div style="flex-shrink:0;display:flex;align-items:center;padding:10px 16px;
                background:#1a3a5c;border-radius:8px 8px 0 0">
      <h3 id="genDetailTitle"
          style="margin:0;font-size:13px;color:#fff;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
        로그 상세
      </h3>
      <button onclick="document.getElementById('genDetailModal').style.display='none'"
              style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;padding:0 4px;line-height:1">&times;</button>
    </div>
    <div id="genDetailBody"
         style="flex:1;overflow:auto;padding:0;background:#fafafa"></div>
    <div style="flex-shrink:0;padding:8px 16px;border-top:1px solid #e5e7eb;text-align:right;background:#f9fafb">
      <button onclick="document.getElementById('genDetailModal').style.display='none'"
              style="padding:5px 18px;background:#1a3a5c;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px">닫기</button>
    </div>
  </div>
</div>
