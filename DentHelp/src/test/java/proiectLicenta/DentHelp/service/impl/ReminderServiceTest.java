package proiectLicenta.DentHelp.service.impl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.repository.AppointmentRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.mockito.Mockito.*;

class ReminderServiceTest {

    private AppointmentRepository appointmentRepository;
    private EmailService emailService;
    private ReminderService reminderService;

    @BeforeEach
    void setUp() {
        appointmentRepository = mock(AppointmentRepository.class);
        emailService = mock(EmailService.class);
        reminderService = new ReminderService(appointmentRepository, emailService);
    }

    @Test
    void testSendReminders_EmailSentForValidAppointments() {
        LocalDateTime appointmentDate = LocalDateTime.now().plusDays(1);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        Appointment appointment = new Appointment();
        appointment.setStartDateHour(appointmentDate.format(formatter));

        Patient patient = new Patient();
        patient.setEmail("patient@example.com");
        appointment.setPatient(patient);

        when(appointmentRepository.findAll()).thenReturn(List.of(appointment));

        reminderService.sendReminders();

        verify(emailService, times(1)).sendReminderEmail("patient@example.com", appointment);
    }

    @Test
    void testSendReminders_NoEmailIfAppointmentDateTooFar() {
        LocalDateTime appointmentDate = LocalDateTime.now().plusDays(3);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        Appointment appointment = new Appointment();
        appointment.setStartDateHour(appointmentDate.format(formatter));

        Patient patient = new Patient();
        patient.setEmail("patient@example.com");
        appointment.setPatient(patient);

        when(appointmentRepository.findAll()).thenReturn(List.of(appointment));

        reminderService.sendReminders();

        verify(emailService, never()).sendReminderEmail(any(), any());
    }
}
