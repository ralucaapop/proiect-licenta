package proiectLicenta.DentHelp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.model.VerificationAndResetPasswordData;
import proiectLicenta.DentHelp.service.VerificationCodeForgotPasswordService;
import proiectLicenta.DentHelp.service.impl.AuthServiceImpl;
import proiectLicenta.DentHelp.utils.ApiResponse;

import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class VerificationCodeForgotPasswordControllerTest {

    @Mock
    private VerificationCodeForgotPasswordService verificationService;

    @Mock
    private AuthServiceImpl authService;

    @InjectMocks
    private VerificationCodeForgotPasswordController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testResetPasswordAfterVerification_Successful() {
        VerificationAndResetPasswordData data = new VerificationAndResetPasswordData();

        when(verificationService.verifyCode(data)).thenReturn(true);

        ResponseEntity<ApiResponse> response = controller.resetPasswordAfterVerification(data);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("The password was successfully reset", response.getBody().getMessage());
        assertNull(response.getBody().getData());

        verify(verificationService).verifyCode(data);
        verify(authService).changePasswordAfterVerification(data);
    }

    @Test
    void testResetPasswordAfterVerification_IncorrectCode() {
        VerificationAndResetPasswordData data = new VerificationAndResetPasswordData();

        when(verificationService.verifyCode(data)).thenReturn(false);

        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            controller.resetPasswordAfterVerification(data);
        });

        assertEquals("Incorrect code", exception.getMessage());
        verify(verificationService).verifyCode(data);
        verify(authService, never()).changePasswordAfterVerification(any());
    }
}
