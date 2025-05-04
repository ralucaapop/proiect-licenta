package proiectLicenta.DentHelp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import proiectLicenta.DentHelp.dto.ConfirmAppointmentDto;
import proiectLicenta.DentHelp.dto.RejectAppointmentDto;
import proiectLicenta.DentHelp.model.AppointmentRequest;
import proiectLicenta.DentHelp.service.ConfirmAppointmentService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ConfirmAppointmentControllerTest {

    @Mock
    private ConfirmAppointmentService confirmAppointmentService;

    @InjectMocks
    private ConfirmAppointmentController confirmAppointmentController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAppointmentsRequest() {
        // Arrange
        AppointmentRequest mockRequest = new AppointmentRequest();
        List<AppointmentRequest> mockList = Arrays.asList(mockRequest);
        when(confirmAppointmentService.getAppointmentsRequest()).thenReturn(mockList);

        // Act
        ResponseEntity<ApiResponse> response = confirmAppointmentController.getAppointmentsRequest();

        // Assert
        verify(confirmAppointmentService).getAppointmentsRequest();
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Get Appointments successfully", response.getBody().getMessage());
        assertEquals(mockList, response.getBody().getData());
    }

    @Test
    void testSaveAppointment() {
        // Arrange
        ConfirmAppointmentDto dto = new ConfirmAppointmentDto();

        // Act
        ResponseEntity<ApiResponse> response = confirmAppointmentController.saveAppointment(dto);

        // Assert
        verify(confirmAppointmentService).saveAppointment(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Appointment saved", response.getBody().getMessage());
        assertNull(response.getBody().getData());
    }

    @Test
    void testRejectAppointment() {
        // Arrange
        RejectAppointmentDto dto = new RejectAppointmentDto();

        // Act
        ResponseEntity<ApiResponse> response = confirmAppointmentController.rejectAppointment(dto);

        // Assert
        verify(confirmAppointmentService).rejectAppointment(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("The request was rejected successfully", response.getBody().getMessage());
        assertNull(response.getBody().getData());
    }
}
