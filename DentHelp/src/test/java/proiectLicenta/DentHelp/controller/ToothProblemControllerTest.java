package proiectLicenta.DentHelp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import proiectLicenta.DentHelp.dto.ToothProblemDto;
import proiectLicenta.DentHelp.service.ToothProblemService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ToothProblemControllerTest {

    @Mock
    private ToothProblemService toothProblemService;

    @InjectMocks
    private ToothProblemController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetPatientToothProblems() {
        String cnp = "1234567890123";
        int toothNumber = 21;
        ToothProblemDto dto = new ToothProblemDto();
        when(toothProblemService.getAllPatientToothProblems(cnp, toothNumber))
                .thenReturn(Collections.singletonList(dto));

        ResponseEntity<ApiResponse> response = controller.getPatientToothProblems(cnp, toothNumber);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Interventions extracted successfully", response.getBody().getMessage());
        List<ToothProblemDto> data = (List<ToothProblemDto>) response.getBody().getData();
        assertEquals(1, data.size());
    }

    @Test
    void testGetPatientAllToothProblems() {
        String cnp = "1234567890123";
        when(toothProblemService.getPatientAllToothProblems(cnp))
                .thenReturn(Collections.singletonList(new ToothProblemDto()));

        ResponseEntity<ApiResponse> response = controller.getPatientAllToothProblems(cnp);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Interventions extracted successfully", response.getBody().getMessage());
    }

    @Test
    void testAddNewProblem() {
        ToothProblemDto dto = new ToothProblemDto();

        ResponseEntity<ApiResponse> response = controller.addNewProblem(dto);

        verify(toothProblemService).addNewProblem(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("New Problem added successfully", response.getBody().getMessage());
    }

    @Test
    void testDeleteProblem() {
        Long id = 1L;

        ResponseEntity<ApiResponse> response = controller.deleteProblem(id);

        verify(toothProblemService).deleteProblem(id);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Intervention deleted successfully", response.getBody().getMessage());
    }

    @Test
    void testEditProblem() {
        ToothProblemDto dto = new ToothProblemDto();

        ResponseEntity<ApiResponse> response = controller.editProblem(dto);

        verify(toothProblemService).updateProblem(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Problem Updated successfully", response.getBody().getMessage());
    }
}
