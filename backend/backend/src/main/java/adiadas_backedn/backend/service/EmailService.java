package adiadas_backedn.backend.service;

import adiadas_backedn.backend.model.User;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // LỖI: CHỈ IN RA CONSOLE, KHÔNG GỬI EMAIL THẬT
    public void sendVerificationEmail(User user) {
        String verificationLink = "http://localhost:8080/verify-email?token=" + user.getEmailVerificationToken();

        System.out.println("=== VERIFICATION EMAIL ===");
        System.out.println("To: " + user.getEmail());
        System.out.println("Subject: Xác thực tài khoản Adidas");
        System.out.println("Link: " + verificationLink);
        System.out.println("Token: " + user.getEmailVerificationToken());
        System.out.println("Expires: " + user.getEmailVerificationExpires());
        System.out.println("==========================");
        // CHỈ IN RA CONSOLE, KHÔNG GỬI EMAIL THẬT
    }

    // LỖI: CHỈ IN RA CONSOLE, KHÔNG GỬI EMAIL THẬT
    public void sendPasswordResetEmail(User user) {
        String resetLink = "http://localhost:8080/reset-password?token=" + user.getPasswordResetToken();

        System.out.println("=== PASSWORD RESET EMAIL ===");
        System.out.println("To: " + user.getEmail());
        System.out.println("Subject: Đặt lại mật khẩu Adidas");
        System.out.println("Link: " + resetLink);
        System.out.println("Token: " + user.getPasswordResetToken());
        System.out.println("Expires: " + user.getPasswordResetExpires());
        System.out.println("============================");
        // CHỈ IN RA CONSOLE, KHÔNG GỬI EMAIL THẬT
    }
}