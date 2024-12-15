package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proiectLicenta.DentHelp.dto.AdminNotificationsDto;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.model.*;
import proiectLicenta.DentHelp.repository.AdminNotificationsRepository;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.service.AdminNotificationsService;

import java.util.List;
import java.util.Optional;

@Service
public class AdminNotificationsServiceImpl implements AdminNotificationsService {
    private final AppointmentRepository appointmentRepository;
    private final AdminNotificationsRepository adminNotificationsRepository;

    public AdminNotificationsServiceImpl(AppointmentRepository appointmentRepository, AdminNotificationsRepository adminNotificationsRepository) {
        this.appointmentRepository = appointmentRepository;
        this.adminNotificationsRepository = adminNotificationsRepository;
    }

    @Override
    public void addCancelAppointmentNotification(Long appointmentId, AdminNotificationsDto adminNotificationsDto) {
        Appointment appointment;
        Optional<Appointment> optionalAppointment = appointmentRepository.getAppointmentByAppointmentId(appointmentId);
        if(optionalAppointment.isPresent()){
            appointment = optionalAppointment.get();
            AdminNotifications adminNotifications = new AdminNotifications();
            adminNotifications.setAppointmentId(appointmentId);
            adminNotifications.setObservations(adminNotificationsDto.getObservations());
            adminNotifications.setDate(adminNotificationsDto.getDate());
            adminNotifications.setNotificationType(Notification.CANCEL_APPOINTMENT);
            adminNotifications.setNotificationStatus(NotificationStatus.NEW);
            adminNotifications.setPatientCnp(adminNotificationsDto.getPatientCnp());
            adminNotificationsRepository.save(adminNotifications); //salvam o noua notificare
            appointmentRepository.delete(appointment); // si programarea respectiva o sterg
        }
        else{
            throw new BadRequestException("There is no appointment with this id");
        }
    }

    @Override
    public void addLateAppointmentNotification(Long appointmentId, AdminNotificationsDto adminNotificationsDto) {
        Appointment appointment;
        Optional<Appointment> optionalAppointment = appointmentRepository.getAppointmentByAppointmentId(appointmentId);
        if(optionalAppointment.isPresent()){
            appointment = optionalAppointment.get();
            AdminNotifications adminNotifications = new AdminNotifications();
            adminNotifications.setAppointmentId(appointmentId);
            adminNotifications.setObservations(adminNotificationsDto.getObservations());
            adminNotifications.setDate(adminNotificationsDto.getDate());
            adminNotifications.setNotificationType(Notification.LATE_APPOINTMENT);
            adminNotifications.setNotificationStatus(NotificationStatus.NEW);
            adminNotifications.setPatientCnp(adminNotificationsDto.getPatientCnp());
            adminNotificationsRepository.save(adminNotifications); //salvam o noua notificare
        }
        else{
            throw new BadRequestException("There is no appointment with this id");
        }
    }

    public void deleteNotification(Long notificationId){
        AdminNotifications adminNotifications;
        Optional<AdminNotifications> optionalAdminNotifications = adminNotificationsRepository.findAdminNotificationsByNotificationId(notificationId);
        if(optionalAdminNotifications.isPresent()){
            adminNotifications = optionalAdminNotifications.get();
            adminNotificationsRepository.delete(adminNotifications);
        }
        else{
            throw new BadRequestException("There is no notification with this id");
        }
    }

    @Override
    public List<AdminNotifications> getAllNotifications() {
        List<AdminNotifications> adminNotificationsList = adminNotificationsRepository.findAll();
        return adminNotificationsList;
    }

    public void markAsSeenNotification(Long notificationId){
        AdminNotifications adminNotifications;
        Optional<AdminNotifications> optionalAdminNotifications = adminNotificationsRepository.findAdminNotificationsByNotificationId(notificationId);
        if(optionalAdminNotifications.isPresent()){
            adminNotifications = optionalAdminNotifications.get();
            if((adminNotifications.getNotificationStatus()).equals(NotificationStatus.SEEN))
            adminNotifications.setNotificationStatus(NotificationStatus.NEW);
            else
                adminNotifications.setNotificationStatus(NotificationStatus.SEEN);

            adminNotificationsRepository.save(adminNotifications);
        }
        else{
            throw new BadRequestException("There is no notification with this id");
        }
    }
}
