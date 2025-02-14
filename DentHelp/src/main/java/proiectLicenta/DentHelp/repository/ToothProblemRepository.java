package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.ToothInterventionModel;
import proiectLicenta.DentHelp.model.ToothProblemModel;

import java.util.List;
import java.util.Optional;

@Repository
public interface ToothProblemRepository extends JpaRepository<ToothProblemModel, Long> {
    List<ToothProblemModel> getAllByPatientAndToothNumber(Patient patient, int toothNumber);

    Optional<ToothProblemModel> getToothInterventionModelByProblemId(Long problemId);

    List<ToothProblemModel> getAllByPatient(Patient patient);

}