package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tour_locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TourLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String tourId;

    private Integer locationId;
}
