package proiectLicenta.DentHelp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TreatmentSheetDto {
    private String appointmentObservations;
    private String recommendations;
    private String medication;
    private Long appointmentId;

}
