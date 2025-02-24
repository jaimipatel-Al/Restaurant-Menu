<script setup>
import { ArrowPathIcon, NoSymbolIcon } from '@heroicons/vue/24/solid'
import { computed, onMounted, ref } from 'vue'
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
const isItemLoading = ref(false)
const menus = ref([])
const items = ref([])
const todaySpecial = ref(null)
const cart = ref([])

const getCustomerMenu = async () => {
  isMenuLoading.value = true

  await Axios.get(`${api.customerMenu}${id.value}?page=1&limit=100`)
    .then(({ data }) => {
      menus.value = data?.data?.menus?.map((e) => {
        return { ...e, isCartLoading: false }
      })
      todaySpecial.value = data?.data?.todaySpecial
        ? { ...data.data.todaySpecial, isCartLoading: false }
        : null
    })
    .catch((er) => {
      console.error(er?.response?.data?.message)
    })
    .finally(() => {
      isMenuLoading.value = false
    })
}
const getCustomerItems = async () => {
  isItemLoading.value = true

  await Axios.get(`${api.customerItems}${id.value}?page=1&limit=100`)
    .then(({ data }) => {
      items.value = data?.data?.items?.map((e) => {
        return { ...e, isCartLoading: false }
      })
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

onMounted(() => {
  getCustomerMenu()
  getCustomerItems()
  getCart()
})
</script>

<template>
  <section>
    <div class="px-8 py-5 text-center">
      <h1 class="main-title">Restaurant Menu</h1>
    </div>
    <div v-if="isMenuLoading || isItemLoading" class="no-data">
      <ArrowPathIcon class="no-data-icon" /> Loading...
    </div>
    <div v-else-if="menus?.length == 0 && items?.length == 0" class="no-data">
      <NoSymbolIcon class="no-data-icon" /> No Menu Available For This Restaurants
    </div>
    <div v-else>
      <div v-if="todaySpecial">
        <h2 class="main-heading">Today's Special Food Combos</h2>
        <div class="p-10 my-10 w-full flex-between flex-col md:flex-row cursor-pointer space-x-10">
          <div class="h-96 w-1/3">
            <img
              v-if="todaySpecial.image"
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
          <div class="w-2/3">
            <div class="p-3 font-bold text-xl flex-between">
              <div>
                <h3 class="sub-heading">
                  {{ todaySpecial.name }}
                </h3>
                <p class="price">₹ {{ todaySpecial.price }} /-</p>
                <p class="text-sm text-green-700">
                  Quantity : {{ todaySpecial.subCategories?.length }}
                </p>
              </div>
              <div>
                <button
                  :disabled="todaySpecial.isCartLoading"
                  v-if="!cart.find((e) => e.menuId?._id == todaySpecial._id)"
                  class="add-btn"
                  @click="addMenuToCart(todaySpecial, true)"
                >
                  <ArrowPathIcon v-if="todaySpecial.isCartLoading" class="w-6 mr-1" /> Add To Cart
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
      <div class="flex items-start justify-start overflow-x-auto w-full p-5">
        <div
          v-for="m in menus"
          :key="m"
          class="p-2 shadow-2xl rounded-xl w-96 flex-none my-2 mx-4 cursor-pointer"
          style="background: rgb(255, 255, 255, 0.8)"
        >
          <div class="h-72">
            <img v-if="m.image" :src="m.image" alt="Item Image" class="uploaded-image" />
            <img
              v-else
              src="@/assets/img/default-item.jpg"
              alt="Item Image"
              class="uploaded-image"
            />
          </div>
          <div class="p-3">
            <h3 class="sub-title flex justify-between">
              {{ m.name }}
              <span class="price">₹ {{ m.price }} /-</span>
            </h3>
            <p class="text-sm text-green-700 mb-2">Quantity : {{ m.subCategories?.length }}</p>

            <button
              :disabled="m.isCartLoading"
              v-if="!cart.find((e) => e.menuId?._id == m._id)"
              class="add-btn"
              @click="addMenuToCart(m)"
            >
              <ArrowPathIcon v-if="m.isCartLoading" class="w-6 mr-1" /> Add To Cart
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
      </div>
      <h2 v-if="items?.length" class="main-heading">Food Items</h2>
      <div class="h-5/6 overflow-y-auto flex justify-evenly items-start flex-wrap my-10">
        <div class="flex items-center justify-evenly flex-wrap">
          <div
            v-for="i in items"
            :key="i._id"
            class="p-2 shadow-2xl rounded-xl w-72 my-4 mx-2"
            style="background: rgb(255, 255, 255, 0.8)"
          >
            <div class="h-64">
              <img v-if="i.image" :src="i.image" alt="Item Image" class="uploaded-image" />
              <img
                v-else
                src="@/assets/img/default-item.jpg"
                alt="Item Image"
                class="uploaded-image"
              />
            </div>
            <div class="p-3">
              <h3 class="text-xl font-bold flex justify-between">
                {{ i.title }}
                <span class="price">₹ {{ i.price }} /-</span>
              </h3>
              <p class="flex justify-between mb-2">
                <span class="text-sm text-green-700">Quantity : {{ i.quantity }}</span>
                <span class="text-sm text-orange-700">{{ i.categoryId?.title }}</span>
              </p>

              <button
                :disabled="i.isCartLoading"
                v-if="!cart.find((e) => e?.itemId?._id == i._id)"
                class="add-btn"
                @click="addItemToCart(i)"
              >
                <ArrowPathIcon v-if="i.isCartLoading" class="w-6 mr-1" /> Add To Cart
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
    </div>
  </section>
</template>

<style scoped>
section {
  background-image: url('@/assets/img/restaurant-menu.jpg');
  min-height: 100vh;
}
</style>
