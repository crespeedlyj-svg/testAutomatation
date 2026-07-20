<%@ page pageEncoding="UTF-8" %>
<!-- ══ STEP 2 시나리오 목록 (인라인 편집 + 체크박스 선택) ══ -->
<div class="card" id="scenarioSection" style="margin-bottom:16px;scroll-margin-top:10px">
  <div class="card-head">
    <span class="step">STEP 2</span>
    <h2>테스트 시나리오 목록</h2>
    <span id="scenarioCountBadge" class="nxa-count-badge"></span>
    <span id="scenarioEditedBadge" style="display:none;font-size:11px;color:#d26c00;
          font-weight:700;margin-left:6px;padding:1px 7px;background:#fff8e1;
          border:1px solid #f59e0b;border-radius:3px">편집됨</span>
  </div>

  <div class="card-body" style="padding-bottom:6px">

    <!-- ── 탭 ── -->
    <div class="nxa-tab-bar">
      <button id="tabInteg" onclick="switchTab('통합')" class="nxa-tab-btn active">
        통합 테스트 <span id="integCountBadge" style="font-size:10px;opacity:.85"></span>
      </button>
      <button id="tabUnit" onclick="switchTab('단위')" class="nxa-tab-btn">
        단위 테스트 <span id="unitCountBadge" style="font-size:10px;opacity:.85"></span>
      </button>
    </div>

    <!-- ── 버튼 바 (XFDL 기준: 우측 정렬, 26px 높이) ── -->
    <div style="display:flex;justify-content:flex-end;align-items:center;
                gap:3px;padding:5px 0 3px;flex-wrap:wrap">

      <!-- 생성자 성명 -->
      <input id="creatorNameInput" type="text" placeholder="생성자 성명"
             style="padding:0 8px;font-size:12px;border:1px solid #c8c8c8;
                    border-radius:2px;width:130px;height:26px;margin-right:6px" />

      <!-- 주요 작업 버튼 -->
      <button class="top_btn_item btn_green" id="btnConfirmScenario"
              onclick="doConfirmScenario()" disabled
              title="체크된 시나리오의 테스트 코드를 생성하고 자동 실행합니다">
        ▶ 테스트
      </button>
      <button class="top_btn_item btn_blue" id="btnSaveScenarioDB"
              onclick="doSaveScenarioDB()" disabled
              title="현재 시나리오를 DB에 저장합니다">
        💾 DB 저장
      </button>
      <button class="top_btn_item btn_sky" id="btnLoadScenarioDB"
              onclick="openLoadScenarioModal()"
              title="DB에 저장된 시나리오 이력을 일시별로 불러옵니다">
        📂 시나리오 불러오기
      </button>
      <button class="top_btn_item btn_sky" id="btnAddHistoryGroup"
              onclick="doAddHistoryGroup()" disabled
              title="새 그룹시나리오 키를 발급하여 이력을 추가합니다">
        📋 이력 추가
      </button>

      <span style="width:1px;height:18px;background:#ddd;margin:0 3px;flex-shrink:0"></span>

      <!-- 다운로드/산출물 -->
      <button class="top_btn_item btn_excel" onclick="doExportScenariosExcel()"
              title="현재 시나리오 목록을 Excel 파일로 다운로드합니다">
        📥 엑셀 다운로드
      </button>
      <span style="width:1px;height:18px;background:#ddd;margin:0 3px;flex-shrink:0"></span>

      <!-- 행 관리 -->
      <button class="top_btn_item btn_add" onclick="openIntegScenModal()"
              title="통합 테스트 시나리오를 직접 작성합니다">
        ✏ 통합 추가
      </button>
      <button class="top_btn_item btn_add" onclick="doAddRow()"
              title="현재 탭 끝에 빈 행을 추가합니다">
        ＋ 행 추가
      </button>
      <button class="top_btn_item btn_del" onclick="doDeleteRows()"
              title="체크된 행을 삭제합니다">
        ✕ 행 삭제
      </button>
    </div>

    <!-- 상태 메시지 -->
    <div style="display:flex;justify-content:flex-end;gap:8px;padding:2px 0 3px;min-height:16px">
      <span id="scenarioDbStatus" style="font-size:11px;color:#888"></span>
      <span id="runStatus" style="font-size:11px;color:#888"></span>
    </div>

    <!-- 시나리오 그리드 -->
    <div class="tbl-wrap" style="max-height:420px;overflow-y:auto;overflow-x:auto">
      <table id="scenarioTable">
        <thead>
          <tr>
            <th style="width:32px;text-align:center">
              <input type="checkbox" id="chkAllScen" title="전체선택/해제"
                     onclick="toggleAllScenarios(this.checked)"
                     style="width:14px;height:14px;cursor:pointer;accent-color:#2059a3">
            </th>
            <th style="width:36px">순번</th>
            <th style="width:46px">구분</th>
            <th style="width:78px">시나리오 ID</th>
            <th style="width:160px">시나리오명 ✏</th>
            <th style="width:160px">설명 ✏</th>
            <th style="width:100px">엑터(역할) ✏</th>
            <th style="width:100px">중분류 ✏</th>
            <th style="width:100px">소분류 ✏</th>
            <th style="width:120px">메뉴명 ✏</th>
            <th style="width:200px">시나리오흐름 ✏</th>
            <th style="width:120px">입력값 ✏</th>
            <th style="width:200px">예상결과 ✏</th>
            <th style="width:78px">테스트결과</th>
            <th style="width:160px">실패사유</th>
            <th style="width:220px">개선방안</th>
            <th style="width:100px;display:none">확인자 ✏</th>
            <th style="width:80px">PL확인</th>
            <th style="width:200px">사유 ✏</th>
            <th style="width:80px">사용자확인 ✏</th>
            <th class="scen-col-sticky-right" style="width:60px">테스트</th>
          </tr>
        </thead>
        <tbody id="scenarioBody"></tbody>
      </table>
    </div>
    <div class="edit-hint">
      ✏ 열 클릭 → 편집 &nbsp;|&nbsp; Enter=저장 &nbsp;Esc=취소 &nbsp;|&nbsp;
      ☑ 체크 → 테스트 대상 선택 &nbsp;|&nbsp; ✏ 통합 추가 → 시나리오 직접 작성
    </div>
  </div>
