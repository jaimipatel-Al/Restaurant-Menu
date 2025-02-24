<script setup>
import { ArrowPathIcon, PlusIcon, MinusIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  isLoading: Boolean,
  value: Number,
})

const emit = defineEmits(['removeItem', 'addItem'])
</script>

<template>
  <div class="flex items-center space-x-3">
    <button :disabled="props.isLoading" class="button p-2" @click="emit('removeItem')">
      <MinusIcon class="w-6" />
    </button>
    <ArrowPathIcon v-if="props.isLoading" class="w-6 text-orange-700" />
    <span v-else class="font-semibold text-lg p-1.5">
      {{ value }}
    </span>
    <button :disabled="props.isLoading" class="button p-2" @click="emit('addItem')">
      <PlusIcon class="w-6" />
    </button>
  </div>
</template>
