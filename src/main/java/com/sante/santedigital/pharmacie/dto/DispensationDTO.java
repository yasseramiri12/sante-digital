package com.sante.santedigital.pharmacie.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DispensationDTO {

    private Long dispensationId;

    @NotNull(message = "Ordonnance ID is required")
    private Long ordonnanceId;

    @NotNull(message = "Pharmacie ID is required")
    private Long pharmacieId;

    private Boolean interactionsOk;

    @NotBlank(message = "Pharmacien nom is required")
    private String pharmacienNom;
}
