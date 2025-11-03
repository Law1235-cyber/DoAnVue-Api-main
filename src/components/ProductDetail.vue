<template>
  <Header />
  <section v-if="product">
    <div class="back">
      <router-link to="/">
        <i class="fa-solid fa-caret-left"></i>BACK
      </router-link>
    </div>

    <div class="content">
      <div class="product">
        <img :src="selectedColorImage" :alt="product.name" />

        <video
          v-if="product.videos?.[0]"
          :src="product.videos[0]"
          autoplay
          muted
          loop
        ></video>

        <img v-if="product.images?.[1]" :src="product.images[1]" :alt="product.name + ' hover'" />
        <img
          v-for="(img, index) in product.images?.slice(2)"
          :key="'extra-img-' + index"
          :src="img"
          :alt="product.name + ' extra ' + index"
        />
      </div>

      <div class="info">
        <p>Women's-Origin</p>
        <p><i class="fa-solid fa-star" v-for="n in 6" :key="n"></i></p>
        <h1>{{ product.name }}</h1>
        <p class="price">{{ product.price }}$</p>
        <p>{{ product.promoCodes }}</p>

        <h3>Colors</h3>
        <div class="detail">
          <img
            v-for="(color, index) in product.colors"
            :key="index"
            :src="color.imageUrl"
            :alt="color.name"
            :class="{ selected: selectedColorIndex === index }"
            @click="selectColor(index)"
          />
        </div>
        <p v-if="product.colors && selectedColorIndex !== null">
          {{ product.colors[selectedColorIndex]?.name }}
        </p>

        <h3>Sizes</h3>
        <div class="size">
          <div
            v-for="(size, index) in product.sizes"
            :key="index"
            :class="{ selected: selectedSizeIndex === index }"
            @click="selectSize(index)"
          >
            {{ size }}
          </div>
        </div>

        <div class="notice">
          <i class="fa-solid fa-circle-exclamation"></i>
          <strong>{{ product.sizingNote }}</strong>
          We recommend ordering your usual size.
        </div>

        <div class="add" @click="addToBag">
          <h1>ADD TO BAG</h1>
          <i class="fa-solid fa-arrow-right"></i>
        </div>
        <div class="favourite" @click="addToFavorites"><i class="fa-solid fa-heart"></i></div>

        <p>{{ product.paymentOptions }}</p>
        <p><i class="fa-solid fa-truck-fast"></i> {{ product.shipping }}</p>
        <p><i class="fa-solid fa-money-check-dollar"></i> {{ product.returnsExchanges }}</p>
      </div>
    </div>
  </section>
  <section v-else>
    <p>Không tìm thấy sản phẩm.</p>
  </section>
  <Foot />
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import Header from './AppHeader.vue';
import Foot from './Foot.vue';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore'; 
import { useFavoritesStore } from '@/stores/favoritesStore'; 

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore(); 
const favoritesStore = useFavoritesStore(); 

// Thêm các hàm chọn màu và size
const selectedColorIndex = ref(0);
const selectedSizeIndex = ref(0);

const selectColor = (index) => {
  selectedColorIndex.value = index;
};

const selectSize = (index) => {
  selectedSizeIndex.value = index;
};

// Lấy thông tin sản phẩm và lựa chọn từ store
const product = computed(() => productStore.selectedProduct);

const selectedColorImage = computed(() => {
  const index = selectedColorIndex.value;
  return product.value?.colors?.[index]?.imageUrl || product.value?.images?.[0];
});

const selectedColor = computed(() => {
  const index = selectedColorIndex.value;
  return product.value?.colors?.[index];
});

const selectedSize = computed(() => {
  const index = selectedSizeIndex.value;
  return product.value?.sizes?.[index];
});

// LOGIC SỬA LỖI: Computed property để kiểm tra điều kiện thêm vào giỏ hàng
const canAddToCart = computed(() => {
  if (!product.value) return false;

  // 1. Phải luôn chọn Màu sắc
  if (selectedColorIndex.value === null) return false;

  // 2. Nếu sản phẩm CÓ tùy chọn size, thì phải chọn size
  const hasSizes = product.value.sizes && product.value.sizes.length > 0;
  if (hasSizes && selectedSizeIndex.value === null) {
    return false;
  }
  
  return true;
});

// HÀM SỬA LỖI: Thêm vào giỏ hàng (sửa tên hàm từ addToBag)
const addToBag = () => {
  if (!product.value || !canAddToCart.value) {
    // Hiển thị thông báo cụ thể cho người dùng biết họ thiếu gì
    if (product.value?.sizes && product.value.sizes.length > 0 && selectedSizeIndex.value === null) {
      alert("Vui lòng chọn Kích cỡ (Size) trước khi thêm vào giỏ hàng.");
    } else if (selectedColorIndex.value === null) {
      alert("Vui lòng chọn Màu sắc (Color) trước khi thêm vào giỏ hàng.");
    }
    return;
  }
  
  // 1. Chuẩn bị dữ liệu để truyền vào cartStore
  const itemToAdd = {
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: selectedColorImage.value,
  };

  // 2. Lấy tên màu và size
  const colorName = selectedColor.value?.name || 'Default'; 
  // Nếu có size đã chọn thì dùng size đó, nếu không (One Size) thì dùng label mặc định
  const size = selectedSize.value || 'One Size'; 

  // 3. Gọi action từ Cart Store
  cartStore.addToCart(itemToAdd, colorName, size);
  alert(`Đã thêm 1 x ${product.value.name} (${colorName}, Size ${size}) vào giỏ hàng!`);
};

