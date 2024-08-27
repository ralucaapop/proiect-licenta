package proiectLicenta.DentHelp.service;

import proiectLicenta.DentHelp.model.VerificationAndResetPasswordData;

public interface VerificationCodeForgotPasswordService {
        public void sendVerificationCode(String email);
        public boolean verifyCode(VerificationAndResetPasswordData verificationAndResetPasswordData);

}
