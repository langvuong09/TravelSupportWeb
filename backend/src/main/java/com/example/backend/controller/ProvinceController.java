package com.example.backend.controller;

import com.example.backend.entity.Province;
import com.example.backend.repository.ProvinceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provinces")
public class ProvinceController {
    private final ProvinceRepository repo;

    public ProvinceController(ProvinceRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Province> all() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Province get(@PathVariable Integer id) { return repo.findById(id).orElse(null); }

    @PostMapping
    public Province create(@RequestBody Province p) { return repo.save(p); }
}
