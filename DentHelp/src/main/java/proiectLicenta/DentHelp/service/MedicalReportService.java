package proiectLicenta.DentHelp.service;

import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.MedicalReportDto;
import proiectLicenta.DentHelp.model.MedicalReport;

public interface MedicalReportService {
    public MedicalReport addNewMedicalReport(@RequestBody MedicalReportDto medicalReportDto);

}
