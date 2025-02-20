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
const combos = ref([])

const getCombo = async () => {
  isLoading.value = true

  await Axios.get(api.listCombo)
    .then(({ data }) => {
      combos.value = data?.data?.menus?.map((e) => {
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
const deleteCombo = async (data) => {
  data.isDeleting = true

  await Axios.delete(`${api.deleteCombo}${data._id}`)
    .then(() => {
      toast.success('Combo deleted successfully!!')
      getCombo()
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
    .finally(() => {
      data.isDeleting = false
    })
}
const availableCombo = async (data) => {
  await Axios.patch(`${api.toggleComboAvailability}${data._id}`)
    .then(() => {
      toast.success('Combo Availability Changed successfully!!')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
}
const todayCombo = async (data) => {
  await Axios.post(`${api.selectToday}${data._id}`)
    .then(() => {
      toast.success("Combo's Today's Special Option Changed successfully!!")
      getCombo()
      isLoading.value = false
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
}

onMounted(() => {
  getCombo()
})
</script>

<template>
  <section class="bg-screen">
    <div class="flex-between px-8 py-5">
      <h1 class="auth-title">Combo</h1>
      <RouterLink to="/combo/add-combo" class="add-btn"><PlusIcon /> Add Combo</RouterLink>
    </div>
    <div v-if="isLoading" class="no-data"><ArrowPathIcon class="w-12 mx-3" /> Loading...</div>
    <div v-else-if="combos?.length == 0" class="no-data">
      <NoSymbolIcon class="w-12 mx-3" /> No Combo Available
    </div>
    <div v-else class="h-5/6 overflow-y-auto">
      <div
        v-for="(m, i) in combos"
        :key="m._id"
        class="grid grid-cols-3 grid-rows-3 grid-container p-10 shadow-2xl"
        :style="`background: ${
          i % 2 == 1 ? 'rgb(255, 255, 255, 0.8)' : 'rgba(250, 200, 150, 0.6)'
        }`"
      >
        <div
          :class="`row-start-1 row-end-4 flex-none ${
            i % 2 == 1 ? 'col-start-3 col-end-4  flex-none' : ''
          }`"
        >
          <img v-if="m.image" :src="m.image" alt="Combo Image" class="full-image" />
          <img v-else src="@/assets/img/default-combo.jpg" class="full-image" alt="Combo Image" />
        </div>
        <div
          :class="`flex-auto p-5 ${
            i % 2 == 1 ? 'col-start-1 col-end-3' : 'col-start-2 col-end-4 '
          }`"
        >
          <div class="flex items-start justify-between">
            <h3 class="text-orange-700 text-3xl font-bold">{{ m.name }}</h3>
            <div class="flex" v-if="m.createdBy == authStore.userData.userId">
              <PencilIcon class="button-edit" @click="router.push(`/combo/edit-combo/${m._id}`)" />
              <TrashIcon v-if="!m.isDeleting" class="button-delete" @click="deleteCombo(m)" />
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
                @change="availableCombo(m)"
              />
              Available
            </label>
            <label :for="`today-combo-${m._id}`" class="flex items-center font-semibold text-xl">
              <input
                v-model="m.isTodayMenu"
                type="checkbox"
                :id="`today-combo-${m._id}`"
                class="w-6 h-6 cursor-pointer mr-2"
                @change="todayCombo(m)"
              />
              Is Add on Today's Special Combo?
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
              class="p-2 shadow-2xl rounded-xl w-56 flex-none m-2 cursor-pointer"
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
  background-image: url('@/assets/img/combo-bg.jpg');
}
</style>
