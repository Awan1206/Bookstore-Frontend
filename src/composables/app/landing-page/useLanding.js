import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import api from '@/js/api'

const CARD_COLORS = ['bg-[#1B3B2B]', 'bg-[#3B2C1B]', 'bg-[#2C1B3B]', 'bg-[#1B2C3B]']

export function useLanding() {
  const authStore = useAuthStore()
  const cartStore = useCartStore()

  // ── UI state ──────────────────────────────────────────────────────────
  const showUserDropdown = ref(false)
  const showCartDrawer = ref(false)
  const showCheckoutDrawer = ref(false)
  const activeCategory = ref('Semua')
  const newsletterEmail = ref('')
  const subscribedMessage = ref('')

  function toggleCartDrawer() {
    showCartDrawer.value = !showCartDrawer.value
    // Close checkout drawer when toggling cart
    if (!showCartDrawer.value) showCheckoutDrawer.value = false
  }

  function openCheckout() {
    showCheckoutDrawer.value = true
  }

  function closeCheckoutDrawer() {
    showCheckoutDrawer.value = false
  }

  function closeAll() {
    showCartDrawer.value = false
    showCheckoutDrawer.value = false
  }

  // ── Catalog ───────────────────────────────────────────────────────────
  const books = ref([])
  const isLoadingBooks = ref(false)
  const booksError = ref('')

  async function fetchBooks() {
    isLoadingBooks.value = true
    booksError.value = ''
    try {
      const { data } = await api.get('/catalog', {
        params: { q: '', category_id: '', page: 1 },
      })
      books.value = data.data.map((book, index) => ({
        ...book,
        bgClass: CARD_COLORS[index % CARD_COLORS.length],
      }))
    } catch (err) {
      booksError.value = 'Gagal memuat daftar buku. Coba lagi nanti.'
      console.error('[useLanding] fetchBooks error:', err)
    } finally {
      isLoadingBooks.value = false
    }
  }

  const categories = computed(() => {
    const seen = new Set()
    const unique = []
    for (const book of books.value) {
      if (book.category && !seen.has(book.category.id)) {
        seen.add(book.category.id)
        unique.push(book.category)
      }
    }
    return [{ id: 'semua', name: 'Semua' }, ...unique]
  })

  const filteredBooks = computed(() => {
    if (activeCategory.value === 'Semua') return books.value
    return books.value.filter((b) => b.category?.name === activeCategory.value)
  })

  onMounted(fetchBooks)

  // ── Cart (delegated to store) ─────────────────────────────────────────
  /**
   * Returns { requiresLogin: true } for guest users so the
   * component can redirect to login.
   */
  async function addToCart(book) {
    if (!authStore.isAuthenticated) return { requiresLogin: true }
    const result = await cartStore.addItem(book)
    if (result.success) showCartDrawer.value = true
    return result
  }

  // ── Newsletter ────────────────────────────────────────────────────────
  function handleSubscribe() {
    subscribedMessage.value = `Terima kasih! ${newsletterEmail.value} telah terdaftar.`
    newsletterEmail.value = ''
  }

  // ── Helpers ───────────────────────────────────────────────────────────
  function formatPrice(value) {
    return new Intl.NumberFormat('id-ID').format(value ?? 0)
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleLogout() {
    showUserDropdown.value = false
    cartStore.clearCart()
    await authStore.logout()
  }

  return {
    authStore,
    cartStore,

    // Drawer visibility
    showUserDropdown,
    showCartDrawer,
    showCheckoutDrawer,
    toggleCartDrawer,
    openCheckout,
    closeCheckoutDrawer,
    closeAll,

    // Catalog
    categories,
    activeCategory,
    filteredBooks,
    isLoadingBooks,
    booksError,
    fetchBooks,

    // Cart action
    addToCart,

    // Newsletter
    newsletterEmail,
    subscribedMessage,
    handleSubscribe,

    // Helpers
    formatPrice,
    scrollToTop,
    handleLogout,
  }
}