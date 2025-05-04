package proiectLicenta.DentHelp.repository;


import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.ToothInterventionModel;
import proiectLicenta.DentHelp.model.ToothProblemModel;
import proiectLicenta.DentHelp.model.UserRole;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class ToothInterventionsTest {

    @Autowired
    ToothInterventionRepository toothInterventionRepository;

    @Test
    public void ToothInterventionRepository_SaveAll_ReturnSavedToothIntervention(){
        Patient p = new Patient("Ana","Maria","1234567890123","ana.maria@gmail.com","123","1234567890112", UserRole.PATIENT);

        ToothInterventionModel toothInterventionModel = ToothInterventionModel.builder().interventionDetails("no").
                toothNumber(12).
                dateIntervention("24.12.2024").
                build();

        ToothInterventionModel toothInterventionModelSaved = toothInterventionRepository.save(toothInterventionModel);

        Assertions.assertThat(toothInterventionModelSaved).isNotNull();
        Assertions.assertThat(toothInterventionModelSaved.getInterventionId()).isGreaterThan(0);
    }

}
