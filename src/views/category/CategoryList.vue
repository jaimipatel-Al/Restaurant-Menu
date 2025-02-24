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
const categories = ref([])
const scrollComponent = ref()
const page = ref(0)
const totalCategories = ref()

const getCategories = async () => {
  if (categories.value?.length == totalCategories.value) return

  page.value++
  isLoading.value = true

  await Axios.get(`${api.listCategory}?page=${page.value}&limit=8`)
    .then(({ data }) => {
      const res = data.data
      totalCategories.value = res.totalCategories
      const arr = res.categories.map((e) => {
        return { ...e, isDeleting: false }
      })
      categories.value = [...categories.value, ...arr]
    })
    .catch((er) => {
      console.error(er?.response?.data?.message)
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
      page.value = 0
      totalCategories.value = null
      categories.value = []
      getCategories()
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
    .finally(() => {
      data.isDeleting = false
    })
}

const handleScroll = () => {
  const el = scrollComponent.value
  if (!el) return
  if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50 && !isLoading.value) getCategories()
}

onMounted(() => {
  getCategories()
  scrollComponent.value.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <section class="bg-screen">
    <div class="main-header-nav">
      <h1 class="main-title">Category</h1>
      <RouterLink to="/category/add-category" class="add-btn"><PlusIcon /> Add Category</RouterLink>
    </div>
    <div ref="scrollComponent" class="h-5/6 overflow-y-auto">
      <div v-if="categories?.length == 0 && !isLoading" class="no-data">
        <NoSymbolIcon class="no-data-icon" /> No Category Available
      </div>
      <div
        v-else
        v-for="c in categories"
        :key="c._id"
        class="md:w-5/6 h-auto md:h-58 mx-8 md:mx-auto p-3 my-8 shadow-2xl rounded-xl flex sm:space-x-5 flex-col sm:flex-row"
        style="background: rgb(255, 255, 255, 0.8)"
      >
        <div class="h-48 md:h-58 w-full sm:w-72 md:w-64 flex-none">
          <img
            v-if="c.image && c.image != 'null' && c.image != 'undefined'"
            :src="c.image"
            alt="Category Image"
            class="full-image"
          />
          <img v-else src="@/assets/img/default-category.png" alt="Category Image" />
        </div>
        <div class="flex-auto p-2">
          <AddEditIcon
            :title="c.title"
            :isShow="c.createdBy == authStore.userData.userId"
            @editItem="router.push(`/category/edit-category/${c._id}`)"
            @deleteItem="deleteCategory(c)"
            :isDeleting="c.isDeleting"
          />
          <!-- <RouterLink :to="`/item`" class="text-orange-400 text-sm">Show Items</RouterLink> -->
          <p class="auth-detail">{{ c.description }}</p>
        </div>
      </div>
      <div v-if="isLoading" class="no-data"><ArrowPathIcon class="no-data-icon" /> Loading...</div>
    </div>
  </section>
</template>

<style scoped>
section {
  background-image: url('@/assets/img/category-bg.jpg');
}
</style>
