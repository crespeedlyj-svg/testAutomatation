package cres.pss.service;

import java.io.File;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.*;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * DB 메뉴 경로 조회 서비스
 *
 * 책임:
 *  ① displayName → pgmId 정규화
 *  ② SYS_PGM_MGT 등록 확인
 *  ③ SYS_MENU_MGT 정방향(루트→리프) 경로 조회  ← 핵심
 *  ④ 팝업 화면: nxui xfdl 역추적으로 최상위 부모 탐색
 *  ⑤ 경로 문자열 → gnbName/groupName/subCategory/menuName 분해
 *
 * ── 캐시 전략 (메모리, 서버 생존 기간 유지) ──────────────────────────────────
 *  pgmMgtCache      : checkPgmMgt() DB 조회 결과.  pgmId(대문자) → registeredId | CACHE_MISS
 *  menuPathCache    : getMenuPath() DB 조회 결과.  pgmId(대문자) → path | CACHE_MISS
 *  popupCallerIndex : nxui 역인덱스.  targetPgmId(대문자) → [callerPgmId, ...]
 *                     최초 buildMenuMap() 호출 시 전체 .xfdl 파일을 한 번만 스캔.
 *                     이후 findPopupCallerInXfdl() 은 인덱스 O(1) 조회로 동작.
 */
@Service
public class MenuResolverService {

    @Autowired
    MenuResolveDao menuResolveDao;

    // ── 캐시 ──────────────────────────────────────────────────────────────────

    /**
     * ConcurrentHashMap 은 null 값을 허용하지 않으므로 "없음"을 나타내는 센티넬.
     * 공백 한 글자 — 실제 PGM_ID/경로와 충돌 없음.
     */
    private static final String CACHE_MISS = " ";

    /** pgmId(대문자) → 등록된 PGM_ID (없으면 CACHE_MISS) */
    private final Map<String, String> pgmMgtCache   = new ConcurrentHashMap<>();

    /** pgmId(대문자) → "GNB > Group > Menu" 경로 (없으면 CACHE_MISS) */
    private final Map<String, String> menuPathCache  = new ConcurrentHashMap<>();

    /** pgmId(대문자) → SYS_PGM_ROLE.ROLE_NM 목록 */
    private final Map<String, List<String>> roleCache = new ConcurrentHashMap<>();

    /** pgmId(대문자) → 역할 상세 [{ROLE_ID, ROLE_NM, WRT_YN, MOD_YN, DEL_YN}] */
    private final Map<String, List<Map<String, Object>>> roleDetailCache = new ConcurrentHashMap<>();

    /** pgmId(대문자) → SYS_MENU_MGT 리프 노드 MENU_ID (없으면 CACHE_MISS) */
    private final Map<String, String> menuIdCache = new ConcurrentHashMap<>();

    /**
     * 팝업 역인덱스: targetPgmId(대문자) → 이 팝업을 호출하는 파일명(대문자) 목록.
     * null = 아직 미빌드. buildMenuMap() 또는 findPopupCallerInXfdl() 최초 호출 시 빌드.
     */
    private volatile Map<String, List<String>> popupCallerIndex = null;

    /** 인덱스를 빌드한 nxuiBase — 경로가 달라지면 재빌드 */
    private volatile String lastNxuiBase = null;

    /** 동시 빌드 방지 락 (synchronized 블록 대상) */
    private final Object indexLock = new Object();

    // ── 공개 API ─────────────────────────────────────────────────────────────

    /**
     * checkedFiles 각각에 대해 메뉴 경로를 조회하여 Map으로 반환.
     * @return {PGM_ID(대문자) → "GNB > Group > Menu"} — 발견된 것만 포함
     */
    public Map<String, String> buildMenuMap(List<Map<String, Object>> checkedFiles,
                                             HttpServletRequest request,
                                             java.io.PrintWriter writer) {
        return buildMenuMap(checkedFiles, FilePathHelper.getNxuiBase(request), writer);
    }

