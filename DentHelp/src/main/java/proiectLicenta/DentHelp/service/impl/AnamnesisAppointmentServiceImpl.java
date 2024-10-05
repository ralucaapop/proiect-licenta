package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proiectLicenta.DentHelp.dto.AnamnesisAppointmentDto;
import proiectLicenta.DentHelp.model.AnamnesisAppointment;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.repository.AnamnesisAppointmentRepository;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.service.AnamnesisAppointmentService;

import java.util.Optional;

@Service
public class AnamnesisAppointmentServiceImpl implements AnamnesisAppointmentService {
    private final AnamnesisAppointmentRepository anamnesisAppointmentRepository;
    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AnamnesisAppointmentServiceImpl(AnamnesisAppointmentRepository anamnesisAppointmentRepository, AppointmentRepository appointmentRepository) {
        this.anamnesisAppointmentRepository = anamnesisAppointmentRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public AnamnesisAppointment saveAnamneseAppointment(AnamnesisAppointmentDto anamnesisAppointmentDto) {
        AnamnesisAppointment anamnesisAppointment = new AnamnesisAppointment();
        anamnesisAppointment.setAppointmentReason(anamnesisAppointmentDto.getAppointmentReason());
        anamnesisAppointment.setPregnancy(anamnesisAppointmentDto.getPregnancy());
        anamnesisAppointment.setCurrentSymptoms(anamnesisAppointmentDto.getCurrentSymptoms());
        anamnesisAppointment.setRecentMedication(anamnesisAppointmentDto.getRecentMedication());
        anamnesisAppointment.setCurrentMedication(anamnesisAppointmentDto.getCurrentMedication());

        Optional<Appointment> optionalAppointment = appointmentRepository.getAppointmentByAppointmentId(anamnesisAppointmentDto.getAppointmentId());
        Appointment appointment;
        if(optionalAppointment.isPresent())
        {
            appointment = optionalAppointment.get();
        }
        else // this case should not be reached
            appointment = new Appointment();
        anamnesisAppointment.setAppointment(appointment);
        return anamnesisAppointmentRepository.save(anamnesisAppointment);
    }

    @Override
    public Optional<AnamnesisAppointment> getAnamnesisAppointment(Long appointmentId) {
        return anamnesisAppointmentRepository.findByAppointment_AppointmentId(appointmentId);

    }
}
