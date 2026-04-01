package com.example.backend.controller;

import com.example.backend.entity.Food;
import com.example.backend.repository.FoodRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/foods")
public class FoodController {
    private final FoodRepository repo;

    public FoodController(FoodRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Food> all() { return repo.findAll(); }

    @GetMapping("/by-province/{provinceId}")
    public List<Food> byProvince(@PathVariable Integer provinceId) { return repo.findByProvinceId(provinceId); }

    @PostMapping
    public Food create(@RequestBody Food f) { return repo.save(f); }
}
