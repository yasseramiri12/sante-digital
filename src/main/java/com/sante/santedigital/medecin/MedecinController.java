package com.sante.santedigital.medecin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medecins")
@RequiredArgsConstructor
public class MedecinController {
    private final MedecinService medecinService;

    @GetMapping
    public ResponseEntity<List<MedecinDTO>> getAllMedecin(){
        return ResponseEntity.ok(medecinService.getAllMedecin());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedecinDTO> getMedecinById(@PathVariable Long id){
        return ResponseEntity.ok(medecinService.getMedecinById(id));
    }

    @GetMapping("/numOrdre/{numOrdre}")
    public ResponseEntity<MedecinDTO> getMedecinByNumOrdre(@PathVariable String numOrdre){
        return ResponseEntity.ok(medecinService.getMedecinByNumOrdre(numOrdre));
    }

    @PostMapping
    public ResponseEntity<MedecinDTO> createMedecin(@Valid @RequestBody MedecinDTO medecinDTO){
        return ResponseEntity.status(HttpStatus.CREATED).body(medecinService.createMedecin(medecinDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedecinDTO> updateMedecin(@PathVariable Long id, @Valid @RequestBody MedecinDTO medecinDTO){
        return ResponseEntity.ok(medecinService.updateMedecin(id, medecinDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedecin(@PathVariable Long id){
        medecinService.deleteMedecin(id);
        return ResponseEntity.noContent().build();
    }

}
