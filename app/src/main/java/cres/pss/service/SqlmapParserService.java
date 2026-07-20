package cres.pss.service;

import java.io.File;
import java.util.*;
import java.util.regex.*;
import org.springframework.stereotype.Service;

/**
 * sqlmap XML 파서 — select/insert/update/delete ID → CRUD 타입 인덱스 생성
 */
@Service
public class SqlmapParserService {

    private static final Pattern P_SQLMAP_TAG = Pattern.compile(
        "<(select|insert|update|delete)\\s[^>]*id=[\"']([^\"']+)[\"']",
        Pattern.CASE_INSENSITIVE);

    // ── 단일 파일 파싱 ─────────────────────────────────────────────────────

    /** @return {queryId(소문자) → "SELECT"|"INSERT"|"UPDATE"|"DELETE"} */
    public Map<String, String> parseSqlmapFile(File xmlFile) {
        Map<String, String> index = new LinkedHashMap<>();
        if (xmlFile == null || !xmlFile.exists()) return index;
        String content = FilePathHelper.readFileSafe(xmlFile);
        if (content.isEmpty()) return index;

        try {
            javax.xml.parsers.DocumentBuilderFactory dbf =
                javax.xml.parsers.DocumentBuilderFactory.newInstance();
            dbf.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
            dbf.setFeature("http://xml.org/sax/features/validation", false);
            dbf.setValidating(false);
            javax.xml.parsers.DocumentBuilder db = dbf.newDocumentBuilder();
            db.setEntityResolver((p, s) ->
                new org.xml.sax.InputSource(new java.io.StringReader("")));

            String cleaned = content.replaceAll("<!DOCTYPE[^>]*>", "");
            org.w3c.dom.Document doc = db.parse(
                new java.io.ByteArrayInputStream(cleaned.getBytes("UTF-8")));

            for (String tag : new String[]{"select", "insert", "update", "delete"}) {
                org.w3c.dom.NodeList nodes = doc.getElementsByTagName(tag);
                for (int i = 0; i < nodes.getLength(); i++) {
                    String id = ((org.w3c.dom.Element) nodes.item(i)).getAttribute("id");
                    if (!id.isEmpty()) index.put(id.toLowerCase(), tag.toUpperCase());
                }
            }
        } catch (Exception e) {
            // DOM 파싱 실패 시 정규식 폴백
            parseSqlmapRegex(content, index);
        }
        return index;
    }

    private void parseSqlmapRegex(String content, Map<String, String> index) {
        Matcher m = P_SQLMAP_TAG.matcher(content);
        while (m.find()) index.putIfAbsent(m.group(2).toLowerCase(), m.group(1).toUpperCase());
    }

    // ── 디렉토리 전체 인덱스 ───────────────────────────────────────────────

    /** sqlmapDir 하위 모든 .xml 파일을 읽어 통합 CRUD 인덱스 반환 */
    public Map<String, String> buildSqlmapIndex(File sqlmapDir) {
        Map<String, String> index = new LinkedHashMap<>();
        if (sqlmapDir == null || !sqlmapDir.isDirectory()) return index;
        File[] files = sqlmapDir.listFiles((d, n) -> n.toLowerCase().endsWith(".xml"));
        if (files == null) return index;
        for (File f : files) index.putAll(parseSqlmapFile(f));
        return index;
    }
}
