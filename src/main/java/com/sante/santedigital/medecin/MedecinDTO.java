package com.sante.santedigital.medecin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data //Getter & Setter & toString()
public class MedecinDTO {

    private Long medecinId;

    private Long utilisateurId;

    @NotBlank(message = "Last name is required")
    private String nom;

    @NotBlank(message = "First name is required")
    private String prenom;

    @NotBlank(message = "Specialite is required")
    private String specialite;

    @NotBlank(message = "Num Ordre is required")
    private String numOrdre;

    private String telephone;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    private String cabinetAdresse;
}
