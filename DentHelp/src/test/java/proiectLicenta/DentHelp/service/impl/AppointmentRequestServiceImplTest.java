package proiectLicenta.DentHelp.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proiectLicenta.DentHelp.dto.AppointmentRequestDto;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.model.AppointmentRequest;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.repository.AppointmentRequestRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.service.impl.AppointmentRequestServiceImpl;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppointmentRequestServiceImplTest {

    private AppointmentRequestRepository appointmentRequestRepository;
    private PatientRepository patientRepository;
    private AppointmentRequestServiceImpl service;

    @BeforeEach
    void setUp() {
        appointmentRequestRepository = mock(AppointmentRequestRepository.class);
        patientRepository = mock(PatientRepository.class);
        service = new AppointmentRequestServiceImpl(appointmentRequestRepository, patientRepository);
    }

    @Test
    void testSaveAppointmentRequest_Success() {
        AppointmentRequestDto dto = new AppointmentRequestDto();
        dto.setCnp("1234567890123");
        dto.setAppointmentReason("Control");
        dto.setRequestDate(String.valueOf(LocalDateTime.now()));
        dto.setDesiredAppointmentTime(String.valueOf(LocalDateTime.now().plusDays(3)));

        Patient patient = new Patient();

        when(patientRepository.getPatientByCNP(dto.getCnp())).thenReturn(Optional.of(patient));
        when(appointmentRequestRepository.getAllByPatient(patient)).thenReturn(Collections.emptyList());
        when(appointmentRequestRepository.save(any(AppointmentRequest.class)))
                .thenAnswer(i -> i.getArgument(0));

        AppointmentRequest result = service.saveAppointmentRequest(dto);

        assertEquals("Control", result.getAppointmentReason());
        assertSame(patient, result.getPatient());
        verify(appointmentRequestRepository).save(any(AppointmentRequest.class));
    }

    @Test
    void testSaveAppointmentRequest_AlreadyHasRequest() {
        AppointmentRequestDto dto = new AppointmentRequestDto();
        dto.setCnp("1234567890123");

        Patient patient = new Patient();
        when(patientRepository.getPatientByCNP(dto.getCnp())).thenReturn(Optional.of(patient));
        when(appointmentRequestRepository.getAllByPatient(patient)).thenReturn(List.of(new AppointmentRequest()));

        assertThrows(BadRequestException.class, () -> service.saveAppointmentRequest(dto));
    }

    @Test
    void testGetPatientAppointmentService_Success() {
        String cnp = "1234567890123";
        Patient patient = new Patient();
        List<AppointmentRequest> list = List.of(new AppointmentRequest(), new AppointmentRequest());

        when(patientRepository.getPatientByCNP(cnp)).thenReturn(Optional.of(patient));
        when(appointmentRequestRepository.getAllByPatient(patient)).thenReturn(list);

        List<AppointmentRequest> result = service.getPatientAppointmentService(cnp);

        assertEquals(2, result.size());
        verify(appointmentRequestRepository).getAllByPatient(patient);
    }

    @Test
    void testGetPatientAppointmentService_PatientNotFound() {
        when(patientRepository.getPatientByCNP("000")).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> service.getPatientAppointmentService("000"));
    }

    @Test
    void testDeleteAppointmentRequest_Success() {
        Long id = 1L;
        AppointmentRequest request = new AppointmentRequest();

        when(appointmentRequestRepository.getAppointmentRequestByAppointmentRequestId(id)).thenReturn(Optional.of(request));

        service.deleteAppointmentRequest(id);

        verify(appointmentRequestRepository).delete(request);
    }

    @Test
    void testDeleteAppointmentRequest_NotFound() {
        when(appointmentRequestRepository.getAppointmentRequestByAppointmentRequestId(1L)).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> service.deleteAppointmentRequest(1L));
    }

    @Test
    void testUpdateAppointmentRequest_Success() {
        Long id = 1L;
        AppointmentRequest request = new AppointmentRequest();
        AppointmentRequestDto dto = new AppointmentRequestDto();
        dto.setAppointmentReason("Durere");
        dto.setRequestDate(String.valueOf(LocalDateTime.now()));
        dto.setDesiredAppointmentTime(String.valueOf(LocalDateTime.now().plusDays(1)));

        when(appointmentRequestRepository.getAppointmentRequestByAppointmentRequestId(id)).thenReturn(Optional.of(request));

        service.updateAppointmentRequest(id, dto);

        assertEquals("Durere", request.getAppointmentReason());
        verify(appointmentRequestRepository).save(request);
    }

    @Test
    void testUpdateAppointmentRequest_NotFound() {
        AppointmentRequestDto dto = new AppointmentRequestDto();
        when(appointmentRequestRepository.getAppointmentRequestByAppointmentRequestId(2L)).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> service.updateAppointmentRequest(2L, dto));
    }
}
