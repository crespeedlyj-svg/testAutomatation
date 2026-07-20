package cres.pss.service;

import java.io.InputStream;
import java.util.*;
import javax.servlet.http.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * 시나리오 Excel 업로드 / 소스목록 양식 다운로드
 *
 * ScenarioService 에서 분리한 Excel I/O 전담 서비스.
 */
@Service
public class ScenarioExcelService {

    // ── 소스목록 엑셀 업로드 ──────────────────────────────────────────────────

    /**
     * 업로드된 엑셀 파일에서 소스명을 읽어 AiStateStore.PENDING_FILES 에 저장한다.
     *
     * 엑셀 형식:
     *   0행: 헤더 ("소스명")
     *   1행~: A열 = 소스명
     *
     * @return {success, prefix, sources, count} 또는 {success:false, message}
     */
    public Map<String, Object> uploadSourceList(HttpServletRequest request,
                                                 MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return error("파일이 없습니다.");
        }
        String origName = file.getOriginalFilename();
        if (origName == null
                || (!origName.toLowerCase().endsWith(".xlsx")
                    && !origName.toLowerCase().endsWith(".xls"))) {
            return error(".xlsx 또는 .xls 파일만 업로드 가능합니다.");
        }

        Workbook wb = null;
        try {
            try (InputStream is = file.getInputStream()) {
                wb = WorkbookFactory.create(is);
            }

            Sheet sheet = wb.getSheetAt(0);
            DataFormatter fmt = new DataFormatter();
            List<Map<String, Object>> sources = new ArrayList<>();
            Map<String, List<Map<String, Object>>> groups = new LinkedHashMap<>();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {   // 0행은 헤더
                Row row = sheet.getRow(i);
                if (row == null) continue;
                Cell nameCell = row.getCell(0);
                if (nameCell == null) continue;
                String srcName = fmt.formatCellValue(nameCell).trim();
                if (srcName.isEmpty()) continue;

                Map<String, Object> src = new LinkedHashMap<>();
                src.put("displayName", srcName);
                src.put("rawName",     srcName);
                src.put("origin",      "");
                sources.add(src);

                // prefix 추출: "PUR_5110M" → "pur", "GDC_0010M" → "gdc"
                String upper = srcName.toUpperCase()
                    .replaceAll("(?i)\\.xfdl.*$|\\.java$|\\.xml$", "").trim();
                int us = upper.indexOf('_');
                String pfx = us > 0 ? upper.substring(0, us).toLowerCase() : "unknown";
                groups.computeIfAbsent(pfx, k -> new ArrayList<>()).add(src);
            }

            if (sources.isEmpty())
                return error("소스 목록이 비어 있습니다. 1행은 헤더(소스명), 2행부터 소스명을 입력하세요.");

            // prefix별로 각각 PENDING_FILES 저장 — 혼합 업로드 대응
            for (Map.Entry<String, List<Map<String, Object>>> e : groups.entrySet()) {
                AiStateStore.PENDING_FILES.put(e.getKey(), e.getValue());
            }

            // 첫 번째 prefix를 대표값으로 반환 (프론트엔드 currentPrefix 호환)
            String firstPrefix = groups.isEmpty() ? "" : groups.keySet().iterator().next();
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("success",  true);
            result.put("prefix",   firstPrefix);
            result.put("prefixes", new ArrayList<>(groups.keySet()));
            result.put("sources",  sources);
            result.put("count",    sources.size());
            return result;

        } catch (Exception e) {
            return error("업로드 처리 오류: " + e.getMessage());
        } finally {
            if (wb != null) {
                try { wb.close(); } catch (Exception ignore) {}
            }
        }
    }

    // ── 소스목록 양식 다운로드 ─────────────────────────────────────────────────

    /** 빈 소스목록 엑셀 양식을 HTTP 응답으로 전송한다. */
    public void downloadSourceTemplate(HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        response.setContentType(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition",
            "attachment; filename*=UTF-8''%EC%86%8C%EC%8A%A4%EB%AA%A9%EB%A1%9D_%EC%96%91%EC%8B%9D.xlsx");

        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            XSSFSheet sheet = wb.createSheet("소스목록");

            // 헤더 스타일
            XSSFCellStyle headerStyle = wb.createCellStyle();
            headerStyle.setFillForegroundColor(
                new org.apache.poi.xssf.usermodel.XSSFColor(
                    new byte[]{(byte)26,(byte)58,(byte)92}, null));
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            XSSFFont headerFont = wb.createFont();
            headerFont.setColor(
                new org.apache.poi.xssf.usermodel.XSSFColor(
                    new byte[]{(byte)255,(byte)255,(byte)255}, null));
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            // 헤더 행
            Row header = sheet.createRow(0);
            Cell h0 = header.createCell(0);
            h0.setCellValue("소스명");
            h0.setCellStyle(headerStyle);

            // 샘플 데이터
            String[] samples = {"PUR_5110M","PUR_5115M","PUR_5116P","PUR_5210M"};
            for (int i = 0; i < samples.length; i++)
                sheet.createRow(i + 1).createCell(0).setCellValue(samples[i]);

            sheet.setColumnWidth(0, 20 * 256);
            wb.write(response.getOutputStream());
        }
    }

    // ── 유틸 ──────────────────────────────────────────────────────────────────

    private Map<String, Object> error(String msg) {
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("success", false);
        r.put("message", msg);
        return r;
    }
}
