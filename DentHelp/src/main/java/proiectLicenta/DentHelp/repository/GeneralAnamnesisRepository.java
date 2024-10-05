package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proiectLicenta.DentHelp.model.GeneralAnamnesis;
import proiectLicenta.DentHelp.model.Patient;

import java.util.Optional;

@Repository
public interface GeneralAnamnesisRepository extends JpaRepository<GeneralAnamnesis, Long> {

    Optional<GeneralAnamnesis> getGeneralAnamnesisByPatinet(Patient patient);
}
