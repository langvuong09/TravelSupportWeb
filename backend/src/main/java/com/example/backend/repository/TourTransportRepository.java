package com.example.backend.repository;

import com.example.backend.entity.TourTransport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TourTransportRepository extends JpaRepository<TourTransport, Integer> {
    List<TourTransport> findByTourId(String tourId);
}
