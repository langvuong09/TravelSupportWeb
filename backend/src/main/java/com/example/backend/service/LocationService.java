package com.example.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.backend.dto.request.RecommendationRequest;
import com.example.backend.entity.Location;
import com.example.backend.entity.Province;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.ProvinceRepository;

@Service
public class LocationService {
    private final LocationRepository locationRepository;
    private final ProvinceRepository provinceRepository;

    public LocationService(LocationRepository locationRepository, ProvinceRepository provinceRepository) {
        this.locationRepository = locationRepository;
        this.provinceRepository = provinceRepository;
    }

    public List<Map<String, Object>> getLocationCandidates(RecommendationRequest request) {
        List<Location> locations = locationRepository.findAll();
        Map<Integer, Province> provinceById = provinceRepository.findAll().stream()
                .collect(Collectors.toMap(Province::getProvinceId, p -> p, (a, b) -> a));

        List<Map<String, Object>> candidates = new ArrayList<>();
        for (Location location : locations) {
            if (location == null) {
                continue;
            }
            if (request.getLocationId() != null && Objects.equals(location.getLocationId(), request.getLocationId())) {
                continue;
            }

            candidates.add(toCandidate(location, provinceById));
        }

        return candidates;
    }

    private Map<String, Object> toCandidate(Location location, Map<Integer, Province> provinceById) {
        List<Integer> provinceIds = location.getProvinceId() == null ? List.of() : List.of(location.getProvinceId());
        String provinceName = "";
        Province province = provinceById.get(location.getProvinceId());
        if (province != null && province.getName() != null && !province.getName().isBlank()) {
            provinceName = province.getName();
        }

        int estimatedPrice = Math.max(0, Objects.requireNonNullElse(location.getEstimatedCost(), 0));
        if (estimatedPrice == 0) {
            estimatedPrice = 1_000_000;
        }

        Set<String> styles = new HashSet<>();
        if (location.getType() != null && !location.getType().isBlank()) {
            styles.add(location.getType().toLowerCase());
        }
        if (location.getNiceTime() != null && !location.getNiceTime().isBlank()) {
            styles.add(location.getNiceTime().toLowerCase());
        }

        double popularity = 0.5;
        if (!provinceName.isBlank()) {
            popularity += 0.1;
        }
        if (!styles.isEmpty()) {
            popularity += 0.1;
        }
        popularity = Math.min(1.0, popularity);

        Map<String, Object> candidate = new HashMap<>();
        candidate.put("location_id", location.getLocationId());
        candidate.put("location_name", location.getName());
        candidate.put("province_ids", provinceIds);
        candidate.put("province", provinceName);
        candidate.put("image", location.getImage());
        candidate.put("price", estimatedPrice);
        candidate.put("styles", new ArrayList<>(styles));
        candidate.put("popularity", popularity);
        return candidate;
    }
}
