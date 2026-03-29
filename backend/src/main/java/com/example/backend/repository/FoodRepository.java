package com.example.backend.repository;

import com.example.backend.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Integer> {
    List<Food> findByProvinceId(Integer provinceId);
}
