package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.AppointmentRequestDto;
import proiectLicenta.DentHelp.service.AppointmentRequestService;
import proiectLicenta.DentHelp.utils.ApiResponse;

@CrossOrigin
@RestController
@RequestMapping(path ="/api/in/appointment_request")
public class AppointmentRequestController {
    private final AppointmentRequestService appointmentRequestService;

    @Autowired
    public AppointmentRequestController(AppointmentRequestService appointmentRequestService) {
        this.appointmentRequestService = appointmentRequestService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> saveAppointmentRequest (@RequestBody AppointmentRequestDto appointmentRequestDto){
        appointmentRequestService.saveAppointmentRequest(appointmentRequestDto);
        return ResponseEntity.ok(ApiResponse.success("Appointment request saved with success", null));
    }
}
