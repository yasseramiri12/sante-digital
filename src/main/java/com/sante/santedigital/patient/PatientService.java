package com.sante.santedigital.patient;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;

    public List<PatientDTO> getAllPatient() {
        return patientRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PatientDTO getPatientById(Long id){
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: "+ id));

        return toDTO(patient);
    }

    public PatientDTO getPatientByNin(String nin){
        Patient patient = patientRepository.findByNin(nin)
                .orElseThrow(() -> new RuntimeException("Patient not found with nin:" + nin));

        return toDTO(patient);
    }

    public PatientDTO createPatient(PatientDTO patientDTO){
        if(patientRepository.existsByNin(patientDTO.getNin())){
            throw new RuntimeException("Patient with NIN " + patientDTO.getNin() + " already exists");
        }

        if (patientDTO.getEmail() != null && patientRepository.existsByEmail(patientDTO.getEmail())){
            throw new RuntimeException("Patient with email " + patientDTO.getEmail() + " already exists");
        }

        Patient patient = toEntity(patientDTO);
        Patient saved = patientRepository.save(patient);
        return toDTO(saved);
    }

    public PatientDTO updatePatient(Long id, PatientDTO patientDTO){
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));

        existing.setNom(patientDTO.getNom());
        existing.setPrenom(patientDTO.getPrenom());
        existing.setDateNaissance(patientDTO.getDateNaissance());
        existing.setGroupeSanguin(patientDTO.getGroupeSanguin());
        existing.setTelephone(patientDTO.getTelephone());
        existing.setEmail(patientDTO.getEmail());
        existing.setAdresse(patientDTO.getAdresse());

        Patient updated = patientRepository.save(existing);
        return toDTO(updated);
    }

    public void deletePatient(Long id){
        if (!patientRepository.existsById(id)){
            throw new RuntimeException("Patient not found with id: " + id);
        }
        patientRepository.deleteById(id);
    }

    private Patient toEntity(PatientDTO patientDTO) {
        return Patient.builder()
                .nin(patientDTO.getNin())
                .nom(patientDTO.getNom())
                .prenom(patientDTO.getPrenom())
                .dateNaissance(patientDTO.getDateNaissance())
                .groupeSanguin(patientDTO.getGroupeSanguin())
                .telephone(patientDTO.getTelephone())
                .email(patientDTO.getEmail())
                .adresse(patientDTO.getAdresse())
                .build();
    }

    private PatientDTO toDTO(Patient patient) {
        return PatientDTO.builder()
                .patientId(patient.getPatientId())
                .nin(patient.getNin())
                .nom(patient.getNom())
                .prenom(patient.getPrenom())
                .dateNaissance(patient.getDateNaissance())
                .groupeSanguin(patient.getGroupeSanguin())
                .telephone(patient.getTelephone())
                .email(patient.getEmail())
                .adresse(patient.getAdresse())
                .build();
    }
}

