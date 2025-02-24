<script setup>
import { ShoppingCartIcon, Bars3Icon } from '@heroicons/vue/24/solid'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import toast from '@/plugin/toast'
import { onMounted } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const logout = () => {
  authStore.logOut()
  toast.success('User Logged Out successfully')
  router.push('/login')
}

const openSidebar = () => {
  document.getElementById('sidebar').classList.add('open')
  document.getElementById('overlay').classList.add('active')
}

const closeSidebar = () => {
  setTimeout(() => {
    document.getElementById('sidebar').classList.remove('open')
    document.getElementById('overlay').classList.remove('active')
  }, 200)
}

onMounted(() => {
  if (authStore.userData?.token) cartStore.getCartValue()
})
</script>

<template>
  <header class="flex-between">
    <div class="block sm:hidden overlay" id="overlay" @click="closeSidebar()"></div>
    <div class="flex items-center space-x-2 m-2 cursor-pointer" @click="router.push('/')">
      <img src="@/assets/img/favicon.png" alt="Logo" class="w-12 md:w-16 lg:w-20" />
      <h1
        class="text-2xl md:text-4xl lg:text-5xl italic font-bold py-1 md:py-3 lg:py-5 text-gray-600"
      >
        Food <span class="text-orange-600">Partner</span>
      </h1>
    </div>

    <div class="block sm:hidden flex items-center space-x-3 mr-5">
      <div
        v-if="authStore?.userData?.userId"
        class="relative cursor-pointer hover:bg-orange-50 rounded-full"
        @click="router.push('/cart')"
      >
        <ShoppingCartIcon class="w-8 md:w-12 p-1.5 md:p-2" />
        <span
          v-if="cartStore.cart"
          class="absolute py-0.5 md:py-1 px-1.5 md:px-2 text-xs bg-orange-500 hover:bg-orange-600 rounded-full -top-2 -right-2 text-white"
        >
          {{ cartStore.cart }}
        </span>
      </div>
      <button class="rounded-full" @click="openSidebar()">
        <Bars3Icon class="w-6 md:w-8" />
      </button>
    </div>

    <nav class="navigation-menu">
      <RouterLink to="/" class="router-link">Home</RouterLink>
      <RouterLink v-if="authStore?.userData?.userId" to="/restaurant" class="router-link"
        >Restaurant</RouterLink
      >
      <RouterLink
        v-if="authStore?.userData?.userId && authStore?.userData?.role == 'owner'"
        to="/combo"
        class="router-link"
        >Combo</RouterLink
      >
      <RouterLink
        v-if="authStore?.userData?.userId && authStore?.userData?.role == 'owner'"
        to="/item"
        class="router-link"
        >Item</RouterLink
      >
      <RouterLink
        v-if="authStore?.userData?.userId && authStore?.userData?.role == 'owner'"
        to="/category"
        class="router-link"
        >Category</RouterLink
      >
      <span v-if="authStore?.userData?.userId" class="router-link" @click="logout()">Logout</span>
      <div
        v-if="authStore?.userData?.userId"
        class="relative cursor-pointer hover:bg-orange-50 rounded-full"
        @click="router.push('/cart')"
      >
        <ShoppingCartIcon class="w-8 md:w-12 p-1.5 md:p-2" />
        <span
          v-if="cartStore.cart"
          class="absolute py-0.5 md:py-1 px-1 md:px-2 text-xs md:text-xs bg-orange-500 hover:bg-orange-600 rounded-full -top-2 -right-2 text-white"
        >
          {{ cartStore.cart }}
        </span>
      </div>
      <RouterLink v-else to="/signup" class="router-link">Sign Up</RouterLink>
    </nav>

    <nav class="sidebar pt-3 shadow-xl" id="sidebar" @click="closeSidebar()">
      <RouterLink to="/" class="router-link">Home</RouterLink>
      <RouterLink v-if="authStore?.userData?.userId" to="/restaurant" class="router-link"
        >Restaurant</RouterLink
      >
      <RouterLink
        v-if="authStore?.userData?.userId && authStore?.userData?.role == 'owner'"
        to="/combo"
        class="router-link"
        >Combo</RouterLink
      >
      <RouterLink
        v-if="authStore?.userData?.userId && authStore?.userData?.role == 'owner'"
        to="/item"
        class="router-link"
        >Item</RouterLink
      >
      <RouterLink
        v-if="authStore?.userData?.userId && authStore?.userData?.role == 'owner'"
        to="/category"
        class="router-link"
        >Category</RouterLink
      >
      <a v-if="authStore?.userData?.userId" class="router-link" @click="logout()">Logout</a>
      <RouterLink v-else to="/signup" class="router-link">Sign Up</RouterLink>
    </nav>
  </header>
</template>

<style  scoped>
.sidebar {
  position: fixed;
  top: 0;
  right: -200px;
  width: 200px;
  height: 100%;
  background: #888888;
  transition: 0.3s;
}

.sidebar.open {
  right: 0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: none;
}

.overlay.active {
  display: block;
}
</style>
