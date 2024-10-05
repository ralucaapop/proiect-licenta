package proiectLicenta.DentHelp.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.PatientCnpDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.service.PatientAppointmentService;

import java.util.List;


@Service
public class PatientAppointmentServiceImpl implements PatientAppointmentService {

    private final AppointmentRepository appointmentRepository;

    public PatientAppointmentServiceImpl(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public List<Appointment> getPatientAppointments(@RequestBody PatientCnpDto patientCnpDto){
        return appointmentRepository.getAppointmentsByPatientCNP(patientCnpDto.getPatientCnp());

    }


}
