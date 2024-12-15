package proiectLicenta.DentHelp.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AdminNotificationsDto {
    private String observations;
    private String date;
    private String patientCnp;
}
