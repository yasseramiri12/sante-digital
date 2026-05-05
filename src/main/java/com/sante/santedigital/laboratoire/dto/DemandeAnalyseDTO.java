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
public class DemandeAnalyseDTO {

    private Long demandeId;

    @NotNull(message = "Consultation ID is required")
    private Long consultationId;

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotBlank(message = "Type analyse is required")
    private String typeAnalyse;

    private String statut;
}
