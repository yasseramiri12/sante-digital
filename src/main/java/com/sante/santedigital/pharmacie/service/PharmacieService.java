package com.sante.santedigital.pharmacie.service;

import com.sante.santedigital.pharmacie.dto.DispensationDTO;
import com.sante.santedigital.pharmacie.dto.PharmacieDTO;
import com.sante.santedigital.pharmacie.model.Dispensation;
import com.sante.santedigital.pharmacie.model.Pharmacie;
import com.sante.santedigital.pharmacie.repository.DispensationRepository;
import com.sante.santedigital.pharmacie.repository.PharmacieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacieService {

    private final PharmacieRepository pharmacieRepository;
    private final DispensationRepository dispensationRepository;

    //Pharmacie

    public List<PharmacieDTO> getAllPharmacies() {
        return pharmacieRepository.findAll()
                .stream()
                .map(this::toPharmacieDTO)
                .collect(Collectors.toList());
    }

    public PharmacieDTO getPharmacieById(Long id) {
        Pharmacie pharmacie = pharmacieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pharmacie not found with id: " + id));
        return toPharmacieDTO(pharmacie);
    }

    public PharmacieDTO createPharmacie(PharmacieDTO dto) {
        if (pharmacieRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Pharmacie with this email already exists");
        }
        if (pharmacieRepository.existsByNumAutorisation(dto.getNumAutorisation())) {
            throw new RuntimeException("Pharmacie with this numAutorisation already exists");
        }
        Pharmacie pharmacie = toPharmacieEntity(dto);
        Pharmacie saved = pharmacieRepository.save(pharmacie);
        return toPharmacieDTO(saved);
    }

    public PharmacieDTO updatePharmacie(Long id, PharmacieDTO dto) {
        Pharmacie existing = pharmacieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pharmacie not found with id: " + id));

        if (!existing.getEmail().equals(dto.getEmail()) && pharmacieRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Pharmacie with this email already exists");
        }

        existing.setNom(dto.getNom());
        existing.setAdresse(dto.getAdresse());
        existing.setTelephone(dto.getTelephone());
        existing.setEmail(dto.getEmail());

        Pharmacie updated = pharmacieRepository.save(existing);
        return toPharmacieDTO(updated);
    }

    public void deletePharmacie(Long id) {
        if (!pharmacieRepository.existsById(id)) {
            throw new RuntimeException("Pharmacie not found with id: " + id);
        }
        pharmacieRepository.deleteById(id);
    }

    //Dispensation

    public List<DispensationDTO> getAllDispensations() {
        return dispensationRepository.findAll()
                .stream()
                .map(this::toDispensationDTO)
                .collect(Collectors.toList());
    }

    public DispensationDTO getDispensationById(Long id) {
        Dispensation dispensation = dispensationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispensation not found with id: " + id));
        return toDispensationDTO(dispensation);
    }

    public List<DispensationDTO> getDispensationsByPharmacie(Long pharmacieId) {
        if (!pharmacieRepository.existsById(pharmacieId)) {
            throw new RuntimeException("Pharmacie not found with id: " + pharmacieId);
        }
        return dispensationRepository.findByPharmacieId(pharmacieId)
                .stream()
                .map(this::toDispensationDTO)
                .collect(Collectors.toList());
    }

    public DispensationDTO getDispensationByOrdonnance(Long ordonnanceId) {
        Dispensation dispensation = dispensationRepository.findByOrdonnanceId(ordonnanceId)
                .orElseThrow(() -> new RuntimeException("Dispensation not found for ordonnance id: " + ordonnanceId));
        return toDispensationDTO(dispensation);
    }

    public DispensationDTO createDispensation(DispensationDTO dto) {
        if (dispensationRepository.existsByOrdonnanceId(dto.getOrdonnanceId())) {
            throw new RuntimeException("Ordonnance already dispensed");
        }
        if (!pharmacieRepository.existsById(dto.getPharmacieId())) {
            throw new RuntimeException("Pharmacie not found with id: " + dto.getPharmacieId());
        }

        Dispensation dispensation = toDispensationEntity(dto);
        Dispensation saved = dispensationRepository.save(dispensation);
        return toDispensationDTO(saved);
    }

    public void deleteDispensation(Long id) {
        if (!dispensationRepository.existsById(id)) {
            throw new RuntimeException("Dispensation not found with id: " + id);
        }
        dispensationRepository.deleteById(id);
    }

    //Mappers
    private PharmacieDTO toPharmacieDTO(Pharmacie pharmacie) {
        return PharmacieDTO.builder()
                .pharmacieId(pharmacie.getPharmacieId())
                .nom(pharmacie.getNom())
                .adresse(pharmacie.getAdresse())
                .telephone(pharmacie.getTelephone())
                .email(pharmacie.getEmail())
                .numAutorisation(pharmacie.getNumAutorisation())
                .build();
    }

    private Pharmacie toPharmacieEntity(PharmacieDTO dto) {
        return Pharmacie.builder()
                .nom(dto.getNom())
                .adresse(dto.getAdresse())
                .telephone(dto.getTelephone())
                .email(dto.getEmail())
                .numAutorisation(dto.getNumAutorisation())
                // utilisateurId is excluded from DTO, would need to be set separately if required
                .build();
    }

    private DispensationDTO toDispensationDTO(Dispensation dispensation) {
        return DispensationDTO.builder()
                .dispensationId(dispensation.getDispensationId())
                .ordonnanceId(dispensation.getOrdonnanceId())
                .pharmacieId(dispensation.getPharmacieId())
                .interactionsOk(dispensation.getInteractionsOk())
                .pharmacienNom(dispensation.getPharmacienNom())
                .build();
    }

    private Dispensation toDispensationEntity(DispensationDTO dto) {
        return Dispensation.builder()
                .ordonnanceId(dto.getOrdonnanceId())
                .pharmacieId(dto.getPharmacieId())
                .interactionsOk(dto.getInteractionsOk())
                .pharmacienNom(dto.getPharmacienNom())
                .build();
    }
}
