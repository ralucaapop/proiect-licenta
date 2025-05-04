package proiectLicenta.DentHelp.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;
import proiectLicenta.DentHelp.dto.XRayDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.XRay;
import proiectLicenta.DentHelp.repository.XRayRepository;
import proiectLicenta.DentHelp.service.PatientService;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class XRayServiceImplTest {

    @Mock
    private PatientService patientService;

    @Mock
    private XRayRepository xRayRepository;

    @Mock
    private AzureBlobStorageService azureBlobStorageService;

    @InjectMocks
    private XRayServiceImpl xRayService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetPatientXrays() {
        String patientCnp = "1234567890123";
        Patient patient = new Patient();
        XRay xRay1 = new XRay();
        XRay xRay2 = new XRay();

        // Mocking external service
        when(patientService.getPatient(patientCnp)).thenReturn(patient);
        when(xRayRepository.getXRayByPatient(patient)).thenReturn(List.of(Optional.of(xRay1), Optional.of(xRay2)));

        // Calling the method under test
        List<XRay> xrays = xRayService.getPatientXrays(patientCnp);

        // Assertions
        assertNotNull(xrays);
        assertEquals(2, xrays.size());
    }

    @Test
    void testSaveXRay() throws IOException {
        XRayDto xRayDto = new XRayDto();
        xRayDto.setCnpPatient("1234567890123");
        xRayDto.setDate("2025-04-22");
        xRayDto.setObservations("Observations");

        MultipartFile file = mock(MultipartFile.class);
        String filePath = "path/to/file";

        Patient patient = new Patient();
        when(patientService.getPatient(xRayDto.getCnpPatient())).thenReturn(patient);
        when(azureBlobStorageService.uploadFile(file)).thenReturn(filePath);

        XRay xRay = new XRay();
        xRay.setDate(xRayDto.getDate());
        xRay.setPatient(patient);
        xRay.setFilePath(filePath);
        xRay.setObservations(xRayDto.getObservations());

        when(xRayRepository.save(any(XRay.class))).thenReturn(xRay);

        XRay savedXRay = xRayService.saveXRay(xRayDto, file);

        assertNotNull(savedXRay);
        assertEquals(xRayDto.getDate(), savedXRay.getDate());
        assertEquals(filePath, savedXRay.getFilePath());
        assertEquals(xRayDto.getObservations(), savedXRay.getObservations());
    }
    @Test
    void testUpdateXRay_NotFound() throws IOException {
        XRayDto xRayDto = new XRayDto();
        xRayDto.setObservations("Updated Observations");

        Long xrayId = 1L;

        when(xRayRepository.getXRayByXrayId(xrayId)).thenReturn(Optional.empty());

        XRay updatedXRay = xRayService.updateXRay(xRayDto, xrayId);

        assertNull(updatedXRay);
    }
}