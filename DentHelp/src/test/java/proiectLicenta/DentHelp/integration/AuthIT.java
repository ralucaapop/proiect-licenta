package proiectLicenta.DentHelp.integration;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import proiectLicenta.DentHelp.controller.AuthController;
import proiectLicenta.DentHelp.dto.*;
import proiectLicenta.DentHelp.model.Patient;
import proiectLicenta.DentHelp.model.UserRole;
import proiectLicenta.DentHelp.service.AuthService;
import proiectLicenta.DentHelp.utils.ApiResponse;
import proiectLicenta.DentHelp.utils.AuthenticationResponse;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class AuthIT {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testRegister() throws Exception {
        RegisterDto registerDto = new RegisterDto("John", "Doe", "john@example.com", "password", "password", "1234567890123", UserRole.PATIENT);

        doNothing().when(authService).register(registerDto);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isOk());
    }

    @Test
    void testRegisterKid() throws Exception {
        RegisterKidDto registerKidDto = new RegisterKidDto("John", "Doe", "1234567890123", "parentEmail");

        doNothing().when(authService).registerKid(registerKidDto);

        mockMvc.perform(post("/api/auth/register/kid")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerKidDto)))
                .andExpect(status().isOk());
    }

    @Test
    void testForgotPassword() throws Exception {
        ForgotPasswordDto forgotPasswordDto = new ForgotPasswordDto("test@test.com","newPassword", "newPassword");

        doNothing().when(authService).forgotPassword(forgotPasswordDto);

        mockMvc.perform(post("/api/auth/forgotPassword")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(forgotPasswordDto)))
                .andExpect(status().isOk());}

    @Test
    void testSendVerificationCode() throws Exception {
        EmailDto emailDto = new EmailDto("test@test.com");

        doNothing().when(authService).sendVerificationCodePC(emailDto);

        mockMvc.perform(post("/api/auth/forgot-password/send-verification-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emailDto)))
                .andExpect(status().isOk());
    }

    @Test
    void testChangePassword() throws Exception {
        ChangePasswordDto changePasswordDto = new ChangePasswordDto("test@test.com", "oldPassword", "newPassword", "newPassword");

        authService.changePassword(changePasswordDto);

        mockMvc.perform(put("/api/auth/changePassword")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(changePasswordDto)))
                .andExpect(status().isOk());
    }
}
