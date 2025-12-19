<template>
  <div class="reset-password-wrapper">
    <div class="reset-password-container">
      <div class="logo">
        <h2>🔐 Đặt Lại Mật Khẩu</h2>
      </div>

      <!-- Form đặt lại mật khẩu -->
      <div v-if="tokenValid && !success" class="reset-form">
        <form @submit.prevent="resetPassword">
          <div class="form-group">
            <label>Email</label>
            <input 
              v-model="userEmail" 
              type="email" 
              disabled 
              class="disabled-input"
            />
          </div>
          
          <div class="form-group">
            <label>Mật khẩu mới</label>
            <input 
              v-model="newPassword" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Nhập mật khẩu mới" 
              required
              minlength="6"
              @input="validatePassword"
            />
            <div class="password-actions">
              <small class="password-hint">Mật khẩu ít nhất 6 ký tự</small>
              <button 
                type="button" 
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Xác nhận mật khẩu</label>
            <input 
              v-model="confirmPassword" 
              :type="showConfirmPassword ? 'text' : 'password'" 
              placeholder="Nhập lại mật khẩu mới" 
              required
              @input="validatePassword"
            />
            <div class="password-actions">
              <small class="password-hint">Nhập lại mật khẩu để xác nhận</small>
              <button 
                type="button" 
                class="toggle-password"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- Password strength indicator -->
          <div v-if="newPassword" class="password-strength">
            <div class="strength-bar" :class="passwordStrength"></div>
            <small class="strength-text">{{ strengthText }}</small>
          </div>

          <!-- Password match indicator -->
          <div v-if="confirmPassword && newPassword" class="password-match">
            <span :class="passwordsMatch ? 'match-success' : 'match-error'">
              {{ passwordsMatch ? '✅ Mật khẩu khớp' : '❌ Mật khẩu không khớp' }}
            </span>
          </div>

          <button 
            type="submit" 
            :disabled="loading || !isFormValid" 
            class="submit-btn"
            :class="{ 'disabled': loading || !isFormValid }"
          >
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu' }}
          </button>
        </form>
      </div>

      <!-- Thông báo thành công -->
      <div v-if="success" class="success-message">
        <div class="success-icon">✅</div>
        <h3>Đặt Lại Mật Khẩu Thành Công!</h3>
        <p>Mật khẩu của bạn đã được thay đổi thành công.</p>
        <p class="redirect-text">Bạn sẽ được chuyển hướng sau {{ countdown }} giây...</p>
        <router-link to="/login" class="login-link">
          ← Quay lại đăng nhập ngay
        </router-link>
      </div>

      <!-- Thông báo token không hợp lệ -->
      <div v-if="tokenInvalid" class="error-message">
        <div class="error-icon">❌</div>
        <h3>Link Đặt Lại Mật Khẩu Không Hợp Lệ</h3>
        <p>Link này đã hết hạn hoặc không tồn tại.</p>
        <div class="action-buttons">
          <router-link to="/forgot-password" class="forgot-link">
            Gửi lại email đặt lại mật khẩu
          </router-link>
          <router-link to="/login" class="login-link">
            Quay lại đăng nhập
          </router-link>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading && !tokenValid && !tokenInvalid" class="loading">
        <div class="loading-spinner large"></div>
        <p>Đang kiểm tra link...</p>
      </div>

      <!-- Hiển thị lỗi -->
      <div v-if="error && !tokenInvalid" class="error-message">
        <span class="error-icon">⚠️</span>
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const token = ref('');
const tokenValid = ref(false);
const tokenInvalid = ref(false);
const userEmail = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref(false);
const countdown = ref(5);

const API_BASE_URL = 'http://localhost:8082/api/auth';

// Computed properties
const passwordsMatch = computed(() => {
  return newPassword.value === confirmPassword.value && newPassword.value.length >= 6;
});

const passwordStrength = computed(() => {
  const password = newPassword.value;
  if (!password) return '';
  if (password.length < 6) return 'weak';
  if (password.length < 8) return 'medium';
  if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
    return 'strong';
  }
  return 'medium';
});

const strengthText = computed(() => {
  switch (passwordStrength.value) {
    case 'weak': return 'Mật khẩu yếu';
    case 'medium': return 'Mật khẩu trung bình';
    case 'strong': return 'Mật khẩu mạnh';
    default: return '';
  }
});

const isFormValid = computed(() => {
  return newPassword.value.length >= 6 && 
         confirmPassword.value.length >= 6 && 
         passwordsMatch.value;
});

