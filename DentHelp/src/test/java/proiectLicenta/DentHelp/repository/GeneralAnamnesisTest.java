package proiectLicenta.DentHelp.repository;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import proiectLicenta.DentHelp.model.GeneralAnamnesis;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.PatientPersonalData;
import proiectLicenta.DentHelp.model.UserRole;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class GeneralAnamnesisTest {

    @Autowired
    private GeneralAnamnesisRepository generalAnamnesisRepository;

    @Test
    public void GeneralAnamnesisRepository_SaveAll_ReturnGeneralAnamnesis(){
        Patient p = new Patient("Ana","Maria","1234567890123","ana.maria@gmail.com","123","1234567890112", UserRole.PATIENT);
        GeneralAnamnesis generalAnamnesis = GeneralAnamnesis.builder().patinet(p).
                alcoholConsumer("false").
                smoker("false").
                allergies("Capsune").
                medicalIntolerance("no").
                coagulationProblems("false").previousDentalProblems("no").build();

        GeneralAnamnesis generalAnamnesisSaved = generalAnamnesisRepository.save(generalAnamnesis);

        Assertions.assertThat(generalAnamnesisSaved).isNotNull();
        Assertions.assertThat(generalAnamnesisSaved.getIdGeneralAnamnesis()).isGreaterThan(0);
    }

}
