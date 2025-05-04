package proiectLicenta.DentHelp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import proiectLicenta.DentHelp.dto.TreatmentSheetDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.TreatmentSheet;
import proiectLicenta.DentHelp.service.TreatmentSheetService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TreatmentSheetControllerTest {

    @Mock
    private TreatmentSheetService treatmentSheetService;

    @InjectMocks
    private TreatmentSheetController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetTreatmentSheet_WhenExists() {
        Long appointmentId = 1L;
        TreatmentSheet treatmentSheet = new TreatmentSheet();
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(appointmentId);
        treatmentSheet.setAppointment(appointment);
        treatmentSheet.setMedication("Ibuprofen");
        treatmentSheet.setRecommendations("Rest");
        treatmentSheet.setAppointmentObservations("No swelling");

        when(treatmentSheetService.getTreatmentSheet(appointmentId)).thenReturn(treatmentSheet);

        ResponseEntity<ApiResponse> response = controller.getTreatmentSheet(appointmentId);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody().getData());
        TreatmentSheetDto dto = (TreatmentSheetDto) response.getBody().getData();
        assertEquals("Ibuprofen", dto.getMedication());
        assertEquals(appointmentId, dto.getAppointmentId());
    }

    @Test
    void testGetTreatmentSheet_WhenNotExists() {
        Long appointmentId = 2L;
        when(treatmentSheetService.getTreatmentSheet(appointmentId)).thenReturn(null);

        ResponseEntity<ApiResponse> response = controller.getTreatmentSheet(appointmentId);

        assertEquals(200, response.getStatusCodeValue());
        assertNull(response.getBody().getData());
        assertEquals("There is no treatment sheet for this appointment", response.getBody().getMessage());
    }

    @Test
    void testSaveTreatmentSheet_WhenNew() {
        TreatmentSheetDto dto = new TreatmentSheetDto();
        when(treatmentSheetService.saveTreatmentSheet(dto)).thenReturn(0);

        ResponseEntity<ApiResponse> response = controller.saveTreatmentSheet(dto);

        verify(treatmentSheetService).saveTreatmentSheet(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("The treatment sheet was saved", response.getBody().getMessage());
    }

    @Test
    void testSaveTreatmentSheet_WhenAlreadyExists() {
        TreatmentSheetDto dto = new TreatmentSheetDto();
        when(treatmentSheetService.saveTreatmentSheet(dto)).thenReturn(1);

        ResponseEntity<ApiResponse> response = controller.saveTreatmentSheet(dto);

        verify(treatmentSheetService).saveTreatmentSheet(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("There already exist a treatment sheet for this appointment", response.getBody().getMessage());
    }

    @Test
    void testUpdateTreatmentSheet() {
        TreatmentSheetDto dto = new TreatmentSheetDto();

        ResponseEntity<ApiResponse> response = controller.updateTreatmentSheet(dto);

        verify(treatmentSheetService).updateTreatmentSheet(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("treatment sheet updated successfully", response.getBody().getMessage());
    }
}
