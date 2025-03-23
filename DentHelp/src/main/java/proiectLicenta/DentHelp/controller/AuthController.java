package proiectLicenta.DentHelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import proiectLicenta.DentHelp.config.JwtService;
import proiectLicenta.DentHelp.dto.*;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.service.AuthService;
import proiectLicenta.DentHelp.utils.ApiResponse;
import proiectLicenta.DentHelp.utils.AuthenticationResponse;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping(path ="/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    @Autowired
    public AuthController(AuthService authService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody LoginDto loginDto) {
        Patient patient = authService.login(loginDto);
        String token = jwtService.generateToken(patient);
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );
        return AuthenticationResponse.builder()
                .token(token)
                .build();
        //return ResponseEntity.ok( .success("Welcome " + patient.getFirstName(), patient));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterDto registerDto) {
        authService.register(registerDto);
        return ResponseEntity.ok(ApiResponse.success("Code sent with success", null));
    }

    @PostMapping("/register/kid")
    public ResponseEntity<ApiResponse> registerKid(@RequestBody RegisterKidDto registerKidDto) {
        authService.registerKid(registerKidDto);
        return ResponseEntity.ok(ApiResponse.success("Kid saved", null));
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody ForgotPasswordDto forgotPasswordDto)
    {
        authService.forgotPassword(forgotPasswordDto);
        return ResponseEntity.ok(ApiResponse.success("The code for password resetting was sent", null));
    }

    @PostMapping("/forgot-password/send-verification-code")
    public ResponseEntity<ApiResponse> sendVerificationCode(@RequestBody EmailDto emailDto){
        authService.sendVerificationCodePC(emailDto);
        return ResponseEntity.ok(ApiResponse.success("The code was sent successfully", null));
    }

    @PutMapping("/changePassword")
    public ResponseEntity<ApiResponse> changePassword(@RequestBody ChangePasswordDto changePasswordDto){
        authService.changePassword(changePasswordDto);
        return ResponseEntity.ok(ApiResponse.success("The password was changed successfully", null));
    }

}
