import api from '@/axiosClient'
import { useAuthStore } from '@/stores/authStore'
import type { SignInRequest } from '@/types/signInRequest'

export const signIn = async (signInRequest: SignInRequest) => {
  const authStore = useAuthStore()

  const response = await api.post('/auth/login', signInRequest)
  const token = response.data.access_token

  authStore.setToken(token)
}

export const refreshAccessToken = async () => {
  const authStore = useAuthStore()
  try {
    const res = await api.post('/auth/refresh')
    authStore.setToken(res.data.access_token)
    return res.data.access_token
  } catch (err) {
    authStore.setToken('')
    throw err
  }
}

export const signOut = () => {
  const authStore = useAuthStore()
  api.post('/auth/logout')
  authStore.setToken('')
}
