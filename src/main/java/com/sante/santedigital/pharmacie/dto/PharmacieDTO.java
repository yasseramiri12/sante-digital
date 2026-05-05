package com.sante.santedigital.pharmacie.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacieDTO {

    private Long pharmacieId;

    @NotBlank(message = "Nom is required")
    private String nom;

    private String adresse;

    private String telephone;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Num autorisation is required")
    private String numAutorisation;
}
