package proiectLicenta.DentHelp.service;

import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.GeneralAnamnesisDto;
import proiectLicenta.DentHelp.model.GeneralAnamnesis;

public interface GeneralAnamnesisService {
    public void saveGeneralAnamnesis(GeneralAnamnesisDto generalAnamnesisDto);
    public GeneralAnamnesis getPatientGeneralAnamnesis(String cnpPatient);

    public void updateGeneralAnamnesis(@RequestBody GeneralAnamnesisDto generalAnamnesisDto);
}
