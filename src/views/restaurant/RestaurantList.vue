<script setup>
import { ArrowPathIcon, NoSymbolIcon } from '@heroicons/vue/24/solid'
import { onMounted, ref } from 'vue'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoading = ref(false)
const restaurants = ref([])
const scrollComponent = ref()
const page = ref(0)
const totalRestaurants = ref()

const getRestaurant = async () => {
  if (restaurants.value?.length == totalRestaurants.value) return

  page.value++
  isLoading.value = true

  await Axios.get(`${api.restaurantList}?page=${page.value}&limit=8`)
    .then(({ data }) => {
      const res = data.data
      totalRestaurants.value = res?.totalOwners
      const arr = res?.users?.map((e) => {
        return { ...e, isDeleting: false }
      })
      restaurants.value = [...restaurants.value, ...arr]
    })
    .catch((er) => {
      console.error(er?.response?.data?.message)
    })
    .finally(() => {
      isLoading.value = false
    })
}

const handleScroll = () => {
  const el = scrollComponent.value
  if (!el) return
  if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50 && !isLoading.value) getRestaurant()
}

onMounted(() => {
  getRestaurant()
  scrollComponent.value.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <section class="bg-screen">
    <div class="px-8 py-5">
      <h1 class="main-title">Restaurants</h1>
    </div>
    <div
      ref="scrollComponent"
      class="h-5/6 overflow-y-auto flex justify-evenly items-start flex-wrap"
    >
      <div v-if="restaurants?.length == 0 && !isLoading" class="no-data">
        <NoSymbolIcon class="no-data-icon" /> No Restaurants Available
      </div>
      <div
        v-else
        v-for="(r, i) in restaurants"
        :key="r._id"
        class="h-auto m-1 sm:m-2 p-2 sm:p-3 cursor-pointer bg-white shadow-2xl"
        @click="router.push(`/restaurant/${r._id}`)"
      >
        <div>
          <img
            v-if="r?.image && r.image != 'null' && r.image != 'undefined'"
            :src="r.image"
            class="h-36 sm:h-48 md:h-56 md:h-72 w-36 sm:w-full object-cover"
            alt="Restaurant Image"
          />
          <img
            v-else
            src="@/assets/img/default-restaurant.jpg"
            class="h-36 sm:h-48 md:h-56 md:h-72 w-36 sm:w-full object-cover"
            alt="Restaurant Image"
          />
        </div>
        <h2 class="sub-title text-center pt-2 sm:pt-3 md:pt-4">
          {{ r.name }}
        </h2>
      </div>
      <div v-if="isLoading" class="no-data"><ArrowPathIcon class="no-data-icon" /> Loading...</div>
    </div>
  </section>
</template>

<style scoped>
section {
  background-image: url('@/assets/img/restaurant-bg.jpg');
}
</style>
