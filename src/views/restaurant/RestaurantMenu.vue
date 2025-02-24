<script setup>
import { ArrowPathIcon, NoSymbolIcon } from '@heroicons/vue/24/solid'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import { useRoute } from 'vue-router'
import toast from '@/plugin/toast'
import { useCartStore } from '@/stores/cartStore'
import AddToCart from '@/components/elements/AddToCart.vue'
import ComboItems from '@/components/elements/ComboItems.vue'

const route = useRoute()
const cartStore = useCartStore()

const id = computed(() => route?.params?.id)

const isMenuLoading = ref(false)
const menus = ref([])
const scrollMenuComponent = ref()
const menuPage = ref(0)
const totalMenuItems = ref()

const isItemLoading = ref(false)
const items = ref([])
const itemPage = ref(0)
const totalItems = ref()

const todaySpecial = ref(null)
const cart = ref([])

const getCustomerMenu = async () => {
  if (menus.value?.length == totalMenuItems.value) return

  menuPage.value++
  isMenuLoading.value = true

  await Axios.get(`${api.customerMenu}${id.value}?page=${menuPage.value}&limit=8`)
    .then(({ data }) => {
      const res = data.data
      totalMenuItems.value = res.total
      if (menuPage.value == 1)
        todaySpecial.value = res?.todaySpecial
          ? { ...data.data.todaySpecial, isCartLoading: false }
          : null

      const arr = res.menus.map((e) => {
        return { ...e, isCartLoading: false }
      })
      menus.value = [...menus.value, ...arr]
    })
    .catch((er) => {
      console.error(er?.response?.data?.message)
    })
    .finally(() => {
      isMenuLoading.value = false
    })
}
const getCustomerItems = async () => {
  if (items.value?.length == totalItems.value) return

  itemPage.value++
  isItemLoading.value = true

  await Axios.get(`${api.customerItems}${id.value}?page=${itemPage.value}&limit=10`)
    .then(({ data }) => {
      const res = data.data
      totalItems.value = res.total
      const arr = res.items.map((e) => {
        return { ...e, isCartLoading: false }
      })
      items.value = [...items.value, ...arr]
    })
    .catch((er) => {
      console.error(er?.response?.data?.message)
    })
    .finally(() => {
      isItemLoading.value = false
    })
}
const getCart = async () => {
  await Axios.get(api.getCart)
    .then(({ data }) => {
      let res = data.data
      cart.value = res.items
    })
    .catch((er) => {
      console.error(er?.response?.data?.message)
    })
}
const addMenuToCart = async (val, isSpecial = false) => {
  if (isSpecial) todaySpecial.value.isCartLoading = true
  else val.isCartLoading = true

  let payload = {
    menuId: val._id,
    menuQuantity: 1,
  }
  await addToCart(payload, 'Menu')

  if (isSpecial) todaySpecial.value.isCartLoading = false
  else val.isCartLoading = false
}
const addItemToCart = async (val) => {
  val.isCartLoading = true

  let payload = {
    itemId: val._id,
    itemQuantity: 1,
  }
  await addToCart(payload, 'Combo')

  val.isCartLoading = false
}
const addToCart = async (payload) => {
  await Axios.post(api.addCart, payload)
    .then(({ data }) => {
      let res = data.data
      cartStore.setCartValue(res.itemsCount)
      cart.value = res.cart?.items
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
}
const removeMenuFromCart = async (val, isSpecial = false) => {
  if (isSpecial) todaySpecial.value.isCartLoading = true
  else val.isCartLoading = true

  let payload = {
    menuId: val._id,
  }
  await removeFromCart(payload, 'Menu')

  if (isSpecial) todaySpecial.value.isCartLoading = false
  else val.isCartLoading = false
}
const removeItemFromCart = async (val) => {
  val.isCartLoading = true

  let payload = {
    itemId: val._id,
  }
  await removeFromCart(payload, 'Combo')

  val.isCartLoading = false
}
const removeFromCart = async (payload) => {
  await Axios.delete(api.removeCart, { data: payload })
    .then(({ data }) => {
      let res = data?.data ?? {}
      cartStore.setCartValue(res?.itemsCount ?? 0)
      cart.value = res?.updatedCart?.items ?? []
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
}

const handleMenuScroll = () => {
  const el = scrollMenuComponent.value
  if (!el) return
  if (el.scrollWidth - el.scrollLeft <= el.clientWidth + 50 && !isMenuLoading.value)
    getCustomerMenu()
}
const handleWindowScroll = () => {
  if (isItemLoading.value) return
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50)
    getCustomerItems()
}

onMounted(() => {
  getCustomerMenu()
  getCustomerItems()
  getCart()

  scrollMenuComponent.value.addEventListener('scroll', handleMenuScroll)
  window.addEventListener('scroll', handleWindowScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleWindowScroll)
})
</script>

<template>
  <section>
    <div class="px-8 py-5 text-center">
      <h1 class="main-title">Restaurant Menu</h1>
    </div>
    <div
      v-if="menus?.length == 0 && items?.length == 0 && !isItemLoading && !isMenuLoading"
      class="no-data"
    >
      <NoSymbolIcon class="no-data-icon" /> No Menu Available For This Restaurants
    </div>
    <div v-if="isMenuLoading" class="no-data">
      <ArrowPathIcon class="no-data-icon" /> Loading...
    </div>
    <div>
      <div v-if="todaySpecial">
        <h2 class="main-heading">Today's Special Food Combos</h2>
        <div
          class="pa-10 my-4 md:my-8 lg:my-10 w-full flex-between flex-col md:flex-row cursor-pointer md:space-x-10"
        >
          <div class="h-52 sm:h-72 md:h-96 w-full md:w-1/3">
            <img
              v-if="
                todaySpecial.image &&
                todaySpecial.image != 'null' &&
                todaySpecial.image != 'undefined'
              "
              :src="todaySpecial.image"
              alt="Item Image"
              class="uploaded-image"
            />
            <img
              v-else
              src="@/assets/img/default-item.jpg"
              alt="Item Image"
              class="uploaded-image"
            />
          </div>
          <div class="w-full md:w-2/3">
            <div class="p-1 sm:p-2 md:p-3 flex-between">
              <div>
                <h3 class="sub-heading">
                  {{ todaySpecial.name }}
                </h3>
                <p class="price">₹ {{ todaySpecial.price }} /-</p>
                <p class="quantity-cls">Quantity : {{ todaySpecial.subCategories?.length }}</p>
              </div>
              <div>
                <button
                  :disabled="todaySpecial.isCartLoading"
                  v-if="!cart.find((e) => e.menuId?._id == todaySpecial._id)"
                  class="add-btn"
                  @click="addMenuToCart(todaySpecial, true)"
                >
                  <ArrowPathIcon v-if="todaySpecial.isCartLoading" /> Add To Cart
                </button>
                <AddToCart
                  v-else
                  :value="cart.find((e) => e.menuId?._id == todaySpecial._id)?.quantity ?? 0"
                  :isLoading="todaySpecial.isCartLoading"
                  @removeItem="removeMenuFromCart(todaySpecial, true)"
                  @addItem="addMenuToCart(todaySpecial, true)"
                />
              </div>
            </div>
            <div class="flex justify-start overflow-x-auto w-full">
              <ComboItems v-for="i in todaySpecial.subCategories" :key="i" :item="i" />
            </div>
          </div>
        </div>
      </div>
      <h2 v-if="menus?.length" class="main-heading">Food Combos</h2>
      <div
        ref="scrollMenuComponent"
        class="flex items-center justify-start overflow-x-auto w-full p-2 sm:p-3 md:p-5"
      >
        <div
          v-for="m in menus"
          :key="m"
          class="p-1 md:p-2 shadow-2xl rounded-xl flex-none cursor-pointer my-1 md:my-2 mx-2 md:mx-4 w-64 sm:w-72 md:w-80 lg:w-96"
          style="background: rgb(255, 255, 255, 0.8)"
        >
          <div class="h-52 sm:h-56 md:h-64 lg:h-72">
            <img
              v-if="m.image && m.image != 'null' && m.image != 'undefined'"
              :src="m.image"
              alt="Item Image"
              class="uploaded-image"
            />
            <img
              v-else
              src="@/assets/img/default-item.jpg"
              alt="Item Image"
              class="uploaded-image"
            />
          </div>
          <div class="p-1 sm:p-2 md:p-3">
            <h3 class="sub-title flex justify-between">
              {{ m.name }}
              <span class="price">₹ {{ m.price }} /-</span>
            </h3>
            <p class="quantity-cls mb-1 md:mb-2">Quantity : {{ m.subCategories?.length }}</p>

            <button
              :disabled="m.isCartLoading"
              v-if="!cart.find((e) => e.menuId?._id == m._id)"
              class="add-btn"
              @click="addMenuToCart(m)"
            >
              <ArrowPathIcon v-if="m.isCartLoading" /> Add To Cart
            </button>
            <AddToCart
              v-else
              :value="cart.find((e) => e.menuId?._id == m._id)?.quantity ?? 0"
              :isLoading="m.isCartLoading"
              @removeItem="removeMenuFromCart(m)"
              @addItem="addMenuToCart(m)"
            />
          </div>
        </div>
        <div v-if="menus?.length && isMenuLoading" class="no-data">
          <ArrowPathIcon class="no-data-icon" /> Loading...
        </div>
      </div>
      <h2 v-if="items?.length" class="main-heading">Food Items</h2>
      <div class="flex justify-evenly items-start flex-wrap my-2 md:my-6 lg:my-10">
        <div class="flex items-center justify-evenly flex-wrap">
          <div
            v-for="i in items"
            :key="i._id"
            class="p-1 md:p-2 shadow-2xl rounded-xl w-40 sm:w-56 md:w-64 lg:w-72 my-2 md:my-4 mx-1 md:mx-2"
            style="background: rgb(255, 255, 255, 0.8)"
          >
            <div class="h-36 sm:h-40 md:h-56 lg:h-64">
              <img
                v-if="i.image && i.image != 'null' && i.image != 'undefined'"
                :src="i.image"
                alt="Item Image"
                class="uploaded-image"
              />
              <img
                v-else
                src="@/assets/img/default-item.jpg"
                alt="Item Image"
                class="uploaded-image"
              />
            </div>
            <div class="p-1 sm:p-2 md:p-3">
              <h3 class="text-sm sm:text-base md:text-lg lg:text-xl font-bold flex justify-between">
                {{ i.title }}
                <span class="price">₹ {{ i.price }} /-</span>
              </h3>
              <p class="flex justify-between mb-1 md:mb-2">
                <span class="quantity-cls">Quantity : {{ i.quantity }}</span>
                <span class="text-xs md:text-sm text-orange-700">{{ i.categoryId?.title }}</span>
              </p>

              <button
                :disabled="i.isCartLoading"
                v-if="!cart.find((e) => e?.itemId?._id == i._id)"
                class="add-btn"
                @click="addItemToCart(i)"
              >
                <ArrowPathIcon v-if="i.isCartLoading" /> Add To Cart
              </button>
              <AddToCart
                v-else
                :value="cart.find((e) => e.itemId?._id == i._id)?.quantity ?? 0"
                :isLoading="i.isCartLoading"
                @removeItem="removeItemFromCart(i)"
                @addItem="addItemToCart(i)"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="items?.length && isItemLoading" class="no-data">
        <ArrowPathIcon class="no-data-icon" /> Loading...
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  background-image: url('@/assets/img/restaurant-menu.jpg');
  min-height: 100vh;
}
</style>
