<template>
  <header class="hero">
    <nav class="nav-bar">
      <div class="logo-container">
        <router-link to="/">
          <img src="https://hienlaptop.com/wp-content/uploads/2024/12/logo-adidas-vector-4.jpg" alt="Adidas Logo" class="adidas-logo-img" />
        </router-link>
      </div>

      <div class="nav-menu-wrapper">
        <div class="hamburger-menu" @click="toggleMenu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
        <nav :class="['nav-links', { active: isMenuActive }]">
          <ul>
            <li><router-link to="/">HOME PAGE</router-link></li>
            <li><router-link to="/product">PRODUCT</router-link></li>
            <li><router-link to="/about">ABOUT</router-link></li>
            <li><router-link to="/contact">CONTACT</router-link></li>
            <li><router-link to="/blog">BLOG</router-link></li>
            <li><router-link to="/help">HELP</router-link></li>
          </ul>
        </nav>
      </div>

      <div class="right-section-container">
        <div class="search-wrapper">
          <div class="header-search">
            <input
              v-model="searchQuery"
              @focus="showSearchDropdown = true"
              @input="onInput"
              @blur="onSearchBlur"
              @keyup.enter="onSearchClick"
              placeholder="Tìm kiếm sản phẩm..."
              type="text"
            />
            <div v-if="showSearchDropdown" class="search-dropdown">
              <div v-if="filteredProducts.length">
                <div
                  v-for="product in filteredProducts"
                  :key="product.id"
                  class="search-item"
                  @mousedown.prevent="goToProduct(product.id)"
                >
                  <img :src="product.image" alt="Product Image" class="search-item-img" />
                  <span class="search-item-name">{{ product.name }}</span>
                </div>
              </div>
              <div v-else class="search-item not-found">
                Không tìm thấy sản phẩm.
              </div>
            </div>
          </div>
        </div>

        <div class="cart-icon-wrapper" @click="showCart = true">
          <i class="fa-solid fa-cart-shopping cart-icon"></i>
          <span v-if="totalQuantity > 0" class="cart-badge">{{ totalQuantity }}</span>
        </div>

        <ul class="user-action-icons">
          <li v-if="!currentUser">
            <router-link to="/auth" class="icon-link">
              <i class="fa-solid fa-user"></i>
            </router-link>
          </li>
          <li v-else class="user-info-dropdown-wrapper" ref="userDropdownRef">
            <div
              @click.stop="toggleUserMenu"
              class="user-name-display"
            >
              <span class="user-name-text">
                {{ currentUser.name || currentUser.email || 'Người dùng' }}
              </span>
              <i class="fa-solid fa-chevron-down chevron-icon" :class="{ 'rotate-chevron': showUserMenu }"></i>
            </div>

            <div
              v-if="showUserMenu"
              :class="['logout-dropdown', { 'show-dropdown': showUserMenu }]"
            >
              <button
                @click="logout"
                class="logout-button"
              >
                Đăng xuất
              </button>
              <button v-if="currentUser?.isAdmin" class="admin_css">
                <router-link to="/admin">Admin</router-link>
              </button>
            </div>
          </li>
          <li class="favorite-icon-item">
            <router-link to="/favoritesPage" class="icon-link">
              <i class="fa-solid fa-heart heart-icon"></i>
            </router-link>
          </li>
        </ul>
      </div>

    </nav>
    <div class="box">
      <p>Use code DEAL for an extra 30% off. Exclusions apply.</p>
    </div>
    <CartModal
      :show="showCart"
      :cartItems="cartStore.items"
      @close="showCart = false"
      @update:cartItems="cartStore.items = $event"
    />


  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import CartModal from './CartModal.vue';

const router = useRouter();

// --- Logic Menu Hamburger ---
const isMenuActive = ref(false);
const toggleMenu = () => {
  isMenuActive.value = !isMenuActive.value;
};

// --- Logic Xác thực người dùng (Sử dụng localStorage) ---
const currentUser = ref(null);
const showUserMenu = ref(false); // Biến để kiểm soát hiển thị dropdown menu
const userDropdownRef = ref(null); // Ref để tham chiếu đến phần tử dropdown

onMounted(() => {
  // Lấy thông tin người dùng từ localStorage khi component được mount
  const user = localStorage.getItem('userLogin');
  if (user) {
    currentUser.value = JSON.parse(user);
  }
  console.log('Current User on mount:', currentUser.value); // Thêm log để kiểm tra currentUser

  // Thêm listener để đóng menu khi click ra ngoài
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  // Xóa listener khi component bị hủy
  document.removeEventListener('click', handleClickOutside);
});

