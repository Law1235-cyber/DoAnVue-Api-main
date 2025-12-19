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
				<!-- Hiển thị ảnh chính -->
				<img :src="selectedColorImage || product.image" :alt="product.name" />

				<!-- Hiển thị video đầu tiên nếu có (đã sắp xếp theo thứ tự) -->
				<video
					v-if="firstVideo"
					:src="firstVideo.videoUrl"
					autoplay
					muted
					loop
				></video>
				<!-- Hoặc hiển thị hover image nếu có -->
				<img v-else-if="product.hoverImage" :src="product.hoverImage" :alt="product.name + ' hover'" />

				<!-- Hiển thị các ảnh phụ (chỉ hiển thị tối đa 2 ảnh) -->
				<img
					v-for="(img, index) in limitedImages"
					:key="'extra-img-' + img.id"
					:src="img.imageUrl"
					:alt="product.name + ' extra ' + index"
				/>
			</div>

			<div class="info">
				<p>{{ product.category || "Women's-Origin" }}</p>
				<p><i class="fa-solid fa-star" v-for="n in 6" :key="n"></i></p>
				<h1>{{ product.name }}</h1>
				<p class="price">{{ formatPrice(product.price) }}</p>
				<p v-if="product.promoCodes" class="promo-code">{{ product.promoCodes }}</p>

				<h3>Colors</h3>
				<div class="detail" v-if="product.colors && product.colors.length > 0">
					<img
						v-for="(color, index) in product.colors"
						:key="'color-' + color.id"
						:src="color.imageUrl"
						:alt="color.colorName"
						:class="{ selected: selectedColorIndex === index }"
						@click="selectColor(index)"
						:title="color.colorName"
					/>
				</div>
				<div v-else>
					<p>No colors available</p>
				</div>
				<p v-if="selectedColor" class="selected-color">
					{{ selectedColor.colorName }}
				</p>

				<h3>Sizes</h3>
				<div class="size" v-if="product.sizes && product.sizes.length > 0">
					<div
						v-for="(size, index) in product.sizes"
						:key="'size-' + size.id"
						:class="{ 
							selected: selectedSizeIndex === index,
							disabled: addingToCart
						}"
						@click="!addingToCart && selectSize(index)"
					>
						{{ size.sizeValue || size.size }}
					</div>
				</div>
				<div v-else>
					<p>No sizes available</p>
				</div>

				<div class="notice" v-if="product.sizingNote">
					<i class="fa-solid fa-circle-exclamation"></i>
					<strong>{{ product.sizingNote }}</strong>
				</div>

				<!-- Hiển thị lỗi nếu có -->
				<div v-if="cartStore.error" class="error-message">
					{{ cartStore.error }}
				</div>

				<div class="add" 
					@click="addToBag" 
					:class="{ 
						disabled: !canAddToCart || addingToCart || cartStore.loading 
					}"
					:style="{ opacity: (addingToCart || cartStore.loading) ? 0.7 : 1 }">
					<h1>{{ addingToCart ? 'ĐANG THÊM...' : 'ADD TO BAG' }}</h1>
					<i class="fa-solid fa-arrow-right"></i>
				</div>
				
				<div class="favourite" 
					@click="addToFavorites" 
					:class="{ 
						active: isFavorite,
						disabled: addingToCart 
					}">
					<i class="fa-solid fa-heart"></i>
					<span>{{ isFavorite ? 'ĐÃ YÊU THÍCH' : 'THÊM VÀO YÊU THÍCH' }}</span>
				</div>

				<div class="product-features">
					<p v-if="product.paymentOptions" class="feature-item">
						<i class="fa-solid fa-credit-card"></i> {{ product.paymentOptions }}
					</p>
					<p class="feature-item">
						<i class="fa-solid fa-truck-fast"></i> {{ product.shipping || 'Free shipping' }}
					</p>
					<p v-if="product.returnsExchanges" class="feature-item">
						<i class="fa-solid fa-money-check-dollar"></i> {{ product.returnsExchanges }}
					</p>
				</div>
				
				<!-- Hiển thị mô tả sản phẩm -->
				<div class="description" v-if="product.description">
					<h3>Product Description</h3>
					<p>{{ product.description }}</p>
				</div>
			</div>
		</div>
	</section>
	<section v-else-if="loading">
		<div class="loading-container">
			<p>Đang tải sản phẩm...</p>
		</div>
	</section>
	<section v-else>
		<div class="error-container">
			<p>Không tìm thấy sản phẩm</p>
			<router-link to="/" class="back-home">Quay lại trang chủ</router-link>
		</div>
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

const selectedColorIndex = ref(0);
const selectedSizeIndex = ref(0);
const loading = ref(true);
const addingToCart = ref(false);

