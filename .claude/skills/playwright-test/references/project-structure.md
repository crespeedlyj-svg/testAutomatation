# 테스트 자동화 프로그램 구조 설계

> 작성일: 2026-06-21
> 대상 시스템: MIS (Nexacro + Spring MVC)
> JDK: 1.8

---

## 1. 프로그램 구성

테스트 자동화는 다음 3개의 JSP 프로그램으로 구성된다.

| 번호 | JSP 파일 | 역할 |
|------|----------|------|
| 1 | `doTest_main.jsp` | 테스트 시나리오 생성 + 테스트 코드 작성 + 테스트 결과 (3탭 통합) |
| 2 | `doTest_summary.jsp` | 테스트 현황 대시보드 (개발자/PL/사용자 통과 통계) |
| 3 | `doTest_log.jsp` | 로그 조회 |

### 1.1 프로그램 1: doTest_main.jsp (3탭 통합)

```
doTest_main.jsp
  ├─ 탭 A: 테스트 시나리오 생성
  │    - XFDL 정적 분석으로 단위/통합 시나리오 자동 추출
  │    - 추출 결과 그리드 표시 + 수동 수정
  │    - 시나리오 내보내기 (xlsx / hwpx / pdf)
  │    - "테스트 코드 생성" 버튼: 탭 전환 없이 현재 탭에서 spec.ts 생성
  │      (탭 B로 이동하지 않음 — 생성 완료 후 다운로드 안내 메시지만 표시)
  │
  ├─ 탭 B: 테스트 코드 확인
  │    - 생성된 spec.ts 내용 조회·다운로드 (탭 A에서 생성 후 확인용)
  │
  └─ 탭 C: 테스트 결과
       - 테스트 실행 결과 입력
       - 결과 파일 익스포트
```

### 1.2 프로그램 2: doTest_summary.jsp (테스트 현황)

```
doTest_summary.jsp
  ├─ 단위테스트 탭
  │    - 전체 n건 중 개발자/PL/사용자 통과 m건 통계
  │    - 시나리오 ID별 통과 현황 그리드
  │    - 통과 규칙: 개발자 → PL → 사용자 순서 강제
  │
  └─ 통합테스트 탭
       - 동일 구조
```

### 1.3 프로그램 3: doTest_log.jsp (로그 조회)

```
doTest_log.jsp
  - 추출/생성/내보내기 작업 로그 조회
  - 오류 로그 표시
```

---

## 1.4 버튼 명칭 규칙

데이터를 서버에서 불러오는 버튼은 **"새로고침"이 아니라 "조회"** 로 표기한다.  
아이콘은 `🔍`를 사용한다.

| 위치 | 파일 | 버튼 레이블 | 동작 |
|------|------|------------|------|
| 오류 로그 패널 | `doTest_log.jsp` | `🔍 조회` | `loadErrLog()` |
| 생성 로그 패널 | `doTest_log.jsp` | `🔍 조회` | `loadGenLog()` |
| 단위 현황 패널 | `doTest_summary.jsp` | `🔍 조회` | `loadUnitSummary()` |
| 통합 현황 패널 | `doTest_summary.jsp` | `🔍 조회` | `loadIntegSummary()` |
| 이력 드로어 | `doTest_sec_history.jsp` | `🔍 조회` | `loadHistoryList()` |

초기 안내 문구도 "새로고침 버튼을 눌러..." → "조회 버튼을 눌러..."로 통일한다.

---

## 2. Java 클래스 설계

### 2.1 신규 클래스 목록

| 클래스 | 파일 경로 | 역할 |
|--------|----------|------|
| `XfdlScenarioExtractor` | `src/main/java/cres/common/web/XfdlScenarioExtractor.java` | XFDL 버튼 분석 + 시나리오 조립 |
| `MenuResolverService` | `src/main/java/cres/common/web/MenuResolverService.java` | sourceName → menuPath DB 조회 |
| `TestSummaryService` | `src/main/java/cres/common/web/TestSummaryService.java` | 통과 현황 집계 + 통과 규칙 검증 |
| `TestSummaryDao` | `src/main/java/cres/common/web/TestSummaryDao.java` | PSS_TC_PASS_MGT 테이블 CRUD |

### 2.2 수정 대상 클래스

| 클래스 | 추가 내용 |
|--------|----------|
| `AiController` | SSE 엔드포인트 3개 추가 |
| `ExportService` | xlsx/hwpx/pdf 내보내기 메서드 3개 추가 |

---

## 3. 핵심 Java 설계

### 3.1 XfdlScenarioExtractor

**파일**: `src/main/java/cres/common/web/XfdlScenarioExtractor.java`

버튼 분석과 시나리오 조립을 담당하는 전용 클래스. `XfdlParserService`는 변경하지 않는다.