// Phương thức để bật/tắt menu dropdown
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  console.log('showUserMenu is now:', showUserMenu.value);
};

// Phương thức xử lý đăng xuất (Sử dụng localStorage)
const logout = () => {
  // Xóa thông tin người dùng khỏi localStorage
  localStorage.removeItem('userLogin');
  currentUser.value = null; // Cập nhật trạng thái người dùng về null
  showUserMenu.value = false; // Đóng dropdown
  router.push('/'); // Đã thay đổi từ { name: 'Login' } thành '/'
};

// Phương thức để đóng menu khi click ra ngoài
const handleClickOutside = (event) => {
  // Kiểm tra nếu click không phải bên trong phần tử userDropdownRef
  // và menu đang hiển thị, thì đóng menu.
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target)) {
    showUserMenu.value = false;
  }
};


// --- Logic Giỏ hàng ---
const cartStore = useCartStore();
const showCart = ref(false);
const totalQuantity = computed(() => cartStore.totalQuantity);

// --- Logic Tìm kiếm ---
const productsStore = useProductStore();
const searchQuery = ref("");
const showSearchDropdown = ref(false);

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return [];
  return productsStore.products.filter(p =>
    p.name && p.name.toLowerCase().includes(q)
  );
});

onMounted(() => {
  if (!productsStore.products.length) productsStore.fetchProducts();
});

const onInput = () => {
  showSearchDropdown.value = !!searchQuery.value.trim();
};

const onSearchClick = () => {
  if (searchQuery.value.trim()) {
    if (filteredProducts.value.length > 0) {
      goToProduct(filteredProducts.value[0].id);
    } else {
      router.push({ name: 'SearchResults', query: { q: searchQuery.value } });
    }
    showSearchDropdown.value = false;
    searchQuery.value = "";
  }
};

const goToProduct = (id) => {
  const targetPath = `/product/${id}`;
  router.push(targetPath);
  showSearchDropdown.value = false;
  searchQuery.value = "";
};

const onSearchBlur = () => {
  setTimeout(() => {
    showSearchDropdown.value = false;
  }, 200);
};
</script>

<style scoped>
/* GENERAL STYLES - Các style chung cho header */
.hero {
  /* Có thể thêm các style nền, chiều cao cho hero section nếu cần */
  width: 100%;
}
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;    /* Căn giữa các phần tử theo chiều dọc */
  padding: 10px 20px;
  flex-wrap: wrap;        /* Giúp responsive tốt hơn */
  background-color: white; /* Đảm bảo nền trắng cho nav-bar */
}
.logo-container {
  display: flex;
  align-items: center;
}
.adidas-logo-img {
  display: flex;
  align-items: center;
  width: 100px; /* Điều chỉnh kích thước logo */
}

/* NAVIGATION LINKS */
.nav-menu-wrapper {
  display: flex;
  align-items: center;
}
.nav-links ul {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0; /* Bỏ padding mặc định của ul */
  /* background: white;  Nếu muốn nav-links có nền riêng */
  /* margin-top: 20px;  Có thể bỏ nếu không cần khoảng cách này */
}
.nav-links li a {
  text-decoration: none;
  padding: 10px 15px; /* Điều chỉnh padding cho link */
  display: block;
  color: black;
  font-weight: 500;
  transition: background-color 0.3s ease, color 0.3s ease;
  border-radius: 4px;
}
.nav-links li a:hover {
  color: white;
  background: black;
}

/* HAMBURGER MENU - Ẩn trên desktop */
.hamburger-menu {
  display: none; /* Mặc định ẩn trên màn hình lớn */
  width: 30px;
  height: 24px;
  cursor: pointer;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
}
.hamburger-menu .bar {
  display: block;
  width: 100%;
  height: 3px;
  background-color: black;
  margin: 3px 0; /* Điều chỉnh margin giữa các bar */
  transition: 0.4s;
  border-radius: 2px;
}

