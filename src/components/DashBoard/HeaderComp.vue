<script setup>
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <header class="flex-between">
    <div class="flex items-center space-x-2 m-2 cursor-pointer" @click="router.push('/')">
      <img src="@/assets/img/favicon.png" alt="Logo" class="w-24" />
      <h1 class="text-5xl italic font-bold py-5 text-gray-600">
        Food <span class="text-orange-600">Partner</span>
      </h1>
    </div>
    <nav class="flex justify-end items-center text-xl font-semibold space-x-5 mx-10">
      <RouterLink to="/" class="router-link">Home</RouterLink>
      <RouterLink to="/" class="router-link">Categories</RouterLink>
      <RouterLink to="/" class="router-link">Foods</RouterLink>
      <RouterLink to="/" class="router-link">Login</RouterLink>
      <RouterLink to="/" class="router-link">Logout</RouterLink>
    </nav>
  </header>
</template>
