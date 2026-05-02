package com.sante.santedigital.consultation;

import java.time.LocalDateTime;

import lombok.NoArgsConstructor;
import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ConsultationDTO {

    private String compteRendu;

    private String diagnosticCim10;

    private String motif;
    @NotBlank

    private LocalDateTime dateHeure;
    @NotNull

    private Long medecinId;
    @NotNull

    private Long patientId;
    @NotNull

    private Long consultationId;
}


