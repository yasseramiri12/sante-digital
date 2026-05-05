package com.sante.santedigital.pharmacie.controller;

import com.sante.santedigital.pharmacie.dto.DispensationDTO;
import com.sante.santedigital.pharmacie.dto.PharmacieDTO;
import com.sante.santedigital.pharmacie.service.PharmacieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacie")
@RequiredArgsConstructor
public class PharmacieController {

    private final PharmacieService pharmacieService;

    //Endpoints pharmacies
    @GetMapping
    public ResponseEntity<List<PharmacieDTO>> getAllPharmacies() {
        return ResponseEntity.ok(pharmacieService.getAllPharmacies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PharmacieDTO> getPharmacieById(@PathVariable Long id) {
        return ResponseEntity.ok(pharmacieService.getPharmacieById(id));
    }

    @PostMapping
    public ResponseEntity<PharmacieDTO> createPharmacie(@Valid @RequestBody PharmacieDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pharmacieService.createPharmacie(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PharmacieDTO> updatePharmacie(@PathVariable Long id, @Valid @RequestBody PharmacieDTO dto) {
        return ResponseEntity.ok(pharmacieService.updatePharmacie(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePharmacie(@PathVariable Long id) {
        pharmacieService.deletePharmacie(id);
        return ResponseEntity.noContent().build();
    }

    //Endpoints dispensations
    @GetMapping("/dispensations")
    public ResponseEntity<List<DispensationDTO>> getAllDispensations() {
        return ResponseEntity.ok(pharmacieService.getAllDispensations());
    }

    @GetMapping("/dispensations/{id}")
    public ResponseEntity<DispensationDTO> getDispensationById(@PathVariable Long id) {
        return ResponseEntity.ok(pharmacieService.getDispensationById(id));
    }

    @GetMapping("/dispensations/pharmacie/{pharmacieId}")
    public ResponseEntity<List<DispensationDTO>> getDispensationsByPharmacie(@PathVariable Long pharmacieId) {
        return ResponseEntity.ok(pharmacieService.getDispensationsByPharmacie(pharmacieId));
    }

    @GetMapping("/dispensations/ordonnance/{ordonnanceId}")
    public ResponseEntity<DispensationDTO> getDispensationByOrdonnance(@PathVariable Long ordonnanceId) {
        return ResponseEntity.ok(pharmacieService.getDispensationByOrdonnance(ordonnanceId));
    }

    @PostMapping("/dispensations")
    public ResponseEntity<DispensationDTO> createDispensation(@Valid @RequestBody DispensationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pharmacieService.createDispensation(dto));
    }

    @DeleteMapping("/dispensations/{id}")
    public ResponseEntity<Void> deleteDispensation(@PathVariable Long id) {
        pharmacieService.deleteDispensation(id);
        return ResponseEntity.noContent().build();
    }
}
