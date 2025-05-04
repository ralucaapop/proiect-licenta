package proiectLicenta.DentHelp.service.impl;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proiectLicenta.DentHelp.dto.PatientDto;
import proiectLicenta.DentHelp.dto.PatientUpdateDto;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.exceptions.ResourceNotFoundException;
import proiectLicenta.DentHelp.model.GeneralAnamnesis;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.UserRole;
import proiectLicenta.DentHelp.repository.GeneralAnamnesisRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PatientServiceImplTest {

    private PatientRepository patientRepository;
    private GeneralAnamnesisRepository generalAnamnesisRepository;
    private PatientServiceImpl service;

    @BeforeEach
    void setUp() {
        patientRepository = mock(PatientRepository.class);
        generalAnamnesisRepository = mock(GeneralAnamnesisRepository.class);
        service = new PatientServiceImpl(patientRepository, generalAnamnesisRepository);
    }

    @Test
    void testAddNewPatient_ThrowsExceptionIfEmailExists() {
        PatientDto dto = new PatientDto();
        dto.setEmail("test@example.com");

        when(patientRepository.getPatientByEmail("test@example.com")).thenReturn(Optional.of(new Patient()));

        assertThrows(BadRequestException.class, () -> service.addNewPatient(dto));
    }

    @Test
    void testUpdatePatient_Success() {
        String cnp = "1234567890123";
        Patient patient = new Patient();
        GeneralAnamnesis anamnesis = new GeneralAnamnesis();
        PatientUpdateDto updateDto = new PatientUpdateDto();

        when(patientRepository.getPatientByCNP(cnp)).thenReturn(Optional.of(patient));
        when(generalAnamnesisRepository.getGeneralAnamnesisByPatinet(patient)).thenReturn(Optional.of(anamnesis));

        service.updatePatient(cnp, updateDto);

        verify(patientRepository).save(patient);
        verify(generalAnamnesisRepository).save(anamnesis);
    }

    @Test
    void testChangeRadiologistToPatient_Success() {
        String cnp = "1234567890123";
        Patient patient = new Patient();
        patient.setUserRole(UserRole.RADIOLOGIST);

        when(patientRepository.getPatientByCNP(cnp)).thenReturn(Optional.of(patient));

        service.changeRadiologistToPatient(cnp);

        assertEquals(UserRole.PATIENT, patient.getUserRole());
        verify(patientRepository).save(patient);
    }

    @Test
    void testChangeRadiologistToPatient_PatientNotFound() {
        when(patientRepository.getPatientByCNP("999")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.changeRadiologistToPatient("999"));
    }
}
