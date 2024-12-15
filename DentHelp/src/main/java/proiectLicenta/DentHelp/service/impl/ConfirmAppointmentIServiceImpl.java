package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.controller.AppointmentController;
import proiectLicenta.DentHelp.dto.ConfirmAppointmentDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.AppointmentRequest;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.repository.AppointmentRequestRepository;
import proiectLicenta.DentHelp.repository.ConfirmAppointmentsRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.service.ConfirmAppointmentService;

import java.util.List;
import java.util.Optional;

@Service
public class ConfirmAppointmentIServiceImpl implements ConfirmAppointmentService {

   private final ConfirmAppointmentsRepository confirmAppointmentsRepository;
   private final AppointmentRepository appointmentRepository;
   private final PatientRepository patientRepository;
   private final AppointmentRequestRepository appointmentRequestRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("$(spring.mail.username)")
    private String fromMsg;

    public ConfirmAppointmentIServiceImpl(ConfirmAppointmentsRepository confirmAppointmentsRepository, AppointmentController appointmentController, AppointmentServiceImpl appointmentServiceImpl, AppointmentRepository appointmentRepository, PatientRepository patientRepository, AppointmentRequestRepository appointmentRequestRepository) {
        this.confirmAppointmentsRepository = confirmAppointmentsRepository;
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.appointmentRequestRepository = appointmentRequestRepository;
    }

    @Override
    public List<AppointmentRequest> getAppointmentsRequest() {
        return confirmAppointmentsRepository.findAll();
    }

    @Override
    public void saveAppointment(@RequestBody ConfirmAppointmentDto confirmAppointmentDto) {

        Optional<Patient> optionalPatient = patientRepository.getPatientByCNP(confirmAppointmentDto.getCnpPatient());
        Patient patient;

        Optional<AppointmentRequest> optionalAppointmentRequest = appointmentRequestRepository.getAppointmentRequestByAppointmentRequestId(confirmAppointmentDto.getAppointmentRequestId());
        AppointmentRequest appointmentRequest;

        if(optionalPatient.isPresent() && optionalAppointmentRequest.isPresent())
        {
            patient = optionalPatient.get();
            appointmentRequest = optionalAppointmentRequest.get();

            Appointment appointment = new Appointment();
            appointment.setAppointmentReason(confirmAppointmentDto.getAppointmentReason());
            appointment.setStartDateHour(confirmAppointmentDto.getStartDateHour());
            appointment.setEndDateHour(confirmAppointmentDto.getEndDateHour());
            appointment.setPatient(patient);

            appointmentRepository.save(appointment);
            appointmentRequestRepository.delete(appointmentRequest);
            sendEmail(patient.getEmail(), confirmAppointmentDto.getStartDateHour());
        }
    }

    private void sendEmail(String email, String text) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromMsg);
        message.setTo(email);
        message.setSubject("Confirmare programare");
        message.setText("Buna ziua, multumuim pentru ca ati ales clinica noastra! Va informam cu cerea dumneavoasta a fost vizualizata de catre medic, iar programarea va avea loc in data" + text);
        mailSender.send(message);
    }

}
