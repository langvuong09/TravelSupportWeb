package com.example.backend.controller;

import com.example.backend.dto.request.RecommendationRequest;
import com.example.backend.dto.response.RecommendationResponse;
import com.example.backend.service.RecommendationService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public RecommendationResponse getRecommendationsJson(@RequestBody RecommendationRequest request) {
        return recommendationService.recommend(request);
    }

    @PostMapping(consumes = MediaType.TEXT_PLAIN_VALUE)
    public RecommendationResponse getRecommendationsText(@RequestBody(required = false) String query) {
        RecommendationRequest request = new RecommendationRequest();
        request.setQuery(query == null ? "" : query);
        return recommendationService.recommend(request);
    }

    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public RecommendationResponse getRecommendationsForm(@RequestParam(required = false) String query,
                                                         @RequestParam(required = false) Long userId,
                                                         @RequestParam(required = false) String budget,
                                                         @RequestParam(required = false) Integer days,
                                                         @RequestParam(required = false) String style,
                                                         @RequestParam(required = false) Integer participants,
                                                         @RequestParam(required = false) java.util.List<Integer> provinceIds,
                                                         @RequestParam(required = false) Integer topK) {
        RecommendationRequest request = buildRequest(query, userId, budget, days, style, participants, provinceIds, topK);
        return recommendationService.recommend(request);
    }

    @GetMapping
    public RecommendationResponse getRecommendationsByQuery(@RequestParam(required = false) String query,
                                                            @RequestParam(required = false) Long userId,
                                                            @RequestParam(required = false) String budget,
                                                            @RequestParam(required = false) Integer days,
                                                            @RequestParam(required = false) String style,
                                                            @RequestParam(required = false) Integer participants,
                                                            @RequestParam(required = false) java.util.List<Integer> provinceIds,
                                                            @RequestParam(required = false) Integer topK) {
        RecommendationRequest request = buildRequest(query, userId, budget, days, style, participants, provinceIds, topK);
        return recommendationService.recommend(request);
    }

    private RecommendationRequest buildRequest(String query,
                                               Long userId,
                                               String budget,
                                               Integer days,
                                               String style,
                                               Integer participants,
                                               java.util.List<Integer> provinceIds,
                                               Integer topK) {
        RecommendationRequest request = new RecommendationRequest();
        request.setQuery(query);
        request.setUserId(userId);
        request.setBudget(budget);
        request.setDays(days);
        request.setStyle(style);
        request.setParticipants(participants);
        request.setProvinceIds(provinceIds);
        request.setTopK(topK);
        return request;
    }
}
