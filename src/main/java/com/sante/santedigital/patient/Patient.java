package com.sante.santedigital.patient;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "patient")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Long patientId;

    @Column(name = "nin", unique = true, nullable = false, length = 20)
    @NotBlank(message = "NIN is required")
    private String nin;

    @Column(name = "nom", nullable = false, length = 50)
    @NotBlank(message = "Last name is required")
    private String nom;

    @Column(name = "prenom", nullable = false, length = 50)
    @NotBlank(message = "First name is required")
    private String prenom;

    @Column(name = "date_naissance", nullable = false)
    @NotNull(message = "Date of birth is required")
    private LocalDate dateNaissance;

    @Column(name = "groupe_sanguin", length = 5)
    private String groupeSanguin;

    @Column(name = "telephone", length = 50)
    private String telephone;

    @Column(name = "email", unique = true, length = 100)
    @Email(message = "Invalid email format")
    private String email;

    @Column(name = "adresse", length = 255)
    private String adresse;

    @Column(name = "carte_qr_token", length = 255)
    private String carte_qr_token;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (carte_qr_token == null){
            carte_qr_token = UUID.randomUUID().toString();
        }
    }

    @PreUpdate
    protected void onUpdate(){
        updatedAt = LocalDateTime.now();
    }
}

