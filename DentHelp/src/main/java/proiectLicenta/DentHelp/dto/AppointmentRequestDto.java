package proiectLicenta.DentHelp.dto;

import lombok.*;
import proiectLicenta.DentHelp.model.Patient;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AppointmentRequestDto {
    private String cnp;
    private String appointmentReason;
    private String desiredAppointmentTime;
    private Long appointmentRequestId;
    private String requestDate;
}