```java
@Service
public class XfdlScenarioExtractor {

    @Autowired private XfdlParserService xfdlParser;
    @Autowired private MenuResolverService menuSvc;

    /** 버튼 분석 결과를 담는 내부 클래스 */
    public static class ButtonAnalysis {
        public List<Map<String,String>>       buttons;          // [{id, label, onclickFn}]
        public Map<String,String>             fnBodies;         // {onclickFn → 함수 본문} ← 파싱 1회
        public Map<String,Map<String,String>> svcIdToBtnMap;    // {svcId → {btnId, btnText}}
        public Map<String,List<String>>       dsColumnMap;      // Phase 5: dsId → [컬럼ID 목록]
        public List<String>                   enabledCtrls;     // fn_compCtrl set_enable 대상
        public Map<String,String>             staticLabels;     // {컴포넌트ID → 레이블 text}
        public Map<String,List<String>>       callbackMap;      // {svcId → [패턴 목록]}
        public Map<String,List<String>>       gridHeaders;      // {gridId → [헤더 text[]]}
        public Set<String>                    hasValidChkSvcIds;// fn_validChk 가 있는 svcId
        // 비-tranCall 버튼 분류 (Phase 5)
        public List<Map<String,String>>       popupButtons;     // gfn_openPopup 호출 버튼
        public List<String>                   rowAddBtnIds;     // 행추가 버튼
        public List<String>                   rowDelBtnIds;     // 행삭제 버튼
        public List<String>                   excelBtnIds;      // 엑셀 다운로드 버튼
        public List<String>                   approvalBtnIds;   // 결재상신 버튼
    }

    /**
     * XFDL 소스에서 버튼 관련 정보를 분석한다.
     * fnBodies를 먼저 구축하여 이후 buildScenarios()에서 parseEventFn() 재호출 없이 재사용한다.
     */
    public ButtonAnalysis analyzeButtons(String content) {
        ButtonAnalysis result = new ButtonAnalysis();
        result.buttons       = parseButtons(content);
        result.fnBodies      = buildFnBodies(content, result.buttons);
        result.svcIdToBtnMap = buildSvcIdToBtnMap(result.buttons, result.fnBodies);
        result.dsColumnMap   = parseDsColumnMap(content);
        result.enabledCtrls  = parseEnabledCtrls(content);
        result.staticLabels  = parseStaticLabels(content);
        result.callbackMap   = parseCallbackMap(content);
        result.gridHeaders   = parseGridHeaders(content);
        markValidChkSvcIds(result);
        categorizeNonTranButtons(result);
        return result;
    }

    private Map<String,String> buildFnBodies(String content,
                                              List<Map<String,String>> buttons) {
        Map<String,String> map = new LinkedHashMap<>();
        for (Map<String,String> btn : buttons) {
            String fnName = btn.get("onclickFn");
            if (fnName != null && !fnName.isEmpty())
                map.put(fnName, parseEventFn(content, fnName));
        }
        return map;
    }

    private Map<String,Map<String,String>> buildSvcIdToBtnMap(
            List<Map<String,String>> buttons, Map<String,String> fnBodies) {

        Map<String,Map<String,String>> map = new LinkedHashMap<>();
        Pattern tranPat = Pattern.compile("gfn_tran\\s*\\(\\s*\"([^\"]+)\"");

        for (Map<String,String> btn : buttons) {
            String fnBody = fnBodies.getOrDefault(btn.get("onclickFn"), "");
            Matcher m = tranPat.matcher(fnBody);
            while (m.find()) {
                String svcId = m.group(1);
                if (!map.containsKey(svcId)) {
                    Map<String,String> info = new LinkedHashMap<>();
                    info.put("btnId",   btn.get("id"));
                    info.put("btnText", btn.get("label"));
                    map.put(svcId, info);
                }
            }
        }
        return map;
    }

    public List<Map<String,Object>> buildScenarios(int startNo,
                                                    XfdlParserService.XfdlInfo info,
                                                    ButtonAnalysis analysis, String origin) {
        List<Map<String,Object>> result = new ArrayList<>();
        Map<String,String> menu = menuSvc.resolveMenu(info.screenName);

        List<String> enabledLabels = resolveEnabledLabels(
                analysis.enabledCtrls, analysis.staticLabels, analysis.gridHeaders);

        String screenTitle = (info.screenTitle != null && !info.screenTitle.isEmpty())
                ? info.screenTitle : info.screenName;

        int no = startNo;

        if (info.tranCalls != null) {
            for (XfdlParserService.TranCall tran : info.tranCalls) {
                if (tran.url == null || tran.url.isEmpty()) continue;

                String crudType  = inferCrudType(tran.svcId);
                String inputCols = extractInputCols(tran.inputDs, analysis.dsColumnMap, info.dsColumns);
                List<String> cbPats = analysis.callbackMap.getOrDefault(
                        tran.svcId, Collections.emptyList());

                String btnId = findButtonBySvcId(tran.svcId, analysis.buttons);

                if (("btn_save".equals(btnId) || looksLikeSaveBtn(tran.svcId))
                        && analysis.hasValidChkSvcIds.contains(tran.svcId)) {
                    result.add(buildOne(no++, info, tran, analysis, menu,
                            origin, "유효성검사", crudType, inputCols, cbPats, enabledLabels));
                }

                result.add(buildOne(no++, info, tran, analysis, menu,
                        origin, null, crudType, inputCols, cbPats, enabledLabels));
            }
        }

        for (String btnId : analysis.rowAddBtnIds) {
            result.add(buildNonTranScenario(no++, info, menu, origin,
                    screenTitle + " - 행추가 버튼 클릭 > 그리드 행 추가",
                    "그리드가 화면에 표시된 상태여야 함",
                    "그리드에 빈 행이 추가됨", "단위"));
        }
        for (String btnId : analysis.rowDelBtnIds) {
            result.add(buildNonTranScenario(no++, info, menu, origin,
                    screenTitle + " - 행삭제 버튼 클릭 > 그리드 행 삭제",
                    "삭제할 행이 그리드에서 선택된 상태여야 함",
                    "선택된 행이 그리드에서 제거됨", "단위"));
        }
        for (Map<String,String> btn : analysis.popupButtons) {
            String label = btn.getOrDefault("label", btn.getOrDefault("id", "팝업"));
            if (label.isEmpty()) label = btn.getOrDefault("id", "팝업");
            result.add(buildNonTranScenario(no++, info, menu, origin,
                    screenTitle + " - " + label + " 버튼 클릭 > 팝업 창 열림 확인",
                    "화면이 정상 로드된 상태여야 함",
                    "팝업 창이 열림", "단위"));
        }
        for (String btnId : analysis.excelBtnIds) {
            result.add(buildNonTranScenario(no++, info, menu, origin,
                    screenTitle + " - 엑셀 다운로드 실행",
                    "조회된 데이터가 그리드에 표시된 상태여야 함",
                    "브라우저에 Excel 파일 다운로드가 시작됨", "단위"));
        }
        for (String btnId : analysis.approvalBtnIds) {
            result.add(buildNonTranScenario(no++, info, menu, origin,
                    screenTitle + " - 결재상신 버튼 클릭 > 결재상신 실행",
                    "저장된 문서가 존재하고 결재 가능 상태(미상신)여야 함",
                    buildApprovalExpectedResult(), "통합"));
        }

        return result;
    }

    // --- 내부 헬퍼 메서드 목록 ---
    // parseButtons(content)
    // parseEventFn(content, fnName)                                  ← 괄호 카운팅, buildFnBodies()에서만 호출
    // buildFnBodies(content, buttons)                                ← {onclickFn → body} 맵, 파싱 1회
    // buildSvcIdToBtnMap(buttons, fnBodies)                          ← 역맵, content 불필요
    // parseDsColumnMap(content)                                      ← dsId → [컬럼ID] 분리 파싱 (Phase 5)
    // markValidChkSvcIds(result)
    // categorizeNonTranButtons(result)
    // findButtonBySvcId(svcId, buttons)
    // looksLikeSaveBtn(svcId)
    // inferCrudType(svcId)                                           ← scenario_extraction.md 4.7절
    // extractInputCols(inputDs, dsColumnMap, dsColumnsFlat)          ← scenario_extraction.md 4.8절
    // buildInputValues(inputCols)                                    ← scenario_extraction.md 4.10절 (실제 날짜 문자열)
    // buildTestName(screenTitle, btnId, actionType, svcId)
    // resolveBtnText(btnId, svcId)
    // resolveActionTypeFromBtnId(btnId)
    // resolveActionTypeFromSvcId(svcId)
    // buildPreCondition(btnId, enabledLabels, crudType, inputCols)   ← scenario_extraction.md 3.3절
    // buildExpectedResult(svcId, cbPatterns, crudType, outputDs, screenTitle, actionType) ← scenario_extraction.md 3.3절
    // buildApprovalExpectedResult()                                   ← scenario_extraction.md 4.11절 (초기화 시 1회 캐싱)
    // parseCallbackMap(content)
    // parseEnabledCtrls(content)
    // parseStaticLabels(content)
    // parseGridHeaders(content)
    // resolveEnabledLabels(ctrls, labels, headers)
    // deduplicateByUrl(scenarios)
    // resolveOrigin(xfdlFile)
    // listXfdlFiles(dir)
    // readFile(file)
}
```

