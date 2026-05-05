package com.sante.santedigital.laboratoire.controller;

import com.sante.santedigital.laboratoire.dto.ResultatAnalyseDTO;
import com.sante.santedigital.laboratoire.service.ResultatAnalyseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laboratoire/resultats")
@RequiredArgsConstructor
public class ResultatAnalyseController {

    private final ResultatAnalyseService resultatAnalyseService;

    @GetMapping
    public ResponseEntity<List<ResultatAnalyseDTO>> getAllResultats() {
        return ResponseEntity.ok(resultatAnalyseService.findAllResultats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultatAnalyseDTO> getResultatById(@PathVariable Long id) {
        return ResponseEntity.ok(resultatAnalyseService.findResultatById(id));
    }

    @GetMapping("/demande/{demandeId}")
    public ResponseEntity<ResultatAnalyseDTO> getResultatByDemandeId(@PathVariable Long demandeId) {
        return ResponseEntity.ok(resultatAnalyseService.findResultatByDemandeId(demandeId));
    }

    @GetMapping("/alerte/{alerteCritique}")
    public ResponseEntity<List<ResultatAnalyseDTO>> getResultatsByAlerteCritique(@PathVariable boolean alerteCritique) {
        return ResponseEntity.ok(resultatAnalyseService.findResultatsByAlerteCritique(alerteCritique));
    }

    @PostMapping
    public ResponseEntity<ResultatAnalyseDTO> createResultat(@Valid @RequestBody ResultatAnalyseDTO resultatDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resultatAnalyseService.createResultat(resultatDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResultat(@PathVariable Long id) {
        resultatAnalyseService.deleteResultat(id);
        return ResponseEntity.noContent().build();
    }
}

