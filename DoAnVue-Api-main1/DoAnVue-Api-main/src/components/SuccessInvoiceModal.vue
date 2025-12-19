<script setup>
/* global defineProps */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  orderId: {
    type: String,
    required: true
  }
});

const router = useRouter();

// State
const isLoading = ref(false);
const error = ref(null);
const orderData = ref(null);

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  if (!value && value !== 0) return '0';
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value);
};

// Hàm định dạng ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Hàm gọi API
const fetchOrderDetails = async () => {
  if (!props.orderId) return;

  isLoading.value = true;
  error.value = null;
  orderData.value = null;

  try {
    const response = await fetch(`http://localhost:8082/api/orders/${props.orderId}`);
    
    if (!response.ok) {
      throw new Error(`Lỗi kết nối: ${response.status}`);
    }

    const data = await response.json();
    orderData.value = data; 

  } catch (err) {
    console.error("Fetch error:", err);
    error.value = "Không thể tải dữ liệu đơn hàng. Vui lòng thử lại.";
  } finally {
    isLoading.value = false;
  }
};

// Gọi API khi component được mounted
onMounted(() => {
  fetchOrderDetails();
});

const handleDownload = () => {
  if (orderData.value) {
    alert("Tính năng in hóa đơn đang phát triển.");
  }
};

const goToHome = () => {
  router.push({ name: 'Home' });
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    
    <div class="w-full max-w-lg rounded-2xl bg-white shadow-xl">
      
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        <p class="mt-4 text-sm font-medium text-gray-500">Đang đồng bộ dữ liệu đơn hàng...</p>
      </div>

      <div v-else-if="error" class="text-center py-10 px-6">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-4">
          <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900">Không tìm thấy đơn hàng</h3>
        <p class="text-sm text-gray-500 mt-2">{{ error }}</p>
        <button @click="goToHome" class="mt-6 w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200">
          Về Trang Chủ
        </button>
      </div>

      <div v-else-if="orderData">
        <div class="bg-green-50 p-6 text-center border-b border-green-100 rounded-t-2xl">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mb-3 shadow-sm">
            <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Thanh toán thành công!</h3>
          <p class="text-sm text-gray-500 mt-1">Mã đơn: <span class="font-mono font-bold text-gray-700">#{{ orderData.id }}</span></p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p class="text-gray-500 text-xs uppercase font-semibold">Khách hàng</p>
              <p class="font-medium text-gray-900 mt-1 truncate">{{ orderData.customerName }}</p>
              <p class="text-gray-500 text-xs truncate">{{ orderData.email }}</p>
            </div>
            <div class="text-right">
              <p class="text-gray-500 text-xs uppercase font-semibold">Ngày đặt</p>
              <p class="font-medium text-gray-900 mt-1">{{ formatDate(orderData.orderDate) }}</p>
            </div>
          </div>

          <div class="rounded-lg border border-gray-100 bg-gray-50 overflow-hidden">
            <div class="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
              Chi tiết đơn hàng
            </div>
            <ul class="divide-y divide-gray-200">
              <li v-for="item in orderData.orderItems" :key="item.id" class="px-4 py-3 flex justify-between items-center">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ item.productName }}</p>
                  <p class="text-xs text-gray-500">Số lượng: {{ item.quantity }}</p>
                </div>
                <span class="text-sm font-medium text-gray-700">{{ formatCurrency(item.price * item.quantity) }}</span>
              </li>
            </ul>
            <div class="px-4 py-3 bg-white border-t border-gray-200 flex justify-between items-center">
              <span class="text-sm font-bold text-gray-900">Tổng cộng</span>
              <span class="text-lg font-bold text-blue-600">{{ formatCurrency(orderData.total) }}</span>
            </div>
          </div>
          
          <div v-if="orderData.notes" class="mt-4 text-xs text-gray-500 italic">
            <span class="font-semibold not-italic">Ghi chú:</span> {{ orderData.notes }}
          </div>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <button 
              @click="handleDownload"
              class="flex-1 inline-flex justify-center items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
            >
              <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Xuất hóa đơn
            </button>

            <button 
              @click="goToHome"
              class="flex-1 inline-flex justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
            >
              Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Removed modal-specific animations and styles */
</style>