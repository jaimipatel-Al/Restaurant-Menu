<script setup>
import { PlusIcon, ArrowPathIcon, NoSymbolIcon } from '@heroicons/vue/24/solid'
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import { useAuthStore } from '@/stores/authStore'
import toast from '@/plugin/toast'
import AddEditIcon from '@/components/elements/AddEditIcon.vue'
import ComboItems from '@/components/elements/ComboItems.vue'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const combos = ref([])
const scrollComponent = ref()
const page = ref(0)
const totalCombos = ref()

const getCombo = async () => {
  if (combos.value?.length == totalCombos.value) return

  page.value++
  isLoading.value = true

  await Axios.get(`${api.listCombo}?page=${page.value}&limit=4`)
    .then(({ data }) => {
      const res = data.data
      totalCombos.value = res.totalMenus
      const arr = res.menus.map((e) => {
        return { ...e, isDeleting: false }
      })
      combos.value = [...combos.value, ...arr]
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
      page.value = 0
      totalCombos.value = null
      combos.value = []
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
      page.value = 0
      totalCombos.value = null
      combos.value = []
      getCombo()
      isLoading.value = false
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
}

const handleScroll = () => {
  const el = scrollComponent.value
  if (!el) return
  if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50 && !isLoading.value) getCombo()
}

onMounted(() => {
  getCombo()
  scrollComponent.value.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <section class="bg-screen">
    <div class="main-header-nav">
      <h1 class="main-title">Combo</h1>
      <RouterLink to="/combo/add-combo" class="add-btn"><PlusIcon /> Add Combo</RouterLink>
    </div>
    <div ref="scrollComponent" class="h-5/6 overflow-y-auto">
      <div v-if="combos?.length == 0 && !isLoading" class="no-data">
        <NoSymbolIcon class="no-data-icon" /> No Combo Available
      </div>
      <div
        v-else
        v-for="(m, i) in combos"
        :key="m._id"
        class="sm:grid grid-cols-3 grid-rows-3 grid-container pa-10 shadow-2xl"
        :style="`background: ${
          i % 2 == 1 ? 'rgb(255, 255, 255, 0.8)' : 'rgba(250, 200, 150, 0.6)'
        }`"
      >
        <div
          :class="`row-start-1 row-end-4 flex-none ${
            i % 2 == 1 ? 'col-start-3 col-end-4  flex-none' : ''
          }`"
        >
          <img
            v-if="m.image && m.image != 'null' && m.image != 'undefined'"
            :src="m.image"
            alt="Combo Image"
            class="full-image"
          />
          <img v-else src="@/assets/img/default-combo.jpg" class="full-image" alt="Combo Image" />
        </div>
        <div
          :class="`flex-auto pa-5 ${
            i % 2 == 1 ? 'col-start-1 col-end-3' : 'col-start-2 col-end-4 '
          }`"
        >
          <AddEditIcon
            :title="m.name"
            :isShow="m.createdBy == authStore.userData.userId"
            @editItem="router.push(`/combo/edit-combo/${m._id}`)"
            @deleteItem="deleteCombo(m)"
            :isDeleting="m.isDeleting"
          />
          <p class="price">₹ {{ m.price }} /-</p>
          <div class="flex items-start justify-between flex-wrap pt-1 sm:pt-3 md:pt-5">
            <label
              :for="`available-${m._id}`"
              class="flex items-center font-semibold text-xs sm:text-base md:text-xl"
            >
              <input
                v-model="m.isActive"
                type="checkbox"
                :id="`available-${m._id}`"
                class="w-4 sm:w-6 h-4 sm:h-6 cursor-pointer mr-2"
                @change="availableCombo(m)"
              />
              Available
            </label>
            <label
              :for="`today-combo-${m._id}`"
              class="flex font-semibold text-xs sm:text-base md:text-xl"
            >
              <input
                v-model="m.isTodayMenu"
                type="checkbox"
                :id="`today-combo-${m._id}`"
                class="w-4 sm:w-6 h-4 sm:h-6 cursor-pointer mr-2"
                @change="todayCombo(m)"
              />
              Is Add on Today's Special Combo?
            </label>
          </div>
        </div>
        <div
          :class="`row-start-2 row-end-4 pa-5 ${
            i % 2 == 1 ? 'col-start-1 col-end-3' : 'col-start-2 col-end-4'
          }`"
        >
          <p class="text-gray-700 text-lg sm:text-xl md:text-2xl font-bold">Items</p>

          <div class="flex items-start justify-start overflow-x-auto w-full">
            <ComboItems v-for="i in m.subCategories" :key="i" :item="i" />
          </div>
        </div>
      </div>
      <div v-if="isLoading" class="no-data"><ArrowPathIcon class="no-data-icon" /> Loading...</div>
    </div>
  </section>
</template>

<style scoped>
section {
  background-image: url('@/assets/img/combo-bg.jpg');
}
</style>
