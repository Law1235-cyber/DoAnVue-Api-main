<template>
  <div class="checkout-page">
    <h2>Thanh toán</h2>

    <div v-if="cartItems.length === 0" class="empty-cart">
      <p>Giỏ hàng trống, không thể thanh toán</p>
      <router-link to="/product" class="btn-primary">Tiếp tục mua sắm</router-link>
    </div>

    <div v-else class="checkout-container">
      <div class="order-summary">
        <h3>Đơn hàng của bạn</h3>
        <div class="order-items">
          <div v-for="item in cartItems" :key="item.id + '-' + item.size + '-' + item.colorName" class="order-item">
            <span>{{ item.name }} x {{ item.quantity }}</span>
            <span>{{ formatPrice(item.price * item.quantity) }}</span>
          </div>
        </div>
        <div class="order-total">
          <strong>Tổng cộng: {{ formatPrice(cartTotal) }}</strong>
        </div>
      </div>

      <form @submit.prevent="processOrder" class="checkout-form">
        <h3>Thông tin giao hàng</h3>

        <div class="form-group">
          <label>Họ và tên:</label>
          <input v-model="orderForm.fullName" type="text" required>
        </div>

        <div class="form-group">
          <label>Email:</label>
          <input v-model="orderForm.email" type="email" required>
        </div>

        <div class="form-group">
          <label>Số điện thoại:</label>
          <input v-model="orderForm.phone" type="tel" required>
        </div>

        <div class="form-group">
          <label>Địa chỉ:</label>
          <textarea v-model="orderForm.address" required></textarea>
        </div>

        <div class="form-group">
          <label>Ghi chú:</label>
          <textarea v-model="orderForm.notes" placeholder="Ghi chú thêm (không bắt buộc)"></textarea>
        </div>

        <div class="review">
          <h3>Đánh giá sản phẩm</h3>
          <div class="stars">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ active: n <= stars }"
              @click="stars = n"
            >★</span>
          </div>
          <textarea v-model="comment" placeholder="Nhập bình luận..." rows="3" />
        </div>

        <div class="payment-methods">
          <h4>Phương thức thanh toán:</h4>
          <div class="payment-option">
            <input v-model="orderForm.paymentMethod" type="radio" id="cod" value="cod">
            <label for="cod">Thanh toán khi nhận hàng (COD)</label>
          </div>
          <div class="payment-option">
            <input v-model="orderForm.paymentMethod" type="radio" id="qr" value="qr">
            <label for="qr">Thanh toán QR Code</label>
          </div>
          <div class="payment-option">
            <input v-model="orderForm.paymentMethod" type="radio" id="card" value="card">
            <label for="card">Thẻ tín dụng/Ghi nợ</label>
          </div>
        </div>

        <div class="form-actions">
          <router-link to="/cart" class="btn-back">Quay lại giỏ hàng</router-link>
          <button type="submit" class="btn-order" :disabled="processing">
            {{ processing ? 'Đang xử lý...' : 'Đặt hàng' }}
          </button>
        </div>
      </form>
    </div>

    <QRPayment
  :show="showQRPayment"
  :amount="cartTotal"
  :order-id="currentOrderId"
  @close="showQRPayment = false"
  @payment-success="handlePaymentSuccess"
  @payment-failed="handlePaymentFailed"
/>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { useRouter } from 'vue-router';
// import Header from './AppHeader.vue';
// import Foot from './Foot.vue';
import QRPayment from './QRPayment.vue'; 

const cartStore = useCartStore();
const router = useRouter();

const currentUser = ref(null);

const isQROpen = ref(false);
const currentOrderId = ref(null);
const orderAmount = ref(0);

const cartItems = computed(() => cartStore.items);
const cartTotal = computed(() => cartStore.totalPrice);

const orderForm = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  paymentMethod: 'COD', // Mặc định là COD
});

const formatPrice = (price) => {
  if (typeof price !== 'number') return '0 đ';
  return price.toLocaleString('vi-VN') + ' đ';
};

const checkLoginStatus = () => {
    const userString = localStorage.getItem('userLogin');
    if (userString) {
        currentUser.value = JSON.parse(userString);
        
        // Tự động điền thông tin người dùng vào form (Tùy chọn)
        orderForm.value.fullName = currentUser.value.name || '';
        orderForm.value.email = currentUser.value.email || '';
        
    } else {
        currentUser.value = null;
    }
};

onMounted(() => {
    checkLoginStatus();
});


const processOrder = async () => {
  if (!currentUser.value) {
    alert('Vui lòng đăng nhập để thanh toán!');
    router.push('/auth');
    return;
  }

  // Tạo đối tượng đơn hàng
  // eslint-disable-next-line no-unused-vars
  const orderData = { // <-- Đã thêm comment để bỏ qua cảnh báo no-unused-vars
    ...orderForm.value,
    items: cartStore.items,
    total: cartTotal.value,
    date: new Date().toISOString(),
    status: 'Pending',
    userId: currentUser.value.id || currentUser.value.email || 'guest', 
  };
  
  // Logic xử lý đơn hàng (giả định dùng JSON Server)
  try {
    // 1. Lưu đơn hàng vào API (hoặc database)
    // await axios.post('http://localhost:3000/orders', orderData);

    // 2. Xử lý thanh toán QR nếu cần
    if (orderForm.value.paymentMethod === 'QR') {
      currentOrderId.value = 'ORD-' + Date.now(); // Tạo ID đơn hàng giả
      orderAmount.value = cartTotal.value;
      isQROpen.value = true;
    } else {
      // Logic cho COD
      alert(`Đặt hàng thành công! Tổng tiền: ${formatPrice(cartTotal.value)}`);
      cartStore.clearCart();
      router.push('/');
    }
  } catch (error) {
    console.error('Lỗi xử lý đơn hàng:', error);
    alert('Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.');
  }
};

// eslint-disable-next-line no-unused-vars
const closeQR = () => { // <-- Đã thêm comment để bỏ qua cảnh báo no-unused-vars
  isQROpen.value = false;
  // Sau khi hoàn tất thanh toán QR (giả định), clear cart và về trang chủ
  if (currentOrderId.value) {
    cartStore.clearCart();
    router.push('/');
  }
};
</script>

<style scoped>
.checkout-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.checkout-page h2 {
  margin-bottom: 30px;
  color: #333;
}

.empty-cart {
  text-align: center;
  padding: 50px;
  color: #666;
}

.checkout-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
}

.order-summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  height: fit-content;
}

.order-summary h3 {
  margin-bottom: 20px;
  color: #333;
}

.order-items {
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.order-total {
  padding-top: 15px;
  border-top: 2px solid #333;
  font-size: 1.2rem;
  color: #333;
}

.checkout-form {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.checkout-form h3 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.form-group textarea {
  resize: vertical;
  height: 80px;
}

.payment-methods {
  margin-bottom: 30px;
}

.payment-methods h4 {
  margin-bottom: 15px;
  color: #333;
}

.payment-option {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.payment-option input {
  margin-right: 10px;
  width: auto;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: space-between;
}

.btn-primary,
.btn-order {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s;
  display: inline-block;
}

.btn-primary:hover,
.btn-order:hover {
  background-color: #0056b3;
}

.btn-order:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-back {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn-back:hover {
  background-color: #545b62;
}
.review {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.stars .star {
  font-size: 24px;
  cursor: pointer;
  color: #ccc;
  margin-right: 5px;
}
.stars .star.active {
  color: gold;
}
textarea {
  width: 100%;
  margin-top: 10px;
  resize: vertical;
}

@media (max-width: 768px) {
  .checkout-container {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>