package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.PatientPersonalData;

import java.util.Optional;

@Repository
public interface PatientPersonalDataRepository extends JpaRepository<PatientPersonalData, Long> {

    Optional<PatientPersonalData> getPatientPersonalDataByPatient(Patient patient);
}
