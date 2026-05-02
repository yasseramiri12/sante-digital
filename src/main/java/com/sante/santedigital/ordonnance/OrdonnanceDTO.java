package com.sante.santedigital.ordonnance;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrdonnanceDTO {

    private Long ordonnanceId;

    @NotNull
    private Long consultationId;

    @NotNull
    private Long patientId;

    @NotNull
    private LocalDate dateExpiration;

    private String statut;
}

