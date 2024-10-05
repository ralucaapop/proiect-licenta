package proiectLicenta.DentHelp.service;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.AppointmentDto;
import proiectLicenta.DentHelp.dto.ModifyAppointmentDto;
import proiectLicenta.DentHelp.dto.PatientCnpDto;
import proiectLicenta.DentHelp.model.Appointment;

import java.util.List;

@Service
public interface AppointmentService {

    public Appointment saveAppointment(AppointmentDto appointmentDto);
    public void modifyAppointment(@RequestBody ModifyAppointmentDto modifyAppointmentDto, Long appointmentId);

    void deleteAppointment(@PathVariable Long appointmentId);

    public List<Appointment> getAppointments();
}
