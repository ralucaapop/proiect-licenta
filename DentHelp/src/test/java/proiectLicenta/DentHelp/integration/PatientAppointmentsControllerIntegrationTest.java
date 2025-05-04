package proiectLicenta.DentHelp.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import proiectLicenta.DentHelp.dto.PatientCnpDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class PatientAppointmentsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    private final String testCnp = "1234567890123";

    @BeforeEach
    public void setup() {
        if (!patientRepository.getPatientByCNP(testCnp).isPresent()) {
            Patient patient = new Patient();
            patient.setCNP(testCnp);
            patient.setFirstName("Test");
            patient.setLastName("User");
            patientRepository.save(patient);

            Appointment appointment = new Appointment();
            appointment.setAppointmentReason("Consultatie");
            appointment.setStartDateHour(String.valueOf(LocalDateTime.of(2025, 4, 25, 10, 0)));
            appointment.setEndDateHour(String.valueOf(LocalDateTime.of(2025, 4, 25, 11, 0)));
            appointment.setPatient(patient);
            appointmentRepository.save(appointment);
        }
    }

    @Test
    public void testGetPatientAppointments_ShouldReturnAppointmentsList() throws Exception {
        PatientCnpDto dto = new PatientCnpDto();
        dto.setPatientCnp(testCnp);

        mockMvc.perform(post("/api/patient/appointments/get-patient-appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }
}
