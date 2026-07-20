<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!-- ══ PANEL 3: 테스트 실행 ══ -->
<div class="workflow-step-header">
  <div class="workflow-step-num" id="wf-num-3">3</div>
  <div class="workflow-step-title">테스트 실행</div>
</div>

<!-- 실행 컨트롤 -->
<div class="card" style="margin-bottom:16px">
  <div class="card-head">
    <h2>Playwright 테스트 실행</h2>
    <span class="est-time">⏱ 약 1~3분</span>
    <span id="specFileInfo" style="font-size:11px;color:#888;margin-left:8px;font-family:monospace"></span>
  </div>
  <div class="card-body" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
    <button class="btn btn-primary" id="btnRunTest" onclick="onClickRunTestBtn()" disabled>
      <span class="spinner"></span>
      <span class="btn-label">테스트 시작</span>
    </button>
    <button class="btn" id="btnRunSpecDirect"
            onclick="doRunSpecDirect()"
            title="시나리오 없이 spec.ts 파일을 직접 실행합니다"
            style="background:#0f766e;color:#fff;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:13px">
      ▶ spec 직접 실행
    </button>
    <label class="chk-headed" title="체크 시 브라우저 창을 열어 테스트 진행 (--headed 옵션)">
      <input type="checkbox" id="chkHeaded" checked>
      브라우저 표시 (--headed)
    </label>
    <button class="btn btn-danger" id="btnStopTest" onclick="doStopTest()" disabled>
      ■ 중지
    </button>
    <span id="runStatus" style="font-size:12px;color:#888"></span>
  </div>
</div>

<!-- Playwright 로그 -->
<div class="card" id="logSection" style="margin-bottom:16px;scroll-margin-top:10px">
  <div class="card-head">
    <h2>Playwright 실행 로그</h2>
  </div>
  <div id="playwrightLog"></div>
</div>

<!-- 시나리오 결과 미리보기 (실행 중 업데이트) -->
<div class="card" id="runProgressSection" style="margin-bottom:16px;display:none">
  <div class="card-head">
    <h2>실행 중 결과</h2>
    <div class="summary" style="margin:0;flex:1;margin-left:16px">
      <div class="sum-box" style="min-width:60px;padding:6px 10px"><div class="num" id="runSumPass" style="font-size:18px">0</div><div class="lbl">PASS</div></div>
      <div class="sum-box fail" style="min-width:60px;padding:6px 10px"><div class="num" id="runSumFail" style="font-size:18px;color:#b91c1c">0</div><div class="lbl">FAIL</div></div>
    </div>
  </div>
</div>
