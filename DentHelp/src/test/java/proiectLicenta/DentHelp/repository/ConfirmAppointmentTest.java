package proiectLicenta.DentHelp.repository;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class ConfirmAppointmentTest {

    @Autowired
    private ConfirmAppointmentsRepository confirmAppointmentsRepository;

    @Test
    public void ConfirmAppointmentRepository_SaveAll_ReturnAuthPatient(){



    }

}
