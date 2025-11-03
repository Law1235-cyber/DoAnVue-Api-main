<script setup>
import { onMounted, computed } from 'vue';
import { useProductStore } from '@/stores/productStore';

const store = useProductStore();

onMounted(() => {
  store.fetchProducts();
});

// Now using the highlightProducts getter from the store
const products = computed(() => store.highlightProducts);
const collections = computed(() => store.collections);
</script>

<template>
  <div class="product-section">
    <h1>SẢN PHẨM NỔI BẬT</h1>
    <div class="product-container">
      <div
        v-for="(product, index) in products"
        :key="product.id"
        class="product-item"
        :class="{ highlight: index === 0 }"
      >
        <img :src="product.images[0]" :alt="product.name" />
        <img :src="product.images[1]" :alt="product.name" class="hover-img" />
        <div class="product-name">{{ product.name }}</div>
        <div class="product-price">${{ product.price.toFixed(2) }}</div>
        <router-link :to="`/product/${product.id}`" class="buy-btn">MUA NGAY</router-link>
      </div>
    </div>

    <hr />

    <h1>BỘ SƯU TẬP</h1>
    <div class="product-container">
      <div v-for="collection in collections" :key="collection.id" class="product-item">
        <img v-if="collection.image" :src="collection.image" :alt="collection.name" />
        <video v-if="collection.video" :src="collection.video" autoplay muted loop />
        <div class="product-name">{{ collection.name }}</div>
        <p>{{ collection.description }}</p>
        <a :href="collection.link" class="shopNow">XEM NGAY</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* giữ nguyên style như cũ */
.product-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 10px;
}
.product-item {
  background-color: white;
  padding: 10px;
  text-align: center;
  width: 250px;
  transition: transform 0.2s;
  position: relative;
}
.product-item .hover-img {
  position: absolute;
  top: 10px;
  left: 10px;
  transition: opacity 0.3s ease;
  opacity: 0;
}
.product-item:hover .hover-img {
  opacity: 1;
}
.product-item:hover {
  transform: scale(1.05);
}
.product-item img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
.product-name {
  font-size: 18px;
  font-weight: bold;
  margin: 10px;
}
.product-price {
  color: red;
  font-weight: bold;
  font-size: 17px;
}
.buy-btn {
  display: inline-block;
  text-decoration: none;
  background: white;
  border-radius: 10px;
  padding: 10px 15px;
  color: black;
  border: 1px solid black;
}
.buy-btn:hover {
  background: black;
  color: white;
}
.product-item video {
  width: 100%;
  height: 300px;
}
.product-item .shopNow {
  text-decoration: none;
  color: black;
  font-weight: bold;
}
h1 {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
</style>