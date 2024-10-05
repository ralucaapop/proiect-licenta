package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.GeneralAnamnesisDto;
import proiectLicenta.DentHelp.model.GeneralAnamnesis;
import proiectLicenta.DentHelp.service.GeneralAnamnesisService;
import proiectLicenta.DentHelp.utils.ApiResponse;

@RestController
@CrossOrigin
@RequestMapping(path ="/api/in/general-anamnesis")
public class GeneralAnamnesisController {
    private final GeneralAnamnesisService generalAnamnesisService;

    @Autowired
    public GeneralAnamnesisController(GeneralAnamnesisService generalAnamnesisService) {
        this.generalAnamnesisService = generalAnamnesisService;
    }

    @PostMapping("/add-general-anamnesis-patient")
    @PreAuthorize("hasAnyAuthority('PATIENT')")
    public ResponseEntity<ApiResponse> saveGeneralAnamnesis(@RequestBody GeneralAnamnesisDto generalAnamnesisDto){
        generalAnamnesisService.saveGeneralAnamnesis(generalAnamnesisDto);
        System.out.print(generalAnamnesisDto.getPreviousDentalProblems());
        return ResponseEntity.ok(ApiResponse.success("General anamnesis saved with success", null));
    }

    @GetMapping("/get-general-anamnesis/{cnpPatient}")
    public ResponseEntity<ApiResponse> getGeneralAnamnesis(@PathVariable String cnpPatient){
        GeneralAnamnesis generalAnamnesis = generalAnamnesisService.getPatientGeneralAnamnesis(cnpPatient);
        if(generalAnamnesis.getIdGeneralAnamnesis()!=null){
            GeneralAnamnesisDto generalAnamnesisDto = new GeneralAnamnesisDto();
            generalAnamnesisDto.setCnp(cnpPatient);
            generalAnamnesisDto.setAllergies(generalAnamnesis.getAllergies());
            generalAnamnesisDto.setSmoker(generalAnamnesis.getSmoker());
            generalAnamnesisDto.setMedicalIntolerance(generalAnamnesis.getMedicalIntolerance());
            generalAnamnesisDto.setAlcoholConsumer(generalAnamnesis.getAlcoholConsumer());
            generalAnamnesisDto.setPreviousDentalProblems(generalAnamnesis.getPreviousDentalProblems());
            generalAnamnesisDto.setCoagulationProblems(generalAnamnesis.getCoagulationProblems());
            return ResponseEntity.ok(ApiResponse.success("Get general anamnesis succesfull", generalAnamnesisDto));
        }
        else{
            return ResponseEntity.ok(ApiResponse.success("No genereal anamnesis", null));
        }
    }

    @PutMapping("/update-general-anamnesis")
    public ResponseEntity<ApiResponse> updateGeneralAnamnesis(@RequestBody GeneralAnamnesisDto generalAnamnesisDto){
        generalAnamnesisService.updateGeneralAnamnesis(generalAnamnesisDto);
        return ResponseEntity.ok(ApiResponse.success("General Anamnesis updated", null));
    }
}
