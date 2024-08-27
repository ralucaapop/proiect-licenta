package proiectLicenta.DentHelp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GeneralAnamnesisDto {
    private String cnp;
    private String allergies;
    private String alcoholConsumer;
    private String smoker;
    private String coagulationProblems;
    private String medicalIntolerance;
    private String previousDentalProblems;
}
