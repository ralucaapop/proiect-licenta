package proiectLicenta.DentHelp.dto;

import com.azure.core.annotation.Get;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Base64;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class XRayRequest {
    private String date;
    private String observations;
    private String filePath; // Aceasta este un Base64
    private String cnpPatient;


    // Getters și Setters



    public XRayDto toXRayDto(String filePath) {
        XRayDto dto = new XRayDto();
        dto.setObservations(this.observations);
        dto.setCnpPatient(this.cnpPatient);
        dto.setDate(this.date);
        dto.setFilePath(filePath); // Aici setezi calea fișierului
        return dto;
    }
}


