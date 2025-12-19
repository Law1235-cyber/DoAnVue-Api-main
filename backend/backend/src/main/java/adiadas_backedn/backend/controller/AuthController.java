package adiadas_backedn.backend.controller;

import adiadas_backedn.backend.model.User;
import adiadas_backedn.backend.repository.UserRepository;
import adiadas_backedn.backend.service.AuthService;
import adiadas_backedn.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:8080", "http://127.0.0.1:8080"},
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Tạo class DTO đơn giản để nhận login request
    public static class LoginRequest {
        private String email;
        private String password;

        // Constructor mặc định (QUAN TRỌNG)
        public LoginRequest() {}

        // Getters và Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    @GetMapping("/redirect-reset-password")
    public ResponseEntity<?> redirectToResetPassword(@RequestParam String token) {
        try {
            System.out.println("=== REDIRECT TO RESET PASSWORD ===");
            System.out.println("Token: " + token);

            Optional<User> userOpt = authService.findByPasswordResetToken(token);

            Map<String, Object> response = new HashMap<>();
            if (userOpt.isPresent()) {
                User user = userOpt.get();

                if (user.getPasswordResetExpires() != null &&
                        user.getPasswordResetExpires().isAfter(LocalDateTime.now())) {

                    String frontendUrl = "http://localhost:8080/reset-password?token=" + token;
                    response.put("success", true);
                    response.put("redirectUrl", frontendUrl);
                    response.put("message", "Redirecting to reset password page");

                    System.out.println("Redirecting to: " + frontendUrl);
                } else {
                    response.put("success", false);
                    response.put("message", "Token đã hết hạn");
                }
            } else {
                response.put("success", false);
                response.put("message", "Token không hợp lệ");
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("REDIRECT ERROR: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi chuyển hướng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            System.out.println("=== REGISTER REQUEST ===");
            System.out.println("Name: " + user.getName());
            System.out.println("Email: " + user.getEmail());

            User newUser = authService.register(user);

            // 🔥 GIỮ XÁC THỰC EMAIL KHI ĐĂNG KÝ
            emailService.sendVerificationEmail(newUser);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.");
            response.put("user", Map.of(
                    "id", newUser.getId(),
                    "name", newUser.getName(),
                    "email", newUser.getEmail()
            ));

            System.out.println("=== REGISTER SUCCESS ===");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("REGISTER ERROR: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    // 🔥 BỎ XÁC THỰC EMAIL KHI ĐĂNG NHẬP
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("=== LOGIN REQUEST RECEIVED ===");
            System.out.println("Email: " + loginRequest.getEmail());
            System.out.println("Password: " + (loginRequest.getPassword() != null ? "***" : "NULL"));

            // Validation
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                System.out.println("VALIDATION ERROR: Email is empty");
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email không được để trống");
                return ResponseEntity.badRequest().body(response);
            }

            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                System.out.println("VALIDATION ERROR: Password is empty");
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Mật khẩu không được để trống");
                return ResponseEntity.badRequest().body(response);
            }

            String email = loginRequest.getEmail().trim().toLowerCase();
            String password = loginRequest.getPassword().trim();

            System.out.println("Calling authService.login with email: " + email);

            // Gọi service và trả về trực tiếp kết quả
            Map<String, Object> loginResult = authService.login(email, password);

            System.out.println("Login service result - Success: " + loginResult.get("success"));
            System.out.println("Login service result - Message: " + loginResult.get("message"));
            System.out.println("Full login result: " + loginResult);

            // 🔥 BỎ HOÀN TOÀN KIỂM TRA XÁC THỰC EMAIL KHI ĐĂNG NHẬP
            if (Boolean.TRUE.equals(loginResult.get("success"))) {
                System.out.println("✅ LOGIN SUCCESSFUL for user: " + email);
                return ResponseEntity.ok(loginResult);
            } else {
                System.out.println("❌ LOGIN FAILED: " + loginResult.get("message"));
                return ResponseEntity.badRequest().body(loginResult);
            }

        } catch (Exception e) {
            System.out.println("❌ LOGIN CONTROLLER EXCEPTION: " + e.getMessage());
            System.out.println("Exception type: " + e.getClass().getName());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi server: " + e.getMessage());
            response.put("exceptionType", e.getClass().getName());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verify2fa(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");

            Map<String, Object> result = authService.verify2fa(email, code);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi xác thực 2FA: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            boolean sent = authService.forgotPassword(email);

            Map<String, Object> response = new HashMap<>();
            if (sent) {
                response.put("success", true);
                response.put("message", "Email đặt lại mật khẩu đã được gửi");
            } else {
                response.put("success", false);
                response.put("message", "Email không tồn tại");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi gửi email: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/verify-reset-token")
    public ResponseEntity<?> verifyResetToken(@RequestParam String token) {
        try {
            Optional<User> userOpt = authService.findByPasswordResetToken(token);

            Map<String, Object> response = new HashMap<>();
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (user.getPasswordResetExpires() != null &&
                        user.getPasswordResetExpires().isAfter(LocalDateTime.now())) {
                    response.put("success", true);
                    response.put("message", "Token hợp lệ");
                    response.put("email", user.getEmail());
                } else {
                    response.put("success", false);
                    response.put("message", "Token đã hết hạn");
                }
            } else {
                response.put("success", false);
                response.put("message", "Token không hợp lệ");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi xác thực token: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            System.out.println("=== RESET PASSWORD REQUEST ===");
            System.out.println("Request data: " + request);

            String token = request.get("token");
            String newPassword = request.get("newPassword");

            if (token == null || token.trim().isEmpty()) {
                System.out.println("RESET PASSWORD ERROR: Token is empty");
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Token không được để trống");
                return ResponseEntity.badRequest().body(response);
            }

            if (newPassword == null || newPassword.trim().isEmpty()) {
                System.out.println("RESET PASSWORD ERROR: New password is empty");
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Mật khẩu mới không được để trống");
                return ResponseEntity.badRequest().body(response);
            }

            if (newPassword.length() < 6) {
                System.out.println("RESET PASSWORD ERROR: Password too short");
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Mật khẩu phải có ít nhất 6 ký tự");
                return ResponseEntity.badRequest().body(response);
            }

            boolean reset = authService.resetPassword(token, newPassword);

            Map<String, Object> response = new HashMap<>();
            if (reset) {
                response.put("success", true);
                response.put("message", "Đặt lại mật khẩu thành công");
            } else {
                response.put("success", false);
                response.put("message", "Token không hợp lệ hoặc đã hết hạn");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("RESET PASSWORD CONTROLLER ERROR: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi đặt lại mật khẩu: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        System.out.println("=== CHECK EMAIL: " + email + " ===");
        boolean exists = authService.findByEmail(email).isPresent();

        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);

        return ResponseEntity.ok(response);
    }

    // 🔥 GIỮ CÁC ENDPOINT XÁC THỰC EMAIL CHO ĐĂNG KÝ
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {
            System.out.println("=== VERIFY EMAIL REQUEST ===");
            System.out.println("Token: " + token);

            boolean verified = authService.verifyEmail(token);

            Map<String, Object> response = new HashMap<>();
            if (verified) {
                System.out.println("EMAIL VERIFICATION SUCCESS");
                response.put("success", true);
                response.put("message", "Email đã được xác thực thành công");
            } else {
                System.out.println(" EMAIL VERIFICATION FAILED");
                response.put("success", false);
                response.put("message", "Token không hợp lệ hoặc đã hết hạn");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("VERIFY EMAIL ERROR: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi xác thực email: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationEmail(@RequestParam String email) {
        try {
            System.out.println("=== RESEND VERIFICATION REQUEST ===");
            System.out.println("Email: " + email);

            Optional<User> userOpt = authService.findByEmail(email);

            Map<String, Object> response = new HashMap<>();
            if (userOpt.isPresent()) {
                User user = userOpt.get();

                if (Boolean.TRUE.equals(user.getEmailVerified())) {
                    response.put("success", false);
                    response.put("message", "Email đã được xác thực trước đó");
                } else {
                    user.setEmailVerificationToken(UUID.randomUUID().toString());
                    user.setEmailVerificationExpires(LocalDateTime.now().plusHours(24));
                    user.setUpdatedAt(LocalDateTime.now());
                    userRepository.save(user);

                    emailService.sendVerificationEmail(user);

                    response.put("success", true);
                    response.put("message", "Email xác thực đã được gửi lại");
                }
            } else {
                response.put("success", false);
                response.put("message", "Email không tồn tại");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("RESEND VERIFICATION ERROR: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi gửi lại email xác thực: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}