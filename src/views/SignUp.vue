<script setup>
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
} from '@heroicons/vue/24/solid'
import { Form, Field } from 'vee-validate'
import { ref } from 'vue'
import * as yup from 'yup'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const schema = yup.object({
  Name: yup.string().required().max(50),
  Email: yup.string().required().email(),
  Password: yup
    .string()
    .required()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  ConfirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('Password'), ''], 'Passwords must match'),
})

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isPassword = ref(false)
const isConfirmPassword = ref(false)
const type = ref('customer')
const isSignup = ref(false)
const imageUrl = ref()
const image = ref()
const file = ref()

const signup = async () => {
  isSignup.value = true

  let formData = new FormData()
  formData.append('name', name.value)
  formData.append('email', email.value)
  formData.append('password', password.value)
  formData.append('userType', type.value)
  if (image.value) formData.append('image', image.value)

  await Axios.post(api.signUp, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then(({ data }) => {
      authStore.sessionStore({
        password: password.value,
        email: email.value,
      })

      toast.success(
        data?.message ?? `${type.value == 'customer' ? 'Customer ' : 'Owner '} Sign Up Success!`
      )
      router.push('/login')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "User Can't Sign Up!")
    })
    .finally(() => {
      isSignup.value = false
    })
}
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
</script>

<template>
  <main class="auth flex items-center">
    <div class="auth-box h-5/6">
      <div class="auth-img-box">
        <img src="@/assets/img/signup.jpg" alt="Sign Up" class="full-image" />
      </div>
      <div class="flex-1 pa-10">
        <Form @submit="signup()" :validation-schema="schema" v-slot="{ errors }">
          <div class="sm:flex justify-between items-end sm:space-x-5 md:space-x-10">
            <div class="flex-1">
              <h1 class="main-title">Sign Up</h1>
              <p class="auth-detail">
                Already have an account?
                <RouterLink to="/login" class="route-link">Login</RouterLink>
              </p>
              <label for="type">Register As</label>
              <select name="Type" id="type" v-model="type" class="input">
                <option value="owner">Owner</option>
                <option value="customer">Customer</option>
              </select>
            </div>
            <div class="flex-1 text-end">
              <label for="image" style="display: flex" class="items-center">
                Upload Image
                <ArrowUpTrayIcon
                  class="upload-button mx-2"
                  v-if="!imageUrl"
                  @click="file.click()"
                />
                <input type="file" accept="image/*" ref="file" hidden @change="handleFileUpload" />
              </label>
              <div
                v-if="imageUrl"
                class="relative mt-2 sm:mt-2 md:mt-4 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24"
              >
                <XMarkIcon class="remove-image" @click="removeImage()" />
                <img :src="imageUrl" alt="Uploaded Image" class="uploaded-img-box" />
              </div>
            </div>
          </div>

          <label for="name">{{ type == 'customer' ? 'User Name' : 'Restaurant Name' }}</label>
          <Field
            v-model="name"
            type="text"
            name="Name"
            id="name"
            class="input"
            :placeholder="`Enter Your ${type == 'customer' ? 'User' : 'Restaurant'} Name`"
          />
          <p class="error-message">{{ errors?.Name }}</p>

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
          <label for="confirmPassword">Confirm Password</label>
          <div class="input bg-white flex-between">
            <Field
              v-model="confirmPassword"
              :type="isConfirmPassword ? 'text' : 'password'"
              name="ConfirmPassword"
              id="confirmPassword"
              class="text-gray-900 placeholder:text-gray-400 focus:outline-none w-full"
              placeholder="Enter Your Confirm Password"
            />
            <div class="pl-2" @click="isConfirmPassword = !isConfirmPassword">
              <EyeSlashIcon v-if="isConfirmPassword" class="password-icon" />
              <EyeIcon v-else class="password-icon" />
            </div>
          </div>
          <p class="error-message">{{ errors?.ConfirmPassword }}</p>

          <button
            type="submit"
            class="button flex items-center justify-center w-full mt-8"
            :disabled="isSignup"
          >
            Sign Up <ArrowPathIcon v-if="isSignup" class="loading-btn" />
          </button>
        </Form>
      </div>
    </div>
  </main>
</template>
