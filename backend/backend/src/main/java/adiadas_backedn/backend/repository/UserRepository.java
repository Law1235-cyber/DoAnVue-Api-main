package adiadas_backedn.backend.repository;

import adiadas_backedn.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {



    // Query tìm user bằng email
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);

    // Query kiểm tra email đã tồn tại
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.email = :email")
    boolean existsByEmail(@Param("email") String email);

    // Tìm user bằng email verification token
    @Query("SELECT u FROM User u WHERE u.emailVerificationToken = :token")
    Optional<User> findByEmailVerificationToken(@Param("token") String token);

    // Tìm user bằng password reset token
    @Query("SELECT u FROM User u WHERE u.passwordResetToken = :token")
    Optional<User> findByPasswordResetToken(@Param("token") String token);

    // Cập nhật trạng thái xác thực email - ĐÃ SỬA
    @Modifying
    @Query("UPDATE User u SET u.emailVerified = true, u.emailVerificationToken = NULL, u.emailVerificationExpires = NULL, u.updatedAt = :updatedAt WHERE u.id = :userId AND u.emailVerified = false")
    int verifyEmail(@Param("userId") String userId, @Param("updatedAt") LocalDateTime updatedAt);

    // Cập nhật mật khẩu và reset token (Phương thức cũ, không xác thực email)
    @Modifying
    @Query("UPDATE User u SET u.password = :newPassword, u.passwordResetToken = NULL, u.passwordResetExpires = NULL, u.passwordChangedAt = :changedAt, u.updatedAt = :changedAt WHERE u.id = :userId")
    int updatePassword(@Param("userId") String userId, @Param("newPassword") String newPassword, @Param("changedAt") LocalDateTime changedAt);

    // =========================================================================
    // PHƯƠNG THỨC MỚI: Cập nhật mật khẩu VÀ TỰ ĐỘNG XÁC THỰC EMAIL
    // Đã thêm: u.emailVerified = true
    @Modifying
    @Query("UPDATE User u SET u.password = :newPassword, u.passwordResetToken = NULL, u.passwordResetExpires = NULL, u.passwordChangedAt = :changedAt, u.emailVerified = true, u.updatedAt = :changedAt WHERE u.id = :userId")
    int updatePasswordAndVerifyEmail(@Param("userId") String userId, @Param("newPassword") String newPassword, @Param("changedAt") LocalDateTime changedAt);
    // =========================================================================

    // Cập nhật thông tin đăng nhập
    @Modifying
    @Query("UPDATE User u SET u.lastLogin = :lastLogin, u.loginAttempts = 0, u.accountLockedUntil = NULL, u.updatedAt = :lastLogin WHERE u.id = :userId")
    int updateLoginSuccess(@Param("userId") String userId, @Param("lastLogin") LocalDateTime lastLogin);

    // Cập nhật số lần đăng nhập thất bại
    @Modifying
    @Query("UPDATE User u SET u.loginAttempts = u.loginAttempts + 1, u.updatedAt = CURRENT_TIMESTAMP WHERE u.id = :userId")
    int incrementLoginAttempts(@Param("userId") String userId);

    // Khóa tài khoản
    @Modifying
    @Query("UPDATE User u SET u.accountLockedUntil = :lockUntil, u.updatedAt = CURRENT_TIMESTAMP WHERE u.id = :userId")
    int lockAccount(@Param("userId") String userId, @Param("lockUntil") LocalDateTime lockUntil);

    // Mở khóa tài khoản và reset số lần đăng nhập sai
    @Modifying
    @Query("UPDATE User u SET u.accountLockedUntil = NULL, u.loginAttempts = 0, u.updatedAt = CURRENT_TIMESTAMP WHERE u.id = :userId")
    int unlockAccount(@Param("userId") String userId);

    // Tìm user đã bật 2FA
    @Query("SELECT u FROM User u WHERE u.is2faEnabled = true")
    List<User> findUsersWith2faEnabled();

    // Cập nhật cài đặt 2FA
    @Modifying
    @Query("UPDATE User u SET u.is2faEnabled = :enabled, u.twoFactorSecret = :secret, u.updatedAt = CURRENT_TIMESTAMP WHERE u.id = :userId")
    int update2faSettings(@Param("userId") String userId, @Param("enabled") boolean enabled, @Param("secret") String secret);

    // Đếm số user theo trạng thái xác thực email
    @Query("SELECT COUNT(u) FROM User u WHERE u.emailVerified = :verified")
    long countByEmailVerified(@Param("verified") boolean verified);

    // Tìm admin users
    @Query("SELECT u FROM User u WHERE u.isAdmin = true")
    List<User> findAdminUsers();

    // Kiểm tra xem user có phải là admin không
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.id = :userId AND u.isAdmin = true")
    boolean isAdmin(@Param("userId") String userId);

    // Tìm user bằng tên (tìm kiếm gần đúng)
    @Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> findByNameContainingIgnoreCase(@Param("name") String name);

    // Xóa các verification token đã hết hạn
    @Modifying
    @Query("UPDATE User u SET u.emailVerificationToken = NULL, u.emailVerificationExpires = NULL, u.updatedAt = CURRENT_TIMESTAMP WHERE u.emailVerificationExpires < :now")
    int cleanupExpiredVerificationTokens(@Param("now") LocalDateTime now);

    // Xóa các password reset token đã hết hạn
    @Modifying
    @Query("UPDATE User u SET u.passwordResetToken = NULL, u.passwordResetExpires = NULL, u.updatedAt = CURRENT_TIMESTAMP WHERE u.passwordResetExpires < :now")
    int cleanupExpiredPasswordResetTokens(@Param("now") LocalDateTime now);

    // Tìm users có email chưa được xác thực và token đã hết hạn
    @Query("SELECT u FROM User u WHERE u.emailVerified = false AND u.emailVerificationExpires < :now")
    List<User> findExpiredEmailVerifications(@Param("now") LocalDateTime now);

    // Tìm users có password reset token đã hết hạn
    @Query("SELECT u FROM User u WHERE u.passwordResetToken IS NOT NULL AND u.passwordResetExpires < :now")
    List<User> findExpiredPasswordResetTokens(@Param("now") LocalDateTime now);

    // Tìm users bị khóa tài khoản (account_locked_until đã qua)
    @Query("SELECT u FROM User u WHERE u.accountLockedUntil IS NOT NULL AND u.accountLockedUntil < :now")
    List<User> findExpiredAccountLocks(@Param("now") LocalDateTime now);
}