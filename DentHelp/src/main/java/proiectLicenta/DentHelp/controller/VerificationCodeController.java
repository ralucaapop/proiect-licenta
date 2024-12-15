package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.config.JwtService;
import proiectLicenta.DentHelp.dto.RegisterDto;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.UserRole;
import proiectLicenta.DentHelp.model.VerificationAndRegisterData;
import proiectLicenta.DentHelp.model.VerificationCode;
import proiectLicenta.DentHelp.service.impl.AuthServiceImpl;
import proiectLicenta.DentHelp.service.impl.VerificationServiceImpl;
import proiectLicenta.DentHelp.utils.ApiResponse;
import proiectLicenta.DentHelp.utils.AuthenticationResponse;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping(path ="/api/auth/register")
public class VerificationCodeController {

    private final VerificationServiceImpl verificationService;
    private final AuthServiceImpl authService;
    @Autowired
    public VerificationCodeController(VerificationServiceImpl verificationService, AuthServiceImpl authService) {
        this.verificationService = verificationService;
        this.authService = authService;
    }

    @PostMapping("/verification")
    public AuthenticationResponse registerAfterVerification(@RequestBody VerificationAndRegisterData verificationAndRegisterData) {
        boolean correctCode = verificationService.verifyCode(verificationAndRegisterData);
        if (correctCode) {
            System.out.print("gasit");
            return authService.registerAfterVerification(verificationAndRegisterData);
            //return ResponseEntity.ok(ApiResponse.success("Registered with success", null));
        }
        throw new BadRequestException("Incorrect code");
    }
}
