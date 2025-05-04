package proiectLicenta.DentHelp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import proiectLicenta.DentHelp.dto.GeneralAnamnesisDto;
import proiectLicenta.DentHelp.model.GeneralAnamnesis;
import proiectLicenta.DentHelp.service.GeneralAnamnesisService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GeneralAnamnesisControllerTest {

    @Mock
    private GeneralAnamnesisService generalAnamnesisService;

    @InjectMocks
    private GeneralAnamnesisController generalAnamnesisController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveGeneralAnamnesis() {
        // Arrange
        GeneralAnamnesisDto dto = new GeneralAnamnesisDto();

        // Act
        ResponseEntity<ApiResponse> response = generalAnamnesisController.saveGeneralAnamnesis(dto);

        // Assert
        verify(generalAnamnesisService).saveGeneralAnamnesis(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("General anamnesis saved with success", response.getBody().getMessage());
        assertNull(response.getBody().getData());
    }

    @Test
    void testGetGeneralAnamnesis_WhenExists() {
        // Arrange
        String cnp = "1234567890123";
        GeneralAnamnesis anamnesis = new GeneralAnamnesis();
        anamnesis.setIdGeneralAnamnesis(1L);
        anamnesis.setAllergies("Pollen");
        when(generalAnamnesisService.getPatientGeneralAnamnesis(cnp)).thenReturn(anamnesis);

        // Act
        ResponseEntity<ApiResponse> response = generalAnamnesisController.getGeneralAnamnesis(cnp);

        // Assert
        verify(generalAnamnesisService).getPatientGeneralAnamnesis(cnp);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Get general anamnesis succesfull", response.getBody().getMessage());
        assertNotNull(response.getBody().getData());
    }

    @Test
    void testGetGeneralAnamnesis_WhenDoesNotExist() {
        // Arrange
        String cnp = "1234567890123";
        GeneralAnamnesis anamnesis = new GeneralAnamnesis(); // no ID set
        when(generalAnamnesisService.getPatientGeneralAnamnesis(cnp)).thenReturn(anamnesis);

        // Act
        ResponseEntity<ApiResponse> response = generalAnamnesisController.getGeneralAnamnesis(cnp);

        // Assert
        verify(generalAnamnesisService).getPatientGeneralAnamnesis(cnp);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("No genereal anamnesis", response.getBody().getMessage());
        assertNull(response.getBody().getData());
    }

    @Test
    void testUpdateGeneralAnamnesis() {
        // Arrange
        GeneralAnamnesisDto dto = new GeneralAnamnesisDto();

        // Act
        ResponseEntity<ApiResponse> response = generalAnamnesisController.updateGeneralAnamnesis(dto);

        // Assert
        verify(generalAnamnesisService).updateGeneralAnamnesis(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("General Anamnesis updated", response.getBody().getMessage());
        assertNull(response.getBody().getData());
    }
}
