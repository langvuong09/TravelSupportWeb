package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tour_transport")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TourTransport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String tourId;

    private Integer fromProvince;

    private Integer toProvince;

    private Integer transportId;
}
