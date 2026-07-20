package cres.pss.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.StreamUtils;

/**
 * ORA-00904(부적합한 식별자) 오류가 발생했을 때, 에러 메시지의 "별칭"."컬럼"을
 * 실행된 sqlmap 문(FROM/JOIN 절)에서 실제 테이블명으로 역추적하고, USER_TAB_COLUMNS를
 * SELECT하여 어느 테이블에 그 컬럼이 실제로 없는지 확인한다.
 * DB에는 SELECT(카탈로그 조회)만 수행하며 데이터/스키마를 변경하지 않는다.
 */
@Repository
public class OraColumnCheckDao {

    private static final Pattern ORA_904 = Pattern.compile("ORA-00904:\\s*\"([^\"]+)\"\\.\"([^\"]+)\"");
    private static final String[] STMT_TAGS = { "select", "insert", "update", "delete" };

    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;

    private JdbcTemplate jdbc;

    @PostConstruct
    public void init() {
        this.jdbc = new JdbcTemplate(dataSource);
    }

    /**
     * remark에서 ORA-00904 "별칭"."컬럼"을 찾아, url로 추정한 sqlmap 문 안에서 해당
     * 별칭에 매핑된 테이블(들)을 조회한 뒤 실제 컬럼 존재 여부를 DB에서 확인한다.
     * 컬럼이 없는 테이블이 있으면, 같은 컬럼을 실제로 보유한 다른 후보 테이블의 컬럼
     * 정의(타입/길이)를 그대로 본떠 ALTER TABLE 제안까지 함께 만든다.
     * @return 사람이 읽을 수 있는 진단 문장 + ALTER TABLE 제안 (컬럼이 없는 테이블이 하나도 없으면 null),
     *         ORA-00904가 아니거나 후보 테이블을 특정하지 못하면 null
     */
    public String diagnoseMissingColumn(String remark, String url) {
        if (remark == null) return null;
        Matcher m = ORA_904.matcher(remark);
        if (!m.find()) return null;
        String alias  = m.group(1);
        String column = m.group(2);

        Set<String> candidateTables = findCandidateTables(url, alias, column);
        if (candidateTables.isEmpty()) {
            return "[DB 확인] 컬럼 '" + column + "'을(를) 참조하는 테이블을 sqlmap에서 특정하지 못했습니다 — 직접 확인이 필요합니다.";
        }

        Set<String> missing = new LinkedHashSet<>();
        String columnTypeDdl = null; // 컬럼을 실제로 보유한 테이블에서 확보한 "VARCHAR2(21 BYTE)" 형태의 타입 정의
        for (String table : candidateTables) {
            try {
                // ALL_TAB_COLUMNS가 아니라 USER_TAB_COLUMNS를 쓴다 — ALL_TAB_COLUMNS는 OWNER 구분 없이
                // 이 계정이 조회 권한을 가진 모든 스키마의 동일 이름 테이블을 다 보여주므로, 다른 스키마에
                // 우연히 같은 이름으로 존재하는(컬럼이 있는) 테이블을 "정상 존재"로 오판할 수 있다.
                // USER_TAB_COLUMNS는 현재 접속 계정 소유 객체로 자동 한정되어, SQL의 비한정(unqualified)
                // 테이블명이 실제로 resolve되는 대상과 정확히 일치한다.
                java.util.List<java.util.Map<String, Object>> rows = jdbc.queryForList(
                    "SELECT DATA_TYPE, DATA_LENGTH, DATA_PRECISION, DATA_SCALE, CHAR_USED " +
                    "FROM USER_TAB_COLUMNS WHERE TABLE_NAME = ? AND COLUMN_NAME = ?",
                    table, column);
                if (rows.isEmpty()) {
                    missing.add(table);
                } else if (columnTypeDdl == null) {
                    columnTypeDdl = buildColumnTypeDdl(rows.get(0));
                }
            } catch (Exception e) {
                // 카탈로그 조회 실패(권한/연결 등) — 해당 후보만 조용히 건너뛰고 계속
            }
        }
        if (missing.isEmpty()) return null; // 후보 테이블 모두 컬럼 보유 — 이 진단은 해당 없음

        // 후보 테이블 중 컬럼을 보유한 곳이 하나도 없으면(이번 케이스처럼 진짜 원인 테이블만
        // 후보로 남은 경우), 스키마 전체에서 같은 이름의 컬럼을 하나 더 찾아 타입 템플릿으로 쓴다
        // — 이 ERP는 *_EMP_NO류 컬럼을 여러 테이블에서 동일한 정의로 재사용하는 관례가 있다.
        if (columnTypeDdl == null) {
            try {
                java.util.List<java.util.Map<String, Object>> rows = jdbc.queryForList(
                    "SELECT DATA_TYPE, DATA_LENGTH, DATA_PRECISION, DATA_SCALE, CHAR_USED " +
                    "FROM USER_TAB_COLUMNS WHERE COLUMN_NAME = ? AND ROWNUM = 1",
                    column);
                if (!rows.isEmpty()) columnTypeDdl = buildColumnTypeDdl(rows.get(0));
            } catch (Exception e) {
                // 조회 실패 — DDL 제안 없이 진단 문장만 남긴다
            }
        }

        StringBuilder sb = new StringBuilder();
        for (String table : missing) {
            if (sb.length() > 0) sb.append('\n');
            sb.append("[DB 확인] ").append(table).append(" 테이블에 '").append(column).append("' 컬럼이 존재하지 않습니다.");
        }
        if (columnTypeDdl != null) {
            for (String table : missing) {
                sb.append(' ')
                  .append("ALTER TABLE ").append(table.toUpperCase())
                  .append(" ADD ").append(column.toUpperCase())
                  .append(' ').append(columnTypeDdl.toUpperCase()).append(';');
            }
        }
        return sb.toString();
    }

