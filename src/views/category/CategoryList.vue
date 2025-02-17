<script setup>
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="w-screen h-screen bg-cover">
    <div class="flex-between p-8">
      <h1 class="auth-title">Category</h1>
      <RouterLink to="/category/add-category" class="button flex items-center"
        ><PlusIcon class="w-6 mr-2" /> Add Category</RouterLink
      >
    </div>
    <div class="h-5/6 overflow-y-auto">
      <div
        v-for="i in 10"
        :key="i"
        class="md:w-5/6 mx-auto p-5 my-8 shadow shadow-2xl rounded rounded-xl flex space-x-10"
        style="background: rgb(255, 255, 255, 0.8)"
      >
        <div>
          <img src="@/assets/img/default-category.png" alt="Category Image" class="w-80 h-auto" />
        </div>
        <div>
          <h3 class="text-orange-700 text-2xl font-semibold">Chinese Food</h3>
          <RouterLink to="/item" class="text-orange-400 text-sm">Show Items</RouterLink>
          <p class="auth-detail">
            Chinese food is a diverse cuisine that includes dishes like chow mein, dumplings, and
            Peking duck
          </p>
        </div>
        <div class="flex items-start">
          <PencilIcon class="button-edit" @click="router.push(`/category/edit-category/${i}`)" />
          <TrashIcon class="button-delete" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  background-image: url('@/assets/img/category-bg.jpg');
}
</style>
