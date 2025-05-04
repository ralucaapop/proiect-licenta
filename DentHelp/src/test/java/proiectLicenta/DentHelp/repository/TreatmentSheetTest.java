package proiectLicenta.DentHelp.repository;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.TreatmentSheet;
import proiectLicenta.DentHelp.model.UserRole;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class TreatmentSheetTest {

    @Autowired
    private TreatmentSheetRepository treatmentSheetRepository;

    @Test
    public void TreatmentSheetRepository_SaveAll_ReturnSavedTreatmentSheet(){
        Patient p = new Patient("Ana","Maria","1234567890123","ana.maria@gmail.com","123","1234567890112", UserRole.PATIENT);
        Appointment app = new Appointment();
        app.setPatient(p);
        app.setStartDateHour("");
        app.setEndDateHour("");
        app.setAppointmentReason("no");
        TreatmentSheet treatmentSheet = TreatmentSheet.builder().appointment(app).
                appointmentObservations("no").recommendations("no").medication("no").
                build();

        TreatmentSheet savedTreatmentSheet = treatmentSheetRepository.save(treatmentSheet);
        Assertions.assertThat(savedTreatmentSheet).isNotNull();
        Assertions.assertThat(savedTreatmentSheet.getTreatmentNumber()).isGreaterThan(0);


    }

}
