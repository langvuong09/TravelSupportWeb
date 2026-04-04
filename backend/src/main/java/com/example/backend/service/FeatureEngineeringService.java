package com.example.backend.service;

import com.example.backend.entity.Food;
import com.example.backend.entity.Location;
import com.example.backend.entity.TransportType;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;

@Service
public class FeatureEngineeringService {

    private final QueryParsingService queryParsingService;

    public FeatureEngineeringService(QueryParsingService queryParsingService) {
        this.queryParsingService = queryParsingService;
    }

    public Set<String> buildTourFeatureTokens(String region,
                                              int durationDays,
                                              int estimatedPrice,
                                              List<String> provinces,
                                              List<Location> locations,
                                              List<Food> foods,
                                              List<TransportType> transports,
                                              Set<String> styleTokens) {
        Set<String> tokens = new HashSet<>();
        tokens.add("region:" + lower(region));
        tokens.add("days:" + queryParsingService.durationTier(durationDays));
        tokens.add("budget:" + budgetTier(estimatedPrice));

        provinces.forEach(p -> tokens.add("province:" + lower(p)));
        locations.forEach(l -> tokens.add("location:" + lower(safe(l.getName(), "unknown"))));
        foods.forEach(f -> {
            tokens.add("food:" + lower(safe(f.getName(), "unknown")));
            if (!isBlank(f.getType())) {
                tokens.add("foodtype:" + lower(f.getType()));
            }
        });
        transports.forEach(t -> tokens.add("transport:" + lower(safe(t.getName(), "unknown"))));
        styleTokens.forEach(s -> tokens.add("style:" + lower(s)));
        return tokens;
    }

    public Set<String> inferStyleTokens(List<Location> locations,
                                        List<Food> foods,
                                        List<TransportType> transports,
                                        List<String> provinces) {
        Set<String> styles = new HashSet<>();

        String mergedText = (
                locations.stream().map(Location::getName).map(this::safe).reduce("", (a, b) -> a + " " + b) + " "
                        + locations.stream().map(l -> safe(l.getDescription(), "")).reduce("", (a, b) -> a + " " + b) + " "
                        + foods.stream().map(f -> safe(f.getType(), "")).reduce("", (a, b) -> a + " " + b) + " "
                        + String.join(" ", provinces) + " "
                        + transports.stream().map(TransportType::getName).reduce("", (a, b) -> a + " " + b)
        ).toLowerCase(Locale.ROOT);

        if (mergedText.contains("bien") || mergedText.contains("island") || mergedText.contains("phu quoc") || mergedText.contains("ha long")) {
            styles.add("beach");
        }
        if (mergedText.contains("trek") || mergedText.contains("leo") || mergedText.contains("nui") || mergedText.contains("bike")) {
            styles.add("adventure");
        }
        if (mergedText.contains("co do") || mergedText.contains("van hoa") || mergedText.contains("lich su") || mergedText.contains("pho co")) {
            styles.add("culture");
        }
        if (locations.size() >= 2 || foods.size() >= 2) {
            styles.add("family");
        }

        if (styles.isEmpty()) {
            styles.add("culture");
        }
        return styles;
    }

    public String inferRegionFromProvinces(List<String> provinceNames) {
        if (provinceNames.isEmpty()) {
            return "Tat ca";
        }

        long north = provinceNames.stream().filter(this::isNorthernProvince).count();
        long central = provinceNames.stream().filter(this::isCentralProvince).count();
        long south = provinceNames.stream().filter(this::isSouthernProvince).count();

        if (north >= central && north >= south) return "Bac";
        if (central >= north && central >= south) return "Trung";
        return "Nam";
    }

    public int estimatePrice(List<Location> locations,
                             List<Food> foods,
                             List<TransportType> transports,
                             int transportHops,
                             int durationDays) {
        int locationCost = (int) locations.stream()
                .map(Location::getEstimatedCost)
                .filter(Objects::nonNull)
                .mapToInt(v -> v)
                .average()
                .orElse(1_200_000);

        int foodCost = (int) foods.stream()
                .map(Food::getEstimatedPrice)
                .filter(Objects::nonNull)
                .mapToInt(v -> v)
                .average()
                .orElse(250_000);

        int transportCost = (int) transports.stream()
                .map(TransportType::getCostPerKm)
                .filter(Objects::nonNull)
                .mapToDouble(v -> v)
                .average()
                .orElse(14_000.0);

        int mealMultiplier = Math.max(1, durationDays) * 2;
        int hopMultiplier = Math.max(1, transportHops);

        return Math.max(500_000, locationCost + foodCost * mealMultiplier + transportCost * hopMultiplier);
    }

    public double popularityFromRelations(int provinceCount, int locationCount, int foodCount, int transportCount) {
        double raw = provinceCount * 0.30 + locationCount * 0.25 + foodCount * 0.20 + transportCount * 0.25;
        return Math.max(0.2, Math.min(1.0, raw / 4.0));
    }

    private String budgetTier(int price) {
        if (price < 2_000_000) return "low";
        if (price <= 5_000_000) return "mid";
        return "high";
    }

    private boolean isNorthernProvince(String name) {
        String n = lower(name);
        return n.contains("ha noi") || n.contains("hai phong") || n.contains("quang ninh") || n.contains("lao cai")
                || n.contains("ninh binh") || n.contains("thai nguyen") || n.contains("lang son");
    }

    private boolean isCentralProvince(String name) {
        String n = lower(name);
        return n.contains("da nang") || n.contains("quang nam") || n.contains("hue") || n.contains("thua thien")
                || n.contains("khanh hoa") || n.contains("nghe an") || n.contains("ha tinh");
    }

    private boolean isSouthernProvince(String name) {
        String n = lower(name);
        return n.contains("ho chi minh") || n.contains("kien giang") || n.contains("lam dong") || n.contains("binh thuan")
                || n.contains("can tho") || n.contains("vung tau") || n.contains("dong nai") || n.contains("an giang");
    }

    private String safe(String value, String fallback) {
        return isBlank(value) ? fallback : value;
    }

    private String safe(String value) {
        return safe(value, "");
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String lower(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT);
    }
}
