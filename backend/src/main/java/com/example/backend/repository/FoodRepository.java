package com.example.backend.repository;

import com.example.backend.entity.Food;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRepository extends JpaRepository<Food, Integer> {
    List<Food> findByFoodIdIn(List<Integer> foodIds);
}
