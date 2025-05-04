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
import proiectLicenta.DentHelp.dto.TreatmentSheetDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.UserRole;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class TreatmentSheetControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private AppointmentRepository appointmentRepository;
    @Autowired private PatientRepository patientRepository;

    private Long testAppointmentId;
    private final String testCnp = "1997777777777";

    @BeforeEach
    public void setup() {
        // Creează pacientul de test dacă nu există
        Patient patient = patientRepository.getPatientByCNP(testCnp).orElseGet(() -> {
            Patient newPatient = new Patient();
            newPatient.setCNP(testCnp);
            newPatient.setFirstName("Test");
            newPatient.setLastName("Pacient");
            newPatient.setEmail("test@pacient.ro");
            newPatient.setPassword("password");
            newPatient.setUserRole(UserRole.PATIENT);
            return patientRepository.save(newPatient);
        });

        // Creează o programare de test
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setStartDateHour(String.valueOf(LocalDate.now().plusDays(1)));
        appointment.setEndDateHour(String.valueOf(LocalDate.now().plusDays(2)));
        appointment = appointmentRepository.save(appointment);
        testAppointmentId = appointment.getAppointmentId();
    }

    @Test
    public void testGetTreatmentSheet_ShouldReturnNoSheetInitially() throws Exception {
        mockMvc.perform(get("/api/in/treatment-sheet/get-treatment-sheet/" + testAppointmentId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("There is no treatment sheet for this appointment"))
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    @WithMockUser(authorities = {"ADMIN"})
    public void testSaveTreatmentSheet_ShouldSucceed() throws Exception {
        TreatmentSheetDto dto = new TreatmentSheetDto();
        dto.setAppointmentId(testAppointmentId);
        dto.setMedication("Ibuprofen");
        dto.setRecommendations("Odihnă și hidratare");
        dto.setAppointmentObservations("Durere moderată la nivelul molarului");

        mockMvc.perform(post("/api/in/treatment-sheet/save-treatment-sheet")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("The treatment sheet was saved"));
    }

    @Test
    @WithMockUser(authorities = {"ADMIN"})
    public void testUpdateTreatmentSheet_ShouldSucceed() throws Exception {
        // Creează o fișă înainte de update
        TreatmentSheetDto dto = new TreatmentSheetDto();
        dto.setAppointmentId(testAppointmentId);
        dto.setMedication("Paracetamol");
        dto.setRecommendations("Somn și ceai cald");
        dto.setAppointmentObservations("Ușoară inflamație");

        mockMvc.perform(post("/api/in/treatment-sheet/save-treatment-sheet")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        // Actualizare
        dto.setMedication("Paracetamol 500mg");
        dto.setRecommendations("Fără efort fizic");
        dto.setAppointmentObservations("Stare ameliorată");

        mockMvc.perform(put("/api/in/treatment-sheet/update-sheet-treatment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("treatment sheet updated successfully"));
    }
}
