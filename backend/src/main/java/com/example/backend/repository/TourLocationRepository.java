package com.example.backend.repository;

import com.example.backend.entity.TourLocation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourLocationRepository extends JpaRepository<TourLocation, Integer> {
    List<TourLocation> findByTourIdIn(List<String> tourIds);
}
