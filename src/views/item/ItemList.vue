<script setup>
import { PlusIcon, ArrowPathIcon, NoSymbolIcon } from '@heroicons/vue/24/solid'
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import { useAuthStore } from '@/stores/authStore'
import toast from '@/plugin/toast'
import AddEditIcon from '@/components/elements/AddEditIcon.vue'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const items = ref([])

const getItems = async () => {
  isLoading.value = true

  await Axios.get(api.listItem)
    .then(({ data }) => {
      items.value = data?.data?.subcategories?.map((e) => {
        return { ...e, isDeleting: false }
      })
    })
    .catch((er) => {
      console.error(er?.response?.data?.message)
    })
    .finally(() => {
      isLoading.value = false
    })
}
const deleteItem = async (data) => {
  data.isDeleting = true

  await Axios.delete(`${api.deleteItem}${data._id}`)
    .then(() => {
      toast.success('Item deleted successfully!!')
      getItems()
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
    .finally(() => {
      data.isDeleting = false
    })
}
const availableItem = async (data) => {
  await Axios.patch(`${api.toggleItemAvailability}${data._id}`)
    .then(() => {
      toast.success('Item Availability Changed successfully!!')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
}

onMounted(() => {
  getItems()
})
</script>

<template>
  <section class="bg-screen">
    <div class="main-header-nav">
      <h1 class="main-title">Items</h1>
      <RouterLink to="/item/add-item" class="add-btn"><PlusIcon /> Add Item</RouterLink>
    </div>
    <div v-if="isLoading" class="no-data"><ArrowPathIcon class="loading-btn" /> Loading...</div>
    <div v-else-if="items?.length == 0" class="no-data">
      <NoSymbolIcon class="no-data-icon" /> No Item Available
    </div>
    <div v-else class="h-5/6 overflow-y-auto flex justify-evenly px-4 sm:px-8 md:px-10 flex-wrap">
      <div
        v-for="i in items"
        :key="i"
        class="p-2 shadow-2xl rounded-xl w-full sm:w-80 my-5 mx-3"
        style="background: rgb(255, 255, 255, 0.8)"
      >
        <div class="h-72">
          <img v-if="i.image" :src="i.image" alt="Item Image" class="uploaded-image" />
          <img v-else src="@/assets/img/default-item.jpg" alt="Item Image" class="uploaded-image" />
        </div>
        <div class="p-2">
          <AddEditIcon
            :title="i.title"
            :isShow="i.createdBy == authStore.userData.userId"
            @editItem="router.push(`/item/edit-item/${i._id}`)"
            @deleteItem="deleteItem(i)"
            :isDeleting="i.isDeleting"
          />
          <label
            :for="`available-${i._id}`"
            class="flex items-center text-sm sm:text-base font-semibold"
          >
            <input
              v-model="i.isActive"
              type="checkbox"
              :id="`available-${i._id}`"
              class="w-4 h-4 cursor-pointer mr-2"
              @change="availableItem(i)"
            />
            Available
          </label>
          <div class="flex-between font-semibold">
            <RouterLink to="/category" class="text-orange-400 text-sm">{{
              i.categoryId?.title
            }}</RouterLink>
            <span class="price">₹ {{ i.price }} /-</span>
          </div>
          <p class="text-sm font-semibold text-gray-800">Quantity : {{ i.quantity }}</p>
          <p class="auth-detail">{{ i.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  background-image: url('@/assets/img/item-bg.jpg');
}
</style>
