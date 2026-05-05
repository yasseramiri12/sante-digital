package com.sante.santedigital.laboratoire.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ResultatAnalyseDTO {

    private Long resultatId;

    @NotNull(message = "Demande ID is required")
    private Long demandeId;

    @NotBlank(message = "Valeurs JSON is required")
    private String valeursJson;

    private Boolean alerteCritique;

    private String fichierUrl;
}
