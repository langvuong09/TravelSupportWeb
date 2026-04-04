package com.example.backend.repository;

import com.example.backend.entity.TourFood;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TourFoodRepository extends JpaRepository<TourFood, Integer> {
    List<TourFood> findByTourId(String tourId);
}
