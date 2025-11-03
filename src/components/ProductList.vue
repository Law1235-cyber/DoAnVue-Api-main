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
              @click="selectedCategory = cat"
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
              @click="selectedColor = color"
            >
              {{ color }}
            </button>
          </div>
        </div>

        <div
          class="sort-bar"
          style="display:flex;align-items:center;gap:8px;justify-content:flex-end;margin:10px 0 20px;"
        >
          <label for="sort">Sắp xếp:</label>
          <select id="sort" v-model="sortOption">
            <option value="name-asc">Tên: A → Z</option>
            <option value="name-desc">Tên: Z → A</option>
            <option value="price-asc">Giá: Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
          </select>
        </div>

        <div class="product-grid">
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="product-card"
          >
            <div class="product-image-container">
              <img
                :src="product.images[0]"
                :alt="product.name"
                class="product-image"
              />
              <img
                :src="product.images[1]"
                :alt="product.name"
                class="product-image-hover"
              />
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-price">${{ product.price }}</p>
              <router-link
                :to="`/product/${product.id}`"
                class="view-details-btn"
              >
                View Details
              </router-link>
            </div>
          </div>
        </div>

        <div class="pagination">
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
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "@/stores/productStore";
import Header from "./AppHeader.vue";
import Foot from "./Foot.vue";

const store = useProductStore();
const currentPage = ref(1);
const itemsPerPage = ref(8);
const searchQuery = ref("");

// Filter states
const categories = ["Tất cả", "Giày thể thao", "Giày thời trang"];
const colors = ["Tất cả", "Trắng", "Đen", "Xanh Lá Cây"];
const selectedCategory = ref("Tất cả");
const selectedColor = ref("Tất cả");

// Sort state
const sortOption = ref("name-asc");

onMounted(async () => {
    // Gọi action fetchProducts để lấy dữ liệu từ API khi component được mount
    await store.fetchProducts();
});

// Lọc + Sắp xếp sản phẩm
const filteredAndSortedProducts = computed(() => {
  let products = store.productDetails.filter((p) => {
    // Thêm các logic lọc theo category và color
    const matchCategory =
      selectedCategory.value === "Tất cả" || p.category === selectedCategory.value;

    const matchColor =
      selectedColor.value === "Tất cả" || (p.colors && p.colors.some(c => c.name === selectedColor.value));

    const matchSearch =
      !searchQuery.value || p.name.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchCategory && matchColor && matchSearch;
  });

  products.sort((a, b) => {
    switch (sortOption.value) {
      case "name-asc":
        return (a?.name ?? "").localeCompare(b?.name ?? "", "vi", { sensitivity: "base" });
      case "name-desc":
        return (b?.name ?? "").localeCompare(a?.name ?? "", "vi", { sensitivity: "base" });
      case "price-asc":
        return (a?.price ?? 0) - (b?.price ?? 0);
      case "price-desc":
        return (b?.price ?? 0) - (a?.price ?? 0);
      default:
        return 0;
    }
  });

  return products;
});

// Phân trang
const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return filteredAndSortedProducts.value.slice(startIndex, startIndex + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedProducts.value.length / itemsPerPage.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
</script>

<style scoped>
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
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-btn {
  padding: 6px 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.filter-btn.active {
  background: #000;
  color: white;
  border-color: #000;
}

/* Product grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.3s;
  background: white;
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

.product-info {
  padding: 15px;
  text-align: center;
}

.product-name {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #333;
}

.product-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #e53935;
  margin-bottom: 15px;
}

.view-details-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border-radius: 4px;
  text-decoration: none;
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
  border-radius: 4px;
}

.pagination-btn:disabled {
  background-color: #ccc;
}
</style>