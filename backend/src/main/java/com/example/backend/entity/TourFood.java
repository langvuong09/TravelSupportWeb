package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tour_foods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TourFood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String tourId;

    private Integer foodId;
}
