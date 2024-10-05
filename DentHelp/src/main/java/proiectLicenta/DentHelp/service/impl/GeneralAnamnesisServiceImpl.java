package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proiectLicenta.DentHelp.dto.GeneralAnamnesisDto;
import proiectLicenta.DentHelp.model.GeneralAnamnesis;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.PatientPersonalData;
import proiectLicenta.DentHelp.repository.GeneralAnamnesisRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.service.GeneralAnamnesisService;

import java.security.CodeSigner;
import java.util.Optional;

@Service
public class GeneralAnamnesisServiceImpl implements GeneralAnamnesisService {

    private final GeneralAnamnesisRepository generalAnamnesisRepository;
    private final PatientRepository patientRepository;

    @Autowired
    public GeneralAnamnesisServiceImpl(GeneralAnamnesisRepository generalAnamnesisRepository, PatientRepository patientRepository) {
        this.generalAnamnesisRepository = generalAnamnesisRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    public void saveGeneralAnamnesis(GeneralAnamnesisDto generalAnamnesisDto) {
        GeneralAnamnesis generalAnamnesis = new GeneralAnamnesis();
        generalAnamnesis.setAllergies(generalAnamnesisDto.getAllergies());
        generalAnamnesis.setSmoker(generalAnamnesisDto.getSmoker());
        generalAnamnesis.setAlcoholConsumer(generalAnamnesisDto.getAlcoholConsumer());
        generalAnamnesis.setPreviousDentalProblems(generalAnamnesisDto.getPreviousDentalProblems());
        generalAnamnesis.setMedicalIntolerance(generalAnamnesisDto.getMedicalIntolerance());
        generalAnamnesis.setCoagulationProblems(generalAnamnesisDto.getCoagulationProblems());

        Patient patient;
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(generalAnamnesisDto.getCnp());
        if(optionalPatient.isPresent())
        {
            patient = optionalPatient.get();
            generalAnamnesis.setPatinet(patient);
            generalAnamnesisRepository.save(generalAnamnesis);
        }
    }

    @Override
    public GeneralAnamnesis getPatientGeneralAnamnesis(String cnpPatient) {

        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(cnpPatient);
        Patient patient;
        GeneralAnamnesis generalAnamnesis = new GeneralAnamnesis();

        if(optionalPatient.isPresent()){

            patient = optionalPatient.get();
            Optional<GeneralAnamnesis> optionalGeneralAnamnesis = generalAnamnesisRepository.getGeneralAnamnesisByPatinet(patient);

            if(optionalGeneralAnamnesis.isPresent())
                generalAnamnesis = optionalGeneralAnamnesis.get();
        }
        return generalAnamnesis;
    }

    @Override
    public void updateGeneralAnamnesis(GeneralAnamnesisDto generalAnamnesisDto) {
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(generalAnamnesisDto.getCnp());
        Patient patient;
        GeneralAnamnesis generalAnamnesis ;
        if(optionalPatient.isPresent()) {
            patient = optionalPatient.get();
            Optional<GeneralAnamnesis> optionalGeneralAnamnesis = generalAnamnesisRepository.getGeneralAnamnesisByPatinet(patient);
            if(optionalGeneralAnamnesis.isPresent())
                generalAnamnesis = optionalGeneralAnamnesis.get();
            else{
                generalAnamnesis = new GeneralAnamnesis();
                generalAnamnesis.setPatinet(patient);
            }

        generalAnamnesis.setAlcoholConsumer(generalAnamnesisDto.getAlcoholConsumer());
        generalAnamnesis.setMedicalIntolerance(generalAnamnesisDto.getMedicalIntolerance());
        generalAnamnesis.setPreviousDentalProblems(generalAnamnesisDto.getPreviousDentalProblems());
        generalAnamnesis.setAllergies(generalAnamnesisDto.getAllergies());
        generalAnamnesis.setSmoker(generalAnamnesisDto.getSmoker());
        generalAnamnesis.setCoagulationProblems(generalAnamnesisDto.getCoagulationProblems());
        generalAnamnesisRepository.save(generalAnamnesis);
        }
    }
}
