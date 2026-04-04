package com.example.backend.repository;

import com.example.backend.entity.TourFood;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourFoodRepository extends JpaRepository<TourFood, Integer> {
    List<TourFood> findByTourIdIn(List<String> tourIds);
}