package proiectLicenta.DentHelp.service;

import proiectLicenta.DentHelp.dto.GeneralAnamnesisDto;
import proiectLicenta.DentHelp.model.GeneralAnamnesis;

public interface GeneralAnamnesisService {
    public GeneralAnamnesis saveGeneralAnamnesis(GeneralAnamnesisDto generalAnamnesisDto);
}
