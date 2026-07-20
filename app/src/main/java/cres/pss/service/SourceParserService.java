package cres.pss.service;

import java.io.File;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 하위 호환 래퍼 — 실제 파싱 로직은 분리된 서비스에 위임
 *
 * ┌ xfdl 파싱 ──→ XfdlParserService
 * └ sqlmap 파싱 → SqlmapParserService
 *
 * 기존 참조 코드(ScenarioBuilderService 등)는 이 클래스를 그대로 사용할 수 있다.
 * 새 코드는 XfdlParserService / SqlmapParserService 를 직접 주입할 것.
 */
@Service
public class SourceParserService {

    @Autowired private XfdlParserService   xfdlParser;
    @Autowired private SqlmapParserService sqlmapParser;

    // ── 타입 별칭 (기존 코드 호환) ─────────────────────────────────────────
    public static class TranCall      extends XfdlParserService.TranCall      {}
    public static class ComponentInfo extends XfdlParserService.ComponentInfo {}
    public static class XfdlInfo      extends XfdlParserService.XfdlInfo      {}

    // ── xfdl 위임 ──────────────────────────────────────────────────────────

    public XfdlParserService.XfdlInfo parseXfdl(String content) {
        return xfdlParser.parseXfdl(content);
    }

    public String extractMethodFromUrl(String url) {
        return xfdlParser.extractMethodFromUrl(url);
    }

    // ── sqlmap 위임 ────────────────────────────────────────────────────────

    public Map<String, String> parseSqlmapFile(File xmlFile) {
        return sqlmapParser.parseSqlmapFile(xmlFile);
    }

    public Map<String, String> buildSqlmapIndex(File sqlmapDir) {
        return sqlmapParser.buildSqlmapIndex(sqlmapDir);
    }
}
