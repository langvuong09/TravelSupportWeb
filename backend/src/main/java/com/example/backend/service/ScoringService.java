package com.example.backend.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class ScoringService {

    private final QueryParsingService queryParsingService;
    private final TokenMfService tokenMfService;

    public ScoringService(QueryParsingService queryParsingService, TokenMfService tokenMfService) {
        this.queryParsingService = queryParsingService;
        this.tokenMfService = tokenMfService;
    }

    public double scoreCollaborative(String tourId, double[] preferenceVector, TokenMfService.TokenMfModel model) {
        if (preferenceVector == null) {
            return 0.5;
        }

        double[] itemVector = model.itemFactors().get(tourId);
        if (itemVector == null) {
            return 0.5;
        }

        return tokenMfService.sigmoid(tokenMfService.dot(preferenceVector, itemVector));
    }

    public double scorePreferenceMatch(TourAggregateRecord tour, UserPreferenceRecord pref) {
        double score = 0;

        if ("Tat ca".equalsIgnoreCase(pref.region()) || pref.region().equalsIgnoreCase(tour.regionLabel())) {
            score += 0.30;
        }

        if ("any".equalsIgnoreCase(pref.budget())) {
            score += 0.10;
        } else if ("low".equalsIgnoreCase(pref.budget()) && tour.estimatedPrice() < 2_000_000) {
            score += 0.30;
        } else if ("mid".equalsIgnoreCase(pref.budget())
                && tour.estimatedPrice() >= 2_000_000
                && tour.estimatedPrice() <= 5_000_000) {
            score += 0.30;
        } else if ("high".equalsIgnoreCase(pref.budget()) && tour.estimatedPrice() > 5_000_000) {
            score += 0.30;
        }

        score += Math.max(0, 0.20 - Math.abs(tour.durationDays() - pref.days()) * 0.05);

        if ("beach".equalsIgnoreCase(pref.style()) && tour.styleTokens().contains("beach")) {
            score += 0.25;
        }
        if ("adventure".equalsIgnoreCase(pref.style()) && tour.styleTokens().contains("adventure")) {
            score += 0.25;
        }
        if ("culture".equalsIgnoreCase(pref.style()) && tour.styleTokens().contains("culture")) {
            score += 0.25;
        }
        if ("family".equalsIgnoreCase(pref.style()) && tour.styleTokens().contains("family")) {
            score += 0.20;
        }

        return Math.max(0, Math.min(1.0, score));
    }

    public double scoreHybrid(TourAggregateRecord tour,
                              UserPreferenceRecord preference,
                              double[] preferenceVector,
                              boolean coldStart,
                              Map<String, Double> popularityByTour,
                              TokenMfService.TokenMfModel model) {
        double cbfScore = scorePreferenceMatch(tour, preference);
        double cfScore = scoreCollaborative(tour.tourId(), preferenceVector, model);
        double popularity = popularityByTour.getOrDefault(tour.tourId(), 0.45);

        double cfWeight = coldStart ? 0.35 : 0.60;
        double hybridScore = cfWeight * cfScore + (1 - cfWeight) * cbfScore + 0.08 * popularity;

        if (!"Tat ca".equalsIgnoreCase(preference.region())
                && !preference.region().equalsIgnoreCase(tour.regionLabel())) {
            hybridScore *= 0.85;
        }

        return hybridScore;
    }

    public String buildAssistantMessage(String query, UserPreferenceRecord pref, List<ScoredTourRecord> scoredTours) {
        if (scoredTours.isEmpty()) {
            return "Hệ thống chưa tìm thấy tour phù hợp. Bạn thử mô tả rõ hơn về ngân sách, khu vực và số ngày đi.";
        }

        ScoredTourRecord best = scoredTours.get(0);
        String base = "Hệ thống đã chạy mô hình Hybrid (Token Matrix Factorization + CBF) trên dữ liệu thực trong MySQL để xếp hạng đề xuất.";
        String filter = "Bộ lọc hiện tại: khu vực=" + pref.region() + ", ngân sách=" + pref.budget() + ", số ngày=" + pref.days() + ", phong cách=" + pref.style() + ".";

        if (lower(query).contains("lich trinh")) {
            return base + " Gợi ý lịch trình nhanh: ngày 1 tham quan " + best.tour().locationName()
                    + ", ngày 2 trải nghiệm tour " + best.tour().tourName()
                    + ", ngày cuối thư giãn và thử ăm thức địa phương. " + filter;
        }

        return base + " Tour phù hợp nhất hiện tại là " + best.tour().tourName() + " tại " + best.tour().locationName() + ". " + filter;
    }

    private String lower(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT);
    }

    public record UserPreferenceRecord(String region, String budget, String style, int days) {
    }

    public record TourAggregateRecord(String tourId,
                                      String tourName,
                                      Integer locationId,
                                      String locationName,
                                      String provinceName,
                                      String image,
                                      int estimatedPrice,
                                      int durationDays,
                                      String regionLabel,
                                      java.util.Set<String> styleTokens) {
    }

    public record ScoredTourRecord(TourAggregateRecord tour,
                                   double cbfScore,
                                   double cfScore,
                                   double hybridScore) {
    }
}
