package cres.pss.service;
import java.util.*;
import java.util.regex.*;

public class JsonHelper {

    // JSON 문자열에서 단순 key-value 추출
    public static String jsonGet(String obj, String key) {
        Pattern p = Pattern.compile("\"" + key + "\"\\s*:\\s*\"((?:[^\"\\\\]|\\\\.)*)\"");
        Matcher m = p.matcher(obj);
        if (m.find()) return m.group(1).replace("\\n", "\n").replace("\\\"", "\"");
        return null;
    }

    public static boolean jsonGetBool(String json, String key) {
        Pattern p = Pattern.compile("\"" + key + "\"\\s*:\\s*(true|false)");
        Matcher m = p.matcher(json);
        return m.find() && "true".equals(m.group(1));
    }

    public static List<String> jsonGetList(String json, String key) {
        List<String> list = new ArrayList<>();
        Pattern p = Pattern.compile("\"" + key + "\"\\s*:\\s*\\[([^\\]]*)\\]");
        Matcher m = p.matcher(json);
        if (!m.find()) return list;
        String inner = m.group(1).trim();
        if (inner.isEmpty()) return list;
        Matcher sm = Pattern.compile("\"((?:[^\"\\\\]|\\\\.)*)\"").matcher(inner);
        while (sm.find()) list.add(sm.group(1));
        return list;
    }

    public static String jsonStr(String s) {
        if (s == null) return "\"\"";
        StringBuilder sb = new StringBuilder("\"");
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"':  sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\n': sb.append("\\n");  break;
                case '\r': sb.append("\\r");  break;
                case '\t': sb.append("\\t");  break;
                default:
                    if (c < 0x20) sb.append(String.format("\\u%04x", (int) c));
                    else sb.append(c);
            }
        }
        return sb.append('"').toString();
    }

    public static String extractJson(String text, String key) {
        Matcher m = Pattern.compile("\"" + key + "\"\\s*:\\s*\"([^\"]+)\"").matcher(text);
        if (m.find()) return m.group(1);
        // 숫자 값도 시도
        Matcher m2 = Pattern.compile("\"" + key + "\"\\s*:\\s*(\\d+)").matcher(text);
        if (m2.find()) return m2.group(1);
        return null;
    }

    // JSON 배열 내부의 객체들을 {} 단위로 분리
    public static List<String> splitJsonObjects(String arr) {
        List<String> result = new ArrayList<>();
        int depth = 0;
        int start = -1;
        for (int i = 0; i < arr.length(); i++) {
            char c = arr.charAt(i);
            if (c == '{') {
                if (depth == 0) start = i;
                depth++;
            } else if (c == '}') {
                depth--;
                if (depth == 0 && start >= 0) {
                    result.add(arr.substring(start, i + 1));
                    start = -1;
                }
            }
        }
        return result;
    }

    /** JSON 문자열에서 braceStart 위치의 '{' 와 매칭되는 '}' 인덱스 반환 */
    public static int findMatchingBrace(String s, int from) {
        int depth = 0;
        boolean inStr = false;
        for (int i = from; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '\\' && inStr) { i++; continue; }
            if (c == '"') { inStr = !inStr; continue; }
            if (!inStr) {
                if (c == '{') depth++;
                else if (c == '}') { depth--; if (depth == 0) return i; }
            }
        }
        return s.length() - 1;
    }

}
