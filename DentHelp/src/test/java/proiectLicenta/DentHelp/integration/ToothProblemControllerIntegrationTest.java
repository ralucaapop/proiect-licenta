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
import proiectLicenta.DentHelp.dto.ToothProblemDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.UserRole;
import proiectLicenta.DentHelp.repository.PatientRepository;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class ToothProblemControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private PatientRepository patientRepository;

    private final String testCnp = "1998888888888";

    @BeforeEach
    public void setup() {
        if (!patientRepository.getPatientByCNP(testCnp).isPresent()) {
            Patient patient = new Patient();
            patient.setCNP(testCnp);
            patient.setFirstName("Ana");
            patient.setLastName("Ionescu");
            patient.setEmail("ana.ionescu@test.com");
            patient.setPassword("encoded_password");
            patient.setUserRole(UserRole.PATIENT);
            patientRepository.save(patient);
        }
    }

    @Test
    public void testGetPatientToothProblems_ShouldReturnEmptyArray() throws Exception {
        mockMvc.perform(get("/api/in/teeth/problems/get_patient_tooth_problems/" + testCnp + "/11"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Interventions extracted successfully"))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    public void testGetPatientAllToothProblems_ShouldReturnEmptyArray() throws Exception {
        mockMvc.perform(get("/api/in/teeth/problems/get_patient_all_tooth_problems/" + testCnp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Interventions extracted successfully"))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @WithMockUser(authorities = {"ADMIN"})
    public void testAddNewProblem_ShouldSucceed() throws Exception {
        ToothProblemDto dto = new ToothProblemDto();
        dto.setPatientCnp(testCnp);
        dto.setToothNumber(11);
        dto.setProblemDetails("Durere severă");
        dto.setDateProblem(String.valueOf(LocalDate.now()));

        mockMvc.perform(post("/api/in/teeth/problems/addNewProblem")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("New Problem added successfully"));
    }

}
