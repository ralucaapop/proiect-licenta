package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.model.VerificationAndRegisterData;
import proiectLicenta.DentHelp.model.VerificationAndResetPasswordData;
import proiectLicenta.DentHelp.service.AppointmentRequestService;
import proiectLicenta.DentHelp.service.VerificationCodeForgotPasswordService;
import proiectLicenta.DentHelp.service.impl.AuthServiceImpl;
import proiectLicenta.DentHelp.utils.ApiResponse;

@RestController
@CrossOrigin
@RequestMapping(path ="/api/auth/forgot-password")

public class VerificationCodeForgotPasswordController {
    private final VerificationCodeForgotPasswordService verificationCodeForgotPasswordService;
    private final AuthServiceImpl authService;

    public VerificationCodeForgotPasswordController(VerificationCodeForgotPasswordService verificationCodeForgotPasswordService, AuthServiceImpl authService) {
        this.verificationCodeForgotPasswordService = verificationCodeForgotPasswordService;
        this.authService = authService;
    }

    @PostMapping("/ver-code")
    public ResponseEntity<ApiResponse> resetPasswordAfterVerification(@RequestBody VerificationAndResetPasswordData verificationAndResetPasswordData) {
        boolean correctCode = verificationCodeForgotPasswordService.verifyCode(verificationAndResetPasswordData);
        if (correctCode) {
            System.out.print("gasit");
            authService.changePasswordAfterVerification(verificationAndResetPasswordData);
            return ResponseEntity.ok(ApiResponse.success("The password was successfully reset", null));
        }
        throw new BadRequestException("Incorrect code");
    }
}
