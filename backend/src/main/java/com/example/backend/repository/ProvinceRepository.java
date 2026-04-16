package com.example.backend.repository;

import com.example.backend.entity.Province;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProvinceRepository extends JpaRepository<Province, Integer> {
}
