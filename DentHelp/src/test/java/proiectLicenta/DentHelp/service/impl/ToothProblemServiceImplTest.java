package proiectLicenta.DentHelp.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proiectLicenta.DentHelp.dto.ToothProblemDto;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.ToothProblemModel;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.repository.ToothProblemRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ToothProblemServiceImplTest {

    private ToothProblemRepository toothProblemRepository;
    private PatientRepository patientRepository;
    private ToothProblemServiceImpl service;

    @BeforeEach
    void setUp() {
        toothProblemRepository = mock(ToothProblemRepository.class);
        patientRepository = mock(PatientRepository.class);
        service = new ToothProblemServiceImpl(toothProblemRepository, patientRepository);
    }

    @Test
    void testGetAllPatientToothProblems_Success() {
        String cnp = "123";
        int toothNumber = 11;
        Patient patient = new Patient();
        ToothProblemModel model = new ToothProblemModel();
        model.setProblemId(1L);
        model.setProblemDetails("Fractură");
        model.setToothNumber(toothNumber);
        model.setDateProblem("2024-01-01");

        when(patientRepository.getPatientByCNP(cnp)).thenReturn(Optional.of(patient));
        when(toothProblemRepository.getAllByPatientAndToothNumber(patient, toothNumber)).thenReturn(List.of(model));

        List<ToothProblemDto> result = service.getAllPatientToothProblems(cnp, toothNumber);

        assertEquals(1, result.size());
        assertEquals("Fractură", result.get(0).getProblemDetails());
    }

    @Test
    void testGetAllPatientToothProblems_ThrowsIfNoPatient() {
        when(patientRepository.getPatientByCNP("999")).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> service.getAllPatientToothProblems("999", 12));
    }

    @Test
    void testAddNewProblem_Success() {
        String cnp = "321";
        Patient patient = new Patient();
        ToothProblemDto dto = new ToothProblemDto();
        dto.setDateProblem("2023-02-02");
        dto.setProblemDetails("Infecție");
        dto.setToothNumber(22);
        dto.setPatientCnp(cnp);

        when(patientRepository.getPatientByCNP(cnp)).thenReturn(Optional.of(patient));

        service.addNewProblem(dto);

        verify(toothProblemRepository).save(any(ToothProblemModel.class));
    }

    @Test
    void testAddNewProblem_ThrowsIfNoPatient() {
        ToothProblemDto dto = new ToothProblemDto();
        dto.setPatientCnp("999");

        when(patientRepository.getPatientByCNP("999")).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> service.addNewProblem(dto));
    }

    @Test
    void testDeleteProblem_Success() {
        Long id = 10L;
        ToothProblemModel model = new ToothProblemModel();
        when(toothProblemRepository.getToothInterventionModelByProblemId(id)).thenReturn(Optional.of(model));

        service.deleteProblem(id);

        verify(toothProblemRepository).delete(model);
    }

    @Test
    void testDeleteProblem_ThrowsIfNotFound() {
        when(toothProblemRepository.getToothInterventionModelByProblemId(99L)).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> service.deleteProblem(99L));
    }

    @Test
    void testUpdateProblem_Success() {
        ToothProblemDto dto = new ToothProblemDto();
        dto.setProblemId(5L);
        dto.setProblemDetails("Actualizat");

        ToothProblemModel model = new ToothProblemModel();
        when(toothProblemRepository.getToothInterventionModelByProblemId(5L)).thenReturn(Optional.of(model));

        service.updateProblem(dto);

        verify(toothProblemRepository).save(model);
        assertEquals("Actualizat", model.getProblemDetails());
    }

    @Test
    void testUpdateProblem_ThrowsIfNotFound() {
        ToothProblemDto dto = new ToothProblemDto();
        dto.setProblemId(404L);

        when(toothProblemRepository.getToothInterventionModelByProblemId(404L)).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> service.updateProblem(dto));
    }
}
