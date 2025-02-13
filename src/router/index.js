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
  ],
})

export default router
