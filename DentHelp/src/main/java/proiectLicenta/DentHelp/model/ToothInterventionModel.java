package proiectLicenta.DentHelp.model;


import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "teeth_interventions")
public class ToothInterventionModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long interventionId;
    private int toothNumber;
    private String isExtracted;
    @ManyToOne
    @JoinColumn(name="fk_cnp")
    private Patient patient;
    private String dateIntervention;
    private String interventionDetails;
}
