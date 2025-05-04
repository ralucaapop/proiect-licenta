package proiectLicenta.DentHelp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import proiectLicenta.DentHelp.dto.AppointmentDto;
import proiectLicenta.DentHelp.dto.ModifyAppointmentDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.service.AppointmentService;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AppointmentController.class)
class AppointmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AppointmentService appointmentService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testSaveAppointment() throws Exception {
        AppointmentDto dto = new AppointmentDto();
        dto.setPatientCnp("1234567890123");

        mockMvc.perform(post("/api/admin/appointment/make-appointment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Appointment saved successfully"));

        verify(appointmentService).saveAppointment(dto);
    }

    @Test
    void testGetAppointments() throws Exception {
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(1L);
        appointment.setAppointmentReason("Consultație");
        appointment.setStartDateHour(String.valueOf(LocalDateTime.now()));
        appointment.setEndDateHour(String.valueOf(LocalDateTime.now().plusHours(1)));
        Patient patient = new Patient();
        patient.setCNP("1234567890123");
        appointment.setPatient(patient);

        when(appointmentService.getAppointments()).thenReturn(Collections.singletonList(appointment));

        mockMvc.perform(get("/api/admin/appointment/get-appointments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Appointments list"))
                .andExpect(jsonPath("$.data[0].patientCnp").value("1234567890123"));
    }

    @Test
    void testModifyAppointment() throws Exception {
        ModifyAppointmentDto dto = new ModifyAppointmentDto();
        Long id = 1L;

        mockMvc.perform(put("/api/admin/appointment/modify-appointment/{appointmet_id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Appointment modified successfully"));

        verify(appointmentService).modifyAppointment(dto, id);
    }

    @Test
    void testDeleteAppointment() throws Exception {
        Long id = 1L;

        mockMvc.perform(delete("/api/admin/appointment/delete-appointment/{appointment_id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Appointment deleted"));

        verify(appointmentService).deleteAppointment(id);
    }
}
