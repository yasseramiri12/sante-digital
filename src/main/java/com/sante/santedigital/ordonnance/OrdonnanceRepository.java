package com.sante.santedigital.ordonnance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdonnanceRepository extends JpaRepository<Ordonnance, Long> {

    List<Ordonnance> findByPatientId(Long patientId);

    List<Ordonnance> findByStatut(String statut);

    List<Ordonnance> findByConsultationId(Long consultationId);
}

