package com.example.backend.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RecommendationItemResponse {
    private Long userId;
    private Integer locationId;
    private String locationName;
    private String province;
    private String image;
    private Integer price;

    // AI
    private double cfScore;
    private double cbfScore;
    private double hybridScore;
}
