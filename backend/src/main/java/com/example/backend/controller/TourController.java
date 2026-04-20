package com.example.backend.controller;

import com.example.backend.entity.Tour;
import com.example.backend.service.TourService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {
    private final TourService tourService;


    @GetMapping
    public List<Tour> all() {
        return tourService.getAllTours();
    }

    @GetMapping("/my-tours/{userId}")
    public List<Tour> getMyTours(@PathVariable Long userId) {
        return tourService.getToursByUserId(userId);
    }

    @GetMapping("/{id}")
    public Tour get(@PathVariable String id) {
        return tourService.getTourById(id);
    }

    @PostMapping
    public Tour create(@RequestBody Map<String, Object> payload) {
        return tourService.createComplexTour(payload);
    }

    @GetMapping("/{id}/full")
    public Map<String, Object> full(@PathVariable String id) {
        return tourService.getFullTourDetails(id);
    }
}
