package proiectLicenta.DentHelp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import proiectLicenta.DentHelp.dto.AdminNotificationsDto;
import proiectLicenta.DentHelp.model.AdminNotifications;
import proiectLicenta.DentHelp.service.AdminNotificationsService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminNotificationsControllerTest {

    @Mock
    private AdminNotificationsService adminNotificationsService;

    @InjectMocks
    private AdminNotificationsController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddLateAppointmentAdminNotification() {
        Long appointmentId = 1L;
        AdminNotificationsDto dto = new AdminNotificationsDto();

        ResponseEntity<ApiResponse> response = controller.addLateAppointmentAdminNotification(appointmentId, dto);

        verify(adminNotificationsService, times(1)).addLateAppointmentNotification(appointmentId, dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Late Appointment Notification added successfully", response.getBody().getMessage());
    }

    @Test
    void testAddCancelAppointmentAdminNotification() {
        Long appointmentId = 2L;
        AdminNotificationsDto dto = new AdminNotificationsDto();

        ResponseEntity<ApiResponse> response = controller.addCancelAppointmentAdminNotification(appointmentId, dto);

        verify(adminNotificationsService, times(1)).addCancelAppointmentNotification(appointmentId, dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Cancel Appointment Notification added successfully", response.getBody().getMessage());
    }

    @Test
    void testMarkNotificationAsRead() {
        Long notificationId = 3L;

        ResponseEntity<ApiResponse> response = controller.markNotificationAsRead(notificationId);

        verify(adminNotificationsService, times(1)).markAsSeenNotification(notificationId);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Mark notification as Read added successfully", response.getBody().getMessage());
    }

    @Test
    void testDeleteNotification() {
        Long notificationId = 4L;

        ResponseEntity<ApiResponse> response = controller.deleteNotification(notificationId);

        verify(adminNotificationsService, times(1)).deleteNotification(notificationId);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Notification deleted successfully", response.getBody().getMessage());
    }

    @Test
    void testGetAllNotification() {
        List<AdminNotifications> mockList = new ArrayList<>();
        when(adminNotificationsService.getAllNotifications()).thenReturn(mockList);

        ResponseEntity<ApiResponse> response = controller.getAllNotification();

        verify(adminNotificationsService, times(1)).getAllNotifications();
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Successfully getting all the notifications ", response.getBody().getMessage());
        assertEquals(mockList, response.getBody().getData());
    }
}
