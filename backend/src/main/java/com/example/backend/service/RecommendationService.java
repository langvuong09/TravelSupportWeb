package com.example.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.backend.dto.request.RecommendationRequest;
import com.example.backend.dto.response.RecommendationItemResponse;
import com.example.backend.dto.response.RecommendationResponse;
import com.example.backend.entity.Location;
import com.example.backend.entity.Tour;
import com.example.backend.entity.TourLocation;
import com.example.backend.entity.TourProvince;
import com.example.backend.entity.UserInteraction;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.TourLocationRepository;
import com.example.backend.repository.TourProvinceRepository;
import com.example.backend.repository.TourRepository;
import com.example.backend.repository.UserInteractionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .build();
    private final TourRepository tourRepository;
    private final TourProvinceRepository tourProvinceRepository;
    private final TourLocationRepository tourLocationRepository;
    private final LocationRepository locationRepository;
    private final UserInteractionRepository userInteractionRepository;

    public RecommendationService(TourRepository tourRepository,
                                 TourProvinceRepository tourProvinceRepository,
                                 TourLocationRepository tourLocationRepository,
                                 LocationRepository locationRepository,
                                 UserInteractionRepository userInteractionRepository) {
        this.tourRepository = tourRepository;
        this.tourProvinceRepository = tourProvinceRepository;
        this.tourLocationRepository = tourLocationRepository;
        this.locationRepository = locationRepository;
        this.userInteractionRepository = userInteractionRepository;
    }

    @Value("${ai.service.base-url:http://localhost:8001}")
    private String aiServiceBaseUrl;

    public RecommendationResponse recommend(RecommendationRequest request) {
        RecommendationRequest safeRequest = request == null ? new RecommendationRequest() : request;

        try {
            String bodyJson = objectMapper.writeValueAsString(buildPredictPayload(safeRequest));
            HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(resolvePredictUrl()))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(bodyJson, StandardCharsets.UTF_8))
                .build();

            HttpResponse<String> httpResponse = httpClient
                .send(httpRequest, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

            if (httpResponse.statusCode() >= 400) {
            throw new IllegalStateException(httpResponse.statusCode() + " " + httpResponse.body());
            }

            Map<String, Object> aiResponse = objectMapper.readValue(
                httpResponse.body(),
                new TypeReference<Map<String, Object>>() {
                }
            );

            return mapAiResponse(aiResponse);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            RecommendationResponse failure = new RecommendationResponse();
            failure.setColdStart(true);
            failure.setRecommendations(List.of());
            failure.setMessage("Không gọi được ai-service: " + ex.getMessage());
            return failure;
        } catch (Exception ex) {
            RecommendationResponse failure = new RecommendationResponse();
            failure.setColdStart(true);
            failure.setRecommendations(List.of());
            failure.setMessage("Không gọi được ai-service: " + ex.getMessage());
            return failure;
        }
    }

    private Map<String, Object> buildPredictPayload(RecommendationRequest request) {
        int topK = request.getTopK() == null ? 1 : Math.max(1, Math.min(20, request.getTopK()));
        int days = request.getDays() == null ? 3 : Math.max(1, request.getDays());
        int participants = request.getParticipants() == null ? 1 : Math.max(1, request.getParticipants());
        long userId = request.getUserId() == null ? 0L : request.getUserId();

        List<Map<String, Object>> candidates = buildCandidates();
        List<Map<String, Object>> interactions = buildInteractions();
        List<String> historyTourIds = buildHistoryTourIds(request.getUserId());

        Map<String, Object> payload = new HashMap<>();
        payload.put("user_id", userId);
        payload.put("query", safe(request.getQuery()));
        payload.put("budget", safe(request.getBudget(), "any"));
        payload.put("days", days);
        payload.put("style", safe(request.getStyle(), "any"));
        payload.put("participants", participants);
        payload.put("province_ids", request.getProvinceIds() == null ? List.of() : request.getProvinceIds());
        payload.put("history_tour_ids", historyTourIds);
        payload.put("interactions", interactions);
        payload.put("top_k", topK);
        payload.put("candidates", candidates);
        return payload;
    }

    private List<Map<String, Object>> buildCandidates() {
        List<Tour> tours = tourRepository.findAll();
        List<TourProvince> tourProvinces = tourProvinceRepository.findAll();
        List<TourLocation> tourLocations = tourLocationRepository.findAll();
        Map<Integer, Location> locationById = locationRepository.findAll().stream()
                .collect(Collectors.toMap(Location::getLocationId, l -> l, (a, b) -> a));

        Map<String, List<Integer>> provinceIdsByTour = new HashMap<>();
        for (TourProvince tp : tourProvinces) {
            if (tp.getTourId() == null || tp.getProvinceId() == null) {
                continue;
            }
            provinceIdsByTour.computeIfAbsent(tp.getTourId(), ignored -> new ArrayList<>()).add(tp.getProvinceId());
        }

        Map<String, List<Integer>> locationIdsByTour = new HashMap<>();
        for (TourLocation tl : tourLocations) {
            if (tl.getTourId() == null || tl.getLocationId() == null) {
                continue;
            }
            locationIdsByTour.computeIfAbsent(tl.getTourId(), ignored -> new ArrayList<>()).add(tl.getLocationId());
        }

        List<Map<String, Object>> candidates = new ArrayList<>();
        for (Tour tour : tours) {
            String tourId = tour.getTourId();
            List<Integer> provinceIds = provinceIdsByTour.getOrDefault(tourId, List.of());
            List<Integer> locationIds = locationIdsByTour.getOrDefault(tourId, List.of());

            int estimatedPrice = 0;
            Set<String> styles = new HashSet<>();
            String locationName = "";
            String provinceName = "";
            for (Integer locationId : locationIds) {
                Location location = locationById.get(locationId);
                if (location == null) {
                    continue;
                }
                estimatedPrice += Math.max(0, Objects.requireNonNullElse(location.getEstimatedCost(), 0));
                if (location.getType() != null && !location.getType().isBlank()) {
                    styles.add(location.getType().toLowerCase());
                }
                if (location.getNiceTime() != null && !location.getNiceTime().isBlank()) {
                    styles.add(location.getNiceTime().toLowerCase());
                }
                if (locationName.isBlank()) {
                    locationName = Objects.toString(location.getName(), "");
                }
            }

            if (estimatedPrice <= 0) {
                estimatedPrice = Math.max(1, provinceIds.size()) * 1_500_000;
            }

            int durationDays = Math.max(1, provinceIds.size());
            double popularity = Math.min(1.0, 0.35 + (locationIds.size() * 0.08) + (provinceIds.size() * 0.06));

            Map<String, Object> candidate = new HashMap<>();
            candidate.put("tour_id", Objects.toString(tourId, ""));
            candidate.put("tour_name", safe(tour.getName(), "Tour " + Objects.toString(tourId, "")));
            candidate.put("province_ids", provinceIds);
            candidate.put("location_name", locationName);
            candidate.put("province_name", provinceName);
            candidate.put("estimated_price", estimatedPrice);
            candidate.put("duration_days", durationDays);
            candidate.put("styles", new ArrayList<>(styles));
            candidate.put("popularity", popularity);
            candidates.add(candidate);
        }
        return candidates;
    }

    private List<Map<String, Object>> buildInteractions() {
        List<Map<String, Object>> interactions = new ArrayList<>();
        for (UserInteraction interaction : userInteractionRepository.findAll()) {
            if (interaction.getUserId() == null || interaction.getTourId() == null) {
                continue;
            }
            Map<String, Object> event = new HashMap<>();
            event.put("user_id", interaction.getUserId());
            event.put("tour_id", interaction.getTourId());
            event.put("event_type", safe(interaction.getEventType(), "view"));
            event.put("value", interaction.getValue() == null ? 1.0 : interaction.getValue());
            interactions.add(event);
        }
        return interactions;
    }

    private List<String> buildHistoryTourIds(Long userId) {
        if (userId == null) {
            return List.of();
        }
        return userInteractionRepository.findByUserId(userId).stream()
                .map(UserInteraction::getTourId)
                .filter(Objects::nonNull)
                .toList();
    }

    private RecommendationResponse mapAiResponse(Map<String, Object> root) {
        RecommendationResponse response = new RecommendationResponse();
        if (root == null) {
            response.setColdStart(true);
            response.setRecommendations(List.of());
            response.setMessage("ai-service trả về dữ liệu rỗng");
            return response;
        }

        List<RecommendationItemResponse> recommendations = new ArrayList<>();
        Object recObj = root.get("recommendations");
        if (recObj instanceof List<?> recList) {
            for (Object itemObj : recList) {
                if (!(itemObj instanceof Map<?, ?> rec)) {
                    continue;
                }

                RecommendationItemResponse item = new RecommendationItemResponse();
                item.setTourId(Objects.toString(rec.get("tour_id"), ""));
                item.setTourName(Objects.toString(rec.get("tour_name"), ""));
                item.setHybridScore(parseDouble(rec.get("score")));
                item.setReason(Objects.toString(rec.get("reason"), "python-ai"));
                item.setCfScore(parseDouble(rec.get("cf_score")));
                item.setCbfScore(parseDouble(rec.get("cbf_score")));
                recommendations.add(item);
            }
        }

        response.setColdStart(recommendations.isEmpty());
        response.setRecommendations(recommendations);
        response.setMessage(recommendations.isEmpty()
                ? "ai-service chưa trả về đề xuất phù hợp."
                : "Đề xuất được xử lý hoàn toàn bởi ai-service.");
        return response;
    }

    private double parseDouble(Object value) {
        if (value instanceof Number n) {
            return n.doubleValue();
        }
        try {
            return Double.parseDouble(Objects.toString(value, "0"));
        } catch (NumberFormatException ex) {
            return 0.0;
        }
    }

    private String safe(String value) {
        return safe(value, "");
    }

    private String safe(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private String resolvePredictUrl() {
        if (aiServiceBaseUrl == null || aiServiceBaseUrl.isBlank()) {
            return "http://localhost:8001/predict";
        }
        String normalized = aiServiceBaseUrl.trim();
        return normalized.endsWith("/") ? normalized + "predict" : normalized + "/predict";
    }
}
