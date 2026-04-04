package com.example.backend.repository;

import com.example.backend.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Integer> {
    List<Location> findByProvinceId(Integer provinceId);
}
