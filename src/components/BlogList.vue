//blogList
<script setup>
import Header from './AppHeader.vue';
import Foot from './Foot.vue';
</script>

<template>
  <Header />
  <div class="blog-list">
    <h1>Danh sách bài viết</h1>
    <div
      v-for="post in posts"
      :key="post.id"
      class="blog-item-link"
    >
      <router-link :to="`/blog/${post.id}`">
        <div class="blog-item">
          <img :src="post.image" alt="thumbnail" class="thumbnail" />
          <div class="content">
            <h2 class="title">{{ post.title }}</h2>
            <p class="desc">{{ post.description }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
  <Foot />
</template>

<script>
import axios from 'axios'; 

export default {
  name: "BlogList",
  data() {
    return {
      posts: []
    };
  },
  async mounted() {
    try {
      const response = await axios.get("http://localhost:3000/posts");
      this.posts = response.data;
    } catch (error) {
      alert("Không tải được dữ liệu blog");
      console.error(error);
    }
  }
};
</script>

<style scoped>
.blog-list{
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
.blog-item {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  align-items: flex-start;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.thumbnail {
  width: 200px;
  height: 150px;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 5px;
}

.content {
  flex: 1;
}

.title {
  font-size: 18px;
  font-weight: 800;
  line-height: 1.4;
  color: #111;
  margin-bottom: 10px;
}

.desc {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

a {
  text-decoration: none;
}

</style>
