// src/stores/cartStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8082/api'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    lastSync: null
  }),

  getters: {
    totalQuantity: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
    hasItems: (state) => state.items.length > 0,
    itemCount: (state) => state.items.length,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    
    // SỬA: Kiểm tra tất cả các key có thể có user
    isLoggedIn: () => {
      try {
        const userKeys = ['user', 'userLogin', 'currentUser', 'authUser'];
        let foundUser = null;
        
        for (const key of userKeys) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              const parsed = JSON.parse(value);
              console.log(`🔍 Found user in ${key}:`, parsed);
              if (parsed && (parsed.id || parsed.userId)) {
                foundUser = parsed;
                break;
              }
            } catch (e) {
              console.log(`❌ Parse error for ${key}:`, e.message);
            }
          }
        }
        
        const isLoggedIn = !!(foundUser && (foundUser.id || foundUser.userId));
        console.log('✅ Final login status:', isLoggedIn, 'User:', foundUser);
        return isLoggedIn;
      } catch (error) {
        console.error('❌ Error checking login status:', error);
        return false;
      }
    },
    
    // SỬA: Lấy user ID từ tất cả các key có thể
    currentUserId: () => {
      try {
        const userKeys = ['user', 'userLogin', 'currentUser', 'authUser'];
        
        for (const key of userKeys) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              const user = JSON.parse(value);
              if (user && (user.id || user.userId)) {
                const userId = user.id || user.userId;
                console.log(`✅ Found user ID in ${key}:`, userId);
                return userId;
              }
            } catch (e) {
              console.log(`❌ Parse error for ${key}:`, e.message);
            }
          }
        }
        
        console.log('❌ No user ID found in localStorage');
        this.debugLocalStorage();
        return null;
      } catch (error) {
        console.error('❌ Error getting user ID:', error);
        return null;
      }
    },
    
    // Lấy toàn bộ thông tin user
    currentUser: () => {
      try {
        const userKeys = ['user', 'userLogin', 'currentUser', 'authUser'];
        
        for (const key of userKeys) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              const user = JSON.parse(value);
              if (user && (user.id || user.userId)) {
                // Chuẩn hóa user object
                if (user.userId && !user.id) {
                  user.id = user.userId;
                }
                console.log(`✅ Found user in ${key}:`, user);
                return user;
              }
            } catch (e) {
              console.log(`❌ Parse error for ${key}:`, e.message);
            }
          }
        }
        
        console.log('❌ No valid user found in localStorage');
        return null;
      } catch (error) {
        console.error('❌ Error getting user:', error);
        return null;
      }
    }
  },

  actions: {
    // DEBUG: Hiển thị tất cả thông tin localStorage
    debugLocalStorage() {
      console.log('=== 🗂️ LOCALSTORAGE DEBUG ===');
      const allKeys = Object.keys(localStorage);
      console.log('All localStorage keys:', allKeys);
      
      allKeys.forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`🔑 Key: ${key}`);
        try {
          const parsed = JSON.parse(value);
          console.log(`📄 Value (parsed):`, parsed);
        } catch (e) {
          console.log(`📄 Value (raw):`, value);
        }
        console.log('---');
      });
      console.log('=== END DEBUG ===');
    },

    // Lấy giỏ hàng từ backend
    async fetchCart() {
      // Debug trước khi thực hiện
      console.log('=== 🛒 FETCH CART START ===');
      this.debugLocalStorage();
      
      const userId = this.currentUserId;
      console.log('👤 User ID for cart:', userId);
      
      if (!userId) {
        console.warn('❌ No user logged in, cannot fetch cart');
        this.error = 'Vui lòng đăng nhập để xem giỏ hàng';
        
        // Hiển thị alert để user biết
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            alert('Vui lòng đăng nhập để xem giỏ hàng');
          }, 100);
        }
        return;
      }

      this.loading = true;
      this.error = null;
      
      try {
        console.log('📤 Fetching cart for user:', userId);
        const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);
        this.items = response.data.items || [];
        this.lastSync = new Date();
        console.log('✅ Cart fetched successfully. Items:', this.items.length);
      } catch (error) {
        this.error = this.handleApiError(error, 'Lỗi khi tải giỏ hàng');
        console.error('❌ Error fetching cart:', error);
        
        if (error.response?.status === 404) {
          console.log('🔄 Cart not found, initializing empty cart');
          this.items = [];
        }
      } finally {
        this.loading = false;
        console.log('=== 🛒 FETCH CART END ===');
      }
    },

    // Thêm sản phẩm vào giỏ hàng - ĐÃ SỬA HOÀN TOÀN
    async addToCart(product, colorName, sizeValue) {
      // Debug chi tiết trước khi thực hiện
      console.log('=== 🛒 ADD TO CART START ===');
      this.debugLocalStorage();
      console.log('🔐 isLoggedIn:', this.isLoggedIn);
      console.log('👤 currentUserId:', this.currentUserId);
      console.log('👤 currentUser:', this.currentUser);
      console.log('📦 Product:', product);
      console.log('🎨 Color:', colorName);
      console.log('📏 Size:', sizeValue);

      const userId = this.currentUserId;
      if (!userId) {
        this.error = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng';
        console.error('❌ User not logged in. User ID:', userId);
        
        // Hiển thị alert để user biết
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
          }, 100);
        }
        return false;
      }

      this.loading = true;
      this.error = null;

      const cartItemRequest = {
        productId: product.id,
        productName: product.name,
        image: product.image,
        price: product.price,
        colorName: colorName || 'Default',
        sizeValue: sizeValue || 'One Size',
        quantity: 1
      };

      try {
        console.log('📤 Adding to cart - User ID:', userId);
        console.log('📦 Cart item request:', cartItemRequest);
        
        const response = await axios.post(
          `${API_BASE_URL}/cart/${userId}/items`, 
          cartItemRequest
        );
        
        this.items = response.data.items || [];
        this.lastSync = new Date();
        console.log('✅ Product added to cart successfully. Total items:', this.items.length);
        return true;
        
      } catch (error) {
        this.error = this.handleApiError(error, 'Lỗi khi thêm sản phẩm vào giỏ hàng');
        console.error('❌ Error adding to cart:', error);
        
        if (error.response) {
          console.error('📊 Error response data:', error.response.data);
          console.error('📊 Error response status:', error.response.status);
          console.error('📊 Error response headers:', error.response.headers);
        }
        
        return false;
      } finally {
        this.loading = false;
        console.log('=== 🛒 ADD TO CART END ===');
      }
    },

    // Helper methods
    getCurrentUser() {
      return this.currentUser;
    },

    // Kiểm tra đăng nhập
    checkAuth() {
      const isLoggedIn = this.isLoggedIn;
      const userId = this.currentUserId;
      const user = this.currentUser;
      console.log('🔐 Auth check - Logged in:', isLoggedIn, 'User ID:', userId, 'User:', user);
      return isLoggedIn;
    },

    // Các method khác giữ nguyên với debug cải tiến
    async increaseQty(item) {
      console.log('➕ Increasing quantity for item:', item);
      await this.updateItemQuantity(item, item.quantity + 1);
    },

    async decreaseQty(item) {
      console.log('➖ Decreasing quantity for item:', item);
      if (item.quantity > 1) {
        await this.updateItemQuantity(item, item.quantity - 1);
      } else {
        await this.removeItem(item);
      }
    },

    async updateItemQuantity(item, newQuantity) {
      const userId = this.currentUserId;
      if (!userId) {
        this.error = 'Vui lòng đăng nhập để cập nhật giỏ hàng';
        console.error('❌ User not logged in for quantity update');
        return false;
      }

      this.loading = true;
      this.error = null;

      try {
        console.log('📤 Updating quantity - User ID:', userId, 'Item:', item.productId, 'New Qty:', newQuantity);
        
        const response = await axios.put(
          `${API_BASE_URL}/cart/${userId}/items`,
          null,
          {
            params: {
              productId: item.productId,
              colorName: item.colorName,
              sizeValue: item.sizeValue,
              quantity: newQuantity
            }
          }
        );
        this.items = response.data.items;
        this.lastSync = new Date();
        console.log('✅ Quantity updated successfully');
        return true;
      } catch (error) {
        this.error = this.handleApiError(error, 'Lỗi khi cập nhật số lượng');
        console.error('❌ Error updating quantity:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async removeItem(item) {
      const userId = this.currentUserId;
      if (!userId) {
        this.error = 'Vui lòng đăng nhập để xóa sản phẩm';
        console.error('❌ User not logged in for item removal');
        return false;
      }

      this.loading = true;
      this.error = null;

      try {
        console.log('🗑️ Removing item - User ID:', userId, 'Item:', item.productId);
        
        const response = await axios.delete(
          `${API_BASE_URL}/cart/${userId}/items`,
          {
            params: {
              productId: item.productId,
              colorName: item.colorName,
              sizeValue: item.sizeValue
            }
          }
        );
        this.items = response.data.items;
        this.lastSync = new Date();
        console.log('✅ Item removed from cart:', item.productName);
        return true;
      } catch (error) {
        this.error = this.handleApiError(error, 'Lỗi khi xóa sản phẩm');
        console.error('❌ Error removing item:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async clearCart() {
      const userId = this.currentUserId;
      if (!userId) {
        this.error = 'Vui lòng đăng nhập để xóa giỏ hàng';
        return false;
      }

      this.loading = true;
      this.error = null;

      try {
        console.log('🧹 Clearing cart for user:', userId);
        await axios.delete(`${API_BASE_URL}/cart/${userId}/clear`);
        this.items = [];
        this.lastSync = new Date();
        console.log('✅ Cart cleared successfully');
        return true;
      } catch (error) {
        this.error = this.handleApiError(error, 'Lỗi khi xóa giỏ hàng');
        console.error('❌ Error clearing cart:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    handleApiError(error, defaultMessage) {
      console.error('❌ API Error:', error);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          case 404:
            return 'Không tìm thấy giỏ hàng';
          case 500:
            return 'Lỗi server, vui lòng thử lại sau';
          default:
            return error.response.data?.message || defaultMessage;
        }
      } else if (error.request) {
        return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else {
        return defaultMessage;
      }
    },

    clearError() {
      this.error = null;
    },

    // Đồng bộ giỏ hàng
    async syncCart() {
      console.log('🔄 Syncing cart...');
      await this.fetchCart();
    },

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    isItemInCart(productId, colorName, sizeValue) {
      return this.items.some(item => 
        item.productId === productId && 
        item.colorName === colorName && 
        item.sizeValue === sizeValue
      );
    }
  }
});