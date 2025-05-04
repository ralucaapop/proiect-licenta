package proiectLicenta.DentHelp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import proiectLicenta.DentHelp.dto.AppointmentDto;
import proiectLicenta.DentHelp.dto.PatientCnpDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.service.PatientAppointmentService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PatientAppointmentsControllerTest {

    @Mock
    private PatientAppointmentService patientAppointmentService;

    @InjectMocks
    private PatientAppointmentsController patientAppointmentsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetPatientAppointments_ReturnsList() {
        // Arrange
        PatientCnpDto dto = new PatientCnpDto();
        dto.setPatientCnp("1234567890123");

        Patient patient = new Patient();
        patient.setCNP("1234567890123");

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setAppointmentId(1L);
        appointment.setAppointmentReason("Consult");
        appointment.setStartDateHour(String.valueOf(LocalDateTime.of(2025, 5, 5, 10, 0)));
        appointment.setEndDateHour(String.valueOf(LocalDateTime.of(2025, 5, 5, 11, 0)));

        when(patientAppointmentService.getPatientAppointments(dto)).thenReturn(Arrays.asList(appointment));

        // Act
        ResponseEntity<ApiResponse> response = patientAppointmentsController.getPatientAppointments(dto);

        // Assert
        verify(patientAppointmentService).getPatientAppointments(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Appointments list", response.getBody().getMessage());

        List<AppointmentDto> data = (List<AppointmentDto>) response.getBody().getData();
        assertEquals(1, data.size());
        assertEquals("Consult", data.get(0).getAppointmentReason());
        assertEquals("1234567890123", data.get(0).getPatientCnp());
    }

    @Test
    void testGetPatientAppointments_ReturnsEmptyList() {
        // Arrange
        PatientCnpDto dto = new PatientCnpDto();
        dto.setPatientCnp("0000000000000");

        when(patientAppointmentService.getPatientAppointments(dto)).thenReturn(Collections.emptyList());

        // Act
        ResponseEntity<ApiResponse> response = patientAppointmentsController.getPatientAppointments(dto);

        // Assert
        verify(patientAppointmentService).getPatientAppointments(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Appointments list", response.getBody().getMessage());

        List<AppointmentDto> data = (List<AppointmentDto>) response.getBody().getData();
        assertTrue(data.isEmpty());
    }
}
