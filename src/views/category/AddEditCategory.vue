<script setup>
import { ArrowPathIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'

const route = useRoute()
const schema = yup.object({
  Title: yup.string().required().max(30),
  Description: yup.string().required().max(500),
})

const id = computed(() => route?.params?.id)

const title = ref('')
const description = ref('')
const file = ref()
const imageUrl = ref()
const isLoading = ref(false)

const addCategory = () => {
  let formData

  if (file.value) {
    formData = new FormData()
    formData.append('file', file.value)
  }

  // headers: {  'Content-Type': 'multipart/form-data',},
}
const editCategory = () => {}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageUrl.value = URL.createObjectURL(file)
  }
}
const removeImage = () => {
  imageUrl.value = null
  file.value.value = null
}
</script>

<template>
  <main class="w-screen h-screen bg-cover flex items-center justify-end add-edit-form">
    <div
      class="sm:w-1/3 shadow shadow-2xl m-16 p-8"
      style="background: rgb(250, 200, 200, 0.25); min-width: 300px"
    >
      <h1 class="auth-title">{{ id ? 'Update ' : 'Add ' }} Category</h1>
      <p class="auth-detail">
        Organize your menu effortlessly by {{ id ? 'updating  ' : 'adding  ' }} food categories!
        <RouterLink to="/category" class="text-orange-600 underline"
          >Back to Category list</RouterLink
        >
      </p>
      <Form
        @submit="id ? editCategory : addCategory"
        :validation-schema="schema"
        v-slot="{ errors }"
      >
        <label for="title">Title</label>
        <Field
          v-model="title"
          type="text"
          name="Title"
          id="title"
          class="input"
          placeholder="Enter Your Title"
        />
        <p class="error-message">{{ errors?.Title }}</p>

        <label for="description">Description</label>
        <Field v-model="description" v-slot="{ field }" name="Description">
          <textarea
            v-bind="field"
            id="description"
            class="input h-40"
            placeholder="Enter Your Description"
          ></textarea>
        </Field>
        <p class="error-message">{{ errors?.Description }}</p>

        <label for="image" style="display: flex" class="items-center">
          Upload Image
          <ArrowUpTrayIcon class="upload-button mx-2" v-if="!imageUrl" @click="file.click()" />
          <input type="file" accept="image/*" ref="file" hidden @change="handleFileUpload" />
        </label>
        <div v-if="imageUrl" class="relative mt-4 w-24 h-24">
          <XMarkIcon
            class="absolute w-7 p-1 bg-red-500 hover:bg-red-600 cursor-pointer rounded-full -top-2 -right-2 text-white"
            @click="removeImage()"
          />
          <img
            :src="imageUrl"
            alt="Uploaded Image"
            class="w-full h-full object-cover rounded-lg border border-gray-300"
          />
        </div>

        <button type="submit" :disabled="isLoading">
          {{ id ? 'Edit ' : 'Add ' }} Category <ArrowPathIcon v-if="isLoading" class="mx-3" />
        </button>
      </Form>
    </div>
  </main>
</template>

<style scoped>
main {
  background-image: url('@/assets/img/add-category-bg.jpg');
}
</style>
