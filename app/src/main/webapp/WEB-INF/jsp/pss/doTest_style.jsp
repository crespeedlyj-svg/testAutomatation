<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%--
  doTest_style.jsp
  CSS는 외부 파일로 분리되었습니다: css/ai/doTest.css
  워크스페이스별 색상 커스터마이징 → doTest.css 상단 :root { } 변수 블록만 수정
  ─ 버튼   : common.css 클래스명 매핑
              btn_search  #0868b6 → .btn-info
              btn_tran    #ff9d47 → .btn-warning
              btn_close   #8499B3 → .btn-gray
              btn_WF_Save #f15c5c → .btn-danger
--%>
<link rel="stylesheet" href="<c:url value='/css/ai/doTest.css'/>">
