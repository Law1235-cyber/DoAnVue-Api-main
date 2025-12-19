<script setup>
import Header from './AppHeader.vue';
import Foot from './Foot.vue';
import HighlightProduct from './HighlightProduct.vue';
</script>

<template>
  <div>
    <Header />

    <main>
      <!-- Banner -->
      <div class="banner">
        <img
          src="https://i.pinimg.com/736x/21/ed/4d/21ed4de407bda8c54ffe9a93bda4ff45.jpg"
          alt="Banner"
        />
      </div>

      <!-- Thanh lựa chọn -->
      <div class="pro">
        <div class="box">
          <div><p><a href="#">New Arrivals</a></p></div>
          <div><p><a href="#">Best Sellers</a></p></div>
          <div><p><a href="sale.html">Sale</a></p></div>
        </div>
        <div class="all">
          <p><a href="#">View All</a></p>
        </div>
      </div>

      <!-- Danh sách sản phẩm -->
      <HighlightProduct />
    </main>

    <Foot />
  </div>
</template>

<style scoped>
.banner img {
  width: 100%;
  display: block;
  object-fit: cover;
}
main {
  padding: 20px;
}
.product-section {
  margin-top: 20px;
}
.pro {
  display: flex;
  justify-content: space-between;
  margin: 50px;
}
.pro p a {
  text-decoration: none;
  color: black;
}
.box {
  display: flex;
  gap: 5px;
}
.pro div a {
  border: 1px solid black;
  padding: 10px;
  text-align: center;
  color: black;
  background: white;
}
.pro div a:hover {
  background: black;
  color: white;
}
</style>
