package cres.pss.service;

import java.util.*;
import java.util.regex.*;
import org.springframework.stereotype.Service;

/**
 * xfdl.js 파서 — gfn_tran / 화면 정보 / Dataset 컬럼 추출
 *
 * 처리하는 gfn_tran 변형:
 *   1) svcId=문자열: gfn_tran(this, "getList",  "/url.do", "ds_search", sOut, "")
 *   2) svcId=변수  : gfn_tran(this, mode,        "/url.do", sIn,         sOut, sArg)
 *   3) 다중 데이터셋: inputDs = "ds_main ds_sub"
 *   4) 빈 파라미터 : gfn_tran(this, "x", "/url.do", "", "", "")
 *   5) 확장 파라미터: gfn_tran(this, "x", "/url.do", "", "", "", "", "", false, "")
 */
@Service
public class XfdlParserService {

    // ── 반환 자료구조 ────────────────────────────────────────────────────────

    public static class TranCall {
        public String svcId;         // svcId (변수인 경우 URL에서 추출한 메서드명)
        public String url;           // 절대 경로 (.do 포함)
        public String inputDs;       // 입력 dataset ID (공백 구분 첫 번째)
        public String outputDs;      // 출력 dataset ID (공백 구분 첫 번째)
        public boolean svcIdFromVar; // true = svcId가 원래 변수였음

        @Override public String toString() {
            return (svcIdFromVar ? "[var→]" : "") + svcId + " → " + url
                 + " (" + inputDs + "/" + outputDs + ")";
        }
    }

    public static class ComponentInfo {
        public List<String> buttons  = new ArrayList<>();
        public List<String> grids    = new ArrayList<>();
        public List<String> datasets = new ArrayList<>();
    }

    public static class XfdlInfo {
        public String              screenName    = "";
        public String              screenTitle   = "";
        public List<TranCall>      tranCalls     = new ArrayList<>();
        public Map<String, String> dsColumns     = new LinkedHashMap<>();  // colId → type
        public Map<String, String> comboColumns  = new LinkedHashMap<>();  // colId → codeGrpId (예: FRGN_CLS → "604")
        public List<String[]>      popups        = new ArrayList<>();      // [popupId, modulePath, screenId]
        public ComponentInfo       components    = new ComponentInfo();
    }

    // ── 패턴 정의 ────────────────────────────────────────────────────────────

    private static final Pattern P_SCREEN_NAME = Pattern.compile(
        "this\\.set_name\\s*\\(\\s*[\"']([^\"']+)[\"']\\s*\\)");

    private static final Pattern P_SCREEN_TITLE = Pattern.compile(
        "this\\.set_titletext\\s*\\(\\s*[\"']([^\"']+)[\"']\\s*\\)");

    private static final Pattern P_VAR_DECL = Pattern.compile(
        "var\\s+(\\w+)\\s*=\\s*[\"']([^\"']+)[\"']");

    /** gfn_tran — svcId 문자열 리터럴 */
    private static final Pattern P_GFN_TRAN_STR = Pattern.compile(
        "(?:this\\.)?gfn_tran\\s*\\(\\s*(?:this|[^,]+?)\\s*," +
        "\\s*[\"']([^\"']+)[\"']\\s*," +
        "\\s*[\"']([^\"']+\\.do)[\"']\\s*," +
        "\\s*([^,)]+?)\\s*," +
        "\\s*([^,)]+?)\\s*(?:,|\\))",
        Pattern.CASE_INSENSITIVE);

    /** gfn_tran — svcId 변수 */
    private static final Pattern P_GFN_TRAN_VAR = Pattern.compile(
        "(?:this\\.)?gfn_tran\\s*\\(\\s*(?:this|[^,]+?)\\s*," +
        "\\s*(\\w+)\\s*," +
        "\\s*[\"']([^\"']+\\.do)[\"']\\s*," +
        "\\s*([^,)]+?)\\s*," +
        "\\s*([^,)]+?)\\s*(?:,|\\))",
        Pattern.CASE_INSENSITIVE);

    /** gfn_openPopup("id", "mis.pur::pur_5115M.xfdl", ...) */
    private static final Pattern P_POPUP = Pattern.compile(
        "(?:this\\.)?gfn_openPopup\\s*\\(\\s*[\"']([^\"']+)[\"']\\s*," +
        "\\s*[\"']([a-zA-Z]+\\.[a-zA-Z0-9_]+::[a-zA-Z0-9_]+\\.xfdl)[\"']",
        Pattern.CASE_INSENSITIVE);

