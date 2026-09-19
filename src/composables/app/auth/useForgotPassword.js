// src/composables/auth/useForgotPassword.js
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/js/api'

/**
 * Steps:
 *  1 — 'email'   → POST /forgot-password  { email }
 *  2 — 'otp'     → POST /verify-otp       { email, otp }
 *  3 — 'reset'   → POST /reset-password   { email, otp, password, password_confirmation }
 */
export function useForgotPassword() {
  const router = useRouter()

  // ── Step tracking ─────────────────────────────────────────────────
  const step = ref('email') // 'email' | 'otp' | 'reset'

  const STEPS = ['email', 'otp', 'reset']

  function stepIndex() {
    return STEPS.indexOf(step.value) + 1
  }

  // ── Form state ────────────────────────────────────────────────────
  const form = reactive({
    email: '',
    otp: '',
    password: '',
    password_confirmation: ''
  })

  // ── UI state ──────────────────────────────────────────────────────
  const loading = ref(false)
  const errorMsg = ref('')
  const successMsg = ref('')
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)

  function clearMessages() {
    errorMsg.value = ''
    successMsg.value = ''
  }

  // ── Error parser (mirrors useAuth) ────────────────────────────────
  function parseError(err) {
    const validationErrors = err.response?.data?.errors
    const serverMsg = err.response?.data?.message

    if (validationErrors) {
      return Object.values(validationErrors).flat().join(' ')
    }
    return serverMsg || 'Terjadi kesalahan. Coba lagi.'
  }

  // ── Step 1: Send email ────────────────────────────────────────────
  async function handleSendEmail() {
    clearMessages()
    loading.value = true

    try {
      await api.post('/forgot-password', { email: form.email })
      successMsg.value = 'Kode OTP telah dikirim ke email Anda.'
      step.value = 'otp'
    } catch (err) {
      errorMsg.value = parseError(err)
    } finally {
      loading.value = false
    }
  }

  // ── Step 2: Verify OTP ────────────────────────────────────────────
  async function handleVerifyOtp() {
    clearMessages()
    loading.value = true

    try {
      await api.post('/verify-otp', {
        email: form.email,
        otp: form.otp
      })
      successMsg.value = 'OTP valid. Silakan buat password baru.'
      step.value = 'reset'
    } catch (err) {
      errorMsg.value = parseError(err)
    } finally {
      loading.value = false
    }
  }

  // ── Step 3: Reset password ────────────────────────────────────────
  async function handleResetPassword() {
    clearMessages()
    loading.value = true

    try {
      await api.post('/reset-password', {
        email: form.email,
        otp: form.otp,
        password: form.password,
        password_confirmation: form.password_confirmation
      })
      successMsg.value = 'Password berhasil diubah! Mengarahkan ke halaman login...'

      setTimeout(() => {
        router.push({ name: 'login' })
      }, 1800)
    } catch (err) {
      errorMsg.value = parseError(err)
    } finally {
      loading.value = false
    }
  }

  // ── Unified submit ────────────────────────────────────────────────
  async function handleSubmit() {
    if (step.value === 'email') return handleSendEmail()
    if (step.value === 'otp') return handleVerifyOtp()
    if (step.value === 'reset') return handleResetPassword()
  }

  // ── Go back within flow ───────────────────────────────────────────
  function goBack() {
    clearMessages()
    const idx = STEPS.indexOf(step.value)
    if (idx > 0) step.value = STEPS[idx - 1]
  }

  return {
    // State
    step,
    stepIndex,
    form,

    // UI
    loading,
    errorMsg,
    successMsg,
    showPassword,
    showConfirmPassword,

    // Actions
    handleSubmit,
    goBack
  }
}