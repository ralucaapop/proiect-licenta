package proiectLicenta.DentHelp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.PersonalDataDto;
import proiectLicenta.DentHelp.model.PatientPersonalData;
import proiectLicenta.DentHelp.repository.PatientPersonalDataRepository;
import proiectLicenta.DentHelp.service.PatientPersonalDataService;
import proiectLicenta.DentHelp.service.impl.PatientPersonalDataServiceImpl;
import proiectLicenta.DentHelp.utils.ApiResponse;


@RestController
@RequestMapping(path = "api/in/home")
@CrossOrigin("http://localhost:4200")
public class PatientInformationController {

    private final PatientPersonalDataServiceImpl patientPersonalDataServiceImpl;

    public PatientInformationController(PatientPersonalDataServiceImpl patientPersonalDataService) {
        this.patientPersonalDataServiceImpl = patientPersonalDataService;
    }

    @PostMapping("/personalData")
    public  ResponseEntity<ApiResponse> addPersonalData(@RequestBody PersonalDataDto personalDataDto){
        patientPersonalDataServiceImpl.savePatientPersonalData(personalDataDto);
        return ResponseEntity.ok(ApiResponse.success("Patient info saved with success", null));
    }

}
