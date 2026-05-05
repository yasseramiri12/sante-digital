package com.sante.santedigital.pharmacie.repository;

import com.sante.santedigital.pharmacie.model.Dispensation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DispensationRepository extends JpaRepository<Dispensation, Long> {

    Optional<Dispensation> findByOrdonnanceId(Long ordonnanceId);

    List<Dispensation> findByPharmacieId(Long pharmacieId);

    boolean existsByOrdonnanceId(Long ordonnanceId);
}
