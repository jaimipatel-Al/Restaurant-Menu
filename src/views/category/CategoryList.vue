<script setup>
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  NoSymbolIcon,
} from '@heroicons/vue/24/solid'
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import { useAuthStore } from '@/stores/authStore'
import toast from '@/plugin/toast'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const categories = ref([])

const getCategories = async () => {
  isLoading.value = true

  await Axios.get(api.listCategory)
    .then(({ data }) => {
      categories.value = data?.data?.map((e) => {
        return { ...e, isDeleting: false }
      })
    })
    .catch((er) => {
      console.log(er)
    })
    .finally(() => {
      isLoading.value = false
    })
}
const deleteCategory = async (data) => {
  data.isDeleting = true

  await Axios.delete(`${api.deleteCategory}${data._id}`)
    .then(() => {
      toast.success('Category deleted successfully!!')
      getCategories()
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
    .finally(() => {
      data.isDeleting = false
    })
}

onMounted(() => {
  getCategories()
})
</script>

<template>
  <section class="w-screen h-screen bg-cover">
    <div class="flex-between px-8 py-5">
      <h1 class="auth-title">Category</h1>
      <RouterLink to="/category/add-category" class="button flex items-center"
        ><PlusIcon class="w-12 mr-2" /> Add Category</RouterLink
      >
    </div>
    <div v-if="isLoading" class="no-data"><ArrowPathIcon class="w-12 mx-3" /> Loading...</div>
    <div v-else-if="categories?.length == 0" class="no-data">
      <NoSymbolIcon class="w-12 mx-3" /> No Category Available
    </div>
    <div v-else class="h-5/6 overflow-y-auto">
      <div
        v-for="c in categories"
        :key="c._id"
        class="md:w-5/6 h-64 mx-auto p-3 my-8 shadow shadow-2xl rounded rounded-xl flex space-x-5 flex-col sm:flex-row"
        style="background: rgb(255, 255, 255, 0.8)"
      >
        <div class="w-full sm:w-96 md:w-80 flex-none">
          <img v-if="c.image" :src="c.image" alt="Category Image" class="full-image" />
          <img v-else src="@/assets/img/default-category.png" alt="Category Image" />
        </div>
        <div class="flex-auto p-2">
          <div class="flex items-start justify-between">
            <h3 class="text-orange-700 text-2xl font-semibold">{{ c.title }}</h3>
            <div class="flex" v-if="c.createdBy == authStore.userData.userId">
              <PencilIcon
                class="button-edit"
                @click="router.push(`/category/edit-category/${c._id}`)"
              />
              <TrashIcon v-if="!c.isDeleting" class="button-delete" @click="deleteCategory(c)" />
              <ArrowPathIcon v-else class="button-delete" />
            </div>
          </div>
          <RouterLink :to="`/item`" class="text-orange-400 text-sm">Show Items</RouterLink>
          <p class="auth-detail">{{ c.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  background-image: url('@/assets/img/category-bg.jpg');
}
</style>
