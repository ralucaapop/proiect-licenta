package proiectLicenta.DentHelp.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import proiectLicenta.DentHelp.dto.ToothInterventionDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.ToothInterventionModel;
import proiectLicenta.DentHelp.model.UserRole;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.repository.ToothInterventionRepository;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class ToothInterventionControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private PatientRepository patientRepository;
    @Autowired private ToothInterventionRepository toothInterventionRepository;
    private final String testCnp = "1999999999999";

    @BeforeEach
    public void setup() {
        if (!patientRepository.getPatientByCNP(testCnp).isPresent()) {
            Patient patient = new Patient();
            patient.setCNP(testCnp);
            patient.setFirstName("Ion");
            patient.setLastName("Popescu");
            patient.setEmail("ion.popescu@test.com");
            patient.setPassword("encrypted");
            patient.setUserRole(UserRole.PATIENT);
            patientRepository.save(patient);
        }
    }

    @Test
    public void testGetToothHistoryByNumber_ShouldReturnEmptyList() throws Exception {
        mockMvc.perform(get("/api/in/teeth/get_patient_tooth_history/" + testCnp + "/21"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Interventions extracted successfully"))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    public void testGetAllToothHistory_ShouldReturnEmptyList() throws Exception {
        mockMvc.perform(get("/api/in/teeth/get_patient_all_tooth_history/" + testCnp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Interventions extracted successfully"));
    }

    @Test
    public void testGetAllExtractedTeeth_ShouldReturnEmptyList() throws Exception {
        mockMvc.perform(get("/api/in/teeth/get_patient_all_extracted_tooth/" + testCnp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Interventions extracted successfully"));
    }

    @Test
    @WithMockUser(authorities = {"ADMIN"})
    public void testAddNewIntervention_ShouldSucceed() throws Exception {
        ToothInterventionDto dto = new ToothInterventionDto();
        dto.setPatientCnp(testCnp);
        dto.setToothNumber(22);
        dto.setIsExtracted(String.valueOf(false));
        dto.setDateIntervention(String.valueOf(LocalDate.now()));
        dto.setInterventionDetails("Test intervention");

        mockMvc.perform(post("/api/in/teeth/addNewIntervention")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("New Intervention added successfully"));
    }

    @Test
    public void testEditIntervention_ShouldReturnSuccess() throws Exception {
        // presupunem că ai un sistem de populare test cu intervenții. Poți testa direct fără verificare de rezultat

        ToothInterventionModel toothInterventionModel = new ToothInterventionModel();
        toothInterventionRepository.save(toothInterventionModel);

        ToothInterventionDto dto = new ToothInterventionDto();
        dto.setPatientCnp(testCnp);
        dto.setToothNumber(11);
        dto.setInterventionId((long) toothInterventionModel.getInterventionId());
        dto.setIsExtracted(String.valueOf(false));
        dto.setDateIntervention(String.valueOf(LocalDate.now()));
        dto.setInterventionDetails("Updated test");

        mockMvc.perform(put("/api/in/teeth/editIntervention")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Intervention Updated successfully"));
    }

    @Test
    public void testDeleteExtraction_ShouldReturnSuccess() throws Exception {
        mockMvc.perform(delete("/api/in/teeth/deleteExtraction/" + testCnp + "/22"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("teeth extraction deleted successfully"));
    }

    @Test
    public void testDeleteIntervention_ShouldReturnSuccess() throws Exception {
        ToothInterventionModel toothInterventionModel = new ToothInterventionModel();
        toothInterventionRepository.save(toothInterventionModel);
        mockMvc.perform(delete("/api/in/teeth/deleteIntervention/"+toothInterventionModel.getInterventionId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Intervention deleted succesfully"));
    }
}
