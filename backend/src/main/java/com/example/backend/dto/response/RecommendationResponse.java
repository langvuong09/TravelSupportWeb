package com.example.backend.dto.response;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RecommendationResponse {
    private String message;
    private boolean coldStart;
    private String model;
    private List<RecommendationItemResponse> recommendations = new ArrayList<>();
}