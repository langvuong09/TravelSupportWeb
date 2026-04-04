package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "foods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer foodId;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer estimatedPrice;

    private String image;

    private String type;

    private Integer provinceId;
}
