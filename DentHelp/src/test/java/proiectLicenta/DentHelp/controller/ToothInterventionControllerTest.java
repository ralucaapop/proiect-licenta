package proiectLicenta.DentHelp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import proiectLicenta.DentHelp.dto.ToothInterventionDto;
import proiectLicenta.DentHelp.service.impl.ToothInterventionServiceImpl;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ToothInterventionControllerTest {

    @Mock
    private ToothInterventionServiceImpl toothInterventionService;

    @InjectMocks
    private ToothInterventionController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetPatientToothHistory() {
        String cnp = "1234567890123";
        int toothNumber = 12;
        ToothInterventionDto dto = new ToothInterventionDto();
        when(toothInterventionService.getAllPatientToothIntervention(cnp, toothNumber))
                .thenReturn(Collections.singletonList(dto));

        ResponseEntity<ApiResponse> response = controller.getPatientToothHistory(cnp, toothNumber);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Interventions extracted successfully", response.getBody().getMessage());
        List<ToothInterventionDto> data = (List<ToothInterventionDto>) response.getBody().getData();
        assertEquals(1, data.size());
    }

    @Test
    void testGetPatientAllToothHistory() {
        String cnp = "1234567890123";
        when(toothInterventionService.getAllPatientTootInterventions(cnp))
                .thenReturn(Collections.singletonList(new ToothInterventionDto()));

        ResponseEntity<ApiResponse> response = controller.getPatientAllToothHistory(cnp);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Interventions extracted successfully", response.getBody().getMessage());
    }

    @Test
    void testGetPatientAllExtractedTooth() {
        String cnp = "1234567890123";
        when(toothInterventionService.getPatientAllExtractedTooth(cnp))
                .thenReturn(Collections.singletonList(new ToothInterventionDto()));

        ResponseEntity<ApiResponse> response = controller.getPatientAllExtractedTooth(cnp);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Interventions extracted successfully", response.getBody().getMessage());
    }

    @Test
    void testAddNewIntervention() {
        ToothInterventionDto dto = new ToothInterventionDto();
        dto.setIsExtracted("true");

        ResponseEntity<ApiResponse> response = controller.addNewIntervention(dto);

        verify(toothInterventionService).addNewIntervention(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("New Intervention added successfully", response.getBody().getMessage());
    }

    @Test
    void testDeleteIntervention() {
        Long id = 1L;

        ResponseEntity<ApiResponse> response = controller.deleteIntervention(id);

        verify(toothInterventionService).deleteIntervention(id);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Intervention deleted succesfully", response.getBody().getMessage());
    }

    @Test
    void testEditIntervention() {
        ToothInterventionDto dto = new ToothInterventionDto();

        ResponseEntity<ApiResponse> response = controller.editIntervention(dto);

        verify(toothInterventionService).updateIntervention(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Intervention Updated successfully", response.getBody().getMessage());
    }

    @Test
    void testDeleteExtraction() {
        String cnp = "1234567890123";
        int toothNumber = 15;

        ResponseEntity<ApiResponse> response = controller.deleteExtraction(cnp, toothNumber);

        verify(toothInterventionService).deleteTeethExtraction(cnp, toothNumber);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("teeth extraction deleted successfully", response.getBody().getMessage());
    }
}
