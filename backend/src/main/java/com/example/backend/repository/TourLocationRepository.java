package com.example.backend.repository;

import com.example.backend.entity.TourLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TourLocationRepository extends JpaRepository<TourLocation, Integer> {
    List<TourLocation> findByTourId(String tourId);
}
