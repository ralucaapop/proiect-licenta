package proiectLicenta.DentHelp.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ToothInterventionDto {
    private Long interventionId;
    private int toothNumber;
    private String patientCnp;
    private String isExtracted;
    private String dateIntervention;
    private String interventionDetails;
}
