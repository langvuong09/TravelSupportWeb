package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "transport_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransportType {

    @Id
    @Column(name = "transportId")
    private Integer transportId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "costPerKm")
    private Float costPerKm;
}
