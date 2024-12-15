package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.AppointmentRequestDto;
import proiectLicenta.DentHelp.model.AppointmentRequest;
import proiectLicenta.DentHelp.service.AppointmentRequestService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping(path ="/api/in/appointment_request")
public class AppointmentRequestController {
    private final AppointmentRequestService appointmentRequestService;

    @Autowired
    public AppointmentRequestController(AppointmentRequestService appointmentRequestService) {
        this.appointmentRequestService = appointmentRequestService;
    }

    @PostMapping("/add_appointment_request")
    @PreAuthorize("hasAnyAuthority('PATIENT')")
    public ResponseEntity<ApiResponse> saveAppointmentRequest (@RequestBody AppointmentRequestDto appointmentRequestDto){
        appointmentRequestService.saveAppointmentRequest(appointmentRequestDto);
        return ResponseEntity.ok(ApiResponse.success("Appointment request saved with success", null));
    }

    @GetMapping("/get_patient_requests/{patientCnp}")
    @PreAuthorize("hasAnyAuthority('PATIENT')")
    public ResponseEntity<ApiResponse> getPatientAppointmentRequests(@PathVariable String patientCnp){
        List<AppointmentRequest> appointmentRequestList = appointmentRequestService.getPatientAppointmentService(patientCnp);
        List<AppointmentRequestDto> appointmentRequestListDto = new ArrayList<>();

        for(AppointmentRequest appointmentRequest: appointmentRequestList){
            AppointmentRequestDto appointmentRequestDto = new AppointmentRequestDto();
            appointmentRequestDto.setAppointmentReason(appointmentRequest.getAppointmentReason());
            appointmentRequestDto.setDesiredAppointmentTime(appointmentRequest.getDesiredAppointmentTime());
            appointmentRequestDto.setCnp(appointmentRequest.getPatient().getCNP());
            appointmentRequestDto.setAppointmentRequestId(appointmentRequest.getAppointmentRequestId());
            appointmentRequestDto.setRequestDate(appointmentRequest.getRequestDate());
            appointmentRequestListDto.add(appointmentRequestDto);
        }
        return ResponseEntity.ok(ApiResponse.success("Appointment requests get successfully", appointmentRequestListDto));
    }

    @DeleteMapping("/delete_request/{requestId}")
    @PreAuthorize("hasAnyAuthority('PATIENT')")
    public ResponseEntity<ApiResponse> deleteAppointmentRequest(@PathVariable Long requestId){
        appointmentRequestService.deleteAppointmentRequest(requestId);
        return ResponseEntity.ok(ApiResponse.success("Appointment request deleted successfully", null));
    }

    @PutMapping("/update_request/{reqursId}")
    @PreAuthorize("hasAnyAuthority('PATIENT')")
    public ResponseEntity<ApiResponse> updateAppointmentRequest(@PathVariable Long reqursId, @RequestBody AppointmentRequestDto appointmentRequestDto){
        appointmentRequestService.updateAppointmentRequest(reqursId, appointmentRequestDto);
        return ResponseEntity.ok(ApiResponse.success("Appointment request successfully updated", null));
    }
}
