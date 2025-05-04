package proiectLicenta.DentHelp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import proiectLicenta.DentHelp.dto.PatientDto;
import proiectLicenta.DentHelp.dto.PatientPersonalDataAdminPageDto;
import proiectLicenta.DentHelp.dto.PatientUpdateDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.PatientPersonalData;
import proiectLicenta.DentHelp.service.PatientPersonalDataService;
import proiectLicenta.DentHelp.service.impl.PatientServiceImpl;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PatientControllerTest {

    @Mock
    private PatientServiceImpl patientServiceImpl;

    @Mock
    private PatientPersonalDataService patientPersonalDataService;

    @InjectMocks
    private PatientController patientController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllPatients_ReturnsList() {
        Patient p = new Patient();
        p.setCNP("1234567890123");
        when(patientServiceImpl.getAllPatients()).thenReturn(Arrays.asList(p));

        ResponseEntity<ApiResponse> response = patientController.getAllPatients();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Patients list", response.getBody().getMessage());

        List<Patient> data = (List<Patient>) response.getBody().getData();
        assertEquals(1, data.size());
        assertEquals("1234567890123", data.get(0).getCNP());
    }

    @Test
    void testGetPatient_ReturnsPatientPersonalData() {
        String cnp = "1111111111111";
        Patient patient = new Patient();
        patient.setCNP(cnp);
        patient.setFirstName("Ana");
        patient.setLastName("Pop");

        PatientPersonalData data = new PatientPersonalData();
        data.setPhoneNumber("0712345678");
        data.setSex("F");

        when(patientServiceImpl.getPatient(cnp)).thenReturn(patient);
        when(patientPersonalDataService.getPatientPersonalData(patient)).thenReturn(data);

        ResponseEntity<ApiResponse> response = patientController.getPatient(cnp);

        assertEquals(200, response.getStatusCodeValue());
        PatientPersonalDataAdminPageDto dto = (PatientPersonalDataAdminPageDto) response.getBody().getData();
        assertEquals("Ana", dto.getFirstName());
        assertEquals("F", dto.getSex());
        assertEquals("0712345678", dto.getPhoneNumber());
    }

    @Test
    void testAddPatient_ReturnsSuccess() {
        PatientDto dto = new PatientDto();
        dto.setEmail("test@example.com");

        ResponseEntity<ApiResponse> response = patientController.addPatient(dto);

        verify(patientServiceImpl).addNewPatient(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("New patient added", response.getBody().getMessage());
    }

    @Test
    void testUpdatePatientProfileInformation() {
        String cnp = "1234567890123";
        PatientUpdateDto dto = new PatientUpdateDto();

        ResponseEntity<ApiResponse> response = patientController.updatePatientProfileInformation(cnp, dto);

        verify(patientServiceImpl).updatePatient(cnp, dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Edit done", response.getBody().getMessage());
    }

    @Test
    void testChangeUserRole_ReturnsSuccess() {
        String cnp = "1234567890123";

        ResponseEntity<ApiResponse> response = patientController.ChangeUserRole(cnp);

        verify(patientServiceImpl).changeRadiologistToPatient(cnp);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Edit done", response.getBody().getMessage());
    }

    @Test
    void testGetKids_ReturnsList() {
        String parentCnp = "1234567890123";
        Patient child = new Patient();
        child.setCNP("1111111111111");

        when(patientServiceImpl.getKids(parentCnp)).thenReturn(Collections.singletonList(child));

        ResponseEntity<ApiResponse> response = patientController.getKids(parentCnp);

        assertEquals(200, response.getStatusCodeValue());
        List<Patient> kids = (List<Patient>) response.getBody().getData();
        assertEquals(1, kids.size());
        assertEquals("1111111111111", kids.get(0).getCNP());
    }
}
