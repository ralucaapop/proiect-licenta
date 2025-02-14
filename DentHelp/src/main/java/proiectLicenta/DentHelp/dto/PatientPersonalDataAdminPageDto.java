package proiectLicenta.DentHelp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PatientPersonalDataAdminPageDto {
    private String addressStreet;
    private String addressNumber;
    private String addressCountry;
    private String addressRegion;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private String cnp;
    private String email;
    private String sex;
}
