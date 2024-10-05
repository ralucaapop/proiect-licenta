package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proiectLicenta.DentHelp.model.AnamnesisAppointment;

import java.util.Optional;

@Repository
public interface AnamnesisAppointmentRepository extends JpaRepository<AnamnesisAppointment, Long> {

    public AnamnesisAppointment getAnamnesisAppointmentByAnamneseAppointmentId(Long id);
    public AnamnesisAppointment getAnamnesisAppointmentByAppointment_AppointmentId(Long id);
    Optional<AnamnesisAppointment> findByAppointment_AppointmentId(Long appointmentId);

}
