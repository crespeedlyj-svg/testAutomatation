package cres.pss.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * 메뉴 경로 조회 DAO
 * SQL은 MenuResolveMapper.xml (namespace="cres.common.web.MenuResolveDao") 에서 관리
 */
@Repository
public class MenuResolveDao {

    private static final String NS = "cres.pss.service.MenuResolveDao.";

    @Autowired
    @Qualifier("sqlSessionTemplate")
    private SqlSession sqlSession;

    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;

    private JdbcTemplate jdbc;

    @PostConstruct
    public void init() {
        this.jdbc = new JdbcTemplate(dataSource);
    }

    /**
     * SYS_PGM_MGT에 pgmId(또는 noSuffix 변형)가 등록되어 있는지 확인.
     * @return 등록된 PGM_ID, 없으면 null
     */
    public String findPgmId(String pgmId, String noSuffix) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("pgmId",    pgmId    == null ? "" : pgmId.toUpperCase().trim());
        p.put("noSuffix", noSuffix == null ? "" : noSuffix.toUpperCase().trim());
        System.out.println("[MenuResolveDao] findPgmId 호출 — pgmId=" + p.get("pgmId") + ", noSuffix=" + p.get("noSuffix"));
        return sqlSession.selectOne(NS + "findPgmId", p);
    }

    /**
     * SYS_PGM_ROLE에서 pgmId에 매핑된 역할명 목록을 반환.
     * @return ROLE_NM 목록 (없으면 빈 리스트)
     */
    public List<String> findRoles(String pgmId) {
        String upperPgmId = pgmId == null ? "" : pgmId.toUpperCase().trim();
        System.out.println("[MenuResolveDao] findRoles 호출 — pgmId=" + upperPgmId);
        List<String> result = sqlSession.selectList(NS + "findRoles", upperPgmId);
        return result != null ? result : new ArrayList<>();
    }

    /**
     * 역할 상세 조회: ROLE_NM + WRT_YN/MOD_YN/DEL_YN 포함.
     * 담당자(쓰기권한) vs 일반사용자(읽기전용) 판별에 사용.
     * @return [{ROLE_ID, ROLE_NM, WRT_YN, MOD_YN, DEL_YN}] 목록 (없으면 빈 리스트)
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> findRolesDetail(String pgmId) {
        String upperPgmId = pgmId == null ? "" : pgmId.toUpperCase().trim();
        System.out.println("[MenuResolveDao] findRolesDetail 호출 — pgmId=" + upperPgmId);
        List<Map<String, Object>> result = sqlSession.selectList(NS + "findRolesDetail", upperPgmId);
        return result != null ? result : new ArrayList<>();
    }

    /**
     * SYS_MENU_MGT 전체 메뉴 트리를 반환 (GNB~리프, USE_YN='Y', lvl 2~4).
     * JDBC 직접 실행 (MyBatis 캐시 문제 회피).
     */
    public List<Map<String, Object>> getMenuTree() {
        String sql =
            "SELECT MENU_ID, MENU_NM, UPP_MENU_ID, LVL, PGM_ID " +
            "  FROM SYS_MENU_MGT " +
            " WHERE USE_YN = 'Y' " +
            "   AND CLS_CD NOT IN ('QUK', 'MAN') " +
            "   AND LVL BETWEEN 2 AND 4 " +
            " START WITH UPP_MENU_ID = 'M_ROOT' " +
            "CONNECT BY PRIOR MENU_ID = UPP_MENU_ID " +
            " ORDER SIBLINGS BY MENU_ID";
        return jdbc.queryForList(sql);
    }

    /**
     * SYS_MENU_MGT에서 pgmId에 해당하는 리프 메뉴의 MENU_ID를 반환.
     * @return MENU_ID (예: 'M_MIS_01_03_01'), 없으면 null
     */
    public String findMenuId(String pgmId, String noSuffix) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("pgmId",    pgmId    == null ? "" : pgmId.toUpperCase().trim());
        p.put("noSuffix", noSuffix == null ? "" : noSuffix.toUpperCase().trim());
        System.out.println("[MenuResolveDao] findMenuId 호출 — pgmId=" + p.get("pgmId"));
        return sqlSession.selectOne(NS + "findMenuId", p);
    }

    /**
     * SYS_MENU_MGT에서 pgmId 기준 계층 경로(루트→리프 순)의 메뉴명 목록을 반환.
     * @return "GNB > Group > Menu" 형태로 조인할 메뉴명 리스트 (없으면 빈 리스트)
     */
    public List<String> findMenuPath(String pgmId, String noSuffix) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("pgmId",    pgmId    == null ? "" : pgmId.toUpperCase().trim());
        p.put("noSuffix", noSuffix == null ? "" : noSuffix.toUpperCase().trim());
        System.out.println("[MenuResolveDao] findMenuPath 호출 — pgmId=" + p.get("pgmId") + ", noSuffix=" + p.get("noSuffix"));
        List<String> result = sqlSession.selectList(NS + "findMenuPath", p);
        return result != null ? result : new ArrayList<>();
    }

    /**
     * SYS_PGM_USER에서 pgmId에 ROLE_YN=Y로 등록된 사용자를 최대 5명 반환.
     * @return USER_ID, USER_NM 맵 목록 (없으면 빈 리스트)
     */
    public List<Map<String, Object>> findUsersForPgm(String pgmId) {
        String upperPgmId = pgmId == null ? "" : pgmId.toUpperCase().trim();
        System.out.println("[MenuResolveDao] findUsersForPgm 호출 — pgmId=" + upperPgmId);
        List<Map<String, Object>> result = sqlSession.selectList(NS + "findUsersForPgm", upperPgmId);
        return result != null ? result : new ArrayList<>();
    }
}
