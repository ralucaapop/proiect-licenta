package proiectLicenta.DentHelp.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class VerificationAndRegisterData {
    private String firstName;
    private String lastName;
    private String CNP;
    private String parent;
    private String email;
    private String password;
    private String verificationCode;
}