    public Map<String, String> buildMenuMap(List<Map<String, Object>> checkedFiles,
                                             String nxuiBase,
                                             java.io.PrintWriter writer) {
        Map<String, String> map = new LinkedHashMap<>();
        System.out.println("[MenuResolverService] buildMenuMap 진입 — checkedFiles=" + checkedFiles.size()
            + ", menuResolveDao=" + (menuResolveDao != null ? "주입됨" : "null ← DAO 미주입!"));
        if (menuResolveDao == null) {
            System.out.println("[DB] ⚠ MenuResolveDao 미주입 — 메뉴 조회 불가.");
            System.out.println("[MenuResolverService] !! menuResolveDao == null → 메뉴/역할 조회 전부 skip !!");
            return map;
        }

        // ── 팝업 역인덱스 사전 빌드 (최초 1회, 이후 재사용) ─────────────────
        ensurePopupCallerIndex(nxuiBase, writer);

        for (Map<String, Object> file : checkedFiles) {
            String displayName = (String) file.get("displayName");
            if (displayName == null) continue;

            // xfdl 파일만 메뉴 조회 대상 — .java/.class 등 비xfdl 파일은 건너뜀
            String rawName = displayName.replaceAll("\\s*\\([^)]+\\)\\s*$", "").trim().toLowerCase();
            boolean isXfdl = rawName.endsWith(".xfdl") || rawName.endsWith(".xfdl.js")
                          || !rawName.contains(".");  // 확장자 없는 bare pgmId 허용
            if (!isXfdl) {
                System.out.println("[DB] 건너뜀 (xfdl 아님): " + displayName);
                continue;
            }

            String pgmId      = extractPgmId(displayName);         // 메뉴 DB 조회용 (말미 단일자 추가 제거)
            String normalized = normalizeSourceName(displayName);   // 화면 파일 탐색용
            String noSuffix   = pgmId.replaceAll("[A-Za-z]$", ""); // PUR_5110M → PUR_5110

            System.out.println("[DB] 조회: " + displayName + " → pgmId=" + pgmId
                    + (normalized.equals(pgmId) ? "" : ", normalized=" + normalized));

            // ── ① SYS_PGM_MGT 등록 여부 확인 ─────────────────────────────
            String registeredId = checkPgmMgt(pgmId, writer);
            if (registeredId == null && !normalized.equals(pgmId))
                registeredId = checkPgmMgt(normalized, writer);

            // Controller.java 기반 pgmId(말미 알파벳 없음)는 'M' suffix 시도
            // 예: "PUR_0010" → "PUR_0010M"
            if (registeredId == null && !pgmId.matches(".*[A-Za-z]$")) {
                String withM = pgmId + "M";
                registeredId = checkPgmMgt(withM, writer);
                if (registeredId != null) {
                    System.out.println("  └ 재시도(+M): " + pgmId + " → " + withM);
                    pgmId      = withM;
                    normalized = withM;
                    noSuffix   = pgmId.replaceAll("[A-Za-z]$", "");
                }
            }

            if (registeredId == null) {
                // 미등록 = 팝업 화면일 가능성 → 호출 부모 역추적 (인덱스 O(1) 조회)
                System.out.println("  └ SYS_PGM_MGT 미등록 → 팝업 부모 역추적");
                String topParentId = findTopParentPgmId(pgmId, nxuiBase, writer);
                if (!topParentId.equals(pgmId)) {
                    String parentPath = getMenuPath(topParentId, writer);
                    if (parentPath != null) {
                        System.out.println("  ✓ (팝업 부모) " + topParentId + " → " + parentPath);
                        String tagged = parentPath + " (팝업)";
                        map.put(pgmId,      tagged);
                        if (!normalized.equals(pgmId)) map.put(normalized, tagged);
                        if (!noSuffix.equals(pgmId))   map.put(noSuffix,   tagged);
                    } else {
                        System.out.println("  └ ⚠ 부모(" + topParentId + ")도 메뉴 미연결");
                    }
                } else {
                    System.out.println("  └ ⚠ 팝업 부모 없음: " + pgmId);
                }
                continue;
            }
            System.out.println("  ✓ SYS_PGM_MGT 확인: " + registeredId);

            // ── ② 메뉴 경로 조회 (3가지 pgmId 변형 시도) ──────────────────
            String path = getMenuPath(pgmId, writer);

            if (path == null && !normalized.equals(pgmId)) {
                System.out.println("  └ 재시도: normalized=" + normalized);
                path = getMenuPath(normalized, writer);
            }
            if (path == null && !noSuffix.equals(pgmId)) {
                System.out.println("  └ 재시도: noSuffix=" + noSuffix);
                path = getMenuPath(noSuffix, writer);
            }

            if (path == null) {
                // SYS_MENU_MGT 미연결 → XFDL 호출 부모 역추적으로 경로 대체 시도
                System.out.println("  └ ⚠ SYS_MENU_MGT 미연결: " + pgmId + " → XFDL 호출 부모 역추적");
                String topParentId = findTopParentPgmId(pgmId, nxuiBase, writer);
                if (!topParentId.equals(pgmId)) {
                    path = getMenuPath(topParentId, writer);
                    if (path != null)
                        System.out.println("  ✓ (XFDL 호출 부모 " + topParentId + ") → " + path);
                    else
                        System.out.println("  └ ⚠ XFDL 호출 부모(" + topParentId + ")도 메뉴 미연결");
                } else {
                    System.out.println("  └ ⚠ XFDL 호출 관계 없음: " + pgmId);
                }
            }
            if (path != null) {
                System.out.println("  ✓ " + pgmId + " → " + path);
                map.put(pgmId,      path);
                if (!normalized.equals(pgmId)) map.put(normalized, path);
                if (!noSuffix.equals(pgmId))   map.put(noSuffix,   path);
                String noSuffixNorm = normalized.replaceAll("[A-Za-z]$", "");
                if (!noSuffixNorm.equals(normalized) && !noSuffixNorm.equals(noSuffix))
                    map.put(noSuffixNorm, path);
            }
        }
        // ── 최종 menuMap 내용 sysout ─────────────────────────────────────────
        System.out.println("[MenuResolverService] buildMenuMap 완료 — 총 " + map.size() + "개 키");
        for (Map.Entry<String, String> e : map.entrySet()) {
            System.out.println("  menuMap[" + e.getKey() + "] = " + e.getValue());
        }
        if (map.isEmpty()) {
            System.out.println("  !! menuMap 이 비어 있음 — 메뉴명이 시나리오에 반영되지 않습니다 !!");
        }
        return map;
    }

    // ── 오버로드 (writer 없이) ────────────────────────────────────────────────
    public Map<String, String> buildMenuMap(List<Map<String, Object>> checkedFiles,
                                             HttpServletRequest request) {
        return buildMenuMap(checkedFiles, request, null);
    }

    // ── 메뉴 경로 → gnb/group/sub/menu 분해 ──────────────────────────────────

