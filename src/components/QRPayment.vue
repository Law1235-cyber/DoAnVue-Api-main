
<template>
  <div class="qr-payment" v-if="show">
    <div class="qr-overlay" @click="closeQR">
      <div class="qr-modal" @click.stop>
        <div class="qr-header">
          <h3>Thanh toán QR Code</h3>
          <button @click="closeQR" class="close-btn">&times;</button>
        </div>
        
        <div class="qr-body">
          <div class="payment-info">
            <p><strong>Tổng tiền:</strong> {{ formatPrice(amount) }}</p>
            <p><strong>Mã đơn hàng:</strong> #{{ orderId }}</p>
            <div v-if="currentUser" class="user-info">
              <p><strong>Người thanh toán:</strong> {{ currentUser.name }}</p>
              <p><strong>Email:</strong> {{ currentUser.email }}</p>
            </div>
          </div>
          
          <div class="qr-container">
            <div v-if="!isScanning && !showQRCode" class="qr-placeholder">
              <p>Chọn phương thức thanh toán</p>
              <button @click="generateQRCode" class="btn-qr">Hiển thị mã QR</button>
            </div>
            <div v-else-if="showQRCode" class="qr-display">
              <p>Quét mã QR bên dưới để thanh toán</p>
              <div class="qr-instructions">
                <p><strong>Hướng dẫn quét mã:</strong></p>
                <ul>
                  <li>Mở ứng dụng ngân hàng hoặc ví điện tử có chức năng quét QR</li>
                  <li>Chọn chức năng quét mã QR</li>
                  <li>Canh chỉnh camera để mã QR nằm trong khung quét</li>
                  <li>Đảm bảo ánh sáng đủ và không bị che khuất</li>
                </ul>
              </div>
              <img :src="qrCodeDataUrl" alt="Payment QR Code" class="qr-image" />
              <div class="bank-info">
                <p><strong>Ngân hàng:</strong> TPBank</p>
                <p><strong>Số tài khoản:</strong> 10001815604</p>
                <p><strong>Chủ tài khoản:</strong>DANG TRUNG HAI</p>
              </div>
              <p class="qr-info">Mã đơn hàng: #{{ orderId }}</p>
              <p class="qr-info">Số tiền: {{ formatPrice(amount) }}</p>
              <button @click="showQRCode = false" class="btn-back">Quay lại</button>
            </div>
            <div v-else class="scanner-container">
            </div>
          </div>
          
          <div class="payment-status">
            <div v-if="paymentStatus === 'waiting'" class="status-waiting">
              <div class="spinner"></div>
              <span>Đang chờ thanh toán...</span>
            </div>
            <div v-else-if="paymentStatus === 'processing'" class="status-processing">
              <div class="spinner"></div>
              <span>Đang xử lý thanh toán...</span>
            </div>
            <div v-else-if="paymentStatus === 'success'" class="status-success">
              <span>✅ Thanh toán thành công!</span>
            </div>
            <div v-else-if="paymentStatus === 'failed'" class="status-failed">
              <span>❌ Thanh toán thất bại</span>
              <button @click="retryPayment" class="btn-retry">Thử lại</button>
            </div>
          </div>
        </div>
        
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue'

// eslint-disable-next-line no-undef, no-unused-vars
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  amount: {
    type: Number,
    required: true
  },
  orderId: {
    type: String,
    required: true
  }
})

// eslint-disable-next-line no-undef
const emit = defineEmits(['close', 'payment-success', 'payment-failed'])

// Refs for DOM elements

// State variables
const isScanning = ref(false)
const paymentStatus = ref('waiting') // waiting, processing, success, failed
const currentUser = ref(null)
const showQRCode = ref(false)
const qrCodeDataUrl = ref('')

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

// Authentication check
onMounted(() => {
  const user = localStorage.getItem('currentUser')
  if (user) {
    currentUser.value = JSON.parse(user)
  } else {
    // If user is not logged in, close the modal
    alert('Vui lòng đăng nhập để thanh toán')
    emit('close')
  }
})

const closeQR = () => {
  emit('close')
}

