package cres.pss.service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * 다중 형식 내보내기 서비스 (Java 라이브러리 사용)
 *
 * <p>지원 형식:
 * <ul>
 *   <li>xlsx  — Apache POI XSSFWorkbook</li>
 *   <li>html  — Java String Template (라이브러리 불필요)</li>
 *   <li>docx  — Apache POI XWPF</li>
 *   <li>pdf   — iText 5 + itext-asian (한글 폰트)</li>
 * </ul>
 */
@Service
public class ExportService {

    @Value("${ai.template.integ-scenario-xlsx:}")
    private String templateScenarioPath;

    @Value("${ai.template.integ-scenario-hwpx:}")
    private String templateHwpxPath;

    // ─────────────────────────────────────────────────────────────────────
    //  공통 유틸
    // ─────────────────────────────────────────────────────────────────────

    private static String sv(Map<String, Object> m, String key) {
        if (m == null) return "";
        Object v = m.get(key);
        return v == null ? "" : v.toString();
    }

    private static String esc(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }

    // ═════════════════════════════════════════════════════════════════════
    //  XLSX — Apache POI XSSFWorkbook
    // ═════════════════════════════════════════════════════════════════════

    /**
     * 시나리오 xlsx 생성 (결과 컬럼 제외).
     * unit_test_scenario_generator.md 7.2절 14컬럼 기준.
     * SCENARIO_STORE 키: 한글 필드명("테스트명", "사전조건") + "URL"(대문자) 사용.
     */
    public byte[] buildScenarioXlsx(List<Map<String, Object>> rows) throws Exception {
        XSSFWorkbook wb = new XSSFWorkbook();
        XSSFSheet sheet = wb.createSheet("시나리오");

        XSSFCellStyle hStyle    = makeHeaderStyle(wb);
        XSSFCellStyle wStyle    = makeWrapStyle(wb, null);
        XSSFCellStyle evenStyle = makeWrapStyle(wb, new byte[]{(byte)0xf5,(byte)0xf8,(byte)0xfc});

        String[] cols   = {"No","화면명","테스트명","테스트유형","CRUD","API URL","서비스ID","입력DS","입력컬럼","입력값","출력DS","사전조건","기대결과","메뉴경로"};
        int[]    widths = {  5,   16,     24,         8,          8,     30,       12,        10,      18,       20,      10,     20,         24,       16};

        writeXlsxHeader(sheet, cols, widths, hStyle);

        for (int i = 0; i < rows.size(); i++) {
            Map<String, Object> s = rows.get(i);
            XSSFCellStyle rs = (i % 2 == 1) ? evenStyle : wStyle;
            Row row = sheet.createRow(i + 1);
            row.setHeightInPoints(18);
            sc(row,  0, String.valueOf(i + 1),     rs);
            sc(row,  1, sv(s, "화면명"),            rs);
            sc(row,  2, sv(s, "테스트명"),          rs);
            sc(row,  3, sv(s, "testType"),          rs);
            sc(row,  4, sv(s, "crudType"),          rs);
            sc(row,  5, sv(s, "URL"),               rs);
            sc(row,  6, sv(s, "serviceId"),         rs);
            sc(row,  7, sv(s, "inputDsId"),         rs);
            sc(row,  8, sv(s, "inputCols"),         rs);
            sc(row,  9, sv(s, "inputValues"),       rs);
            sc(row, 10, sv(s, "outputDsId"),        rs);
            sc(row, 11, sv(s, "사전조건"),           rs);
            sc(row, 12, sv(s, "expectedResult"),    rs);
            sc(row, 13, sv(s, "menuPath"),          rs);
        }

        return xlsxBytes(wb);
    }

