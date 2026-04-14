package com.example.backend.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class RecommendationRequest {
    private Long userId;
    private String query;
    private String budget;
    private Integer days;
    private String style;
    private Integer participants;
    private List<Integer> provinceIds;
    private Integer topK;
}