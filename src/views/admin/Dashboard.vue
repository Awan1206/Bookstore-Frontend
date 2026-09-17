<script setup>
import { computed } from 'vue'  // ← tambah computed
import { useRouter } from 'vue-router'  // ← tambah ini
import { useDashboard } from '@/composables/admin/useDashboard'

const { stats, loading, error, fetchStats } = useDashboard()
const router = useRouter()  // ← tambah ini

function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(value ?? 0)
}

function formatCurrency(value) {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(value ?? 0)
}

const cards = [
  {
    key: 'total_books',
    label: 'Total Buku',
    sublabel: 'Koleksi katalog aktif',
    format: formatNumber,
    color: 'bg-[#1B3B2B]',
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  {
    key: 'total_orders',
    label: 'Total Pesanan',
    sublabel: 'Semua status pesanan',
    format: formatNumber,
    color: 'bg-[#3B2C1B]',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  },
  {
    key: 'total_users',
    label: 'Total Pengguna',
    sublabel: 'Member terdaftar',
    format: formatNumber,
    color: 'bg-[#1B2C3B]',
    iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    key: 'total_revenue',
    label: 'Total Pendapatan',
    sublabel: 'Dari pesanan selesai',
    format: formatCurrency,
    color: 'bg-[#8B331A]',
    iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
]

const quickLinks = computed(() =>
  [
    { name: 'admin.books',      label: 'Buku',      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'admin.categories', label: 'Kategori',  icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z' },
    { name: 'admin.orders',     label: 'Pesanan',   icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'admin.users',      label: 'Pengguna',  icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'admin.reports',    label: 'Laporan',   icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'admin.chats',      label: 'Live Chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  ].filter(link => router.hasRoute(link.name))
)
</script>

<template>
  <div class="p-6 lg:p-8 space-y-8">

    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">OVERVIEW</p>
        <h2 class="text-2xl font-serif font-bold text-[#1C1917] mt-0.5">Dashboard</h2>
      </div>

      <button
        type="button"
        :disabled="loading"
        class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1C1917] text-white rounded-lg hover:bg-[#8B331A] transition-colors disabled:opacity-50 self-start sm:self-auto"
        @click="fetchStats"
      >
        <svg
          class="w-3.5 h-3.5"
          :class="loading ? 'animate-spin' : ''"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>{{ loading ? 'Memuat...' : 'Refresh' }}</span>
      </button>
    </div>

    <!-- Error banner -->
    <div
      v-if="error"
      class="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700"
    >
      <span>{{ error }}</span>
      <button
        type="button"
        class="ml-4 font-bold hover:text-red-900"
        @click="fetchStats"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <div
        v-for="card in cards"
        :key="card.key"
        class="bg-white border border-[#E8E3DA] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between gap-6"
      >
        <!-- Top: icon + label -->
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">
              {{ card.sublabel }}
            </p>
            <p class="text-sm font-semibold text-[#44403C] mt-0.5">{{ card.label }}</p>
          </div>
          <div :class="[card.color, 'w-10 h-10 rounded-xl flex items-center justify-center shrink-0']">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="card.iconPath" />
            </svg>
          </div>
        </div>

        <!-- Bottom: value -->
        <div>
          <!-- Skeleton saat loading -->
          <div v-if="loading" class="h-8 w-32 bg-[#F0EBE1] rounded-md animate-pulse"></div>
          <p v-else class="text-2xl font-serif font-bold text-[#1C1917] tracking-tight">
            {{ card.format(stats[card.key]) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div>
      <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] mb-4">AKSES CEPAT</p>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <RouterLink
          v-for="link in quickLinks"
          :key="link.name"
          :to="{ name: link.name }"
          class="flex flex-col items-center gap-2 p-4 bg-white border border-[#E8E3DA] rounded-xl hover:border-[#1C1917] hover:shadow-sm transition-all group"
        >
          <div class="w-9 h-9 bg-[#F5F2EC] rounded-lg flex items-center justify-center group-hover:bg-[#1C1917] transition-colors">
            <svg class="w-4.5 h-4.5 text-[#78716C] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="link.icon" />
            </svg>
          </div>
          <span class="text-[11px] font-semibold text-[#44403C] group-hover:text-[#1C1917]">{{ link.label }}</span>
        </RouterLink>
      </div>
    </div>

  </div>
</template>