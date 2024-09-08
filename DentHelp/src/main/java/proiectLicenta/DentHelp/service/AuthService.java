package proiectLicenta.DentHelp.service;

import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.dto.ChangePasswordDto;
import proiectLicenta.DentHelp.dto.ForgotPasswordDto;
import proiectLicenta.DentHelp.dto.LoginDto;
import proiectLicenta.DentHelp.dto.RegisterDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.VerificationAndRegisterData;
import proiectLicenta.DentHelp.model.VerificationAndResetPasswordData;
import proiectLicenta.DentHelp.utils.AuthenticationResponse;

public interface AuthService {
    Patient login(LoginDto loginDto);
    void register(RegisterDto registerDto);
    AuthenticationResponse registerAfterVerification(VerificationAndRegisterData verificationAndRegisterData);

    public Patient changePasswordAfterVerification(VerificationAndResetPasswordData verificationAndResetPasswordData);
    public Patient changePassword(@RequestBody ChangePasswordDto changePasswordDto);

    public void forgotPassword(@RequestBody ForgotPasswordDto forgotPasswordDto);
}
