package proiectLicenta.DentHelp.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import proiectLicenta.DentHelp.dto.ConfirmAppointmentDto;
import proiectLicenta.DentHelp.dto.RejectAppointmentDto;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class ConfirmAppointmentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAppointmentRequests_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/admin/confirm-appointments/get-appointments-request"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Get Appointments successfully"));
    }

    @Test
    public void testSaveAppointment_ShouldReturn200() throws Exception {
        ConfirmAppointmentDto dto = new ConfirmAppointmentDto();
        dto.setAppointmentReason("Control periodic");
        dto.setStartDateHour("2025-05-01T10:00");
        dto.setEndDateHour("2025-05-01T10:30");
        dto.setCnpPatient("1234567890123");
        dto.setAppointmentRequestId(1L);

        mockMvc.perform(post("/api/admin/confirm-appointments/save-appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Appointment saved"));
    }

    @Test
    @WithMockUser(authorities = {"ADMIN"})
    public void testRejectAppointment_ShouldReturn200() throws Exception {
        RejectAppointmentDto dto = new RejectAppointmentDto();
        dto.setAppointmentRequestId(2L);
        dto.setPatientCNP("1234567890123");
        dto.setMessage("în perioada următoare");

        mockMvc.perform(post("/api/admin/confirm-appointments/rejectAppointment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("The request was rejected successfully"));
    }
}

