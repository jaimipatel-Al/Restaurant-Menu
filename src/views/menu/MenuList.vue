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
      toast.error(er?.response?.data?.message)
    })
    .finally(() => {
      data.isDeleting = false
    })
}
const availableMenu = async (data) => {
  await Axios.patch(`${api.toggleMenuAvailability}${data._id}`)
    .then(() => {
      toast.success('Menu Availability Changed successfully!!')
    })
    .catch((er) => {
      console.log(er)
    })
}
const todayMenu = async (data) => {
  await Axios.post(`${api.selectToday}${data._id}`)
    .then(() => {
      toast.success("Menu's Today's Special Option Changed successfully!!")
      getMenu()
      isLoading.value = false
    })
    .catch((er) => {
      console.log(er)
    })
}

onMounted(() => {
  getMenu()
})
</script>

<template>
  <section class="w-screen h-screen bg-cover">
    <div class="flex-between px-8 py-5">
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
        v-for="(m, i) in menus"
        :key="m._id"
        class="grid grid-cols-3 grid-rows-3 grid-container p-10 shadow shadow-2xl"
        :style="`background: ${
          i % 2 == 1 ? 'rgb(255, 255, 255, 0.8)' : 'rgba(250, 200, 150, 0.6)'
        }`"
      >
        <div
          :class="`row-start-1 row-end-4 flex-none ${
            i % 2 == 1 ? 'col-start-3 col-end-4  flex-none' : ''
          }`"
        >
          <img v-if="m.image" :src="m.image" alt="Menu Image" class="full-image" />
          <img v-else src="@/assets/img/default-menu.jpg" class="full-image" alt="Menu Image" />
        </div>
        <div
          :class="`flex-auto p-5 ${
            i % 2 == 1 ? 'col-start-1 col-end-3' : 'col-start-2 col-end-4 '
          }`"
        >
          <div class="flex items-start justify-between">
            <h3 class="text-orange-700 text-3xl font-bold">{{ m.name }}</h3>
            <div class="flex" v-if="m.createdBy == authStore.userData.userId">
              <PencilIcon class="button-edit" @click="router.push(`/menu/edit-menu/${m._id}`)" />
              <TrashIcon v-if="!m.isDeleting" class="button-delete" @click="deleteMenu(m)" />
              <ArrowPathIcon v-else class="button-delete" />
            </div>
          </div>
          <p class="text-blue-700 text-2xl font-bold pb-5">₹ {{ m.price }} /-</p>
          <div class="flex items-start justify-between flex-wrap">
            <label :for="`available-${m._id}`" class="flex items-center font-semibold text-xl">
              <input
                v-model="m.isActive"
                type="checkbox"
                :id="`available-${m._id}`"
                class="w-6 h-6 cursor-pointer mr-2"
                @change="availableMenu(m)"
              />
              Available
            </label>
            <label :for="`today-menu-${m._id}`" class="flex items-center font-semibold text-xl">
              <input
                v-model="m.isTodayMenu"
                type="checkbox"
                :id="`today-menu-${m._id}`"
                class="w-6 h-6 cursor-pointer mr-2"
                @change="todayMenu(m)"
              />
              Is Add on Today's Menu?
            </label>
          </div>
        </div>
        <div
          :class="`row-start-2 row-end-4 p-5 ${
            i % 2 == 1 ? 'col-start-1 col-end-3' : 'col-start-2 col-end-4'
          }`"
        >
          <p class="text-gray-700 text-2xl font-bold">Items</p>

          <div class="flex items-start justify-start overflow-x-auto w-full">
            <div
              v-for="i in m.subCategories"
              :key="i"
              class="p-2 shadow shadow-2xl rounded rounded-xl w-56 flex-none m-2 cursor-pointer"
              style="background: rgb(255, 255, 255, 0.8)"
              @click="addItem(i)"
            >
              <div class="h-40">
                <img v-if="i.image" :src="i.image" alt="Item Image" class="uploaded-image" />
                <img
                  v-else
                  src="@/assets/img/default-item.jpg"
                  alt="Item Image"
                  class="uploaded-image"
                />
              </div>
              <div class="p-2 font-bold">
                <p class="text-orange-600 text-lg">{{ i.title }}</p>
                <p class="text-blue-700 text-sm">₹ {{ i.price }} /-</p>
              </div>
            </div>
          </div>
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
