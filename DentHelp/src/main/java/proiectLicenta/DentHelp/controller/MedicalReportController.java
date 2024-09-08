package proiectLicenta.DentHelp.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.MedicalReportDto;
import proiectLicenta.DentHelp.service.MedicalReportService;
import proiectLicenta.DentHelp.utils.ApiResponse;

@RestController
@CrossOrigin
@RequestMapping(path="/api/admin/patients/medical-record")
public class MedicalReportController {

    private final MedicalReportService medicalReportService;

    @Autowired
    public MedicalReportController(MedicalReportService medicalReportService) {
        this.medicalReportService = medicalReportService;
    }

    @PostMapping("/new-medical-record")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ApiResponse>addMedicalReport(@RequestBody MedicalReportDto medicalReportDto)
    {
        medicalReportService.addNewMedicalReport(medicalReportDto);
        return ResponseEntity.ok(ApiResponse.success("Medical Report successfully added", null));
    }
}
