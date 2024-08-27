package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.GeneralAnamnesisDto;
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

    @PostMapping
    public ResponseEntity<ApiResponse> saveGeneralAnamnesis(@RequestBody GeneralAnamnesisDto generalAnamnesisDto){
        generalAnamnesisService.saveGeneralAnamnesis(generalAnamnesisDto);
        return ResponseEntity.ok(ApiResponse.success("General anamnesis saved with success", null));
    }
}
