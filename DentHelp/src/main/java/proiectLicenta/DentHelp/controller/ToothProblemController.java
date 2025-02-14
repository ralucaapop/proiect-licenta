package proiectLicenta.DentHelp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.ToothInterventionDto;
import proiectLicenta.DentHelp.dto.ToothProblemDto;
import proiectLicenta.DentHelp.service.ToothProblemService;
import proiectLicenta.DentHelp.service.impl.ToothInterventionServiceImpl;
import proiectLicenta.DentHelp.service.impl.ToothProblemServiceImpl;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(path = "api/in/teeth/problems")
public class ToothProblemController {
    private final ToothProblemService toothProblemService;

    public ToothProblemController(ToothProblemService toothProblemService) {
        this.toothProblemService = toothProblemService;
    }

    @GetMapping("get_patient_tooth_problems/{cnp}/{toothNumber}")
    public ResponseEntity<ApiResponse> getPatientToothProblems(@PathVariable String cnp, @PathVariable int toothNumber){
        List<ToothProblemDto> toothInterventionDtoList = toothProblemService.getAllPatientToothProblems(cnp, toothNumber);
        return ResponseEntity.ok(ApiResponse.success("Interventions extracted successfully", toothInterventionDtoList));
    }

    @GetMapping("get_patient_all_tooth_problems/{cnp}")
    public ResponseEntity<ApiResponse> getPatientAllToothProblems(@PathVariable String cnp){
        List<ToothProblemDto> toothInterventionDtoList = toothProblemService.getPatientAllToothProblems(cnp);
        return ResponseEntity.ok(ApiResponse.success("Interventions extracted successfully", toothInterventionDtoList));
    }


    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PostMapping("/addNewProblem")
    public ResponseEntity<ApiResponse> addNewProblem(@RequestBody ToothProblemDto toothProblemDto){
        toothProblemService.addNewProblem(toothProblemDto);
        return ResponseEntity.ok(ApiResponse.success("New Problem added successfully", null));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @DeleteMapping("/deleteProblem/{problemId}")
    public ResponseEntity<ApiResponse> deleteProblem(@PathVariable Long problemId){
        toothProblemService.deleteProblem(problemId);
        return ResponseEntity.ok(ApiResponse.success("Intervention deleted successfully", null));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PutMapping("/editProblem")
    public ResponseEntity<ApiResponse> editProblem(@RequestBody ToothProblemDto toothProblemDto){
        toothProblemService.updateProblem(toothProblemDto);
        return ResponseEntity.ok(ApiResponse.success("Problem Updated successfully", null));
    }

}
