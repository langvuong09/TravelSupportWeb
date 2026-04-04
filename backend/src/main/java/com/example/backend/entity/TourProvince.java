package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tour_provinces")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourProvince {

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "tourId", nullable = false)
    private String tourId;

    @Column(name = "visitOrder")
    private Integer visitOrder;

    @Column(name = "provinceId", nullable = false)
    private Integer provinceId;
}
