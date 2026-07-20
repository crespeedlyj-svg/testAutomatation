package cres.pss.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * AI_TC_PASS_MGT 테이블 CRUD (structure.md §2.1).
 *
 * <p>테이블 구조 (AI_TC_PASS_MGT):
 * <pre>
 *   SCENARIO_ID   VARCHAR2(200) PK  - 시나리오 고유 ID
 *   TEST_TYPE     VARCHAR2(10)  PK  - 'unit' | 'integ'
 *   SCREEN_NAME   VARCHAR2(200)     - 화면명
 *   TEST_NAME     VARCHAR2(500)     - 테스트명
 *   DEV_PASS      CHAR(1)           - 개발자 통과 Y/N
 *   PL_PASS       CHAR(1)           - PL 통과 Y/N
 *   USER_PASS     CHAR(1)           - 사용자 통과 Y/N
 *   LAST_PASS_DATE DATE             - 최종 통과일
 *   REMARK        VARCHAR2(500)     - 비고
 *   REG_DT        DATE              - 등록일
 *   UPD_DT        DATE              - 수정일
 * </pre>
 *
 * <p>MyBatis namespace: cres.pss.service.TestSummaryDao
 */
@Repository
public class TestSummaryDao {

    private static final String NS = "cres.pss.service.TestSummaryDao.";

    @Autowired
    private SqlSession sqlSession;

    /**
     * testType별 전체 통과 목록 조회.
     */
    public List<Map<String, Object>> selectPassList(String testType) {
        return sqlSession.selectList(NS + "selectPassList", testType);
    }

    /**
     * 시나리오 ID + testType 으로 단건 조회.
     *
     * @return 없으면 null
     */
    public Map<String, Object> selectPassBySid(String scenarioId, String testType) {
        java.util.Map<String, Object> param = new java.util.LinkedHashMap<>();
        param.put("scenarioId", scenarioId);
        param.put("testType",   testType);
        return sqlSession.selectOne(NS + "selectPassBySid", param);
    }

    /**
     * 신규 행 등록.
     * param 키: scenarioId, testType, screenName, testName, devPass, plPass, userPass
     */
    public void insertPass(Map<String, Object> param) {
        sqlSession.insert(NS + "insertPass", param);
    }

    /**
     * 통과 단계 갱신.
     * param 키: scenarioId, testType, passLevel (DEV|PL|USER), passYn (Y|N)
     */
    public void updatePass(Map<String, Object> param) {
        sqlSession.update(NS + "updatePass", param);
    }

    /**
     * 비고 수정.
     */
    public void updateRemark(String scenarioId, String testType, String remark) {
        java.util.Map<String, Object> param = new java.util.LinkedHashMap<>();
        param.put("scenarioId", scenarioId);
        param.put("testType",   testType);
        param.put("remark",     remark);
        sqlSession.update(NS + "updateRemark", param);
    }

    /**
     * 단건 삭제.
     */
    public void deletePass(String scenarioId, String testType) {
        java.util.Map<String, Object> param = new java.util.LinkedHashMap<>();
        param.put("scenarioId", scenarioId);
        param.put("testType",   testType);
        sqlSession.delete(NS + "deletePass", param);
    }
}
