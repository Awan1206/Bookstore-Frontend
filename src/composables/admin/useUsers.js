import { ref, computed, onMounted, nextTick } from 'vue'
import api from '@/js/api'

export function useUsersPage() {
  // ---------- API: List ----------
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)
  const meta = ref({ current_page: 1, per_page: 15, total: 0, last_page: 1 })

  async function fetchUsers(page = 1) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/admin/users', {
        params: { page, search: search.value || undefined },
      })
      users.value = data.data
      meta.value = data.meta
    } catch (err) {
      error.value = err?.response?.data?.message ?? 'Gagal memuat data pengguna.'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchUsers())

  // ---------- Search ----------
  const search = ref('')

  function handleSearch() {
    fetchUsers(1)
  }

  function clearSearch() {
    search.value = ''
    fetchUsers(1)
  }

  // ---------- Pagination ----------
  const currentPage = computed(() => meta.value.current_page)
  const lastPage = computed(() => meta.value.last_page)
  const total = computed(() => meta.value.total)

  function goToPage(page) {
    if (page < 1 || page > lastPage.value) return
    fetchUsers(page)
  }

  // ---------- Format helpers ----------
  function formatDate(value) {
    if (!value) return '-'
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value))
  }

  // ---------- Roles for select ----------
  const roles = ref([])

  async function fetchRoles() {
    try {
      const { data } = await api.get('/admin/roles')
      roles.value = data.data ?? data
    } catch {
      // non-critical
    }
  }

  // ---------- Form state ----------
  const submitting = ref(false)
  const formError = ref(null)
  const activeUser = ref(null)

  const formData = ref(emptyForm())

  function emptyForm() {
    return {
      name: '',
      username: '',
      email: '',
      phone: '',
      role_id: '',
      password: '',
      password_confirmation: '',
    }
  }

  // ---------- Dialog: Edit ----------
  const formDialog = ref(null)
  const nameInputRef = ref(null)

  async function openEditDialog(user) {
    activeUser.value = user
    formData.value = {
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone ?? '',
      role_id: user.role?.id ?? '',
      password: '',
      password_confirmation: '',
    }
    formError.value = null
    await fetchRoles()
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
    if (!formData.value.name.trim()) {
      formError.value = 'Nama wajib diisi.'
      return
    }

    if (formData.value.password && formData.value.password !== formData.value.password_confirmation) {
      formError.value = 'Konfirmasi password tidak cocok.'
      return
    }

    submitting.value = true
    formError.value = null

    try {
      const payload = {
        name: formData.value.name.trim(),
        username: formData.value.username.trim(),
        email: formData.value.email.trim(),
        phone: formData.value.phone.trim() || null,
        role_id: formData.value.role_id || undefined,
      }

      // Only include password fields if admin intends to change it
      if (formData.value.password) {
        payload.password = formData.value.password
        payload.password_confirmation = formData.value.password_confirmation
      }

      await api.put(`/admin/users/${activeUser.value.id}`, payload)
      closeFormDialog()
      fetchUsers(currentPage.value)
    } catch (err) {
      formError.value = err?.response?.data?.message ?? 'Gagal menyimpan perubahan.'
    } finally {
      submitting.value = false
    }
  }

  // ---------- Dialog: Delete ----------
  const deleteDialog = ref(null)
  const userToDelete = ref(null)
  const deleting = ref(false)
  const deleteError = ref(null)

  function openDeleteDialog(user) {
    userToDelete.value = user
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
    if (!userToDelete.value) return
    deleting.value = true
    deleteError.value = null
    try {
      await api.delete(`/admin/users/${userToDelete.value.id}`)
      closeDeleteDialog()
      const targetPage = users.value.length === 1 && currentPage.value > 1
        ? currentPage.value - 1
        : currentPage.value
      fetchUsers(targetPage)
    } catch (err) {
      deleteError.value = err?.response?.data?.message ?? 'Gagal menghapus pengguna.'
    } finally {
      deleting.value = false
    }
  }

  return {
    // list
    users,
    loading,
    error,
    fetchUsers,
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
    formatDate,
    // form dialog
    roles,
    formDialog,
    formData,
    formError,
    submitting,
    nameInputRef,
    openEditDialog,
    closeFormDialog,
    resetFormError,
    handleSubmit,
    // delete dialog
    deleteDialog,
    userToDelete,
    deleting,
    deleteError,
    openDeleteDialog,
    closeDeleteDialog,
    resetDeleteError,
    confirmDelete,
  }
}