### 3.2 전체 추출 진입점: XfdlScenarioExtractor.extractAll()

```java
/**
 * 지정 디렉토리의 XFDL 파일 전체를 분석하여 단위 테스트 시나리오 목록을 반환한다.
 *
 * @param dirOriginMap  디렉토리 → origin 매핑 (호출자가 명시적으로 전달)
 * @param listener      진행률 콜백 (SSE 전송용)
 */
public List<Map<String,Object>> extractAll(Map<File,String> dirOriginMap,
                                            BiConsumer<Integer,Integer> listener) {
    List<Map.Entry<File,String>> fileEntries = new ArrayList<>();
    for (Map.Entry<File,String> entry : dirOriginMap.entrySet()) {
        File dir = entry.getKey();
        if (!dir.exists() || !dir.isDirectory()) continue;

        List<File> xfdlFiles = new ArrayList<>();
        FilePathHelper.addXfdlFiles(dir, xfdlFiles);
        for (File f : xfdlFiles)
            fileEntries.add(new AbstractMap.SimpleEntry<>(f, entry.getValue()));
    }

    List<Map<String,Object>> result = new ArrayList<>();
    int total = fileEntries.size();
    int no    = 1;

    for (int i = 0; i < total; i++) {
        File   xfdlFile = fileEntries.get(i).getKey();
        String origin   = fileEntries.get(i).getValue();

        String content = readFile(xfdlFile);
        XfdlParserService.XfdlInfo info = xfdlParser.parseXfdl(content);
        ButtonAnalysis analysis         = analyzeButtons(content);

        int before = result.size();
        result.addAll(buildScenarios(no, info, analysis, origin));
        no += (result.size() - before);

        listener.accept(i + 1, total);
    }
    return result;
}
```

### 3.3 SSE 엔드포인트: AiController

**파일**: `src/main/java/cres/common/web/AiController.java`

기존 `generateScenarioStream.do`와 동일한 SSE 패턴을 사용한다.

