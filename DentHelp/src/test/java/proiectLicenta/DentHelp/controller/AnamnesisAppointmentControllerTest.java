package proiectLicenta.DentHelp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import proiectLicenta.DentHelp.dto.AnamnesisAppointmentDto;
import proiectLicenta.DentHelp.model.AnamnesisAppointment;
import proiectLicenta.DentHelp.service.AnamnesisAppointmentService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AnamnesisAppointmentControllerTest {

    @Mock
    private AnamnesisAppointmentService anamnesisAppointmentService;

    @InjectMocks
    private AnamnesisAppointmentController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveAppointmentAnamnesis() {
        AnamnesisAppointmentDto dto = new AnamnesisAppointmentDto();

        ResponseEntity<ApiResponse> response = controller.saveAppointmentAnamnesis(dto);

        verify(anamnesisAppointmentService, times(1)).saveAnamneseAppointment(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Appointment anamnesis saved with success", response.getBody().getMessage());
        assertNull(response.getBody().getData());
    }

    @Test
    void testGetAppointmentAnamnesis_whenExists() {
        Long appointmentId = 1L;
        AnamnesisAppointment appointment = new AnamnesisAppointment();
        appointment.setAnamneseAppointmentId(appointmentId);
        appointment.setAppointmentReason("Durere dentară");
        appointment.setPregnancy("Nu");
        appointment.setRecentMedication("Ibuprofen");
        appointment.setCurrentSymptoms("Durere pulsantă");
        appointment.setCurrentMedication("Paracetamol");

        when(anamnesisAppointmentService.getAnamnesisAppointment(appointmentId))
                .thenReturn(Optional.of(appointment));

        ResponseEntity<ApiResponse> response = controller.getAppointmentAnamnesis(appointmentId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("AppointmentAnamnesis", response.getBody().getMessage());

        AnamnesisAppointmentDto dto = (AnamnesisAppointmentDto) response.getBody().getData();
        assertNotNull(dto);
        assertEquals("Durere dentară", dto.getAppointmentReason());
        assertEquals("Nu", dto.getPregnancy());
        assertEquals("Ibuprofen", dto.getRecentMedication());
        assertEquals("Durere pulsantă", dto.getCurrentSymptoms());
        assertEquals("Paracetamol", dto.getCurrentMedication());
        assertEquals(appointmentId, dto.getAppointmentId());
    }

    @Test
    void testGetAppointmentAnamnesis_whenNotExists() {
        Long appointmentId = 999L;

        when(anamnesisAppointmentService.getAnamnesisAppointment(appointmentId))
                .thenReturn(Optional.empty());

        ResponseEntity<ApiResponse> response = controller.getAppointmentAnamnesis(appointmentId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("AppointmentAnamnesis", response.getBody().getMessage());
        assertNull(response.getBody().getData());
    }
}
