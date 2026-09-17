<script setup>
import { useReportsPage } from '@/composables/admin/useReport'

const {
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
} = useReportsPage()
</script>

<template>
  <div class="p-6 lg:p-8 space-y-8">

    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">MANAJEMEN</p>
        <h2 class="text-2xl font-serif font-bold text-[#1C1917] mt-0.5">Laporan Penjualan</h2>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          :disabled="downloading || loading"
          class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#44403C] bg-white border border-[#E8E3DA] rounded-lg hover:bg-[#F5F2EC] transition-colors disabled:opacity-50"
          @click="downloadReport('excel')"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
          </svg>
          <span>Excel</span>
        </button>
        <button
          type="button"
          :disabled="downloading || loading"
          class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1C1917] text-white rounded-lg hover:bg-[#8B331A] transition-colors disabled:opacity-50"
          @click="downloadReport('pdf')"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
          </svg>
          <span>{{ downloading ? 'Mengunduh...' : 'Unduh PDF' }}</span>
        </button>
      </div>
    </div>

    <!-- Error banners -->
    <div
      v-if="error && !loading"
      class="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700"
    >
      <span>{{ error }}</span>
      <button type="button" class="ml-4 font-bold hover:text-red-900" @click="fetchReport">
        Coba Lagi
      </button>
    </div>

    <div
      v-if="downloadError"
      class="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700"
    >
      <span>{{ downloadError }}</span>
    </div>

    <!-- Filters -->
    <div class="bg-white border border-[#E8E3DA] rounded-2xl p-5 space-y-4">
      <div class="flex flex-col lg:flex-row lg:items-end gap-4">
        <div>
          <label for="start-date" class="block text-xs font-semibold text-[#44403C] mb-1.5">
            Dari Tanggal
          </label>
          <input
            id="start-date"
            v-model="filters.start_date"
            type="date"
            class="px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
          >
        </div>
        <div>
          <label for="end-date" class="block text-xs font-semibold text-[#44403C] mb-1.5">
            Sampai Tanggal
          </label>
          <input
            id="end-date"
            v-model="filters.end_date"
            type="date"
            class="px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
          >
        </div>
        <button
          type="button"
          :disabled="loading"
          class="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1C1917] text-white rounded-lg hover:bg-[#8B331A] transition-colors disabled:opacity-50 self-start"
          @click="applyFilters"
        >
          Terapkan
        </button>
      </div>

      <!-- Quick presets -->
      <div class="flex flex-wrap items-center gap-2 pt-3 border-t border-[#F0EBE1]">
        <span class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] mr-1">CEPAT:</span>
        <button
          type="button"
          class="px-3 py-1 text-xs font-semibold text-[#44403C] bg-[#F5F2EC] rounded-full hover:bg-[#F0EBE1] transition-colors"
          @click="setPreset('today')"
        >
          Hari Ini
        </button>
        <button
          type="button"
          class="px-3 py-1 text-xs font-semibold text-[#44403C] bg-[#F5F2EC] rounded-full hover:bg-[#F0EBE1] transition-colors"
          @click="setPreset('7days')"
        >
          7 Hari Terakhir
        </button>
        <button
          type="button"
          class="px-3 py-1 text-xs font-semibold text-[#44403C] bg-[#F5F2EC] rounded-full hover:bg-[#F0EBE1] transition-colors"
          @click="setPreset('month')"
        >
          Bulan Ini
        </button>
        <button
          type="button"
          class="px-3 py-1 text-xs font-semibold text-[#44403C] bg-[#F5F2EC] rounded-full hover:bg-[#F0EBE1] transition-colors"
          @click="setPreset('year')"
        >
          Tahun Ini
        </button>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-[#E8E3DA] rounded-2xl p-5">
        <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">Total Pesanan</p>
        <p class="text-2xl font-serif font-bold text-[#1C1917] mt-1">
          <span v-if="loading" class="inline-block h-7 w-16 bg-[#F0EBE1] rounded animate-pulse"></span>
          <span v-else>{{ formatNumber(summary?.total_orders) }}</span>
        </p>
      </div>
      <div class="bg-white border border-[#E8E3DA] rounded-2xl p-5">
        <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">Total Pendapatan</p>
        <p class="text-2xl font-serif font-bold text-[#1C1917] mt-1">
          <span v-if="loading" class="inline-block h-7 w-24 bg-[#F0EBE1] rounded animate-pulse"></span>
          <span v-else>{{ formatCurrency(summary?.total_revenue) }}</span>
        </p>
      </div>
      <div class="bg-white border border-[#E8E3DA] rounded-2xl p-5">
        <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">Buku Terjual</p>
        <p class="text-2xl font-serif font-bold text-[#1C1917] mt-1">
          <span v-if="loading" class="inline-block h-7 w-16 bg-[#F0EBE1] rounded animate-pulse"></span>
          <span v-else>{{ formatNumber(summary?.total_books_sold) }}</span>
        </p>
      </div>
      <div class="bg-white border border-[#E8E3DA] rounded-2xl p-5">
        <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">Rata-rata / Pesanan</p>
        <p class="text-2xl font-serif font-bold text-[#1C1917] mt-1">
          <span v-if="loading" class="inline-block h-7 w-20 bg-[#F0EBE1] rounded animate-pulse"></span>
          <span v-else>{{ formatCurrency(summary?.average_order_value) }}</span>
        </p>
      </div>
    </div>

    <!-- Breakdown table -->
    <div class="bg-white border border-[#E8E3DA] rounded-2xl overflow-hidden shadow-sm">
      <div class="px-6 py-4 border-b border-[#E8E3DA] bg-[#F5F2EC]">
        <h3 class="text-sm font-serif font-bold text-[#1C1917]">Rincian Penjualan</h3>
      </div>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-[#E8E3DA]">
            <th class="text-left px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] font-semibold w-12">
              No
            </th>
            <th class="text-left px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] font-semibold">
              Judul Buku
            </th>
            <th class="text-left px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] font-semibold">
              Kategori
            </th>
            <th class="text-right px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] font-semibold">
              Qty Terjual
            </th>
            <th class="text-right px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] font-semibold">
              Pendapatan
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#F0EBE1]">
          <!-- Loading skeleton -->
          <template v-if="loading">
            <tr v-for="n in 5" :key="`skeleton-${n}`">
              <td class="px-6 py-4"><div class="h-4 w-6 bg-[#F0EBE1] rounded animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 w-40 bg-[#F0EBE1] rounded animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 w-24 bg-[#F0EBE1] rounded animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 w-10 bg-[#F0EBE1] rounded animate-pulse ml-auto"></div></td>
              <td class="px-6 py-4"><div class="h-4 w-20 bg-[#F0EBE1] rounded animate-pulse ml-auto"></div></td>
            </tr>
          </template>

          <!-- Empty state -->
          <tr v-else-if="breakdown.length === 0">
            <td colspan="5" class="px-6 py-12 text-center">
              <p class="text-sm text-[#78716C]">Tidak ada data penjualan pada rentang tanggal ini.</p>
            </td>
          </tr>

          <!-- Rows -->
          <tr
            v-for="(row, index) in breakdown"
            v-else
            :key="row.book_id ?? index"
            class="hover:bg-[#F5F2EC]/60 transition-colors"
          >
            <td class="px-6 py-4 text-[#A8A29E] text-sm tabular-nums">
              {{ index + 1 }}
            </td>
            <td class="px-6 py-4">
              <p class="font-semibold text-[#1C1917]">{{ row.book_title ?? row.title }}</p>
            </td>
            <td class="px-6 py-4 text-[#44403C]">
              {{ row.category_name ?? row.category ?? '-' }}
            </td>
            <td class="px-6 py-4 text-right text-[#44403C] tabular-nums">
              {{ formatNumber(row.quantity_sold ?? row.qty) }}
            </td>
            <td class="px-6 py-4 text-right font-semibold text-[#1C1917] tabular-nums">
              {{ formatCurrency(row.revenue ?? row.total) }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="!loading && breakdown.length > 0">
          <tr class="border-t border-[#E8E3DA] bg-[#F5F2EC]">
            <td colspan="3" class="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#44403C]">
              Total
            </td>
            <td class="px-6 py-3 text-right text-xs font-bold text-[#1C1917] tabular-nums">
              {{ formatNumber(summary?.total_books_sold) }}
            </td>
            <td class="px-6 py-3 text-right text-xs font-bold text-[#1C1917] tabular-nums">
              {{ formatCurrency(summary?.total_revenue) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

  </div>
</template>