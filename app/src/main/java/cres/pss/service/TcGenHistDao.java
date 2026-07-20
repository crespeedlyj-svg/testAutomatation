package cres.pss.service;

import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.*;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * PSS_TC_GEN_HIST 테이블 DAO
 */
@Repository
public class TcGenHistDao {

    @Autowired
    DataSource dataSource;

    // ── HIST_ID 생성 ─────────────────────────────────────────────────────────
    public String newHistId(String prefix) {
        String ts = new SimpleDateFormat("yyyyMMddHHmmss").format(new java.util.Date());
        String p  = (prefix != null && !prefix.trim().isEmpty())
                    ? prefix.trim().toUpperCase() : "DEF";
        return p + "_" + ts;
    }

    // ── PSS_TC_GEN_HIST INSERT ────────────────────────────────────────────────
    public void insertTcGenHist(String histId, String grpId, String specType,
                                 String specFileNm, int scenCnt, String scenIds,
                                 String genUser) throws Exception {
        String sql =
            "INSERT INTO PSS_TC_GEN_HIST " +
            "(HIST_ID,GRP_ID,SPEC_TYPE,SPEC_FILE_NM,SCEN_CNT,SCEN_IDS,GEN_DT,GEN_USER) " +
            "VALUES (?,?,?,?,?,?,SYSDATE,?)";
        String safeIds = scenIds != null ? scenIds : "[]";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, histId);
            ps.setString(2, grpId);
            ps.setString(3, specType);
            ps.setString(4, specFileNm);
            ps.setInt   (5, scenCnt);
            // CLOB: setCharacterStream 사용으로 크기 제한 없이 안전하게 삽입
            ps.setCharacterStream(6, new java.io.StringReader(safeIds), safeIds.length());
            ps.setString(7, genUser);
            ps.executeUpdate();
        }
    }

    // ── PSS_TC_GEN_HIST 목록 조회 ─────────────────────────────────────────────
    public List<Map<String, Object>> selectTcGenHistList(String grpId) throws Exception {
        boolean hasGrp = grpId != null && !grpId.trim().isEmpty();
        String sql =
            "SELECT HIST_ID,GRP_ID,SPEC_TYPE,SPEC_FILE_NM,SCEN_CNT,SCEN_IDS," +
            " TO_CHAR(GEN_DT,'YYYY-MM-DD HH24:MI:SS') AS GEN_DT,GEN_USER " +
            "FROM PSS_TC_GEN_HIST" +
            (hasGrp ? " WHERE GRP_ID = ?" : "") +
            " ORDER BY GEN_DT DESC";
        List<Map<String, Object>> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            if (hasGrp) ps.setString(1, grpId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("histId",     rs.getString("HIST_ID"));
                    row.put("grpId",      rs.getString("GRP_ID"));
                    row.put("specType",   rs.getString("SPEC_TYPE"));
                    row.put("specFileNm", rs.getString("SPEC_FILE_NM"));
                    row.put("scenCnt",    rs.getInt("SCEN_CNT"));
                    row.put("genDt",      rs.getString("GEN_DT"));
                    row.put("genUser",    rs.getString("GEN_USER"));
                    // SCEN_IDS CLOB → 소스목록 파싱
                    String scenIdsJson = readClob(rs, "SCEN_IDS");
                    row.put("srcList",    extractSrcList(scenIdsJson));
                    list.add(row);
                }
            }
        }
        return list;
    }

    /** CLOB 컬럼을 안전하게 String으로 읽기 (최대 8000자) */
    private String readClob(ResultSet rs, String col) {
        try {
            java.sql.Clob clob = rs.getClob(col);
            if (clob == null) return "";
            long len = Math.min(clob.length(), 8000L);
            return len > 0 ? clob.getSubString(1, (int) len) : "";
        } catch (Exception e) {
            try { return rs.getString(col); } catch (Exception e2) { return ""; }
        }
    }

    /**
     * scenarioId JSON 배열에서 고유 소스명 추출.
     * 예) ["IT_PUR_5110M_001","IT_PUR_5110M_002","IT_PMS_0010M_001"]
     *   → ["PUR_5110M","PMS_0010M"]
     * 패턴: (IT|UT|E2E)_{SOURCE}_{NNN} — SOURCE는 밑줄 포함 가능
     */
    private List<String> extractSrcList(String scenIdsJson) {
        if (scenIdsJson == null || scenIdsJson.isEmpty()) return new ArrayList<>();
        java.util.Set<String> seen = new java.util.LinkedHashSet<>();
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(
            "\"(?:IT|UT|E2E)_([A-Z0-9][A-Z0-9_]+?)_\\d{3,}\"",
            java.util.regex.Pattern.CASE_INSENSITIVE);
        java.util.regex.Matcher m = p.matcher(scenIdsJson);
        while (m.find()) seen.add(m.group(1).toUpperCase());
        return new ArrayList<>(seen);
    }
}
