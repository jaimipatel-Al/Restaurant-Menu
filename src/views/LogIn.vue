<script setup>
import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'
import { Form, Field } from 'vee-validate'
import { onMounted, ref } from 'vue'
import * as yup from 'yup'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const schema = yup.object({
  Email: yup.string().required().email(),
  Password: yup
    .string()
    .required()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
})

const email = ref('')
const password = ref('')
const isPassword = ref(false)
const isRemember = ref(false)
const isLogin = ref(false)

const login = async () => {
  isLogin.value = true

  const user = {
    email: email.value,
    password: password.value,
  }

  await Axios.post(api.login, user)
    .then(({ data }) => {
      if (isRemember.value)
        authStore.sessionStore({
          password: user.password,
          email: user.email,
        })
      else authStore.sessionRemove()

      authStore.loginUser(data.data)
      toast.success(data?.message ?? 'User Login Success!')
      router.push('/')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "User Can't Login!")
    })
    .finally(() => {
      isLogin.value = false
    })
}

onMounted(() => {
  const authUser = sessionStorage.getItem('authUser')

  if (authUser) {
    const user = JSON.parse(authUser)
    email.value = user.email
    password.value = user.password
    isRemember.value = true
  }
})
</script>

<template>
  <main class="auth flex items-center">
    <div class="auth-box" style="height: 600px">
      <div class="flex-1 p-10">
        <h1 class="auth-title">Login</h1>
        <p class="auth-detail">
          Doesn't have an account yet?
          <RouterLink to="/signup" class="route-link">Sign Up</RouterLink>
        </p>
        <Form @submit="login" :validation-schema="schema" v-slot="{ errors }">
          <label for="email">Email Address</label>
          <Field
            v-model="email"
            type="email"
            name="Email"
            id="email"
            class="input"
            placeholder="Enter Your Email Address"
          />
          <p class="error-message">{{ errors?.Email }}</p>
          <label for="password">Password</label>
          <div class="input bg-white flex-between">
            <Field
              v-model="password"
              :type="isPassword ? 'text' : 'password'"
              name="Password"
              id="password"
              class="text-gray-900 placeholder:text-gray-400 focus:outline-none w-full"
              placeholder="Enter Your Password"
            />
            <div class="pl-2" @click="isPassword = !isPassword">
              <EyeSlashIcon v-if="isPassword" class="password-icon" />
              <EyeIcon v-else class="password-icon" />
            </div>
          </div>
          <p class="error-message">{{ errors?.Password }}</p>

          <label for="remember" class="flex items-center space-x-3 text-lg font-semibold">
            <input
              v-model="isRemember"
              type="checkbox"
              id="remember"
              class="w-4 h-4 cursor-pointer"
            />
            Remember Me
          </label>

          <button
            type="submit"
            class="button flex items-center justify-center w-full mt-10"
            :disabled="isLogin"
          >
            Login <ArrowPathIcon v-if="isLogin" class="w-6 mx-3" />
          </button>
        </Form>
      </div>
      <div class="auth-img-box">
        <img src="@/assets/img/login.jpg" alt="Login" class="full-image" />
      </div>
    </div>
  </main>
</template>
