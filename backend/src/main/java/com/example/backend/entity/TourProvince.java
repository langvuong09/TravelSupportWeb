package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tour_provinces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TourProvince {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String tourId;

    private Integer visitOrder;

    private Integer provinceId;
}