// Hàm Thêm vào Yêu thích
const addToFavorites = () => {
  if (!product.value) return;
  favoritesStore.toggleFavorite(product.value);
};

onMounted(async () => {
  const productId = route.params.id;
  await productStore.fetchProducts(); 
  productStore.setProductById(productId);
});
</script>
<style scoped>
/* Giữ nguyên các style đã có */
*{
    font-family: Arial, Helvetica, sans-serif;
}
.nav-bar{
    display: flex;
    justify-content: space-between;
    
    
}
.nav-bar ul {
    list-style: none;
    display: flex;
    margin: 0px;
    background: white;
    margin-top: 1.25em;
}
.nav-bar li a {
    text-decoration: none;
    padding: 10px;
    display: block;
    color: black;
}
.nav-bar li a:hover{
  color: white;
  background: black;
}
.hamburger-menu {
  display: none; /* Ẩn mặc định trên màn hình lớn */
  width: 30px;
  height: 24px;
  cursor: pointer;
  position: relative;
}

.hamburger-menu .bar {
  display: block;
  width: 100%;
  height: 3px;
  background-color: black;
  margin: 6px 0;
  transition: 0.4s;
}
/* section */
.back a{
    
    color: black;
    font-weight: bold;

}
.content{
    display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 70px;
}
.product{
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 30%;
    gap: 2px;
    margin: 10px;
    
    
}

.product img{
    width: 500px;
    margin: 0; /* Loại bỏ margin */
    padding: 0; /* Loại bỏ padding */
    border-radius: 5px;
    
}
.product video{
    width: 31em;
}
.size {
    display: grid;
    grid-template-columns: repeat(5, 50px); 
    gap: 2px; 
    padding: 10px;
  }
  
  .size div {
    border: 1px solid #ccc;
    display: grid;
    place-items: center; 
    background: linear-gradient(to right, #eaeeef 0%, #eaeeef 100%);
  }
  .size div:hover{
    background: black;
    color: white;
  }
  .info{
    width: 70%;
  }
  .detail{
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
  }
  .detail img{
    width: 80px;
    transition: transform 0.3s ease;
  }
  .detail img:hover{
    transform: scale(1.2);
  }
  .add{
    background: black;
    color: white;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 50px;
  }
  .favourite{
    color: red;
    padding: 20px;
  }
  .favourite i{
   font-size: 40px;
  }
 
  /*  footer*/
  .join{
    text-transform: uppercase;
    font-weight: bold;
    background: yellow;
    color: black;
    text-align: center;
    height: 10vh;
    font-size: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.contact{
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 3 cột bằng nhau */
  gap: 20px; /* Khoảng cách giữa các cột */
  margin: 40px;
  justify-items: center;
}
.contact div{
  line-height: 2;
}
.contact div h1{
  font-weight: bold;
}
.footer{
  text-align: center;
  background: black;
  color: white;
  line-height: 2;
}
@media (max-width:768px) {
  
  .product img{
    width: 400px;
    display: block;
  }
  .product video{
    width: 400px;
    display: block;
  }
  .content{
    display: flex;
    flex-direction: column;
  }
  .info{
    width: 100%;
    margin: 10px;
   
  }
  .size{
    
      display: grid;
      grid-template-columns: repeat(auto-fit, calc(100% / 5)); 
      gap: 2px;
      padding: 10px;
      width: 100%; 
  }
  .size div {
    border: 1px solid #ccc;
    display: grid;
    place-items: center;
    background: linear-gradient(to right, #eaeeef 0%, #eaeeef 100%);
    height: 30px; 
  }
  .info h1{
    display: flex;
    flex-direction: column-reverse;
  }
  .join{
    font-size: 30px;
  }
  .nav-links {
    display: none; /* Ẩn menu trên màn hình nhỏ */
    position: absolute;
    top: 60px; /* Điều chỉnh tùy theo chiều cao header */
    left: 0;
    background-color: white;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 10; /* Đảm bảo menu hiển thị trên các phần tử khác */
  }

  .nav-links.active {
    display: flex; /* Hiển thị menu khi hamburger được kích hoạt */
  }

  .nav-links ul {
    flex-direction: column;
    width: 100%;
  }

  .nav-links li {
    margin-right: 0;
    width: 100%;
  }

  .nav-links li a {
    padding: 15px;
    border-bottom: 1px solid #eee;
  }

  .nav-links li:last-child a {
    border-bottom: none;
  }

  .hamburger-menu {
      margin-top: 20px;
     
   
      display: inline-block; /* Hiển thị hamburger trên màn hình nhỏ */
  }
  
  
}
@media(max-width:480px){
  .product img{
    width: 200px;
    display: block;
  }
  .product video{
    width: 200px;
    display: block;
  }
  .contact h1{
    font-size: 14px;
  }
  .search{
    display: none;
}
.contact{
  margin: 5px;
  gap: 13px;
}
}
</style>