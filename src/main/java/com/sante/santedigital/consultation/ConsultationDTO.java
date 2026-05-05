package com.sante.santedigital.consultation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ConsultationDTO {

    private Long consultationId;

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotNull(message = "Medecin ID is required")
    private Long medecinId;

    @NotNull(message = "Date heure is required")
    private LocalDateTime dateHeure;

    @NotBlank(message = "Motif is required")
    private String motif;

    private String diagnosticCim10;

    private String compteRendu;
}
