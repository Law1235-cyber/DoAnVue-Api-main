<template>
  <div class="view-section fade-in">
    <div class="section-header">
      <h1 class="page-title">Tổng Quan Doanh Thu</h1>
      <button @click="exportRevenueReport" class="btn btn-warning glow-effect">
        <i class="fas fa-file-export"></i> Xuất Báo Cáo Excel
      </button>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="icon"><i class="fas fa-dollar-sign"></i></div>
        <div class="info">
          <h3>Tổng Doanh Thu</h3>
          <p>{{ formatPrice(stats.totalRevenue) }}</p>
        </div>
      </div>
      <div class="stat-card green">
        <div class="icon"><i class="fas fa-calendar-check"></i></div>
        <div class="info">
          <h3>Tháng Này</h3>
          <p>{{ formatPrice(stats.monthlyRevenue) }}</p>
        </div>
      </div>
      <div class="stat-card orange">
        <div class="icon"><i class="fas fa-shopping-bag"></i></div>
        <div class="info">
          <h3>Đơn Hàng</h3>
          <p>{{ stats.totalOrders }}</p>
        </div>
      </div>
      <div class="stat-card purple">
        <div class="icon"><i class="fas fa-box-open"></i></div>
        <div class="info">
          <h3>Sản Phẩm</h3>
          <p>{{ productCount }}</p>
        </div>
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-box main-chart">
        <h3><i class="fas fa-chart-bar"></i> Biểu đồ doanh thu</h3>
        <div class="chart-wrapper">
          <Bar v-if="chartData.revenue" :data="chartData.revenue" :options="chartOptions.bar" />
        </div>
      </div>
      <div class="chart-box pie-chart">
        <h3><i class="fas fa-chart-pie"></i> Trạng thái đơn</h3>
        <div class="chart-wrapper">
          <Doughnut v-if="chartData.status" :data="chartData.status" :options="chartOptions.pie" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const API_URL = "http://localhost:8082/api";

const stats = reactive({ totalRevenue: 0, monthlyRevenue: 0, totalOrders: 0 });
const chartData = reactive({ revenue: null, status: null });
const chartOptions = { 
    bar: { responsive: true, maintainAspectRatio: false }, 
    pie: { responsive: true, maintainAspectRatio: false } 
};
const productCount = ref(0);
const users = ref([]);
const orders = ref([]);

onMounted(async () => {
    await loadDashboardData();
});

const loadDashboardData = async () => {
    try {
        const [resProducts, resUsers, resOrders] = await Promise.all([
            axios.get(`${API_URL}/products`).catch(() => ({ data: [] })),
            axios.get(`${API_URL}/users`).catch(() => ({ data: [] })), 
            axios.get(`${API_URL}/orders`).catch(() => ({ data: [] }))
        ]);

        productCount.value = resProducts.data.length;
        users.value = resUsers.data || [];
        orders.value = resOrders.data || [];
        
        calculateStats(); 
    } catch (error) {
        console.error("System Error:", error);
    }
};

const calculateStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let totalRev = 0;
    let monthRev = 0;
    const monthlyData = Array(12).fill(0);
    const statusCounts = { 'PENDING': 0, 'PAID': 0, 'CANCELLED': 0 };

    if (orders.value.length > 0) {
        orders.value.forEach(order => {
            const val = parseFloat(order.orderValue) || 0;
            const date = new Date(order.orderDate);
            const status = order.status ? order.status.toUpperCase() : 'PENDING';

            totalRev += val;

            if (statusCounts[status] !== undefined) statusCounts[status]++;
            else statusCounts['PENDING']++;

            if (!isNaN(date.getTime()) && date.getFullYear() === currentYear) {
                monthlyData[date.getMonth()] += val;
                if (date.getMonth() === currentMonth) {
                    monthRev += val;
                }
            }
        });
    }

    stats.totalRevenue = totalRev;
    stats.monthlyRevenue = monthRev;
    stats.totalOrders = orders.value.length;

    chartData.revenue = {
        labels: ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'],
        datasets: [{ label: 'Doanh thu (VNĐ)', backgroundColor: '#3b82f6', data: monthlyData }]
    };
    
    chartData.status = {
        labels: Object.keys(statusCounts),
        datasets: [{ backgroundColor: ['#f59e0b', '#10b981', '#ef4444'], data: Object.values(statusCounts) }]
    };
};

const exportRevenueReport = () => {
    const summaryData = [
        { 'Chỉ số': 'Thời gian xuất báo cáo', 'Giá trị': new Date().toLocaleString('vi-VN') },
        { 'Chỉ số': 'Tổng Doanh Thu', 'Giá trị': stats.totalRevenue },
        { 'Chỉ số': 'Doanh Thu Tháng Này', 'Giá trị': stats.monthlyRevenue },
        { 'Chỉ số': 'Tổng Đơn Hàng', 'Giá trị': stats.totalOrders },
        { 'Chỉ số': 'Tổng Sản Phẩm', 'Giá trị': productCount.value },
        { 'Chỉ số': 'Tổng Người Dùng', 'Giá trị': users.value.length }
    ];

    const detailsData = orders.value.map(order => ({
        'Mã Đơn Hàng': order.id,
        'Khách Hàng': order.customerName,
        'Email': order.email,
        'SĐT': order.phoneNumber,
        'Ngày Đặt': formatDate(order.orderDate),
        'Tổng Tiền (VNĐ)': order.orderValue,
        'Trạng Thái': order.status || 'PENDING'
    }));

    const workbook = XLSX.utils.book_new();
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    const wsDetails = XLSX.utils.json_to_sheet(detailsData);

    wsSummary['!cols'] = [{ wch: 25 }, { wch: 30 }];
    wsDetails['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }];

    XLSX.utils.book_append_sheet(workbook, wsSummary, "Tổng Quan");
    XLSX.utils.book_append_sheet(workbook, wsDetails, "Chi Tiết Đơn Hàng");

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `BaoCao_DoanhThu_${dateStr}.xlsx`);
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';
</script>

<style scoped>
.view-section { animation: fadeIn 0.5s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; }

.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 30px; }
.stat-card {
    background: white; padding: 24px; border-radius: 12px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 20px;
}
.stat-card .icon {
    width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; color: white; flex-shrink: 0;
}
.stat-card.blue .icon { background: #3b82f6; }
.stat-card.green .icon { background: #10b981; }
.stat-card.orange .icon { background: #f59e0b; }
.stat-card.purple .icon { background: #8b5cf6; }
.stat-card .info h3 { margin: 0; font-size: 0.85rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
.stat-card .info p { margin: 5px 0 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }

.charts-container { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
.chart-box {
    background: white; padding: 24px; border-radius: 12px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05); height: 400px; display: flex; flex-direction: column;
}
.chart-box h3 {
    margin: 0 0 20px 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 8px;
}
.chart-wrapper { flex: 1; position: relative; }

.btn { padding: 8px 16px; border-radius: 6px; border: none; font-weight: 600; cursor: pointer; color: white; display: flex; align-items: center; gap: 8px; }
.btn-warning { background: #f59e0b; color: white; } .btn-warning:hover { background: #d97706; }

.glow-effect { animation: glow 2s infinite; }
@keyframes glow {
    0% { box-shadow: 0 0 5px #f59e0b; }
    50% { box-shadow: 0 0 15px #f59e0b; }
    100% { box-shadow: 0 0 5px #f59e0b; }
}

@media (max-width: 1024px) {
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .charts-container { grid-template-columns: 1fr; }
}
</style>
