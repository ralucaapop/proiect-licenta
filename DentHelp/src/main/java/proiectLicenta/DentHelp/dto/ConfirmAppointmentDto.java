package proiectLicenta.DentHelp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ConfirmAppointmentDto {
    String cnpPatient;
    String startDateHour;
    String endDateHour;
    String appointmentReason;
    Long appointmentRequestId;
}


