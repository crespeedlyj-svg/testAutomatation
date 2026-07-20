'use strict';

/**
 * 파싱된 XFDL 소스 데이터로부터 SCENARIO_STORE 형식의 시나리오를 생성한다.
 * AI 없이 컬럼명 패턴 기반 결정론적 규칙을 사용한다.
 */

function detectDateCols(cols) {
  const sdt = cols.find(c => /_SDT$/i.test(c) || c === 'FROM_DT');
  const edt = cols.find(c => /_EDT$/i.test(c) || c === 'TO_DT');
  return sdt && edt ? { sdt, edt } : null;
}

function detectStatusCol(cols) {
  return cols.find(c => /APV_STAT|_STAT_CD$|_STATUS$/i.test(c)) || null;
}

function detectKeywordPair(cols) {
  const cls = cols.find(c => /SRCH_CLS$/i.test(c));
  const key = cols.find(c => /SRCH_KEY$/i.test(c));
  return cls && key ? { cls, key } : null;
}

function detectRoleCols(cols) {
  return cols.filter(c => /_YN$/i.test(c) || /ROLE_/i.test(c) || /DEPT_CHIF/i.test(c));
}

function makeScenarioId(type, prefix, no) {
  const t = type === '단위' ? 'UT' : 'IT';
  const p = prefix.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `${t}_${p}_${String(no).padStart(4, '0')}`;
}

function inferOrigin(url) {
  if (url.startsWith('/mis/')) return 'mis';
  if (url.startsWith('/pms/')) return 'pms';
  return 'mis';
}

