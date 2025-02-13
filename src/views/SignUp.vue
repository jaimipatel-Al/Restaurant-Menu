<script setup>
import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'
import { Form, Field } from 'vee-validate'
import { ref } from 'vue'
import * as yup from 'yup'

const schema = yup.object({
  Name: yup.string().required().max(20),
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
  Type: yup.string().required('Register as is required'),
})

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isPassword = ref(false)
const isConfirmPassword = ref(false)
const type = ref('customer')
const isSignup = ref(false)

const signup = () => {}
</script>

<template>
  <main class="auth p-8">
    <div class="auth-box" style="height: 660px">
      <div class="auth-img-box">
        <img src="@/assets/img/signup.jpg" alt="Sign Up" class="w-full h-full object-cover" />
      </div>
      <div class="flex-1 p-10">
        <h1 class="auth-title">Sign Up</h1>
        <p class="auth-detail">
          Already have an account?
          <RouterLink to="/login" class="text-orange-600 underline">Login</RouterLink>
        </p>
        <Form @submit="signup" :validation-schema="schema" v-slot="{ errors }">
          <label for="name">Name</label>
          <Field
            v-model="name"
            type="text"
            name="Name"
            id="name"
            class="input"
            placeholder="Enter Your Name"
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

          <label for="type">Register As</label>
          <select name="Type" id="type" v-model="type" class="input">
            <option value="owner">Owner</option>
            <option value="customer">Customer</option>
          </select>

          <button
            type="submit"
            class="button flex items-center justify-center w-full mt-10"
            :disabled="isSignup"
          >
            Sign Up <ArrowPathIcon v-if="isSignup" class="w-6 mx-3" />
          </button>
        </Form>
      </div>
    </div>
  </main>
</template>
