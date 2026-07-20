package cres.pss.service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.*;

public class AiStateStore {

    // 시나리오 임시 저장 (prefix → scenarios) — runTest.do / downloadResult.do 에서 재사용
    public static final Map<String, List<Map<String, Object>>> SCENARIO_STORE = new ConcurrentHashMap<>();

    // AI 리포트 임시 저장 (prefix → report text) — downloadResult.do 에서 재사용
    public static final Map<String, String> REPORT_STORE = new ConcurrentHashMap<>();

    // 실행 중인 Playwright 프로세스 저장 (prefix → Process) — stopTest.do 에서 종료
    public static final Map<String, Process> RUNNING_PROC = new ConcurrentHashMap<>();

    // 실행 중인 Playwright 프로세스 PID 저장 — 프로세스 시작 직후 reflection으로 추출
    public static final Map<String, Long> RUNNING_PID = new ConcurrentHashMap<>();

    // 생성된 spec.ts 파일명 저장 (prefix → 현재일시_inte.spec.ts) — runTest.do 에서 재사용
    public static final Map<String, String> SPEC_FILE_STORE = new ConcurrentHashMap<>();

    // spec.ts 실제 저장 디렉토리 절대 경로 (prefix → absolutePath) — 다운로드·실행 시 재사용
    public static final Map<String, String> SPEC_OUTPUT_DIR = new ConcurrentHashMap<>();

    // DB 메뉴명 조회 — 항상 활성화 (체크박스 제거로 고정)
    public static final boolean DB_MENU_LOOKUP_ALLOWED = true;

    // 시나리오 생성용 파일 임시 저장
    public static final Map<String, List<Map<String, Object>>> PENDING_FILES = new ConcurrentHashMap<>();

    // 현재 그룹시나리오 키 저장 (prefix → GRP_ID) — saveScenarioToDB.do / addHistoryGroup.do 재사용
    public static final Map<String, String> GRP_ID_STORE = new ConcurrentHashMap<>();

    // ── 자동 수정 루프 중지 플래그 (prefix → 중지 요청 여부) ─────────────────────
    public static final java.util.Set<String> LOOP_STOP_FLAGS =
            java.util.Collections.newSetFromMap(new ConcurrentHashMap<>());

    // ── GitHub Copilot API 세션 토큰 캐시 ────────────────────────────────────
    public static volatile String COPILOT_SESSION_TOKEN  = null;
    public static volatile long   COPILOT_SESSION_EXPIRY = 0;   // epoch millis
    public static final Object    TOKEN_LOCK = new Object();

    // GitHub Models API 기본 모델 (copilot.properties의 copilot.model 로 재정의 가능)
    // GitHub Models 카탈로그 형식: "anthropic/claude-3-5-sonnet" (하이픈, prefix 필수)
    public static final String DEFAULT_COPILOT_MODEL = "anthropic/claude-3-7-sonnet";

    // callCopilotApi 성공 시 실제 사용된 모델명 추적 (SSE 로그용)
    public static final ThreadLocal<String>  LAST_USED_MODEL   = new ThreadLocal<>();
    // callCopilotApi 성공 시 HTTP 상태코드 추적 (SSE 로그용)
    public static final ThreadLocal<Integer> LAST_HTTP_STATUS  = new ThreadLocal<>();
    // callCopilotApi 성공 시 토큰 사용량 추적 (SSE 로그용)
    public static final ThreadLocal<Integer> LAST_INPUT_TOKENS  = new ThreadLocal<>();
    public static final ThreadLocal<Integer> LAST_OUTPUT_TOKENS = new ThreadLocal<>();
    // 세션 누적 토큰 사용량 (prefix → long[]{입력합계, 출력합계})
    public static final Map<String, long[]> SESSION_TOKEN_USAGE = new ConcurrentHashMap<>();

    // 에러 로그 (최근 1000건)
    public static final java.util.concurrent.ConcurrentLinkedDeque<Map<String, Object>> ERR_LOG =
            new java.util.concurrent.ConcurrentLinkedDeque<>();

    // 생성 로그 (최근 1000건)
    public static final java.util.concurrent.ConcurrentLinkedDeque<Map<String, Object>> GEN_LOG =
            new java.util.concurrent.ConcurrentLinkedDeque<>();

    // MD 파일 내용 캐시 (파일명 → 내용) — 서버 재시작 전까지 유지
    // 읽을 때마다 디스크 접근을 피하기 위해 최초 1회만 파일 읽고 이후는 메모리에서 반환
    public static final Map<String, String> MD_CACHE = new ConcurrentHashMap<>();

    // GitHub OAuth Device Flow 임시 저장 (device_code)
    public static volatile String DEVICE_CODE_CACHED = null;

    // ── Patterns ──────────────────────────────────────────────────────────────
    public static final Pattern GFN_TRAN_PAT = Pattern.compile(
        "gfn_tran\\s*\\([^,]+,\\s*\"[^\"]*\"\\s*,\\s*\"(/[^\"]+\\.do)\"");
    public static final Pattern TRANSACTION_PAT = Pattern.compile(
        "\\.transaction\\s*\\(\\s*\"[^\"]*\"\\s*,\\s*\"(/[^\"]+\\.do)\"");
    public static final Pattern DO_URL_PAT = Pattern.compile(
        "\"(/(?:mis|pms)/[\\w/._-]+\\.do)\"");
    public static final Pattern GW_CALL_PAT = Pattern.compile(
        "(?i)(?:GwApproval|fn_gw_approval|gwApproval|/gw/gw[A-Za-z]+\\.do)");
    public static final Pattern INSERT_TBL = Pattern.compile("(?i)INSERT\\s+INTO\\s+(\\w+)");
    public static final Pattern UPDATE_TBL = Pattern.compile("(?i)UPDATE\\s+(\\w+)\\s+SET");
    public static final Pattern DELETE_TBL = Pattern.compile("(?i)DELETE\\s+FROM\\s+(\\w+)");
    public static final String TEMPLATE_SHEET = "시나리오및결과서";

    // ── xfdl Dataset/Transaction 추출 ─────────────────────────────────────────
    public static final Pattern XFDL_DATASET_PAT = Pattern.compile(
        "<(?:Ordinary)?Dataset[^>]+id=\"([^\"]+)\"[^>]*>[\\s\\S]*?<ColumnInfo>([\\s\\S]*?)</ColumnInfo>",
        Pattern.CASE_INSENSITIVE);
    public static final Pattern XFDL_COL_ID_PAT = Pattern.compile(
        "<Column[^>]+id=\"([^\"]+)\"", Pattern.CASE_INSENSITIVE);
    public static final Pattern GFN_TRAN_FULL_PAT = Pattern.compile(
        "gfn_tran\\s*\\(\\s*[^,]+,\\s*\"[^\"]*\"\\s*,\\s*\"(/[^\"]+\\.do)\"\\s*,\\s*\"([^\"]*)\"\\s*,\\s*\"([^\"]*)\"");
}