    /** USER_TAB_COLUMNS 한 행의 타입 정보를 Oracle DDL 타입 문자열("VARCHAR2(21 BYTE)", "NUMBER(10,2)" 등)로 변환 */
    private String buildColumnTypeDdl(java.util.Map<String, Object> col) {
        String dataType = String.valueOf(col.get("DATA_TYPE"));
        Object len = col.get("DATA_LENGTH");
        if ("VARCHAR2".equalsIgnoreCase(dataType) || "CHAR".equalsIgnoreCase(dataType) || "NVARCHAR2".equalsIgnoreCase(dataType)) {
            Object charUsed = col.get("CHAR_USED");
            String unit = "B".equals(charUsed) ? " BYTE" : "C".equals(charUsed) ? " CHAR" : "";
            return dataType.toUpperCase() + "(" + len + unit + ")";
        }
        if ("NUMBER".equalsIgnoreCase(dataType)) {
            Object precision = col.get("DATA_PRECISION");
            if (precision == null) return "NUMBER";
            Object scale = col.get("DATA_SCALE");
            boolean hasScale = scale != null && !"0".equals(String.valueOf(scale));
            return "NUMBER(" + precision + (hasScale ? "," + scale : "") + ")";
        }
        if ("DATE".equalsIgnoreCase(dataType) || dataType.toUpperCase().startsWith("TIMESTAMP")) {
            return dataType.toUpperCase();
        }
        return dataType.toUpperCase() + (len != null ? "(" + len + ")" : "");
    }

