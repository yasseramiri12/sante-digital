package com.sante.santedigital.ordonnance;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordonnances")
@RequiredArgsConstructor
public class OrdonnanceController {

    private final OrdonnanceService ordonnanceService;

    // ==================== GET ALL ====================
    @GetMapping
    public ResponseEntity<List<OrdonnanceDTO>> getAllOrdonnances() {
        return ResponseEntity.ok(ordonnanceService.getAllOrdonnances());
    }

    // ==================== GET BY ID ====================
    @GetMapping("/{id}")
    public ResponseEntity<OrdonnanceDTO> getOrdonnanceById(@PathVariable Long id) {
        return ResponseEntity.ok(ordonnanceService.getOrdonnanceById(id));
    }

    // ==================== GET BY PATIENT ====================
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<OrdonnanceDTO>> getOrdonnancesByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(ordonnanceService.getOrdonnancesByPatient(patientId));
    }

    // ==================== GET BY STATUT ====================
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<OrdonnanceDTO>> getOrdonnancesByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(ordonnanceService.getOrdonnancesByStatut(statut));
    }

    // ==================== CREATE ====================
    @PostMapping
    public ResponseEntity<OrdonnanceDTO> createOrdonnance(@Valid @RequestBody OrdonnanceDTO ordonnanceDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ordonnanceService.createOrdonnance(ordonnanceDTO));
    }

    // ==================== CLOSE (USED) ====================
    @PutMapping("/{id}/close")
    public ResponseEntity<OrdonnanceDTO> closeOrdonnance(@PathVariable Long id) {
        return ResponseEntity.ok(ordonnanceService.closeOrdonnance(id));
    }

    // ==================== EXPIRE ====================
    @PutMapping("/{id}/expire")
    public ResponseEntity<OrdonnanceDTO> expireOrdonnance(@PathVariable Long id) {
        return ResponseEntity.ok(ordonnanceService.expireOrdonnance(id));
    }

    // ==================== DELETE ====================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrdonnance(@PathVariable Long id) {
        ordonnanceService.deleteOrdonnance(id);
        return ResponseEntity.noContent().build();
    }
}
