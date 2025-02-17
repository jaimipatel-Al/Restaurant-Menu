import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'DashBoard',
      component: () => import('../views/DashBoard.vue'),
    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LogIn.vue'),
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/SignUp.vue'),
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
  ],
})

export default router
