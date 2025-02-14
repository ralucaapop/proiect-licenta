package proiectLicenta.DentHelp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PatientUpdateDto {
        private String firstName;
        private String lastName;
        private String allergies;
        private String alcoholConsumer;
        private String smoker;
        private String coagulationProblems;
        private String medicalIntolerance;
        private String previousDentalProblems;
}
