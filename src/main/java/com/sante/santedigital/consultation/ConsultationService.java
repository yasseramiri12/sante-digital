package com.sante.santedigital.consultation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationService {

    private final ConsultationRepository consultationRepository;

    public List<ConsultationDTO> getAllConsultations() {
        return consultationRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ConsultationDTO getConsultationById(Long id) {
        return consultationRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));
    }

    public List<ConsultationDTO> getConsultationsByPatient(Long patientId) {
        return consultationRepository.findByPatientId(patientId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ConsultationDTO> getConsultationsByMedecin(Long medecinId) {
        return consultationRepository.findByMedecinId(medecinId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ConsultationDTO createConsultation(ConsultationDTO dto) {
        Consultation entity = toEntity(dto);
        Consultation saved = consultationRepository.save(entity);
        return toDTO(saved);
    }

    public ConsultationDTO updateConsultation(Long id, ConsultationDTO dto) {
        Consultation existing = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));

        existing.setPatientId(dto.getPatientId());
        existing.setMedecinId(dto.getMedecinId());
        existing.setDateHeure(dto.getDateHeure());
        existing.setMotif(dto.getMotif());
        existing.setDiagnosticCim10(dto.getDiagnosticCim10());
        existing.setCompteRendu(dto.getCompteRendu());

        Consultation updated = consultationRepository.save(existing);
        return toDTO(updated);
    }

    public void deleteConsultation(Long id) {
        if (!consultationRepository.existsById(id)) {
            throw new RuntimeException("Consultation not found");
        }
        consultationRepository.deleteById(id);
    }

    private ConsultationDTO toDTO(Consultation entity) {
        return ConsultationDTO.builder()
                .consultationId(entity.getConsultationId())
                .patientId(entity.getPatientId())
                .medecinId(entity.getMedecinId())
                .dateHeure(entity.getDateHeure())
                .motif(entity.getMotif())
                .diagnosticCim10(entity.getDiagnosticCim10())
                .compteRendu(entity.getCompteRendu())
                .build();
    }

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
}

