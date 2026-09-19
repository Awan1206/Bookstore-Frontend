import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/js/router'
import echo from '@/js/echo'   // NEW

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// Kirim Bearer token secara terpusat, tidak di component/service.
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const token = authStore.token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const socketId = echo.socketId()
  if (socketId) {
    config.headers['X-Socket-Id'] = socketId
  }

  return config
})

// Tangani 401 secara terpusat: bersihkan auth state,
// tapi redirect tetap lewat router (bukan langsung window.location)
// agar navigation tetap dapat diprediksi.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.clearAuth()

      if (router.currentRoute.value.name !== 'login') {
        router.push({ name: 'login' })
      }
    }

    return Promise.reject(error)
  }
)

export default api