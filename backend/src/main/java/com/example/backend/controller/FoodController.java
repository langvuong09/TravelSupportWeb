package com.example.backend.controller;

import com.example.backend.entity.Food;
import com.example.backend.repository.FoodRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
public class FoodController {
    private final FoodRepository repo;

    public FoodController(FoodRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Food> all() { return repo.findAll(); }

    @GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<Food> getById(@PathVariable Integer id) {
        return repo.findById(id)
            .map(org.springframework.http.ResponseEntity::ok)
            .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    @PostMapping
    public Food create(@RequestBody Food f) { return repo.save(f); }

    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<Food> update(@PathVariable Integer id, @RequestBody Food f) {
        return repo.findById(id).map(existing -> {
            f.setFoodId(id);
            Food saved = repo.save(f);
            return org.springframework.http.ResponseEntity.ok(saved);
        }).orElseGet(() -> org.springframework.http.ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> delete(@PathVariable Integer id) {
        return repo.findById(id).map(existing -> {
            repo.deleteById(id);
            return org.springframework.http.ResponseEntity.ok().<Void>build();
        }).orElseGet(() -> org.springframework.http.ResponseEntity.notFound().build());
    }
}
