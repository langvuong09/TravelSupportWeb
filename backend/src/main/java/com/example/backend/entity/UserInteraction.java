package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "user_interactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(name = "location_id")
    private Integer locationId;


    @Column(nullable = false)
    private String eventType;

    @Column(nullable = false)
    private Double value = 1.0;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}