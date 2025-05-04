package proiectLicenta.DentHelp.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import proiectLicenta.DentHelp.dto.AdminNotificationsDto;
import proiectLicenta.DentHelp.model.AdminNotifications;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.Notification;
import proiectLicenta.DentHelp.model.NotificationStatus;
import proiectLicenta.DentHelp.repository.AdminNotificationsRepository;
import proiectLicenta.DentHelp.repository.AppointmentRepository;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Rollback
@Transactional
@AutoConfigureMockMvc(addFilters = false)
public class AdminNotificationsControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AdminNotificationsRepository adminNotificationsRepository;

    @Test
    @WithMockUser(authorities = "PATIENT")
    void testAddCancelAppointmentNotification() throws Exception {
        Appointment appointment = new Appointment();
        appointmentRepository.save(appointment);

        AdminNotificationsDto dto = new AdminNotificationsDto();
        dto.setDate(String.valueOf(LocalDate.now()));
        dto.setObservations("Pacientul a anulat");
        dto.setPatientCnp("1234567890123");

        mockMvc.perform(post("/api/in/notifications/admin/send_notification/cancel_appointment/"+appointment.getAppointmentId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Cancel Appointment Notification added successfully"));
    }

    @Test
    @WithMockUser(authorities = "PATIENT")
    void testAddLateAppointmentNotification() throws Exception {
        Appointment appointment = new Appointment();
        appointmentRepository.save(appointment);

        AdminNotificationsDto dto = new AdminNotificationsDto();
        dto.setDate(String.valueOf(LocalDate.now()));
        dto.setObservations("Întârziere semnificativă");
        dto.setPatientCnp("1234567890123");

        mockMvc.perform(post("/api/in/notifications/admin/send_notification/late_appointment/"+appointment.getAppointmentId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Late Appointment Notification added successfully"));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void testMarkNotificationAsRead() throws Exception {
        AdminNotifications notification = new AdminNotifications();
        notification.setAppointmentId(10L);
        notification.setNotificationStatus(NotificationStatus.NEW);
        notification.setNotificationType(Notification.LATE_APPOINTMENT);
        notification.setDate(String.valueOf(LocalDate.now()));
        notification.setObservations("Test mark as read");
        notification.setPatientCnp("1234567890123");
        AdminNotifications saved = adminNotificationsRepository.save(notification);

        mockMvc.perform(put("/api/in/notifications/admin/read_notification/" + saved.getNotificationId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Mark notification as Read added successfully"));

        AdminNotifications updated = adminNotificationsRepository.findById(saved.getNotificationId()).get();
        assertThat(updated.getNotificationStatus()).isEqualTo(NotificationStatus.SEEN);
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void testDeleteNotification() throws Exception {
        AdminNotifications notification = new AdminNotifications();
        notification.setAppointmentId(20L);
        notification.setNotificationStatus(NotificationStatus.NEW);
        notification.setNotificationType(Notification.CANCEL_APPOINTMENT);
        notification.setDate(String.valueOf(LocalDate.now()));
        notification.setObservations("Test delete");
        notification.setPatientCnp("9876543210987");
        AdminNotifications saved = adminNotificationsRepository.save(notification);

        mockMvc.perform(delete("/api/in/notifications/admin/delete_notification/" + saved.getNotificationId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Notification deleted successfully"));

        boolean exists = adminNotificationsRepository.findById(saved.getNotificationId()).isPresent();
        assertThat(exists).isFalse();
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void testGetAllNotifications() throws Exception {
        mockMvc.perform(get("/api/in/notifications/admin/get_notifications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Successfully getting all the notifications "));
    }
}