```java
@Autowired private XfdlScenarioExtractor scenarioExtractor;

@RequestMapping(value = "/ai/extractUnitScenarios.do",
                produces = "text/event-stream;charset=UTF-8")
public void extractUnitScenarios(
        HttpServletRequest request,
        HttpServletResponse response,
        @RequestParam(value = "prefix") String prefix) throws Exception {

    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("X-Accel-Buffering", "no");
    PrintWriter out = response.getWriter();
    // ⚠️ getWriter() 이후 모든 처리는 반드시 try-catch 안에 있어야 한다.
    //    try 바깥에서 예외 발생 시 Spring이 미커밋 응답을 reset()하여
    //    Content-Type: text/plain 500 에러로 교체 → EventSource onerror 발생
    try {
        String nxuiBase = FilePathHelper.getNxuiBase(request);

        Map<File,String> dirOriginMap = new LinkedHashMap<>();
        dirOriginMap.put(new File(nxuiBase + "/mis/" + prefix), "mis");
        dirOriginMap.put(new File(nxuiBase + "/pms/" + prefix), "pms");

        List<Map<String,Object>> scenarios = scenarioExtractor.extractAll(dirOriginMap,
            (cur, total) -> {
                out.write("data: {\"cur\":" + cur + ",\"total\":" + total + "}\n\n");
                out.flush();
            });

        String storeKey = prefix + "_unit";
        AiStateStore.SCENARIO_STORE.put(storeKey, scenarios);
        addGenLog("EXTRACT", "단위 시나리오 추출 완료: " + prefix, scenarios.size());

        out.write("data: {\"done\":true,\"count\":" + scenarios.size() + "}\n\n");
        out.flush();
    } catch (Exception e) {
        String msg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
        addErrLog("EXTRACT", msg, prefix + "_unit");
        out.write("data: {\"error\":\"" + msg.replace("\"", "'") + "\"}\n\n");
        out.flush();
    }
}
```

---

## 4. Import 명세

### 4.1 XfdlScenarioExtractor.java

```java
import cres.common.web.XfdlParserService;
import cres.common.web.MenuResolverService;
import cres.common.util.FilePathHelper;
import cres.common.store.AiStateStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.LinkedHashSet;
import java.util.function.BiConsumer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
```

### 4.2 AiController.java (추가분)

```java
import cres.common.web.XfdlScenarioExtractor;
import java.io.PrintWriter;
import java.util.LinkedHashMap;
```

---

## 5. 소스 코드 제약 사항

### 5.1 런타임 환경

- **JDK 1.8** 사용 — `var`, `Stream.toList()`, `record` 등 Java 9+ 문법 사용 금지
- Lambda, Stream API, `Optional` 등 Java 8 범위 내 기능은 사용 가능

### 5.2 Import 제약

- **와일드카드 `import *` 금지** — 정확한 클래스명으로만 import한다.  
  전체 클래스별 import 명세는 `unit_test_scenario_generator.md` §10을 참고한다.

### 5.3 Java 설계 원칙

| # | 제약 | 근거 |
|---|------|------|
| 1 | **AI·LLM 호출 금지** — XFDL 정적 분석만 사용한다 | 결정론적 생성, 재현성 보장 |
| 2 | **`XfdlParserService` 변경 금지** — `parseXfdl()` 재사용만, 클래스 자체는 수정하지 않는다 | 기존 통합 시나리오 로직과의 격리 |
| 3 | **`fnBodies` 파싱 1회만** — `buildFnBodies()`에서 1회 파싱 후 맵 재사용, `parseEventFn()` 재호출 금지 | 2,111개 파일 처리 시 성능 |
| 4 | **`buildSvcIdToBtnMap()` content 재파싱 금지** — `fnBodies` 맵만 순회, content를 다시 받지 않는다 | 위와 동일 |
| 5 | **함수 종료 감지: 괄호 카운팅 방식** — `};` 단순 라인 매칭 금지, `{`/`}` 개수 균형으로 종료 감지 | 중첩 함수 오파싱 방지 |
| 6 | **`buildApprovalExpectedResult()` 캐싱** — `XfdlScenarioExtractor` 초기화 시 1회만 파일 읽기, 매 버튼 루프 재읽기 금지 | 파일 I/O 최소화 |
| 7 | **`ApprovalServiceImpl.java` 경로: 절대 경로 사용** — WAR 배포 환경에서 상대 경로 동작하지 않음, 다중 경로 시도(`bases[]`) 패턴 사용 | WAR 배포 환경 호환 |
| 8 | **`@RequestParam`에 반드시 `value` 속성 명시** — JDK 1.8은 `-parameters` 컴파일 플래그가 없으면 파라미터명 정보를 클래스 파일에 저장하지 않음. `@RequestParam String foo` 대신 `@RequestParam(value = "foo") String foo` 로 작성. `required = false` 등 다른 속성이 있어도 동일하게 `value` 명시 필요 | JDK 1.8 환경 `Name for argument of type [String] not specified` 에러 방지 |
| 9 | **SSE 엔드포인트: `response.getWriter()` 이후 모든 처리를 `try-catch` 안에** — `getWriter()`를 호출해도 `write()`/`flush()` 전까지 HTTP 헤더는 아직 전송되지 않은 상태(uncommitted)다. 그 전에 예외가 컨트롤러 밖으로 탈출하면 Spring이 응답을 `reset()`하고 `Content-Type: text/plain` 으로 500 에러를 덮어 쓴다. 브라우저 `EventSource`는 `text/event-stream`이 아니면 연결을 거부하므로 `es.onerror`가 발생하며, 서버 쪽 `catch` 블록에도 도달하지 못해 ERR_LOG에도 기록되지 않는다. 반드시 `getNxuiBase()`, 파라미터 검증 등 모든 전처리를 `try` 안에 포함시킨다. | `EventSource's response has a MIME type ("text/plain") that is not "text/event-stream"` 오류 방지, ERR_LOG 누락 방지 |

