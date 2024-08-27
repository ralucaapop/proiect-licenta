package proiectLicenta.DentHelp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@ToString
@Table(name="verification_codes_passwords")
public class VerificationCodePasswordChanging {

    @Id
    private String email;
    private String code;
    private LocalDateTime expirationTime;

}
