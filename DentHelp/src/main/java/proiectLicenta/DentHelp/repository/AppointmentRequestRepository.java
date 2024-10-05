package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proiectLicenta.DentHelp.model.AppointmentRequest;

import java.util.Optional;

@Repository
public interface AppointmentRequestRepository extends JpaRepository<AppointmentRequest, Long> {

    Optional<AppointmentRequest> getAppointmentRequestByAppointmentRequestId(Long id);
}
