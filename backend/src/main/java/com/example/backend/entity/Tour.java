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
    private String tourId; // string primary key as in schema

    private Integer userId;

    private String name;

    private Instant createdAt;
}
