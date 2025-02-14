package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.ToothInterventionModel;

import java.util.List;
import java.util.Optional;

@Repository
public interface ToothInterventionRepository extends JpaRepository<ToothInterventionModel, Long> {
     List<ToothInterventionModel> getAllByPatientAndToothNumber(Patient patient, int toothNumber);

     Optional<ToothInterventionModel> getToothInterventionModelByInterventionId(Long interventionId);

     List<ToothInterventionModel> getAllByPatient(Patient patient);

     List<ToothInterventionModel> getAllByPatientAndIsExtractedAndToothNumber(Patient patient, String isExtracted, int toothNumber);
     List<ToothInterventionModel> getAllByPatientAndIsExtracted(Patient patient, String isExtracted);

}
