package proiectLicenta.DentHelp.controller;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import proiectLicenta.DentHelp.dto.XRayDto;
import proiectLicenta.DentHelp.dto.XRayRequest;
import proiectLicenta.DentHelp.model.XRay;
import proiectLicenta.DentHelp.service.XRayService;
import proiectLicenta.DentHelp.service.impl.AzureBlobStorageService;
import proiectLicenta.DentHelp.utils.ApiResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/patient/xray")
public class XRayController {

    private final XRayService xRayService;
    private final AzureBlobStorageService azureBlobStorageService;

    @Autowired
    public XRayController(XRayService xRayService, AzureBlobStorageService azureBlobStorageService) {
        this.xRayService = xRayService;
        this.azureBlobStorageService = azureBlobStorageService;
    }

    @GetMapping("/get-patient-xrays/{patientCnp}")
    public ResponseEntity<ApiResponse>getPatientXray(@PathVariable String patientCnp){
        List<XRay> xrays = xRayService.getPatientXrays(patientCnp);
        return ResponseEntity.ok(ApiResponse.success("xrays list",xrays));
    }

    @PostMapping("/save-xray")
    public ResponseEntity<ApiResponse> saveXray(
            @RequestParam("date") String date,
            @RequestParam("observations") String observations,
            @RequestParam("cnpPatient") String cnpPatient,
            @RequestParam("file") MultipartFile file) {
        try {
            XRayDto xRayDto = new XRayDto();
            xRayDto.setCnpPatient(cnpPatient);
            xRayDto.setDate(date);
            xRayDto.setObservations(observations);
            xRayService.saveXRay(xRayDto, file);
            return ResponseEntity.ok(ApiResponse.success("X-Ray saved successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error(403, "Failed to save X-Ray"));
        }
    }


    @PutMapping("/update-xray/{xrayId}")
    public ResponseEntity<ApiResponse>updateXray(@RequestParam("observations") String observations, @RequestParam(value = "file", required = false) MultipartFile file, @PathVariable Long xrayId) throws IOException {

        System.out.print(file);
        XRayDto xRayDto = new XRayDto();
        xRayDto.setXrayId(xrayId);
        xRayDto.setObservations(observations);
        if (file != null && !file.isEmpty()) {
            if(xRayService.updateXRay(xRayDto, xrayId,file)!=null)
                return ResponseEntity.ok(ApiResponse.success("xray successfully updated", null));
        }
        else{
            if(xRayService.updateXRay(xRayDto, xrayId)!=null)
                return ResponseEntity.ok(ApiResponse.success("xray successfully updated", null));
        }

        return ResponseEntity.ok(ApiResponse.success("this xray does not exist", null));

    }

}
