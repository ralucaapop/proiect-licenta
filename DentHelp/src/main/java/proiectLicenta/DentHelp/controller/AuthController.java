package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.dto.ChangePasswordDto;
import proiectLicenta.DentHelp.dto.ForgotPasswordDto;
import proiectLicenta.DentHelp.dto.LoginDto;
import proiectLicenta.DentHelp.dto.RegisterDto;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.service.AuthService;
import proiectLicenta.DentHelp.utils.ApiResponse;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping(path ="/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public  ResponseEntity<ApiResponse> login(@RequestBody LoginDto loginDto) {
        Patient patient = authService.login(loginDto);
        return ResponseEntity.ok(ApiResponse.success("Welcome " + patient.getFirstName(), patient));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterDto registerDto) {
        authService.register(registerDto);
        return ResponseEntity.ok(ApiResponse.success("Registered with success", null));
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody ForgotPasswordDto forgotPasswordDto)
    {
        authService.forgotPassword(forgotPasswordDto);
        return ResponseEntity.ok(ApiResponse.success("The code for password resetting was sent", null));
    }

    @PutMapping("/changePassword")
    public ResponseEntity<ApiResponse> changePassword(@RequestBody ChangePasswordDto changePasswordDto){
        authService.changePassword(changePasswordDto);
        return ResponseEntity.ok(ApiResponse.success("The password was changed successfully", null));
    }

}
