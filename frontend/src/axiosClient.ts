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

// Offline Static data return
api.interceptors.request.use(async (config) => {
  if (import.meta.env.VITE_OFFLINE_MODE === 'true') {
    switch (config.url) {
      case '/event': {
        const { getEventsStatic } = await import('@/service/eventServiceStatic')
        const params = config.params || {}
        const data = await getEventsStatic(params)
        return Promise.resolve({
          ...config,
          adapter: () =>
            Promise.resolve({ data, status: 200, statusText: 'OK', headers: {}, config }),
        })
      }
      case '/forecast': {
        const { getForecastsStatic } = await import('@/service/forecastServiceStatic')
        const params = config.params || {}
        const data = await getForecastsStatic(params)
        return Promise.resolve({
          ...config,
          adapter: () =>
            Promise.resolve({ data, status: 200, statusText: 'OK', headers: {}, config }),
        })
      }
      default:
        break
    }
  }
  return config
})

export default api
