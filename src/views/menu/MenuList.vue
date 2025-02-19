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
const menus = ref([])

const getMenu = async () => {
  isLoading.value = true

  await Axios.get(api.listMenu)
    .then(({ data }) => {
      menus.value = data?.data?.map((e) => {
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
const deleteMenu = async (data) => {
  data.isDeleting = true

  await Axios.delete(`${api.deleteMenu}${data._id}`)
    .then(() => {
      toast.success('Menu deleted successfully!!')
      getMenu()
    })
    .catch((er) => {
      console.log(er)
    })
    .finally(() => {
      data.isDeleting = false
    })
}

onMounted(() => {
  getMenu()
})
</script>

<template>
  <section class="w-screen h-screen bg-cover">
    <div class="flex-between p-8">
      <h1 class="auth-title">Menu</h1>
      <RouterLink to="/menu/add-menu" class="button flex items-center"
        ><PlusIcon class="w-12 mr-2" /> Add Menu</RouterLink
      >
    </div>
    <div v-if="isLoading" class="no-data"><ArrowPathIcon class="w-12 mx-3" /> Loading...</div>
    <div v-else-if="menus?.length == 0" class="no-data">
      <NoSymbolIcon class="w-12 mx-3" /> No Menu Available
    </div>
    <div v-else class="h-5/6 overflow-y-auto">
      <div
        v-for="c in menus"
        :key="c._id"
        class="md:w-5/6 h-64 mx-auto p-3 my-8 shadow shadow-2xl rounded rounded-xl flex space-x-5 flex-col sm:flex-row"
        style="background: rgb(255, 255, 255, 0.8)"
      >
        <div class="w-full sm:w-96 md:w-80 flex-none">
          <img v-if="c.image" :src="c.image" alt="Menu Image" class="w-full h-full object-cover" />
          <img v-else src="@/assets/img/default-menu.jpg" alt="Menu Image" />
        </div>
        <div class="flex-auto p-2">
          <div class="flex items-start justify-between">
            <h3 class="text-orange-700 text-2xl font-semibold">{{ c.title }}</h3>
            <div class="flex" v-if="c.createdBy == authStore.userData.userId">
              <PencilIcon class="button-edit" @click="router.push(`/menu/edit-menu/${c._id}`)" />
              <TrashIcon v-if="!c.isDeleting" class="button-delete" @click="deleteMenu(c)" />
              <ArrowPathIcon v-else class="button-delete" />
            </div>
          </div>
          <RouterLink :to="`/item/${c._id}`" class="text-orange-400 text-sm">Show Items</RouterLink>
          <p class="auth-detail">{{ c.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  background-image: url('@/assets/img/menu-bg.jpg');
}
</style>
