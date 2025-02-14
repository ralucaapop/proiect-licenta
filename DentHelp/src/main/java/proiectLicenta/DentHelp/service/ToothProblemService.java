package proiectLicenta.DentHelp.service;

import org.springframework.stereotype.Service;
import proiectLicenta.DentHelp.dto.ToothInterventionDto;
import proiectLicenta.DentHelp.dto.ToothProblemDto;

import java.util.List;

@Service
public interface ToothProblemService {
    List<ToothProblemDto> getAllPatientToothProblems(String patientCnp, int toothNumber);
    List<ToothProblemDto> getPatientAllToothProblems(String cnp);
    void addNewProblem(ToothProblemDto toothProblemDto);

    void deleteProblem(Long problemId);

    void updateProblem(ToothProblemDto toothProblemDto);
}