### 5.4 DB 접속 — Python 경유 금지 (암호화 환경)

`etc/config/tomcat/tomcat.properties`의 DB 접속 정보(`db.url`, `db.user`, `db.password`)는 **암호화된 값**으로 저장될 수 있다.

```
# 암호화된 예시 (프로젝트 기준)
db.url      = UN3ejOl2oXWqi/TFpwbLHp03InEVZnFaNdbFRbpRQJZMV540v4HSyNfgMYWFwSHq
db.user     = Cyyo+djmQIWowaH37ihWGg==
db.password = 5YPBFJT5pPAcLB7fyiJq3A==
```

Python 스크립트는 복호화 키·로직을 갖고 있지 않으므로 이 파일을 읽어도 DB에 직접 연결할 수 없다.

#### 복호화 흐름 (현재 구조)

암호화 값의 복호화는 **Tomcat 기동 시 1회**만 이루어지며, 이후 Spring이 복호화된 커넥션 풀을 보유한다.

```
[Tomcat 기동]
  server.xml
    └─ <Resource factory="cres.com.jdbc.CryptedHikariDataSourceFactory"
                 jdbcUrl="ENC(...)" username="ENC(...)" password="ENC(...)"/>
         │
         │  cres-crypto-4.0-ofs.jar 내 CryptedHikariDataSourceFactory가
         │  ENC(...) 값을 복호화 → HikariCP 커넥션 풀 생성
         ▼
       JNDI name: "baseDS"  ← 복호화된 DataSource가 Tomcat에 등록됨

[Spring 기동]
  context-datasource.xml
    └─ <jee:jndi-lookup jndi-name="baseDS"/>
         │  JNDI에서 이미 복호화된 DataSource 획득
         ▼
       dataSource 빈  ← 모든 DAO / SqlSession이 이 빈을 사용
```

> `CryptedHikariDataSourceFactory`는 `cres-crypto-4.0-ofs.jar`에 포함된 사내 라이브러리.
> 복호화 알고리즘(키)은 해당 JAR 안에만 존재하므로 Python에서는 접근 불가.

#### 원칙: DB 조회는 반드시 Java(Spring)를 경유한다

| 구분 | 처리 주체 | 이유 |
|------|----------|------|
| DB 연결·쿼리 실행 | **Java (AiController / DAO)** | Spring `dataSource` 빈이 복호화된 커넥션 풀 보유 |
| 공통코드 조회 결과 전달 | **임시 JSON 파일** (argv로 경로 전달) | Python에 복호화 로직 없음 |
| Python 스크립트 | DB 연결 시도 금지 | `tomcat.properties` 직접 읽기 금지 |

#### 구현 패턴

```
[버튼 클릭]
  → AiController (@Autowired SqlSession 또는 DAO 사용)
       │  COM_STD_MGT 등 필요한 공통코드를 Java에서 조회
       │  결과를 JSON 파일로 임시 저장 (etc/ai/tmp/comm_codes_{timestamp}.json)
       ▼
  ProcessBuilder로 Python 스크립트 실행
    argv[4] = JSON 파일 절대 경로
       │  Python은 JSON 파일 읽기만 수행, DB 직접 연결 없음
       ▼
  시나리오 생성 완료 후 임시 JSON 파일 삭제

[Java에서 공통코드 조회 예시]
  // AiController 또는 별도 CommonCodeDao에서 실행
  List<Map<String,Object>> rows = jdbcTemplate.queryForList(
      "SELECT COMM_CD, COMM_NM FROM COM_STD_MGT WHERE UPP_COMM_CD = ? AND USE_YN = 'Y' ORDER BY SORT_NO",
      codeId);
  // → JSON 직렬화 후 파일 저장
```

### 5.5 예외·폴백 처리

| # | 제약 | 처리 방법 |
|---|------|---------|
| 1 | **hwpx 양식 파일 없음** | `log.warn()` 후 xlsx 양식 기반으로 `convertXlsxToHwpx()` 폴백 호출 |
| 2 | **A6 셀 regex 치환 실패** | 예외 던지지 않음. 원본 셀값 유지 + `log.warn()` 기록 |

---

## 6. JSP UI 레이아웃 설계

> Nexacro jspCall.xfdl WebBrowser 내에서 표시된다.
> CSS 파일: `css/ai/doTest.css`
> 적용 제약: sidebar(좌측메뉴), header(상단바) 제거 / 폼 크기 2000×750px 고정

### 6.1 공통 레이아웃 구조

Nexacro gproone 화면과 동일한 배치를 따른다.

