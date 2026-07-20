---
name: source-scanning
description: "mis/ 디렉토리에서 모든 XFDL 소스 파일을 탐색하고 prefix별로 분류하는 스킬. '모든 소스 찾아줘', '전체 XFDL 목록', 'source 카탈로그', '모든 화면 목록', '전체 프로젝트 소스', '전체 모듈 처리', '배치 실행' 요청 시 이 스킬을 사용하라."
---

# 소스 탐색 스킬

`mis/` 하위 XFDL 파일을 전체 탐색하여 `_workspace/00_sources.json` 카탈로그를 생성한다.  
오케스트레이터가 다중 모듈 반복 처리를 할 때 이 스킬로 처리 큐를 구성한다.

## 1. 탐색 대상

**루트 경로:** `<project-root>/src\main\nxui\gprooneis`

| 포함 | 설명 |
|------|------|
| `*M.xfdl` | 주화면 — 시나리오 생성 대상 |
| `*P.xfdl` | 팝업 — 카탈로그에 기록하되 시나리오는 미생성 |

| 제외 | 이유 |
|------|------|
| `sam/` | 샘플/데모 파일 |
| `chart/` | 차트 샘플 |

## 2. 모듈 prefix 규칙

디렉토리명을 그대로 prefix로 사용한다:

| 디렉토리 | prefix | 설명 |
|---------|--------|------|
| `mis/act/` | `act` | 결산 |
| `mis/ass/` | `ass` | 자산 |
| `mis/gen/` | `gen` | 일반/공통 |
| `mis/hrm/` | `hrm` | 인사 |
| `mis/pay/` | `pay` | 급여 |
| `mis/pur/` | `pur` | 구매 |

주화면 0개 모듈(`bdg`, `yts`)은 `processingQueue`에서 자동 제외.

## 3. 출력 형식 (`_workspace/00_sources.json`)

```json
{
  "discoveredAt": "2026-06-24",
  "xfdlRoot": "D:\\eGovFrameDev-4.3.0\\workspace\\<workspace-root>\\app\\src\\main\\nxui\\gprooneis",
  "modules": [
    {
      "prefix": "pur",
      "moduleDir": "pur",
      "mainScreens": [
        { "sourceName": "pur_0910M", "filePath": "mis/pur/pur_0910M.xfdl", "type": "M" },
        { "sourceName": "pur_0911M", "filePath": "mis/pur/pur_0911M.xfdl", "type": "M" }
      ],
      "popups": ["pur_0911P"],
      "mainCount": 47
    }
  ],
  "totalMainScreens": 519,
  "processingQueue": ["act", "ass", "gen", "hrm", "pay", "pur"],
  "processed": [],
  "skipped": []
}
```

## 4. 처리 순서 결정

`processingQueue`는 다음 우선순위로 구성한다:
1. 사용자가 명시한 prefix 먼저
2. 나머지는 알파벳 순

## 5. 배치 처리 지원

파일 수가 많으므로 한 번에 전체를 처리하지 않는다.  
`00_sources.json` 생성 후 오케스트레이터가 `processingQueue`를 순회하며 모듈별 배치 실행한다.  
처리 완료 모듈은 `processed[]`로, 오류 모듈은 `skipped[]`로 이동하여 재실행 추적을 지원한다.

## 6. 재실행 판별

- `_workspace/00_sources.json` 존재 + `processingQueue`에 항목 남음 → **재개(resume)** — 이미 처리된 모듈 건너뜀
- `_workspace/00_sources.json` 존재 + `processingQueue` 비어있음 → **완료 상태** — 새 실행 여부 사용자에게 확인
- 미존재 → **초기 탐색 실행**
