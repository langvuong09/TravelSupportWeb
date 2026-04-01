package com.example.backend.controller;

import com.example.backend.entity.TransportType;
import com.example.backend.repository.TransportTypeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/transports")
public class TransportTypeController {
    private final TransportTypeRepository repo;

    public TransportTypeController(TransportTypeRepository repo) { this.repo = repo; }

    @GetMapping
    public List<TransportType> all() { return repo.findAll(); }

    @PostMapping
    public TransportType create(@RequestBody TransportType t) { return repo.save(t); }
}
