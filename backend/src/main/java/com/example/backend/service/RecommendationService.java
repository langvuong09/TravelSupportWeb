package com.example.backend.service;

import com.example.backend.dto.request.RecommendationRequest;
import com.example.backend.dto.response.RecommendationItemResponse;
import com.example.backend.dto.response.RecommendationResponse;
import com.example.backend.entity.Province;
import com.example.backend.repository.ProvinceRepository;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final LocationService locationService;
    private final InteractionService interactionService;
    private final AIClientService aiClientService;
    private final ProvinceRepository provinceRepository;

    public RecommendationService(LocationService locationService,
                                 InteractionService interactionService,
                                 AIClientService aiClientService,
                                 ProvinceRepository provinceRepository) {
        this.locationService = locationService;
        this.interactionService = interactionService;
        this.aiClientService = aiClientService;
        this.provinceRepository = provinceRepository;
    }

    public RecommendationResponse recommend(RecommendationRequest request) {
        RecommendationRequest safeRequest = request == null ? new RecommendationRequest() : request;

        try {
            Map<String, Object> aiResponse = aiClientService.predict(buildPredictPayload(safeRequest));
            return mapAiResponse(aiResponse, safeRequest);
        } catch (Exception ex) {
            RecommendationResponse failure = new RecommendationResponse();
            failure.setColdStart(true);
            failure.setRecommendations(List.of());
            failure.setMessage("Không gọi được ai-service: " + ex.getMessage());
            return failure;
        }
    }

    public Map<String, Object> trainAIModel() {
        List<Map<String, Object>> events = interactionService.getAllInteractions();
        if (events.isEmpty()) {
            return Map.of("success", false, "message", "Không có dữ liệu tương tác để huấn luyện");
        }
        return aiClientService.train(events);
    }

    public Map<String, Object> trainNLPModel() {
        return aiClientService.trainNLP();
    }

    private Map<String, Object> buildPredictPayload(RecommendationRequest request) {
        int topK = request.getTopK() == null ? 1 : Math.max(1, Math.min(20, request.getTopK()));
        long userId = request.getUserId() == null ? 0L : request.getUserId();

        List<Map<String, Object>> candidates = locationService.getLocationCandidates(request);
        List<Map<String, Object>> interactions = interactionService.getInteractions(request.getUserId());
        List<String> historyLocationIds = interactionService.getHistoryLocationIds(request.getUserId());

        List<Integer> provinceIds = request.getProvinceIds();
        if (provinceIds == null || provinceIds.isEmpty()) {
            provinceIds = parseProvinceIdsFromQuery(request.getQuery());
            if (!provinceIds.isEmpty()) {
                request.setProvinceIds(provinceIds);
            }
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("user_id", userId);
        payload.put("query", safe(request.getQuery()));
        payload.put("location_id", request.getLocationId());
        payload.put("province_ids", provinceIds == null ? List.of() : provinceIds);
        payload.put("history_location_ids", historyLocationIds);
        payload.put("interactions", interactions);
        payload.put("top_k", topK);
        payload.put("candidates", candidates);
        return payload;
    }


    private RecommendationResponse mapAiResponse(Map<String, Object> root, RecommendationRequest request) {
        RecommendationResponse response = new RecommendationResponse();
        if (root == null) {
            response.setColdStart(true);
            response.setRecommendations(List.of());
            response.setMessage("ai-service trả về dữ liệu rỗng");
            return response;
        }

        List<Map<String, Object>> candidates = locationService.getLocationCandidates(request);
        Map<String, Map<String, Object>> candidateMap = candidates.stream()
                .filter(c -> c.get("location_id") != null)
                .collect(Collectors.toMap(c -> Objects.toString(c.get("location_id"), ""), c -> c));

        List<RecommendationItemResponse> recommendations = new ArrayList<>();
        Object recObj = root.get("recommendations");
        if (recObj instanceof List<?> recList) {
            for (Object itemObj : recList) {
                if (!(itemObj instanceof Map<?, ?> rec)) {
                    continue;
                }

                RecommendationItemResponse item = new RecommendationItemResponse();
                item.setUserId(parseLong(rec.get("user_id"), request.getUserId()));
                item.setLocationId(parseInteger(rec.get("location_id")));
                item.setLocationName(Objects.toString(rec.get("location_name"), null));
                item.setProvince(Objects.toString(rec.get("province_name"), null));
                item.setImage(Objects.toString(rec.get("image"), null));
                item.setEstimatedPrice(parseInteger(rec.get("estimated_price")));
                item.setHybridScore(parseDouble(rec.get("score")));
                item.setCfScore(parseDouble(rec.get("cf_score")));
                item.setCbfScore(parseDouble(rec.get("cbf_score")));

                if ((item.getLocationName() == null || item.getLocationName().isBlank()) && item.getLocationId() != null && candidateMap.containsKey(item.getLocationId().toString())) {
                    Map<String, Object> candidate = candidateMap.get(item.getLocationId().toString());
                    item.setLocationName(Objects.toString(candidate.get("location_name"), null));
                    item.setProvince(Objects.toString(candidate.get("province_name"), null));
                    item.setImage(Objects.toString(candidate.get("image"), null));
                    item.setEstimatedPrice(parseInteger(candidate.get("estimated_price")));
                    item.setLocationId(parseInteger(candidate.get("location_id")));
                }
                if (item.getUserId() == null) {
                    item.setUserId(request.getUserId());
                }
                recommendations.add(item);
            }
        }

        response.setColdStart(recommendations.isEmpty());
        response.setRecommendations(recommendations);
        response.setMessage(recommendations.isEmpty()
                ? "Chưa có địa điểm gợi ý phù hợp theo nhu cầu của bạn"
                : "Thông tin đề xuất địa điểm chi tiết");
        return response;
    }

    private Integer parseInteger(Object value) {
        if (value instanceof Number n) {
            return n.intValue();
        }
        try {
            return Integer.parseInt(Objects.toString(value, ""));
        } catch (Exception ex) {
            return null;
        }
    }


    private Long parseLong(Object value, Long fallback) {
        if (value instanceof Number n) {
            return n.longValue();
        }
        try {
            String s = Objects.toString(value, "");
            return s.isBlank() ? fallback : Long.parseLong(s);
        } catch (Exception ex) {
            return fallback;
        }
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

    private List<Integer> parseProvinceIdsFromQuery(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }

        String normalizedQuery = normalizeText(query);
        if (normalizedQuery.isBlank()) {
            return List.of();
        }

        Set<Integer> ids = new LinkedHashSet<>();
        for (Province province : provinceRepository.findAll()) {
            if (province == null || province.getName() == null) {
                continue;
            }
            String normalizedProvince = normalizeText(province.getName());
            if (normalizedProvince.isBlank()) {
                continue;
            }

            String normalizedProvinceForMatch = normalizedProvince
                    .replaceAll("\\b(tp|thanh pho|thanhpho|thanh|pho)\\b", "")
                    .replaceAll("\\s+", " ")
                    .trim();
            if (normalizedProvinceForMatch.isBlank()) {
                normalizedProvinceForMatch = normalizedProvince;
            }

            if (normalizedQuery.contains(normalizedProvince)
                    || normalizedQuery.contains(normalizedProvinceForMatch)
                    || normalizedProvince.contains(normalizedQuery)
                    || normalizedProvinceForMatch.contains(normalizedQuery)
                    || provinceTokensMatch(normalizedQuery, normalizedProvinceForMatch)) {
                ids.add(province.getProvinceId());
            }
        }

        return new ArrayList<>(ids);
    }

    private boolean provinceTokensMatch(String normalizedQuery, String normalizedProvince) {
        String[] provinceTokens = normalizedProvince.split(" ");
        if (provinceTokens.length == 0) {
            return false;
        }
        for (String token : provinceTokens) {
            if (token.isBlank()) {
                continue;
            }
            if (!normalizedQuery.contains(token)) {
                return false;
            }
        }
        return true;
    }

    private static String normalizeText(String input) {
        if (input == null) {
            return "";
        }
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        normalized = DIACRITICS.matcher(normalized).replaceAll("");
        return normalized.toLowerCase().replaceAll("[^a-z0-9\\s]", " ").replaceAll("\\s+", " ").trim();
    }

    private static final Pattern DIACRITICS = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
}
