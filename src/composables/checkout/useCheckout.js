import { ref } from 'vue'
import api from '@/js/api'
import { useCartStore } from '@/stores/cart'

export function useCheckout() {
  const cartStore = useCartStore()

  const isSubmitting = ref(false)
  const error = ref('')
  const completedOrder = ref(null)  // data: { id, order_code, status, total_amount, items, ... }
  const qrCode = ref('')            // data:image/svg+xml;base64,...

  async function submitCheckout() {
    if (isSubmitting.value) return
    error.value = ''
    isSubmitting.value = true

    try {
      const { data } = await api.post('/checkout')
      // Response: { message, data: { order }, qr_code: 'data:image/svg+xml;base64,...' }
      completedOrder.value = data.data
      qrCode.value = data.qr_code
      cartStore.clearCart()
    } catch (err) {
      if (err.response?.status === 400) {
        error.value = err.response.data?.message ?? 'Keranjang kosong atau pesanan tidak valid.'
      } else {
        error.value = 'Terjadi kesalahan. Silakan coba lagi.'
      }
      console.error('[useCheckout] submitCheckout:', err)
    } finally {
      isSubmitting.value = false
    }
  }

  function reset() {
    completedOrder.value = null
    qrCode.value = ''
    error.value = ''
  }

  return {
    isSubmitting,
    error,
    completedOrder,
    qrCode,
    submitCheckout,
    reset,
  }
}