<template>
  <div v-if="show" class="cart-modal-overlay" @click.self="close">
    <div class="cart-modal">
      <h2>Giỏ hàng</h2>
      
      <div v-if="cartStore.loading" class="loading">Đang tải giỏ hàng...</div>
      
      <div v-else-if="cartStore.items.length === 0">Giỏ hàng trống</div>
      
      <div v-else>
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <img :src="item.image" :alt="item.productName" class="cart-item-img" />
          <div class="cart-item-info">
            <div class="cart-item-name">{{ item.productName }}</div>
            <div class="cart-item-details">
              <span v-if="item.colorName">Màu: {{ item.colorName }}</span>
              <span v-if="item.sizeValue">Size: {{ item.sizeValue }}</span>
            </div>
            <div class="cart-item-price">{{ formatPrice(item.price) }}</div>
            
            <div class="cart-item-qty">
              <button @click="decreaseQty(item)" :disabled="cartStore.loading">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQty(item)" :disabled="cartStore.loading">+</button>
            </div>
          </div>
          
          <button 
            class="cart-item-remove" 
            @click="removeItem(item)"
            :disabled="cartStore.loading"
          >
            {{ cartStore.loading ? '...' : 'Xóa' }}
          </button>
        </div>

        <div class="cart-total">
          <span>Tổng tiền:</span>
          <span class="cart-total-value">{{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
      </div>

      <div class="cart-actions">
        <button 
          class="checkout-btn" 
          @click="checkout"
          :disabled="cartStore.items.length === 0"
        >
          Thanh toán
        </button>
        
        <button class="cart-modal-close" @click="close">Đóng</button>
      </div>

      <div v-if="cartStore.error" class="error-message">
        {{ cartStore.error }}
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cartStore';

export default {
  name: 'CartModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const cartStore = useCartStore();
    return { cartStore };
  },
  data() {
    return {
      processingItemId: null
    };
  },
  emits: ['close'],
  watch: {
    show: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchCart();
        }
      }
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    },

    async fetchCart() {
      if (!this.cartStore.isLoggedIn) {
        return;
      }
      try {
        await this.cartStore.fetchCart();
      } catch (error) {
        console.error('Lỗi tải giỏ hàng:', error);
      }
    },

    async increaseQty(item) {
      try {
        await this.cartStore.increaseQty(item);
      } catch (error) {
        console.error('Lỗi tăng số lượng:', error);
      }
    },

    async decreaseQty(item) {
      try {
        await this.cartStore.decreaseQty(item);
      } catch (error) {
        console.error('Lỗi giảm số lượng:', error);
      }
    },

    async removeItem(item) {
      try {
        await this.cartStore.removeItem(item);
      } catch (error) {
        console.error('Lỗi xóa sản phẩm:', error);
      }
    },

    // --- ĐÃ SỬA: Hàm checkout đơn giản hóa ---
    checkout() {
      // 1. Đóng modal giỏ hàng
      this.close();
      
      // 2. Chuyển hướng thẳng đến trang checkout mà không kiểm tra hay xóa store
      this.$router.push('/checkout');
    },

    close() {
      this.cartStore.clearError();
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.cart-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.cart-modal {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  min-width: 400px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

.cart-item-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 12px;
}

.cart-item-info {
  flex: 1;
}

.cart-item-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.cart-item-details {
  font-size: 13px;
  color: #888;
  margin-bottom: 4px;
}

.cart-item-details span {
  margin-right: 8px;
}

.cart-item-price {
  font-weight: bold;
  color: #b30404;
  margin-bottom: 8px;
}

.cart-item-qty {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-item-qty button {
  width: 24px;
  height: 24px;
  border: none;
  background: #eee;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-item-qty button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-item-remove {
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  margin-left: 8px;
  font-size: 12px;
}

.cart-item-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 2px solid #eee;
}

.cart-total-value {
  color: #b30404;
  font-size: 20px;
}

.cart-actions {
  display: flex;
  justify-content: flex-start;
  gap: 15px;
  margin-top: 16px;
}

.checkout-btn {
  background: green;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #ccc;
}

.cart-modal-close {
  background: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cart-modal-close:hover {
  background: #555;
}

.checkout-btn:hover:not(:disabled) {
  background: #006400;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-top: 15px;
  border-left: 4px solid #c62828;
  font-size: 14px;
}
</style>