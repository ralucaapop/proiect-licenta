package proiectLicenta.DentHelp.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
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
