package proiectLicenta.DentHelp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import proiectLicenta.DentHelp.dto.RegisterDto;
import proiectLicenta.DentHelp.exceptions.BadRequestException;
import proiectLicenta.DentHelp.model.VerificationAndRegisterData;
import proiectLicenta.DentHelp.service.impl.AuthServiceImpl;
import proiectLicenta.DentHelp.service.impl.VerificationServiceImpl;
import proiectLicenta.DentHelp.utils.AuthenticationResponse;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class VerificationCodeControllerTest {

    @Mock
    private VerificationServiceImpl verificationService;

    @Mock
    private AuthServiceImpl authService;

    @InjectMocks
    private VerificationCodeController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterAfterVerification_SuccessfulVerification() {
        VerificationAndRegisterData input = new VerificationAndRegisterData();
        AuthenticationResponse expectedResponse = new AuthenticationResponse("mock-token");

        when(verificationService.verifyCode(input)).thenReturn(true);
        when(authService.registerAfterVerification(input)).thenReturn(expectedResponse);

        AuthenticationResponse response = controller.registerAfterVerification(input);

        assertNotNull(response);
        assertEquals("mock-token", response.getToken());
        verify(verificationService).verifyCode(input);
        verify(authService).registerAfterVerification(input);
    }

    @Test
    void testRegisterAfterVerification_IncorrectCode() {
        VerificationAndRegisterData input = new VerificationAndRegisterData();
        when(verificationService.verifyCode(input)).thenReturn(false);

        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            controller.registerAfterVerification(input);
        });

        assertEquals("Incorrect code", exception.getMessage());
        verify(verificationService).verifyCode(input);
        verify(authService, never()).registerAfterVerification(any());
    }
}