    /**
     * 양식 기반 xlsx 생성 — 문서 표지(제목/작성일/작성자) + 시나리오 시트.
     * 시나리오 시트는 buildScenarioXlsx()와 동일한 14컬럼 구성.
     */
    public byte[] buildScenarioTemplateXlsx(List<Map<String, Object>> rows,
                                             String date, String author,
                                             String title) throws Exception {
        boolean useTemplate = templateScenarioPath != null
                && !templateScenarioPath.isEmpty()
                && new File(templateScenarioPath).exists();

        XSSFWorkbook wb;
        if (useTemplate) {
            wb = (XSSFWorkbook) WorkbookFactory.create(new File(templateScenarioPath));
            // 문서표지 시트 자동입력 (7.5절)
            XSSFSheet cover = wb.getSheet("문서표지");
            if (cover != null) {
                String docDate = (date != null && !date.isEmpty()) ? date
                        : new SimpleDateFormat("yyyy. M. d").format(new Date());
                try { cover.getRow(12).getCell(0).setCellValue(docDate); } catch (Exception ignored) {}
                try {
                    Cell a6 = cover.getRow(5).getCell(0);
                    if (a6 != null) {
                        String orig = a6.getStringCellValue();
                        String replaced = orig.replaceAll("_{2,}", title != null ? title : "");
                        if (!replaced.equals(orig)) a6.setCellValue(replaced);
                    }
                } catch (Exception ignored) {}
            }
            XSSFSheet rev = wb.getSheet("개정이력");
            if (rev != null) {
                try {
                    rev.getRow(3).getCell(3).setCellValue(author != null ? author : "");
                } catch (Exception ignored) {}
            }
        } else {
            wb = new XSSFWorkbook();
            // ─ 표지 시트 (양식파일 없을 때 기본 생성)
            XSSFSheet cover = wb.createSheet("표지");
            XSSFCellStyle titleStyle = wb.createCellStyle();
            titleStyle.setAlignment(HorizontalAlignment.CENTER);
            XSSFFont titleFont = wb.createFont();
            titleFont.setBold(true); titleFont.setFontHeightInPoints((short) 18);
            titleStyle.setFont(titleFont);
            Row r0 = cover.createRow(2);
            r0.setHeightInPoints(36);
            Cell tc = r0.createCell(1);
            tc.setCellValue(title != null ? title : "통합테스트시나리오");
            tc.setCellStyle(titleStyle);
            cover.addMergedRegion(new CellRangeAddress(2, 2, 1, 6));
            XSSFCellStyle metaStyle = wb.createCellStyle();
            metaStyle.setAlignment(HorizontalAlignment.LEFT);
            String[] metaLabels = {"작성일", "작성자", "총 건수"};
            String[] metaVals   = {
                date   != null && !date.isEmpty()   ? date   : new SimpleDateFormat("yyyy-MM-dd").format(new Date()),
                author != null && !author.isEmpty() ? author : "",
                String.valueOf(rows.size()) + "건"
            };
            for (int i = 0; i < metaLabels.length; i++) {
                Row mr = cover.createRow(4 + i);
                mr.setHeightInPoints(20);
                Cell lc = mr.createCell(1); lc.setCellValue(metaLabels[i]);
                Cell vc = mr.createCell(2); vc.setCellValue(metaVals[i]);
            }
        }

        // ─ 시나리오 시트 (14컬럼 — buildScenarioXlsx와 동일)
        XSSFSheet sheet   = wb.createSheet("시나리오");
        XSSFCellStyle hSt = makeHeaderStyle(wb);
        XSSFCellStyle wSt = makeWrapStyle(wb, null);
        XSSFCellStyle eSt = makeWrapStyle(wb, new byte[]{(byte)0xf5,(byte)0xf8,(byte)0xfc});

        String[] cols   = {"No","화면명","테스트명","테스트유형","CRUD","API URL","서비스ID","입력DS","입력컬럼","입력값","출력DS","사전조건","기대결과","메뉴경로"};
        int[]    widths = {  5,   16,     24,         8,          8,     30,       12,        10,      18,       20,      10,     20,         24,       16};
        writeXlsxHeader(sheet, cols, widths, hSt);

        for (int i = 0; i < rows.size(); i++) {
            Map<String, Object> s = rows.get(i);
            XSSFCellStyle rs = (i % 2 == 1) ? eSt : wSt;
            Row row = sheet.createRow(i + 1);
            row.setHeightInPoints(18);
            sc(row,  0, String.valueOf(i + 1),     rs);
            sc(row,  1, sv(s, "화면명"),            rs);
            sc(row,  2, sv(s, "테스트명"),          rs);
            sc(row,  3, sv(s, "testType"),          rs);
            sc(row,  4, sv(s, "crudType"),          rs);
            sc(row,  5, sv(s, "URL"),               rs);
            sc(row,  6, sv(s, "serviceId"),         rs);
            sc(row,  7, sv(s, "inputDsId"),         rs);
            sc(row,  8, sv(s, "inputCols"),         rs);
            sc(row,  9, sv(s, "inputValues"),       rs);
            sc(row, 10, sv(s, "outputDsId"),        rs);
            sc(row, 11, sv(s, "사전조건"),           rs);
            sc(row, 12, sv(s, "expectedResult"),    rs);
            sc(row, 13, sv(s, "menuPath"),          rs);
        }

        return xlsxBytes(wb);
    }

    /**
     * HWPX 생성.
     * ai.template.integ-scenario-hwpx 설정 경로의 양식 파일이 존재하면 ZipInputStream으로 읽어
     * content.hml에 시나리오 행을 삽입한다 (unit_test_scenario_generator.md 7.4.3절).
     * 양식 파일이 없으면 처음부터 HML XML을 생성하여 ZIP으로 패키징한다 (폴백).
     */
    public byte[] buildScenarioHwpx(List<Map<String, Object>> rows,
                                     String date, String author,
                                     String title) throws Exception {
        if (templateHwpxPath != null && !templateHwpxPath.isEmpty()) {
            java.io.File tmpl = new java.io.File(templateHwpxPath);
            if (tmpl.exists()) {
                return buildHwpxFromTemplate(tmpl, rows, date, author, title);
            }
        }
        return buildHwpxFromScratch(rows, date, author, title);
    }