```
┌─────────────────────────────────────────────────────┐  ← body (2000×750px)
│ | 소제목                     [버튼1] [버튼2] [버튼N] │  ← 소제목 바 (height: 35px)
├─────────────────────────────────────────────────────┤
│  검색조건 영역 (검색 조건이 있는 화면만)              │  ← search-bar (배경 #f3f3f3)
│  ㆍ레이블  [ 입력 ]   ㆍ레이블  [ 입력 ]             │
├─────────────────────────────────────────────────────┤
│ | 소제목(그리드명)     총 N건      [버튼] [버튼]      │  ← 그리드 소제목 바 (height: 35px)
├──────┬───────────┬────────┬──────────────────────────┤
│  NO  │  컬럼명   │  컬럼명 │  ...                    │  ← thead (height: 30px, bg: #f3f3f3)
├──────┼───────────┼────────┼──────────────────────────┤
│      │           │        │                          │  ← tbody (height: 30px/행)
│      │    조회할 데이터가 없습니다.                   │  ← nodatatext
└─────────────────────────────────────────────────────┘
```

### 6.2 소제목 바 (`.page-title-bar`) CSS 규칙

| 속성 | 값 | Nexacro 대응 |
|------|----|-------------|
| `height` | `35px` | `sta_WF_SubTitle1` height=35 |
| `background` | `#f3f3f3` | gproone th 배경 |
| `border-bottom` | `2px solid #5dc2be` | accent 라인 |
| `display` | `flex; align-items:center` | - |
| `padding` | `0 10px` | - |
| 소제목 텍스트 | `font: bold 14px "NotoSansKR-Regular"`, `color: #666868` | `sta_WF_SubTitle1` |
| 소제목 앞 세로바 `::before` | `width:3px; height:14px; background:#5dc2be; margin-right:7px` | `bul_Subtitle2.png` 대체 |
| 버튼 영역 | `margin-left: auto` (우측 정렬) | Nexacro 버튼 right 배치 |

### 6.3 HTML 구조 템플릿

```html
<!-- 소제목 바 -->
<div class="page-title-bar">
  <span class="page-title">소제목</span>
  <div class="page-title-btns">
    <button class="btn btn-gray  nxa-btn">도움말</button>
    <button class="btn btn-teal  nxa-btn">엑셀다운</button>
    <button class="btn btn-primary nxa-btn">신규</button>
    <button class="btn btn-info  nxa-btn">조회</button>
  </div>
</div>

<!-- 검색조건 (선택) -->
<div class="search-bar">
  <table class="search-tbl">
    <tr>
      <th>ㆍ레이블</th><td><input type="text"></td>
      <th>ㆍ레이블</th><td><input type="text"></td>
    </tr>
  </table>
</div>

<!-- 그리드 소제목 바 -->
<div class="grid-title-bar">
  <span class="grid-title">그리드명</span>
  <span class="grid-count">&nbsp;(총 <span id="rowCount">0</span>건)</span>
  <div class="grid-title-btns">
    <button class="btn btn-row-add nxa-btn">행추가</button>
    <button class="btn btn-row-del nxa-btn">행삭제</button>
  </div>
</div>

<!-- 그리드 -->
<div class="tbl-wrap">
  <table>
    <thead><tr><th>NO</th><th>컬럼1</th>...</tr></thead>
    <tbody id="gridBody">
      <tr><td colspan="N" class="nodata-msg">조회할 데이터가 없습니다.</td></tr>
    </tbody>
  </table>
</div>
```

### 6.4 추가 CSS 클래스 (`css/ai/doTest.css` 에 추가)

```css
/* ── 페이지 소제목 바 ── */
.page-title-bar {
  display: flex; align-items: center;
  height: 35px; padding: 0 10px;
  background: #f3f3f3;
  border-bottom: 2px solid var(--nxa-accent);
  margin-bottom: 0;
}
.page-title {
  font: bold 14px/35px var(--nxa-font);
  color: var(--nxa-title-color);
  display: flex; align-items: center;
}
.page-title::before {
  content: ''; display: inline-block;
  width: 3px; height: 14px;
  background: var(--nxa-accent);
  border-radius: 1px; margin-right: 7px; flex-shrink: 0;
}
.page-title-btns { margin-left: auto; display: flex; gap: 4px; }

/* ── 검색조건 바 ── */
.search-bar {
  background: #f3f3f3;
  border-bottom: 1px solid var(--nxa-th-border);
  padding: 6px 10px;
}
.search-tbl { width: 100%; border-collapse: collapse; font-size: 12px; }
.search-tbl th {
  color: var(--nxa-btn-text); font-weight: 700;
  padding: 4px 8px; white-space: nowrap; text-align: left;
  background: transparent; border: none; width: 80px;
}
.search-tbl td { padding: 4px 8px; border: none; }

/* ── 그리드 소제목 바 ── */
.grid-title-bar {
  display: flex; align-items: center;
  height: 35px; padding: 0 10px;
  background: #f3f3f3;
  border-top: 1px solid var(--nxa-th-border);
  border-bottom: 1px solid var(--nxa-th-border);
}
.grid-title {
  font: bold 14px/35px var(--nxa-font);
  color: var(--nxa-title-color);
  display: flex; align-items: center;
}
.grid-title::before {
  content: ''; display: inline-block;
  width: 3px; height: 14px;
  background: var(--nxa-accent);
  border-radius: 1px; margin-right: 7px; flex-shrink: 0;
}
.grid-count { font-size: 12px; color: #555; margin-left: 4px; }
.grid-title-btns { margin-left: auto; display: flex; gap: 4px; }

/* ── Nexacro 버튼 크기 (소제목 바 내부용) ── */
.nxa-btn { height: 23px; padding: 0 12px; font-size: 12px; font-weight: 700; }

/* ── 그리드 nodata 메시지 ── */
.nodata-msg {
  text-align: center; color: #aaa;
  padding: 40px 0; font-size: 12px;
}
```

