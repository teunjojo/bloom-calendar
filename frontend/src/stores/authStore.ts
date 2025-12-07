import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')

  const setToken = (newToken: string) => {
    token.value = newToken
    document.cookie = `token=${newToken}; Secure; HttpOnly; SameSite=Strict`
  }

  const getToken = () => {
    return token.value
  }

  return { setToken, getToken }
})
