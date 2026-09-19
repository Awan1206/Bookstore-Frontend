<script setup>
import { useCartStore } from '@/stores/cart'
import { useCheckout } from '@/composables/checkout/useCheckout'

defineProps({
  show: { type: Boolean, required: true },
})

const emit = defineEmits(['close', 'back'])

const cartStore = useCartStore()
const { isSubmitting, error, completedOrder, qrCode, submitCheckout, reset } = useCheckout()

function handleClose() {
  reset()
  emit('close')
}

function handleBack() {
  reset()
  emit('back')
}

function formatPrice(value) {
  return new Intl.NumberFormat('id-ID').format(value ?? 0)
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/60 backdrop-blur-xs z-[60] flex justify-end"
      @click.self="handleClose"
    >
      <transition name="slide-right" appear>
        <div class="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">

          <!-- ── QR / SUCCESS STATE ───────────────────────────────── -->
          <template v-if="completedOrder">

            <!-- Header -->
            <div class="flex justify-between items-center px-6 py-5 border-b border-[#E8E3DA] shrink-0">
              <div>
                <h3 class="font-serif font-bold text-xl text-[#1C1917]">Tunjukkan ke Kasir</h3>
                <p class="text-xs text-[#78716C] mt-0.5">Scan QR untuk konfirmasi pembayaran</p>
              </div>
              <button
                type="button"
                aria-label="Tutup"
                class="w-8 h-8 flex items-center justify-center rounded-full text-[#78716C] hover:bg-[#F4F0E8] transition-colors"
                @click="handleClose"
              >
                ✕
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center gap-6">

              <!-- QR Code -->
              <div class="bg-white border-2 border-[#E8E3DA] rounded-2xl p-4 shadow-md">
                <img
                  :src="qrCode"
                  :alt="`QR Code ${completedOrder.order_code}`"
                  class="w-52 h-52"
                />
              </div>

              <!-- Order code badge -->
              <div class="text-center">
                <p class="text-[10px] uppercase tracking-widest text-[#A8A29E] mb-1">Kode Pesanan</p>
                <span class="font-mono font-bold text-2xl text-[#1C1917] tracking-wider">
                  {{ completedOrder.order_code }}
                </span>
              </div>

              <!-- Status badge -->
              <span class="px-4 py-1.5 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider rounded-full">
                {{ completedOrder.status === 'pending' ? 'Menunggu Konfirmasi Kasir' : completedOrder.status }}
              </span>

              <!-- Order summary -->
              <div class="w-full bg-[#FAF8F5] border border-[#E8E3DA] rounded-xl overflow-hidden">
                <!-- Items -->
                <div class="divide-y divide-[#F0EBE1]">
                  <div
                    v-for="item in completedOrder.items"
                    :key="item.book_id"
                    class="flex justify-between items-center px-4 py-3"
                  >
                    <div>
                      <p class="text-xs font-semibold text-[#1C1917] line-clamp-1">{{ item.title }}</p>
                      <p class="text-[10px] text-[#78716C]">{{ item.quantity }} × Rp {{ formatPrice(item.price) }}</p>
                    </div>
                    <span class="text-xs font-bold text-[#1C1917] shrink-0 ml-3">
                      Rp {{ formatPrice(item.subtotal) }}
                    </span>
                  </div>
                </div>

                <!-- Total -->
                <div class="flex justify-between items-center px-4 py-3 border-t border-[#E8E3DA] bg-white">
                  <span class="text-sm font-bold text-[#1C1917]">Total Pembayaran</span>
                  <span class="font-serif font-bold text-lg text-[#8B331A]">
                    Rp {{ formatPrice(completedOrder.total_amount) }}
                  </span>
                </div>
              </div>

              <!-- Instructions -->
              <div class="w-full bg-blue-50 border border-blue-100 rounded-xl px-4 py-4 space-y-2">
                <p class="text-xs font-bold text-blue-800">Cara Pembayaran:</p>
                <ol class="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Tunjukkan QR code ini ke kasir</li>
                  <li>Kasir akan scan dan memproses pesanan</li>
                  <li>Lakukan pembayaran tunai sesuai total</li>
                  <li>Kasir mengkonfirmasi dan pesanan selesai</li>
                </ol>
              </div>

            </div>

            <!-- Footer -->
            <div class="px-6 py-5 border-t border-[#E8E3DA] bg-[#FAF8F5] shrink-0">
              <button
                type="button"
                class="w-full py-3 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest rounded-xs hover:bg-[#8B331A] transition-colors"
                @click="handleClose"
              >
                Selesai
              </button>
            </div>

          </template>

          <!-- ── CONFIRM STATE (before checkout) ─────────────────── -->
          <template v-else>

            <!-- Header -->
            <div class="flex items-center gap-3 px-6 py-5 border-b border-[#E8E3DA] shrink-0">
              <button
                type="button"
                aria-label="Kembali ke keranjang"
                class="w-8 h-8 flex items-center justify-center rounded-full text-[#78716C] hover:bg-[#F4F0E8] transition-colors"
                @click="handleBack"
              >
                ←
              </button>
              <div>
                <h3 class="font-serif font-bold text-xl text-[#1C1917]">Konfirmasi Pesanan</h3>
                <p class="text-xs text-[#78716C] mt-0.5">Periksa pesanan sebelum checkout</p>
              </div>
              <button
                type="button"
                aria-label="Tutup"
                class="ml-auto w-8 h-8 flex items-center justify-center rounded-full text-[#78716C] hover:bg-[#F4F0E8] transition-colors"
                @click="handleClose"
              >
                ✕
              </button>
            </div>

            <!-- Order summary -->
            <div class="flex-1 overflow-y-auto px-6 py-6 space-y-6">

              <div>
                <h4 class="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E] mb-3">
                  Ringkasan Pesanan
                </h4>
                <div class="divide-y divide-[#F0EBE1] border border-[#E8E3DA] rounded-lg overflow-hidden">
                  <div
                    v-for="item in cartStore.items"
                    :key="item.id"
                    class="flex items-center gap-3 px-4 py-3 bg-white"
                  >
                    <!-- Thumbnail -->
                    <div class="shrink-0 w-9 h-12 rounded overflow-hidden bg-[#1B3B2B] flex items-center justify-center">
                      <img
                        v-if="item.image_url"
                        :src="item.image_url"
                        :alt="item.title"
                        class="w-full h-full object-cover"
                      />
                      <span v-else class="font-serif font-bold text-white text-xs select-none">F</span>
                    </div>

                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-semibold text-[#1C1917] line-clamp-1">{{ item.title }}</p>
                      <p class="text-[10px] text-[#78716C] mt-0.5">
                        {{ item.quantity }} × Rp {{ formatPrice(item.price) }}
                      </p>
                    </div>

                    <span class="text-xs font-bold text-[#1C1917] shrink-0">
                      Rp {{ formatPrice(item.subtotal) }}
                    </span>
                  </div>

                  <!-- Total -->
                  <div class="flex justify-between items-center px-4 py-3 bg-[#FAF8F5]">
                    <span class="text-xs font-bold text-[#1C1917]">Total</span>
                    <span class="font-serif font-bold text-base text-[#8B331A]">
                      Rp {{ formatPrice(cartStore.total) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Cash payment notice -->
              <div class="bg-[#FAF8F5] border border-[#E8E3DA] rounded-xl px-4 py-4 flex gap-3">
                <div class="shrink-0 w-8 h-8 rounded-full bg-[#1C1917] flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-[#1C1917]">Pembayaran Tunai</p>
                  <p class="text-[11px] text-[#78716C] mt-0.5 leading-relaxed">
                    Setelah checkout, Anda akan mendapatkan QR code. Tunjukkan ke kasir dan bayar tunai di tempat.
                  </p>
                </div>
              </div>

              <!-- Error -->
              <div v-if="error" class="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-xs text-red-700">{{ error }}</p>
              </div>

            </div>

            <!-- Footer -->
            <div class="px-6 py-5 border-t border-[#E8E3DA] bg-[#FAF8F5] shrink-0">
              <button
                type="button"
                :disabled="isSubmitting"
                class="w-full py-3.5 bg-[#8B331A] text-white text-xs font-bold uppercase tracking-widest rounded-xs transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#722813]"
                @click="submitCheckout"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Memproses...
                </span>
                <span v-else>Checkout & Dapatkan QR Code →</span>
              </button>
            </div>

          </template>

        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }
</style>