package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proiectLicenta.DentHelp.model.AdminNotifications;

import java.util.Optional;

@Repository
public interface AdminNotificationsRepository extends JpaRepository<AdminNotifications, Long> {

    Optional<AdminNotifications> findAdminNotificationsByNotificationId(Long notificationId);
}
