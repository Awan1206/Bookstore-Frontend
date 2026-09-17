// src/composables/admin/useDashboard.js
import { ref, onMounted } from 'vue'
import api from '@/js/api'

export function useDashboard() {
  const loading = ref(false)
  const error = ref('')

  // ── Stat cards ────────────────────────────────────────────────────
  // Sesuaikan field (total_books, total_orders, dst) dengan response
  // aktual dari ReportController@index di backend.
  const stats = ref({
    total_books: 0,
    total_orders: 0,
    total_users: 0,
    total_revenue: 0,
  })

  async function fetchStats() {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/admin/reports')
      // Merge supaya field yang tidak dikirim backend tetap punya default 0
      stats.value = { ...stats.value, ...data }
    } catch (err) {
      error.value = 'Gagal memuat data statistik.'
      console.error('[useDashboard] fetchStats error:', err)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchStats)

  return { stats, loading, error, fetchStats }
}