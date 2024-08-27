package proiectLicenta.DentHelp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChangePasswordDto {
    String newPassword;
    String email;
    String retypeNewPassword;
    String currentPassword;
}
