package proiectLicenta.DentHelp.service;

import proiectLicenta.DentHelp.dto.PersonalDataDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.PatientPersonalData;

public interface PatientPersonalDataService {
    PatientPersonalData savePatientPersonalData(PersonalDataDto personalDataDto);
    PatientPersonalData getPatientPersonalData(Patient patient);
    void updatePatientPersonalData(PersonalDataDto personalDataDto);
}
