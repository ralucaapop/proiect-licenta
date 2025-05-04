package proiectLicenta.DentHelp.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proiectLicenta.DentHelp.dto.GeneralAnamnesisDto;
import proiectLicenta.DentHelp.model.GeneralAnamnesis;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.repository.GeneralAnamnesisRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GeneralAnamnesisServiceImplTest {

    private GeneralAnamnesisRepository anamnesisRepo;
    private PatientRepository patientRepo;
    private GeneralAnamnesisServiceImpl service;

    @BeforeEach
    void setUp() {
        anamnesisRepo = mock(GeneralAnamnesisRepository.class);
        patientRepo = mock(PatientRepository.class);
        service = new GeneralAnamnesisServiceImpl(anamnesisRepo, patientRepo);
    }

    @Test
    void testSaveGeneralAnamnesis() {
        GeneralAnamnesisDto dto = new GeneralAnamnesisDto();
        dto.setCnp("1234567890123");
        dto.setAllergies("Polen");
        dto.setSmoker(String.valueOf(true));

        Patient patient = new Patient();
        when(patientRepo.getPatientByCNP("1234567890123")).thenReturn(Optional.of(patient));

        service.saveGeneralAnamnesis(dto);

        verify(anamnesisRepo, times(1)).save(any(GeneralAnamnesis.class));
    }

    @Test
    void testGetPatientGeneralAnamnesis_Found() {
        Patient patient = new Patient();
        GeneralAnamnesis anamnesis = new GeneralAnamnesis();
        when(patientRepo.getPatientByCNP("123")).thenReturn(Optional.of(patient));
        when(anamnesisRepo.getGeneralAnamnesisByPatinet(patient)).thenReturn(Optional.of(anamnesis));

        GeneralAnamnesis result = service.getPatientGeneralAnamnesis("123");
        assertEquals(anamnesis, result);
    }

    @Test
    void testGetPatientGeneralAnamnesis_NotFound() {
        when(patientRepo.getPatientByCNP("123")).thenReturn(Optional.empty());
        GeneralAnamnesis result = service.getPatientGeneralAnamnesis("123");
        assertNotNull(result); // returnează obiect gol
    }

    @Test
    void testUpdateGeneralAnamnesis_NewRecord() {
        GeneralAnamnesisDto dto = new GeneralAnamnesisDto();
        dto.setCnp("999");
        dto.setAlcoholConsumer("false");
        dto.setAllergies("Acarieni");

        Patient patient = new Patient();
        when(patientRepo.getPatientByCNP("999")).thenReturn(Optional.of(patient));
        when(anamnesisRepo.getGeneralAnamnesisByPatinet(patient)).thenReturn(Optional.empty());

        service.updateGeneralAnamnesis(dto);

        verify(anamnesisRepo).save(any(GeneralAnamnesis.class));
    }

    @Test
    void testUpdateGeneralAnamnesis_ExistingRecord() {
        GeneralAnamnesisDto dto = new GeneralAnamnesisDto();
        dto.setCnp("1234567890123");
        dto.setSmoker("true");

        Patient patient = new Patient();
        GeneralAnamnesis existing = new GeneralAnamnesis();
        when(patientRepo.getPatientByCNP("1234567890123")).thenReturn(Optional.of(patient));
        when(anamnesisRepo.getGeneralAnamnesisByPatinet(patient)).thenReturn(Optional.of(existing));

        service.updateGeneralAnamnesis(dto);

        verify(anamnesisRepo).save(existing);
        assertTrue(Boolean.parseBoolean(existing.getSmoker()));
    }
}
