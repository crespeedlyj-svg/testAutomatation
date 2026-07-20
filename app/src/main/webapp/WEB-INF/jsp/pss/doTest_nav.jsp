<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<nav class="sidebar">
  <div class="sidebar-logo">
    eGovFrame AI 테스트
    <small>통합 테스트 자동화</small>
  </div>

  <!-- ── 3단계 워크플로우 (structure.md §1.1) ── -->
  <ul class="nav-list" style="padding:10px 0 4px">
    <li style="padding:6px 14px 4px;font-size:10px;color:#4a6a8a;font-weight:700;letter-spacing:.5px">WORKFLOW</li>

    <li class="nav-step-item unlocked" id="nav-step-1">
      <a href="#" onclick="switchPanel(1);return false;">
        <span class="nav-step-badge">A</span>시나리오 생성
      </a>
    </li>
    <li class="nav-step-item" id="nav-step-2">
      <a href="#" onclick="switchPanel(2);return false;">
        <span class="nav-step-badge">B</span>테스트 코드 생성
      </a>
    </li>
    <li class="nav-step-item" id="nav-step-3">
      <a href="#" onclick="switchPanel(3);return false;">
        <span class="nav-step-badge">C</span>테스트 실행
      </a>
    </li>
    <li class="nav-step-item" id="nav-step-4">
      <a href="#" onclick="switchPanel(4);return false;">
        <span class="nav-step-badge">D</span>테스트 결과
      </a>
    </li>
  </ul>

  <div style="border-top:1px solid #1a2d3f;margin:6px 0"></div>

  <!-- ── 유틸리티 ── -->
  <ul class="nav-list" style="padding:4px 0">
    <li style="padding:6px 14px 4px;font-size:10px;color:#4a6a8a;font-weight:700;letter-spacing:.5px">TOOLS</li>
    <li><a href="#" onclick="openHistoryDrawer();return false;" style="color:#7cc8ff;font-weight:700">📋 이력 관리</a></li>
    <li>
      <a href="<c:url value='/ai/doTestSummary.do'/>" style="color:#7cc8ff;font-weight:700">📊 테스트 현황</a>
    </li>
    <li>
      <a href="<c:url value='/ai/doTestLog.do'/>" style="color:#60a5fa;font-weight:700">
        📋 로그 조회
        <span id="nav-errlog-badge" style="display:none;background:#ef4444;color:#fff;font-size:10px;padding:1px 6px;border-radius:8px;margin-left:2px;font-weight:700"></span>
      </a>
    </li>
  </ul>

</nav>