/* PROMOTIONAL BOX */
.box {
  text-align: center;
  background: linear-gradient(to right, #ebeff2 0%, #ebeff2 100%);
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 15px;
  color: #333;
  font-weight: 600;
}

/* RIGHT SECTION CONTAINER (Search, Cart, User/Favorite) */
.right-section-container {
  display: flex;
  align-items: center;
  gap: 20px; /* Khoảng cách giữa các item: Search, Cart, User/Favorite */
}

/* SEARCH BAR */
.search-wrapper {
  position: relative; /* Cho dropdown tìm kiếm */
  display: flex;
  align-items: center;
}
.header-search {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  padding: 5px 10px;
  width: 250px;
  /* position: relative; Removed, already on .search-wrapper */
}
.header-search input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background-color: transparent;
  padding: 0; /* Bỏ padding mặc định của input nếu có */
}

/* SEARCH DROPDOWN */
.search-dropdown {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  z-index: 9999;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  animation: fadeIn 0.25s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.search-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  cursor: pointer;
  border-bottom: 1px solid #f2f2f2;
  transition: background-color 0.2s ease;
}
.search-item:hover {
  background-color: #f5f5f5;
}
.search-item-img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 12px;
}
.search-item-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
.not-found {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 10px;
}

/* CART ICON */
.cart-icon-wrapper {
  position: relative; /* Cho badge số lượng */
  cursor: pointer;
  padding: 5px; /* Thêm padding để dễ click hơn */
  border-radius: 50%; /* Bo tròn nếu muốn */
  transition: background-color 0.2s ease;
}
.cart-icon-wrapper:hover {
  background-color: #f0f0f0; /* Hiệu ứng hover */
}
.cart-icon {
  font-size: 24px;
  color: #333;
}
.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4500; /* Màu cam nổi bật */
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  line-height: 1;
}

/* USER ACTION ICONS (User/Favorite) */
.user-action-icons {
  list-style: none; /* Bỏ dấu chấm mặc định của ul */
  margin: 0;
  padding: 0;
  display: flex; /* Quan trọng để các li nằm ngang */
  align-items: center;
}
.user-action-icons li {
  /* Khoảng cách giữa các li, nếu không dùng gap */
  /* margin-right: 20px; */
}

/* Common icon link style */
.icon-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; /* Kích thước icon */
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}
.icon-link:hover {
  background-color: #f0f0f0;
}
.icon-link .fa-solid {
  font-size: 20px; /* Kích thước Font Awesome icon */
  color: #666; /* Màu icon mặc định */
}
.icon-link .heart-icon {
  color: #e74c3c; /* Màu đỏ cho icon trái tim */
}

/* USER INFO & DROPDOWN - Custom styles for the user dropdown */
.user-info-dropdown-wrapper {
  position: relative; /* Quan trọng: để dropdown con có vị trí tuyệt đối */
  /* margin-right: 20px; */ /* Nếu bạn muốn khoảng cách với icon tiếp theo */
}
.user-name-display {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 20px; /* Bo tròn tương tự nút */
  transition: background-color 0.2s ease;
}
.user-name-display:hover {
  background-color: #f0f0f0;
}
.user-name-text {
  font-weight: 600;
  color: #333;
  font-size: 15px;
  margin-right: 5px; /* Khoảng cách giữa tên và mũi tên */
}
.chevron-icon {
  font-size: 12px;
  color: #666;
  transition: transform 0.2s ease-in-out;
}
.chevron-icon.rotate-chevron {
  transform: rotate(180deg);
}

.logout-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 160px;
  z-index: 100;
  overflow: hidden;
  opacity: 0; /* Ẩn ban đầu */
  visibility: hidden; /* Ẩn ban đầu */
  transition: opacity 0.2s ease, visibility 0.2s ease; /* Thêm transition */
}
/* Quy tắc để hiển thị dropdown */
.logout-dropdown.show-dropdown {
  opacity: 1;
  visibility: visible;
}

.logout-dropdown .logout-button {
  display: block;
  width: 100%;
  padding: 10px 15px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s ease;
}
.logout-dropdown .logout-button:hover {
  background-color: #f5f5f5;
}

/* CSS cho khoảng cách giữa các icon người dùng/tên và icon yêu thích */
.user-action-icons .favorite-icon-item {
  margin-left: 30px; /* Điều chỉnh giá trị này để khoảng cách xa hơn theo ý bạn */
}
.admin_css {
  padding: 10px 20px;
  background-color: #3498db; /* Màu xanh dương */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
  text-transform: uppercase;
}

.admin_css:hover {
  background-color: #2980b9; /* Màu tối hơn khi hover */
  transform: scale(1.05); /* Phóng to nhẹ khi hover */
}

.admin_css a {
  text-decoration: none;
  color: inherit; /* Kế thừa màu chữ từ button cha */
}
</style>