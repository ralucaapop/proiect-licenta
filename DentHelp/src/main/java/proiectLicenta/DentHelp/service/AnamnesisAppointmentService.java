package proiectLicenta.DentHelp.service;

import proiectLicenta.DentHelp.dto.AnamnesisAppointmentDto;
import proiectLicenta.DentHelp.model.AnamnesisAppointment;

import java.util.Optional;

public interface AnamnesisAppointmentService {

    public AnamnesisAppointment saveAnamneseAppointment(AnamnesisAppointmentDto anamnesisAppointmentDto);
    public Optional<AnamnesisAppointment> getAnamnesisAppointment(Long anamnesisAppointmentId);

}
