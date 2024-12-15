package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.TreatmentSheetDto;
import proiectLicenta.DentHelp.model.TreatmentSheet;

import proiectLicenta.DentHelp.service.TreatmentSheetService;
import proiectLicenta.DentHelp.utils.ApiResponse;

@RestController
@CrossOrigin
@RequestMapping(path ="/api/in/treatment-sheet")
public class TreatmentSheetController {

    private final TreatmentSheetService treatmentSheetService;

    public TreatmentSheetController(TreatmentSheetService treatmentSheetService) {
        this.treatmentSheetService = treatmentSheetService;
    }


    @GetMapping("/get-treatment-sheet/{appointmentId}")
    public ResponseEntity<ApiResponse> getTreatmentSheet(@PathVariable Long appointmentId){
        TreatmentSheet treatmentSheet = treatmentSheetService.getTreatmentSheet(appointmentId);
        if(treatmentSheet!=null)
        {
            TreatmentSheetDto treatmentSheetDto = new TreatmentSheetDto();
            treatmentSheetDto.setMedication(treatmentSheet.getMedication());
            treatmentSheetDto.setRecommendations(treatmentSheet.getRecommendations());
            treatmentSheetDto.setAppointmentObservations(treatmentSheet.getAppointmentObservations());
            treatmentSheetDto.setAppointmentId(treatmentSheet.getAppointment().getAppointmentId());
            return ResponseEntity.ok(ApiResponse.success("Get treatment sheet",treatmentSheetDto));
        }
        return ResponseEntity.ok(ApiResponse.success("There is no treatment sheet for this appointment",null));
    }

    @PostMapping("/save-treatment-sheet")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ApiResponse> saveTreatmentSheet(@RequestBody TreatmentSheetDto treatmentSheetDto){
        int response = treatmentSheetService.saveTreatmentSheet(treatmentSheetDto);
        if(response == 0)
            return ResponseEntity.ok(ApiResponse.success("The treatment sheet was saved", null));
        return ResponseEntity.ok(ApiResponse.success("There already exist a treatment sheet for this appointment", null));
    }

    @PutMapping("/update-sheet-treatment")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ApiResponse> updateTreatmentSheet(@RequestBody TreatmentSheetDto treatmentSheetDto){
        treatmentSheetService.updateTreatmentSheet(treatmentSheetDto);
        return ResponseEntity.ok(ApiResponse.success("treatment sheet updated successfully", null));
    }




}
