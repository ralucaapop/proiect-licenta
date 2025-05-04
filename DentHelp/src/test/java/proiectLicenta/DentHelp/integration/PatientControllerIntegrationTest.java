package proiectLicenta.DentHelp.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import proiectLicenta.DentHelp.dto.PatientDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.UserRole;
import proiectLicenta.DentHelp.repository.PatientRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class PatientControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private PatientRepository patientRepository;

    private final String testCnp = "1234567890123";

    @BeforeEach
    public void setup() {
        if (!patientRepository.getPatientByCNP(testCnp).isPresent()) {
            Patient patient = new Patient();
            patient.setCNP(testCnp);
            patient.setFirstName("Ion");
            patient.setLastName("Popescu");
            patient.setEmail("ion.popescu@test.com");
            patient.setPassword("encryptedPassword");
            patient.setUserRole(UserRole.ADMIN);
            patientRepository.save(patient);
        }
    }

    @Test
    public void testGetAllPatients_ShouldReturnPatientsList() throws Exception {
        mockMvc.perform(get("/api/admin/patient/get-patients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    public void testGetPatientPersonalData_ShouldReturnPersonalData() throws Exception {
        mockMvc.perform(get("/api/admin/patient/get-patient-persoanl-data/" + testCnp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.cnp").value(testCnp));
    }

    @Test
    public void testAddPatient_ShouldSucceed() throws Exception {
        PatientDto newPatient = new PatientDto();
        newPatient.setCnp("9876543219123");
        newPatient.setEmail("new.mail@test.com");
        newPatient.setFirstName("Ana");
        newPatient.setLastName("Ionescu");
        newPatient.setPassword("password123");
        newPatient.setUserRole("PATIENT");
        newPatient.setParent(null);
        mockMvc.perform(post("/api/admin/patient/addPatient")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newPatient)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("New patient added"));
    }

    @Test
    public void testChangeRadiologistToPatient_ShouldSucceed() throws Exception {
        Patient radiologist = new Patient();
        radiologist.setCNP("0001112223334");
        radiologist.setEmail("radiologist@test.com");
        radiologist.setFirstName("Radu");
        radiologist.setLastName("Petrescu");
        radiologist.setPassword("fakepass");
        radiologist.setUserRole(UserRole.RADIOLOGIST);
        patientRepository.save(radiologist);

        mockMvc.perform(put("/api/admin/patient/change-radiologist-to-patient/" + radiologist.getCNP()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Edit done"));
    }

    @Test
    public void testGetKids_ShouldReturnKidsList() throws Exception {
        // Crează copil cu părinte testCnp
        Patient child = new Patient();
        child.setCNP("1991111111111");
        child.setFirstName("Copil");
        child.setLastName("Mic");
        child.setParent(testCnp);
        child.setEmail("copil@test.com");
        child.setPassword("test");
        child.setUserRole(UserRole.PATIENT);
        patientRepository.save(child);

        mockMvc.perform(get("/api/admin/patient/get-kids/" + testCnp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].cnp").value(child.getCNP()));
    }
}