### 6.5 각 JSP 별 적용 명세

#### `pss/doTest.jsp` — 통합 테스트 자동화

| 영역 | 내용 |
|------|------|
| 소제목 | `eGovFrame 통합 테스트 자동화` |
| 버튼 (우측) | 없음 (탭 A·B·C 내부에 각각 배치) |
| 탭 | A: 시나리오 생성 / B: 테스트 코드 생성 / C: 테스트 결과 |
| 그리드 소제목 | 각 섹션별 (`시나리오 목록`, `테스트 코드`, `실행 결과`) |

#### `pss/doTestSummary.jsp` — 테스트 현황

| 영역 | 내용 |
|------|------|
| 소제목 | `테스트 현황` |
| 버튼 (우측) | `🔄 새로고침` |
| 탭 | 단위 테스트 / 통합 테스트 |
| 그리드 소제목 | `시나리오별 통과 현황` + 총 N건 |
| 그리드 컬럼 | NO, 시나리오ID, 화면명, 테스트명, 개발자, PL, 사용자, 최종통과일, 비고 |

#### `pss/doTestLog.jsp` — 로그 조회

| 영역 | 내용 |
|------|------|
| 소제목 | `로그 조회` |
| 버튼 (우측) | `🔄 새로고침`, `🗑 로그삭제` |
| 탭 | ❌ 에러 로그 / 📋 생성 로그 |
| 검색조건 | 유형 필터 (`<select>`) |
| 그리드 소제목 | `에러 로그` / `생성 로그` + 총 N건 |
| 그리드 컬럼 | NO, 발생일시, 유형, 메시지, 대상파일 |

---

## 7. 프로그레스바 UI 설계 원칙

### 7.1 적용 대상

**모든 버튼** 클릭 시 프로그레스바를 표시한다. 비동기(SSE/fetch) 여부와 관계없이 동일하게 적용한다.

| 동작 | 버튼 ID | 처리 방식 | 엔드포인트 |
|------|---------|----------|-----------|
| 단위 시나리오 추출 | `btnExtractUnit` | SSE | `/ai/extractUnitScenarios.do` |
| 통합 시나리오 추출 | `btnExtractInteg` | SSE | `/ai/extractIntegScenarios.do` |
| 테스트 코드 생성 | `btnGenSpec` | SSE | `/ai/generateSpecStream.do` (탭 전환 없음 — 탭 A에서 in-place 실행) |
| 테스트 실행 | `btnRunTest` | SSE | `/ai/runPlaywright.do` |
| 시나리오 다운로드 (xlsx) | `btnExportXlsx` | fetch | `/ai/exportScenario.do` |
| 시나리오 다운로드 (hwpx) | `btnExportHwpx` | fetch | `/ai/exportScenario.do` |
| 시나리오 다운로드 (pdf) | `btnExportPdf` | fetch | `/ai/exportScenario.do` |
| 양식 내보내기 | `btnExportForm` | fetch | `/ai/exportScenarioForm.do` |
| 조회 | `btnSearch` | fetch | `/ai/getPassStatusList.do` |
| 개발자 통과 처리 | `btnDevPass` | fetch | `/ai/updatePassStatus.do` |
| PL 통과 처리 | `btnPlPass` | fetch | `/ai/updatePassStatus.do` |
| 사용자 통과 처리 | `btnUserPass` | fetch | `/ai/updatePassStatus.do` |
| spec.ts 저장 | `btnSaveSpec` | fetch | `/ai/generateSpecStream.do` |

> **처리 방식에 따른 패턴 구분**  
> - SSE: `progressStart()` → `progressUpdate()` (진행률 수신마다) → `progressEnd()`  
> - fetch: `progressStart()` → `progressEnd()` (응답 완료 후 즉시, §7.6 참고)

### 7.2 프로그레스바 구성 요소

버튼 클릭 시 아래 3가지 요소가 함께 동작한다.

```
[버튼]  →  ① 버튼 비활성화 + 스피너 표시
           ② 버튼 하단 또는 섹션 상단에 프로그레스바 표시
           ③ 상태 텍스트 표시 ("처리 중... N/M")
완료 시 →  ① 버튼 활성화 + 스피너 숨김
           ② 프로그레스바 100% → 1.5초 후 숨김
           ③ 상태 텍스트 → 완료 메시지
```

### 7.3 HTML 구조 (버튼별 표준 패턴)

각 버튼 바로 아래에 프로그레스 영역을 배치한다.

```html
<!-- 버튼 -->
<button class="btn-row-add" id="btnExtractUnit" onclick="runExtractUnitScenarios()">
  <span class="spinner" id="extractUnitSpinner" style="display:none"></span>
  단위 시나리오 추출
</button>
<span id="extractUnitStatus" style="font-size:12px;color:#64748b;margin-left:8px"></span>

<!-- 프로그레스바 — 버튼 하단에 위치, 작업 시작 시 display:block -->
<div id="extractUnitProgress" style="display:none;margin-top:6px">
  <div style="background:#e5e7eb;border-radius:4px;height:6px;overflow:hidden">
    <div id="extractUnitBar"
         style="height:100%;width:0%;background:linear-gradient(90deg,var(--ai-nav),var(--nxa-accent));transition:width .3s"></div>
  </div>
</div>
```

