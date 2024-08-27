package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proiectLicenta.DentHelp.dto.AppointmentRequestDto;
import proiectLicenta.DentHelp.model.AppointmentRequest;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.repository.AppointmentRequestRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.service.AppointmentRequestService;

import java.util.Optional;

@Service
public class AppointmentRequestServiceImpl implements AppointmentRequestService {

    private final AppointmentRequestRepository appointmentRequestRepository;
    private final PatientRepository patientRepository;

    @Autowired
    public AppointmentRequestServiceImpl(AppointmentRequestRepository appointmentRequestRepository, PatientRepository patientRepository) {
        this.appointmentRequestRepository = appointmentRequestRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    public AppointmentRequest saveAppointmentRequest(AppointmentRequestDto appointmentRequestDto) {
        AppointmentRequest appointmentRequest = new AppointmentRequest();
        appointmentRequest.setAppointmentReason(appointmentRequestDto.getAppointmentReason());
        appointmentRequest.setDesiredAppointmentTime(appointmentRequestDto.getDesiredAppointmentTime());

        Patient patient;
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(appointmentRequestDto.getCnp());
        if (optionalPatient.isPresent()) {
             patient = optionalPatient.get();
        }
        else{ //this case should never be reached
            patient = new Patient();
        }
        appointmentRequest.setPatient(patient);

        return appointmentRequestRepository.save(appointmentRequest);
    }
}
