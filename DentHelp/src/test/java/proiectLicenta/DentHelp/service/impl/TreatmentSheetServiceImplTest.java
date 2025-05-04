package proiectLicenta.DentHelp.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proiectLicenta.DentHelp.dto.TreatmentSheetDto;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.TreatmentSheet;
import proiectLicenta.DentHelp.repository.AppointmentRepository;
import proiectLicenta.DentHelp.repository.TreatmentSheetRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TreatmentSheetServiceImplTest {

    private TreatmentSheetRepository treatmentSheetRepository;
    private AppointmentRepository appointmentRepository;
    private TreatmentSheetServiceImpl service;

    @BeforeEach
    void setUp() {
        treatmentSheetRepository = mock(TreatmentSheetRepository.class);
        appointmentRepository = mock(AppointmentRepository.class);
        service = new TreatmentSheetServiceImpl(treatmentSheetRepository, appointmentRepository);
    }

    @Test
    void testGetTreatmentSheet_ReturnsSheetIfExists() {
        Long appointmentId = 1L;
        Appointment appointment = new Appointment();
        TreatmentSheet sheet = new TreatmentSheet();

        when(appointmentRepository.getAppointmentByAppointmentId(appointmentId)).thenReturn(Optional.of(appointment));
        when(treatmentSheetRepository.getTreatmentSheetByAppointment(appointment)).thenReturn(Optional.of(sheet));

        TreatmentSheet result = service.getTreatmentSheet(appointmentId);

        assertNotNull(result);
    }

    @Test
    void testGetTreatmentSheet_ReturnsNullIfNoSheet() {
        Long appointmentId = 2L;
        Appointment appointment = new Appointment();

        when(appointmentRepository.getAppointmentByAppointmentId(appointmentId)).thenReturn(Optional.of(appointment));
        when(treatmentSheetRepository.getTreatmentSheetByAppointment(appointment)).thenReturn(Optional.empty());

        TreatmentSheet result = service.getTreatmentSheet(appointmentId);

        assertNull(result);
    }

    @Test
    void testSaveTreatmentSheet_SavesNewSheet() {
        TreatmentSheetDto dto = new TreatmentSheetDto();
        dto.setAppointmentId(3L);
        dto.setMedication("Antibiotic");
        dto.setAppointmentObservations("Observatii");
        dto.setRecommendations("Recomandari");

        Appointment appointment = new Appointment();

        when(appointmentRepository.getAppointmentByAppointmentId(dto.getAppointmentId())).thenReturn(Optional.of(appointment));
        when(treatmentSheetRepository.getTreatmentSheetByAppointment(appointment)).thenReturn(Optional.empty());

        int result = service.saveTreatmentSheet(dto);

        assertEquals(0, result);
        verify(treatmentSheetRepository).save(any(TreatmentSheet.class));
    }

    @Test
    void testSaveTreatmentSheet_DoesNotSaveIfExists() {
        TreatmentSheetDto dto = new TreatmentSheetDto();
        dto.setAppointmentId(4L);

        Appointment appointment = new Appointment();
        TreatmentSheet existingSheet = new TreatmentSheet();

        when(appointmentRepository.getAppointmentByAppointmentId(dto.getAppointmentId())).thenReturn(Optional.of(appointment));
        when(treatmentSheetRepository.getTreatmentSheetByAppointment(appointment)).thenReturn(Optional.of(existingSheet));

        int result = service.saveTreatmentSheet(dto);

        assertEquals(1, result);
        verify(treatmentSheetRepository, never()).save(any());
    }

    @Test
    void testUpdateTreatmentSheet_UpdatesIfExists() {
        TreatmentSheetDto dto = new TreatmentSheetDto();
        dto.setAppointmentId(5L);
        dto.setMedication("Nou medicament");
        dto.setAppointmentObservations("Noi observatii");
        dto.setRecommendations("Noi recomandari");

        Appointment appointment = new Appointment();
        TreatmentSheet sheet = new TreatmentSheet();

        when(appointmentRepository.getAppointmentByAppointmentId(dto.getAppointmentId())).thenReturn(Optional.of(appointment));
        when(treatmentSheetRepository.getTreatmentSheetByAppointment(appointment)).thenReturn(Optional.of(sheet));

        service.updateTreatmentSheet(dto);

        verify(treatmentSheetRepository).save(sheet);
        assertEquals("Nou medicament", sheet.getMedication());
    }
}
