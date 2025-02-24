<script setup>
import { ArrowPathIcon, ArrowUpTrayIcon, XMarkIcon, NoSymbolIcon } from '@heroicons/vue/24/solid'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import ComboItems from '@/components/elements/ComboItems.vue'

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
const scrollComponent = ref()
const page = ref(0)
const totalItems = ref()

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
  if (items.value?.length == totalItems.value) return

  page.value++
  isItemLoading.value = true

  await Axios.get(`${api.listItem}?page=${page.value}&limit=16`)
    .then(({ data }) => {
      const res = data.data
      totalItems.value = res.totalSubcategories
      const arr = res.subcategories ?? []
      items.value = [...items.value, ...arr]
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

  let formData = new FormData()
  formData.append('name', title.value)
  formData.append('price', price.value)
  formData.append('isTodayMenu', isTodayMenu.value)
  if (image.value) formData.append('image', image.value)
  selectedItem.value.forEach((e, i) => formData.append(`subCategories[${i}]`, e._id))

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

  let formData = new FormData()
  formData.append('name', title.value)
  formData.append('price', price.value)
  formData.append('isTodayMenu', isTodayMenu.value)
  formData.append('isActive', isActive.value)
  if (image.value || (!imageUrl.value && !image.value)) formData.append('image', image.value)
  selectedItem.value.forEach((e, i) => formData.append(`subCategories[${i}]`, e._id))

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

const handleScroll = () => {
  const el = scrollComponent.value
  if (!el) return
  if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50 && !isItemLoading.value) getItems()
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
  scrollComponent.value.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <section class="bg-screen flex items-center justify-end add-edit-form">
    <div
      class="w-full h-5/6 shadow-2xl mx-4 sm:mx-6 md:mx-6 lg:mx-10 py-3 sm:py-4 md:py-5 px-4 sm:px-8 md:px-10 flex flex-col sm:flex-row"
      style="background: rgb(250, 200, 200, 0.25); min-width: 300px"
    >
      <div class="w-full sm:w-96 flex-none">
        <h1 class="main-title">{{ id ? 'Update ' : 'Add ' }} Combo</h1>
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
          <p v-if="selectedItem?.length && !isGetting" class="quantity-cls font-semibold">
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
          <label
            v-if="!isGetting && id"
            for="active"
            class="flex items-center text-sm sm:text-base space-x-3 mb-5"
          >
            <input v-model="isActive" type="checkbox" id="active" class="w-4 h-4 cursor-pointer" />
            Available
          </label>

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

          <button type="submit" :disabled="isLoading || isGetting || items?.length == 0">
            {{ id ? 'Edit ' : 'Add ' }} Combo
            <ArrowPathIcon v-if="isLoading" class="loading-btn" />
          </button>
        </Form>
      </div>
      <div class="sm:ml-2 md:ml-3 w-full">
        <div
          ref="scrollComponent"
          class="flex flex-nowrap sm:flex-wrap items-start justify-start overflow-x-auto sm:overflow-y-auto h-full"
        >
          <div v-if="items?.length == 0 && !isItemLoading && !isGetting" class="no-data">
            <NoSymbolIcon class="no-data-icon" /> No Item Available
            <RouterLink to="/item/add-item" class="route-link ml-2"> Add items</RouterLink>
          </div>
          <ComboItems
            v-else-if="!isGetting"
            v-for="i in items"
            :key="i"
            :item="i"
            @addItem="addItem(i)"
            :isRemove="selectedItem.find((e) => e?._id == i?._id)"
            :class="{ 'active-item relative': selectedItem.find((e) => e?._id == i?._id) }"
          />
          <div v-if="isItemLoading || isGetting" class="no-data">
            <ArrowPathIcon class="loading-btn" /> Loading...
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
