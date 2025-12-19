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
            </div>
          </div>
          
          <div class="qr-container">
            <div v-if="showQRCode && paymentStatus === 'waiting'" class="qr-display">
              <p>Quét mã QR bên dưới để thanh toán</p>
              
              <div class="countdown-timer">
                 <span :class="{ 'text-red': timeLeft < 60 }">
                   Thời gian còn lại: {{ formattedTime }}
                 </span>
              </div>

              <img :src="qrCodeDataUrl" alt="Payment QR Code" class="qr-image" />
              
              <div class="bank-info">
                <p><strong>Ngân hàng:</strong> BIDV</p>
                <p><strong>Số tài khoản:</strong> 962470867447890</p>
                <p><strong>Chủ tài khoản:</strong> DANG TRUNG HAI</p>
                <p><strong>Nội dung CK:</strong> <span style="color:red; font-weight:bold">{{ qrContent }}</span></p>
              </div>

              <div class="auto-check-status">
                  <div class="spinner-small"></div>
                  <div class="status-text">
                      <p><strong>Đang chờ xác nhận thanh toán...</strong></p>
                      <p class="sub-text">Hệ thống sẽ tự động xử lý khi nhận được tiền.</p>
                      <p class="sub-text">(Vui lòng không tắt màn hình này)</p>
                  </div>
              </div>

              <button @click="closeQR" class="btn-back">Hủy bỏ</button>
            </div>
            
            <div v-else-if="paymentStatus === 'success'" class="status-success">
               <div class="success-icon">🎉</div>
               <h3>Thanh toán thành công!</h3>
               <p>Hệ thống đã nhận được tiền.</p>
               <p style="color: #28a745; font-weight: bold;">Đang xuất hóa đơn điện tử...</p>
               <div class="spinner-small" style="margin: 10px auto;"></div>
            </div>
            
             <div v-else class="qr-placeholder">
               <div class="spinner"></div>
               <p>Đang tạo mã QR...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
// Dòng trên dùng để tắt lỗi báo defineProps/defineEmits

