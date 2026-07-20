package cres.pss.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 테스트 통과 현황 집계 및 통과 규칙 검증 서비스 (structure.md §2.1).
 *
 * <p>통과 규칙: 개발자 → PL → 사용자 순서 강제 (앞 단계 미통과 시 뒤 단계 통과 불가)
 * <p>대상 테이블: AI_TC_PASS_MGT
 */
@Service
public class TestSummaryService {

    @Autowired
    private TestSummaryDao testSummaryDao;

    /**
     * testType('unit' 또는 'integ')별 통과 현황 집계 결과를 반환한다.
     *
     * @return Map { total, devPass, plPass, userPass, fail, rows: List<Map> }
     */
    public Map<String, Object> getSummary(String testType) {
        List<Map<String, Object>> rows = testSummaryDao.selectPassList(testType);

        int devPass  = 0;
        int plPass   = 0;
        int userPass = 0;

        for (Map<String, Object> row : rows) {
            if ("Y".equals(row.get("devPass")))  devPass++;
            if ("Y".equals(row.get("plPass")))   plPass++;
            if ("Y".equals(row.get("userPass"))) userPass++;
        }

        int total = rows.size();
        int fail  = total - devPass;   // 개발자도 미통과 = 미통과

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("total",    total);
        result.put("devPass",  devPass);
        result.put("plPass",   plPass);
        result.put("userPass", userPass);
        result.put("fail",     fail);
        result.put("rows",     rows);
        return result;
    }

    /**
     * 단일 시나리오에 대해 통과 단계를 기록한다.
     * 규칙: 개발자 미통과 상태에서 PL/사용자 통과 시도 시 IllegalStateException.
     *
     * @param scenarioId 시나리오 ID
     * @param testType   'unit' | 'integ'
     * @param passLevel  'DEV' | 'PL' | 'USER'
     * @param passYn     'Y' | 'N'
     */
    public void updatePass(String scenarioId, String testType,
                           String passLevel, String passYn) {
        Map<String, Object> current = testSummaryDao.selectPassBySid(scenarioId, testType);

        if ("Y".equals(passYn)) {
            validatePassOrder(passLevel, current);
        }

        Map<String, Object> param = new LinkedHashMap<>();
        param.put("scenarioId", scenarioId);
        param.put("testType",   testType);
        param.put("passLevel",  passLevel);
        param.put("passYn",     passYn);

        if (current == null) {
            testSummaryDao.insertPass(param);
        } else {
            testSummaryDao.updatePass(param);
        }
    }

    /**
     * 개발자 → PL → 사용자 순서 강제 검증.
     */
    private void validatePassOrder(String passLevel, Map<String, Object> current) {
        if (current == null) {
            if ("PL".equals(passLevel) || "USER".equals(passLevel)) {
                throw new IllegalStateException("개발자 통과 후 PL/사용자 통과를 기록할 수 있습니다.");
            }
            return;
        }
        if ("PL".equals(passLevel) && !"Y".equals(current.get("devPass"))) {
            throw new IllegalStateException("개발자 통과 후 PL 통과를 기록할 수 있습니다.");
        }
        if ("USER".equals(passLevel) && !"Y".equals(current.get("plPass"))) {
            throw new IllegalStateException("PL 통과 후 사용자 통과를 기록할 수 있습니다.");
        }
    }

    private static Object firstNonNull(Map<String, Object> m, String... keys) {
        for (String k : keys) {
            Object v = m.get(k);
            if (v != null) return v;
        }
        return null;
    }

    /**
     * 사유(REMARK) 수정 — result.md §5.3
     */
    public void updateRemark(String scenarioId, String testType, String remark) {
        testSummaryDao.updateRemark(scenarioId, testType, remark);
    }

    /**
     * 시나리오 목록을 PSS_TC_PASS_MGT에 일괄 등록(신규만 INSERT, 기존은 skip).
     */
    public void registerScenarios(List<Map<String, Object>> scenarios, String testType) {
        for (Map<String, Object> s : scenarios) {
            String sid = (String) s.get("scenarioId");
            if (sid == null || sid.isEmpty()) continue;
            Map<String, Object> exist = testSummaryDao.selectPassBySid(sid, testType);
            if (exist == null) {
                Map<String, Object> param = new LinkedHashMap<>();
                param.put("scenarioId", sid);
                param.put("testType",   testType);
                param.put("screenName", firstNonNull(s, "화면명", "screenName", "displayName"));
                param.put("testName",   firstNonNull(s, "테스트명", "testName"));
                param.put("devPass",    "N");
                param.put("plPass",     "N");
                param.put("userPass",   "N");
                testSummaryDao.insertPass(param);
            }
        }
    }
}
