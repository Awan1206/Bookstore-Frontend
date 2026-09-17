import { ref, computed, onMounted, nextTick } from 'vue'
import api from '@/js/api'

export function useBooksPage() {
  // ---------- API: List ----------
  const books = ref([])
  const loading = ref(false)
  const error = ref(null)
  const meta = ref({ current_page: 1, per_page: 15, total: 0, last_page: 1 })

  async function fetchBooks(page = 1) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/admin/books', {
        params: { page, search: search.value || undefined },
      })
      books.value = data.data
      meta.value = data.meta
    } catch (err) {
      error.value = err?.response?.data?.message ?? 'Gagal memuat data buku.'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchBooks())

  // ---------- Search ----------
  const search = ref('')

  function handleSearch() {
    fetchBooks(1)
  }

  function clearSearch() {
    search.value = ''
    fetchBooks(1)
  }

  // ---------- Pagination ----------
  const currentPage = computed(() => meta.value.current_page)
  const lastPage = computed(() => meta.value.last_page)
  const total = computed(() => meta.value.total)

  function goToPage(page) {
    if (page < 1 || page > lastPage.value) return
    fetchBooks(page)
  }

  // ---------- Format helpers ----------
  function formatCurrency(value) {
    if (value == null) return '-'
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
  }

  function formatDate(value) {
    if (!value) return '-'
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value))
  }

  // ---------- Categories for select ----------
  const categories = ref([])

  async function fetchCategories() {
    try {
      const { data } = await api.get('/admin/categories')
      categories.value = data.data ?? data
    } catch {
      // non-critical; form still shows without category list
    }
  }

  // ---------- Form state ----------
  const submitting = ref(false)
  const formError = ref(null)
  const formMode = ref('create')
  const activeBook = ref(null)

  // Local object URL for the image file picked by the user (not yet uploaded)
  const imagePreview = ref(null)

  const formData = ref(emptyForm())

  function emptyForm() {
    return {
      title: '',
      category_id: '',
      publish_date: '',
      stock: '',
      cost_price: '',
      sell_price: '',
      description: '',
      image: null, // File object — only set when user picks a new file
    }
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    formData.value.image = file
    // Revoke previous object URL to avoid memory leak
    if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = URL.createObjectURL(file)
  }

  function removeImage() {
    formData.value.image = null
    if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = null
  }

  // ---------- Dialog: Form ----------
  const formDialog = ref(null)
  const titleInputRef = ref(null)

  async function openCreateDialog() {
    formMode.value = 'create'
    activeBook.value = null
    formData.value = emptyForm()
    if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = null
    formError.value = null
    await fetchCategories()
    formDialog.value?.showModal()
    nextTick(() => titleInputRef.value?.focus())
  }

  async function openEditDialog(book) {
    formMode.value = 'edit'
    activeBook.value = book
    formData.value = {
      title: book.title,
      category_id: book.category?.id ?? '',
      publish_date: book.publish_date ? book.publish_date.slice(0, 10) : '',
      stock: book.stock ?? '',
      cost_price: book.cost_price ?? '',
      sell_price: book.sell_price ?? '',
      description: book.description ?? '',
      image: null, // null = keep existing image; only replaced when user picks a new file
    }
    if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
    // Show existing image from server as preview
    imagePreview.value = book.image_url ?? null
    formError.value = null
    await fetchCategories()
    formDialog.value?.showModal()
    nextTick(() => titleInputRef.value?.focus())
  }

  function closeFormDialog() {
    formDialog.value?.close()
  }

  function resetFormError() {
    formError.value = null
  }

  async function handleSubmit() {
    if (!formData.value.title.trim()) {
      formError.value = 'Judul buku wajib diisi.'
      return
    }

    submitting.value = true
    formError.value = null

    try {
      // Use FormData so image file can be sent as multipart/form-data.
      // Cast numeric fields explicitly — v-model on <input type="number"> yields a string,
      // but Laravel validates publish_year as 'integer', stock/prices as 'numeric'.
      const payload = new FormData()
      payload.append('title', formData.value.title.trim())
      if (formData.value.category_id !== '') payload.append('category_id', Number(formData.value.category_id))
      if (formData.value.publish_date) payload.append('publish_date', formData.value.publish_date)
      if (formData.value.stock !== '') payload.append('stock', Number(formData.value.stock))
      if (formData.value.cost_price !== '') payload.append('cost_price', Number(formData.value.cost_price))
      if (formData.value.sell_price !== '') payload.append('sell_price', Number(formData.value.sell_price))
      if (formData.value.description.trim()) payload.append('description', formData.value.description.trim())
      if (formData.value.image) payload.append('image', formData.value.image)

      if (formMode.value === 'create') {
        await api.post('/admin/books', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        // Laravel does not support PUT with multipart; use POST + _method spoofing
        payload.append('_method', 'PUT')
        await api.post(`/admin/books/${activeBook.value.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      closeFormDialog()
      fetchBooks(currentPage.value)
    } catch (err) {
      formError.value = err?.response?.data?.message ?? 'Gagal menyimpan buku.'
    } finally {
      submitting.value = false
    }
  }

  // ---------- Dialog: Delete ----------
  const deleteDialog = ref(null)
  const bookToDelete = ref(null)
  const deleting = ref(false)
  const deleteError = ref(null)

  function openDeleteDialog(book) {
    bookToDelete.value = book
    deleteError.value = null
    deleteDialog.value?.showModal()
  }

  function closeDeleteDialog() {
    deleteDialog.value?.close()
  }

  function resetDeleteError() {
    deleteError.value = null
  }

  async function confirmDelete() {
    if (!bookToDelete.value) return
    deleting.value = true
    deleteError.value = null
    try {
      await api.delete(`/admin/books/${bookToDelete.value.id}`)
      closeDeleteDialog()
      const targetPage = books.value.length === 1 && currentPage.value > 1
        ? currentPage.value - 1
        : currentPage.value
      fetchBooks(targetPage)
    } catch (err) {
      deleteError.value = err?.response?.data?.message ?? 'Gagal menghapus buku.'
    } finally {
      deleting.value = false
    }
  }

  return {
    // list
    books,
    loading,
    error,
    fetchBooks,
    // search
    search,
    handleSearch,
    clearSearch,
    // pagination
    meta,
    currentPage,
    lastPage,
    total,
    goToPage,
    // helpers
    formatCurrency,
    formatDate,
    // form dialog
    categories,
    formDialog,
    formMode,
    formData,
    formError,
    submitting,
    titleInputRef,
    imagePreview,
    handleImageChange,
    removeImage,
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    resetFormError,
    handleSubmit,
    // delete dialog
    deleteDialog,
    bookToDelete,
    deleting,
    deleteError,
    openDeleteDialog,
    closeDeleteDialog,
    resetDeleteError,
    confirmDelete,
  }
}