    /**
     * menuMap("PGM_ID" → "GNB > Group > [Sub >] Menu") 에서
     * 각 시나리오의 gnbName / groupName / subCategory / menuName 을 채운다.
     *
     * 계층 분해 규칙 (parts 개수 기준):
     *   1개 : menuName=parts[0], 나머지 ""
     *   2개 : gnbName=parts[0],  menuName=parts[1],  groupName="", subCategory=""
     *   3개 : gnbName=parts[0],  groupName=parts[0], subCategory=parts[1], menuName=parts[2]
     *   4개+: gnbName=parts[0],  groupName=parts[1], subCategory=parts[len-2], menuName=parts[len-1]
     *
     * 팝업(" (팝업)" 접미사): 중메뉴까지는 부모 경로 차용, menuName은 화면 자체 screenTitle 유지.
     * 기존값이 있으면 덮어쓰지 않는다 (ScenarioBuilderService 우선).
     */
    public void enrichMenuParts(List<Map<String, Object>> scenarios,
                                 Map<String, String> menuMap, String prefix) {
        // prefix 기반 기본 경로 (menuMap이 비어있으면 defaultPath=null)
        String defaultPath = null;
        if (menuMap != null && !menuMap.isEmpty()) {
            for (Map.Entry<String, String> e : menuMap.entrySet()) {
                if (e.getKey().toUpperCase().startsWith(prefix.toUpperCase())) {
                    defaultPath = e.getValue(); break;
                }
            }
            if (defaultPath == null)
                defaultPath = menuMap.values().iterator().next();
        }

        System.out.println("[enrichMenuParts] 진입 — 시나리오=" + scenarios.size()
            + "건, menuMap=" + (menuMap == null ? "null" : menuMap.size() + "개 키")
            + ", defaultPath=" + defaultPath);

        for (Map<String, Object> s : scenarios) {
            System.out.println("[enrichMenuParts] 시나리오 Map: " + s);
            // pgmId 결정: pgmId → sourceName → scenarioId 순으로 폴백
            String sourceName = str(s, "pgmId");
            if (sourceName.isEmpty()) sourceName = str(s, "sourceName");
            if (sourceName.isEmpty()) {
                // scenarioId에서 추출: UT_PUR_0010M / IT_PUR_0010M → PUR_0010M
                String sid = str(s, "scenarioId");
                sourceName = sid.replaceAll("^(UT|IT|E2E)_", "");
            }
            System.out.println("[enrichMenuParts] lookupKey 후보=" + sourceName);

            // sourceName 정규화: 확장자 제거 + 대문자
            String lookupKey = sourceName.toUpperCase()
                .replaceAll("(?i)\\.XFDL\\.JS$", "")
                .replaceAll("(?i)\\.XFDL$", "")
                .replaceAll("(?i)\\.JAVA$", "");

            // menuMap에서 경로 조회 (없으면 defaultPath, 그것도 없으면 null)
            String path = null;
            if (menuMap != null && !menuMap.isEmpty()) {
                if (sourceName.isEmpty()) {
                    path = defaultPath;
                } else if (menuMap.containsKey(lookupKey)) {
                    path = menuMap.get(lookupKey);
                } else {
                    // 접미 알파벳 제거 버전도 시도 (PUR_0010M → PUR_0010)
                    String keyNoSuffix = lookupKey.replaceAll("[A-Za-z]$", "");
                    if (menuMap.containsKey(keyNoSuffix)) {
                        path = menuMap.get(keyNoSuffix);
                        System.out.println("[enrichMenuParts] noSuffix 히트: \"" + keyNoSuffix + "\" ← " + sourceName);
                    } else {
                        path = null; // DB 미등록 화면 — defaultPath 강제 적용하지 않고 기존 menuName 유지
                        System.out.println("[enrichMenuParts] MISS: sourceName=\"" + sourceName
                            + "\" lookupKey=\"" + lookupKey + "\" → DB 미등록, 기존 menuName 유지"
                            + "  menuMap 키 일부: " + new java.util.ArrayList<>(menuMap.keySet()).subList(0, Math.min(5, menuMap.size())));
                    }
                }
            }

            // 메뉴를 찾지 못한 경우 → 중분류/소분류 "-", 메뉴명 "미사용"
            if (path == null || path.isEmpty()) {
                s.put("gnbName",     "-");
                s.put("groupName",   "-");
                s.put("subCategory", "-");
                s.put("menuName",    "미사용");
                s.put("menuPath",    "");
                System.out.println("[enrichMenuParts] " + sourceName + " → 메뉴 미연결 → 미사용");
                continue;
            }

            boolean isPopup  = path.endsWith("(팝업)");
            String cleanPath = isPopup
                ? path.substring(0, path.length() - 5).trim()
                : path;
            cleanPath = cleanPath.replaceAll("\\s*>\\s*$", "").trim();

            // 경로 분해: MIS > 구매관리 > 구매관리 > 대금지급관리
            //   parts[0] = gnbName  (MIS)
            //   parts[1] = 중분류/groupName  (구매관리)
            //   parts[len-2] = 소분류/subCategory  (구매관리)
            //   parts[len-1] = menuName  (대금지급관리)
            String[] parts = cleanPath.split("\\s*>\\s*");
            int len = parts.length;

            String gnb    = len >= 1 ? parts[0].trim()                                       : "";
            String grp    = len >= 4 ? parts[1].trim()           : (len == 3 ? parts[0].trim() : "");
            String sub    = len >= 4 ? parts[len - 2].trim()     : (len == 3 ? parts[1].trim() : "");
            String menuNm = len >= 1 ? parts[len - 1].trim()     : cleanPath;

            // 팝업: menuName은 화면 자체 title 유지
            if (isPopup && !str(s, "menuName").isEmpty())
                menuNm = str(s, "menuName");

            // DB 경로가 확인된 경우 항상 덮어씀 (Python 기본값보다 DB 값이 우선)
            s.put("gnbName",     gnb);
            s.put("groupName",   grp);
            s.put("subCategory", sub);
            s.put("menuName",    menuNm);
            s.put("menuPath",    cleanPath);

            // SYS_MENU_MGT 리프 MENU_ID 조회 → openMenuById에 직접 사용
            String menuId = getMenuId(lookupKey);
            if (menuId != null && !menuId.isEmpty()) {
                s.put("menuId", menuId);
                System.out.println("[enrichMenuParts] " + sourceName + " → menuId=" + menuId);
            }

            System.out.println("[enrichMenuParts] " + sourceName
                + " → gnb=" + gnb + ", grp=" + grp + ", sub=" + sub
                + ", menuName=" + menuNm + "  (경로: " + cleanPath + ")");
        }
    }

