package proiectLicenta.DentHelp.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import proiectLicenta.DentHelp.dto.GeneralAnamnesisDto;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class GeneralAnamnesisControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private final String cnpTest = "1234567890123";

    @Test
    @WithMockUser(authorities = {"PATIENT"})
    public void testSaveGeneralAnamnesis_ShouldReturn200() throws Exception {
        GeneralAnamnesisDto dto = new GeneralAnamnesisDto();
        dto.setCnp(cnpTest);
        dto.setAllergies("Polen");
        dto.setSmoker(String.valueOf(false));
        dto.setAlcoholConsumer(String.valueOf(false));
        dto.setPreviousDentalProblems("Carii tratate");
        dto.setMedicalIntolerance("Paracetamol");
        dto.setCoagulationProblems(String.valueOf(false));

        mockMvc.perform(post("/api/in/general-anamnesis/add-general-anamnesis-patient")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("General anamnesis saved with success"));
    }

    @Test
    public void testGetGeneralAnamnesis_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/in/general-anamnesis/get-general-anamnesis/{cnp}", cnpTest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Get general anamnesis succesfull"));
    }

    @Test
    public void testUpdateGeneralAnamnesis_ShouldReturn200() throws Exception {
        GeneralAnamnesisDto dto = new GeneralAnamnesisDto();
        dto.setCnp(cnpTest);
        dto.setAllergies("Polen si praf");
        dto.setSmoker(String.valueOf(true));
        dto.setAlcoholConsumer(String.valueOf(true));
        dto.setPreviousDentalProblems("Carii recurente");
        dto.setMedicalIntolerance("Nurofen");
        dto.setCoagulationProblems(String.valueOf(true));

        mockMvc.perform(put("/api/in/general-anamnesis/update-general-anamnesis")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("General Anamnesis updated"));
    }
}

