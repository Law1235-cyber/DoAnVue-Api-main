<template>
  <div class="view-section fade-in">
    <h1 class="page-title">Quản Lý Người Dùng</h1>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="text-center">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="users.length === 0">
            <td colspan="5" class="text-center">Không có người dùng nào.</td>
          </tr>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.id }}</td>
            <td>{{ u.name }}</td>
            <td>{{ u.email }}</td>
            <td>
              <span class="badge" :class="u.is_admin ? 'admin' : 'user'">
                {{ u.is_admin ? 'Admin' : 'User' }}
              </span>
            </td>
            <td>
              <button @click="deleteUser(u.id)" class="btn-icon delete" :disabled="isCurrentUser(u.id)">
                <i class="fas fa-trash"></i>
              </button>
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

const users = ref([]);
const loading = ref(false);
const currentUserId = ref(null);

onMounted(async () => {
    const userLogin = JSON.parse(localStorage.getItem('userLogin'));
    if (userLogin) {
        currentUserId.value = userLogin.id;
    }
    await loadUsers();
});

const loadUsers = async () => {
    loading.value = true;
    try {
        const response = await axios.get(`${API_URL}/users`);
        users.value = response.data || [];
    } catch (error) {
        console.error("Error fetching users:", error);
        alert("Không thể tải danh sách người dùng.");
    } finally {
        loading.value = false;
    }
};

const deleteUser = async (id) => {
    if (isCurrentUser(id)) {
        alert("Bạn không thể xóa chính mình.");
        return;
    }
    if (confirm("Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác.")) {
        try {
            await axios.delete(`${API_URL}/users/${id}`);
            await loadUsers(); // Refresh the list
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Xóa người dùng thất bại.");
        }
    }
};

const isCurrentUser = (id) => {
    return id === currentUserId.value;
};
</script>

<style scoped>
.view-section { animation: fadeIn 0.5s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.page-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; margin-bottom: 24px; }

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
.text-center { text-align: center; }

.badge { padding: 5px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; display: inline-block; }
.badge.admin { background: #e0e7ff; color: #4338ca; }
.badge.user { background: #f1f5f9; color: #475569; }

.btn-icon { width: 32px; height: 32px; border-radius: 6px; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.2s; }
.delete { background: #fef2f2; color: #ef4444; } .delete:hover { background: #fee2e2; }
.btn-icon:disabled { background: #e5e7eb; color: #9ca3af; cursor: not-allowed; }
</style>
