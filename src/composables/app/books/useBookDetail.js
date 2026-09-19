import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import api from '@/js/api'

export function useBookDetail() {
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const cartStore = useCartStore()

  const book = ref(null)
  const isLoading = ref(false)
  const error = ref('')
  const quantity = ref(1)

  const formattedPrice = computed(() =>
    book.value
      ? new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(book.value.sell_price)
      : ''
  )

  const isOutOfStock = computed(() => (book.value?.stock ?? 0) === 0)
  const maxQty = computed(() => book.value?.stock ?? 1)

  function decrementQty() {
    if (quantity.value > 1) quantity.value--
  }

  function incrementQty() {
    if (quantity.value < maxQty.value) quantity.value++
  }

  async function fetchBook() {
    isLoading.value = true
    error.value = ''
    try {
      const { data } = await api.get(`/catalog/${route.params.id}`)
      book.value = data.data
    } catch {
      error.value = 'Book not found or something went wrong. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  async function handleAddToCart() {
    if (!authStore.isAuthenticated) {
      router.push({ name: 'login', query: { redirect: route.fullPath } })
      return
    }

    const result = await cartStore.addItem({
      id: book.value.id,
      quantity: quantity.value,   // ← pass the selected quantity
    })

    if (result.requiresLogin) {
      router.push({ name: 'login', query: { redirect: route.fullPath } })
    }
  }

  function goBack() {
    router.back()
  }

  onMounted(fetchBook)

  return {
    book,
    isLoading,
    error,
    quantity,
    formattedPrice,
    isOutOfStock,
    maxQty,
    fetchBook,
    decrementQty,
    incrementQty,
    handleAddToCart,
    goBack,
  }
}