// Lấy token từ URL khi component mounted
onMounted(async () => {
  token.value = route.query.token;
  
  if (!token.value) {
    error.value = 'Không tìm thấy token đặt lại mật khẩu';
    tokenInvalid.value = true;
    return;
  }

  await verifyToken();
});

// Watch for success to start countdown
watch(success, (newVal) => {
  if (newVal) {
    startCountdown();
  }
});

const startCountdown = () => {
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      router.push('/auth');
    }
  }, 1000);
};

// Kiểm tra token có hợp lệ không
const verifyToken = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    console.log('🔍 Verifying reset token:', token.value);
    
    const response = await axios.get(`${API_BASE_URL}/verify-reset-token`, {
      params: { token: token.value },
      timeout: 10000
    });

    console.log('✅ Token verification response:', response.data);

    if (response.data.success) {
      tokenValid.value = true;
      userEmail.value = response.data.email;
    } else {
      tokenInvalid.value = true;
      error.value = response.data.message || 'Token không hợp lệ';
    }
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    tokenInvalid.value = true;
    
    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
      error.value = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.';
    } else if (err.code === 'ECONNABORTED') {
      error.value = 'Kết nối quá thời gian. Vui lòng thử lại.';
    } else {
      error.value = 'Lỗi xác thực token. Vui lòng thử lại.';
    }
  } finally {
    loading.value = false;
  }
};

// Validate password
const validatePassword = () => {
  if (confirmPassword.value && newPassword.value !== confirmPassword.value) {
    error.value = 'Mật khẩu xác nhận không khớp';
  } else {
    error.value = '';
  }
};

// Đặt lại mật khẩu
const resetPassword = async () => {
  // Validate
  if (newPassword.value.length < 6) {
    error.value = 'Mật khẩu phải có ít nhất 6 ký tự';
    return;
  }

  if (!passwordsMatch.value) {
    error.value = 'Mật khẩu xác nhận không khớp';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    console.log('📤 Sending reset password request...');
    
    const response = await axios.post(`${API_BASE_URL}/reset-password`, {
      token: token.value,
      newPassword: newPassword.value
    }, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Reset password response:', response.data);

    if (response.data.success) {
      success.value = true;
    } else {
      error.value = response.data.message || 'Đặt lại mật khẩu thất bại';
    }
  } catch (err) {
    console.error('❌ Reset password failed:', err);
    
    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
      error.value = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.';
    } else if (err.code === 'ECONNABORTED') {
      error.value = 'Kết nối quá thời gian. Vui lòng thử lại.';
    } else {
      error.value = 'Lỗi đặt lại mật khẩu. Vui lòng thử lại.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.reset-password-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.reset-password-container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo h2 {
  color: #333;
  margin: 0;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

input.disabled-input {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.password-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.toggle-password:hover {
  background-color: #f8f9fa;
}

.password-hint {
  color: #6c757d;
  font-size: 12px;
}

/* Password strength indicator */
.password-strength {
  margin: 15px 0;
}

.strength-bar {
  height: 6px;
  border-radius: 3px;
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

.strength-bar.weak {
  width: 33%;
  background-color: #e74c3c;
}

.strength-bar.medium {
  width: 66%;
  background-color: #f39c12;
}

.strength-bar.strong {
  width: 100%;
  background-color: #27ae60;
}

.strength-text {
  color: #6c757d;
  font-size: 12px;
  display: block;
}

.password-match {
  margin: 10px 0;
  font-size: 14px;
}

.match-success {
  color: #27ae60;
  font-weight: 600;
}

.match-error {
  color: #e74c3c;
  font-weight: 600;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(.disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.submit-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.large {
  width: 32px;
  height: 32px;
  border-width: 3px;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-message, .error-message {
  text-align: center;
  padding: 30px;
  border-radius: 8px;
}

.success-message {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.error-message {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.success-icon, .error-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.success-message h3, .error-message h3 {
  margin: 0 0 10px 0;
}

.success-message p, .error-message p {
  margin: 0 0 15px 0;
  opacity: 0.8;
}

.redirect-text {
  font-style: italic;
  margin-bottom: 20px !important;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.login-link, .forgot-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border: 2px solid #667eea;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.login-link:hover, .forgot-link:hover {
  background-color: #667eea;
  color: white;
  text-decoration: none;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  text-align: center;
}

.error-icon {
  margin-right: 8px;
}

/* Responsive */
@media (max-width: 480px) {
  .reset-password-container {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .login-link, .forgot-link {
    text-align: center;
  }
}
</style>