// src/composables/landing-page/useLanding.js
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/js/api'

// Warna kartu buku (bgClass) tidak dikirim backend — dirotasi di frontend
// saja supaya tampilan katalog tetap variatif.
const CARD_COLORS = ['bg-[#1B3B2B]', 'bg-[#3B2C1B]', 'bg-[#2C1B3B]', 'bg-[#1B2C3B]']

export function useLanding() {
  const authStore = useAuthStore()

  // ── UI state (local only — bukan domain state, sesuai aturan) ────────
  const showUserDropdown = ref(false)
  const showCartDrawer = ref(false)
  const activeCategory = ref('Semua')
  const newsletterEmail = ref('')
  const subscribedMessage = ref('')

  // ── Cart (sementara local state) ──────────────────────────────────
  // TODO: pindahkan ke Pinia Cart Store saat fitur cart dikembangkan
  // lebih lanjut (butuh sinkron ke backend, checkout, dsb).
  const cartItems = ref([])

  const cartItemsCount = computed(() => cartItems.value.length)
  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price, 0)
  )

  function addToCart(book) {
    if (!authStore.isAuthenticated) {
      // Guest belum bisa add to cart — arahkan ke login via router
      // dilakukan di component (butuh akses router), bukan di sini.
      return { requiresLogin: true }
    }

    cartItems.value.push(book)
    return { requiresLogin: false }
  }

  function removeFromCart(bookId) {
    cartItems.value = cartItems.value.filter((item) => item.id !== bookId)
  }

  function toggleCartDrawer() {
    showCartDrawer.value = !showCartDrawer.value
  }

  // ── Katalog & filter ──────────────────────────────────────────────
  const books = ref([])
  const isLoadingBooks = ref(false)
  const booksError = ref('')

  async function fetchBooks() {
    isLoadingBooks.value = true
    booksError.value = ''
    try {
      const { data } = await api.get('/catalog')
      // Normalisasi: CatalogController@index bisa balikin array langsung,
      // atau hasil paginate Laravel bentuk { data: [...] }. Sesuaikan lagi
      // kalau bentuk response asli berbeda dari ini.
      const rawBooks = Array.isArray(data) ? data : (data.data ?? [])
      books.value = rawBooks.map((book, index) => ({
        bgClass: CARD_COLORS[index % CARD_COLORS.length],
        ...book
      }))
    } catch (err) {
      booksError.value = 'Gagal memuat daftar buku. Coba lagi nanti.'
      console.error('[useLanding] fetchBooks error:', err)
    } finally {
      isLoadingBooks.value = false
    }
  }

  // Tidak ada endpoint publik khusus kategori di api.php — route
  // /admin/categories butuh auth + permission manage-categories.
  // Kategori diturunkan dari hasil GET /catalog saja.
  const categories = computed(() => {
    const unique = [...new Set(books.value.map((book) => book.category).filter(Boolean))]
    return ['Semua', ...unique]
  })

  const filteredBooks = computed(() => {
    if (activeCategory.value === 'Semua') return books.value
    return books.value.filter((book) => book.category === activeCategory.value)
  })

  onMounted(fetchBooks)

  // ── Newsletter ────────────────────────────────────────────────────
  function handleSubscribe() {
    // TODO: hubungkan ke endpoint newsletter jika sudah tersedia.
    subscribedMessage.value = `Terima kasih! ${newsletterEmail.value} telah terdaftar.`
    newsletterEmail.value = ''
  }

  // ── Helpers ───────────────────────────────────────────────────────
  function formatPrice(value) {
    return new Intl.NumberFormat('id-ID').format(value)
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleLogout() {
    showUserDropdown.value = false
    await authStore.logout()
  }

  return {
    authStore,

    // UI state
    showUserDropdown,
    showCartDrawer,
    toggleCartDrawer,

    // Cart
    cartItems,
    cartItemsCount,
    cartTotal,
    addToCart,
    removeFromCart,

    // Catalog
    categories,
    activeCategory,
    filteredBooks,
    isLoadingBooks,
    booksError,
    fetchBooks,

    // Newsletter
    newsletterEmail,
    subscribedMessage,
    handleSubscribe,

    // Helpers
    formatPrice,
    scrollToTop,
    handleLogout
  }
}