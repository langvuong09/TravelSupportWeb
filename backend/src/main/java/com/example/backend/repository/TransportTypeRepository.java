package com.example.backend.repository;

import com.example.backend.entity.TransportType;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TransportTypeRepository extends JpaRepository<TransportType, Integer> {
}
