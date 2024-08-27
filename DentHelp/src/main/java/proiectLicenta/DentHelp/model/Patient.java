package proiectLicenta.DentHelp.model;

import jakarta.persistence.*;
import lombok.*;

@ToString
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Patient {

    private String firstName;
    private String lastName;
    @Id
    private String CNP;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name ="fk_id_personal_data")
    private PatientPersonalData patientPersonalData;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name ="fk_id_general_anamnesis")
    private GeneralAnamnesis generalAnamnesis;

    public Patient(String email, String password) {
        this.email = email;
        this.password = password;
    }
}
