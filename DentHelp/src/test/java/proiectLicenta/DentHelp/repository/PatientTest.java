package proiectLicenta.DentHelp.repository;


import org.assertj.core.api.Assertions;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.UserRole;

import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class PatientTest {

    @Autowired
    private PatientRepository patientRepository;

    @Test
    public void PatientRepository_SaveAll_ReturnSavedPatient() {

        Patient p = Patient.builder().firstName("Ana").
                lastName("Maria").
                CNP("1234567890123").
                email("ana.maria@gmail.com").
                password("123").
                parent("1234567890112").
                userRole(UserRole.PATIENT).build();

        Patient savedPatient = patientRepository.save(p);
        Assertions.assertThat(savedPatient).isNotNull();
    }

    @Test
    public void PatientRepository_GetAll_ReturnAllPatients(){
        Patient p = Patient.builder().firstName("Ana").
                lastName("Maria").
                CNP("1234567890123").
                email("ana.maria@gmail.com").
                password("123").
                parent("1234567890112").
                userRole(UserRole.PATIENT).build();

        Patient p2 = Patient.builder().firstName("Ana").
                lastName("Maria").
                CNP("1234567899123").
                email("ana.mariaa@gmail.com").
                password("123").
                parent("1234567890112").
                userRole(UserRole.PATIENT).build();

        patientRepository.save(p);
        patientRepository.save(p2);

        List<Patient>patients = patientRepository.findAll();

        Assertions.assertThat(patients).isNotNull();
        Assertions.assertThat(patients.size()).isEqualTo(2);

    }

}