    /** <Column id="COL_NM" type="STRING" size="256"/>
     *  .xfdl.js 내 문자열 이스케이프 형식도 처리: <Column id=\"COL\" type=\"STRING\"/>
     */
    private static final Pattern P_DS_COLUMN = Pattern.compile(
        "<Column\\s+id=\\\\?[\"']([^\"'\\\\]+)\\\\?[\"']\\s+type=\\\\?[\"']([^\"'\\\\]+)\\\\?[\"']");

    private static final Pattern P_COMPONENT = Pattern.compile(
        "obj\\s*=\\s*new\\s+(Button|Grid|Edit|ComboBox|Calendar|TextArea|Static)\\s*\\(\\s*[\"']([^\"']+)[\"']",
        Pattern.CASE_INSENSITIVE);

    /** Grid Cell 내 combo: <Cell ... edittype="combo" combodataset="ds_code604" text="bind:COL_NM" .../> */
    private static final Pattern P_CELL_COMBO   = Pattern.compile(
        "<Cell\\b[^>]*edittype=[\"']?combo[\"']?[^>]*/?>",
        Pattern.CASE_INSENSITIVE);
    private static final Pattern P_CELL_BIND    = Pattern.compile(
        "\\btext=[\"']bind:(\\w+)[\"']",
        Pattern.CASE_INSENSITIVE);
    private static final Pattern P_CELL_CODE_DS = Pattern.compile(
        "\\bcombodataset=[\"']ds_code(\\d+)[\"']",
        Pattern.CASE_INSENSITIVE);

    // ── xfdl.js 파싱 진입점 ────────────────────────────────────────────────

    public XfdlInfo parseXfdl(String content) {
        XfdlInfo info = new XfdlInfo();
        if (content == null || content.isEmpty()) return info;

        String cleaned = removeLineComments(content);

        // 변수 선언 수집
        Map<String, String> varMap = new LinkedHashMap<>();
        Matcher vm = P_VAR_DECL.matcher(cleaned);
        while (vm.find()) varMap.put(vm.group(1), vm.group(2));

        // 화면 ID / 화면명
        Matcher nm = P_SCREEN_NAME.matcher(cleaned);
        if (nm.find()) info.screenName = nm.group(1);
        Matcher tm = P_SCREEN_TITLE.matcher(cleaned);
        if (tm.find()) info.screenTitle = tm.group(1);

        // gfn_tran 파싱 (URL 중복 제거)
        Set<String> seenUrls = new LinkedHashSet<>();
        parseTranCalls(cleaned, varMap, seenUrls, info.tranCalls);

        // gfn_openPopup 파싱
        Set<String> seenPopups = new LinkedHashSet<>();
        Matcher pm = P_POPUP.matcher(cleaned);
        while (pm.find()) {
            String popupPath = pm.group(2);
            if (!seenPopups.add(popupPath.toLowerCase())) continue;
            String[] parts = popupPath.split("::", 2);
            if (parts.length != 2) continue;
            String modulePath = parts[0].replace(".", "/");
            String screenId   = parts[1].replaceAll("(?i)\\.xfdl$", "");
            info.popups.add(new String[]{pm.group(1), modulePath, screenId});
        }

        // Dataset Column 정의
        Matcher cm = P_DS_COLUMN.matcher(cleaned);
        while (cm.find()) info.dsColumns.putIfAbsent(cm.group(1), cm.group(2));

        // 컴포넌트 ID 수집
        parseComponents(cleaned, info.components);

        // Grid Cell 내 ComboBox 바인딩 파싱 (colId → codeGrpId)
        parseComboCells(cleaned, info.comboColumns);

        return info;
    }

    // ── gfn_tran 파싱 ────────────────────────────────────────────────────────

    private void parseTranCalls(String content, Map<String, String> varMap,
                                 Set<String> seenUrls, List<TranCall> calls) {
        // Pass 1: svcId = 문자열 리터럴
        Matcher m1 = P_GFN_TRAN_STR.matcher(content);
        while (m1.find()) {
            String url = m1.group(2).trim();
            if (!seenUrls.add(url)) continue;
            TranCall tc = new TranCall();
            tc.svcId        = m1.group(1).trim();
            tc.url          = url;
            tc.inputDs      = resolveFirstDs(m1.group(3).trim(), varMap);
            tc.outputDs     = resolveFirstDs(m1.group(4).trim(), varMap);
            tc.svcIdFromVar = false;
            calls.add(tc);
        }

        // Pass 2: svcId = 변수
        Matcher m2 = P_GFN_TRAN_VAR.matcher(content);
        while (m2.find()) {
            String varName = m2.group(1).trim();
            if (varName.equals("this") || varName.equals("null")
                || varName.equals("true") || varName.equals("false")) continue;
            String url = m2.group(2).trim();
            if (!seenUrls.add(url)) continue;
            TranCall tc = new TranCall();
            tc.svcId        = extractMethodFromUrl(url);
            tc.url          = url;
            tc.inputDs      = resolveFirstDs(m2.group(3).trim(), varMap);
            tc.outputDs     = resolveFirstDs(m2.group(4).trim(), varMap);
            tc.svcIdFromVar = true;
            calls.add(tc);
        }
    }