function generateUnitScenarios(source, prefix, options = {}) {
  const { gnbName = '', menuName = '', menuPath = '' } = options;
  const scenarios = [];
  let no = 1;

  for (const tran of source.transactions) {
    const { serviceId, url, inputDs, outputDs, crudType } = tran;
    const cols = source.datasets[inputDs] || [];
    const colStr = cols.join(',');
    const origin = inferOrigin(url);
    const base = {
      sourceName: source.sourceName,
      화면명: source.screenTitle,
      testType: '단위',
      crudType,
      URL: url,
      serviceId,
      inputDsId: inputDs,
      inputCols: colStr,
      outputDsId: outputDs,
      origin,
      method: 'POST',
      menuPath: menuPath || `${gnbName} > ${menuName}`.replace(/^ > | > $/, ''),
      gnbName,
      menuName,
      extraDsRaw: '',
    };

    if (crudType === 'SELECT') {
      // TC1: 전체 조회 (빈 조건)
      scenarios.push({
        ...base, no,
        inputValues: '{}',
        테스트명: `${source.gridTitle || source.screenTitle} - 전체 조회`,
        사전조건: `${source.screenTitle} 데이터가 DB에 존재`,
        expectedResult: `HTTP 200, ${outputDs} 0건 이상 반환`,
        scenarioId: makeScenarioId('단위', `${prefix}${source.sourceName.replace(/\D/g,'').slice(0,4)}`, no),
        returnsKeyCol: '', usesSharedKey: '',
      });
      no++;

      // TC2: 날짜 범위 조회 (각 검색조건 → 개별 단위 TC)
      const dates = detectDateCols(cols);
      if (dates) {
        scenarios.push({
          ...base, no,
          inputValues: JSON.stringify({ [dates.sdt]: '20240101', [dates.edt]: '20261231' }),
          테스트명: `${source.gridTitle || source.screenTitle} - 기간 조회 [${dates.sdt}=20240101 ~ ${dates.edt}=20261231]`,
          사전조건: `[검색조건] ${dates.sdt}=20240101, ${dates.edt}=20261231 범위의 데이터 DB 존재`,
          expectedResult: `HTTP 200, 반환 행의 날짜가 범위 내`,
          scenarioId: makeScenarioId('단위', `${prefix}${source.sourceName.replace(/\D/g,'').slice(0,4)}`, no),
          returnsKeyCol: '', usesSharedKey: '',
        });
        no++;

        // TC3: 역방향 날짜 (에러 케이스)
        scenarios.push({
          ...base, no,
          inputValues: JSON.stringify({ [dates.sdt]: '20261231', [dates.edt]: '20240101' }),
          테스트명: `${source.gridTitle || source.screenTitle} - 날짜 범위 역방향 오류 [${dates.sdt}>${dates.edt}]`,
          사전조건: `[검색조건] ${dates.sdt}=20261231 > ${dates.edt}=20240101 (시작>종료 비정상 입력)`,
          expectedResult: 'HTTP 200, 0건 반환 또는 서버 에러 처리',
          scenarioId: makeScenarioId('단위', `${prefix}${source.sourceName.replace(/\D/g,'').slice(0,4)}`, no),
          returnsKeyCol: '', usesSharedKey: '',
        });
        no++;
      }

      // TC: 결재상태 필터 (개별 단위 TC)
      const statCol = detectStatusCol(cols);
      if (statCol) {
        scenarios.push({
          ...base, no,
          inputValues: JSON.stringify({ [statCol]: '000-010-090' }),
          테스트명: `${source.gridTitle || source.screenTitle} - 결재상태 필터 [${statCol}=000-010-090]`,
          사전조건: `[검색조건] ${statCol}=000-010-090 (진행중) 데이터 DB 존재`,
          expectedResult: 'HTTP 200, 반려 상태 미포함',
          scenarioId: makeScenarioId('단위', `${prefix}${source.sourceName.replace(/\D/g,'').slice(0,4)}`, no),
          returnsKeyCol: '', usesSharedKey: '',
        });
        no++;
      }

      // TC: 키워드 검색 (개별 단위 TC)
      const kw = detectKeywordPair(cols);
      if (kw) {
        scenarios.push({
          ...base, no,
          inputValues: JSON.stringify({ [kw.cls]: 'RQST_NO', [kw.key]: '2024' }),
          테스트명: `${source.gridTitle || source.screenTitle} - 키워드 검색 [${kw.cls}=RQST_NO, ${kw.key}=2024]`,
          사전조건: `[검색조건] ${kw.cls}=RQST_NO, ${kw.key}=2024 포함 데이터 DB 존재`,
          expectedResult: 'HTTP 200, 키워드 포함 건 반환',
          scenarioId: makeScenarioId('단위', `${prefix}${source.sourceName.replace(/\D/g,'').slice(0,4)}`, no),
          returnsKeyCol: '', usesSharedKey: '',
        });
        no++;
      }

      // TC: 권한 조회 (YN 컬럼 — 개별 단위 TC)
      const roleCols = detectRoleCols(cols);
      if (roleCols.length > 0) {
        const roleCol = roleCols[0];
        scenarios.push({
          ...base, no,
          inputValues: JSON.stringify({ [roleCol]: 'Y' }),
          테스트명: `${source.gridTitle || source.screenTitle} - 권한 필터 [${roleCol}=Y]`,
          사전조건: `[검색조건] ${roleCol}=Y 권한 조회 가능한 데이터 DB 존재`,
          expectedResult: 'HTTP 200, 권한 범위 내 건 반환',
          scenarioId: makeScenarioId('단위', `${prefix}${source.sourceName.replace(/\D/g,'').slice(0,4)}`, no),
          returnsKeyCol: '', usesSharedKey: '',
        });
        no++;
      }

    } else if (crudType === 'INSERT') {
      scenarios.push({
        ...base, no,
        inputValues: '{}',
        테스트명: `${source.screenTitle} - 신규 저장`,
        사전조건: '필수 입력값 준비',
        expectedResult: 'HTTP 200, 저장 성공',
        scenarioId: makeScenarioId('단위', `${prefix}${source.sourceName.replace(/\D/g,'').slice(0,4)}`, no),
        returnsKeyCol: '', usesSharedKey: '',
      });
      no++;

    } else if (crudType === 'UPDATE') {
      scenarios.push({
        ...base, no,
        inputValues: '{}',
        테스트명: `${source.screenTitle} - 수정 저장`,
        사전조건: '수정 대상 데이터 존재',
        expectedResult: 'HTTP 200, 수정 성공',
        scenarioId: makeScenarioId('단위', `${prefix}${source.sourceName.replace(/\D/g,'').slice(0,4)}`, no),
        returnsKeyCol: '', usesSharedKey: '',
      });
      no++;

    } else if (crudType === 'DELETE') {
      scenarios.push({
        ...base, no,
        inputValues: '{}',
        테스트명: `${source.screenTitle} - 삭제`,
        사전조건: '삭제 대상 데이터 존재',
        expectedResult: 'HTTP 200, 삭제 성공',
        scenarioId: makeScenarioId('단위', `${prefix}${source.sourceName.replace(/\D/g,'').slice(0,4)}`, no),
        returnsKeyCol: '', usesSharedKey: '',
      });
      no++;
    }
  }

  return scenarios;
}

