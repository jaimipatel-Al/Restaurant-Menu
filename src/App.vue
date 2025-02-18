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
  <HeaderComp v-if="!isHideHeader" />
  <RouterView />
</template>
