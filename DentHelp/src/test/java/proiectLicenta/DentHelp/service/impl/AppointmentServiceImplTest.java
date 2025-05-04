package proiectLicenta.DentHelp.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import proiectLicenta.DentHelp.dto.AppointmentDto;
import proiectLicenta.DentHelp.dto.ModifyAppointmentDto;
import proiectLicenta.DentHelp.exceptions.ResourceNotFoundException;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppointmentServiceImplTest {

    private AppointmentServiceImpl appointmentService;
    private AppointmentRepository appointmentRepository;
    private PatientRepository patientRepository;

    @BeforeEach
    void setUp() {
        appointmentRepository = mock(AppointmentRepository.class);
        patientRepository = mock(PatientRepository.class);
        appointmentService = new AppointmentServiceImpl(appointmentRepository, patientRepository);
    }

    @Test
    void testSaveAppointment_Success() {
        AppointmentDto dto = new AppointmentDto();
        dto.setAppointmentReason("Control");
        dto.setPatientCnp("1234567890123");
        dto.setDate(String.valueOf(LocalDateTime.now()));
        dto.setHour(String.valueOf(LocalDateTime.now().plusHours(1)));

        Patient patient = new Patient();
        when(patientRepository.getPatientByCNP("1234567890123")).thenReturn(Optional.of(patient));

        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(i -> i.getArgument(0));

        Appointment result = appointmentService.saveAppointment(dto);

        assertEquals("Control", result.getAppointmentReason());
        assertEquals(patient, result.getPatient());
    }

    @Test
    void testModifyAppointment_NotFound() {
        ModifyAppointmentDto dto = new ModifyAppointmentDto();
        when(appointmentRepository.getAppointmentByAppointmentId(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                appointmentService.modifyAppointment(dto, 1L));
    }

    @Test
    void testDeleteAppointment_Success() {
        Appointment appointment = new Appointment();
        when(appointmentRepository.getAppointmentByAppointmentId(1L)).thenReturn(Optional.of(appointment));

        appointmentService.deleteAppointment(1L);

        verify(appointmentRepository, times(1)).delete(appointment);
    }

    @Test
    void testDeleteAppointment_NotFound() {
        when(appointmentRepository.getAppointmentByAppointmentId(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> appointmentService.deleteAppointment(1L));
    }
}
