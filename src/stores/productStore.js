import { defineStore } from 'pinia';
import axios from 'axios';

// Định nghĩa URL của API backend.
// Hãy đảm bảo rằng bạn đã khởi động json-server với file db.json
// Nếu server của bạn chạy ở một địa chỉ khác, hãy thay đổi URL này
const API_URL = 'http://localhost:3000/productDetails';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    collections: [],
    productDetails: [],
    selectedProduct: null,
    selectedColorIndex: 0,
    selectedSizeIndex: null,
    calculatedPrice: 0,
  }),

  getters: {
    highlightProducts: (state) => {
      return state.productDetails.slice(0, 4);
    }
  },

  actions: {
    async fetchProducts() {
      try {
        const response = await axios.get('/pro.json');
        this.products = response.data.products;
        this.collections = response.data.collections;
        this.productDetails = response.data.productDetails;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    setProductById(id) {
      const product = this.productDetails.find(p => p.id === id);
      if (product) {
        this.selectedProduct = product;
        this.calculatedPrice = product.price;
        if (product.colors && product.colors.length > 0) {
          this.selectedColorIndex = 0;
        } else {
          this.selectedColorIndex = null;
        }
        this.selectedSizeIndex = null;
      } else {
        this.selectedProduct = null;
        this.calculatedPrice = 0;
        this.selectedColorIndex = null;
        this.selectedSizeIndex = null;
      }
    },
    selectColor(index) {
      if (this.selectedProduct && this.selectedProduct.colors && this.selectedProduct.colors[index]) {
        this.selectedColorIndex = index;
      }
    },
    selectSize(index) {
      if (this.selectedProduct && this.selectedProduct.sizes && this.selectedProduct.sizes[index]) {
        this.selectedSizeIndex = index;
      }
    },

    // Cập nhật action addProduct để lưu vào API
    async addProduct(newProduct) {
      try {
        await axios.post(API_URL, newProduct);
        // Cập nhật state sau khi thêm thành công bằng cách fetch lại dữ liệu
        await this.fetchProducts();
      } catch (error) {
        console.error('Error adding product:', error);
      }
    },

    // Cập nhật action updateProduct để lưu vào API
    async updateProduct(updatedProduct) {
      try {
        await axios.put(`${API_URL}/${updatedProduct.id}`, updatedProduct);
        // Cập nhật state sau khi sửa thành công bằng cách fetch lại dữ liệu
        await this.fetchProducts();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    },

    // Cập nhật action deleteProduct để lưu vào API
    async deleteProduct(productId) {
      try {
        await axios.delete(`${API_URL}/${productId}`);
        // Cập nhật state sau khi xóa thành công bằng cách fetch lại dữ liệu
        await this.fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    },
  },
});