package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.XRay;

import java.util.List;
import java.util.Optional;

@Repository
public interface XRayRepository extends JpaRepository<XRay, Long> {

    public Optional<XRay> getXRayByXrayId(Long xrayId);
    public List<Optional<XRay>> getXRayByPatient(Patient patient);
}
