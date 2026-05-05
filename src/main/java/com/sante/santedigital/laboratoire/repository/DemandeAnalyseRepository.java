package com.sante.santedigital.laboratoire.repository;

import com.sante.santedigital.laboratoire.model.DemandeAnalyse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandeAnalyseRepository extends JpaRepository<DemandeAnalyse, Long> {
    List<DemandeAnalyse> findByPatientId(Long patientId);
    List<DemandeAnalyse> findByStatut(String statut);
}

