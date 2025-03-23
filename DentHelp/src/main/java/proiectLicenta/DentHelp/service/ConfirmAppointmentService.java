package proiectLicenta.DentHelp.service;

import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.ConfirmAppointmentDto;
import proiectLicenta.DentHelp.dto.RejectAppointmentDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.AppointmentRequest;

import java.util.List;

public interface ConfirmAppointmentService {

    public List<AppointmentRequest> getAppointmentsRequest();

    public void saveAppointment(@RequestBody ConfirmAppointmentDto confirmAppointmentDto);

    public void rejectAppointment(RejectAppointmentDto rejectAppointmentDto);

}
