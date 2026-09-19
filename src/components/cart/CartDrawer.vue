<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  show: { type: Boolean, required: true },
})

const emit = defineEmits(['close', 'open-checkout', 'require-login'])

const cartStore = useCartStore()
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isAuthenticated) cartStore.fetchCart()
})

function formatPrice(value) {
  return new Intl.NumberFormat('id-ID').format(value ?? 0)
}

function handleCheckout() {
  if (!authStore.isAuthenticated) {
    emit('require-login')
    return
  }
  emit('open-checkout')
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-end"
      @click.self="emit('close')"
    >
      <transition name="slide-right" appear>
        <div class="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">

          <!-- Header -->
          <div class="flex justify-between items-center px-6 py-5 border-b border-[#E8E3DA] shrink-0">
            <div>
              <h3 class="font-serif font-bold text-xl text-[#1C1917]">Keranjang Belanja</h3>
              <p v-if="cartStore.count > 0" class="text-xs text-[#78716C] mt-0.5">
                {{ cartStore.count }} judul dipilih
              </p>
            </div>
            <button
              type="button"
              aria-label="Tutup keranjang"
              class="w-8 h-8 flex items-center justify-center rounded-full text-[#78716C] hover:bg-[#F4F0E8] hover:text-[#1C1917] transition-colors"
              @click="emit('close')"
            >
              ✕
            </button>
          </div>

          <!-- Loading -->
          <div v-if="cartStore.isLoading" class="flex-1 flex items-center justify-center text-sm text-[#78716C]">
            <svg class="w-5 h-5 animate-spin mr-2 text-[#8B331A]" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Memuat keranjang...
          </div>

          <!-- Error -->
          <div v-else-if="cartStore.error" class="flex-1 flex flex-col items-center justify-center px-6 gap-3">
            <p class="text-sm text-red-600 text-center">{{ cartStore.error }}</p>
            <button
              type="button"
              class="text-xs font-semibold text-[#8B331A] hover:underline"
              @click="cartStore.fetchCart"
            >
              Coba lagi
            </button>
          </div>

          <!-- Empty -->
          <div
            v-else-if="cartStore.items.length === 0"
            class="flex-1 flex flex-col items-center justify-center text-[#78716C] px-6"
          >
            <svg class="w-14 h-14 text-[#DDD8CE] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p class="text-sm font-medium text-[#1C1917]">Keranjang masih kosong</p>
            <p class="text-xs text-[#A8A29E] mt-1 text-center">Tambahkan buku dari katalog untuk mulai berbelanja.</p>
          </div>

          <!-- Items list -->
          <!-- Item shape: { id, book_id, title, price, quantity, subtotal, image_url } -->
          <div v-else class="flex-1 overflow-y-auto divide-y divide-[#F0EBE1]">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="px-6 py-4 flex items-start gap-4"
            >
              <!-- Cover thumbnail -->
              <div class="shrink-0 w-14 h-[72px] rounded overflow-hidden bg-[#1B3B2B] flex items-center justify-center">
                <img
                  v-if="item.image_url"
                  :src="item.image_url"
                  :alt="item.title"
                  class="w-full h-full object-cover"
                />
                <span v-else class="font-serif font-bold text-white text-lg select-none">F</span>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h4 class="font-serif font-bold text-sm text-[#1C1917] line-clamp-2 leading-snug">
                  {{ item.title }}
                </h4>
                <p class="text-xs font-semibold text-[#8B331A] mt-1">
                  Rp {{ formatPrice(item.price) }} / buku
                </p>

                <!-- Quantity controls -->
                <div class="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    class="w-6 h-6 rounded border border-[#E8E3DA] text-[#44403C] hover:bg-[#F4F0E8] text-sm flex items-center justify-center transition-colors disabled:opacity-40"
                    :disabled="cartStore.isLoading"
                    @click="cartStore.updateItem(item.id, item.quantity - 1)"
                  >
                    −
                  </button>
                  <span class="text-xs font-semibold text-[#1C1917] w-5 text-center">
                    {{ item.quantity }}
                  </span>
                  <button
                    type="button"
                    class="w-6 h-6 rounded border border-[#E8E3DA] text-[#44403C] hover:bg-[#F4F0E8] text-sm flex items-center justify-center transition-colors disabled:opacity-40"
                    :disabled="cartStore.isLoading"
                    @click="cartStore.updateItem(item.id, item.quantity + 1)"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Subtotal + remove -->
              <div class="shrink-0 flex flex-col items-end gap-2">
                <span class="text-sm font-bold text-[#1C1917]">
                  Rp {{ formatPrice(item.subtotal) }}
                </span>
                <button
                  type="button"
                  class="text-[10px] text-red-500 hover:text-red-700 hover:underline transition-colors"
                  @click="cartStore.removeItem(item.id)"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            v-if="cartStore.items.length > 0"
            class="px-6 py-5 border-t border-[#E8E3DA] bg-[#FAF8F5] shrink-0 space-y-4"
          >
            <div class="flex justify-between items-center">
              <span class="text-sm text-[#44403C]">Subtotal</span>
              <span class="font-serif font-bold text-lg text-[#1C1917]">
                Rp {{ formatPrice(cartStore.total) }}
              </span>
            </div>
            <p class="text-[10px] text-[#A8A29E]">Ongkos kirim dihitung pada langkah berikutnya.</p>
            <button
              type="button"
              class="w-full py-3.5 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest rounded-xs hover:bg-[#8B331A] transition-colors active:scale-[0.98]"
              @click="handleCheckout"
            >
              Lanjutkan ke Checkout →
            </button>
          </div>

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