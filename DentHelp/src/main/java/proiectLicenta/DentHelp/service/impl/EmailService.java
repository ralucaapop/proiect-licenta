package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import proiectLicenta.DentHelp.model.Appointment;


@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    @Value("$(spring.mail.username)")
    private String fromMsg;

    public void sendReminderEmail(String recipientEmail, Appointment appointment) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromMsg);
            message.setTo(recipientEmail);
            message.setSubject("Reminder: Programare la dentist");
            message.setText("Bună ziua,\n\nAceasta este o reamintire că aveți o programare la data de "
                    + appointment.getStartDateHour() + ".\n\nVă mulțumim!");

            mailSender.send(message);

    }
}
