package proiectLicenta.DentHelp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import proiectLicenta.DentHelp.dto.PersonalDataDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.PatientPersonalData;
import proiectLicenta.DentHelp.service.PatientService;
import proiectLicenta.DentHelp.service.impl.PatientPersonalDataServiceImpl;
import proiectLicenta.DentHelp.utils.ApiResponse;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PatientInformationControllerTest {

    @Mock
    private PatientPersonalDataServiceImpl patientPersonalDataServiceImpl;

    @Mock
    private PatientService patientService;

    @InjectMocks
    private PatientInformationController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddPersonalData() {
        PersonalDataDto dto = new PersonalDataDto();

        ResponseEntity<ApiResponse> response = controller.addPersonalData(dto);

        verify(patientPersonalDataServiceImpl, times(1)).savePatientPersonalData(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Patient info saved with success", response.getBody().getMessage());
    }

    @Test
    void testUpdatePatientPersonalData() {
        PersonalDataDto dto = new PersonalDataDto();

        ResponseEntity<ApiResponse> response = controller.updatePatientPersonalData(dto);

        verify(patientPersonalDataServiceImpl, times(1)).updatePatientPersonalData(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Patient info saved with succes", response.getBody().getMessage());
    }

    @Test
    void testGetPatientPersonalData_exists() {
        String cnp = "1234567890123";
        Patient patient = new Patient();
        PatientPersonalData data = new PatientPersonalData();
        data.setIdPersonalData(1L);

        when(patientService.getPatient(cnp)).thenReturn(patient);
        when(patientPersonalDataServiceImpl.getPatientPersonalData(patient)).thenReturn(data);

        ResponseEntity<ApiResponse> response = controller.getPatientPersonalData(cnp);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Get patient personal data succesfully", response.getBody().getMessage());
        assertEquals(data, response.getBody().getData());
    }

    @Test
    void testGetPatientPersonalData_notExists() {
        String cnp = "1234567890123";
        Patient patient = new Patient();
        PatientPersonalData data = new PatientPersonalData(); // id is null

        when(patientService.getPatient(cnp)).thenReturn(patient);
        when(patientPersonalDataServiceImpl.getPatientPersonalData(patient)).thenReturn(data);

        ResponseEntity<ApiResponse> response = controller.getPatientPersonalData(cnp);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Personal data for this patient does not exist", response.getBody().getMessage());
        assertNull(response.getBody().getData());
    }
}
