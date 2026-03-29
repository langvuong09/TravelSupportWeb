package com.example.backend.repository;

import com.example.backend.entity.TourProvince;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TourProvinceRepository extends JpaRepository<TourProvince, Integer> {
    List<TourProvince> findByTourIdOrderByVisitOrder(String tourId);
}
