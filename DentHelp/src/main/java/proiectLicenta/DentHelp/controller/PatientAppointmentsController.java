package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.AppointmentDto;
import proiectLicenta.DentHelp.dto.PatientCnpDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.service.PatientAppointmentService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path="api/patient/appointments")
@CrossOrigin

public class PatientAppointmentsController {

    private final PatientAppointmentService patientAppointmentService;


    @Autowired
    public PatientAppointmentsController(PatientAppointmentService patientAppointmentService) {
        this.patientAppointmentService = patientAppointmentService;
    }

    @PostMapping("/get-patient-appointments")
    public ResponseEntity<ApiResponse> getPatientAppointments(@RequestBody PatientCnpDto patientCnpDto){
        List<Appointment> appointments = patientAppointmentService.getPatientAppointments(patientCnpDto);
        List<AppointmentDto> appointmentDtos = new ArrayList<>();
        for (Appointment appointment : appointments) {
            AppointmentDto dto = new AppointmentDto();
            dto.setPatientCnp(appointment.getPatient().getCNP());
            dto.setAppointmentReason(appointment.getAppointmentReason());
            dto.setDate(appointment.getStartDateHour());
            dto.setHour(appointment.getEndDateHour());
            dto.setAppointmentId(appointment.getAppointmentId());

            appointmentDtos.add(dto);
        }
        return ResponseEntity.ok(ApiResponse.success("Appointments list", appointmentDtos));
    }

}
