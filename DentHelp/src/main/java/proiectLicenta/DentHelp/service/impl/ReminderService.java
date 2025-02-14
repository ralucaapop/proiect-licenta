package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.service.impl.EmailService;

import java.time.LocalDateTime;
import java.util.List;
import java.time.format.DateTimeFormatter;

@Service
public class ReminderService {

    private final AppointmentRepository appointmentRepository; // Repo pentru programări
    private final EmailService emailService; // Serviciu pentru trimitere email


    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public static LocalDateTime parseStringToLocalDateTime(String dateString) {
        return LocalDateTime.parse(dateString, formatter);
    }

    @Autowired
    public ReminderService(AppointmentRepository appointmentRepository, EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 34 16 * * *" , zone = "Europe/Bucharest")
    public void sendReminders() {
        LocalDateTime targetTime = LocalDateTime.now().plusDays(1);
        List<Appointment> appointments = appointmentRepository.findAll();
        for (Appointment appointment : appointments) {
            System.out.print(appointment.getAppointmentId());
            LocalDateTime appointmentDate = parseStringToLocalDateTime(appointment.getStartDateHour());
            if(appointmentDate.isEqual(targetTime) || appointmentDate.isBefore(targetTime))
                emailService.sendReminderEmail(appointment.getPatient().getEmail(), appointment);
        }
    }
}
