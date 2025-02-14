package proiectLicenta.DentHelp.controller;


import org.hibernate.engine.transaction.jta.platform.internal.SynchronizationRegistryBasedSynchronizationStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.ToothInterventionDto;
import proiectLicenta.DentHelp.service.ToothInterventionService;
import proiectLicenta.DentHelp.service.impl.ToothInterventionServiceImpl;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(path = "api/in/teeth")
public class ToothInterventionController {

    private final ToothInterventionServiceImpl toothInterventionService;

    @Autowired
    public ToothInterventionController(ToothInterventionServiceImpl toothInterventionService) {
        this.toothInterventionService = toothInterventionService;
    }


    @GetMapping("get_patient_tooth_history/{cnp}/{toothNumber}")
    public ResponseEntity<ApiResponse> getPatientToothHistory(@PathVariable String cnp, @PathVariable int toothNumber){
        List<ToothInterventionDto> toothInterventionDtoList = toothInterventionService.getAllPatientToothIntervention(cnp, toothNumber);
        return ResponseEntity.ok(ApiResponse.success("Interventions extracted successfully", toothInterventionDtoList));
    }

    @GetMapping("get_patient_all_tooth_history/{cnp}")
    public ResponseEntity<ApiResponse> getPatientAllToothHistory(@PathVariable String cnp){
        List<ToothInterventionDto> toothInterventionDtoList = toothInterventionService.getAllPatientTootInterventions(cnp);
        return ResponseEntity.ok(ApiResponse.success("Interventions extracted successfully", toothInterventionDtoList));
    }

    @GetMapping("get_patient_all_extracted_tooth/{cnp}")
    public ResponseEntity<ApiResponse> getPatientAllExtractedTooth(@PathVariable String cnp){
        List<ToothInterventionDto> toothInterventionDtoList = toothInterventionService.getPatientAllExtractedTooth(cnp);
        return ResponseEntity.ok(ApiResponse.success("Interventions extracted successfully", toothInterventionDtoList));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PostMapping("/addNewIntervention")
    public ResponseEntity<ApiResponse> addNewIntervention(@RequestBody ToothInterventionDto toothInterventionDto){
        System.out.print(toothInterventionDto.getIsExtracted());
        toothInterventionService.addNewIntervention(toothInterventionDto);
        return ResponseEntity.ok(ApiResponse.success("New Intervention added successfully", null));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @DeleteMapping("/deleteIntervention/{interventionId}")
    public ResponseEntity<ApiResponse> deleteIntervention(@PathVariable Long interventionId){
        toothInterventionService.deleteIntervention(interventionId);
        return ResponseEntity.ok(ApiResponse.success("Intervention deleted succesfully", null));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PutMapping("/editIntervention")
    public ResponseEntity<ApiResponse> editIntervention(@RequestBody ToothInterventionDto toothInterventionDto){
        toothInterventionService.updateIntervention(toothInterventionDto);
        return ResponseEntity.ok(ApiResponse.success("Intervention Updated successfully", null));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @DeleteMapping("/deleteExtraction/{cnp}/{toothNumber}")
    public ResponseEntity<ApiResponse> deleteExtraction(@PathVariable String cnp, @PathVariable int toothNumber){
        toothInterventionService.deleteTeethExtraction(cnp, toothNumber);
        return ResponseEntity.ok(ApiResponse.success("teeth extraction deleted successfully", null));
    }

}
