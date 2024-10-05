package proiectLicenta.DentHelp.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="xrays")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class XRay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long xrayId;
    private String date;
    private String filePath;
    private String observations;
    @ManyToOne
    @JoinColumn(name="fk_cnp")
    private Patient patient;
}
