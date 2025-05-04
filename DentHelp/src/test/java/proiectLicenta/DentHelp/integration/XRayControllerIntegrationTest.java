package proiectLicenta.DentHelp.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import proiectLicenta.DentHelp.dto.XRayDto;
import proiectLicenta.DentHelp.model.XRay;
import proiectLicenta.DentHelp.repository.XRayRepository;
import proiectLicenta.DentHelp.service.XRayService;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class XRayControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private XRayRepository xRayRepository;
    @Autowired private XRayService xRayService;

    private Long xRayId;

    @BeforeEach
    public void setup() {
        // Adăugăm un X-Ray pentru testare
        XRay xRay = new XRay();
        xRay.setObservations("Test observation");
        xRay.setDate("2025-04-23");
        xRayRepository.save(xRay);
        xRayId = xRay.getXrayId();
    }

    @Test
    public void testGetPatientXrays_ShouldReturnXrayList() throws Exception {
        mockMvc.perform(get("/api/patient/xray/get-patient-xrays/{patientCnp}", "1234567890123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(1));  // Presupunem că există un X-ray pentru pacientul respectiv
    }


    @Test
    public void testUpdateXray_ShouldUpdateXrayWithoutFile() throws Exception {
        mockMvc.perform(put("/api/patient/xray/update-xray/{xrayId}", xRayId)
                        .param("observations", "Updated observation"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("xray successfully updated"));
    }
}
