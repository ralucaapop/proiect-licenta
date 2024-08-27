package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import proiectLicenta.DentHelp.model.MedicalReport;

public interface MedicalReportRepository extends JpaRepository<MedicalReport, Long> {
}
