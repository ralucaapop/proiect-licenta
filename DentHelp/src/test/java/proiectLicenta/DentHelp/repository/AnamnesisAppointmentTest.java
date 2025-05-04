package proiectLicenta.DentHelp.repository;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import proiectLicenta.DentHelp.model.*;

import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class AnamnesisAppointmentTest {

    @Autowired
    private AnamnesisAppointmentRepository anamnesisAppointmentRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Test
    public void AnamnesisRepository_SaveAll_ReturnSavedAnamnesis(){


        Patient p = new Patient("Ana","Maria","1234567890123","ana.maria@gmail.com","123","1234567890112", UserRole.PATIENT);
        Appointment app = new Appointment();
        app.setPatient(p);
        app.setStartDateHour("");
        app.setEndDateHour("");
        app.setAppointmentReason("no");
        MedicalReport medicalReport = new MedicalReport();
        medicalReport.setAppointment(app);
        TreatmentSheet treatmentSheet = new TreatmentSheet();
        treatmentSheet.setAppointment(app);
        AnamnesisAppointment anamnesisAppointment = AnamnesisAppointment.builder()
                .appointmentReason("Control").
                pregnancy("false").
                currentSymptoms("no").
                currentMedication("no").appointment(app).
                build();

        AnamnesisAppointment savedAnamensis = anamnesisAppointmentRepository.save(anamnesisAppointment);

        Assertions.assertThat(savedAnamensis).isNotNull();
        Assertions.assertThat(savedAnamensis.getAnamneseAppointmentId()).isGreaterThan(0);
    }

    @Test
    public void AnamnesisRepository_GetAll_ReturnAnamesis(){

        Patient p = Patient.builder().firstName("Ana").
                lastName("Maria").
                CNP("1234567890123").
                email("ana.maria@gmail.com").
                password("123").
                parent("1234567890112").
                userRole(UserRole.PATIENT).build();

        patientRepository.save(p);


        Appointment app = new Appointment();
        app.setPatient(p);
        app.setStartDateHour("");
        app.setEndDateHour("");
        app.setAppointmentReason("no");
        MedicalReport medicalReport = new MedicalReport();
        medicalReport.setAppointment(app);
        TreatmentSheet treatmentSheet = new TreatmentSheet();
        treatmentSheet.setAppointment(app);

        AnamnesisAppointment anamnesisAppointment = AnamnesisAppointment.builder()
                .appointmentReason("Control").
                pregnancy("false").
                currentSymptoms("no").
                currentMedication("no").appointment(app).
                build();




        Appointment app1 = new Appointment();
        app.setPatient(p);
        app.setStartDateHour("");
        app.setEndDateHour("");
        app.setAppointmentReason("no");
        MedicalReport medicalReport1 = new MedicalReport();
        medicalReport.setAppointment(app1);
        TreatmentSheet treatmentSheet1 = new TreatmentSheet();
        treatmentSheet.setAppointment(app1);

        AnamnesisAppointment anamnesisAppointment1 = AnamnesisAppointment.builder()
                .appointmentReason("Control").
                pregnancy("false").
                currentSymptoms("no").
                currentMedication("no").appointment(app1).
                build();


        appointmentRepository.save(app);
        appointmentRepository.save(app1);

        anamnesisAppointmentRepository.save(anamnesisAppointment);
        anamnesisAppointmentRepository.save(anamnesisAppointment1);


        List<AnamnesisAppointment>anameesisApp = anamnesisAppointmentRepository.findAll();

        //Assert
        Assertions.assertThat(anameesisApp).isNotNull();
    }


}
