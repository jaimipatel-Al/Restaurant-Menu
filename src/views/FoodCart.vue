<script setup>
import { ArrowPathIcon, NoSymbolIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { onMounted, ref } from 'vue'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import { useCartStore } from '@/stores/cartStore'
import toast from '@/plugin/toast'
import AddToCart from '@/components/elements/AddToCart.vue'

const cart = ref([])
const isLoading = ref(false)
const cartStore = useCartStore()
const totalAmount = ref(0)

const getCart = async () => {
  isLoading.value = true
  await Axios.get(api.getCart)
    .then(({ data }) => {
      let res = data.data
      cart.value = res.items?.map((e) => {
        return { ...e, isCartLoading: false }
      })
      totalAmount.value = res.totalAmount
    })
    .catch((er) => {
      console.error(er?.response?.data?.message)
    })
    .finally(() => {
      isLoading.value = false
    })
}
const removeAll = async () => {
  cart.value = []
  cartStore.setCartValue(0)
  await Axios.delete(api.deleteCart)
    .then(() => {})
    .catch((er) => {
      console.error(er?.response?.data?.message)
    })
}
const addMenuToCart = async (val) => {
  val.isCartLoading = true
  let payload = {
    menuId: val.menuId._id,
    menuQuantity: 1,
  }
  await addToCart(payload, 'Menu')
}
const addItemToCart = async (val) => {
  val.isCartLoading = true
  let payload = {
    itemId: val.itemId._id,
    itemQuantity: 1,
  }
  await addToCart(payload, 'Combo')
}
const addToCart = async (payload) => {
  await Axios.post(api.addCart, payload)
    .then(({ data }) => {
      let res = data.data
      cartStore.setCartValue(res.itemsCount)
      cart.value = res.cart?.items?.map((e) => {
        return { ...e, isCartLoading: false }
      })
      totalAmount.value = res.cart?.totalAmount
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
}
const removeMenuFromCart = async (val) => {
  val.isCartLoading = true
  let payload = {
    menuId: val.menuId._id,
  }
  await removeFromCart(payload, 'Menu')
}
const removeItemFromCart = async (val) => {
  val.isCartLoading = true
  let payload = {
    itemId: val.itemId._id,
  }
  await removeFromCart(payload, 'Combo')
}
const removeFromCart = async (payload) => {
  await Axios.delete(api.removeCart, { data: payload })
    .then(({ data }) => {
      let res = data.data
      cartStore.setCartValue(res?.itemsCount ?? 0)
      cart.value =
        res?.updatedCart?.items?.map((e) => {
          return { ...e, isCartLoading: false }
        }) ?? []
      totalAmount.value = res?.updatedCart?.totalAmount ?? 0
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message)
    })
}

onMounted(() => {
  getCart()
})
</script>

<template>
  <section class="bg-screen">
    <div class="main-header-nav">
      <h1 class="main-title">Cart</h1>
      <button v-if="!isLoading && cart?.length" class="add-btn" @click="removeAll()">
        <TrashIcon /> Remove All From Cart
      </button>
    </div>
    <div v-if="isLoading" class="no-data"><ArrowPathIcon class="no-data-icon" /> Loading...</div>
    <div v-else-if="cart?.length == 0" class="no-data">
      <NoSymbolIcon class="no-data-icon" /> No Item Available In Cart
      <RouterLink to="/restaurant" class="route-link ml-2"> Add items</RouterLink>
    </div>
    <div v-else class="h-5/6 overflow-y-auto">
      <table class="m-auto rounded-xl" style="background: rgb(255, 255, 255, 0.8)">
        <tr class="text-xl font-bold border-b-2 border-gray-600">
          <td>Item</td>
          <td>Price</td>
          <td>Quantity</td>
          <td>Total</td>
        </tr>
        <tr v-for="i in [...cart]" :key="i">
          <td class="flex space-x-3 items-center">
            <div class="h-24 w-24">
              <img
                v-if="i.menuId?.image || i.itemId.image"
                :src="i.menuId?.image || i.itemId.image"
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
            <div>
              <h3 class="text-xl font-semibold">{{ i.menuId?.name || i.itemId?.title }}</h3>
              <p class="text-sm font-semibold text-green-600">
                Quantity : {{ i.menuId?.subCategories?.length || i.itemId?.quantity }}
              </p>
            </div>
          </td>
          <td class="text-gray-700 text-lg font-bold no-wrap">₹ {{ i.price }} /-</td>
          <td>
            <AddToCart
              :value="i.quantity"
              :isLoading="i.isCartLoading"
              @removeItem="i.menuId ? removeMenuFromCart(i) : removeItemFromCart(i)"
              @addItem="i.menuId ? addMenuToCart(i) : addItemToCart(i)"
            />
          </td>
          <td class="price">₹ {{ i.price * i.quantity }} /-</td>
        </tr>
        <tr class="text-xl font-bold border-t-2 border-gray-600">
          <td colspan="3" class="text-end">Total Amount</td>
          <td class="price">₹ {{ totalAmount }} /-</td>
        </tr>
      </table>
    </div>
  </section>
</template>

<style scoped>
section {
  background-image: url('@/assets/img/cart-bg.jpg');
}

table td {
  padding: 15px 30px;
}
</style>
