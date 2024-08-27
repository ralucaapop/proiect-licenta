package proiectLicenta.DentHelp.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MedicalReportDto {
    private String treatmentDetails;
    private String medication;
    private String sterilizableInstruments;
    private String usedMaterials;
    private Long appointment_id;
    private String date;
    private String hour;
}
