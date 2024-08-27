package proiectLicenta.DentHelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.model.VerificationCodePasswordChanging;

import java.util.Optional;

@Repository
public interface VerificationCodeForgetPasswordRepository extends JpaRepository<VerificationCodePasswordChanging, String> {

    Optional<VerificationCodePasswordChanging> getVerificationCodePasswordChangingByEmail(String email);

}
