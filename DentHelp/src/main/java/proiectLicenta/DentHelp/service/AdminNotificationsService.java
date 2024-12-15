package proiectLicenta.DentHelp.service;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.AdminNotificationsDto;
import proiectLicenta.DentHelp.model.AdminNotifications;

import java.util.List;

@Service
public interface AdminNotificationsService {

    public void addCancelAppointmentNotification(@PathVariable Long appointmentId, @RequestBody AdminNotificationsDto adminNotifications);
    public void addLateAppointmentNotification(@PathVariable Long appointmentId, @RequestBody AdminNotificationsDto adminNotifications);

    public void markAsSeenNotification(Long notificationId);

    public void deleteNotification(Long notificationId);

    public List<AdminNotifications> getAllNotifications();

}
