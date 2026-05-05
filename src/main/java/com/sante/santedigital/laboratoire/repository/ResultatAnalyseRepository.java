package com.sante.santedigital.laboratoire.repository;

import com.sante.santedigital.laboratoire.model.ResultatAnalyse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultatAnalyseRepository extends JpaRepository<ResultatAnalyse, Long> {
    Optional<ResultatAnalyse> findByDemandeId(Long demandeId);
    List<ResultatAnalyse> findByAlerteCritique(boolean alerteCritique);
}

