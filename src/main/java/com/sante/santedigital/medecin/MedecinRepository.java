package com.sante.santedigital.medecin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository  //Indication à la couche dao
public interface MedecinRepository extends JpaRepository<Medecin, Long> { //JpaRepository CRUD automatique

    Optional<Medecin> findByEmail(String email); //Optional le résultat est optionnel

    boolean existsByEmail(String email);

    Optional<Medecin> findByNumOrdre(String numOrdre);

    boolean existsByNumOrdre(String numOrdre);
}
