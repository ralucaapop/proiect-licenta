package proiectLicenta.DentHelp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.PersonalDataDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.PatientPersonalData;
import proiectLicenta.DentHelp.repository.PatientPersonalDataRepository;
import proiectLicenta.DentHelp.service.PatientPersonalDataService;
import proiectLicenta.DentHelp.service.PatientService;
import proiectLicenta.DentHelp.service.impl.PatientPersonalDataServiceImpl;
import proiectLicenta.DentHelp.utils.ApiResponse;


@RestController
@RequestMapping(path = "api/in/personalData")
@CrossOrigin("http://localhost:4200")
public class PatientInformationController {

    private final PatientPersonalDataServiceImpl patientPersonalDataServiceImpl;
    private final PatientService patientService;
    public PatientInformationController(PatientPersonalDataServiceImpl patientPersonalDataService, PatientService patientService) {
        this.patientPersonalDataServiceImpl = patientPersonalDataService;
        this.patientService = patientService;
    }

    @PostMapping("/add-personal-data")
    public  ResponseEntity<ApiResponse> addPersonalData(@RequestBody PersonalDataDto personalDataDto){
        patientPersonalDataServiceImpl.savePatientPersonalData(personalDataDto);
        return ResponseEntity.ok(ApiResponse.success("Patient info saved with success", null));
    }

    @PutMapping("/update-personal-data")
    public ResponseEntity<ApiResponse> updatePatientPersonalData(@RequestBody PersonalDataDto personalDataDto){
        patientPersonalDataServiceImpl.updatePatientPersonalData(personalDataDto);
        return ResponseEntity.ok(ApiResponse.success("Patient info saved with succes", null));
    }

    @GetMapping("/get-patient-personal-data/{cnpPatient}")
    public ResponseEntity<ApiResponse> getPatientPersonalData(@PathVariable String cnpPatient){
        Patient patient = patientService.getPatient(cnpPatient);
        PatientPersonalData patientPersonalData = patientPersonalDataServiceImpl.getPatientPersonalData(patient);
        if(patientPersonalData.getIdPersonalData()!=null)
            return ResponseEntity.ok(ApiResponse.success("Get patient personal data succesfully", patientPersonalData));
        else
            return ResponseEntity.ok(ApiResponse.success("Personal data for this patient does not exist", null));
    }

}
