package cres.pss.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

/**
 * 추가형 내보내기: doTest 프로그램이 생성한 flat 시나리오(ScenarioBuilderService.makeScenario 출력)를
 * 테스트 자동화 파이프라인의 per-pgm 포맷(_workspace/{prefix}/01_scenarios.json)으로 변환한다.
 *
 * 기존 프로그램(그리드/Excel/spec/DB)은 전혀 건드리지 않는다. 출력만 우리 포맷으로 별도 생성한다.
 *
 * 매핑 요약:
 *   flat.screenId    -> our.pgmId
 *   flat.displayName -> our.screenName
 *   flat.url         -> our.apiUrl (+ serviceId 추출)
 *   flat.inputCols   -> our.dsSearchCols
 *   flat.outputDsId  -> our.dsListName
 *   flat.scenarioId  -> our.scenarios[].tcId (언더스코어 정규화)
 *   flat.testName    -> our.scenarios[].설명 (화면명 접두 제거)
 *   flat.testData    -> our.scenarios[].params (토큰 해소)
 *   flat.expectedResult -> our.scenarios[].expectedDesc
 */
@Service
public class OurFormatExportService {

    /** flat 시나리오 목록 → 우리 포맷 화면 객체 목록 (screenId 기준 그룹핑) */
    public List<Map<String, Object>> toOurFormat(List<Map<String, Object>> flat) {
        LinkedHashMap<String, List<Map<String, Object>>> groups = new LinkedHashMap<>();
        if (flat != null) {
            for (Map<String, Object> s : flat) {
                String key = str(s.get("screenId"));
                if (key.isEmpty()) key = str(s.get("sourceName"));
                groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
            }
        }
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, List<Map<String, Object>>> e : groups.entrySet()) {
            result.add(buildScreen(e.getKey(), e.getValue()));
        }
        return result;
    }

    private Map<String, Object> buildScreen(String pgmId, List<Map<String, Object>> flats) {
        // 대표 시나리오: 조회(SELECT) 우선 — apiUrl/dsSearchCols/dsListName 추출용
        Map<String, Object> rep = flats.get(0);
        for (Map<String, Object> f : flats) {
            if ("SELECT".equals(str(f.get("crudType")))) { rep = f; break; }
        }
        String apiUrl = str(rep.get("url"));

        Map<String, Object> screen = new LinkedHashMap<>();
        // 파이프라인 포맷은 gnbName=중분류(node0), groupName=소분류(node n-2).
        // doTest 프로그램은 gnbName=node0, groupName=중분류(node0), subCategory=소분류(node n-2)이므로
        // our.groupName(소분류)에는 프로그램의 subCategory를 매핑한다(없으면 groupName 폴백).
        String subCat = str(rep.get("subCategory"));
        screen.put("pgmId",        pgmId);
        screen.put("screenName",   str(rep.get("displayName")));
        screen.put("menuName",     str(rep.get("menuName")));
        screen.put("gnbName",      str(rep.get("gnbName")));
        screen.put("groupName",    !subCat.isEmpty() ? subCat : str(rep.get("groupName")));
        screen.put("menuPath",     str(rep.get("menuPath")));
        screen.put("menuId",       str(rep.get("menuId")));
        screen.put("apiUrl",       apiUrl);
        screen.put("serviceId",    extractServiceId(apiUrl));
        screen.put("method",       "POST");
        screen.put("origin",       str(rep.get("origin")));
        screen.put("crudType",     str(rep.get("crudType")));
        screen.put("dsListName",   str(rep.get("outputDsId")));
        screen.put("dsSearchCols", toStrList(rep.get("inputCols")));

        String sName = str(rep.get("menuName"));
        if (sName.isEmpty()) sName = str(rep.get("displayName"));

        List<Map<String, Object>> scs = new ArrayList<>();
        for (Map<String, Object> f : flats) {
            scs.add(buildScenario(f, sName));
        }
        screen.put("scenarios", scs);
        return screen;
    }

    private Map<String, Object> buildScenario(Map<String, Object> f, String sName) {
        String testName = str(f.get("testName"));
        String desc = stripScreenPrefix(testName);
        Map<String, String> params = parseTestData(str(f.get("testData")));
        boolean expectZero = testName.contains("역방향") || testName.contains("0건")
                || desc.contains("역방향") || desc.contains("0건");

        Map<String, Object> sc = new LinkedHashMap<>();
        sc.put("tcId",          normalizeTcId(str(f.get("scenarioId"))));
        sc.put("시나리오명",      sName);
        sc.put("설명",           desc);
        sc.put("params",         params);
        sc.put("expectedDesc",   str(f.get("expectedResult")));
        sc.put("dbCountSql",     buildCountSql(params, expectZero));
        sc.put("expectedCount",  0);
        sc.put("expectZero",     expectZero);
        return sc;
    }

    // ── 헬퍼 ────────────────────────────────────────────────────────────────

    /** "UT_PUR_0910M_001" → "UT_PUR0910M_001" (중간 화면 토큰의 언더스코어 제거) */
    private String normalizeTcId(String sid) {
        if (sid == null || sid.isEmpty()) return "";
        String[] p = sid.split("_");
        if (p.length < 3) return sid;
        StringBuilder mid = new StringBuilder();
        for (int i = 1; i < p.length - 1; i++) mid.append(p[i]);
        return p[0] + "_" + mid + "_" + p[p.length - 1];
    }

    /** "직접구매신청현황 - 전체 조회" → "전체 조회" */
    private String stripScreenPrefix(String testName) {
        if (testName == null) return "";
        int idx = testName.indexOf(" - ");
        return idx >= 0 ? testName.substring(idx + 3).trim() : testName.trim();
    }

    /** "/mis/pur/pur0910/getList.do" → "getList" */
    private String extractServiceId(String url) {
        if (url == null || url.isEmpty()) return "";
        String u = url;
        int q = u.indexOf('?'); if (q >= 0) u = u.substring(0, q);
        if (u.endsWith(".do")) u = u.substring(0, u.length() - 3);
        int slash = u.lastIndexOf('/');
        return slash >= 0 ? u.substring(slash + 1) : u;
    }

    /** testData "COL=TOKEN;COL2=TOKEN2" → {COL:해소값} (빈/INSERT용 토큰은 스킵) */
    private Map<String, String> parseTestData(String testData) {
        Map<String, String> params = new LinkedHashMap<>();
        if (testData == null || testData.isEmpty()) return params;
        // "기본 조회 조건 사용" 같은 안내 문구는 파라미터가 아님
        if (testData.indexOf('=') < 0) return params;

        LocalDate today = LocalDate.now();
        String todayStr  = String.format("%04d%02d%02d", today.getYear(), today.getMonthValue(), today.getDayOfMonth());
        String yearStart = today.getYear() + "0101";

        for (String part : testData.split(";")) {
            String t = part.trim();
            if (t.isEmpty()) continue;
            int eq = t.indexOf('=');
            if (eq <= 0) continue;
            String col = t.substring(0, eq).trim();
            String val = t.substring(eq + 1).trim();
            if (val.isEmpty()) continue;
            if ("YEAR_START".equals(val)) val = yearStart;
            else if ("TODAY".equals(val)) val = todayStr;
            params.put(col, val);
        }
        return params;
    }

    /** params 기반 COUNT SQL 합성 — 구조만 우리 포맷과 동일, 실제 컬럼 매핑은 검토 필요 */
    private String buildCountSql(Map<String, String> params, boolean expectZero) {
        if (expectZero) {
            return "-- 역방향/0건 조건: 0건 예상";
        }
        if (params.isEmpty()) {
            return "SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1";
        }
        List<String> wheres = new ArrayList<>();
        for (Map.Entry<String, String> e : params.entrySet()) {
            String col = e.getKey().toUpperCase();
            String val = e.getValue();
            if (col.endsWith("_SDT") || col.endsWith("_FRM_DT")) {
                wheres.add("A." + col + " >= '" + val + "'");
            } else if (col.endsWith("_EDT") || col.endsWith("_TO_DT")) {
                wheres.add("A." + col + " <= '" + val + "'");
            } else if (col.endsWith("_KEY")) {
                wheres.add("UPPER(A.컬럼) LIKE '%" + val + "%'");
            } else if (col.endsWith("_CD")) {
                wheres.add("B." + col + " = '" + val + "'");
            } else if (col.endsWith("_YN")) {
                // 권한 플래그 등은 WHERE 직접 반영 안 함
            } else {
                wheres.add("A." + col + " = '" + val + "'");
            }
        }
        if (wheres.isEmpty()) return "SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE 1=1";
        return "SELECT COUNT(*) FROM (쿼리 확인 필요) WHERE " + String.join(" AND ", wheres);
    }

    @SuppressWarnings("unchecked")
    private List<String> toStrList(Object o) {
        List<String> out = new ArrayList<>();
        if (o instanceof List) {
            for (Object x : (List<Object>) o) out.add(String.valueOf(x));
        }
        return out;
    }

    private String str(Object o) {
        return o == null ? "" : String.valueOf(o);
    }
}
