import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/js/api'

export const useCartStore = defineStore('cart', () => {
  // ── State ─────────────────────────────────────────────────────────────
  // Each item shape from GET /cart:
  // { id, book_id, title, price, quantity, subtotal, image_url }
  const items = ref([])
  const isLoading = ref(false)
  const error = ref('')

  // ── Getters ───────────────────────────────────────────────────────────
  const count = computed(() => items.value.length)

  // Backend sends subtotal per item — just sum them up
  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.subtotal, 0)
  )

  // ── Actions ───────────────────────────────────────────────────────────

  async function fetchCart() {
    isLoading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/cart')
      // Backend: { items: [...], total: number }
      items.value = data.items ?? []
    } catch (err) {
      error.value = 'Gagal memuat keranjang.'
      console.error('[cartStore] fetchCart:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function addItem(book) {
    error.value = ''
    try {
        await api.post('/cart', {
        book_id: book.id,
        quantity: book.quantity ?? 1,   // ← was hardcoded to 1
        })
        await fetchCart()
        return { success: true }
    } catch (err) {
        if (err.response?.status === 401) return { requiresLogin: true }
        error.value = err.response?.data?.message ?? 'Gagal menambahkan buku ke keranjang.'
        return { success: false }
    }
  }

  async function updateItem(cartItemId, quantity) {
    if (quantity < 1) return removeItem(cartItemId)
    error.value = ''
    try {
      await api.put(`/cart/${cartItemId}`, { quantity })
      // Update locally — avoid a full re-fetch for snappy UX
      const idx = items.value.findIndex((i) => i.id === cartItemId)
      if (idx !== -1) {
        items.value[idx].quantity = quantity
        items.value[idx].subtotal = items.value[idx].price * quantity
      }
    } catch (err) {
      error.value = err.response?.data?.message ?? 'Gagal memperbarui jumlah.'
      console.error('[cartStore] updateItem:', err)
      // Re-fetch to restore correct state if local update was wrong
      await fetchCart()
    }
  }

  async function removeItem(cartItemId) {
    error.value = ''
    // Optimistic remove
    const backup = [...items.value]
    items.value = items.value.filter((i) => i.id !== cartItemId)
    try {
      await api.delete(`/cart/${cartItemId}`)
    } catch (err) {
      // Rollback on failure
      items.value = backup
      error.value = 'Gagal menghapus item.'
      console.error('[cartStore] removeItem:', err)
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    isLoading,
    error,
    count,
    total,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  }
})