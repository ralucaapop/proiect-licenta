package proiectLicenta.DentHelp.repository;


import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import proiectLicenta.DentHelp.model.AppointmentRequest;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.UserRole;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class AppointmentRequestTest {

    @Autowired
    AppointmentRequestRepository appointmentRequestRepository;

    @Test
    public void AppointmentRequestRepository_SaveAll_ReturnSavedAppRequest(){
        Patient p = new Patient("Ana","Maria","1234567890123","ana.maria@gmail.com","123","1234567890112", UserRole.PATIENT);
        AppointmentRequest appointmentRequest = AppointmentRequest.builder().appointmentReason("durere masea").
                requestDate("26.12.2023").desiredAppointmentTime("").patient(p).build();

        AppointmentRequest appointmentRequest1 = appointmentRequestRepository.save(appointmentRequest);
        Assertions.assertThat(appointmentRequest1).isNotNull();
    }
}
