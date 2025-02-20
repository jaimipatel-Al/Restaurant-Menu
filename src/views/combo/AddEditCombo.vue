<script setup>
import { ArrowPathIcon, ArrowUpTrayIcon, XMarkIcon, NoSymbolIcon } from '@heroicons/vue/24/solid'
import { computed, onMounted, ref, watch } from 'vue'
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
})

const id = computed(() => route?.params?.id)

const items = ref([])
const selectedItem = ref([])
const title = ref('')
const price = ref()
const isTodayMenu = ref(false)
const file = ref()
const image = ref()
const isActive = ref(false)
const imageUrl = ref()
const isLoading = ref(false)
const isItemLoading = ref(false)
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

const totalPrice = computed(() => {
  if (selectedItem.value?.length) return selectedItem.value.reduce((e, item) => e + item.price, 0)
  return 0
})
const addItem = (i) => {
  if (selectedItem.value.find((e) => e._id == i._id)) {
    let arr = selectedItem.value.filter((e) => e._id !== i._id)
    selectedItem.value = [...arr]
  } else selectedItem.value.push(i)
}

const getItems = async () => {
  isItemLoading.value = true

  await Axios.get(api.listItem)
    .then(({ data }) => {
      items.value = data?.data?.subcategories
    })
    .catch((er) => {
      console.error(er?.response?.data?.message)
    })
    .finally(() => {
      isItemLoading.value = false
    })
}
const addCombo = async () => {
  isLoading.value = true

  let formData
  if (imageUrl.value) {
    formData = new FormData()
    formData.append('name', title.value)
    formData.append('price', price.value)
    formData.append('isTodayMenu', isTodayMenu.value)
    formData.append('image', image.value)
    selectedItem.value.forEach((e, i) => formData.append(`subCategories[${i}]`, e._id))
  } else
    formData = {
      name: title.value,
      price: price.value,
      isTodayMenu: isTodayMenu.value,
      subCategories: selectedItem.value.map((e) => e._id),
    }

  await Axios.post(api.createCombo, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then(() => {
      toast.success('Combo created successfully!!')
      router.push('/combo')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
    .finally(() => {
      isLoading.value = false
    })
}
const editCombo = async () => {
  isLoading.value = true

  let formData
  if (file.value) {
    formData = new FormData()
    formData.append('name', title.value)
    formData.append('price', price.value)
    formData.append('isTodayMenu', isTodayMenu.value)
    formData.append('isActive', isActive.value)
    formData.append('image', image.value)
    selectedItem.value.forEach((e, i) => formData.append(`subCategories[${i}]`, e._id))
  } else
    formData = {
      name: title.value,
      price: price.value,
      isTodayMenu: isTodayMenu.value,
      isActive: isActive.value,
      subCategories: selectedItem.value.map((e) => e._id),
    }

  await Axios.put(`${api.updateCombo}${id.value}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then(() => {
      toast.success('Combo updated successfully!!')
      router.push('/combo')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
    .finally(() => {
      isLoading.value = false
    })
}
const getComboDetail = async () => {
  isGetting.value = true

  await Axios.get(`${api.getCombo}${id.value}`)
    .then(({ data }) => {
      let res = data.data
      title.value = res.name
      price.value = res.price
      isTodayMenu.value = res.isTodayMenu
      isActive.value = res.isActive
      imageUrl.value = res.image
      selectedItem.value = res.subCategories
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
      router.push('/combo')
    })
    .finally(() => {
      isGetting.value = false
    })
}

watch(
  id,
  () => {
    if (id.value) getComboDetail()
  },
  { immediate: true }
)

onMounted(() => {
  getItems()
})
</script>

<template>
  <section class="bg-screen flex items-center justify-end add-edit-form">
    <div
      class="w-full h-5/6 shadow-2xl mx-10 py-5 px-10 flex"
      style="background: rgb(250, 200, 200, 0.25); min-width: 300px"
    >
      <div class="w-96 flex-none">
        <h1 class="auth-title">{{ id ? 'Update ' : 'Add ' }} Combo</h1>
        <p class="auth-detail">
          Make Combo, A perfect mix of tasty snacks and hearty meals.
          <RouterLink to="/combo" class="route-link">Back to Combo list</RouterLink>
        </p>
        <Form
          @submit="id ? editCombo() : addCombo()"
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
          <p v-if="selectedItem?.length && !isGetting" class="text-green-700 text-sm font-semibold">
            Total price of selected item : {{ totalPrice }}
          </p>
          <p v-if="!isGetting" class="error-message">{{ errors?.Price }}</p>

          <label v-if="!isGetting" for="today-combo" class="flex items-center space-x-3">
            <input
              v-model="isTodayMenu"
              type="checkbox"
              id="today-combo"
              class="w-4 h-4 cursor-pointer"
            />
            Is Add on Today's Special Combo?
          </label>
          <label v-if="!isGetting && id" for="active" class="flex items-center space-x-3 mb-5">
            <input v-model="isActive" type="checkbox" id="active" class="w-4 h-4 cursor-pointer" />
            Available
          </label>

          <label v-if="!isGetting" for="image" style="display: flex" class="items-center">
            Upload Image
            <ArrowUpTrayIcon class="upload-button mx-2" v-if="!imageUrl" @click="file.click()" />
            <input type="file" accept="image/*" ref="file" hidden @change="handleFileUpload" />
          </label>
          <div v-if="imageUrl && !isGetting" class="relative mt-4 w-24 h-24">
            <XMarkIcon class="remove-image" @click="removeImage()" />
            <img
              :src="imageUrl"
              alt="Uploaded Image"
              class="full-image rounded-lg border border-gray-300"
            />
          </div>

          <button type="submit" :disabled="isLoading || isGetting || items?.length == 0">
            {{ id ? 'Edit ' : 'Add ' }} Combo <ArrowPathIcon v-if="isLoading" class="w-6 mx-3" />
          </button>
        </Form>
      </div>
      <div class="ml-3 w-full">
        <div v-if="isItemLoading || isGetting" class="no-data">
          <ArrowPathIcon class="w-6 mx-3" /> Loading...
        </div>
        <div v-else-if="items?.length == 0" class="no-data">
          <NoSymbolIcon class="w-12 mx-3" /> No Item Available
          <RouterLink to="/item/add-item" class="route-link ml-2"> Add items</RouterLink>
        </div>
        <div v-else class="flex flex-wrap items-start justify-start overflow-y-auto h-full">
          <div
            v-for="i in items"
            :key="i"
            class="p-2 shadow-2xl rounded-xl w-56 m-2 cursor-pointer"
            style="background: rgb(255, 255, 255, 0.8)"
            :class="{ 'active-item relative': selectedItem.find((e) => e?._id == i?._id) }"
            @click="addItem(i)"
          >
            <XMarkIcon v-if="selectedItem.find((e) => e?._id == i?._id)" class="remove-image" />
            <div class="h-40">
              <img v-if="i.image" :src="i.image" alt="Item Image" class="uploaded-image" />
              <img
                v-else
                src="@/assets/img/default-item.jpg"
                alt="Item Image"
                class="uploaded-image"
              />
            </div>
            <div class="p-2 font-bold">
              <p class="text-orange-600 text-lg">{{ i.title }}</p>
              <p class="text-blue-700 text-sm">₹ {{ i.price }} /-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  background-image: url('@/assets/img/add-combo-bg.jpg');
}
.active-item {
  background: rgb(255 176 176) !important;
}
</style>
