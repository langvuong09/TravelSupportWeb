package com.example.backend.controller;

import com.example.backend.dto.request.RecommendationRequest;
import com.example.backend.dto.response.RecommendationResponse;
import com.example.backend.service.RecommendationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public RecommendationResponse getRecommendationsJson(@RequestBody RecommendationRequest request) {
        return recommendationService.recommend(request);
    }
}
