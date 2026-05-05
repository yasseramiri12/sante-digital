package com.sante.santedigital.medecin;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "medecin")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Medecin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medecin_id")
    private Long medecinId;

    @Column(name = "utilisateur_id", unique = true, nullable = false)
    private Long utilisateurId;

    @Column(name = "nom", nullable = false, length = 50)
    private String nom;

    @Column(name = "prenom", nullable = false, length = 50)
    private String prenom;

    @Column(name = "specialite", nullable = false, length = 100)
    private String specialite;

    @Column(name = "num_ordre", unique = true, nullable = false,length = 50)
    private String numOrdre;

    @Column(name = "telephone", length = 20)
    private String telephone;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "cabinet_adresse", length = 255)
    private String cabinetAdresse;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate(){
        updatedAt = LocalDateTime.now();
    }

}
