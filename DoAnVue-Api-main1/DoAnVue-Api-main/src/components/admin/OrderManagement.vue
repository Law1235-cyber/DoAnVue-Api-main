<template>
  <div class="view-section fade-in">
    <div class="section-header">
      <h1 class="page-title">Quản Lý Đơn Hàng</h1>
    </div>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="text-center">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="orders.length === 0">
            <td colspan="6" class="text-center">Không có đơn hàng nào.</td>
          </tr>
          <tr v-for="order in orders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>
              <div class="font-bold">{{ order.customerName }}</div>
              <small style="color:gray">{{ order.phoneNumber }}</small>
            </td>
            <td class="text-price">{{ formatPrice(order.orderValue) }}</td>
            <td>{{ formatDate(order.orderDate) }}</td>
            <td>
              <span :class="getStatusClass(order.status)">
                {{ order.status || 'PENDING' }}
              </span>
            </td>
            <td>
              <button @click="deleteOrder(order.id)" class="btn-icon delete"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from 'axios';

const API_URL = "http://localhost:8082/api";

const orders = ref([]);
const loading = ref(false);

onMounted(async () => {
    await loadOrders();
});

const loadOrders = async () => {
    loading.value = true;
    try {
        const response = await axios.get(`${API_URL}/orders`);
        orders.value = response.data || [];
    } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Không thể tải danh sách đơn hàng.");
    } finally {
        loading.value = false;
    }
};

const deleteOrder = async (id) => {
    if (confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
        try {
            await axios.delete(`${API_URL}/orders/${id}`);
            await loadOrders(); // Refresh the list
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("Xóa đơn hàng thất bại.");
        }
    }
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';

const getStatusClass = (s) => {
    if (!s) return 'badge warning';
    s = s.toUpperCase();
    if (s === 'PAID') return 'badge success';
    if (s === 'CANCELLED') return 'badge danger';
    return 'badge warning';
};
</script>

<style scoped>
.view-section { animation: fadeIn 0.5s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.section-header { margin-bottom: 24px; }
.page-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; }

.table-container {
    background: white; border-radius: 12px; overflow: hidden;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;
}
.data-table { width: 100%; border-collapse: collapse; }
.data-table th {
    background: #f8fafc; color: #475569; font-weight: 600; font-size: 0.8rem;
    padding: 16px 24px; text-align: left; border-bottom: 1px solid #e2e8f0; text-transform: uppercase;
}
.data-table td { padding: 16px 24px; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #f8fafc; }

.text-price { font-family: monospace; color: #2563eb; font-weight: 700; font-size: 1rem; }
.font-bold { font-weight: 600; color: #0f172a; }
.text-center { text-align: center; }

.badge { padding: 5px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; display: inline-block; }
.badge.success { background: #dcfce7; color: #15803d; }
.badge.warning { background: #fef9c3; color: #a16207; }
.badge.danger { background: #fee2e2; color: #b91c1c; }

.btn-icon { width: 32px; height: 32px; border-radius: 6px; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.2s; }
.delete { background: #fef2f2; color: #ef4444; } .delete:hover { background: #fee2e2; }
</style>
