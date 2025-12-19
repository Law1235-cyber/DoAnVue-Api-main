<template>
  <div class="admin-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <i class="fas fa-shoe-prints logo-icon"></i>
        <span class="brand-name">Adidas Admin</span>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard">
          <i class="fas fa-chart-line"></i> <span>Thống kê</span>
        </router-link>
        <router-link to="/admin/products">
          <i class="fas fa-box"></i> <span>Sản phẩm</span>
        </router-link>
        <router-link to="/admin/orders">
          <i class="fas fa-shopping-cart"></i> <span>Đơn hàng</span>
        </router-link>
        <router-link to="/admin/users">
          <i class="fas fa-users"></i> <span>Người dùng</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button @click="logout" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Đăng xuất</button>
      </div>
    </aside>

    <div class="main-wrapper">
      <header class="top-header">
        <AppHeader /> 
      </header>

      <main class="content-body">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from "../AppHeader.vue"; 
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    localStorage.removeItem('userLogin');
    localStorage.removeItem('authToken');
    router.push('/auth');
  }
};
</script>

<style scoped>
/* =========================================
   1. GLOBAL LAYOUT
   ========================================= */
.admin-container {
    background-color: #f8fafc;
    min-height: 100vh;
    font-family: 'Segoe UI', sans-serif;
    position: relative;
    display: flex;
}

/* =========================================
   2. SIDEBAR (Fixed Left)
   ========================================= */
.sidebar {
    width: 260px;
    background-color: #0f172a;
    color: #f1f5f9;
    flex-shrink: 0;
    height: 100vh;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 15px rgba(0,0,0,0.1);
}

.sidebar-header {
    height: 70px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    background-color: #020617;
    border-bottom: 1px solid #1e293b;
    gap: 12px;
}
.logo-icon { font-size: 1.5rem; color: #3b82f6; }
.brand-name { font-size: 1.25rem; font-weight: 700; }
.sidebar-nav { flex: 1; padding: 20px 0; overflow-y: auto; }
.sidebar-nav a {
    display: flex; align-items: center; padding: 14px 24px;
    color: #94a3b8; text-decoration: none; font-weight: 500;
    transition: all 0.2s; border-left: 3px solid transparent;
}
.sidebar-nav a i { width: 24px; margin-right: 12px; text-align: center; font-size: 1.1rem; }
.sidebar-nav a:hover { background-color: #1e293b; color: white; }

/* Active link style */
.sidebar-nav a.router-link-exact-active {
    background-color: #1e293b;
    color: #3b82f6;
    border-left-color: #3b82f6;
}

.sidebar-footer { padding: 20px; border-top: 1px solid #1e293b; background-color: #0f172a; }
.logout-btn {
    width: 100%; padding: 10px; border: 1px solid #ef4444; color: #ef4444;
    background: transparent; border-radius: 6px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
}
.logout-btn:hover { background: #ef4444; color: white; }

/* =========================================
   3. MAIN CONTENT
   ========================================= */
.main-wrapper {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.top-header {
    background: white;
    min-height: 70px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    position: sticky; top: 0; z-index: 900;
    width: 100%; display: flex; align-items: center;
}
.top-header :deep(header), 
.top-header :deep(.container), 
.top-header :deep(.navbar) {
    position: static !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 30px !important;
    box-shadow: none !important;
    background: transparent !important;
    transform: none !important;
}

.content-body { padding: 30px; flex: 1; overflow-x: hidden; }

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