const selectColor = (index) => {
	if (addingToCart.value) return;
	selectedColorIndex.value = index;
};

const selectSize = (index) => {
	if (addingToCart.value) return;
	selectedSizeIndex.value = index;
};

const product = computed(() => productStore.selectedProduct);

// Sắp xếp ảnh theo thứ tự và giới hạn chỉ hiển thị 2 ảnh
const sortedImages = computed(() => {
	if (!product.value?.images) return [];
	return [...product.value.images].sort((a, b) => (a.imageOrder || 0) - (b.imageOrder || 0));
});

// Chỉ hiển thị tối đa 2 ảnh thumbnail
const limitedImages = computed(() => {
	return sortedImages.value.slice(0, 2);
});

// Lấy video đầu tiên đã sắp xếp theo thứ tự
const firstVideo = computed(() => {
	if (!product.value?.videos || product.value.videos.length === 0) return null;
	const sortedVideos = [...product.value.videos].sort((a, b) => (a.videoOrder || 0) - (b.videoOrder || 0));
	return sortedVideos[0];
});

const selectedColorImage = computed(() => {
	if (!product.value) return '';
	const colors = product.value.colors || [];
	if (colors.length > 0 && selectedColorIndex.value < colors.length) {
		return colors[selectedColorIndex.value]?.imageUrl || '';
	}
	// Fallback to main product image
	return product.value.image || '';
});

const selectedColor = computed(() => {
	if (!product.value?.colors || product.value.colors.length === 0) return null;
	return product.value.colors[selectedColorIndex.value];
});

const selectedSize = computed(() => {
	if (!product.value?.sizes || product.value.sizes.length === 0) return 'One Size';
	const size = product.value.sizes[selectedSizeIndex.value];
	return size?.sizeValue || size?.size || 'One Size';
});

const isFavorite = computed(() => {
	if (!product.value) return false;
	return favoritesStore.isFavorite(product.value.id);
});

const canAddToCart = computed(() => {
	if (!product.value) return false;
	if (addingToCart.value || cartStore.loading) return false;

	// Check if color selection is required and valid
	const hasColors = product.value.colors && product.value.colors.length > 0;
	if (hasColors && selectedColorIndex.value === null) {
		return false;
	}

	// Check if size selection is required and valid
	const hasSizes = product.value.sizes && product.value.sizes.length > 0;
	if (hasSizes && selectedSizeIndex.value === null) {
		return false;
	}
	
	return true;
});

const formatPrice = (price) => {
	if (!price) return '$0.00';
	return `$${price.toFixed(2)}`;
};

const addToBag = async () => {
	if (!product.value || !canAddToCart.value) {
		if (product.value?.sizes && product.value.sizes.length > 0 && selectedSizeIndex.value === null) {
			alert("Vui lòng chọn Kích cỡ (Size) trước khi thêm vào giỏ hàng.");
		} else if (product.value?.colors && product.value.colors.length > 0 && selectedColorIndex.value === null) {
			alert("Vui lòng chọn Màu sắc (Color) trước khi thêm vào giỏ hàng.");
		}
		return;
	}
	
	addingToCart.value = true;
	cartStore.clearError(); // Clear any previous errors
	
	try {
		// Chuẩn bị dữ liệu sản phẩm để thêm vào giỏ hàng
		const productData = {
			id: product.value.id,
			name: product.value.name,
			price: product.value.price,
			image: selectedColorImage.value || product.value.image
		};

		const colorName = selectedColor.value?.colorName || 'Default';
		const sizeValue = selectedSize.value;

		// Gọi action addToCart từ store
		const success = await cartStore.addToCart(productData, colorName, sizeValue);
		
		if (success) {
			alert(`Đã thêm ${product.value.name} (${colorName}, Size ${sizeValue}) vào giỏ hàng!`);
		} else {
			alert(cartStore.error || 'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
		}
	} catch (error) {
		console.error('Lỗi khi thêm vào giỏ hàng:', error);
		alert('Có lỗi xảy ra khi thêm vào giỏ hàng!');
	} finally {
		addingToCart.value = false;
	}
};

const addToFavorites = async () => {
	if (!product.value || addingToCart.value) return;
	try {
		await favoritesStore.toggleFavorite(product.value);
	} catch (error) {
		console.error('Lỗi khi thêm vào yêu thích:', error);
		alert('Có lỗi xảy ra khi thêm vào yêu thích!');
	}
};

onMounted(async () => {
	const productId = route.params.id;
	try {
		loading.value = true;
		// Sử dụng endpoint mới để lấy sản phẩm với videos
		await productStore.fetchProductWithVideos(productId);
	} catch (error) {
		console.error('Lỗi khi tải sản phẩm:', error);
	} finally {
		loading.value = false;
	}
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