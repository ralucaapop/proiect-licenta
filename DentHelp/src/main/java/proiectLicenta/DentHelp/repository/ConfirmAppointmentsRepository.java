package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proiectLicenta.DentHelp.model.AppointmentRequest;

@Repository
public interface ConfirmAppointmentsRepository extends JpaRepository<AppointmentRequest, Long> {
}
