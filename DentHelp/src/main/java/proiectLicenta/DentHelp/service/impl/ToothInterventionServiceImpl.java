package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proiectLicenta.DentHelp.dto.ToothInterventionDto;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.ToothInterventionModel;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.repository.ToothInterventionRepository;
import proiectLicenta.DentHelp.service.ToothInterventionService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ToothInterventionServiceImpl implements ToothInterventionService {

    private final ToothInterventionRepository toothInterventionRepository;
    private final PatientRepository patientRepository;

    @Autowired
    public ToothInterventionServiceImpl(ToothInterventionRepository toothInterventionRepository, PatientRepository patientRepository) {
        this.toothInterventionRepository = toothInterventionRepository;
        this.patientRepository = patientRepository;
    }



    @Override
    public List<ToothInterventionDto> getAllPatientToothIntervention(String patientCnp, int toothNumber) {
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(patientCnp);
        if (optionalPatient.isPresent()) {
            List<ToothInterventionModel> toothInterventionModels = toothInterventionRepository.getAllByPatientAndToothNumber(optionalPatient.get(), toothNumber);
            List<ToothInterventionDto> toothInterventionDtos = new ArrayList<>();
            for (ToothInterventionModel toothInterventionModel : toothInterventionModels) {
                System.out.print(toothInterventionModel.getInterventionId());
                ToothInterventionDto toothInterventionDto = new ToothInterventionDto();
                toothInterventionDto.setDateIntervention(toothInterventionModel.getDateIntervention());
                toothInterventionDto.setToothNumber(toothInterventionModel.getToothNumber());
                toothInterventionDto.setInterventionDetails(toothInterventionModel.getInterventionDetails());
                toothInterventionDto.setPatientCnp(patientCnp);
                toothInterventionDto.setInterventionId(toothInterventionModel.getInterventionId());
                toothInterventionDtos.add(toothInterventionDto);
            }
            return toothInterventionDtos;
        } else {
            throw new BadRequestException("There is no patient with this cnp");
        }
    }

    @Override
    public void addNewIntervention(ToothInterventionDto toothInterventionDto) {
        ToothInterventionModel toothInterventionModel = new ToothInterventionModel();
        toothInterventionModel.setDateIntervention(toothInterventionDto.getDateIntervention());
        toothInterventionModel.setToothNumber(toothInterventionDto.getToothNumber());
        toothInterventionModel.setInterventionDetails(toothInterventionDto.getInterventionDetails());
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(toothInterventionDto.getPatientCnp());
        if(optionalPatient.isPresent()){
            Patient patient= optionalPatient.get();
            toothInterventionModel.setPatient(patient);
            toothInterventionRepository.save(toothInterventionModel);
        }else {
            throw new BadRequestException("There is no patient with this cnp");
        }
    }

    @Override
    public void deleteIntervention(Long interventionId) {
        Optional<ToothInterventionModel> optionalToothInterventionModel = toothInterventionRepository.getToothInterventionModelByInterventionId(interventionId);
        if(optionalToothInterventionModel.isPresent())
        {
            ToothInterventionModel toothInterventionModel = optionalToothInterventionModel.get();
            toothInterventionRepository.delete(toothInterventionModel);}
        else{
            throw new BadRequestException("There is no intervention with this id");
        }
    }

    @Override
    public void updateIntervention(ToothInterventionDto toothInterventionDto) {
        Optional<ToothInterventionModel> optionalToothInterventionModel = toothInterventionRepository.getToothInterventionModelByInterventionId(toothInterventionDto.getInterventionId());
        if(optionalToothInterventionModel.isPresent())
        {
            ToothInterventionModel toothInterventionModel = optionalToothInterventionModel.get();
            toothInterventionModel.setInterventionDetails(toothInterventionDto.getInterventionDetails());
            System.out.print(toothInterventionModel.getInterventionDetails());
            toothInterventionRepository.save(toothInterventionModel);}
        else{
            throw new BadRequestException("There is no intervention with this id");
        }
    }


}