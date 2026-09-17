import { ref, onMounted } from 'vue'
import api from '@/js/api'

export function useReportsPage() {
  // ---------- Filters ----------
  const today = new Date()
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  function toDateInput(date) {
    return date.toISOString().slice(0, 10)
  }

  const filters = ref({
    start_date: toDateInput(firstOfMonth),
    end_date: toDateInput(today),
  })

  // ---------- Report data ----------
  const summary = ref(null)      // { total_orders, total_revenue, total_books_sold, average_order_value }
  const breakdown = ref([])      // rows: per book / per category, depends on backend shape
  const loading = ref(false)
  const error = ref(null)

  async function fetchReport() {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/admin/reports', {
        params: {
          start_date: filters.value.start_date,
          end_date: filters.value.end_date,
        },
      })
      summary.value = data.summary ?? null
      breakdown.value = data.breakdown ?? data.data ?? []
    } catch (err) {
      error.value = err?.response?.data?.message ?? 'Gagal memuat laporan.'
    } finally {
      loading.value = false
    }
  }

  function applyFilters() {
    fetchReport()
  }

  function setPreset(preset) {
    const now = new Date()
    let start
    const end = now

    if (preset === 'today') {
      start = now
    } else if (preset === '7days') {
      start = new Date(now)
      start.setDate(start.getDate() - 6)
    } else if (preset === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1)
    } else if (preset === 'year') {
      start = new Date(now.getFullYear(), 0, 1)
    } else {
      return
    }

    filters.value.start_date = toDateInput(start)
    filters.value.end_date = toDateInput(end)
    fetchReport()
  }

  onMounted(() => fetchReport())

  // ---------- Download ----------
  const downloading = ref(false)
  const downloadError = ref(null)

  async function downloadReport(format = 'pdf') {
    downloading.value = true
    downloadError.value = null
    try {
      const response = await api.get('/admin/reports/download', {
        params: {
          start_date: filters.value.start_date,
          end_date: filters.value.end_date,
          format,
        },
        responseType: 'blob',
      })

      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      const extension = format === 'excel' ? 'xlsx' : 'pdf'
      link.href = url
      link.download = `laporan-${filters.value.start_date}-${filters.value.end_date}.${extension}`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      downloadError.value = err?.response?.data?.message ?? 'Gagal mengunduh laporan.'
    } finally {
      downloading.value = false
    }
  }

  // ---------- Format helpers ----------
  function formatCurrency(value) {
    if (value === null || value === undefined) return '-'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  function formatNumber(value) {
    if (value === null || value === undefined) return '-'
    return new Intl.NumberFormat('id-ID').format(value)
  }

  function formatDate(value) {
    if (!value) return '-'
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value))
  }

  return {
    // filters
    filters,
    applyFilters,
    setPreset,
    // data
    summary,
    breakdown,
    loading,
    error,
    fetchReport,
    // download
    downloading,
    downloadError,
    downloadReport,
    // helpers
    formatCurrency,
    formatNumber,
    formatDate,
  }
}