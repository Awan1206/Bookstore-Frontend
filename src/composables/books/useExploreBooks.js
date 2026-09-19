import { ref, computed, onMounted } from 'vue'
import api from '@/js/api'

const CARD_COLORS = ['bg-[#1B3B2B]', 'bg-[#3B2C1B]', 'bg-[#2C1B3B]', 'bg-[#1B2C3B]']

export function useExploreBooks() {
  const books = ref([])
  const isLoading = ref(false)
  const error = ref('')
  const searchQuery = ref('')
  const activeCategoryId = ref('')
  const currentPage = ref(1)
  const meta = ref(null)

  // Kategori diturunkan dari hasil catalog — sama seperti landing page
  const categories = computed(() => {
    const seen = new Set()
    const unique = []
    for (const book of books.value) {
      if (book.category && !seen.has(book.category.id)) {
        seen.add(book.category.id)
        unique.push(book.category)
      }
    }
    return [{ id: '', name: 'All Books' }, ...unique]
  })

  const stockSummary = computed(() => {
    const inStock = books.value.filter((b) => b.stock > 5).length
    const lowStock = books.value.filter((b) => b.stock > 0 && b.stock <= 5).length
    const outOfStock = books.value.filter((b) => b.stock === 0).length
    return { inStock, lowStock, outOfStock }
  })

  async function fetchBooks() {
    isLoading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/catalog', {
        params: {
          q: searchQuery.value,
          category_id: activeCategoryId.value,
          page: currentPage.value,
        },
      })
      books.value = data.data.map((book, index) => ({
        id: book.id,
        title: book.title,
        category: book.category,
        sell_price: book.sell_price,
        stock: book.stock,
        image_url: book.image_url,
        publish_year: book.publish_year,
        bgClass: CARD_COLORS[index % CARD_COLORS.length],
      }))
      meta.value = data.meta
    } catch {
      error.value = 'Failed to load catalog. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  function setCategory(categoryId) {
    activeCategoryId.value = categoryId
    currentPage.value = 1
    fetchBooks()
  }

  function handleSearch() {
    currentPage.value = 1
    fetchBooks()
  }

  function formatPrice(value) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  function stockLabel(stock) {
    if (stock === 0) return { text: 'Out of stock', color: 'text-red-600', dot: 'bg-red-500' }
    if (stock <= 5) return { text: `Low stock (${stock})`, color: 'text-amber-600', dot: 'bg-amber-500' }
    return { text: 'In stock', color: 'text-emerald-700', dot: 'bg-emerald-500' }
  }

  onMounted(fetchBooks)

  return {
    books,
    isLoading,
    error,
    searchQuery,
    activeCategoryId,
    currentPage,
    meta,
    categories,
    stockSummary,
    fetchBooks,
    setCategory,
    handleSearch,
    formatPrice,
    stockLabel,
  }
}