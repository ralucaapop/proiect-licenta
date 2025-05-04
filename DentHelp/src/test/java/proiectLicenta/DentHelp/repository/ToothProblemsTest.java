package proiectLicenta.DentHelp.repository;


import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.web.client.AutoConfigureWebClient;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.ToothProblemModel;
import proiectLicenta.DentHelp.model.UserRole;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class ToothProblemsTest {

    @Autowired
    private ToothProblemRepository toothProblemRepository;

    @Test
    public void ToothProblemRepository_SaveAll_SavedToothProblem(){
        Patient p = new Patient("Ana","Maria","1234567890123","ana.maria@gmail.com","123","1234567890112", UserRole.PATIENT);

        ToothProblemModel toothProblemModel = ToothProblemModel.builder().problemDetails("carie").
                toothNumber(12).
                dateProblem("24.12.2024").
                build();

        ToothProblemModel toothProblemModelSaved = toothProblemRepository.save(toothProblemModel);

        Assertions.assertThat(toothProblemModelSaved).isNotNull();
        Assertions.assertThat(toothProblemModelSaved.getProblemId()).isGreaterThan(0);

    }

}
