import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'DashBoard',
      component: () => import('../views/DashBoard.vue'),
      meta: { auth: false },
    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LogIn.vue'),
      meta: { auth: false },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/SignUp.vue'),
      meta: { auth: false },
    },

    {
      path: '/item',
      name: 'Item',
      component: () => import('../views/item/ItemList.vue'),
    },
    {
      path: '/item/add-item',
      name: 'AddItem',
      component: () => import('../views/item/AddEditItem.vue'),
    },
    {
      path: '/item/edit-item/:id',
      name: 'EditItem',
      component: () => import('../views/item/AddEditItem.vue'),
    },

    {
      path: '/category',
      name: 'Category',
      component: () => import('../views/category/CategoryList.vue'),
    },
    {
      path: '/category/add-category',
      name: 'AddCategory',
      component: () => import('../views/category/AddEditCategory.vue'),
    },
    {
      path: '/category/edit-category/:id',
      name: 'EditCategory',
      component: () => import('../views/category/AddEditCategory.vue'),
    },

    {
      path: '/combo',
      name: 'Combo',
      component: () => import('../views/combo/ComboList.vue'),
    },
    {
      path: '/combo/add-combo',
      name: 'AddCombo',
      component: () => import('../views/combo/AddEditCombo.vue'),
    },
    {
      path: '/combo/edit-combo/:id',
      name: 'EditCombo',
      component: () => import('../views/combo/AddEditCombo.vue'),
    },

    {
      path: '/restaurant',
      name: 'Restaurant',
      component: () => import('../views/restaurant/RestaurantList.vue'),
    },
    {
      path: '/restaurant/:id',
      name: 'menu',
      component: () => import('../views/restaurant/RestaurantMenu.vue'),
    },

    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../views/FoodCart.vue'),
    },
  ],
})

const currentUser = () => {
  return new Promise((resolve) => {
    const authStore = useAuthStore()
    const token = authStore.userData?.token ?? ''
    resolve(token)
  })
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record?.meta?.auth ?? false)) {
    if (await currentUser()) next()
    else next('/login')
  } else next()
})

export default router
