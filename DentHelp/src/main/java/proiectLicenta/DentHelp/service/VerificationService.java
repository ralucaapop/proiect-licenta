package proiectLicenta.DentHelp.service;

import proiectLicenta.DentHelp.model.VerificationAndRegisterData;
import proiectLicenta.DentHelp.model.VerificationCode;

public interface VerificationService {
    public void sendVerificationCode(String email);
    public String generateVerificationCode();
    public boolean verifyCode(VerificationAndRegisterData verificationCode);
}
