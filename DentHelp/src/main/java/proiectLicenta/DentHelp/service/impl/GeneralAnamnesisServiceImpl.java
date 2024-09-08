package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proiectLicenta.DentHelp.dto.GeneralAnamnesisDto;
import proiectLicenta.DentHelp.model.GeneralAnamnesis;
import proiectLicenta.DentHelp.repository.GeneralAnamnesisRepository;
import proiectLicenta.DentHelp.service.GeneralAnamnesisService;

@Service
public class GeneralAnamnesisServiceImpl implements GeneralAnamnesisService {

    private final GeneralAnamnesisRepository generalAnamnesisRepository;

    @Autowired
    public GeneralAnamnesisServiceImpl(GeneralAnamnesisRepository generalAnamnesisRepository) {
        this.generalAnamnesisRepository = generalAnamnesisRepository;
    }

    @Override
    public GeneralAnamnesis saveGeneralAnamnesis(GeneralAnamnesisDto generalAnamnesisDto) {
        GeneralAnamnesis generalAnamnesis = new GeneralAnamnesis();
        generalAnamnesis.setAllergies(generalAnamnesisDto.getAllergies());
        generalAnamnesis.setSmoker(generalAnamnesisDto.getSmoker());
        generalAnamnesis.setAlcoholConsumer(generalAnamnesisDto.getAlcoholConsumer());
        generalAnamnesis.setPreviousDentalProblems(generalAnamnesisDto.getPreviousDentalProblems());
        generalAnamnesis.setMedicalIntolerance(generalAnamnesisDto.getMedicalIntolerance());
        generalAnamnesis.setCoagulationProblems(generalAnamnesisDto.getCoagulationProblems());
        generalAnamnesis.setCnp(generalAnamnesisDto.getCnp());
        return generalAnamnesisRepository.save(generalAnamnesis);
    }
}
