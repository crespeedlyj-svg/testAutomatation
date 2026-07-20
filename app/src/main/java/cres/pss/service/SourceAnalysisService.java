package cres.pss.service;

import java.io.*;
import java.sql.*;
import java.util.*;
import java.util.regex.*;
import javax.servlet.http.*;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SourceAnalysisService {

    @Autowired
    DataSource dataSource;

    // ── Patterns ──────────────────────────────────────────────────────────────
    private static final Pattern GFN_TRAN_PAT = Pattern.compile(
        "gfn_tran\\s*\\([^,]+,\\s*\"[^\"]*\"\\s*,\\s*\"(/[^\"]+\\.do)\"");
    private static final Pattern TRANSACTION_PAT = Pattern.compile(
        "\\.transaction\\s*\\(\\s*\"[^\"]*\"\\s*,\\s*\"(/[^\"]+\\.do)\"");
    private static final Pattern DO_URL_PAT = Pattern.compile(
        "\"(/(?:mis|pms)/[\\w/._-]+\\.do)\"");

    // ── xfdl Dataset/Transaction 추출 ─────────────────────────────────────────
    private static final Pattern XFDL_DATASET_PAT = Pattern.compile(
        "<(?:Ordinary)?Dataset[^>]+id=\"([^\"]+)\"[^>]*>[\\s\\S]*?<ColumnInfo>([\\s\\S]*?)</ColumnInfo>",
        Pattern.CASE_INSENSITIVE);
    private static final Pattern XFDL_COL_ID_PAT = Pattern.compile(
        "<Column[^>]+id=\"([^\"]+)\"", Pattern.CASE_INSENSITIVE);
    private static final Pattern GFN_TRAN_FULL_PAT = Pattern.compile(
        "gfn_tran\\s*\\(\\s*[^,]+,\\s*\"[^\"]*\"\\s*,\\s*\"(/[^\"]+\\.do)\"\\s*,\\s*\"([^\"]*)\"\\s*,\\s*\"([^\"]*)\"");

    // ══════════════════════════════════════════════════════════════════════════
    // xfdl Dataset / Transaction 분석
    // ══════════════════════════════════════════════════════════════════════════

    public Map<String, List<String>> extractXfdlDatasets(File xfdlFile) {
        String content = readFileSafe(xfdlFile);
        Map<String, List<String>> map = new LinkedHashMap<>();
        Matcher dm = XFDL_DATASET_PAT.matcher(content);
        while (dm.find()) {
            String dsId  = dm.group(1);
            String block = dm.group(2);
            List<String> cols = new ArrayList<>();
            Matcher cm = XFDL_COL_ID_PAT.matcher(block);
            while (cm.find()) cols.add(cm.group(1));
            if (!cols.isEmpty()) map.put(dsId, cols);
        }
        return map;
    }

    public Map<String, String[]> extractTranDsMap(File xfdlFile) {
        String content = readFileSafe(xfdlFile);
        Map<String, String[]> map = new LinkedHashMap<>();
        Matcher m = GFN_TRAN_FULL_PAT.matcher(content);
        while (m.find()) {
            String url = m.group(1);
            if (!map.containsKey(url))
                map.put(url, new String[]{ m.group(2).trim(), m.group(3).trim() });
        }
        return map;
    }

    /**
     * xfdl 내 gfn_openPopup 호출에서 팝업 xfdl 경로 정보를 추출한다.
     * 패턴: gfn_openPopup("popupId", "mis.pur::pur_5115M.xfdl", ...)
     * 반환: [modulePath("mis/pur"), fileName("pur_5115M.xfdl"), popupId("pur_5115M")]
     */
    public List<String[]> extractPopupXfdlInfos(File xfdlFile, String nxuiBase) {
        String content = readFileSafe(xfdlFile);
        List<String[]> result = new ArrayList<>();
        // "module.prefix::filename.xfdl" 패턴 추출
        Pattern p = Pattern.compile("\"([a-zA-Z]+\\.[a-zA-Z0-9_]+)::([a-zA-Z0-9_]+\\.xfdl)\"",
                                    Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(content);
        Set<String> seen = new LinkedHashSet<>();
        while (m.find()) {
            String moduleDotPrefix = m.group(1); // "mis.pur"
            String fileName        = m.group(2); // "pur_5115M.xfdl"
            String key = moduleDotPrefix + "::" + fileName.toLowerCase();
            if (!seen.add(key)) continue;
            String modulePath = moduleDotPrefix.replace(".", "/"); // "mis/pur"
            String popupId    = fileName.replaceAll("(?i)\\.xfdl$", ""); // "pur_5115M"
            result.add(new String[]{modulePath, fileName, popupId});
        }
        return result;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 결함 분석
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * 결함 조치 가능도 판단.
     *
     * <ul>
     *   <li>즉시조치가능 — CSRF·세션 만료·파라미터 오류·NullPointer·타임아웃 등 원인이 명확한 경우</li>
     *   <li>단기조치가능 — DB·SQL·서비스 레이어·HTTP 4xx/5xx 등 서버 로직 오류</li>
     *   <li>검토필요   — 비즈니스 로직 불일치·어서션 오류·예상결과 미일치 등 요구사항 재검토 필요</li>
     *   <li>원인미상   — 오류 메시지가 없거나 분류 불가인 경우</li>
     * </ul>
     */
    public String inferFeasibility(String errorMsg) {
        if (errorMsg == null || errorMsg.trim().isEmpty()) return "원인미상";
        String lower = errorMsg.toLowerCase();

        // ① 즉시조치가능: 환경·인증·파라미터 오류
        if (lower.contains("csrf")         || lower.contains("session expired")
         || lower.contains("로그인")        || lower.contains("auth")
         || lower.contains("nullpointer")   || lower.contains("null pointer")
         || lower.contains("timeout")       || lower.contains("시간 초과")
         || lower.contains("parameter")     || lower.contains("파라미터")
         || lower.contains("errorcode=\"-1\"") || lower.contains("errorcode=-1")) {
            return "즉시조치가능";
        }

        // ② 단기조치가능: 서버·DB 오류
        if (lower.contains("sql")          || lower.contains("ora-")
         || lower.contains("jdbc")         || lower.contains("mybatis")
         || lower.contains("datasource")   || lower.contains("database")
         || lower.contains("500")          || lower.contains("internal server error")
         || lower.contains("service")      || lower.contains("서비스")
         || lower.contains("400")          || lower.contains("404")) {
            return "단기조치가능";
        }

        // ③ 검토필요: 비즈니스 로직 불일치
        if (lower.contains("assertion")    || lower.contains("expected")
         || lower.contains("mismatch")     || lower.contains("불일치")
         || lower.contains("비즈니스")      || lower.contains("계산")
         || lower.contains("로직")         || lower.contains("요구사항")) {
            return "검토필요";
        }

        return "원인미상";
    }

    /** 결함내용 컬럼 텍스트 구성 */
    public String buildDefectContent(Map<String, Object> scenario, String errorMsg) {
        String url = str(scenario, "url");
        StringBuilder sb = new StringBuilder();
        if (url != null && !url.isEmpty())
            sb.append("[URL] ").append(url).append("\n");
        if (errorMsg != null && !errorMsg.trim().isEmpty()) {
            String trimmed = errorMsg.length() > 300 ? errorMsg.substring(0, 300) + "..." : errorMsg;
            sb.append("[오류] ").append(trimmed);
        } else {
            sb.append("오류 상세 없음");
        }
        return sb.toString();
    }

    /** 테스트경과 컬럼 텍스트 구성 */
    public String buildTestProgress(Map<String, Object> scenario) {
        String testName = str(scenario, "testName");
        String url      = str(scenario, "url");
        String remark   = str(scenario, "remark");
        StringBuilder sb = new StringBuilder();
        sb.append("■ 테스트명: ").append(testName).append("\n");
        sb.append("■ 결과: FAIL\n");
        if (url != null && !url.isEmpty())
            sb.append("■ 엔드포인트: ").append(url).append("\n");
        if (remark != null && !remark.trim().isEmpty()) {
            String trimmed = remark.length() > 200 ? remark.substring(0, 200) + "..." : remark;
            sb.append("■ 오류내용: ").append(trimmed);
        }
        return sb.toString();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // DB 메뉴 경로 조회
    // ══════════════════════════════════════════════════════════════════════════

    /** pgmId 의 계층 메뉴 경로를 루트→리프 순으로 반환. 결과 없으면 null. */
    public String getMenuPath(String pgmId, HttpServletRequest request) {
        System.out.println("[DEBUG-DB] getMenuPath 호출: pgmId=" + pgmId + ", dataSource=" + (dataSource == null ? "null ← DB연결 없음!" : dataSource.getClass().getSimpleName()));
        if (dataSource == null) return null;
        String sql =
            "SELECT menu_nm " +
            "FROM SYS_MENU_MGT " +
            "WHERE lvl >= 2 " +
            "START WITH menu_id IN ( " +
            "    SELECT menu_id FROM SYS_MENU_MGT " +
            "    WHERE pgm_id = ? AND cls_cd NOT IN ('QUK', 'MAN') " +
            ") " +
            "CONNECT BY PRIOR upp_menu_id = menu_id " +
            "ORDER BY lvl";
        List<String> parts = new ArrayList<>();
        System.out.println("[DEBUG-DB] getMenuPath DB연결 시도: pgmId=" + pgmId.toUpperCase());
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            System.out.println("[DEBUG-DB] getMenuPath DB연결 성공: conn=" + conn.getClass().getSimpleName());
            ps.setString(1, pgmId.toUpperCase());
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String nm = rs.getString("menu_nm");
                    if (nm != null) parts.add(nm.trim());
                }
            }
            System.out.println("[DEBUG-DB] getMenuPath 쿼리 완료: parts=" + parts);
        } catch (Exception e) {
            System.out.println("[DEBUG-DB] getMenuPath DB오류: " + e.getMessage());
            return null;
        }
        return parts.isEmpty() ? null : String.join(" > ", parts);
    }

    /** xfdl 소스에서 targetPgmId 를 팝업으로 호출하는 상위 PGM_ID 를 찾고,
     *  그 PGM_ID 의 메뉴 경로를 반환. depthLeft 만큼 재귀 탐색. */
    public String resolveMenuPathViaPopupCaller(String pgmId, String nxuiBase, HttpServletRequest request) {
        return resolveMenuPathViaPopupCallerInternal(pgmId, nxuiBase, request, 3);
    }

    private String resolveMenuPathViaPopupCallerInternal(String targetPgmId, String nxuiBase,
                                                          HttpServletRequest request, int depthLeft) {
        if (depthLeft <= 0) return null;
        String callerPgmId = findPopupCallerInXfdlByBase(targetPgmId, nxuiBase);
        if (callerPgmId == null) return null;
        String path = getMenuPath(callerPgmId, request);
        if (path != null) return path;
        return resolveMenuPathViaPopupCallerInternal(callerPgmId, nxuiBase, request, depthLeft - 1);
    }

    /** 전체 nxui xfdl 파일을 스캔하여 targetPgmId 를 팝업으로 호출하는 파일의 PGM_ID 를 반환. */
    public String findPopupCallerInXfdl(File xfdlFile, String targetPgmId) {
        if (xfdlFile == null || !xfdlFile.exists()) return null;
        String content = readFileSafe(xfdlFile);
        String targetLower = targetPgmId.toLowerCase();
        if (!content.toLowerCase().contains(targetLower)) return null;
        Pattern popCallPat = Pattern.compile(
            "(?i)(?:OpenPopup|addPopup|ExecOpenURL|showModalDialog)[\\s\\S]{0,200}?" +
            Pattern.quote(targetLower) + "(?:\\.xfdl)?[\"'\\s,)]");
        if (popCallPat.matcher(content).find()) {
            String fname = xfdlFile.getName().replaceAll("(?i)\\.xfdl$", "").toUpperCase();
            return fname;
        }
        return null;
    }

    private String findPopupCallerInXfdlByBase(String targetPgmId, String nxuiBase) {
        File nxuiDir = new File(nxuiBase);
        if (!nxuiDir.exists()) return null;

        String targetLower = targetPgmId.toLowerCase();
        Pattern popCallPat = Pattern.compile(
            "(?i)(?:OpenPopup|addPopup|ExecOpenURL|showModalDialog)[\\s\\S]{0,200}?" +
            Pattern.quote(targetLower) + "(?:\\.xfdl)?[\"'\\s,)]");

        // nxui 하위 전체 xfdl 파일 탐색
        Deque<File> queue = new ArrayDeque<>();
        queue.add(nxuiDir);
        while (!queue.isEmpty()) {
            File cur = queue.poll();
            if (cur.isDirectory()) {
                File[] children = cur.listFiles();
                if (children != null) for (File c : children) queue.add(c);
                continue;
            }
            if (!cur.getName().toLowerCase().endsWith(".xfdl")) continue;
            String content = readFileSafe(cur);
            if (!content.toLowerCase().contains(targetLower)) continue;
            if (popCallPat.matcher(content).find()) {
                String fname = cur.getName().replaceAll("(?i)\\.xfdl$", "").toUpperCase();
                return fname;
            }
        }
        return null;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // PGM_ID 추출
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * 소스명(displayName)에서 DB 메뉴 조회용 PGM_ID를 추출한다.
     * normalizeSourceName 결과에서 추가로 말미 단일 영문자를 제거한다.
     *
     * - 일반 소스명  : PUR_5110M           → PUR_5110M  (단일자 없음 — 변경 없음)
     * - xfdl 파일   : PUR_5110M.xfdl      → PUR_5110M  (변경 없음)
     * - Java 파일   : pur_5110MController.java  → PUR_5110   (normalizeSourceName=PUR_5110M → M 제거)
     *                 pur_5110ServiceImpl.java   → PUR_5110   (normalizeSourceName=PUR_5110  → 변경 없음)
     *                 pur_5110Dao.java           → PUR_5110   (normalizeSourceName=PUR_5110  → 변경 없음)
     */
    public String extractPgmId(String displayName) {
        String normalized = normalizeSourceName(displayName);
        // Java 파일인 경우에만 말미 단일 영문자 추가 제거 (메뉴 DB는 접미자 없이 저장됨)
        String raw = displayName.replaceAll("\\s*\\([^)]+\\)\\s*$", "").trim();
        if (raw.toLowerCase().endsWith(".java")) {
            normalized = normalized.replaceAll("[A-Za-z]$", "");
        }
        return normalized.toUpperCase();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // SVN 작성자
    // ══════════════════════════════════════════════════════════════════════════

    public String getSvnAuthor(HttpServletRequest request) {
        try {
            Process p = new ProcessBuilder("svn", "info").redirectErrorStream(true).start();
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(p.getInputStream(), "UTF-8"))) {
                String line;
                while ((line = br.readLine()) != null) {
                    if (line.startsWith("Last Changed Author:"))
                        return line.replace("Last Changed Author:", "").trim();
                }
            }
            p.waitFor();
        } catch (Exception ignored) {}
        return System.getProperty("user.name", "");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 공통 유틸
    // ══════════════════════════════════════════════════════════════════════════

    private String normalizeSourceName(String displayName) {
        String name = displayName.replaceAll("\\s*\\([^)]+\\)\\s*$", "").trim();
        if (name.toLowerCase().endsWith(".java")) {
            name = name.substring(0, name.length() - 5);
            name = name.replaceAll("(?i)(Controller|ServiceImpl|Service|DaoImpl|Dao|Impl)$", "");
        } else {
            name = name.replaceAll("(?i)\\.xfdl$", "");
        }
        return name.toUpperCase();
    }

    private String readFileSafe(File file) {
        if (file == null || !file.exists()) return "";
        try {
            byte[] bytes = java.nio.file.Files.readAllBytes(file.toPath());
            try { return new String(bytes, "UTF-8"); }
            catch (Exception e) { return new String(bytes, "EUC-KR"); }
        } catch (Exception e) { return ""; }
    }

    private String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? String.valueOf(v) : "";
    }
}
