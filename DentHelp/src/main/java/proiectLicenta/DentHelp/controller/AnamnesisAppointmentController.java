package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.AnamnesisAppointmentDto;
import proiectLicenta.DentHelp.dto.AppointmentAnamnesisDto;
import proiectLicenta.DentHelp.model.AnamnesisAppointment;
import proiectLicenta.DentHelp.service.AnamnesisAppointmentService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping(path ="/api/in/appointment")
public class AnamnesisAppointmentController {

    private final AnamnesisAppointmentService anamnesisAppointmentService;

    @Autowired
    public AnamnesisAppointmentController(AnamnesisAppointmentService anamnesisAppointmentService) {
        this.anamnesisAppointmentService = anamnesisAppointmentService;
    }

    @PostMapping("/saveAppointmentAnamnesis")
    public ResponseEntity<ApiResponse> saveAppointmentAnamnesis(@RequestBody AnamnesisAppointmentDto anamnesisAppointmentDto)
    {
        anamnesisAppointmentService.saveAnamneseAppointment(anamnesisAppointmentDto);
        return ResponseEntity.ok(ApiResponse.success("Appointment anamnesis saved with success", null));
    }
    @GetMapping("/getAnamnesisAppointment/{appointmentId}")
    public ResponseEntity<ApiResponse> getAppointmentAnamnesis(@PathVariable Long appointmentId){
        Optional<AnamnesisAppointment> optionalAnamnesisAppointment = anamnesisAppointmentService.getAnamnesisAppointment(appointmentId);
        AnamnesisAppointmentDto anamnesisAppointmentDto = new AnamnesisAppointmentDto();
        AnamnesisAppointment anamnesisAppointment;
        if (optionalAnamnesisAppointment.isPresent()){
            anamnesisAppointment = optionalAnamnesisAppointment.get();
            anamnesisAppointmentDto.setAppointmentReason(anamnesisAppointment.getAppointmentReason());
            anamnesisAppointmentDto.setPregnancy(anamnesisAppointment.getPregnancy());
            anamnesisAppointmentDto.setRecentMedication(anamnesisAppointment.getRecentMedication());
            anamnesisAppointmentDto.setCurrentSymptoms(anamnesisAppointment.getCurrentSymptoms());
            anamnesisAppointmentDto.setCurrentMedication(anamnesisAppointment.getCurrentMedication());
            anamnesisAppointmentDto.setAppointmentId(anamnesisAppointment.getAnamneseAppointmentId());
            return ResponseEntity.ok(ApiResponse.success("AppointmentAnamnesis", anamnesisAppointmentDto));

        }
        return ResponseEntity.ok(ApiResponse.success("AppointmentAnamnesis", null));

    }
}
