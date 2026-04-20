package com.example.backend.controller;

import com.example.backend.entity.Province;
import com.example.backend.repository.ProvinceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/provinces")
@RequiredArgsConstructor
public class ProvinceController {
    private final ProvinceRepository repo;

    @GetMapping
    public List<Province> all() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Province get(@PathVariable Integer id) { return repo.findById(id).orElse(null); }

    @PostMapping
    public Province create(@RequestBody Province p) { return repo.save(p); }
    
        @PutMapping("/{id}")
        public Province update(@PathVariable Integer id, @RequestBody Province p) {
            p.setProvinceId(id);
            return repo.save(p);
        }

        @DeleteMapping("/{id}")
        public void delete(@PathVariable Integer id) { repo.deleteById(id); }
}
