package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.PersonalDataDto;
import proiectLicenta.DentHelp.model.PatientPersonalData;
import proiectLicenta.DentHelp.repository.PatientPersonalDataRepository;
import proiectLicenta.DentHelp.service.PatientPersonalDataService;

@Service
public class PatientPersonalDataServiceImpl implements PatientPersonalDataService {

    private final PatientPersonalDataRepository patientPersonalDataRepository;

    @Autowired
    public PatientPersonalDataServiceImpl(PatientPersonalDataRepository patientPersonalDataRepository) {
        this.patientPersonalDataRepository = patientPersonalDataRepository;
    }

    @Override
    public PatientPersonalData savePatientPersonalData(@RequestBody PersonalDataDto personalDataDto) {
        PatientPersonalData patientPersonalData = new PatientPersonalData();
        patientPersonalData.setAddressNumber(personalDataDto.getAddressNumber());
        patientPersonalData.setAddressCountry(personalDataDto.getAddressCountry());
        patientPersonalData.setPhoneNumber(personalDataDto.getPhoneNumber());
        patientPersonalData.setAddressRegion(personalDataDto.getAddressRegion());
        return patientPersonalDataRepository.save(patientPersonalData);
    }
}
