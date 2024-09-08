package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.AppointmentDto;
import proiectLicenta.DentHelp.dto.ModifyAppointmentDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.service.AppointmentService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.List;

@RestController
@RequestMapping(path = "api/admin/appointment")
@CrossOrigin
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/make-appointment")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ApiResponse> saveAppointment(@RequestBody AppointmentDto appointmentDto){
        appointmentService.saveAppointment(appointmentDto);
        return ResponseEntity.ok(ApiResponse.success("Appointment saved successfully", null));
    }

    @GetMapping("/get-appointments")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ApiResponse> getAppointments(){
        List<Appointment> appointments = appointmentService.getAppointments();
        return ResponseEntity.ok(ApiResponse.success("Appointments list", appointments));
    }

    @PutMapping("/modify-appointment/{appointmet_id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ApiResponse>modifyAppointment(@RequestBody ModifyAppointmentDto modifyAppointmentDto, @PathVariable Long appointmet_id)
    {
        appointmentService.modifyAppointment(modifyAppointmentDto, appointmet_id);
        return ResponseEntity.ok(ApiResponse.success("Appointment modified successfully", null));
    }

    @DeleteMapping("/delete-appointment/{appointment_id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ApiResponse>deleteAppointment(@PathVariable Long appointment_id)
    {
        appointmentService.deleteAppointment(appointment_id);
        return ResponseEntity.ok(ApiResponse.success("Appointment deleted", null));
    }
 }
