package com.example.backend.controller;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tours")
public class TourController {
    private final TourRepository tourRepo;
    private final TourProvinceRepository tpRepo;
    private final TourLocationRepository tlRepo;
    private final TourFoodRepository tfRepo;
    private final TourTransportRepository ttRepo;
    private final ProvinceRepository provinceRepo;
    private final LocationRepository locationRepo;
    private final FoodRepository foodRepo;

    public TourController(TourRepository tourRepo, TourProvinceRepository tpRepo, TourLocationRepository tlRepo, TourFoodRepository tfRepo, TourTransportRepository ttRepo, ProvinceRepository provinceRepo, LocationRepository locationRepo, FoodRepository foodRepo) {
        this.tourRepo = tourRepo;
        this.tpRepo = tpRepo;
        this.tlRepo = tlRepo;
        this.tfRepo = tfRepo;
        this.ttRepo = ttRepo;
        this.provinceRepo = provinceRepo;
        this.locationRepo = locationRepo;
        this.foodRepo = foodRepo;
    }

    @GetMapping
    public List<Tour> all() { return tourRepo.findAll(); }

    @GetMapping("/{id}")
    public Tour get(@PathVariable String id) { return tourRepo.findById(id).orElse(null); }

    @PostMapping
    public Tour create(@RequestBody Tour t) { return tourRepo.save(t); }

    @GetMapping("/{id}/full")
    public Map<String, Object> full(@PathVariable String id) {
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
