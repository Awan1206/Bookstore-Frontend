import { ref, computed, onMounted, nextTick } from 'vue'
import api from '@/js/api'

export function useCategoriesPage() {
  // ---------- API: List ----------
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/admin/categories')
      categories.value = data.data ?? data
    } catch (err) {
      error.value = err?.response?.data?.message ?? 'Gagal memuat data kategori.'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchCategories)

  // ---------- Search ----------
  const search = ref('')

  const filteredCategories = computed(() => {
    const query = search.value.trim().toLowerCase()
    if (!query) return categories.value
    return categories.value.filter((c) => c.name.toLowerCase().includes(query))
  })

  function formatDate(value) {
    if (!value) return '-'
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value))
  }

  // ---------- Create ----------
  const submitting = ref(false)
  const formError = ref(null)

  async function createCategory(name) {
    submitting.value = true
    formError.value = null
    try {
      const { data } = await api.post('/admin/categories', { name })
      const created = data.data ?? data
      categories.value.unshift(created)
      return true
    } catch (err) {
      formError.value = err?.response?.data?.message ?? 'Gagal menambah kategori.'
      return false
    } finally {
      submitting.value = false
    }
  }

  // ---------- Update ----------
  async function updateCategory(id, name) {
    submitting.value = true
    formError.value = null
    try {
      const { data } = await api.put(`/admin/categories/${id}`, { name })
      const updated = data.data ?? data
      const index = categories.value.findIndex((c) => c.id === id)
      if (index !== -1) categories.value[index] = updated
      return true
    } catch (err) {
      formError.value = err?.response?.data?.message ?? 'Gagal memperbarui kategori.'
      return false
    } finally {
      submitting.value = false
    }
  }

  // ---------- Delete ----------
  const deleting = ref(false)
  const deleteError = ref(null)

  async function deleteCategory(id) {
    deleting.value = true
    deleteError.value = null
    try {
      await api.delete(`/admin/categories/${id}`)
      categories.value = categories.value.filter((c) => c.id !== id)
      return true
    } catch (err) {
      deleteError.value = err?.response?.data?.message ?? 'Gagal menghapus kategori. Pastikan kategori tidak memiliki buku.'
      return false
    } finally {
      deleting.value = false
    }
  }

  // ---------- Dialog: Form (Tambah / Edit) ----------
  const formDialog = ref(null)
  const formMode = ref('create')
  const activeCategory = ref(null)
  const nameInput = ref('')
  const nameInputRef = ref(null)

  function openCreateDialog() {
    formMode.value = 'create'
    activeCategory.value = null
    nameInput.value = ''
    formError.value = null
    formDialog.value?.showModal()
    nextTick(() => nameInputRef.value?.focus())
  }

  function openEditDialog(category) {
    formMode.value = 'edit'
    activeCategory.value = category
    nameInput.value = category.name
    formError.value = null
    formDialog.value?.showModal()
    nextTick(() => nameInputRef.value?.focus())
  }

  function closeFormDialog() {
    formDialog.value?.close()
  }

  function resetFormError() {
    formError.value = null
  }

  async function handleSubmit() {
    const name = nameInput.value.trim()
    if (!name) {
      formError.value = 'Nama kategori wajib diisi.'
      return
    }
    const ok = formMode.value === 'create'
      ? await createCategory(name)
      : await updateCategory(activeCategory.value.id, name)
    if (ok) closeFormDialog()
  }

  // ---------- Dialog: Konfirmasi Hapus ----------
  const deleteDialog = ref(null)
  const categoryToDelete = ref(null)

  function openDeleteDialog(category) {
    categoryToDelete.value = category
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
    if (!categoryToDelete.value) return
    const ok = await deleteCategory(categoryToDelete.value.id)
    if (ok) closeDeleteDialog()
  }

  return {
    // list
    loading,
    error,
    search,
    filteredCategories,
    formatDate,
    fetchCategories,
    // form dialog
    formDialog,
    formMode,
    nameInput,
    nameInputRef,
    formError,
    submitting,
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    resetFormError,
    handleSubmit,
    // delete dialog
    deleteDialog,
    categoryToDelete,
    deleting,
    deleteError,
    openDeleteDialog,
    closeDeleteDialog,
    resetDeleteError,
    confirmDelete,
  }
}