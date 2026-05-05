package com.sante.santedigital.laboratoire.service;

import com.sante.santedigital.laboratoire.dto.ResultatAnalyseDTO;
import com.sante.santedigital.laboratoire.model.ResultatAnalyse;
import com.sante.santedigital.laboratoire.repository.ResultatAnalyseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultatAnalyseService {

    private final ResultatAnalyseRepository resultatAnalyseRepository;

    // ==================== GET ALL ====================
    public List<ResultatAnalyseDTO> findAllResultats() {
        return resultatAnalyseRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ==================== GET BY ID ====================
    public ResultatAnalyseDTO findResultatById(Long id) {
        return resultatAnalyseRepository.findById(id).map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Résultat d'analyse non trouvé avec l'ID : " + id));
    }

    // ==================== GET BY DEMANDE ID ====================
    public ResultatAnalyseDTO findResultatByDemandeId(Long demandeId) {
        return resultatAnalyseRepository.findByDemandeId(demandeId).map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Résultat d'analyse non trouvé pour la demande ID : " + demandeId));
    }

    // ==================== GET BY ALERTE CRITIQUE ====================
    public List<ResultatAnalyseDTO> findResultatsByAlerteCritique(boolean alerteCritique) {
        return resultatAnalyseRepository.findByAlerteCritique(alerteCritique).stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ==================== CREATE ====================
    public ResultatAnalyseDTO createResultat(ResultatAnalyseDTO resultatDTO) {
        ResultatAnalyse resultat = toEntity(resultatDTO);
        ResultatAnalyse savedResultat = resultatAnalyseRepository.save(resultat);
        return toDTO(savedResultat);
    }

    // ==================== DELETE ====================
    public void deleteResultat(Long id) {
        if (!resultatAnalyseRepository.existsById(id)) {
            throw new RuntimeException("Résultat d'analyse non trouvé avec l'ID : " + id);
        }
        resultatAnalyseRepository.deleteById(id);
    }

    // ==================== MAPPERS ====================
    private ResultatAnalyseDTO toDTO(ResultatAnalyse resultat) {
        return ResultatAnalyseDTO.builder()
                .resultatId(resultat.getResultatId())
                .demandeId(resultat.getDemandeId())
                .valeursJson(resultat.getValeursJson())
                .alerteCritique(resultat.getAlerteCritique())
                .fichierUrl(resultat.getFichierUrl())
                .build();
    }

    private ResultatAnalyse toEntity(ResultatAnalyseDTO dto) {
        return ResultatAnalyse.builder()
                .demandeId(dto.getDemandeId())
                .valeursJson(dto.getValeursJson())
                .alerteCritique(dto.getAlerteCritique())
                .fichierUrl(dto.getFichierUrl())
                .build();
    }
}
