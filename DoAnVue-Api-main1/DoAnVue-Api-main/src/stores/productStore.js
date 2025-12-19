import { defineStore } from 'pinia';
import axios from 'axios';

// Spring Boot API endpoints
const API_BASE_URL = 'http://localhost:8082/api';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    collections: [],
    selectedProduct: null,
    selectedColorIndex: 0,
    selectedSizeIndex: 0,
    calculatedPrice: 0,
    defaultFeaturedIds: ['1', '2', '3', '4'] // Mặc định sản phẩm nổi bật là ID 1,2,3,4
  }),

  getters: {
    highlightProducts: (state) => {
      console.log('🔍 All products for filtering:', state.products);
      
      if (!state.products || !Array.isArray(state.products)) {
        console.warn('⚠️ Products is not an array:', state.products);
        return [];
      }
      
      // Lọc sản phẩm nổi bật theo ID mặc định: 1,2,3,4
      const featuredProducts = state.defaultFeaturedIds
        .map(id => state.products.find(product => product.id === id))
        .filter(product => product !== undefined);
      
      console.log('🎯 Default featured products found:', featuredProducts.length);
      
      // Nếu có đủ 4 sản phẩm mặc định, trả về
      if (featuredProducts.length >= 4) {
        return featuredProducts.slice(0, 4);
      }
      
      // Nếu không đủ, bổ sung bằng sản phẩm featured từ API
      const apiFeaturedProducts = state.products.filter(product => 
        product && (product.featured === true || product.featured === 1 || product.featured === 'true')
      );
      
      console.log('🔄 API featured products found:', apiFeaturedProducts.length);
      
      // Kết hợp sản phẩm mặc định và sản phẩm featured từ API
      const combinedProducts = [...featuredProducts];
      apiFeaturedProducts.forEach(product => {
        if (!combinedProducts.find(p => p.id === product.id) && combinedProducts.length < 4) {
          combinedProducts.push(product);
        }
      });
      
      console.log('📦 Final featured products:', combinedProducts.length);
      return combinedProducts.slice(0, 4);
    },

    // Getter để lấy sản phẩm mặc định theo ID
    defaultFeaturedProducts: (state) => {
      if (!state.products || !Array.isArray(state.products)) {
        return [];
      }
      
      return state.defaultFeaturedIds
        .map(id => state.products.find(product => product.id === id))
        .filter(product => product !== undefined)
        .slice(0, 4);
    }
  },

  actions: {
    async fetchProducts() {
      try {
        console.log('🚀 Fetching products from Spring Boot API...');
        
        // Fetch products từ Spring Boot API
        const productsResponse = await axios.get(`${API_BASE_URL}/products`);
        console.log('✅ Products response received');
        
        this.products = Array.isArray(productsResponse.data) ? productsResponse.data : [];
        
        // DEBUG: Kiểm tra structure của products
        console.log('📊 Products structure analysis:');
        this.products.forEach((product, index) => {
          console.log(`Product ${index}:`, {
            id: product.id,
            name: product.name,
            featured: product.featured,
            price: product.price,
            category: product.category
          });
        });
        
        // Fetch collections từ Spring Boot API (giữ nguyên)
        try {
          const collectionsResponse = await axios.get(`${API_BASE_URL}/collections`);
          console.log('✅ Collections response received');
          this.collections = Array.isArray(collectionsResponse.data) ? collectionsResponse.data : [];
        } catch (collectionsError) {
          console.warn('⚠️ Collections endpoint not available:', collectionsError);
          this.collections = [];
        }
        
        console.log('✅ Total products loaded:', this.products.length);
        console.log('✅ Total collections loaded:', this.collections.length);
        
        // Kiểm tra xem có sản phẩm mặc định không
        this.checkDefaultFeaturedProducts();
        
      } catch (error) {
        console.error('❌ Error fetching from Spring Boot API:', error);
        // Fallback to local JSON nếu API fails
        await this.fetchFromLocalJson();
      }
    },

    async fetchFromLocalJson() {
      try {
        console.log('🔄 Falling back to local JSON...');
        const response = await axios.get('/pro.json');
        
        this.products = Array.isArray(response.data?.products) ? response.data.products : [];
        this.collections = Array.isArray(response.data?.collections) ? response.data.collections : [];
        
        console.log('✅ Local JSON fallback successful');
        
      } catch (error) {
        console.error('❌ Error fetching from local JSON:', error);
        this.products = [];
        this.collections = [];
      }
    },

    // Action để fetch product với full details (bao gồm images, colors, sizes, videos)
    async fetchProductById(id) {
      try {
        console.log('🔍 Fetching product details for ID:', id);
        
        // Sử dụng endpoint với details để lấy đầy đủ thông tin
        const response = await axios.get(`${API_BASE_URL}/products/${id}/details`);
        console.log('✅ Product details response:', response.data);
        
        this.selectedProduct = response.data;
        
        // Reset selected indexes
        this.selectedColorIndex = 0;
        this.selectedSizeIndex = 0;
        this.calculatedPrice = response.data?.price || 0;
        
        console.log('✅ Product set successfully:', this.selectedProduct?.name);
        
        return this.selectedProduct;
        
      } catch (error) {
        console.error('❌ Error fetching product details from API:', error);
        
        // Fallback: thử fetch product cơ bản
        try {
          const basicResponse = await axios.get(`${API_BASE_URL}/products/${id}`);
          this.selectedProduct = basicResponse.data;
          this.selectedColorIndex = 0;
          this.selectedSizeIndex = 0;
          this.calculatedPrice = basicResponse.data?.price || 0;
          console.log('✅ Basic product info found:', this.selectedProduct?.name);
          return this.selectedProduct;
        } catch (fallbackError) {
          console.error('❌ Error fetching basic product info:', fallbackError);
          throw error;
        }
      }
    },

    // Action mới để fetch product với videos
    async fetchProductWithVideos(id) {
      try {
        console.log('🎥 Fetching product with videos for ID:', id);
        
        const response = await axios.get(`${API_BASE_URL}/products/${id}/videos`);
        console.log('✅ Product with videos response:', response.data);
        
        this.selectedProduct = response.data;
        this.selectedColorIndex = 0;
        this.selectedSizeIndex = 0;
        this.calculatedPrice = response.data?.price || 0;
        
        console.log('✅ Product with videos set successfully:', this.selectedProduct?.name);
        
        return this.selectedProduct;
        
      } catch (error) {
        console.error('❌ Error fetching product with videos:', error);
        
        // Fallback to regular product details
        return await this.fetchProductById(id);
      }
    },

    // Action cũ (giữ cho tương thích)
    async setProductById(id) {
      return await this.fetchProductById(id);
    },

    selectColor(index) {
      if (this.selectedProduct && 
          Array.isArray(this.selectedProduct.colors) && 
          this.selectedProduct.colors[index]) {
        this.selectedColorIndex = index;
        console.log('🎨 Color selected:', index);
      }
    },

    selectSize(index) {
      if (this.selectedProduct && 
          Array.isArray(this.selectedProduct.sizes) && 
          this.selectedProduct.sizes[index]) {
        this.selectedSizeIndex = index;
        console.log('📏 Size selected:', index);
      }
    },

    // Kiểm tra sản phẩm mặc định
    checkDefaultFeaturedProducts() {
      const missingProducts = this.defaultFeaturedIds.filter(id => 
        !this.products.find(product => product.id === id)
      );
      
      if (missingProducts.length > 0) {
        console.warn('⚠️ Missing default featured products:', missingProducts);
      } else {
        console.log('✅ All default featured products are available:', this.defaultFeaturedIds);
        
        // Log thông tin các sản phẩm mặc định
        this.defaultFeaturedIds.forEach(id => {
          const product = this.products.find(p => p.id === id);
          if (product) {
            console.log(`📦 Default featured product: ${product.name} (ID: ${product.id})`);
          }
        });
      }
    },

    // CRUD operations với Spring Boot API (giữ nguyên)
    async addProduct(newProduct) {
      try {
        const response = await axios.post(`${API_BASE_URL}/products`, newProduct);
        await this.fetchProducts(); // Refresh data
        return response.data;
      } catch (error) {
        console.error('Error adding product:', error);
        throw error;
      }
    },

    async updateProduct(updatedProduct) {
      try {
        const response = await axios.put(`${API_BASE_URL}/products/${updatedProduct.id}`, updatedProduct);
        await this.fetchProducts(); // Refresh data
        return response.data;
      } catch (error) {
        console.error('Error updating product:', error);
        throw error;
      }
    },

    async deleteProduct(productId) {
      try {
        await axios.delete(`${API_BASE_URL}/products/${productId}`);
        await this.fetchProducts(); // Refresh data
      } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
    },

    // Collection operations (giữ nguyên)
    async addCollection(newCollection) {
      try {
        const response = await axios.post(`${API_BASE_URL}/collections`, newCollection);
        await this.fetchProducts(); // Refresh data
        return response.data;
      } catch (error) {
        console.error('Error adding collection:', error);
        throw error;
      }
    },

    async updateCollection(updatedCollection) {
      try {
        const response = await axios.put(`${API_BASE_URL}/collections/${updatedCollection.id}`, updatedCollection);
        await this.fetchProducts(); // Refresh data
        return response.data;
      } catch (error) {
        console.error('Error updating collection:', error);
        throw error;
      }
    },

    async deleteCollection(collectionId) {
      try {
        await axios.delete(`${API_BASE_URL}/collections/${collectionId}`);
        await this.fetchProducts(); // Refresh data
      } catch (error) {
        console.error('Error deleting collection:', error);
        throw error;
      }
    },
  },
});