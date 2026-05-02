package com.sante.santedigital.ordonnance;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdonnanceService {

    private final OrdonnanceRepository ordonnanceRepository;

    // ==================== GET ALL ====================
    public List<OrdonnanceDTO> getAllOrdonnances() {
        return ordonnanceRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ==================== GET BY ID ====================
    public OrdonnanceDTO getOrdonnanceById(Long id) {
        Ordonnance ordonnance = ordonnanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordonnance not found with id: " + id));
        return toDTO(ordonnance);
    }

    // ==================== GET BY PATIENT ====================
    public List<OrdonnanceDTO> getOrdonnancesByPatient(Long patientId) {
        return ordonnanceRepository.findByPatientId(patientId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ==================== GET BY STATUT ====================
    public List<OrdonnanceDTO> getOrdonnancesByStatut(String statut) {
        return ordonnanceRepository.findByStatut(statut)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ==================== CREATE ====================
    public OrdonnanceDTO createOrdonnance(OrdonnanceDTO dto) {
        Ordonnance ordonnance = toEntity(dto);
        Ordonnance saved = ordonnanceRepository.save(ordonnance);
        return toDTO(saved);
    }

    // ==================== CLOSE (USED) ====================
    public OrdonnanceDTO closeOrdonnance(Long id) {
        Ordonnance ordonnance = ordonnanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordonnance not found with id: " + id));
        ordonnance.setStatut("USED");
        Ordonnance updated = ordonnanceRepository.save(ordonnance);
        return toDTO(updated);
    }

    // ==================== EXPIRE ====================
    public OrdonnanceDTO expireOrdonnance(Long id) {
        Ordonnance ordonnance = ordonnanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordonnance not found with id: " + id));
        ordonnance.setStatut("EXPIRED");
        Ordonnance updated = ordonnanceRepository.save(ordonnance);
        return toDTO(updated);
    }

    // ==================== DELETE ====================
    public void deleteOrdonnance(Long id) {
        if (!ordonnanceRepository.existsById(id)) {
            throw new RuntimeException("Ordonnance not found with id: " + id);
        }
        ordonnanceRepository.deleteById(id);
    }

    // ==================== MAPPERS ====================
    private Ordonnance toEntity(OrdonnanceDTO dto) {
        return Ordonnance.builder()
                .consultationId(dto.getConsultationId())
                .patientId(dto.getPatientId())
                .dateExpiration(dto.getDateExpiration())
                .statut(dto.getStatut() != null ? dto.getStatut() : "ACTIVE")
                .build();
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
}
