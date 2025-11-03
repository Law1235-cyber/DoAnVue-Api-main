<template>
  <div class="favoritesPage">
    <div class="back">
      <router-link to="/product">
        <i class="fa-solid fa-caret-left"></i>BACK
      </router-link>
    </div>

    <h2>Sản phẩm yêu thích</h2>
    <p v-if="favoriteItems.length === 0">Bạn chưa có sản phẩm yêu thích nào.</p>
    <div v-else class="favorite-list">
      <div v-for="item in favoriteItems" :key="item.id" class="favorite-item">
        <img :src="item.image" :alt="item.name" class="item-image" />
        <div class="item-details">
          <h3>{{ item.name }}</h3>
          <p class="item-price">{{ item.price }}$</p>
          <p class="item-id">ID: {{ item.id }}</p>

          <div v-if="item.promoCodes && item.promoCodes.length > 0">
            <p>Mã khuyến mãi: 
              <span v-for="promo in item.promoCodes" :key="promo" class="promo-code">{{ promo }}</span>
            </p>
          </div>
          
          <p v-if="item.shipping">Phí vận chuyển: {{ item.shipping }}</p>

          <p v-if="item.sizes">Lưu ý về size: {{ item.sizes }}</p>


        </div>
        <button @click="removeFromFavorites(item.id)">Xóa</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFavoritesStore } from '../stores/favoritesStore';
import { storeToRefs } from 'pinia';

const favoritesStore = useFavoritesStore();
const { favoriteItems } = storeToRefs(favoritesStore);

const removeFromFavorites = (itemId) => {
  favoritesStore.removeFavorite(itemId);
};
</script>

<style scoped>
.promo-code {
  background-color: #e2f4f8;
  color: #007bff;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 5px;
  font-weight: bold;
}
.back a{
    
    color: black;
    font-weight: bold;

}

/* Các style cũ được giữ nguyên */
h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}
p {
  text-align: center;
  color: #666;
  font-style: italic;
}
.favorite-list {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}
.favorite-item:hover {
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.item-details {
  flex-grow: 1;
  margin-left: 20px;
}
.item-image {
  width: 100px;
  height:100px;
  object-fit: cover;
  border-radius: 4px;
}
h3 {
  text-align: center;
}
.favorite-item button {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  background-color: #ff4d4f;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.favorite-item button:hover {
  background-color: #cf1322;
}

/* Thêm style cho phần hiển thị màu sắc */
.item-colors {
  margin-top: 10px;
}
.item-colors p {
  text-align: left;
font-style: normal;
  color: #333;
  margin-bottom: 5px;
}
.color-options {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.color-thumbnail {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #ddd;
  object-fit: cover;
  cursor: pointer;
}
</style>