</div>

<!-- ══ 시나리오 상세 팝업 모달 ══ -->
<div id="scenDetailModal"
     style="display:none;position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.45);
            align-items:center;justify-content:center"
     onclick="if(event.target===this)this.style.display='none'">
  <div style="background:#fff;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,.3);
              width:92vw;max-width:1200px;height:80vh;display:flex;flex-direction:column;overflow:hidden">
    <div class="scen-modal-head">
      <h3 id="scenDetailTitle" class="scen-modal-title">시나리오 상세</h3>
      <button class="btn btn-gray scen-modal-close"
              onclick="document.getElementById('scenDetailModal').style.display='none'">닫기</button>
    </div>
    <div id="scenDetailBody" style="flex:1;overflow:auto;padding:12px"></div>
  </div>
</div>

<!-- ══ 통합 테스트 시나리오 직접 작성 모달 ══ -->
<div id="integScenModal"
     style="display:none;position:fixed;inset:0;z-index:9100;background:rgba(0,0,0,.45);
            align-items:center;justify-content:center"
     onclick="if(event.target===this)closeIntegScenModal()">
  <div style="background:#fff;border-radius:6px;width:640px;max-height:90vh;
              display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,.28);
              overflow:hidden">

    <!-- 모달 헤더 -->
    <div style="background:#2059a3;color:#fff;padding:10px 16px;
                display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
      <span style="font-size:13px;font-weight:700">✏ 통합 테스트 시나리오 작성</span>
      <button onclick="closeIntegScenModal()"
              style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;line-height:1">✕</button>
    </div>

    <!-- 모달 바디 -->
    <div style="overflow-y:auto;flex:1;padding:14px 16px">
      <table class="TBL_srh" style="margin-bottom:0">
        <colgroup><col style="width:22%"><col></colgroup>
        <tbody>
          <tr>
            <th>시나리오명 <span style="color:#b91c1c">*</span></th>
            <td><input id="im_testName" type="text" placeholder="예) 구매요청 목록 조회"
                       style="width:100%;box-sizing:border-box;height:26px;padding:0 8px;
                              font-size:12px;border:1px solid #bbb"></td>
          </tr>
          <tr>
            <th>메뉴명</th>
            <td><input id="im_menuName" type="text" placeholder="예) 구매요청관리"
                       style="width:100%;box-sizing:border-box;height:26px;padding:0 8px;
                              font-size:12px;border:1px solid #bbb"></td>
          </tr>
          <tr>
            <th>API URL</th>
            <td><input id="im_url" type="text" placeholder="예) /mis/pur/pur5110/getPurReqList.do"
                       style="width:100%;box-sizing:border-box;height:26px;padding:0 8px;
                              font-size:12px;border:1px solid #bbb;font-family:monospace"></td>
          </tr>
          <tr>
            <th>CRUD 유형</th>
            <td>
              <select id="im_crudType"
                      style="height:26px;padding:0 6px;font-size:12px;
                             border:1px solid #bbb;background:#fff;font-family:inherit">
                <option value="SELECT">SELECT — 조회</option>
                <option value="INSERT">INSERT — 등록</option>
                <option value="UPDATE">UPDATE — 수정</option>
                <option value="DELETE">DELETE — 삭제</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>중분류</th>
            <td><input id="im_groupName" type="text" placeholder="예) 구매관리"
                       style="width:100%;box-sizing:border-box;height:26px;padding:0 8px;
                              font-size:12px;border:1px solid #bbb"></td>
          </tr>
          <tr>
            <th>소분류</th>
            <td><input id="im_subCategory" type="text" placeholder="예) 구매요청"
                       style="width:100%;box-sizing:border-box;height:26px;padding:0 8px;
                              font-size:12px;border:1px solid #bbb"></td>
          </tr>
          <tr>
            <th>시나리오 흐름</th>
            <td>
              <textarea id="im_preCondition" rows="3"
                        placeholder="예) 메뉴 이동 > [조회] 버튼 클릭 > 목록 확인&#10;     버튼 태그: [조회] [신규] [저장] [삭제] [신청] [완료]"
                        style="width:100%;box-sizing:border-box;padding:5px 8px;
                               font-size:12px;border:1px solid #bbb;line-height:1.5;
                               resize:vertical"></textarea>
              <span style="font-size:10px;color:#888">
                [버튼명] 형식으로 버튼 클릭 단계를 표시하면 자동으로 test.step()이 생성됩니다
              </span>
            </td>
          </tr>
          <tr>
            <th>입력값</th>
            <td>
              <textarea id="im_inputValues" rows="3"
                        placeholder="KEY=VALUE; 형식으로 입력&#10;예) DEPT_CD=100; START_DT=20260101; END_DT=20261231"
                        style="width:100%;box-sizing:border-box;padding:5px 8px;
                               font-size:12px;border:1px solid #bbb;line-height:1.5;
                               font-family:monospace;resize:vertical"></textarea>
              <span style="font-size:10px;color:#888">
                테스트 코드 생성 시 입력값으로 사용됩니다 (KEY=VALUE; 형식)
              </span>
            </td>
          </tr>
          <tr>
            <th>예상결과</th>
            <td>
              <textarea id="im_expectedResult" rows="2"
                        placeholder="예) 구매요청 목록 1건 이상 조회됨&#10;예) 저장 완료 후 목록에 반영됨"
                        style="width:100%;box-sizing:border-box;padding:5px 8px;
                               font-size:12px;border:1px solid #bbb;line-height:1.5;
                               resize:vertical"></textarea>
              <span style="font-size:10px;color:#888">
                Playwright expect() 검증에 사용됩니다
              </span>
            </td>
          </tr>
          <tr>
            <th>설명</th>
            <td><input id="im_description" type="text" placeholder="시나리오에 대한 추가 설명(선택)"
                       style="width:100%;box-sizing:border-box;height:26px;padding:0 8px;
                              font-size:12px;border:1px solid #bbb"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 모달 푸터 -->
    <div style="padding:10px 16px;border-top:1px solid #e0e0e0;background:#f5f7fa;
                display:flex;justify-content:flex-end;gap:6px;flex-shrink:0">
      <span id="im_errMsg" style="font-size:11px;color:#b91c1c;line-height:26px;margin-right:8px"></span>
      <button onclick="doSubmitIntegScen()"
              style="height:26px;padding:0 18px;font-size:12px;font-weight:700;
                     background:#2059a3;color:#fff;border:none;cursor:pointer;border-radius:2px">
        ✅ 추가
      </button>
      <button onclick="closeIntegScenModal()"
              style="height:26px;padding:0 14px;font-size:12px;
                     background:#6c7a8a;color:#fff;border:none;cursor:pointer;border-radius:2px">
        취소
      </button>
    </div>
  </div>
