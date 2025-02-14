package proiectLicenta.DentHelp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ToothProblemDto {
    private Long problemId;
    private int toothNumber;
    private String patientCnp;
    private String dateProblem;
    private String problemDetails;
}