    /**
     * URL(예: /mis/pur/pur0910/getList.do)로부터 sqlmap namespace(mis.pur.pur0910)와
     * statementId(getList)를 추정하고, classpath의 sqlmap XML들을 스캔해 그 문(statement)
     * 본문에서 지정된 별칭+컬럼 조합이 실제로 가리키는 테이블명을 수집한다.
     */
    private Set<String> findCandidateTables(String url, String alias, String column) {
        Set<String> tables = new LinkedHashSet<>();
        if (url == null || url.isEmpty()) return tables;

        String path = url.replaceAll("^https?://[^/]+", "").replaceAll("\\?.*$", "");
        if (path.startsWith("/")) path = path.substring(1);
        if (path.endsWith(".do")) path = path.substring(0, path.length() - 3);
        String[] segs = path.split("/");
        if (segs.length < 2) return tables;
        String statementId = segs[segs.length - 1];
        String namespace   = String.join(".", Arrays.copyOf(segs, segs.length - 1));

        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath*:cres/sqlmap/**/*.xml");
            for (Resource res : resources) {
                String content;
                try (InputStream is = res.getInputStream()) {
                    content = StreamUtils.copyToString(is, StandardCharsets.UTF_8);
                } catch (IOException e) {
                    continue;
                }
                if (!content.contains("namespace=\"" + namespace + "\"")) continue;

                String block = extractStatementBlock(content, statementId);
                if (block == null) continue;

                tables.addAll(extractAliasTables(block, alias, column));
            }
        } catch (IOException e) {
            // 리소스 스캔 실패 — 후보 없음으로 처리
        }
        return tables;
    }

    /** id="statementId"를 감싸는 가장 가까운 &lt;select|insert|update|delete&gt;...&lt;/태그&gt; 블록 텍스트를 추출 */
    private String extractStatementBlock(String xmlContent, String statementId) {
        String idAttr = "id=\"" + statementId + "\"";
        int idPos = xmlContent.indexOf(idAttr);
        if (idPos < 0) return null;

        int bestTagStart = -1;
        String bestTagName = null;
        for (String tag : STMT_TAGS) {
            int p = xmlContent.lastIndexOf("<" + tag, idPos);
            if (p > bestTagStart) { bestTagStart = p; bestTagName = tag; }
        }
        if (bestTagStart < 0) return null;

        String closeTag = "</" + bestTagName + ">";
        int blockEnd = xmlContent.indexOf(closeTag, idPos);
        if (blockEnd < 0) return null;
        return xmlContent.substring(bestTagStart, blockEnd + closeTag.length());
    }

    /**
     * SQL 텍스트에서 "별칭.컬럼"이 실제로 가리키는 테이블(들)을 찾는다.
     * 단순히 "FROM/JOIN 테이블 별칭" 패턴을 전부 모으면, 같은 별칭 문자(A 등)가 서로 다른
     * 서브쿼리에서 재사용될 때(예: 메인 쿼리는 alias A=PUR_CHEAP_RQST_MST, 그 안의 중첩
     * IN(SELECT...FROM HRM_DEPT A...) 서브쿼리는 별개 스코프에서 alias A=HRM_DEPT) 실제로는
     * 전혀 참조되지 않는 테이블까지 후보에 잘못 섞인다.
     * 그래서 괄호 깊이를 계산해, "별칭.컬럼" 참조가 등장하는 지점과 "같은 깊이"에 있는 가장
     * 가까운 FROM/JOIN 바인딩만 그 참조의 실제 테이블로 채택한다 — SELECT 목록이 자신의 FROM절
     * 보다 앞에 오는 일반적인 SQL 어순(별칭.컬럼이 FROM보다 텍스트상 앞서는 경우)도 깊이가
     * 같으면 거리로 매칭되므로 올바르게 처리된다.
     */
    private Set<String> extractAliasTables(String sql, String alias, String column) {
        Set<String> result = new LinkedHashSet<>();

        int[] depthBefore = new int[sql.length() + 1];
        int depth = 0;
        for (int i = 0; i < sql.length(); i++) {
            depthBefore[i] = depth;
            char c = sql.charAt(i);
            if (c == '(') depth++;
            else if (c == ')') depth--;
        }
        depthBefore[sql.length()] = depth;

        Pattern bindPattern = Pattern.compile(
            "(?:FROM|JOIN)\\s+([A-Za-z_][A-Za-z0-9_]*)\\s+" + Pattern.quote(alias) + "\\b",
            Pattern.CASE_INSENSITIVE);
        java.util.List<Integer> bindPos   = new java.util.ArrayList<>();
        java.util.List<Integer> bindDepth = new java.util.ArrayList<>();
        java.util.List<String>  bindTable = new java.util.ArrayList<>();
        Matcher bm = bindPattern.matcher(sql);
        while (bm.find()) {
            bindPos.add(bm.start());
            bindDepth.add(depthBefore[bm.start()]);
            bindTable.add(bm.group(1).toUpperCase());
        }
        if (bindPos.isEmpty()) return result;

        Pattern refPattern = Pattern.compile(
            Pattern.quote(alias) + "\\s*\\.\\s*" + Pattern.quote(column) + "\\b",
            Pattern.CASE_INSENSITIVE);
        Matcher rm = refPattern.matcher(sql);
        boolean anyRef = false;
        while (rm.find()) {
            anyRef = true;
            int refPos   = rm.start();
            int refDepth = depthBefore[refPos];
            int bestIdx  = -1;
            int bestDist = Integer.MAX_VALUE;
            for (int i = 0; i < bindPos.size(); i++) {
                if (bindDepth.get(i) != refDepth) continue;
                int dist = Math.abs(bindPos.get(i) - refPos);
                if (dist < bestDist) { bestDist = dist; bestIdx = i; }
            }
            if (bestIdx >= 0) result.add(bindTable.get(bestIdx));
        }

        // "별칭.컬럼" 참조를 하나도 못 찾았으면(정규식이 실제 표현과 다른 경우 등) 안전하게
        // 폴백 — 모든 바인딩 후보를 반환해서 최소한 진단 자체가 누락되지 않게 한다.
        if (!anyRef) {
            result.addAll(bindTable);
        }
        return result;
    }
}
