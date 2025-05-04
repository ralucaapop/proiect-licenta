package proiectLicenta.DentHelp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name="medical_reports")
public class MedicalReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String treatmentDetails;
    private String medication;
    private String date;
    private String hour;

    @OneToOne(cascade = CascadeType.ALL,  orphanRemoval = true)
    @JoinColumn(name = "fk_appointment_id", referencedColumnName = "appointmentId")
    private Appointment appointment;
}