function generateIntegScenarios(source, prefix, options = {}) {
  const { gnbName = '', menuName = '', menuPath = '' } = options;
  const mp = menuPath || `${gnbName} > ${menuName}`.replace(/^ > | > $/, '');
  const scenarios = [];
  let no = 1;

  const base = {
    sourceName: source.sourceName,
    화면명: source.screenTitle,
    testType: '통합',
    crudType: 'SELECT',
    URL: '',
    serviceId: '',
    inputDsId: '',
    inputCols: '',
    inputValues: '{}',
    outputDsId: '',
    origin: 'mis',
    method: '',
    menuPath: mp,
    gnbName,
    menuName,
    returnsKeyCol: '', usesSharedKey: '', extraDsRaw: '',
  };

  // IT1: 화면 진입
  scenarios.push({
    ...base, no,
    테스트명: `${source.screenTitle} - 화면 진입 및 초기 목록 조회`,
    사전조건: '로그인 완료, 메뉴 접근 권한 존재',
    expectedResult: '화면 진입 성공, 목록 표시',
    scenarioId: makeScenarioId('통합', `${prefix}${source.sourceName.replace(/\D/g,'').slice(0,4)}`, no),
  });
  no++;

  // IT2: 조회 버튼 (검색 버튼이 있으면)
  const searchBtn = source.buttons.find(b => /조회|검색|Search/i.test(b.text));
  if (searchBtn) {
    scenarios.push({
      ...base, no,
      테스트명: `${source.screenTitle} - 조회 버튼 클릭`,
      사전조건: '화면 진입 완료',
      expectedResult: '그리드 갱신, 총 건수 표시',
      scenarioId: makeScenarioId('통합', `${prefix}${source.sourceName.replace(/\D/g,'').slice(0,4)}`, no),
    });
    no++;
  }

  // IT3: 그리드 행 클릭 (팝업 오픈)
  if (source.hasGrid && source.popups.length > 0) {
    scenarios.push({
      ...base, no,
      테스트명: `${source.screenTitle} - 그리드 행 클릭 상세 팝업`,
      사전조건: '목록에 1건 이상 데이터 존재',
      expectedResult: `${source.popups[0]} 팝업 오픈`,
      scenarioId: makeScenarioId('통합', `${prefix}${source.sourceName.replace(/\D/g,'').slice(0,4)}`, no),
    });
    no++;
  } else if (source.hasGrid) {
    scenarios.push({
      ...base, no,
      테스트명: `${source.screenTitle} - 그리드 행 클릭`,
      사전조건: '목록에 1건 이상 데이터 존재',
      expectedResult: '행 선택 또는 상세 팝업 오픈',
      scenarioId: makeScenarioId('통합', `${prefix}${source.sourceName.replace(/\D/g,'').slice(0,4)}`, no),
    });
    no++;
  }

  return scenarios;
}

function generateScenarios(sources, options = {}) {
  const prefix = options.prefix || 'test';
  const unitList = [];
  const integList = [];

  for (const source of sources) {
    unitList.push(...generateUnitScenarios(source, prefix, options));
    integList.push(...generateIntegScenarios(source, prefix, options));
  }

  // 전역 순번 재부여 — UT_HRM_0001 형식 (화면 코드 없이 prefix만)
  unitList.forEach((s, i) => {
    s.no = i + 1;
    s.scenarioId = makeScenarioId('단위', prefix, i + 1);
  });
  integList.forEach((s, i) => {
    s.no = i + 1;
    s.scenarioId = makeScenarioId('통합', prefix, i + 1);
  });

  return {
    [`${prefix}_unit`]: unitList,
    [`${prefix}_integ`]: integList,
  };
}

module.exports = { generateScenarios };
