package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.PersonalDataDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.PatientPersonalData;
import proiectLicenta.DentHelp.repository.PatientPersonalDataRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.service.PatientPersonalDataService;

import java.util.Optional;

@Service
public class PatientPersonalDataServiceImpl implements PatientPersonalDataService {

    private final PatientPersonalDataRepository patientPersonalDataRepository;
    private final PatientRepository patientRepository;

    @Autowired
    public PatientPersonalDataServiceImpl(PatientPersonalDataRepository patientPersonalDataRepository, PatientRepository patientRepository) {
        this.patientPersonalDataRepository = patientPersonalDataRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    public PatientPersonalData savePatientPersonalData(@RequestBody PersonalDataDto personalDataDto) {
        PatientPersonalData patientPersonalData = new PatientPersonalData();
        patientPersonalData.setAddressNumber(personalDataDto.getAddressNumber());
        patientPersonalData.setAddressCountry(personalDataDto.getAddressCountry());
        patientPersonalData.setPhoneNumber(personalDataDto.getPhoneNumber());
        patientPersonalData.setAddressStreet(personalDataDto.getAddressStreet());
        patientPersonalData.setAddressRegion(personalDataDto.getAddressRegion());
        patientPersonalData.setSex(personalDataDto.getSex());

        Patient patient = new Patient();
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(personalDataDto.getCnpPatient());
        if(optionalPatient.isPresent())
            patient = optionalPatient.get();
        patientPersonalData.setPatient(patient);
        return patientPersonalDataRepository.save(patientPersonalData);
    }

    @Override
    public PatientPersonalData getPatientPersonalData(Patient patient) {
        PatientPersonalData patientPersonalData = new PatientPersonalData();
        Optional<PatientPersonalData> optionalPatientPersonalData = patientPersonalDataRepository.getPatientPersonalDataByPatient(patient);
        if(optionalPatientPersonalData.isPresent())
            patientPersonalData = optionalPatientPersonalData.get();
        return patientPersonalData;
    }

    public void updatePatientPersonalData(PersonalDataDto patientPersonalDataDto){
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(patientPersonalDataDto.getCnpPatient());
        Patient patient;
        PatientPersonalData patientPersonalData ;
        if(optionalPatient.isPresent())
        {
            patient = optionalPatient.get();
            Optional<PatientPersonalData> optionalPersonalData = patientPersonalDataRepository.getPatientPersonalDataByPatient(patient);
            if(optionalPersonalData.isPresent()){
                patientPersonalData = optionalPersonalData.get();
            }
            else {
                patientPersonalData = new PatientPersonalData();
                patientPersonalData.setPatient(patient);
            }
            patientPersonalData.setAddressNumber(patientPersonalDataDto.getAddressNumber());
            patientPersonalData.setAddressRegion(patientPersonalDataDto.getAddressRegion());
            patientPersonalData.setPhoneNumber(patientPersonalDataDto.getPhoneNumber());
            patientPersonalData.setAddressStreet(patientPersonalDataDto.getAddressStreet());
            patientPersonalData.setAddressCountry(patientPersonalDataDto.getAddressCountry());
            patientPersonalData.setSex(patientPersonalDataDto.getSex());
            patientPersonalDataRepository.save(patientPersonalData);
        }
    }
}
