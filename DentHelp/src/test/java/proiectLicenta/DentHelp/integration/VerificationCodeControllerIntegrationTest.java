package proiectLicenta.DentHelp.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import proiectLicenta.DentHelp.model.VerificationCode;
import proiectLicenta.DentHelp.repository.VerificationCodeRepository;
import proiectLicenta.DentHelp.dto.RegisterDto;
import proiectLicenta.DentHelp.model.VerificationAndRegisterData;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class VerificationCodeControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private VerificationCodeRepository verificationCodeRepository;

    private final String email = "testregister@denthelp.com";
    private final String validCode = "123456";

    @BeforeEach
    public void setup() {
        // Salvăm un cod valid în baza de date pentru emailul de test
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setEmail(email);
        verificationCode.setCode(validCode);
        verificationCode.setExpirationTime(LocalDateTime.now().plusMinutes(10));
        verificationCodeRepository.save(verificationCode);
    }

    @Test
    public void testRegisterAfterVerification_ShouldSucceedWithValidCode() throws Exception {
        VerificationAndRegisterData data = new VerificationAndRegisterData();
        data.setEmail(email);
        data.setVerificationCode(validCode);

        RegisterDto registerDto = new RegisterDto();
        data.setFirstName("Test");
        data.setLastName("User");
        data.setEmail(email);
        data.setPassword("password123");
        data.setCNP("1991234567890");
        mockMvc.perform(post("/api/auth/register/verification")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(data)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    public void testRegisterAfterVerification_ShouldFailWithInvalidCode() throws Exception {
        VerificationAndRegisterData data = new VerificationAndRegisterData();
        data.setEmail(email);
        data.setVerificationCode("000000"); // Cod invalid

        data.setFirstName("Test");
        data.setLastName("User");
        data.setEmail(email);
        data.setPassword("password123");
        data.setCNP("1991234567890");


        mockMvc.perform(post("/api/auth/register/verification")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(data)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Incorrect code"));
    }
}
