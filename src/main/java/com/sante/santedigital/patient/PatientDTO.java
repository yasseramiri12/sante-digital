package com.sante.santedigital.patient;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Builder
@Getter
public class PatientDTO {

    private Long patientId;

    @NotBlank(message = "NIN is required")
    private String nin;

    @NotBlank(message = "Last name is required")
    private String nom;

    @NotBlank(message = "First name is required")
    private String prenom;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateNaissance;

    private String groupeSanguin;

    private String telephone;

    @Email(message = "Invalid email format")
    private String email;

    private String adresse;
}
