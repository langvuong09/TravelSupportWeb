package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transport_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransportType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transportId;

    private String name;

    private Double costPerKm;
}
