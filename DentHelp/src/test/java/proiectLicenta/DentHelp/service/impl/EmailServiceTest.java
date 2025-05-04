package proiectLicenta.DentHelp.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import proiectLicenta.DentHelp.model.Appointment;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class EmailServiceTest {

    private EmailService emailService;
    private JavaMailSender mailSender;

    @BeforeEach
    void setUp() {
        mailSender = mock(JavaMailSender.class);
        emailService = new EmailService(mailSender);

        // injectăm fromMsg manual (dacă e nevoie în test, alternativ, fă-l constructor param)
        try {
            var field = EmailService.class.getDeclaredField("fromMsg");
            field.setAccessible(true);
            field.set(emailService, "clinic@example.com");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testSendReminderEmail() {
        Appointment appointment = new Appointment();
        appointment.setStartDateHour("2025-05-01 15:00");

        emailService.sendReminderEmail("pacient@example.com", appointment);

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());

        SimpleMailMessage message = captor.getValue();
        assertEquals("pacient@example.com", message.getTo()[0]);
        assertEquals("Reminder: Programare la dentist", message.getSubject());
        assertEquals("clinic@example.com", message.getFrom());
        assert message.getText().contains("2025-05-01");
    }
}
