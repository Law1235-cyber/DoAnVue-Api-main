package adiadas_backedn.backend.service;

import adiadas_backedn.backend.model.User;
import adiadas_backedn.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@Validated
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Transactional
    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        // 🔥 SỬA: Không mã hóa password, lưu plain text
        // user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Giữ nguyên password (plain text)

        user.setId(generateRandomId());
        user.setIsAdmin(false);
        user.setEmailVerified(false);
        user.setLoginAttempts(0);
        user.setEmailVerificationToken(generateToken());
        user.setEmailVerificationExpires(LocalDateTime.now().plusHours(24));

        return userRepository.save(user);
    }

    @Transactional
    public boolean verifyEmail(String token) {
        try {
            System.out.println("=== VERIFY EMAIL SERVICE START ===");
            System.out.println("Token: " + token);

            Optional<User> userOpt = userRepository.findByEmailVerificationToken(token);

            if (userOpt.isEmpty()) {
                System.out.println("VERIFY EMAIL ERROR: User not found for token");
                return false;
            }

            User user = userOpt.get();
            System.out.println("User found: " + user.getEmail());
            System.out.println("Current verified status: " + user.getEmailVerified());
            System.out.println("Token expires: " + user.getEmailVerificationExpires());

            if (Boolean.TRUE.equals(user.getEmailVerified())) {
                System.out.println("Email already verified");
                return true;
            }

            if (user.getEmailVerificationExpires() == null ||
                    user.getEmailVerificationExpires().isBefore(LocalDateTime.now())) {
                System.out.println("VERIFY EMAIL ERROR: Token expired");
                return false;
            }

            int updatedRows = userRepository.verifyEmail(user.getId(), LocalDateTime.now());

            boolean success = updatedRows > 0;
            System.out.println("=== VERIFY EMAIL " + (success ? "SUCCESS" : "FAILED") + " ===");

            return success;

        } catch (Exception e) {
            System.out.println("VERIFY EMAIL EXCEPTION: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    @Transactional
    public Map<String, Object> login(String email, String password) {
        Map<String, Object> result = new HashMap<>();

        System.out.println("=== AUTH SERVICE LOGIN START ===");
        System.out.println("Email: " + email);

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            System.out.println("LOGIN ERROR: Email not found in database");
            result.put("success", false);
            result.put("message", "Email hoặc mật khẩu không đúng");
            return result;
        }

        User user = userOpt.get();
        System.out.println("User found: " + user.getEmail());
        System.out.println("Password in DB: " + user.getPassword());
        System.out.println("Email verified: " + user.getEmailVerified());
        System.out.println("Account locked until: " + user.getAccountLockedUntil());

        if (user.getAccountLockedUntil() != null &&
                user.getAccountLockedUntil().isAfter(LocalDateTime.now())) {
            System.out.println("LOGIN ERROR: Account is locked");
            result.put("success", false);
            result.put("message", "Tài khoản tạm thời bị khóa. Vui lòng thử lại sau.");
            return result;
        }

        // 🔥 SỬA: So sánh plain text password
        boolean passwordMatches = user.getPassword().equals(password);
        System.out.println("Password matches: " + passwordMatches);

        if (!passwordMatches) {
            System.out.println("LOGIN ERROR: Wrong password");
            userRepository.incrementLoginAttempts(user.getId());

            User updatedUser = userRepository.findById(user.getId()).orElse(user);
            System.out.println("Login attempts after increment: " + updatedUser.getLoginAttempts());

            if (updatedUser.getLoginAttempts() >= 5) {
                userRepository.lockAccount(user.getId(), LocalDateTime.now().plusMinutes(30));
                System.out.println("ACCOUNT LOCKED for 30 minutes");

                result.put("success", false);
                result.put("message", "Tài khoản đã bị khóa 30 phút do đăng nhập sai nhiều lần");
                return result;
            }

            result.put("success", false);
            result.put("message", "Email hoặc mật khẩu không đúng");
            result.put("remainingAttempts", 5 - updatedUser.getLoginAttempts());
            return result;
        }

        // Auto-verify email nếu chưa
        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            System.out.println("🔄 Auto-verifying email for user: " + user.getEmail());
            user.setEmailVerified(true);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            System.out.println("✅ Email auto-verified for: " + user.getEmail());
        }

        // Reset số lần đăng nhập sai
        user.setLoginAttempts(0);
        user.setAccountLockedUntil(null);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        System.out.println("✅ LOGIN SUCCESS for user: " + user.getEmail());

        result.put("success", true);
        result.put("message", "Đăng nhập thành công");
        result.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "isAdmin", user.getIsAdmin(),
                "emailVerified", true
        ));
        result.put("requires2fa", user.getIs2faEnabled());

        return result;
    }

    public Map<String, Object> verify2fa(String email, String code) {
        Map<String, Object> result = new HashMap<>();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            result.put("success", false);
            result.put("message", "User không tồn tại");
            return result;
        }

        User user = userOpt.get();

        if (user.getIs2faEnabled() && user.getTwoFactorSecret() != null) {
            boolean isValid = validate2FACode(user.getTwoFactorSecret(), code);
            if (!isValid) {
                result.put("success", false);
                result.put("message", "Mã xác thực không đúng");
                return result;
            }
        }

        result.put("success", true);
        result.put("message", "Xác thực 2FA thành công");
        result.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "isAdmin", user.getIsAdmin()
        ));

        return result;
    }

    private boolean validate2FACode(String secret, String code) {
        return code != null && code.matches("\\d{6}");
    }

    @Transactional
    public boolean forgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            user.setPasswordResetToken(generateToken());
            user.setPasswordResetExpires(LocalDateTime.now().plusHours(1));
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            emailService.sendPasswordResetEmail(user);

            return true;
        }

        return false;
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        try {
            System.out.println("=== RESET PASSWORD START ===");
            System.out.println("Token: " + token);

            Optional<User> userOpt = userRepository.findByPasswordResetToken(token);

            if (userOpt.isEmpty()) {
                System.out.println("RESET PASSWORD ERROR: User not found for token");
                return false;
            }

            User user = userOpt.get();
            System.out.println("User found: " + user.getEmail());

            if (user.getPasswordResetExpires() == null ||
                    user.getPasswordResetExpires().isBefore(LocalDateTime.now())) {
                System.out.println("RESET PASSWORD ERROR: Token expired");
                System.out.println("Token expires: " + user.getPasswordResetExpires());
                System.out.println("Current time: " + LocalDateTime.now());
                return false;
            }

            if (newPassword == null || newPassword.trim().isEmpty()) {
                System.out.println("RESET PASSWORD ERROR: New password is empty");
                return false;
            }

            if (newPassword.length() < 6) {
                System.out.println("RESET PASSWORD ERROR: Password too short");
                return false;
            }

            // 🔥 SỬA: Không mã hóa password, lưu plain text
            user.setPassword(newPassword.trim());
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            System.out.println("RESET PASSWORD SUCCESS for: " + user.getEmail());
            return true;

        } catch (Exception e) {
            System.out.println("RESET PASSWORD EXCEPTION: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByPasswordResetToken(String token) {
        return userRepository.findByPasswordResetToken(token);
    }

    private String generateToken() {
        return UUID.randomUUID().toString();
    }

    private String generateRandomId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }
}