package com.example.backend.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RecommendationRequest {
    private Long userId;
    private String query;
    private String region;
    private String budget;
    private Integer days;
    private String style;
    private Integer topK;
}