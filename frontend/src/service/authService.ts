import api from '@/axiosClient'
import { useAuthStore } from '@/stores/authStore'
import type { SignInRequest } from '@/types/signInRequest'

const authStore = useAuthStore()

export const signIn = async (signInRequest: SignInRequest): Promise<boolean> => {
  const response = await api.post('/auth/login', signInRequest)
  const token = response.data.access_token

  authStore.setToken(token)

  return true
}

export const refreshAccessToken = async () => {
  try {
    const res = await api.post('/auth/refresh')
    authStore.setToken(res.data.access_token)
    return res.data.access_token
  } catch (err) {
    authStore.setToken('')
    throw err
  }
}
