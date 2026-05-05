package com.sante.santedigital.laboratoire.service;

import com.sante.santedigital.laboratoire.dto.DemandeAnalyseDTO;
import com.sante.santedigital.laboratoire.model.DemandeAnalyse;
import com.sante.santedigital.laboratoire.repository.DemandeAnalyseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DemandeAnalyseService {

    private final DemandeAnalyseRepository demandeAnalyseRepository;

    public List<DemandeAnalyseDTO> findAllDemandes() {
        return demandeAnalyseRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public DemandeAnalyseDTO findDemandeById(Long id) {
        return demandeAnalyseRepository.findById(id).map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Demande d'analyse non trouvée avec l'ID : " + id));
    }

    public List<DemandeAnalyseDTO> findDemandesByPatientId(Long patientId) {
        return demandeAnalyseRepository.findByPatientId(patientId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<DemandeAnalyseDTO> findDemandesByStatut(String statut) {
        return demandeAnalyseRepository.findByStatut(statut)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DemandeAnalyseDTO createDemande(DemandeAnalyseDTO demandeDTO) {
        DemandeAnalyse demande = toEntity(demandeDTO);
        DemandeAnalyse savedDemande = demandeAnalyseRepository.save(demande);
        return toDTO(savedDemande);
    }

    public DemandeAnalyseDTO updateDemandeStatut(Long id, String statut) {
        DemandeAnalyse demande = demandeAnalyseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande d'analyse non trouvée avec l'ID : " + id));
        demande.setStatut(statut);
        DemandeAnalyse updatedDemande = demandeAnalyseRepository.save(demande);
        return toDTO(updatedDemande);
    }

    public void deleteDemande(Long id) {
        if (!demandeAnalyseRepository.existsById(id)) {
            throw new RuntimeException("Demande d'analyse non trouvée avec l'ID : " + id);
        }
        demandeAnalyseRepository.deleteById(id);
    }


    private DemandeAnalyseDTO toDTO(DemandeAnalyse demande) {
        return DemandeAnalyseDTO.builder()
                .demandeId(demande.getDemandeId())
                .consultationId(demande.getConsultationId())
                .patientId(demande.getPatientId())
                .typeAnalyse(demande.getTypeAnalyse())
                .statut(demande.getStatut())
                .build();
    }

    private DemandeAnalyse toEntity(DemandeAnalyseDTO dto) {
        return DemandeAnalyse.builder()
                .consultationId(dto.getConsultationId())
                .patientId(dto.getPatientId())
                .typeAnalyse(dto.getTypeAnalyse())
                .build();
    }
}
