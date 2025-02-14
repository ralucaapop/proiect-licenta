package proiectLicenta.DentHelp.service;

import org.springframework.stereotype.Service;
import proiectLicenta.DentHelp.dto.ToothInterventionDto;

import java.util.List;

@Service
public interface ToothInterventionService {

    List<ToothInterventionDto> getAllPatientToothIntervention(String patientCnp, int toothNumber);
    void addNewIntervention(ToothInterventionDto toothInterventionDto);

    void deleteIntervention(Long interventionId);

    void updateIntervention(ToothInterventionDto toothInterventionDto);

    List<ToothInterventionDto> getAllPatientTootInterventions(String cnp);

    List<ToothInterventionDto> getPatientAllExtractedTooth(String cnp);

    void deleteTeethExtraction(String cnp, int toothNumber);
}
