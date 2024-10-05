package proiectLicenta.DentHelp.dto;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import proiectLicenta.DentHelp.model.Patient;

import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class XRayDto {
    private Long xrayId;
    private String date;
    private String filePath;
    private String observations;
    private String cnpPatient;
}
