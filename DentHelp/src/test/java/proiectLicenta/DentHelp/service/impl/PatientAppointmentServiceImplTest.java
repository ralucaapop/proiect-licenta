package proiectLicenta.DentHelp.service.impl;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proiectLicenta.DentHelp.dto.PatientCnpDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.repository.AppointmentRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class PatientAppointmentServiceImplTest {

    private AppointmentRepository appointmentRepository;
    private PatientAppointmentServiceImpl service;

    @BeforeEach
    void setUp() {
        appointmentRepository = mock(AppointmentRepository.class);
        service = new PatientAppointmentServiceImpl(appointmentRepository);
    }

    @Test
    void testGetPatientAppointments() {
        PatientCnpDto dto = new PatientCnpDto();
        dto.setPatientCnp("1234567890123");

        List<Appointment> mockAppointments = List.of(new Appointment(), new Appointment());
        when(appointmentRepository.getAppointmentsByPatientCNP("1234567890123")).thenReturn(mockAppointments);

        List<Appointment> result = service.getPatientAppointments(dto);

        assertEquals(2, result.size());
        verify(appointmentRepository).getAppointmentsByPatientCNP("1234567890123");
    }
}