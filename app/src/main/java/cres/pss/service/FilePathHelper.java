package cres.pss.service;

import java.io.*;
import java.util.*;
import javax.servlet.http.HttpServletRequest;

/**
 * 파일 경로 및 파일 탐색 유틸리티 클래스.
 * AiController 에서 추출한 순수 정적(static) 메서드만 포함한다.
 * Spring 애노테이션 없음.
 */
public class FilePathHelper {

    private FilePathHelper() {}

    // ══════════════════════════════════════════════════════════════════════════
    // 경로 헬퍼
    // ══════════════════════════════════════════════════════════════════════════

    public static String getNxuiBase(HttpServletRequest request) {
        File webappDir = new File(request.getServletContext().getRealPath("/"));
        File mainDir   = webappDir.getParentFile(); // src/main
        File nxuiDir   = new File(mainDir, "nxui");
        // nxui/ 하위 첫 번째 디렉토리를 사용 (프로젝트명과 무관하게 실제 존재하는 폴더)
        if (nxuiDir.exists() && nxuiDir.isDirectory()) {
            File[] subs = nxuiDir.listFiles(File::isDirectory);
            if (subs != null && subs.length > 0) {
                // mis/ 또는 pms/ 를 직접 가진 디렉토리를 우선 선택
                for (File sub : subs) {
                    if (new File(sub, "mis").isDirectory() || new File(sub, "pms").isDirectory()) {
                        return sub.getAbsolutePath();
                    }
                }
                return subs[0].getAbsolutePath(); // fallback: 첫 번째 하위 디렉토리
            }
        }
        // fallback: 프로젝트명으로 추정 (구 방식)
        File srcDir = mainDir.getParentFile();
        String projectName = srcDir.getParentFile().getName();
        return new File(mainDir, "nxui/" + projectName).getAbsolutePath();
    }

    public static String getSrcBase(HttpServletRequest request) {
        File webappDir = new File(request.getServletContext().getRealPath("/"));
        return new File(webappDir.getParentFile(), "java/cres").getAbsolutePath();
    }

    public static String getSqlmapBase(HttpServletRequest request) {
        File webappDir = new File(request.getServletContext().getRealPath("/"));
        return new File(webappDir.getParentFile(), "resources/cres/sqlmap").getAbsolutePath();
    }

    public static String getClaudeDir(HttpServletRequest request) {
        File webappDir = new File(request.getServletContext().getRealPath("/"));
        File misRoot   = webappDir.getParentFile()  // main
                                  .getParentFile()  // src
                                  .getParentFile()  // (app root)
                                  .getParentFile(); // workspace root
        return new File(misRoot, "claude").getAbsolutePath();
    }

    /**
     * 테스트 자동화 전용 기본 디렉토리: {projectRoot}/etc/ai
     * 하위 구조:
     *   etc/ai/history/  — 시나리오 이력 JSON
     *   etc/ai/tests/    — spec.ts
     *   etc/ai/excel/    — PUR 시나리오 Excel
     */
    public static File getAiBaseDir(HttpServletRequest request) {
        File webappDir   = new File(request.getServletContext().getRealPath("/"));
        File projectRoot = webappDir.getParentFile()  // main
                                    .getParentFile()  // src
                                    .getParentFile(); // (app root)
        return new File(projectRoot, "etc/ai");
    }

    public static String getCopilotDir(HttpServletRequest request) {
        return getAiBaseDir(request).getAbsolutePath();
    }

    /**
     * spec.ts 저장/조회 루트: {workspaceRoot}/tests/
     * SpecGenService.getSpecDir()과 동일한 경로 — 파일명 조회 시 하위 디렉토리(integration/, unit/) 재귀 탐색
     */
    public static File getSpecDir(HttpServletRequest request) {
        File webappDir = new File(request.getServletContext().getRealPath("/"));
        File misRoot   = webappDir.getParentFile()  // main
                                  .getParentFile()  // src
                                  .getParentFile()  // (app root)
                                  .getParentFile(); // workspace root
        return new File(misRoot, "tests");
    }

