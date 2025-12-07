<script setup lang="ts">
import { signIn } from '@/service/authService'
import { useAuthStore } from '@/stores/authStore'
import type { AxiosError } from 'axios'
import { error } from 'console'
import { onMounted } from 'vue'
import { ref } from 'vue'

const username = ref<string>('')
const password = ref<string>('')

const errorMessage = ref<string>('')

const authStore = useAuthStore()

async function handleLogin() {
  try {
    await signIn({ username: username.value, password: password.value })
    window.location.href = '/'
  } catch (error) {
    console.error('Login failed:', error)
    switch ((error as AxiosError).response?.status) {
      case 401:
        errorMessage.value = 'Invalid username or password.'
        break
      case 400:
        errorMessage.value = 'Please provide a valid username and password.'
        break
      default:
        errorMessage.value = 'An unexpected error occurred. Please try again later.'
    }
  }
}

onMounted(() => {
  if (authStore.isAuthenticated()) {
    window.location.href = '/'
  }
})
</script>

<template>
  <div class="flex justify-center items-center h-[calc(100vh-4rem)]">
    <div
      class="bg-white m-5 p-5 shadow-lg flex flex-col justify-center items-center"
      style="border-radius: 1rem"
    >
      <span class="text-4xl font-bold">Login</span>
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="border border-gray-300 rounded-full p-2 mt-4 w-64"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="border border-gray-300 rounded-full p-2 mt-4 w-64"
      />
      <button @click="handleLogin" class="">Login</button>
      <div v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<style scoped>
button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 100vw;
  margin-top: 1rem;
  cursor: pointer;
  border: 2px solid white;
}

button:hover {
  background-color: rgba(var(--primary-color-rgb), 0.8);
}
</style>
