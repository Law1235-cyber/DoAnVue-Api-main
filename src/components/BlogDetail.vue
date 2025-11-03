
<script setup>
import Header from './AppHeader.vue';
import Foot from './Foot.vue';
</script>

<template>
  <Header />
  <div class="blog-detail" v-if="post">
    <div class="blog-image">
      <img :src="post.image" alt="blog image" />
    </div>
    <div class="blog-meta">
      <p class="blog-info">{{ post.brand }} / {{ post.date }} / {{ post.time }}</p>
      <h1 class="blog-title">{{ post.title }}</h1>
      <p class="desc">{{ post.description }}</p>
      <div class="blog-content">
        <p>{{ post.content }}</p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Không tìm thấy bài viết.</p>
  </div>
  <Foot />
</template>

<script>
import axios from 'axios';

export default {
  name: 'BlogDetail',
  data() {
    return {
      post: []
    };
  },
  async saveCartToServer() {
  await axios.put('http://localhost:3000/cart', this.items)
},
  async loadCartFromServer() {
  try {
    const res = await axios.get('http://localhost:3000/cart')
    // Chỉ cập nhật nếu có data là mảng
    if (Array.isArray(res.data)) {
      this.items = res.data
    }
  } catch (err) {
    // Không cập nhật nếu lỗi (giữ nguyên cart local)
  }
}

};
</script>

<style scoped>
.blog-detail {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.blog-image img {
  width: 100%;
  max-height: 480px;
  object-fit: cover;
  margin-bottom: 30px;
  border-radius: 5px;
}

.blog-meta {
  padding: 0 10px;
  border-left: 4px solid black;
  padding-left: 20px;
}

.blog-info {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.blog-title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
  line-height: 1.3;
  color: #111;
}

.blog-content {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}
</style>
