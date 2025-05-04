package proiectLicenta.DentHelp.repository;


import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.PatientPersonalData;
import proiectLicenta.DentHelp.model.UserRole;

import java.util.List;
import java.util.Optional;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class PatientPersonalDataTest {

    @Autowired
    private PatientPersonalDataRepository patientPersonalDataRepository;
    @Autowired
    private PatientRepository patientRepository;

    @Test
    public void PatientPersonalDataRepository_SaveAll_ReturnSavedPatientPersonalData(){
        Patient p = new Patient("Ana","Maria","1234567890123","ana.maria@gmail.com","123","1234567890112", UserRole.PATIENT);
        PatientPersonalData patientPersonalData = PatientPersonalData.builder().
                patient(p).
                sex("F").
                addressCountry("Romania").
                addressRegion("Timis").
                addressStreet("1").
                addressNumber("1").build();

        PatientPersonalData savedPatientPersonalData = patientPersonalDataRepository.save(patientPersonalData);
    }

    @Test
    public void PatientPersonalDataRepository_GetAll_ReturnAllPatientPersonalData(){
        Patient p = new Patient("Ana","Maria","1234567890123","ana.maria@gmail.com","123","1234567890112", UserRole.PATIENT);

        patientRepository.save(p);

        PatientPersonalData patientPersonalData = PatientPersonalData.builder().
                patient(p).
                sex("F").
                addressCountry("Romania").
                addressRegion("Timis").
                addressStreet("1").
                addressNumber("1").build();


        patientPersonalDataRepository.save(patientPersonalData);

        List<PatientPersonalData> patientPersonalDataList = patientPersonalDataRepository.findAll();

        Assertions.assertThat(patientPersonalDataList).isNotNull();
    }

    @Test
    public void PatientPersonalDataRepository_FindById_ReturnPatientPersonalDataById(){
        Patient p = new Patient("Ana","Maria","1234567890123","ana.maria@gmail.com","123","1234567890112", UserRole.PATIENT);

        patientRepository.save(p);

        PatientPersonalData patientPersonalData = PatientPersonalData.builder().
                patient(p).
                sex("F").
                addressCountry("Romania").
                addressRegion("Timis").
                addressStreet("1").
                addressNumber("1").build();


        patientPersonalDataRepository.save(patientPersonalData);

        PatientPersonalData patientPersonalDataFound = patientPersonalDataRepository.findById(patientPersonalData.getIdPersonalData()).get();

        Assertions.assertThat(patientPersonalDataFound).isNotNull();
    }

    @Test
    public void PatientPersonalDataRepository_FindByPatient_ReturnPatientPersonalDataByPatient(){
        Patient p = new Patient("Ana","Maria","1234567890123","ana.maria@gmail.com","123","1234567890112", UserRole.PATIENT);

        patientRepository.save(p);

        PatientPersonalData patientPersonalData = PatientPersonalData.builder().
                patient(p).
                sex("F").
                addressCountry("Romania").
                addressRegion("Timis").
                addressStreet("1").
                addressNumber("1").build();


        patientPersonalDataRepository.save(patientPersonalData);

        PatientPersonalData patientPersonalDataFound = patientPersonalDataRepository.getPatientPersonalDataByPatient(p).get();

        Assertions.assertThat(patientPersonalDataFound).isNotNull();
    }


}
