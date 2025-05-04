package proiectLicenta.DentHelp.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import proiectLicenta.DentHelp.model.VerificationAndResetPasswordData;
import proiectLicenta.DentHelp.model.VerificationCodePasswordChanging;
import proiectLicenta.DentHelp.repository.VerificationCodeForgetPasswordRepository;
import proiectLicenta.DentHelp.service.impl.VerificationCodeForgotPasswordServiceImpl;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class VerificationCodeForgotPasswordServiceImplTest {

    private JavaMailSender mailSender;
    private VerificationCodeForgetPasswordRepository repository;
    private VerificationCodeForgotPasswordServiceImpl service;

    @BeforeEach
    void setUp() {
        mailSender = mock(JavaMailSender.class);
        repository = mock(VerificationCodeForgetPasswordRepository.class);
        service = new VerificationCodeForgotPasswordServiceImpl(repository);
        service.mailSender = mailSender;
        service.fromMsg = "test@domain.com";
    }

    @Test
    void testSendVerificationCode() {
        String email = "test@domain.com";

        service.sendVerificationCode(email);

        // Verificăm că un cod a fost salvat
        verify(repository).save(any(VerificationCodePasswordChanging.class));

        // Verificăm că a fost trimis un email
        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void testGenerateVerificationCode() {
        String code = service.generateVerificationCode();
        assertNotNull(code);
        assertEquals(6, code.length());
        assertTrue(code.matches("\\d{6}"));
    }

    @Test
    void testVerifyCode_Success() {
        String email = "user@example.com";
        String code = "123456";

        VerificationAndResetPasswordData data = new VerificationAndResetPasswordData();
        data.setEmail(email);
        data.setCode(code);

        VerificationCodePasswordChanging entity = new VerificationCodePasswordChanging();
        entity.setEmail(email);
        entity.setCode(code);
        entity.setExpirationTime(LocalDateTime.now().plusMinutes(10));

        when(repository.getVerificationCodePasswordChangingByEmail(email)).thenReturn(Optional.of(entity));

        boolean result = service.verifyCode(data);

        assertTrue(result);
        verify(repository).delete(entity);
    }

    @Test
    void testVerifyCode_WrongCode() {
        String email = "user@example.com";

        VerificationAndResetPasswordData data = new VerificationAndResetPasswordData();
        data.setEmail(email);
        data.setCode("wrongcode");

        VerificationCodePasswordChanging entity = new VerificationCodePasswordChanging();
        entity.setEmail(email);
        entity.setCode("correctcode");

        when(repository.getVerificationCodePasswordChangingByEmail(email)).thenReturn(Optional.of(entity));

        boolean result = service.verifyCode(data);

        assertFalse(result);
        verify(repository, never()).delete(any());
    }

    @Test
    void testVerifyCode_EmailNotFound() {
        String email = "nouser@example.com";

        VerificationAndResetPasswordData data = new VerificationAndResetPasswordData();
        data.setEmail(email);
        data.setCode("123456");

        when(repository.getVerificationCodePasswordChangingByEmail(email)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.verifyCode(data));
    }
}
