package proiectLicenta.DentHelp.service.impl;

import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import proiectLicenta.DentHelp.dto.XRayDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.XRay;
import proiectLicenta.DentHelp.repository.XRayRepository;
import proiectLicenta.DentHelp.service.PatientService;
import proiectLicenta.DentHelp.service.XRayService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;


@Service
public class XRayServiceImpl implements XRayService {

    @Autowired
    private final PatientService patientService;
    private final XRayRepository  xRayRepository;
    private final AzureBlobStorageService azureBlobStorageService;

    public XRayServiceImpl(PatientService patientService, XRayRepository xRayRepository, AzureBlobStorageService azureBlobStorageService) {
        this.patientService = patientService;
        this.xRayRepository = xRayRepository;
        this.azureBlobStorageService = azureBlobStorageService;
    }

    @Override
    public List<XRay> getPatientXrays(String patientCnp) {
        Patient patient = patientService.getPatient(patientCnp);
        List<Optional<XRay>> optionalXRays = xRayRepository.getXRayByPatient(patient);
        List<XRay> xrays = new ArrayList<>();
        for(Optional<XRay> optionalXRay: optionalXRays)
            xrays.add(optionalXRay.get());

        return xrays;
    }
    @Value("${azure.storage.connection-string}")
    private String connectionString;

    public XRay saveXRay(@RequestBody XRayDto xRayDto, MultipartFile file) throws IOException {
        Patient patient;
        patient = patientService.getPatient(xRayDto.getCnpPatient());


        String filePath = azureBlobStorageService.uploadFile(file);
        System.out.print(file);
        XRay xRay = new XRay();
        xRay.setDate(xRayDto.getDate());
        xRay.setPatient(patient);
        xRay.setFilePath(filePath);
        xRay.setObservations(xRayDto.getObservations());
        return xRayRepository.save(xRay);
    }

    @Override
    public XRay updateXRay(XRayDto xRayDto, Long xrayId, MultipartFile file) throws IOException {
        Optional<XRay> optionalXRay = xRayRepository.getXRayByXrayId(xrayId);
        XRay xRay;

        String filePath = "";
        if(file!=null) {
            filePath = azureBlobStorageService.uploadFile(file);
        }

        if(optionalXRay.isPresent()) {
            xRay = optionalXRay.get();
            xRay.setObservations(xRayDto.getObservations());
            if(file!=null)
                xRay.setFilePath(filePath);
            return xRayRepository.save(xRay);
        }
        return null;
    }

    @Override
    public XRay updateXRay(XRayDto xRayDto, Long xrayId) throws IOException {
        Optional<XRay> optionalXRay = xRayRepository.getXRayByXrayId(xrayId);
        XRay xRay;

        if(optionalXRay.isPresent()) {
            xRay = optionalXRay.get();
            xRay.setObservations(xRayDto.getObservations());
            return xRayRepository.save(xRay);
        }
        return null;
    }

}
