package com.sante.santedigital.consultation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationService {

    private final ConsultationRepository consultationRepository;

    // ==================== GET ALL ====================
    public List<ConsultationDTO> getAllConsultations() {
        return consultationRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ==================== GET BY ID ====================
    public ConsultationDTO getConsultationById(Long id) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found with id: " + id));
        return toDTO(consultation);
    }

    // ==================== GET BY PATIENT ====================
    public List<ConsultationDTO> getConsultationsByPatient(Long patientId) {
        return consultationRepository.findByPatientId(patientId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ==================== GET BY MEDECIN ====================
    public List<ConsultationDTO> getConsultationsByMedecin(Long medecinId) {
        return consultationRepository.findByMedecinId(medecinId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ==================== CREATE ====================
    public ConsultationDTO createConsultation(ConsultationDTO dto) {
        Consultation consultation = toEntity(dto);
        Consultation saved = consultationRepository.save(consultation);
        return toDTO(saved);
    }

    // ==================== UPDATE ====================
    public ConsultationDTO updateConsultation(Long id, ConsultationDTO dto) {
        Consultation existing = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found with id: " + id));

        existing.setPatientId(dto.getPatientId());
        existing.setMedecinId(dto.getMedecinId());
        existing.setDateHeure(dto.getDateHeure());
        existing.setMotif(dto.getMotif());
        existing.setDiagnosticCim10(dto.getDiagnosticCim10());
        existing.setCompteRendu(dto.getCompteRendu());

        Consultation updated = consultationRepository.save(existing);
        return toDTO(updated);
    }

    // ==================== DELETE ====================
    public void deleteConsultation(Long id) {
        if (!consultationRepository.existsById(id)) {
            throw new RuntimeException("Consultation not found with id: " + id);
        }
        consultationRepository.deleteById(id);
    }

    // ==================== MAPPERS ====================
    private Consultation toEntity(ConsultationDTO dto) {
        return Consultation.builder()
                .patientId(dto.getPatientId())
                .medecinId(dto.getMedecinId())
                .dateHeure(dto.getDateHeure())
                .motif(dto.getMotif())
                .diagnosticCim10(dto.getDiagnosticCim10())
                .compteRendu(dto.getCompteRendu())
                .build();
    }

    private ConsultationDTO toDTO(Consultation consultation) {
        return ConsultationDTO.builder()
                .consultationId(consultation.getConsultationId())
                .patientId(consultation.getPatientId())
                .medecinId(consultation.getMedecinId())
                .dateHeure(consultation.getDateHeure())
                .motif(consultation.getMotif())
                .diagnosticCim10(consultation.getDiagnosticCim10())
                .compteRendu(consultation.getCompteRendu())
                .build();
    }
}
