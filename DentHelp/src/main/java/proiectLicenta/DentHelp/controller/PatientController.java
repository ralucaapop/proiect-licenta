package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.PatientDto;
import proiectLicenta.DentHelp.dto.PatientUpdateDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.service.PatientService;
import proiectLicenta.DentHelp.service.impl.PatientServiceImpl;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.List;

@RestController
@RequestMapping(path = "api/admin/patient")
@CrossOrigin
public class PatientController {

    private final PatientServiceImpl patientServiceImpl;

    @Autowired
    public PatientController(PatientServiceImpl patientServiceImpl) {
        this.patientServiceImpl = patientServiceImpl;
    }

    @GetMapping("/get-patients")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ApiResponse>getAllPatients() {
        List<Patient> patients = patientServiceImpl.getAllPatients();
        return ResponseEntity.ok(ApiResponse.success("Patients list", patients));

    }

    //by the medic
    @PostMapping("/addPatient")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ApiResponse> addPatient(@RequestBody PatientDto patientDto){
        patientServiceImpl.addNewPatient(patientDto);
        return ResponseEntity.ok(ApiResponse.success("New patient added", null));
    }

    @PutMapping("/update-patient-information/{cnp}")

    public ResponseEntity<ApiResponse> updatePatientProfileInformation(@PathVariable String cnp, @RequestBody PatientUpdateDto patientUpdateDto){
        System.out.print(cnp);
        patientServiceImpl.updatePatient(cnp, patientUpdateDto);
        return ResponseEntity.ok(ApiResponse.success("Edit done", null));
    }

}