const generateQRCode = async () => {
  try {
    // ==== CẤU HÌNH NGÂN HÀNG ====
    const bankCode = '970423' // Mã TPBank theo Napas
    const accountNumber = '10001815604' // Số tài khoản của bạn
    const amount = props.amount // Số tiền cần thanh toán
    const description = `Thanh toan don hang ${props.orderId}` // Nội dung chuyển khoản

    // ==== TẠO LINK QR CHUẨN VIETQR ====
    const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png` +
                  `?amount=${amount}&addInfo=${encodeURIComponent(description)}`

    // ==== GÁN URL VÀO qrCodeDataUrl ====
    qrCodeDataUrl.value = qrUrl
    showQRCode.value = true
  } catch (error) {
    console.error('Error generating QR code:', error)
    alert('Không thể tạo mã QR. Vui lòng thử lại.')
  }
}

onUnmounted(() => {
})

const retryPayment = () => {
  paymentStatus.value = 'waiting'
  showQRCode.value = true
  // Optionally regenerate the QR code
  generateQRCode()
}
</script>

<style scoped>
.qr-payment {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.qr-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.qr-modal {
  background: white;
  border-radius: 15px;
  max-width: 90vw;
  width: 100%;
  max-height: 90vh;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

@media (min-width: 576px) {
  .qr-modal {
    max-width: 400px;
  }
}

@media (min-width: 768px) {
  .qr-modal {
    max-width: 500px;
  }
}

.qr-header {
  padding: 20px;
  background: #007bff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.qr-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-body {
  padding: 20px;
  text-align: center;
  min-height: 200px;
  flex: 1;
}

.payment-info {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: left;
  width: 100%;
}

.payment-info p {
  margin: 5px 0;
  color: #333;
}

.user-info {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
}

.qr-container {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.qr-placeholder {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.qr-placeholder p {
  margin: 0;
  font-weight: 500;
  color: #333;
}

.btn-scan, .btn-upload {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
  width: 100%;
  max-width: 250px;
}

.btn-scan {
  background: #007bff;
  color: white;
}

.btn-scan:hover {
  background: #0056b3;
}

.btn-upload {
  background: #28a745;
  color: white;
}

.btn-upload:hover {
  background: #218838;
}

.scanner-container {
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.scanner-video {
  width: 100%;
  border-radius: 8px;
  transform: scaleX(-1);
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.scanner-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 2px solid #007bff;
  box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

.scanner-instructions {
  margin-top: 15px;
  color: #666;
  font-size: 14px;
}

.payment-status {
  margin: 20px 0;
  padding: 15px;
  border-radius: 8px;
  width: 100%;
}

.status-waiting {
  background: #fff3cd;
  color: #856404;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.status-processing {
  background: #cce5ff;
  color: #004085;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.status-success {
  background: #d1edda;
  color: #155724;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.status-failed {
  background: #f8d7da;
  color: #721c24;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #856404;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.qr-footer {
  padding: 20px;
  background: #f8f9fa;
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.btn-refresh, .btn-cancel {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-refresh {
  background: #28a745;
  color: white;
}

.btn-refresh:hover {
  background: #218838;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #545b62;
}

@media (max-width: 480px) {
  .qr-modal {
    margin: 10px;
    max-height: 95vh;
  }
  
  .qr-footer {
    flex-direction: column;
  }
  
  .btn-scan, .btn-upload, .btn-qr {
    width: 100%;
  }
  
  .qr-instructions, .bank-info, .payment-info {
    padding: 10px;
  }
  
  .qr-image {
    max-width: 180px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .qr-modal {
    max-width: 400px;
  }
  
  .qr-image {
    max-width: 220px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .qr-modal {
    max-width: 450px;
  }
  
  .qr-image {
    max-width: 250px;
  }
}

@media (min-width: 992px) {
  .qr-modal {
    max-width: 500px;
  }
  
  .qr-image {
    max-width: 300px;
  }
}

.btn-qr {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
  width: 100%;
  max-width: 250px;
  background: #ffc107;
  color: #212529;
}

.btn-qr:hover {
  background: #e0a800;
}

.qr-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  max-width: 100%;
}

.qr-image {
  max-width: 250px;
  width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background: white;
  object-fit: contain;
}

@media (min-width: 768px) {
  .qr-image {
    max-width: 300px;
  }
}

.qr-info {
  margin: 3px 0;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.btn-back {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  background: #6c757d;
  color: white;
  transition: background-color 0.3s;
}

.btn-back:hover {
  background: #545b62;
}

.btn-retry {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  background: #ffc107;
  color: #212529;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.btn-retry:hover {
  background: #e0a800;
}

.qr-instructions {
  background: #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  text-align: left;
  font-size: 14px;
  width: 100%;
}

.qr-instructions ul {
  padding-left: 15px;
  margin: 5px 0;
}

.qr-instructions li {
  margin-bottom: 5px;
  color: #495057;
}

.bank-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  text-align: left;
  width: 100%;
  font-size: 14px;
}

.bank-info p {
  margin: 3px 0;
  color: #333;
  font-weight: 500;
}
</style>
