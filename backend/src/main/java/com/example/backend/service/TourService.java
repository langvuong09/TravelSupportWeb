package com.example.backend.service;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TourService {
    private final TourRepository tourRepo;
    private final TourProvinceRepository tpRepo;
    private final TourLocationRepository tlRepo;
    private final TourFoodRepository tfRepo;
    private final TourTransportRepository ttRepo;
    private final ProvinceRepository provinceRepo;
    private final LocationRepository locationRepo;
    private final FoodRepository foodRepo;

    public List<Tour> getAllTours() {
        return tourRepo.findAll();
    }

    public List<Tour> getToursByUserId(Long userId) {
        return tourRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Tour getTourById(String id) {
        return tourRepo.findById(id).orElse(null);
    }

    @Transactional
    public Tour createComplexTour(Map<String, Object> payload) {
        // 1. Save main Tour entity
        Tour t = new Tour();
        t.setTourId(payload.get("tourId").toString());
        t.setName(payload.get("name").toString());
        t.setUserId(Long.valueOf(payload.get("userId").toString()));
        t.setPrice(Integer.valueOf(payload.get("price").toString()));
        t.setDays(Integer.valueOf(payload.get("days").toString()));
        t.setRating(Float.valueOf(payload.get("rating").toString()));
        t.setPopularity(Float.valueOf(payload.get("popularity").toString()));
        t.setCreatedAt(java.time.Instant.parse(payload.get("createdAt").toString()));
        Tour savedTour = tourRepo.save(t);

        String id = savedTour.getTourId();

        // 2. Save Provinces
        List<Integer> provinceIds = convertToList(payload.get("provinceIds"));
        for (int i = 0; i < provinceIds.size(); i++) {
            TourProvince tp = new TourProvince();
            tp.setTourId(id);
            tp.setProvinceId(provinceIds.get(i));
            tp.setVisitOrder(i + 1);
            tpRepo.save(tp);
        }

        // 3. Save Locations
        List<Integer> locationIds = convertToList(payload.get("locationIds"));
        for (Integer lid : locationIds) {
            TourLocation tl = new TourLocation();
            tl.setTourId(id);
            tl.setLocationId(lid);
            tlRepo.save(tl);
        }

        // 4. Save Foods
        List<Integer> foodIds = convertToList(payload.get("foodIds"));
        for (Integer fid : foodIds) {
            TourFood tf = new TourFood();
            tf.setTourId(id);
            tf.setFoodId(fid);
            tfRepo.save(tf);
        }

        // 5. Save Transport
        Object transportObj = payload.get("transportId");
        if (transportObj != null) {
            TourTransport tt = new TourTransport();
            tt.setTourId(id);
            tt.setTransportId(Integer.valueOf(transportObj.toString()));
            ttRepo.save(tt);
        }

        return savedTour;
    }

    private List<Integer> convertToList(Object obj) {
        List<Integer> list = new ArrayList<>();
        if (obj instanceof List<?>) {
            for (Object item : (List<?>) obj) {
                if (item instanceof Number) {
                    list.add(((Number) item).intValue());
                } else if (item instanceof String) {
                    list.add(Integer.valueOf((String) item));
                }
            }
        }
        return list;
    }

    public Map<String, Object> getFullTourDetails(String id) {
        Map<String, Object> out = new HashMap<>();
        Tour tour = tourRepo.findById(id).orElse(null);
        if (tour == null) return Map.of("error", "not found");

        out.put("tour", tour);

        List<TourProvince> tourProvinces = tpRepo.findByTourIdOrderByVisitOrder(id);
        List<Map<String, Object>> provinces = tourProvinces.stream().map(tp -> {
            Province p = provinceRepo.findById(tp.getProvinceId()).orElse(null);
            Map<String,Object> m = new HashMap<>();
            m.put("visitOrder", tp.getVisitOrder());
            m.put("province", p);
            return m;
        }).collect(Collectors.toList());
        out.put("provinces", provinces);

        List<TourLocation> tourLocations = tlRepo.findByTourId(id);
        List<Location> locations = tourLocations.stream().map(tl -> locationRepo.findById(tl.getLocationId()).orElse(null)).filter(Objects::nonNull).collect(Collectors.toList());
        out.put("locations", locations);

        List<TourFood> tourFoods = tfRepo.findByTourId(id);
        List<Food> foods = tourFoods.stream().map(tf -> foodRepo.findById(tf.getFoodId()).orElse(null)).filter(Objects::nonNull).collect(Collectors.toList());
        out.put("foods", foods);

        List<TourTransport> transports = ttRepo.findByTourId(id);
        out.put("transports", transports);

        return out;
    }
}
