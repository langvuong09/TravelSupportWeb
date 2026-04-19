package com.example.backend.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class RecommendationRequest {
    private Long userId;
    private String query;
    private Integer locationId;
    private List<Integer> provinceIds;
    private Integer topK;
}