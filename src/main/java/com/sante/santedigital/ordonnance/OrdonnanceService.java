package com.sante.santedigital.ordonnance;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdonnanceService {

    private final OrdonnanceRepository ordonnanceRepository;

    public List<OrdonnanceDTO> getAllOrdonnances() {
        return ordonnanceRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OrdonnanceDTO getOrdonnanceById(Long id) {
        return ordonnanceRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Ordonnance not found"));
    }

    public List<OrdonnanceDTO> getOrdonnancesByPatient(Long patientId) {
        return ordonnanceRepository.findByPatientId(patientId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<OrdonnanceDTO> getOrdonnancesByStatut(String statut) {
        return ordonnanceRepository.findByStatut(statut)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OrdonnanceDTO createOrdonnance(OrdonnanceDTO ordonnanceDTO) {
        Ordonnance entity = toEntity(ordonnanceDTO);
        Ordonnance saved = ordonnanceRepository.save(entity);
        return toDTO(saved);
    }

    public OrdonnanceDTO closeOrdonnance(Long id) {
        Ordonnance existing = ordonnanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordonnance not found"));
        existing.setStatut(StatutOrdonnance.USED);
        return toDTO(ordonnanceRepository.save(existing));
    }

    public OrdonnanceDTO expireOrdonnance(Long id) {
        Ordonnance existing = ordonnanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordonnance not found"));
        existing.setStatut(StatutOrdonnance.EXPIRED);
        return toDTO(ordonnanceRepository.save(existing));
    }

    public void deleteOrdonnance(Long id) {
        if (!ordonnanceRepository.existsById(id)) {
            throw new RuntimeException("Ordonnance not found");
        }
        ordonnanceRepository.deleteById(id);
    }

    private OrdonnanceDTO toDTO(Ordonnance ordonnance) {
        return OrdonnanceDTO.builder()
                .ordonnanceId(ordonnance.getOrdonnanceId())
                .consultationId(ordonnance.getConsultationId())
                .patientId(ordonnance.getPatientId())
                .dateExpiration(ordonnance.getDateExpiration())
                .statut(ordonnance.getStatut())
                .build();
    }

    private Ordonnance toEntity(OrdonnanceDTO ordonnanceDTO) {
        return Ordonnance.builder()
                .consultationId(ordonnanceDTO.getConsultationId())
                .patientId(ordonnanceDTO.getPatientId())
                .dateExpiration(ordonnanceDTO.getDateExpiration())
                .build();
    }
}

