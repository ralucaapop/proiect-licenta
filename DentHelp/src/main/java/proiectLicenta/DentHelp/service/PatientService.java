package proiectLicenta.DentHelp.service;


import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.PatientDto;
import proiectLicenta.DentHelp.dto.PatientUpdateDto;
import proiectLicenta.DentHelp.model.Patient;

import java.util.List;
import java.util.Optional;

public interface PatientService {
    List<Patient>getAllPatients();
    Patient addNewPatient(@RequestBody PatientDto patientDto);
    void updatePatient(String cnp, @RequestBody PatientUpdateDto patientUpdateDto);
    Patient getPatient(String cnp);

    void changeKidToPatient(String cnp, String emailKid);
}
