package proiectLicenta.DentHelp.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proiectLicenta.DentHelp.dto.ToothInterventionDto;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.ToothInterventionModel;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.repository.ToothInterventionRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ToothInterventionServiceImplTest {

    private ToothInterventionRepository toothInterventionRepository;
    private PatientRepository patientRepository;
    private ToothInterventionServiceImpl service;

    @BeforeEach
    void setUp() {
        toothInterventionRepository = mock(ToothInterventionRepository.class);
        patientRepository = mock(PatientRepository.class);
        service = new ToothInterventionServiceImpl(toothInterventionRepository, patientRepository);
    }

    @Test
    void testGetAllPatientToothIntervention_ReturnsNonExtracted() {
        String cnp = "123456789";
        int toothNumber = 21;
        Patient patient = new Patient();

        ToothInterventionModel model = new ToothInterventionModel();
        model.setToothNumber(toothNumber);
        model.setInterventionDetails("Cavity filled");
        model.setDateIntervention("2023-04-10");
        model.setIsExtracted("false");
        model.setInterventionId(1L);

        when(patientRepository.getPatientByCNP(cnp)).thenReturn(Optional.of(patient));
        when(toothInterventionRepository.getAllByPatientAndToothNumber(patient, toothNumber))
                .thenReturn(List.of(model));

        List<ToothInterventionDto> result = service.getAllPatientToothIntervention(cnp, toothNumber);

        assertEquals(1, result.size());
        assertEquals("Cavity filled", result.get(0).getInterventionDetails());
    }

    @Test
    void testGetAllPatientToothIntervention_ThrowsIfNoPatient() {
        when(patientRepository.getPatientByCNP("000")).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class,
                () -> service.getAllPatientToothIntervention("000", 11));
    }

    @Test
    void testAddNewIntervention_SavesIfPatientExists() {
        String cnp = "123456789";
        ToothInterventionDto dto = new ToothInterventionDto();
        dto.setPatientCnp(cnp);
        dto.setDateIntervention("2024-01-01");
        dto.setToothNumber(24);
        dto.setIsExtracted("false");
        dto.setInterventionDetails("Filling");

        Patient patient = new Patient();

        when(patientRepository.getPatientByCNP(cnp)).thenReturn(Optional.of(patient));

        service.addNewIntervention(dto);

        verify(toothInterventionRepository).save(any(ToothInterventionModel.class));
    }

    @Test
    void testAddNewIntervention_ThrowsIfPatientNotFound() {
        ToothInterventionDto dto = new ToothInterventionDto();
        dto.setPatientCnp("999");

        when(patientRepository.getPatientByCNP("999")).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class,
                () -> service.addNewIntervention(dto));
    }
}