    /**
     * 양식 hwpx(ZIP)를 읽어 content.hml에 시나리오 행을 삽입한다.
     */
    private byte[] buildHwpxFromTemplate(java.io.File hwpxFile,
                                          List<Map<String, Object>> rows,
                                          String date, String author,
                                          String title) throws Exception {
        byte[] templateBytes = java.nio.file.Files.readAllBytes(hwpxFile.toPath());
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (java.util.zip.ZipOutputStream zos = new java.util.zip.ZipOutputStream(baos,
                     java.nio.charset.StandardCharsets.UTF_8);
             java.util.zip.ZipInputStream  zis = new java.util.zip.ZipInputStream(
                     new java.io.ByteArrayInputStream(templateBytes),
                     java.nio.charset.StandardCharsets.UTF_8)) {
            java.util.zip.ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                byte[] data;
                if ("Contents/content.hml".equals(entry.getName())) {
                    String hml = new String(readZipEntryBytes(zis),
                            java.nio.charset.StandardCharsets.UTF_8);
                    hml = insertScenarioRowsIntoHml(hml, rows);
                    data = hml.getBytes(java.nio.charset.StandardCharsets.UTF_8);
                } else {
                    data = readZipEntryBytes(zis);
                }
                zos.putNextEntry(new java.util.zip.ZipEntry(entry.getName()));
                zos.write(data);
                zos.closeEntry();
            }
        }
        return baos.toByteArray();
    }

    private byte[] readZipEntryBytes(java.util.zip.ZipInputStream zis) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buf = new byte[4096];
        int n;
        while ((n = zis.read(buf)) != -1) out.write(buf, 0, n);
        return out.toByteArray();
    }

    private String insertScenarioRowsIntoHml(String hml, List<Map<String, Object>> rows) {
        StringBuilder rowsXml = new StringBuilder();
        for (int i = 0; i < rows.size(); i++) {
            Map<String, Object> s = rows.get(i);
            rowsXml.append(buildHpRow(
                String.valueOf(i + 1),
                sv(s, "화면명"),
                sv(s, "테스트명"),
                sv(s, "사전조건"),
                sv(s, "expectedResult")
            ));
        }
        // </hp:tbl> 직전에 행 삽입
        String marker = "</hp:tbl>";
        int idx = hml.lastIndexOf(marker);
        if (idx >= 0) {
            return hml.substring(0, idx) + rowsXml + hml.substring(idx);
        }
        return hml;
    }

    /**
     * 양식 파일 없을 때 HML XML을 처음부터 생성하여 ZIP 패키징 (폴백).
     */
    private byte[] buildHwpxFromScratch(List<Map<String, Object>> rows,
                                         String date, String author,
                                         String title) throws Exception {
        String docDate  = (date   != null && !date.isEmpty())   ? date   : new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        String docAuth  = (author != null && !author.isEmpty()) ? author : "";
        String docTitle = (title  != null && !title.isEmpty())  ? title  : "통합테스트시나리오";

        // HML XML 생성
        StringBuilder rowsXml = new StringBuilder();
        rowsXml.append(buildHpRow("No","화면명","테스트명","사전조건","기대결과"));
        for (int i = 0; i < rows.size(); i++) {
            Map<String, Object> s = rows.get(i);
            rowsXml.append(buildHpRow(
                String.valueOf(i + 1),
                sv(s, "화면명"),
                sv(s, "테스트명"),
                sv(s, "사전조건"),
                sv(s, "expectedResult")
            ));
        }

        String hml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
            + "<hml xmlns:hp=\"http://www.hancom.co.kr/hwpml/2012/paragraph\""
            + " xmlns:hc=\"http://www.hancom.co.kr/hwpml/2012/core\" version=\"1.2\">\n"
            + "<hp:body><hp:section>\n"
            + "<hp:p><hp:run><hp:t>" + escXml(docTitle) + "</hp:t></hp:run></hp:p>\n"
            + "<hp:p><hp:run><hp:t>작성일: " + escXml(docDate)
                + "  작성자: " + escXml(docAuth)
                + "  총 " + rows.size() + "건</hp:t></hp:run></hp:p>\n"
            + "<hp:tbl>\n"
            + rowsXml.toString()
            + "</hp:tbl>\n"
            + "</hp:section></hp:body></hml>";

        // ZIP 패키징
        ByteArrayOutputStream zipOut = new ByteArrayOutputStream();
        try (java.util.zip.ZipOutputStream zos = new java.util.zip.ZipOutputStream(zipOut,
                java.nio.charset.StandardCharsets.UTF_8)) {
            // mimetype (압축 없이)
            java.util.zip.ZipEntry mime = new java.util.zip.ZipEntry("mimetype");
            mime.setMethod(java.util.zip.ZipEntry.STORED);
            byte[] mimeBytes = "application/hwp+zip".getBytes("UTF-8");
            mime.setSize(mimeBytes.length); mime.setCrc(crc32(mimeBytes));
            zos.putNextEntry(mime); zos.write(mimeBytes); zos.closeEntry();
            // 본문 HML
            addZipEntry(zos, "Contents/content.hml", hml.getBytes("UTF-8"));
            // container.xml
            String container = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
                + "<container>\n"
                + "  <rootfiles>\n"
                + "    <rootfile full-path=\"Contents/content.hml\" media-type=\"application/xml\"/>\n"
                + "  </rootfiles>\n"
                + "</container>";
            addZipEntry(zos, "META-INF/container.xml", container.getBytes("UTF-8"));
        }
        return zipOut.toByteArray();
    }

    private static String buildHpRow(String... cells) {
        StringBuilder sb = new StringBuilder("<hp:tr>");
        for (String c : cells) {
            sb.append("<hp:tc><hp:p><hp:run><hp:t>")
              .append(escXml(c))
              .append("</hp:t></hp:run></hp:p></hp:tc>");
        }
        sb.append("</hp:tr>\n");
        return sb.toString();
    }

    private static String escXml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace("\"", "&quot;").replace("'", "&apos;");
    }

    private static long crc32(byte[] data) {
        java.util.zip.CRC32 crc = new java.util.zip.CRC32();
        crc.update(data); return crc.getValue();
    }

    private static void addZipEntry(java.util.zip.ZipOutputStream zos, String name, byte[] data)
            throws IOException {
        java.util.zip.ZipEntry entry = new java.util.zip.ZipEntry(name);
        entry.setSize(data.length);
        zos.putNextEntry(entry); zos.write(data); zos.closeEntry();
    }

    /**
     * 시나리오 PDF 생성 — 5컬럼 (순번·화면명·테스트명·사전조건·기대결과).
     * SCENARIO_STORE 키: "테스트명", "사전조건" 사용.
     */
    public byte[] buildScenarioPdf(List<Map<String, Object>> rows,
                                    String date, String author,
                                    String title) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document pdf = new Document(PageSize.A4.rotate(), 20f, 20f, 28f, 18f);
        PdfWriter.getInstance(pdf, out);
        pdf.open();

        BaseFont korBf;
        try {
            korBf = BaseFont.createFont("HYGoThic-Medium", "UniKS-UCS2-H", BaseFont.NOT_EMBEDDED);
        } catch (Exception e) {
            korBf = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
        }

        Font titleFont  = new Font(korBf, 16, Font.BOLD);
        Font headerFont = new Font(korBf,  9, Font.BOLD,   BaseColor.WHITE);
        Font dataFont   = new Font(korBf,  8, Font.NORMAL);
        Font metaFont   = new Font(korBf,  8, Font.NORMAL, new BaseColor(0x88, 0x88, 0x88));

        String docDate = (date != null && !date.isEmpty()) ? date
            : new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        String docAuth = (author != null && !author.isEmpty()) ? author : "";

        Paragraph titleP = new Paragraph(title != null ? title : "단위테스트시나리오", titleFont);
        titleP.setAlignment(Element.ALIGN_CENTER);
        titleP.setSpacingAfter(5f);
        pdf.add(titleP);

        Paragraph metaP = new Paragraph(
            "작성일: " + docDate + "  |  작성자: " + docAuth + "  |  총 " + rows.size() + "건", metaFont);
        metaP.setAlignment(Element.ALIGN_CENTER);
        metaP.setSpacingAfter(10f);
        pdf.add(metaP);

        String[] hCols    = {"순번", "화면명", "테스트명", "사전조건", "기대결과"};
        float[]  colWidths = {3f, 12f, 20f, 18f, 18f};

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100f);
        table.setWidths(colWidths);
        table.setHeaderRows(1);

        BaseColor hBg    = new BaseColor(0x29, 0x4c, 0x9a);
        BaseColor evenBg = new BaseColor(0xf5, 0xf8, 0xfc);

        for (String h : hCols) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(hBg);
            cell.setPadding(4f);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            table.addCell(cell);
        }

        for (int i = 0; i < rows.size(); i++) {
            Map<String, Object> s = rows.get(i);
            BaseColor rowBg = i % 2 == 1 ? evenBg : null;
            String screenTitle = sv(s, "화면명");
            if (screenTitle.isEmpty()) screenTitle = sv(s, "screenName");
            String[] vals = {
                String.valueOf(i + 1),
                screenTitle,
                sv(s, "테스트명"),
                sv(s, "사전조건"),
                sv(s, "expectedResult")
            };
            for (String v : vals) {
                PdfPCell cell = new PdfPCell(new Phrase(v, dataFont));
                cell.setPadding(3f);
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                if (rowBg != null) cell.setBackgroundColor(rowBg);
                table.addCell(cell);
            }
        }

        pdf.add(table);
        pdf.close();
        return out.toByteArray();
    }

    /**
     * 결과서 xlsx 생성 (결과·비고 컬럼 포함, PASS/FAIL 배경색).
     * SCENARIO_STORE 키: "테스트명", "사전조건", "URL" 사용.
     */
    public byte[] buildResultXlsx(List<Map<String, Object>> rows) throws Exception {
        XSSFWorkbook wb = new XSSFWorkbook();
        XSSFSheet sheet = wb.createSheet("테스트결과");

        XSSFCellStyle hStyle    = makeHeaderStyle(wb);
        XSSFCellStyle passStyle = makeWrapStyle(wb, new byte[]{(byte)0xdc,(byte)0xfc,(byte)0xe7});
        XSSFCellStyle failStyle = makeWrapStyle(wb, new byte[]{(byte)0xfe,(byte)0xe2,(byte)0xe2});
        XSSFCellStyle wStyle    = makeWrapStyle(wb, null);

        String[] cols   = {"No","구분","시나리오ID","테스트명","URL","Method","메뉴","기대결과","결과","비고"};
        int[]    widths = { 5,   8,    18,         22,        28,   8,      14,   24,        9,   28};

        writeXlsxHeader(sheet, cols, widths, hStyle);

        int pass = 0, fail = 0;
        for (int i = 0; i < rows.size(); i++) {
            Map<String, Object> s = rows.get(i);
            String result = sv(s, "testResult");
            XSSFCellStyle rs = "PASS".equals(result) ? passStyle
                             : "FAIL".equals(result) ? failStyle : wStyle;
            if ("PASS".equals(result)) pass++;
            else if ("FAIL".equals(result)) fail++;

            Row row = sheet.createRow(i + 1);
            row.setHeightInPoints(18);
            sc(row, 0, String.valueOf(i + 1),   rs);
            sc(row, 1, sv(s, "testType"),        rs);
            sc(row, 2, sv(s, "scenarioId"),      rs);
            sc(row, 3, sv(s, "테스트명"),         rs);
            sc(row, 4, sv(s, "URL"),             rs);
            sc(row, 5, sv(s, "method"),          rs);
            sc(row, 6, sv(s, "menuName"),        rs);
            sc(row, 7, sv(s, "expectedResult"),  rs);
            sc(row, 8, result,                   rs);
            sc(row, 9, sv(s, "remark"),          rs);
        }

        // 합계 행
        int sumRowIdx = rows.size() + 2;
        XSSFCellStyle sumStyle = makeWrapStyle(wb, new byte[]{(byte)0xf6,(byte)0xf8,(byte)0xf9});
        Row sumRow = sheet.createRow(sumRowIdx);
        Cell sumCell = sumRow.createCell(0);
        sumCell.setCellValue("합계: 전체 " + rows.size() + "건 / PASS " + pass + "건 / FAIL " + fail + "건");
        sumCell.setCellStyle(sumStyle);
        sheet.addMergedRegion(new CellRangeAddress(sumRowIdx, sumRowIdx, 0, 9));

        return xlsxBytes(wb);
    }

    private void writeXlsxHeader(XSSFSheet sheet, String[] cols, int[] widths, XSSFCellStyle hStyle) {
        Row hRow = sheet.createRow(0);
        hRow.setHeightInPoints(22);
        for (int i = 0; i < cols.length; i++) {
            Cell c = hRow.createCell(i);
            c.setCellValue(cols[i]);
            c.setCellStyle(hStyle);
            sheet.setColumnWidth(i, widths[i] * 256);
        }
        sheet.createFreezePane(0, 1);
    }

    // ═════════════════════════════════════════════════════════════════════
    //  HTML — Java String Template
    // ═════════════════════════════════════════════════════════════════════

    /**
     * HTML 생성 (시나리오 또는 결과서).
     * SCENARIO_STORE 키: "테스트명", "사전조건", "URL" 사용.
     *
     * @param includeResult true → 결과·비고 컬럼 + 요약 박스 포함
     */
    public byte[] buildHtml(String title, List<Map<String, Object>> rows,
                             boolean includeResult) throws Exception {
        String ts = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date());
        int pass = 0, fail = 0;
        if (includeResult) {
            for (Map<String, Object> s : rows) {
                String r = sv(s, "testResult");
                if ("PASS".equals(r)) pass++;
                else if ("FAIL".equals(r)) fail++;
            }
        }

        StringBuilder sb = new StringBuilder(16384);
        sb.append("<!DOCTYPE html>\n<html lang='ko'><head><meta charset='UTF-8'>\n");
        sb.append("<title>").append(esc(title)).append("</title>\n");
        sb.append("<style>\n");
        sb.append("body{font-family:'맑은 고딕','Malgun Gothic',sans-serif;font-size:12px;");
        sb.append("margin:30px;color:#323232;background:#f3f5f9;}\n");
        sb.append(".wrap{background:#fff;padding:24px;border-top:3px solid #009bc8;");
        sb.append("box-shadow:0 2px 8px rgba(0,0,0,.08);}\n");
        sb.append("h1{color:#294c9a;font-size:18px;margin-bottom:4px;}\n");
        sb.append(".meta{color:#888;font-size:11px;margin-bottom:16px;}\n");
        sb.append(".summary{display:flex;gap:12px;margin:12px 0 20px;}\n");
        sb.append(".sum-box{padding:10px 22px;border-top:2px solid #009bc8;");
        sb.append("background:#f6f8f9;text-align:center;}\n");
        sb.append(".num{font-size:24px;font-weight:700;color:#294c9a;}\n");
        sb.append(".lbl{font-size:10px;color:#888;margin-top:2px;}\n");
        sb.append(".pass-n{color:#15803d!important;} .fail-n{color:#b91c1c!important;}\n");
        sb.append("table{width:100%;border-collapse:collapse;font-size:11px;}\n");
        sb.append("th{background:#294c9a;color:#fff;padding:7px 6px;text-align:left;");
        sb.append("border:1px solid #ccc;white-space:nowrap;}\n");
        sb.append("td{padding:5px 6px;border:1px solid #e0e0e0;vertical-align:top;word-break:break-all;}\n");
        sb.append("tr:nth-child(even) td{background:#fafafa;}\n");
        sb.append(".badge{display:inline-block;padding:1px 7px;border-radius:99px;");
        sb.append("font-size:10px;font-weight:700;}\n");
        sb.append(".badge.pass{background:#dcfce7;color:#15803d;}\n");
        sb.append(".badge.fail{background:#fee2e2;color:#b91c1c;}\n");
        sb.append(".note{font-size:10px;color:#888;margin-top:16px;");
        sb.append("border-top:1px solid #e0e0e0;padding-top:8px;}\n");
        sb.append("@media print{body{margin:10px;}}\n");
        sb.append("</style></head><body><div class='wrap'>\n");

        sb.append("<h1>").append(esc(title)).append("</h1>\n");
        sb.append("<div class='meta'>생성일시: ").append(ts)
          .append(" &nbsp;|&nbsp; 총 ").append(rows.size()).append("건")
          .append(" &nbsp;|&nbsp; Java HTML 생성</div>\n");

        if (includeResult) {
            sb.append("<div class='summary'>\n");
            sb.append("<div class='sum-box'><div class='num'>").append(rows.size())
              .append("</div><div class='lbl'>전체</div></div>\n");
            sb.append("<div class='sum-box'><div class='num pass-n'>").append(pass)
              .append("</div><div class='lbl'>PASS</div></div>\n");
            sb.append("<div class='sum-box'><div class='num fail-n'>").append(fail)
              .append("</div><div class='lbl'>FAIL</div></div>\n");
            sb.append("</div>\n");
        }

        sb.append("<table><thead><tr>\n");
        sb.append("<th>No</th><th>구분</th><th>시나리오ID</th><th>테스트명</th>");
        sb.append("<th>URL</th><th>Method</th><th>메뉴</th><th>기대결과</th><th>사전조건</th>");
        if (includeResult) sb.append("<th>결과</th><th>비고</th>");
        sb.append("\n</tr></thead><tbody>\n");

        for (int i = 0; i < rows.size(); i++) {
            Map<String, Object> s = rows.get(i);
            String result = sv(s, "testResult");
            sb.append("<tr>");
            htd(sb, String.valueOf(i + 1));
            htd(sb, sv(s, "testType"));
            htd(sb, sv(s, "scenarioId"));
            htd(sb, sv(s, "테스트명"));
            sb.append("<td style='font-size:10px'>").append(esc(sv(s, "URL"))).append("</td>");
            htd(sb, sv(s, "method"));
            htd(sb, sv(s, "menuName"));
            htd(sb, sv(s, "expectedResult"));
            htd(sb, sv(s, "사전조건"));
            if (includeResult) {
                String cls = "PASS".equals(result) ? "pass" : "FAIL".equals(result) ? "fail" : "";
                sb.append("<td><span class='badge ").append(cls).append("'>")
                  .append(esc(result)).append("</span></td>");
                htd(sb, sv(s, "remark"));
            }
            sb.append("</tr>\n");
        }
        sb.append("</tbody></table>\n");
        sb.append("<p class='note'>* 이 파일은 Java String Template으로 생성되었습니다</p>\n");
        sb.append("</div></body></html>");

        return sb.toString().getBytes("UTF-8");
    }

    private void htd(StringBuilder sb, String val) {
        sb.append("<td>").append(esc(val)).append("</td>");
    }

    // ═════════════════════════════════════════════════════════════════════
    //  PDF — iText 5 + itext-asian (한글 폰트)
    // ═════════════════════════════════════════════════════════════════════

    /**
     * PDF 생성 (A4 가로, 한글 CJK 폰트).
     * SCENARIO_STORE 키: "테스트명", "사전조건", "URL" 사용.
     */
    public byte[] buildPdf(String title, List<Map<String, Object>> rows,
                            boolean includeResult) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document pdf = new Document(PageSize.A4.rotate(), 20f, 20f, 28f, 18f);
        PdfWriter.getInstance(pdf, out);
        pdf.open();

        BaseFont korBf;
        try {
            korBf = BaseFont.createFont("HYGoThic-Medium", "UniKS-UCS2-H", BaseFont.NOT_EMBEDDED);
        } catch (Exception e) {
            korBf = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
        }

        Font titleFont  = new Font(korBf, 16, Font.BOLD);
        Font headerFont = new Font(korBf,  9, Font.BOLD,   BaseColor.WHITE);
        Font dataFont   = new Font(korBf,  8, Font.NORMAL);
        Font metaFont   = new Font(korBf,  8, Font.NORMAL, new BaseColor(0x88, 0x88, 0x88));
        Font passFont   = new Font(korBf,  8, Font.BOLD,   new BaseColor(0x15, 0x80, 0x3d));
        Font failFont   = new Font(korBf,  8, Font.BOLD,   new BaseColor(0xb9, 0x1c, 0x1c));

        String ts = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date());

        // 제목
        Paragraph titleP = new Paragraph(title, titleFont);
        titleP.setAlignment(Element.ALIGN_CENTER);
        titleP.setSpacingAfter(5f);
        pdf.add(titleP);

        // 메타
        Paragraph metaP = new Paragraph(
            "생성: " + ts + "  |  총 " + rows.size() + "건  |  Java iText5 생성", metaFont);
        metaP.setAlignment(Element.ALIGN_CENTER);
        metaP.setSpacingAfter(10f);
        pdf.add(metaP);

        // 통계
        if (includeResult) {
            int pass = 0, fail = 0;
            for (Map<String, Object> s : rows) {
                String r = sv(s, "testResult");
                if ("PASS".equals(r)) pass++;
                else if ("FAIL".equals(r)) fail++;
            }
            Font statFont = new Font(korBf, 11, Font.BOLD);
            Paragraph statP = new Paragraph(
                "전체: " + rows.size() + "건    PASS: " + pass + "건    FAIL: " + fail + "건",
                statFont);
            statP.setSpacingAfter(10f);
            pdf.add(statP);
        }

        // 컬럼 정의
        boolean res = includeResult;
        int colCount = res ? 11 : 9;
        String[] hCols = res
            ? new String[]{"No","구분","시나리오ID","테스트명","URL","Method","메뉴","기대결과","사전조건","결과","비고"}
            : new String[]{"No","구분","시나리오ID","테스트명","URL","Method","메뉴","기대결과","사전조건"};
        float[] colWidths = res
            ? new float[]{3f, 5f, 11f, 16f, 18f, 6f, 9f, 14f, 12f, 6f, 14f}
            : new float[]{3f, 5f, 12f, 18f, 22f, 7f, 10f, 18f, 12f};

        PdfPTable table = new PdfPTable(colCount);
        table.setWidthPercentage(100f);
        table.setWidths(colWidths);
        table.setHeaderRows(1);

        // 헤더 셀
        BaseColor hBg = new BaseColor(0x29, 0x4c, 0x9a);
        for (String h : hCols) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(hBg);
            cell.setPadding(4f);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            table.addCell(cell);
        }

        // 데이터 셀
        BaseColor evenBg = new BaseColor(0xf5, 0xf8, 0xfc);
        BaseColor passBg = new BaseColor(0xdc, 0xfc, 0xe7);
        BaseColor failBg = new BaseColor(0xfe, 0xe2, 0xe2);

        for (int i = 0; i < rows.size(); i++) {
            Map<String, Object> s = rows.get(i);
            String result = sv(s, "testResult");
            BaseColor rowBg = "PASS".equals(result) ? passBg
                            : "FAIL".equals(result) ? failBg
                            : (i % 2 == 1 ? evenBg : null);

            String[] vals = res
                ? new String[]{String.valueOf(i + 1), sv(s, "testType"), sv(s, "scenarioId"),
                               sv(s, "테스트명"), sv(s, "URL"), sv(s, "method"),
                               sv(s, "menuName"), sv(s, "expectedResult"), sv(s, "사전조건"),
                               result, sv(s, "remark")}
                : new String[]{String.valueOf(i + 1), sv(s, "testType"), sv(s, "scenarioId"),
                               sv(s, "테스트명"), sv(s, "URL"), sv(s, "method"),
                               sv(s, "menuName"), sv(s, "expectedResult"), sv(s, "사전조건")};

            for (int j = 0; j < vals.length; j++) {
                Font fnt = (res && j == colCount - 2)
                    ? ("PASS".equals(result) ? passFont : "FAIL".equals(result) ? failFont : dataFont)
                    : dataFont;
                PdfPCell cell = new PdfPCell(new Phrase(vals[j], fnt));
                cell.setPadding(3f);
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                if (rowBg != null) cell.setBackgroundColor(rowBg);
                table.addCell(cell);
            }
        }

        pdf.add(table);
        pdf.close();
        return out.toByteArray();
    }

    // ═════════════════════════════════════════════════════════════════════
    //  POI 공통 유틸
    // ═════════════════════════════════════════════════════════════════════

    private XSSFCellStyle makeHeaderStyle(XSSFWorkbook wb) {
        XSSFCellStyle s = wb.createCellStyle();
        s.setFillForegroundColor(new XSSFColor(new byte[]{(byte)0x29,(byte)0x4c,(byte)0x9a}, null));
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        s.setAlignment(HorizontalAlignment.CENTER);
        s.setVerticalAlignment(VerticalAlignment.CENTER);
        s.setBorderTop(BorderStyle.THIN);
        s.setBorderBottom(BorderStyle.THIN);
        s.setBorderLeft(BorderStyle.THIN);
        s.setBorderRight(BorderStyle.THIN);
        XSSFFont f = wb.createFont();
        f.setBold(true);
        f.setColor(new XSSFColor(new byte[]{(byte)0xff,(byte)0xff,(byte)0xff}, null));
        f.setFontHeightInPoints((short) 10);
        s.setFont(f);
        return s;
    }

    private XSSFCellStyle makeWrapStyle(XSSFWorkbook wb, byte[] bg) {
        XSSFCellStyle s = wb.createCellStyle();
        s.setWrapText(true);
        s.setVerticalAlignment(VerticalAlignment.TOP);
        s.setBorderTop(BorderStyle.THIN);
        s.setBorderBottom(BorderStyle.THIN);
        s.setBorderLeft(BorderStyle.THIN);
        s.setBorderRight(BorderStyle.THIN);
        if (bg != null) {
            s.setFillForegroundColor(new XSSFColor(bg, null));
            s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }
        return s;
    }

    private void sc(Row row, int col, String val, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(val != null ? val : "");
        if (style != null) cell.setCellStyle(style);
    }

    private byte[] xlsxBytes(XSSFWorkbook wb) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        wb.write(out);
        wb.close();
        return out.toByteArray();
    }

    // ═════════════════════════════════════════════════════════════════════
    //  CS500-TS020 양식 기반 xlsx 생성
    // ═════════════════════════════════════════════════════════════════════

    /**
     * CS500-TS020 통합테스트시나리오 양식에 시나리오 데이터를 채워 반환한다.
     *
     * 시트 구조:
     *  - 시나리오 시트 : A=시나리오ID, B=시나리오명, C=설명, D=순번,
     *                    E=엑터(역할), F=중분류, G=소분류, H=메뉴명,
     *                    I=시나리오흐름, J=예상결과,
     *                    K-M=테스트결과(1차)[확인일자/확인자/판정결과],
     *                    N-P=테스트결과(2차)[확인일자/확인자/판정결과]
     *  - 목록 시트     : A=시나리오ID, B=시나리오명, C=설명,
     *                    D=중분류, E=소분류,
     *                    F-M=내부연계[예산/회계, 인사/급여, 구매/자산, 연구/관리, 성과/관리, 업무/결재, 간편/서명, 기타],
     *                    N-O=외부연계
     *
     * @param rows         시나리오 목록 (JS 필드명 기준: scenarioId, testName, description, actor,
     *                     groupName, subCategory, menuName, preCondition, expectedResult,
     *                     testResult, confirmer, judgmentResult, relationType)
     * @param projectName  프로젝트명 (표지 헤더 삽입용)
     * @param docTitle     산출물명 (표지 헤더 삽입용)
     * @param templatePath .claude/양식/CS500-TS020-*.xlsx 절대 경로
     */
    public byte[] buildCs500ScenarioXlsx(List<Map<String, Object>> rows,
                                          String projectName,
                                          String docTitle,
                                          String templatePath) throws Exception {
        if (templatePath == null || templatePath.isEmpty())
            throw new IllegalStateException("CS500 양식 파일 경로가 설정되지 않았습니다 (ai.template.cs500-scenario-xlsx).");

        java.io.File tmpl = new java.io.File(templatePath);
        if (!tmpl.exists())
            throw new java.io.FileNotFoundException("CS500 양식 파일 없음: " + templatePath);

        XSSFWorkbook wb;
        try (java.io.FileInputStream fis = new java.io.FileInputStream(tmpl)) {
            wb = (XSSFWorkbook) WorkbookFactory.create(fis);
        }

        String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

        // ── 시나리오 시트 ─────────────────────────────────────────────────
        XSSFSheet scenSheet = wb.getSheet("시나리오");
        if (scenSheet != null) {
            // 헤더 행에 프로젝트명/산출물명 삽입 (P열=index 15, rows 0-1)
            setCs500Header(scenSheet, projectName, docTitle);

            // 기존 데이터 행 제거 (row index 6 이후)
            for (int i = scenSheet.getLastRowNum(); i >= 6; i--) {
                Row r = scenSheet.getRow(i);
                if (r != null) scenSheet.removeRow(r);
            }

            // 데이터 스타일
            XSSFCellStyle normal = makeCs500DataStyle(wb, null);
            XSSFCellStyle even   = makeCs500DataStyle(wb, new byte[]{(byte)0xf5,(byte)0xf8,(byte)0xfc});

            for (int i = 0; i < rows.size(); i++) {
                Map<String, Object> s = rows.get(i);
                XSSFCellStyle st = (i % 2 == 1) ? even : normal;
                Row row = scenSheet.createRow(6 + i);
                row.setHeightInPoints(72);

                sc(row,  0, sv(s, "scenarioId"),      st);
                sc(row,  1, sv(s, "testName"),         st);
                // 설명: description 우선, 없으면 displayName 사용
                String desc = sv(s, "description");
                if (desc.isEmpty()) desc = sv(s, "displayName");
                sc(row,  2, desc,                      st);
                sc(row,  3, String.valueOf(i + 1),     st);
                sc(row,  4, sv(s, "actor"),            st);
                sc(row,  5, sv(s, "groupName"),        st);
                sc(row,  6, sv(s, "subCategory"),      st);
                sc(row,  7, sv(s, "menuName"),         st);
                sc(row,  8, sv(s, "preCondition"),     st);
                sc(row,  9, sv(s, "expectedResult"),   st);
                // 1차 테스트결과
                sc(row, 10, today,                     st);
                sc(row, 11, sv(s, "confirmer"),        st);
                sc(row, 12, toJudgment(sv(s, "testResult")), st);
                // 2차 (PL 확인)
                sc(row, 13, sv(s, "plConfirmDate"),    st);
                sc(row, 14, sv(s, "plConfirmer"),      st);
                sc(row, 15, toJudgment(sv(s, "plJudgment")), st);
            }
        }

        // ── 목록 시트 ─────────────────────────────────────────────────────
        XSSFSheet listSheet = wb.getSheet("목록");
        if (listSheet != null) {
            setCs500Header(listSheet, projectName, docTitle);

            for (int i = listSheet.getLastRowNum(); i >= 5; i--) {
                Row r = listSheet.getRow(i);
                if (r != null) listSheet.removeRow(r);
            }

            XSSFCellStyle normal = makeCs500DataStyle(wb, null);
            XSSFCellStyle even   = makeCs500DataStyle(wb, new byte[]{(byte)0xf5,(byte)0xf8,(byte)0xfc});

            // 시나리오ID 기준 중복 제거 후 목록 작성
            java.util.LinkedHashMap<String, Map<String, Object>> seen = new java.util.LinkedHashMap<>();
            for (Map<String, Object> s : rows) {
                String sid = sv(s, "scenarioId");
                if (!sid.isEmpty() && !seen.containsKey(sid)) seen.put(sid, s);
            }

            int r = 5;
            for (Map.Entry<String, Map<String, Object>> entry : seen.entrySet()) {
                Map<String, Object> s = entry.getValue();
                XSSFCellStyle st = ((r - 5) % 2 == 1) ? even : normal;
                Row row = listSheet.createRow(r++);
                row.setHeightInPoints(40);

                sc(row,  0, sv(s, "scenarioId"),    st);
                sc(row,  1, sv(s, "testName"),       st);
                String d2 = sv(s, "description");
                if (d2.isEmpty()) d2 = sv(s, "displayName");
                sc(row,  2, d2,                      st);
                sc(row,  3, sv(s, "groupName"),      st);
                sc(row,  4, sv(s, "subCategory"),    st);
                // 내부연계 체크
                String rel = sv(s, "relationType").toLowerCase();
                sc(row,  5, (rel.contains("예산") || rel.contains("회계"))  ? "●" : "", st);
                sc(row,  6, (rel.contains("인사") || rel.contains("급여"))  ? "●" : "", st);
                sc(row,  7, (rel.contains("구매") || rel.contains("자산"))  ? "●" : "", st);
                sc(row,  8,  rel.contains("연구")                           ? "●" : "", st);
                sc(row,  9,  rel.contains("성과")                           ? "●" : "", st);
                sc(row, 10,  rel.contains("결재")                           ? "●" : "", st);
                sc(row, 11,  rel.contains("서명")                           ? "●" : "", st);
                sc(row, 12, "",  st);
                sc(row, 13, sv(s, "relationType"),   st);
                sc(row, 14, "",  st);
            }
        }

        return xlsxBytes(wb);
    }

    private void setCs500Header(XSSFSheet sheet, String projectName, String docTitle) {
        // 양식 원본의 Q열(index 15) rows 0-1 에 프로젝트명 / 산출물명이 있음
        try {
            if (projectName != null && !projectName.isEmpty()) {
                Row r0 = sheet.getRow(0);
                if (r0 == null) r0 = sheet.createRow(0);
                Cell c = r0.getCell(15);
                if (c == null) c = r0.createCell(15);
                c.setCellValue(projectName);
            }
            if (docTitle != null && !docTitle.isEmpty()) {
                Row r1 = sheet.getRow(1);
                if (r1 == null) r1 = sheet.createRow(1);
                Cell c = r1.getCell(15);
                if (c == null) c = r1.createCell(15);
                c.setCellValue(docTitle);
            }
        } catch (Exception ignored) {}
    }

    private XSSFCellStyle makeCs500DataStyle(XSSFWorkbook wb, byte[] bg) {
        XSSFCellStyle s = wb.createCellStyle();
        s.setWrapText(true);
        s.setVerticalAlignment(VerticalAlignment.TOP);
        s.setAlignment(HorizontalAlignment.LEFT);
        s.setBorderBottom(BorderStyle.THIN);
        s.setBorderTop(BorderStyle.THIN);
        s.setBorderLeft(BorderStyle.THIN);
        s.setBorderRight(BorderStyle.THIN);
        if (bg != null) {
            s.setFillForegroundColor(new XSSFColor(bg, null));
            s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }
        XSSFFont f = wb.createFont();
        f.setFontName("맑은 고딕");
        f.setFontHeightInPoints((short) 9);
        s.setFont(f);
        return s;
    }

    private static String toJudgment(String testResult) {
        if ("PASS".equalsIgnoreCase(testResult)) return "합격";
        if ("FAIL".equalsIgnoreCase(testResult)) return "불합격";
        return testResult != null ? testResult : "";
    }

}
