package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proiectLicenta.DentHelp.model.Appointment;
import proiectLicenta.DentHelp.model.TreatmentSheet;

import java.util.Optional;

@Repository
public interface TreatmentSheetRepository extends JpaRepository<TreatmentSheet, Long> {

    public Optional<TreatmentSheet> getTreatmentSheetByTreatmentNumber(Long treatmentSheetNumber);
    public Optional<TreatmentSheet> getTreatmentSheetByAppointment(Appointment appointment);


}
