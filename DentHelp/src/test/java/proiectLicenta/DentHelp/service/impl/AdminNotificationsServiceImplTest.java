package proiectLicenta.DentHelp.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proiectLicenta.DentHelp.dto.AdminNotificationsDto;
import proiectLicenta.DentHelp.model.Notification;
import proiectLicenta.DentHelp.model.NotificationStatus;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.model.AdminNotifications;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.NotificationStatus;
import proiectLicenta.DentHelp.repository.AdminNotificationsRepository;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.service.impl.AdminNotificationsServiceImpl;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminNotificationsServiceImplTest {

    private AppointmentRepository appointmentRepository;
    private AdminNotificationsRepository adminNotificationsRepository;
    private AdminNotificationsServiceImpl service;

    @BeforeEach
    void setUp() {
        appointmentRepository = mock(AppointmentRepository.class);
        adminNotificationsRepository = mock(AdminNotificationsRepository.class);
        service = new AdminNotificationsServiceImpl(appointmentRepository, adminNotificationsRepository);
    }

    // 1. Test addCancelAppointmentNotification - success
    @Test
    void testAddCancelAppointmentNotification_Success() {
        Long appointmentId = 1L;
        Appointment appointment = new Appointment();
        AdminNotificationsDto dto = new AdminNotificationsDto();
        dto.setObservations("Pacientul a anulat");
        dto.setDate(String.valueOf(LocalDateTime.now()));
        dto.setPatientCnp("1234567890123");

        when(appointmentRepository.getAppointmentByAppointmentId(appointmentId))
                .thenReturn(Optional.of(appointment));

        service.addCancelAppointmentNotification(appointmentId, dto);

        verify(adminNotificationsRepository).save(any(AdminNotifications.class));
        verify(appointmentRepository).delete(appointment);
    }

    // 2. Test addCancelAppointmentNotification - appointment not found
    @Test
    void testAddCancelAppointmentNotification_AppointmentNotFound() {
        when(appointmentRepository.getAppointmentByAppointmentId(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> {
            service.addCancelAppointmentNotification(1L, new AdminNotificationsDto());
        });

        verify(adminNotificationsRepository, never()).save(any());
        verify(appointmentRepository, never()).delete(any());
    }

    // 3. Test addLateAppointmentNotification - success
    @Test
    void testAddLateAppointmentNotification_Success() {
        Long appointmentId = 2L;
        Appointment appointment = new Appointment();
        AdminNotificationsDto dto = new AdminNotificationsDto();
        dto.setObservations("Întârziere");
        dto.setDate(String.valueOf(LocalDateTime.now()));
        dto.setPatientCnp("1234567890123");

        when(appointmentRepository.getAppointmentByAppointmentId(appointmentId))
                .thenReturn(Optional.of(appointment));

        service.addLateAppointmentNotification(appointmentId, dto);

        verify(adminNotificationsRepository).save(any(AdminNotifications.class));
        verify(appointmentRepository, never()).delete(any());
    }

    // 4. Test addLateAppointmentNotification - appointment not found
    @Test
    void testAddLateAppointmentNotification_AppointmentNotFound() {
        when(appointmentRepository.getAppointmentByAppointmentId(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> {
            service.addLateAppointmentNotification(1L, new AdminNotificationsDto());
        });

        verify(adminNotificationsRepository, never()).save(any());
    }

    // 5. Test deleteNotification - success
    @Test
    void testDeleteNotification_Success() {
        Long notificationId = 1L;
        AdminNotifications notification = new AdminNotifications();

        when(adminNotificationsRepository.findAdminNotificationsByNotificationId(notificationId))
                .thenReturn(Optional.of(notification));

        service.deleteNotification(notificationId);

        verify(adminNotificationsRepository).delete(notification);
    }

    // 6. Test deleteNotification - not found
    @Test
    void testDeleteNotification_NotFound() {
        when(adminNotificationsRepository.findAdminNotificationsByNotificationId(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> {
            service.deleteNotification(1L);
        });

        verify(adminNotificationsRepository, never()).delete(any());
    }

    // 7. Test getAllNotifications
    @Test
    void testGetAllNotifications() {
        List<AdminNotifications> list = Arrays.asList(new AdminNotifications(), new AdminNotifications());

        when(adminNotificationsRepository.findAll()).thenReturn(list);

        List<AdminNotifications> result = service.getAllNotifications();

        assertEquals(2, result.size());
        verify(adminNotificationsRepository).findAll();
    }

    // 8. Test markAsSeenNotification - from NEW to SEEN
    @Test
    void testMarkAsSeenNotification_FromNewToSeen() {
        AdminNotifications notification = new AdminNotifications();
        notification.setNotificationStatus(NotificationStatus.NEW);

        when(adminNotificationsRepository.findAdminNotificationsByNotificationId(1L))
                .thenReturn(Optional.of(notification));

        service.markAsSeenNotification(1L);

        assertEquals(NotificationStatus.SEEN, notification.getNotificationStatus());
        verify(adminNotificationsRepository).save(notification);
    }

    // 9. Test markAsSeenNotification - from SEEN to NEW
    @Test
    void testMarkAsSeenNotification_FromSeenToNew() {
        AdminNotifications notification = new AdminNotifications();
        notification.setNotificationStatus(NotificationStatus.SEEN);

        when(adminNotificationsRepository.findAdminNotificationsByNotificationId(1L))
                .thenReturn(Optional.of(notification));

        service.markAsSeenNotification(1L);

        assertEquals(NotificationStatus.NEW, notification.getNotificationStatus());
        verify(adminNotificationsRepository).save(notification);
    }

    // 10. Test markAsSeenNotification - not found
    @Test
    void testMarkAsSeenNotification_NotFound() {
        when(adminNotificationsRepository.findAdminNotificationsByNotificationId(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> {
            service.markAsSeenNotification(1L);
        });

        verify(adminNotificationsRepository, never()).save(any());
    }
}
