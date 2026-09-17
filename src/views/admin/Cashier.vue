<script setup>
import { useCashierPage } from '@/composables/admin/useCashier'

const {
  // order
  order,
  loadingOrder,
  orderError,
  clearOrder,
  // confirm (cash payment)
  cashReceived,
  changePreview,
  processing,
  actionError,
  actionSuccess,
  confirmOrder,
  completeOrder,
  // manual entry
  manualCode,
  submitManualCode,
  // camera scanner
  scannerActive,
  scannerError,
  videoRef,
  canvasRef,
  startCameraScanner,
  stopCameraScanner,
  // hardware scanner
  hardwareScannerListening,
  startHardwareScanner,
  stopHardwareScanner,
  // helpers
  formatCurrency,
  formatDate,
  statusLabel,
} = useCashierPage()
</script>

<template>
  <div class="p-6 lg:p-8 space-y-8">

    <!-- Page header -->
    <div>
      <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">MANAJEMEN</p>
      <h2 class="text-2xl font-serif font-bold text-[#1C1917] mt-0.5">Kasir</h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- ── Left: Scan panel ─────────────────────────────────────── -->
      <div class="bg-white border border-[#E8E3DA] rounded-2xl p-5 space-y-5">
        <div>
          <h3 class="text-sm font-serif font-bold text-[#1C1917]">Pindai QR Pesanan</h3>
          <p class="text-xs text-[#78716C] mt-1">
            Pindai QR code dari pengguna untuk membuka detail pesanan mereka.
          </p>
        </div>

        <!-- Mode: Camera scan / Hardware scanner -->
        <div class="flex flex-wrap gap-2">
          <button
            v-if="!scannerActive"
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1C1917] text-white rounded-lg hover:bg-[#8B331A] transition-colors"
            @click="startCameraScanner"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Buka Kamera (Uji Coba)</span>
          </button>
          <button
            v-else
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#44403C] bg-white border border-[#E8E3DA] rounded-lg hover:bg-[#F5F2EC] transition-colors"
            @click="stopCameraScanner"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Tutup Kamera</span>
          </button>

          <button
            v-if="!hardwareScannerListening"
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#44403C] bg-white border border-[#E8E3DA] rounded-lg hover:bg-[#F5F2EC] transition-colors"
            @click="startHardwareScanner"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M4 7a2 2 0 012-2h12a2 2 0 012 2M4 7l8 6 8-6" />
            </svg>
            <span>Aktifkan Scanner Fisik</span>
          </button>
          <button
            v-else
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            @click="stopHardwareScanner"
          >
            <span class="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
            <span>Scanner Fisik Aktif — Klik untuk Nonaktifkan</span>
          </button>
        </div>

        <!-- Camera preview -->
        <div v-if="scannerActive" class="space-y-2">
          <div class="relative rounded-xl overflow-hidden border border-[#E8E3DA] bg-black">
            <video
              ref="videoRef"
              class="w-full aspect-square object-cover"
              muted
              playsinline
              autoplay
            ></video>
            <!-- Scan frame overlay -->
            <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div class="w-2/3 aspect-square border-2 border-white/80 rounded-xl"></div>
            </div>
          </div>
          <!-- Hidden canvas used for jsQR frame analysis fallback -->
          <canvas ref="canvasRef" class="hidden"></canvas>
          <p class="text-[11px] text-[#A8A29E]">
            Arahkan kamera ke QR code pada layar/HP pengguna.
          </p>
        </div>
        <p v-if="scannerError" class="text-xs text-red-700">{{ scannerError }}</p>

        <!-- Hardware scanner note -->
        <div
          v-if="hardwareScannerListening"
          class="p-3 bg-[#F5F2EC] rounded-xl text-xs text-[#78716C]"
        >
          Mode ini menerima input dari scanner QR/barcode fisik (USB/Bluetooth) yang terhubung
          ke perangkat ini. Cukup pindai — kode pesanan akan otomatis dicari.
        </div>

        <!-- Manual entry fallback -->
        <div class="pt-4 border-t border-[#F0EBE1] space-y-2">
          <label for="manual-code" class="block text-xs font-semibold text-[#44403C]">
            Atau masukkan kode pesanan manual
          </label>
          <form class="flex gap-2" @submit.prevent="submitManualCode">
            <input
              id="manual-code"
              v-model="manualCode"
              type="text"
              placeholder="contoh: ORD-000001"
              class="flex-1 px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
            >
            <button
              type="submit"
              :disabled="!manualCode.trim() || loadingOrder"
              class="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1C1917] text-white rounded-lg hover:bg-[#8B331A] transition-colors disabled:opacity-50"
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      <!-- ── Right: Order detail panel ────────────────────────────── -->
      <div class="bg-white border border-[#E8E3DA] rounded-2xl p-5">

        <!-- Loading -->
        <div v-if="loadingOrder" class="space-y-3">
          <div class="h-5 w-40 bg-[#F0EBE1] rounded animate-pulse"></div>
          <div class="h-4 w-56 bg-[#F0EBE1] rounded animate-pulse"></div>
          <div class="h-4 w-32 bg-[#F0EBE1] rounded animate-pulse"></div>
        </div>

        <!-- Error -->
        <div v-else-if="orderError" class="flex flex-col items-start gap-3">
          <div class="flex items-center gap-2 text-red-700">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p class="text-sm">{{ orderError }}</p>
          </div>
          <button
            type="button"
            class="text-xs font-bold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
            @click="clearOrder"
          >
            Coba Lagi
          </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="!order" class="h-full flex flex-col items-center justify-center text-center py-12 gap-3">
          <svg class="w-10 h-10 text-[#E8E3DA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
          <p class="text-sm text-[#A8A29E]">Belum ada pesanan dipindai.</p>
        </div>

        <!-- Order details -->
        <div v-else class="space-y-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">PESANAN</p>
              <h3 class="text-lg font-serif font-bold text-[#1C1917] mt-0.5">
                {{ order.order_code }}
              </h3>
            </div>
            <span
              :class="[
                order.status === 'completed' ? 'bg-green-50 text-green-700' :
                order.status === 'paid' ? 'bg-[#F0EBE1] text-[#44403C]' :
                order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                'bg-amber-50 text-amber-700',
                'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap'
              ]"
            >
              {{ statusLabel(order.status) }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">Pelanggan</p>
              <p class="text-[#1C1917] font-semibold mt-0.5">{{ order.user?.name ?? '-' }}</p>
              <p class="text-[#A8A29E] text-xs">@{{ order.user?.username }}</p>
            </div>
            <div>
              <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">Dibuat</p>
              <p class="text-[#1C1917] mt-0.5">{{ formatDate(order.created_at) }}</p>
            </div>
          </div>

          <!-- Items -->
          <div v-if="order.items?.length" class="border-t border-[#F0EBE1] pt-4">
            <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] mb-2">Item</p>
            <ul class="space-y-2">
              <li
                v-for="item in order.items"
                :key="item.book_id"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-[#44403C]">
                  {{ item.title }} <span class="text-[#A8A29E]">×{{ item.quantity }}</span>
                </span>
                <span class="font-semibold text-[#1C1917]">{{ formatCurrency(item.subtotal) }}</span>
              </li>
            </ul>
          </div>

          <div class="flex items-center justify-between border-t border-[#F0EBE1] pt-4">
            <span class="text-xs font-bold uppercase tracking-wider text-[#44403C]">Total</span>
            <span class="text-lg font-serif font-bold text-[#1C1917]">{{ formatCurrency(order.total_amount) }}</span>
          </div>

          <!-- Payment info (once paid/completed) -->
          <div
            v-if="order.status === 'paid' || order.status === 'completed'"
            class="grid grid-cols-2 gap-4 text-sm border-t border-[#F0EBE1] pt-4"
          >
            <div>
              <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">Cash Diterima</p>
              <p class="text-[#1C1917] mt-0.5">{{ formatCurrency(order.cash_received) }}</p>
            </div>
            <div>
              <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">Kembalian</p>
              <p class="text-[#1C1917] mt-0.5">{{ formatCurrency(order.change_amount) }}</p>
            </div>
            <div v-if="order.confirmed_by" class="col-span-2">
              <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">Dikonfirmasi Oleh</p>
              <p class="text-[#1C1917] mt-0.5">{{ order.confirmed_by }} &middot; {{ formatDate(order.confirmed_at) }}</p>
            </div>
          </div>

          <!-- Cash payment form (only while pending) -->
          <div v-if="order.status === 'pending'" class="border-t border-[#F0EBE1] pt-4 space-y-3">
            <label for="cash-received" class="block text-xs font-semibold text-[#44403C]">
              Nominal Cash Diterima
            </label>
            <input
              id="cash-received"
              v-model="cashReceived"
              type="number"
              min="0"
              step="500"
              placeholder="0"
              class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
            >
            <p
              v-if="changePreview !== null"
              :class="changePreview < 0 ? 'text-red-700' : 'text-[#44403C]'"
              class="text-xs"
            >
              {{ changePreview < 0 ? 'Kurang' : 'Kembalian' }}:
              <span class="font-semibold">{{ formatCurrency(Math.abs(changePreview)) }}</span>
            </p>
          </div>

          <!-- Action feedback -->
          <p v-if="actionSuccess" class="text-xs text-green-700">{{ actionSuccess }}</p>
          <p v-if="actionError" class="text-xs text-red-700">{{ actionError }}</p>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-2">
            <button
              type="button"
              class="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
              @click="clearOrder"
            >
              Tutup
            </button>
            <button
              v-if="order.status === 'pending'"
              type="button"
              :disabled="processing || !cashReceived"
              class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1C1917] text-white rounded-lg hover:bg-[#8B331A] transition-colors disabled:opacity-50"
              @click="confirmOrder"
            >
              {{ processing ? 'Memproses...' : 'Konfirmasi Pembayaran' }}
            </button>
            <button
              v-if="order.status === 'paid'"
              type="button"
              :disabled="processing"
              class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1C1917] text-white rounded-lg hover:bg-[#8B331A] transition-colors disabled:opacity-50"
              @click="completeOrder"
            >
              {{ processing ? 'Memproses...' : 'Selesaikan Pesanan' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>