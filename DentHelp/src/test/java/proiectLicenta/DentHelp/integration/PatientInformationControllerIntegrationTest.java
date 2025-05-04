package proiectLicenta.DentHelp.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import proiectLicenta.DentHelp.dto.PersonalDataDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.UserRole;
import proiectLicenta.DentHelp.repository.PatientRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class PatientInformationControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private PatientRepository patientRepository;

    private final String testCnp = "1987654321098";

    @BeforeEach
    public void setup() {
        if (!patientRepository.getPatientByCNP(testCnp).isPresent()) {
            Patient patient = new Patient();
            patient.setCNP(testCnp);
            patient.setFirstName("Maria");
            patient.setLastName("Georgescu");
            patient.setEmail("maria.georgescu@test.com");
            patient.setPassword("encrypted");
            patient.setUserRole(UserRole.PATIENT);
            patientRepository.save(patient);
        }
    }

    @Test
    public void testAddPersonalData_ShouldSucceed() throws Exception {
        PersonalDataDto dataDto = new PersonalDataDto();
        dataDto.setCnpPatient(testCnp);
        dataDto.setAddressNumber("45");
        dataDto.setAddressStreet("Str. Florilor");
        dataDto.setAddressRegion("Ilfov");
        dataDto.setAddressCountry("Romania");
        dataDto.setPhoneNumber("0761234567");
        dataDto.setSex("F");

        mockMvc.perform(post("/api/in/personalData/add-personal-data")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dataDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Patient info saved with success"));
    }

    @Test
    public void testUpdatePersonalData_ShouldSucceed() throws Exception {
        PersonalDataDto updateDto = new PersonalDataDto();
        updateDto.setCnpPatient(testCnp);
        updateDto.setAddressNumber("99");
        updateDto.setAddressStreet("Str. Libertății");
        updateDto.setAddressRegion("București");
        updateDto.setAddressCountry("Romania");
        updateDto.setPhoneNumber("0750000000");
        updateDto.setSex("F");

        mockMvc.perform(put("/api/in/personalData/update-personal-data")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Patient info saved with succes"));
    }

    @Test
    public void testGetPatientPersonalData_ShouldReturnData() throws Exception {
        mockMvc.perform(get("/api/in/personalData/get-patient-personal-data/" + testCnp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());
    }
}
