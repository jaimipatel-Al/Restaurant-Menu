import { defineStore } from 'pinia'
import { ref } from 'vue'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'

export const useCartStore = defineStore('cart', () => {
  const cart = ref(0)

  const getCartValue = async () => {
    await Axios.get(api.getCart)
      .then(({ data }) => {
        let res = data.data
        cart.value = res.items?.length ?? 0
      })
      .catch((er) => {
        console.error(er?.response?.data?.message)
      })
  }

  const setCartValue = (val) => {
    cart.value = val
  }

  return {
    cart,
    getCartValue,
    setCartValue,
  }
})
