package proiectLicenta.DentHelp.service;

import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.TreatmentSheetDto;
import proiectLicenta.DentHelp.model.TreatmentSheet;

import java.util.Optional;

@Service
public interface TreatmentSheetService {

    public TreatmentSheet getTreatmentSheet(Long appointmentId);
    public int saveTreatmentSheet(@RequestBody TreatmentSheetDto treatmentSheetDto);

    public void updateTreatmentSheet(@RequestBody TreatmentSheetDto treatmentSheetDto);
}
