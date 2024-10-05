package proiectLicenta.DentHelp.service;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import proiectLicenta.DentHelp.dto.XRayDto;
import proiectLicenta.DentHelp.model.XRay;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface XRayService {
    public List<XRay> getPatientXrays(String patientCnp);
    public XRay saveXRay(@RequestBody XRayDto xRayDto, MultipartFile file) throws IOException;

    public XRay updateXRay(@RequestBody XRayDto xRayDto, @PathVariable Long xrayId, MultipartFile file) throws IOException;

    public XRay updateXRay(@RequestBody XRayDto xRayDto, @PathVariable Long xrayId) throws IOException;

}
