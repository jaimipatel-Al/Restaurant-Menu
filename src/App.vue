<script setup>
import HeaderComp from '@/components/DashBoard/HeaderComp.vue'
import { ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
const isHideHeader = ref(false)

watch(route, () => {
  isHideHeader.value = route?.meta?.auth == false
})
</script>

<template>
  <main>
    <HeaderComp
      v-if="!isHideHeader"
      class="w-full absolute bg-white bg-opacity-50"
      style="height: 80px"
    />
    <RouterView :style="`padding-top: ${!isHideHeader ? '80px' : '0'}`" />
  </main>
</template>