    // ── 역할 조회: SYS_PGM_ROLE ───────────────────────────────────────────────

    /**
     * 각 시나리오의 sourceName(=pgmId)으로 SYS_PGM_USER → SYS_ROLE_MGT 를 조회하여
     * roleNm 필드를 채운다.
     *
     * 역할 결정 규칙:
     *  - 단일 계열(담당자만 OR 일반사용자만) → 해당 역할명 그대로 사용
     *  - 혼재(담당자 + 일반사용자 모두 있음):
     *      · XFDL에서 gfn_chkRight 결과로 UI를 제어(xfdlHasChkright=true)  → 담당자 역할명
     *      · gfn_chkRight 가 UI를 제어하지 않음(xfdlHasChkright=false)      → "일반사용자"
     *
     * WRT_YN='Y' OR MOD_YN='Y' OR DEL_YN='Y' → 담당자 계열
     * 모두 'N' → 일반사용자 계열
     */
    public void enrichRoles(List<Map<String, Object>> scenarios) {
        if (menuResolveDao == null) {
            System.out.println("[enrichRoles] ⚠ menuResolveDao null — DB 조회 불가");
            return;
        }
        System.out.println("[enrichRoles] ============================");
        System.out.println("[enrichRoles] 진입 — 시나리오 " + scenarios.size() + "건");
        for (Map<String, Object> s : scenarios) {
            String sourceName = str(s, "pgmId");
            if (sourceName.isEmpty()) sourceName = str(s, "sourceName");
            if (sourceName.isEmpty()) {
                String sid = str(s, "scenarioId");
                sourceName = sid.replaceAll("^(UT|IT|E2E)_", "");
            }
            String existing = str(s, "roleNm");
            System.out.println("[enrichRoles] 처리: scenarioId=" + str(s, "scenarioId")
                    + " | sourceName=" + sourceName
                    + " | existing roleNm=[" + existing + "]");
            if (sourceName.isEmpty()) {
                System.out.println("[enrichRoles] SKIP — sourceName 없음");
                continue;
            }
            // "개발자" 플레이스홀더이거나 비어있을 때만 DB 조회로 교체
            if (!existing.isEmpty() && !"개발자".equals(existing.trim())) {
                System.out.println("[enrichRoles] SKIP — 이미 roleNm 있음: " + existing);
                continue;
            }

            List<Map<String, Object>> details = findRolesDetailWithCache(sourceName.toUpperCase());
            System.out.println("[enrichRoles] DB 조회 결과: " + sourceName + " → " + details.size() + "건");

            // 담당자 역할: WRT_YN/MOD_YN/DEL_YN 중 하나라도 Y
            List<String> managerRoles = new ArrayList<>();
            for (Map<String, Object> d : details) {
                String roleNm = String.valueOf(d.getOrDefault("ROLE_NM", d.getOrDefault("role_nm", "")));
                String wrtYn  = String.valueOf(d.getOrDefault("WRT_YN", d.getOrDefault("wrt_yn", "N")));
                String modYn  = String.valueOf(d.getOrDefault("MOD_YN", d.getOrDefault("mod_yn", "N")));
                String delYn  = String.valueOf(d.getOrDefault("DEL_YN", d.getOrDefault("del_yn", "N")));
                boolean hasWrite = "Y".equals(wrtYn) || "Y".equals(modYn) || "Y".equals(delYn);
                System.out.println("[enrichRoles]   row: ROLE_NM=" + roleNm
                        + " WRT_YN=" + wrtYn + " MOD_YN=" + modYn + " DEL_YN=" + delYn
                        + " → " + (hasWrite ? "담당자" : "일반"));
                if (hasWrite) managerRoles.add(roleNm);
            }

            // 담당자 역할이 있으면 ROLE_NM 사용, 없으면 일반사용자
            String resolved = !managerRoles.isEmpty()
                    ? String.join(", ", managerRoles)
                    : "일반사용자";

            s.put("roleNm", resolved);
            System.out.println("[enrichRoles] SET " + sourceName + " → " + resolved);
        }
    }

