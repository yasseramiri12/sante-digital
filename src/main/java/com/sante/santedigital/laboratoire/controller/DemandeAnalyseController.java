package com.sante.santedigital.laboratoire.controller;

import com.sante.santedigital.laboratoire.dto.DemandeAnalyseDTO;
import com.sante.santedigital.laboratoire.service.DemandeAnalyseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laboratoire/demandes")
@RequiredArgsConstructor
public class DemandeAnalyseController {

    private final DemandeAnalyseService demandeAnalyseService;

    @GetMapping
    public ResponseEntity<List<DemandeAnalyseDTO>> getAllDemandes() {
        return ResponseEntity.ok(demandeAnalyseService.findAllDemandes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DemandeAnalyseDTO> getDemandeById(@PathVariable Long id) {
        return ResponseEntity.ok(demandeAnalyseService.findDemandeById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<DemandeAnalyseDTO>> getDemandesByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(demandeAnalyseService.findDemandesByPatientId(patientId));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<DemandeAnalyseDTO>> getDemandesByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(demandeAnalyseService.findDemandesByStatut(statut));
    }

    @PostMapping
    public ResponseEntity<DemandeAnalyseDTO> createDemande(@Valid @RequestBody DemandeAnalyseDTO demandeDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(demandeAnalyseService.createDemande(demandeDTO));
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<DemandeAnalyseDTO> updateDemandeStatut(@PathVariable Long id, @RequestBody String statut) {
        return ResponseEntity.ok(demandeAnalyseService.updateDemandeStatut(id, statut));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDemande(@PathVariable Long id) {
        demandeAnalyseService.deleteDemande(id);
        return ResponseEntity.noContent().build();
    }
}
