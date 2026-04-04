package com.example.backend.repository;

import com.example.backend.entity.TourTransport;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourTransportRepository extends JpaRepository<TourTransport, Integer> {
    List<TourTransport> findByTourIdIn(List<String> tourIds);
}
