package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "tours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tour {
    @Id
    private String tourId;

    private Long userId;

    private String name;

    private Integer price;

    private Integer days;

    private Float rating;

    private Float popularity;

    private Instant createdAt;
}
