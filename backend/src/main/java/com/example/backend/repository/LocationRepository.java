package com.example.backend.repository;

import com.example.backend.entity.Location;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {
    List<Location> findByLocationIdIn(List<Integer> locationIds);
}
