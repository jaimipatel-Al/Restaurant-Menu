<script setup>
import { ArrowPathIcon, NoSymbolIcon } from '@heroicons/vue/24/solid'
import { computed, onMounted, ref } from 'vue'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import { useRoute } from 'vue-router'

const route = useRoute()

const id = computed(() => route?.params?.id)

const isMenuLoading = ref(false)
const isItemLoading = ref(false)
const menus = ref([])
const items = ref([])

const getCustomerMenu = async () => {
  isMenuLoading.value = true

  await Axios.get(`${api.customerMenu}${id.value}?page=1&limit=10`)
    .then(({ data }) => {
      menus.value = data?.data?.map((e) => {
        return { ...e, isDeleting: false }
      })
    })
    .catch((er) => {
      console.error(er?.response?.data?.message)
    })
    .finally(() => {
      isMenuLoading.value = false
    })
}
const getCustomerItems = async () => {
  isItemLoading.value = true

  await Axios.get(`${api.customerItems}${id.value}?page=1&limit=10`)
    .then(({ data }) => {
      items.value = data?.data?.map((e) => {
        return { ...e, isDeleting: false }
      })
    })
    .catch((er) => {
      console.error(er?.response?.data?.message)
    })
    .finally(() => {
      isItemLoading.value = false
    })
}

onMounted(() => {
  getCustomerMenu()
  getCustomerItems()
})
</script>

<template>
  <section class="bg-screen">
    <div v-if="isMenuLoading || isItemLoading" class="no-data">
      <ArrowPathIcon class="w-12 mx-3" /> Loading...
    </div>
    <div v-else-if="restaurants?.length == 0" class="no-data">
      <NoSymbolIcon class="w-12 mx-3" /> No Restaurants Available
    </div>
    <div v-else class="h-5/6 overflow-y-auto flex justify-evenly items-start flex-wrap"></div>
  </section>
</template>

<style scoped>
section {
  background-image: url('@/assets/img/restaurant-menu.jpg');
}
</style>
