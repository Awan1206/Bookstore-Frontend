<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['toggle-sidebar'])

const route = useRoute()
const authStore = useAuthStore()

const showUserMenu = ref(false)

// Judul halaman otomatis dari nama route
const PAGE_TITLES = {
  'admin.dashboard': 'Dashboard',
  'admin.books': 'Manajemen Buku',
  'admin.categories': 'Manajemen Kategori',
  'admin.orders': 'Manajemen Pesanan',
  'admin.users': 'Manajemen Pengguna',
  'admin.reports': 'Laporan',
  'admin.chats': 'Live Chat',
}

const pageTitle = computed(() => PAGE_TITLES[route.name] ?? 'Admin')

function closeUserMenu() {
  showUserMenu.value = false
}
</script>

<template>
  <header class="h-16 bg-white border-b border-[#E8E3DA] flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30">

    <!-- Left: toggle + breadcrumb -->
    <div class="flex items-center gap-4">
      <!-- Sidebar collapse toggle -->
      <button
        type="button"
        aria-label="Toggle sidebar"
        class="p-2 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EC] transition-colors"
        @click="emit('toggle-sidebar')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Page title -->
      <div>
        <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] leading-none">
          FOLIO PRESS — ADMIN
        </p>
        <h1 class="text-sm font-bold text-[#1C1917] mt-0.5 leading-none">
          {{ pageTitle }}
        </h1>
      </div>
    </div>

    <!-- Right: actions + user -->
    <div class="flex items-center gap-2">

      <!-- Back to site -->
      <RouterLink
        :to="{ name: 'landing' }"
        class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#78716C] hover:text-[#8B331A] border border-[#E8E3DA] hover:border-[#8B331A]/30 rounded-lg transition-all"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        <span>Lihat Toko</span>
      </RouterLink>

      <!-- Divider -->
      <div class="w-px h-6 bg-[#E8E3DA] mx-1 hidden sm:block"></div>

      <!-- User dropdown -->
      <div class="relative">
        <button
          type="button"
          class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-[#F5F2EC] transition-colors"
          @click="showUserMenu = !showUserMenu"
        >
          <div class="w-7 h-7 rounded-full bg-[#8B331A] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {{ authStore.user?.name?.charAt(0).toUpperCase() ?? 'A' }}
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-xs font-semibold text-[#1C1917] leading-none max-w-[120px] truncate">
              {{ authStore.user?.name }}
            </p>
            <p class="text-[10px] text-[#78716C] mt-0.5 leading-none">Administrator</p>
          </div>
          <svg
            class="w-3.5 h-3.5 text-[#78716C] transition-transform hidden sm:block"
            :class="showUserMenu ? 'rotate-180' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown menu -->
        <transition name="fade-slide">
          <div
            v-if="showUserMenu"
            v-click-outside="closeUserMenu"
            class="absolute right-0 mt-2 w-52 bg-white border border-[#E8E3DA] rounded-xl shadow-xl py-1.5 z-50"
          >
            <div class="px-4 py-2.5 border-b border-[#F0EBE1]">
              <p class="text-xs font-bold text-[#1C1917] truncate">{{ authStore.user?.name }}</p>
              <p class="text-[11px] text-[#78716C] truncate mt-0.5">{{ authStore.user?.email }}</p>
              <span class="inline-block mt-1.5 px-2 py-0.5 bg-[#8B331A]/10 text-[#8B331A] font-bold text-[9px] uppercase tracking-wider rounded">
                Administrator
              </span>
            </div>

            <button
              type="button"
              class="w-full flex items-center justify-between px-4 py-2 text-xs text-red-700 hover:bg-red-50 transition-colors mt-1"
              @click="authStore.logout(); closeUserMenu()"
            >
              <span>Keluar / Logout</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.15s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>