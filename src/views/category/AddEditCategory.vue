<script setup>
import { ArrowPathIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { computed, ref, watch } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'

const route = useRoute()
const router = useRouter()
const schema = yup.object({
  Title: yup.string().required().max(30),
  Description: yup.string().required().max(500),
})

const id = computed(() => route?.params?.id)

const title = ref('')
const description = ref('')
const file = ref()
const image = ref()
const imageUrl = ref()
const isLoading = ref(false)
const isGetting = ref(false)

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    image.value = file
    imageUrl.value = URL.createObjectURL(file)
  }
}
const removeImage = () => {
  imageUrl.value = null
  image.value = null
  file.value.value = null
}

const getCategoryDetail = async () => {
  isGetting.value = true

  await Axios.get(`${api.getCategory}${id.value}`)
    .then(({ data }) => {
      let res = data.data
      title.value = res.title
      description.value = res.description
      imageUrl.value = res.image
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
      router.push('/category')
    })
    .finally(() => {
      isGetting.value = false
    })
}
const addCategory = async () => {
  isLoading.value = true

  let formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  if (image.value) formData.append('image', image.value)

  await Axios.post(api.createCategory, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then(() => {
      toast.success('Category created successfully!!')
      router.push('/category')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
    .finally(() => {
      isLoading.value = false
    })
}
const editCategory = async () => {
  isLoading.value = true

  let formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  if (image.value || (!imageUrl.value && !image.value)) formData.append('image', image.value)

  await Axios.put(`${api.updateCategory}${id.value}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then(() => {
      toast.success('Category updated successfully!!')
      router.push('/category')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
    .finally(() => {
      isLoading.value = false
    })
}

watch(
  id,
  () => {
    if (id.value) getCategoryDetail()
  },
  { immediate: true }
)
</script>

<template>
  <section class="bg-screen flex items-center justify-end add-edit-form">
    <div
      class="w-full sm:w-2/3 md:w-1/3 shadow-2xl m-5 sm:m-10 md:m-16 p-4 sm:p-6 md:p-8"
      style="background: rgb(250, 200, 200, 0.25); min-width: 300px"
    >
      <h1 class="main-title">{{ id ? 'Update ' : 'Add ' }} Category</h1>
      <p class="auth-detail">
        Organize your menu effortlessly by {{ id ? 'updating  ' : 'adding  ' }} food categories!
        <RouterLink to="/category" class="route-link">Back to Category list</RouterLink>
      </p>
      <Form
        @submit="id ? editCategory() : addCategory()"
        :validation-schema="schema"
        v-slot="{ errors }"
      >
        <label for="title">Title</label>
        <p v-if="isGetting" class="input-shimmer"></p>
        <Field
          v-if="!isGetting"
          v-model="title"
          type="text"
          name="Title"
          id="title"
          class="input"
          placeholder="Enter Your Title"
        />
        <p v-if="!isGetting" class="error-message">{{ errors?.Title }}</p>

        <label for="description">Description</label>
        <p v-if="isGetting" class="textarea-shimmer"></p>
        <Field v-if="!isGetting" v-model="description" v-slot="{ field }" name="Description">
          <textarea
            v-bind="field"
            id="description"
            class="input h-40"
            placeholder="Enter Your Description"
          ></textarea>
        </Field>
        <p v-if="!isGetting" class="error-message">{{ errors?.Description }}</p>

        <label v-if="!isGetting" for="image" style="display: flex" class="items-center">
          Upload Image
          <ArrowUpTrayIcon class="upload-button mx-2" v-if="!imageUrl" @click="file.click()" />
          <input type="file" accept="image/*" ref="file" hidden @change="handleFileUpload" />
        </label>
        <div
          v-if="imageUrl && !isGetting"
          class="relative mt-2 sm:mt-2 md:mt-4 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24"
        >
          <XMarkIcon class="remove-image" @click="removeImage()" />
          <img :src="imageUrl" alt="Uploaded Image" class="uploaded-img-box" />
        </div>

        <button type="submit" :disabled="isLoading || isGetting">
          {{ id ? 'Edit ' : 'Add ' }} Category
          <ArrowPathIcon v-if="isLoading" class="loading-btn" />
        </button>
      </Form>
    </div>
  </section>
</template>

<style scoped>
section {
  background-image: url('@/assets/img/add-category-bg.jpg');
}
</style>
