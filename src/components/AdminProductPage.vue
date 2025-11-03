<template>
  <AppHeader/>
  <div class="admin-products-container">
    <div class="header-section">
      <h1>Quản Lý Sản Phẩm</h1>
      <button @click="openModal('add')" class="add-btn">
        <i class="fas fa-plus"></i> Thêm Sản Phẩm Mới
      </button>
    </div>

    <div class="product-table-wrapper">
      <table class="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Sản Phẩm</th>
            <th>Ảnh</th>
            <th>Giá</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>
              <img
                :src="product.images[0]"
                alt="Product Image"
                class="product-image"
              />
            </td>
            <td>{{ product.price.toLocaleString("vi-VN") }} đ</td>
            <td>
              <button @click="openModal('edit', product)" class="action-btn edit">
                <i class="fas fa-edit"></i> Sửa
              </button>
              <button @click="deleteProduct(product.id)" class="action-btn delete">
                <i class="fas fa-trash-alt"></i> Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <span @click="closeModal" class="close-btn">&times;</span>
        <h2>{{ modalMode === "add" ? "Thêm Sản Phẩm Mới" : "Sửa Thông Tin Sản Phẩm" }}</h2>
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label for="name">Tên Sản Phẩm:</label>
            <input type="text" id="name" v-model="productForm.name" required />
          </div>
          <div class="form-group">
            <label for="price">Giá:</label>
            <input type="number" id="price" v-model.number="productForm.price" required />
          </div>
          <div class="form-group">
            <label for="image">URL Ảnh:</label>
            <input type="text" id="image" v-model="productForm.images[0]" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="save-btn">Lưu</button>
            <button type="button" @click="closeModal" class="cancel-btn">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "@/stores/productStore";
import AppHeader from "./AppHeader.vue";




const productStore = useProductStore();
const isModalOpen = ref(false);
const modalMode = ref("add"); // 'add' or 'edit'
const productForm = ref({
  id: null,
  name: "",
  price: 0,
  images: [""],
});

onMounted(() => {
  productStore.fetchProducts();
});

const products = computed(() => productStore.productDetails);

const openModal = (mode, product = null) => {
  modalMode.value = mode;
  if (mode === "edit" && product) {
    productForm.value = { ...product };
  } else {
    productForm.value = {
      id: null,
      name: "",
      price: 0,
      images: [""],
    };
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveProduct = () => {
  if (modalMode.value === "add") {
    // Generate a simple unique ID for demonstration
    productStore.addProduct({ ...productForm.value, id: Date.now().toString() });
  } else {
    productStore.updateProduct(productForm.value);
  }
  closeModal();
};

const deleteProduct = (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
    productStore.deleteProduct(id);
  }
};
</script>

<style scoped>
.admin-products-container { padding: 20px; max-width: 1200px; margin: 0 auto; }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.add-btn { padding: 10px 15px; background-color: #42b983; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
.product-table-wrapper { overflow-x: auto; }
.product-table { width: 100%; border-collapse: collapse; text-align: left; }
.product-table th, .product-table td { padding: 12px 15px; border: 1px solid #ddd; }
.product-table th { background-color: #f2f2f2; }
.product-image { width: 50px; height: 50px; object-fit: cover; border-radius: 5px; }
.action-btn { padding: 5px 10px; border: none; border-radius: 3px; color: white; cursor: pointer; margin-right: 5px; }
.edit { background-color: #3498db; }
.delete { background-color: #e74c3c; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; }
.modal-content { background-color: white; padding: 30px; border-radius: 10px; width: 400px; max-width: 90%; position: relative; }
.close-btn { position: absolute; top: 10px; right: 15px; font-size: 24px; cursor: pointer; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; font-weight: bold; margin-bottom: 5px; }
.form-group input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px; }
.form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.save-btn, .cancel-btn { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
.save-btn { background-color: #42b983; color: white; }
.cancel-btn { background-color: #ccc; }
</style>