package cres.pss.service;

import java.text.SimpleDateFormat;
import java.util.*;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

/**
 * PSS_TEST_SCEN_GRP / PSS_TEST_SCEN 테이블 DAO
 * SQL은 ScenarioMapper.xml (namespace="cres.pss.service.ScenarioDao") 에서 관리
 */
@Repository
public class ScenarioDao {

    private static final String NS = "cres.pss.service.ScenarioDao.";

    @Autowired
    @Qualifier("sqlSessionTemplate")
    private SqlSession sqlSession;

    // ── GRP_ID 생성 ──────────────────────────────────────────────────────────
    public String newGrpId(String prefix) {
        String ts = new SimpleDateFormat("yyyyMMddHHmmss").format(new java.util.Date());
        String p  = (prefix != null && !prefix.trim().isEmpty())
                    ? prefix.trim().toUpperCase() : "DEF";
        return p + "_" + ts;
    }

    // ── PSS_TEST_SCEN_GRP INSERT ───────────────────────────────────────────────────
    public void insertScenarioGroup(String grpId, int scenCnt, String user) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("grpId",    grpId);
        p.put("scenCnt",  scenCnt);
        p.put("cratUser", user);
        sqlSession.insert(NS + "insertScenarioGroup", p);
    }

    // ── PSS_TEST_SCEN_GRP UPDATE ──────────────────────────────────────────────────
    public void updateScenarioGroup(String grpId, int scenCnt) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("grpId",   grpId);
        p.put("scenCnt", scenCnt);
        sqlSession.update(NS + "updateScenarioGroup", p);
    }

    // ── AI_SCEN INSERT ───────────────────────────────────────────────────────
    public void insertScenario(String grpId, Map<String, Object> s, int seq) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("grpId",      grpId);
        p.put("scenId",     str(s, "scenarioId"));
        p.put("seq",        seq);
        p.put("testType",   str(s, "testType"));
        p.put("sourceNm",   str(s, "sourceName"));
        p.put("screenId",   str(s, "screenId"));
        p.put("displayNm",  str(s, "displayName"));
        p.put("origin",     str(s, "origin"));
        p.put("gnbNm",      str(s, "gnbName"));
        p.put("groupNm",    str(s, "groupName"));
        p.put("menuNm",     str(s, "menuName"));
        p.put("testNm",     str(s, "testName"));
        p.put("url",        str(s, "url"));
        p.put("method",     str(s, "method"));
        p.put("preCond",    str(s, "preCondition"));
        p.put("exptRslt",   str(s, "expectedResult"));
        p.put("rltnType",   str(s, "relationType"));
        p.put("crudType",   str(s, "crudType"));
        p.put("hasGw",      Boolean.TRUE.equals(s.get("hasGw")) ? "Y" : "N");
        p.put("afftPgms",   listToJson(s.get("affectedPrograms")));
        p.put("inputDsId",  str(s, "inputDsId"));
        p.put("inputCols",  listToJson(s.get("inputCols")));
        p.put("outputDsId", str(s, "outputDsId"));
        p.put("outputCols", listToJson(s.get("outputCols")));
        p.put("testData",       str(s, "testData"));
        p.put("testRslt",       str(s, "testResult"));
        p.put("rmrk",           str(s, "remark"));
        p.put("confirmer",      str(s, "confirmer"));
        p.put("judgmentRslt",   str(s, "judgmentResult"));
        p.put("plConfirm",      str(s, "plConfirm"));
        p.put("reason",         str(s, "reason"));
        p.put("userConfirm",    str(s, "userConfirm"));
        sqlSession.insert(NS + "insertScenario", p);
    }

    // ── AI_SCEN DELETE (그룹 전체) ───────────────────────────────────────────
    public void deleteScenariosByGroup(String grpId) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("grpId", grpId);
        sqlSession.delete(NS + "deleteScenariosByGroup", p);
    }

    // ── PSS_TEST_SCEN_GRP 목록 조회 ───────────────────────────────────────────────
    public List<Map<String, Object>> selectScenarioGroups() {
        return sqlSession.selectList(NS + "selectScenarioGroups");
    }

    // ── AI_SCEN 그룹별 조회 ─────────────────────────────────────────────────
    public List<Map<String, Object>> selectScenariosByGroup(String grpId) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("grpId", grpId);
        return sqlSession.selectList(NS + "selectScenariosByGroup", p);
    }

    // ── DB 연결 테스트 ───────────────────────────────────────────────────────
    public Map<String, Object> pingDb() {
        Map<String, Object> r = new LinkedHashMap<>();
        try {
            sqlSession.selectOne(NS + "pingDual");
            r.put("connected", true);

            Integer cnt = sqlSession.selectOne(NS + "countScenGrpTable");
            boolean tableExists = cnt != null && cnt > 0;
            r.put("tableExists", tableExists);
            r.put("message", tableExists
                ? "DB 연결 성공 ✅  PSS_TEST_SCEN_GRP 테이블 확인됨"
                : "DB 연결 성공 ✅  단, PSS_TEST_SCEN_GRP 테이블 없음 — DDL 실행 필요");
        } catch (Exception e) {
            r.put("connected",   false);
            r.put("tableExists", false);
            r.put("message",     "DB 연결 실패: " + e.getMessage());
        }
        return r;
    }

    // ── private helpers ──────────────────────────────────────────────────────

    private String str(Map<String, Object> m, String key) {
        Object v = m.get(key);
        return v != null ? String.valueOf(v) : "";
    }

    @SuppressWarnings("unchecked")
    private String listToJson(Object val) {
        if (val == null) return "[]";
        if (val instanceof String) {
            String sv = (String) val;
            return sv.isEmpty() ? "[]" : sv;
        }
        if (!(val instanceof List)) return "[]";
        List<Object> list = (List<Object>) val;
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(JsonHelper.jsonStr(String.valueOf(list.get(i))));
        }
        return sb.append("]").toString();
    }
}
