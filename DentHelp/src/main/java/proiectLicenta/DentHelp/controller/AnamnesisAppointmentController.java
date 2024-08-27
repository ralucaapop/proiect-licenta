package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.AnamnesisAppointmentDto;
import proiectLicenta.DentHelp.service.AnamnesisAppointmentService;
import proiectLicenta.DentHelp.utils.ApiResponse;

@RestController
@CrossOrigin
@RequestMapping(path ="/api/in/appointment")
public class AnamnesisAppointmentController {

    private final AnamnesisAppointmentService anamnesisAppointmentService;

    @Autowired
    public AnamnesisAppointmentController(AnamnesisAppointmentService anamnesisAppointmentService) {
        this.anamnesisAppointmentService = anamnesisAppointmentService;
    }

    @PostMapping("/appointmentAnamnesis")
    public ResponseEntity<ApiResponse> saveAppointmentAnamnesis(@RequestBody AnamnesisAppointmentDto anamnesisAppointmentDto)
    {
        anamnesisAppointmentService.saveAnamneseAppointment(anamnesisAppointmentDto);
        return ResponseEntity.ok(ApiResponse.success("Appointment anamnesis saved with success", null));
    }
}
