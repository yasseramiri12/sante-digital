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

    @NotNull(message = "Consultation ID is required")
    private Long consultationId;

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotNull(message = "Date d'expiration is required")
    private LocalDate dateExpiration;

    private String statut;
}
