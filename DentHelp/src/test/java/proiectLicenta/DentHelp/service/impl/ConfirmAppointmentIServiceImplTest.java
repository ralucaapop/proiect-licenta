package proiectLicenta.DentHelp.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import proiectLicenta.DentHelp.dto.ConfirmAppointmentDto;
import proiectLicenta.DentHelp.dto.RejectAppointmentDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.AppointmentRequest;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.repository.AppointmentRequestRepository;
import proiectLicenta.DentHelp.repository.ConfirmAppointmentsRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.service.impl.ConfirmAppointmentIServiceImpl;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ConfirmAppointmentServiceImplTest {

    private ConfirmAppointmentsRepository confirmAppointmentsRepository;
    private AppointmentRepository appointmentRepository;
    private AppointmentRequestRepository appointmentRequestRepository;
    private PatientRepository patientRepository;
    private JavaMailSender mailSender;

    private ConfirmAppointmentIServiceImpl service;

    @BeforeEach
    void setUp() {
        confirmAppointmentsRepository = mock(ConfirmAppointmentsRepository.class);
        appointmentRepository = mock(AppointmentRepository.class);
        appointmentRequestRepository = mock(AppointmentRequestRepository.class);
        patientRepository = mock(PatientRepository.class);
        mailSender = mock(JavaMailSender.class);

        service = new ConfirmAppointmentIServiceImpl(
                confirmAppointmentsRepository,
                null, null, // appointmentController, appointmentServiceImpl - nefolosite
                appointmentRepository,
                patientRepository,
                appointmentRequestRepository
        );

        service.mailSender = mailSender;
    }

    @Test
    void testGetAppointmentsRequest() {
        List<AppointmentRequest> mockRequests = List.of(new AppointmentRequest());
        when(confirmAppointmentsRepository.findAll()).thenReturn(mockRequests);

        List<AppointmentRequest> result = service.getAppointmentsRequest();

        assertEquals(1, result.size());
        verify(confirmAppointmentsRepository).findAll();
    }

    @Test
    void testSaveAppointment_Success() {
        ConfirmAppointmentDto dto = new ConfirmAppointmentDto();
        dto.setCnpPatient("123");
        dto.setAppointmentRequestId(1L);
        dto.setAppointmentReason("Control");
        dto.setStartDateHour("10:00");
        dto.setEndDateHour("10:30");

        Patient patient = new Patient();
        patient.setEmail("test@domain.com");

        AppointmentRequest appointmentRequest = new AppointmentRequest();

        when(patientRepository.getPatientByCNP("123")).thenReturn(Optional.of(patient));
        when(appointmentRequestRepository.getAppointmentRequestByAppointmentRequestId(1L))
                .thenReturn(Optional.of(appointmentRequest));

        service.saveAppointment(dto);

        verify(appointmentRepository).save(any(Appointment.class));
        verify(appointmentRequestRepository).delete(appointmentRequest);
        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void testSaveAppointment_Failure_NoPatientOrRequest() {
        ConfirmAppointmentDto dto = new ConfirmAppointmentDto();
        dto.setCnpPatient("000");
        dto.setAppointmentRequestId(5L);

        when(patientRepository.getPatientByCNP("000")).thenReturn(Optional.empty());
        when(appointmentRequestRepository.getAppointmentRequestByAppointmentRequestId(5L)).thenReturn(Optional.empty());

        // Nu se întâmplă nimic, nici o excepție, dar niciun mail trimis
        service.saveAppointment(dto);

        verifyNoInteractions(appointmentRepository);
    }

    @Test
    void testRejectAppointment_Success() {
        RejectAppointmentDto dto = new RejectAppointmentDto();
        dto.setPatientCNP("999");
        dto.setAppointmentRequestId(77L);
        dto.setMessage("în alt interval");

        Patient patient = new Patient();
        patient.setEmail("reject@test.com");

        AppointmentRequest request = new AppointmentRequest();

        when(patientRepository.getPatientByCNP("999")).thenReturn(Optional.of(patient));
        when(appointmentRequestRepository.getAppointmentRequestByAppointmentRequestId(77L))
                .thenReturn(Optional.of(request));

        service.rejectAppointment(dto);

        verify(appointmentRequestRepository).delete(request);
        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void testRejectAppointment_Failure_NoPatientOrRequest() {
        RejectAppointmentDto dto = new RejectAppointmentDto();
        dto.setPatientCNP("404");
        dto.setAppointmentRequestId(999L);

        when(patientRepository.getPatientByCNP("404")).thenReturn(Optional.empty());
        when(appointmentRequestRepository.getAppointmentRequestByAppointmentRequestId(999L)).thenReturn(Optional.empty());

        service.rejectAppointment(dto);

        verify(appointmentRequestRepository, never()).delete(any());
    }
}
