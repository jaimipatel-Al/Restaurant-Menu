<script setup>
import { ArrowPathIcon, NoSymbolIcon, PlusIcon, MinusIcon } from '@heroicons/vue/24/solid'
import { computed, onMounted, ref } from 'vue'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import { useRoute } from 'vue-router'
import toast from '@/plugin/toast'
import { useCartStore } from '@/stores/cartStore'

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
  <section class="bg-screen">
    <div v-if="isMenuLoading || isItemLoading" class="no-data">
      <ArrowPathIcon class="w-12 mx-3" /> Loading...
    </div>
    <div v-else-if="menus?.length == 0 && items?.length == 0" class="no-data">
      <NoSymbolIcon class="w-12 mx-3" /> No Restaurants Available
    </div>
    <div v-else>
      <div v-if="todaySpecial">
        <h2 class="auth-title shadow-2xl text-center p-10 my-10 bg-white">
          Today's Special Food Combos
        </h2>
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
                <h3 class="text-3xl">
                  {{ todaySpecial.name }}
                </h3>
                <p class="text-blue-700 text-lg" style="text-wrap: nowrap">
                  ₹ {{ todaySpecial.price }} /-
                </p>
                <p class="text-sm text-green-700">
                  Quantity : {{ todaySpecial.subCategories?.length }}
                </p>
              </div>
              <div>
                <button
                  :disabled="todaySpecial.isCartLoading"
                  v-if="!cart.find((e) => e.menuId?._id == todaySpecial._id)"
                  class="button text-lg flex py-1.5 block px-5"
                  @click="addMenuToCart(todaySpecial, true)"
                >
                  <ArrowPathIcon v-if="todaySpecial.isCartLoading" class="w-6 mr-1" /> Add To Cart
                </button>
                <div v-else class="flex items-center space-x-3">
                  <button
                    :disabled="todaySpecial.isCartLoading"
                    class="button p-2"
                    @click="removeMenuFromCart(todaySpecial, true)"
                  >
                    <MinusIcon class="w-6" />
                  </button>
                  <ArrowPathIcon v-if="todaySpecial.isCartLoading" class="w-6 text-orange-700" />
                  <span v-else class="font-semibold text-lg p-1.5">
                    {{ cart.find((e) => e.menuId?._id == todaySpecial._id)?.quantity ?? 0 }}
                  </span>
                  <button
                    :disabled="todaySpecial.isCartLoading"
                    class="button p-2"
                    @click="addMenuToCart(todaySpecial, true)"
                  >
                    <PlusIcon class="w-6" />
                  </button>
                </div>
              </div>
            </div>
            <div class="flex justify-start overflow-x-auto w-full">
              <div
                v-for="i in todaySpecial.subCategories"
                :key="i"
                class="p-2 shadow-2xl rounded-xl w-48 flex-none m-2 cursor-pointer"
                style="background: rgb(255, 255, 255, 0.8)"
                @click="addItem(i)"
              >
                <div class="h-36">
                  <img v-if="i.image" :src="i.image" alt="Item Image" class="uploaded-image" />
                  <img
                    v-else
                    src="@/assets/img/default-item.jpg"
                    alt="Item Image"
                    class="uploaded-image"
                  />
                </div>
                <div class="p-1 font-bold flex-between">
                  <p class="text-orange-600 text-lg">{{ i.title }}</p>
                  <p class="text-blue-700 text-sm" style="text-wrap: nowrap">₹ {{ i.price }} /-</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 v-if="menus?.length" class="auth-title shadow-2xl text-center p-10 my-10 bg-white">
        Food Combos
      </h2>
      <div class="flex items-start justify-start overflow-x-auto w-full p-5 pb-0">
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
            <h3 class="text-xl font-bold flex justify-between">
              {{ m.name }}
              <span class="text-blue-700 text-lg" style="text-wrap: nowrap"
                >₹ {{ m.price }} /-</span
              >
            </h3>
            <span class="text-sm text-green-700">Quantity : {{ m.subCategories?.length }}</span>

            <button
              :disabled="m.isCartLoading"
              v-if="!cart.find((e) => e.menuId?._id == m._id)"
              class="button text-lg flex mt-2 py-1.5 block px-5"
              @click="addMenuToCart(m)"
            >
              <ArrowPathIcon v-if="m.isCartLoading" class="w-6 mr-1" /> Add To Cart
            </button>
            <div v-else class="flex items-center space-x-3">
              <button :disabled="m.isCartLoading" class="button p-2" @click="removeMenuFromCart(m)">
                <MinusIcon class="w-6" />
              </button>
              <ArrowPathIcon v-if="m.isCartLoading" class="w-6 text-orange-700" />
              <span v-else class="font-semibold text-lg p-1.5">
                {{ cart.find((e) => e.menuId?._id == m._id)?.quantity ?? 0 }}
              </span>
              <button :disabled="m.isCartLoading" class="button p-2" @click="addMenuToCart(m)">
                <PlusIcon class="w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <h2 v-if="items?.length" class="auth-title shadow-2xl text-center p-10 my-10 bg-white">
        Food Items
      </h2>
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
                <span class="text-blue-700 text-lg" style="text-wrap: nowrap"
                  >₹ {{ i.price }} /-</span
                >
              </h3>
              <p class="flex justify-between">
                <span class="text-sm text-green-700">Quantity : {{ i.quantity }}</span>
                <span class="text-sm text-orange-700">{{ i.categoryId?.title }}</span>
              </p>

              <button
                :disabled="i.isCartLoading"
                v-if="!cart.find((e) => e?.itemId?._id == i._id)"
                class="button text-lg flex mt-2 py-1.5 block px-5"
                @click="addItemToCart(i)"
              >
                <ArrowPathIcon v-if="i.isCartLoading" class="w-6 mr-1" /> Add To Cart
              </button>
              <div v-else class="flex items-center space-x-3">
                <button
                  :disabled="i.isCartLoading"
                  class="button p-2"
                  @click="removeItemFromCart(i)"
                >
                  <MinusIcon class="w-6" />
                </button>
                <ArrowPathIcon v-if="i.isCartLoading" class="w-6 text-orange-700" />
                <span v-else class="font-semibold text-lg p-1.5">
                  {{ cart.find((e) => e.itemId?._id == i._id)?.quantity ?? 0 }}
                </span>
                <button :disabled="i.isCartLoading" class="button p-2" @click="addItemToCart(i)">
                  <PlusIcon class="w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  /* background-image: url('@/assets/img/restaurant-menu.jpg'); */
}
</style>
