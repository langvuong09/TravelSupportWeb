package com.example.backend.controller;

import com.example.backend.entity.Location;
import com.example.backend.repository.LocationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {
    private final LocationRepository repo;

    public LocationController(LocationRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Location> all() { return repo.findAll(); }

    @GetMapping("/by-province/{provinceId}")
    public List<Location> byProvince(@PathVariable Integer provinceId) { return repo.findByProvinceId(provinceId); }

    @PostMapping
    public Location create(@RequestBody Location l) { return repo.save(l); }
}
