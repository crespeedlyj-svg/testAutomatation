# DESIGN.md — 프론트 디자인 시스템

> `app/src/main/webapp/**/*.css` 정적 분석 결과.
> `wtpwebapps/`(WTP 배포 산출물), `node_modules/`, `nxui/`(Nexacro 런타임 산출물), `script/sgrid/`(SGrid 라이브러리), `bootstrap.min.css`, `Chart.min.css`, `css/ai/doTest.css`(별도 앱)는 제외.
> 프로젝트 자체 CSS 파일을 대상으로 색상·타이포·컴포넌트 패턴을 정리했다.

---

## 1. 디자인 시스템의 실체

이 프로젝트에는 **단일한 디자인 토큰 파일이 없다.** 여러 세대에 걸친 페이지가 공존한다.

| 세대 | 대표 파일 | 특징 |
|------|-----------|------|
| **Legacy** (v1) | `css/common.css`, `css/eip.css`(루트), `css/gw.css`, `css/surv_common.css`, `css/eipEtc.css`, `css/login.css`, `css/extlogin.css` | `float` 레이아웃, 픽셀 고정 폭(1750/1530/1180px), 이미지 스프라이트 버튼(`btn_*.png`), 색상·크기 하드코딩 |
| **Modern EIP** (v2) | `css/eip/eip.css` 및 하위 `base/*`, `layout/*`, `portal/*`, `etc/*` | `flex`/`grid` 레이아웃, CSS 리셋 분리, `-nm-`/`-div` 네이밍, `min-height:0`+`flex:1` 스크롤 패턴, 이모지 아이콘 대체 |
| **Admin Console** (v3) | `css/mgt-admin.css`, `css/mgt_layout.css` | `:root { --ma-* }` 커스텀 프로퍼티, BEM 유사(`ma-btn`, `ma-tbl`, `ma-badge-*`), 다크 사이드바(#2c3e50) |

**함의:** 화면을 새로 만들 때 어느 세대의 규칙을 따를지 먼저 결정해야 한다. 신규 개발은 v3의 CSS 변수 방식을 권장.

---

## 2. 폰트

**로드 위치:** [font.css](app/src/main/webapp/css/font.css), [notoSansKR.css](app/src/main/webapp/css/notoSansKR.css), [nanumgothic.css](app/src/main/webapp/css/nanumgothic.css)

패밀리별로 `@font-face`가 정의되어 있으며 로컬 `.eot/.woff2/.woff/.ttf`를 사용 (외부 CDN 없음).

| Family (font-family 문자열) | Weight | 용도 |
|---|---|---|
| `NotoSansKR Light` | 300 | v2 EIP `.light` |
| `NotoSansKR Regular` | 400 | v2 EIP body 기본, `.regular` |
| `NotoSansKR Medium` | 500 | v2 EIP `.medium` |
| `NotoSansKR Bold` | 700 | v2 EIP `.bold`, 강조 |
| `Nanum Gothic` | 400 | v1 gw.css 등 legacy 앱 |
| Fallback 스택 | — | `'맑은 고딕','Malgun Gothic','돋움',Dotum,'굴림',Gulim,Helvetica,AppleGothic,sans-serif` |

> **주의:** `font.css`는 legacy 파일로 `NotoSansKR-*`가 전부 `font-weight:normal`로 잘못 매핑되어 있다. 신규 페이지는 `notoSansKR.css`(300/400/500/700)를 참조할 것.

### 기준 크기

| 파일 | body font-size |
|---|---|
| `eip/base/typography.css` | 10pt |
| 루트 `common.css` | 9pt |
| `mgt-admin.css` 계열 | 14px, table 셀 12px |
| `surv_common.css`, `eipEtc.css` | 9pt / 16px |

---

## 3. 색상 팔레트

각 파일에 하드코딩되어 있지만, 실제로는 다음 팔레트가 반복된다.

### 3.1 브랜드 / 액션 (Blue 계열)

| 역할 | 값 | 사용처 |
|---|---|---|
| Primary Blue | `#1a74d2` | `mgt-admin.css --ma-primary`, `mgt_layout.css` 헤더 언더라인·버튼 |
| Primary Blue Hover | `#1565c0` | `--ma-primary-hov` |
| Info Blue (검색) | `#1b68b6` | `common.css .btn_*:hover` |
| Dark Nav Blue | `#294c9a` | `common.css .login_btn` |
| Sidebar Dark | `#2c3e50` / `#34495e` / `#253443` | `mgt_layout.css .Left` |
| Portal Header Blue | `#185B9C` | `portal.css` 상단 그라디언트 |
| Legacy 링크 Blue | `#005a9c`, `#0071a2`, `#2e5a90` | `login.css`, `extlogin.css` |
| Tab Active Blue | `#2e4fc4`, `#007bff` | `common.css .tab_on`, `main.css .tab-item.active` |

### 3.2 Accent Teal (강조 라인)

| 값 | 사용처 |
|---|---|
| `#5dc2be` | v1 `common.css .search/.main/.list` border-top 2px |
| `#88cbea` | `gw.css table.TBL_ST01`, `signPad` |
| `#05b4a6` | Excel 버튼 (`eipEtc.css .btn_excel_dn`) |

### 3.3 Semantic

| 상태 | 값 | 예 |
|---|---|---|
| 필수/오류 Red | `#FF0000`, `#f56843` | `common.css .essential`, `eipEtc.css .tble_btn01`, `.text-emphasis-red` |
| Danger | `#c0392b`/`#a93226` | `--ma-btn-danger`, `.defect-count` |
| Success/Save | `#f15c5c`, `#27ae60`, `#15803d` | Save 버튼, `.result-pass` |
| Warning/Tran | `#ff9d47` | `eipEtc.css .btn_tran` |
| Focus Orange | `#D2691E`, `#FF9A2D` | v1 `input:focus`, v2 reset `input:focus` |

### 3.4 중립(Grayscale)

| 값 | 역할 |
|---|---|
| `#3D3D3D` | body 텍스트 (v2 기본) |
| `#595959` | 텍스트/버튼 (v1 `common.css`) |
| `#666868` | 소제목 |
| `#dadada` | 일반 테두리 |
| `#e0e0e0` / `#eeeeee` | 얇은 구분선 (v2 main-table) |
| `#DEE2E6` | v2 search-condition border |
| `#f3f3f3` / `#f3f5f9` / `#f4f4f4` | th/헤더 배경 (`--ma-head-bg`) |
| `#f0f2f5` / `#f7f7f7` / `#fafafa` | 페이지/카드 배경 |
| `#fff4cb` / `#fff4c8` | 필수 입력 배경(`.essential input`) |
| `#EFEFEF4D` / `#e7e7e7` / `#f8f8f8` | readonly 배경 |

---

## 4. 컴포넌트 카탈로그

### 4.1 입력 폼

**v1 (`css/common.css`):** `input` border `#CCC` radius 5px height 24px, focus `#D2691E`, date input에 `/images/common/btn_cal.png` 배경.
**v2 (`eip/base/reset.css`):** border `#dadada` radius 5px height 24px, focus `#FF9A2D`.
**v3 (`mgt-admin.css`):** `.ma-inp`/`.ma-sel` height 26px, radius 3px, focus `var(--ma-primary)`.

**필수/읽기전용 표기 (v1 공통):**
- `.essential input`, `.essential select` → 배경 `#fff4cb`
- `.readonly` → 배경 `#EFEFEF4D`, `input.readOnly` → `#e7e7e7`

**토글 스위치:** [common.css:93-154](app/src/main/webapp/css/common.css) — 40×25, 체크시 `#2196F3`.

### 4.2 버튼

3가지 버튼 시스템이 병존:

**A. 이미지 스프라이트 (v1) — `common.css` / `eip/base/common.css`**
- 65×25 (`.btn`) 또는 65×21 (`.subbtn`) 클래스 + `.btn-search`, `.btn-save`, `.btn-delete`, `.btn-close`, `.btn-excel`, `.btn-copy`, `.btn-apply`, `.btn-list`, `.btn-mail`, `.btn-new`, `.btn-open`, `.btn-print`, `.btn-reject`, `.btn-reset`, `.btn-help`, `.btn-report`, `.btn-cancel`, `.btn-addrow`, `.btn-deleterow`, `.btn-fileupload`, `.btn-mymenu-on/off`
- 아이콘 경로: `/images/eip/button/btn_WF_*.png` + `_On.png` hover
- v1 원조는 60×23 `.btn_search`, `.btn_save`, `.btn_delete`, `.btn_registration`, `.btn_approbation`, `.btn_print`, `.btn_mail`, `.btn_sms`, `.btn_help`, `.btn_close`, `.btn_approval`(85px), `.btn_reject`, `.btn_search`, `.btn_modify`, `.btn_down`, `.btn_common`, `.btn_row_delete`, `.btn_row_add`, `.btn_arr01/02`(23×23) — 각각 `_ov`(hover), `_off`(disable) 세트 [common.css:301-503](app/src/main/webapp/css/common.css:301)
- 색상: 기본 `#374b72` on `#5372ad` border → hover `#4d91cd` 배경 흰 글씨

**B. 다크 컬러 필/솔리드 (v1 컬러 버튼) — `eipEtc.css`**
- 100×25 반복 세트: `.btn_tran`(`#ff9d47`), `.btn_search`(`#0868b6`), `.btn_base`(`#5389dd`), `.btn_excel_dn`(`#05b4a6`), `.btn_close`(`#8499B3`), `.btn06`(`#dadada`, 어두운 텍스트)
- 인라인 라벨용 미니 배지: `.tble_btn01`~`05` — 각각 `#f56843/#6cb3c6/#056ed9/#909090/#ff9a4f`

**C. 토큰 기반 (v3) — `mgt-admin.css`**
- `.ma-btn` height 26px, `.ma-btn-sm` 22px, `.ma-btn-gray`, `.ma-btn-danger` — 컬러는 `--ma-primary`, `--ma-secondary`, `#c0392b`.
- `mgt_layout.css`의 `.top_btn a.btn_sty01/02`도 동일 색상 규격을 공유.

**신규 개발 지침:** v3의 `--ma-*` 토큰과 `.ma-btn` 계열을 표준으로 채택하고, 필요 시 이미지 아이콘은 `background-image`로 얹는 방식이 유지보수에 유리하다.

### 4.3 테이블

**v1 검색 테이블 (`common.css .search`):** 100% 폭, border-top 2px `#5dc2be`, th 배경 `#f3f3f3` 좌정렬 padding-left 20px, tr 30px.
**v1 데이터 테이블 (`.list`):** 첫 행 헤더 `#a0bcd8` 배경, 짝수행 `#ddeaf6`, td 가운데 정렬.
**v1 폼 테이블 (`.main`):** `.search`와 동일 border-top teal, th `#f3f3f3` 좌정렬.
**v2 main-table (`eip/layout/main.css`):** table-layout fixed, tr 32px, th `#f4f4f4` 좌정렬, td `padding-left:5px`.
**v3 진한 헤더 (`ma-tbl`):** th `#3a6ea8` 배경 흰 글씨 (`--ma-tbl-head-bg`), 필요시 `.ma-tbl-light`로 연한 헤더 전환. hover `#f0f5ff`, 선택행 `#cfe2ff`.
**v3 mgt_layout (`.TBL_srh`/`.TBL_default`):** border-top 2px `#2c3e50`, th `#f3f5f9` 12px. hover `#eef5ff`, 선택 `#dbeafe`.

### 4.4 그리드 (main.css / portal.css)

`.main-grid` / `.portal-grid` — flex 세로 구조로 헤더 30px 고정 + body flex:1 overflow-auto. 짝수행 `#fafafa`, hover `#f3f3f8`, active `#F4F3EA`. 헤더 border-top 2px `#757575`.

### 4.5 트리

- **v1 tree.css:** `.treeDiv a.nodeSel` 배경 `#c0d2ec`
- **v2 layout/left.css:** `.left-menu-tree-li.depth-N`으로 padding-left 10px씩 증가(0~7단계), 폴더 아이콘 `grd_left_tree_open/close.png`, 리프 `grd_left_treeicon_leaf.png`
- **v2 layout/main.css `.tree-li`:** 동일 depth-N 규칙, 아이콘은 이모지(📂/📁/▪️)로 대체된 버전이 활성화되어 있음

### 4.6 탭

- **v1 `.tab_on/.tab_off`:** 22px 라인, 활성 `#2e4fc4` on `#1a3299`
- **v2 `.tab-item.active`:** 배경 흰색 + border-top 2px `#007bff` bold
- **v3 `.ma-tab-nav a.active`:** `--ma-primary` 배경 흰 글씨, border-bottom 2px `--ma-primary`

### 4.7 모달/팝업

- **v1 `.modal-container` / `.modal-content`:** 화면 100% 오버레이 `rgba(0,0,0,0.4)`, 컨텐츠 max-width 800px, padding 20px, border-radius 5px [eip/base/common.css:35-37](app/src/main/webapp/css/eip/base/common.css:35)
- **popup.css:** 상단 4px 그라디언트 바 `linear-gradient(to right, #45ced8, #467be1)` + 24px 타이틀

### 4.8 로딩/스피너

`.ma-overlay` / `.ma-spin` — `rgba(0,0,0,.35)` 오버레이 + 28px 링 스피너, 회전 애니메이션 이름은 `ma-spin`. `mgt-admin.css`에는 동일 스타일의 `#loadingOverlay` / `.loading-box` / `.spin` 별칭도 정의되어 있음.

### 4.9 뱃지·상태

- **`.ma-badge-running/-done/-error/-pending`** — pastel 배경 + 톤 다운 텍스트 (`#d1e7dd`/`#cfe2ff`/`#f8d7da`/`#e2e3e5`)
- **`.tble_btn0N`** — 인라인 상태 라벨 (컬러풀, `eipEtc.css`)

### 4.10 페이징

두 곳에 유사 구현: `popup.css` / `eipEtc.css`의 `.paging` — 현재 페이지 `#f23219`, 화살표 버튼(first/pre/next/lastko/lasten)은 `bl_first.gif` 등 이미지 스프라이트 사용. `mgt-admin.css`는 `.ma-pager` / `.ma-pg-size`로 재정의(radius 3px, active `--ma-primary`).

### 4.11 스크롤바 (webkit)

`eip/base/common.css` `.scrollbar` (8px), `.grid-scroll-type-1` (4px) — thumb `hsla(0,0%,42%,0.29)` border-radius 100px, track transparent. 루트 `common.css` `body::-webkit-scrollbar`는 15px 회색+파스텔블루 트랙.

---

## 5. 레이아웃 시스템

### 5.1 EIP 표준 프레임 (v2)

[eip/layout/layout.css](app/src/main/webapp/css/eip/layout/layout.css)
```
#top      : height 60px
#content  : flex, height calc(100vh - 60px)
  #left   : 220px (transition 0.3s, .collapsed → 0)
  #main   : flex:1, overflow-y auto, min-width 1600px
```

### 5.2 관리자 프레임 (v3)

[mgt_layout.css](app/src/main/webapp/css/mgt_layout.css)
```
#wrap     : 배경 #f0f2f5
  .Left   : float:left, 200px, 다크 #2c3e50
  .contents : margin-left:200px, 흰 배경, padding 0 20px 20px
#footer   : #2c3e50 다크 12px 회색 텍스트
```

### 5.3 포탈 그리드 (v2)

[eip/portal/portal.css:7-27](app/src/main/webapp/css/eip/portal/portal.css:7) — `.portal-content-box`가 CSS Grid로 7열 × 19행을 잡고, 12개의 `.content-itemN`이 grid-column/row로 자기 자리를 예약한다. 배경은 상단 `#185B9C` 40% + 하단 `#EDF2F8`.

### 5.4 로그인 페이지

- [login.css](app/src/main/webapp/css/login.css) — 1030px 중앙, 우측 폼 434px, submit `#005a9c` 42px 라인
- [extlogin.css](app/src/main/webapp/css/extlogin.css) — 988px 중앙, `login_bg` 이미지 프레임 + `.login_go` 오렌지 `#ffbd55` 큰 CTA
- [common.css:161-178](app/src/main/webapp/css/common.css:161) — 또 다른 세대의 로그인 폼(1180px, `#294c9a`)

---

## 6. 특화 화면

| 파일 | 대상 | 요점 |
|---|---|---|
| [eip/etc/eipBbs.css](app/src/main/webapp/css/eip/etc/eipBbs.css) | 게시판 | `.bbs-view-cmt` 계층 (info/input/footer), 이모지 그리드 `bbs-setting-emoji-grid` 5×5, 툴팁·플로팅 저장 버튼 |
| [eip/etc/eipComp.css](app/src/main/webapp/css/eip/etc/eipComp.css) | 포틀릿 | `.btn-comp` 70×30, `.comp-cstm-preview` 좌우 분할 프리뷰 |
| [eip/etc/eipSurv.css](app/src/main/webapp/css/eip/etc/eipSurv.css) | 설문조사 | `.surv-question-header/body/answer` 3-band, `.surv-rspns-btn-submit` `#6695BF` CTA (`.disabled`시 `#ccc`), 통계 그래프 컨테이너 268px |
| [eip/eipHelp.css](app/src/main/webapp/css/eip/eipHelp.css) | 도움말 뷰어 | 210px 좌측 목차 + iframe PDF 영역 |
| [surv_common.css](app/src/main/webapp/css/surv_common.css) / [surv_addr.css](app/src/main/webapp/css/surv_addr.css) | 조사 시스템 (독립 앱) | 1536px 고정 폭, 브랜드 티일 `#369f94`/`#5880c0`, 조직·투표·직원 카드 스타일 |
| [signPad.css](app/src/main/webapp/css/signPad.css) | 전자서명 | 500×300 절대배치 캔버스, `#5ea0f9` 확인 버튼, 태블릿 미디어 쿼리 |
| [comUpload.css](app/src/main/webapp/css/comUpload.css) | 파일 업로드 | 리스트/썸네일(185×225) 두 모드, 삭제 표시 `line-through + #dadada`, 드래그 hover `border:4px dashed #a3a3a3` |
| [tree.css](app/src/main/webapp/css/tree.css) | 트리 컴포넌트 | 최소 스타일, `nodeSel` 배경 `#c0d2ec` |
| [gw.css](app/src/main/webapp/css/gw.css) | 그룹웨어 (독립 앱) | 195px 다크 좌측 메뉴 + 활성 `#fb4a66`, `TBL_ST01/02` 헤더 `#88cbea` teal |

---

## 7. CSS 변수 (커스텀 프로퍼티)

프로젝트에서 `:root { --* }`를 도입한 곳은 **`mgt-admin.css` 한 곳뿐**이다.

```css
--ma-primary/-hov         : #1a74d2 / #1565c0
--ma-secondary/-hov       : #6c757d / #5a6268
--ma-head-bg/-bdr         : #f0f4fa / #d0d6e0
--ma-tbl-head-bg/-bdr     : #3a6ea8 / #2d5a8e
--ma-tbl-hov              : #f0f5ff
--ma-left-active-bg/-txt  : #d6e4f7 / #1a74d2
--ma-left-hover-bg        : #eef1f7
```

나머지 CSS 파일은 색상·크기가 전부 하드코딩되어 있다. 신규 파일 작성 시 위 토큰을 우선 재사용하거나, 파일 상단에 자체 `:root` 블록으로 토큰을 선언한 뒤 사용할 것.

---

## 8. 아이콘 자산

정적 아이콘은 세 개 트리에 분산:

- `/images/common/*` — 레거시 공용 (btn_cal.png, bul_*.png, m_notice_bl01.png, pt2_bg.png 등)
- `/images/eip/button/*` — v2 EIP `btn_WF_*.png` + `_On.png` 세트
- `/images/eip/portal/*`, `/images/eip/adm/*`, `/images/eip/surv/*` — 포탈·관리자·설문 각 서브 트리

폰트 아이콘 라이브러리는 사용하지 않는다 (bootstrap-icons는 `script/react/` 하위 3rd-party 번들에만 존재).

---

## 9. 파일 인벤토리

프로젝트 자체 CSS (라이브러리·빌드 산출물, `ai/doTest.css` 제외):

| 경로 | 라인수 | 역할 |
|---|---|---|
| [css/common.css](app/src/main/webapp/css/common.css) | 505 | v1 전역 리셋 + 로그인/좌측 메뉴/`.list`·`.main`·`.search`·`btn_*` 스프라이트 버튼 세트 |
| [css/common_bak.css](app/src/main/webapp/css/common_bak.css) | 130 | 백업 (사용 안 함) |
| [css/eip.css](app/src/main/webapp/css/eip.css) (루트) | 572 | v1 EIP 메인 페이지(카드 그리드) — 신규 [eip/eip.css](app/src/main/webapp/css/eip/eip.css)와 별개 |
| [css/eip/eip.css](app/src/main/webapp/css/eip/eip.css) | 184 | v2 EIP 엔트리 (`@import` 허브) |
| [css/eip/base/reset.css](app/src/main/webapp/css/eip/base/reset.css) | 104 | v2 CSS 리셋 + 폼 기본값 |
| [css/eip/base/typography.css](app/src/main/webapp/css/eip/base/typography.css) | 29 | v2 폰트 매핑 (`.light`/`.regular`/`.medium`/`.bold`) |
| [css/eip/base/common.css](app/src/main/webapp/css/eip/base/common.css) | 137 | v2 유틸(`.ellipsis`, `.essential`, `.modal-container`) + `btn_WF_*` 스프라이트 세트 |
| [css/eip/layout/layout.css](app/src/main/webapp/css/eip/layout/layout.css) | 32 | v2 최상위 프레임 (top 60 / left 220 / main flex) |
| [css/eip/layout/top.css](app/src/main/webapp/css/eip/layout/top.css) | 11 | 상단 GNB 스타일 |
| [css/eip/layout/left.css](app/src/main/webapp/css/eip/layout/left.css) | 48 | 좌측 메뉴 트리 |
| [css/eip/layout/main.css](app/src/main/webapp/css/eip/layout/main.css) | 155 | 본문 - search-condition, grid, tab, table, flow |
| [css/eip/portal/portal.css](app/src/main/webapp/css/eip/portal/portal.css) | 296 | 포탈 대시보드 CSS Grid + 컴포넌트/포틀릿 |
| [css/eip/etc/eipBbs.css](app/src/main/webapp/css/eip/etc/eipBbs.css) | 79 | 게시판 |
| [css/eip/etc/eipComp.css](app/src/main/webapp/css/eip/etc/eipComp.css) | 21 | 포틀릿 관리 |
| [css/eip/etc/eipSurv.css](app/src/main/webapp/css/eip/etc/eipSurv.css) | 104 | 설문 |
| [css/eip/eipHelp.css](app/src/main/webapp/css/eip/eipHelp.css) | 59 | 도움말 뷰어 (210px 좌목차 + PDF iframe) |
| [css/eip/eipEtc.css](app/src/main/webapp/css/eip/eipEtc.css) | 182 | 소형 유틸 (v2) |
| [css/eip/eipMain.css](app/src/main/webapp/css/eip/eipMain.css) | 16 | 자리표시자 |
| [css/eip/eipMain_back.css](app/src/main/webapp/css/eip/eipMain_back.css) | 1599 | 백업 |
| [css/eip/eipTree.css](app/src/main/webapp/css/eip/eipTree.css) | 20012 | TreeGrid 3rd-party 스타일 덤프 (분석 제외) |
| [css/eipEtc.css](app/src/main/webapp/css/eipEtc.css) (루트) | 182 | v1 EIP 유틸 + 컬러 버튼 세트 + 페이징 + 서브 헤더/네비 |
| [css/mgt-admin.css](app/src/main/webapp/css/mgt-admin.css) | 186 | 관리자 콘솔 디자인 토큰 + BEM 컴포넌트 |
| [css/mgt_layout.css](app/src/main/webapp/css/mgt_layout.css) | 411 | 관리자 콘솔 프레임 (다크 사이드바) + TBL_srh/TBL_default |
| [css/gw.css](app/src/main/webapp/css/gw.css) | 183 | 그룹웨어 독립 앱 |
| [css/popup.css](app/src/main/webapp/css/popup.css) | 119 | 팝업 프레임 + 그라디언트 헤더 + 페이징 |
| [css/login.css](app/src/main/webapp/css/login.css) | 51 | 내부 로그인 |
| [css/extlogin.css](app/src/main/webapp/css/extlogin.css) | 61 | 외부 로그인 |
| [css/font.css](app/src/main/webapp/css/font.css) | 79 | 폰트 로더 (legacy, weight 오류 있음) |
| [css/notoSansKR.css](app/src/main/webapp/css/notoSansKR.css) | 50 | NotoSansKR 300/400/500/700 |
| [css/nanumgothic.css](app/src/main/webapp/css/nanumgothic.css) | 12 | NanumGothic |
| [css/surv_common.css](app/src/main/webapp/css/surv_common.css) | 887 | 조사 시스템 공통 |
| [css/surv_addr.css](app/src/main/webapp/css/surv_addr.css) | 183 | 조사 시스템 주소 |
| [css/signPad.css](app/src/main/webapp/css/signPad.css) | 129 | 전자서명 |
| [css/comUpload.css](app/src/main/webapp/css/comUpload.css) | 343 | 파일 업로드 (리스트/썸네일) |
| [css/tree.css](app/src/main/webapp/css/tree.css) | 27 | 트리 컴포넌트 최소 스킨 |
| [css/egovframework/sample.css](app/src/main/webapp/css/egovframework/sample.css) | 98 | eGovFrame 샘플 (참조용) |

---

## 10. 신규 화면 작성 가이드

1. **어느 세대에 편입할지 먼저 결정한다.**
   - 관리자/기간계 CRUD → `mgt-admin.css` + `mgt_layout.css`의 `--ma-*` 토큰 재사용
   - EIP(사원 포털 내부) → `eip/eip.css` 임포트 체인에 얹고 `.main-*` 클래스 사용
   - 독립 앱 → 파일 상단에 자체 `:root { --* }` 블록을 선언하고 하드코딩을 피할 것
2. **하드코딩 금지.** 새 색을 추가할 일이 있으면 위 팔레트 표에서 근접값을 재사용하거나, 파일 상단 `:root`에 토큰으로 선언 후 사용.
3. **버튼은 v3 `.ma-btn` 계열을 기본**으로 삼고, 아이콘이 필요하면 `background-image`로 얹는다. 기존 v1 이미지 스프라이트는 유지보수 시에만 접촉하고 신규 도입은 피한다.
4. **폰트는 `notoSansKR.css`를 임포트하고, weight는 300/400/500/700만 사용.** `font.css`(legacy)는 참조하지 말 것.
5. **테이블은 v2/v3 표준 border-top 2px + `#f3f3f3`/`#f4f4f4` th** 를 지키고, 필요할 때만 v3 `.ma-tbl` 진한 헤더(`#3a6ea8`) 사용.
6. **레이아웃은 flexbox 기본.** 픽셀 고정 폭(1750/1536/1180 등)은 v1 잔재이므로 신규는 `flex:1 min-width:0` 패턴으로 반응형 대응.
7. **드랍/오버레이/모달은 v2 `.modal-container` 재사용,** 팝업 페이지 자체는 `popup.css`의 그라디언트 헤더(#45ced8→#467be1) 스타일 유지.
8. **아이콘·컬러 스와핑은 CSS 변수로.** 워크스페이스별 브랜드 색이 바뀔 가능성이 있으면 `mgt-admin.css`처럼 `:root` 블록만 갈아끼우면 전체가 반영되도록 설계한다.
