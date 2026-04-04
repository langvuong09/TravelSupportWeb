package com.example.backend.repository;

import com.example.backend.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourRepository extends JpaRepository<Tour, String> {
}