    /**
     * 시나리오 ID / 순번 / 시나리오명 후처리.
     *
     * 규칙:
     *  ① scenarioId  : 같은 sourceName → "TC_" + sourceName 으로 동일하게 부여
     *  ② no (순번)   : sourceName 그룹 내에서 1부터 카운트
     *  ③ screenName  : menuName 값으로 덮어쓴다 (메뉴를 찾은 경우만)
     *
     * enrichMenuParts / enrichRoles 완료 후 호출해야 menuName 이 채워진 상태.
     */
    public void applyScenarioMetadata(List<Map<String, Object>> scenarios) {
        // 순번 카운터: pgmId 키 → seq
        Map<String, Integer> seqMap = new LinkedHashMap<>();

        for (int i = 0; i < scenarios.size(); i++) {
            Map<String, Object> s = scenarios.get(i);
            String src = str(s, "sourceName");
            if (src.isEmpty()) src = str(s, "pgmId");
            String key = src.toUpperCase();

            // ① scenarioId 결정
            String existingSid = str(s, "scenarioId");
            if (existingSid.matches("^(UT|IT|E2E)_.*")) {
                // Python Excel에서 이미 올바른 형식 → 그대로 유지
            } else if (!key.isEmpty()) {
                // nxui 경로: testType 기반으로 UT_ / IT_ prefix 부여
                String testType = str(s, "testType");
                String prefix = "단위".equals(testType) ? "UT" : "IT";
                s.put("scenarioId", prefix + "_" + key);
            }

            // ② no: 전체 고유 번호 (편집 시 행 식별용)
            s.put("no", i + 1);

            // ③ seq: pgmId 그룹 내 순번
            int seq = seqMap.getOrDefault(key, 0) + 1;
            seqMap.put(key, seq);
            s.put("seq", seq);

            // ④ screenName = menuName, testName = menuName (미사용추정 제외)
            String menuName = str(s, "menuName");
            if (!menuName.isEmpty() && !"-".equals(menuName) && !"미사용".equals(menuName)) {
                s.put("screenName", menuName);
                s.put("testName",   menuName);
            }

            System.out.println("[applyScenarioMetadata] " + key
                + " no=" + (i + 1) + ", seq=" + seq
                + ", scenarioId=" + str(s, "scenarioId")
                + ", screenName=" + str(s, "screenName")
                + ", testName=" + str(s, "testName"));
        }
    }

    /**
     * SYS_PGM_ROLE에서 pgmId에 매핑된 역할명 목록을 반환.
     * 결과는 roleCache에 저장. 동일 pgmId 재조회 시 DB 접근 없음.
     */
    public List<String> findRolesWithCache(String pgmId) {
        if (menuResolveDao == null) return new ArrayList<>();
        String upper = pgmId.toUpperCase().trim();

        List<String> cached = roleCache.get(upper);
        if (cached != null) return cached;

        try {
            List<String> result = menuResolveDao.findRoles(upper);
            List<String> roles  = result != null ? result : new ArrayList<>();
            roleCache.put(upper, roles);
            return roles;
        } catch (Exception e) {
            roleCache.put(upper, new ArrayList<>());
            return new ArrayList<>();
        }
    }

    /**
     * SYS_PGM_USER 권한 포함 역할 상세 목록을 반환.
     * 결과는 roleDetailCache 에 저장. 동일 pgmId 재조회 시 DB 접근 없음.
     */
    public List<Map<String, Object>> findRolesDetailWithCache(String pgmId) {
        if (menuResolveDao == null) return new ArrayList<>();
        String upper = pgmId.toUpperCase().trim();

        List<Map<String, Object>> cached = roleDetailCache.get(upper);
        if (cached != null) return cached;

        try {
            List<Map<String, Object>> result = menuResolveDao.findRolesDetail(upper);
            List<Map<String, Object>> roles  = result != null ? result : new ArrayList<>();
            roleDetailCache.put(upper, roles);
            return roles;
        } catch (Exception e) {
            System.out.println("[findRolesDetailWithCache] 오류 [" + upper + "]: " + e.getMessage());
            roleDetailCache.put(upper, new ArrayList<>());
            return new ArrayList<>();
        }
    }

    // ── PGM_ID 정규화 ─────────────────────────────────────────────────────────

    /** xfdl 파일 탐색용: .java/.xfdl 제거 + 대문자 */
    public static String normalizeSourceName(String displayName) {
        String name = displayName.replaceAll("\\s*\\([^)]+\\)\\s*$", "").trim();
        if (name.toLowerCase().endsWith(".java")) {
            name = name.substring(0, name.length() - 5);
            name = name.replaceAll("(?i)(Controller|ServiceImpl|Service|DaoImpl|Dao|Impl)$", "");
        } else if (name.toLowerCase().endsWith(".xfdl.js")) {
            name = name.substring(0, name.length() - 8);
        } else {
            name = name.replaceAll("(?i)\\.xfdl$", "");
        }
        return name.toUpperCase();
    }

    /**
     * 메뉴 DB 조회용 PGM_ID.
     * .java 파일이면 말미 단일 영문자를 추가 제거 (SYS_MENU_MGT는 접미자 없이 저장됨).
     */
    public static String extractPgmId(String displayName) {
        String normalized = normalizeSourceName(displayName);
        String raw = displayName.replaceAll("\\s*\\([^)]+\\)\\s*$", "").trim();
        if (raw.toLowerCase().endsWith(".java"))
            normalized = normalized.replaceAll("[A-Za-z]$", "");
        return normalized.toUpperCase();
    }

    // ── DB 조회: SYS_PGM_MGT ─────────────────────────────────────────────────

