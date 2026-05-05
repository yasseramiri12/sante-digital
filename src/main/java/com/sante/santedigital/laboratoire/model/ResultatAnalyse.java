package com.sante.santedigital.laboratoire.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "resultat_analyse")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResultatAnalyse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resultat_id")
    private Long resultatId;

    @Column(name = "demande_id", nullable = false, unique = true)
    private Long demandeId;

    @Column(name = "valeurs_json", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String valeursJson;

    @Column(name = "alerte_critique", nullable = false)
    private Boolean alerteCritique;

    @Column(name = "fichier_url", length = 255)
    private String fichierUrl;

    @Column(name = "date_publication", nullable = false)
    private LocalDateTime datePublication;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt       = LocalDateTime.now();
        updatedAt       = LocalDateTime.now();
        datePublication = LocalDateTime.now();
        if (alerteCritique == null) {
            alerteCritique = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
