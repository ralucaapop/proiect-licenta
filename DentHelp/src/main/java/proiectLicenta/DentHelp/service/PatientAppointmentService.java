package proiectLicenta.DentHelp.service;

import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.PatientCnpDto;
import proiectLicenta.DentHelp.model.Appointment;

import java.util.List;

public interface PatientAppointmentService{

    public List<Appointment> getPatientAppointments(@RequestBody PatientCnpDto patientCnpDto);
}
