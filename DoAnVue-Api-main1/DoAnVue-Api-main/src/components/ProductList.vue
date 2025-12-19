<template>
  <div>
    <Header />

    <main>
      <div class="product-list-container">
        <h1>ALL PRODUCTS</h1>

        <div class="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            v-model="searchQuery"
            @input="handleSearch"
          />
          <span class="search-icon">🔍</span>
        </div>

        <div class="filters">
          <div class="filter-group">
            <span>Loại:</span>
            <button
              v-for="cat in categories"
              :key="cat"
              :class="['filter-btn', { active: selectedCategory === cat }]"
              @click="filterByCategory(cat)"
            >
              {{ cat }}
            </button>
          </div>

          <div class="filter-group">
            <span>Màu:</span>
            <button
              v-for="color in colors"
              :key="color"
              :class="['filter-btn', { active: selectedColor === color }]"
              @click="filterByColor(color)"
            >
              {{ color }}
            </button>
          </div>
        </div>

        <div class="sort-bar">
          <label for="sort">Sắp xếp:</label>
          <select id="sort" v-model="sortOption" @change="handleSort">
            <option value="name-asc">Tên: A → Z</option>
            <option value="name-desc">Tên: Z → A</option>
            <option value="price-asc">Giá: Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
          </select>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading">
          Đang tải sản phẩm...
        </div>

        <!-- Products grid -->
        <div v-else class="product-grid">
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="product-card"
          >
            <div class="product-image-container">
              <img
                :src="getMainImage(product)"
                :alt="product.name"
                class="product-image"
              />
              <img
                :src="getHoverImage(product)"
                :alt="product.name"
                class="product-image-hover"
              />
              <div v-if="product.featured" class="featured-badge">Nổi bật</div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-category">{{ product.category }}</p>
              <p class="product-price">${{ product.price }}</p>
              <div class="product-rating">
                <span class="rating-stars">★★★★★</span>
                <span class="rating-text">{{ product.rating }}</span>
              </div>
              <router-link
                :to="`/product/${product.id}`"
                class="view-details-btn"
              >
                View Details
              </router-link>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="!loading && filteredProducts.length === 0" class="empty-state">
          Không tìm thấy sản phẩm nào.
        </div>

        <!-- Pagination -->
        <div v-if="filteredProducts.length > 0" class="pagination">
          <button
            :disabled="currentPage === 1"
            @click="prevPage"
            class="pagination-btn"
          >
            Previous
          </button>

          <span class="page-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>

          <button
            :disabled="currentPage === totalPages"
            @click="nextPage"
            class="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </main>

    <Foot />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useProductStore } from "@/stores/productStore";
import Header from "./AppHeader.vue";
import Foot from "./Foot.vue";

const store = useProductStore();
const currentPage = ref(1);
const itemsPerPage = ref(8);
const searchQuery = ref("");
const loading = ref(false);

// Filter states
const categories = ref(["Tất cả", "Giày thể thao", "Giày thời trang"]);
const colors = ref(["Tất cả", "White", "Black", "Green", "Blue", "Pink", "Yellow", "Grey"]);
const selectedCategory = ref("Tất cả");
const selectedColor = ref("Tất cả");

// Sort state
const sortOption = ref("name-asc");

// Products data
const products = ref([]);
const filteredProducts = ref([]);

onMounted(async () => {
  await loadProducts();
});

// Load products from API
const loadProducts = async () => {
  loading.value = true;
  try {
    await store.fetchProducts();
    products.value = store.products || [];
    filteredProducts.value = [...products.value];
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm:', error);
  } finally {
    loading.value = false;
  }
};

// Get main image for product
const getMainImage = (product) => {
  if (product.images && product.images.length > 0) {
    return product.images[0].imageUrl || product.image;
  }
  return product.image || '/placeholder-image.jpg';
};

// Get hover image for product
const getHoverImage = (product) => {
  if (product.images && product.images.length > 1) {
    return product.images[1].imageUrl || product.hoverImage;
  }
  return product.hoverImage || product.image || '/placeholder-image.jpg';
};

// Search handler with debounce
let searchTimeout;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 300);
};

// Filter by category
const filterByCategory = (category) => {
  selectedCategory.value = category;
  applyFilters();
};

// Filter by color
const filterByColor = (color) => {
  selectedColor.value = color;
  applyFilters();
};

// Handle sort change
const handleSort = () => {
  applyFilters();
};

// Apply all filters and sorting
const applyFilters = () => {
  currentPage.value = 1; // Reset to first page when filters change
  
  let filtered = [...products.value];

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    );
  }

  // Filter by category
  if (selectedCategory.value !== "Tất cả") {
    filtered = filtered.filter(product => 
      product.category === selectedCategory.value
    );
  }

  // Filter by color
  if (selectedColor.value !== "Tất cả") {
    filtered = filtered.filter(product => 
      product.colors && product.colors.some(color => 
        color.colorName === selectedColor.value
      )
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortOption.value) {
      case "name-asc":
        return a.name.localeCompare(b.name, "vi", { sensitivity: "base" });
      case "name-desc":
        return b.name.localeCompare(a.name, "vi", { sensitivity: "base" });
      case "price-asc":
        return (a.price || 0) - (b.price || 0);
      case "price-desc":
        return (b.price || 0) - (a.price || 0);
      default:
        return 0;
    }
  });

  filteredProducts.value = filtered;
};

// Computed properties for pagination
const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return filteredProducts.value.slice(startIndex, startIndex + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Watch for store changes
watch(() => store.products, (newProducts) => {
  if (newProducts) {
    products.value = newProducts;
    applyFilters();
  }
});
</script>

<style scoped>
.product-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

/* Search bar */
.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
}

.search-bar input {
  padding: 10px 40px 10px 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 300px;
  font-size: 1rem;
}

.search-icon {
  position: absolute;
  right: calc(50% - 150px + 10px);
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

/* Filters */
.filters {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-group span {
  font-weight: bold;
  color: #333;
}

.filter-btn {
  padding: 6px 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.filter-btn:hover {
  border-color: #666;
}

.filter-btn.active {
  background: #000;
  color: white;
  border-color: #000;
}

/* Sort bar */
.sort-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  margin: 10px 0 20px;
}

.sort-bar label {
  font-weight: bold;
  color: #333;
}

.sort-bar select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
}

/* Loading */
.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
  color: #666;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.1rem;
}

/* Product grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.3s;
  background: white;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.product-image,
.product-image-hover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
}

.product-image-hover {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}

.product-card:hover .product-image {
  opacity: 0;
}

.product-card:hover .product-image-hover {
  opacity: 1;
}

.featured-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #e53935;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.product-info {
  padding: 15px;
  text-align: center;
}

.product-name {
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #333;
  font-weight: bold;
}

.product-category {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.product-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #e53935;
  margin-bottom: 10px;
}

.product-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-bottom: 15px;
}

.rating-stars {
  color: #ffc107;
  font-size: 0.9rem;
}

.rating-text {
  font-size: 0.9rem;
  color: #666;
}

.view-details-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.view-details-btn:hover {
  background-color: #555;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.pagination-btn {
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #555;
}

.pagination-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.page-info {
  color: #333;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .filters {
    flex-direction: column;
    gap: 20px;
  }
  
  .filter-group {
    justify-content: center;
  }
}
</style>