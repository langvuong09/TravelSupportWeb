package com.example.backend.controller;

import com.example.backend.entity.Location;
import com.example.backend.repository.LocationRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {
    private final LocationRepository repo;

    public LocationController(LocationRepository repo) { this.repo = repo; }

    @GetMapping
    public Page<Location> all(
        @RequestParam(required = false) String q,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) Integer provinceId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "9") int size
    ) {
        String typeFilter = (type == null || "Tất cả".equals(type)) ? null : type;
        return repo.search(q, typeFilter, provinceId, PageRequest.of(page, size));
    }

    @GetMapping("/types")
    public List<String> getTypes() {
        return repo.findUniqueTypes();
    }
       
    @GetMapping("/{id}")
    public Location get(@PathVariable Integer id) { return repo.findById(id).orElse(null); }

    @GetMapping("/by-province/{provinceId}")
    public List<Location> byProvince(@PathVariable Integer provinceId) { return repo.findByProvinceId(provinceId); }

    @PostMapping
    public Location create(@RequestBody Location l) { return repo.save(l); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) { repo.deleteById(id); }
}
