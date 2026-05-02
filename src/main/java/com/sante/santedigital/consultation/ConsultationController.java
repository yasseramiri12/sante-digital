package com.sante.santedigital.consultation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;

    // ==================== GET ALL ====================
    @GetMapping
    public ResponseEntity<List<ConsultationDTO>> getAllConsultations() {
        return ResponseEntity.ok(consultationService.getAllConsultations());
    }

    // ==================== GET BY ID ====================
    @GetMapping("/{id}")
    public ResponseEntity<ConsultationDTO> getConsultationById(@PathVariable Long id) {
        return ResponseEntity.ok(consultationService.getConsultationById(id));
    }

    // ==================== GET BY PATIENT ====================
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<ConsultationDTO>> getConsultationsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(consultationService.getConsultationsByPatient(patientId));
    }

    // ==================== GET BY MEDECIN ====================
    @GetMapping("/medecin/{medecinId}")
    public ResponseEntity<List<ConsultationDTO>> getConsultationsByMedecin(@PathVariable Long medecinId) {
        return ResponseEntity.ok(consultationService.getConsultationsByMedecin(medecinId));
    }

    // ==================== CREATE ====================
    @PostMapping
    public ResponseEntity<ConsultationDTO> createConsultation(@Valid @RequestBody ConsultationDTO consultationDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(consultationService.createConsultation(consultationDTO));
    }

    // ==================== UPDATE ====================
    @PutMapping("/{id}")
    public ResponseEntity<ConsultationDTO> updateConsultation(@PathVariable Long id, @Valid @RequestBody ConsultationDTO consultationDTO) {
        return ResponseEntity.ok(consultationService.updateConsultation(id, consultationDTO));
    }

    // ==================== DELETE ====================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
        return ResponseEntity.noContent().build();
    }
}
