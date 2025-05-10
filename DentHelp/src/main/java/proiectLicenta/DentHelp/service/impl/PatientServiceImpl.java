package proiectLicenta.DentHelp.service.impl;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.PatientDto;
import proiectLicenta.DentHelp.dto.PatientUpdateDto;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.exceptions.ResourceNotFoundException;
import proiectLicenta.DentHelp.model.GeneralAnamnesis;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.UserRole;
import proiectLicenta.DentHelp.repository.GeneralAnamnesisRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.service.GeneralAnamnesisService;
import proiectLicenta.DentHelp.service.PatientService;

import java.util.List;
import java.util.Optional;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final GeneralAnamnesisRepository generalAnamnesisRepository;

    @Autowired
    public PatientServiceImpl(PatientRepository patientRepository, GeneralAnamnesisRepository generalAnamnesisRepository) {
        this.patientRepository = patientRepository;
        this.generalAnamnesisRepository = generalAnamnesisRepository;
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public List<Patient> getKids(String cnpPatient){
        return patientRepository.findAllByParent(cnpPatient);
    }

    public Patient getPatient(String cnp){
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(cnp);
        Patient patient = new Patient();
        if(optionalPatient.isPresent()){
            patient = optionalPatient.get();
        }
        return patient;
    }

    @Override
    public void changeKidToPatient(String cnp, String emailKid) {

        Optional<Patient> patientOptional = patientRepository.getPatientByEmail(emailKid);
        if(patientOptional.isPresent())
            throw new BadRequestException("Acest e-mail aparține deja unui alt utilizator.");

        Patient patient = getPatient(cnp);
        patient.setParent(null);
        patient.setPassword(patient.getCNP());
        patient.setEmail(emailKid);

        patientRepository.save(patient);
    }

    public Patient addNewPatient(@RequestBody PatientDto patientDto){
        Optional<Patient> patientOptional = patientRepository.getPatientByEmail(patientDto.getEmail());
        if (patientOptional.isPresent()) {
            throw new BadRequestException("Email already exists in db");
        }
        Optional<Patient> patientOptional1 = patientRepository.getPatientByCNP(patientDto.getCnp());
        if (patientOptional1.isPresent()) {
            throw new BadRequestException("CNP already exists in db");
        }
        Patient patient = new Patient();
        patient.setFirstName(patientDto.getFirstName());
        patient.setLastName(patientDto.getLastName());
        patient.setCNP(patientDto.getCnp());
        patient.setParent(patientDto.getParent());
        patient.setUserRole(UserRole.valueOf(patientDto.getUserRole()));
        String defaultPassword = patientDto.getPassword();
        String password = BCrypt.hashpw(defaultPassword, BCrypt.gensalt());
        patient.setPassword(password);
        patient.setEmail(patientDto.getEmail());
        return patientRepository.save(patient);
    }


    public void updatePatient(String cnp, @RequestBody PatientUpdateDto patientUpdateDto) {
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(cnp);
        Patient patient;
        if(optionalPatient.isPresent())
        {
            patient = optionalPatient.get();
            patient.setFirstName(patientUpdateDto.getFirstName());
            patient.setLastName(patientUpdateDto.getLastName());
            patientRepository.save(patient);

            Optional<GeneralAnamnesis> optionalGeneralAnamnesis = generalAnamnesisRepository.getGeneralAnamnesisByPatinet(patient);
            GeneralAnamnesis generalAnamnesis;

            if(optionalGeneralAnamnesis.isPresent())
            {
                generalAnamnesis = optionalGeneralAnamnesis.get();
                generalAnamnesis.setAllergies(patientUpdateDto.getAllergies());
                generalAnamnesis.setAlcoholConsumer(patientUpdateDto.getAlcoholConsumer());
                generalAnamnesis.setMedicalIntolerance(patientUpdateDto.getMedicalIntolerance());
                generalAnamnesis.setSmoker(patientUpdateDto.getSmoker());
                generalAnamnesis.setCoagulationProblems(patientUpdateDto.getCoagulationProblems());
                generalAnamnesisRepository.save(generalAnamnesis);
            }
            else
                throw new ResourceNotFoundException("Patient not found in genereal-anamnesis with cnp: " + cnp);
        }
        else
            throw new ResourceNotFoundException("Patient not found in patients with cnp: " + cnp);
    }

    public void changeRadiologistToPatient(String cnp) {
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(cnp);
        Patient patient;
        if(optionalPatient.isPresent())
        {
            patient = optionalPatient.get();
            patient.setUserRole(UserRole.PATIENT);
            patientRepository.save(patient);
        }
        else
            throw new ResourceNotFoundException("Patient not found in patients with cnp: " + cnp);
    }
}
