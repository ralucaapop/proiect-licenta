package proiectLicenta.DentHelp.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import proiectLicenta.DentHelp.model.VerificationAndRegisterData;
import proiectLicenta.DentHelp.model.VerificationCode;
import proiectLicenta.DentHelp.repository.VerificationCodeRepository;
import proiectLicenta.DentHelp.service.impl.VerificationServiceImpl;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class VerificationServiceImplTest {

    private JavaMailSender mailSender;
    private VerificationCodeRepository codeRepository;
    private VerificationServiceImpl service;

    @BeforeEach
    void setUp() {
        mailSender = mock(JavaMailSender.class);
        codeRepository = mock(VerificationCodeRepository.class);
        service = new VerificationServiceImpl(codeRepository);
        service.mailSender = mailSender;
        service.fromMsg = "clinic@domain.com";
    }

    @Test
    void testSendVerificationCode() {
        String email = "user@domain.com";

        service.sendVerificationCode(email);

        verify(codeRepository).save(any(VerificationCode.class));

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
        String email = "test@example.com";
        String code = "123456";

        VerificationAndRegisterData data = new VerificationAndRegisterData();
        data.setEmail(email);
        data.setVerificationCode(code);

        VerificationCode codeEntity = new VerificationCode();
        codeEntity.setEmail(email);
        codeEntity.setCode(code);

        when(codeRepository.getVerificationCodeByEmail(email)).thenReturn(Optional.of(codeEntity));

        boolean result = service.verifyCode(data);

        assertTrue(result);
        verify(codeRepository).delete(codeEntity);
    }

    @Test
    void testVerifyCode_WrongCode() {
        String email = "test@example.com";

        VerificationAndRegisterData data = new VerificationAndRegisterData();
        data.setEmail(email);
        data.setVerificationCode("000000");

        VerificationCode codeEntity = new VerificationCode();
        codeEntity.setEmail(email);
        codeEntity.setCode("123456");

        when(codeRepository.getVerificationCodeByEmail(email)).thenReturn(Optional.of(codeEntity));

        boolean result = service.verifyCode(data);

        assertFalse(result);
        verify(codeRepository, never()).delete(any());
    }

    @Test
    void testVerifyCode_CodeNotFound() {
        String email = "missing@example.com";

        VerificationAndRegisterData data = new VerificationAndRegisterData();
        data.setEmail(email);
        data.setVerificationCode("000000");

        when(codeRepository.getVerificationCodeByEmail(email)).thenReturn(Optional.empty());

        boolean result = service.verifyCode(data);

        assertFalse(result);
        verify(codeRepository, never()).delete(any());
    }
}