import { ref, onUnmounted, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// --- CẤU HÌNH ---
const API_BASE_URL = 'http://localhost:8082' 

const props = defineProps({
  show: { type: Boolean, default: false },
  amount: { type: Number, required: true },
  orderId: { type: String, required: true }
})

const emit = defineEmits(['close', 'payment-success'])

// State variables
const paymentStatus = ref('waiting') 
const currentUser = ref(null)
const showQRCode = ref(false)
const qrCodeDataUrl = ref('')
const qrContent = ref('')

// Variables cho Polling và Timer
const timeLeft = ref(300) 
let timerInterval = null
let pollingInterval = null 

// Formatter
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

// Logic Login
onMounted(() => {
  const user = localStorage.getItem('userLogin') 
  if (user) {
    currentUser.value = JSON.parse(user)
  }
})

// Dọn dẹp
onUnmounted(() => {
  stopAllIntervals()
})

const stopAllIntervals = () => {
    if (timerInterval) clearInterval(timerInterval)
    if (pollingInterval) clearInterval(pollingInterval)
}

// --- 1. LOGIC QR CODE ---
const generateQRCode = () => {
    paymentStatus.value = 'waiting'
    timeLeft.value = 300
    
    const description = `DH ${props.orderId}`
    qrContent.value = description 

    const bankCode = '970418' // BIDV
    const accountNumber = '962470867447890' 
    
    const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png` +
                  `?amount=${props.amount}&addInfo=${encodeURIComponent(description)}`

    qrCodeDataUrl.value = qrUrl
    showQRCode.value = true

    startTimer()
    startPolling()
}

const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value--
        } else {
            stopAllIntervals()
            alert('Hết thời gian thanh toán. Vui lòng thử lại.')
            emit('close')
        }
    }, 1000)
}

// --- 2. POLLING API CHECK TRẠNG THÁI ---
const startPolling = () => {
    if (pollingInterval) clearInterval(pollingInterval)
    
    pollingInterval = setInterval(async () => {
        try {
            // Gọi API kiểm tra trạng thái
            const response = await axios.get(`${API_BASE_URL}/api/payment/check-status/${props.orderId}`)
            const status = response.data 
            
            // Nếu Backend trả về "PAID" hoặc object { status: "PAID" }
            if (status === 'PAID' || status?.status === 'PAID') {
                handleSuccess()
            }
        } catch (error) {
           // Không làm gì để tránh lỗi empty block
           console.log("Checking payment...", error.message)
        }
    }, 2000)
}

// --- 3. XỬ LÝ THÀNH CÔNG & XUẤT HÓA ĐƠN ---
const handleSuccess = async () => {
    stopAllIntervals()
    paymentStatus.value = 'success'
    
    // Gọi hàm tạo hóa đơn ngay khi thành công
    try {
        await fetchAndExportInvoice()
    } catch (error) {
        console.error("Lỗi xuất hóa đơn:", error)
        alert("Thanh toán thành công nhưng không thể tải hóa đơn.")
    }

    // Đợi 3 giây để người dùng thấy thông báo rồi đóng
    setTimeout(() => {
        emit('payment-success')
    }, 3000)
}

// --- 4. LOGIC GỌI API & TẠO PDF ---
const fetchAndExportInvoice = async () => {
    try {
        // Gọi API lấy chi tiết đơn hàng
        const response = await axios.get(`${API_BASE_URL}/api/orders/${props.orderId}`)
        const orderData = response.data
        
        generatePDF(orderData)
    } catch (error) {
        console.error("Không lấy được dữ liệu đơn hàng:", error)
        throw error
    }
}

const generatePDF = (data) => {
    const doc = new jsPDF()

    // --- Header ---
    doc.setFontSize(22)
    doc.text("HOA DON BAN HANG", 105, 20, { align: "center" })
    
    // --- Thông tin chung ---
    doc.setFontSize(12)
    doc.text(`Ma don hang: #${props.orderId}`, 15, 40)
    
    const today = new Date()
    doc.text(`Ngay: ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`, 15, 50)
    
    // Xử lý thông tin khách hàng
    if (data.fullname || currentUser.value?.name) {
        const name = data.fullname || currentUser.value?.name
        doc.text(`Khach hang: ${removeVietnameseTones(name)}`, 15, 60)
    }
    // Fix lỗi thiếu thông tin
    const phone = data.phone || data.phoneNumber || (currentUser.value ? currentUser.value.phone : '');
    if (phone) {
        doc.text(`SDT: ${phone}`, 15, 70)
    }
    if (data.address) {
        doc.text(`Dia chi: ${removeVietnameseTones(data.address)}`, 15, 80)
    }

    // --- Bảng sản phẩm ---
    // Tự động tìm mảng item dù tên là gì
    const items = data.orderDetails || data.orderItems || data.items || [];
    
    const tableBody = items.map(item => [
        removeVietnameseTones(item.productName || (item.product ? item.product.title : "") || "San pham"), 
        item.quantity || item.num || 1,                              
        formatMoney(item.price || 0),    
        formatMoney(item.total_money || (item.price * (item.quantity || 1))) 
    ]) 

    autoTable(doc, {
        startY: 90,
        head: [['San pham', 'SL', 'Don gia', 'Thanh tien']],
        body: tableBody,
        theme: 'grid',
    })

    // --- Tổng tiền ---
    const finalY = doc.lastAutoTable.finalY || 90
    doc.setFontSize(14)
    doc.text(`Tong tien: ${formatMoney(props.amount)} VND`, 140, finalY + 20)

    // --- Footer ---
    doc.setFontSize(10)
    doc.text("Cam on quy khach!", 105, finalY + 40, { align: "center" })

    // Tải file về
    doc.save(`Hoa_don_${props.orderId}.pdf`)
}

const formatMoney = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const removeVietnameseTones = (str) => {
    if (!str) return ''
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

// Watch
watch(() => props.show, (newVal) => {
  if (newVal) {
     generateQRCode()
  } else {
     stopAllIntervals()
  }
}, { immediate: true })

</script>

<style scoped>
/* CSS giữ nguyên từ code của bạn */
.auto-check-status {
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 15px;
    background-color: #f0f8ff;
    border: 1px solid #bce0fd;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 15px;
    text-align: left;
}
.spinner-small {
    width: 25px;
    height: 25px;
    border: 3px solid #ccc;
    border-top: 3px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    flex-shrink: 0;
}
.status-text p { margin: 0; color: #007bff; }
.status-text .sub-text { font-size: 12px; color: #666; margin-top: 2px; }
.countdown-timer {
  font-size: 16px; font-weight: bold; color: #dc3545; margin-bottom: 10px;
  background: #fff5f5; padding: 5px 10px; border-radius: 15px; display: inline-block;
}
.qr-payment { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; }
.qr-overlay {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; padding: 20px;
}
.qr-modal {
  background: white; border-radius: 15px; max-width: 90vw; width: 100%; max-height: 90vh;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); overflow-y: auto; display: flex; flex-direction: column;
}
@media (min-width: 576px) { .qr-modal { max-width: 400px; } }
.qr-header {
  padding: 20px; background: #007bff; color: white; display: flex; justify-content: space-between; align-items: center;
}
.close-btn { background: none; border: none; color: white; font-size: 24px; cursor: pointer; }
.qr-body { padding: 20px; text-align: center; flex: 1; }
.payment-info { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: left; }
.qr-display { display: flex; flex-direction: column; align-items: center; gap: 15px; }
.qr-image { max-width: 250px; width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px; padding: 10px; }
.bank-info { background: #f8f9fa; border-radius: 8px; padding: 15px; width: 100%; text-align: left; }
.btn-back { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: 500; background: #6c757d; color: white; width: 100%; }
.status-success { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px; gap: 15px; }
.success-icon { font-size: 50px; }
.spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>