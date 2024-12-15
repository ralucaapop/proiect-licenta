package proiectLicenta.DentHelp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name="admin_notifications")
public class AdminNotifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    private Long appointmentId;

    private String observations;

    private String date;

    private String patientCnp;

    @Enumerated(EnumType.STRING)
    Notification notificationType;

    @Enumerated(EnumType.STRING)
    NotificationStatus notificationStatus;
}
