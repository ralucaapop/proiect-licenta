package proiectLicenta.DentHelp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Table(name="medical_reports")
public class MedicalReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String treatmentDetails;
    private String medication;
    private String sterilizableInstruments;
    private String usedMaterials;
    private String date;
    private String hour;

    @OneToOne(cascade = CascadeType.ALL,  orphanRemoval = true)
    @JoinColumn(name = "fk_appointment_id", referencedColumnName = "appointmentId")
    private Appointment appointment;
}
