package cres.pss.service;

import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

public class SseHelper {

    public static void sseLog(PrintWriter w, String msg) {
        String ts = new SimpleDateFormat("HH:mm:ss").format(new Date());
        String line = "[" + ts + "] " + msg;
        System.out.println(line);
        w.write("event: log\ndata: " + escEvt(line) + "\n\n");
        w.flush();
    }

    public static String escEvt(String s) {
        if (s == null) return "";
        return s.replace("\n", " ").replace("\r", "").replace("|", "｜");
    }

    public static String hesc(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace("\"", "&quot;").replace("'", "&#39;");
    }
}