    /**
     * Python 패턴 분석 결과 파일: etc/ai/pur_patterns.json
     * analyze_pur_patterns.py 가 생성하는 파일.
     * Java ScenarioBuilderService 가 이 파일을 읽어 시나리오 품질을 강화한다.
     */
    public static File getPurPatternsJson(HttpServletRequest request) {
        return new File(getAiBaseDir(request), "pur_patterns.json");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // nxui 파일 목록
    // ══════════════════════════════════════════════════════════════════════════

    public static void addSubfolderNames(File dir, Set<String> result) {
        if (dir == null || !dir.exists() || !dir.isDirectory()) return;
        for (File f : dir.listFiles()) {
            if (f.isDirectory()) result.add(f.getName());
        }
    }

    public static void addXfdlFiles(File dir, List<File> result) {
        if (dir == null || !dir.exists() || !dir.isDirectory()) return;
        java.util.Deque<File> queue = new java.util.ArrayDeque<>();
        queue.add(dir);
        while (!queue.isEmpty()) {
            File cur = queue.poll();
            if (cur.isDirectory()) {
                File[] children = cur.listFiles();
                if (children != null) for (File c : children) queue.add(c);
            } else {
                String name = cur.getName().toLowerCase();
                if (name.endsWith(".xfdl") || name.endsWith(".xfdl.js")) result.add(cur);
            }
        }
    }

    public static void addXfdlFiles(File dir, String origin,
                               List<Map<String, Object>> result,
                               Map<String, Integer> nameIndex) {
        if (dir == null || !dir.exists() || !dir.isDirectory()) return;
        for (File f : dir.listFiles()) {
            if (!f.isFile()) continue;
            String raw  = f.getName().replaceAll("\\.[^.]+$", "");
            String key  = raw.toLowerCase();

            if (nameIndex.containsKey(key)) {
                // 동일 파일명이 양쪽에 있으면 origin 괄호 표기
                int idx = nameIndex.get(key);
                Map<String, Object> prev = result.get(idx);
                String prevOrigin = (String) prev.get("origin");
                prev.put("displayName", raw + " (" + prevOrigin + ")");
                Map<String, Object> entry = new LinkedHashMap<>();
                entry.put("displayName", raw + " (" + origin + ")");
                entry.put("rawName",     raw);
                entry.put("origin",      origin);
                entry.put("checked",     true);
                result.add(entry);
            } else {
                Map<String, Object> entry = new LinkedHashMap<>();
                entry.put("displayName", raw);
                entry.put("rawName",     raw);
                entry.put("origin",      origin);
                entry.put("checked",     true);
                nameIndex.put(key, result.size());
                result.add(entry);
            }
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // xfdl 파일 탐색
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * 소스명으로 nxui 전체를 탐색해 xfdl 파일을 찾는다.
     * prefix(폴더명)에 의존하지 않고 mis/*, pms/* 하위 모든 폴더를 검색한다.
     * 반환: {File xfdl, String origin, String subDir}  — 못 찾으면 null
     */
    public static String[] findXfdlAnywhere(String nxuiBase, String sourceName) {
        String rawName = sourceName.replaceAll("\\s*\\([^)]+\\)\\s*$", "").trim();
        for (String org : new String[]{"mis", "pms"}) {
            File orgDir = new File(nxuiBase + "/" + org);
            if (!orgDir.exists() || !orgDir.isDirectory()) continue;
            File[] subDirs = orgDir.listFiles(File::isDirectory);
            if (subDirs == null) continue;
            for (File subDir : subDirs) {
                File[] files = subDir.listFiles();
                if (files == null) continue;
                for (File f : files) {
                    String base = f.getName().replaceAll("\\.[^.]+$", "");
                    if (base.equalsIgnoreCase(rawName))
                        return new String[]{ f.getAbsolutePath(), org, subDir.getName() };
                }
            }
        }
        return null; // 못 찾음
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Controller / sqlmap 파일 탐색
    // ══════════════════════════════════════════════════════════════════════════

    public static File findControllerFile(String srcBase, String origin, String prefix, String screenId) {
        if (origin == null || screenId == null || screenId.isEmpty()) return null;
        File webDir = new File(srcBase + "/" + origin + "/" + prefix + "/web");
        if (!webDir.exists()) return null;

        // 후보 이름 목록: 끝 단일 영문자(m/s/p/d) 제거 버전도 시도
        String base1 = screenId;                                  // pur5115m
        String base2 = screenId.replaceAll("[a-z]$", "");         // pur5115
        String base3 = screenId.replaceAll("_[a-z]$", "");        // pur_5115  (언더스코어 포함 원본 기반)

        for (File f : webDir.listFiles()) {
            String fn = f.getName();
            if (!fn.endsWith("Controller.java")) continue;
            String fnBase = fn.replace("Controller.java", "").toLowerCase()
                              .replaceAll("[^a-z0-9]", ""); // 비교 시 언더스코어 제거
            String b1n = base1.replaceAll("[^a-z0-9]", "");
            String b2n = base2.replaceAll("[^a-z0-9]", "");
            String b3n = base3.replaceAll("[^a-z0-9]", "");
            if (fnBase.equals(b1n) || fnBase.equals(b2n) || fnBase.equals(b3n)) return f;
        }
        return null;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 파일 읽기 유틸
    // ══════════════════════════════════════════════════════════════════════════

    public static String readMdContent(HttpServletRequest request, String fileName) {
        // 캐시 히트 — 디스크 읽기 생략
        String cached = AiStateStore.MD_CACHE.get(fileName);
        if (cached != null) return cached;
        try {
            File webappDir = new File(request.getServletContext().getRealPath("/"));
            File misRoot   = webappDir.getParentFile().getParentFile()
                                      .getParentFile().getParentFile();
            File found = findFile(misRoot.getParentFile(), fileName, 4);
            if (found != null) {
                String content = readFileSafe(found);
                AiStateStore.MD_CACHE.put(fileName, content);
                return content;
            }
        } catch (Exception ignored) {}
        return "";
    }

    public static File findFile(File dir, String name, int maxDepth) {
        if (dir == null || !dir.isDirectory() || maxDepth <= 0) return null;
        File[] children = dir.listFiles();
        if (children == null) return null;
        for (File f : children) {
            if (f.isFile() && f.getName().equalsIgnoreCase(name)) return f;
            if (f.isDirectory() && !f.getName().startsWith(".")
                    && !f.getName().equals("node_modules")
                    && !f.getName().equals("target")) {
                File found = findFile(f, name, maxDepth - 1);
                if (found != null) return found;
            }
        }
        return null;
    }

    public static String readFileSafe(File f) {
        try {
            byte[] bytes = java.nio.file.Files.readAllBytes(f.toPath());
            try { return new String(bytes, "UTF-8"); }
            catch (Exception e) { return new String(bytes, "EUC-KR"); }
        } catch (Exception e) { return ""; }
    }

    /** InputStream 전체를 UTF-8 문자열로 읽기 (JDK 1.8 호환 — readAllBytes() 대체) */
    public static String readStream(java.io.InputStream is) {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) sb.append(line).append("\n");
            return sb.toString();
        } catch (Exception e) { return ""; }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // origin 탐지
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * nxui 하위의 모든 첫 번째 뎁스 디렉토리명(prefix) 목록 반환.
     * mis/ 와 pms/ 양쪽을 합산하고 알파벳 순 정렬.
     */
    public static List<String> getNxuiPrefixList(String nxuiBase) {
        Set<String> set = new LinkedHashSet<>();
        addSubfolderNames(new File(nxuiBase + "/mis"), set);
        addSubfolderNames(new File(nxuiBase + "/pms"), set);
        List<String> list = new ArrayList<>(set);
        Collections.sort(list);
        return list;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 내부 유틸
    // ══════════════════════════════════════════════════════════════════════════

    private static String upperFirst(String s) {
        if (s == null || s.isEmpty()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}
