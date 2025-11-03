<template>
  <div class="auth-wrapper">
    <div class="auth-toggle" v-if="!hasRegistered">
      <button :class="{ active: isLogin }" @click="isLogin = true">Đăng nhập</button>
      <button :class="{ active: !isLogin }" @click="isLogin = false">Đăng ký</button>
    </div>

    <div v-if="isLogin">
      <h2>Đăng nhập</h2>
      <form @submit.prevent="login">
        <input v-model="loginForm.email" type="email" placeholder="Email" required />
        <input v-model="loginForm.password" type="password" placeholder="Mật khẩu" required />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>

    <div v-else>
      <h2>Đăng ký</h2>
      <form @submit.prevent="register">
        <input v-model="registerForm.name" placeholder="Tên người dùng" required />
        <input v-model="registerForm.email" type="email" placeholder="Email" required />
        <input v-model="registerForm.password" type="password" placeholder="Mật khẩu" required />
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const isLogin = ref(true);
const hasRegistered = ref(false);
const loginForm = ref({ email: '', password: '' });
const registerForm = ref({ name: '', email: '', password: '' });
const router = useRouter();

// Đăng ký (POST trực tiếp lên API)
const register = async () => {
  try {
    // Lấy danh sách user từ API để kiểm tra trùng email
    const response = await axios.get('http://localhost:3000/user');
    const exists = response.data.find(u => u.email === registerForm.value.email);

    if (exists) {
      alert('Email đã tồn tại. Vui lòng dùng email khác.');
      return;
    }

    const newUser = {
      ...registerForm.value,
      isAdmin: false // mặc định user mới không phải admin
    };

    // Gửi user mới lên API
    await axios.post('http://localhost:3000/user', newUser);

    alert('Đăng ký thành công! Hãy đăng nhập.');
    isLogin.value = true;
    hasRegistered.value = true;
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    alert('Đã xảy ra lỗi khi đăng ký.');
  }
};

// Đăng nhập (GET từ API và kiểm tra)
const login = async () => {
  try {
    const response = await axios.get('http://localhost:3000/user');
    const users = response.data;
    const user = users.find(
      u => u.email === loginForm.value.email && u.password === loginForm.value.password
    );

    if (user) {
      localStorage.setItem('userLogin', JSON.stringify(user));
      alert('Đăng nhập thành công');

      if (user.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      alert('Sai email hoặc mật khẩu');
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu người dùng từ API:', error);
alert('Đã xảy ra lỗi, vui lòng thử lại sau.');
  }
};
</script>

<style scoped>
.auth-wrapper {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}
.auth-toggle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.auth-toggle button {
  flex: 1;
  padding: 10px;
  background: #f0f0f0;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
.auth-toggle .active {
  background: #000;
  color: #fff;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button[type="submit"] {
  padding: 10px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
