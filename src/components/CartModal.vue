<template>
  <div v-if="show" class="cart-modal-overlay" @click.self="close">
    <div class="cart-modal">
      <h2>Giỏ hàng</h2>
      <div v-if="cartItems.length === 0">Giỏ hàng trống</div>
      <div v-else>
        <div v-for="item in cartItems" :key="item.id + '-' + item.size + '-' + item.colorName" class="cart-item">
          <img :src="item.image" alt="Hình món" class="cart-item-img" />
          <div class="cart-item-info">
            <div class="cart-item-name">{{ item.name }}</div>
            <div class="cart-item-size">Size: {{ item.size }}</div>
            <div class="cart-item-qty">
              <button @click="decreaseQty(item)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQty(item)">+</button>
            </div>
          </div>
          <button class="cart-item-remove" @click="removeItem(item)">Xóa</button>
        </div>
        <div class="cart-total">
          <span>Tổng tiền:</span>
          <span class="cart-total-value">{{ formatPrice(totalPrice) }}</span>
        </div>
      </div>
      <div class="cart-actions">
      <router-link to="/checkout" class="checkout-btn">Thanh toán</router-link>
        <button class="cart-modal-close" @click="close">Đóng</button>
</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    cartItems: {
      type: Array,
      default: () => []
    }
  },

  emits: ['close', 'update:cartItems'],
  computed: {
    totalPrice() {
      return this.cartItems.reduce((sum, item) => {
        const price = item.price ? item.price : 0;
        return sum + price * item.quantity;
      }, 0);
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    },
    close() {
      this.$emit('close');
    },
    increaseQty(item) {
      const newCart = [...this.cartItems];
      const idx = newCart.findIndex(
        i => i.id === item.id && i.size === item.size && i.colorName === item.colorName
      );
      if (idx !== -1) {
        newCart[idx].quantity++;
        this.$emit('update:cartItems', newCart);
      }
    },
    decreaseQty(item) {
      const newCart = [...this.cartItems];
      const idx = newCart.findIndex(
        i => i.id === item.id && i.size === item.size && i.colorName === item.colorName
      );
      if (idx !== -1) {
        if (newCart[idx].quantity > 1) {
          newCart[idx].quantity--;
          this.$emit('update:cartItems', newCart);
        } else {
          this.removeItem(item);
        }
      }
    },
    removeItem(item) {
      const idx = this.cartItems.findIndex(
        i => i.id === item.id && i.size === item.size && i.colorName === item.colorName
      );
      if (idx !== -1) {
        const newCart = [...this.cartItems];
        newCart.splice(idx, 1);
        this.$emit('update:cartItems', newCart);
      }
    },
    checkout() {
      alert("Thanh toán thành công!");
      this.$emit('update:cartItems', []);  // Xóa hết giỏ hàng
      this.$emit('close');                 // Đóng modal
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
  min-width: 350px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
}
.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
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
}
.cart-item-size {
  font-size: 13px;
  color: #888;
}
.cart-item-qty {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.cart-item-qty button {
  width: 24px;
  height: 24px;
  border: none;
  background: #eee;
  border-radius: 4px;
  cursor: pointer;
}
.cart-item-remove {
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  margin-left: 8px;
}
.cart-modal-close {
  margin-top: 16px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}
.cart-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  margin-top: 18px;
  gap: 10px;
}
.cart-total-value {
  color: #b30404;
  font-size: 20px;
}
.cart-actions {
  display: flex;
  justify-content: flex-start;
  gap: 15px; /* khoảng cách giữa các nút */
  margin-top: 16px;
}

.checkout-btn {
  background: green;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.cart-modal-close {
  background: #333;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
