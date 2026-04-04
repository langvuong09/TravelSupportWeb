package com.example.backend.service;

import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class QueryParsingService {

    private static final Pattern DAY_PATTERN = Pattern.compile("(\\d+)\\s*(ngay|n)", Pattern.CASE_INSENSITIVE);

    public String detectRegion(String query) {
        String q = lower(query);
        if (q.contains("mien bac") || q.contains("ha noi") || q.contains("bac")) return "Bac";
        if (q.contains("mien trung") || q.contains("trung")) return "Trung";
        if (q.contains("ho chi minh") || q.contains("tp hcm") || q.contains("sai gon")) return "Nam";
        return "Tat ca";
    }

    public String detectBudget(String query) {
        String q = lower(query);
        if (q.contains("duoi 2") || q.contains("< 2") || q.contains("re")) return "low";
        if (q.contains("2") && q.contains("5")) return "mid";
        if (q.contains("tren 5") || q.contains("> 5") || q.contains("cao cap")) return "high";
        return "any";
    }

    public String detectStyle(String query) {
        String q = lower(query);
        if (q.contains("bien") || q.contains("nghi duong") || q.contains("resort")) return "beach";
        if (q.contains("leo nui") || q.contains("trek") || q.contains("phuot") || q.contains("kayak")) return "adventure";
        if (q.contains("van hoa") || q.contains("co do") || q.contains("lich su") || q.contains("pho co")) return "culture";
        if (q.contains("gia dinh") || q.contains("tre em")) return "family";
        return "any";
    }

    public int detectDays(String query) {
        Matcher m = DAY_PATTERN.matcher(query);
        if (!m.find()) {
            return 3;
        }
        try {
            return Math.max(1, Integer.parseInt(m.group(1)));
        } catch (NumberFormatException ex) {
            return 3;
        }
    }

    public String durationTier(int days) {
        if (days <= 2) return "short";
        if (days <= 4) return "medium";
        return "long";
    }

    private String lower(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT);
    }
}
