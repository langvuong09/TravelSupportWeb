package com.example.backend.repository;

import com.example.backend.entity.TourProvince;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourProvinceRepository extends JpaRepository<TourProvince, Integer> {
    List<TourProvince> findByTourIdIn(List<String> tourIds);
}
