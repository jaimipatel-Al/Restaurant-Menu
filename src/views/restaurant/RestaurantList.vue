<script setup>
import { ArrowPathIcon, NoSymbolIcon } from '@heroicons/vue/24/solid'
import { onMounted, ref } from 'vue'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoading = ref(false)
const restaurants = ref([])

const getRestaurant = async () => {
  isLoading.value = true

  await Axios.get(api.restaurantList)
    .then(({ data }) => {
      restaurants.value = data?.data?.map((e) => {
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

onMounted(() => {
  getRestaurant()
})
</script>

<template>
  <section class="bg-screen">
    <h1 class="auth-title px-8 py-5">Restaurants</h1>
    <div v-if="isLoading" class="no-data"><ArrowPathIcon class="w-12 mx-3" /> Loading...</div>
    <div v-else-if="restaurants?.length == 0" class="no-data">
      <NoSymbolIcon class="w-12 mx-3" /> No Restaurants Available
    </div>
    <div v-else class="h-5/6 overflow-y-auto flex justify-evenly items-start flex-wrap">
      <div
        v-for="(r, i) in restaurants"
        :key="r._id"
        class="h-auto m-2 p-3 cursor-pointer bg-white shadow-2xl"
        @click="router.push(`/restaurant/${r._id}`)"
      >
        <div>
          <img
            v-if="i % 10 == 0"
            src="@/assets/img/restaurant/r-0.jpg"
            class="h-48 sm:h-56 md:h-72 w-full object-cover"
            alt="Restaurant Image"
          />
          <img
            v-if="i % 10 == 1"
            src="@/assets/img/restaurant/r-1.jpg"
            class="h-48 sm:h-56 md:h-72 w-full object-cover"
            alt="Restaurant Image"
          />
          <img
            v-if="i % 10 == 2"
            src="@/assets/img/restaurant/r-2.jpg"
            class="h-48 sm:h-56 md:h-72 w-full object-cover"
            alt="Restaurant Image"
          />
          <img
            v-if="i % 10 == 3"
            src="@/assets/img/restaurant/r-3.jpg"
            class="h-48 sm:h-56 md:h-72 w-full object-cover"
            alt="Restaurant Image"
          />
          <img
            v-if="i % 10 == 4"
            src="@/assets/img/restaurant/r-4.jpg"
            class="h-48 sm:h-56 md:h-72 w-full object-cover"
            alt="Restaurant Image"
          />
          <img
            v-if="i % 10 == 5"
            src="@/assets/img/restaurant/r-5.jpg"
            class="h-48 sm:h-56 md:h-72 w-full object-cover"
            alt="Restaurant Image"
          />
          <img
            v-if="i % 10 == 6"
            src="@/assets/img/restaurant/r-6.jpg"
            class="h-48 sm:h-56 md:h-72 w-full object-cover"
            alt="Restaurant Image"
          />
          <img
            v-if="i % 10 == 7"
            src="@/assets/img/restaurant/r-7.jpg"
            class="h-48 sm:h-56 md:h-72 w-full object-cover"
            alt="Restaurant Image"
          />
          <img
            v-if="i % 10 == 8"
            src="@/assets/img/restaurant/r-8.jpg"
            class="h-48 sm:h-56 md:h-72 w-full object-cover"
            alt="Restaurant Image"
          />
          <img
            v-if="i % 10 == 8"
            src="@/assets/img/restaurant/r-8.jpg"
            class="h-48 sm:h-56 md:h-72 w-full object-cover"
            alt="Restaurant Image"
          />
        </div>
        <h2 class="text-orange-700 text-2xl font-bold text-center pt-4 hover:text-orange-500">
          {{ r.name }}
        </h2>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  background-image: url('@/assets/img/restaurant-bg.jpg');
}
</style>
