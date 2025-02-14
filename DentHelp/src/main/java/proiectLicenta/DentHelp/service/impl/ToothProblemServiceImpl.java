package proiectLicenta.DentHelp.service.impl;

import org.springframework.stereotype.Service;
import proiectLicenta.DentHelp.dto.ToothInterventionDto;
import proiectLicenta.DentHelp.dto.ToothProblemDto;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.ToothInterventionModel;
import proiectLicenta.DentHelp.model.ToothProblemModel;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.repository.ToothInterventionRepository;
import proiectLicenta.DentHelp.repository.ToothProblemRepository;
import proiectLicenta.DentHelp.service.ToothInterventionService;
import proiectLicenta.DentHelp.service.ToothProblemService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ToothProblemServiceImpl implements ToothProblemService {
    private final ToothProblemRepository toothProblemRepository;
    private final PatientRepository patientRepository;

    public ToothProblemServiceImpl(ToothProblemRepository toothProblemRepository, PatientRepository patientRepository) {
        this.toothProblemRepository = toothProblemRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    public List<ToothProblemDto> getAllPatientToothProblems(String patientCnp, int toothNumber) {
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(patientCnp);
        if (optionalPatient.isPresent()) {
            List<ToothProblemModel> toothProblemModels = toothProblemRepository.getAllByPatientAndToothNumber(optionalPatient.get(), toothNumber);
            List<ToothProblemDto> toothProblemDtos = new ArrayList<>();
            for (ToothProblemModel toothProblemModel : toothProblemModels) {
                System.out.print(toothProblemModel.getProblemId());
                ToothProblemDto toothProblemDto = new ToothProblemDto();
                toothProblemDto.setDateProblem(toothProblemModel.getDateProblem());
                toothProblemDto.setToothNumber(toothProblemModel.getToothNumber());
                toothProblemDto.setProblemDetails(toothProblemModel.getProblemDetails());
                toothProblemDto.setPatientCnp(patientCnp);
                toothProblemDto.setProblemId(toothProblemModel.getProblemId());
                toothProblemDtos.add(toothProblemDto);
            }
            return toothProblemDtos;
        } else {
            throw new BadRequestException("There is no patient with this cnp");
        }
    }

    @Override
    public List<ToothProblemDto> getPatientAllToothProblems(String cnp) {
        List<ToothProblemDto> toothProblemDtos = new ArrayList<>();
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(cnp);
        if (optionalPatient.isPresent()) {
            List<ToothProblemModel> toothProblemModels = toothProblemRepository.getAllByPatient(optionalPatient.get());
            for (ToothProblemModel toothProblemModel : toothProblemModels) {
                System.out.print(toothProblemModel.getProblemId());
                ToothProblemDto toothProblemDto = new ToothProblemDto();
                toothProblemDto.setDateProblem(toothProblemModel.getDateProblem());
                toothProblemDto.setToothNumber(toothProblemModel.getToothNumber());
                toothProblemDto.setProblemDetails(toothProblemModel.getProblemDetails());
                toothProblemDto.setPatientCnp(cnp);
                toothProblemDto.setProblemId(toothProblemModel.getProblemId());
                toothProblemDtos.add(toothProblemDto);
            }
            return toothProblemDtos;
        } else {
            throw new BadRequestException("There is no patient with this cnp");
        }
    }

    @Override
    public void addNewProblem(ToothProblemDto toothProblemDto) {
        ToothProblemModel toothProblemModel = new ToothProblemModel();
        toothProblemModel.setDateProblem(toothProblemDto.getDateProblem());
        toothProblemModel.setToothNumber(toothProblemDto.getToothNumber());
        toothProblemModel.setProblemDetails(toothProblemDto.getProblemDetails());
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(toothProblemDto.getPatientCnp());
        if(optionalPatient.isPresent()){
            Patient patient= optionalPatient.get();
            toothProblemModel.setPatient(patient);
            toothProblemRepository.save(toothProblemModel);
        }else {
            throw new BadRequestException("There is no patient with this cnp");
        }
    }

    @Override
    public void deleteProblem(Long problemId) {
        Optional<ToothProblemModel> optionalToothProblemModel = toothProblemRepository.getToothInterventionModelByProblemId(problemId);
        if(optionalToothProblemModel.isPresent())
        {
            ToothProblemModel toothProblemModel = optionalToothProblemModel.get();
            toothProblemRepository.delete(toothProblemModel);}
        else{
            throw new BadRequestException("There is no problem with this id");
        }
    }

    @Override
    public void updateProblem(ToothProblemDto toothProblemDto) {
        Optional<ToothProblemModel> optionalToothProblemModel = toothProblemRepository.getToothInterventionModelByProblemId(toothProblemDto.getProblemId());
        if(optionalToothProblemModel.isPresent())
        {
            ToothProblemModel toothProblemModel = optionalToothProblemModel.get();
            toothProblemModel.setProblemDetails(toothProblemDto.getProblemDetails());
            System.out.print(toothProblemModel.getProblemDetails());
            toothProblemRepository.save(toothProblemModel);}
        else{
            throw new BadRequestException("There is no problem with this id");
        }
    }

}
