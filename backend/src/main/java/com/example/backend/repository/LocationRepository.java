package com.example.backend.repository;

import com.example.backend.entity.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Integer> {
    List<Location> findByProvinceId(Integer provinceId);

    List<Location> findByProvinceIdIn(List<Integer> provinceIds);

    @Query("SELECT l FROM Location l WHERE " +
           "(:name IS NULL OR LOWER(l.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:type IS NULL OR l.type = :type) AND " +
           "(:provinceId IS NULL OR l.provinceId = :provinceId)")
    Page<Location> search(@Param("name") String name, 
                         @Param("type") String type, 
                         @Param("provinceId") Integer provinceId, 
                         Pageable pageable);

    @Query("SELECT DISTINCT l.type FROM Location l WHERE l.type IS NOT NULL")
    List<String> findUniqueTypes();
}
