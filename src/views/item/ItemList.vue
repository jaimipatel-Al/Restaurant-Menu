<script setup>
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="w-screen h-screen bg-cover">
    <div class="flex-between p-8">
      <h1 class="auth-title">Items</h1>
      <RouterLink to="/item/add-item" class="button flex items-center"
        ><PlusIcon class="w-6 mr-2" /> Add Item</RouterLink
      >
    </div>
    <div class="h-5/6 overflow-y-auto flex justify-evenly px-10 flex-wrap">
      <div
        v-for="i in 10"
        :key="i"
        class="p-2 shadow shadow-2xl rounded rounded-xl w-96 my-8 mx-5"
        style="background: rgb(255, 255, 255, 0.8)"
      >
        <div class="h-96">
          <img
            src="@/assets/img/default-item.jpg"
            alt="Item Image"
            class="rounded rounded-xl w-full h-full object-contain"
          />
        </div>
        <div class="flex-between px-2">
          <h3 class="text-orange-700 text-2xl font-semibold">Chinese Food</h3>
          <div class="flex items-start">
            <PencilIcon class="button-edit" @click="router.push(`/item/edit-item/${i}`)" />
            <TrashIcon class="button-delete" />
          </div>
        </div>
        <div class="p-2">
          <RouterLink to="/category" class="text-orange-400 text-sm">Category</RouterLink>
          <p class="auth-detail">
            Chinese food is a diverse cuisine that includes dishes like chow mein, dumplings, and
            Peking duck
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  background-image: url('@/assets/img/item-bg.jpg');
}
</style>
