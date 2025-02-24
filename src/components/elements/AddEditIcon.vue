<script setup>
import { PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  title: String,
  isShow: Boolean,
  isDeleting: Boolean,
})

const emit = defineEmits(['editItem', 'deleteItem'])
</script>

<template>
  <div class="flex items-start justify-between">
    <h3 class="sub-title">{{ props.title }}</h3>
    <div v-if="isShow" class="flex">
      <PencilIcon class="button-edit" @click="emit('editItem')" />
      <TrashIcon v-if="!props.isDeleting" class="button-delete" @click="emit('deleteItem')" />
      <ArrowPathIcon v-else class="button-delete" />
    </div>
  </div>
</template>
