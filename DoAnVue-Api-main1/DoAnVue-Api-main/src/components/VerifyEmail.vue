<template>
  <div class="verify-email-container">
    <div class="verify-email-card">
      <!-- Loading state -->
      <div v-if="loading" class="loading-section">
        <div class="spinner"></div>
        <p class="loading-text">Đang xác thực email...</p>
      </div>

      <!-- Success state -->
      <div v-else-if="success" class="success-section">
        <div class="success-icon">✓</div>
        <h2 class="success-title">Xác Thực Thành Công!</h2>
        <p class="success-message">{{ message }}</p>
        <div class="action-buttons">
          <button @click="goToLogin" class="btn btn-primary">Đăng Nhập Ngay</button>
          <button @click="goToHome" class="btn btn-secondary">Về Trang Chủ</button>
        </div>
      </div>

      <!-- Error state -->
      <div v-else class="error-section">
        <div class="error-icon">✗</div>
        <h2 class="error-title">Xác Thực Thất Bại</h2>
        <p class="error-message">{{ message }}</p>
        <div class="action-buttons">
          <button @click="resendVerification" class="btn btn-primary" :disabled="resendLoading">
            {{ resendLoading ? 'Đang gửi...' : 'Gửi Lại Email Xác Thực' }}
          </button>
          <button @click="goToHome" class="btn btn-secondary">Về Trang Chủ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

// Tạo instance axios cho API
const api = axios.create({
  baseURL: 'http://localhost:8082/api', // Backend URL - điều chỉnh nếu cần
  timeout: 10000,
});

export default {
  name: 'VerifyEmail',
  data() {
    return {
      loading: true,
      success: false,
      message: '',
      email: '',
      resendLoading: false
    };
  },
  async mounted() {
    await this.verifyEmail();
  },
  methods: {
    async verifyEmail() {
      try {
        this.loading = true;
        
        // Lấy token từ URL query parameters
        const token = this.$route.query.token;
        
        if (!token) {
          throw new Error('Token xác thực không tồn tại');
        }

        console.log('Verifying email with token:', token);
        
        // Gọi API xác thực email trực tiếp
        const response = await api.get(`/auth/verify-email?token=${token}`);
        
        if (response.data.success) {
          this.success = true;
          this.message = response.data.message || 'Email của bạn đã được xác thực thành công. Bạn có thể đăng nhập ngay bây giờ.';
        } else {
          throw new Error(response.data.message || 'Xác thực thất bại');
        }
        
      } catch (error) {
        console.error('Email verification error:', error);
        this.success = false;
        this.message = this.getErrorMessage(error);
        
        // Lấy email từ error response hoặc từ thông báo lỗi
        this.extractEmailFromError(error);
      } finally {
        this.loading = false;
      }
    },

    async resendVerification() {
      if (!this.email) {
        alert('Không thể xác định email. Vui lòng thử đăng ký lại.');
        return;
      }

      try {
        this.resendLoading = true;
        const response = await api.post(`/auth/resend-verification?email=${this.email}`);
        
        if (response.data.success) {
          alert('Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.');
        } else {
          alert(response.data.message || 'Gửi lại email thất bại');
        }
      } catch (error) {
        console.error('Resend verification error:', error);
        alert('Có lỗi xảy ra khi gửi lại email xác thực');
      } finally {
        this.resendLoading = false;
      }
    },

    getErrorMessage(error) {
      if (error.response && error.response.data) {
        return error.response.data.message || error.response.data.error || 'Có lỗi xảy ra khi xác thực email';
      }
      return error.message || 'Có lỗi xảy ra khi xác thực email';
    },

    extractEmailFromError(error) {
      // Cố gắng trích xuất email từ thông báo lỗi
      const errorMessage = error.response?.data?.message || error.message || '';
      const emailMatch = errorMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        this.email = emailMatch[0];
      }
      
      // Nếu không tìm thấy email trong message, thử lấy từ URL hoặc state khác
      if (!this.email) {
        // Có thể lưu email trong localStorage hoặc query parameter khác
        const savedEmail = localStorage.getItem('pendingVerificationEmail');
        if (savedEmail) {
          this.email = savedEmail;
        }
      }
    },

    goToLogin() {
      this.$router.push('/auth');
    },

    goToHome() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.verify-email-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.verify-email-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.loading-section {
  padding: 40px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 18px;
  color: #666;
  margin: 0;
}

.success-section,
.error-section {
  padding: 20px 0;
}

.success-icon,
.error-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  margin: 0 auto 20px;
}

.success-icon {
  background: #d4edda;
  color: #155724;
  border: 3px solid #c3e6cb;
}

.error-icon {
  background: #f8d7da;
  color: #721c24;
  border: 3px solid #f5c6cb;
}

.success-title,
.error-title {
  margin-bottom: 15px;
  color: #333;
}

.success-title {
  color: #155724;
}

.error-title {
  color: #721c24;
}

.success-message,
.error-message {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 30px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  min-width: 140px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsive */
@media (max-width: 576px) {
  .verify-email-card {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>