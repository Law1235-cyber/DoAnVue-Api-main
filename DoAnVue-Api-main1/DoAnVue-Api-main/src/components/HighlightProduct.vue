<script setup>
import { onMounted, computed, ref } from 'vue';
import { useProductStore } from '@/stores/productStore';

const store = useProductStore();
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    await store.fetchProducts();
  } catch (err) {
    error.value = err.message;
    console.error('Error loading products:', err);
  } finally {
    isLoading.value = false;
  }
});

// TEMPORARY FIX: Hiển thị 4 sản phẩm đầu tiên nếu không có featured
const featuredProducts = computed(() => {
  const highlights = store.highlightProducts;
  
  // Nếu không có featured products, hiển thị 4 sản phẩm đầu tiên
  if (!highlights || highlights.length === 0) {
    console.log('🔄 No featured products, showing first 4 products');
    const firstFour = store.products?.slice(0, 4) || [];
    console.log('🔄 First 4 products:', firstFour);
    return firstFour;
  }
  
  return highlights;
});

const collections = computed(() => {
  return store.collections || [];
});

// DEBUG: Log để kiểm tra
const debugInfo = computed(() => {
  return {
    totalProducts: store.products?.length || 0,
    featuredCount: store.highlightProducts?.length || 0,
    showingCount: featuredProducts.value?.length || 0
  };
});
</script>

<template>
  <div class="product-section">
    <!-- Debug Info (có thể ẩn sau khi fix) -->
    <div class="debug-info" style="background: #f0f0f0; padding: 10px; margin: 10px; border-radius: 5px;">
      <small>Debug: Total: {{ debugInfo.totalProducts }} | Featured: {{ debugInfo.featuredCount }} | Showing: {{ debugInfo.showingCount }}</small>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading">
      <p>Đang tải sản phẩm...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>Lỗi khi tải sản phẩm: {{ error }}</p>
    </div>

    <!-- Success State -->
    <div v-else>
      <h1>SẢN PHẨM NỔI BẬT</h1>
      <div class="product-container">
        <div
          v-for="(product, index) in featuredProducts"
          :key="product.id"
          class="product-item"
          :class="{ highlight: index === 0 }"
        >
          <!-- Safe image rendering -->
          <img :src="product.image" :alt="product.name" />
          <img 
            v-if="product.hoverImage" 
            :src="product.hoverImage" 
            :alt="product.name" 
            class="hover-img" 
          />
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">${{ product.price?.toFixed(2) }}</div>
          <router-link :to="`/product/${product.id}`" class="buy-btn">MUA NGAY</router-link>
        </div>
        
        <!-- Empty State -->
        <div v-if="featuredProducts.length === 0" class="empty-state">
          <p>Không có sản phẩm nào để hiển thị</p>
        </div>
      </div>

      <hr />

      <h1>BỘ SƯU TẬP</h1>
      <div class="product-container">
        <div 
          v-for="collection in collections" 
          :key="collection.id" 
          class="product-item"
        >
          <img v-if="collection.image" :src="collection.image" :alt="collection.name" />
          <video v-if="collection.video" :src="collection.video" autoplay muted loop />
          <div class="product-name">{{ collection.name }}</div>
          <p>{{ collection.description }}</p>
          <a :href="collection.link || '#'" class="shopNow">XEM NGAY</a>
        </div>
        
        <!-- Empty State -->
        <div v-if="collections.length === 0" class="empty-state">
          <p>Không có bộ sưu tập</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Thêm styles cho loading, error, empty states */
.loading, .error, .empty-state {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: red;
}

.empty-state {
  color: #666;
}

.product-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 10px;
}
.product-item {
  background-color: white;
  padding: 10px;
  text-align: center;
  width: 250px;
  transition: transform 0.2s;
  position: relative;
}
.product-item .hover-img {
  position: absolute;
  top: 10px;
  left: 10px;
  transition: opacity 0.3s ease;
  opacity: 0;
}
.product-item:hover .hover-img {
  opacity: 1;
}
.product-item:hover {
  transform: scale(1.05);
}
.product-item img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
.product-name {
  font-size: 18px;
  font-weight: bold;
  margin: 10px;
}
.product-price {
  color: red;
  font-weight: bold;
  font-size: 17px;
}
.buy-btn {
  display: inline-block;
  text-decoration: none;
  background: white;
  border-radius: 10px;
  padding: 10px 15px;
  color: black;
  border: 1px solid black;
}
.buy-btn:hover {
  background: black;
  color: white;
}
.product-item video {
  width: 100%;
  height: 300px;
}
.product-item .shopNow {
  text-decoration: none;
  color: black;
  font-weight: bold;
}
h1 {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
</style>