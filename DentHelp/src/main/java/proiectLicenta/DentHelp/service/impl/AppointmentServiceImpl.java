package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.AppointmentDto;
import proiectLicenta.DentHelp.dto.ModifyAppointmentDto;
import proiectLicenta.DentHelp.dto.PatientCnpDto;
import proiectLicenta.DentHelp.exceptions.ResourceNotFoundException;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.service.AppointmentService;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentServiceImpl implements AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    @Autowired
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;

    }

    @Override
    public Appointment saveAppointment(AppointmentDto appointmentDto) {
        Appointment appointment = new Appointment();
        appointment.setAppointmentReason(appointmentDto.getAppointmentReason());

        Optional<Patient> optionalPatient  = patientRepository.getPatientByCNP(appointmentDto.getPatientCnp());
        Patient patient;
        if(optionalPatient.isPresent())
        {
            patient = optionalPatient.get();
        }
        else{
            patient= new Patient();
        }
        appointment.setPatient(patient);
        appointment.setEndDateHour(appointmentDto.getHour());
        appointment.setStartDateHour(appointmentDto.getDate());

        return appointmentRepository.save(appointment);
    }

    @Override
    public void modifyAppointment(@RequestBody ModifyAppointmentDto modifyAppointmentDto, Long appointmentId) {
        Optional<Appointment> optionalAppointment = appointmentRepository.getAppointmentByAppointmentId(appointmentId);
        Appointment appointment;
        if(optionalAppointment.isPresent())
        {
            appointment = optionalAppointment.get();
            appointment.setStartDateHour(modifyAppointmentDto.getDate());
            appointment.setEndDateHour(modifyAppointmentDto.getHour());
            appointment.setAppointmentReason(modifyAppointmentDto.getAppointmentReason());
            appointmentRepository.save(appointment);
        }
        else{
            throw new ResourceNotFoundException("Appointment not found in appointments with id: " + appointmentId);
        }
    }

    public void deleteAppointment(@PathVariable Long idAppointment){
        Optional<Appointment> optionalAppointment = appointmentRepository.getAppointmentByAppointmentId(idAppointment);

        Appointment appointment;
        if(optionalAppointment.isPresent()){
            appointment= optionalAppointment.get();
            appointmentRepository.delete(appointment);
        }
        else{
            throw new ResourceNotFoundException("Appointment not found");
        }
    }

    @Override
    public List<Appointment> getAppointments() {
        return appointmentRepository.findAll();
    }


}
