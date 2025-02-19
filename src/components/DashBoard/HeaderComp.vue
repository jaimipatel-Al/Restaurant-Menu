<script setup>
import { ShoppingCartIcon } from '@heroicons/vue/24/solid'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import toast from '@/plugin/toast'

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.logOut()
  toast.success('User Logged Out successfully')
  router.push('/login')
}
</script>

<template>
  <header class="flex-between">
    <div class="flex items-center space-x-2 m-2 cursor-pointer" @click="router.push('/')">
      <img src="@/assets/img/favicon.png" alt="Logo" class="w-20" />
      <h1 class="text-5xl italic font-bold py-5 text-gray-600">
        Food <span class="text-orange-600">Partner</span>
      </h1>
    </div>
    <nav class="flex justify-end items-center text-xl font-semibold space-x-5 mx-10">
      <template v-if="authStore?.userData?.userId">
        <RouterLink to="/" class="router-link">Home</RouterLink>
        <RouterLink to="/combo" class="router-link">Combo</RouterLink>
        <RouterLink to="/category" class="router-link">Category</RouterLink>
        <RouterLink to="/item" class="router-link">Item</RouterLink>
        <span class="router-link" @click="logout()">Logout</span>
        <div
          class="relative cursor-pointer hover:bg-orange-50 rounded-full"
          @click="router.push('/cart')"
        >
          <ShoppingCartIcon class="w-14 p-2" />
          <span
            class="absolute py-0.5 px-2 text-sm bg-orange-500 hover:bg-orange-600 rounded-full -top-2 -right-2 text-white"
          >
            9
          </span>
        </div>
      </template>
      <RouterLink v-else to="/signup" class="router-link">Sign Up</RouterLink>
    </nav>
  </header>
</template>
