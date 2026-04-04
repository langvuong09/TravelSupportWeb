package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "virtual_tours")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirtualTour {

    @Id
    @Column(name = "tourId")
    private String tourId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;
}
