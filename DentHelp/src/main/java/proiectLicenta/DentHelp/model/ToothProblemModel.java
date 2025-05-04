package proiectLicenta.DentHelp.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.bind.annotation.ModelAttribute;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "teeth_problems")
public class ToothProblemModel { @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long problemId;
    private int toothNumber;

    @ManyToOne
    @JoinColumn(name="fk_cnp")
    private Patient patient;
    private String dateProblem;
    private String problemDetails;
}
