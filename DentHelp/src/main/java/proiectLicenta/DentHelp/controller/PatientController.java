package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.PatientDto;
import proiectLicenta.DentHelp.dto.PatientPersonalDataAdminPageDto;
import proiectLicenta.DentHelp.dto.PatientUpdateDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.PatientPersonalData;
import proiectLicenta.DentHelp.service.PatientPersonalDataService;
import proiectLicenta.DentHelp.service.PatientService;
import proiectLicenta.DentHelp.service.impl.PatientServiceImpl;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/api/admin/patient")
@CrossOrigin
public class PatientController {

    private final PatientServiceImpl patientServiceImpl;
    private final PatientPersonalDataService patientPersonalDataService;

    @Autowired
    public PatientController(PatientServiceImpl patientServiceImpl, PatientPersonalDataService patientPersonalDataService) {
        this.patientServiceImpl = patientServiceImpl;
        this.patientPersonalDataService = patientPersonalDataService;
    }

    @GetMapping("/get-patients")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'RADIOLOGIST')")
    public ResponseEntity<ApiResponse>getAllPatients() {
        List<Patient> patients = patientServiceImpl.getAllPatients();
        return ResponseEntity.ok(ApiResponse.success("Patients list", patients));
    }

    @GetMapping("/get-patient-persoanl-data/{patientCnp}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ApiResponse> getPatient(@PathVariable String patientCnp){
        Patient patient = patientServiceImpl.getPatient(patientCnp);
        PatientPersonalData patientPersonalData = patientPersonalDataService.getPatientPersonalData(patient);
        PatientPersonalDataAdminPageDto patientPersonalDataAdminPageDto = new PatientPersonalDataAdminPageDto();
        patientPersonalDataAdminPageDto.setCnp(patientCnp);
        patientPersonalDataAdminPageDto.setEmail(patient.getEmail());
        patientPersonalDataAdminPageDto.setFirstName(patient.getFirstName());
        patientPersonalDataAdminPageDto.setLastName(patient.getLastName());
        patientPersonalDataAdminPageDto.setSex(patientPersonalData.getSex());
        patientPersonalDataAdminPageDto.setAddressCountry(patientPersonalData.getAddressCountry());
        patientPersonalDataAdminPageDto.setAddressNumber(patientPersonalData.getAddressNumber());
        patientPersonalDataAdminPageDto.setAddressStreet(patientPersonalData.getAddressStreet());
        patientPersonalDataAdminPageDto.setPhoneNumber(patientPersonalData.getPhoneNumber());
        patientPersonalDataAdminPageDto.setAddressRegion(patientPersonalData.getAddressRegion());
        return ResponseEntity.ok(ApiResponse.success("", patientPersonalDataAdminPageDto));
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
    @PutMapping("/change-radiologist-to-patient/{cnp}")
    public ResponseEntity<ApiResponse> ChangeUserRole(@PathVariable String cnp){
        System.out.print(cnp);
        patientServiceImpl.changeRadiologistToPatient(cnp);
        return ResponseEntity.ok(ApiResponse.success("Edit done", null));
    }

    @GetMapping("get-kids/{cnpParent}")
    public ResponseEntity<ApiResponse> getKids(@PathVariable String cnpParent){

        List<Patient> kids = patientServiceImpl.getKids(cnpParent);
        return ResponseEntity.ok(ApiResponse.success("getting kids", kids));
    }

    @PutMapping("change/kid-to-patient/{cnpKid}/{emailKid}")
    @PreAuthorize("hasAnyAuthority('PATIENT')")
    public ResponseEntity<ApiResponse>changeKidToPatient(@PathVariable String cnpKid, @PathVariable String emailKid){
        patientServiceImpl.changeKidToPatient(cnpKid, emailKid);
        return ResponseEntity.ok(ApiResponse.success("Kid Account migrated successfully",null));
    }
}
