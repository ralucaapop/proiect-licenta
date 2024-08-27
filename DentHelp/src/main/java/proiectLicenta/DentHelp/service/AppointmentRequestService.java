package proiectLicenta.DentHelp.service;

import proiectLicenta.DentHelp.dto.AppointmentRequestDto;
import proiectLicenta.DentHelp.model.AppointmentRequest;

public interface AppointmentRequestService {
    public AppointmentRequest saveAppointmentRequest(AppointmentRequestDto appointmentRequestDto);


}
