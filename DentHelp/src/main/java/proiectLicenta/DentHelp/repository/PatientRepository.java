package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proiectLicenta.DentHelp.model.Patient;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {
    Optional<Patient> getPatientByEmail(String email);
    Optional<Patient> getPatientByCNP(String CNP);
}
