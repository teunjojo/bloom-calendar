import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

import { refreshAccessToken } from '@/service/authService'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
})

// Attach access token to requests
api.interceptors.request.use((config) => {
  const store = useAuthStore()
  if (store.getToken()) {
    config.headers.Authorization = `Bearer ${store.getToken()}`
  }
  return config
})

let refreshing = false
let queue: ((token: string) => void)[] = [] // Explicitly typed function array

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original.__retry) {
      original.__retry = true
      if (!refreshing) {
        refreshing = true
        try {
          const token = await refreshAccessToken()
          queue.forEach((cb) => cb(token))
          queue = []
          return api(original)
        } finally {
          refreshing = false
        }
      }
    }

    return Promise.reject(error)
  },
)

export default api
