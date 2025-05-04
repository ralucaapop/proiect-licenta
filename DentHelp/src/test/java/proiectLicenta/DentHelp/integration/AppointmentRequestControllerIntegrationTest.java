package proiectLicenta.DentHelp.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import proiectLicenta.DentHelp.dto.AppointmentRequestDto;
import proiectLicenta.DentHelp.model.AppointmentRequest;
import proiectLicenta.DentHelp.repository.AppointmentRequestRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class AppointmentRequestControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AppointmentRequestRepository appointmentRequestRepository;

    @Test
    public void testSaveAppointmentRequest() throws Exception {
        AppointmentRequestDto dto = new AppointmentRequestDto();
        dto.setCnp("1234567890123");
        dto.setAppointmentReason("Control general");
        dto.setRequestDate(String.valueOf(LocalDate.now()));
        dto.setDesiredAppointmentTime(String.valueOf(LocalDateTime.now().plusDays(2)));

        mockMvc.perform(post("/api/in/appointment_request/add_appointment_request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Appointment request saved with success"));
    }

    @Test
    public void testGetPatientAppointmentRequests() throws Exception {
        mockMvc.perform(get("/api/in/appointment_request/get_patient_requests/1234567890123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Appointment requests get successfully"));
    }

    @Test
    public void testDeleteAppointmentRequest() throws Exception {
        AppointmentRequest appointmentRequest = new AppointmentRequest();
        appointmentRequestRepository.save(appointmentRequest);
        mockMvc.perform(delete("/api/in/appointment_request/delete_request/" + appointmentRequest.getAppointmentRequestId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Appointment request deleted successfully"));
    }

    @Test
    public void testUpdateAppointmentRequest() throws Exception {
        AppointmentRequestDto dto = new AppointmentRequestDto();
        dto.setAppointmentReason("Actualizat");
        dto.setRequestDate(String.valueOf(LocalDate.now()));
        dto.setDesiredAppointmentTime(String.valueOf(LocalDateTime.now().plusDays(3)));

        AppointmentRequest appointmentRequest = new AppointmentRequest();
        appointmentRequestRepository.save(appointmentRequest);

        dto.setAppointmentRequestId(appointmentRequest.getAppointmentRequestId());

        mockMvc.perform(put("/api/in/appointment_request/update_request/" + appointmentRequest.getAppointmentRequestId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Appointment request successfully updated"));
    }
}
