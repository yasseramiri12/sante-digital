package com.sante.santedigital.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByNin(String nin);

    boolean existsAllByNin(String nin);

    boolean existsAllByEmail(String email);

    Optional<Patient> findByEmail(String email);

    boolean existsByNin(String nin);

    boolean existsByEmail(String email);
}

