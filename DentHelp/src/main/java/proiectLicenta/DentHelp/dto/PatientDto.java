package proiectLicenta.DentHelp.dto;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PatientDto {
    private String firstName;
    private String lastName;
    private String cnp;
    private String email;
    private String parent;
    private String userRole;
    private String password;
}
