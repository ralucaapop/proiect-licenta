package proiectLicenta.DentHelp.service;

import proiectLicenta.DentHelp.dto.AppointmentRequestDto;
import proiectLicenta.DentHelp.model.AppointmentRequest;

import java.util.List;

public interface AppointmentRequestService {
    public AppointmentRequest saveAppointmentRequest(AppointmentRequestDto appointmentRequestDto);
    public List<AppointmentRequest> getPatientAppointmentService(String cnpPatient);
    public void deleteAppointmentRequest(Long idRequest);
    public void updateAppointmentRequest(Long idRequest, AppointmentRequestDto appointmentRequestDto);
}
