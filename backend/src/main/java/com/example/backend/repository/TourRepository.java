package com.example.backend.repository;

import com.example.backend.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourRepository extends JpaRepository<Tour, String> {
    List<Tour> findByUserIdOrderByCreatedAtDesc(Long userId);
}
