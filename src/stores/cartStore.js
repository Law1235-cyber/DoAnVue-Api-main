// src/stores/cartStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

const CART_STORAGE_KEY = 'cart_items';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    totalQuantity: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
  },
  actions: {
    addToCart(product, colorName, size) {
      // Lưu ý: product truyền vào phải chứa đầy đủ id, name, price, image, colorName, size
      const idx = this.items.findIndex(
        i => i.id === product.id && i.size === size && i.colorName === colorName
      );
      if (idx !== -1) {
        this.items[idx].quantity++;
      } else {
        this.items.push({
          ...product,
          colorName,
          size,
          quantity: 1,
        });
      }
      this.saveToLocal();
    },
    increaseQty(item) {
      const idx = this.items.findIndex(
        i => i.id === item.id && i.size === item.size && i.colorName === item.colorName
      );
      if (idx !== -1) this.items[idx].quantity++;
      this.saveToLocal();
    },
    decreaseQty(item) {
      const idx = this.items.findIndex(
        i => i.id === item.id && i.size === item.size && i.colorName === item.colorName
      );
      if (idx !== -1) {
        if (this.items[idx].quantity > 1) {
          this.items[idx].quantity--;
        } else {
          this.items.splice(idx, 1);
        }
      }
      this.saveToLocal();
    },
    removeItem(item) {
      const idx = this.items.findIndex(
        i => i.id === item.id && i.size === item.size && i.colorName === item.colorName
      );
      if (idx !== -1) this.items.splice(idx, 1);
      this.saveToLocal();
    },
    clearCart() {
      this.items = [];
      this.saveToLocal();
    },
    saveToLocal() {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    },
    loadFromLocal() {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      this.items = saved ? JSON.parse(saved) : [];
    },    
    async saveCartToApi() {
      try {
        const user = JSON.parse(localStorage.getItem('currentUser')) || {};
        const cartData = {
          items: this.items,
          time: new Date().toISOString(),
          userId: user.email || null,
          total: this.totalPrice
        };
        // Gửi POST lên json-server
        await axios.post('http://localhost:3000/cart', cartData);
        alert('Đã lưu giỏ hàng lên server thành công!');
        this.clearCart();
      } catch (err) {
        alert('Lỗi lưu giỏ hàng lên server: ' + err.message);
      }
    },
  }
});
