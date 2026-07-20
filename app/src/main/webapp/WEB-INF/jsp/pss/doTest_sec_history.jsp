<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!-- ══════════════════════════════════════════════════
     이력 관리 드로어 오버레이 (V6 DB 기반)
     ══════════════════════════════════════════════════ -->
<style>
/* 드로어 */
.history-overlay {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(0,0,0,.35);
  opacity: 0; pointer-events: none;
  transition: opacity .25s;
}
.history-overlay.open { opacity: 1; pointer-events: all; }

.history-drawer {
  position: fixed; top: 0; right: -540px; bottom: 0;
  width: 520px; z-index: 1000;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0,0,0,.18);
  display: flex; flex-direction: column;
  transition: right .28s cubic-bezier(.4,0,.2,1);
}
.history-drawer.open { right: 0; }

.hist-head {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 18px; background: #1a3a5c; color: #fff; flex-shrink: 0;
}
.hist-head h3 { font-size: 15px; font-weight: 700; flex: 1; }
.hist-close-btn {
  background: none; border: none; color: #fff; font-size: 20px;
  cursor: pointer; padding: 2px 6px; border-radius: 4px;
  line-height: 1;
}
.hist-close-btn:hover { background: rgba(255,255,255,.2); }

.hist-filter-bar {
  padding: 8px 16px; border-bottom: 1px solid #e8ecf0;
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  background: #fafbfc;
}
.hist-filter-bar label { font-size: 12px; color: #555; white-space: nowrap; }
.hist-refresh-btn {
  padding: 5px 10px; background: #e4e8ee; border: none;
  border-radius: 4px; font-size: 12px; cursor: pointer; white-space: nowrap;
}
.hist-refresh-btn:hover { background: #d0d5dd; }

.hist-body {
  flex: 1; overflow-y: auto; padding: 10px 16px 16px;
}
.hist-empty {
  text-align: center; color: #aaa; font-size: 13px;
  padding: 40px 0;
}

/* 이력 카드 */
.hist-card {
  border: 1px solid #e4e8ee; border-radius: 7px;
  margin-bottom: 10px; overflow: hidden;
}
.hist-card-head {
  padding: 9px 12px; background: #f8f9fa;
  display: flex; align-items: center; gap: 8px;
  border-bottom: 1px solid #eee;
}
.hist-ts { font-size: 11px; color: #555; font-family: monospace; }
.hist-grp-id {
  font-size: 12px; font-weight: 600; color: #1a3a5c; flex: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.hist-count {
  font-size: 11px; background: #e0e7ff; color: #3730a3;
  padding: 1px 7px; border-radius: 8px; font-weight: 600; white-space: nowrap;
}
.hist-card-body {
  padding: 8px 12px; display: flex; gap: 6px; align-items: center;
}
.hist-user { font-size: 11px; color: #888; flex: 1; }
.btn-hist-restore {
  padding: 4px 12px; background: #27ae60; color: #fff;
  border: none; border-radius: 4px; font-size: 12px;
  font-weight: 600; cursor: pointer;
}
.btn-hist-restore:hover { background: #219150; }

/* TC 이력 서브섹션 */
.tc-hist-section {
  margin-top: 18px; padding-top: 12px;
  border-top: 2px solid #e4e8ee;
}
.tc-hist-title {
  font-size: 12px; font-weight: 700; color: #555;
  margin-bottom: 8px;
}
.tc-hist-item {
  font-size: 11px; padding: 5px 8px; background: #f0f4ff;
  border-radius: 4px; margin-bottom: 4px; color: #333;
  display: flex; gap: 8px; align-items: center;
}
.tc-hist-item .tc-file { font-family: monospace; color: #0057b7; flex: 1; }
.tc-hist-item .tc-dt   { color: #888; white-space: nowrap; }

/* 복원 토스트 */
.hist-toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  background: #1a3a5c; color: #fff; padding: 10px 20px; border-radius: 8px;
  font-size: 13px; z-index: 2000; box-shadow: 0 4px 16px rgba(0,0,0,.2);
  opacity: 0; transition: opacity .3s; pointer-events: none;
}
.hist-toast.show { opacity: 1; }
</style>

<!-- 오버레이 배경 -->
<div class="history-overlay" id="histOverlay" onclick="closeHistoryDrawer()"></div>

<!-- 드로어 패널 -->
<div class="history-drawer" id="histDrawer">
  <div class="hist-head">
    <span>📋</span>
    <h3>시나리오 이력 관리</h3>
    <button class="hist-close-btn" onclick="closeHistoryDrawer()">✕</button>
  </div>

  <!-- 툴바 -->
  <div class="hist-filter-bar">
    <label>시나리오 그룹 이력</label>
    <button class="hist-refresh-btn" onclick="loadHistoryList()">🔍 조회</button>
    <button class="hist-refresh-btn" style="background:#dbeafe;color:#1e40af"
            onclick="loadTcGenHistList()">🔧 TC생성 이력</button>
  </div>

  <!-- 목록 -->
  <div class="hist-body" id="histBody">
    <div class="hist-empty">저장된 이력이 없습니다.</div>
  </div>
</div>

<!-- 복원 토스트 -->
<div class="hist-toast" id="histToast"></div>
