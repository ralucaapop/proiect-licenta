package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proiectLicenta.DentHelp.model.PatientPersonalData;

@Repository
public interface PatientPersonalDataRepository extends JpaRepository<PatientPersonalData, Long> {
}
