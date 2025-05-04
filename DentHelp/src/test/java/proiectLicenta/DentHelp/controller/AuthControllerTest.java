package proiectLicenta.DentHelp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import proiectLicenta.DentHelp.config.JwtService;
import proiectLicenta.DentHelp.dto.*;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.service.AuthService;
import proiectLicenta.DentHelp.utils.AuthenticationResponse;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private AuthenticationManager authenticationManager;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testLogin() throws Exception {
        LoginDto loginDto = new LoginDto("test@test.com", "password123");
        Patient patient = new Patient();
        patient.setEmail("test@test.com");

        when(authService.login(loginDto)).thenReturn(patient);
        when(jwtService.generateToken(patient)).thenReturn("jwt-token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"));

        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));
    }

    @Test
    void testRegister() throws Exception {
        RegisterDto registerDto = new RegisterDto();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Code sent with success"));

        verify(authService).register(registerDto);
    }

    @Test
    void testRegisterKid() throws Exception {
        RegisterKidDto kidDto = new RegisterKidDto();

        mockMvc.perform(post("/api/auth/register/kid")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(kidDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Kid saved"));

        verify(authService).registerKid(kidDto);
    }

    @Test
    void testForgotPassword() throws Exception {
        ForgotPasswordDto forgotPasswordDto = new ForgotPasswordDto();

        mockMvc.perform(post("/api/auth/forgotPassword")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(forgotPasswordDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("The code for password resetting was sent"));

        verify(authService).forgotPassword(forgotPasswordDto);
    }

    @Test
    void testSendVerificationCode() throws Exception {
        EmailDto emailDto = new EmailDto();
        emailDto.setEmail("test@test.com");

        mockMvc.perform(post("/api/auth/forgot-password/send-verification-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emailDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("The code was sent successfully"));

        verify(authService).sendVerificationCodePC(emailDto);
    }

    @Test
    void testChangePassword() throws Exception {
        ChangePasswordDto changePasswordDto = new ChangePasswordDto();

        mockMvc.perform(put("/api/auth/changePassword")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(changePasswordDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("The password was changed successfully"));

        verify(authService).changePassword(changePasswordDto);
    }
}
