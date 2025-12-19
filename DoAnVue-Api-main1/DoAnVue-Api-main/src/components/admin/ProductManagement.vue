<template>
  <div class="view-section fade-in">
    <div class="section-header">
      <h1 class="page-title">Quản Lý Sản Phẩm</h1>
      <div class="actions">
        <input type="file" ref="fileInput" accept=".xlsx, .xls" style="display: none" @change="handleFileUpload" />
        <button @click="triggerFileInput" class="btn btn-success" :disabled="isImporting">
          <i class="fas" :class="isImporting ? 'fa-spinner fa-spin' : 'fa-file-excel'"></i> Import
        </button>
        <button @click="openModal('add')" class="btn btn-primary">
          <i class="fas fa-plus"></i> Thêm Mới
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th class="text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
              <td colspan="6" class="text-center">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="filteredProducts.length === 0">
              <td colspan="6" class="text-center">Không có dữ liệu sản phẩm.</td>
          </tr>
          <tr v-else v-for="p in filteredProducts" :key="p.id">
            <td>#{{ p.id }}</td>
            <td>
              <img :src="getProductImage(p)" class="table-img" />
            </td>
            <td class="font-bold">{{ p.name }}</td>
            <td class="text-price">{{ formatPrice(p.price) }}</td>
            <td><span class="badge">{{ p.category || 'N/A' }}</span></td>
            <td class="text-right">
              <button @click="openModal('edit', p)" class="btn-icon edit"><i class="fas fa-edit"></i></button>
              <button @click="deleteProduct(p.id)" class="btn-icon delete"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="modal-overlay">
        <div class="modal-content">
            <span @click="closeModal" class="close-btn">&times;</span>
            <h2>{{ modalMode === 'add' ? 'Thêm Sản Phẩm' : 'Sửa Sản Phẩm' }}</h2>
            <form @submit.prevent="saveProduct">
                <div class="form-group"><label>Tên SP</label><input v-model="productForm.name" required></div>
                <div class="form-group"><label>Giá</label><input type="number" v-model="productForm.price" required></div>
                <div class="form-group"><label>Danh mục</label>
                    <select v-model="productForm.category">
                        <option>Giày thể thao</option><option>Giày thời trang</option><option>Phụ kiện</option>
                    </select>
                </div>
                <div class="form-group"><label>Ảnh URL</label><input v-model="productForm.image"></div>
                <div class="form-actions" style="text-align: right;">
                    <button type="submit" class="btn btn-primary">Lưu lại</button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useProductStore } from "@/stores/productStore";

const API_URL = "http://localhost:8082/api";

const productStore = useProductStore();
const loading = ref(false);
const isModalOpen = ref(false);
const modalMode = ref("add");
const isImporting = ref(false);
const fileInput = ref(null);
const productForm = ref({});

onMounted(async () => {
    loading.value = true;
    try {
        await productStore.fetchProducts();
    } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
        loading.value = false;
    }
});

const filteredProducts = computed(() => productStore.products);

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
const getProductImage = (p) => p.image || 'https://via.placeholder.com/50';

const deleteProduct = async (id) => { 
    if(confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        await productStore.deleteProduct(id); 
    }
};

const openModal = (mode, p = {}) => { 
    modalMode.value = mode; 
    isModalOpen.value = true; 
    productForm.value = p ? { ...p } : {}; 
};

const closeModal = () => {
    isModalOpen.value = false;
};

const saveProduct = async () => {
    if (modalMode.value === 'add') {
        await productStore.addProduct(productForm.value);
    } else {
        await productStore.updateProduct(productForm.value);
    }
    closeModal();
};

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  isImporting.value = true;
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
      
      let count = 0;
      for (const row of jsonData) {
        const productData = {
          name: row['Tên'] || row['Name'] || row['name'],
          price: row['Giá'] || row['Price'] || row['price'],
          category: row['Danh mục'] || row['Category'] || row['category'],
          image: row['Ảnh'] || row['Image'] || row['image'],
          featured: !!(row['Nổi Bật'] || row['Featured'])
        };
        if (productData.name) {
             await axios.post(`${API_URL}/products`, productData);
             count++;
        }
      }
      alert(`Đã import thành công ${count} sản phẩm!`);
      await productStore.fetchProducts();
    } catch (err) { 
        console.error(err); 
        alert("Có lỗi xảy ra khi import file Excel. Vui lòng kiểm tra định dạng file."); 
    } finally { 
        isImporting.value = false; 
        event.target.value = null; 
    }
  };
  reader.readAsArrayBuffer(file);
};
</script>

<style scoped>
.view-section { animation: fadeIn 0.5s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; }
.actions { display: flex; gap: 10px; }

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
.table-img { width: 48px; height: 48px; border-radius: 6px; object-fit: cover; border: 1px solid #e2e8f0; }
.text-price { font-family: monospace; color: #2563eb; font-weight: 700; font-size: 1rem; }
.text-right { text-align: right; }
.font-bold { font-weight: 600; color: #0f172a; }
.text-center { text-align: center; }

.badge { padding: 5px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; display: inline-block; background: #f1f5f9; color: #475569; }

.btn { padding: 8px 16px; border-radius: 6px; border: none; font-weight: 600; cursor: pointer; color: white; display: flex; align-items: center; gap: 8px; transition: background-color 0.2s; }
.btn-primary { background: #3b82f6; } .btn-primary:hover { background: #2563eb; }
.btn-success { background: #10b981; } .btn-success:hover { background: #059669; }
.btn:disabled { background-color: #94a3b8; cursor: not-allowed; }

.btn-icon { width: 32px; height: 32px; border-radius: 6px; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; margin-left: 5px; transition: background-color 0.2s; }
.edit { background: #eff6ff; color: #3b82f6; } .edit:hover { background: #dbeafe; }
.delete { background: #fef2f2; color: #ef4444; } .delete:hover { background: #fee2e2; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; justify-content: center; align-items: center; }
.modal-content { background: white; width: 500px; padding: 30px; border-radius: 12px; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
.close-btn { position: absolute; top: 15px; right: 20px; font-size: 24px; cursor: pointer; color: #94a3b8; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: 600; color: #334155; }
.form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; box-sizing: border-box; }
.form-group input:focus, .form-group select:focus { border-color: #3b82f6; }
.form-actions { text-align: right; margin-top: 20px; }
</style>
