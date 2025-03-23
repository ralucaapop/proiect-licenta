package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.AdminNotificationsDto;
import proiectLicenta.DentHelp.model.AdminNotifications;
import proiectLicenta.DentHelp.service.AdminNotificationsService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.List;

@RestController("http://localhost:5173")
@CrossOrigin
@RequestMapping("/api/in/notifications/admin")
public class AdminNotificationsController {

    private final AdminNotificationsService adminNotificationsService;


    @Autowired
    public AdminNotificationsController(AdminNotificationsService adminNotificationsService) {
        this.adminNotificationsService = adminNotificationsService;
    }

    @PreAuthorize("hasAnyAuthority('PATIENT')")
    @PostMapping("/send_notification/late_appointment/{appointmentId}")
    public ResponseEntity<ApiResponse> addLateAppointmentAdminNotification(@PathVariable Long appointmentId, @RequestBody AdminNotificationsDto adminNotificationsDto){
        adminNotificationsService.addLateAppointmentNotification(appointmentId, adminNotificationsDto);
        return ResponseEntity.ok(ApiResponse.success("Late Appointment Notification added successfully", null));
    }

    @PreAuthorize("hasAnyAuthority('PATIENT')")
    @PostMapping("/send_notification/cancel_appointment/{appointmentId}")
    public ResponseEntity<ApiResponse> addCancelAppointmentAdminNotification(@PathVariable Long appointmentId, @RequestBody AdminNotificationsDto adminNotificationsDto){
        adminNotificationsService.addCancelAppointmentNotification(appointmentId, adminNotificationsDto);
        return ResponseEntity.ok(ApiResponse.success("Cancel Appointment Notification added successfully", null));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PutMapping("/read_notification/{notificationId}")
    public ResponseEntity<ApiResponse> markNotificationAsRead(@PathVariable Long notificationId){
        adminNotificationsService.markAsSeenNotification(notificationId);
        return ResponseEntity.ok(ApiResponse.success("Mark notification as Read added successfully", null));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @DeleteMapping("/delete_notification/{notificationId}")
    public ResponseEntity<ApiResponse> deleteNotification(@PathVariable Long notificationId){
        adminNotificationsService.deleteNotification(notificationId);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted successfully", null));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @GetMapping("/get_notifications")
    public ResponseEntity<ApiResponse> getAllNotification(){
        List<AdminNotifications> adminNotificationsList = adminNotificationsService.getAllNotifications();
        return ResponseEntity.ok(ApiResponse.success("Successfully getting all the notifications ", adminNotificationsList));
    }

}
