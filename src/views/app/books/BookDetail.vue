<script setup>
import { useBookDetail } from '@/composables/app/books/useBookDetail'

const {
  book,
  isLoading,
  error,
  quantity,
  formattedPrice,
  isOutOfStock,
  maxQty,
  fetchBook,
  decrementQty,
  incrementQty,
  handleAddToCart,
  goBack,
} = useBookDetail()
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5] text-[#1C1917]">

    <!-- Breadcrumb / Back -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
      <button
        type="button"
        class="inline-flex items-center gap-2 text-xs text-[#78716C] hover:text-[#1C1917] transition-colors"
        @click="goBack"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Catalog
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center text-sm text-[#78716C]">
      Loading book details...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <p class="text-sm text-red-700">{{ error }}</p>
      <button
        type="button"
        class="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1C1917] text-white rounded hover:bg-[#8B331A] transition-colors"
        @click="fetchBook"
      >
        Try Again
      </button>
    </div>

    <!-- Content -->
    <main v-else-if="book" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

        <!-- LEFT: Cover -->
        <div class="lg:col-span-5">
          <div class="sticky top-8">
            <div class="aspect-[3/4] rounded-xl overflow-hidden bg-[#EFECE6] border border-[#E2DDD3] shadow-lg flex items-center justify-center">
              <img
                v-if="book.image_url"
                :src="book.image_url"
                :alt="`Cover of ${book.title}`"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex flex-col justify-between p-10"
                :style="{ background: 'linear-gradient(160deg, #1B3B2B 0%, #0F2118 100%)' }"
              >
                <div class="text-[10px] font-mono uppercase tracking-widest text-white/40">
                  {{ book.category.name }}
                </div>
                <div class="text-center">
                  <div class="w-8 h-px bg-white/20 mx-auto mb-6"></div>
                  <h2 class="font-serif text-2xl text-white leading-snug">{{ book.title }}</h2>
                  <div class="w-8 h-px bg-white/20 mx-auto mt-6"></div>
                </div>
                <div class="text-[10px] font-mono uppercase tracking-widest text-white/40 text-right">
                  FOLIO PRESS
                </div>
              </div>
            </div>

            <p class="text-center text-[11px] text-[#A8A29E] mt-3 tracking-wide">
              {{ book.publish_year }} Edition · {{ book.category.name }}
            </p>
          </div>
        </div>

        <!-- RIGHT: Info -->
        <div class="lg:col-span-7 space-y-8">

          <!-- Title -->
          <h1 class="font-serif text-4xl sm:text-5xl text-[#1C1917] leading-tight tracking-tight">
            {{ book.title }}
          </h1>

          <!-- Description -->
          <p class="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-prose font-sans">
            {{ book.description }}
          </p>

          <!-- Metadata table -->
          <div class="border border-[#E8E3DA] rounded-xl overflow-hidden">
            <table class="w-full text-sm">
              <tbody class="divide-y divide-[#F0EBE1]">
                <tr class="grid grid-cols-2">
                  <td class="px-5 py-3.5 text-xs text-[#A8A29E] font-medium uppercase tracking-wider bg-[#FDFCFA]">Publisher</td>
                  <td class="px-5 py-3.5 text-xs font-semibold text-[#1C1917] text-right">Folio Press</td>
                </tr>
                <tr class="grid grid-cols-2">
                  <td class="px-5 py-3.5 text-xs text-[#A8A29E] font-medium uppercase tracking-wider bg-[#FDFCFA]">Publication Year</td>
                  <td class="px-5 py-3.5 text-xs font-semibold text-[#1C1917] text-right">{{ book.publish_year }}</td>
                </tr>
                <tr class="grid grid-cols-2">
                  <td class="px-5 py-3.5 text-xs text-[#A8A29E] font-medium uppercase tracking-wider bg-[#FDFCFA]">Category</td>
                  <td class="px-5 py-3.5 text-xs font-semibold text-[#1C1917] text-right">{{ book.category.name }}</td>
                </tr>
                <tr class="grid grid-cols-2">
                  <td class="px-5 py-3.5 text-xs text-[#A8A29E] font-medium uppercase tracking-wider bg-[#FDFCFA]">Availability</td>
                  <td
                    class="px-5 py-3.5 text-xs font-semibold text-right"
                    :class="isOutOfStock ? 'text-red-600' : 'text-emerald-700'"
                  >
                    {{ isOutOfStock ? 'Out of Stock' : `${book.stock} copies left` }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Price + Purchase -->
          <div class="bg-white border border-[#E8E3DA] rounded-xl p-6 space-y-5">

            <div class="flex items-baseline justify-between">
              <div>
                <span class="font-serif text-3xl font-bold text-[#1C1917]">{{ formattedPrice }}</span>
                <span class="block text-[11px] text-[#A8A29E] mt-0.5">Price includes packaging</span>
              </div>
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                :class="isOutOfStock ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="isOutOfStock ? 'bg-red-500' : 'bg-emerald-500'"></span>
                {{ isOutOfStock ? 'Out of Stock' : 'In Stock' }}
              </span>
            </div>

            <p v-if="!isOutOfStock && book.stock <= 5" class="text-[11px] text-amber-700 font-medium">
              Only {{ book.stock }} copies remaining in archive
            </p>

            <div class="flex items-center gap-3">
              <!-- Quantity picker -->
              <div class="flex items-center border border-[#E8E3DA] rounded-lg overflow-hidden">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  class="w-9 h-10 flex items-center justify-center text-[#44403C] hover:bg-[#F5F2EC] transition-colors disabled:opacity-30"
                  :disabled="quantity <= 1 || isOutOfStock"
                  @click="decrementQty"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="w-10 text-center text-sm font-semibold text-[#1C1917] select-none">{{ quantity }}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  class="w-9 h-10 flex items-center justify-center text-[#44403C] hover:bg-[#F5F2EC] transition-colors disabled:opacity-30"
                  :disabled="quantity >= maxQty || isOutOfStock"
                  @click="incrementQty"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <!-- Add to cart -->
              <button
                type="button"
                class="flex-1 h-10 flex items-center justify-center gap-2 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#8B331A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="isOutOfStock"
                @click="handleAddToCart"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {{ isOutOfStock ? 'Out of Stock' : 'Add to Cart' }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>

  </div>
</template>