package proiectLicenta.DentHelp.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proiectLicenta.DentHelp.dto.AnamnesisAppointmentDto;
import proiectLicenta.DentHelp.model.AnamnesisAppointment;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.repository.AnamnesisAppointmentRepository;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.service.impl.AnamnesisAppointmentServiceImpl;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AnamnesisAppointmentServiceImplTest {

    private AnamnesisAppointmentRepository anamnesisAppointmentRepository;
    private AppointmentRepository appointmentRepository;
    private AnamnesisAppointmentServiceImpl service;

    @BeforeEach
    void setUp() {
        anamnesisAppointmentRepository = mock(AnamnesisAppointmentRepository.class);
        appointmentRepository = mock(AppointmentRepository.class);
        service = new AnamnesisAppointmentServiceImpl(anamnesisAppointmentRepository, appointmentRepository);
    }

    // 1. Test saveAnamneseAppointment - when appointment exists
    @Test
    void testSaveAnamneseAppointment_WhenAppointmentExists() {
        AnamnesisAppointmentDto dto = new AnamnesisAppointmentDto();
        dto.setAppointmentId(1L);
        dto.setAppointmentReason("Durere");
        dto.setPregnancy("false");
        dto.setCurrentSymptoms("Simptome");
        dto.setRecentMedication("Ibuprofen");
        dto.setCurrentMedication("Paracetamol");

        Appointment appointment = new Appointment();

        when(appointmentRepository.getAppointmentByAppointmentId(1L)).thenReturn(Optional.of(appointment));
        when(anamnesisAppointmentRepository.save(any(AnamnesisAppointment.class)))
                .thenAnswer(i -> i.getArgument(0)); // return the same object

        AnamnesisAppointment result = service.saveAnamneseAppointment(dto);

        assertEquals("Durere", result.getAppointmentReason());
        assertEquals("Simptome", result.getCurrentSymptoms());
        assertEquals("Ibuprofen", result.getRecentMedication());
        assertEquals("Paracetamol", result.getCurrentMedication());
        assertSame(appointment, result.getAppointment());

        verify(anamnesisAppointmentRepository).save(any(AnamnesisAppointment.class));
    }

    // 2. Test saveAnamneseAppointment - when appointment doesn't exist
    @Test
    void testSaveAnamneseAppointment_WhenAppointmentDoesNotExist() {
        AnamnesisAppointmentDto dto = new AnamnesisAppointmentDto();
        dto.setAppointmentId(99L);
        dto.setAppointmentReason("Fără");
        dto.setPregnancy("true");

        when(appointmentRepository.getAppointmentByAppointmentId(99L)).thenReturn(Optional.empty());
        when(anamnesisAppointmentRepository.save(any(AnamnesisAppointment.class)))
                .thenAnswer(i -> i.getArgument(0));

        AnamnesisAppointment result = service.saveAnamneseAppointment(dto);

        assertEquals("Fără", result.getAppointmentReason());
        assertNotNull(result.getAppointment()); // va fi un nou obiect gol

        verify(anamnesisAppointmentRepository).save(any(AnamnesisAppointment.class));
    }

    // 3. Test getAnamnesisAppointment - found
    @Test
    void testGetAnamnesisAppointment_Found() {
        Long appointmentId = 1L;
        AnamnesisAppointment anamnesis = new AnamnesisAppointment();

        when(anamnesisAppointmentRepository.findByAppointment_AppointmentId(appointmentId))
                .thenReturn(Optional.of(anamnesis));

        Optional<AnamnesisAppointment> result = service.getAnamnesisAppointment(appointmentId);

        assertTrue(result.isPresent());
        assertEquals(anamnesis, result.get());
        verify(anamnesisAppointmentRepository).findByAppointment_AppointmentId(appointmentId);
    }

    // 4. Test getAnamnesisAppointment - not found
    @Test
    void testGetAnamnesisAppointment_NotFound() {
        when(anamnesisAppointmentRepository.findByAppointment_AppointmentId(2L))
                .thenReturn(Optional.empty());

        Optional<AnamnesisAppointment> result = service.getAnamnesisAppointment(2L);

        assertFalse(result.isPresent());
        verify(anamnesisAppointmentRepository).findByAppointment_AppointmentId(2L);
    }
}
