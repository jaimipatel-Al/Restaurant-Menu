<script setup>
import { XMarkIcon } from '@heroicons/vue/24/solid'

const props = defineProps(['item', 'isRemove'])
const emit = defineEmits(['addItem'])
</script>

<template>
  <div
    class="p-1 md:p-2 shadow-2xl rounded-xl w-36 sm:w-48 flex-none m-2 cursor-pointer"
    style="background: rgb(255, 255, 255, 0.8)"
    @click="emit('addItem')"
  >
    <XMarkIcon v-if="isRemove ?? false" class="remove-image" />
    <div class="h-24 sm:h-36">
      <img
        v-if="props.item.image && props.item.image != 'null' && props.item.image != 'undefined'"
        :src="props.item.image"
        alt="Item Image"
        class="uploaded-image"
      />
      <img v-else src="@/assets/img/default-item.jpg" alt="Item Image" class="uploaded-image" />
    </div>
    <div class="p-1 font-bold flex-between">
      <p class="text-orange-600 text-xs sm:text-sm md:text-base">{{ props.item.title }}</p>
      <p class="price text-xs sm:text-sm">₹ {{ props.item.price }} /-</p>
    </div>
  </div>
</template>
