package proiectLicenta.DentHelp.model;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Setter
@Getter
@Builder
@Table(name="general-anamnesis")
public class GeneralAnamnesis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idGeneralAnamnesis;
    private String allergies;
    private String alcoholConsumer;
    private String smoker;
    private String coagulationProblems;
    private String medicalIntolerance;
    private String previousDentalProblems;

    @OneToOne
    @JoinColumn(name="fk_cnp")
    private Patient patinet;
}