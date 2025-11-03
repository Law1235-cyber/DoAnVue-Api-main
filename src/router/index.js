import { createRouter, createWebHistory } from "vue-router";
import HomePage from '@/components/HomePage.vue';
import ProductDetail from '@/components/ProductDetail.vue';
import ProductList from '@/components/ProductList.vue';
import AuthPage from "@/components/AuthPage.vue";
import BlogList from "@/components/BlogList.vue";
import BlogDetail from '@/components/BlogDetail.vue';
import CartModal  from '@/components/CartModal.vue';
import CheckoutPage from '@/components/CheckoutPage.vue';
import FavoritesPage from '@/components/FavoritesPage.vue';
import AdminProductPage from "../components/AdminProductPage.vue";


const routes = [
 
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
  },
  {
    path: '/product',
    name: 'ProductList',
    component: ProductList,
  },
  {
    path: '/auth',
    component: AuthPage,
  },
  {
    path: '/blog', 
    name: 'Blog',
    component: BlogList,
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: BlogDetail,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartModal,
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutPage,
  },
  {
  path: '/favoritesPage', 
  name: 'Favorites',
  component: FavoritesPage,
},
{
    path: '/admin', // Đường dẫn mới cho trang admin
    name: 'AdminProducts',
    component: AdminProductPage,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;
