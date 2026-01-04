import api from '@/axiosClient'
import { useAuthStore } from '@/stores/authStore'
import type { SignInRequest } from '@/types/SignInRequest'

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
    authStore.setToken(res.data.accessToken)
    return res.data.accessToken
  } catch (err) {
    authStore.setToken('')
    throw err
  }
}

export const signOut = async () => {
  const authStore = useAuthStore()
  await api.post('/auth/logout')
  authStore.setToken('')
}

export const checkAuth = async () => {
  await api.post('/auth/check')
}
