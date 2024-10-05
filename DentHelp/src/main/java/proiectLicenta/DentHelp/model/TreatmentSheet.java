package proiectLicenta.DentHelp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TreatmentSheet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long treatmentNumber;
    private String appointmentObservations;
    private String recommendations;
    private String medication;

    @OneToOne
    @JoinColumn(name="fk_appointmentId")
    private Appointment appointment;
}
