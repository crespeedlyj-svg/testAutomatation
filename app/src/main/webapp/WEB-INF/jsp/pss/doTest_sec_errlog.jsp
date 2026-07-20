<%@ page pageEncoding="UTF-8" %>
<!-- ══ PANEL 5: 에러 로그 ══ -->
<div class="workflow-step-header">
  <div class="workflow-step-num" style="background:#ef4444">!</div>
  <div class="workflow-step-title">❌ spec.ts 생성 에러 로그</div>
  <button class="btn btn-sm" onclick="clearErrorLogs()"
          style="margin-left:auto;background:#ef4444;color:#fff;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:12px">
    🗑 전체 삭제
  </button>
</div>

<div class="card" style="margin-bottom:16px">
  <div class="card-head">
    <h2>에러 로그 목록</h2>
    <span id="errlogCount" style="font-size:12px;color:#888;margin-left:8px"></span>
  </div>
  <div id="errlogList" style="padding:12px 16px">
    <div class="empty-msg" style="color:#aaa;padding:20px;text-align:center">에러 로그가 없습니다.</div>
  </div>
</div>

<style>
.errlog-entry {
  border:1px solid #fecaca; border-radius:6px; margin-bottom:12px;
  background:#fff5f5; overflow:hidden;
}
.errlog-entry-head {
  display:flex; align-items:center; gap:10px;
  padding:8px 12px; background:#fee2e2; border-bottom:1px solid #fecaca;
}
.errlog-type-badge {
  font-size:10px; font-weight:700; padding:2px 8px; border-radius:10px;
  background:#ef4444; color:#fff;
}
.errlog-time   { font-size:11px; color:#7f1d1d; }
.errlog-prefix { font-size:11px; color:#b91c1c; font-family:monospace; }
.errlog-msg    { padding:8px 12px; font-size:12px; color:#991b1b; font-weight:600; }
.errlog-log-toggle {
  display:inline-block; margin:0 12px 8px; font-size:11px; color:#9ca3af;
  cursor:pointer; text-decoration:underline;
}
.errlog-log-body {
  display:none; margin:0 12px 10px;
  font-family:monospace; font-size:11px; background:#1e1e1e; color:#d4d4d4;
  padding:8px 12px; border-radius:4px; max-height:180px; overflow-y:auto;
  white-space:pre-wrap; word-break:break-all;
}
</style>