> `css/ai/doTest.css`의 기존 `.spinner` 클래스를 그대로 사용한다.  
> 프로그레스바 색상은 CSS 변수 `--ai-nav`(파랑), `--nxa-accent`(청록) 그라디언트를 사용한다.

### 7.4 JS 제어 함수 (공통 패턴)

모든 동작에서 아래 패턴을 동일하게 적용한다.

> **버튼 요소 null 가드 원칙**  
> `document.getElementById()`는 버튼이 JSP에서 제거됐거나 아직 렌더링되지 않은 경우 `null`을 반환한다.  
> `setLoading()` 등 버튼 요소를 직접 조작하는 함수는 **반드시 null 체크 후 조작**한다.
>
> ```javascript
> function setLoading(btn, on) {
>   if (!btn) return;          // 버튼이 없으면 무시
>   btn.disabled = on;
>   if (on) btn.classList.add('loading'); else btn.classList.remove('loading');
> }
> ```
>
> 버튼을 JSP에서 삭제할 때는 JS에서 해당 ID를 참조하는 모든 코드(이벤트 핸들러, enable/disable 함수)에 null 가드가 있는지 함께 확인한다.

```javascript
// 공통 헬퍼 — 버튼 ID 기준으로 구성 요소를 제어
function progressStart(prefix) {
  var btn      = document.getElementById('btn'      + prefix);
  var spinner  = document.getElementById(lcFirst(prefix) + 'Spinner');
  var status   = document.getElementById(lcFirst(prefix) + 'Status');
  var progress = document.getElementById(lcFirst(prefix) + 'Progress');
  var bar      = document.getElementById(lcFirst(prefix) + 'Bar');

  if (btn)      btn.disabled = true;
  if (spinner)  spinner.style.display = '';
  if (progress) progress.style.display = 'block';
  if (bar)      bar.style.width = '0%';
  if (status)   status.textContent = '처리 중...';
}

function progressUpdate(prefix, cur, total) {
  var bar    = document.getElementById(lcFirst(prefix) + 'Bar');
  var status = document.getElementById(lcFirst(prefix) + 'Status');
  var pct    = total > 0 ? Math.round((cur / total) * 100) : 0;
  if (bar)    bar.style.width = pct + '%';
  if (status) status.textContent = cur + ' / ' + total + ' (' + pct + '%)';
}

function progressEnd(prefix, success, message) {
  var btn      = document.getElementById('btn'      + prefix);
  var spinner  = document.getElementById(lcFirst(prefix) + 'Spinner');
  var status   = document.getElementById(lcFirst(prefix) + 'Status');
  var progress = document.getElementById(lcFirst(prefix) + 'Progress');
  var bar      = document.getElementById(lcFirst(prefix) + 'Bar');

  if (btn)     btn.disabled = false;
  if (spinner) spinner.style.display = 'none';
  if (bar) {
    bar.style.width = '100%';
    bar.style.background = success
      ? 'linear-gradient(90deg,#16a34a,#22c55e)'   /* 완료: 초록 */
      : 'linear-gradient(90deg,#dc2626,#ef4444)';  /* 실패: 빨강 */
  }
  if (status) status.textContent = message || (success ? '완료' : '오류');
  setTimeout(function() {
    if (progress) progress.style.display = 'none';
    if (bar)      bar.style.width = '0%';
    if (bar)      bar.style.background = 'linear-gradient(90deg,var(--ai-nav),var(--nxa-accent))';
  }, 1500);
}

function lcFirst(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
```

### 7.5 SSE 수신 시 프로그레스 연동 예시

```javascript
function runExtractUnitScenarios() {
  progressStart('ExtractUnit');

  var es = new EventSource('/ai/extractUnitScenarios.do?prefix=' + getCurrentPrefix());

  es.onmessage = function(e) {
    var data = JSON.parse(e.data);
    if (data.done) {
      es.close();
      progressEnd('ExtractUnit', true, '완료 — ' + data.count + '건 추출');
      loadScenarioGrid();
    } else {
      progressUpdate('ExtractUnit', data.cur, data.total);
    }
  };

  es.onerror = function() {
    es.close();
    progressEnd('ExtractUnit', false, '오류 발생');
  };
}
```

### 7.6 내보내기 동작 (fetch 기반) 프로그레스 처리

SSE가 아닌 단순 fetch 응답의 경우 진행률을 알 수 없으므로 **인디케이터(무한 애니메이션)** 방식을 사용한다.

```javascript
function exportScenarioXlsx() {
  progressStart('ExportXlsx');                    // 버튼 비활성화 + 스피너

  fetch('/ai/exportScenario.do', { method: 'POST', body: ... })
    .then(function(r) { return r.blob(); })
    .then(function(blob) {
      // 파일 다운로드 처리
      var url = URL.createObjectURL(blob);
      var a   = document.createElement('a');
      a.href  = url; a.download = fileName; a.click();
      URL.revokeObjectURL(url);
      progressEnd('ExportXlsx', true, '다운로드 완료');
    })
    .catch(function(err) {
      progressEnd('ExportXlsx', false, '내보내기 실패');
    });
}
```

> fetch 기반 동작에서는 `progressUpdate()` 호출 없이 `progressStart()` → `progressEnd()`만 호출한다.  
> 프로그레스바는 `width: 0% → 100%` 애니메이션이 즉시 실행되어 인디케이터 역할을 한다.
