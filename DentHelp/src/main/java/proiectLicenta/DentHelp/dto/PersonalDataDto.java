package proiectLicenta.DentHelp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class PersonalDataDto {
    private String addressStreet;
    private String addressNumber;
    private String addressCountry;
    private String addressRegion;
    private String phoneNumber;
    private String cnpPatient;
}
