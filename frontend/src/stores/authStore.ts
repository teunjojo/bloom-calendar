import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')

  const setToken = (newToken: string) => {
    token.value = newToken
  }

  const getToken = () => {
    return token.value
  }

  const isAuthenticated = () => {
    return token.value !== ''
  }

  return { token, setToken, getToken, isAuthenticated }
})