    /** dataset 파라미터 → 실제 ds ID */
    private String resolveFirstDs(String raw, Map<String, String> varMap) {
        if (raw == null) return "";
        String val = raw.replaceAll("^[\"']|[\"']$", "").trim();
        if (!val.isEmpty() && val.matches("[a-zA-Z_]\\w*") && varMap.containsKey(val))
            val = varMap.get(val).replaceAll("^[\"']|[\"']$", "").trim();
        if (val.contains(":")) val = val.split(":")[0].trim();
        if (val.contains(" ")) val = val.split("\\s+")[0].trim();
        return val;
    }

    /** "/mis/pur/pur0111/setData.do" → "setData" */
    public String extractMethodFromUrl(String url) {
        if (url == null || url.isEmpty()) return "unknown";
        int lastSlash = url.lastIndexOf('/');
        String segment = lastSlash >= 0 ? url.substring(lastSlash + 1) : url;
        return segment.endsWith(".do") ? segment.substring(0, segment.length() - 3) : segment;
    }

    // ── 컴포넌트 파싱 ─────────────────────────────────────────────────────────

    private void parseComponents(String content, ComponentInfo comp) {
        Matcher m = P_COMPONENT.matcher(content);
        while (m.find()) {
            String type = m.group(1);
            String id   = m.group(2);
            switch (type.toLowerCase()) {
                case "button": if (!comp.buttons.contains(id)) comp.buttons.add(id); break;
                case "grid":   if (!comp.grids.contains(id))   comp.grids.add(id);   break;
                default: break;
            }
        }
        Pattern dsPattern = Pattern.compile(
            "new Dataset\\s*\\(\\s*[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE);
        Matcher dm = dsPattern.matcher(content);
        while (dm.find()) {
            String dsId = dm.group(1);
            if (!comp.datasets.contains(dsId)) comp.datasets.add(dsId);
        }
    }

    // ── Grid Cell 내 ComboBox 파싱 ──────────────────────────────────────────

    /**
     * Grid Cell의 edittype=combo 속성을 분석하여 colId → codeGrpId 매핑을 추출.
     * 예) <Cell text="bind:FRGN_CLS" edittype="combo" combodataset="ds_code604" .../>
     *   → comboColumns.put("FRGN_CLS", "604")
     */
    private void parseComboCells(String content, Map<String, String> comboColumns) {
        Matcher m = P_CELL_COMBO.matcher(content);
        while (m.find()) {
            String cellTag = m.group();
            Matcher bindM  = P_CELL_BIND.matcher(cellTag);
            Matcher dsM    = P_CELL_CODE_DS.matcher(cellTag);
            if (bindM.find() && dsM.find()) {
                String colId     = bindM.group(1).toUpperCase();
                String codeGrpId = dsM.group(1);
                comboColumns.putIfAbsent(colId, codeGrpId);
                System.out.println("[parseComboCells] " + colId + " → codeGrp=" + codeGrpId);
            }
        }
    }

    // ── 주석 제거 ─────────────────────────────────────────────────────────────

    private String removeLineComments(String content) {
        StringBuilder sb = new StringBuilder(content.length());
        boolean inString = false;
        char    strChar  = 0;
        int     len      = content.length();
        for (int i = 0; i < len; i++) {
            char c = content.charAt(i);
            if (inString) {
                if (c == strChar && (i == 0 || content.charAt(i - 1) != '\\'))
                    inString = false;
                sb.append(c);
            } else {
                if (c == '\'' || c == '"') {
                    inString = true; strChar = c; sb.append(c);
                } else if (c == '/' && i + 1 < len && content.charAt(i + 1) == '/') {
                    while (i < len && content.charAt(i) != '\n') i++;
                    sb.append('\n');
                } else {
                    sb.append(c);
                }
            }
        }
        return sb.toString();
    }
}