</div>

<!-- ══ 시나리오 불러오기 (저장 일시 선택) 모달 ══ -->
<div id="loadScenarioModal"
     style="display:none;position:fixed;inset:0;z-index:9200;background:rgba(0,0,0,.45);
            align-items:center;justify-content:center"
     onclick="if(event.target===this)closeLoadScenarioModal()">
  <div style="background:#fff;border-radius:6px;width:640px;max-height:80vh;
              display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,.28);
              overflow:hidden">

    <!-- 헤더 -->
    <div style="background:#0891b2;color:#fff;padding:10px 16px;
                display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
      <span style="font-size:13px;font-weight:700">📂 저장된 시나리오 불러오기</span>
      <button onclick="closeLoadScenarioModal()"
              style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;line-height:1">✕</button>
    </div>

    <!-- 안내 -->
    <div style="padding:8px 16px;background:#f0f9ff;border-bottom:1px solid #bae6fd;
                font-size:11px;color:#0c4a6e;display:flex;justify-content:space-between;align-items:center">
      <span>불러올 <b>저장 일시</b>를 선택하세요. 선택 시 시나리오 목록/편집 탭이 열리고 현재 편집 내용은 대체됩니다.</span>
      <button onclick="refreshLoadScenarioModal()"
              style="background:#0891b2;color:#fff;border:none;border-radius:3px;
                     padding:2px 10px;font-size:11px;cursor:pointer">🔄 새로고침</button>
    </div>

    <!-- 바디 -->
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

    <!-- 푸터 -->
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

