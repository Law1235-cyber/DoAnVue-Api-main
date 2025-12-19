import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage.vue";
import ProductDetail from "@/components/ProductDetail.vue";
import ProductList from "@/components/ProductList.vue";
import AuthPage from "@/components/AuthPage.vue";
import BlogList from "@/components/BlogList.vue";
import BlogDetail from "@/components/BlogDetail.vue";
import CartModal from "@/components/CartModal.vue";
import CheckoutPage from "@/components/CheckoutPage.vue";
import FavoritesPage from "@/components/FavoritesPage.vue";
import AdminLayout from "../components/admin/AdminLayout.vue";
import DashboardView from "../components/admin/DashboardView.vue";
import ProductManagement from "../components/admin/ProductManagement.vue";
import OrderManagement from "../components/admin/OrderManagement.vue";
import UserManagement from "../components/admin/UserManagement.vue";
import ResetPassword from "../components/ResetPassword.vue";
import VerifyEmail from "../components/VerifyEmail.vue"; // Import component VerifyEmail
import SuccessInvoiceModal from "../components/SuccessInvoiceModal.vue";

const requireAdmin = (to, from, next) => {
  const userLogin = localStorage.getItem('userLogin');
  if (userLogin) {
    const user = JSON.parse(userLogin);
    if (user && user.isAdmin) {
      next();
    } else {
      alert("Bạn không có quyền truy cập vào trang này!");
      next('/');
    }
  } else {
    alert("Vui lòng đăng nhập với tư cách quản trị viên!");
    next('/auth');
  }
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/product/:id",
    name: "ProductDetail",
    component: ProductDetail,
  },
  {
    path: "/product",
    name: "ProductList",
    component: ProductList,
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthPage,
  },
  {
    path: "/blog",
    name: "Blog",
    component: BlogList,
  },
  {
    path: "/blog/:id",
    name: "BlogDetail",
    component: BlogDetail,
  },
  {
    path: "/cart",
    name: "Cart",
    component: CartModal,
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: CheckoutPage,
  },
  {
    path: "/favorites",
    name: "Favorites",
    component: FavoritesPage,
  },
  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: requireAdmin,
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: DashboardView },
      { path: 'products', name: 'AdminProducts', component: ProductManagement },
      { path: 'orders', name: 'AdminOrders', component: OrderManagement },
      { path: 'users', name: 'AdminUsers', component: UserManagement },
    ]
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
  },
  // Route mới cho xác thực email
  {
    path: "/verify-email",
    name: "VerifyEmail",
    component: VerifyEmail,
    meta: {
      title: "Xác Thực Email",
    },
  },
  {
    path: "/payment-success/:orderId",
    name: "PaymentSuccess",
    component: SuccessInvoiceModal,
    props: true, // Automatically pass route params as props
    meta: {
      title: "Thanh Toán Thành Công",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Update document title
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + " | Adidas";
  } else {
    document.title = "Adidas";
  }
  next();
});

export default router;
