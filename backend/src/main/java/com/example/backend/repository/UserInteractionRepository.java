package com.example.backend.repository;

import com.example.backend.entity.UserInteraction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserInteractionRepository extends JpaRepository<UserInteraction, Long> {
    List<UserInteraction> findByUserId(Long userId);

    List<UserInteraction> findByTourId(String tourId);

    List<UserInteraction> findByEventType(String eventType);
}