package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proiectLicenta.DentHelp.dto.AppointmentRequestDto;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.model.AppointmentRequest;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.repository.AppointmentRequestRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.service.AppointmentRequestService;

import java.util.List;
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
        appointmentRequest.setRequestDate(appointmentRequestDto.getRequestDate());

        Patient patient;
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(appointmentRequestDto.getCnp());
        if (optionalPatient.isPresent()) {
             patient = optionalPatient.get();
        }
        else{ //this case should never be reached
            patient = new Patient();
        }
        appointmentRequest.setPatient(patient);
        List<AppointmentRequest> appointmentRequestList = appointmentRequestRepository.getAllByPatient(patient);
        if(appointmentRequestList.isEmpty())
            return appointmentRequestRepository.save(appointmentRequest);
        else throw new BadRequestException("Nu puteți avea mai multe solicitări în același timp");
    }

    @Override
    public List<AppointmentRequest> getPatientAppointmentService(String cnpPatient) {
        Patient patient;
        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(cnpPatient);
        if (optionalPatient.isPresent()) {
            patient = optionalPatient.get();
            List<AppointmentRequest> appointmentRequestList = appointmentRequestRepository.getAllByPatient(patient);
            return appointmentRequestList;
        }
        throw new BadRequestException("Nu există un cont cu acest cnp");
    }

    @Override
    public void deleteAppointmentRequest(Long idRequest) {
        Optional<AppointmentRequest> appointmentRequestOptional = appointmentRequestRepository.getAppointmentRequestByAppointmentRequestId(idRequest);
        AppointmentRequest appointmentRequest;
        if(appointmentRequestOptional.isPresent()){
            appointmentRequest = appointmentRequestOptional.get();
            appointmentRequestRepository.delete(appointmentRequest);
        }
        else{
            throw new BadRequestException("There is no request with this id");
        }
    }

    @Override
    public void updateAppointmentRequest(Long idRequest, AppointmentRequestDto appointmentRequestDto) {
        Optional<AppointmentRequest> appointmentRequestOptional = appointmentRequestRepository.getAppointmentRequestByAppointmentRequestId(idRequest);
        AppointmentRequest appointmentRequest;
        if(appointmentRequestOptional.isPresent()){
            appointmentRequest = appointmentRequestOptional.get();
            appointmentRequest.setRequestDate(appointmentRequestDto.getRequestDate());
            appointmentRequest.setAppointmentReason(appointmentRequestDto.getAppointmentReason());
            appointmentRequest.setDesiredAppointmentTime(appointmentRequestDto.getDesiredAppointmentTime());
            appointmentRequestRepository.save(appointmentRequest);
        }
        else{
            throw new BadRequestException("There is no request with this id");
        }
    }
}
