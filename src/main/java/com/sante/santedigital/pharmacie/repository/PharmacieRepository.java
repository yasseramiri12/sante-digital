package com.sante.santedigital.pharmacie.repository;

import com.sante.santedigital.pharmacie.model.Pharmacie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PharmacieRepository extends JpaRepository<Pharmacie, Long> {

    Optional<Pharmacie> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Pharmacie> findByNumAutorisation(String num);

    boolean existsByNumAutorisation(String num);
}
    