package proiectLicenta.DentHelp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import proiectLicenta.DentHelp.model.VerificationAndRegisterData;
import proiectLicenta.DentHelp.model.VerificationCode;
import proiectLicenta.DentHelp.repository.VerificationCodeRepository;
import proiectLicenta.DentHelp.service.VerificationService;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class VerificationServiceImpl implements VerificationService {

    @Autowired
    public JavaMailSender mailSender;

    @Value("$(spring.mail.username)")
    public String fromMsg;
    private final VerificationCodeRepository verificationCodeRepository;
    @Autowired
    public VerificationServiceImpl(VerificationCodeRepository verificationCodeRepository){
        this.verificationCodeRepository = verificationCodeRepository;

    }
    @Override
    public void sendVerificationCode(String email) {
        String code = generateVerificationCode();
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setEmail(email);
        verificationCode.setCode(code);
        verificationCode.setExpirationTime(LocalDateTime.now().plusMinutes(10)); // Codul expiră în 10 minute
        verificationCodeRepository.save(verificationCode);
        sendEmail(email, code);
    }

    private void sendEmail(String email, String code) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromMsg);
        message.setTo(email);
        message.setSubject("Cod de verificare");
        message.setText("Codul tău de verificare este: " + code);
        mailSender.send(message);
    }

    @Override
    public String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);

    }


    public boolean verifyCode(VerificationAndRegisterData verificationAndRegisterData) {
        Optional<VerificationCode> optionalVerificationCode = verificationCodeRepository.getVerificationCodeByEmail(verificationAndRegisterData.getEmail());
        if (optionalVerificationCode.isPresent()) {
            VerificationCode verificationObjectFromDB = optionalVerificationCode.get();
            if (verificationAndRegisterData.getVerificationCode().equals(verificationObjectFromDB.getCode())) {
                verificationCodeRepository.delete(verificationObjectFromDB); // Șterge codul după verificare
                return true;
            }
        }
        return false;
    }
}
