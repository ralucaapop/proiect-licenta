package proiectLicenta.DentHelp.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class AnamnesisAppointmentDto {
    private String appointmentReason;
    private String currentMedication;
    private String recentMedication;
    private String pregnancy;
    private String currentSymptoms;
    private Long appointmentId;
}
