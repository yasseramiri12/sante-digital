package com.sante.santedigital.medecin;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedecinService{
    private final MedecinRepository medecinRepository;

    public List<MedecinDTO> getAllMedecin(){
        return medecinRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MedecinDTO getMedecinById(Long id){
        Medecin medecin = medecinRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id"+ id));
        return toDTO(medecin);
    }

    public MedecinDTO getMedecinByNumOrdre(String nomOrdre){
        Medecin medecin = medecinRepository.findByNumOrdre(nomOrdre)
                .orElseThrow(() -> new RuntimeException("Doctor not found with numOrdre"+ nomOrdre));

        return toDTO(medecin);
    }

    public MedecinDTO createMedecin(MedecinDTO medecinDTO){
        if (medecinDTO.getEmail() != null && medecinRepository.existsByEmail(medecinDTO.getEmail())){
            throw new RuntimeException("Doctor with email " + medecinDTO.getEmail() + " already exists");
        }

        if (medecinDTO.getNumOrdre() != null && medecinRepository.existsByNumOrdre(medecinDTO.getNumOrdre())){
            throw new RuntimeException("Doctor with numOrdre " + medecinDTO.getNumOrdre() + " already exists");
        }

        Medecin medecin = toEntity(medecinDTO);
        Medecin saved = medecinRepository.save(medecin);

        return toDTO(saved);
    }

    public MedecinDTO updateMedecin(Long id, MedecinDTO medecinDTO){
        Medecin existantMedecin = medecinRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: "+ id));

        if (!existantMedecin.getEmail().equals(medecinDTO.getEmail()) && medecinRepository.existsByEmail(medecinDTO.getEmail())) {
            throw new RuntimeException("Doctor with email " + medecinDTO.getEmail() + " already exists");
        }

        existantMedecin.setNom(medecinDTO.getNom());
        existantMedecin.setPrenom(medecinDTO.getPrenom());
        existantMedecin.setSpecialite(medecinDTO.getSpecialite());
        // do NOT modify numOrdre — immutable
        // do NOT modify utilisateurId — immutable
        existantMedecin.setTelephone(medecinDTO.getTelephone());
        existantMedecin.setEmail(medecinDTO.getEmail());
        existantMedecin.setCabinetAdresse(medecinDTO.getCabinetAdresse());

        Medecin updated = medecinRepository.save(existantMedecin);
        return toDTO(updated);
    }

    public void deleteMedecin(Long id){
        if (!medecinRepository.existsById(id)){
            throw new RuntimeException("Doctor not found with id: "+ id);
        }

        medecinRepository.deleteById(id);
    }

    private MedecinDTO toDTO(Medecin medecin){
      return MedecinDTO.builder()
              .medecinId(medecin.getMedecinId())
              .nom(medecin.getNom())
              .prenom(medecin.getPrenom())
              .numOrdre(medecin.getNumOrdre())
              .specialite(medecin.getSpecialite())
              .telephone(medecin.getTelephone())
              .email(medecin.getEmail())
              .cabinetAdresse(medecin.getCabinetAdresse())
              .build();
  }

    private Medecin toEntity(MedecinDTO medecinDTO){
      return Medecin.builder()
              .nom(medecinDTO.getNom())
              .prenom(medecinDTO.getPrenom())
              .numOrdre(medecinDTO.getNumOrdre())
              .specialite(medecinDTO.getSpecialite())
              .telephone(medecinDTO.getTelephone())
              .email(medecinDTO.getEmail())
              .cabinetAdresse(medecinDTO.getCabinetAdresse())
              .build();
  }
}
