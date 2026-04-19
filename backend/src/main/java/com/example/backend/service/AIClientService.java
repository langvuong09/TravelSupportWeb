package com.example.backend.service;

import java.time.Duration;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AIClientService {
    private final WebClient webClient;

    public AIClientService(@Value("${ai.url:http://localhost:8001}") String baseUrl) {
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
    }

    public Map<String, Object> predict(Map<String, Object> payload) {
        return webClient.post()
                .uri("/predict")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .timeout(Duration.ofSeconds(2))
                .retry(2)
                .block();
    }
}
