package proiectLicenta.DentHelp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.export.annotation.ManagedNotifications;
import proiectLicenta.DentHelp.model.UserRole;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDto {
    private String firstName;
    private String lastName;
    private String CNP;
    private String email;
    private String password;
    private String reTypePassword;
    private UserRole userRole;



}
