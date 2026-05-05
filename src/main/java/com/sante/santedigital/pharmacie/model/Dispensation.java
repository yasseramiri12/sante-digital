package com.sante.santedigital.pharmacie.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "dispensation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dispensation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dispensation_id")
    private Long dispensationId;

    @Column(name = "ordonnance_id", nullable = false, unique = true)
    private Long ordonnanceId;

    @Column(name = "pharmacie_id", nullable = false)
    private Long pharmacieId;

    @Column(name = "date_dispensation", nullable = false)
    private LocalDateTime dateDispensation;

    @Column(name = "interactions_ok", nullable = false)
    private Boolean interactionsOk;

    @Column(name = "pharmacien_nom", nullable = false, length = 100)
    private String pharmacienNom;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        dateDispensation = LocalDateTime.now();
        if (interactionsOk == null) {
            interactionsOk = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
