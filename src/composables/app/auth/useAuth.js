// src/composables/auth/useAuth.js
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/js/api'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()

  // ── Panel state ───────────────────────────────────────────────────
  const isRegister = ref(false)

  function togglePanel() {
    isRegister.value = !isRegister.value
    resetForm()
    errorMsg.value = ''
    successMsg.value = ''
  }

  // ── Form state ────────────────────────────────────────────────────
  const form = reactive({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    remember: false
  })

  function resetForm() {
    form.name = ''
    form.username = ''
    form.email = ''
    form.phone = ''
    form.password = ''
    form.password_confirmation = ''
    form.remember = false
  }

  // ── UI state ──────────────────────────────────────────────────────
  const showPassword = ref(false)
  const loading = ref(false)
  const errorMsg = ref('')
  const successMsg = ref('')

  // ── Submit ────────────────────────────────────────────────────────
  async function handleSubmit() {
    errorMsg.value = ''
    successMsg.value = ''
    loading.value = true

    try {
      if (isRegister.value) {
        await handleRegister()
      } else {
        await handleLogin()
      }
    } catch (err) {
      // Laravel validation error: { message, errors: { field: [...] } }
      // Laravel auth error: { message }
      const serverMsg = err.response?.data?.message
      const validationErrors = err.response?.data?.errors

      if (validationErrors) {
        // Ambil pesan pertama dari setiap field, gabung jadi satu baris
        errorMsg.value = Object.values(validationErrors).flat().join(' ')
      } else {
        errorMsg.value = serverMsg || 'Terjadi kesalahan. Coba lagi.'
      }
    } finally {
      loading.value = false
    }
  }

  // useAuth.js — temporary debug
async function handleLogin() {
  await authStore.login({
    username: form.username,
    password: form.password,
    remember: form.remember
  })

  console.log('user:', authStore.user)
  console.log('isAdmin:', authStore.isAdmin)
  console.log('role:', authStore.role)

  const redirect = route.query.redirect
  if (redirect) {
    await router.push(redirect)
  } else if (authStore.isAdmin) {
    await router.push({ name: 'admin.dashboard' })
  } else {
    await router.push({ name: 'landing' })
  }
}

  async function handleRegister() {
    await api.post('/register', {
      name: form.name,
      username: form.username,
      email: form.email,
      phone: form.phone,
      password: form.password,
      password_confirmation: form.password_confirmation
    })

    successMsg.value = 'Akun berhasil dibuat! Silakan login.'
    isRegister.value = false
    resetForm()
  }

  return {
    // Panel
    isRegister,
    togglePanel,

    // Form
    form,

    // UI
    showPassword,
    loading,
    errorMsg,
    successMsg,

    // Actions
    handleSubmit
  }
}