package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proiectLicenta.DentHelp.model.AnamnesisAppointment;

@Repository
public interface AnamnesisAppointmentRepository extends JpaRepository<AnamnesisAppointment, Long> {

    public AnamnesisAppointment getAnamnesisAppointmentByAnamneseAppointmentId(Long id);
}
