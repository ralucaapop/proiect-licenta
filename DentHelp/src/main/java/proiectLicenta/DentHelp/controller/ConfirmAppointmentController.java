package proiectLicenta.DentHelp.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.ConfirmAppointmentDto;
import proiectLicenta.DentHelp.dto.RejectAppointmentDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.AppointmentRequest;
import proiectLicenta.DentHelp.service.ConfirmAppointmentService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.List;

@RestController
@RequestMapping(path = "api/admin/confirm-appointments")
public class ConfirmAppointmentController {

    private final ConfirmAppointmentService confirmAppointmentService;

    @Autowired
    public ConfirmAppointmentController(ConfirmAppointmentService confirmAppointmentService) {
        this.confirmAppointmentService = confirmAppointmentService;
    }

    @GetMapping("/get-appointments-request")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ApiResponse> getAppointmentsRequest(){
        List<AppointmentRequest> appointmentRequestList = confirmAppointmentService.getAppointmentsRequest();
        return ResponseEntity.ok(ApiResponse.success("Get Appointments successfully", appointmentRequestList));
    }

    @PostMapping("/save-appointments")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ApiResponse> saveAppointment(@RequestBody ConfirmAppointmentDto confirmAppointmentDto){
        confirmAppointmentService.saveAppointment(confirmAppointmentDto);
        return ResponseEntity.ok(ApiResponse.success("Appointment saved", null));
    }

    @PostMapping("/rejectAppointment")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ApiResponse>rejectAppointment(@RequestBody RejectAppointmentDto rejectAppointmentDto){
        confirmAppointmentService.rejectAppointment(rejectAppointmentDto);
        return ResponseEntity.ok(ApiResponse.success("The request was rejected successfully",null));
    }
}
