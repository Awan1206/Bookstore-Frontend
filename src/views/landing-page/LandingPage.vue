<script setup>
import { useRouter } from 'vue-router'
import { useLanding } from '@/composables/landing-page/useLanding'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import CheckoutDrawer from '@/components/cart/CheckoutDrawer.vue'

const router = useRouter()

const {
  authStore,
  cartStore,
  showUserDropdown,
  showCartDrawer,
  showCheckoutDrawer,
  toggleCartDrawer,
  openCheckout,
  closeCheckoutDrawer,
  closeAll,
  categories,
  activeCategory,
  filteredBooks,
  isLoadingBooks,
  booksError,
  fetchBooks,
  newsletterEmail,
  subscribedMessage,
  handleSubscribe,
  formatPrice,
  scrollToTop,
  addToCart,   
  handleLogout,
} = useLanding()

function goTo(name, params) {
  if (router.hasRoute(name)) {
    router.push(params ? { name, params } : { name })
  } else {
    window.alert('Halaman ini belum tersedia, coba lagi nanti ya.')
  }
}

async function handleAddToCart(book) {
  const result = await addToCart(book)
  if (result?.requiresLogin) goTo('login')
}
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5] text-[#1C1917] selection:bg-[#8B331A] selection:text-white">
    <!-- TOP NAVIGATION HEADER -->
    <header class="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E3DA] transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center space-x-3 cursor-pointer group" @click="scrollToTop">
          <div class="w-9 h-9 bg-[#1C1917] text-[#FAF8F5] flex items-center justify-center rounded-sm font-serif font-bold text-lg group-hover:bg-[#8B331A] transition-colors duration-300 shadow-xs">
            F
          </div>
          <div class="flex flex-col">
            <span class="font-serif font-bold text-xl tracking-tight text-[#1C1917]">FOLIO PRESS</span>
            <span class="text-[9px] uppercase tracking-widest text-[#78716C] -mt-1 font-sans">EST. 2024 • PUBLISHING</span>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8 text-sm font-medium text-[#44403C]">
          <a href="#philosophy" class="hover:text-[#8B331A] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#8B331A] hover:after:w-full after:transition-all">Our Story</a>
          <a href="#author-focus" class="hover:text-[#8B331A] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#8B331A] hover:after:w-full after:transition-all">Journal</a>
          <a href="#catalog" class="hover:text-[#8B331A] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#8B331A] hover:after:w-full after:transition-all">Catalog</a>
          <a href="#newsletter" class="hover:text-[#8B331A] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#8B331A] hover:after:w-full after:transition-all">Contact</a>
        </nav>

        <!-- Auth Actions -->
        <div class="flex items-center space-x-3">
          <!-- Cart Icon Badge -->
          <button
            type="button"
            aria-label="Buka keranjang belanja"
            class="p-2 text-[#44403C] hover:text-[#8B331A] transition-colors relative rounded-full hover:bg-[#EAE5DC]"
            @click="toggleCartDrawer"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span
              v-if="cartStore.count > 0"
              class="absolute top-1 right-1 bg-[
            #8B331A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
            >
              {{ cartStore.count }}
            </span>
          </button>

          <!-- Logged Out Button -->
          <div v-if="!authStore.isAuthenticated" class="flex items-center space-x-2">
            <button
              type="button"
              class="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1C1917] text-[#FAF8F5] rounded-xs hover:bg-[#8B331A] transition-all shadow-xs active:scale-95 flex items-center space-x-2"
              @click="goTo('login')"
            >
              <span>Login</span>
            </button>
          </div>

          <!-- Logged In User Pill -->
          <div v-else class="relative">
            <button
              type="button"
              class="flex items-center space-x-2 px-3 py-1.5 bg-[#EAE5DC] hover:bg-[#E2DDD3] rounded-full border border-[#DCD5C9] transition-all"
              @click="showUserDropdown = !showUserDropdown"
            >
              <div class="w-7 h-7 rounded-full bg-[#8B331A] text-white flex items-center justify-center font-bold text-xs">
                {{ authStore.user?.name?.charAt(0).toUpperCase() }}
              </div>
              <span class="text-xs font-medium text-[#1C1917] max-w-[100px] truncate">{{ authStore.user?.name }}</span>
              <svg
                class="w-3.5 h-3.5 text-[#78716C] transition-transform"
                :class="showUserDropdown ? 'rotate-180' : ''"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Profile Dropdown -->
            <transition name="fade-slide">
              <div v-if="showUserDropdown" class="absolute right-0 mt-2 w-56 bg-white border border-[#E8E3DA] rounded-lg shadow-xl py-2 z-50">
                <div class="px-4 py-2 border-b border-[#F0EBE1]">
                  <p class="text-xs font-semibold text-[#1C1917] truncate">{{ authStore.user?.name }}</p>
                  <p class="text-[11px] text-[#78716C] truncate">{{ authStore.user?.email }}</p>
                  <span v-if="authStore.isAdmin" class="inline-block mt-1 px-2 py-0.5 bg-[#8B331A]/10 text-[#8B331A] font-bold text-[9px] uppercase tracking-wider rounded">
                    Admin Access
                  </span>
                </div>
                <button
                  v-if="authStore.isAdmin"
                  type="button"
                  class="w-full text-left px-4 py-2 text-xs font-bold text-[#8B331A] hover:bg-[#FAF8F5] flex items-center justify-between"
                  @click="showUserDropdown = false; goTo('admin.dashboard')"
                >
                  <span>Portal Admin Dashboard</span>
                  <span>→</span>
                </button>
                <a href="#catalog" class="block px-4 py-2 text-xs text-[#44403C] hover:bg-[#FAF8F5] hover:text-[#8B331A]" @click="showUserDropdown = false">
                  Katalog Buku
                </a>
                <button
                  type="button"
                  class="w-full text-left px-4 py-2 text-xs text-red-700 hover:bg-red-50 flex items-center justify-between"
                  @click="handleLogout"
                >
                  <span>Keluar / Logout</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </header>

    <!-- HERO SECTION -->
    <section class="relative pt-12 pb-24 lg:pt-16 lg:pb-32 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          <!-- Left Column: Copy & CTAs -->
          <div class="lg:col-span-6 space-y-6">
            <div class="inline-flex items-center space-x-2 px-3 py-1 bg-[#EAE5DC] text-[#78716C] text-xs font-semibold tracking-wider uppercase rounded-full border border-[#DFD8CC]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#8B331A]"></span>
              <span>ISSUE NO. 10 — AUTUMN CURATION</span>
            </div>

            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-serif text-[#1C1917] tracking-tight leading-[1.08]">
              Stories worth <br />
              <span class="font-serif italic font-normal text-[#8B331A] relative inline-block">
                keeping.
                <svg class="absolute -bottom-1 left-0 w-full text-[#8B331A]/30" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0,5 Q50,12 100,3" stroke="currentColor" stroke-width="2" fill="none" />
                </svg>
              </span>
            </h1>

            <p class="text-base sm:text-lg text-[#57534E] max-w-lg leading-relaxed font-sans">
              Discover physical volumes, critical monographs, and uncommon prose bound to endure beyond the digital ephemeral.
            </p>

            <div class="pt-2 flex flex-wrap items-center gap-4">
              <button
                 type="button"
                 class="px-7 py-3.5 bg-[#8B331A] text-white text-xs font-bold tracking-widest uppercase rounded-xs hover:bg-[#722813] transition-all shadow-md hover:shadow-lg active:scale-95 inline-flex items-center space-x-2"
                 @click="goTo('books.index')"
               >
                 <span>Explore Books</span>
               </button>
              <a
                href="#philosophy"
                class="px-6 py-3.5 text-xs font-bold tracking-widest uppercase text-[#1C1917] hover:text-[#8B331A] transition-colors inline-flex items-center space-x-2 group"
              >
                <span>Read the Journal</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            <div class="pt-6 border-t border-[#E8E3DA]/80 max-w-lg">
              <blockquote class="text-xs sm:text-sm text-[#78716C] italic font-serif leading-relaxed">
                "A bookstore is not merely a merchant of pages, but an architectural sanctuary for quiet contemplation."
              </blockquote>
              <cite class="block text-[10px] font-sans uppercase tracking-widest text-[#A8A29E] mt-2 not-italic font-semibold">
                — FOLIO COLOPHON, VOL. IV
              </cite>
            </div>
          </div>

          <!-- Right Column: Visual Book Composition -->
          <div class="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div class="relative w-full max-w-md aspect-4/5">

              <div class="absolute -top-4 -left-6 w-64 h-80 bg-[#1B3B2B] text-white rounded-md p-6 shadow-xl transform -rotate-6 transition-transform duration-500 hover:rotate-0 hover:z-20 border border-[#27503B]">
                <div class="text-[9px] uppercase tracking-widest opacity-60">MONOGRAPH 04</div>
                <h3 class="font-serif text-2xl font-normal mt-2 leading-snug">The Quiet Reader</h3>
                <div class="mt-20 border-t border-white/20 pt-3 text-[10px] opacity-75 font-mono">
                  Prose &amp; Essay • Vol. II
                </div>
              </div>

              <div class="absolute top-12 right-0 w-60 h-80 bg-[#EFECE6] border border-[#DDD8CE] rounded-md p-6 shadow-lg transform rotate-6 transition-transform duration-500 hover:rotate-2">
                <div class="text-[10px] font-serif uppercase tracking-widest text-[#78716C]">Essays on Architecture</div>
                <div class="mt-24 text-right">
                  <span class="font-serif italic text-3xl text-[#1C1917]">Quietude</span>
                </div>
              </div>

              <div class="absolute top-4 left-6 sm:left-12 w-72 sm:w-80 h-96 bg-white border border-[#E2DDD3] rounded-md p-8 shadow-2xl z-10 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                <div class="flex justify-between items-start">
                  <span class="text-[9px] font-bold tracking-widest uppercase text-[#8B331A] bg-[#8B331A]/10 px-2 py-0.5 rounded">AUTUMN EDITION</span>
                  <span class="font-mono text-xs text-[#A8A29E]">#010</span>
                </div>

                <div class="my-auto py-6 text-center">
                  <div class="font-serif font-extrabold text-5xl sm:text-6xl text-[#1C1917] tracking-tighter leading-none mb-2 select-none">
                    FOLIO
                  </div>
                  <div class="w-12 h-0.5 bg-[#8B331A] mx-auto my-3"></div>
                  <p class="font-serif italic text-sm text-[#57534E]">Architectural Prose &amp; Critical Essays</p>
                </div>

                <div class="bg-[#FAF8F5] border border-[#E8E3DA] rounded-full py-1.5 px-3 text-center shadow-xs">
                  <p class="text-[10px] font-medium text-[#44403C] tracking-tight">
                    Hardcover First Edition • Signed by Author
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- SECTION 2: GUIDING PHILOSOPHY -->
    <section id="philosophy" class="py-20 bg-[#F4F0E8] border-y border-[#E8E3DA]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-14">
          <div class="lg:col-span-7">
            <span class="text-xs font-bold uppercase tracking-widest text-[#8B331A]">GUIDING PHILOSOPHY</span>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1C1917] mt-2 tracking-tight">
              Literature with intention.
            </h2>
          </div>
          <div class="lg:col-span-5">
            <p class="text-sm sm:text-base text-[#57534E] leading-relaxed font-sans">
              Every physical volume admitted to our inventory undergoes rigorous tactile and literary appraisal.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div class="bg-white border border-[#E8E3DA] rounded-xl p-8 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 bg-[#F5F2EC] text-[#1C1917] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#8B331A] group-hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] block mb-1">TRUST 01</span>
              <h3 class="text-xl font-serif font-bold text-[#1C1917] mb-3">Curated Books</h3>
              <p class="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                Selected by bibliophiles and writers, ensuring every title on our shelves deserves a permanent place on yours. Never algorithmically forced.
              </p>
            </div>
            <div class="mt-8 pt-4 border-t border-[#F0EBE1]">
              <a href="#catalog" class="text-xs font-semibold text-[#8B331A] hover:underline inline-flex items-center space-x-1">
                <span>Read selection criteria</span>
              </a>
            </div>
          </div>

          <div class="bg-white border border-[#E8E3DA] rounded-xl p-8 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 bg-[#F5F2EC] text-[#1C1917] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#8B331A] group-hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] block mb-1">TRUST 02</span>
              <h3 class="text-xl font-serif font-bold text-[#1C1917] mb-3">Thoughtful Stories</h3>
              <p class="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                Diverse voices, timeless essays, and uncommon narratives that challenge established perspectives and linger quietly in the mind.
              </p>
            </div>
            <div class="mt-8 pt-4 border-t border-[#F0EBE1]">
              <a href="#catalog" class="text-xs font-semibold text-[#8B331A] hover:underline inline-flex items-center space-x-1">
                <span>Explore author dialogues</span>
              </a>
            </div>
          </div>

          <div class="bg-white border border-[#E8E3DA] rounded-xl p-8 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 bg-[#F5F2EC] text-[#1C1917] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#8B331A] group-hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] block mb-1">TRUST 03</span>
              <h3 class="text-xl font-serif font-bold text-[#1C1917] mb-3">Simple Experience</h3>
              <p class="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                Distraction-free browsing, tactile Japanese kraft packaging, carbon-neutral parcel dispatches, and effortless digital discovery.
              </p>
            </div>
            <div class="mt-8 pt-4 border-t border-[#F0EBE1]">
              <a href="#catalog" class="text-xs font-semibold text-[#8B331A] hover:underline inline-flex items-center space-x-1">
                <span>Our packaging ritual</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- SECTION 3: AUTHOR FOCUS -->
    <section id="author-focus" class="py-24 bg-[#FAF8F5]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white border border-[#E8E3DA] rounded-2xl p-8 sm:p-12 lg:p-16 shadow-sm overflow-hidden relative">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div class="lg:col-span-7 space-y-6">
              <div class="flex items-center space-x-3">
                <span class="bg-[#8B331A]/10 text-[#8B331A] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-xs">
                  AUTHOR FOCUS
                </span>
                <span class="text-xs font-mono text-[#78716C]">600 Copies Pressed</span>
              </div>

              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1C1917] leading-tight">
                Elara Vance on the Architecture of Quietude
              </h2>

              <p class="text-sm sm:text-base text-[#57534E] leading-relaxed font-sans">
                In her seminal new essay collection, Vance explores how physical spaces, bound paper, and silent reading rituals construct an antidote to contemporary cognitive noise.
              </p>

              <div class="pt-4 flex items-center space-x-6">
                <div>
                  <span class="block text-2xl font-serif font-bold text-[#1C1917]">Rp 285.000</span>
                  <span class="text-[11px] text-[#78716C]">Linen Hardcover Edition</span>
                </div>
                <button
                  type="button"
                  class="px-6 py-3 bg-[#1C1917] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#8B331A] transition-colors shadow-sm"
                  @click="handleAddToCart({ id: 99, title: 'Architecture of Quietude', price: 285000, author: 'Elara Vance', tag: 'Linen Hardcover' })"
                >
                  Pesan Edisi Khusus
                </button>
              </div>
            </div>

            <div class="lg:col-span-5 flex justify-center">
              <div class="w-full max-w-xs h-96 bg-[#2C2825] rounded-lg shadow-2xl p-8 text-white flex flex-col justify-between border border-[#44403C] relative overflow-hidden group">
                <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-[#8B331A]/30 rounded-full blur-2xl"></div>
                <div>
                  <span class="text-[9px] font-mono tracking-widest text-amber-200/70 uppercase">LIMITED EDITION</span>
                  <h4 class="font-serif text-3xl font-normal mt-4 leading-tight text-amber-100">
                    Architecture of Quietude
                  </h4>
                  <p class="text-xs text-amber-100/60 mt-2 font-serif italic">Elara Vance</p>
                </div>
                <div class="border-t border-white/10 pt-4 flex justify-between items-center text-[10px] font-mono text-white/50">
                  <span>FOLIO PRESS</span>
                  <span>2024 AUTUMN</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: CATALOG CURATION SHOWCASE -->
    <section id="catalog" class="py-24 bg-[#F4F0E8] border-t border-[#E8E3DA]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="text-center max-w-2xl mx-auto mb-16">
          <span class="text-xs font-bold uppercase tracking-widest text-[#8B331A]">CURATED COLLECTION</span>
          <h2 class="text-4xl font-serif text-[#1C1917] mt-2">Browse Available Titles</h2>
          <p class="text-sm text-[#78716C] mt-2">High quality printings bound in durable hardcover and heavy linen stock.</p>

          <div class="flex flex-wrap justify-center gap-2 mt-8">
            <button
              v-for="cat in categories"
              :key="cat.id"
              :class="activeCategory === cat.name ? 'bg-[#1C1917] text-white' : 'bg-white text-[#44403C] hover:bg-[#EAE5DC]'"
              class="px-4 py-1.5 rounded-full text-xs font-medium transition-all border border-[#E8E3DA]"
              @click="activeCategory = cat.name"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoadingBooks" class="text-center py-16 text-sm text-[#78716C]">
          Memuat daftar buku...
        </div>

        <!-- Error state -->
        <div v-else-if="booksError" class="text-center py-16">
          <p class="text-sm text-red-700">{{ booksError }}</p>
          <button
            type="button"
            class="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1C1917] text-white rounded-xs hover:bg-[#8B331A] transition-colors"
            @click="fetchBooks"
          >
            Coba Lagi
          </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredBooks.length === 0" class="text-center py-16 text-sm text-[#78716C]">
          Belum ada buku untuk kategori ini.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="book in filteredBooks"
            :key="book.id"
            class="bg-white border border-[#E8E3DA] rounded-xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div
              class="h-64 rounded-lg relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer"
              @click="goTo('books.show', { id: book.id })"
            >
              <!-- Image if available -->
              <img
                v-if="book.image_url"
                :src="book.image_url"
                :alt="book.title"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <!-- Fallback color block when no image -->
              <div
                v-else
                :class="book.bgClass"
                class="absolute inset-0 w-full h-full"
              ></div>

              <!-- Overlay content -->
              <div class="relative z-10 h-full p-6 flex flex-col justify-between text-white">
                <div class="flex justify-between items-start">
                  <span class="text-[9px] font-mono uppercase bg-black/30 px-2 py-0.5 rounded backdrop-blur-xs">
                    {{ book.category?.name }}
                  </span>
                  <span class="text-xs font-serif font-bold text-white/80">FOLIO</span>
                </div>
                <div>
                  <h4 class="font-serif text-xl font-bold leading-snug line-clamp-2 drop-shadow">{{ book.title }}</h4>
                  <p class="text-xs text-white/80 mt-1 font-serif italic drop-shadow">{{ book.author }}</p>
                </div>
                <!-- optional: darken image for text legibility -->
                <div v-if="book.image_url" class="absolute inset-0 bg-black/15 -z-10"></div>
              </div>
            </div>

            <div class="mt-4 pt-2">
              <button
                type="button"
                class="font-serif font-bold text-base text-[#1C1917] group-hover:text-[#8B331A] transition-colors line-clamp-1 block text-left"
                @click="goTo('books.show', { id: book.id })"
              >
                {{ book.title }}
              </button>
              <p class="text-xs text-[#78716C] mt-0.5">{{ book.author }}</p>

              <div class="mt-4 flex items-center justify-between pt-3 border-t border-[#F0EBE1]">
                <span class="font-bold text-sm text-[#1C1917]">Rp {{ formatPrice(book.sell_price) }}</span>
                <button
                  type="button"
                  class="px-3 py-1.5 bg-[#FAF8F5] border border-[#E8E3DA] hover:bg-[#8B331A] hover:text-white hover:border-[#8B331A] text-xs font-medium text-[#1C1917] rounded-xs transition-colors"
                  @click="handleAddToCart(book)"
                >
                  + Tambah
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- SECTION 5: NEWSLETTER DISPATCH -->
    <section id="newsletter" class="py-24 bg-[#1C1917] text-[#FAF8F5]">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <span class="text-xs font-mono uppercase tracking-widest text-[#8B331A]">FOLIO DISPATCHES</span>
        <h2 class="text-3xl sm:text-5xl font-serif mt-3 text-amber-50">
          Subscribe to our Quarterly Gazette
        </h2>
        <p class="text-sm sm:text-base text-stone-400 mt-4 max-w-xl mx-auto font-sans leading-relaxed">
          Receive exclusive monograph releases, essay previews, and invitations to intimate author conversations.
        </p>

        <form class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto" @submit.prevent="handleSubscribe">
          <label for="newsletter-email" class="sr-only">Alamat email</label>
          <input
            id="newsletter-email"
            v-model="newsletterEmail"
            type="email"
            placeholder="Masukkan email Anda..."
            required
            class="w-full px-4 py-3 bg-stone-900 border border-stone-800 rounded-xs text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#8B331A] transition-colors"
          />
          <button
            type="submit"
            class="w-full sm:w-auto px-6 py-3 bg-[#8B331A] hover:bg-[#A04024] text-white text-xs font-bold uppercase tracking-widest rounded-xs transition-colors shrink-0"
          >
            Berlangganan
          </button>
        </form>

        <p v-if="subscribedMessage" class="text-xs text-emerald-400 mt-3">
          {{ subscribedMessage }}
        </p>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-[#141211] text-stone-500 py-16 border-t border-stone-800 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10">

          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-white text-black font-serif font-bold text-xs flex items-center justify-center rounded-xs">F</div>
              <span class="font-serif font-bold text-white text-base">FOLIO PRESS</span>
            </div>
            <p class="text-stone-400 leading-relaxed">
              Architectural publishing and independent literary press dedicated to physical permanence.
            </p>
          </div>

          <div>
            <h5 class="text-stone-200 font-bold uppercase tracking-wider text-[11px] mb-4">Navigasi</h5>
            <ul class="space-y-2">
              <li><a href="#philosophy" class="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#curated" class="hover:text-white transition-colors">Curated Editions</a></li>
              <li><a href="#catalog" class="hover:text-white transition-colors">Buku &amp; Katalog</a></li>
              <li><a href="#author-focus" class="hover:text-white transition-colors">Journal</a></li>
            </ul>
          </div>

          <div>
            <h5 class="text-stone-200 font-bold uppercase tracking-wider text-[11px] mb-4">Layanan</h5>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-white transition-colors">Pengiriman Kraft</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Pengembalian</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Status Pesanan</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Keanggotaan Press</a></li>
            </ul>
          </div>

          <div>
            <h5 class="text-stone-200 font-bold uppercase tracking-wider text-[11px] mb-4">Lokasi &amp; Kontak</h5>
            <p class="text-stone-400 leading-relaxed">
              Jl. Sastra No. 10, Jakarta Selatan<br />
              redaksi@foliopress.id<br />
              +62 21 555 0192
            </p>
          </div>

        </div>

        <div class="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row justify-between items-center text-[11px]">
          <p>© 2026 FOLIO PRESS. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- CART DRAWER -->
    <CartDrawer
      :show="showCartDrawer"
      @close="showCartDrawer = false"
      @open-checkout="openCheckout"
      @require-login="goTo('login')"
    />

    <!-- CHECKOUT DRAWER (layered on top) -->
    <CheckoutDrawer
      :show="showCheckoutDrawer"
      @close="closeAll"
      @back="closeCheckoutDrawer"
    />

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.15s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>