    /**
     * SYS_PGM_MGT에 pgmId(또는 말미 단일자 제거 변형)가 USE_YN='Y'로 등록되어 있는지 확인.
     * 결과는 pgmMgtCache 에 저장. 동일 pgmId 재조회 시 DB 접근 없음.
     *
     * @return 실제 등록된 PGM_ID, 없으면 null
     */
    public String checkPgmMgt(String pgmId, java.io.PrintWriter writer) {
        if (menuResolveDao == null) return null;
        String upper    = pgmId.toUpperCase();
        String noSuffix = upper.replaceAll("[A-Za-z]$", "");

        // ── 캐시 확인 (exact key만 — noSuffix 공유로 인한 오염 방지) ──────────
        String cached = pgmMgtCache.get(upper);
        if (cached != null)
            return CACHE_MISS.equals(cached) ? null : cached;

        // ── XML Mapper 호출 ──────────────────────────────────────────────────
        try {
            String found = menuResolveDao.findPgmId(upper, noSuffix);
            if (found != null) {
                pgmMgtCache.put(upper,    found);
                pgmMgtCache.put(noSuffix, found);  // 히트된 경우만 noSuffix에도 저장
                return found;
            }
        } catch (Exception e) {
            System.out.println("  └ SYS_PGM_MGT 조회 오류 [" + pgmId + "]: " + e.getMessage());
            return null;
        }

        // 미등록 센티넬: exact key만 저장 (noSuffix에 저장하면 PUR_0910M 등 후속 조회 오염)
        pgmMgtCache.put(upper, CACHE_MISS);
        return null;
    }

    // ── DB 조회: SYS_MENU_MGT 정방향(루트→리프) 경로 ─────────────────────────

    /**
     * pgmId 의 메뉴 계층 경로를 루트→리프 순서로 반환.
     * 결과는 menuPathCache 에 저장. 동일 pgmId 재조회 시 DB 접근 없음.
     *
     * 쿼리 설계 — 정방향(루트→리프) 2단계:
     *   1단계(서브쿼리): pgm_id 가 있는 리프 노드에서 CONNECT BY PRIOR upp_menu_id = menu_id
     *                    → 조상 menu_id 집합을 수집 (리프→루트 방향 탐색)
     *   2단계(외부쿼리): 수집된 menu_id 들을 lvl 컬럼 오름차순 정렬
     *                    → 루트(lvl 작음)→리프(lvl 큼) 순서 = 정방향 출력
     *
     * WHERE lvl >= 2 제거 → GNB 루트(lvl=1)도 포함
     */
    public String getMenuPath(String pgmId, java.io.PrintWriter writer) {
        if (menuResolveDao == null) return null;
        String upper    = pgmId.toUpperCase();
        String noSuffix = upper.replaceAll("[A-Za-z]$", "");

        // ── 캐시 확인 (exact key만 — noSuffix 공유로 인한 오염 방지) ──────────
        String cached = menuPathCache.get(upper);
        if (cached != null)
            return CACHE_MISS.equals(cached) ? null : cached;

        // ── XML Mapper 호출 ──────────────────────────────────────────────────
        List<String> parts = new ArrayList<>();
        try {
            List<String> rows = menuResolveDao.findMenuPath(upper, noSuffix);
            for (String nm : rows) {
                if (nm != null && !nm.trim().isEmpty())
                    parts.add(nm.trim());
            }
        } catch (Exception e) {
            System.out.println("  └ DB 오류 [pgmId=" + pgmId + "]: " + e.getMessage());
            return null;
        }

        String path = parts.isEmpty() ? null : String.join(" > ", parts);

        // ── 결과 캐싱 (히트된 경우만 noSuffix에도 저장) ─────────────────────
        if (path != null) {
            menuPathCache.put(upper,    path);
            menuPathCache.put(noSuffix, path);
        } else {
            menuPathCache.put(upper, CACHE_MISS);  // noSuffix에는 저장 안 함
        }
        return path;
    }

    public String getMenuPath(String pgmId) {
        return getMenuPath(pgmId, null);
    }

    /**
     * pgmId에 대응하는 SYS_MENU_MGT 리프 메뉴의 MENU_ID를 반환.
     * openMenuById에 전달할 실제 MENU_ID를 DB에서 조회한다.
     * @return MENU_ID (예: 'M_MIS_01_03_01'), 없으면 null
     */
    public String getMenuId(String pgmId) {
        if (menuResolveDao == null || pgmId == null || pgmId.isEmpty()) return null;
        String upper    = pgmId.toUpperCase();
        String noSuffix = upper.replaceAll("[A-Za-z]$", "");
        String cached   = menuIdCache.get(upper);
        if (cached != null) return CACHE_MISS.equals(cached) ? null : cached;
        try {
            String id = menuResolveDao.findMenuId(upper, noSuffix);
            if (id != null && !id.isEmpty()) {
                menuIdCache.put(upper, id);
                menuIdCache.put(noSuffix, id);
                System.out.println("[MenuResolverService] getMenuId: " + upper + " → " + id);
                return id;
            }
        } catch (Exception e) {
            System.out.println("[MenuResolverService] getMenuId 오류 [" + pgmId + "]: " + e.getMessage());
        }
        menuIdCache.put(upper, CACHE_MISS);
        return null;
    }

    // ── 팝업 부모 역추적 ──────────────────────────────────────────────────────

    /**
     * 팝업 화면(SYS_PGM_MGT 미등록)의 최상위 호출 부모 PGM_ID를 반환한다.
     *
     * 동작 원리:
     *   1) findPopupCallerInXfdl(current) — popupCallerIndex(역인덱스) O(1) 조회
     *   2) 반환된 PGM_ID 를 current 로 교체, 더 이상 부모가 없을 때까지 반복
     *   3) 순환 참조 방지: visited Set 으로 이미 방문한 ID 추적
     *   4) maxDepth=10: 무한 루프 안전장치
     *
     * 예시:
     *   ACT_3912P (팝업) ← PUR_9005M (팝업) ← PUR_5110M (메뉴 등록)
     *   → "PUR_5110M" 반환
     */
    public String findTopParentPgmId(String pgmId, HttpServletRequest request,
                                      java.io.PrintWriter writer) {
        Set<String> visited = new LinkedHashSet<>();
        String current = pgmId;
        visited.add(current);
        int maxDepth = 10;

        while (maxDepth-- > 0) {
            String caller = findPopupCallerInXfdl(current, request);
            if (caller == null) {
                System.out.println("  └ 부모 없음 — 탐색 종료: " + current);
                break;
            }
            if (visited.contains(caller)) {
                System.out.println("  └ 순환 참조 감지 — 탐색 중단: " + caller);
                break;
            }
            System.out.println("  └ 부모 발견: " + current + " ← " + caller);
            visited.add(caller);
            current = caller;
        }
        return current;
    }

