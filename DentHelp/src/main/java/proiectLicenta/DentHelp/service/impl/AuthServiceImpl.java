package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import proiectLicenta.DentHelp.config.JwtService;
import proiectLicenta.DentHelp.dto.*;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.exceptions.ResourceNotFoundException;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.UserRole;
import proiectLicenta.DentHelp.model.VerificationAndRegisterData;
import proiectLicenta.DentHelp.model.VerificationAndResetPasswordData;
import proiectLicenta.DentHelp.repository.AuthRepository;
import proiectLicenta.DentHelp.repository.PatientRepository;
import proiectLicenta.DentHelp.service.AuthService;
import org.mindrot.jbcrypt.BCrypt;
import proiectLicenta.DentHelp.utils.AuthenticationResponse;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final PatientRepository patientRepository;
    private final VerificationServiceImpl verificationService;
    private final VerificationCodeForgotPasswordServiceImpl verificationCodeForgotPasswordService;

    private final JwtService jwtService;
    @Autowired
    public AuthServiceImpl(AuthRepository authRepository, PatientRepository patientRepository, VerificationServiceImpl verificationService, VerificationCodeForgotPasswordServiceImpl verificationCodeForgotPasswordService, JwtService jwtService) {
        this.authRepository = authRepository;
        this.patientRepository = patientRepository;
        this.verificationService = verificationService;
        this.verificationCodeForgotPasswordService = verificationCodeForgotPasswordService;
        this.jwtService = jwtService;
    }

    @Override
    public Patient login(@RequestBody LoginDto loginDto) {
        if (loginDto.getEmail() == null || loginDto.getEmail().isBlank()) {
            throw new BadRequestException("The email is not valid");
        }
        System.out.println("da");
        if (loginDto.getPassword() == null || loginDto.getPassword().isBlank()) {
            throw new BadRequestException("The password is not valid");
        }
        System.out.println("da");
        Optional<Patient> patientOptional = patientRepository.getPatientByEmail(loginDto.getEmail());
        patientOptional.orElseThrow(() ->
                new ResourceNotFoundException("The email is not registered"));

        boolean isMatch = BCrypt.checkpw(loginDto.getPassword(), patientOptional.get().getPassword());
        if (!isMatch) {
            throw new BadRequestException("Wrong password");
        }
        System.out.println("pa");
        return patientOptional.get();
    }


    public void register(@RequestBody RegisterDto registerDto) {
        System.out.print(registerDto.getFirstName());
        if (registerDto.getFirstName() == null || registerDto.getFirstName().isBlank()) {
            throw new BadRequestException("The first name is invalid");
        }
        if (registerDto.getLastName() == null || registerDto.getLastName().isBlank()) {
            throw new BadRequestException("The second name is invalid");
        }
        if (registerDto.getEmail() == null || registerDto.getEmail().isBlank()) {
            throw new BadRequestException("The email is invalid");
        }
        if (registerDto.getPassword() == null || registerDto.getPassword().isBlank()) {
            throw new BadRequestException("The password is invalid");
        }
        if (registerDto.getCNP() == null || registerDto.getCNP().isBlank() || registerDto.getCNP().length()!=13) {
            throw new BadRequestException("The CNP is invalid");
        }
        if (!registerDto.getPassword().equals(registerDto.getReTypePassword())) {
            throw new BadRequestException("Passwords not match");
        }

        Optional<Patient> patientOptional = patientRepository.getPatientByEmail(registerDto.getEmail());
        if (patientOptional.isPresent()) {
            throw new BadRequestException("Email already exists in db");
        }
        Optional<Patient> patientOptional1 = patientRepository.getPatientByCNP(registerDto.getCNP());
        if (patientOptional1.isPresent()) {
            throw new BadRequestException("CNP already exists in db");
        }
        this.verificationService.sendVerificationCode(registerDto.getEmail());
    }

    @Override
    public void registerKid(RegisterKidDto registerKidDto) {
        Optional<Patient> patientOptional1 = patientRepository.getPatientByCNP(registerKidDto.getCnp());
        if (patientOptional1.isPresent()) {
            throw new BadRequestException("CNP already exists in db");
        }
        Patient patient = new Patient();
        patient.setFirstName(registerKidDto.getFirstName());
        patient.setLastName(registerKidDto.getLastName());
        patient.setCNP(registerKidDto.getCnp());
        patient.setUserRole(UserRole.PATIENT);
        patient.setParent(registerKidDto.getParent());
        String password = BCrypt.hashpw("password", BCrypt.gensalt());
        patient.setPassword(password);
        patientRepository.save(patient);
    }

    @Override
    public AuthenticationResponse registerAfterVerification(VerificationAndRegisterData verificationAndRegisterData) {
        Patient patient = new Patient();
        patient.setFirstName(verificationAndRegisterData.getFirstName());
        patient.setEmail(verificationAndRegisterData.getEmail());
        patient.setLastName(verificationAndRegisterData.getLastName());
        patient.setCNP(verificationAndRegisterData.getCNP());
        patient.setUserRole(UserRole.PATIENT);
        patient.setParent(verificationAndRegisterData.getParent());
        String password = BCrypt.hashpw(verificationAndRegisterData.getPassword(), BCrypt.gensalt());
        patient.setPassword(password);

        authRepository.save(patient);
        var jwtToken = jwtService.generateToken(patient);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }


    public Patient changePassword(@RequestBody ChangePasswordDto changePasswordDto)
    {
        Optional<Patient> optionalPatient = patientRepository.getPatientByEmail(changePasswordDto.getEmail());
        Patient patient;
        if(optionalPatient.isPresent()){
            patient = optionalPatient.get();

            if(!changePasswordDto.getNewPassword().equals(changePasswordDto.getRetypeNewPassword()))
                throw new BadRequestException("The passwords do not match");


            boolean correctCurrentPassword = BCrypt.checkpw(changePasswordDto.getCurrentPassword(), patient.getPassword());
            if(!correctCurrentPassword)
                throw new BadRequestException("Wrong current password");

            String encryptedNewPassword = BCrypt.hashpw(changePasswordDto.getNewPassword(), BCrypt.gensalt());
            patient.setPassword(encryptedNewPassword);
            return patientRepository.save(patient);
        }
        else{
            throw new ResourceNotFoundException("There is no account associated with this email");
        }
    }


    // mai e de lucru
    public void forgotPassword(@RequestBody ForgotPasswordDto forgotPasswordDto){
        Optional<Patient> optionalPatient = patientRepository.getPatientByEmail(forgotPasswordDto.getEmail());
        Patient patient;
        if(optionalPatient.isPresent()) {
            patient = optionalPatient.get();

            if (!forgotPasswordDto.getNewPassword().equals(forgotPasswordDto.getRetypeNewPassword()))
                throw new BadRequestException("The passwords do not match");

            verificationCodeForgotPasswordService.sendVerificationCode(patient.getEmail());
        }
    }

    public Patient changePasswordAfterVerification(VerificationAndResetPasswordData verificationAndResetPasswordData){
        Optional<Patient> optionalPatient = patientRepository.getPatientByEmail(verificationAndResetPasswordData.getEmail());
        System.out.print(verificationAndResetPasswordData.getNewPassword());
        Patient patient;
        if(optionalPatient.isPresent()){
            patient = optionalPatient.get();
            String encryptedPassword = BCrypt.hashpw(verificationAndResetPasswordData.getNewPassword(), BCrypt.gensalt());

            patient.setPassword(encryptedPassword);
        }
        else{
            throw new ResourceNotFoundException("There is no account associated with this email");
        }
        return patientRepository.save(patient);

    }

    public void sendVerificationCodePC(@RequestBody EmailDto emailDto){
        Optional<Patient> optionalPatient = patientRepository.getPatientByEmail(emailDto.getEmail());
        Patient patient;
        if(optionalPatient.isPresent()) {
            patient = optionalPatient.get();
            verificationCodeForgotPasswordService.sendVerificationCode(patient.getEmail());
        }
    }

}
