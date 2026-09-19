<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useExploreBooks } from '@/composables/app/books/useExploreBooks'
import AppNavbar from '@/components/ui/AppNavbar.vue'
import AppFooter from '@/components/ui/AppFooter.vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const showUserDropdown = ref(false)
const showChatDrawer = ref(false)

const {
  books,
  isLoading,
  error,
  searchQuery,
  activeCategoryId,
  meta,
  categories,
  stockSummary,
  fetchBooks,
  setCategory,
  handleSearch,
  formatPrice,
  stockLabel,
} = useExploreBooks()

function goTo(name, params) {
  if (router.hasRoute(name)) {
    router.push(params ? { name, params } : { name })
  } else {
    window.alert('This page is not available yet.')
  }
}

function goToDetail(id) {
  goTo('books.show', { id })
}
</script>

<template>
  <div class="min-h-screen bg-[#F5F2EC] text-[#1C1917]">

    <AppNavbar
      :auth-store="authStore"
      :cart-store="cartStore"
      :show-user-dropdown="showUserDropdown"
      :show-chat-drawer="showChatDrawer"
      @update:show-user-dropdown="showUserDropdown = $event"
      @update:show-chat-drawer="showChatDrawer = $event"
      @toggle-cart="() => {}"
      @go-to="goTo"
      @scroll-to-top="() => window.scrollTo({ top: 0, behavior: 'smooth' })"
      @logout="() => {}"
    />

    <!-- HEADER -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

        <!-- Left: Title block -->
        <div>
          <p class="text-[11px] font-semibold tracking-widest text-[#8B331A] mb-3">
            FOLIO INDEX / ARCHIVAL LIBRARY
          </p>
          <h1 class="font-serif text-5xl sm:text-6xl text-[#1C1917] leading-none tracking-tight">
            Explore Books.
          </h1>
          <p class="mt-4 text-sm text-[#57534E] leading-relaxed max-w-lg">
            Discover stories, ideas, and books worth keeping. Every title hand-selected from our curated archive.
          </p>
        </div>

        <!-- Right: Stock summary -->
        <div v-if="meta" class="flex items-center gap-6 text-xs text-[#78716C] shrink-0">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            In Stock ({{ stockSummary.inStock }})
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            Low Stock ({{ stockSummary.lowStock }})
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-red-400"></span>
            Out of Stock ({{ stockSummary.outOfStock }})
          </span>
          <span class="pl-4 border-l border-[#DCD5C9] font-medium text-[#1C1917]">
            {{ meta.total }} Titles
          </span>
        </div>
      </div>
    </div>

    <!-- SEARCH + FILTER BAR -->
    <div class="sticky top-20 z-20 bg-[#F5F2EC]/95 backdrop-blur-sm border-b border-[#E2DDD3]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

        <!-- Search -->
        <div class="relative flex-1 max-w-sm">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search by title..."
            class="w-full pl-9 pr-4 py-2 bg-white border border-[#E2DDD3] rounded-lg text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#8B331A] transition-colors"
            @keyup.enter="handleSearch"
          />
        </div>

        <!-- Category pills -->
        <div class="flex items-center gap-2 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-hide">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            :class="activeCategoryId === cat.id
              ? 'bg-[#1C1917] text-white border-[#1C1917]'
              : 'bg-white text-[#44403C] border-[#E2DDD3] hover:border-[#1C1917] hover:text-[#1C1917]'"
            class="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
            @click="setCategory(cat.id)"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Loading -->
      <div v-if="isLoading" class="py-32 text-center text-sm text-[#78716C]">
        Loading collection...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="py-32 text-center">
        <p class="text-sm text-red-700">{{ error }}</p>
        <button
          type="button"
          class="mt-4 px-4 py-2 text-xs font-semibold bg-[#1C1917] text-white rounded hover:bg-[#8B331A] transition-colors"
          @click="fetchBooks"
        >
          Try Again
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="books.length === 0" class="py-32 text-center">
        <p class="text-sm text-[#78716C]">No books found.</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <article
          v-for="book in books"
          :key="book.id"
          class="bg-white border border-[#E8E3DA] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col cursor-pointer"
          @click="goToDetail(book.id)"
        >
          <!-- Cover area -->
          <div class="relative aspect-[4/3] overflow-hidden bg-[#EFECE6]">
            <img
              v-if="book.image_url"
              :src="book.image_url"
              :alt="`Cover of ${book.title}`"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              v-else
              :class="book.bgClass"
              class="w-full h-full flex flex-col justify-between p-6 group-hover:brightness-110 transition-all duration-500"
            >
              <span class="text-[9px] font-mono uppercase tracking-widest text-white/50">
                {{ book.category?.name }}
              </span>
              <p class="font-serif text-lg text-white leading-snug line-clamp-3">
                {{ book.title }}
              </p>
            </div>
          </div>

          <!-- Card body -->
          <div class="p-5 flex flex-col gap-3 flex-1">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
                {{ book.category?.name }}
              </span>
            </div>

            <div class="flex items-center gap-1.5">
              <span
                class="w-1.5 h-1.5 rounded-full shrink-0"
                :class="stockLabel(book.stock).dot"
              ></span>
              <span class="text-[11px]" :class="stockLabel(book.stock).color">
                {{ stockLabel(book.stock).text }}
              </span>
            </div>

            <h2 class="font-serif text-xl text-[#1C1917] leading-snug line-clamp-2 group-hover:text-[#8B331A] transition-colors flex-1">
              {{ book.title }}
            </h2>

            <div class="flex items-center justify-between pt-3 border-t border-[#F0EBE1] mt-auto">
              <span class="font-serif font-bold text-base text-[#1C1917]">
                {{ formatPrice(book.sell_price) }}
              </span>
              <span class="text-xs font-semibold text-[#8B331A] group-hover:underline flex items-center gap-1">
                View Details
                <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Pagination info -->
      <div v-if="meta && meta.last_page > 1" class="mt-12 text-center text-xs text-[#A8A29E]">
        Page {{ meta.current_page }} of {{ meta.last_page }} — {{ meta.total }} titles available
      </div>

    </div>

    <AppFooter />

  </div>
</template>