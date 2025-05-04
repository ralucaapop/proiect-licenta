package proiectLicenta.DentHelp.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import proiectLicenta.DentHelp.dto.AnamnesisAppointmentDto;
import proiectLicenta.DentHelp.model.AnamnesisAppointment;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.repository.AnamnesisAppointmentRepository;
import proiectLicenta.DentHelp.repository.AppointmentRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Rollback
@Transactional
@AutoConfigureMockMvc(addFilters = false)
public class AnamnesisAppointmentControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AnamnesisAppointmentRepository anamnesisAppointmentRepository;

    @Test
    void testSaveAppointmentAnamnesis() throws Exception {
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(100L);
        appointmentRepository.save(appointment);

        AnamnesisAppointmentDto dto = new AnamnesisAppointmentDto();
        dto.setAppointmentId(100L);
        dto.setAppointmentReason("Durere acută");
        dto.setPregnancy("Nu");
        dto.setRecentMedication("Paracetamol");
        dto.setCurrentSymptoms("Durere de dinți");
        dto.setCurrentMedication("Ibuprofen");

        mockMvc.perform(post("/api/in/appointment/saveAppointmentAnamnesis")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Appointment anamnesis saved with success"));

        Optional<AnamnesisAppointment> saved = anamnesisAppointmentRepository.findByAppointment_AppointmentId(100L);
        assertThat(saved).isPresent();
        assertThat(saved.get().getCurrentSymptoms()).isEqualTo("Durere de dinți");
    }

    @Test
    void testGetAppointmentAnamnesis() throws Exception {
        Appointment appointment = new Appointment();
        appointmentRepository.save(appointment);

        AnamnesisAppointment anamnesis = new AnamnesisAppointment();
        anamnesis.setAppointment(appointment);
        anamnesis.setAppointmentReason("Control periodic");
        anamnesis.setPregnancy("Nu");
        anamnesis.setRecentMedication("Nimic");
        anamnesis.setCurrentSymptoms("Nimic");
        anamnesis.setCurrentMedication("Nimic");
        anamnesisAppointmentRepository.save(anamnesis);

        mockMvc.perform(get("/api/in/appointment/getAnamnesisAppointment/"+appointment.getAppointmentId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("AppointmentAnamnesis"))
                .andExpect(jsonPath("$.data.appointmentReason").value("Control periodic"));
    }

    @Test
    void testGetAppointmentAnamnesis_NotFound() throws Exception {
        mockMvc.perform(get("/api/in/appointment/getAnamnesisAppointment/9999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("AppointmentAnamnesis"))
                .andExpect(jsonPath("$.data").isEmpty());
    }
}