    /**
     * popupCallerIndex 에서 targetPgmId 를 팝업으로 호출하는 파일의 PGM_ID 를 반환.
     * 없으면 null.
     *
     * 인덱스가 아직 없으면 ensurePopupCallerIndex() 로 먼저 빌드.
     * 복수 호출자: SYS_PGM_MGT 등록된 파일 우선, 없으면 첫 번째 발견.
     */
    private String findPopupCallerInXfdl(String targetPgmId, HttpServletRequest request) {
        // buildMenuMap 을 거치지 않고 직접 진입한 경우를 위해 인덱스 보장
        String nxuiBase = FilePathHelper.getNxuiBase(request);
        ensurePopupCallerIndex(nxuiBase, null);

        List<String> callers = popupCallerIndex.get(targetPgmId.toUpperCase());
        if (callers == null || callers.isEmpty()) return null;

        // SYS_PGM_MGT 등록된 호출자 우선 (pgmMgtCache 활용)
        for (String caller : callers) {
            if (checkPgmMgt(caller, null) != null) return caller;
        }
        return callers.get(0); // 미등록이어도 첫 번째 반환
    }

    // ── 팝업 역인덱스 빌드 ───────────────────────────────────────────────────

    /**
     * nxui 디렉터리의 모든 .xfdl 파일을 한 번 스캔하여 팝업 호출 역인덱스를 구성한다.
     *
     * 인덱스 구조:
     *   targetPgmId(대문자) → [callerPgmId(대문자), ...]
     *
     * 이미 빌드된 경우(동일 nxuiBase) 재스캔하지 않는다.
     * nxuiBase 가 달라지면(서버 재배포 등) 재빌드한다.
     *
     * PGM_ID 추출 패턴:
     *   팝업 호출 키워드(gfn_openPopup 등) 뒤 400자 이내에서
     *   "영문2~5자 + '_' + 숫자3~6자 + 선택적 영문1자" 형식의 ID를 추출.
     *   예: ACT_3912P, PUR_5110M, FAC_0999P, SYS_0001
     */
    private void ensurePopupCallerIndex(String nxuiBase, java.io.PrintWriter writer) {
        // 빠른 경로: 이미 빌드됨
        if (popupCallerIndex != null && nxuiBase.equals(lastNxuiBase)) return;

        synchronized (indexLock) {
            // double-checked locking
            if (popupCallerIndex != null && nxuiBase.equals(lastNxuiBase)) return;

            System.out.println("[nxui] 팝업 역인덱스 빌드 시작 — " + nxuiBase);
            System.out.println("[MenuResolverService] popupCallerIndex 빌드 시작: " + nxuiBase);

            Map<String, List<String>> index = new HashMap<>();
            File nxuiDir = new File(nxuiBase);

            if (!nxuiDir.exists()) {
                System.out.println("[nxui] ⚠ nxui 경로 없음 — 빈 인덱스로 초기화");
                System.out.println("[MenuResolverService] nxui 경로 없음: " + nxuiBase);
                popupCallerIndex = index;
                lastNxuiBase     = nxuiBase;
                return;
            }

            // 팝업 호출 키워드 + 400자 이내에서 PGM_ID 형식 캡처
            // 그룹 1: PGM_ID (예: ACT_3912P, PUR_5110M)
            Pattern popExtract = Pattern.compile(
                "(?i)(?:OpenPopup|addPopup|ExecOpenURL|showModalDialog" +
                "|gfn_openPopup|openXfdl|gfn_popup|openreport)" +
                "[\\s\\S]{0,400}?" +
                "([A-Za-z]{2,5}_\\d{3,6}[A-Za-z]?)(?:\\.xfdl)?[\"'\\s,)]"
            );

            int fileCount   = 0;
            int relationCnt = 0;

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

                String content    = FilePathHelper.readFileSafe(cur);
                String callerName = cur.getName()
                                       .replaceAll("(?i)\\.xfdl$", "")
                                       .toUpperCase();

                Matcher m = popExtract.matcher(content);
                while (m.find()) {
                    String targetId = m.group(1).toUpperCase();
                    if (targetId.equals(callerName)) continue; // 자기 자신 호출 무시
                    index.computeIfAbsent(targetId, k -> new ArrayList<>())
                         .add(callerName);
                    relationCnt++;
                }
                fileCount++;
            }

            popupCallerIndex = index;
            lastNxuiBase     = nxuiBase;

            String summary = "[nxui] 역인덱스 빌드 완료 — 파일 " + fileCount
                + "개, 팝업타겟 " + index.size() + "개, 호출관계 " + relationCnt + "건";
            System.out.println(summary);
            System.out.println("[MenuResolverService] " + summary);
        }
    }

    // ── 캐시 관리 (관리 API / 단위 테스트용) ─────────────────────────────────

    /**
     * nxuiBase 를 직접 받는 오버로드 — HttpServletRequest 없이 호출 가능.
     * PurTestCodeGenService 등 request 가 없는 컨텍스트에서 사용.
     */
    public String findTopParentPgmId(String pgmId, String nxuiBase,
                                      java.io.PrintWriter writer) {
        Set<String> visited = new LinkedHashSet<>();
        String current = pgmId;
        visited.add(current);
        int maxDepth = 10;

        while (maxDepth-- > 0) {
            ensurePopupCallerIndex(nxuiBase, writer);
            List<String> callers = popupCallerIndex.get(current.toUpperCase());
            String caller = null;
            if (callers != null && !callers.isEmpty()) {
                for (String c : callers) {
                    if (checkPgmMgt(c, null) != null) { caller = c; break; }
                }
                if (caller == null) caller = callers.get(0);
            }

            if (caller == null) {
                System.out.println("  └ 부모 없음 — 탐색 종료: " + current);
                break;
            }
            if (visited.contains(caller)) {
                System.out.println("  └ 순환 참조 감지 — 탐색 중단: " + caller);
                break;
            }
            System.out.println("  └ 부모 발견: " + current + " ← " + caller);
            visited.add(caller);
            current = caller;
        }
        return current;
    }

    /**
     * 팝업 역인덱스를 강제 재빌드한다.
     * nxui 파일 배포 후 반영이 필요할 때 호출.
     */
    public void clearPopupCallerIndex() {
        synchronized (indexLock) {
            popupCallerIndex = null;
            lastNxuiBase     = null;
        }
        System.out.println("[MenuResolverService] popupCallerIndex 초기화됨 (다음 호출 시 재빌드)");
    }

    /**
     * DB 캐시(pgmMgtCache + menuPathCache)를 초기화한다.
     * SYS_PGM_MGT / SYS_MENU_MGT 데이터 변경 후 반영이 필요할 때 호출.
     */
    public void clearDbCaches() {
        pgmMgtCache.clear();
        menuPathCache.clear();
        menuIdCache.clear();
        System.out.println("[MenuResolverService] DB 캐시 초기화됨 (pgmMgt + menuPath + menuId)");
    }

    /** 모든 캐시를 한 번에 초기화한다. */
    public void clearAllCaches() {
        clearDbCaches();
        clearPopupCallerIndex();
        roleCache.clear();
        System.out.println("[MenuResolverService] roleCache 초기화됨");
    }

    /**
     * 현재 캐시 상태를 Map으로 반환한다 (관리/디버그 엔드포인트용).
     *
     * 반환 키:
     *   pgmMgtCache_size, menuPathCache_size,
     *   popupCallerIndex_built, popupCallerIndex_targets, popupCallerIndex_relations,
     *   lastNxuiBase
     */
    public Map<String, Object> getCacheStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("pgmMgtCache_size",            pgmMgtCache.size());
        stats.put("menuPathCache_size",           menuPathCache.size());
        stats.put("popupCallerIndex_built",       popupCallerIndex != null);
        stats.put("popupCallerIndex_targets",
            popupCallerIndex != null ? popupCallerIndex.size() : 0);
        int relations = 0;
        if (popupCallerIndex != null)
            for (List<String> v : popupCallerIndex.values()) relations += v.size();
        stats.put("popupCallerIndex_relations",   relations);
        stats.put("lastNxuiBase",  lastNxuiBase != null ? lastNxuiBase : "(none)");
        return stats;
    }

    // ── 유틸 ──────────────────────────────────────────────────────────────────

    private String str(Map<String, Object> m, String key) {
        Object v = m.get(key);
        return v != null ? String.valueOf(v) : "";
    }

    // ── XfdlScenarioExtractor 전용: sourceName → menuPath/gnbName/menuName ───

    /**
     * XFDL screenName(예: pur5115m)을 pgmId(예: PUR_5115M)로 변환하여
     * SYS_MENU_MGT에서 메뉴 경로를 조회하고 menuPath/gnbName/menuName을 반환한다.
     *
     * 변환 규칙:
     *   pur5115m → PUR_5115M  (대문자 + 영문그룹과 숫자그룹 사이에 _ 삽입)
     *
     * @param sourceName XFDL 파일의 screenName (예: "pur5115m")
     * @return { menuPath, gnbName, menuName } — 조회 실패 시 빈값 반환
     */
    public Map<String, String> resolveMenu(String sourceName) {
        Map<String, String> result = new LinkedHashMap<>();
        result.put("menuPath", "");
        result.put("gnbName",  "");
        result.put("menuName", "");

        if (sourceName == null || sourceName.isEmpty()) return result;

        // 1. pgmId 변환: pur5115m → PUR_5115M
        String upper = sourceName.replaceAll("(?i)\\.xfdl(\\.js)?$", "").toUpperCase();
        // 첫 영문 그룹과 첫 숫자 그룹 사이에 _ 삽입 (아직 없는 경우만)
        String pgmId = upper.replaceAll("^([A-Z]+)(\\d)", "$1_$2");

        // 2. DB 조회 (getMenuPath 내부에서 noSuffix도 시도함)
        String path = getMenuPath(pgmId);

        // 3. 결과가 없고 원본과 변환 결과가 다르면 원본도 시도
        if ((path == null || path.isEmpty()) && !pgmId.equals(upper)) {
            path = getMenuPath(upper);
        }

        if (path == null || path.isEmpty()) return result;

        // 4. 경로 분해: "구매관리 > 구매요청관리 > 구매요청"
        String[] parts = path.split("\\s*>\\s*");
        result.put("menuPath", path);
        result.put("gnbName",  parts.length > 0 ? parts[0].trim() : "");
        result.put("menuName", parts.length > 0 ? parts[parts.length - 1].trim() : "");
        return result;
    }

}
