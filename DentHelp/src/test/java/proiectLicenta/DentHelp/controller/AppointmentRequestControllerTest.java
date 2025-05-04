package proiectLicenta.DentHelp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import proiectLicenta.DentHelp.dto.AppointmentRequestDto;
import proiectLicenta.DentHelp.model.AppointmentRequest;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.service.AppointmentRequestService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppointmentRequestControllerTest {

    @Mock
    private AppointmentRequestService appointmentRequestService;

    @InjectMocks
    private AppointmentRequestController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveAppointmentRequest() {
        AppointmentRequestDto dto = new AppointmentRequestDto();

        ResponseEntity<ApiResponse> response = controller.saveAppointmentRequest(dto);

        verify(appointmentRequestService, times(1)).saveAppointmentRequest(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Appointment request saved with success", response.getBody().getMessage());
        assertNull(response.getBody().getData());
    }

    @Test
    void testGetPatientAppointmentRequests() {
        String cnp = "1234567890123";
        AppointmentRequest mockRequest = new AppointmentRequest();
        mockRequest.setAppointmentRequestId(1L);
        mockRequest.setAppointmentReason("Control");
        mockRequest.setDesiredAppointmentTime(String.valueOf(LocalDateTime.of(2025, 5, 4, 10, 30)));
        mockRequest.setRequestDate(String.valueOf(LocalDateTime.of(2025, 5, 1, 9, 0)));
        Patient patient = new Patient();
        patient.setCNP(cnp);
        mockRequest.setPatient(patient);

        when(appointmentRequestService.getPatientAppointmentService(cnp))
                .thenReturn(List.of(mockRequest));

        ResponseEntity<ApiResponse> response = controller.getPatientAppointmentRequests(cnp);

        verify(appointmentRequestService, times(1)).getPatientAppointmentService(cnp);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Appointment requests get successfully", response.getBody().getMessage());

        List<AppointmentRequestDto> data = (List<AppointmentRequestDto>) response.getBody().getData();
        assertNotNull(data);
        assertEquals(1, data.size());
        AppointmentRequestDto dto = data.get(0);
        assertEquals("Control", dto.getAppointmentReason());
        assertEquals(cnp, dto.getCnp());
        assertEquals(1L, dto.getAppointmentRequestId());
    }

    @Test
    void testDeleteAppointmentRequest() {
        Long requestId = 10L;

        ResponseEntity<ApiResponse> response = controller.deleteAppointmentRequest(requestId);

        verify(appointmentRequestService, times(1)).deleteAppointmentRequest(requestId);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Appointment request deleted successfully", response.getBody().getMessage());
    }

    @Test
    void testUpdateAppointmentRequest() {
        Long requestId = 15L;
        AppointmentRequestDto dto = new AppointmentRequestDto();

        ResponseEntity<ApiResponse> response = controller.updateAppointmentRequest(requestId, dto);

        verify(appointmentRequestService, times(1)).updateAppointmentRequest(requestId, dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Appointment request successfully updated", response.getBody().getMessage());
    }
}
