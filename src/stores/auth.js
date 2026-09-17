// src/stores/auth.js
// Mode: Laravel Sanctum Personal Access Token (Bearer)
//
// Pinia Auth Store adalah SATU-SATUNYA sumber kebenaran authentication state.
// localStorage di sini HANYA dipakai sebagai mekanisme persistence di balik
// store (native browser API, bukan library tambahan), supaya token tidak
// hilang saat refresh. Component/service tidak pernah mengakses
// localStorage secara langsung — semua akses token wajib lewat store ini.
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/js/api'

const TOKEN_STORAGE_KEY = 'auth_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_STORAGE_KEY))
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  // Role diambil dari data user (bukan state terpisah), agar tetap satu
  // sumber kebenaran. Sesuaikan 'admin' dengan nilai role yang dikirim backend.
  const role = computed(() => user.value?.role?.name ?? null)
  const isAdmin = computed(() => role.value === 'admin')
  const isUser = computed(() => role.value === 'user')

  // Satu-satunya tempat yang boleh menulis token ke Pinia state
  // sekaligus menyinkronkannya ke localStorage. Tidak ada bagian lain
  // dari aplikasi (component, service) yang menyentuh localStorage ini.
  function setToken(newToken) {
    token.value = newToken

    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken)
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }

  function clearAuth() {
    setToken(null)
    user.value = null
  }

  async function login(credentials) {
    const { data } = await api.post('/login', credentials)
    setToken(data.token)
    user.value = data.user

    // Pastikan role sudah ter-load sebelum redirect
    await fetchUser()
  }

  async function fetchUser() {
    const { data } = await api.get('/me')
    user.value = data
  }

  async function logout() {
    try {
      await api.post('/logout')
    } finally {
      clearAuth()
    }
  }

  // Dipanggil sekali saat app start (lihat main.js) untuk
  // memulihkan session dari token yang tersimpan.
  async function restoreAuth() {
    if (!token.value) return

    try {
      await fetchUser()
    } catch {
      clearAuth()
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    role,
    isAdmin,
    isUser,
    login,
    logout,
    fetchUser,
    restoreAuth,
    clearAuth
  }
})