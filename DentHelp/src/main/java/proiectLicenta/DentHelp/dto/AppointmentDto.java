package proiectLicenta.DentHelp.dto;


import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AppointmentDto {
    private String appointmentReason;
    private String patientCnp;
    private String date;
    private String hour;
    private Long appointmentId;
}
