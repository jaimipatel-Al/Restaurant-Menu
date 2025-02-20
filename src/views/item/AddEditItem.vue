<script setup>
import { ArrowPathIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import swal from '@/plugin/sweetalert'

const route = useRoute()
const router = useRouter()
const schema = yup.object({
  Title: yup.string().required().max(30),
  Description: yup.string().required().max(500),
  Category: yup.string().required(),
  Price: yup
    .number()
    .required()
    .min(1)
    .max(10000)
    .typeError('Price must be a valid number')
    .positive('Price must be greater than zero')
    .test('decimal-check', 'Price can have up to two decimal places', (value) =>
      /^\d+(\.\d{1,2})?$/.test(value?.toString() || '')
    ),
  Quantity: yup
    .number()
    .required()
    .min(1)
    .max(50)
    .typeError('Quantity must be a valid number')
    .positive('Quantity must be greater than zero')
    .test('decimal-check', 'Quantity can have up to two decimal places', (value) =>
      /^\d+(\.\d{1,2})?$/.test(value?.toString() || '')
    ),
})

const id = computed(() => route?.params?.id)

const categories = ref([])
const title = ref('')
const description = ref('')
const category = ref()
const price = ref()
const quantity = ref()
const file = ref()
const image = ref()
const imageUrl = ref()
const isActive = ref(false)
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
  image.value = null
  imageUrl.value = null
  file.value.value = null
}
const showAlert = () => {
  swal
    .fire({
      title: 'No Category Found',
      text: 'First You Should Add Category.',
      icon: 'warning',
      showCancelButton: false,
    })
    .then((result) => {
      if (result.isConfirmed) router.push('/category/add-category')
    })
}

const getItemDetail = async () => {
  isGetting.value = true

  await Axios.get(`${api.getItem}${id.value}`)
    .then(({ data }) => {
      let res = data.data
      title.value = res.title
      description.value = res.description
      imageUrl.value = res.image
      category.value = res.categoryId._id
      price.value = res.price
      quantity.value = res.quantity
      isActive.value = res.isActive
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
      router.push('/item')
    })
    .finally(() => {
      isGetting.value = false
    })
}
const getCategories = async () => {
  await Axios.get(api.listCategory)
    .then(({ data }) => {
      categories.value = data?.data ?? []
      if (!categories.value?.length) showAlert()
    })
    .catch((er) => {
      console.error(er?.response?.data?.message)
    })
}
const addItem = async () => {
  isLoading.value = true

  let formData
  if (file.value) {
    formData = new FormData()
    formData.append('title', title.value)
    formData.append('description', description.value)
    formData.append('image', image.value)
    formData.append('categoryId', category.value)
    formData.append('price', price.value)
    formData.append('quantity', quantity.value)
  } else
    formData = {
      title: title.value,
      description: description.value,
      categoryId: category.value,
      price: price.value,
      quantity: quantity.value,
    }

  await Axios.post(api.createItem, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then(() => {
      toast.success('Item created successfully!!')
      router.push('/item')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
    .finally(() => {
      isLoading.value = false
    })
}
const editItem = async () => {
  isLoading.value = true

  let formData
  if (file.value) {
    formData = new FormData()
    formData.append('title', title.value)
    formData.append('description', description.value)
    formData.append('image', image.value)
    formData.append('categoryId', category.value)
    formData.append('price', price.value)
    formData.append('quantity', quantity.value)
    formData.append('isActive', isActive.value)
  } else
    formData = {
      title: title.value,
      description: description.value,
      categoryId: category.value,
      price: price.value,
      quantity: quantity.value,
      isActive: isActive.value,
    }

  await Axios.put(`${api.updateItem}${id.value}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then(() => {
      toast.success('Item updated successfully!!')
      router.push('/item')
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
    if (id.value) getItemDetail()
  },
  { immediate: true }
)

onMounted(() => getCategories())
</script>

<template>
  <section class="bg-screen add-edit-form">
    <div class="md:w-5/6 shadow-2xl my-8 p-8 mx-auto" style="background: rgb(250, 200, 200, 0.25)">
      <h1 class="auth-title">{{ id ? 'Update ' : 'Add ' }} Item</h1>
      <p class="auth-detail">
        {{
          id
            ? 'Update an existing dish in just a few clicks.'
            : 'Add a new your favorite food items with our simple details.'
        }}
        <RouterLink to="/item" class="route-link">Back to Item list</RouterLink>
      </p>
      <Form
        @submit="id ? editItem() : addItem()"
        :validation-schema="schema"
        v-slot="{ errors }"
        class="flex space-x-10"
      >
        <div class="flex-1">
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
          <div v-if="imageUrl" class="relative mt-4 w-24 h-24">
            <XMarkIcon class="remove-image" @click="removeImage()" />
            <img
              :src="imageUrl"
              alt="Uploaded Image"
              class="full-image rounded-lg border border-gray-300"
            />
          </div>

          <button type="submit" :disabled="isLoading">
            {{ id ? 'Edit ' : 'Add ' }} Item <ArrowPathIcon v-if="isLoading" class="w-6 mx-3" />
          </button>
        </div>
        <div class="flex-1">
          <label for="category">Category</label>
          <p v-if="isGetting" class="input-shimmer"></p>
          <Field v-if="!isGetting" v-model="category" v-slot="{ field }" name="Category">
            <select v-bind="field" id="category" class="input" placeholder="Enter Your Category">
              <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.title }}</option>
            </select>
          </Field>
          <p v-if="!isGetting" class="error-message">{{ errors?.Category }}</p>

          <label for="price">Price</label>
          <p v-if="isGetting" class="input-shimmer"></p>
          <Field
            v-if="!isGetting"
            v-model="price"
            type="number"
            name="Price"
            id="price"
            class="input"
            placeholder="Enter Your Price"
          />
          <p v-if="!isGetting" class="error-message">{{ errors?.Price }}</p>

          <label for="quantity">Quantity</label>
          <p v-if="isGetting" class="input-shimmer"></p>
          <Field
            v-if="!isGetting"
            v-model="quantity"
            type="number"
            name="Quantity"
            id="quantity"
            class="input"
            placeholder="Enter Your Quantity"
          />
          <p v-if="!isGetting" class="error-message">{{ errors?.Quantity }}</p>

          <label v-if="id && !isGetting" for="available" class="flex items-center font-semibold">
            <input
              v-model="isActive"
              type="checkbox"
              id="available"
              class="w-4 h-4 cursor-pointer mr-2"
            />
            Available
          </label>
        </div>
      </Form>
    </div>
  </section>
</template>

<style scoped>
section {
  background-image: url('@/assets/img/add-item-bg.jpg');
}
</style>
