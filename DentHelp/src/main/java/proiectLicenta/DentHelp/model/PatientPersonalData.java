package proiectLicenta.DentHelp.model;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Getter
@Setter
@Builder
@Table(name = "patient_personal_data")
public class PatientPersonalData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPersonalData;
    private String addressStreet;
    private String addressNumber;
    private String addressCountry;
    private String addressRegion;
    private String phoneNumber;
    private String sex;

    @OneToOne
    @JoinColumn(name="fk_cnp")
    private Patient patient;
}
