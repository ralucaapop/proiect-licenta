package proiectLicenta.DentHelp.dto;

import lombok.*;

@Data
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class PersonalDataDto {
    private String addressStreet;
    private String addressNumber;
    private String addressCountry;
    private String addressRegion;
    private String phoneNumber;
    private String cnpPatient;
    private String sex;
}
